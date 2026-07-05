/* ============================================================
   app.js — Tutorial controller.
   Builds the nav, routes views, renders modules / practice
   sets / final exam, manages the answer modal, drives the
   code runner, persists progress in localStorage.
============================================================ */

(function () {
  "use strict";

  // Distinct prefix from the algorithms tutorial — both apps share the same
  // origin, so identical keys would merge progress and cross-wipe on Reset.
  const STORAGE_KEY = "odoo_final_progress_v1";
  const PREFS_KEY = "odoo_final_prefs_v1";
  const TIMING_KEY = "odoo_final_timing_v1";
  const DRAFTS_KEY = "odoo_final_drafts_v1";
  const EXAM_HISTORY_KEY = "odoo_final_exam_history_v1";

  const DEFAULT_PREFS = {
    theme: "dark",
    accent: "purple",
    codeSize: "md",
    density: "comfortable",
    motion: "full",
  };

  // ----------------------------------------------------------------
  // State + persistence
  // ----------------------------------------------------------------
  const state = {
    solved: loadProgress(),                              // Set of question ids
    activeView: null,                                    // {kind, id} of current view
    examSeed: null,                                      // Stable random seed for the final exam
    prefs: loadPrefs(),                                  // User customization
    timing: loadJSON(TIMING_KEY, {}),                    // qid -> {bestSec, lastSec, attempts:[{sec,date,rating}]}
    drafts: loadJSON(DRAFTS_KEY, {}),                    // qid -> {python:"…", javascript:"…"}
    examHistory: loadJSON(EXAM_HISTORY_KEY, { sessions: [] }),  // recorded final-exam sessions
  };

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return Object.assign({}, DEFAULT_PREFS, parsed);
    } catch (_) {
      return Object.assign({}, DEFAULT_PREFS);
    }
  }
  function savePrefs() {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(state.prefs)); } catch (_) {}
  }
  function applyPrefs() {
    const b = document.body;
    b.dataset.theme = state.prefs.theme;
    b.dataset.accent = state.prefs.accent;
    b.dataset.density = state.prefs.density;
    b.dataset.motion = state.prefs.motion;
    b.dataset.codeSize = state.prefs.codeSize;
  }
  function syncSettingsUI() {
    document.querySelectorAll("#settings-modal [data-pref]").forEach((el) => {
      const pref = el.dataset.pref;
      const value = el.dataset.value;
      el.classList.toggle("active", state.prefs[pref] === value);
    });
  }
  function openSettings() {
    syncSettingsUI();
    const m = document.getElementById("settings-modal");
    m.classList.remove("closing");
    m.classList.remove("hidden");
  }
  function closeSettings() {
    const m = document.getElementById("settings-modal");
    if (m.classList.contains("hidden")) return;
    if (document.body.dataset.motion === "reduced") {
      m.classList.add("hidden");
      return;
    }
    m.classList.add("closing");
    setTimeout(() => {
      m.classList.remove("closing");
      m.classList.add("hidden");
    }, 200);
  }
  function resetPrefs() {
    state.prefs = Object.assign({}, DEFAULT_PREFS);
    savePrefs();
    applyPrefs();
    syncSettingsUI();
    toast("Defaults restored.", "good");
  }
  function bindSettingsModal() {
    document.getElementById("settings-btn").addEventListener("click", openSettings);
    document.querySelectorAll("#settings-modal [data-close-settings]").forEach((b) =>
      b.addEventListener("click", closeSettings)
    );
    document.querySelectorAll("#settings-modal [data-pref]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pref = btn.dataset.pref;
        const value = btn.dataset.value;
        if (state.prefs[pref] === value) return;
        state.prefs[pref] = value;
        savePrefs();
        applyPrefs();
        syncSettingsUI();
      });
    });
    document.getElementById("settings-reset").addEventListener("click", resetPrefs);
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(arr);
    } catch (_) {
      return new Set();
    }
  }
  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.solved]));
    } catch (_) {}
  }
  function markSolved(qid) {
    if (!state.solved.has(qid)) {
      state.solved.add(qid);
      saveProgress();
      updateProgressUI();
      updateNavCheckmarks();
    }
  }
  function unmarkSolved(qid) {
    state.solved.delete(qid);
    saveProgress();
    updateProgressUI();
    updateNavCheckmarks();
  }
  function resetProgress() {
    state.solved.clear();
    state.timing = {};
    state.drafts = {};
    state.examHistory = { sessions: [] };
    saveProgress();
    saveJSON(TIMING_KEY, state.timing);
    saveJSON(DRAFTS_KEY, state.drafts);
    saveJSON(EXAM_HISTORY_KEY, state.examHistory);
    updateProgressUI();
    updateNavCheckmarks();
  }

  // ----------------------------------------------------------------
  // Timing model + rating
  // ----------------------------------------------------------------
  // q.time looks like "12-15 min", "20 min", or "5-8 min".
  function parseTimeBudget(str) {
    if (!str) return { min: 10, max: 20 };
    const m = /(\d+)(?:\s*-\s*(\d+))?\s*min/i.exec(str);
    if (!m) return { min: 10, max: 20 };
    const lo = parseInt(m[1], 10);
    const hi = m[2] ? parseInt(m[2], 10) : lo;
    return { min: lo, max: hi };
  }
  function rateTime(sec, budget) {
    const mins = sec / 60;
    if (mins <= budget.min / 2)     return { key: "lightning", label: "Lightning" };
    if (mins <= budget.min)         return { key: "fast",      label: "Fast" };
    if (mins <= budget.max)         return { key: "on-pace",   label: "On pace" };
    if (mins <= budget.max * 1.5)   return { key: "over",      label: "Over budget" };
    return                                 { key: "slow",      label: "Slow" };
  }
  function formatMMSS(sec) {
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }
  function recordSolveTime(qid, sec) {
    const q = window.QUESTIONS[qid];
    const budget = parseTimeBudget(q && q.time);
    const rating = rateTime(sec, budget).key;
    const entry = { sec, date: new Date().toISOString(), rating };
    const rec = state.timing[qid] || { bestSec: null, lastSec: null, attempts: [] };
    rec.attempts.push(entry);
    // Cap stored history to avoid unbounded growth (last 50 attempts/question)
    if (rec.attempts.length > 50) rec.attempts = rec.attempts.slice(-50);
    rec.lastSec = sec;
    rec.bestSec = rec.bestSec == null ? sec : Math.min(rec.bestSec, sec);
    state.timing[qid] = rec;
    saveJSON(TIMING_KEY, state.timing);
  }
  function recordExamSession(record) {
    state.examHistory.sessions = state.examHistory.sessions || [];
    state.examHistory.sessions.push(record);
    if (state.examHistory.sessions.length > 20) {
      state.examHistory.sessions = state.examHistory.sessions.slice(-20);
    }
    saveJSON(EXAM_HISTORY_KEY, state.examHistory);
  }

  // ----------------------------------------------------------------
  // Code drafts (per qid, per language)
  // ----------------------------------------------------------------
  function getDraft(qid, lang) {
    return (state.drafts[qid] && state.drafts[qid][lang]) || "";
  }
  function setDraft(qid, lang, code) {
    const d = state.drafts[qid] = state.drafts[qid] || {};
    if (d[lang] === code) return;
    d[lang] = code;
    saveJSON(DRAFTS_KEY, state.drafts);
  }

  // ----------------------------------------------------------------
  // Tiny DOM helpers
  // ----------------------------------------------------------------
  function $(sel, root = document) { return root.querySelector(sel); }
  function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") {
        node.addEventListener(k.slice(2), v);
      } else {
        node.setAttribute(k, v === true ? "" : v);
      }
    }
    for (const c of [].concat(children)) {
      if (c == null || c === false) continue;
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    }
    return node;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function toast(msg, kind = "info", ms = 2400) {
    const t = $("#toast");
    t.className = "toast " + (kind === "good" ? "good" : kind === "bad" ? "bad" : "");
    t.textContent = msg;
    t.classList.remove("hidden", "leaving");
    clearTimeout(toast._t);
    clearTimeout(toast._tHide);
    const reduced = document.body.dataset.motion === "reduced";
    toast._t = setTimeout(() => {
      if (reduced) {
        t.classList.add("hidden");
        return;
      }
      t.classList.add("leaving");
      toast._tHide = setTimeout(() => {
        t.classList.add("hidden");
        t.classList.remove("leaving");
      }, 240);
    }, ms);
  }

  // ----------------------------------------------------------------
  // Sidebar nav
  // ----------------------------------------------------------------
  const NAV_GROUPS = [
    {
      title: null,
      items: [{ kind: "welcome", id: null, label: "Welcome & How to Use" }],
    },
    {
      title: "Tutorial Modules",
      items: window.MODULE_ORDER.map((mid, i) => ({
        kind: "module",
        id: mid,
        label: window.MODULES[mid].title,
        num: i + 1,
      })),
    },
    {
      title: "Practice Sets",
      items: Object.keys(window.PRACTICE_SETS).map((pid) => ({
        kind: "practice",
        id: pid,
        label: window.PRACTICE_SETS[pid].title.replace(/^Practice Set \d+ — /, ""),
        // Number by the set's own id (PS3 -> 3) so it matches its module.
        num: parseInt(pid.replace(/\D/g, ""), 10) || "·",
      })),
    },
    {
      title: "Exam",
      items: [{ kind: "exam", id: null, label: "Final Exam (12 random)" }],
    },
  ];

  function buildNav() {
    const navList = $("#nav-list");
    navList.innerHTML = "";
    for (const group of NAV_GROUPS) {
      if (group.title) {
        navList.appendChild(el("div", { class: "nav-group-title", text: group.title }));
      }
      for (const item of group.items) {
        const node = el("div", {
          class: "nav-item",
          "data-kind": item.kind,
          "data-id": item.id || "",
          onclick: () => navigate(item.kind, item.id),
        }, [
          el("div", { class: "num", text: item.num != null ? item.num : "·" }),
          el("div", { class: "nav-label", text: item.label }),
          el("div", { class: "check", html: "&#10003;" }),
        ]);
        navList.appendChild(node);
      }
    }
  }

  function setActiveNav() {
    $$(".nav-item").forEach((n) => n.classList.remove("active"));
    const kind = state.activeView?.kind;
    const id = state.activeView?.id || "";
    const match = $$(".nav-item").find(
      (n) => n.dataset.kind === kind && n.dataset.id === id
    );
    if (match) match.classList.add("active");
  }

  function updateNavCheckmarks() {
    // Mark a module/practice set as "complete" if every q in its set is solved.
    $$(".nav-item").forEach((node) => {
      const kind = node.dataset.kind;
      const id = node.dataset.id;
      let done = false;
      if (kind === "practice" && id) {
        const qs = window.PRACTICE_SETS[id].qids;
        done = qs.every((qid) => state.solved.has(qid));
      } else if (kind === "exam") {
        done = window.FINAL_EXAM_POOL.length > 0 &&
               window.FINAL_EXAM_POOL.every((qid) => state.solved.has(qid));
      }
      node.classList.toggle("completed", done);
    });
  }

  // ----------------------------------------------------------------
  // Progress UI (sidebar footer)
  // ----------------------------------------------------------------
  function totalQuestionCount() { return Object.keys(window.QUESTIONS).length; }
  function updateProgressUI() {
    const total = totalQuestionCount();
    const done = state.solved.size;
    $("#progress-text").textContent = `${done} / ${total} questions`;
    const pct = total === 0 ? 0 : (done / total) * 100;
    $("#progress-fill").style.width = pct + "%";
  }

  // ----------------------------------------------------------------
  // Routing
  // ----------------------------------------------------------------
  // Track pending navigation so rapid clicks don't pile up animations.
  let _navToken = 0;
  function navigate(kind, id) {
    const token = ++_navToken;
    state.activeView = { kind, id };
    setActiveNav();
    setCrumbs();

    const root = $("#view-container");
    const motion = document.body.dataset.motion;
    const animate = motion !== "reduced";

    const swap = () => {
      // Cancelled by a newer navigate?
      if (token !== _navToken) return;
      root.innerHTML = "";
      root.scrollTop = 0;
      if (kind === "welcome") root.appendChild(renderWelcome());
      else if (kind === "module") root.appendChild(renderModule(id));
      else if (kind === "practice") root.appendChild(renderPracticeSet(id));
      else if (kind === "exam") root.appendChild(renderExam());
      // Trigger enter animation (drop any leftover class first).
      root.classList.remove("leaving");
      if (animate) {
        root.classList.remove("entering");
        // force reflow before re-adding so the animation restarts
        void root.offsetWidth;
        root.classList.add("entering");
      }
    };

    if (animate && root.firstChild) {
      root.classList.add("leaving");
      setTimeout(swap, 200);  // matches viewOut duration
    } else {
      swap();
    }

    document.body.classList.remove("menu-open");
  }

  function setCrumbs() {
    const crumbs = $("#crumbs");
    crumbs.innerHTML = "";
    const view = state.activeView;
    if (!view) return;
    if (view.kind === "welcome") crumbs.innerHTML = "<strong>Home</strong>";
    else if (view.kind === "module") {
      const m = window.MODULES[view.id];
      crumbs.innerHTML = `Tutorial &nbsp;/&nbsp; <strong>${escapeHtml(m.title)}</strong>`;
    } else if (view.kind === "practice") {
      const p = window.PRACTICE_SETS[view.id];
      crumbs.innerHTML = `Practice &nbsp;/&nbsp; <strong>${escapeHtml(p.title)}</strong>`;
    } else if (view.kind === "exam") {
      crumbs.innerHTML = `Exam &nbsp;/&nbsp; <strong>Final Exam</strong>`;
    }
  }

  // ----------------------------------------------------------------
  // Welcome view
  // ----------------------------------------------------------------
  function renderWelcome() {
    return el("div", { class: "view-narrow" }, [
      el("div", { class: "hero" }, [
        el("h1", { text: "Odoo Final-Stage Interview Prep" }),
        el("p", {
          text:
            "Prep for the 3-hour live technical interview: a recap of stage-1, a chapter on " +
            "live-coding craft, then deep dives into the algorithm families, SQL, database " +
            "design, OOP, and system design — with medium/hard questions throughout.",
        }),
      ]),
      el("div", { class: "card", html: `
<h2>How to navigate</h2>
<ul>
  <li><strong>Module 1</strong> is a compressed recap of the stage-1 algorithms tutorial —
  use it to find gaps worth re-reading.</li>
  <li><strong>Module 2</strong> is the live-coding craft chapter: the 6-step template,
  narration, hints, follow-ups. Read it before any of the problem modules.</li>
  <li><strong>Modules 3+</strong> are the deep dives, each ending in a Practice Set of
  medium/hard questions. Attempt every question <em>out loud</em>, as if the interviewer
  were watching.</li>
  <li><strong>Final Exam</strong> deals 12 random questions from a curated pool spanning the
  whole course (algorithms + SQL, all runnable) — try it last, as a dress rehearsal.</li>
</ul>
<h2>The code workbench</h2>
<ul>
  <li>Coding questions run in <strong>Python</strong> (Pyodide, loads on first run, ~5 seconds)
  or <strong>JavaScript</strong> — switch per question with the language toggle.</li>
  <li>Test feedback shows <em>only</em> pass/fail and your coverage %. To see what was actually
  expected vs returned, click <strong>Reveal diff</strong> on the failing case.</li>
  <li>SQL questions with fixtures run against a real in-browser SQLite (sql.js).</li>
  <li>Design questions have no sandbox — think your answer through fully, then
  <strong>Reveal approach</strong>.</li>
  <li>The <strong>Show answer</strong> modal opens with a "make sure you've tried it first"
  warning — honor it; the reference solutions teach far more after a real attempt.</li>
</ul>
<h2>Time yourself</h2>
<ul>
  <li>Every practice-set question has a <strong>Start timer</strong> chip. Click it before
  you begin; it auto-stops the first time all tests pass and rates you against the
  question's time budget (Lightning → Fast → On pace → Over budget → Slow).</li>
  <li>The <strong>Final Exam</strong> uses a single global timer. Click <em>Start exam</em>
  on the banner; it auto-finishes when every question passes, or hit <em>Finish exam</em>
  whenever you want to record your session.</li>
</ul>
<h2>Your progress is saved locally</h2>
<p>Everything persists in <code>localStorage</code> — solved set, timer history per question,
exam sessions, and the code you've written in each editor (auto-saved as you type, restored
when you reopen the workbench). Use the <strong>Reset</strong> button in the sidebar to wipe
all of it and start fresh.</p>
` }),
      el("div", { class: "btn-row" }, [
        el("button", {
          class: "btn primary",
          text: "Start Module 1 →",
          onclick: () => navigate("module", "M1"),
        }),
        el("button", {
          class: "btn ghost",
          text: "Skip to Final Exam",
          onclick: () => navigate("exam", null),
        }),
      ]),
    ]);
  }

  // ----------------------------------------------------------------
  // Module view
  // ----------------------------------------------------------------
  function renderModule(mid) {
    const m = window.MODULES[mid];
    const wrap = el("div", { class: "view-narrow" });

    for (const block of m.body) {
      if (block.kind === "html") {
        const div = el("div");
        div.innerHTML = block.html;
        wrap.appendChild(div);
      } else if (block.kind === "mcq") {
        wrap.appendChild(renderMCQ(block));
      }
    }

    // Footer: go to practice set (if this module has one)
    const psId = m.practiceSet;
    const ps = psId ? window.PRACTICE_SETS[psId] : null;
    const btnRow = el("div", { class: "btn-row" });
    if (ps) {
      btnRow.appendChild(el("button", {
        class: "btn primary",
        text: "Continue to " + ps.title.split(" — ")[0],
        onclick: () => navigate("practice", psId),
      }));
    }
    btnRow.appendChild(el("button", {
      class: "btn ghost",
      text: "Back to top",
      onclick: () => $("#view-container").scrollTo({ top: 0, behavior: "smooth" }),
    }));
    wrap.appendChild(btnRow);

    return wrap;
  }

  function renderMCQ(mcq) {
    const node = el("div", { class: "mcq" });
    node.appendChild(el("h4", { text: "Concept Check" }));
    node.appendChild(el("p", { html: mcq.q }));
    const opts = el("div", { class: "mcq-options" });
    let answered = false;
    const explainNode = el("div", { class: "mcq-explain hidden" });
    explainNode.innerHTML = mcq.explain || "";

    for (const opt of mcq.options) {
      const b = el("button", {
        class: "mcq-option",
        html: opt.label,
        onclick: () => {
          if (answered) return;
          answered = true;
          if (opt.correct) {
            b.classList.add("correct");
          } else {
            b.classList.add("wrong");
            // also highlight a correct one so the user learns
            const correctEl = [...opts.children].find(
              (c, i) => mcq.options[i].correct
            );
            if (correctEl) correctEl.classList.add("correct");
          }
          explainNode.classList.remove("hidden");
        },
      });
      opts.appendChild(b);
    }
    node.appendChild(opts);
    node.appendChild(explainNode);
    return node;
  }

  // ----------------------------------------------------------------
  // Practice set view
  // ----------------------------------------------------------------
  function renderPracticeSet(psid) {
    const ps = window.PRACTICE_SETS[psid];
    const wrap = el("div", { class: "view-narrow" });

    const solvedInSet = ps.qids.filter((qid) => state.solved.has(qid)).length;
    const totalInSet = ps.qids.length;

    wrap.appendChild(el("div", { class: "practice-banner" }, [
      el("div", { class: "practice-banner-head" }, [
        el("h2", { text: ps.title }),
        el("div", {
          class: "ps-progress-chip" + (solvedInSet === totalInSet ? " complete" : ""),
          html: `<strong>${solvedInSet}</strong> / ${totalInSet} solved`,
        }),
      ]),
      el("p", {
        class: "lead",
        text:
          "Questions are MIXED — they're not in the same order as the tutorial subsections, " +
          "so you have to recognise the pattern yourself. Try each one without revealing the answer first.",
      }),
    ]));

    // Shuffle the questions deterministically by ps id (so refresh keeps order)
    const order = stableShuffle(ps.qids, hashCode(psid));
    order.forEach((qid, idx) => wrap.appendChild(questionCard(qid, idx + 1)));

    return wrap;
  }

  // Deterministic shuffle so order is stable across reloads but mixed.
  function stableShuffle(arr, seed) {
    const out = arr.slice();
    let s = seed >>> 0;
    for (let i = out.length - 1; i > 0; i--) {
      // xorshift-ish
      s ^= s << 13; s >>>= 0;
      s ^= s >>> 17; s >>>= 0;
      s ^= s << 5;  s >>>= 0;
      const j = s % (i + 1);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
  function hashCode(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h;
  }

  // ----------------------------------------------------------------
  // Final Exam
  // ----------------------------------------------------------------
  function renderExam() {
    if (!window.FINAL_EXAM_POOL.length) {
      return el("div", { class: "view-narrow" }, [
        el("div", { class: "hero" }, [
          el("h1", { text: "Final Exam — coming soon" }),
          el("p", { text:
            "The exam pool fills once the remaining modules land. Work through the " +
            "practice sets in the meantime." }),
        ]),
      ]);
    }
    if (state.examSeed == null) state.examSeed = Math.floor(Math.random() * 1e9);
    const seed = state.examSeed;
    const pool = window.FINAL_EXAM_POOL.slice();
    const chosen = stableShuffle(pool, seed).slice(0, Math.min(12, pool.length));

    const wrap = el("div", { class: "view-narrow" });

    // Exam timer: one clock for the whole exam, displayed above the scoreboard.
    const examTimer = makeExamTimer(chosen);
    wrap.appendChild(examTimer.node);

    const sb = el("div", { class: "exam-scoreboard" });
    const counters = {
      attempted: el("div", { class: "stat-val", text: "0" }),
      solved: el("div", { class: "stat-val", text: "0" }),
      total: el("div", { class: "stat-val", text: String(chosen.length) }),
    };
    sb.appendChild(el("div", { class: "stat" }, [
      counters.solved, el("div", { class: "stat-lab", text: "Passed" }),
    ]));
    sb.appendChild(el("div", { class: "stat" }, [
      counters.attempted, el("div", { class: "stat-lab", text: "Attempted" }),
    ]));
    sb.appendChild(el("div", { class: "stat" }, [
      counters.total, el("div", { class: "stat-lab", text: "Questions" }),
    ]));
    sb.appendChild(el("div", { class: "spacer" }));
    sb.appendChild(el("button", {
      class: "btn ghost small",
      text: "Reshuffle",
      onclick: () => { state.examSeed = Math.floor(Math.random() * 1e9); navigate("exam", null); },
    }));
    wrap.appendChild(sb);

    wrap.appendChild(el("div", { class: "card", html: `
<h2>Final Exam</h2>
<p>Twelve questions dealt at random from a curated pool spanning the whole course — algorithm
problems plus runnable SQL, in roughly the real interview's 2:1 ratio. You may have met some in
the practice sets; solving them again <em>cold</em>, without the module's context around them, is
the point. <strong>Work each problem to completion before revealing the answer.</strong> Coverage
updates live as you pass tests.</p>
<div class="callout tip" style="margin-top:14px">
  <div class="callout-title">Topic tags are hidden</div>
  Only difficulty and time-estimate are shown next to each question — the algorithm family
  (DP, Sliding Window, BFS, ...) is intentionally withheld so the problem statement is your
  only clue, just like the live interview.
</div>
<p class="note-soft">Tip: simulate interview pressure — narrate out loud, cap yourself at
~10 minutes per question (2 hours for the dozen). If you're not done at the cap, finish for
learning's sake but score honestly.</p>
` }));

    // Track per-question state for the scoreboard.
    const passSet = new Set();
    const attemptSet = new Set();
    const bump = (node) => {
      if (document.body.dataset.motion === "reduced") return;
      node.classList.remove("bump");
      // Force reflow so re-adding restarts the animation
      void node.offsetWidth;
      node.classList.add("bump");
      setTimeout(() => node.classList.remove("bump"), 520);
    };
    chosen.forEach((qid, idx) => {
      const card = questionCard(qid, idx + 1, {
        hideTopicTags: true,   // Exam: hide topic tags so the family isn't telegraphed.
        examMode: true,        // Suppress per-question timer; the global exam timer governs.
        onPass: () => {
          if (!passSet.has(qid)) {
            passSet.add(qid);
            counters.solved.textContent = String(passSet.size);
            bump(counters.solved);
          }
          examTimer.markPass(qid);
        },
        onAttempt: () => {
          if (!attemptSet.has(qid)) {
            attemptSet.add(qid);
            counters.attempted.textContent = String(attemptSet.size);
            bump(counters.attempted);
          }
          examTimer.markAttempt(qid);
        },
      });
      wrap.appendChild(card);
    });

    return wrap;
  }

  // ----------------------------------------------------------------
  // Per-question timer widget (practice sets only)
  //
  // Returns { node, onAllPass(), isRunning() }. The runner calls
  // onAllPass() the first time every test passes; we stop the clock,
  // record the time, and freeze the chip into a rating display.
  // ----------------------------------------------------------------
  function makeQuestionTimer(qid) {
    const wrap = el("div", { class: "q-timer idle" });
    const startBtn = el("button", { class: "btn small timer-start", text: "Start timer" });
    const liveLabel = el("span", { class: "timer-live hidden", text: "00:00" });
    const stopBtn = el("button", { class: "btn ghost small timer-stop hidden", text: "Cancel" });
    const result = el("div", { class: "timer-result hidden" });
    wrap.appendChild(startBtn);
    wrap.appendChild(liveLabel);
    wrap.appendChild(stopBtn);
    wrap.appendChild(result);

    let startTs = null;
    let tickHandle = null;
    let recordedThisRun = false;

    function renderBest() {
      const t = state.timing[qid];
      if (!t || t.bestSec == null) {
        result.classList.add("hidden");
        return;
      }
      const q = window.QUESTIONS[qid];
      const r = rateTime(t.bestSec, parseTimeBudget(q && q.time));
      const last = t.attempts[t.attempts.length - 1];
      result.innerHTML =
        `<span class="rating ${r.key}">${r.label}</span>` +
        `<span class="timer-best">best ${formatMMSS(t.bestSec)}</span>` +
        `<span class="timer-meta">${t.attempts.length} attempt${t.attempts.length === 1 ? "" : "s"}</span>`;
      result.title = t.attempts.slice(-5).map((a) => {
        const r2 = rateTime(a.sec, parseTimeBudget(q && q.time));
        return `${formatMMSS(a.sec)}  ${r2.label}  ${new Date(a.date).toLocaleString()}`;
      }).join("\n");
      result.classList.remove("hidden");
    }
    renderBest();

    function tick() {
      const sec = Math.floor((Date.now() - startTs) / 1000);
      liveLabel.textContent = formatMMSS(sec);
    }
    function start() {
      if (startTs) return;
      startTs = Date.now();
      recordedThisRun = false;
      wrap.classList.remove("idle", "done");
      wrap.classList.add("running");
      startBtn.classList.add("hidden");
      liveLabel.classList.remove("hidden");
      stopBtn.classList.remove("hidden");
      result.classList.add("hidden");
      liveLabel.textContent = "00:00";
      tick();
      tickHandle = setInterval(tick, 1000);
    }
    function cancel() {
      if (!startTs) return;
      clearInterval(tickHandle);
      tickHandle = null;
      startTs = null;
      wrap.classList.remove("running");
      wrap.classList.add("idle");
      liveLabel.classList.add("hidden");
      stopBtn.classList.add("hidden");
      startBtn.classList.remove("hidden");
      startBtn.textContent = "Start timer";
      renderBest();
    }
    function onAllPass() {
      // First all-pass within this run records the time; further passes are no-ops.
      if (!startTs || recordedThisRun) return;
      const sec = Math.floor((Date.now() - startTs) / 1000);
      recordedThisRun = true;
      clearInterval(tickHandle);
      tickHandle = null;
      startTs = null;
      wrap.classList.remove("running");
      wrap.classList.add("done");
      liveLabel.classList.add("hidden");
      stopBtn.classList.add("hidden");
      startBtn.classList.remove("hidden");
      startBtn.textContent = "Restart timer";
      recordSolveTime(qid, sec);
      renderBest();
      const q = window.QUESTIONS[qid];
      const r = rateTime(sec, parseTimeBudget(q && q.time));
      toast(`Solved in ${formatMMSS(sec)} — ${r.label}`, "good", 3200);
    }

    startBtn.onclick = start;
    stopBtn.onclick = cancel;

    return {
      node: wrap,
      onAllPass,
      isRunning: () => startTs != null,
    };
  }

  // ----------------------------------------------------------------
  // Exam timer (one clock for the whole final exam)
  //
  // markPass(qid) is called by each question card when all its tests
  // pass; when every chosen question has been marked, the timer
  // auto-finishes and records the session.
  // ----------------------------------------------------------------
  function makeExamTimer(chosenQids) {
    const banner = el("div", { class: "exam-timer-banner idle" });
    const left = el("div", { class: "etb-left" });
    const title = el("div", { class: "etb-title", text: "Exam timer" });
    const sub = el("div", { class: "etb-sub", text: "Click Start exam to begin the clock." });
    left.appendChild(title);
    left.appendChild(sub);
    const live = el("div", { class: "etb-live", text: "00:00" });
    const startBtn = el("button", { class: "btn primary etb-start", text: "▶ Start exam" });
    const endBtn = el("button", { class: "btn etb-end hidden", text: "Finish exam" });
    banner.appendChild(left);
    banner.appendChild(live);
    banner.appendChild(startBtn);
    banner.appendChild(endBtn);

    let startTs = null, tickHandle = null;
    const perQ = {};
    let attemptedSet = new Set();
    let finished = false;

    function renderLast() {
      const sessions = (state.examHistory && state.examHistory.sessions) || [];
      if (!sessions.length) {
        sub.textContent = "Click Start exam to begin the clock.";
        return;
      }
      const last = sessions[sessions.length - 1];
      sub.innerHTML =
        `Last attempt: <strong>${formatMMSS(last.totalSec)}</strong> · ` +
        `${last.passed}/${last.total} passed · ` +
        `${new Date(last.date).toLocaleString()}`;
    }
    renderLast();

    function tick() {
      live.textContent = formatMMSS((Date.now() - startTs) / 1000);
    }
    function start() {
      if (startTs) return;
      startTs = Date.now();
      finished = false;
      for (const k in perQ) delete perQ[k];
      attemptedSet = new Set();
      banner.classList.remove("idle", "done");
      banner.classList.add("running");
      startBtn.classList.add("hidden");
      endBtn.classList.remove("hidden");
      sub.textContent = "Clock is running. Auto-stops when all questions pass.";
      live.textContent = "00:00";
      tick();
      tickHandle = setInterval(tick, 1000);
    }
    function finish() {
      if (!startTs || finished) return;
      finished = true;
      const totalSec = Math.floor((Date.now() - startTs) / 1000);
      clearInterval(tickHandle);
      tickHandle = null;
      banner.classList.remove("running");
      banner.classList.add("done");
      startBtn.classList.remove("hidden");
      startBtn.textContent = "▶ Start new attempt";
      endBtn.classList.add("hidden");
      const passed = Object.keys(perQ).length;
      recordExamSession({
        date: new Date().toISOString(),
        totalSec,
        passed,
        attempted: attemptedSet.size,
        total: chosenQids.length,
        perQ: Object.assign({}, perQ),
      });
      renderLast();
      toast(
        `Exam finished: ${formatMMSS(totalSec)} · ${passed}/${chosenQids.length} passed`,
        passed === chosenQids.length ? "good" : "info",
        4500
      );
      startTs = null;
    }
    function markAttempt(qid) {
      if (!startTs) return;
      attemptedSet.add(qid);
    }
    function markPass(qid) {
      if (!startTs || perQ[qid] != null) return;
      perQ[qid] = Math.floor((Date.now() - startTs) / 1000);
      if (Object.keys(perQ).length >= chosenQids.length) finish();
    }

    startBtn.onclick = start;
    endBtn.onclick = () => {
      if (confirm("Finish the exam now and record this session?")) finish();
    };

    return {
      node: banner,
      markPass,
      markAttempt,
      isRunning: () => startTs != null,
    };
  }

  // ----------------------------------------------------------------
  // Question card
  // ----------------------------------------------------------------
  function difficultyTag(d) {
    const key = (d || "").toLowerCase().replace(/[^a-z-]/g, "-").replace(/-+/g, "-");
    return `tag diff-${key}`;
  }

  function questionCard(qid, idx, hooks = {}) {
    const q = window.QUESTIONS[qid];
    if (!q) return el("div", { text: "Missing question: " + qid });

    const card = el("div", { class: "q-card" + (state.solved.has(qid) ? " solved" : "") });

    // Header
    const head = el("div", { class: "q-head" });
    head.appendChild(el("span", { class: "q-id", text: q.id }));
    head.appendChild(el("div", { class: "q-title", text: `${idx}. ${q.title}` }));
    const tags = el("div", { class: "q-tags" });
    tags.appendChild(el("span", { class: difficultyTag(q.difficulty), text: q.difficulty }));
    // In exam mode, suppress topic tags — they telegraph the algorithm family.
    if (!hooks.hideTopicTags) {
      (q.tags || []).forEach((t) => tags.appendChild(el("span", { class: "tag", text: t })));
    }
    tags.appendChild(el("span", { class: "tag", text: q.time }));
    if (q.type === "sql") tags.appendChild(el("span", { class: "tag", text: "SQL" }));
    if (q.type === "design") tags.appendChild(el("span", { class: "tag", text: "Design" }));
    head.appendChild(tags);
    card.appendChild(head);

    // Statement
    card.appendChild(el("div", { class: "q-statement", html: q.statement }));
    if (q.examples) card.appendChild(el("pre", { class: "q-examples", text: q.examples }));

    // Actions
    const actions = el("div", { class: "q-actions" });
    if (q.type === "python") {
      // Per-question timer chip (practice sets only; the exam has one global timer).
      const timer = hooks.examMode ? null : makeQuestionTimer(qid);
      if (timer) actions.appendChild(timer.node);

      const tryBtn = el("button", {
        class: "btn primary",
        text: "Try in workbench",
      });
      actions.appendChild(tryBtn);

      // Merge the caller's hooks with the timer's auto-record on all-pass.
      const runnerHooks = {
        onAttempt: () => { if (hooks.onAttempt) hooks.onAttempt(); },
        onPass: () => {
          if (timer) timer.onAllPass();
          if (hooks.onPass) hooks.onPass();
        },
      };
      const runner = buildRunnerPanel(qid, runnerHooks);
      runner.classList.add("collapsed");
      tryBtn.onclick = () => {
        const willOpen = runner.classList.contains("collapsed");
        runner.classList.toggle("collapsed");
        tryBtn.textContent = willOpen ? "Hide workbench" : "Try in workbench";
        if (willOpen) {
          // Wait for the open animation to settle before scrolling so
          // the runner's final position is what the smooth scroll targets.
          setTimeout(() => {
            runner.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }, 220);
        }
      };

      actions.appendChild(el("button", {
        class: "btn",
        text: "Hint",
        onclick: () => toast("Hint: " + q.hint, "info", 4200),
      }));
      actions.appendChild(el("button", {
        class: "btn ghost",
        text: "Show answer",
        onclick: () => openAnswerModal(qid),
      }));
      const markBtn = el("button", {
        class: "btn ghost small",
        text: state.solved.has(qid) ? "Mark unsolved" : "Mark solved",
        onclick: () => {
          if (state.solved.has(qid)) { unmarkSolved(qid); card.classList.remove("solved"); markBtn.textContent = "Mark solved"; }
          else { markSolved(qid); card.classList.add("solved"); markBtn.textContent = "Mark unsolved"; }
        },
      });
      actions.appendChild(markBtn);

      card.appendChild(actions);
      card.appendChild(runner);
    } else if (q.sqlSchema && q.tests && q.tests.length) {
      // SQL flow with a real workbench (sql.js SQLite WASM)
      const timer = hooks.examMode ? null : makeQuestionTimer(qid);
      if (timer) actions.appendChild(timer.node);

      const tryBtn = el("button", { class: "btn primary", text: "Try in workbench" });
      actions.appendChild(tryBtn);

      const runnerHooks = {
        onAttempt: () => { if (hooks.onAttempt) hooks.onAttempt(); },
        onPass: () => {
          if (timer) timer.onAllPass();
          if (hooks.onPass) hooks.onPass();
        },
      };
      const sqlPanel = buildSqlRunnerPanel(qid, runnerHooks);
      sqlPanel.classList.add("collapsed");
      tryBtn.onclick = () => {
        const willOpen = sqlPanel.classList.contains("collapsed");
        sqlPanel.classList.toggle("collapsed");
        tryBtn.textContent = willOpen ? "Hide workbench" : "Try in workbench";
        if (willOpen) {
          setTimeout(() => {
            sqlPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }, 220);
        }
      };

      actions.appendChild(el("button", {
        class: "btn",
        text: "Hint",
        onclick: () => toast("Hint: " + q.hint, "info", 4500),
      }));
      actions.appendChild(el("button", {
        class: "btn ghost",
        text: "Show answer",
        onclick: () => openAnswerModal(qid),
      }));
      const markBtn = el("button", {
        class: "btn ghost small",
        text: state.solved.has(qid) ? "Mark unsolved" : "Mark solved",
        onclick: () => {
          if (state.solved.has(qid)) { unmarkSolved(qid); card.classList.remove("solved"); markBtn.textContent = "Mark solved"; }
          else { markSolved(qid); card.classList.add("solved"); markBtn.textContent = "Mark unsolved"; }
        },
      });
      actions.appendChild(markBtn);

      card.appendChild(actions);
      card.appendChild(sqlPanel);
    } else {
      // Answer-only flow: covers system-design (type: "design") and SQL questions
      // that don't have a runnable fixture. The framing text and button labels shift
      // by type; both open the answer modal for the reveal.
      const isDesign = q.type === "design";
      card.appendChild(el("div", { class: "note-soft",
        text: isDesign
          ? "This is a discussion / design question. Think it through fully — data model, " +
            "trade-offs, edge cases — before you reveal the reference approach."
          : "This SQL question doesn't have a runnable fixture yet — read the hint, write your " +
            "query in a separate editor, then compare with the reference answer." }));
      if (q.hint) {
        actions.appendChild(el("button", {
          class: "btn",
          text: "Hint",
          onclick: () => toast("Hint: " + q.hint, "info", 4500),
        }));
      }
      actions.appendChild(el("button", {
        class: "btn primary",
        text: isDesign ? "Reveal approach" : "Show answer",
        onclick: () => openAnswerModal(qid),
      }));
      const markBtn = el("button", {
        class: "btn ghost small",
        text: state.solved.has(qid) ? "Mark unsolved" : "Mark solved",
        onclick: () => {
          if (state.solved.has(qid)) { unmarkSolved(qid); card.classList.remove("solved"); markBtn.textContent = "Mark solved"; }
          else { markSolved(qid); card.classList.add("solved"); markBtn.textContent = "Mark unsolved"; }
        },
      });
      actions.appendChild(markBtn);
      card.appendChild(actions);
    }

    return card;
  }

  // ----------------------------------------------------------------
  // Code runner panel
  // ----------------------------------------------------------------
  function buildRunnerPanel(qid, hooks = {}) {
    const q = window.QUESTIONS[qid];
    const wrap = el("div", { class: "runner" });

    // Available languages for this question.
    const langs = [{ id: "python", label: "Python" }];
    if (q.js) langs.push({ id: "javascript", label: "JavaScript" });
    let currentLang = langs[0].id;     // start in Python

    // Helpers to return language-specific bits.
    function impl() {
      return currentLang === "javascript" ? q.js : q;
    }
    function langStarter()    { return impl().starter || ""; }
    function langSignature()  { return impl().signature || ""; }
    function langFunctionName() { return impl().functionName || ""; }

    const sigEl = el("div", { class: "runner-signature", text: langSignature() });
    const header = el("div", { class: "runner-header" });
    header.appendChild(sigEl);

    // Language switcher (segmented control), only shown if >1 language.
    const langSwitch = el("div", { class: "lang-switch" });
    if (langs.length > 1) {
      langs.forEach((L) => {
        const b = el("button", {
          class: "lang-seg" + (L.id === currentLang ? " active" : ""),
          text: L.label,
          "data-lang": L.id,
        });
        b.onclick = () => switchLang(L.id);
        langSwitch.appendChild(b);
      });
      header.appendChild(langSwitch);
    } else {
      header.appendChild(el("div", {
        html: `<span class="status-pill status-idle">${q.tests.length} test cases</span>`,
      }));
    }
    wrap.appendChild(header);

    const editor = el("textarea", {
      class: "editor",
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
    });
    // Load persisted draft if present, otherwise start with the question's starter code.
    editor.value = getDraft(qid, currentLang) || langStarter();

    // Stash per-language draft so flipping back doesn't lose work mid-session.
    const drafts = {};
    drafts[currentLang] = editor.value;
    if (q.js) {
      const otherLang = currentLang === "python" ? "javascript" : "python";
      drafts[otherLang] = getDraft(qid, otherLang) || (otherLang === "javascript" ? (q.js.starter || "") : (q.starter || ""));
    }

    // Debounced persist of the active editor draft.
    let draftSaveT = null;
    function persistDraftSoon() {
      clearTimeout(draftSaveT);
      draftSaveT = setTimeout(() => setDraft(qid, currentLang, editor.value), 500);
    }

    function switchLang(next) {
      if (next === currentLang) return;
      drafts[currentLang] = editor.value;
      setDraft(qid, currentLang, editor.value);    // persist current before swap
      currentLang = next;
      editor.value = drafts[currentLang] || getDraft(qid, currentLang) || langStarter();
      sigEl.textContent = langSignature();
      // Toggle active state
      [...langSwitch.children].forEach((b) => {
        b.classList.toggle("active", b.dataset.lang === currentLang);
      });
      // Clear previous results when switching language
      results.innerHTML = "";
      log.classList.remove("show");
      covBar.firstChild.style.width = "0%";
      covText.textContent = "Coverage: —";
      covText.classList.remove("perfect");
      wrap.classList.remove("perfect");
    }
    // Tab key inserts 4 spaces inside the textarea.
    editor.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = editor.selectionStart, end = editor.selectionEnd;
        const v = editor.value;
        editor.value = v.slice(0, start) + "    " + v.slice(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
        persistDraftSoon();
      }
    });
    editor.addEventListener("input", persistDraftSoon);
    wrap.appendChild(editor);

    // Toolbar
    const toolbar = el("div", { class: "runner-toolbar" });
    const runBtn = el("button", { class: "btn primary", text: "Run tests" });
    const resetBtn = el("button", { class: "btn", text: "Reset editor" });
    const covBar = el("div", { class: "coverage-bar" }, [
      el("div", { class: "coverage-fill" }),
    ]);
    const covText = el("div", { class: "coverage-text", text: "Coverage: —" });
    toolbar.appendChild(runBtn);
    toolbar.appendChild(resetBtn);
    toolbar.appendChild(covBar);
    toolbar.appendChild(covText);
    wrap.appendChild(toolbar);

    const log = el("pre", { class: "runner-log" });
    wrap.appendChild(log);

    const results = el("div", { class: "test-results" });
    wrap.appendChild(results);

    resetBtn.onclick = () => {
      const starterNow = langStarter();
      if (editor.value === starterNow) return;
      if (!confirm("Reset editor to starter code?")) return;
      editor.value = starterNow;
      drafts[currentLang] = starterNow;
      setDraft(qid, currentLang, starterNow);
    };

    runBtn.onclick = async () => {
      results.innerHTML = "";
      log.classList.remove("show");
      wrap.classList.remove("perfect");
      covText.classList.remove("perfect");
      runBtn.disabled = true;
      const orig = runBtn.textContent;
      runBtn.innerHTML = `<span class="spinner"></span> Running…`;
      try {
        if (hooks.onAttempt) hooks.onAttempt();
        drafts[currentLang] = editor.value;   // persist latest draft
        setDraft(qid, currentLang, editor.value);  // also write to localStorage immediately
        const fnName = langFunctionName();
        const out = (currentLang === "javascript")
          ? await window.Runner.runTestsJs(editor.value, fnName, q.tests)
          : await window.Runner.runTests(editor.value, fnName, q.tests);
        renderTestResults(results, covBar, covText, out);
        const passed = out.filter((r) => r.passed).length;
        const total = out.length;
        if (passed === total && total > 0) {
          markSolved(qid);
          wrap.classList.add("perfect");
          covText.classList.add("perfect");
          // Briefly remove the glow class so it can be re-applied next time
          setTimeout(() => wrap.classList.remove("perfect"), 1500);
          toast(`All ${total} tests passed!`, "good", 2400);
          if (hooks.onPass) hooks.onPass();
        } else {
          toast(`${passed} / ${total} passing`, passed > 0 ? "info" : "bad", 2400);
        }
      } catch (e) {
        log.textContent = String(e.message || e);
        log.classList.add("show");
        toast("Runner error — see log", "bad", 3500);
      } finally {
        runBtn.disabled = false;
        runBtn.textContent = orig;
      }
    };

    return wrap;
  }

  // ----------------------------------------------------------------
  // SQL workbench panel
  //
  // Reuses the .runner shell but:
  //   - shows the fixture schema in a collapsible block
  //   - one editor (no language switcher)
  //   - runs via Runner.runSql() against the question's sqlSchema
  //   - results are rendered as side-by-side result-set tables
  // ----------------------------------------------------------------
  function buildSqlRunnerPanel(qid, hooks = {}) {
    const q = window.QUESTIONS[qid];
    const wrap = el("div", { class: "runner sql-runner" });

    const header = el("div", { class: "runner-header" });
    header.appendChild(el("div", { class: "runner-signature", text: "SQLite — write your query below" }));
    header.appendChild(el("div", {
      html: `<span class="status-pill status-idle">${q.tests.length} test case${q.tests.length === 1 ? "" : "s"}</span>`,
    }));
    wrap.appendChild(header);

    // Collapsible schema/fixture preview
    const schemaWrap = el("div", { class: "sql-schema" });
    const schemaBtn = el("button", { class: "sql-schema-toggle", text: "Show fixture schema ▾" });
    const schemaPre = el("pre", { class: "sql-schema-body collapsed" });
    schemaPre.textContent = q.sqlSchema || "";
    schemaBtn.onclick = () => {
      const willOpen = schemaPre.classList.contains("collapsed");
      schemaPre.classList.toggle("collapsed");
      schemaBtn.textContent = willOpen ? "Hide fixture schema ▴" : "Show fixture schema ▾";
    };
    schemaWrap.appendChild(schemaBtn);
    schemaWrap.appendChild(schemaPre);
    wrap.appendChild(schemaWrap);

    // Editor
    const editor = el("textarea", {
      class: "editor",
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
    });
    editor.value = getDraft(qid, "sql") || q.sqlStarter || "-- Your SQL query here\nSELECT\n";

    let draftSaveT = null;
    function persistDraftSoon() {
      clearTimeout(draftSaveT);
      draftSaveT = setTimeout(() => setDraft(qid, "sql", editor.value), 500);
    }
    editor.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = editor.selectionStart, end = editor.selectionEnd;
        const v = editor.value;
        editor.value = v.slice(0, start) + "    " + v.slice(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
        persistDraftSoon();
      }
    });
    editor.addEventListener("input", persistDraftSoon);
    wrap.appendChild(editor);

    // Toolbar
    const toolbar = el("div", { class: "runner-toolbar" });
    const runBtn = el("button", { class: "btn primary", text: "Run query" });
    const resetBtn = el("button", { class: "btn", text: "Reset editor" });
    const covBar = el("div", { class: "coverage-bar" }, [
      el("div", { class: "coverage-fill" }),
    ]);
    const covText = el("div", { class: "coverage-text", text: "Coverage: —" });
    toolbar.appendChild(runBtn);
    toolbar.appendChild(resetBtn);
    toolbar.appendChild(covBar);
    toolbar.appendChild(covText);
    wrap.appendChild(toolbar);

    const log = el("pre", { class: "runner-log" });
    wrap.appendChild(log);

    const results = el("div", { class: "test-results" });
    wrap.appendChild(results);

    resetBtn.onclick = () => {
      const starterNow = q.sqlStarter || "-- Your SQL query here\nSELECT\n";
      if (editor.value === starterNow) return;
      if (!confirm("Reset editor to starter code?")) return;
      editor.value = starterNow;
      setDraft(qid, "sql", starterNow);
    };

    runBtn.onclick = async () => {
      results.innerHTML = "";
      log.classList.remove("show");
      wrap.classList.remove("perfect");
      covText.classList.remove("perfect");
      runBtn.disabled = true;
      const orig = runBtn.textContent;
      runBtn.innerHTML = `<span class="spinner"></span> Running…`;
      try {
        if (hooks.onAttempt) hooks.onAttempt();
        setDraft(qid, "sql", editor.value);

        const out = await window.Runner.runSql(editor.value, q.sqlSchema, q.tests);
        renderSqlResults(results, covBar, covText, out);

        const passed = out.filter((r) => r.passed).length;
        const total = out.length;
        if (passed === total && total > 0) {
          markSolved(qid);
          wrap.classList.add("perfect");
          covText.classList.add("perfect");
          setTimeout(() => wrap.classList.remove("perfect"), 1500);
          toast(`All ${total} test${total === 1 ? "" : "s"} passed!`, "good", 2400);
          if (hooks.onPass) hooks.onPass();
        } else {
          toast(`${passed} / ${total} passing`, passed > 0 ? "info" : "bad", 2400);
        }
      } catch (e) {
        log.textContent = String(e.message || e);
        log.classList.add("show");
        toast("Runner error — see log", "bad", 3500);
      } finally {
        runBtn.disabled = false;
        runBtn.textContent = orig;
      }
    };

    return wrap;
  }

  // Render a SQL-shaped result: actual rows vs expected rows as compact
  // tables, with the same .tc-row pass/fail/collapse semantics.
  function renderSqlResults(container, covBar, covText, results) {
    const total = results.length;
    const passed = results.filter((r) => r.passed).length;
    const pct = total === 0 ? 0 : Math.round((passed / total) * 100);
    covBar.firstChild.style.width = pct + "%";
    covText.textContent = `Coverage: ${passed}/${total}  (${pct}%)`;

    results.forEach((r, i) => {
      const kind = r.error ? "error" : (r.passed ? "pass" : "fail");
      const symbol = kind === "pass" ? "✓" : kind === "error" ? "!" : "✕";
      const label = `${r.input || "Test " + (i + 1)}: ${
        kind === "pass" ? "PASS" : kind === "error" ? "ERROR" : "FAIL"
      }`;
      const item = el("div", { class: "tc-item" });
      const row = el("div", { class: "tc-row " + kind });
      row.style.setProperty("--i", String(i));
      row.appendChild(el("div", { class: "tc-status", text: symbol }));
      row.appendChild(el("div", { class: "tc-label", text: label }));

      const detail = el("div", { class: "tc-detail collapsed" });
      const detailInner = el("div");
      detailInner.appendChild(buildSqlDiff(r));
      detail.appendChild(detailInner);

      const revealBtn = el("button", {
        class: "tc-reveal",
        text: kind === "pass" ? "Show result" : "Reveal diff",
        onclick: () => {
          const willOpen = detail.classList.contains("collapsed");
          detail.classList.toggle("collapsed");
          revealBtn.textContent = willOpen
            ? "Hide"
            : (kind === "pass" ? "Show result" : "Reveal diff");
        },
      });
      row.appendChild(revealBtn);
      item.appendChild(row);
      item.appendChild(detail);
      container.appendChild(item);
    });
  }

  function buildSqlDiff(r) {
    const box = el("div", { class: "sql-diff" });
    if (r.error) {
      const errPre = el("pre", { class: "tc-diff" });
      errPre.innerHTML =
        `<span class="bad">SQL error:</span> ${escapeHtml(r.error)}`;
      box.appendChild(errPre);
      return box;
    }
    const cmpLabel = r.equality === "ordered" ? "order-sensitive" : "set (order ignored)";
    const meta = el("div", { class: "sql-meta", text: `Compare: ${cmpLabel}` });
    box.appendChild(meta);
    box.appendChild(el("div", { class: "sql-pair" }, [
      el("div", { class: "sql-pair-block" }, [
        el("div", { class: "sql-pair-title", text: "Expected" }),
        renderSqlTable(r.expected, "expected"),
      ]),
      el("div", { class: "sql-pair-block" }, [
        el("div", { class: "sql-pair-title", text: "Actual" }),
        renderSqlTable(r.actual, r.passed ? "expected" : "actual"),
      ]),
    ]));
    return box;
  }

  function renderSqlTable(rs, kind) {
    if (!rs || !rs.columns || !rs.columns.length) {
      return el("div", { class: "sql-empty", text: "(no result set)" });
    }
    const tbl = el("table", { class: "sql-table " + (kind || "") });
    const thead = el("thead");
    const tr = el("tr");
    rs.columns.forEach((c) => tr.appendChild(el("th", { text: String(c) })));
    thead.appendChild(tr);
    tbl.appendChild(thead);
    const tbody = el("tbody");
    (rs.rows || []).slice(0, 50).forEach((row) => {
      const r = el("tr");
      row.forEach((v) => r.appendChild(el("td", {
        text: v === null || v === undefined ? "NULL" : String(v),
        class: v === null || v === undefined ? "null" : "",
      })));
      tbody.appendChild(r);
    });
    if ((rs.rows || []).length > 50) {
      const r = el("tr", { class: "sql-truncated" });
      r.appendChild(el("td", {
        text: `… ${rs.rows.length - 50} more row(s) hidden`,
        colspan: String(rs.columns.length),
      }));
      tbody.appendChild(r);
    }
    tbl.appendChild(tbody);
    return tbl;
  }

  // ----------------------------------------------------------------
  // Test result rendering — coverage % only by default; reveal on click.
  // ----------------------------------------------------------------
  function renderTestResults(container, covBar, covText, results) {
    const total = results.length;
    const passed = results.filter((r) => r.passed).length;
    const pct = total === 0 ? 0 : Math.round((passed / total) * 100);
    covBar.firstChild.style.width = pct + "%";
    covText.textContent = `Coverage: ${passed}/${total}  (${pct}%)`;

    results.forEach((r, i) => {
      const kind = r.error ? "error" : (r.passed ? "pass" : "fail");
      const symbol = kind === "pass" ? "✓" : kind === "error" ? "!" : "✕";
      const label = `Test ${i + 1}: ${kind === "pass" ? "PASS"
                                    : kind === "error" ? "ERROR"
                                    : "FAIL"}`;
      const item = el("div", { class: "tc-item" });
      const row = el("div", { class: "tc-row " + kind });
      // Per-row stagger index — picked up by CSS animation-delay.
      row.style.setProperty("--i", String(i));
      row.appendChild(el("div", { class: "tc-status", text: symbol }));
      row.appendChild(el("div", { class: "tc-label", text: label }));

      // Smooth collapse: an inner wrapper handles overflow; toggling
      // `.collapsed` on the outer animates grid-template-rows from 1fr → 0fr.
      const detail = el("div", { class: "tc-detail collapsed" });
      const detailInner = el("div");
      detailInner.appendChild(buildDiff(r));
      detail.appendChild(detailInner);

      const revealBtn = el("button", {
        class: "tc-reveal",
        text: kind === "pass" ? "Show case" : "Reveal diff",
        onclick: () => {
          const willOpen = detail.classList.contains("collapsed");
          detail.classList.toggle("collapsed");
          revealBtn.textContent = willOpen
            ? "Hide"
            : (kind === "pass" ? "Show case" : "Reveal diff");
        },
      });
      row.appendChild(revealBtn);
      item.appendChild(row);
      item.appendChild(detail);
      container.appendChild(item);
    });
  }

  function buildDiff(r) {
    const lines = [];
    lines.push(`<span class="label">Input   :</span> ${escapeHtml(JSON.stringify(r.input))}`);
    if (r.error) {
      lines.push(`<span class="bad">Error   :</span> ${escapeHtml(r.error)}`);
    } else {
      lines.push(`<span class="label">Expected:</span> ${escapeHtml(JSON.stringify(r.expected))}`);
      const got = JSON.stringify(r.actual);
      lines.push(
        `<span class="label">Actual  :</span> <span class="${r.passed ? "ok" : "bad"}">${escapeHtml(got)}</span>`
      );
    }
    if (r.equality && r.equality !== "exact") {
      lines.push(`<span class="label">Compare :</span> ${escapeHtml(r.equality)}`);
    }
    const pre = el("pre", { class: "tc-diff" });
    pre.innerHTML = lines.join("\n");
    return pre;
  }

  // ----------------------------------------------------------------
  // Answer modal
  // ----------------------------------------------------------------
  // Code block with a hover-revealed copy button.
  function codeBlock(source) {
    const wrap = el("div", { class: "pre-wrap" });
    const copyBtn = el("button", { class: "copy-btn", text: "Copy" });
    copyBtn.addEventListener("click", async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(source);
        } else {
          // Fallback: hidden textarea + execCommand
          const ta = document.createElement("textarea");
          ta.value = source;
          ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        copyBtn.textContent = "Copied!";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.textContent = "Copy";
          copyBtn.classList.remove("copied");
        }, 1400);
      } catch (_) {
        copyBtn.textContent = "Copy failed";
        setTimeout(() => { copyBtn.textContent = "Copy"; }, 1400);
      }
    });
    const pre = el("pre");
    pre.appendChild(el("code", { text: source }));
    wrap.appendChild(copyBtn);
    wrap.appendChild(pre);
    return wrap;
  }

  function openAnswerModal(qid) {
    const q = window.QUESTIONS[qid];
    $("#modal-title").textContent = `Answer — ${q.id} ${q.title}`;
    const body = $("#modal-body");
    body.innerHTML = "";

    body.appendChild(el("h4", { text: "Hint" }));
    body.appendChild(el("p", { html: q.hint }));

    body.appendChild(el("h4", { text: q.type === "sql" ? "SQL Solution" : "Reference Solution" }));
    body.appendChild(codeBlock(q.solution));

    if (q.explanation) {
      body.appendChild(el("h4", { text: "Why this works" }));
      body.appendChild(el("p", { html: q.explanation }));
    }

    body.appendChild(el("div", { class: "btn-row" }, [
      el("button", {
        class: "btn primary",
        text: state.solved.has(qid) ? "Mark unsolved" : "Mark solved",
        onclick: (e) => {
          if (state.solved.has(qid)) unmarkSolved(qid);
          else markSolved(qid);
          e.target.textContent = state.solved.has(qid) ? "Mark unsolved" : "Mark solved";
          // Also update card styling if visible
          $$(".q-card").forEach((c) => {
            const idEl = c.querySelector(".q-id");
            if (idEl && idEl.textContent === qid) c.classList.toggle("solved", state.solved.has(qid));
          });
        },
      }),
      el("button", { class: "btn ghost", text: "Close", onclick: closeAnswerModal }),
    ]));

    const m = $("#answer-modal");
    m.classList.remove("closing");
    m.classList.remove("hidden");
  }

  function closeAnswerModal() {
    const m = $("#answer-modal");
    if (m.classList.contains("hidden")) return;
    if (document.body.dataset.motion === "reduced") {
      m.classList.add("hidden");
      return;
    }
    m.classList.add("closing");
    setTimeout(() => {
      m.classList.remove("closing");
      m.classList.add("hidden");
    }, 200);
  }

  // ----------------------------------------------------------------
  // Boot
  // ----------------------------------------------------------------
  function init() {
    applyPrefs();
    buildNav();
    updateProgressUI();
    updateNavCheckmarks();
    setActiveNav();
    bindSettingsModal();

    // Clicking the Python status pill preloads Pyodide on demand.
    const statusPill = document.getElementById("pyodide-status");
    if (statusPill) {
      statusPill.style.cursor = "pointer";
      statusPill.title = "Click to load Python now (otherwise it loads on your first Run)";
      statusPill.setAttribute("role", "button");
      statusPill.setAttribute("tabindex", "0");
      const triggerPreload = async () => {
        if (statusPill.classList.contains("status-loading") ||
            statusPill.classList.contains("status-ready")) return;
        try {
          await window.Runner.ensurePyodide();
          toast("Python is ready.", "good");
        } catch (_) {
          toast("Failed to load Python — check your internet connection.", "bad");
        }
      };
      statusPill.addEventListener("click", triggerPreload);
      statusPill.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); triggerPreload(); }
      });
    }

    // Clicking the sidebar brand returns to Welcome.
    const brand = document.querySelector(".brand");
    if (brand) {
      brand.style.cursor = "pointer";
      brand.setAttribute("role", "link");
      brand.setAttribute("tabindex", "0");
      brand.addEventListener("click", () => navigate("welcome", null));
      brand.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault(); navigate("welcome", null);
        }
      });
    }

    $("#modal-close").addEventListener("click", closeAnswerModal);
    // Answer-modal backdrop (the .modal-backdrop INSIDE #answer-modal)
    $("#answer-modal .modal-backdrop").addEventListener("click", closeAnswerModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeAnswerModal();
        closeSettings();
      }
    });

    $("#menu-toggle").addEventListener("click", () =>
      document.body.classList.toggle("menu-open")
    );
    // Tap anywhere outside sidebar (mobile) to close it
    document.addEventListener("click", (e) => {
      if (!document.body.classList.contains("menu-open")) return;
      if (e.target.closest("#sidebar") || e.target.closest("#menu-toggle")) return;
      document.body.classList.remove("menu-open");
    });

    $("#reset-progress").addEventListener("click", () => {
      if (!confirm("Wipe all progress? This cannot be undone.")) return;
      resetProgress();
      toast("Progress reset.", "good");
    });

    initCardSpotlight();
    initCursorRing();
    initClickPulse();

    navigate("welcome", null);
  }

  // ----------------------------------------------------------------
  // Pointer FX
  // ----------------------------------------------------------------

  /** Card spotlight: write the pointer position into CSS vars on the
   *  hovered card so its ::after gradient can follow the cursor. */
  function initCardSpotlight() {
    const SELECTOR = ".q-card, .card";
    let last = null;
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest && e.target.closest(SELECTOR);
      if (card !== last) {
        if (last) {
          last.style.removeProperty("--mx");
          last.style.removeProperty("--my");
        }
        last = card;
      }
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
        card.style.setProperty("--my", (e.clientY - rect.top) + "px");
      }
    }, { passive: true });
  }

  /** Cursor-follower ring with lerp smoothing. */
  function initCursorRing() {
    // Touch and reduced motion → no ring.
    if (matchMedia("(pointer: coarse)").matches) return;
    // Note: data-motion="reduced" hides via CSS, so we still build it
    // and let CSS decide visibility — that way toggling Animations On
    // brings it back without a reload.
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(ring);

    const HOVER_SELECTOR =
      'button, a, .nav-item, .q-card, .card, .mcq-option, ' +
      '.swatch, .seg, .tag, .tc-reveal, .copy-btn, [role="button"], [role="link"]';

    let tx = -9999, ty = -9999;
    let x = -9999, y = -9999;
    let visible = false;

    document.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!visible) { ring.classList.add("visible"); visible = true; }
      if (e.target.closest && e.target.closest(HOVER_SELECTOR)) {
        ring.classList.add("hovering");
      } else {
        ring.classList.remove("hovering");
      }
    }, { passive: true });

    document.addEventListener("pointerdown", () => ring.classList.add("clicking"));
    document.addEventListener("pointerup",   () => ring.classList.remove("clicking"));
    document.addEventListener("pointerleave", () => {
      ring.classList.remove("visible");
      visible = false;
    });

    function loop() {
      // Smooth lerp toward target position.
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /** A brief expanding ring at every click — feels tactile. */
  function initClickPulse() {
    if (matchMedia("(pointer: coarse)").matches) return;
    document.addEventListener("click", (e) => {
      // Respect the reduced-motion setting at runtime.
      if (document.body.dataset.motion === "reduced") return;
      // Skip clicks inside the editor (would be visually noisy while typing-by-click).
      if (e.target && e.target.classList && e.target.classList.contains("editor")) return;
      const p = document.createElement("div");
      p.className = "click-pulse";
      p.style.left = e.clientX + "px";
      p.style.top  = e.clientY + "px";
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 700);
    }, { passive: true });
  }

  // Wait for DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
