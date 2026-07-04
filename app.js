/* ============================================================
   Workbook — index controller.
   Loads the folder manifest (PHP first, manifest.json as fallback),
   builds the sidebar, routes via location.hash, and renders three
   view kinds: tutorial iframe, folder accordion, home tiles.
============================================================ */

(function () {
  "use strict";

  // ---------- Extension → highlight.js language ----------
  const EXT_TO_HLJS = {
    py: "python", js: "javascript", mjs: "javascript", cjs: "javascript",
    ts: "typescript", jsx: "javascript", tsx: "typescript",
    html: "html", htm: "html",
    css: "css", scss: "scss", sass: "scss",
    sh: "bash", bash: "bash", zsh: "bash", fish: "bash",
    sql: "sql",
    json: "json", jsonl: "json",
    yaml: "yaml", yml: "yaml", toml: "ini", ini: "ini", cfg: "ini", conf: "ini",
    cpp: "cpp", cc: "cpp", cxx: "cpp", hpp: "cpp", hxx: "cpp",
    c: "c", h: "c",
    java: "java", kt: "kotlin", scala: "scala", groovy: "groovy",
    rb: "ruby", go: "go", rs: "rust", php: "php", swift: "swift",
    lua: "lua", pl: "perl", r: "r", jl: "julia", dart: "dart",
    vue: "xml", svelte: "xml",
    txt: "plaintext",
  };

  // Short text glyphs (monospace) — universal across systems.
  const FOLDER_ICON = {
    tutorial: "★",
    "tutorial-group": "★",
    markdown: "MD",
    code: "</>",
    pdf: "PDF",
    mixed: "•",
    empty: "·",
  };
  const FILE_BADGE = { markdown: "MD", code: "</>", pdf: "PDF" };

  const state = {
    manifest: null,
    dataSource: "static",     // "static" or "dynamic"
    fileCache: new Map(),     // url -> text
  };

  // ---------- DOM helpers ----------
  function $(s, r = document) { return r.querySelector(s); }
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
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return node;
  }

  // ---------- Manifest loader (PHP first, JSON fallback) ----------
  async function loadManifest() {
    // Try the dynamic endpoint first.
    try {
      const r = await fetch("list.php?path=.", { cache: "no-store" });
      if (r.ok) {
        const text = await r.text();
        // Either Content-Type is JSON, or the body just happens to parse.
        try {
          const j = JSON.parse(text);
          if (j && Array.isArray(j.folders)) {
            state.dataSource = "dynamic";
            return j;
          }
        } catch (_) { /* fall through */ }
      }
    } catch (_) { /* fall through */ }
    const r2 = await fetch("manifest.json", { cache: "no-store" });
    if (!r2.ok) throw new Error("manifest.json not found (HTTP " + r2.status + ")");
    state.dataSource = "static";
    return r2.json();
  }

  // ---------- Sidebar ----------
  function buildSidebar() {
    const nav = $("#nav");
    nav.innerHTML = "";

    nav.appendChild(el("a", {
      class: "nav-item home",
      href: "#/",
      "data-route": "",
    }, [
      el("span", { class: "ni-icon", text: "⌂" }),
      el("span", { class: "ni-name", text: "Home" }),
    ]));

    for (const f of state.manifest.folders) {
      if (f.kind === "tutorial-group") {
        nav.appendChild(buildTutorialGroupNav(f));
        continue;
      }
      const count = f.files ? String(f.files.length) : "";
      nav.appendChild(el("a", {
        class: `nav-item kind-${f.kind}`,
        href: "#/" + encodeURIComponent(f.name),
        "data-route": f.name,
      }, [
        el("span", { class: "ni-icon", text: FOLDER_ICON[f.kind] || "·" }),
        el("span", { class: "ni-name", text: f.name }),
        count ? el("span", { class: "ni-count", text: count }) : null,
      ]));
    }

    const tag = $("#ds-tag");
    tag.textContent = state.dataSource === "dynamic" ? "live · php" : "static · json";
    tag.className = "data-source-tag " + state.dataSource;
  }

  function buildTutorialGroupNav(group) {
    const wrap = el("div", { class: "nav-group", "data-group": "tutorial" });
    const header = el("button", {
      class: "nav-item kind-tutorial nav-group-header",
      type: "button",
      "aria-expanded": "true",
    }, [
      el("span", { class: "ni-icon", text: FOLDER_ICON["tutorial-group"] }),
      el("span", { class: "ni-name", text: "Tutorial" }),
      el("span", { class: "ni-chevron", text: "▸" }),
    ]);
    const children = el("div", { class: "nav-group-children" });
    for (const c of group.children || []) {
      children.appendChild(el("a", {
        class: "nav-item nav-subitem kind-tutorial",
        href: "#/tutorial/" + encodeURIComponent(c.slug),
        "data-route": "tutorial/" + c.slug,
      }, [
        el("span", { class: "ni-name", text: c.title || c.slug }),
      ]));
    }
    header.addEventListener("click", (e) => {
      e.preventDefault();
      const open = wrap.classList.toggle("collapsed");
      header.setAttribute("aria-expanded", open ? "false" : "true");
    });
    wrap.appendChild(header);
    wrap.appendChild(children);
    return wrap;
  }

  function highlightActive(slug) {
    document.querySelectorAll(".nav-item").forEach((a) => {
      a.classList.toggle("active", a.dataset.route === slug);
    });
    // Highlight the parent group header whenever any of its children is active.
    document.querySelectorAll(".nav-group").forEach((g) => {
      const anyActive = !!g.querySelector(".nav-item.nav-subitem.active");
      const header = g.querySelector(".nav-group-header");
      if (header) header.classList.toggle("active", anyActive);
    });
  }

  function setBack(visible) {
    $("#back-btn").classList.toggle("hidden", !visible);
  }
  function setCrumbs(html) { $("#crumbs").innerHTML = html; }

  // ---------- Router ----------
  function parseHash() {
    const h = (location.hash || "").replace(/^#\/?/, "");
    if (!h) return { kind: "home" };
    const parts = h.split("/").map(decodeURIComponent);
    if (parts[0] === "tutorial") {
      if (parts.length === 1 || !parts[1]) return { kind: "tutorial-index" };
      return { kind: "tutorial-child", slug: parts[1] };
    }
    return { kind: "folder", name: parts[0] };
  }

  function findTutorialGroup() {
    return state.manifest.folders.find((f) => f.kind === "tutorial-group");
  }

  function route() {
    const view = $("#view");
    view.innerHTML = "";
    document.body.classList.remove("tutorial-mode", "menu-open");

    const r = parseHash();
    if (r.kind === "home") {
      renderHome(view);
      setCrumbs("<strong>Home</strong>");
      setBack(false);
      highlightActive("");
      return;
    }

    if (r.kind === "tutorial-index") {
      const group = findTutorialGroup();
      if (!group) {
        view.appendChild(missingCard("No tutorials are registered in the manifest."));
        setCrumbs("<strong>Tutorial</strong>");
        setBack(true);
        highlightActive("");
        return;
      }
      renderTutorialIndex(view, group);
      setCrumbs("<strong>Tutorial</strong>");
      setBack(true);
      highlightActive("");
      return;
    }

    if (r.kind === "tutorial-child") {
      const group = findTutorialGroup();
      const child = group && (group.children || []).find((c) => c.slug === r.slug);
      if (!child) {
        view.appendChild(missingCard("Tutorial not found: " + r.slug));
        setCrumbs("<strong>Tutorial</strong>");
        setBack(true);
        highlightActive("");
        return;
      }
      document.body.classList.add("tutorial-mode");
      renderTutorialChild(view, child);
      setCrumbs(
        `<a href="#/tutorial" class="crumb-link">Tutorial</a> &nbsp;/&nbsp; ` +
        `<strong>${escapeHtml(child.title || child.slug)}</strong>`
      );
      setBack(true);
      highlightActive("tutorial/" + child.slug);
      return;
    }

    const folder = state.manifest.folders.find((f) => f.name === r.name);
    if (!folder) {
      view.appendChild(missingCard("Folder not found: " + r.name));
      setCrumbs("<strong>?</strong>");
      setBack(true);
      highlightActive("");
      return;
    }
    renderFolder(view, folder);
    setCrumbs(
      `<a href="#/" class="crumb-link">Home</a> &nbsp;/&nbsp; ` +
      `<strong>${escapeHtml(folder.name)}</strong>`
    );
    setBack(true);
    highlightActive(folder.name);
  }

  function missingCard(text) {
    return el("div", { class: "card error" }, [
      el("h2", { text: "Nothing to show" }),
      el("p", { text }),
    ]);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ---------- Views ----------
  function renderHome(view) {
    const card = el("div", { class: "card hero" });
    card.appendChild(el("h1", { text: "Odoo Assessment — Workbook" }));
    card.appendChild(el("p", {
      text: "A browsable index of everything in this repo. Open the interactive " +
            "tutorial, read the long-form docs, or skim per-question code snippets.",
    }));
    view.appendChild(card);

    const grid = el("div", { class: "folder-grid" });
    for (const f of state.manifest.folders) {
      const isGroup = f.kind === "tutorial-group";
      const href = isGroup ? "#/tutorial" : "#/" + encodeURIComponent(f.name);
      const tile = el("a", { class: `tile kind-${f.kind}`, href });
      tile.appendChild(el("div", { class: "tile-icon", text: FOLDER_ICON[f.kind] || "·" }));
      tile.appendChild(el("div", { class: "tile-name", text: isGroup ? "Tutorial" : f.name }));
      let sub;
      if (isGroup) {
        const n = (f.children || []).length;
        sub = `${n} interactive tutorial${n === 1 ? "" : "s"}`;
      } else if (f.kind === "tutorial") {
        sub = "interactive masterclass";
      } else {
        const n = f.files ? f.files.length : 0;
        sub = `${n} file${n === 1 ? "" : "s"} · ${f.kind}`;
      }
      tile.appendChild(el("div", { class: "tile-sub", text: sub }));
      grid.appendChild(tile);
    }
    view.appendChild(grid);
  }

  function renderTutorialIndex(view, group) {
    const card = el("div", { class: "card hero" });
    card.appendChild(el("h1", { text: "Tutorial" }));
    card.appendChild(el("p", {
      text: "Pick a track. Each one is a self-contained interactive tutorial.",
    }));
    view.appendChild(card);

    const grid = el("div", { class: "folder-grid" });
    for (const c of group.children || []) {
      const tile = el("a", {
        class: "tile kind-tutorial",
        href: "#/tutorial/" + encodeURIComponent(c.slug),
      });
      tile.appendChild(el("div", { class: "tile-icon", text: FOLDER_ICON["tutorial-group"] }));
      tile.appendChild(el("div", { class: "tile-name", text: c.title || c.slug }));
      tile.appendChild(el("div", { class: "tile-sub", text: "open tutorial" }));
      grid.appendChild(tile);
    }
    view.appendChild(grid);
  }

  function renderTutorialChild(view, child) {
    const iframe = el("iframe", {
      class: "tutorial-iframe",
      src: child.entry,
      title: child.title || child.slug,
    });
    view.appendChild(iframe);
  }

  function renderFolder(view, folder) {
    const head = el("div", { class: "card" });
    head.appendChild(el("h2", { text: folder.name }));
    head.appendChild(el("p", {
      text: `${folder.files.length} file${folder.files.length === 1 ? "" : "s"}. ` +
            "Click a file to expand its preview.",
    }));
    view.appendChild(head);

    const list = el("div", { class: "file-list" });
    for (const f of folder.files) list.appendChild(buildFileAccordion(folder.name, f));
    view.appendChild(list);
  }

  function buildFileAccordion(folderName, file) {
    const detail = el("details", { class: `file-item kind-${file.kind}` });
    const sum = el("summary");
    sum.appendChild(el("span", { class: "f-kind", text: FILE_BADGE[file.kind] || file.ext.toUpperCase() }));
    sum.appendChild(el("span", { class: "f-name", text: file.name }));
    sum.appendChild(el("span", { class: "f-meta", text: humanSize(file.size) }));
    detail.appendChild(sum);

    const body = el("div", { class: "file-body" });
    detail.appendChild(body);

    let loaded = false;
    detail.addEventListener("toggle", async () => {
      if (loaded || !detail.open) return;
      loaded = true;
      body.innerHTML = '<div class="loading-tile">Loading…</div>';
      const url = encodeURIComponent(folderName) + "/" + encodeURIComponent(file.name);
      try {
        await renderFile(file, url, body);
      } catch (e) {
        body.innerHTML = "";
        body.appendChild(el("div", { class: "error", text: "Failed to load: " + (e.message || e) }));
        loaded = false; // allow retry on collapse-reopen
      }
    });
    return detail;
  }

  function humanSize(n) {
    if (n == null) return "";
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    return (n / 1024 / 1024).toFixed(1) + " MB";
  }

  async function fetchText(url) {
    if (state.fileCache.has(url)) return state.fileCache.get(url);
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const t = await r.text();
    state.fileCache.set(url, t);
    return t;
  }

  async function renderFile(file, url, body) {
    if (file.kind === "markdown") {
      const text = await fetchText(url);
      // marked@12 is sync by default.
      const html = window.marked.parse(text, { gfm: true, breaks: false });
      body.innerHTML = `<div class="markdown-body">${html}</div>`;
      // Highlight any embedded code blocks.
      if (window.hljs) {
        body.querySelectorAll("pre code").forEach((b) => {
          try { window.hljs.highlightElement(b); } catch (_) {}
        });
      }
      // Rewrite relative anchor links inside markdown (rare here, but tidy).
      return;
    }
    if (file.kind === "code") {
      const text = await fetchText(url);
      const lang = EXT_TO_HLJS[file.ext] || "plaintext";
      const pre = el("pre");
      const code = el("code", { class: "language-" + lang });
      code.textContent = text;
      pre.appendChild(code);
      body.innerHTML = "";
      body.appendChild(pre);
      if (window.hljs) {
        try { window.hljs.highlightElement(code); } catch (_) {}
      }
      return;
    }
    if (file.kind === "pdf") {
      body.innerHTML = "";
      const frame = el("div", { class: "pdf-frame" });
      frame.appendChild(el("iframe", { src: url, title: file.name }));
      frame.appendChild(el("div", { class: "pdf-fallback" }, [
        el("a", { href: url, target: "_blank", rel: "noopener", text: "Open " + file.name + " ↗" }),
      ]));
      body.appendChild(frame);
      return;
    }
    body.appendChild(el("div", { class: "loading-tile", text: "No preview available for this file type." }));
  }

  // ---------- Boot ----------
  async function main() {
    try {
      state.manifest = await loadManifest();
    } catch (e) {
      $("#view").appendChild(el("div", { class: "card error" }, [
        el("h2", { text: "Couldn't load manifest" }),
        el("p", { text: String(e.message || e) }),
        el("p", { text:
          "If you opened this file directly from disk, you need to serve the folder. " +
          "Run `python3 -m http.server` here and open http://localhost:8000/." }),
      ]));
      return;
    }
    buildSidebar();

    $("#back-btn").addEventListener("click", () => { location.hash = "#/"; });
    $("#menu-toggle").addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
    });
    document.addEventListener("click", (e) => {
      if (!document.body.classList.contains("menu-open")) return;
      if (e.target.closest("#sidebar") || e.target.closest("#menu-toggle")) return;
      document.body.classList.remove("menu-open");
    });
    window.addEventListener("hashchange", route);

    $("#app").classList.remove("loading");
    route();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
