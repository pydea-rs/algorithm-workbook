# SQL JOINs — the real mental model

The Venn-diagram explanation you've seen everywhere ("INNER is the intersection, OUTER is the union") is *wrong in a specific way that bites people*. Here's the actual model.

## The real mental model: filtered Cartesian product

A JOIN starts from the **Cartesian product** of two tables — every row from A paired with every row from B. Then it throws rows away based on a condition.

```
Customers           Orders                Cartesian product (3 × 2 = 6 rows)
─────────────       ────────────          ─────────────────────────────────
id   name           id   c_id             c.id  c.name   o.id  o.c_id
1    Alice          10   1                1     Alice    10    1
2    Bob            11   3                1     Alice    11    3
3    Carol                                2     Bob      10    1
                                          2     Bob      11    3
                                          3     Carol    10    1
                                          3     Carol    11    3
```

`INNER JOIN ON c.id = o.c_id` keeps only the rows where the condition is true:

```
c.id  c.name   o.id  o.c_id
1     Alice    10    1       ← kept (1 = 1)
3     Carol    11    3       ← kept (3 = 3)
```

That's *literally* what the engine computes, conceptually. The query planner is smart enough to avoid materializing the full product (it uses hash joins, merge joins, nested loops with indexes), but the **semantics** are: pair everything, then filter.

Once you internalize this, every JOIN variant just becomes "what do I do with the rows that have no match on the other side?"

---

## INNER JOIN — drop unmatched rows

```sql
SELECT c.name, o.id
FROM Customers c
INNER JOIN Orders o ON c.id = o.c_id;
```

Unmatched rows on **either side** are dropped. Alice (matched), Carol (matched). Bob has no order — gone. Order 11 has c_id=3 → matches Carol. There's no order with c_id=2, so Bob is silent here.

**`INNER` is the default.** `JOIN` and `INNER JOIN` mean exactly the same thing. Use whichever style your codebase uses.

**Performance fact worth knowing**: INNER JOIN is the join the planner can rearrange most freely. It's commutative (`A JOIN B = B JOIN A`) and associative (`(A JOIN B) JOIN C = A JOIN (B JOIN C)`), so the planner picks whatever join order is cheapest. OUTER joins constrain that freedom, which is one reason they're sometimes slower than the INNER equivalent.

---

## LEFT JOIN — keep all left, pad right with NULL

```sql
SELECT c.name, o.id AS order_id
FROM Customers c
LEFT JOIN Orders o ON c.id = o.c_id;
```

```
name    order_id
Alice   10
Bob     NULL       ← Bob kept; right side padded
Carol   11
```

The left table is **anchored**: every row from `Customers` appears in the output. If a customer has matching orders, you get one output row per match. If they have none, you get one row with NULLs in the right-side columns.

**The anti-join pattern (Q24 in the bank)**: *"customers with no orders"*. Use LEFT JOIN then filter for the NULL — that's the row where no match was found:

```sql
SELECT c.name
FROM Customers c
LEFT JOIN Orders o ON c.id = o.c_id
WHERE o.id IS NULL;     -- ← only customers whose right side was padded
```

The `WHERE o.id IS NULL` only matches the rows the LEFT JOIN created to "fill in" missing customers. Genius little pattern.

**Subtlety that confuses people**: a customer with two orders becomes **two rows** in the output. LEFT JOIN doesn't deduplicate. If you do `SELECT COUNT(*) FROM customers LEFT JOIN orders ON ...`, you're counting customer-order pairs, not customers. To count customers with at least one order:

```sql
SELECT COUNT(DISTINCT c.id) ...
-- or
SELECT c.id FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.c_id = c.id);
```

**Watch where you put filters** on a LEFT JOIN — putting a condition on the right table in `WHERE` accidentally turns it back into an INNER JOIN:

```sql
-- This LOOKS like LEFT JOIN, but actually inner-joins:
SELECT c.name, o.amount
FROM Customers c
LEFT JOIN Orders o ON c.id = o.c_id
WHERE o.amount > 100;       -- ← drops Bob! his o.amount is NULL, fails > 100

-- This keeps Bob:
SELECT c.name, o.amount
FROM Customers c
LEFT JOIN Orders o
  ON c.id = o.c_id
  AND o.amount > 100;       -- ← move the filter into ON
```

Filters in `WHERE` apply *after* the join. Filters in `ON` apply *during* the join. For LEFT JOIN, the difference is everything. This is one of the top SQL bugs in production codebases.

---

## RIGHT JOIN — exact mirror of LEFT

```sql
SELECT c.name, o.id
FROM Customers c
RIGHT JOIN Orders o ON c.id = o.c_id;
```

