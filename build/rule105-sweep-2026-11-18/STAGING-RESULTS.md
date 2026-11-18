# Rule 105 sweep — STAGING half — results (18 Nov 2026)

Worker pass on branch `claude/credit-memo-document-location-tov2x1`. Brief: `WORKER-BRIEF.md`. Nothing was written to Jira,
TestRail, Sheets or Slack; no comment was posted. Production was not looked at (no production sign-in yet): every
"production must check" line below is work for the production half, not a result.

## Run conditions (all tickets)

- **Tickets re-read live:** all six, description + every comment, 18 Nov 2026 ~15:36 UTC (Jira, read only).
- **Staging:** app.staging.shopview.com / api.staging.shopview.com, build **v26.45.5-b6a5d15** (read from the page's own
  `app-version` at the start and end of every run from 15:39 UTC; unchanged throughout).
- **Location zones read live from the server** (`GET /api/staff/my-workplaces`, 15:39 UTC — `environment-probe-*.json`):
  Staging Heavy Duty - 9919 = **Asia/Karachi** · Staging Lethbridge - 4310 = America/Edmonton · QB Location =
  America/Vancouver · **DVI Test = Pacific/Fiji** (it was America/Toronto when SV-11940/50/51/52 were filed on 29 Oct;
  moved ~3 Nov, playbook "Pacific/Fiji `my-workplaces`").
- **Four zones (Rule 99):** every run sets and records session `change-location` with the location's zone, browser
  `timezoneId`, process `TZ`, and the app's own `localStorage['timezone']`; read back at start and end
  (`rule99_start` / `rule99_end` in each JSON, `all_zones_match: true`, `offsets_agree: true` in every run).
- **Offsets (Rule 99 g):** `tz_rules_check-2026-11-18.txt`. Toronto (25 Jul–31 Oct), Fiji (25 Jul–20 Nov) and Karachi
  (1 Oct–20 Nov) **MATCH** between the test browser (Chromium 153) and the machine (tz 2026e). Edmonton and Vancouver
  **MISMATCH** after 1 Nov (browser one hour behind). **So this pass tests only at DVI Test (Fiji) and Heavy Duty
  (Karachi)**; no result below depends on a screen reading in the Edmonton/Vancouver gap hour. The server's offset is
  read from what it built: the report windows it was asked for (SV-11940) and the stored UTC values it returned.
- **Days are worked out independently** from each stored UTC value with this machine's tz database (`tools/common.mjs`
  `dayIn()`), never from the browser.
- Tools: `tools/` (secret-free; cookies stay in `/tmp/cln/cookies.json`). Scratch output in `/tmp/cln/r105/` (not committed).

---

## SV-12207 — Vendor remittance slip shows the next day's date for payments and credits made in the evening

Status Open (re-read 15:36 UTC; last comment 80601, 10 Nov, parked in SV-11936 waiting for Milos / Chris).

**The claim (quoted):** *"The vendor **Remittance Slip** … can print a **different date** from the one the app shows on
screen. This happens for payments and credits made late in the evening. The slip prints the next day."* Example on QA
branch sv11839, Staging Heavy Duty - 9919 on Edmonton time: credit C-13668 and the payment of bill ZZVC12146-A, made
4 Nov ~11:05–11:16 PM Edmonton; screen shows Nov 4 ("Yesterday"); slip prints **Date: Nov 5, 2026** and **Credit Date:
Nov 5, 2026**; *"The bill lines on the same slip print the correct day, Nov 4, 2026."* Expected (Chris Ward, comment
80223, 5 Nov): every date on the slip in the location's own time zone, the same as the screen.

### Capture audit (Rule 105 (1)–(4))

