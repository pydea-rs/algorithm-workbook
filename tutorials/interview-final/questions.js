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
      "the pop commit permanently; with negatives you'd switch to Bellman-Ford (O(VE)).",
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
  PS6: { module: "M6", title: "Practice Set 6 — Binary Search Mastery",
         qids: ["F16", "F17", "F18", "F19", "F20"] },
  PS7: { module: "M7", title: "Practice Set 7 — Trees Deep Dive",
         qids: ["F21", "F22", "F23", "F24", "F25"] },
  PS8: { module: "M8", title: "Practice Set 8 — Graphs Deep Dive",
         qids: ["F26", "F27", "F28", "F29", "F30"] },
};

// Final exam pool — filled in as later modules land (held-back questions).
window.FINAL_EXAM_POOL = [];
