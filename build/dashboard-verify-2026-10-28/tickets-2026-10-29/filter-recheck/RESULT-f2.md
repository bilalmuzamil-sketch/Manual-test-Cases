# Filter recheck: worker F2 (Parts Velocity and Inventory Value), 29 Oct 2026

Tickets: SV-11940 (B1) · SV-11941 (B2) · SV-11942 (B3) · SV-11943 (B4) · SV-11944 (B5) · SV-11945 (B6) · SV-11946 (B7) · SV-11947 (B8), plus Side finding 2 (Parts → Returns, Cancel Return).
Verdicts use the wording of **AMENDMENT 1** (KEEP AS IS / KEEP, EDIT / OBSOLETE / NOT REPRODUCED NOW).

## Summary

| Ticket | Verdict | One-line reason |
|---|---|---|
| SV-11940 (B1) | **KEEP AS IS** | The date option is the subject. With All locations the page still sends Jul 31 to Oct 29 (91 days). The download refuses All locations, so the ticket's one location is needed. Optional wording note below on the remembered date. |
| SV-11941 (B2) | **KEEP, EDIT** | With Last 12 months, All locations and no search, Units Returned still reads 1.00 after a vendor return and 0.00 after it is cancelled. The ticket's Last 90 days, one location and search are not needed. Step 14 also needs "Are You Sure?". |
| SV-11942 (B3) | **KEEP AS IS** | The one-location pick is the subject. Last 12 months gives the same result (14 columns, no Location). All locations shows Location (15 columns). The steps use no other filter. |
| SV-11943 (B4) | **KEEP, EDIT** | With Last 12 months and All locations, Last Sale still reads 161 days (expected 91). "Last quarter" is not the subject. The search box stays, only to bring the one part on screen. |
| SV-11944 (B5) | **KEEP, EDIT** | With All locations the heading still reads "Qty" on screen and in the CSV. The PDF of all locations does not download (HTTP 500), so the PDF step keeps one location. |
| SV-11945 (B6) | **KEEP, EDIT** | With Last 12 months, All locations, no search and a Part # sort, SO1 still reads 0.00, $0.00, Demand 0, Last Sale "—". |
| SV-11946 (B7) | **KEEP, EDIT** | Same deselected view: Demand still reads 5 for 3 work orders. Units Sold 6.00 is right. |
| SV-11947 (B8) | **KEEP, EDIT** | A fresh browser with All locations still shows Margin and Total Sell (12 columns, expected 10). The location switch in step 3 is not needed. |
| Side finding 2 | **NOT REPRODUCED** | Cancel Return works. "Yes" turns into a second button, "Are You Sure?", and that second click cancels the return (request returned 204, a green message appeared, the row was gone, and still gone after a reload). On 29 Oct the first worker clicked only "Yes". |

**No ticket comes out OBSOLETE.** For none of the eight did a filter, a date range, a location, the search box, a column or sort choice, or a remembered setting cause the "wrong" result.

## How the check was run

- **Rule 99.** Every run recorded the same zone in four places: the browser `timezoneId`, the process `TZ`, the session `change-location` and the app's `localStorage['timezone']`. DVI Test used America/Toronto; Staging Heavy Duty - 9919 used Asia/Karachi. The zones are in every `evidence/f2/screen/*.json`, in every `evidence/f2/server_*.json` meta, and in `evidence/f2/pictures/meta.json`.
- **Location trap (F4).** Every browser run set `localStorage['location']` to the intended workplace (same format as `reports/WORKER-BRIEF.md` line 27). The final pass also asserts the header location at the start and the end of each run.
  - All verdict-basis runs are from the **final pass, 09:35 to 09:50 UTC**, and all read VALID, with two exceptions:
    - `IV_DVI_PIC`: the end-of-run header read timed out. The picture itself shows "DVI Test" in the header.
    - `RET_PV_DESEL_after_return`: it ran before the assertion existed. Its picture shows "DVI Test", and its default step's chip reads "Location: DVI Test".
  - The first pass (09:11 to 09:26 UTC) had the key set but no assertion. **Everything in it was re-run** in the final pass, with the same figures.
