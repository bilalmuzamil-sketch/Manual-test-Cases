# SV-11970 — Finance tab and invoice show a deposit on the wrong day — PASSED

Ticket: https://shopview.atlassian.net/browse/SV-11970 (ours; developer Dusan Radulovic; status TESTING QA).
QA branch https://sv11970.qa.shopview.com — front end build v26.43.3-551fa20 (read 3 Nov 12:2x UTC).
Pre-checks: no `accounting` label, QA Assignee empty -> clear to test. No developer "Ready for QA" handoff comment on
the ticket. QA lead choices (3 Nov): API mode · no recording · no technical section · produce the late-evening
condition by changing a location's time zone (production: restore after).

## Sources
- Ticket description (ours, 29 Oct): Finance tab + downloaded invoice must show the Deposit Date that was picked,
  the same day as the customer's Deposits tab.
- Confluence "Deposits for Work Orders" (quoted in the ticket): Deposit Date default Today (device), can be in the past;
  invoice Payments section "(Deposit) {date} + {payment method}"; Customer -> Payments "Date: the date the deposit was made".
- SV-5968 (open): "All the dates across the SV app should be rendered the same way. The correct rendering is based on the
  Current Location."
- Dusan 79782 + Chris 79844 (29 Oct): deposits saved BEFORE SV-11573 at late-evening times are stored one day early;
  after this fix the Finance tab/invoice will show that stored day (= Deposits tab and QuickBooks). Chris: "Good to go as
  is ... leave the older stored dates alone". Rule 109 check: the PRD text covers what is shown for a deposit (its date);
  it is silent on correcting legacy stored data, so the ruling does not contradict it -> applies to legacy data only.

## Production before (build v26.45.0-8e138e1, deployed 3 Nov 09:59 GMT) — REPRODUCED
- Location "ZZAUTOTEST C614715 Empty Location" (ours, normally Asia/Karachi) set to Pacific/Kiritimati (UTC+14),
  browser time zone the same. Browser clock Wed 4 Nov 02:35; UTC Tue 3 Nov 12:35.
- New work order S-1907 (9cc8d0e1…, customer ZZAUTOTEST Aabridge Freight, contact ZZAUTOTEST SV11970 prod-before set —
  without a contact the Finance tab is greyed out "Please select a contact for the asset").
- On screen: Finance tab -> Add Deposit -> Deposit Date defaulted to 11/04/2026, payment method Direct Payment (Bilal)
  (first in the list), amount 5.00 -> Record Deposit -> toast "A deposit was created". DEP-5038.
  Request depositDate "2026-11-03T10:00:00.000Z" (local midnight of 4 Nov in UTC); stored "2026-11-03T12:35:22Z".
- Finance tab: "(Deposit) Nov 3, 2026 - DIRECT PAYMENT (BILAL)" while the same document reads "Invoice Date: Nov 4, 2026".
- Downloaded PDF (ev/prod-before/4-downloaded.pdf): "(Deposit) Nov 3, 2026 ... $5.00", "Invoice Date: Nov 4, 2026".
- Customer -> Deposits tab: DEP-5038 "Today" (4 Nov).
- Location time zone restored to Asia/Karachi; every field compared with the saved copy (ev/prod-location-original.json):
  0 differences. Test data (S-1907, DEP-5038, contact) left in place (production test-data rule).
- Evidence: ev/prod-before/ (1 finance before, 2 dialog filled, 3 finance after, 4 pdf, 5 customer deposits, result.json).

## Branch (build v26.43.3-551fa20, marker identical on every run 13:00–13:13 UTC 3 Nov)
Fresh sign-in cookies supplied 3 Nov (in /tmp only). Customer 4 Star Truck Repair (6a7b6afc…), vehicle 2020 Ford Transit;
each work order got a ZZAUTOTEST contact (needed for the Finance tab). Deposits recorded ON SCREEN: Finance tab -> Add Deposit
-> payment method EFT (first in list) -> amount -> Record Deposit; Finance tab, downloaded PDF and customer tabs read after.
Location switching: `ENV=branch LOCID=<id> node scripts/prodloc.mjs set|restore` (restore compared field by field: 0 differences).

Lesson in-pass: a new work order is created in the SESSION's location (Heavy Duty), not the `workplace_id` sent, so the first
attempt (Lethbridge on Kiritimati, WO S11970-17580/DEP-4703) ran on Edmonton time and proved nothing -> kept as
ev/branch-K1-wrong-location-edmonton, Lethbridge restored, Heavy Duty moved to Kiritimati instead.

