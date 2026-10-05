# For Mudassir — 3 of your Part Sales cases are out of date (specification edited 5 October 2026)

The Part Sales specification (Confluence 867434569, "Part Sales Update v1") was edited on **5 October 2026**,
with no change-log entry. Three of your cases now quote or test the older wording. They are yours, so I
have not changed them — here is exactly what moved, with the new wording to quote.

Also FYI: I added **4 new cases** for the requirements that edit introduced to your run **492**
("FM1 · Part Sales v1 · sv9667.qa"), assigned to you: C236959, C236960, C236961, C236962. And 18 of our
cases already in that run were updated to the new wording — their earlier results in 492 were recorded
against the old wording.

## C154874 — End to end on a post-cutoff sale (step 6, QuickBooks)
- **Your expected result:** the negative core line has "the same item mapping, class and tax treatment" as the part row.
- **What the specification now says (requirement S1-R17):** both core rows take the QuickBooks item mapped
  to the **core's part category**, not the part row's — so a returned core nets to $0.00 on that one item.
  New: if the item is unmapped, the **whole invoice is held in the Unexported report**; no row is dropped.
- **New quote:** "The core charge row and its Core credit row both take the QuickBooks item from the product
  and service mapped to the core's part category, so a returned core nets to $0 on that one item"
- **Suggested fix:** step 6 expects the $79.99 core row and the -$79.99 Core credit on the core category's
  item (netting to $0.00), and drop "class". Our C154596 / C154640 now test this in detail.

## C154877 — Every new control stays usable at tablet width
- **Your quote (old):** "Desktop first, usable to tablet width ... must stay usable at tablet width"
- **What the specification now says (Form factor):** a measured width — **768 pixels**.
  "From 768px wide (a portrait tablet) upward, the Return Core action and the Actions column stay visible
  and clickable without scrolling sideways, because counter staff do carry one."
- **Suggested fix:** re-quote, and set the test width to 768 pixels (e.g. a standard iPad in portrait).
  Note the specification now names only Return Core and the Actions column; your other controls (tax,
  sales representative, audit log, deposit dialog) are no longer covered by that sentence. Our new case
  C236962 covers the two it names.

## C154883 — Spec discrepancies to raise with the PRD owner
Both discrepancies you raised are now **resolved in the specification**:
1. **Duplicate requirement id S1-R22** — split. S1-R22 is now "customer document only"; the parts-grid
   rule moved to the new **S1-R27**.
2. **Deposit minimum** — answered by new **S8-R15**: "The smallest deposit is $0.01 and zero is refused,
   the same as a work order deposit. A deposit paid through the Customer Portal follows the portal's own
   $1.00 minimum." Our new case C236961 tests both limits.
- **Suggested fix:** record both as resolved by the 5 October 2026 edit, or retire the case.
