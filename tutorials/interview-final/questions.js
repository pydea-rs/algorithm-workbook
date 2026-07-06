/* ============================================================
   questions.js — Final-Stage question bank.

   Same shape as tutorials/algorithms/questions.js. IDs use the F##
   prefix (F01, F02, ...) to keep them distinct from the algorithms
   tutorial's Q##.

   Question shape:
     id           "F01"
     title        "..."
     difficulty   "Easy" | "Medium" | "Hard" | "Easy-Medium" | "Medium-Hard"
     time         "20-25 min"
     tags         ["Array","Two-Pointer",...]
     type         "python" | "sql" | "design"
     statement    HTML paragraph
     examples     Plain text (rendered in <pre>)
     hint         Single sentence (optional for design)
     solution     Python / SQL source (string) OR design writeup (HTML)
     explanation  Optional follow-up notes

     // python-only:
     functionName, signature, starter, tests

     // sql-only (runnable):
     sqlSchema    CREATE TABLE + INSERT INTO statements (SQLite-portable)
     sqlStarter   Initial SELECT visible in editor
     sqlSolution  Reference query (if `solution` mixes DDL/multiple methods)
     tests        [{name, orderMatters, expected: {columns, rows}}]

     // design-only:
     No sandbox — just statement + reveal-solution button. `solution` is
     the writeup shown in the answer modal (HTML allowed).

   Practice sets and final-exam pool are declared at the bottom.
============================================================ */

