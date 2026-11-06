# SV-12143 - Unable to rearrange parts within a work order line (2026-11-06)

Mode: API mode (Board 2 default), no recording, no technical section.
Sources: ticket description + customer screenshot + Intercom text (no comments, no Powertools plan, no handoff).
Customer's line 4 on S-272 contains a core row with status **Returned** ("Core for Air Compressor").

## Builds
- Production app.shopview.com: v26.45.2-198e632 (last-modified Fri 06 Nov 2026 15:18:24 GMT)
- QA branch sv12143: v26.45.2-a775397 (last-modified Fri 06 Nov 2026 13:00:26 GMT, etag 6904e49a...)

## Trigger found (production)
WO S2-1943 (8980cb3c...), line 1. Reorders worked with: vendor parts only, a picked cored part with an OPEN core
row, a part moved in from line 2. After clicking **Ok** on the core row (handle-core is_core_ok=true) the row reads
**Returned**, and every reorder then fails: toast "The parts submitted for reordering no longer match this line.
Please refresh and try again." (part-order 409). Order unchanged after reload. Evidence ev/prod-p4-returned-*.

## Branch matrix (WO S12143-17580, line b960dfc9)
| # | Case | Result |
|---|---|---|
| 1 | Normal drag (vendor parts only) | PASS - "Part moved", persists after reload (d1/d2) |
| 2 | Drag with an open core row on the line | PASS (b3) |
| 3 | Core marked OK -> "Returned", drag ZZ-COMPRESSOR above hardlines | PASS - 200, "Part moved", persists (b4) |
| 4 | Same, drag ZZ-HARDLINE-B above ZZ-HARDLINE-A | PASS (b5) |
| 5 | Move up from the part menu, returned core on line | PASS - 200, new order after reload (b6) |
| 6 | Move down from the part menu | PASS (b7) |
| 7 | Second core marked Not OK ($16 charge) + returned core, drag | PASS - "Part moved", persists (b8) |
| 8 | Quantity/price/margin/total/status of every row before vs after #7 | IDENTICAL (ev/branch-rows-pre/post.json) |
| 9 | Move a part to another line, then reorder line 1 | PASS - move-to-line 200, reorder "Part moved" (b9) |

Parts used on branch: S31S-950 (core returned), MT47HH5 (core Not OK), FLT1443E23, P550848, ZZ-HARDLINE-A/B, ZZ-COMPRESSOR.
Not tried on production: a Not-OK core alone (production is the "before" only; customer's case is Returned).
Mistake disclosed: an early run fell back to the first cored part on page 1 (FLT1443E23, 0 stock) instead of
S31S-950; it stayed on the line unpicked and doesn't affect any result.

## Pre-post gate
- Build markers read live (above). Ticket re-read: TESTING QA, no comments, no QA assignee.
- Exhibit 01 checked as rendered; captions match the captured runs.
- Verdict: PASSED (every cell observed).
- Learning check: playbook gets the core OK/Not OK + part-order recipe.
