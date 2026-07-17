# Filters project — Figma design capture (design-notes)

**Project:** ShopView Work Order list filtering redesign ("Filters")
**Figma file:** `DR4gEODShYgJqkozs3mF5q` (Working - ShopView App)
**Figma page:** `11817:27678` — **"Filters"**
**Capture date:** 2026-07-17 (Figma REST API, PNG `scale=2` for every render)
**Evidence:** all rendered PNGs committed under `build/filters/design-screens/`
(filename pattern `<group>_<frame-name>_<node-id>.png`; node id has `:` → `-`).

> Scope note: the task originally pointed at section `11854:23562`
> ("Work Order Explorations 20.4.2026", 27 direct children). Per the user's
> "~100 pictures" correction, the capture was widened to the ENTIRE "Filters"
> page: all 5 sections + 4 page-level frames. The full inventory is below.

---

## A. Complete inventory — "Filters" page (all depths)

Page `11817:27678` "Filters" has **10 direct children**: 5 SECTIONs, 5 top-level
FRAMEs (4 exploration/dropdown frames + counting below). Every child of every
section was enumerated; nested children of individual screen frames are UI
internals (menu rows, table cells, "Content" wrappers), NOT separate designs —
the distinct visual designs are the section children listed here.

**Totals: 96 nodes = 81 design FRAMEs + 3 COMPONENT_SETs (10 variants inside)
+ 12 tiny label/divider SECTIONs (empty, pure strips).**

### A.1 Section 11854:23562 — "Work Order Explorations 20.4.2026" (27 children)

| # | Node id | Name | Type | Size | Rendered |
|---|---------|------|------|------|----------|
| 1 | 11854:24194 | Status dropdown selected | FRAME | 260x432 | yes |
| 2 | 11854:24280 | Status dropdown | FRAME | 260x432 | yes |
| 3 | 11854:24452 | Tehnician Filter dropdown *(typo)* | FRAME | 260x490 | yes |
| 4 | 11854:24553 | Advisor Filter dropdown | FRAME | 260x490 | yes |
| 5 | 11854:24657 | Work order filters default | FRAME | 1728x1046 | yes |
| 6 | 11972:32318 | Estimates | FRAME | 1728x1046 | yes |
| 7 | 11854:25927 | Work order filters default (collapsed bar) | FRAME | 1728x1046 | yes |
| 8 | 11854:26246 | Work order filters selected | FRAME | 1728x1046 | yes |
| 9 | 11854:26564 | Work order filters selected (collapsed bar) | FRAME | 1728x1046 | yes |
| 10 | 11857:31046 | Mobile | FRAME | 402x874 | yes |
| 11 | 11884:20807 | Mobile (chips scroll-arrow variant) | FRAME | 402x874 | yes |
| 12 | 11884:13689 | All Filters | FRAME | 402x800 | yes |
| 13 | 11884:13719 | Status | FRAME | 402x800 | yes |
| 14 | 11884:21065 | Status only | FRAME | 402x800 | yes |
| 15 | 11884:16160 | Status (selected, "All Filters (1)") | FRAME | 402x800 | yes |
| 16 | 11884:15582 | Asset on site | FRAME | 402x800 | yes |
| 17 | 11884:13940 | Customer | FRAME | 402x800 | yes |
| 18 | 11884:21271 | Customer only | FRAME | 402x800 | yes |
| 19 | 11884:16695 | Customer selected 1 | FRAME | 402x800 | yes |
| 20 | 11884:16383 | Customer Selected 2 | FRAME | 402x800 | yes |
| 21 | 11884:14296 | Technician | FRAME | 402x800 | yes |
| 22 | 11884:14811 | Advisor | FRAME | 402x800 | yes |
| 23 | 11854:19595 | Customer dropdown selected | FRAME | 260x556 | yes |
| 24 | 11842:14236 | Customer dropdown default | FRAME | 260x490 | yes |
| 25 | 11880:12460 | Asset on site (dropdown) | FRAME | 260x138 | yes |
| 26 | 11884:15787 | Mobile | SECTION (label strip) | 3995x60 | yes (blue strip, no content) |
| 27 | 11884:15788 | Web | SECTION (label strip) | 6213x60 | yes (green strip, no content) |

