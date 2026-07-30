# Filters — Consolidation (Merge/Cut) Plan — 2026-07-31

**Companion to:** `USEFULNESS-AUDIT-2026-07-31.md` + `per-case-verdicts.csv` (same folder).
**Source snapshot:** `build/filters/cases/*.json` at git SHA `7eeb74548eae665f5ac5110512fddc0c8550db41` (working tree clean for `build/filters` at snapshot time).
**Status: PARTIALLY EXECUTED 2026-07-31 (user-authorized) — the rest is HELD.**
The user authorized a **deliberately partial** execution on 2026-07-31. Every group/cut below now
carries an explicit **EXECUTED** or **HELD** marker. Summary:

| Portion | Status |
|---|---|
| The 12 FIX-WORDING repairs (in the audit report) | **EXECUTED** — 3 applied directly (2 pushed to TestRail), 9 delivered by the MG15 merge |
| **MG14-PARTS-CHIP-MATRIX** | **EXECUTED — LOCAL-ONLY** (all cases blank C-id, never in TestRail) |
| **MG15-REPORTS-CHIP-MATRIX** | **EXECUTED — LOCAL-ONLY** (all cases blank C-id, never in TestRail) |
| MG1 / MG2 / MG5 / MG6 (19 cases) | **HELD** — await live VIU of the "five dropdowns are one shared component" assumption |
| MG3 / MG4 / MG7 / MG8 / MG10 / MG11 / MG12 / MG13 | **HELD** — not in this authorization |
| Cuts: FLT-BAR-03, FLT-COLL-03 | **HELD** — not in this authorization; both remain live in TestRail |
| Cuts: FLT-SRCH-01..09 (9 cases) | **HELD — USER RULING 2026-07-31** (see the Cuts section) |
| The 39 ≤80-char title trims | **HELD** — not authorized this pass |
| Optional MG16 / MG17 / MG18 | **HELD** — not authorized this pass |

Execution record: `testrail-execution-manifest-2026-07-31.md` + `testrail-execution-log-2026-07-31.md`
(2 `update_case`, both HTTP 200 + re-GET MATCH, 0 deletes, 0 run writes); local edits +
recovery: `../consolidation-backup-2026-07-31/MANIFEST.md`. **Resulting tally: 137 authored →
110 ACTIVE** (27 retired = the MG14 + MG15 merge members).

## What this plan does

