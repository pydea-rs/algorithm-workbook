# Odoo Coderbyte Assessment — Extended Practice Question Bank
## Realistic Mock Questions + Hard Drills + Topic Gap Coverage

---

## How to Use This Question Bank

Each question in this bank includes:
- **Estimated Time**: How long you should aim to spend on it during a 1-hour assessment.
- **Difficulty Level**: Easy / Medium / Hard (based on actual candidate reports).
- **Topic Tags**: Which concepts are tested.
- **Problem Statement**: The exact-style prompt you might see on Coderbyte.
- **Constraints**: Input size limits that dictate your algorithm choice.
- **Hint**: A single-sentence core approach (cover this first, try to solve, then reveal).
- **Solution**: Clean, typed Python with comments and complexity analysis.

**Study Method:**
1. Read the problem and constraints.
2. Cover the hint and solution.
3. Set a timer for the estimated time.
4. Solve on paper or in an IDE.
5. Compare with the solution. Analyze gaps.

**This Extended Bank adds:**
- Hard "stretch" variants interleaved between the original questions (so you keep practicing the same family at increasing difficulty).
- Brand-new questions at the end (Q33–Q53) covering important arenas the original bank did not target: sliding window, trees, linked lists, DP, binary search, heap, bit ops, intervals, backtracking, topological sort, union find, tries, greedy, and additional SQL patterns.

---

## Question 1: HTML Tag Validator

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 12–15 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | String, Stack, Parsing |
| **Source Pattern** | Reported Odoo Coderbyte question |

### Problem Statement

Write a function `validate_html_tags(html)` that takes a string `html` representing a snippet of HTML and returns `True` if all tags are properly nested and closed, and `False` otherwise.

A tag is defined as text between `<` and `>`. Opening tags have the form `<tagname>` or `<tagname attr="value">`. Closing tags have the form `</tagname>`. Tags are properly nested if every closing tag matches the most recent unmatched opening tag.

You may assume:
- Tag names contain only lowercase letters.
- Attributes (if present) are separated by spaces after the tag name.
- There are no self-closing tags (e.g., `<br/>`) in the input.
- The input contains no text content outside tags (only tags).

### Examples

```
Input:  "<div><p></p></div>"
Output: True

Input:  "<div><p></div></p>"
Output: False

Input:  "<a><b><c></c></b></a>"
Output: True

Input:  "<a></a><b></b>"
Output: True

Input:  "<a>"
Output: False
```

### Constraints

- `1 <= len(html) <= 10^4`

### Hint

> Use a stack: push every opening tag; when you encounter a closing tag, pop from the stack and check if the names match.

### Solution

```python
def validate_html_tags(html: str) -> bool:
    stack = []
    i = 0
    while i < len(html):
        if html[i] == '<':
            # Find the end of this tag
            j = html.find('>', i)
            if j == -1:
                return False  # Unclosed tag

            tag = html[i + 1:j]

            if tag.startswith('/'):
                # Closing tag
                if not stack or stack[-1] != tag[1:]:
                    return False
                stack.pop()
            else:
                # Opening tag — ignore attributes
                tag_name = tag.split()[0]
                stack.append(tag_name)

            i = j  # Move to the end of this tag
        i += 1

    return len(stack) == 0

# Time: O(n) where n = len(html)
# Space: O(d) where d = maximum nesting depth
```

---

## Question 2: HTML Validator with Self-Closing, Comments, and CDATA  *(NEW — HARD STRETCH)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 25–30 minutes |
| **Difficulty** | Hard |
| **Topic Tags** | String, Stack, Parsing, State Machine |
| **Source Pattern** | Hardened variant of Q1 |

### Problem Statement

Extend `validate_html_tags` into `validate_html_advanced(html)` that supports realistic HTML/XML constructs:

- **Self-closing tags**: `<br/>`, `<img src="x"/>` — must not be pushed/popped from the stack.
- **Void elements**: `br`, `img`, `hr`, `meta`, `link`, `input` — may appear as `<br>` (without `/`) and should NOT require a matching `</br>`.
- **HTML comments**: `<!-- anything (including >) -->`. Comments must be properly closed by `-->`. Content inside is opaque.
- **CDATA sections**: `<![CDATA[ ...anything... ]]>`. Must be closed by `]]>`. Content inside is opaque (`<`/`>` do not start tags).
- **Tag names** are case-insensitive (`<DIV>` matches `</div>`).
- **Attributes** may contain `>` inside double-quoted values (e.g., `<a title="x>y">`), which must NOT terminate the tag.

Return `True` iff every container tag is properly nested and every special construct is properly closed.

### Examples

```
Input:  '<div><br/><p>x<!--<bad>--></p></div>'
Output: True

Input:  '<DIV><br></div>'
Output: True   # br is a void element; DIV/div is case-insensitive

Input:  '<a title="x>y"><b></b></a>'
Output: True   # the > inside the quoted attribute is not a tag terminator

Input:  '<p><![CDATA[</p>]]></p>'
Output: True   # </p> inside CDATA does not pop the stack

Input:  '<p><!-- unclosed'
Output: False

Input:  '<div><p></div></p>'
Output: False
```

### Constraints

- `1 <= len(html) <= 10^5`

### Hint

> Treat the parser as a state machine with three opaque modes (TAG, COMMENT, CDATA, plus IN_ATTR_QUOTE); only when you are in normal scanning mode should `<` and `>` carry their structural meaning, and only push container tags onto the stack (skip void elements and self-closing tags).

### Solution

```python
VOID_ELEMENTS = {"br", "img", "hr", "meta", "link", "input",
                 "area", "base", "col", "embed", "param", "source",
                 "track", "wbr"}

def validate_html_advanced(html: str) -> bool:
    stack = []
    i, n = 0, len(html)

    while i < n:
        # --- Comment ---
        if html.startswith("<!--", i):
            end = html.find("-->", i + 4)
            if end == -1:
                return False
            i = end + 3
            continue

        # --- CDATA ---
        if html.startswith("<![CDATA[", i):
            end = html.find("]]>", i + 9)
            if end == -1:
                return False
            i = end + 3
            continue

        # --- Tag ---
        if html[i] == '<':
            # Walk to the matching '>' while respecting quoted attributes.
            j = i + 1
            in_quote = None  # ' or " or None
            while j < n:
                c = html[j]
                if in_quote:
                    if c == in_quote:
                        in_quote = None
                elif c in ('"', "'"):
                    in_quote = c
                elif c == '>':
                    break
                j += 1
            if j >= n:
                return False  # no closing '>'

            body = html[i + 1:j].strip()
            if not body:
                return False

            self_closing = body.endswith('/')
            if self_closing:
                body = body[:-1].strip()

            if body.startswith('/'):
                # Closing tag
                name = body[1:].split()[0].lower() if body[1:].split() else ''
                if not name:
                    return False
                if name in VOID_ELEMENTS:
                    # </br> is tolerated but does nothing
                    pass
                else:
                    if not stack or stack[-1] != name:
                        return False
                    stack.pop()
            else:
                name = body.split()[0].lower()
                if self_closing or name in VOID_ELEMENTS:
                    pass  # do not push
                else:
                    stack.append(name)

            i = j + 1
            continue

        # Stray text outside tags is allowed by HTML; skip it.
        i += 1

    return not stack

# Time: O(n) — every character is visited a constant number of times.
# Space: O(d) — depth of nested container tags.
# Watch-outs:
#   * Quoted attribute values can legally contain '>'.
#   * Comments and CDATA are OPAQUE: never re-scan their interior.
#   * Self-closing AND void elements must never be pushed.
```

---

## Question 3: Run-Length Encoding

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 10–12 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | String, Loop Control, Edge Cases |
| **Source Pattern** | Reported Odoo Coderbyte question |

### Problem Statement

Write a function `run_length_encode(s)` that performs basic string compression using the counts of repeated characters. The function should return the compressed string only if it is strictly shorter than the original string; otherwise, return the original string.

For example, the string `"aabcccccaaa"` would become `"a2b1c5a3"`. Since the compressed string is not shorter, return the original.

### Examples

```
Input:  "aabcccccaaa"
Output: "aabcccccaaa"  (compressed "a2b1c5a3" is same length)

Input:  "aaabbc"
Output: "a3b2c1"

Input:  "abc"
Output: "abc"  (compressed "a1b1c1" is longer)

Input:  "aaaaaa"
Output: "a6"

Input:  ""
Output: ""
```

### Constraints

- `0 <= len(s) <= 10^5`
- `s` contains only uppercase and lowercase English letters.

### Hint

> Scan left-to-right counting consecutive identical characters; append char+count whenever the character changes, and do not forget to append the final run after the loop ends.

### Solution

```python
def run_length_encode(s: str) -> str:
    if not s:
        return ""

    compressed = []
    count = 1

    for i in range(1, len(s)):
        if s[i] == s[i - 1]:
            count += 1
        else:
            compressed.append(s[i - 1] + str(count))
            count = 1

    # CRITICAL: append the final run
    compressed.append(s[-1] + str(count))

    result = "".join(compressed)
    return result if len(result) < len(s) else s

# Time: O(n)
# Space: O(n) for the compressed string
# Common bug: forgetting to append the final run after the loop.
```

---

## Question 4: Valid Palindrome (Alphanumeric)

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 8–10 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | String, Two Pointers |
| **Source Pattern** | Common Coderbyte-style question |

### Problem Statement

Write a function `is_palindrome(s)` that determines if a given string is a palindrome, considering only alphanumeric characters and ignoring cases.

A palindrome reads the same forward and backward.

### Examples

```
Input:  "A man, a plan, a canal: Panama"
Output: True

Input:  "race a car"
Output: False

Input:  " "
Output: True

Input:  "0P"
Output: False
```

### Constraints

- `1 <= len(s) <= 2 * 10^5`
- `s` consists only of printable ASCII characters.

### Hint

> Place two pointers at opposite ends and move them toward the center, skipping non-alphanumeric characters and comparing lowercase versions.

### Solution

```python
def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1

    while left < right:
        # Skip non-alphanumeric from left
        while left < right and not s[left].isalnum():
            left += 1
        # Skip non-alphanumeric from right
        while left < right and not s[right].isalnum():
            right -= 1

        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True

# Time: O(n)
# Space: O(1)
# Each character is visited at most once.
```

---

## Question 5: Shortest Path in Unweighted Graph

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 15–18 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Graph, BFS, Queue |
| **Source Pattern** | Reported Odoo Coderbyte question |

### Problem Statement

You are given an undirected graph with `n` nodes labeled `0` to `n-1`, and a list of undirected `edges` where each `edges[i] = [u, v]` indicates an edge between nodes `u` and `v`.

Write a function `shortest_path(n, edges, start, end)` that returns the length of the shortest path from `start` to `end`. If no path exists, return `-1`.

The length of a path is the number of edges in the path.

### Examples

```
Input:  n = 4, edges = [[0,1],[1,2],[0,2],[2,3]], start = 0, end = 3
Output: 2
Explanation: Path 0 -> 2 -> 3 has length 2.

Input:  n = 3, edges = [[0,1],[1,2]], start = 0, end = 2
Output: 2

Input:  n = 3, edges = [[0,1]], start = 0, end = 2
Output: -1

Input:  n = 1, edges = [], start = 0, end = 0
Output: 0
```

### Constraints

- `1 <= n <= 10^5`
- `0 <= len(edges) <= 2 * 10^5`
- `0 <= u, v < n`
- `0 <= start, end < n`

### Hint

> Build an adjacency list and use BFS (queue) — BFS explores nodes layer by layer, so the first time you reach the target you have found the shortest path in an unweighted graph.

### Solution

```python
from collections import deque

def shortest_path(n: int, edges: list[list[int]], start: int, end: int) -> int:
    if start == end:
        return 0

    # Build adjacency list
    graph = {i: [] for i in range(n)}
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = set([start])
    queue = deque([(start, 0)])  # (current_node, distance_from_start)

    while queue:
        node, dist = queue.popleft()

        for neighbor in graph[node]:
            if neighbor == end:
                return dist + 1
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))

    return -1

# Time: O(V + E) where V = n, E = len(edges)
# Space: O(V) for visited set and queue
# BFS is optimal for unweighted shortest path.
```

