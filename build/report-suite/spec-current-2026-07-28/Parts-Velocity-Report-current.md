# Parts Velocity Report

> **VERBATIM CAPTURE — current Confluence spec**
> - pageId: 620888066
> - Page title: Parts Velocity Report
> - Current version: v3
> - Last updated: 2026-07-17T03:41:45.057Z by Chris Ward
> - Confluence space: ~712020aa00b8d6a71f4259891982a304227c20 (Chris Ward)
> - Captured: 2026-07-28 (REST storage-format -> markdown via html2text, unicode-preserving)

---

|   
---|---  
**Epic**|  TBD  
**Owner**|  TBD  
**Status**|  In review — 2026-07-16  
**Branch**|  TBD  
  
# Parts Velocity Report

## 1. Business Case

Parts managers have no quick way to see which stocked parts are driving sales versus sitting idle, and no visibility into how often special-order (catalogue) parts are being sourced for jobs. Without this visibility, reorder decisions rely on gut feel: fast-moving parts stock out, slow-moving parts tie up capital on the shelf, and frequently-ordered catalogue items that could be stocked go unnoticed. The Parts Velocity report ranks each part by its sales activity — across both inventory-held and special-order parts — and pairs that movement signal with per-part profitability (revenue, cost, margin), giving managers a single screen to identify what to stock more aggressively, what to monitor, which catalogue items are ordered often enough to consider carrying, and which parts actually make money.

A secondary goal is consistency: the report uses the same clean reporting layout as the rest of the application's reports, so users don't have to re-learn the screen when they move between reports.

* * *

## 2. Feature Overview

### Core ShopView

  * A report under **Reports → Parts** shows all parts (inventory and catalogue) ranked by their sales activity over a selected date range. The **Parts** section under Reports is new — this feature introduces it (see S1-R1).

  * Parts are split into two types: **Inventory** (stocked on the shelf, tracked in the inventory system) and **Catalogue** (special-order parts sourced from a vendor on a per-job basis).

  * On load, rows are ranked by **Demand** (descending) — the part's transaction frequency — so the most-active parts surface first. The user can re-sort by any column.

  * Each row carries both **movement** metrics (Units Sold, Units Returned, Sold via WO, Sold via Parts Sale, Demand, Last Sale) and **profitability** metrics (**Unit Cost, Sell Price, Revenue, Margin, Margin %**), plus inventory-stocking metrics (On Hand, Turns / Yr, Min, Max) for inventory parts.

  * A **Type** filter lets users view both types together, or drill into one type at a time. The report also filters by date range, category, vendor, bin location, and **location** (one, several, or all of the locations the user has access to), plus a toolbar search across part number and description.

  * Catalogue rows always show `—` for inventory-only metrics (On Hand, Turns / Yr, Min, Max) because catalogue parts are not held in inventory.

  * Users can show or hide individual columns from a column picker. The report **remembers the user's filters, column selection, and sort** in the browser and restores them on the next visit; those saved values take precedence over the first-visit defaults.

  * The report can be exported as CSV or PDF. Both exports reflect the filters, columns, and sort order active at the time of export.

  * The report uses the application's standard two-tone report layout — white card surfaces on a soft blue-grey backdrop, edge-to-edge table.

  * The report is **server-paginated** : filtering, sorting, and paging are all resolved on the server, which returns one page of rows at a time. This is what keeps the report responsive at scale — an organization can carry 50–60k parts, multiplied across locations.




### Out of Scope

  * Editing any part attribute (including Min and Max) from this report. Min and Max are shown as **read-only** display columns; there is no edit/slide-over in this version.

  * Movement-group (A/B/C/D) classification — no group labels, summary cards, or threshold settings. (Demand frequency is calculated and used as the default ranking, but no A/B/C/D banding is exposed.)

  * Creating or placing purchase orders from this report.

  * Real-time inventory sync or webhook-driven updates; the report reflects data as of the last page load or filter change.

  * An **" All Time"** date range. The report always operates over a bounded date window, so an unbounded "All Time" option is deliberately not offered here; the date range is always one of the bounded options in S2-R2. _(Note: "Last Sale" is measured over all-time history regardless — see §4 — but that is a per-part lookback calculation, not a selectable date range.)_




* * *

