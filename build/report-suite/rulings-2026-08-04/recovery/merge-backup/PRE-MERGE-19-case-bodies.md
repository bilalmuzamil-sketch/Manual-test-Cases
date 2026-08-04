# PRE-MERGE snapshot — full bodies of all 19 cases in the merge/cut plan

Captured 2026-08-04 immediately before the authorised consolidation, so every deleted
case body survives in git even though the TestRail case does not.


---

## MG-IV-SNAPSHOT-RERUN — ABSORBED (to be deleted) — C30608

**Title:** Nightly snapshot: a re-run records today's truth; it cannot rebuild a past day

**Section:** 4376 · **Type:** 6 · **Priority:** 2

**refs:** `SV-8678 (IV spec v3 2026-07-29 Story 11 S11-R5; Story 5 S5-E1)`

**Preconditions:**
```
1. The date the first capture ran is known.
2. Stock levels have changed since a past captured date.
3. To see the information this test asks for you need the browser's own developer tools: press F12 (or Ctrl+Shift+I; on a Mac Cmd+Option+I) and open the "Network" tab, then reload the page. There is nothing to install — it is built into Chrome, Edge and Firefox. Where a check also asks you to confirm what is stored on the server, ask a developer to read it back for you — that part cannot be seen from the browser.
```

**Steps:**
```
1. Check the stored history for any rows dated before the first capture.
2. Re-run the capture and check which date its rows are recorded under.
3. Compare a past date's stored rows to confirm they were not rewritten by the re-run.
```

**Expected Results:**
```
1. No rows exist for dates before capture began — there is no backfill.
2. A re-run always records current truth under the CURRENT date; it cannot reconstruct a past date.
3. Past dates' stored rows are unchanged by a current re-run.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Inventory Value report specification version 3 (S11-R5, S5-E1).
```


---

## MG-IV-SNAPSHOT-RERUN — SURVIVOR (kept) — C30607

**Title:** Nightly snapshot: re-running the capture for a date replaces that date's rows

**Section:** 4376 · **Type:** 6 · **Priority:** 3

**refs:** `SV-8678 (IV spec v3 2026-07-29 Story 11 S11-R3)`

**Preconditions:**
```
1. A capture has already run for the current date.
2. The capture can be re-run for that date (arrange with the developers).
3. To see the information this test asks for you need the browser's own developer tools: press F12 (or Ctrl+Shift+I; on a Mac Cmd+Option+I) and open the "Network" tab, then reload the page. There is nothing to install — it is built into Chrome, Edge and Firefox. Where a check also asks you to confirm what is stored on the server, ask a developer to read it back for you — that part cannot be seen from the browser.
```

**Steps:**
```
1. Count the stored rows per location for the date.
2. Re-run the capture for the same date.
3. Count and inspect the rows again.
```

**Expected Results:**
```
1. Re-running the capture for a date replaces that date's rows for each location — the existing rows for that location and date are removed, then re-inserted from current data.
2. No duplicate rows exist for the same part, location, and date.
3. The capture is idempotent and self-healing from current data.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Inventory Value report specification version 3 (S11-R3).
```


---

## MG-IV-TOTALS-POSITION — ABSORBED (to be deleted) — C30586

**Title:** Sorting reorders only the data rows — the totals row stays at the bottom

**Section:** 4372 · **Type:** 6 · **Priority:** 2

**refs:** `SV-8676 (IV spec v3 2026-07-29 Story 9 S9-R4; S9-R5)`

**Preconditions:**
```
1. You are signed in to the ShopView App on a desktop browser.
2. The Inventory Value report is open with rows and a totals row.
```

**Steps:**
```
1. Sort by any column and watch the totals row's position.
2. Sort by a non-default column, leave the report, and return.
```

**Expected Results:**
```
1. Sorting reorders the data rows only; the totals row stays at the bottom.
2. On return, the report restores the chosen sort (remembered per browser, Story 8).
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Inventory Value report specification version 3 (S9-R4, S9-R5).
```