window.QUESTIONS = {

  // ============================================================
  // M3 — ARRAYS, TWO-POINTERS, SLIDING WINDOW (ADVANCED)
  // ============================================================

  F01: {
    id: "F01",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["String", "Sliding Window", "Hash Set"],
    type: "python",
    statement:
      "Write <code>longest_unique_substring(s)</code> returning the <em>length</em> of the " +
      "longest substring of <code>s</code> that contains no repeated characters. " +
      "Interview follow-up to be ready for: return the substring itself, not just the length.",
    examples:
      'Input:  "abcabcbb"  -> 3   ("abc")\n' +
      'Input:  "bbbbb"     -> 1   ("b")\n' +
      'Input:  "pwwkew"    -> 3   ("wke", not "pwke" — substring, not subsequence)\n' +
      'Input:  ""          -> 0',
    hint: "Variable window: extend right; while the entering char is a duplicate, shrink from the left.",
    functionName: "longest_unique_substring",
    signature: "longest_unique_substring(s: str) -> int",
    starter:
      "def longest_unique_substring(s):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def longest_unique_substring(s: str) -> int:
    seen = set()
    left = 0
    best = 0
    for right, ch in enumerate(s):
        while ch in seen:
            seen.discard(s[left])
            left += 1
        seen.add(ch)
        best = max(best, right - left + 1)
    return best`,
    explanation:
      "O(n) time — both pointers only move forward — O(min(n, alphabet)) space. " +
      "A common variant stores char -> last index in a dict and jumps `left` directly, " +
      "avoiding the inner while loop entirely.",
    tests: [
      { args: ["abcabcbb"], expected: 3 },
      { args: ["bbbbb"], expected: 1 },
      { args: ["pwwkew"], expected: 3 },
      { args: [""], expected: 0 },
      { args: [" "], expected: 1 },
      { args: ["dvdf"], expected: 3 },
      { args: ["abba"], expected: 2 },
      { args: ["abcdefg"], expected: 7 },
    ],
  },

  F02: {
    id: "F02",
    title: "Count Subarrays Summing to K",
    difficulty: "Medium",
    time: "18-22 min",
    tags: ["Array", "Prefix Sum", "Hash Map"],
    type: "python",
    statement:
      "Write <code>subarray_sum(nums, k)</code> returning the number of contiguous subarrays " +
      "whose elements sum to exactly <code>k</code>. Numbers may be <strong>negative</strong> — " +
      "which is precisely why a sliding window cannot work here.",
    examples:
      "Input:  nums=[1,1,1], k=2          -> 2   ([1,1] twice)\n" +
      "Input:  nums=[1,2,3], k=3          -> 2   ([1,2] and [3])\n" +
      "Input:  nums=[1,-1,0], k=0         -> 3   ([1,-1], [0], [1,-1,0])\n" +
      "Input:  nums=[-1,-1,1], k=0        -> 1",
    hint: "sum(i..j) = P[j+1] - P[i]. Count earlier prefixes equal to current_prefix - k with a hash map.",
    functionName: "subarray_sum",
    signature: "subarray_sum(nums: list[int], k: int) -> int",
    starter:
      "def subarray_sum(nums, k):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def subarray_sum(nums: list, k: int) -> int:
    seen = {0: 1}          # prefix value -> how many times seen
    run = 0
    total = 0
    for x in nums:
        run += x
        total += seen.get(run - k, 0)
        seen[run] = seen.get(run, 0) + 1
    return total`,
    explanation:
      "O(n) time, O(n) space. seen[0]=1 accounts for subarrays starting at index 0. " +
      "Be ready to explain WHY the window dies with negatives: extending the window no longer " +
      "monotonically grows the sum, so shrink decisions can discard future valid answers.",
    tests: [
      { args: [[1, 1, 1], 2], expected: 2 },
      { args: [[1, 2, 3], 3], expected: 2 },
      { args: [[1, -1, 0], 0], expected: 3 },
      { args: [[-1, -1, 1], 0], expected: 1 },
      { args: [[3], 3], expected: 1 },
      { args: [[3], 0], expected: 0 },
      { args: [[0, 0, 0, 0], 0], expected: 10 },
      { args: [[1, 2, 1, 2, 1], 3], expected: 4 },
    ],
  },

  F03: {
    id: "F03",
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    time: "25-30 min",
    tags: ["Array", "Monotonic Deque", "Sliding Window"],
    type: "python",
    statement:
      "Write <code>max_sliding_window(nums, k)</code> returning a list of the maximum of every " +
      "contiguous window of size <code>k</code>. Target O(n) — the O(nk) brute force is the " +
      "warm-up, not the answer.",
    examples:
      "Input:  nums=[1,3,-1,-3,5,3,6,7], k=3 -> [3,3,5,5,6,7]\n" +
      "Input:  nums=[1], k=1                 -> [1]\n" +
      "Input:  nums=[9,8,7,6], k=2           -> [9,8,7]",
    hint: "Deque of indices with strictly decreasing values: pop dominated elements from the back, expired ones from the front.",
    functionName: "max_sliding_window",
    signature: "max_sliding_window(nums: list[int], k: int) -> list[int]",
    starter:
      "def max_sliding_window(nums, k):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import deque

def max_sliding_window(nums: list, k: int) -> list:
    dq = deque()           # indices; values strictly decreasing
    out = []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()                       # dominated, never a max again
        dq.append(i)
        if dq[0] == i - k:
            dq.popleft()                   # slid out of the window
        if i >= k - 1:
            out.append(nums[dq[0]])
    return out`,
    explanation:
      "Each index is pushed once and popped at most once -> amortized O(n). " +
      "Same monotonic idea solves Next Greater Element, Daily Temperatures, and " +
      "Largest Rectangle in Histogram — mention the family when you finish.",
    tests: [
      { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { args: [[1], 1], expected: [1] },
      { args: [[9, 8, 7, 6], 2], expected: [9, 8, 7] },
      { args: [[1, 2, 3, 4], 4], expected: [4] },
      { args: [[4, 4, 4], 2], expected: [4, 4] },
      { args: [[-5, -2, -9, -1], 2], expected: [-2, -2, -1] },
    ],
  },

  F04: {
    id: "F04",
    title: "Container With Most Water",
    difficulty: "Medium",
    time: "12-18 min",
    tags: ["Array", "Two-Pointer", "Greedy Argument"],
    type: "python",
    statement:
      "Given heights of vertical walls, write <code>max_area(height)</code> returning the largest " +
      "amount of water a pair of walls can hold: <code>(j - i) * min(height[i], height[j])</code>. " +
      "The interviewer wants the O(n) two-pointer solution <em>and the proof</em> of why moving " +
      "the shorter pointer is safe.",
    examples:
      "Input:  [1,8,6,2,5,4,8,3,7] -> 49   (walls 8 and 7, width 7)\n" +
      "Input:  [1,1]               -> 1\n" +
      "Input:  [4,3,2,1,4]         -> 16",
    hint: "The shorter wall limits the area; moving the taller pointer can only shrink width without raising the limit.",
    functionName: "max_area",
    signature: "max_area(height: list[int]) -> int",
    starter:
      "def max_area(height):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def max_area(height: list) -> int:
    left, right = 0, len(height) - 1
    best = 0
    while left < right:
        h = min(height[left], height[right])
        best = max(best, (right - left) * h)
        if height[left] <= height[right]:
            left += 1
        else:
            right -= 1
    return best`,
    explanation:
      "Exchange argument: with the shorter wall fixed, every other pairing with it is narrower " +
      "and still capped by its height — so discarding the shorter wall loses nothing. " +
      "O(n) time, O(1) space.",
    tests: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { args: [[1, 1]], expected: 1 },
      { args: [[4, 3, 2, 1, 4]], expected: 16 },
      { args: [[1, 2, 1]], expected: 2 },
      { args: [[2, 3, 4, 5, 18, 17, 6]], expected: 17 },
    ],
  },

  F05: {
    id: "F05",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Array", "Prefix Product", "Space Optimization"],
    type: "python",
    statement:
      "Write <code>product_except_self(nums)</code> returning an array where " +
      "<code>out[i]</code> is the product of all elements except <code>nums[i]</code>. " +
      "<strong>No division.</strong> O(n) time. The output array does not count as extra space — " +
      "aim for O(1) beyond it.",
    examples:
      "Input:  [1,2,3,4]    -> [24,12,8,6]\n" +
      "Input:  [-1,1,0,-3,3] -> [0,0,9,0,0]\n" +
      "Input:  [2,2]         -> [2,2]",
    hint: "Fill the output with prefix products left-to-right, then sweep right-to-left multiplying by a running suffix.",
    functionName: "product_except_self",
    signature: "product_except_self(nums: list[int]) -> list[int]",
    starter:
      "def product_except_self(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def product_except_self(nums: list) -> list:
    n = len(nums)
    out = [1] * n
    for i in range(1, n):              # out[i] = product of everything left of i
        out[i] = out[i - 1] * nums[i - 1]
    suffix = 1
    for i in range(n - 1, -1, -1):     # multiply in everything right of i
        out[i] *= suffix
        suffix *= nums[i]
    return out`,
    explanation:
      "Two passes over the output array plus one scalar. Division is banned because of zeros " +
      "(and because the follow-up 'what if there are zeros?' is the whole point). " +
      "With one zero, only that slot is non-zero; with two zeros, everything is zero.",
    tests: [
      { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
      { args: [[2, 2]], expected: [2, 2] },
      { args: [[5]], expected: [1] },
      { args: [[0, 0]], expected: [0, 0] },
      { args: [[3, 0, 2]], expected: [0, 6, 0] },
    ],
  },

  F06: {
    id: "F06",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    time: "30-35 min",
    tags: ["String", "Sliding Window", "Need/Have Counting"],
    type: "python",
    statement:
      "Write <code>min_window(s, t)</code> returning the smallest substring of <code>s</code> " +
      "containing every character of <code>t</code> <em>with multiplicity</em> " +
      "(t=\"AABC\" needs two A's). Return <code>\"\"</code> if none exists. " +
      "This is the boss fight of sliding windows: the window shrinks while <em>valid</em>, " +
      "not while broken.",
    examples:
      'Input:  s="ADOBECODEBANC", t="ABC" -> "BANC"\n' +
      'Input:  s="a", t="a"               -> "a"\n' +
      'Input:  s="a", t="aa"              -> ""   (needs two a\'s)',
    hint: "Count what t needs, then expand right while decrementing a single `missing` counter; the moment missing hits 0 the window is valid — shrink from the left while it stays valid, recording the smallest window seen.",
    functionName: "min_window",
    signature: "min_window(s: str, t: str) -> str",
    starter:
      "def min_window(s, t):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import Counter

def min_window(s: str, t: str) -> str:
    if not t or not s:
        return ""
    need = Counter(t)
    missing = len(t)               # chars still needed (with multiplicity)
    left = 0
    best = (float("inf"), 0, 0)    # (length, start, end)
    for right, ch in enumerate(s):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1
        if missing == 0:           # window valid -> shrink to minimal
            while need[s[left]] < 0:
                need[s[left]] += 1
                left += 1
            if right - left + 1 < best[0]:
                best = (right - left + 1, left, right + 1)
            # give up the left char to hunt for a smaller window later
            need[s[left]] += 1
            missing += 1
            left += 1
    return s[best[1]:best[2]] if best[0] != float("inf") else ""`,
    explanation:
      "O(|s| + |t|) time. The single `missing` counter avoids comparing whole dicts per step. " +
      "Negative values in `need` mean 'surplus of this char in the window' — that's what lets " +
      "the shrink loop know which chars are safe to drop.",
    tests: [
      { args: ["ADOBECODEBANC", "ABC"], expected: "BANC" },
      { args: ["a", "a"], expected: "a" },
      { args: ["a", "aa"], expected: "" },
      { args: ["aa", "aa"], expected: "aa" },
      { args: ["ab", "b"], expected: "b" },
      { args: ["abc", "cba"], expected: "abc" },
      { args: ["cabwefgewcwaefgcf", "cae"], expected: "cwae" },
    ],
  },

  // ============================================================
  // M4 — HASH MAPS, SETS & COUNTING
  // ============================================================

  F07: {
    id: "F07",
    title: "Group Anagrams",
    difficulty: "Medium",
    time: "12-18 min",
    tags: ["Hash Map", "Canonical Key", "String"],
    type: "python",
    statement:
      "Write <code>group_anagrams(words)</code> grouping words that are anagrams of each other. " +
      "Return a list of groups (order of groups and within groups doesn't matter). " +
      "The real question underneath: <em>what do you use as the dictionary key?</em>",
    examples:
      'Input:  ["eat","tea","tan","ate","nat","bat"]\n' +
      'Output: [["ate","eat","tea"],["nat","tan"],["bat"]]  (any order)\n' +
      'Input:  [""]   -> [[""]]\n' +
      'Input:  ["a"]  -> [["a"]]',
    hint: "Canonical key: sorted(word) as a string, or a 26-slot count tuple. defaultdict(list) collects the groups.",
    functionName: "group_anagrams",
    signature: "group_anagrams(words: list[str]) -> list[list[str]]",
    starter:
      "def group_anagrams(words):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import defaultdict

def group_anagrams(words: list) -> list:
    groups = defaultdict(list)
    for w in words:
        groups["".join(sorted(w))].append(w)
    return list(groups.values())`,
    explanation:
      "O(n · L log L) with the sorted-string key; O(n · L) with a 26-count tuple key. " +
      "State that trade-off out loud, then pick the simpler one unless words are very long. " +
      "Keys must be immutable: a sorted *list* raises TypeError.",
    tests: [
      {
        args: [["eat", "tea", "tan", "ate", "nat", "bat"]],
        expected: ["ate|eat|tea", "bat", "nat|tan"],
        transform: 'result = sorted("|".join(sorted(g)) for g in result)',
      },
      {
        args: [[""]],
        expected: [""],
        transform: 'result = sorted("|".join(sorted(g)) for g in result)',
      },
      {
        args: [["a"]],
        expected: ["a"],
        transform: 'result = sorted("|".join(sorted(g)) for g in result)',
      },
      {
        args: [["ab", "ba", "ab"]],
        expected: ["ab|ab|ba"],
        transform: 'result = sorted("|".join(sorted(g)) for g in result)',
      },
      {
        args: [["abc", "def"]],
        expected: ["abc", "def"],
        transform: 'result = sorted("|".join(sorted(g)) for g in result)',
      },
    ],
  },

  F08: {
    id: "F08",
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Hash Set", "Amortized Analysis"],
    type: "python",
    statement:
      "Write <code>longest_consecutive(nums)</code> returning the length of the longest run of " +
      "consecutive integers present in the (unsorted, possibly duplicated) array. " +
      "<strong>Required: O(n).</strong> Sorting is O(n log n) and explicitly not accepted — " +
      "the interviewer will let you sort, then ask for better.",
    examples:
      "Input:  [100,4,200,1,3,2]      -> 4   (1,2,3,4)\n" +
      "Input:  [0,3,7,2,5,8,4,6,0,1]  -> 9   (0..8)\n" +
      "Input:  []                     -> 0",
    hint: "Set of all values; x starts a run iff x-1 is absent; only walk forward from starts.",
    functionName: "longest_consecutive",
    signature: "longest_consecutive(nums: list[int]) -> int",
    starter:
      "def longest_consecutive(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def longest_consecutive(nums: list) -> int:
    s = set(nums)
    best = 0
    for x in s:
        if x - 1 in s:        # not a run head — skip
            continue
        y = x
        while y + 1 in s:
            y += 1
        best = max(best, y - x + 1)
    return best`,
    explanation:
      "The start-guard is the whole algorithm: each run is walked exactly once from its head, " +
      "so total inner-loop work is <= n. Without the guard this is O(n^2) on [1,2,3,...,n]. " +
      "Iterate over the set, not the list, or duplicates re-walk runs.",
    tests: [
      { args: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
      { args: [[]], expected: 0 },
      { args: [[1]], expected: 1 },
      { args: [[1, 2, 0, 1]], expected: 3 },
      { args: [[-2, -3, -1, 5]], expected: 3 },
      { args: [[5, 5, 5]], expected: 1 },
    ],
  },

  F09: {
    id: "F09",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Hash Map", "Heap", "Bucket Sort"],
    type: "python",
    statement:
      "Write <code>top_k_frequent(nums, k)</code> returning the <code>k</code> most frequent " +
      "values (any order; the answer is guaranteed unique). Know all three rungs of the ladder: " +
      "sort O(n log n), heap O(n log k), bucket O(n) — and be ready to code whichever the " +
      "interviewer asks for after your first version.",
    examples:
      "Input:  nums=[1,1,1,2,2,3], k=2 -> [1,2]\n" +
      "Input:  nums=[1], k=1           -> [1]\n" +
      "Input:  nums=[4,4,4,4], k=1     -> [4]",
    hint: "Counter for frequencies; then heapq.nlargest(k, counts, key=counts.get) — or bucket-by-count for O(n).",
    functionName: "top_k_frequent",
    signature: "top_k_frequent(nums: list[int], k: int) -> list[int]",
    starter:
      "def top_k_frequent(nums, k):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import Counter

def top_k_frequent(nums: list, k: int) -> list:
    counts = Counter(nums)
    # bucket[i] = values appearing exactly i times; a value appears at most n times
    buckets = [[] for _ in range(len(nums) + 1)]
    for val, c in counts.items():
        buckets[c].append(val)
    out = []
    for c in range(len(buckets) - 1, 0, -1):
        for val in buckets[c]:
            out.append(val)
            if len(out) == k:
                return out
    return out`,
    explanation:
      "Bucket version shown — O(n) time and space. The heap one-liner " +
      "`heapq.nlargest(k, counts, key=counts.get)` is O(n log k) and shorter; " +
      "lead with it, then offer the bucket upgrade when asked for O(n).",
    tests: [
      { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], equality: "set" },
      { args: [[1], 1], expected: [1], equality: "set" },
      { args: [[4, 4, 4, 4], 1], expected: [4], equality: "set" },
      { args: [[5, 5, 6, 6, 7], 2], expected: [5, 6], equality: "set" },
      { args: [[-1, -1, -2], 1], expected: [-1], equality: "set" },
      { args: [[1, 2, 3], 3], expected: [1, 2, 3], equality: "set" },
    ],
  },

  F10: {
    id: "F10",
    title: "First Missing Positive",
    difficulty: "Hard",
    time: "25-30 min",
    tags: ["Array", "Index-as-Hash", "In-Place"],
    type: "python",
    statement:
      "Write <code>first_missing_positive(nums)</code> returning the smallest positive integer " +
      "not present. <strong>O(n) time, O(1) extra space</strong> — so no set. " +
      "Key observation to state early: the answer is always in <code>1..n+1</code>, so the array " +
      "itself can act as the hash table.",
    examples:
      "Input:  [1,2,0]     -> 3\n" +
      "Input:  [3,4,-1,1]  -> 2\n" +
      "Input:  [7,8,9,11]  -> 1\n" +
      "Input:  [1,2,3]     -> 4",
    hint: "Cyclic swaps: while nums[i] is in 1..n and not already home at index nums[i]-1, swap it home. Compute j = nums[i]-1 BEFORE the swap.",
    functionName: "first_missing_positive",
    signature: "first_missing_positive(nums: list[int]) -> int",
    starter:
      "def first_missing_positive(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def first_missing_positive(nums: list) -> int:
    n = len(nums)
    for i in range(n):
        # settle whatever lands in slot i
        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
            j = nums[i] - 1          # compute BEFORE mutating nums[i]!
            nums[i], nums[j] = nums[j], nums[i]
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1`,
    explanation:
      "Every swap puts at least one value in its final home, so total swaps <= n -> O(n) despite " +
      "the nested while. The guard `nums[nums[i]-1] != nums[i]` (not `nums[i] != i+1`) is what " +
      "prevents infinite loops on duplicates. And computing `j = nums[i] - 1` before the swap " +
      "matters: in a one-line tuple swap Python evaluates the right side first but assigns " +
      "left-to-right, so `nums[nums[i]-1]` on the left would index with the freshly overwritten " +
      "`nums[i]`.",
    tests: [
      { args: [[1, 2, 0]], expected: 3 },
      { args: [[3, 4, -1, 1]], expected: 2 },
      { args: [[7, 8, 9, 11]], expected: 1 },
      { args: [[1, 2, 3]], expected: 4 },
      { args: [[]], expected: 1 },
      { args: [[1]], expected: 2 },
      { args: [[2]], expected: 1 },
      { args: [[1, 1]], expected: 2 },
      { args: [[2, 2, 2]], expected: 1 },
    ],
  },

  // ============================================================
  // M5 — RECURSION & BACKTRACKING
  // ============================================================

  F11: {
    id: "F11",
    title: "Permutations",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Backtracking", "Recursion"],
    type: "python",
    statement:
      "Write <code>permute(nums)</code> returning all permutations of a list of " +
      "<strong>distinct</strong> integers (any order). Use the backtracking template — " +
      "the interviewer is watching for the choose/explore/un-choose discipline and the " +
      "<code>path.copy()</code> snapshot.",
    examples:
      "Input:  [1,2,3] -> [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n" +
      "Input:  [0,1]   -> [[0,1],[1,0]]\n" +
      "Input:  [1]     -> [[1]]",
    hint: "Track a used-set (or swap in place); recurse when path is full; snapshot with path.copy().",
    functionName: "permute",
    signature: "permute(nums: list[int]) -> list[list[int]]",
    starter:
      "def permute(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def permute(nums: list) -> list:
    results = []
    path = []
    used = [False] * len(nums)

    def backtrack():
        if len(path) == len(nums):
            results.append(path.copy())      # snapshot!
            return
        for i, x in enumerate(nums):
            if used[i]:
                continue
            used[i] = True                   # choose
            path.append(x)
            backtrack()                      # explore
            path.pop()                       # un-choose
            used[i] = False

    backtrack()
    return results`,
    explanation:
      "n! permutations, each of length n -> O(n * n!) output-bound. Follow-up to expect: " +
      "duplicates in nums (sort, then skip nums[i]==nums[i-1] when the twin isn't used), " +
      "or 'do it by swapping in place' (saves the used array).",
    tests: [
      {
        args: [[1, 2, 3]],
        expected: ["1,2,3", "1,3,2", "2,1,3", "2,3,1", "3,1,2", "3,2,1"],
        transform: 'result = sorted(",".join(map(str, p)) for p in result)',
      },
      {
        args: [[0, 1]],
        expected: ["0,1", "1,0"],
        transform: 'result = sorted(",".join(map(str, p)) for p in result)',
      },
      {
        args: [[1]],
        expected: ["1"],
        transform: 'result = sorted(",".join(map(str, p)) for p in result)',
      },
    ],
  },

  F12: {
    id: "F12",
    title: "Combination Sum",
    difficulty: "Medium",
    time: "18-25 min",
    tags: ["Backtracking", "Pruning"],
    type: "python",
    statement:
      "Write <code>combination_sum(candidates, target)</code> returning all unique combinations " +
      "of candidates (distinct positives, <strong>each reusable unlimited times</strong>) summing " +
      "to target. No duplicate combinations: [2,3] and [3,2] are the same. " +
      "The start-index idea prevents duplicates; sorting enables the break-prune.",
    examples:
      "Input:  candidates=[2,3,6,7], target=7 -> [[2,2,3],[7]]\n" +
      "Input:  candidates=[2,3,5],   target=8 -> [[2,2,2,2],[2,3,3],[3,5]]\n" +
      "Input:  candidates=[2],       target=1 -> []",
    hint: "Recurse with (start, remaining); reuse is 'recurse with i, not i+1'; sorted + break when candidate > remaining.",
    functionName: "combination_sum",
    signature: "combination_sum(candidates: list[int], target: int) -> list[list[int]]",
    starter:
      "def combination_sum(candidates, target):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def combination_sum(candidates: list, target: int) -> list:
    candidates = sorted(candidates)
    results = []
    path = []

    def backtrack(start, remaining):
        if remaining == 0:
            results.append(path.copy())
            return
        for i in range(start, len(candidates)):
            c = candidates[i]
            if c > remaining:
                break                    # sorted -> everything after is bigger too
            path.append(c)               # choose
            backtrack(i, remaining - c)  # i, not i+1: reuse allowed
            path.pop()                   # un-choose

    backtrack(0, target)
    return results`,
    explanation:
      "The start index guarantees combinations are generated in non-decreasing order -> no " +
      "duplicates by construction, no results-set needed. `backtrack(i, ...)` vs " +
      "`backtrack(i+1, ...)` is the single character separating 'unlimited reuse' from " +
      "'use each once' — say that out loud, it's the heart of the problem.",
    tests: [
      {
        args: [[2, 3, 6, 7], 7],
        expected: ["2,2,3", "7"],
        transform: 'result = sorted(",".join(map(str, sorted(c))) for c in result)',
      },
      {
        args: [[2, 3, 5], 8],
        expected: ["2,2,2,2", "2,3,3", "3,5"],
        transform: 'result = sorted(",".join(map(str, sorted(c))) for c in result)',
      },
      {
        args: [[2], 1],
        expected: [],
        transform: 'result = sorted(",".join(map(str, sorted(c))) for c in result)',
      },
      {
        args: [[7, 3, 2], 18],
        expected: ["2,2,2,2,2,2,2,2,2", "2,2,2,2,2,2,3,3", "2,2,2,2,3,7", "2,2,2,3,3,3,3", "2,2,7,7", "2,3,3,3,7", "3,3,3,3,3,3"],
        transform: 'result = sorted(",".join(map(str, sorted(c))) for c in result)',
      },
    ],
  },

  F13: {
    id: "F13",
    title: "Word Search",
    difficulty: "Medium-Hard",
    time: "20-25 min",
    tags: ["Backtracking", "Grid", "DFS"],
    type: "python",
    statement:
      "Write <code>exist(board, word)</code> — can <code>word</code> be traced in the 2-D letter " +
      "grid by moving up/down/left/right, using each cell at most once per path? " +
      "The technique to demonstrate: mark visited cells <em>in-place</em> and restore on " +
      "backtrack, instead of copying a visited-set per path.",
    examples:
      'board = [["A","B","C","E"],\n' +
      '         ["S","F","C","S"],\n' +
      '         ["A","D","E","E"]]\n' +
      'word="ABCCED" -> True\n' +
      'word="SEE"    -> True\n' +
      'word="ABCB"   -> False  (B reused)',
    hint: "DFS(r, c, i): bounds+letter check, overwrite board[r][c]='#', try 4 neighbors for i+1, restore.",
    functionName: "exist",
    signature: "exist(board: list[list[str]], word: str) -> bool",
    starter:
      "def exist(board, word):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def exist(board: list, word: str) -> bool:
    R, C = len(board), len(board[0])

    def dfs(r, c, i):
        if i == len(word):
            return True
        if not (0 <= r < R and 0 <= c < C) or board[r][c] != word[i]:
            return False
        board[r][c] = "#"                       # choose (mark visited)
        found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or
                 dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))
        board[r][c] = word[i]                   # un-choose (restore)
        return found

    return any(dfs(r, c, 0) for r in range(R) for c in range(C))`,
    explanation:
      "O(R*C * 4^L) worst case where L = len(word); the in-place mark keeps space at O(L) " +
      "recursion depth. Standard follow-up: 'many words against one board?' -> build a Trie of " +
      "the words and DFS the board once (Word Search II).",
    tests: [
      { args: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"], expected: true },
      { args: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE"], expected: true },
      { args: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"], expected: false },
      { args: [[["a"]], "a"], expected: true },
      { args: [[["a"]], "b"], expected: false },
      { args: [[["a","a"]], "aaa"], expected: false },
      { args: [[["A","B"],["C","D"]], "ABDC"], expected: true },
    ],
  },

  F14: {
    id: "F14",
    title: "Generate Parentheses",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Backtracking", "Invariant Pruning"],
    type: "python",
    statement:
      "Write <code>generate_parenthesis(n)</code> returning all strings of <code>n</code> pairs " +
      "of balanced parentheses. The elegance test: prune <em>during</em> generation with two " +
      "counters instead of generating all 2^(2n) strings and filtering.",
    examples:
      'Input:  n=3 -> ["((()))","(()())","(())()","()(())","()()()"]\n' +
      'Input:  n=1 -> ["()"]',
    hint: "Add '(' while open < n; add ')' while closed < open. Those two rules alone guarantee validity.",
    functionName: "generate_parenthesis",
    signature: "generate_parenthesis(n: int) -> list[str]",
    starter:
      "def generate_parenthesis(n):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def generate_parenthesis(n: int) -> list:
    results = []

    def backtrack(path, opened, closed):
        if len(path) == 2 * n:
            results.append("".join(path))
            return
        if opened < n:
            path.append("(")
            backtrack(path, opened + 1, closed)
            path.pop()
        if closed < opened:
            path.append(")")
            backtrack(path, opened, closed + 1)
            path.pop()

    backtrack([], 0, 0)
    return results`,
    explanation:
      "The two guards ARE the definition of a valid prefix — so every leaf is valid by " +
      "construction and no filtering happens. Count is the Catalan number C(n). If asked for " +
      "complexity, 'O(4^n / sqrt(n)) — Catalan growth' is the exact answer; " +
      "'exponential in n, one unit of work per valid prefix' is the honest one.",
    tests: [
      { args: [1], expected: ["()"], equality: "sorted-list" },
      { args: [2], expected: ["(())", "()()"], equality: "sorted-list" },
      { args: [3], expected: ["((()))", "(()())", "(())()", "()(())", "()()()"], equality: "sorted-list" },
    ],
  },

  F15: {
    id: "F15",
    title: "N-Queens (count solutions)",
    difficulty: "Hard",
    time: "25-30 min",
    tags: ["Backtracking", "Constraint Sets"],
    type: "python",
    statement:
      "Write <code>total_n_queens(n)</code> counting the placements of <code>n</code> queens on " +
      "an n×n board with none attacking another. One queen per row is forced — so the recursion " +
      "is over rows, and three sets (columns, diagonals <code>r-c</code>, anti-diagonals " +
      "<code>r+c</code>) make each conflict check O(1).",
    examples:
      "Input:  n=1 -> 1\n" +
      "Input:  n=2 -> 0\n" +
      "Input:  n=3 -> 0\n" +
      "Input:  n=4 -> 2\n" +
      "Input:  n=8 -> 92",
    hint: "place(r): for each free column c, claim (c, r-c, r+c), recurse r+1, release. Base case r==n counts 1.",
    functionName: "total_n_queens",
    signature: "total_n_queens(n: int) -> int",
    starter:
      "def total_n_queens(n):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def total_n_queens(n: int) -> int:
    cols, diag, anti = set(), set(), set()

    def place(r):
        if r == n:
            return 1
        count = 0
        for c in range(n):
            if c in cols or (r - c) in diag or (r + c) in anti:
                continue
            cols.add(c); diag.add(r - c); anti.add(r + c)
            count += place(r + 1)
            cols.discard(c); diag.discard(r - c); anti.discard(r + c)
        return count

    return place(0)`,
    explanation:
      "Why r-c and r+c: along a \"\\\\\" diagonal both r and c grow together so r-c is constant; " +
      "along a \"/\" anti-diagonal r grows while c shrinks so r+c is constant. " +
      "Speed-up follow-ups: bitmasks instead of sets, and mirror symmetry " +
      "(try only half the columns of row 0, double the count, handle the odd middle column).",
    tests: [
      { args: [1], expected: 1 },
      { args: [2], expected: 0 },
      { args: [3], expected: 0 },
      { args: [4], expected: 2 },
      { args: [5], expected: 10 },
      { args: [6], expected: 4 },
      { args: [8], expected: 92 },
    ],
  },

  // ============================================================
  // M6 — BINARY SEARCH MASTERY
  // ============================================================

  F16: {
    id: "F16",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Binary Search", "Rotated Array"],
    type: "python",
    statement:
      "Write <code>search_rotated(nums, target)</code> returning the index of " +
      "<code>target</code> in a sorted array that was rotated at an unknown pivot " +
      "(distinct values), or <code>-1</code>. Required: O(log n). " +
      "The key sentence: <em>one half is always sorted — find it, check if the target " +
      "is inside it, recurse the right way.</em>",
    examples:
      "Input:  nums=[4,5,6,7,0,1,2], target=0 -> 4\n" +
      "Input:  nums=[4,5,6,7,0,1,2], target=3 -> -1\n" +
      "Input:  nums=[1], target=0             -> -1\n" +
      "Input:  nums=[5,1,3], target=5         -> 0",
    hint: "Compare nums[mid] with nums[lo] to identify the sorted half; range-check the target against that half's endpoints.",
    functionName: "search_rotated",
    signature: "search_rotated(nums: list[int], target: int) -> int",
    starter:
      "def search_rotated(nums, target):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def search_rotated(nums: list, target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:              # left half sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                                  # right half sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
    explanation:
      "The <= in `nums[lo] <= nums[mid]` matters: with two elements, lo == mid and the left " +
      "'half' is the single element — it must count as sorted or the logic inverts. " +
      "Follow-up to expect: duplicates allowed (worst case degrades to O(n); when " +
      "nums[lo] == nums[mid] you can only do lo += 1).",
    tests: [
      { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { args: [[1], 0], expected: -1 },
      { args: [[1], 1], expected: 0 },
      { args: [[5, 1, 3], 5], expected: 0 },
      { args: [[3, 1], 1], expected: 1 },
      { args: [[1, 2, 3, 4, 5], 4], expected: 3 },
      { args: [[6, 7, 8, 1, 2, 3, 4, 5], 8], expected: 2 },
    ],
  },

  F17: {
    id: "F17",
    title: "First and Last Position of Target",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Binary Search", "Boundary Search"],
    type: "python",
    statement:
      "Write <code>search_range(nums, target)</code> returning <code>[first, last]</code> " +
      "indices of <code>target</code> in a sorted array with duplicates, or " +
      "<code>[-1, -1]</code>. Required: O(log n) — so no linear scan outward from a hit. " +
      "This is the bisect_left / bisect_right question in disguise.",
    examples:
      "Input:  nums=[5,7,7,8,8,10], target=8 -> [3,4]\n" +
      "Input:  nums=[5,7,7,8,8,10], target=6 -> [-1,-1]\n" +
      "Input:  nums=[], target=0             -> [-1,-1]\n" +
      "Input:  nums=[2,2,2,2], target=2      -> [0,3]",
    hint: "Two boundary searches: leftmost index with value >= target, and leftmost with value > target; the range is [left, right-1].",
    functionName: "search_range",
    signature: "search_range(nums: list[int], target: int) -> list[int]",
    starter:
      "def search_range(nums, target):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def search_range(nums: list, target: int) -> list:
    def lower_bound(x):            # first index with nums[i] >= x
        lo, hi = 0, len(nums)
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] < x:
                lo = mid + 1
            else:
                hi = mid
        return lo

    left = lower_bound(target)
    if left == len(nums) or nums[left] != target:
        return [-1, -1]
    right = lower_bound(target + 1) - 1
    return [left, right]`,
    explanation:
      "One boundary helper reused twice: bisect_left(target) and bisect_left(target+1)-1. " +
      "In real code, `from bisect import bisect_left, bisect_right` does it in two lines — " +
      "write the manual version in the interview, then mention the stdlib.",
    tests: [
      { args: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4] },
      { args: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1] },
      { args: [[], 0], expected: [-1, -1] },
      { args: [[1], 1], expected: [0, 0] },
      { args: [[2, 2, 2, 2], 2], expected: [0, 3] },
      { args: [[1, 3], 2], expected: [-1, -1] },
      { args: [[1, 2, 2, 3], 3], expected: [3, 3] },
      { args: [[1, 1, 2], 1], expected: [0, 1] },
    ],
  },

  F18: {
    id: "F18",
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    time: "18-25 min",
    tags: ["Binary Search on Answer", "Monotone Predicate"],
    type: "python",
    statement:
      "Koko has <code>piles</code> of bananas and <code>h</code> hours; each hour she eats up to " +
      "<code>k</code> bananas from one pile. Write <code>min_eating_speed(piles, h)</code> " +
      "returning the minimum integer speed <code>k</code> that finishes in time. " +
      "The archetype of <strong>binary search on the answer</strong>: define can(k), prove it " +
      "monotone, boundary-search the answer space.",
    examples:
      "Input:  piles=[3,6,7,11], h=8       -> 4\n" +
      "Input:  piles=[30,11,23,4,20], h=5  -> 30\n" +
      "Input:  piles=[30,11,23,4,20], h=6  -> 23",
    hint: "can(k) = sum(ceil(p / k)) <= h. If speed k works, k+1 works too -> boundary search on [1, max(piles)].",
    functionName: "min_eating_speed",
    signature: "min_eating_speed(piles: list[int], h: int) -> int",
    starter:
      "def min_eating_speed(piles, h):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def min_eating_speed(piles: list, h: int) -> int:
    def can(k):
        return sum((p + k - 1) // k for p in piles) <= h

    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if can(mid):
            hi = mid          # mid works; try smaller
        else:
            lo = mid + 1
    return lo`,
    explanation:
      "O(n log(max(piles))). `(p + k - 1) // k` is integer ceil-division — worth writing " +
      "without hesitation. The narration that scores: '1) check function, 2) it's monotone " +
      "because eating faster never hurts, 3) so boundary-search the answer space.'",
    tests: [
      { args: [[3, 6, 7, 11], 8], expected: 4 },
      { args: [[30, 11, 23, 4, 20], 5], expected: 30 },
      { args: [[30, 11, 23, 4, 20], 6], expected: 23 },
      { args: [[1], 1], expected: 1 },
      { args: [[312884470], 312884469], expected: 2 },
      { args: [[1000000000], 2], expected: 500000000 },
      { args: [[1, 1, 1, 1], 4], expected: 1 },
    ],
  },

  F19: {
    id: "F19",
    title: "Find Peak Element",
    difficulty: "Medium",
    time: "12-18 min",
    tags: ["Binary Search", "Unsorted"],
    type: "python",
    statement:
      "Write <code>find_peak_element(nums)</code> returning the index of a peak — an element " +
      "strictly greater than its neighbors (edges count as -infinity beyond them; adjacent " +
      "values are never equal). Required O(log n) — on an <em>unsorted</em> array, which is the " +
      "point: binary search needs a half-discarding rule, not sortedness. " +
      "(Any peak is acceptable; these tests use single-peak arrays.)",
    examples:
      "Input:  [1,2,3,1]    -> 2\n" +
      "Input:  [1,2,3,4,5]  -> 4   (rising to the edge)\n" +
      "Input:  [5,4,3,2,1]  -> 0\n" +
      "Input:  [1]          -> 0",
    hint: "If nums[mid] < nums[mid+1], the slope rises rightward, so a peak exists to the right; else one exists at mid or left.",
    functionName: "find_peak_element",
    signature: "find_peak_element(nums: list[int]) -> int",
    starter:
      "def find_peak_element(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def find_peak_element(nums: list) -> int:
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < nums[mid + 1]:
            lo = mid + 1      # rising -> a peak lies right of mid
        else:
            hi = mid          # falling -> mid could be the peak
    return lo`,
    explanation:
      "The invariant to say: 'walking uphill must eventually hit a peak, because the array " +
      "ends'. mid+1 is always in range since lo < hi guarantees mid < hi. Note the " +
      "boundary-search shape (lo < hi, hi = mid) — this is a boundary between " +
      "'rising' and 'falling' zones.",
    tests: [
      { args: [[1, 2, 3, 1]], expected: 2 },
      { args: [[1, 2, 3, 4, 5]], expected: 4 },
      { args: [[5, 4, 3, 2, 1]], expected: 0 },
      { args: [[1]], expected: 0 },
      { args: [[1, 3, 2]], expected: 1 },
      { args: [[2, 1]], expected: 0 },
      { args: [[1, 2]], expected: 1 },
    ],
  },

  F20: {
    id: "F20",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    time: "35-40 min",
    tags: ["Binary Search", "Partition", "Boss Fight"],
    type: "python",
    statement:
      "Write <code>find_median_sorted_arrays(a, b)</code> returning the median of two sorted " +
      "arrays in <strong>O(log(min(m,n)))</strong>. The famous hard one. Approach: binary-search " +
      "the <em>cut position</em> in the shorter array; derive the matching cut in the longer " +
      "one so the combined left side holds half the elements; verify the cross conditions " +
      "<code>maxLeftA &lt;= minRightB</code> and <code>maxLeftB &lt;= minRightA</code>.",
    examples:
      "Input:  a=[1,3], b=[2]      -> 2.0\n" +
      "Input:  a=[1,2], b=[3,4]    -> 2.5\n" +
      "Input:  a=[], b=[1]         -> 1.0\n" +
      "Input:  a=[0,0], b=[0,0]    -> 0.0",
    hint: "Ensure a is the shorter array. Sentinels +-inf for empty sides. If maxLeftA > minRightB the cut in a is too far right.",
    functionName: "find_median_sorted_arrays",
    signature: "find_median_sorted_arrays(a: list[int], b: list[int]) -> float",
    starter:
      "def find_median_sorted_arrays(a, b):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def find_median_sorted_arrays(a: list, b: list) -> float:
    if len(a) > len(b):
        a, b = b, a                       # binary search the shorter array
    m, n = len(a), len(b)
    total_left = (m + n + 1) // 2         # size of the combined left part

    lo, hi = 0, m                         # cut position in a: 0..m
    while lo <= hi:
        i = (lo + hi) // 2                # a contributes i elements to the left
        j = total_left - i                # b contributes the rest
        max_left_a  = a[i - 1] if i > 0 else float("-inf")
        min_right_a = a[i]     if i < m else float("inf")
        max_left_b  = b[j - 1] if j > 0 else float("-inf")
        min_right_b = b[j]     if j < n else float("inf")

        if max_left_a <= min_right_b and max_left_b <= min_right_a:
            if (m + n) % 2 == 1:
                return float(max(max_left_a, max_left_b))
            return (max(max_left_a, max_left_b) +
                    min(min_right_a, min_right_b)) / 2.0
        if max_left_a > min_right_b:
            hi = i - 1                    # a's cut too far right
        else:
            lo = i + 1                    # a's cut too far left
    raise ValueError("inputs not sorted")`,
    explanation:
      "The insight to narrate: a median is just a PARTITION of the combined data into equal " +
      "halves where everything left <= everything right. Two of the four cross comparisons " +
      "come free (arrays are sorted); only the two diagonal ones need checking. Sentinels " +
      "make empty sides painless. Even a clean spoken sketch of this earns real points.",
    tests: [
      { args: [[1, 3], [2]], expected: 2.0 },
      { args: [[1, 2], [3, 4]], expected: 2.5 },
      { args: [[], [1]], expected: 1.0 },
      { args: [[2], []], expected: 2.0 },
      { args: [[0, 0], [0, 0]], expected: 0.0 },
      { args: [[1, 3], [2, 7]], expected: 2.5 },
      { args: [[1, 2, 3, 4, 5], [6, 7, 8]], expected: 4.5 },
      { args: [[5], [1, 2, 3]], expected: 2.5 },
    ],
  },

  // ============================================================
  // M7 — TREES DEEP DIVE
  // ============================================================

  F21: {
    id: "F21",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Tree", "BST", "Top-Down Recursion"],
    type: "python",
    statement:
      "Write <code>is_valid_bst(root)</code> — is the binary tree a valid BST? " +
      "(Left subtree strictly less, right subtree strictly greater, recursively; " +
      "duplicates invalid.) The trap is checking only parent-child pairs — the constraint " +
      "is global, so pass an allowed <code>(lo, hi)</code> range down. " +
      "Trees are given as level-order arrays and built for you via <code>_build_tree</code>; " +
      "your function receives the root <code>TreeNode</code> (fields: val, left, right).",
    examples:
      "Input:  [2,1,3]                -> True\n" +
      "Input:  [5,1,4,null,null,3,6]  -> False  (3 and 4 in the right subtree of 5... 3 < 5)\n" +
      "Input:  [5,4,6,null,null,3,7]  -> False  (the classic: 3 under 5's right side)\n" +
      "Input:  [1,1]                  -> False  (duplicates)",
    hint: "check(node, lo, hi): value must sit strictly inside (lo, hi); recurse left with hi=node.val, right with lo=node.val.",
    functionName: "is_valid_bst",
    signature: "is_valid_bst(root: TreeNode | None) -> bool",
    starter:
      "def is_valid_bst(root):\n" +
      "    # root is a TreeNode (or None); fields: val, left, right\n" +
      "    pass\n",
    solution:
`def is_valid_bst(root) -> bool:
    def check(node, lo, hi):
        if node is None:
            return True
        if not (lo < node.val < hi):
            return False
        return (check(node.left,  lo, node.val) and
                check(node.right, node.val, hi))
    return check(root, float("-inf"), float("inf"))`,
    explanation:
      "O(n) time, O(h) stack. Alternative to name: in-order traversal of a BST is strictly " +
      "increasing — track the previous value and compare. Both are accepted; the range " +
      "version generalizes better (e.g. to 'count nodes in range').",
    tests: [
      { args: [[2, 1, 3]], expected: true,
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[5, 1, 4, null, null, 3, 6]], expected: false,
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[5, 4, 6, null, null, 3, 7]], expected: false,
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[1, 1]], expected: false,
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[]], expected: true,
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[1]], expected: true,
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[3, 1, 5, 0, 2, 4, 6]], expected: true,
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[10, 5, 15, null, null, 6, 20]], expected: false,
        prepare: "args = [_build_tree(args[0])]" },
    ],
  },

  F22: {
    id: "F22",
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "Medium",
    time: "18-25 min",
    tags: ["Tree", "Recursion", "LCA"],
    type: "python",
    statement:
      "Write <code>lowest_common_ancestor(root, p, q)</code> returning the deepest node that " +
      "has both <code>p</code> and <code>q</code> in its subtree (a node counts as its own " +
      "ancestor). <code>p</code> and <code>q</code> are actual TreeNode references, both " +
      "guaranteed present. Return the TreeNode; the tests compare its value. " +
      "The one-liner insight: <em>the LCA is where p and q first split into different sides.</em>",
    examples:
      "Tree:   [3,5,1,6,2,0,8,null,null,7,4]\n" +
      "p=5, q=1 -> 3\n" +
      "p=5, q=4 -> 5   (a node is its own ancestor)\n" +
      "p=6, q=4 -> 5",
    hint: "Base: None/p/q returns itself. Recurse both sides: both non-None -> current node is the answer; else propagate the non-None side.",
    functionName: "lowest_common_ancestor",
    signature: "lowest_common_ancestor(root, p, q) -> TreeNode",
    starter:
      "def lowest_common_ancestor(root, p, q):\n" +
      "    # p and q are TreeNode references inside root's tree\n" +
      "    pass\n",
    solution:
`def lowest_common_ancestor(root, p, q):
    if root is None or root is p or root is q:
        return root
    left  = lowest_common_ancestor(root.left,  p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root           # p and q split here
    return left or right      # both on one side (or neither found)`,
    explanation:
      "Each call answers: 'what did this subtree find?' — p, q, their LCA, or nothing. " +
      "If both children report a find, they split at the current node. O(n) time, O(h) stack. " +
      "BST follow-up: walk from the root, first value between p and q is the LCA — O(h), " +
      "no recursion needed.",
    tests: [
      { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1], expected: 3,
        prepare: "t = _build_tree(args[0]); args = [t, _find_node(t, args[1]), _find_node(t, args[2])]",
        transform: "result = result.val" },
      { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4], expected: 5,
        prepare: "t = _build_tree(args[0]); args = [t, _find_node(t, args[1]), _find_node(t, args[2])]",
        transform: "result = result.val" },
      { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 6, 4], expected: 5,
        prepare: "t = _build_tree(args[0]); args = [t, _find_node(t, args[1]), _find_node(t, args[2])]",
        transform: "result = result.val" },
      { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 0, 8], expected: 1,
        prepare: "t = _build_tree(args[0]); args = [t, _find_node(t, args[1]), _find_node(t, args[2])]",
        transform: "result = result.val" },
      { args: [[1, 2], 1, 2], expected: 1,
        prepare: "t = _build_tree(args[0]); args = [t, _find_node(t, args[1]), _find_node(t, args[2])]",
        transform: "result = result.val" },
      { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 7, 4], expected: 2,
        prepare: "t = _build_tree(args[0]); args = [t, _find_node(t, args[1]), _find_node(t, args[2])]",
        transform: "result = result.val" },
    ],
  },

  F23: {
    id: "F23",
    title: "Binary Tree Right Side View",
    difficulty: "Medium",
    time: "12-18 min",
    tags: ["Tree", "BFS", "Level Order"],
    type: "python",
    statement:
      "Write <code>right_side_view(root)</code> returning the values visible from the right — " +
      "i.e. the <em>last node of each level</em>, top to bottom. One costume of the level-order " +
      "template: freeze the level size with <code>len(queue)</code>, keep the last element of " +
      "each level.",
    examples:
      "Input:  [1,2,3,null,5,null,4] -> [1,3,4]\n" +
      "Input:  [1,null,3]            -> [1,3]\n" +
      "Input:  [1,2,3,4]             -> [1,3,4]  (4 peeks out from the left side)\n" +
      "Input:  []                    -> []",
    hint: "BFS; for each level of size n, the node at i == n-1 is visible.",
    functionName: "right_side_view",
    signature: "right_side_view(root: TreeNode | None) -> list[int]",
    starter:
      "def right_side_view(root):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import deque

def right_side_view(root) -> list:
    if root is None:
        return []
    out = []
    q = deque([root])
    while q:
        n = len(q)                     # freeze the level
        for i in range(n):
            node = q.popleft()
            if i == n - 1:
                out.append(node.val)   # last of the level
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return out`,
    explanation:
      "The [1,2,3,4] case is why 'always take the right child' fails: level 2 only has node 4, " +
      "which hangs off the LEFT subtree. Right-side view = per-level last, not right-spine. " +
      "DFS alternative: visit right-first, record the first node seen at each new depth.",
    tests: [
      { args: [[1, 2, 3, null, 5, null, 4]], expected: [1, 3, 4],
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[1, null, 3]], expected: [1, 3],
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[1, 2, 3, 4]], expected: [1, 3, 4],
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[]], expected: [],
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[1]], expected: [1],
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [1, 3, 7],
        prepare: "args = [_build_tree(args[0])]" },
    ],
  },

  F24: {
    id: "F24",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    time: "25-35 min",
    tags: ["Tree", "Design", "Preorder"],
    type: "python",
    statement:
      "Implement <strong>two</strong> functions: <code>serialize(root)</code> turning a tree " +
      "into a string, and <code>deserialize(data)</code> turning that string back into the " +
      "identical tree. Any format you like — the tests round-trip your own pair " +
      "(<code>deserialize(serialize(tree))</code>) and compare the resulting structure. " +
      "The clean interview answer: preorder with a null sentinel. " +
      "<code>TreeNode</code> is available in the sandbox.",
    examples:
      "Input tree:  [1,2,3,null,null,4,5]\n" +
      "Round trip must reproduce the same structure.\n" +
      'One valid format: "1,2,#,#,3,4,#,#,5,#,#"',
    hint: "serialize: preorder DFS appending '#' for None. deserialize: iterator over tokens; consume one token, recurse left then right.",
    functionName: "serialize",
    signature: "serialize(root) -> str   /   deserialize(data) -> TreeNode",
    starter:
      "def serialize(root):\n" +
      "    # tree -> string\n" +
      "    pass\n" +
      "\n" +
      "def deserialize(data):\n" +
      "    # string -> tree (use TreeNode(val))\n" +
      "    pass\n",
    solution:
`def serialize(root) -> str:
    parts = []
    def dfs(node):
        if node is None:
            parts.append("#")
            return
        parts.append(str(node.val))
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return ",".join(parts)

def deserialize(data):
    vals = iter(data.split(","))
    def build():
        v = next(vals)
        if v == "#":
            return None
        node = TreeNode(int(v))
        node.left = build()
        node.right = build()
        return node
    return build()`,
    explanation:
      "Preorder + sentinels uniquely determines the tree, and deserialization is one forward " +
      "pass with an iterator — no index bookkeeping. Discussion points that score: delimiter " +
      "collisions with real data (escape or length-prefix), level-order as an alternative, " +
      "and the BST special case where preorder alone suffices (ranges reconstruct shape).",
    tests: [
      { args: [[1, 2, 3, null, null, 4, 5]], expected: [1, 2, 3, null, null, 4, 5],
        skipCall: true,
        prepare: "t = _build_tree(args[0]); result = _tree_to_level(deserialize(serialize(t)))" },
      { args: [[]], expected: [],
        skipCall: true,
        prepare: "t = _build_tree(args[0]); result = _tree_to_level(deserialize(serialize(t)))" },
      { args: [[1]], expected: [1],
        skipCall: true,
        prepare: "t = _build_tree(args[0]); result = _tree_to_level(deserialize(serialize(t)))" },
      { args: [[1, 2]], expected: [1, 2],
        skipCall: true,
        prepare: "t = _build_tree(args[0]); result = _tree_to_level(deserialize(serialize(t)))" },
      { args: [[1, null, 2, null, 3]], expected: [1, null, 2, null, 3],
        skipCall: true,
        prepare: "t = _build_tree(args[0]); result = _tree_to_level(deserialize(serialize(t)))" },
      { args: [[5, 3, 8, 1, 4, 7, 9]], expected: [5, 3, 8, 1, 4, 7, 9],
        skipCall: true,
        prepare: "t = _build_tree(args[0]); result = _tree_to_level(deserialize(serialize(t)))" },
      { args: [[-1, 0, -2]], expected: [-1, 0, -2],
        skipCall: true,
        prepare: "t = _build_tree(args[0]); result = _tree_to_level(deserialize(serialize(t)))" },
    ],
  },

  F25: {
    id: "F25",
    title: "Diameter of Binary Tree",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Tree", "Bottom-Up Recursion"],
    type: "python",
    statement:
      "Write <code>diameter_of_binary_tree(root)</code> returning the number of <em>edges</em> " +
      "on the longest path between any two nodes (the path need not pass through the root). " +
      "The pattern being tested: the recursion <strong>returns height</strong> while the " +
      "<strong>answer is tracked separately</strong> — forcing the answer through the return " +
      "value doesn't work because a bent path can't be extended by the parent.",
    examples:
      "Input:  [1,2,3,4,5] -> 3   (path 4-2-1-3: three edges)\n" +
      "Input:  [1]         -> 0\n" +
      "Input:  [1,2]       -> 1\n" +
      "Input:  []          -> 0",
    hint: "height(node) returns 1 + max(child heights); at every node, candidate answer = left_height + right_height.",
    functionName: "diameter_of_binary_tree",
    signature: "diameter_of_binary_tree(root: TreeNode | None) -> int",
    starter:
      "def diameter_of_binary_tree(root):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def diameter_of_binary_tree(root) -> int:
    best = 0
    def height(node):
        nonlocal best
        if node is None:
            return 0
        lh = height(node.left)
        rh = height(node.right)
        best = max(best, lh + rh)     # bent path through this node
        return 1 + max(lh, rh)        # straight chain for the parent
    height(root)
    return best`,
    explanation:
      "O(n), single pass. The 'return one thing, track another' pattern also solves Binary " +
      "Tree Maximum Path Sum (return best downward sum, track best bent sum) and Longest " +
      "Univalue Path — name the family when you finish.",
    tests: [
      { args: [[1, 2, 3, 4, 5]], expected: 3,
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[1]], expected: 0,
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[1, 2]], expected: 1,
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[]], expected: 0,
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[1, 2, null, 3, null, 4]], expected: 3,
        prepare: "args = [_build_tree(args[0])]" },
      { args: [[1, 2, 3, 4, 5, null, null, 6, null, null, 7]], expected: 4,
        prepare: "args = [_build_tree(args[0])]" },
    ],
  },

  // ============================================================
  // M8 — GRAPHS DEEP DIVE
  // ============================================================

  F26: {
    id: "F26",
    title: "Course Schedule",
    difficulty: "Medium",
    time: "18-25 min",
    tags: ["Graph", "Topological Sort", "Cycle Detection"],
    type: "python",
    statement:
      "Write <code>can_finish(num_courses, prerequisites)</code> — given pairs " +
      "<code>[course, prerequisite]</code>, can all courses be completed? " +
      "This is topological sort in disguise: a valid order exists iff the dependency graph " +
      "is acyclic, and Kahn's peeling count doubles as the cycle detector.",
    examples:
      "Input:  2, [[1,0]]        -> True   (take 0 then 1)\n" +
      "Input:  2, [[1,0],[0,1]]  -> False  (mutual dependency)\n" +
      "Input:  1, []             -> True",
    hint: "Kahn's: indegree array + queue of zero-indegree nodes; count processed nodes; done == n means no cycle.",
    functionName: "can_finish",
    signature: "can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool",
    starter:
      "def can_finish(num_courses, prerequisites):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import deque

def can_finish(num_courses: int, prerequisites: list) -> bool:
    graph = [[] for _ in range(num_courses)]
    indegree = [0] * num_courses
    for course, pre in prerequisites:
        graph[pre].append(course)
        indegree[course] += 1

    q = deque(i for i in range(num_courses) if indegree[i] == 0)
    done = 0
    while q:
        node = q.popleft()
        done += 1
        for nxt in graph[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                q.append(nxt)
    return done == num_courses`,
    explanation:
      "O(V+E). Nodes trapped in a cycle never reach indegree 0, so done < n exactly when a " +
      "cycle exists. Follow-up to expect: 'return the actual order' (Course Schedule II — " +
      "collect popped nodes) and 'the other way' (DFS with white/gray/black coloring; " +
      "a gray->gray edge is a back edge = cycle).",
    tests: [
      { args: [2, [[1, 0]]], expected: true },
      { args: [2, [[1, 0], [0, 1]]], expected: false },
      { args: [1, []], expected: true },
      { args: [5, [[1, 4], [2, 4], [3, 1], [3, 2]]], expected: true },
      { args: [3, [[0, 1], [1, 2], [2, 0]]], expected: false },
      { args: [4, [[1, 0], [2, 1], [3, 2]]], expected: true },
      { args: [4, [[1, 0], [2, 1], [3, 2], [1, 3]]], expected: false },
    ],
  },

  F27: {
    id: "F27",
    title: "Number of Connected Components",
    difficulty: "Medium",
    time: "12-18 min",
    tags: ["Graph", "Union-Find"],
    type: "python",
    statement:
      "Write <code>count_components(n, edges)</code> — how many connected components does the " +
      "undirected graph with nodes <code>0..n-1</code> have? " +
      "The clean Union-Find application: start at <code>n</code> components, subtract one per " +
      "<em>successful</em> union. (BFS/DFS over an adjacency list is equally valid — pick one " +
      "and say why.)",
    examples:
      "Input:  n=5, edges=[[0,1],[1,2],[3,4]] -> 2\n" +
      "Input:  n=5, edges=[[0,1],[1,2],[2,3],[3,4]] -> 1\n" +
      "Input:  n=4, edges=[] -> 4",
    hint: "find with path compression; union returns False when already connected; components = n - successful_unions.",
    functionName: "count_components",
    signature: "count_components(n: int, edges: list[list[int]]) -> int",
    starter:
      "def count_components(n, edges):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def count_components(n: int, edges: list) -> int:
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]    # path halving
            x = parent[x]
        return x

    components = n
    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb
            components -= 1
    return components`,
    explanation:
      "Near O(1) amortized per operation with compression. The counting idea — start at n, " +
      "decrement per merge — also answers 'is this a valid tree?' (exactly n-1 edges AND " +
      "1 component) and 'when does everyone become connected?' (the union that hits 1).",
    tests: [
      { args: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2 },
      { args: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: 1 },
      { args: [4, []], expected: 4 },
      { args: [1, []], expected: 1 },
      { args: [6, [[0, 1], [2, 3], [4, 5]]], expected: 3 },
      { args: [3, [[0, 1], [0, 1], [1, 0]]], expected: 2 },
    ],
  },

  F28: {
    id: "F28",
    title: "Word Ladder",
    difficulty: "Hard",
    time: "25-35 min",
    tags: ["Graph", "BFS", "Implicit Graph"],
    type: "python",
    statement:
      "Write <code>ladder_length(begin_word, end_word, word_list)</code> returning the length " +
      "(number of words, inclusive) of the shortest transformation sequence from begin to end, " +
      "changing one letter at a time with every intermediate word in <code>word_list</code> — " +
      "or 0 if impossible. The modeling sentence that earns the points: <em>words are nodes, " +
      "one-letter differences are edges, shortest path in an unweighted graph means BFS.</em>",
    examples:
      'Input:  "hit" -> "cog", ["hot","dot","dog","lot","log","cog"] -> 5\n' +
      '        (hit -> hot -> dot -> dog -> cog)\n' +
      'Input:  "hit" -> "cog", ["hot","dot","dog","lot","log"] -> 0  (cog not in list)\n' +
      'Input:  "a" -> "c", ["a","b","c"] -> 2',
    hint: "BFS from begin_word; neighbors = for each position, try all 26 letters, keep words still in the (shrinking) word set.",
    functionName: "ladder_length",
    signature: "ladder_length(begin_word: str, end_word: str, word_list: list[str]) -> int",
    starter:
      "def ladder_length(begin_word, end_word, word_list):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import deque
import string

def ladder_length(begin_word: str, end_word: str, word_list: list) -> int:
    words = set(word_list)
    if end_word not in words:
        return 0
    q = deque([(begin_word, 1)])
    words.discard(begin_word)
    while q:
        word, steps = q.popleft()
        if word == end_word:
            return steps
        for i in range(len(word)):
            for ch in string.ascii_lowercase:
                nxt = word[:i] + ch + word[i + 1:]
                if nxt in words:
                    words.discard(nxt)      # mark visited by removing
                    q.append((nxt, steps + 1))
    return 0`,
    explanation:
      "Removing a word from the set the moment it's queued is the visited-set — removing at " +
      "pop time re-queues nodes exponentially. Neighbor generation is O(26 * L) per word " +
      "instead of O(N * L) all-pairs. Upgrades to name if asked: wildcard buckets " +
      "(precompute 'h*t' -> [hot, hat, ...]) and bidirectional BFS.",
    tests: [
      { args: ["hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]], expected: 5 },
      { args: ["hit", "cog", ["hot", "dot", "dog", "lot", "log"]], expected: 0 },
      { args: ["a", "c", ["a", "b", "c"]], expected: 2 },
      { args: ["hot", "dog", ["hot", "dog"]], expected: 0 },
      { args: ["hot", "dot", ["dot"]], expected: 2 },
      { args: ["same", "same", ["same"]], expected: 1 },
      { args: ["ab", "cd", ["ad", "cd"]], expected: 3 },
    ],
  },

  F29: {
    id: "F29",
    title: "Network Delay Time (Dijkstra)",
    difficulty: "Medium-Hard",
    time: "25-30 min",
    tags: ["Graph", "Dijkstra", "Heap"],
    type: "python",
    statement:
      "Signals start at node <code>k</code> and travel directed weighted edges " +
      "<code>times = [[u, v, w], ...]</code> (nodes numbered 1..n). Write " +
      "<code>network_delay_time(times, n, k)</code> returning the time for ALL nodes to " +
      "receive the signal, or -1 if some never do. Textbook Dijkstra — the details being " +
      "graded: the lazy-deletion guard, and knowing why non-negative weights are required.",
    examples:
      "Input:  times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2 -> 2\n" +
      "Input:  times=[[1,2,1]], n=2, k=1 -> 1\n" +
      "Input:  times=[[1,2,1]], n=2, k=2 -> -1  (node 1 unreachable)",
    hint: "Min-heap of (dist, node); pop, skip if already finalized, relax neighbors. Answer = max finalized dist if all n reached.",
    functionName: "network_delay_time",
    signature: "network_delay_time(times: list[list[int]], n: int, k: int) -> int",
    starter:
      "def network_delay_time(times, n, k):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`import heapq

def network_delay_time(times: list, n: int, k: int) -> int:
    graph = [[] for _ in range(n + 1)]
    for u, v, w in times:
        graph[u].append((v, w))

    dist = {}
    heap = [(0, k)]
    while heap:
        d, node = heapq.heappop(heap)
        if node in dist:
            continue                  # stale entry (lazy deletion)
        dist[node] = d
        for nxt, w in graph[node]:
            if nxt not in dist:
                heapq.heappush(heap, (d + w, nxt))
    return max(dist.values()) if len(dist) == n else -1`,
    explanation:
      "O(E log E). We push duplicates instead of decrease-key; the `if node in dist` guard " +
      "discards stale ones — say 'lazy deletion' out loud. Non-negative weights are what let " +
      "the pop commit permanently; with negatives you'd switch to Bellman-Ford (O(VE)). " +
      "JS note: JavaScript has no built-in heap, so the JS reference substitutes an O(V²) " +
      "min-scan — fine at these sizes; in a live interview say you'd bring the Module 11 MinHeap.",
    tests: [
      { args: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], expected: 2 },
      { args: [[[1, 2, 1]], 2, 1], expected: 1 },
      { args: [[[1, 2, 1]], 2, 2], expected: -1 },
      { args: [[[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1], expected: 3 },
      { args: [[[1, 2, 1], [2, 1, 3]], 2, 2], expected: 3 },
      { args: [[], 1, 1], expected: 0 },
      { args: [[[1, 2, 1], [2, 3, 7], [1, 3, 4], [3, 4, 1]], 4, 1], expected: 5 },
    ],
  },

  F30: {
    id: "F30",
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium-Hard",
    time: "25-30 min",
    tags: ["Graph", "Grid", "Reverse BFS"],
    type: "python",
    statement:
      "Water on a height grid flows to a neighbor of <strong>equal or lower</strong> height. " +
      "The Pacific touches the top and left edges; the Atlantic the bottom and right. Write " +
      "<code>pacific_atlantic(heights)</code> returning all cells <code>[r, c]</code> from " +
      "which water can reach BOTH oceans. The trick: don't simulate from every cell — " +
      "<strong>start at the oceans and climb uphill</strong>, then intersect the two " +
      "reachable sets.",
    examples:
      "Input:  [[1,2,2,3,5],\n" +
      "         [3,2,3,4,4],\n" +
      "         [2,4,5,3,1],\n" +
      "         [6,7,1,4,5],\n" +
      "         [5,1,1,2,4]]\n" +
      "Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]  (any order)",
    hint: "Reverse the flow: BFS/DFS from each ocean's border cells, moving to neighbors with height >= current. Answer = intersection.",
    functionName: "pacific_atlantic",
    signature: "pacific_atlantic(heights: list[list[int]]) -> list[list[int]]",
    starter:
      "def pacific_atlantic(heights):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def pacific_atlantic(heights: list) -> list:
    if not heights or not heights[0]:
        return []
    R, C = len(heights), len(heights[0])

    def climb(starts):
        seen = set(starts)
        stack = list(starts)
        while stack:
            r, c = stack.pop()
            for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0)):
                nr, nc = r + dr, c + dc
                if (0 <= nr < R and 0 <= nc < C and (nr, nc) not in seen
                        and heights[nr][nc] >= heights[r][c]):   # uphill or flat
                    seen.add((nr, nc))
                    stack.append((nr, nc))
        return seen

    pacific  = climb([(0, c) for c in range(C)] + [(r, 0) for r in range(R)])
    atlantic = climb([(R - 1, c) for c in range(C)] + [(r, C - 1) for r in range(R)])
    return [[r, c] for r, c in sorted(pacific & atlantic)]`,
    explanation:
      "Two sweeps, O(mn) each, versus O((mn)^2) for forward simulation from every cell. " +
      "The >= (not >) preserves equal-height flow when the edge is reversed — dropping it " +
      "fails on plateau maps. This 'start from the destination' reversal generalizes to " +
      "any 'which nodes can reach X' question.",
    tests: [
      {
        args: [[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]],
        expected: ["0,4", "1,3", "1,4", "2,2", "3,0", "3,1", "4,0"],
        transform: 'result = sorted(f"{r},{c}" for r, c in result)',
      },
      {
        args: [[[1]]],
        expected: ["0,0"],
        transform: 'result = sorted(f"{r},{c}" for r, c in result)',
      },
      {
        args: [[[1, 1], [1, 1]]],
        expected: ["0,0", "0,1", "1,0", "1,1"],
        transform: 'result = sorted(f"{r},{c}" for r, c in result)',
      },
      {
        args: [[[10, 10, 10], [10, 1, 10], [10, 10, 10]]],
        expected: ["0,0", "0,1", "0,2", "1,0", "1,2", "2,0", "2,1", "2,2"],
        transform: 'result = sorted(f"{r},{c}" for r, c in result)',
      },
      {
        args: [[[3, 2, 1]]],
        expected: ["0,0", "0,1", "0,2"],
        transform: 'result = sorted(f"{r},{c}" for r, c in result)',
      },
    ],
  },

  F31: {
    id: "F31",
    title: "House Robber",
    difficulty: "Medium",
    time: "10-15 min",
    tags: ["DP", "1D", "Take/Skip"],
    type: "python",
    statement:
      "Write <code>rob(nums)</code> returning the maximum sum of non-adjacent elements " +
      "(you can't rob two neighboring houses). The canonical 1D take/skip DP — " +
      "and the canonical warm-up an interviewer uses before a harder DP. " +
      "Aim for O(n) time, O(1) space.",
    examples:
      "Input:  [1,2,3,1]     -> 4   (rob 1 + 3)\n" +
      "Input:  [2,7,9,3,1]   -> 12  (rob 2 + 9 + 1)\n" +
      "Input:  [2,1,1,2]     -> 4   (rob the two 2s — greedy 'every other house' fails!)\n" +
      "Input:  [5]           -> 5",
    hint: "Two rolling variables: best total if the previous house was robbed vs not. One tuple assignment per house.",
    functionName: "rob",
    signature: "rob(nums: list[int]) -> int",
    starter:
      "def rob(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def rob(nums: list) -> int:
    take, skip = 0, 0        # best ending with / without robbing previous house
    for x in nums:
        take, skip = skip + x, max(take, skip)
    return max(take, skip)`,
    explanation:
      "dp[i] depends only on dp[i-1] and dp[i-2], so the table collapses to two variables. " +
      "The tuple assignment evaluates the whole right side first — split it into two statements " +
      "and the second sees the new `take`, silently corrupting the answer. Test [2,1,1,2] kills " +
      "the tempting 'compare odd-indexed vs even-indexed sums' shortcut: the optimum skips two in a row.",
    tests: [
      { args: [[1, 2, 3, 1]], expected: 4 },
      { args: [[2, 7, 9, 3, 1]], expected: 12 },
      { args: [[2, 1, 1, 2]], expected: 4 },
      { args: [[5]], expected: 5 },
      { args: [[]], expected: 0 },
      { args: [[100, 1, 1, 100, 1, 1, 100]], expected: 300 },
    ],
  },

  F32: {
    id: "F32",
    title: "Coin Change (Fewest Coins)",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["DP", "Unbounded Knapsack"],
    type: "python",
    statement:
      "Write <code>coin_change(coins, amount)</code> returning the minimum number of coins " +
      "(unlimited supply of each) that sum to <code>amount</code>, or <code>-1</code> if " +
      "impossible. The archetypal unbounded-choice DP. Greedy fails on non-canonical coin " +
      "systems — know the counterexample: coins [1,3,4], amount 6.",
    examples:
      "Input:  coins=[1,2,5], amount=11 -> 3   (5+5+1)\n" +
      "Input:  coins=[2],     amount=3  -> -1\n" +
      "Input:  coins=[1],     amount=0  -> 0\n" +
      "Input:  coins=[1,3,4], amount=6  -> 2   (3+3; greedy 4+1+1 gives 3)",
    hint: "dp[a] = min coins for amount a. dp[0]=0, everything else 'infinity'; for each amount try every coin.",
    functionName: "coin_change",
    signature: "coin_change(coins: list[int], amount: int) -> int",
    starter:
      "def coin_change(coins, amount):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def coin_change(coins: list, amount: int) -> int:
    INF = amount + 1                       # safe impossible marker
    dp = [0] + [INF] * amount              # dp[a] = min coins for amount a
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return dp[amount] if dp[amount] <= amount else -1`,
    explanation:
      "O(amount x len(coins)). Using amount+1 as infinity avoids float('inf') and doubles as the " +
      "impossibility check (any real answer uses at most `amount` coins of value >= 1). " +
      "Follow-up you should expect: 'how many WAYS to make the amount?' — then loop order matters " +
      "(coins outer = combinations, amount outer = permutations; see Module 9).",
    tests: [
      { args: [[1, 2, 5], 11], expected: 3 },
      { args: [[2], 3], expected: -1 },
      { args: [[1], 0], expected: 0 },
      { args: [[1, 3, 4], 6], expected: 2 },
      { args: [[186, 419, 83, 408], 6249], expected: 20 },
      { args: [[2, 5, 10, 1], 27], expected: 4 },
    ],
  },

  F33: {
    id: "F33",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    time: "20-25 min",
    tags: ["DP", "Binary Search", "Patience Sorting"],
    type: "python",
    statement:
      "Write <code>length_of_lis(nums)</code> returning the length of the longest strictly " +
      "increasing subsequence (elements keep their order but need not be adjacent). " +
      "State the O(n²) DP first, then deliver the O(n log n) tails/patience solution — " +
      "this two-step presentation is exactly what interviewers want to see.",
    examples:
      "Input:  [10,9,2,5,3,7,101,18] -> 4   (2,3,7,101 or 2,3,7,18)\n" +
      "Input:  [0,1,0,3,2,3]         -> 4   (0,1,2,3)\n" +
      "Input:  [7,7,7,7]             -> 1   (strictly increasing!)",
    hint: "tails[k] = smallest possible tail of an increasing subsequence of length k+1. Each element either extends tails or improves (lowers) one entry — found by bisect_left.",
    functionName: "length_of_lis",
    signature: "length_of_lis(nums: list[int]) -> int",
    starter:
      "def length_of_lis(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`import bisect

def length_of_lis(nums: list) -> int:
    tails = []   # tails[k] = smallest tail of an increasing subseq of length k+1
    for x in nums:
        i = bisect.bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)`,
    explanation:
      "tails stays sorted, so bisect applies. Replacing tails[i] with a smaller value never hurts: " +
      "it keeps all existing lengths achievable while making future extensions easier. " +
      "Crucial caveat to volunteer: tails is NOT an actual subsequence — only its length is valid. " +
      "bisect_left gives strict increase; bisect_right would allow duplicates (non-decreasing variant).",
    tests: [
      { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
      { args: [[0, 1, 0, 3, 2, 3]], expected: 4 },
      { args: [[7, 7, 7, 7]], expected: 1 },
      { args: [[4, 10, 4, 3, 8, 9]], expected: 3 },
      { args: [[]], expected: 0 },
      { args: [[1, 2, 3, 4, 5]], expected: 5 },
      { args: [[5, 4, 3, 2, 1]], expected: 1 },
    ],
  },

  F34: {
    id: "F34",
    title: "Word Break",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["DP", "Cut Points", "Strings"],
    type: "python",
    statement:
      "Write <code>word_break(s, word_dict)</code> returning whether <code>s</code> can be " +
      "segmented into a sequence of dictionary words (words may repeat). " +
      "The archetype of DP over cut points: the answer for a prefix depends on answers for " +
      "shorter prefixes plus a dictionary check on the gap.",
    examples:
      'Input:  s="leetcode", dict=["leet","code"]                    -> true\n' +
      'Input:  s="applepenapple", dict=["apple","pen"]               -> true\n' +
      'Input:  s="catsandog", dict=["cats","dog","sand","and","cat"] -> false',
    hint: "dp[i] = 'is s[:i] breakable?'. dp[0] = True. dp[i] is True if some j < i has dp[j] and s[j:i] in the word set. Bound j by the longest word for a free speed-up.",
    functionName: "word_break",
    signature: "word_break(s: str, word_dict: list[str]) -> bool",
    starter:
      "def word_break(s, word_dict):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def word_break(s: str, word_dict: list) -> bool:
    words = set(word_dict)
    max_len = max(map(len, words), default=0)
    dp = [True] + [False] * len(s)         # dp[i]: s[:i] is breakable
    for i in range(1, len(s) + 1):
        for j in range(max(0, i - max_len), i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]`,
    explanation:
      "Convert the list to a set FIRST — 'in list' inside the double loop silently turns " +
      "O(n² · w) into O(n² · w · dict_size). Bounding j to the longest word length is a one-line " +
      "optimization worth narrating. The classic follow-up, Word Break II ('return all sentences'), " +
      "switches to backtracking with this DP as a feasibility prune.",
    tests: [
      { args: ["leetcode", ["leet", "code"]], expected: true },
      { args: ["applepenapple", ["apple", "pen"]], expected: true },
      { args: ["catsandog", ["cats", "dog", "sand", "and", "cat"]], expected: false },
      { args: ["aaaaaaa", ["aaaa", "aaa"]], expected: true },
      { args: ["", ["a"]], expected: true },
      { args: ["ab", ["a", "b", "ab"]], expected: true },
    ],
  },

  F35: {
    id: "F35",
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    time: "20-25 min",
    tags: ["DP", "2D", "Two Sequences"],
    type: "python",
    statement:
      "Write <code>longest_common_subsequence(text1, text2)</code> returning the length of " +
      "the longest subsequence present in both strings (order preserved, gaps allowed). " +
      "This is the archetype 2D DP — master its grid and Edit Distance, Distinct Subsequences " +
      "and Interleaving String all become variations on one skeleton.",
    examples:
      'Input:  "abcde", "ace" -> 3   ("ace")\n' +
      'Input:  "abc",   "abc" -> 3\n' +
      'Input:  "abc",   "def" -> 0',
    hint: "dp[i][j] = LCS of text1[i:] and text2[j:]. Match -> 1 + diagonal; no match -> max of skipping one char from either string.",
    functionName: "longest_common_subsequence",
    signature: "longest_common_subsequence(text1: str, text2: str) -> int",
    starter:
      "def longest_common_subsequence(text1, text2):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def longest_common_subsequence(t1: str, t2: str) -> int:
    m, n = len(t1), len(t2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]   # dp[i][j]: LCS of t1[i:], t2[j:]
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            if t1[i] == t2[j]:
                dp[i][j] = 1 + dp[i + 1][j + 1]
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j + 1])
    return dp[0][0]`,
    explanation:
      "O(mn) time and space; the extra row/column of zeros IS the base case (empty suffix -> LCS 0), " +
      "which is why the loops never index out of bounds. Space optimization to offer verbally: only " +
      "the next row is read, so two rows suffice — O(min(m,n)) space. " +
      "Beware building the grid with [[0]*(n+1)]*(m+1): that aliases one row m+1 times (Module 4 trap).",
    tests: [
      { args: ["abcde", "ace"], expected: 3 },
      { args: ["abc", "abc"], expected: 3 },
      { args: ["abc", "def"], expected: 0 },
      { args: ["bsbininm", "jmjkbkjkv"], expected: 1 },
      { args: ["abcba", "abcbcba"], expected: 5 },
      { args: ["", "abc"], expected: 0 },
    ],
  },

  F36: {
    id: "F36",
    title: "Edit Distance",
    difficulty: "Hard",
    time: "25-30 min",
    tags: ["DP", "2D", "Levenshtein"],
    type: "python",
    statement:
      "Write <code>min_distance(word1, word2)</code> returning the minimum number of " +
      "single-character operations (insert, delete, replace) to convert <code>word1</code> " +
      "into <code>word2</code> — the Levenshtein distance. Same grid as LCS, three " +
      "transitions instead of two. Powers spell-checkers, diff tools, and fuzzy search.",
    examples:
      'Input:  "horse", "ros"           -> 3   (horse->rorse->rose->ros)\n' +
      'Input:  "intention", "execution" -> 5\n' +
      'Input:  "", "abc"                -> 3   (three inserts)',
    hint: "dp[i][j] = distance from word1[:i] to word2[:j]. Last chars equal -> diagonal free; else 1 + min(replace=diagonal, delete=up, insert=left). Base row/col = i and j (pure inserts/deletes).",
    functionName: "min_distance",
    signature: "min_distance(word1: str, word2: str) -> int",
    starter:
      "def min_distance(word1, word2):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def min_distance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = list(range(n + 1))          # row for word1[:0]: j inserts to reach word2[:j]
    for i in range(1, m + 1):
        prev = dp[0]                 # dp[i-1][j-1] before overwrite
        dp[0] = i                    # word2[:0]: i deletes
        for j in range(1, n + 1):
            cur = dp[j]
            if word1[i - 1] == word2[j - 1]:
                dp[j] = prev                          # match: free
            else:
                dp[j] = 1 + min(prev,                 # replace
                                cur,                  # delete from word1
                                dp[j - 1])            # insert into word1
            prev = cur
    return dp[n]`,
    explanation:
      "Shown in the one-row form to demonstrate the space optimization live: `prev` carries the " +
      "diagonal dp[i-1][j-1] that the overwrite would destroy. If that juggling feels risky under " +
      "pressure, write the full 2D table first — correct beats clever. Interview connection: " +
      "'how would you suggest corrections for a typo?' -> edit distance <= 2 against a dictionary " +
      "(plus smarter tricks like deletion-neighborhoods).",
    tests: [
      { args: ["horse", "ros"], expected: 3 },
      { args: ["intention", "execution"], expected: 5 },
      { args: ["", "abc"], expected: 3 },
      { args: ["abc", "abc"], expected: 0 },
      { args: ["kitten", "sitting"], expected: 3 },
      { args: ["abcdef", ""], expected: 6 },
    ],
  },

  F37: {
    id: "F37",
    title: "Merge Intervals",
    difficulty: "Medium",
    time: "10-15 min",
    tags: ["Intervals", "Sorting"],
    type: "python",
    statement:
      "Write <code>merge(intervals)</code> that merges all overlapping intervals and returns " +
      "the result sorted by start. The single most common interval question — asked directly, " +
      "or hiding inside calendar/booking problems. Touching intervals like [1,4] and [4,5] " +
      "count as overlapping here.",
    examples:
      "Input:  [[1,3],[2,6],[8,10],[15,18]] -> [[1,6],[8,10],[15,18]]\n" +
      "Input:  [[1,4],[4,5]]                -> [[1,5]]\n" +
      "Input:  [[1,4],[2,3]]                -> [[1,4]]   (swallowed, not truncated!)",
    hint: "Sort by start. Extend the last merged block while next.start <= block.end — and extend with max(ends), not blindly with the new end.",
    functionName: "merge",
    signature: "merge(intervals: list[list[int]]) -> list[list[int]]",
    starter:
      "def merge(intervals):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def merge(intervals: list) -> list:
    intervals.sort()
    out = []
    for s, e in intervals:
        if out and s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)   # max, not just e!
        else:
            out.append([s, e])
    return out`,
    explanation:
      "The bug everyone writes once: out[-1][1] = e. Sorting by start does not sort by end, so " +
      "[1,10] followed by [2,3] must stay [1,10] — hence max(). Test 3 exists purely to catch that. " +
      "O(n log n) for the sort, O(n) for the sweep. Follow-up to expect: 'insert one new interval " +
      "into an already-merged list' — same idea, three phases (before / overlapping / after), no re-sort.",
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[1, 4], [2, 3]]], expected: [[1, 4]] },
      { args: [[[5, 6], [1, 2]]], expected: [[1, 2], [5, 6]] },
      { args: [[[1, 4]]], expected: [[1, 4]] },
      { args: [[[2, 3], [4, 5], [6, 7], [1, 10]]], expected: [[1, 10]] },
    ],
  },

  F38: {
    id: "F38",
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Intervals", "Greedy", "Exchange Argument"],
    type: "python",
    statement:
      "Write <code>erase_overlap_intervals(intervals)</code> returning the minimum number of " +
      "intervals to remove so the rest don't overlap (touching endpoints like [1,2],[2,3] are " +
      "fine). Equivalent to activity selection: keep the maximum non-overlapping set. " +
      "The sort key IS the interview — by end, and be ready to say why.",
    examples:
      "Input:  [[1,2],[2,3],[3,4],[1,3]] -> 1   (drop [1,3])\n" +
      "Input:  [[1,2],[1,2],[1,2]]       -> 2\n" +
      "Input:  [[1,2],[2,3]]             -> 0",
    hint: "Sort by END. Greedily keep every interval that starts at/after the last kept end; count the rest as removed. Exchange argument: the earliest-ending interval is always safe to keep.",
    functionName: "erase_overlap_intervals",
    signature: "erase_overlap_intervals(intervals: list[list[int]]) -> int",
    starter:
      "def erase_overlap_intervals(intervals):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def erase_overlap_intervals(intervals: list) -> int:
    intervals.sort(key=lambda iv: iv[1])   # by END — the whole trick
    removed = 0
    last_end = float("-inf")
    for s, e in intervals:
        if s >= last_end:
            last_end = e                   # keep it
        else:
            removed += 1                   # conflicts with a kept one
    return removed`,
    explanation:
      "Sort-by-start counterexample to keep handy: [[1,100],[11,22],[1,11],[2,12]] — start order " +
      "keeps the long [1,100] and removes 3; end order keeps [1,11],[11,22] and removes only 2. " +
      "The exchange argument in one line: any optimal solution's first interval can be swapped for " +
      "the earliest-ending one without creating conflicts, so choosing it greedily is safe.",
    tests: [
      { args: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expected: 1 },
      { args: [[[1, 2], [1, 2], [1, 2]]], expected: 2 },
      { args: [[[1, 2], [2, 3]]], expected: 0 },
      { args: [[[1, 100], [11, 22], [1, 11], [2, 12]]], expected: 2 },
      { args: [[[1, 5]]], expected: 0 },
    ],
  },

  F39: {
    id: "F39",
    title: "Jump Game II",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Greedy", "Implicit BFS"],
    type: "python",
    statement:
      "Write <code>jump(nums)</code> returning the minimum number of jumps to reach the last " +
      "index, where <code>nums[i]</code> is the maximum jump length from <code>i</code> " +
      "(reaching the end is guaranteed). O(n²) DP works; the O(n) greedy is really BFS over an " +
      "implicit graph — narrate it as expanding frontier layers and correctness is obvious.",
    examples:
      "Input:  [2,3,1,1,4] -> 2   (0 -> 1 -> 4)\n" +
      "Input:  [2,3,0,1,4] -> 2\n" +
      "Input:  [0]         -> 0   (already there)",
    hint: "Track the current BFS layer's right edge (cur_end) and the farthest anything in it reaches. Hitting cur_end = finishing a layer = one more jump.",
    functionName: "jump",
    signature: "jump(nums: list[int]) -> int",
    starter:
      "def jump(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def jump(nums: list) -> int:
    jumps = cur_end = farthest = 0
    for i in range(len(nums) - 1):        # never process the last index
        farthest = max(farthest, i + nums[i])
        if i == cur_end:                  # current BFS layer exhausted
            jumps += 1
            cur_end = farthest            # next layer's right edge
    return jumps`,
    explanation:
      "Layer k = indices reachable in k jumps. Walking left to right, once i crosses the current " +
      "layer's edge we must have jumped again — and the best possible next edge is the farthest " +
      "reach seen so far. The `len(nums) - 1` bound is load-bearing: processing the last index " +
      "would count a phantom extra jump when i == cur_end lands exactly on it.",
    tests: [
      { args: [[2, 3, 1, 1, 4]], expected: 2 },
      { args: [[2, 3, 0, 1, 4]], expected: 2 },
      { args: [[1, 1, 1, 1]], expected: 3 },
      { args: [[0]], expected: 0 },
      { args: [[1, 2, 3]], expected: 2 },
      { args: [[5, 1, 1, 1, 1, 1]], expected: 1 },
    ],
  },

  F40: {
    id: "F40",
    title: "Meeting Rooms II",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Intervals", "Sweep Line", "Heap"],
    type: "python",
    statement:
      "Write <code>min_meeting_rooms(intervals)</code> returning the minimum number of rooms " +
      "needed to host all meetings (a room frees exactly at end time, so [1,3] and [3,5] can " +
      "share). Equals the maximum number of meetings alive at one instant. This exact question — " +
      "'peak concurrent X' — also shows up as a SQL problem, so own it in both languages.",
    examples:
      "Input:  [[0,30],[5,10],[15,20]] -> 2\n" +
      "Input:  [[7,10],[2,4]]          -> 1\n" +
      "Input:  [[1,3],[3,5],[5,7]]     -> 1   (back-to-back share a room)",
    hint: "Sweep line: emit (start,+1) and (end,-1) events, sort, track the running sum's max. Tuple sort puts (t,-1) before (t,+1) — exactly the tie-break you want.",
    functionName: "min_meeting_rooms",
    signature: "min_meeting_rooms(intervals: list[list[int]]) -> int",
    starter:
      "def min_meeting_rooms(intervals):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def min_meeting_rooms(intervals: list) -> int:
    events = []
    for s, e in intervals:
        events.append((s, 1))       # need a room
        events.append((e, -1))      # free a room
    events.sort()                   # ties: -1 sorts before +1 -> free before claim
    rooms = best = 0
    for _, d in events:
        rooms += d
        best = max(best, rooms)
    return best`,
    explanation:
      "The tie-break is the interview: at time 3, (3,-1) sorting before (3,1) lets back-to-back " +
      "meetings share — Python's tuple ordering gives it for free, but SAY it, don't let it look " +
      "accidental. Alternative telling: sort starts; min-heap of end times; pop when the earliest " +
      "end <= next start; heap's max size is the answer. Both are O(n log n) — the heap version " +
      "also tells you WHICH room each meeting gets.",
    tests: [
      { args: [[[0, 30], [5, 10], [15, 20]]], expected: 2 },
      { args: [[[7, 10], [2, 4]]], expected: 1 },
      { args: [[[1, 5], [2, 6], [3, 7], [4, 8]]], expected: 4 },
      { args: [[[1, 3], [3, 5], [5, 7]]], expected: 1 },
      { args: [[]], expected: 0 },
      { args: [[[1, 10], [2, 3], [4, 5], [6, 7]]], expected: 2 },
    ],
  },

  F41: {
    id: "F41",
    title: "Gas Station",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Greedy", "Circular", "Lemma"],
    type: "python",
    statement:
      "Write <code>can_complete_circuit(gas, cost)</code>: station <code>i</code> provides " +
      "<code>gas[i]</code> fuel and driving to station <code>i+1</code> costs " +
      "<code>cost[i]</code>. Return the unique starting index from which you can complete one " +
      "full clockwise loop with an empty initial tank, or <code>-1</code>. One pass — the whole " +
      "interview is stating the 'failed prefix is disqualified' lemma.",
    examples:
      "Input:  gas=[1,2,3,4,5], cost=[3,4,5,1,2] -> 3\n" +
      "Input:  gas=[2,3,4],     cost=[3,4,3]     -> -1\n" +
      "Input:  gas=[3,1,1],     cost=[1,2,2]     -> 0",
    hint: "Two facts: (1) total gas >= total cost guarantees an answer exists; (2) if starting at s you first go negative leaving i, no station in s..i can work — restart from i+1 with an empty tank.",
    functionName: "can_complete_circuit",
    signature: "can_complete_circuit(gas: list[int], cost: list[int]) -> int",
    starter:
      "def can_complete_circuit(gas, cost):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def can_complete_circuit(gas: list, cost: list) -> int:
    total = tank = start = 0
    for i in range(len(gas)):
        diff = gas[i] - cost[i]
        total += diff
        tank += diff
        if tank < 0:               # everything in start..i is disqualified
            start, tank = i + 1, 0
    return start if total >= 0 else -1`,
    explanation:
      "Why the lemma holds: any station m between start and i is reached with tank >= 0, so " +
      "starting AT m (tank = 0) leaves you with less or equal fuel at every later point — if the " +
      "original run died at i, m's run dies at or before i too. So one forward pass suffices; " +
      "no nested restart loop, no O(n²). The final feasibility check uses fact (1): " +
      "non-negative total guarantees the last candidate start actually wraps around.",
    tests: [
      { args: [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], expected: 3 },
      { args: [[2, 3, 4], [3, 4, 3]], expected: -1 },
      { args: [[5, 1, 2, 3, 4], [4, 4, 1, 5, 1]], expected: 4 },
      { args: [[3, 1, 1], [1, 2, 2]], expected: 0 },
      { args: [[5], [4]], expected: 0 },
    ],
  },

  F42: {
    id: "F42",
    title: "Kth Largest Element",
    difficulty: "Medium",
    time: "10-15 min",
    tags: ["Heap", "Top-K", "Quickselect"],
    type: "python",
    statement:
      "Write <code>find_kth_largest(nums, k)</code> returning the k-th largest element " +
      "(by sorted position — duplicates count separately). Better than the O(n log n) full " +
      "sort: a size-k min-heap gives O(n log k). Mention quickselect (O(n) average) as the " +
      "follow-up answer, but code the heap — it's harder to fumble live.",
    examples:
      "Input:  nums=[3,2,1,5,6,4], k=2         -> 5\n" +
      "Input:  nums=[3,2,3,1,2,4,5,5,6], k=4   -> 4\n" +
      "Input:  nums=[1], k=1                   -> 1",
    hint: "Min-heap of size k: its root is the weakest of the current k best — the only element a newcomer must beat. heapreplace does pop+push in one sift.",
    functionName: "find_kth_largest",
    signature: "find_kth_largest(nums: list[int], k: int) -> int",
    starter:
      "def find_kth_largest(nums, k):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`import heapq

def find_kth_largest(nums: list, k: int) -> int:
    h = nums[:k]
    heapq.heapify(h)                     # O(k)
    for x in nums[k:]:
        if x > h[0]:                     # beats the weakest of the best?
            heapq.heapreplace(h, x)      # pop min + push, one sift
    return h[0]`,
    explanation:
      "The counter-intuitive core: track the k LARGEST with a MIN-heap, because eviction needs " +
      "the smallest of the kept set in O(1). O(n log k) time, O(k) space — and it works on a " +
      "stream, which the sort answer doesn't. Quickselect trades that for O(n) average / O(n²) " +
      "worst on adversarial pivots; say 'random pivot fixes it in expectation' and move on.",
    tests: [
      { args: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
      { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
      { args: [[1], 1], expected: 1 },
      { args: [[7, 6, 5, 4, 3, 2, 1], 5], expected: 3 },
      { args: [[2, 2, 2, 2], 3], expected: 2 },
      { args: [[-1, -5, 0, 3], 2], expected: 0 },
    ],
  },

  F43: {
    id: "F43",
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    time: "20-25 min",
    tags: ["Heap", "K-way Merge"],
    type: "python",
    statement:
      "Write <code>merge_k_lists(lists)</code> merging k sorted lists into one sorted list. " +
      "The k-way merge pattern: a heap holding ONE candidate per list — the smallest unmerged " +
      "element of each. O(N log k) for N total elements, versus O(N log N) for concat-and-sort " +
      "and O(Nk) for k-way linear scanning. Know all three and why the heap wins.",
    examples:
      "Input:  [[1,4,5],[1,3,4],[2,6]] -> [1,1,2,3,4,4,5,6]\n" +
      "Input:  []                      -> []\n" +
      "Input:  [[]]                    -> []",
    hint: "Heap entries (value, list_index, element_index). Pop the global min, push that list's next element. The list_index doubles as the tie-breaker when values collide.",
    functionName: "merge_k_lists",
    signature: "merge_k_lists(lists: list[list[int]]) -> list[int]",
    starter:
      "def merge_k_lists(lists):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`import heapq

def merge_k_lists(lists: list) -> list:
    h = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
    heapq.heapify(h)
    out = []
    while h:
        val, i, j = heapq.heappop(h)
        out.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(h, (lists[i][j + 1], i, j + 1))
    return out`,
    explanation:
      "Each element enters and leaves the heap exactly once and the heap never exceeds k entries: " +
      "O(N log k). The tuple (val, i, j) needs i as tie-breaker — with equal values Python would " +
      "otherwise compare the third elements, which is fine here, but with node objects (the " +
      "LeetCode linked-list version) it CRASHES: TypeError on comparing nodes. Volunteering that " +
      "detail is a strong signal. Divide-and-conquer pairwise merging matches O(N log k) too — " +
      "acceptable alternative, especially in heap-less JavaScript.",
    tests: [
      { args: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
      { args: [[]], expected: [] },
      { args: [[[]]], expected: [] },
      { args: [[[5], [3], [1], [4], [2]]], expected: [1, 2, 3, 4, 5] },
      { args: [[[1, 2, 3], [], [0]]], expected: [0, 1, 2, 3] },
      { args: [[[1, 1, 1], [1, 1]]], expected: [1, 1, 1, 1, 1] },
    ],
  },

  F44: {
    id: "F44",
    title: "Running Median of a Stream",
    difficulty: "Hard",
    time: "25-30 min",
    tags: ["Heap", "Two Heaps", "Streaming"],
    type: "python",
    statement:
      "Write <code>running_median(nums)</code> returning the median after each element of the " +
      "stream is added: result[i] = median of nums[0..i]. Even count -> mean of the two middle " +
      "values. Re-sorting per element is O(n² log n); the two-heap structure does O(log n) per " +
      "insert, O(1) per query — the classic 'design a data structure' heap interview.",
    examples:
      "Input:  [2,3,4]        -> [2, 2.5, 3]\n" +
      "Input:  [5,15,1,3]     -> [5, 10, 5, 4]\n" +
      "Input:  [1]            -> [1]",
    hint: "Max-heap of the small half (negate values — heapq is min-only) + min-heap of the large half; small may hold one extra. Insert: push to small, move small's max to large, rebalance if large grew bigger. Median lives at the roots.",
    functionName: "running_median",
    signature: "running_median(nums: list[int]) -> list[float]",
    starter:
      "def running_median(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`import heapq

def running_median(nums: list) -> list:
    small, large = [], []      # small: max-heap via negation; large: min-heap
    out = []
    for x in nums:
        heapq.heappush(small, -x)                     # 1. into small
        heapq.heappush(large, -heapq.heappop(small))  # 2. small's max -> large
        if len(large) > len(small):                   # 3. keep small >= large
            heapq.heappush(small, -heapq.heappop(large))
        if len(small) > len(large):
            out.append(-small[0])
        else:
            out.append((-small[0] + large[0]) / 2)
    return out`,
    explanation:
      "The push-move-rebalance dance is unconditional — no branching on x vs the current median, " +
      "so no edge cases on empty heaps or duplicates. After step 2 every element of small <= every " +
      "element of large by construction; after step 3 sizes differ by at most 1 with small holding " +
      "any extra. Follow-ups to expect: 'median of a sliding window' (needs lazy deletion, " +
      "Module 8 trick) and 'what if values are bounded 0-100?' (counting array beats heaps). " +
      "JS note: the JS reference keeps a sorted array instead (O(n) insert) — narrate the " +
      "two-heap answer anyway; Module 11 builds the real JS MinHeap from memory.",
    tests: [
      { args: [[2, 3, 4]], expected: [2, 2.5, 3] },
      { args: [[1, 2]], expected: [1, 1.5] },
      { args: [[5, 15, 1, 3]], expected: [5, 10, 5, 4] },
      { args: [[1]], expected: [1] },
      { args: [[-1, -2, -3, -4, -5]], expected: [-1, -1.5, -2, -2.5, -3] },
      { args: [[7, 7, 7, 7]], expected: [7, 7, 7, 7] },
    ],
  },

  F45: {
    id: "F45",
    title: "Task Scheduler",
    difficulty: "Medium",
    time: "20-25 min",
    tags: ["Greedy", "Counting", "Scheduling"],
    type: "python",
    statement:
      "Write <code>least_interval(tasks, n)</code>: identical tasks need a cooldown of " +
      "<code>n</code> ticks between runs; each tick runs one task or idles. Return the minimum " +
      "ticks to finish everything. Simulating with a heap works — but the O(n) counting " +
      "formula, derived from a picture of frames, is the answer that impresses.",
    examples:
      'Input:  tasks=["A","A","A","B","B","B"], n=2 -> 8   (A B _ A B _ A B)\n' +
      'Input:  tasks=["A","A","A","B","B","B"], n=0 -> 6\n' +
      'Input:  tasks=["A","B","C","A","B","C"], n=1 -> 6   (no idling needed)',
    hint: "Picture the most frequent task pinned first: (max_count - 1) frames of width n+1, then one final slot per task tied at max_count. Other tasks fill the gaps. Answer = max(formula, len(tasks)).",
    functionName: "least_interval",
    signature: "least_interval(tasks: list[str], n: int) -> int",
    starter:
      "def least_interval(tasks, n):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import Counter

def least_interval(tasks: list, n: int) -> int:
    counts = Counter(tasks)
    max_count = max(counts.values())
    max_ties = sum(1 for c in counts.values() if c == max_count)
    frame = (max_count - 1) * (n + 1) + max_ties
    return max(frame, len(tasks))`,
    explanation:
      "Lay the most frequent task out first: it forces (max_count - 1) gaps of width n, giving " +
      "frames of width n+1, plus a final row holding every task tied at max_count. Everything " +
      "else fills gaps without creating new idles. If there are MORE tasks than the frame has " +
      "slots, no idling occurs at all and the answer is simply len(tasks) — that's the max(). " +
      "Whiteboard the A B _ A B _ A B picture; the formula becomes self-evident and memorable.",
    tests: [
      { args: [["A", "A", "A", "B", "B", "B"], 2], expected: 8 },
      { args: [["A", "A", "A", "B", "B", "B"], 0], expected: 6 },
      { args: [["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], 2], expected: 16 },
      { args: [["A", "B", "C", "A", "B", "C"], 1], expected: 6 },
      { args: [["A"], 5], expected: 1 },
      { args: [["A", "A", "B", "B"], 3], expected: 6 },
    ],
  },

  F46: {
    id: "F46",
    title: "SQL — Second Highest Salary",
    difficulty: "Medium",
    time: "10-15 min",
    tags: ["SQL", "Subquery", "NULL"],
    type: "sql",
    statement:
      "Return the second highest <em>distinct</em> salary from <code>employee</code> as a column " +
      "named <code>SecondHighest</code>. If there is no second highest (fewer than two distinct " +
      "salaries), return <code>NULL</code> — one row, always. The classic warm-up whose whole " +
      "difficulty is the NULL requirement.",
    examples:
      "employee: (1,100),(2,200),(3,300),(4,300)\n" +
      "-> SecondHighest = 200   (distinct salaries 300,200,100)\n\n" +
      "employee: (1,100)\n" +
      "-> SecondHighest = NULL  (still one row!)",
    hint: "Wrap the obvious ORDER BY DESC LIMIT 1 OFFSET 1 in a scalar subquery: SELECT (subquery) AS SecondHighest. A scalar subquery that finds nothing yields NULL — exactly the required behavior, for free.",
    solution:
`-- The naive version returns ZERO rows when there's no second salary:
--   SELECT DISTINCT salary ... ORDER BY salary DESC LIMIT 1 OFFSET 1
-- Wrapping it as a scalar subquery turns "no row" into NULL:
SELECT (
    SELECT DISTINCT salary
    FROM employee
    ORDER BY salary DESC
    LIMIT 1 OFFSET 1
) AS SecondHighest;`,
    sqlSchema:
`CREATE TABLE employee (id INTEGER PRIMARY KEY, salary INTEGER);
INSERT INTO employee VALUES (1,100),(2,200),(3,300),(4,300);`,
    sqlStarter:
      "-- Table: employee(id, salary)\n" +
      "-- Return one row, one column: SecondHighest\n" +
      "SELECT\n",
    sqlSolution:
`SELECT (
    SELECT DISTINCT salary
    FROM employee
    ORDER BY salary DESC
    LIMIT 1 OFFSET 1
) AS SecondHighest;`,
    explanation:
      "Two ideas: DISTINCT before ranking (300,300 must count once — test 1 has a tie at the top), " +
      "and the scalar-subquery wrap so an empty result becomes a NULL row instead of no row. " +
      "Follow-up: 'Nth highest' — either OFFSET N-1, or DENSE_RANK() = N in a subquery. " +
      "Say both; the window version generalizes to per-group.",
    tests: [
      {
        name: "Normal case with a tie at the top",
        orderMatters: true,
        expected: { columns: ["SecondHighest"], rows: [[200]] },
      },
      {
        name: "Single employee -> NULL row",
        orderMatters: true,
        schema:
`CREATE TABLE employee (id INTEGER PRIMARY KEY, salary INTEGER);
INSERT INTO employee VALUES (1,100);`,
        expected: { columns: ["SecondHighest"], rows: [[null]] },
      },
      {
        name: "All salaries equal -> NULL row",
        orderMatters: true,
        schema:
`CREATE TABLE employee (id INTEGER PRIMARY KEY, salary INTEGER);
INSERT INTO employee VALUES (1,100),(2,100),(3,100);`,
        expected: { columns: ["SecondHighest"], rows: [[null]] },
      },
    ],
  },

  F47: {
    id: "F47",
    title: "SQL — Employees Earning More Than Their Managers",
    difficulty: "Medium",
    time: "10-15 min",
    tags: ["SQL", "Self-Join"],
    type: "sql",
    statement:
      "Table <code>employee(id, name, salary, manager_id)</code> where <code>manager_id</code> " +
      "references another row of the same table (NULL for the top). Return the names of employees " +
      "who earn strictly more than their own manager, as a column named <code>employee</code>. " +
      "The canonical self-join.",
    examples:
      "employee:\n" +
      "  (1,'Joe',   70000, manager 3)\n" +
      "  (2,'Henry', 80000, manager 4)\n" +
      "  (3,'Sam',   60000, NULL)\n" +
      "  (4,'Max',   90000, NULL)\n" +
      "-> Joe   (70000 > Sam's 60000; Henry 80000 < Max's 90000)",
    hint: "Join the table to itself under two aliases: e (employee) and m (manager), ON e.manager_id = m.id. Top-level employees drop out of the INNER JOIN naturally — no NULL handling needed.",
    solution:
`SELECT e.name AS employee
FROM employee e
JOIN employee m ON e.manager_id = m.id   -- same table, two roles
WHERE e.salary > m.salary;`,
    sqlSchema:
`CREATE TABLE employee (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, manager_id INTEGER);
INSERT INTO employee VALUES
  (1,'Joe',70000,3),(2,'Henry',80000,4),(3,'Sam',60000,NULL),(4,'Max',90000,NULL);`,
    sqlStarter:
      "-- Table: employee(id, name, salary, manager_id)\n" +
      "-- Column to return: employee (names only)\n" +
      "SELECT\n",
    sqlSolution:
`SELECT e.name AS employee
FROM employee e
JOIN employee m ON e.manager_id = m.id
WHERE e.salary > m.salary;`,
    explanation:
      "A self-join is just a join where both sides happen to be the same table — the aliases ARE " +
      "the roles. INNER JOIN quietly excludes employees with manager_id NULL, which here is " +
      "correct (no manager, no comparison). Narrate that: 'I want INNER here, top-level people " +
      "should drop out.' Follow-ups: employees earning more than the AVERAGE of their department " +
      "(join to a grouped subquery), or chains ('more than their manager's manager' — join twice).",
    tests: [
      {
        name: "Base case",
        orderMatters: false,
        expected: { columns: ["employee"], rows: [["Joe"]] },
      },
      {
        name: "Management chain",
        orderMatters: false,
        schema:
`CREATE TABLE employee (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, manager_id INTEGER);
INSERT INTO employee VALUES
  (1,'Ada',50000,NULL),(2,'Bob',60000,1),(3,'Cy',55000,2),(4,'Dee',70000,2);`,
        expected: { columns: ["employee"], rows: [["Bob"], ["Dee"]] },
      },
    ],
  },

  F48: {
    id: "F48",
    title: "SQL — Customers Who Never Order",
    difficulty: "Medium",
    time: "10-15 min",
    tags: ["SQL", "Anti-Join", "NULL Trap"],
    type: "sql",
    statement:
      "Tables <code>customers(id, name)</code> and <code>orders(id, customer_id)</code>. Return " +
      "the names of customers who have never placed an order, as a column named " +
      "<code>customers</code>. Know all three anti-join idioms — and note that the second test " +
      "fixture contains an order with <code>customer_id = NULL</code>, which detonates the " +
      "<code>NOT IN</code> version.",
    examples:
      "customers: (1,'Joe'),(2,'Henry'),(3,'Sam'),(4,'Max')\n" +
      "orders:    (1, customer 3),(2, customer 1)\n" +
      "-> Henry, Max",
    hint: "LEFT JOIN orders, keep rows where the join found nothing (o.id IS NULL) — or NOT EXISTS. Both survive NULL customer_ids; NOT IN does not (NULL makes the whole predicate 'unknown' -> zero rows).",
    solution:
`-- Idiom 1: LEFT JOIN ... IS NULL (the workhorse; NULL-safe)
SELECT c.name AS customers
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;

-- Idiom 2: NOT EXISTS (clearest intent; NULL-safe)
-- SELECT c.name AS customers FROM customers c
-- WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

-- Idiom 3: NOT IN — BROKEN when the subquery can yield NULL:
-- WHERE c.id NOT IN (SELECT customer_id FROM orders)   -- returns 0 rows on test 2!`,
    sqlSchema:
`CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER);
INSERT INTO customers VALUES (1,'Joe'),(2,'Henry'),(3,'Sam'),(4,'Max');
INSERT INTO orders VALUES (1,3),(2,1);`,
    sqlStarter:
      "-- Tables: customers(id, name), orders(id, customer_id)\n" +
      "-- Column to return: customers (names of customers with no orders)\n" +
      "SELECT\n",
    sqlSolution:
`SELECT c.name AS customers
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;`,
    explanation:
      "The anti-join trio: LEFT JOIN ... IS NULL, NOT EXISTS, NOT IN. The first two are NULL-safe; " +
      "NOT IN expands to a chain of <> comparisons, and one NULL in the list makes every row " +
      "'unknown' -> the query silently returns nothing. Test 2 plants exactly that landmine (an " +
      "anonymous guest order). If you passed both tests with NOT IN — you didn't; it's the point " +
      "of the second fixture. Interviewers ask 'what's wrong with this query' on this exact bug.",
    tests: [
      {
        name: "Base case",
        orderMatters: false,
        expected: { columns: ["customers"], rows: [["Henry"], ["Max"]] },
      },
      {
        name: "An order with NULL customer_id (NOT IN trap)",
        orderMatters: false,
        schema:
`CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER);
INSERT INTO customers VALUES (1,'Joe'),(2,'Henry'),(3,'Sam'),(4,'Max');
INSERT INTO orders VALUES (1,3),(2,1),(3,NULL);`,
        expected: { columns: ["customers"], rows: [["Henry"], ["Max"]] },
      },
    ],
  },

  F49: {
    id: "F49",
    title: "SQL — Department Top Three Salaries",
    difficulty: "Hard",
    time: "20-25 min",
    tags: ["SQL", "Window Functions", "Top-N per Group"],
    type: "sql",
    statement:
      "Tables <code>employee(id, name, salary, department_id)</code> and " +
      "<code>department(id, name)</code>. A 'top earner' is anyone whose salary is among the " +
      "top three <em>distinct</em> salaries of their department. Return " +
      "<code>department, employee, salary</code> for all top earners. The definitive " +
      "top-N-per-group question — DENSE_RANK in a subquery, filter outside.",
    examples:
      "IT:    Max 90000, Joe 85000, Randy 85000, Will 70000, Janet 69000\n" +
      "Sales: Henry 80000, Sam 60000\n" +
      "-> IT: Max, Joe, Randy, Will  (distinct salaries 90k,85k,70k = top 3; Janet's 69k is 4th)\n" +
      "-> Sales: Henry, Sam          (only two distinct salaries exist)",
    hint: "DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) — dense, because 'top three distinct salaries' means ties share a rank and don't burn slots. Rank in a subquery, WHERE rk <= 3 outside (processing order: the alias isn't visible at its own level).",
    solution:
`SELECT d.name AS department, e.name AS employee, e.salary
FROM (
    SELECT *,
           DENSE_RANK() OVER (
               PARTITION BY department_id
               ORDER BY salary DESC
           ) AS rk
    FROM employee
) e
JOIN department d ON e.department_id = d.id
WHERE e.rk <= 3;`,
    sqlSchema:
`CREATE TABLE employee (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, department_id INTEGER);
CREATE TABLE department (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO department VALUES (1,'IT'),(2,'Sales');
INSERT INTO employee VALUES
  (1,'Joe',85000,1),(2,'Henry',80000,2),(3,'Sam',60000,2),(4,'Max',90000,1),
  (5,'Janet',69000,1),(6,'Randy',85000,1),(7,'Will',70000,1);`,
    sqlStarter:
      "-- Tables: employee(id, name, salary, department_id), department(id, name)\n" +
      "-- Columns to return: department, employee, salary\n" +
      "SELECT\n",
    sqlSolution:
`SELECT d.name AS department, e.name AS employee, e.salary
FROM (
    SELECT *,
           DENSE_RANK() OVER (
               PARTITION BY department_id
               ORDER BY salary DESC
           ) AS rk
    FROM employee
) e
JOIN department d ON e.department_id = d.id
WHERE e.rk <= 3;`,
    explanation:
      "Why DENSE_RANK and not RANK or ROW_NUMBER: Joe and Randy tie at 85000 — with RANK the tie " +
      "consumes rank 2 AND 3, wrongly evicting Will's 70000; ROW_NUMBER caps the output at three " +
      "rows (same eviction), and if a tie ever straddled the cutoff it would arbitrarily drop one " +
      "of the tied employees. 'Top three distinct salary VALUES' is " +
      "dense by definition. The subquery wrap exists because WHERE can't see the same level's " +
      "SELECT aliases (Module 12, processing order). Pre-window-function alternative worth naming: " +
      "correlated COUNT(DISTINCT salary) — O(n²)-ish and ugly, which is exactly why windows won.",
    tests: [
      {
        name: "Two departments, tie inside IT",
        orderMatters: false,
        expected: {
          columns: ["department", "employee", "salary"],
          rows: [
            ["IT", "Max", 90000],
            ["IT", "Joe", 85000],
            ["IT", "Randy", 85000],
            ["IT", "Will", 70000],
            ["Sales", "Henry", 80000],
            ["Sales", "Sam", 60000],
          ],
        },
      },
      {
        name: "Department with fewer than 3 salary levels",
        orderMatters: false,
        schema:
`CREATE TABLE employee (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, department_id INTEGER);
CREATE TABLE department (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO department VALUES (1,'Ops');
INSERT INTO employee VALUES (1,'Ann',50000,1),(2,'Ben',50000,1);`,
        expected: {
          columns: ["department", "employee", "salary"],
          rows: [["Ops", "Ann", 50000], ["Ops", "Ben", 50000]],
        },
      },
    ],
  },

  F50: {
    id: "F50",
    title: "SQL — Rank Scores",
    difficulty: "Medium",
    time: "10-15 min",
    tags: ["SQL", "Window Functions", "DENSE_RANK"],
    type: "sql",
    statement:
      "Table <code>scores(id, score)</code>. Return each score with its rank — highest first, " +
      "ties share a rank, and ranks have no gaps (4.00, 4.00, 3.85 ranks as 1, 1, 2). " +
      "Columns: <code>score, rnk</code>, ordered by score descending. " +
      "One line of window function — the question is really 'do you know which of the three " +
      "ranking functions this is?'.",
    examples:
      "scores: 3.50, 3.65, 4.00, 3.85, 4.00, 3.65\n" +
      "->  4.00 1\n" +
      "    4.00 1\n" +
      "    3.85 2\n" +
      "    3.65 3\n" +
      "    3.65 3\n" +
      "    3.50 4",
    hint: "'Ties share, no gaps' is the definition of DENSE_RANK() OVER (ORDER BY score DESC). (RANK would jump 1,1,3; ROW_NUMBER would break the tie arbitrarily.) Alias it rnk — RANK is a reserved word now that window functions exist.",
    solution:
`SELECT score,
       DENSE_RANK() OVER (ORDER BY score DESC) AS rnk
FROM scores
ORDER BY score DESC;`,
    sqlSchema:
`CREATE TABLE scores (id INTEGER PRIMARY KEY, score REAL);
INSERT INTO scores VALUES (1,3.50),(2,3.65),(3,4.00),(4,3.85),(5,4.00),(6,3.65);`,
    sqlStarter:
      "-- Table: scores(id, score)\n" +
      "-- Columns to return: score, rnk — ordered by score DESC\n" +
      "SELECT\n",
    sqlSolution:
`SELECT score,
       DENSE_RANK() OVER (ORDER BY score DESC) AS rnk
FROM scores
ORDER BY score DESC;`,
    explanation:
      "Map the requirement's words to the function: 'ties share a rank' kills ROW_NUMBER, " +
      "'no gaps' kills RANK, leaving DENSE_RANK. The window's ORDER BY ranks; the query's ORDER BY " +
      "sorts the output — they're independent clauses and you need both. Pre-window alternative " +
      "(know it exists): correlated subquery COUNT(DISTINCT s2.score) WHERE s2.score >= s.score — " +
      "same output, quadratic and unreadable.",
    tests: [
      {
        name: "Ranks with ties, no gaps",
        orderMatters: true,
        expected: {
          columns: ["score", "rnk"],
          rows: [[4.0, 1], [4.0, 1], [3.85, 2], [3.65, 3], [3.65, 3], [3.5, 4]],
        },
      },
      {
        name: "All identical scores",
        orderMatters: true,
        schema:
`CREATE TABLE scores (id INTEGER PRIMARY KEY, score REAL);
INSERT INTO scores VALUES (1,2.5),(2,2.5),(3,2.5);`,
        expected: { columns: ["score", "rnk"], rows: [[2.5, 1], [2.5, 1], [2.5, 1]] },
      },
    ],
  },

  F51: {
    id: "F51",
    title: "SQL — Consecutive Numbers",
    difficulty: "Hard",
    time: "20-25 min",
    tags: ["SQL", "Window Functions", "LAG"],
    type: "sql",
    statement:
      "Table <code>logs(id, num)</code> with consecutive ids. Return every number that appears " +
      "at least three times in a row (by id), once, as column <code>consecutive_num</code>. " +
      "The 'rows talking to their neighbors' question — LAG twice, or a triple self-join.",
    examples:
      "logs: (1,1),(2,1),(3,1),(4,2),(5,1),(6,2),(7,2)\n" +
      "-> 1   (ids 1,2,3 hold three 1s in a row; the 2s never make three)",
    hint: "LAG(num, 1) and LAG(num, 2) OVER (ORDER BY id) pull the two previous values onto each row; a row where num = prev1 = prev2 ends a run of three. DISTINCT the result — a run of five would otherwise report its number three times.",
    solution:
`SELECT DISTINCT num AS consecutive_num
FROM (
    SELECT num,
           LAG(num, 1) OVER (ORDER BY id) AS prev1,
           LAG(num, 2) OVER (ORDER BY id) AS prev2
    FROM logs
) t
WHERE num = prev1 AND num = prev2;

-- Self-join alternative (works without window functions, needs gap-free ids):
-- SELECT DISTINCT a.num AS consecutive_num
-- FROM logs a JOIN logs b ON b.id = a.id + 1
--             JOIN logs c ON c.id = a.id + 2
-- WHERE a.num = b.num AND b.num = c.num;`,
    sqlSchema:
`CREATE TABLE logs (id INTEGER PRIMARY KEY, num INTEGER);
INSERT INTO logs VALUES (1,1),(2,1),(3,1),(4,2),(5,1),(6,2),(7,2);`,
    sqlStarter:
      "-- Table: logs(id, num) — ids are consecutive\n" +
      "-- Column to return: consecutive_num (numbers appearing 3+ times in a row)\n" +
      "SELECT\n",
    sqlSolution:
`SELECT DISTINCT num AS consecutive_num
FROM (
    SELECT num,
           LAG(num, 1) OVER (ORDER BY id) AS prev1,
           LAG(num, 2) OVER (ORDER BY id) AS prev2
    FROM logs
) t
WHERE num = prev1 AND num = prev2;`,
    explanation:
      "LAG's first rows are NULL (no previous row) — and that's safe unprompted: NULL = num is " +
      "unknown, WHERE drops it. The DISTINCT matters — test 2's run of four 5s would emit 5 twice " +
      "without it. The self-join variant leans on ids being gap-free (id+1, id+2); LAG orders by " +
      "id but doesn't need arithmetic on it — say that trade-off. Follow-up to expect: 'runs of " +
      "length K' -> the gaps-and-islands trick (group by id - ROW_NUMBER() partitioned by num), " +
      "worth knowing by name.",
    tests: [
      {
        name: "Base case",
        orderMatters: false,
        expected: { columns: ["consecutive_num"], rows: [[1]] },
      },
      {
        name: "Run of four + separate run of three",
        orderMatters: false,
        schema:
`CREATE TABLE logs (id INTEGER PRIMARY KEY, num INTEGER);
INSERT INTO logs VALUES (1,5),(2,5),(3,5),(4,5),(5,3),(6,3),(7,3),(8,4);`,
        expected: { columns: ["consecutive_num"], rows: [[5], [3]] },
      },
      {
        name: "No runs at all",
        orderMatters: false,
        schema:
`CREATE TABLE logs (id INTEGER PRIMARY KEY, num INTEGER);
INSERT INTO logs VALUES (1,1),(2,2),(3,1),(4,2),(5,1),(6,1);`,
        expected: { columns: ["consecutive_num"], rows: [] },
      },
    ],
  },

  F52: {
    id: "F52",
    title: "SQL — Peak Concurrent Bookings",
    difficulty: "Hard",
    time: "25-30 min",
    tags: ["SQL", "Sweep Line", "Running Total"],
    type: "sql",
    statement:
      "Table <code>bookings(id, room, start_t, end_t)</code> (end exclusive — a booking ending " +
      "at 30 and one starting at 30 do not overlap). Return the maximum number of bookings " +
      "active at the same instant, as column <code>peak</code>. This is Meeting Rooms II " +
      "(Module 10) translated literally into SQL: +1/−1 events, running total, MAX.",
    examples:
      "bookings: (0..30), (5..10), (15..20)\n" +
      "-> peak = 2   (0..30 overlaps each of the others; they don't overlap each other)\n\n" +
      "back-to-back: (1..3), (3..5), (5..7)\n" +
      "-> peak = 1",
    hint: "UNION ALL starts as (t, +1) and ends as (t, -1); SUM(d) OVER (ORDER BY t, d) is the running room count — ordering by d second puts -1 before +1 on ties, exactly the Module 10 tie-break. Then MAX the running column.",
    solution:
`WITH events AS (
    SELECT start_t AS t, +1 AS d FROM bookings
    UNION ALL
    SELECT end_t   AS t, -1 AS d FROM bookings
),
running AS (
    SELECT SUM(d) OVER (ORDER BY t, d) AS concurrent   -- d asc: -1 before +1 on ties
    FROM events
)
SELECT MAX(concurrent) AS peak FROM running;`,
    sqlSchema:
`CREATE TABLE bookings (id INTEGER PRIMARY KEY, room TEXT, start_t INTEGER, end_t INTEGER);
INSERT INTO bookings VALUES (1,'A',0,30),(2,'B',5,10),(3,'C',15,20);`,
    sqlStarter:
      "-- Table: bookings(id, room, start_t, end_t) — end exclusive\n" +
      "-- Column to return: peak (max simultaneous bookings)\n" +
      "WITH\n",
    sqlSolution:
`WITH events AS (
    SELECT start_t AS t, +1 AS d FROM bookings
    UNION ALL
    SELECT end_t   AS t, -1 AS d FROM bookings
),
running AS (
    SELECT SUM(d) OVER (ORDER BY t, d) AS concurrent
    FROM events
)
SELECT MAX(concurrent) AS peak FROM running;`,
    explanation:
      "Recognize the algorithm under the SQL: this is the Module 10 sweep line, with the window's " +
      "ORDER BY t, d doing the (time, delta) tuple-sort tie-break — ends free their slot before " +
      "same-instant starts claim one, which is what test 2's back-to-back chain checks. Carrying " +
      "an algorithmic idea across languages like this is a strong interview move: 'this is a sweep " +
      "line; in SQL the running sum is a window function.' Also a clean showcase for CTEs — each " +
      "WITH block is one narratable step.",
    tests: [
      {
        name: "Overlapping bookings",
        orderMatters: true,
        expected: { columns: ["peak"], rows: [[2]] },
      },
      {
        name: "Back-to-back chain shares (end exclusive)",
        orderMatters: true,
        schema:
`CREATE TABLE bookings (id INTEGER PRIMARY KEY, room TEXT, start_t INTEGER, end_t INTEGER);
INSERT INTO bookings VALUES (1,'A',1,3),(2,'B',3,5),(3,'C',5,7);`,
        expected: { columns: ["peak"], rows: [[1]] },
      },
      {
        name: "Fully stacked",
        orderMatters: true,
        schema:
`CREATE TABLE bookings (id INTEGER PRIMARY KEY, room TEXT, start_t INTEGER, end_t INTEGER);
INSERT INTO bookings VALUES (1,'A',1,5),(2,'B',2,6),(3,'C',3,7),(4,'D',4,8);`,
        expected: { columns: ["peak"], rows: [[4]] },
      },
    ],
  },

  F53: {
    id: "F53",
    title: "Design — E-commerce Order System",
    difficulty: "Medium",
    time: "20-30 min",
    tags: ["Design", "Schema", "Normalization"],
    type: "design",
    statement:
      "Design the database schema for a small e-commerce platform: customers browse products, " +
      "place orders containing multiple products with quantities, and pay for them. Walk through " +
      "entities, relationships and cardinalities, tables with keys and constraints — then name " +
      "the indexes you'd add for the storefront's hot queries ('my recent orders', 'order " +
      "details page'). Prices change over time; historical orders must not.",
    examples:
      "Think out loud through the Module 13 recipe:\n" +
      "  1. nouns -> entities        2. verbs -> relationships + cardinalities\n" +
      "  3. tables + keys            4. constraints\n" +
      "  5. indexes from the workload\n" +
      "Target: ~5 tables. The price-snapshot requirement is the trap.",
    hint: "customer 1:N order, order N:M product — so order_items is a junction table WITH ITS OWN DATA: quantity and, critically, unit_price copied at purchase time (snapshot vs reference — Module 13 section 2).",
    solution:
`ENTITIES & RELATIONSHIPS
  customer (1) --- (N) order (1) --- (N) order_item (N) --- (1) product
  order (1) --- (0..N) payment

TABLES (Postgres-flavored)

CREATE TABLE customers (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email       TEXT NOT NULL UNIQUE,          -- natural key gets UNIQUE, not PK
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE products (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sku         TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),   -- CURRENT price
    is_active   BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE orders (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    status      TEXT NOT NULL DEFAULT 'cart'
                CHECK (status IN ('cart','placed','paid','shipped','cancelled')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (              -- N:M junction WITH data
    order_id    BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity    INT NOT NULL CHECK (quantity > 0),
    unit_price  NUMERIC(10,2) NOT NULL,  -- SNAPSHOT at purchase time (the trap)
    PRIMARY KEY (order_id, product_id)   -- composite PK = the uniqueness rule
);

CREATE TABLE payments (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id    BIGINT NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    amount      NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    method      TEXT NOT NULL,
    paid_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

INDEXES (driven by the stated workload)
  orders(customer_id, created_at DESC)  -- "my recent orders": equality first, sort second;
                                        -- the DESC matches newest-first pagination
  order_items(product_id)               -- reverse direction of the junction
                                        -- (order_id lookups ride the composite PK)
  payments(order_id)                    -- order details page
  -- FKs are NOT auto-indexed in Postgres — creating these is a real decision, say it.

DELIBERATE CHOICES TO NARRATE
  - unit_price snapshot: orders record history; products record the present.
    Deleting/repricing a product never corrupts past orders.
  - ON DELETE: CASCADE only cart->items; RESTRICT for anything with financial history.
  - Order total: computed from items (SUM); cache as a column only if reads demand it,
    and then name what keeps it honest.
  - status as CHECK-ed TEXT for the interview; mention ENUM / lookup table as options.`,
    explanation:
      "<p>Score yourself against the recipe: entities named before tables, every cardinality said out " +
      "loud, the junction table carrying quantity + <strong>snapshotted unit_price</strong> (the trap " +
      "planted in the statement), constraints beyond PKs, and indexes justified by the given queries " +
      "rather than sprinkled. The two follow-ups to pre-empt: 'product deleted?' — RESTRICT plus " +
      "is_active soft-delete keeps history intact; 'order total?' — derive it, don't store it, until " +
      "a measured read-path needs the cache (Module 13's denormalize-deliberately rule).</p>",
  },

  F54: {
    id: "F54",
    title: "Design — Indexing Strategy for a Slow Query Mix",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Design", "Indexes", "Performance"],
    type: "design",
    statement:
      "A table <code>orders(id, customer_id, status, created_at, total)</code> has 20 million " +
      "rows and three slow hot queries: " +
      "<code>Q1: WHERE customer_id = ? ORDER BY created_at DESC LIMIT 20</code> · " +
      "<code>Q2: WHERE status = 'pending' AND created_at &lt; now() - interval '1 hour'</code> · " +
      "<code>Q3: WHERE id = ?</code>. Inserts are heavy (thousands/min). Which indexes do you " +
      "add, in what column order, and which do you refuse to add? Include the clustered vs " +
      "non-clustered explanation an interviewer will ask for.",
    examples:
      "For each candidate index, argue:\n" +
      "  - which query it serves and how (equality? range? sort?)\n" +
      "  - column order and why (leftmost-prefix rule)\n" +
      "  - its write cost on a heavy-insert table\n" +
      "Then: which of Q1-Q3 needs NO new index at all?",
    hint: "Q3 is free (PK). Q1 wants equality-then-sort: (customer_id, created_at). Q2 filters a tiny slice of a low-cardinality column — think partial index. Refuse single-column indexes on status or created_at alone.",
    solution:
`Q3: WHERE id = ?
  -> NOTHING TO ADD. id is the PK — already indexed (and in MySQL/InnoDB it IS the
     clustered index: the table is physically ordered by it, lookup lands on the row).

Q1: WHERE customer_id = ? ORDER BY created_at DESC LIMIT 20
  -> CREATE INDEX ON orders (customer_id, created_at DESC);
     Equality column first, sort column second (leftmost-prefix rule): the index
     pins one customer, then already stores their orders date-sorted — the LIMIT 20
     walks 20 index entries, no sort step at all.
     Wrong order (created_at, customer_id) would scan every recent order of ALL
     customers, filtering as it goes.

Q2: WHERE status = 'pending' AND created_at < now() - interval '1 hour'
  -> status alone is a terrible index (a handful of values over 20M rows), BUT
     'pending' is a tiny, constantly-queried slice. Postgres answer — partial index:
       CREATE INDEX ON orders (created_at) WHERE status = 'pending';
     Small (only pending rows), stays hot in cache, and rows leave the index when
     they leave 'pending'. Without partial-index support: (status, created_at) —
     equality first, range second — and say why status-only is refused.

REFUSED, and the reasons:
  - single-column index on status: low selectivity, optimizer will often ignore it
  - single-column index on created_at: serves neither hot query better than the above
  - covering everything "just in case": inserts are heavy — every index is a write
    tax on every INSERT; unused indexes are pure cost (find them via pg_stat_user_indexes)

CLUSTERED VS NON-CLUSTERED (the expected follow-up)
  Clustered: the table itself, physically ordered by the key — one per table,
  lookups land directly on the row, range scans on the key are sequential reads.
  Non-clustered: separate structure of key -> pointer/PK; many allowed; each hit
  pays an extra hop to fetch the row.
  Nuance for Odoo: Postgres has no persistent clustered index — tables are heaps,
  ALL indexes are secondary; CLUSTER sorts once but doesn't stay sorted.

VERIFY: EXPLAIN (ANALYZE, BUFFERS) before and after each index — measuring beats
guessing, and saying so is part of the answer.`,
    explanation:
      "<p>The grading rubric hiding in this question: (1) noticing Q3 is already served by the PK; " +
      "(2) column order on the composite — equality first, then the range/sort column, with the " +
      "leftmost-prefix rule as the reason; (3) recognizing status as low-selectivity and reaching " +
      "for a <strong>partial index</strong> (the answer that reads as senior); (4) refusing indexes " +
      "on a write-heavy table and saying what each one costs; (5) closing with EXPLAIN. The " +
      "clustered/non-clustered table is verbatim interview material for this process — deliver it " +
      "with the Postgres-heap nuance since Odoo runs Postgres.</p>",
  },

  F55: {
    id: "F55",
    title: "Design — Multi-Warehouse Inventory",
    difficulty: "Hard",
    time: "25-35 min",
    tags: ["Design", "Schema", "Concurrency"],
    type: "design",
    statement:
      "Design the data layer for multi-warehouse inventory (the domain Odoo lives in): products " +
      "are stocked in several warehouses; goods arrive, move between warehouses, and are sold; " +
      "stock must never go negative under concurrent checkouts. Cover: the schema, how 'current " +
      "stock' is computed (derive from movements vs store a quantity — argue it), the constraint " +
      "and locking story for oversell prevention, and indexes for 'stock of product X across " +
      "warehouses' and 'movement history of product X'.",
    examples:
      "The core tension to resolve explicitly:\n" +
      "  ledger (stock_moves)  = immutable truth, full audit, but SUM() to read\n" +
      "  balance (stock_levels)= O(1) reads, but a copy that can drift\n" +
      "Choose, or combine — and defend the write path under concurrency.",
    hint: "Ledger + cached balance is the production answer: append-only stock_moves as the source of truth, stock_levels(product_id, warehouse_id, quantity) maintained in the same transaction, UNIQUE on the pair, CHECK (quantity >= 0), and an atomic conditional UPDATE as the oversell gate.",
    solution:
`SCHEMA

CREATE TABLE products   (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         sku TEXT NOT NULL UNIQUE, name TEXT NOT NULL);
CREATE TABLE warehouses (id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         code TEXT NOT NULL UNIQUE, name TEXT NOT NULL);

-- 1. The LEDGER: append-only source of truth (this is how Odoo models stock)
CREATE TABLE stock_moves (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id   BIGINT NOT NULL REFERENCES products(id),
    from_wh      BIGINT REFERENCES warehouses(id),     -- NULL = supplier (inbound)
    to_wh        BIGINT REFERENCES warehouses(id),     -- NULL = customer (outbound)
    quantity     INT NOT NULL CHECK (quantity > 0),
    moved_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (from_wh IS NOT NULL OR to_wh IS NOT NULL)   -- at least one side real
);
-- one row type models all three flows: purchase (NULL->wh), transfer (wh->wh),
-- sale (wh->NULL). Rows are never UPDATEd; corrections are compensating moves.

-- 2. The BALANCE: cached current stock, maintained in the same transaction
CREATE TABLE stock_levels (
    product_id   BIGINT NOT NULL REFERENCES products(id),
    warehouse_id BIGINT NOT NULL REFERENCES warehouses(id),
    quantity     INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),  -- last line of defense
    PRIMARY KEY (product_id, warehouse_id)
);

WHY BOTH (the argued trade-off)
  ledger only:  perfect audit, no drift — but "current stock" is a SUM over
                millions of rows on the hottest read path
  balance only: fast — but oversell bugs and no history
  both:         ledger is truth, balance is a derived cache updated in the SAME
                transaction; a nightly job re-derives balances and alerts on drift

THE OVERSELL GATE (concurrency — the heart of the question)
  BEGIN;
    UPDATE stock_levels
       SET quantity = quantity - :qty
     WHERE product_id = :p AND warehouse_id = :w AND quantity >= :qty;
    -- 0 rows affected -> insufficient stock -> ROLLBACK, tell the user
    INSERT INTO stock_moves (product_id, from_wh, to_wh, quantity)
         VALUES (:p, :w, NULL, :qty);
  COMMIT;
  Three defense layers, weakest-first:
    1. the conditional UPDATE is atomic — two racing checkouts serialize on the
       row lock; the slower one sees the decremented value and matches 0 rows
    2. CHECK (quantity >= 0) backstops any code path that forgets the WHERE
    3. SELECT ... FOR UPDATE variant if multiple rows must be locked together
       (lock ordering by (product_id, warehouse_id) to avoid deadlocks)

INDEXES
  stock_levels: PK (product_id, warehouse_id) already serves
                "stock of product X across warehouses" (leftmost prefix)
  stock_moves (product_id, moved_at DESC)  -- movement history, newest first
  stock_moves (to_wh),  stock_moves (from_wh)  -- per-warehouse activity; FKs are
                                               -- not auto-indexed in Postgres
RESERVATIONS (pre-empt the follow-up)
  Cart holds / pending orders: a reserved quantity column (or reservation rows
  with expiry) so available = quantity - reserved; same conditional-UPDATE gate.`,
    explanation:
      "<p>This is the most Odoo-shaped question in the course — Odoo's own stock module is exactly " +
      "a <code>stock.move</code> ledger with computed quantities. The answer's spine: " +
      "<strong>ledger = truth, balance = cache, both written in one transaction</strong>, and the " +
      "oversell gate as an atomic conditional UPDATE whose affected-row count is the yes/no — not a " +
      "read-then-write, which races. If you said 'check the stock with a SELECT, then UPDATE if " +
      "enough', that's the planted failure: two checkouts both read 1, both pass, stock hits −1 " +
      "(Module 13 section 5). The NULL-endpoint trick on moves (supplier→wh, wh→customer) keeps one " +
      "table modeling purchases, transfers and sales — mention it and the interviewer knows you've " +
      "modeled real systems.</p>",
  },

  F56: {
    id: "F56",
    title: "LRU Cache",
    difficulty: "Hard",
    time: "25-30 min",
    tags: ["OOP", "Hash Map", "Design a Structure"],
    type: "python",
    statement:
      "Implement an LRU (least-recently-used) cache and drive it through an operation " +
      "sequence: <code>lru_run(capacity, ops, args)</code> where <code>ops</code> is a list of " +
      "<code>\"put\"</code>/<code>\"get\"</code> and <code>args[i]</code> holds " +
      "<code>[key, value]</code> or <code>[key]</code>. Return one result per op: " +
      "<code>None</code> for put, the value or <code>-1</code> for get. Both operations must be " +
      "O(1) — and both count as 'use': get and put refresh recency. The single most-asked " +
      "design-a-structure question in existence.",
    examples:
      "capacity=2\n" +
      "put(1,1) put(2,2) get(1)->1 put(3,3)   # 3 evicts 2, because get(1) refreshed 1\n" +
      "get(2)->-1 put(4,4)                    # 4 evicts 1\n" +
      "get(1)->-1 get(3)->3 get(4)->4",
    hint: "You need O(1) lookup (hash map) AND O(1) reorder/evict (doubly linked list) — or Python's OrderedDict, which is exactly that pairing: move_to_end(key) refreshes, popitem(last=False) evicts oldest. Name the DLL+dict design even if you use OrderedDict.",
    functionName: "lru_run",
    signature: "lru_run(capacity: int, ops: list[str], args: list[list]) -> list",
    starter:
      "def lru_run(capacity, ops, args):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import OrderedDict

def lru_run(capacity: int, ops: list, args: list) -> list:
    cache = OrderedDict()          # dict + doubly-linked order, in one type
    out = []
    for op, a in zip(ops, args):
        if op == "put":
            key, value = a
            if key in cache:
                cache.move_to_end(key)     # refresh recency
            cache[key] = value
            if len(cache) > capacity:
                cache.popitem(last=False)  # evict least-recently used
            out.append(None)
        else:                              # get
            key = a[0]
            if key in cache:
                cache.move_to_end(key)     # get is a "use" too!
                out.append(cache[key])
            else:
                out.append(-1)
    return out`,
    explanation:
      "The design insight (say it before coding): a hash map alone can't order, a list alone " +
      "can't O(1)-lookup — the classic answer welds a dict onto a doubly linked list, where the " +
      "dict values are DLL nodes; OrderedDict is that structure shipped in the stdlib (and " +
      "saying so, plus offering to hand-roll the DLL if they want, is the ideal move). The two " +
      "planted bugs the tests catch: forgetting that get() refreshes recency (test 4), and " +
      "forgetting that put() on an EXISTING key refreshes without evicting (test 3).",
    tests: [
      {
        args: [2, ["put", "put", "get", "put", "get", "put", "get", "get", "get"],
               [[1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]],
        expected: [null, null, 1, null, -1, null, -1, 3, 4],
      },
      {
        args: [1, ["put", "get", "put", "get", "get"],
               [[1, 1], [1], [2, 2], [1], [2]]],
        expected: [null, 1, null, -1, 2],
      },
      {
        args: [2, ["put", "put", "put", "put", "get", "get", "get"],
               [[1, 1], [2, 2], [1, 10], [3, 3], [1], [2], [3]]],
        expected: [null, null, null, null, 10, -1, 3],
      },
      {
        args: [2, ["put", "put", "get", "put", "get", "get", "get"],
               [[1, 1], [2, 2], [1], [3, 3], [2], [1], [3]]],
        expected: [null, null, 1, null, -1, 1, 3],
      },
    ],
  },

  F57: {
    id: "F57",
    title: "Time-Based Key-Value Store",
    difficulty: "Medium",
    time: "20-25 min",
    tags: ["OOP", "Binary Search", "Design a Structure"],
    type: "python",
    statement:
      "Implement a versioned key-value store: <code>set(key, value, timestamp)</code> stores a " +
      "version; <code>get(key, timestamp)</code> returns the value with the largest stored " +
      "timestamp ≤ the requested one, or <code>\"\"</code> if none. Drive it via " +
      "<code>timemap_run(ops, args)</code> (<code>None</code> per set, string per get). " +
      "Timestamps per key arrive strictly increasing — which is the sentence that should make " +
      "you shout 'binary search' (Module 6 meets Module 14).",
    examples:
      'set("foo","bar",1)\n' +
      'get("foo",1) -> "bar"\n' +
      'get("foo",3) -> "bar"    # largest ts <= 3 is 1\n' +
      'set("foo","bar2",4)\n' +
      'get("foo",4) -> "bar2"\n' +
      'get("foo",5) -> "bar2"',
    hint: "Per key, keep two parallel lists (timestamps, values) — appends keep them sorted for free since input timestamps increase. get = bisect_right(times, ts) - 1: the boundary-search 'rightmost element <= target' recipe verbatim.",
    functionName: "timemap_run",
    signature: "timemap_run(ops: list[str], args: list[list]) -> list",
    starter:
      "def timemap_run(ops, args):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`import bisect

def timemap_run(ops: list, args: list) -> list:
    store = {}                    # key -> ([timestamps], [values]), ts kept sorted
    out = []
    for op, a in zip(ops, args):
        if op == "set":
            key, value, ts = a
            times, values = store.setdefault(key, ([], []))
            times.append(ts)      # input guarantees increasing ts: append = sorted
            values.append(value)
            out.append(None)
        else:                     # get
            key, ts = a
            if key not in store:
                out.append("")
                continue
            times, values = store[key]
            i = bisect.bisect_right(times, ts)   # first index with time > ts
            out.append(values[i - 1] if i else "")
    return out`,
    explanation:
      "The interview is the reduction: 'largest timestamp <= T in a sorted list' is Module 6's " +
      "boundary search — bisect_right gives the first index AFTER the eligible ones, so i-1 is " +
      "the answer and i == 0 means 'asked before the first version' (test 3's edge). Volunteer " +
      "the follow-ups: if timestamps could arrive out of order, insert with insort or sort " +
      "lazily; if versions per key explode, this is exactly how MVCC storage and Git-style " +
      "snapshots think. O(1) set, O(log n) get.",
    tests: [
      {
        args: [["set", "get", "get", "set", "get", "get"],
               [["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]],
        expected: [null, "bar", "bar", null, "bar2", "bar2"],
      },
      {
        args: [["get", "set", "get", "get"],
               [["missing", 5], ["a", "x", 10], ["a", 5], ["a", 10]]],
        expected: ["", null, "", "x"],
      },
      {
        args: [["set", "set", "set", "get", "get", "get", "get", "get", "get", "get"],
               [["k", "v1", 1], ["k", "v2", 5], ["k", "v3", 9],
                ["k", 0], ["k", 1], ["k", 4], ["k", 5], ["k", 8], ["k", 9], ["k", 100]]],
        expected: [null, null, null, "", "v1", "v1", "v2", "v2", "v3", "v3"],
      },
    ],
  },

  F58: {
    id: "F58",
    title: "OOD — Design a Parking Lot",
    difficulty: "Medium",
    time: "20-30 min",
    tags: ["Design", "OOP", "Classic OOD"],
    type: "design",
    statement:
      "Object-model a multi-level parking lot: levels contain spots of sizes (motorcycle, " +
      "compact, large); vehicles of matching sizes park and leave; a ticket records each stay " +
      "and the fee is computed on exit — pricing rules will change often, per the product owner. " +
      "Produce the classes, their single responsibilities, where each invariant is enforced, " +
      "and walk one park-and-exit scenario end to end. The most common OOD warm-up there is.",
    examples:
      "Grade yourself on the Module 14 recipe:\n" +
      "  nouns -> classes, verbs -> methods\n" +
      "  one responsibility per class (no god-object ParkingLotManager!)\n" +
      "  volatile behavior (pricing, spot choice) -> Strategy objects\n" +
      "  each invariant lives inside the class owning the state\n" +
      "  one spoken end-to-end scenario",
    hint: "Entities: ParkingLot, Level, Spot, Vehicle (subtypes or a size enum), Ticket. 'Pricing rules change often' is a straight open/closed hint — PricingStrategy injected into the lot. Spot assignment policy is the second Strategy.",
    solution:
`CLASSES & RESPONSIBILITIES

Vehicle            size: Size (MOTORCYCLE < COMPACT < LARGE), plate
                   -- data object; @dataclass is perfect. Subclasses only if
                   -- behavior differs; a size enum usually beats an inheritance tree.

Spot               size, is_free, park(v)/leave()
                   -- OWNS the invariant "<= 1 vehicle, size must fit":
                   --   def park(self, v):
                   --       if not self.is_free or not self.fits(v): raise ...
                   -- fits(v): v.size <= self.size (motorcycle fits anywhere, etc.)

Level              ordered spots; find_spot(vehicle) -> Spot | None
                   -- just a container with a search; no pricing, no tickets.

Ticket             vehicle, spot, entry_time, exit_time
                   -- immutable record of one stay; closed exactly once (invariant here).

PricingStrategy    fee(ticket) -> amount        [ABC / Protocol]
  HourlyPricing, FlatDaily, WeekendPricing...
                   -- "pricing changes often" = open/closed: new rule, new class,
                   -- nothing reopened.

SpotAssignment     choose(levels, vehicle) -> Spot | None    [Strategy #2]
  FirstFit / BestFit (don't burn LARGE spots on motorcycles when compacts exist)

ParkingLot         levels, pricing: PricingStrategy, assignment: SpotAssignment
                   enter(vehicle) -> Ticket, exit(ticket) -> fee
                   -- orchestrates; owns no per-spot state. Both strategies INJECTED
                   -- (dependency inversion): ParkingLot(pricing=HourlyPricing()).

SCENARIO WALK (say this out loud)
  car arrives -> lot.enter(car)
    -> assignment.choose(levels, car) finds a free COMPACT
    -> spot.park(car)  [invariant checked where the state lives]
    -> Ticket(car, spot, now) returned
  car leaves -> lot.exit(ticket)
    -> ticket.close(now)  [second close raises]
    -> spot.leave()
    -> return pricing.fee(ticket)

FOLLOW-UPS TO PRE-EMPT
  - "full lot?"     enter() returns None / raises LotFull — decide and say it
  - "find my car"   dict plate -> ticket in the lot (O(1)), not a scan
  - "concurrency?"  two cars, one spot: park() must be atomic — lock per spot,
                    or CAS-style is_free flip; same race as Module 13's oversell
  - "EV charging?"  a spot FEATURE set, matched in fits() — composition again,
                    not a subclass explosion (EVCompactSpot, EVLargeSpot, ...)`,
    explanation:
      "<p>What separates a pass from a strong pass here: invariants placed <em>inside</em> the class " +
      "that owns the state (spot occupancy in Spot.park, ticket closure in Ticket.close) rather than " +
      "policed by the orchestrator; the two volatile behaviors (pricing, assignment) extracted as " +
      "injected strategies the moment the statement said 'rules will change often'; and a spoken " +
      "end-to-end scenario proving the pieces actually compose. The concurrency follow-up is the " +
      "same read-then-write race as Module 13's oversell gate — noticing that link out loud ties " +
      "your whole interview together.</p>",
  },

  F59: {
    id: "F59",
    title: "OOD — Notification Dispatch System",
    difficulty: "Medium",
    time: "20-25 min",
    tags: ["Design", "OOP", "Strategy", "Observer"],
    type: "design",
    statement:
      "Design the classes for an application's notification subsystem: events happen (order " +
      "shipped, payment failed), users receive notifications over the channels they've opted " +
      "into (email, SMS, push — more coming), templates render per channel, and a flaky " +
      "provider must not lose messages. Name the patterns you're using and why each earns " +
      "its place.",
    examples:
      "Three patterns are hiding in the prompt:\n" +
      "  'more channels coming'        -> ?\n" +
      "  'events happen, others react' -> ?\n" +
      "  'flaky provider'              -> not a pattern — an architecture decision\n" +
      "Sketch the classes, then trace one event to a user's phone.",
    hint: "Channels are Strategy (common send() interface, Factory/registry to pick), event->notification wiring is Observer (emitters must not know about notifications), and the flaky provider means dispatch enqueues instead of calling the provider inline (Module 15 queue thinking).",
    solution:
`THE CLASSES

Event              @dataclass: type ("order.shipped"), payload, occurred_at
                   -- pure data; producers create these and know NOTHING else.

EventBus           subscribe(event_type, handler), publish(event)     [OBSERVER]
                   -- decouples "order code" from "notification code": the order
                   -- module publishes; who listens is not its business.

NotificationService  the one subscriber that matters here:
                   on_event(event):
                     for user in recipients_for(event):
                       for channel_name in user.preferences.channels_for(event.type):
                         message = Template.render(event, channel_name, user)
                         queue.enqueue(channel_name, user, message)
                   -- decides WHO and ON WHICH CHANNELS; sends nothing itself.

Channel (ABC/Protocol)   send(user, message)                          [STRATEGY]
  EmailChannel, SmsChannel, PushChannel
                   -- one class per transport; adding WhatsApp = one new class +
                   -- one registry line (open/closed, verbatim).

CHANNELS = {"email": EmailChannel(), "sms": SmsChannel(), ...}        [FACTORY/registry]

UserPreferences    channels_for(event_type) -> ["email", "push"]
                   -- opt-ins are DATA (a user_channel_prefs table), not code.

Worker             pops queue -> CHANNELS[name].send(user, message)
                   -- retries with backoff on provider failure; after N failures
                   -- dead-letter + alert. The queue is WHY a flaky provider
                   -- can't lose messages or stall the request path.

TRACE (say it): order code -> bus.publish(Event("order.shipped", ...))
  -> NotificationService.on_event -> preferences say [email, push]
  -> two messages enqueued -> workers deliver; the SMS provider being down
  delays SMS retries only — email already went, order code never noticed.

WHY EACH PATTERN EARNS ITS PLACE (the actual question)
  Observer: producers must not import notification code — otherwise every
            feature grows a hard dependency on messaging.
  Strategy: transports share a verb (send) but nothing else; the if-chain
            over channel names is the alternative, and it reopens on every
            new channel.
  Queue:    inline sending couples user-facing latency and correctness to a
            third party's uptime. At-least-once + idempotency key (dedupe on
            event_id + user + channel UNIQUE) so retries can't double-send.`,
    explanation:
      "<p>The prompt is a pattern-recognition test: 'more channels coming' → Strategy behind a " +
      "registry; 'events happen, users receive' → Observer so producers stay ignorant of messaging; " +
      "'flaky provider' → not a GoF pattern at all but a queue with retries, dead-lettering, and an " +
      "idempotency UNIQUE — Module 15's at-least-once story landing inside an OOD question. " +
      "Preferences as data (a table, not subclasses) is the quiet fourth point graders look for. " +
      "If you reached for Singleton anywhere, revisit Module 14's note — the registry is just a " +
      "module-level dict.</p>",
  },

  F60: {
    id: "F60",
    title: "Refactor — The God Class",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Design", "SOLID", "Refactoring"],
    type: "design",
    statement:
      "Code review: a 900-line <code>OrderManager</code> validates carts, computes prices with " +
      "seasonal discount rules, charges cards through a hardcoded <code>StripeClient()</code> " +
      "it constructs itself, writes orders to the database with inline SQL, and sends " +
      "confirmation emails. Every sprint touches this file and merge conflicts are constant. " +
      "The tests hit the real Stripe sandbox. Diagnose with named principles, propose the " +
      "split, and explain what becomes testable and why.",
    examples:
      "Structure the answer as:\n" +
      "  1. diagnosis    - which SOLID letters are violated, evidence for each\n" +
      "  2. the split    - new classes, one responsibility each\n" +
      "  3. the wiring   - how they compose (injection, not construction)\n" +
      "  4. the payoff   - name a test you could not write before and now can",
    hint: "Count the 'reasons to change': validation rules, pricing rules, payment provider, storage, email templates — that's five, and SRP says it should be ~five classes. The hardcoded StripeClient() is the dependency-inversion violation and the direct cause of sandbox-hitting tests.",
    solution:
`1. DIAGNOSIS
  S violated - five unrelated reasons to change live in one class (validation,
               pricing, payment, persistence, email). The constant merge
               conflicts ARE the symptom: unrelated changes collide in one file.
  D violated - OrderManager constructs StripeClient() internally; you cannot
               substitute a fake, so tests hit the sandbox. Same story hiding
               in the inline SQL (no seam to fake the DB).
  O violated - "seasonal discount rules" inside the class means every new
               promotion reopens tested payment-adjacent code.

2. THE SPLIT (one reason to change each)
  CartValidator        validate(cart) -> list[Error]
  PricingEngine        total(cart, date) -> Money
                       discount rules injected as a list of DiscountRule
                       strategies -> new promo = new rule class, engine untouched
  PaymentGateway (Protocol)  charge(amount, method) -> PaymentResult
      StripeGateway    the ONLY class that imports stripe
  OrderRepository      save(order), get(id) - the ONLY class that speaks SQL
  OrderNotifier        confirmation(order) - templates + the email provider
  PlaceOrderService    ~20 lines of orchestration:
                       validate -> price -> charge -> save -> notify

3. THE WIRING (composition root, e.g. app startup)
  service = PlaceOrderService(
      validator=CartValidator(),
      pricing=PricingEngine(rules=[SeasonalDiscount(), BulkDiscount()]),
      gateway=StripeGateway(api_key=...),
      repo=PostgresOrderRepository(pool),
      notifier=EmailNotifier(smtp),
  )
  Depend on the Protocols, construct at the edge. No class news up its own
  collaborators anymore - that single change is what unlocks testing.

4. THE PAYOFF - tests that were impossible and now are unit tests
  - "declined card leaves no order row and sends no email":
      gateway = FakeGateway(result=DECLINED); repo = InMemoryRepo()
      run service; assert repo.empty and notifier.sent == []
      Before: unwritable without the Stripe sandbox and a real DB.
  - PricingEngine tested against a table of carts/dates - pure function, no IO.
  - Each discount rule tested alone; new rules can't break payment tests.

  ORDER OF OPERATIONS (they may probe): extract PaymentGateway FIRST -
  it's the seam that kills the sandbox dependency; then peel pricing,
  persistence, email in any order, behind tests as you go.`,
    explanation:
      "<p>This question grades vocabulary-under-evidence: not 'it violates SOLID' but <em>which</em> " +
      "letters, with the symptom as proof (merge conflicts ⇒ SRP; sandbox-hitting tests ⇒ DIP; " +
      "promo edits touching payment code ⇒ OCP). The split lands on roughly one class per reason " +
      "to change, glued by a thin orchestrator taking its collaborators via constructor injection. " +
      "The strongest closing move is naming a concrete test that flips from impossible to trivial — " +
      "'declined card leaves no order and no email' — because making that test writable is the " +
      "entire economic argument for the refactor.</p>",
  },

  F61: {
    id: "F61",
    title: "System Design — URL Shortener",
    difficulty: "Medium",
    time: "25-35 min",
    tags: ["Design", "System Design", "Caching"],
    type: "design",
    statement:
      "Design a URL shortener (bit.ly): create a short code for a long URL, redirect visitors, " +
      "count clicks, support 100M redirects/day and 1M new links/day. Run the full Module 15 " +
      "framework — requirements with arithmetic, API, data model with indexes, then the " +
      "redirect hot path and the click-counting write problem. The canonical first system-design " +
      "question; interviewers use it because every layer has a decision in it.",
    examples:
      "Do the arithmetic before anything else:\n" +
      "  100M redirects/day = ? QPS      1M creates/day = ? QPS\n" +
      "  read:write ratio = ?            -> which patterns does that ratio summon?\n" +
      "  storage: 1M links/day x 5 years x ~500B = ?",
    hint: "100M/86400 ≈ 1200 QPS reads vs ~12 QPS writes — a 100:1 read-heavy system: cache-aside on the redirect, and never let click counting put a synchronous write on the hot path.",
    solution:
`1. REQUIREMENTS & ARITHMETIC
  Functional: create link (custom alias optional), redirect, click counts.
  Scope cut out loud: no auth flows, no spam scanning today.
  Numbers: reads 100M/86400 ~ 1200 QPS (peak x3 ~ 4000). writes ~ 12 QPS.
           ratio ~100:1 -> cache earns its keep; one Postgres survives writes easily.
  Storage: 1M/day x 365 x 5yr x ~500B ~ 1 TB. One database, partitioning later.

2. API
  POST /links   {url, custom_alias?}         -> {code}
  GET  /{code}  -> 301/302 redirect
  GET  /links/{code}/stats                   -> {clicks, ...}

3. DATA MODEL
  links(id BIGINT PK, code TEXT UNIQUE, target TEXT, created_at, owner_id NULL)
  index: UNIQUE on code IS the hot-path index; nothing else needed day one.
  clicks: DO NOT write a row per click on the hot path (see 5).

4. CODE GENERATION (the classic fork - present both)
  a) base62(auto-increment id): zero collisions, 7 chars covers 3.5T links.
     Downside: sequential/guessable -> competitors can enumerate volume.
     Fix: XOR/permute the id before encoding, or...
  b) random 7-char base62: unguessable; collision chance tiny, so
     INSERT ... ON CONFLICT retry loop (the UNIQUE index is the referee -
     Module 13 constraint thinking, not an application-level check-then-insert).
  Custom aliases: same UNIQUE index arbitrates, first-come-first-served.

5. HOT PATH: REDIRECT (99%+ of traffic)
  GET /{code}: cache-aside in Redis (code -> target), TTL hours.
  ~1200 QPS with a >95% hit rate = a few dozen DB lookups/sec. Comfortable.
  301 vs 302: 301 is cached by browsers -> fewer hits BUT you lose click
  visibility and can't edit targets; product wants analytics -> 302/307.
  Saying that trade-off unprompted is a strong signal.

  CLICK COUNTING - never a synchronous INSERT per redirect. Options:
    - Redis INCR per code, flushed to Postgres every N seconds (cheap, ~exact)
    - or enqueue click events -> worker batches inserts (buys per-click
      analytics: referrer, geo) -- pick based on the stats requirement.
  Either way the redirect path does zero synchronous DB writes.

6. DEEP-DIVE ANSWERS TO HAVE READY
  Expiry: expires_at column; redirect checks it; nightly sweep deletes.
  Deletes/abuse: soft-delete flag; cache DELETE on write (aside invalidation).
  10x growth: stateless app tier scales flat; cache absorbs reads; writes
  still ~120 QPS - Postgres fine. Sharding (by hash(code)) is the LAST card,
  and say why: cross-shard joins die and ops cost jumps.
  Availability: cache down -> DB takes 1200 QPS point lookups on a UNIQUE
  index - degraded but alive (fail-open, Module 15).`,
    explanation:
      "<p>The rubric hiding inside: (1) the division — 100M/day is 1200 QPS, which reframes the " +
      "whole problem as 'medium read-heavy', not 'planet scale'; (2) letting the UNIQUE constraint " +
      "arbitrate code collisions instead of check-then-insert (the same race Module 13 kills with " +
      "atomic writes); (3) keeping every synchronous write off the redirect path — the Redis-INCR " +
      "flush or queued click events; (4) the 301-vs-302 trade-off, which is where product sense " +
      "meets HTTP mechanics. Escalate boxes only when a number demands it and this question is a " +
      "guaranteed pass.</p>",
  },

  F62: {
    id: "F62",
    title: "System Design — API Rate Limiter",
    difficulty: "Medium",
    time: "20-30 min",
    tags: ["Design", "System Design", "Redis"],
    type: "design",
    statement:
      "Design rate limiting for a public API: 100 requests/minute per API key, multiple " +
      "stateless app servers behind a load balancer, limit-exceeded responses must be cheap, " +
      "and the business wants to sell higher tiers later. Compare the candidate algorithms, " +
      "decide where the state lives, get the atomicity right, and answer the 'what if the " +
      "limiter's store dies?' question before it's asked.",
    examples:
      "The four decisions that make up the answer:\n" +
      "  1. algorithm: fixed window / sliding window / token bucket - trade-offs?\n" +
      "  2. state: why can't it live in app-server memory?\n" +
      "  3. atomicity: what races when two servers check the same key at once?\n" +
      "  4. failure: Redis down -> fail-open or fail-closed, and per what?",
    hint: "Servers are stateless, so counters live in Redis. Fixed window allows 2x bursts at boundaries; token bucket makes rate AND burst explicit knobs (and 'sell higher tiers' = per-key parameters, which token bucket models natively). Check-then-set races — the increment must be atomic (INCR or a Lua script).",
    solution:
`1. ALGORITHM CHOICE (know all three, pick with a reason)
  Fixed window   INCR counter per (key, minute-bucket); EXPIRE 60.
                 Cheapest. Flaw: 100 at 11:59:59 + 100 at 12:00:01 = 200 in
                 2 seconds (boundary burst).
  Sliding-window approximation
                 weight = overlap between "last 60s" and the two adjacent
                 fixed windows: count = cur + prev * overlap%. Two counters,
                 kills the boundary burst. Good default.
  Token bucket   bucket per key: capacity B (burst), refill r/sec (rate).
                 request takes a token; empty -> 429.
                 WHY IT WINS HERE: "sell higher tiers later" = per-key (r, B)
                 stored as data; rate and burst become product knobs.

2. WHERE STATE LIVES
  App-server memory fails immediately: N servers = N independent limits
  (LB spreads a key's requests), and every deploy resets counters.
  -> Redis: shared, fast (~0.1ms), TTLs for free. The limiter is a
  read-modify-write of a couple of integers per request.

3. ATOMICITY (the planted race)
  GET count; if count < limit then INCR  -- two servers interleave and both
  pass at count=99 -> 101 accepted. Same read-then-write race as the
  oversell gate (Module 13). Fixes:
    - fixed/sliding: INCR first, compare the RETURNED value (INCR is atomic);
      set EXPIRE only when the return value == 1 (first hit creates the window)
    - token bucket: one small Lua script = atomic refill-compute + take
      (store tokens + last_refill_ts; refill lazily on access - no cron).

4. FAILURE POLICY
  Redis down: fail-open (allow) for ordinary endpoints - availability over
  protection; fail-closed for expensive/abusable ones (auth attempts, SMS
  sending). Per-endpoint policy, stated up front. Circuit-break the Redis
  call with a short timeout so the limiter can never become the outage.

5. THE RESPONSE CONTRACT
  429 Too Many Requests + Retry-After (seconds) +
  X-RateLimit-Limit / -Remaining / -Reset headers - cheap to compute from
  the same counters, and it's what makes the API feel professional.

6. SCALE FOLLOW-UP
  One Redis handles ~100k ops/s - arithmetic first (Module 15): how many
  request/s do we actually see? If truly beyond one box: shard by API key
  (key affinity keeps each bucket on one shard - no cross-shard math).`,
    explanation:
      "<p>Four graded decisions: algorithm (token bucket, argued from the <em>business</em> line " +
      "about tiers — not from fashion), state placement (the stateless-servers premise forces " +
      "Redis; noticing that is the point of the premise), atomicity (the GET-then-INCR race is " +
      "planted; the answer is INCR-then-compare or a Lua script — Module 13's oversell gate in " +
      "Redis clothing), and failure policy (fail-open vs fail-closed <em>per endpoint class</em>, " +
      "chosen before the interviewer asks). The 429/Retry-After contract is the polish point most " +
      "candidates skip.</p>",
  },

  F63: {
    id: "F63",
    title: "System Design — Background Job Queue",
    difficulty: "Hard",
    time: "30-40 min",
    tags: ["Design", "System Design", "Postgres", "Concurrency"],
    type: "design",
    statement:
      "Design a background job system on top of PostgreSQL (no Kafka/RabbitMQ — the team wants " +
      "one database): API servers enqueue work (send email, generate PDF, sync to ERP); worker " +
      "processes execute it with retries and backoff; a crashed worker must not lose or wedge " +
      "its job; the same job must never run twice concurrently; failed jobs need visibility. " +
      "Schema, the claim query, the crash story, retries, and when this design runs out of road.",
    examples:
      "The heart of the question is one query:\n" +
      "  how do 10 workers each claim a DIFFERENT pending job,\n" +
      "  without blocking each other, and without any job being claimed twice?\n" +
      "(If you know the two magic words in Postgres, say them early.)",
    hint: "SELECT ... FOR UPDATE SKIP LOCKED is the whole trick — row locks make claims exclusive, SKIP LOCKED makes workers leap over each other's locks instead of queueing behind them. Crash recovery = a locked_until lease, not a lock held over the job's runtime.",
    solution:
`1. SCHEMA
  jobs (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kind          TEXT NOT NULL,              -- 'email.send', 'pdf.render'
    payload       JSONB NOT NULL,
    status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','running','done','failed','dead')),
    run_at        TIMESTAMPTZ NOT NULL DEFAULT now(),   -- delay/backoff lever
    attempts      INT NOT NULL DEFAULT 0,
    max_attempts  INT NOT NULL DEFAULT 5,
    locked_until  TIMESTAMPTZ,                -- the LEASE (see crash story)
    last_error    TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  INDEX (status, run_at)  -- exactly the claim query's shape (partial index
                          -- WHERE status='pending' is the senior variant)

2. THE CLAIM QUERY (the heart)
  UPDATE jobs SET status='running', attempts = attempts + 1,
                  locked_until = now() + interval '10 minutes'
  WHERE id = (
    SELECT id FROM jobs
    WHERE status = 'pending' AND run_at <= now()
    ORDER BY run_at
    LIMIT 1
    FOR UPDATE SKIP LOCKED          -- the two magic words
  )
  RETURNING *;
  FOR UPDATE: claiming is exclusive - no double-claim, ever.
  SKIP LOCKED: 10 workers don't serialize behind one row lock; each vaults
  to the next unclaimed job. Without it, workers convoy and throughput dies.
  (This exact pattern is how Postgres-backed queues - and Odoo's own job
  runners - are built. Saying so lands well in this room.)

3. CRASH STORY (why locked_until is a lease, not a lock)
  Worker dies mid-job: its transaction's row lock vanished at crash, but
  status='running' would wedge forever. The lease fixes it: a reaper query
    UPDATE jobs SET status='pending'
    WHERE status='running' AND locked_until < now();
  requeues expired leases. Long jobs heartbeat (extend locked_until).
  CONSEQUENCE: a job can run TWICE (worker finished but died before marking
  done; lease expired). That's at-least-once -> handlers MUST be idempotent:
  natural idempotency (PDF overwrite), or an idempotency key
  (UNIQUE(kind, payload->>'dedup_key')) - Module 15's rule made concrete.

4. RETRIES & FAILURE VISIBILITY
  Handler throws -> status='pending', run_at = now() + backoff:
  backoff = base * 2^attempts + jitter (jitter breaks retry stampedes).
  attempts >= max_attempts -> status='dead' (dead-letter): a queryable
  table of failures with last_error - the "visibility" requirement is a
  WHERE status='dead' dashboard, free because we're in SQL.

5. WHEN THIS RUNS OUT OF ROAD (they will ask)
  Comfortable to ~1-5k jobs/sec claimed; beyond that the contention point
  is the hot (status, run_at) index. Escalations in order:
  partial index -> separate queue DB -> then a real broker. The honest
  pitch: same transaction as your business data (enqueue atomically with
  the order INSERT - the outbox problem disappears), zero new
  infrastructure, SQL-queryable state. That trade is right for almost
  everyone below big-tech scale.`,
    explanation:
      "<p>One Postgres feature carries the whole design: <code>FOR UPDATE SKIP LOCKED</code> — " +
      "exclusive claims without worker convoys. Around it, the graded parts: the <strong>lease</strong> " +
      "(locked_until) instead of a held lock, which converts crashes into delayed retries and " +
      "forces the at-least-once ⇒ idempotent-handler conclusion; exponential backoff with jitter; " +
      "a dead state that makes failure a queryable fact; and the honest ceiling ('when do we need " +
      "a real broker?') answered with a number instead of a shrug. Enqueueing in the same " +
      "transaction as the business write is the quiet killer argument — the outbox pattern for " +
      "free. Odoo's own queue runners work exactly this way, which your interviewer likely knows.</p>",
  },

  F64: {
    id: "F64",
    title: "System Design — Activity Feed (Fanout)",
    difficulty: "Hard",
    time: "30-40 min",
    tags: ["Design", "System Design", "Fanout", "Pagination"],
    type: "design",
    statement:
      "Design the feed for a social app: users follow users; posting makes the post appear in " +
      "followers' feeds; a user opens the app and reads their feed newest-first with infinite " +
      "scroll; median user has 200 followers, a few accounts have 5M. Decide push vs pull vs " +
      "hybrid with arithmetic, design the tables for both paths, and get pagination right. " +
      "The question every fanout discussion is secretly about.",
    examples:
      "The tension to resolve with numbers, not vibes:\n" +
      "  PUSH (write fanout): post -> insert into every follower's feed\n" +
      "     median cost: 200 rows. celebrity cost: 5,000,000 rows. per post!\n" +
      "  PULL (read fanout): feed = merge posts of ~200 followees at read time\n" +
      "  Which side does each user class belong on, and why?",
    hint: "Hybrid is the answer to defend: push for normal accounts (200 inserts is nothing, reads become one indexed scan), pull for the 5M-follower accounts (a post must not trigger 5M writes), merge the two at read time. Pagination: cursor on (created_at, id) — never OFFSET (Module 15).",
    solution:
`1. TABLES
  follows (follower_id, followee_id, PRIMARY KEY (follower_id, followee_id))
    + INDEX (followee_id)            -- "who follows X" = fanout direction
  posts (id, author_id, body, created_at)
    + INDEX (author_id, created_at DESC)   -- pull path: an author's recents
  feed_items (user_id, post_id, created_at,
              PRIMARY KEY (user_id, post_id))       -- also makes re-fanout idempotent
    + INDEX (user_id, created_at DESC, post_id)     -- the read query's exact shape
    -- the PUSH materialization: one row = "this post is in this user's feed";
    -- the covering index IS the feed query's shape (Module 13 thinking). (DESC
    -- can't live inside a PK constraint - only in an index definition.)

2. THE DECISION, WITH ARITHMETIC
  Push-only: median post -> 200 feed_items inserts (queued, cheap; reads
    become ONE indexed range scan - perfect). Celebrity post -> 5M inserts:
    minutes of write storm per tweet. Unacceptable.
  Pull-only: every feed open merges ~200 authors' recent posts - K sorted
    streams (Module 11's k-way merge, in SQL: WHERE author_id IN (...)
    ORDER BY created_at DESC LIMIT 20 on the (author_id, created_at) index).
    Works, but the hottest path (feed open) does the most work, every time.
  HYBRID (the defended answer):
    accounts under a threshold (say 10k followers) -> push via queue workers
    celebrity accounts -> flagged is_celebrity; their posts are NOT fanned out
    feed read = feed_items scan MERGED with pull of followed celebrities'
    recent posts (user follows maybe 3 celebrities - tiny pull).
  The threshold is a tunable, not a constant - say that.

3. WRITE PATH (push side)
  post INSERT -> enqueue fanout job (the F63 job-queue design) -> workers page
  through followers (keyset on follower_id, batches of ~1000) -> batch
  INSERT feed_items. At-least-once queue -> PK (user_id, ..., post_id)
  makes duplicate fanout idempotent: ON CONFLICT DO NOTHING.

4. READ PATH & PAGINATION
  Cursor, never OFFSET (page drift + scan-and-discard - Module 15):
    WHERE user_id = ? AND (created_at, post_id) < (:cursor_ts, :cursor_id)
    ORDER BY created_at DESC, post_id DESC LIMIT 20
  - the feed_items PK serves this with a pure index seek at any depth.
  Cache the first page per active user (it's 90% of reads); invalidate
  lazily - a feed being seconds stale is invisible.

5. FOLLOW-UPS TO HAVE LOADED
  New follow: backfill their feed with the followee's recent posts? Usually
    just start from now (cheap honesty - say the product call).
  Unfollow/delete: delete feed_items lazily / filter at read - eager
    cleanup of 5M rows is the same storm in reverse.
  Retention: feed_items is a CACHE, not truth (posts table is truth) - cap
    at ~800 items/user, TTL the tail; rebuildable from the pull path.
  "Why not just pull for everyone?" - fine at small scale, say so! The
    hybrid earns its complexity only when read QPS demands it (Module 15's
    golden habit: complexity must be paid for by a number).`,
    explanation:
      "<p>The whole question is one asymmetry: fanout cost is follower-count at <em>write</em> time " +
      "(push) or followee-count at <em>read</em> time (pull) — and the two user classes sit on " +
      "opposite sides of that trade, hence hybrid with a follower-count threshold. Around the core: " +
      "feed_items as a rebuildable cache whose primary key IS the read query (Module 13), fanout " +
      "riding the F63 job queue with ON CONFLICT making at-least-once idempotent, and cursor " +
      "pagination as the only sane infinite scroll. Admitting pull-only suffices at small scale " +
      "before defending the hybrid is what makes the answer sound experienced rather than " +
      "rehearsed.</p>",
  },

  F65: {
    id: "F65",
    title: "System Design — Appointment Booking",
    difficulty: "Hard",
    time: "30-40 min",
    tags: ["Design", "System Design", "Concurrency", "Postgres"],
    type: "design",
    statement:
      "Design booking for a clinic chain: providers publish availability (working hours, " +
      "variable appointment lengths), patients book/cancel/reschedule, and a slot must " +
      "never be double-booked — under concurrent requests, ever. Model availability " +
      "(discrete slots vs open intervals — argue it), design the double-booking defense in " +
      "layers, and handle time zones like someone who has been burned. The most " +
      "Odoo-adjacent system-design question in the set.",
    examples:
      "The three hard parts, in order:\n" +
      "  1. availability model: pre-generated slot rows vs (start,end) intervals?\n" +
      "  2. the race: two patients grab the last Tuesday 10:00 simultaneously\n" +
      "  3. the follow-up you should see coming: 'what about variable-length\n" +
      "     appointments that OVERLAP arbitrary slots?'",
    hint: "Discrete slots + UNIQUE constraint is the robust core: booking = UPDATE ... WHERE status='free' (atomic claim, 0 rows = lost the race — the F55 oversell gate again). For variable-length intervals, Postgres has the expert answer: EXCLUDE USING gist with && on a time range.",
    solution:
`1. AVAILABILITY MODEL - argue both, pick slots
  A) INTERVALS: provider_hours (provider, weekday, start, end) and bookings
     hold (start_t, end_t); "free" is computed by subtraction.
     + flexible lengths native   - overlap logic on every read AND write
  B) DISCRETE SLOTS (chosen): a generator materializes slot rows from
     working-hours templates, e.g. 30-min grid, N weeks ahead:
     slots (
       id BIGINT PK,
       provider_id BIGINT NOT NULL REFERENCES providers(id),
       starts_at   TIMESTAMPTZ NOT NULL,     -- UTC. ALWAYS UTC. see (4)
       duration    INTERVAL NOT NULL,
       status      TEXT NOT NULL DEFAULT 'free'
                   CHECK (status IN ('free','held','booked','blocked')),
       version     INT NOT NULL DEFAULT 0,
       UNIQUE (provider_id, starts_at)       -- defense layer 0
     )
     bookings (id PK, slot_id UNIQUE REFERENCES slots, patient_id, state, ...)
     + reads are trivial (WHERE status='free'), the race becomes ONE row
     + slot_id UNIQUE in bookings = a slot can't have two bookings, by schema
     - variable lengths need the upgrade in (3)

2. THE DOUBLE-BOOKING DEFENSE (layers, innermost = strongest)
  BEGIN;
    UPDATE slots SET status='booked', version=version+1
     WHERE id=:slot AND status='free';      -- atomic claim
    -- 0 rows affected -> someone won the race -> ROLLBACK, "slot taken"
    INSERT INTO bookings (slot_id, patient_id, state) VALUES (...,'confirmed');
  COMMIT;
  Layer 1: conditional UPDATE - the read-check lives INSIDE the write
           (never SELECT-then-UPDATE: both patients see 'free' - F55's race).
  Layer 2: bookings.slot_id UNIQUE - even buggy code paths can't double-book.
  Layer 3 (holds): patient picks a slot -> status='held' + expires_at
           (5 min) while they pay; reaper frees expired holds. Same
           lease idea as F63's locked_until.

3. VARIABLE-LENGTH / OVERLAP FOLLOW-UP (the expert card)
  A 45-min booking spans 1.5 grid slots - grid breaks. Postgres answer:
    bookings (provider_id, period TSTZRANGE NOT NULL, ...)
    EXCLUDE USING gist (provider_id WITH =, period WITH &&)
  (needs CREATE EXTENSION btree_gist - plain GiST has no '=' opclass
  for scalar columns like provider_id; interviewers probe this)
  - the DATABASE rejects any two bookings whose ranges overlap for the
  same provider: it's UNIQUE generalized to intervals. Under the hood
  that's Module 10's interval-overlap check enforced by an index.
  Claiming still atomic: INSERT and catch the exclusion violation.

4. TIME ZONES (where real systems bleed)
  Store TIMESTAMPTZ (UTC instants). Render in clinic's zone. The trap:
  "every Tuesday 09:00" is a LOCAL rule - store the recurrence as
  (weekday, local time, zone) and materialize to UTC instants per date,
  or DST week shifts every appointment by an hour. Slot generation is
  where that conversion lives - one place, tested.

5. THE REST OF THE FRAME (brief, from Module 15)
  API: GET /providers/:id/slots?from&to / POST /bookings {slot_id}
       (idempotency key on POST - double-click safe)
  Cancel: booking state machine (confirmed -> cancelled), slot back to
       'free'; reschedule = cancel + book new atomically in one txn.
  Reminders: F63's job queue, run_at = starts_at - 24h; cancel dequeues.
  Scale: bookings are low-QPS writes; reads cached per provider-day with
       delete-on-write. Postgres yawns at clinic-chain scale - say it.`,
    explanation:
      "<p>The spine is the same atomic-claim gate as F55's inventory and F62's limiter — by this " +
      "point in the course you should be recognizing it on sight: the check must live inside the " +
      "write (conditional UPDATE, 0 rows = lost), backstopped by a constraint the application " +
      "can't bypass. The two differentiators here: the slots-vs-intervals argument (slots for " +
      "robustness, then the <code>EXCLUDE USING gist</code> range-overlap constraint as the " +
      "variable-length upgrade — a genuinely senior Postgres card), and treating time zones as a " +
      "materialization concern (local recurrence rules → UTC instants in exactly one tested " +
      "place). Holds-with-expiry is F63's lease wearing a lab coat. Odoo ships appointment " +
      "scheduling, so expect sharp follow-ups here.</p>",
  },

  // ============================================================
  // PS1 — M1 RECAP: stage-1 classics with fresh values
  // ============================================================

  F66: {
    id: "F66",
    title: "Two Sum, Unsorted",
    difficulty: "Easy",
    time: "5-8 min",
    tags: ["Array", "Hash Map", "Recap"],
    type: "python",
    statement:
      "Write <code>two_sum(nums, target)</code> — return the <em>indices</em> of the two numbers " +
      "that add up to <code>target</code>, as a list in increasing order. Exactly one valid pair " +
      "exists; you may not use the same element twice. The stage-1 opener: one pass, a hash map " +
      "from value to index, check <code>target - x</code> before inserting x.",
    examples:
      "Input:  nums=[3,9,12,20], target=32   -> [2, 3]   (12 + 20)\n" +
      "Input:  nums=[7,2,5],     target=9    -> [0, 1]   (7 + 2)\n" +
      "Input:  nums=[-4,1,8],    target=4    -> [0, 2]   (-4 + 8)\n" +
      "Input:  nums=[5,5,3],     target=10   -> [0, 1]   (duplicates are two different indices)",
    hint: "seen = {value: index}. For each x at i, if target-x is in seen you're done; otherwise store x. Checking before inserting is what makes the duplicate case work.",
    functionName: "two_sum",
    signature: "two_sum(nums: list[int], target: int) -> list[int]",
    starter:
      "def two_sum(nums, target):\n" +
      "    pass\n",
    solution:
`def two_sum(nums, target):
    seen = {}                      # value -> index
    for i, x in enumerate(nums):
        j = seen.get(target - x)
        if j is not None:
            return [j, i]          # j was stored earlier, so j < i
        seen[x] = i                # not found yet: remember this value
    return []`,
    explanation:
      "O(n) time, O(n) space, one pass. The check-before-insert order matters twice: it makes " +
      "[5,5] with target 10 work (the second 5 finds the first), and it prevents matching an " +
      "element with itself. Follow-up to expect: 'what if the array is sorted?' — then two " +
      "pointers from both ends give O(1) space, which is stage-1 Module 5 material.",
    tests: [
      { args: [[3, 9, 12, 20], 32], expected: [2, 3] },
      { args: [[7, 2, 5], 9], expected: [0, 1] },
      { args: [[-4, 1, 8], 4], expected: [0, 2] },
      { args: [[5, 5, 3], 10], expected: [0, 1] },
      { args: [[1, 2], 3], expected: [0, 1] },
      { args: [[10, 26, 30, 31, 47, 60], 40], expected: [0, 2] },
    ],
  },

  F67: {
    id: "F67",
    title: "Valid Brackets",
    difficulty: "Easy",
    time: "5-8 min",
    tags: ["Stack", "Parsing", "Recap"],
    type: "python",
    statement:
      "Write <code>is_balanced(s)</code> — given a string of only <code>()[]{}</code>, return " +
      "whether every opener is closed by the matching closer in the right order. The stage-1 " +
      "stack classic: push openers, pop-and-match on closers, and don't forget the two sneaky " +
      "failure modes (closer with an empty stack, and leftovers at the end).",
    examples:
      "Input:  \"([]{})\"  -> True\n" +
      "Input:  \"([)]\"    -> False  (interleaved)\n" +
      "Input:  \"(((\"     -> False  (unclosed leftovers)\n" +
      "Input:  \")(\"      -> False  (closer first)\n" +
      "Input:  \"\"        -> True",
    hint: "pairs = {')':'(', ']':'[', '}':'{'}. On a closer, the stack must be non-empty AND its top must match. At the end, the stack must be empty.",
    functionName: "is_balanced",
    signature: "is_balanced(s: str) -> bool",
    starter:
      "def is_balanced(s):\n" +
      "    pass\n",
    solution:
`def is_balanced(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack`,
    explanation:
      "O(n) time, O(n) space. The three ways to fail — mismatched top, empty stack on a closer, " +
      "non-empty stack at the end — are exactly the three edge cases to narrate out loud. " +
      "Follow-ups: 'minimum removals to make it valid' (count the failures instead of bailing) " +
      "and 'longest valid substring' (stack of indices).",
    tests: [
      { args: ["([]{})"], expected: true },
      { args: ["([)]"], expected: false },
      { args: ["((("], expected: false },
      { args: [")("], expected: false },
      { args: [""], expected: true },
      { args: ["{[()]}"], expected: true },
      { args: ["[]{}()"], expected: true },
      { args: ["(]"], expected: false },
    ],
  },

  F68: {
    id: "F68",
    title: "First Unique Character",
    difficulty: "Easy",
    time: "5-8 min",
    tags: ["String", "Hash Map", "Counting", "Recap"],
    type: "python",
    statement:
      "Write <code>first_unique(s)</code> — return the index of the first character that appears " +
      "exactly once in <code>s</code>, or <code>-1</code> if there is none. Case-sensitive. " +
      "Two passes: count everything first, then scan for the first count-1 character — resist " +
      "the O(n²) urge to call <code>s.count(ch)</code> inside the loop.",
    examples:
      "Input:  \"odoocode\"   -> 4    ('c' — every o, d, e repeats)\n" +
      "Input:  \"interview\"  -> 1    ('n')\n" +
      "Input:  \"aabbcc\"     -> -1\n" +
      "Input:  \"z\"          -> 0",
    hint: "collections.Counter(s) in pass 1; then enumerate(s) and return the first i with count 1.",
    functionName: "first_unique",
    signature: "first_unique(s: str) -> int",
    starter:
      "def first_unique(s):\n" +
      "    pass\n",
    solution:
`def first_unique(s):
    from collections import Counter
    counts = Counter(s)
    for i, ch in enumerate(s):
        if counts[ch] == 1:
            return i
    return -1`,
    explanation:
      "O(n) time, O(k) space where k is the alphabet size. The interview point is recognizing " +
      "that s.count(ch) in a loop is O(n²) and saying so before the interviewer asks. " +
      "Order matters in pass 2 — you scan the *string*, not the counter, because dict order " +
      "reflects insertion, not position of the unique character.",
    tests: [
      { args: ["odoocode"], expected: 4 },
      { args: ["interview"], expected: 1 },
      { args: ["aabbcc"], expected: -1 },
      { args: ["z"], expected: 0 },
      { args: [""], expected: -1 },
      { args: ["abcabcx"], expected: 6 },
      { args: ["aA"], expected: 0 },
    ],
  },

  F69: {
    id: "F69",
    title: "Search Insert Position",
    difficulty: "Easy",
    time: "5-10 min",
    tags: ["Binary Search", "Recap"],
    type: "python",
    statement:
      "Write <code>search_insert(nums, target)</code> — <code>nums</code> is sorted ascending " +
      "with distinct values; return the index of <code>target</code> if present, otherwise the " +
      "index where it would be inserted to keep the order. O(log n) required. This is the " +
      "lower-bound binary search — the template with <code>lo &lt; hi</code> and a half-open " +
      "interval, or the classic inclusive template plus 'return lo'.",
    examples:
      "Input:  nums=[1,3,5,6], target=5  -> 2\n" +
      "Input:  nums=[1,3,5,6], target=2  -> 1\n" +
      "Input:  nums=[1,3,5,6], target=7  -> 4\n" +
      "Input:  nums=[],        target=3  -> 0",
    hint: "Inclusive template: lo, hi = 0, len(nums)-1; when the loop ends without finding, lo is exactly the insertion point. (Or: bisect_left does precisely this — name it, then write the loop.)",
    functionName: "search_insert",
    signature: "search_insert(nums: list[int], target: int) -> int",
    starter:
      "def search_insert(nums, target):\n" +
      "    pass\n",
    solution:
`def search_insert(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return lo   # loop invariant: everything < lo is smaller than target`,
    explanation:
      "The 'return lo' line is the whole question: when the loop exits, lo has crossed hi, and " +
      "the invariant (everything left of lo < target, everything right of hi > target) makes lo " +
      "the insertion point. If you can explain that invariant you've proven you understand the " +
      "template rather than memorized it — which is what the live interviewer is probing.",
    tests: [
      { args: [[1, 3, 5, 6], 5], expected: 2 },
      { args: [[1, 3, 5, 6], 2], expected: 1 },
      { args: [[1, 3, 5, 6], 7], expected: 4 },
      { args: [[1, 3, 5, 6], 0], expected: 0 },
      { args: [[], 3], expected: 0 },
      { args: [[1], 0], expected: 0 },
      { args: [[1], 2], expected: 1 },
    ],
  },

  F70: {
    id: "F70",
    title: "Best Window of Size K",
    difficulty: "Easy",
    time: "5-10 min",
    tags: ["Sliding Window", "Recap"],
    type: "python",
    statement:
      "Write <code>max_window_sum(nums, k)</code> — the maximum sum of any contiguous run of " +
      "exactly <code>k</code> elements (1 ≤ k ≤ len(nums)). The fixed-size window recap: compute " +
      "the first window once, then slide — add the entering element, subtract the leaving one. " +
      "Recomputing each window from scratch is the O(n·k) trap.",
    examples:
      "Input:  nums=[2,1,5,1,3,2], k=3   -> 9    (5+1+3)\n" +
      "Input:  nums=[1,-2,3,4,-1], k=2   -> 7    (3+4)\n" +
      "Input:  nums=[-3,-1,-2],    k=2   -> -3   (all-negative: initialize best to the FIRST window, not 0)",
    hint: "window = sum(nums[:k]); best = window; then for i in range(k, len(nums)): window += nums[i] - nums[i-k]. Initializing best = 0 is the all-negatives bug.",
    functionName: "max_window_sum",
    signature: "max_window_sum(nums: list[int], k: int) -> int",
    starter:
      "def max_window_sum(nums, k):\n" +
      "    pass\n",
    solution:
`def max_window_sum(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]
        if window > best:
            best = window
    return best`,
    explanation:
      "O(n) time, O(1) space. The narrated insight: consecutive windows overlap in k-1 elements, " +
      "so the delta is one in, one out. The classic bug is best = 0 — dead wrong when every " +
      "element is negative; initialize from the first real window. This warm-up is the base of " +
      "Module 3's variable-size windows, where 'exactly k' becomes an invariant you maintain.",
    tests: [
      { args: [[2, 1, 5, 1, 3, 2], 3], expected: 9 },
      { args: [[1, -2, 3, 4, -1], 2], expected: 7 },
      { args: [[-3, -1, -2], 2], expected: -3 },
      { args: [[5], 1], expected: 5 },
      { args: [[4, 4, 4, 4], 4], expected: 16 },
      { args: [[9, -1, -3, 8], 1], expected: 9 },
    ],
  },

  F71: {
    id: "F71",
    title: "SQL Recap — Department Headcount & Average",
    difficulty: "Easy",
    time: "8-12 min",
    tags: ["SQL", "GROUP BY", "HAVING", "Recap"],
    type: "sql",
    statement:
      "Table <code>employees(id, name, dept, salary)</code>. For every department with " +
      "<strong>at least 2 employees</strong>, return the department name, its headcount and its " +
      "average salary — columns <code>dept</code>, <code>headcount</code>, <code>avg_salary</code>, " +
      "ordered by average salary descending. The stage-1 SQL staples in one query: GROUP BY, " +
      "COUNT, AVG, HAVING (not WHERE!) for the group filter, ORDER BY on an aggregate.",
    examples:
      "employees: Ada/Eng/95k, Ben/Eng/85k, Fay/Eng/90k, Cleo/Sales/60k, Dan/Sales/70k, Eve/HR/55k\n" +
      "-> Engineering | 3 | 90000\n" +
      "   Sales       | 2 | 65000\n" +
      "(HR is filtered out: only 1 employee)",
    hint: "GROUP BY dept, then HAVING COUNT(*) >= 2 — the filter runs on groups, so WHERE can't do it. Alias the aggregates to match the required column names.",
    solution:
`-- HAVING filters groups after aggregation; WHERE filters rows before it.
SELECT dept,
       COUNT(*)    AS headcount,
       AVG(salary) AS avg_salary
FROM employees
GROUP BY dept
HAVING COUNT(*) >= 2
ORDER BY avg_salary DESC;`,
    sqlSchema:
`CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, dept TEXT, salary REAL);
INSERT INTO employees VALUES
 (1,'Ada','Engineering',95000),
 (2,'Ben','Engineering',85000),
 (3,'Cleo','Sales',60000),
 (4,'Dan','Sales',70000),
 (5,'Eve','HR',55000),
 (6,'Fay','Engineering',90000);`,
    sqlStarter:
      "-- Table: employees(id, name, dept, salary)\n" +
      "-- Columns to return: dept, headcount, avg_salary\n" +
      "SELECT\n",
    sqlSolution:
`SELECT dept,
       COUNT(*)    AS headcount,
       AVG(salary) AS avg_salary
FROM employees
GROUP BY dept
HAVING COUNT(*) >= 2
ORDER BY avg_salary DESC;`,
    explanation:
      "The WHERE-vs-HAVING distinction is the recap point: WHERE runs before grouping (it can't " +
      "see COUNT), HAVING runs after. The second fixture adds the NULL-salary wrinkle — AVG " +
      "ignores NULLs but COUNT(*) doesn't, so a 2-person department with one NULL salary still " +
      "qualifies and averages over the one real value. Mentioning that unprompted is stage-2 polish.",
    tests: [
      {
        name: "Main fixture: HR filtered out, ordered by avg desc",
        orderMatters: true,
        expected: {
          columns: ["dept", "headcount", "avg_salary"],
          rows: [["Engineering", 3, 90000], ["Sales", 2, 65000]],
        },
      },
      {
        name: "NULL salary: AVG ignores it, COUNT(*) does not",
        orderMatters: true,
        schema:
`CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, dept TEXT, salary REAL);
INSERT INTO employees VALUES
 (1,'Gil','Ops',NULL),
 (2,'Hana','Ops',80000),
 (3,'Ivan','Legal',75000);`,
        expected: {
          columns: ["dept", "headcount", "avg_salary"],
          rows: [["Ops", 2, 80000]],
        },
      },
    ],
  },

  // ============================================================
  // PS2 — M2 CRAFT DRILLS: easy on purpose — drill the template
  // ============================================================

  F72: {
    id: "F72",
    title: "Template Drill — FizzBuzz",
    difficulty: "Easy",
    time: "5 min",
    tags: ["Craft Drill", "Loops"],
    type: "python",
    statement:
      "Write <code>fizz_buzz(n)</code> — return the list of strings for 1..n where multiples of " +
      "3 become <code>\"Fizz\"</code>, multiples of 5 become <code>\"Buzz\"</code>, multiples of " +
      "both become <code>\"FizzBuzz\"</code>, and everything else is the number as a string. " +
      "<em>This is a craft drill:</em> the code is trivial, so spend your effort on Module 2's " +
      "template — restate, ask about n=0, narrate the divisibility-order decision, test out loud.",
    examples:
      "Input:  15 -> [\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]\n" +
      "Input:  0  -> []",
    hint: "Check the 15-case first (or build the string additively: s = 'Fizz' if i%3==0 else '' ... ). The bug everyone narrates their way out of: checking %3 before %15.",
    functionName: "fizz_buzz",
    signature: "fizz_buzz(n: int) -> list[str]",
    starter:
      "def fizz_buzz(n):\n" +
      "    pass\n",
    solution:
`def fizz_buzz(n):
    out = []
    for i in range(1, n + 1):
        s = ""
        if i % 3 == 0: s += "Fizz"
        if i % 5 == 0: s += "Buzz"
        out.append(s or str(i))
    return out`,
    explanation:
      "The additive-string version scales to 'and 7 -> Bazz' follow-ups without a combinatorial " +
      "if-chain — say that out loud, it's the only interesting thing in the problem. The real " +
      "deliverable here is a clean run of the 6-step template on trivial material.",
    tests: [
      { args: [15], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] },
      { args: [1], expected: ["1"] },
      { args: [3], expected: ["1", "2", "Fizz"] },
      { args: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] },
      { args: [0], expected: [] },
    ],
  },

  F73: {
    id: "F73",
    title: "Template Drill — Run-Length Encoding",
    difficulty: "Easy",
    time: "8-10 min",
    tags: ["Craft Drill", "String"],
    type: "python",
    statement:
      "Write <code>rle(s)</code> — compress consecutive runs of the same character into " +
      "<code>char + count</code>: <code>\"aaabbc\" → \"a3b2c1\"</code>. Case-sensitive; " +
      "single characters keep their count of 1; the empty string encodes to the empty string. " +
      "A Coderbyte classic and a perfect narration drill: the whole difficulty is the " +
      "off-by-one at the final run.",
    examples:
      "Input:  \"aaabbc\"       -> \"a3b2c1\"\n" +
      "Input:  \"AAAABBBCCDAA\" -> \"A4B3C2D1A2\"   (runs restart — 'A' appears twice)\n" +
      "Input:  \"abcd\"         -> \"a1b1c1d1\"\n" +
      "Input:  \"\"             -> \"\"",
    hint: "Walk the string comparing s[i] to s[i-1]; when the character changes, flush char+count. The classic bug: forgetting to flush the LAST run after the loop — narrate that before writing it.",
    functionName: "rle",
    signature: "rle(s: str) -> str",
    starter:
      "def rle(s):\n" +
      "    pass\n",
    solution:
`def rle(s):
    if not s:
        return ""
    out = []
    run_char, run_len = s[0], 1
    for ch in s[1:]:
        if ch == run_char:
            run_len += 1
        else:
            out.append(run_char + str(run_len))
            run_char, run_len = ch, 1
    out.append(run_char + str(run_len))   # flush the final run!
    return "".join(out)`,
    explanation:
      "O(n) time. Two things to say out loud: (1) the final flush after the loop — the single " +
      "most common bug in this problem; (2) building into a list and joining once, instead of " +
      "string += in a loop (quadratic in CPython's worst case). Follow-up: the decoder — " +
      "watch for multi-digit counts.",
    tests: [
      { args: ["aaabbc"], expected: "a3b2c1" },
      { args: ["AAAABBBCCDAA"], expected: "A4B3C2D1A2" },
      { args: ["abcd"], expected: "a1b1c1d1" },
      { args: [""], expected: "" },
      { args: ["zzzzzzzzzzzz"], expected: "z12" },
      { args: ["aaAA"], expected: "a2A2" },
    ],
  },

  F74: {
    id: "F74",
    title: "Template Drill — Missing Number",
    difficulty: "Easy",
    time: "5-8 min",
    tags: ["Craft Drill", "Math", "XOR"],
    type: "python",
    statement:
      "Write <code>missing_number(nums)</code> — <code>nums</code> contains n distinct numbers " +
      "from the range 0..n (so exactly one of the n+1 values is missing); return the missing one. " +
      "Solve it in O(n) time and O(1) space. There are two one-liner families — arithmetic " +
      "(expected sum minus actual sum) and XOR — and the interviewer will enjoy hearing you " +
      "name both. This drill is also your bridge into Module 2b's bit tricks.",
    examples:
      "Input:  [3,0,1]              -> 2\n" +
      "Input:  [0,1]                -> 2\n" +
      "Input:  [1]                  -> 0\n" +
      "Input:  [9,6,4,2,3,5,7,0,1]  -> 8",
    hint: "Gauss: n*(n+1)//2 - sum(nums). Or XOR 0..n and all elements — pairs cancel, the missing index survives. Both are O(n)/O(1); the XOR version can't overflow in fixed-width languages.",
    functionName: "missing_number",
    signature: "missing_number(nums: list[int]) -> int",
    starter:
      "def missing_number(nums):\n" +
      "    pass\n",
    solution:
`def missing_number(nums):
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)`,
    explanation:
      "Expected sum of 0..n is n(n+1)/2; subtract what's actually there and the gap is the " +
      "answer. The XOR alternative (acc ^= i ^ x for each index and value, then acc ^ n) does " +
      "the same cancellation trick without big intermediate sums — in Python that's moot " +
      "(arbitrary-precision ints), in Java/C it's the overflow-safe version. Name the trade-off.",
    tests: [
      { args: [[3, 0, 1]], expected: 2 },
      { args: [[0, 1]], expected: 2 },
      { args: [[1]], expected: 0 },
      { args: [[0]], expected: 1 },
      { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 },
    ],
  },

  // ============================================================
  // PS2B — MODULE 2b: linked lists, math & bits (the stage-1 gaps)
  // ============================================================

  F75: {
    id: "F75",
    title: "Reverse a Linked List",
    difficulty: "Easy",
    time: "8-10 min",
    tags: ["Linked List", "Pointers"],
    type: "python",
    statement:
      "Write <code>reverse_list(head)</code> — reverse a singly linked list in place and return " +
      "the new head. O(n) time, O(1) space; no copying values into an array. The three-pointer " +
      "surgery from Module 2b, and probably the most-asked warm-up in live interviews anywhere. " +
      "Lists arrive as arrays and are built for you via <code>_build_list</code>; your function " +
      "receives the head <code>ListNode</code> (fields: val, next) and returns a node.",
    examples:
      "Input:  [1,2,3,4,5] -> [5,4,3,2,1]\n" +
      "Input:  [1,2]       -> [2,1]\n" +
      "Input:  []          -> []",
    hint: "prev=None, curr=head. Each step: save curr.next FIRST, then rewire curr.next=prev, then advance both. When curr is None, prev is the new head.",
    functionName: "reverse_list",
    signature: "reverse_list(head: ListNode | None) -> ListNode | None",
    starter:
      "def reverse_list(head):\n" +
      "    # head is a ListNode (or None); fields: val, next\n" +
      "    pass\n",
    solution:
`def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next     # save the rope before cutting it
        curr.next = prev
        prev, curr = curr, nxt
    return prev`,
    explanation:
      "Narrate the failure mode: assigning curr.next = prev without saving nxt first orphans the " +
      "rest of the list. Follow-up to expect: the recursive version (elegant, but O(n) stack — " +
      "say why iterative wins for a million nodes), and 'reverse only positions m..n' " +
      "(dummy-head + careful splicing).",
    tests: [
      { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1],
        prepare: "args = [_build_list(args[0])]",
        transform: "result = _linked_to_list(result)" },
      { args: [[1, 2]], expected: [2, 1],
        prepare: "args = [_build_list(args[0])]",
        transform: "result = _linked_to_list(result)" },
      { args: [[]], expected: [],
        prepare: "args = [_build_list(args[0])]",
        transform: "result = _linked_to_list(result)" },
      { args: [[7]], expected: [7],
        prepare: "args = [_build_list(args[0])]",
        transform: "result = _linked_to_list(result)" },
    ],
  },

  F76: {
    id: "F76",
    title: "Middle of the Linked List",
    difficulty: "Easy",
    time: "5-8 min",
    tags: ["Linked List", "Fast & Slow Pointers"],
    type: "python",
    statement:
      "Write <code>middle_node(head)</code> — return the middle node of the list (for even " +
      "lengths, the <em>second</em> of the two middles). One pass, O(1) space: fast & slow " +
      "pointers. The runner converts your returned node onward to an array, so returning the " +
      "correct node shows as the list from the middle to the end.",
    examples:
      "Input:  [1,2,3,4,5]   -> node 3   (shown as [3,4,5])\n" +
      "Input:  [1,2,3,4,5,6] -> node 4   (shown as [4,5,6])\n" +
      "Input:  [1]           -> node 1",
    hint: "slow=fast=head; while fast and fast.next: slow=slow.next; fast=fast.next.next. The loop condition is exactly what decides which middle you get for even lengths.",
    functionName: "middle_node",
    signature: "middle_node(head: ListNode) -> ListNode",
    starter:
      "def middle_node(head):\n" +
      "    pass\n",
    solution:
`def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
    explanation:
      "When fast has taken 2k steps, slow has taken k — so when fast exhausts the list, slow is " +
      "halfway. For even lengths this condition lands slow on the second middle; using " +
      "'fast.next and fast.next.next' gives the first middle instead — know which is which, " +
      "interviewers ask. Same skeleton powers cycle detection (F77) and palindrome-list.",
    tests: [
      { args: [[1, 2, 3, 4, 5]], expected: [3, 4, 5],
        prepare: "args = [_build_list(args[0])]",
        transform: "result = _linked_to_list(result)" },
      { args: [[1, 2, 3, 4, 5, 6]], expected: [4, 5, 6],
        prepare: "args = [_build_list(args[0])]",
        transform: "result = _linked_to_list(result)" },
      { args: [[1]], expected: [1],
        prepare: "args = [_build_list(args[0])]",
        transform: "result = _linked_to_list(result)" },
      { args: [[1, 2]], expected: [2],
        prepare: "args = [_build_list(args[0])]",
        transform: "result = _linked_to_list(result)" },
    ],
  },

  F77: {
    id: "F77",
    title: "Linked List Cycle",
    difficulty: "Easy",
    time: "8-10 min",
    tags: ["Linked List", "Floyd", "Fast & Slow Pointers"],
    type: "python",
    statement:
      "Write <code>has_cycle(head)</code> — return whether the list contains a cycle, in O(n) " +
      "time and <strong>O(1) space</strong> (a visited-set is the O(n)-space warm-up answer; " +
      "Floyd's tortoise-and-hare is the intended one). Test fixtures build the cycle for you: " +
      "the second argument in each test is the index the tail links back to (-1 = no cycle).",
    examples:
      "Input:  list=[3,2,0,-4], tail->index 1  -> True\n" +
      "Input:  list=[1,2],      tail->index 0  -> True\n" +
      "Input:  list=[1,2,3],    no cycle       -> False\n" +
      "Input:  [],              no cycle       -> False",
    hint: "slow moves 1, fast moves 2; if they ever meet, cycle. If fast (or fast.next) hits None, no cycle. State the why: inside the cycle the gap shrinks by 1 per step, so it must reach 0.",
    functionName: "has_cycle",
    signature: "has_cycle(head: ListNode | None) -> bool",
    starter:
      "def has_cycle(head):\n" +
      "    pass\n",
    solution:
`def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
    explanation:
      "Compare nodes with 'is', not '==' on values — duplicated values are not a cycle. The " +
      "guaranteed follow-up: 'where does the cycle START?' — after the meeting, reset slow to " +
      "head and step both by 1; they collide at the entry (Module 2b sketches why). Second " +
      "follow-up: 'cycle length?' — freeze one pointer, count until the other returns.",
    tests: [
      { args: [[3, 2, 0, -4], 1], expected: true,
        prepare: "args = [_build_list_with_cycle(args[0], args[1])]" },
      { args: [[1, 2], 0], expected: true,
        prepare: "args = [_build_list_with_cycle(args[0], args[1])]" },
      { args: [[1, 2, 3], -1], expected: false,
        prepare: "args = [_build_list_with_cycle(args[0], args[1])]" },
      { args: [[], -1], expected: false,
        prepare: "args = [_build_list_with_cycle(args[0], args[1])]" },
      { args: [[1], -1], expected: false,
        prepare: "args = [_build_list_with_cycle(args[0], args[1])]" },
      { args: [[1], 0], expected: true,
        prepare: "args = [_build_list_with_cycle(args[0], args[1])]" },
    ],
  },

  F78: {
    id: "F78",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    time: "10-12 min",
    tags: ["Linked List", "Dummy Head", "Two Pointers"],
    type: "python",
    statement:
      "Write <code>merge_lists(a, b)</code> — splice two ascending sorted linked lists into one " +
      "sorted list (reusing the existing nodes, no new allocations except a sentinel) and return " +
      "its head. This is the dummy-head pattern's home turf — and the building block the " +
      "interviewer extends into 'merge K lists' (heap, Module 11).",
    examples:
      "Input:  a=[1,2,4], b=[1,3,4] -> [1,1,2,3,4,4]\n" +
      "Input:  a=[],      b=[0]     -> [0]\n" +
      "Input:  a=[5],     b=[1,2]   -> [1,2,5]",
    hint: "dummy = ListNode(); tail = dummy. While both lists are non-empty, attach the smaller head and advance that list. Then attach whichever list remains (it's already sorted). Return dummy.next.",
    functionName: "merge_lists",
    signature: "merge_lists(a: ListNode | None, b: ListNode | None) -> ListNode | None",
    starter:
      "def merge_lists(a, b):\n" +
      "    pass\n",
    solution:
`def merge_lists(a, b):
    dummy = tail = ListNode()
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b       # the leftover list is already sorted
    return dummy.next`,
    explanation:
      "The dummy node erases the 'which list provides the first node?' special case; the final " +
      "'tail.next = a or b' erases the drain-the-leftovers loop. Both erasures are worth " +
      "narrating. Using <= (not <) keeps the merge stable. Complexity O(m+n) time, O(1) extra " +
      "space — and 'merge K lists' upgrades this exact loop with a min-heap of list heads.",
    tests: [
      { args: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)" },
      { args: [[], []], expected: [],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)" },
      { args: [[], [0]], expected: [0],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)" },
      { args: [[5], [1, 2]], expected: [1, 2, 5],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)" },
      { args: [[2, 2], [2]], expected: [2, 2, 2],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)" },
    ],
  },

  F79: {
    id: "F79",
    title: "Hamming Weight (Count Set Bits)",
    difficulty: "Easy",
    time: "5-8 min",
    tags: ["Bit Manipulation"],
    type: "python",
    statement:
      "Write <code>hamming_weight(n)</code> — the number of 1-bits in the binary representation " +
      "of a non-negative integer. The naive loop checks all ~32 bits; the trick from Module 2b's " +
      "table — <code>n &amp;= n-1</code> clears the lowest set bit — loops only once per set bit. " +
      "Write the trick version and be ready to explain <em>why</em> it clears exactly that bit.",
    examples:
      "Input:  11 (1011)      -> 3\n" +
      "Input:  128 (10000000) -> 1\n" +
      "Input:  255            -> 8\n" +
      "Input:  0              -> 0",
    hint: "while n: n &= n - 1; count += 1. Subtracting 1 turns the lowest set bit into 0 and the zeros below it into 1s; AND wipes that whole tail.",
    functionName: "hamming_weight",
    signature: "hamming_weight(n: int) -> int",
    starter:
      "def hamming_weight(n):\n" +
      "    pass\n",
    solution:
`def hamming_weight(n):
    count = 0
    while n:
        n &= n - 1    # clear the lowest set bit
        count += 1
    return count`,
    explanation:
      "Runs once per set bit (Kernighan's trick) instead of once per bit position. In real " +
      "Python you'd say bin(n).count('1') — mention it, then write the loop, because the loop " +
      "is what's being tested. Follow-up: 'is n a power of two?' is the same identity used " +
      "once: n > 0 and n & (n-1) == 0.",
    tests: [
      { args: [11], expected: 3 },
      { args: [128], expected: 1 },
      { args: [255], expected: 8 },
      { args: [0], expected: 0 },
      { args: [1], expected: 1 },
      { args: [2147483647], expected: 31 },
    ],
  },

  F80: {
    id: "F80",
    title: "Single Number",
    difficulty: "Easy",
    time: "5-8 min",
    tags: ["Bit Manipulation", "XOR"],
    type: "python",
    statement:
      "Write <code>single_number(nums)</code> — every element appears exactly twice except one, " +
      "which appears once; find it in O(n) time and <strong>O(1) space</strong>. A hash counter " +
      "is the O(n)-space answer the interviewer will accept and then immediately challenge — " +
      "the intended answer is the XOR cancellation from Module 2b.",
    examples:
      "Input:  [2,2,1]       -> 1\n" +
      "Input:  [4,1,2,1,2]   -> 4\n" +
      "Input:  [-1,-1,9]     -> 9",
    hint: "acc = 0; for x in nums: acc ^= x. Pairs cancel (a^a=0), order doesn't matter (XOR is commutative), the loner survives (a^0=a).",
    functionName: "single_number",
    signature: "single_number(nums: list[int]) -> int",
    starter:
      "def single_number(nums):\n" +
      "    pass\n",
    solution:
`def single_number(nums):
    acc = 0
    for x in nums:
        acc ^= x
    return acc`,
    explanation:
      "Three identities make it work: a^a=0, a^0=a, and commutativity (so the pairs cancel no " +
      "matter how they're interleaved). State all three — that's the whole interview answer. " +
      "Classic follow-up: 'two loners instead of one' — XOR everything to get x^y, isolate any " +
      "set bit of it (that bit differs between x and y), and partition the array by that bit.",
    tests: [
      { args: [[2, 2, 1]], expected: 1 },
      { args: [[4, 1, 2, 1, 2]], expected: 4 },
      { args: [[7]], expected: 7 },
      { args: [[-1, -1, 9]], expected: 9 },
      { args: [[0, 1, 0]], expected: 1 },
    ],
  },

  F81: {
    id: "F81",
    title: "Count Primes (Sieve of Eratosthenes)",
    difficulty: "Medium",
    time: "10-12 min",
    tags: ["Math", "Primes", "Sieve"],
    type: "python",
    statement:
      "Write <code>count_primes(n)</code> — how many prime numbers are strictly less than " +
      "<code>n</code>? Trial-dividing every number is O(n√n); the expected answer is the sieve " +
      "from Module 2b: O(n log log n), with the inner loop starting at <code>i*i</code> — and " +
      "you should be able to say why.",
    examples:
      "Input:  10   -> 4    (2, 3, 5, 7)\n" +
      "Input:  2    -> 0    (strictly less than n!)\n" +
      "Input:  3    -> 1\n" +
      "Input:  100  -> 25",
    hint: "Boolean array of size n, all True; mark 0 and 1 False; for each i up to √n still marked prime, cross out i*i, i*i+i, ... The answer is sum(is_prime).",
    functionName: "count_primes",
    signature: "count_primes(n: int) -> int",
    starter:
      "def count_primes(n):\n" +
      "    pass\n",
    solution:
`def count_primes(n):
    if n < 3:
        return 0
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n, i):
                is_prime[j] = False
    return sum(is_prime)`,
    explanation:
      "The two narration points: the inner loop starts at i*i because every smaller multiple " +
      "k·i (k < i) was already crossed out by k's own smallest prime factor; and the outer loop " +
      "stops at √n because any composite below n has a factor ≤ √n. The 'strictly less than n' " +
      "boundary is where the off-by-ones live — test n=2 and n=3 out loud.",
    tests: [
      { args: [10], expected: 4 },
      { args: [0], expected: 0 },
      { args: [1], expected: 0 },
      { args: [2], expected: 0 },
      { args: [3], expected: 1 },
      { args: [100], expected: 25 },
      { args: [500], expected: 95 },
    ],
  },

  F82: {
    id: "F82",
    title: "Fast Modular Power",
    difficulty: "Medium",
    time: "10-15 min",
    tags: ["Math", "Modular Arithmetic", "Bit Manipulation"],
    type: "python",
    statement:
      "Write <code>power_mod(base, exp, mod)</code> — compute base<sup>exp</sup> mod " +
      "<code>mod</code> for exp ≥ 0, mod ≥ 2, in <strong>O(log exp)</strong> multiplications. " +
      "Multiplying in a loop exp times is the O(exp) trap; square-and-multiply peels the " +
      "exponent's bits (Module 2b). Python's built-in <code>pow(b, e, m)</code> does this — " +
      "name it, then implement the loop, because the loop is the question.",
    examples:
      "Input:  base=2,  exp=10,  mod=1000        -> 24    (1024 % 1000)\n" +
      "Input:  base=3,  exp=0,   mod=7           -> 1\n" +
      "Input:  base=2,  exp=100, mod=10**9+7     -> 976371285   (instant, not 2^100 work)",
    hint: "result=1; base%=mod; while exp: if exp&1: result=result*base%mod; base=base*base%mod; exp>>=1. Reduce mod at every step — that's the identity (a·b)%m = ((a%m)·(b%m))%m at work.",
    functionName: "power_mod",
    signature: "power_mod(base: int, exp: int, mod: int) -> int",
    starter:
      "def power_mod(base, exp, mod):\n" +
      "    pass\n",
    solution:
`def power_mod(base, exp, mod):
    result = 1
    base %= mod
    while exp:
        if exp & 1:                    # this bit of the exponent is set
            result = result * base % mod
        base = base * base % mod       # square for the next bit
        exp >>= 1
    return result`,
    explanation:
      "Each iteration handles one bit of exp: base holds base^(2^k) mod m, and you multiply it " +
      "into the result exactly when that bit is set — so ~log2(exp) squarings total. Reducing " +
      "mod m after every multiply keeps intermediates small (crucial in fixed-width languages, " +
      "good hygiene in Python). This is also the engine inside RSA and hash-rolling — a fact " +
      "worth one sentence in the interview.",
    tests: [
      { args: [2, 10, 1000], expected: 24 },
      { args: [3, 0, 7], expected: 1 },
      { args: [10, 9, 6], expected: 4 },
      { args: [2, 100, 1000000007], expected: 976371285 },
      { args: [7, 222, 11], expected: 5 },
      { args: [5, 1, 3], expected: 2 },
    ],
  },

  // ============================================================
  // COVERAGE PATCH — interview staples the audit found missing
  // (matrix traversal, subsets, string parsing, insert-interval,
  //  SQL LEFT JOIN counting & grouped-subquery joins)
  // ============================================================

  F83: {
    id: "F83",
    title: "Number of Islands",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Graph", "Grid", "Flood Fill"],
    type: "python",
    statement:
      "Write <code>num_islands(grid)</code> — the grid holds <code>\"1\"</code> (land) and " +
      "<code>\"0\"</code> (water) strings; return the number of islands, where an island is a " +
      "group of land cells connected <strong>up/down/left/right</strong> (not diagonally). " +
      "The single most-asked grid question in live interviews: one outer scan, one flood fill " +
      "per undiscovered island.",
    examples:
      'Input:  [["1","1","0","0","0"],\n' +
      '         ["1","1","0","0","0"],\n' +
      '         ["0","0","1","0","0"],\n' +
      '         ["0","0","0","1","1"]]  -> 3\n' +
      'Input:  [["1","0"],\n' +
      '         ["0","1"]]              -> 2   (diagonals do NOT connect)',
    hint: "Scan every cell; each time you meet an unvisited '1', count += 1 and flood-fill (DFS/BFS) the whole island, sinking cells to '0' (or marking a visited set) so it's never counted again.",
    functionName: "num_islands",
    signature: "num_islands(grid: list[list[str]]) -> int",
    starter:
      "def num_islands(grid):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def num_islands(grid: list) -> int:
    if not grid or not grid[0]:
        return 0
    R, C = len(grid), len(grid[0])
    count = 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == "1":
                count += 1                      # a new island's first cell
                stack = [(r, c)]
                grid[r][c] = "0"                # sink so it's never recounted
                while stack:
                    cr, cc = stack.pop()
                    for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0)):
                        nr, nc = cr + dr, cc + dc
                        if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == "1":
                            grid[nr][nc] = "0"
                            stack.append((nr, nc))
    return count`,
    explanation:
      "O(R*C) time — every cell is visited a constant number of times — O(R*C) worst-case " +
      "stack/queue space (one all-land grid). Sink cells WHEN PUSHED, not when popped: " +
      "marking at pop time lets one cell be queued twice. Sinking the input is fine here; " +
      "if mutation is off-limits, say so and keep a visited set. Follow-ups to expect: " +
      "count the LARGEST island (return flood size), diagonal connectivity (8 directions), " +
      "and 'islands appearing over time' (Union-Find, Number of Islands II).",
    tests: [
      { args: [[["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]], expected: 1 },
      { args: [[["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]], expected: 3 },
      { args: [[["1", "0"], ["0", "1"]]], expected: 2 },
      { args: [[["1", "1", "1"], ["1", "0", "1"], ["1", "1", "1"]]], expected: 1 },
      { args: [[["0", "0"], ["0", "0"]]], expected: 0 },
      { args: [[["1"]]], expected: 1 },
      { args: [[]], expected: 0 },
    ],
  },

  F84: {
    id: "F84",
    title: "Spiral Matrix",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Matrix", "Simulation", "Boundary Bookkeeping"],
    type: "python",
    statement:
      "Write <code>spiral_order(matrix)</code> returning all elements of an m×n matrix in " +
      "clockwise spiral order, starting at the top-left. Zero algorithms, one hundred percent " +
      "index discipline — which is exactly why interviewers love it live: it exposes whether " +
      "you can keep four boundaries straight while narrating.",
    examples:
      "Input:  [[1,2,3],\n" +
      "         [4,5,6],\n" +
      "         [7,8,9]]        -> [1,2,3,6,9,8,7,4,5]\n" +
      "Input:  [[1,2,3,4],\n" +
      "         [5,6,7,8],\n" +
      "         [9,10,11,12]]   -> [1,2,3,4,8,12,11,10,9,5,6,7]\n" +
      "Input:  [[1,2,3]]        -> [1,2,3]   (single row: no bottom pass!)",
    hint: "Four boundaries: top, bottom, left, right. Walk top row left->right, right column top->bottom, then — ONLY if a row/column remains — bottom row right->left and left column bottom->top, shrinking each boundary after its pass.",
    functionName: "spiral_order",
    signature: "spiral_order(matrix: list[list[int]]) -> list[int]",
    starter:
      "def spiral_order(matrix):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def spiral_order(matrix: list) -> list:
    if not matrix or not matrix[0]:
        return []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    out = []
    while top <= bottom and left <= right:
        for c in range(left, right + 1):            # top row ->
            out.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):            # right column v
            out.append(matrix[r][right])
        right -= 1
        if top <= bottom:                           # guard: a row remains
            for c in range(right, left - 1, -1):    # bottom row <-
                out.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:                           # guard: a column remains
            for r in range(bottom, top - 1, -1):    # left column ^
                out.append(matrix[r][left])
            left += 1
    return out`,
    explanation:
      "O(mn) time, O(1) extra space beyond the output. The two `if` guards before the reverse " +
      "passes are the whole question: without them a single row is emitted twice (left-to-right, " +
      "then right-to-left) and a single column likewise — test 3 and 4 exist to catch exactly " +
      "that. Narrate the invariant: 'after each pass I shrink that boundary; the loop condition " +
      "top <= bottom and left <= right means an unvisited ring remains.' Follow-ups: generate " +
      "the spiral (Spiral Matrix II) and rotate the matrix (F85 — same boundary discipline).",
    tests: [
      { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
      { args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
      { args: [[[1, 2, 3]]], expected: [1, 2, 3] },
      { args: [[[1], [2], [3]]], expected: [1, 2, 3] },
      { args: [[[1]]], expected: [1] },
      { args: [[[1, 2], [3, 4]]], expected: [1, 2, 4, 3] },
      { args: [[[1, 2, 3], [4, 5, 6]]], expected: [1, 2, 3, 6, 5, 4] },
    ],
  },

  F85: {
    id: "F85",
    title: "Rotate Image (Matrix 90°)",
    difficulty: "Medium",
    time: "12-18 min",
    tags: ["Matrix", "In-Place", "Transpose"],
    type: "python",
    statement:
      "Write <code>rotate(matrix)</code> rotating an n×n matrix 90° clockwise " +
      "<strong>in place</strong>, and return it (returning a freshly built rotated matrix also " +
      "passes, but the in-place version is what's being asked). The elegant answer is a " +
      "two-step identity: <strong>transpose, then reverse each row</strong> — allocating a " +
      "second matrix is the explicitly-banned easy way out.",
    examples:
      "Input:  [[1,2,3],          [[7,4,1],\n" +
      "         [4,5,6],    ->     [8,5,2],\n" +
      "         [7,8,9]]           [9,6,3]]\n" +
      "Input:  [[1,2],            [[3,1],\n" +
      "         [3,4]]      ->     [4,2]]",
    hint: "Transpose swaps matrix[i][j] with matrix[j][i] for j > i (loop the upper triangle only, or every pair swaps twice = no-op). Then row.reverse() on each row. Counter-clockwise is the mirror recipe: transpose, then reverse each COLUMN.",
    functionName: "rotate",
    signature: "rotate(matrix: list[list[int]]) -> list[list[int]]",
    starter:
      "def rotate(matrix):\n" +
      "    # rotate in place, then return matrix\n" +
      "    pass\n",
    solution:
`def rotate(matrix: list) -> list:
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):        # upper triangle only!
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()
    return matrix`,
    explanation:
      "O(n²) time, O(1) extra space. Why it works: transposing maps (i, j) -> (j, i); " +
      "reversing rows maps (j, i) -> (j, n-1-i) — composed, (i, j) lands at (j, n-1-i), which " +
      "is precisely a 90° clockwise rotation. The trap the upper-triangle bound prevents: " +
      "looping the full square swaps every pair twice, silently restoring the original. The " +
      "four-way cycle swap (moving 4 cells per step along ring offsets) is the other accepted " +
      "answer — more index pain for zero asymptotic gain; name it, then transpose.",
    tests: [
      { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]],
        transform: "result = args[0] if result is None else result" },
      { args: [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]],
        expected: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]],
        transform: "result = args[0] if result is None else result" },
      { args: [[[1]]], expected: [[1]],
        transform: "result = args[0] if result is None else result" },
      { args: [[[1, 2], [3, 4]]], expected: [[3, 1], [4, 2]],
        transform: "result = args[0] if result is None else result" },
    ],
  },

  F86: {
    id: "F86",
    title: "Subsets (Power Set)",
    difficulty: "Medium",
    time: "12-18 min",
    tags: ["Backtracking", "Power Set", "Recursion"],
    type: "python",
    statement:
      "Write <code>subsets(nums)</code> returning <em>all</em> subsets of a list of distinct " +
      "integers, including the empty set and the full set (any order). The purest backtracking " +
      "skeleton there is — and the one the permutations/combinations family is graded against: " +
      "every node of the recursion tree is an answer, not just the leaves.",
    examples:
      "Input:  [1,2,3] -> [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]  (any order)\n" +
      "Input:  [0]     -> [[],[0]]\n" +
      "Count check: n elements -> 2^n subsets, always.",
    hint: "backtrack(start): record path.copy() FIRST (every prefix is a subset), then for i in start..n-1: append nums[i], recurse with i+1, pop. The include/exclude binary recursion and the bitmask loop (mask 0..2^n-1) are the two alternatives to name.",
    functionName: "subsets",
    signature: "subsets(nums: list[int]) -> list[list[int]]",
    starter:
      "def subsets(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def subsets(nums: list) -> list:
    out = []
    path = []

    def backtrack(start):
        out.append(path.copy())          # every node is an answer
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1)
            path.pop()

    backtrack(0)
    return out`,
    explanation:
      "2^n subsets, each up to length n -> O(n * 2^n) output-bound, like permutations. The " +
      "contrast worth saying out loud: permutations snapshot at the LEAVES (full paths only), " +
      "subsets snapshot at EVERY node — the start index guarantees each element is considered " +
      "once per branch, so no duplicates by construction. Alternatives to name: include/exclude " +
      "recursion (binary tree of depth n) and the bitmask loop for mask in range(2**n) — the " +
      "bitmask one is iterative and shines when n <= 20. Follow-up: duplicates in nums " +
      "(Subsets II — sort, skip nums[i] == nums[i-1] at the same depth).",
    tests: [
      { args: [[1, 2, 3]],
        expected: ["", "1", "1,2", "1,2,3", "1,3", "2", "2,3", "3"],
        transform: 'result = sorted(",".join(map(str, sorted(s))) for s in result)' },
      { args: [[0]],
        expected: ["", "0"],
        transform: 'result = sorted(",".join(map(str, sorted(s))) for s in result)' },
      { args: [[]],
        expected: [""],
        transform: 'result = sorted(",".join(map(str, sorted(s))) for s in result)' },
      { args: [[4, 7]],
        expected: ["", "4", "4,7", "7"],
        transform: 'result = sorted(",".join(map(str, sorted(s))) for s in result)' },
      { args: [[2, -1, 5]],
        expected: ["", "-1", "-1,2", "-1,2,5", "-1,5", "2", "2,5", "5"],
        transform: 'result = sorted(",".join(map(str, sorted(s))) for s in result)' },
    ],
  },

  F87: {
    id: "F87",
    title: "Basic Calculator II (String Parsing)",
    difficulty: "Medium-Hard",
    time: "20-25 min",
    tags: ["String", "Stack", "Parsing"],
    type: "python",
    statement:
      "Write <code>calculate(s)</code> evaluating an expression string containing non-negative " +
      "integers, <code>+ - * /</code> and spaces (no parentheses). Normal precedence: " +
      "<code>*</code> and <code>/</code> bind tighter; division <strong>truncates toward " +
      "zero</strong>. The classic string-parsing interview: one pass, a stack of signed terms, " +
      "and the precedence handled by <em>when</em> you fold a number in.",
    examples:
      'Input:  "3+2*2"     -> 7\n' +
      'Input:  " 3+5 / 2 " -> 5    (5/2 truncates to 2)\n' +
      'Input:  "14-3/2"    -> 13\n' +
      'Input:  "0-3/2"     -> -1   (toward zero, NOT floor: floor would say -2)',
    hint: "Walk the string keeping (num, last_op). On +/- push +num/-num onto the stack; on * or / pop the top and push top*num or trunc(top/num). At the end, sum the stack. Flush the pending number when you hit an operator OR the last character.",
    functionName: "calculate",
    signature: "calculate(s: str) -> int",
    starter:
      "def calculate(s):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def calculate(s: str) -> int:
    stack = []
    num = 0
    op = "+"                             # the operator BEFORE the current number
    for i, ch in enumerate(s):
        if ch.isdigit():
            num = num * 10 + int(ch)
        if (not ch.isdigit() and ch != " ") or i == len(s) - 1:
            if op == "+":
                stack.append(num)
            elif op == "-":
                stack.append(-num)
            elif op == "*":
                stack.append(stack.pop() * num)
            else:                        # "/" truncates toward zero
                stack.append(int(stack.pop() / num))
            op = ch
            num = 0
    return sum(stack)`,
    explanation:
      "O(n) time, O(n) stack. The design insight to narrate: +/- terms can't be committed " +
      "until the end (a later * might grab their right operand? no — but a * after THIS number " +
      "grabs it), so push them signed and defer the sum; * and / apply immediately to the " +
      "previous term, which IS the precedence. Two planted traps: the final flush " +
      "(`i == len(s) - 1` — same off-by-one family as RLE F73), and Python's floor division: " +
      "-3 // 2 == -2, but the spec (and C/Java/JS) truncates toward zero, so use " +
      "int(a / b) or math.trunc. Follow-up: parentheses (Basic Calculator I) — recurse or " +
      "push (result, sign) frames on '('.",
    tests: [
      { args: ["3+2*2"], expected: 7 },
      { args: [" 3/2 "], expected: 1 },
      { args: [" 3+5 / 2 "], expected: 5 },
      { args: ["14-3/2"], expected: 13 },
      { args: ["2*3+4"], expected: 10 },
      { args: ["1-1+1"], expected: 1 },
      { args: ["0-3/2"], expected: -1 },
      { args: ["42"], expected: 42 },
      { args: ["100000*3-1"], expected: 299999 },
    ],
  },

  F88: {
    id: "F88",
    title: "Insert Interval",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Intervals", "Merge", "Three Phases"],
    type: "python",
    statement:
      "Write <code>insert_interval(intervals, new_interval)</code> — intervals is sorted by " +
      "start and non-overlapping; insert the new interval, merging where needed (touching " +
      "endpoints like [1,4]+[4,5] merge, matching F37's convention), and return the result " +
      "still sorted and non-overlapping. The follow-up F37 promises — and the point is doing " +
      "it in <strong>one O(n) pass with no re-sort</strong>.",
    examples:
      "Input:  [[1,3],[6,9]], new=[2,5]                        -> [[1,5],[6,9]]\n" +
      "Input:  [[1,2],[3,5],[6,7],[8,10],[12,16]], new=[4,8]   -> [[1,2],[3,10],[12,16]]\n" +
      "Input:  [], new=[5,7]                                   -> [[5,7]]\n" +
      "Input:  [[1,5]], new=[2,3]                              -> [[1,5]]   (swallowed)",
    hint: "Three phases: (1) copy intervals ending strictly before new_start; (2) while intervals start at/before new_end, absorb them — new = [min(starts), max(ends)]; (3) append the merged block, then copy the rest verbatim.",
    functionName: "insert_interval",
    signature: "insert_interval(intervals: list[list[int]], new_interval: list[int]) -> list[list[int]]",
    starter:
      "def insert_interval(intervals, new_interval):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def insert_interval(intervals: list, new_interval: list) -> list:
    out = []
    i, n = 0, len(intervals)
    s, e = new_interval

    while i < n and intervals[i][1] < s:     # phase 1: strictly before
        out.append(intervals[i])
        i += 1

    while i < n and intervals[i][0] <= e:    # phase 2: overlap or touch
        s = min(s, intervals[i][0])
        e = max(e, intervals[i][1])
        i += 1
    out.append([s, e])

    out.extend(intervals[i:])                # phase 3: strictly after
    return out`,
    explanation:
      "O(n) time, one pass, no sort — that's the entire advantage over 'append and re-run F37' " +
      "(which is O(n log n) and a weaker answer, though a correct fallback to name). The " +
      "boundary conditions carry the merge convention: phase 1 uses end < new_start and phase 2 " +
      "uses start <= new_end, so touching intervals fall into the absorb loop. Off-by-one " +
      "checkpoints to narrate: new interval before everything (phase 1 never runs), after " +
      "everything (phase 2 never runs), swallowed whole (phase 2 runs once and min/max keep " +
      "the old block). This shape — before / conflict zone / after — recurs in calendar " +
      "bookings and range-update questions.",
    tests: [
      { args: [[[1, 3], [6, 9]], [2, 5]], expected: [[1, 5], [6, 9]] },
      { args: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]], expected: [[1, 2], [3, 10], [12, 16]] },
      { args: [[], [5, 7]], expected: [[5, 7]] },
      { args: [[[1, 5]], [2, 3]], expected: [[1, 5]] },
      { args: [[[1, 4]], [4, 5]], expected: [[1, 5]] },
      { args: [[[3, 5], [8, 9]], [0, 1]], expected: [[0, 1], [3, 5], [8, 9]] },
      { args: [[[3, 5], [8, 9]], [10, 12]], expected: [[3, 5], [8, 9], [10, 12]] },
    ],
  },

  F89: {
    id: "F89",
    title: "SQL — Order Counts Including Zeros",
    difficulty: "Medium",
    time: "10-15 min",
    tags: ["SQL", "LEFT JOIN", "COUNT Trap", "GROUP BY"],
    type: "sql",
    statement:
      "Tables <code>customers(id, name)</code> and <code>orders(id, customer_id, total)</code>. " +
      "Return every customer's name and how many orders they've placed — <strong>including " +
      "customers with zero orders</strong> — as columns <code>name, order_count</code>. Two " +
      "planted traps in one query: an INNER JOIN silently deletes the zero-order customers, " +
      "and on a LEFT JOIN <code>COUNT(*)</code> counts the wrong thing.",
    examples:
      "customers: (1,'Ada'),(2,'Ben'),(3,'Cleo')\n" +
      "orders:    (1, customer 1, 50),(2, customer 1, 30),(3, customer 3, 20)\n" +
      "-> Ada 2, Ben 0, Cleo 1   (Ben must appear!)",
    hint: "LEFT JOIN orders and GROUP BY the customer. Then COUNT(o.id), not COUNT(*): the zero-order customer still produces ONE row (all order columns NULL) — COUNT(*) counts that row as 1, COUNT(o.id) skips the NULL and says 0.",
    solution:
`-- LEFT JOIN keeps zero-order customers; COUNT(o.id) makes them count as 0:
SELECT c.name AS name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;

-- The two broken versions to be able to explain:
--   INNER JOIN ... GROUP BY  -> Ben vanishes entirely
--   LEFT JOIN + COUNT(*)     -> Ben "has" 1 order (his NULL-extended row)`,
    sqlSchema:
`CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, total INTEGER);
INSERT INTO customers VALUES (1,'Ada'),(2,'Ben'),(3,'Cleo');
INSERT INTO orders VALUES (1,1,50),(2,1,30),(3,3,20);`,
    sqlStarter:
      "-- Tables: customers(id, name), orders(id, customer_id, total)\n" +
      "-- Columns to return: name, order_count (zero-order customers included!)\n" +
      "SELECT\n",
    sqlSolution:
`SELECT c.name AS name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;`,
    explanation:
      "The mechanics: a LEFT JOIN customer with no orders still yields one row, with every " +
      "orders column NULL. COUNT(*) counts rows — 1. COUNT(o.id) counts non-NULL values — 0. " +
      "That distinction (COUNT(*) vs COUNT(column)) is a stock 'what's wrong with this query' " +
      "interview probe. Also GROUP BY c.id, not just c.name — two customers can share a name, " +
      "and grouping by the key is what makes the query correct rather than accidentally right. " +
      "Test 2 adds an order with customer_id NULL (imported/guest data): it joins to nobody " +
      "and must inflate no one's count. Follow-up: 'only customers with 2+ orders' -> HAVING " +
      "COUNT(o.id) >= 2 (F71's WHERE-vs-HAVING recap, now on a join).",
    tests: [
      {
        name: "Base case — Ben has zero orders and must appear",
        orderMatters: false,
        expected: { columns: ["name", "order_count"], rows: [["Ada", 2], ["Ben", 0], ["Cleo", 1]] },
      },
      {
        name: "Stray NULL customer_id order inflates nobody",
        orderMatters: false,
        schema:
`CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, total INTEGER);
INSERT INTO customers VALUES (1,'Ada'),(2,'Ben');
INSERT INTO orders VALUES (1,1,10),(2,NULL,99);`,
        expected: { columns: ["name", "order_count"], rows: [["Ada", 1], ["Ben", 0]] },
      },
    ],
  },

  F90: {
    id: "F90",
    title: "SQL — Earning Above the Department Average",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["SQL", "GROUP BY", "Subquery Join", "Aggregates"],
    type: "sql",
    statement:
      "Table <code>employees(id, name, department, salary)</code>. Return the employees who " +
      "earn <strong>strictly more</strong> than the average salary of their own department, " +
      "as columns <code>employee, department</code>. The follow-up F47 promises, and a " +
      "grading favorite because the obvious first draft — <code>WHERE salary &gt; " +
      "AVG(salary)</code> — is illegal SQL, and explaining <em>why</em> is the question.",
    examples:
      "employees: Ada/Eng/95k, Ben/Eng/85k, Fay/Eng/90k, Cleo/Sales/60k, Dan/Sales/70k, Eve/HR/55k\n" +
      "Eng avg 90k   -> Ada (95k) qualifies; Fay is AT the average — strictly means out\n" +
      "Sales avg 65k -> Dan (70k)\n" +
      "HR avg 55k    -> nobody (a single-person department can never beat its own average)",
    hint: "Aggregate first, compare second: GROUP BY department in a subquery computing AVG(salary), JOIN it back on department, then WHERE e.salary > d.avg_salary. (WHERE can't hold an aggregate — aggregates don't exist until grouping, which runs after WHERE.)",
    solution:
`-- Aggregate in a subquery, join back, compare row vs group:
SELECT e.name AS employee, e.department AS department
FROM employees e
JOIN (
    SELECT department, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
) d ON d.department = e.department
WHERE e.salary > d.avg_salary;

