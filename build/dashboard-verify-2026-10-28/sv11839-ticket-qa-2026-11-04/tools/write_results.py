#!/usr/bin/env python3
"""Writes SV-xxxxx/RESULT.md for the sv11839 ticket QA pass (4 Nov 2026). Content is from the evidence files in this folder."""
import os
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04'
BUILD = 'v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)'
def zones(loc, tz):
    return (f"Location **{loc}**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone={tz}` (HTTP 200) · "
            f"browser `timezoneId={tz}` · process `TZ={tz}` · `localStorage['timezone']=\"{tz}\"` · header/location selector showed {loc} at the start and end of the run. "
            + ("Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes." if 'Edmonton' in tz else ''))
T = {}
T['SV-11691'] = dict(title='Invoices marked Paid with $0 payments — customer Balance shows settled, A/R Aging shows open', verdict='PASS',
 expected='''> **Expected**
> An invoice is Paid only when payments + applied credits/deposits = total; WO/invoice status and payment status cannot diverge; customer Balance = A/R Aging.

Source: SV-11691 description. Product rule, Chris Ward's comment on SV-11691 (22 Oct 2026, comment 79362): *"Money is the truth. An invoice is Paid only when payments plus applied credits and deposits cover its total. A/R Aging is showing these correctly; the Invoices tab is wrong for these four."* · *"Existing records are never changed automatically. They go on a reviewed list and get fixed one by one."* · *"How to check after the fix: for every invoice, Paid means the recorded money covers the total, and the customer Balance matches A/R Aging."*''',
 steps='Followed the ticket\'s steps 1–3 for all four invoices: Customers → customer → Invoices tab ("Open only" on, then off) → the invoice row; Payments tab; Reports → A/R Aging Summary / Detail.',
 seen='''| Invoice | Customer | Invoices tab (now) | Payment recorded? | Customer Balance header | A/R Aging |
|---|---|---|---|---|---|
| S2-8650 | Wellington Truck Repair | Total $1,867.94 · Balance $1,867.94 · **Unpaid** (shown with "Open only" on and off); its tick-box cannot be selected | none on the Payments tab (17 payments, none for S2-8650) | **$2,182.34** | Summary: 31–60 days $314.40 + 91 And Over $1,867.94 = **$2,182.34** |
| S2-8771 | Inland Heavy Duty Truck Repair | $870.85 · $870.85 · **Unpaid**, not selectable | — | **$7,298.24** | 91 And Over **$7,298.24** (= $870.85 + $6,427.39) |
| S2-8092 | Inland Heavy Duty Truck Repair | $6,427.39 · $6,427.39 · **Unpaid**, not selectable | — | (same customer) | (same) |
| S3-8848 | Oakland City Truck & Trailer Repair (Lethbridge) | $98.26 · $98.26 · **Unpaid**, not selectable | — | **$98.26** | A/R Aging Detail: S3-8848 $98.26 in 91+ (the customer's only open item) |

Every customer Balance equals A/R Aging, and none of the four is shown as Paid any more on the Invoices tab.

Note (not a failure, by the product rule): the work order itself still carries status "Paid" (`GET /api/work-orders?search=S2-8650` → `status: paid`). Chris's rule says these legacy records are corrected one by one from a reviewed list, not automatically, and the developer's comment says the same. The read-only "census" command named in the developer's comment is a server command and was not run by QA.''',
 pics=['SV-11691/2-customer-invoices-open-only-off-S2-8650.png', 'SV-11691/5-ar-aging-summary-wellington.png', 'SV-11691/3-customer-payments.png', 'SV-11691/6-inland-heavy-duty-truck-repair-invoices-open-only.png', 'SV-11691/6-oakland-city-truck-trailer-rep-invoices-open-only.png'],
 ev='SV-11691/evidence.json, evidence-ar.json, evidence-inland-heavy-duty-truck-repair.json, evidence-oakland-city-truck-trailer-rep.json, evidence-ar-detail-lethbridge-extract.json',
 when='4 Nov 2026, 20:40–20:46 UTC (≈ 1:40–1:46 PM Edmonton)', loc=('Staging Heavy Duty - 9919 (Wellington, Inland); Staging Lethbridge - 4310 (Oakland)', 'America/Edmonton'),
 passc='QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty and Lethbridge, Edmonton time. All four invoices now show as Unpaid at their full amount on the customer\'s Invoices tab and cannot be picked for payment. Each customer Balance matches A/R Aging: Wellington Truck Repair $2,182.34 = $2,182.34, Inland Heavy Duty Truck Repair $7,298.24 = $7,298.24, Oakland City Truck & Trailer Repair $98.26 = $98.26. As agreed with Chris, the work orders themselves still say Paid until they are corrected one by one. Picture: SV-11691/5-ar-aging-summary-wellington.png')
