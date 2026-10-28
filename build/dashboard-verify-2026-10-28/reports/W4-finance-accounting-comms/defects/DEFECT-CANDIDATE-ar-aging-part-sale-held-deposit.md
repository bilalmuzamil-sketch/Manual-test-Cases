# DEFECT CANDIDATE — A/R Aging shows a part-sale invoice at its full amount although the customer's $100 deposit on that part sale is already counted on the customer's account
Project: Reports — A/R aging · Prepared: 2026-10-28 · Prepared by: W4 finance / accounting / communications lane
TestRail case: none — independent pass, no TestRail writes

## VERDICT: HELD — belongs to the SV-11690 family (fix is "Ready for Production"); recommend a comment on SV-11690 rather than a new ticket. PO / QA-lead question RQ-2.

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ✅ | Build `v26.43.2-f8698cb`. API 19:41 UTC: of 1,355 open invoices compared one by one with each customer's own account (Customers > Invoices tab data), **all but 6 agree**; 4 are SV-11691's invoices; the other 2 are part sales with a deposit still "Held": **P2-2352** (TestVT1) A/R $543.43 vs account $443.43 — deposit DEP-4763 $100 held on P-2352; **P2-2439** (Bravo Mechanical Services) A/R $21.00 vs account $16.00 — deposit DEP-4801 $5 held on P-2439. Screen 20:39–20:41 UTC: Customers > TestVT1 > Invoices → P2-2352 Total $543.43 / Balance **$443.43** / Partially Paid (picture DEP1-1); Reports > A/R Aging Detail, 2026-10-29, Current → P2-2352 Open Balance **$543.43** (picture DEP1-2). The held deposit is not listed as an A/R credit either, so the customer's A/R is $100 too high. |
| A2 | Expectation quoted VERBATIM from the CURRENT source version | ⚠️ | The A/R PRD (82083852 v25) does not mention deposits at all. The only written rule is in SV-11690 (Expected): *"one rule for deposits in A/R (aging = Invoices tab / statement, see SV-10799); a held deposit is not an overdue credit — not subtracted from aged A/R, not aged into 1–30/31–60."* Here the Invoices tab DOES subtract it (through the invoice balance) and A/R does not — "aging = Invoices tab" is broken in the other direction. |
| A3 | NOT an unfinished feature | ⚠️ | SV-11690 is "Ready for Production" — its fix (held work-order deposits leave A/R) is on staging and is what produces this gap; Part Sales deposits (SV-10269) are Done. |
| A4 | NOT already reported | ⚠️ | Family of SV-11690 (open). `project = SV AND text ~ "deposit" AND (text ~ "\"part sale\"" OR text ~ "\"parts sale\"") AND (text ~ "aging" OR text ~ "balance" OR text ~ "A/R") AND created >= 2026-06-01` → SV-11745, SV-11689 (applied WO deposit not in invoice balance, Done), SV-11305, SV-10485, SV-10447, SV-10269, SV-9647 … none for this case. |
| A5 | NOT by design | ⚠️ | The code comment for SV-11690 says a work-order deposit "not yet applied … is not credit"; the part-sale flow reduced the invoice balance without recording the deposit as applied, so the two rules collide. |
| A6 | NOT environment / data / role | ✅ | Two customers, two part sales, Admin. |
| A7 | Correct parent | — | SV-11690 (comment) — QA lead to decide. |
| A8 | Evidence complete | ✅ | DEP1-1, DEP1-2 pictures; raw `results-ar-hd_2026-10-29.json` (L3). Steps to create fresh data not yet run (part sale + deposit + invoice) — NOT VERIFIED on fresh data. |
| A9 | Adversarial self-review | ⚠️ | Refusal 5 ("part of SV-11690") is correct — hence the recommendation to comment there. |
| A10 | Rule 62 | ✅ | Nothing filed or commented. |

## Draft comment for SV-11690 (if the QA lead prefers that route)
"Re-checked on staging v26.43.2-f8698cb (28 Oct 2026): held work-order deposits are now out of A/R Aging (4 Star Truck Repair no longer shows DEP2-4716 / DEP2-4717). One gap remains for PART SALES: a deposit taken on a part sale stays 'Held' after the part sale is invoiced, the customer's Invoices tab already takes it off the invoice balance, but A/R Aging now shows the invoice at full and does not list the deposit. Examples: P2-2352 (TestVT1) — Invoices tab $443.43, A/R Aging $543.43 (DEP-4763 $100 held); P2-2439 (Bravo Mechanical Services) — $16.00 vs $21.00 (DEP-4801 $5 held). So 'aging = Invoices tab' still fails for these."

## IF NOT ADMISSIBLE
Recorded in `PO-QUESTIONS.md` RQ-2 and `RESULTS.md` (A/R ledger check L3).
