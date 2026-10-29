# Filter recheck: worker F1 (Dashboard + labor), 29 Oct 2026

**Scope:** SV-11931, SV-11932, SV-11933, SV-11934, SV-11937, SV-11938, SV-11939, SV-11948, and the held draft A5 (Payroll Timesheet).
**Method:** the brief's six steps, plus Amendment 1. For every filter the ticket uses I say whether it IS the thing being tested; every filter that is not the subject is deselected (cleared, set to All, or widened to the widest choice), and the reproduction is run again.
**Nothing was written outside the repo.** No Jira, no TestRail, no Google. One throwaway timesheet was made and then deleted (see SV-11939).

## Builds, zones, location guard

- **Builds.** Staging changed twice while I worked:
  - `v26.43.2-f8698cb` (first runs only; superseded);
  - `v26.43.2-9272076`;
  - `v26.43.3-8ad4001` (current).

  I diffed each change in `../shopview`: no report or Dashboard file changed (timesheet date checks, dependencies, accounting screens, work-order scoping). **Every verdict below was re-run on `v26.43.3-8ad4001`, except SV-11939.** SV-11939 ran on `9272076`: re-running it needs a new seeded clock, and its two screens did not change.
- **Rule 99.** In every run all four places match the location's own zone, and the screen runs record them in their `ui-<MODE>.ui.json`:
  - the session (`change-location` with the zone);
  - the browser `timezoneId`;
  - the process `TZ`;
  - the app's `localStorage['timezone']`.

  The server reads record `process_zone`, `location_tz` and the session `change_location` in their own `srv-*.json`.
- **Location guard (coordinator, 29 Oct).** Every boot2 run sets `localStorage['location']` before the first page load, and asserts all of the following, at both start and end:
  - the header names the intended location;
  - every API request carried `X-Location-ID` = the intended workplace;
  - the stored location is unchanged.

  Results:
  - **All final runs: `VALID: true`.**
  - The `f8698cb` runs had no guard. They are superseded, and nothing is based on them.
  - One A5 run first failed the end check, because it ended on a drawn CSV picture with no app header. It was re-run with the header read before drawing, and is VALID.
  - **Re-run because of the guard:** every mode (P11, P12, P13, P14, P11R, P12R, P13R, P14R, C1, A1, A2, A5DVI, A5HD).
- **Hidden / remembered filters, all screens.** A fresh context starts with only `user`, `fe_permissions_wrapper`, `location` and `timezone` in storage. From the source at the build commit (facts only, never expectations):
  - Report filters live in the URL only. No report in my scope saves filters to the account (`persistFiltersToAccount` is used only by Staff, Customer and Vehicle tabs).
  - Remembered in browser storage only:
    - `report_table:<report>` (columns and sort);
    - the Dashboard card technician/advisor filter, `dashboard-card-<chart>-entityFilter:<org>:<user>`. It is created on first visit with **nothing deselected**, and then no `tech[]` is sent.
  - Dashboard card date ranges are session-only.
  - None of the original evidence runs sent a `tech[]`, `service_advisor[]` or customer narrowing that the tickets did not name. **Hidden filters found: none, on any ticket.**
- **The Dashboard has no location picker.** It shows the header location only. So "location" on a Dashboard ticket is required, not removable; the record lives at the location the ticket names.

---

## SV-11931 (P1-1): Dashboard Technician Efficiency counts a declined line

| Filter the ticket uses | Subject? | Why |
|---|---|---|
| Dashboard tile date, custom **Oct 25 – Oct 28** | **NO** | Only picked to frame the example; the line was billed on 28 Oct, so any range that contains it shows the defect. |
| Location **DVI Test** | NO (required) | The test work order lives there; the Dashboard has no "all locations". |
| Card Technician filter (left at **All technicians**) | NO | Default; nothing deselected; no `tech[]` sent. |
| Report tab **Invoiced** (step "Reports → Technician Efficiency → Invoiced") | NO | The report's default tab. |

**Fresh defaults:**
- Tile: **This Month**.
- Card filter: **Technician: All technicians**.
- Report: **Date: This month**, tab **Invoiced**.

**Three runs** (screen = server):

