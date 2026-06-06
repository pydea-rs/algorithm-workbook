# Odoo Coderbyte Assessment — Practice Question Bank
## Realistic Mock Questions Based on Candidate Reports

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

## Question 2: Run-Length Encoding

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

## Question 3: Valid Palindrome (Alphanumeric)

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

## Question 4: Shortest Path in Unweighted Graph

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

## Question 5: Database Schema Design — Course Platform

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

## Question 6: Balanced Parentheses with Multiple Types

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

## Question 7: First Non-Repeating Character

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

## Question 8: SQL — Find Duplicate Emails

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

## Question 9: Move Zeroes

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

## Question 10: Evaluate Reverse Polish Notation

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

## Question 11: SQL — Department Top 3 Salaries

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

## Question 12: Daily Temperatures

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

## Question 13: Simplify Path (Unix-style)

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

## Question 14: Shortest Path in Binary Matrix

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

## Question 15: Two Sum

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

## Question 16: Reverse Integer

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

## Question 17: Rotting Oranges (Multi-Source BFS)

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

## Question 18: SQL — Find Customers Who Never Order

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

## Question 19: Container With Most Water

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

## Question 20: Happy Number

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

## Question 21: SQL — Second Highest Salary

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

## Question 22: Remove Duplicates from Sorted Array

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

## Question 23: Count Primes (Sieve of Eratosthenes)

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

## Question 24: SQL — Rising Temperature

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

## Quick Reference: Question Summary Table

| # | Question | Time | Difficulty | Topics |
|---|----------|------|------------|--------|
| 1 | HTML Tag Validator | 12–15 min | Easy | String, Stack |
| 2 | Run-Length Encoding | 10–12 min | Easy | String, Loop |
| 3 | Valid Palindrome | 8–10 min | Easy | String, Two Pointers |
| 4 | Shortest Path in Graph | 15–18 min | Medium | Graph, BFS |
| 5 | Course Platform Schema | 15–20 min | Easy–Medium | SQL, Design |
| 6 | Balanced Parentheses | 8–10 min | Easy | Stack, String |
| 7 | First Non-Repeating Char | 8–10 min | Easy | Hash Table |
| 8 | Duplicate Emails | 5–8 min | Easy | SQL, GROUP BY |
| 9 | Move Zeroes | 10–12 min | Easy | Array, Two Pointers |
| 10 | Evaluate RPN | 12–15 min | Medium | Stack, Math |
| 11 | Dept Top 3 Salaries | 15–18 min | Medium | SQL, Window Functions |
| 12 | Daily Temperatures | 15–18 min | Medium | Monotonic Stack |
| 13 | Simplify Path | 12–15 min | Medium | Stack, Parsing |
| 14 | Shortest Path Binary Matrix | 18–22 min | Medium | BFS, Matrix |
| 15 | Two Sum | 8–10 min | Easy | Hash Table |
| 16 | Reverse Integer | 10–12 min | Easy | Math |
| 17 | Rotting Oranges | 18–22 min | Medium | Multi-Source BFS |
| 18 | Customers Who Never Order | 8–10 min | Easy | SQL, LEFT JOIN |
| 19 | Container With Most Water | 15–18 min | Medium | Two Pointers, Greedy |
| 20 | Happy Number | 12–15 min | Easy–Medium | Floyd's Cycle Detection |
| 21 | Second Highest Salary | 10–12 min | Easy–Medium | SQL, Subquery |
| 22 | Remove Duplicates Sorted | 10–12 min | Easy | Two Pointers |
| 23 | Count Primes | 12–15 min | Easy–Medium | Sieve |
| 24 | Rising Temperature | 12–15 min | Easy–Medium | SQL, Self JOIN |

---

**Good luck with your assessment!**
