# Database normalization — the *why* behind the rules

The tutorial gives you a one-liner per form, which is enough for the interview. The underlying machinery is worth knowing because once you see it, you'll never have to memorize anything again.

## The problem normalization solves: three kinds of anomaly

Imagine a single mega-table like this:

```
Enrollments
─────────────────────────────────────────────────────────────────────
student_id  student_name  course_id  course_title    instructor_name
1           Alice         CS101      Intro to CS     Dr. Park
1           Alice         MATH200    Calculus        Dr. Lee
2           Bob           CS101      Intro to CS     Dr. Park
3           Carol         CS101      Intro to CS     Dr. Park
```

This table will silently corrupt itself over time because **the same fact is stored in many places**. Three failure modes:

**Update anomaly.** Dr. Park gets married, becomes Dr. Park-Singh. You have to remember to update three rows. Miss one — now your DB says "CS101 has two different instructors." There's no longer a single source of truth.

**Insert anomaly.** A new course PHYS101 is created but no student has enrolled yet. Where do you put it? You can't insert a row without a student_id — the row would have nulls everywhere except course fields. Your data model can't represent "course exists, has no students."

**Delete anomaly.** Carol drops CS101. You delete her row. Bob and Alice still exist. But suppose Bob and Alice also drop CS101 — you delete those rows too. Now there is no row mentioning CS101 anywhere. The course has vanished, even though it still exists in reality.

Every normal form is just a rule that prevents a specific category of these anomalies. That's the whole story. You don't normalize to please Codd; you normalize so the data can't lie to you.

---

## 1NF — every column holds one value

A row is a *record*; each column is a *field*; each field holds **one atomic value**. The classical violation is the "list-in-a-cell":

```
BAD                                 GOOD
─────────────────────────────       ─────────────────
student   courses                   student   course
Alice     Math, Physics, CS         Alice     Math
Bob       English                   Alice     Physics
                                    Alice     CS
                                    Bob       English
```

Why is "Math, Physics, CS" toxic? Because the database can't help you anymore. Queries like *"who's taking Physics?"* require `LIKE '%Physics%'` which:

- matches "Physiotherapy" by accident
- can't use an index, so it's O(n) scan forever
- breaks if someone adds spaces or reorders
- the count `COUNT(courses)` returns the number of students, not the number of enrollments

The fix is the **junction table**: an extra row per pairing. Now "who's taking Physics?" is a normal indexed lookup.

### Subtleties most people miss

- **"Atomic" is contextual, not absolute.** A `full_name = "Alice Park"` column is atomic *if you never query by first name or last name*. The moment your business needs "everyone whose surname is Park," it's a 1NF violation against *your* requirements. Atomicity is defined by what queries you need to support, not by some Platonic ideal.

- **JSON columns are an interesting edge case.** A column like `tags JSONB DEFAULT '[]'` looks like a 1NF violation. Postgres lets you query into it with `WHERE tags ? 'physics'` and even index it with GIN. So it works. The hidden cost: you've moved schema enforcement out of the database. If a typo makes one row `["physics"]` and another `["Physics"]`, the DB doesn't help. Use JSON when the structure is genuinely variable per-row (e.g., per-tenant custom fields). Don't use it as a shortcut around making a junction table.

- **Composite columns are not violations.** A `address` column that holds `(street, city, postal_code)` as a struct/composite type in Postgres is still 1NF — you can query individual fields directly. The "atomic" rule is really "is each field individually addressable in queries?"

---

## 2NF — no non-key column depends on only part of a composite key

This rule **only applies to tables with composite primary keys**. If your PK is a single column (auto-increment ID, say), you're automatically in 2NF and can skip this entirely. That's why the tutorial says "only matters for composite keys" — most modern schemas dodge it by design.

When does it bite? When your PK is naturally composite. Example:

```
Enrollments
PK: (student_id, course_id)
───────────────────────────────────────────────
student_id  course_id  enrollment_date  student_name  course_title
1           CS101      2024-09-01       Alice         Intro to CS
1           MATH200    2024-09-01       Alice         Calculus
2           CS101      2024-09-02       Bob           Intro to CS
```

Two non-key columns here:

- `enrollment_date` depends on the **full key** `(student_id, course_id)` — a particular enrollment has a particular date.
- `student_name` depends on **only `student_id`** — it doesn't change based on which course.
- `course_title` depends on **only `course_id`** — it doesn't change based on which student.

Those last two are **partial dependencies**. They cause the same anomalies we saw earlier — Alice's name is in two rows; if she changes it, one might lag. The fix is to push each partial-dependency column into the table whose key it actually belongs to:

```
Students                Courses                 Enrollments
PK: student_id          PK: course_id           PK: (student_id, course_id)
─────────────────       ──────────────────      ─────────────────────────
student_id  name        course_id   title       student_id  course_id  enrollment_date
1           Alice       CS101       Intro CS    1           CS101      2024-09-01
2           Bob         MATH200     Calculus    1           MATH200    2024-09-01
                                                2           CS101      2024-09-02
```