Right table is anchored; left is padded with NULLs where no match exists.

**Why you "rarely use it"**: every RIGHT JOIN can be rewritten as a LEFT JOIN by swapping the table order:

```sql
-- These two are identical:
A LEFT JOIN B ON A.id = B.a_id
B RIGHT JOIN A ON A.id = B.a_id
```

Style convention is to always swap and use LEFT, because reading SQL top-to-bottom, "left" maps to the table mentioned first — which is also where your eye lands first. RIGHT JOIN forces the reader to re-anchor mentally. It's not wrong, it's just sociologically out of fashion.

The one place RIGHT JOIN occasionally helps: **dynamic query builders** that grow the FROM clause by appending tables. If your codegen appends new tables on the right and you sometimes need them as the anchor, RIGHT JOIN saves the rewrite. Otherwise: LEFT JOIN every time.

---

## FULL OUTER JOIN — keep everything on both sides

```sql
SELECT c.name, o.id
FROM Customers c
FULL OUTER JOIN Orders o ON c.id = o.c_id;
```

```
name    o.id
Alice   10        ← matched
Bob     NULL      ← Bob with no order
Carol   11        ← matched
NULL    99        ← order 99 with no customer (orphaned)
```

Anchored on **both sides**. Every row from A appears (NULL on right if unmatched). Every row from B appears (NULL on left if unmatched). Matching pairs appear once.

**Use case**: data reconciliation. "Show me everything in both systems, including stuff that's only in one." Detecting orphaned orders (`WHERE c.id IS NULL`) or customers with no orders (`WHERE o.id IS NULL`) at the same time.

**MySQL doesn't have it.** The workaround:

```sql
SELECT c.name, o.id FROM c LEFT JOIN o ON c.id = o.c_id
UNION
SELECT c.name, o.id FROM c RIGHT JOIN o ON c.id = o.c_id;
```

(The `UNION` deduplicates the matched rows that appear in both halves.)

Postgres, SQL Server, Oracle, SQLite all have FULL OUTER JOIN. If you see it in interview SQL, you're not on MySQL.

---

## SELF JOIN — same table, two aliases

The same table appears twice in the FROM clause with different aliases. The engine treats them as if they were two separate tables.

**Classic use case 1: hierarchies** (Q52 — employees vs managers):

```sql
SELECT e.name AS Employee, m.name AS Manager
FROM Employee e
JOIN Employee m ON e.manager_id = m.id;
```

`e` (employee role) and `m` (manager role) both point at the same physical table, but with different aliases the SQL acts on them as two relations. You join them via the foreign key from one role to the other. Result: every employee paired with their manager's name.

**Classic use case 2: streak/consecutive detection** (Q32 — rising temperature):

```sql
SELECT w1.id
FROM Weather w1
JOIN Weather w2 ON w1.recordDate = date(w2.recordDate, '+1 day')
WHERE w1.temperature > w2.temperature;
```

`w1` is "today's record", `w2` is "yesterday's record". You self-join with the condition that w1's date equals w2's date + 1 day. Now each row pairs a day with its predecessor; the WHERE keeps only the rising days.

**Classic use case 3: pairwise comparisons** ("find all pairs of employees with the same salary"):

```sql
SELECT a.name, b.name, a.salary
FROM Employee a
JOIN Employee b ON a.salary = b.salary AND a.id < b.id;
```

The `a.id < b.id` prevents pairing each employee with themselves AND with their twin in both orders (Alice-Bob AND Bob-Alice). Generally, any time you join a table to itself for pairing, you need this guard or you get a `n²` blow-up of duplicates.

**Performance note**: a self join is *just a join*. The planner doesn't know "this is a self join" — it sees two scans of the same table and plans accordingly. If the table has 1 M rows and your ON clause isn't indexed, you'll do a 10¹² nested loop. Always check the indexes match.

---

## Two more joins you should know exist

**`CROSS JOIN`** — the explicit Cartesian product, no ON clause:

```sql
SELECT s.name, c.title
FROM Students s
CROSS JOIN Courses c;
```

Returns *every student × every course*. Use case: generating combinations (e.g., "every product × every date for a forecasting table"). Very rare in real OLTP queries. If you write `FROM A, B` without an `ON`, you get the same thing — and 99% of the time that's a bug where someone forgot the join condition.

**`NATURAL JOIN`** — joins on every column with a matching name:

```sql
SELECT * FROM Customers NATURAL JOIN Orders;
```

**Don't use this.** It's invisible magic. Add a column named `created_at` to both tables (a totally reasonable thing to do) and your NATURAL JOIN silently changes meaning. Always write the `ON` clause explicitly.

