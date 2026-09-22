# V1 Regression run — 22 September 2026

**Ordered by the QA lead, 22 Sep, in this order:**
1. **Global Search V2 – V1 Regression Suite** (section 6769) — **64 checks**
2. **Global Search V2 – V1 Regression (derived from V1 automated tests)** (section 8056) — **1 check**

Together **65 checks**, all authored by us (`created_by = 3`); none of Vladimir's, none flagged
Automated — so Rules 38 and 71 do not bite here.

## Scope (Rule 110) — REPLACEMENT

These are the two folders he had me EXCLUDE yesterday, and his own words then were: *"if we are
excluding the folders mentioned in the screenshot above we would stick to the written requirements."*
Including them is therefore the other half of that sentence: **the shipped V1 product is the
standard**, not the V2 requirements document. Every case in these folders says so in its own
provenance — *"THIS CASE IS TESTED AGAINST V1, NOT AGAINST THE V2 SPECIFICATION … the shipped V1
product IS the specification"* — and several add *"do not pass the test just because the newer
specification no longer asks for it."* That is how they are being judged. **If he meant the other
yardstick, say so and the verdicts change; nothing else does.**

## Last done (Rule 80)

| Last result | Checks | Build then |
|---|---|---|
| 15 September 2026 | 53 | `v26.36.4-7869ff2` |
| 17 September 2026 | 10 | `v26.36.7-29ca209` |
| 22 September 2026 | 2 | `v26.36.8-d146c39` (the two comment corrections, not re-runs) |

**Standing at the start: 58 Passed · 7 Failed · 0 Blocked · 0 Untested.** The build has moved since
(`v26.36.8-d146c39`), so this is a full re-run of all 65 — not a delta (Rule 101).

Seven already failing, each with its report: C45153 and C53601 → SV-10001 · C53605 → SV-10055 ·
C55660 → SV-10060 · C55673 → SV-10061 · C55685 → SV-10025 · C45160 → deliberate non-goal, no ticket.

## Standing holds that do not lift

No Jira issue without his per-ticket word (62/113 — a failure is recorded with the reason and listed
for him) · the Expected is never edited (114) · secrets stay in `/tmp` (82).

## Batches

| # | What | Checks | State |
|---|---|---|---|
| 1 | Findability by field — type a value, read the group | 28 | running |
| 2 | Number forms — the work order number in its five shapes, and number fragments | 3 | to do |
| 3 | Panel behaviour — keyboard, ordering, opening a record, states | 13 | to do |
| 4 | Permissions, location scoping and organisation isolation | 13 | to do |
| 5 | Freshness — a new record findable within 30 seconds | 2 | to do |
| 6 | The remaining singletons | 6 | to do |

---

## 🔴 Instrument error caught before it became eight false failures (22 Sep)

The first pass over batch 1 reported **eight new failures** against a suite that was 58/65 green on
17 September. Before any of them was recorded, two checks were run — and both of them mattered.

**1. Are the seeded records still there?** `seed.py --check` on the V1-regression universe:
**11 of 11 records present, 0 field gaps, every declared field matched.** The customer still carries
`(419) 555-0143`, `Dock 7B`, `Fernvale`, `Ohio`, `44872-9931` and its website; the asset still
carries unit `ZZT-4471`, VIN `1FUJGLDR9KLZZ4471` and plate `OHZZT471`; both parts and the vendor are
intact. **So nothing could be blamed on a stale fixture.**

**2. Was I reading the right thing?** No. **The All view lists only FIVE rows per group.** Queries
like `Fernvale` and `Ohio` match dozens of records, so the seeded customer sits well below the fifth
row and my reader recorded *"missing"*. The case step *"Read the Customers group"* means the group as
a tester can actually see it — which is the **scope tab**, where up to twenty rows are listed.

A second flaw in the same pass: the expectations were **too loose**. *"Brake Chamber"* matched two
unrelated stock parts named `30/30 STANDARD PIGGY BACK KIT, BRAKE CHAMBER`, so a probe could pass on
the wrong record. Every expectation now names the seeded record in full
(`ZZAUTOTEST Brake Chamber Kestrel`, `ZZAUTOTEST Kestrel Parts Supply`, …).

**Both fixed in `reglib.mjs`, and the whole batch re-run — not only the failures (Rule 101).**
Nothing from the first pass is reported. This is the same class of mistake as the five caught on
21 September: *the instrument, not the product.*