T['SV-11820'] = dict(title='Service Advisor Analysis excludes invoices with an inactive service advisor; Dashboard Billing Efficiency understated', verdict='PASS',
 expected='''> **Expected**
> * Invoices with an inactive service advisor are still included in Service Advisor Analysis (grouped under that advisor).
> * Billing Efficiency numerator includes them, same as the worked-hours denominator.

Source: SV-11820 description (related story SV-9575, "Billing Efficiency must match Service Advisor Analysis").''',
 steps='''sv11839 had no invoice whose advisor had been deleted (checked by reading Sales and Service Advisor Analysis for the last 12 months at Heavy Duty and Lethbridge: the only invoices missing from Service Advisor Analysis were work orders with no advisor at all — 4 at Heavy Duty (10.18 h), 14 at Lethbridge (65.99 h)). So the ticket's case was **seeded** (ZZAUTOTEST, Heavy Duty, 4 Nov): a throwaway staff member "ZZAUTOTEST Advisor QA11839" was made the service advisor of work order **S11839-17594** (one 1.00 h line, 0.50 h clocked), the work order was invoiced, then the staff member was **deleted** — the work order then shows the advisor as unknown/inactive. Then the ticket's own steps were followed with range **This month**: Reports → Sales; Reports → Service Advisor Analysis; Dashboard → Billing Efficiency tile (+ View details).''',
 seen='''| Screen (This month, Heavy Duty) | Invoiced hrs | Worked/Clocked hrs | Billing Efficiency |
|---|---|---|---|
| Reports → Sales (Totals) | **8.75** | — | **250.00%** |
| Reports → Service Advisor Analysis (Totals) | **8.75** | 3.50 | **250.00%** |
| Dashboard → Billing Efficiency tile | **8.75 Invoiced** | 3.50 Clocked | **250.00%** |

Service Advisor Analysis lists **S11839-17594** with advisor **"Unknown (Inac…"** (the column cuts off "Unknown (Inactive)"), 1.00 h invoiced. The Dashboard's expanded table has an **"Unknown (Inactive)"** row (0.50 / 1.00 / 200.00%). The server agrees for the seed day: Sales 5.00 h, Service Advisor Analysis 5.00 h, tile 5.00 / 3.50 = 142.86% before and after the deletion.

Not covered by this ticket's Expected (noted, not judged): invoices whose work order has **no advisor at all** are still left out of Service Advisor Analysis (the developer's comment says this is by design).''',
 pics=['SV-11820/2-service-advisor-analysis-this-month.png', 'SV-11820/1-sales-report-this-month.png', 'SV-11820/3-dashboard-billing-efficiency-this-month.png'],
 ev='SV-11820/evidence.json; seed ids in ../seed-ids.json (ADV3) and every seed call in ../seed-log.jsonl',
 when='4 Nov 2026, 20:38–20:39 UTC (≈ 1:38 PM Edmonton)', loc=('Staging Heavy Duty - 9919', 'America/Edmonton'),
 passc='QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. I made a test work order (S11839-17594), gave it a test service advisor, invoiced it, then deleted that advisor. Service Advisor Analysis still lists the invoice, under "Unknown (Inactive)". For This month the three screens agree: Sales 8.75 invoiced hours / 250.00%, Service Advisor Analysis 8.75 / 250.00%, Dashboard Billing Efficiency 250.00% (8.75 Invoiced / 3.50 Clocked). Picture: SV-11820/2-service-advisor-analysis-this-month.png')
T['SV-11821'] = dict(title='Dashboard Revenue tile shows "1 Invoices" (plural) and date picker shows "Range: 1 days"', verdict='PASS',
 expected='''> **Expected**
> * Supporting line: "1 Invoice"
> * Date picker: "Range: 1 day"
> * Single-day range label shows one date

Source: SV-11821 description (related story SV-9576).''',
 steps='''1. As written (Heavy Duty): Dashboard → Revenue tile → date range → Oct 10, 2026 – Oct 10, 2026 → Apply. On sv11839 that day has **no invoices** (the branch's data ends ~31 Aug), so the supporting line can only read "0 Invoices".
2. Closest faithful equivalent for the "1 Invoice" line: the tile shows the invoice count only when the Parts/Labor/Other split is hidden (credits or negative revenue — the ticket's own example was "-$71.35, 1 Invoices"). No such single-invoice day existed, so one was **seeded** at Lethbridge today (4 Nov): one invoice S11839-17591 ($185.58) and a $25.00 credit memo CM-4190, customer "ZZAUTOTEST QA11839 Credit". Then Dashboard → Revenue tile → Nov 4, 2026 – Nov 4, 2026 → Apply.''',
 seen='''| Check | Seen | Expected |
|---|---|---|
| Date picker footer, single day (Oct 10, Jun 20, Nov 4) | **"Range: 1 day"** | "Range: 1 day" |
| Picker header and tile date label, single day | **"Oct 10, 2026"** / **"Nov 4, 2026"** (one date) | one date |
| Revenue tile supporting line, Lethbridge Nov 4 ($151.74, 1 invoice, split hidden) | **"1 Invoice"** | "1 Invoice" |
| (for reference) Heavy Duty Oct 10 — no invoices | "$0.00", "0 Invoices" | — |''',
 pics=['SV-11821/revenue-tile-lethbridge-2026-11-04.png', 'SV-11821/as_written_oct10-picker-before-apply.png', 'SV-11821/as_written_oct10-tile-after-apply.png'],
 ev='SV-11821/evidence.json (Heavy Duty) and SV-11821/lethbridge/evidence.json',
 when='4 Nov 2026, 19:40 UTC (Heavy Duty) and 20:31–20:33 UTC (Lethbridge)', loc=('Staging Heavy Duty - 9919 and Staging Lethbridge - 4310', 'America/Edmonton'),
 passc='QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Edmonton time. With a one-day range the date picker now reads "Range: 1 day" and the label shows a single date ("Nov 4, 2026"). On a day with exactly one invoice and a credit (Lethbridge, Nov 4: one test invoice and one $25 test credit), the Revenue tile reads "$151.74" and "1 Invoice". Picture: SV-11821/revenue-tile-lethbridge-2026-11-04.png')