### A.2 Section 11824:3241 — "Work Order Explorations 14.4.2026" (19 children)

| # | Node id | Name | Type | Size | Rendered |
|---|---------|------|------|------|----------|
| 1 | 11823:8024 | Step 1 | FRAME | 1728x1046 | RENDER-STATUS |
| 2 | 11829:2235 | WO - Separate Cards | FRAME | 1728x1046 | RENDER-STATUS |
| 3 | 11824:2812 | Menu selected | FRAME | 260x432 | RENDER-STATUS |
| 4 | 11824:3067 | Menu default | FRAME | 260x432 | RENDER-STATUS |
| 5 | 11842:13915 | Menu default (2nd copy) | FRAME | 260x432 | RENDER-STATUS |
| 6 | 11839:12739 | Tehnician *(typo)* | FRAME | 260x490 | RENDER-STATUS |
| 7 | 11839:12909 | Advisor | FRAME | 260x490 | RENDER-STATUS |
| 8 | 11842:2983 | V1 without title | SECTION (label strip, empty) | 2395x120 | RENDER-STATUS |
| 9 | 11842:2984 | V2 with title | SECTION (label strip, empty) | 3584x120 | RENDER-STATUS |
| 10 | 11842:18586 | V3 Optional | SECTION (label strip, empty) | 3584x120 | RENDER-STATUS |
| 11 | 11842:2985 | Step 2 | FRAME | 1728x1046 | RENDER-STATUS |
| 12 | 11842:17150 | Step 5 | FRAME | 1728x1046 | RENDER-STATUS |
| 13 | 11842:18756 | Step 6 | FRAME | 1728x1046 | RENDER-STATUS |
| 14 | 11842:17878 | Step 4 | FRAME | 1728x1046 | RENDER-STATUS |
| 15 | 11842:12321 | Step 3 | FRAME | 1728x1046 | RENDER-STATUS |
| 16 | 11842:3301 | WO - Separate Cards (2nd) | FRAME | 1728x1046 | RENDER-STATUS |
| 17 | 11842:13036 | WO - Separate Cards (3rd) | FRAME | 1728x1046 | RENDER-STATUS |
| 18 | 11842:18588 | Filter menu | FRAME | 260x92 | RENDER-STATUS |
| 19 | 11842:19476 | Filter menu (1-item) | FRAME | 260x50 | RENDER-STATUS |

### A.3 Section 11985:9685 — "Sorting (Work In Progress)" (4 children)

| # | Node id | Name | Type | Size | Rendered |
|---|---------|------|------|------|----------|
| 1 | 11985:9686 | Step 1 | FRAME | 1728x1046 | RENDER-STATUS |
| 2 | 11985:10428 | Step 2 | FRAME | 1728x1046 | RENDER-STATUS |
| 3 | 11985:11259 | Step 3 | FRAME | 1728x1046 | RENDER-STATUS |
| 4 | 11985:13334 | Step 4 | FRAME | 1728x1046 | RENDER-STATUS |

### A.4 Section 11829:2920 — "Components" (3 children, 10 variants)

| # | Node id | Name | Type | Variants | Rendered |
|---|---------|------|------|----------|----------|
| 1 | 11829:2935 | Filters | COMPONENT_SET | Property 1 = Default / Hover / Selected / Disabled (11829:2934, 11829:2936, 11829:2942, 11972:33057) | RENDER-STATUS |
| 2 | 11829:8908 | Button | COMPONENT_SET | Property 1 = Default / Hover / Selected / Filled (11829:8907, 11829:8909, 11829:8912, 11829:8947) | RENDER-STATUS |
| 3 | 11829:8920 | Line 3 | COMPONENT_SET | Property 1 = Default / Variant2 (11829:8919, 11829:8921) — zero-width divider strokes | RENDER-STATUS |

### A.5 Section 11884:16885 — "Parts Exploarations 20.4.2026" *(section-name typo)* (9 children)