- **Build.** The first pass ran on `v26.43.2-f8698cb`. **Staging moved to `v26.43.2-9272076` at about 09:27 UTC.** The diff f8698cb..9272076 changes no report or returns source: in the app only `noteAttachments` changed; in the API, dependencies and notes. All verdicts rest on the final pass on 9272076, and both builds gave identical figures.
- **Server data.** I used a private session, `/tmp/cln/f2/sess.txt` (mode 600). The files are `evidence/f2/server_DVI_*` and `server_HD_*`, each holding runs (i), (ii) and (iii) plus extra windows. The widest window the server accepts is 366 days ("Date range cannot exceed 366 days."). The screen's widest preset is **Last 12 months**: 1 Nov 2025 to 29 Oct 2026.
- **Remembered settings.** I read the code at f8698cb and confirmed it live.
  - **Parts Velocity** remembers per browser:
    - the date range, in `localStorage['report_range:parts-velocity']` (SV-11514);
    - the columns and the sort, in `report_table:parts-velocity`.
  - **Inventory Value** remembers the columns and the sort (`report_table:inventory-value`). Its "As of" is not remembered; it is always the location's today.
  - Location, Category, Vendor, Bin and Type live only in the URL. A new visit resets them to the active location and "All".
  - The search term is kept per browser-history entry (sessionStorage) and is cleared on a new visit.
  - Neither report saves anything to the account: no `users/me/preferences` call was made.
  - Live checks:
    - On Parts Velocity, I picked Last 12 months, then reloaded and also opened the report again from the menu. Both times it **opened on "Last 12 months"**, and Location went back to DVI Test.
    - On Inventory Value, I switched Margin off and opened the report again. **Margin stayed hidden.**
- **The ticket pictures had no hidden filter.**
  - The Phase-2 runs cleared every `report_*` / velocity / inventory key before shooting.
  - Their recorded chips and requests show the defaults: Last 90 days, sent as Jul 30 to Oct 28 on 28 Oct; Type All types; Category, Vendor and Bin "All"; Location = the active location; IV As of = today.
  - The only non-default control in any ticket picture is one the steps name: B4's "Last quarter", or a search term the steps type.
- **Vendor return (B2 and Side finding 2).** I created one and cancelled it through the screen, at DVI Test, slip "ZZAUTOTEST cancel check". It was created at 09:28 UTC (POST `part/manual-return-request/create` 201) and cancelled at 09:33 UTC (POST `.../541df176-9814-4450-a2c4-80f8f03179be/cancel` 204). Afterwards, server data shows ZZAUTOTEST-PV1-10282011 back to **On Hand 4, Units Returned 0** (`server_DVI_final_after_cancel_*.json`). No server-side cancel was needed. No other record was edited.

---

## SV-11940 (B1): "Last 90 days" covers 91 days

- **Controls:**
  - Date: the ticket leaves the default, Last 90 days.
  - Type: All types.
  - Category, Vendor, Bin: All.
  - Location: DVI Test, the active location by default.
  - Search: none.
  - Downloads: PDF and CSV.
- **Fresh defaults:** the same as above, with no remembered key.
- **Subject?**
  - Date: **YES**. It is the thing being tested.
  - Location: **NO**. But the download is the only place the dates are printed, and the export refuses All locations.
  - Type, Category, Vendor, Bin: **NO**. Already "All".
- **Three runs (29 Oct, Toronto):**
  - (i) Ticket's filters: the page sends `start_date=2026-07-31T04:00Z … end_date=2026-10-30T03:59Z`, which is Jul 31 to Oct 29. The CSV and PDF both read **"Date Range: Jul 31, 2026 - Oct 29, 2026"**: 1 + 31 + 30 + 29 = **91 days**.
  - (ii) Defaults: identical to (i).
  - (iii) All locations: the page still sends Jul 31 to Oct 29. The download is refused: server data returns HTTP 400 "This report is too large to export. Narrow the date range or filters, then try again." On screen the download never arrived (waited 120 s).
