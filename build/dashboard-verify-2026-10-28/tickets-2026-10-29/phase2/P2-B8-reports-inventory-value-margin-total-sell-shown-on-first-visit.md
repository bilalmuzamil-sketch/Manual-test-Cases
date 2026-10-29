<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
SUMMARY: Reports - Inventory Value shows Margin and Total Sell on the first visit; they should start hidden
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8670 (Inv Value - Story 3 - Columns and Calculations) · relates to SV-8675 (Inv Value - Story 8 - Column Selection and Persistence) · relates to SV-8927 (first report of this, closed OBSOLETE 9 Aug 2026; QA lead: re-create, not reopen)
PICTURES: pictures/P2-B8-1-inventory-value-first-visit.png
BASIS: Inventory Value Report PRD (Confluence 720142338, version 10, last change 13 Aug 2026), S3-R12, S3-R13 and S8-R3 (quoted below). Converted from the 28 Oct draft filed-2026-10-28/drafts/IV-COLUMNS.html.
RE-CHECKED: 29 Oct 2026, 12:14 AM UTC (= 28 Oct, 8:14 PM in Toronto), staging v26.43.2-f8698cb, DVI Test, fresh browser with no saved report settings; session, browser and test computer all on America/Toronto.
DUPLICATE CHECK: none open; SV-8927 is closed (OBSOLETE).
NOTE FOR THE QA LEAD: Chris's answer 20(b) renames "Qty" to "On Hand" (separate ticket P2-B5); the expected list below uses the new name.
-->

## What is wrong

When **Inventory Value** is opened for the **first time** in a browser (no saved settings), the **Margin** and **Total Sell** columns are already shown.

Both should **start hidden**. A user who wants them turns them on from the columns button.

For example, at DVI Test the first visit shows:

- Actual: **12 columns**: Part #, Description, Category, Vendor, Location, Qty, Unit Cost, Unit Sell, **Margin**, Margin %, **Total Sell**, Total Cost.
- Expected: **10 columns**: the same without **Margin** and **Total Sell** (12 − 2 = 10).

So every new user, and every user on a new browser or device, sees two extra money columns by default.

The figures in the columns are correct, and the columns button works (switching Margin or Total Sell off hides it).

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Open a browser window that has never opened Inventory Value before (a private / incognito window works).
2. Log in to staging as an Admin.
3. At the top right, switch the location to **DVI Test**.
4. Click **Reports**, then in the left menu under **Parts**, click **Inventory Value**.
5. Read the column headings across the top of the table.

**Actual:** **Margin** and **Total Sell** are shown on the first visit.

**Expected:** **Margin** and **Total Sell** are hidden on the first visit. The visible columns are Part #, Description, Category, Vendor, Location (for a user with more than one location), On Hand, Unit Cost, Unit Sell, Margin % and Total Cost.

---

**Source:** Inventory Value Report PRD (Confluence 720142338, version 10, last change 13 Aug 2026):

> S3-R12: On first visit, the visible columns are: Part #, Description, Category, Vendor, Qty on Hand, Unit Cost, Unit Sell, Margin %, and Total Cost.

> S3-R13: The Margin and Total Sell columns are hidden by default and can be turned on from the column-selection control (Story 8).

> S8-R3: Every other column is available in the control; Margin and Total Sell are off by default, the rest on by default (S3-R12).

## Screenshots

**1.** Inventory Value opened for the first time in a fresh browser at DVI Test: Margin and Total Sell are shown.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin, desktop browser.
- Browser and test computer set to the location's time zone (America/Toronto).
- Also seen on 28 Oct 2026 during the reports check, and first reported as SV-8927 (closed 9 Aug 2026).
- Not checked on Production or on a QA branch.
