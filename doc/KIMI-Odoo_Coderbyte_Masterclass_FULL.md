# The Complete Odoo Coderbyte Assessment Masterclass
## A Zero-to-Expert Preparation Guide for Python Developers

---

## Table of Contents

1. [How to Use This Guide](#1-how-to-use-this-guide)
2. [The Assessment: What It Is and What It Isn't](#2-the-assessment-what-it-is-and-what-it-isnt)
3. [The Problem-Solving Framework](#3-the-problem-solving-framework)
4. [Chapter A: Data Structures Fundamentals](#chapter-a-data-structures-fundamentals)
5. [Chapter B: String Manipulation](#chapter-b-string-manipulation)
6. [Chapter C: SQL & Database Design](#chapter-c-sql--database-design)
7. [Chapter D: Graph Algorithms](#chapter-d-graph-algorithms)
8. [Chapter E: Stack & Queue Mastery](#chapter-e-stack--queue-mastery)
9. [Chapter F: Arrays & Two Pointers](#chapter-f-arrays--two-pointers)
10. [Chapter G: Math, Logic & Number Theory](#chapter-g-math-logic--number-theory)
11. [Chapter H: Python for Timed Tests](#chapter-h-python-for-timed-tests)
12. [Chapter I: Mock Assessment Walkthroughs](#chapter-i-mock-assessment-walkthroughs)
13. [Appendix: The 60-Minute Cheat Sheet](#appendix-the-60-minute-cheat-sheet)

---

## 1. How to Use This Guide

This guide is designed so that **you never have to look anything up**.

Each chapter follows this structure:
- **The Concept**: What is this thing, mathematically and intuitively?
- **The Derivation**: Why does the algorithm work? (Proofs where helpful, intuition always.)
- **The Pattern**: When do you recognize this problem type?
- **The Code**: Clean, typed Python with comments linking back to concepts.
- **The Pitfalls**: What breaks this? (Off-by-one, empty inputs, overflow, etc.)
- **The Practice**: Problems with hints, then solutions.

**Study method**: Read the concept first. Cover the code. Try to write it yourself. Check. Repeat.

---

## 2. The Assessment: What It Is and What It Isn't

### The Platform: Coderbyte

Coderbyte is a browser-based assessment platform. It provides:
- A code editor with Python (and Java) support.
- Test cases that run automatically when you submit.
- Webcam recording and browser event monitoring.

**What it detects:**
- `window.onblur` events (clicking outside the browser).
- `document.visibilitychange` (switching tabs).
- Clipboard events (copy-paste patterns).
- Fullscreen exit (if enforced).
- Webcam anomalies (face detection, looking away too long).

**What this means for you:** Close everything. Use one monitor. Focus.

### The Questions

Based on candidate reports, the 1-hour Odoo assessment typically contains:
- **2-3 coding problems**.
- **Mix**: 1 String/DSA + 1 SQL/Database + optionally 1 Graph/Stack.
- **Difficulty**: ~67% Easy, ~33% Medium.
- **No Odoo-specific questions** (no ORM, no XML, no framework knowledge).

### The Pipeline

1. **Coderbyte Assessment** (this test).
2. **Aptitude & English Test** (MCQs + email writing).
3. **Technical Interview** (explain your Coderbyte solutions, live coding, OOP).
4. **HR / Final Round**.

**Critical insight**: The next round will ask you to explain your code. If you submit code you don't understand, you will be caught. Write code you can defend.

---

## 3. The Problem-Solving Framework

When you see a problem, don't code immediately. Use **R.A.P.I.D.**:

1. **R**ead carefully. Identify inputs, outputs, constraints.
2. **A**nalyze examples. Trace through small cases by hand.
3. **P**attern match. Does this feel like a Two-Pointer? Stack? Graph?
4. **I**mplement brute force first if stuck. (A working slow solution is better than a broken fast one.)
5. **D**ebug edge cases. Empty input, single element, all same elements, maximum constraints.

**Time allocation for 1 hour:**
- 0-5 min: Read all problems. Pick the easiest.
- 5-25 min: Solve Problem 1 completely.
- 25-45 min: Solve Problem 2.
- 45-55 min: Problem 3 or optimize/review.
- 55-60 min: Final sanity checks.

---

## Chapter A: Data Structures Fundamentals

### A.1 What is an Algorithm?

An **algorithm** is a finite sequence of well-defined instructions to solve a problem. In coding assessments, we care about:
- **Correctness**: Does it produce the right output for all valid inputs?
- **Efficiency**: How much time and memory does it consume?
- **Clarity**: Can another human (or your future self) understand it?

### A.2 Time & Space Complexity (Big-O)

Big-O describes how resource usage grows as input size `n` grows.

**Time Complexity:**
- **O(1)** — Constant time. The operation takes the same time regardless of input size. Example: accessing an array by index.
- **O(log n)** — Logarithmic. The problem size halves each step. Example: binary search.
- **O(n)** — Linear. You touch each element once. Example: finding the maximum in an array.
- **O(n log n)** — Linearithmic. Common in efficient sorting (merge sort, timsort).
- **O(n²)** — Quadratic. Nested loops over the same data. Example: bubble sort, checking all pairs.
- **O(2^n)** — Exponential. Avoid at all costs for n > 30.

**Space Complexity:**
- **O(1)** extra space means you only use a fixed number of variables, regardless of input size. Modifying the input array in-place is often considered O(1) extra.
- **O(n)** extra space means you allocate additional storage proportional to input (e.g., a hash map or a copy of the array).

**Why this matters in a 1-hour test:**
If your solution is O(n²) and n can be 10^5, it will time out. The platform runs hidden test cases with large inputs.

**The limits rule:**
- n ≤ 20: O(2^n) or O(n!) might be acceptable.
- n ≤ 1,000: O(n²) is usually fine.
- n ≤ 100,000: You need O(n log n) or O(n).
- n ≤ 10^6: O(n) is expected.

### A.3 Arrays, Lists, and Memory

An **array** is a contiguous block of memory where each element is the same size. This allows O(1) access by index: the computer calculates `address = base_address + index * element_size`.

In Python, `list` is a dynamic array:
- **Indexing**: `arr[i]` is O(1).
- **Append**: `arr.append(x)` is O(1) amortized (occasionally needs to resize and copy).
- **Pop from end**: `arr.pop()` is O(1).
- **Pop from front/insert at front**: O(n) because all elements must shift.
- **Search (unsorted)**: O(n).

**Implication for assessments:** If you need to frequently remove from the front, use `collections.deque`, not a list.

### A.4 Hash Tables (Dictionaries/Sets)

A **hash table** maps keys to values using a hash function. In Python, `dict` and `set` are hash tables.

**Operations:**
- Insert: O(1) average.
- Lookup: O(1) average.
- Delete: O(1) average.

**The catch:** Worst case is O(n) if all keys collide, but Python's hash table implementation is highly optimized and this is practically impossible with random data.

**When to use:**
- Counting frequencies (Counter).
- Checking existence (Set membership).
- Mapping relationships (Dictionary).
- Caching results (Memoization).

### A.5 Stacks & Queues as Abstract Data Types

An **Abstract Data Type (ADT)** defines behavior, not implementation.

**Stack (LIFO — Last In, First Out):**
- Operations: push (add to top), pop (remove from top), peek (view top).
- Real-world analogy: Stack of plates. You add and remove from the top.
- Python implementation: `list` with `append()` and `pop()`.

**Queue (FIFO — First In, First Out):**
- Operations: enqueue (add to back), dequeue (remove from front), peek (view front).
- Real-world analogy: Line at a grocery store.
- Python implementation: `collections.deque` with `append()` and `popleft()`. Never use `list.pop(0)` — it's O(n).

### A.6 Graphs: The Math Behind Connections

A **graph** G = (V, E) consists of:
- **V**: A set of vertices (nodes).
- **E**: A set of edges (connections between nodes).

**Types:**
- **Undirected**: Edge (u, v) means u connects to v and v connects to u. (Friendship on social media.)
- **Directed**: Edge (u, v) means u points to v, but not necessarily back. (Hyperlinks on the web.)
- **Weighted**: Each edge has a numerical value (cost, distance, time).
- **Unweighted**: All edges are equal.

**Key properties:**
- **Degree**: Number of edges connected to a node.
- **Path**: A sequence of edges from node A to node B.
- **Cycle**: A path that starts and ends at the same node.
- **Connected**: Every node is reachable from every other node.

**Why graphs matter:** Many real-world problems are connection problems: shortest route, dependency resolution, network analysis. Odoo assessments reportedly include unweighted shortest path problems.

---

## Chapter B: String Manipulation

### B.1 Strings as Sequences

In Python, a string is an **immutable sequence of Unicode characters**. "Immutable" means you cannot change a character in-place: `s[0] = 'x'` raises a TypeError. Any "modification" creates a new string.

**Memory implication:** Concatenating strings in a loop with `+` creates O(n²) total characters because each `+` allocates a new string. Always build a list and `''.join()`.

**Essential operations (memorize these):**

```python
s = "  Hello, World!  "

# Inspection
len(s)              # 17
s[0]                # ' ' (first char)
s[-1]               # ' ' (last char)
s[3:8]              # 'Hello' (slice: start inclusive, end exclusive)
s[::-1]             # '  !dlroW ,olleH  ' (reverse)

# Cleaning
s.strip()           # 'Hello, World!' — remove leading/trailing whitespace
s.lstrip()          # 'Hello, World!  '
s.rstrip()          # '  Hello, World!'

# Case
s.lower()           # '  hello, world!  '
s.upper()           # '  HELLO, WORLD!  '
s.title()           # '  Hello, World!  '

# Search & Replace
s.find("World")     # 9 (index of first match, or -1)
s.find("xyz")       # -1
s.count("l")        # 3 (occurrences of substring)
s.replace("l", "x") # '  Hexxo, Worxd!  '

# Split & Join
s.split(",")         # ['  Hello', ' World!  ']
s.split()           # ['Hello,', 'World!'] — splits on any whitespace
"-".join(["a","b"])   # 'a-b'

# Checks (return True/False)
"abc".isalpha()     # True (all alphabetic)
"123".isdigit()     # True (all numeric)
"a1".isalnum()      # True (alpha or numeric)
"   ".isspace()     # True (all whitespace)
"hello".startswith("he")  # True
"hello".endswith("lo")    # True
```

### B.2 The Two-Pointer Paradigm

**The concept:** Instead of using extra memory to create a new data structure, use two indices (pointers) to traverse the existing structure.

**Why it works:** Many problems have symmetry or ordering that allows you to process from both ends or with a fast/slow runner.

**Variant 1: Opposite Pointers**
Place one pointer at the start, one at the end. Move them toward the center.

**When to use:** Palindromes, reversing in-place, two-sum on sorted array.

```python
def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
```

**Trace through:** For "racecar":
- left=0('r'), right=6('r') → match. left=1, right=5.
- left=1('a'), right=5('a') → match. left=2, right=4.
- left=2('c'), right=4('c') → match. left=3, right=3.
- left == right, loop ends. Return True.

**Variant 2: Same-Direction Pointers (Fast & Slow)**
Both start at the beginning. One moves faster or conditionally.

**When to use:** Remove duplicates, move zeroes, find middle of linked list.

```python
def remove_duplicates(nums: list[int]) -> int:
    if not nums:
        return 0
    write = 1  # where to write the next unique element
    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1
    return write
```

**Trace through:** [1, 1, 2, 2, 3]
- read=1, nums[1]=1 == nums[0]=1 → skip.
- read=2, nums[2]=2 != nums[1]=1 → nums[1]=2, write=2.
- read=3, nums[3]=2 == nums[2]=2 → skip.
- read=4, nums[4]=3 != nums[3]=2 → nums[2]=3, write=3.
- Return 3. Array is now [1, 2, 3, 2, 3] — first 3 elements are valid.

### B.3 Parsing & State Machines

**The concept:** A state machine (or finite automaton) is a mathematical model of computation. It has:
- **States**: The current condition of the system.
- **Transitions**: Rules for moving between states based on input.
- **Start state**: Where you begin.
- **Accept states**: Valid ending conditions.

**Why use it for parsing:** Strings often have grammar rules. A state machine enforces those rules step-by-step.

**Example: Validate a simple ID format (2 letters + 4 digits)**

States:
- S0: Start (expecting letter).
- S1: Got 1 letter (expecting letter).
- S2: Got 2 letters (expecting digit).
- S3: Got 2 letters + 1 digit (expecting digit).
- S4: Got 2 letters + 2 digits (expecting digit).
- S5: Got 2 letters + 3 digits (expecting digit).
- S6: Got 2 letters + 4 digits (accept state).

```python
def validate_id(code: str) -> bool:
    if len(code) != 6:
        return False
    return code[:2].isalpha() and code[2:].isdigit()

# This is a compact state machine. For more complex grammars,
# you'd write explicit state transitions.
```

**Example: Validate balanced parentheses**
The "state" here is the stack itself — it tracks how many unmatched opening brackets exist.

### B.4 Run-Length Encoding (RLE)

**The concept:** Lossless data compression where consecutive identical characters are stored as a single character and count.

**The algorithm:**
1. Initialize count = 1.
2. Scan left to right. If current char == previous char, increment count.
3. If different, append (previous_char + count) to result, reset count = 1.
4. After the loop, append the final run.

**Why the final append is critical:** The loop only emits when a change is detected. The last run never encounters a "change" inside the loop, so it must be emitted after.

```python
def run_length_encode(s: str) -> str:
    if not s:
        return ""

    result = []
    count = 1

    for i in range(1, len(s)):
        if s[i] == s[i - 1]:
            count += 1
        else:
            result.append(s[i - 1] + str(count))
            count = 1

    # CRITICAL: append the final run
    result.append(s[-1] + str(count))
    return "".join(result)
```

**Trace:** "aaabbc"
- i=1, 'a'=='a', count=2.
- i=2, 'a'=='a', count=3.
- i=3, 'b'!='a', emit 'a3', count=1.
- i=4, 'b'=='b', count=2.
- i=5, 'c'!='b', emit 'b2', count=1.
- Loop ends. Emit 'c1'. Result: "a3b2c1".

**Edge case:** Single character "a".
- Loop doesn't run (range(1,1) is empty).
- Emit 'a1'. Correct.

### B.5 Pattern Matching & Wildcards

**The concept:** Determine if a text string matches a pattern containing special symbols.

**Simplified wildcard rules:**
- `?` matches exactly one character (any character).
- `*` matches any sequence of characters (including empty).

**The greedy approach:**
When we encounter `*`, we don't know how many characters it should match. The greedy strategy:
1. Assume `*` matches zero characters (just skip it in the pattern).
2. If we later hit a mismatch, backtrack: assume `*` matches one more character than before.

**Mathematically:** This is equivalent to trying all possible matches for `*` but doing so efficiently by remembering where the last `*` was and how much of the string it has consumed.

```python
def is_match(s: str, p: str) -> bool:
    s_idx = p_idx = 0
    star_idx = s_tmp_idx = -1

    while s_idx < len(s):
        # Exact match or '?' wildcard
        if p_idx < len(p) and p[p_idx] in {s[s_idx], '?'}:
            s_idx += 1
            p_idx += 1
        # '*' wildcard: record position and skip it
        elif p_idx < len(p) and p[p_idx] == '*':
            star_idx = p_idx
            s_tmp_idx = s_idx
            p_idx += 1
        # Mismatch, but no '*' to backtrack to
        elif star_idx == -1:
            return False
        # Backtrack: let '*' consume one more character
        else:
            p_idx = star_idx + 1
            s_tmp_idx += 1
            s_idx = s_tmp_idx

    # Remaining pattern must be all '*'
    return all(c == '*' for c in p[p_idx:])
```

**Trace:** s="abc", p="a*c"
- s_idx=0('a'), p_idx=0('a') → match. s=1, p=1.
- s_idx=1('b'), p_idx=1('*') → star. star_idx=1, s_tmp=1, p=2.
- s_idx=1('b'), p_idx=2('c') → mismatch. star_idx != -1, backtrack.
- p_idx=2, s_tmp=2, s_idx=2.
- s_idx=2('c'), p_idx=2('c') → match. s=3, p=3.
- s_idx == len(s). p[3:] is empty. Return True.

### B.6 HTML/XML Validation with Stacks

**The concept:** HTML/XML has a tree structure. Tags must be properly nested: `<div><p></p></div>` is valid; `<div><p></div></p>` is not.

**Why stacks:** The most recently opened tag must be the next one closed. This is LIFO behavior.

**Algorithm:**
1. Scan the string for tags (text between `<` and `>`).
2. If it's an opening tag, push it onto the stack.
3. If it's a closing tag, pop from the stack and check if they match.
4. If mismatch, or stack is empty when we need to pop, invalid.
5. After scanning, stack must be empty.

```python
def validate_html_tags(html: str) -> bool:
    stack = []
    i = 0
    while i < len(html):
        if html[i] == '<':
            j = html.find('>', i)
            if j == -1:
                return False  # unclosed tag

            tag = html[i+1:j]
            if tag.startswith('/'):
                # Closing tag
                if not stack or stack[-1] != tag[1:]:
                    return False
                stack.pop()
            else:
                # Opening tag — ignore attributes for simplicity
                tag_name = tag.split()[0]
                stack.append(tag_name)
            i = j  # jump to end of tag
        i += 1
    return len(stack) == 0
```

**Note:** Real HTML parsers are much more complex (self-closing tags, attributes, DOCTYPE). But for assessment purposes, this simplified version is the expected pattern.

---

## Chapter C: SQL & Database Design

### C.1 What is Relational Algebra?

**The concept:** Relational databases are built on mathematical "relations" (tables). A relation is a set of tuples (rows) with named attributes (columns).

**Core operations:**
- **Selection (σ)**: Choose rows based on a condition. → SQL `WHERE`.
- **Projection (π)**: Choose specific columns. → SQL `SELECT`.
- **Union (∪)**: Combine two sets, removing duplicates. → SQL `UNION`.
- **Difference (-)**: Rows in one set but not another. → SQL `EXCEPT`.
- **Cartesian Product (×)**: All combinations of rows from two tables. → SQL `CROSS JOIN`.
- **Join (⋈)**: Cartesian product + selection. → SQL `JOIN`.

Understanding this helps you reason about what a query does, not just memorize syntax.

### C.2 Schema Design from First Principles

**The goal:** Organize data to minimize redundancy, ensure integrity, and support queries efficiently.

**Step-by-step design process:**

1. **Identify entities** (nouns in the problem description).
   Example: "Students enroll in Courses taught by Instructors."
   Entities: Student, Course, Instructor, Enrollment.

2. **Define attributes** for each entity.
   Student: student_id, name, email.
   Course: course_id, title, credits.

3. **Identify relationships**.
   - Student → Enrollment: One student has many enrollments (1:N).
   - Course → Enrollment: One course has many enrollments (1:N).
   - Enrollment is a junction table for Student:Course (N:M).
   - Instructor → Course: One instructor teaches many courses (1:N).

4. **Assign primary keys**.
   Usually auto-increment integers: `student_id INT PRIMARY KEY AUTO_INCREMENT`.

5. **Add foreign keys** to enforce relationships.
   `enrollments.student_id` references `students.student_id`.

6. **Add constraints**.
   - `NOT NULL`: Required fields.
   - `UNIQUE`: No duplicates (emails, usernames).
   - `CHECK`: Value rules (`credits > 0`).
   - `DEFAULT`: Fallback values.

7. **Consider indexing**.
   Foreign keys and frequently searched columns should be indexed for speed.

```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    instructor_id INT,
    credits INT CHECK (credits > 0),
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id)
);

CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE(student_id, course_id)
);
```

### C.3 Normalization (1NF, 2NF, 3NF)

**The concept:** Normalization is the process of organizing data to reduce redundancy and prevent anomalies.

**1NF — First Normal Form:**
- All columns contain atomic (indivisible) values.
- No repeating groups.
- **Violation:** A `courses` column containing "Math, Physics, Chemistry" as a single string. Fix: Separate table.

**2NF — Second Normal Form:**
- Must be in 1NF.
- No partial dependency: Non-key attributes must depend on the entire primary key.
- **Relevant only for composite keys.** If your PK is a single column, you're automatically in 2NF.
- **Violation:** Enrollment table with PK(student_id, course_id) and a column `student_name` that depends only on `student_id`. Fix: Move `student_name` to the Student table.

**3NF — Third Normal Form:**
- Must be in 2NF.
- No transitive dependency: Non-key attributes must depend only on the primary key, not on other non-key attributes.
- **Violation:** A `courses` table with `instructor_name` (depends on `instructor_id`, not directly on `course_id`). Fix: Create an `instructors` table.

**For assessments:** Mentioning that you would normalize to 3NF demonstrates database maturity. But don't over-engineer simple designs.

### C.4 Query Execution Logic

**SQL executes in this order (not top-to-bottom!):**

1. **FROM + JOINs**: Identify tables and combine them.
2. **WHERE**: Filter rows.
3. **GROUP BY**: Group rows into buckets.
4. **HAVING**: Filter groups.
5. **SELECT**: Choose columns and compute expressions.
6. **ORDER BY**: Sort the result.
7. **LIMIT**: Truncate the result.

**Why this matters:** You cannot use a column alias defined in SELECT inside a WHERE clause, because WHERE executes before SELECT.

```sql
-- WRONG: alias 'total' not available in WHERE
SELECT student_id, COUNT(*) AS total
FROM enrollments
WHERE total > 3      -- ERROR!
GROUP BY student_id;

-- CORRECT: use HAVING for group filters
SELECT student_id, COUNT(*) AS total
FROM enrollments
GROUP BY student_id
HAVING COUNT(*) > 3;
```

### C.5 JOINs Deep Dive

**INNER JOIN**: Returns only rows where the join condition matches in both tables.
```sql
SELECT s.name, c.title
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id;
```

**LEFT JOIN**: Returns all rows from the left table, and matching rows from the right. If no match, right-side columns are NULL.
```sql
-- Find students with no enrollments
SELECT s.name
FROM students s
LEFT JOIN enrollments e ON s.student_id = e.student_id
WHERE e.enrollment_id IS NULL;
```

**RIGHT JOIN**: Opposite of LEFT. Rarely used because you can just swap table order.

**FULL OUTER JOIN**: Returns all rows from both tables, with NULLs where no match. MySQL doesn't support this natively; use UNION of LEFT and RIGHT.

**SELF JOIN**: Join a table to itself. Useful for hierarchical data (employees and managers).
```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.employee_id;
```

### C.6 Aggregation & Window Functions

**Aggregation functions:** `COUNT`, `SUM`, `AVG`, `MAX`, `MIN`. They collapse groups into single values.

**Window functions:** Perform calculations across a set of rows related to the current row, without collapsing them.

```sql
-- RANK: assigns rank, with gaps for ties
SELECT 
    student_id,
    grade,
    RANK() OVER (ORDER BY grade DESC) AS rank
FROM scores;

-- PARTITION BY: resets ranking per group
SELECT 
    course_id,
    student_id,
    grade,
    RANK() OVER (PARTITION BY course_id ORDER BY grade DESC) AS course_rank
FROM scores;

-- DENSE_RANK: like RANK but no gaps (1, 2, 2, 3)
-- ROW_NUMBER: unique number even for ties (1, 2, 3, 4)
```

**When to use window functions vs. GROUP BY:**
- Use **GROUP BY** when you want to collapse rows into summary statistics.
- Use **window functions** when you want to keep all rows and add computed columns (ranking, running totals, moving averages).

---

## Chapter D: Graph Algorithms

### D.1 What is a Graph? (Formal Definition)

A **graph** G = (V, E) is a mathematical structure where:
- **V** is a finite set of **vertices** (also called nodes).
- **E** is a set of **edges**, where each edge is a pair (u, v) with u, v ∈ V.

**Types:**
- **Undirected**: (u, v) ∈ E implies (v, u) ∈ E. The edge has no direction.
- **Directed**: (u, v) means there is a connection from u to v. (v, u) may or may not exist.
- **Weighted**: Each edge e ∈ E has an associated weight w(e) ∈ ℝ (cost, distance, time).
- **Unweighted**: All edges have implicit weight 1 (or weight doesn't matter).

**Key terminology:**
- **Degree**: In undirected graphs, the number of edges incident to a vertex. In directed graphs, we distinguish in-degree and out-degree.
- **Path**: A sequence of vertices v₁, v₂, ..., vₖ where (vᵢ, vᵢ₊₁) ∈ E for all i.
- **Path length**: Number of edges in the path (for unweighted) or sum of weights (for weighted).
- **Shortest path**: A path with minimum length between two vertices.
- **Cycle**: A path that starts and ends at the same vertex.
- **Connected graph**: There is a path between any two vertices.

**Why graphs appear in assessments:** Many problems are about relationships and connections: social networks, maps, dependencies, networks. The Odoo assessment reportedly includes unweighted shortest path problems.

### D.2 Graph Representations

**Adjacency Matrix:**
A 2D array `matrix[i][j]` where `matrix[i][j] = 1` (or weight) if there is an edge from i to j, else 0.

- **Pros:** O(1) edge lookup. Simple for dense graphs.
- **Cons:** O(V²) space. Wasteful for sparse graphs (most real-world graphs are sparse).

```python
# 4 nodes: 0, 1, 2, 3
# Edges: (0,1), (0,2), (1,3), (2,3)
matrix = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0]
]
```

**Adjacency List:**
A dictionary/map where each vertex points to a list of its neighbors.

- **Pros:** O(V + E) space. Efficient for sparse graphs. Natural for traversal.
- **Cons:** Edge lookup is O(degree) instead of O(1).

```python
# Build from edge list
edges = [[0, 1], [0, 2], [1, 3], [2, 3]]
graph = {}
for u, v in edges:
    graph.setdefault(u, []).append(v)
    graph.setdefault(v, []).append(u)  # undirected

# Result: {0: [1, 2], 1: [0, 3], 2: [0, 3], 3: [1, 2]}
```

**For coding assessments, always use adjacency lists.** They are more memory-efficient and easier to iterate.

### D.3 Breadth-First Search (BFS) — The Math & Proof

**The concept:** BFS explores a graph level by level. Starting from a source vertex, it visits all vertices at distance 1, then all at distance 2, then distance 3, etc.

**Algorithm:**
1. Initialize a queue with the source vertex and mark it visited.
2. While the queue is not empty:
   a. Dequeue a vertex u.
   b. For each neighbor v of u:
      - If v is not visited, mark it visited, record its distance (distance[u] + 1), and enqueue it.

**Why a queue?** A queue is FIFO. This ensures that vertices discovered earlier (closer to the source) are processed before vertices discovered later (farther away).

**The Proof (Why BFS finds shortest paths in unweighted graphs):**

**Theorem:** In an unweighted graph, BFS from source s computes the shortest path distance from s to every reachable vertex.

**Proof by induction on distance:**

*Base case:* The source s is at distance 0. BFS initializes with s in the queue. Correct.

*Inductive hypothesis:* Assume BFS correctly computes distances for all vertices at distance ≤ k from s.

*Inductive step:* Consider a vertex v at distance k+1 from s. By definition, there exists a vertex u at distance k such that (u, v) is an edge. By the inductive hypothesis, u is dequeued before any vertex at distance > k. When u is processed, v is discovered and assigned distance k+1. No shorter path to v can exist because any path to v must pass through a vertex at distance k, and we've already found the shortest paths to all such vertices.

*Conclusion:* By induction, BFS computes correct shortest path distances for all vertices.

**Time Complexity:** O(V + E).
- Each vertex is enqueued and dequeued at most once: O(V).
- Each edge is examined exactly once (twice in undirected graphs): O(E).

**Space Complexity:** O(V) for the visited set and queue.

```python
from collections import deque

def bfs_shortest_path(graph, start, end):
    """
    graph: dict mapping node -> list of neighbors
    start: starting node
    end: target node
    Returns: shortest path length (number of edges), or -1 if unreachable.
    """
    if start == end:
        return 0

    visited = set([start])
    queue = deque([(start, 0)])  # (current_node, distance_from_start)

    while queue:
        node, dist = queue.popleft()

        for neighbor in graph.get(node, []):
            if neighbor == end:
                return dist + 1
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))

    return -1  # No path exists
```

**Trace:** Graph: {0: [1, 2], 1: [3], 2: [3], 3: []}. Start=0, End=3.
- Queue: [(0, 0)]. Visited: {0}.
- Dequeue (0, 0). Neighbors: 1, 2.
  - 1 not visited → enqueue (1, 1). Visited: {0, 1}.
  - 2 not visited → enqueue (2, 1). Visited: {0, 1, 2}.
- Queue: [(1, 1), (2, 1)].
- Dequeue (1, 1). Neighbors: 3.
  - 3 == end! Return 1 + 1 = 2.

### D.4 Why BFS and Not DFS for Shortest Path?

**DFS (Depth-First Search)** explores as deep as possible along one branch before backtracking.

**DFS Algorithm:**
1. Mark current vertex as visited.
2. For each unvisited neighbor, recursively call DFS.

**Why DFS doesn't guarantee shortest path:**
DFS might find a path 0 → 1 → 3 (length 2) or 0 → 2 → 3 (length 2) in our example, but in a larger graph, it could find 0 → 1 → 4 → 5 → 3 (length 4) before discovering the direct 0 → 2 → 3 (length 2). DFS has no concept of "levels" — it just goes deep.

**When to use DFS:**
- Detecting cycles.
- Topological sorting.
- Finding connected components.
- Problems where any path is sufficient (not necessarily shortest).
- Maze solving (if you just need to know if a path exists).

**When to use BFS:**
- Shortest path in unweighted graphs.
- Finding the minimum number of steps.
- Level-order traversal (trees).

### D.5 DFS Implementation (for completeness)

```python
# Recursive DFS
def dfs_recursive(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)
    return visited

# Iterative DFS (uses a stack instead of recursion)
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            # Push neighbors in reverse order to maintain exploration order
            for neighbor in reversed(graph.get(node, [])):
                if neighbor not in visited:
                    stack.append(neighbor)
    return visited
```

### D.6 Common Graph Problem Patterns

**Pattern 1: Shortest Path in a Grid**
Many problems present a 2D grid where you can move in 4 or 8 directions. Each cell is a node; adjacent cells are edges.

```python
from collections import deque

def shortest_path_binary_matrix(grid):
    """
    Find shortest clear path from top-left to bottom-right.
    0 = clear, 1 = blocked. Can move in 8 directions.
    """
    n = len(grid)
    if grid[0][0] == 1 or grid[n-1][n-1] == 1:
        return -1

    directions = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
    queue = deque([(0, 0, 1)])  # (row, col, distance)
    grid[0][0] = 1  # mark visited by blocking

    while queue:
        r, c, dist = queue.popleft()
        if r == n-1 and c == n-1:
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                grid[nr][nc] = 1  # mark visited immediately
                queue.append((nr, nc, dist + 1))

    return -1
```

**Why mark visited immediately?** If you wait until dequeuing, the same cell might be enqueued multiple times from different neighbors, wasting time and memory.

**Pattern 2: Multi-Source BFS**
When multiple starting points exist (e.g., multiple rotten oranges), enqueue all sources simultaneously.

```python
from collections import deque

def oranges_rotting(grid):
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
```

---

## Chapter E: Stack & Queue Mastery

### E.1 The Stack Abstract Data Type

A **stack** is an ordered collection of items where addition and removal happen at the same end, called the **top**.

**Operations:**
- `push(item)`: Add item to top. O(1).
- `pop()`: Remove and return top item. O(1).
- `peek()` / `top()`: Return top item without removing. O(1).
- `is_empty()`: Check if stack has items. O(1).

**The LIFO principle:** Last item pushed is the first item popped. This makes stacks ideal for:
- Reversing things (input order is reversed on output).
- Tracking nested structures (the most recent opening must be closed first).
- Undo mechanisms (most recent action is undone first).
- Expression evaluation (postfix notation).

**Python implementation:**
```python
stack = []
stack.append(10)    # push
stack.append(20)
top = stack[-1]     # peek
stack.pop()         # pop -> 20
```

### E.2 Parentheses & Tag Matching (Formal Grammar)

**The concept:** Balanced parentheses form a context-free language. The grammar is:
- S → (S) | [S] | {S} | SS | ε

This means a valid string is either empty, a pair of brackets containing another valid string, or two valid strings concatenated.

**Why a stack recognizes this grammar:**
Every opening bracket generates a "pending" requirement that must be satisfied by a matching closing bracket. The most recent pending requirement must be satisfied first — LIFO.

```python
def is_valid_parentheses(s: str) -> bool:
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
```

**Edge cases:**
- `"("` → stack not empty at end → False.
- `")"` → stack empty when encountering closing → False.
- `""` → empty stack at end → True.

### E.3 Evaluating Expressions (RPN & Infix)

**Infix notation:** Operators are between operands. `3 + 4 * 2`. Requires parentheses and precedence rules.

**Postfix (Reverse Polish Notation):** Operators follow operands. `3 4 2 * +`. No parentheses needed. The order is unambiguous.

**Why postfix is stack-friendly:**
When you see a number, you don't know what to do with it yet — save it. When you see an operator, you apply it to the two most recent numbers.

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
                # Integer division truncating toward zero
                stack.append(int(a / b))

    return stack[0]
```

**Critical pitfall:** Python's `//` does floor division (truncates toward negative infinity). For RPN problems, `int(a / b)` truncates toward zero, matching C/Java behavior.

Example: `-3 / 2`:
- `int(-3 / 2)` → `-1` (correct for RPN).
- `-3 // 2` → `-2` (wrong for RPN).

### E.4 Monotonic Stacks

**The concept:** A monotonic stack maintains elements in either increasing or decreasing order. When a new element violates the order, elements are popped until the order is restored.

**When to use:** Finding the next greater element, previous greater element, or largest rectangle in histogram.

```python
def daily_temperatures(temps: list[int]) -> list[int]:
    """
    For each day, find days until a warmer temperature.
    """
    n = len(temps)
    result = [0] * n
    stack = []  # stores indices with decreasing temperatures

    for i in range(n):
        while stack and temps[i] > temps[stack[-1]]:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx
        stack.append(i)

    return result
```

**How it works:**
- The stack maintains indices where temperatures are in decreasing order.
- When we encounter a warmer temperature, it "resolves" all previous cooler days.
- Each index is pushed once and popped once → O(n) total.

### E.5 Queue & BFS Connection

**Why BFS uses a queue:**
BFS explores vertices in order of their distance from the source. A queue ensures FIFO behavior: vertices discovered earlier (closer to source) are processed before vertices discovered later (farther from source).

**Python queue implementation:**
```python
from collections import deque

queue = deque()
queue.append(item)      # enqueue (O(1))
item = queue.popleft()  # dequeue (O(1))
front = queue[0]        # peek (O(1))
```

**Never use `list.pop(0)` for queues.** It is O(n) because all elements must shift left. `deque.popleft()` is O(1).

---

## Chapter F: Arrays & Two Pointers

### F.1 Array Memory Layout

An array is a contiguous block of memory. In Python, `list` is a dynamic array with O(1) index access because the interpreter can calculate the exact memory address: `address = base_address + index * element_size`.

**Implications:**
- Access by index: O(1).
- Append to end: O(1) amortized.
- Insert/delete at front or middle: O(n) because elements must shift.

### F.2 In-Place Modification Techniques

**The concept:** Many problems ask you to modify the array without allocating extra space (O(1) extra space). This is done by overwriting the input array as you scan it.

**The read-write pattern:**
- `read` pointer scans the entire array.
- `write` pointer tracks where the next valid element should go.
- When `read` finds something valid, it copies to `write` position, and `write` advances.

```python
def remove_element(nums: list[int], val: int) -> int:
    write = 0
    for read in range(len(nums)):
        if nums[read] != val:
            nums[write] = nums[read]
            write += 1
    return write
```

**Why this works:** The `write` pointer is always ≤ `read` pointer, so we never overwrite data we haven't processed yet.

### F.3 The Sliding Window Family

**The concept:** A subarray (window) slides over the array. Instead of recalculating from scratch for each window, update the result by adding the new element and removing the old one.

**Fixed-size window:**
```python
def max_sum_subarray(nums: list[int], k: int) -> int:
    if not nums or k > len(nums):
        return 0

    window_sum = sum(nums[:k])
    max_sum = window_sum

    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum
```

**Variable-size window (expand and contract):**
Used when the condition is not about fixed size but about a property (e.g., sum ≤ target, all unique characters).

```python
def length_of_longest_substring(s: str) -> int:
    """Longest substring without repeating characters."""
    char_set = set()
    left = 0
    max_len = 0

    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)

    return max_len
```

**How it works:**
- `right` expands the window, adding new characters.
- If a duplicate is found, `left` contracts the window until the duplicate is removed.
- Both pointers only move forward → O(n) total.

### F.4 Prefix Sums & Difference Arrays

**Prefix sum:** An array where `prefix[i]` is the sum of all elements from index 0 to i.
- Use case: Range sum queries in O(1) after O(n) preprocessing.

```python
def build_prefix(nums: list[int]) -> list[int]:
    prefix = [0] * (len(nums) + 1)
    for i in range(len(nums)):
        prefix[i + 1] = prefix[i] + nums[i]
    return prefix

# Sum of nums[i:j] = prefix[j] - prefix[i]
```

**Difference array:** For range updates (add `val` to all elements from index `l` to `r`).
- `diff[l] += val`, `diff[r+1] -= val`.
- Reconstruct by taking prefix sum of diff.

```python
def range_add(diff: list[int], l: int, r: int, val: int):
    diff[l] += val
    if r + 1 < len(diff):
        diff[r + 1] -= val
```

---

## Chapter G: Math, Logic & Number Theory

### G.1 Integer Properties & Digit Manipulation

**Extracting digits:** Use modulo 10 to get the last digit, integer division by 10 to remove it.

```python
n = 12345

last_digit = n % 10      # 5
remaining = n // 10      # 1234

# Count digits
count = 0
temp = n
while temp > 0:
    temp //= 10
    count += 1

# Alternative: count = len(str(n))  (simpler but string conversion overhead)
```

**Reversing digits (mathematical approach):**
```python
import math

def reverse(x: int) -> int:
    INT_MIN, INT_MAX = -2**31, 2**31 - 1
    result = 0

    while x != 0:
        # Python's % behaves differently for negatives
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
```

**Why `math.fmod`?** Python's `%` returns a result with the same sign as the divisor (always positive for `% 10`). `math.fmod(x, 10)` preserves the sign of `x`, matching C/Java behavior.

### G.2 Prime Numbers & The Sieve

**Definition:** A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

**Naive check:** Test divisibility by all numbers from 2 to n-1. O(n).

**Optimized check:** Test only up to √n. If n has a factor greater than √n, the complementary factor must be less than √n.

```python
import math

def is_prime(n: int) -> bool:
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False

    for i in range(3, int(math.sqrt(n)) + 1, 2):
        if n % i == 0:
            return False
    return True
```

**Sieve of Eratosthenes:**
To find all primes up to n, iteratively mark multiples of each prime starting from 2.

```python
def count_primes(n: int) -> int:
    if n <= 2:
        return 0

    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False

    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            # Start at i*i because smaller multiples are already marked
            for j in range(i * i, n, i):
                is_prime[j] = False

    return sum(is_prime)
```

**Why start at `i*i`?** All multiples of `i` less than `i*i` (i.e., `i*2`, `i*3`, ..., `i*(i-1)`) have already been marked by smaller primes.

**Complexity:** O(n log log n) time, O(n) space.

### G.3 GCD, LCM & The Euclidean Algorithm

**GCD (Greatest Common Divisor):** The largest number that divides both a and b.

**Euclidean Algorithm:** Based on the principle that `gcd(a, b) = gcd(b, a % b)`. The remainder decreases rapidly, guaranteeing termination.

**Proof of correctness:**
Let `d = gcd(a, b)`. Then `d` divides both `a` and `b`, so `d` divides `a - qb` for any integer `q`. In particular, `d` divides `a % b` (since `a % b = a - q*b` where `q = a // b`). Thus `d` is a common divisor of `b` and `a % b`. Conversely, any common divisor of `b` and `a % b` also divides `a`. Therefore the common divisors are identical, and so are the greatest common divisors.

```python
def gcd(a: int, b: int) -> int:
    while b:
        a, b = b, a % b
    return a

def lcm(a: int, b: int) -> int:
    return abs(a * b) // gcd(a, b)
```

**Python built-in:** `math.gcd(a, b)` (Python 3.5+).

### G.4 Modular Arithmetic

**The concept:** `(a + b) % m = ((a % m) + (b % m)) % m`. Same for subtraction and multiplication.

**Why useful:** Prevents integer overflow and is used in hashing, cryptography, and cyclic problems.

```python
# Fast modular exponentiation (a^b % mod)
def mod_pow(a: int, b: int, mod: int) -> int:
    result = 1
    a = a % mod
    while b > 0:
        if b % 2 == 1:
            result = (result * a) % mod
        a = (a * a) % mod
        b //= 2
    return result
```

### G.5 Bit Manipulation Basics

**Operators:**
- `&` (AND): Both bits must be 1.
- `|` (OR): At least one bit is 1.
- `^` (XOR): Exactly one bit is 1.
- `~` (NOT): Inverts all bits.
- `<<` (Left shift): Multiply by 2.
- `>>` (Right shift): Integer divide by 2.

**Common tricks:**
```python
# Check if n is power of 2
# Binary: 8 = 1000, 7 = 0111. 8 & 7 = 0.
def is_power_of_two(n: int) -> bool:
    return n > 0 and (n & (n - 1)) == 0

# Get lowest set bit
lowest = n & (-n)

# Count set bits (Hamming weight)
def count_bits(n: int) -> int:
    count = 0
    while n:
        n &= n - 1  # clears lowest set bit
        count += 1
    return count
```

### G.6 Floyd's Cycle Detection

**The concept:** Detect cycles in a sequence (linked list, iterated function) using two pointers moving at different speeds.

**Algorithm:**
- `slow` moves 1 step at a time.
- `fast` moves 2 steps at a time.
- If there is a cycle, `fast` will eventually meet `slow`.
- If no cycle, `fast` reaches the end.

**Why it works:** If there is a cycle, consider the moment `slow` enters it. `fast` is already in the cycle. The distance between them decreases by 1 each step (since fast gains 1 step per iteration). Eventually the distance becomes 0.

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
```

---

## Chapter H: Python for Timed Tests

### H.1 Writing Fast Python

**List comprehensions vs. loops:**
```python
# Fast and pythonic
squares = [x*x for x in range(1000)]

# Slower, more verbose
squares = []
for x in range(1000):
    squares.append(x*x)
```

**Generator expressions for memory efficiency:**
```python
# If you only need to iterate once
sum(x*x for x in range(1000000))  # no list created
```

**String building:**
```python
# Fast
result = "".join([str(x) for x in items])

# Slow (quadratic)
result = ""
for x in items:
    result += str(x)
```

### H.2 Essential Standard Library Tools

```python
from collections import deque, Counter, defaultdict, OrderedDict
from itertools import permutations, combinations, accumulate
from heapq import heappush, heappop, heapify
from bisect import bisect_left, bisect_right
from math import sqrt, gcd, ceil, floor, inf

# Counter: frequency counting
Counter([1,1,2,3,1])  # Counter({1: 3, 2: 1, 3: 1})

# defaultdict: auto-creates default values
graph = defaultdict(list)
graph[0].append(1)  # no KeyError

# deque: O(1) pops from both ends
queue = deque([1,2,3])
queue.appendleft(0)
queue.popleft()

# heapq: min-heap
heap = [3,1,4]
heapify(heap)
heappush(heap, 2)
min_val = heappop(heap)
```

### H.3 Common Python Pitfalls in Assessments

**Pitfall 1: Shallow copy vs. deep copy**
```python
# Wrong: all rows reference the same list
matrix = [[0] * 3] * 3
matrix[0][0] = 1  # matrix becomes [[1,0,0],[1,0,0],[1,0,0]]

# Correct: each row is independent
matrix = [[0] * 3 for _ in range(3)]
```

**Pitfall 2: Mutable default arguments**
```python
# Wrong
def append(item, lst=[]):
    lst.append(item)
    return lst

# Correct
def append(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst
```

**Pitfall 3: Integer division confusion**
```python
# Python 3: / is float division, // is floor division
5 / 2    # 2.5
5 // 2   # 2
-3 // 2  # -2 (floor division!)
int(-3 / 2)  # -1 (truncates toward zero)
```

**Pitfall 4: Modifying a dict while iterating**
```python
# Wrong: RuntimeError
for k in d:
    if condition:
        del d[k]

# Correct: iterate over a snapshot
for k in list(d.keys()):
    if condition:
        del d[k]
```

---

## Chapter I: Mock Assessment Walkthroughs

### I.1 Mock Problem 1: String + Stack

**Problem:** Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

**R.A.P.I.D. Analysis:**
- **R**ead: Input is a string of brackets. Output is boolean.
- **A**nalyze: "()" → True. "()[]{}" → True. "(]" → False. "([)]" → False. "{[]}" → True.
- **P**attern: Nested matching → Stack (LIFO).
- **I**mplement: Push opening brackets. On closing bracket, check match with top of stack.
- **D**ebug: Empty string → True. Single bracket → False. Very long string → O(n) is fine.

**Solution:**
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
```

**Complexity:** Time O(n), Space O(n).

**Follow-up question (interview):** What if you can only use O(1) space?
- **Hint:** You can't use a stack, but you can use a counter for single bracket types. For multiple types, you need a stack.

---

### I.2 Mock Problem 2: SQL Design + Query

**Problem:** Design a database for a simple library system with books, members, and loans. Then write a query to find all members who have currently borrowed more than 3 books.

**Schema Design:**
```sql
CREATE TABLE members (
    member_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100),
    isbn VARCHAR(13) UNIQUE
);

CREATE TABLE loans (
    loan_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    book_id INT NOT NULL,
    loan_date DATE NOT NULL,
    return_date DATE,
    FOREIGN KEY (member_id) REFERENCES members(member_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);
```

**Query:**
```sql
SELECT m.name, COUNT(*) AS active_loans
FROM members m
INNER JOIN loans l ON m.member_id = l.member_id
WHERE l.return_date IS NULL
GROUP BY m.member_id, m.name
HAVING COUNT(*) > 3;
```

**Explanation:**
- `WHERE l.return_date IS NULL` filters to currently borrowed books.
- `GROUP BY` aggregates per member.
- `HAVING` filters groups (not rows) after aggregation.
- We include `m.name` in GROUP BY because some SQL modes require all selected non-aggregated columns to be in GROUP BY.

---

### I.3 Mock Problem 3: Graph BFS

**Problem:** You are given an undirected graph with n nodes, labeled 0 to n-1, and a list of edges. Find the shortest path length from node 0 to node n-1. If no path exists, return -1.

**R.A.P.I.D. Analysis:**
- **R**ead: Graph, unweighted, undirected. Find shortest path length.
- **A**nalyze: Example: n=4, edges=[[0,1],[1,2],[0,2],[2,3]]. Path 0→2→3 has length 2.
- **P**attern: Shortest path in unweighted graph → BFS.
- **I**mplement: Build adjacency list, BFS from 0, return distance when reaching n-1.
- **D**ebug: n=1 (start=end) → 0. No edges → -1. Disconnected graph → -1.

**Solution:**
```python
from collections import deque

def shortest_path(n: int, edges: list[list[int]]) -> int:
    if n == 1:
        return 0

    # Build adjacency list
    graph = {i: [] for i in range(n)}
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = set([0])
    queue = deque([(0, 0)])  # (node, distance)

    while queue:
        node, dist = queue.popleft()
        for neighbor in graph[node]:
            if neighbor == n - 1:
                return dist + 1
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))

    return -1
```

**Complexity:** Time O(V + E), Space O(V).

**Why not DFS?** DFS might find a longer path first and has no mechanism to know if a shorter one exists. BFS explores by distance layers, guaranteeing the first found path is shortest.

---

### I.4 Mock Problem 4: Array Two-Pointer

**Problem:** Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.

**R.A.P.I.D. Analysis:**
- **R**ead: Array, target. Return indices.
- **A**nalyze: nums=[2,7,11,15], target=9 → [0,1].
- **P**attern: Finding pairs with a sum → Hash set for O(n), or two-pointer if sorted (but returning indices complicates sorting).
- **I**mplement: Hash map storing value → index. For each num, check if complement exists in map.
- **D**ebug: Two identical numbers that sum to target (e.g., [3,3], target=6) → map handles this because we check before inserting.

**Solution:**
```python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # should never reach here per problem statement
```

**Complexity:** Time O(n), Space O(n).

**Why not two-pointer here?** If we sort, we lose original indices. We would need to track indices with tuples, making the code more complex. The hash map approach is cleaner for this variant.

---

## Appendix: The 60-Minute Cheat Sheet

### Python String Methods
```
s.strip(), s.split(), s.join(), s.replace(), s.find(), s.count()
s.startswith(), s.endswith(), s.isdigit(), s.isalpha(), s.isalnum()
s[::-1]  # reverse
```

### Collections
```python
from collections import deque, Counter, defaultdict
# deque: appendleft, popleft, pop, append
# Counter: most_common, elements
# defaultdict(list): auto-creates empty lists
```

### SQL Patterns
```sql
SELECT ... FROM ... JOIN ... ON ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT
-- INNER JOIN: matching rows only
-- LEFT JOIN: all left rows, NULL for missing right
-- RANK() OVER (PARTITION BY ... ORDER BY ...)
-- Aggregate: COUNT, SUM, AVG, MAX, MIN
```

### Graph Templates
```python
# Adjacency list
graph = {}
for u, v in edges:
    graph.setdefault(u, []).append(v)

# BFS
queue = deque([(start, 0)])
visited = set([start])
while queue:
    node, dist = queue.popleft()
    for neighbor in graph.get(node, []):
        if neighbor not in visited:
            visited.add(neighbor)
            queue.append((neighbor, dist + 1))

# DFS recursive
def dfs(node, visited):
    visited.add(node)
    for nbr in graph.get(node, []):
        if nbr not in visited:
            dfs(nbr, visited)
```

### Stack & Queue
```python
# Stack (LIFO)
stack = []
stack.append(x)   # push
x = stack[-1]     # peek
x = stack.pop()   # pop

# Queue (FIFO)
from collections import deque
queue = deque()
queue.append(x)   # enqueue
x = queue[0]      # peek
x = queue.popleft()  # dequeue

# Monotonic stack
while stack and condition:
    stack.pop()
stack.append(x)
```

### Two Pointers
```python
# Opposite
left, right = 0, len(arr) - 1
while left < right:
    # ...
    left += 1
    right -= 1

# Same-direction
write = 0
for read in range(len(arr)):
    if valid(arr[read]):
        arr[write] = arr[read]
        write += 1

# Sliding window
window_sum += new_val - old_val
max_sum = max(max_sum, window_sum)
```

### Math Snippets
```python
# Reverse digits
result = result * 10 + digit

# Prime check
for i in range(2, int(sqrt(n)) + 1):
    if n % i == 0: return False

# GCD
def gcd(a, b):
    while b: a, b = b, a % b
    return a

# Power of two
n > 0 and (n & (n - 1)) == 0

# Modular arithmetic
(a + b) % m = ((a % m) + (b % m)) % m
```

### Big-O Quick Reference
| n limit | Acceptable complexity |
|---------|----------------------|
| ≤ 20 | O(2^n), O(n!) |
| ≤ 1,000 | O(n^2) |
| ≤ 100,000 | O(n log n), O(n) |
| ≤ 10^6 | O(n), O(n log n) |
| ≤ 10^7 | O(n) |

---

**Final Advice:**

1. **Start with the easiest problem.** Build momentum.
2. **Write brute force if stuck.** A working slow solution is better than a broken fast one.
3. **Explain your code to yourself.** If you can't explain it, the interviewer will catch you.
4. **Test edge cases mentally.** Empty input, single element, all same elements, maximum values.
5. **Keep calm.** You have prepared. Trust the process.

Good luck.