---

## Question 6: Word Ladder  *(NEW — HARD STRETCH)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 25–30 minutes |
| **Difficulty** | Hard |
| **Topic Tags** | BFS, Graph, Hash Map, Implicit Graph |
| **Source Pattern** | Hardened variant of Q5 — BFS on an implicit graph |

### Problem Statement

Given two words `begin_word` and `end_word`, and a dictionary `word_list`, return the number of words in the shortest transformation sequence from `begin_word` to `end_word`, such that:

1. Only one letter can be changed at a time.
2. Each transformed word must exist in `word_list`.

Return `0` if no such sequence exists. The sequence length includes both `begin_word` and `end_word`.

### Examples

```
Input:  begin_word = "hit", end_word = "cog",
        word_list = ["hot","dot","dog","lot","log","cog"]
Output: 5
Explanation: hit -> hot -> dot -> dog -> cog  (5 words)

Input:  begin_word = "hit", end_word = "cog",
        word_list = ["hot","dot","dog","lot","log"]
Output: 0   (cog not in dictionary)

Input:  begin_word = "a", end_word = "c", word_list = ["a","b","c"]
Output: 2
```

### Constraints

- `1 <= len(begin_word) <= 10`
- `end_word.length == begin_word.length`
- `1 <= len(word_list) <= 5000`
- All words are lowercase English letters and unique.

### Hint

> Build an implicit graph by mapping each "wildcard pattern" (e.g., `h*t`) to all dictionary words matching it, then run BFS from `begin_word` — neighbors of a word are all words sharing a wildcard pattern.

### Solution

```python
from collections import deque, defaultdict

def word_ladder(begin_word: str, end_word: str, word_list: list[str]) -> int:
    word_set = set(word_list)
    if end_word not in word_set:
        return 0

    L = len(begin_word)
    # pattern -> list of dictionary words matching that pattern
    patterns = defaultdict(list)
    for w in word_set:
        for i in range(L):
            patterns[w[:i] + '*' + w[i+1:]].append(w)

    queue = deque([(begin_word, 1)])
    visited = {begin_word}

    while queue:
        word, depth = queue.popleft()
        for i in range(L):
            key = word[:i] + '*' + word[i+1:]
            for nxt in patterns[key]:
                if nxt == end_word:
                    return depth + 1
                if nxt not in visited:
                    visited.add(nxt)
                    queue.append((nxt, depth + 1))
            # Optimisation: clear the bucket so future BFS layers
            # do not re-scan the same neighbours.
            patterns[key] = []

    return 0

# Time: O(N * L^2) where N = |word_list|, L = word length.
#       L patterns per word, each comparison/string slice is O(L).
# Space: O(N * L^2) for the pattern index.
# Why BFS: unweighted shortest path on the implicit "1-letter-diff" graph.
# Bidirectional BFS halves practical runtime — try it as a follow-up.
```

---

## Question 7: Database Schema Design — Course Platform

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 15–20 minutes |
| **Difficulty** | Easy–Medium |
| **Topic Tags** | SQL, Schema Design, Relationships |
| **Source Pattern** | Reported Odoo Coderbyte question |

### Problem Statement

Design a database schema for an online course platform. The platform has:
- **Students** who can enroll in multiple courses.
- **Courses** that are taught by one instructor and can have multiple students enrolled.
- **Instructors** who can teach multiple courses.
- **Enrollments** that track when a student enrolled in a course and their final grade (if completed).

After designing the schema, write a SQL query to find the top 3 students (by average grade) across all courses they have completed. Only include students who have completed at least 2 courses.

### Requirements

1. Write `CREATE TABLE` statements for all tables.
2. Include appropriate primary keys, foreign keys, and constraints.
3. Write the query to find top 3 students by average grade.

### Hint

> Identify the many-to-many relationship between Students and Courses (use a junction table), then use GROUP BY with HAVING for the aggregation and ORDER BY with LIMIT for the top 3.

### Solution

```sql
-- Students table
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Instructors table
CREATE TABLE instructors (
    instructor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Courses table
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    instructor_id INT NOT NULL,
    credits INT CHECK (credits > 0),
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id)
);

-- Junction table for many-to-many: Students <-> Courses
CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade DECIMAL(4, 2),  -- NULL if not completed
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE(student_id, course_id)
);

-- Query: Top 3 students by average grade (completed courses only)
SELECT 
    s.student_id,
    s.name,
    AVG(e.grade) AS avg_grade,
    COUNT(*) AS completed_courses
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
WHERE e.grade IS NOT NULL
GROUP BY s.student_id, s.name
HAVING COUNT(*) >= 2
ORDER BY avg_grade DESC
LIMIT 3;
```

---

## Question 8: SQL — Trips and Users (Cancellation Rate)  *(NEW — HARD STRETCH)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 20–25 minutes |
| **Difficulty** | Hard |
| **Topic Tags** | SQL, Conditional Aggregation, JOIN, Date Filtering |
| **Source Pattern** | Hardened SQL variant — multi-table filter + aggregation |

### Problem Statement

You are given two tables:

```
Trips:
+----+-----------+-------------+--------+----------------------+------------+
| id | client_id | driver_id   | city_id| status               | request_at |
+----+-----------+-------------+--------+----------------------+------------+
| 1  | 1         | 10          | 1      | completed            | 2013-10-01 |
| 2  | 2         | 11          | 1      | cancelled_by_driver  | 2013-10-01 |
| 3  | 3         | 12          | 6      | completed            | 2013-10-01 |
| 4  | 4         | 13          | 6      | cancelled_by_client  | 2013-10-01 |
| 5  | 1         | 10          | 1      | completed            | 2013-10-02 |
| 6  | 2         | 11          | 6      | completed            | 2013-10-02 |
| 7  | 3         | 12          | 6      | completed            | 2013-10-02 |
| 8  | 2         | 12          | 12     | completed            | 2013-10-03 |
| 9  | 3         | 10          | 12     | completed            | 2013-10-03 |
| 10 | 4         | 13          | 12     | cancelled_by_driver  | 2013-10-03 |
+----+-----------+-------------+--------+----------------------+------------+

Users:
+----------+--------+--------+
| users_id | banned | role   |
+----------+--------+--------+
| 1        | No     | client |
| 2        | Yes    | client |
| 3        | No     | client |
| 4        | No     | client |
| 10       | No     | driver |
| 11       | No     | driver |
| 12       | No     | driver |
| 13       | No     | driver |
+----------+--------+--------+
```

Write a SQL query to compute, for each day between `2013-10-01` and `2013-10-03` inclusive, the **cancellation rate** of requests made by **unbanned** users (both the client AND the driver must be unbanned). Round to 2 decimals.

A trip is "cancelled" if status is `cancelled_by_driver` or `cancelled_by_client`.

### Expected Output

```
+------------+-------------------+
| Day        | Cancellation Rate |
+------------+-------------------+
| 2013-10-01 | 0.33              |
| 2013-10-02 | 0.00              |
| 2013-10-03 | 0.50              |
+------------+-------------------+
```

### Hint

> JOIN the trips against Users TWICE (once for client, once for driver), filter to non-banned on both sides, then use `AVG(CASE WHEN status LIKE 'cancelled%%' THEN 1 ELSE 0 END)` grouped by day to get the rate without a separate count/divide.

### Solution

```sql
SELECT
    t.request_at AS Day,
    ROUND(
        AVG(CASE WHEN t.status LIKE 'cancelled%' THEN 1.0 ELSE 0 END),
        2
    ) AS `Cancellation Rate`
FROM Trips t
JOIN Users uc ON t.client_id = uc.users_id AND uc.banned = 'No'
JOIN Users ud ON t.driver_id = ud.users_id AND ud.banned = 'No'
WHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03'
GROUP BY t.request_at
ORDER BY t.request_at;

-- Why AVG(CASE ...) ?
--   SUM(cancelled)/COUNT(*) works too, but AVG with a 1/0 indicator
--   collapses the divide and avoids zero-row division surprises.
-- Two joins to Users is the canonical way to filter both ends.
```

---

## Question 9: Balanced Parentheses with Multiple Types

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 8–10 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | Stack, String |
| **Source Pattern** | Common Coderbyte-style question |

### Problem Statement

Write a function `is_valid(s)` that determines if a string containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'` is valid.

A string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order (most recent open first).

### Examples

```
Input:  "()"
Output: True

Input:  "()[]{}"
Output: True

Input:  "(]"
Output: False

Input:  "([)]"
Output: False

Input:  "{[]}"
Output: True

Input:  ""
Output: True
```

### Constraints

- `0 <= len(s) <= 10^4`

### Hint

> Use a stack and a dictionary mapping each closing bracket to its corresponding opening bracket; push opening brackets and pop+verify on closing brackets.

### Solution

```python
def is_valid(s: str) -> bool:
    pair = {')': '(', ']': '[', '}': '{'}
    stack = []

    for ch in s:
        if ch in '([{':
            stack.append(ch)
        else:
            if not stack or stack[-1] != pair[ch]:
                return False
            stack.pop()

    return len(stack) == 0

# Time: O(n)
# Space: O(n) in worst case (all opening brackets)
```

---

## Question 10: First Non-Repeating Character

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 8–10 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | String, Hash Table, Counting |
| **Source Pattern** | Common Coderbyte-style question |

### Problem Statement

Write a function `first_uniq_char(s)` that finds the first non-repeating character in a string and returns its index. If it does not exist, return `-1`.

### Examples

```
Input:  "leetcode"
Output: 0

Input:  "loveleetcode"
Output: 2

Input:  "aabb"
Output: -1

Input:  ""
Output: -1
```

### Constraints

- `1 <= len(s) <= 10^5`
- `s` consists of only lowercase English letters.

### Hint

> Count character frequencies in one pass, then scan again to find the first character with count 1.

### Solution

```python
from collections import Counter

def first_uniq_char(s: str) -> int:
    count = Counter(s)
    for i, ch in enumerate(s):
        if count[ch] == 1:
            return i
    return -1

# Time: O(n)
# Space: O(1) — at most 26 characters
```

---

## Question 11: SQL — Find Duplicate Emails

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 5–8 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | SQL, Aggregation, GROUP BY |
| **Source Pattern** | Common SQL assessment question |

### Problem Statement

Write a SQL query to find all duplicate email addresses in a table named `Person`.

The `Person` table has the following structure:

```
+----+---------+
| id | email   |
+----+---------+
| 1  | a@b.com |
| 2  | c@d.com |
| 3  | a@b.com |
+----+---------+
```

### Expected Output

```
+---------+
| email   |
+---------+
| a@b.com |
+---------+
```

### Hint

> Group by email and use HAVING COUNT(*) > 1 to filter groups with more than one row.

### Solution

```sql
SELECT email
FROM Person
GROUP BY email
HAVING COUNT(*) > 1;
```

---

## Question 12: Move Zeroes

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 10–12 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | Array, Two Pointers, In-Place |
| **Source Pattern** | Common Coderbyte-style question |

### Problem Statement

Write a function `move_zeroes(nums)` that moves all `0`s to the end of the array while maintaining the relative order of the non-zero elements. You must do this **in-place** without making a copy of the array.

### Examples

```
Input:  [0,1,0,3,12]
Output: [1,3,12,0,0]

Input:  [0,0,1]
Output: [1,0,0]

Input:  [1,2,3]
Output: [1,2,3]

Input:  [0]
Output: [0]
```

### Constraints

- `1 <= len(nums) <= 10^4`
- `nums[i]` is `0` or a positive integer.

### Hint

> Use two pointers: a "read" pointer scans the array, and a "write" pointer tracks where the next non-zero element should go; fill the rest with zeros.

### Solution

```python
def move_zeroes(nums: list[int]) -> None:
    write = 0

    # Move all non-zero elements to the front
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1

    # Fill remaining positions with zeros
    for i in range(write, len(nums)):
        nums[i] = 0

# Time: O(n)
# Space: O(1) — modifies array in-place
# Alternative single-pass swap version also works.
```

---

## Question 13: Evaluate Reverse Polish Notation

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 12–15 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Stack, Math, String Parsing |
| **Source Pattern** | Reported Odoo Coderbyte question |