| Item | Result | Where |
|---|---|---|
| Comparison of two environments? | **No.** The claim compares the slip with the screen on the same build, same session. Rule 105 (1)/(2) apply only to the ticket's side remark *"Not checked on staging or production … likely to be the same there"* — labelled as a likelihood, not as an observation | ticket "Where it was seen" |
| All four zones recorded | **YES** — change-location `workplace_timezone=America/Edmonton` (200), browser `timezoneId`, process `TZ`, `localStorage['timezone']`, at start and end of every step | `dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-05/SV-12146/RESULT.md:40`; `…/SV-12146/step-read-remitdate-recheck.json` (`rule99_start`/`rule99_end`) |
| Offsets checked at capture | **NO at capture** (5 Nov, before the 6 Nov amendment). Browser gave Edmonton UTC−7, machine/server UTC−6. Found and corrected afterwards: comments 80351 (6 Nov) and 80485 (9 Nov); payments were at 11:05–11:16 PM under server rules (10:05–10:16 PM under the browser's), so on 4 Nov either way — not affected | `sv11839-ticket-qa-2026-11-04/JIRA-WRITES-2026-11-04.md:215`, `:293` |
| Stored values recorded | **YES** — payment `payment_date 2026-11-05T05:09:29.564Z`; credit `date "2026-11-05 05:05:35"`; bill `date "2026-11-04 07:00:00"` | `…/SV-12146/step-pay-ZZVC12146-A.json`, `step-credit-100.json` |
| Pictures of both things compared | **YES** — slip, Payments tab ("Yesterday"), Unpaid Invoices (credit dated Nov 4) | `…/sv11839-ticket-qa-2026-11-05/REMIT-DATE/1-…png`, `2-…png`, `3-…png` |
| Contradicting statement | **None.** Chris confirmed "Please fix it" (80223) | ticket comments |

### Time-zone challenge on staging (Rule 105 (3) a+b)

The ticket's own records live on QA branch **sv11839**, which is **not reachable** from this container now
(`curl: (56) CONNECT tunnel failed, response 502`, probed 16:14–16:16 UTC — the same signature as the retired sv8582,
`build/BLOCKED-qa-branch-sv8582.md`; whether sv11839 is retired is not confirmed). On staging, Heavy Duty is on
**Asia/Karachi (UTC+5)**, so the same fault — if it is "the slip prints the UTC calendar day" — shows the other way round:
a payment made **between midnight and 5:00 AM Karachi** would print the **previous** day. DVI Test (Fiji) has no vendor
payments at all (scan of 1,000 vendors). Heavy Duty: 1,000 vendors scanned, 7 with payments, 4 payments whose stored
UTC day differs from the Karachi day. Every payment of the two vendors holding those (69 slips) was downloaded and read;
the rest act as controls.

Run: `SV-12207/staging-HD-2026-11-18T1610Z.json` (16:10–16:12 UTC, all four zones Asia/Karachi, offsets agree, build
v26.45.5-b6a5d15 at start and end).

| Record (staging, Heavy Duty) | Stored value (UTC) | Day in Karachi (worked out) | Screen (Payments tab) | Slip prints | Agrees? |
|---|---|---|---|---|---|
| Payment `27caefe0…` (vendor 123 Cannabis Forestlawn) | `2026-10-15 20:03:43` | **Oct 16** (01:03 AM) | **Oct 16, 2026** | **Date: Oct 15, 2026** | **NO — slip one day early** |
| ↳ its bill ZZINV-PS-44647 | `2026-10-14 19:00:00` | **Oct 15** (midnight) | Oct 15, 2026 | **Oct 14, 2026** | **NO** |
| ↳ its bill ZZINV-PS1 | `2026-10-14 19:00:00` | **Oct 15** | Oct 15, 2026 | **Oct 14, 2026** | **NO** |
| Payment `aa6ae49b…` (vendor 4Refuel) | `2026-11-10 19:08:00` | **Nov 11** (00:08 AM) | **Nov 11, 2026** | **Date: Nov 10, 2026** | **NO — slip one day early** |
| Payment `7bf6983e…` (control payment, same vendor as 27caefe0) | `2026-10-20 15:47:37` | Oct 20 (8:47 PM) | Oct 20, 2026 | Date: Oct 20, 2026 | yes |
| ↳ its bill 4324234234234234444 | `2026-10-15 19:00:00` | **Oct 16** (midnight) | Oct 16, 2026 | **Oct 15, 2026** | **NO** |
| ↳ its bill ZZINV-PS-38192 | `2026-10-16 19:00:00` | **Oct 17** (midnight) | Oct 17, 2026 | **Oct 16, 2026** | **NO** |
| ↳ its bill ZZINV-PS-12020 (control) | `2026-10-16 06:00:00` | Oct 16 (11:00 AM) | Oct 16, 2026 | Oct 16, 2026 | yes |
| ↳ its credit C-13810 | **not read** (fully applied; not in the open-items list the screen loads) | — | (no date shown on the row) | Credit Date: Oct 2, 2026 | **NOT VERIFIED** |
| Payments `99497bd2…`, `6cc9bf98…` (4Refuel) | `2026-09-22 19:45:00`, `19:44:40` | **Sep 23** (00:44–00:45 AM) | not on the first page of the tab — **screen NOT VERIFIED** | Date: Sep 22, 2026 | slip = UTC day |
| 64 other payments (controls) | stored day = Karachi day | — | — | slip = that day | yes, all 64 |

Pictures: `SV-12207/payments-tab-HD-68c72fe7.png` (screen, Oct 16 payment and Oct 15 bills; Oct 20 payment with Oct 16/17
bills and credit C-13810), `SV-12207/payments-tab-HD-4acb542f.png` (screen, Nov 11 payment), `SV-12207/slip-HD-27caefe0.png`,
`slip-HD-aa6ae49b.png`, `slip-HD-7bf6983e.png`, `slip-HD-99497bd2.png`, `slip-HD-6cc9bf98.png`, `slip-HD-5e15f153.png`
(control). The text of all 69 slips is in the JSON.

What it shows: on every slip read, each date equals the **UTC calendar day** of the stored value; the screen shows the
**Karachi** day. Wherever the two days differ, the slip is wrong; where they agree, the slip is right.

### Verdict — staging half

**STILL REPRODUCES on staging** under all four zones (Karachi, offsets agree), on the current build, for the slip **Date**.
Production half still needed (the claim does not depend on production, but the ticket's "likely the same there" line
should be confirmed or removed).

Two points for the coordinator — facts, no ticket action taken:
1. **The slip's bill lines are wrong too in a location east of UTC.** The ticket says *"The bill lines on the same slip
   print the correct day"*. That holds in Edmonton only because a bill dated at local midnight (06:00/07:00 UTC) is on the
   same UTC day. At Karachi a bill dated at local midnight is stored at 19:00 UTC the day before, and the slip prints that
   earlier day (ZZINV-PS-44647, ZZINV-PS1, 4324234234234234444, ZZINV-PS-38192 above). The finding gets wider, not weaker:
   every date on the slip follows UTC.
2. **The Credit Date half was not checked on staging.** No staging payment with a credit has a credit whose stored date
   was readable (C-13810's stored value was not returned by the screens' own calls). Checking it needs a fresh vendor
   credit + bill + payment made before 5:00 AM Karachi (or before noon at DVI Test, Fiji — UTC+12), which needs a received
   bill (seeding); not done in this pass.

### What the production half must look at
- A North-American location on production (Edmonton time), a vendor payment and a vendor credit made after 6:00 PM
  location time (server rules, UTC−6 from 1 Nov); download its slip; compare Date, Credit Date and bill dates with the
  vendor's Payments and Unpaid Invoices tabs. Record the stored `payment_date` / credit `date` values.
- If a production location east of UTC exists, a payment between midnight and the UTC offset hour (as above).
- Only existing records may be read on production unless the QA lead says otherwise; if no evening payment exists there,
  say so — do not infer.

---

## SV-11940 — Reports - Parts Velocity "Last 90 days" covers 91 days

Status Open (re-read 15:36 UTC; last comment 80583, 10 Nov, parked in SV-11936 waiting for Milos / Chris).

**The claim (quoted):** *"On **Parts Velocity**, the date option **Last 90 days** covers **91 days**: it starts one day too
early."* Example: *"on 28 Oct 2026 the download says **Date Range: Jul 30, 2026 - Oct 28, 2026**, which is 91 days."*
Expected (Chris Ward, question 13, 28 Oct): *"exactly 90 days: today and the 89 before it."* Seen at DVI Test on Toronto
time, staging v26.43.2-f8698cb.

### Capture audit (Rule 105 (1)–(4))

| Item | Result | Where |
|---|---|---|
| Comparison of two environments? | **No.** A day count on one build. "Not checked on Production or on a QA branch" is stated, nothing is claimed about production | ticket "Where it was seen" |
| All four zones recorded | **YES** — capture `PV_B1`, 29 Oct 00:10:48 UTC (= 28 Oct 8:10 PM Toronto): location, browser, process and the app's own key all `America/Toronto`; change-location 200 | `dashboard-verify-2026-10-28/tickets-2026-10-29/phase2/pictures/P2-B-meta.json:16`; `phase2/SUMMARY-p2b.md:12-15,22`; draft header `phase2/P2-B1-…md:7` |
| Offsets | Not checked at capture (amendment came 6 Nov). Checked now: Toronto browser = machine for 25 Jul–31 Oct (**MATCH**), and the capture was ~4 hours from midnight → **not affected** | `tz_rules_check-2026-11-18.txt` |
| Server side of the window | **YES**, in the 29 Oct re-check: the page sent `start_date=2026-07-31T04:00Z … end_date=2026-10-30T03:59Z` (Toronto midnights, offset −4) → Jul 31–Oct 29 = 91 days | `filter-recheck/RESULT-f2.md:65-66` |
| Pictures | **YES** — screen (Last 90 days) and the PDF's Date Range line | `phase2/pictures/P2-B1-1-…png`, `P2-B1-2-…png` |
| Contradicting statement | **None** | ticket comments |

Note on the zone risk: a wrong zone shifts BOTH ends of the window by the same amount, so it cannot turn 90 days into 91.
The claim is a count, not a calendar date, which is why it is robust — but it was still re-checked below.

### Time-zone challenge on staging (Rule 105 (3) a+b)

| | DVI Test (Pacific/Fiji, UTC+12) | Heavy Duty (Asia/Karachi, UTC+5) |
|---|---|---|
| Run (JSON) | `SV-11940/staging-DVI-2026-11-18T1607Z.json` | `SV-11940/staging-HD-2026-11-18T1610Z.json` |
| Four zones / offsets | all Pacific/Fiji, offsets agree (+720 min) | all Asia/Karachi, offsets agree (+300 min) |
| "Today" in the location (machine tz db) | **19 Nov 2026** (16:07 UTC = 4:07 AM Fiji) | **18 Nov 2026** (16:10 UTC = 9:10 PM Karachi) |
| Screen chip | Date: Last 90 days (remembered range cleared first) | Date: Last 90 days |
| Window the screen sent (stored request) | `start_date=2026-08-20T12:00:00.000Z`, `end_date=2026-11-19T11:59:59.999Z` | `start_date=2026-08-19T19:00:00.000Z`, `end_date=2026-11-18T18:59:59.999Z` |
| Same window as days in the location (worked out) | **Aug 21 – Nov 19 = 91 days** | **Aug 20 – Nov 18 = 91 days** |
| Download Date Range | PDF and CSV: **"Date Range: Aug 21, 2026 - Nov 19, 2026"** | CSV: **"Date Range: Aug 20, 2026 - Nov 18, 2026"** (the PDF download did not arrive within 120 s in this run) |
| Expected (today and the 89 days before) | Aug 22 – Nov 19 | Aug 21 – Nov 18 |
| Pictures | `SV-11940/parts-velocity-DVI-last90.png`, `SV-11940/parts-velocity-DVI-pdf-top.png` | `SV-11940/parts-velocity-HD-last90.png` |

The window's ends sit exactly on the location's midnights (the server's offset equals the location's offset), so the
window is built in the right zone; it is simply one day too long.

### Verdict — staging half

**STILL REPRODUCES on staging** on the current build (v26.45.5-b6a5d15), at two locations in two zones, all four zones
matched, offsets agreeing: Last 90 days = 91 location days. Not a test set-up error.

### What the production half must look at
Parts Velocity on production at any location, Date **Last 90 days** (clear the remembered range first), four zones on
the location's zone: the request's `start_date`/`end_date` and the **Date Range** line of the CSV/PDF download; count the
days on the location's calendar. (Not needed to keep the ticket — it makes no production claim — but it tells the PO
whether production has the same 91 days.)