| # | Node id | Name | Type | Size | Rendered |
|---|---------|------|------|------|----------|
| 1 | 11894:21846 | Inventory | FRAME | 1512x982 | RENDER-STATUS |
| 2 | 11902:8517 | Part Sales | FRAME | 1512x982 | RENDER-STATUS |
| 3 | 11902:9736 | Catalog | FRAME | 1512x982 | RENDER-STATUS |
| 4 | 11902:9852 | Returns | FRAME | 1512x982 | RENDER-STATUS |
| 5 | 11903:10067 | Credits | FRAME | 1512x982 | RENDER-STATUS |
| 6 | 11903:10188 | Purchase Orders | FRAME | 1512x982 | RENDER-STATUS |
| 7 | 11903:10312 | Vendor Invoices | FRAME | 1512x982 | RENDER-STATUS |
| 8 | 11903:10461 | Vendor Invoices (actually Vendors list) | FRAME | 1512x982 | RENDER-STATUS |
| 9 | 11902:9973 | Part type (dropdown) | FRAME | 260x138 | RENDER-STATUS |

### A.6 Section 11903:10573 — "Reports Exploarations 21.4.2026" *(section-name typo)* (30 children)

| # | Node id | Name | Type | Size | Rendered |
|---|---------|------|------|------|----------|
| 1 | 11906:12519 | Timesheet Activities | FRAME | 1512x982 | RENDER-STATUS |
| 2 | 11984:9560 | Timesheets (Payroll Timesheet) | FRAME | 1512x982 | RENDER-STATUS |
| 3 | 11955:31691 | A/R Aging Summary | FRAME | 1512x982 | RENDER-STATUS |
| 4 | 11955:32006 | A/P Aging Summary | FRAME | 1512x982 | RENDER-STATUS |
| 5 | 11955:31802 | A/R Aging Detail | FRAME | 1512x982 | RENDER-STATUS |
| 6 | 11955:32097 | A/P Aging Detail | FRAME | 1512x982 | RENDER-STATUS |
| 7 | 11955:31901 | A/R Aging Collection | FRAME | 1512x982 | RENDER-STATUS |
| 8 | 11982:9225 | Notes | FRAME | 1512x982 | RENDER-STATUS |
| 9 | 11982:9338 | Reminders | FRAME | 1512x982 | RENDER-STATUS |
| 10 | 11955:32215 | A/P Unpaid Invoices | FRAME | 1512x982 | RENDER-STATUS |
| 11 | 11955:30951 | Shop Efficiency | FRAME | 1512x982 | RENDER-STATUS |
| 12 | 11955:31355 | Work In Progress | FRAME | 1512x982 | RENDER-STATUS |
| 13 | 11984:9457 | Sales Follow Up | FRAME | 1512x982 | RENDER-STATUS |
| 14 | 11955:31458 | Sales Tax (Collected) | FRAME | 1512x982 | RENDER-STATUS |
| 15 | 11955:31573 | Sales Tax (All Tax Rates) | FRAME | 1512x982 | RENDER-STATUS |
| 16 | 11955:30786 | Advisor Analysis | FRAME | 1512x982 | RENDER-STATUS |
| 17 | 11955:30653 | Technician Efficiency (Invoiced) | FRAME | 1512x982 | RENDER-STATUS |
| 18 | 11974:33068 | IBS Batch Transactions | FRAME | 1512x982 | RENDER-STATUS |
| 19 | 11981:8749 | Quickbooks Unexported Items (Customers tab) | FRAME | 1512x982 | RENDER-STATUS |
| 20 | 11982:8879 | Quickbooks Unexported Items (Vendors tab) | FRAME | 1512x982 | RENDER-STATUS |
| 21 | 11982:8998 | Quickbooks Unexported Items (Journal Entries tab) | FRAME | 1512x982 | RENDER-STATUS |
| 22 | 11955:31069 | Technician Efficiency (Completed) | FRAME | 1512x982 | RENDER-STATUS |
| 23 | 11951:30535 | Sales | FRAME | 1512x982 | RENDER-STATUS |
| 24 | 11984:9454 | Labour | SECTION (label strip, empty) | 3172x104 | RENDER-STATUS |
| 25 | 11984:9672 | Accounts Receivable | SECTION (label strip, empty) | 1512x104 | RENDER-STATUS |
| 26 | 11984:9674 | Accounting | SECTION (label strip, empty) | 4748x104 | RENDER-STATUS |
| 27 | 11984:9673 | Accounts Payable | SECTION (label strip, empty) | 1512x104 | RENDER-STATUS |
| 28 | 11984:9675 | Communications | SECTION (label strip, empty) | 1512x104 | RENDER-STATUS |
| 29 | 11984:9455 | Performance | SECTION (label strip, empty) | 3172x104 | RENDER-STATUS |
| 30 | 11984:9456 | Finance | SECTION (label strip, empty) | 3172x104 | RENDER-STATUS |

