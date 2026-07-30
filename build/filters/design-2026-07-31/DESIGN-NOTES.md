# Filters — Complete Figma frame extraction + design-vs-cases check (2026-07-31)

**What this is.** The user asked for **every frame** behind the four Filters Figma
links, plus a reusable way to extract them. This file is the complete inventory of
what is in those links, written in plain language, plus a **DESIGN vs CASES** section
listing what the designs show that our current Filters test cases do **not** cover (and
where a design and a case disagree).

**Scope note (Standing Rule 6/12):** this pass is **design capture only**. Nothing was
written to TestRail and no test case was edited. Everything below is read from the Figma
design source — it is **NOT** a live-build verification. Anything that still needs
checking against the real build is called out as such.

---

## 1. Method that worked

| Step | What was done |
|---|---|
| Access | **Figma REST API** with the personal access token already saved at `/tmp/figma-token` (secret stays in `/tmp`, never committed). The Figma MCP was not connected this session. |
| Enumerate | `GET /v1/files/DR4gEODShYgJqkozs3mF5q/nodes?ids=<the 4 node ids>` → walked the returned tree and collected every board (FRAME / COMPONENT_SET) under each link. |
| Render | `GET /v1/images/<file>?ids=<node ids>&format=png&scale=2` in batches, then downloaded each PNG. |
| Labels | Walked the same node tree and pulled every **visible** TEXT layer per board → `frame-texts-extracted.md`. This is what gives us exact on-screen wording (Standing Rule 9) even for boards whose PNG did not render. |

Tooling saved in `tools/` (`enumerate_frames.py`, `render.py`, `fetch_all.py`,
`texts.py`). The reusable recipe is recorded in
`build/APP-ACTIONS-PLAYBOOK.md` → *"Figma: extract ALL frames from a design link"*.

### Completeness (Standing Rule 17) — honest counts

| | Count |
|---|---|
| Boards **enumerated** under the four links (after removing duplicates) | **85 / 85 (100%)** |
| Boards with **exact on-screen text extracted** | **84 / 85** (the 85th is a divider-line component with no text) |
| Boards with a **PNG in `frames/`** | **73 / 85** |
| — rendered fresh this pass | 24 |
| — copied in from the earlier 2026-07-17 capture of the same node (same design, unchanged) | 49 |
| Boards with **NO PNG yet** | **12** |

**Why 12 are missing:** the Figma **images** endpoint hit a hard cap mid-run —
`HTTP 429 {"err":"Rate limit exceeded"}` with **`retry-after: 37874`** (~10.5 hours).
`scale=1` was tried and is capped the same way; the *nodes* endpoint still works (it is a
separate budget). The 12 missing boards are listed in section 3 and are all **still fully
described from the node tree** (their text layers, component variants and layer structure
were read directly from the design source — nothing below is guessed). To finish the
PNGs, re-run `tools/fetch_all.py` after the reset — it is **resumable** and skips boards
already downloaded.

---

## 2. What the four links actually are

| Link | Node | What it really is |
|---|---|---|
| 1 | `11817-27678` | **The whole "Filters" page (canvas)** of the file — not a single frame. It **contains links 2, 3 and 4** inside it. 85 boards in total, arranged in 6 sections. |
| 2 | `11884-16885` | Section **"Parts Exploarations 20.4.2026"** — 9 boards (8 Parts pages + the Part Type dropdown). |
| 3 | `11903-10573` | Section **"Reports Exploarations 21.4.2026"** — 23 boards (one per report / report tab). |
| 4 | `11829-8908` | **A component set named "Button"** — it is the **in-page toolbar search box** (4 looks: Default "Search" / Hover / Selected "Type to search" / Filled with text typed in). |

### ⚠️ Correction to the 2026-07-27 record

`build/filters/design-2026-07-27/DESIGN-INGEST-2026-07-27.md` recorded node
**11829-8908** as *"page-search component … also = the Global Search ⌘K palette"*. That is
**wrong**. Read live from the file, `11829-8908` is a small **component set called
"Button"** that is the **page toolbar search field** (the one that expands in place on a
list page). It is **not** the ⌘K command palette.

