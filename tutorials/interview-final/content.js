/* ============================================================
   content.js — Final Stage tutorial (Odoo live interview prep).

   Same schema as tutorials/algorithms/content.js:
     window.MODULES = { Mxx: {id, title, subtitle, practiceSet?, body: [...]} }
     window.MODULE_ORDER = ["M1", "M2", ...]

   The `practiceSet` field is optional here — recap and skill chapters
   don't need practice sets, only algorithmic modules do.
============================================================ */

window.MODULES = {

  // =============================================================
  // MODULE 1 — Recap: the Stage-1 Algorithms tutorial in one sitting
  // =============================================================
  M1: {
    id: "M1",
    title: "Module 1 — Recap of Stage-1 Algorithms",
    subtitle: "Everything from the algorithms tutorial, compressed",
    // No practice set — this is a warm-up review.
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Welcome to Final-Stage Prep</h1>
  <p>You've cleared the Coderbyte round. This tutorial gets you ready for the 3-hour live
  technical interview: a senior engineer walks you through <strong>2 algorithm problems + 1 SQL
  or database-design task</strong>, medium-to-hard difficulty, in the language of your choice.
  We'll cover the concepts, drill harder problems, and rehearse the parts that Coderbyte doesn't
  test — talking out loud, defending trade-offs, and handling extension follow-ups.</p>
</div>

<h2>How this tutorial is organized</h2>
<p>Fifteen modules, roughly split three ways:</p>
<ul>
  <li><strong>Foundation reviews</strong> (M1–M2): This recap plus a chapter on live-coding craft.</li>
  <li><strong>Algorithmic deep dives</strong> (M3–M11): Arrays, hash maps, recursion, binary search,
    trees, graphs, DP, greedy, heaps — mostly medium-hard problems with Python + JavaScript sandboxes.</li>
  <li><strong>Data and design</strong> (M12–M15): SQL deep dive, database indexes, OOP fundamentals,
    system-design reveal-solution questions.</li>
</ul>
<p>Each algorithmic module ends with a Practice Set. Skip questions you find trivial; spend real
time on the ones that stretch you. There's a Final Exam at the end drawing from a held-back pool.</p>

<div class="callout tip">
  <div class="callout-title">Study method for this stage</div>
  Coderbyte grades correctness silently. A human interviewer grades <em>how you think</em>. When you
  attempt a question here, <strong>narrate out loud</strong> as you would in the real interview —
  even if you're alone. It's an endurance skill. Three hours of silent typing feels totally different
  from three hours of talking-while-typing.
</div>

<h2>What Stage 1 covered — the compressed version</h2>
<p>The algorithms tutorial went deep on eight modules. Here's what to keep sharp:</p>

<h3>Module 1 (Stage-1) — Foundations</h3>
<ul>
  <li><strong>Big-O</strong>: <code>O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ)</code>.
    Every solution you propose in the interview should be paired with a spoken complexity claim.</li>
  <li><strong>ADTs</strong>: know when to reach for a list (indexed access), set (membership), dict
    (keyed lookup), stack (LIFO), queue/deque (FIFO), heap (min/max in O(log n)).</li>
  <li><strong>R.A.P.I.D.</strong>: Read, Analyze examples, Pattern-match, Implement, Debug edge cases.
    This is the muscle memory that keeps you from freezing on a hard problem.</li>
</ul>

<h3>Module 2 (Stage-1) — Strings, Stacks, Parsing</h3>
<ul>
  <li>Strings are immutable; build with a list and <code>"".join(parts)</code>.</li>
  <li>Any sequence problem with "match", "balance", or "nested" almost always wants a <strong>stack</strong>.</li>
  <li>Monotonic stack pattern: "next greater element", "largest rectangle" — worth a re-read if hazy.</li>
</ul>

<h3>Module 3 (Stage-1) — SQL</h3>
<ul>
  <li>Aggregates + <code>GROUP BY</code> + <code>HAVING</code> — the workhorse triad.</li>
  <li><code>JOIN</code>s (INNER / LEFT / RIGHT / FULL OUTER / SELF): know each one and when to reach for it.</li>
  <li>Anti-join pattern: <code>LEFT JOIN … WHERE right.pk IS NULL</code>, or <code>NOT EXISTS</code>
    (NULL-safe). <strong>Never</strong> use <code>NOT IN</code> against a nullable column.</li>
  <li>Window functions: <code>ROW_NUMBER</code>, <code>RANK</code>, <code>DENSE_RANK</code>,
    <code>LAG</code>, <code>LEAD</code>. Every "second-highest / consecutive / running-total"
    problem lives here.</li>
</ul>

<h3>Module 4 (Stage-1) — Graphs & Search</h3>
<ul>
  <li>BFS with a <code>deque</code> for shortest-path-in-unweighted-graph. Level tracking is either
    a per-node distance or a size-of-queue trick.</li>
  <li>DFS iterative (stack) or recursive. Recursion is cleaner; iterative is safer under Python's
    1000-frame default limit.</li>
  <li>Grids are graphs. Standard directions tuple <code>((0,1),(0,-1),(1,0),(-1,0))</code> unlocks
    every grid problem.</li>
  <li>Union-Find with rank + path compression: <code>find()</code> and <code>union()</code>
    effectively O(α(n)) — treat as O(1).</li>
</ul>

<h3>Module 5 (Stage-1) — Arrays, Two-Pointers, Sliding Window</h3>
<ul>
  <li>Two pointers: sorted array + target, palindrome, remove-duplicates-in-place.</li>
  <li>Sliding window: fixed-size (running max/sum) vs. variable-size ("longest substring with…").
    The variable-window template is <em>expand right, shrink left while invariant broken</em>.</li>
  <li>Prefix sums: turn "range sum" into O(1) lookup after O(n) preprocessing.</li>
</ul>

<h3>Module 6 (Stage-1) — Math, Bit Ops, Binary Search</h3>
<ul>
  <li>Binary search skeleton: <code>lo, hi</code>, invariant, loop until <code>lo &lt;= hi</code>,
    move exactly one side. Get the boundaries right or you infinite-loop.</li>
  <li>Bit ops shortcuts: <code>x &amp; (x-1)</code> clears lowest set bit; XOR self-inverse property
    for "find the single element".</li>
</ul>

<h3>Module 7 (Stage-1) — Trees, Linked Lists, Heap, Trie</h3>
<ul>
  <li>Tree traversals: pre / in / post-order; level-order (BFS). Iterative versions use an
    explicit stack.</li>
  <li>Fast/slow pointer for cycle detection in linked lists (Floyd's algorithm).</li>
  <li>Heap: <code>heapq</code> is min-heap; for max-heap, push negatives. Top-K pattern uses a heap
    of size K.</li>
  <li>Trie: nested dict with a sentinel key (<code>&quot;$&quot;</code> or similar) for word ends.</li>
</ul>

<h3>Module 8 (Stage-1) — DP, Backtracking, Greedy</h3>
<ul>
  <li>DP: define state clearly, write recurrence, decide memoization (top-down) vs tabulation (bottom-up).</li>
  <li>Backtracking template: <em>choose → recurse → un-choose</em>. Prune early.</li>
  <li>Greedy vs DP: greedy works when local optimum is globally optimal (proof by exchange argument).
    Otherwise, DP.</li>
</ul>

<div class="callout warn">
  <div class="callout-title">If any bullet above felt unfamiliar</div>
  Go back to the algorithms tutorial and re-read that specific module before continuing here.
  This stage will build on top of these; there's no way to grow a comfortable ceiling on a shaky floor.
</div>

<h2>What Stage 3 adds that Stage 1 didn't test</h2>
<ul>
  <li><strong>Communication</strong>: state assumptions, propose approaches, discuss trade-offs,
    respond to hints without ego. Module 2 drills exactly this.</li>
  <li><strong>Follow-ups</strong>: "now imagine the input is 100× bigger", "now handle streaming",
    "now support online queries". Same problem, one twist at a time.</li>
  <li><strong>Deeper SQL</strong>: recursive CTEs, index-aware query design, schema tables you design
    yourself (not just query).</li>
  <li><strong>OOP fluency</strong>: SOLID, inheritance vs composition, common patterns. Talk-shop
    depth, not coding.</li>
  <li><strong>System design at schema level</strong>: "design the tables for an e-commerce checkout",
    "design a chat app data model". Not distributed-Twitter-level; Odoo cares about clean data models.</li>
</ul>

<div class="callout good">
  <div class="callout-title">Ready</div>
  Move on to Module 2 — the craft of live coding. Then dive into the algorithmic modules starting
  at M3. There's no urgency; you're not being timed. Depth beats speed here.
</div>
`
      },
    ],
  },

  // =============================================================
  // MODULE 2 — Live-Coding Craft
  // =============================================================
  M2: {
    id: "M2",
    title: "Module 2 — Live-Coding Craft",
    subtitle: "How to think, talk, and code at the same time",
    // No practice set — this is a soft-skill module. MCQs are inline.
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>The forgotten skill</h1>
  <p>Every candidate at this stage can solve LeetCode mediums. What separates the offers from the
  rejections is <strong>whether you can code and communicate at the same time</strong>. This is a
  learnable skill. It has a recipe. This chapter is the recipe.</p>
</div>

<h2>The four things the interviewer is measuring</h2>
<p>Underneath the friendly chat, they're scoring you on:</p>
<ol>
  <li><strong>Clarification quality</strong> — do you ask the right questions before coding?</li>
  <li><strong>Approach articulation</strong> — can you state a plan (with complexity) before touching the keyboard?</li>
  <li><strong>Coding hygiene</strong> — readable names, small functions, edge cases considered.</li>
  <li><strong>Trade-off fluency</strong> — after solving, can you discuss what would change if X or Y?</li>
</ol>
<p>Notice what's <em>not</em> on this list: raw speed, memorized tricks, one-liner cleverness. Slow
and clear beats fast and cryptic every time.</p>

<h2>The 6-step live-coding template</h2>
<p>Memorize this. Follow it for every problem in the interview, without exception. It looks like it
adds friction; it actually saves time because you avoid the "code first, realize you misread the
problem 20 minutes in" trap.</p>

<div class="callout tip">
  <div class="callout-title">The template</div>
  <ol style="margin: 6px 0 0 18px;">
    <li><strong>Repeat the problem back</strong> in your own words. (30s)</li>
    <li><strong>Ask 2–3 clarifying questions</strong> about inputs, constraints, edge cases. (1–2 min)</li>
    <li><strong>Walk through the given example by hand.</strong> Ideally invent one more small example yourself. (1–2 min)</li>
    <li><strong>State a brute-force approach with complexity</strong>, then optimize. (1–2 min)</li>
    <li><strong>Code the optimized version</strong>, narrating as you go. (bulk of the time)</li>
    <li><strong>Test on paper</strong> with a small case + one edge case before running. Discuss trade-offs after. (2–3 min)</li>
  </ol>
</div>

<h2>Step 1 — Repeating the problem back</h2>
<p>The interviewer will say something like: "Given a list of integers, return the two indices whose
values sum to a target." Even if you recognize it instantly as Two Sum, <strong>don't jump</strong>.
Repeat it back:</p>
<blockquote>"So I have an array of integers, a target integer, and I return the two indices — not the
values — of elements that sum to the target. Is that right?"</blockquote>
<p>This does three things: it proves you were listening, it catches misheard details, and it buys
you a few seconds of thinking time before the pressure starts.</p>

<h2>Step 2 — Clarifying questions (the biggest lever)</h2>
<p>Two or three sharp questions at the start signal seniority more than any code you'll write later.
Here's the checklist to mentally run through. Ask the ones that <em>actually matter</em> for the
problem in front of you — not all of them.</p>

<h3>Universal questions</h3>
<ul>
  <li>What's the size range of the input? (Affects O(n²) vs O(n log n).)</li>
  <li>Can the input be empty? Contain a single element?</li>
  <li>Are the values bounded? Negative? Zero? Duplicates allowed?</li>
  <li>If no solution exists, what should the function return — empty, <code>None</code>, exception?</li>
</ul>

<h3>String questions add</h3>
<ul>
  <li>ASCII only, or full Unicode?</li>
  <li>Case-sensitive?</li>
  <li>Trimming whitespace?</li>
</ul>

<h3>Tree / graph questions add</h3>
<ul>
  <li>Is it guaranteed connected? Acyclic? Directed?</li>
  <li>Are there duplicate values? Node references or values in output?</li>
  <li>Do we mutate the tree/graph or must it stay unchanged?</li>
</ul>

<h3>SQL questions add</h3>
<ul>
  <li>What columns are indexed?</li>
  <li>Is the target dialect specified (Postgres, MySQL, SQLite)? Postgres is Odoo's default.</li>
  <li>Should NULLs sort first or last?</li>
</ul>

<h2>Step 3 — Working the example by hand</h2>
<p>The interviewer gave you an example. Walk through it verbally with a pencil (or on the whiteboard
they can see):</p>
<blockquote>"OK, so given [2, 7, 11, 15] and target 9 — I'd want indices 0 and 1, because 2 + 7 = 9.
Let me try another: [3, 3] with target 6 → duplicates are OK, indices 0 and 1. And what if there's no
pair, like [1, 2] target 100? You said we can assume a solution exists, so I won't handle that
explicitly."</blockquote>
<p>You just proved you understand the problem AND surfaced an edge-case decision — silent thinking
never does that.</p>

<h2>Step 4 — Brute force first, always</h2>
<p>This is the counter-intuitive part. Even if you know the optimal solution, <strong>state the
brute force out loud</strong>:</p>
<blockquote>"Brute force: two nested loops, check every pair. O(n²) time, O(1) space. That works but
it's slow for large n. I can do better with a hash map: for each element, check if
<code>target - element</code> is already in the map — O(n) time, O(n) space, trading memory for
speed. Let's write the O(n) version."</blockquote>
<p>Why? Because the interviewer wants to see you <em>arrived at</em> the optimal solution, not that
you memorized it. Skipping brute force reads as "I've seen this before" — which they take as a
signal you can't derive things you haven't seen.</p>

<h2>Step 5 — Coding while narrating</h2>
<p>The trap: you get into the code and go silent for 8 minutes. From the interviewer's chair, that
looks like getting stuck. Even when you're not, they don't know.</p>
<p>Narrate at three levels of granularity:</p>
<ul>
  <li><strong>Section-level</strong>: "I'll set up the hash map first, then iterate."</li>
  <li><strong>Line-level</strong>: "For each index i and value v… I check if <code>target - v</code>
    is in the map…"</li>
  <li><strong>Decision-level</strong>: "I'm storing indices, not values, because that's what the
    problem wants me to return."</li>
</ul>
<p>You don't need all three every time. But if you go silent for more than ~20 seconds, drop a
narration line. "Let me think" is a valid line.</p>

<h2>Step 6 — Testing on paper before running</h2>
<p>After you finish the code, <strong>don't rush to hit run</strong>. Trace through your code with
one normal case and one edge case, out loud:</p>
<blockquote>"OK, let's trace [2, 7, 11, 15], target 9. i=0, v=2, complement=7, not in map yet, add
0→2. i=1, v=7, complement=2, we find 2 at index 0, return [0, 1]. Good. Edge case: empty array?
The loop doesn't execute, we fall off the end… I should handle that — let me add an early return
of an empty list."</blockquote>
<p>Then run. If tests pass, you look brilliant. If tests fail, you can say "let me look at that
trace again" and the interviewer knows you were being methodical, not sloppy.</p>

<h2>The vocabulary you must have ready</h2>
<p>Certain phrases need to come out of your mouth without hesitation. Practice these:</p>

<h3>Complexity talk</h3>
<ul>
  <li>"O(n) time, O(n) space."</li>
  <li>"This is amortized O(1) because [reason]."</li>
  <li>"The bottleneck is [operation]; if I switch to a heap it becomes O(log n)."</li>
</ul>

<h3>Approach talk</h3>
<ul>
  <li>"I'll use a hash map keyed by X to look up Y in O(1)."</li>
  <li>"Sliding window: I'll expand the right pointer while [invariant], and shrink the left when broken."</li>
  <li>"I want to think of this as a graph problem — nodes are X, edges are Y."</li>
  <li>"This has optimal substructure and overlapping subproblems, so DP is the fit."</li>
</ul>

<h3>Trade-off talk</h3>
<ul>
  <li>"I'm trading memory for speed."</li>
  <li>"This is more readable but slightly slower — I'd take the readability unless it's on a hot path."</li>
  <li>"For small n, the constant factor matters and the simpler algorithm wins."</li>
</ul>

<div class="callout warn">
  <div class="callout-title">The two silent killers</div>
  <p><strong>1. Panic-coding.</strong> The interviewer asks you a problem, you don't know it, you
  start typing something anyway. This <em>always</em> ends badly — every keystroke digs a deeper
  hole. Better move: pause, say "I want to think about this for a moment", stare at the problem for
  30 seconds without typing.</p>
  <p><strong>2. Silent-stucking.</strong> You're actually thinking productively, but you haven't
  said anything in 90 seconds. To the interviewer, this looks identical to being lost. Even a
  sentence like "I'm considering whether a hash map or a sort is cleaner here" preserves the
  signal.</p>
</div>

<h2>Handling hints</h2>
<p>Interviewers give hints when you're stuck. Two rules:</p>
<ol>
  <li><strong>Take them immediately.</strong> Don't pretend you would have got there. "Ah, that's a
    good angle — so if I do X, then Y follows." You lose nothing; refusing a hint costs you the whole
    problem.</li>
  <li><strong>Attribute the insight.</strong> "You mentioned X — that unlocks the sliding-window
    framing." Signals gracious collaboration.</li>
</ol>

<h2>Handling failure</h2>
<p>You will hit a moment where your approach doesn't work. When that happens:</p>
<ul>
  <li>Say it out loud. "Wait — this doesn't handle duplicates correctly."</li>
  <li>Diagnose out loud. "The problem is my hash map overwrites the earlier index."</li>
  <li>Propose a fix out loud. "I'll store a list of indices per value instead."</li>
</ul>
<p>Interviewers love this because it's <em>exactly</em> how real engineers debug. Silent panic-fixing
is what juniors do.</p>

<h2>Handling extensions ("now what if…")</h2>
<p>After you solve the problem, expect a follow-up. Common ones:</p>
<ul>
  <li>"Now imagine the input is 100× bigger." → Discuss O(n log n) vs O(n) more seriously,
    external sort, streaming.</li>
  <li>"Now imagine input arrives one element at a time." → Move to an online algorithm; heap,
    running median, etc.</li>
  <li>"Now what if we need to answer many queries on this data?" → Precompute a structure
    (prefix sums, segment tree, hash index).</li>
  <li>"How would you test this?" → Small case, edge case, large-random case, adversarial case.</li>
</ul>
<p>Don't code the extension unless asked; usually a spoken sketch is enough.</p>

<h2>The three-hour marathon: pacing</h2>
<p>Physical stamina matters more than you think. Three hours of talking-while-coding is exhausting.</p>
<ul>
  <li><strong>Water and a snack</strong> at your desk before you start. You will get thirsty.</li>
  <li><strong>Ask for a 5-minute break at the 90-minute mark.</strong> Every interviewer expects
    this. "Would it be OK if I stepped away for 5 minutes before we start the next problem?" —
    always yes.</li>
  <li><strong>Reset your posture</strong> between problems. Sit up, roll your shoulders, breathe.
    The second problem needs a fresh you, not the wilted version.</li>
  <li><strong>If you're stuck late in the interview</strong>, verbalize your thinking harder, not
    less. Fatigued silence is the death spiral.</li>
</ul>

<h2>Language choice: probably Python</h2>
<p>The HR email lets you pick. Recommendation: <strong>Python unless you're materially stronger
in another language.</strong> Reasons:</p>
<ul>
  <li>Batteries included: <code>heapq</code>, <code>collections</code>, <code>bisect</code>, list
    comprehensions cut lines of code.</li>
  <li>Readable — you can narrate line by line without translating.</li>
  <li>You've been prepping in Python; muscle memory matters when fatigued.</li>
  <li>Slight downside: Pyodide-style timeouts don't matter here (real CPython), and interpreter
    speed is fine for interview-scale n.</li>
</ul>
<p>JavaScript is fine too. C++ is fine if that's your daily driver. Don't switch to "impress" — a
comfortable language is worth 10× a fancy one when a stranger is watching.</p>

<h2>Setup checklist for interview day</h2>
<ul>
  <li>IDE open, syntax-highlighted, autocomplete on. Test it the day before.</li>
  <li>Screen-share tested with a friend. Don't debug audio/video in front of the interviewer.</li>
  <li>Second monitor OFF if you're worried about the interviewer seeing distractions. One monitor
    is usually cleaner.</li>
  <li>Water, snack, tissues within reach.</li>
  <li>Bathroom break beforehand.</li>
  <li>Notifications OFF (Slack, email, Discord). Do Not Disturb mode ON.</li>
  <li>A blank notepad (physical or digital) for scratch work.</li>
</ul>

<div class="callout good">
  <div class="callout-title">You're ready for the algorithmic depth</div>
  From here on, modules 3–11 drill the specific algorithm families with medium-hard problems.
  Modules 12–13 cover SQL and database design. Modules 14–15 are OOP and system design. Take them
  in order or jump around based on where you feel weakest.
</div>
`
      },
      {
        kind: "mcq",
        q: "The interviewer says: <em>'Given a list of integers and a target, return the two indices whose values sum to the target.'</em> You recognize this instantly as Two Sum. What do you do first?",
        options: [
          { label: "Start coding the O(n) hash-map solution — you don't want to look slow.", correct: false },
          { label: "Repeat the problem back in your own words and ask 2–3 clarifying questions.", correct: true },
          { label: "State the brute-force solution first, then optimize.", correct: false },
          { label: "Ask what language they want you to use.", correct: false },
        ],
        explain:
          "<p><strong>Repeat and clarify first.</strong> Even for a problem you recognize, restating it catches misheard details and buys you thinking time. Clarifying questions (duplicates allowed? empty input? multiple valid pairs?) signal seniority. The brute-force statement comes later, at step 4 of the template. Language was already agreed with HR.</p>",
      },
      {
        kind: "mcq",
        q: "You're halfway through coding a solution and realize your approach doesn't handle duplicates correctly. The interviewer is watching. What's the best move?",
        options: [
          { label: "Silently fix it and hope they don't notice — you don't want to look uncertain.", correct: false },
          { label: "Delete the code and start over with a cleaner approach.", correct: false },
          { label: "Say it out loud: 'Wait, this doesn't handle duplicates. The problem is X. I'll fix it by Y.'", correct: true },
          { label: "Ask the interviewer if duplicates are actually possible in the test cases.", correct: false },
        ],
        explain:
          "<p>Verbalize the bug, diagnose it out loud, propose the fix. This is exactly how senior engineers debug and interviewers score it as a strength, not a weakness. Silent-fixing looks like you were confused all along; deleting-and-restarting wastes minutes; asking whether duplicates matter reads as trying to weasel out of the case you should handle.</p>",
      },
      {
        kind: "mcq",
        q: "You've been coding silently for about 90 seconds while thinking through the recursive case of a tree problem. What should you say?",
        options: [
          { label: "Nothing — you're thinking productively, silence is fine.", correct: false },
          { label: "Announce a rough narration: 'I'm working through whether the recursion should return the node or the value.'", correct: true },
          { label: "Apologize: 'Sorry for the silence, I'm just thinking.'", correct: false },
          { label: "Ask the interviewer for a hint.", correct: false },
        ],
        explain:
          "<p>Even one sentence of narration keeps the interviewer inside your thought process. The <em>content</em> of the sentence doesn't need to be brilliant — it just needs to signal that you're actively working, not lost. Apologizing implies you did something wrong; asking for a hint prematurely wastes goodwill.</p>",
      },
      {
        kind: "html",
        html: `
<h2>Practice: mock a Two Sum walk-through</h2>
<p>Do this exercise before you leave this module:</p>
<ol>
  <li>Open a stopwatch. Give yourself 10 minutes.</li>
  <li>Speak (out loud, ideally record yourself) as if the interviewer just said: <em>"Given an
    array of integers and a target, return the two indices whose values sum to the target. Assume
    exactly one valid pair."</em></li>
  <li>Go through <strong>all 6 steps</strong> of the template. Actually pretend the interviewer
    is there.</li>
  <li>When you finish, listen back. Did you narrate? Did you state complexity? Did you handle at
    least one edge case?</li>
</ol>
<p>The first time doing this feels absurd. That's fine. By the third attempt it will feel natural,
and by interview day it will be automatic.</p>

<div class="callout tip">
  <div class="callout-title">You're set for the algorithmic modules</div>
  From here, every question card has a sandbox. Do the problems out loud. Every time.
</div>
`
      },
    ],
  },

  // =============================================================
  // MODULE 3 — Arrays, Two-Pointers & Sliding Window (Advanced)
  // =============================================================
  M3: {
    id: "M3",
    title: "Module 3 — Arrays & Windows, Advanced",
    subtitle: "Variable windows, prefix-sum tricks, monotonic deques",
    practiceSet: "PS3",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 3 — Arrays & Windows, Advanced</h1>
  <p>Stage 1 taught you the fixed-size window and basic two-pointer moves. The live interview
  goes one level up: <strong>variable-size windows with invariants</strong>, <strong>prefix sums
  combined with hash maps</strong>, and <strong>monotonic deques</strong>. These three patterns
  cover the majority of "hard array" questions that interviewers love, because each one has an
  obvious O(n²) brute force and a beautiful O(n) insight.</p>
</div>

<h2>1. The variable-size window, formalized</h2>
<p>A sliding window is just two pointers <code>left</code> and <code>right</code> that both only
move forward. What makes it powerful is the <strong>invariant</strong>: a property you promise is
always true about the window <code>s[left..right]</code>.</p>

<p>The universal template:</p>
<pre><code>def window_template(s):
    left = 0
    best = 0
    state = {}                     # whatever describes the window
    for right in range(len(s)):
        add(s[right], state)       # 1. extend right
        while broken(state):       # 2. shrink until invariant holds
            remove(s[left], state)
            left += 1
        best = max(best, right - left + 1)   # 3. window is valid here
    return best</code></pre>

<p>Everything is in choosing <code>state</code> and <code>broken()</code>:</p>
<table class="tbl">
  <tr><th>Problem</th><th>state</th><th>broken(state)</th></tr>
  <tr><td>Longest substring without repeats</td><td>set of chars in window</td><td>duplicate just entered</td></tr>
  <tr><td>Longest substring with ≤ k distinct</td><td>char → count map</td><td>len(map) &gt; k</td></tr>
  <tr><td>Minimum window containing all of T</td><td>need/have counts</td><td>(inverted: shrink while <em>valid</em>)</td></tr>
  <tr><td>Max sum subarray of length ≤ k</td><td>running sum</td><td>window longer than k</td></tr>
</table>

<div class="callout tip">
  <div class="callout-title">Why it's O(n) and how to say it out loud</div>
  "Both pointers only move forward, each at most n steps, so the total work is O(n) even though
  there's a nested while loop." Interviewers ask about that inner loop <em>every time</em> —
  have this sentence ready. The formal name is <em>amortized analysis</em>.
</div>

<h2>2. When windows fail: negative numbers → prefix sums + hash map</h2>
<p>Sliding windows need <strong>monotonicity</strong>: extending the window must move the metric in
one predictable direction. With all-positive numbers, a longer window means a bigger sum — great.
Add negative numbers and that breaks: growing the window can shrink the sum. The window pattern
dies instantly.</p>

<p>The rescue is the <strong>prefix-sum + hash-map</strong> pattern. Define
<code>P[i] = nums[0] + … + nums[i-1]</code> (with <code>P[0] = 0</code>). Then:</p>
<pre><code>sum(nums[i..j]) == P[j+1] - P[i]</code></pre>
<p>"Count subarrays summing to k" becomes: for each prefix <code>P[j+1]</code>, how many earlier
prefixes equal <code>P[j+1] - k</code>? A hash map of prefix-value → count answers that in O(1):</p>

<pre><code>def subarray_sum(nums, k):
    seen = {0: 1}          # empty prefix
    total = run = 0
    for x in nums:
        run += x
        total += seen.get(run - k, 0)
        seen[run] = seen.get(run, 0) + 1
    return total</code></pre>

<div class="callout warn">
  <div class="callout-title">The interviewer's favorite escalation</div>
  They start with "longest subarray with sum k, all positives" (window works), then add
  "now numbers can be negative" (window dies, prefix map needed). Recognizing <em>why</em> the
  window dies is the point of the question. Say the word "monotonicity."
</div>

<h2>3. Monotonic deque — sliding window maximum</h2>
<p>"Return the max of every window of size k." Brute force is O(nk). The O(n) trick is a
<strong>deque of indices whose values are strictly decreasing</strong>:</p>
<ul>
  <li>Before pushing index <code>i</code>, pop from the back every index whose value ≤
    <code>nums[i]</code> — they can never be a maximum again ("dominated").</li>
  <li>Pop from the front when the front index slides out of the window.</li>
  <li>The front is always the current window's max.</li>
</ul>
<pre><code>from collections import deque
def max_sliding_window(nums, k):
    dq, out = deque(), []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()
        dq.append(i)
        if dq[0] == i - k:
            dq.popleft()
        if i >= k - 1:
            out.append(nums[dq[0]])
    return out</code></pre>
<p>Each index enters the deque once and leaves at most once → O(n) total. The same "pop dominated
elements" idea powers <em>next greater element</em>, <em>daily temperatures</em>, and
<em>largest rectangle in histogram</em> — it's one pattern wearing four costumes.</p>

<h2>4. Two-pointer geometry — opposite ends</h2>
<p>Different from windows: pointers start at <em>both ends</em> and walk toward each other,
discarding half the search space each step. The classic is Container With Most Water: the shorter
wall limits the area, so moving the <em>taller</em> pointer can never help — always advance the
shorter one. That "prove a move can't help" argument is exactly what the interviewer wants to hear.</p>

<h2>5. In-place products and space games</h2>
<p>"Product of array except self, no division, O(1) extra space" tests whether you can reuse the
<em>output array</em> as scratch space: fill it with prefix products left-to-right, then sweep
right-to-left multiplying by a running suffix product. Two passes, one variable. Questions like
this exist purely to check that you notice the output array doesn't count against space.</p>
`
      },
      {
        kind: "mcq",
        q: "You're solving <em>'longest subarray with sum ≤ k'</em> with a sliding window and it works. The interviewer says: <em>'now the array can contain negative numbers.'</em> Why does the window break?",
        options: [
          { label: "It doesn't break — you just need to also track the minimum.", correct: false },
          { label: "Extending the window no longer monotonically increases the sum, so shrinking-on-violation can skip valid answers.", correct: true },
          { label: "Negative numbers overflow Python integers.", correct: false },
          { label: "The window becomes O(n²) but still correct.", correct: false },
        ],
        explain:
          "<p>The window's shrink logic assumes 'window too big → shrink left makes it smaller.' With negatives, a longer window can have a <em>smaller</em> sum, so the moment you shrink you may throw away a subarray that would have become valid again. The fix is prefix sums + hash map, which makes no monotonicity assumption.</p>",
      },
      {
        kind: "mcq",
        q: "In the monotonic-deque solution to Sliding Window Maximum, why is the total time O(n) despite the nested while loop?",
        options: [
          { label: "The while loop runs at most k times, and k is a constant.", correct: false },
          { label: "Each element is pushed once and popped at most once over the entire run, so all loop iterations together are bounded by n.", correct: true },
          { label: "Python's deque has O(1) random access.", correct: false },
          { label: "It isn't — it's O(nk) worst case, but fast in practice.", correct: false },
        ],
        explain:
          "<p>Amortized analysis: charge each pop to the element being popped. An element can be popped at most once, so across the whole array the inner loop does at most n pops total. The same argument applies to every monotonic stack/deque problem — say it proactively in the interview.</p>",
      },
    ],
  },

  // =============================================================
  // MODULE 4 — Hash Maps, Sets & Counting
  // =============================================================
  M4: {
    id: "M4",
    title: "Module 4 — Hash Maps, Sets & Counting",
    subtitle: "Canonical keys, O(n) scans, frequency games",
    practiceSet: "PS4",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 4 — Hash Maps, Sets & Counting</h1>
  <p>The hash map is the single most-used tool in live interviews. But the interesting questions
  aren't "use a dict" — they're about <strong>what to use as the key</strong>. This module is
  really about key design.</p>
</div>

<h2>1. The canonical-key pattern</h2>
<p>"Group these items by X" is a dict-of-lists where the key is a <strong>canonical form</strong> —
a representative that is identical for all items in the same group and different across groups.</p>
<p>Group Anagrams is the archetype. Two candidate canonical keys for a word:</p>
<ul>
  <li><code>"".join(sorted(word))</code> — O(L log L) per word. Simple, correct.</li>
  <li>A 26-slot letter-count tuple — O(L) per word. Faster in theory, more code.</li>
</ul>
<pre><code>from collections import defaultdict
def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        groups["".join(sorted(w))].append(w)
    return list(groups.values())</code></pre>
<div class="callout tip">
  <div class="callout-title">Say the trade-off, then pick</div>
  "Sorted string is O(L log L) per word, count-tuple is O(L). For interview-scale inputs the sorted
  key is cleaner, so I'll use it — but if L were huge I'd switch." That sentence is worth more than
  silently writing the fancier version.
</div>
<p>Key rules in Python: dict keys must be hashable → immutable. Use <code>tuple</code>, not
<code>list</code>; <code>frozenset</code>, not <code>set</code>.</p>

<h2>2. Sets turn O(n²) scans into O(n)</h2>
<p>Longest Consecutive Sequence: "given unsorted nums, length of longest run of consecutive
integers, O(n) required." Sorting is O(n log n) — explicitly banned. The set insight:</p>
<ul>
  <li>Put everything in a set.</li>
  <li>A number <code>x</code> is a <strong>sequence start</strong> iff <code>x-1</code> is not in
    the set.</li>
  <li>Only from starts, walk forward counting <code>x+1, x+2, …</code></li>
</ul>
<pre><code>def longest_consecutive(nums):
    s = set(nums)
    best = 0
    for x in s:
        if x - 1 in s:          # not a start — skip
            continue
        y = x
        while y + 1 in s:
            y += 1
        best = max(best, y - x + 1)
    return best</code></pre>
<p>Why O(n)? Every element is visited by the inner while at most once across the whole run —
the "only start from sequence heads" guard is what kills the quadratic behavior. This exact
"prove the nested loop is amortized O(n)" conversation is why interviewers pick this problem.</p>

<h2>3. Frequency games</h2>
<p><code>collections.Counter</code> is your workhorse:</p>
<pre><code>from collections import Counter
c = Counter("abracadabra")
c.most_common(2)        # [('a', 5), ('b', 2)]</code></pre>
<p>For Top-K Frequent Elements, know the ladder of solutions and their costs:</p>
<table class="tbl">
  <tr><th>Approach</th><th>Time</th><th>When to mention</th></tr>
  <tr><td>Sort by count</td><td>O(n log n)</td><td>the baseline</td></tr>
  <tr><td>Heap of size k</td><td>O(n log k)</td><td>the expected answer</td></tr>
  <tr><td>Bucket sort by count</td><td>O(n)</td><td>the flourish — counts are bounded by n</td></tr>
</table>
<p>Bucket sort deserves 30 seconds of explanation: make <code>buckets[i]</code> = list of values
appearing exactly <code>i</code> times. A value can appear at most n times, so there are n+1
buckets. Walk from the highest bucket down, collecting until you have k.</p>

<h2>4. The array-as-hash-map trick</h2>
<p>First Missing Positive: "smallest positive integer not in the array, O(n) time, O(1) space."
The answer is always in <code>1..n+1</code> for an array of length n — so the array itself can be
the hash map: try to put value <code>v</code> at index <code>v-1</code> (cyclic swaps), then scan
for the first index where <code>nums[i] != i+1</code>.</p>
<pre><code>def first_missing_positive(nums):
    n = len(nums)
    for i in range(n):
        # keep swapping until slot i holds something unplaceable
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            j = nums[i] - 1
            nums[i], nums[j] = nums[j], nums[i]
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1</code></pre>
<div class="callout warn">
  <div class="callout-title">The swap-loop bug everyone writes</div>
  Writing <code>nums[i], nums[nums[i]-1] = nums[nums[i]-1], nums[i]</code> is broken: Python
  evaluates the right side first, then assigns <em>left-to-right</em> — after <code>nums[i]</code>
  is updated, <code>nums[nums[i]-1]</code> uses the <em>new</em> value as the index. Compute
  <code>j = nums[i] - 1</code> first. If you mention this trap unprompted, that's a strong signal.
</div>

<h2>5. When a hash map is the wrong tool</h2>
<p>Have this list ready for "why not a dict?" follow-ups:</p>
<ul>
  <li><strong>Need ordering / range queries</strong> ("all keys between a and b") → sorted array +
    bisect, or a tree structure.</li>
  <li><strong>Need the min/max repeatedly with updates</strong> → heap.</li>
  <li><strong>Keys are dense small integers</strong> → plain array indexing beats hashing.</li>
  <li><strong>Adversarial inputs</strong> → worst-case O(n) per lookup; rarely matters, worth one
    sentence if asked "what's the worst case of a hash map?"</li>
</ul>
`
      },
      {
        kind: "mcq",
        q: "In Longest Consecutive Sequence, the inner <code>while y + 1 in s</code> loop looks quadratic. What single line makes the whole algorithm O(n)?",
        options: [
          { label: "<code>s = set(nums)</code> — set lookups are O(1).", correct: false },
          { label: "<code>if x - 1 in s: continue</code> — only sequence starts begin a walk, so each element is walked over at most once in total.", correct: true },
          { label: "<code>best = max(best, y - x + 1)</code> — max is O(1).", correct: false },
          { label: "Nothing — it's O(n log n) but the sort is hidden.", correct: false },
        ],
        explain:
          "<p>O(1) lookups are necessary but not sufficient — without the start-guard, an array like [1,2,3,…,n] would walk the full run from every element, giving O(n²) lookups. The guard ensures each run is walked exactly once, from its head. Total inner-loop work across all iterations ≤ n.</p>",
      },
      {
        kind: "mcq",
        q: "You need to group tuples of coordinates by 'same set of points, any order'. Which dict key works?",
        options: [
          { label: "<code>set(points)</code>", correct: false },
          { label: "<code>list(sorted(points))</code>", correct: false },
          { label: "<code>frozenset(points)</code> or <code>tuple(sorted(points))</code>", correct: true },
          { label: "<code>str(points)</code>", correct: false },
        ],
        explain:
          "<p>Dict keys must be hashable, which means immutable: <code>set</code> and <code>list</code> both raise <code>TypeError</code>. <code>frozenset</code> is the immutable set; <code>tuple(sorted(...))</code> is the canonical-order tuple. <code>str(points)</code> 'works' but is fragile — it depends on the repr order of the input, which is exactly the thing you're trying to normalize away.</p>",
      },
    ],
  },

  // =============================================================
  // MODULE 5 — Recursion & Backtracking Deep Dive
  // =============================================================
  M5: {
    id: "M5",
    title: "Module 5 — Recursion & Backtracking",
    subtitle: "The choose/explore/unchoose discipline, pruning, grid walks",
    practiceSet: "PS5",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 5 — Recursion & Backtracking</h1>
  <p>Backtracking questions are live-interview favorites because they expose whether you have a
  <em>system</em> or you're improvising. With the template below, permutations, combinations,
  subsets, word search, and N-Queens are all the same twelve lines with different fillings.</p>
</div>

<h2>1. Recursion: the trust contract</h2>
<p>The only mental model that scales: <strong>assume the recursive call already works</strong>, and
ask two questions — (1) what's the smallest input I can answer directly (base case), and (2) how do
I combine the answer for a smaller input into the answer for mine? Tracing the whole call tree in
your head is how people get lost mid-interview. Don't trace; trust, then verify with one tiny example.</p>
<div class="callout warn">
  <div class="callout-title">Python-specific: the recursion limit</div>
  Default limit is ~1000 frames. A recursion over a 10⁵-element list will crash with
  <code>RecursionError</code>. Mentioning "for deep inputs I'd convert this to an explicit stack
  or raise the limit" is a cheap, high-value sentence.
</div>

<h2>2. The backtracking template</h2>
<pre><code>def backtrack(path, choices):
    if is_complete(path):
        results.append(path.copy())      # snapshot!
        return
    for c in available(choices):
        path.append(c)          # 1. choose
        backtrack(path, ...)    # 2. explore
        path.pop()              # 3. un-choose</code></pre>
<p>Three details carry all the correctness:</p>
<ul>
  <li><strong>Snapshot on record.</strong> <code>results.append(path)</code> without
    <code>.copy()</code> stores a live reference that the pops will empty out. The all-time #1
    backtracking bug.</li>
  <li><strong>Un-choose must mirror choose exactly.</strong> Every mutation before the recursive
    call is undone after it — append/pop, mark/unmark, add/subtract.</li>
  <li><strong>The three shapes differ only in <code>available()</code>:</strong></li>
</ul>
<table class="tbl">
  <tr><th>Shape</th><th>available()</th><th>Count for n items</th></tr>
  <tr><td>Permutations</td><td>everything not already used</td><td>n!</td></tr>
  <tr><td>Subsets</td><td>only items <em>after</em> the last chosen (start index)</td><td>2ⁿ</td></tr>
  <tr><td>Combinations of size k</td><td>start index, stop at depth k</td><td>C(n,k)</td></tr>
</table>
<p>The <strong>start-index</strong> idea is what prevents duplicate subsets: by only ever moving
forward, [1,2] can be generated but [2,1] cannot.</p>

<h2>3. Pruning — where the marks are earned</h2>
<p>An unpruned exponential search times out; interviewers plant that on purpose. The two standard
prunes:</p>
<ul>
  <li><strong>Feasibility</strong>: in Combination Sum, if <code>remaining - candidate &lt; 0</code>,
    skip. If candidates are sorted, <code>break</code> instead of <code>continue</code> — everything
    after is bigger too.</li>
  <li><strong>Symmetry/duplicates</strong>: after sorting, skip a candidate equal to its left
    neighbor at the same tree depth (<code>if i &gt; start and c[i] == c[i-1]: continue</code>) —
    kills duplicate combinations without a results-set.</li>
</ul>

<h2>4. Grid backtracking — Word Search</h2>
<p>DFS from every cell, matching the word one letter at a time. The trick worth saying out loud:
<strong>mark visited cells in-place</strong> (overwrite with <code>"#"</code>), restore on
backtrack — O(1) space instead of a visited-set per path:</p>
<pre><code>def exist(board, word):
    R, C = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word): return True
        if not (0 <= r < R and 0 <= c < C) or board[r][c] != word[i]:
            return False
        board[r][c] = "#"                      # choose
        found = (dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or
                 dfs(r,c+1,i+1) or dfs(r,c-1,i+1))
        board[r][c] = word[i]                  # un-choose
        return found
    return any(dfs(r, c, 0) for r in range(R) for c in range(C))</code></pre>
