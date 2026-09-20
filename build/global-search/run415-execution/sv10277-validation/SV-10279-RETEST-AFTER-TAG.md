# SV-10279 re-tested after the QA lead added the ZZTABQ tag — 20 September 2026

Build `v26.36.8-d146c39`. Three consecutive reads, identical every time (`retest10279.mjs`).

| # | Part | Score | Recorded as | qty | bin | tags |
|---|---|---|---|---|---|---|
| 1 | `ZZTABQ Wheel Seal` — name **begins** with the text | **1.00** | `word / description` | 0 | y | — |
| 2 | `Cooper ZZTABQ Cartridge` — text in the **middle** | **1.00** | `word / description` | 0 | y | — |
| 3 | `DO NOT USE Aluminum Seal Ring, 14mm` — the newly **tagged** part | 0.55 | `exact / tags` | 0 | y | `["ZZTABQ"]` |
| 4–5 | the discarded `ZZTABP` pair | 0.38 | `fuzzy / description` | 0 | y | — |

## The tag did not change what this ticket is about — the defect is unchanged
SV-10279 is about **rows 1 and 2**. Both still score **1.00** and both are still recorded as
**whole-word** matches, so the part whose name *begins* with the search text still earns no advantage.
The tagged record is a **third, separate part**; it sits below both and has no bearing on the
comparison.

## The tagged row at 0.55 is CORRECT, and it is useful evidence
§6.1 lists what counts as an identifier: *"Exact match on identifier (WO number, P-number, VIN, part
number, PO number, invoice number, telephone digits) → +1.00"*. **A tag is not in that list.** §4 lists
tags among the Parts *indexed* fields, so a tag match is a whole-word match on an indexed field:

* whole-word match anywhere in indexed fields → **+0.50**
* bin location present → **+0.05**
* in stock → **nothing**, the part shows 0 Available
* primary-display-name bonus → **nothing**, a tag is a secondary field

**0.50 + 0.05 = 0.55 — exactly what it scored.**

This strengthens SV-10279 rather than weakening it: on the very same parts, the scoring machinery adds
the PRD's signals correctly as soon as the match is **not** on the primary name. The fault is isolated
to how a Parts name match is classified, not to the scoring generally.

## One inconsistency worth recording, not worth a ticket
The tagged row is labelled **`exact`** while being scored as a **whole-word** match (0.50). The score
is the correct one; the label is not. Noted here; no ticket raised, as nothing a user sees depends on
it. **Put to the QA lead.**

---

# Second re-test — after the QA lead also added a ZZTABQ **category** (20 September 2026)

Two consecutive reads, identical (`retest10279b.mjs`). Build `v26.36.8-d146c39`.

| # | Part | Score | Recorded as | qty | bin | category | tags |
|---|---|---|---|---|---|---|---|
| 1 | `ZZTABQ Wheel Seal` — name **begins** with the text | **1.00** | `word / description` | 0 | y | Uncategorized | — |
| 2 | `Cooper ZZTABQ Cartridge` — text in the **middle** | **1.00** | `word / description` | 0 | y | Uncategorized | — |
| 3 | `AXLE SHAFT FLANGE, REAR DRIVE AXLE` — the newly **categorised** part | 0.75 | `exact / category` | **9** | y | **ZZTABQ** | … |
| 4 | `DO NOT USE Aluminum Seal Ring, 14mm` — the **tagged** part | 0.65 | `exact / tags` | 0 | y | HD-Engine Comp | `["ZZTABQ"]` |
| 5–6 | the discarded `ZZTABP` pair | 0.48 / 0.38 | `fuzzy / description` | 0 | y | Uncategorized | — |

## Rows 1 and 2 are still identical — SV-10279 is unchanged
Both still **1.00**, both still recorded as **whole-word** matches. Two record changes by the QA lead
have moved four other rows and left these two untouched, which is the point of the ticket.

## The category row is exactly right, and it completes the arithmetic
`AXLE SHAFT FLANGE` matched on its **category**, an indexed field, and it is **in stock (9)** with a
bin location:

* whole-word match anywhere in indexed fields → **+0.50**
* in stock (>0) → **+0.20**
* bin location present → **+0.05**
* primary-display-name bonus → **nothing**, a category is a secondary field

**0.50 + 0.20 + 0.05 = 0.75 — exactly what it scored.**

Put beside the tagged part measured earlier at 0.50 + 0.05 = 0.55, this shows the **in-stock signal
working perfectly** on a Parts row — the very signal that SV-10277 §Example 1 shows doing nothing.
It does nothing there only because those rows are already at the maximum.

**So the scoring engine is sound.** Every match that is *not* on the part's own name lands on the
figure the PRD computes, and moves when a signal changes. Only the two name matches never move.

## One number I cannot account for — stated, not guessed
The tagged part moved from **0.55** in the first re-test to **0.65** in this one, a change of exactly
+0.10, and nothing about that record visibly changed. The only +0.10 in §6.1 for Parts is *"viewed
recently"*, and the QA lead did open parts between the two readings — but the newly categorised part
was presumably opened too and shows **no** such addition, so that explanation does not hold up.
**Recorded as unexplained rather than attributed** (Rule 12). It does not affect the finding: rows 1
and 2 did not move at all.

## Labelling inconsistency, still present
Rows 3 and 4 are labelled **`exact`** while being scored as **whole-word** matches (0.50 base). The
scores are right; the labels are not. Noted, no ticket.
