/* ============================================================
   Last Review [Claude] — content
   One consolidated, step-by-step pass for the Odoo final-stage
   interview. Sourced from the Interview-Final course (modules
   M1–M15 + F01–F90 bank), the Syntax Quick-Ref (SQL), the Final-
   Week Roadmap, the solved-problem folders, and the Competitive
   Programmer's Handbook.

   Block schema (rendered by app.js):
     {t:'note', tone:'key|trap|formula|win', flag, title, html, adv}
     {t:'code', lang:'python|sql|js|text', title, code, note, adv}
     {t:'table', flag, title, head:[], rows:[[]], adv}
     {t:'prob', diff:'easy|med|hard', name, pat, idea, code, lang, gotcha, adv}
   adv:true  -> shown only in the 3h ("full") pass.
   ============================================================ */
window.REVIEW = {
  meta: { title: "Last Review", version: 1 },
  stages: [

  /* ==================== 0 · PRE-FLIGHT ==================== */
  {
    id: "pre", noGrade: true, name: "Pre-flight", tag: "Orientation & the plan",
    kicker: "orientation",
    lede: "Three tasks, three hours, one clear head. Here's how the whole review is laid out and how to spend the last day.",
    blocks: [
      { t: "note", tone: "key", flag: "THE FORMAT",
        html: "<p>The final is a <strong>3-hour live session on Google Meet</strong> — <strong>Monday, 13 July, 13:30</strong>. Three tasks: <strong>algorithms / live-coding</strong>, <strong>a SQL / database task (guaranteed)</strong>, and a <strong>schema / design</strong> element. Medium-to-hard, your choice of language — the course leans <strong>Python</strong>. The interviewer runs <strong>Postgres</strong> (Odoo's database).</p><p>A separate <strong>25-minute Coderbyte logic test</strong> happens earlier the same morning — do it calm, before 13:00. A blank page at the end is normal; answer in any order, skip and return.</p>" },
      { t: "note", tone: "", flag: "HOW THIS REVIEW WORKS",
        html: "<p>The track on the left is a single descent. Walk it top to bottom. Each stage ends with a <strong>checkpoint</strong> — rate yourself <em>Shaky / OK / Solid</em>. Anything not Solid resurfaces on the final screen so you know exactly what to revisit. The ring in the header fills as stages go Solid.</p><ul><li><strong>1.5 h — Focused pass:</strong> the core only. Enough to walk in confident.</li><li><strong>3 h — Full pass:</strong> everything, including blocks marked <span class=\"adv-badge\">3h</span> — the deeper gotchas and the complete problem vault.</li></ul><p>Switch length any time from the header (<code>1</code>/<code>2</code> keys). Move with <code>←</code>/<code>→</code> or <code>J</code>/<code>K</code>.</p>" },
      { t: "note", tone: "win", flag: "THE ONE CHEAT-SHEET",
        title: "The 6-step template — run it on every problem",
        html: "<ol><li><strong>Repeat the problem back</strong> in your own words (~30s).</li><li><strong>Ask 2–3 clarifying questions</strong> (size, empty/edge, duplicates, what to return on no-solution).</li><li><strong>Walk the given example by hand</strong>, then invent one more.</li><li><strong>State brute-force + its complexity, then optimize</strong> — out loud, before typing.</li><li><strong>Code the optimized version, narrating</strong> as you go.</li><li><strong>Test on paper</strong> (normal + edge) before running; then discuss trade-offs.</li></ol><p>This single sequence is what the whole first stage drills. If you blank, fall back to it.</p>" },
      { t: "note", tone: "trap", flag: "DAY-OF · NON-NEGOTIABLE",
        html: "<ul><li><strong>Disable Copilot / ChatGPT / all AI assistants.</strong> The recruiter wants to interview <em>you</em>, not a robot. (And I won't be there — this is the last time I help; the live session is yours alone.)</li><li>Test mic + webcam on a real Meet call; bump your IDE font; quiet the linter; open a scratch file.</li><li>Quiet room, phone silenced, 3 hours blocked. Water within reach.</li><li>Join the Meet <strong>10 minutes early</strong>. Bathroom at 13:10.</li><li>The interviewer helping you is <strong>part of the format</strong>, not a bad sign. Take hints immediately and credit them.</li></ul>" }
    ]
  },

  /* ==================== 1 · INTERVIEWER'S EYE ==================== */
  {
    id: "1", name: "The Interviewer's Eye", tag: "What they actually score",
    kicker: "live-coding craft",
    lede: "Stage 1 was Coderbyte — a machine grading output. This is a person grading how you think. Same code, entirely different game.",
    blocks: [
      { t: "note", tone: "key", flag: "SCORED",
        title: "Four dimensions they grade",
        html: "<ol><li><strong>Clarification quality</strong> — did you pin down the problem before coding?</li><li><strong>Approach articulation</strong> — plan + complexity <em>before</em> the keyboard.</li><li><strong>Coding hygiene</strong> — good names, small functions, edge cases handled.</li><li><strong>Trade-off fluency</strong> — can you compare options and justify a choice?</li></ol><p><strong>NOT scored:</strong> raw speed, memorized one-liners, clever tricks. A clear O(n log n) you can explain beats a magic O(n) you can't.</p>" },
      { t: "note", tone: "", flag: "CLARIFY",
        title: "Clarifying-question bank",
        html: "<p><strong>Universal:</strong> input size range? empty / single element? negatives / zeros / duplicates? what to return when there's no answer (empty, <code>None</code>, exception)?</p><p><strong>Strings add:</strong> ASCII or Unicode? case-sensitive? trim whitespace?</p><p><strong>Trees / graphs add:</strong> connected? acyclic? directed? duplicate values? may I mutate the input?</p><p><strong>SQL adds:</strong> which columns are indexed? dialect (Postgres = Odoo default)? do NULLs sort first or last?</p>" },
      { t: "note", tone: "", flag: "NARRATE",
        html: "<p>Narrate at three granularities: <strong>section</strong> (\"first I'll build a frequency map\"), <strong>line</strong> (\"this loop shrinks the window\"), <strong>decision</strong> (\"I'll use a set here for O(1) membership\"). Break any silence longer than ~20 seconds — even \"let me think about the edge case\" counts. Three hours of talking-while-coding is an <em>endurance</em> skill; when you get stuck late, verbalize <em>harder</em>, not less.</p>" },
      { t: "note", tone: "trap", flag: "THE TWO SILENT KILLERS",
        html: "<ul><li><strong>Panic-coding</strong> — typing when you don't yet know the answer. Stop. Pause 30 seconds and think instead.</li><li><strong>Silent-stucking</strong> — productive thinking and being totally lost look <em>identical</em> from the outside. So make thinking audible.</li></ul>" },
      { t: "note", tone: "trap", flag: "MCQ GOTCHAS",
        html: "<ul><li>Even for a problem you instantly recognize (Two Sum): <strong>repeat back + clarify first</strong>. Don't open with code, don't even state brute-force yet (that's step 4), don't ask which language (settled with HR).</li><li>Find a bug mid-code? <strong>Say it out loud, diagnose it, propose the fix out loud.</strong> Silent-fixing looks like you were confused all along; deleting and restarting burns minutes.</li><li>~90 seconds of silence? Drop one narration line. It needn't be brilliant. <strong>Don't apologize</strong> (implies wrongdoing) and don't prematurely beg for a hint (wastes goodwill).</li></ul>" },
      { t: "note", tone: "", flag: "EXTENSIONS", adv: true,
        title: "Follow-up vocabulary (they will push)",
        html: "<ul><li><strong>\"100× bigger\"</strong> → O(n log n) vs O(n), external sort, streaming.</li><li><strong>\"one element at a time\"</strong> → online algorithm, heap, running median.</li><li><strong>\"many queries\"</strong> → precompute: prefix sums, an index, a hash map.</li><li><strong>\"how would you test this?\"</strong> → small, edge, large-random, adversarial.</li></ul><p>Don't <em>code</em> the extension unless asked — naming it is the point.</p>" },
      { t: "note", tone: "", flag: "LANGUAGE & PACING", adv: true,
        html: "<p>Use <strong>Python</strong> unless you're materially stronger elsewhere: batteries (<code>heapq</code>, <code>collections</code>, <code>bisect</code>), readable, and input sizes never make it \"too slow\" for these tasks. The interview runs real CPython, not Pyodide. Ask for a 5-minute break around the 90-minute mark; reset your posture; keep water and a snack close.</p>" }
    ]
  },

  /* ==================== 2 · COMPLEXITY & REFLEXES ==================== */
  {
    id: "2", name: "Complexity & Reflexes", tag: "Big-O + pattern radar",
    kicker: "recap, compressed",
    lede: "Pair every solution you propose with a spoken complexity claim. And train the reflex that maps a problem's smell to a pattern.",
    blocks: [
      { t: "note", tone: "formula", flag: "THE LADDER",
        html: "<p>O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ) &lt; O(n!).</p><p>Consecutive phases → the <strong>max</strong> dominates (not the sum). Recursion cost = (number of calls) × (work per call). Two recursive calls per level → O(2ⁿ). Big-O hides constants — mention them when they matter.</p>" },
      { t: "table", flag: "INPUT SIZE → TARGET COMPLEXITY", title: "Sanity-check before you code (≈10⁸ ops/sec)",
        head: ["n up to", "aim for"],
        rows: [
          ["≤ 10", "O(n!) / O(2ⁿ) fine"],
          ["≤ 20", "O(2ⁿ) — bitmask / meet-in-middle"],
          ["≤ 500", "O(n³)"],
          ["≤ 5,000", "O(n²)"],
          ["≤ 10⁶", "O(n log n) or O(n)"],
          ["huge / streaming", "O(1) or O(log n)"]
        ] },
      { t: "table", flag: "PATTERN RADAR", title: "Problem smell → reach for",
        head: ["When you see…", "Pattern"],
        rows: [
          ["\"contiguous subarray/substring\"", "sliding window / prefix sum"],
          ["\"sorted\" or \"find threshold / min-max\"", "binary search (maybe on the answer)"],
          ["\"match / balance / nested\"", "stack (monotonic → next-greater)"],
          ["\"group by X\" / \"seen before?\"", "hash map / set with a canonical key"],
          ["\"all combinations / permutations\"", "backtracking (choose–explore–unchoose)"],
          ["\"count ways / min cost\", overlaps", "dynamic programming"],
          ["\"shortest path\" / grid / dependencies", "BFS / Dijkstra / topological sort"],
          ["\"top-k\" / \"smallest right now\"", "heap"],
          ["\"kth\", \"median\", \"connected\"", "quickselect / two heaps / union-find"]
        ] },
      { t: "note", tone: "", flag: "ADT CHOICE",
        html: "<p>list (indexed access) · set (membership) · dict (keyed lookup) · stack (LIFO) · deque (both ends O(1)) · heap (min/max in O(log n)). Strings are immutable — build with a list then <code>\"\".join(parts)</code>. Grids are graphs; keep the directions tuple handy: <code>((0,1),(0,-1),(1,0),(-1,0))</code>.</p>" },
      { t: "code", lang: "python", title: "Kadane — the 'rethink the subproblem' classic", adv: true,
        code: "def max_subarray(nums):\n    best = cur = nums[0]\n    for x in nums[1:]:\n        cur = max(x, cur + x)   # best subarray ENDING at x\n        best = max(best, cur)\n    return best",
        note: "<b>Why it matters:</b> brute force is O(n³); redefining the subproblem as \"best ending here\" makes it O(n). The canonical example of beating complexity by reframing." }
    ]
  },

  /* ==================== 3 · ARRAYS / WINDOWS ==================== */
  {
    id: "3", name: "Arrays, Windows & Two Pointers", tag: "The O(n) array idioms",
    kicker: "module 3",
    lede: "A variable window is just two forward-only pointers and an invariant. Master the template and the family collapses into one idea.",
    blocks: [
      { t: "code", lang: "python", title: "Variable-window template",
        code: "def window(s):\n    left = best = 0\n    state = {}                     # whatever the invariant needs\n    for right in range(len(s)):\n        add(s[right], state)\n        while broken(state):       # shrink until valid again\n            remove(s[left], state); left += 1\n        best = max(best, right - left + 1)\n    return best",
        note: "<b>O(n):</b> each pointer moves forward at most n times, so the nested <code>while</code> is amortized O(n) total. Say the word <b>amortized</b> out loud — it's a graded reflex." },
      { t: "table", flag: "STATE / BROKEN", title: "Same template, different fillings",
        head: ["Problem", "state", "broken()"],
        rows: [
          ["Longest substring, no repeats", "set of chars", "char just added is a dup"],
          ["Longest with ≤ k distinct", "char→count map", "len(map) &gt; k"],
          ["Min window covering T", "need/have counts", "(inverted — shrink while <em>valid</em>)"],
          ["Max-sum window, len ≤ k", "running sum", "window length &gt; k"]
        ] },
      { t: "note", tone: "key", flag: "LONGEST vs MINIMUM",
        html: "<p>For a <strong>longest</strong> window: shrink while broken, record when it holds. For <strong>Minimum Window Substring</strong>: expand until valid, then shrink <em>while still valid</em>, recording at each step — the smallest valid window appears right before a shrink breaks it. Same two pointers, opposite recording moment.</p>" },
      { t: "note", tone: "trap", flag: "MONOTONICITY",
        html: "<p>Windows need <strong>monotonicity</strong>. A window that assumes \"extending only grows the sum\" breaks the moment a negative appears — shrink-on-violation can then skip valid answers. For <strong>counting subarrays that sum to exactly k</strong>, the fix is <strong>prefix sum + hash map</strong> (below), which needs no monotonicity. (A range version like sum ≤ k with negatives instead needs a sorted / BIT structure — O(n log n).)</p>" },
      { t: "code", lang: "python", title: "Prefix sum + hash map — count subarrays summing to k (negatives OK)",
        code: "def subarray_sum(nums, k):\n    seen = {0: 1}                   # empty prefix seen once\n    run = total = 0\n    for x in nums:\n        run += x\n        total += seen.get(run - k, 0)\n        seen[run] = seen.get(run, 0) + 1\n    return total",
        note: "P[j+1] − P[i] = sum(i..j). The <code>{0:1}</code> seed covers subarrays that start at index 0. This is the go-to when a window would fail on negatives." },
      { t: "code", lang: "python", title: "Monotonic deque — sliding-window maximum", adv: true,
        code: "from collections import deque\ndef max_sliding_window(nums, k):\n    dq, out = deque(), []          # dq holds indices, values decreasing\n    for i, x in enumerate(nums):\n        while dq and nums[dq[-1]] <= x: dq.pop()\n        dq.append(i)\n        if dq[0] == i - k: dq.popleft()   # expire the front\n        if i >= k - 1: out.append(nums[dq[0]])\n    return out",
        note: "<b>O(n) reason:</b> each index is pushed once and popped at most once — <em>not</em> \"the inner loop runs ≤ k times\". Store indices so you can expire by position. Same skeleton: Next Greater Element, Daily Temperatures, Largest Rectangle." },
      { t: "note", tone: "", flag: "TWO POINTERS, OPPOSITE ENDS", adv: true,
        html: "<p><strong>Container With Most Water:</strong> area = (r−l)·min(h). The shorter wall caps the area, so always move the shorter pointer inward — discarding it loses nothing (state the proof). <strong>Product of Array Except Self:</strong> prefix products left→right, then a suffix sweep right→left reusing the output array — O(1) extra (the output doesn't count), and it dodges the divide-by-zero the division trick hits.</p>" }
    ]
  },

  /* ==================== 4 · HASHING ==================== */
  {
    id: "4", name: "Hashing, Sets & Counting", tag: "Key design, not 'use a dict'",
    kicker: "module 4",
    lede: "The interesting hash problems are about designing the right key. The dict is the easy part.",
    blocks: [
      { t: "note", tone: "key", flag: "CANONICAL KEYS",
        html: "<p>\"Group by X\" → dict-of-lists keyed by a representative that's identical within a group, different across. <strong>Group Anagrams:</strong> key = <code>\"\".join(sorted(w))</code> (O(L log L)) or a 26-count tuple (O(L)). State the trade-off; sorted-key is fine at interview scale.</p><p>Keys must be <strong>hashable / immutable</strong>: <code>tuple</code> not <code>list</code>, <code>frozenset</code> not <code>set</code>. For \"same set of points, any order\" → <code>frozenset(pts)</code> or <code>tuple(sorted(pts))</code>. <code>str(pts)</code> is fragile — it depends on the very ordering you're trying to normalize.</p>" },
      { t: "code", lang: "python", title: "Longest Consecutive Sequence — set + start guard (O(n))",
        code: "def longest_consecutive(nums):\n    s = set(nums); best = 0\n    for x in s:\n        if x - 1 in s: continue     # only walk from a run START\n        y = x\n        while y + 1 in s: y += 1\n        best = max(best, y - x + 1)\n    return best",
        note: "<b>The whole algorithm is</b> <code>if x-1 in s: continue</code>. Without it, [1..n] walks the full run from every element → O(n²). Iterate the <em>set</em>, not the list, or duplicates re-walk." },
      { t: "code", lang: "python", title: "First Missing Positive — array as hash map, O(1) space", adv: true,
        code: "def first_missing_positive(nums):\n    n = len(nums)\n    for i in range(n):\n        while 1 <= nums[i] <= n and nums[nums[i]-1] != nums[i]:\n            j = nums[i] - 1              # compute j FIRST\n            nums[i], nums[j] = nums[j], nums[i]\n    for i in range(n):\n        if nums[i] != i + 1: return i + 1\n    return n + 1",
        note: "Answer lives in 1..n+1; send each value v home to index v−1. Guard on <code>nums[nums[i]-1] != nums[i]</code> (not <code>!= i+1</code>) or you loop forever on duplicates." },
      { t: "note", tone: "trap", flag: "THE ASSIGNMENT TRAP",
        html: "<p><code>nums[i], nums[nums[i]-1] = nums[nums[i]-1], nums[i]</code> is <strong>broken</strong>: Python evaluates the right side, then assigns targets left-to-right, so the second target uses the <em>already-updated</em> <code>nums[i]</code>. Bind <code>j = nums[i]-1</code> first. Mentioning this unprompted is a strong signal — and it's the <em>same</em> trap as House Robber's rolling assignment in DP.</p>" },
      { t: "note", tone: "", flag: "TOP-K & WHEN A DICT IS WRONG",
        html: "<p>Top-K ladder: sort O(n log n) → heap of size k O(n log k) → bucket sort O(n) (counts are bounded by n). A hash map is the <em>wrong</em> tool for: ordering / range queries (use a sorted array + bisect or a tree), repeated min/max with updates (heap), or dense small-integer keys (a plain array).</p>" }
    ]
  },

  /* ==================== 5 · RECURSION / BACKTRACKING ==================== */
  {
    id: "5", name: "Recursion & Backtracking", tag: "choose · explore · un-choose",
    kicker: "module 5",
    lede: "Trust the recursive call. Don't trace the whole tree — define the base case, define how to combine, verify on one tiny example.",
    blocks: [
      { t: "code", lang: "python", title: "Backtracking template",
        code: "def backtrack(path, choices):\n    if is_complete(path):\n        results.append(path.copy())   # SNAPSHOT — see gotcha\n        return\n    for c in available(choices):\n        path.append(c)                # choose\n        backtrack(path, ...)          # explore\n        path.pop()                    # un-choose (mirror choose exactly)",
        note: "The three shapes differ <em>only</em> in <code>available()</code>: permutations (all unused, n!), subsets (items after the last chosen via a start index, 2ⁿ), combinations of size k (start index, stop at depth k)." },
      { t: "note", tone: "trap", flag: "#1 BACKTRACKING BUG",
        html: "<p>Permutations returning <code>[[], [], …]</code> — the right <em>count</em> of empty lists — means <code>results.append(path)</code> stored a live reference the pops later emptied. Fix: <code>path.copy()</code> / <code>path[:]</code> / <code>list(path)</code>. Recognizing this from the symptom alone is a flex.</p>" },
      { t: "note", tone: "key", flag: "TWO PRUNES",
        html: "<p><strong>Feasibility:</strong> Combination Sum with sorted candidates — <code>if c &gt; remaining: break</code> (all later candidates are bigger too, so <code>break</code> abandons the whole row; the \"because it's sorted\" is the part to say aloud). <strong>Symmetry / duplicates:</strong> after sorting, <code>if i &gt; start and c[i] == c[i-1]: continue</code>.</p><p>The <code>i</code> vs <code>i+1</code> in the recursive call is the whole difference between \"reuse allowed\" and \"use once\".</p>" },
      { t: "code", lang: "python", title: "Word Search — in-place mark / restore, O(1) space", adv: true,
        code: "def exist(board, word):\n    R, C = len(board), len(board[0])\n    def dfs(r, c, i):\n        if i == len(word): return True\n        if not (0 <= r < R and 0 <= c < C) or board[r][c] != word[i]:\n            return False\n        board[r][c] = '#'                      # mark visited\n        found = (dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or\n                 dfs(r,c+1,i+1) or dfs(r,c-1,i+1))\n        board[r][c] = word[i]                  # restore\n        return found\n    return any(dfs(r,c,0) for r in range(R) for c in range(C))",
        note: "N-Queens uses the same discipline with three sets — cols, <code>r−c</code> (\\ diagonal), <code>r+c</code> (/ anti-diagonal) — for O(1) attack checks." },
      { t: "note", tone: "", flag: "BACKTRACKING vs DP",
        html: "<p>Need <strong>all solutions</strong> → backtracking. Need a <strong>count or best value</strong> and subproblems repeat → memoize / DP. Word Break, Climb Stairs, and Coin Change <em>sound</em> like backtracking but are DP. Python's recursion limit is ~1000 frames — for deep inputs, say \"I'd use an explicit stack or raise the limit.\"</p>" }
    ]
  },

  /* ==================== 6 · BINARY SEARCH ==================== */
  {
    id: "6", name: "Binary Search", tag: "Invariants over guesswork",
    kicker: "module 6",
    lede: "The most-failed 'easy' topic — one off-by-one and you loop forever. Own one template each for two shapes, and never mix them.",
    blocks: [
      { t: "code", lang: "python", title: "Shape A — exact match (inclusive bounds)",
        code: "def binary_search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target: return mid\n        if nums[mid] < target: lo = mid + 1\n        else: hi = mid - 1\n    return -1",
        note: "Invariant: the answer stays in [lo, hi]. Both branches <em>exclude</em> mid. Writing <code>hi = mid</code> here can leave a 1-element range unchanged → infinite loop." },
      { t: "code", lang: "python", title: "Shape B — boundary / bisect_left (half-open)",
        code: "def bisect_left(a, x):\n    lo, hi = 0, len(a)          # half-open: hi past the end\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if a[mid] < x: lo = mid + 1\n        else: hi = mid          # mid might be the answer — keep it\n    return lo",
        note: "Here <code>hi = mid</code> is safe because floor-div keeps mid &lt; hi, so hi strictly shrinks. <code>bisect_left</code> = first ≥ x, <code>bisect_right</code> = first &gt; x; count of x = right − left." },
      { t: "note", tone: "trap", flag: "DON'T MIX SHAPES",
        html: "<p>Ask: am I finding <strong>one item</strong> (Shape A) or a <strong>boundary between two zones</strong> (Shape B)? Mixing inclusive bounds with <code>hi = mid</code>, or half-open with <code>hi = mid - 1</code>, is the classic infinite-loop bug. In Java/C++, <code>(lo+hi)/2</code> can overflow — use <code>lo + (hi-lo)//2</code>; Python ints don't overflow.</p>" },
      { t: "code", lang: "python", title: "Binary search ON THE ANSWER — Koko eating bananas", adv: true,
        code: "def min_eating_speed(piles, h):\n    def can(k):                       # monotone: faster k => fewer hours\n        return sum((p + k - 1) // k for p in piles) <= h\n    lo, hi = 1, max(piles)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if can(mid): hi = mid\n        else: lo = mid + 1\n    return lo",
        note: "Recipe: (1) write a <code>can(x)</code> check, (2) <em>prove it's monotone</em>, (3) boundary-search the answer space. Family: ship-in-D-days, split-array-largest-sum, min-days-for-bouquets. Check monotonicity <em>before</em> reaching for it — \"count subarrays summing to exactly k\" has no monotone predicate." },
      { t: "note", tone: "", flag: "ROTATED & PEAK", adv: true,
        html: "<p><strong>Rotated array:</strong> one half is always sorted — test <code>nums[lo] &lt;= nums[mid]</code>, check whether the target lies in that sorted half, recurse the right side. <strong>Find Peak:</strong> binary search only needs a rule that discards half, not sortedness — <code>nums[mid] &lt; nums[mid+1]</code> means a peak is to the right.</p>" }
    ]
  },

  /* ==================== 7 · TREES ==================== */
  {
    id: "7", name: "Trees", tag: "Top-down vs bottom-up",
    kicker: "module 7",
    lede: "Before coding a tree problem, ask one question aloud: does this node need to know about its ancestors, or about its subtrees?",
    blocks: [
      { t: "note", tone: "key", flag: "TWO INFO-FLOW DIRECTIONS",
        html: "<p><strong>Top-down</strong> (root→leaves, via parameters, feels preorder): validating constraints, path sums. <strong>Bottom-up</strong> (leaves→root, via return values, feels postorder): height, diameter, subtree aggregates.</p>" },
      { t: "code", lang: "python", title: "Validate BST — pass the range DOWN",
        code: "def is_valid_bst(root):\n    def check(node, lo, hi):\n        if node is None: return True\n        if not (lo < node.val < hi): return False\n        return check(node.left, lo, node.val) and \\\n               check(node.right, node.val, hi)\n    return check(root, float('-inf'), float('inf'))",
        note: "BST validity is a <b>global</b> property. The local check <code>left &lt; node &lt; right</code> fails — a deep right-subtree node can satisfy its parent yet violate an ancestor's bound. ~80% of candidates walk into this. (Alt: an in-order traversal must be strictly increasing.)" },
      { t: "code", lang: "python", title: "Diameter — return one thing, track another", adv: true,
        code: "def diameter_of_binary_tree(root):\n    best = 0\n    def height(node):\n        nonlocal best\n        if node is None: return 0\n        lh, rh = height(node.left), height(node.right)\n        best = max(best, lh + rh)     # a bent path — candidate only\n        return 1 + max(lh, rh)        # a straight chain — passed UP\n    height(root)\n    return best",
        note: "A path bends at most once, so the value you pass up (<code>1+max</code>) must be a straight descent; the bent <code>lh+rh</code> is only tracked on the side. Confusing them yields \"paths\" that fork twice. Same pattern as Max Path Sum." },
      { t: "code", lang: "python", title: "Serialize / deserialize — preorder + null sentinel", adv: true,
        code: "def serialize(root):\n    parts = []\n    def dfs(n):\n        if n is None: parts.append('#'); return\n        parts.append(str(n.val)); dfs(n.left); dfs(n.right)\n    dfs(root); return ','.join(parts)\n\ndef deserialize(data):\n    vals = iter(data.split(','))\n    def build():\n        v = next(vals)\n        if v == '#': return None\n        node = TreeNode(int(v))\n        node.left = build(); node.right = build()\n        return node\n    return build()",
        note: "Preorder + sentinels uniquely determines the tree; deserialize is one forward pass with an iterator — no index bookkeeping. Raise the delimiter-in-value issue unprompted (escape or length-prefix)." },
      { t: "note", tone: "", flag: "LCA & LEVELS",
        html: "<p><strong>LCA:</strong> base case returns the node if it is p, q, or None; if both sides come back non-None the current node is the LCA, else propagate the non-None side. (BST version: walk from the root; the LCA is the first value between p and q — O(h).) <strong>Level-order:</strong> BFS with a queue, snapshotting <code>len(queue)</code> per level → Right Side View = last per level, Zigzag = reverse alternate levels.</p>" }
    ]
  },

  /* ==================== 8 · GRAPHS ==================== */
  {
    id: "8", name: "Graphs", tag: "BFS · topo · Dijkstra · union-find",
    kicker: "module 8",
    lede: "First move on any graph problem: build the adjacency list and say aloud whether it's directed and whether isolated nodes exist.",
    blocks: [
      { t: "table", flag: "DECISION TABLE", title: "Announce your pick from this",
        head: ["Need", "Tool", "Cost"],
        rows: [
          ["Unweighted shortest path", "BFS", "O(V+E)"],
          ["Weighted, non-negative", "Dijkstra (heap)", "O(E log V)"],
          ["Negative edges / detect neg cycle", "Bellman–Ford", "O(V·E)"],
          ["Dependency order / DAG cycle", "Topological sort (Kahn)", "O(V+E)"],
          ["Connectivity / online merge", "Union-Find", "~O(1)"],
          ["Just explore / reachability", "DFS", "O(V+E)"]
        ] },
      { t: "code", lang: "python", title: "Kahn topological sort — also a cycle detector",
        code: "from collections import deque\ndef can_finish(n, prerequisites):\n    graph = [[] for _ in range(n)]; indeg = [0]*n\n    for course, pre in prerequisites:\n        graph[pre].append(course); indeg[course] += 1\n    q = deque(i for i in range(n) if indeg[i] == 0)\n    done = 0\n    while q:\n        node = q.popleft(); done += 1\n        for nxt in graph[node]:\n            indeg[nxt] -= 1\n            if indeg[nxt] == 0: q.append(nxt)\n    return done == n            # survivors with indeg>0 == a cycle",
        note: "Course Schedule <em>is</em> topological sort in disguise. Nodes trapped in a cycle never reach in-degree 0, so <code>done &lt; n</code>." },
      { t: "code", lang: "python", title: "Dijkstra — lazy deletion", adv: true,
        code: "import heapq\ndef shortest(graph, src, n):        # graph[u] = [(v, w), ...]\n    dist = {}; heap = [(0, src)]\n    while heap:\n        d, node = heapq.heappop(heap)\n        if node in dist: continue     # stale duplicate — skip\n        dist[node] = d\n        for nxt, w in graph[node]:\n            if nxt not in dist:\n                heapq.heappush(heap, (d + w, nxt))\n    return dist",
        note: "No decrease-key — push duplicates and discard stale ones on pop. Requires <b>non-negative</b> weights: finalizing a popped node assumes no cheaper path can appear later, which a negative edge would break. Python's heap is a min-heap, so push <code>(dist, node)</code> directly." },
      { t: "code", lang: "python", title: "Union-Find — path halving",
        code: "parent = list(range(n))\ndef find(x):\n    while parent[x] != x:\n        parent[x] = parent[parent[x]]   # halve the path\n        x = parent[x]\n    return x\ndef union(a, b):\n    ra, rb = find(a), find(b)\n    if ra == rb: return False           # already same set (a cycle, undirected)\n    parent[ra] = rb; return True",
        note: "Count components: start at n, subtract 1 per successful union. A union returning False on an undirected graph means you found a cycle." },
      { t: "note", tone: "trap", flag: "TWO GRAPH GOTCHAS", adv: true,
        html: "<p><strong>Word Ladder</strong> (implicit graph, BFS trying 26 letters per position): mark a word visited <em>when you enqueue it</em>, not when you pop it, or nodes re-queue exponentially. <strong>Pacific Atlantic</strong> (reverse thinking — start from the ocean edges and climb uphill, intersect the two reachable sets): use <code>&gt;=</code>, not <code>&gt;</code>, so equal-height plateau edges survive the reversal. If a simulation looks quadratic, ask: <em>can I start from the destination?</em></p>" }
    ]
  },

  /* ==================== 9 · DP ==================== */
  {
    id: "9", name: "Dynamic Programming", tag: "Recursion + a notebook",
    kicker: "module 9",
    lede: "DP is recursion with memoization. State the two properties aloud — optimal substructure and overlapping subproblems — then follow the recipe.",
    blocks: [
      { t: "note", tone: "key", flag: "THE RECIPE",
        html: "<ol><li>Write the <strong>brute-force recursion</strong>.</li><li>Name the <strong>state</strong> = the args that change between calls (1 changing index → 1-D, 2 → 2-D).</li><li><strong>Memoize</strong> (<code>@functools.cache</code> or a dict) → cost collapses to (states × work per state).</li><li>Convert to a bottom-up table <em>only</em> if asked or if recursion depth (~1000) is a risk. A memoized solution is already finished.</li></ol><p>State = the minimum info about past decisions that the <em>future</em> needs — not the full history.</p>" },
      { t: "code", lang: "python", title: "Shape 1 — take/skip (House Robber)",
        code: "def rob(nums):\n    take = skip = 0\n    for x in nums:\n        take, skip = skip + x, max(take, skip)\n    return max(take, skip)",
        note: "Works only because the right side is fully evaluated before assignment. Split it into two statements and the second line sees the new <code>take</code> — silently wrong. Same trap as the First-Missing-Positive swap." },
      { t: "code", lang: "python", title: "Shape 2 — unbounded choice (Coin Change)",
        code: "def coin_change(coins, amount):\n    INF = amount + 1\n    dp = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a: dp[a] = min(dp[a], dp[a-c] + 1)\n    return dp[amount] if dp[amount] <= amount else -1",
        note: "For counting <em>ways</em>: coins in the OUTER loop → combinations (1+2 == 2+1); amount outer → permutations (Combination Sum IV). Loop order changes the DP's meaning — ask whether 1+2 and 2+1 count as the same way." },
      { t: "code", lang: "python", title: "Shape 3 — two sequences (LCS → Edit Distance)", adv: true,
        code: "def lcs(a, b):\n    m, n = len(a), len(b)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(m-1, -1, -1):\n        for j in range(n-1, -1, -1):\n            dp[i][j] = 1 + dp[i+1][j+1] if a[i] == b[j] \\\n                       else max(dp[i+1][j], dp[i][j+1])\n    return dp[0][0]",
        note: "The extra zero row/col is the base case. Edit Distance is the same skeleton with three transitions (replace / delete / insert). Family: Distinct Subsequences, Interleaving String." },
      { t: "code", lang: "python", title: "Shape 4 — LIS in O(n log n)", adv: true,
        code: "import bisect\ndef length_of_lis(nums):\n    tails = []                       # tails[k] = smallest tail of an\n    for x in nums:                   # increasing subseq of length k+1\n        i = bisect.bisect_left(tails, x)\n        if i == len(tails): tails.append(x)\n        else: tails[i] = x\n    return len(tails)",
        note: "<code>tails</code> stays sorted but is NOT an actual subsequence — only its length is the answer. For [10,9,2,5,3,7] it ends as [2,3,7]." },
      { t: "note", tone: "", flag: "DP vs GREEDY vs BACKTRACKING",
        html: "<p>Local best never hurts (exchange argument) → greedy. Count / min / max over exponentially many paths with repeats → DP. Enumerate the actual solutions, or n ≤ ~20 → backtracking. \"How many ways\" / \"min cost\" with n ≤ 10³–10⁴ = DP; \"return all\" = backtracking.</p>" }
    ]
  },

  /* ==================== 10 · GREEDY / INTERVALS ==================== */
  {
    id: "10", name: "Greedy & Intervals", tag: "The sort key decides everything",
    kicker: "module 10",
    lede: "Greedy is only valid with an argument. For intervals, the sort key you choose is the entire solution.",
    blocks: [
      { t: "table", flag: "INTERVAL TOOLKIT", title: "Choose the sort key",
        head: ["Task", "Sort by", "Then"],
        rows: [
          ["Merge overlapping", "start", "extend while next.start ≤ cur.end"],
          ["Max non-overlapping / remove-min", "<b>end</b>", "take if start ≥ last end"],
          ["Min rooms / max concurrent", "sweep line", "+1 start, −1 end, running max"],
          ["Can attend all?", "start", "any next.start &lt; cur.end → no"]
        ] },
      { t: "code", lang: "python", title: "Merge intervals — extend with max, not '='",
        code: "def merge(intervals):\n    intervals.sort()\n    out = []\n    for s, e in intervals:\n        if out and s <= out[-1][1]:\n            out[-1][1] = max(out[-1][1], e)   # NOT = e\n        else:\n            out.append([s, e])\n    return out",
        note: "Sorted by start, a contained interval like [2,3] inside [1,10] must not shrink the merged end back to 3." },
      { t: "note", tone: "key", flag: "SORT BY END FOR SELECTION",
        html: "<p>To keep the most non-overlapping intervals, sort by <strong>end</strong> — earliest-finishing leaves the most room (exchange argument, one sentence). Sort-by-start is the trap: for [1,100],[2,3],[4,5], start-sorting picks [1,100] and rejects both others; end-sorting keeps [2,3],[4,5]. This is a correctness choice, not a speed one.</p>" },
      { t: "code", lang: "python", title: "Sweep line — minimum meeting rooms", adv: true,
        code: "def min_meeting_rooms(intervals):\n    events = []\n    for s, e in intervals:\n        events.append((s, 1)); events.append((e, -1))\n    events.sort()                 # (t,-1) sorts before (t,1)\n    rooms = best = 0\n    for _, d in events:\n        rooms += d; best = max(best, rooms)\n    return best",
        note: "The tie-break — end (−1) before start (+1) at the same instant — lets back-to-back meetings share a room. If <em>touching</em> intervals should conflict, flip it. Ask the interviewer which convention. This is Meeting Rooms II — and it reappears as a SQL running-sum problem." },
      { t: "note", tone: "", flag: "GAS STATION & JUMP GAME", adv: true,
        html: "<p><strong>Gas Station:</strong> if total gas ≥ total cost a unique answer exists; whenever the running tank goes negative, everything from <code>start..i</code> is disqualified together — reset start to i+1. One pass. <strong>Jump Game II</strong> is greedy = BFS layers: track the farthest reach; when i hits the current layer's end, bump the jump count and extend the frontier; never process the last index.</p>" }
    ]
  },

  /* ==================== 11 · HEAPS ==================== */
  {
    id: "11", name: "Heaps & Priority Queues", tag: "\"Smallest thing right now?\"",
    kicker: "module 11",
    lede: "A heap answers one question in O(log n): what's the smallest element right now? It is only partially ordered — never assume you can iterate it in order.",
    blocks: [
      { t: "note", tone: "key", flag: "HEAP FACTS",
        html: "<p>Insert / extract-min O(log n), peek O(1). <strong>heapify an existing array is O(n)</strong>, not O(n log n) — most nodes are near the bottom and barely sift. The array is <em>not</em> sorted; \"I'd iterate the heap in order\" is a red flag (popping n times = heapsort, O(n log n)). Python's <code>heapq</code> is a <strong>min-heap</strong> — negate values for a max-heap.</p>" },
      { t: "code", lang: "python", title: "Top-K largest — a min-heap of size k",
        code: "import heapq\ndef find_kth_largest(nums, k):\n    h = nums[:k]; heapq.heapify(h)\n    for x in nums[k:]:\n        if x > h[0]:                # root = weakest of the best\n            heapq.heapreplace(h, x)\n    return h[0]",
        note: "O(n log k), works on a stream. The root is the gatekeeper the newcomer must beat. A max-heap of k can't evict cheaply; storing everything wastes memory. Offer quickselect (avg O(n)) verbally, but code the heap." },
      { t: "code", lang: "python", title: "Two heaps — streaming median", adv: true,
        code: "import heapq\nsmall, large = [], []            # small = max-heap (negated)\ndef add(x):\n    heapq.heappush(small, -x)\n    heapq.heappush(large, -heapq.heappop(small))\n    if len(large) > len(small):\n        heapq.heappush(small, -heapq.heappop(large))\ndef median():\n    if len(small) > len(large): return -small[0]\n    return (-small[0] + large[0]) / 2",
        note: "Push → move → rebalance restores both invariants <em>unconditionally</em> — no branching on x, so no edge cases on empty heaps or duplicates. Prefer code whose correctness is structural, not case-by-case." },
      { t: "note", tone: "trap", flag: "TUPLE-COMPARISON CRASH",
        html: "<p><code>heappush(h, (dist, node))</code> throws <code>TypeError</code> the moment two <code>dist</code> values tie and Python tries to compare the node objects. Fix with a counter tiebreaker: <code>(dist, i, node)</code>. This bites mid-Dijkstra under pressure — pre-empt it.</p>" },
      { t: "note", tone: "", flag: "k-WAY MERGE", adv: true,
        html: "<p>Merge k sorted lists: a heap holds one candidate per list; pop the global min, push that list's next element. O(N log k). Same skeleton solves kth-smallest in a sorted matrix and smallest-range-covering-k-lists. (In JS there's no built-in heap — a sorted array with binary-insert works up to ~10⁴, or memorize a 20-line MinHeap.)</p>" }
    ]
  },

  /* ==================== 12 · LINKED LISTS / MATH / BITS ==================== */
  {
    id: "12", name: "Linked Lists, Math & Bits", tag: "Pointer surgery & number craft",
    kicker: "module 2b",
    lede: "Pointer bugs are the classic live-interview time sink. Draw the three-pointer surgery on paper until it's muscle memory.",
    blocks: [
      { t: "code", lang: "python", title: "Reverse a linked list — write it from memory",
        code: "prev, curr = None, head\nwhile curr:\n    nxt = curr.next     # remember next FIRST (only rope to the rest)\n    curr.next = prev    # rewire\n    prev, curr = curr, nxt\n# prev is the new head",
        note: "A <b>dummy head</b> sentinel removes the \"is this the first append?\" special case and is the basis of merge-two-sorted-lists and list-building with a carry (Add Two Numbers)." },
      { t: "code", lang: "python", title: "Fast / slow pointers",
        code: "slow = fast = head\nwhile fast and fast.next:\n    slow = slow.next\n    fast = fast.next.next\n# slow is the middle; if fast met slow again, there's a cycle",
        note: "Floyd cycle detection: once both are in the cycle the gap shrinks by 1 per step, so they meet. To find the cycle's <em>entry</em>, reset one pointer to head and advance both by 1 until they collide." },
      { t: "code", lang: "python", title: "Sieve of Eratosthenes", adv: true,
        code: "is_prime = [True] * n\nis_prime[0] = is_prime[1] = False\nfor i in range(2, int(n**0.5) + 1):\n    if is_prime[i]:\n        for j in range(i*i, n, i):   # start at i*i, not 2*i\n            is_prime[j] = False",
        note: "Inner loop starts at <code>i*i</code>: every smaller multiple k·i (k &lt; i) was already crossed off by a smaller prime factor. Say this unprompted. O(n log log n)." },
      { t: "code", lang: "python", title: "Fast modular power — square and multiply", adv: true,
        code: "def power_mod(base, exp, m):\n    result = 1; base %= m\n    while exp:\n        if exp & 1: result = result * base % m\n        base = base * base % m\n        exp >>= 1\n    return result",
        note: "Take <code>% m</code> at <em>every</em> multiply to keep numbers bounded. Mention the built-in <code>pow(base, exp, m)</code>, then write the loop." },
      { t: "note", tone: "formula", flag: "BIT TRICKS",
        html: "<ul><li>Power of two: <code>n &gt; 0 and (n &amp; (n-1)) == 0</code>.</li><li>Clear the lowest set bit: <code>n &amp;= n - 1</code> — loop it to count set bits (Hamming weight / Brian Kernighan).</li><li>Isolate the lowest set bit: <code>n &amp; -n</code>.</li><li>XOR: <code>a ^ a = 0</code>, <code>a ^ 0 = a</code>, order-independent → the single non-duplicated element is the XOR of all.</li></ul><p>Python's <code>%</code> takes the divisor's sign (<code>-7 % 10 == 3</code>); C/Java keep the dividend's. For C-style behavior use <code>math.fmod</code> or strip the sign first. <code>mod = 10**9 + 7</code> prevents overflow and gives a unique answer.</p>" }
    ]
  },

  /* ==================== 13 · SQL ==================== */
  {
    id: "13", name: "SQL Deep Dive", tag: "Guaranteed task — own it",
    kicker: "module 12 + quick-ref",
    lede: "One of the three tasks is SQL, guaranteed, on Postgres. You know the basics — this is the intermediate layer that separates candidates.",
    blocks: [
      { t: "code", lang: "sql", title: "Logical processing order — the mental model",
        code: "SELECT   col, AGG(x)         -- 5. compute output columns (aliases born here)\nFROM     t                    -- 1. sources\nJOIN     u ON u.tid = t.id     -- 1. glue tables\nWHERE    t.active             -- 2. filter ROWS (no aggregates, no SELECT aliases)\nGROUP BY col                  -- 3. collapse into groups\nHAVING   COUNT(*) > 1          -- 4. filter GROUPS (aggregates allowed)\nORDER BY AGG(x) DESC           -- 6. sort (aliases OK here)\nLIMIT 10 OFFSET 20;           -- 7. paginate",
        note: "<b>WHERE runs before GROUP BY</b> → it can't see aggregates or SELECT aliases. Aggregate conditions go in <b>HAVING</b>. Filtering <code>WHERE avg_g &gt; 80</code> fails for two independent reasons — say both." },
      { t: "note", tone: "trap", flag: "THREE SQL LANDMINES",
        html: "<ul><li><strong>NOT IN + a NULL:</strong> <code>x NOT IN (1, 2, NULL)</code> expands to <code>… AND x &lt;&gt; NULL</code>, which is UNKNOWN, so the whole predicate is never true → <strong>zero rows</strong>. On any \"spot the bug\" SQL question, check NOT IN against a nullable column first. Use <code>NOT EXISTS</code> or <code>LEFT JOIN … IS NULL</code>.</li><li><strong>LEFT JOIN filter trap:</strong> a condition on the right table in <code>WHERE</code> runs after the NULL-padding and silently turns your LEFT JOIN into an INNER JOIN. Put it in the <code>ON</code> clause instead.</li><li><strong>= NULL</strong> matches nothing — always <code>IS NULL</code>. Aggregates skip NULLs; <code>COUNT(*)</code> counts rows, <code>COUNT(col)</code> skips NULLs.</li></ul>" },
      { t: "code", lang: "sql", title: "LEFT JOIN — ON vs WHERE",
        code: "-- \"every customer, plus their 2024 orders if any\"\nSELECT c.name, o.id\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id AND o.year = 2024;   -- correct\n\n-- WRONG: WHERE o.year = 2024 drops customers with no 2024 order\n-- (their o.year is NULL, and NULL = 2024 is not true)",
        note: "The condition that decides <em>which right rows match</em> belongs in ON; a condition that filters the final result belongs in WHERE." },
      { t: "note", tone: "key", flag: "WINDOW FUNCTIONS",
        html: "<p>A window function computes across rows <em>without collapsing them</em> — every row survives, now carrying a rank or running value. <code>FUNC(...) OVER (PARTITION BY … ORDER BY …)</code>. They can't appear in <code>WHERE</code>, so wrap them in a subquery/CTE to filter.</p><ul><li><code>ROW_NUMBER()</code> → 1,2,3,4 (dedup, pagination, pick-one-per-group)</li><li><code>RANK()</code> → 1,2,2,4 (ties share, then a gap)</li><li><code>DENSE_RANK()</code> → 1,2,2,3 (ties share, <strong>no gap</strong> — the Nth-distinct-value answer)</li><li><code>LAG/LEAD</code> → previous / next row; <code>SUM() OVER (ORDER BY …)</code> → running total</li></ul>" },
      { t: "code", lang: "sql", title: "Top-N per group — rank in a subquery, filter outside",
        code: "SELECT * FROM (\n  SELECT e.*,\n         DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rk\n  FROM employees e\n) ranked\nWHERE rk <= 3;",
        note: "DENSE_RANK for \"top 3 distinct salaries\" (ties share a rank). The subquery is mandatory — WHERE can't see a window alias from the same level. Same shape: latest order per customer (ROW_NUMBER = 1), dedup keeping newest." },
      { t: "code", lang: "sql", title: "The patterns worth having ready", adv: true,
        code: "-- 2nd highest (generalises to Nth via OFFSET N-1 or DENSE_RANK = N)\nSELECT DISTINCT salary FROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS r\n  FROM employee) t\nWHERE r = 2;\n\n-- employees earning more than their manager (self-join)\nSELECT e.name FROM employee e\nJOIN employee m ON e.manager_id = m.id\nWHERE e.salary > m.salary;\n\n-- month-over-month delta without a self-join (LAG)\nSELECT month, revenue - LAG(revenue) OVER (ORDER BY month) AS delta\nFROM monthly;\n\n-- conditional aggregation (rates, pivots, %)\nSELECT day,\n       AVG(CASE WHEN status LIKE 'cancelled%' THEN 1.0 ELSE 0 END) AS cancel_rate\nFROM trips GROUP BY day;",
        note: "Integer division bites: in Postgres/SQLite <code>1/2 = 0</code> — multiply by 1.0 or CAST. Guard divide-by-zero with <code>x / NULLIF(y, 0)</code>." },
      { t: "note", tone: "", flag: "DIALECT (say 'Postgres-flavored')", adv: true,
        html: "<p>Concat: <code>||</code> standard, <code>CONCAT()</code> in MySQL (where <code>||</code> means OR). Case-insensitive: <code>ILIKE</code> in Postgres, else <code>LOWER(a) = LOWER(b)</code>. Top-N: <code>LIMIT n OFFSET m</code> (PG/SQLite/MySQL) vs <code>FETCH FIRST n ROWS</code> (Oracle/SQL Server). Recursive CTE (<code>WITH RECURSIVE</code>) walks a manager→report tree: seed the root, recurse on <code>parent_id = n.id</code>.</p>" }
    ]
  },

  /* ==================== 14 · DB DESIGN ==================== */
  {
    id: "14", name: "Database Design & Indexes", tag: "The Odoo-favorite task",
    kicker: "module 13",
    lede: "Schema design plus indexing. One question here — clustered vs non-clustered — has appeared verbatim in real Odoo final-round reports.",
    blocks: [
      { t: "note", tone: "key", flag: "SCHEMA WALK-THROUGH",
        html: "<p>Five steps: <strong>nouns → entities</strong>; <strong>verbs → relationships</strong> (say the cardinality aloud — 1:N, N:M); <strong>tables + keys</strong> (surrogate PK, FK on the many side, a junction table for N:M); <strong>constraints as documentation</strong> (NOT NULL / UNIQUE / CHECK); <strong>indexes from the workload</strong>, never speculatively.</p><p>Classic follow-up: \"what if the price changes after purchase?\" → <strong>snapshot</strong> the unit price into the order line. Rows record history; the catalog records the present.</p>" },
      { t: "note", tone: "trap", flag: "ASKED VERBATIM AT ODOO",
        title: "Clustered vs non-clustered index",
        html: "<p><strong>Clustered</strong> = the table itself is physically ordered by the key; exactly one per table; the row lives right there → unbeatable range scans. <strong>Non-clustered</strong> = a separate key→pointer structure; many allowed; a second hop to fetch the row → great for point lookups on non-key columns.</p><p><strong>Postgres nuance (this is Odoo):</strong> Postgres has <em>no</em> clustered index — every table is a heap and every index is secondary. <code>CLUSTER</code> sorts once but doesn't stay sorted. Give the standard answer, then add this nuance = expert.</p>" },
      { t: "note", tone: "key", flag: "COMPOSITE INDEX + LEFTMOST PREFIX",
        html: "<p>An index on <code>(customer_id, created_at)</code> serves <code>WHERE customer_id = ?</code>, <code>… AND created_at &gt; ?</code>, and <code>ORDER BY created_at</code> (a free sort) — but <strong>nothing</strong> for <code>WHERE created_at &gt; ?</code> alone (dates are only ordered <em>within</em> a customer). Rule: equality-filtered columns first, range / sort columns last. A <strong>covering index</strong> includes every column the query touches → index-only scan.</p>" },
      { t: "note", tone: "", flag: "NORMALIZATION & WHEN INDEXES HURT", adv: true,
        html: "<p>\"Every non-key column depends on the key, the whole key, and nothing but the key\" (1NF atomic → 2NF no partial dependency → 3NF no transitive dependency). Storing <code>customer_email</code> on <code>orders</code> alongside <code>customer_id</code> is a <strong>3NF violation</strong> (transitive dependency → update anomaly) — keep email in <code>customers</code> and join. Snapshotting defends only values <em>meant</em> to be frozen (price, shipping address), not a live contact email.</p><p>Indexes cost: every write maintains every index; low-selectivity columns (is_active) barely help; a function on an indexed column disables it (<code>WHERE YEAR(created_at) = 2024</code> → rewrite as a range); leading-wildcard <code>LIKE '%foo'</code> can't use a B-tree. Closing move: <code>EXPLAIN ANALYZE</code> before and after.</p>" },
      { t: "note", tone: "", flag: "ACID, ISOLATION & N+1", adv: true,
        html: "<p><strong>ACID</strong> = Atomicity, Consistency, Isolation, Durability (WAL). Isolation weakest→strongest: read-uncommitted → read-committed (Postgres default) → repeatable-read → serializable. The <strong>lost-update</strong> race (two txns read stock 1, both decrement) is prevented by <code>SELECT … FOR UPDATE</code> or an atomic <code>UPDATE stock SET qty = qty - 1 WHERE qty &gt;= 1</code> (check the affected-row count), backstopped by a <code>CHECK</code>. <strong>ORM N+1</strong>: fetching 100 orders then a customer each = 1+100 queries; fix by eager-loading (JOIN) or batching (<code>WHERE id IN (…)</code>). Symptom: \"page slow, log shows hundreds of identical queries with different ids.\"</p>" }
    ]
  },

  /* ==================== 15 · OOP ==================== */
  {
    id: "15", name: "OOP & Design", tag: "SOLID smells, composition-first",
    kicker: "module 14",
    lede: "Apply the principles to a smell — don't recite them. And default to composition; inherit only for a true, substitutable is-a.",
    blocks: [
      { t: "table", flag: "SOLID SMELLS", title: "Recognize the violation",
        head: ["Letter", "Smell you'd point at"],
        rows: [
          ["S — single responsibility", "a ReportManager that queries + formats + emails"],
          ["O — open/closed", "an ever-growing <code>if type == …</code> chain"],
          ["L — Liskov", "an override that raises NotImplementedError or ignores args"],
          ["I — interface segregation", "8 no-op methods to satisfy one interface"],
          ["D — dependency inversion", "<code>StripeClient()</code> constructed inside the class you want to test"]
        ] },
      { t: "note", tone: "key", flag: "COMPOSITION vs INHERITANCE",
        html: "<p>Default to <strong>composition</strong> (has-a, swappable behavior). Inherit only for a genuine, substitutable is-a — it's the tightest coupling, and you inherit every parent decision, including future ones. <code>class Stack(list)</code> is broken (callers can <code>insert()</code> mid-stack and break LIFO); compose with <code>self._items = []</code> instead.</p>" },
      { t: "note", tone: "trap", flag: "LISKOV — square / rectangle",
        html: "<p><code>Square(Rectangle)</code> that overrides <code>set_width</code> to also change height breaks any code resizing rectangles — the square can't honor the parent's promise. English \"a square is a rectangle\" ≠ behavioral substitutability. Fix: sibling classes under a common abstraction, composition, or immutability. Needing callers to type-check is the <em>symptom</em> of the violation, not the fix.</p>" },
      { t: "note", tone: "", flag: "PATTERNS THAT EARN THEIR KEEP",
        html: "<p>A growing <code>if/elif</code> over 'card'/'paypal'/'crypto' → <strong>Strategy</strong> (often via a <strong>Factory</strong> dict: <code>PROCESSORS[method].pay(amount)</code>) — new methods add, existing untouched. <strong>Observer</strong>: N things react to an event the source doesn't know about (a list of callbacks). In Python, strategies can be plain functions; <code>sorted(key=…)</code> already <em>is</em> strategy. Knowing when a pattern is <em>unnecessary</em> is the senior half.</p>" },
      { t: "note", tone: "", flag: "PYTHON OBJECT TOOLKIT", adv: true,
        html: "<p>Dunders: <code>__init__ / __repr__ / __eq__ + __hash__</code> (for dict keys) <code>/ __len__ / __enter__ + __exit__</code>. <code>@dataclass</code> kills boilerplate; <code>@classmethod</code> = alternate constructors; <code>@property</code> turns an attribute into a computed value without breaking callers. <strong>MRO:</strong> multiple inheritance resolves left-to-right (C3); <code>super()</code> means \"next in line,\" not \"my parent\" — in a diamond that's the sibling. Odoo's model system is exactly this: cooperative multiple inheritance + mixins.</p>" }
    ]
  },

  /* ==================== 16 · SYSTEM DESIGN ==================== */
  {
    id: "16", name: "System Design", tag: "Data model + defensible scaling",
    kicker: "module 15",
    lede: "Turn a product sentence into a data model, an API, and scaling decisions you can justify with a number. Do the arithmetic out loud.",
    blocks: [
      { t: "note", tone: "key", flag: "4-STEP FRAMEWORK",
        html: "<ol><li><strong>Requirements (~3 min):</strong> 3–5 features + explicitly cut scope; then reads/writes ratio, scale, latency, consistency.</li><li><strong>API sketch (~2 min):</strong> endpoints with verbs + payloads.</li><li><strong>Data model (~10 min):</strong> the schema walk-through — graded hardest at this level.</li><li><strong>Deep dives:</strong> caching, write path under concurrency, 10× traffic — one layer at a time, only when a number justifies it.</li></ol><p>Every scaling decision gets a \"because\" with a number.</p>" },
      { t: "note", tone: "trap", flag: "DO THE ARITHMETIC",
        html: "<p>Seconds/day ≈ 86,400 ≈ 10⁵, so <strong>1M requests/day ≈ 12 QPS</strong> — tiny. One Postgres box handles thousands of simple QPS; a cached point lookup is &lt;1 ms; Redis GET ~0.1 ms. Dividing out loud resets the room — candidates panic into microservices and Kafka for 12 QPS. Naming tech before requirements is the #1 red flag.</p>" },
      { t: "note", tone: "", flag: "PATTERNS FOR 80% OF FOLLOW-UPS", adv: true,
        html: "<ul><li><strong>Cache-aside:</strong> read → miss → DB → fill; on write, update DB and <em>delete</em> the key (don't update it). Guard stampedes with a lock or TTL jitter.</li><li><strong>Idempotency keys:</strong> client sends a unique key; server stores processed keys under a UNIQUE constraint → retries and double-clicks don't double-charge.</li><li><strong>Cursor pagination</strong> over OFFSET: <code>WHERE (created_at, id) &lt; (last_seen) ORDER BY … LIMIT 20</code> — seeks directly, stable under inserts. OFFSET 100000 scans and discards 100k rows.</li><li><strong>Outbox:</strong> write the event in the <em>same transaction</em> as the data; a relay publishes it — solves \"DB committed but the queue publish failed.\"</li><li><strong>Queue + idempotent workers:</strong> at-least-once delivery means duplicates; the consumer must be idempotent. \"Switch to exactly-once\" isn't a checkbox — you achieve the exactly-once <em>effect</em> via idempotency.</li></ul>" },
      { t: "note", tone: "", flag: "BUILDING BLOCKS", adv: true,
        html: "<p>Stateless app servers + load balancer (sessions → signed cookies / shared store) · read replicas when reads dwarf writes (mind replication lag; read-your-own-writes from the primary) · object storage + CDN for files (DB keeps metadata + key, presigned URLs) · a rate limiter as a token bucket with state in Redis (<code>INCR key; EXPIRE 60</code>, atomic) · sharding as a <em>last</em> resort. Escalate cache → replica → shard in that order; the order is graded.</p>" }
    ]
  },

  /* ==================== 17 · PROBLEM VAULT ==================== */
  {
    id: "17", name: "The Problem Vault", tag: "Highest-yield problems",
    kicker: "curated bank",
    lede: "The problems whose review teaches the most. Tap to expand. In the 1.5h pass this is the top tier; the 3h pass unlocks the rest.",
    blocks: [
      { t: "note", tone: "", flag: "HOW TO USE THIS",
        html: "<p>Don't re-derive these under a timer now — read the <em>idea</em>, glance at the shape, and note the <em>watch</em>. If any feels unfamiliar, that's your signal to rate this stage Shaky and open it again. The <span class=\"adv-badge\">3h</span> entries are the second tier — turn on the full pass to see them.</p>" },

      { t: "prob", diff: "hard", name: "Minimum Window Substring", pat: "sliding window · LC 76",
        idea: "Counter(t) + a single <code>missing</code> counter. Expand right; when <code>missing == 0</code>, shrink left while the window stays valid, recording the smallest.",
        lang: "python",
        code: "from collections import Counter\ndef min_window(s, t):\n    need = Counter(t); missing = len(t)\n    left = 0; best = (float('inf'), 0, 0)\n    for right, ch in enumerate(s):\n        if need[ch] > 0: missing -= 1\n        need[ch] -= 1\n        if missing == 0:\n            while need[s[left]] < 0:\n                need[s[left]] += 1; left += 1\n            if right - left + 1 < best[0]:\n                best = (right - left + 1, left, right + 1)\n            need[s[left]] += 1; missing += 1; left += 1\n    return s[best[1]:best[2]] if best[0] < float('inf') else ''",
        gotcha: "Negative <code>need</code> values mark surplus chars the shrink loop can safely drop. The window shrinks while <em>valid</em>, not while broken — the boss of the whole window family." },

      { t: "prob", diff: "hard", name: "Sliding Window Maximum", pat: "monotonic deque · LC 239",
        idea: "Deque of indices with strictly decreasing values; pop dominated from the back, expired from the front; the front is the window max.",
        lang: "python",
        code: "from collections import deque\ndef max_sliding_window(nums, k):\n    dq, out = deque(), []\n    for i, x in enumerate(nums):\n        while dq and nums[dq[-1]] <= x: dq.pop()\n        dq.append(i)\n        if dq[0] == i - k: dq.popleft()\n        if i >= k - 1: out.append(nums[dq[0]])\n    return out",
        gotcha: "Each index enters and leaves once → amortized O(n). Gateway to Next Greater Element / Daily Temperatures / Largest Rectangle." },

      { t: "prob", diff: "med", name: "Subarray Sum Equals K", pat: "prefix + hashmap · LC 560",
        idea: "Running prefix sum; count how many earlier prefixes equal <code>run − k</code>. Seed <code>{0:1}</code>.",
        lang: "python",
        code: "def subarray_sum(nums, k):\n    seen = {0: 1}; run = total = 0\n    for x in nums:\n        run += x\n        total += seen.get(run - k, 0)\n        seen[run] = seen.get(run, 0) + 1\n    return total",
        gotcha: "Be ready to say <em>why</em> a sliding window fails here: negatives break monotonicity." },

      { t: "prob", diff: "hard", name: "First Missing Positive", pat: "index-as-hash · LC 41",
        idea: "Answer ∈ 1..n+1. Cyclically swap each value home to index value−1, then find the first mismatch. O(1) space.",
        lang: "python",
        code: "def first_missing_positive(nums):\n    n = len(nums)\n    for i in range(n):\n        while 1 <= nums[i] <= n and nums[nums[i]-1] != nums[i]:\n            j = nums[i] - 1\n            nums[i], nums[j] = nums[j], nums[i]\n    for i in range(n):\n        if nums[i] != i + 1: return i + 1\n    return n + 1",
        gotcha: "Guard <code>nums[nums[i]-1] != nums[i]</code> (not <code>!= i+1</code>) or you loop forever on duplicates; bind <code>j</code> before the swap." },

      { t: "prob", diff: "hard", name: "Serialize / Deserialize Binary Tree", pat: "preorder + sentinel · LC 297",
        idea: "Serialize = preorder DFS emitting '#' for None. Deserialize = an iterator over tokens, recursing left then right.",
        lang: "python",
        code: "def serialize(root):\n    p = []\n    def dfs(n):\n        if n is None: p.append('#'); return\n        p.append(str(n.val)); dfs(n.left); dfs(n.right)\n    dfs(root); return ','.join(p)\n\ndef deserialize(data):\n    it = iter(data.split(','))\n    def build():\n        v = next(it)\n        if v == '#': return None\n        n = TreeNode(int(v)); n.left = build(); n.right = build(); return n\n    return build()",
        gotcha: "Preorder + sentinels uniquely determines the tree; deserialize is one forward pass — no index bookkeeping." },

      { t: "prob", diff: "hard", name: "Department Top-3 Salaries", pat: "window · SQL · LC 185",
        idea: "DENSE_RANK partitioned by department, ordered by salary DESC, in a subquery; filter rk ≤ 3 outside.",
        lang: "sql",
        code: "SELECT d.name AS department, e.name AS employee, e.salary\nFROM (\n  SELECT *, DENSE_RANK() OVER (PARTITION BY department_id\n           ORDER BY salary DESC) AS rk\n  FROM employee\n) e\nJOIN department d ON e.department_id = d.id\nWHERE e.rk <= 3;",
        gotcha: "DENSE_RANK, not RANK/ROW_NUMBER — \"top 3 distinct salary values,\" ties share a rank. The subquery is required because WHERE can't see the window alias." },

      { t: "prob", diff: "med", name: "Course Schedule", pat: "topo sort / Kahn · LC 207",
        idea: "Indegree array + queue of zero-indegree nodes; count processed; done == n ⟺ acyclic.",
        lang: "python",
        code: "from collections import deque\ndef can_finish(n, prereqs):\n    graph = [[] for _ in range(n)]; indeg = [0]*n\n    for c, p in prereqs:\n        graph[p].append(c); indeg[c] += 1\n    q = deque(i for i in range(n) if indeg[i] == 0); done = 0\n    while q:\n        node = q.popleft(); done += 1\n        for nxt in graph[node]:\n            indeg[nxt] -= 1\n            if indeg[nxt] == 0: q.append(nxt)\n    return done == n",
        gotcha: "Cycle nodes never reach indegree 0, so the count doubles as a cycle detector." },

      { t: "prob", diff: "med", name: "Koko Eating Bananas", pat: "binary search on answer · LC 875",
        idea: "<code>can(k)</code> = hours to finish at speed k is monotone in k; boundary-search k in [1, max(piles)].",
        lang: "python",
        code: "def min_eating_speed(piles, h):\n    def can(k): return sum((p + k - 1)//k for p in piles) <= h\n    lo, hi = 1, max(piles)\n    while lo < hi:\n        mid = (lo + hi)//2\n        if can(mid): hi = mid\n        else: lo = mid + 1\n    return lo",
        gotcha: "The archetype: write the check, prove monotonicity, search the answer space. <code>(p+k-1)//k</code> is ceil-div." },

      { t: "prob", diff: "med", name: "LRU Cache", pat: "design · hashmap + DLL · LC 146",
        idea: "OrderedDict (a doubly-linked list in disguise): get moves the key to the end; put evicts from the front when over capacity.",
        lang: "python",
        code: "from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, capacity):\n        self.cap = capacity; self.d = OrderedDict()\n    def get(self, key):\n        if key not in self.d: return -1\n        self.d.move_to_end(key); return self.d[key]\n    def put(self, key, value):\n        if key in self.d: self.d.move_to_end(key)\n        self.d[key] = value\n        if len(self.d) > self.cap: self.d.popitem(last=False)",
        gotcha: "A get is also a \"use\" — refresh recency. Still describe the underlying hashmap + doubly-linked-list design aloud." },

      { t: "prob", diff: "med", name: "Meeting Rooms II", pat: "sweep line · LC 253",
        idea: "+1 at each start, −1 at each end; sort with ends before starts on ties; the running max is the room count.",
        lang: "python",
        code: "def min_meeting_rooms(intervals):\n    events = []\n    for s, e in intervals:\n        events.append((s, 1)); events.append((e, -1))\n    events.sort()\n    rooms = best = 0\n    for _, d in events:\n        rooms += d; best = max(best, rooms)\n    return best",
        gotcha: "The (time, delta) tie-break frees a room before a same-instant meeting claims one. This exact sweep reappears as a SQL running-SUM problem." },

      { t: "prob", diff: "med", name: "Coin Change", pat: "unbounded knapsack DP · LC 322",
        idea: "<code>dp[a]</code> = min coins for amount a = min over coins of <code>dp[a−c] + 1</code>.",
        lang: "python",
        code: "def coin_change(coins, amount):\n    INF = amount + 1\n    dp = [0] + [INF]*amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a: dp[a] = min(dp[a], dp[a-c] + 1)\n    return dp[amount] if dp[amount] <= amount else -1",
        gotcha: "Use INF = amount+1 as a safe \"impossible\" marker so <code>+1</code> never overflows a real answer." },

      { t: "prob", diff: "hard", name: "Word Ladder", pat: "BFS on implicit graph · LC 127", adv: true,
        idea: "Words are nodes, one-letter diffs are edges. BFS trying all 26 letters at each position; mark visited by removing from the set on enqueue.",
        lang: "python",
        code: "from collections import deque\nimport string\ndef ladder_length(begin, end, word_list):\n    words = set(word_list)\n    if end not in words: return 0\n    q = deque([(begin, 1)]); words.discard(begin)\n    while q:\n        word, steps = q.popleft()\n        if word == end: return steps\n        for i in range(len(word)):\n            for ch in string.ascii_lowercase:\n                nxt = word[:i] + ch + word[i+1:]\n                if nxt in words:\n                    words.discard(nxt); q.append((nxt, steps + 1))\n    return 0",
        gotcha: "Remove a word from the set <em>when you queue it</em>, not when you pop it, or nodes re-queue exponentially." },

      { t: "prob", diff: "hard", name: "Median of Two Sorted Arrays", pat: "binary search partition · LC 4", adv: true,
        idea: "Binary-search the cut in the shorter array; the matching cut in the other makes the left half exactly half the elements. Verify <code>maxLeftA ≤ minRightB</code> and <code>maxLeftB ≤ minRightA</code>.",
        lang: "python",
        code: "def find_median_sorted_arrays(a, b):\n    if len(a) > len(b): a, b = b, a\n    m, n = len(a), len(b); half = (m + n + 1)//2\n    lo, hi = 0, m\n    while lo <= hi:\n        i = (lo + hi)//2; j = half - i\n        mla = a[i-1] if i > 0 else float('-inf')\n        mra = a[i]   if i < m else float('inf')\n        mlb = b[j-1] if j > 0 else float('-inf')\n        mrb = b[j]   if j < n else float('inf')\n        if mla <= mrb and mlb <= mra:\n            if (m + n) % 2: return float(max(mla, mlb))\n            return (max(mla, mlb) + min(mra, mrb)) / 2\n        if mla > mrb: hi = i - 1\n        else: lo = i + 1",
        gotcha: "A median is a partition into equal halves where everything left ≤ everything right; ±inf sentinels handle the empty sides. Even a spoken sketch earns points." },

      { t: "prob", diff: "med", name: "Edit Distance", pat: "2-D DP, 1-D space · LC 72", adv: true,
        idea: "<code>dp[j]</code> = edits between prefixes; match → the diagonal, else 1 + min(replace, delete, insert).",
        lang: "python",
        code: "def min_distance(a, b):\n    m, n = len(a), len(b)\n    dp = list(range(n + 1))\n    for i in range(1, m + 1):\n        prev = dp[0]; dp[0] = i\n        for j in range(1, n + 1):\n            cur = dp[j]\n            dp[j] = prev if a[i-1] == b[j-1] else 1 + min(prev, cur, dp[j-1])\n            prev = cur\n    return dp[n]",
        gotcha: "The three transitions are replace / delete / insert; keep a saved <code>prev</code> for the diagonal. The template for all sequence DP." },

      { t: "prob", diff: "hard", name: "Running Median (stream)", pat: "two heaps · LC 295", adv: true,
        idea: "Max-heap of the low half + min-heap of the high half, sizes balanced; the median comes from the tops.",
        lang: "python",
        code: "import heapq\nsmall, large = [], []\ndef add(x):\n    heapq.heappush(small, -x)\n    heapq.heappush(large, -heapq.heappop(small))\n    if len(large) > len(small):\n        heapq.heappush(small, -heapq.heappop(large))\ndef median():\n    return -small[0] if len(small) > len(large) else (-small[0] + large[0]) / 2",
        gotcha: "Push → move → rebalance restores the invariant with no branching on x — structurally correct, no edge cases." },

      { t: "prob", diff: "med", name: "Product of Array Except Self", pat: "prefix/suffix · LC 238", adv: true,
        idea: "Fill the output with left-prefix products, then sweep right multiplying a running suffix. No division; O(1) extra.",
        lang: "python",
        code: "def product_except_self(nums):\n    n = len(nums); out = [1]*n\n    for i in range(1, n): out[i] = out[i-1] * nums[i-1]\n    suf = 1\n    for i in range(n-1, -1, -1):\n        out[i] *= suf; suf *= nums[i]\n    return out",
        gotcha: "Division is banned because of zeros; the two-pass method handles them naturally." },

      { t: "prob", diff: "easy", name: "Customers Who Never Order", pat: "anti-join · SQL · LC 183", adv: true,
        idea: "LEFT JOIN + <code>o.id IS NULL</code>, or NOT EXISTS. Both are NULL-safe.",
        lang: "sql",
        code: "SELECT c.name AS customers\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;",
        gotcha: "The planted landmine is <code>NOT IN (subquery with a NULL)</code> → zero rows. Know all three idioms and why NOT IN is dangerous." },

      { t: "prob", diff: "med", name: "Combination Sum", pat: "backtracking · reuse · LC 39", adv: true,
        idea: "Sort; recurse on (start, remaining). Passing <code>i</code> (not <code>i+1</code>) allows reuse; <code>break</code> when a candidate exceeds the remainder.",
        lang: "python",
        code: "def combination_sum(candidates, target):\n    candidates.sort(); res = []; path = []\n    def bt(start, rem):\n        if rem == 0: res.append(path.copy()); return\n        for i in range(start, len(candidates)):\n            c = candidates[i]\n            if c > rem: break\n            path.append(c); bt(i, rem - c); path.pop()\n    bt(0, target); return res",
        gotcha: "The single character <code>i</code> vs <code>i+1</code> is the whole difference between unlimited reuse and use-once." },

      { t: "prob", diff: "med", name: "Add Two Numbers", pat: "linked list + carry · LC 2", adv: true,
        idea: "Single pass with a carry, iterate while either list remains, append a final carry node. Use a dummy head.",
        lang: "python",
        code: "def add_two_numbers(l1, l2):\n    dummy = tail = ListNode(0); carry = 0\n    while l1 or l2 or carry:\n        s = carry + (l1.val if l1 else 0) + (l2.val if l2 else 0)\n        carry, d = divmod(s, 10)\n        tail.next = ListNode(d); tail = tail.next\n        l1 = l1.next if l1 else None\n        l2 = l2.next if l2 else None\n    return dummy.next",
        gotcha: "The classic reason to always build lists behind a dummy head — otherwise the tail never tracks the real head and the return is wrong." },

      { t: "prob", diff: "med", name: "Basic Calculator II", pat: "stack · precedence · LC 227", adv: true,
        idea: "Track the previous operator; push numbers, but on <code>*</code>/<code>/</code> pop-and-combine immediately; sum the stack at the end.",
        lang: "python",
        code: "def calculate(s):\n    stack = []; num = 0; op = '+'\n    for i, ch in enumerate(s + '+'):\n        if ch.isdigit(): num = num*10 + int(ch)\n        elif ch in '+-*/':\n            if op == '+': stack.append(num)\n            elif op == '-': stack.append(-num)\n            elif op == '*': stack.append(stack.pop() * num)\n            else: stack.append(int(stack.pop() / num))   # trunc toward 0\n            op = ch; num = 0\n    return sum(stack)",
        gotcha: "Integer division must truncate toward zero — <code>int(a/b)</code>, not <code>//</code> (they differ for negatives)." },

      { t: "prob", diff: "med", name: "Spiral Matrix", pat: "boundaries · LC 54", adv: true,
        idea: "Four shrinking boundaries (top/bottom/left/right); walk each edge, then move the boundary inward.",
        lang: "python",
        code: "def spiral_order(m):\n    if not m: return []\n    top, bot = 0, len(m)-1\n    left, right = 0, len(m[0])-1\n    out = []\n    while top <= bot and left <= right:\n        for c in range(left, right+1): out.append(m[top][c])\n        top += 1\n        for r in range(top, bot+1): out.append(m[r][right])\n        right -= 1\n        if top <= bot:\n            for c in range(right, left-1, -1): out.append(m[bot][c])\n            bot -= 1\n        if left <= right:\n            for r in range(bot, top-1, -1): out.append(m[r][left])\n            left += 1\n    return out",
        gotcha: "Use four boundaries, not a <code>seen</code> set of string keys — string keys like <code>f\"{i}{j}\"</code> collide once rows/cols reach 10." }
    ]
  },

  /* ==================== 18 · CLEARED ==================== */
  {
    id: "end", noGrade: true, cleared: true, name: "Cleared for Takeoff", tag: "Final checklist",
    kicker: "send-off",
    lede: "",
    blocks: [
      { t: "note", tone: "win", flag: "THE ONE THING TO CARRY IN",
        title: "clarify → examples → approach → complexity → code → test",
        html: "<p>If your mind goes blank at 13:30, run that sequence. It works on every task — algorithms, SQL, and design alike.</p>" },
      { t: "note", tone: "key", flag: "THE RECURRING TRAPS (they probe these)",
        html: "<ul><li><strong>Tuple / parallel assignment</strong> evaluates the right side first — the swap in First Missing Positive and the rolling line in House Robber both depend on it.</li><li><strong>\"Each element enters and leaves once → O(n)\"</strong> — say <em>amortized</em> for windows, monotonic deques, and lazy-deletion heaps.</li><li><strong>Exchange arguments</strong> justify greedy choices (intervals, the shorter wall).</li><li><strong>Monotonicity</strong> is the precondition for both sliding windows and binary-search-on-the-answer — check it before reaching for either.</li><li><strong>Postgres facts</strong>, because it's Odoo: no clustered index, <code>ILIKE</code>, mixin/MRO models, and the N+1 query smell.</li><li><strong>NOT IN + NULL</strong> is the first thing to check on any \"what's wrong with this query.\"</li></ul>" },
      { t: "note", tone: "trap", flag: "DAY-OF CHECKLIST",
        html: "<ul><li>Disable Copilot / ChatGPT / every AI plugin. Interview <em>you</em>, not a robot.</li><li>Real Meet test call — mic + webcam. IDE font up, linter quiet, scratch file open.</li><li>Warm up with one easy problem (Merge Sorted Array), narrated aloud.</li><li>Coderbyte logic test done calm, before 13:00.</li><li>Close every tab except the IDE and Meet. Water. Bathroom at 13:10. Join 10 minutes early.</li></ul>" },
      { t: "note", tone: "", flag: "AND BREATHE",
        html: "<p>You've done the work — the whole course, the drills, the SQL, the design. Confidence beats coverage now. The interviewer is on your side; hints are part of the format. Narrate, clarify, test out loud. Go get it. 🎯</p>" }
    ]
  }

  ]
};
