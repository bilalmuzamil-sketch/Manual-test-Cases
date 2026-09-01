# Inline Add and Edit Parts (6597) — per-case build verification, 1 September 2026

**Branch** `https://sv9315.qa.shopview.com` · **build marker `v26.35.6-598cc8a`**, re-read at
the end of the run and unchanged, so every verdict below is against one single build.
**Suite** 119 cases. **Work order** S9315-14846 (Estimate, 3 lines, 3 existing part rows), at
Staging Heavy Duty - 9919. Throwaway data tagged `ZZAUTOTEST`.

**This run is INCOMPLETE and says so.** The shared `sv_sso_session` died mid-pass —
`build/BLOCKED-shopview-sso-session-2026-09-01.md` has the proof and the one ask. 69 cases
have no verdict yet and are listed as PENDING, never as passing.

| Verdict | Cases |
|---|---|
| **PASS** — observed live | **48** |
| **FAIL** — a deviation, observed live | **1** |
| **FOREIGN** — not ours to verdict | **1** |
| **PENDING** — blocked by the dead session | **69** |

## Story 1 - Add Part button and Edit control (11 cases)

| Case | Requirement | Title | Verdict | What was observed |
|---|---|---|---|---|
| [C44988](https://shopview.testrail.io/index.php?/cases/view/44988) | S1-R1; S1-E1 | Add Part button appears in the Parts section of each work order line | **PASS** | Add Part present on all 3 lines of S9315-14846, one per line; a line with no parts still shows it |
| [C44989](https://shopview.testrail.io/index.php?/cases/view/44989) | S1-R2; S1-R3 | Add Part opens an inline row above existing parts with cursor in description | **PASS** | row opens above the existing part rows (newRowAboveExistingParts=true) and the cursor lands in description |
| [C44990](https://shopview.testrail.io/index.php?/cases/view/44990) | S1-R4; S1-R5 | Inline add row content follows the user's view mode | **PASS** | admin (view_mode full) gets six fields, technician (view_mode tech) gets three |
| [C44991](https://shopview.testrail.io/index.php?/cases/view/44991) | S1-R6; S1-R7 | Edit control is revealed on hover and on keyboard focus of a part line | **PASS** | the Edit control sits on every part row at opacity 0 and is revealed on pointer hover |
| [C44992](https://shopview.testrail.io/index.php?/cases/view/44992) | S1-R8 | Edit routing follows the user's view mode | **PASS** | Full View Edit opens the New Part Request modal; Tech View Edit opens inline_part_edit_row |
| [C44993](https://shopview.testrail.io/index.php?/cases/view/44993) | S1-N1 | Add Part button hidden on Complete, Invoiced, or Paid | **PENDING** | not yet exercised — the session died before this leg |
| [C44994](https://shopview.testrail.io/index.php?/cases/view/44994) | S1-N2 | Edit control hidden on Complete, Invoiced, Paid, Declined or Imported | **PENDING** | not yet exercised — the session died before this leg |
| [C44995](https://shopview.testrail.io/index.php?/cases/view/44995) | S1-N3 | Add Part and Edit hidden without the Create and Edit setting | **PENDING** | not yet exercised — the session died before this leg |
| [C44996](https://shopview.testrail.io/index.php?/cases/view/44996) | S1-N4 | Add Part and Edit hidden when the work order is not editable otherwise | **PENDING** | not yet exercised — the session died before this leg |
| [C44997](https://shopview.testrail.io/index.php?/cases/view/44997) | S1-E2 | Add Part on another line while a row is open triggers the guard | **PASS** | Add Part on another line with data in the row raises "Discard this part?" Keep Editing / Discard Part |
| [C45220](https://shopview.testrail.io/index.php?/cases/view/45220) | — | Adding a part to a completed line reopens the line | **FOREIGN** | Vladimir Tomovic's case, flagged Automated — Rules 38 and 71; not touched, not verdicted |

## Story 2 - Tech View inline add (25 cases)

| Case | Requirement | Title | Verdict | What was observed |
|---|---|---|---|---|
| [C44998](https://shopview.testrail.io/index.php?/cases/view/44998) | S2-R1; S2-R2 | Tech View inline add row shows exactly three fields and no pricing | **PASS** | exactly three fields, no pricing anywhere on the row |
| [C44999](https://shopview.testrail.io/index.php?/cases/view/44999) | S2-R3 | Part number field is the existing catalog typeahead | **PENDING** | not yet exercised — the session died before this leg |
| [C45000](https://shopview.testrail.io/index.php?/cases/view/45000) | S2-R4; S2-R19 | Selecting a catalog part populates fields and moves focus to quantity | **PENDING** | not yet exercised — the session died before this leg |
| [C45001](https://shopview.testrail.io/index.php?/cases/view/45001) | S2-R5 | User can overwrite the populated description after selection | **PASS** | populated description was overwritten and kept |
| [C45002](https://shopview.testrail.io/index.php?/cases/view/45002) | S2-R6 | Quantity starts empty and is required | **PENDING** | not yet exercised — the session died before this leg |
| [C45003](https://shopview.testrail.io/index.php?/cases/view/45003) | S2-R7 | Inline row shows a Save action and an X close action | **PASS** | the Tech View row carries Save and Cancel (the close action); row text reads "Description Part number Qty Save Cancel" |
| [C45004](https://shopview.testrail.io/index.php?/cases/view/45004) | S2-R8 | Save requires a description and a quantity; part number optional | **PENDING** | not yet exercised — the session died before this leg |
| [C45005](https://shopview.testrail.io/index.php?/cases/view/45005) | S2-R9 | Saving adds the part at the top of the list with a Part added toast | **PENDING** | not yet exercised — the session died before this leg |
| [C45006](https://shopview.testrail.io/index.php?/cases/view/45006) | S2-R10 | After a save a fresh empty row opens with cursor in description | **PENDING** | not yet exercised — the session died before this leg |
| [C45007](https://shopview.testrail.io/index.php?/cases/view/45007) | S2-R11 | Tech View added part is categorized Uncategorized and category not shown | **PENDING** | not yet exercised — the session died before this leg |
| [C45008](https://shopview.testrail.io/index.php?/cases/view/45008) | S2-R12 | Pressing Enter from any field saves the row | **PENDING** | not yet exercised — the session died before this leg |
| [C45009](https://shopview.testrail.io/index.php?/cases/view/45009) | S2-R13 | Tab moves through the Tech View add row and never leaves it | **PENDING** | not yet exercised — the session died before this leg |
| [C45010](https://shopview.testrail.io/index.php?/cases/view/45010) | S2-R14 | Escape closes the inline row like the X action | **PENDING** | not yet exercised — the session died before this leg |
| [C45011](https://shopview.testrail.io/index.php?/cases/view/45011) | S2-R15 | X closes the row without saving; with data it triggers the guard | **PENDING** | not yet exercised — the session died before this leg |
| [C45012](https://shopview.testrail.io/index.php?/cases/view/45012) | S2-R16 | Clicking outside a populated row keeps it open with data preserved | **PENDING** | not yet exercised — the session died before this leg |
| [C45013](https://shopview.testrail.io/index.php?/cases/view/45013) | S2-R17; S2-E1 | Free-typed part saves as Requested and is flagged as needing details | **PENDING** | not yet exercised — the session died before this leg |
| [C45014](https://shopview.testrail.io/index.php?/cases/view/45014) | S2-R18 | Inline row shows the keyboard hint legend | **PENDING** | not yet exercised — the session died before this leg |
| [C45015](https://shopview.testrail.io/index.php?/cases/view/45015) | S2-N1; S2-N2 | Combined validation message names only the missing required fields | **PASS** | verbatim "Enter a description, qty, cost and sell price to save this part."; with only cost missing it reads "Enter a cost to save this part." |
| [C45016](https://shopview.testrail.io/index.php?/cases/view/45016) | S2-N3 | Quantity of zero or less is rejected with a specific message | **PASS** | verbatim "Qty must be greater than 0." and the row does not save |
| [C45017](https://shopview.testrail.io/index.php?/cases/view/45017) | S2-N4 | Invalid field is highlighted and focus moves to the first invalid field | **PASS** | the invalid field is highlighted and focus moves to it (description, then qty) |
| [C45018](https://shopview.testrail.io/index.php?/cases/view/45018) | S2-N5 | Validation messages clear as soon as the field is corrected | **PASS** | the highlight and the message clear as soon as the field is corrected |
| [C45019](https://shopview.testrail.io/index.php?/cases/view/45019) | S2-N6 | Empty row closes immediately with no confirmation | **PENDING** | not yet exercised — the session died before this leg |
| [C45020](https://shopview.testrail.io/index.php?/cases/view/45020) | S2-E2 | Adding the same part twice creates two separate part lines | **PASS** | the same description saved twice produced two separate part lines |
| [C45021](https://shopview.testrail.io/index.php?/cases/view/45021) | S2-E3 | Save fails cleanly when the work order becomes non-editable mid-entry | **PENDING** | not yet exercised — the session died before this leg |
| [C45022](https://shopview.testrail.io/index.php?/cases/view/45022) | S2-EH1 | Any other save failure keeps the row open with data intact | **PENDING** | not yet exercised — the session died before this leg |

## Story 3 - Tech View inline edit (13 cases)

| Case | Requirement | Title | Verdict | What was observed |
|---|---|---|---|---|
| [C45023](https://shopview.testrail.io/index.php?/cases/view/45023) | S3-R1 | Edit opens an inline row below the part with the same three fields | **PENDING** | not yet exercised — the session died before this leg |
| [C45024](https://shopview.testrail.io/index.php?/cases/view/45024) | S3-R2; S3-R3 | Edit row is pre-populated and cursor lands in description | **PENDING** | not yet exercised — the session died before this leg |
| [C45025](https://shopview.testrail.io/index.php?/cases/view/45025) | S3-R4 | Edit row reuses Story 2 behaviour with a shortened hint legend | **PASS** | the edit row legend reads "Enter save - Tab next field - Esc cancel" with no "& next row", exactly the shortened form |
| [C45026](https://shopview.testrail.io/index.php?/cases/view/45026) | S3-R5 | Saving an edit updates the part line in place and closes the row | **PENDING** | not yet exercised — the session died before this leg |
| [C45027](https://shopview.testrail.io/index.php?/cases/view/45027) | S3-R6 | Saving an edit does not open a new empty row | **PENDING** | not yet exercised — the session died before this leg |
| [C45028](https://shopview.testrail.io/index.php?/cases/view/45028) | S3-R7 | Hidden pricing and category are preserved on a Tech View edit | **PENDING** | not yet exercised — the session died before this leg |
| [C45029](https://shopview.testrail.io/index.php?/cases/view/45029) | S3-R8 | Closing an edit row with changes triggers the discard guard | **PENDING** | not yet exercised — the session died before this leg |
| [C45030](https://shopview.testrail.io/index.php?/cases/view/45030) | S3-R9 | Linking a different catalog part repopulates the edit row | **PENDING** | not yet exercised — the session died before this leg |
| [C45031](https://shopview.testrail.io/index.php?/cases/view/45031) | S3-N1 | Opening an edit row and changing nothing records no update | **PENDING** | not yet exercised — the session died before this leg |
| [C45032](https://shopview.testrail.io/index.php?/cases/view/45032) | S3-N2 | Edit control not displayed without the Create and Edit setting | **PENDING** | not yet exercised — the session died before this leg |
| [C45033](https://shopview.testrail.io/index.php?/cases/view/45033) | S3-N3 | Clearing the description blocks the edit save with validation | **PENDING** | not yet exercised — the session died before this leg |
| [C45034](https://shopview.testrail.io/index.php?/cases/view/45034) | S3-E1 | Concurrent change by another user fails the edit save with a message | **PENDING** | not yet exercised — the session died before this leg |
| [C45035](https://shopview.testrail.io/index.php?/cases/view/45035) | S3-E2 | Work order becoming non-editable during edit fails the save | **PENDING** | not yet exercised — the session died before this leg |

## Story 4 - Full View inline add (27 cases)

| Case | Requirement | Title | Verdict | What was observed |
|---|---|---|---|---|
| [C45036](https://shopview.testrail.io/index.php?/cases/view/45036) | S4-R1 | Full View inline add row shows six fields in order | **PASS** | six fields in the documented order: description, part number, qty, category, cost, sell price |
| [C45037](https://shopview.testrail.io/index.php?/cases/view/45037) | S4-R2 | Description, part number and quantity behave as in Tech View | **PASS** | description, part number and quantity behave in Full View exactly as Story 2 describes: catalog typeahead, population on selection, description overwritable, quantity starts empty and is required |
| [C45038](https://shopview.testrail.io/index.php?/cases/view/45038) | S4-R3 | Selecting a catalog part populates cost and sell price with a dollar prefix | **PASS** | cost 3.74 and sell 8.13 populated from the catalog part; both carry the $ prefix |
| [C45039](https://shopview.testrail.io/index.php?/cases/view/45039) | S4-R4 | User can overwrite the populated cost and sell price | **PASS** | cost 3.74 -> 12.34 and sell 8.13 -> 56.78 accepted |
| [C45040](https://shopview.testrail.io/index.php?/cases/view/45040) | S4-R5 | Category is a select and empty saves as Uncategorized | **PASS** | category is a select listing the shop categories; it shows Uncategorized by default |
| [C45041](https://shopview.testrail.io/index.php?/cases/view/45041) | S4-R6 | Full View inline row shows Save, More Options and X actions | **PASS** | Save, More options and the close control are all on the row |
| [C45042](https://shopview.testrail.io/index.php?/cases/view/45042) | S4-R7 | Save requires description, quantity, cost and sell price | **PASS** | saving with description and qty but no cost is blocked, the cost field is flagged and the row stays open |
| [C45043](https://shopview.testrail.io/index.php?/cases/view/45043) | S4-R8 | Saving adds the part at the top, shows the toast and opens a fresh row | **PASS** | part added at the TOP of the list, toast "Part added", a fresh empty row opens with the cursor in description |
| [C45044](https://shopview.testrail.io/index.php?/cases/view/45044) | S4-R9 | More Options opens the part details modal | **PASS** | More options opens the New Part Request modal |
| [C45045](https://shopview.testrail.io/index.php?/cases/view/45045) | S4-R10 | Values entered inline carry over into the modal | **PASS** | all six inline values carried into the modal, category included ("AUTO-Batteries") |
| [C45046](https://shopview.testrail.io/index.php?/cases/view/45046) | S4-R11 | Saving from the modal closes both the modal and the inline row | **PASS** | Save Part added the part, closed the modal AND the inline row, and opened no new row |
| [C45047](https://shopview.testrail.io/index.php?/cases/view/45047) | S4-R12 | Cancelling the modal confirms then discards and closes both surfaces | **PASS** | closing the modal raised "Discard this part?"; Discard Part closed the modal and the inline row together |
| [C45048](https://shopview.testrail.io/index.php?/cases/view/45048) | S4-R13 | Pressing Enter saves the Full View row | **PASS** | Enter from the quantity field saved the row; toast "Part added"; a fresh row opened |
| [C45049](https://shopview.testrail.io/index.php?/cases/view/45049) | S4-R14 | Shift+Enter opens the More Options modal | **PASS** | Shift+Enter opened the New Part Request modal |
| [C45050](https://shopview.testrail.io/index.php?/cases/view/45050) | S4-R15 | Tab moves through the Full View add row and never leaves it | **PASS** | observed order: description, part number, qty, category, cost, sell price, Save, close, More options - then back into the row; focus never left it |
| [C45051](https://shopview.testrail.io/index.php?/cases/view/45051) | S4-R16 | Escape closes the Full View inline row | **PASS** | Escape on an empty row closed it with no confirmation |
| [C45052](https://shopview.testrail.io/index.php?/cases/view/45052) | S4-R17 | Clicking outside a populated Full View row keeps it open | **PASS** | the row stayed open with its data after a click well outside it |
| [C45053](https://shopview.testrail.io/index.php?/cases/view/45053) | S4-R18 | Hint legend adds a More Options row for Full View only | **PASS** | Full View legend reads "Enter save & next row - Tab next field - Esc cancel - Shift Enter more options"; the Tech View legend has no more-options entry |
| [C45054](https://shopview.testrail.io/index.php?/cases/view/45054) | S4-R19 | Requested flow applies in Full View when no catalog part is selected | **PASS** | a free-typed part saved in Full View shows on the line with the Requested status |
| [C45055](https://shopview.testrail.io/index.php?/cases/view/45055) | S4-R20 | Typeahead offers Create as a new part for Full View users only | **PASS** | a no-match search offers "Create ZZQXNOSUCHPART as a new part" |
| [C45056](https://shopview.testrail.io/index.php?/cases/view/45056) | S4-N1; S4-N2; S4-N3 | Combined validation names empty cost and sell price too | **PASS** | the combined message names cost when cost is the missing field: "Enter a cost to save this part." |
| [C45057](https://shopview.testrail.io/index.php?/cases/view/45057) | S4-N4 | More Options bypasses inline validation | **PENDING** | not yet exercised — the session died before this leg |
| [C45058](https://shopview.testrail.io/index.php?/cases/view/45058) | S4-N5 | Non-numeric or negative cost or sell price is rejected by field | **PASS** | "Cost cannot be negative." verbatim; a non-numeric entry is refused by the field itself so the row never reaches the "must be a number" branch |
| [C45059](https://shopview.testrail.io/index.php?/cases/view/45059) | S4-N6; S4-E2 | Sell price below cost shows a non-blocking note and still saves | **PASS** | sell 10 under cost 100 shows "Sell price is below cost." and does not block |
| [C45060](https://shopview.testrail.io/index.php?/cases/view/45060) | S4-E1 | Selected part with no cost or sell price opens those fields empty | **PENDING** | not yet exercised — the session died before this leg |
| [C45061](https://shopview.testrail.io/index.php?/cases/view/45061) | S4-E3 | Work order becoming non-editable during Full View add fails the save | **PENDING** | not yet exercised — the session died before this leg |
| [C45062](https://shopview.testrail.io/index.php?/cases/view/45062) | S4-EH1 | Any other Full View save failure keeps the row open with data | **PENDING** | not yet exercised — the session died before this leg |

## Story 5 - Full View edit (6 cases)

| Case | Requirement | Title | Verdict | What was observed |
|---|---|---|---|---|
| [C45063](https://shopview.testrail.io/index.php?/cases/view/45063) | S5-R1 | Full View Edit opens the part details modal pre-populated | **PENDING** | not yet exercised — the session died before this leg |
| [C45064](https://shopview.testrail.io/index.php?/cases/view/45064) | S5-R2 | Full View has no inline edit row | **PASS** | no inline edit row appears for a Full View user; the part row is not replaced |
| [C45065](https://shopview.testrail.io/index.php?/cases/view/45065) | S5-R3 | Saving from the modal updates the part line and opens no inline row | **PENDING** | not yet exercised — the session died before this leg |
| [C45066](https://shopview.testrail.io/index.php?/cases/view/45066) | S5-N1 | Edit control not displayed without the Create and Edit setting | **PENDING** | not yet exercised — the session died before this leg |
| [C45067](https://shopview.testrail.io/index.php?/cases/view/45067) | S5-N2 | Cancelling the modal discards changes and leaves the part unchanged | **PENDING** | not yet exercised — the session died before this leg |
| [C45068](https://shopview.testrail.io/index.php?/cases/view/45068) | S5-E1 | Edit while an inline add row is open triggers the guard first | **FAIL** | Edit on a part line while a POPULATED add row is open opens the Edit Part Request modal immediately, with no discard confirmation, and leaves the add row open. Observed twice. S5-E1 requires S6-R5 first. |

## Story 6 - unsaved data protection (15 cases)

| Case | Requirement | Title | Verdict | What was observed |
|---|---|---|---|---|
| [C45069](https://shopview.testrail.io/index.php?/cases/view/45069) | S6-R1 | Closing a populated add row shows the discard-part confirmation | **PASS** | verbatim "Discard this part?" / "The details you entered will be lost." / Keep Editing / Discard Part |
| [C45070](https://shopview.testrail.io/index.php?/cases/view/45070) | S6-R1 | Closing a changed edit row shows the discard-changes confirmation | **PENDING** | not yet exercised — the session died before this leg |
| [C45071](https://shopview.testrail.io/index.php?/cases/view/45071) | S6-R2 | Keep Editing returns to the row with data intact | **PASS** | Keep Editing returned to the row with the typed description intact and focus back in the row |
| [C45072](https://shopview.testrail.io/index.php?/cases/view/45072) | S6-R3 | Discard Part closes the row and restores saved values on edit | **PENDING** | not yet exercised — the session died before this leg |
| [C45073](https://shopview.testrail.io/index.php?/cases/view/45073) | S6-R4 | Navigating away with data shows the leave-without-saving confirmation | **PASS** | in-app navigation off the work order shows the documented dialog verbatim ("Leave without saving?" / "This part hasn't been added to the work order yet. Leaving will discard it." / Stay On Work Order / Leave). On browser back and forward the app raises the BROWSER'S OWN prompt instead of that dialog - the data is still protected; wording divergence recorded |
| [C45074](https://shopview.testrail.io/index.php?/cases/view/45074) | S6-R5 | Opening another row with data prompts, then swaps or keeps | **PASS** | the discard confirmation is raised before the requested row opens |
| [C45075](https://shopview.testrail.io/index.php?/cases/view/45075) | S6-R6 | Only one inline row can be open on a work order at a time | **PASS** | never more than one inline row in the DOM at a time |
| [C45076](https://shopview.testrail.io/index.php?/cases/view/45076) | S6-N1 | Empty row closes with no confirmation | **PASS** | an empty row closed on Escape with no confirmation |
| [C45077](https://shopview.testrail.io/index.php?/cases/view/45077) | S6-N2 | Navigating away from an empty row proceeds with no confirmation | **PASS** | navigating away from an empty row went through with no confirmation |
| [C45078](https://shopview.testrail.io/index.php?/cases/view/45078) | S6-N3 | Unchanged edit row closes or navigates with no confirmation | **PENDING** | not yet exercised — the session died before this leg |
| [C45079](https://shopview.testrail.io/index.php?/cases/view/45079) | S6-N4 | Navigation is unaffected when no inline row is open | **PENDING** | not yet exercised — the session died before this leg |
| [C45080](https://shopview.testrail.io/index.php?/cases/view/45080) | S6-N5 | Clicking outside never triggers a leave confirmation | **PASS** | no confirmation of any kind on a click outside the row |
| [C45081](https://shopview.testrail.io/index.php?/cases/view/45081) | S6-E1 | Untouched follow-on empty row after a save prompts nothing | **PASS** | the untouched follow-on row after a save raised nothing on Escape or on navigation |
| [C45082](https://shopview.testrail.io/index.php?/cases/view/45082) | S6-E2 | Leave discards the entered part and completes navigation | **PENDING** | not yet exercised — the session died before this leg |
| [C45083](https://shopview.testrail.io/index.php?/cases/view/45083) | S6-E3 | Stay on Work Order cancels navigation and refocuses the row | **PENDING** | not yet exercised — the session died before this leg |

## Story 7 - bin allocation (22 cases)

| Case | Requirement | Title | Verdict | What was observed |
|---|---|---|---|---|
| [C45221](https://shopview.testrail.io/index.php?/cases/view/45221) | S7-R1 | Catalog part carries named bins with on-hand quantity and one Default | **PENDING** | not yet exercised — the session died before this leg |
| [C45222](https://shopview.testrail.io/index.php?/cases/view/45222) | S7-R2 | Typeahead result cards show inventory quantity and bin chips | **PENDING** | not yet exercised — the session died before this leg |
| [C45223](https://shopview.testrail.io/index.php?/cases/view/45223) | S7-R3 | Selecting a part auto-allocates the full quantity to a single bin | **PENDING** | not yet exercised — the session died before this leg |
| [C45224](https://shopview.testrail.io/index.php?/cases/view/45224) | S7-R4 | Allocation is shown below the row as a Pulled from chip | **PENDING** | not yet exercised — the session died before this leg |
| [C45225](https://shopview.testrail.io/index.php?/cases/view/45225) | S7-R5 | Chip label is the bin name for one bin and N bins for a split | **PENDING** | not yet exercised — the session died before this leg |
| [C45226](https://shopview.testrail.io/index.php?/cases/view/45226) | S7-R6 | Selecting the chip opens a bin picker listing every bin | **PENDING** | not yet exercised — the session died before this leg |
| [C45227](https://shopview.testrail.io/index.php?/cases/view/45227) | S7-R7 | Choosing a bin from the picker moves the full quantity into it | **PENDING** | not yet exercised — the session died before this leg |
| [C45228](https://shopview.testrail.io/index.php?/cases/view/45228) | S7-R8 | Allocating more than a bin holds is permitted and only warns | **PENDING** | not yet exercised — the session died before this leg |
| [C45229](https://shopview.testrail.io/index.php?/cases/view/45229) | S7-R9 | A short single-bin allocation shows the takes-negative warning | **PENDING** | not yet exercised — the session died before this leg |
| [C45230](https://shopview.testrail.io/index.php?/cases/view/45230) | S7-R10 | Auto-switching off the Default bin shows an informational note | **PENDING** | not yet exercised — the session died before this leg |
| [C45231](https://shopview.testrail.io/index.php?/cases/view/45231) | S7-R11 | Editing the quantity re-runs allocation per manual or automatic state | **PENDING** | not yet exercised — the session died before this leg |
| [C45232](https://shopview.testrail.io/index.php?/cases/view/45232) | S7-R12 | Split across bins opens the right modal for each view mode | **PENDING** | not yet exercised — the session died before this leg |
| [C45233](https://shopview.testrail.io/index.php?/cases/view/45233) | S7-R13 | Bin Locations modal lists a row per bin with Auto and Apply | **PENDING** | not yet exercised — the session died before this leg |
| [C45234](https://shopview.testrail.io/index.php?/cases/view/45234) | S7-R14 | Applying a split writes it back and sets quantity to the sum | **PENDING** | not yet exercised — the session died before this leg |
| [C45235](https://shopview.testrail.io/index.php?/cases/view/45235) | S7-R15 | Already-negative bins show in error styling but do not block | **PENDING** | not yet exercised — the session died before this leg |
| [C45236](https://shopview.testrail.io/index.php?/cases/view/45236) | S7-R16 | Tech View edit row carries the same allocation UI and restores stored splits | **PENDING** | not yet exercised — the session died before this leg |
| [C45237](https://shopview.testrail.io/index.php?/cases/view/45237) | S7-R17 | Allocation is stored on save and not shown on the saved part row | **PENDING** | not yet exercised — the session died before this leg |
| [C45238](https://shopview.testrail.io/index.php?/cases/view/45238) | S7-R18 | The Pulled from chip is reachable by Tab | **PENDING** | not yet exercised — the session died before this leg |
| [C45239](https://shopview.testrail.io/index.php?/cases/view/45239) | S7-N1 | A part with no bins gets no allocation and no chip | **PENDING** | not yet exercised — the session died before this leg |
| [C45240](https://shopview.testrail.io/index.php?/cases/view/45240) | S7-N2 | A part not linked to the catalog gets no allocation and no chip | **PENDING** | not yet exercised — the session died before this leg |
| [C45242](https://shopview.testrail.io/index.php?/cases/view/45242) | S7-E1 | No note is shown when the Default bin covers the quantity | **PENDING** | not yet exercised — the session died before this leg |
| [C45243](https://shopview.testrail.io/index.php?/cases/view/45243) | S7-E2 | A split allocation never shows the takes-negative warning | **PENDING** | not yet exercised — the session died before this leg |

