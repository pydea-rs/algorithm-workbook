/* ============================================================
   runner.js — Pyodide loader + test harness
   Loads Python 3 in the browser via WebAssembly (Pyodide).
   No data leaves the user's machine.
============================================================ */

(function (global) {
  "use strict";

  const PYODIDE_VERSION = "0.27.0";
  const PYODIDE_INDEX = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

  // ---------- State ----------
  let pyodide = null;
  let loadingPromise = null;
  let statusEl = null;

  function setStatus(state, label) {
    if (!statusEl) statusEl = document.getElementById("pyodide-status");
    if (!statusEl) return;
    statusEl.className = "status-pill status-" + state;
    statusEl.textContent = label;
  }

  // ---------- Inject Pyodide script tag on demand ----------
  function loadPyodideScript() {
    return new Promise((resolve, reject) => {
      if (global.loadPyodide) return resolve();
      const s = document.createElement("script");
      s.src = PYODIDE_INDEX + "pyodide.js";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () =>
        reject(new Error("Failed to fetch Pyodide. Are you offline?"));
      document.head.appendChild(s);
    });
  }

  async function ensurePyodide() {
    if (pyodide) return pyodide;
    if (loadingPromise) return loadingPromise;

    setStatus("loading", "Python: loading…");
    loadingPromise = (async () => {
      await loadPyodideScript();
      pyodide = await global.loadPyodide({ indexURL: PYODIDE_INDEX });
      setStatus("ready", "Python: ready");
      return pyodide;
    })().catch((err) => {
      setStatus("error", "Python: failed");
      loadingPromise = null;
      throw err;
    });

    return loadingPromise;
  }

  // ---------- Equality helpers ----------
  // For results that should compare as multisets (e.g., two-sum indices).
  function deepEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return a === b;
    if (typeof a !== typeof b) return false;
    if (typeof a === "number" && typeof b === "number") {
      if (Number.isNaN(a) && Number.isNaN(b)) return true;
      // Tolerate tiny float diffs in mathematical answers
      if (!Number.isInteger(a) || !Number.isInteger(b)) {
        return Math.abs(a - b) < 1e-5;
      }
      return a === b;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    if (typeof a === "object" && typeof b === "object") {
      const ka = Object.keys(a), kb = Object.keys(b);
      if (ka.length !== kb.length) return false;
      for (const k of ka) {
        if (!deepEqual(a[k], b[k])) return false;
      }
      return true;
    }
    return false;
  }

  function setEqual(a, b) {
    // Compare as multisets: useful for two-sum (indices may come in any order)
    if (!Array.isArray(a) || !Array.isArray(b)) return deepEqual(a, b);
    if (a.length !== b.length) return false;
    const sa = [...a].map((x) => JSON.stringify(x)).sort();
    const sb = [...b].map((x) => JSON.stringify(x)).sort();
    return sa.every((v, i) => v === sb[i]);
  }

  function sortedListEqual(a, b) {
    // Compare as if both were sorted lists. For unordered list-of-lists.
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    const norm = (x) => JSON.stringify([...x].sort((p, q) =>
      JSON.stringify(p).localeCompare(JSON.stringify(q))
    ));
    return norm(a) === norm(b);
  }

  function checkEquality(actual, expected, mode) {
    switch (mode) {
      case "set": return setEqual(actual, expected);
      case "sorted-list": return sortedListEqual(actual, expected);
      case "exact":
      default: return deepEqual(actual, expected);
    }
  }

  // ---------- Python helpers script ----------
  // Injected once per fresh module run. Provides helpers for trees/lists.
  const HELPERS_PY = `
import sys, json
from collections import deque

class TreeNode:
    __slots__ = ("val","left","right")
    def __init__(self, val=0, left=None, right=None):
        self.val = val; self.left = left; self.right = right
    def __repr__(self):
        return f"TreeNode({self.val})"

class ListNode:
    __slots__ = ("val","next")
    def __init__(self, val=0, nxt=None):
        self.val = val; self.next = nxt
    def __repr__(self):
        return f"ListNode({self.val})"

def _build_tree(arr):
    """Build a binary tree from level-order list with None for missing."""
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0]); q = deque([root]); i = 1
    while q and i < len(arr):
        node = q.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i]); q.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i]); q.append(node.right)
        i += 1
    return root

def _find_node(root, val):
    if root is None: return None
    if root.val == val: return root
    return _find_node(root.left, val) or _find_node(root.right, val)

def _build_list(arr):
    """Build a singly linked list from a Python list."""
    if not arr: return None
    head = ListNode(arr[0]); cur = head
    for x in arr[1:]:
        cur.next = ListNode(x); cur = cur.next
    return head

def _build_list_with_cycle(arr, pos):
    """Build a linked list with a cycle reconnecting tail to index pos. -1 = no cycle."""
    if not arr: return None
    head = ListNode(arr[0]); cur = head; nodes = [head]
    for x in arr[1:]:
        cur.next = ListNode(x); cur = cur.next; nodes.append(cur)
    if pos >= 0 and pos < len(nodes):
        cur.next = nodes[pos]
    return head

def _linked_to_list(head):
    """Serialize a linked list back to a Python list (cycle-safe up to 10000)."""
    out = []; seen = set(); cur = head; n = 0
    while cur is not None and n < 10000:
        if id(cur) in seen:
            out.append("CYCLE@" + str(cur.val))
            break
        seen.add(id(cur)); out.append(cur.val); cur = cur.next; n += 1
    return out

def _tree_to_level(root):
    """Serialize a binary tree to a level-order list with None placeholders."""
    if root is None: return []
    out = []; q = deque([root])
    while q:
        node = q.popleft()
        if node is None:
            out.append(None); continue
        out.append(node.val); q.append(node.left); q.append(node.right)
    # Trim trailing Nones
    while out and out[-1] is None: out.pop()
    return out
`;

  // ---------- Test runner ----------
  /**
   * Run a Python function from `userCode` against an array of test cases.
   *
   * @param {string} userCode      Raw Python source defining `functionName`.
   * @param {string} functionName  Name of the function to invoke.
   * @param {Array}  testCases     Each: {args, expected, equality?, prepare?, transform?}
   * @returns {Promise<Array>}     Per-case results: {passed, error?, input, expected, actual}
   *
   * Test case fields:
   *   args        — array passed positionally to the user's function
   *   expected    — value to compare against (after optional transform)
   *   equality    — "exact" (default), "set", or "sorted-list"
   *   prepare     — Python source executed BEFORE the call (builds trees, etc.)
   *                 Uses `args` as the in-scope variable list and may rebind it.
   *   transform   — Python source applied to the function's result before comparison
   *                 (e.g., serialize a linked list back to array). Receives `result`.
   *   timeoutMs   — soft timeout per case (default 4000)
   *
   * NOTE: We do NOT show actual values by default — the caller decides when to reveal.
   */
  async function runTests(userCode, functionName, testCases) {
    const py = await ensurePyodide();
    const results = [];

    // Define helpers + user code in fresh namespace.
    // We use a global scope so the user can call helpers if they wish.
    try {
      py.runPython(HELPERS_PY);
    } catch (e) {
      // helpers should never fail; surface clearly
      throw new Error("Internal helper init failed: " + e.message);
    }

    let definitionError = null;
    try {
      py.runPython(userCode);
    } catch (e) {
      definitionError = stripPyError(e);
    }

    if (definitionError) {
      // All cases fail with the same error
      for (const tc of testCases) {
        results.push({
          passed: false,
          error: definitionError,
          input: tc.args,
          expected: tc.expected,
          actual: null,
        });
      }
      return results;
    }

    // Ensure the function exists
    const fnHandle = py.globals.get(functionName);
    if (!fnHandle) {
      const err = `Function '${functionName}' not defined.`;
      for (const tc of testCases) {
        results.push({
          passed: false, error: err,
          input: tc.args, expected: tc.expected, actual: null,
        });
      }
      return results;
    }
    try { fnHandle.destroy && fnHandle.destroy(); } catch (_) {}

    for (let idx = 0; idx < testCases.length; idx++) {
      const tc = testCases[idx];
      const equality = tc.equality || "exact";
      let pyResult = null;
      let jsActual = null;
      let err = null;

      try {
        // Push args into globals as JSON to avoid proxy quirks.
        py.globals.set("__args_json__", JSON.stringify(tc.args));
        py.runPython(
          "import json as _j\n" +
          "args = _j.loads(__args_json__)\n"
        );
        if (tc.prepare) py.runPython(tc.prepare);

        // Call the function with whatever `args` is now (possibly rewritten by prepare).
        // skipCall=true lets prepare populate `result` itself — used for class-based
        // questions (e.g. Implement Trie) where we run a sequence of operations.
        if (!tc.skipCall) {
          py.runPython(`result = ${functionName}(*args)`);
        }

        if (tc.transform) py.runPython(tc.transform);

        // Serialize result back to JSON to drop proxies.
        py.runPython(
          "import json as _j\n" +
          "try:\n" +
          "    __out__ = _j.dumps(result, default=str)\n" +
          "except Exception as _e:\n" +
          "    __out__ = _j.dumps(repr(result))\n"
        );
        const outJson = py.globals.get("__out__");
        jsActual = JSON.parse(outJson);
      } catch (e) {
        err = stripPyError(e);
      }

      const passed = !err && checkEquality(jsActual, tc.expected, equality);
      results.push({
        passed,
        error: err,
        input: tc.args,
        expected: tc.expected,
        actual: jsActual,
        equality,
      });
    }

    return results;
  }

  // Pyodide errors include a stack from C wrappers; trim to the Python message.
  function stripPyError(e) {
    const msg = (e && e.message) ? e.message : String(e);
    // Pyodide prints "PythonError: Traceback..." — keep just the last
    // "ExceptionName: detail" line.
    const lines = msg.split("\n").map((l) => l.trim()).filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      if (/^[A-Z][A-Za-z]*Error: /.test(lines[i])) return lines[i];
    }
    return lines[lines.length - 1] || "Unknown error";
  }

  // =================================================================
  //                       JAVASCRIPT RUNNER
  // =================================================================
  // Runs user JS synchronously in a fresh `Function`-scoped sandbox.
  // Pros: no Pyodide load, instant; same equality semantics.
  // Cons: NO infinite-loop timeout (Function calls block the main
  // thread). Users with infinite loops must refresh — progress
  // survives in localStorage.

  const HELPERS_JS = `
class TreeNode {
  constructor(val=0, left=null, right=null) {
    this.val = val; this.left = left; this.right = right;
  }
}
class ListNode {
  constructor(val=0, next=null) {
    this.val = val; this.next = next;
  }
}
function _build_tree(arr) {
  if (!arr || !arr.length || arr[0] === null) return null;
  const root = new TreeNode(arr[0]);
  const q = [root];
  let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift();
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]); q.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]); q.push(node.right);
    }
    i++;
  }
  return root;
}
function _find_node(root, val) {
  if (root === null) return null;
  if (root.val === val) return root;
  return _find_node(root.left, val) || _find_node(root.right, val);
}
function _build_list(arr) {
  if (!arr || !arr.length) return null;
  const head = new ListNode(arr[0]);
  let cur = head;
  for (let i = 1; i < arr.length; i++) {
    cur.next = new ListNode(arr[i]); cur = cur.next;
  }
  return head;
}
function _build_list_with_cycle(arr, pos) {
  if (!arr || !arr.length) return null;
  const head = new ListNode(arr[0]);
  let cur = head;
  const nodes = [head];
  for (let i = 1; i < arr.length; i++) {
    cur.next = new ListNode(arr[i]); cur = cur.next; nodes.push(cur);
  }
  if (pos >= 0 && pos < nodes.length) cur.next = nodes[pos];
  return head;
}
function _linked_to_list(head) {
  const out = [];
  const seen = new Set();
  let cur = head, n = 0;
  while (cur !== null && cur !== undefined && n < 10000) {
    if (seen.has(cur)) { out.push('CYCLE@' + cur.val); break; }
    seen.add(cur);
    out.push(cur.val);
    cur = cur.next;
    n++;
  }
  return out;
}
function _tree_to_level(root) {
  if (!root) return [];
  const out = [];
  const q = [root];
  while (q.length) {
    const node = q.shift();
    if (node === null) { out.push(null); continue; }
    out.push(node.val);
    q.push(node.left); q.push(node.right);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
`;

  /**
   * Run JS tests for a single question.
   * @param {string} userCode - Source defining the target function or class.
   * @param {string} functionName - Top-level name the harness will call.
   * @param {Array}  testCases - {args, expected, equality?, prepareJs?, transformJs?, skipCall?}
   */
  async function runTestsJs(userCode, functionName, testCases) {
    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const equality = tc.equality || "exact";
      const prepareCode = tc.prepareJs || "";
      const transformCode = tc.transformJs || "";
      const skipCall = !!tc.skipCall;

      // Build the test script. JSON-serialise args so the test gets a
      // FRESH copy each run (important for in-place mutators like Q12/Q23).
      const argsLiteral = JSON.stringify(tc.args);
      const callLine = skipCall ? "" : `result = ${functionName}(...args);`;
      const script = `
"use strict";
${HELPERS_JS}
${userCode}
var args = JSON.parse(${JSON.stringify(argsLiteral)});
var result;
${prepareCode}
${callLine}
${transformCode}
return result === undefined ? null : result;
`;

      let actual = null;
      let err = null;
      try {
        const rawResult = new Function(script)();
        // Drop class instances (TreeNode/ListNode) to plain JSON so equality
        // works the same way as on Python's JSON round-trip.
        actual = JSON.parse(JSON.stringify(rawResult, makeReplacer()));
      } catch (e) {
        err = stripJsError(e);
      }

      const passed = !err && checkEquality(actual, tc.expected, equality);
      results.push({
        passed,
        error: err,
        input: tc.args,
        expected: tc.expected,
        actual,
        equality,
      });
    }

    return results;
  }

  // Cycle-safe JSON replacer (prevents stringify on a TreeNode/ListNode
  // cycle from throwing). We don't expect cycles in answers, but a
  // returned cyclic list would crash without this.
  function makeReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
      if (value && typeof value === "object") {
        if (seen.has(value)) return undefined;
        seen.add(value);
      }
      return value;
    };
  }

  function stripJsError(e) {
    const msg = (e && e.message) ? e.message : String(e);
    // For ReferenceError on the function name, give a friendlier message.
    if (/is not defined/.test(msg) && /^[A-Z]/.test(msg)) {
      return msg.replace(/^.*?(\w+) is not defined.*$/, "$1 is not defined");
    }
    return msg.split("\n")[0];
  }

  // ---------- Public API ----------
  global.Runner = {
    ensurePyodide,
    runTests,        // Python via Pyodide
    runTestsJs,      // JavaScript native
    checkEquality,
    deepEqual,
    setStatus,
  };
})(window);
