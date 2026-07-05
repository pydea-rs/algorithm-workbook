/* ============================================================
   questions-js.js — JavaScript sidecar for the workbench.

   Loaded AFTER questions.js. For each Python question that also
   supports JavaScript, defines `J.F## = { functionName, signature,
   starter, solution, testsPrepare?, testsTransform? }` and merges
   it into `window.QUESTIONS[F##].js`.

   testsPrepare / testsTransform are JS sources applied to every
   test case of that question (prepareJs / transformJs).
============================================================ */

(function () {
  "use strict";
  const J = {};

  // ============ F01 — Longest Substring Without Repeating Characters ============
  J.F01 = {
    functionName: "longestUniqueSubstring",
    signature: "function longestUniqueSubstring(s: string): number",
    starter:
`function longestUniqueSubstring(s) {
  // your code here
}
`,
    solution:
`function longestUniqueSubstring(s) {
  const seen = new Set();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  };

  // ============ F02 — Count Subarrays Summing to K ============
  J.F02 = {
    functionName: "subarraySum",
    signature: "function subarraySum(nums: number[], k: number): number",
    starter:
`function subarraySum(nums, k) {
  // your code here
}
`,
    solution:
`function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]);
  let run = 0, total = 0;
  for (const x of nums) {
    run += x;
    total += seen.get(run - k) || 0;
    seen.set(run, (seen.get(run) || 0) + 1);
  }
  return total;
}`,
  };

  // ============ F03 — Sliding Window Maximum ============
  J.F03 = {
    functionName: "maxSlidingWindow",
    signature: "function maxSlidingWindow(nums: number[], k: number): number[]",
    starter:
`function maxSlidingWindow(nums, k) {
  // your code here
}
`,
    solution:
`function maxSlidingWindow(nums, k) {
  const dq = [];   // indices; values strictly decreasing
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) {
      dq.pop();                       // dominated
    }
    dq.push(i);
    if (dq[0] === i - k) dq.shift();  // slid out of window
    if (i >= k - 1) out.push(nums[dq[0]]);
  }
  return out;
}`,
  };

  // ============ F04 — Container With Most Water ============
  J.F04 = {
    functionName: "maxArea",
    signature: "function maxArea(height: number[]): number",
    starter:
`function maxArea(height) {
  // your code here
}
`,
    solution:
`function maxArea(height) {
  let left = 0, right = height.length - 1, best = 0;
  while (left < right) {
    const h = Math.min(height[left], height[right]);
    best = Math.max(best, (right - left) * h);
    if (height[left] <= height[right]) left++;
    else right--;
  }
  return best;
}`,
  };

  // ============ F05 — Product of Array Except Self ============
  J.F05 = {
    functionName: "productExceptSelf",
    signature: "function productExceptSelf(nums: number[]): number[]",
    starter:
`function productExceptSelf(nums) {
  // your code here
}
`,
    solution:
`function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    out[i] = out[i - 1] * nums[i - 1];   // prefix product
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    out[i] *= suffix;
    suffix *= nums[i];
  }
  return out;
}`,
  };

  // ============ F06 — Minimum Window Substring ============
  J.F06 = {
    functionName: "minWindow",
    signature: "function minWindow(s: string, t: string): string",
    starter:
`function minWindow(s, t) {
  // your code here
}
`,
    solution:
`function minWindow(s, t) {
  if (!s || !t) return "";
  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
  let missing = t.length;
  let left = 0;
  let best = [Infinity, 0, 0];
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if ((need.get(ch) || 0) > 0) missing--;
    need.set(ch, (need.get(ch) || 0) - 1);
    if (missing === 0) {
      while ((need.get(s[left]) || 0) < 0) {
        need.set(s[left], need.get(s[left]) + 1);
        left++;
      }
      if (right - left + 1 < best[0]) best = [right - left + 1, left, right + 1];
      need.set(s[left], need.get(s[left]) + 1);   // give up left char
      missing++;
      left++;
    }
  }
  return best[0] === Infinity ? "" : s.slice(best[1], best[2]);
}`,
  };

  // ============ F07 — Group Anagrams ============
  J.F07 = {
    functionName: "groupAnagrams",
    signature: "function groupAnagrams(words: string[]): string[][]",
    starter:
`function groupAnagrams(words) {
  // your code here
}
`,
    solution:
`function groupAnagrams(words) {
  const groups = new Map();
  for (const w of words) {
    const key = [...w].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}`,
    testsTransform:
      'result = result.map(g => [...g].sort().join("|")).sort();',
  };

  // ============ F08 — Longest Consecutive Sequence ============
  J.F08 = {
    functionName: "longestConsecutive",
    signature: "function longestConsecutive(nums: number[]): number",
    starter:
`function longestConsecutive(nums) {
  // your code here
}
`,
    solution:
`function longestConsecutive(nums) {
  const s = new Set(nums);
  let best = 0;
  for (const x of s) {
    if (s.has(x - 1)) continue;   // not a run head
    let y = x;
    while (s.has(y + 1)) y++;
    best = Math.max(best, y - x + 1);
  }
  return best;
}`,
  };

  // ============ F09 — Top K Frequent Elements ============
  J.F09 = {
    functionName: "topKFrequent",
    signature: "function topKFrequent(nums: number[], k: number): number[]",
    starter:
`function topKFrequent(nums, k) {
  // your code here
}
`,
    solution:
`function topKFrequent(nums, k) {
  const counts = new Map();
  for (const x of nums) counts.set(x, (counts.get(x) || 0) + 1);
  // bucket[i] = values appearing exactly i times
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [val, c] of counts) buckets[c].push(val);
  const out = [];
  for (let c = buckets.length - 1; c > 0 && out.length < k; c--) {
    for (const val of buckets[c]) {
      out.push(val);
      if (out.length === k) break;
    }
  }
  return out;
}`,
  };

  // ============ F10 — First Missing Positive ============
  J.F10 = {
    functionName: "firstMissingPositive",
    signature: "function firstMissingPositive(nums: number[]): number",
    starter:
`function firstMissingPositive(nums) {
  // your code here
}
`,
    solution:
`function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const j = nums[i] - 1;          // compute BEFORE mutating nums[i]
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}`,
  };

  // ============ F11 — Permutations ============
  J.F11 = {
    functionName: "permute",
    signature: "function permute(nums: number[]): number[][]",
    starter:
`function permute(nums) {
  // your code here
}
`,
    solution:
`function permute(nums) {
  const results = [];
  const path = [];
  const used = new Array(nums.length).fill(false);

  function backtrack() {
    if (path.length === nums.length) {
      results.push([...path]);        // snapshot!
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;                 // choose
      path.push(nums[i]);
      backtrack();                    // explore
      path.pop();                     // un-choose
      used[i] = false;
    }
  }

  backtrack();
  return results;
}`,
    testsTransform:
      'result = result.map(p => p.join(",")).sort();',
  };

  // ============ F12 — Combination Sum ============
  J.F12 = {
    functionName: "combinationSum",
    signature: "function combinationSum(candidates: number[], target: number): number[][]",
    starter:
`function combinationSum(candidates, target) {
  // your code here
}
`,
    solution:
`function combinationSum(candidates, target) {
  const cands = [...candidates].sort((a, b) => a - b);
  const results = [];
  const path = [];

  function backtrack(start, remaining) {
    if (remaining === 0) {
      results.push([...path]);
      return;
    }
    for (let i = start; i < cands.length; i++) {
      const c = cands[i];
      if (c > remaining) break;       // sorted -> everything after is bigger
      path.push(c);                   // choose
      backtrack(i, remaining - c);    // i, not i+1: reuse allowed
      path.pop();                     // un-choose
    }
  }

  backtrack(0, target);
  return results;
}`,
    testsTransform:
      'result = result.map(c => [...c].sort((a, b) => a - b).join(",")).sort();',
  };

  // ============ F13 — Word Search ============
  J.F13 = {
    functionName: "exist",
    signature: "function exist(board: string[][], word: string): boolean",
    starter:
`function exist(board, word) {
  // your code here
}
`,
    solution:
`function exist(board, word) {
  const R = board.length, C = board[0].length;

  function dfs(r, c, i) {
    if (i === word.length) return true;
    if (r < 0 || r >= R || c < 0 || c >= C || board[r][c] !== word[i]) {
      return false;
    }
    board[r][c] = "#";                        // choose (mark visited)
    const found = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) ||
                  dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = word[i];                    // un-choose (restore)
    return found;
  }

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}`,
  };

  // ============ F14 — Generate Parentheses ============
  J.F14 = {
    functionName: "generateParenthesis",
    signature: "function generateParenthesis(n: number): string[]",
    starter:
`function generateParenthesis(n) {
  // your code here
}
`,
    solution:
`function generateParenthesis(n) {
  const results = [];

  function backtrack(path, opened, closed) {
    if (path.length === 2 * n) {
      results.push(path.join(""));
      return;
    }
    if (opened < n) {
      path.push("(");
      backtrack(path, opened + 1, closed);
      path.pop();
    }
    if (closed < opened) {
      path.push(")");
      backtrack(path, opened, closed + 1);
      path.pop();
    }
  }

  backtrack([], 0, 0);
  return results;
}`,
  };

  // ============ F15 — N-Queens (count) ============
  J.F15 = {
    functionName: "totalNQueens",
    signature: "function totalNQueens(n: number): number",
    starter:
`function totalNQueens(n) {
  // your code here
}
`,
    solution:
`function totalNQueens(n) {
  const cols = new Set(), diag = new Set(), anti = new Set();

  function place(r) {
    if (r === n) return 1;
    let count = 0;
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(r - c) || anti.has(r + c)) continue;
      cols.add(c); diag.add(r - c); anti.add(r + c);
      count += place(r + 1);
      cols.delete(c); diag.delete(r - c); anti.delete(r + c);
    }
    return count;
  }

  return place(0);
}`,
  };

  // ============ F16 — Search in Rotated Sorted Array ============
  J.F16 = {
    functionName: "searchRotated",
    signature: "function searchRotated(nums: number[], target: number): number",
    starter:
`function searchRotated(nums, target) {
  // your code here
}
`,
    solution:
`function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {              // left half sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {                                  // right half sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
  };

  // ============ F17 — First and Last Position ============
  J.F17 = {
    functionName: "searchRange",
    signature: "function searchRange(nums: number[], target: number): number[]",
    starter:
`function searchRange(nums, target) {
  // your code here
}
`,
    solution:
`function searchRange(nums, target) {
  function lowerBound(x) {          // first index with nums[i] >= x
    let lo = 0, hi = nums.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  const left = lowerBound(target);
  if (left === nums.length || nums[left] !== target) return [-1, -1];
  return [left, lowerBound(target + 1) - 1];
}`,
  };

  // ============ F18 — Koko Eating Bananas ============
  J.F18 = {
    functionName: "minEatingSpeed",
    signature: "function minEatingSpeed(piles: number[], h: number): number",
    starter:
`function minEatingSpeed(piles, h) {
  // your code here
}
`,
    solution:
`function minEatingSpeed(piles, h) {
  function can(k) {
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / k);
    return hours <= h;
  }
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (can(mid)) hi = mid;        // mid works; try smaller
    else lo = mid + 1;
  }
  return lo;
}`,
  };

  // ============ F19 — Find Peak Element ============
  J.F19 = {
    functionName: "findPeakElement",
    signature: "function findPeakElement(nums: number[]): number",
    starter:
`function findPeakElement(nums) {
  // your code here
}
`,
    solution:
`function findPeakElement(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < nums[mid + 1]) lo = mid + 1;   // rising -> peak right
    else hi = mid;                                  // falling -> mid or left
  }
  return lo;
}`,
  };

  // ============ F20 — Median of Two Sorted Arrays ============
  J.F20 = {
    functionName: "findMedianSortedArrays",
    signature: "function findMedianSortedArrays(a: number[], b: number[]): number",
    starter:
`function findMedianSortedArrays(a, b) {
  // your code here
}
`,
    solution:
`function findMedianSortedArrays(a, b) {
  if (a.length > b.length) [a, b] = [b, a];   // search the shorter array
  const m = a.length, n = b.length;
  const totalLeft = Math.floor((m + n + 1) / 2);

  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1;                 // a contributes i to the left
    const j = totalLeft - i;
    const maxLeftA  = i > 0 ? a[i - 1] : -Infinity;
    const minRightA = i < m ? a[i]     :  Infinity;
    const maxLeftB  = j > 0 ? b[j - 1] : -Infinity;
    const minRightB = j < n ? b[j]     :  Infinity;

    if (maxLeftA <= minRightB && maxLeftB <= minRightA) {
      if ((m + n) % 2 === 1) return Math.max(maxLeftA, maxLeftB);
      return (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2;
    }
    if (maxLeftA > minRightB) hi = i - 1;     // a's cut too far right
    else lo = i + 1;
  }
  throw new Error("inputs not sorted");
}`,
  };

  // ============ F21 — Validate BST ============
  J.F21 = {
    functionName: "isValidBst",
    signature: "function isValidBst(root: TreeNode | null): boolean",
    starter:
`function isValidBst(root) {
  // root is a TreeNode (or null); fields: val, left, right
}
`,
    solution:
`function isValidBst(root) {
  function check(node, lo, hi) {
    if (node === null) return true;
    if (!(lo < node.val && node.val < hi)) return false;
    return check(node.left, lo, node.val) && check(node.right, node.val, hi);
  }
  return check(root, -Infinity, Infinity);
}`,
    testsPrepare: "args = [_build_tree(args[0])];",
  };

  // ============ F22 — Lowest Common Ancestor ============
  J.F22 = {
    functionName: "lowestCommonAncestor",
    signature: "function lowestCommonAncestor(root, p, q): TreeNode",
    starter:
`function lowestCommonAncestor(root, p, q) {
  // p and q are TreeNode references inside root's tree
}
`,
    solution:
`function lowestCommonAncestor(root, p, q) {
  if (root === null || root === p || root === q) return root;
  const left  = lowestCommonAncestor(root.left,  p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;    // p and q split here
  return left || right;              // both on one side (or neither)
}`,
    testsPrepare:
      "var t = _build_tree(args[0]); args = [t, _find_node(t, args[1]), _find_node(t, args[2])];",
    testsTransform: "result = result.val;",
  };

  // ============ F23 — Right Side View ============
  J.F23 = {
    functionName: "rightSideView",
    signature: "function rightSideView(root: TreeNode | null): number[]",
    starter:
`function rightSideView(root) {
  // your code here
}
`,
    solution:
`function rightSideView(root) {
  if (root === null) return [];
  const out = [];
  let queue = [root];
  while (queue.length) {
    const next = [];
    out.push(queue[queue.length - 1].val);   // last of the level
    for (const node of queue) {
      if (node.left)  next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
  }
  return out;
}`,
    testsPrepare: "args = [_build_tree(args[0])];",
  };

  // ============ F24 — Serialize and Deserialize ============
  J.F24 = {
    functionName: "serialize",
    signature: "function serialize(root): string   /   function deserialize(data): TreeNode",
    starter:
`function serialize(root) {
  // tree -> string
}

function deserialize(data) {
  // string -> tree (use new TreeNode(val))
}
`,
    solution:
`function serialize(root) {
  const parts = [];
  (function dfs(node) {
    if (node === null) { parts.push("#"); return; }
    parts.push(String(node.val));
    dfs(node.left);
    dfs(node.right);
  })(root);
  return parts.join(",");
}

function deserialize(data) {
  const vals = data.split(",");
  let i = 0;
  function build() {
    const v = vals[i++];
    if (v === "#") return null;
    const node = new TreeNode(parseInt(v, 10));
    node.left = build();
    node.right = build();
    return node;
  }
  return build();
}`,
    testsPrepare:
      "var t = _build_tree(args[0]); result = _tree_to_level(deserialize(serialize(t)));",
  };

  // ============ F25 — Diameter of Binary Tree ============
  J.F25 = {
    functionName: "diameterOfBinaryTree",
    signature: "function diameterOfBinaryTree(root: TreeNode | null): number",
    starter:
`function diameterOfBinaryTree(root) {
  // your code here
}
`,
    solution:
`function diameterOfBinaryTree(root) {
  let best = 0;
  function height(node) {
    if (node === null) return 0;
    const lh = height(node.left);
    const rh = height(node.right);
    best = Math.max(best, lh + rh);   // bent path through this node
    return 1 + Math.max(lh, rh);      // straight chain for the parent
  }
  height(root);
  return best;
}`,
    testsPrepare: "args = [_build_tree(args[0])];",
  };

  // ============ F26 — Course Schedule ============
  J.F26 = {
    functionName: "canFinish",
    signature: "function canFinish(numCourses: number, prerequisites: number[][]): boolean",
    starter:
`function canFinish(numCourses, prerequisites) {
  // your code here
}
`,
    solution:
`function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    indegree[course]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) queue.push(i);
  }
  let done = 0;
  while (queue.length) {
    const node = queue.shift();
    done++;
    for (const nxt of graph[node]) {
      if (--indegree[nxt] === 0) queue.push(nxt);
    }
  }
  return done === numCourses;   // stuck nodes = cycle
}`,
  };

  // ============ F27 — Number of Connected Components ============
  J.F27 = {
    functionName: "countComponents",
    signature: "function countComponents(n: number, edges: number[][]): number",
    starter:
`function countComponents(n, edges) {
  // your code here
}
`,
    solution:
`function countComponents(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];   // path halving
      x = parent[x];
    }
    return x;
  }
  let components = n;
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) {
      parent[ra] = rb;
      components--;
    }
  }
  return components;
}`,
  };

  // ============ F28 — Word Ladder ============
  J.F28 = {
    functionName: "ladderLength",
    signature: "function ladderLength(beginWord: string, endWord: string, wordList: string[]): number",
    starter:
`function ladderLength(beginWord, endWord, wordList) {
  // your code here
}
`,
    solution:
`function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let queue = [[beginWord, 1]];
  words.delete(beginWord);
  while (queue.length) {
    const next = [];
    for (const [word, steps] of queue) {
      if (word === endWord) return steps;
      for (let i = 0; i < word.length; i++) {
        for (const ch of alphabet) {
          const cand = word.slice(0, i) + ch + word.slice(i + 1);
          if (words.has(cand)) {
            words.delete(cand);        // visited = removed
            next.push([cand, steps + 1]);
          }
        }
      }
    }
    queue = next;
  }
  return 0;
}`,
  };

  // ============ F29 — Network Delay Time ============
  J.F29 = {
    functionName: "networkDelayTime",
    signature: "function networkDelayTime(times: number[][], n: number, k: number): number",
    starter:
`function networkDelayTime(times, n, k) {
  // your code here
}
`,
    solution:
`function networkDelayTime(times, n, k) {
  // O(V^2) scan variant — JS has no built-in heap; for the heap version
  // see the Python reference solution.
  const graph = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) graph[u].push([v, w]);

  const dist = new Array(n + 1).fill(Infinity);
  const done = new Array(n + 1).fill(false);
  dist[k] = 0;
  for (let iter = 0; iter < n; iter++) {
    let node = -1;
    for (let i = 1; i <= n; i++) {
      if (!done[i] && (node === -1 || dist[i] < dist[node])) node = i;
    }
    if (node === -1 || dist[node] === Infinity) break;
    done[node] = true;                        // finalize (needs w >= 0!)
    for (const [nxt, w] of graph[node]) {
      if (dist[node] + w < dist[nxt]) dist[nxt] = dist[node] + w;
    }
  }
  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dist[i]);
  return ans === Infinity ? -1 : ans;
}`,
  };

  // ============ F30 — Pacific Atlantic Water Flow ============
  J.F30 = {
    functionName: "pacificAtlantic",
    signature: "function pacificAtlantic(heights: number[][]): number[][]",
    starter:
`function pacificAtlantic(heights) {
  // your code here
}
`,
    solution:
`function pacificAtlantic(heights) {
  if (!heights.length || !heights[0].length) return [];
  const R = heights.length, C = heights[0].length;

  function climb(starts) {
    const seen = new Set(starts.map(([r, c]) => r + "," + c));
    const stack = [...starts];
    while (stack.length) {
      const [r, c] = stack.pop();
      for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const nr = r + dr, nc = c + dc;
        const key = nr + "," + nc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && !seen.has(key) &&
            heights[nr][nc] >= heights[r][c]) {     // uphill or flat
          seen.add(key);
          stack.push([nr, nc]);
        }
      }
    }
    return seen;
  }

  const pacStarts = [], atlStarts = [];
  for (let c = 0; c < C; c++) { pacStarts.push([0, c]); atlStarts.push([R - 1, c]); }
  for (let r = 0; r < R; r++) { pacStarts.push([r, 0]); atlStarts.push([r, C - 1]); }
  const pacific = climb(pacStarts);
  const atlantic = climb(atlStarts);

  const out = [];
  for (const key of pacific) {
    if (atlantic.has(key)) out.push(key.split(",").map(Number));
  }
  return out;
}`,
    testsTransform:
      'result = result.map(p => p[0] + "," + p[1]).sort();',
  };

  // ============ F31 — House Robber ============
  J.F31 = {
    functionName: "rob",
    signature: "function rob(nums: number[]): number",
    starter:
`function rob(nums) {
  // your code here
}
`,
    solution:
`function rob(nums) {
  let take = 0, skip = 0;   // best ending with / without robbing previous house
  for (const x of nums) {
    const newTake = skip + x;          // capture before overwriting!
    skip = Math.max(take, skip);
    take = newTake;
  }
  return Math.max(take, skip);
}`,
  };

  // ============ F32 — Coin Change ============
  J.F32 = {
    functionName: "coinChange",
    signature: "function coinChange(coins: number[], amount: number): number",
    starter:
`function coinChange(coins, amount) {
  // your code here
}
`,
    solution:
`function coinChange(coins, amount) {
  const INF = amount + 1;                       // safe impossible marker
  const dp = new Array(amount + 1).fill(INF);   // dp[a] = min coins for amount a
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] <= amount ? dp[amount] : -1;
}`,
  };

  // ============ F33 — Longest Increasing Subsequence ============
  J.F33 = {
    functionName: "lengthOfLIS",
    signature: "function lengthOfLIS(nums: number[]): number",
    starter:
`function lengthOfLIS(nums) {
  // your code here
}
`,
    solution:
`function lengthOfLIS(nums) {
  const tails = [];   // tails[k] = smallest tail of an increasing subseq of length k+1
  for (const x of nums) {
    let lo = 0, hi = tails.length;   // bisect_left by hand (Module 6 boundary search)
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    if (lo === tails.length) tails.push(x);
    else tails[lo] = x;
  }
  return tails.length;
}`,
  };

  // ============ F34 — Word Break ============
  J.F34 = {
    functionName: "wordBreak",
    signature: "function wordBreak(s: string, wordDict: string[]): boolean",
    starter:
`function wordBreak(s, wordDict) {
  // your code here
}
`,
    solution:
`function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  let maxLen = 0;
  for (const w of words) maxLen = Math.max(maxLen, w.length);
  const dp = new Array(s.length + 1).fill(false);   // dp[i]: s.slice(0, i) breakable
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = Math.max(0, i - maxLen); j < i; j++) {
      if (dp[j] && words.has(s.slice(j, i))) { dp[i] = true; break; }
    }
  }
  return dp[s.length];
}`,
  };

  // ============ F35 — Longest Common Subsequence ============
  J.F35 = {
    functionName: "longestCommonSubsequence",
    signature: "function longestCommonSubsequence(text1: string, text2: string): number",
    starter:
`function longestCommonSubsequence(text1, text2) {
  // your code here
}
`,
    solution:
`function longestCommonSubsequence(t1, t2) {
  const m = t1.length, n = t2.length;
  // dp[i][j]: LCS of t1.slice(i), t2.slice(j) — extra row/col of zeros is the base case
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = t1[i] === t2[j]
        ? 1 + dp[i + 1][j + 1]
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  return dp[0][0];
}`,
  };

  // ============ F36 — Edit Distance ============
  J.F36 = {
    functionName: "minDistance",
    signature: "function minDistance(word1: string, word2: string): number",
    starter:
`function minDistance(word1, word2) {
  // your code here
}
`,
    solution:
`function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({ length: n + 1 }, (_, j) => j);   // row for empty word1
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];        // dp[i-1][j-1] before we overwrite it
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const cur = dp[j];
      if (word1[i - 1] === word2[j - 1]) dp[j] = prev;         // match: free
      else dp[j] = 1 + Math.min(prev, cur, dp[j - 1]);         // replace/delete/insert
      prev = cur;
    }
  }
  return dp[n];
}`,
  };

  // ============ F37 — Merge Intervals ============
  J.F37 = {
    functionName: "merge",
    signature: "function merge(intervals: number[][]): number[][]",
    starter:
`function merge(intervals) {
  // your code here
}
`,
    solution:
`function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const out = [];
  for (const [s, e] of intervals) {
    const last = out[out.length - 1];
    if (last && s <= last[1]) {
      last[1] = Math.max(last[1], e);   // max, not just e!
    } else {
      out.push([s, e]);
    }
  }
  return out;
}`,
  };

  // ============ F38 — Non-overlapping Intervals ============
  J.F38 = {
    functionName: "eraseOverlapIntervals",
    signature: "function eraseOverlapIntervals(intervals: number[][]): number",
    starter:
`function eraseOverlapIntervals(intervals) {
  // your code here
}
`,
    solution:
`function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);   // by END — the whole trick
  let removed = 0, lastEnd = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= lastEnd) lastEnd = e;         // keep it
    else removed++;                        // conflicts with a kept one
  }
  return removed;
}`,
  };

  // ============ F39 — Jump Game II ============
  J.F39 = {
    functionName: "jump",
    signature: "function jump(nums: number[]): number",
    starter:
`function jump(nums) {
  // your code here
}
`,
    solution:
`function jump(nums) {
  let jumps = 0, curEnd = 0, farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {   // never process the last index
    farthest = Math.max(farthest, i + nums[i]);
    if (i === curEnd) {                         // current BFS layer exhausted
      jumps++;
      curEnd = farthest;                        // next layer's right edge
    }
  }
  return jumps;
}`,
  };

  // ============ F40 — Meeting Rooms II ============
  J.F40 = {
    functionName: "minMeetingRooms",
    signature: "function minMeetingRooms(intervals: number[][]): number",
    starter:
`function minMeetingRooms(intervals) {
  // your code here
}
`,
    solution:
`function minMeetingRooms(intervals) {
  const events = [];
  for (const [s, e] of intervals) {
    events.push([s, 1]);     // need a room
    events.push([e, -1]);    // free a room
  }
  // ties: -1 sorts before +1 -> a room frees before it's claimed
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let rooms = 0, best = 0;
  for (const [, d] of events) {
    rooms += d;
    if (rooms > best) best = rooms;
  }
  return best;
}`,
  };

  // ============ F41 — Gas Station ============
  J.F41 = {
    functionName: "canCompleteCircuit",
    signature: "function canCompleteCircuit(gas: number[], cost: number[]): number",
    starter:
`function canCompleteCircuit(gas, cost) {
  // your code here
}
`,
    solution:
`function canCompleteCircuit(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    total += diff;
    tank += diff;
    if (tank < 0) {          // everything in start..i is disqualified
      start = i + 1;
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}`,
  };

  // ============ F42 — Kth Largest Element ============
  J.F42 = {
    functionName: "findKthLargest",
    signature: "function findKthLargest(nums: number[], k: number): number",
    starter:
`function findKthLargest(nums, k) {
  // your code here
}
`,
    solution:
`function findKthLargest(nums, k) {
  // JS has no built-in heap — this compact MinHeap is worth memorizing (Module 11).
  class MinHeap {
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
          const l = 2 * i + 1, r = l + 1;
          let m = i;
          if (l < a.length && a[l] < a[m]) m = l;
          if (r < a.length && a[r] < a[m]) m = r;
          if (m === i) break;
          [a[m], a[i]] = [a[i], a[m]]; i = m;
        }
      }
      return top;
    }
  }

  const h = new MinHeap();               // size-k min-heap of the k best
  for (const x of nums) {
    if (h.size < k) h.push(x);
    else if (x > h.peek()) { h.pop(); h.push(x); }
  }
  return h.peek();
}`,
  };

  // ============ F43 — Merge K Sorted Lists ============
  J.F43 = {
    functionName: "mergeKLists",
    signature: "function mergeKLists(lists: number[][]): number[]",
    starter:
`function mergeKLists(lists) {
  // your code here
}
`,
    solution:
`function mergeKLists(lists) {
  // Divide & conquer pairwise merging: also O(N log k), and needs no heap —
  // the honest JS answer. The heap version is the Python reference solution.
  if (!lists.length) return [];

  function mergeTwo(a, b) {
    const out = [];
    let i = 0, j = 0;
    while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++]);
    while (i < a.length) out.push(a[i++]);
    while (j < b.length) out.push(b[j++]);
    return out;
  }

  let cur = lists;
  while (cur.length > 1) {               // halve the list count each round
    const next = [];
    for (let i = 0; i < cur.length; i += 2) {
      next.push(i + 1 < cur.length ? mergeTwo(cur[i], cur[i + 1]) : cur[i]);
    }
    cur = next;
  }
  return cur[0];
}`,
  };

  // ============ F44 — Running Median of a Stream ============
  J.F44 = {
    functionName: "runningMedian",
    signature: "function runningMedian(nums: number[]): number[]",
    starter:
`function runningMedian(nums) {
  // your code here
}
`,
    solution:
`function runningMedian(nums) {
  // Sorted array + binary insert: splice is O(n) worst case, but simple and
  // honest for interview-sized inputs — say the trade-off out loud. The
  // O(log n) two-heap version is the Python reference solution (Module 11).
  const a = [];
  const out = [];
  for (const x of nums) {
    let lo = 0, hi = a.length;           // bisect_left by hand
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (a[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    a.splice(lo, 0, x);
    const n = a.length;
    out.push(n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2);
  }
  return out;
}`,
  };

  // ============ F45 — Task Scheduler ============
  J.F45 = {
    functionName: "leastInterval",
    signature: "function leastInterval(tasks: string[], n: number): number",
    starter:
`function leastInterval(tasks, n) {
  // your code here
}
`,
    solution:
`function leastInterval(tasks, n) {
  const counts = new Map();
  for (const t of tasks) counts.set(t, (counts.get(t) || 0) + 1);
  let maxCount = 0, ties = 0;
  for (const c of counts.values()) maxCount = Math.max(maxCount, c);
  for (const c of counts.values()) if (c === maxCount) ties++;
  // (maxCount-1) frames of width n+1, then one final slot per tied task;
  // if tasks outnumber the frame slots, no idling happens at all.
  return Math.max((maxCount - 1) * (n + 1) + ties, tasks.length);
}`,
  };

  // ============ F56 — LRU Cache ============
  J.F56 = {
    functionName: "lruRun",
    signature: "function lruRun(capacity: number, ops: string[], args: any[][]): any[]",
    starter:
`function lruRun(capacity, ops, args) {
  // your code here
}
`,
    solution:
`function lruRun(capacity, ops, args) {
  // JS's Map preserves insertion order — delete+set refreshes recency,
  // map.keys().next().value is the least-recently used. It's OrderedDict
  // in disguise; name the dict + doubly-linked-list design anyway.
  const cache = new Map();
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === "put") {
      const [key, value] = args[i];
      if (cache.has(key)) cache.delete(key);        // refresh recency
      cache.set(key, value);
      if (cache.size > capacity) {
        cache.delete(cache.keys().next().value);    // evict oldest
      }
      out.push(null);
    } else {                                        // get
      const key = args[i][0];
      if (cache.has(key)) {
        const v = cache.get(key);
        cache.delete(key);                          // get is a "use" too!
        cache.set(key, v);
        out.push(v);
      } else {
        out.push(-1);
      }
    }
  }
  return out;
}`,
  };

  // ============ F57 — Time-Based Key-Value Store ============
  J.F57 = {
    functionName: "timemapRun",
    signature: "function timemapRun(ops: string[], args: any[][]): any[]",
    starter:
`function timemapRun(ops, args) {
  // your code here
}
`,
    solution:
`function timemapRun(ops, args) {
  const store = new Map();       // key -> {times: [], values: []}, times sorted
  const out = [];
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === "set") {
      const [key, value, ts] = args[i];
      if (!store.has(key)) store.set(key, { times: [], values: [] });
      const e = store.get(key);
      e.times.push(ts);          // increasing input ts: append keeps it sorted
      e.values.push(value);
      out.push(null);
    } else {                     // get
      const [key, ts] = args[i];
      const e = store.get(key);
      if (!e) { out.push(""); continue; }
      // bisect_right by hand: first index with times[idx] > ts
      let lo = 0, hi = e.times.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (e.times[mid] <= ts) lo = mid + 1;
        else hi = mid;
      }
      out.push(lo ? e.values[lo - 1] : "");
    }
  }
  return out;
}`,
  };

  // ============ F66 — Two Sum, Unsorted ============
  J.F66 = {
    functionName: "twoSum",
    signature: "function twoSum(nums: number[], target: number): number[]",
    starter:
`function twoSum(nums, target) {
}
`,
    solution:
`function twoSum(nums, target) {
  const seen = new Map();            // value -> index
  for (let i = 0; i < nums.length; i++) {
    const j = seen.get(target - nums[i]);
    if (j !== undefined) return [j, i];
    seen.set(nums[i], i);            // check-before-insert: duplicates work
  }
  return [];
}`,
  };

  // ============ F67 — Valid Brackets ============
  J.F67 = {
    functionName: "isBalanced",
    signature: "function isBalanced(s: string): boolean",
    starter:
`function isBalanced(s) {
}
`,
    solution:
`function isBalanced(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch in pairs) {
      if (!stack.length || stack.pop() !== pairs[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
  };

  // ============ F68 — First Unique Character ============
  J.F68 = {
    functionName: "firstUnique",
    signature: "function firstUnique(s: string): number",
    starter:
`function firstUnique(s) {
}
`,
    solution:
`function firstUnique(s) {
  const counts = new Map();
  for (const ch of s) counts.set(ch, (counts.get(ch) || 0) + 1);
  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) return i;
  }
  return -1;
}`,
  };

  // ============ F69 — Search Insert Position ============
  J.F69 = {
    functionName: "searchInsert",
    signature: "function searchInsert(nums: number[], target: number): number",
    starter:
`function searchInsert(nums, target) {
}
`,
    solution:
`function searchInsert(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return lo;   // invariant: everything left of lo is < target
}`,
  };

  // ============ F70 — Best Window of Size K ============
  J.F70 = {
    functionName: "maxWindowSum",
    signature: "function maxWindowSum(nums: number[], k: number): number",
    starter:
`function maxWindowSum(nums, k) {
}
`,
    solution:
`function maxWindowSum(nums, k) {
  let window = 0;
  for (let i = 0; i < k; i++) window += nums[i];
  let best = window;               // NOT 0 — all-negative arrays exist
  for (let i = k; i < nums.length; i++) {
    window += nums[i] - nums[i - k];
    if (window > best) best = window;
  }
  return best;
}`,
  };

  // ============ F72 — FizzBuzz ============
  J.F72 = {
    functionName: "fizzBuzz",
    signature: "function fizzBuzz(n: number): string[]",
    starter:
`function fizzBuzz(n) {
}
`,
    solution:
`function fizzBuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    let s = "";
    if (i % 3 === 0) s += "Fizz";
    if (i % 5 === 0) s += "Buzz";
    out.push(s || String(i));
  }
  return out;
}`,
  };

  // ============ F73 — Run-Length Encoding ============
  J.F73 = {
    functionName: "rle",
    signature: "function rle(s: string): string",
    starter:
`function rle(s) {
}
`,
    solution:
`function rle(s) {
  if (!s) return "";
  const out = [];
  let runChar = s[0], runLen = 1;
  for (let i = 1; i < s.length; i++) {
    if (s[i] === runChar) {
      runLen++;
    } else {
      out.push(runChar + runLen);
      runChar = s[i]; runLen = 1;
    }
  }
  out.push(runChar + runLen);   // flush the final run!
  return out.join("");
}`,
  };

  // ============ F74 — Missing Number ============
  J.F74 = {
    functionName: "missingNumber",
    signature: "function missingNumber(nums: number[]): number",
    starter:
`function missingNumber(nums) {
}
`,
    solution:
`function missingNumber(nums) {
  const n = nums.length;
  let sum = 0;
  for (const x of nums) sum += x;
  return (n * (n + 1)) / 2 - sum;
}`,
  };

  // ============ F75 — Reverse a Linked List ============
  J.F75 = {
    functionName: "reverseList",
    signature: "function reverseList(head: ListNode | null): ListNode | null",
    starter:
`function reverseList(head) {
  // head is a ListNode (or null); fields: val, next
}
`,
    solution:
`function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const nxt = curr.next;   // save the rope before cutting it
    curr.next = prev;
    prev = curr; curr = nxt;
  }
  return prev;
}`,
    testsPrepare: "args = [_build_list(args[0])];",
    testsTransform: "result = _linked_to_list(result);",
  };

  // ============ F76 — Middle of the Linked List ============
  J.F76 = {
    functionName: "middleNode",
    signature: "function middleNode(head: ListNode): ListNode",
    starter:
`function middleNode(head) {
}
`,
    solution:
`function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
    testsPrepare: "args = [_build_list(args[0])];",
    testsTransform: "result = _linked_to_list(result);",
  };

  // ============ F77 — Linked List Cycle ============
  J.F77 = {
    functionName: "hasCycle",
    signature: "function hasCycle(head: ListNode | null): boolean",
    starter:
`function hasCycle(head) {
}
`,
    solution:
`function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;   // node identity, not value equality
  }
  return false;
}`,
    testsPrepare: "args = [_build_list_with_cycle(args[0], args[1])];",
  };

  // ============ F78 — Merge Two Sorted Lists ============
  J.F78 = {
    functionName: "mergeLists",
    signature: "function mergeLists(a: ListNode | null, b: ListNode | null): ListNode | null",
    starter:
`function mergeLists(a, b) {
}
`,
    solution:
`function mergeLists(a, b) {
  const dummy = new ListNode();
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next; }
    else                { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a || b;      // the leftover list is already sorted
  return dummy.next;
}`,
    testsPrepare: "args = [_build_list(args[0]), _build_list(args[1])];",
    testsTransform: "result = _linked_to_list(result);",
  };

  // ============ F79 — Hamming Weight ============
  J.F79 = {
    functionName: "hammingWeight",
    signature: "function hammingWeight(n: number): number",
    starter:
`function hammingWeight(n) {
}
`,
    solution:
`function hammingWeight(n) {
  let count = 0;
  while (n) {
    n &= n - 1;    // clear the lowest set bit
    count++;
  }
  return count;
}`,
  };

  // ============ F80 — Single Number ============
  J.F80 = {
    functionName: "singleNumber",
    signature: "function singleNumber(nums: number[]): number",
    starter:
`function singleNumber(nums) {
}
`,
    solution:
`function singleNumber(nums) {
  let acc = 0;
  for (const x of nums) acc ^= x;
  return acc;
}`,
  };

  // ============ F81 — Count Primes ============
  J.F81 = {
    functionName: "countPrimes",
    signature: "function countPrimes(n: number): number",
    starter:
`function countPrimes(n) {
}
`,
    solution:
`function countPrimes(n) {
  if (n < 3) return 0;
  const isPrime = new Array(n).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let i = 2; i * i < n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j < n; j += i) isPrime[j] = false;
    }
  }
  let count = 0;
  for (const p of isPrime) if (p) count++;
  return count;
}`,
  };

  // ============ F82 — Fast Modular Power ============
  J.F82 = {
    functionName: "powerMod",
    signature: "function powerMod(base: number, exp: number, mod: number): number",
    starter:
`function powerMod(base, exp, mod) {
}
`,
    solution:
`function powerMod(base, exp, mod) {
  // BigInt keeps base*base exact past 2^53 (e.g. squaring near 10^9+7)
  let result = 1n;
  let b = BigInt(base) % BigInt(mod);
  let e = BigInt(exp);
  const m = BigInt(mod);
  while (e) {
    if (e & 1n) result = result * b % m;
    b = b * b % m;
    e >>= 1n;
  }
  return Number(result);
}`,
  };

  // =================================================================
  // Apply all impls to window.QUESTIONS
  // =================================================================
  if (!window.QUESTIONS) {
    console.warn("[questions-js.js] window.QUESTIONS not present; nothing to attach.");
    return;
  }
  for (const qid of Object.keys(J)) {
    const impl = J[qid];
    const q = window.QUESTIONS[qid];
    if (!q) { console.warn("[questions-js.js] missing question", qid); continue; }

    q.js = {
      functionName: impl.functionName,
      signature: impl.signature,
      starter: impl.starter,
      solution: impl.solution,
    };

    if (Array.isArray(q.tests)) {
      for (const tc of q.tests) {
        if (impl.testsPrepare !== undefined) tc.prepareJs = impl.testsPrepare;
        if (impl.testsTransform !== undefined) tc.transformJs = impl.testsTransform;
      }
    }
  }
  window.JS_IMPLS = J;
})();
