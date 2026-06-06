/* ============================================================
   questions.js — Question bank with test cases + solutions.
   Each question definition is consumed by app.js to render
   problem cards and by runner.js to execute test cases.

   Question shape:
     id           "Q01"
     title        "HTML Tag Validator"
     difficulty   "Easy" | "Medium" | "Hard" | "Easy-Medium" | "Medium-Hard"
     time         "12-15 min"
     tags         ["Stack","String"]
     type         "python" | "sql"
     statement    HTML paragraph (use \n for newlines, escape <> safely)
     examples     Plain-text examples block (rendered in <pre>)
     hint         Single sentence
     solution     Python (or SQL) source as string
     explanation  Optional follow-up notes (string, can be empty)
     // For python type only:
     functionName  "two_sum"
     signature     "two_sum(nums: list[int], target: int) -> list[int]"
     starter       Initial code shown in editor
     tests         [{ args, expected, equality?, prepare?, transform?, skipCall? }, ...]

   Test case fields:
     args         positional args, JSON-serialisable
     expected     value to compare against (post-transform)
     equality     "exact" (default) | "set" | "sorted-list"
     prepare      Python source run BEFORE the call (rebinds `args`)
     transform    Python source run AFTER the call (rebinds `result`)
     skipCall     true => prepare is responsible for setting `result`
============================================================ */

