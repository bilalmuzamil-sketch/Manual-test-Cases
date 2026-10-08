# SV-9226 — Part Sale list Total Price includes tax (8 Oct 2026)

**Ticket:** https://shopview.atlassian.net/browse/SV-9226 (Bug, TESTING QA, Nemanja Djuric; parent SV-9667; reporter Tracy Davies).
Description: the Part Sales overview total does not include tax (P-3093 $291.53). Chris 77352: also on the Part Sales
list ("Total price on a SERVICE ORDER includes tax, and it should here on Part Sale"). Nemanja 77654 = QA handoff (10 checks).
**Branch:** sv9667.qa.shopview.com `v26.40.8-129d22f`, last-modified Wed 07 Oct 2026 09:46:12 GMT, etag `009978c2…` =
PR #3369 head `129d22f` (epic branch SV-9667, contains `8230744` "fix(SV-9226): Part Sales list total includes tax").
**Production:** `v26.40.12-106a0f1` (read-only checks, nothing written).

## Results (live)
| # | Check | Evidence | Verdict |
|---|---|---|---|
| 1 | All 290 part sales (all pages of the list; 89 estimate, 9 approved, 75 complete, 33 invoiced, 80 paid, 4 declined): list `totalPrice` = Financial Info Total read on each sale page | data/full-compare.json (290/290). Two first-pass misses were my reader not waiting for "Loading…"; re-read $627.42 = list | PASS |
| 2 | Parts > Part Sales: 30 rows on screen vs sale Totals | screen-compare | PASS 30/30 |
| 3 | Customer TestVT1 > Part Sales tab: 30 rows on screen | | PASS 30/30 |
| 4 | Uninvoiced taxable (P9667-447 estimate): list $111.32 > parts subtotal $106.02 | | PASS |
| 5 | Invoiced P9667-445 Finance tab invoice Total $271.08 = list; paid P9667-428 $543.43 = list (core charge + credit lines) | financetab-*.png | PASS |
| 6 | Fee $25 non-taxable +2500; discount $10 −1000; taxable fee $10 +1050 (5% GST); detail = list each step | data/F1.json D1.json F2.json | PASS |
| 7 | Core 2208H476 ($25 core) on P9667-448: Return Core (one click, no dialog) 3457→832 (−2625); core row ⋮ > Cancel Return > "Put Back" (DELETE …/cores/{id}/return 204) → 3457 | core-*.png | PASS |
| 8 | Move Part: dialog in 59 ms (one call `isOpenPartSales=true`), options "P9667-448 [TestVT1]"; moved MD668D 447→448; both list = Total ($119.16, $52.23) | move-*.png | PASS |
| 9 | Global search P9667-447 shows $119.16 | search.png | PASS |
| 10 | No See Financial Data: customer tab has no Total Price column (Technician, and a temp role partSalesView+customersView+workOrdersView without SFD); Parts > Part Sales route requires `seeFinancialData` (route guard read from the bundle) so it redirects to Work Orders | tech-*.png | PASS |
| 11 | Production: aqeel transport 56 tab P2-65 $8.00 vs $8.40, P2-63 $5.00 vs $5.25, P2-58 $234.64 vs $283.50 | PB-*.png | reproduced |

Not shown on screen (nothing to check): list footer total (the server's `totalWorkOrderPrice` = sum of page rows); no Part
Sales tab on an asset page. A $0.00 sale shows "-" — same on production (P2-78), unchanged.

## Branch changes (shared feature branch — restored where it matters)
- Org feature **QuickBooks** switched OFF to add fees (guard "Map a Fee item in Settings → QuickBooks"; QB not connected),
  then restored — list re-read equal to the snapshot (data/flags-before.json).
- Temp role "ZZAUTOTEST SV-9226 no financial data" created, Tech (ba74948b…) moved to it, then back to **Technician**
  (verified equal) and the role deleted (re-read 404).
- New ZZ test sales P9667-447 (TestVT1; fees/discount; one part moved out) and P9667-448 (core part, picked; core returned and put back).

## Harness lessons
- `s.confirm()` did not recognise a dialog confirm labelled "Put Back" (`button_confirm_dialog`) → nothing was sent. Fixed: it now also
  follows `button_confirm_dialog` and `*_positive_answer`.
- Part sale page: at 1600/1700 px width the core row's ⋮ and Return Core sit off-screen; use 1900 px. The page scrolls inside its own
  frame, so fullPage screenshots do not extend it — use a taller window (1400) to get the Financial Info Total in view.
- Return Core acts on the FIRST click with no dialog; cancel lives on the core row's ⋮ (Returns list hides Cancel/Delete for
  core-credit reasons by design — `Ve(return_reason)` in ReturnRequests.js).

## Per-ticket asks
Screen recording / technical details: asked at start, no answer yet → both left out (Rules 104/84 default).

## Posted
Comment **78207** (2026-10-08 02:29 CDT). Read back: success panel first; 1 media (2150×932); table 11 rows + header.
Gate: marker unchanged, PR head 129d22f, ticket TESTING QA, last comment 78086, fingerprint scan clean.
