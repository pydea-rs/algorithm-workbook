<?php
/*
 * sync.php — SQLite persistence layer for the PHP-server version.
 *
 * The whole workbook keeps its state in localStorage (keys prefixed odoo_ / odoo-).
 * When the site is served with `php -S`, sync.js mirrors that state into
 * journey.sqlite through this endpoint, so the journey survives browser/device
 * switches. On GitHub Pages or `python -m http.server` this file is served as
 * plain text; sync.js detects the non-JSON response and stays dormant, so the
 * static versions keep working unchanged.
 *
 * Actions:
 *   GET  ?action=load   -> { ok, empty, savedAt, data: {key: value, ...} }
 *   POST ?action=save   -> body { data: {key: value}, stashFirst?: bool, reason?: str }
 *                          Mirrors the snapshot into journey_kv (upsert + delete
 *                          missing keys) and archives logic-test results into
 *                          logic_attempts (append-only, never deleted).
 *   POST ?action=stash  -> body { data, reason? }  Keeps a displaced snapshot
 *                          in journey_stash (safety copy, last 15 kept).
 *
 * Single user, same-origin only — no auth by design.
 */

header("Content-Type: application/json");
header("Cache-Control: no-cache, no-store, must-revalidate");

const DB_FILE = __DIR__ . "/journey.sqlite";
const KEY_PREFIX_RE = '/^odoo[-_]/';
const MAX_BODY_BYTES = 16 * 1024 * 1024; // drafts hold code for 80+ questions; be generous
const STASH_KEEP = 15;