<p>Note the shape is <em>identical</em> to the template: mutate, recurse, restore.</p>

<h2>5. Constraint propagation — N-Queens in three sets</h2>
<p>Place one queen per row; the only question per row is the column. A placement at
<code>(r, c)</code> is attacked iff <code>c</code>, <code>r+c</code> (anti-diagonal), or
<code>r-c</code> (diagonal) is already taken. Three sets make the check O(1):</p>
<pre><code>def total_n_queens(n):
    cols, diag, anti = set(), set(), set()
    def place(r):
        if r == n: return 1
        count = 0
        for c in range(n):
            if c in cols or (r - c) in diag or (r + c) in anti:
                continue
            cols.add(c); diag.add(r - c); anti.add(r + c)
            count += place(r + 1)
            cols.discard(c); diag.discard(r - c); anti.discard(r + c)
        return count
    return place(0)</code></pre>
<p>If asked "how would you speed this up further" — bitmasks for the three sets, and mirror
symmetry (only try half the first row, double the count).</p>

<h2>6. When backtracking is the wrong answer</h2>
<p>If subproblems <strong>repeat</strong>, enumeration wastes exponential work re-solving them —
that's the handoff to memoization/DP (Module 9). Quick test to say in the interview: "do I need
<em>all solutions</em> (backtracking) or just a <em>count/best value</em> (probably DP)?"
Word Break, Climb Stairs, Coin Change all sound like backtracking but are DP for exactly this
reason.</p>
`
      },
      {
        kind: "mcq",
        q: "Your permutations function returns <code>[[], [], [], [], [], []]</code> — six empty lists. What's the bug?",
        options: [
          { label: "The base case fires too early.", correct: false },
          { label: "<code>results.append(path)</code> stored a live reference; the pops on the way back up emptied it. Needs <code>path.copy()</code>.", correct: true },
          { label: "The un-choose step is missing, so the path never resets.", correct: false },
          { label: "The loop should iterate over <code>range(len(nums))</code> instead of <code>nums</code>.", correct: false },
        ],
        explain:
          "<p>Six empty lists = the right <em>number</em> of solutions (3! = 6) but every recorded result is the same object — the shared <code>path</code> list, which is empty again once the recursion fully unwinds. Snapshot with <code>path.copy()</code> (or <code>path[:]</code>, or <code>list(path)</code>) at the moment of recording. This bug is so common that recognizing it from the symptom alone is an interview flex.</p>",
      },
      {
        kind: "mcq",
        q: "In Combination Sum with sorted candidates, why is <code>break</code> better than <code>continue</code> when <code>remaining - c &lt; 0</code>?",
        options: [
          { label: "It isn't — they're equivalent here.", correct: false },
          { label: "Candidates are sorted, so every later candidate is also too big; break skips them all at once.", correct: true },
          { label: "break avoids a RecursionError.", correct: false },
          { label: "continue would skip valid smaller candidates.", correct: false },
        ],
        explain:
          "<p>Both are <em>correct</em>, but <code>continue</code> still tests every remaining candidate at this depth, while <code>break</code> abandons the whole rest of the row in one step. On wide candidate lists this prunes a large constant factor. The prerequisite — 'because the list is sorted' — is the part to say out loud.</p>",
      },
    ],
  },

  // =============================================================
  // MODULE 6 — Binary Search Mastery
  // =============================================================
  M6: {
    id: "M6",
    title: "Module 6 — Binary Search Mastery",
    subtitle: "Invariants, boundary variants, search-on-answer",
    practiceSet: "PS6",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 6 — Binary Search Mastery</h1>
  <p>Binary search is the most-failed "easy" topic in live interviews — not because the idea is
  hard, but because one off-by-one under pressure produces an infinite loop with a stranger
  watching. The cure is having <strong>one template you trust completely</strong>, plus knowing
  the three disguises the technique wears: sorted arrays, rotated arrays, and answer spaces.</p>
</div>

<h2>1. One template, memorized cold</h2>
<pre><code>def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1          # inclusive bounds
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1               # mid is ruled out
        else:
            hi = mid - 1               # mid is ruled out
    return -1</code></pre>
<p>The invariant: <em>the answer, if it exists, is always inside <code>[lo, hi]</code></em>.
Both updates exclude <code>mid</code> because <code>mid</code> was just examined — that's what
guarantees progress and kills infinite loops. If you ever write <code>lo = mid</code> or
<code>hi = mid</code> in this template, you have a bug.</p>
<div class="callout tip">
  <div class="callout-title">Java/C++ trivia, worth one sentence</div>
  <code>(lo + hi) / 2</code> can overflow 32-bit ints in those languages; the fix is
  <code>lo + (hi - lo) / 2</code>. Python integers don't overflow — say so if asked, it shows
  cross-language awareness.
</div>

<h2>2. Leftmost / rightmost — the bisect semantics</h2>
<p>"Find the <em>first</em> and <em>last</em> occurrence of target" is the classic boundary
variant. Python's <code>bisect</code> module defines the two clean primitives:</p>
<ul>
  <li><code>bisect_left(a, x)</code> — first index where <code>x</code> could be inserted keeping
    order = index of the <strong>first element ≥ x</strong>.</li>
  <li><code>bisect_right(a, x)</code> — insertion point after existing entries = index of the
    <strong>first element &gt; x</strong>.</li>
</ul>
<p>So the occurrences of x live in <code>[bisect_left, bisect_right)</code>, and
<code>bisect_right - bisect_left</code> is the count. Hand-rolling <code>bisect_left</code>:</p>
<pre><code>def bisect_left(a, x):
    lo, hi = 0, len(a)          # note: hi = n, half-open
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < x:
            lo = mid + 1
        else:
            hi = mid            # mid might BE the answer — keep it
    return lo</code></pre>
<p>Two templates, two shapes: <strong>exact match</strong> uses inclusive <code>hi</code>,
<code>lo &lt;= hi</code>, and both sides exclude mid. <strong>Boundary search</strong> uses
half-open <code>hi</code>, <code>lo &lt; hi</code>, and only one side excludes mid. Mixing the
two shapes is where the infinite loops come from — pick by asking "am I looking for one item, or
for a boundary between two zones?"</p>

<h2>3. Rotated sorted arrays</h2>
<p>A rotated sorted array (<code>[4,5,6,7,0,1,2]</code>) isn't sorted — but <strong>one half
always is</strong>. Compare <code>nums[mid]</code> with <code>nums[lo]</code> to find which:</p>
<pre><code>if nums[lo] <= nums[mid]:        # left half sorted
    if nums[lo] <= target < nums[mid]: hi = mid - 1
    else:                              lo = mid + 1
else:                            # right half sorted
    if nums[mid] < target <= nums[hi]: lo = mid + 1
    else:                              hi = mid - 1</code></pre>
<p>The reasoning to narrate: "I can't binary-search an unsorted range, but I can always identify
the sorted half in O(1), check whether the target lies inside it, and recurse into the correct
side." That sentence is the whole solution.</p>

<h2>4. Binary search on the ANSWER — the big one</h2>
<p>The most valuable variant for hard interviews. Recognize it by this shape: <em>"find the
minimum X such that condition(X) holds"</em>, where condition is <strong>monotone</strong> —
once true, it stays true for all larger X.</p>
<p>Koko's bananas: eating speed k works ⇒ any faster speed also works. So the answer space
<code>[1, max(piles)]</code> splits into a false-zone then a true-zone, and you binary-search
the boundary:</p>
<pre><code>def min_eating_speed(piles, h):
    def can(k):                    # monotone: True stays True as k grows
        return sum((p + k - 1) // k for p in piles) <= h
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if can(mid):
            hi = mid               # mid works — maybe something smaller does too
        else:
            lo = mid + 1
    return lo</code></pre>
<p>Say the two-step recipe out loud: "1) the check function, 2) prove it's monotone, then it's a
standard boundary search over the answer space." Problems in this family: ship packages in D days,
split array largest sum, minimum days to make bouquets, aggressive cows.</p>

<h2>5. Peaks — search without sortedness</h2>
<p>Find Peak Element proves binary search doesn't need a sorted array — it needs a
<strong>decision rule that discards half</strong>. If <code>nums[mid] &lt; nums[mid+1]</code>,
the slope rises to the right, so a peak must exist on the right (walk uphill until you can't).
Move that way; converge in O(log n).</p>

<h2>6. The boss fight: median of two sorted arrays</h2>
<p>O(log(min(m,n))) via <em>partition search</em>: choose a cut in the shorter array (binary
search over cut positions), derive the matching cut in the longer one so the left side holds
half the elements, and check the cross conditions
<code>maxLeftA &lt;= minRightB</code> and <code>maxLeftB &lt;= minRightA</code>. If the check
fails, move the cut toward the side that violated. Sentinels <code>±inf</code> handle the edges.
Even a spoken sketch of this earns serious points — few candidates produce it cold.</p>
`
      },
      {
        kind: "mcq",
        q: "In the boundary-search template (<code>lo &lt; hi</code>, half-open), why is <code>hi = mid</code> — keeping mid — safe from infinite loops, when it would loop forever in the exact-match template?",
        options: [
          { label: "Because the half-open range makes mid always strictly less than hi, so hi shrinks every time it's assigned.", correct: true },
          { label: "It isn't safe — you always need hi = mid - 1.", correct: false },
          { label: "Because lo < hi exits one iteration earlier than lo <= hi.", correct: false },
          { label: "Because bisect_left only works on arrays without duplicates.", correct: false },
        ],
        explain:
          "<p>With <code>lo &lt; hi</code> and <code>mid = (lo + hi) // 2</code>, mid is always &lt; hi (floor division pulls it down), so <code>hi = mid</code> strictly shrinks the range. And <code>lo = mid + 1</code> always grows lo. Every branch makes progress → termination guaranteed. In the inclusive template, <code>hi = mid</code> could leave the range unchanged when the range has one element. This is exactly the mixing-of-shapes bug from the module text.</p>",
      },
      {
        kind: "mcq",
        q: "Which of these problems is NOT solvable by binary-search-on-answer?",
        options: [
          { label: "Minimum eating speed to finish bananas in h hours.", correct: false },
          { label: "Minimum ship capacity to deliver packages within D days.", correct: false },
          { label: "Count of subarrays whose sum equals exactly k, with negatives allowed.", correct: true },
          { label: "Smallest divisor so the sum of ceilings stays under a threshold.", correct: false },
        ],
        explain:
          "<p>Search-on-answer needs a <em>monotone predicate</em>: once the condition holds for X it must hold for all larger X. Speed, capacity, divisor — all monotone. 'Sum equals exactly k with negatives' has no monotone structure at all (that's the prefix-sum + hash-map problem from Module 3). Checking for monotonicity <em>before</em> reaching for the technique is the discipline being tested.</p>",
      },
    ],
  },

  // =============================================================
  // MODULE 7 — Trees Deep Dive
  // =============================================================
  M7: {
    id: "M7",
    title: "Module 7 — Trees Deep Dive",
    subtitle: "Top-down vs bottom-up recursion, BST logic, serialization",
    practiceSet: "PS7",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 7 — Trees Deep Dive</h1>
  <p>Nearly every tree question is one recursion pattern wearing a costume. This module gives you
  the two patterns — <strong>top-down</strong> (pass constraints down) and <strong>bottom-up</strong>
  (return summaries up) — and drills the five questions interviewers actually ask.</p>
</div>

<h2>1. Two directions of information flow</h2>
<table class="tbl">
  <tr><th></th><th>Top-down</th><th>Bottom-up</th></tr>
  <tr><td>Information flows</td><td>root → leaves via parameters</td><td>leaves → root via return values</td></tr>
  <tr><td>Feels like</td><td>preorder</td><td>postorder</td></tr>
  <tr><td>Typical use</td><td>validate constraints, path sums with target</td><td>height, diameter, subtree aggregates</td></tr>
  <tr><td>Example</td><td>Validate BST (pass allowed range down)</td><td>Diameter (return height up)</td></tr>
</table>
<p>When stuck on a tree problem, ask: <em>"does a node need to know something about its ancestors
(top-down), or about its subtrees (bottom-up)?"</em> Saying that question aloud is a strong
interview move by itself.</p>

<h2>2. Validate BST — the classic top-down</h2>
<p>The trap 80% of candidates walk into: checking only <code>left.val &lt; node.val &lt;
right.val</code>. That's a <em>local</em> check; BST is a <em>global</em> property:</p>
<pre><code>      5
     / \\
    4   6
       / \\
      3   7     ← 3 < 5 but sits in 5's right subtree: NOT a BST</code></pre>
<p>The fix: every node lives inside a range that its ancestors carved out. Pass it down:</p>
<pre><code>def is_valid_bst(root):
    def check(node, lo, hi):
        if node is None:
            return True
        if not (lo < node.val < hi):
            return False
        return (check(node.left,  lo, node.val) and
                check(node.right, node.val, hi))
    return check(root, float("-inf"), float("inf"))</code></pre>
<p>Alternative worth naming: an in-order traversal of a BST is strictly increasing — walk it and
verify. Same complexity, different flavor.</p>

<h2>3. Diameter — the "return one thing, track another" pattern</h2>
<p>Diameter = longest path between any two nodes (in edges). The subtlety: the recursion
<strong>returns height</strong> but the <strong>answer is tracked on the side</strong>:</p>
<pre><code>def diameter_of_binary_tree(root):
    best = 0
    def height(node):
        nonlocal best
        if node is None:
            return 0
        lh = height(node.left)
        rh = height(node.right)
        best = max(best, lh + rh)     # path THROUGH this node
        return 1 + max(lh, rh)        # but return plain height
    height(root)
    return best</code></pre>
<p>This "the recursion's return value and the problem's answer are different quantities" pattern
also powers Longest Univalue Path and Binary Tree Maximum Path Sum. Recognizing it saves you
from trying to force the answer through the return value, which doesn't work.</p>

<h2>4. Lowest Common Ancestor</h2>
<p>The elegant recursion: <em>"the LCA is the first node where p and q are on different
sides."</em></p>
<pre><code>def lowest_common_ancestor(root, p, q):
    if root is None or root is p or root is q:
        return root
    left  = lowest_common_ancestor(root.left,  p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root          # p and q split here -> this is the LCA
    return left or right     # both on one side (or none found)</code></pre>
<p>Why it works: each call answers "does this subtree contain p or q (returning whichever it
found, or their LCA if both)?" If the two sides both report a hit, the current node is the split
point. Follow-up to expect: "what if it's a BST?" → walk from the root; the LCA is the first node
whose value sits between p and q. O(h) instead of O(n).</p>

<h2>5. Level-order and its costumes</h2>
<p>BFS with a queue, processing one <em>level</em> per outer iteration (snapshot
<code>len(queue)</code> first). Right Side View = the last node of each level. Zigzag = reverse
alternate levels. Average of Levels = mean per level. One template, four questions:</p>
<pre><code>from collections import deque
def right_side_view(root):
    if not root: return []
    out, q = [], deque([root])
    while q:
        n = len(q)                    # freeze the level size
        for i in range(n):
            node = q.popleft()
            if i == n - 1:
                out.append(node.val)  # last of this level
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
    return out</code></pre>

<h2>6. Serialize / deserialize — design your own format</h2>
<p>The interviewer is testing <em>format design</em>, not traversal. The clean answer: preorder
with a sentinel for null, because preorder + null markers uniquely determines the tree and
deserialization is a single forward pass:</p>
<pre><code>def serialize(root):
    parts = []
    def dfs(node):
        if node is None:
            parts.append("#"); return
        parts.append(str(node.val))
        dfs(node.left); dfs(node.right)
    dfs(root)
    return ",".join(parts)

def deserialize(data):
    vals = iter(data.split(","))
    def build():
        v = next(vals)
        if v == "#": return None
        node = TreeNode(int(v))
        node.left = build()
        node.right = build()
        return node
    return build()</code></pre>
<p>Points to raise unprompted: values containing the delimiter (escape or length-prefix),
level-order as an equally valid alternative, and the BST special case — for a BST, preorder
<em>without</em> null markers suffices because the value ranges reconstruct the shape.</p>

<h2>7. Recursion depth — the Python footnote</h2>
<p>A degenerate tree (linked-list shape) with 10⁵ nodes blows Python's ~1000-frame default stack.
For interviews, code the recursive version, then <em>mention</em>: "if the tree can be huge and
skewed, I'd convert to an explicit stack or raise the recursion limit." Iterative in-order with a
stack is worth having in your fingers for that follow-up.</p>
`
      },
      {
        kind: "mcq",
        q: "Why does checking <code>left.val &lt; node.val &lt; right.val</code> at every node fail to validate a BST?",
        options: [
          { label: "It doesn't handle None children.", correct: false },
          { label: "It's a local check — a node deep in the right subtree can violate an ancestor's bound while satisfying its parent's.", correct: true },
          { label: "It fails on duplicate values only.", correct: false },
          { label: "It has the wrong complexity — O(n²) instead of O(n).", correct: false },
        ],
        explain:
          "<p>BST ordering is a <em>global</em> constraint: every node in the right subtree of X must exceed X — not just the immediate child. The counterexample from the text: 3 placed under 5→6 satisfies its parent (3 &lt; 6) but violates the grandparent (3 &lt; 5 on the wrong side). Hence range-passing top-down recursion (or the in-order strictly-increasing check).</p>",
      },
      {
        kind: "mcq",
        q: "In the diameter solution, what would go wrong if <code>height()</code> returned <code>lh + rh</code> (the path through the node) instead of <code>1 + max(lh, rh)</code>?",
        options: [
          { label: "Nothing — it computes the same value.", correct: false },
          { label: "Parents would treat a child's 'bent path' as if it were a straight descending height, producing paths that fork twice — which aren't valid paths.", correct: true },
          { label: "It would raise RecursionError on skewed trees.", correct: false },
          { label: "It would double-count the root node.", correct: false },
        ],
        explain:
          "<p>A path can bend at most once. The value handed <em>up</em> must be a straight chain (height) that the parent can extend; the bent quantity <code>lh + rh</code> is only ever a <em>candidate answer</em>, recorded on the side. Confusing the two produces 'paths' that fork at two different nodes — not paths at all. This is the exact reason the pattern separates the return value from the tracked answer.</p>",
      },
    ],
  },

  // =============================================================
  // MODULE 8 — Graphs Deep Dive
  // =============================================================
  M8: {
    id: "M8",
    title: "Module 8 — Graphs Deep Dive",
    subtitle: "Topological sort, Dijkstra, implicit graphs, reverse thinking",
    practiceSet: "PS8",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 8 — Graphs Deep Dive</h1>
  <p>Stage 1 covered BFS, DFS, grids, and Union-Find. This module adds the final-stage material:
  <strong>topological sort</strong>, <strong>Dijkstra</strong>, <strong>implicit graphs</strong>,
  and the <strong>reverse-thinking</strong> trick — plus the decision table for choosing among
  them under pressure.</p>
</div>

<h2>1. First move: build the adjacency list</h2>
<p>Interview graphs arrive as edge lists (<code>[[1,0],[2,1]]</code>), grids, or implicit rules.
Whatever the input, your first coded lines normalize it:</p>
<pre><code>from collections import defaultdict
graph = defaultdict(list)
for a, b in edges:
    graph[a].append(b)
    graph[b].append(a)     # drop this line for directed graphs</code></pre>
<p>Narrate the two decisions: directed or not, and whether isolated nodes exist (they won't appear
in the dict — iterate over <code>range(n)</code>, not over the dict, when that matters).</p>

<h2>2. The algorithm decision table</h2>
<table class="tbl">
  <tr><th>Question smells like…</th><th>Reach for</th><th>Complexity</th></tr>
  <tr><td>Shortest path, unweighted</td><td>BFS</td><td>O(V+E)</td></tr>
  <tr><td>Shortest path, weighted, no negatives</td><td>Dijkstra</td><td>O(E log V)</td></tr>
  <tr><td>Negative edges present</td><td>Bellman-Ford</td><td>O(VE)</td></tr>
  <tr><td>Dependency order / detect cycle in DAG</td><td>Topological sort (Kahn)</td><td>O(V+E)</td></tr>
  <tr><td>Connectivity, merging groups online</td><td>Union-Find</td><td>~O(1)/op</td></tr>
  <tr><td>Reachability, exploring everything</td><td>DFS</td><td>O(V+E)</td></tr>
</table>
<p>Announce your pick <em>from this table</em>: "weighted, non-negative → Dijkstra." One sentence,
huge signal.</p>

<h2>3. Topological sort — Kahn's algorithm</h2>
<p>Order the nodes of a directed graph so every edge points forward. Only DAGs have one; the
algorithm doubles as the cycle detector:</p>
<pre><code>from collections import deque
def can_finish(n, prerequisites):
    graph = [[] for _ in range(n)]
    indegree = [0] * n
    for course, pre in prerequisites:
        graph[pre].append(course)
        indegree[course] += 1
    q = deque(i for i in range(n) if indegree[i] == 0)
    done = 0
    while q:
        node = q.popleft()
        done += 1
        for nxt in graph[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                q.append(nxt)
    return done == n        # nodes stuck with indegree > 0 = cycle</code></pre>
<p>The intuition: repeatedly peel off nodes with no remaining prerequisites. If peeling stalls
before everyone is processed, the survivors form a cycle. The DFS-coloring alternative
(white/gray/black; a gray→gray edge = cycle) is worth naming as "the other way".</p>

<h2>4. Dijkstra — the lazy-deletion heap version</h2>
<pre><code>import heapq
def network_delay_time(times, n, k):
    graph = [[] for _ in range(n + 1)]
    for u, v, w in times:
        graph[u].append((v, w))
    dist = {}
    heap = [(0, k)]
    while heap:
        d, node = heapq.heappop(heap)
        if node in dist:
            continue            # lazy deletion: stale entry, skip
        dist[node] = d
        for nxt, w in graph[node]:
            if nxt not in dist:
                heapq.heappush(heap, (d + w, nxt))
    return max(dist.values()) if len(dist) == n else -1</code></pre>
<p>Points the interviewer listens for: the heap may hold <em>stale duplicates</em> (we push
without decrease-key; the <code>if node in dist: continue</code> guard discards them), greedy
correctness requires <strong>non-negative weights</strong>, and complexity is O(E log V).
If they ask "why does it break with negative edges?" — because popping a node assumes no cheaper
path can appear later; a negative edge can produce one.</p>

<h2>5. Implicit graphs — Word Ladder</h2>
<p>No edges are given: words are nodes, and an edge means "differ by one letter". The skill being
tested is <em>modeling</em> — say "this is a shortest-path problem on an implicit graph, so BFS"
before writing anything. Generating neighbors: for each position, try all 26 letters, keep those
in the word set. With word length L and set size N that's O(26·L) per node instead of the O(N·L)
all-pairs comparison.</p>
<div class="callout tip">
  <div class="callout-title">Two upgrades to name (not necessarily code)</div>
  Wildcard buckets (<code>h*t</code> as a precomputed adjacency key) avoid the 26-letter loop;
  bidirectional BFS expands from both ends and meets in the middle, roughly square-rooting the
  frontier size. Naming these when asked "can we do better?" is exactly the depth this stage wants.
</div>

<h2>6. Reverse thinking — Pacific Atlantic</h2>
<p>"Which cells can flow to both oceans?" Simulating flow from every cell is O((mn)²). The trick:
<strong>flip the direction</strong> — start from the ocean edges and climb uphill; a cell reaches
an ocean iff the ocean's climb reaches it. Two BFS/DFS sweeps (one per ocean), intersect the
visited sets, O(mn) total.</p>
<p>This reversal shows up everywhere: "cells that can reach X" becomes "cells reachable from X in
the reversed graph". If a straightforward simulation looks quadratic, ask: <em>can I start from
the destination?</em></p>

<h2>7. Union-Find — the 60-second recap</h2>
<pre><code>parent = list(range(n))
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]   # path halving
        x = parent[x]
    return x
def union(a, b):
    ra, rb = find(a), find(b)
    if ra == rb: return False           # already connected
    parent[ra] = rb
    return True</code></pre>
<p>Count components: start with n, subtract one per successful union. Detect a cycle in an
undirected graph: a union that returns False found one. For the full rank/compression story,
revisit the stage-1 tutorial's Module 4 — here, this compact version is all an interview needs.</p>
`
      },
      {
        kind: "mcq",
        q: "Kahn's algorithm finishes with <code>done == 4</code> on a 6-node course graph. What does that mean?",
        options: [
          { label: "4 courses have no prerequisites.", correct: false },
          { label: "The graph has two connected components.", correct: false },
          { label: "Two nodes never reached indegree 0 — they're locked in a cycle (or depend on one), so no valid order exists.", correct: true },
          { label: "The queue was initialized incorrectly.", correct: false },
        ],
        explain:
          "<p>Peeling only ever removes nodes whose prerequisites are all satisfied. Nodes inside a cycle wait on each other forever, so their indegree never hits 0 and they're never processed. <code>done &lt; n</code> is therefore exactly the cycle test — the count doubles as the detector, which is why Course Schedule is 'topological sort' in disguise.</p>",
      },
      {
        kind: "mcq",
        q: "Why does Dijkstra's correctness break with negative edge weights?",
        options: [
          { label: "The heap can't store negative numbers.", correct: false },
          { label: "Finalizing a popped node assumes no cheaper path to it can appear later — a negative edge elsewhere can create exactly that.", correct: true },
          { label: "It infinite-loops on negative cycles but works for isolated negative edges.", correct: false },
          { label: "It doesn't break; it just becomes O(VE).", correct: false },
        ],
        explain:
          "<p>Dijkstra's greedy step — 'the closest unfinalized node is done, permanently' — relies on every extension making paths longer. A negative edge lets a longer-looking route become shorter after finalization, invalidating the commitment. Bellman-Ford tolerates negatives (and detects negative cycles) by relaxing all edges V-1 times instead of committing greedily — that's the trade: O(VE) versus O(E log V).</p>",
      },
      {
        kind: "mcq",
        q: "In Pacific Atlantic, the reverse-BFS climbs from the ocean edges uphill (neighbor height ≥ current). Why '≥' and not '&gt;'?",
        options: [
          { label: "Water can flow between cells of equal height, so the reversed edge must also exist between equal heights.", correct: true },
          { label: "It's an off-by-one convention; either works.", correct: false },
          { label: "Because the borders are all at sea level.", correct: false },
          { label: "To make the DFS terminate.", correct: false },
        ],
        explain:
          "<p>Forward rule: water flows from a cell to a neighbor with height ≤ its own. Reversing an edge preserves the equality case: if flow goes A→B when B ≤ A, then climbing goes B→A when A ≥ B. Dropping the equality silently deletes edges and produces wrong answers on plateau maps — a favorite hidden test case.</p>",
      },
    ],
  },

  M9: {
    id: "M9",
    title: "Module 9 — Dynamic Programming",
    subtitle: "State design, memoization, the four core shapes",
    practiceSet: "PS9",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 9 — Dynamic Programming</h1>
  <p>DP is the most feared interview topic and the most mechanical once you have the recipe.
  Stage 1 barely touched it; the final stage loves it. This module gives you a
  <strong>four-step recipe</strong> that turns any DP problem into a fill-in-the-blanks exercise,
  then walks the four shapes that cover ~90% of interview DP.</p>
</div>

<h2>1. The honest definition</h2>
<p>Dynamic programming is <strong>recursion plus a notebook</strong>. Nothing more. If a brute-force
recursion solves the problem but recomputes the same subproblems, caching those results <em>is</em> DP.
The scary name hides a boring idea.</p>

<p>Two properties must hold, and stating them out loud scores points:</p>
<ul>
  <li><strong>Optimal substructure</strong> — the best answer for the whole is built from best answers
  for smaller pieces.</li>
  <li><strong>Overlapping subproblems</strong> — the recursion visits the same smaller pieces many times.
  (If it doesn't, plain divide &amp; conquer is enough — no cache needed.)</li>
</ul>

<h2>2. The four-step recipe (always top-down first)</h2>
<ol>
  <li><strong>Write the brute-force recursion.</strong> Don't optimize. Just answer:
  "if I make one choice, what smaller problem remains?"</li>
  <li><strong>Name the state.</strong> The state is exactly the set of arguments that change
  between recursive calls. One changing index → 1D DP. Two → 2D. That's it.</li>
  <li><strong>Memoize.</strong> In Python, slap <code>@functools.cache</code> on it
  (or a dict keyed by the state). Complexity collapses from exponential to
  (number of states) × (work per state).</li>
  <li><strong>(Optional) Convert to a table.</strong> Bottom-up saves recursion overhead and enables
  space tricks (keeping only the previous row). Do this only if asked or if recursion depth
  is a risk — a working memoized solution is a <em>finished</em> solution.</li>
</ol>

<div class="callout tip"><div class="callout-title">The state-design question</div>
<p>When stuck, ask: <em>"What is the minimum information about the decisions made so far that the
rest of the problem needs?"</em> Not the full history — just what the future can see. In House Robber
the future only needs to know <em>the index I'm at</em> and implicitly whether the previous house was
taken; in Edit Distance it's <em>how much of each word is left</em>. Everything else is noise.</p></div>

<h2>3. Shape 1 — 1D take / skip</h2>
<p><strong>House Robber</strong>: rob non-adjacent houses for max loot. One choice per house:
take it (skip the neighbor) or skip it.</p>
<pre><code>def rob(nums):
    take, skip = 0, 0          # best ending with/without robbing previous house
    for x in nums:
        take, skip = skip + x, max(take, skip)
    return max(take, skip)</code></pre>
<p>Note the shape: the "table" collapsed to two rolling variables because state <code>i</code> only
looks back one step. Say that out loud — <em>"dp[i] depends only on dp[i-1] and dp[i-2], so I keep
two variables instead of an array"</em> — it's a free space-optimization point.</p>

<div class="callout warn"><div class="callout-title">Tuple-assignment trap, again</div>
<p><code>take, skip = skip + x, max(take, skip)</code> works because Python evaluates the whole
right side first. If you write it as two separate statements, the second line sees the
<em>new</em> <code>take</code> and the answer is silently wrong. Same trap as the array-swap in Module 4.</p></div>

<h2>4. Shape 2 — unbounded choice (Coin Change)</h2>
<p>Minimum coins to make <code>amount</code>, unlimited supply. State: the remaining amount.
Transition: try every coin.</p>
<pre><code>def coin_change(coins, amount):
    INF = amount + 1                      # impossible marker
    dp = [0] + [INF] * amount             # dp[a] = min coins for amount a
    for a in range(1, amount + 1):
        for c in coins:
            if c &lt;= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] &lt;= amount else -1</code></pre>

<div class="callout warn"><div class="callout-title">Loop order changes the meaning</div>
<p>For <em>counting ways</em> problems: coins in the <strong>outer</strong> loop counts
<em>combinations</em> (order doesn't matter); amount in the outer loop counts
<em>permutations</em> (order matters — that variant is "Combination Sum IV"). For min-coins it makes
no difference, but interviewers probe this exact distinction. If asked "how many ways to make
change?", pause and ask whether <code>1+2</code> and <code>2+1</code> are the same way.</p></div>

<h2>5. Shape 3 — 2D grid over two sequences</h2>
<p><strong>Longest Common Subsequence</strong> is the archetype. State: <code>(i, j)</code> = answer
for <code>text1[i:]</code> vs <code>text2[j:]</code>. Characters match → take both and move on;
otherwise best of skipping one from either side.</p>
<pre><code>def longest_common_subsequence(t1, t2):
    m, n = len(t1), len(t2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]   # dp[i][j]: LCS of t1[i:], t2[j:]
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            if t1[i] == t2[j]:
                dp[i][j] = 1 + dp[i + 1][j + 1]
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j + 1])
    return dp[0][0]</code></pre>
