# Worker F1: follow-ups for the edit packages (29 Oct 2026)

**How these runs were done.** Every check below was made live today on build **`v26.43.3-8ad4001`**.
- Rule 99 in all four places: session `change-location`, browser `timezoneId`, process `TZ`, and the app's `localStorage['timezone']`. All four are recorded in each `evidence/f1/ui-<MODE>.ui.json`.
- `localStorage['location']` set before the first page load.
- Location guard passed on every run: the header names the location at start and end, every request carried `X-Location-ID` = that location, and the stored location was unchanged.

No Jira writes, no git.

## 1. SV-11932: picture 3 (was "Last quarter")

**New picture 3:** `evidence/f1/SV-11932-pic3-replacement.png`.
- Source: `ui-P12R-iii.png`, Lethbridge, America/Edmonton, 29 Oct 2026, 10:46 UTC.
- View: Technician Efficiency report, Date: Last 12 months, Joseph Nelson expanded. Row S3-17383 line 4 shows Clocked Hrs 0.01, Invoiced Tech Hrs 0 (marked).
- Annotated and looked at.
- **Caption:** "Technician Efficiency report, Lethbridge, Last 12 months, Joseph Nelson opened: line 4 of S3-17383 (Replace cabin air filter) shows Invoiced Tech Hrs 0 (should be 0.50)."

## 2. SV-11933: picture 2 (was QA Technician, This month, Heavy Duty)

**Replace it** with `evidence/f1/SV-11933-pic2-replacement.png`.
- Source: `ui-P13R-iii.png`, Heavy Duty, Asia/Karachi, 29 Oct 2026.
- View: Technician Utilization report, Date: Last 12 months, Technician: All technicians, Location: All locations, sorted by Total Hours.
- The row reads **Nebojsa Custom-Admin, 0.00 / 0.00 / 0.00 / "—"** (marked).
- Annotated and looked at.
- **Caption:** "Technician Utilization report, Last 12 months, all technicians, all locations, sorted by Total Hours: Nebojsa Custom-Admin listed with 0.00 hours and "—"."

The picture also shows QA Technician at 0.01 h ("Multiple" locations). This is why QA Technician is no longer the example. The "Where it was seen" sentence about QA Technician can stay as text without a picture; the old picture should be dropped.

**Step 7 location wording:** the report's Location control opens on the current location. Replace "**Location: All locations**" with: "click **Location** and pick **Select all**, so it reads **Location: All locations**".

## 3. SV-11939: picture 1 (was Timesheet Activities, Today, 28 Oct)

**Re-seeded the ticket's own way**, on screen, by the ticket's steps (Reports → Timesheet Activities → New):
- Admin Shopview, ZZAUTOTEST work order **S1-38220**, line Test DVI Line.
- Start **Oct 29, 2026 07:12 AM** (Toronto; "about 30 minutes ago"), End empty.
- `POST /technician-tasks/create` → 201.

**Deleted afterwards:**
- `DELETE /api/technician-tasks/ea86c481-8df2-403f-92be-dbaae3797cd2` answered **500** but removed the record.
- Read back gone from Today and This month: DVI Test This month back to 15 rows, none running.
- Evidence: `evidence/f1/a4-cleanup-Oct_29_2026_0712_AM.json`.
- The first seed (05:01 AM) was removed the same way earlier.

**Both pictures re-taken in the same run**, 11:45:49 and 11:46:02 UTC = 7:45 to 7:46 AM Toronto. They are in the same view as the example: Date Range **This month**, the default.

- **New picture 1:** `evidence/f1/SV-11939-pic1-replacement.png`. Timesheet Activities, This month. The S1-38220 row shows Active, 0.56 hours. Totals **9.09** = 8.53 finished + 0.56 running.
- **New picture 2** (replaces the earlier new picture 2): `evidence/f1/SV-11939-replacement.png`. Shop Efficiency, This month, with the timer at the top (0.56 Hrs Today). Total Clocked Hours **8.52**.

**New example text** (replaces the 8.52 + 0.73 example in the package):

> Example (DVI Test, This month, 29 Oct 2026):
> - Finished timesheets this month: **8.52** hours.
> - Admin Shopview's running timesheet on S1-38220, started 7:12 AM: **0.56** hours at the moment of the pictures.
> - Actual Total Clocked Hours: **8.52**.
> - Expected: 8.52 + 0.56 = about **9.08**. Timesheet Activities, same range, shows 9.09; the 0.01 is rounding of single rows.

**Actual / Expected lines:**
- "Actual: Total Clocked Hours leaves out the running timesheet (8.52 in our example)." (unchanged)
- "Expected: … (about 9.08 in our example), the same as Timesheet Activities."