---

## MG-IV-TOTALS-POSITION — SURVIVOR (kept) — C30556

**Title:** Totals row: Total label, blank identity/per-unit cells, pinned bold Total Cost

**Section:** 4367 · **Type:** 6 · **Priority:** 3

**refs:** `SV-8671 (IV spec v3 2026-07-29 Story 4 S4-R1; S4-R4; S4-R5; S4-R6; S4-R7; Story 12 S12-R5)`

**Preconditions:**
```
1. You are signed in to the ShopView App on a desktop browser.
2. The Inventory Value report is open with rows loaded and all columns turned on.
3. The page shows more rows than fit on the screen.
```

**Steps:**
```
1. Look at the row at the bottom of the report.
2. Read its Part # cell, its Description/Category/Vendor cells, and its Unit Cost/Unit Sell cells.
3. Look at its Total Cost cell and compare the number formats to the data rows.
4. Scroll the rows up and down and watch the totals row.
```

**Expected Results:**
```
1. A totals row is shown at the bottom, with the label "Total" in the Part # column's cell. In the downloaded files the same row is labelled "Totals" — that difference is intended.
2. The Description, Category, and Vendor cells are blank; the Unit Cost and Unit Sell cells are blank (a per-unit price has no meaningful sum).
3. The totals-row Total Cost cell is pinned far right and bold, matching the column, and the row uses the same number formats as the data rows.
4. The totals row stays visible at the bottom while the rows scroll.
5. Note for the tester: if the label on screen reads "Totals" instead of "Total", mark this test Failed and report it — do not change the test.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Inventory Value report specification version 3 (S4-R1, S4-R4, S4-R5, S4-R6, S4-R7, S12-R5).
```


---

## MG-PV-REVERSAL — ABSORBED (to be deleted) — C30350

**Title:** A sale invoiced then fully reversed shows Demand 1 with Units Sold 0.00

**Section:** 4332 · **Type:** 6 · **Priority:** 2

**refs:** `SV-8643 (PV spec v4 2026-07-29 S3-E1; S5-R5)`

**Preconditions:**
```
1. Inventory part C: one sale invoiced AND fully reversed inside the window, and the part still has on-hand stock (so it stays in the result set).
2. Inventory part D: reversals exceed sales in the window (net-negative movement), with on-hand stock or other billed revenue keeping it in the result set.
```

**Steps:**
```
1. Find part C and read its Demand and Units Sold.
2. Find part D and read its Units Sold.
```

**Expected Results:**
```
1. Part C shows Demand 1 (the reversal does not decrement the Demand count) with Units Sold 0.00 (the reversal nets the movement to zero).
2. Part D shows a NEGATIVE Units Sold with a leading minus (e.g. -3.00) - negative movement is not floored to zero.
3. A fully-reversed part with zero net movement, no on-hand stock, and no residual revenue would be excluded altogether (a Demand count alone does not keep a row).
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Parts Velocity report specification version 4 (S3-E1, S5-R5).
```


---

## MG-PV-REVERSAL — SURVIVOR (kept) — C30364

**Title:** Demand counts each transaction once; a reversal neither adds nor subtracts

**Section:** 4334 · **Type:** 6 · **Priority:** 4

**refs:** `SV-8645 (PV spec v4 2026-07-29 S5-R4 (Demand); §4; §3 Key Decisions)`

**Preconditions:**
```
1. An inventory part sold in the window on two invoiced work orders - one for 1 unit, one for 10 units.
2. A special-order part with two in-window vendor requests.
3. One of the inventory part's in-window sales is then reversed/voided.
```

**Steps:**
```
1. Read the inventory part's Demand before the reversal.
2. Reverse/void one of its invoices and re-read Demand.
3. Read the special-order part's Demand.
```

