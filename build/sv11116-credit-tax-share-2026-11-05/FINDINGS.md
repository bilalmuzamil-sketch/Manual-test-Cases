# SV-11116 — Manual customer credits carry their tax share (QA branch sv11116)
Ticket: Bug · High (PO's) · TESTING QA · assignee parth fadadu · labels: bug · QA assignee: none · Powertools plan: none (customfield_10419 empty).
Mode (QA lead): API mode, no recording, no technical section. Two comments if not all pass (Rule 115).

## Sources read (5 Nov 2026)
- Description (MAX/Qazi Sufyan, 9 Oct): goodwill/manual credit applied to a taxed invoice must reduce tax proportionally; Sales Tax report must reflect it; exempt → no tax effect.
- Chris Ward 79413 (23 Oct) rulings: 1 invoice unchanged, credit carries its own tax share, invoice+payment views show "Credit applied: $100.00 (incl. GST $4.76)"; 2 tax-included ($100 = $95.24 + $4.76 at 5%); 3 rate of the invoice it is applied to, exempt = none; 4 split credits use each invoice's rate; 5 reduction counts in period APPLIED; 6 from now on only; 7 refund reducing a taxed invoice follows same rule, refund of overpayment/unused balance carries no tax; 8 QuickBooks credit memo carries pre-tax + tax line (Intuit sandbox).
- Parth 79545 (QA handoff, updated 29 Oct): test cases 1–14 + regression (see comment). NOTE differences vs Chris: "Customer Payments tab: no tax text (unchanged)" while Chris rule 1 says invoice AND payment views show the split — to check.
- Parth 80194 (5 Nov 05:11 −0500): ready on https://sv11116.qa.shopview.com/

## Checklist (handoff) — status
| # | Check | Status |
|---|---|---|