- **Expected-value check:** today and the 89 days before it is Aug 1 to Oct 29 = 31 + 30 + 29 = 90. The ticket's own example (28 Oct: Jul 30 to Oct 28) was worked for the same filter and is right.
- **Verdict: KEEP AS IS.**
- **Optional wording note (remembered date).** A reader who once picked another range in this browser will see the report open on that range.
  - Old: "4. Leave the date as it opens: **Date: Last 90 days**. Leave **Location: DVI Test**."
  - New: "4. Check the date reads **Date: Last 90 days**. If it shows another range, click it and choose **Last 90 days** (the report reopens on the last range picked in this browser). Leave **Location: DVI Test** (the download does not work for all locations at once)."
- **Evidence:** `screen/PV_DVI_*.json` (`dl_default_csv`), `screen/PV_DVI_DESEL_*.json` (all-locations request), `B1_export_server.json`.

## SV-11941 (B2): a return to the vendor counts in Units Returned

- **Controls:**
  - Date: Last 90 days.
  - Location: DVI Test.
  - Search: "ZZAUTOTEST-PV1".
  - Columns: Units Returned switched on.
  - Type, Category, Vendor, Bin: All.
- **Fresh defaults:** Last 90 days; Location DVI Test; Units Returned **off**.
- **Subject?**
  - Units Returned column: **YES**. Switching it on is needed to read it, and the ticket names that step.
  - Date: **NO**.
  - Location: **NO**.
  - Search: **NO**. It only finds the row.
- **Runs.** Server data and screen agree in every case:

| | Before the return (09:11) | After the return (09:28–09:29) | After the cancel (09:35–09:42) |
|---|---|---|---|
| (i) Last 90 days, DVI, search | 0 / On Hand 4 | **1.00** / 3.00 | 0.00 / 4.00 |
| (ii) Defaults, no search | 0 | **1** | 0 |
| (iii) All locations, 366 days / Last 12 months, no search, Part # sort | 0 | **1.00** | 0.00 |

- **Expected-value check:** Units Returned is 0 before the return in every window, including 366 days and all locations. So no customer return exists, and the expected 0.00 is right for any filter.
- **Verdict: KEEP, EDIT.** The ticket used three unneeded filters: Last 90 days, one location and search. The figures stay the same: Actual 0.00 + 1 (vendor return) = **1.00**; Expected **0.00**.
- **Exact changes:**
  - Step 10.
    - Old: "10. Click **Reports**, then in the left menu under **Parts**, click **Parts Velocity**. Leave **Date: Last 90 days** and **Location: DVI Test**."
    - New: "10. Click **Reports**, then in the left menu under **Parts**, click **Parts Velocity**. Click the **Date** filter and choose **Last 12 months**. Click the **Location** filter and click **Select all**, so it reads **Location: All locations**."
  - Step 12.
    - Old: "12. Click **Search** and type **ZZAUTOTEST-PV1**."
    - New: "12. Click the **Part #** column heading twice, so the arrow points down (Z to A). Scroll down to the row **ZZAUTOTEST-PV1-10282011** (about 100 rows down). You can instead type it in **Search**; the figures are the same."
  - Step 14.
    - Old: "14. Afterwards, go back to **Parts → Returns** and cancel the return (**⋮ → Cancel Return → Yes**)."
    - New: "14. Afterwards, go back to **Parts → Returns** and cancel the return: **⋮ → Cancel Return → Yes**. The button then changes to **Are You Sure?**; click it. The message "Manual return cancelled successfully" appears and the row goes."
  - Screenshot 2 caption.
    - Old: "**2.** Parts Velocity, Last 90 days, Units Returned switched on: the part reads 1.00."
    - New: "**2.** Parts Velocity, Last 12 months, all locations, nothing in Search, Units Returned switched on: the part reads 1.00."
  - Note for the QA lead. This is in the draft's header comment only (`phase2/P2-B2-*.md`), **not in the filed ticket text**.
    - Old: "On the screen, Parts > Returns > ⋮ > Cancel Return > Yes did nothing for this return on 29 Oct (the row stayed); it was cancelled from the server instead."
    - New: "Cancel Return needs two clicks: Yes, then Are You Sure? (re-checked 29 Oct, it works)."