Two consequences:
- The design link the user gave us actually backs the **FLT-PSRCH toolbar-search** cases —
  FLT-PSRCH-01 (C38883), FLT-PSRCH-02 (C38884), FLT-PSRCH-03 (C38886), FLT-PSRCH-04
  (C38888), FLT-PSRCH-05 (C38889), FLT-PSRCH-06 (C38891), FLT-PSRCH-07 (C38893).
- **The Filters page contains no ⌘K palette board at all.** The palette lives on a
  different page of the same file ("Global search"). So the 9 **FLT-SRCH** cases
  (FLT-SRCH-01…09, no C-IDs yet) have **no design backing on the Filters page** — which
  supports the standing decision to keep them parked until Branko confirms whether they
  belong to Filters or to the Global Search project.

---

## 3. Complete frame inventory — all 85 boards

Legend for the PNG column: *yes (rendered)* = pulled fresh today · *yes (from 2026-07-17
capture)* = same Figma node, PNG copied in from our earlier export · ***NO — rate limit***
= PNG still to pull (description comes from the node tree).


### Work Order Explorations 14.4.2026 — 16 boards

| # | Board name | Figma node | From link | PNG in `frames/` | What it shows |
|---|---|---|---|---|---|
| 1 | Step 1 | `11823:8024` | link 1 | yes (rendered) | Desktop Work Orders list, first exploration: filter bar with six buttons (Status, Customer, Lead Technician, Service Advisor, My Work Orders, Asset On Site). No tab row yet. |
| 2 | WO - Separate Cards | `11829:2235` | link 1 | yes (rendered) | Same first exploration with filters APPLIED: Status button shows the shortened multi-value label and a Clear filters link appears at the end of the bar. |
| 3 | Menu selected | `11824:2812` | link 1 | yes (rendered) | Status dropdown, options ticked - nine statuses (Estimate, Approved, In progress, Review, Complete, Invoiced, Paid, Declined, Imported) + Clear selection. |
| 4 | Menu default | `11824:3067` | link 1 | yes (rendered) | Status dropdown, nothing ticked - same nine statuses + Clear selection. |
| 5 | Menu default | `11842:13915` | link 1 | yes (rendered) | Status dropdown duplicate of the default state (same nine statuses + Clear selection). |
| 6 | Tehnician | `11839:12739` | link 1 | yes (rendered) | Lead Technician dropdown (spelled "Tehnician" in Figma): search box + technician list + Clear selection. |
| 7 | Advisor | `11839:12909` | link 1 | yes (rendered) | Service Advisor dropdown: search box + advisor list + Clear selection. |
| 8 | Step 2 | `11842:2985` | link 1 | yes (rendered) | Exploration step 2 - page title "Work Orders" added above the filter bar, six filter buttons. |
| 9 | Step 5 | `11842:17150` | link 1 | yes (rendered) | Exploration step 5 - four filter buttons plus the greyed "Filter" add-a-filter button. |
| 10 | Step 6 | `11842:18756` | link 1 | yes (rendered) | Exploration step 6 - all five final filter buttons plus the greyed "Filter" add-a-filter button. |
| 11 | Step 4 | `11842:17878` | link 1 | yes (rendered) | Exploration step 4 - only three filter buttons (Status, Customer, Lead Technician) plus a greyed "Filter" button to ADD another filter. |
| 12 | Step 3 | `11842:12321` | link 1 | yes (rendered) | Exploration step 3 - filter bar removed entirely (list only), used to compare "no filters" against the filtered versions. |
| 13 | WO - Separate Cards | `11842:3301` | link 1 | yes (rendered) | Separate-cards exploration with filters applied, page title added; shortened Status label + Clear filters. |
| 14 | WO - Separate Cards | `11842:13036` | link 1 | yes (rendered) | Separate-cards exploration with NO filter bar - list only. |
| 15 | Filter menu | `11842:18588` | link 1 | yes (rendered) | Small "Filter menu" popup listing the filters you can still add: Service Advisor, Asset On Site. |
| 16 | Filter menu | `11842:19476` | link 1 | yes (rendered) | Same "Filter menu" popup with only one filter left to add: Asset On Site. |

### Work Order Explorations 20.4.2026 — 25 boards