## 3. Key Decisions

  * **Demand frequency is the ranking metric.** The report ranks parts by how many separate transactions each part appeared on (its **Demand** count) in the selected date range — not by revenue or cost. This ranks parts by consistency of movement, a more reliable reorder signal than dollar volume, and stays stable against price changes and promotions. The on-screen primary sales quantity is **Units Sold** , but the default row order is **Demand** , descending.

  * **Profitability columns come from billed work-order lines, netting reversals.** **Revenue, Margin, Unit Cost, Sell Price, and Margin %** are all derived from the billed part lines on the invoiced/paid work orders (and vendor part requests) in the window, and a reversed/voided sale is **excluded** from them — consistent with Units Sold, which also nets reversals (S5-R1/S5-R4b). This is a **different basis** from **Units Sold** in one respect: Units Sold counts inventory stock decrements (movement), while the profitability columns sum the billed part-line quantities/amounts. The two can therefore differ for the same inventory row (e.g., a drop-ship or negative-stock sale bills without a matching stock decrement), which is expected (S5-R7) and is called out to the user by the Units Sold tooltip (S3-R6). For catalogue rows the two share one basis (the vendor request quantity), so they do not diverge.

  * **Catalogue rows come from vendor-sourced part requests.** Catalogue (special-order) parts are identified as vendor-sourced parts requested on invoiced or paid work orders. Each catalogue part appears as a single report row, merged across the selected locations (S3-R1a).

  * **Inventory rows are per location.** An inventory part is a per-location stock record, so the same part number stocked at two selected locations produces **two** inventory rows — one per location, each with that location's own On Hand / Min / Max (S3-R1a). Inventory On Hand / Min / Max are never summed across locations.

  * **Catalogue inventory metrics are always null.** Catalogue parts are not stocked, so On Hand, Turns / Yr, Min, and Max are not applicable and always render as `—`.

  * **Units Returned counts initiated returns, net of cancellations.** It is sourced from part-return records — created by a work-order part return or a parts-sale credit, not from invoice voids: each return adds its quantity; each cancelled return is excluded. Counted the same way for both inventory and catalogue parts. Core-charge returns are excluded.

  * **Core parts are excluded** from both the inventory and catalogue result sets (S5-R1, S5-R2).

  * **A part is shown when it has any real in-window activity or stock.** An inventory row is dropped only when it has **no stock movement, no billed revenue, and less than one unit on hand** — so a part that made money in the window is never dropped for lack of stock movement (S3-N1). Catalogue rows are built solely from actual vendor requests in the window, so a never-requested catalogue part simply produces no row.

  * **14 default-visible columns.** The default view surfaces identity, the primary movement signals (Units Sold, Demand, Last Sale), the profitability columns, and On Hand; the 6 remaining columns are secondary movement or inventory-threshold columns, hidden by default and available via the column picker (S4-R2/R3).

  * **Search covers Part # and Description only.** Category and Vendor are better served by their dedicated filter controls; broadening search to those creates false matches on common words.

  * **The report remembers the user's view, per browser.** Filters (type, date range, category, vendor, bin, location), the column selection, and the active sort are saved in the browser (not tied to the account) and restored on the next visit, overriding the first-visit defaults (S4-R6).

  * **Export matches the current filters and sort.** The CSV and PDF reflect the filters, search, column selection, and active sort in effect when the user triggers the download — not a full unfiltered dump. One deliberate difference between the printed/exported grid and the on-screen grid is documented where it occurs: the export right-aligns numeric/money columns and centers the Type column (versus all-left-aligned on screen, S6-R10). Because sorting is resolved server-side (S3-R3), null placement is identical on screen and in the export — there is no longer an on-screen-vs-export null-sorting difference.




* * *

## 4. Terminology

  * **Inventory part** — A part held in stock at a location, tracked in the inventory system with an on-hand quantity. Each location's stock of a part is its own record (so one part number can be several inventory rows across locations).

  * **Catalogue part** — A special-order part sourced from a vendor on a per-job basis via a part request. Not stocked; no on-hand quantity. One report row per catalogue part, merged across the selected locations.

  * **Type** — The classification of a report row: `Inventory` or `Catalogue`.

  * **Demand** (a.k.a. demand frequency) — The number of separate stock-decrement transactions (for inventory parts) or vendor part requests (for catalogue parts) that included a given part in the selected date range. Each transaction counts once regardless of quantity. A later reversal of a sale does not add to, or subtract from, the count (S5-R4). This is the default ranking signal.

  * **Units Sold** — For an inventory part, the net quantity moved off the shelf via stock-movement events in the window (net of invoice reversals; can be zero or negative if reversals exceed sales). For a catalogue part, the total quantity across its in-window vendor requests (net of reversed/voided sales, per S5-R4b). This is a _stock-movement_ figure and can differ from the billed units behind the profitability columns for inventory parts (see §3, S5-R7).

  * **Revenue / Margin / Unit Cost / Sell Price / Margin %** — The per-part profitability columns, all derived from billed part lines (S5-R4a). Revenue = billed sell amount; Margin = Revenue − cost of goods sold; Unit Cost = cost ÷ billed units; Sell Price = Revenue ÷ billed units; Margin % = Margin ÷ Revenue as a percentage.

  * **Turns / Yr** (annual turns) — How many times the on-hand stock of an inventory part sells through in a year, annualized from the in-window sales rate. Not applicable to catalogue parts.

  * **Last Sale** — Whole days between today and the part's most recent sale, measured over **all-time** history (ignoring the selected date range) but **scoped to the selected location(s)**. This all-time lookback is a per-part calculation and is unrelated to the "All Time" date range the report does not offer (§2).




* * *

## 5. Assumptions

  * A sale counts only when its **work order or parts sale** is at status **Invoiced** or **Paid** ; anything in any other status does not contribute to the report. A **parts sale** (created in **Parts → Parts Sale**, a counter sale) is a separate workflow from a service work order, but **both** feed the report's sales metrics — see _Sold via WO_ (service work orders) and _Sold via Parts Sale_ (parts sales) in S5-R4.

  * Catalogue (special-order) parts are identified as vendor-sourced parts carrying a catalogue part reference; that is the only special-order classification in use.

  * A return is recorded when it is initiated (a work-order part return or a parts-sale credit); cancelling a return flags it as cancelled rather than deleting the record.

  * Each part is uniquely identified within a workplace as either an inventory part (inventory rows) or a catalogue part (catalogue rows).

  * Work orders are one of two types — **Service** or **Parts** — which is why Sold via WO (Service) and Sold via Parts Sale (Parts) together cover every billed work order.




