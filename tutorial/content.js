/* ============================================================
   content.js — Tutorial module content (8 modules).
   Each module is an array of "blocks":
     {kind:"html", html:"..."}                  — rich prose
     {kind:"mcq", q, options:[{label,correct}], explain} — concept check
   Order matters: blocks render top-to-bottom.
============================================================ */

window.MODULES = {

  // =============================================================
  // MODULE 1 — Foundations
  // =============================================================
  M1: {
    id: "M1",
    title: "Module 1 — Foundations",
    subtitle: "Big-O, ADTs, the R.A.P.I.D. framework",
    practiceSet: "PS1",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Welcome to the Odoo Coderbyte Masterclass</h1>
  <p>This interactive guide combines the full Masterclass written prep with a runnable Python 3
  workbench. Tutorial first; questions held back for Practice Sets between modules; everything
  you need to walk into the assessment confident.</p>
</div>

<h2>How this works</h2>
<p>Each module covers a connected family of topics. You read, try the concept-check questions
inline, then face a <strong>Practice Set</strong> that mixes questions from THIS module without
revealing which subsection each came from. The <strong>Final Exam</strong> at the end draws from
a separate held-back pool, so it tests the breadth of what you've learned, not what you just read.</p>

<div class="callout tip">
  <div class="callout-title">Study method</div>
  Read the concept first. Cover the code with your hand. Try to write it yourself. Open the
  runner. Make tests pass. Only then reveal the official answer to compare. Memory of a solved
  problem sticks; memory of a read solution evaporates.
</div>

<h2>The assessment in one paragraph</h2>
<p>Coderbyte is a browser-based test platform. The Odoo first-step contains <strong>2–3 coding
problems</strong> in 60 minutes: typically <em>one</em> string/DSA problem, <em>one</em> SQL
problem, and <em>optionally</em> a graph/stack problem. Difficulty mix is roughly 67% Easy and
33% Medium. No Odoo-specific knowledge (ORM, XML, framework) is required.</p>

<div class="callout warn">
  <div class="callout-title">What the proctor sees</div>
  Window blur, tab switches, clipboard events, fullscreen exits, and webcam anomalies are all
  recorded. Close everything. Use one monitor. Focus.
</div>

<h2>The R.A.P.I.D. framework</h2>
<p>Don't code immediately. Spend 30–90 seconds on each new problem walking through:</p>
<ul>
  <li><strong>R</strong>ead carefully. Identify inputs, outputs, constraints.</li>
  <li><strong>A</strong>nalyze examples. Trace small cases by hand.</li>
  <li><strong>P</strong>attern match. Two-pointer? Stack? BFS? Hash map?</li>
  <li><strong>I</strong>mplement a brute force if stuck. A working O(n²) beats a broken O(n).</li>
  <li><strong>D</strong>ebug edge cases: empty input, single element, all-same, maximum size.</li>
</ul>

<h2>Time allocation for 1 hour</h2>
<table class="tbl">
  <tr><th>Window</th><th>Goal</th></tr>
  <tr><td>0–5 min</td><td>Read all problems. Pick the easiest.</td></tr>
  <tr><td>5–25 min</td><td>Solve Problem 1 completely.</td></tr>
  <tr><td>25–45 min</td><td>Solve Problem 2.</td></tr>
  <tr><td>45–55 min</td><td>Problem 3 or optimize/review.</td></tr>
  <tr><td>55–60 min</td><td>Final sanity checks.</td></tr>
</table>

<h2>Big-O — the only "math" you really need</h2>
<p>Big-O describes how resource usage grows as input size <code>n</code> grows. You're not memorizing
formulae; you're answering: <em>"will this finish in 60 seconds when n is a million?"</em></p>

<h3>Time complexity ladder</h3>
<ul>
  <li><strong>O(1)</strong> — constant. Indexing, dict lookup average.</li>
  <li><strong>O(log n)</strong> — halve the problem each step. Binary search.</li>
  <li><strong>O(n)</strong> — touch each element once. Linear scan.</li>
  <li><strong>O(n log n)</strong> — sort, then linear pass.</li>
  <li><strong>O(n²)</strong> — nested loops. Fine for n ≤ 1000.</li>
  <li><strong>O(2ⁿ), O(n!)</strong> — only acceptable for n ≤ ~20.</li>
</ul>

<h3>The limits rule (memorize this)</h3>
<table class="tbl">
  <tr><th>n is at most</th><th>You need at most</th></tr>
  <tr><td>≤ 20</td><td>O(2ⁿ) or O(n!) OK</td></tr>
  <tr><td>≤ 1,000</td><td>O(n²) OK</td></tr>
  <tr><td>≤ 100,000</td><td>O(n log n) or O(n)</td></tr>
  <tr><td>≤ 1,000,000</td><td>O(n)</td></tr>
  <tr><td>≤ 10,000,000</td><td>O(n) with tight constants</td></tr>
</table>
<p>The constraints in a problem are not decoration — they tell you which complexity tier you must
reach. <em>Always</em> read them before coding.</p>
`
      },

      {
        kind: "mcq",
        q: "The constraint says 1 ≤ n ≤ 100,000. Which complexity is the SAFEST target?",
        options: [
          { label: "O(n²)", correct: false },
          { label: "O(n log n) or O(n)", correct: true },
          { label: "O(2ⁿ)", correct: false },
          { label: "Whatever is shortest to type", correct: false },
        ],
        explain:
          "10⁵ × 10⁵ = 10¹⁰ — way past the ~10⁸ operations/sec budget. " +
          "O(n²) will time out. Target O(n log n) or O(n).",
      },

      {
        kind: "html",
        html: `
<h2>Arrays, lists & memory</h2>
<p>A Python <code>list</code> is a <strong>dynamic array</strong>: contiguous memory with
amortised O(1) append. Indexing is O(1) because the interpreter computes the byte address
arithmetically.</p>
<table class="tbl">
  <tr><th>Operation</th><th>Cost</th></tr>
  <tr><td><code>arr[i]</code></td><td>O(1)</td></tr>
  <tr><td><code>arr.append(x)</code></td><td>O(1) amortised</td></tr>
  <tr><td><code>arr.pop()</code></td><td>O(1)</td></tr>
  <tr><td><code>arr.pop(0)</code> / <code>arr.insert(0, x)</code></td><td><strong>O(n)</strong> — shifts every element</td></tr>
  <tr><td>linear search in unsorted</td><td>O(n)</td></tr>
</table>
<div class="callout warn">
  <div class="callout-title">Never use list as a queue</div>
  <code>arr.pop(0)</code> is O(n). For FIFO, always reach for
  <code>from collections import deque</code> — its <code>popleft()</code> is O(1).
</div>

<h2>Hash tables (dict / set)</h2>
<p>Python's <code>dict</code> and <code>set</code> are hash tables: insert/lookup/delete are O(1)
on average. Use them for:</p>
<ul>
  <li><strong>Counting frequencies</strong> — <code>collections.Counter</code></li>
  <li><strong>Existence checks</strong> — <code>x in some_set</code></li>
  <li><strong>Mapping relationships</strong> — adjacency lists, indexing, memoisation</li>
</ul>
<p>The worst case is O(n) per op (all keys collide), but Python's hash is good enough that you
can effectively treat them as O(1) in interviews.</p>

<h2>Stacks &amp; queues — Abstract Data Types</h2>
<p>An <strong>ADT</strong> defines behavior, not implementation. Two ADTs you must internalise:</p>

<h3>Stack — LIFO (Last In, First Out)</h3>
<pre><code><span class="tok-cmt"># Python implementation</span>
stack = []
stack.append(x)   <span class="tok-cmt"># push  (O(1))</span>
top = stack[-1]   <span class="tok-cmt"># peek</span>
stack.pop()       <span class="tok-cmt"># pop   (O(1))</span></code></pre>
<p>Use cases: reversing, nested-structure matching (brackets, HTML tags), expression evaluation,
undo/redo, monotonic patterns (next-greater-element).</p>

<h3>Queue — FIFO (First In, First Out)</h3>
<pre><code><span class="tok-kw">from</span> collections <span class="tok-kw">import</span> deque
q = deque()
q.append(x)       <span class="tok-cmt"># enqueue</span>
x = q.popleft()   <span class="tok-cmt"># dequeue (O(1))</span></code></pre>
<p>Use cases: BFS, level-order traversal, task scheduling, sliding-window with constant width.</p>
`
      },

      {
        kind: "mcq",
        q: "Which Python data structure should you use to implement a queue (FIFO)?",
        options: [
          { label: "list with pop(0)", correct: false },
          { label: "list with pop()", correct: false },
          { label: "collections.deque", correct: true },
          { label: "set", correct: false },
        ],
        explain:
          "list.pop(0) is O(n) — every other element shifts. deque.popleft() is O(1) " +
          "because deques are linked blocks. Wrong queue choice causes 'TLE on hidden tests'.",
      },

      {
        kind: "html",
        html: `
<h2>Graphs — the math behind connections</h2>
<p>A <strong>graph</strong> G = (V, E) is a set of vertices V and a set of edges E ⊆ V×V.
Many real-world problems — social networks, maps, dependency graphs, mazes — are graph problems
in disguise.</p>
<ul>
  <li><strong>Undirected</strong> edges go both ways (friendship). <strong>Directed</strong> edges have a head and tail (hyperlinks).</li>
  <li><strong>Weighted</strong> edges carry a number (cost, distance). <strong>Unweighted</strong> are all equal.</li>
  <li><strong>Degree</strong>: number of edges at a vertex (in/out for directed).</li>
  <li><strong>Path</strong>: a sequence of edges. <strong>Cycle</strong>: a path starting and ending at the same vertex.</li>
</ul>
<p>You'll meet graphs again in Module 4 with BFS/DFS, shortest paths, and a topological-sort
detour. For now, just know the vocabulary.</p>

<div class="callout good">
  <div class="callout-title">You're ready for Practice Set 1</div>
  Below you'll find 4 questions drawn from this module's topics. Some require hash tables, some
  require the right ADT, one is a tiny DP warmup. Try every one without looking at the solution
  first.
</div>
`
      },
    ],
  },

  // =============================================================
  // MODULE 2 — Strings, Stacks & Parsing
  // =============================================================
  M2: {
    id: "M2",
    title: "Module 2 — Strings, Stacks & Parsing",
    subtitle: "Two-pointers, state machines, monotonic stacks",
    practiceSet: "PS2",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 2 — Strings, Stacks & Parsing</h1>
  <p>Strings show up on every Coderbyte assessment. They reward exactly two skills: knowing the
  built-in toolbox so you don't waste time, and recognizing when a sequence problem is actually
  a stack problem.</p>
</div>

<h2>Strings are immutable sequences</h2>
<p>In Python, a string is an immutable sequence of Unicode characters. <code>s[0] = 'x'</code>
raises <code>TypeError</code>. Any "change" creates a new string.</p>

<div class="callout warn">
  <div class="callout-title">The classic O(n²) trap</div>
  Building a string by repeated <code>+=</code> inside a loop allocates a fresh string each step,
  copying all previous characters. Total work: O(n²). <strong>Always build a list and
  <code>"".join(parts)</code> at the end.</strong>
</div>

<h3>The toolbox (memorize)</h3>
<pre><code>s = <span class="tok-str">"  Hello, World!  "</span>

<span class="tok-cmt"># Inspection</span>
len(s)            <span class="tok-cmt"># 17</span>
s[0], s[-1]       <span class="tok-cmt"># ' ', ' '</span>
s[3:8]            <span class="tok-cmt"># 'Hello'  (start inclusive, end exclusive)</span>
s[::-1]           <span class="tok-cmt"># reverse</span>

<span class="tok-cmt"># Cleaning</span>
s.strip(), s.lstrip(), s.rstrip()

<span class="tok-cmt"># Case</span>
s.lower(), s.upper(), s.title()

<span class="tok-cmt"># Search</span>
s.find(<span class="tok-str">"World"</span>)     <span class="tok-cmt"># 9 (or -1)</span>
s.count(<span class="tok-str">"l"</span>)        <span class="tok-cmt"># 3</span>

<span class="tok-cmt"># Split / join</span>
s.split(<span class="tok-str">","</span>)        <span class="tok-cmt"># ['  Hello', ' World!  ']</span>
s.split()         <span class="tok-cmt"># on any whitespace</span>
<span class="tok-str">"-"</span>.join([<span class="tok-str">"a"</span>,<span class="tok-str">"b"</span>])

<span class="tok-cmt"># Predicates</span>
<span class="tok-str">"abc"</span>.isalpha(), <span class="tok-str">"123"</span>.isdigit(), <span class="tok-str">"a1"</span>.isalnum()
<span class="tok-str">"hello"</span>.startswith(<span class="tok-str">"he"</span>), <span class="tok-str">"hello"</span>.endswith(<span class="tok-str">"lo"</span>)
</code></pre>

<h2>The two-pointer paradigm</h2>
<p>Instead of allocating new structures, use two indices that walk the input. There are two main
flavours:</p>

<h3>Opposite-end pointers</h3>
<p>One at the start, one at the end. Move toward each other.</p>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">is_palindrome</span>(s):
    left, right = 0, len(s) - 1
    <span class="tok-kw">while</span> left &lt; right:
        <span class="tok-kw">if</span> s[left] != s[right]: <span class="tok-kw">return</span> <span class="tok-kw">False</span>
        left += 1; right -= 1
    <span class="tok-kw">return</span> <span class="tok-kw">True</span></code></pre>
<p>Use it for palindromes, sorted-array two-sum, container-with-most-water, reversing in place.</p>

<h3>Same-direction (fast/slow) pointers</h3>
<p>Both start at the beginning. One moves conditionally — typically a "write" pointer that lags
behind a "read" pointer.</p>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">remove_duplicates</span>(nums):
    write = 1
    <span class="tok-kw">for</span> read <span class="tok-kw">in</span> range(1, len(nums)):
        <span class="tok-kw">if</span> nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1
    <span class="tok-kw">return</span> write</code></pre>
<p>Use it for in-place compaction, sliding window (Module 5), middle-of-linked-list (Module 7).</p>

<h2>Parsing &amp; state machines</h2>
<p>A <strong>state machine</strong> models a parser as states + transitions. The "state" can be
explicit (an enum) or implicit (a stack, a counter, a regex's current node). When you see "validate
this format", reach for one.</p>
<p>Example: validate an ID of "2 letters + 4 digits". Conceptually it has 7 states (Start → got 1
letter → got 2 letters → got 1 digit → ... → accept). In Python it collapses to:</p>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">validate_id</span>(code):
    <span class="tok-kw">return</span> len(code) == 6 <span class="tok-kw">and</span> code[:2].isalpha() <span class="tok-kw">and</span> code[2:].isdigit()</code></pre>

<h2>Run-Length Encoding</h2>
<p>Compress consecutive identical chars as <code>char + count</code>. The algorithm is trivial
except for one bug almost everyone writes the first time:</p>
<div class="callout warn">
  <div class="callout-title">Don't forget the final run</div>
  The loop only emits on a <em>change</em>. The last group never sees a change inside the loop —
  you must append it after the loop ends.
</div>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">rle</span>(s):
    <span class="tok-kw">if</span> <span class="tok-kw">not</span> s: <span class="tok-kw">return</span> <span class="tok-str">""</span>
    out = []; count = 1
    <span class="tok-kw">for</span> i <span class="tok-kw">in</span> range(1, len(s)):
        <span class="tok-kw">if</span> s[i] == s[i-1]: count += 1
        <span class="tok-kw">else</span>: out.append(s[i-1] + str(count)); count = 1
    out.append(s[-1] + str(count))   <span class="tok-cmt"># ← the critical line</span>
    <span class="tok-kw">return</span> <span class="tok-str">""</span>.join(out)</code></pre>

<h2>Stacks recognize nested grammars</h2>
<p>Balanced parentheses are a context-free language with grammar <code>S → (S) | [S] | {S} | SS | ε</code>.
A stack recognizes this exactly: every <em>open</em> creates a "pending requirement" that must be
satisfied LIFO. The same idea generalises to HTML tag validation, where each open tag waits for
its matching close.</p>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">is_valid</span>(s):
    pair = {<span class="tok-str">')'</span>: <span class="tok-str">'('</span>, <span class="tok-str">']'</span>: <span class="tok-str">'['</span>, <span class="tok-str">'}'</span>: <span class="tok-str">'{'</span>}
    stack = []
    <span class="tok-kw">for</span> ch <span class="tok-kw">in</span> s:
        <span class="tok-kw">if</span> ch <span class="tok-kw">in</span> <span class="tok-str">'([{'</span>: stack.append(ch)
        <span class="tok-kw">else</span>:
            <span class="tok-kw">if</span> <span class="tok-kw">not</span> stack <span class="tok-kw">or</span> stack[-1] != pair[ch]: <span class="tok-kw">return</span> <span class="tok-kw">False</span>
            stack.pop()
    <span class="tok-kw">return</span> len(stack) == 0</code></pre>

<h2>Postfix (RPN) and the stack-friendly evaluator</h2>
<p>In <strong>Reverse Polish Notation</strong>, operators follow their operands: <code>3 4 +</code>
means "push 3, push 4, replace top two with their sum". No parentheses, no precedence rules.</p>
<div class="callout warn">
  <div class="callout-title">The division trap</div>
  RPN problems typically require <strong>truncation toward zero</strong>. Python's <code>//</code>
  floors toward −∞ (so <code>-3 // 2 == -2</code>). Use <code>int(a / b)</code> instead — it
  rounds toward zero like C/Java, giving <code>-1</code>.
</div>

<h2>Monotonic stacks</h2>
<p>A monotonic stack is a stack whose contents are kept either non-decreasing or non-increasing.
Whenever a new element would break the invariant, you pop until it's restored. This pattern is
the canonical solver for <em>"next greater / next smaller"</em> questions.</p>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">daily_temperatures</span>(t):
    n = len(t); ans = [0]*n; stack = []
    <span class="tok-kw">for</span> i <span class="tok-kw">in</span> range(n):
        <span class="tok-kw">while</span> stack <span class="tok-kw">and</span> t[i] &gt; t[stack[-1]]:
            j = stack.pop()
            ans[j] = i - j
        stack.append(i)
    <span class="tok-kw">return</span> ans</code></pre>
<p>Why is this O(n) and not O(n²)? Each index is pushed and popped at most once. Total work across
all iterations is bounded by 2n.</p>

<h2>HTML/XML validation</h2>
<p>The simplest version is a direct stack application: opening tag → push, closing tag → pop and
verify match. Real HTML adds self-closing tags, void elements (<code>br, img</code>), comments,
CDATA, and attribute values with quoted <code>&gt;</code>. The hardened variant (Q02) makes you a
mini state-machine parser. We'll explore both in the Practice Set.</p>
`
      },

      {
        kind: "mcq",
        q: "For evaluating an RPN expression with <code>10 3 / </code>, which Python expression matches the spec?",
        options: [
          { label: "10 // 3 = 3", correct: true, hint: "(but only because both operands are positive)" },
          { label: "int(10 / 3) = 3", correct: true },
          { label: "Both work the same for negative operands", correct: false },
          { label: "Use 10 % 3", correct: false },
        ],
        explain:
          "For non-negative inputs, // and int(/) agree. They DIVERGE for negatives: " +
          "-3 // 2 = -2 (floor), int(-3/2) = -1 (trunc-to-zero). The RPN spec almost always means trunc-to-zero — use int(a/b).",
      },
    ],
  },

  // =============================================================
  // MODULE 3 — SQL & Databases
  // =============================================================
  M3: {
    id: "M3",
    title: "Module 3 — SQL & Databases",
    subtitle: "Schema design, JOINs, aggregation, window functions",
    practiceSet: "PS3",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 3 — SQL & Databases</h1>
  <p>Almost every Odoo first-step report mentions a SQL problem. The graders look for two things:
  a clean normalised schema with the right keys, and queries that use the modern toolset
  (window functions, CTEs) instead of nested correlated subqueries.</p>
</div>

<h2>Relational algebra — the math under SQL</h2>
<p>A <em>relation</em> is a set of tuples (rows) with named attributes (columns). The basic
operations:</p>
<table class="tbl">
  <tr><th>Algebra</th><th>SQL</th><th>What it does</th></tr>
  <tr><td>σ (selection)</td><td><code>WHERE</code></td><td>Keep rows matching a predicate</td></tr>
  <tr><td>π (projection)</td><td><code>SELECT</code> columns</td><td>Keep only specific columns</td></tr>
  <tr><td>∪ (union)</td><td><code>UNION</code></td><td>Combine two relations, drop dups</td></tr>
  <tr><td>− (difference)</td><td><code>EXCEPT</code></td><td>Rows in A not in B</td></tr>
  <tr><td>× (Cartesian product)</td><td><code>CROSS JOIN</code></td><td>Every combination of rows</td></tr>
  <tr><td>⋈ (theta join)</td><td><code>JOIN</code></td><td>Cartesian product + selection on a predicate</td></tr>
</table>
<p>Knowing this stops you from memorizing syntax — you can <em>reason</em> about what a query
means.</p>

<h2>Schema design from first principles</h2>
<ol>
  <li><strong>Identify entities</strong> (nouns: Student, Course, Instructor).</li>
  <li><strong>Define attributes</strong> per entity.</li>
  <li><strong>Identify relationships</strong> (1:N, N:M).</li>
  <li><strong>Assign primary keys</strong> — usually an auto-increment integer.</li>
  <li><strong>Add foreign keys</strong> to enforce relationships.</li>
  <li><strong>Constraints</strong> — NOT NULL, UNIQUE, CHECK, DEFAULT.</li>
  <li><strong>Indexes</strong> — at least on every foreign key and any column you'll filter on.</li>
</ol>
<div class="callout tip">
  <div class="callout-title">Many-to-many = junction table</div>
  Students enrolling in many courses, courses having many students → don't add a
  <code>course_ids</code> column. Create an <code>enrollments(student_id, course_id, ...)</code>
  junction table with a composite UNIQUE constraint on (student_id, course_id).
</div>

<h2>Normalization in two minutes</h2>
<p>You don't need to lecture an interviewer on Codd's formalism. You DO need to recognize the
three sin patterns:</p>
<ul>
  <li><strong>1NF violation</strong>: a column holds a list ("Math, Physics, Chemistry"). Fix:
      separate table.</li>
  <li><strong>2NF violation</strong> (only matters for composite keys): a non-key column depends
      on only PART of the composite key. Fix: move it to the table whose key it actually depends on.</li>
  <li><strong>3NF violation</strong>: a non-key column depends on another non-key column
      (e.g. <code>courses.instructor_name</code> derives from <code>instructor_id</code>). Fix:
      move it to the table where it belongs (a separate <code>instructors</code> table).</li>
</ul>
`,
      },

      {
        kind: "mcq",
        q: "An <code>orders(order_id, customer_id, customer_email, product_id)</code> table has " +
           "<code>customer_email</code> derivable from <code>customer_id</code>. Which normal form is violated?",
        options: [
          { label: "1NF", correct: false },
          { label: "2NF", correct: false },
          { label: "3NF (transitive dependency)", correct: true },
          { label: "None — it's fine.", correct: false },
        ],
        explain:
          "customer_email depends on customer_id (a non-key here), not on the order's primary key. " +
          "That's a transitive dependency — a 3NF violation. Fix: drop the column from orders; " +
          "join to customers when you need the email.",
      },

      {
        kind: "html",
        html: `
<h2>Query execution order (not what you write)</h2>
<p>SQL is read left-to-right by humans but executed in a different order. This matters when an
alias from SELECT is unavailable in WHERE.</p>
<table class="tbl">
  <tr><th>#</th><th>Clause</th><th>Effect</th></tr>
  <tr><td>1</td><td>FROM + JOIN</td><td>Identify and combine tables</td></tr>
  <tr><td>2</td><td>WHERE</td><td>Filter raw rows</td></tr>
  <tr><td>3</td><td>GROUP BY</td><td>Bucket rows</td></tr>
  <tr><td>4</td><td>HAVING</td><td>Filter buckets</td></tr>
  <tr><td>5</td><td>SELECT</td><td>Pick / compute columns &amp; aliases</td></tr>
  <tr><td>6</td><td>ORDER BY</td><td>Sort</td></tr>
  <tr><td>7</td><td>LIMIT</td><td>Truncate</td></tr>
</table>
<pre><code><span class="tok-cmt">-- WRONG: alias 'total' doesn't exist yet in WHERE</span>
<span class="tok-kw">SELECT</span> student_id, COUNT(*) <span class="tok-kw">AS</span> total
<span class="tok-kw">FROM</span> enrollments
<span class="tok-kw">WHERE</span> total &gt; 3
<span class="tok-kw">GROUP BY</span> student_id;

<span class="tok-cmt">-- RIGHT: HAVING runs AFTER GROUP BY</span>
<span class="tok-kw">SELECT</span> student_id, COUNT(*) <span class="tok-kw">AS</span> total
<span class="tok-kw">FROM</span> enrollments
<span class="tok-kw">GROUP BY</span> student_id
<span class="tok-kw">HAVING</span> COUNT(*) &gt; 3;</code></pre>

<h2>JOINs at a glance</h2>
<ul>
  <li><strong>INNER JOIN</strong> — only rows matching in both tables. The default and most common.</li>
  <li><strong>LEFT JOIN</strong> — all rows from the left, NULL on right where no match.
      <em>"Find customers with no orders"</em> = LEFT JOIN + WHERE right_pk IS NULL.</li>
  <li><strong>RIGHT JOIN</strong> — rarely used in practice (you can always swap and LEFT JOIN).</li>
  <li><strong>FULL OUTER JOIN</strong> — both sides, NULL where no match. MySQL doesn't support
      it natively; use UNION of LEFT + RIGHT.</li>
  <li><strong>SELF JOIN</strong> — table joined to itself, two aliases. Required for hierarchical
      data (employee/manager, parent/child) and streak detection.</li>
</ul>

<h2>Aggregation vs window functions</h2>
<p><strong>Aggregations</strong> (<code>COUNT, SUM, AVG, MIN, MAX</code>) collapse a group into a
single row. Use them with GROUP BY when the goal is summary statistics.</p>
<p><strong>Window functions</strong> compute across a set of rows related to the current row
without collapsing. Use them when you need rank, running totals, or "median per group".</p>
<pre><code><span class="tok-kw">SELECT</span> student_id,
       grade,
       RANK()       <span class="tok-kw">OVER</span> (<span class="tok-kw">ORDER BY</span> grade <span class="tok-kw">DESC</span>) <span class="tok-kw">AS</span> rk,
       DENSE_RANK() <span class="tok-kw">OVER</span> (<span class="tok-kw">PARTITION BY</span> course_id <span class="tok-kw">ORDER BY</span> grade <span class="tok-kw">DESC</span>) <span class="tok-kw">AS</span> course_rk,
       ROW_NUMBER() <span class="tok-kw">OVER</span> (<span class="tok-kw">ORDER BY</span> id) <span class="tok-kw">AS</span> rn
<span class="tok-kw">FROM</span> scores;</code></pre>
<table class="tbl">
  <tr><th>Function</th><th>Ties</th><th>Gaps after ties</th></tr>
  <tr><td>RANK</td><td>same rank</td><td>YES (1, 2, 2, 4)</td></tr>
  <tr><td>DENSE_RANK</td><td>same rank</td><td>NO (1, 2, 2, 3)</td></tr>
  <tr><td>ROW_NUMBER</td><td>distinct</td><td>n/a (1, 2, 3, 4)</td></tr>
</table>
<div class="callout tip">
  <div class="callout-title">When in doubt, reach for a window</div>
  Pre-windows SQL forced ugly correlated subqueries for top-K, medians, lag/lead. Today you
  almost never need them. If a problem mentions "per group" or "consecutive", check whether a
  window function eats it whole.
</div>
`,
      },
    ],
  },

  // =============================================================
  // MODULE 4 — Graphs & Search
  // =============================================================
  M4: {
    id: "M4",
    title: "Module 4 — Graphs & Search",
    subtitle: "BFS, DFS, topological sort, union find",
    practiceSet: "PS4",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 4 — Graphs &amp; Search</h1>
  <p>Almost every "shortest", "reachable", "fewest steps" problem is a graph problem. Build the
  right representation, pick BFS or DFS based on what you want, and the rest is bookkeeping.</p>
</div>

<h2>Graph representations</h2>
<p>You have two choices. Pick <strong>adjacency list</strong> 99% of the time.</p>
<table class="tbl">
  <tr><th></th><th>Adjacency matrix</th><th>Adjacency list</th></tr>
  <tr><td>Space</td><td>O(V²)</td><td>O(V + E)</td></tr>
  <tr><td>Edge lookup</td><td>O(1)</td><td>O(deg(v))</td></tr>
  <tr><td>Iterate neighbours</td><td>O(V)</td><td>O(deg(v))</td></tr>
  <tr><td>Best for</td><td>Dense graphs</td><td>Sparse graphs (the real world)</td></tr>
</table>
<pre><code><span class="tok-cmt"># Build an undirected adjacency list from an edge list</span>
<span class="tok-kw">from</span> collections <span class="tok-kw">import</span> defaultdict
graph = defaultdict(list)
<span class="tok-kw">for</span> u, v <span class="tok-kw">in</span> edges:
    graph[u].append(v)
    graph[v].append(u)</code></pre>

<h2>BFS — the breadth-first paradigm</h2>
<p>BFS visits vertices in waves of equal distance from the source. Start in a queue with the
source; pop, enqueue unvisited neighbours, repeat. Because dequeues happen FIFO, the first time
any vertex is reached it is reached by a shortest path (in unweighted graphs).</p>

<h3>The proof, in three lines</h3>
<p>Induction on distance <em>k</em> from the source.</p>
<ol>
  <li><em>Base:</em> source itself, distance 0, enqueued before anything else.</li>
  <li><em>Inductive step:</em> all vertices at distance <em>k</em> are dequeued before any vertex
      at distance &gt; <em>k</em>, because BFS exhausts a level before moving on.</li>
  <li>So when a vertex <em>v</em> at distance <em>k+1</em> is discovered via some neighbour <em>u</em>
      at distance <em>k</em>, no shorter route can exist — every shorter route would have to pass
      through a vertex at distance ≤ <em>k</em>, all of which we've already processed.</li>
</ol>

<pre><code><span class="tok-kw">from</span> collections <span class="tok-kw">import</span> deque
<span class="tok-kw">def</span> <span class="tok-fn">bfs_dist</span>(graph, start, target):
    <span class="tok-kw">if</span> start == target: <span class="tok-kw">return</span> 0
    seen = {start}
    q = deque([(start, 0)])
    <span class="tok-kw">while</span> q:
        node, d = q.popleft()
        <span class="tok-kw">for</span> nxt <span class="tok-kw">in</span> graph[node]:
            <span class="tok-kw">if</span> nxt == target: <span class="tok-kw">return</span> d + 1
            <span class="tok-kw">if</span> nxt <span class="tok-kw">not</span> <span class="tok-kw">in</span> seen:
                seen.add(nxt); q.append((nxt, d + 1))
    <span class="tok-kw">return</span> -1</code></pre>

<div class="callout warn">
  <div class="callout-title">Mark visited at ENQUEUE, not dequeue</div>
  If you check "visited?" only when dequeuing, the same neighbour gets enqueued by every node
  that reaches it — your queue blows up. <em>Always</em> add to the visited set the moment you
  enqueue, including the source.
</div>

<h2>BFS vs DFS — when which</h2>
<p>DFS goes as deep as possible before backtracking. It uses recursion (or an explicit stack).
DFS does not respect distance — it can find a 7-edge path to a node before discovering the 2-edge
one. Use DFS when path length doesn't matter or you need to explore exhaustively.</p>
<table class="tbl">
  <tr><th>Use BFS for</th><th>Use DFS for</th></tr>
  <tr>
    <td>Shortest path (unweighted)<br/>
        Minimum number of steps<br/>
        Level-order traversal<br/>
        Multi-source spreading (rotting oranges)</td>
    <td>Topological sort (alternative)<br/>
        Cycle detection<br/>
        Connected components<br/>
        Backtracking / "find any" / "all paths"<br/>
        Tree problems (Module 7)</td>
  </tr>
</table>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">dfs</span>(graph, node, seen):
    seen.add(node)
    <span class="tok-kw">for</span> nxt <span class="tok-kw">in</span> graph[node]:
        <span class="tok-kw">if</span> nxt <span class="tok-kw">not</span> <span class="tok-kw">in</span> seen:
            dfs(graph, nxt, seen)
</code></pre>

<h2>Grids are graphs</h2>
<p>A 2D matrix is a graph where each cell is a node and adjacent cells are edges (4-directional
or 8-directional). The same BFS/DFS algorithms apply with a direction list.</p>
<pre><code>DIRS_4 = [(0,1),(0,-1),(1,0),(-1,0)]
DIRS_8 = DIRS_4 + [(1,1),(1,-1),(-1,1),(-1,-1)]
<span class="tok-kw">for</span> dr, dc <span class="tok-kw">in</span> DIRS_4:
    nr, nc = r + dr, c + dc
    <span class="tok-kw">if</span> 0 &lt;= nr &lt; rows <span class="tok-kw">and</span> 0 &lt;= nc &lt; cols <span class="tok-kw">and</span> ...</code></pre>

<h2>Multi-source BFS</h2>
<p>Sometimes the spreading wavefront has multiple origins (rotting oranges spreading to fresh
ones, walls falling at multiple gates). Just enqueue ALL sources at depth 0 and the algorithm
proceeds identically. The first time a vertex is reached is still by its globally shortest
distance — now from the <em>nearest</em> source.</p>

<h2>Topological sort &mdash; ordering a DAG</h2>
<p>Given prerequisites, return an order in which to do them. Equivalent to: linearize a DAG.
Useful for course scheduling, build dependencies, evaluation order.</p>
<p><strong>Kahn's algorithm (BFS-flavoured):</strong></p>
<ol>
  <li>Compute the in-degree of every vertex.</li>
  <li>Enqueue all vertices with in-degree 0.</li>
  <li>Pop, output, decrement the in-degree of all its successors, enqueue those that hit 0.</li>
  <li>If you couldn't output every vertex, the graph has a cycle.</li>
</ol>
<p>It also doubles as a cycle detector — extremely handy for Q48 "Course Schedule".</p>

<h2>Union Find (Disjoint Set Union)</h2>
<p>Union Find tracks equivalence classes under merging. Two operations:</p>
<ul>
  <li><code>find(x)</code> — the canonical representative of x's class.</li>
  <li><code>union(a, b)</code> — merge a's and b's classes.</li>
</ul>
<p>With <strong>path compression</strong> (flatten the tree during find) and <strong>union by
rank</strong> (always attach the shorter tree under the taller), both operations run in nearly
O(1) — formally O(α(n)), the inverse Ackermann function.</p>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">make_dsu</span>(n):
    parent = list(range(n))
    rank   = [0] * n
    <span class="tok-kw">def</span> <span class="tok-fn">find</span>(x):
        <span class="tok-kw">while</span> parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        <span class="tok-kw">return</span> x
    <span class="tok-kw">def</span> <span class="tok-fn">union</span>(a, b):
        ra, rb = find(a), find(b)
        <span class="tok-kw">if</span> ra == rb: <span class="tok-kw">return</span> <span class="tok-kw">False</span>
        <span class="tok-kw">if</span> rank[ra] &lt; rank[rb]: ra, rb = rb, ra
        parent[rb] = ra
        <span class="tok-kw">if</span> rank[ra] == rank[rb]: rank[ra] += 1
        <span class="tok-kw">return</span> <span class="tok-kw">True</span>
    <span class="tok-kw">return</span> find, union</code></pre>
<p>Use it for: counting connected components (Q49), Kruskal's MST, "friend circles",
"accounts merge", any problem where edges arrive online.</p>
`,
      },
    ],
  },

  // =============================================================
  // MODULE 5 — Arrays, Two Pointers, Sliding Windows
  // =============================================================
  M5: {
    id: "M5",
    title: "Module 5 — Arrays, Two-Pointers & Sliding Windows",
    subtitle: "In-place tricks, the sliding window family, prefix sums, intervals",
    practiceSet: "PS5",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 5 — Arrays, Two-Pointers & Sliding Windows</h1>
  <p>The single most reused pattern in coding interviews lives here. Master the read-write
  pointer template and the sliding-window template and you'll solve a third of all medium-difficulty
  array problems on autopilot.</p>
</div>

<h2>In-place modification — the read/write pattern</h2>
<p>Many problems demand O(1) extra space, meaning you must overwrite the input array in place.
The recurring template is:</p>
<pre><code>write = 0
<span class="tok-kw">for</span> read <span class="tok-kw">in</span> range(len(arr)):
    <span class="tok-kw">if</span> condition(arr[read]):
        arr[write] = arr[read]
        write += 1
<span class="tok-cmt"># Now arr[:write] is the cleaned prefix.</span></code></pre>
<p>The invariant: <code>write ≤ read</code> always holds, so we never overwrite data we haven't
inspected. Works for: remove element by value, remove duplicates from sorted, move zeroes
(with a follow-up zero-fill pass).</p>

<h2>The sliding window family</h2>
<p>A "window" is a contiguous subarray. Two flavours:</p>

<h3>Fixed-size window</h3>
<p>The window's width is given (e.g., "max sum of any 5 consecutive elements"). Compute the sum
once, then slide: subtract the leaving element, add the entering one. O(n) instead of O(n·k).</p>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">max_sum_k</span>(nums, k):
    <span class="tok-kw">if</span> len(nums) &lt; k: <span class="tok-kw">return</span> 0
    s = sum(nums[:k]); best = s
    <span class="tok-kw">for</span> i <span class="tok-kw">in</span> range(k, len(nums)):
        s += nums[i] - nums[i-k]
        best = max(best, s)
    <span class="tok-kw">return</span> best</code></pre>

<h3>Variable-size window (expand/contract)</h3>
<p>The window's width is determined by a <em>condition</em>, not a constant. Two pointers
<code>left</code> and <code>right</code> both move forward; <code>right</code> expands,
<code>left</code> contracts when the window is invalid.</p>
<p>The template is universally:</p>
<pre><code>left = 0
<span class="tok-kw">for</span> right <span class="tok-kw">in</span> range(n):
    add(arr[right])
    <span class="tok-kw">while</span> <span class="tok-kw">not</span> valid():
        remove(arr[left]); left += 1
    update_answer(left, right)</code></pre>
<p>The "longest substring without repeating characters" problem (Q33) is the textbook variant:
expand right; if you see a duplicate inside the window, jump left past its previous occurrence.</p>

<h2>The "need vs have" template — for "contains all of T" windows</h2>
<p>Problems like Q34 (Minimum Window Substring) ask: "smallest window of S containing every
character of T, counting duplicates." The trick that makes the window-validity check O(1):</p>
<ul>
  <li><code>need[ch]</code> — required count of each char in T (a Counter).</li>
  <li><code>have[ch]</code> — current count in the window.</li>
  <li><code>formed</code> — how many distinct chars meet or exceed their need. The window is
      valid iff <code>formed == len(need)</code>.</li>
</ul>
<p>You only update <code>formed</code> when <code>have[ch]</code> CROSSES the threshold
<code>need[ch]</code> — going up (a new "satisfied" char) or going down (one fewer satisfied
char). This keeps each step O(1) and the whole algorithm O(|S| + |T|).</p>

<h2>Prefix sums and difference arrays</h2>

<h3>Prefix sum — for range sum queries</h3>
<p><code>prefix[i] = nums[0] + nums[1] + ... + nums[i-1]</code>. Then any range sum is one
subtraction: <code>sum(nums[l:r]) = prefix[r] - prefix[l]</code>. Build in O(n), query in O(1).</p>
<pre><code>prefix = [0]
<span class="tok-kw">for</span> x <span class="tok-kw">in</span> nums: prefix.append(prefix[-1] + x)
<span class="tok-cmt"># Sum of nums[i:j] is prefix[j] - prefix[i]</span></code></pre>

<h3>Difference array — for range updates</h3>
<p>If you must support many "add v to nums[l..r]" updates, naive code is O(n) per update.
Instead use a difference array: <code>diff[l] += v</code>, <code>diff[r+1] -= v</code>. After
all updates, take the prefix sum of diff to recover the final array. O(1) per update, O(n)
at the end.</p>

<h2>Intervals — sort once, sweep once</h2>
<p>Many interval problems (merge, insert, count-non-overlapping, attend-all-meetings) share the
same first move: <strong>sort by start time</strong>. After sorting, every interval that could
overlap with the current one comes immediately after it in the list.</p>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">merge</span>(intervals):
    intervals.sort(key=<span class="tok-kw">lambda</span> iv: iv[0])
    out = [intervals[0][:]]
    <span class="tok-kw">for</span> s, e <span class="tok-kw">in</span> intervals[1:]:
        <span class="tok-kw">if</span> s &lt;= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)   <span class="tok-cmt"># crucial: max, not e</span>
        <span class="tok-kw">else</span>:
            out.append([s, e])
    <span class="tok-kw">return</span> out</code></pre>