| # | Board name | Figma node | From link | PNG in `frames/` | What it shows |
|---|---|---|---|---|---|
| 1 | Status dropdown selected | `11854:24194` | link 1 | yes (rendered) | FINAL Status dropdown with several statuses ticked. |
| 2 | Status dropdown | `11854:24280` | link 1 | yes (rendered) | FINAL Status dropdown, nothing ticked - nine statuses + Clear selection. |
| 3 | Tehnician Filter dropdown | `11854:24452` | link 1 | yes (rendered) | FINAL Lead Technician dropdown - "Search technician" box, name list, Clear selection. |
| 4 | Advisor Filter dropdown | `11854:24553` | link 1 | yes (rendered) | FINAL Service Advisor dropdown - "Search advisor" box, name list, Clear selection. |
| 5 | Work order filters default | `11854:24657` | link 1 | yes (rendered) | FINAL desktop default: tab row (All, Estimates, Completed, My Work Orders) and five filter buttons all in the unselected state; toolbar has Search, a filter icon, a columns icon and New Work Order. |
| 6 | Estimates | `11972:32318` | link 1 | yes (rendered) | FINAL desktop Estimates tab: the Status button is GREYED OUT and pre-filled reading "Status: Estimate"; the other four buttons stay normal. |
| 7 | Work order filters default (collapsed bar) | `11854:25927` | link 1 | yes (rendered) | FINAL desktop with the filter bar COLLAPSED and no filters applied - no filter buttons visible, table starts higher. |
| 8 | Work order filters selected | `11854:26246` | link 1 | yes (rendered) | FINAL desktop with filters APPLIED: Status button is blue/active showing "Status: Estimate, In progress, Approved…" and a Clear filters link appears. |
| 9 | Work order filters selected (collapsed bar) | `11854:26564` | link 1 | yes (from 2026-07-17 capture) | FINAL desktop with filters applied AND the bar collapsed - filter buttons hidden while the list stays filtered. |
| 10 | Mobile | `11857:31046` | link 1 | yes (from 2026-07-17 capture) | FINAL mobile Work Orders list - work orders shown as cards. |
| 11 | Search Filled | `12867:12201` | link 1 | **NO — rate limit** | FINAL mobile with the toolbar SEARCH box expanded and text typed in; six filter buttons (All Filters + the five filters) below the tab row; a sort button sits next to the search box. |
| 12 | All Filters | `11884:13689` | link 1 | yes (from 2026-07-17 capture) | Mobile "All Filters" bottom sheet - every filter listed as an expandable row. |
| 13 | Status | `11884:13719` | link 1 | yes (from 2026-07-17 capture) | Mobile Status filter sheet. |
| 14 | Status only | `11884:21065` | link 1 | yes (from 2026-07-17 capture) | Mobile Status sheet, Status only. |
| 15 | Status | `11884:16160` | link 1 | yes (from 2026-07-17 capture) | Mobile Status sheet (second version). |
| 16 | Asset on site | `11884:15582` | link 1 | yes (from 2026-07-17 capture) | Mobile Asset on site sheet - Yes / No. |
| 17 | Customer | `11884:13940` | link 1 | yes (from 2026-07-17 capture) | Mobile Customer sheet - search plus list. |
| 18 | Customer only | `11884:21271` | link 1 | yes (from 2026-07-17 capture) | Mobile Customer sheet, Customer only. |
| 19 | Customer selected 1 | `11884:16695` | link 1 | yes (from 2026-07-17 capture) | Mobile Customer sheet with one customer chosen. |
| 20 | Customer Selected 2 | `11884:16383` | link 1 | yes (from 2026-07-17 capture) | Mobile Customer sheet with several customers chosen (removable tags). |
| 21 | Technician | `11884:14296` | link 1 | yes (from 2026-07-17 capture) | Mobile Lead Technician sheet - search plus list. |
| 22 | Advisor | `11884:14811` | link 1 | yes (from 2026-07-17 capture) | Mobile Service Advisor sheet - search plus list. |
| 23 | Customer dropdown selected | `11854:19595` | link 1 | yes (from 2026-07-17 capture) | FINAL Customer dropdown with customers selected - chosen names shown as removable tags above the list, Clear selection. |
| 24 | Customer dropdown default | `11842:14236` | link 1 | yes (from 2026-07-17 capture) | FINAL Customer dropdown, nothing selected - "Search customer" box, customer list, Clear selection. |
| 25 | Asset on site | `11880:12460` | link 1 | yes (from 2026-07-17 capture) | Asset on site dropdown - exactly two options, Yes and No, plus Clear selection. |

### Filters — 5 boards