* * *

## 6. Requirements

### Story 1: Report Access & Location

Where the report lives in the Reports navigation, and the access required to open it.

**Design:** TBD **Jira:** TBD

**Prerequisites:** User can access the Reports section (Manager or Office User role).

**Requirements:**

  * **S1-R1:** The report is accessible from the Reports navigation under a **Parts** section heading, labeled **Parts Velocity**. **This feature creates the Parts section** — the application has no Parts reports today, so the "Parts" grouping does not exist in the Reports navigation yet and must be added; Parts Velocity is its first (and, in this release, only) report. A dev should not assume a Parts reports section already exists.

  * **S1-R2:** On a first visit (no saved view — S4-R6), the date range defaults to **This Year** and data is fetched automatically. On a return visit the saved date range is used instead.

  * **S1-R3:** While data is loading (initial load or any server-side filter change), the table displays a loading indicator; existing rows are replaced only when the new data returns.

  * **S1-R4:** Both loading the report and exporting it require the **Inventory Reports → View** permission. A user without that permission is denied the report data and the export.




**Negative cases:**

  * **S1-N1:** Users without the Manager or Office User role cannot reach the Reports section and will not see the Parts Velocity navigation entry (enforced by the Reports section's access control).

  * **S1-N2:** A user who has the Reports-section role but lacks the **Inventory Reports → View** permission (S1-R4) still sees the Parts Velocity navigation entry (the entry follows section access); on opening the report they are shown the standard access-denied state rather than data, and the export is likewise denied. _(Build-note: confirm the FE uses this shown-then-denied model rather than hiding the entry, aligning with how the platform's other Inventory-Reports-permissioned reports behave.)_




* * *

### Story 2: Filters & Search

The filters and search available on the report; each reloads data from the server.

**Design:** TBD **Jira:** TBD

**Prerequisites:** Report data has loaded.

**Requirements:**

  * **S2-R1:** The toolbar provides a **Type** filter (single-select, first in the filter row) with options: **Both** , **Inventory** , **Catalogue**. On a first visit (no saved view) the default is **Both**. Selecting a value immediately reloads the report data. **Both** is an explicit selection that returns inventory and catalogue rows together — it is a deliberate filter value, not the absence of a filter.

  * **S2-R2:** The toolbar provides a **date range** selector offering exactly these options: **Today, Yesterday, This Week, Last Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom**. On a first visit the default is **This Year** ; there is no "All Time" option (see §2 Out of Scope). Selecting any non-custom option immediately reloads the report data. The named ranges use the application's standard shared calendar boundaries (the same boundaries every report's date picker uses); this report does not define its own.

  * **S2-R3:** Custom date range opens a date picker requiring both a start and an end date, with the start on or before the end. The Custom range is capped at a **366-day maximum span** (inclusive of both the start and end dates); a wider selection is rejected. Data reloads once both valid dates are selected.

  * **S2-R4:** The toolbar provides a **Category** multi-select filter. Selecting one or more categories limits the table to parts in those categories.

  * **S2-R5:** The toolbar provides a **Vendor** multi-select filter. Selecting one or more vendors limits the table to parts supplied by those vendors.

  * **S2-R6:** A **search input in the report's own toolbar** (page-specific, not the application's global search bar) filters to rows where the part number **or** description contains the search string, case-insensitively.

  * **S2-R7:** All active filters combine with AND logic — a part must satisfy every active filter to appear.

  * **S2-R8:** The toolbar provides a **Bin** multi-select filter. Selecting one or more bin locations reloads the data limited to inventory parts stocked in any of the selected bins. Because catalogue parts have no bin location, **all catalogue rows are excluded whenever any bin filter is active** — so Type = Catalogue combined with any Bin filter yields an empty result, by design.

  * **S2-R9:** The toolbar provides a **Location** multi-select filter as the **rightmost** control in the filter row, listing the locations the signed-in user has access to plus an "All Locations" option. On a first visit it defaults to the user's **currently active location** (the location currently selected in the application's global location switcher). Selecting one, several, or all locations reloads the data scoped to that set. Scoping is always constrained to the user's accessible locations — "All Locations" means all locations the user can access, never beyond; a location the user cannot access is never included. The location filter cascades through every metric like the other filters (S2-R7).

  * **S2-R10:** All filters and search apply **server-side** : Type, date range, Bin location, Location, Category, Vendor, and the toolbar search each trigger a fresh server-side data load, returning the first page of the new result set. There is no client-side-only narrowing — every filter or search change re-queries the server.

  * **S2-R11:** The empty state (S2-N1) is shown whenever the server returns zero rows for the current filters and search.




**Negative cases:**

  * **S2-N1:** If no parts match the combined filters, the table displays the empty state (§7).




**Edge cases:**

  * **S2-E1:** A part with no category assigned does not appear when any Category filter is active.

  * **S2-E2:** A part with no vendor assigned does not appear when any Vendor filter is active.

  * **S2-E3:** A part with no bin location assigned does not appear when any Bin filter is active.

  * **S2-E4:** A user with access to only one location still sees the Location filter with a single selectable location; behavior is unchanged from single-location use.




* * *

### Story 3: Data Table

One row per part (per location for inventory): how rows rank and sort, and how each cell renders.

