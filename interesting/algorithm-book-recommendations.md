# Algorithm book recommendations for interview & contest prep

Honest disclaimer: there's no single "perfect" book — different ones excel at different things. But for the profile of someone who already understands the basics, wants to go deeper with intuition + working examples, and is aiming at both Coderbyte-style assessments and broader algorithmic competence, here's the realistic ranking.

## Top pick: *Competitive Programmer's Handbook* by Antti Laaksonen

**This is the book I'd actually hand you.** It's free as a PDF (https://cses.fi/book.html), about 300 pages, written by the maintainer of the CSES problem set, and it's *remarkably* well structured for self-study.

What makes it stand out:

- **Coverage matches your tutorial almost exactly** — Big-O, sorting, data structures, graph algorithms (BFS, DFS, shortest paths, topological sort, MST, Union-Find), dynamic programming, range queries (prefix sums, segment trees), strings, math, and more advanced topics for later (network flow, geometry, bit manipulation).
- **Concise but never hand-wavy.** Each algorithm gets a precise description, a pseudo-code template, a worked example, and a discussion of when it applies. None of the "trust me, this works" hand-waving you see in school textbooks.
- **Pseudo-code, not language-specific.** This is good for understanding — you'll translate to Python yourself, which is the real test of whether you understood. (If you'd rather have ready-to-run Python, see EPI below.)
- **Companion problem set (CSES)** is the best free competitive-programming ladder available. Read a chapter, solve the matching CSES problems, internalize.

If you read only one book, read this one.

## Strong runner-up for *practice*: *Elements of Programming Interviews in Python* (Aziz, Lee, Prakash)

Where the CP Handbook teaches *concepts*, EPI teaches *interview problem-solving* with rigorous problems and complete worked solutions in real Python. 300+ problems organized by topic — strings, arrays, hash tables, stacks/queues, BST, recursion, DP, greedy, graphs, parallel computing.

What's good:

- Every problem has a "thinking out loud" section before the solution. That's exactly the mental model you need to develop for the next-round technical interview where you must defend your code.
- Solutions are real Python with type hints, not pseudo-code.
- Difficulty escalates naturally within each chapter.

What's less good:

- It's a *problem* book, not a concept book. It assumes you already know what BFS *is* — it just shows you 8 problems where you'd apply it. So it complements the CP Handbook rather than replacing it.

Versions exist in Java and C++ too if that matters to you.

## When you want maximum depth: *The Algorithm Design Manual* by Steven Skiena

Famous for two reasons. First, the "war stories" — Skiena worked at NSA and tells real anecdotes about which algorithm was needed for which real-world problem, which dramatically helps with *recognition* (the skill you actually need). Second, the second half is a literal catalog: "here are 75 well-known problems; for each, here's which algorithm solves it, what its complexity is, and which libraries already implement it."

It's denser than the CP Handbook and somewhat broader (includes things like NP-completeness, approximation algorithms, computational geometry). Best as a *third* book once you have the basics down. About 750 pages — not a quick read.

## The famous ones to skip (or use cautiously)

- ***Cracking the Coding Interview* (Gayle Laakmann McDowell)** — popular but mostly a problem book without much algorithmic depth. Many of its problems and solutions are also dated. Worth flipping through if you have time, not worth buying first.

- ***Introduction to Algorithms* (CLRS)** — the famous "encyclopedia". Mathematically rigorous, comprehensive, but a slow read and overkill for interview prep. Save it for when you're studying algorithms for their own sake, not for a 60-minute test.

- ***Grokking Algorithms* (Aditya Bhargava)** — beautifully illustrated, very approachable, but doesn't go deep enough for the harder Coderbyte problems. Excellent as a *first* exposure if someone hasn't seen any algorithms before. You're past that.

- ***Algorithms* (Sedgewick & Wayne)** — solid Princeton textbook, paired with a free Coursera course. Java-centric. Excellent if you don't mind translating, but I'd reach for CP Handbook or EPI before this for your goal.

## Suggested reading order

1. **Now → before the assessment:** *Competitive Programmer's Handbook* (free PDF), focusing on chapters 1–10 (foundations through graph algorithms). About 2 weeks of evening reading.
2. **In parallel:** EPI's chapters that match each Handbook chapter — read the Handbook for the concept, solve 5–10 EPI problems on that topic for muscle memory. This is the rhythm that makes the material stick.
3. **After the assessment, if you want to go further:** Skiena's *Algorithm Design Manual*.

## A practical note about Coderbyte-specific prep

The custom tutorial + masterclass markdown in this repo is *more focused* than any of these books for the specific Odoo first-step. It's a curated subset. The books above are what you reach for **after** the Coderbyte, when the technical interview round is asking you to defend your code, propose alternatives, and discuss complexity trade-offs. That's where deeper book reading pays the highest dividend.

If you want one *single* book to buy on paper (something to hold while doing problems on paper): **EPI Python edition**. If you want one to read for understanding: **CP Handbook (free PDF)**.