| # | Board name | Figma node | From link | PNG in `frames/` | What it shows |
|---|---|---|---|---|---|
| 1 | Mobile | `11884:20807` | link 1 | yes (from 2026-07-17 capture) | FINAL mobile filter row - All Filters button first, then the five filter buttons in a side-scrolling row; sort button in the toolbar. |
| 2 | Mobile | `12141:19858` | link 1 | **NO — rate limit** | EARLY mobile exploration with different wording - tabs read "Estimates / Work Orders / Completed" and the filter buttons read "By Status", "My work orders", "Asset here?". Superseded by the final mobile boards. |
| 3 | Mobile | `11884:15901` | link 1 | **NO — rate limit** | FINAL mobile filter row (duplicate board) - All Filters plus the five filter buttons, sort button in the toolbar. |
| 4 | Customer v1 | `11842:14069` | link 1 | **NO — rate limit** | Earlier Customer dropdown version ("Customer v1") - search box, customer list, Clear selection. |
| 5 | Customer v1 selected | `11842:16879` | link 1 | **NO — rate limit** | Earlier Customer dropdown version with customers selected as removable tags. |

### Sorting Work In Progress — 4 boards

| # | Board name | Figma node | From link | PNG in `frames/` | What it shows |
|---|---|---|---|---|---|
| 1 | Step 1 | `11985:9686` | link 1 | **NO — rate limit** | SORTING (marked Work In Progress) step 1 - the normal filter bar with a sort arrow shown on the Status column heading; a sort button sits in the toolbar. |
| 2 | Step 2 | `11985:10428` | link 1 | **NO — rate limit** | SORTING step 2 - a menu item appears, starting the sort flow. |
| 3 | Step 3 | `11985:11259` | link 1 | **NO — rate limit** | SORTING step 3 - a "Sort dropdown" panel opens under the bar with ONE sort row: a field box reading "Status", a direction box reading "Ascending", and the actions "Add Sort" and "Delete sort". |
| 4 | Step 4 | `11985:13334` | link 1 | **NO — rate limit** | SORTING step 4 - the same panel with TWO stacked sort rows (Status Ascending, then WO Number Ascending) = sorting by more than one column, with "Delete sort". |

### Components — 3 boards

| # | Board name | Figma node | From link | PNG in `frames/` | What it shows |
|---|---|---|---|---|---|
| 1 | Filters | `11829:2935` | link 1 | **NO — rate limit** | COMPONENT: the filter button itself, with its four looks - Default, Hover, Selected, Disabled. |
| 2 | Button | `11829:8908` | links 1+4 | **NO — rate limit** | COMPONENT: the in-page toolbar SEARCH box (named "Button" in Figma), with four looks - Default ("Search"), Hover, Selected ("Type to search"), Filled (text typed in). |
| 3 | Line 3 | `11829:8920` | link 1 | **NO — rate limit** | COMPONENT: a small divider line, two variants (styling only). |

### Parts Explorations 20.4.2026 — 9 boards

| # | Board name | Figma node | From link | PNG in `frames/` | What it shows |
|---|---|---|---|---|---|
| 1 | Inventory | `11894:21846` | links 1+2 | yes (from 2026-07-17 capture) | Parts > Inventory page with its filter buttons. |
| 2 | Part Sales | `11902:8517` | links 1+2 | yes (from 2026-07-17 capture) | Parts > Part Sales page with its filter buttons. |
| 3 | Catalog | `11902:9736` | links 1+2 | yes (from 2026-07-17 capture) | Parts > Catalog page with its filter buttons. |
| 4 | Returns | `11902:9852` | links 1+2 | yes (from 2026-07-17 capture) | Parts > Returns page (Returns tab selected) with its filter buttons. |
| 5 | Credits | `11903:10067` | links 1+2 | yes (from 2026-07-17 capture) | Parts > Returns page, Credits tab selected, with its filter buttons. |
| 6 | Purchase Orders | `11903:10188` | links 1+2 | yes (from 2026-07-17 capture) | Parts > Purchase Orders page with its filter buttons. |
| 7 | Vendor Invoices | `11903:10312` | links 1+2 | yes (from 2026-07-17 capture) | Parts > Vendor Invoices page with its filter buttons. |
| 8 | Vendors | `11903:10461` | links 1+2 | yes (from 2026-07-17 capture) | Parts > Vendors list page with its filter buttons. |
| 9 | Part type | `11902:9973` | links 1+2 | yes (from 2026-07-17 capture) | Parts > Part Type dropdown - Core / Non Core / Clear selection. |