**Design:** TBD **Jira:** TBD

**Prerequisites:** Report data has loaded.

**Requirements:**

  * **S3-R1:** The table displays one row per part, showing the columns currently enabled in the column picker (see Story 4). Calculation of each column's value is defined in Story 5.

  * **S3-R1a:** **Row model across locations.** An **inventory** part is a per-location stock record: the same part number stocked at N of the selected locations produces N inventory rows, each carrying that one location's On Hand / Min / Max (never summed). A **catalogue** part produces a single row, with its movement and profitability values **summed across** the selected locations. (Money columns being additive, the catalogue merge reconciles cleanly.)

  * **S3-R2:** Rows load ranked by **Demand** , descending (see Story 5 for the metric). Inventory and catalogue rows are ranked together; rows with equal Demand keep inventory-before-catalogue order. This initial Demand-descending order is the **active sort** — the Demand header shows the descending indicator (S3-R3), and it is what S4-R6 persists as the saved sort until the user clicks another header.

  * **S3-R3:** All columns are sortable by clicking the column header. The **first click** on a not-currently-sorted column sorts it **ascending** ; clicking the active sort column again reverses the direction. The active sort column shows a direction indicator (an arrow that flips for descending). Sorting is resolved **server-side** : each header click re-fetches the data ordered by the chosen column and direction (returning the first page of the re-sorted result set). Ties keep a stable order — no explicit secondary key. As a **server sort semantic** , null/`—` values are placed **first on ascending, last on descending**. Because the sort is applied server-side, the export renders the exact same ordering — including null placement (S6-R4); there is no on-screen-vs-export null-sorting difference.

  * **S3-R4:** The header row is sticky — it stays visible while the table body scrolls vertically.

  * **S3-R5:** The **Type** column displays `Inventory` or `Catalogue` as plain text.

  * **S3-R6:** Three columns — **Units Sold** , **Demand** , and **Turns / Yr** — carry a grey **ⓘ** icon immediately to the right of the header label. The icon is always-on (not a hover-to-reveal affordance), shown whenever its column is visible; Units Sold and Demand are visible by default, while Turns / Yr is hidden by default (S4-R3), so its icon appears only once that column is enabled. Hovering the icon shows the description; the icon is also focusable and exposes the same text to assistive technology, and activating it does not trigger a column sort. The verbatim descriptions are:


Column| Description shown  
---|---  
Units Sold| Units taken out of inventory stock on invoiced work orders in this date range. This is stock movement, so it can differ from the units billed behind Revenue and Sell Price.  
Demand| Number of separate transactions (work orders or parts sales) this part appeared on in the selected date range. Each transaction counts once, no matter how many units were sold on it.  
Turns / Yr| How many times you sell through this part in a year. Higher is better.  
  
These tooltip strings are deliberate plain-language summaries for the manager; the authoritative, exhaustive metric definitions are in S5-R4 / S5-R4a (which, e.g., also include Paid work orders and — for catalogue rows — vendor requests).

  * **S3-R7:** The Description, Category, and Vendor columns truncate long text with an ellipsis on screen; the full value is available on native hover (browser tooltip) and is written in full to the CSV export (S6). **Part # is never truncated** (on screen or in any export).

  * **S3-R8:** All columns — header label and cell data, including numeric and money columns — are **left-aligned** on screen. (The PDF/CSV exports right-align the numeric and money columns; see S6-R10 — a deliberate export-only difference.)

  * **S3-R9:** Wherever a value is null, it renders as `—` (em-dash) — in the table and all exports. The fields that can be null are **On Hand, Turns / Yr, Min, and Max** (always null for catalogue rows), **Unit Cost** and **Sell Price** (null when billed units ≤ 0), **Margin %** (null when Revenue ≤ 0), and **Last Sale** (null when the row has no recorded sale). **Revenue, Margin, and the movement count metrics (Units Sold, Units Returned, Sold via WO, Sold via Parts Sale, Demand) are never null** — they render `$0.00` / `0.00` / `0` when there is no activity. Full per-column formatting is in S5-R5.




**Negative cases:**

  * **S3-N1:** An inventory part is excluded from the report only when it has **zero net stock movement (Units Sold = 0) AND less than one unit on hand AND zero billed revenue in the window**. A part meeting all three carries neither a sales signal nor stock nor money to act on. A part with billed Revenue > 0 is always kept even if it had no stock movement and no on-hand stock (e.g., a drop-ship sale). (Catalogue is not subject to a separate rule: catalogue rows come only from actual in-window vendor requests, so a never-sold catalogue part simply produces no row.)




**Edge cases:**

  * **S3-E1:** Because Units Sold is net of reversals, an inventory part can show a Units Sold of `0.00` or a negative value (reversals exceeding sales in the window) while still appearing (it has on-hand stock or billed revenue). Negative movement renders with a leading minus (S5-R5); it is not floored to zero. A part invoiced then fully reversed in-window can show Demand `1` with Units Sold `0.00` — **provided it still has on-hand stock or other billed revenue keeping it in the result set** ; a fully-reversed part with zero net movement, no on-hand stock, and no residual revenue is excluded per S3-N1 (Demand is not itself a keep-criterion). The reversal does not decrement the Demand count (S5-R4).




* * *

### Story 4: Columns & Remembered View

Which columns show by default, and how each user's filters, column choices, and sort are remembered and restored.

