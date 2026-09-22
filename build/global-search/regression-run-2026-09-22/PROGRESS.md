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
