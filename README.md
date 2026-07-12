# Algorithm Workbook

A browsable, self-contained study space for coding-assessment prep. Runs entirely in the
browser — no build step, no backend required, works from GitHub Pages or a local static
server.

## Live demos

- **[pydea-rs.github.io/algorithm-workbook](https://pydea-rs.github.io/algorithm-workbook)**
- **[pya-h.github.io/algorithm-workbook](https://pya-h.github.io/algorithm-workbook)**

Both demos serve the same content from GitHub Pages. Open either and the sidebar will
list every folder in the repo.

## What this is

The repository grew out of prepping for the **Odoo Coderbyte first-step assessment**, but
the content has expanded well past that scope. Today it is three things at once:

1. A **workbook shell** at the repo root — an index page that auto-discovers every folder,
   embeds interactive tutorials, previews markdown/code files, and renders PDFs.
2. Five **interactive tutorials** under `tutorials/` — an algorithms masterclass with a live
   Python + JS + SQL runner, a separate Odoo framework tutorial, a final-stage interview
   prep course built on the same runner framework, a timed logic-test simulator, and an
   interactive final-week study roadmap.
3. A **library of scratch solutions and long-form notes** — per-question code folders,
   deep-dive markdown, and reference PDFs.

Everything is hand-rolled vanilla JS/CSS/HTML. The only external dependencies (Pyodide,
sql.js, marked, highlight.js) are pulled from CDNs on demand.

## Repository layout

```
.
├── index.html               # Workbook shell — folder browser
├── app.js                   # Sidebar, router, iframe embed, file preview
├── styles.css               # Workbook shell styles
├── build_manifest.py        # Static folder scanner → manifest.json (for GitHub Pages)
├── list.php                 # Dynamic folder scanner (for a PHP server, same JSON shape)
├── manifest.json            # Generated index consumed by app.js
│
├── tutorials/
│   ├── algorithms/          # Interactive masterclass — 57 questions, Python + JS + SQL
│   ├── odoo-framework/      # Standalone Odoo framework tutorial
│   ├── interview-final/     # Final-stage (live interview) prep — same framework, harder content
│   ├── logictest/           # 25-minute aptitude & logical-reasoning test simulator
│   ├── roadmap/             # Interactive final-week study plan (countdown + daily checklists)
│   ├── quickref/            # Syntax cheat-sheets — regex, SQL, Python, algorithm templates
│   └── last-review/         # Final 1.5 h / 3 h pre-interview consolidation review
│
├── interesting/             # Deep-dive notes written during study sessions
│   ├── sql-joins.md
│   ├── database-normalization.md
│   ├── hash-tables-how-dict-works.md
│   ├── sql-and-regex-cheatsheet.md
│   └── algorithm-book-recommendations.md
│
├── doc/                     # Reference material (Coderbyte masterclass PDFs + question bank)
│
└── <problem-slug>/          # ~20 per-question scratch folders
    ├── main.py              # Reference solutions in Python / JS / C++ / Go / Java
    └── question.md          # Optional problem statement
```

## Live demos vs local run

The workbook is designed to work in two environments and auto-detects which one it is in:

| Environment       | Data source                          | How to run                             |
|-------------------|--------------------------------------|----------------------------------------|
| GitHub Pages      | Static `manifest.json`               | Just visit the demo URL                |
| Local Python HTTP | Static `manifest.json`               | `python3 -m http.server` then localhost |
| Local PHP server  | Dynamic `list.php` (live filesystem) | `php -S localhost:8000 router.php`     |

> **PHP launch note:** always pass `router.php` as shown. It 404s `.env`, the SQLite
> database and other dotfiles that the bare built-in server would otherwise hand out as
> plain downloads. Without it those files leak.

The front-end tries `list.php` first; if the response isn't JSON, it falls back to the static
manifest. That means one codebase supports both modes without any config switch.

### Journey backup — PHP mode only

Under `php -S`, `sync.js` + `sync.php` mirror every `odoo_*` localStorage key into a local
SQLite file (`journey.sqlite`, git-ignored), so progress, drafts, notes and history survive
browser and device switches:

- On page load the browser is hydrated from SQLite **before** the apps read localStorage.
  An empty database is seeded *from* localStorage first, never the other way around — an
  old journey can't be wiped by a fresh DB.
- Auto-backup every 45 s (only when something changed) plus on tab hide/close; a manual
  **Save journey** button appears in the tutorials' settings modal.
- Logic-test results are additionally archived append-only in a `logic_attempts` table,
  and any snapshot about to be overwritten is kept in `journey_stash` — nothing is lost.

On GitHub Pages or the Python server, `sync.js` detects that `sync.php` isn't executed and
stays dormant — both static modes behave exactly as before.

### Login — PHP mode only

The synced journey belongs to one owner, so on the PHP server the site is gated:

- Opening any page redirects to **`login.html`** until you sign in. The password is checked
  server-side against a **bcrypt hash in `.env`** (`JOURNEY_PASSWORD_HASH`); copy
  `.env.example` to `.env` and drop your own hash in — generate one with
  `php -r 'echo password_hash("your-password", PASSWORD_DEFAULT), "\n";'`.
- A successful sign-in sets an `HttpOnly` session cookie that lasts
  `SESSION_EXPIRY_DAYS` (default **7**) — no re-typing the password every few hours.
- `sync.php`'s `load` / `save` / `stash` all **require that session** and answer `401`
  without it, so no visitor can read the owner's journey or write to the database — this is
  the real security boundary, independent of the UI.
- After **5** wrong tries the login form offers **"continue with the local version"**: that
  browser is flagged local-only (a non-synced `journey_local_mode_v1` key) and from then on
  behaves exactly like the static site — isolated localStorage, no hydration, no autosave,
  zero database access. The 5-try count is client-side only, by design.

The static / Python versions never execute `sync.php`, so there's no login there at all —
every visitor just gets their own isolated localStorage journey.

## Interactive tutorials

### Algorithms masterclass — `tutorials/algorithms/`

The main deliverable. A single-page tutorial + question workbench:

- **8 modules** covering arrays/strings, hash maps, two pointers, sliding window, binary
  search, stacks/queues, recursion/backtracking, graphs, dynamic programming, and SQL.
- **57 questions** with hints, reference solutions, and hidden test cases.
- **Live runners** for Python (Pyodide), JavaScript (`new Function`), and SQL (sql.js).
- **8 Practice Sets** (deterministically shuffled) plus a **Final Exam** that draws 12
  random questions from a held-back pool.
- **Persistent state** via `localStorage`: solved questions, code drafts per question,
  and UI preferences (theme, accent, density, code font size).
- **Web-worker execution** with terminate-on-timeout — infinite loops in user code no
  longer freeze the tab.

See [tutorials/algorithms/README.md](tutorials/algorithms/README.md) for the full feature
list, keyboard shortcuts, and question-editing format.

### Odoo Framework — `tutorials/odoo-framework/`

A separate standalone tutorial on the Odoo framework itself. Rendered via iframe from the
workbook shell.

### Interview Final Stage — `tutorials/interview-final/`

Prep for the 3-hour live technical interview (Odoo's final recruitment stage). Reuses the
algorithms framework — Python/JS/SQL sandboxes, practice sets, final exam — with new content:

- **16 modules**: a stage-1 recap, a live-coding-craft chapter (with a day-of-interview
  checklist), a stage-1 gap patch (linked lists, math & bits — M2b), algorithm deep dives at
  medium/hard difficulty (M3–M11), SQL and database-design deep dives (M12–M13), OOP &
  design patterns (M14), and application-level system design (M15).
- **90 questions** across 16 practice sets (every module has one, including the recap):
  69 Python/JS coding, 10 runnable SQL, and 11 reveal-solution design questions
  (schema design, OOD, system design).
- A **Final Exam** dealing 12 questions from a curated 51-question runnable-only pool,
  stratified to always give 8 algorithm + 4 SQL — the real interview's 2:1 ratio.
- Per-question **timers** rated against each question's time budget, plus a global exam
  timer with recorded sessions.

See [tutorials/interview-final/README.md](tutorials/interview-final/README.md) for the
question-type breakdown, module map, and editing format.

### Logic Test Simulator — `tutorials/logictest/`

A single-file simulation of the timed aptitude & logical-reasoning screening test:

- **25 questions in 25 minutes**, dealt at random from a bank of 160+ questions across
  10 categories — numerical reasoning, work rate, patterns & sequences, logical deduction,
  verbal reasoning, trick/attention questions, geometry, data interpretation, general
  reasoning, and SVG-rendered **shape & spatial reasoning** puzzles (matching the
  arithmetic + verbal + non-verbal mix candidates report from the real test).
- Coderbyte-style flow: answer in any order, **skip** and return, **flag** for review,
  auto-submit when the clock runs out, keyboard shortcuts throughout.
- Results page with per-category score breakdown, then a **review mode** that walks back
  through every question read-only with your pick and the correct answer marked.
- Attempt history (last/best score) persisted in `localStorage` under `odoo_logic_*`.

### Final Week Roadmap — `tutorials/roadmap/`

A single-file interactive study plan for the last week before the live interview:

- **Live countdown** to the interview slot and an overall progress bar.
- **9 day-cards** (warm-up day through interview day), each with checkable tasks —
  which modules to read, which practice sets to drill, matched LeetCode problems
  (with links), logic-simulator attempts, and two full mock exams on the weekend.
- **Study guidance**: rules of the week (narrate aloud, the 25-minute rule, a spaced
  re-do list, one language only) and a suggested daily rhythm (deep-work mornings,
  rehearsal afternoons, review evenings, hard stop at night).
- Progress persists in `localStorage` under `odoo_roadmap_v1`; today's card is
  auto-highlighted and past days fold away.

### Syntax Quick-Ref — `tutorials/quickref/`

A single-file, last-minute review sheet — meant to be skimmed in the hour before the
interview. No explanations, just what to type and when:

- **Five sections**, each a 5–10 minute read: **Regex** (Python `re`), **SQL**
  (skeleton, joins, window functions, NULL logic, CTEs), **Python Essentials**
  (built-ins, `collections`, `heapq`, `bisect`, `itertools`, `math`), **Algorithm
  Templates** (copy-ready binary search, sliding window, BFS/DFS, backtracking,
  union-find, Dijkstra, topo-sort, DP, monotonic stack), and **Complexity & Gotchas**.
- Each section ends with an expandable **"Deep cuts"** block (less-used but good to know).
- **Instant filter** (press `/`) highlights matches across every card; hover any code
  block to **copy** it; dark / midnight / light themes with accent colors, all synced
  to the shared journey backup (prefs under `odoo_ref_prefs_v1`).

### Last Review — `tutorials/last-review/`

A step-by-step consolidation app for the hours before the live technical interview.
It distils the final-interview modules, quickref, roadmap, and selected extra
material into two lengths:

- **1.5 h** — condensed notes, key code patterns, SQL idioms, and the highest-yield
  questions.
- **3 h** — fuller explanations, more edge cases, and a larger important-questions
  recap.

Features per-section checkboxes, progress tracking, a session countdown timer,
export/import, and the same theme/accent preferences as the other tutorials.

## Long-form notes — `interesting/`

Concept explainers written during study sessions, going deeper than the tutorial content:

- **SQL joins** — INNER / LEFT / RIGHT / FULL OUTER / SELF, each with a walked-through example.
- **Database normalization** — 1NF, 2NF, 3NF, and when to denormalize.
- **How `dict` works** — hash tables from first principles.
- **Hard SQL & Regex cheatsheet** — the "I had to look it up last time" list, assessment-scoped.
- **Algorithm book recommendations** — ranked reading list for going deeper.

## Adding content

To add a new folder that will show up in the workbook:

1. Drop it at the repo root with any mix of `.md`, `.py`, `.js`, `.cpp`, `.pdf`, etc.
2. Regenerate the static manifest (only needed for the GitHub Pages demo):
   ```bash
   python3 build_manifest.py
   ```
   The PHP server needs nothing — it scans live per request.
3. Commit and push. GitHub Pages will redeploy automatically.

The build script respects `.gitignore` and skips the workbook's own files.

## Local development

```bash
# Just serve statically
python3 -m http.server 8000
# → http://localhost:8000

# Or with PHP for live folder listing + the synced, password-gated journey
php -S localhost:8000 router.php
```

To modify the algorithms tutorial specifically, edit files under `tutorials/algorithms/`
and refresh. There is no build step — everything is served as-is.

## License

Personal study material. The reference PDFs and question banks in `doc/` retain their
original authorship (KIMI Masterclass series); everything else in this repo is released
under the MIT License.
