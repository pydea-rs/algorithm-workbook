# Last Review [Claude] — "Final Approach"

A single, step-by-step consolidation pass over everything needed for the Odoo
final-stage interview. Distinct identity from the other workbooks: a blueprint /
cockpit theme, a vertical **descent-track spine** for navigation, a **readiness
ring** HUD, and per-stage **confidence checkpoints** that resurface weak spots on
the final "Cleared for Takeoff" screen.

## Two runs (settings or the header toggle · keys `1` / `2`)
- **1.5 h — Focused pass:** core content only; the vault trimmed to the top tier.
- **3 h — Full pass:** everything, including blocks/problems tagged `3h`.

## The track (18 stages)
Pre-flight → Interviewer's Eye → Complexity → Arrays/Windows → Hashing →
Recursion/Backtracking → Binary Search → Trees → Graphs → DP → Greedy/Intervals →
Heaps → Linked Lists/Math/Bits → **SQL Deep Dive** → **DB Design & Indexes** →
OOP → System Design → **Problem Vault** → Cleared for Takeoff.

## Sources
Consolidated from the Interview-Final course (modules M1–M15 + the F01–F90 bank),
the Syntax Quick-Ref (SQL), the Final-Week Roadmap (logistics + the 6-step
template), the solved-problem folders, and the Competitive Programmer's Handbook.

## Files
- `index.html` — shell (boot screen, spine, HUD, settings)
- `styles.css` — the blueprint/carbon/paper themes
- `app.js` — engine: spine nav, mode filter, confidence/readiness, syntax
  highlighter (Python/SQL/JS), timer, export/import
- `content.js` — all stage content (`window.REVIEW`)

Progress + confidence persist under the `odoo_clast_review_v1` localStorage key,
which the shared `sync.js` backs up to the PHP/SQLite server automatically.

*Note:* this is the Claude-authored version. The separate `../last-review/` app is
a different model's take and is intentionally left untouched.