---

## SV-11950 and SV-11951 — Sales Tax Collected (one shared run)

Both Open (re-read 15:36 UTC; last comments 80593 and 80594, 10 Nov, parked in SV-11936 waiting for Milos / Chris).

**SV-11950 claim (quoted):** *"An invoice for **$0.00** … Sales Tax Collected still lists it, marks it **Paid**, and gives
it an **Invoice Paid Date** (the moment the invoice was made)."* Example S1-38218 at DVI Test, This month (October).
Expected (Chris, Q31(a)): leave $0.00 invoices off the report.

**SV-11951 claim (quoted):** *"**Invoice Status** reads **Paid**, so the invoice is missing when you filter on **Partially
Paid**"* and *"**Invoice Paid Date** is the day the invoice was made, not the day the money came in (the deposit's
date)."* Example S1-38221: $30 deposit dated Oct 26, invoice made Oct 28, $105 owed; Expected paid date **Oct 26, 2026**
(Chris, Q31(b), SV-4573 "for partially paid invoices, show the date of the latest payment").

### Capture audit (Rule 105 (1)–(4)) — same capture for both

| Item | Result | Where |
|---|---|---|
| Comparison of two environments? | **No.** One build; "Not checked on Production or on a QA branch" is stated | tickets |
| All four zones recorded | **YES** — DVI Test on America/Toronto (its zone then): process `TZ`, browser zone, app key `"America/Toronto"`; change-location 200; in the first capture and in the re-check on the next build | `dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3/SV-11950_51/screen-meta.json:5,569-572` (v26.43.2-9272076, 09:41 UTC 29 Oct); `…/RECHECK-b8ad4001/SV-11950_51/screen-meta.json:5,569-572` (v26.43.3-8ad4001, 10:20 UTC); `…/SV-11950_51/server-tax.json:10` |
| Offsets | Not checked at capture (before 6 Nov). Toronto MATCHES for 25 Jul–31 Oct → not affected | `tz_rules_check-2026-11-18.txt` |
| Stored values | **YES** — report rows `createdOn` / `paidDate` / `status` for S1-38218, S1-38219, S1-38221 | `…/SV-11950_51/server-tax.json` (`runs.custom_oct28.targets`) |
| Pictures | **YES** — `F3-SV11950-1`, `F3-SV11951-1`, `F3-SV11951-2` (screen) and the work order's Finance tab | `…/evidence/f3/SV-11950_51/*.png` |
| Contradicting statement | **None** | tickets |

