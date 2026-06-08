# Hard SQL & Regex cheatsheet — Odoo Coderbyte scope only

Two compact references for the patterns that show up in the assessment but aren't basics. Skip the easy stuff (`SELECT`, `WHERE`, `[a-z]`) — this is the "I had to look it up last time" list.

---

## Hard SQL

**1. Window functions** — RANK (gaps after ties), DENSE_RANK (no gaps), ROW_NUMBER (no ties). Replaces 90% of correlated-subquery hacks.
```sql
DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC)
```

**2. LAG / LEAD** — peek the previous/next row by some ordering. For streak, consecutive, rising patterns.
```sql
LAG(num, 2) OVER (ORDER BY id) AS prev2
```

**3. CTE (WITH)** — name an intermediate result. Use when you'd nest 3+ subqueries; required for two-stage window patterns.
```sql
WITH ranked AS (SELECT id, ROW_NUMBER() OVER (ORDER BY salary) AS rn FROM E)
SELECT id FROM ranked WHERE rn = 2;
```

**4. Conditional aggregation** — `AVG(CASE WHEN cond THEN 1.0 ELSE 0 END)` gives a rate; `SUM(CASE...)` gives a count of matches.
```sql
AVG(CASE WHEN status LIKE 'cancelled%' THEN 1.0 ELSE 0 END) AS rate
```

**5. HAVING vs WHERE** — WHERE filters rows BEFORE aggregation, HAVING filters groups AFTER. SELECT aliases unavailable in WHERE.
```sql
SELECT id, COUNT(*) FROM E GROUP BY id HAVING COUNT(*) >= 3;
```

**6. Anti-join** — `LEFT JOIN … WHERE right.pk IS NULL`. NULL-safe alternative to NOT IN.
```sql
SELECT c.name FROM Customers c
LEFT JOIN Orders o ON c.id = o.cid WHERE o.id IS NULL;
```

**7. Self join** — same table, two aliases. Hierarchies (employee/manager) + consecutive-date / pairwise comparisons.
```sql
FROM Employee e JOIN Employee m ON e.managerId = m.id
```

**8. NOT EXISTS** — the NULL-safe NOT IN. Always prefer.
```sql
WHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.cid = c.id)
```

**9. Date arithmetic** — dialect-dependent:
- SQLite:   `date(col, '+1 day')`
- MySQL:    `DATE_ADD(col, INTERVAL 1 DAY)`
- Postgres: `col + INTERVAL '1 day'`

### Common SQL pitfalls
- `NULL = NULL` is NULL, not TRUE. Always use `IS NULL`.
- `NOT IN (… NULL …)` returns zero rows. Use `NOT EXISTS` or filter NULLs first.
- Window functions run AFTER `WHERE` but BEFORE `ORDER BY` and `LIMIT`. To filter on a window result (`rk <= 3`), wrap the query in a CTE/subquery and filter in the outer SELECT.
- Aliases in SELECT are NOT visible to WHERE or to the same SELECT clause. They ARE visible to ORDER BY (most dialects) and to HAVING (some).
- Integer division: `5/2 = 2` in most dialects. For median formulas use `(n+1)/2` and `n/2 + 1` deliberately. Cast to REAL when you want fractions.
- For "median": `ROW_NUMBER() OVER (ORDER BY x) AS rn` + `COUNT(*) OVER () AS n`, then pick rows where `rn IN ((n+1)/2, n/2 + 1)`.

---

## Hard regex (Python `re` module in mind)

**Anchors** — `^` start, `$` end, `\b` word boundary, `\B` not-word-boundary.
**Char classes** — `\d \w \s` and negations `\D \W \S`. `[^abc]` = anything except a/b/c.
**Quantifiers** — `?` 0-1, `*` 0+, `+` 1+, `{n}` exact, `{n,m}` range. Append `?` for lazy: `.*?` matches minimum.
**Groups** — `(...)` capture, `(?:...)` non-capture, `(?P<name>...)` named (Python).
**Backrefs** — `\1 \2` reference earlier groups. `(\w+) \1` matches "the the".
**Alternation** — `(cat|dog|bird)`. Wrap in a group for clarity.
**Lookahead** — `(?=...)` positive, `(?!...)` negative. Zero-width, doesn't consume.
**Lookbehind** — `(?<=...)` positive, `(?<!...)` negative. Must be fixed-width in Python.

### Python `re` cheatsheet
- `re.match` (anchored at start) vs `re.search` (anywhere) vs `re.fullmatch` (whole string).
- `re.findall` returns list of strings (or tuples if groups); `re.finditer` returns match objects.
- `re.sub(pat, repl, s)`; in `repl`, `\1` refers to group 1.
- Flags: `re.I` ignorecase, `re.M` per-line `^/$`, `re.S` dotall (`.` matches newline).

### Regex pitfalls
- `.` doesn't match `\n` unless `re.S`. Greedy `.*` is default — use lazy `.*?` or negated class `[^"]*`.
- ALWAYS raw strings: `r"\d+"`. `re.findall` with groups returns group contents, not full match.