<p><strong>Edit Distance</strong> is the same skeleton with three transitions instead of two:
match/replace (diagonal), delete (down), insert (right) — each non-match costs 1. If you can write
LCS, you can write Edit Distance; only the transition line changes. The same family covers
Distinct Subsequences and Interleaving String.</p>

<h2>6. Shape 4 — sequence DP with a twist: LIS</h2>
<p><strong>Longest Increasing Subsequence</strong>: the O(n²) DP is
"<code>dp[i]</code> = longest ending at <code>i</code>; check all earlier smaller elements".
Say it, then offer the upgrade:</p>
<pre><code>import bisect
def length_of_lis(nums):
    tails = []     # tails[k] = smallest tail of an increasing subseq of length k+1
    for x in nums:
        i = bisect.bisect_left(tails, x)
        if i == len(tails): tails.append(x)
        else: tails[i] = x
    return len(tails)</code></pre>
<p>Why it works: <code>tails</code> stays sorted, and replacing <code>tails[i]</code> with a smaller
value never shortens any existing subsequence — it only makes future extensions easier. The array is
<em>not</em> an actual subsequence; only its length is meaningful. Mentioning that caveat shows real
understanding. O(n log n) via the Module 6 boundary search.</p>

<h2>7. DP over cut points — Word Break</h2>
<p>"Can <code>s</code> be split into dictionary words?" State: a position in the string.
<code>dp[i]</code> = "is <code>s[:i]</code> breakable?" — true if some earlier breakable
position <code>j</code> has <code>s[j:i]</code> in the dictionary.</p>
<pre><code>def word_break(s, word_dict):
    words = set(word_dict)
    dp = [True] + [False] * len(s)
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]</code></pre>
<p>Same shape covers Palindrome Partitioning II and similar "split the string" problems. The tell:
<em>the answer for a prefix depends on answers for shorter prefixes plus a validity check on the gap</em>.</p>