window.QUESTIONS = {

  // ============================================================
  // STRINGS / STACKS / PARSING
  // ============================================================

  Q01: {
    id: "Q01",
    title: "HTML Tag Validator",
    difficulty: "Easy",
    time: "12-15 min",
    tags: ["String", "Stack", "Parsing"],
    type: "python",
    statement:
      "Write <code>validate_html_tags(html)</code> that returns True if all tags " +
      "are properly nested and closed, False otherwise. Tags are <code>&lt;name&gt;</code> " +
      "(possibly with attributes) and <code>&lt;/name&gt;</code>. No self-closing tags.",
    examples:
      'Input:  "<div><p></p></div>"      -> True\n' +
      'Input:  "<div><p></div></p>"      -> False\n' +
      'Input:  "<a><b><c></c></b></a>"   -> True\n' +
      'Input:  "<a>"                     -> False',
    hint: "Stack: push opening tags; on closing, pop and verify the names match.",
    functionName: "validate_html_tags",
    signature: "validate_html_tags(html: str) -> bool",
    starter:
      "def validate_html_tags(html):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def validate_html_tags(html: str) -> bool:
    stack = []
    i = 0
    while i < len(html):
        if html[i] == '<':
            j = html.find('>', i)
            if j == -1:
                return False
            tag = html[i + 1:j]
            if tag.startswith('/'):
                if not stack or stack[-1] != tag[1:]:
                    return False
                stack.pop()
            else:
                stack.append(tag.split()[0])
            i = j
        i += 1
    return len(stack) == 0`,
    explanation:
      "Time O(n), space O(d) where d is max nesting depth. " +
      "Attributes are ignored by taking only the first whitespace-separated token of the tag body.",
    tests: [
      { args: ["<div><p></p></div>"], expected: true },
      { args: ["<div><p></div></p>"], expected: false },
      { args: ["<a><b><c></c></b></a>"], expected: true },
      { args: ["<a></a><b></b>"], expected: true },
      { args: ["<a>"], expected: false },
      { args: [""], expected: true },
      { args: ['<a attr="x"></a>'], expected: true },
    ],
  },

  Q02: {
    id: "Q02",
    title: "HTML Validator with Self-Closing, Comments & CDATA",
    difficulty: "Hard",
    time: "25-30 min",
    tags: ["String", "Stack", "State Machine"],
    type: "python",
    statement:
      "Extend the validator: support self-closing tags <code>&lt;br/&gt;</code>, void elements " +
      "(<code>br, img, hr, meta, link, input, ...</code>) without a closing tag, HTML comments " +
      "<code>&lt;!-- ... --&gt;</code>, CDATA sections <code>&lt;![CDATA[ ... ]]&gt;</code>, " +
      "case-insensitive tag names, and attribute values that may contain <code>&gt;</code> " +
      "inside quotes.",
    examples:
      'Input:  "<div><br/><p>x<!--<bad>--></p></div>"  -> True\n' +
      'Input:  "<DIV><br></div>"                       -> True (case-insensitive)\n' +
      'Input:  \'<a title="x>y"><b></b></a>\'           -> True\n' +
      'Input:  "<p><![CDATA[</p>]]></p>"               -> True (CDATA opaque)\n' +
      'Input:  "<p><!-- unclosed"                      -> False',
    hint:
      "Treat the parser as a state machine. Inside COMMENT or CDATA, ignore everything " +
      "until the closing marker. Inside an opening tag, quoted attribute values are opaque too.",
    functionName: "validate_html_advanced",
    signature: "validate_html_advanced(html: str) -> bool",
    starter:
      "def validate_html_advanced(html):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`VOID = {"br","img","hr","meta","link","input","area","base","col",
        "embed","param","source","track","wbr"}

def validate_html_advanced(html: str) -> bool:
    stack = []
    i, n = 0, len(html)
    while i < n:
        if html.startswith("<!--", i):
            end = html.find("-->", i + 4)
            if end == -1: return False
            i = end + 3; continue
        if html.startswith("<![CDATA[", i):
            end = html.find("]]>", i + 9)
            if end == -1: return False
            i = end + 3; continue
        if html[i] == '<':
            j = i + 1; quote = None
            while j < n:
                c = html[j]
                if quote:
                    if c == quote: quote = None
                elif c in ('"', "'"): quote = c
                elif c == '>': break
                j += 1
            if j >= n: return False
            body = html[i + 1:j].strip()
            if not body: return False
            self_close = body.endswith('/')
            if self_close: body = body[:-1].strip()
            if body.startswith('/'):
                parts = body[1:].split()
                if not parts: return False
                name = parts[0].lower()
                if name in VOID: pass
                else:
                    if not stack or stack[-1] != name: return False
                    stack.pop()
            else:
                name = body.split()[0].lower()
                if self_close or name in VOID: pass
                else: stack.append(name)
            i = j + 1; continue
        i += 1
    return not stack`,
    explanation:
      "Comments and CDATA are opaque: the parser skips their entire contents in one jump. " +
      "Quoted attribute values are also opaque (a <code>&gt;</code> inside quotes does not end the tag).",
    tests: [
      { args: ["<div><br/><p>x<!--<bad>--></p></div>"], expected: true },
      { args: ["<DIV><br></div>"], expected: true },
      { args: ['<a title="x>y"><b></b></a>'], expected: true },
      { args: ["<p><![CDATA[</p>]]></p>"], expected: true },
      { args: ["<p><!-- unclosed"], expected: false },
      { args: ["<div><p></div></p>"], expected: false },
      { args: ["<img src=\"a.png\"/>"], expected: true },
      { args: ["<br>"], expected: true },
    ],
  },

  Q03: {
    id: "Q03",
    title: "Run-Length Encoding",
    difficulty: "Easy",
    time: "10-12 min",
    tags: ["String", "Loop Control"],
    type: "python",
    statement:
      "Compress consecutive identical characters as char+count. Return the compressed " +
      "string only if it is <strong>strictly shorter</strong>; otherwise return the original.",
    examples:
      'Input:  "aabcccccaaa"  -> "a2b1c5a3"     (compressed 8 < original 11)\n' +
      'Input:  "aaabbc"       -> "aaabbc"       (compressed "a3b2c1" is same length, NOT shorter)\n' +
      'Input:  "abc"          -> "abc"          (compressed "a1b1c1" is longer)\n' +
      'Input:  "aaaaaa"       -> "a6"\n' +
      'Input:  ""             -> ""',
    hint: "Scan left to right; emit on character change; do not forget the final run.",
    functionName: "run_length_encode",
    signature: "run_length_encode(s: str) -> str",
    starter:
      "def run_length_encode(s):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def run_length_encode(s: str) -> str:
    if not s:
        return ""
    out = []
    count = 1
    for i in range(1, len(s)):
        if s[i] == s[i - 1]:
            count += 1
        else:
            out.append(s[i - 1] + str(count))
            count = 1
    out.append(s[-1] + str(count))
    result = "".join(out)
    return result if len(result) < len(s) else s`,
    explanation:
      "The classic bug here is forgetting the final run: the loop only emits on change, " +
      "so the last group must be appended after the loop ends.",
    tests: [
      // "aabcccccaaa" (11 chars) compresses to "a2b1c5a3" (8 chars) — strictly shorter, so we return compressed.
      { args: ["aabcccccaaa"], expected: "a2b1c5a3" },
      // "aaabbc" (6 chars) compresses to "a3b2c1" (6 chars) — NOT strictly shorter, return original.
      { args: ["aaabbc"], expected: "aaabbc" },
      { args: ["abc"], expected: "abc" },        // a1b1c1 (6) is longer than abc (3)
      { args: ["aaaaaa"], expected: "a6" },      // a6 (2) shorter than aaaaaa (6)
      { args: [""], expected: "" },
      { args: ["a"], expected: "a" },            // a1 (2) longer than a (1)
      { args: ["aabb"], expected: "aabb" },      // a2b2 (4) same as aabb (4)
    ],
  },

  Q04: {
    id: "Q04",
    title: "Valid Palindrome (Alphanumeric)",
    difficulty: "Easy",
    time: "8-10 min",
    tags: ["String", "Two Pointers"],
    type: "python",
    statement:
      "Return True if <code>s</code> reads the same forward and backward considering " +
      "only alphanumeric characters and ignoring case.",
    examples:
      'Input:  "A man, a plan, a canal: Panama"  -> True\n' +
      'Input:  "race a car"                      -> False\n' +
      'Input:  " "                               -> True\n' +
      'Input:  "0P"                              -> False',
    hint: "Two pointers from each end; skip non-alphanumerics; compare lowercase.",
    functionName: "is_palindrome",
    signature: "is_palindrome(s: str) -> bool",
    starter:
      "def is_palindrome(s):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
    explanation: "Time O(n), space O(1). Each character is visited at most once.",
    tests: [
      { args: ["A man, a plan, a canal: Panama"], expected: true },
      { args: ["race a car"], expected: false },
      { args: [" "], expected: true },
      { args: ["0P"], expected: false },
      { args: [""], expected: true },
      { args: ["aA"], expected: true },
      { args: [".,"], expected: true },
    ],
  },

  Q09: {
    id: "Q09",
    title: "Balanced Parentheses (Multiple Types)",
    difficulty: "Easy",
    time: "8-10 min",
    tags: ["Stack", "String"],
    type: "python",
    statement:
      "Given a string containing only <code>()[]{}</code>, return True if it is valid: " +
      "every closing bracket matches the most recent unmatched opening of the same type.",
    examples:
      'Input:  "()"        -> True\n' +
      'Input:  "()[]{}"    -> True\n' +
      'Input:  "(]"        -> False\n' +
      'Input:  "([)]"      -> False\n' +
      'Input:  "{[]}"      -> True',
    hint: "Stack + a map from closing to opening bracket.",
    functionName: "is_valid",
    signature: "is_valid(s: str) -> bool",
    starter:
      "def is_valid(s):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def is_valid(s: str) -> bool:
    pair = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        else:
            if not stack or stack[-1] != pair[ch]:
                return False
            stack.pop()
    return len(stack) == 0`,
    explanation: "Time O(n), space O(n).",
    tests: [
      { args: ["()"], expected: true },
      { args: ["()[]{}"], expected: true },
      { args: ["(]"], expected: false },
      { args: ["([)]"], expected: false },
      { args: ["{[]}"], expected: true },
      { args: [""], expected: true },
      { args: ["("], expected: false },
      { args: [")("], expected: false },
    ],
  },

  Q13: {
    id: "Q13",
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    time: "12-15 min",
    tags: ["Stack", "Math", "Parsing"],
    type: "python",
    statement:
      "Evaluate an RPN expression (operators <code>+ - * /</code>). " +
      "Division between integers truncates toward zero.",
    examples:
      'Input:  ["2","1","+","3","*"]  -> 9\n' +
      'Input:  ["4","13","5","/","+"] -> 6\n' +
      'Input:  ["10","6","9","3","+","-11","*","/","*","17","+","5","+"] -> 22',
    hint: "Push numbers; on an operator, pop two, apply, push back. Use int(a/b), not a//b.",
    functionName: "eval_rpn",
    signature: "eval_rpn(tokens: list[str]) -> int",
    starter:
      "def eval_rpn(tokens):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def eval_rpn(tokens):
    stack = []
    for t in tokens:
        if t in ('+', '-', '*', '/'):
            b = stack.pop(); a = stack.pop()
            if t == '+': stack.append(a + b)
            elif t == '-': stack.append(a - b)
            elif t == '*': stack.append(a * b)
            else: stack.append(int(a / b))
        else:
            stack.append(int(t))
    return stack[0]`,
    explanation:
      "<code>//</code> floors toward -inf; <code>int(a/b)</code> truncates toward zero, " +
      "which is what most RPN specs require.",
    tests: [
      { args: [["2","1","+","3","*"]], expected: 9 },
      { args: [["4","13","5","/","+"]], expected: 6 },
      { args: [["10","6","9","3","+","-11","*","/","*","17","+","5","+"]], expected: 22 },
      { args: [["5"]], expected: 5 },
      { args: [["-3","2","/"]], expected: -1 }, // trunc-to-zero, not -2
    ],
  },

  Q14: {
    id: "Q14",
    title: "Basic Calculator II (Infix with Precedence)",
    difficulty: "Hard",
    time: "20-25 min",
    tags: ["Stack", "Parsing", "Operator Precedence"],
    type: "python",
    statement:
      "Evaluate a string expression with non-negative integers and <code>+ - * /</code> " +
      "plus whitespace. Standard precedence applies. Integer division truncates toward zero. " +
      "No <code>eval()</code>.",
    examples:
      'Input:  "3+2*2"     -> 7\n' +
      'Input:  " 3/2 "     -> 1\n' +
      'Input:  " 3+5 / 2 " -> 5\n' +
      'Input:  "14-3/2"    -> 13',
    hint:
      "Track the previous operator. On + or - push the (signed) number; on * or / pop the " +
      "stack-top and combine, then push the result. Answer = sum(stack).",
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
    op = '+'
    n = len(s)
    for i, ch in enumerate(s):
        if ch.isdigit():
            num = num * 10 + int(ch)
        if (ch in '+-*/') or i == n - 1:
            if op == '+': stack.append(num)
            elif op == '-': stack.append(-num)
            elif op == '*': stack.append(stack.pop() * num)
            else: stack.append(int(stack.pop() / num))
            op = ch
            num = 0
    return sum(stack)`,
    explanation:
      "<code>+</code> and <code>-</code> defer evaluation; <code>*</code> and <code>/</code> " +
      "resolve eagerly against the stack-top. This single-pass approach uses O(n) extra space.",
    tests: [
      { args: ["3+2*2"], expected: 7 },
      { args: [" 3/2 "], expected: 1 },
      { args: [" 3+5 / 2 "], expected: 5 },
      { args: ["14-3/2"], expected: 13 },
      { args: ["1*2-3/4+5*6-7*8+9/10"], expected: -24 },
      { args: ["1"], expected: 1 },
      { args: ["1+1"], expected: 2 },
    ],
  },

  Q17: {
    id: "Q17",
    title: "Daily Temperatures",
    difficulty: "Medium",
    time: "15-18 min",
    tags: ["Monotonic Stack", "Array"],
    type: "python",
    statement:
      "Given daily temperatures, return an array where each element is the number of days " +
      "you must wait until a warmer temperature; 0 if there is none.",
    examples:
      'Input:  [73,74,75,71,69,72,76,73]  -> [1,1,4,2,1,1,0,0]\n' +
      'Input:  [30,40,50,60]              -> [1,1,1,0]\n' +
      'Input:  [30,60,90]                 -> [1,1,0]',
    hint:
      "Monotonic-decreasing stack of indices. When today's temp is warmer than stack-top's, " +
      "pop and record the gap.",
    functionName: "daily_temperatures",
    signature: "daily_temperatures(temps: list[int]) -> list[int]",
    starter:
      "def daily_temperatures(temps):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def daily_temperatures(temps):
    n = len(temps)
    result = [0] * n
    stack = []
    for i in range(n):
        while stack and temps[i] > temps[stack[-1]]:
            j = stack.pop()
            result[j] = i - j
        stack.append(i)
    return result`,
    explanation:
      "Each index is pushed and popped at most once, so total work is O(n). Space O(n) worst-case " +
      "(strictly decreasing temperatures).",
    tests: [
      { args: [[73,74,75,71,69,72,76,73]], expected: [1,1,4,2,1,1,0,0] },
      { args: [[30,40,50,60]], expected: [1,1,1,0] },
      { args: [[30,60,90]], expected: [1,1,0] },
      { args: [[100,99,98]], expected: [0,0,0] },
      { args: [[55]], expected: [0] },
    ],
  },

  Q18: {
    id: "Q18",
    title: "Simplify Path (Unix-style)",
    difficulty: "Medium",
    time: "12-15 min",
    tags: ["Stack", "String", "Parsing"],
    type: "python",
    statement:
      "Given an absolute Unix path, simplify it: <code>..</code> goes up, <code>.</code> " +
      "stays, multiple <code>/</code> collapse to one, result starts with <code>/</code>.",
    examples:
      'Input:  "/home/"                    -> "/home"\n' +
      'Input:  "/../"                      -> "/"\n' +
      'Input:  "/home//foo/./bar/../baz"   -> "/home/foo/baz"\n' +
      'Input:  "/a/./b/../../c/"           -> "/c"',
    hint: "Split by '/', stack the parts; on '..' pop; ignore '' and '.'.",
    functionName: "simplify_path",
    signature: "simplify_path(path: str) -> str",
    starter:
      "def simplify_path(path):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def simplify_path(path: str) -> str:
    stack = []
    for part in path.split('/'):
        if part == '' or part == '.':
            continue
        elif part == '..':
            if stack: stack.pop()
        else:
            stack.append(part)
    return '/' + '/'.join(stack)`,
    explanation: "Time and space O(n).",
    tests: [
      { args: ["/home/"], expected: "/home" },
      { args: ["/../"], expected: "/" },
      { args: ["/home//foo/./bar/../baz"], expected: "/home/foo/baz" },
      { args: ["/a/./b/../../c/"], expected: "/c" },
      { args: ["/"], expected: "/" },
      { args: ["/..hidden/file"], expected: "/..hidden/file" }, // ..hidden is a name
    ],
  },

  // ============================================================
  // GRAPHS & SEARCH
  // ============================================================

  Q05: {
    id: "Q05",
    title: "Shortest Path in Unweighted Graph",
    difficulty: "Medium",
    time: "15-18 min",
    tags: ["Graph", "BFS"],
    type: "python",
    statement:
      "Given <code>n</code> nodes (0..n-1) and an undirected edge list, return the shortest " +
      "path length from <code>start</code> to <code>end</code>, or -1 if unreachable.",
    examples:
      'Input:  n=4, edges=[[0,1],[1,2],[0,2],[2,3]], start=0, end=3  -> 2\n' +
      'Input:  n=3, edges=[[0,1],[1,2]], start=0, end=2              -> 2\n' +
      'Input:  n=3, edges=[[0,1]], start=0, end=2                    -> -1\n' +
      'Input:  n=1, edges=[], start=0, end=0                         -> 0',
    hint: "Adjacency list + BFS. The first time you reach `end` is the shortest path.",
    functionName: "shortest_path",
    signature: "shortest_path(n: int, edges: list[list[int]], start: int, end: int) -> int",
    starter:
      "def shortest_path(n, edges, start, end):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import deque
def shortest_path(n, edges, start, end):
    if start == end: return 0
    graph = {i: [] for i in range(n)}
    for u, v in edges:
        graph[u].append(v); graph[v].append(u)
    visited = {start}
    queue = deque([(start, 0)])
    while queue:
        node, dist = queue.popleft()
        for nxt in graph[node]:
            if nxt == end: return dist + 1
            if nxt not in visited:
                visited.add(nxt); queue.append((nxt, dist + 1))
    return -1`,
    explanation: "O(V+E) time, O(V) space. BFS is optimal for unweighted shortest path.",
    tests: [
      { args: [4, [[0,1],[1,2],[0,2],[2,3]], 0, 3], expected: 2 },
      { args: [3, [[0,1],[1,2]], 0, 2], expected: 2 },
      { args: [3, [[0,1]], 0, 2], expected: -1 },
      { args: [1, [], 0, 0], expected: 0 },
      { args: [5, [[0,1],[1,2],[2,3],[3,4]], 0, 4], expected: 4 },
      { args: [6, [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5]], 0, 5], expected: 3 },
    ],
  },

  Q06: {
    id: "Q06",
    title: "Word Ladder",
    difficulty: "Hard",
    time: "25-30 min",
    tags: ["BFS", "Implicit Graph"],
    type: "python",
    statement:
      "Return the number of words in the shortest transformation from <code>begin_word</code> " +
      "to <code>end_word</code> changing one letter at a time, where each transformed word must " +
      "be in <code>word_list</code>. Return 0 if no such sequence exists. Length includes both ends.",
    examples:
      'Input:  "hit", "cog", ["hot","dot","dog","lot","log","cog"]  -> 5\n' +
      'Input:  "hit", "cog", ["hot","dot","dog","lot","log"]        -> 0\n' +
      'Input:  "a", "c", ["a","b","c"]                              -> 2',
    hint:
      "Build a map from wildcard pattern (e.g. 'h*t') to dictionary words. Neighbours of a word " +
      "are all words sharing a wildcard pattern. BFS from begin_word.",
    functionName: "word_ladder",
    signature: "word_ladder(begin: str, end: str, words: list[str]) -> int",
    starter:
      "def word_ladder(begin, end, words):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import deque, defaultdict
def word_ladder(begin, end, words):
    word_set = set(words)
    if end not in word_set: return 0
    L = len(begin)
    patterns = defaultdict(list)
    for w in word_set:
        for i in range(L):
            patterns[w[:i] + '*' + w[i+1:]].append(w)
    queue = deque([(begin, 1)])
    seen = {begin}
    while queue:
        word, d = queue.popleft()
        for i in range(L):
            key = word[:i] + '*' + word[i+1:]
            for nxt in patterns[key]:
                if nxt == end: return d + 1
                if nxt not in seen:
                    seen.add(nxt); queue.append((nxt, d + 1))
            patterns[key] = []
    return 0`,
    explanation: "O(N * L^2) where N=|words|, L=word length.",
    tests: [
      { args: ["hit", "cog", ["hot","dot","dog","lot","log","cog"]], expected: 5 },
      { args: ["hit", "cog", ["hot","dot","dog","lot","log"]], expected: 0 },
      { args: ["a", "c", ["a","b","c"]], expected: 2 },
      { args: ["hot", "dog", ["hot","dog"]], expected: 0 }, // no intermediate
      { args: ["lost", "miss", ["most","mist","miss","lost","fist","fish"]], expected: 4 },
    ],
  },

  Q19: {
    id: "Q19",
    title: "Shortest Path in Binary Matrix",
    difficulty: "Medium",
    time: "18-22 min",
    tags: ["BFS", "Matrix"],
    type: "python",
    statement:
      "Given an n&times;n binary matrix, return the length of the shortest clear path from " +
      "(0,0) to (n-1,n-1). Clear cells are 0; you can move in 8 directions. Return -1 if no path.",
    examples:
      'Input:  [[0,1],[1,0]]                  -> 2\n' +
      'Input:  [[0,0,0],[1,1,0],[1,1,0]]      -> 4\n' +
      'Input:  [[1,0,0],[1,1,0],[1,1,0]]      -> -1',
    hint:
      "BFS from (0,0). Mark visited immediately by writing 1 into the grid to avoid re-enqueuing.",
    functionName: "shortest_path_binary_matrix",
    signature: "shortest_path_binary_matrix(grid: list[list[int]]) -> int",
    starter:
      "def shortest_path_binary_matrix(grid):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import deque
def shortest_path_binary_matrix(grid):
    n = len(grid)
    if grid[0][0] == 1 or grid[n-1][n-1] == 1: return -1
    dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    q = deque([(0, 0, 1)])
    grid[0][0] = 1
    while q:
        r, c, d = q.popleft()
        if r == n - 1 and c == n - 1: return d
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                grid[nr][nc] = 1
                q.append((nr, nc, d + 1))
    return -1`,
    explanation: "O(n^2) time and space.",
    tests: [
      { args: [[[0,1],[1,0]]], expected: 2 },
      { args: [[[0,0,0],[1,1,0],[1,1,0]]], expected: 4 },
      { args: [[[1,0,0],[1,1,0],[1,1,0]]], expected: -1 },
      { args: [[[0]]], expected: 1 },
      { args: [[[1]]], expected: -1 },
    ],
  },

  Q20: {
    id: "Q20",
    title: "Word Search II (Trie + DFS)",
    difficulty: "Hard",
    time: "30-35 min",
    tags: ["Trie", "DFS", "Backtracking"],
    type: "python",
    statement:
      "Given an m&times;n board of characters and a dictionary, return all words from the " +
      "dictionary present on the board. Words are formed by adjacent (horizontal/vertical) cells, " +
      "no cell reused per word.",
    examples:
      'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\n' +
      'words = ["oath","pea","eat","rain"]\n' +
      'Output: ["oath","eat"]',
    hint:
      "Trie of words + DFS from each cell, walking trie pointer in parallel. Prune trie branches " +
      "as words are found (delete dead ends) to keep DFS cheap.",
    functionName: "find_words",
    signature: "find_words(board: list[list[str]], words: list[str]) -> list[str]",
    starter:
      "def find_words(board, words):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def find_words(board, words):
    TRIE = {}
    END = '$'
    for w in words:
        node = TRIE
        for c in w:
            node = node.setdefault(c, {})
        node[END] = w
    rows, cols = len(board), len(board[0])
    found = []
    def dfs(r, c, node):
        ch = board[r][c]
        if ch not in node: return
        nxt = node[ch]
        if END in nxt:
            found.append(nxt.pop(END))
        board[r][c] = '#'
        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                dfs(nr, nc, nxt)
        board[r][c] = ch
        if not nxt: node.pop(ch, None)
    for r in range(rows):
        for c in range(cols):
            dfs(r, c, TRIE)
    return found`,
    explanation: "Trie pruning is the key optimization.",
    tests: [
      {
        args: [
          [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],
          ["oath","pea","eat","rain"]
        ],
        expected: ["oath","eat"],
        equality: "set",
      },
      {
        args: [[["a","b"],["c","d"]], ["abcb"]],
        expected: [],
        equality: "set",
      },
      {
        args: [[["a"]], ["a"]],
        expected: ["a"],
        equality: "set",
      },
    ],
  },

  Q23: {
    id: "Q23",
    title: "Rotting Oranges (Multi-Source BFS)",
    difficulty: "Medium",
    time: "18-22 min",
    tags: ["Multi-Source BFS", "Matrix"],
    type: "python",
    statement:
      "0 = empty, 1 = fresh orange, 2 = rotten. Every minute, fresh oranges 4-adjacent to a " +
      "rotten one become rotten. Return the minimum minutes until none are fresh, or -1 if impossible.",
    examples:
      'Input:  [[2,1,1],[1,1,0],[0,1,1]]  -> 4\n' +
      'Input:  [[2,1,1],[0,1,1],[1,0,2]]  -> -1\n' +
      'Input:  [[0,2]]                     -> 0',
    hint: "Multi-source BFS: enqueue ALL rotten oranges first; process layer by layer.",
    functionName: "oranges_rotting",
    signature: "oranges_rotting(grid: list[list[int]]) -> int",
    starter:
      "def oranges_rotting(grid):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import deque
def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])
    q = deque(); fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2: q.append((r, c, 0))
            elif grid[r][c] == 1: fresh += 1
    minutes = 0
    while q:
        r, c, minutes = q.popleft()
        for dr, dc in ((0,1),(0,-1),(1,0),(-1,0)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2; fresh -= 1
                q.append((nr, nc, minutes + 1))
    return minutes if fresh == 0 else -1`,
    explanation: "O(m*n).",
    tests: [
      { args: [[[2,1,1],[1,1,0],[0,1,1]]], expected: 4 },
      { args: [[[2,1,1],[0,1,1],[1,0,2]]], expected: -1 },
      { args: [[[0,2]]], expected: 0 },
      { args: [[[0]]], expected: 0 },
      { args: [[[1]]], expected: -1 },
    ],
  },

  Q48: {
    id: "Q48",
    title: "Course Schedule (Topological Sort)",
    difficulty: "Medium",
    time: "18-22 min",
    tags: ["Topological Sort", "BFS", "Cycle Detection"],
    type: "python",
    statement:
      "Given <code>num_courses</code> and a list of <code>[a,b]</code> prerequisites (take b " +
      "before a), return True if all courses can be finished. Equivalent to: is the directed " +
      "graph acyclic?",
    examples:
      'Input:  num=2, prereq=[[1,0]]              -> True\n' +
      'Input:  num=2, prereq=[[1,0],[0,1]]        -> False\n' +
      'Input:  num=4, prereq=[[1,0],[2,1],[3,2]]  -> True',
    hint:
      "Kahn's algorithm: compute in-degrees, enqueue 0-degree nodes, decrement neighbours. " +
      "If you processed every node, the graph is acyclic.",
    functionName: "can_finish",
    signature: "can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool",
    starter:
      "def can_finish(num_courses, prerequisites):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import defaultdict, deque
def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    in_deg = [0] * num_courses
    for a, b in prerequisites:
        graph[b].append(a); in_deg[a] += 1
    q = deque(i for i in range(num_courses) if in_deg[i] == 0)
    seen = 0
    while q:
        node = q.popleft(); seen += 1
        for nxt in graph[node]:
            in_deg[nxt] -= 1
            if in_deg[nxt] == 0: q.append(nxt)
    return seen == num_courses`,
    explanation: "O(V+E).",
    tests: [
      { args: [2, [[1,0]]], expected: true },
      { args: [2, [[1,0],[0,1]]], expected: false },
      { args: [4, [[1,0],[2,1],[3,2]]], expected: true },
      { args: [1, []], expected: true },
      { args: [3, [[0,1],[1,2],[2,0]]], expected: false },
    ],
  },

  Q49: {
    id: "Q49",
    title: "Number of Connected Components (Union Find)",
    difficulty: "Medium",
    time: "15-18 min",
    tags: ["Union Find", "Graph"],
    type: "python",
    statement:
      "Given <code>n</code> nodes and an undirected edge list, return the number of connected " +
      "components.",
    examples:
      'Input:  n=5, edges=[[0,1],[1,2],[3,4]]            -> 2\n' +
      'Input:  n=5, edges=[[0,1],[1,2],[2,3],[3,4]]      -> 1\n' +
      'Input:  n=5, edges=[]                              -> 5',
    hint: "DSU with path compression. Each successful union (different roots) decrements the count.",
    functionName: "count_components",
    signature: "count_components(n: int, edges: list[list[int]]) -> int",
    starter:
      "def count_components(n, edges):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def count_components(n, edges):
    parent = list(range(n))
    rank = [0] * n
    comps = n
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb: return False
        if rank[ra] < rank[rb]: ra, rb = rb, ra
        parent[rb] = ra
        if rank[ra] == rank[rb]: rank[ra] += 1
        return True
    for a, b in edges:
        if union(a, b): comps -= 1
    return comps`,
    explanation: "Nearly O(n + |E|).",
    tests: [
      { args: [5, [[0,1],[1,2],[3,4]]], expected: 2 },
      { args: [5, [[0,1],[1,2],[2,3],[3,4]]], expected: 1 },
      { args: [5, []], expected: 5 },
      { args: [1, []], expected: 1 },
      { args: [4, [[0,1],[2,3],[0,2]]], expected: 1 },
    ],
  },

  // ============================================================
  // ARRAYS / TWO POINTERS / SLIDING WINDOWS
  // ============================================================

  Q10: {
    id: "Q10",
    title: "First Non-Repeating Character",
    difficulty: "Easy",
    time: "8-10 min",
    tags: ["Hash Table", "String"],
    type: "python",
    statement: "Return the index of the first non-repeating character, or -1.",
    examples:
      'Input:  "leetcode"       -> 0\n' +
      'Input:  "loveleetcode"   -> 2\n' +
      'Input:  "aabb"           -> -1',
    hint: "Count frequencies in one pass, then scan to find the first count-1 character.",
    functionName: "first_uniq_char",
    signature: "first_uniq_char(s: str) -> int",
    starter:
      "def first_uniq_char(s):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import Counter
def first_uniq_char(s):
    count = Counter(s)
    for i, ch in enumerate(s):
        if count[ch] == 1: return i
    return -1`,
    explanation: "O(n).",
    tests: [
      { args: ["leetcode"], expected: 0 },
      { args: ["loveleetcode"], expected: 2 },
      { args: ["aabb"], expected: -1 },
      { args: ["z"], expected: 0 },
      { args: ["aabbcdd"], expected: 4 },
      { args: [""], expected: -1 },
    ],
  },

  Q12: {
    id: "Q12",
    title: "Move Zeroes",
    difficulty: "Easy",
    time: "10-12 min",
    tags: ["Array", "Two Pointers"],
    type: "python",
    statement:
      "Move all 0s to the end of the array while preserving the order of non-zero elements. " +
      "Modify the array <strong>in-place</strong>.",
    examples:
      'Input:  [0,1,0,3,12]  -> [1,3,12,0,0]\n' +
      'Input:  [0,0,1]       -> [1,0,0]\n' +
      'Input:  [1,2,3]       -> [1,2,3]',
    hint: "Write-pointer pattern: copy non-zeros to the front; fill the rest with zeros.",
    functionName: "move_zeroes",
    signature: "move_zeroes(nums: list[int]) -> None  (mutates in place)",
    starter:
      "def move_zeroes(nums):\n" +
      "    # mutate nums in place\n" +
      "    pass\n",
    solution:
`def move_zeroes(nums):
    write = 0
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1
    for i in range(write, len(nums)):
        nums[i] = 0`,
    explanation: "O(n) time, O(1) space.",
    // The function is void — test by checking the mutated input list.
    tests: [
      { args: [[0,1,0,3,12]],
        transform: "result = args[0]",
        expected: [1,3,12,0,0] },
      { args: [[0,0,1]],
        transform: "result = args[0]",
        expected: [1,0,0] },
      { args: [[1,2,3]],
        transform: "result = args[0]",
        expected: [1,2,3] },
      { args: [[0]],
        transform: "result = args[0]",
        expected: [0] },
      { args: [[1,0,1,0,1,0]],
        transform: "result = args[0]",
        expected: [1,1,1,0,0,0] },
    ],
  },

  Q21: {
    id: "Q21",
    title: "Two Sum",
    difficulty: "Easy",
    time: "8-10 min",
    tags: ["Hash Table", "Array"],
    type: "python",
    statement:
      "Return indices of the two numbers that add up to <code>target</code>. Exactly one " +
      "solution exists; you may not use the same element twice.",
    examples:
      'Input:  nums=[2,7,11,15], target=9  -> [0,1]\n' +
      'Input:  nums=[3,2,4],   target=6    -> [1,2]\n' +
      'Input:  nums=[3,3],     target=6    -> [0,1]',
    hint: "One-pass hash map: for each num, check if its complement was seen.",
    functionName: "two_sum",
    signature: "two_sum(nums: list[int], target: int) -> list[int]",
    starter:
      "def two_sum(nums, target):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:
            return [seen[comp], i]
        seen[num] = i
    return []`,
    explanation: "O(n) time, O(n) space.",
    tests: [
      { args: [[2,7,11,15], 9], expected: [0,1], equality: "set" },
      { args: [[3,2,4], 6], expected: [1,2], equality: "set" },
      { args: [[3,3], 6], expected: [0,1], equality: "set" },
      { args: [[-1,-2,-3,-4,-5], -8], expected: [2,4], equality: "set" },
    ],
  },

  Q25: {
    id: "Q25",
    title: "Container With Most Water",
    difficulty: "Medium",
    time: "15-18 min",
    tags: ["Two Pointers", "Greedy"],
    type: "python",
    statement:
      "Given heights of vertical lines, return the max area of water trapped between two lines.",
    examples:
      'Input:  [1,8,6,2,5,4,8,3,7]  -> 49\n' +
      'Input:  [1,1]                -> 1',
    hint:
      "Two pointers from both ends; the shorter line bounds the area, so always move " +
      "that pointer inward.",
    functionName: "max_area",
    signature: "max_area(height: list[int]) -> int",
    starter:
      "def max_area(height):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def max_area(height):
    left, right = 0, len(height) - 1
    best = 0
    while left < right:
        w = right - left
        best = max(best, min(height[left], height[right]) * w)
        if height[left] < height[right]: left += 1
        else: right -= 1
    return best`,
    explanation: "O(n) time, O(1) space.",
    tests: [
      { args: [[1,8,6,2,5,4,8,3,7]], expected: 49 },
      { args: [[1,1]], expected: 1 },
      { args: [[4,3,2,1,4]], expected: 16 },
      { args: [[1,2,1]], expected: 2 },
    ],
  },

  Q26: {
    id: "Q26",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    time: "20-25 min",
    tags: ["Two Pointers", "DP"],
    type: "python",
    statement:
      "Compute how much water can be trapped after raining, given non-negative heights of " +
      "unit-width bars.",
    examples:
      'Input:  [0,1,0,2,1,0,1,3,2,1,2,1]  -> 6\n' +
      'Input:  [4,2,0,3,2,5]              -> 9',
    hint:
      "Two pointers + running left_max / right_max. Advance the side whose running max " +
      "is smaller; that side's water level is fully determined by that side's max.",
    functionName: "trap",
    signature: "trap(height: list[int]) -> int",
    starter:
      "def trap(height):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def trap(height):
    if not height: return 0
    l, r = 0, len(height) - 1
    lmax = rmax = 0
    water = 0
    while l < r:
        if height[l] < height[r]:
            if height[l] >= lmax: lmax = height[l]
            else: water += lmax - height[l]
            l += 1
        else:
            if height[r] >= rmax: rmax = height[r]
            else: water += rmax - height[r]
            r -= 1
    return water`,
    explanation: "O(n) time, O(1) space.",
    tests: [
      { args: [[0,1,0,2,1,0,1,3,2,1,2,1]], expected: 6 },
      { args: [[4,2,0,3,2,5]], expected: 9 },
      { args: [[0]], expected: 0 },
      { args: [[1,2,3]], expected: 0 },
      { args: [[3,2,1]], expected: 0 },
      { args: [[5,4,1,2]], expected: 1 },
    ],
  },

  Q29: {
    id: "Q29",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    time: "10-12 min",
    tags: ["Two Pointers", "In-Place"],
    type: "python",
    statement:
      "Given a sorted array, remove duplicates in-place so each unique element appears once. " +
      "Return the new length <code>k</code>. The first <code>k</code> entries must hold the unique values.",
    examples:
      'Input:  nums=[1,1,2]                       -> 2, nums[:2]=[1,2]\n' +
      'Input:  nums=[0,0,1,1,1,2,2,3,3,4]         -> 5, nums[:5]=[0,1,2,3,4]',
    hint: "Two pointers; advance write when nums[read] differs from nums[read-1].",
    functionName: "remove_duplicates",
    signature: "remove_duplicates(nums: list[int]) -> int  (also mutates)",
    starter:
      "def remove_duplicates(nums):\n" +
      "    # mutate nums in place; return new length\n" +
      "    pass\n",
    solution:
`def remove_duplicates(nums):
    if not nums: return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1
    return write`,
    explanation: "O(n) time, O(1) space.",
    // We return [k, nums[:k]] so the test verifies both the return value AND the prefix.
    tests: [
      { args: [[1,1,2]],
        transform: "result = [result, args[0][:result]]",
        expected: [2, [1,2]] },
      { args: [[0,0,1,1,1,2,2,3,3,4]],
        transform: "result = [result, args[0][:result]]",
        expected: [5, [0,1,2,3,4]] },
      { args: [[1]],
        transform: "result = [result, args[0][:result]]",
        expected: [1, [1]] },
      { args: [[]],
        transform: "result = [result, args[0][:result]]",
        expected: [0, []] },
    ],
  },

  Q33: {
    id: "Q33",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    time: "12-15 min",
    tags: ["Sliding Window", "Hash Map"],
    type: "python",
    statement:
      "Return the length of the longest substring of <code>s</code> with no repeating characters.",
    examples:
      'Input:  "abcabcbb"  -> 3\n' +
      'Input:  "bbbbb"     -> 1\n' +
      'Input:  "pwwkew"    -> 3',
    hint:
      "Sliding window with a `last_seen[ch]` map. On duplicate inside the window, jump " +
      "<code>left</code> to <code>last_seen[ch] + 1</code>.",
    functionName: "length_of_longest_substring",
    signature: "length_of_longest_substring(s: str) -> int",
    starter:
      "def length_of_longest_substring(s):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def length_of_longest_substring(s):
    last = {}
    left = best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best`,
    explanation: "O(n) time, O(alphabet) space.",
    tests: [
      { args: ["abcabcbb"], expected: 3 },
      { args: ["bbbbb"], expected: 1 },
      { args: ["pwwkew"], expected: 3 },
      { args: [""], expected: 0 },
      { args: [" "], expected: 1 },
      { args: ["dvdf"], expected: 3 },
    ],
  },

  Q34: {
    id: "Q34",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    time: "25-30 min",
    tags: ["Sliding Window", "Counters"],
    type: "python",
    statement:
      "Return the minimum window of <code>s</code> that contains every character of <code>t</code> " +
      "(including duplicates), or empty string if no such window exists.",
    examples:
      'Input:  s="ADOBECODEBANC", t="ABC"  -> "BANC"\n' +
      'Input:  s="a", t="a"                -> "a"\n' +
      'Input:  s="a", t="aa"               -> ""',
    hint:
      "Track <code>need</code> (Counter of t) and <code>formed</code> (distinct chars meeting need). " +
      "Expand right; once <code>formed == len(need)</code>, shrink left to record minimum.",
    functionName: "min_window",
    signature: "min_window(s: str, t: str) -> str",
    starter:
      "def min_window(s, t):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from collections import Counter
def min_window(s, t):
    if not s or not t or len(s) < len(t): return ""
    need = Counter(t)
    required = len(need)
    have = {}
    formed = 0
    best_len = float('inf')
    bl = br = 0
    left = 0
    for right, ch in enumerate(s):
        have[ch] = have.get(ch, 0) + 1
        if ch in need and have[ch] == need[ch]:
            formed += 1
        while formed == required:
            if right - left + 1 < best_len:
                best_len = right - left + 1
                bl, br = left, right
            lc = s[left]
            have[lc] -= 1
            if lc in need and have[lc] < need[lc]:
                formed -= 1
            left += 1
    return "" if best_len == float('inf') else s[bl:br + 1]`,
    explanation: "O(|s| + |t|).",
    tests: [
      { args: ["ADOBECODEBANC", "ABC"], expected: "BANC" },
      { args: ["a", "a"], expected: "a" },
      { args: ["a", "aa"], expected: "" },
      { args: ["ab", "a"], expected: "a" },
      { args: ["aaflslflsldkalskaaa", "aaa"], expected: "aaa" },
    ],
  },

  Q46: {
    id: "Q46",
    title: "Merge Intervals",
    difficulty: "Medium",
    time: "12-15 min",
    tags: ["Sorting", "Intervals"],
    type: "python",
    statement: "Merge all overlapping intervals.",
    examples:
      'Input:  [[1,3],[2,6],[8,10],[15,18]]  -> [[1,6],[8,10],[15,18]]\n' +
      'Input:  [[1,4],[4,5]]                 -> [[1,5]]\n' +
      'Input:  [[1,4],[2,3]]                 -> [[1,4]]',
    hint: "Sort by start; greedily merge with the last entry if start <= last_end.",
    functionName: "merge",
    signature: "merge(intervals: list[list[int]]) -> list[list[int]]",
    starter:
      "def merge(intervals):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def merge(intervals):
    intervals.sort(key=lambda iv: iv[0])
    out = [intervals[0][:]]
    for s, e in intervals[1:]:
        if s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return out`,
    explanation: "O(n log n) for the sort, O(n) sweep.",
    tests: [
      { args: [[[1,3],[2,6],[8,10],[15,18]]], expected: [[1,6],[8,10],[15,18]] },
      { args: [[[1,4],[4,5]]], expected: [[1,5]] },
      { args: [[[1,4],[2,3]]], expected: [[1,4]] },
      { args: [[[1,4]]], expected: [[1,4]] },
      { args: [[[1,4],[0,4]]], expected: [[0,4]] },
    ],
  },

  // ============================================================
  // MATH / BIT / BINARY SEARCH
  // ============================================================

  Q22: {
    id: "Q22",
    title: "Reverse Integer (32-bit safe)",
    difficulty: "Easy",
    time: "10-12 min",
    tags: ["Math", "Integer"],
    type: "python",
    statement:
      "Reverse the digits of a signed 32-bit integer. If the result overflows the 32-bit " +
      "range [-2^31, 2^31 - 1], return 0.",
    examples:
      'Input:  123          -> 321\n' +
      'Input:  -123         -> -321\n' +
      'Input:  120          -> 21\n' +
      'Input:  1534236469   -> 0',
    hint:
      "Pop digits with %10 and //10. Use math.fmod for sign-preserving mod. Check overflow " +
      "BEFORE pushing each new digit.",
    functionName: "reverse",
    signature: "reverse(x: int) -> int",
    starter:
      "def reverse(x):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`import math
def reverse(x):
    INT_MIN, INT_MAX = -2**31, 2**31 - 1
    result = 0
    while x != 0:
        digit = int(math.fmod(x, 10))
        x = int(x / 10)
        if (result > INT_MAX // 10 or
            (result == INT_MAX // 10 and digit > 7)): return 0
        if (result < INT_MIN // 10 or
            (result == INT_MIN // 10 and digit < -8)): return 0
        result = result * 10 + digit
    return result`,
    explanation:
      "<code>math.fmod</code> preserves sign (C semantics), while Python's <code>%</code> " +
      "returns the sign of the divisor.",
    tests: [
      { args: [123], expected: 321 },
      { args: [-123], expected: -321 },
      { args: [120], expected: 21 },
      { args: [1534236469], expected: 0 },
      { args: [0], expected: 0 },
      { args: [-2147483648], expected: 0 },
    ],
  },

  Q27: {
    id: "Q27",
    title: "Happy Number",
    difficulty: "Easy-Medium",
    time: "12-15 min",
    tags: ["Floyd's Cycle Detection", "Math"],
    type: "python",
    statement:
      "Replace n with the sum of squares of its digits, repeat. n is happy if it reaches 1.",
    examples:
      'Input:  19   -> True\n' +
      'Input:  2    -> False\n' +
      'Input:  1    -> True',
    hint: "Floyd's tortoise & hare on the digit-square-sum function. Cycle detection iff not happy.",
    functionName: "is_happy",
    signature: "is_happy(n: int) -> bool",
    starter:
      "def is_happy(n):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def is_happy(n):
    def nxt(num):
        s = 0
        while num > 0:
            d = num % 10; s += d * d; num //= 10
        return s
    slow, fast = n, nxt(n)
    while fast != 1 and slow != fast:
        slow = nxt(slow); fast = nxt(nxt(fast))
    return fast == 1`,
    explanation: "O(log n) per step. Set-based detection also works (O(log n) space).",
    tests: [
      { args: [19], expected: true },
      { args: [2], expected: false },
      { args: [1], expected: true },
      { args: [7], expected: true },
      { args: [4], expected: false },
      { args: [10], expected: true },
    ],
  },

  Q30: {
    id: "Q30",
    title: "Count Primes (Sieve of Eratosthenes)",
    difficulty: "Easy-Medium",
    time: "12-15 min",
    tags: ["Math", "Sieve"],
    type: "python",
    statement: "Count primes strictly less than <code>n</code>.",
    examples:
      'Input:  10   -> 4   (2,3,5,7)\n' +
      'Input:  0    -> 0\n' +
      'Input:  1    -> 0\n' +
      'Input:  2    -> 0',
    hint: "Sieve. Start marking multiples of i from i*i (smaller multiples are already crossed).",
    functionName: "count_primes",
    signature: "count_primes(n: int) -> int",
    starter:
      "def count_primes(n):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def count_primes(n):
    if n <= 2: return 0
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n, i):
                is_prime[j] = False
    return sum(is_prime)`,
    explanation: "O(n log log n).",
    tests: [
      { args: [10], expected: 4 },
      { args: [0], expected: 0 },
      { args: [1], expected: 0 },
      { args: [2], expected: 0 },
      { args: [3], expected: 1 },
      { args: [100], expected: 25 },
      { args: [1000], expected: 168 },
    ],
  },

  Q31: {
    id: "Q31",
    title: "Pow(x, n) — Fast Exponentiation",
    difficulty: "Medium-Hard",
    time: "15-20 min",
    tags: ["Math", "Divide & Conquer", "Bit"],
    type: "python",
    statement:
      "Implement <code>my_pow(x, n)</code> without the <code>**</code> operator or " +
      "<code>math.pow</code>. Negative n means inverse.",
    examples:
      'Input:  x=2.0, n=10   -> 1024.0\n' +
      'Input:  x=2.1, n=3    -> 9.261\n' +
      'Input:  x=2.0, n=-2   -> 0.25',
    hint:
      "Binary exponentiation: iterate over bits of n; square base each step; multiply into result " +
      "when current bit is 1.",
    functionName: "my_pow",
    signature: "my_pow(x: float, n: int) -> float",
    starter:
      "def my_pow(x, n):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def my_pow(x, n):
    if n < 0:
        x = 1 / x; n = -n
    result = 1.0; base = x
    while n > 0:
        if n & 1: result *= base
        base *= base
        n >>= 1
    return result`,
    explanation: "O(log |n|).",
    tests: [
      { args: [2.0, 10], expected: 1024.0 },
      { args: [2.1, 3], expected: 9.261 },
      { args: [2.0, -2], expected: 0.25 },
      { args: [1.0, 1000000], expected: 1.0 },
      { args: [3.0, 0], expected: 1.0 },
      { args: [0.5, 4], expected: 0.0625 },
    ],
  },

  Q44: {
    id: "Q44",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    time: "15-20 min",
    tags: ["Binary Search", "Array"],
    type: "python",
    statement:
      "A sorted array (distinct values) is rotated at an unknown pivot. Find <code>target</code> " +
      "in O(log n) or return -1.",
    examples:
      'Input:  nums=[4,5,6,7,0,1,2], target=0  -> 4\n' +
      'Input:  nums=[4,5,6,7,0,1,2], target=3  -> -1\n' +
      'Input:  nums=[1], target=0              -> -1',
    hint:
      "At each step, one half [lo,mid] or [mid,hi] is sorted. Decide which and check whether " +
      "target lies in that sorted half.",
    functionName: "search",
    signature: "search(nums: list[int], target: int) -> int",
    starter:
      "def search(nums, target):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target: return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]: hi = mid - 1
            else: lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]: lo = mid + 1
            else: hi = mid - 1
    return -1`,
    explanation: "O(log n) time.",
    tests: [
      { args: [[4,5,6,7,0,1,2], 0], expected: 4 },
      { args: [[4,5,6,7,0,1,2], 3], expected: -1 },
      { args: [[1], 0], expected: -1 },
      { args: [[1], 1], expected: 0 },
      { args: [[3,1], 1], expected: 1 },
      { args: [[5,1,3], 5], expected: 0 },
    ],
  },

  Q45: {
    id: "Q45",
    title: "Single Number (XOR)",
    difficulty: "Easy",
    time: "5-8 min",
    tags: ["Bit Manipulation", "XOR"],
    type: "python",
    statement:
      "Every element appears twice except one. Find the loner in O(n) time and O(1) space.",
    examples:
      'Input:  [2,2,1]      -> 1\n' +
      'Input:  [4,1,2,1,2]  -> 4\n' +
      'Input:  [1]          -> 1',
    hint: "XOR everything together. Pairs cancel; the lone element survives.",
    functionName: "single_number",
    signature: "single_number(nums: list[int]) -> int",
    starter:
      "def single_number(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def single_number(nums):
    result = 0
    for x in nums:
        result ^= x
    return result`,
    explanation: "XOR identities: a^a=0, a^0=a, commutative.",
    tests: [
      { args: [[2,2,1]], expected: 1 },
      { args: [[4,1,2,1,2]], expected: 4 },
      { args: [[1]], expected: 1 },
      { args: [[7,7,11]], expected: 11 },
      { args: [[-1,-1,5]], expected: 5 },
    ],
  },

  // ============================================================
  // TREES / LINKED LISTS / HEAP / TRIE
  // ============================================================

  Q35: {
    id: "Q35",
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "Medium",
    time: "15-18 min",
    tags: ["Binary Tree", "DFS"],
    type: "python",
    statement:
      "Given the root of a binary tree (level-order list with <code>None</code> for missing) " +
      "and two node values <code>p_val</code>, <code>q_val</code>, return the value of their LCA.",
    examples:
      'tree=[3,5,1,6,2,0,8,null,null,7,4], p=5, q=1  -> 3\n' +
      'tree=[3,5,1,6,2,0,8,null,null,7,4], p=5, q=4  -> 5',
    hint:
      "Recurse. If left and right calls both return non-None, this node is the LCA. " +
      "Otherwise propagate whichever side found something.",
    functionName: "lowest_common_ancestor",
    signature: "lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode",
    starter:
      "def lowest_common_ancestor(root, p, q):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def lowest_common_ancestor(root, p, q):
    if root is None or root is p or root is q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root
    return left if left else right`,
    explanation: "O(n) time, O(h) recursion.",
    // tests pass [tree_array, p_val, q_val]. We rebuild and locate the nodes.
    tests: [
      {
        args: [[3,5,1,6,2,0,8,null,null,7,4], 5, 1],
        prepare:
          "root = _build_tree(args[0])\n" +
          "p = _find_node(root, args[1])\n" +
          "q = _find_node(root, args[2])\n" +
          "args = [root, p, q]\n",
        transform: "result = result.val if result is not None else None",
        expected: 3,
      },
      {
        args: [[3,5,1,6,2,0,8,null,null,7,4], 5, 4],
        prepare:
          "root = _build_tree(args[0])\n" +
          "p = _find_node(root, args[1])\n" +
          "q = _find_node(root, args[2])\n" +
          "args = [root, p, q]\n",
        transform: "result = result.val if result is not None else None",
        expected: 5,
      },
      {
        args: [[1, 2], 1, 2],
        prepare:
          "root = _build_tree(args[0])\n" +
          "p = _find_node(root, args[1])\n" +
          "q = _find_node(root, args[2])\n" +
          "args = [root, p, q]\n",
        transform: "result = result.val if result is not None else None",
        expected: 1,
      },
    ],
  },

  Q36: {
    id: "Q36",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    time: "12-15 min",
    tags: ["BST", "DFS"],
    type: "python",
    statement:
      "Return True iff the tree is a valid BST: every left subtree value &lt; node &lt; every " +
      "right subtree value (strict).",
    examples:
      'Input:  [2,1,3]                   -> True\n' +
      'Input:  [5,1,4,null,null,3,6]     -> False',
    hint:
      "Pass (low, high) bounds down the recursion. Each node must satisfy low &lt; val &lt; high.",
    functionName: "is_valid_bst",
    signature: "is_valid_bst(root: TreeNode) -> bool",
    starter:
      "def is_valid_bst(root):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def is_valid_bst(root):
    def chk(node, lo, hi):
        if node is None: return True
        if not (lo < node.val < hi): return False
        return chk(node.left, lo, node.val) and chk(node.right, node.val, hi)
    return chk(root, float('-inf'), float('inf'))`,
    explanation: "O(n).",
    tests: [
      { args: [[2,1,3]], prepare: "args = [_build_tree(args[0])]", expected: true },
      { args: [[5,1,4,null,null,3,6]], prepare: "args = [_build_tree(args[0])]", expected: false },
      { args: [[1]], prepare: "args = [_build_tree(args[0])]", expected: true },
      { args: [[2,2,2]], prepare: "args = [_build_tree(args[0])]", expected: false },
      { args: [[]], prepare: "args = [_build_tree(args[0])]", expected: true }, // empty == valid
    ],
  },

  Q37: {
    id: "Q37",
    title: "Reverse Linked List",
    difficulty: "Easy",
    time: "8-10 min",
    tags: ["Linked List"],
    type: "python",
    statement: "Reverse a singly linked list and return the new head.",
    examples:
      'Input:  1 -> 2 -> 3 -> 4 -> 5   ->   5 -> 4 -> 3 -> 2 -> 1\n' +
      'Input:  1 -> 2                  ->   2 -> 1',
    hint: "Three pointers: prev, curr, next. Save next before rewiring curr.next = prev.",
    functionName: "reverse_list",
    signature: "reverse_list(head: ListNode) -> ListNode",
    starter:
      "def reverse_list(head):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def reverse_list(head):
    prev = None; curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    explanation: "O(n) time, O(1) space.",
    tests: [
      { args: [[1,2,3,4,5]],
        prepare: "args = [_build_list(args[0])]",
        transform: "result = _linked_to_list(result)",
        expected: [5,4,3,2,1] },
      { args: [[1,2]],
        prepare: "args = [_build_list(args[0])]",
        transform: "result = _linked_to_list(result)",
        expected: [2,1] },
      { args: [[]],
        prepare: "args = [_build_list(args[0])]",
        transform: "result = _linked_to_list(result)",
        expected: [] },
      { args: [[1]],
        prepare: "args = [_build_list(args[0])]",
        transform: "result = _linked_to_list(result)",
        expected: [1] },
    ],
  },

  Q38: {
    id: "Q38",
    title: "Linked List Cycle II (Find Cycle Start)",
    difficulty: "Medium",
    time: "15-18 min",
    tags: ["Linked List", "Floyd"],
    type: "python",
    statement:
      "Return the node where the cycle begins, or None. O(1) extra space. " +
      "Input format: list of values + cycle position (-1 = no cycle).",
    examples:
      'Input:  vals=[3,2,0,-4], pos=1   -> node with value 2\n' +
      'Input:  vals=[1,2], pos=0        -> node with value 1\n' +
      'Input:  vals=[1], pos=-1         -> None',
    hint:
      "Floyd's tortoise & hare to find a meeting point in the cycle, then reset slow to head; " +
      "advance both by 1; they meet at the cycle start.",
    functionName: "detect_cycle",
    signature: "detect_cycle(head: ListNode) -> ListNode",
    starter:
      "def detect_cycle(head):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast: break
    else:
        return None
    if not fast or not fast.next:
        return None
    slow = head
    while slow is not fast:
        slow = slow.next
        fast = fast.next
    return slow`,
    explanation: "Algebra: when they meet, walking L from head and from meeting point both reach cycle start.",
    tests: [
      { args: [[3,2,0,-4], 1],
        prepare: "args = [_build_list_with_cycle(args[0], args[1])]",
        transform: "result = result.val if result is not None else None",
        expected: 2 },
      { args: [[1,2], 0],
        prepare: "args = [_build_list_with_cycle(args[0], args[1])]",
        transform: "result = result.val if result is not None else None",
        expected: 1 },
      { args: [[1], -1],
        prepare: "args = [_build_list_with_cycle(args[0], args[1])]",
        transform: "result = result.val if result is not None else None",
        expected: null },
      { args: [[1,2], -1],
        prepare: "args = [_build_list_with_cycle(args[0], args[1])]",
        transform: "result = result.val if result is not None else None",
        expected: null },
    ],
  },

  Q39: {
    id: "Q39",
    title: "Merge Two Sorted Linked Lists",
    difficulty: "Easy",
    time: "10-12 min",
    tags: ["Linked List"],
    type: "python",
    statement: "Merge two sorted singly linked lists into one sorted list.",
    examples:
      'Input:  [1,2,4], [1,3,4]   -> [1,1,2,3,4,4]\n' +
      'Input:  [], []             -> []',
    hint: "Dummy head + tail pointer. Walk both lists with the smaller head wins.",
    functionName: "merge_two_lists",
    signature: "merge_two_lists(l1: ListNode, l2: ListNode) -> ListNode",
    starter:
      "def merge_two_lists(l1, l2):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def merge_two_lists(l1, l2):
    dummy = ListNode()
    tail = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1; l1 = l1.next
        else:
            tail.next = l2; l2 = l2.next
        tail = tail.next
    tail.next = l1 if l1 else l2
    return dummy.next`,
    explanation: "O(n+m) time, O(1) extra space.",
    tests: [
      { args: [[1,2,4], [1,3,4]],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)",
        expected: [1,1,2,3,4,4] },
      { args: [[], []],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)",
        expected: [] },
      { args: [[], [0]],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)",
        expected: [0] },
      { args: [[1,5], [2,3]],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)",
        expected: [1,2,3,5] },
    ],
  },

  Q40: {
    id: "Q40",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    time: "12-15 min",
    tags: ["Heap", "Top-K"],
    type: "python",
    statement: "Return the k-th largest element in <code>nums</code> (not k-th distinct).",
    examples:
      'Input:  [3,2,1,5,6,4], k=2     -> 5\n' +
      'Input:  [3,2,3,1,2,4,5,5,6], k=4 -> 4',
    hint: "Maintain a size-k min-heap. The heap's root is the k-th largest seen.",
    functionName: "find_kth_largest",
    signature: "find_kth_largest(nums: list[int], k: int) -> int",
    starter:
      "def find_kth_largest(nums, k):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`import heapq
def find_kth_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,
    explanation: "O(n log k).",
    tests: [
      { args: [[3,2,1,5,6,4], 2], expected: 5 },
      { args: [[3,2,3,1,2,4,5,5,6], 4], expected: 4 },
      { args: [[1], 1], expected: 1 },
      { args: [[7,6,5,4,3,2,1], 5], expected: 3 },
    ],
  },

  Q50: {
    id: "Q50",
    title: "Implement Trie (Prefix Tree)",
    difficulty: "Medium",
    time: "15-18 min",
    tags: ["Trie", "Design"],
    type: "python",
    statement:
      "Implement a <code>Trie</code> class with <code>insert(word)</code>, <code>search(word)</code>, " +
      "and <code>starts_with(prefix)</code>. Words consist of lowercase letters.",
    examples:
      'ops = ["Trie","insert","search","search","starts_with","insert","search"]\n' +
      'vals = [[],     ["apple"],["apple"],["app"], ["app"],     ["app"], ["app"]]\n' +
      'out  = [null,   null,     true,     false,   true,        null,    true]',
    hint: "Each node is a dict of children + an end marker. Walks for search/starts_with differ only in the end check.",
    functionName: "Trie",
    signature: "class Trie: insert(word); search(word) -> bool; starts_with(prefix) -> bool",
    starter:
      "class Trie:\n" +
      "    def __init__(self):\n" +
      "        # your code here\n" +
      "        pass\n" +
      "    def insert(self, word):\n" +
      "        pass\n" +
      "    def search(self, word):\n" +
      "        pass\n" +
      "    def starts_with(self, prefix):\n" +
      "        pass\n",
    solution:
`class Trie:
    def __init__(self):
        self.root = {}
    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node: node[ch] = {}
            node = node[ch]
        node['$'] = True
    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node: return None
            node = node[ch]
        return node
    def search(self, word):
        node = self._walk(word)
        return node is not None and node.get('$', False)
    def starts_with(self, prefix):
        return self._walk(prefix) is not None`,
    explanation: "O(L) per op where L is word length.",
    tests: [
      {
        args: [
          ["Trie","insert","search","search","starts_with","insert","search"],
          [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
        ],
        skipCall: true,
        prepare:
          "ops, vals = args[0], args[1]\n" +
          "result = []\n" +
          "t = None\n" +
          "for op, v in zip(ops, vals):\n" +
          "    if op == 'Trie': t = Trie(); result.append(None)\n" +
          "    elif op == 'insert': t.insert(*v); result.append(None)\n" +
          "    elif op == 'search': result.append(bool(t.search(*v)))\n" +
          "    elif op == 'starts_with': result.append(bool(t.starts_with(*v)))\n",
        expected: [null, null, true, false, true, null, true],
      },
      {
        args: [
          ["Trie","starts_with","insert","starts_with","search"],
          [[], ["a"],         ["abc"], ["a"],          ["ab"]]
        ],
        skipCall: true,
        prepare:
          "ops, vals = args[0], args[1]\n" +
          "result = []\n" +
          "t = None\n" +
          "for op, v in zip(ops, vals):\n" +
          "    if op == 'Trie': t = Trie(); result.append(None)\n" +
          "    elif op == 'insert': t.insert(*v); result.append(None)\n" +
          "    elif op == 'search': result.append(bool(t.search(*v)))\n" +
          "    elif op == 'starts_with': result.append(bool(t.starts_with(*v)))\n",
        expected: [null, false, null, true, false],
      },
    ],
  },

  // ============================================================
  // DP / BACKTRACKING / GREEDY
  // ============================================================

  Q41: {
    id: "Q41",
    title: "Climbing Stairs",
    difficulty: "Easy",
    time: "8-10 min",
    tags: ["DP", "Fibonacci"],
    type: "python",
    statement: "Each step take 1 or 2 stairs. How many ways to climb <code>n</code> stairs?",
    examples:
      'Input:  n=2  -> 2\n' +
      'Input:  n=3  -> 3\n' +
      'Input:  n=5  -> 8',
    hint: "f(n) = f(n-1) + f(n-2) — Fibonacci. Track two rolling values.",
    functionName: "climb_stairs",
    signature: "climb_stairs(n: int) -> int",
    starter:
      "def climb_stairs(n):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def climb_stairs(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
    explanation: "O(n) time, O(1) space.",
    tests: [
      { args: [1], expected: 1 },
      { args: [2], expected: 2 },
      { args: [3], expected: 3 },
      { args: [5], expected: 8 },
      { args: [10], expected: 89 },
      { args: [20], expected: 10946 },
    ],
  },

  Q42: {
    id: "Q42",
    title: "Coin Change",
    difficulty: "Medium",
    time: "18-22 min",
    tags: ["DP", "Unbounded Knapsack"],
    type: "python",
    statement: "Fewest coins from <code>coins</code> (infinite supply) to make <code>amount</code>, or -1.",
    examples:
      'Input:  coins=[1,2,5], amount=11   -> 3   (5+5+1)\n' +
      'Input:  coins=[2], amount=3        -> -1\n' +
      'Input:  coins=[1], amount=0        -> 0',
    hint: "dp[a] = 1 + min(dp[a - c]). Initialize dp[0] = 0 and dp[i>0] = amount+1 (sentinel).",
    functionName: "coin_change",
    signature: "coin_change(coins: list[int], amount: int) -> int",
    starter:
      "def coin_change(coins, amount):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def coin_change(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1`,
    explanation: "O(amount * |coins|).",
    tests: [
      { args: [[1,2,5], 11], expected: 3 },
      { args: [[2], 3], expected: -1 },
      { args: [[1], 0], expected: 0 },
      { args: [[1,2,5], 100], expected: 20 },
      { args: [[1,5,10,25], 30], expected: 2 },
    ],
  },

  Q43: {
    id: "Q43",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium-Hard",
    time: "20-25 min",
    tags: ["DP", "Binary Search"],
    type: "python",
    statement: "Length of the longest strictly increasing subsequence of <code>nums</code>.",
    examples:
      'Input:  [10,9,2,5,3,7,101,18]  -> 4\n' +
      'Input:  [0,1,0,3,2,3]          -> 4\n' +
      'Input:  [7,7,7,7,7,7,7]        -> 1',
    hint:
      "Maintain <code>tails</code>: tails[k] = smallest tail of any increasing subseq of length k+1. " +
      "Binary search the slot for each new value. Answer = len(tails).",
    functionName: "length_of_lis",
    signature: "length_of_lis(nums: list[int]) -> int",
    starter:
      "def length_of_lis(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`from bisect import bisect_left
def length_of_lis(nums):
    tails = []
    for x in nums:
        i = bisect_left(tails, x)
        if i == len(tails): tails.append(x)
        else: tails[i] = x
    return len(tails)`,
    explanation: "O(n log n).",
    tests: [
      { args: [[10,9,2,5,3,7,101,18]], expected: 4 },
      { args: [[0,1,0,3,2,3]], expected: 4 },
      { args: [[7,7,7,7,7,7,7]], expected: 1 },
      { args: [[1]], expected: 1 },
      { args: [[1,3,6,7,9,4,10,5,6]], expected: 6 },
    ],
  },

  Q47: {
    id: "Q47",
    title: "Subsets (Power Set)",
    difficulty: "Medium",
    time: "12-15 min",
    tags: ["Backtracking", "Bit Manipulation"],
    type: "python",
    statement: "Return all subsets of an array of <strong>unique</strong> integers. Order does not matter.",
    examples:
      'Input:  [1,2,3]  -> [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]\n' +
      'Input:  [0]      -> [[],[0]]',
    hint:
      "Backtrack with a start index: at every recursion node, append a copy of the current path " +
      "and recurse for each remaining element.",
    functionName: "subsets",
    signature: "subsets(nums: list[int]) -> list[list[int]]",
    starter:
      "def subsets(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def subsets(nums):
    out = []; path = []
    def bt(start):
        out.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            bt(i + 1)
            path.pop()
    bt(0)
    return out`,
    explanation: "O(n * 2^n). Copy at every node — sharing the live `path` would mutate stored entries.",
    tests: [
      { args: [[1,2,3]],
        expected: [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]],
        equality: "sorted-list" },
      { args: [[0]], expected: [[],[0]], equality: "sorted-list" },
      { args: [[]], expected: [[]], equality: "sorted-list" },
    ],
  },

  Q51: {
    id: "Q51",
    title: "Jump Game",
    difficulty: "Medium",
    time: "12-15 min",
    tags: ["Greedy", "Array"],
    type: "python",
    statement:
      "Each index holds the max jump length from that index. Starting at index 0, can you reach the last index?",
    examples:
      'Input:  [2,3,1,1,4]  -> True\n' +
      'Input:  [3,2,1,0,4]  -> False  (stuck at i=3)\n' +
      'Input:  [0]          -> True',
    hint: "Track the furthest reachable index. If i > furthest, you cannot stand here.",
    functionName: "can_jump",
    signature: "can_jump(nums: list[int]) -> bool",
    starter:
      "def can_jump(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def can_jump(nums):
    furthest = 0
    n = len(nums)
    for i in range(n):
        if i > furthest: return False
        if i + nums[i] > furthest:
            furthest = i + nums[i]
        if furthest >= n - 1: return True
    return True`,
    explanation: "O(n).",
    tests: [
      { args: [[2,3,1,1,4]], expected: true },
      { args: [[3,2,1,0,4]], expected: false },
      { args: [[0]], expected: true },
      { args: [[1,0,1,0]], expected: false },
      { args: [[2,0,0]], expected: true },
    ],
  },

  // ============================================================
  // SQL (no code runner — solution viewable in modal)
  // ============================================================

  Q07: {
    id: "Q07",
    title: "Database Schema Design — Course Platform",
    difficulty: "Easy-Medium",
    time: "15-20 min",
    tags: ["SQL", "Schema Design"],
    type: "sql",
    statement:
      "Design tables for Students, Instructors, Courses, Enrollments. Then write a query for " +
      "the top 3 students by average grade among students who have completed at least 2 courses.",
    examples: "Entities:\n  Student (N:M) Course\n  Instructor (1:N) Course\nEnrollment is the junction table.",
    hint:
      "Junction table for Student↔Course. Use GROUP BY + HAVING for the 'at least 2 completed' " +
      "filter, then ORDER BY ... LIMIT 3.",
    solution:
`CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE instructors (
    instructor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    instructor_id INT NOT NULL,
    credits INT CHECK (credits > 0),
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id)
);
CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade DECIMAL(4, 2),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id)  REFERENCES courses(course_id),
    UNIQUE(student_id, course_id)
);

