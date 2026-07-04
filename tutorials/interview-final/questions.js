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
      "Input:  nums=[1,-1,0], k=0         -> 3   ([1,-1], [-1,... wait: [1,-1], [0], [1,-1,0])\n" +
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
    hint: "Track need (counts of t) and have (how many chars currently satisfied); shrink from the left while have == len(need)-distinct... use a satisfied-counter, not a dict comparison.",
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
      "prevents infinite loops on duplicates. And the j-first swap avoids the tuple-assignment " +
      "index trap from the module text.",
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

};

// ----------------------------------------------------------------
// QUESTION GROUPS  (which question IDs each Practice Set draws)
// ----------------------------------------------------------------
window.PRACTICE_SETS = {
  PS3: { module: "M3", title: "Practice Set 3 — Arrays & Windows, Advanced",
         qids: ["F01", "F02", "F03", "F04", "F05", "F06"] },
  PS4: { module: "M4", title: "Practice Set 4 — Hash Maps, Sets & Counting",
         qids: ["F07", "F08", "F09", "F10"] },
  PS5: { module: "M5", title: "Practice Set 5 — Recursion & Backtracking",
         qids: ["F11", "F12", "F13", "F14", "F15"] },
};

// Final exam pool — filled in as later modules land (held-back questions).
window.FINAL_EXAM_POOL = [];
