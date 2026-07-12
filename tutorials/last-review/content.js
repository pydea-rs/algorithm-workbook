(function () {
  "use strict";

  function section(id, title, minutes, blocks) {
    return { id, title, minutes, blocks };
  }
  function html(s) { return { kind: "html", html: s }; }
  function code(lang, c) { return { kind: "code", lang, code: c }; }
  function callout(type, title, s) { return { kind: "callout", type, title, html: s }; }
  function check(id, text) { return { kind: "check", id, text }; }
  function question(label, tags, insight) { return { kind: "question", label, tags, insight }; }

  function buildContent(mode) {
    const long = mode === "long";
    const sections = [];

    // ============================================================
    // 1. Interview craft & day-of checklist
    // ============================================================
    sections.push(section("interview-craft", "Interview craft & day-of checklist", long ? 12 : 6, [
      html(`
        <p>The interview is not just correctness — it is <strong>communication under pressure</strong>. The interviewer is grading whether you can reason out loud, catch edge cases, and write clean code while explaining it.</p>
        <p>Use a repeatable ritual so your brain does not improvise.</p>
      `),
      callout("good", "The 6-step live-coding ritual", `
        <ol>
          <li><strong>Repeat the problem back</strong> in your own words to confirm you understood.</li>
          <li><strong>Clarify constraints</strong> — input size, duplicates, empty inputs, sortedness, data types.</li>
          <li><strong>Walk through one concrete example</strong> by hand; say what the answer should be.</li>
          <li><strong>Start with brute force</strong>, state its complexity, then optimise.</li>
          <li><strong>Code and narrate</strong> — every variable name and loop invariant should have a reason.</li>
          <li><strong>Test out loud</strong> with the example from step 3, plus edge cases.</li>
        </ol>
      `),
      check("craft-repeat", "I will restate the problem before solving."),
      check("craft-examples", "I will pick a concrete example before coding."),
      check("craft-complexity", "I will name time/space complexity before writing code."),
      check("craft-test", "I will trace at least one test case out loud after coding."),
      html(`
        <h4>Environment checklist</h4>
        <ul>
          <li>Quiet room, camera on, good light, water nearby.</li>
          <li>Pen and paper for examples and trees/graphs.</li>
          <li>Only the coding tab and the interview tab open; notifications off.</li>
          <li>Python environment ready if they ask you to run anything.</li>
        </ul>
      `),
      long ? html(`
        <h4>Phrases that buy thinking time</h4>
        <ul>
          <li>"Let me rephrase that to make sure I understood…"</li>
          <li>"Before I optimise, let me say the naive O(n²) approach…"</li>
          <li>"The invariant I want to maintain is…"</li>
          <li>"I want to double-check the empty-input case."</li>
        </ul>
        <p><strong>Time budget in a 3-hour interview:</strong> ~25–30 min per algorithm problem, ~20 min for SQL/design, the rest for discussion. If you are stuck after 5 minutes, say so and ask for a hint — silence is worse than a hint.</p>
      `) : html(`<p class="note-soft">If stuck for more than ~5 minutes, ask for a hint. Silence costs more than a hint.</p>`)
    ]));

    // ============================================================
    // 2. Complexity & Python gotchas
    // ============================================================
    sections.push(section("complexity", "Complexity & Python gotchas", long ? 10 : 5, [
      html(`
        <p>Read the input size first. It tells you the target complexity before you write a line.</p>
      `),
      code("py", `n <= 20      -> O(2^n) / bitmask DP is fine
n <= 500     -> O(n^3) is okay
n <= 5_000   -> O(n^2) is okay
n <= 1e6     -> O(n log n) or O(n)
n > 1e7      -> O(n) or better, mind constants`),
      html(`<h4>Operation costs in Python</h4>`),
      code("py", `list[i], .append          -> amortised O(1)
list.insert(0), .pop(0)   -> O(n)  (use collections.deque)
x in list                  -> O(n)
x in set/dict              -> O(1) average
heappush / heappop         -> O(log n)
sorted()                   -> O(n log n)
bisect_left/right          -> O(log n) find, O(n) insert`),
      callout("warn", "Python traps that eat interview time", `
        <ul>
          <li><strong>Mutable default argument:</strong> <code>def f(acc=[])</code> shares the list across calls. Use <code>acc=None</code> and assign inside.</li>
          <li><strong>Integer division floors toward -∞:</strong> <code>-7 // 2 == -4</code>.</li>
          <li><strong>Copy vs alias:</strong> <code>b = a[:]</code> copies a list; <code>grid = [[0]*C for _ in range(R)]</code> (not <code>[[0]*C]*R</code>).</li>
          <li><strong>String building in a loop is O(n²):</strong> use <code>"".join(parts)</code>.</li>
          <li><strong>Do not mutate a list while iterating it.</strong> Rebuild: <code>xs = [x for x in xs if keep(x)]</code>.</li>
          <li><strong>Recursion limit</strong> is ~1000; mention converting to an explicit stack for deep inputs.</li>
        </ul>
      `),
      long ? html(`
        <h4>Built-ins worth having in your fingers</h4>
        <p><code>collections.defaultdict, Counter, deque</code> · <code>heapq</code> · <code>bisect</code> · <code>itertools</code> · <code>math.gcd, lcm, isqrt, comb, factorial</code> · <code>functools.lru_cache / cache</code> · <code>enumerate, zip, sorted, reversed, sum, min, max, any, all</code>.</p>
      `) : html(`<p class="note-soft">Keep <code>defaultdict, Counter, deque, heapq, bisect, lru_cache</code> ready.</p>`),
      check("complexity-read-n", "I will read n before choosing an algorithm."),
      check("complexity-mutable-default", "I will never use a mutable default argument.")
    ]));

    // ============================================================
    // 3. Arrays, strings & two pointers
    // ============================================================
    sections.push(section("arrays", "Arrays, strings & two pointers", long ? 11 : 4, [
      html(`<p>Most array questions reduce to a small set of movements across the array.</p>`),
      html(`<h4>Two-pointer patterns</h4>`),
      code("py", `# Opposite ends (sorted array, pair sum, container with most water)
l, r = 0, len(a) - 1
while l < r:
    if condition(a[l], a[r]):
        # record answer
    # move the pointer that improves the objective

# Same-direction / slow-fast (remove duplicates, partition, dutch flag)
slow = 0
for fast in range(len(a)):
    if keep(a[fast]):
        a[slow] = a[fast]
        slow += 1`),
      html(`<h4>Variable-size sliding window</h4>`),
      code("py", `from collections import Counter
need = Counter(target)
missing = len(target)
lo = 0
for hi, ch in enumerate(s):
    if need[ch] > 0: missing -= 1
    need[ch] -= 1
    while missing == 0:
        # window s[lo:hi+1] is valid
        if need[s[lo]] == 0: missing += 1
        need[s[lo]] += 1
        lo += 1`),
      html(`<h4>Prefix sum + hash map</h4>`),
      code("py", `# Subarray sum equals k (handles negatives)
prefix = {0: 1}
cur = 0
count = 0
for x in nums:
    cur += x
    count += prefix.get(cur - k, 0)
    prefix[cur] = prefix.get(cur, 0) + 1`),
      long ? code("py", `# Monotonic deque: sliding window maximum
from collections import deque
def max_sliding_window(nums, k):
    q = deque()  # stores indices, values decreasing
    out = []
    for i, x in enumerate(nums):
        while q and nums[q[-1]] < x:
            q.pop()
        q.append(i)
        if q[0] <= i - k:
            q.popleft()
        if i >= k - 1:
            out.append(nums[q[0]])
    return out`) : html(``),
      html(`<h4>Kadane — maximum subarray</h4>`),
      code("py", `best = cur = nums[0]
for x in nums[1:]:
    cur = max(x, cur + x)
    best = max(best, cur)`),
      callout("tip", "Array questions to recognise instantly", `
        <ul>
          <li><strong>Two sum (sorted)</strong> → opposite pointers.</li>
          <li><strong>3Sum / container with most water</strong> → sort + two pointers.</li>
          <li><strong>Product of array except self</strong> → prefix & suffix passes.</li>
          <li><strong>Trapping rain water</strong> → two pointers tracking max left/right.</li>
          <li><strong>Minimum window substring</strong> → variable sliding window with missing counter.</li>
          <li><strong>Subarray sum equals k</strong> → prefix-sum hash map.</li>
        </ul>
      `),
      check("arrays-window", "I can write a variable sliding window with a missing counter."),
      check("arrays-prefix", "I can use prefix-sum + hash map for subarray sums."),
      long ? question("Trapping Rain Water", ["array", "two pointers"], "Track maxLeft and maxRight; water at i is min(maxL, maxR) - height[i].") : null
    ].filter(Boolean)));

    // ============================================================
    // 4. Hash maps & sets
    // ============================================================
    sections.push(section("hashmaps", "Hash maps & sets", long ? 8 : 4, [
      html(`<p>Use a hash map when you need <strong>fast membership</strong> or <strong>grouping by a key</strong>. The right key is everything.</p>`),
      callout("tip", "Hashable keys", `
        <p>Dict keys must be immutable. To group by a set of items regardless of order:</p>
        <ul>
          <li><code>frozenset(points)</code> if order does not matter.</li>
          <li><code>tuple(sorted(points))</code> if you need canonical order.</li>
        </ul>
        <p>Never use <code>str(points)</code> as a key — it depends on repr order.</p>
      `),
      html(`<h4>When to hash</h4>`),
      code("py", `# Frequency map
from collections import Counter
cnt = Counter(arr)

# First occurrence index
first = {x: i for i, x in enumerate(arr)}

# Complement lookup (Two Sum)
seen = {}
for i, x in enumerate(nums):
    if target - x in seen:
        return [seen[target - x], i]
    seen[x] = i`),
      callout("warn", "Common hash-map mistakes", `
        <ul>
          <li><code>x in list</code> is O(n); use a <code>set</code> for membership.</li>
          <li>Mutating a collection while iterating over it causes skips/errors.</li>
          <li>For duplicate handling, sort first, then skip <code>i &gt; start and nums[i] == nums[i-1]</code>.</li>
        </ul>
      `),
      check("hashmaps-key", "I will pick an immutable, order-independent key when grouping."),
      long ? question("Longest Consecutive Sequence", ["hash set"], "Guard the inner walk: only start a sequence from x if x-1 is NOT in the set. That makes total work O(n).") : null
    ].filter(Boolean)));

    // ============================================================
    // 5. Linked lists, math & bits
    // ============================================================
    sections.push(section("linkedlists", "Linked lists, math & bits", long ? 12 : 6, [
      html(`<p>Linked-list questions are rarely hard once you remember two tricks: <strong>reverse in-place</strong> and <strong>fast/slow pointers</strong>.</p>`),
      html(`<h4>Reverse a linked list</h4>`),
      code("py", `def reverse_list(head):
    prev = None
    cur = head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev, cur = cur, nxt
    return prev`),
      html(`<h4>Fast / slow pointers</h4>`),
      code("py", `# Middle node
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
# slow is middle

# Cycle detection
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow is fast:
        return True  # node identity, not value`),
      html(`<h4>Merge two sorted lists</h4>`),
      code("py", `dummy = ListNode()
tail = dummy
while a and b:
    if a.val <= b.val:
        tail.next, a = a, a.next
    else:
        tail.next, b = b, b.next
    tail = tail.next
tail.next = a or b
return dummy.next`),
      long ? html(`<h4>Math toolkit</h4>`) : null,
      long ? code("py", `# Sieve of Eratosthenes
def count_primes(n):
    if n < 3: return 0
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n, i):
                is_prime[j] = False
    return sum(is_prime)

# GCD / LCM
import math
g = math.gcd(a, b)
lcm = a // g * b

# Fast modular exponentiation
def power_mod(base, exp, mod):
    result = 1
    b = base % mod
    while exp > 0:
        if exp & 1:
            result = result * b % mod
        b = b * b % mod
        exp >>= 1
    return result`) : null,
      html(`<h4>Bit tricks</h4>`),
      code("py", `x & 1           -> odd test
x & (x - 1)     -> clears lowest set bit; == 0 means power of two
x & -x          -> isolates lowest set bit
x ^ y           -> XOR; a ^ a == 0, a ^ 0 == a
(1 << n) - 1    -> mask of n ones
x.bit_count()   -> popcount (Python 3.10+)

# enumerate submasks of mask
sub = mask
while sub:
    use(sub)
    sub = (sub - 1) & mask`),
      check("ll-reverse", "I can reverse a linked list in-place."),
      check("ll-cycle", "I can detect a cycle with fast/slow pointers."),
      check("bits-xor", "I remember XOR cancels pairs and x & (x-1) clears the lowest bit.")
    ].filter(Boolean)));

    // ============================================================
    // 6. Recursion & backtracking
    // ============================================================
    sections.push(section("backtracking", "Recursion & backtracking", long ? 10 : 5, [
      html(`<p>Backtracking is <strong>choose / explore / un-choose</strong>. The most common bug is forgetting to snapshot the path.</p>`),
      code("py", `def backtrack(path, choices):
    if is_complete(path):
        results.append(path.copy())  # snapshot!
        return
    for c in available(choices):
        path.append(c)        # choose
        backtrack(path, ...)  # explore
        path.pop()            # un-choose`),
      html(`<h4>Shape controls available()</h4>`),
      code("py", `# Permutations: anything not used
used = [False] * len(nums)
# ... if not used[i]: mark, recurse, unmark

# Subsets: only items after last chosen
for i in range(start, len(nums)):
    path.append(nums[i])
    backtrack(i + 1)
    path.pop()

# Combinations of size k: stop at depth k
if len(path) == k:
    results.append(path.copy())
    return
for i in range(start, len(nums)): ...`),
      callout("warn", "Backtracking gotchas", `
        <ul>
          <li><code>results.append(path)</code> stores a reference to a list you will pop. Use <code>path.copy()</code>.</li>
          <li>To avoid duplicate combinations, <strong>sort first</strong> then skip <code>i &gt; start and nums[i] == nums[i-1]</code>.</li>
          <li>Prune early: in Combination Sum, <code>break</code> (not <code>continue</code>) when remaining - c &lt; 0 if sorted.</li>
        </ul>
      `),
      long ? code("py", `# Word search: in-place mark and restore
R, C = len(board), len(board[0])
def dfs(r, c, i):
    if i == len(word): return True
    if not (0 <= r < R and 0 <= c < C) or board[r][c] != word[i]:
        return False
    board[r][c] = '#'           # choose
    found = (dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or
             dfs(r,c+1,i+1) or dfs(r,c-1,i+1))
    board[r][c] = word[i]       # un-choose
    return found`) : null,
      check("bt-snapshot", "I will snapshot path.copy() when recording results."),
      check("bt-dup", "I will sort and skip equal neighbours to kill duplicate subsets/combinations.")
    ].filter(Boolean)));

    // ============================================================
    // 7. Binary search
    // ============================================================
    sections.push(section("binarysearch", "Binary search", long ? 12 : 6, [
      html(`<p>Binary search is the most-failed "easy" topic because shapes get mixed. Pick one template and stick to it.</p>`),
      html(`<h4>Exact match (inclusive bounds)</h4>`),
      code("py", `def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`),
      html(`<h4>Boundary search / bisect_left (half-open)</h4>`),
      code("py", `def bisect_left(a, x):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < x:
            lo = mid + 1
        else:
            hi = mid
    return lo`),
      callout("tip", "Which shape am I using?", `
        <ul>
          <li><strong>Exact match</strong>: <code>lo &lt;= hi</code>, both updates exclude <code>mid</code>.</li>
          <li><strong>Boundary / insertion point</strong>: <code>lo &lt; hi</code>, <code>hi = mid</code> keeps <code>mid</code>.</li>
          <li><strong>Search-on-answer</strong>: define a monotone <code>can(x)</code>, boundary-search the answer space.</li>
        </ul>
      `),
      long ? code("py", `# Search on the answer: Koko eating bananas
def min_eating_speed(piles, h):
    def can(k):
        return sum((p + k - 1) // k for p in piles) <= h
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if can(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`) : null,
      long ? code("py", `# Median of two sorted arrays — partition search
def find_median_sorted_arrays(a, b):
    if len(a) > len(b): a, b = b, a
    m, n = len(a), len(b)
    total_left = (m + n + 1) // 2
    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2
        j = total_left - i
        max_left_a  = a[i-1] if i > 0 else float('-inf')
        min_right_a = a[i]   if i < m else float('inf')
        max_left_b  = b[j-1] if j > 0 else float('-inf')
        min_right_b = b[j]   if j < n else float('inf')
        if max_left_a <= min_right_b and max_left_b <= min_right_a:
            if (m + n) % 2:
                return float(max(max_left_a, max_left_b))
            return (max(max_left_a, max_left_b) + min(min_right_a, min_right_b)) / 2.0
        if max_left_a > min_right_b:
            hi = i - 1
        else:
            lo = i + 1`) : null,
      check("bs-shape", "I know when to use inclusive vs half-open binary search."),
      check("bs-answer", "I can frame 'minimum X such that condition holds' as search-on-answer.")
    ].filter(Boolean)));

    // ============================================================
    // 8. Trees
    // ============================================================
    sections.push(section("trees", "Trees", long ? 12 : 6, [
      html(`<p>Nearly every tree question is one recursion pattern wearing a costume.</p>`),
      html(`<h4>Top-down vs bottom-up</h4>`),
      code("py", `# Top-down: pass constraints to children (validate BST)
def check(node, lo, hi):
    if not node: return True
    if not (lo < node.val < hi): return False
    return check(node.left, lo, node.val) and check(node.right, node.val, hi)

# Bottom-up: return summaries (height, diameter)
def diameter(root):
    best = 0
    def height(node):
        nonlocal best
        if not node: return 0
        lh, rh = height(node.left), height(node.right)
        best = max(best, lh + rh)
        return 1 + max(lh, rh)
    height(root)
    return best`),
      html(`<h4>Lowest common ancestor</h4>`),
      code("py", `def lca(root, p, q):
    if not root or root is p or root is q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right:
        return root
    return left or right`),
      long ? html(`<h4>Serialize / deserialize</h4>`) : null,
      long ? code("py", `def serialize(root):
    parts = []
    def dfs(node):
        if not node:
            parts.append('#')
            return
        parts.append(str(node.val))
        dfs(node.left); dfs(node.right)
    dfs(root)
    return ','.join(parts)

def deserialize(data):
    vals = iter(data.split(','))
    def build():
        v = next(vals)
        if v == '#': return None
        node = TreeNode(int(v))
        node.left = build(); node.right = build()
        return node
    return build()`) : null,
      check("trees-direction", "I ask: does the node need ancestor info or subtree info?"),
      check("trees-lca", "I remember LCA is the first split of p and q into different subtrees.")
    ].filter(Boolean)));

    // ============================================================
    // 9. Graphs
    // ============================================================
    sections.push(section("graphs", "Graphs", long ? 14 : 7, [
      html(`<p>Pick the algorithm by the question smell, then say the decision out loud.</p>`),
      html(`<h4>Decision table</h4>`),
      code("py", `shortest path, unweighted        -> BFS         O(V+E)
shortest path, weighted, no neg  -> Dijkstra    O(E log V)
negative edges                   -> Bellman-Ford O(VE)
dependency order / DAG cycle     -> Kahn        O(V+E)
connectivity online              -> Union-Find  ~O(1)/op
reachability / explore all       -> DFS         O(V+E)`),
      html(`<h4>Kahn's topological sort + cycle detection</h4>`),
      code("py", `from collections import deque
graph = [[] for _ in range(n)]
indeg = [0] * n
for a, b in edges:
    graph[a].append(b)
    indeg[b] += 1
q = deque(i for i in range(n) if indeg[i] == 0)
order = []
while q:
    u = q.popleft(); order.append(u)
    for v in graph[u]:
        indeg[v] -= 1
        if indeg[v] == 0:
            q.append(v)
# len(order) < n  -> cycle`),
      html(`<h4>Dijkstra with lazy deletion</h4>`),
      code("py", `import heapq
dist = {start: 0}
heap = [(0, start)]
while heap:
    d, u = heapq.heappop(heap)
    if d > dist.get(u, float('inf')): continue  # stale entry
    for v, w in graph[u]:
        nd = d + w
        if nd < dist.get(v, float('inf')):
            dist[v] = nd
            heapq.heappush(heap, (nd, v))`),
      long ? html(`<h4>Union-Find with path halving</h4>`) : null,
      long ? code("py", `parent = list(range(n))
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x
def union(a, b):
    ra, rb = find(a), find(b)
    if ra == rb: return False
    parent[ra] = rb
    return True`) : null,
      long ? callout("tip", "Reverse thinking", `
        <p>When the question asks "which cells can reach X?", flip it: start from X and climb backwards. Examples: Pacific-Atlantic water flow, nodes reachable from all nodes. The reversed rule must keep equality (≥) if the forward rule allowed equal height.</p>
      `) : null,
      check("graphs-pick", "I will name BFS/Dijkstra/Kahn/Union-Find/DFS before coding."),
      check("graphs-dijkstra", "I remember Dijkstra needs non-negative weights and lazy deletion skips stale heap entries.")
    ].filter(Boolean)));

    // ============================================================
    // 10. Dynamic programming
    // ============================================================
    sections.push(section("dp", "Dynamic programming", long ? 14 : 8, [
      html(`<p>DP is recursion plus a notebook. If brute-force recursion repeats subproblems, cache them.</p>`),
      html(`<h4>Four-step recipe</h4>`),
      code("py", `1. Write the brute-force recursion.
2. Name the state (the changing arguments).
3. Memoize — @functools.cache or a dict.
4. Convert to bottom-up only if asked / recursion depth is risky.`),
      html(`<h4>Shape 1 — 1D take/skip (House Robber)</h4>`),
      code("py", `def rob(nums):
    take = skip = 0
    for x in nums:
        take, skip = skip + x, max(take, skip)
    return max(take, skip)`),
      html(`<h4>Shape 2 — unbounded choice (Coin Change)</h4>`),
      code("py", `def coin_change(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] <= amount else -1`),
      long ? code("py", `# Shape 3 — 2D over two sequences (LCS / Edit Distance)
def longest_common_subsequence(t1, t2):
    m, n = len(t1), len(t2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m-1, -1, -1):
        for j in range(n-1, -1, -1):
            if t1[i] == t2[j]:
                dp[i][j] = 1 + dp[i+1][j+1]
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j+1])
    return dp[0][0]

# Edit Distance is the same skeleton: replace/delete/insert cost 1`) : null,
      long ? code("py", `# Shape 4 — LIS in O(n log n)
import bisect
def length_of_lis(nums):
    tails = []
    for x in nums:
        i = bisect.bisect_left(tails, x)
        if i == len(tails): tails.append(x)
        else: tails[i] = x
    return len(tails)
# tails is NOT the actual subsequence — only its length matters`) : null,
      long ? code("py", `# DP over cut points (Word Break)
def word_break(s, word_dict):
    words = set(word_dict)
    dp = [True] + [False] * len(s)
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]`) : null,
      callout("tip", "DP vs greedy vs backtracking", `
        <ul>
          <li><strong>Greedy</strong> works when a local choice never hurts (prove with exchange argument).</li>
          <li><strong>DP</strong> when you need count/min/max over exponentially many paths and subproblems repeat.</li>
          <li><strong>Backtracking</strong> when you must enumerate all solutions or n ≤ ~20.</li>
        </ul>
      `),
      check("dp-state", "I will identify the state by writing the recursion signature first."),
      check("dp-cache", "I will memoize before converting to bottom-up.")
    ].filter(Boolean)));

    // ============================================================
    // 11. Greedy & intervals
    // ============================================================
    sections.push(section("greedy", "Greedy & intervals", long ? 10 : 5, [
      html(`<p>Greedy code is short; the interview value is in the justification. Use an exchange argument or "stays ahead" proof.</p>`),
      html(`<h4>Interval toolkit</h4>`),
      code("py", `merge overlapping intervals      -> sort by START
max non-overlapping / min removal -> sort by END
min meeting rooms / max overlap   -> sweep line +1/-1
can attend all?                   -> sort by start, detect overlap`),
      html(`<h4>Sweep line</h4>`),
      code("py", `def min_meeting_rooms(intervals):
    events = []
    for s, e in intervals:
        events.append((s, 1))
        events.append((e, -1))
    events.sort()  # (t,-1) before (t,1) frees the room first
    rooms = best = 0
    for _, d in events:
        rooms += d
        best = max(best, rooms)
    return best`),
      long ? code("py", `# Jump Game II as BFS layers
def jump(nums):
    jumps = cur_end = farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == cur_end:
            jumps += 1
            cur_end = farthest
    return jumps`) : null,
      long ? callout("warn", "When greedy fails", `
        <p>Coin change with coins <code>[1, 3, 4]</code> and amount <code>6</code>: greedy takes <code>4+1+1</code> (3 coins), optimal is <code>3+3</code> (2 coins). Keep this counterexample ready.</p>
      `) : null,
      check("greedy-sort", "I sort intervals by the right key before applying the greedy rule."),
      check("greedy-proof", "I will say the exchange-argument sketch out loud.")
    ].filter(Boolean)));

    // ============================================================
    // 12. Heaps & priority queues
    // ============================================================
    sections.push(section("heaps", "Heaps & priority queues", long ? 8 : 4, [
      html(`<p>Use a heap when you need repeated access to the current min/max while elements arrive or change.</p>`),
      code("py", `import heapq
heap = []
heapq.heappush(heap, x)
smallest = heapq.heappop(heap)

# max-heap in Python: store negatives
heapq.heappush(heap, -x)
-largest = heapq.heappop(heap)

# top-k: size-k min-heap keeps the k largest seen
for x in stream:
    if len(heap) < k: heapq.heappush(heap, x)
    elif x > heap[0]: heapq.heapreplace(heap, x)
# heap[0] is the kth largest`),
      long ? code("py", `# Two heaps: running median
small = []  # max-heap (store negatives)
large = []  # min-heap
for x in nums:
    if not small or x <= -small[0]:
        heapq.heappush(small, -x)
    else:
        heapq.heappush(large, x)
    # rebalance sizes
    if len(small) > len(large) + 1:
        heapq.heappush(large, -heapq.heappop(small))
    elif len(large) > len(small):
        heapq.heappush(small, -heapq.heappop(large))
    # median
    if len(small) == len(large):
        median = (-small[0] + large[0]) / 2
    else:
        median = -small[0]`) : null,
      long ? html(`<h4>JS MinHeap skeleton</h4>`) : null,
      long ? code("js", `class MinHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) {
    const a = this.a; a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p] <= a[i]) break;
      [a[p], a[i]] = [a[i], a[p]]; i = p;
    }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2*i+1, r = l+1, m = i;
        if (l < a.length && a[l] < a[m]) m = l;
        if (r < a.length && a[r] < a[m]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]]; i = m;
      }
    }
    return top;
  }
}`) : null,
      check("heaps-topk", "I use a size-k min-heap for kth largest / top-k streaming."),
      check("heaps-median", "I can maintain a running median with two heaps.")
    ].filter(Boolean)));

    // ============================================================
    // 13. SQL deep dive
    // ============================================================
    sections.push(section("sql", "SQL deep dive", long ? 16 : 7, [
      html(`<p>You know the basics; this is the interview-grade detail.</p>`),
      html(`<h4>Logical processing order</h4>`),
      code("sql", `FROM / JOIN  ->  WHERE  ->  GROUP BY  ->  HAVING  ->  SELECT (aliases born here)
 ->  DISTINCT  ->  ORDER BY  ->  LIMIT`),
      callout("warn", "Join traps", `
        <ul>
          <li><code>ON</code> filters before padding; <code>WHERE</code> filters after padding and can turn a <code>LEFT JOIN</code> into an <code>INNER JOIN</code>.</li>
          <li><code>NOT IN (SELECT nullable_col FROM ...)</code> returns zero rows silently. Use <code>LEFT JOIN ... IS NULL</code> or <code>NOT EXISTS</code> instead.</li>
          <li><code>COUNT(col)</code> ignores NULLs; <code>COUNT(*)</code> counts rows.</li>
          <li>Aggregations in <code>WHERE</code> are illegal — use <code>HAVING</code>.</li>
        </ul>
      `),
      html(`<h4>Conditional aggregation</h4>`),
      code("sql", `SELECT department,
       AVG(CASE WHEN status = 'done' THEN 1.0 ELSE 0.0 END) AS done_rate,
       COUNT(DISTINCT user_id) AS unique_users
FROM tasks
GROUP BY department
HAVING COUNT(*) >= 5;`),
      html(`<h4>Window functions</h4>`),
      code("sql", `SELECT employee_id, salary,
       ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn,
       RANK()       OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk,
       DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS drnk,
       LAG(salary, 1) OVER (PARTITION BY department_id ORDER BY salary) AS prev_salary,
       SUM(salary) OVER (PARTITION BY department_id) AS dept_total
FROM employees;`),
      long ? code("sql", `-- Top-N per group with DENSE_RANK
WITH ranked AS (
  SELECT *, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dr
  FROM employees
)
SELECT * FROM ranked WHERE dr <= 3;`) : null,
      html(`<h4>Anti-join patterns</h4>`),
      code("sql", `-- Customers who never ordered
SELECT c.id, c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;

-- Equivalent with NOT EXISTS
SELECT id, name
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);`),
      html(`<h4>Peak concurrency / sweep line in SQL</h4>`),
      code("sql", `WITH events AS (
  SELECT start_t AS t, 1 AS d FROM bookings
  UNION ALL
  SELECT end_t AS t, -1 AS d FROM bookings
)
SELECT MAX(running) AS peak
FROM (
  SELECT t, SUM(d) OVER (ORDER BY t, d) AS running
  FROM events
) sub;`),
      long ? html(`<h4>Index notes</h4>
        <ul>
          <li>Composite index leftmost-prefix rule: equality columns first, range/sort columns last.</li>
          <li>A covering index lets the query be answered by an index-only scan.</li>
          <li>Functions on indexed columns (e.g. <code>YEAR(created_at)</code>) and leading-wildcard <code>LIKE '%x'</code> defeat the index.</li>
          <li>Indexes cost writes — add them from the workload, not speculatively.</li>
        </ul>
      `) : null,
      check("sql-order", "I remember SELECT aliases are not visible in WHERE or GROUP BY."),
      check("sql-anti", "I use LEFT JOIN ... IS NULL or NOT EXISTS, never NOT IN with nullable columns."),
      check("sql-window", "I can write ROW_NUMBER / RANK / DENSE_RANK / LAG for top-N and adjacent-row problems.")
    ].filter(Boolean)));

    // ============================================================
    // 14. Database design, OOP & system design
    // ============================================================
    sections.push(section("design", "DB design, OOP & system design", long ? 14 : 7, [
      html(`<p>This is where live interviews pivot from "write code" to "design something real".</p>`),
      html(`<h4>Schema design in 5 steps</h4>`),
      code("py", `1. Nouns -> entities
2. Verbs -> relationships (state 1:1, 1:N, N:M out loud)
3. Tables + surrogate PKs + FKs + junction tables for N:M
4. Constraints as documentation (UNIQUE, CHECK, NOT NULL)
5. Indexes from the workload, not speculation`),
      html(`<h4>Normalisation ladder</h4>`),
      code("py", `1NF: atomic columns
2NF: no partial dependency on a composite key
3NF: every non-key column depends on the key, the whole key, and nothing but the key`),
      html(`<h4>SOLID one-liners</h4>`),
      code("py", `S — one reason to change (no god classes)
O — extend behaviour without editing source (avoid if-type chains)
L — subclasses keep parent promises
I — small, focused interfaces
D — depend on abstractions, not concrete classes`),
      long ? html(`<h4>Patterns that come up</h4>
        <ul>
          <li><strong>Strategy</strong> — interchangeable algorithms (pricing, spot assignment).</li>
          <li><strong>Observer</strong> / event bus — notification dispatch.</li>
          <li><strong>Factory</strong> / registry — create objects by key.</li>
          <li><strong>Decorator</strong> — add behaviour without subclassing.</li>
          <li><strong>Adapter</strong> — bridge incompatible interfaces.</li>
        </ul>
      `) : null,
      long ? html(`<h4>System-design framework</h4>
        <ol>
          <li><strong>Requirements</strong> — functional + non-functional, read/write ratio, scale.</li>
          <li><strong>API sketch</strong> — endpoints, inputs/outputs.</li>
          <li><strong>Data model</strong> — tables/relations, hot paths.</li>
          <li><strong>Deep dives</strong> — cache, concurrency, async, failure.</li>
        </ol>
        <p><strong>Golden rule:</strong> every scaling decision gets a "because" with a number.</p>
      `) : null,
      long ? code("py", `# Building blocks
stateless app servers + load balancer
cache-aside (read -> miss -> fill; write -> update DB, DELETE cache)
read replicas for read-heavy workloads
queue + workers for async jobs
object storage + CDN for assets
sharding as a last resort`) : null,
      check("design-relations", "I state cardinalities before drawing tables."),
      check("design-acid", "I can name isolation levels and when to use SELECT ... FOR UPDATE.")
    ].filter(Boolean)));

    // ============================================================
    // 15. Important questions recap
    // ============================================================
    const questions = [];
    questions.push(
      // Core 14 — highest yield, appear in 1.5 h version
      question("Longest Substring Without Repeating Characters", ["sliding window"], "Expand right; shrink from left while the new char is already in the window."),
      question("Minimum Window Substring", ["sliding window"], "Track a 'missing' counter of required characters; shrink only when missing == 0."),
      question("Trapping Rain Water", ["two pointers"], "Two pointers walk inward tracking maxLeft/maxRight; water = min(maxL, maxR) - height."),
      question("3Sum", ["two pointers"], "Sort, fix one element, two-pointer pair sum; skip duplicates with i > start checks."),
      question("Longest Consecutive Sequence", ["hash set"], "Guard the inner walk: only start from x if x-1 is not in the set."),
      question("Merge Intervals", ["intervals"], "Sort by start; extend with max(end), never just assign e."),
      question("Word Ladder", ["graph", "BFS"], "Implicit graph: words are nodes, one-letter diffs are edges."),
      question("Network Delay Time", ["Dijkstra"], "Lazy-deletion heap; popped node finalized only if d matches dist."),
      question("Pacific Atlantic Water Flow", ["graph", "reverse"], "Start from oceans and climb uphill (>=). Intersect the two reachable sets."),
      question("Serialize and Deserialize Binary Tree", ["tree"], "Preorder with '#' sentinel; deserialize with an iterator."),
      question("Lowest Common Ancestor", ["tree"], "First node where p and q split into different subtrees."),
      question("Binary Search on Answer", ["binary search"], "Define monotone can(k); boundary-search the answer space."),
      question("Median of Two Sorted Arrays", ["binary search", "hard"], "Partition the shorter array; sentinels handle empty sides."),
      question("Edit Distance", ["DP"], "2D table: match is free, else 1 + min(replace, delete, insert).")
    );
    if (long) {
      questions.push(
        // Extended set — only in the 3 h version
        question("Longest Increasing Subsequence", ["DP", "binary search"], "tails array + bisect_left; only the length is meaningful."),
        question("Word Break", ["DP"], "dp[i] = prefix breakable and s[j:i] in word set."),
        question("Meeting Rooms II", ["greedy", "sweep line"], "Events +1/-1 sorted; track running max."),
        question("Task Scheduler", ["greedy", "heap"], "Formula with max frequency and ties; max with tasks.length."),
        question("Kth Largest Element", ["heap"], "Size-k min-heap; root is the kth largest."),
        question("LRU Cache", ["design"], "OrderedDict / doubly-linked list + hash map; get/put refresh recency."),
        question("Department Top Three Salaries", ["SQL"], "DENSE_RANK() per department; filter dr <= 3."),
        question("Rank Scores", ["SQL"], "DENSE_RANK() OVER (ORDER BY score DESC)."),
        question("Container With Most Water", ["two pointers"], "Move the shorter line inward; the area is bounded by the shorter side."),
        question("Product of Array Except Self", ["array"], "Prefix products from left, suffix from right, multiply."),
        question("Find Peak Element", ["binary search"], "Walk uphill: if nums[mid] < nums[mid+1] go right, else left."),
        question("Course Schedule", ["graph"], "Kahn's algorithm; done < n means cycle."),
        question("Number of Islands", ["graph"], "Flood-fill DFS/BFS; count unvisited '1's."),
        question("House Robber", ["DP"], "Rolling take/skip variables; tuple assignment."),
        question("Coin Change", ["DP"], "Unbounded knapsack; greedy fails on arbitrary coins."),
        question("Gas Station", ["greedy"], "If tank goes negative at i, no station in [start..i] works; restart at i+1."),
        question("Jump Game II", ["greedy"], "BFS layers; extend farthest, jump when i reaches current end."),
        question("Valid Parentheses", ["stack"], "Push opens; on close, pop must match."),
        question("Missing Number", ["math", "bits"], "n(n+1)/2 - sum, or XOR all indices and values."),
        question("Spiral Matrix", ["array"], "Shrink top/bottom/left/right bounds; check bounds after each side."),
        question("Rotate Image", ["matrix"], "Transpose upper triangle, then reverse each row."),
        question("Top K Frequent Elements", ["heap"], "Counter + heapq.nlargest or size-k min-heap."),
        question("Merge k Sorted Lists", ["heap"], "Min-heap of list heads; pop and push next."),
        question("Time Based Key-Value Store", ["design"], "Map key -> sorted (timestamp, value); binary search last <= timestamp."),
        question("Earning Above Department Average", ["SQL"], "Join a grouped subquery of department averages."),
        question("Peak Concurrent Bookings", ["SQL"], "UNION ALL start/end events; SUM(d) OVER ordered window."),
        question("URL Shortener", ["system design"], "Base62/random code, cache-aside redirect, async click counting."),
        question("API Rate Limiter", ["system design"], "Token bucket; Redis atomic INCR + EXPIRE or Lua script.")
      );
    }
    sections.push(section("questions", "Important questions recap", long ? 12 : 8, [
      html(`<p>A rapid-fire reminder of the highest-yield problems and the single sentence that unlocks each one.</p>`),
      ...questions,
      check("questions-read", "I can state the key insight for each question above without opening the solution.")
    ]));

    // ============================================================
    // 16. Final checklist
    // ============================================================
    sections.push(section("final", "Final checklist", long ? 5 : 2, [
      html(`<p>Right before the call, run through this list.</p>`),
      check("final-quiet", "Room is quiet, door closed, phone silenced."),
      check("final-camera", "Camera on, light from the front, background tidy."),
      check("final-notes", "Pen and paper next to keyboard."),
      check("final-water", "Water nearby."),
      check("final-browser", "Only interview tab + this review tab open."),
      check("final-narrate", "I will narrate every thought and name complexity."),
      check("final-edge", "I will test empty input, single element, duplicates, negatives, overflow."),
      check("final-breathe", "I will pause and breathe before answering a hard follow-up."),
      check("final-hint", "If stuck > 5 minutes, I will ask for a hint without apologising."),
      check("final-done", "I am ready. Good luck.")
    ]));

    return sections;
  }

  window.REVIEW_SHORT = { totalMinutes: 90, sections: buildContent("short") };
  window.REVIEW_LONG = { totalMinutes: 180, sections: buildContent("long") };
})();