<div class="callout warn">
  <div class="callout-title">Don't shrink with =, extend with max</div>
  If you write <code>out[-1][1] = e</code>, a fully nested interval will SHRINK the merged one.
  Always combine ends with <code>max</code>.
</div>
`,
      },
    ],
  },

  // =============================================================
  // MODULE 6 — Math, Bit Ops, Binary Search
  // =============================================================
  M6: {
    id: "M6",
    title: "Module 6 — Math, Bit Ops & Binary Search",
    subtitle: "Digit games, primes, modular tricks, XOR, binary search template",
    practiceSet: "PS6",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 6 — Math, Bit Ops &amp; Binary Search</h1>
  <p>Most "math" problems on Coderbyte are <em>about</em> the rough mechanics of digits, primes,
  GCDs, or bits — not heavy theory. Plus binary search: the most under-used yet most powerful
  log-n technique in the toolbox.</p>
</div>

<h2>Digit manipulation</h2>
<pre><code>n = 12345
last  = n % 10        <span class="tok-cmt"># 5</span>
rest  = n // 10       <span class="tok-cmt"># 1234</span>
ndig  = len(str(n))   <span class="tok-cmt"># 5 (or count by loop with //10)</span></code></pre>
<div class="callout warn">
  <div class="callout-title">Signed integers: prefer math.fmod for digit problems</div>
  Python's <code>%</code> always returns a result with the divisor's sign (<code>-7 % 10 == 3</code>).
  C/Java's <code>%</code> keeps the dividend's sign (<code>-7 % 10 == -7</code>). When a problem
  was clearly written for the latter (e.g., reverse-integer with negative inputs), use
  <code>math.fmod(x, 10)</code> for the right semantics.
</div>

<h2>Reversing an integer with overflow check</h2>
<p>You can't just check overflow afterwards in Python (its ints are arbitrary precision). Check
<em>before</em> pushing each new digit:</p>
<pre><code>INT_MIN, INT_MAX = -2**31, 2**31 - 1
<span class="tok-kw">if</span> (result &gt; INT_MAX // 10 <span class="tok-kw">or</span>
    (result == INT_MAX // 10 <span class="tok-kw">and</span> digit &gt; 7)):
    <span class="tok-kw">return</span> 0</code></pre>
<p>The mysterious "7" is the last digit of INT_MAX (2147483647). Same for INT_MIN's "8".</p>

<h2>Primes &amp; the Sieve of Eratosthenes</h2>
<p>Single-number test in O(√n):</p>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">is_prime</span>(n):
    <span class="tok-kw">if</span> n &lt; 2: <span class="tok-kw">return</span> <span class="tok-kw">False</span>
    <span class="tok-kw">if</span> n &lt; 4: <span class="tok-kw">return</span> <span class="tok-kw">True</span>
    <span class="tok-kw">if</span> n % 2 == 0: <span class="tok-kw">return</span> <span class="tok-kw">False</span>
    <span class="tok-kw">for</span> i <span class="tok-kw">in</span> range(3, int(n**0.5) + 1, 2):
        <span class="tok-kw">if</span> n % i == 0: <span class="tok-kw">return</span> <span class="tok-kw">False</span>
    <span class="tok-kw">return</span> <span class="tok-kw">True</span></code></pre>
<p>All primes &lt; n in O(n log log n) — the Sieve:</p>
<pre><code>is_prime = [<span class="tok-kw">True</span>] * n
is_prime[0] = is_prime[1] = <span class="tok-kw">False</span>
<span class="tok-kw">for</span> i <span class="tok-kw">in</span> range(2, int(n**0.5) + 1):
    <span class="tok-kw">if</span> is_prime[i]:
        <span class="tok-kw">for</span> j <span class="tok-kw">in</span> range(i*i, n, i):
            is_prime[j] = <span class="tok-kw">False</span></code></pre>
<p><em>Why start at i*i?</em> Smaller multiples of i (2i, 3i, …, (i−1)·i) have already been
marked by smaller primes (2, 3, …, i−1).</p>

<h2>GCD &amp; the Euclidean algorithm</h2>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">gcd</span>(a, b):
    <span class="tok-kw">while</span> b: a, b = b, a % b
    <span class="tok-kw">return</span> a
<span class="tok-cmt"># lcm(a, b) = abs(a*b) // gcd(a, b)</span></code></pre>
<p>The principle: <code>gcd(a, b) = gcd(b, a mod b)</code>. The remainder strictly decreases until
0, so the recursion is guaranteed to terminate — and quickly (in O(log min(a, b))).</p>

<h2>Modular arithmetic</h2>
<p>You'll see <code>mod = 10**9 + 7</code> in many problems. The reason: prevent overflow in
fixed-width languages and give a unique answer regardless of which equivalent rearrangement you
used.</p>
<p>Useful identity: <code>(a + b) % m = ((a % m) + (b % m)) % m</code>. Same for subtraction
(adjust sign) and multiplication.</p>
<p>For very large exponents, fast modular exponentiation (square-and-multiply) — same idea as
the binary exponentiation in Q31.</p>

<h2>Bit manipulation tricks</h2>
<table class="tbl">
  <tr><th>Trick</th><th>Code</th></tr>
  <tr><td>Is n a power of 2?</td><td><code>n &gt; 0 and (n &amp; (n-1)) == 0</code></td></tr>
  <tr><td>Lowest set bit value</td><td><code>n &amp; -n</code></td></tr>
  <tr><td>Clear lowest set bit</td><td><code>n &amp;= n - 1</code></td></tr>
  <tr><td>Count set bits (Hamming weight)</td><td>Repeatedly clear lowest bit until 0</td></tr>
  <tr><td>XOR identities</td><td><code>a ^ a = 0</code>, <code>a ^ 0 = a</code></td></tr>
</table>
<p>The XOR identities are the entire trick behind Q45 (Single Number): XOR everything together;
pairs cancel; the loner survives. They also solve "two non-duplicates" with one more partition
step.</p>

<h2>Binary search — the template that always works</h2>
<p>Half the binary-search bugs in interviews come from "is mid an answer? or do I keep searching
right of it?" confusion. Use this template and the off-by-one bugs go away:</p>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">binary_search</span>(arr, target):
    lo, hi = 0, len(arr) - 1   <span class="tok-cmt"># inclusive on both ends</span>
    <span class="tok-kw">while</span> lo &lt;= hi:
        mid = (lo + hi) // 2
        <span class="tok-kw">if</span> arr[mid] == target: <span class="tok-kw">return</span> mid
        <span class="tok-kw">elif</span> arr[mid] &lt; target: lo = mid + 1
        <span class="tok-kw">else</span>: hi = mid - 1
    <span class="tok-kw">return</span> -1</code></pre>
<p>For finding the leftmost/rightmost match (or insertion point), use Python's
<code>bisect_left</code> / <code>bisect_right</code> directly — they're written by experts and
have no off-by-ones.</p>
<p>The trickier variant is binary search on a <em>rotated</em> sorted array (Q44): every step,
exactly one of the halves around <code>mid</code> is sorted. Decide which by comparing
<code>arr[lo]</code> with <code>arr[mid]</code>, then check whether the target lies in the
sorted half's known range.</p>

<h2>Floyd's cycle detection</h2>
<p>Two pointers, one twice as fast. If there's a cycle, they MUST eventually coincide inside the
cycle (the distance between them changes by 1 per step). Used for happy number (Q27), linked-list
cycle (Q38), and any "iterated function" cycle detection where you want O(1) extra space.</p>
`,
      },
    ],
  },

  // =============================================================
  // MODULE 7 — Trees, Linked Lists, Heap, Trie
  // =============================================================
  M7: {
    id: "M7",
    title: "Module 7 — Trees, Linked Lists, Heap & Trie",
    subtitle: "Recursion patterns, pointer surgery, priority queues, prefix trees",
    practiceSet: "PS7",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 7 — Trees, Linked Lists, Heap & Trie</h1>
  <p>Module 1–6 covered the core algorithmic foundations. This module covers the data structures
  you'll be expected to manipulate by pointer: trees, linked lists, heaps, and tries. None of
  this is exotic; the test is whether you can write clean, bug-free pointer code under time pressure.</p>
</div>

<h2>Binary trees and their traversals</h2>
<p>A binary tree node:</p>
<pre><code><span class="tok-kw">class</span> <span class="tok-fn">TreeNode</span>:
    <span class="tok-kw">def</span> __init__(self, val=0, left=<span class="tok-kw">None</span>, right=<span class="tok-kw">None</span>):
        self.val = val; self.left = left; self.right = right</code></pre>
<p>Four traversals to know:</p>
<ul>
  <li><strong>Pre-order</strong>: root, left, right. Use for serializing/cloning a tree.</li>
  <li><strong>In-order</strong>: left, root, right. For a BST, this yields sorted order.
      That's the cleanest way to validate a BST.</li>
  <li><strong>Post-order</strong>: left, right, root. Use when computing values that depend on
      children (heights, subtree sums).</li>
  <li><strong>Level-order</strong>: BFS with a queue. Use for "print level by level" problems.</li>
</ul>

<h3>The recursion template for trees</h3>
<p>Almost every tree problem reduces to: "what does my function return for a subtree, and how do I
combine left/right results into my own?"</p>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">solve</span>(node):
    <span class="tok-kw">if</span> node <span class="tok-kw">is</span> <span class="tok-kw">None</span>: <span class="tok-kw">return</span> base_case
    L = solve(node.left)
    R = solve(node.right)
    <span class="tok-kw">return</span> combine(node.val, L, R)</code></pre>
<p>Examples: height = <code>1 + max(L, R)</code>; sum = <code>node.val + L + R</code>; lowest
common ancestor = <code>node if (L and R) else (L or R)</code>.</p>

<h2>Binary Search Trees</h2>
<p>A BST is a binary tree with the extra invariant: for every node, all values in the left subtree
are strictly less, all values in the right subtree are strictly greater. (Some definitions allow
duplicates; assume strict unless told otherwise.)</p>
<div class="callout warn">
  <div class="callout-title">The BST validation trap</div>
  Checking only <code>node.left.val &lt; node.val &lt; node.right.val</code> is <em>not</em>
  enough — a great-grandchild on the wrong branch can violate the global property. Either pass
  <code>(low, high)</code> bounds down recursively, or do an in-order traversal and verify the
  sequence is strictly increasing.
</div>

<h2>Singly linked lists</h2>
<p>A linked list is sequential without random access, but with O(1) insertion at known positions.
The classic pattern is "three-pointer surgery":</p>
<pre><code>prev = <span class="tok-kw">None</span>; curr = head
<span class="tok-kw">while</span> curr:
    nxt = curr.next        <span class="tok-cmt"># 1. remember next</span>
    curr.next = prev       <span class="tok-cmt"># 2. rewire</span>
    prev = curr; curr = nxt <span class="tok-cmt"># 3. advance</span>
<span class="tok-cmt"># prev is the new head</span></code></pre>

<h3>Dummy head pattern</h3>
<p>Whenever you're <em>building</em> a list, prepend a sentinel "dummy" node. It removes the special
case for "is this the first append?" because <code>tail</code> always points somewhere valid.</p>
<pre><code>dummy = ListNode(); tail = dummy
<span class="tok-kw">while</span> condition:
    tail.next = new_node
    tail = tail.next
<span class="tok-kw">return</span> dummy.next</code></pre>

<h3>Floyd's cycle detection (linked list version)</h3>
<p>To detect a cycle: slow moves by 1, fast by 2. If they meet, cycle. To find the cycle's <em>start</em>:
once they meet, reset <code>slow</code> to <code>head</code> and advance both by 1 — they collide at
the cycle entry. (The algebra falls out of <code>2(L+k) - (L+k) = L+k = mC</code>; see Q38 explanation.)</p>

<h2>Heap / priority queue</h2>
<p>A binary heap is a complete binary tree stored in an array with one invariant: every parent
is ≤ (min-heap) or ≥ (max-heap) its children. Python's <code>heapq</code> module gives you a
<strong>min-heap</strong>; for a max-heap, push <code>-x</code>.</p>
<pre><code><span class="tok-kw">import</span> heapq
h = [3, 1, 4]
heapq.heapify(h)        <span class="tok-cmt"># O(n)</span>
heapq.heappush(h, 2)    <span class="tok-cmt"># O(log n)</span>
smallest = heapq.heappop(h)  <span class="tok-cmt"># O(log n)</span></code></pre>

<h3>The "top-K" pattern</h3>
<p>For "k largest" or "k smallest" out of n items, keep a size-k <strong>min-heap</strong> for largest
(or size-k <strong>max-heap</strong> for smallest). After processing all n, the heap holds the answer
in O(n log k) time and O(k) space — beating the O(n log n) of full sort whenever k ≪ n.</p>

<h2>Trie (prefix tree)</h2>
<p>A trie stores strings by sharing prefixes. Each node is a dict of children + a "word-ends-here"
flag. Lookups, insertions, and prefix-matches all run in O(L) where L is the word length, regardless
of the dictionary size. This is the trie's edge over a hash set, which can't answer
<code>starts_with</code> faster than O(N·L).</p>
<pre><code><span class="tok-kw">class</span> <span class="tok-fn">Trie</span>:
    <span class="tok-kw">def</span> __init__(self): self.root = {}
    <span class="tok-kw">def</span> <span class="tok-fn">insert</span>(self, w):
        n = self.root
        <span class="tok-kw">for</span> c <span class="tok-kw">in</span> w:
            n = n.setdefault(c, {})
        n[<span class="tok-str">'$'</span>] = <span class="tok-kw">True</span>
    <span class="tok-kw">def</span> <span class="tok-fn">_walk</span>(self, s):
        n = self.root
        <span class="tok-kw">for</span> c <span class="tok-kw">in</span> s:
            <span class="tok-kw">if</span> c <span class="tok-kw">not</span> <span class="tok-kw">in</span> n: <span class="tok-kw">return</span> <span class="tok-kw">None</span>
            n = n[c]
        <span class="tok-kw">return</span> n
    <span class="tok-kw">def</span> <span class="tok-fn">search</span>(self, w):
        n = self._walk(w); <span class="tok-kw">return</span> n <span class="tok-kw">is</span> <span class="tok-kw">not</span> <span class="tok-kw">None</span> <span class="tok-kw">and</span> n.get(<span class="tok-str">'$'</span>, <span class="tok-kw">False</span>)
    <span class="tok-kw">def</span> <span class="tok-fn">starts_with</span>(self, p):
        <span class="tok-kw">return</span> self._walk(p) <span class="tok-kw">is</span> <span class="tok-kw">not</span> <span class="tok-kw">None</span></code></pre>
<p>Tries also power "word search on grid" type problems (Q20): build a trie of the dictionary,
DFS from each cell, walking the trie pointer in parallel. The trie prunes whole word families
that can't possibly extend.</p>
`,
      },
    ],
  },

  // =============================================================
  // MODULE 8 — DP, Backtracking, Greedy
  // =============================================================
  M8: {
    id: "M8",
    title: "Module 8 — DP, Backtracking & Greedy",
    subtitle: "Three families that look similar but apply to different shapes of problems",
    practiceSet: "PS8",
    body: [
      {
        kind: "html",
        html: `
<div class="hero">
  <h1>Module 8 — DP, Backtracking &amp; Greedy</h1>
  <p>Three problem-solving families that look superficially alike — all are "exhaustive in some
  sense" — but apply to very different shapes of problems. Recognising which one is appropriate
  is half the battle.</p>
</div>

<h2>Dynamic Programming — the two preconditions</h2>
<p>A problem yields to DP iff it has BOTH:</p>
<ol>
  <li><strong>Optimal substructure</strong> — the optimal solution to the whole is built from
      optimal solutions to parts. (If the best route through a city must pass through the best
      route to each landmark, you have optimal substructure.)</li>
  <li><strong>Overlapping subproblems</strong> — the same sub-question arises repeatedly during
      a naive recursive solution. (Fibonacci has it; merge sort doesn't.)</li>
</ol>
<p>Without (1), DP doesn't apply at all. Without (2), DP is correct but pointless — straight
recursion is fine.</p>

<h3>The DP toolkit, in order of complexity</h3>
<ol>
  <li><strong>Top-down memoisation</strong>. Write the recursion. Cache results in a dict or
      <code>@functools.lru_cache</code>. Easiest to get right; slowest constants.</li>
  <li><strong>Bottom-up tabulation</strong>. Identify the dependency direction. Fill a table from
      base cases outward. Better constants; sometimes simpler iteration order.</li>
  <li><strong>Space-optimised bottom-up</strong>. Notice you only need the last 1–2 rows of the
      table. Rolling variables — turn O(n) space into O(1).</li>
</ol>

<h3>The canonical examples</h3>
<ul>
  <li><strong>Climbing Stairs (Q41)</strong> — Fibonacci recurrence
      <code>f(n) = f(n-1) + f(n-2)</code>. The simplest DP onboarding problem.</li>
  <li><strong>Coin Change (Q42)</strong> — Unbounded knapsack:
      <code>dp[a] = 1 + min(dp[a-c] for c in coins)</code>.</li>
  <li><strong>Longest Increasing Subsequence (Q43)</strong> — O(n²) DP, or O(n log n) with the
      <code>tails</code> trick that beats every interview's expected complexity.</li>
</ul>
<div class="callout warn">
  <div class="callout-title">The sentinel trap in min/max DP</div>
  When <code>dp[a] = min(dp[a-c] + 1)</code>, what is <code>dp</code>'s initial value? Use a
  sentinel like <code>amount + 1</code> — never <code>math.inf</code> in code that does
  <code>x + 1</code>. Sentinel + 1 must remain "still unreachable", which is automatic with
  <code>amount + 1</code> since the answer can never exceed <code>amount</code> coins of value 1.
</div>

<h2>Backtracking — DFS over decision space</h2>
<p>Backtracking explores a tree of partial solutions: at each node, try each possible "next move",
recurse, then undo the move (the "backtrack" step). It's a depth-first search over the
<em>solution space</em>, not over a literal graph.</p>
<p>The template:</p>
<pre><code><span class="tok-kw">def</span> <span class="tok-fn">backtrack</span>(state):
    <span class="tok-kw">if</span> is_solution(state):
        record(state); <span class="tok-kw">return</span>
    <span class="tok-kw">for</span> move <span class="tok-kw">in</span> candidates(state):
        apply(move)
        backtrack(state)
        undo(move)</code></pre>
<p>Recurring patterns:</p>
<ul>
  <li><strong>Subsets</strong> (Q47) — at each step, choose to include or exclude the next element.</li>
  <li><strong>Permutations</strong> — at each step, choose any unused element next.</li>
  <li><strong>Combinations</strong> — like subsets but with a fixed size.</li>
  <li><strong>Pathfinding</strong> on grids/trees with constraints (no cell reused, sum exactly K).</li>
</ul>
<div class="callout warn">
  <div class="callout-title">The "live path" trap</div>
  Always <code>path[:]</code> (or <code>list(path)</code>) when storing a recursion-tree result —
  storing the live list means every entry mutates as you backtrack. This is the #1 backtracking
  bug, and it's silent: your output is just "all the same value, somehow".
</div>

<h2>Greedy — when local optima form global optima</h2>
<p>A greedy algorithm makes the locally-best choice at each step and never reconsiders. It only
works when the problem has <em>greedy choice property</em>: the local optimum is provably
consistent with some global optimum. Examples that DO:</p>
<ul>
  <li><strong>Jump Game (Q51)</strong> — track the furthest reachable index; whenever you can
      reach further, you should. Provable: any path that reaches the end must also use a
      step that increased the running max-reach.</li>
  <li><strong>Interval scheduling</strong> — sort by end time, take the earliest-ending interval
      that doesn't conflict. Classic greedy proof by exchange argument.</li>
  <li><strong>Coin Change with canonical coin systems</strong> (US/EU coins) — but NOT general
      coin systems (which is why Q42 is DP, not greedy).</li>
</ul>
<p>Examples that DON'T (these LOOK greedy but need DP):</p>
<ul>
  <li>General coin change.</li>
  <li>0/1 knapsack with arbitrary weights and values.</li>
  <li>Longest increasing subsequence.</li>
</ul>
<div class="callout tip">
  <div class="callout-title">How to know greedy works</div>
  Try to construct a small counterexample. If you can't, attempt a proof: "any optimal solution
  not using the greedy choice can be transformed into one that does, without getting worse."
  If the transformation exists, greedy is safe.
</div>

<h2>Wrapping up</h2>
<p>You've now covered every algorithmic family on the Odoo first-step assessment. The remaining
prep is volume — solve problems until the templates are reflexive. Practice Set 8 below is your
last one before the Final Exam.</p>
`,
      },
    ],
  },

};

// Order in which modules appear in nav
window.MODULE_ORDER = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"];
