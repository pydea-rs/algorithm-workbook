/* ============================================================
   app.js — Finale engine. Content-agnostic: renders window.FINALE,
   runs code through window.Runner (shared Pyodide + sql.js harness).
   Progress + code drafts persist under odoo_finale_v1 (odoo_ prefix
   → picked up by the shared sync.js backup).
============================================================ */
(function () {
  "use strict";

  var F = window.FINALE;
  var LS = "odoo_finale_v1";
  var $ = function (s, r) { return (r || document).querySelector(s); };

  // ---- sections: modules, then cheats, then references ----
  var SECTIONS = [];
  F.modules.forEach(function (m) { SECTIONS.push({ type: "module", mod: m }); });
  SECTIONS.push({ type: "cheats" });
  SECTIONS.push({ type: "refs" });

  var S = { theme: "dark", idx: 0, done: {}, code: {}, mk: {}, started: false };
  load();

  function load() {
    try {
      var raw = localStorage.getItem(LS);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && typeof o === "object") {
          S.theme = o.theme || "dark";
          S.idx = typeof o.idx === "number" ? o.idx : 0;
          S.done = o.done || {};
          S.code = o.code || {};
          S.mk = o.mk || {};
          S.started = !!o.started;
        }
      }
    } catch (e) {}
    if (S.idx < 0) S.idx = 0;
    if (S.idx > SECTIONS.length - 1) S.idx = SECTIONS.length - 1;
  }
  function save() {
    try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) {}
  }

  // ---- helpers ----
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg; t.classList.remove("hidden");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.add("hidden"); }, 1800);
  }

  // ---- block renderer (briefs / cheats) ----
  function block(b) {
    if (b.t === "p") return '<p class="blk">' + b.html + "</p>";
    if (b.t === "call") return '<div class="call ' + (b.tone || "tip") + '">' + b.html + "</div>";
    if (b.t === "list") {
      return '<ul class="blk">' + b.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>";
    }
    if (b.t === "code") {
      return '<pre class="code"><span class="lang">' + esc(b.lang || "") + "</span>" + esc(b.code) + "</pre>";
    }
    if (b.t === "table") {
      var h = "<tr>" + b.head.map(function (c) { return "<th>" + c + "</th>"; }).join("") + "</tr>";
      var rows = b.rows.map(function (r) {
        return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
      }).join("");
      return '<table class="tbl"><thead>' + h + "</thead><tbody>" + rows + "</tbody></table>";
    }
    return "";
  }

  // ---- question renderer ----
  function question(q) {
    var draft = (S.code[q.id] != null) ? S.code[q.id] : q.starter;
    var lang = q.lang === "sql" ? "SQL" : "Python";
    var h = '<div class="q" data-qid="' + q.id + '">';
    h += '<div class="q-head"><div class="q-title">';
    h += '<span class="q-badge">' + esc(q.title) + "</span>";
    h += '<span class="q-name">Guess the pattern, then solve it</span>';
    h += '<span class="q-lang">' + lang + "</span>";
    h += "</div>";
    h += '<div class="q-prompt">' + q.prompt + "</div></div>";

    // reveals
    h += '<div class="q-reveals">';
    h += '<button class="reveal-btn" data-rev="pattern">🔒 Reveal pattern</button>';
    h += '<button class="reveal-btn" data-rev="hint">💡 Hint</button>';
    h += '<button class="reveal-btn" data-rev="solution">✅ Solution</button>';
    h += "</div>";
    h += '<div class="reveal-slot"></div>';

    // editor
    h += '<div class="editor-wrap"><textarea class="editor" spellcheck="false" data-editor>' + esc(draft) + "</textarea></div>";
    h += '<div class="q-actions">';
    h += '<button class="run-btn" data-run>▶ Run tests</button>';
    h += '<button class="act-btn" data-reset>Reset</button>';
    h += '<span class="act-spacer"></span>';
    h += '<span class="q-lang">' + q.tests.length + " test" + (q.tests.length > 1 ? "s" : "") + "</span>";
    h += "</div>";
    h += '<div class="results" data-results></div>';
    h += "</div>";
    return h;
  }

  function revealHtml(q, kind) {
    if (kind === "pattern") return '<div class="reveal-box pattern"><span class="rb-lab">Pattern</span>' + esc(q.pattern) + "</div>";
    if (kind === "hint") return '<div class="reveal-box hint"><span class="rb-lab">Hint</span>' + esc(q.hint) + "</div>";
    if (kind === "solution") {
      var s = '<div class="reveal-box"><span class="rb-lab">Reference solution</span>';
      s += '<pre class="code">' + esc(q.solution) + "</pre>";
      s += '<button class="mini" data-insert>Load into editor</button>';
      if (q.note) s += '<div class="reveal-box note" style="margin:10px 0 0"><span class="rb-lab">Interviewer’s note</span>' + q.note + "</div>";
      s += "</div>";
      return s;
    }
    return "";
  }

  // ---- section renderers ----
  function renderModule(mod) {
    var h = "";
    h += '<div class="kicker">' + esc(mod.kicker || "") + "</div>";
    h += '<h1 class="h-stage">' + esc(mod.name) + "</h1>";
    var gap = /GUARANTEED|missed|never|barely|cost you/i.test(mod.tag || "");
    h += '<div class="tagline' + (gap ? " gap" : "") + '">' + esc(mod.tag || "") + "</div>";
    (mod.brief || []).forEach(function (b) { h += block(b); });

    if (mod.id === "launch") h += recallGate();

    (mod.questions || []).forEach(function (q) { h += question(q); });
    return h;
  }

  function recallGate() {
    var h = '<details class="recall"><summary>Recall gate — your 22 must-know lecture parts (tick what you can reproduce cold)</summary><div class="recall-body">';
    F.mustKnow.forEach(function (m, i) {
      var key = "mk" + i;
      var checked = S.mk[key] ? " checked" : "";
      h += '<label class="mk"><input type="checkbox" data-mk="' + key + '"' + checked + ">";
      h += "<span><span class=\"mk-t\">" + esc(m[1]) + '</span> <span class="mk-m">' + esc(m[0]) + '</span><br><span class="mk-d">' + esc(m[2]) + "</span></span></label>";
    });
    h += "</div></details>";
    return h;
  }

  function renderCheats() {
    var h = '<div class="kicker">reference</div><h1 class="h-stage">Cheat sheets</h1>';
    h += '<div class="tagline">Code · regex · SQL — the syntax you don’t want to fumble live</div>';
    F.cheats.forEach(function (c) {
      h += '<div class="cheat-sec"><h3>' + esc(c.name) + "</h3>";
      c.blocks.forEach(function (b) { h += block(b); });
      h += "</div>";
    });
    return h;
  }

  function renderRefs() {
    var h = '<div class="kicker">recall</div><h1 class="h-stage">Your recalled references</h1>';
    h += '<div class="tagline">' + esc(F.refsIntro) + "</div>";
    F.refs.forEach(function (r) {
      h += '<div class="ref"><div class="ref-top">';
      h += '<span class="ref-kind ' + esc(r.kind) + '">' + esc(r.kind) + "</span>";
      h += '<span class="ref-title">' + esc(r.title) + "</span></div>";
      h += '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.url) + "</a>";
      h += '<div class="ref-sum">' + esc(r.summary) + "</div></div>";
    });
    h += '<div class="call win" style="margin-top:26px"><b>That’s the drill.</b> You’ve reviewed what you knew, closed SQL / trees / graphs / DP / design, and re-solved the ones you’d missed. Close the laptop 20 minutes before, test your Meet + editor, breathe. You’re ready. 🚀</div>';
    return h;
  }

  // ---- main render ----
  function render() {
    var sec = SECTIONS[S.idx];
    var view = $("#view");
    if (sec.type === "module") view.innerHTML = renderModule(sec.mod);
    else if (sec.type === "cheats") view.innerHTML = renderCheats();
    else view.innerHTML = renderRefs();

    // crumb + progress
    var name = sec.type === "module" ? sec.mod.name : (sec.type === "cheats" ? "Cheat sheets" : "References");
    $("#crumb").textContent = name;
    var doneCount = 0;
    F.modules.forEach(function (m) { if (S.done[m.id]) doneCount++; });
    $("#top-prog").textContent = doneCount + " / " + F.modules.length + " reviewed";

    // done button
    var db = $("#done-btn");
    if (sec.type === "module") {
      db.style.display = "";
      var isDone = !!S.done[sec.mod.id];
      db.classList.toggle("is-done", isDone);
      db.textContent = isDone ? "Reviewed ✓" : "Mark reviewed ✓";
    } else { db.style.display = "none"; }

    $("#prev-btn").disabled = S.idx === 0;
    $("#next-btn").disabled = S.idx === SECTIONS.length - 1;

    buildNav();
    window.scrollTo(0, 0);
    save();
  }

  function buildNav() {
    var nav = $("#nav");
    var h = "";
    SECTIONS.forEach(function (sec, i) {
      var label, isMod = sec.type === "module", gap = false, id = "";
      if (isMod) { label = sec.mod.name; id = sec.mod.id; gap = /GUARANTEED/i.test(sec.mod.tag || ""); }
      else label = sec.type === "cheats" ? "Cheat sheets" : "References";
      var cls = "nav-item" + (i === S.idx ? " active" : "") + (isMod && S.done[id] ? " done" : "");
      h += '<button class="' + cls + '" data-go="' + i + '">';
      h += '<span class="nav-num">' + (i + 1) + "</span>";
      h += '<span class="nav-label">' + esc(label) + "</span>";
      if (gap) h += '<span class="nav-gap">TASK</span>';
      h += "</button>";
    });
    nav.innerHTML = h;
  }

  function go(i) {
    if (i < 0 || i > SECTIONS.length - 1) return;
    S.idx = i; render();
    var r = $("#rail"); if (r) r.classList.remove("open");
  }

  // ---- run code ----
  function findQuestion(qid) {
    for (var i = 0; i < F.modules.length; i++) {
      var qs = F.modules[i].questions || [];
      for (var j = 0; j < qs.length; j++) if (qs[j].id === qid) return qs[j];
    }
    return null;
  }

  function runQuestion(card) {
    var qid = card.getAttribute("data-qid");
    var q = findQuestion(qid);
    if (!q) return;
    var code = $("[data-editor]", card).value;
    var resEl = $("[data-results]", card);
    var runBtn = $("[data-run]", card);
    runBtn.disabled = true;
    resEl.innerHTML = '<div class="res-summary">Running…</div>';

    var p = (q.lang === "sql")
      ? window.Runner.runSql(code, q.schema, q.tests)
      : window.Runner.runTests(code, q.fn, q.tests);

    Promise.resolve(p).then(function (results) {
      renderResults(resEl, q, results);
    }).catch(function (e) {
      resEl.innerHTML = '<div class="res-summary fail">Runner error: ' + esc(e.message || e) + "</div>";
    }).then(function () { runBtn.disabled = false; });
  }

  function fmt(v) { try { return JSON.stringify(v); } catch (e) { return String(v); } }

  function renderResults(resEl, q, results) {
    var pass = results.filter(function (r) { return r.passed; }).length;
    var all = results.length;
    var ok = pass === all;
    var h = '<div class="res-summary ' + (ok ? "pass" : "fail") + '">' +
      (ok ? "✓ All " + all + " tests passed" : pass + " / " + all + " passed") + "</div>";
    results.forEach(function (r, i) {
      h += '<div class="res ' + (r.passed ? "pass" : "fail") + '">';
      h += '<div class="res-line"><span class="res-ico">' + (r.passed ? "✓" : "✕") + "</span>";
      var label = (q.lang === "sql") ? (r.input || ("Test " + (i + 1))) : ("Test " + (i + 1));
      h += "<span>" + esc(label) + "</span></div>";
      if (!r.passed) {
        h += '<div class="res-detail">';
        if (r.error) {
          h += '<span class="err">' + esc(r.error) + "</span>";
        } else {
          if (q.lang !== "sql") h += "input: " + esc(fmt(r.input)) + "\n";
          h += '<span class="exp">expected: ' + esc(fmt(r.expected)) + "</span>\n";
          h += '<span class="got">got:      ' + esc(fmt(r.actual)) + "</span>";
        }
        h += "</div>";
      }
      h += "</div>";
    });
    resEl.innerHTML = h;
  }

  // ---- events ----
  function bind() {
    // boot
    var plan = $("#boot-plan");
    plan.innerHTML = F.meta.plan.map(function (p) {
      var m = p.match(/^(.*?)\s*\((.*?)\)\s*—\s*(.*)$/);
      if (m) return '<div class="pl"><b>' + esc(m[2]) + "</b><span><b style=\"color:var(--ink)\">" + esc(m[1]) + "</b> — " + esc(m[3]) + "</span></div>";
      return '<div class="pl"><span>' + esc(p) + "</span></div>";
    }).join("");
    $("#boot-foot").textContent = F.meta.exam;

    $("#boot-start").addEventListener("click", function () {
      S.started = true; save();
      $("#boot").classList.add("hidden");
      $("#app").classList.remove("hidden");
      render();
    });

    $("#prev-btn").addEventListener("click", function () { go(S.idx - 1); });
    $("#next-btn").addEventListener("click", function () { go(S.idx + 1); });
    $("#done-btn").addEventListener("click", function () {
      var sec = SECTIONS[S.idx];
      if (sec.type !== "module") return;
      S.done[sec.mod.id] = !S.done[sec.mod.id];
      render();
    });
    $("#theme-btn").addEventListener("click", function () {
      S.theme = S.theme === "dark" ? "light" : "dark";
      document.body.setAttribute("data-theme", S.theme); save();
    });
    $("#menu-btn").addEventListener("click", function () { $("#rail").classList.toggle("open"); });

    $("#nav").addEventListener("click", function (e) {
      var b = e.target.closest("[data-go]");
      if (b) go(parseInt(b.getAttribute("data-go"), 10));
    });

    // delegated within view
    var view = $("#view");
    view.addEventListener("click", function (e) {
      var t = e.target;
      var rev = t.closest("[data-rev]");
      if (rev) {
        var card = rev.closest(".q");
        var q = findQuestion(card.getAttribute("data-qid"));
        var kind = rev.getAttribute("data-rev");
        var slot = $(".reveal-slot", card);
        // toggle: if this kind already shown, remove
        var existing = $('[data-shown="' + kind + '"]', slot);
        if (existing) { existing.remove(); return; }
        var wrap = document.createElement("div");
        wrap.setAttribute("data-shown", kind);
        wrap.innerHTML = revealHtml(q, kind);
        slot.appendChild(wrap);
        return;
      }
      if (t.closest("[data-run]")) { runQuestion(t.closest(".q")); return; }
      if (t.closest("[data-reset]")) {
        var card2 = t.closest(".q");
        var q2 = findQuestion(card2.getAttribute("data-qid"));
        $("[data-editor]", card2).value = q2.starter;
        delete S.code[q2.id]; save();
        $("[data-results]", card2).innerHTML = "";
        return;
      }
      if (t.closest("[data-insert]")) {
        var card3 = t.closest(".q");
        var q3 = findQuestion(card3.getAttribute("data-qid"));
        $("[data-editor]", card3).value = q3.solution;
        S.code[q3.id] = q3.solution; save();
        toast("Solution loaded into the editor");
        return;
      }
    });

    // editor input (save draft) + Tab support + must-know ticks
    view.addEventListener("input", function (e) {
      if (e.target.matches("[data-editor]")) {
        var card = e.target.closest(".q");
        S.code[card.getAttribute("data-qid")] = e.target.value;
        save();
      }
    });
    view.addEventListener("change", function (e) {
      if (e.target.matches("[data-mk]")) {
        S.mk[e.target.getAttribute("data-mk")] = e.target.checked; save();
      }
    });
    view.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && e.target.matches("[data-editor]")) {
        e.preventDefault();
        var ta = e.target, st = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, st) + "    " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = st + 4;
        var card = ta.closest(".q");
        S.code[card.getAttribute("data-qid")] = ta.value; save();
      }
    });
  }

  // ---- boot ----
  document.body.setAttribute("data-theme", S.theme);
  bind();
  if (S.started) {
    $("#boot").classList.add("hidden");
    $("#app").classList.remove("hidden");
    render();
  }
})();