### Problem Statement

Write a function `eval_rpn(tokens)` that evaluates the value of an arithmetic expression in Reverse Polish Notation (postfix).

Valid operators are `+`, `-`, `*`, and `/`. Each operand may be an integer or another expression. Division between two integers should truncate toward zero.

### Examples

```
Input:  ["2","1","+","3","*"]
Output: 9
Explanation: ((2 + 1) * 3) = 9

Input:  ["4","13","5","/","+"]
Output: 6
Explanation: (4 + (13 / 5)) = 6

Input:  ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
Output: 22
```

### Constraints

- `1 <= len(tokens) <= 10^4`
- Each token is either an integer or one of `+`, `-`, `*`, `/`.
- All intermediate results fit in a 32-bit integer.

### Hint

> Use a stack: push numbers when you see them; when you see an operator, pop the top two numbers, apply the operator, and push the result — use `int(a / b)` not `a // b` for correct truncation toward zero.

### Solution

```python
def eval_rpn(tokens: list[str]) -> int:
    stack = []
    ops = {'+', '-', '*', '/'}

    for token in tokens:
        if token not in ops:
            stack.append(int(token))
        else:
            b = stack.pop()  # second operand
            a = stack.pop()  # first operand
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            else:
                # CRITICAL: int(a / b) truncates toward zero
                # a // b truncates toward negative infinity (WRONG)
                stack.append(int(a / b))

    return stack[0]

# Time: O(n)
# Space: O(n)
# Division trap: Python's // does floor division.
# For RPN, use int(a / b) to match C/Java behavior.
```

---

## Question 14: Basic Calculator II (Infix with Precedence)  *(NEW — HARD STRETCH)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 20–25 minutes |
| **Difficulty** | Hard |
| **Topic Tags** | Stack, String Parsing, Operator Precedence |
| **Source Pattern** | Hardened variant of Q13 — infix, not RPN |

### Problem Statement

Write a function `calculate(s)` that evaluates a string expression containing non-negative integers and the operators `+`, `-`, `*`, `/`, plus arbitrary whitespace. Standard arithmetic precedence applies: `*` and `/` bind tighter than `+` and `-`. Integer division truncates toward zero.

You **may not** use `eval()`.

### Examples

```
Input:  "3+2*2"
Output: 7

Input:  " 3/2 "
Output: 1

Input:  " 3+5 / 2 "
Output: 5

Input:  "14-3/2"
Output: 13

Input:  "1*2-3/4+5*6-7*8+9/10"
Output: -24
```

### Constraints

- `1 <= len(s) <= 3 * 10^5`
- `s` is a valid expression.
- All intermediate computations fit in a 32-bit signed integer.

### Hint

> Walk the string left-to-right tracking the *previous operator*. Numbers preceded by `+`/`-` are pushed (with sign); numbers preceded by `*`/`/` immediately pop the stack-top, combine, and push the result. The answer is the sum of the stack.

### Solution

```python
def calculate(s: str) -> int:
    stack = []
    num = 0
    op = '+'  # the operator BEFORE the current number
    n = len(s)

    for i, ch in enumerate(s):
        if ch.isdigit():
            num = num * 10 + int(ch)

        # Flush when we hit an operator OR end of string. Skip spaces.
        if (ch in '+-*/') or i == n - 1:
            if op == '+':
                stack.append(num)
            elif op == '-':
                stack.append(-num)
            elif op == '*':
                stack.append(stack.pop() * num)
            else:  # '/'
                prev = stack.pop()
                # int(prev/num) truncates toward zero (matches the spec).
                stack.append(int(prev / num))
            op = ch
            num = 0

    return sum(stack)

# Time: O(n) — single pass.
# Space: O(n) — stack holds at most one signed number per +/- term.
# Why this works:
#   '+' / '-' defer evaluation by deferring the term into the stack.
#   '*' / '/' have higher precedence, so we resolve them eagerly
#   against the term already on top of the stack.
# Trap: Python's // floors for negatives; use int(a/b) for trunc-to-zero.
```

---

## Question 15: SQL — Department Top 3 Salaries

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 15–18 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | SQL, Window Functions, Ranking |
| **Source Pattern** | Common SQL assessment question |

### Problem Statement

The `Employee` table has columns: `id`, `name`, `salary`, `departmentId`.
The `Department` table has columns: `id`, `name`.

Write a SQL query to find employees who earn the top three unique salaries in each department. Return the result in any order.

### Example

```
Employee:
+----+-------+--------+--------------+
| id | name  | salary | departmentId |
+----+-------+--------+--------------+
| 1  | Joe   | 85000  | 1            |
| 2  | Henry | 80000  | 2            |
| 3  | Sam   | 60000  | 2            |
| 4  | Max   | 90000  | 1            |
| 5  | Janet | 69000  | 1            |
| 6  | Randy | 85000  | 1            |
| 7  | Will  | 70000  | 1            |
+----+-------+--------+--------------+

Department:
+----+-------+
| id | name  |
+----+-------+
| 1  | IT    |
| 2  | Sales |
+----+-------+

Output:
+------------+----------+--------+
| Department | Employee | Salary |
+------------+----------+--------+
| IT         | Max      | 90000  |
| IT         | Joe      | 85000  |
| IT         | Randy    | 85000  |
| IT         | Will     | 70000  |
| Sales      | Henry    | 80000  |
| Sales      | Sam      | 60000  |
+------------+----------+--------+
```

### Hint

> Use DENSE_RANK() with PARTITION BY departmentId and ORDER BY salary DESC, then filter where rank <= 3.

### Solution

```sql
SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM (
    SELECT *,
        DENSE_RANK() OVER (
            PARTITION BY departmentId 
            ORDER BY salary DESC
        ) AS rnk
    FROM Employee
) e
JOIN Department d ON e.departmentId = d.id
WHERE e.rnk <= 3;
```

---

## Question 16: SQL — Median Employee Salary per Company  *(NEW — HARD STRETCH)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 20–25 minutes |
| **Difficulty** | Hard |
| **Topic Tags** | SQL, Window Functions, ROW_NUMBER, Median |
| **Source Pattern** | Hardened SQL variant of Q15 — median, not top-K |

### Problem Statement

Given an `Employee` table `(id, company, salary)`, write a query that returns the **median** salary employee(s) of each company. If the company has an odd number of employees, return the single middle row. If it has an even number, return both middle rows.

Tie-break rows with the same salary by `id` ascending (any deterministic order is fine — the grader checks set membership of the right rows).

### Example

```
Employee:
+----+---------+--------+
| id | company | salary |
+----+---------+--------+
| 1  | A       | 2341   |
| 2  | A       | 341    |
| 3  | A       | 15     |
| 4  | A       | 15314  |
| 5  | A       | 451    |
| 6  | A       | 513    |
| 7  | B       | 15     |
| 8  | B       | 13     |
| 9  | B       | 1154   |
| 10 | B       | 1345   |
| 11 | B       | 1221   |
| 12 | B       | 234    |
| 13 | C       | 2345   |
| 14 | C       | 2645   |
| 15 | C       | 2645   |
| 16 | C       | 2652   |
| 17 | C       | 65     |
+----+---------+--------+

Output (median rows):
+----+---------+--------+
| id | company | salary |
+----+---------+--------+
| 5  | A       | 451    |
| 6  | A       | 513    |
| 12 | B       | 234    |
| 9  | B       | 1154   |
| 14 | C       | 2645   |
+----+---------+--------+
```

### Hint

> Within each company, assign `ROW_NUMBER()` over `(PARTITION BY company ORDER BY salary)` and also compute `COUNT(*) OVER (PARTITION BY company)`; the median rows are those whose row number is one of `{ceil(n/2), floor(n/2)+1}` — these two values collapse to one row when n is odd and to two adjacent rows when n is even.

### Solution

```sql
WITH ranked AS (
    SELECT
        id,
        company,
        salary,
        ROW_NUMBER() OVER (PARTITION BY company ORDER BY salary, id) AS rn,
        COUNT(*)   OVER (PARTITION BY company)                       AS cnt
    FROM Employee
)
SELECT id, company, salary
FROM ranked
WHERE rn IN (FLOOR((cnt + 1) / 2), FLOOR(cnt / 2) + 1)
ORDER BY company, rn;

-- The trick:
--   odd n  -> FLOOR((n+1)/2) == FLOOR(n/2)+1  -> same row, returned once.
--   even n -> the two values differ by 1 -> both middle rows returned.
-- Without window functions you would self-join + correlated subqueries,
-- which is far slower at scale. Always reach for windows first.
```

---

## Question 17: Daily Temperatures

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 15–18 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Stack, Monotonic Stack, Array |
| **Source Pattern** | Common Coderbyte-style question |

### Problem Statement

Write a function `daily_temperatures(temps)` that, given an array of daily temperatures, returns an array where each element is the number of days you would have to wait until a warmer temperature. If there is no future day for which this is possible, put `0` instead.

### Examples

```
Input:  [73,74,75,71,69,72,76,73]
Output: [1, 1, 4, 2, 1, 1, 0, 0]

Input:  [30,40,50,60]
Output: [1, 1, 1, 0]

Input:  [30,60,90]
Output: [1, 1, 0]
```

### Constraints

- `1 <= len(temps) <= 10^5`
- `30 <= temps[i] <= 100`

### Hint

> Use a monotonic decreasing stack storing indices; for each day, while the current temperature is warmer than the temperature at the index on top of the stack, pop and calculate the difference.

### Solution

```python
def daily_temperatures(temps: list[int]) -> list[int]:
    n = len(temps)
    result = [0] * n
    stack = []  # stores indices of decreasing temperatures

    for i in range(n):
        while stack and temps[i] > temps[stack[-1]]:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx
        stack.append(i)

    return result

# Time: O(n) — each index is pushed and popped at most once
# Space: O(n) — worst case: strictly decreasing temperatures
```

---

## Question 18: Simplify Path (Unix-style)

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 12–15 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | String, Stack, Parsing |
| **Source Pattern** | Common Coderbyte-style question |

### Problem Statement

Write a function `simplify_path(path)` that takes an absolute Unix-style file path and simplifies it.

Rules:
- `".."` means go to the parent directory.
- `"."` means stay in the current directory.
- Multiple consecutive slashes `"//"` should be treated as a single slash `"/"`.
- The path always starts with `"/"`.

### Examples

```
Input:  "/home/"
Output: "/home"

Input:  "/../"
Output: "/"

Input:  "/home//foo/./bar/../baz"
Output: "/home/foo/baz"

Input:  "/a/./b/../../c/"
Output: "/c"
```

### Constraints

- `1 <= len(path) <= 3000`
- `path` consists of English letters, digits, period `'.'`, slash `'/'` or `'_'`.

### Hint

> Split the path by "/", use a stack to track valid directory names, pop on "..", ignore "." and empty strings, then join with "/".

### Solution

```python
def simplify_path(path: str) -> str:
    stack = []
    parts = path.split('/')

    for part in parts:
        if part == '' or part == '.':
            continue
        elif part == '..':
            if stack:
                stack.pop()
        else:
            stack.append(part)

    return '/' + '/'.join(stack)

# Time: O(n)
# Space: O(n)
```

---

## Question 19: Shortest Path in Binary Matrix

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 18–22 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Graph, BFS, Matrix |
| **Source Pattern** | Common Coderbyte-style question |

### Problem Statement

Given an `n x n` binary matrix `grid`, find the length of the shortest clear path from the top-left cell `(0,0)` to the bottom-right cell `(n-1,n-1)`. A clear path consists of cells with value `0`, and you can move in **8 directions** (horizontally, vertically, or diagonally). If no clear path exists, return `-1`.

### Examples

```
Input:  [[0,1],[1,0]]
Output: 2

Input:  [[0,0,0],[1,1,0],[1,1,0]]
Output: 4

Input:  [[1,0,0],[1,1,0],[1,1,0]]
Output: -1
```

### Constraints

- `n == len(grid)`
- `1 <= n <= 100`
- `grid[i][j]` is `0` or `1`

### Hint

> Treat each cell as a node and adjacent cells as edges; use BFS from the top-left, marking cells as visited immediately by setting them to 1, and explore all 8 directions.