---

## The Venn-diagram lie

This image is everywhere:

```
INNER JOIN:           LEFT JOIN:          FULL JOIN:
  ┌────┬────┐         ┌─────┬───┐         ┌───┬───┐
  │ A  │ B  │         │ A │     │         │   ⨯   │
  │    │∩B  │         │   ∩ B   │         │ A ∩ B │
  └────┴────┘         └─────┴───┘         └───┴───┘
```

It's a useful mnemonic for *which rows survive*, but it gives the wrong intuition because **JOINs work on row pairs, not row sets**. The Venn diagram suggests JOIN is set-flavored. It isn't. Two specific failures:

1. **Duplicates compound multiplicatively.** If Alice has 3 orders and Bob has 2, INNER JOIN gives you 5 rows, not 2 customers. The "intersection" framing hides this.

2. **NULL semantics in the join condition.** `JOIN ON a.id = b.id` does NOT match rows where both sides are NULL (`NULL = NULL` is NULL, not TRUE, in SQL). The Venn diagram has no way to express this — but it's the source of many real-world bugs around optional foreign keys.

The accurate mental model is: *Cartesian product, filtered by the ON clause, optionally padded with NULLs on one or both sides depending on the JOIN type*. Hold that, and the Venn diagram becomes a cute visualization rather than a load-bearing concept.

---

## Anti-joins: three ways to say "find rows in A not matching anything in B"

This pattern shows up *constantly*. Three idioms, all correct, with subtle differences:

```sql
-- 1. LEFT JOIN + IS NULL (Q24)
SELECT c.name
FROM Customers c
LEFT JOIN Orders o ON c.id = o.c_id
WHERE o.id IS NULL;

-- 2. NOT IN
SELECT c.name
FROM Customers c
WHERE c.id NOT IN (SELECT c_id FROM Orders);

-- 3. NOT EXISTS
SELECT c.name
FROM Customers c
WHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.c_id = c.id);
```

**They behave identically — except when NULLs appear**. If any row in `Orders.c_id` is `NULL`, then `NOT IN` returns *zero rows* (because `c.id NOT IN (1, 3, NULL)` is `NULL`, not TRUE, for every customer). This bites people in production all the time. `NOT EXISTS` and `LEFT JOIN + IS NULL` both handle NULLs correctly.

**Performance**: modern planners (Postgres ≥ 9, recent MySQL, SQL Server) optimize all three to the same execution plan — typically a *hash anti-join*. On older engines, `NOT EXISTS` was usually the fastest, `NOT IN` the slowest. Rule of thumb today: use `NOT EXISTS` for safety + clarity, fall back to LEFT JOIN + IS NULL when the query reads better that way.

---

## What the engine actually does (three join algorithms)

When the planner sees `A JOIN B ON A.x = B.y`, it picks one of three execution strategies based on table sizes, indexes, and statistics:

1. **Nested loop**: for each row in A, scan B looking for matches. O(|A| × |B|) without indexes; O(|A| × log|B|) with a B-tree index on `B.y`. Best when |A| is tiny or one side has a perfect index.

2. **Hash join**: build a hash table on the smaller side (keyed by the join column), then probe it with each row from the larger side. O(|A| + |B|) but uses O(min(|A|, |B|)) memory. The default for equality joins on medium-large tables.

3. **Merge join**: sort both sides by the join column (or use existing sort order from an index), then walk them in parallel. O((|A| + |B|) log) for the sort. Best when both sides are already sorted (e.g., joining on the primary key of both).

You don't pick these — the planner does. But knowing they exist explains why `EXPLAIN ANALYZE` shows wildly different costs for syntactically-similar queries: it's choosing different algorithms. If a query is slow, look at the chosen algorithm; mismatched stats often push it toward the wrong one.

---

## The interview shortcut

For any "join" question:

1. **What are the two entities?** Identify the relationship — 1:N, N:M, hierarchy, etc.
2. **Which entity should be anchored?** "Find customers with no orders" → anchor on customers → LEFT JOIN.
3. **What does an unmatched row look like?** Decide what should happen to it (drop = INNER, keep with NULL = OUTER).
4. **Are filters before or after the join?** If a filter touches the right table of a LEFT JOIN, it probably belongs in `ON`, not `WHERE`.

Walk through those out loud and you'll write the right join 95% of the time, without invoking Venn diagrams.

---

## Summary in one line

> A JOIN is the Cartesian product, filtered by the `ON` clause; each variant just decides whether unmatched rows are dropped (INNER) or padded with NULLs on one or both sides (LEFT/RIGHT/FULL OUTER).