| Run | Tile | Fabian Bonjean row |
|---|---|---|
| (i) ticket: Oct 25–28 | 158.10 % (8.00 / 5.06) | 1.50 Clocked / 2.00 Tech Hrs / 133.33 % |
| (ii) fresh default: This Month | 158.10 % (8.00 / 5.06) | 1.50 / 2.00 / 133.33 % |
| (iii) widest: Last 12 Months, all technicians | 158.10 % (8.00 / 5.06) | 1.50 / 2.00 / 133.33 % |

On the report (This week, This month, Last 12 months), S1-38198 line 2 is counted every time: 0.5 Clocked / 1 Tech Hrs. Billing Efficiency shows 4.04 Clocked in all three runs (= 5.06 − 1.02).

**Expected-value check:**
- Fabian Bonjean's only lines in ANY range are S1-38198 lines 1 and 2. So the expected 1.00 / 1.00 / 100.00 % holds for every range.
- "This Week" on 28 Oct was Sun 25 – Wed 28 Oct. Correct.

**Verdict: KEEP, EDIT.** The defect shows with every filter deselected; the ticket used an unneeded custom date.

**Exact sentences to change:**
1. Step 4.
   - **Old:** "On the **Technician Efficiency** tile, click the date button. Pick **Oct 25, 2026** to **Oct 28, 2026**, then click **Apply**. (This was "This Week" when we checked.)"
   - **New:** "On the **Technician Efficiency** tile, click the date button, pick **Last 12 Months**, then click **Apply**."
2. The tile paragraph.
   - **Old:** "When we took the picture it read **158.10 %** (8.00 Invoiced Tech Hrs / 5.06 Clocked). Three lines were declined at DVI Test that week, with 1.02 hours clocked on them."
   - **New:** "With Last 12 Months it reads **158.10 %** (8.00 Invoiced Tech Hrs / 5.06 Clocked). The declined lines at DVI Test have 1.02 hours clocked on them."
3. Screenshot 1 caption.
   - **Old:** "Dashboard, Technician Efficiency, This Week (Oct 25 – Oct 28): Fabian Bonjean 2.00 / 1.50 / 133.33 % (should be 1.00 / 1.00 / 100.00 %)."
   - **New:** "Dashboard, Technician Efficiency, Last 12 Months, all technicians: Fabian Bonjean 1.50 Clocked / 2.00 Invoiced Tech Hrs / 133.33 % (should be 1.00 / 1.00 / 100.00 %)."

**Figures:** unchanged. Actual 2.00 / 1.50 / 133.33 %. Expected 1.00 ÷ 1.00 = 100.00 %.

**Replacement picture 1:** `evidence/f1/SV-11931-replacement.png`.

---

## SV-11932 (P1-2): Technician Efficiency drops tech time when a clock is under 36 seconds

| Filter the ticket uses | Subject? | Why |
|---|---|---|
| Dashboard tile date **Aug 25, 2026** (single day) | **NO** | Narrowed only to isolate one example. |
| Location **Staging Lethbridge - 4310** | NO (required) | The record lives there. |
| Card Technician filter (All) | NO | Default. |
| Report date **Last quarter** (step 7) | **NO** | Only to reach Aug 2026. |

**Fresh defaults:**
- Tile: This Month (100.00 %, 30.00 / 30.00). The Aug 25 line is not in it, which is correct.
- Report: This month; Joseph Nelson is not in that range.

**Three runs:**

| Run | Tile | Joseph Nelson | Report line S3-17383 #4 |
|---|---|---|---|
| (i) Aug 25 / Last quarter | 33.50 / 29.36 = 114.10 % | 9.75 / 7.43 = 131.22 % | 0.01 Clocked / **0** Tech Hrs |
| (ii) This Month | 30.00 / 30.00 = 100.00 % | not in range | not in range |
| (iii) Last 12 Months, all technicians | 8,135.67 / 7,345.65 = 110.75 % | 1,313.09 / 1,131.63 = 116.04 % | 0.01 / **0** |

**Expected-value check:**
- (a) The filed figures are right for the filter they name. On 25 Aug, S3-17383 line 4 is the ONLY line with the symptom (server read of every technician, every line, that day). So 34.00 / 115.80 % and 10.25 / 137.95 % stand.
- (b) For Last 12 Months, I read every technician's lines (server). 29 lines with tech time show the symptom:
  - lines where the technician was the only clocker lose **4.40 h**, of which **3.08 h** are Joseph Nelson's (including the 0.50 h of S3-17383 line 4);
  - lines shared with other technicians add at most 0.08 h (0.05 h for Joseph);
  - neither changes the percentages at two decimals.