### Solution

```python
from collections import deque

def shortest_path_binary_matrix(grid: list[list[int]]) -> int:
    n = len(grid)
    if grid[0][0] == 1 or grid[n-1][n-1] == 1:
        return -1

    directions = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
    queue = deque([(0, 0, 1)])  # (row, col, distance)
    grid[0][0] = 1  # mark visited by blocking

    while queue:
        r, c, dist = queue.popleft()
        if r == n - 1 and c == n - 1:
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                grid[nr][nc] = 1  # mark visited immediately
                queue.append((nr, nc, dist + 1))

    return -1

# Time: O(n^2)
# Space: O(n^2)
# Mark visited immediately to avoid re-enqueueing.
```

---

## Question 20: Word Search II (Trie + DFS)  *(NEW — HARD STRETCH)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 30–35 minutes |
| **Difficulty** | Hard |
| **Topic Tags** | Trie, DFS, Backtracking, Matrix |
| **Source Pattern** | Hardened variant of Q19 — matrix search + dictionary |

### Problem Statement

Given an `m x n` board of characters and a list of words, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells (horizontal or vertical neighbors). The same cell may not be used more than once in a single word.

### Examples

```
Input:  board = [["o","a","a","n"],
                 ["e","t","a","e"],
                 ["i","h","k","r"],
                 ["i","f","l","v"]]
        words = ["oath","pea","eat","rain"]
Output: ["oath","eat"]

Input:  board = [["a","b"],["c","d"]]
        words = ["abcb"]
Output: []
```

### Constraints

- `1 <= m, n <= 12`
- `1 <= len(words) <= 3 * 10^4`
- `1 <= len(words[i]) <= 10`
- All words are lowercase English letters and unique.

### Hint

> Build a trie from the dictionary, then DFS from every cell carrying a trie pointer — the trie lets one traversal probe ALL words simultaneously, and you can prune entire dictionary branches by checking `child in node.children`.

### Solution

```python
def find_words(board: list[list[str]], words: list[str]) -> list[str]:
    # --- Build trie ---
    TRIE = {}
    END = '$'
    for w in words:
        node = TRIE
        for c in w:
            node = node.setdefault(c, {})
        node[END] = w  # store the whole word at the terminal

    rows, cols = len(board), len(board[0])
    found = []

    def dfs(r, c, node):
        ch = board[r][c]
        if ch not in node:
            return
        nxt = node[ch]
        if END in nxt:
            found.append(nxt.pop(END))  # pop to dedupe + prune

        board[r][c] = '#'  # mark visited in-place
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                dfs(nr, nc, nxt)
        board[r][c] = ch  # restore (backtrack)

        # Trie pruning: if this branch has no children left, delete it.
        if not nxt:
            node.pop(ch, None)

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, TRIE)

    return found

# Time: O(M * N * 4^L) worst case, where L = max word length;
#       trie pruning makes the practical case vastly cheaper.
# Space: O(total length of all words) for the trie, plus O(L) recursion.
# Why a trie and not "search each word individually"?
#   Searching k words separately is O(k * M * N * 4^L).
#   The trie lets one DFS amortise across ALL words.
```

---

## Question 21: Two Sum

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 8–10 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | Array, Hash Table |
| **Source Pattern** | Classic assessment question |

### Problem Statement

Write a function `two_sum(nums, target)` that returns the indices of the two numbers such that they add up to `target`. You may assume each input has exactly one solution, and you may not use the same element twice. Return the indices in any order.

### Examples

```
Input:  nums = [2,7,11,15], target = 9
Output: [0,1]

Input:  nums = [3,2,4], target = 6
Output: [1,2]

Input:  nums = [3,3], target = 6
Output: [0,1]
```

### Constraints

- `2 <= len(nums) <= 10^4`
- `-10^9 <= nums[i] <= 10^9`
- `-10^9 <= target <= 10^9`
- Only one valid answer exists.

### Hint

> Use a hash map to store each number's index as you iterate; for each number, check if its complement (target - num) already exists in the map.

### Solution

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # should never reach here per constraints

# Time: O(n)
# Space: O(n)
```

---

## Question 22: Reverse Integer

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 10–12 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | Math, Integer Manipulation |
| **Source Pattern** | Common Coderbyte-style question |

### Problem Statement

Write a function `reverse(x)` that reverses the digits of a 32-bit signed integer. If reversing `x` causes the value to go outside the signed 32-bit integer range `[-2^31, 2^31 - 1]`, return `0`.

### Examples

```
Input:  123
Output: 321

Input:  -123
Output: -321

Input:  120
Output: 21

Input:  1534236469
Output: 0  (reversed exceeds 32-bit range)
```

### Constraints

- `-2^31 <= x <= 2^31 - 1`

### Hint

> Pop digits using modulo and division, push them to the result with multiplication by 10, and check for overflow before pushing each digit.

### Solution

```python
import math

