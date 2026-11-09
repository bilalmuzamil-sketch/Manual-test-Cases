# SV-12223 — Inventory count sheet PDF 500 on large sheets (9 Nov 2026)

Ticket: https://shopview.atlassian.net/browse/SV-12223 (Bug, TESTING QA, assignee Milomir Kotlajic, QA Assignee Mudassir Qamar — QA lead said test it, 9 Nov). No Powertools plan. QA Branch https://sv12223.qa.shopview.com. Mode: Board-2 defaults (API mode, no recording, no technical section).
Ticket expected: "The count sheet prints, or the user gets a clear message that the sheet is too large to print."
Fix (ShopView/shopview branch SV-12223-count-sheet-pdf-timeout, commit 3dc18baa + self-review 46073bc5/c927e498/1bddce67): `CountSheetPdfQueryHandler::MAX_LINES = 500`; over the cap throws `CountSheetTooLargeError` (400, message "This count sheet has N lines, which is too many to print at once (the limit is 500). Narrow it with search or a filter, such as Bin Location, and print it in parts."); Inventory.vue toasts it. Lines = part x bin rows. Search fields: part name, part number, bin name, quantity, min, max.

## Environment
- Branch sv12223, build **v26.45.2-411684a**, Staging Heavy Duty - 9919, Admin (quick login), Chrome desktop 1600x900 dpr 2, mouse clicks.
- Production app.shopview.com build **v26.45.2-107ad4b**, test org (Trucks Hill 2).
- Print driven on screen: Parts > Inventory > ⋮ (top right) > Cycle count > Print (printer icon). API repeats use the same GET the button sends.

## Branch results (all runs in ev/runs.jsonl + ev/api-runs.jsonl)
| # | Sheet | Lines | Result | Time |
|---|---|---|---|---|
| 1 | Whole inventory, on screen | 7,018 | 400, red toast with the message (picture B1) | 1.2 s |
| 2 | Bin Location = Unassigned, on screen | 1,103 | 400, toast | 0.26 s |
| 3 | search 3/8 | 541 | 400 "541 lines" | 0.37 s |
| 4 | search TUBE | 699 | 400 "699 lines" | 0.33 s |
| 5 | search RING + seeded bin ZZRING12223 (41 parts) | 499 | 200 PDF, 6/6 runs (default, bin asc, name asc) | 24.1–24.8 s |
| 6 | same, 42 parts | 500 | 200 PDF, 2/2 API + 1 on screen (opens in a new tab) | 25.3–25.7 s |
| 7 | same, 43 parts | 501 | 400 "501 lines", API + on screen toast | 0.35–0.38 s |
| 8 | worst case: bin ZZLONG12223 on the 500 parts with the longest names+tags | 500 | 200 PDF (64 pages), 4/4 (default x3, name sort) | 27.6–28.7 s |
| 9 | worst case printed by two at the same moment | 500 x2 | both 200 (server runs them one after the other) | 28.3 s and 55.6 s |
| 10 | search SWITCH (+ Unassigned filter left on from #2), on screen | small | 200 PDF opens in new tab | 1.8 s |
| 11 | forced 500 response (page.route — COMPARISON ONLY, not a real failure) | – | "Ooooops! An error occurred" + "Failed to generate count sheet PDF…" — same two toasts as production (P3) | – |
| 12 | forced 400 with no message (page.route — COMPARISON ONLY) | – | generic "Failed to generate count sheet PDF…" toast | – |

## Production (before)
| Run | Lines | Result |
|---|---|---|
| P1 whole inventory | 1,450 | 200 PDF, 18.3 s |
| P2 + bin ZZBIG12223 on 1,200 parts | 2,650 | 200 PDF, 30.6 s |
| P4 + bin ZZBIG2-12223 on all 1,448 parts | 4,098 | **200 PDF, 77.1 s (931 KB)** |
| P3 forced 500 (COMPARISON ONLY) | – | two toasts as above |

**Production does not stop a PDF at 30 seconds**: a 4,098-line sheet printed in 77 s. The reported 500 is not reproducible on production with up to 4,098 lines; it happens on staging/QA, whose PDF service stops at ~30 s.
**Consequence of the fix if shipped as is:** on production a count sheet over 500 lines is refused, though today production prints at least 4,098 lines. Raised with the QA lead before any verdict (Rule 97(d)).

Test data left in place (no cleanup rule): branch bins ZZRING12223 (42 parts) + ZZLONG12223 (500 parts); production bins ZZBIG12223 (1,200 parts) + ZZBIG2-12223 (1,448 parts), qty 0, not default.
