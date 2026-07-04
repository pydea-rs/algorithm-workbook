/* ============================================================
   runner-worker.js — Web Worker that executes user Python + JS.

   Why a worker:
     User code runs OFF the main thread. If it hangs (infinite
     loop, runaway recursion) the main UI stays responsive and
     runner.js can `worker.terminate()` to kill the runaway in
     one syscall. After termination, the next run spawns a fresh
     worker (Pyodide re-loads lazily — only the user who actually
     timed out pays that cost).
============================================================ */

"use strict";

const PYODIDE_VERSION = "0.27.0";
const PYODIDE_INDEX = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodide = null;
let pyodideLoading = null;

async function ensurePyodide() {
  if (pyodide) return pyodide;
  if (pyodideLoading) return pyodideLoading;
  pyodideLoading = (async () => {
    importScripts(PYODIDE_INDEX + "pyodide.js");
    // eslint-disable-next-line no-undef
    pyodide = await loadPyodide({ indexURL: PYODIDE_INDEX });
    return pyodide;
  })().catch((err) => {
    pyodideLoading = null;
    throw err;
  });
  return pyodideLoading;
}

// ---------- Equality helpers (mirror of runner.js) ----------
function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== typeof b) return false;
  if (typeof a === "number" && typeof b === "number") {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
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
  if (!Array.isArray(a) || !Array.isArray(b)) return deepEqual(a, b);
  if (a.length !== b.length) return false;
  const sa = [...a].map((x) => JSON.stringify(x)).sort();
  const sb = [...b].map((x) => JSON.stringify(x)).sort();
  return sa.every((v, i) => v === sb[i]);
}
function sortedListEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  const norm = (x) => JSON.stringify([...x].sort((p, q) =>
    JSON.stringify(p).localeCompare(JSON.stringify(q))
  ));
  return norm(a) === norm(b);
}
function checkEquality(actual, expected, mode) {
  switch (mode) {
    case "set":         return setEqual(actual, expected);
    case "sorted-list": return sortedListEqual(actual, expected);
    case "exact":
    default:            return deepEqual(actual, expected);
  }
}

// ---------- Python helpers (loaded into Pyodide per run) ----------
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
    if not arr: return None
    head = ListNode(arr[0]); cur = head
    for x in arr[1:]:
        cur.next = ListNode(x); cur = cur.next
    return head

def _build_list_with_cycle(arr, pos):
    if not arr: return None
    head = ListNode(arr[0]); cur = head; nodes = [head]
    for x in arr[1:]:
        cur.next = ListNode(x); cur = cur.next; nodes.append(cur)
    if pos >= 0 and pos < len(nodes):
        cur.next = nodes[pos]
    return head

def _linked_to_list(head):
    out = []; seen = set(); cur = head; n = 0
    while cur is not None and n < 10000:
        if id(cur) in seen:
            out.append("CYCLE@" + str(cur.val))
            break
        seen.add(id(cur)); out.append(cur.val); cur = cur.next; n += 1
    return out

def _tree_to_level(root):
    if root is None: return []
    out = []; q = deque([root])
    while q:
        node = q.popleft()
        if node is None:
            out.append(None); continue
        out.append(node.val); q.append(node.left); q.append(node.right)
    while out and out[-1] is None: out.pop()
    return out
`;

function stripPyError(e) {
  const msg = (e && e.message) ? e.message : String(e);
  const lines = msg.split("\n").map((l) => l.trim()).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^[A-Z][A-Za-z]*Error: /.test(lines[i])) return lines[i];
  }
  return lines[lines.length - 1] || "Unknown error";
}

async function runPythonTests(userCode, functionName, testCases) {
  const py = await ensurePyodide();
  const results = [];

  try {
    py.runPython(HELPERS_PY);
  } catch (e) {
    throw new Error("Internal helper init failed: " + (e.message || e));
  }

  let definitionError = null;
  try {
    py.runPython(userCode);
  } catch (e) {
    definitionError = stripPyError(e);
  }

  if (definitionError) {
    for (const tc of testCases) {
      results.push({
        passed: false, error: definitionError,
        input: tc.args, expected: tc.expected, actual: null,
      });
    }
    return results;
  }

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
    let jsActual = null;
    let err = null;

    try {
      py.globals.set("__args_json__", JSON.stringify(tc.args));
      py.runPython(
        "import json as _j\n" +
        "args = _j.loads(__args_json__)\n"
      );
      if (tc.prepare) py.runPython(tc.prepare);
      if (!tc.skipCall) py.runPython(`result = ${functionName}(*args)`);
      if (tc.transform) py.runPython(tc.transform);
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
      passed, error: err,
      input: tc.args, expected: tc.expected, actual: jsActual, equality,
    });
  }

  return results;
}

// ---------- JS runner (mirror of main-thread version, but in worker) ----------
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
  const q = [root]; let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift();
    if (i < arr.length && arr[i] !== null) { node.left = new TreeNode(arr[i]); q.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]); q.push(node.right); }
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
  for (let i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
  return head;
}
function _build_list_with_cycle(arr, pos) {
  if (!arr || !arr.length) return null;
  const head = new ListNode(arr[0]);
  let cur = head; const nodes = [head];
  for (let i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; nodes.push(cur); }
  if (pos >= 0 && pos < nodes.length) cur.next = nodes[pos];
  return head;
}
function _linked_to_list(head) {
  const out = []; const seen = new Set();
  let cur = head, n = 0;
  while (cur !== null && cur !== undefined && n < 10000) {
    if (seen.has(cur)) { out.push('CYCLE@' + cur.val); break; }
    seen.add(cur); out.push(cur.val); cur = cur.next; n++;
  }
  return out;
}
function _tree_to_level(root) {
  if (!root) return [];
  const out = []; const q = [root];
  while (q.length) {
    const node = q.shift();
    if (node === null) { out.push(null); continue; }
    out.push(node.val); q.push(node.left); q.push(node.right);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
`;

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
  if (/is not defined/.test(msg) && /^[A-Z]/.test(msg)) {
    return msg.replace(/^.*?(\w+) is not defined.*$/, "$1 is not defined");
  }
  return msg.split("\n")[0];
}

function runJsTests(userCode, functionName, testCases) {
  const results = [];
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const equality = tc.equality || "exact";
    const prepareCode = tc.prepareJs || "";
    const transformCode = tc.transformJs || "";
    const skipCall = !!tc.skipCall;
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
      actual = JSON.parse(JSON.stringify(rawResult, makeReplacer()));
    } catch (e) {
      err = stripJsError(e);
    }
    const passed = !err && checkEquality(actual, tc.expected, equality);
    results.push({
      passed, error: err,
      input: tc.args, expected: tc.expected, actual, equality,
    });
  }
  return results;
}

// ---------- Message dispatch ----------
self.onmessage = async (e) => {
  const { type, requestId } = e.data;
  try {
    if (type === "ensure-python") {
      await ensurePyodide();
      self.postMessage({ requestId, type: "ready" });
      return;
    }
    if (type === "run-python") {
      const results = await runPythonTests(e.data.code, e.data.fn, e.data.tests);
      self.postMessage({ requestId, type: "result", results });
      return;
    }
    if (type === "run-js") {
      const results = runJsTests(e.data.code, e.data.fn, e.data.tests);
      self.postMessage({ requestId, type: "result", results });
      return;
    }
    self.postMessage({ requestId, type: "error", message: "Unknown message type: " + type });
  } catch (err) {
    self.postMessage({
      requestId,
      type: "error",
      message: (err && err.message) ? err.message : String(err),
    });
  }
};