def reverse(x: int) -> int:
    INT_MIN, INT_MAX = -2**31, 2**31 - 1
    result = 0

    while x != 0:
        # math.fmod preserves sign (matches C/Java behavior)
        digit = int(math.fmod(x, 10))
        x = int(x / 10)

        # Overflow check before pushing
        if (result > INT_MAX // 10 or 
            (result == INT_MAX // 10 and digit > 7)):
            return 0
        if (result < INT_MIN // 10 or 
            (result == INT_MIN // 10 and digit < -8)):
            return 0

        result = result * 10 + digit

    return result

# Time: O(log |x|) — number of digits
# Space: O(1)
```

---

## Question 23: Rotting Oranges (Multi-Source BFS)

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 18–22 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Graph, BFS, Matrix |
| **Source Pattern** | Common Coderbyte-style question |

### Problem Statement

You are given an `m x n` grid where each cell can have one of three values:
- `0` representing an empty cell,
- `1` representing a fresh orange,
- `2` representing a rotten orange.

Every minute, any fresh orange that is **4-directionally adjacent** to a rotten orange becomes rotten.

Write a function `oranges_rotting(grid)` that returns the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return `-1`.

### Examples

```
Input:  [[2,1,1],[1,1,0],[0,1,1]]
Output: 4

Input:  [[2,1,1],[0,1,1],[1,0,2]]
Output: -1

Input:  [[0,2]]
Output: 0
```

### Constraints

- `m == len(grid)`, `n == len(grid[0])`
- `1 <= m, n <= 10`
- `grid[i][j]` is `0`, `1`, or `2`

### Hint

> Use multi-source BFS: enqueue all initially rotten oranges as starting points, then process layer by layer counting minutes, and check if any fresh oranges remain at the end.

### Solution

```python
from collections import deque

def oranges_rotting(grid: list[list[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0

    # Initialize all rotten oranges as BFS sources
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0))
            elif grid[r][c] == 1:
                fresh += 1

    minutes = 0
    directions = [(0,1), (0,-1), (1,0), (-1,0)]

    while queue:
        r, c, minutes = queue.popleft()
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                queue.append((nr, nc, minutes + 1))

    return minutes if fresh == 0 else -1

# Time: O(m * n)
# Space: O(m * n)
```

---

## Question 24: SQL — Find Customers Who Never Order

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 8–10 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | SQL, LEFT JOIN, NULL Check |
| **Source Pattern** | Common SQL assessment question |

### Problem Statement

Suppose that a website contains two tables, the `Customers` table and the `Orders` table.

Write a SQL query to find all customers who never order anything.

```
Customers:
+----+-------+
| id | name  |
+----+-------+
| 1  | Joe   |
| 2  | Henry |
| 3  | Sam   |
| 4  | Max   |
+----+-------+

Orders:
+----+------------+
| id | customerId |
+----+------------+
| 1  | 3          |
| 2  | 1          |
+----+------------+
```

### Expected Output

```
+-----------+
| Customers |
+-----------+
| Henry     |
| Max       |
+-----------+
```

### Hint

> Use a LEFT JOIN from Customers to Orders and filter where Orders.id IS NULL, or use a NOT IN / NOT EXISTS subquery.

### Solution

```sql
-- Method 1: LEFT JOIN
SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.id IS NULL;

-- Method 2: NOT IN
SELECT name AS Customers
FROM Customers
WHERE id NOT IN (SELECT customerId FROM Orders);

-- Method 3: NOT EXISTS
SELECT name AS Customers
FROM Customers c
WHERE NOT EXISTS (
    SELECT 1 FROM Orders o WHERE o.customerId = c.id
);
```

---

## Question 25: Container With Most Water

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 15–18 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Array, Two Pointers, Greedy |
| **Source Pattern** | Common Coderbyte-style question |

### Problem Statement

You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.

Find two lines that together with the x-axis form a container that contains the most water. Return the maximum amount of water a container can store.

### Examples

```
Input:  [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: Lines at index 1 and 8 form container with area min(8,7) * 7 = 49.

Input:  [1,1]
Output: 1
```

### Constraints

- `n == len(height)`
- `2 <= n <= 10^5`
- `0 <= height[i] <= 10^4`

### Hint

> Use two pointers at opposite ends; the shorter line limits the area, so move that pointer inward — this is the only way to potentially find a larger area.

### Solution

```python
def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0

    while left < right:
        width = right - left
        current = min(height[left], height[right]) * width
        max_water = max(max_water, current)

        # Move the pointer at the shorter line
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_water

# Time: O(n)
# Space: O(1)
# Greedy logic: the shorter line limits the area.
```

---

## Question 26: Trapping Rain Water  *(NEW — HARD STRETCH)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 20–25 minutes |
| **Difficulty** | Hard |
| **Topic Tags** | Two Pointers, DP, Monotonic Stack |
| **Source Pattern** | Hardened variant of Q25 — water bounded by both sides |

### Problem Statement

Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.

### Examples

```
Input:  [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6

Input:  [4,2,0,3,2,5]
Output: 9
```

### Constraints

- `n == len(height)`
- `1 <= n <= 2 * 10^4`
- `0 <= height[i] <= 10^5`

### Hint

> Water above column `i` is `min(maxLeft[i], maxRight[i]) - height[i]`. The two-pointer trick collapses this to O(1) space: track running `left_max`/`right_max`, and at each step advance the pointer whose side has the **smaller** running max — that side's water level is then fully determined by its own running max.

### Solution

```python
def trap(height: list[int]) -> int:
    if not height:
        return 0

    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water = 0

    while left < right:
        if height[left] < height[right]:
            # Left side is the binding constraint right now.
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1

    return water

# Time: O(n) — one pass, two pointers converge.
# Space: O(1).
#
# Intuition: at any moment, if height[left] < height[right], we KNOW the
# right side has a wall at least as tall as height[left]. So whatever
# left_max is, it bounds the water above the left pointer — we never need
# to look at right_max to compute that cell's contribution.
#
# Alternative O(n) / O(n) DP: precompute maxLeft[i], maxRight[i],
# then sum min(maxLeft[i], maxRight[i]) - height[i]. Simpler to reason
# about but uses two extra arrays.
```

---

## Question 27: Happy Number

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 12–15 minutes |
| **Difficulty** | Easy–Medium |
| **Topic Tags** | Math, Hash Set, Floyd's Cycle Detection |
| **Source Pattern** | Common Coderbyte-style question |

### Problem Statement

Write a function `is_happy(n)` that determines if a number `n` is happy.

A <b>happy number</b> is defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits, and repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1. Those numbers for which this process ends in 1 are happy.

### Examples

```
Input:  19
Output: True
Explanation: 1^2 + 9^2 = 82
             8^2 + 2^2 = 68
             6^2 + 8^2 = 100
             1^2 + 0^2 + 0^2 = 1

Input:  2
Output: False
```

### Constraints

- `1 <= n <= 2^31 - 1`

### Hint

> Use Floyd's Cycle Detection (tortoise and hare): one pointer moves one step at a time, another moves two steps — if there's a cycle they will meet; if the fast pointer reaches 1, the number is happy.

### Solution

```python
def is_happy(n: int) -> bool:
    def get_next(num):
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total

    slow = n
    fast = get_next(n)

    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))

    return fast == 1

# Time: O(log n) per step, converges quickly
# Space: O(1)
# Alternative: use a hash set to detect cycles (O(log n) space).
```

---

## Question 28: SQL — Second Highest Salary

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 10–12 minutes |
| **Difficulty** | Easy–Medium |
| **Topic Tags** | SQL, Subquery, LIMIT, NULL Handling |
| **Source Pattern** | Common SQL assessment question |

### Problem Statement

Write a SQL query to get the second highest salary from the `Employee` table. If there is no second highest salary (e.g., only one employee), return `NULL`.

```
Employee:
+----+--------+
| id | salary |
+----+--------+
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |
+----+--------+
```

### Expected Output

```
+---------------------+
| SecondHighestSalary |
+---------------------+
| 200                 |
+---------------------+
```

### Hint

> Use a subquery to find the maximum salary less than the overall maximum, or use LIMIT with OFFSET and wrap in a subquery to handle NULL.

### Solution

```sql
-- Method 1: Subquery
SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);

-- Method 2: LIMIT with OFFSET (MySQL/PostgreSQL)
SELECT (
    SELECT DISTINCT salary
    FROM Employee
    ORDER BY salary DESC
    LIMIT 1 OFFSET 1
) AS SecondHighestSalary;
```

---

## Question 29: Remove Duplicates from Sorted Array

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 10–12 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | Array, Two Pointers, In-Place |
| **Source Pattern** | Common Coderbyte-style question |

### Problem Statement

Given an integer array `nums` sorted in non-decreasing order, remove the duplicates **in-place** such that each unique element appears only once. The relative order of the elements should be kept the same. Return the number of unique elements `k`.

### Examples

```
Input:  nums = [1,1,2]
Output: 2, nums = [1,2,_]

Input:  nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
```

### Constraints

- `1 <= len(nums) <= 3 * 10^4`
- `-100 <= nums[i] <= 100`
- `nums` is sorted in non-decreasing order.

### Hint

> Use a "write" pointer starting at index 1 and a "read" pointer scanning from index 1; whenever nums[read] differs from nums[read-1], copy it to nums[write] and advance write.

### Solution

```python
def remove_duplicates(nums: list[int]) -> int:
    if not nums:
        return 0

    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1

    return write

# Time: O(n)
# Space: O(1)
```

---

## Question 30: Count Primes (Sieve of Eratosthenes)

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 12–15 minutes |
| **Difficulty** | Easy–Medium |
| **Topic Tags** | Math, Number Theory, Array |
| **Source Pattern** | Common Coderbyte-style question |

### Problem Statement

Write a function `count_primes(n)` that returns the number of prime numbers that are strictly less than `n`.

### Examples

```
Input:  10
Output: 4
Explanation: There are 4 prime numbers less than 10: 2, 3, 5, 7.

Input:  0
Output: 0

Input:  1
Output: 0

Input:  2
Output: 0
```

### Constraints

- `0 <= n <= 5 * 10^6`

### Hint

> Use the Sieve of Eratosthenes: create a boolean array, iteratively mark multiples of each prime starting from 2, and start marking from i*i because smaller multiples are already marked.

### Solution

```python
def count_primes(n: int) -> int:
    if n <= 2:
        return 0

    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False

    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            # Start at i*i: smaller multiples already marked
            for j in range(i * i, n, i):
                is_prime[j] = False

    return sum(is_prime)

# Time: O(n log log n)
# Space: O(n)
```

---

## Question 31: Pow(x, n) — Fast Exponentiation  *(NEW — HARD STRETCH)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 15–20 minutes |
| **Difficulty** | Medium–Hard |
| **Topic Tags** | Math, Recursion, Divide and Conquer, Bit Manipulation |
| **Source Pattern** | Hardened math variant of Q30 |

### Problem Statement

Implement `my_pow(x, n)` that calculates `x` raised to the power `n` (i.e., `x^n`).

You **must not** use the built-in `**` operator or `math.pow`. The naive O(n) loop will TLE on large `n`.

### Examples

```
Input:  x = 2.00000, n = 10
Output: 1024.00000

Input:  x = 2.10000, n = 3
Output: 9.26100

Input:  x = 2.00000, n = -2
Output: 0.25000
```

### Constraints

- `-100.0 < x < 100.0`
- `-2^31 <= n <= 2^31 - 1`
- `n` is an integer.
- Either `x != 0` or `n > 0`.
- `-10^4 <= x^n <= 10^4`

### Hint

> Use binary exponentiation: `x^n = (x^(n/2))^2` if `n` is even, else `x * x^(n-1)`. Convert negative `n` once at the start by inverting `x` and negating `n` — but be careful with `n = -2^31` (its negation overflows in fixed-width languages; in Python this just works).

### Solution

```python
def my_pow(x: float, n: int) -> float:
    # Handle negative exponent up-front.
    if n < 0:
        x = 1 / x
        n = -n

    # Iterative binary exponentiation (avoids recursion stack on huge n).
    result = 1.0
    base = x
    while n > 0:
        if n & 1:        # current low bit is set -> multiply result by base
            result *= base
        base *= base     # square the base for the next bit position
        n >>= 1
    return result

# Time: O(log |n|) — one iteration per bit of n.
# Space: O(1) iteratively (or O(log n) recursively).
#
# Why this works:
#   n in binary = sum of powers of two -> x^n = product of x^(2^k) for
#   each set bit k. We maintain `base = x^(2^k)` by squaring, and only
#   multiply into `result` when the k-th bit of n is 1.
#
# Recursive version (also fine, more elegant for an interview):
#   def my_pow(x, n):
#       if n == 0: return 1.0
#       if n < 0: return my_pow(1/x, -n)
#       half = my_pow(x, n // 2)
#       return half * half * (x if n % 2 else 1)
```

---

## Question 32: SQL — Rising Temperature

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 12–15 minutes |
| **Difficulty** | Easy–Medium |
| **Topic Tags** | SQL, Self JOIN, Date Comparison |
| **Source Pattern** | Common SQL assessment question |

### Problem Statement

Given a `Weather` table, write a SQL query to find all dates' `id` with higher temperatures compared to its previous date (yesterday).

```
Weather:
+----+------------+-------------+
| id | recordDate | temperature |
+----+------------+-------------+
| 1  | 2015-01-01 | 10          |
| 2  | 2015-01-02 | 25          |
| 3  | 2015-01-03 | 20          |
| 4  | 2015-01-04 | 30          |
+----+------------+-------------+
```

### Expected Output

```
+----+
| id |
+----+
| 2  |
| 4  |
+----+
```

### Hint

> Self-join the Weather table where one row's date is exactly one day after the other row's date, then filter for higher temperature.

### Solution

```sql
SELECT w1.id
FROM Weather w1
JOIN Weather w2 ON w1.recordDate = DATE_ADD(w2.recordDate, INTERVAL 1 DAY)
WHERE w1.temperature > w2.temperature;

-- PostgreSQL alternative:
-- ON w1.recordDate = w2.recordDate + INTERVAL '1 day'
```

---

# === Gap-Filler Questions (Topics Not Covered Above) ===

The questions below target arenas the original bank had no representation for: **sliding window**, **trees / BSTs**, **linked lists**, **dynamic programming**, **binary search**, **heap / priority queue**, **bit manipulation**, **intervals**, **backtracking**, **topological sort**, **union find**, **tries**, **greedy**, and a few additional **SQL patterns** (consecutive-row analysis and self-referential joins).

---

## Question 33: Longest Substring Without Repeating Characters  *(NEW TOPIC — Sliding Window)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 12–15 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Sliding Window, Hash Map, String |
| **Source Pattern** | Canonical sliding-window problem |

### Problem Statement

Given a string `s`, find the length of the longest substring without repeating characters.

### Examples

```
Input:  "abcabcbb"
Output: 3    ("abc")

Input:  "bbbbb"
Output: 1    ("b")

Input:  "pwwkew"
Output: 3    ("wke")

Input:  ""
Output: 0
```

### Constraints

- `0 <= len(s) <= 5 * 10^4`
- `s` consists of English letters, digits, symbols, and spaces.

### Hint

> Maintain a window `[left, right]` and a hash map `char -> last_seen_index`; when you encounter a repeat **inside** the window, jump `left` to `last_seen + 1`.

### Solution

```python
def length_of_longest_substring(s: str) -> int:
    last = {}     # char -> most recent index
    left = 0
    best = 0

    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            # The duplicate is INSIDE the window -> shrink from the left.
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)

    return best

# Time: O(n) — each character is visited once by `right`.
# Space: O(min(n, alphabet))
# Gotcha: the `last[ch] >= left` check is essential. Without it, a stale
# index from BEFORE the current window would wrongly shrink it.
```

---

## Question 34: Minimum Window Substring  *(NEW TOPIC — HARD Sliding Window)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 25–30 minutes |
| **Difficulty** | Hard |
| **Topic Tags** | Sliding Window, Hash Map, Counters, String |
| **Source Pattern** | The "need vs have" sliding-window template |

### Problem Statement

Given two strings `s` and `t`, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window. If no such substring exists, return the empty string `""`.

The answer is guaranteed to be unique.

### Examples

```
Input:  s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"

Input:  s = "a", t = "a"
Output: "a"

Input:  s = "a", t = "aa"
Output: ""
```

### Constraints

- `1 <= len(s), len(t) <= 10^5`
- `s` and `t` consist of uppercase and lowercase English letters.

### Hint

> Track `need` (a Counter of `t`) and `have` (a Counter of the current window); maintain `formed` = number of distinct chars whose required count is currently satisfied. Expand `right` until `formed == len(need)`, then shrink `left` while the window is still valid to record the minimum.

### Solution

```python
from collections import Counter

def min_window(s: str, t: str) -> str:
    if not s or not t or len(s) < len(t):
        return ""

    need = Counter(t)
    required = len(need)        # distinct chars we must satisfy

    have_counts = {}
    formed = 0                  # how many distinct chars are AT/ABOVE need

    best_len = float('inf')
    best_l = best_r = 0
    left = 0

    for right, ch in enumerate(s):
        have_counts[ch] = have_counts.get(ch, 0) + 1
        if ch in need and have_counts[ch] == need[ch]:
            formed += 1

        # Try to shrink from the left while the window is still valid.
        while formed == required:
            if right - left + 1 < best_len:
                best_len = right - left + 1
                best_l, best_r = left, right

            lc = s[left]
            have_counts[lc] -= 1
            if lc in need and have_counts[lc] < need[lc]:
                formed -= 1
            left += 1

    return "" if best_len == float('inf') else s[best_l:best_r + 1]

# Time: O(|s| + |t|) — each char is added once and removed at most once.
# Space: O(|s| + |t|) for the counters.
# Key idea: `formed` lets you check window validity in O(1) instead of
# comparing two Counters (which would be O(alphabet) per step).
```

---

## Question 35: Lowest Common Ancestor of a Binary Tree  *(NEW TOPIC — Tree DFS)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 15–18 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Binary Tree, DFS, Recursion |
| **Source Pattern** | Canonical tree problem |

### Problem Statement

Given the `root` of a binary tree and two nodes `p` and `q`, return their **lowest common ancestor (LCA)**.

The LCA is the deepest node that has both `p` and `q` as descendants (a node is considered a descendant of itself).

### Examples

```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4

LCA(5, 1) = 3
LCA(5, 4) = 5    (a node is its own descendant)
```

### Constraints

- `2 <= number of nodes <= 10^5`
- All node values are unique.
- `p != q` and both exist in the tree.

### Hint

> Recurse left and right; if both subtree calls return non-null, this node IS the LCA; otherwise propagate whichever side found one of `p` or `q`.

### Solution

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    if root is None or root is p or root is q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    # Found p in one subtree and q in the other -> root is the LCA.
    if left and right:
        return root
    # Otherwise propagate the non-None side upward.
    return left if left else right

# Time: O(n) — every node visited once.
# Space: O(h) recursion, where h = tree height (O(log n) balanced, O(n) skewed).
# Why this works: the FIRST node whose two subtree searches BOTH succeed
# must be the deepest such node — recursion bottoms out at p/q and bubbles
# up until they meet.
```

---

## Question 36: Validate Binary Search Tree  *(NEW TOPIC — BST)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 12–15 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | BST, DFS, In-Order Traversal |
| **Source Pattern** | Canonical BST property check |

### Problem Statement

Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST has:

- The left subtree of a node contains only nodes with keys **strictly less than** the node's key.
- The right subtree of a node contains only nodes with keys **strictly greater than** the node's key.
- Both subtrees must also be BSTs.

### Examples

```
Input:  [2,1,3]      ->   2          Output: True
                         / \
                        1   3

Input:  [5,1,4,null,null,3,6]   ->   5      Output: False
                                    / \
                                   1   4
                                      / \
                                     3   6   (3 < 5, but in right subtree)
```

### Constraints

- `1 <= number of nodes <= 10^4`
- `-2^31 <= node.val <= 2^31 - 1`

### Hint

> The trap: checking `node.left.val < node.val < node.right.val` is NOT enough — descendants must lie within an inherited (min, max) range. Pass `(low, high)` bounds down recursively, OR do an in-order traversal and verify it is strictly increasing.

### Solution

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root: TreeNode) -> bool:
    def validate(node, low, high):
        if node is None:
            return True
        if not (low < node.val < high):
            return False
        return (validate(node.left, low, node.val)
                and validate(node.right, node.val, high))

    return validate(root, float('-inf'), float('inf'))

# Time: O(n)
# Space: O(h) recursion stack.
#
# Alternative (in-order, very clean): in-order traversal of a valid BST
# yields a strictly increasing sequence — track `prev` during DFS:
#
# def is_valid_bst(root):
#     prev = [float('-inf')]
#     def inorder(n):
#         if not n: return True
#         if not inorder(n.left): return False
#         if n.val <= prev[0]: return False
#         prev[0] = n.val
#         return inorder(n.right)
#     return inorder(root)
```

---

## Question 37: Reverse Linked List  *(NEW TOPIC — Linked List Basics)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 8–10 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | Linked List, Pointers, Iteration |
| **Source Pattern** | Foundational linked-list manipulation |

### Problem Statement

Given the `head` of a singly linked list, reverse the list and return the new head.

### Examples

```
Input:  1 -> 2 -> 3 -> 4 -> 5
Output: 5 -> 4 -> 3 -> 2 -> 1

Input:  1 -> 2
Output: 2 -> 1

Input:  (empty)
Output: (empty)
```

### Constraints

- `0 <= number of nodes <= 5000`
- `-5000 <= node.val <= 5000`

### Hint

> Use three pointers: `prev` (initially None), `curr` (head), and a temporary `nxt` to remember `curr.next` before you overwrite it.

### Solution

```python
class ListNode:
    def __init__(self, val=0, nxt=None):
        self.val = val
        self.next = nxt

def reverse_list(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        nxt = curr.next     # remember next BEFORE overwrite
        curr.next = prev    # rewire
        prev = curr
        curr = nxt
    return prev

# Time: O(n)
# Space: O(1)
#
# Recursive variant (O(n) stack):
#   def reverse_list(head):
#       if not head or not head.next: return head
#       new_head = reverse_list(head.next)
#       head.next.next = head
#       head.next = None
#       return new_head
```

---

## Question 38: Linked List Cycle II (Find Cycle Start)  *(NEW TOPIC — Floyd's Algorithm)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 15–18 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Linked List, Two Pointers, Floyd's Cycle Detection |
| **Source Pattern** | The "find where the cycle begins" trick |

### Problem Statement

Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return `None`. Do it in O(1) extra space.

### Examples

```
Input:  3 -> 2 -> 0 -> -4 -> (back to node "2")
Output: node with value 2

Input:  1 -> 2 -> (back to "1")
Output: node with value 1

Input:  1 -> (no cycle)
Output: None
```

### Constraints

- `0 <= number of nodes <= 10^4`
- Cycle (if any) is reached internally — the position is hidden from you.

### Hint

> Run Floyd's tortoise & hare to detect a meeting point. Once they meet, reset `slow` to `head` and advance both pointers ONE step at a time — they will collide at the cycle start (provable from the algebra of the loop length).

### Solution

```python
class ListNode:
    def __init__(self, val=0, nxt=None):
        self.val = val
        self.next = nxt

def detect_cycle(head: ListNode) -> ListNode:
    slow = fast = head

    # Phase 1: detect a meeting point inside the cycle (if any).
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            break
    else:
        return None
    if not fast or not fast.next:
        return None

    # Phase 2: reset slow to head, advance both by 1 -> meet at cycle start.
    slow = head
    while slow is not fast:
        slow = slow.next
        fast = fast.next
    return slow

# Time: O(n)
# Space: O(1)
#
# Why phase 2 works (sketch):
#   Let L = distance head -> cycle start, C = cycle length,
#   k = distance cycle start -> meeting point.
#   When they meet, slow has walked L + k. fast has walked 2*(L+k).
#   Their difference is a multiple of C: 2(L+k) - (L+k) = L + k = mC.
#   So L = mC - k. Walking L from head and (C - k) from meeting point
#   both land on the cycle start.
```

---

## Question 39: Merge Two Sorted Linked Lists  *(NEW TOPIC — Linked List)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 10–12 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | Linked List, Two Pointers, Dummy Head |
| **Source Pattern** | Foundational merge pattern (precursor to merge sort, K-way merge) |

### Problem Statement

You are given the heads of two sorted linked lists `list1` and `list2`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

### Examples

```
Input:  list1 = 1 -> 2 -> 4,  list2 = 1 -> 3 -> 4
Output: 1 -> 1 -> 2 -> 3 -> 4 -> 4

Input:  list1 = [], list2 = []
Output: []

Input:  list1 = [], list2 = 0
Output: 0
```

### Constraints

- Number of nodes in each list is in `[0, 50]`.
- `-100 <= node.val <= 100`
- Both lists are sorted in non-decreasing order.

### Hint

> Use a dummy head node so you don't need to special-case the very first append; walk both lists with a tail pointer.

### Solution

```python
class ListNode:
    def __init__(self, val=0, nxt=None):
        self.val = val
        self.next = nxt

def merge_two_lists(l1: ListNode, l2: ListNode) -> ListNode:
    dummy = ListNode()
    tail = dummy

    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next

    # Attach the remaining tail (only one of the two is non-empty).
    tail.next = l1 if l1 else l2
    return dummy.next

# Time: O(n + m)
# Space: O(1) — splicing in place, dummy is a single helper node.
```

---

## Question 40: Kth Largest Element in an Array  *(NEW TOPIC — Heap)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 12–15 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Heap / Priority Queue, Sorting, Quickselect |
| **Source Pattern** | "Top-K" pattern — heap fundamentals |

### Problem Statement

Given an integer array `nums` and an integer `k`, return the `k`-th largest element in the array. Note that this is the k-th largest in sorted order, **not** the k-th distinct.

### Examples

```
Input:  nums = [3,2,1,5,6,4], k = 2
Output: 5

Input:  nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4
```

### Constraints

- `1 <= k <= len(nums) <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

### Hint

> Keep a **min-heap of size k**: push every number, pop the smallest whenever the heap exceeds size k — the heap's root is then the k-th largest.

### Solution

```python
import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    heap = []  # min-heap of the k largest seen so far
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]

# Time: O(n log k)
# Space: O(k)
#
# Why a min-heap of size k (not a max-heap of size n)?
#   The root of a size-k min-heap is the SMALLEST of the k largest seen,
#   which is exactly the k-th largest. Memory stays O(k) regardless of n.
#
# Faster alternative: quickselect, O(n) average, O(1) extra space,
# but O(n^2) worst case unless you randomise the pivot.
```

---

## Question 41: Climbing Stairs  *(NEW TOPIC — DP Introduction)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 8–10 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | Dynamic Programming, Recurrence, Fibonacci |
| **Source Pattern** | The simplest non-trivial DP problem — entry point to the topic |

### Problem Statement

You are climbing a staircase with `n` steps. Each time you can climb either `1` or `2` steps. In how many distinct ways can you reach the top?

### Examples

```
Input:  n = 2
Output: 2    (1+1, 2)

Input:  n = 3
Output: 3    (1+1+1, 1+2, 2+1)

Input:  n = 5
Output: 8
```

### Constraints

- `1 <= n <= 45`

### Hint

> The number of ways to reach step `n` is the sum of ways to reach `n-1` (then take one step) and `n-2` (then take two steps) — this is exactly the Fibonacci recurrence. You only need the two previous values, so O(1) space is enough.

### Solution

```python
def climb_stairs(n: int) -> int:
    if n <= 2:
        return n

    prev2, prev1 = 1, 2  # ways to reach steps 1 and 2
    for _ in range(3, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1

# Time: O(n)
# Space: O(1)
#
# This is the canonical DP onboarding example:
#   f(n) = f(n-1) + f(n-2),   base: f(1)=1, f(2)=2.
# Spotting "ways to reach state X = sum of ways to reach predecessor states"
# is the core DP move you'll reuse in coin-change, LIS, edit-distance, etc.
```

---

## Question 42: Coin Change  *(NEW TOPIC — Bottom-Up DP)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 18–22 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Dynamic Programming, Unbounded Knapsack |
| **Source Pattern** | The DP "minimum coins to make amount" template |

### Problem Statement

You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.

Return the **fewest** number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`. You may assume an infinite supply of each kind of coin.

### Examples

```
Input:  coins = [1,2,5], amount = 11
Output: 3    (5 + 5 + 1)

Input:  coins = [2], amount = 3
Output: -1

Input:  coins = [1], amount = 0
Output: 0
```

### Constraints

- `1 <= len(coins) <= 12`
- `1 <= coins[i] <= 2^31 - 1`
- `0 <= amount <= 10^4`

### Hint

> Let `dp[a] = fewest coins to make amount a`. Then `dp[a] = 1 + min(dp[a - c] for each coin c)`, with `dp[0] = 0`. Use a sentinel like `amount + 1` to mean "unreachable".

### Solution

```python
def coin_change(coins: list[int], amount: int) -> int:
    INF = amount + 1   # sentinel: cannot exceed amount coins of denom 1
    dp = [0] + [INF] * amount

    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)

    return dp[amount] if dp[amount] != INF else -1

# Time: O(amount * len(coins))
# Space: O(amount)
#
# Why bottom-up: top-down with memoisation works too, but for small
# amounts the iterative version avoids recursion overhead and gives
# tighter loops.
#
# Common bug: using `min(dp[a-c]) + 1` while dp[a-c] is still INF will
# poison the result. Either compare before adding (`if dp[a-c] != INF`)
# or keep INF large enough that adding 1 still exceeds the answer.
```

---

## Question 43: Longest Increasing Subsequence  *(NEW TOPIC — DP + Binary Search)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 20–25 minutes |
| **Difficulty** | Medium–Hard |
| **Topic Tags** | Dynamic Programming, Binary Search, Patience Sorting |
| **Source Pattern** | LIS — a DP problem with a beautiful O(n log n) trick |

### Problem Statement

Given an integer array `nums`, return the length of the longest **strictly increasing** subsequence.

A subsequence is a sequence derived by deleting some (or no) elements without changing the order of the remaining.

### Examples

```
Input:  [10,9,2,5,3,7,101,18]
Output: 4    ([2,3,7,18] or [2,3,7,101])

Input:  [0,1,0,3,2,3]
Output: 4

Input:  [7,7,7,7,7,7,7]
Output: 1
```

### Constraints

- `1 <= len(nums) <= 2500` (O(n^2) accepted)
- For follow-up: `len(nums)` up to `10^5` (requires O(n log n))
- `-10^4 <= nums[i] <= 10^4`

### Hint

> Maintain a list `tails` where `tails[k]` is the **smallest possible tail value** of any increasing subsequence of length `k+1`. For each `x`, binary-search the leftmost slot in `tails` with `tails[i] >= x` and overwrite it; the answer is `len(tails)`.

### Solution

```python
from bisect import bisect_left

def length_of_lis(nums: list[int]) -> int:
    tails = []   # tails[k] = smallest tail of any increasing subseq of length k+1
    for x in nums:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)        # extends the longest subsequence
        else:
            tails[i] = x           # improves an existing subsequence
    return len(tails)

# Time: O(n log n)
# Space: O(n)
#
# Important: `tails` is NOT the LIS itself — it is sorted by construction,
# but its elements may not form an actual subsequence of nums. Its LENGTH
# is the right answer; recovering the actual sequence requires storing
# back-pointers.
#
# O(n^2) DP for the warm-up:
#   dp[i] = 1 + max(dp[j] for j < i if nums[j] < nums[i])
#   answer = max(dp).
```

---

## Question 44: Search in Rotated Sorted Array  *(NEW TOPIC — Binary Search)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 15–20 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Binary Search, Array |
| **Source Pattern** | Modified binary search — common interview pattern |

### Problem Statement

There is an integer array `nums` sorted in ascending order (with distinct values), possibly rotated at an unknown pivot. Given the array and a target value `target`, return the index of `target` if it is in `nums`, or `-1` otherwise.

You must write an algorithm with `O(log n)` runtime complexity.

### Examples

```
Input:  nums = [4,5,6,7,0,1,2], target = 0
Output: 4

Input:  nums = [4,5,6,7,0,1,2], target = 3
Output: -1

Input:  nums = [1], target = 0
Output: -1
```

### Constraints

- `1 <= len(nums) <= 5000`
- `-10^4 <= nums[i], target <= 10^4`
- All values are unique.

### Hint

> At every step, one of the two halves around `mid` is still sorted. Decide which one by comparing `nums[lo]` against `nums[mid]`, then check whether `target` lies within the sorted half's range — narrow accordingly.

### Solution

```python
def search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1

    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid

        # Is the LEFT half sorted?
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        # Otherwise the RIGHT half is sorted.
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1

    return -1

# Time: O(log n)
# Space: O(1)
#
# The pivot in a rotated-sorted array splits it into two sorted halves.
# `nums[lo] <= nums[mid]` is the test for "left half is sorted". Then we
# can check the target against that half's known sorted range with
# regular comparisons. The other half is recursed into in the else.
#
# Edge case: when nums[lo] == nums[mid] (with duplicates allowed), this
# version still works because values are distinct. For LC 81 (duplicates
# allowed), you would skip `lo` by one whenever lo==mid==hi.
```

---

## Question 45: Single Number (XOR)  *(NEW TOPIC — Bit Manipulation)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 5–8 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | Bit Manipulation, XOR |
| **Source Pattern** | Bitwise-XOR identity exploit |

### Problem Statement

Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.

You must implement a solution with **O(n)** time and **O(1)** space.

### Examples

```
Input:  [2,2,1]
Output: 1

Input:  [4,1,2,1,2]
Output: 4

Input:  [1]
Output: 1
```

### Constraints

- `1 <= len(nums) <= 3 * 10^4`
- `-3 * 10^4 <= nums[i] <= 3 * 10^4`

### Hint

> XOR has three properties that solve this in one pass: `a ^ a == 0`, `a ^ 0 == a`, and XOR is commutative and associative. XOR everything together — pairs cancel, the lone value survives.

### Solution

```python
def single_number(nums: list[int]) -> int:
    result = 0
    for x in nums:
        result ^= x
    return result

# Time: O(n)
# Space: O(1)
#
# This is the cleanest possible use of XOR's properties. Related variants:
#   * "Every element appears three times except one" -> use bitwise sums mod 3
#     (or `(ones, twos)` two-bit state machine).
#   * "Two non-duplicate numbers" -> XOR everything to get a^b, then use
#     any set bit of a^b to partition the array into two groups.
```

---

## Question 46: Merge Intervals  *(NEW TOPIC — Sorting + Intervals)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 12–15 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Sorting, Intervals, Array |
| **Source Pattern** | The fundamental interval-merging pattern |

### Problem Statement

Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the original intervals.

### Examples

```
Input:  [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]

Input:  [[1,4],[4,5]]
Output: [[1,5]]    (touching intervals count as overlapping)

Input:  [[1,4],[2,3]]
Output: [[1,4]]    (nested interval absorbed)
```

### Constraints

- `1 <= len(intervals) <= 10^4`
- `intervals[i].length == 2`
- `0 <= start_i <= end_i <= 10^4`

### Hint

> Sort by start time. Then sweep left-to-right and merge greedily: if the next interval's start is `<=` the current merged end, extend the end; otherwise emit the current interval and start a new one.

### Solution

```python
def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda iv: iv[0])
    merged = [intervals[0][:]]

    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            # Overlap (or touch) -> extend the current interval's end.
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])

    return merged

