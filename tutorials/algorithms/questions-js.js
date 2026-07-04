/* ============================================================
   questions-js.js — JavaScript implementations for the workbench.

   Sidecar file: loaded AFTER questions.js. For each Python
   question, defines `J.QXX = { functionName, signature, starter,
   solution, testsPrepare?, testsTransform? }` and then merges
   that into `window.QUESTIONS[QXX].js` plus per-test prepareJs /
   transformJs overrides.

   Conventions:
   - Function names use camelCase (idiomatic JS).
   - Helpers (TreeNode, ListNode, _build_tree, _build_list,
     _build_list_with_cycle, _linked_to_list, _find_node,
     _tree_to_level) are injected by runner.js HELPERS_JS.
   - Tests share the args/expected from the Python definitions;
     only prepare/transform need a JS version, supplied via
     `testsPrepare` / `testsTransform` (applied to every test
     case for that question).
============================================================ */

(function () {
  "use strict";
  const J = {};

  // ============ Q01 — HTML Tag Validator ============
  J.Q01 = {
    functionName: "validateHtmlTags",
    signature: "function validateHtmlTags(html: string): boolean",
    starter:
`function validateHtmlTags(html) {
  // your code here
}
`,
    solution:
`function validateHtmlTags(html) {
  const stack = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      const j = html.indexOf('>', i);
      if (j === -1) return false;
      const tag = html.slice(i + 1, j);
      if (tag.startsWith('/')) {
        if (!stack.length || stack[stack.length - 1] !== tag.slice(1)) return false;
        stack.pop();
      } else {
        stack.push(tag.split(/\\s+/)[0]);
      }
      i = j;
    }
    i++;
  }
  return stack.length === 0;
}`,
  };

  // ============ Q02 — HTML Advanced ============
  J.Q02 = {
    functionName: "validateHtmlAdvanced",
    signature: "function validateHtmlAdvanced(html: string): boolean",
    starter:
`function validateHtmlAdvanced(html) {
  // your code here
}
`,
    solution:
`function validateHtmlAdvanced(html) {
  const VOID = new Set(['br','img','hr','meta','link','input','area','base',
                        'col','embed','param','source','track','wbr']);
  const stack = [];
  let i = 0;
  const n = html.length;
  while (i < n) {
    if (html.startsWith('<!--', i)) {
      const end = html.indexOf('-->', i + 4);
      if (end === -1) return false;
      i = end + 3; continue;
    }
    if (html.startsWith('<![CDATA[', i)) {
      const end = html.indexOf(']]>', i + 9);
      if (end === -1) return false;
      i = end + 3; continue;
    }
    if (html[i] === '<') {
      let j = i + 1, quote = null;
      while (j < n) {
        const c = html[j];
        if (quote) { if (c === quote) quote = null; }
        else if (c === '"' || c === "'") quote = c;
        else if (c === '>') break;
        j++;
      }
      if (j >= n) return false;
      let body = html.slice(i + 1, j).trim();
      if (!body) return false;
      const selfClose = body.endsWith('/');
      if (selfClose) body = body.slice(0, -1).trim();
      if (body.startsWith('/')) {
        const parts = body.slice(1).split(/\\s+/).filter(Boolean);
        if (!parts.length) return false;
        const name = parts[0].toLowerCase();
        if (!VOID.has(name)) {
          if (!stack.length || stack[stack.length - 1] !== name) return false;
          stack.pop();
        }
      } else {
        const name = body.split(/\\s+/)[0].toLowerCase();
        if (!selfClose && !VOID.has(name)) stack.push(name);
      }
      i = j + 1; continue;
    }
    i++;
  }
  return stack.length === 0;
}`,
  };

  // ============ Q03 — Run-Length Encoding ============
  J.Q03 = {
    functionName: "runLengthEncode",
    signature: "function runLengthEncode(s: string): string",
    starter:
`function runLengthEncode(s) {
  // your code here
}
`,
    solution:
`function runLengthEncode(s) {
  if (!s) return '';
  const out = [];
  let count = 1;
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) count++;
    else { out.push(s[i - 1] + count); count = 1; }
  }
  out.push(s[s.length - 1] + count);
  const result = out.join('');
  return result.length < s.length ? result : s;
}`,
  };

  // ============ Q04 — Valid Palindrome ============
  J.Q04 = {
    functionName: "isPalindrome",
    signature: "function isPalindrome(s: string): boolean",
    starter:
`function isPalindrome(s) {
  // your code here
}
`,
    solution:
`function isPalindrome(s) {
  const alnum = (c) => /[A-Za-z0-9]/.test(c);
  let l = 0, r = s.length - 1;
  while (l < r) {
    while (l < r && !alnum(s[l])) l++;
    while (l < r && !alnum(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}`,
  };

  // ============ Q05 — Shortest Path in Unweighted Graph ============
  J.Q05 = {
    functionName: "shortestPath",
    signature: "function shortestPath(n, edges, start, end): number",
    starter:
`function shortestPath(n, edges, start, end) {
  // your code here
}
`,
    solution:
`function shortestPath(n, edges, start, end) {
  if (start === end) return 0;
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { graph[u].push(v); graph[v].push(u); }
  const visited = new Set([start]);
  const queue = [[start, 0]];
  let head = 0;
  while (head < queue.length) {
    const [node, dist] = queue[head++];
    for (const nxt of graph[node]) {
      if (nxt === end) return dist + 1;
      if (!visited.has(nxt)) { visited.add(nxt); queue.push([nxt, dist + 1]); }
    }
  }
  return -1;
}`,
  };

  // ============ Q06 — Word Ladder ============
  J.Q06 = {
    functionName: "wordLadder",
    signature: "function wordLadder(begin, end, words): number",
    starter:
`function wordLadder(begin, end, words) {
  // your code here
}
`,
    solution:
`function wordLadder(begin, end, words) {
  const wordSet = new Set(words);
  if (!wordSet.has(end)) return 0;
  const L = begin.length;
  const patterns = new Map();
  for (const w of wordSet) {
    for (let i = 0; i < L; i++) {
      const key = w.slice(0, i) + '*' + w.slice(i + 1);
      if (!patterns.has(key)) patterns.set(key, []);
      patterns.get(key).push(w);
    }
  }
  const queue = [[begin, 1]];
  const seen = new Set([begin]);
  let head = 0;
  while (head < queue.length) {
    const [word, d] = queue[head++];
    for (let i = 0; i < L; i++) {
      const key = word.slice(0, i) + '*' + word.slice(i + 1);
      const bucket = patterns.get(key) || [];
      for (const nxt of bucket) {
        if (nxt === end) return d + 1;
        if (!seen.has(nxt)) { seen.add(nxt); queue.push([nxt, d + 1]); }
      }
      patterns.set(key, []);
    }
  }
  return 0;
}`,
  };

  // ============ Q09 — Balanced Parentheses ============
  J.Q09 = {
    functionName: "isValid",
    signature: "function isValid(s: string): boolean",
    starter:
`function isValid(s) {
  // your code here
}
`,
    solution:
`function isValid(s) {
  const pair = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else {
      if (!stack.length || stack[stack.length - 1] !== pair[ch]) return false;
      stack.pop();
    }
  }
  return stack.length === 0;
}`,
  };

  // ============ Q10 — First Non-Repeating Character ============
  J.Q10 = {
    functionName: "firstUniqChar",
    signature: "function firstUniqChar(s: string): number",
    starter:
`function firstUniqChar(s) {
  // your code here
}
`,
    solution:
`function firstUniqChar(s) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (let i = 0; i < s.length; i++) if (count[s[i]] === 1) return i;
  return -1;
}`,
  };

  // ============ Q12 — Move Zeroes (mutates) ============
  J.Q12 = {
    functionName: "moveZeroes",
    signature: "function moveZeroes(nums: number[]): void  // mutates in place",
    starter:
`function moveZeroes(nums) {
  // mutate nums in place
}
`,
    solution:
`function moveZeroes(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) { nums[write++] = nums[read]; }
  }
  for (let i = write; i < nums.length; i++) nums[i] = 0;
}`,
    testsTransform: "result = args[0];",
  };

  // ============ Q13 — Evaluate RPN ============
  J.Q13 = {
    functionName: "evalRpn",
    signature: "function evalRpn(tokens: string[]): number",
    starter:
`function evalRpn(tokens) {
  // your code here
}
`,
    solution:
`function evalRpn(tokens) {
  const stack = [];
  for (const t of tokens) {
    if (t === '+' || t === '-' || t === '*' || t === '/') {
      const b = stack.pop(), a = stack.pop();
      let v;
      if (t === '+') v = a + b;
      else if (t === '-') v = a - b;
      else if (t === '*') v = a * b;
      else v = Math.trunc(a / b);   // truncate toward zero, like the RPN spec
      stack.push(v);
    } else {
      stack.push(parseInt(t, 10));
    }
  }
  return stack[0];
}`,
  };

  // ============ Q14 — Basic Calculator II ============
  J.Q14 = {
    functionName: "calculate",
    signature: "function calculate(s: string): number",
    starter:
`function calculate(s) {
  // your code here
}
`,
    solution:
`function calculate(s) {
  const stack = [];
  let num = 0, op = '+';
  const n = s.length;
  for (let i = 0; i < n; i++) {
    const ch = s[i];
    if (ch >= '0' && ch <= '9') num = num * 10 + (ch.charCodeAt(0) - 48);
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || i === n - 1) {
      if (op === '+') stack.push(num);
      else if (op === '-') stack.push(-num);
      else if (op === '*') stack.push(stack.pop() * num);
      else stack.push(Math.trunc(stack.pop() / num));
      op = ch;
      num = 0;
    }
  }
  return stack.reduce((a, b) => a + b, 0);
}`,
  };

  // ============ Q17 — Daily Temperatures ============
  J.Q17 = {
    functionName: "dailyTemperatures",
    signature: "function dailyTemperatures(temps: number[]): number[]",
    starter:
`function dailyTemperatures(temps) {
  // your code here
}
`,
    solution:
`function dailyTemperatures(temps) {
  const n = temps.length;
  const result = new Array(n).fill(0);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      const j = stack.pop();
      result[j] = i - j;
    }
    stack.push(i);
  }
  return result;
}`,
  };

  // ============ Q18 — Simplify Path ============
  J.Q18 = {
    functionName: "simplifyPath",
    signature: "function simplifyPath(path: string): string",
    starter:
`function simplifyPath(path) {
  // your code here
}
`,
    solution:
`function simplifyPath(path) {
  const stack = [];
  for (const part of path.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') stack.pop();
    else stack.push(part);
  }
  return '/' + stack.join('/');
}`,
  };

  // ============ Q19 — Shortest Path Binary Matrix ============
  J.Q19 = {
    functionName: "shortestPathBinaryMatrix",
    signature: "function shortestPathBinaryMatrix(grid: number[][]): number",
    starter:
`function shortestPathBinaryMatrix(grid) {
  // your code here
}
`,
    solution:
`function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1;
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const queue = [[0, 0, 1]];
  grid[0][0] = 1;
  let head = 0;
  while (head < queue.length) {
    const [r, c, d] = queue[head++];
    if (r === n - 1 && c === n - 1) return d;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
        grid[nr][nc] = 1;
        queue.push([nr, nc, d + 1]);
      }
    }
  }
  return -1;
}`,
  };

  // ============ Q20 — Word Search II ============
  J.Q20 = {
    functionName: "findWords",
    signature: "function findWords(board: string[][], words: string[]): string[]",
    starter:
`function findWords(board, words) {
  // your code here
}
`,
    solution:
`function findWords(board, words) {
  const TRIE = {};
  const END = '$';
  for (const w of words) {
    let node = TRIE;
    for (const c of w) {
      if (!(c in node)) node[c] = {};
      node = node[c];
    }
    node[END] = w;
  }
  const rows = board.length, cols = board[0].length;
  const found = [];
  function dfs(r, c, node) {
    const ch = board[r][c];
    if (!(ch in node)) return;
    const nxt = node[ch];
    if (END in nxt) { found.push(nxt[END]); delete nxt[END]; }
    board[r][c] = '#';
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] !== '#') {
        dfs(nr, nc, nxt);
      }
    }
    board[r][c] = ch;
    if (Object.keys(nxt).length === 0) delete node[ch];
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) dfs(r, c, TRIE);
  }
  return found;
}`,
  };

  // ============ Q21 — Two Sum ============
  J.Q21 = {
    functionName: "twoSum",
    signature: "function twoSum(nums: number[], target: number): number[]",
    starter:
`function twoSum(nums, target) {
  // your code here
}
`,
    solution:
`function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (seen.has(comp)) return [seen.get(comp), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
  };

  // ============ Q22 — Reverse Integer (32-bit safe) ============
  J.Q22 = {
    functionName: "reverse",
    signature: "function reverse(x: number): number",
    starter:
`function reverse(x) {
  // your code here
}
`,
    solution:
`function reverse(x) {
  const INT_MAX = 2147483647, INT_MIN = -2147483648;
  let result = 0;
  while (x !== 0) {
    const digit = x % 10;          // JS % preserves sign (matches C/Java)
    x = (x - digit) / 10;          // exact truncation toward zero
    if (result > Math.floor(INT_MAX / 10) ||
        (result === Math.floor(INT_MAX / 10) && digit > 7)) return 0;
    if (result < Math.floor(INT_MIN / 10) ||
        (result === Math.floor(INT_MIN / 10) && digit < -8)) return 0;
    result = result * 10 + digit;
  }
  return result;
}`,
  };

  // ============ Q23 — Rotting Oranges ============
  J.Q23 = {
    functionName: "orangesRotting",
    signature: "function orangesRotting(grid: number[][]): number",
    starter:
`function orangesRotting(grid) {
  // your code here
}
`,
    solution:
`function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  const queue = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c, 0]);
      else if (grid[r][c] === 1) fresh++;
    }
  }
  let minutes = 0, head = 0;
  while (head < queue.length) {
    const [r, c, m] = queue[head++];
    minutes = m;
    for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
        grid[nr][nc] = 2;
        fresh--;
        queue.push([nr, nc, m + 1]);
      }
    }
  }
  return fresh === 0 ? minutes : -1;
}`,
  };

  // ============ Q25 — Container With Most Water ============
  J.Q25 = {
    functionName: "maxArea",
    signature: "function maxArea(height: number[]): number",
    starter:
`function maxArea(height) {
  // your code here
}
`,
    solution:
`function maxArea(height) {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    const w = r - l;
    best = Math.max(best, Math.min(height[l], height[r]) * w);
    if (height[l] < height[r]) l++; else r--;
  }
  return best;
}`,
  };

  // ============ Q26 — Trapping Rain Water ============
  J.Q26 = {
    functionName: "trap",
    signature: "function trap(height: number[]): number",
    starter:
`function trap(height) {
  // your code here
}
`,
    solution:
`function trap(height) {
  if (!height.length) return 0;
  let l = 0, r = height.length - 1;
  let lmax = 0, rmax = 0, water = 0;
  while (l < r) {
    if (height[l] < height[r]) {
      if (height[l] >= lmax) lmax = height[l];
      else water += lmax - height[l];
      l++;
    } else {
      if (height[r] >= rmax) rmax = height[r];
      else water += rmax - height[r];
      r--;
    }
  }
  return water;
}`,
  };

  // ============ Q27 — Happy Number ============
  J.Q27 = {
    functionName: "isHappy",
    signature: "function isHappy(n: number): boolean",
    starter:
`function isHappy(n) {
  // your code here
}
`,
    solution:
`function isHappy(n) {
  const next = (num) => {
    let s = 0;
    while (num > 0) {
      const d = num % 10;
      s += d * d;
      num = Math.floor(num / 10);
    }
    return s;
  };
  let slow = n, fast = next(n);
  while (fast !== 1 && slow !== fast) {
    slow = next(slow);
    fast = next(next(fast));
  }
  return fast === 1;
}`,
  };

  // ============ Q29 — Remove Duplicates from Sorted Array ============
  J.Q29 = {
    functionName: "removeDuplicates",
    signature: "function removeDuplicates(nums: number[]): number  // also mutates",
    starter:
`function removeDuplicates(nums) {
  // mutate nums in place; return new length
}
`,
    solution:
`function removeDuplicates(nums) {
  if (!nums.length) return 0;
  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[read - 1]) {
      nums[write++] = nums[read];
    }
  }
  return write;
}`,
    testsTransform: "result = [result, args[0].slice(0, result)];",
  };

  // ============ Q30 — Count Primes ============
  J.Q30 = {
    functionName: "countPrimes",
    signature: "function countPrimes(n: number): number",
    starter:
`function countPrimes(n) {
  // your code here
}
`,
    solution:
`function countPrimes(n) {
  if (n <= 2) return 0;
  const isPrime = new Array(n).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let i = 2; i * i < n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j < n; j += i) isPrime[j] = false;
    }
  }
  let count = 0;
  for (let i = 2; i < n; i++) if (isPrime[i]) count++;
  return count;
}`,
  };

  // ============ Q31 — Pow(x, n) ============
  J.Q31 = {
    functionName: "myPow",
    signature: "function myPow(x: number, n: number): number",
    starter:
`function myPow(x, n) {
  // your code here
}
`,
    solution:
`function myPow(x, n) {
  if (n < 0) { x = 1 / x; n = -n; }
  let result = 1, base = x;
  while (n > 0) {
    if (n % 2 === 1) result *= base;
    base *= base;
    n = Math.floor(n / 2);
  }
  return result;
}`,
  };

  // ============ Q33 — Longest Substring Without Repeating ============
  J.Q33 = {
    functionName: "lengthOfLongestSubstring",
    signature: "function lengthOfLongestSubstring(s: string): number",
    starter:
`function lengthOfLongestSubstring(s) {
  // your code here
}
`,
    solution:
`function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) {
      left = last.get(ch) + 1;
    }
    last.set(ch, right);
    if (right - left + 1 > best) best = right - left + 1;
  }
  return best;
}`,
  };

  // ============ Q34 — Minimum Window Substring ============
  J.Q34 = {
    functionName: "minWindow",
    signature: "function minWindow(s: string, t: string): string",
    starter:
`function minWindow(s, t) {
  // your code here
}
`,
    solution:
`function minWindow(s, t) {
  if (!s || !t || s.length < t.length) return '';
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  const required = need.size;
  const have = new Map();
  let formed = 0;
  let bestLen = Infinity, bl = 0, br = 0;
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    have.set(c, (have.get(c) || 0) + 1);
    if (need.has(c) && have.get(c) === need.get(c)) formed++;
    while (formed === required) {
      if (right - left + 1 < bestLen) {
        bestLen = right - left + 1;
        bl = left; br = right;
      }
      const lc = s[left];
      have.set(lc, have.get(lc) - 1);
      if (need.has(lc) && have.get(lc) < need.get(lc)) formed--;
      left++;
    }
  }
  return bestLen === Infinity ? '' : s.slice(bl, br + 1);
}`,
  };

  // ============ Q35 — Lowest Common Ancestor ============
  J.Q35 = {
    functionName: "lowestCommonAncestor",
    signature: "function lowestCommonAncestor(root, p, q): TreeNode | null",
    starter:
`function lowestCommonAncestor(root, p, q) {
  // your code here
}
`,
    solution:
`function lowestCommonAncestor(root, p, q) {
  if (root === null || root === p || root === q) return root;
  const L = lowestCommonAncestor(root.left, p, q);
  const R = lowestCommonAncestor(root.right, p, q);
  if (L && R) return root;
  return L || R;
}`,
    testsPrepare:
`const root_ = _build_tree(args[0]);
const p_ = _find_node(root_, args[1]);
const q_ = _find_node(root_, args[2]);
args = [root_, p_, q_];`,
    testsTransform: "result = result !== null ? result.val : null;",
  };

  // ============ Q36 — Validate BST ============
  J.Q36 = {
    functionName: "isValidBst",
    signature: "function isValidBst(root: TreeNode | null): boolean",
    starter:
`function isValidBst(root) {
  // your code here
}
`,
    solution:
`function isValidBst(root) {
  const chk = (node, lo, hi) => {
    if (node === null) return true;
    if (!(lo < node.val && node.val < hi)) return false;
    return chk(node.left, lo, node.val) && chk(node.right, node.val, hi);
  };
  return chk(root, -Infinity, Infinity);
}`,
    testsPrepare: "args = [_build_tree(args[0])];",
  };

  // ============ Q37 — Reverse Linked List ============
  J.Q37 = {
    functionName: "reverseList",
    signature: "function reverseList(head: ListNode | null): ListNode | null",
    starter:
`function reverseList(head) {
  // your code here
}
`,
    solution:
`function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const nxt = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nxt;
  }
  return prev;
}`,
    testsPrepare: "args = [_build_list(args[0])];",
    testsTransform: "result = _linked_to_list(result);",
  };

  // ============ Q38 — Linked List Cycle II ============
  J.Q38 = {
    functionName: "detectCycle",
    signature: "function detectCycle(head: ListNode | null): ListNode | null",
    starter:
`function detectCycle(head) {
  // your code here
}
`,
    solution:
`function detectCycle(head) {
  let slow = head, fast = head;
  let met = false;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) { met = true; break; }
  }
  if (!met) return null;
  slow = head;
  while (slow !== fast) {
    slow = slow.next;
    fast = fast.next;
  }
  return slow;
}`,
    testsPrepare: "args = [_build_list_with_cycle(args[0], args[1])];",
    testsTransform: "result = result !== null ? result.val : null;",
  };

  // ============ Q39 — Merge Two Sorted Lists ============
  J.Q39 = {
    functionName: "mergeTwoLists",
    signature: "function mergeTwoLists(l1, l2): ListNode | null",
    starter:
`function mergeTwoLists(l1, l2) {
  // your code here
}
`,
    solution:
`function mergeTwoLists(l1, l2) {
  const dummy = new ListNode();
  let tail = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
    else { tail.next = l2; l2 = l2.next; }
    tail = tail.next;
  }
  tail.next = l1 || l2;
  return dummy.next;
}`,
    testsPrepare: "args = [_build_list(args[0]), _build_list(args[1])];",
    testsTransform: "result = _linked_to_list(result);",
  };

  // ============ Q40 — Kth Largest Element ============
  J.Q40 = {
    functionName: "findKthLargest",
    signature: "function findKthLargest(nums: number[], k: number): number",
    starter:
`function findKthLargest(nums, k) {
  // your code here
}
`,
    solution:
`// JS has no built-in heap. We use sort, which is O(n log n).
// (To match Python's O(n log k) heap version, implement a size-k min-heap.)
function findKthLargest(nums, k) {
  const sorted = [...nums].sort((a, b) => a - b);
  return sorted[sorted.length - k];
}`,
  };

  // ============ Q41 — Climbing Stairs ============
  J.Q41 = {
    functionName: "climbStairs",
    signature: "function climbStairs(n: number): number",
    starter:
`function climbStairs(n) {
  // your code here
}
`,
    solution:
`function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    const c = a + b;
    a = b; b = c;
  }
  return b;
}`,
  };

  // ============ Q42 — Coin Change ============
  J.Q42 = {
    functionName: "coinChange",
    signature: "function coinChange(coins: number[], amount: number): number",
    starter:
`function coinChange(coins, amount) {
  // your code here
}
`,
    solution:
`function coinChange(coins, amount) {
  const INF = amount + 1;
  const dp = new Array(amount + 1).fill(INF);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] === INF ? -1 : dp[amount];
}`,
  };

  // ============ Q43 — Longest Increasing Subsequence ============
  J.Q43 = {
    functionName: "lengthOfLis",
    signature: "function lengthOfLis(nums: number[]): number",
    starter:
`function lengthOfLis(nums) {
  // your code here
}
`,
    solution:
`function lengthOfLis(nums) {
  // tails[k] = smallest tail of any increasing subseq of length k+1
  const tails = [];
  for (const x of nums) {
    // lower_bound for x
    let lo = 0, hi = tails.length;
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

  // ============ Q44 — Search in Rotated Sorted Array ============
  J.Q44 = {
    functionName: "search",
    signature: "function search(nums: number[], target: number): number",
    starter:
`function search(nums, target) {
  // your code here
}
`,
    solution:
`function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
  };

  // ============ Q45 — Single Number (XOR) ============
  J.Q45 = {
    functionName: "singleNumber",
    signature: "function singleNumber(nums: number[]): number",
    starter:
`function singleNumber(nums) {
  // your code here
}
`,
    solution:
`function singleNumber(nums) {
  let r = 0;
  for (const x of nums) r ^= x;
  return r;
}`,
  };

  // ============ Q46 — Merge Intervals ============
  J.Q46 = {
    functionName: "merge",
    signature: "function merge(intervals: number[][]): number[][]",
    starter:
`function merge(intervals) {
  // your code here
}
`,
    solution:
`function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [intervals[0].slice()];
  for (let i = 1; i < intervals.length; i++) {
    const [s, e] = intervals[i];
    if (s <= out[out.length - 1][1]) {
      out[out.length - 1][1] = Math.max(out[out.length - 1][1], e);
    } else {
      out.push([s, e]);
    }
  }
  return out;
}`,
  };

  // ============ Q47 — Subsets ============
  J.Q47 = {
    functionName: "subsets",
    signature: "function subsets(nums: number[]): number[][]",
    starter:
`function subsets(nums) {
  // your code here
}
`,
    solution:
`function subsets(nums) {
  const out = [];
  const path = [];
  function bt(start) {
    out.push(path.slice());                   // CRITICAL: copy
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      bt(i + 1);
      path.pop();
    }
  }
  bt(0);
  return out;
}`,
  };

  // ============ Q48 — Course Schedule ============
  J.Q48 = {
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
  const inDeg = new Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    graph[b].push(a);
    inDeg[a]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (inDeg[i] === 0) queue.push(i);
  let head = 0, seen = 0;
  while (head < queue.length) {
    const node = queue[head++];
    seen++;
    for (const nxt of graph[node]) {
      if (--inDeg[nxt] === 0) queue.push(nxt);
    }
  }
  return seen === numCourses;
}`,
  };

  // ============ Q49 — Number of Connected Components ============
  J.Q49 = {
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
  const rank = new Array(n).fill(0);
  let comps = n;
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    let ra = find(a), rb = find(b);
    if (ra === rb) return false;
    if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
    parent[rb] = ra;
    if (rank[ra] === rank[rb]) rank[ra]++;
    return true;
  }
  for (const [a, b] of edges) if (union(a, b)) comps--;
  return comps;
}`,
  };

  // ============ Q50 — Implement Trie (class) ============
  J.Q50 = {
    functionName: "Trie",
    signature: "class Trie { insert(word); search(word): bool; startsWith(prefix): bool }",
    starter:
`class Trie {
  constructor() {
    // your code here
  }
  insert(word) {}
  search(word) {}
  startsWith(prefix) {}
}
`,
    solution:
`class Trie {
  constructor() { this.root = {}; }
  insert(word) {
    let node = this.root;
    for (const c of word) {
      if (!(c in node)) node[c] = {};
      node = node[c];
    }
    node['$'] = true;
  }
  _walk(s) {
    let node = this.root;
    for (const c of s) {
      if (!(c in node)) return null;
      node = node[c];
    }
    return node;
  }
  search(word) {
    const n = this._walk(word);
    return n !== null && n['$'] === true;
  }
  startsWith(prefix) {
    return this._walk(prefix) !== null;
  }
}`,
    // Class-based: prepare runs the op sequence and writes `result` itself.
    // 'starts_with' in the ops array maps to JS method 'startsWith'.
    testsPrepare:
`const ops = args[0], vals = args[1];
result = [];
let t = null;
for (let i = 0; i < ops.length; i++) {
  const op = ops[i], v = vals[i];
  if (op === 'Trie') { t = new Trie(); result.push(null); }
  else if (op === 'insert') { t.insert(...v); result.push(null); }
  else if (op === 'search') { result.push(!!t.search(...v)); }
  else if (op === 'starts_with') { result.push(!!t.startsWith(...v)); }
}`,
  };

  // ============ Q51 — Jump Game ============
  J.Q51 = {
    functionName: "canJump",
    signature: "function canJump(nums: number[]): boolean",
    starter:
`function canJump(nums) {
  // your code here
}
`,
    solution:
`function canJump(nums) {
  let furthest = 0;
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    if (i > furthest) return false;
    if (i + nums[i] > furthest) furthest = i + nums[i];
    if (furthest >= n - 1) return true;
  }
  return true;
}`,
  };

  // ============ Q54 — Maximum Subarray (Kadane) ============
  J.Q54 = {
    functionName: "maxSubarray",
    signature: "function maxSubarray(nums: number[]): number",
    starter:
`function maxSubarray(nums) {
  // your code here
}
`,
    solution:
`function maxSubarray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    if (cur > best) best = cur;
  }
  return best;
}`,
  };

  // ============ Q55 — Best Time to Buy and Sell Stock ============
  J.Q55 = {
    functionName: "maxProfit",
    signature: "function maxProfit(prices: number[]): number",
    starter:
`function maxProfit(prices) {
  // your code here
}
`,
    solution:
`function maxProfit(prices) {
  if (!prices.length) return 0;
  let best = 0;
  let lo = prices[0];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] < lo) lo = prices[i];
    else if (prices[i] - lo > best) best = prices[i] - lo;
  }
  return best;
}`,
  };

  // ============ Q56 — 3Sum ============
  J.Q56 = {
    functionName: "threeSum",
    signature: "function threeSum(nums: number[]): number[][]",
    starter:
`function threeSum(nums) {
  // your code here
}
`,
    solution:
`function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const out = [];
  const n = nums.length;
  for (let i = 0; i < n - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = n - 1;
    while (l < r) {
      const s = nums[i] + nums[l] + nums[r];
      if (s === 0) {
        out.push([nums[i], nums[l], nums[r]]);
        l++; r--;
        while (l < r && nums[l] === nums[l - 1]) l++;
        while (l < r && nums[r] === nums[r + 1]) r--;
      } else if (s < 0) l++;
      else r--;
    }
  }
  return out;
}`,
  };

  // ============ Q57 — Add Two Numbers (Linked List) ============
  J.Q57 = {
    functionName: "addTwoNumbers",
    signature: "function addTwoNumbers(l1, l2): ListNode",
    starter:
`function addTwoNumbers(l1, l2) {
  // your code here
}
`,
    solution:
`function addTwoNumbers(l1, l2) {
  const dummy = new ListNode();
  let tail = dummy, carry = 0;
  while (l1 || l2 || carry) {
    const a = l1 ? l1.val : 0;
    const b = l2 ? l2.val : 0;
    const s = a + b + carry;
    carry = Math.floor(s / 10);
    tail.next = new ListNode(s % 10);
    tail = tail.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}`,
    testsPrepare: "args = [_build_list(args[0]), _build_list(args[1])];",
    testsTransform: "result = _linked_to_list(result);",
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

    // Attach the JS implementation
    q.js = {
      functionName: impl.functionName,
      signature: impl.signature,
      starter: impl.starter,
      solution: impl.solution,
    };

    // Apply per-question prepare/transform to every test case
    if (Array.isArray(q.tests)) {
      for (const tc of q.tests) {
        if (impl.testsPrepare !== undefined) tc.prepareJs = impl.testsPrepare;
        if (impl.testsTransform !== undefined) tc.transformJs = impl.testsTransform;
      }
    }
  }
  window.JS_IMPLS = J;
})();