- **Replacement picture:** `evidence/f2/pictures/SV-11941-B2-units-returned-no-filters.png`.

## SV-11942 (B3): Location column hidden when one location is picked

- **Controls:**
  - Location: DVI Test, one location.
  - Date: the default, Last 90 days. The ticket does not mention it.
  - Type, Category, Vendor, Bin: All.
  - No search.
- **Fresh defaults:** the same.
- **Subject?**
  - Location pick: **YES**.
  - Date: **NO**. Widened to Last 12 months.
  - The rest: **NO**. Already "All".
- **Runs:**
  - (i) and (ii), DVI Test, Last 90 days: **14 columns**, no Location. The columns button offers no Location entry.
  - Date widened to Last 12 months, DVI Test: the same, 14 columns, no Location.
  - (iii) All locations, Last 12 months: **15 columns**, Location included.
  - Inventory Value, DVI Test only: shows **Location**.
  - The code agrees: `showLocationColumn = selectedLocationIds.length > 1`.
- **Expected-value check:** Expected 15 columns = the 14 + Location. That is the count the screen gives once Location shows, for the same user (4 locations).
- **Verdict: KEEP AS IS.**

## SV-11943 (B4): Last Sale ignores a billed sale that moved no stock

- **Controls:**
  - Date: **Last quarter** (Jul 1 to Sep 30).
  - Location: Staging Heavy Duty - 9919.
  - Search: N000000001069.
  - Type, Category, Vendor, Bin: All.
- **Fresh defaults:** Last 90 days, HD.
- **Subject?**
  - Date: **NO**. Last Sale is all-time, whatever the window (PRD S5-R4).
  - Location: **NO**.
  - Search: **NO** for the figures. It is kept only to bring 1 part out of about 13,000 rows on screen. Server data with no search gives the same row.
- **Runs.** Willoughby row, Karachi time, 29 Oct; screen and server data agree:

| Run | Revenue | Units Sold | Demand | **Last Sale** |
|---|---|---|---|---|
| (i) Last quarter, HD | $1.38 | 0.00 | 0 | **161 days** |
| (ii) Defaults: Last 90 days, HD (Jul 31 to Oct 29, so 30 Jul is outside) | $0.00 | 0.00 | 0 | **161 days** |
| (iii) All locations, Last 12 months / 366 days, no search | $20.10 | 14.00 | 3 | **161 days** |
| All locations, Last quarter | $1.38 | 0.00 | 0 | **161 days** |

- **Expected-value check:** 30 Jul to 29 Oct = 1 + 31 + 30 + 29 = **91** days. That holds for any window and any location.
- **Verdict: KEEP, EDIT.**
- **Exact changes:**
  - Step 4.
    - Old: "4. Click the **Date** filter and choose **Last quarter** (1 Jul – 30 Sep 2026). From 1 January 2027, choose **Custom** and pick **Jul 1, 2026** to **Sep 30, 2026** instead."
    - New: "4. Click the **Date** filter and choose **Last 12 months**. Click the **Location** filter and click **Select all**, so it reads **Location: All locations**."
  - Step 5.
    - Old: "5. Click **Search** and type **N000000001069**."
    - New: "5. Click **Search** and type **N000000001069**. This only brings the part on screen; it does not change its figures."
  - Step 7.
    - Old: "7. Read **Revenue** and **Last Sale** on that row."
    - New: "7. Read **Last Sale** on that row."
  - Actual.
    - Old: "**Actual:** Revenue **$1.38** (the sale on S2-16621), but Last Sale **161 days** (21 May 2026). It goes up by 1 each day."
    - New: "**Actual:** Last Sale **161 days** on 29 Oct 2026, which points back to 21 May 2026, although the part was billed on S2-16621 on 30 Jul 2026. It goes up by 1 each day."
  - Example.
    - Old: "The same row even shows **Revenue $1.38** for Jul–Sep, so the report knows about the sale but leaves it out of Last Sale."
    - New: "The report knows about this sale: with **Date: Last quarter** (1 Jul – 30 Sep 2026) the same row shows **Revenue $1.38**, the S2-16621 sale, and nothing else. But it leaves the sale out of Last Sale."
    - This keeps "Last quarter" only as a supporting fact. Drop the sentence if no filter at all is wanted.
  - Screenshot 1 caption.
    - Old: "**1.** Parts Velocity at Staging Heavy Duty - 9919, Last quarter, N000000001069: Revenue $1.38, Last Sale 161 days."
    - New: "**1.** Parts Velocity, Last 12 months, all locations, N000000001069: Last Sale 161 days."
  - Expected: unchanged, **91 days** on 29 Oct 2026.
