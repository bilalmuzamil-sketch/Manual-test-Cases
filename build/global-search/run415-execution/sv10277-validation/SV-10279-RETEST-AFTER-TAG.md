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
