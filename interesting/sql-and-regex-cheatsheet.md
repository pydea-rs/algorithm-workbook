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

**7. Self join** — same table, two aliases. Hierarchies (employee/manager) + consecutive-date / pairwise comparisons.The part about python cheet sheet (listing functions) is easy for me; also in SQL pitfalls only keep the `NOT EXISTS and The last `For median: ROW_NUMBER()` points; remove others
Instead of these things i told you to remove, make `hard regex` part more understandable; its very badly written
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
- `NOT IN (… NULL …)` returns zero rows. Always use `NOT EXISTS` instead — it's NULL-safe.
- For **median**: `ROW_NUMBER() OVER (ORDER BY x) AS rn` + `COUNT(*) OVER () AS n`, then pick rows where `rn IN ((n+1)/2, n/2 + 1)`. Odd n picks one row; even n picks two.

---

## Hard regex

Regex is a small language for describing *patterns* of text. The hard part isn't the symbols — it's knowing **when each one is the right tool**. Here are the constructs that solve problems you can't solve with `str.startswith` and friends.

### Anchors — "where in the string must this match?"

By default a regex floats; it matches anywhere the pattern fits. Anchors pin it down.

- `^pattern` — must start at the beginning of the string
- `pattern$` — must end at the end
- `\bword\b` — word boundaries; the position between a word char (`\w`) and a non-word char

Without `\b`, the pattern `r"cat"` happily matches inside `concatenate`. With it, you get the standalone word "cat" only.

### Character classes — "which characters are allowed here?"

- `\d` any digit, `\w` any letter/digit/underscore, `\s` any whitespace
- Uppercase versions `\D \W \S` are the **negation** of those
- `[abc]` means literally a, b, or c. `[a-z]` is a range. `[^abc]` means *anything except* a, b, or c

The "negation inside brackets" pattern is the powerful one. `r"[^,]+"` reads as "one or more characters, none of which is a comma" — i.e., "consume until the next comma". This shows up everywhere in parsing.

### Quantifiers — "how many times?"

- `?` zero or one (optional)
- `*` zero or more
- `+` one or more
- `{3}` exactly 3, `{2,5}` between 2 and 5

By default quantifiers are **greedy** — they eat as much as they possibly can. That's the source of most regex bugs. Example:

```python
text = '<a href="x.html">click</a>'
re.findall(r'"(.+)"', text)    # → matches from first " all the way to last "  ← WRONG
```

The `.+` ate past the closing quote into the rest of the string. Two ways to fix:

- **Lazy quantifier**: append `?` → `.+?` matches the minimum. `r'"(.+?)"'` works.
- **Negated class**: explicitly forbid the terminator → `r'"([^"]+)"'`. Often safer than lazy because it makes the intent explicit.

### Groups — "capture this part for later"

- `(pattern)` — capturing group. The matched text is saved and accessible as group 1, 2, 3 …
- `(?:pattern)` — non-capturing. Same matching behavior but doesn't reserve a group number. Use this when you only need grouping for alternation or repetition, not for extracting text.
- `(?P<name>pattern)` — Python's named group. Access via `m.group("name")`.

Concrete example — extract the order number and total from `"Order #1234, total: $89.50"`:

```python
m = re.search(r'#(\d+).+\$(\d+\.\d+)', text)
m.group(1)  # '1234'
m.group(2)  # '89.50'
```

### Backreferences — "match the same thing as before"

Inside the pattern, `\1` means "whatever group 1 captured". This is how you find repetitions.

```python
re.findall(r'\b(\w+) \1\b', "the the quick brown fox fox")
# → ['the', 'fox']     # each duplicated word
```

### Alternation — "any one of these"

- `cat|dog|bird` matches any of the three.
- Almost always wrap in a non-capturing group: `(?:cat|dog|bird)`. Without the group, the `|` extends to the entire pattern's start and end, which is usually not what you want.

### Lookahead and lookbehind — "match here only if X is next / before"

These are **zero-width assertions** — they check a condition but consume no characters. Very useful for "match X but only when followed/preceded by Y" without including Y in the result.

- `(?=...)` positive lookahead — "next must be …"
- `(?!...)` negative lookahead — "next must NOT be …"
- `(?<=...)` positive lookbehind — "previous must be …"
- `(?<!...)` negative lookbehind — "previous must NOT be …"

Example — find prices that are followed by " USD" but don't include " USD" in the match itself:

```python
re.findall(r'\d+(?=\s+USD)', "10 USD, 20 EUR, 30 USD")
# → ['10', '30']
```

The `(?=\s+USD)` checks for " USD" after the digits but the match is just the digits themselves. Without lookahead you'd have to capture the digits in a group and discard the rest manually — much uglier.

In Python, lookbehind must be **fixed-width** (`(?<=abc)` is fine, `(?<=a+)` is rejected). Lookahead has no such restriction.
