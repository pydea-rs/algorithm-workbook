# Odoo Final Stage — Live Interview Prep

A single-page course + workbench for the **3-hour live technical interview** (Odoo's final
recruitment stage): two algorithm problems plus one SQL / database-design task, medium-to-hard,
in the language of your choice. Built on the same framework as `../algorithms/`, with new
content and a heavier question bank.

- **16 modules**: stage-1 recap (M1), live-coding craft incl. day-of-interview checklist (M2),
  stage-1 gap patch — linked lists, math & bits (M2b), algorithm deep dives (M3–M11),
  SQL deep dive (M12), database design & indexes (M13), OOP & design patterns (M14),
  application-level system design (M15) — with 39 inline concept-check MCQs
- **16 Practice Sets** (PS1–PS15, incl. PS2b) — every module has one, including the recap
  (PS1 drills each stage-1 pillar) and the craft chapter (PS2: easy problems to run the
  6-step template on)
- **82 questions** (F01–F82): 63 Python/JS coding, 8 runnable SQL, 11 discussion/design
- **Final Exam** dealing 12 questions from a curated 43-question pool — stratified to always
  give **8 algorithm + 4 SQL** (the real interview's 2:1 ratio, exactly; topic tags hidden)
- **Live runners**: Python (Pyodide) + JavaScript in a **Web Worker** with
  terminate-on-timeout, SQL against a real in-browser SQLite (sql.js)
- **Timers**: an optional per-question timer that rates you against each question's time
  budget, and a single global exam timer with recorded sessions
- **Persistent state** in `localStorage` under `odoo_final_*` keys — fully isolated from the
  algorithms tutorial's `odoo_prep_*` state

## How to open

Just files — no build step, no dependencies. Same three options as the algorithms tutorial:

```bash
cd tutorials/interview-final
python3 -m http.server 8765     # → http://localhost:8765
```

or double-click `index.html` (Firefox is most permissive on `file://`), or VS Code
**Live Server**. A localhost origin is recommended because Pyodide and sql.js are fetched
from CDNs and some browsers restrict `file://` network access.

## The three question types

| Type | Card | Counts as solved |
|---|---|---|
| `python` (63) | full workbench, Python/JS language toggle, hidden tests | all tests pass (either language), or manual **Mark solved** |
| `sql` with fixture (8) | SQL workbench against seeded SQLite, expected-table diff | all fixtures pass, or manual mark |
| `design` (11) | statement + **Reveal approach** (no sandbox — think first, then compare) | manual **Mark solved** only |

Design questions (schema design, OOD, system design) are deliberately sandbox-free: the skill
being drilled is producing the answer *out loud* before seeing the reference. They are also
excluded from the Final Exam pool, since the exam scoreboard tracks passing tests.

## Module map

| Modules | Theme |
|---|---|
| M1 | Compressed recap of the stage-1 algorithms tutorial (+ PS1 drills, one per pillar) |
| M2 | Live-coding craft: the 6-step template, narration, hints, pacing, day-of checklist |
| M2b | Stage-1 gap patch: linked-list pointer surgery, primes/GCD/modular math, bit tricks |
| M3–M8 | Arrays & windows, hashing, backtracking, binary search, trees, graphs — advanced tier |
| M9–M11 | Dynamic programming, greedy & intervals, heaps (with a from-memory JS MinHeap) |
| M12–M13 | SQL deep dive (joins, windows, NULL traps) and DB design & indexes (incl. clustered vs non-clustered — reported verbatim from this interview) |
| M14–M15 | OOP, SOLID & patterns; system design at application level (rate limiter, job queue, feeds, booking) |

## File layout

```
tutorials/interview-final/
├── index.html        # Page shell: sidebar, topbar, modals
├── styles.css        # Theming via CSS variables + animations
├── app.js            # Controller: nav, routing, exam, timers, progress
├── content.js        # 16 modules (HTML body blocks + MCQs)
├── questions.js      # 82 questions incl. SQL fixtures + design writeups + exam pool
├── questions-js.js   # JavaScript sidecar solutions for the 63 coding questions
├── runner.js         # Main thread: worker orchestration + SQL runner (sql.js)
├── runner-worker.js  # Web Worker: Pyodide + JS execution, terminate-on-timeout
└── README.md         # This file
```

## localStorage keys

| Key | Holds |
|---|---|
| `odoo_final_progress_v1` | solved-question set |
| `odoo_final_prefs_v1` | theme, accent, density, code size, animations |
| `odoo_final_timing_v1` | per-question timer history + best times |
| `odoo_final_drafts_v1` | your editor code per question/language, auto-saved |
| `odoo_final_exam_history_v1` | recorded exam sessions |

The sidebar **Reset** button clears progress; the settings modal resets preferences.

## Updating questions

Same schema as the algorithms tutorial (see its README), plus the new fields:

- `type: "sql"` questions add `sqlSchema` (CREATE + INSERT fixtures), `sqlStarter`,
  `sqlSolution`, and `tests: [{name, orderMatters, schema?, expected: {columns, rows}}]` —
  a per-test `schema` override lets a single question probe edge-case fixtures (e.g. a NULL
  that detonates `NOT IN`).
- `type: "design"` questions need only `statement`, `hint`, `solution` (plain-text writeup
  shown in the modal) and optional `explanation` (HTML follow-up notes).

New ids go into a Practice Set in `PRACTICE_SETS`; runnable ones may also join
`FINAL_EXAM_POOL` at the bottom of `questions.js` (keep design questions out of the pool —
their cards can't report a pass, so they'd make the exam impossible to complete).

## License

Personal study material, MIT — same terms as the repo root.