**Verdict: KEEP, EDIT.** The defect still shows with the widest range; the single day was an unneeded filter.

**Exact sentences to change:**
1. Step 4.
   - **Old:** "Pick **Aug 25, 2026** as both the start and the end date, then click **Apply**."
   - **New:** "Pick **Last 12 Months**, then click **Apply**."
2. Step 7.
   - **Old:** "set the date to **Last quarter**"
   - **New:** "set the date to **Last 12 months**"
3. Actual.
   - **Old:** "the tile reads **33.50** Invoiced Tech Hrs / **29.36** Clocked = **114.10 %**. Joseph Nelson reads **9.75** Invoiced Tech Hrs, **131.22 %**."
   - **New:** "the tile reads **8,135.67** Invoiced Tech Hrs / **7,345.65** Clocked = **110.75 %**. Joseph Nelson reads **1,313.09** Invoiced Tech Hrs / **1,131.63** Clocked = **116.04 %** (29 Oct 2026)."
4. Expected. Replace the table with:

   > "Every line where a technician clocked under 36 seconds should give that technician their share. In these 12 months that is 4.40 hours at Lethbridge, 3.08 of them Joseph Nelson's (0.50 is line 4 of S3-17383).
   > Tile: 8,135.67 + 4.40 = **8,140.07** ÷ 7,345.65 = **110.82 %**.
   > Joseph Nelson: 1,313.09 + 3.08 = **1,316.17** ÷ 1,131.63 = **116.31 %**."
5. Screenshot 1 caption.
   - **New:** "Dashboard, Lethbridge, Technician Efficiency, Last 12 Months: 8,135.67 / 7,345.65 = 110.75 %, Joseph Nelson 1,313.09 / 116.04 % (should be about 8,140.07 / 110.82 % and 1,316.17 / 116.31 %)."

**Replacement picture 1:** `evidence/f1/SV-11932-replacement.png`.

**Note for the QA lead (not a verdict change):**
- The 12-month figures move as the window slides, and they rest on 29 lines.
- The single line row (S3-17383 line 4: 0.01 Clocked, 0 Tech Hrs, should be 0.50) is the same in every range, and is the clearest example for a first-time reader.

---

## SV-11933 (P1-3): Technician Utilization lists a technician who clocked only seconds

| Filter the ticket uses | Subject? | Why |
|---|---|---|
| Dashboard date **This Month** (default) | NO | Default; widest also checked. |
| Location **Staging Heavy Duty - 9919** (Dashboard) | NO (required) | No picker on the Dashboard. |
| Report **Location** chip (left on its default, Heavy Duty) | **NO** | Not named in the steps, but it narrows the report; widened to All locations. |
| Report Technician (All); sort Total Hours | NO | Default; a sort is not a filter. |

**Three runs:**

| Run | Dashboard (Heavy Duty) | Report |
|---|---|---|
| (i) ticket: This Month | QA Technician 0.00 / 0.00 / 0.00 / n/a | QA Technician 0.00 / "—" |
| (ii) fresh default | same | same |
| (iii) Last 12 Months, all technicians (+ report All locations) | **Nebojsa Custom-Admin** and QA Technician both 0.00 / n/a | **Nebojsa Custom-Admin 0.00 / "—"**; QA Technician becomes **0.01 / 100 %** |

**Server, all locations:**
- QA Technician totals exactly **36 seconds** (0.01 h). That includes a 0.01 h clock at Lethbridge on 21 Oct, so 0.01 h is not "under 0.01".
- Nebojsa Custom-Admin's only clocks are four of a few seconds each: 16 Sep 2026 (S2-33086) and 17 Sep 2026 ×3 (S2-33118), all at Heavy Duty.

**Expected-value check:** the ticket's example only holds with the report's Location left on Heavy Duty. Widened, QA Technician is no longer an example. The defect still shows, through Nebojsa Custom-Admin.

**Verdict: KEEP, EDIT.** Change the example to Nebojsa Custom-Admin with the widest date.

**Exact sentences to change:**
1. Step 4.
   - **Old:** "On the **Technician Utilization** tile, the date reads **This Month**. Click **View details**. - From 1 November 2026, pick **Oct 1, 2026** to **Oct 31, 2026** first."
   - **New:** "On the **Technician Utilization** tile, click the date button, pick **Last 12 Months**, then click **Apply**. Click **View details**."
