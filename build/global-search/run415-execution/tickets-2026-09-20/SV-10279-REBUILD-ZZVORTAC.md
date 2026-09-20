# SV-10279 rebuilt from scratch on the ZZVORTAC fixture — Parts only (20 September 2026)

QA lead: *"Use this keyword and recreate it from scratch … ZZVORTAC"*, then *"ZZVORTAC has already
been seeded into the parts"*, then *"You have to do this ticket for PARTS only."*

## What he seeded, and what I removed
His fixture is a complete parity set on one keyword — five parts, each matching on a **different
field**, with the keyword kept out of every part number:

| Part | Part number | Matches on | Available |
|---|---|---|---|
| `ZZVORTAC Brake Kit` | `PARITYPN-9001` | name, **begins with** | 0 |
| `Heavy Duty ZZVORTAC Filter` | `PARITYPN-9002` | name, **middle** | 0 |
| `SPINDLE NUT` | `209.1223` | tag | **2** |
| `PLATE STEEL 1/8"` | `PS1/8` | category | 0 |
| `DOC 2 STAGE CLEANING` | `SVC-SILVER-DOC` | manufacturer | 0 |

Before he told me it was already seeded I had created my own pair, `PV-8001` / `PV-8002`. **Both
deleted** so his fixture is not polluted — the Parts group now returns exactly his five rows.

## What the rebuilt ticket says
One picture, one tab, five rows, and the whole argument inside the picture's table:

| Row | What PRD 6.1 adds up to | Returned |
|---|---|---|
| `SPINDLE NUT` (tag, in stock) | 0.50 + 0.20 in stock + 0.05 bin | **0.75** ✓ |
| `PLATE STEEL 1/8"` (category) | 0.50 + 0.05 bin | **0.55** ✓ |
| `DOC 2 STAGE CLEANING` (manufacturer) | 0.50 + 0.05 bin | **0.55** ✓ |
| `ZZVORTAC Brake Kit` (**name, begins with**) | 0.70 prefix + 0.10 bonus = **0.80 expected** | **1.00** ✗ |
| `Heavy Duty ZZVORTAC Filter` (**name, middle**) | 0.50 whole-word + 0.10 bonus = **0.60 expected** | **1.00** ✗ |

His three secondary-field rows are what make this ticket difficult to argue with: they prove the
scoring engine adds the PRD's signals correctly — **including the in-stock signal, visibly working on
the first row** — on the very same search. Only the two name matches miss their figure.

**Parts only, as instructed.** No Customers or Vendors comparison, no mention of other tabs. 504 words,
1 picture, 3 verbatim PRD quotes, both checks with their run link. Old pictures (61146, 61147) deleted.
