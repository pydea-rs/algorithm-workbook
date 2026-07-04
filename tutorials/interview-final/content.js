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

};

window.MODULE_ORDER = ["M1", "M2", "M3", "M4", "M5"];
