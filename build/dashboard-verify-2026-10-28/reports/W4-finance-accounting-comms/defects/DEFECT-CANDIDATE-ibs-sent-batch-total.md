# DEFECT CANDIDATE — IBS Batches > Sent: a batch's Total ($9,473.35) is $290.06 more than the invoices inside it ($9,183.29)
Project: Reports — IBS Batches (SV-2144) · Prepared: 2026-10-28 · Prepared by: W4 finance / accounting / communications lane
TestRail case: none — independent pass, no TestRail writes

## VERDICT: HELD — fails A2 (no written source states the batch total rule) and A1/A8 on fresh data (the cause could not be re-created). PO question RQ-3. Ticket drafted in `TICKET-IBS1-sent-batch-total-not-sum-of-invoices.wiki`.

| # | Check | Verdict | Evidence |
|---|---|---|---|
| A1 | Reproduced TWICE on the CURRENT build | ⚠️ | Same batch observed twice: API 20:24 UTC and screen 20:30 UTC (picture IBS1-1), Staging Lethbridge - 4310, batch dated **Oct 2, 2026**: row Total **$9,473.35**, Balance $9,473.35, Unpaid; its 9 invoices (INV-S3-17282, -17353, -17447, -17436, -17479, -16509, -17497, -17496, -16914) total **$9,183.29**. The batch's own IBS export file says "Invoices,$9183.29". The other three batches (Lethbridge Sep 16; Heavy Duty two) add up exactly. **Fresh-data attempt:** created a batch of S2-16140 + S2-16146 at Heavy Duty ($1,862.51), removed one invoice → batch total correctly became $1,270.34, removed the other → batch gone, both back in Ready to Send. So "remove from batch" is NOT the cause; the cause is unknown. |
| A2 | Expectation quoted VERBATIM | ❌ | SV-2144 (Done): *"Within the sent tab, each sent "batch" should be grouped in one main row, that is expandable to show all the invoices within that batch."* — it does not say the row's Total is the sum of those invoices. |
| A3 | NOT unfinished | ✅ | SV-2144, SV-9623 Done. |
| A4 | NOT already reported | ✅ | `project = SV AND text ~ "IBS" AND text ~ "batch" AND (text ~ "total" OR text ~ "amount" OR text ~ "balance") AND (summary ~ "batch" OR summary ~ "IBS")` → 18 hits (SV-11744, SV-11572, SV-8403, SV-8258 "Sent batch total $20 lower than modal Payment amount" Done, SV-9623, SV-9705 …) — none for a batch total above its invoices. |
| A5 | NOT by design | ⚠️ | Unknown. The difference is not the IBS service charge ($174.48) nor any credit (none in this batch). |
| A6 | NOT environment / data | ⚠️ | One batch only; could be a data artefact of an invoice changed or reversed after batching (no $290.06 invoice found in 8,034 invoice records). |
| A7 | Parent | — | SV-2144 / SV-9623 (to confirm). |
| A8 | Evidence | ✅ | IBS1-1 picture; `results-ibs.json` (I6); export file content in RESULTS.md. |
| A9 | Adversarial | ❌ | Refusals 3 and 6 not defeated. |
| A10 | Rule 62 | ✅ | Not filed. |

## IF NOT ADMISSIBLE
A PO / developer question: should the Sent batch Total always equal the sum of the invoices and credits shown inside it? If yes, a developer should find what changed batch 7af04085 (Lethbridge, 2 Oct 2026). Recorded in `PO-QUESTIONS.md` RQ-3.
