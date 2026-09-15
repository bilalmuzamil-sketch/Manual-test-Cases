# The ten questions — answered from V1, with the proof

**Date:** 2026-09-15 · **Sheet:** `Global-Search-questions-ANSWERED-from-V1-2026-09-15.xlsx`
**Asked by:** the session executing run 415 · **Answered by:** the session that built the V1 baseline
**Answer on every one of the ten: YES.**

## Why every row is YES, and why that is not a rubber stamp

Each question asks *"should this still work?"*. The standing rule for a V1-versus-V2 comparison
(Rule 109) is that **the shipped V1 product IS the specification**: if a customer could do it before,
they must be able to do it now. A decision in the V2 specification to drop something does not change
that — it only decides whether the loss is **acceptable**, which is precisely what these questions put
to the Product Owner.

So the only question I had to answer was factual: **did this work in V1?** I read the V1 source for
each of the ten, at commit `55767168`. **All ten demonstrably worked.** None is a judgement call.

| # | Question | Proved in V1 at | Answer |
|---|---|---|---|
| 1 | Vehicle by number plate | `FetchDataQueryHandler.php:293` — `v.licence_plate` in the vehicle search text | YES |
| 2 | Customer **and** supplier by postcode | `c.postal_code` (213-266) · `v.postal_code` (144-183) | YES |
| 3 | Customer by its own phone number | `c.telephone` (213-266), brackets stripped so both formats matched | YES |
| 4 | Supplier by county | `v.state_or_province` (144-183) — **the same field that still works for customers** | YES |
| 5 | Company by a contact's job title | `cu.title` (213-266), via the contacts join at line 248 | YES |
| 6 | Part never stocked | `cp.name` / `cp.part_number` from **CataloguePart** (317-340, table at 330) — **no inventory join exists anywhere in it** | YES |
| 7 | Jobs by status | `wo.status` (75-143), underscores removed so "quality check" matched too | YES |
| 8 | Part of a chassis number | `v.vin` in the text + `useGlobalSearch.ts:84-93`, a plain "contains" | YES |
| 9 | Recent list after a no-match | `useGlobalSearch.ts:66-71` and `229-231` — history returned on under two characters **or** zero results | YES |
| 10 | Fragment from mid-word | `useGlobalSearch.ts:84-93` — one "contains" over the whole search text, so it worked on every record type | YES |

## The two worth the Product Owner's attention first

**#6, the part that was never stocked.** V1 searched the parts **catalogue** and nothing else — there
is no inventory join in that query at all, so whether the shop had ever held the part made no
difference. In V2 only stocked parts come back. This is the one a customer is most likely to hit, and
the sheet says so.

**#4, the supplier's county.** It is the *same field* that still works for customers. Whatever the
decision, the two should end up consistent — a search that works on one kind of record and not the
other is the shape of thing that erodes trust in the whole box.

## What I changed on the sheet, and what I did not

- **Column F** filled on all ten rows with the sheet's own YES wording.
- **Columns G and H added** — what V1 actually did, and where that is proved — so the answer can be
  checked rather than taken on trust. The other session has to justify filing ten faults; a citation
  per row is what makes that defensible.
- **Nothing else was altered.** No wording, no ordering, no formatting of the original columns.

## Two honest notes

1. **These are answers from evidence, not a ruling.** I can prove what V1 did; only the Product Owner
   can decide whether a loss is acceptable. Every YES here means *"V1 could do this, so by our standing
   rule it is a fault until the PO rules otherwise"* — not *"the PO has ruled."*
2. **Nine of the ten already have test cases in run 415** and are written to assert the V1 behaviour,
   so whichever way each is ruled, the evidence is already being collected.
