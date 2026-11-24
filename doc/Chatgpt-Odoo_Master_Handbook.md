
# Odoo Developer Assessment Master Handbook
## Tailored for an Experienced Rust / Backend Developer

---

# Table of Contents

1. What Odoo Is Probably Testing
2. Assessment Strategy
3. SQL Mastery
4. SQL Patterns
5. SQL Practice Problems
6. Big-O Complexity
7. Arrays
8. Hash Maps & Sets
9. Common Interview Patterns
10. Graphs
11. BFS Deep Dive
12. Grid BFS
13. Recognizing Problems Quickly
14. Rust Templates
15. Full Mock Assessment
16. Final Revision Sheet

---

# 1. What Odoo Is Probably Testing

Based on many public candidate reports, the assessment tends to focus on:

- SQL
- Array manipulation
- HashMap/HashSet usage
- BFS / shortest path problems

It is generally not focused on:

- Blockchain
- Solana
- NestJS
- React
- System Design
- Distributed systems
- Cryptography

This is important because your biggest risk is not lacking knowledge.

Your biggest risk is overthinking a problem that actually has a simple solution.

---

# 2. Assessment Strategy

## First 5 Minutes

Read every question.

Do not start coding immediately.

Identify:

- Easy
- Medium
- Hard

---

## Next 40 Minutes

Complete:

1. SQL
2. Array/HashMap

first.

These usually provide the highest score per minute invested.

---

## Last 15 Minutes

Attack the graph problem.

Even a partially working BFS solution may score points.

---

# 3. SQL Mastery

The most valuable SQL topics:

```sql
SELECT
FROM
WHERE
JOIN
LEFT JOIN
GROUP BY
HAVING
ORDER BY
LIMIT
COUNT
SUM
AVG
```

If you know these deeply, you're prepared for most screening SQL questions.

---

# 4. Understanding GROUP BY

Suppose:

```text
orders

id | user_id | amount
---------------------
1  | 1       | 100
2  | 1       | 50
3  | 2       | 20
```

Question:

How much has each user spent?

```sql
SELECT user_id, SUM(amount)
FROM orders
GROUP BY user_id;
```

Result:

```text
1 -> 150
2 -> 20
```

GROUP BY creates buckets.

Aggregate functions operate on each bucket.

---

# 5. WHERE vs HAVING

This is one of the most common mistakes.

## WHERE

Filters rows BEFORE grouping.

```sql
SELECT *
FROM orders
WHERE amount > 50;
```

---

## HAVING

Filters groups AFTER grouping.

```sql
SELECT user_id, COUNT(*)
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 10;
```

Rule:

If aggregate functions appear in the condition,
HAVING is usually required.

---

# 6. JOINs

Suppose:

```text
users

id | name
---------
1  | Alice
2  | Bob
```

```text
orders

id | user_id
------------
1  | 1
2  | 1
```

---

## INNER JOIN

```sql
SELECT *
FROM users u
JOIN orders o
ON u.id = o.user_id;
```

Returns only matches.

---

## LEFT JOIN

```sql
SELECT *
FROM users u
LEFT JOIN orders o
ON u.id = o.user_id;
```

Returns ALL users.

Even users with no orders.

---

# 7. Famous SQL Interview Problem

Find users who never ordered.

```sql
SELECT u.id
FROM users u
LEFT JOIN orders o
ON u.id = o.user_id
WHERE o.id IS NULL;
```

This appears constantly in interviews.

Memorize it.

---

# 8. Top-N Problems

Find top 5 customers by spending.

```sql
SELECT user_id, SUM(amount) total
FROM orders
GROUP BY user_id
ORDER BY total DESC
LIMIT 5;
```

Pattern:

```text
GROUP BY
Aggregate
ORDER BY DESC
LIMIT
```

---

# 9. Big-O Complexity

Know these instantly.

| Operation | Complexity |
|------------|------------|
| Array index | O(1) |
| HashMap lookup | O(1) average |
| Linear search | O(n) |
| Sort | O(n log n) |
| BFS | O(V + E) |

---

# 10. Arrays

Array questions often look different.

But most belong to a few patterns.

### Pattern 1

Frequency counting

### Pattern 2

Duplicate detection

### Pattern 3

