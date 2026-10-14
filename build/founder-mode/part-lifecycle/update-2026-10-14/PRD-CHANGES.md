# Part Lifecycle PRD — what changed from v27 (13 Oct copy) to v29 (14 Oct copy)

Chris Ward wrote his 14 Oct answers (`../po-answers-2026-10-14/ANSWERS-Chris-Ward-2026-10-14.md`) into the page. Full detail: `../SOURCE-CHECK-2026-10-14.md`, line diff `../sources/prd-diff-2026-10-13-to-2026-10-14.txt`.

Codes: v27 290, v29 302.

## Added
- **S1-R9b:** The export includes every part on that tab that matches the current search, filters and Supply filter, including parts not yet scrolled into view. With nothing matching, the message "Empty export" shows and no file is made.
- **S11-R3c:** While a part still uses the entry, the Delete button is disabled and hovering it shows "Part cannot be deleted. Please delete related parts first."
- **S12-R14a:** A special-order lookup result is a part number this location received from a vendor on a special-order line (a received line with no inventory part, and not a core) in the last 12 months.
- **S12-R14b:** When more than one vendor delivered that number in the last 12 months, the result names the vendor of the most recent delivery.
- **S5-E2:** A part reaches S5-R8 with bin locations and no default in two ways: the bin location that was its default is deleted in Administration → Bin Locations while the part holds 0 there, or an untracked part is saved with bin locations and none marked default.
- **S5-E3:** A core has no row of its own on the Inventory list, in Export or on the Part Library list, so it cannot be ticked for a bulk change. Its name (S13-R15) and its history show on the core's own Part History page. The core reason in S10-R13a applies when a core reaches a status change by any other route.
- **S7-N10:** An import row that adds a tracked part with no bin location puts the part in a bin named "Unassigned", which the import creates at the location if it is missing. On a new part that bin is the default bin.
- **S7-N7:** S7-N3 to S7-N6 do not apply to the parts CSV import. An import row whose number matches a part already stocked at this location updates that part (S13-N9a). It is never refused for a duplicate number.
- **S7-N8:** An import row with an empty part number is skipped. No message shows.
- **S7-N9:** An import row with an empty description never empties a description. An existing Part Library entry keeps its description. A new entry takes its part number as its description.
- **S9-N3a:** Opening Parts → Returns needs 'Vendor Order Management → View'. Starting a vendor return needs 'Vendor Order Management → Create & Edit'. A role with both and without 'Part Library & Inventory → View' opens a return and gets the S9-N3 access error when it searches for a part.
- **S9-R10c:** When two or more parts are left out, they are listed A to Z by part number, separated by ", ". Example: "These parts are inactive and were not added: AB-100, FF-5507."

## Removed

## Reworded
- **S10-R8** v27: For a reactivation from the bulk bar, the confirmation states "These parts can be added to new work again." ("This part ..." for one), followed by "Existing records that use them stay as they are."
  - v29: For a reactivation from the bulk bar, the confirmation states "These parts can be added to new work again." ("This part ..." for one), followed by "Existing records that use them stay as they are." ("... that use it ..." for one).
- **S11-R3** v27: Clicking a row opens that entry's detail page, where it can be edited and deleted.
  - v29: Clicking a row opens that entry's detail page. The pencil beside the entry's name opens the "Edit Library Part" window, where the entry is edited and where its Delete button sits, bottom left. The detail page itself has no Delete button.
- **S12-R4** v27: The failure message when saving a Part Library entry reads "Failed to save library part."
  - v29: The failure message when saving a Part Library entry reads "Failed to save library part." It shows only when the save fails for a reason this page does not name. A save refused for a named reason, such as S11-E4, shows that reason alone.
- **S9-E11** v27: Reports keep inactive parts. Inventory Value, Parts Velocity and the dashboard include them, because their stock still has value and their history still happened.
  - v29: Reports keep inactive parts. Inventory Value and Parts Velocity include them, because their stock still has value and their history still happened.

## §8 rows
- added Feedback: Delete on a Part Library entry a part still uses: "Part cannot be deleted. Please delete related parts first." | Hover text on the disabled Delete button (S11-R3c)

## Outside requirement lines
- §2 Accounting no longer mentions the dashboard's inventory figure; the PRD no longer mentions the dashboard at all (Product answer 7: Dashboard v1 has no inventory figure).
- Context note under S7-R6d: manufacturers cannot be deleted in ShopView (old data only).
- New context notes under S7-N7 (the one rare punctuation case) and S7-N9.