- **Replacement picture:** `evidence/f2/pictures/SV-11943-B4-last-sale-no-filters.png`.

## SV-11944 (B5): Inventory Value heading "Qty" should be "On Hand"

- **Controls:**
  - As of: today, the default. The report cannot run without it.
  - Location: DVI Test, the default.
  - Category, Vendor: All.
  - No search.
  - Downloads: PDF and CSV.
- **Fresh defaults:** the same, with all 11 toggleable columns on.
- **Subject?**
  - Column heading: **YES**.
  - Location: **NO**.
  - As of: required, so it stays at the default.
- **Runs:**
  - (i) and (ii), DVI: heading **Qty** on screen, in the CSV (`…,Location,Qty,"Unit Cost",…`) and in the PDF ("… Vendor Location Qty Unit Cost …").
  - (iii) All locations:
    - Screen: heading **Qty**.
    - CSV: `"Locations: All locations"`, then `…,Location,Qty,…`.
    - PDF: did not download. Server data returns **HTTP 500** after 60 s ("An error occurred…", requestId 9d0110fb-d908-4ad8-bbb8-b8ec674615da).
  - Server data: the quantity field is `qty`; ZZAUTOTEST-PV1-10282011 reads 4 for both DVI and all locations.
- **Expected-value check:** a heading only. The example 4.00 is the same in every run.
- **Verdict: KEEP, EDIT.**
- **Exact changes:**
  - Step 2.
    - Old: "2. At the top right, switch the location to **DVI Test**."
    - New: "2. (Any location.)" Or drop the step.
  - New step after step 3: "3a. Click the **Location** filter and click **Select all**, so it reads **Location: All locations**."
  - Step 5.
    - Old: "5. At the top right of the report, click **⋯** and choose **Download (PDF)**. Read the same heading in the file."
    - New: "5. Click **⋯** and choose **Download (CSV)**. Read the same heading in the first row of column names."
  - Step 6.
    - Old: "6. Click **⋯** again and choose **Download (CSV)**. Read the same heading in the first row of column names."
    - New: "6. For the PDF, click the **Location** filter and pick only **DVI Test** (the PDF of all locations at once did not download on 29 Oct). Then click **⋯** → **Download (PDF)** and read the same heading."
  - Example.
    - Old: "For example, part ZZAUTOTEST-PV1-10282011 at DVI Test shows **4.00** in stock:"
    - New: "For example, part ZZAUTOTEST-PV1-10282011 (location DVI Test) shows **4.00** in stock:"
  - Screenshot 1 caption.
    - Old: "**1.** Inventory Value at DVI Test: the quantity column is headed "Qty"."
    - New: "**1.** Inventory Value, all locations, As of today: the quantity column is headed "Qty"."
- **Replacement picture:** `evidence/f2/pictures/SV-11944-B5-qty-heading-no-filters.png`.

## SV-11945 (B6): a "Receive later" special-order part shows as never sold