T['SV-11822'] = dict(title='Change Location dropdown opens empty after page reload when "DVI Test" location is selected', verdict='BLOCKED for the exact step (no "DVI Test" location on sv11839) — closest faithful equivalent PASSED',
 expected='''> **Expected**
> * Location list opens (QB Location, Staging Heavy Duty - 9919, Staging Lethbridge - 4310, DVI Test) and user can switch.

Source: SV-11822 description. Mudassir Qamar's comment (28 Oct 2026, comment 79640): the empty list was the location menu drawn off-screen (x=0, y=936, `visibility: collapse`) and "Only DVI Test reproduces"; the same steps with Lethbridge worked.''',
 steps='''**Why the exact step cannot be done:** sv11839's organisation has exactly three locations — `GET /api/workplaces` and `GET /api/staff/my-workplaces` both list only Staging Heavy Duty - 9919, Staging Lethbridge - 4310 and Test Location (the staging DVI Test id `39522bc6-…` is absent). Searches run: those two endpoints, plus `/api/organization/workplaces`, `/api/settings/workplaces`, `/api/iam/workplaces` (all 404), and this repo for the DVI Test id.

**Closest faithful equivalent (labelled as such):**
- Run A (Edmonton): Admin at Heavy Duty → Profile → Change Location → **Staging Lethbridge - 4310** → reload on Dashboard, Reports > Sales, Customers and Work Orders → Profile → click the location chip each time → switch back to Heavy Duty. Also pressed Backspace on the chip (the developer's hardening note).
- Run B (Karachi): Test Location selected → reload → Profile → click the chip.''',
 seen='''- After every reload (4 pages in run A, 1 in run B) the list **opened on screen** (menu top 203 px, left ≈1338 px, visible) with all three locations: Staging Heavy Duty - 9919 · Staging Lethbridge - 4310 · Test Location. Switching back to Heavy Duty worked and survived a reload.
- Backspace on the chip left it showing "Staging Lethbridge - 4310"; the stored location was unchanged.

This does **not** prove the DVI-Test-specific cause is fixed: in the original report the same steps with Lethbridge already worked before the fix. Only a location set up like staging's DVI Test can show that.''',
 pics=['SV-11822/A-2-after-reload-dashboard.png', 'SV-11822/A-5-after-reload-work-orders.png', 'SV-11822/B-1-test-location-after-reload.png'],
 ev='SV-11822/evidence-A.json, SV-11822/evidence-B.json',
 when='4 Nov 2026, 20:49–20:51 UTC', loc=('Staging Heavy Duty - 9919 / Staging Lethbridge - 4310 (run A, America/Edmonton) and Test Location (run B, Asia/Karachi)', 'America/Edmonton'),
 passc=None)
T['SV-11823'] = dict(title='Dashboard Revenue tile shows negative Parts % and Labor over 100% when credit memos are in range', verdict='PASS',
 expected='''> **Expected**
> * Supporting line shows a sensible split (no negative share, no share above 100%), or the tile falls back to "{count} Invoices" like it does when revenue is negative.

Source: SV-11823 description. Product decision (Chris Ward, 28 Oct 2026, "Dashboard and Reports – questions for Chris Ward", question 3, as posted by Bilal Muzamil on SV-11823, comment 79712): *"Hide the split line whenever any share is negative. Only show it when all three are 0% or more. Defect."* and *"Please keep showing the split line whenever all three shares are 0 % or more, including when one of them is exactly 0 %."*''',
 steps='''The ticket's day (Oct 9, 2026 at Heavy Duty) has no data on sv11839. Equivalent single days at **Lethbridge** (Dashboard → Revenue tile → one-day custom range → Apply, then the tile's report link → Sales report for that day):
- **Jul 22, 2026** — existing data with a credit memo (CM11839-3821, −$484.45).
- **Nov 4, 2026** — seeded: invoice S11839-17591 + credit memo CM-4190 (−$25.00).
- **Apr 7, 2026** — existing data where Parts is exactly $0.00 (the "exactly 0 %" case).''',
 seen='''| Day (Lethbridge) | Sales report: Parts Invoiced | Revenue | Tile supporting line | Expected |
|---|---|---|---|---|
| Jul 22, 2026 | **−$306.79** (credit −$484.45) | $1,079.42 | **"4 Invoices"** (split hidden) | split hidden → "{count} Invoices" |
| Nov 4, 2026 | **−$25.00** | $151.74 | **"1 Invoice"** (split hidden) | split hidden → "{count} Invoices" |
| Apr 7, 2026 | **$0.00** | $298.29 | **"Parts 0% · Labor 90% · Other 10%"** | split shown (all ≥ 0 %, one exactly 0 %) |''',
 pics=['SV-11823/revenue-tile-lethbridge-2026-07-22.png', 'SV-11823/revenue-tile-lethbridge-2026-04-07.png', 'SV-11823/sales-report-lethbridge-2026-07-22.png'],
 ev='SV-11823/evidence.json', when='4 Nov 2026, 20:31–20:33 UTC', loc=('Staging Lethbridge - 4310', 'America/Edmonton'),
 passc='QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Lethbridge, Edmonton time. On a day where credits make Parts negative (Jul 22: Parts −$306.79) the Revenue tile no longer shows the split and reads "4 Invoices"; same on Nov 4 (Parts −$25.00 → "1 Invoice"). On a day where Parts is exactly $0.00 (Apr 7) the split is still shown: "Parts 0% · Labor 90% · Other 10%". Picture: SV-11823/revenue-tile-lethbridge-2026-07-22.png')
