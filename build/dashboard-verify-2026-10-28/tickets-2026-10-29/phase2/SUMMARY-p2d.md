# Phase 2 · Worker D (p2d) · 29 Oct 2026

Saved by the coordinator from Worker D's hand-back. The harness blocked the worker from writing this file itself.

Nothing filed: no Jira, no TestRail, no Doc edit, no git add or commit by the worker.

- **Build:** v26.43.2-f8698cb on every capture, 00:03–00:27 UTC.
- **Session:** the worker's own, `/tmp/cln/p2d/sess.txt` (mode 600).
- **Time zones:** every server read ran with TZ=<zone> after change-location, and every browser run had timezoneId and TZ set to the zone. Zones per picture are in `pictures/P2-D-meta.json`.
- **Tools:** `tools/p2d/`.

## Verdicts

| ID | Q | Verdict | Draft | Relates to |
|---|---|---|---|---|
| D1 | 33 | DRAFTED. P2-2352: $443.43 on the Invoices tab, $543.43 on A/R Detail (Karachi). | P2-D1-…md | SV-5026, SV-11690 |
| D2 | 34 | DRAFTED. Batch Total $9,473.35; its 9 invoices add to $9,183.29; the export says $9,183.29 (Edmonton). | P2-D2-…md | SV-2144 |
| D3 | 35 | DRAFTED. INV-S2-16924 for $0.00 is listed in Ready To Send (Karachi). | P2-D3-…md | SV-2144 |
| D4 | 36 | DRAFTED. Last Week shows 100 of 255 notes, and the screen never asks for page 2 (Karachi). | P2-D4-…md | NOT FOUND |
| D5 | 37(a) | DRAFTED. Credit Memo Create, Apply and Refund rows have a blank No., and so do most Deposit Application rows. | P2-D5-…md | SV-2871, SV-4929 |
| D6 | 37(b) | DRAFTED, credit memos only. CM2-4533 is listed twice with two different errors. | P2-D6-…md | SV-2871 |
| D7 | 38 | DRAFTED, re-created on fresh data. The invoice says COD; the export shows the customer's current Net 30 (Toronto). | P2-D7-…md | SV-1878, SV-11676 |

## Re-checks (UTC, 29 Oct)

**D1 (Q33)**, 00:04–00:12, Heavy Duty, Asia/Karachi.
- Server: A/R Detail for P2-2352 is 543.43. The customer's own account (Invoices-tab data) is 443.43, with DEP-4763 at −100, "Held".
- P2-2439: 21.00 vs 16.00, with DEP-4801 at −5, Held.
- Screen: the same figures on both pages.
- Not re-created on fresh data. The Deposits tab was not looked at on screen today.

**D2 (Q34)**, 00:04–00:19, Lethbridge, America/Edmonton.
- Server: batch 7af04085 has amount and balance 9,473.35. Its 9 invoices sum to 9,183.29, with no credits.
- Export: Invoices $9183.29, S/C $174.48, Net $9008.81.
- Screen: matches the server. The other sent batches add up.
- Cause not found; only the symptom is reported.

**D3 (Q35)**, 00:04–00:19, Heavy Duty, Asia/Karachi.
- S2-16924: amount 0, balance 0. The invoice record total is 0.00, status pending.
- Screen: the invoice is listed.
- Lethbridge's Ready To Send list is empty.

**D4 (Q36)**, 00:05–00:18, Heavy Duty, Asia/Karachi.
- Screen: Last Week (18–24 Oct) shows 100 cards. The screen asks for 100 rows; the reply says more exist, but no further request is made and there is no pager.
- Server: 255 notes.
- The All / Author / Mention filters were not looked at on screen today.
- No owning story found.

**D5 (Q37a)**, 00:04–00:20. Heavy Duty, Asia/Karachi (screen and server); Lethbridge, America/Edmonton (server).
- Heavy Duty rows with a blank No.: credit memo create 255/255, apply 88/88, refund 40/40, deposit application 23/31, payment 143/208.
- Lethbridge rows with a blank No.: credit memo create 28/28, payment 5/9.
- Payments have no number of their own yet (SV-10588, Board Backlog).

**D6 (Q37b)**, 00:04–00:27, Heavy Duty, Asia/Karachi.
- 111 records have repeated rows: credit memo create 60, apply 43, deposit application 8.
- Only the credit memo create duplicates are claimed. The apply and deposit-application rows each name a different item, so they may be one row per item.
- Not claimed: 118 Invoice Create pairs that share a number but point to different invoices (probably a reversed invoice and its replacement).

**D7 (Q38)**, 00:05–00:14, DVI Test, America/Toronto.
- Fresh data: customer on COD → S1-38216 invoiced (COD) → term changed to Net 30 on screen → exported on screen → Terms shows "Net 30".
- Existing data at Heavy Duty, Last Month: 7 COD invoices show Net 30/50/60. Their customer cards now say Net 30/50/60.
- **Correction to Q38's wording:** the customers in those examples now say Net 30/50/60, not COD. The export uses the customer's current term.

