(function () {
  "use strict";

  const PREFS_KEY = "odoo_lastreview_prefs_v1";
  const PROGRESS_KEY_SHORT = "odoo_lastreview_progress_short_v1";
  const PROGRESS_KEY_LONG = "odoo_lastreview_progress_long_v1";

  const state = {
    mode: "short", // 'short' | 'long'
    currentIndex: -1, // -1 = welcome
    prefs: loadPrefs(),
    progress: { short: new Set(), long: new Set() },
    timer: {
      running: false,
      totalSec: 0,
      remainingSec: 0,
      handle: null,
      endAt: null,
    },
  };

  // ---------- Helpers ----------
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return [...document.querySelectorAll(sel)]; }
  function el(tag, attrs = {}, children = []) {
    attrs = attrs || {};
    children = children || [];
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "text") node.textContent = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "class") node.className = v;
      else node.setAttribute(k, v);
    });
    children.forEach((c) => {
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    });
    return node;
  }

  function loadPrefs() {
    const defaults = { mode: "short", theme: "dark", accent: "cyan", motion: "full" };
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) Object.assign(defaults, JSON.parse(raw));
    } catch (e) {}
    return defaults;
  }
  function savePrefs() { localStorage.setItem(PREFS_KEY, JSON.stringify(state.prefs)); }

  function progressKey() { return state.mode === "short" ? PROGRESS_KEY_SHORT : PROGRESS_KEY_LONG; }
  function loadProgress() {
    try {
      const raw = localStorage.getItem(progressKey());
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (e) { return new Set(); }
  }
  function saveProgress() {
    const s = state.mode === "short" ? state.progress.short : state.progress.long;
    localStorage.setItem(progressKey(), JSON.stringify([...s]));
    updateProgressUI();
  }
  function isChecked(id) {
    const s = state.mode === "short" ? state.progress.short : state.progress.long;
    return s.has(id);
  }
  function toggleCheck(id) {
    const s = state.mode === "short" ? state.progress.short : state.progress.long;
    if (s.has(id)) s.delete(id); else s.add(id);
    saveProgress();
    updateNavDoneState();
  }

  function currentContent() { return state.mode === "short" ? window.REVIEW_SHORT : window.REVIEW_LONG; }
  function totalChecks() {
    let n = 0;
    currentContent().sections.forEach((sec) => {
      sec.blocks.forEach((b) => { if (b.kind === "check") n++; });
    });
    return n;
  }
  function checkedCount() {
    return (state.mode === "short" ? state.progress.short : state.progress.long).size;
  }

  // ---------- Prefs / theme ----------
  function applyPrefs() {
    document.body.dataset.theme = state.prefs.theme;
    document.body.dataset.accent = state.prefs.accent;
    document.body.dataset.motion = state.prefs.motion;
    updateModeButtons();
    updateSettingsUI();
  }
  function updateModeButtons() {
    $$(".mode-btn").forEach((b) => b.classList.toggle("active", b.dataset.mode === state.mode));
  }
  function updateSettingsUI() {
    $$(".mode-btn").forEach((b) => b.classList.toggle("active", b.dataset.mode === state.mode));
    $$("#theme-group .seg").forEach((b) => b.classList.toggle("active", b.dataset.theme === state.prefs.theme));
    $$("#accent-group .swatch").forEach((b) => b.classList.toggle("active", b.dataset.accent === state.prefs.accent));
    $$("#motion-group .seg").forEach((b) => b.classList.toggle("active", b.dataset.motion === state.prefs.motion));
  }

  // ---------- Navigation ----------
  function setMode(mode) {
    if (mode === state.mode) return;
    state.mode = mode;
    state.prefs.mode = mode;
    savePrefs();
    stopTimer(true);
    state.currentIndex = -1;
    buildNav();
    renderWelcome();
    updateModeButtons();
    updateSettingsUI();
    updateProgressUI();
  }

  function goToSection(index) {
    const content = currentContent();
    if (index < 0 || index >= content.sections.length) return;
    state.currentIndex = index;
    renderSection(index);
    updateActiveNav();
    updateFooter();
    history.replaceState(null, "", "#" + content.sections[index].id);
  }
  function nextSection() { goToSection(state.currentIndex + 1); }
  function prevSection() { goToSection(state.currentIndex - 1); }

  // ---------- Rendering ----------
  function buildNav() {
    const nav = $("#nav");
    nav.innerHTML = "";
    const content = currentContent();
    content.sections.forEach((sec, idx) => {
      const num = el("span", { class: "nav-num", text: String(idx + 1) });
      const title = el("span", { class: "nav-title", text: sec.title });
      const time = el("span", { class: "nav-time", text: sec.minutes + " min" });
      const item = el("button", { class: "nav-item", "data-index": String(idx), style: "--i:" + idx }, [num, title, time]);
      item.addEventListener("click", () => { goToSection(idx); closeMobileMenu(); });
      nav.appendChild(item);
    });
    updateNavDoneState();
    updateActiveNav();
  }
  function updateActiveNav() {
    $$(".nav-item").forEach((item, idx) => item.classList.toggle("active", idx === state.currentIndex));
  }
  function updateNavDoneState() {
    const content = currentContent();
    const s = state.mode === "short" ? state.progress.short : state.progress.long;
    $$(".nav-item").forEach((item, idx) => {
      const sec = content.sections[idx];
      const checks = sec.blocks.filter((b) => b.kind === "check").map((b) => b.id);
      const done = checks.length > 0 && checks.every((id) => s.has(id));
      item.classList.toggle("done", done);
    });
  }

  function renderWelcome() {
    $("#welcome").classList.remove("hidden");
    $("#section-view").classList.add("hidden");
    $("#footer").classList.add("hidden");
    state.currentIndex = -1;
    updateActiveNav();
    history.replaceState(null, "", location.pathname);
  }

  function renderSection(index) {
    $("#welcome").classList.add("hidden");
    $("#section-view").classList.remove("hidden");
    $("#footer").classList.remove("hidden");
    const content = currentContent();
    const sec = content.sections[index];
    const wrap = el("div", { class: "section-card" });

    const header = el("div", { class: "section-header" }, [
      el("div", { class: "section-num", text: String(index + 1) }),
      el("div", { class: "section-title" }, [
        el("h2", { text: sec.title }),
        el("div", { class: "section-meta", text: `~${sec.minutes} min · ${sec.blocks.length} blocks` }),
      ]),
    ]);
    wrap.appendChild(header);

    sec.blocks.forEach((b, bi) => {
      try {
        const node = renderBlock(b);
        if (node) wrap.appendChild(node);
      } catch (err) {
        console.error("renderBlock error", sec.id, bi, b.kind, err.stack || err);
        wrap.appendChild(el("div", { class: "callout warn", html: `<b>Render error</b> ${sec.id}/${bi} (${b.kind}): ${err.message}` }));
      }
    });

    const view = $("#section-view");
    view.innerHTML = "";
    view.appendChild(wrap);
    view.scrollTop = 0;
    $("#main").scrollTop = 0;
  }

  function renderBlock(b) {
    if (b.kind === "html") {
      const d = el("div", { class: "block" });
      d.innerHTML = b.html;
      return d;
    }
    if (b.kind === "code") {
      const head = el("div", { class: "code-head" }, [
        el("span", { class: "code-lang", text: b.lang }),
        el("button", { class: "copy-btn", text: "Copy" }),
      ]);
      const pre = el("pre", null, [el("code", { text: b.code })]);
      return el("div", { class: "code-block" }, [head, pre]);
    }
    if (b.kind === "callout") {
      const d = el("div", { class: "callout " + (b.type || "tip") });
      d.appendChild(el("div", { class: "callout-title", text: b.title }));
      const body = el("div", null);
      body.innerHTML = b.html;
      d.appendChild(body);
      return d;
    }
    if (b.kind === "check") {
      const row = el("label", { class: "check-row" + (isChecked(b.id) ? " checked" : "") });
      const cb = el("input", { type: "checkbox" });
      cb.checked = isChecked(b.id);
      cb.addEventListener("change", () => {
        toggleCheck(b.id);
        row.classList.toggle("checked", cb.checked);
      });
      row.appendChild(cb);
      row.appendChild(el("span", { class: "check-text", text: b.text }));
      return row;
    }
    if (b.kind === "question") {
      const tags = el("div", { class: "question-tags" });
      b.tags.forEach((t) => tags.appendChild(el("span", { class: "tag accent", text: t })));
      return el("div", { class: "question-card" }, [
        el("div", { class: "question-title", text: b.label }),
        tags,
        el("div", { class: "question-insight", html: b.insight }),
      ]);
    }
    return null;
  }

  function updateFooter() {
    const content = currentContent();
    const idx = state.currentIndex;
    $("#section-counter").textContent = `${idx + 1} / ${content.sections.length}`;
    $("#prev-section").disabled = idx <= 0;
    $("#next-section").disabled = idx >= content.sections.length - 1;
  }

  function updateProgressUI() {
    const total = totalChecks();
    const done = checkedCount();
    const pct = total ? Math.round((done / total) * 100) : 0;
    const circumference = 100.53;
    $("#top-progress").style.strokeDashoffset = circumference * (1 - pct / 100);
    $("#progress-text").textContent = pct + "%";
  }

  // ---------- Timer ----------
  function formatMMSS(sec) {
    const m = Math.floor(Math.abs(sec) / 60);
    const s = Math.abs(sec) % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  function updateTimerDisplay() {
    const t = state.timer;
    $("#timer-display").textContent = formatMMSS(t.remainingSec);
    $("#timer-label").textContent = t.running ? "Remaining" : (t.remainingSec < t.totalSec && t.remainingSec > 0 ? "Paused" : "Ready");
    $("#timer-action").textContent = t.running ? "Pause" : (t.remainingSec > 0 && t.remainingSec < t.totalSec ? "Resume" : "Start");
    updateTimerRing();
    updateTimerClasses();
  }
  function updateTimerRing() {
    const t = state.timer;
    const circumference = 125.66;
    const pct = t.totalSec ? t.remainingSec / t.totalSec : 0;
    $("#timer-ring").style.strokeDashoffset = circumference * (1 - pct);
  }
  function updateTimerClasses() {
    const wrap = $(".timer");
    const t = state.timer;
    wrap.classList.toggle("running", t.running);
    wrap.classList.toggle("low", t.totalSec > 0 && t.remainingSec <= 600 && t.remainingSec > 0);
  }
  function startTimer() {
    const content = currentContent();
    const total = content.totalMinutes * 60;
    if (state.timer.remainingSec === 0 || state.timer.totalSec !== total) {
      state.timer.totalSec = total;
      state.timer.remainingSec = total;
    }
    state.timer.running = true;
    state.timer.endAt = Date.now() + state.timer.remainingSec * 1000;
    clearInterval(state.timer.handle);
    state.timer.handle = setInterval(tickTimer, 1000);
    updateTimerDisplay();
  }
  function pauseTimer() {
    state.timer.running = false;
    clearInterval(state.timer.handle);
    updateTimerDisplay();
  }
  function stopTimer(reset = false) {
    state.timer.running = false;
    clearInterval(state.timer.handle);
    if (reset) {
      state.timer.remainingSec = 0;
      state.timer.totalSec = 0;
    }
    updateTimerDisplay();
  }
  function tickTimer() {
    const remaining = Math.ceil((state.timer.endAt - Date.now()) / 1000);
    state.timer.remainingSec = Math.max(0, remaining);
    updateTimerDisplay();
    if (state.timer.remainingSec <= 0) {
      pauseTimer();
      $("#timeup-overlay").classList.remove("hidden");
    }
  }

  // ---------- Settings modal ----------
  function openSettings() {
    $("#settings-modal").classList.remove("hidden");
  }
  function closeSettings() {
    $("#settings-modal").classList.add("hidden");
  }

  // ---------- Export / import ----------
  function exportData() {
    const data = {
      prefs: state.prefs,
      progressShort: [...state.progress.short],
      progressLong: [...state.progress.long],
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `last-review-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.prefs) {
          state.prefs = { ...state.prefs, ...data.prefs };
          savePrefs();
          applyPrefs();
        }
        if (Array.isArray(data.progressShort)) state.progress.short = new Set(data.progressShort);
        if (Array.isArray(data.progressLong)) state.progress.long = new Set(data.progressLong);
        saveProgress();
        buildNav();
        if (state.currentIndex >= 0) renderSection(state.currentIndex);
        else renderWelcome();
        alert("Backup imported.");
      } catch (e) { alert("Invalid backup file."); }
    };
    reader.readAsText(file);
  }

  // ---------- Mobile menu ----------
  function openMobileMenu() { document.body.classList.add("nav-open"); }
  function closeMobileMenu() { document.body.classList.remove("nav-open"); }

  // ---------- Event bindings ----------
  function init() {
    state.progress.short = loadProgressFor("short");
    state.progress.long = loadProgressFor("long");
    state.mode = state.prefs.mode || "short";
    applyPrefs();
    buildNav();
    updateProgressUI();

    // Welcome start buttons
    $("#start-short").addEventListener("click", () => { setMode("short"); startTimer(); nextSectionFromWelcome(); });
    $("#start-long").addEventListener("click", () => { setMode("long"); startTimer(); nextSectionFromWelcome(); });

    // Topbar mode buttons
    $$(".mode-btn").forEach((b) => {
      b.addEventListener("click", () => setMode(b.dataset.mode));
    });

    // Timer
    $("#timer-action").addEventListener("click", () => {
      if (state.timer.running) pauseTimer();
      else startTimer();
    });

    // Footer nav
    $("#next-section").addEventListener("click", nextSection);
    $("#prev-section").addEventListener("click", prevSection);

    // Settings
    $("#open-settings").addEventListener("click", openSettings);
    $$("[data-close-modal]").forEach((b) => b.addEventListener("click", closeSettings));
    $("#reset-progress").addEventListener("click", () => {
      if (!confirm("Reset progress for the current review length?")) return;
      const s = state.mode === "short" ? state.progress.short : state.progress.long;
      s.clear();
      saveProgress();
      buildNav();
      if (state.currentIndex >= 0) renderSection(state.currentIndex);
    });
    $("#export-data").addEventListener("click", exportData);
    $("#import-data").addEventListener("click", () => $("#import-file").click());
    $("#import-file").addEventListener("change", (e) => { if (e.target.files[0]) importData(e.target.files[0]); });

    // Theme/accent/motion
    $$("#theme-group .seg").forEach((b) => b.addEventListener("click", () => { state.prefs.theme = b.dataset.theme; savePrefs(); applyPrefs(); }));
    $$("#accent-group .swatch").forEach((b) => b.addEventListener("click", () => { state.prefs.accent = b.dataset.accent; savePrefs(); applyPrefs(); }));
    $$("#motion-group .seg").forEach((b) => b.addEventListener("click", () => { state.prefs.motion = b.dataset.motion; savePrefs(); applyPrefs(); }));

    // Mobile
    $("#menu-toggle").addEventListener("click", openMobileMenu);
    $("#sidebar").addEventListener("click", (e) => { if (e.target.closest(".nav-item")) closeMobileMenu(); });

    // Copy buttons
    $("#main").addEventListener("click", (e) => {
      const btn = e.target.closest(".copy-btn");
      if (!btn) return;
      const code = btn.closest(".code-block").querySelector("pre").innerText;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = "Copied ✓";
        btn.classList.add("done");
        setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1400);
      }).catch(() => {});
    });

    // Time-up dismiss
    $("#dismiss-timeup").addEventListener("click", () => $("#timeup-overlay").classList.add("hidden"));

    // Hash deep-link
    const hash = location.hash.replace("#", "");
    if (hash) {
      const idx = currentContent().sections.findIndex((s) => s.id === hash);
      if (idx >= 0) goToSection(idx);
      else renderWelcome();
    } else {
      renderWelcome();
    }
  }

  function nextSectionFromWelcome() {
    if (currentContent().sections.length) goToSection(0);
  }

  function loadProgressFor(mode) {
    const key = mode === "short" ? PROGRESS_KEY_SHORT : PROGRESS_KEY_LONG;
    try {
      const raw = localStorage.getItem(key);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (e) { return new Set(); }
  }

  // Ensure state.progress is initialised from both keys
  state.progress.short = loadProgressFor("short");
  state.progress.long = loadProgressFor("long");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