T['SV-11824'] = dict(title='Dashboard date picker: first date click clears the existing range instead of selecting the date', verdict='PASS',
 expected='''> **Expected**
> * Oct 9 is selected as the start of a new range (header shows "Oct 9, 2026", Range: 1 days).

Source: SV-11824 description (related story SV-9579). (The wording "1 days" was itself corrected to "1 day" by SV-11821.)''',
 steps='Dashboard → Revenue tile → click the date chip (shows This Month) → click one date once. Done three ways: (a) as written — go to October, click Oct 9 once; (b) a date inside the current This Month range (Nov 2) — the cause named by the developer; (c) with a custom range already set (Oct 9 – Oct 15), reopen and click Oct 12 once.',
 seen='''| Case | Header after ONE click | Footer |
|---|---|---|
| (a) Oct 9, as written | **"Oct 9, 2026"** | **"Range: 1 day"** |
| (b) Nov 2, inside This Month (Nov 1–4) | **"Nov 2, 2026"** | **"Range: 1 day"** |
| (c) Oct 12, inside the set range Oct 9–15 | **"Oct 12, 2026"** | **"Range: 1 day"** |

A second click closed the range as before (Oct 9 → Oct 15 gave "Oct 9, 2026 — Oct 15, 2026", "Range: 7 days").''',
 pics=['SV-11824/as-written-first-click-oct9.png', 'SV-11824/this-month-first-click-nov2.png', 'SV-11824/custom-range-set-first-click-oct12.png'],
 ev='SV-11824/evidence.json', when='4 Nov 2026, 19:40–19:41 UTC', loc=('Staging Heavy Duty - 9919', 'America/Edmonton'),
 passc='QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. In the Revenue tile\'s date picker, one click on a date now selects it straight away: Oct 9 → "Oct 9, 2026", "Range: 1 day". The same happens for a date inside the current range (Nov 2) and when a custom range is already set (Oct 12). Picture: SV-11824/as-written-first-click-oct9.png')
T['SV-11825'] = dict(title='Dashboard tile report links have duplicated accessible label ("Open Sales Report report")', verdict='PASS',
 expected='''> **Expected**
> * Accessible label reads e.g. "Open Sales Report"

Source: SV-11825 description (related story SV-9582).''',
 steps='Dashboard → read the accessible label (`aria-label`) of the report link icon next to each of the five tile labels, and hover each for its tooltip.',
 seen='''| Tile | Accessible label now | Hover tooltip |
|---|---|---|
| Revenue | **Open Sales Report** | Sales Report |
| Billing Efficiency | **Open Advisor Analysis Report** | Advisor Analysis Report |
| Technician Efficiency | **Open Technician Efficiency Report** | Technician Efficiency Report |
| Technician Utilization | **Open Technician Utilization Report** | Technician Utilization Report |
| Sales by Customer | **Open Sales By Customer Report** | Sales By Customer Report |

No label repeats "report".''',
 pics=['SV-11825/revenue-link-hover-tooltip.png'], ev='SV-11825/evidence.json', when='4 Nov 2026, 19:40 UTC', loc=('Staging Heavy Duty - 9919', 'America/Edmonton'),
 passc='QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. The five tile report links are now read out once each: "Open Sales Report", "Open Advisor Analysis Report", "Open Technician Efficiency Report", "Open Technician Utilization Report", "Open Sales By Customer Report". Picture: SV-11825/revenue-link-hover-tooltip.png')
T['SV-11826'] = dict(title='Dashboard Technician Utilization tile hours differ from Technician Utilization report by 0.02–0.03 hrs', verdict='PASS (no difference when the tile and the report are read at the same moment) — see the caveat',
 expected='''> **Expected**
> * Tile hours equal report Summary hours (S3-R1).

Source: SV-11826 description (related story SV-9575, S3-R1). Comments: Mudassir Qamar (27 Oct, comment 79567) could not reproduce when both were read at the same moment; the developer (comment 79615) proposes closing as Not a Bug.''',
 steps='''By the ticket's steps on screen (Dashboard → Technician Utilization tile → range → the tile's report link → report Summary row), at Heavy Duty, for **Last 12 Months** (the ticket's range), **Custom 32 days** and **Custom 366 days** ending today (where the coordinator's API read showed a 0.02–0.04 h gap), and for three ranges that end in the past (Last Year; Sep 1 – Oct 2, 2026; Oct 31, 2025 – Oct 31, 2026). Then, to separate "read at different moments" from a real difference, the tile request and the report request were fired at the same instant, 4 rounds × 4 ranges (`simultaneous-reads.json`).''',
 seen='''**On screen, ranges that include today** (the report is read ≈ 15–25 s after the tile, and technicians' clocks were still running — the hours rose 0.06 WO / 0.12 clocked between 19:28 and 19:31 UTC):

| Range | Tile (WO / Clocked) | Report Summary (WO / Total) | Gap |
|---|---|---|---|
| Last 12 Months, 19:28 | 17,820.02 / 23,550.32 | 17,820.02 / 23,550.32 | none |
| Last 12 Months, 19:31 | 17,820.08 / 23,550.44 | 17,820.12 / 23,550.52 | 0.04 / 0.08 |
| Custom 32 days | 1,517.06 / 3,032.10 | 1,517.06 / 3,032.10 | none |
| Custom 366 days | 19,238.96 / 25,284.99 | 19,238.98 / 25,285.02 | 0.02 / 0.03 |

**On screen, ranges that end in the past** (nothing can change): Last Year 20,435.47 / 25,009.99 · Sep 1 – Oct 2 1,536.00 / 3,072.00 · Oct 31 2025 – Oct 31 2026 19,199.07 / 25,113.91 — **tile and report identical in all three**, and the report's seconds ÷ 3,600 equal the tile.

**Tile and report requested at the same instant** (16 pairs): **15 identical**, 1 differed by 0.01 h with the tile higher, the two answers 0.4 s apart while clocks were running.

So the hours match whenever both are read at the same moment; the gaps seen on screen come only from the report being read seconds after the tile while clocks are running. This contradicts the earlier reading in `rerun-sv11839-2026-11-04/SUMMARY-sv11839-2026-11-04.md` (row B) that the gap is the tile's own rounding.

**Caveat for the QA lead:** the ticket's Expected does not say how running clocks should be treated. A person following the steps while technicians are clocked in will see a few hundredths' difference, because the report is opened after the tile. The decision is yours (recommendation in RESULTS.md).''',
 pics=['SV-11826/past-last-year-1-tile.png', 'SV-11826/past-last-year-2-report-summary.png', 'SV-11826/last-12-months-1-tile.png', 'SV-11826/last-12-months-2-report-summary.png'],
 ev='SV-11826/evidence.json (ranges ending today), SV-11826/past/evidence.json (past ranges), SV-11826/simultaneous-reads.json',
 when='4 Nov 2026, 19:28–19:39 UTC (≈ 1:28–1:39 PM Edmonton)', loc=('Staging Heavy Duty - 9919', 'America/Edmonton'),
 passc='QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. For ranges that end in the past the tile and the report Summary show exactly the same hours (Last Year: 20,435.47 WO / 25,009.99 clocked on both). When the tile and the report are read at the same moment they also match for Last 12 Months, 32 days and 366 days (15 of 16 reads identical, one 0.01 apart). The small gaps seen earlier come from opening the report a few seconds after the tile while technicians are still clocked in. Picture: SV-11826/past-last-year-2-report-summary.png')
