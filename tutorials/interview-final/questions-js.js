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