## Test data created (DVI Test)

| Record | Id |
|---|---|
| Company "ZZAUTOTEST P2D Terms" | 64b8444e-8f5b-48d6-9cfe-0c4fa1adb4b6 |
| Contact | 6f333c27-13db-4f71-9f71-ab457a4a74a4 |
| Asset ZZ-P2D-TERMS | b8de8ace-6a58-45f0-abb4-54aa7f144514 |
| Work order S1-38216 | 37fa09a3-7317-4097-bef4-7ab894c40156 |
| Invoice ($135, COD) | b0099f00-7006-4f6e-94b7-14e815983958 |

One write failed: `customers/change` returned HTTP 500 and changed nothing. The term change was then made on screen.

## Duplicate searches (project SV, read-only JQL)

1. **IBS batches:** `created >= -365d AND (text ~ "IBS batch" OR summary ~ "IBS" OR summary ~ "batch transactions")`
   → SV-8258, SV-8403, SV-11572, SV-11744. None covers D2 or D3.
2. **Unexported, notes and export reports:** `created >= -365d AND (summary ~ "unexported" OR text ~ "\"QB Unexported\"" OR summary ~ "notes report" OR text ~ "\"Notes Report\"" OR summary ~ "export reports" OR (text ~ "export" AND text ~ "terms" AND text ~ "invoice"))`
   → SV-11721, SV-11726, SV-11836, SV-11504, SV-10630. None covers D4–D7.
3. **Deposits, notes limit, duplicates, terms, $0.00:** `created >= -365d AND ((text ~ "deposit" AND text ~ "\"part sale\"" AND (text ~ "aging" OR text ~ "A/R")) OR (text ~ "notes" AND text ~ "100" AND text ~ "report") OR (text ~ "unexported" AND (text ~ "twice" OR text ~ "duplicate")) OR (text ~ "\"customer invoice\"" AND text ~ "export" AND text ~ "terms") OR (text ~ "IBS" AND text ~ "\"$0.00\"") OR summary ~ "credit terms")`
   → SV-11690, SV-11638 / SV-11676, SV-11899. None covers D1 or D7.
4. **Owning stories:** `issuetype in (Story,Task,Epic) AND (summary ~ "A/R Aging Detail" OR summary ~ "AR aging detail" OR summary ~ "notes report" OR summary ~ "unexported" OR summary ~ "Export Reports" OR summary ~ "customer invoice export" OR summary ~ "QuickBooks export report")`
   → SV-5026, SV-2871, SV-4929, SV-1878, SV-5780, SV-10588.
5. **Notes report story:** `issuetype in (Story,Task,Epic) AND summary ~ "notes" AND (summary ~ "report" OR summary ~ "communication" OR summary ~ "reminders")`
   → no Notes report story.
6. **Candidate stories:** `key in (...)` read for summaries and status.

## Draft comment for SV-11441 (Q32). NOT posted; waits for the QA lead.

> Finding from the 28 Oct 2026 report check (staging v26.43.2-f8698cb, Staging Heavy Duty - 9919, session and browser on Asia/Karachi). On A/R Aging Collection, a credit made on the chosen date is listed with Past Due 1. CM2-4462 (E2E Credits Customer), made 30 Sep 2026, shows 1 day past due with Date 30 Sep 2026; so do CM2-4463 on 30 Sep and CM1-4535 on 28 Oct. This matches SV-5606 ('Today's Credits … displayed with 1 as a Past Due'). The A/R PRD says 'If the calculated days are ≤ 0, the transaction is not past due and it's not shown on the report'. Chris Ward (28 Oct, Q32): 'Not a defect for now. Today matches SV-5606. SV-11441 will decide how a same-day credit ages after a QuickBooks check.' Linking here.

## Optional comment for SV-11690, if D1 is posted as a comment instead of a new ticket

> Re-checked 29 Oct 2026 (v26.43.2-f8698cb, Heavy Duty, Asia/Karachi). Held work-order deposits are out of A/R Aging as intended, but part sales still break 'aging = Invoices tab'. A part-sale deposit stays Held after invoicing: the Invoices tab takes it off, A/R Aging does not. P2-2352 (TestVT1): $443.43 vs $543.43 (DEP-4763, $100). P2-2439 (Bravo Mechanical Services): $16.00 vs $21.00 (DEP-4801, $5). Chris Ward (Q33): 'Yes. Once the part sale is invoiced, its deposit lowers the A/R balance to match the Invoices tab. That's the same rule as SV-11690. Defect.'

## Open for the QA lead

- **D1:** file it as a new ticket, or post it as a comment on SV-11690 instead?
- **D4:** which story should it "relate to"? None was found.
- **SV-11441:** go-ahead to post the comment above.