**Captions:**
1. "Timesheet Activities, DVI Test, This month: Admin Shopview's timesheet on S1-38220 is Active (0.56 hours so far); Totals 9.09 = 8.53 finished + 0.56 running."
2. "Shop Efficiency, DVI Test, This month, while the same timesheet runs (timer at the top, 0.56 hours so far): Total Clocked Hours 8.52; the running time is missing."

The old "Technician Utilization (This month) counted the same running time: 0.78 … 0.72" bullet comes from the 28 Oct run and was not re-checked. Drop it.

## 4. SV-11937 and SV-11938: the Work In Progress Location control

**Confirmed on screen** (fresh context, each step of the edited ticket walked as written; `ui-WIP11937.ui.json`, `ui-WIP11938.ui.json`):
- Work In Progress opens with **Location: Staging Heavy Duty - 9919**, the current location, not All locations.
- Clicking it shows "Select all | 1 selected | Staging Heavy Duty - 9919 | QB Location | Staging Lethbridge - 4310 | DVI Test | Clear selection".
- **Select all** makes it read **Location: All locations**.

**Step to add to both tickets**, right after "Leave **As of** on today's date." (11937) or after "Leave **Customer** on **All customers**." (11938):
> "Click **Location: Staging Heavy Duty - 9919** and click **Select all**, so it reads **Location: All locations**. Close the list."

**SV-11937, sorting:**
- From the opening view (largest Days Open first), **one** click on the Days Open heading puts the smallest first.
- S2-38105 "1 days" is then the **2nd row**, after S1-38220 "0 days"; the next row is S2-38096 "2 days".
- The step "Click the **Days Open** heading so the smallest numbers come first." works as written.

**SV-11938, finding the row.** "4 Star Truck Repair comes first" is **not true**. With all locations, one click on Customer puts three test rows first (customer "ZZBREAK…", whose name starts with spaces), then the 4 Star Truck Repair rows. **S2-33740 is the 9th row.** Server check of every sort, both directions (`evidence/f1/wipsort-S2-33740.json`): Customer ascending is the only sort that brings it into the first screen of rows.

Replace step 9 with:
> "Click the **Customer** heading once. The list is sorted by customer name: after a few test customers, the **4 Star Truck Repair** rows come next, and **S2-33740** is in the first ten rows."

If Parts Earned and Parts Remaining are off the right edge (the long test customer names make the Customer column wide), add:
> "Scroll the table to the right to see Parts Earned and Parts Remaining."

**Picture captions.** The two replacement pictures were taken with some view-only columns switched off so the needed columns fit (this hides columns only; the rows and figures are the same). Add to the captions:
- **SV-11937:** "… (the Customer, Asset and Advisor columns are switched off in the picture so Days Open fits; this does not change the rows)."
- **SV-11938:** "… sorted by Customer, then the wide Customer column switched off so the parts columns fit in the picture (this does not change the rows)."

## 5. "Where it was seen" lines (build, date, zones of the run the new figures come from)

| Ticket | Line |
|---|---|
| SV-11931 | Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026 (Toronto time), Admin. Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto). |
| SV-11932 | Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026 (Edmonton time), Admin. Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Edmonton). |
| SV-11933 | Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026 (Karachi time), Admin. Browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi). |
| SV-11934 | Staging (https://app.staging.shopview.com): reproduced 28 Oct 2026 (Toronto time) on build v26.43.2-f8698cb (the timesheet correction was made then); re-checked 29 Oct 2026 (Toronto time) on build v26.43.3-8ad4001 with the same figures, Admin. Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto). |
| SV-11937 | Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026 (Karachi time), Admin. Browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi). |
| SV-11938 | Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026 (Karachi time), Admin. Browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi). |
| SV-11939 | Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026, about 7:45 AM (Toronto time), Admin. Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto). |
| A5 (held) | Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026 (Karachi time for Staging Heavy Duty - 9919; Toronto time for DVI Test), Admin. Browser, the app's own time-zone setting and the test computer set to each location's time zone (Asia/Karachi, America/Toronto). |
| SV-11948 (keep as is) | If the line is refreshed: build v26.43.3-8ad4001, 29 Oct 2026 (Toronto time), same figures. |

**New or changed pictures in this pass:**
- `evidence/f1/SV-11932-pic3-replacement.png`
- `evidence/f1/SV-11933-pic2-replacement.png`
- `evidence/f1/SV-11939-pic1-replacement.png`
- `evidence/f1/SV-11939-replacement.png` (re-taken)

Each was annotated with `tools/annotate_v2.py` and looked at.