# Time: O(n log n) for the sort, O(n) sweep.
# Space: O(n) output (O(1) extra if you can mutate the input).
#
# Why sorting works: after sorting by start, any interval that could
# overlap with the current one must come immediately next — there is no
# way for a non-adjacent later interval to "reach back" and overlap.
#
# Watch-out: `merged[-1][1] = max(...)`. If you just assigned `end`, you
# would shrink the current interval when a fully nested one comes by.
```

---

## Question 47: Subsets (Power Set)  *(NEW TOPIC — Backtracking)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 12–15 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Backtracking, Recursion, Bit Manipulation |
| **Source Pattern** | The "all subsets" template — gateway to backtracking |

### Problem Statement

Given an integer array `nums` of **unique** elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Order of subsets does not matter.

### Examples

```
Input:  [1,2,3]
Output: [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]

Input:  [0]
Output: [[],[0]]
```

### Constraints

- `1 <= len(nums) <= 10`
- `-10 <= nums[i] <= 10`

### Hint

> Backtracking with an "include or not" decision per element: recurse with an index pointer, append a copy of the current path at each call, then for `i in range(start, n)` push `nums[i]`, recurse with `i+1`, pop. Iterative bitmask is also clean: for `mask in range(2**n)`, include `nums[i]` iff bit `i` is set.

### Solution

```python
def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    path = []

    def backtrack(start: int):
        # Every node of the recursion tree is itself a valid subset.
        result.append(path[:])     # CRITICAL: copy, not the live list
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1)
            path.pop()

    backtrack(0)
    return result

