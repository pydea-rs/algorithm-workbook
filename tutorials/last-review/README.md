# Last Review

A focused, step-by-step consolidation app for the hours before the Odoo live technical interview.

## What it does

- Walks through the most important concepts, code patterns, SQL idioms, design principles, and hard questions from `tutorials/interview-final/` (plus selected notes from `quickref`, `roadmap`, per-problem folders, and the *Competitive Programmer’s Handbook*).
- Offers two lengths:
  - **1.5 h** — condensed; skips easy material and shows only the highest-yield questions.
  - **3 h** — full version with more explanations, edge cases, and a larger question recap list.
- Tracks progress with per-section checkboxes.
- Includes a session countdown timer so you pace yourself.
- Supports export/import of your progress and preferences.

## Files

```
tutorials/last-review/
├── index.html      # Shell
├── styles.css      # Theme and layout
├── content.js      # Review content for both 1.5 h and 3 h modes
├── highlighter.js  # Dependency-free syntax highlighter for code blocks
├── app.js          # Navigation, progress, timer, settings
└── README.md       # This file
```

## How to open

From the repo root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/tutorials/last-review/

## How to edit the content

All review text lives in `content.js`. Each section is an object with:

```js
{
  id: "unique-id",
  title: "Section title",
  minutes: 10,
  blocks: [
    { kind: "html", html: "<p>...</p>" },
    { kind: "code", lang: "py|sql|js", code: "..." },
    { kind: "callout", type: "warn|tip|good", title: "...", html: "..." },
    { kind: "check", id: "check-id", text: "..." },
    { kind: "question", label: "Question name", tags: ["tag"], insight: "..." }
  ]
}
```

The two globals `window.REVIEW_SHORT` and `window.REVIEW_LONG` contain the sections for each mode. The `buildContent(mode)` function uses `if (long)` to include extended blocks only in the 3 h version.

## Look and feel

This app uses its own exclusive "pre-interview cockpit" design — it does **not** follow the generic workbook look:

- Animated gradient-mesh background and glass-morphism panels.
- Circular progress ring and a circular session timer.
- Gradient accent system; default accent is **cyan**.
- Custom display font (`Space Grotesk`) and UI font (`Inter`) loaded from Google Fonts, with system fallbacks if offline.
- Staggered nav-item entrance, card hover lift, glowing active states, and floating background particles.
- Section progress mini-bars in the sidebar and a top scroll-progress line.
- Dependency-free syntax highlighting for Python, SQL and JavaScript code blocks.
- Choose **Reduced** motion in Settings to disable animations.

## LocalStorage keys

- `odoo_lastreview_prefs_v1` — mode, theme, accent, motion.
- `odoo_lastreview_progress_short_v1` — checked boxes for the 1.5 h mode.
- `odoo_lastreview_progress_long_v1` — checked boxes for the 3 h mode.