### A.7 Page-level frames (4, directly on the "Filters" page)

| # | Node id | Name | Type | Size | Rendered |
|---|---------|------|------|------|----------|
| 1 | 12141:19858 | Mobile (older iteration — "By Status" / "Asset here?" chips) | FRAME | 402x874 | RENDER-STATUS |
| 2 | 11884:15901 | Mobile | FRAME | 402x874 | RENDER-STATUS |
| 3 | 11842:14069 | Customer v1 | FRAME | 260x490 | RENDER-STATUS |
| 4 | 11842:16879 | Customer v1 selected | FRAME | 260x556 | RENDER-STATUS |

---

## B. Per-frame descriptions (exact on-screen labels)

Labels below were extracted from the Figma node text (visible nodes only) and
verified against the rendered PNGs — they are the exact design strings.

### B.1 Work Order Explorations 20.4.2026 (the CURRENT/latest WO-list design set)

**Shared desktop shell (all 1728x1046 frames):** top navigation bar with app
logo, nav items **Work Orders | Schedule | Customers | Parts | Reports**, a
global **Search** field with **⌘ K** shortcut hint, org name **"Heavy Duty"**
and an avatar. Below: view tabs **All | Estimates | Completed | My Work Orders**,
then a toolbar row with a **Search** (magnifier) control, a **filter (funnel)
icon**, a **column/layout toggle icon**, and the primary blue **New Work Order**
button. The WO table columns are, left to right: **On Site | Status | Number |
Customer | Asset | Unit | VIN/Serial # | Progress | Service Advisor | Lead
Tehnician (sic) | Clocked In | Lines | Total Price**. "Status" column header has
a sort arrow (↓). Status values appear as pill badges: **Estimate** (blue
outline), **Declined** (red outline), **Approved** (green outline), **Complete**
(orange outline). "On Site" column shows green (on-site) / red (not-on-site)
house-check icons. Progress column shows a pill: grey **0%**, blue **50% / 75% /
100%**. Pagination: **Previous | 1 | 2 | 3 | ... | 8 | 9 | 10 | Next**.

1. **11854:24657 — Work order filters default** (desktop, expanded filter bar,
   nothing selected). Under the tabs sits the persistent filter-chip bar:
   **Status ⌄ | Customer ⌄ | Lead Technician ⌄ | Service Advisor ⌄ |
   Asset on site ⌄** (each chip has a leading icon: spinner/loader = Status,
   person = Customer, wrench = Lead Technician, headset = Service Advisor,
   truck = Asset on site). No "Clear filters" link is visible when nothing is
   selected (it exists in the layer set but is hidden in this state). Table
   shows mixed Estimate/Declined rows, all 0% progress.
2. **11972:32318 — Estimates** (desktop, "Estimates" tab active). Identical
   shell, but the **Estimates** tab is selected and the Status chip reads
   **"Status: Estimate"** (pre-applied by the tab). Demonstrates: choosing the
   Estimates tab auto-populates the Status filter chip with Estimate.
3. **11854:25927 — Work order filters default (collapsed bar)**. Same default
   state but the filter-chip row is HIDDEN; the funnel **filter icon** in the
   toolbar is shown in an active/highlighted (pressed) state. Demonstrates the
   collapse/expand toggle of the filter bar via the funnel icon; the table
   moves up to reclaim the row.
