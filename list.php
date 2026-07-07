<?php
/*
 * list.php — dynamic equivalent of manifest.json for the PHP-server demo.
 * Returns the same JSON shape as build_manifest.py, scanned live at request time.
 *
 * On GitHub Pages this file is served as raw text; the front-end detects that
 * (non-JSON parse failure) and falls back to manifest.json.
 */
header("Content-Type: application/json");
header("Cache-Control: no-cache, no-store, must-revalidate");

$ROOT = __DIR__;

$EXT_KIND = [
    "md" => "markdown", "markdown" => "markdown",
    "pdf" => "pdf",
    "py" => "code", "js" => "code", "ts" => "code", "jsx" => "code", "tsx" => "code",
    "mjs" => "code", "cjs" => "code",
    "html" => "code", "htm" => "code", "css" => "code", "scss" => "code", "sass" => "code",
    "sh" => "code", "bash" => "code", "zsh" => "code", "fish" => "code",
    "sql" => "code", "json" => "code", "jsonl" => "code",
    "yaml" => "code", "yml" => "code", "toml" => "code", "ini" => "code",
    "cfg" => "code", "conf" => "code",
    "cpp" => "code", "cc" => "code", "cxx" => "code", "hpp" => "code", "hxx" => "code",
    "c" => "code", "h" => "code",
    "java" => "code", "kt" => "code", "scala" => "code", "groovy" => "code",
    "rb" => "code", "go" => "code", "rs" => "code", "php" => "code", "swift" => "code",
    "lua" => "code", "pl" => "code", "r" => "code", "jl" => "code", "dart" => "code",
    "vue" => "code", "svelte" => "code",
    "txt" => "code",
];

$ALWAYS_SKIP = [
    "manifest.json", "list.php", "index.html", "app.js", "styles.css",
    "build_manifest.py", "README.md", ".gitignore", ".git",
];

// Folders under tutorials/ become sub-items of the "Tutorial" sidebar entry.
$TUTORIALS_DIR = "tutorials";
$TUTORIAL_CHILDREN = [
    ["slug" => "algorithms",      "title" => "Algorithms"],
    ["slug" => "odoo-framework",  "title" => "Odoo Framework"],
    ["slug" => "interview-final", "title" => "Interview Final Stage"],
    ["slug" => "logictest",       "title" => "Logic Test"],
    ["slug" => "roadmap",         "title" => "Final Week Roadmap"],
    ["slug" => "quickref",        "title" => "Syntax Quick-Ref"],
];

function parse_gitignore_php($root) {
    $skip_dirs = [];
    $skip_globs = [];
    $p = "$root/.gitignore";
    if (!is_file($p)) return [$skip_dirs, $skip_globs];
    foreach (file($p, FILE_IGNORE_NEW_LINES) as $line) {
        $s = trim($line);
        if ($s === "" || $s[0] === "#" || $s[0] === "!") continue;
        if (substr($s, -1) === "/") $skip_dirs[] = rtrim($s, "/");
        else $skip_globs[] = $s;
    }
    return [$skip_dirs, $skip_globs];
}

function is_ignored_php($name, $skip_dirs, $skip_globs, $is_dir = false) {
    if ($is_dir && in_array($name, $skip_dirs, true)) return true;
    foreach ($skip_globs as $g) {
        if (fnmatch($g, $name)) return true;
    }
    return false;
}

function classify_folder_php($files) {
    $kinds = [];
    foreach ($files as $f) $kinds[$f["kind"]] = true;
    if (!$kinds) return "empty";
    if (array_keys($kinds) === ["markdown"]) return "markdown";
    if (array_keys($kinds) === ["code"]) return "code";
    if (array_keys($kinds) === ["pdf"]) return "pdf";
    return "mixed";
}

function scan_folder_php($folder_path, $skip_dirs, $skip_globs, $EXT_KIND, $ALWAYS_SKIP) {
    $files = [];
    $names = @scandir($folder_path);
    if ($names === false) return $files;
    sort($names);
    foreach ($names as $name) {
        if ($name === "." || $name === "..") continue;
        if ($name[0] === ".") continue;
        if (in_array($name, $ALWAYS_SKIP, true)) continue;
        if (is_ignored_php($name, $skip_dirs, $skip_globs)) continue;
        $full = "$folder_path/$name";
        if (is_dir($full)) continue;
        $dot = strrpos($name, ".");
        $ext = $dot === false ? "" : strtolower(substr($name, $dot + 1));
        if (!isset($EXT_KIND[$ext])) continue;
        $size = @filesize($full);
        $files[] = [
            "name" => $name,
            "ext"  => $ext,
            "kind" => $EXT_KIND[$ext],
            "size" => $size === false ? 0 : $size,
        ];
    }
    return $files;
}

[$skip_dirs, $skip_globs] = parse_gitignore_php($ROOT);

$folders = [];
$names = @scandir($ROOT);
if ($names !== false) {
    sort($names);
    foreach ($names as $name) {
        if ($name === "." || $name === "..") continue;
        if ($name[0] === ".") continue;
        if (in_array($name, $ALWAYS_SKIP, true)) continue;
        $full = "$ROOT/$name";
        if (!is_dir($full)) continue;
        if (is_ignored_php($name, $skip_dirs, $skip_globs, true)) continue;
        if ($name === $TUTORIALS_DIR) {
            $children = [];
            foreach ($TUTORIAL_CHILDREN as $c) {
                $child_index = "$full/{$c['slug']}/index.html";
                if (is_file($child_index)) {
                    $children[] = [
                        "slug"  => $c["slug"],
                        "title" => $c["title"],
                        "entry" => "$TUTORIALS_DIR/{$c['slug']}/index.html",
                    ];
                }
            }
            if ($children) {
                $folders[] = [
                    "name"     => "tutorial",
                    "kind"     => "tutorial-group",
                    "children" => $children,
                ];
            }
            continue;
        }
        $files = scan_folder_php($full, $skip_dirs, $skip_globs, $EXT_KIND, $ALWAYS_SKIP);
        if (!$files) continue;
        $folders[] = [
            "name"  => $name,
            "kind"  => classify_folder_php($files),
            "files" => $files,
        ];
    }
}

echo json_encode([
    "generated" => gmdate("c"),
    "folders"   => $folders,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