T['SV-11827'] = dict(title='Technician Utilization and Sales By Customer reports show dates instead of "Custom" when opened from a dashboard tile with a custom range', verdict='PASS',
 expected='''> **Expected**
> * Report opens with the same dates and its date control shows "Custom" (as Sales, Service Advisor Analysis and Technician Efficiency do).

Source: SV-11827 description (related story SV-9582, S10-E1 / S7-R2a).''',
 steps='Dashboard → each tile → custom range Oct 9 – Oct 20, 2026 → Apply → the tile\'s report link → read the report\'s date control. Done for Technician Utilization and Sales by Customer (the ticket\'s two) and, as controls, Revenue, Billing Efficiency and Technician Efficiency.',
 seen='''| Tile | Report opened | Date control |
|---|---|---|
| Technician Utilization | /reports/technician-utilization?dateRange=custom&dateRange=2026-10-09&dateRange=2026-10-20 | **Date: Custom** |
| Sales by Customer | /reports/sales-by-customer?dateRange=custom&dateRange=2026-10-09&dateRange=2026-10-20 | **Date: Custom** |
| Revenue (control) | /reports/sales?range=custom&range=2026-10-09&range=2026-10-20 | Date: Custom |
| Billing Efficiency (control) | /reports/service-advisor-analysis?… | Date: Custom |
| Technician Efficiency (control) | /reports/technician-efficiency?… | Date: Custom |''',
 pics=['SV-11827/techUtilizationKpi-report-date-control.png', 'SV-11827/salesByCustomer-report-date-control.png'], ev='SV-11827/evidence.json',
 when='4 Nov 2026, 19:40–19:43 UTC', loc=('Staging Heavy Duty - 9919', 'America/Edmonton'),
 passc='QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. With a custom range Oct 9 – Oct 20, 2026 on the tile, the Technician Utilization and Sales By Customer reports now open on those dates with the date control showing "Date: Custom", like the other three reports. Picture: SV-11827/techUtilizationKpi-report-date-control.png')
T['SV-11828'] = dict(title='Dashboard at ~1023px viewport shows small-screen "View Report" footers but keeps desktop 4-column tile layout', verdict='PASS',
 expected='''> **Expected**
> * Below 1024px the dashboard is in small-screen mode consistently: tiles stack in one column with "View Report" footers.

Source: SV-11828 description (related story SV-9584, S12-N1 / S6-E1, E2).''',
 steps='''Dashboard at a 1023 px wide viewport (as instructed), with 1022 px and 1024 px as controls. Because the original fault only appeared at a **fractional** width (the ticket: "innerWidth 1023 where actual width is fractional 1023.x"), a fourth run used a real fractional width: a 1535 px window with Chrome's own page zoom at 150 % = **1023.33 CSS px** — the browser-zoom situation the ticket describes.''',
 seen='''| Width | `(max-width:1023px)` | `(max-width:1023.98px)` | Tile columns | Footers |
|---|---|---|---|---|
| 1022 px | true | true | **1** (stacked) | **View Report** ×5 |
| 1023 px | true | true | **1** (stacked) | **View Report** ×5 |
| **1023.33 px (zoom)** | **false** | **true** | **1** (stacked) | **View Report** ×5 |
| 1024 px (control) | false | false | 4 (desktop) | View details ×6 |

At 1023.33 px — the exact condition where the two checks disagree — the dashboard is now consistently small-screen.

Note: at 1024 px the header has no room to show the location name, so that control run's location was confirmed from the change-location call and the stored location only (its zone record says so).''',
 pics=['SV-11828/fractional-1023_33.png', 'SV-11828/viewport-1023.png', 'SV-11828/viewport-1024.png'], ev='SV-11828/evidence.json',
 when='4 Nov 2026, 19:47–19:49 UTC', loc=('Staging Heavy Duty - 9919', 'America/Edmonton'),
 passc='QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. At 1023 px wide, and at 1023.33 px (browser zoom 150 % on a 1535 px window — the in-between width from the ticket), the dashboard tiles stack in one column with "View Report" footers. At 1024 px the desktop layout appears, as intended. Picture: SV-11828/fractional-1023_33.png')