**Design:** TBD **Jira:** TBD

**Prerequisites:** Report data has loaded.

**Requirements:**

  * **S4-R1:** A column picker is accessible via a toolbar button. It lists all **20** available columns, each with a toggle.

  * **S4-R2 (default shown columns):** On a first visit (no saved selection), the report shows exactly these **14** columns, in this on-screen left-to-right order: **Type, Part #, Description, Category, Vendor, Units Sold, Unit Cost, Sell Price, Revenue, Margin, Margin %, Demand, Last Sale, On Hand**. The other 6 columns start hidden.

  * **S4-R3:** The **6** columns hidden by default (available via the picker) are: **Units Returned, Sold via WO, Sold via Parts Sale, Turns / Yr, Min, Max**.

  * **S4-R4:** On-screen, columns always render in their fixed canonical left-to-right order regardless of the order in which they were toggled on. The canonical order is: **Type, Part #, Description, Category, Vendor, Units Sold, Units Returned, Sold via WO, Sold via Parts Sale, Unit Cost, Sell Price, Revenue, Margin, Margin %, Demand, Last Sale, On Hand, Turns / Yr, Min, Max**.

  * **S4-R5:** Toggling a column takes effect immediately; the table re-renders without a page reload.

  * **S4-R6 (view remembered per browser):** The report saves, in this browser (not tied to the user account), the current **filters** (Type, date range incl. custom start/end, categories, vendors, bin locations, location), **column selection** , and **active sort** (column + direction). On the next visit — including after leaving and returning, or a page reload — these saved values are restored **before** the first data fetch and take precedence over the first-visit defaults (S1-R2, S2-R1/R2/R9, S3-R2). The column selection returns to the user's last **non-empty** selection rather than the 14-column default (the all-hidden case is the exception, S4-E1). Restoration is defensive: a saved value that is no longer valid (e.g., a location no longer accessible, or a custom range that is now malformed) falls back to that setting's default rather than being sent to the server. Because storage is per-browser, a different user signing in on the same browser inherits the saved view (there is no per-account separation).




**Negative cases:**

  * **S4-N1:** If a saved view predates the current version of the report's saved format (its stored schema version does not match the current one), the system ignores the stale view and loads the current defaults (This Year / Both / active location / 14-column set / Demand-desc).




**Edge cases:**

  * **S4-E1:** The picker enforces no minimum — a user may switch off all 20 columns, leaving a grid with no data columns for the rest of that session. An all-hidden (empty) selection is **not** retained as restorable: on the next visit the report falls back to the default 14-column set. An export triggered with zero columns enabled produces a file containing only the header/metadata rows and no data columns.




* * *

### Story 5: Metric Calculations

The authoritative source, formula, and on-screen format for every column — the single reference for the table, the exports, and the tests.

**Design:** N/A (reference section) **Jira:** TBD

**Definitions:**

  * **Window** — the whole-day span of the selected range, inclusive of both the start and end dates, with a floor of 1 day (so a single-day range such as Today has Window = 1). This is the divisor used to annualize Turns / Yr.

  * **Work-order date** — the work order's end date. Catalogue sourcing, the Sold via WO / Sold via Parts Sale metrics, **and the profitability columns' billed-line window** are all anchored to this date. (Only Invoiced/Paid work orders count at all — see Assumptions; this defines _which_ of their dates does the windowing.) Inventory **Units Sold and Demand** are windowed instead by the inventory-movement event date — so for an inventory part the movement anchor and the billed/work-order anchor can differ; that is intended (see S5-R7). **Last Sale is not windowed at all** — it is measured over all-time history (S5-R4), scoped to the selected location(s).

  * **Billed units** — the summed quantity of the part on the billed work-order part lines (and vendor requests) in the window, excluding reversed/voided sales (S5-R4a). This is the basis for the profitability columns and can differ from Units Sold for an inventory part (S5-R7).

  * All metrics are scoped to the current selected location(s) (S2-R9).