SELECT s.student_id, s.name, AVG(e.grade) AS avg_grade
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
WHERE e.grade IS NOT NULL
GROUP BY s.student_id, s.name
HAVING COUNT(*) >= 2
ORDER BY avg_grade DESC
LIMIT 3;`,
    sqlSchema:
`CREATE TABLE students (student_id INTEGER PRIMARY KEY, name TEXT, email TEXT);
CREATE TABLE enrollments (enrollment_id INTEGER PRIMARY KEY, student_id INTEGER, course_id INTEGER, grade REAL);
INSERT INTO students VALUES
  (1,'Alex','alex@x'),(2,'Bea','bea@x'),(3,'Chris','chris@x'),
  (4,'Dana','dana@x'),(5,'Eve','eve@x');
INSERT INTO enrollments(student_id,course_id,grade) VALUES
  (1,1,90),(1,2,85),
  (2,1,95),
  (3,1,80),(3,2,70),(3,3,75),
  (4,1,100),(4,2,99),
  (5,1,60),(5,2,NULL);`,
    sqlStarter: "-- Top 3 students by average grade (>= 2 completed courses).\n-- Tables: students(student_id, name, email), enrollments(enrollment_id, student_id, course_id, grade)\nSELECT\n",
    sqlSolution:
`SELECT s.student_id, s.name, AVG(e.grade) AS avg_grade
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
WHERE e.grade IS NOT NULL
GROUP BY s.student_id, s.name
HAVING COUNT(*) >= 2
ORDER BY avg_grade DESC
LIMIT 3;`,
    tests: [
      {
        name: "Top 3 by average grade",
        orderMatters: true,
        expected: {
          columns: ["student_id", "name", "avg_grade"],
          rows: [[4, "Dana", 99.5], [1, "Alex", 87.5], [3, "Chris", 75]],
        },
      },
    ],
  },

  Q08: {
    id: "Q08",
    title: "SQL — Trips and Users (Cancellation Rate)",
    difficulty: "Hard",
    time: "20-25 min",
    tags: ["SQL", "Conditional Aggregation", "JOIN"],
    type: "sql",
    statement:
      "Tables: <code>Trips(id, client_id, driver_id, city_id, status, request_at)</code> and " +
      "<code>Users(users_id, banned, role)</code>. Compute the daily cancellation rate (rounded to 2dp) " +
      "between 2013-10-01 and 2013-10-03 among trips whose client AND driver are both unbanned. " +
      "Status is 'cancelled' if it starts with 'cancelled'.",
    examples: "See full bank for the sample tables and expected output.",
    hint:
      "JOIN Users twice (client + driver) with banned='No'. Use AVG(CASE WHEN status LIKE 'cancelled%' " +
      "THEN 1 ELSE 0 END) grouped by request_at.",
    solution:
`SELECT
    t.request_at AS Day,
    ROUND(
        AVG(CASE WHEN t.status LIKE 'cancelled%' THEN 1.0 ELSE 0 END),
        2
    ) AS \`Cancellation Rate\`
FROM Trips t
JOIN Users uc ON t.client_id = uc.users_id AND uc.banned = 'No'
JOIN Users ud ON t.driver_id = ud.users_id AND ud.banned = 'No'
WHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03'
GROUP BY t.request_at
ORDER BY t.request_at;`,
    sqlSchema:
`CREATE TABLE Trips (id INTEGER PRIMARY KEY, client_id INTEGER, driver_id INTEGER, city_id INTEGER, status TEXT, request_at TEXT);
CREATE TABLE Users (users_id INTEGER PRIMARY KEY, banned TEXT, role TEXT);
INSERT INTO Users VALUES
  (1,'No','client'),(2,'Yes','client'),
  (3,'No','driver'),(4,'Yes','driver');
INSERT INTO Trips VALUES
  (1,1,3,1,'completed','2013-10-01'),
  (2,1,3,1,'cancelled_by_driver','2013-10-01'),
  (3,2,3,1,'completed','2013-10-01'),
  (4,1,4,1,'completed','2013-10-01'),
  (5,1,3,1,'completed','2013-10-02'),
  (6,1,3,1,'cancelled_by_client','2013-10-03'),
  (7,1,3,1,'completed','2013-10-03');`,
    sqlStarter: "-- Daily cancellation rate (Day, Cancellation Rate) for unbanned client AND unbanned driver,\n-- 2013-10-01..03, status 'cancelled%' counts as cancelled.\nSELECT\n",
    tests: [
      {
        name: "Daily cancellation rate 2013-10-01..03",
        orderMatters: true,
        expected: {
          columns: ["Day", "Cancellation Rate"],
          rows: [
            ["2013-10-01", 0.5],
            ["2013-10-02", 0],
            ["2013-10-03", 0.5],
          ],
        },
      },
    ],
  },

  Q11: {
    id: "Q11",
    title: "SQL — Find Duplicate Emails",
    difficulty: "Easy",
    time: "5-8 min",
    tags: ["SQL", "GROUP BY"],
    type: "sql",
    statement: "From a Person(id, email) table, return all emails that appear more than once.",
    examples: "Input rows: (1,a@b), (2,c@d), (3,a@b) ->  a@b",
    hint: "GROUP BY email HAVING COUNT(*) > 1.",
    solution:
`SELECT email
FROM Person
GROUP BY email
HAVING COUNT(*) > 1;`,
    sqlSchema:
`CREATE TABLE Person (id INTEGER PRIMARY KEY, email TEXT);
INSERT INTO Person VALUES
  (1,'a@b.com'),(2,'c@d.com'),(3,'a@b.com'),(4,'e@f.com'),(5,'a@b.com');`,
    sqlStarter: "-- Return emails that appear more than once.\n-- Table: Person(id, email)\nSELECT\n",
    tests: [
      {
        name: "Duplicate emails",
        orderMatters: false,
        expected: { columns: ["email"], rows: [["a@b.com"]] },
      },
    ],
  },

  Q15: {
    id: "Q15",
    title: "SQL — Department Top 3 Salaries",
    difficulty: "Medium",
    time: "15-18 min",
    tags: ["SQL", "Window Functions"],
    type: "sql",
    statement:
      "Find employees in the top three <strong>unique</strong> salaries per department. " +
      "Tables: Employee(id, name, salary, departmentId), Department(id, name).",
    examples: "See full bank.",
    hint: "DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC). Filter rank <= 3.",
    solution:
`SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM (
    SELECT *,
        DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rnk
    FROM Employee
) e
JOIN Department d ON e.departmentId = d.id
WHERE e.rnk <= 3;`,
    sqlSchema:
`CREATE TABLE Department (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE Employee (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, departmentId INTEGER);
INSERT INTO Department VALUES (1,'Eng'),(2,'Sales');
INSERT INTO Employee VALUES
  (1,'Alice',100,1),(2,'Bob',90,1),(3,'Carol',90,1),(4,'Dan',80,1),(5,'Eve',70,1),
  (6,'Faye',60,2),(7,'Greg',50,2);`,
    sqlStarter: "-- Employees in the TOP 3 unique salaries of their department.\n-- Tables: Employee(id, name, salary, departmentId), Department(id, name)\nSELECT\n",
    tests: [
      {
        name: "Top 3 distinct salaries per department",
        orderMatters: false,
        expected: {
          columns: ["Department", "Employee", "Salary"],
          rows: [
            ["Eng", "Alice", 100],
            ["Eng", "Bob", 90],
            ["Eng", "Carol", 90],
            ["Eng", "Dan", 80],
            ["Sales", "Faye", 60],
            ["Sales", "Greg", 50],
          ],
        },
      },
    ],
  },

  Q16: {
    id: "Q16",
    title: "SQL — Median Employee Salary per Company",
    difficulty: "Hard",
    time: "20-25 min",
    tags: ["SQL", "Window Functions", "Median"],
    type: "sql",
    statement:
      "Return the median-salary row(s) of each company. Odd n: one row. Even n: two rows. " +
      "Table: Employee(id, company, salary).",
    examples: "See full bank.",
    hint:
      "ROW_NUMBER() over (PARTITION BY company ORDER BY salary, id), COUNT(*) over (PARTITION BY company). " +
      "Median rows are rn IN (FLOOR((cnt+1)/2), FLOOR(cnt/2)+1).",
    solution:
`WITH ranked AS (
    SELECT id, company, salary,
        ROW_NUMBER() OVER (PARTITION BY company ORDER BY salary, id) AS rn,
        COUNT(*)   OVER (PARTITION BY company)                       AS cnt
    FROM Employee
)
SELECT id, company, salary
FROM ranked
WHERE rn IN (FLOOR((cnt + 1) / 2.0), FLOOR(cnt / 2.0) + 1)
ORDER BY company, rn;`,
    sqlSchema:
`CREATE TABLE Employee (id INTEGER PRIMARY KEY, company TEXT, salary INTEGER);
INSERT INTO Employee VALUES
  (1,'A',1000),(2,'A',2000),(3,'A',3000),
  (4,'B',1500),(5,'B',2500),
  (6,'C',500);`,
    sqlStarter: "-- Median-salary row(s) per company.\n-- Odd n -> one row; even n -> two rows. Table: Employee(id, company, salary).\nWITH\n",
    tests: [
      {
        name: "Median per company",
        orderMatters: true,
        expected: {
          columns: ["id", "company", "salary"],
          rows: [
            [2, "A", 2000],
            [4, "B", 1500],
            [5, "B", 2500],
            [6, "C", 500],
          ],
        },
      },
    ],
  },

  Q24: {
    id: "Q24",
    title: "SQL — Customers Who Never Order",
    difficulty: "Easy",
    time: "8-10 min",
    tags: ["SQL", "LEFT JOIN", "NULL"],
    type: "sql",
    statement: "From Customers(id, name) and Orders(id, customerId), return customers with no orders.",
    examples: "See full bank.",
    hint: "LEFT JOIN + WHERE Orders.id IS NULL — or NOT IN / NOT EXISTS.",
    solution:
`-- Method 1: LEFT JOIN
SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.id IS NULL;

-- Method 2: NOT EXISTS
SELECT name AS Customers
FROM Customers c
WHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.customerId = c.id);`,
    sqlSchema:
`CREATE TABLE Customers (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE Orders (id INTEGER PRIMARY KEY, customerId INTEGER);
INSERT INTO Customers VALUES (1,'Joe'),(2,'Henry'),(3,'Sam'),(4,'Max');
INSERT INTO Orders VALUES (1,3),(2,1);`,
    sqlStarter: "-- Customers with no orders. Return a single column 'Customers'.\n-- Tables: Customers(id, name), Orders(id, customerId)\nSELECT\n",
    sqlSolution:
`SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.id IS NULL;`,
    tests: [
      {
        name: "Customers with no orders",
        orderMatters: false,
        expected: { columns: ["Customers"], rows: [["Henry"], ["Max"]] },
      },
    ],
  },

  Q28: {
    id: "Q28",
    title: "SQL — Second Highest Salary",
    difficulty: "Easy-Medium",
    time: "10-12 min",
    tags: ["SQL", "Subquery"],
    type: "sql",
    statement: "Return the second highest salary from Employee, or NULL if it does not exist.",
    examples: "100, 200, 300  ->  200",
    hint:
      "MAX(salary) WHERE salary < MAX(salary). Or DISTINCT ORDER BY ... LIMIT 1 OFFSET 1 wrapped " +
      "in an outer SELECT to return NULL when missing.",
    solution:
`SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);

-- Or:
SELECT (
    SELECT DISTINCT salary
    FROM Employee
    ORDER BY salary DESC
    LIMIT 1 OFFSET 1
) AS SecondHighestSalary;`,
    sqlSchema:
`CREATE TABLE Employee (id INTEGER PRIMARY KEY, salary INTEGER);
INSERT INTO Employee VALUES (1,100),(2,200),(3,300);`,
    sqlStarter: "-- Return the second highest salary (single column 'SecondHighestSalary').\n-- If there isn't one, return NULL. Table: Employee(id, salary)\nSELECT\n",
    sqlSolution:
`SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);`,
    tests: [
      {
        name: "Three distinct salaries",
        orderMatters: false,
        expected: { columns: ["SecondHighestSalary"], rows: [[200]] },
      },
      {
        name: "Only one salary -> NULL",
        orderMatters: false,
        schema:
`CREATE TABLE Employee (id INTEGER PRIMARY KEY, salary INTEGER);
INSERT INTO Employee VALUES (1,100);`,
        expected: { columns: ["SecondHighestSalary"], rows: [[null]] },
      },
    ],
  },

  Q32: {
    id: "Q32",
    title: "SQL — Rising Temperature",
    difficulty: "Easy-Medium",
    time: "12-15 min",
    tags: ["SQL", "Self JOIN", "Date"],
    type: "sql",
    statement: "From Weather(id, recordDate, temperature) return ids whose temperature is higher than yesterday's.",
    examples: "See full bank.",
    hint: "Self join with recordDate = previous + 1 day, filter for higher temperature.",
    solution:
`SELECT w1.id
FROM Weather w1
JOIN Weather w2 ON w1.recordDate = DATE_ADD(w2.recordDate, INTERVAL 1 DAY)
WHERE w1.temperature > w2.temperature;

-- Portable (SQLite):
SELECT w1.id
FROM Weather w1
JOIN Weather w2 ON w1.recordDate = date(w2.recordDate, '+1 day')
WHERE w1.temperature > w2.temperature;`,
    sqlSchema:
`CREATE TABLE Weather (id INTEGER PRIMARY KEY, recordDate TEXT, temperature INTEGER);
INSERT INTO Weather VALUES
  (1,'2015-01-01',10),
  (2,'2015-01-02',25),
  (3,'2015-01-03',20),
  (4,'2015-01-04',30),
  (5,'2015-02-01',50);`,
    sqlStarter: "-- IDs whose temperature is higher than YESTERDAY's record.\n-- Table: Weather(id, recordDate TEXT, temperature INTEGER)\n-- Hint: SQLite has date(d, '+1 day') for date math.\nSELECT\n",
    sqlSolution:
`SELECT w1.id
FROM Weather w1
JOIN Weather w2 ON w1.recordDate = date(w2.recordDate, '+1 day')
WHERE w1.temperature > w2.temperature;`,
    tests: [
      {
        name: "Days with rising temperature",
        orderMatters: false,
        expected: { columns: ["id"], rows: [[2], [4]] },
      },
    ],
  },

  Q52: {
    id: "Q52",
    title: "SQL — Employees Earning More Than Their Managers",
    difficulty: "Easy",
    time: "8-10 min",
    tags: ["SQL", "Self JOIN"],
    type: "sql",
    statement: "Employee(id, name, salary, managerId). Return employee names earning more than their manager.",
    examples: "Joe:70k(mgr 3=Sam:60k) -> Joe.",
    hint: "Self-join Employee aliased twice: e (employee) and m (manager).",
    solution:
`SELECT e.name AS Employee
FROM Employee e
JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;`,
    sqlSchema:
`CREATE TABLE Employee (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, managerId INTEGER);
INSERT INTO Employee VALUES
  (1,'Joe',70000,3),(2,'Henry',80000,4),(3,'Sam',60000,NULL),(4,'Max',90000,NULL);`,
    sqlStarter: "-- Employees earning strictly more than their manager.\n-- Return single column 'Employee'. Table: Employee(id, name, salary, managerId)\nSELECT\n",
    tests: [
      {
        name: "Joe earns more than mgr Sam",
        orderMatters: false,
        expected: { columns: ["Employee"], rows: [["Joe"]] },
      },
    ],
  },

  Q53: {
    id: "Q53",
    title: "SQL — Consecutive Numbers (Streaks)",
    difficulty: "Medium",
    time: "15-18 min",
    tags: ["SQL", "LAG", "Self JOIN"],
    type: "sql",
    statement: "From Logs(id, num) (id sequential, no gaps), return numbers that appear at least three times in a row.",
    examples: "id 1..7 with nums 1,1,1,2,1,2,2  ->  1.",
    hint: "LAG(num, 1) and LAG(num, 2) bring previous two rows; keep equal to current. Or 3-way self join.",
    solution:
`SELECT DISTINCT num AS ConsecutiveNums
FROM (
    SELECT num,
        LAG(num, 1) OVER (ORDER BY id) AS prev1,
        LAG(num, 2) OVER (ORDER BY id) AS prev2
    FROM Logs
) t
WHERE num = prev1 AND num = prev2;

-- Portable 3-way self join:
SELECT DISTINCT l1.num AS ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l2.id = l1.id + 1 AND l2.num = l1.num
JOIN Logs l3 ON l3.id = l1.id + 2 AND l3.num = l1.num;`,
    sqlSchema:
`CREATE TABLE Logs (id INTEGER PRIMARY KEY, num INTEGER);
INSERT INTO Logs VALUES (1,1),(2,1),(3,1),(4,2),(5,1),(6,2),(7,2);`,
    sqlStarter: "-- Numbers that appear 3+ times in a row (consecutive id).\n-- Return single column 'ConsecutiveNums', distinct. Table: Logs(id, num)\nSELECT\n",
    sqlSolution:
`SELECT DISTINCT num AS ConsecutiveNums
FROM (
    SELECT num,
        LAG(num, 1) OVER (ORDER BY id) AS prev1,
        LAG(num, 2) OVER (ORDER BY id) AS prev2
    FROM Logs
) t
WHERE num = prev1 AND num = prev2;`,
    tests: [
      {
        name: "1 appears 3+ times in a row",
        orderMatters: false,
        expected: { columns: ["ConsecutiveNums"], rows: [[1]] },
      },
    ],
  },

  // ============================================================
  // NEW (added in revision pass) — DP / Array / Two-Pointer / LL
  // ============================================================

  Q54: {
    id: "Q54",
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: "Medium",
    time: "12-15 min",
    tags: ["DP", "Array", "Kadane"],
    type: "python",
    statement:
      "Given an integer array <code>nums</code>, find the contiguous subarray (with at least " +
      "one element) that has the largest sum and return that sum.",
    examples:
      'Input:  [-2,1,-3,4,-1,2,1,-5,4]  -> 6   (subarray [4,-1,2,1])\n' +
      'Input:  [1]                       -> 1\n' +
      'Input:  [5,4,-1,7,8]              -> 23\n' +
      'Input:  [-3,-2,-1,-5]             -> -1  (best is the single element -1)',
    hint:
      "Kadane: at every index i, the best sum ending at i either extends the previous best " +
      "or starts fresh at nums[i] — take the larger. Track the running maximum across all i.",
    functionName: "max_subarray",
    signature: "max_subarray(nums: list[int]) -> int",
    starter:
      "def max_subarray(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def max_subarray(nums):
    cur = best = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`,
    explanation:
      "O(n) time, O(1) space. Foundational DP: <code>dp[i] = max(nums[i], dp[i-1] + nums[i])</code>, " +
      "answer = max(dp). The classic gotcha is initialising <code>cur = best = 0</code> — it " +
      "fails on all-negative arrays because the right answer is the largest single element.",
    tests: [
      { args: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5,4,-1,7,8]], expected: 23 },
      { args: [[-1]], expected: -1 },
      { args: [[-3,-2,-1,-5]], expected: -1 },
      { args: [[2,3,-2,4]], expected: 7 },
      { args: [[-2,-1]], expected: -1 },
    ],
  },

  Q55: {
    id: "Q55",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    time: "10-12 min",
    tags: ["Array", "One-Pass", "DP"],
    type: "python",
    statement:
      "<code>prices[i]</code> is the price of a stock on day i. Choose ONE day to buy and a " +
      "LATER day to sell to maximise profit. Return the max profit, or 0 if no profit is possible.",
    examples:
      'Input:  [7,1,5,3,6,4]  -> 5   (buy at 1 on day 2, sell at 6 on day 5)\n' +
      'Input:  [7,6,4,3,1]    -> 0   (price only falls)\n' +
      'Input:  [2,4,1]        -> 2',
    hint:
      "Walk left-to-right tracking the minimum price seen so far. At each day, the best sale " +
      "from today is <code>price - min_so_far</code>.",
    functionName: "max_profit",
    signature: "max_profit(prices: list[int]) -> int",
    starter:
      "def max_profit(prices):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def max_profit(prices):
    if not prices: return 0
    best = 0
    lo = prices[0]
    for p in prices[1:]:
        if p < lo:
            lo = p
        elif p - lo > best:
            best = p - lo
    return best`,
    explanation:
      "O(n) one-pass, O(1) space. Same shape as Kadane on diffs: the answer is the maximum of " +
      "<code>prices[i] - min(prices[0..i-1])</code>.",
    tests: [
      { args: [[7,1,5,3,6,4]], expected: 5 },
      { args: [[7,6,4,3,1]], expected: 0 },
      { args: [[1]], expected: 0 },
      { args: [[2,4,1]], expected: 2 },
      { args: [[3,2,6,5,0,3]], expected: 4 },
      { args: [[]], expected: 0 },
    ],
  },

  Q56: {
    id: "Q56",
    title: "3Sum",
    difficulty: "Medium",
    time: "20-25 min",
    tags: ["Array", "Two Pointers", "Sorting"],
    type: "python",
    statement:
      "Given an integer array, return all <strong>unique</strong> triplets " +
      "<code>[a, b, c]</code> from <code>nums</code> with <code>a + b + c == 0</code>. The " +
      "solution set must not contain duplicate triplets.",
    examples:
      'Input:  [-1,0,1,2,-1,-4]  -> [[-1,-1,2],[-1,0,1]]\n' +
      'Input:  [0,1,1]           -> []\n' +
      'Input:  [0,0,0]           -> [[0,0,0]]',
    hint:
      "Sort first. For each i, run a two-pointer on the suffix. Skip duplicates at i AND after " +
      "every successful triplet on both pointers to avoid generating the same triplet twice.",
    functionName: "three_sum",
    signature: "three_sum(nums: list[int]) -> list[list[int]]",
    starter:
      "def three_sum(nums):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def three_sum(nums):
    nums.sort()
    out = []
    n = len(nums)
    for i in range(n - 2):
        if nums[i] > 0: break
        if i > 0 and nums[i] == nums[i - 1]: continue
        l, r = i + 1, n - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                out.append([nums[i], nums[l], nums[r]])
                l += 1; r -= 1
                while l < r and nums[l] == nums[l - 1]: l += 1
                while l < r and nums[r] == nums[r + 1]: r -= 1
            elif s < 0:
                l += 1
            else:
                r -= 1
    return out`,
    explanation:
      "O(n²) time after the O(n log n) sort, O(1) extra space (output excluded). The dedup " +
      "logic is what trips most candidates — without it you'll get repeated triplets when the " +
      "same value appears multiple times.",
    tests: [
      { args: [[-1,0,1,2,-1,-4]],
        expected: [[-1,-1,2],[-1,0,1]], equality: "sorted-list" },
      { args: [[0,1,1]], expected: [], equality: "sorted-list" },
      { args: [[0,0,0]], expected: [[0,0,0]], equality: "sorted-list" },
      { args: [[-2,0,1,1,2]],
        expected: [[-2,0,2],[-2,1,1]], equality: "sorted-list" },
      { args: [[1,2,-2,-1]], expected: [], equality: "sorted-list" },
    ],
  },

  Q57: {
    id: "Q57",
    title: "Add Two Numbers (Linked List)",
    difficulty: "Medium",
    time: "15-18 min",
    tags: ["Linked List", "Math", "Carry"],
    type: "python",
    statement:
      "You are given two non-empty linked lists representing two non-negative integers. The " +
      "digits are stored in <strong>reverse order</strong> (one digit per node). Add the two " +
      "numbers and return the sum as a linked list in the same reverse order.",
    examples:
      'Input:  l1=[2,4,3], l2=[5,6,4]                    -> [7,0,8]\n' +
      '         (342 + 465 = 807, stored reversed)\n' +
      'Input:  l1=[0], l2=[0]                            -> [0]\n' +
      'Input:  l1=[9,9,9,9,9,9,9], l2=[9,9,9,9]          -> [8,9,9,9,0,0,0,1]',
    hint:
      "Walk both lists in lockstep with a running <code>carry</code>. Loop while either list " +
      "has nodes OR carry > 0. Use a dummy head so you don't special-case the first append.",
    functionName: "add_two_numbers",
    signature: "add_two_numbers(l1: ListNode, l2: ListNode) -> ListNode",
    starter:
      "def add_two_numbers(l1, l2):\n" +
      "    # your code here\n" +
      "    pass\n",
    solution:
`def add_two_numbers(l1, l2):
    dummy = ListNode()
    tail = dummy
    carry = 0
    while l1 or l2 or carry:
        a = l1.val if l1 else 0
        b = l2.val if l2 else 0
        s = a + b + carry
        carry, digit = divmod(s, 10)
        tail.next = ListNode(digit)
        tail = tail.next
        if l1: l1 = l1.next
        if l2: l2 = l2.next
    return dummy.next`,
    explanation:
      "O(max(m, n)). The <code>or carry</code> in the loop condition is the trick that handles " +
      "the carry-only final node (e.g., [9] + [1] needs a trailing [1] in the output).",
    tests: [
      { args: [[2,4,3], [5,6,4]],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)",
        expected: [7,0,8] },
      { args: [[0], [0]],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)",
        expected: [0] },
      { args: [[9,9,9,9,9,9,9], [9,9,9,9]],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)",
        expected: [8,9,9,9,0,0,0,1] },
      { args: [[1], [9,9]],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)",
        expected: [0,0,1] },
      { args: [[5], [5]],
        prepare: "args = [_build_list(args[0]), _build_list(args[1])]",
        transform: "result = _linked_to_list(result)",
        expected: [0,1] },
    ],
  },

};

// ----------------------------------------------------------------
// QUESTION GROUPS  (which question IDs each Practice Set draws)
// ----------------------------------------------------------------
window.PRACTICE_SETS = {
  PS1: { module: "M1", title: "Practice Set 1 — Foundations", qids: ["Q21","Q12","Q10","Q41"] },
  PS2: { module: "M2", title: "Practice Set 2 — Strings, Stacks, Parsing",
         qids: ["Q01","Q03","Q04","Q09","Q13","Q14"] },
  PS3: { module: "M3", title: "Practice Set 3 — SQL & Databases",
         qids: ["Q07","Q11","Q24","Q28","Q32","Q52"] },
  PS4: { module: "M4", title: "Practice Set 4 — Graphs & Search",
         qids: ["Q05","Q19","Q23","Q48","Q49"] },
  PS5: { module: "M5", title: "Practice Set 5 — Arrays, Two-Pointers, Sliding Windows",
         qids: ["Q25","Q29","Q33","Q34","Q46","Q55"] },
  PS6: { module: "M6", title: "Practice Set 6 — Math, Bit Ops, Binary Search",
         qids: ["Q22","Q27","Q30","Q44","Q45"] },
  PS7: { module: "M7", title: "Practice Set 7 — Trees, Linked Lists, Heap, Trie",
         qids: ["Q35","Q36","Q37","Q39","Q40","Q50","Q57"] },
  PS8: { module: "M8", title: "Practice Set 8 — DP, Backtracking, Greedy",
         qids: ["Q42","Q43","Q47","Q51","Q54"] },
};

// Final exam pool (held-back questions across all topics). The exam draws min(12, pool.length).
window.FINAL_EXAM_POOL = ["Q02","Q06","Q08","Q15","Q16","Q17","Q18","Q20","Q26","Q31","Q38","Q53","Q56"];
