# SV-11441 — A/R and A/P aging: a credit dated on the As of day is Current with Past Due 0 (10 Nov 2026)

Branch sv11315 (Nemanja's handoff 80625; shared notes SV-11315 80616), build v26.45.2-6a8b89c (last-mod 10:27:26 GMT, etag dcffd843…;
re-read before posting: same). PR #4262. PRD "A/R and A/P Report Sorting, Export and Location Filter" (Confluence 947650561, v11),
S1-R5a: "A credit memo, deposit or vendor credit counts its own date as its due date, so one dated exactly on the as-of date is in
Current with Past Due 0, not in "1-30 days past due". This is how QuickBooks ages them (SV-11441)." Saved: prd.md.
Mode: API mode defaults (no recording, no technical section). Rule 121: Mudassir already compared QuickBooks + AccountingHub (79851):
a credit dated on the as-of day is Current in both — the change lines up with them.

## Test data (branch, left in place)
- CM11315-4190 $12.34 dated 10 Nov and CM11315-4191 $4.56 dated 9 Nov — Andrews' Truck & Trailer Repair LLC, created ON SCREEN
  (Customer > Invoices > Issue Credit; the dialog has a date field).
- DEP11315-4705 $825.96 — unused remainder of a $1,000 deposit on S-17580 (ZZAUTOTEST SV11441 D 16760), invoiced today.
  (A deposit held on an un-invoiced work order is not a credit per SV-11690 — DEP-4703 on S2-17435 correctly not listed.)
- Vendor credits C-13665 $7.89 (same request the screen sends) and C-13666 $3.21 (on screen: Vendor > Unpaid Invoices > New Credit;
  no date field, so a vendor credit is always dated today) — Abadi's Diesel Repair.
- CM-4189 (first API attempt with the company id instead of the customer account id) does not appear anywhere — my set-up mistake.

## Checks (handoff list), As of 11/10/2026 unless stated — all PASSED
1 A/R Detail: CM11315-4190 + DEP11315-4705 in Current ("Credit Memo"/"Deposit"); CM11315-4191 in 1-30 (screen ev/br-ar-detail-3160).
2 A/R Collection: CM11315-4190 Due Date Nov 10, Past Due 0; CM11315-4191 Past Due 1; DEP11315-4705 Past Due 0 (screen, CSV, PDF ev/br-ar-collection).
3 A/P Detail: C-13665/C-13666 Current, Past Due 0 (screen, CSV, PDF with Vendor filter Abadi; ev/br-ap-detail-abadi).
4 A/P Unpaid: C-13665/C-13666 Due Date and Past Due empty ("—") (ev/asof-checks.json).
5 A/R Summary: Andrews Current -12.34, 1-30 -4.56; A/P Summary current -11.10 (Abadi).
6 Earlier As of: CM11315-3841 (Doi Truck Center, 23 Jul): As of 07/23 Current/0, 07/24 1-30/1. C-13662 (Meadowbrook, 31 Aug): 08/31 Current/0, 09/01 1-30/1.
7 Summary = Detail bucket by bucket, A/R and A/P, Past due Any: 5/5 + 5/5 equal (current -838.30 and -11.10).
8 Past due 31-60 ticked: credits still listed; today's in Current; Detail CSV "Aging Bucket" = Current for CM11315-4190 / DEP11315-4705.
9 Bills: 5956 (Abadi) due 5 May: As of 05/05 Current 0, 05/06 1-30 1. IN00267805 (Alameda) due 14 Mar 2025: As of 03/04/2025 Current -10 (Detail and Unpaid).
10 Calendar days at the location: every row with a due date on A/R Collection (145) and A/P Unpaid (423) = As of minus the due date's
   local date (America/Edmonton, current rules), 568/568, incl. 33 bills due in the evening local time; 51 vendor credits show "—".

## Production BEFORE (v26.45.3-fc08f23, 10 Nov)
- CM2-4410 $12.34 (Alpha Freight ZZ96929, Issue Credit on screen, today): A/R Aging Collection shows "Today … Credit … Past Due 1".
- Vendor credit C-18194 $7.89 (Northgate ZZMAGENTA Parts, today): A/P aging-detail bucket days1to30, daysPastDue 1.
Exhibits: ev/exhibits/01-before-after-ar-collection.png, 02-after-ar-ap-detail.png.

## Side observation (Rule 93 bucket (d) UNVERIFIED, not in Jira)
A/P Detail PDF with Past due 1-30 (1,602 lines, under the 2,000 PDF limit) — the export request returned 500 after 32 s
(requestId c77dfb4f-8281-4393-844b-f8a9b6297dcd) and the screen showed no file and no message within 60 s. Not searched in Jira,
not repeated; outside SV-11441 (exports are SV-11533 / SV-12141). Asked the QA lead.

## Status at hand-over
QA Assignee was EMPTY when the QA lead asked me to test (read ~11:00 UTC); at the pre-post re-read (06:16 CST) it is Mudassir Qamar,
status TESTING QA. Nothing posted — asked the QA lead whether to post (rule: someone else is QA assignee).

## Posted (QA lead 10 Nov: post, do NOT move to QA Complete; then QuickBooks if needed, QB result in its own comment)
- Comment 80649 green PASSED (13 rows, pictures 310744b4 / 90d2e25a). Status left at TESTING QA, QA Assignee left as Mudassir,
  no label added. Gate: marker re-read (same), ticket comments re-read (nothing new since 80625).
- Extra check before posting: work order S2-16654 opens from A/R Collection. Bill 5956 on A/P Unpaid shows as plain text
  (no link) in the Abadi group; not part of SV-11441 (links are SV-11537), not investigated.

## QuickBooks (separate comment, not posted)
- Intuit sandbox sign-in from the headless browser (login from /tmp/intuit): email + password accepted, then Intuit shows
  "Need help signing in? ... submit an account recovery request" (qb/intuit-signin-refused.png). Stopped after one try to avoid
  locking the account. Asked the QA lead.
- What the change touches: the six aging reports only (reading); nothing new is sent to QuickBooks. Mudassir's 79851 (30 Oct)
  already shows QBO puts a credit dated on the as-of day in Current and moves it to 1-30 the next day.