**Requirements:**

  * **S5-R1: Inventory data source.** Inventory movement metrics are derived from the inventory-movement events generated when a work order is invoiced (which decrement stock) or when an invoice is reversed/voided (which add stock back), dated within the selected window. **Parts flagged as a core are excluded** from the inventory result set.

  * **S5-R2: Catalogue data source.** Catalogue metrics are derived from vendor-sourced part requests (carrying a catalogue part reference, and **not a core**) on work orders with status **Invoiced** or **Paid** whose work-order date falls within the window — grouped so each catalogue part is one row (summed across the selected locations, S3-R1a).

  * **S5-R3: Returns data source (Units Returned).** Units Returned is sourced from part-return records — the record written when a return is initiated, via a work-order part return or a parts-sale credit — NOT from inventory movements or invoice reversals. Cancelled returns are excluded; core-charge returns are excluded; the count is scoped to the current location(s) and to returns whose initiation date falls within the window. Inventory rows attribute returns to the inventory part; catalogue rows attribute them to the catalogue part. 

    * **Live state, not a snapshot:** the column always reflects the current state of return records — initiating a return adds its quantity; cancelling it removes the quantity again.

    * **Date anchor:** returns are dated by their initiation date, while sales are dated by their own sale event date (per S5-R1 for inventory and S5-R2 for catalogue). Because each uses its own natural event date, a return and its originating sale can fall in different report windows. Units Returned for a part is independent of the work order's current invoice status.

    * **Row existence:** a part whose only in-window event is a return (no sale, no on-hand stock, no billed revenue) is excluded per S3-N1, so its return would not surface; this is accepted (the report's row axis is sales/stock activity, not returns).

  * **S5-R4: Movement column calculations.**


Column| Inventory part| Catalogue part  
---|---|---  
**Units Sold**|  The net quantity moved off the shelf across in-window invoicing events: invoicing a work order adds the units sold; reversing/voiding an invoice subtracts them — so Units Sold is **net of invoice reversals** (and can be `0.00` or negative). Part returns do NOT affect Units Sold.| Total quantity across the catalogue part's in-window vendor requests (summed across selected locations), net of reversed/voided sales (S5-R4b).  
**Units Returned**|  Total returned quantity from part-return records attributed to this inventory part (see S5-R3).| Total returned quantity from part-return records attributed to this catalogue part (see S5-R3).  
**Sold via WO**|  Total part quantity on **Service** -type invoiced/paid work orders whose work-order date is in the window, net of reversed/voided sales (S5-R4b).| Same calc, on catalogue requests.  
**Sold via Parts Sale**|  Total part quantity on **Parts** -type invoiced/paid work orders whose work-order date is in the window, net of reversed/voided sales (S5-R4b).| Same calc, on catalogue requests.  
**Demand**|  Count of in-window invoicing events that decremented stock; each counts once. A reversal event neither adds to nor subtracts from the count, so a fully-reversed in-window sale keeps Demand `1` while Units Sold nets to `0.00`.| Count of in-window vendor part requests.  
**Last Sale**|  Whole days from today to the part's most recent sale at the selected location(s), over **all-time** history — not limited to the window.| Whole days from today to the catalogue part's most recent vendor-sourced invoiced/paid request at the selected location(s), over **all-time** history.  
**On Hand**|  The part's current on-hand quantity **at that row's location** (per S3-R1a; never summed across locations).| `—` (not applicable).  
**Turns / Yr**| `(Units Sold ÷ Window days × 365) ÷ On Hand`; renders `0.00` when On Hand is 0. Because Units Sold can be negative, Turns / Yr can be negative.| `—` (not applicable).  
**Min**|  The part's stored minimum reorder threshold at that row's location (read-only).| `—` (not applicable).  
**Max**|  The part's stored maximum reorder threshold at that row's location (read-only).| `—` (not applicable).  
  
  * **S5-R4b: Reversal-netting across the billed-line columns.** **Sold via WO** , **Sold via Parts Sale** , and **catalogue Units Sold** are billed-work-order-line quantities and — like the profitability columns (S5-R4a) — **exclude reversed/voided sales** (net of reversals). Inventory Units Sold already nets reversals via the stock add-back (S5-R1). Netting consistently across the whole billed-line family (Revenue, Margin, Unit Cost, Sell Price, billed units, Sold via WO, Sold via Parts Sale, and catalogue Units Sold) is what makes the S5-R7 reconciliation identities hold and keeps a voided sale from inflating any column. _(Build-delta: the current billed-side queries do not net reversals; this applies to all the billed-line columns listed here, together.)_

  * **S5-R4a: Profitability column calculations.** All five are derived from the **billed part lines** in the window — for inventory, the part lines on invoiced/paid Service- and Parts-type work orders (windowed by work-order date); for catalogue, the vendor part requests. **Reversed/voided sales are excluded** from these sums (netting reversals, consistent with Units Sold). Let **Revenue** = the summed billed sell amount (each line's stored sell price × quantity), **COGS** = the summed billed cost (each line's cost captured at billing time), and **billed units** = the summed billed quantity.


Column| Formula (both inventory and catalogue)| Null rule  
---|---|---  
**Revenue**|  Revenue (summed billed sell amount in the window).| Never null (`$0.00` when none).  
**Margin**|  Revenue − COGS.| Never null (`$0.00` when none).  
**Unit Cost**|  COGS ÷ billed units.| `—` when billed units ≤ 0.  
**Sell Price**|  Revenue ÷ billed units.| `—` when billed units ≤ 0.  
**Margin %**| (Revenue − COGS) ÷ Revenue × 100, to one decimal.| `—` when Revenue ≤ 0.  
  
  * The three unit/ratio columns use **independent** null triggers (Unit Cost/Sell Price on billed units ≤ 0; Margin % on Revenue ≤ 0). Because the triggers differ, mixed rows are valid and correct (not defects): a row may show Revenue and Margin as dollar amounts with **Unit Cost / Sell Price** `—` (billed units = 0 while revenue is booked — e.g. a credit/adjustment with revenue but no billed quantity) while **Margin % is still computed** from Revenue; or show a Sell Price of `$0.00` with **Margin %** `—` (billed units > 0 but Revenue 0); and all three of Unit Cost / Sell Price / Margin % show `—` together **only** when both billed units ≤ 0 **and** Revenue ≤ 0.

  * All five are computed from the **raw** (unrounded) Revenue / COGS / billed-units totals and rounded **once** at the end (S5-R7); they are not built from already-rounded intermediate values.

  * **S5-R5: On-screen number formatting.**

    * Units Sold, Units Returned, Sold via WO, Sold via Parts Sale, On Hand, Turns / Yr → two decimals with thousands separators (e.g. `1,250.00`); a negative value uses a leading minus (e.g. `-3.00`). Of these, **On Hand and Turns / Yr** render `—` when null (catalogue rows); the four count metrics (Units Sold, Units Returned, Sold via WO, Sold via Parts Sale) are **never null** (they render `0.00`).

    * Unit Cost, Sell Price, Revenue, Margin → currency, two decimals with thousands separators and a `$` (e.g. `$1,250.00`); a negative value uses a leading minus, no parentheses (e.g. `-$45.00`); null → `—` (Unit Cost / Sell Price only; Revenue and Margin are never null).

    * Margin % → one decimal with a trailing `%` (e.g. `33.8%`); a negative uses a leading minus, no `+` on positives (e.g. `-8.4%`); null → `—`.

    * Demand → whole number (never null; `0` when none).

    * Min, Max → whole number; null → `—`.

    * Last Sale → `N days` (e.g. `42 days`); null → `—`.

  * **S5-R6:** An on-hand cost value is computed internally for the report but is **not** a selectable column and is never displayed to the user.

  * **S5-R7 (movement and profitability bases differ, not additive):** **Units Sold** (inventory stock movement) is computed from a different source than the profitability columns' **billed units** (billed work-order lines). For an inventory part the two can differ — e.g., Revenue ÷ Sell Price need not equal Units Sold — and this is correct behavior, surfaced to the user by the Units Sold tooltip (S3-R6). Likewise **Units Sold** , **Sold via WO** , and **Sold via Parts Sale** are computed over different event sets and are **not** expected to equal one another versus Units Sold. Because work orders are only Service- or Parts-type (Assumptions), **Sold via WO + Sold via Parts Sale together do equal the billed-units basis** , but neither equals the movement-based Units Sold. For catalogue rows the movement quantity and billed units share one source (the vendor request quantity), so Units Sold, Sold via WO + Sold via Parts Sale, and billed units all reconcile for catalogue. **Rounding:** all money and one-decimal values round **half away from zero** (a tie rounds up in magnitude — e.g., `-8.45%` → `-8.5%`, `8.45%` → `8.5%`). _(Build note: a separate "Units Billed" column was considered to make each inventory row self-reconcile; it was deferred in favor of the Units Sold tooltip. Revisit only if users still trip on the cross-column math.)_




* * *

### Story 6: Exports (CSV & PDF)

What the CSV and PDF exports contain and how they are formatted.

**Design:** TBD **Jira:** TBD

**Prerequisites:** Report data has loaded.

**Requirements:**

  * **S6-R1:** A **⋯** overflow button in the toolbar (leftmost in the toolbar's action cluster) opens an export menu with two items, in this order: **Download (PDF)** and **Download (CSV)**.

  * **S6-R2:** Both exports reflect the date range, type, category, vendor, bin location, location, and search active at the time of export.

  * **S6-R3:** Both exports include only the columns currently enabled, in the **canonical on-screen order** (S4-R4) — the export mirrors the visible grid. _(Build-delta: the current export builds its column order from the user's visible-columns array, which appends a re-enabled hidden column at the end rather than in its canonical slot; align it to the canonical order so the export column order matches the screen.)_

  * **S6-R4:** Both exports reflect the active sort column and direction; rows appear in that order — for **every** column, including Min and Max. When the active sort is the default **Demand descending** (the user has not chosen another column), that order is exported. Because the sort is resolved server-side (S3-R3), the export renders rows in the exact server order — including null placement (nulls first on ascending, last on descending) — so the export and on-screen grid match.

  * **S6-R5:** The CSV downloads as `velocity-report.csv`; the PDF as `velocity-report.pdf`.

  * **S6-R6:** The PDF is formatted for **A3 landscape** , titled **Parts Velocity**. In the PDF, Description, Category, and Vendor are truncated to 18 characters. **Part # is not truncated. The CSV carries the full, untruncated Description / Category / Vendor values.**

  * **S6-R7:** A null value in any nullable field renders as `—` (em-dash) in both CSV and PDF: **Unit Cost, Sell Price, Margin %, On Hand, Turns / Yr, Last Sale, Min, Max**. (Revenue, Margin, and the count metrics are never null.)

  * **S6-R8:** Last Sale renders as `N days` (e.g. `42 days`) in the PDF; the CSV renders the raw integer.

  * **S6-R9:** On a successful download, a success toast reads **" Velocity report exported (CSV)"** or **" Velocity report exported (PDF)"**.

  * **S6-R10:** In the CSV and PDF, the **Type** column is centered, the text columns (Part #, Description, Category, Vendor) are left-aligned, and **every numeric and money column is right-aligned** — a deliberate export-only treatment that differs from the all-left-aligned on-screen table (S3-R8), because right-aligned numerics read better in a static printed/spreadsheet grid.




**Negative cases:**

  * **S6-N1:** If an export fails, an error toast is shown. The server-provided message is used when available; otherwise the toast reads **" Failed to export velocity report (csv)"** or **" Failed to export velocity report (pdf)"**.




* * *

### Story 7: Visual Conformance

The report's visual treatment (self-contained normative rules).

**Design:** TBD **Jira:** TBD

**Requirements:**

  * **S7-R1:** The page uses the two-tone theme: white card surfaces (toolbar + table cells) on the standard soft blue-grey page background. No card border-radius (edge-to-edge table).

  * **S7-R2:** The toolbar background is white (dark mode: black). Internal toolbar padding is 32px top, 2rem right, 24px bottom, 2rem left.

  * **S7-R3:** Table header cells have a white background and a 1px top border separating them from the toolbar.

  * **S7-R4:** Table body cells have a white background.

  * **S7-R5:** The leftmost cell in every row (header and body) has 2rem left padding; the rightmost cell has 2rem right padding.

  * **S7-R6:** The report supports dark mode; page background, toolbar, and cells use their dark-mode equivalents. The grey ⓘ info icon uses a token that meets at least a 3:1 contrast ratio against the cell background in both light and dark mode.

  * **S7-R7:** These rules are the normative visual spec for this report as built. If the application's report styling evolves after this spec is locked, this report's visual treatment should be updated in a new spec round; this spec is the source of truth for this report.




* * *

## 7. User Feedback Summary

Trigger| Message| Behavior  
---|---|---  
Export succeeds (CSV)| "Velocity report exported (CSV)"| Success toast, auto-fades  
Export succeeds (PDF)| "Velocity report exported (PDF)"| Success toast, auto-fades  
Export fails — server message available| Server-provided message| Error toast  
Export fails — no server message (CSV)| "Failed to export velocity report (csv)"| Error toast  
Export fails — no server message (PDF)| "Failed to export velocity report (pdf)"| Error toast  
No parts match the filters| "Empty bays, endless possibilities. Get Going\!"| Empty-state label in the data area (the application's standard reports no-data label)  
  
_* Casing note: the success toasts use uppercase_`(CSV)`_/_`(PDF)`_while the failure toasts use lowercase_`(csv)`_/_`(pdf)`_. This is the shipped wording and is documented as-is; a future copy pass may normalize the casing._

* * *

## 8. Change Log

Date| Reporter| Change  
---|---|---  
2026-05-19| @claude| Initial draft.  
2026-05-31| @claude| Major overhaul — renamed to **Parts Velocity** ; A/B/C/D groups removed; catalogue parts added; exports match screen column/sort.  
2026-06-04| @chris| "Demand Hits" → **" Demand"**; build-accuracy rewrite (Days of Supply removed, Bin server-side, permission documented, Min/Max read-only, Story 5 added); Units Returned re-sourced from part-return records.  
2026-06-07| @chris / @claude| Functional-purity pass + two code-verified lock loops; Min/Max export-sort fixed; S4-E1 and S5-R7 added; Reports → Parts section creation made explicit; Units Returned tooltip dropped. Status: Ready for dev.  
2026-07-11| @claude| **Suite-alignment rewrite (code-verified).** Added the five **profitability columns** (Unit Cost, Sell Price, Revenue, Margin, Margin %; S4-R2/R4, S5-R4a, S5-R5); column count 15→**20** , default-visible 9→**14**. Added the **Units Sold tooltip** (S3-R6) + **S5-R7** (movement-vs-billed basis; the deferred "Units Billed" column). Added the **multi-location filter** (S2-R9, rightmost, default active location) and the **per-location inventory / merged-catalogue row model** (S3-R1a). Expanded Story 4 to a **remembered-view** model (filters + columns + sort, **per browser** , restore overrides first-visit defaults, defensive fallback). Documented the deliberate **export vs screen differences** (right-alignment S6-R10; nulls-last-in-export vs on-screen default S3-R3/S6-R4) and stated the **no-All-Time** scope (§2, S2-R2). Stripped sibling-report references; visual rules self-contained (Story 7). Concrete definitions added/tightened: profitability window anchor = work-order date; Demand unaffected by reversals; Last Sale all-time but location-scoped; Window inclusive + floor 1; half-up-away-from-zero rounding; Turns/Yr `0.00` at on-hand 0; negative movement/money render with a leading minus; first-click-ascending sort + direction indicator; empty-state string quoted verbatim; CSV carries untruncated text. Fixed the Revenue/Margin/Demand "never null" wording (S3-R9/S5-R5).  
2026-07-11| @chris / @claude| **Two owner decisions on profitability correctness.** (1) **Reversals netted from the billed-line columns** — Revenue/Margin/Unit Cost/Sell Price **and** Sold via WO / Sold via Parts Sale / catalogue Units Sold all exclude reversed/voided sales, consistent with (movement-based) inventory Units Sold (§3, S5-R4a, S5-R4b). _Build-delta: the current billed-side queries do not net reversals and must exclude reversed invoices across all these columns._ (2) **No-activity exclusion broadened + BUILT** — an inventory part is now dropped only when it has zero movement AND < 1 on hand AND zero billed revenue (S3-N1), so profitable rows never vanish; implemented in the handler + fetcher this session (LOCAL/uncommitted on the suite branch).  
2026-07-16| @chris / @claude| Moved to **server-side data model** : report is server-paginated (§2); all filters and search apply server-side (S2-R10); sorting is server-side (S3-R3) with null placement stated as server sort semantics, removing the on-screen-vs-export null-sorting difference (S6-R4); exports match the current filters + sort. Capped the **Custom** date range at a 366-day maximum span (S2-R3). Confirmed **search** is a page-local toolbar input, not the application global search bar (S2-R6). Header cleanup: removed the loose Companion Video and status-badge paragraphs. _Per Milan Zivanovic's 2026-07-15 engineering review; server-side model is the committed build target (spec ahead of current code by design)._