`enrollment_date` stays — it really does belong to the full pairing. The others go home.

**Why "only matters for composite keys" works:** with a single-column PK (`enrollment_id INTEGER PRIMARY KEY`), there's no "part" of the key to depend on. Every non-key column depends on the entire (singleton) key by definition. 2NF holds automatically. This is why surrogate keys (auto-incrementing IDs) are so popular — they cost you a tiny amount of storage but make 2NF a non-issue forever.

---

## 3NF — no non-key column depends on another non-key column

This is the one you'll actually hit most often, because surrogate keys don't save you from it.

Concrete violation:

```
Courses
PK: course_id
─────────────────────────────────────────────────────────────
course_id  title         instructor_id  instructor_name  instructor_email
CS101      Intro to CS   42             Dr. Park         park@uni.edu
MATH200    Calculus      17             Dr. Lee          lee@uni.edu
CS102      Data Struct   42             Dr. Park         park@uni.edu
```

`instructor_name` and `instructor_email` are not really facts about the course — they're facts about the instructor. They depend on `instructor_id`, which is itself not the key. That's a **transitive dependency**: course_id → instructor_id → instructor_name. The DB stores them anyway, alongside the course.

Why this hurts: Dr. Park's email changes. You now have to update every course she teaches. Forget one — `WHERE instructor_id = 42` returns two different emails. The DB can't tell you which is "true."

Fix: every non-key fact lives in the table whose key it depends on directly. Pull instructor data out:

```
Courses                                  Instructors
PK: course_id                            PK: instructor_id
─────────────────────────────────        ─────────────────────────────
course_id   title         instructor_id  instructor_id  name      email
CS101       Intro to CS   42             42             Dr. Park  park@uni.edu
MATH200     Calculus      17             17             Dr. Lee   lee@uni.edu
CS102       Data Struct   42
```

Now Dr. Park's email lives in exactly one row. The DB enforces the truth.

### The diagnostic mantra

For every non-key column, ask: *"does this depend on the primary key, the whole primary key, and nothing but the primary key?"* If the answer is anything other than yes, you have a violation:

- "Depends on part of the key" → 2NF violation
- "Depends on the key via another non-key column" → 3NF violation
- "Doesn't really depend on the key at all" → it's in the wrong table entirely

---

## The forms you don't strictly need but should know exist

**BCNF** (Boyce-Codd) tightens 3NF for an edge case: when a non-PK column functionally determines part of the PK. Rare in practice; you usually only see it when you have multiple candidate keys and pick the wrong one. If 3NF passes and you have a single-column PK, BCNF passes too.

**4NF** addresses multi-valued dependencies (a row that says "student Alice takes courses {Math, Physics} AND speaks languages {English, Korean}" — these two sets are independent and shouldn't be in the same table). The fix is two junction tables instead of one. You'll know when you hit this; it's almost always pretty obvious that two unrelated things are colliding.

**5NF, DKNF** are theoretical; you won't see them in interviews.

---

## When to *deliberately* break the rules — denormalization

You'll see denormalized schemas in real production all the time. The reason is almost always one of:

1. **Read-heavy reporting.** You query "show me every course with its instructor name" a million times a day. The 3NF schema requires a join. If the join is expensive, you cache `instructor_name` on `courses` as a denormalized copy. You accept the update-anomaly risk (manageable with triggers or app-layer code) in exchange for read speed.

2. **Eventual-consistency systems.** Analytics warehouses (BigQuery, Snowflake) deliberately use wide denormalized "star schemas" because the cost model is columnar scan, not row lookup. The whole rationale for 3NF — avoid duplicate-storage anomalies — doesn't apply when the warehouse is rebuilt from immutable source-of-truth data every night.

3. **History / audit tables.** You explicitly want to store *what the instructor's name was at the time of enrollment*, not what it is now. So you copy the name into the enrollment row on purpose. This isn't a 3NF violation; it's storing a different fact (historical snapshot vs. current value).

**The rule of thumb**: normalize first. Denormalize when measurement (not guesswork) shows the joins are actually a bottleneck. The reverse — starting denormalized and trying to normalize later — is one of the worst migrations you can do, because every duplicated row is potentially inconsistent and you have to decide a winner.

---

## The interview shortcut

If an interviewer asks "is this schema normalized?", you almost never need to invoke the formalism. Walk through it conversationally:

1. *"Does any column hold a list or composite value I'd need to query into? No → 1NF OK."*
2. *"Is the PK a single column? Yes → 2NF automatic, skip."*
3. *"For each non-key column: does it describe the entity this row is about, or some other entity? If 'other entity', pull it out into that entity's table."*

That third step IS 3NF in plain English. If you can do that, you've shown the interviewer everything they wanted to see, without ever uttering the phrase "transitive functional dependency."

---

## Summary in one line

> Normalization is the discipline of putting each fact in exactly one place, so the database — not your application code — guarantees the fact stays consistent.