<h2>8. Choosing DP vs greedy vs backtracking</h2>
<table class="tbl">
  <tr><th>Ask</th><th>If yes →</th></tr>
  <tr><td>Does a locally best choice provably never hurt? (exchange argument works)</td><td>Greedy — O(n log n) or better</td></tr>
  <tr><td>Need the count/min/max over exponentially many paths, and subproblems repeat?</td><td>DP</td></tr>
  <tr><td>Need to <em>enumerate</em> the actual solutions, or constraints ≤ ~20?</td><td>Backtracking</td></tr>
</table>
<p>Practical tell: <em>"how many ways"</em> / <em>"minimum cost"</em> with n up to 10³–10⁴ screams DP;
<em>"return all"</em> screams backtracking; n up to 10⁵ with a sort-friendly structure hints greedy
(next module).</p>

<div class="callout good"><div class="callout-title">Pacing note</div>
<p>In a live interview, a memoized top-down solution earns nearly full marks. Convert to bottom-up
only if the interviewer asks, or recursion depth could blow (Python default ~1000 — flag it, as in
Module 7). Don't burn 15 minutes converting a working solution nobody asked you to convert.</p></div>
`,
      },
      {
        kind: "mcq",
        q: "For \"how many ways can you make amount N from these coins (order doesn't matter)\", which loop structure is correct?",
        options: [
          { label: "for coin in coins: for a in range(coin, N+1): dp[a] += dp[a-coin]", correct: true },
          { label: "for a in range(1, N+1): for coin in coins: dp[a] += dp[a-coin]", correct: false },
          { label: "Either — loop order never affects a DP result.", correct: false },
          { label: "Neither — counting ways requires backtracking.", correct: false },
        ],
        explain:
          "<p>Coins outer means each coin type is 'decided' once: all ways using only the first k coin types are counted before the next type enters, so <code>1+2</code> and <code>2+1</code> collapse into one combination. Amount outer counts ordered sequences (permutations) — a different, also-valid problem (Combination Sum IV), but the wrong answer here. Loop order absolutely changes DP semantics when the transition sums over choices.</p>",
      },
      {
        kind: "mcq",
        q: "You wrote a brute-force recursion with signature solve(i, j, used_flag). How many dimensions does your memo table need?",
        options: [
          { label: "Three — one per changing argument: i, j, and used_flag.", correct: true },
          { label: "Two — booleans don't count as state.", correct: false },
          { label: "One — you can always collapse state into a single index.", correct: false },
          { label: "It depends on the input size, not the signature.", correct: false },
        ],
        explain:
          "<p>The state <em>is</em> the tuple of changing arguments — nothing more, nothing less. A boolean doubles the state space (×2), it doesn't vanish. This is why the recipe says 'write the recursion first': the memo dimensions read directly off the signature, and state count × work per state gives you the complexity answer the interviewer will ask for next.</p>",
      },
      {
        kind: "mcq",
        q: "In the O(n log n) LIS solution, what does the tails array contain after processing [10, 9, 2, 5, 3, 7]?",
        options: [
          { label: "[2, 3, 7] — smallest possible tail for each subsequence length.", correct: true },
          { label: "[2, 5, 7] — an actual longest increasing subsequence.", correct: false },
          { label: "[10, 9, 7] — the largest elements seen.", correct: false },
          { label: "[2, 3] — lengths are capped at the number of replacements.", correct: false },
        ],
        explain:
          "<p>Trace: 10 → [10]; 9 replaces → [9]; 2 replaces → [2]; 5 appends → [2,5]; 3 replaces 5 → [2,3]; 7 appends → [2,3,7]. The array holds 'best (smallest) tail per length', not an actual subsequence — after replacements it can be a sequence that never appeared in order. Only its <em>length</em> is the answer. Interviewers love asking exactly this.</p>",
      },
    ],
  },

  M10: {
    id: "M10",
    title: "Module 10 — Greedy & Intervals",
    subtitle: "Exchange arguments, sweep lines, the interval toolkit",
    practiceSet: "PS10",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 10 — Greedy &amp; Intervals</h1>
  <p>Greedy solutions are short — three to ten lines — which makes them dangerous: the code is easy,
  <em>knowing it's correct</em> is the hard part. Interval problems are the most common greedy
  playground. This module gives you the two proof techniques and a sort-key decision table that
  together crack nearly every interval question.</p>
</div>

<h2>1. What greedy really claims</h2>
<p>A greedy algorithm makes the locally best choice and <strong>never reconsiders</strong>. That's a
strong claim — most problems punish it (that's why DP exists). It's valid only when you can argue one
of two things:</p>
<ul>
  <li><strong>Exchange argument</strong>: take any optimal solution that disagrees with greedy at some
  first step; swap in greedy's choice; show the result is no worse. Repeat → greedy is optimal.
  You met this in Module 3 (Container With Most Water).</li>
  <li><strong>Staying ahead</strong>: after every step, greedy's partial solution is at least as good
  as any other strategy's partial solution, by induction.</li>
</ul>
<p>In an interview you don't write a formal proof — you <em>say the argument</em>:
"if an optimal schedule doesn't pick the meeting that ends earliest, I can swap that meeting in
without breaking anything, so picking earliest-end first is safe."</p>

<h2>2. The interval toolkit — sort key decides everything</h2>
<table class="tbl">
  <tr><th>Goal</th><th>Sort by</th><th>Then</th></tr>
  <tr><td>Merge overlapping intervals</td><td><strong>start</strong></td><td>extend current merged block while <code>next.start ≤ cur.end</code></td></tr>
  <tr><td>Keep max non-overlapping set (= remove min to de-overlap)</td><td><strong>end</strong></td><td>take every interval that starts at/after the last taken end</td></tr>
  <tr><td>Min rooms / max concurrent overlap</td><td>events</td><td>sweep line: +1 at start, −1 at end, track running max</td></tr>
  <tr><td>"Can attend all?"</td><td>start</td><td>any <code>next.start &lt; cur.end</code> → no</td></tr>
</table>

<p><strong>Merge Intervals</strong> — the bread-and-butter version:</p>
<pre><code>def merge(intervals):
    intervals.sort()
    out = []
    for s, e in intervals:
        if out and s &lt;= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)   # extend (careful: max, not just e!)
        else:
            out.append([s, e])
    return out</code></pre>

<div class="callout warn"><div class="callout-title">The classic merge bug</div>
<p><code>out[-1][1] = e</code> instead of <code>max(out[-1][1], e)</code> fails when a short interval
is swallowed by a longer one: merging <code>[1,10]</code> with <code>[2,3]</code> must stay
<code>[1,10]</code>, not shrink to <code>[1,3]</code>. Sorting by start does <em>not</em> sort by end.
Every interviewer has seen this bug; don't be the next person to write it.</p></div>

<p><strong>Why sort by end for selection?</strong> (Non-overlapping Intervals / Activity Selection):
the meeting that ends earliest leaves the most room for everything after it. Exchange argument:
any optimal selection's first meeting can be swapped for the earliest-ending one without conflict.
Sorting by start instead is the trap — a long early-starting interval can block many short ones.</p>

<h2>3. Sweep line — the +1/−1 trick</h2>
<p><strong>Meeting Rooms II</strong>: minimum rooms = maximum number of meetings alive at once.
Turn every interval into two events and sweep:</p>
<pre><code>def min_meeting_rooms(intervals):
    events = []
    for s, e in intervals:
        events.append((s, 1))      # meeting starts: need a room
        events.append((e, -1))     # meeting ends: free a room
    events.sort()                  # ties: (t,-1) before (t,1) — end frees before start takes
    rooms = best = 0
    for _, d in events:
        rooms += d
        best = max(best, rooms)
    return best</code></pre>
<p>The tie-break matters and Python gives it to you free: tuples sort by second element on time ties,
and −1 &lt; 1, so a meeting ending at 10 releases its room before one starting at 10 claims it —
back-to-back meetings share a room. If the problem says touching intervals <em>do</em> conflict,
flip the tie-break. <strong>Ask which convention applies</strong> — it's a great clarifying question.</p>
<p>The same trick answers "max concurrent users", "min platforms for trains", and any
"peak simultaneous X" question — including as a SQL question (you'll see it again in the database
modules).</p>

<h2>4. Greedy in disguise — Jump Game II</h2>
<p>"Min jumps to reach the end" looks like DP, and O(n²) DP works — but the O(n) greedy is really
<strong>BFS over an implicit graph</strong> (Module 8 thinking!): layer k is the set of indices
reachable in k jumps.</p>
<pre><code>def jump(nums):
    jumps = cur_end = farthest = 0
    for i in range(len(nums) - 1):       # note: never process the last index
        farthest = max(farthest, i + nums[i])
        if i == cur_end:                 # finished current BFS layer
            jumps += 1
            cur_end = farthest           # next layer's frontier
    return jumps</code></pre>
<p>Narrate it as BFS layers and the correctness is obvious — each "jump" expands the frontier as far
as anything in the current layer can reach. This reframe (greedy = frontier expansion) also explains
Gas Station and Video Stitching.</p>

<h2>5. The Gas Station lemma</h2>
<p>Circular tour: find a start so the tank never goes negative. Two facts crack it:</p>
<ol>
  <li>If total gas ≥ total cost, an answer <strong>exists</strong> (and it's unique per problem statement).</li>
  <li>If starting at <code>s</code> you first fail when leaving station <code>i</code>, then <em>no
  station in <code>s..i</code> works</em> — any such start reaches <code>i</code> with less (or equal)
  fuel than you had, since you arrived at it with tank ≥ 0. So restart from <code>i+1</code>.</li>
</ol>
<pre><code>def can_complete_circuit(gas, cost):
    total = tank = start = 0
    for i in range(len(gas)):
        diff = gas[i] - cost[i]
        total += diff
        tank += diff
        if tank &lt; 0:            # everything from start..i is disqualified
            start, tank = i + 1, 0
    return start if total &gt;= 0 else -1</code></pre>
<p>One pass, and the "skip the whole failed prefix" lemma is the whole interview — say it clearly
and the code writes itself.</p>

<div class="callout tip"><div class="callout-title">When greedy fails, say why</div>
<p>Coin change with coins <code>[1, 3, 4]</code> and amount 6: greedy takes 4+1+1 (three coins),
optimal is 3+3 (two). Keep this counterexample in your pocket — producing it instantly when an
interviewer asks "would greedy work here?" is a strong signal. Greedy works for <em>canonical</em>
coin systems (like real currencies), not arbitrary ones; when in doubt, DP.</p></div>
`,
      },
      {
        kind: "mcq",
        q: "For \"remove the minimum number of intervals so none overlap\", why sort by end time rather than start time?",
        options: [
          { label: "Earliest-ending interval leaves maximal room; an exchange argument shows swapping it into any optimal solution never hurts.", correct: true },
          { label: "Sorting by end is O(n log n) while sorting by start is O(n²).", correct: false },
          { label: "It handles negative interval bounds correctly.", correct: false },
          { label: "Both sort keys give correct answers; end is just conventional.", correct: false },
        ],
        explain:
          "<p>Both sorts cost O(n log n) — the difference is correctness of the greedy choice, not speed. Counterexample for sort-by-start: [1,100], [2,3], [4,5] — start order picks [1,100] first and rejects both short ones; end order picks [2,3], [4,5] and rejects only [1,100]. The earliest-ending choice can replace the first interval of any optimal solution without creating conflicts, which is the exchange argument in one sentence.</p>",
      },
      {
        kind: "mcq",
        q: "In the sweep-line room counter, meetings [1,3] and [3,5] should share one room. What makes that work?",
        options: [
          { label: "End events sort before start events at the same timestamp, so the room frees before it's claimed.", correct: true },
          { label: "The +1/−1 deltas cancel out over the whole sweep.", correct: false },
          { label: "Sorting the intervals by duration first.", correct: false },
          { label: "It doesn't work — sweep line always counts touching intervals as overlapping.", correct: false },
        ],
        explain:
          "<p>At time 3 there are two events: (3, −1) from the first meeting ending and (3, +1) from the second starting. Tuple sort puts −1 first, so the counter dips to 0 before rising back to 1 — max stays 1, one room. If the problem's convention is that touching intervals conflict, you must flip the tie-break (starts before ends). Knowing the tie-break is <em>a decision, not an accident</em> is the point of this question.</p>",
      },
    ],
  },

  M11: {
    id: "M11",
    title: "Module 11 — Heaps & Priority Queues",
    subtitle: "Top-K, two heaps, k-way merge — and a heap you can write in JS",
    practiceSet: "PS11",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 11 — Heaps &amp; Priority Queues</h1>
  <p>A heap answers one question fast, over and over: <strong>"what's the smallest thing right
  now?"</strong> — O(log n) insert, O(log n) extract-min, O(1) peek. You already used one inside
  Dijkstra (Module 8); this module makes heaps a first-class tool: the three interview patterns,
  Python's <code>heapq</code> idioms, and — because JavaScript has no built-in heap — a
  20-line MinHeap you can write from memory.</p>
</div>

<h2>1. What a heap is (60-second version)</h2>
<p>A <strong>complete binary tree stored in a flat array</strong> where every parent ≤ its children
(min-heap). No pointers needed — index math is the tree:</p>
<pre><code>parent(i) = (i - 1) // 2
left(i)   = 2*i + 1
right(i)  = 2*i + 2</code></pre>
<ul>
  <li><strong>push</strong>: append at the end, <em>sift up</em> — swap with parent while smaller. O(log n).</li>
  <li><strong>pop-min</strong>: save root, move last element to root, <em>sift down</em> — swap with
  the smaller child while larger. O(log n).</li>
  <li><strong>heapify</strong> an existing array: sift down from the middle backwards —
  <strong>O(n)</strong>, not O(n log n). A classic trivia question; the intuition is that most nodes
  are near the bottom and sift almost nowhere.</li>
</ul>
<p>The heap is <em>partially</em> ordered: the root is the min, but siblings are in no particular
order and iterating the array does <strong>not</strong> visit sorted values. Saying "I'd iterate the
heap in order" is an instant red flag — popping n times is how you get sorted output (that's heapsort,
O(n log n)).</p>