4. **11854:26246 — Work order filters selected** (desktop, filters applied,
   expanded bar). The Status chip is in the SELECTED (filled/active blue)
   state and reads **"Status: Estimate, In progress, Approved…"** (truncated
   with ellipsis when multiple values are selected). Other chips (Customer,
   Lead Technician, Service Advisor, Asset on site) remain default. A blue
   **Clear filters** link appears at the right end of the chip row. Table rows
   now show Estimate, then Approved, then Complete groups; Complete rows carry
   blue 50%/75%/100% progress pills. Demonstrates multi-select chip label
   composition + Clear filters affordance.
5. **11854:26564 — Work order filters selected (collapsed bar)**. Same
   selected data-state as #4 but with the chip bar collapsed (funnel icon
   active). Demonstrates that applied filters persist while the bar is hidden.
6. **11854:24280 — Status dropdown** (260x432 popover). Checkbox menu with
   options in order: **Estimate, Approved, In progress, Review, Complete,
   Invoiced, Paid, Declined, Imported** — all unchecked — and a footer action
   **Clear selection**. (9 statuses; multi-select checkboxes.)
7. **11854:24194 — Status dropdown selected**. Same menu with **Estimate,
   Approved, In progress, Complete** checked (blue checkboxes); Review,
   Invoiced, Paid, Declined, Imported unchecked; **Clear selection** footer.
8. **11854:24452 — Tehnician Filter dropdown** *(frame name typo)* (260x490).
   Type-ahead popover: focused input with placeholder **"Search technician"**,
   scrollable name list (Savannah Nguyen, Esther Howard, Robert Fox, Bessie
   Cooper, Jenny Wilson, Darlene Robertson, Theresa Webb, Floyd Miles, Annette
   Black), right-edge scrollbar, footer **Clear selection**.
9. **11854:24553 — Advisor Filter dropdown**. Same pattern; placeholder
   **"Search advisor"**; names Cody Fisher, Wade Warren, Courtney Henry,
   Leslie Alexander, Ronald Richards, Jacob Jones, Jane Cooper, Kathryn
   Murphy, Eleanor Pena; footer **Clear selection**.
10. **11842:14236 — Customer dropdown default**. Same pattern; placeholder
    **"Search customer"**; customers Transload Trucking, Hard Rock Industries
    LLC, RF Heavy, Truck Zone, 1st Auto Parts Ltd, Partmaster Ltd, Auckland
    Motors Mitsubishi, Dodson Autospares, Texas Truck And Auto Parts; footer
    **Clear selection**.
11. **11854:19595 — Customer dropdown selected** (260x556, taller). The input
    area becomes a blue-outlined token field containing selected-value chips
    **"Texas Truck And Aut…" ✕**, **"Dodson Autospares" ✕**, **"RF Heavy" ✕**,
    plus a clear-all **(✕)** circle icon at top right of the field and a text
    caret on the next line. In the list, selected entries (RF Heavy, Texas
    Truck And Auto Parts, Dodson Autospares) carry a right-side **✓**
    checkmark. Footer **Clear selection**. Demonstrates: token chips with
    per-chip remove, field-level clear-all, checkmarked list rows.
12. **11880:12460 — Asset on site (dropdown)** (260x138). Minimal menu:
    **Yes**, **No**, footer **Clear selection** (single-choice boolean filter).
13. **11857:31046 — Mobile** (402x874, WO list). Mobile header: logo, Search
    field, time-clock icon, avatar. Tabs **All | Estimates | Completed | My
    Work Orders(cut)**, then a row with **Search**, a sort (↑↓) icon and blue
    **New Work Order** button. Below: horizontally scrollable filter-chip row
    **All Filters (funnel icon) | Status | Customer | Lead …(cut)**. WO cards:
    header **S3-13986** + badges **Approved** (green) and **Over Limit** (red);
    rows **Customer** Transload Trucking, **Asset** Freightliner 114SD,
    **Asset On Site** (toggle OFF), **VIN/Serial** 2GDJG31M3F4523491,
    **Unit** 245. Further cards S2-156 / S1-6 / S1-72 with **Estimate** badges.