### Reports Explorations 21.4.2026 — 23 boards

| # | Board name | Figma node | From link | PNG in `frames/` | What it shows |
|---|---|---|---|---|---|
| 1 | Timesheet Activities | `11906:12519` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Staff, Date, Status, Modified by. |
| 2 | Timesheets | `11984:9560` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Employee, Date. |
| 3 | A/R Aging Summary | `11955:31691` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Customer, Date. |
| 4 | A/P Aging Summary | `11955:32006` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Vendor, Date. |
| 5 | A/R Aging Detail | `11955:31802` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Customer, Date, Location, Transaction Type. |
| 6 | A/P Aging Detail | `11955:32097` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Vendor, Date, Location, Transaction Type. |
| 7 | A/R Aging Collection | `11955:31901` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Customer, Date, Location, Transaction Type. |
| 8 | Notes | `11982:9225` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Author, Date, Mention. |
| 9 | Reminders | `11982:9338` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Date. |
| 10 | A/P Unpaid Invoices | `11955:32215` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Vendor, Date, Location, Transaction Type. |
| 11 | Shop Efficiency | `11955:30951` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Date. |
| 12 | Work In Progress | `11955:31355` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Status, Date, Customer. |
| 13 | Sales Follow Up | `11984:9457` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Customer, Date, Contact. |
| 14 | Sales Tax (Collected) | `11955:31458` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Date, Invoice Status, Customer. View tabs: Collected, All Tax Rates. |
| 15 | Sales Tax (All Tax Rates) | `11955:31573` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Invoice Status. View tabs: Collected, All Tax Rates. |
| 16 | Advisor Analysis | `11955:30786` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Customer, Date, Advisor. |
| 17 | Technician Efficiency (Invoiced) | `11955:30653` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Customer, Technician, Date. View tabs: Invoiced, Completed. |
| 18 | IBS Batch Transactions | `11974:33068` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Customer, Date, Status. View tabs: Ready To Send, Sent, Payments. |
| 19 | Quickbooks Unexported Items | `11981:8749` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Customer, Date, Type. View tabs: Customers (63), Vendors (19), Journal Entries (4). |
| 20 | Quickbooks Unexported Items | `11982:8879` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Vendor, Date, Type. View tabs: Customers (63), Vendors (19), Journal Entries (4). |
| 21 | Quickbooks Unexported Items | `11982:8998` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: User, Date, Type. View tabs: Customers (63), Vendors (19), Journal Entries (4). |
| 22 | Technician Efficiency (Completed) | `11955:31069` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Customer, Technician, Date. View tabs: Invoiced, Completed. |
| 23 | Sales | `11951:30535` | links 1+3 | yes (from 2026-07-17 capture) | Report/list page. Filter buttons: Customer, Date. |

---

## 4. Design facts worth keeping (exact wording from the design)

These are read straight from the design source, so they are safe to use for
build-accurate wording — but they are **design-pinned, not live-verified** (Rule 12): the
real build must still confirm them.

**Work Orders page (the final 20.4.2026 boards = the baseline)**
- Tab row: **All · Estimates · Completed · My Work Orders**.
- Filter buttons, fixed order: **Status · Customer · Lead Technician · Service Advisor ·
  Asset on site** (five, always all present).
- Toolbar to the right of the page title: **Search**, a **filter icon** (layer name
  `Filter-lines`), a **columns icon** (layer name `Columns`), then the blue **New Work
  Order** button.
- Nine statuses in the Status dropdown: **Estimate, Approved, In progress, Review,
  Complete, Invoiced, Paid, Declined, Imported** + **Clear selection**.
- Dropdown search placeholders: **"Search customer"**, plus name lists for technician and
  advisor; **Asset on site** offers exactly **Yes / No** + **Clear selection**.
- A button with several values chosen shows a shortened label:
  **"Status: Estimate, In progress, Approved…"**.
- **Clear filters** appears at the end of the bar only once something is applied.
- On the **Estimates** tab the Status button uses the component's **Disabled** look and
  reads **"Status: Estimate"**.
- Collapsed bar = **no filter buttons visible at all** while the list stays filtered.