<h2>2. Python: heapq idioms</h2>
<pre><code>import heapq
h = []
heapq.heappush(h, 5)
smallest = heapq.heappop(h)
heapq.heapify(existing_list)          # in-place, O(n)
h[0]                                  # peek min, O(1)</code></pre>
<table class="tbl">
  <tr><th>Need</th><th>Idiom</th></tr>
  <tr><td>Max-heap</td><td>push <code>-x</code>, negate on pop (heapq is min-only)</td></tr>
  <tr><td>Sort by key, carry payload</td><td>push tuples: <code>(priority, payload)</code> — compares element-wise</td></tr>
  <tr><td>Payloads that can't be compared</td><td>add a tiebreaker: <code>(priority, i, payload)</code> with a counter <code>i</code></td></tr>
  <tr><td>Quick top-k</td><td><code>heapq.nlargest(k, items, key=...)</code> / <code>nsmallest</code></td></tr>
</table>
<div class="callout warn"><div class="callout-title">The tuple-comparison crash</div>
<p><code>heappush(h, (dist, node_object))</code> works until two entries tie on <code>dist</code> —
then Python tries to compare the node objects and throws <code>TypeError</code>. The counter
tiebreaker <code>(dist, i, node)</code> fixes it and guarantees stable ordering. This bites people
live, mid-Dijkstra, under time pressure. Pre-empt it.</p></div>

