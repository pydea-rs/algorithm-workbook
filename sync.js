/*
 * sync.js — client half of the SQLite journey backup (see sync.php).
 *
 * Include as the FIRST script on every page: it hydrates localStorage from the
 * server SYNCHRONOUSLY, so the app scripts that read localStorage at parse
 * time see the synced journey with zero changes to their code. Under the
 * static/GitHub-Pages or python -m http.server versions, sync.php comes back
 * as plain text, JSON.parse fails, and this file does nothing at all.
 *
 * Sync model (per browser, keyed by a "base" fingerprint of the last snapshot
 * this browser confirmed with the server):
 *   - server empty                     -> seed it from localStorage (protects
 *                                         journeys from the pre-SQLite era)
 *   - server == local                  -> in sync
 *   - local unchanged since last sync  -> pull server (another device saved)
 *   - server unchanged since last sync -> push local (this browser progressed,
 *                                         possibly offline)
 *   - both changed / never synced here -> keep what's on screen (push local),
 *                                         stashing the server copy first
 * Every overwrite direction keeps a safety copy in journey_stash, so nothing
 * is ever silently lost.
 *
 * Afterwards: auto-save every 45s (only when something changed), on tab
 * hide/close via sendBeacon, and manually via the "Save journey" button this
 * script injects into the settings modal (window.OdooJourney.saveNow works
 * everywhere).
 */