**Mobile (final boards)**
- Filter row = **All Filters** first, then the same five filter buttons, side-scrolling.
- The toolbar has **Search**, a **sort button**, and **New Work Order**.

**The filter button component** (`11829:2935`) has exactly four looks:
**Default · Hover · Selected · Disabled**.

**Parts pages — filter buttons per page**

| Page | Filter buttons |
|---|---|
| Inventory | Bin Location · Category · Supply · Vendor |
| Part Sales | Status · Customer · Created by · Date |
| Catalog | Manufacturer · Category |
| Returns (Returns tab) | Vendor · Category · Part Type |
| Returns (Credits tab) | Vendor · Date · Processed by |
| Purchase Orders | Vendor · Status · Date · Ordered by |
| Vendor Invoices | Vendor · Invoice date · Date received · Received by |
| Vendors | Vendor · State/Province |
| Part Type dropdown | Core · Non Core · Clear selection |

**Reports — filter buttons per report**

| Report (view tabs) | Filter buttons |
|---|---|
| Timesheet Activities | Staff · Date · Status · Modified by |
| Timesheets (Payroll) | Employee · Date |
| Sales | Customer · Date |
| Technician Efficiency (Invoiced / Completed) | Customer · Technician · Date (same on both tabs) |
| Advisor Analysis | Customer · Date · Advisor |
| Shop Efficiency | Date |
| Work In Progress | Status · Date · Customer |
| Sales Follow Up | Customer · Date · Contact |
| Sales Tax (Collected) | Date · Invoice Status · Customer |
| Sales Tax (All Tax Rates) | Invoice Status |
| A/R Aging Summary | Customer · Date |
| A/R Aging Detail | Customer · Date · Location · Transaction Type |
| A/R Aging Collection | Customer · Date · Location · Transaction Type |
| A/P Aging Summary | Vendor · Date |
| A/P Aging Detail | Vendor · Date · Location · Transaction Type |
| A/P Unpaid Invoices | Vendor · Date · Location · Transaction Type |
| Notes | Author · Date · Mention |
| Reminders | Date |
| IBS Batch Transactions (Ready To Send / Sent / Payments) | Customer · Date · Status |
| Quickbooks Unexported Items — Customers tab | Customer · Date · Type |
| Quickbooks Unexported Items — Vendors tab | Vendor · Date · Type |
| Quickbooks Unexported Items — Journal Entries tab | User · Date · Type |

These match what FLT-PARTS-01 and FLT-RPTS-01 already say, so those two cases are
confirmed correct against the design.

---

## 5. DESIGN vs CASES — what the designs show that our cases do not

**No cases were changed.** This is a flag list only. Our current Filters suite = **110
active cases** (79 in TestRail from C29557–C29635 plus the newer C388xx additions, and 16
still without C-IDs).

### 5.1 BIG GAP — Sorting is designed but has zero test coverage

The Filters page has a whole section named **"Sorting (Work In Progress)"** (4 boards:
`11985:9686`, `11985:10428`, `11985:11259`, `11985:13334`). It designs a **Sort dropdown**
panel that opens from the filter-bar area, containing:

- a **field box** (values seen: **Status**, **WO Number**),
- a **direction box** (value seen: **Ascending**),
- an **"Add Sort"** action and a **"Delete sort"** action,
- and step 4 shows **two stacked sort rows at once** = sorting by more than one column.

A **sort button** also appears in the toolbar of the **final** mobile boards
(`11884:20807`, `11884:15901`, `12867:12201`) and on two **Reports** boards (**Notes**,
**Reminders**) — i.e. it is not confined to the "Work In Progress" section.

**Our suite has no sorting case at all** (no FLT-SORT area exists). The section is
labelled *Work In Progress* in Figma, so this is a **scope question for Branko, not an
authoring instruction**: *is sorting (single + multi-level, plus the mobile sort button)
part of the Filters release we are testing?* If yes, it needs a new case area. Recommend
adding it to the next Branko question sheet.

### 5.2 Toolbar controls with no case

- **Columns icon** (`Columns`) sits in the Work Orders toolbar next to the filter icon on
  every final desktop board. No case covers a column chooser. Likely outside Filters scope
  — confirm with Branko rather than assume.
- **Mobile sort button** — see 5.1. FLT-MOB-01 (C29621) describes the mobile chip row but
  does not mention the sort button that the same board shows.