-- Window alternative (name it): AVG(salary) OVER (PARTITION BY department)
-- computed in a subquery, filtered outside — same processing-order logic as F49.`,
    sqlSchema:
`CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);
INSERT INTO employees VALUES
  (1,'Ada','Eng',95000),(2,'Ben','Eng',85000),(3,'Fay','Eng',90000),
  (4,'Cleo','Sales',60000),(5,'Dan','Sales',70000),(6,'Eve','HR',55000);`,
    sqlStarter:
      "-- Table: employees(id, name, department, salary)\n" +
      "-- Columns to return: employee, department (strictly above own dept average)\n" +
      "SELECT\n",
    sqlSolution:
`SELECT e.name AS employee, e.department AS department
FROM employees e
JOIN (
    SELECT department, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
) d ON d.department = e.department
WHERE e.salary > d.avg_salary;`,
    explanation:
      "Why the naive version fails: WHERE runs before GROUP BY, so at WHERE time there IS no " +
      "AVG yet — aggregates can only be compared after they exist, hence the grouped subquery " +
      "(or a window function, or a correlated subquery — know all three, lead with the join). " +
      "The strictness detail is test 2's whole point: everyone AT the average drops out, so a " +
      "department of identical salaries returns nobody, and a single-person department can " +
      "never qualify (their salary IS the average). Follow-ups: 'below average' (flip the " +
      "comparison), 'top earner per department' (MAX instead of AVG — or F49's DENSE_RANK " +
      "when ties and top-N enter).",
    tests: [
      {
        name: "Base case — strict inequality, single-person dept excluded",
        orderMatters: false,
        expected: { columns: ["employee", "department"], rows: [["Ada", "Eng"], ["Dan", "Sales"]] },
      },
      {
        name: "All-equal departments -> empty result",
        orderMatters: false,
        schema:
`CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER);
INSERT INTO employees VALUES
  (1,'Solo','Ops',50000),(2,'Twin1','QA',60000),(3,'Twin2','QA',60000);`,
        expected: { columns: ["employee", "department"], rows: [] },
      },
    ],
  },

};

// ----------------------------------------------------------------
// QUESTION GROUPS  (which question IDs each Practice Set draws)
// ----------------------------------------------------------------
window.PRACTICE_SETS = {
  PS1: { module: "M1", title: "Practice Set 1 — Stage-1 Recap Drills",
         qids: ["F66", "F67", "F68", "F69", "F70", "F71"] },
  PS2: { module: "M2", title: "Practice Set 2 — Live-Coding Template Drills",
         qids: ["F72", "F73", "F74"] },
  PS2B: { module: "M2B", title: "Practice Set 2b — Linked Lists, Math & Bits",
          qids: ["F75", "F76", "F77", "F78", "F79", "F80", "F81", "F82"] },
  PS3: { module: "M3", title: "Practice Set 3 — Arrays & Windows, Advanced",
         qids: ["F01", "F02", "F03", "F04", "F05", "F06", "F84", "F85", "F87"] },
  PS4: { module: "M4", title: "Practice Set 4 — Hash Maps, Sets & Counting",
         qids: ["F07", "F08", "F09", "F10"] },
  PS5: { module: "M5", title: "Practice Set 5 — Recursion & Backtracking",
         qids: ["F11", "F12", "F13", "F14", "F15", "F86"] },
  PS6: { module: "M6", title: "Practice Set 6 — Binary Search Mastery",
         qids: ["F16", "F17", "F18", "F19", "F20"] },
  PS7: { module: "M7", title: "Practice Set 7 — Trees Deep Dive",
         qids: ["F21", "F22", "F23", "F24", "F25"] },
  PS8: { module: "M8", title: "Practice Set 8 — Graphs Deep Dive",
         qids: ["F26", "F27", "F28", "F29", "F30", "F83"] },
  PS9: { module: "M9", title: "Practice Set 9 — Dynamic Programming",
         qids: ["F31", "F32", "F33", "F34", "F35", "F36"] },
  PS10: { module: "M10", title: "Practice Set 10 — Greedy & Intervals",
          qids: ["F37", "F38", "F39", "F40", "F41", "F88"] },
  PS11: { module: "M11", title: "Practice Set 11 — Heaps & Priority Queues",
          qids: ["F42", "F43", "F44", "F45"] },
  PS12: { module: "M12", title: "Practice Set 12 — SQL Deep Dive",
          qids: ["F46", "F47", "F48", "F49", "F50", "F51", "F89", "F90"] },
  PS13: { module: "M13", title: "Practice Set 13 — Database Design & Indexes",
          qids: ["F52", "F53", "F54", "F55"] },
  PS14: { module: "M14", title: "Practice Set 14 — OOP & Design Patterns",
          qids: ["F56", "F57", "F58", "F59", "F60"] },
  PS15: { module: "M15", title: "Practice Set 15 — System Design",
          qids: ["F61", "F62", "F63", "F64", "F65"] },
};

// Final exam pool — a curated, runnable-only subset (python + SQL with fixtures).
// Design questions are excluded on purpose: their cards have no test runner, so
// they can never fire onPass and would leave the exam scoreboard incompletable.
// The mix mirrors the real interview's ratio (~2 algorithm : 1 SQL per draw).
window.FINAL_EXAM_POOL = [
  // Arrays & windows / hashing (M3–M4)
  "F01", "F04", "F06", "F08", "F10",
  // Recursion & binary search (M5–M6)
  "F12", "F13", "F16", "F18",
  // Trees & graphs (M7–M8)
  "F21", "F24", "F26", "F28",
  // DP, greedy, heaps (M9–M11)
  "F32", "F34", "F36", "F37", "F40", "F42", "F44",
  // SQL (M12–M13)
  "F46", "F48", "F49", "F51", "F52",
  // Data structures in code (M14)
  "F56", "F57",
  // Stage-1 recap drills (M1) — every topic family shows up in the exam
  "F66", "F67", "F68", "F69", "F70", "F71",
  // Craft drills (M2) — F72 (FizzBuzz) deliberately left out: too trivial for an exam deal
  "F73", "F74",
  // Linked lists, math & bits (M2b)
  "F75", "F76", "F77", "F78", "F79", "F80", "F81", "F82",
  // Coverage patch — matrix, subsets, parsing, insert-interval (algo stratum)
  "F83", "F84", "F85", "F86", "F87", "F88",
  // Coverage patch — SQL stratum
  "F89", "F90",
];
