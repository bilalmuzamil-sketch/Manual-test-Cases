# Part Lifecycle — Chris Ward's answers to the 13 Oct question doc (read 14 Oct 2026)

Source: Google Doc "Part Lifecycle – questions for Chris Ward (13 Oct 2026)", https://docs.google.com/document/d/1pkAPGqWVTdtYorNN4SVNl9HkHxuuB9czro_y2DbUeEM/edit — answers highlighted in blue by Chris Ward, copied verbatim below. The codes he cites are lines he added to or changed in the PRD (Confluence 829227015).

1. Only "Part Library entry not found." (S11-E4). "Failed to save library part." shows only when a save fails for a reason the page doesn't name (S12-R4).
2. Close: it's based on what was received, not ordered. A special-order result is a part number this location received from a vendor on a special-order line in the last 12 months. That's a received line with no inventory part, and not a core (S12-R14a). If more than one vendor delivered it, the vendor of the most recent delivery shows (S12-R14b).
3. a) The part goes into a bin named "Unassigned", which the import creates if it's missing. On a new part that bin is the default (S7-N10).
   b) No. The duplicate check doesn't apply to the import. A matching number updates the part already stocked at the location and is never refused (S7-N7). The context note under S7-N7 covers the one rare punctuation case.
   c) The import isn't one of those routes, and it shows no messages. A blank part number skips the row (S7-N8). A blank description never empties a description: an existing entry keeps its own, and a new entry uses its part number (S7-N9).
4. Every part on that tab that matches the current search, filters and Supply filter, including rows not yet scrolled into view. With nothing matching, "Empty export" shows (S1-R9b).
5. Two ways (S5-E2):
   - Delete, in Administration → Bin Locations, the bin location that is the part's default while the part holds 0 there.
   - Save an untracked part with bins and none marked default, then turn tracking on.
6. A core has no row of its own on the Inventory list, in Export or on the Part Library list, so it can't be ticked. Its name and history show on the core's own Part History page. The S10-R13a core message applies when a core reaches a status change by any other route (S5-E3).
7. No. Dashboard v1 has no inventory figure, and the dashboard references are removed from S9-E11 and from the Accounting section.
8. Yes, "use it" for one part (S10-R8).
9. A to Z by part number, separated by ", " (S9-R10c). Example: "These parts are inactive and were not added: AB-100, FF-5507."
10. "Vendor Order Management → View" to open Parts → Returns, and "Vendor Order Management → Create & Edit" to start a return. Leave out "Part Library & Inventory → View"; searching for a part then shows the S9-N3 access error (S9-N3a).
11. Old data only. Manufacturers can't be deleted in ShopView (context note under S7-R6d). Test it on existing data that has such an entry.
12. Board 7.2 is right: the page has no Delete button. Delete sits bottom left in the "Edit Library Part" window, opened by the pencil beside the entry's name (S11-R3). While a part uses the entry, Delete is disabled with the hover text "Part cannot be deleted. Please delete related parts first." (S11-R3c).

FYI reply: "Thanks sir!!!. S5-R14 and S9-E12 come out of SV-11041."