### 5.3 Possible wording correction — "funnel button"

FLT-COLL-01 (C29601) and FLT-COLL-04 (C29604) call the collapse control the **"funnel
button"**. In the design the icon layer is named **`Filter-lines`** (a lines/sliders style
filter icon), not a funnel. The control has no text label, so this is a description rather
than a build label — but per Standing Rule 9 the wording should match what a tester
actually sees. **Flag only:** confirm the icon shape on the live build before touching
C29601/C29604.

### 5.4 Filter-button "Hover" look has no case

The button component ships four looks — Default, Hover, Selected, Disabled. We cover
Default (FLT-BAR-02 / C29558), Selected (FLT-CHIP-01 / C29595) and Disabled (FLT-TAB-02 /
C29609 and FLT-TAB-03 / C29610). **Hover is uncovered.** Low value — noted for
completeness, not recommended as a new case.

### 5.5 Design confirms cases (no change needed)

- **FLT-TAB-02 (C29609)** — the Estimates board really does use the **Disabled** button
  look with the label **"Status: Estimate"**. Case is right.
- **FLT-CHIP-02 (C29596)** — the shortened multi-value label
  **"Status: Estimate, In progress, Approved…"** is exactly what the design shows.
- **FLT-COLL-01 (C29601)** — the collapsed boards show **no** filter buttons at all.
- **FLT-BAR-02 (C29558)** — five buttons, fixed order, always present.
- **FLT-ASSET-01 (C29589)** — Asset on site has exactly **Yes / No** + Clear selection.
- **FLT-STAT-01 (C29560)** — nine statuses + Clear selection.
- **FLT-PARTS-01** and **FLT-RPTS-01** (Parts/Reports button lists) — every page and
  report matches the design tables in section 4 above.

### 5.6 Superseded explorations — do NOT author from these (wording traps)

The page keeps older explorations alongside the final boards. A future author could easily
mistake them for the spec:

- **"+ Filter" add-a-filter button** (14.4.2026 steps 4/5/6 and the two "Filter menu"
  popups): the bar starts with fewer buttons and you add more. **Dropped** — the final
  boards always show all five. Confirms FLT-BAR-02 (C29558); do not author an add-filter
  flow.
- **"My Work Orders" as a filter button** (14.4.2026 boards). In the final design it is a
  **tab**, which is what FLT-TAB-04 (C29611) tests.
- **Early mobile board `12141:19858`** uses different wording — tabs *"Estimates / Work
  Orders / Completed"* and buttons *"By Status"*, *"My work orders"*, *"Asset here?"*.
  **None of those labels are final.** Our mobile cases correctly use *All Filters* + the
  five real names.
- **"Customer v1" / "Customer v1 selected"** — an earlier version of the Customer
  dropdown; behaves the same as the final one (search + list + Clear selection + tags).

### 5.7 Still open (unchanged by this pass)

- **FLT-SRCH-01…09** (no C-IDs) — no ⌘K palette board exists on the Filters page (see the
  correction in section 2). Ownership still pending Branko's confirmation; per the
  2026-07-31 ruling they are **not** to be deleted until he confirms.
- Parts/Reports **behaviour** (option lists, multi-select, immediate apply, persistence per
  page) is still design-silent and still waits on Branko's PRD — the design pins only the
  button names, exactly as the existing cases say.

---

## 6. Honest limits of this pass

1. **12 of 85 boards have no PNG yet** (listed in section 3) because the Figma image
   render endpoint is rate-limited for ~10.5 hours. Their descriptions come from the design
   source's own text layers, component variant names and layer names — accurate, but I have
   **not seen those 12 rendered**. The four **Sorting** boards are among them, so the exact
   visual layout of the Sort dropdown is described from its layers ("Sort dropdown", field
   box, direction box, "Add Sort", "Delete sort"), not from a picture.
2. **49 of the 73 PNGs were copied from our 2026-07-17 export** of the same node ids rather
   than re-rendered today. Same file, same nodes; if the design has been edited since
   2026-07-17 those images could be stale. Re-run `tools/fetch_all.py` after the rate-limit
   reset to refresh them.
3. **Nothing here is live-verified** (Standing Rule 12). All of section 4 is
   design-pinned wording that must still be confirmed on the QA build when Filters lands.
4. **No test case, import, or TestRail record was changed.**
