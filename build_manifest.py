#!/usr/bin/env python3
"""Walk the repo and write manifest.json that index.html consumes on GitHub Pages.

Run before committing whenever you add/rename folders or content files:
    python3 build_manifest.py

The PHP server reads the live filesystem via list.php; this script is the static
mirror for environments without server-side scripting.
"""
import datetime
import fnmatch
import json
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "manifest.json")

# Extension -> kind. Anything not in this map is ignored (binaries, unknown).
EXT_KIND = {
    "md": "markdown", "markdown": "markdown",
    "pdf": "pdf",
    # Code
    "py": "code", "js": "code", "ts": "code", "jsx": "code", "tsx": "code",
    "mjs": "code", "cjs": "code",
    "html": "code", "htm": "code", "css": "code", "scss": "code", "sass": "code",
    "sh": "code", "bash": "code", "zsh": "code", "fish": "code",
    "sql": "code", "json": "code", "jsonl": "code",
    "yaml": "code", "yml": "code", "toml": "code", "ini": "code", "cfg": "code", "conf": "code",
    "cpp": "code", "cc": "code", "cxx": "code", "hpp": "code", "hxx": "code",
    "c": "code", "h": "code",
    "java": "code", "kt": "code", "scala": "code", "groovy": "code",
    "rb": "code", "go": "code", "rs": "code", "php": "code", "swift": "code",
    "lua": "code", "pl": "code", "r": "code", "jl": "code", "dart": "code",
    "vue": "code", "svelte": "code",
    "txt": "code",
}

# Always-skip names at any depth.
ALWAYS_SKIP = {
    "manifest.json", "list.php", "index.html", "app.js", "styles.css",
    "build_manifest.py", "README.md", ".gitignore", ".git",
}

# Folders under `tutorials/` become sub-items of the "Tutorial" sidebar entry.
# The order below determines the display order in the sidebar.
TUTORIAL_CHILDREN = [
    {"slug": "algorithms",      "title": "Algorithms"},
    {"slug": "odoo-framework",  "title": "Odoo Framework"},
    {"slug": "interview-final", "title": "Interview Final Stage"},
    {"slug": "logictest",       "title": "Logic Test"},
    {"slug": "roadmap",         "title": "Final Week Roadmap"},
    {"slug": "quickref",        "title": "Syntax Quick-Ref"},
    {"slug": "last-review",     "title": "Last Review"},
]
TUTORIALS_DIR = "tutorials"


def parse_gitignore(root):
    """Minimal .gitignore parser: dir/, glob, comments, blank lines. Negations ignored."""
    skip_dirs = set()
    skip_globs = []
    path = os.path.join(root, ".gitignore")
    if not os.path.isfile(path):
        return skip_dirs, skip_globs
    with open(path) as f:
        for line in f:
            s = line.strip()
            if not s or s.startswith("#") or s.startswith("!"):
                continue
            if s.endswith("/"):
                skip_dirs.add(s.rstrip("/"))
            else:
                skip_globs.append(s)
    return skip_dirs, skip_globs


def is_ignored(name, skip_dirs, skip_globs, is_dir=False):
    if is_dir and name in skip_dirs:
        return True
    for g in skip_globs:
        if fnmatch.fnmatch(name, g):
            return True
    return False


def classify_folder(files):
    kinds = {f["kind"] for f in files}
    if not kinds:
        return "empty"
    if kinds <= {"markdown"}:
        return "markdown"
    if kinds <= {"code"}:
        return "code"
    if kinds <= {"pdf"}:
        return "pdf"
    return "mixed"


def scan_folder(folder_path, skip_dirs, skip_globs):
    files = []
    try:
        names = sorted(os.listdir(folder_path))
    except OSError:
        return files
    for name in names:
        if name.startswith("."):
            continue
        if name in ALWAYS_SKIP:
            continue
        if is_ignored(name, skip_dirs, skip_globs):
            continue
        path = os.path.join(folder_path, name)
        if os.path.isdir(path):
            continue
        ext = name.rsplit(".", 1)[-1].lower() if "." in name else ""
        kind = EXT_KIND.get(ext)
        if not kind:
            continue
        try:
            size = os.path.getsize(path)
        except OSError:
            size = 0
        files.append({"name": name, "ext": ext, "kind": kind, "size": size})
    return files


def main():
    skip_dirs, skip_globs = parse_gitignore(ROOT)
    folders = []
    for name in sorted(os.listdir(ROOT)):
        if name.startswith("."):
            continue
        if name in ALWAYS_SKIP:
            continue
        path = os.path.join(ROOT, name)
        if not os.path.isdir(path):
            continue
        if is_ignored(name, skip_dirs, skip_globs, is_dir=True):
            continue
        if name == TUTORIALS_DIR:
            children = []
            for c in TUTORIAL_CHILDREN:
                child_index = os.path.join(path, c["slug"], "index.html")
                if os.path.isfile(child_index):
                    children.append({
                        "slug":  c["slug"],
                        "title": c["title"],
                        "entry": f"{TUTORIALS_DIR}/{c['slug']}/index.html",
                    })
            if children:
                folders.append({
                    "name":     "tutorial",
                    "kind":     "tutorial-group",
                    "children": children,
                })
            continue
        files = scan_folder(path, skip_dirs, skip_globs)
        if not files:
            continue
        folders.append({"name": name, "kind": classify_folder(files), "files": files})

    manifest = {
        "generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        "folders": folders,
    }
    with open(OUT, "w") as f:
        json.dump(manifest, f, indent=2)
    file_total = sum(len(f.get("files", [])) for f in folders)
    print(f"Wrote {OUT} — {len(folders)} folders, {file_total} files.")


if __name__ == "__main__":
    main()
