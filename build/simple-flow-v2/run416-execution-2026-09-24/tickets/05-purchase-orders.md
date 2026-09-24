TITLE: The Purchase Orders Page Is a Flat List Rather Than Vendor Groups, and Selecting a Row Raises an Empty Bar
ISSUE TYPE: Story Defect
PARENT / OWNING STORY: SV-9260 — The receive page and PO bulk receive
PRIORITY: Medium
ALSO LINK: relates to SV-9260
PICTURE: pictures/purchase-orders.png  (banner: "The Purchase Orders page as it opens")
COVERS THE CHECKS: C44589, C44590, C53488

--- WIKI MARKUP BODY BELOW THIS LINE ---

h2. Description

The purchase orders page is meant to open as a short list of vendors rather than a wall of parts:
purchase orders grouped by vendor, missing vendors first, every group collapsed, and a panel that
expands per purchase order so each figure entered belongs to exactly one vendor bill.

On the build it is a single flat table sorted by date, and nothing expands.

For example:
* there are no vendor groups, no group headers, no rollup such as "3 POs, 6 parts" and no *Expand all*;
* nothing is collapsed — every purchase order is a row in one list;
* a purchase order with no vendor shows an amber *Vendor missing on 1 part* warning on its own row
  instead of sitting in a *Missing vendors* group at the top;
* nothing expands per purchase order: each row carries a *Receive* button that opens the same window
  as the work order does;
* selecting a row raises a bar that reads *1 selected* and holds only a cross — no *Receive selected*,
  no *Deselect all*, no *More*.

h2. Steps to Reproduce

# Sign in as an Owner or Admin.
# Open *Parts* in the top menu, then the *Purchase Orders* tab.
#* The page is one table with the columns *Work Order*, *Purchase Order Number*, *Vendor*, *Order Status*, *Created On*, *Ordered By*, *Total Cost*, *Note*.
#* There is no grouping and no *Expand all* anywhere on the page.
# Look at a purchase order that has no vendor.
#* It reads *Vendor missing on 1 part* on the row itself.
# Tick the box on any row.
#* The bar reads *1 selected* and carries only a cross.

*Actual Result* — a flat, date-sorted list with no vendor grouping and nothing collapsible, and a
selection bar with no actions in it.

*Expected Result* — purchase orders grouped by vendor with *Missing vendors* first and named vendors
alphabetically, every group collapsed, group headers carrying the vendor name, a rollup and *Expand
all*, a panel expanding per purchase order, and a selection raising the same bar as the work order with
*Receive selected* as its primary action.

h2. Environment

Production, [https://app.shopview.com], build {{v26.39.0-07c719b}}, shop *Trucks Hill 2*, 24 September 2026.
The page: [https://app.shopview.com/parts/orders]

h2. Sources

Simple Flow V2 specification, Confluence page *771391574*, Story 14 — "The receive page and PO bulk receive".
_[TO BE PASTED: the verbatim sentences from the live page — one gated read of the source is needed.]_