14. **11884:20807 — Mobile (chips scroll-arrow variant)**. Identical to #13
    plus a circular **›** (chevron-right) overlay on the chip row's right edge
    — the affordance indicating the chips row scrolls horizontally.
15. **11884:13689 — All Filters** (mobile bottom sheet 402x800). Sheet with
    drag-handle, centered title **All Filters**, close **✕**. Accordion rows
    (icon + label + ⌄): **Status, Customer, Lead Tehnician (sic), Service
    Advisor, Asset on site** — all collapsed. Sticky bottom blue button
    **Apply filters**.
16. **11884:13719 — Status** (mobile sheet, Status expanded, none selected).
    Title **All Filters**; Status accordion open (⌃) revealing the 9 status
    checkboxes (Estimate … Imported) + **Clear selection**; below, collapsed
    **Customer**, **Lead Tehnician (sic)** rows visible; **Apply filters**.
17. **11884:21065 — Status only** (mobile sheet, single-filter variant).
    Title row is **(spinner icon) Status** with close ✕ — no accordion list;
    just the 9 checkboxes + **Clear selection**, and the bottom button reads
    **Apply filter** (singular). Demonstrates the per-filter direct sheet
    (opened from a specific chip rather than All Filters).
18. **11884:16160 — Status (selected)**. As #16 but title **All Filters (1)**
    (applied-filter count), the **Status** accordion header is highlighted
    blue, and **Estimate, Approved, In progress** are checked. **Apply
    filters** bottom button.
19. **11884:15582 — Asset on site** (mobile sheet). All five accordion rows;
    **Asset on site** expanded showing options **Yes / No** + **Clear
    selection**; **Apply filters**.
20. **11884:13940 — Customer** (mobile sheet). **Customer** accordion open:
    focused **"Search customer"** input + customer list (Transload Trucking …
    Texas Truck And Auto Parts); collapsed Lead Tehnician (sic) / Service
    Advisor / Asset on site below; **Apply filters**.
21. **11884:21271 — Customer only** (mobile single-filter sheet). Title
    **(person icon) Customer** + ✕; search input + customer list; **Apply
    filter** (singular).
22. **11884:16695 — Customer selected 1**. As #20 but title **All Filters
    (1)** — state right after applying one filter elsewhere; customer list
    with search input, none tokenised yet.
23. **11884:16383 — Customer Selected 2**. Title **All Filters (2)**;
    Customer accordion opens with token field holding chips **Texas Truck And
    Auto Parts ✕, Dodson Autospares ✕, RF Heavy ✕**; matching list rows show
    **✓**; **Apply filters**. Demonstrates mobile token/multi-select parity
    with the desktop Customer dropdown.
24. **11884:14296 — Technician** (mobile sheet). **Lead Tehnician (sic)**
    accordion open: **"Search technician"** input + technician list (Savannah
    Nguyen … Jacob Jones, Andrew Reynolds, Guy Hawkins); **Apply filters**.
25. **11884:14811 — Advisor** (mobile sheet). **Service Advisor** accordion
    open: **"Search advisor"** input + advisor list (Cody Fisher … Eleanor
    Pena); **Apply filters**.
26. **11884:15787 — "Mobile" SECTION** — pure blue label/divider strip (group
    header for the mobile frames); no UI content.
27. **11884:15788 — "Web" SECTION** — pure green label/divider strip (group
    header for the desktop frames); no UI content.

### B.2 Work Order Explorations 14.4.2026 (EARLIER iteration — superseded by 20.4)