function fail(int $code, string $msg): void {
    http_response_code($code);
    echo json_encode(["ok" => false, "error" => $msg]);
    exit;
}

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO("sqlite:" . DB_FILE);
        } catch (PDOException $e) {
            fail(500, "cannot open journey.sqlite: " . $e->getMessage());
        }
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec("PRAGMA journal_mode = WAL");
        $pdo->exec("PRAGMA busy_timeout = 5000");
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS journey_kv (
                key        TEXT PRIMARY KEY,
                value      TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS logic_attempts (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                taken_at       TEXT NOT NULL UNIQUE,  -- ISO date of the attempt (natural key)
                score          INTEGER NOT NULL,
                total          INTEGER NOT NULL,
                pct            INTEGER NOT NULL,
                time_used_secs INTEGER,
                by_category    TEXT,                  -- JSON {cat: [correct, total]}
                entry_json     TEXT NOT NULL,         -- full history entry, verbatim
                saved_at       TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS journey_stash (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                reason     TEXT,
                data_json  TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS journey_meta (
                key   TEXT PRIMARY KEY,
                value TEXT
            );
        ");
    }
    return $pdo;
}

function now_iso(): string {
    return gmdate("c");
}

function read_body(): array {
    $raw = file_get_contents("php://input", false, null, 0, MAX_BODY_BYTES + 1);
    if ($raw === false || $raw === "") fail(400, "empty request body");
    if (strlen($raw) > MAX_BODY_BYTES) fail(413, "payload too large");
    $body = json_decode($raw, true);
    if (!is_array($body)) fail(400, "body is not valid JSON");
    return $body;
}

/** Keep only string→string pairs whose key matches the workbook prefix. */
function clean_snapshot($data): array {
    if (!is_array($data)) fail(400, "data must be an object of key/value strings");
    $out = [];
    foreach ($data as $k => $v) {
        if (!is_string($k) || !preg_match(KEY_PREFIX_RE, $k)) continue;
        if (!is_string($v)) continue; // localStorage values are always strings
        $out[$k] = $v;
    }
    return $out;
}

function current_kv(PDO $pdo): array {
    $out = [];
    foreach ($pdo->query("SELECT key, value FROM journey_kv") as $row) {
        $out[$row["key"]] = $row["value"];
    }
    return $out;
}

function insert_stash(PDO $pdo, array $snapshot, string $reason): void {
    if (!$snapshot) return; // nothing worth keeping
    $pdo->prepare("INSERT INTO journey_stash (created_at, reason, data_json) VALUES (?, ?, ?)")
        ->execute([now_iso(), $reason, json_encode($snapshot, JSON_UNESCAPED_SLASHES)]);
    $pdo->exec("DELETE FROM journey_stash WHERE id NOT IN
                (SELECT id FROM journey_stash ORDER BY id DESC LIMIT " . STASH_KEEP . ")");
}

/**
 * Archive logic-test results out of the odoo_logic_history_v1 snapshot value.
 * Append-only on purpose: the in-browser history is trimmed to its last 50
 * entries, but this table never forgets an attempt.
 */
function harvest_logic_attempts(PDO $pdo, array $snapshot): int {
    if (!isset($snapshot["odoo_logic_history_v1"])) return 0;
    $hist = json_decode($snapshot["odoo_logic_history_v1"], true);
    if (!is_array($hist)) return 0;
    $ins = $pdo->prepare(
        "INSERT OR IGNORE INTO logic_attempts
         (taken_at, score, total, pct, time_used_secs, by_category, entry_json, saved_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $added = 0;
    foreach ($hist as $entry) {
        if (!is_array($entry) || !isset($entry["date"], $entry["score"], $entry["total"])) continue;
        $total = max(1, (int)$entry["total"]);
        $ins->execute([
            (string)$entry["date"],
            (int)$entry["score"],
            (int)$entry["total"],
            isset($entry["pct"]) ? (int)$entry["pct"] : (int)round((int)$entry["score"] * 100 / $total),
            isset($entry["timeUsed"]) ? (int)$entry["timeUsed"] : null,
            isset($entry["byCat"]) ? json_encode($entry["byCat"], JSON_UNESCAPED_SLASHES) : null,
            json_encode($entry, JSON_UNESCAPED_SLASHES),
            now_iso(),
        ]);
        $added += $ins->rowCount();
    }
    return $added;
}

$action = $_GET["action"] ?? "";
$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

switch ($action) {
    case "load":
        if ($method !== "GET") fail(405, "load is GET-only");
        $pdo = db();
        $data = current_kv($pdo);
        $savedAt = $pdo->query("SELECT value FROM journey_meta WHERE key = 'saved_at'")->fetchColumn();
        echo json_encode([
            "ok"      => true,
            "empty"   => count($data) === 0,
            "savedAt" => $savedAt === false ? null : $savedAt,
            "data"    => (object)$data,
        ], JSON_UNESCAPED_SLASHES);
        break;

    case "save":
        if ($method !== "POST") fail(405, "save is POST-only");
        $body = read_body();
        $snapshot = clean_snapshot($body["data"] ?? null);
        $pdo = db();
        $now = now_iso();
        // BEGIN IMMEDIATE takes the write lock up front so concurrent workers
        // queue on busy_timeout instead of failing with "database is locked"
        // (a DEFERRED read->write upgrade returns SQLITE_BUSY immediately).
        $pdo->exec("BEGIN IMMEDIATE");
        try {
            $existing = current_kv($pdo);
            // Safety net: an empty snapshot overwriting a non-empty journey is
            // almost always an accident (cleared site data in an open tab, a
            // broken client) — keep a copy even when the client didn't ask.
            $autoStash = !$snapshot && $existing && empty($body["stashFirst"]);
            if ($existing && $existing != $snapshot && (!empty($body["stashFirst"]) || $autoStash)) {
                insert_stash($pdo, $existing,
                    $autoStash ? "auto-stash-empty-overwrite"
                               : (string)($body["reason"] ?? "replaced-by-save"));
            }
            $del = $pdo->prepare("DELETE FROM journey_kv WHERE key = ?");
            foreach (array_keys($existing) as $k) {
                if (!array_key_exists($k, $snapshot)) $del->execute([$k]);
            }
            $up = $pdo->prepare(
                "INSERT INTO journey_kv (key, value, updated_at) VALUES (?, ?, ?)
                 ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
                 WHERE value <> excluded.value"
            );
            foreach ($snapshot as $k => $v) $up->execute([$k, $v, $now]);
            $attempts = harvest_logic_attempts($pdo, $snapshot);
            $pdo->prepare("INSERT INTO journey_meta (key, value) VALUES ('saved_at', ?)
                           ON CONFLICT(key) DO UPDATE SET value = excluded.value")
                ->execute([$now]);
            $pdo->exec("COMMIT");
        } catch (Throwable $e) {
            try { $pdo->exec("ROLLBACK"); } catch (Throwable $_) {}
            fail(500, "save failed: " . $e->getMessage());
        }
        echo json_encode([
            "ok"          => true,
            "savedAt"     => $now,
            "keys"        => count($snapshot),
            "newAttempts" => $attempts,
        ]);
        break;

    case "stash":
        if ($method !== "POST") fail(405, "stash is POST-only");
        $body = read_body();
        $snapshot = clean_snapshot($body["data"] ?? null);
        $pdo = db();
        insert_stash($pdo, $snapshot, (string)($body["reason"] ?? "manual"));
        echo json_encode(["ok" => true]);
        break;

    default:
        fail(400, "unknown action; use load, save, or stash");
}