2. Step 6.
   - **Old:** "Find **QA Technician**. Their only clock this month was on work order **S2-38042**, line "E2E test labor line", on 22 Oct 2026, and it lasted a few seconds."
   - **New:** "Find **Nebojsa Custom-Admin**. Their only clocks in the last 12 months are four clocks of a few seconds each, on work orders **S2-33086** (16 Sep 2026) and **S2-33118** (17 Sep 2026)."
3. Step 7.
   - **Old:** "open **Reports → Technician Utilization** with **Date: This month**, and sort by **Total Hours**."
   - **New:** "open **Reports → Technician Utilization**, set **Date: Last 12 months** and **Location: All locations**, and sort by **Total Hours**."
4. Actual.
   - **Old:** "QA Technician is listed"
   - **New:** "Nebojsa Custom-Admin is listed"
5. Expected.
   - **Old:** "QA Technician is **not listed**"
   - **New:** "Nebojsa Custom-Admin is **not listed**"
6. "Where it was seen": the bullet "Also seen for Nebojsa Custom-Admin … with This Year selected".
   - **New:** "Also seen for QA Technician (one clock of a few seconds on S2-38042, 22 Oct 2026) when the report's Location is left on Staging Heavy Duty - 9919."

**Replacement picture 1:** `evidence/f1/SV-11933-replacement.png`.

---

## SV-11934 (P1-4): Sales By Customer keeps the old Labor Delta after a timesheet edit

| Filter the ticket uses | Subject? | Why |
|---|---|---|
| Dashboard Sales by Customer date, "the current week" (step 5) | **NO** | The tile's default is Last 12 Months, which shows the same. |
| Location **DVI Test** | NO (required) | Test data lives there. |
| Report (named only): Date, Product Type All, Customer All, Location (default DVI Test) | NO | Widened to Last 12 months and All locations. |

**Three runs:**
- Dashboard: ZZAUTOTEST Dash Q27 Labor Delta **+0.50** in all three runs: This Week; Last 12 Months (fresh default); Last 12 Months again.
- Report: **+0.50** for This month (default), This week, and Last 12 months.
- Server, Last 12 months, All locations (740 customers): `inv_hrs` 0.5.
- On screen with All locations, the row lies past the first 30 loaded rows; the full server read covers it.
- Work order Stats (server): tech 1.00 / clocked 1.00, so expected 0.00.

**Verdict: KEEP, EDIT.**

**Exact sentences to change:**
1. Step 5.
   - **Old:** "On the **Sales by Customer** tile, set the date to the current week and click **View details**."
   - **New:** "On the **Sales by Customer** tile, leave the date on **Last 12 Months** (its default) and click **View details**."
2. Screenshot 3 caption.
   - **Old:** "Dashboard, Sales by Customer, This Week, after the correction"
   - **New:** "Dashboard, Sales by Customer, Last 12 Months, after the correction"

**Figures:** unchanged (+0.50, should be 1.00 − 1.00 = 0.00).

**Replacement picture 3:** `evidence/f1/SV-11934-replacement.png`.

---

## SV-11937 (A1): Work In Progress shows "1 days"

| Filter the ticket uses | Subject? | Why |
|---|---|---|
| **Customer: 4 Star Truck Repair** | **NO** | Only to find the row. |
| Tab Approved - Partially Completed | NO (section) | The work order's own section; other tabs show it too. |
| As of today | NO (required, default) | The report cannot run without it. |
| Location (default Heavy Duty) | NO | Widened to All locations. |
| Sort Days Open | NO (a sort) | |

**Three runs:**
- (i) Ticket filters: S2-38105 reads "1 days".
- (ii) Fresh default (All customers, the default tab Partially Completed): S2-38105 "1 days". "1 days" also shows on Completed (S2-38143, S2-38107, S2-38106) and Not Started (S2-38101).
- (iii) All customers, All locations: S2-38105 "1 days"; Estimates S1-38104 and S1-38100 "1 days".
- Server: S2-38105 started 28 Oct 2026, 3:19 PM Karachi, so 1 calendar day as of 29 Oct. Nine work orders across all locations have 1 day open.

**Verdict: KEEP, EDIT.**

