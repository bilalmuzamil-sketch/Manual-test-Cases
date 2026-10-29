<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
SUMMARY: Reports - Parts Velocity hides the Location column when one location is picked
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8642 (Velocity - Story 2 - Filters & Search) · relates to SV-8643 (Velocity - Story 3 - Data Table)
PICTURES: pictures/P2-B3-1-parts-velocity-no-location-column.png · pictures/P2-B3-2-inventory-value-shows-location.png
BASIS: Chris Ward's answer to question 16 (28 Oct 2026): "No, always show it, the same as S3-R10, the Key Decisions and Inventory Value. Drop the hide rule from S2-R12. Defect."
RE-CHECKED: 29 Oct 2026, 12:09 AM–12:15 AM UTC (= 28 Oct, 8:09–8:15 PM in Toronto), staging v26.43.2-f8698cb, DVI Test; session, browser and test computer all on America/Toronto.
DUPLICATE CHECK: none open. SV-8938 (Location column position, OBSOLETE) is about where the column sits, not about it being hidden.
NOTE FOR THE QA LEAD: Chris also said the PRD's S2-R12 hide rule gets dropped; that is a PRD edit for him, not part of this ticket.
-->

## What is wrong

On **Parts Velocity**, a user who works at **several locations** loses the **Location** column as soon as only **one** location is picked in the Location filter.

The Location column should **always** be shown to a user with more than one location, however many locations are picked, the same as on **Inventory Value**.

For example, the Admin user has 4 locations. With **Location: DVI Test** picked:

- Actual: Parts Velocity shows **14 columns**, and none of them is Location. The columns button does not offer Location either.
- Expected: **15 columns**, with **Location** reading "DVI Test" on each row, as Inventory Value does for the same user and location.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin (this user has 4 locations).
2. At the top right, switch the location to **DVI Test**.
3. Click **Reports**, then in the left menu under **Parts**, click **Parts Velocity**.
4. Check the filter reads **Location: DVI Test** (one location picked).
5. Read the column headings of the table.
6. Click the columns button at the top right of the table (the last icon, right of **⋯**) and look for **Location** in the list.
7. For comparison, in the left menu under **Parts**, click **Inventory Value** (also **Location: DVI Test**) and read its column headings.

**Actual:** Parts Velocity has no **Location** column, and the columns button has no Location entry. Inventory Value shows **Location** ("DVI Test" on each row).

**Expected:** Parts Velocity shows the **Location** column (each row reads "DVI Test"), as Inventory Value does. It can still be switched off from the columns button.

---

**Source:** Chris Ward, answer to question 16 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> 16. No, always show it, the same as S3-R10, the Key Decisions and Inventory Value. Drop the hide rule from S2-R12. Defect.

Parts Velocity Report PRD (version 12), Key Decisions: "A per-row Location column is available to any user with access to more than one location. Such a user sees it by default and can toggle it on or off from the column selector, regardless of how many locations are currently selected; a user with access to only one location never sees it."

## Screenshots

**1.** Parts Velocity, Admin with four locations, Location: DVI Test: no Location column.

**2.** Inventory Value, same user, same location: the Location column is shown.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin.
- Browser and test computer set to the location's time zone (America/Toronto).
- Only the one-location case was checked on screen; the two-location view was not re-checked this time.
- Not checked on Production or on a QA branch.