| Cell | Location time zone | Deposit Date picked | Request depositDate / stored | Finance tab | Downloaded PDF | Deposits tab | Invoice (Finance + PDF) | Result |
|---|---|---|---|---|---|---|---|---|
| K1  S11970-17581 DEP-4704 | Kiritimati UTC+14 (local 4 Nov, UTC 3 Nov) | default 11/04/2026 | 2026-11-03T10:00Z / 2026-11-03T13:03Z | Nov 4 | Nov 4 | Today | (estimate only — line has vendor parts) | PASS |
| K2  S11970-17582 DEP-4705 | Kiritimati | typed 11/01/2026 | 2026-10-31T10:00Z / 2026-10-31T13:05Z | Nov 1 | Nov 1 | Nov 1, 2026 | INV-S11970-17582: Nov 1 / Nov 1; deposit $8 applied (Partially Paid) | PASS |
| K1b S11970-17583 DEP-4706 | Kiritimati | default 11/04/2026 | (same shape as K1) | Nov 4 | Nov 4 | Today | INV-S11970-17583: Nov 4 / Nov 4; Invoices tab Nov 4 | PASS |
| E1  S11970-17584 DEP-4707 | Edmonton (local 3 Nov 06:14, UTC 3 Nov) | default 11/03/2026 | 2026-11-03T07:00Z / 2026-11-03T13:14Z | Nov 3 | Nov 3 | Today | INV-S11970-17584: Nov 3 / Nov 3; Invoices tab Nov 3 | PASS |
| E2  S11970-17585 DEP-4708 | Edmonton | typed 10/30/2026 | 2026-10-30T06:00Z / 2026-10-30T13:17Z | Oct 30 | Oct 30 | Oct 30, 2026 | (estimate only) | PASS |
Production before for the K1 shape: Nov 3 on Finance tab and PDF (see above). Before/after picture:
ev/before-after-finance-deposit-date.png (scripts/ex_before_after.py, /usr/bin/python3).

Observation, explained (not a defect): DEP-4703 was recorded at Edmonton time dated 3 Nov; after the location was moved to
Kiritimati it lists as "Today" (4 Nov). That is our own time-zone change after the fact, not a user flow.

## Evening case (the ticket's own report) — run 4 Nov 00:28–00:37 UTC (3 Nov evening in North America)
Production BEFORE (v26.45.0-8e138e1): location ZZAUTOTEST C614715 Empty Location set to America/Toronto (restored to Asia/Karachi
after, 0 fields different), browser on Toronto time, 7:29 PM 3 Nov. S-1916, DEP-5039, Deposit Date default 11/03/2026.
Request depositDate "2026-11-03T05:00:00.000Z"; stored "2026-11-04T00:29:22Z". Finance tab "(Deposit) Nov 4, 2026" and PDF
"(Deposit) Nov 4, 2026" while the same document reads "Invoice Date: Nov 3, 2026"; Deposits tab "Today" (3 Nov). REPRODUCED.
Branch (v26.43.3-551fa20 — the branch API had gone to sleep at 00:30 UTC; woken with toggleQaEnv, same build after):
| Cell | Time | Deposit Date | stored | Finance tab | PDF | Deposits/Payments tab | Invoice | Result |
|---|---|---|---|---|---|---|---|---|
| EV1 S11970-17586 DEP-4709 | Edmonton 5:33 PM 3 Nov (UTC 4 Nov) | default 11/03/2026 | 2026-11-04T00:33:36Z | Nov 3 | Nov 3 | Today | INV-S11970-17586 Finance + PDF: deposit Nov 3, invoice date Nov 3 | PASS |
| EV2 S11970-17587 DEP-4710 | Edmonton 5:34 PM 3 Nov | typed 11/02/2026 | 2026-11-03T00:34:59Z | Nov 2 | Nov 2 | Yesterday | (estimate only) | PASS |
Before/after picture: ev/before-after-evening.png (scripts/ex_evening.py). Close-up: ev/branch-EV1-invoiced/6-finance-deposit-line.png.

Side note for the QA lead (bucket b, already tracked): SV-12161 (filed 3 Nov 19:25 CDT, staging v26.45.0-f417d48) says an
evening North American deposit is SAVED a day early (Deposits tab "Yesterday"). In these runs the stored values and the
Deposits tab were right: production 7:29 PM Toronto -> "Today"; branch 5:33 PM Edmonton -> "Today", dated-2-Nov -> "Yesterday".
Not posted on SV-12161 (not asked).

## Verdict: PASSED (all 7 branch cells + production before reproduced for both directions).

## Posted (4 Nov 00:39 UTC = 3 Nov 7:39 PM CDT)
Comment 80082 (green PASSED, 7-row table, 2 before/after pictures attached: before-after-evening.png 63569, before-after-finance-deposit-date.png 63568),
label QAcomplete added, status TESTING QA -> QA Complete. Pre-post gate: both build markers re-read unchanged; ticket re-read (only change since
yesterday: Relates link to SV-12161 at 19:26 CDT); voice scan clean; no technical section; no recording (QA lead's choice).
Learning check: the branch API slept mid-run (302 to sleep.qa) — woken with the recorded toggleQaEnv recipe (playbook), nothing new.
