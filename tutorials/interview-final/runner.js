/* ============================================================
   runner.js — main-thread harness.
   Python + JS execution is delegated to runner-worker.js so a
   runaway user program (infinite loop, deep recursion) can be
   killed with worker.terminate() without freezing the UI. Each
   `runTests` / `runTestsJs` call has a generous but FINITE
   timeout; on overshoot the worker is killed, a fresh one is
   spawned for the next run, and the user sees a clear "Execution
   timed out" message instead of an indefinite hang.

   SQL execution stays on the main thread: sql.js is fast, our
   fixtures are tiny, and SQLite has no user-controlled
   infinite-loop construct in the queries we accept.

   No data leaves the user's machine.
============================================================ */

(function (global) {
  "use strict";

  // ---------- Timeout budgets ----------
  // Generous enough for legitimate brute-force solutions on our test sizes,
  // tight enough that an infinite loop feels like an error, not a freeze.
  const PYODIDE_LOAD_TIMEOUT_MS  = 60000;        // first-time Pyodide download + init
  const PY_TIMEOUT_MS = (n) => 4000 + n * 2500;  // ~4s base + 2.5s per test case
  const JS_TIMEOUT_MS = (n) => 1500 + n * 700;   // JS is microsecond-fast; tight is fine

  // ---------- Status pill ----------
  let statusEl = null;
  function setStatus(state, label) {
    if (!statusEl) statusEl = document.getElementById("pyodide-status");
    if (!statusEl) return;
    statusEl.className = "status-pill status-" + state;
    statusEl.textContent = label;
  }

  // ---------- Worker management ----------
  let worker = null;
  let nextReqId = 1;
  let pyodideKnownReady = false;
  const pending = new Map();   // requestId -> {resolve, reject, timer, type}

  function spawnWorker() {
    pyodideKnownReady = false;
    worker = new Worker("runner-worker.js");
    worker.onmessage = (e) => {
      const { requestId, type } = e.data;
      const p = pending.get(requestId);
      if (!p) return;
      pending.delete(requestId);
      clearTimeout(p.timer);
      if (type === "result" || type === "ready") {
        if (p.type === "run-python" || p.type === "ensure-python") {
          pyodideKnownReady = true;
          setStatus("ready", "Python: ready");
        }
        p.resolve(e.data);
      } else if (type === "error") {
        if (p.type === "ensure-python") setStatus("error", "Python: failed");
        p.reject(new Error(e.data.message || "Worker error"));
      } else {
        p.reject(new Error("Worker sent unknown message: " + type));
      }
    };
    worker.onerror = (e) => {
      const msg = e && e.message ? e.message : "Worker crashed";
      for (const [, p] of pending) {
        clearTimeout(p.timer);
        p.reject(new Error(msg));
      }
      pending.clear();
      try { worker.terminate(); } catch (_) {}
      worker = null;
      pyodideKnownReady = false;
      setStatus("error", "Python: crashed");
    };
  }

  // Kill the runaway worker, reject every in-flight request, and prep a
  // fresh worker for the NEXT call (we don't spawn it eagerly — Pyodide
  // load is the most expensive part, so we defer to the next user action).
  function killWorker(reasonMsg) {
    if (worker) {
      try { worker.terminate(); } catch (_) {}
    }
    worker = null;
    pyodideKnownReady = false;
    setStatus("idle", "Python: not loaded");
    for (const [, p] of pending) {
      clearTimeout(p.timer);
      p.reject(new Error(reasonMsg));
    }
    pending.clear();
  }

  function send(type, payload, timeoutMs) {
    if (!worker) spawnWorker();
    return new Promise((resolve, reject) => {
      const requestId = nextReqId++;
      const timer = setTimeout(() => {
        pending.delete(requestId);
        killWorker(`Execution timed out after ${Math.round(timeoutMs / 1000)}s — likely infinite loop. Check your loop conditions or recursion.`);
        reject(new Error(`Execution timed out after ${Math.round(timeoutMs / 1000)}s — likely infinite loop.`));
      }, timeoutMs);
      pending.set(requestId, { resolve, reject, timer, type });
      worker.postMessage({ type, requestId, ...payload });
    });
  }

  // ---------- Public Python helpers ----------
  async function ensurePyodide() {
    if (pyodideKnownReady && worker) return;
    if (!pyodideKnownReady) setStatus("loading", "Python: loading…");
    try {
      await send("ensure-python", {}, PYODIDE_LOAD_TIMEOUT_MS);
    } catch (e) {
      setStatus("error", "Python: failed");
      throw e;
    }
  }

  // Fabricate a failure result-set so the caller's render path
  // works the same way whether tests ran or were killed.
  function timeoutResults(testCases, message) {
    return testCases.map((tc) => ({
      passed: false,
      error: message,
      input: tc.args,
      expected: tc.expected,
      actual: null,
    }));
  }

  async function runTests(userCode, functionName, testCases) {
    // Pre-load Pyodide with its own generous budget so a cold start
    // doesn't eat into the test-execution budget.
    try {
      await ensurePyodide();
    } catch (e) {
      return timeoutResults(testCases, e.message || String(e));
    }
    const timeoutMs = PY_TIMEOUT_MS(testCases.length);
    try {
      const out = await send("run-python", {
        code: userCode, fn: functionName, tests: testCases,
      }, timeoutMs);
      return out.results;
    } catch (e) {
      return timeoutResults(testCases, e.message || String(e));
    }
  }

  async function runTestsJs(userCode, functionName, testCases) {
    const timeoutMs = JS_TIMEOUT_MS(testCases.length);
    try {
      const out = await send("run-js", {
        code: userCode, fn: functionName, tests: testCases,
      }, timeoutMs);
      return out.results;
    } catch (e) {
      return timeoutResults(testCases, e.message || String(e));
    }
  }

  // ---------- Equality helpers (kept on the public API) ----------
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

  // =================================================================
  //                            SQL RUNNER
  // =================================================================
  // Stays on the main thread: sql.js fixtures are tiny, queries are
  // bounded, and there's no user-controlled infinite-loop construct
  // in the SQL we accept.

  const SQLJS_VERSION = "1.10.3";
  const SQLJS_CDN = `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist/`;

  let sqlEngine = null;
  let sqlLoadingPromise = null;

  function loadSqlJsScript() {
    return new Promise((resolve, reject) => {
      if (global.initSqlJs) return resolve();
      const s = document.createElement("script");
      s.src = SQLJS_CDN + "sql-wasm.js";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () =>
        reject(new Error("Failed to fetch sql.js. Are you offline?"));
      document.head.appendChild(s);
    });
  }

  async function ensureSqlJs() {
    if (sqlEngine) return sqlEngine;
    if (sqlLoadingPromise) return sqlLoadingPromise;

    sqlLoadingPromise = (async () => {
      await loadSqlJsScript();
      sqlEngine = await global.initSqlJs({
        locateFile: (file) => SQLJS_CDN + file,
      });
      return sqlEngine;
    })().catch((err) => {
      sqlLoadingPromise = null;
      throw err;
    });

    return sqlLoadingPromise;
  }

  function normalizeSqlValue(v) {
    if (v === null || v === undefined) return null;
    if (typeof v === "number") return v;
    if (typeof v === "bigint") return Number(v);
    if (typeof v === "string") {
      if (/^-?\d+(\.\d+)?$/.test(v.trim())) return Number(v);
      return v;
    }
    if (v instanceof Uint8Array) {
      return Array.from(v).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    return v;
  }

  function compareSqlResults(actual, expected, orderMatters) {
    if (!actual || !expected) return false;
    const ac = (actual.columns || []).map(String);
    const ec = (expected.columns || []).map(String);
    if (ac.length !== ec.length) return false;
    const acSorted = [...ac].sort();
    const ecSorted = [...ec].sort();
    if (!acSorted.every((c, i) => c === ecSorted[i])) return false;

    const colIndex = ec.map((c) => ac.indexOf(c));
    if (colIndex.some((i) => i < 0)) return false;
    const reorder = (row) => colIndex.map((i) => normalizeSqlValue(row[i]));

    const A = (actual.rows || []).map(reorder);
    const E = (expected.rows || []).map((r) => r.map(normalizeSqlValue));
    if (A.length !== E.length) return false;

    const rowEq = (a, b) => {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (typeof a[i] === "number" && typeof b[i] === "number") {
          if (!Number.isFinite(a[i]) || !Number.isFinite(b[i])) {
            if (a[i] !== b[i]) return false;
          } else if (Math.abs(a[i] - b[i]) > 1e-9) {
            return false;
          }
        } else if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    };

    if (orderMatters) {
      for (let i = 0; i < E.length; i++) {
        if (!rowEq(A[i], E[i])) return false;
      }
      return true;
    }

    const used = new Array(A.length).fill(false);
    for (const er of E) {
      let found = -1;
      for (let j = 0; j < A.length; j++) {
        if (!used[j] && rowEq(A[j], er)) { found = j; break; }
      }
      if (found < 0) return false;
      used[found] = true;
    }
    return true;
  }

  async function runSql(userSql, schema, testCases) {
    const SQL = await ensureSqlJs();
    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const orderMatters = !!tc.orderMatters;
      let db = null;
      let actual = null;
      let err = null;

      try {
        db = new SQL.Database();
        const setupSql = (tc.schema && tc.schema.trim()) ? tc.schema : schema;
        if (setupSql && setupSql.trim()) db.exec(setupSql);
        const stmts = db.exec(userSql);
        const nonEmpty = stmts.filter((s) => s && s.columns && s.columns.length);
        const last = nonEmpty.length ? nonEmpty[nonEmpty.length - 1] : { columns: [], values: [] };
        actual = { columns: last.columns || [], rows: last.values || [] };
      } catch (e) {
        err = (e && e.message) ? e.message : String(e);
      } finally {
        if (db) try { db.close(); } catch (_) {}
      }

      const passed = !err && compareSqlResults(actual, tc.expected, orderMatters);
      results.push({
        passed,
        error: err,
        input: tc.name || `Test ${i + 1}`,
        expected: tc.expected,
        actual,
        equality: orderMatters ? "ordered" : "unordered",
        kind: "sql",
      });
    }

    return results;
  }

  // ---------- Public API ----------
  global.Runner = {
    ensurePyodide,
    runTests,
    runTestsJs,
    ensureSqlJs,
    runSql,
    compareSqlResults,
    checkEquality,
    deepEqual,
    setStatus,
  };
})(window);