- **14 merge groups** absorb **52 member cases** into their named survivors (the survivor gains the members' checks — no coverage is lost).
- **11 outright cuts** (2 in-suite duplicates + the 9-case Command-K block that duplicates the Global Search project's suite — that block is PENDING BRANKO Q6; the PO decides, this plan only flags).
- Result: **137 → 74 cases** with identical behavioural coverage (71 KEEP + 3 WEAK-KEEP).
- **3 WEAK-KEEP** cases stay, flagged low-value; dropping them too would give 71.

Execution note (if approved): 25 of the 52 merge members and 2 of the 11 cuts are LIVE in TestRail (an `update_case` on each survivor + `delete_case` on members/cuts, fresh explicit authorization, per-case audit log, re-GET verification, id-map + import regeneration, bodies kept locally marked Retired). The other 27 members + the 9-case Command-K block have NO C-ids — those merges/cuts are a LOCAL edit only, cheapest applied at the Branko-PRD reconciliation BEFORE any push.

## Merge groups

### MG1-CLEAR-SELECTION

**STATUS: HELD 2026-07-31** — not executed. This group rests on the "the five filter dropdowns are one shared component" assumption, which the audit explicitly labelled *not live-verified this run*. Held until the QA branch lets us verify it live; all member cases are UNTOUCHED.
- **Survivor:** FLT-CHIP-05 (C29599, https://shopview.testrail.io/index.php?/cases/view/29599) — "'Clear selection' inside one dropdown clears only that filter and leaves the others active"
- **Absorbs:**
  - FLT-STAT-04 (C29563, https://shopview.testrail.io/index.php?/cases/view/29563) — "Clear selection in the Status dropdown unticks every status and removes the filter"
  - FLT-CUST-06 (C29571, https://shopview.testrail.io/index.php?/cases/view/29571) — "Clear selection in the Customer dropdown removes all selected customers"
  - FLT-TECH-04 (C29578, https://shopview.testrail.io/index.php?/cases/view/29578) — "Clear selection in the Lead Technician dropdown removes all selected technicians"
  - FLT-ADV-04 (C29585, https://shopview.testrail.io/index.php?/cases/view/29585) — "Clear selection in the Service Advisor dropdown removes all selected advisors"
  - FLT-ASSET-04 (C29592, https://shopview.testrail.io/index.php?/cases/view/29592) — "Clear selection in the Asset on site dropdown removes the filter"
- **What the survivor gains:** the survivor gains a per-dropdown check table: repeat 'Clear selection' in each of the five dropdowns (Status, Customer, Lead Technician, Service Advisor, Asset on site) — each clears only its own filter, other active filters stay, the table recovers accordingly

### MG2-CLICK-OUTSIDE

**STATUS: HELD 2026-07-31** — not executed. This group rests on the "the five filter dropdowns are one shared component" assumption, which the audit explicitly labelled *not live-verified this run*. Held until the QA branch lets us verify it live; all member cases are UNTOUCHED.
- **Survivor:** FLT-STAT-05 (C29564, https://shopview.testrail.io/index.php?/cases/view/29564) — "Clicking outside the Status dropdown closes it and keeps the selections applied"
- **Absorbs:**
  - FLT-CUST-07 (C29572, https://shopview.testrail.io/index.php?/cases/view/29572) — "Clicking outside the Customer dropdown closes it and the selections remain"
  - FLT-TECH-05 (C29579, https://shopview.testrail.io/index.php?/cases/view/29579) — "Clicking outside the Lead Technician dropdown closes it"
  - FLT-ADV-05 (C29586, https://shopview.testrail.io/index.php?/cases/view/29586) — "Clicking outside the Service Advisor dropdown closes it"
  - FLT-ASSET-05 (C29593, https://shopview.testrail.io/index.php?/cases/view/29593) — "Clicking outside the Asset on site dropdown closes it"
- **What the survivor gains:** the survivor gains: repeat the click-outside close in each of the other four dropdowns (Customer incl. tags still shown on reopen, Lead Technician, Service Advisor, Asset on site) — dropdown closes, selection stays applied, chip stays active

### MG3-EMPTY-STATE

**STATUS: HELD 2026-07-31** — not in the partial authorization; all cases UNTOUCHED.
- **Survivor:** FLT-EMPTY-01 (C29606, https://shopview.testrail.io/index.php?/cases/view/29606) — "A filter combination with no matching work orders shows a no-results empty state instead of a blank table"
- **Absorbs:**
  - FLT-STAT-06 (C29565, https://shopview.testrail.io/index.php?/cases/view/29565) — "Selecting statuses that no work order has shows the empty state"
  - FLT-TECH-06 (C29580, https://shopview.testrail.io/index.php?/cases/view/29580) — "Selecting a technician who leads no work orders shows the empty state"
  - FLT-ADV-06 (C29587, https://shopview.testrail.io/index.php?/cases/view/29587) — "Selecting an advisor with no assigned work orders shows the empty state"
  - FLT-ASSET-06 (C29594, https://shopview.testrail.io/index.php?/cases/view/29594) — "An Asset on site choice that matches no work orders shows the empty state"
- **What the survivor gains:** the survivor gains: the empty state also appears when a SINGLE filter matches nothing — one leg each for a no-work-order status, an unassigned technician, an unassigned advisor and an unmatched Asset on site option (seed per Rule 14)

### MG4-COLLAPSE-EXPAND

**STATUS: HELD 2026-07-31** — not in the partial authorization; all cases UNTOUCHED.
- **Survivor:** FLT-COLL-01 (C29601, https://shopview.testrail.io/index.php?/cases/view/29601) — "The toolbar funnel button collapses the filter bar and the table reclaims the space"
- **Absorbs:**
  - FLT-COLL-02 (C29602, https://shopview.testrail.io/index.php?/cases/view/29602) — "Expanding the filter bar brings it back exactly as it was, with active filters still shown"
- **What the survivor gains:** the survivor gains the expand half: clicking the funnel again brings the bar back below the tab row with the previously selected filters still shown active (blue) and the 'Clear filters' link still present

### MG5-DROPDOWN-OPEN

**STATUS: HELD 2026-07-31** — not executed. This group rests on the "the five filter dropdowns are one shared component" assumption, which the audit explicitly labelled *not live-verified this run*. Held until the QA branch lets us verify it live; all member cases are UNTOUCHED.
- **Survivor:** FLT-CUST-01 (C29566, https://shopview.testrail.io/index.php?/cases/view/29566) — "Customer chip opens a dropdown with a 'Search customer' field and a scrollable customer list"
- **Absorbs:**
  - FLT-TECH-01 (C29575, https://shopview.testrail.io/index.php?/cases/view/29575) — "Lead Technician chip opens a dropdown with a 'Search technician' field and a technician list"
  - FLT-ADV-01 (C29582, https://shopview.testrail.io/index.php?/cases/view/29582) — "Service Advisor chip opens a dropdown with a 'Search advisor' field and an advisor list"
- **What the survivor gains:** the survivor gains: repeat on the Lead Technician chip (placeholder 'Search technician') and the Service Advisor chip (placeholder 'Search advisor') — same search field + scrollable list + 'Clear selection' layout

### MG6-TYPEAHEAD

**STATUS: HELD 2026-07-31** — not executed. This group rests on the "the five filter dropdowns are one shared component" assumption, which the audit explicitly labelled *not live-verified this run*. Held until the QA branch lets us verify it live; all member cases are UNTOUCHED.
- **Survivor:** FLT-CUST-02 (C29567, https://shopview.testrail.io/index.php?/cases/view/29567) — "Typing in the customer search narrows the list to matching names"
- **Absorbs:**
  - FLT-TECH-02 (C29576, https://shopview.testrail.io/index.php?/cases/view/29576) — "Typing in the technician search narrows the list to matching names"
  - FLT-ADV-02 (C29583, https://shopview.testrail.io/index.php?/cases/view/29583) — "Typing in the advisor search narrows the list to matching names"
- **What the survivor gains:** the survivor gains: repeat the type-to-narrow / delete-to-restore check in the Lead Technician and Service Advisor search fields

### MG7-TAG-SELECT

**STATUS: HELD 2026-07-31** — not in the partial authorization; all cases UNTOUCHED.
- **Survivor:** FLT-CUST-03 (C29568, https://shopview.testrail.io/index.php?/cases/view/29568) — "Selecting customers adds removable tags in the dropdown input area and checkmarks in the list"
- **Absorbs:**
  - FLT-CUST-04 (C29569, https://shopview.testrail.io/index.php?/cases/view/29569) — "Clicking the x on a customer tag removes just that customer from the selection"
- **What the survivor gains:** the survivor gains the removal half: click the x on one selected customer's tag — that tag and its list checkmark go, the other selections stay, the table drops that customer's work orders

### MG8-DEACTIVATED-STAFF

**STATUS: HELD 2026-07-31** — not in the partial authorization; all cases UNTOUCHED.
- **Survivor:** FLT-TECH-07 (C29581, https://shopview.testrail.io/index.php?/cases/view/29581) — "A deactivated technician does not appear in the Lead Technician filter list"
- **Absorbs:**
  - FLT-ADV-07 (C29588, https://shopview.testrail.io/index.php?/cases/view/29588) — "A deactivated advisor does not appear in the Service Advisor filter list"
- **What the survivor gains:** the survivor gains: repeat with a deactivated advisor on the Service Advisor filter — same active-staff-only rule (engineering: the dropdowns request active staff only)

### MG10-ALLTAB-COMPOSITION

**STATUS: HELD 2026-07-31** — not in the partial authorization; all cases UNTOUCHED. (Note: the survivor FLT-BAR-02 / C29558 *was* edited on 2026-07-31, but only by the separate FIX-WORDING repair that adds the "You are on the All tab" precondition — the MG10 merge itself was NOT applied and FLT-TAB-01 / C29608 is untouched.)
- **Survivor:** FLT-BAR-02 (C29558, https://shopview.testrail.io/index.php?/cases/view/29558) — "Five filter chips appear in a fixed order, each with an icon, its name and a down arrow"
- **Absorbs:**
  - FLT-TAB-01 (C29608, https://shopview.testrail.io/index.php?/cases/view/29608) — "The All tab shows all five filter chips, all working"
- **What the survivor gains:** the survivor gains: precondition 'You are on the All tab' + a final check that each of the five chips opens its dropdown and is usable there

### MG11-PREFILTERED-TABS

**STATUS: HELD 2026-07-31** — not in the partial authorization; all cases UNTOUCHED.
- **Survivor:** FLT-TAB-02 (C29609, https://shopview.testrail.io/index.php?/cases/view/29609) — "On the Estimates tab the Status chip is shown greyed out, pre-filled with 'Status: Estimate', and cannot be changed; the other four filters work on top of the Estimates pre-filter"
- **Absorbs:**
  - FLT-TAB-03 (C29610, https://shopview.testrail.io/index.php?/cases/view/29610) — "On the Completed tab the Status chip is shown greyed out, pre-filled with the tab's status, and cannot be changed; the other four filters work on top of the Completed pre-filter"
- **What the survivor gains:** the survivor gains: repeat on the Completed tab — Status chip greyed out and pre-filled with that tab's status, other four chips usable, a customer selection narrows the pre-filtered Complete list

### MG12-URL-REFLECT

**STATUS: HELD 2026-07-31** — not in the partial authorization; all cases UNTOUCHED.
- **Survivor:** FLT-URL-02 (C29618, https://shopview.testrail.io/index.php?/cases/view/29618) — "Opening a shared or bookmarked URL loads the Work Orders page with those filters already applied"
- **Absorbs:**
  - FLT-URL-01 (C29617, https://shopview.testrail.io/index.php?/cases/view/29617) — "Applying filters updates the page URL to reflect the active filter state"
- **What the survivor gains:** the survivor gains the outbound direction: applying filters puts the filter state into the address bar, clearing all filters removes it again (capture the URL there for the share step)

### MG13-MOBILE-SHEET-FILTERS

**STATUS: HELD 2026-07-31** — not in the partial authorization; all cases UNTOUCHED.
- **Survivor:** FLT-MOB-05 (C29625, https://shopview.testrail.io/index.php?/cases/view/29625) — "The mobile Customer filter has search, multi-select and removable tags, matching desktop"
- **Absorbs:**
  - FLT-MOB-06 (C29626, https://shopview.testrail.io/index.php?/cases/view/29626) — "The mobile Lead Technician and Service Advisor filters offer their search lists in the sheet"
  - FLT-MOB-07 (C29627, https://shopview.testrail.io/index.php?/cases/view/29627) — "The mobile Asset on site filter offers Yes/No with Clear selection in the sheet"
- **What the survivor gains:** the survivor gains: expand the Lead Technician row ('Search technician' + list) and the Service Advisor row ('Search advisor' + list); expand Asset on site (Yes / No single-select + 'Clear selection'); applying any of them filters the list

### MG14-PARTS-CHIP-MATRIX

**STATUS: EXECUTED 2026-07-31 — LOCAL-ONLY** (every case in this group has a blank C-id and was never in TestRail, so no `delete_case` was needed). Members retired locally, bodies kept; survivor rewritten.
- **Survivor:** FLT-PARTS-01 (new, no C-ID yet — design-level pending queue) — "Parts Inventory page shows Bin Location, Category, Supply and Vendor filters"
- **Absorbs:**
  - FLT-PARTS-02 (new, no C-ID yet — design-level pending queue) — "Parts Part Sales page shows Status, Customer, Created by and Date filters"
  - FLT-PARTS-03 (new, no C-ID yet — design-level pending queue) — "Parts Catalog page shows Manufacturer and Category filters"
  - FLT-PARTS-04 (new, no C-ID yet — design-level pending queue) — "Parts Returns tab shows Vendor, Category and Part Type filters"
  - FLT-PARTS-05 (new, no C-ID yet — design-level pending queue) — "Parts Credits tab shows Vendor, Date and Processed by filters"
  - FLT-PARTS-06 (new, no C-ID yet — design-level pending queue) — "Parts Purchase Orders page shows Vendor, Status, Date and Ordered by filters"
  - FLT-PARTS-07 (new, no C-ID yet — design-level pending queue) — "Vendor Invoices page shows Vendor, Invoice date, Date received, Received by"
  - FLT-PARTS-08 (new, no C-ID yet — design-level pending queue) — "Parts Vendors list page shows Vendor and State/Province filters"
  - FLT-PARTS-10 (new, no C-ID yet — design-level pending queue) — "Parts pages show the shared search and filter toolbar icons"
- **What the survivor gains:** the survivor becomes ONE Parts walk with a per-view checklist of the designed filter buttons: Inventory (Bin Location, Category, Supply, Vendor) - Part Sales (Status, Customer, Created by, Date) - Catalog (Manufacturer, Category) - Returns (Vendor, Category, Part Type) - Credits (Vendor, Date, Processed by) - Purchase Orders (Vendor, Status, Date, Ordered by) - Vendor Invoices (Vendor, Invoice date, Date received, Received by) - Vendors (Vendor, State/Province); plus one line: every Parts list page shows the shared Search and funnel toolbar icons

### MG15-REPORTS-CHIP-MATRIX

**STATUS: EXECUTED 2026-07-31 — LOCAL-ONLY** (every case in this group has a blank C-id and was never in TestRail, so no `delete_case` was needed). Members retired locally, bodies kept; survivor rewritten — and this merge also delivered 9 of the 12 audit FIX-WORDING repairs (renumbered expected list + explicit switch-tab steps).
- **Survivor:** FLT-RPTS-01 (new, no C-ID yet — design-level pending queue) — "Timesheet Activities report shows Staff, Date, Status, Modified by filters"
- **Absorbs:**
  - FLT-RPTS-02 (new, no C-ID yet — design-level pending queue) — "Payroll Timesheet report shows Employee and Date filters"
  - FLT-RPTS-03 (new, no C-ID yet — design-level pending queue) — "Sales report shows Customer and Date filters"
  - FLT-RPTS-04 (new, no C-ID yet — design-level pending queue) — "Technician Efficiency report shows Customer, Technician and Date filters"
  - FLT-RPTS-05 (new, no C-ID yet — design-level pending queue) — "Advisor Analysis report shows Customer, Date and Advisor filters"
  - FLT-RPTS-06 (new, no C-ID yet — design-level pending queue) — "Shop Efficiency report shows only a Date filter"
  - FLT-RPTS-07 (new, no C-ID yet — design-level pending queue) — "Work in Progress report shows Status, Date and Customer filters"
  - FLT-RPTS-08 (new, no C-ID yet — design-level pending queue) — "Sales Follow Up report shows Customer, Date and Contact filters"
  - FLT-RPTS-09 (new, no C-ID yet — design-level pending queue) — "Sales Tax Collected tab shows Date, Invoice Status and Customer filters"
  - FLT-RPTS-10 (new, no C-ID yet — design-level pending queue) — "Sales Tax All Tax Rates tab shows only an Invoice Status filter"
  - FLT-RPTS-11 (new, no C-ID yet — design-level pending queue) — "A/R Aging Summary report shows Customer and Date filters"
  - FLT-RPTS-12 (new, no C-ID yet — design-level pending queue) — "A/R Aging Detail shows Customer, Date, Location, Transaction Type filters"
  - FLT-RPTS-13 (new, no C-ID yet — design-level pending queue) — "A/R Aging Collection shows Customer, Date, Location, Transaction Type"
  - FLT-RPTS-14 (new, no C-ID yet — design-level pending queue) — "A/P Aging Summary report shows Vendor and Date filters"
  - FLT-RPTS-15 (new, no C-ID yet — design-level pending queue) — "A/P Aging Detail shows Vendor, Date, Location, Transaction Type filters"
  - FLT-RPTS-16 (new, no C-ID yet — design-level pending queue) — "A/P Unpaid Invoices shows Vendor, Date, Location, Transaction Type filters"
  - FLT-RPTS-17 (new, no C-ID yet — design-level pending queue) — "Notes report shows Author, Date and Mention filters"
  - FLT-RPTS-18 (new, no C-ID yet — design-level pending queue) — "Reminders report shows only a Date filter"
  - FLT-RPTS-19 (new, no C-ID yet — design-level pending queue) — "IBS Batch Transactions report shows Customer, Date and Status filters"
  - FLT-RPTS-20 (new, no C-ID yet — design-level pending queue) — "QB Unexported report filters change per tab (Customer / Vendor / User)"
- **What the survivor gains:** the survivor becomes ONE Reports walk with a per-report checklist of the designed filter buttons (21 reports/tabs, e.g. Timesheet Activities: Staff, Date, Status, Modified by - Payroll Timesheet: Employee, Date - Sales: Customer, Date - Technician Efficiency (both tabs): Customer, Technician, Date - Advisor Analysis - Shop Efficiency: Date only - Work in Progress - Sales Follow Up - Sales Tax (per tab) - A/R Aging x3 - A/P Aging x3 - Notes: Author, Date, Mention - Reminders: Date only - IBS Batch Transactions - QB Unexported: first chip changes per tab); the tab-bearing reports get an explicit switch-tab step; column lists stay as reference notes, not assertions

## Cuts

**STATUS 2026-07-31 — 0 of the 11 cuts were deleted from TestRail.**

- **FLT-BAR-03 (C29559) and FLT-COLL-03 (C29603): HELD** — not in the partial authorization. Both
  remain live and untouched.
- **FLT-SRCH-01 … FLT-SRCH-09: HELD — USER RULING 2026-07-31**, verbatim:
  > "OK do not delete those cases unless Branko confirms that they are related to Global search only."

  All nine stay in the **Filters** suite and must NOT be deleted or moved unless and until **Branko
  explicitly confirms they belong to Global Search only** (his answer to **Q6** of
  `../PO-Questions-Branko-PartsReports-2026-07-27.md` decides move-vs-keep). None of the nine has a
  TestRail C-id, so nothing was deleted anywhere. **Honesty note:** FLT-SRCH-09 was briefly retired
  locally earlier the same day under the "single NONSENSE case" item of the authorization; that
  retirement was **REVERTED** on this ruling and the case is ACTIVE again — the audit's NONSENSE +
  CUT recommendation for it stands as a *recommendation only*, re-tabled once Branko answers.


- FLT-BAR-03 (C29559, https://shopview.testrail.io/index.php?/cases/view/29559) — "The filter bar still shows the remaining chips on a tab where the Status filter is hidden" — Duplicate of FLT-TAB-02 (C29609): 'the remaining four chips stay visible/usable on Estimates' is already expected lines 1-2 there. **[HELD — not authorized this pass; still live in TestRail.]**
- FLT-COLL-03 (C29603, https://shopview.testrail.io/index.php?/cases/view/29603) — "The collapsed or expanded state of the filter bar is remembered after leaving and returning" — Duplicate of FLT-PERS-01 (C29613): bar collapsed/expanded state restored after leaving and returning is already expected lines 2-3 there. **[HELD — not authorized this pass; still live in TestRail.]**
- FLT-SRCH-01 (new, no C-ID yet — design-level pending queue) — "Page search opens with the 'Search or ask a question' box" — Duplicate across projects: the spotlight/Command-K component is covered by the Global Search project's authored suite (86 cases); engineering (tech plan headline 5) says it is the wrong component for the Filters programme — transfer/retire pending Branko Q6 (PO decides). **[HELD — user ruling 2026-07-31: do NOT delete unless Branko confirms they are Global-Search-only (Q6 pending)]**
- FLT-SRCH-02 (new, no C-ID yet — design-level pending queue) — "Page search shows entity tabs All, Work Orders, Customers, Assets, Parts..." — Duplicate across projects (Global Search suite covers entity tabs); wrong component for Filters per engineering — pending Branko Q6. **[HELD — user ruling 2026-07-31: do NOT delete unless Branko confirms they are Global-Search-only (Q6 pending)]**
- FLT-SRCH-03 (new, no C-ID yet — design-level pending queue) — "Typing a term shows grouped results with counts and highlighting" — Duplicate across projects (Global Search suite covers grouped results/highlighting); wrong component for Filters per engineering — pending Branko Q6. **[HELD — user ruling 2026-07-31: do NOT delete unless Branko confirms they are Global-Search-only (Q6 pending)]**
- FLT-SRCH-04 (new, no C-ID yet — design-level pending queue) — "Recent searches are shown grouped by Today, Yesterday, Past week..." — Duplicate across projects (Global Search suite covers recent searches); wrong component for Filters per engineering — pending Branko Q6. **[HELD — user ruling 2026-07-31: do NOT delete unless Branko confirms they are Global-Search-only (Q6 pending)]**
- FLT-SRCH-05 (new, no C-ID yet — design-level pending queue) — "Re-opening page search keeps the last typed text and its results" — Duplicate across projects (Global Search suite covers persisting search); wrong component for Filters per engineering — pending Branko Q6. **[HELD — user ruling 2026-07-31: do NOT delete unless Branko confirms they are Global-Search-only (Q6 pending)]**
- FLT-SRCH-06 (new, no C-ID yet — design-level pending queue) — "Hovering a search result shows quick-action buttons" — Duplicate across projects (Global Search suite covers hover quick-actions); wrong component for Filters per engineering — pending Branko Q6. **[HELD — user ruling 2026-07-31: do NOT delete unless Branko confirms they are Global-Search-only (Q6 pending)]**
- FLT-SRCH-07 (new, no C-ID yet — design-level pending queue) — "Page search shows keyboard hints and supports keyboard navigation" — Duplicate across projects (Global Search suite covers keyboard navigation); wrong component for Filters per engineering — pending Branko Q6. **[HELD — user ruling 2026-07-31: do NOT delete unless Branko confirms they are Global-Search-only (Q6 pending)]**
- FLT-SRCH-08 (new, no C-ID yet — design-level pending queue) — "Page search results include a Refresh action" — Duplicate across projects (Global Search suite covers the results panel incl. Refresh); wrong component for Filters per engineering — pending Branko Q6. **[HELD — user ruling 2026-07-31: do NOT delete unless Branko confirms they are Global-Search-only (Q6 pending)]**
- FLT-SRCH-09 (new, no C-ID yet — design-level pending queue) — "Page search scope belongs to Filters or Global Search (to decide)" — Not a test case — a QA/PO scope decision ('which project owns page search') dressed as a case; the decision already lives in the Branko question sheet (Q6), not in TestRail. **[HELD — user ruling 2026-07-31: do NOT delete unless Branko confirms they are Global-Search-only (Q6 pending)]**

## Weak-keeps (kept, flagged)

- FLT-MOB-09 (C29629, https://shopview.testrail.io/index.php?/cases/view/29629) — "Mobile has no collapse toggle: the filter chip row is always visible" — Absence assertion (no collapse toggle on mobile) — spec'd (S12-R4) but a failure is cosmetic-severity; kept, flagged low-value.
- FLT-MOB-10 (C29630, https://shopview.testrail.io/index.php?/cases/view/29630) — "Filters matching no work orders on mobile show the same empty state as desktop" — Mobile repeat of the filtered empty state — the mobile surface can genuinely render differently, but the yield beyond FLT-EMPTY-01 is low; kept, flagged.
- FLT-API-05 (C29635, https://shopview.testrail.io/index.php?/cases/view/29635) — "A filter combination matching nothing returns a successful empty list, not an error" — Empty-match-returns-200 is thin — largely implied by FLT-API-02 (combination request) + FLT-EMPTY-01 (page renders the state); kept for the explicit no-error backend contract, flagged low-value.

## Optional borderline groups (from the adversarial self-audit — NOT counted in the 137 → 74 headline)

The self-audit's independent re-derivation found the main pass **under-merges** in three
places: these pairs would merge under the same "two halves of one interaction" logic used for
MG4 (collapse/expand) and MG7 (tag select/remove). They are left as KEEP in the headline
because each half can fail independently with a different bug, so approving them is a
judgement call, not a correction. **Approving all three takes the suite 74 → 71.**
Approve/decline each on its own.

### MG16-CLEAR-FILTERS-CONTROL *(optional — the clearest of the three)*

**STATUS: HELD 2026-07-31** — not authorized this pass; both cases UNTOUCHED.
- **Survivor:** FLT-CHIP-04 (C29597, https://shopview.testrail.io/index.php?/cases/view/29597) — "'Clear filters' removes every active filter at once and all chips return to default"
- **Absorbs:** FLT-CHIP-03 (C29596, https://shopview.testrail.io/index.php?/cases/view/29596) — "'Clear filters' appears to the right of the chips only when at least one filter is active"
- **Why it is a candidate:** one control, and the overlap is already visible in the case text — FLT-CHIP-04's expected 4 ("The 'Clear filters' link disappears") re-asserts FLT-CHIP-03's expected 3.
- **What the survivor gains:** the conditional-appearance checks — not shown with no filters active, appears at the right end of the chip row as soon as one filter is active, disappears again when the last filter is removed (which the bulk-clear step already produces).
- **Reason to decline:** the appearance rule and the bulk-clear action are separately spec'd behaviours; a tester loses the explicit "nothing to click when nothing is active" check as a named line.

### MG17-COLLAPSED-BAR-WITH-ACTIVE-FILTERS *(optional — mild)*

**STATUS: HELD 2026-07-31** — not authorized this pass; both cases UNTOUCHED.
- **Survivor:** FLT-COLL-05 (C29605, https://shopview.testrail.io/index.php?/cases/view/29605) — "Active filters keep filtering the table while the filter bar is collapsed"
- **Absorbs:** FLT-COLL-04 (C29604, https://shopview.testrail.io/index.php?/cases/view/29604) — "The funnel button shows a blue indicator when filters are active while the bar is collapsed, and none when no filters are active"
- **Why it is a candidate:** same setup (filters active + bar collapsed), asserted twice; natural co-runners in one sitting.
- **What the survivor gains:** the funnel-icon indicator checks (no indicator when no filters are active; primary-blue filters icon when they are).
- **Reason to decline (why the main pass kept both):** the failures are different severities — a missing indicator is cosmetic, filtering silently pausing while the bar is hidden is a wrong-results bug. Keeping them apart keeps that distinction visible.

### MG18-PARTS-FILTER-BEHAVIOUR *(optional — mild, design-level pending)*

**STATUS: HELD 2026-07-31** — not authorized this pass; FLT-PARTS-11 and FLT-PARTS-12 are both UNTOUCHED and still active.
- **Survivor:** FLT-PARTS-11 (new, no C-ID yet — design-level pending queue) — "Choosing a Parts filter narrows the list on that page"
- **Absorbs:** FLT-PARTS-12 (new, no C-ID yet — design-level pending queue) — "Parts filters support multiple choices and can be cleared"
- **Why it is a candidate:** both are the same generic "Parts filters behave like Work Orders filters" walk, and both are still hedged pending Branko's PRD.
- **What the survivor gains:** the multi-select check, per-filter Clear selection, and the overall Clear filters action.
- **Reason to decline:** applying a filter and the multi-select/clear semantics are different behaviours; better re-judged once Branko's PRD pins what Parts filters actually do.
