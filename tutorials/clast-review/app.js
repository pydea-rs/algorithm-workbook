/* ============================================================
   Last Review [Claude] — "Final Approach"  · engine
   Content-agnostic: renders window.REVIEW (see content.js).
   Progress + prefs persist under an `odoo_`-prefixed key so the
   shared sync.js picks it up automatically.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "odoo_clast_review_v1";
  var REVIEW = window.REVIEW || { stages: [] };
  var STAGES = REVIEW.stages || [];

  // ---------- state ----------
  var S = {
    mode: "short",           // 'short' (1.5h) | 'long' (3h)
    theme: "blueprint",
    motion: "full",
    idx: 0,                  // current stage index
    conf: {},               // stageId -> 'shaky'|'ok'|'solid'
    started: false,
    seconds: 0,             // saved timer value
    autonav: false          // auto-advance to next stage on overscroll (off by default)
  };

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && typeof o === "object") {
          S.mode = o.mode || S.mode;
          S.theme = o.theme || S.theme;
          S.motion = o.motion || S.motion;
          S.idx = typeof o.idx === "number" ? o.idx : 0;
          S.conf = o.conf || {};
          S.started = !!o.started;
          S.seconds = o.seconds || 0;
          S.autonav = !!o.autonav;
        }
      }
    } catch (e) {}
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }

  // ---------- tiny DOM helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg; t.classList.remove("hidden");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.add("hidden"); }, 2200);
  }

  // ---------- syntax highlighter ----------
  function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  var PY_KW = new Set(("def return if elif else for while in not and or is None True False class import from " +
    "with as lambda yield break continue pass raise try except finally global nonlocal del assert await async " +
    "self nonlocal match case").split(" "));
  var PY_BI = new Set(("len range set dict list tuple int str float sum max min enumerate sorted map filter zip " +
    "print abs any all frozenset ord chr bool deque Counter defaultdict OrderedDict heapq heappush heappop " +
    "heapreplace heapify bisect bisect_left bisect_right nlargest nsmallest reversed divmod pow isinstance " +
    "next iter type object property staticmethod classmethod super dataclass cache").split(" "));
  var JS_KW = new Set(("const let var function return if else for while do break continue new class extends " +
    "super this typeof instanceof in of null undefined true false switch case default throw try catch finally " +
    "get set static yield await async delete void").split(" "));
  var SQL_KW = new Set(("select from where join left right inner outer full cross on group by having order limit " +
    "offset distinct as and or not in exists is null union all intersect except with recursive over partition " +
    "case when then else end insert update delete set values into create table index primary key foreign " +
    "references unique check default cascade restrict desc asc like ilike between for share nowait skip locked " +
    "add alter drop constraint using natural fetch first rows only generated identity serial").split(" "));
  var SQL_FN = new Set(("count sum avg min max coalesce nullif dense_rank rank row_number lag lead " +
    "concat upper lower cast round abs length now current_date extract").split(" "));

  function hl(code, lang) {
    var isSQL = lang === "sql";
    var re = isSQL
      ? /(--[^\n]*)|('(?:[^'\\]|\\.)*')|(\b\d+\.?\d*\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([\s\S])/g
      : /(#[^\n]*|\/\/[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+\.?\d*\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([\s\S])/g;
    var out = "", m;
    while ((m = re.exec(code)) !== null) {
      if (m[1] != null) { out += '<span class="tk-com">' + escHtml(m[1]) + "</span>"; }
      else if (m[2] != null) { out += '<span class="tk-str">' + escHtml(m[2]) + "</span>"; }
      else if (m[3] != null) { out += '<span class="tk-num">' + escHtml(m[3]) + "</span>"; }
      else if (m[4] != null) {
        var w = m[4], low = w.toLowerCase(), cls = null;
        if (isSQL) {
          if (SQL_KW.has(low)) cls = "tk-kw";
          else if (SQL_FN.has(low)) cls = "tk-fn";
        } else {
          var kw = lang === "js" ? JS_KW : PY_KW;
          if (kw.has(w)) cls = "tk-kw";
          else if (PY_BI.has(w) || (lang === "js" && /^[A-Z]/.test(w))) cls = "tk-bi";
          else {
            // function call?  word directly followed by '('
            var rest = code.slice(re.lastIndex);
            if (/^\s*\(/.test(rest)) cls = "tk-fn";
          }
        }
        out += cls ? '<span class="' + cls + '">' + escHtml(w) + "</span>" : escHtml(w);
      }
      else if (m[5] != null) { out += m[5]; }         // whitespace
      else { out += escHtml(m[6]); }                    // any other char
    }
    return out;
  }

  // ---------- block renderers ----------
  function visible(b) { return S.mode === "long" || !b.adv; }

  function advBadge(b) { return b.adv ? '<span class="adv-badge">3h</span>' : ""; }

  function renderNote(b) {
    var tone = b.tone || "";
    var c = el("div", "card " + tone);
    var inner = "";
    if (b.flag) inner += '<div class="card-flag">' + b.flag + advBadge(b) + "</div>";
    else if (b.adv) inner += '<div class="card-flag" style="color:var(--signal-2)">NOTE' + advBadge(b) + "</div>";
    if (b.title) inner += '<h3 class="card-t">' + b.title + "</h3>";
    inner += b.html;
    c.innerHTML = inner;
    return c;
  }
  function renderCode(b) {
    var wrap = el("div", "code");
    var head = el("div", "code-head");
    head.innerHTML =
      '<span class="code-dot"></span><span class="code-lang">' + (b.lang || "text") + "</span>" +
      (b.title ? '<span class="code-title">' + b.title + (b.adv ? " · 3h" : "") + "</span>" : (b.adv ? '<span class="code-title">3h</span>' : "")) +
      '<button class="code-copy">copy</button>';
    var pre = el("pre");
    var code = el("code");
    code.innerHTML = hl(b.code, b.lang || "text");
    pre.appendChild(code);
    wrap.appendChild(head);
    wrap.appendChild(pre);
    if (b.note) wrap.appendChild(el("div", "code-note", b.note));
    head.querySelector(".code-copy").addEventListener("click", function () {
      var ta = document.createElement("textarea");
      ta.value = b.code; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast("Copied"); } catch (e) {}
      document.body.removeChild(ta);
    });
    return wrap;
  }
  function renderTable(b) {
    var c = el("div", "card");
    var h = "";
    if (b.flag) h += '<div class="card-flag">' + b.flag + advBadge(b) + "</div>";
    if (b.title) h += '<h3 class="card-t">' + b.title + "</h3>";
    h += '<div style="overflow-x:auto"><table class="tbl"><thead><tr>';
    b.head.forEach(function (x) { h += "<th>" + x + "</th>"; });
    h += "</tr></thead><tbody>";
    b.rows.forEach(function (r) {
      h += "<tr>";
      r.forEach(function (x) { h += "<td>" + x + "</td>"; });
      h += "</tr>";
    });
    h += "</tbody></table></div>";
    c.innerHTML = h;
    return c;
  }
  function renderProb(b) {
    var diffCls = b.diff === "hard" ? "diff-hard" : b.diff === "easy" ? "diff-easy" : "diff-med";
    var diffTxt = b.diff === "hard" ? "Hard" : b.diff === "easy" ? "Easy" : "Med";
    var p = el("div", "prob");
    var head = el("div", "prob-head");
    head.innerHTML =
      '<span class="prob-diff ' + diffCls + '">' + diffTxt + "</span>" +
      '<span class="prob-name">' + b.name + (b.adv ? ' <span class="adv-badge">3h</span>' : "") + "</span>" +
      '<span class="prob-pat">' + (b.pat || "") + "</span>" +
      '<span class="prob-chev">›</span>';
    var body = el("div", "prob-body");
    var bh = "";
    if (b.idea) bh += '<div class="prob-idea"><b>Idea.</b> ' + b.idea + "</div>";
    body.innerHTML = bh;
    if (b.code) body.appendChild(renderCode({ lang: b.lang || "python", code: b.code }));
    if (b.gotcha) { var g = el("div", "prob-gotcha", "<b>Watch.</b> " + b.gotcha); body.appendChild(g); }
    p.appendChild(head); p.appendChild(body);
    head.addEventListener("click", function () { p.classList.toggle("open"); });
    return p;
  }

  function renderBlock(b) {
    switch (b.t) {
      case "code": return renderCode(b);
      case "table": return renderTable(b);
      case "prob": return renderProb(b);
      default: return renderNote(b);
    }
  }

  // ---------- readiness ----------
  var CIRC = 2 * Math.PI * 19;   // ~119.38
  function gradeableCount() { return STAGES.filter(function (s) { return !s.noGrade; }).length; }
  function solidCount() {
    return STAGES.filter(function (s) { return !s.noGrade && S.conf[s.id] === "solid"; }).length;
  }
  function touchedCount() {
    return STAGES.filter(function (s) { return !s.noGrade && S.conf[s.id]; }).length;
  }
  function updateReady() {
    var total = gradeableCount() || 1;
    var pct = Math.round((solidCount() / total) * 100);
    $("#ready-pct").textContent = pct;
    $("#ready-arc").style.strokeDashoffset = CIRC * (1 - pct / 100);
  }

  // ---------- track spine ----------
  function buildTrack() {
    var track = $("#track");
    track.innerHTML = "";
    var fill = el("div", "track-fill");
    track.appendChild(fill);
    STAGES.forEach(function (s, i) {
      var b = el("button", "stage");
      b.setAttribute("data-i", i);
      if (S.conf[s.id]) b.setAttribute("data-conf", S.conf[s.id]);
      b.innerHTML =
        '<span class="stage-node">' + (s.noGrade ? "✦" : (i)) + "</span>" +
        '<span class="stage-label"><span class="stage-name">' + s.name + "</span>" +
        (s.tag ? '<span class="stage-tag">' + s.tag + "</span>" : "") + "</span>";
      b.addEventListener("click", function () { go(i); closeNav(); });
      track.appendChild(b);
    });
  }
  function paintTrack() {
    $all(".stage").forEach(function (b) {
      var i = +b.getAttribute("data-i");
      b.classList.toggle("active", i === S.idx);
      var s = STAGES[i];
      if (S.conf[s.id]) b.setAttribute("data-conf", S.conf[s.id]);
      else b.removeAttribute("data-conf");
    });
    // fill line up to current stage
    var nodes = $all(".stage");
    if (nodes.length) {
      var frac = STAGES.length > 1 ? S.idx / (STAGES.length - 1) : 0;
      var fill = $(".track-fill");
      if (fill) fill.style.height = "calc((100% - 24px) * " + frac + ")";
    }
  }

  // ---------- footer dots ----------
  function buildDots() {
    var d = $("#foot-dots"); d.innerHTML = "";
    STAGES.forEach(function (s, i) {
      var dot = el("span", "foot-dot");
      dot.title = s.name;
      dot.addEventListener("click", function () { go(i); });
      d.appendChild(dot);
    });
  }
  function paintDots() {
    $all(".foot-dot").forEach(function (dot, i) {
      dot.classList.toggle("active", i === S.idx);
      dot.classList.toggle("done", !!S.conf[STAGES[i].id]);
    });
  }

  // ---------- render a stage ----------
  function renderStage() {
    var s = STAGES[S.idx];
    var view = $("#view");
    view.innerHTML = "";
    var wrap = el("div", "wrap");

    if (s.cleared) { renderCleared(wrap); view.appendChild(wrap); afterRender(s); return; }

    var hero = el("div", "stage-hero");
    hero.innerHTML =
      '<div class="stage-kicker">' + (s.noGrade ? "Pre-flight" : ("Stage " + s.id + " / " + (gradeableCount()))) + " · " + (s.kicker || "") + "</div>" +
      '<h1 class="stage-h1">' + s.name + "</h1>" +
      (s.lede ? '<p class="stage-lede">' + s.lede + "</p>" : "");
    wrap.appendChild(hero);

    (s.blocks || []).forEach(function (b) {
      if (visible(b)) wrap.appendChild(renderBlock(b));
    });

    if (!s.noGrade) wrap.appendChild(renderCheckpoint(s));
    view.appendChild(wrap);
    afterRender(s);
  }

  function afterRender(s) {
    $("#crumb").textContent = (s.noGrade && !s.cleared) ? "Pre-flight" : s.name;
    $("#view").parentElement.scrollTop = 0;
    window.scrollTo(0, 0);
    $("#prev-btn").disabled = S.idx === 0;
    $("#next-btn").disabled = S.idx === STAGES.length - 1;
    $("#next-btn").textContent = S.idx === STAGES.length - 2 ? "Finish →" : "Next →";
    paintTrack(); paintDots(); updateReady();
    updateScrollHint();
  }

  function renderCheckpoint(s) {
    var c = el("div", "checkpoint");
    c.innerHTML =
      '<div class="chk-q">Checkpoint — how solid is this?</div>' +
      '<div class="chk-h">Answer honestly. Shaky &amp; OK sections resurface on the final screen so you know what to revisit.</div>' +
      '<div class="chk-btns">' +
        '<button class="chk-btn" data-c="shaky">Shaky</button>' +
        '<button class="chk-btn" data-c="ok">OK</button>' +
        '<button class="chk-btn" data-c="solid">Solid ✓</button>' +
      "</div>";
    var cur = S.conf[s.id];
    $all(".chk-btn", c).forEach(function (btn) {
      if (btn.getAttribute("data-c") === cur) btn.classList.add("on");
      btn.addEventListener("click", function () {
        S.conf[s.id] = btn.getAttribute("data-c");
        save();
        $all(".chk-btn", c).forEach(function (x) { x.classList.remove("on"); });
        btn.classList.add("on");
        paintTrack(); paintDots(); updateReady();
        // gentle auto-advance on "solid"
        if (S.conf[s.id] === "solid" && S.idx < STAGES.length - 1) {
          setTimeout(function () { go(S.idx + 1); }, 260);
        }
      });
    });
    return c;
  }

  function renderCleared(wrap) {
    var total = gradeableCount();
    var solid = solidCount(), touched = touchedCount();
    var pct = Math.round((solid / (total || 1)) * 100);
    var head = el("div", "cleared");
    head.innerHTML =
      '<div class="cleared-stamp">' + (pct >= 80 ? "CLEARED FOR TAKEOFF" : "FINAL APPROACH") + "</div>" +
      "<h1>" + (pct >= 80 ? "You're ready." : "Almost there.") + "</h1>" +
      '<p class="stage-lede">' + solid + " of " + total + " stages marked solid" +
      (touched < total ? " · " + (total - touched) + " not yet rated" : "") + ".</p>";
    wrap.appendChild(head);

    // revisit list = shaky + ok
    var weak = STAGES.filter(function (s) { return !s.noGrade && (S.conf[s.id] === "shaky" || S.conf[s.id] === "ok"); });
    if (weak.length) {
      var rv = el("div", "revisit");
      rv.appendChild(el("h3", "card-t", "Revisit before you close the laptop"));
      weak.forEach(function (s) {
        var item = el("div", "revisit-item" + (S.conf[s.id] === "ok" ? " ok" : ""));
        item.innerHTML = '<span class="prob-diff ' + (S.conf[s.id] === "ok" ? "diff-med" : "diff-hard") + '">' +
          (S.conf[s.id] === "ok" ? "OK" : "Shaky") + "</span><span class=\"prob-name\">" + s.name + "</span><span class=\"prob-chev\">›</span>";
        item.addEventListener("click", function () { go(STAGES.indexOf(s)); });
        rv.appendChild(item);
      });
      wrap.appendChild(rv);
    }

    // static send-off blocks provided by content
    (STAGES[S.idx].blocks || []).forEach(function (b) {
      if (visible(b)) wrap.appendChild(renderBlock(b));
    });
  }

  // ---------- auto-advance on scroll ----------
  // Fires only when a scroll gesture STARTS at the very bottom of the page and
  // keeps pushing down — otherwise the user is just scrolling through content.
  function isAtBottom() {
    var doc = document.documentElement;
    var y = window.scrollY != null ? window.scrollY : window.pageYOffset;
    return (doc.scrollHeight - window.innerHeight - y) <= 2;   // px precision
  }
  function isAtTop() {
    var y = window.scrollY != null ? window.scrollY : window.pageYOffset;
    return y <= 2;   // px precision
  }
  function updateScrollHint() {
    var hint = $("#scroll-hint");
    if (!hint) return;
    var show = S.autonav &&
      !$("#app").classList.contains("hidden") &&
      S.idx < STAGES.length - 1 &&
      isAtBottom();
    hint.classList.toggle("show", show);
  }
  var _hintRaf = 0;
  function onScrollTick() {
    if (_hintRaf) return;
    _hintRaf = requestAnimationFrame(function () { _hintRaf = 0; updateScrollHint(); });
  }

  // ---------- navigation ----------
  function go(i) {
    if (i < 0 || i >= STAGES.length) return;
    S.idx = i; save();
    renderStage();
  }

  // ---------- boot / mode ----------
  function paintModeButtons() {
    $all("[data-set-mode]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-set-mode") === S.mode);
      b.setAttribute("aria-pressed", b.getAttribute("data-set-mode") === S.mode);
    });
    $all(".mode-card").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === S.mode);
    });
    $("#spine-mode").textContent = S.mode === "long" ? "3 h · full" : "1.5 h · focused";
  }
  function setMode(m) {
    S.mode = m; save(); paintModeButtons();
    if (S.started) renderStage();
  }

  function applyPrefs() {
    document.body.setAttribute("data-theme", S.theme);
    document.body.setAttribute("data-motion", S.motion);
    document.body.setAttribute("data-mode", S.mode);
    $all("[data-set-theme]").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-set-theme") === S.theme); });
    $all("[data-set-motion]").forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-set-motion") === S.motion); });
    $all("[data-set-autonav]").forEach(function (b) { b.classList.toggle("active", (b.getAttribute("data-set-autonav") === "on") === S.autonav); });
    paintModeButtons();
  }

  function enterApp() {
    S.started = true; save();
    $("#boot").classList.add("hidden");
    $("#app").classList.remove("hidden");
    buildTrack(); buildDots();
    renderStage();
  }

  // ---------- timer ----------
  var timer = { on: false, t: null };
  function fmt(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }
  function tickTimer() {
    S.seconds++; $("#timer-txt").textContent = fmt(S.seconds);
    if (S.seconds % 10 === 0) save();
  }
  function toggleTimer() {
    if (timer.on) {
      clearInterval(timer.t); timer.on = false;
      $("#timer-btn").classList.remove("active"); save();
    } else {
      timer.on = true; $("#timer-btn").classList.add("active");
      $("#timer-txt").textContent = fmt(S.seconds);
      timer.t = setInterval(tickTimer, 1000);
    }
  }

  // ---------- nav drawer (mobile) ----------
  function closeNav() { document.body.classList.remove("nav-open"); }

  // ---------- settings + data ----------
  function openSettings() { $("#settings").classList.remove("hidden"); }
  function closeSettings() { $("#settings").classList.add("hidden"); }

  function exportData() {
    var blob = new Blob([JSON.stringify({ app: "clast-review", v: 1, data: S }, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "last-review-claude-progress.json";
    a.click();
    toast("Exported");
  }
  function importData(file) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var o = JSON.parse(r.result);
        var d = o.data || o;
        if (d && typeof d === "object") {
          S.mode = d.mode || S.mode; S.theme = d.theme || S.theme;
          S.motion = d.motion || S.motion; S.conf = d.conf || {};
          S.idx = typeof d.idx === "number" ? d.idx : 0; S.seconds = d.seconds || 0;
          if ("autonav" in d) S.autonav = !!d.autonav;
          save(); applyPrefs();
          if (S.started) { buildTrack(); buildDots(); renderStage(); }
          toast("Imported");
        }
      } catch (e) { toast("Could not read that file"); }
    };
    r.readAsText(file);
  }
  function resetProgress() {
    if (!confirm("Reset all progress and confidence ratings? Settings are kept.")) return;
    S.conf = {}; S.idx = 0; S.seconds = 0; save();
    buildTrack(); renderStage(); toast("Progress reset");
  }

  // ---------- wire up ----------
  function bind() {
    // boot mode cards
    $all(".mode-card").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    $("#boot-start").addEventListener("click", enterApp);
    var resume = $("#boot-resume");
    resume.addEventListener("click", enterApp);   // bind once; visibility is gated below
    if (S.started || touchedCount() > 0) {
      resume.classList.remove("hidden");
      resume.textContent = "↩ Resume where you left off (" + STAGES[Math.min(S.idx, STAGES.length - 1)].name + ")";
    }

    // mode + theme + motion setters (delegate)
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-set-mode],[data-set-theme],[data-set-motion],[data-set-autonav]");
      if (!t) return;
      if (t.hasAttribute("data-set-mode")) setMode(t.getAttribute("data-set-mode"));
      if (t.hasAttribute("data-set-theme")) { S.theme = t.getAttribute("data-set-theme"); save(); applyPrefs(); }
      if (t.hasAttribute("data-set-motion")) { S.motion = t.getAttribute("data-set-motion"); save(); applyPrefs(); }
      if (t.hasAttribute("data-set-autonav")) { S.autonav = t.getAttribute("data-set-autonav") === "on"; save(); applyPrefs(); updateScrollHint(); }
    });

    // ---- auto-advance on scroll (only when S.autonav is on) ----
    window.addEventListener("scroll", onScrollTick, { passive: true });
    window.addEventListener("resize", updateScrollHint);

    var lastAutoNav = 0;
    function autonavOn() {
      return S.autonav &&
        !$("#app").classList.contains("hidden") &&
        $("#settings").classList.contains("hidden");
    }
    // wheel / trackpad: a gesture "begins" after a >200ms quiet gap; we snapshot the
    // scroll position at that instant and only cross a boundary if the gesture STARTED
    // pinned against that edge — otherwise the user is just scrolling through content.
    // Forward = started at the bottom + kept pushing down; reverse = mirror at the top.
    var wLast = 0, gStartBottom = false, gStartTop = false, gDown = 0, gUp = 0, gFired = false;
    window.addEventListener("wheel", function (e) {
      if (!autonavOn()) return;
      var now = Date.now();
      if (now - wLast > 200) {                        // new gesture — snapshot the start edge
        gStartBottom = isAtBottom(); gStartTop = isAtTop();
        gDown = 0; gUp = 0; gFired = false;
      }
      wLast = now;
      var d = e.deltaY || 0;
      if (e.deltaMode === 1) d *= 16;                 // lines -> px
      else if (e.deltaMode === 2) d *= window.innerHeight; // pages -> px
      if (d > 0) { gDown += d; gUp = 0; gStartTop = false; }        // any down cancels an up-intent
      else if (d < 0) { gUp += -d; gDown = 0; gStartBottom = false; } // any up cancels a down-intent
      if (gFired || now - lastAutoNav <= 600) return;
      if (gStartBottom && gDown >= 45 && isAtBottom() && S.idx < STAGES.length - 1) {
        gFired = true; lastAutoNav = now; go(S.idx + 1);
      } else if (gStartTop && gUp >= 45 && isAtTop() && S.idx > 0) {
        gFired = true; lastAutoNav = now; go(S.idx - 1);
      }
    }, { passive: true });
    // touch: touchstart is the gesture start — snapshot which edge (if any) we're on.
    var tY = 0, tStartBottom = false, tStartTop = false, tFired = false;
    window.addEventListener("touchstart", function (e) {
      if (!e.touches || !e.touches[0]) return;
      tY = e.touches[0].clientY;
      tStartBottom = isAtBottom(); tStartTop = isAtTop(); tFired = false;
    }, { passive: true });
    window.addEventListener("touchmove", function (e) {
      if (!autonavOn() || tFired || !e.touches || !e.touches[0]) return;
      if (Date.now() - lastAutoNav <= 600) return;
      var dy = tY - e.touches[0].clientY;             // +dy = finger up (wants content below)
      if (tStartBottom && dy >= 60 && isAtBottom() && S.idx < STAGES.length - 1) {
        tFired = true; lastAutoNav = Date.now(); go(S.idx + 1);
      } else if (tStartTop && dy <= -60 && isAtTop() && S.idx > 0) {
        tFired = true; lastAutoNav = Date.now(); go(S.idx - 1);
      }
    }, { passive: true });

    $("#prev-btn").addEventListener("click", function () { go(S.idx - 1); });
    $("#next-btn").addEventListener("click", function () { go(S.idx + 1); });
    $("#to-boot").addEventListener("click", function () {
      $("#app").classList.add("hidden"); $("#boot").classList.remove("hidden");
      var r = $("#boot-resume"); r.classList.remove("hidden");
      r.textContent = "↩ Resume where you left off (" + STAGES[Math.min(S.idx, STAGES.length - 1)].name + ")";
    });
    $("#menu-toggle").addEventListener("click", function () { document.body.classList.toggle("nav-open"); });
    $("#settings-btn").addEventListener("click", openSettings);
    $("#timer-btn").addEventListener("click", toggleTimer);
    $all("[data-close]").forEach(function (b) { b.addEventListener("click", closeSettings); });

    $("#export-btn").addEventListener("click", exportData);
    $("#import-btn").addEventListener("click", function () { $("#import-file").click(); });
    $("#import-file").addEventListener("change", function (e) { if (e.target.files[0]) importData(e.target.files[0]); });
    $("#reset-btn").addEventListener("click", resetProgress);

    // keyboard
    document.addEventListener("keydown", function (e) {
      if ($("#app").classList.contains("hidden")) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "j" || e.key === "J") { go(S.idx + 1); }
      else if (e.key === "ArrowLeft" || e.key === "k" || e.key === "K") { go(S.idx - 1); }
      else if (e.key === "1") setMode("short");
      else if (e.key === "2") setMode("long");
      else if (e.key === "Escape") closeSettings();
    });
  }

  // ---------- init ----------
  load();
  S.idx = Math.max(0, Math.min(S.idx, STAGES.length - 1));   // clamp a stale/out-of-range index
  applyPrefs();
  bind();
  if (S.seconds) $("#timer-txt").textContent = fmt(S.seconds);
})();