(function () {
  "use strict";

  var script = document.currentScript;
  if (!script || !script.src) return;
  var ENDPOINT = script.src.replace(/sync\.js([?#].*)?$/, "sync.php");
  var PREFIX = /^odoo[-_]/;
  var BASE_KEY = "workbook_sync_base_v1"; // deliberately outside the odoo_ prefix: never synced itself
  var INTERVAL_MS = 45000;

  var active = false;
  var lastSavedAt = null;

  // ---------------------------------------------------------------- helpers

  // A lone UTF-16 surrogate (possible in free-typed notes/drafts) survives
  // JSON.stringify as a \ud8xx escape that PHP's json_decode rejects — which
  // would brick every save from then on. Scrub to U+FFFD before shipping.
  function scrub(str) {
    if (!/[\uD800-\uDFFF]/.test(str)) return str; // fast path: no surrogates at all
    var out = "";
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c >= 0xd800 && c <= 0xdbff) {
        var d = i + 1 < str.length ? str.charCodeAt(i + 1) : 0;
        if (d >= 0xdc00 && d <= 0xdfff) { out += str[i] + str[i + 1]; i++; }
        else out += "�";
      } else if (c >= 0xdc00 && c <= 0xdfff) {
        out += "�"; // low surrogate with no leading high surrogate
      } else {
        out += str[i];
      }
    }
    return out;
  }

  function snapshot() {
    var out = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (PREFIX.test(k)) out[k] = scrub(localStorage.getItem(k));
    }
    return out;
  }

  function serialize(snap) {
    return JSON.stringify(snap, Object.keys(snap).sort());
  }

  // FNV-1a, enough to fingerprint a snapshot.
  function hash(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    return h.toString(16);
  }

  function applySnapshot(data) {
    var mine = snapshot();
    Object.keys(mine).forEach(function (k) {
      if (!(k in data)) localStorage.removeItem(k);
    });
    Object.keys(data).forEach(function (k) {
      localStorage.setItem(k, data[k]);
    });
  }

  function setBase(ser) {
    try { localStorage.setItem(BASE_KEY, hash(ser)); } catch (e) {}
  }
  function getBase() {
    try { return localStorage.getItem(BASE_KEY); } catch (e) { return null; }
  }

  function post(action, payload, cb) {
    try {
      var x = new XMLHttpRequest();
      x.open("POST", ENDPOINT + "?action=" + action, true);
      x.setRequestHeader("Content-Type", "application/json");
      x.onreadystatechange = function () {
        if (x.readyState !== 4) return;
        var r = null;
        try { r = JSON.parse(x.responseText); } catch (e) {}
        if (cb) cb(x.status === 200 && r && r.ok === true, r);
      };
      x.send(JSON.stringify(payload));
    } catch (e) {
      if (cb) cb(false, null);
    }
  }

  // One backup routine for the timer, the exit beacon and the manual button.
  function saveNow(cb, opts) {
    opts = opts || {};
    if (!active) { if (cb) cb(false, { error: "sync inactive" }); return; }
    var snap = snapshot();
    var ser = serialize(snap);
    if (!opts.force && hash(ser) === getBase()) {
      if (cb) cb(true, { unchanged: true, savedAt: lastSavedAt });
      return;
    }
    post("save", { data: snap, reason: opts.reason || "auto" }, function (ok, r) {
      if (ok) {
        setBase(ser);
        lastSavedAt = (r && r.savedAt) || new Date().toISOString();
      }
      if (cb) cb(ok, r);
    });
  }

  // ------------------------------------------------------ initial hydration
  // Synchronous on purpose: it must finish before the app scripts below this
  // <script> tag read localStorage. Local round-trip, a few milliseconds.

  var server = null;
  var loadStatus = 0;
  try {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", ENDPOINT + "?action=load", false);
    xhr.send(null);
    loadStatus = xhr.status;
    if (xhr.status === 200) server = JSON.parse(xhr.responseText);
  } catch (e) { server = null; }

  if (!server || server.ok !== true) {
    // 200-with-non-JSON is the normal static-server case — stay quiet.
    // A 5xx means the PHP server is there but broken (unwritable sqlite,
    // disk full…): the journey is NOT being backed up, so say so.
    if (loadStatus >= 500) {
      try { console.warn("[journey-sync] disabled: sync.php answered HTTP " + loadStatus + " — this session is not being backed up."); } catch (e) {}
    }
    window.OdooJourney = { active: false };
    return;
  }
  active = true;

  var local = snapshot();
  var localSer = serialize(local);

  if (server.empty) {
    // Fresh DB: this browser's localStorage is the only source — seed, never wipe.
    post("save", { data: local, reason: "seed-empty-db" }, function (ok) {
      if (ok) setBase(localSer);
    });
  } else {
    var incoming = server.data || {};
    var incomingSer = serialize(incoming);
    var base = getBase();
    if (incomingSer === localSer) {
      setBase(localSer); // already in sync
      lastSavedAt = server.savedAt || null;
    } else if (Object.keys(local).length === 0) {
      // Brand-new browser/device with no journey of its own: adopt the server's.
      applySnapshot(incoming);
      setBase(incomingSer);
      lastSavedAt = server.savedAt || null;
    } else if (base === hash(localSer)) {
      // Nothing changed here since our last sync — another device moved ahead.
      applySnapshot(incoming);
      setBase(incomingSer);
      lastSavedAt = server.savedAt || null;
    } else {
      // This browser has newer (or never-synced) data: what's on screen wins,
      // but the server copy is stashed inside the save.
      post("save", { data: local, stashFirst: true, reason: base === hash(incomingSer) ? "local-progressed" : "conflict-local-wins" }, function (ok, r) {
        if (ok) {
          setBase(localSer);
          lastSavedAt = (r && r.savedAt) || null;
        }
      });
    }
  }

  // ------------------------------------------------------- ongoing backups

  setInterval(function () { saveNow(); }, INTERVAL_MS);

  function beaconSave() {
    var snap = snapshot();
    var ser = serialize(snap);
    if (hash(ser) === getBase()) return;
    try {
      var blob = new Blob([JSON.stringify({ data: snap, reason: "exit" })], { type: "application/json" });
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT + "?action=save", blob)) return;
      // Deliberately NOT updating the base here: if the beacon is lost, the
      // next load sees "local changed, server didn't" and re-pushes. If it
      // lands, the next load sees server == local. Either way nothing is lost.
    } catch (e) {}
    saveNow(); // best-effort fallback
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") beaconSave();
  });
  window.addEventListener("pagehide", beaconSave);

  // ------------------------------------- "Save journey" button (settings UI)
  // Injected only when sync is active, so the static versions' UI stays
  // untouched. Matches the settings modal of both tutorial apps.

  function injectSaveButton() {
    var body = document.querySelector("#settings-modal .settings-body");
    if (!body || document.getElementById("journey-save-row")) return;
    var row = document.createElement("div");
    row.className = "setting-row";
    row.id = "journey-save-row";

    var label = document.createElement("div");
    label.className = "setting-label";
    var title = document.createElement("div");
    title.className = "setting-title";
    title.textContent = "Journey backup";
    var hint = document.createElement("div");
    hint.className = "setting-hint";
    hint.textContent = lastSavedAt
      ? "Synced to SQLite · " + new Date(lastSavedAt).toLocaleTimeString()
      : "Synced to SQLite on this PHP server";
    label.appendChild(title);
    label.appendChild(hint);

    var btn = document.createElement("button");
    btn.className = "btn ghost small";
    btn.id = "journey-save-btn";
    btn.textContent = "Save journey";
    btn.addEventListener("click", function () {
      btn.disabled = true;
      btn.textContent = "Saving…";
      saveNow(function (ok, r) {
        btn.disabled = false;
        btn.textContent = ok ? "Saved ✓" : "Failed ✗";
        if (ok) hint.textContent = "Synced to SQLite · " + new Date().toLocaleTimeString();
        setTimeout(function () { btn.textContent = "Save journey"; }, 2200);
      }, { force: true, reason: "manual-button" });
    });

    row.appendChild(label);
    row.appendChild(btn);
    var footer = body.querySelector(".settings-footer");
    body.insertBefore(row, footer || null);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectSaveButton);
  } else {
    injectSaveButton();
  }

  window.OdooJourney = {
    active: true,
    saveNow: function (cb) { saveNow(cb, { force: true, reason: "api" }); },
    endpoint: ENDPOINT,
    lastSavedAt: function () { return lastSavedAt; }
  };
})();
