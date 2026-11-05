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
| 1 | Goodwill $100 credit on taxed invoice | PASSED — S11116-17580 (ZZAUTOTEST SV11116 T1 61385), invoice GST 5% $49.71 on $994.17. Issue Credit (no parts) $100 store credit CM-4189 → ticked invoice + credit → New Payment (invoice payment $100, cash $0) → balance $943.88. Report row GST $44.95, ⓘ icon, tooltip "Invoice GST: $49.71 / Less GST on CM-4189: −$4.76 / Reported GST: $44.95", per-rate total 44.95; CSV Tax 44.95 + "Credit tax" 4.76; Finance tab: invoice GST $49.71 unchanged, "(Credit) Nov 5, 2026 - CM-4189 / incl. GST $4.76 / $100.00". |
| 2 | Icon: hover | PASSED (opens, closes on leave). |
| 2 | Icon: click stays open | **FAILED** — click opens, but it closes as soon as the mouse leaves; 2 runs (clicktip.mjs). Chromium 153 desktop 1600×900. |
| 2 | Icon: tap (iPhone 12 Pro preset) | PASSED (tap opens, stays 3s, second tap closes). |
| 2 | Icon: keyboard Enter / Space | PASSED. |
| 12 | Invoice document | PASSED (see 1). |
| — | Customer Payments tab | No tax text (dev: "unchanged"); Chris 79413 rule 1 says "invoice and payment views show the split" → PO question. |
| 3 | Two credits $50 + $30 | PASSED — S11116-17581: CM-4190 −2.38, CM-4191 −1.43, row GST 45.90, one icon, tooltip lists both. |
| 4 | Reverse the payment | PASSED — S11116-17582: credit CM-4192 applied (GST 44.95, icon) → Payments tab bin → "Reverse" → POST reverse-customer-payment 201 → credit back to Unapplied; invoice unpaid so it leaves the report (report lists Paid / Partially Paid only); after a $10 cash payment the row shows GST 49.71, no credits, no icon. |
| 5 | Credit = full total | PASSED — S11116-17583: $1,043.88 credit CM-4193 → status Paid, tax 0.00, credit tax 49.71 (= invoice GST, not more). |
| 6 | Refund from taxed invoice | PASSED — S11116-17584 paid cash, then Open only OFF → tick invoice → Issue Credit → parts OFF → $50, Issue Refund, Cash → CM-4194 (originKind invoice) → GST 47.33, credit tax 2.38. |
| 7 | Refund on invoice paid last month | Behaves as the handoff says — S11116-17588 paid 20 Oct (report Oct: GST 49.71); refund $50 on 5 Nov → Oct report no longer lists it, Nov lists it with paid date 2026-10-20, GST 47.33, CM-4195 2.38. **QUESTION for Chris**: his rule 5 says only the reduction counts in the period applied; here October's total loses the whole $49.71. |
| 8 | Exempt (0%) invoice | PASSED — customer EX set to Exempt on screen (Edit Customer > Taxes), S11116-17590 $994.17; $100 credit CM-4196 → tax 0, no credits, no icon, no "incl." text. |
| CW4 | Credit split across GST + Exempt invoices | PASSED — CM-4197 $150: $100 to S11116-17590 (exempt) → 0; $50 to S11116-17591 (GST) → −2.38. |
| — | Report totals ignore the search box | OBSERVATION — search=S11116-17581 returns 1 row but totals = 2 invoices. Compare with production before deciding. |
