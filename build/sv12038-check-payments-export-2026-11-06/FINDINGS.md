# SV-12038 — Duplicate Check payments in the Customer Payments export (6 Nov 2026)

Ticket: https://shopview.atlassian.net/browse/SV-12038 (Bug, TESTING QA, assignee Milomir Kotlajic, no `accounting` label, Product Area Work Orders). No comments, no Powertools plan, no developer handoff.
Sources read: description, the three ticket attachments (kept OUT of this public repo — they are the customer's own data).
Mode: Board-2 defaults (API mode, no recording, no technical section).

## Builds
- Production `app.shopview.com` v26.45.2-198e632 (test org 72b2cc90…, Trucks Hill 2)
- QA branch `sv12038.qa.shopview.com` v26.45.2-df7aeed (org d55bc308…, Staging Heavy Duty - 9919)

## How the customer got two "Check" (root cause, observed)
- Payments store the method's CODE (`payment_method:"CHEQUE"` in `POST /api/customer-account/create-customer-payment`).
- The system "Check" has code `CHEQUE`. Production accepts a new method named **"Cheque"** and gives it code **`CHEQUE`** too (201). Same-name variants (check / "Check " / " Check" / CHECK) are refused on production; a double-click on Save creates only one.
- With "Check" + "Cheque" both active, the Customer Payment export lists every check line TWICE.

## Production BEFORE (reproduced)
1. Settings > Payment Methods > New Payment Method > "Cheque" > Save & Close → added.
2. Customer ZZAUTOTEST SV11116 PR2 09715 > Invoices: tick S2-1933 ($529.79 due) + S2-1934 ($429.79 due) > New Payment > Check > ref ZZ12038-1 > Make Payment (201, one payment $959.58).
3. Reports > Export Reports > Customer Payment > This Month > Export (`GET /api/reporting/export/customer_payment?report=customer_payment&range=this_month`) → ZZ12038-1 appears 4 times (S2-1933 x2, S2-1934 x2) = $1,919.16.
4. Deleted "Cheque" (trash > Delete) → export shows ZZ12038-1 twice (once per invoice). The doubling needs two ACTIVE methods with one code.
- Earlier one-method check payments (ZZ9055-EX, ZZ9055-NT1, last month) were not doubled; the vendor "Check" (also CHEQUE, type 2) does not cause doubling.
- Production setting restored: "Cheque" and "ZZ12038 Dbl" deleted; list re-read = the original 9 entries. Payment ZZ12038-1 left in place (test data).

## QA branch AFTER
| # | Check | Result |
|---|---|---|
| 1 | Add "Check" (customer tab) | refused "Payment method already exist" — PASS |
| 2 | Add "Cheque" (same code CHEQUE) on screen | refused — PASS |
| 3 | cheque / CHEQUE / Debit Card (=DEBIT_CARD) / Email Transfer (=EMAIL_TRANSFER) / Gift Card | all refused — PASS |
| 4 | "Gift  card" with two spaces on screen | screen sends "Gift card" → refused — PASS |
| 5 | New unique name (ZZ12038 New) | created — PASS |
| 6 | Vendor tab: Check (code CHECK) / Cheque (code CHEQUE) | both created, different codes — PASS |
| 7 | One Check payment ZZ12038-B1 over S2-17292 + S2-16913 (Colesville Diesel Repair) → export | 2 rows, $3,205.72 + $1,211.85 = $4,417.57 = the payment — PASS |
| 8 | Export for an account that ALREADY has two active methods with one code (the customer's state; acceptance: 000118 once, history intact) | NOT RUN — cannot be built on the branch through any screen now that the duplicate is refused. Asked the developer (Rule 122). |

API-only observation (Rule 94, not filed, told the QA lead): `POST .../payment-methods/create {"name":"Payroll  Deduction"}` (two spaces) is accepted on the branch (code PAYROLL__DEDUCTION — a different code, no export effect). The screen collapses spaces, so a user cannot do it.

Accounting effect (Rule 121): the payment itself is one payment; the doubling is in the export file used for reconciliation. QuickBooks is not connected on the branch, so a sync was not observed.

Exhibit: ev/jira/01-check-export-before-after.png. Scripts: scripts/{pmui,pmapi,pmdel,pay,apiexp,doexp,findinv,custinv,exhibit}.

## Unblocked + PASSED, 9 Nov 2026 (QA lead: "see if you can unblock yourself")
- Branch was asleep (quick-login 302 → sleep.qa); woken with toggleQaEnv. Build v26.45.2-df7aeed (unchanged).
- Fix branch SV-12038 (head ceefa4ac): migration `Version20261102200000.php` deletes existing same (org,type,code) rows (keeps mapped/oldest/lowest id) and adds unique `paym__organization_id_type_code_unq` (orm.xml L46). So row 8 "account that already has the duplicate" cannot be built on any fixed branch — the DB refuses it. My 80376 ask to Milomir was answered by his own code.
- Live: 15 customer + 8 vendor methods, no shared code within a type; 3 simultaneous creates of "ZZ12038 Race 87216" → 1×201, 2×400; export this_month re-run = ZZ12038-B1 2 rows $3,205.72 + $1,211.85 with vendor "Cheque" (CHEQUE) present; S2-17292/S2-16913 Finance tab "Nov 6, 2026 - Check".
- Deleted my own API-only "Payroll  Deduction" (two spaces) test row so the exhibit doesn't look like a duplicate.
- Posted 80489 (green PASSED, 7 rows, picture ev/jira/02-one-check-unique-rule.png, code links). Label QAcomplete; Rejected → In Progress (16) → Code Review (3) → TESTING QA (4) → QA Complete (10). QA Assignee already Bilal.
- Gate: build marker re-read; comment read back (panel, 7 rows, 1 media). Learning: Rule 125 + playbook §BG.