### Time-zone challenge on staging (Rule 105 (3) a+b)

Run `SV-11950_51/staging-DVI-2026-11-18T1619Z.json`, 16:18:37–16:19:15 UTC, DVI Test, all four zones **Pacific/Fiji**
(DVI Test's zone since ~3 Nov), offsets agree, v26.45.5-b6a5d15 at start and end. Today in Fiji = 19 Nov, so
**Last month = October**. Stored values read inside the page (`/api/work-orders/view/{id}` and the report rows the
screen received).

| Record | Stored value (UTC) | Day at DVI now (Fiji) | Day at filing (Toronto) | Staging screen (Sales Tax Collected, Last month) |
|---|---|---|---|---|
| **S1-38218** ($0.00) — invoice created | `2026-10-29 00:19:52` | Oct 29 | Oct 28 | Invoice Created Date **Oct 29, 2026** |
| S1-38218 — report `paidDate` | `2026-10-29 00:20:00` (8 s after creation; no payment exists: `customer_payments` [], `deposits` []) | Oct 29 | Oct 28 | **Paid**, Invoice Paid Date **Oct 29, 2026**, $0.00 in every money column |
| **S1-38221** — work order's own status | `invoice_status: partially_paid`, `open_balance 105`, `deposit_total 30` | — | — | **Paid** |
| S1-38221 — deposit DEP-4818 (`depositDate` and `customer_payments.payment_date`) | `2026-10-27 00:46:11` | **Oct 27** | **Oct 26** (8:46 PM) | — |
| S1-38221 — invoice created | `2026-10-29 00:46:32` | Oct 29 | Oct 28 | Invoice Created Date Oct 29, 2026 |
| S1-38221 — report `paidDate` | `2026-10-29 00:46:41` (9 s after creation) | Oct 29 | Oct 28 | Invoice Paid Date **Oct 29, 2026** |
| S1-38219 (same set-up) | partially_paid, $105 open; deposit DEP-4817 `2026-10-26 00:14:36`; paidDate `2026-10-29 00:15:06` | deposit Oct 26 / paid Oct 29 | Oct 25 / Oct 28 | **Paid**, paid Oct 29, 2026 |
| Invoice Status: **Partially Paid** (request `statuses[0]=partially_paid`, last_month) | 0 rows returned | — | — | **"No record matches these filters"** |

Pictures: `SV-11950_51/sales-tax-DVI-last-month.png`, `SV-11950_51/sales-tax-DVI-partially-paid.png`.

Every screen date equals the independently worked-out Fiji day of the stored value, so the screen itself is consistent
with the location's zone. The ticket dates (Oct 28 / Oct 26) were the Toronto days and were right when filed; DVI Test's
zone has since moved, so the same records now read one day later. That is a change of the location's setting, not of the
product, and it does not touch either claim.

### Verdicts — staging half

- **SV-11950: STILL REPRODUCES on staging.** S1-38218 ($0.00, no payment of any kind) is listed as **Paid** with an
  Invoice Paid Date equal to the moment it was invoiced.
- **SV-11951: STILL REPRODUCES on staging.** S1-38221 reads **Paid** although the work order itself stores
  `partially_paid` with $105.00 open; it is missing under **Partially Paid**; its Invoice Paid Date is the invoice's own
  creation moment (Oct 29 in Fiji), not the deposit (stored `2026-10-27 00:46:11`). **Wording note (fact only, no
  action taken):** the ticket's expected paid date "Oct 26, 2026" is the deposit's day **in Toronto**; at DVI Test today
  (Fiji) the same deposit is on **Oct 27**. Any retest at DVI Test must expect **Oct 27** now, or use a location still on
  a North-American zone. (Related: the Finance tab showed this deposit as Oct 27 already on 29 Oct — side finding SF1,
  filed as SV-11970.)

### What the production half must look at
Neither ticket makes a production claim; the production half only tells the PO whether production behaves the same:
Sales Tax Collected on production at one location (four zones on its zone), a range that holds (a) a **$0.00 invoice
with no payment** and (b) an invoice **part-paid by a deposit only** (status on the work order = Partially Paid). Read
the row's Invoice Status and Invoice Paid Date, the stored `createdOn` / `paidDate`, and the deposit's stored date; and
whether (b) appears under Invoice Status: Partially Paid. Existing production records only; if none exist, say so.

---

## SV-11952 — Sales By Representative lists invoices on the same day newest first instead of by invoice number

Status Open (re-read 15:36 UTC; last comment 80595, 10 Nov, parked in SV-11936 waiting for Milos / Chris).

**The claim (quoted):** *"invoices made on the **same day** are listed **newest first, by the minute they were made**. The
written rule is that invoices on the same day are listed by **invoice number, lowest first**."* Example: Viktoria
Videnovic, This month (October), All locations, viewed from DVI Test on Toronto time: *"Oct 07 2026: S2-34681, S2-34864,
S2-33689, S2-33735, S2-34873, S2-34874 (newest invoice first)"*; expected S2-33689, S2-33735, S2-34681, S2-34864,
S2-34873, S2-34874. Source: SBR spec v30, S6-R9.

The date part of this claim is **which calendar day each invoice falls on** — the ordering rule only applies inside a day.

### Capture audit (Rule 105 (1)–(4))

| Item | Result | Where |
|---|---|---|
| Comparison of two environments? | **No.** One build; "Not checked on Production or on a QA branch" is stated | ticket |
| All four zones recorded | **YES** — DVI Test on America/Toronto: process `TZ`, browser zone, app key; runs without the location key were caught by the worker and renamed `INVALID-…`, no verdict uses them | `dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3/SV-11952/screen-meta-alllocs.json:5,7,22444-22445` (10:04 UTC 29 Oct, v26.43.2-9272076); `…/RECHECK-b8ad4001/SV-11952/screen-meta-alllocs.json:5,7,22444-22445` (10:40 UTC, v26.43.3-8ad4001); `filter-recheck/RESULT-f3.md:15` |
| Offsets | Not checked at capture (before 6 Nov). Toronto MATCHES; and the six invoices sit 4–6 hours from any Toronto midnight (see below) → not affected | `tz_rules_check-2026-11-18.txt` |
| Stored values | Not recorded in the ticket; recorded now (below) | — |
| Pictures | **YES** — `F3-SV11952-1-viktoria-oct07-all-locations.png` | `…/evidence/f3/SV-11952/` |
| Contradicting statement | **None** | ticket |

### Time-zone challenge on staging (Rule 105 (3) a+b)

Runs: `SV-11952/staging-HD-2026-11-18T1622Z.json` (Heavy Duty — the invoices' own location — all four zones
Asia/Karachi) and `SV-11952/staging-DVI-2026-11-18T1623Z.json` (DVI Test, as in the ticket's steps — all four zones
Pacific/Fiji). Both: Date: Last month (October in both zones today), Location: All locations, Show Unassigned off,
Viktoria Videnovic opened; offsets agree; v26.45.5-b6a5d15 at start and end. The window the screen sent follows the
session's location: Karachi `2026-09-30T19:00Z … 2026-10-31T18:59:59.999Z`, Fiji `2026-09-30T12:00Z … 2026-10-31T11:59:59.999Z`.

| Invoice | Stored `created_on` (UTC) | Day in Karachi (HD) | Day in Fiji (DVI now) | Day in Toronto (at filing) |
|---|---|---|---|---|
| S2-34681 | 2026-10-07T17:42:09Z | Oct 07 (10:42 PM) | Oct 08 (5:42 AM) | Oct 07 (1:42 PM) |
| S2-34864 | 2026-10-07T17:17:00Z | Oct 07 | Oct 08 | Oct 07 |
| S2-33689 | 2026-10-07T16:28:15Z | Oct 07 | Oct 08 | Oct 07 |
| S2-33735 | 2026-10-07T16:27:34Z | Oct 07 | Oct 08 | Oct 07 |
| S2-34873 | 2026-10-07T16:26:41Z | Oct 07 | Oct 08 | Oct 07 |
| S2-34874 | 2026-10-07T15:21:23Z | Oct 07 (8:21 PM) | Oct 08 (3:21 AM) | Oct 07 (11:21 AM) |

All six fall on ONE day in every zone used (Oct 07 at Karachi and Toronto, Oct 08 at Fiji), so the "same day" premise
holds whatever the zone. Their stored times run newest-first exactly in the order the ticket reported.

| Staging screen | Day heading shown | Order shown | Lowest number first? |
|---|---|---|---|
| Heavy Duty (Karachi) — `SV-11952/sbr-HD-viktoria-last-month.png` | **Oct 07 2026** | S2-34681, S2-34864, S2-33689, S2-33735, S2-34873, S2-34874 | **No** — newest time first |
| DVI Test (Fiji) — `SV-11952/sbr-DVI-viktoria-last-month.png` | **Oct 08 2026** | S2-34681, S2-34864, S2-33689, S2-33735, S2-34873, S2-34874 | **No** — newest time first |

Other days with more than one invoice under this representative behave the same (HD: 3 of 4 such days not in number
order — Oct 29, Oct 07, Oct 01; DVI: 3 of 3), in the JSON.

### Verdict — staging half

**STILL REPRODUCES on staging**, under two zones, all four zones matched, offsets agreeing. Not a test set-up error: the
six invoices share one calendar day in every zone, and the order within that day follows their stored time, not their
number. **Wording note (fact only, no action taken):** viewed from DVI Test today, the same six invoices are under
**Oct 08 2026**, not "Oct 07 2026" as the ticket's step 7 says, because DVI Test's zone moved to Fiji; at Heavy Duty they
are still under Oct 07. A retest following the ticket's steps at DVI Test must look under Oct 08, or run from Heavy Duty.

### What the production half must look at
Sales By Representative on production, a representative with several invoices on one day at one location (four zones on
that location's zone): the stored `created_on` of each, the day they fall on in that zone, and the order shown inside the
day heading. (The ticket makes no production claim; this tells the PO whether production orders the same way.)
