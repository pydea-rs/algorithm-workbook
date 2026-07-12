/**
 * Last Review — lightweight syntax highlighter.
 *
 * A dependency-free tokenizer for Python, SQL and JavaScript that colours
 * keywords, strings, numbers, comments, functions, classes and built-ins
 * using the app's exclusive palette.
 */
(function () {
  "use strict";

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function wrap(type, text) {
    return '<span class="sh-' + type + '">' + escapeHtml(text) + "</span>";
  }

  // Shared token categories -------------------------------------------------
  const NUMBER = /^(?:0[xX][0-9a-fA-F]+|0[oO]?[0-7]+|0[bB][01]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/;
  const WORD = /^[A-Za-z_]\w*/;
  const SPACE = /^\s+/;
  const OTHER = /^./;

  const PY_KEYWORDS = new Set([
    "def", "class", "if", "else", "elif", "for", "while", "return", "import",
    "from", "as", "with", "try", "except", "finally", "raise", "yield", "lambda",
    "pass", "break", "continue", "and", "or", "not", "in", "is", "True", "False",
    "None", "nonlocal", "global", "assert", "del", "async", "await",
  ]);

  const PY_BUILTINS = new Set([
    "len", "range", "print", "int", "str", "list", "dict", "set", "tuple",
    "enumerate", "zip", "sorted", "reversed", "sum", "min", "max", "any", "all",
    "map", "filter", "abs", "round", "pow", "divmod", "chr", "ord", "bin", "hex",
    "oct", "format", "open", "input", "isinstance", "hasattr", "getattr", "super",
    "staticmethod", "classmethod", "property", "type", "object", "float", "bool",
    "vars", "globals", "locals", "dir", "help", "repr", "eval", "exec", "compile",
    "bytes", "bytearray", "memoryview", "frozenset", "iter", "next", "slice",
  ]);

  const PY_TYPES = new Set([
    "Counter", "deque", "defaultdict", "OrderedDict", "ListNode", "TreeNode",
    "MinHeap", "Node", "Graph",
  ]);

  const JS_KEYWORDS = new Set([
    "const", "let", "var", "function", "return", "if", "else", "for", "while",
    "do", "switch", "case", "break", "continue", "try", "catch", "finally",
    "throw", "new", "this", "class", "extends", "super", "import", "export",
    "from", "default", "async", "await", "yield", "typeof", "instanceof", "in",
    "of", "true", "false", "null", "undefined", "void", "delete", "debugger", "with",
  ]);

  const JS_BUILTINS = new Set([
    "console", "Math", "JSON", "Object", "Array", "String", "Number", "Boolean",
    "Date", "RegExp", "Map", "Set", "Promise", "WeakMap", "WeakSet", "Symbol",
    "BigInt", "parseInt", "parseFloat", "isNaN", "isFinite", "setTimeout",
    "setInterval", "clearTimeout", "clearInterval", "document", "window",
    "navigator", "localStorage", "sessionStorage", "fetch", "require", "module",
    "exports", "process",
  ]);

  const SQL_KEYWORDS = new Set([
    "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "FULL",
    "ON", "GROUP", "BY", "HAVING", "ORDER", "LIMIT", "OFFSET", "UNION", "ALL",
    "DISTINCT", "AS", "CASE", "WHEN", "THEN", "ELSE", "END", "IF", "NULL", "IS",
    "NOT", "IN", "EXISTS", "BETWEEN", "LIKE", "AND", "OR", "WITH", "INSERT",
    "UPDATE", "DELETE", "CREATE", "TABLE", "INDEX", "VIEW", "DROP", "ALTER",
    "VALUES", "INTO", "SET", "RETURNING", "OVER", "PARTITION", "ROW_NUMBER",
    "RANK", "DENSE_RANK", "LAG", "LEAD", "SUM", "AVG", "COUNT", "MIN", "MAX",
    "WINDOW", "ROWS", "RANGE", "UNBOUNDED", "PRECEDING", "FOLLOWING", "CURRENT",
    "ROW", "EXCLUDE", "CASCADE", "REFERENCES", "PRIMARY", "FOREIGN", "KEY",
    "UNIQUE", "CHECK", "DEFAULT", "AUTO_INCREMENT", "SERIAL", "TEXT", "VARCHAR",
    "INTEGER", "INT", "BIGINT", "DECIMAL", "NUMERIC", "BOOLEAN", "DATE", "DATETIME",
    "TIMESTAMP",
  ]);

  // Tokenisers --------------------------------------------------------------
  function pyTokenise(code) {
    const out = [];
    let i = 0;
    while (i < code.length) {
      const rest = code.slice(i);
      const ws = rest.match(SPACE);
      if (ws) { out.push(escapeHtml(ws[0])); i += ws[0].length; continue; }

      // Triple-quoted strings
      const triple = rest.match(/^"""[\s\S]*?"""|^'''[\s\S]*?'''/);
      if (triple) { out.push(wrap("string", triple[0])); i += triple[0].length; continue; }

      // Single-line strings
      const str = rest.match(/^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'/);
      if (str) { out.push(wrap("string", str[0])); i += str[0].length; continue; }

      // Comments
      const comment = rest.match(/^#.*/);
      if (comment) { out.push(wrap("comment", comment[0])); i += comment[0].length; continue; }

      // Numbers
      const num = rest.match(NUMBER);
      if (num) { out.push(wrap("number", num[0])); i += num[0].length; continue; }

      // Words
      const word = rest.match(WORD);
      if (word) {
        const w = word[0];
        const next = code.slice(i + w.length);
        const isFunc = /^\s*\(/.test(next);
        if (PY_KEYWORDS.has(w)) out.push(wrap("keyword", w));
        else if (isFunc) out.push(wrap("function", w));
        else if (PY_TYPES.has(w)) out.push(wrap("type", w));
        else if (PY_BUILTINS.has(w)) out.push(wrap("builtin", w));
        else out.push(escapeHtml(w));
        i += w.length;
        continue;
      }

      // Decorators
      const decorator = rest.match(/^@[A-Za-z_]\w*/);
      if (decorator) { out.push(wrap("builtin", decorator[0])); i += decorator[0].length; continue; }

      out.push(escapeHtml(rest[0]));
      i++;
    }
    return out.join("");
  }

  function jsTokenise(code) {
    const out = [];
    let i = 0;
    while (i < code.length) {
      const rest = code.slice(i);
      const ws = rest.match(SPACE);
      if (ws) { out.push(escapeHtml(ws[0])); i += ws[0].length; continue; }

      // Strings (including template literals)
      const str = rest.match(/^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'|^`(?:\\.|[^`\\])*`/);
      if (str) { out.push(wrap("string", str[0])); i += str[0].length; continue; }

      // Comments
      const comment = rest.match(/^\/\/.*|^\/\*[\s\S]*?\*\//);
      if (comment) { out.push(wrap("comment", comment[0])); i += comment[0].length; continue; }

      // Numbers
      const num = rest.match(NUMBER);
      if (num) { out.push(wrap("number", num[0])); i += num[0].length; continue; }

      // Words
      const word = rest.match(WORD);
      if (word) {
        const w = word[0];
        const next = code.slice(i + w.length);
        const isFunc = /^\s*\(/.test(next);
        if (JS_KEYWORDS.has(w)) out.push(wrap("keyword", w));
        else if (isFunc) out.push(wrap("function", w));
        else if (JS_BUILTINS.has(w)) out.push(wrap("builtin", w));
        else out.push(escapeHtml(w));
        i += w.length;
        continue;
      }

      out.push(escapeHtml(rest[0]));
      i++;
    }
    return out.join("");
  }

  function sqlTokenise(code) {
    const out = [];
    let i = 0;
    while (i < code.length) {
      const rest = code.slice(i);
      const ws = rest.match(SPACE);
      if (ws) { out.push(escapeHtml(ws[0])); i += ws[0].length; continue; }

      // Single-quoted strings (SQL standard escape is double quote)
      const str = rest.match(/^'(?:''|[^'])*'/);
      if (str) { out.push(wrap("string", str[0])); i += str[0].length; continue; }

      // Comments
      const comment = rest.match(/^--.*|^\/\*[\s\S]*?\*\//);
      if (comment) { out.push(wrap("comment", comment[0])); i += comment[0].length; continue; }

      // Numbers
      const num = rest.match(/^\d+\.?\d*/);
      if (num) { out.push(wrap("number", num[0])); i += num[0].length; continue; }

      // Words
      const word = rest.match(WORD);
      if (word) {
        const w = word[0];
        const next = code.slice(i + w.length);
        const isFunc = /^\s*\(/.test(next);
        const upper = w.toUpperCase();
        if (SQL_KEYWORDS.has(upper)) out.push(wrap("keyword", w));
        else if (isFunc) out.push(wrap("function", w));
        else out.push(escapeHtml(w));
        i += w.length;
        continue;
      }

      out.push(escapeHtml(rest[0]));
      i++;
    }
    return out.join("");
  }

  const TOKENISERS = {
    py: pyTokenise,
    js: jsTokenise,
    sql: sqlTokenise,
  };

  function highlight(code, lang) {
    const fn = TOKENISERS[lang];
    return fn ? fn(code) : escapeHtml(code);
  }

  window.LastReviewHighlighter = { highlight, languages: Object.keys(TOKENISERS) };
})();