<h2>3. JavaScript: bring your own heap</h2>
<p>JS has no standard-library heap. In an interview you have three honest options — pick by size:</p>
<ol>
  <li><strong>n is small (≤ ~10⁴)</strong>: keep a sorted array; binary-search the insertion point
  (Module 6!) and <code>splice</code>. O(n) insert but tiny constants — say the trade-off out loud.</li>
  <li><strong>Simulate</strong>: re-sort per step or scan for the min — fine for O(V²) Dijkstra on
  small graphs.</li>
  <li><strong>Write the heap</strong> — 20 lines, worth memorizing the shape:</li>
</ol>
<pre><code>class MinHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) {
    const a = this.a; a.push(x);
    let i = a.length - 1;
    while (i &gt; 0) {
      const p = (i - 1) &gt;&gt; 1;
      if (a[p] &lt;= a[i]) break;
      [a[p], a[i]] = [a[i], a[p]]; i = p;
    }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l &lt; a.length &amp;&amp; a[l] &lt; a[m]) m = l;
        if (r &lt; a.length &amp;&amp; a[r] &lt; a[m]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]]; i = m;
      }
    }
    return top;
  }
}</code></pre>
<p>For tuples/objects, compare on a key (<code>a[p][0] &lt;= a[i][0]</code>) instead. If you interview
in JavaScript, write this class once a day until it's muscle memory — it converts every heap problem
from "impossible in JS" to "same as Python".</p>

<h2>4. Pattern 1 — Top-K with a size-k heap</h2>
<p>"K largest elements of a stream/array" — keep a <strong>min</strong>-heap of size k. Yes, min:
the heap holds the current k best, and its <em>root is the weakest of the best</em> — the only
element a newcomer needs to beat.</p>
<pre><code>def find_kth_largest(nums, k):
    h = nums[:k]
    heapq.heapify(h)
    for x in nums[k:]:
        if x &gt; h[0]:
            heapq.heapreplace(h, x)   # pop min + push, one sift
    return h[0]</code></pre>
<p>O(n log k) — beats full sort O(n log n) when k ≪ n, and works on streams (you never store more
than k items). The follow-up "can you do better?" points at <strong>quickselect</strong>: average
O(n) by partitioning like quicksort but recursing into one side only. Offer it verbally; code the
heap version — quickselect's worst case and in-place partition are easy to fumble live.</p>

<h2>5. Pattern 2 — two heaps (streaming median)</h2>
<p>Maintain the median of a growing stream: split the numbers into a <strong>max-heap of the small
half</strong> and a <strong>min-heap of the large half</strong>, keeping sizes balanced
(small may hold one extra).</p>
<pre><code>small, large = [], []            # small: max-heap via negation
def add(x):
    heapq.heappush(small, -x)                       # 1. into small
    heapq.heappush(large, -heapq.heappop(small))    # 2. move small's max over
    if len(large) &gt; len(small):                     # 3. rebalance sizes
        heapq.heappush(small, -heapq.heappop(large))
def median():
    if len(small) &gt; len(large): return -small[0]
    return (-small[0] + large[0]) / 2</code></pre>
<p>The push–move–rebalance dance keeps both invariants (every small ≤ every large; sizes within 1)
with no case analysis. The median is always at the roots: O(log n) insert, O(1) query.</p>

<h2>6. Pattern 3 — k-way merge</h2>
<p>Merge k sorted lists: the heap holds <strong>one candidate per list</strong> — the smallest unmerged
element of each. Pop the global min, push that list's next element. Each element enters and leaves the
heap once: <strong>O(N log k)</strong> for N total elements.</p>
<pre><code>def merge_k_lists(lists):
    h = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
    heapq.heapify(h)
    out = []
    while h:
        val, i, j = heapq.heappop(h)
        out.append(val)
        if j + 1 &lt; len(lists[i]):
            heapq.heappush(h, (lists[i][j + 1], i, j + 1))
    return out</code></pre>
<p>Same skeleton solves "kth smallest in a sorted matrix" and "smallest range covering k lists".
The <code>i</code> in the tuple doubles as the tie-breaker from section 2.</p>

<h2>7. Choosing: heap vs sort vs quickselect</h2>
<table class="tbl">
  <tr><th>Situation</th><th>Tool</th><th>Cost</th></tr>
  <tr><td>Need everything ordered, data static</td><td>sort</td><td>O(n log n)</td></tr>
  <tr><td>Need top-k, k ≪ n, or data streams in</td><td>size-k heap</td><td>O(n log k)</td></tr>
  <tr><td>Need k-th element once, array in memory, average case fine</td><td>quickselect</td><td>O(n) avg</td></tr>
  <tr><td>Need min repeatedly while set mutates</td><td>heap</td><td>O(log n) per op</td></tr>
  <tr><td>Need min <em>and</em> arbitrary delete/lookup</td><td>heap + lazy deletion (Module 8) or sorted container</td><td>O(log n)</td></tr>