**Expected Results:**
```
1. The inventory part's Demand is 2 - each stock-decrementing invoicing event counts ONCE no matter how many units were on it (1 unit and 10 units each count as one).
2. After the reversal, Demand is STILL 2 - a reversal event neither adds to nor subtracts from the count (while Units Sold nets down).
3. The special-order part's Demand is 2 - the count of its in-window vendor part requests.
4. Demand is the report's default ranking signal (a whole number, never null - 0 when none).
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Parts Velocity report specification version 4 (S5-R4).
```


---

## MG-SBC-EMPTY-LOADING — ABSORBED (to be deleted) — C30182

**Title:** The empty-state message never appears while the table is still loading

**Section:** 4302 · **Type:** 5 · **Priority:** 2

**refs:** `SV-8615 (SBC spec v13 2026-07-31 Story 17 S17-N1)`

**Preconditions:**
```
1. You are on the report; a slow network helps (throttle via browser dev tools if needed).
2. To force the failure this test needs, use the browser's own developer tools: press F12, open the "Network" tab, and switch the throttling dropdown (it normally reads "No throttling") to "Offline" to cut the connection, or to "Slow 3G" to slow it down. There is nothing to install. Set it back to "No throttling" when you finish.
```

**Steps:**
```
1. Change a filter and watch the table area during the load.
2. Watch what appears once loading finishes with zero customers.
```

**Expected Results:**
```
1. While the table is loading, the empty-state message is NOT shown (the loading state is shown instead).
2. The message appears only after the table finishes its initial loading and shows zero customers.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Sales By Customer report specification version 13 (S17-N1).
```


---

## MG-SBC-EMPTY-LOADING — SURVIVOR (kept) — C30181

**Title:** Empty state shows in the table body; toolbar interactive; kept selection returns

**Section:** 4302 · **Type:** 6 · **Priority:** 3

**refs:** `SV-8615 (SBC spec v13 2026-07-31 Story 17 S17-R1; S17-R2; S17-R3; S17-E1; Story 2 S2-N1; Story 3 S3-N1; Story 4 S4-N2; Story 8 S8-N1)`

**Preconditions:**
```
1. You are on the report with data on screen.
```

**Steps:**
```
1. Set a date range that contains no invoices (for example a Custom range over a quiet week far back).
2. Read the table body and try each toolbar control.
3. Also provoke the empty state via Product Type and via a location with no data, and re-check.
4. Look at the table header row's chevron.
5. Narrow the Customer filter to specific customers, change the date range so none of them have data, read the table and the filter, then change the range back.
```

**Expected Results:**
```
1. The table body shows the message "No sales data found for the selected filters." where customer rows would appear — not in the toolbar, the totals row, or a modal.
2. The toolbar stays visible and interactive (all filters including the Customer filter, and the action controls), so you can adjust filters without leaving the page.
3. The same empty state appears whichever filter caused it (date range, Product Type, or location).
4. The header-row chevron is hidden when the table has no visible rows.
5. With a narrowed customer selection and no data, the empty state shows but the selection is KEPT (not cleared) — when the filters change back, the selected customers reappear.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Sales By Customer report specification version 13 (S17-R1, S17-R2, S17-R3, S17-E1, S2-N1, S3-N1, S4-N2, S8-N1).
```


---

## MG-TU-LOC-FALLBACK — ABSORBED (to be deleted) — C30445

**Title:** Deselecting every location falls back to the active location

**Section:** 4347 · **Type:** 5 · **Priority:** 2

**refs:** `SV-8656 (TU spec v5 2026-07-29 S9-R7)`

**Preconditions:**
```
1. You are on the Technician Utilization report with at least one location selected.
```

**Steps:**
```
1. In the Location filter, deselect every location (empty the filter).
2. Watch what the report loads.
```

**Expected Results:**
```
1. The report falls back to the user's currently active location rather than showing nothing.
2. Rows for the active location load normally.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Technician Utilization report specification version 5 (S9-R7).
```