**Exact sentences to change:**
1. Delete the step "Click **Customer: All customers**, pick the work order's customer (for S2-38105: **4 Star Truck Repair**), and close the list."
2. Screenshot 1 caption.
   - **Old:** "Work In Progress, Heavy Duty, as of 10/29/2026, customer 4 Star Truck Repair, sorted by Days Open"
   - **New:** "Work In Progress, as of 10/29/2026, all customers, all locations, sorted by Days Open"

**Figures:** unchanged ("1 days", should be "1 day").

**Replacement picture:** `evidence/f1/SV-11937-replacement.png` (view-only columns Customer, Asset and Advisor hidden so Days Open fits on screen; hiding columns filters nothing).

---

## SV-11938 (A2): Work In Progress counts Receive Later parts as Parts Remaining

| Filter / choice | Subject? | Why |
|---|---|---|
| **Customer: 4 Star Truck Repair** | **NO** | Only to find the row. |
| Columns **Parts Earned / Parts Remaining** switched on | **YES** | They are the figures under test and are hidden by default. |
| Tab Approved - Not Started | NO (section) | Where the work order sits. |
| As of today | NO (default) | |
| Location (default) | NO | Widened to All locations. |

**Three runs:**
- (i) Ticket: S2-33740 Parts Earned $0.00, Parts Remaining $37.67.
- (ii) and (iii) All customers, Heavy Duty and All locations: the same, confirmed on screen (sorted by Customer) and on the server ($0 / $37.67). S2-33465 and S2-33376 also show $37.67.
- **Expected-value check:** $37.67 = $36.67 + $1.00, exactly the two Receive Later parts. The row's whole parts figure is these two parts.

**Verdict: KEEP, EDIT.**

**Exact sentences to change:**
- **Old:** "Click **Customer: All customers**, pick **4 Star Truck Repair**, and close the list."
- **New:** "Leave **Customer** on **All customers**." and, before "Find the row **S2-33740**", add: "Click the **Customer** heading so the list is sorted by customer name; 4 Star Truck Repair comes first."
- Screenshot 1 caption: change "customer 4 Star Truck Repair" to "all customers, all locations".

**Figures:** unchanged.

**Replacement picture 1:** `evidence/f1/SV-11938-replacement.png` (sorted by Customer, then the Customer column hidden so the Parts columns fit).

---

## SV-11939 (A4): Shop Efficiency leaves a running timesheet out

| Filter the ticket uses | Subject? | Why |
|---|---|---|
| **Date Range: Today** (both screens) | **NO** | Any range that contains the running timesheet shows it. |
| Location DVI Test | NO (required) | Where the test work order lives. |

**Re-run** (build `9272076`, guard VALID):
- No timesheet under 24 hours was running at any location. So I made one on screen, by the ticket's own steps: Admin Shopview, ZZAUTOTEST work order S1-38220, started 05:01 AM Toronto, 29 Oct.
- Afterwards it was deleted. `DELETE` answered HTTP 500 but removed it; read back gone from Today, This month and the current task. Recorded in `build/APP-ACTIONS-PLAYBOOK.md` under the delete recipe, per Rule 97.

| Run | Shop Efficiency Total Clocked | Timesheet Activities Totals (same range) |
|---|---|---|
| (i) Today | 0.00 | 0.71 (all of it the running timesheet) |
| (ii) This month (default) | 8.52 | 9.22 = 8.52 + 0.69 running |
| (iii) This year (widest offered) | 8.52 | 9.25 = 8.52 + 0.72 running |

**Verdict: KEEP, EDIT.**

**Exact sentences to change:**
1. The Timesheet Activities step.
   - **Old:** "Set **Date Range: Today**. Note **Totals → Total Hours** (it includes the running time)."
   - **New:** "Leave **Date Range** on **This month**. Note **Totals → Total Hours** (it includes the running time)."
2. The Shop Efficiency step.
   - **Old:** "Click **Shop Efficiency** in the left menu and set **Date Range: Today**."
   - **New:** "Click **Shop Efficiency** in the left menu and leave **Date Range** on **This month**."
3. Example.
   - **New:** "(DVI Test, This month, 29 Oct 2026): finished timesheets 8.52 h; the running timesheet 0.73 h at the moment of the picture. Actual Total Clocked Hours **8.52**; Expected 8.52 + 0.73 = about **9.25**."

**Replacement picture 2:** `evidence/f1/SV-11939-replacement.png` (the header timer shows the running timesheet).

