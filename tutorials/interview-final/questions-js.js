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
