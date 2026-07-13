/* ============================================================
   content.js — FINALE: the 2-hour final drill.
   Data only. Rendered by app.js. Runnable questions execute
   through the shared runner.js / runner-worker.js (Pyodide + sql.js).

   Built from the learner's own journey export
   (odoo-journey-2026-07-13): marked-missed questions, must-know
   lecture parts, saved notes, and saved links — plus the biggest
   untouched gaps (SQL, Trees, Graphs, DP, Design).

   Every code sample and every test fixture in this file was
   verified against python3 and SQLite before shipping.

   Block types used in briefs / cheats:
     {t:"p",     html}                 paragraph (innerHTML)
     {t:"code",  lang, code}           code block (highlighted)
     {t:"table", head:[], rows:[[]]}   table
     {t:"call",  tone, html}           callout  tone: key|trap|tip|win
     {t:"list",  items:[]}             bullet list (items are html)
============================================================ */
(function (global) {
  "use strict";

  var FINALE = {
    meta: {
      title: "Finale",
      subtitle: "2-hour final drill",
      exam: "Monday · 13 Jul · 13:30 · Google Meet · 3 tasks (algorithms · SQL · design)",
      // Ordered by leverage: guaranteed tasks you barely touched come first.
      plan: [
        "Launch (6m) — mindset, the 6-step template, time budget",
        "SQL I & II (26m) — your biggest gap; a guaranteed task",
        "Trees · Graphs · DP (34m) — read but never drilled",
        "Rapid review (30m) — the patterns you marked missed",
        "Design (14m) — schema, indexes, OOP, back-of-envelope",
        "Cheat sheets + your recalled references (10m)"
      ]
    },

    /* The 22 lecture parts you flagged must-know. Used as a recall gate. */
    mustKnow: [
      ["m2", "The 6-step template", "Restate → clarify → examples → brute force → optimize → code & test. Say it out loud before you type."],
      ["m2", "Clarifying questions", "Input size? Sorted? Duplicates? Negative/empty? In-place? Return value vs mutation?"],
      ["m2b", "Reverse a linked list", "prev=None; while head: nxt=head.next; head.next=prev; prev=head; head=nxt. Return prev."],
      ["m2b", "Python modulo sign", "-7 % 10 == 3 (result takes the divisor's sign). -7 // 2 == -4 (floors toward -inf)."],
      ["m2b", "Sieve of Eratosthenes", "Mark multiples from i*i, step i. O(n log log n). Guard n<3."],
      ["m2b", "Bit tricks", "x&(x-1) clears lowest set bit; x&-x isolates it; x&(1<<i) tests bit i."],
      ["m3", "Window state table", "Track what the window needs (sum, count, freq map). Shrink from the left when the invariant breaks."],
      ["m3", "Prefix-sum + hashmap", "Count subarrays summing to k: run += x; ans += seen[run-k]; seen[run]+=1. Seed {0:1}."],
      ["m3", "Monotonic deque", "Sliding-window max: keep indices, evict smaller tails, pop the head when it falls out of window."],
      ["m4", "Longest consecutive", "Put in a set; only start counting at x where x-1 not in set. O(n)."],
      ["m4", "Top-K ladder", "sort O(n log n) → heap O(n log k) → bucket/counting O(n). Name the trade."],
      ["m4", "Hashmap = wrong tool sometimes", "When you need order or range, a hashmap won't help — reach for sort / heap / BST."],
      ["m5", "Backtracking: 3 shapes", "Subsets (include/skip), permutations (used[]), combinations (start index)."],
      ["m5", "Pruning", "Sort, then break when candidate > remaining. Turns exponential into tractable."],
      ["m5", "Word search", "DFS on grid, mark cell visited, recurse 4 dirs, restore on the way out."],
      ["m6", "Binary search — exact", "while lo<=hi; mid; move lo=mid+1 or hi=mid-1."],
      ["m6", "Binary search — boundary", "while lo<hi; hi=mid or lo=mid+1; converges to first-true."],
      ["m6", "Search on the answer", "Koko/ships/cows: binary-search the ANSWER value, test feasibility with a helper."],
      ["m7", "Trees — two directions", "Top-down passes state down (bounds); bottom-up returns facts up (height, count)."],
      ["m7", "Validate BST", "Pass (lo,hi) bounds down. Strict <, not <=. inorder must strictly increase."],
      ["m7", "Diameter", "Bottom-up depth; at each node update best = max(best, left+right) in EDGES."],
      ["m7", "LCA", "If both on one side recurse there; else this node is the split point = the LCA."]
    ],

    modules: [
      /* ---------------------------------------------------------- LAUNCH */
      {
        id: "launch",
        name: "Launch",
        tag: "mindset · 6 min",
        kicker: "Before you touch the keyboard",
        brief: [
          { t: "call", tone: "key", html: "You have three tasks in three hours: <b>algorithms</b>, <b>SQL</b>, and <b>design</b>. Budget roughly an hour each and <b>don't let one task eat the others</b>. If you're stuck 20 minutes on the algorithm, bank a working brute force and move on — a correct O(n²) beats a blank O(n)." },
          { t: "p", html: "<b>Run the 6-step template out loud.</b> Interviewers score your process as much as your code. Talking through it is free points and it stops you coding the wrong thing." },
          { t: "list", items: [
            "<b>Restate</b> the problem in your words.",
            "<b>Clarify</b> — size? sorted? duplicates? negatives? empty? in-place? return vs mutate?",
            "<b>Examples</b> — one normal, one edge (empty / single / all-same).",
            "<b>Brute force</b> first, state its complexity, <i>then</i> optimize.",
            "<b>Code</b> the chosen approach cleanly.",
            "<b>Test</b> — walk your example, then the edges."
          ]},
          { t: "call", tone: "tip", html: "<b>Things the interviewer silently notices:</b> naming, whether you handle empty input, whether you state complexity unprompted, whether you test your own code, and whether you narrate the <i>why</i> (\"the shorter wall limits the area, so I move it\"). Say the invariant." },
          { t: "call", tone: "trap", html: "<b>Time trap from your logs:</b> the calculator (F87) cost you 27 min and min-window (F06) ran long. When a parse/greedy problem balloons, stop, write the smallest correct version, and refactor only if time remains." }
        ]
      },

      /* ---------------------------------------------------------- SQL I */
      {
        id: "sql1",
        name: "SQL I — shape & filter",
        tag: "GUARANTEED TASK · your biggest gap · 13 min",
        kicker: "You practised one SQL question. This is a full task. Fix that now.",
        brief: [
          { t: "call", tone: "key", html: "<b>Logical execution order</b> (your own note) — this is why <code>WHERE</code> can't see aggregates and <code>HAVING</code> can:" },
          { t: "code", lang: "sql", code: "FROM / JOIN / ON   -- build the row set\nWHERE              -- filter individual rows (no aggregates yet)\nGROUP BY           -- collapse into groups\nHAVING             -- filter GROUPS (aggregates allowed here)\nSELECT             -- pick / compute columns\nORDER BY\nLIMIT / OFFSET" },
          { t: "table", head: ["Join", "Keeps"], rows: [
            ["INNER JOIN", "only rows matched on both sides"],
            ["LEFT JOIN", "all left rows; NULLs where right has no match"],
            ["anti-join", "LEFT JOIN ... WHERE right.id IS NULL → rows with NO match"]
          ]},
          { t: "call", tone: "trap", html: "<b>LEFT JOIN filter trap:</b> a condition on the right table in <code>WHERE</code> silently turns a LEFT JOIN back into an INNER JOIN (NULLs fail the test). Put right-table conditions in the <code>ON</code> clause. And <code>NOT IN (subquery)</code> returns <b>nothing</b> if the subquery yields a NULL — use <code>NOT EXISTS</code>." }
        ],
        questions: [
          {
            id: "q_headcount", lang: "sql",
            title: "Query A",
            prompt: "Table <code>employees(id, name, dept, salary)</code>. Return each department with 3 or more employees, as columns <code>dept, headcount</code>, ordered by headcount descending then dept.",
            pattern: "GROUP BY + HAVING (filter on an aggregate)",
            hint: "COUNT(*) can't go in WHERE — it doesn't exist until after grouping. Filter groups with HAVING.",
            schema: "CREATE TABLE employees(id INTEGER, name TEXT, dept TEXT, salary INTEGER);\nINSERT INTO employees VALUES\n(1,'Ann','Eng',90),(2,'Bob','Eng',80),(3,'Cy','Eng',70),\n(4,'Dee','Sales',60),(5,'Ed','Sales',65),(6,'Fi','HR',50),(7,'Gu','Eng',85);",
            starter: "-- columns: dept, headcount\nSELECT\nFROM employees\n;",
            solution: "SELECT dept, COUNT(*) AS headcount\nFROM employees\nGROUP BY dept\nHAVING COUNT(*) >= 3\nORDER BY headcount DESC, dept;",
            tests: [
              { name: "Eng has 4, others fewer", expected: { columns: ["dept", "headcount"], rows: [["Eng", 4]] }, orderMatters: true }
            ],
            note: "If asked \"only count employees earning > 50000\", that filter is per-row so it goes in WHERE — before the GROUP BY."
          },
          {
            id: "q_secondhigh", lang: "sql",
            title: "Query B",
            prompt: "Return the <b>second highest distinct salary</b> from <code>employees</code> as a single column <code>second_highest</code>. If there is no second distinct salary, return <code>NULL</code>.",
            pattern: "DISTINCT + ORDER BY + LIMIT/OFFSET, wrapped so empty ⇒ NULL",
            hint: "OFFSET 1 skips the max. Wrapping the query in an outer SELECT (...) makes 'no row' become NULL instead of empty.",
            schema: "CREATE TABLE employees(id INTEGER, name TEXT, dept TEXT, salary INTEGER);\nINSERT INTO employees VALUES\n(1,'Ann','Eng',90),(2,'Bob','Eng',80),(3,'Cy','Eng',70),\n(4,'Dee','Sales',60),(5,'Ed','Sales',65),(6,'Fi','HR',50),(7,'Gu','Eng',85);",
            starter: "-- single column: second_highest (NULL if none)\nSELECT\n;",
            solution: "SELECT (\n  SELECT DISTINCT salary\n  FROM employees\n  ORDER BY salary DESC\n  LIMIT 1 OFFSET 1\n) AS second_highest;",
            tests: [
              { name: "distinct salaries 90,85,80,... → 85", expected: { columns: ["second_highest"], rows: [[85]] } },
              { name: "only one salary → NULL", schema: "CREATE TABLE employees(id INTEGER, name TEXT, dept TEXT, salary INTEGER);\nINSERT INTO employees VALUES(1,'A','X',50);", expected: { columns: ["second_highest"], rows: [[null]] } }
            ],
            note: "The scalar-subquery wrapper is the classic LeetCode 176 trick: a bare LIMIT/OFFSET returns zero rows when absent; the wrapper coerces that to a NULL row."
          }
        ]
      },

      /* ---------------------------------------------------------- SQL II */
      {
        id: "sql2",
        name: "SQL II — windows & ranking",
        tag: "GUARANTEED TASK · 13 min",
        kicker: "Top-N-per-group and 'consecutive' are the two window patterns interviewers love.",
        brief: [
          { t: "table", head: ["Function", "1,1,2 →", "Meaning"], rows: [
            ["ROW_NUMBER()", "1,2,3", "unique position, ties broken arbitrarily"],
            ["RANK()", "1,1,3", "ties share rank, then a gap"],
            ["DENSE_RANK()", "1,1,2", "ties share rank, no gap"]
          ]},
          { t: "p", html: "<b>Top-N per group</b> = number the rows inside each partition, then filter. <code>ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC)</code> then <code>WHERE rn = 1</code>. Use <code>RANK()</code> instead if you want <i>all</i> ties." },
          { t: "code", lang: "sql", code: "-- \"row minus previous row\" comparisons use LAG / LEAD\nLAG(num, 1)  OVER (ORDER BY id)   -- value one row back\nLEAD(num, 1) OVER (ORDER BY id)   -- value one row forward" },
          { t: "call", tone: "tip", html: "Window functions run <i>after</i> WHERE/GROUP BY. To filter on a window result you must wrap it in a CTE or subquery — you can't put <code>ROW_NUMBER() = 1</code> in WHERE directly." }
        ],
        questions: [
          {
            id: "q_topearner", lang: "sql",
            title: "Query C",
            prompt: "Table <code>employees(id, name, dept, salary)</code>. Return the <b>highest-paid employee(s) in each department</b> — columns <code>dept, name, salary</code>. Include everyone tied for the top. Order by dept, then name.",
            pattern: "Window RANK() per partition, filter rk = 1 (keeps ties)",
            hint: "PARTITION BY dept, ORDER BY salary DESC. RANK() (not ROW_NUMBER) so ties both survive. Filter in an outer query / CTE.",
            schema: "CREATE TABLE employees(id INTEGER, name TEXT, dept TEXT, salary INTEGER);\nINSERT INTO employees VALUES\n(1,'Ann','Eng',90),(2,'Bob','Eng',90),(3,'Cy','Sales',70),(4,'Dee','Sales',60);",
            starter: "-- columns: dept, name, salary  (include ties for top)\nWITH r AS (\n  SELECT dept, name, salary,\n         -- window here\n  FROM employees\n)\nSELECT dept, name, salary\nFROM r\n;",
            solution: "WITH r AS (\n  SELECT dept, name, salary,\n         RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rk\n  FROM employees\n)\nSELECT dept, name, salary\nFROM r\nWHERE rk = 1\nORDER BY dept, name;",
            tests: [
              { name: "Ann & Bob tie at 90 in Eng", expected: { columns: ["dept", "name", "salary"], rows: [["Eng", "Ann", 90], ["Eng", "Bob", 90], ["Sales", "Cy", 70]] }, orderMatters: true }
            ],
            note: "Swap RANK for ROW_NUMBER and you'd drop Bob — say which you want and why. That distinction is the whole point of the question."
          },
          {
            id: "q_consecutive", lang: "sql",
            title: "Query D",
            prompt: "Table <code>logs(id, num)</code> ordered by <code>id</code>. Return every number that appears in <b>at least three consecutive rows</b>, as a single distinct column <code>ConsecutiveNums</code>.",
            pattern: "LAG twice, keep rows where current = prev1 = prev2",
            hint: "Compare each row to the previous two via LAG(num,1) and LAG(num,2) over ORDER BY id. Where all three match, num ran 3+ in a row.",
            schema: "CREATE TABLE logs(id INTEGER, num INTEGER);\nINSERT INTO logs VALUES(1,1),(2,1),(3,1),(4,2),(5,1),(6,2),(7,2);",
            starter: "-- single distinct column: ConsecutiveNums\nWITH t AS (\n  SELECT num,\n         -- LAG 1 and 2\n  FROM logs\n)\nSELECT\nFROM t\n;",
            solution: "WITH t AS (\n  SELECT num,\n         LAG(num, 1) OVER (ORDER BY id) AS p1,\n         LAG(num, 2) OVER (ORDER BY id) AS p2\n  FROM logs\n)\nSELECT DISTINCT num AS ConsecutiveNums\nFROM t\nWHERE num = p1 AND num = p2;",
            tests: [
              { name: "1 runs three in a row; 2 never does", expected: { columns: ["ConsecutiveNums"], rows: [[1]] } }
            ],
            note: "LeetCode 180. The self-join version (l1.id=l2.id-1=l3.id-2) is equivalent but LAG reads cleaner and scans once."
          }
        ]
      },

      /* ---------------------------------------------------------- TREES */
      {
        id: "trees",
        name: "Trees",
        tag: "read, never drilled · 12 min",
        kicker: "Almost every tree problem is one of two motions.",
        brief: [
          { t: "call", tone: "key", html: "<b>Two directions</b> (your must-know): <b>top-down</b> carries state <i>down</i> the recursion (valid-BST bounds, path so far); <b>bottom-up</b> returns facts <i>up</i> (height, count, diameter). Decide which before you write a line." },
          { t: "code", lang: "python", code: "# bottom-up skeleton — returns a fact, updates a side effect\ndef solve(root):\n    best = 0\n    def go(node):\n        nonlocal best\n        if not node: return 0            # base: empty subtree\n        L = go(node.left)\n        R = go(node.right)\n        best = max(best, L + R)          # combine children\n        return 1 + max(L, R)             # report height upward\n    go(root)\n    return best" },
          { t: "call", tone: "trap", html: "<b>Validate-BST trap:</b> checking <code>left.val &lt; node.val &lt; right.val</code> locally is WRONG — a deep descendant can violate the global bound. Pass <code>(lo, hi)</code> down and tighten them. Strict <code>&lt;</code>, not <code>&lt;=</code>." }
        ],
        questions: [
          {
            id: "q_validbst", lang: "python", fn: "is_valid_bst",
            title: "Problem E",
            prompt: "Given the root of a binary tree, return <code>True</code> if it is a valid Binary Search Tree. (In the sandbox the tree is built for you from a level-order array; you receive the root node with <code>.val / .left / .right</code>.)",
            pattern: "Top-down bounds — pass (lo, hi) down, tighten each side",
            hint: "go(node, lo, hi): empty is valid; fail if not lo < node.val < hi; recurse left with hi=node.val, right with lo=node.val.",
            starter: "def is_valid_bst(root):\n    def go(node, lo, hi):\n        # base + bound check + recurse\n        pass\n    return go(root, float('-inf'), float('inf'))",
            solution: "def is_valid_bst(root):\n    def go(node, lo, hi):\n        if not node:\n            return True\n        if not (lo < node.val < hi):\n            return False\n        return go(node.left, lo, node.val) and go(node.right, node.val, hi)\n    return go(root, float('-inf'), float('inf'))",
            tests: [
              { args: [[2, 1, 3]], expected: true, prepare: "args[0] = _build_tree(args[0])" },
              { args: [[5, 1, 4, null, null, 3, 6]], expected: false, prepare: "args[0] = _build_tree(args[0])" },
              { args: [[]], expected: true, prepare: "args[0] = _build_tree(args[0])" }
            ],
            note: "The inorder traversal of a BST is strictly increasing — an equally valid answer is 'inorder-walk and check each value > previous'."
          },
          {
            id: "q_diameter", lang: "python", fn: "diameter",
            title: "Problem F",
            prompt: "Return the <b>diameter</b> of a binary tree — the number of edges on the longest path between any two nodes (the path need not pass through the root).",
            pattern: "Bottom-up depth; best = max(best, left+right) in edges",
            hint: "A helper returns height. At each node the longest path THROUGH it is left_height + right_height (edges). Track the max as a side effect.",
            starter: "def diameter(root):\n    best = 0\n    def depth(node):\n        # return height; update best with left+right\n        pass\n    depth(root)\n    return best",
            solution: "def diameter(root):\n    best = 0\n    def depth(node):\n        nonlocal best\n        if not node:\n            return 0\n        L = depth(node.left)\n        R = depth(node.right)\n        best = max(best, L + R)\n        return 1 + max(L, R)\n    depth(root)\n    return best",
            tests: [
              { args: [[1, 2, 3, 4, 5]], expected: 3, prepare: "args[0] = _build_tree(args[0])" },
              { args: [[1]], expected: 0, prepare: "args[0] = _build_tree(args[0])" },
              { args: [[]], expected: 0, prepare: "args[0] = _build_tree(args[0])" }
            ],
            note: "If they ask for the diameter in NODES instead of edges, it's L+R+1 for the path and the answer is best+1. Clarify which they mean."
          }
        ]
      },

      /* ---------------------------------------------------------- GRAPHS */
      {
        id: "graphs",
        name: "Graphs",
        tag: "barely read · never drilled · 12 min",
        kicker: "Grid flood-fill and topological sort cover most of what shows up.",
        brief: [
          { t: "table", head: ["Need", "Tool", "Cost"], rows: [
            ["shortest hops (unweighted)", "BFS (queue)", "O(V+E)"],
            ["reachability / flood fill", "DFS or BFS", "O(V+E)"],
            ["dependency order / cycle", "Topological sort (Kahn)", "O(V+E)"],
            ["shortest path (weighted ≥0)", "Dijkstra (heap)", "O(E log V)"],
            ["connectivity / online merge", "Union-Find", "~O(1) amortized/op"]
          ]},
          { t: "p", html: "<b>Grid = graph.</b> Each cell is a node; neighbours are up/down/left/right. Flood-fill sinks an island by marking visited cells so you never revisit. <b>Kahn's topo sort</b> repeatedly removes indegree-0 nodes; if any remain, there's a cycle." },
          { t: "call", tone: "tip", html: "State your visited strategy out loud: mutate the grid in place (cheap, allowed if you say so) or keep a <code>seen</code> set (non-destructive). Interviewers care that you <i>chose</i>." }
        ],
        questions: [
          {
            id: "q_islands", lang: "python", fn: "num_islands",
            title: "Problem G",
            prompt: "Given a grid of <code>'1'</code> (land) and <code>'0'</code> (water) as a list of lists of strings, count the number of islands. Land connects horizontally/vertically.",
            pattern: "Flood fill — DFS from each unseen '1', sink the whole island",
            hint: "Loop every cell; when you hit a '1', increment count and DFS in 4 directions turning every connected '1' into '0'.",
            starter: "def num_islands(grid):\n    if not grid:\n        return 0\n    R, C = len(grid), len(grid[0])\n    def sink(r, c):\n        pass\n    count = 0\n    # scan cells, sink on each new island\n    return count",
            solution: "def num_islands(grid):\n    if not grid:\n        return 0\n    R, C = len(grid), len(grid[0])\n    def sink(r, c):\n        if r < 0 or c < 0 or r >= R or c >= C or grid[r][c] != '1':\n            return\n        grid[r][c] = '0'\n        sink(r + 1, c); sink(r - 1, c)\n        sink(r, c + 1); sink(r, c - 1)\n    count = 0\n    for r in range(R):\n        for c in range(C):\n            if grid[r][c] == '1':\n                count += 1\n                sink(r, c)\n    return count",
            tests: [
              { args: [[["1", "1", "0"], ["1", "0", "0"], ["0", "0", "1"]]], expected: 2 },
              { args: [[["0", "0"], ["0", "0"]]], expected: 0 }
            ],
            note: "Recursion depth can blow up on a huge all-land grid; mention the iterative stack/BFS variant as the safe alternative."
          },
          {
            id: "q_canfinish", lang: "python", fn: "can_finish",
            title: "Problem H",
            prompt: "<code>num_courses</code> courses labelled <code>0..n-1</code>. <code>prerequisites[i] = [a, b]</code> means you must take <code>b</code> before <code>a</code>. Return <code>True</code> if you can finish all courses (i.e. the dependency graph has no cycle).",
            pattern: "Topological sort (Kahn) — remove indegree-0 nodes; cycle ⇔ some remain",
            hint: "Build adjacency b→a and indegree of each node. BFS from all indegree-0 nodes, decrementing neighbours. If you process all n, no cycle.",
            starter: "def can_finish(num_courses, prerequisites):\n    from collections import deque, defaultdict\n    # build graph + indegrees, then Kahn\n    return False",
            solution: "def can_finish(num_courses, prerequisites):\n    from collections import deque, defaultdict\n    g = defaultdict(list)\n    indeg = [0] * num_courses\n    for a, b in prerequisites:\n        g[b].append(a)\n        indeg[a] += 1\n    q = deque(i for i in range(num_courses) if indeg[i] == 0)\n    seen = 0\n    while q:\n        n = q.popleft()\n        seen += 1\n        for m in g[n]:\n            indeg[m] -= 1\n            if indeg[m] == 0:\n                q.append(m)\n    return seen == num_courses",
            tests: [
              { args: [2, [[1, 0]]], expected: true },
              { args: [2, [[1, 0], [0, 1]]], expected: false },
              { args: [4, [[1, 0], [2, 1], [3, 2]]], expected: true }
            ],
            note: "DFS with a 3-colour (white/grey/black) visited array is the other standard cycle check — grey-on-grey means a back edge = cycle."
          }
        ]
      },

      /* ---------------------------------------------------------- DP */
      {
        id: "dp",
        name: "Dynamic programming",
        tag: "never read · high value · 12 min",
        kicker: "You skipped this module. Here's the whole idea in one screen.",
        brief: [
          { t: "call", tone: "key", html: "<b>DP = recursion with memory.</b> Find the <i>state</i> (what fully describes a subproblem) and the <i>transition</i> (how a state is built from smaller ones). Then either memoize top-down or fill a table bottom-up." },
          { t: "p", html: "<b>The recipe:</b> (1) define <code>dp[i]</code> in one English sentence, (2) write the recurrence, (3) set the base case, (4) pick an iteration order so every dependency is ready, (5) read the answer out of the table." },
          { t: "code", lang: "python", code: "# House Robber — dp[i] = best loot considering houses 0..i\n# transition: rob i (prev-prev + nums[i]) OR skip i (prev)\nprev = cur = 0\nfor x in nums:\n    prev, cur = cur, max(cur, prev + x)\nreturn cur   # rolling two variables = O(1) space" },
          { t: "call", tone: "tip", html: "Classic 1-D ladder to have ready: climbing stairs (Fibonacci), house robber, coin change, longest increasing subsequence, word break. Most interview DP is a variation of one of these." }
        ],
        questions: [
          {
            id: "q_rob", lang: "python", fn: "rob",
            title: "Problem I",
            prompt: "<code>nums[i]</code> is the money in house <code>i</code>. You cannot rob two adjacent houses. Return the maximum you can rob.",
            pattern: "1-D DP, rolling two vars: cur = max(skip, prev+take)",
            hint: "At each house choose: skip it (keep cur) or rob it (prev-before + nums[i]). Roll two variables, no array needed.",
            starter: "def rob(nums):\n    prev = cur = 0\n    for x in nums:\n        # prev, cur = ...\n        pass\n    return cur",
            solution: "def rob(nums):\n    prev = cur = 0\n    for x in nums:\n        prev, cur = cur, max(cur, prev + x)\n    return cur",
            tests: [
              { args: [[1, 2, 3, 1]], expected: 4 },
              { args: [[2, 7, 9, 3, 1]], expected: 12 },
              { args: [[]], expected: 0 }
            ],
            note: "The empty-list and single-house cases fall out for free because prev/cur start at 0 — mention that you checked them."
          },
          {
            id: "q_coinchange", lang: "python", fn: "coin_change",
            title: "Problem J",
            prompt: "Given <code>coins</code> (unlimited supply of each) and a target <code>amount</code>, return the <b>fewest coins</b> that sum to amount, or <code>-1</code> if impossible.",
            pattern: "Unbounded-knapsack DP: dp[a] = 1 + min(dp[a-c])",
            hint: "dp[0]=0, everything else infinity. For each amount a, try each coin c<=a: dp[a]=min(dp[a], dp[a-c]+1). Answer is dp[amount] or -1.",
            starter: "def coin_change(coins, amount):\n    INF = float('inf')\n    dp = [0] + [INF] * amount\n    # fill dp\n    return dp[amount] if dp[amount] != INF else -1",
            solution: "def coin_change(coins, amount):\n    INF = float('inf')\n    dp = [0] + [INF] * amount\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a and dp[a - c] + 1 < dp[a]:\n                dp[a] = dp[a - c] + 1\n    return dp[amount] if dp[amount] != INF else -1",
            tests: [
              { args: [[1, 2, 5], 11], expected: 3 },
              { args: [[2], 3], expected: -1 },
              { args: [[1], 0], expected: 0 }
            ],
            note: "Greedy (biggest coin first) FAILS here — coins [1,3,4], amount 6 gives greedy 4+1+1=3 but optimal 3+3=2. That counterexample is worth saying aloud."
          }
        ]
      },

      /* ---------------------------------------------------------- REVIEW: WINDOWS */
      {
        id: "rev_windows",
        name: "Review · windows & two-pointers",
        tag: "you marked these missed · 8 min",
        kicker: "One example to reset the pattern (F03 was on your missed list).",
        brief: [
          { t: "p", html: "<b>Sliding window</b> for contiguous subarray/substring problems: expand right, shrink left when the invariant breaks; the answer updates as the window moves. <b>Monotonic deque</b> upgrades it when you need the window's max/min in O(1)." },
          { t: "p", html: "<b>Two-pointer geometry</b> (your note): opposite ends walking inward, discarding half each step. Container-With-Water — the shorter wall limits area, so moving the taller pointer can never help; always advance the shorter. <b>In-place products</b> (your note): reuse the output array as scratch — prefix products left→right, then a running suffix product right→left. Two passes, one variable." },
          { t: "call", tone: "key", html: "<b>Monotonic deque, the mechanics:</b> store <i>indices</i>; before pushing i, pop all tail indices whose value ≤ nums[i] (they can never be the max again); pop the head when it falls out of the window (<code>dq[0] == i-k</code>); the front is always the current max." }
        ],
        questions: [
          {
            id: "q_maxwindow", lang: "python", fn: "max_sliding_window",
            title: "Problem K",
            prompt: "Given <code>nums</code> and window size <code>k</code>, return a list of the maximum of each contiguous window of size k as it slides left to right.",
            pattern: "Monotonic decreasing deque of indices",
            hint: "Keep indices in a deque whose values are decreasing. Evict smaller tails before pushing; drop the head when it exits the window; record nums[dq[0]] once i>=k-1.",
            starter: "def max_sliding_window(nums, k):\n    from collections import deque\n    dq = deque()\n    out = []\n    for i, x in enumerate(nums):\n        # evict tail, push, expire head, record\n        pass\n    return out",
            solution: "def max_sliding_window(nums, k):\n    from collections import deque\n    dq = deque()\n    out = []\n    for i, x in enumerate(nums):\n        while dq and nums[dq[-1]] <= x:\n            dq.pop()\n        dq.append(i)\n        if dq[0] == i - k:\n            dq.popleft()\n        if i >= k - 1:\n            out.append(nums[dq[0]])\n    return out",
            tests: [
              { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
              { args: [[1], 1], expected: [1] }
            ],
            note: "Each index is pushed and popped at most once → O(n), not O(nk). That amortized argument is exactly what the interviewer wants to hear."
          }
        ]
      },

      /* ---------------------------------------------------------- REVIEW: BACKTRACKING */
      {
        id: "rev_backtracking",
        name: "Review · backtracking",
        tag: "you marked these missed · 8 min",
        kicker: "Combination Sum (F12) cost you 61 min. Here it is cold.",
        brief: [
          { t: "p", html: "<b>Three shapes</b> (your must-know): <b>subsets</b> (include/skip each element), <b>permutations</b> (a <code>used[]</code> flag, order matters), <b>combinations</b> (a <code>start</code> index so you never look back → no duplicates). Recognise which shape and the template writes itself." },
          { t: "code", lang: "python", code: "def backtrack(start, path, remaining):\n    if remaining == 0:\n        result.append(path.copy())   # copy! path is mutated in place\n        return\n    for i in range(start, len(cands)):\n        if cands[i] > remaining:     # prune: sorted, so rest are bigger too\n            break\n        path.append(cands[i])\n        backtrack(i, path, remaining - cands[i])  # i (reuse) vs i+1 (no reuse)\n        path.pop()                   # undo — the essence of backtracking" },
          { t: "call", tone: "trap", html: "<b>Two bugs that cost you time:</b> forgetting <code>path.copy()</code> (you append a reference that later empties), and passing <code>i+1</code> when the element is reusable (or <code>i</code> when it isn't). Sort first so the <code>&gt; remaining</code> break prunes hard." }
        ],
        questions: [
          {
            id: "q_combsum", lang: "python", fn: "combination_sum",
            title: "Problem L",
            prompt: "Given <code>candidates</code> (distinct positive ints, each usable unlimited times) and a <code>target</code>, return all unique combinations summing to target. <code>[2,3]</code> and <code>[3,2]</code> count as the same combination.",
            pattern: "Backtracking with a start index (reuse allowed) + sorted prune",
            hint: "Sort. backtrack(start, remaining): on remaining==0 record a copy; loop i from start; break if cand[i]>remaining; recurse with the SAME i (reuse allowed).",
            starter: "def combination_sum(candidates, target):\n    res = []\n    cand = sorted(candidates)\n    path = []\n    def bt(start, rem):\n        pass\n    bt(0, target)\n    return res",
            solution: "def combination_sum(candidates, target):\n    res = []\n    cand = sorted(candidates)\n    path = []\n    def bt(start, rem):\n        if rem == 0:\n            res.append(path.copy())\n            return\n        for i in range(start, len(cand)):\n            if cand[i] > rem:\n                break\n            path.append(cand[i])\n            bt(i, rem - cand[i])\n            path.pop()\n    bt(0, target)\n    return res",
            tests: [
              { args: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]], equality: "sorted-list" },
              { args: [[2], 1], expected: [] }
            ],
            note: "Passing i keeps a candidate available for reuse; pass i+1 and it becomes 'each used once' (Combination Sum II, where you'd also skip duplicate siblings)."
          }
        ]
      },

      /* ---------------------------------------------------------- REVIEW: BITS & MATH */
      {
        id: "rev_bitsmath",
        name: "Review · bits & modular math",
        tag: "you marked these missed · 7 min",
        kicker: "Modular exponentiation (F82) and bit tricks (F79/F80).",
        brief: [
          { t: "code", lang: "python", code: "x & (1 << i)        # is bit i set?\nx |=  (1 << i)      # set bit i\nx &= ~(1 << i)      # clear bit i\nx ^=  (1 << i)      # toggle bit i\nx & -x              # lowest set bit (isolated)\nx &= x - 1          # remove lowest set bit  (Brian Kernighan count)\nx > 0 and x & (x-1) == 0   # power of two?  (guard x>0!)" },
          { t: "call", tone: "key", html: "<b>Modular arithmetic</b> (your note): (a·b) % m = ((a%m)·(b%m)) % m. This lets <b>fast exponentiation</b> keep numbers small: square the base, halve the exponent, multiply into the result only when the current bit is 1 → O(log exp)." },
          { t: "p", html: "<b>XOR facts:</b> x^x=0, x^0=x, XOR is commutative. So XOR-ing every element cancels the pairs and leaves the single unique number (Single Number I) in O(1) space." }
        ],
        questions: [
          {
            id: "q_powmod", lang: "python", fn: "power_mod",
            title: "Problem M",
            prompt: "Compute <code>(base ** exp) % mod</code> efficiently for large <code>exp</code>, without overflowing into huge intermediate numbers. Return the result.",
            pattern: "Binary (fast) exponentiation with modular reduction",
            hint: "result=1; base%=mod; while exp: if exp&1 multiply result by base mod m; square base mod m; exp>>=1.",
            starter: "def power_mod(base, exp, mod):\n    result = 1\n    base %= mod\n    while exp > 0:\n        # use the low bit of exp, then square base, then shift\n        pass\n    return result",
            solution: "def power_mod(base, exp, mod):\n    result = 1\n    base %= mod\n    while exp > 0:\n        if exp & 1:\n            result = (result * base) % mod\n        base = (base * base) % mod\n        exp >>= 1\n    return result",
            tests: [
              { args: [2, 10, 1000], expected: 24 },
              { args: [7, 222, 11], expected: 5 },
              { args: [3, 0, 7], expected: 1 }
            ],
            note: "Python's built-in pow(base, exp, mod) does exactly this — say you'd use it in production but can implement it, then implement it."
          }
        ]
      },

      /* ---------------------------------------------------------- REVIEW: PARSING / REGEX */
      {
        id: "rev_parsing",
        name: "Review · parsing & regex",
        tag: "F87 cost you 27 min · 7 min",
        kicker: "The calculator that ran away. Here's the clean version.",
        brief: [
          { t: "p", html: "<b>Expression evaluation without parentheses</b> is a single left-to-right scan with a stack. Push <code>+num</code> / <code>-num</code>; for <code>*</code> and <code>/</code> pop the last value and combine immediately (they bind tighter). The answer is the sum of the stack." },
          { t: "call", tone: "trap", html: "<b>Integer division truncates toward zero</b> in this problem — use <code>int(a / b)</code>, NOT <code>a // b</code>. Example: <code>0 - 3 / 2</code> → <code>int(-3/2) = int(-1.5) = -1</code>, whereas <code>-3 // 2 == -2</code>. This sign difference is the classic bug." },
          { t: "call", tone: "tip", html: "<b>Regex tokenizing</b> (your saved reference): <code>re.findall(r'\\d+|[+\\-*/]', s)</code> splits an expression into numbers and operators in one line. Great for readability — but the running-stack scan below needs no regex at all." }
        ],
        questions: [
          {
            id: "q_calc", lang: "python", fn: "calculate",
            title: "Problem N",
            prompt: "Evaluate a string expression <code>s</code> with non-negative integers and the operators <code>+ - * /</code> (no parentheses). Division truncates toward zero. Spaces may appear. Example: <code>\" 3+5 / 2 \"</code> → <code>5</code>.",
            pattern: "Single scan + stack; * and / fold immediately",
            hint: "Track num and the PREVIOUS operator. On hitting an operator (or the last char): apply the previous op to push/fold onto the stack, then reset. Return sum(stack). Use int(x/y) for division.",
            starter: "def calculate(s):\n    s = s.replace(' ', '')\n    stack = []\n    num = 0\n    op = '+'\n    n = len(s)\n    for i, ch in enumerate(s):\n        # accumulate digits; on operator or last char, resolve `op`\n        pass\n    return sum(stack)",
            solution: "def calculate(s):\n    s = s.replace(' ', '')\n    stack = []\n    num = 0\n    op = '+'\n    n = len(s)\n    for i, ch in enumerate(s):\n        if ch.isdigit():\n            num = num * 10 + int(ch)\n        if ch in '+-*/' or i == n - 1:\n            if op == '+':\n                stack.append(num)\n            elif op == '-':\n                stack.append(-num)\n            elif op == '*':\n                stack.append(stack.pop() * num)\n            elif op == '/':\n                stack.append(int(stack.pop() / num))\n            op = ch\n            num = 0\n    return sum(stack)",
            tests: [
              { args: ["3+2*2"], expected: 7 },
              { args: [" 3/2 "], expected: 1 },
              { args: [" 3+5 / 2 "], expected: 5 },
              { args: ["0-3/2"], expected: -1 }
            ],
            note: "The trick that unlocks it: don't act on the operator you just read — act on the PREVIOUS operator, because you only now know the number it applied to."
          }
        ]
      },

      /* ---------------------------------------------------------- DESIGN */
      {
        id: "design",
        name: "Design task",
        tag: "GUARANTEED TASK · never practiced · 14 min",
        kicker: "Half discussion, half schema. Talk structure, tradeoffs, and indexes.",
        brief: [
          { t: "call", tone: "key", html: "<b>Schema design out loud:</b> entities → tables, relationships → foreign keys, many-to-many → a join table. Normalize to <b>3NF</b> by default (every non-key column depends on the key, the whole key, and nothing but the key), then denormalize <i>only</i> with a stated reason (read performance)." },
          { t: "table", head: ["Normal form", "Rule"], rows: [
            ["1NF", "atomic columns, no repeating groups"],
            ["2NF", "no partial dependency on part of a composite key"],
            ["3NF", "no non-key column depends on another non-key column (no transitive deps)"]
          ]},
          { t: "p", html: "<b>Indexes:</b> add them on foreign keys and on columns you filter/join/sort by. A composite index <code>(a,b)</code> serves queries filtering on <code>a</code> or <code>a AND b</code> (leftmost prefix), not <code>b</code> alone. In Postgres, FKs are <b>not</b> auto-indexed — call that out. Indexes speed reads, slow writes, cost space." },
          { t: "call", tone: "tip", html: "<b>OOP / SOLID</b> in one breath: Single-responsibility, Open-closed, Liskov (a subclass must be usable wherever the base is), Interface-segregation, Dependency-inversion. Name the smell you're fixing. <b>N+1 query</b> is the ORM trap — one query per row instead of a single join; fix with a join or eager load." },
          { t: "call", tone: "win", html: "<b>Back-of-envelope:</b> 1,000,000 requests/day ≈ 1e6 / 86,400 ≈ <b>12 requests/second</b> average (peak maybe 3–5×). Small. Say the number, then size the design to it — don't over-engineer." }
        ],
        questions: [
          {
            id: "q_revenue", lang: "sql",
            title: "Problem O",
            prompt: "You designed <code>customers(id, name)</code> and <code>orders(id, customer_id, amount)</code>. Return the top 3 customers by total revenue — columns <code>name, revenue</code> — highest first (then name), excluding customers with no orders.",
            pattern: "INNER JOIN + GROUP BY + SUM + ORDER BY + LIMIT",
            hint: "Join orders to customers on customer_id, GROUP BY the customer, SUM(amount) as revenue, order descending, LIMIT 3. INNER JOIN naturally drops customers with no orders.",
            schema: "CREATE TABLE customers(id INTEGER, name TEXT);\nINSERT INTO customers VALUES(1,'Ann'),(2,'Bob'),(3,'Cy');\nCREATE TABLE orders(id INTEGER, customer_id INTEGER, amount INTEGER);\nINSERT INTO orders VALUES(1,1,100),(2,1,50),(3,2,200),(4,3,30),(5,3,30);",
            starter: "-- columns: name, revenue  (top 3, exclude no-order customers)\nSELECT\nFROM customers c\nJOIN orders o ON\n;",
            solution: "SELECT c.name, SUM(o.amount) AS revenue\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nGROUP BY c.id, c.name\nORDER BY revenue DESC, c.name\nLIMIT 3;",
            tests: [
              { name: "Bob 200, Ann 150, Cy 60", expected: { columns: ["name", "revenue"], rows: [["Bob", 200], ["Ann", 150], ["Cy", 60]] }, orderMatters: true }
            ],
            note: "If they say 'include customers with zero revenue', switch to LEFT JOIN and COALESCE(SUM(amount), 0) — and GROUP BY the customer id, not the name (names can collide)."
          }
        ]
      }
    ],

    /* ---------------------------------------------------------- CHEAT SHEETS */
    cheats: [
      {
        id: "cheat_py",
        name: "Python & patterns",
        blocks: [
          { t: "call", tone: "tip", html: "<b>Fast & slow pointers</b> — middle of a list / cycle detection:" },
          { t: "code", lang: "python", code: "slow = fast = head\nwhile fast and fast.next:\n    slow = slow.next\n    fast = fast.next.next\n# fast at end  ->  slow at middle (2nd middle if even length)" },
          { t: "call", tone: "tip", html: "<b>Reverse a linked list</b>:" },
          { t: "code", lang: "python", code: "prev = None\nwhile head:\n    nxt = head.next\n    head.next = prev\n    prev = head\n    head = nxt\nreturn prev" },
          { t: "call", tone: "tip", html: "<b>Anagram grouping</b> — sorted string as key:" },
          { t: "code", lang: "python", code: "from collections import defaultdict\ngroups = defaultdict(list)\nfor w in words:\n    groups[''.join(sorted(w))].append(w)\nreturn list(groups.values())\n# faster key: a 26-length count tuple instead of sorting" },
          { t: "call", tone: "tip", html: "<b>Binary search on a rotated sorted array</b>:" },
          { t: "code", lang: "python", code: "lo, hi = 0, len(nums) - 1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if nums[mid] == target: return mid\n    if nums[lo] <= nums[mid]:            # left half sorted\n        if nums[lo] <= target < nums[mid]: hi = mid - 1\n        else: lo = mid + 1\n    else:                                # right half sorted\n        if nums[mid] < target <= nums[hi]: lo = mid + 1\n        else: hi = mid - 1\nreturn -1" },
          { t: "call", tone: "key", html: "<b>Python number gotchas:</b> <code>-7 % 10 == 3</code> (sign follows divisor) · <code>-7 // 2 == -4</code> (floors) · truncate-toward-zero is <code>int(a/b)</code> · big ints never overflow (say so vs Java/C++ where <code>(lo+hi)</code> overflows — use <code>lo+(hi-lo)//2</code>)." },
          { t: "call", tone: "key", html: "<b>Modular arithmetic:</b> (a±b)%m = ((a%m)±(b%m))%m · (a·b)%m = ((a%m)·(b%m))%m · sum/product of a list distributes the mod over each term." }
        ]
      },
      {
        id: "cheat_regex",
        name: "Regex",
        blocks: [
          { t: "table", head: ["Token", "Matches"], rows: [
            ["\\d \\D", "digit (ASCII [0-9]; Unicode unless re.A) / non-digit"],
            ["\\w \\W", "word char [A-Za-z0-9_] (Unicode unless re.A) / non-word"],
            ["\\s \\S", "whitespace / non-whitespace"],
            ["^ $", "start / end of string (or line with re.M)"],
            ["* + ?", "0+, 1+, 0-or-1 (greedy); add ? for lazy: *? +?"],
            ["{m,n}", "between m and n repeats"],
            ["[...] [^...]", "char class / negated class"],
            ["(...) (?:...)", "capturing group / non-capturing group"],
            ["a|b", "alternation"],
            ["\\1 \\2", "backreference to group 1, 2"]
          ]},
          { t: "call", tone: "tip", html: "<b>Tokenize an arithmetic expression</b> (your saved reference):" },
          { t: "code", lang: "python", code: "import re\ntokens = re.findall(r'\\d+|[+\\-*/()]', s)   # numbers OR single operators\n# swap names:  re.sub(r'(\\w+)\\s+(\\w+)', r'\\2 \\1', s)\n# whole-word:  re.findall(r'\\b\\w+\\b', s)\n# password-ish lookahead: r'(?=.*\\d)(?=.*[A-Z]).{8,}'" },
          { t: "call", tone: "trap", html: "In Python, <code>re.findall</code> with one group returns the group's captures, not full matches — use <code>(?:...)</code> when you don't want that. Always raw-string your patterns: <code>r'...'</code>." }
        ]
      },
      {
        id: "cheat_sql",
        name: "SQL",
        blocks: [
          { t: "call", tone: "key", html: "<b>Keyword order</b> written vs executed (your note):" },
          { t: "code", lang: "sql", code: "-- WRITTEN:   SELECT ... FROM ... JOIN ... ON ... WHERE ...\n--            GROUP BY ... HAVING ... ORDER BY ... LIMIT ...\n-- EXECUTED:  FROM/JOIN/ON -> WHERE -> GROUP BY -> HAVING\n--            -> SELECT -> ORDER BY -> LIMIT/OFFSET" },
          { t: "code", lang: "sql", code: "-- second highest distinct value (NULL-safe)\nSELECT (SELECT DISTINCT salary FROM employees\n        ORDER BY salary DESC LIMIT 1 OFFSET 1) AS second_highest;\n\n-- top-N per group\nWITH r AS (SELECT *, ROW_NUMBER() OVER\n           (PARTITION BY dept ORDER BY salary DESC) rn FROM employees)\nSELECT * FROM r WHERE rn <= 3;\n\n-- running comparison to previous row\nSELECT num, LAG(num) OVER (ORDER BY id) AS prev FROM logs;\n\n-- rows with NO match (anti-join)\nSELECT c.* FROM customers c LEFT JOIN orders o\n  ON o.customer_id = c.id WHERE o.id IS NULL;" },
          { t: "table", head: ["Ranking", "Ties (1,1,2)"], rows: [
            ["ROW_NUMBER()", "1,2,3 — always unique"],
            ["RANK()", "1,1,3 — gap after a tie"],
            ["DENSE_RANK()", "1,1,2 — no gap"]
          ]},
          { t: "call", tone: "trap", html: "<b>NULL traps:</b> <code>NOT IN (subquery with a NULL)</code> returns no rows — use <code>NOT EXISTS</code>. A right-table condition in <code>WHERE</code> demotes a LEFT JOIN to INNER — put it in <code>ON</code>. <code>COUNT(col)</code> skips NULLs; <code>COUNT(*)</code> doesn't." }
        ]
      }
    ],

    /* ---------------------------------------------------------- RECALLED REFERENCES */
    refsIntro: "Thirteen things you saved and read. One-paragraph jogs — not re-reading, just enough to reload it into memory.",
    refs: [
      { kind: "leetcode", title: "Longest Substring Without Repeating Characters", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        summary: "Sliding window with a last-seen map. Expand right; when you meet a repeat, jump left to max(left, last_seen[c]+1) so the window never contains a duplicate. Track best length as you go. O(n)." },
      { kind: "leetcode", title: "Two Sum", url: "https://leetcode.com/problems/two-sum/",
        summary: "One pass, a dict of value→index. For each x check if target-x was already seen; if so you have the pair. The archetype of 'trade space for time' — O(n) instead of the O(n²) double loop." },
      { kind: "leetcode", title: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/",
        summary: "Dummy head + tail cursor. Repeatedly splice the smaller of a/b onto the tail, advance that list; attach whatever remains. The dummy node removes the empty-list edge case. O(n+m)." },
      { kind: "chatgpt", title: "fmod vs % · finding a cycle's start", url: "https://chatgpt.com/share/6a4dace0-e8f8-83ed-b578-058a92eb826d",
        summary: "Python % follows the divisor's sign (-7%10=3); C's fmod follows the dividend. For Floyd's cycle: after slow/fast meet, reset one pointer to head and step both one at a time — they meet at the cycle's entry node." },
      { kind: "chatgpt", title: "Bitwise operators & tricks", url: "https://chatgpt.com/share/6a4e1b09-41c8-83ed-ace1-ee3deba72e3e",
        summary: "Set/clear/toggle/test bit i with 1<<i. x&-x isolates the lowest set bit; x&=x-1 removes it (Kernighan popcount). Power-of-two ⇔ x>0 and x&(x-1)==0. XOR toggles case with ^0x20 on letters." },
      { kind: "leetcode", title: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams/",
        summary: "Bucket words by a canonical key: the sorted string, or a 26-length letter-count tuple (faster, O(n·k) vs O(n·k log k)). defaultdict(list) collects each bucket." },
      { kind: "kimi", title: "Basic math expression regex", url: "https://www.kimi.com/share/19f55cbf-6192-8f72-8000-0000e3b9a167",
        summary: "Tokenize with re.findall(r'\\d+|[+\\-*/()]', s) to split numbers and operators cleanly. But for +-*/ without parens, a single left-to-right scan with a stack (fold * and / immediately) is simpler than a full parser — and avoids the regex edge cases that cost you time on F87." },
      { kind: "chatgpt", title: "Frequency games — sort, min-heap, bucket sort", url: "https://chatgpt.com/share/6a536b5e-99f4-83eb-9565-5b1548f2c2c9",
        summary: "Top-K frequent, three tiers: sort by count O(n log n); a size-K min-heap O(n log k); or bucket sort by frequency O(n) since counts are ≤ n. State the trade — the interviewer wants to hear you climb that ladder." },
      { kind: "chatgpt", title: "Optimized N-Queens", url: "https://chatgpt.com/share/6a53b2cf-f5f8-83eb-85ff-7e7b3001d079",
        summary: "Track attacked columns and both diagonals as bitmasks (col, r+c for one diagonal, r-c+offset for the other). Placing/removing a queen is a bit flip; free squares are found with bit ops. Turns the O(n!) search lean." },
      { kind: "chatgpt", title: "Binary search — recognising the use case", url: "https://chatgpt.com/share/6a53eeec-51d8-83ed-b32e-5ec000d87737",
        summary: "Binary search applies whenever a monotonic predicate exists: some threshold below which the answer is 'no' and at/above which it's 'yes'. The array needn't be literally sorted — the FEASIBILITY must be monotone." },
      { kind: "chatgpt", title: "Three binary-search modes", url: "https://chatgpt.com/s/t_6a53eff9ccbc81919d41ef78725dc9f2",
        summary: "Exact (while lo<=hi, return on hit). Boundary/first-true (while lo<hi, hi=mid or lo=mid+1, converges to the boundary). Search-on-answer (binary-search the answer value, test with a helper). Don't mix templates — that's the off-by-one bug source." },
      { kind: "kimi", title: "Koko, ships, cows — binary search in the answer space", url: "https://www.kimi.com/share/19f580d7-85b2-81f6-8000-0000464a512f",
        summary: "When asked for the min/max value that satisfies a feasibility test (eating speed, ship capacity, cow spacing), binary-search the ANSWER between lo/hi and call a feasible(mid) helper. O(n log range)." },
      { kind: "chatgpt", title: "Median of two sorted arrays", url: "https://chatgpt.com/s/t_6a54094f35788191841c15d1f0d5160b",
        summary: "Binary-search a partition of the SMALLER array so left and right halves are balanced and max(left) ≤ min(right). O(log min(m,n)). The tricky part is the ±infinity sentinels at the partition edges — draw it." }
    ]
  };

  global.FINALE = FINALE;
})(window);