- **Controls:**
  - Date: Last 90 days.
  - Location: DVI Test.
  - Search: ZZAUTOTEST.
  - Type: All types (both).
  - Category, Vendor, Bin: All.
- **Fresh defaults:** Last 90 days, DVI.
- **Subject?** Every filter: **NO**. The Type filter is already "All types".
- **Runs.** ZZAUTOTEST-SO1-10282011; screen and server data agree:
  - (i) Ticket's filters: Units Sold **0.00**, Revenue **$0.00**, Demand **0**, Last Sale **—**.
  - (ii) Defaults, no search: the same.
  - (iii) All locations, Last 12 months / 366 days, no search, Part # sorted Z to A (row 95): the same.
  - Comparison part ZZAUTOTEST-SO2-10282011: 1.00, $80.00, Demand 1 in all three runs.
- **Expected-value check:** both sales (S1-38203, S1-38206) are on 28 Oct 2026, inside every window used. So the expected figures hold for any of these filters: Units Sold **2.00**, Revenue $60.00 + $68.96 = **$128.96**, Demand **2**.
- **Verdict: KEEP, EDIT.**
- **Exact changes:**
  - Step 14.
    - Old: "14. Click **Reports**, then in the left menu under **Parts**, click **Parts Velocity**. Leave **Date: Last 90 days** and **Location: DVI Test**."
    - New: "14. Click **Reports**, then in the left menu under **Parts**, click **Parts Velocity**. Click the **Date** filter and choose **Last 12 months**. Click the **Location** filter and click **Select all**, so it reads **Location: All locations**."
  - Step 15.
    - Old: "15. Click **Search** and type **ZZAUTOTEST**."
    - New: "15. Click the **Part #** column heading twice, so the arrow points down (Z to A), and scroll down to the ZZAUTOTEST rows (about 95 rows down). You can instead type **ZZAUTOTEST-SO1** in **Search**; the figures are the same."
  - Sub-bullet under step 16.
    - Old: "From 20 January 2027, pick **Custom** and choose a range that includes **Oct 28, 2026** instead."
    - New: "From 1 October 2027, pick **Custom** and choose a range that includes **Oct 28, 2026** instead."
  - Screenshot 2 caption.
    - Old: "**2.** Parts Velocity at DVI Test, Last 90 days: the same part reads 0.00 sold, $0.00, Demand 0, Last Sale "—"."
    - New: "**2.** Parts Velocity, Last 12 months, all locations, nothing in Search: the same part reads 0.00 sold, $0.00, Demand 0, Last Sale "—"."
  - Actual and Expected: unchanged.
- **Replacement picture:** `evidence/f2/pictures/SV-11945-B6-receive-later-no-filters.png`.

## SV-11946 (B7): Demand counts a reversed-and-re-invoiced work order twice