---

## MG-TU-LOC-FALLBACK — SURVIVOR (kept) — C30444

**Title:** The saved location selection restores defensively; bad ones are dropped

**Section:** 4347 · **Type:** 5 · **Priority:** 2

**refs:** `SV-8656 (TU spec v5 2026-07-29 S9-R6; S1-R8; S9-R2)`

**Preconditions:**
```
1. The user saved a location selection that includes a location their access to was later removed.
```

**Steps:**
```
1. Return to the Technician Utilization report and read the restored location selection.
2. Repeat with a saved selection consisting ONLY of now-inaccessible locations.
```

**Expected Results:**
```
1. Any saved location the user can no longer access is DROPPED from the restored selection; the remaining accessible locations restore normally.
2. If the remaining set is empty, the report falls back to the user's currently active location (the first-visit default).
3. The report loads without an error in both cases.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Technician Utilization report specification version 5 (S9-R6, S1-R8, S9-R2).
```


---

## MG-WIP-SNAPSHOT-SHAPE — ABSORBED (to be deleted) — C30529

**Title:** Each snapshot row captures the WO; status; money; location and the date

**Section:** 4363 · **Type:** 6 · **Priority:** 3

**refs:** `SV-8667 (WIP spec v6 2026-07-29 Story 11 S11-R2)`

**Preconditions:**
```
1. At least one open work order with known status, location, and organization existed when the nightly capture ran.
2. You can inspect that date's stored snapshot rows.
3. To see the information this test asks for you need the browser's own developer tools: press F12 (or Ctrl+Shift+I; on a Mac Cmd+Option+I) and open the "Network" tab, then reload the page. There is nothing to install — it is built into Chrome, Edge and Firefox. Where a check also asks you to confirm what is stored on the server, ask a developer to read it back for you — that part cannot be seen from the browser.
```

**Steps:**
```
1. Find the seeded work order's snapshot row for the capture date.
2. Read each captured field and compare to the work order.
```

**Expected Results:**
```
1. The snapshot row captures, at minimum: the work order, its status, its Earned value, its Remaining value, the location and organization (copied from the work order), and the snapshot's calendar date.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Work In Progress report specification version 6 (S11-R2).
```


---

## MG-WIP-SNAPSHOT-SHAPE — SURVIVOR (kept) — C30528

**Title:** Nightly snapshot records one row per then-open job per calendar date

**Section:** 4363 · **Type:** 6 · **Priority:** 3

**refs:** `SV-8667 (WIP spec v6 2026-07-29 Story 11 S11-R1; tech-plan-2026-07-29 B1.2 (idempotent re-run — WIP spec Story 11 is silent on re-runs))`

**Preconditions:**
```
1. Open work orders exist across the organization on the capture date.
2. You can inspect the stored snapshot rows after the nightly capture runs (arrange the verification route with the developers).
3. To see the information this test asks for you need the browser's own developer tools: press F12 (or Ctrl+Shift+I; on a Mac Cmd+Option+I) and open the "Network" tab, then reload the page. There is nothing to install — it is built into Chrome, Edge and Firefox. Where a check also asks you to confirm what is stored on the server, ask a developer to read it back for you — that part cannot be seen from the browser.
```

**Steps:**
```
1. Note the set of open work orders before the nightly capture runs.
2. After the capture, inspect the stored snapshot rows for that calendar date.
3. Let the capture run again the next day and inspect again.
4. If a manual re-run of the capture is available, re-run it for the same date and inspect that date's rows again.
```

**Expected Results:**
```
1. Once per day the system records one row per then-open work order — one row per work order per calendar date.
2. The next day's capture adds a new row per open work order under the new date; a work order open on both days has one row for each date, never two rows for the same date.
3. Re-running the capture for the SAME date replaces that date's rows — the day's existing rows are removed and re-recorded from current data, never duplicated.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Work In Progress report specification version 6 (S11-R1).
```


