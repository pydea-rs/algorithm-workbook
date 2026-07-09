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
 * Actions (data actions require a valid login session — see AUTH below):
 *   GET  ?action=load   -> { ok, empty, savedAt, data: {key: value, ...} }
 *   POST ?action=save   -> body { data: {key: value}, stashFirst?: bool, reason?: str }
 *                          Mirrors the snapshot into journey_kv (upsert + delete
 *                          missing keys) and archives logic-test results into
 *                          logic_attempts (append-only, never deleted).
 *                          An EMPTY snapshot never overwrites a populated
 *                          journey — it is stashed and rejected (see the hard
 *                          guard below), so a cleared browser can't wipe the DB.
 *   POST ?action=stash  -> body { data, reason? }  Keeps a displaced snapshot
 *                          in journey_stash (safety copy, last 15 kept).
 *
 * AUTH — the journey belongs to one owner. load / save / stash all require a
 * valid session and answer 401 without one, so a visitor can neither read the
 * owner's journey nor write to the DB. Public (no-session) endpoints:
 *   POST ?action=login  -> body { password }  Verifies against the bcrypt hash
 *                          in .env; on success creates a session cookie that
 *                          lasts SESSION_EXPIRY_DAYS (default 7).
 *   POST ?action=logout -> destroys the session.
 *   GET  ?action=status -> { ok, authed }  Cheap "am I signed in?" probe.
 * The 5-wrong-password lock-out is client-side only, by design (see login.html).
 * On the static / Python versions this file is never executed, so none of this
 * runs and every visitor gets the isolated localStorage experience.
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

const SESSION_NAME = "odoo_journey_sid";

/** Minimal .env reader: KEY=VALUE lines, `#` comments, optional quotes. */
function load_env(string $file): array {
    $out = [];
    if (!is_file($file) || !is_readable($file)) return $out;
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = ltrim($line);
        if ($line === "" || $line[0] === "#") continue;
        $eq = strpos($line, "=");
        if ($eq === false) continue;
        $k = trim(substr($line, 0, $eq));
        $v = trim(substr($line, $eq + 1));
        if (strlen($v) >= 2 && ($v[0] === '"' || $v[0] === "'") && substr($v, -1) === $v[0]) {
            $v = substr($v, 1, -1);
        }
        if ($k !== "") $out[$k] = $v;
    }
    return $out;
}

/**
 * Start (or resume) the session. When $create is false we never mint a session
 * for an anonymous visitor: no cookie in the request means no session, so
 * casual/static traffic leaves no server-side litter and stays unauthed.
 * The cookie + GC lifetime are pinned to the configured expiry so a signed-in
 * owner is not re-prompted for the whole window, even when idle.
 */
function session_boot(bool $create, int $lifetime): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    if (!$create && empty($_COOKIE[SESSION_NAME])) return;
    $dir = __DIR__ . "/.sessions";
    if (!is_dir($dir)) @mkdir($dir, 0700, true);
    if (is_dir($dir) && is_writable($dir)) session_save_path($dir);
    ini_set("session.gc_maxlifetime", (string)$lifetime);
    ini_set("session.use_strict_mode", "1");
    session_name(SESSION_NAME);
    session_set_cookie_params([
        "lifetime"  => $lifetime,
        "path"      => "/",
        "httponly"  => true,
        "samesite"  => "Lax",
    ]);
    session_start();
}

function is_authed(): bool {
    return !empty($_SESSION["authed"])
        && isset($_SESSION["expires"])
        && (int)$_SESSION["expires"] > time();
}

/** Boot the session and 401 unless the caller holds a valid one. */
function require_auth(int $lifetime): void {
    session_boot(false, $lifetime);
    if (!is_authed()) fail(401, "authentication required");
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

$ENV = load_env(__DIR__ . "/.env");
$PW_HASH = (string)($ENV["JOURNEY_PASSWORD_HASH"] ?? "");
$EXPIRY_DAYS = (isset($ENV["SESSION_EXPIRY_DAYS"]) && (int)$ENV["SESSION_EXPIRY_DAYS"] > 0)
    ? (int)$ENV["SESSION_EXPIRY_DAYS"] : 7;
$SESSION_LIFETIME = $EXPIRY_DAYS * 86400;

switch ($action) {
    case "status":
        session_boot(false, $SESSION_LIFETIME);
        echo json_encode(["ok" => true, "authed" => is_authed()]);
        break;

    case "login":
        if ($method !== "POST") fail(405, "login is POST-only");
        if ($PW_HASH === "") fail(500, "server has no password configured");
        $body = read_body();
        $pw = isset($body["password"]) && is_string($body["password"]) ? $body["password"] : "";
        session_boot(true, $SESSION_LIFETIME);
        if ($pw === "" || !password_verify($pw, $PW_HASH)) {
            usleep(300000); // small, constant-ish delay to blunt online guessing
            fail(401, "incorrect password");
        }
        session_regenerate_id(true); // fresh id on privilege change (anti-fixation)
        $_SESSION["authed"] = true;
        $_SESSION["expires"] = time() + $SESSION_LIFETIME;
        echo json_encode(["ok" => true, "expiresInDays" => $EXPIRY_DAYS]);
        break;

    case "logout":
        session_boot(false, $SESSION_LIFETIME);
        if (session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION = [];
            $p = session_get_cookie_params();
            setcookie(session_name(), "", [
                "expires"  => time() - 42000,
                "path"     => $p["path"] ?: "/",
                "httponly" => true,
                "samesite" => "Lax",
            ]);
            session_destroy();
        }
        echo json_encode(["ok" => true]);
        break;

    case "load":
        if ($method !== "GET") fail(405, "load is GET-only");
        require_auth($SESSION_LIFETIME);
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
        require_auth($SESSION_LIFETIME);
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

            // HARD GUARD: an empty snapshot must NEVER destroy a populated
            // journey. This is the classic accident — site data cleared while a
            // tab was still open, so that tab's running auto-save or exit beacon
            // ships an empty snapshot. Keep a safety copy and REFUSE the wipe;
            // the client re-hydrates from the DB on its next load (empty local
            // adopts the server). The client also declines to send empty
            // snapshots, but the server is the last line of defense for any
            // future or misbehaving client.
            if (!$snapshot && $existing) {
                insert_stash($pdo, $existing, "empty-overwrite-blocked");
                $pdo->exec("COMMIT");
                $savedAt = $pdo->query("SELECT value FROM journey_meta WHERE key = 'saved_at'")->fetchColumn();
                echo json_encode([
                    "ok"      => true,
                    "skipped" => "empty-overwrite-protected",
                    "savedAt" => $savedAt === false ? null : $savedAt,
                    "keys"    => count($existing),
                ]);
                break; // leaves the switch — the trailing success echo is skipped
            }

            // A non-empty overwrite that displaces different data keeps a copy
            // when the client asks for it (stashFirst) — e.g. conflict-local-wins.
            if ($existing && $existing != $snapshot && !empty($body["stashFirst"])) {
                insert_stash($pdo, $existing, (string)($body["reason"] ?? "replaced-by-save"));
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
        require_auth($SESSION_LIFETIME);
        $body = read_body();
        $snapshot = clean_snapshot($body["data"] ?? null);
        $pdo = db();
        insert_stash($pdo, $snapshot, (string)($body["reason"] ?? "manual"));
        echo json_encode(["ok" => true]);
        break;

    default:
        fail(400, "unknown action; use status, login, logout, load, save, or stash");
}