# Time: O(n * 2^n) — 2^n subsets, each up to length n to copy.
# Space: O(n) recursion + O(n * 2^n) output.
#
# Iterative bitmask alternative (no recursion):
#   def subsets(nums):
#       n = len(nums); out = []
#       for mask in range(1 << n):
#           out.append([nums[i] for i in range(n) if mask >> i & 1])
#       return out
#
# Beginner pitfall: `result.append(path)` (without `path[:]`) appends a
# reference, so every entry mutates as you backtrack. Always copy at
# the leaf you want to record.
```

---

## Question 48: Course Schedule (Topological Sort / Cycle Detection)  *(NEW TOPIC — Topological Sort)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 18–22 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Graph, Topological Sort, BFS (Kahn's), Cycle Detection |
| **Source Pattern** | Canonical DAG / prerequisite problem |

### Problem Statement

There are a total of `num_courses` courses you have to take, labeled `0` to `num_courses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a, b]` indicates that you **must take course `b` first** if you want to take course `a`.

Return `True` if you can finish all courses. Otherwise, return `False`.

(Equivalent: does the directed graph have NO cycle?)

### Examples

```
Input:  num_courses = 2, prerequisites = [[1,0]]
Output: True

Input:  num_courses = 2, prerequisites = [[1,0],[0,1]]
Output: False   (mutual dependency = cycle)

Input:  num_courses = 4, prerequisites = [[1,0],[2,1],[3,2]]
Output: True
```

### Constraints

- `1 <= num_courses <= 2000`
- `0 <= len(prerequisites) <= 5000`
- All pairs `prerequisites[i]` are unique.

### Hint

> Use Kahn's algorithm (BFS-based topological sort): compute in-degrees, enqueue every node with in-degree 0, then repeatedly pop a node, decrement its neighbors' in-degrees, and enqueue any that drop to 0. If you processed every node, the graph is acyclic.

### Solution

```python
from collections import defaultdict, deque

def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:
    graph = defaultdict(list)
    in_degree = [0] * num_courses

    for a, b in prerequisites:
        graph[b].append(a)    # edge b -> a (b must come before a)
        in_degree[a] += 1

    queue = deque(i for i in range(num_courses) if in_degree[i] == 0)
    processed = 0

    while queue:
        node = queue.popleft()
        processed += 1
        for nxt in graph[node]:
            in_degree[nxt] -= 1
            if in_degree[nxt] == 0:
                queue.append(nxt)

    return processed == num_courses

# Time: O(V + E)
# Space: O(V + E)
#
# Why Kahn's works: a DAG always has at least one node with in-degree 0
# (a source). Removing it cannot create a cycle. Repeat. If you ever get
# stuck with edges remaining, those edges form a cycle.
#
# Alternative: DFS with 3-color marking (white / gray / black). Gray
# during DFS, seeing a gray node means cycle. Slightly trickier to write.
```

---

## Question 49: Number of Connected Components  *(NEW TOPIC — Union Find)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 15–18 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Union Find (DSU), Graph |
| **Source Pattern** | Canonical DSU introduction |

### Problem Statement

You have a graph of `n` nodes labeled `0..n-1`. You are given an integer `n` and an array `edges` where `edges[i] = [u, v]` indicates an undirected edge.

Return the number of connected components.

### Examples

```
Input:  n = 5, edges = [[0,1],[1,2],[3,4]]
Output: 2

Input:  n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
Output: 1

