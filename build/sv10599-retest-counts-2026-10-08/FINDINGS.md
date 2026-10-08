# SV-10599 re-test — In Stock counts (8 Oct 2026)

**Asked:** re-test what we reported after the first pass (comment 78113), as ruled by Chris Ward in **78129**:
*"Counts: make them match the badge. The collapsed line row and the Work Orders list bubble leave out parts with 0 or
less on hand, so "In Stock" means the same thing everywhere on screen. Pick and auto-pick stay as they are."* and
*"Yes, hide the badge everywhere it shows (work order line, Parts tab, part sale page), with the same 0-or-less rule."*

**Build:** sv10599.qa.shopview.com `v26.40.12-9176f26`, last-modified Thu 08 Oct 2026 05:17:46 GMT, etag `2094b9ba…` =
PR #3391 head `9176f26` (new commit `7ac104f` "[SV-10599] Stop counting In Stock parts with nothing on hand": Parts-tab
collapsed chips skip rows whose badge is hidden; WO list + part-sale list `statusInStock` skip inventory parts with no
positive bin in the WO's workplace). Re-read identical at the pre-post gate.
**Before (yesterday):** same branch, build `v26.40.3-971d112`, 7 Oct — S10599-17581 "3 In Stock" / "3 Parts In Stock".
**Production before:** app.shopview.com `v26.40.12-106a0f1`, Trucks Hill 2, WO **S2-964** (ZZKRYPTON Brake Kit PERTAB-7001
0 on hand + A427 1238213 5 on hand): Parts tab badge In Stock on both, folded "2 In Stock", list "2 Parts In Stock".
Restored: WO deleted (201; re-read 400 Not found); PERTAB-7001 still 0, 1238213 still 5.

## Results (all live, screen; harness `obs.mjs`)
| # | Case | Folded line (Parts tab) | List hover box | Verdict |
|---|---|---|---|---|
| 1-2 | S10599-17581: 573.D430FH-HV 10, MH55205 −3, 448-4865 0, vendor ZZ10599V | 1 Auth To Order · 1 In Stock | 1 Part Ready to Order \| 1 Part In Stock (circle 2) | PASS |
| 3 | S10599-17584 only 448-4865 at 0 | no count | no circle | PASS |
| 4 | 448-4865 0→3 | 1 In Stock (17584); 17581 → 2 In Stock | 1 Part In Stock; 17581 2 Parts | PASS |
| 4b | 448-4865 back to 0 | count leaves again | | PASS |
| 5 | MH55205 qty 5, on hand 2 (17584) | 1 In Stock | 1 Part In Stock | PASS |
| 6 | S10599-17585 two lines: L1 448-4865 (0), L2 573 (10) | L1 none, L2 1 In Stock | 1 Part In Stock | PASS |
| 7 | S10599-17582 577.55547 with core: 3 on hand → 0 | 2 In Stock (part + core row) → none | 1 Part In Stock → no circle | PASS |
| 8 | Pick on 448-4865 (0) in 17584 | Pick offered; picked → −1, Received | | PASS |
| 9 | Badge hidden at ≤0 (17581, 17584, 17586) | | | PASS |
| 10 | Technician quick-login (view_mode tech, tech@shopview.com) | no Parts tab for the role | same as admin | PASS |
| 11 | Phone 390×844 | 1 Auth To Order · 2 In Stock (then-state) | phone list cards show no circle | PASS |
| — | Part Sales list P10599-248 (84-2005 14, 401-10B 0) | server count `statusInStock` 1 | **no In Stock count displayed on screen** | n/a |
| — | Lines tab, desktop + phone | no In Stock counts anywhere | | n/a |

Dropped from the table on purpose: "stock only at another location" — not re-checked today.

Note on case 7: the folded row counts rows showing the badge (part + its core row = 2), the list counts parts (1). Both
follow the same on-hand rule; not raised.

## Harness fix (playbook-worthy)
`build/testing-tools/qa-session.mjs` silently ignored `quick:'tech'` (always pressed the admin quick-login). Fixed: new
`quick` option → `button_quick_login_${quick}`. The first "Technician" run today was really admin — caught by reading
`/api/iam/view-profile/` and re-run.

## Per-ticket asks
Screen recording and technical details: not asked this time; both left out by default (Rules 104/84 — nothing is added
without a yes). Offered in the chat reply.

## Posted
Comment **78204** (2026-10-08 01:01 CDT). Read back: success panel first; media 01, 02, 03 in order; table 11 rows + header.
Gate: marker unchanged, PR head 9176f26, ticket TESTING QA with last comment 78129, fingerprint scan clean.