T['SV-11829'] = dict(title='Dashboard expanded chart/table don\'t show load failure', verdict='PASS',
 expected='''> **Expected**
> * Tile shows it couldn't load, and the expanded chart and table also show a load error (not data, not "no data").

Source: SV-11829 description (related story SV-9578, S6-R15).''',
 steps='''Dashboard → Billing Efficiency → View details (This Month loaded normally: chart + 3 table rows). Then the Billing Efficiency dashboard request was **made to fail in the browser on purpose** (Playwright `page.route`; every `/api/dashboard/reports` request carrying `billingEfficiencyKpi` answered with an HTTP 500 error). Case A: change the tile to Last Month. Case B: change it back to This Month (loaded earlier).
Why HTTP 500 and not a blocked connection: on this sandbox a blocked connection makes the page fall onto the hosting service's "Environment Sleeping" screen (seen once this run, and recorded before in `build/report-suite/rulings-2026-08-04/RULING-1-THE-15-CASES.md`), which is not the app at all.''',
 seen='''| | Tile | Expanded chart | Expanded table | Other tiles |
|---|---|---|---|---|
| Before (This Month, loaded) | 383.33% | chart drawn | 3 rows | fine |
| **Case A** — Last Month, request fails | **Couldn't load** | **Couldn't load** (no chart, no "No data…") | **Couldn't load** (0 rows) | unaffected |
| **Case B** — back to This Month, request fails | **Couldn't load** | **Couldn't load** — no old data | **Couldn't load** (0 rows) | unaffected |

Observation (not part of this ticket's Expected): with an HTTP 500 the app also shows its general red message "Ooooops! An error occurred" in the corner. The original report used a blocked connection and saw no message; a server error and a blocked connection are not the same failure.''',
 pics=['SV-11829/B-this-month-request-blocked.png', 'SV-11829/A-last-month-request-blocked.png', 'SV-11829/0-expanded-this-month-loaded.png'], ev='SV-11829/evidence.json',
 when='4 Nov 2026, 20:07–20:09 UTC', loc=('Staging Heavy Duty - 9919', 'America/Edmonton'),
 passc='QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. I made the Billing Efficiency data fail to load on purpose (the browser answered that request with a server error) while the tile was expanded. For a range never loaded before (Last Month) and for one loaded earlier (This Month), the tile, the expanded chart and the Advisor Analysis table all say "Couldn\'t load" — no "No data" message and no old figures. Picture: SV-11829/B-this-month-request-blocked.png')