---

## MG-WIP-SNAPSHOT-PRECISION — ABSORBED (to be deleted) — C30532

**Title:** Nightly snapshot: captured dollar values are stored to the cent

**Section:** 4363 · **Type:** 6 · **Priority:** 2

**refs:** `SV-8667 (WIP spec v6 2026-07-29 Story 11 S11-R5)`

**Preconditions:**
```
1. An open work order whose Earned/Remaining include non-round cent values (for example $123.45) existed at capture time.
2. You can inspect the stored snapshot rows.
3. To see the information this test asks for you need the browser's own developer tools: press F12 (or Ctrl+Shift+I; on a Mac Cmd+Option+I) and open the "Network" tab, then reload the page. There is nothing to install — it is built into Chrome, Edge and Firefox. Where a check also asks you to confirm what is stored on the server, ask a developer to read it back for you — that part cannot be seen from the browser.
```

**Steps:**
```
1. Read the captured Earned and Remaining values for the work order.
2. Compare their precision to the on-screen values.
```

**Expected Results:**
```
1. Captured dollar values are stored to the cent — no rounding to whole dollars and no lost cents.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Work In Progress report specification version 6 (S11-R5).
```


---

## MG-WIP-SNAPSHOT-PRECISION — SURVIVOR (kept) — C30530

**Title:** Captured Earned and Remaining use the same maths as the on-screen report

**Section:** 4363 · **Type:** 6 · **Priority:** 4

**refs:** `SV-8667 (WIP spec v6 2026-07-29 Story 11 S11-R3)`

**Preconditions:**
```
1. An open ZZAUTOTEST work order with known approved labor (partly clocked) and approved parts (partly received) exists and is left UNCHANGED across the capture.
2. You can read the on-screen report on the capture date and the stored snapshot row afterward.
3. To see the information this test asks for you need the browser's own developer tools: press F12 (or Ctrl+Shift+I; on a Mac Cmd+Option+I) and open the "Network" tab, then reload the page. There is nothing to install — it is built into Chrome, Edge and Firefox. Where a check also asks you to confirm what is stored on the server, ask a developer to read it back for you — that part cannot be seen from the browser.
```

**Steps:**
```
1. On the capture date, note the work order's Earned and Remaining on the Work In Progress report.
2. After the nightly capture, read the same work order's captured Earned and Remaining in the snapshot row.
3. Compare the pairs.
```

**Expected Results:**
```
1. The captured Earned equals the on-screen Earned and the captured Remaining equals the on-screen Remaining, to the cent — the snapshot uses the identical computation for both figures, so the two can never diverge for a given work order on the capture date.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Work In Progress report specification version 6 (S11-R3).
```


---

## MG-WIP-TAB-COUNTS — ABSORBED (to be deleted) — C30453

**Title:** Each tab label shows its work-order count in parentheses

**Section:** 4350 · **Type:** 6 · **Priority:** 3

**refs:** `SV-8657 (WIP spec v6 2026-07-29 Story 1 S1-R4; Story 2 S2-N2 (count portion))`

**Preconditions:**
```
1. You are signed in to the ShopView App on a desktop browser.
2. Open work orders exist in at least one tab for the current date range and location (seed ZZAUTOTEST work orders if needed).
3. At least one tab currently has no work orders.
```

**Steps:**
```
1. Open the Work In Progress report.
2. Read each tab's label.
3. Count the rows shown in each tab and compare to that tab's label.
```

**Expected Results:**
```
1. Each tab's label shows the count of work orders currently in that tab, in parentheses — for example, "Completed (22)".
2. The count matches the number of work-order rows actually listed in that tab.
3. A tab with no work orders shows "(0)".
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Work In Progress report specification version 6 (S1-R4, S2-N2).
```


---

## MG-WIP-TAB-COUNTS — SURVIVOR (kept) — C30452

**Title:** Four tabs in a fixed order with the partially-completed tab selected

