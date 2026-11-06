# SV-11684 — Vendor page: long email runs off the vendor card (QA branch sv11684, build v26.45.1-5bdeeb6, 5 Nov 2026)
Ticket: Bug · reporter Chris Ward · assignee Dusan Radulovic · labels none · QA assignee none · no Powertools plan · 0 comments. Picked from the Testing QA queue (QA lead instruction; unattended, so API mode / no recording / no technical section as for the day's tickets).
Expected (description): 1. a long email wraps or breaks inside the card, never runs past its edge, at every width. 2. full email stays readable and can be copied. 3. customer / WO / part sale cards show no email.
## Matrix
| Email | Width | Inside card | Fully visible | Notes |
|---|---|---|---|---|
| christopher.christensen@staging.shopview.local (47) Saint Cloud Diesel Repair | 1440 | yes | yes (286px) | |
| same | 1024 | yes | NO — "…" (281 of 256px) | hover tooltip shows full; selection copies full |
| same | 768 | yes | yes | |
| zzautotest.vendor.with.a.very.long.email.address.for.sv11684@longdomain-example-shopview.com (89), vendor ZZAUTOTEST SV11684 long email (ba7cdf79…) | 1440 / 1024 / 600 | yes | NO — "…" | hover tooltip shows full; copy full |
| same | 768 | yes | yes | |
| same | iPhone 12 Pro preset (390) | yes | NO — "…" | tap shows no tooltip (3 taps) |
CSS on branch: white-space nowrap; overflow hidden; text-overflow ellipsis (truncation, not wrapping).
Production before (v26.45.1-753355c, vendor ac36fac0…, same name/email): white-space normal, overflow visible → text 444px in a 196px box, runs past card edge (card right 259).
Point 3: customer 566fa3d3 page, WO 04ab678b, part sale 4f7287b3 — no email text in any card. PASSED.
Verdict: PARTIALLY PASSED — never runs past the card (fix works) but it truncates instead of wrapping; on a phone the full address can't be read.
## Posted 5 Nov 2026 ~20:30 UTC: 80273 (WHAT PASSED, 4 rows, 1 image) + 80274 (PARTIALLY PASSED). Build re-read v26.45.1-5bdeeb6 before posting. Production test data left: vendor ac36fac0 'ZZAUTOTEST SV11684 long email'.

## Retest 6 Nov 2026 after Dusan's fix (comment 80310) — build v26.45.1-7516f9c (re-read before posting)
| Email | Width | Result |
|---|---|---|
| long (89) ZZAUTOTEST SV11684 long email | 1440 / 1280 / 1024 | cut off with "…" (nowrap, ellipsis) — 3 of 3 |
| same | 900 / 768 / 600 / iPhone 12 Pro preset | full, wraps inside card |
| Saint Cloud Diesel Repair (47) | 1440 | fits on one line |
| same | 1280 / 1024 | cut off with "…" — 2 of 2 |
| same | 900 / 768 / 600 | full |
Copy gives the full address; hover tooltip shows it on desktop. Customer 566fa3d3 / WO 04ab678b / part sale 4f7287b3 re-checked: no email in any card. Chrome 153.0.8010.12, 100% zoom.
Expected (ticket how-to-check): "at 1440px and at a narrow width. The email stays inside the card and is fully readable." → desktop still fails → PARTIALLY PASSED.
Exhibits ev/r2-1-phone-before-after.png, ev/r2-2-desktop-still-cut.png (scripts/exhibit2.py).
Posted 80324 (WHAT PASSED, 5 rows, picture 1) + 80325 (PARTIALLY PASSED, @Dusan, picture 2). Pre-post gate: build marker 7516f9c, ticket TESTING QA with last comment Dusan 80310, all cells observed. Moved to REJECTED FROM TESTING (transition 15); QA Assignee already Bilal. Learning check: nothing new.

## 6 Nov 2026 (afternoon) - QA PASSED on Chris's decision
QA lead ruling: the ticket stands as QA passed after Dusan's comment 80363 ("As discussed with Chris Ward we are good to go with '…' and a tooltip on desktop").
Re-checked live on sv11684 v26.45.1-7516f9c at 1440 wide: email ends in "…", hovering shows the full 89-character address in a tooltip, copy gives the full address (vhover.mjs, ev/r3-desktop-1440-*.png).
Posted PASSED comment 80383 (states it is marked QA Complete after the decision in 80363, with the link), added label QAcomplete, moved to QA Complete (transition 10), priority set to Medium. QA Assignee already Bilal.