- **Controls:** Date Last 90 days; Location DVI Test; Search ZZAUTOTEST-PV1; the rest "All".
- **Subject?** Every filter: **NO**.
- **Runs.** ZZAUTOTEST-PV1-10282011; screen and server data agree: (i), (ii) and (iii) (All locations, Last 12 months / 366 days, no search, Part # sort, row 96) all read **Demand 5**, Units Sold 6.00, Revenue $180.00.
- **Expected-value check:** the 3 work orders (S1-38203, S1-38204, S1-38206) are all dated 28 Oct, inside every window used. Expected **3**; Actual 3 + 2 re-invoices = **5**.
- **Verdict: KEEP, EDIT.**
- **Exact changes:**
  - Step 3.
    - Old: "3. Click **Reports**, then in the left menu under **Parts**, click **Parts Velocity** (**Date: Last 90 days**, **Location: DVI Test**)."
    - New: "3. Click **Reports**, then in the left menu under **Parts**, click **Parts Velocity**. Click the **Date** filter and choose **Last 12 months**. Click the **Location** filter and click **Select all**."
  - Step 4.
    - Old: "4. Click **Search**, type **ZZAUTOTEST-PV1** and note the **Demand** of **ZZAUTOTEST-PV1-10282011**."
    - New: "4. Click the **Part #** column heading twice (arrow pointing down) and scroll down to **ZZAUTOTEST-PV1-10282011** (about 100 rows down); or type it in **Search**, which gives the same figures. Note its **Demand**."
  - Steps 12 and 15.
    - Old: "Open **Parts Velocity** again."
    - New: "Open **Parts Velocity** again (it reopens on Last 12 months). Click the **Location** filter and click **Select all** again."
  - Sub-bullet under step 15.
    - Old: "From 20 January 2027, pick **Custom** and choose a range that includes **Oct 28, 2026** instead of Last 90 days."
    - New: "From 1 October 2027, pick **Custom** and choose a range that includes **Oct 28, 2026** instead of Last 12 months."
  - Screenshot 1 caption.
    - Old: "**1.** Parts Velocity at DVI Test, Last 90 days: ZZAUTOTEST-PV1-10282011 reads Demand 5 for 3 work orders; Units Sold 6.00 is right."
    - New: "**1.** Parts Velocity, Last 12 months, all locations, nothing in Search: ZZAUTOTEST-PV1-10282011 reads Demand 5 for 3 work orders; Units Sold 6.00 is right."
- **Replacement picture:** `evidence/f2/pictures/SV-11946-B7-demand-no-filters.png`.

## SV-11947 (B8): Margin and Total Sell shown on the first visit

- **Controls:**
  - First visit in a fresh browser.
  - As of: today (default).
  - Location: DVI Test (via the top-right switch).
  - Category, Vendor: All.
- **Fresh defaults:**
  - All 11 toggleable columns are on: Part #, Description, Category, Vendor, Location, Qty, Unit Cost, Unit Sell, **Margin**, Margin %, **Total Sell**.
  - Plus Total Cost, which is always shown.
  - Total: **12 columns**.
  - The view is stored at once in `report_table:inventory-value`.
- **Subject?**
  - "First visit / no saved view": **YES**.
  - Location: **NO**.
  - As of: required, so it stays at the default.
- **Runs:**
  - (i) and (ii), DVI: 12 columns, including Margin and Total Sell.
  - (iii) Fresh browser, then All locations: the same 12 columns.
  - Remembered view: after Margin was switched off, a new visit showed 11 columns. So the ticket's "fresh / private window" step is what makes it reproducible.
  - The code agrees: `IV_DEFAULT_VISIBLE_COLUMNS` = every selectable column.
- **Expected-value check:** 12 − 2 = **10** columns: Part #, Description, Category, Vendor, Location, On Hand, Unit Cost, Unit Sell, Margin %, Total Cost.
- **Verdict: KEEP, EDIT** (minor).
- **Exact changes:**
  - Step 3.
    - Old: "3. At the top right, switch the location to **DVI Test**."
    - New: "3. Click **Reports** (any location)."
  - New step after step 4: "4a. Click the **Location** filter and click **Select all**. This does not change which columns are shown."
  - Example.
    - Old: "For example, at DVI Test the first visit shows:"
    - New: "For example, the first visit shows:"
  - Screenshot 1 caption.
    - Old: "**1.** Inventory Value opened for the first time in a fresh browser at DVI Test: Margin and Total Sell are shown."
    - New: "**1.** Inventory Value opened for the first time in a fresh browser, all locations: Margin and Total Sell are shown."
- **Replacement picture:** `evidence/f2/pictures/SV-11947-B8-first-visit-columns-no-filters.png`.

---

## Side finding 2: Parts → Returns, "⋮ → Cancel Return → Yes" did nothing

**Verdict: NOT REPRODUCED.** Cancel Return works, but it takes two clicks.

All zones were on America/Toronto, recorded in `side2/*_meta.json`. Header "DVI Test" at the start and the end of both cancel runs (VALID). Build 9272076.

1. **Created through the screen** at 09:28 UTC, following SV-11941 steps 3 to 9:
   - vendor 123 Cannabis Forestlawn;
   - slip "ZZAUTOTEST cancel check";
   - part ZZAUTOTEST-PV1-10282011 ("Inventory Qty: 4 EA"), Qty 1.
   - Request: POST `part/manual-return-request/create`, **201**. The row was listed as "Manual Return … 1.00 $20.00 … Manual Today ZZAUTOTEST cancel check".
2. **Cancel, first try** (09:30 UTC): ⋮ → Cancel Return. A **Warning!** window opened: "This will permanently delete the return. You cannot undo this action. Are you sure you want to delete this return?", with No and Yes. I clicked **Yes**.
   - **No request was sent**, no message appeared and the row stayed.
   - The window **stayed open**, and the Yes button turned orange and now read **"Are You Sure?"** (`side2/1-after-first-Yes-button-becomes-Are-You-Sure.png`).
   - Earlier, the Phase-2 worker's script closed the window at this point, which is why it looked as if nothing happened.
3. **Second try** (09:33 UTC): Yes, then **Are You Sure?**.
   - POST `part/manual-return-request/541df176-…/cancel` returned **204**.
   - A green message read **"Manual return cancelled successfully"**.
   - The row was gone (`side2/2-after-Are-You-Sure-cancelled.png`).
4. **After a reload,** the row was still gone (`side2/3-after-reload-row-gone.png`). Server data shows On Hand 4 and Units Returned 0 again. **No server-side cancel was needed.**

- The two-click confirm is in the shipped code at f8698cb, the build on which the Phase-2 worker saw it: `PartReturnRemoveWarningDialog.vue`, label `isConfirmClickedFirstTime ? 'Are you sure?' : 'Yes'`. That code was read for fact only, not used as an expectation.
- **SV-11941's last step needs the wording note** given in the B2 block above (step 14: "… → Yes, then click **Are You Sure?**").
- **Playbook line for the coordinator** (Rule 93), searchable on the exact text "Cancel Return → Yes did nothing": *Parts → Returns → ⋮ → Cancel Return: "Yes" turns into "Are You Sure?" and needs a second click; only the second click sends POST part/manual-return-request/{id}/cancel (204).*

---

## Noticed along the way (not drafted, not part of any verdict)

1. **Inventory Value PDF of all locations returns HTTP 500** after 60 s ("An error occurred. We're sorry for this inconvenience…", requestId 9d0110fb-d908-4ad8-bbb8-b8ec674615da). The CSV of the same view works (1.5 MB). Parts Velocity, by contrast, refuses the same kind of request politely (400 "This report is too large to export…").
2. **Possible off-by-one in Last Sale.**
   - On 29 Oct at 05:11 Toronto, ZZAUTOTEST-PV1 and SO2 read **Last Sale 0 days**.
   - Their sales were made on the evening of 28 Oct, Toronto time, which is already 29 Oct in UTC.
   - If Last Sale counts days in UTC, it would read 1 day in Toronto.
   - Not checked against the invoice timestamps; flagged for the coordinator only.

## Files

- **Tools** (`filter-recheck/tools/f2/`):
  - `mint_f2.mjs`: private session.
  - `common_f2.py`.
  - `server_f2.py`: three-way server runs.
  - `rank_f2.py`: sort position.
  - `b1_export.py`.
  - `iv_pdf_all.py`.
  - `cancel_return_server.py`: prepared, **not used**.
  - `ev_f2.mjs`: all screen modes, with the location and zone assertions.
  - `final_pass.sh`.
  - `summ_screen.py`.
  - `pdf_top.py`.
- **Evidence** (`filter-recheck/evidence/f2/`):
  - `server_*.json`.
  - `screen/*.json`: 24 runs, each with zones, chips, headers, rows, storage, requests and VALID.
  - `B1_export_server.json`.
  - `B5_iv_export_all_locations_server.json`.
  - `pictures/` (6 annotated pictures + `meta.json`), all looked at.
  - `side2/`.
- No Jira, TestRail or Google writes. Nothing committed or staged.