**Section:** 4350 · **Type:** 6 · **Priority:** 4

**refs:** `SV-8657 (WIP spec v6 2026-07-29 Story 1 S1-R2; S1-R3; §3 Key Decisions (no on-screen status filter) — S1-R2 CLOSES the four tab labels and their order verbatim; so the closed list IS the requirement)`

**Preconditions:**
```
1. You are signed in to the ShopView App on a desktop browser.
2. You have not visited the report before in this browser (no saved active-tab setting).
```

**Steps:**
```
1. Open the Work In Progress report.
2. Read the tab labels from left to right.
3. Look at which tab is selected when the report loads.
```

**Expected Results:**
```
1. Four tabs are shown, labeled in this order: "Approved - Partially Completed", "Approved - Not Started", "Completed", and "Estimates" - each followed by its count in brackets, for example "Completed (30)".
2. The "Approved - Partially Completed" tab is selected by default on load.
3. There is NO on-screen status filter — the four tabs take the place of a status filter (the tab a job lands in is derived from its status and whether any work has started).
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Work In Progress report specification version 6 (S1-R2, S1-R3).
```


---

## MG-WIP-TOTAL-PINNED — ABSORBED (to be deleted) — C30521

**Title:** The Total column is bold and stays pinned right on sideways scroll

**Section:** 4361 · **Type:** 6 · **Priority:** 3

**refs:** `SV-8660 (WIP spec v6 2026-07-29 Story 4 S4-R22; Story 10 S10-R3)`

**Preconditions:**
```
1. You are signed in to the ShopView App on a desktop browser.
2. Enough columns are turned on that the table scrolls horizontally.
```

**Steps:**
```
1. Look at the Total column header and its cells.
2. Scroll the rows sideways and watch the Total column.
```

**Expected Results:**
```
1. The Total column header is bold and pinned to the far right, matching its cells.
2. The Total column (header and cells, shown in bold) stays fixed to the right edge while the rest of the columns scroll underneath.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Work In Progress report specification version 6 (S4-R22, S10-R3).
```


---

## MG-WIP-TOTAL-PINNED — SURVIVOR (kept) — C30494

**Title:** Each tab has a Totals row pinned to the bottom, labeled "Totals"

**Section:** 4357 · **Type:** 6 · **Priority:** 3

**refs:** `SV-8662 (WIP spec v6 2026-07-29 Story 6 S6-R1; S6-R4; S6-R5)`

**Preconditions:**
```
1. You are signed in to the ShopView App on a desktop browser.
2. Each tab has at least one visible job.
```

**Steps:**
```
1. In each tab, look at the bottom of the table.
2. Read the Totals row's leftmost cell and its Total cell.
3. Compare the Totals row's number formats to the data rows.
```

**Expected Results:**
```
1. Each tab's table has a Totals row pinned to the bottom, labeled "Totals" in its leftmost cell.
2. The Totals row's Total cell is pinned far right and shown in bold, matching the column.
3. The Totals row uses the same number formats as the data rows.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Work In Progress report specification version 6 (S6-R1, S6-R4, S6-R5).
```


---

## CUT candidate — C30544

**Title:** There is no dead-stock exclusion - a slow-moving part still appears

**refs:** `SV-8669 (IV spec v3 2026-07-29 Story 2 context note (no dead-stock exclusion))`

**Preconditions:**
```
1. You are signed in to the ShopView App on a desktop browser.
2. A part with positive, non-core stock exists that has had no movement for a long time (or the oldest-stocked part at the location is known).
```

**Steps:**
```
1. Open the Inventory Value report scoped to the location.
2. Search for the long-sitting part.
```

**Expected Results:**
```
1. The long-sitting part appears and its value is counted — every part currently holding positive, non-core stock contributes to the on-hand value, however long it has sat.
---
This is the expected behaviour as per the build tested on 8/4/2026, and as per the Inventory Value report specification version 3.
```