T['SV-11885'] = dict(title='Report downloads: text that starts with =, +, - or @ opens as a formula in a spreadsheet', verdict='PASS for the 8 downloads that could be checked — 3 downloads (and the QuickBooks and tab/carriage-return parts) NOT VERIFIED',
 expected='''> **Expected**
> Every text cell in every report download that starts with =, +, -, @, a tab or a carriage return gets one apostrophe in front of it, so a spreadsheet opens it as text. This is the same guard the newer report downloads already use. Numbers, dates and money columns are not changed. Nothing sent to QuickBooks ever carries the apostrophe.
>
> **How to check** 1. Create a customer named "=1+1" and a vendor named "-Test". 2. Download each report listed above for a range that includes them. 3. Open each file in a plain text editor. Their names start with one apostrophe. 4. Open each file in a spreadsheet. The names show as typed, not as 2 or an error.

Source: SV-11885 description. The list of downloads comes from Nemanja Djuric's comment on SV-11869 (28 Oct 2026, comment 79656): "the 10 older report downloads (customer contacts, payments, credit memos, vendor bills, journal entries, payroll timesheets, …)". **The full list of ten is not written down (it ends in "…")**; I took it to be the ten older entries in Reports → Export Reports, which on this build lists exactly 11 downloads (Customer Invoice + 10).''',
 steps='''Records used: existing test records on sv11839 — customer **"=1+1"**, contact **"@Contact Test"**, vendor **"-Test Vendor"** (made by another session on 3 Nov) — plus ZZAUTOTEST seeds made today at Heavy Duty: customer **"+ZZAUTOTEST QA11839 Plus"** with contact **"@ZZAUTOTEST -Contact"**, an invoice and a credit memo for it, staff **"-ZZAUTOTEST QA11839 Tech"** clocked on its work order, vendor **"@ZZAUTOTEST QA11839 Vendor"** with a vendor credit "=ZZAUTOTEST credit 1+1". Then Reports → Export Reports → each of the 11 reports → This Month → Export (downloaded before and after seeding); each file read as raw text (step 3) and imported into LibreOffice with formulas switched on (step 4).''',
 seen='''| Download | Text checked (as in the raw file) | Result |
|---|---|---|
| Customer Contact | `'=1+1`, `'+ZZAUTOTEST QA11839 Plus`, `'@Contact Test`, `'@ZZAUTOTEST -Contact` | **one apostrophe each** |
| Customer Invoice (Customer column) | `'=1+1` (3 rows), `'+ZZAUTOTEST QA11839 Plus` | **one apostrophe each** |
| Customer Payment | `'=1+1` | **one apostrophe** |
| Customer Credit Memo | `'=1+1`, `'+ZZAUTOTEST QA11839 Plus` | **one apostrophe each** |
| Vendor Contact | `'-Test Vendor`, `'@ZZAUTOTEST QA11839 Vendor` | **one apostrophe each** |
| Vendor Bill | `'-Test Vendor` | **one apostrophe** |
| Vendor Bill Payment | `'-Test Vendor` (2 rows) | **one apostrophe each** |
| Payroll Timesheet | `'-ZZAUTOTEST QA11839 Tech` | **one apostrophe** |
| Vendor Credit Memo | — | **NOT VERIFIED**: the download gives no file (server answers an empty report). A vendor credit was created, but I could not confirm it is the kind of record this report lists |
| Journal Entry | — | **NOT VERIFIED**: its text is written by the system ("Inventory Increase; …") and always starts with a word, so no row can start with = + - @ |
| Sales Representative Assignments | — | **NOT VERIFIED**: none of its 1,859 rows has such a name; giving the test customer a sales rep failed (HTTP 500 on my request) |

Across all files: **no unguarded cell, no double apostrophe, and no apostrophe on a number or amount** (e.g. negative amounts in Journal Entry and Vendor Bill Payment stay plain). In LibreOffice (formulas on), every guarded cell opened as **text**, not a formula; LibreOffice shows the apostrophe in the cell (SV-11869's note says some spreadsheet apps show it and some hide it).

Also NOT VERIFIED: the **Location** column of Customer Invoice (no location name starts with these characters, and renaming a shared location was not done); a **tab or carriage return** at the start of a value (not seeded); **QuickBooks** (no QuickBooks connection was checked on sv11839).''',
 pics=['SV-11885/0-export-dialog-after.png', 'SV-11885/vendor-credit-memo-export-this-month.png'],
 ev='SV-11885/scan-before.json, scan-after.json (per file: unguarded / guarded / double / number counts), raw-file-lines-test-records-after.txt (the exact raw lines of the test records), downloads-*.json, vendor-credit-memo-export-network.json. The downloaded files themselves are kept out of git (they hold business data).',
 when='4 Nov 2026, 20:55–21:13 UTC', loc=('Staging Heavy Duty - 9919', 'America/Edmonton'),
 passc='QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. I downloaded the 11 reports in Reports → Export Reports (This Month) with test names starting with =, +, - and @ (for example customer "=1+1", vendor "-Test Vendor", technician "-ZZAUTOTEST QA11839 Tech"). In 8 downloads (Customer Contact, Customer Invoice, Customer Payment, Customer Credit Memo, Vendor Contact, Vendor Bill, Vendor Bill Payment, Payroll Timesheet) every such name starts with exactly one apostrophe, numbers are unchanged, and a spreadsheet opens them as text. Not checked yet: Vendor Credit Memo (no file was produced), Journal Entry (its text can never start with these characters), Sales Representative Assignments (no such name in it), and QuickBooks. Picture: SV-11885/0-export-dialog-after.png')
T['SV-11931'] = dict(title='Dashboard - Technician Efficiency counts a line the customer declined', verdict='PASS',
 expected='''> **Expected:** Fabian Bonjean shows **1.00** Invoiced Tech Hrs, **1.00** Clocked, **100.00 %**. Only line 1 was billed: 1.00 ÷ 1.00 = 100 %.

Source: SV-11931 description; Chris Ward's answer to question 1 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026): *"(b) Only billed lines count. A declined line wasn't invoiced, so its tech time shouldn't count either. Defect."*; confirmed by Chris Ward on SV-11931 (29 Oct 2026, comment 79842): *"neither its tech time nor its clocked time … in the Invoiced view, on each invoiced work order, count only the lines that are not declined … 1.00 Invoiced Tech Hrs / 1.00 Clocked = 100.00%."*''',
 steps='''DVI Test, Fabian Bonjean and S1-38198 are staging-only, so the ticket's setup was **seeded** the same way at Heavy Duty (ZZAUTOTEST, 4 Nov): work order **S11839-17589** (customer "ZZAUTOTEST QA11839 TE Declined") with line 1 **Complete** (1.00 h tech time, 1.00 h clocked) and line 2 **Declined** (1.00 h tech time, 0.50 h clocked), both clocked by technician **Michael Stephenson**, then invoiced (the invoice bills line 1 only: Labor $164.95). Then Dashboard → Technician Efficiency tile → range → View details → his row; and Reports → Technician Efficiency → Invoiced. Range: **Nov 4, 2026** (the seed day) — under Last 12 Months his row also holds months of older work, so the ticket's expected figures can only be read on the seed day.''',
 seen='''| Where | Michael Stephenson | Expected |
|---|---|---|
| Dashboard → Technician Efficiency → View details (Nov 4) | **1.00 Clocked · 1.00 Invoiced Tech Hrs · 100.00%** | 1.00 / 1.00 / 100.00% |
| Reports → Technician Efficiency → Invoiced (Nov 4) | chart point **100%** | 100% |

Work order Lines tab: line 1 "1.00 / 1.00 Complete", line 2 "0.50 / 1.00 Declined". Finance tab: invoice INV-S11839-17589 lists only line 1. If the declined line were still counted, the row would read 2.00 / 1.50 = 133.33%.''',
 pics=['SV-11931/1-dashboard-te-today-stephen-grimes.png', 'SV-11931/3-work-order-lines.png', 'SV-11931/4-work-order-finance.png', 'SV-11931/5-report-technician-efficiency-today.png'],
 ev='SV-11931/evidence.json (picture names say "stephen-grimes" because the staff list showed that name for the technician id used; the work order and Dashboard show the technician as Michael Stephenson)',
 when='4 Nov 2026, 20:10–20:15 UTC', loc=('Staging Heavy Duty - 9919', 'America/Edmonton'),
 passc='QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. I made a test work order (S11839-17589) with one completed line (1.00 h clocked) and one declined line (0.50 h clocked), both 1.00 h of tech time, and invoiced it. On the Dashboard, Technician Efficiency → View details, the technician now shows 1.00 Clocked, 1.00 Invoiced Tech Hrs and 100.00% — the declined line is left out, as Chris asked. Picture: SV-11931/1-dashboard-te-today-stephen-grimes.png')
