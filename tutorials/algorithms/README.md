# Odoo Coderbyte — Interactive Masterclass

A single-page tutorial + workbench for preparing the Odoo first-step Coderbyte assessment.
Built from the KIMI Masterclass written guide and the Extended Question Bank in `../../doc/`.

- **8 tutorial modules** fused from the KIMI chapters
- **8 Practice Sets** (4–7 mixed questions each, deterministically shuffled so order doesn't telegraph the topic)
- **Final Exam** that draws 12 random questions from a held-back pool of 13 (topic tags hidden)
- **57 coding/SQL questions** with hints, reference solutions, and live test runners
- **Python 3 in the browser** via Pyodide — no server, no install
- **JavaScript** workbench too — switch language per question in the runner panel
- **Customisable** theme, accent, density, code-text size, animations — saved in `localStorage`

## How to open

The tutorial is **just files** — no build step, no Node, no dependencies. Three ways to view it:

### 1. Local HTTP server (recommended)

Pyodide and the page assets are loaded by URL, so a tiny static server is the safest path:

```bash
cd tutorials/algorithms
python3 -m http.server 8765
```

Then open <http://localhost:8765> in any modern browser (Chrome, Firefox, Edge, Safari).

> Why "recommended"? Pyodide downloads its WASM runtime via `fetch()`. Some browsers (Chrome
> especially) restrict `file://` access to network resources and to localStorage. Serving from
> a localhost origin sidesteps every one of those restrictions.

### 2. Direct file open

You can `double-click index.html` and most things will work, including saved progress and
preferences. But:

- **Firefox**: works fully, including the Python workbench.
- **Chrome / Edge**: may refuse the Pyodide CDN request from `file://`. Use the localhost server
  if the workbench reports "Python: failed".
- **Safari**: behaviour varies — try the localhost server first.

### 3. VS Code Live Server

If you use the "Live Server" extension, right-click `index.html` → **Open with Live Server**.
Works identically to option 1.

## About the "Python: not loaded" pill

The status pill in the top-right shows the state of the in-browser Python runtime (Pyodide):

| State | Meaning |
|---|---|
| `Python: not loaded` | Pyodide hasn't been requested yet (the default on page load) |
| `Python: loading…` | Downloading and initialising — takes 5–10 seconds the first time |
| `Python: ready` | Workbench can run code instantly |
| `Python: failed` | Network problem; check your connection |

**Pyodide is lazy by design** so the page loads instantly. Three ways to flip it to "ready":

1. **Click the pill itself** — preloads Python without running any code.
2. **Click "Run tests"** on any Python question — the first run will block while Pyodide loads,
   subsequent runs are immediate.
3. **Wait** — it'll load itself when you eventually run something.

Once loaded, Pyodide stays in memory for the rest of the browser session.

## File layout

```
tutorials/algorithms/
├── index.html        # Page shell: sidebar, topbar, modals
├── styles.css        # Theming via CSS variables + animations
├── app.js            # Controller: nav, routing, modals, exam, progress
├── content.js        # 8 tutorial modules (HTML body blocks + MCQs)
├── questions.js      # All 57 questions: Python tests + reference solutions
├── questions-js.js   # JavaScript implementations for the 47 coding questions
├── runner.js         # Pyodide loader + Python harness + native JS harness
└── README.md         # This file
```

Everything is hand-rolled vanilla JS — no frameworks, no bundler, no build step. The only
external dependency is **Pyodide**, loaded from `cdn.jsdelivr.net` on demand.

## Customising the UI

Click the **gear icon** in the top-right to open the settings modal:

| Setting | Options | Effect |
|---|---|---|
| Theme | Dark · Midnight · Light | Background palette + syntax-highlight colours |
| Accent | Purple · Cyan · Emerald · Amber · Rose | Highlights, primary buttons, focus rings |
| Code text size | S · M · L | Editor, code blocks, test results, examples (S=11.5px, M=14px, L=17px) |
| Density | Comfortable · Compact | Padding/margins across cards, modal, tables, hero |
| Animations | On · Off | Disable for reduced motion (also auto-respects `prefers-reduced-motion`) |

Choices persist in `localStorage` under `odoo_prep_prefs_v1`. The **Reset to defaults**
button wipes them.

Your **question progress** (which questions you've solved) is stored separately in
`odoo_prep_progress_v1` and survives across sessions. Use the sidebar **Reset** button to
clear it.

## What the workbench does (and doesn't)

- ✅ Runs your code (Python OR JavaScript) against hidden test cases.
- ✅ Shows **only pass/fail and coverage %** by default — to see the input/expected/actual diff,
  click **Reveal diff** on a failing case.
- ✅ Handles linked-list and binary-tree problems: helper builders are injected into both
  runtimes so you can write functions that take `ListNode` / `TreeNode` objects directly.
- ✅ Counts a question as solved (and persists it) when every test passes — in either language.
- ✅ Runs SQL too: questions with an authored fixture execute against a real in-browser SQLite
  (sql.js) and diff your result set against the expected table. Fixture-less SQL questions fall
  back to schema + hint + reference query in the modal.

### Python vs JavaScript — which to pick

Each coding question has a **language toggle** at the top-right of its workbench. Switch any time;
your code per language is preserved on the toggle for that question.

|  | Python | JavaScript |
|---|---|---|
| Runtime | Pyodide (WebAssembly) | native `new Function()` |
| First run | 5–10 s while Pyodide loads | instant |
| Subsequent runs | fast | instant |
| Function names | `snake_case` | `camelCase` (idiomatic JS) |
| Infinite-loop safety | Pyodide may freeze the tab; refresh recovers | JS will freeze the tab; refresh recovers |
| Class-based questions (e.g. Q50 Trie) | Python `class Trie:` | JS `class Trie {}` |

If you're prepping for the actual Odoo first-step, **stick with Python** — that's what the
assessment uses. JavaScript is a bonus track for cross-language learning.

## Limitations / known quirks

- Pyodide's first load is large (~10 MB). If you're on a tight connection, expect the first run
  to take a while; subsequent runs are instant.
- Some HARD questions have generous time budgets (~25 minutes). Pyodide is ~3–5× slower than
  CPython for tight numeric loops; if a test seems slow but your algorithm is correct, that's
  usually why. The provided tests are sized to stay comfortable in browser-Python.
- The Final Exam **deliberately hides topic tags**. If you want to study by category, use the
  Practice Sets instead.
- Light theme uses adjusted syntax-highlight colours; if you find any code block hard to read
  under one of the themes, the **Code text size** setting can help.
- **JS infinite loops freeze the tab** (the JS runner uses `new Function()` for speed, which
  is synchronous and not cancellable). Refresh recovers — progress is in localStorage.
- The JS runner is fast but does **not** match Python's heap (`heapq`) or bisect — Q40 (Kth
  Largest) ships an `O(n log n)` sort version in JS instead of `O(n log k)` heap. The
  reference solution in the answer modal mentions this.

## Source content

| Source | Used for |
|---|---|
| `../../doc/KIMI-Odoo_Coderbyte_Masterclass_FULL.md` | Foundation of the 8 tutorial modules |
| `../../doc/Odoo_Coderbyte_Question_Bank.md` | Original 24 reported-style questions |
| `../../doc/Odoo_Coderbyte_Question_Bank_Extended.md` | Hard-tier additions + gap-filler topics |

Module text was rewritten where the source lacked depth (binary search template, sliding-window
"need vs have" template, DP vs greedy criteria, Union Find).

## Updating questions

To add or edit a question, open `questions.js`. Each entry has:

```js
QXX: {
  id: "QXX",
  title: "...",
  difficulty: "Easy" | "Medium" | "Hard" | ...,
  time: "10-12 min",
  tags: ["..."],
  type: "python" | "sql",
  statement: "<HTML>",
  examples: "Input: ...\nOutput: ...",
  hint: "...",
  functionName: "your_func",            // python only
  signature: "your_func(...) -> ...",
  starter: "def your_func(...):\n ...",
  solution: `...python source...`,
  tests: [                              // python only
    { args: [...], expected: ..., equality: "exact" | "set" | "sorted-list",
      prepare: "args = ...",  // optional Python before the call
      transform: "result = ...", // optional Python after the call
      skipCall: false }          // optional, for class-based Qs
  ],
  explanation: "Why this works..."
}
```

Then add the new id to either a Practice Set in `PRACTICE_SETS` or to `FINAL_EXAM_POOL` at the
bottom of `questions.js`. The progress UI updates automatically based on
`Object.keys(QUESTIONS).length`.

## License

Personal study material. The source guides in `../../doc/` retain their original authorship.