</table>
`,
      },
      {
        kind: "mcq",
        q: "To keep the 5 largest values ever seen in a stream, which structure and why?",
        options: [
          { label: "A min-heap of size 5 — the root is the smallest of the current top-5, the only value a newcomer must beat.", correct: true },
          { label: "A max-heap of size 5 — you want the largest values, so use a max-heap.", correct: false },
          { label: "A max-heap of all values — pop 5 at the end.", correct: false },
          { label: "A sorted array of all values, sliced at the end.", correct: false },
        ],
        explain:
          "<p>The counter-intuitive classic: track the k <em>largest</em> with a <em>min</em>-heap. Its root is the gatekeeper — if a new value beats the weakest of the current best, replace the root (one O(log k) sift). A max-heap of size 5 can only tell you the <em>best</em> of the five instantly, but eviction requires finding the minimum, which a max-heap can't do cheaply. Storing everything (options 3–4) is O(n) memory and fails the streaming requirement.</p>",
      },
      {
        kind: "mcq",
        q: "heapq.heapify(lst) on n elements costs O(n), yet n pushes cost O(n log n). Where does the saving come from?",
        options: [
          { label: "Sift-down work is proportional to node height; most nodes sit near the bottom with height ~0, and the weighted sum telescopes to O(n).", correct: true },
          { label: "heapify is implemented in C, so it's a constant-factor saving only.", correct: false },
          { label: "heapify sorts the array with quicksort first.", correct: false },
          { label: "It's actually O(n log n); O(n) is amortized marketing.", correct: false },
        ],
        explain:
          "<p>Building bottom-up, each node sifts <em>down</em> at most its height: half the nodes have height 0 (leaves — free), a quarter have height 1, an eighth height 2… the sum n·Σ(h/2^h) converges to O(n). Pushing one-by-one sifts <em>up</em> to depth log n each time, hence O(n log n). Being written in C is true for CPython but irrelevant to the asymptotic answer — an interviewer will notice if you conflate the two.</p>",
      },
      {
        kind: "mcq",
        q: "In the two-heap median structure, why does add() always push into small, move small's max into large, then maybe rebalance — instead of choosing a heap by comparing x to the current median?",
        options: [
          { label: "The three fixed steps restore both invariants unconditionally — no branching on x, so no edge cases on empty heaps or duplicate values.", correct: true },
          { label: "Comparing to the median first would be asymptotically slower.", correct: false },
          { label: "Pushing directly into large would corrupt heapq's internal state.", correct: false },
          { label: "It's arbitrary style; direct comparison is equally safe to write live.", correct: false },
        ],
        explain:
          "<p>Both approaches are O(log n); the compare-first version is <em>correct</em> but demands careful case analysis (empty heaps, x equal to the median, which side to rebalance) — exactly where live-coding errors breed. The push–move–rebalance dance is unconditional: after step 2, every element of small ≤ every element of large by construction; after step 3, sizes differ by ≤ 1. Choosing the branch-free variant and saying why is itself a live-coding skill this course keeps preaching: prefer code whose correctness is structural, not case-by-case.</p>",
      },
    ],
  },

  M12: {
    id: "M12",
    title: "Module 12 — SQL Deep Dive",
    subtitle: "Joins, aggregation, window functions, NULL traps",
    practiceSet: "PS12",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 12 — SQL Deep Dive</h1>
  <p>The final stage reliably includes <strong>one SQL / database task</strong> alongside the two
  algorithm problems — and it's the easiest of the three to fully prepare for. This module covers
  the query-writing layer; Module 13 covers schema design and indexes. The practice set runs on a
  real SQLite engine (sql.js) right in your browser.</p>
</div>

<h2>1. The logical processing order (fixes half your bugs)</h2>
<p>SQL is written in one order and <em>executed</em> in another. Burn this in:</p>
<table class="tbl">
  <tr><th>#</th><th>Phase</th><th>What it can see</th></tr>
  <tr><td>1</td><td><code>FROM</code> + <code>JOIN … ON</code></td><td>tables only</td></tr>
  <tr><td>2</td><td><code>WHERE</code></td><td>row-level values — <strong>no aggregates, no SELECT aliases</strong></td></tr>
  <tr><td>3</td><td><code>GROUP BY</code></td><td>collapses rows into groups</td></tr>
  <tr><td>4</td><td><code>HAVING</code></td><td>aggregates — filters whole groups</td></tr>
  <tr><td>5</td><td><code>SELECT</code></td><td>computes output columns, defines aliases</td></tr>
  <tr><td>6</td><td><code>DISTINCT</code> → <code>ORDER BY</code> → <code>LIMIT</code></td><td>aliases OK here</td></tr>
</table>
<p>Two everyday consequences: <code>WHERE avg_grade &gt; 80</code> fails because the alias doesn't
exist yet (use <code>HAVING AVG(grade) &gt; 80</code>); and <code>WHERE</code> filters
<em>before</em> grouping (cheap, shrinks groups) while <code>HAVING</code> filters <em>after</em>
(needed for aggregate conditions). Saying "I'll filter before grouping since it doesn't need the
aggregate" is exactly the narration interviewers want.</p>

<h2>2. Joins — and the two traps that decide seniority</h2>
<p><code>INNER JOIN</code> keeps matches; <code>LEFT JOIN</code> keeps every left row, padding
missing right columns with NULL. That part everyone knows. These two traps are where candidates
separate:</p>

<p><strong>Trap 1 — filtering the right table: ON vs WHERE.</strong> With a LEFT JOIN, a condition
in <code>ON</code> restricts <em>what matches</em> (left rows survive with NULLs); the same condition
in <code>WHERE</code> runs <em>after</em> padding and throws away the NULL-padded rows — silently
turning your LEFT JOIN into an INNER JOIN:</p>
<pre><code>-- "every customer, with their 2024 orders if any"
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.year = 2024;   -- correct

... LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.year = 2024;   -- WRONG: drops customers with no 2024 orders
                       -- (their o.year is NULL, and NULL = 2024 is not true)</code></pre>

<p><strong>Trap 2 — the anti-join.</strong> "Customers who never ordered" has three idioms;
know all three and the reason one of them is booby-trapped:</p>
<pre><code>-- 1. LEFT JOIN … IS NULL          (the workhorse)
SELECT c.name FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;

-- 2. NOT EXISTS                    (clearest intent, optimizer-friendly)
SELECT c.name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

-- 3. NOT IN                        (DANGER — see the NULL section)
SELECT c.name FROM customers c
WHERE c.id NOT IN (SELECT customer_id FROM orders);</code></pre>

<h2>3. Aggregation patterns</h2>
<p>The golden rule: every SELECT column is either <strong>in the GROUP BY</strong> or
<strong>inside an aggregate</strong>. Then the two power moves:</p>
<p><strong>Conditional aggregation</strong> — counting subsets in one pass with CASE inside the
aggregate. This one pattern solves "cancellation rate", "pivot by status", "% of X":</p>
<pre><code>SELECT day,
       AVG(CASE WHEN status LIKE 'cancelled%' THEN 1.0 ELSE 0.0 END) AS cancel_rate,
       SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END)    AS revenue
FROM trips GROUP BY day;</code></pre>
<p><strong>COUNT variants</strong>: <code>COUNT(*)</code> counts rows; <code>COUNT(col)</code>
skips NULLs (that's how you count "trips with a grade"); <code>COUNT(DISTINCT col)</code>
deduplicates. And watch <strong>integer division</strong>: in SQLite and Postgres,
<code>1/2 = 0</code> — multiply by <code>1.0</code> or CAST before dividing.</p>

<h2>4. Window functions — the modern answer to "top N per group"</h2>
<p>An aggregate collapses rows; a window function computes over a group <em>while keeping every
row</em>. Anatomy: <code>FUNC(...) OVER (PARTITION BY … ORDER BY …)</code>.</p>
<table class="tbl">
  <tr><th>Function</th><th>On scores 100, 95, 95, 90</th><th>Use for</th></tr>
  <tr><td><code>ROW_NUMBER()</code></td><td>1, 2, 3, 4</td><td>dedup, pagination, pick-one-per-group</td></tr>
  <tr><td><code>RANK()</code></td><td>1, 2, 2, <strong>4</strong></td><td>competition ranking (gaps)</td></tr>
  <tr><td><code>DENSE_RANK()</code></td><td>1, 2, 2, <strong>3</strong></td><td>"Nth highest value" (no gaps)</td></tr>
  <tr><td><code>LAG(x) / LEAD(x)</code></td><td>previous / next row's x</td><td>consecutive rows, growth vs last month</td></tr>
  <tr><td><code>SUM(x) OVER (ORDER BY …)</code></td><td>running total</td><td>cumulative revenue, sweep line (Module 10!)</td></tr>
</table>
<p>The <strong>top-N-per-group recipe</strong> — rank inside a subquery, filter outside
(remember the processing order: the alias isn't visible in the same level's WHERE):</p>
<pre><code>SELECT * FROM (
  SELECT e.*, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rk
  FROM employees e
) ranked
WHERE rk &lt;= 3;</code></pre>
<p>Interview classics that fall to this: department top earners, Nth-highest salary, latest order
per customer (<code>ROW_NUMBER() = 1</code>), de-duplicate keeping newest, consecutive-login streaks
(LAG), month-over-month growth (LAG), peak concurrent bookings (running SUM over +1/−1 events —
the Module 10 sweep line translated literally into SQL).</p>

<h2>5. NULL — three-valued logic in ninety seconds</h2>
<p>Comparisons with NULL yield <em>unknown</em>, not false: <code>NULL = NULL</code> is unknown,
so <code>WHERE col = NULL</code> matches nothing — use <code>IS NULL</code>. WHERE keeps only rows
where the condition is <em>true</em>; unknown rows are dropped too.</p>
<div class="callout warn"><div class="callout-title">The NOT IN bomb</div>
<p><code>x NOT IN (1, 2, NULL)</code> expands to <code>x≠1 AND x≠2 AND x≠NULL</code> — that last
term is unknown, so the whole predicate is never true and the query returns
<strong>zero rows</strong>. One NULL in the subquery silently empties your result. This is why
the anti-join idioms prefer <code>NOT EXISTS</code> or <code>LEFT JOIN … IS NULL</code>, both
NULL-safe. If an interviewer asks "what's wrong with this query?", check NOT IN + nullable
column first.</p></div>
<p>Tools: <code>COALESCE(a, b, …)</code> = first non-NULL (default values, LEFT JOIN padding);
<code>NULLIF(a, b)</code> = NULL if equal (divide-by-zero guard:
<code>x / NULLIF(y, 0)</code>). Aggregates ignore NULLs — <code>AVG(grade)</code> averages only
graded rows, which is sometimes exactly right and sometimes a subtle bug; say which you want.</p>

<h2>6. Self-joins</h2>
<p>A table joined to itself under two aliases — the moment a row needs to talk about
<em>another row of the same table</em>:</p>
<pre><code>-- employees earning more than their manager
SELECT e.name
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary &gt; m.salary;</code></pre>
<p>Same move: pairs of events in one log, flights with matching return legs, duplicate detection
(<code>a.email = b.email AND a.id &gt; b.id</code>). With window functions available, LAG often
replaces a self-join on adjacent rows — offer both and note LAG scans once.</p>

<h2>7. Dialect notes for the live interview</h2>
<table class="tbl">
  <tr><th>Thing</th><th>SQLite (this workbench)</th><th>PostgreSQL (what Odoo runs)</th><th>MySQL</th></tr>
  <tr><td>String concat</td><td><code>||</code></td><td><code>||</code></td><td><code>CONCAT()</code></td></tr>
  <tr><td>Case-insensitive match</td><td><code>LIKE</code> (default insensitive for ASCII)</td><td><code>ILIKE</code></td><td><code>LIKE</code> (collation-dependent)</td></tr>
  <tr><td>Top-N</td><td><code>LIMIT n OFFSET m</code></td><td><code>LIMIT n OFFSET m</code></td><td><code>LIMIT m, n</code> also legal</td></tr>
  <tr><td>Auto-increment key</td><td><code>INTEGER PRIMARY KEY</code></td><td><code>GENERATED … AS IDENTITY</code> / <code>SERIAL</code></td><td><code>AUTO_INCREMENT</code></td></tr>
  <tr><td>Window functions</td><td>yes (3.25+)</td><td>yes</td><td>yes (8.0+)</td></tr>
</table>
<p>In the interview, name your dialect ("I'll write Postgres-flavored SQL") and don't sweat
punctuation differences — interviewers care about JOIN/GROUP BY/window correctness, not whether
you remembered <code>ILIKE</code>.</p>
`,
      },
      {
        kind: "mcq",
        q: "Why does SELECT name, AVG(grade) AS avg_g FROM enrollments GROUP BY name WHERE avg_g > 80 fail?",
        options: [
          { label: "Two reasons: WHERE runs before GROUP BY/SELECT (so avg_g doesn't exist yet), and WHERE can't hold aggregate conditions — this needs HAVING AVG(grade) > 80 after GROUP BY.", correct: true },
          { label: "Only the clause order is wrong — WHERE avg_g > 80 works if written before GROUP BY.", correct: false },
          { label: "AVG can't be aliased.", correct: false },
          { label: "GROUP BY must list avg_g too.", correct: false },
        ],
        explain:
          "<p>Logical processing order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. WHERE runs on ungrouped rows before any aggregate exists and before SELECT defines aliases — both facts independently doom this query. The fix is <code>HAVING AVG(grade) &gt; 80</code> (post-grouping filter). Also worth saying: conditions that don't need aggregates belong in WHERE, where they shrink the data before grouping.</p>",
      },
      {
        kind: "mcq",
        q: "orders.customer_id is nullable. What does SELECT name FROM customers WHERE id NOT IN (SELECT customer_id FROM orders) return when some order has customer_id NULL?",
        options: [
          { label: "Zero rows, always — the NULL makes every NOT IN comparison 'unknown', so no row passes.", correct: true },
          { label: "Customers without orders, as intended — NULLs are skipped by IN lists.", correct: false },
          { label: "All customers.", correct: false },
          { label: "A syntax error in strict mode.", correct: false },
        ],
        explain:
          "<p><code>id NOT IN (3, 1, NULL)</code> means <code>id≠3 AND id≠1 AND id≠NULL</code>; the last comparison is unknown, so the conjunction can never be true — WHERE drops every row and the result is empty. Fix with <code>NOT EXISTS</code> or <code>LEFT JOIN … IS NULL</code> (both NULL-safe), or filter the NULLs inside the subquery. This is the single most common 'spot the bug' SQL question.</p>",
      },
      {
        kind: "mcq",
        q: "Scores are 100, 95, 95, 90. You need 'the 3rd highest score' to be 90. Which ranking function — and what would the other one give?",
        options: [
          { label: "DENSE_RANK: ranks 1,2,2,3 make 90 the 3rd. RANK gives 1,2,2,4 — no rank 3 exists and 90 would be 'the 4th'.", correct: true },
          { label: "RANK: ties must consume ranks for '3rd highest' to be meaningful.", correct: false },
          { label: "ROW_NUMBER: 3rd row is 95, which is the 3rd highest.", correct: false },
          { label: "Any of the three — they differ only in performance.", correct: false },
        ],
        explain:
          "<p>'Nth highest <em>value</em>' means distinct values, so ties share a rank with no gaps: DENSE_RANK. RANK leaves gaps after ties (1,2,2,4) — fine for competition standings, wrong here. ROW_NUMBER arbitrarily orders the tied 95s and calls one of them '3rd', which answers a different question ('3rd row'). Expect the follow-up 'what if there is no 3rd?' — return NULL, which the subquery form does naturally.</p>",
      },
    ],
  },

  M13: {
    id: "M13",
    title: "Module 13 — Database Design & Indexes",
    subtitle: "Schema walk-throughs, normalization, clustered vs non-clustered",
    practiceSet: "PS13",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 13 — Database Design &amp; Indexes</h1>
  <p>The database task in the final interview is often a <em>design conversation</em>: "how would
  you model X?" — followed by "and how would you make it fast?". Interview reports from this exact
  process mention <strong>clustered vs non-clustered indexes</strong> by name. This module gives you
  a walk-through recipe for live schema design, the normalization ladder, and an indexing section
  deep enough to answer follow-ups.</p>
</div>

<h2>1. The schema-design walk-through (your M2 template, database edition)</h2>
<ol>
  <li><strong>Nouns → entities.</strong> Read the prompt, list the nouns: customer, product, order…
  Each becomes a candidate table.</li>
  <li><strong>Verbs → relationships.</strong> "A customer places orders" (1:N), "an order contains
  products" (N:M). State each cardinality out loud — this is where design bugs are born.</li>
  <li><strong>Tables + keys.</strong> Surrogate PK per entity; FK on the many side of every 1:N;
  junction table for every N:M.</li>
  <li><strong>Constraints as documentation.</strong> NOT NULL, UNIQUE, CHECK — every rule the data
  must obey, encoded where it can't be forgotten.</li>
  <li><strong>Indexes from the workload.</strong> Ask "what are the hot queries?" — then index for
  them. Never index speculatively.</li>
</ol>
<p>Narrating these five steps in order <em>is</em> the interview. The follow-ups ("what if a product's
price changes after purchase?") test whether your model survives contact with reality — the standard
answer is to <strong>snapshot the price into the order line</strong>: rows record history; catalogs
record the present.</p>

<h2>2. Normalization — the ladder, one example</h2>
<p>Start from the classic mess: one <code>orders</code> table with
<code>customer_name, customer_email, product1, product2, product3, …</code></p>
<table class="tbl">
  <tr><th>Form</th><th>Rule</th><th>What it kills</th></tr>
  <tr><td><strong>1NF</strong></td><td>atomic values, no repeating groups</td><td>the product1..3 columns → one row per order line</td></tr>
  <tr><td><strong>2NF</strong></td><td>no partial dependency on part of a composite key</td><td>product_name stored on (order_id, product_id) rows → move to products</td></tr>
  <tr><td><strong>3NF</strong></td><td>no transitive dependency on non-key columns</td><td>customer_email riding along with customer_name → move to customers</td></tr>
</table>
<p>Practical summary that interviews reward: <em>"every non-key column depends on the key, the whole
key, and nothing but the key."</em> Then the senior move — knowing when to <strong>stop</strong>:
denormalize deliberately for read-heavy paths (a cached <code>order_total</code>, a snapshotted
price), and say what keeps the copy honest (trigger, application logic, or acceptance that it's a
snapshot by design).</p>

<h2>3. Keys, constraints, and the junction table</h2>
<ul>
  <li><strong>Surrogate vs natural keys</strong>: an auto-increment <code>id</code> never changes;
  emails and usernames do. Use surrogate PKs, put UNIQUE on the natural candidate.</li>
  <li><strong>1:N</strong> — FK lives on the <em>many</em> side (<code>orders.customer_id</code>).</li>
  <li><strong>N:M</strong> — junction table with two FKs and
  <code>UNIQUE(a_id, b_id)</code> (or that pair as composite PK). Junction tables can carry their
  own data: <code>enrollments.grade</code>, <code>order_items.quantity</code>.</li>
  <li><strong>1:1</strong> — rare; used to split a huge/optional/secret column group
  (<code>user_profiles</code>) off a hot table. Be ready to justify it.</li>
  <li><strong>Self-reference</strong> — <code>employees.manager_id REFERENCES employees(id)</code>;
  same for category trees. (Traversing them → recursive CTEs; mention, don't derail.)</li>
  <li><strong>FK actions</strong> — <code>ON DELETE RESTRICT</code> (default-safe),
  <code>CASCADE</code> (children die with the parent — order_items),
  <code>SET NULL</code> (orphan but keep — orders whose clerk left).</li>
</ul>

<h2>4. Indexes — the section the Odoo interview actually asks about</h2>
<p>A B-tree index is a sorted structure over one or more columns giving O(log n) lookups and sorted
scans, at the cost of extra writes and storage. Everything else is detail on top:</p>

<table class="tbl">
  <tr><th></th><th>Clustered index</th><th>Non-clustered (secondary) index</th></tr>
  <tr><td>What it is</td><td>the table itself, physically ordered by the key</td><td>a separate structure of key → row pointer</td></tr>
  <tr><td>How many per table</td><td>exactly one (data can only have one physical order)</td><td>many</td></tr>
  <tr><td>Lookup</td><td>find the key, the row is <em>right there</em></td><td>find the key, then a second hop to fetch the row</td></tr>
  <tr><td>Great at</td><td>range scans on the key (<code>BETWEEN</code>, newest-first)</td><td>point lookups on non-key columns</td></tr>
  <tr><td>Who does what</td><td>MySQL/InnoDB: PK is always clustered. SQL Server: by choice.</td><td>everything else you create</td></tr>
</table>
<div class="callout tip"><div class="callout-title">The Postgres nuance (Odoo runs Postgres)</div>
<p>Postgres technically has <em>no</em> clustered index — all its tables are heaps and all indexes
are secondary; <code>CLUSTER</code> can sort a table once but it doesn't stay sorted. If asked the
clustered-vs-non-clustered question, give the standard answer (left column above), then add this
nuance — it turns a memorized answer into an expert one.</p></div>

<p><strong>Composite indexes and the leftmost-prefix rule.</strong> An index on
<code>(customer_id, created_at)</code> serves <code>WHERE customer_id = ?</code>, and
<code>WHERE customer_id = ? AND created_at &gt; ?</code>, and even
<code>WHERE customer_id = ? ORDER BY created_at DESC</code> — but does <em>nothing</em> for
<code>WHERE created_at &gt; ?</code> alone: the sort order is by customer first, so dates are
scattered. Order columns <strong>equality-filtered first, range/sort last</strong>.</p>

<p><strong>Covering index</strong>: if the index contains every column a query touches, the table
is never visited at all ("index-only scan"). <code>(customer_id, created_at, total)</code> answers
"recent order totals per customer" straight from the index.</p>

<p><strong>When indexes hurt</strong> — the counter-questions interviewers love:</p>
<ul>
  <li>Every INSERT/UPDATE/DELETE maintains every index — write-heavy tables want few.</li>
  <li>Low-selectivity columns (<code>is_active</code>, gender) barely help; the optimizer may
  ignore them and scan anyway.</li>
  <li>Functions on the indexed column disable it: <code>WHERE YEAR(created_at) = 2024</code> can't
  use an index on <code>created_at</code> — rewrite as a range
  (<code>created_at &gt;= '2024-01-01' AND created_at &lt; '2025-01-01'</code>).</li>
  <li>Leading-wildcard <code>LIKE '%foo'</code> can't use a B-tree (nothing to descend by).</li>
</ul>
<p>And the closing move for any performance question: <em>"I'd check with EXPLAIN / EXPLAIN ANALYZE
whether the index is actually used before and after."</em> Measuring beats guessing.</p>

<h2>5. Transactions — ACID in interview form</h2>
<table class="tbl">
  <tr><th>Letter</th><th>Meaning</th><th>One-liner</th></tr>
  <tr><td>A — Atomicity</td><td>all or nothing</td><td>transfer debits and credits together or not at all</td></tr>
  <tr><td>C — Consistency</td><td>constraints hold before and after</td><td>no FK ever dangles mid-commit</td></tr>
  <tr><td>I — Isolation</td><td>concurrent transactions don't see each other's partial work</td><td>levels below</td></tr>
  <tr><td>D — Durability</td><td>committed = survives a crash</td><td>write-ahead log</td></tr>
</table>
<p>Isolation levels, weakest to strongest: <strong>read uncommitted</strong> (dirty reads) →
<strong>read committed</strong> (Postgres default) → <strong>repeatable read</strong> (no
re-reading surprises) → <strong>serializable</strong> (as if one-at-a-time; pays in retries).
The exam-favorite scenario: two transactions read a stock quantity of 1 and both decrement —
prevent it with <code>SELECT … FOR UPDATE</code> (row lock), an atomic
<code>UPDATE stock SET qty = qty - 1 WHERE qty &gt;= 1</code> (check the affected-row count),
or a CHECK constraint as the last line of defense.</p>

<h2>6. The ORM angle — N+1, because Odoo will care</h2>
<p>Odoo is a Postgres-backed ORM framework, so one ORM question is fair game, and it's almost
always <strong>N+1</strong>: fetching 100 orders, then lazily fetching each order's customer —
1 + 100 queries where 1 join (or 2 batched queries) would do. The fixes, in any ORM's vocabulary:
eager-load the relation (JOIN up front), or batch-fetch
(<code>WHERE customer_id IN (…all 100 ids…)</code>). The symptom to name: "page is slow and the
query log shows hundreds of identical queries with different ids."</p>
`,
      },
      {
        kind: "mcq",
        q: "What is the difference between a clustered and a non-clustered index?",
        options: [
          { label: "Clustered = the table itself stored in key order (one per table, rows live in the leaves); non-clustered = a separate sorted structure pointing back at rows (many allowed, one extra hop per lookup).", correct: true },
          { label: "Clustered indexes are for numeric columns; non-clustered for text.", correct: false },
          { label: "They're synonyms — 'clustered' is the SQL Server name for a B-tree.", correct: false },
          { label: "Clustered indexes exist only in distributed (clustered) databases.", correct: false },
        ],
        explain:
          "<p>This exact question appears in Odoo final-round reports. Full-marks answer: the clustered index <em>is</em> the physical row order — hence exactly one, hence unbeatable range scans on its key; non-clustered indexes are side structures whose leaves hold pointers (or PK values), so lookups pay a second hop. Bonus point: in MySQL/InnoDB the PK is automatically clustered; in Postgres (Odoo's database) all tables are heaps — every index is secondary, and CLUSTER is a one-time sort that doesn't stick.</p>",
      },
      {
        kind: "mcq",
        q: "You have one composite index on orders(customer_id, created_at). Which query can NOT use it?",
        options: [
          { label: "SELECT * FROM orders WHERE created_at > '2024-01-01'", correct: true },
          { label: "SELECT * FROM orders WHERE customer_id = 7 AND created_at > '2024-01-01'", correct: false },
          { label: "SELECT * FROM orders WHERE customer_id = 7 ORDER BY created_at DESC", correct: false },
          { label: "SELECT * FROM orders WHERE customer_id = 7", correct: false },
        ],
        explain:
          "<p>Leftmost-prefix rule: the index is sorted by customer_id first, created_at second — dates are only ordered <em>within</em> one customer. A date-only predicate faces scattered values and falls back to a full scan (or needs its own index on created_at). The other three all pin customer_id first, so the index serves the filter — and in the ORDER BY case, the sort comes free. Column-order heuristic: equality filters first, range/sort columns last.</p>",
      },
      {
        kind: "mcq",
        q: "An orders table stores customer_email alongside customer_id. A customer changes email; now old orders show the old address. Which normal form does the design violate, and what's the fix?",
        options: [
          { label: "3NF — customer_email transitively depends on customer_id, not on the order key; keep it only in customers and join when needed.", correct: true },
          { label: "1NF — emails are not atomic values.", correct: false },
          { label: "2NF — email depends on part of a composite key.", correct: false },
          { label: "No violation — it's a legitimate snapshot, like a price on an order line.", correct: false },
        ],
        explain:
          "<p>order → customer_id → customer_email is a transitive dependency of a non-key attribute — the textbook 3NF violation, and the update anomaly in the question is exactly the damage it causes. The snapshot defense (option 4) is real but applies to values that are <em>meant</em> to be frozen at transaction time (unit price, shipping address). A contact email is meant to be current — so it belongs in customers only. Being able to argue which columns are snapshots and which are references IS the design interview.</p>",
      },
    ],
  },

  M14: {
    id: "M14",
    title: "Module 14 — OOP & Design Patterns",
    subtitle: "Four pillars, SOLID, composition-first, patterns that matter live",
    practiceSet: "PS14",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 14 — OOP &amp; Design Patterns</h1>
  <p>OOP questions show up two ways in a live interview: as <strong>vocabulary checks</strong>
  ("what's polymorphism?", "composition vs inheritance?") and as <strong>structure judgment</strong>
  while you code ("should this be a class?"). Your interviewer lives in Odoo — one of the largest
  OOP Python codebases in the wild — so clean object thinking lands well. This module compresses
  the whole topic to what's askable in three hours.</p>
</div>

<h2>1. The four pillars — definitions that survive follow-ups</h2>
<table class="tbl">
  <tr><th>Pillar</th><th>One sentence</th><th>Python spelling</th></tr>
  <tr><td><strong>Encapsulation</strong></td><td>state and the code that guards it live together; outsiders use the interface, not the internals</td><td><code>_single_underscore</code> convention, <code>@property</code> to gate access</td></tr>
  <tr><td><strong>Abstraction</strong></td><td>expose <em>what</em> it does, hide <em>how</em></td><td><code>abc.ABC</code> / duck-typed interfaces</td></tr>
  <tr><td><strong>Inheritance</strong></td><td>a subclass <em>is a</em> special case of its parent and can stand in for it</td><td><code>class Dog(Animal)</code>, <code>super()</code></td></tr>
  <tr><td><strong>Polymorphism</strong></td><td>one call site, many behaviors — the object decides</td><td>duck typing: anything with <code>.speak()</code> works</td></tr>
</table>
<p>The Python twist worth saying: Python's polymorphism is <strong>duck typing</strong> — no
interface declaration needed, the method lookup at runtime IS the dispatch. <code>len(x)</code>
works on strings, lists and your class with <code>__len__</code>; that's the same idea as dunder
protocols. If you mention <code>@property</code>, know its point: change an attribute into a
computed value <em>without breaking callers</em> — encapsulation retrofitted.</p>

<h2>2. Composition vs inheritance — the answer they're fishing for</h2>
<p><strong>Default to composition; inherit only for true is-a with substitutability.</strong>
Inheritance is the tightest coupling in OOP: the child inherits every parent decision, forever,
including future ones. Composition (<em>has-a</em>) picks exactly the behavior it needs and can
swap it at runtime.</p>
<pre><code># inheritance: a Stack IS-A list? No — it inherits insert(), and now
# users can violate LIFO. The relationship lies.
class Stack(list): ...          # broken abstraction

# composition: a Stack HAS-A list it delegates to. Interface stays honest.
class Stack:
    def __init__(self):  self._items = []
    def push(self, x):   self._items.append(x)
    def pop(self):       return self._items.pop()</code></pre>
<p>The test for legitimate inheritance is <strong>Liskov substitution</strong> (the L of SOLID):
anywhere the parent works, the child must work — same promises, no surprises. The classic
counterexample: <code>Square(Rectangle)</code>. Setting a rectangle's width leaves height alone;
a square can't honor that — code that resizes rectangles breaks when handed a square. "Is-a" in
English is not "is-a" in behavior.</p>

<h2>3. SOLID — one line each, plus the smell that violates it</h2>
<table class="tbl">
  <tr><th></th><th>Principle</th><th>Violation smell</th></tr>
  <tr><td><strong>S</strong>ingle responsibility</td><td>one class, one reason to change</td><td>a <code>ReportManager</code> that queries, formats, and emails</td></tr>
  <tr><td><strong>O</strong>pen/closed</td><td>extend behavior without editing working code</td><td>an ever-growing <code>if type == …</code> chain wherever a new case lands</td></tr>
  <tr><td><strong>L</strong>iskov substitution</td><td>subclasses keep the parent's promises</td><td>an override that raises <code>NotImplementedError</code> or ignores arguments</td></tr>
  <tr><td><strong>I</strong>nterface segregation</td><td>many small interfaces over one fat one</td><td>implementing 8 no-op methods to satisfy one</td></tr>
  <tr><td><strong>D</strong>ependency inversion</td><td>depend on abstractions; inject them</td><td><code>PaymentService()</code> constructed inside the class you want to test</td></tr>
</table>
<p>Don't recite — <em>apply</em>. When an interviewer shows you a god-class and asks "thoughts?",
the winning shape is: name the responsibilities you see, split them, and show how the pieces get
injected. That's S and D in action, no acronyms required.</p>

<h2>4. Python object toolkit — the parts interviews touch</h2>
<ul>
  <li><strong>Dunder protocols</strong>: <code>__init__</code>, <code>__repr__</code> (debuggability!),
  <code>__eq__</code>/<code>__hash__</code> (dict keys), <code>__len__</code>/<code>__iter__</code>
  (make collections feel native), <code>__enter__</code>/<code>__exit__</code> (context managers).</li>
  <li><strong><code>@dataclass</code></strong>: kills <code>__init__</code>/<code>__repr__</code>/<code>__eq__</code>
  boilerplate for record-like classes — reach for it live, it saves minutes.</li>
  <li><strong><code>@classmethod</code></strong> = alternative constructors
  (<code>Date.from_iso(s)</code>); <strong><code>@staticmethod</code></strong> = namespaced helper.</li>
  <li><strong>ABC vs Protocol</strong>: <code>abc.ABC</code> enforces at instantiation;
  <code>typing.Protocol</code> is structural — duck typing that type-checkers verify.</li>
  <li><strong>MRO</strong>: multiple inheritance resolves left-to-right via C3 linearization;
  <code>Cls.__mro__</code> shows the order, <code>super()</code> follows it (it does NOT simply
  mean "my parent" — in a diamond it means "next in line"). Worth thirty seconds of fluency:
  Odoo's model system is built on cooperative multiple inheritance and mixins.</li>
</ul>

<h2>5. The five patterns that actually come up</h2>
<table class="tbl">
  <tr><th>Pattern</th><th>Problem it solves</th><th>Pythonic shape</th></tr>
  <tr><td><strong>Strategy</strong></td><td>swap an algorithm at runtime, kill the if-chain</td><td>pass a function/object in: <code>sorted(key=…)</code> IS strategy</td></tr>
  <tr><td><strong>Observer</strong></td><td>N parties react to an event without the source knowing them</td><td>list of callbacks; <code>subscribe(fn)</code> / <code>notify()</code></td></tr>
  <tr><td><strong>Factory</strong></td><td>centralize "which class do I build for this input?"</td><td>dict of constructors: <code>HANDLERS[kind](payload)</code></td></tr>
  <tr><td><strong>Decorator</strong></td><td>bolt behavior around a callable without touching it</td><td>literally <code>@decorator</code> — closures wrapping functions</td></tr>
  <tr><td><strong>Adapter</strong></td><td>make an interface you have fit an interface you need</td><td>thin wrapper class translating method calls</td></tr>
</table>
<p>Two honest notes that score points: <strong>Singleton</strong> in Python is usually just a
module-level instance (modules are singletons already — say that, don't write
<code>__new__</code> gymnastics); and half the classic GoF patterns exist to work around static
typing that Python doesn't have — first-class functions ARE strategy/command. Knowing when a
pattern is unnecessary is the senior half of knowing patterns.</p>

<h2>6. The OOD mini-interview: "design a parking lot"</h2>
<p>Object-oriented design questions ("model a parking lot / library / vending machine") are the
schema walk-through of Module 13 wearing classes instead of tables. Same recipe, adapted:</p>
<ol>
  <li><strong>Nouns → classes</strong>, <strong>verbs → methods</strong>, exactly like entities/relationships.</li>
  <li><strong>One responsibility per class</strong> — the lot assigns spots, a spot knows its size
  and occupancy, a ticket records one stay. Resist the god-object.</li>
  <li><strong>Where behavior varies, make it pluggable</strong> — pricing rules and spot-matching
  policies are Strategy objects, so requirement changes don't reopen working classes (open/closed).</li>
  <li><strong>State the invariants</strong> — a spot holds ≤ 1 vehicle; a ticket is closed exactly
  once — and put each check inside the class that owns the state (encapsulation, for real).</li>
  <li><strong>Walk one scenario end-to-end</strong> out loud: car arrives → lot finds a spot →
  ticket opens → car leaves → pricing strategy computes the fee. If the walk is smooth, the
  design is probably right.</li>
</ol>
`,
      },
      {
        kind: "mcq",
        q: "class Square(Rectangle) overrides set_width to also change height. Callers that resize rectangles now break on squares. Which principle is violated, and what's the accepted fix?",
        options: [
          { label: "Liskov substitution — Square can't keep Rectangle's promises. Don't inherit: make them siblings (both Shapes) or use composition; 'is-a' in English isn't 'is-a' in behavior.", correct: true },
          { label: "Single responsibility — Square does two things (width and height).", correct: false },
          { label: "Nothing is violated; callers should type-check before resizing.", correct: false },
          { label: "Open/closed — Rectangle should have been final.", correct: false },
        ],
        explain:
          "<p>LSP is about behavioral substitutability: every place a Rectangle works, a Square must work with the same guarantees. Rectangle promises 'set_width leaves height alone'; Square mathematically cannot honor that, so it doesn't belong under Rectangle no matter how natural the English sounds. Requiring callers to type-check (option 3) is the tell-tale symptom OF an LSP violation, not a fix. The escape hatches: sibling classes under a common abstraction, composition, or immutability (a resized square returns a new Rectangle).</p>",
      },
      {
        kind: "mcq",
        q: "A payment function has grown an if/elif chain over 'card', 'paypal', 'crypto', and every new method edits it again. Which pattern is the textbook cure, and what does it look like in Python?",
        options: [
          { label: "Strategy (often reached via a Factory dict): each method becomes an object/function with a common interface, selected by lookup — new methods are added, existing code untouched (open/closed).", correct: true },
          { label: "Singleton: one PaymentManager instance guarantees consistency.", correct: false },
          { label: "Observer: emit a 'payment' event and let handlers race to claim it.", correct: false },
          { label: "Deep inheritance: CryptoPayment(PaypalPayment(CardPayment)).", correct: false },
        ],
        explain:
          "<p>The growing if-chain is THE open/closed violation smell, and Strategy is its cure: <code>PROCESSORS = {'card': CardProcessor(), 'paypal': PaypalProcessor(), ...}</code>, then <code>PROCESSORS[method].pay(amount)</code>. Adding crypto = adding one entry and one class; nothing that already works gets reopened. In Python the strategies can be plain functions — first-class functions are the lightweight Strategy. Observer inverts the wrong relationship (exactly one processor must handle a payment), and the inheritance chain encodes no real is-a at all.</p>",
      },
      {
        kind: "mcq",
        q: "In Python multiple inheritance — class C(A, B) where both parents define greet() and call super().greet() — what does super() inside A refer to when you call C().greet()?",
        options: [
          { label: "B — super() follows C's MRO (C, A, B, object), meaning 'next in line after A', not 'A's parent'.", correct: true },
          { label: "object — super() always means the class's direct base.", correct: false },
          { label: "A itself, recursively.", correct: false },
          { label: "It raises: two parents with the same method is an error.", correct: false },
        ],
        explain:
          "<p>super() is MRO-relative, not parent-relative: it dispatches to the next class in the <em>instance's</em> linearization, which for C(A, B) is C → A → B → object. So A's super().greet() lands on B — a class A has never heard of. That's 'cooperative multiple inheritance', and it's exactly how mixin stacks compose behavior. Worth real fluency here: Odoo models are built from mixin chains, so your interviewer uses this machinery daily even though the question is general Python.</p>",
      },
    ],
  },

  M15: {
    id: "M15",
    title: "Module 15 — System Design, Application-Level",
    subtitle: "A 4-step framework, core building blocks, the classic questions",
    practiceSet: "PS15",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 15 — System Design, Application-Level</h1>
  <p>At this interview's level, "system design" rarely means planetary-scale distributed systems.
  It means: <strong>can you take a product sentence — "build a URL shortener" — and produce a data
  model, an API, and defensible scaling decisions, out loud?</strong> That's Modules 13's schema
  skills plus a vocabulary of building blocks. The practice set is discussion-style: think first,
  then reveal.</p>
</div>

<h2>1. The 4-step framework (works for every question)</h2>
<ol>
  <li><strong>Requirements, 3 minutes.</strong> Functional: what must it do — list 3–5 features and
  <em>cut scope out loud</em> ("I'll skip auth"). Non-functional: reads-vs-writes ratio, rough
  scale, latency needs, consistency needs. Ask for numbers; if none come, assume some and say them.</li>
  <li><strong>API sketch, 2 minutes.</strong> A handful of endpoints with verbs and payloads.
  This forces the feature list to get concrete and exposes the entities.</li>
  <li><strong>Data model, 10 minutes.</strong> Module 13's walk-through: entities, keys,
  constraints, indexes for the hot queries. At this interview's level, <em>this is the part that
  gets graded hardest</em>.</li>
  <li><strong>Deep dives, rest of the time.</strong> Follow the interviewer's interest: caching,
  the write path under concurrency, async work, what breaks at 10× traffic. One layer at a time,
  only when a number justifies it.</li>
</ol>
<div class="callout tip"><div class="callout-title">The golden habit</div>
<p>Every scaling decision gets a <em>because</em> with a number in it: "reads are 100× writes,
so a cache earns its complexity" — not "I'd add Redis and Kafka" unprompted. Naming technologies
without a reason is the fastest way to look junior; adding boxes only when a bottleneck demands
them is the fastest way to look senior.</p></div>

<h2>2. Numbers worth knowing (rough is fine)</h2>
<table class="tbl">
  <tr><th>Fact</th><th>Ballpark</th><th>What it buys you</th></tr>
  <tr><td>Postgres point lookup (indexed, cached)</td><td>&lt; 1 ms</td><td>most apps never need more than a good schema</td></tr>
  <tr><td>One beefy SQL box handles</td><td>~thousands of simple QPS</td><td>"do we even need to scale?" — usually no</td></tr>
  <tr><td>Redis / memcached GET</td><td>~0.1 ms, 100k+ ops/s</td><td>read-path relief</td></tr>
  <tr><td>Seconds per day</td><td>~86 400 (≈10⁵)</td><td>1M requests/day ≈ <strong>12 QPS</strong> — tiny!</td></tr>
  <tr><td>UUID/row storage</td><td>~100 B–1 KB per row</td><td>100M rows ≈ tens of GB — one disk</td></tr>
</table>
<p>That third row is the interview's secret weapon: candidates hear "one million users" and panic
into microservices; 1M requests/day is 12 per second — a single Postgres with the right indexes
naps through it. Doing that division out loud resets the whole conversation.</p>

<h2>3. Building blocks — and the moment each one enters</h2>
<table class="tbl">
  <tr><th>Block</th><th>Enters when…</th><th>The follow-up you must survive</th></tr>
  <tr><td><strong>Stateless app servers + load balancer</strong></td><td>one box isn't enough / you need zero-downtime deploys</td><td>where did sessions go? (signed cookies / shared store)</td></tr>
  <tr><td><strong>Cache (cache-aside)</strong></td><td>read-heavy + tolerable staleness</td><td>invalidation: TTL vs delete-on-write; stampede (lock or jitter)</td></tr>
  <tr><td><strong>Read replicas</strong></td><td>reads dwarf writes and cache can't hold the working set</td><td>replication lag — read-your-own-writes goes to primary</td></tr>
  <tr><td><strong>Queue + workers</strong></td><td>anything slow/flaky that the user needn't wait for (email, thumbnails, webhooks)</td><td>at-least-once delivery ⇒ consumers must be <strong>idempotent</strong></td></tr>
  <tr><td><strong>Object storage + CDN</strong></td><td>files/images — they never belong in the DB</td><td>DB keeps the metadata + key; presigned URLs for upload</td></tr>
  <tr><td><strong>Sharding</strong></td><td>last resort: one primary truly can't take the writes</td><td>shard key choice; cross-shard queries die — say you'd avoid this as long as possible</td></tr>
</table>

<h2>4. Patterns that answer 80% of follow-ups</h2>
<ul>
  <li><strong>Cache-aside</strong>: read → miss → fetch DB → fill cache. Write → update DB →
  <em>delete</em> (don't update) the cache key. Simple, and wrong only briefly.</li>
  <li><strong>Idempotency keys</strong>: client sends a unique key per operation; server stores
  processed keys (UNIQUE constraint!) so retries and double-clicks don't double-charge. This is
  Module 13's oversell gate generalized to APIs.</li>
  <li><strong>Cursor pagination</strong> over OFFSET: <code>WHERE (created_at, id) &lt; (…last seen…)
  ORDER BY … LIMIT 20</code> — OFFSET 100000 scans 100 000 rows to throw them away, and pages drift
  when rows are inserted mid-scroll. The composite index from Module 13 serves the cursor for free.</li>
  <li><strong>Fanout, push vs pull</strong> (feeds/notifications): push = write into every
  follower's inbox at post time (fast reads, celebrity problem); pull = assemble at read time
  (cheap writes, slow reads). Hybrid: push for normal users, pull for the million-follower
  accounts.</li>
  <li><strong>Outbox pattern</strong> (mention-level): write the event into the DB in the same
  transaction as the data, a relay publishes it — solves "DB committed but queue publish failed".</li>
</ul>

<h2>5. Two worked miniatures (the shape of a good answer)</h2>
<p><strong>Rate limiter — "100 requests/minute per API key."</strong> Algorithm choice: fixed
window (counter per key per minute — 2× burst at boundaries), sliding window approximation
(weighted two windows — fixes it cheaply), or token bucket (rate + burst as first-class knobs —
usually the answer). State lives in Redis, not app memory (servers are stateless!):
<code>INCR key; EXPIRE 60</code> — and the INCR must be atomic or two servers race. Degrade
decision if Redis dies: fail-open (availability) vs fail-closed (protection) — pick per endpoint,
out loud.</p>
<p><strong>URL shortener.</strong> The data model is one table: <code>(id, code UNIQUE, target,
owner, created_at, hits)</code>. Code generation: base62-encode an auto-increment id (no
collisions, but guessable/sequential) vs random 7-char (check-and-retry on the UNIQUE index).
Redirect path is 99.9% of traffic and pure cache-aside; counting hits synchronously would make
every redirect a write — batch it through a queue or an <code>INCR</code> flushed periodically.
Every decision traces back to a read/write-ratio sentence — that's the pattern to copy.</p>

<h2>6. Red flags to avoid (interviewer's checklist)</h2>
<ul>
  <li>Naming technologies before requirements ("we'll need Kafka" — for 12 QPS?).</li>
  <li>Skipping the data model to draw boxes — at this level the schema IS the interview.</li>
  <li>No numbers anywhere — every choice should survive "why?" with arithmetic.</li>
  <li>Ignoring failure: what happens on retry, on cache death, on double-submit?</li>
  <li>Silence. The framework exists so you always know what you're doing <em>next</em> —
  requirements → API → data model → deep dives, narrated (Module 2 rules apply here doubly).</li>
</ul>
`,
      },
      {
        kind: "mcq",
        q: "A product page gets 1M views/day; its data changes a few times daily. The DB does a 5-way JOIN per view and CPU is climbing. First move?",
        options: [
          { label: "Cache-aside on the rendered product data with a modest TTL + delete-on-write — 1M/day is ~12 QPS of highly repetitive, staleness-tolerant reads: the textbook cache case.", correct: true },
          { label: "Shard the database by product id.", correct: false },
          { label: "Move to microservices so the product service scales independently.", correct: false },
          { label: "Denormalize the 5 joined tables into one wide table.", correct: false },
        ],
        explain:
          "<p>Run the framework's arithmetic first: 12 QPS of reads on data that changes 'a few times daily' — read-heavy, staleness-tolerant, repetitive. Cache-aside removes ~all of the JOIN load with one moving part, and the invalidation story is easy (delete the key on the rare write). Sharding is the last resort for write throughput (this is a read problem); microservices don't reduce a single query's cost at all; denormalizing might be step two, but it rewrites the schema and takes on drift risk before the cheap option was tried. Order of escalation is what's being graded.</p>",
      },
      {
        kind: "mcq",
        q: "Your queue delivers messages at-least-once, and the 'send welcome email' consumer sometimes gets the same message twice. What's the correct fix?",
        options: [
          { label: "Make the consumer idempotent — record a processed marker (e.g., INSERT the message id under a UNIQUE constraint in the same transaction as the work) and skip duplicates.", correct: true },
          { label: "Switch the queue to exactly-once delivery mode.", correct: false },
          { label: "Have the producer wait and only publish once the consumer confirms.", correct: false },
          { label: "Deduplicate by having the consumer sleep briefly and check for siblings.", correct: false },
        ],
        explain:
          "<p>At-least-once is the honest guarantee most queues give — duplicates are a <em>feature</em> of surviving crashes (the consumer died after doing the work but before acking). True exactly-once <em>delivery</em> across process boundaries isn't a checkbox; what systems actually achieve is exactly-once <em>effect</em>: idempotent consumers. The UNIQUE-constraint marker makes the dedup atomic with the work itself — Module 13's constraint thinking applied to messaging. Producer-side waiting reinvents the same race one hop earlier, and sleeping is a race with extra steps.</p>",
      },
      {
        kind: "mcq",
        q: "Page 5000 of an activity feed (OFFSET 100000 LIMIT 20) takes seconds, and users see duplicate rows as new activity arrives. What does cursor pagination change?",
        options: [
          { label: "The query becomes WHERE (created_at, id) < (last seen) ORDER BY ... LIMIT 20 — the composite index seeks straight to the position (no scan-and-discard), and the cursor is stable when new rows are inserted above.", correct: true },
          { label: "It caches each page so OFFSET is only computed once.", correct: false },
          { label: "It's purely cosmetic — same query plan, nicer URLs.", correct: false },
          { label: "It loads everything into the app and slices there.", correct: false },
        ],
        explain:
          "<p>OFFSET N walks and discards N index entries — cost grows with depth, and because new inserts shift every subsequent page, scrolling users see repeats. A cursor pins the position to <em>values</em> ('everything older than what I last saw'), which an index on (created_at DESC, id DESC) answers with a direct seek: constant cost at any depth, and inserts above the cursor can't shift it. The id in the cursor breaks created_at ties — the same composite-index and tie-break thinking as Modules 13 and 10. Trade-off to volunteer: no 'jump to page 37', which feeds don't need anyway.</p>",
      },
    ],
  },

};

window.MODULE_ORDER = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12", "M13", "M14", "M15"];