---

## SV-11948 (C1): Sales By Representative keeps the old Labor Delta

| Filter the ticket uses | Subject? | Why |
|---|---|---|
| Date This month (default) | NO | Default; widened to Last 12 months: same. |
| Product Type All, Invoice Status All | NO | Defaults. |
| Location (default DVI Test) | NO | Widened to All locations: same. |
| Show Unassigned off | NO | The invoice has a representative. |
| Opening Viktoria Videnovic | NO (navigation) | |

**Three runs:**
- S1-38217 Labor Delta **+0.50** in all three runs, including Last 12 months with All locations (her row grows to 42 invoices).
- Server: `hours_worked` 0.5, `hours_invoiced` 1. Stats: tech 1.00 / clocked 1.00, so expected 0.00.

**Verdict: KEEP AS IS.** The steps use only defaults.

Optional (not required): "(from 1 November pick Last month)" could become "or pick Last 12 months", which never expires.

---

## Held draft A5: Payroll Timesheet export counts overlaps twice (not filed)

| Filter | Subject? | Why |
|---|---|---|
| Report Name **Payroll Timesheet** | **YES** | It is the report under test. |
| Date range (Today / Custom Sep) | **NO** | Required, and has **no default**: Export does nothing until a range is picked (no download in 60 s). So: widest. |
| Location (header) | NO (required) | The export has no location field. |

**Three runs (screen download = server):**

| Run | Haley Brown, 6 Sep (Heavy Duty) | Admin Shopview, 28 Oct (DVI Test) |
|---|---|---|
| (i) draft window: Sep 2026 / 28 Oct | 28.50 | 1.53 |
| (ii) dialog default | cannot export (no default range) | same |
| (iii) widest: Custom 01/01/2026 – 10/29/2026 | 28.50 | 1.53 |

Days over 24 h, all staff, Heavy Duty: 3 in September; 6 for Jan–Oct.

**Expected-value check, from the raw clocks in each location's own zone:**
- Haley Brown: union of her 15 clocks = **2.00** h.
- Admin Shopview: union = **1.08** h at minute precision. The draft says 1.09, which is inside the rounding of three 1-minute clocks shown as 0.02 h each.
- Suggested wording: "about 1.08".

**Verdict: KEEP, EDIT** (for the held draft).
- **Old:** "Date range **Custom** 09/01/2026 to 09/30/2026 (until 31 Oct 2026, **Last Month** gives the same)"
- **New:** "Date range **Custom**, 01/01/2026 to today"
- For the made-on-screen example, **old** "**Date range:** Today" becomes **new** "**Date range:** Custom, from 01/01 of this year to today".

**Replacement picture 3:** `evidence/f1/A5-held-replacement.png`.

---

## Tools and evidence

- **Tools** (`tools/f1/`):
  - `mint.mjs`, `f1env.py`: own session `/tmp/cln/f1/sess.txt`, mode 600;
  - `f1lib.mjs`: fresh context, Rule 99 zones, location guard;
  - `f1inv.mjs`: defaults inventory;
  - `f1ui.mjs`: three runs per ticket plus pictures;
  - `f1export.mjs`: copy of the p2a export helper;
  - `f1srv.py`: replays the screen's own requests;
  - `extras.py`, `p11extra.py`, `p12decomp.py`, `a5srv.py`: widened server reads and expected-value checks;
  - `a4probe.py`, `a4cleanup.py`: running-clock check and clean-up;
  - `anno.py`: pictures;
  - `runall.sh`, `runfinal.sh`: the batches.
- **Evidence** (`evidence/f1/`):
  - `ui-<MODE>.ui.json`: controls per phase, the requests per phase with `X-Location-ID`, storage at start and end, the zones, the guard;
  - `srv-*.json`: server replays;
  - `p12decomp-*.json`, `p12-aug25-check.json`, `a4-cleanup*.json`;
  - `*-replacement.png`: the 8 annotated pictures, each looked at.
- Staging business data (raw bodies, CSVs) stayed in `/tmp/cln/f1/`.
- Secret scan (`scan_secrets.py`) over `tools/f1`, `evidence/f1` and the playbook: clean.

**OUTSTANDING — what I need from you:**
1. The coordinator applies the edits (no Jira writes made here).
2. The QA lead may prefer to keep SV-11932's single-line example as the headline (see the note in its section).