Input:  n = 5, edges = []
Output: 5
```

### Constraints

- `1 <= n <= 2000`
- `0 <= len(edges) <= n * (n - 1) / 2`
- No duplicate edges, no self-loops.

### Hint

> Use Union-Find with path compression and union by rank: start with `n` components, and each successful union (two different roots) decrements the count by 1.

### Solution

```python
def count_components(n: int, edges: list[list[int]]) -> int:
    parent = list(range(n))
    rank = [0] * n
    components = n

    def find(x):
        # Path compression
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b) -> bool:
        ra, rb = find(a), find(b)
        if ra == rb:
            return False
        # Union by rank
        if rank[ra] < rank[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        if rank[ra] == rank[rb]:
            rank[ra] += 1
        return True

    for a, b in edges:
        if union(a, b):
            components -= 1

    return components

# Time: O((n + |E|) * α(n))   (effectively O(n + |E|); α is inverse Ackermann)
# Space: O(n)
#
# Why DSU instead of BFS/DFS here?
#   For a static "count components" question, BFS works in O(n + E) too.
#   DSU shines when edges arrive incrementally (online) or when you need
#   to keep querying connectivity as edges are added — like in MST
#   (Kruskal), friend-circles, accounts-merge, etc.
```

---

## Question 50: Implement Trie (Prefix Tree)  *(NEW TOPIC — Data Structure Design)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 15–18 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Trie, Hash Map, Design |
| **Source Pattern** | Foundational data structure — prerequisite for Q20 (Word Search II) |

### Problem Statement

A **trie** (pronounced "try") is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the `Trie` class:

- `Trie()` — initializes the trie.
- `insert(word)` — inserts `word` into the trie.
- `search(word)` — returns `True` if `word` is in the trie, `False` otherwise.
- `starts_with(prefix)` — returns `True` if there is any previously inserted word that begins with `prefix`.

### Examples

```
Trie t = new Trie()
t.insert("apple")
t.search("apple")     -> True
t.search("app")       -> False     (whole word not inserted)
t.starts_with("app")  -> True
t.insert("app")
t.search("app")       -> True
```

### Constraints

- `1 <= len(word), len(prefix) <= 2000`
- Up to `3 * 10^4` calls total to `insert`, `search`, and `starts_with`.
- `word`, `prefix` consist of lowercase English letters.

### Hint

> A trie node is just `{children: dict, end: bool}`. Both `search` and `starts_with` walk the trie character by character; they differ only in what they check at the final node — `end == True` vs "we got here at all".

### Solution

```python
class Trie:
    def __init__(self):
        self.root = {}

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node:
                node[ch] = {}
            node = node[ch]
        node['$'] = True   # sentinel: a word ends here

    def _walk(self, s: str):
        node = self.root
        for ch in s:
            if ch not in node:
                return None
            node = node[ch]
        return node

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node is not None and node.get('$', False)

    def starts_with(self, prefix: str) -> bool:
        return self._walk(prefix) is not None

# Time:  O(L) per operation, L = length of the word/prefix.
# Space: O(total length of all inserted words) for the trie.
#
# Tries dominate "prefix" queries — autocomplete, longest common prefix,
# fast dictionary lookup in DFS (cf. Q20 Word Search II), IP routing tables.
# A hash set of strings can answer `search` in O(L) too, but it cannot
# answer `starts_with` faster than O(N*L). That's the trie's edge.
```

---

## Question 51: Jump Game  *(NEW TOPIC — Greedy)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 12–15 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | Greedy, Array |
| **Source Pattern** | Canonical "max-reach" greedy template |

### Problem Statement

You are given an integer array `nums`. You are initially positioned at index `0`, and each element represents your maximum jump length at that position.

Return `True` if you can reach the last index, or `False` otherwise.

### Examples

```
Input:  [2,3,1,1,4]
Output: True

Input:  [3,2,1,0,4]
Output: False    (stuck at index 3 with value 0, cannot pass it)

Input:  [0]
Output: True
```

### Constraints

- `1 <= len(nums) <= 10^4`
- `0 <= nums[i] <= 10^5`

### Hint

> Track the furthest index you can possibly reach as you walk left-to-right; if you ever stand on an index `i > furthest_reachable`, you're stuck. Otherwise update `furthest = max(furthest, i + nums[i])`.

### Solution

```python
def can_jump(nums: list[int]) -> bool:
    furthest = 0
    n = len(nums)
    for i in range(n):
        if i > furthest:
            return False              # we cannot even stand on i
        furthest = max(furthest, i + nums[i])
        if furthest >= n - 1:
            return True               # last index already in reach
    return True

# Time: O(n)
# Space: O(1)
#
# Why greedy works: at any point, ALL indices in [0, furthest] are
# reachable. So you don't need DP to decide "can I reach j" — j is
# reachable iff j <= furthest. Each step you only need to keep
# `furthest` updated.
#
# Follow-up "Jump Game II" (minimum number of jumps): same greedy with
# a "current jump's right boundary" variable — when you cross it, your
# answer increments by 1.
```

---

## Question 52: SQL — Employees Earning More Than Their Managers  *(NEW TOPIC — Self-Referential JOIN)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 8–10 minutes |
| **Difficulty** | Easy |
| **Topic Tags** | SQL, Self JOIN, Hierarchical Data |
| **Source Pattern** | Canonical self-join question |

### Problem Statement

The `Employee` table has columns `id`, `name`, `salary`, `managerId` (nullable; references `Employee.id`).

Write a SQL query that finds the employees who earn more than their managers.

```
Employee:
+----+-------+--------+-----------+
| id | name  | salary | managerId |
+----+-------+--------+-----------+
| 1  | Joe   | 70000  | 3         |
| 2  | Henry | 80000  | 4         |
| 3  | Sam   | 60000  | NULL      |
| 4  | Max   | 90000  | NULL      |
+----+-------+--------+-----------+
```

### Expected Output

```
+----------+
| Employee |
+----------+
| Joe      |
+----------+
```

### Hint

> Self-join the table — alias the rows once as the employee, once as the manager — on `employee.managerId = manager.id`, then filter where employee's salary exceeds the manager's.

### Solution

```sql
SELECT e.name AS Employee
FROM Employee e
JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;

-- Aliases are the trick. INNER JOIN automatically drops employees with
-- NULL managerId (e.g., the CEO), which is what we want here — they
-- have no manager to compare against.
```

---

## Question 53: SQL — Consecutive Numbers (Streak Detection)  *(NEW TOPIC — Window / Self-Join Streaks)*

| Attribute | Value |
|-----------|-------|
| **Estimated Time** | 15–18 minutes |
| **Difficulty** | Medium |
| **Topic Tags** | SQL, Window Functions (LAG), Self JOIN, Streak Detection |
| **Source Pattern** | The classic "find runs of N consecutive identical values" question |

### Problem Statement

The `Logs` table has columns `id` (sequential primary key, no gaps) and `num`.

Write a SQL query to find all numbers that appear **at least three times consecutively**. Return the result table in any order. Duplicates in the answer are not allowed.

```
Logs:
+----+-----+
| id | num |
+----+-----+
| 1  | 1   |
| 2  | 1   |
| 3  | 1   |
| 4  | 2   |
| 5  | 1   |
| 6  | 2   |
| 7  | 2   |
+----+-----+
```

### Expected Output

```
+-----------------+
| ConsecutiveNums |
+-----------------+
| 1               |
+-----------------+
```

### Hint

> Use `LAG(num, 1)` and `LAG(num, 2)` window functions to bring the previous two rows' `num` into the current row, then keep rows where all three are equal. The pre-window-function approach is a 3-way self join on `l1.id = l2.id - 1 = l3.id - 2`.

### Solution

```sql
-- Method 1: Window functions (cleanest)
SELECT DISTINCT num AS ConsecutiveNums
FROM (
    SELECT
        num,
        LAG(num, 1) OVER (ORDER BY id) AS prev1,
        LAG(num, 2) OVER (ORDER BY id) AS prev2
    FROM Logs
) t
WHERE num = prev1 AND num = prev2;

-- Method 2: 3-way self join (portable to engines without window funcs)
SELECT DISTINCT l1.num AS ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l2.id = l1.id + 1 AND l2.num = l1.num
JOIN Logs l3 ON l3.id = l1.id + 2 AND l3.num = l1.num;

-- Notes:
--   Method 2 assumes `id` is gap-free and sequential. If it isn't, you
--   must first assign ROW_NUMBER() OVER (ORDER BY id) and self-join on
--   that.
--   Method 1 generalises to "N consecutive" trivially — just add more
--   LAG levels — but the gaps-and-islands pattern (group by
--   `id - ROW_NUMBER() OVER (PARTITION BY num ORDER BY id)`) is the
--   right tool for "longest streak per value".
```

---

## Quick Reference: Question Summary Table

| # | Question | Time | Difficulty | Topics |
|---|----------|------|------------|--------|
| 1 | HTML Tag Validator | 12–15 min | Easy | String, Stack |
| 2 | HTML Validator Advanced (self-closing/comments/CDATA) | 25–30 min | **Hard** | String, Stack, State Machine |
| 3 | Run-Length Encoding | 10–12 min | Easy | String, Loop |
| 4 | Valid Palindrome | 8–10 min | Easy | String, Two Pointers |
| 5 | Shortest Path in Graph | 15–18 min | Medium | Graph, BFS |
| 6 | Word Ladder | 25–30 min | **Hard** | BFS, Implicit Graph |
| 7 | Course Platform Schema | 15–20 min | Easy–Medium | SQL, Design |
| 8 | SQL — Trips and Users (Cancellation Rate) | 20–25 min | **Hard** | SQL, JOIN, CASE |
| 9 | Balanced Parentheses | 8–10 min | Easy | Stack, String |
| 10 | First Non-Repeating Char | 8–10 min | Easy | Hash Table |
| 11 | Duplicate Emails | 5–8 min | Easy | SQL, GROUP BY |
| 12 | Move Zeroes | 10–12 min | Easy | Array, Two Pointers |
| 13 | Evaluate RPN | 12–15 min | Medium | Stack, Math |
| 14 | Basic Calculator II (Infix) | 20–25 min | **Hard** | Stack, Parsing, Precedence |
| 15 | Dept Top 3 Salaries | 15–18 min | Medium | SQL, Window Functions |
| 16 | SQL — Median Employee Salary | 20–25 min | **Hard** | SQL, ROW_NUMBER, Median |
| 17 | Daily Temperatures | 15–18 min | Medium | Monotonic Stack |
| 18 | Simplify Path | 12–15 min | Medium | Stack, Parsing |
| 19 | Shortest Path Binary Matrix | 18–22 min | Medium | BFS, Matrix |
| 20 | Word Search II | 30–35 min | **Hard** | Trie, DFS, Backtracking |
| 21 | Two Sum | 8–10 min | Easy | Hash Table |
| 22 | Reverse Integer | 10–12 min | Easy | Math |
| 23 | Rotting Oranges | 18–22 min | Medium | Multi-Source BFS |
| 24 | Customers Who Never Order | 8–10 min | Easy | SQL, LEFT JOIN |
| 25 | Container With Most Water | 15–18 min | Medium | Two Pointers, Greedy |
| 26 | Trapping Rain Water | 20–25 min | **Hard** | Two Pointers, DP |
| 27 | Happy Number | 12–15 min | Easy–Medium | Floyd's Cycle Detection |
| 28 | Second Highest Salary | 10–12 min | Easy–Medium | SQL, Subquery |
| 29 | Remove Duplicates Sorted | 10–12 min | Easy | Two Pointers |
| 30 | Count Primes | 12–15 min | Easy–Medium | Sieve |
| 31 | Pow(x, n) — Fast Exponentiation | 15–20 min | **Hard** | Math, Divide & Conquer |
| 32 | Rising Temperature | 12–15 min | Easy–Medium | SQL, Self JOIN |
| 33 | Longest Substring Without Repeating | 12–15 min | Medium | Sliding Window |
| 34 | Minimum Window Substring | 25–30 min | **Hard** | Sliding Window, Counters |
| 35 | LCA of a Binary Tree | 15–18 min | Medium | Tree, DFS |
| 36 | Validate BST | 12–15 min | Medium | BST, DFS |
| 37 | Reverse Linked List | 8–10 min | Easy | Linked List |
| 38 | Linked List Cycle II | 15–18 min | Medium | Floyd's Algorithm |
| 39 | Merge Two Sorted Lists | 10–12 min | Easy | Linked List |
| 40 | Kth Largest Element | 12–15 min | Medium | Heap |
| 41 | Climbing Stairs | 8–10 min | Easy | DP intro |
| 42 | Coin Change | 18–22 min | Medium | DP |
| 43 | Longest Increasing Subsequence | 20–25 min | Medium–Hard | DP + Binary Search |
| 44 | Search in Rotated Sorted Array | 15–20 min | Medium | Binary Search |
| 45 | Single Number | 5–8 min | Easy | Bit Manipulation, XOR |
| 46 | Merge Intervals | 12–15 min | Medium | Sorting, Intervals |
| 47 | Subsets (Power Set) | 12–15 min | Medium | Backtracking |
| 48 | Course Schedule | 18–22 min | Medium | Topological Sort |
| 49 | Connected Components | 15–18 min | Medium | Union Find |
| 50 | Implement Trie | 15–18 min | Medium | Trie, Design |
| 51 | Jump Game | 12–15 min | Medium | Greedy |
| 52 | SQL — More Than Manager | 8–10 min | Easy | SQL, Self JOIN |
| 53 | SQL — Consecutive Numbers | 15–18 min | Medium | SQL, LAG / Self JOIN |

---

## Topic Coverage Map

| Arena | Original Bank | Extended Bank |
|---|---|---|
| String / Stack parsing | Q1, 9, 13, 18 | + Q2 (Hard), Q14 (Hard) |
| Sliding window | — | Q33, **Q34 (Hard)** |
| Two pointers | Q4, 12, 25, 29 | + Q26 (Hard Trapping RW) |
| Hash table | Q10, 21 | (reused throughout) |
| BFS / Graph | Q5, 19, 23 | + Q6 (Hard Word Ladder) |
| DFS / Backtracking | — | Q20, 35, 36, 47 |
| Trees / BST | — | Q35, 36 |
| Linked List | — | Q37, 38, 39 |
| Heap / Priority Queue | — | Q40 |
| Dynamic Programming | — | Q41, 42, 43 |
| Binary Search | — | Q44 |
| Bit Manipulation | — | Q45 (+ Q31 binary exp) |
| Intervals / Sorting | — | Q46 |
| Topological Sort | — | Q48 |
| Union Find | — | Q49 |
| Trie | — | Q20 (Hard), Q50 |
| Greedy | (Q25 implicit) | + Q51 explicit template |
| Math / Number Theory | Q22, 27, 30 | + Q31 (Hard) |
| SQL — basics | Q7, 11, 24, 28 | (kept) |
| SQL — windows | Q15, 32 | + Q16 (Hard median), Q53 (LAG) |
| SQL — multi-table & conditional agg | (Q7) | + Q8 (Hard cancellation rate) |
| SQL — self-referential | (Q32) | + Q52 (self-join managers) |

---

**Good luck with your assessment!**
