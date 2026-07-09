<?php
/*
 * router.php — front controller for the PHP-server version.
 *
 * Launch the workbook with:
 *     php -S localhost:8000 router.php
 *
 * The built-in PHP server would otherwise serve EVERY file in this folder as a
 * plain static download — including `.env` (the login password hash) and
 * `journey.sqlite` (the entire journey). This router 404s those before they can
 * leak, and hands everything else back to the built-in server unchanged
 * (static files served as-is, *.php executed). Returning `false` is the
 * documented way to say "serve this normally".
 *
 * It has NO effect on the static/Python versions — those never run PHP.
 */

$path = parse_url($_SERVER["REQUEST_URI"] ?? "/", PHP_URL_PATH);
$path = urldecode($path === null ? "/" : $path);

// Block:
//   - any dot-file or dot-directory segment (/.env, /.git/..., /.sessions/...)
//   - the SQLite database and its WAL/SHM/journal sidecars
if (preg_match('#(^|/)\.[^/]#', $path)
    || preg_match('#\.sqlite(-wal|-shm|-journal)?$#i', $path)) {
    http_response_code(404);
    header("Content-Type: text/plain");
    echo "Not found";
    return true;
}

// Everything else: let the built-in server handle it (returns false = serve
// the requested file/PHP script as usual).
return false;
