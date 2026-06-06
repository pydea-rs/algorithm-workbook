# How hash tables (like Python's `dict`) actually work

## The core idea in one picture

A hash table is an **array** with a function that turns any key into a slot index.

```
         hash("apple") % 8 = 3
keys ──► ┌───┬───┬───┬─────┬───┬───┬───┬───┐
         │ . │ . │ . │apple│ . │ . │ . │ . │
         └───┴───┴───┴─────┴───┴───┴───┴───┘
           0   1   2    3    4   5   6   7
```

To look up `"apple"`, you don't search. You compute `hash("apple") % 8` and jump straight to slot 3. That's the O(1) magic — array indexing is O(1), and the hash collapses any key (a string, a tuple, anything hashable) down to an integer index in one shot.

`dict` and `set` are the same machine. A `dict` slot stores `(hash, key, value)`; a `set` slot stores `(hash, key)`.

---

## Step 1 — the hash function

A hash function maps an arbitrary key → an integer. Two non-negotiable rules:

1. **Deterministic**: `hash(x)` must give the same int every time you call it (within a process — Python randomizes the seed per process for security, but it's stable within one run).
2. **`a == b` ⇒ `hash(a) == hash(b)`**. Equal keys MUST hash to the same slot, otherwise you'd insert under one slot and look up under another.

The reverse is NOT required: different keys may hash to the same int. That's a **collision**, and it's unavoidable — you're squeezing infinite keys into a finite array.

```python
hash("apple")              # some big int
hash("apple") % 8          # 3 — the actual slot in an 8-slot table
hash((1, 2))               # tuples are hashable (immutable)
hash([1, 2])               # TypeError — lists are mutable, can't be keys
```

---

## Step 2 — collisions

Two keys hash to the same slot. Now what? Two schools:

### Separate chaining (Java's `HashMap`)
Each slot holds a *linked list* (or small tree) of entries. Collisions just append to the list. Lookup walks the list comparing keys.

```
slot 3: ──► (apple, 1) ──► (grape, 7) ──► (mango, 4)
```

### Open addressing (CPython's `dict`)
Each slot holds at most one entry. If your slot is taken, you **probe** — try the next slot, or some other slot determined by the hash, until you find an empty one or your key.

Python's specific recipe ("perturbed probing"): when slot `i` is occupied, the next probe is

```
i = (5 * i + 1 + perturb) % table_size
perturb >>= 5
```

The `5*i + 1` walks the table in a pattern that hits every slot. The `perturb` (initially the full hash, shifted right 5 bits each step) injects the high bits of the hash into the probe sequence — so two keys that collide on `hash % size` still take very different probe paths and disentangle fast.

**Why open addressing instead of chaining?** No per-slot pointers, much better cache locality (probes hit adjacent memory), and Python keys/values are already PyObject pointers so chaining would double the pointer overhead.

---

## Step 3 — the load factor and resizing

If you let the table fill up, probe chains get long and every operation degrades. So when the table hits ~**2/3 full**, CPython doubles its size and re-inserts every entry. (It usually quadruples for small tables to skip a few growth steps early.)

That rehash is O(n). It's the reason `__setitem__` is **amortised** O(1), not strictly O(1): one out of every ~n inserts pays an O(n) cost, which averages to O(1) per insert.

---

## Step 4 — why "O(1) average, O(n) worst"

**Average case**: with a good hash, your n keys distribute roughly uniformly across the table's slots. Expected probe length per lookup ≈ a small constant (under 2/3 load, that constant is < 3). Independent of n.

**Worst case**: every key collides into the same probe chain. Now lookup is O(n) because you walk all n entries. With Python's hash + random seed this is astronomically unlikely for normal data — but it was a **real security exploit** in the 2000s: attackers crafted POST payloads where every key hashed to the same slot, and a single request consumed minutes of CPU. The fix (and reason `PYTHONHASHSEED` defaults to random) was to make string hashes unpredictable to outside attackers.

---

## Step 5 — the hashability contract (the part that bites people)

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)

s = {Point(1, 2)}            # TypeError: unhashable
```

The moment you override `__eq__`, Python sets `__hash__` to `None`, because the table can't trust your old hash to be consistent with your new equality. You must define both:

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)
    def __hash__(self):
        return hash((self.x, self.y))    # must agree with __eq__
```

**The deeper rule**: if `a == b`, then `hash(a) == hash(b)` — *always*. If you mutate a key after inserting it, you break this rule and the table cannot find the key again (it's at slot X, but the new hash points to slot Y). That's why Python only lets you use immutable values as keys: `int`, `str`, `tuple` ✅; `list`, `dict`, `set` ❌.

`frozenset` and `tuple` exist precisely so you can use set-shaped and list-shaped data as keys.

---

## Step 6 — insertion order (Python 3.7+)

CPython's dict has been ordered since 3.7 (and 3.6 as an implementation detail). It doesn't store entries in the hash slots directly anymore — it uses a **two-level layout**:

```
indices:   [-, -, 2, 0, -, 1, -, -]      ← hash table (small ints into entries)
entries:   [(h_a, "apple", 1),            ← dense, insertion-ordered
            (h_b, "grape", 7),
            (h_c, "mango", 4)]
```

The hash table holds **integer indices** into a separate dense array of entries. You get O(1) lookups *and* insertion-order iteration *and* lower memory (the indices are 1-byte / 2-byte / 4-byte ints sized to the table). This is why `dict` reliably preserves order while `set` still doesn't (sets use the older layout).

---

## Practical takeaways

- **`x in some_set`** is O(1) — turn "does this list contain X?" patterns into set membership the moment the list is bigger than ~50 and you do lookups in a loop.
- **Hashing a long string** is O(L) where L is the length, not O(1). If your "keys" are 10 KB strings, `dict` lookups are technically O(L), not O(1). Real-world this rarely matters, but it shows up on hot paths.
- **`collections.Counter`** is just a `dict` subclass with `__missing__ = lambda k: 0` and helpers like `most_common(k)` (which uses a heap, not a sort — O(n log k)).
- **`defaultdict(list)`** vs `dict.setdefault(k, []).append(x)` — both work, defaultdict is faster because it skips a Python-level lookup. For tight loops building adjacency lists, prefer it.

---

## Summary in one line

> A hash table trades the linear scan of "find this key" for one arithmetic jump, by paying the cost of a deterministic equality-preserving hash function plus a tiny bit of bookkeeping (probing, resizing) to handle collisions and growth.