Two Sum

### Pattern 4

Sorting then scanning

---

# 11. Hash Maps

A HashMap stores:

```text
key -> value
```

Example:

```text
1 -> 3
5 -> 2
7 -> 9
```

Use when:

- counting
- grouping
- fast lookup

---

# 12. Frequency Counting

Input:

```text
[1,1,1,2,3,3]
```

Output:

```text
1 -> 3
2 -> 1
3 -> 2
```

Rust:

```rust
use std::collections::HashMap;

let mut freq = HashMap::new();

for x in nums {
    *freq.entry(x).or_insert(0) += 1;
}
```

Memorize this.

---

# 13. Two Sum

Input:

```text
nums = [2,7,11,15]
target = 9
```

Output:

```text
[0,1]
```

Brute force:

```text
O(n²)
```

HashMap:

```text
O(n)
```

Core idea:

For every value x,

check if target - x already exists.

---

# 14. Hash Sets

Use when only existence matters.

```rust
HashSet<T>
```

Example:

Detect duplicates.

```rust
if set.contains(&x) {
    return true;
}
```

---

# 15. Graphs

A graph consists of:

- Nodes
- Edges

Examples:

- Cities
- Social networks
- Roads
- Grid cells

---

# 16. BFS Deep Dive

Breadth First Search explores:

```text
distance 0
distance 1
distance 2
distance 3
...
```

level by level.

This is why it finds shortest paths.

---

# 17. BFS Visualization

```text
A
| \
B  C
|   \
D    E
 \  /
  F
```

BFS order:

```text
A
B C
D E
F
```

---

# 18. BFS Template

Rust:

```rust
use std::collections::{VecDeque, HashSet};

let mut q = VecDeque::new();
let mut visited = HashSet::new();

q.push_back(start);
visited.insert(start);

while let Some(node) = q.pop_front() {

    for next in graph[node].iter() {

        if !visited.contains(next) {

            visited.insert(*next);
            q.push_back(*next);
        }
    }
}
```

---

# 19. Shortest Path BFS

Store distance.

```rust
dist[next] = dist[current] + 1;
```

The first time BFS reaches a node:

it has found the shortest path.

---

# 20. Grid BFS

Interviewers love disguising graphs.

Example:

```text
S . .
# # .
. . E
```

Each cell becomes a node.

Possible moves:

```text
up
down
left
right
```

Run BFS.

---

# 21. Keywords That Mean BFS

If you see:

- shortest path
- minimum moves
- minimum jumps
- nearest target
- fewest operations

Think:

```text
BFS
```

immediately.

---

# 22. Rust Advice

You already know Rust.

Don't try to impress.

Interview code should be:

- simple
- readable
- correct

Preferred:

```rust
Vec
VecDeque
HashMap
HashSet
```

Avoid fancy abstractions.

---

# 23. Mock Assessment

## Question 1

Tables:

```text
employees(id, department_id)
departments(id, name)
```

Return departments with more than 5 employees.

Concepts:

```text
JOIN
GROUP BY
COUNT
HAVING
```

---

## Question 2

Input:

```text
[1,2,3,4,2]
```

Return first duplicate.

Concepts:

```text
HashSet
```

---

## Question 3

Grid:

```text
S..
##.
..E
```

Find shortest path.

Concepts:

```text
BFS
Queue
Visited
```

---

# 24. Pattern Recognition Cheat Sheet

| If you see | Think |
|------------|--------|
| Count occurrences | HashMap |
| Duplicate detection | HashSet |
| Pair sums | HashMap |
| Top N groups | GROUP BY |
| No matching rows | LEFT JOIN + NULL |
| Shortest path | BFS |
| Minimum moves | BFS |
| Reachability | BFS/DFS |

---

# 25. Final 15-Minute Revision

Memorize:

### SQL

- JOIN
- LEFT JOIN
- GROUP BY
- HAVING
- ORDER BY
- LIMIT

### HashMap

```rust
entry().or_insert()
```

### HashSet

Duplicate detection.

### BFS

Queue + Visited.

### Complexity

```text
O(1)
O(n)
O(n log n)
O(V + E)
```

If candidate reports are accurate, mastering the material in this document should cover the overwhelming majority of concepts likely to appear in the assessment.