T['SV-11934'] = dict(title='Reports - Sales By Customer keeps the old Labor Delta after a timesheet is corrected (Dashboard table too)', verdict='PASS',
 expected='''> **Expected:** Labor Delta reads **0.00**, the same as the work order's Stats tab today.

Source: SV-11934 description; Chris Ward's answer to question 27 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026): *"Use the figures as they are now, so the reports agree with the work order's Stats tab. Defect."*''',
 steps='''Seeded at Heavy Duty (DVI Test is staging-only): customer "ZZAUTOTEST QA11839 SBC Delta", work order **S11839-17590**, one labor line of 1.00 h tech time, technician **Jermaine Wilcox** clocked 11:51 AM – 12:21 PM (0.50 h), line Complete, invoiced. Then the ticket's steps 5–9: Dashboard → Sales by Customer → View details (Labor Delta before) → Reports → Timesheet Activities → pencil on that clock → Start 30 minutes earlier → Save → work order Stats tab → Dashboard again; also the Sales By Customer report. Range: **Nov 4, 2026** — under Last 12 Months the Dashboard table lists only the top 15 customers at Heavy Duty, so the test customer cannot appear there.''',
 seen='''| Step | Seen |
|---|---|
| 5. Dashboard → Sales by Customer → View details, before | Labor Delta **+0.50** (1.00 invoiced − 0.50 worked) |
| 6–7. Timesheet Activities → Edit timesheet: Start 11:51 AM → **11:21 AM** → Save | saved (row now 11:21 AM – 12:21 PM, **1.00** h) |
| 8. Work order Stats tab | Tech hours **1.00**, Clocked hours **1.00** (before: 1.00 / 0.50) |
| 9. Dashboard → Sales by Customer → View details, after | Labor Delta **0.00** |
| Reports → Sales By Customer (Nov 4), after | Labor Delta **0.00** |''',
 pics=['SV-11934/6-dashboard-sbc-today-sbc-after.png', 'SV-11934/1-dashboard-sbc-today-sbc-before.png', 'SV-11934/4b-timesheet-row-after.png', 'SV-11934/5-work-order-stats-sbc-after.png', 'SV-11934/7-sales-by-customer-report-today-after.png'],
 ev='SV-11934/evidence.json (phases sbc-before, sbc-edit, sbc-after), SV-11934/evidence-report.json',
 when='4 Nov 2026, 20:23–20:40 UTC', loc=('Staging Heavy Duty - 9919', 'America/Edmonton'),
 passc='QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. Test work order S11839-17590: 1.00 h invoiced, 0.50 h clocked, so Labor Delta read +0.50. I then moved the clock\'s start 30 minutes earlier in Timesheet Activities (clock now 1.00 h). The work order\'s Stats tab shows 1.00 / 1.00, and both the Dashboard (Sales by Customer → View details) and the Sales By Customer report now show Labor Delta 0.00. Picture: SV-11934/6-dashboard-sbc-today-sbc-after.png')
for k, t in T.items():
    loc, tz = t['loc']
    pics = '\n'.join(f'- `{p}`' for p in t['pics'])
    md = f"""# {k} — {t['title']}

**Ticket:** https://shopview.atlassian.net/browse/{k} (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: {t['verdict']}

## What the ticket expects (verbatim)
{t['expected']}

## What I did
{t['steps']}

## What I saw
{t['seen']}

## Build, time, location, zones
- Build: {BUILD}
- When: {t['when']}
- {zones(loc, tz)}

## Pictures (deviceScaleFactor 2)
{pics}

## Evidence
{t['ev']}

No Jira or TestRail write was made.
"""
    if t.get('passc'):
        md += f"\n## Draft QA-pass comment (NOT POSTED)\n{t['passc']}\n"
    else:
        md += "\n## Draft comment (NOT POSTED)\nNot a pass and not a failure: the ticket's own step needs a location called \"DVI Test\", which does not exist on the QA branch sv11839 (it has only Staging Heavy Duty - 9919, Staging Lethbridge - 4310 and Test Location). On sv11839 (build v26.45.0-aacb66c, 4 Nov 2026), switching to Lethbridge, reloading Dashboard, Reports > Sales, Customers and Work Orders, and opening the location list each time worked every time: the list opened on screen with all three locations and switching back worked. Because Lethbridge also worked before the fix in the original report, this still needs checking on a location set up like staging's DVI Test (for example on staging after this branch is merged).\n"
    os.makedirs(os.path.join(OUT, k), exist_ok=True); open(os.path.join(OUT, k, 'RESULT.md'), 'w').write(md)
    print('wrote', k)
