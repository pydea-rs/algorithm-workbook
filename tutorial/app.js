/* ============================================================
   app.js — Tutorial controller.
   Builds the nav, routes views, renders modules / practice
   sets / final exam, manages the answer modal, drives the
   code runner, persists progress in localStorage.
============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "odoo_prep_progress_v1";
  const PREFS_KEY = "odoo_prep_prefs_v1";

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
    solved: loadProgress(),     // Set of question ids
    activeView: null,           // {kind, id} of current view
    examSeed: null,             // Stable random seed for the final exam
    prefs: loadPrefs(),         // User customization
  };

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
    saveProgress();
    updateProgressUI();
    updateNavCheckmarks();
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
      items: Object.keys(window.PRACTICE_SETS).map((pid, i) => ({
        kind: "practice",
        id: pid,
        label: window.PRACTICE_SETS[pid].title.replace(/^Practice Set \d+ — /, ""),
        num: i + 1,
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
        done = window.FINAL_EXAM_POOL.every((qid) => state.solved.has(qid));
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
        el("h1", { text: "Odoo Coderbyte Masterclass" }),
        el("p", {
          text:
            "An interactive, single-page prep for the first-step Coderbyte assessment. " +
            "Eight tutorial modules fuse the written prep with concept checks; " +
            "eight practice sets mix topics within each chunk; a 12-question Final Exam closes it out.",
        }),
      ]),
      el("div", { class: "card", html: `
<h2>How to navigate</h2>
<ul>
  <li><strong>Modules 1–8</strong> in the sidebar are the tutorial. Read them in order if this
  is your first pass.</li>
  <li><strong>Practice Sets</strong> follow each module. Questions are mixed so you can't tell
  which sub-topic they came from.</li>
  <li><strong>Final Exam</strong> draws 12 random questions from a held-back pool — try it only
  after you've worked through the practice sets. Topic tags are intentionally hidden in the
  exam so the algorithm family doesn't telegraph itself.</li>
</ul>
<h2>The code workbench</h2>
<ul>
  <li>For Python questions, write your solution in the editor and click <strong>Run tests</strong>.
  Python runs in your browser via Pyodide (it loads on first run, ~5 seconds).</li>
  <li>Test feedback shows <em>only</em> pass/fail and your coverage %. To see what was actually
  expected vs returned, click <strong>Reveal diff</strong> on the failing case.</li>
  <li>SQL questions show the schema, hint, and solution in a modal — no runner.</li>
  <li>The <strong>Show answer</strong> button is locked behind a "did you really try?" warning.</li>
</ul>
<h2>Your progress is saved locally</h2>
<p>Solved questions persist via <code>localStorage</code>. Use the <strong>Reset</strong> button
in the sidebar to wipe and start over.</p>
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

    // Footer: go to practice set
    const psId = m.practiceSet;
    wrap.appendChild(el("div", { class: "btn-row" }, [
      el("button", {
        class: "btn primary",
        text: "Continue to " + window.PRACTICE_SETS[psId].title.split(" — ")[0],
        onclick: () => navigate("practice", psId),
      }),
      el("button", {
        class: "btn ghost",
        text: "Back to top",
        onclick: () => $("#view-container").scrollTo({ top: 0, behavior: "smooth" }),
      }),
    ]));

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
    if (state.examSeed == null) state.examSeed = Math.floor(Math.random() * 1e9);
    const seed = state.examSeed;
    const pool = window.FINAL_EXAM_POOL.slice();
    const chosen = stableShuffle(pool, seed).slice(0, Math.min(12, pool.length));

    const wrap = el("div", { class: "view-narrow" });

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
<p>Twelve questions drawn from a pool that was deliberately held back from the Practice Sets.
Topics are mixed across all eight modules. <strong>Work each problem to completion before
revealing the answer.</strong> Coverage updates live as you pass tests.</p>
<div class="callout tip" style="margin-top:14px">
  <div class="callout-title">Topic tags are hidden</div>
  Only difficulty and time-estimate are shown next to each question — the algorithm family
  (DP, Sliding Window, BFS, ...) is intentionally withheld so the problem statement is your
  only clue, just like the real assessment.
</div>
<p class="note-soft">Tip: simulate the real test — give yourself 5 minutes per question and a
hard 60-minute cap. If you're not done after 60, finish for learning's sake but score honestly.</p>
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
        onPass: () => {
          if (!passSet.has(qid)) {
            passSet.add(qid);
            counters.solved.textContent = String(passSet.size);
            bump(counters.solved);
          }
        },
        onAttempt: () => {
          if (!attemptSet.has(qid)) {
            attemptSet.add(qid);
            counters.attempted.textContent = String(attemptSet.size);
            bump(counters.attempted);
          }
        },
      });
      wrap.appendChild(card);
    });

    return wrap;
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
    head.appendChild(tags);
    card.appendChild(head);

    // Statement
    card.appendChild(el("div", { class: "q-statement", html: q.statement }));
    if (q.examples) card.appendChild(el("pre", { class: "q-examples", text: q.examples }));

    // Actions
    const actions = el("div", { class: "q-actions" });
    if (q.type === "python") {
      const tryBtn = el("button", {
        class: "btn primary",
        text: "Try in workbench",
      });
      actions.appendChild(tryBtn);

      const runner = buildRunnerPanel(qid, hooks);
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
    } else {
      // SQL flow
      card.appendChild(el("div", { class: "note-soft",
        text: "SQL questions show the reference answer in a modal; the in-browser workbench " +
              "doesn't run SQL. Read the hint, write your query mentally (or in a separate editor), " +
              "then compare." }));
      actions.appendChild(el("button", {
        class: "btn",
        text: "Hint",
        onclick: () => toast("Hint: " + q.hint, "info", 4500),
      }));
      actions.appendChild(el("button", {
        class: "btn primary",
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
    editor.value = langStarter();

    // Stash per-language draft so flipping back doesn't lose work.
    const drafts = { python: langs.includes("python") ? langStarter() : "" };
    if (q.js) drafts.javascript = q.js.starter || "";
    drafts[currentLang] = editor.value;

    function switchLang(next) {
      if (next === currentLang) return;
      drafts[currentLang] = editor.value;     // save current draft
      currentLang = next;
      editor.value = drafts[currentLang] || langStarter();
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
      }
    });
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