Historical exploration of the same WO-list filter bar; useful to understand
what changed. Same desktop shell and table as B.1 (including the "Lead
Tehnician" column-header typo). Differences from 20.4: the filter chip bar
sits ABOVE the toolbar row in "Step 1" (no All/Estimates/Completed/My Work
Orders tab row in Step 1) and includes **My Work Orders** and **Asset On Site**
as TOGGLE-styled chips; the 20.4 set replaced them with the tab row + an
"Asset on site" dropdown chip. Label sub-sections "V1 without title" /
"V2 with title" / "V3 Optional" mark three chip-bar layout options.

PLACEHOLDER-B2-FRAMES

### B.3 Sorting (Work In Progress) — 4 steps

Desktop WO-list frames exploring column sorting on the same shell.

PLACEHOLDER-B3-FRAMES

### B.4 Components (filter chip / button / divider component sets)

PLACEHOLDER-B4-FRAMES

### B.5 Parts Exploarations 20.4.2026 (filter bar applied to Parts screens)

The same chip-based filter bar pattern propagated to the Parts module list
screens (1512x982 frames, same top nav shell).

PLACEHOLDER-B5-FRAMES

### B.6 Reports Exploarations 21.4.2026 (filter bar applied to Reports screens)

The chip-based filter bar propagated to every Reports list screen (23 report
screens, grouped in the Figma section by label strips: Labour, Accounts
Receivable, Accounts Payable, Accounting, Communications, Performance,
Finance).

PLACEHOLDER-B6-FRAMES

### B.7 Page-level frames (outside any section)

PLACEHOLDER-B7-FRAMES

---

## C. Design typos / anomalies (flag to designer — do NOT codify into cases)

These are DESIGN artifacts to flag to the designer. Per project rule they are
NOT to be codified into test-case wording (cases must use the words the BUILD
shows, verified at VIU time; if the build inherits a typo, flag it as a bug
rather than enshrining it).

1. **"Tehnician" (missing "c") — recurring, in user-facing strings:**
   - Desktop WO table column header **"Lead Tehnician"** (all desktop WO-list
     frames in BOTH the 14.4 and 20.4 sections, and the Sorting frames).
   - Mobile All-Filters sheet row **"Lead Tehnician"** (frames 11884:13689,
     11884:13719, 11884:16160, 11884:15582, 11884:13940, 11884:16695,
     11884:16383, 11884:14296, 11884:14811).
   - Frame names: "Tehnician Filter dropdown" (11854:24452), "Tehnician"
     (11839:12739) — layer names only, not UI text.
   - NOTE the inconsistency *within the same designs*: the filter chip and the
     accordion in some frames spell **"Lead Technician"** correctly (desktop
     chip bar, mobile chip row) while the table column header and the mobile
     accordion rows spell "Tehnician". The build must settle on "Technician".
2. **"Exploarations" (extra "a")** — section titles "Parts Exploarations
   20.4.2026" (11884:16885) and "Reports Exploarations 21.4.2026"
   (11903:10573). Design-organization typo only (not product UI).
3. **Duplicate frame names within the 20.4 section** — two frames named
   "Status" (11884:13719 vs 11884:16160) and two named "Asset on site"
   (11884:15582 mobile sheet vs 11880:12460 desktop dropdown); also two
   "Mobile" frames (11857:31046, 11884:20807) plus two more page-level
   "Mobile" frames (12141:19858, 11884:15901). Disambiguated by node id in
   the committed PNG filenames.
4. **"Vendor Invoices" naming slip (Parts section)** — frame 11903:10461 is
   NAMED "Vendor Invoices" but its content is the **Vendors** list screen
   (heading "Vendors", button "New Vendor").
5. **Placeholder/sample-data artifacts:** every desktop WO row repeats the
   same VIN **1FD0W5HY2EEA05499**; mobile cards repeat VIN 2GDJG31M3F4523491
   and Unit 245; page numbers/pagination are static (1..10). Sample data only
   — not behavior.
6. **Hidden-layer residue in the Figma file:** the filter dropdown/menu
   components contain hidden text layers ("By ownership", "Administrator",
   "By owner", "Find an owner", per-row count badges "10") and the toggle rows
   in the 14.4 "Step 1"/"WO - Separate Cards" frames contain hidden text "Save
   my login details for next time." — invisible in renders; ignore for cases
   (excluded from the label extraction above via visibility filtering).
7. **"Estimates" tab frame (11972:32318):** the pre-applied chip **"Status:
   Estimate"** is shown in the pale/disabled chip style (matches the Filters
   component's "Disabled" variant), implying the tab-driven status filter is
   shown but not user-editable while the Estimates tab is active — worth a PO
   /designer confirmation at VIU time.

---

## D. Completeness statement

PLACEHOLDER-SECTION-D
