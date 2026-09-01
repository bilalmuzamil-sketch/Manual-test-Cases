# verdicts.py — the per-case build-verification verdict for suite 6597 (Inline Add and Edit Parts),
# branch sv9315, build v26.35.6-598cc8a, 1 September 2026.
#
# Each entry: case id -> (verdict, evidence key, one-line note).
# VERDICTS USED
#   PASS      the documented behaviour was OBSERVED LIVE on the build
#   FAIL      the documented behaviour was observed NOT to happen (a deviation; ticket candidate)
#   NOTBUILT  the surface the case needs does not exist on the build at all
#   NODATA    the feature is built but the DATA STATE the case needs does not exist on this branch
#   NOTVER    not observable through the UI on this branch (needs a second user, a forced failure,
#             or a permission change that this session may not make) — never guessed either way
#
# Rule 12: nothing here is inferred. Every PASS names the probe that observed it; the probe outputs
# are in ../evidence/probe-full.json and ../evidence/probe-tech.json.

V = {
 # ---------------- Story 1: Add Part button and Edit control (11 cases) ----------------
 44988: ('PASS', 'A-add-row', 'Add Part present on all 3 lines of S9315-14846, one per line; a line with no parts still shows it'),
 44989: ('PASS', 'A-add-row', 'row opens above the existing part rows (newRowAboveExistingParts=true) and the cursor lands in description'),
 44990: ('PASS', 'A-add-row + TA-add-row', 'admin (view_mode full) gets six fields, technician (view_mode tech) gets three'),
 44991: ('PASS', 'P-edit + C1-edit-reveal', 'the Edit control sits on every part row at opacity 0 and is revealed on pointer hover'),
 44992: ('PASS', 'P-edit + TI-edit-row', 'Full View Edit opens the New Part Request modal; Tech View Edit opens inline_part_edit_row'),
 44993: (None, None, ''),
 44994: (None, None, ''),
 44995: (None, None, ''),
 44996: (None, None, ''),
 44997: ('PASS', 'M-second-row', 'Add Part on another line with data in the row raises "Discard this part?" Keep Editing / Discard Part'),
 45220: ('FOREIGN', None, "Vladimir Tomovic's case, flagged Automated — Rules 38 and 71; not touched, not verdicted"),

 # ---------------- Story 2: Tech View inline add (25 cases) ----------------
 44998: ('PASS', 'TA-add-row', 'exactly three fields, no pricing anywhere on the row'),
 44999: (None, None, ''),
 45000: (None, None, ''),
 45001: ('PASS', 'D-overwrite', 'populated description was overwritten and kept'),
 45002: (None, None, ''),
45003: ('PASS', 'techview-as-technician', 'the Tech View row carries Save and Cancel (the close action); row text reads "Description Part number Qty Save Cancel"'),
 45004: (None, None, ''),
 45005: (None, None, ''),
 45006: (None, None, ''),
 45007: (None, None, ''),
 45008: (None, None, ''),
 45009: (None, None, ''),
 45010: (None, None, ''),
 45011: (None, None, ''),
 45012: (None, None, ''),
 45013: (None, None, ''),
 45014: (None, None, ''),
 45015: ('PASS', 'V-message-hunt', 'verbatim "Enter a description, qty, cost and sell price to save this part."; with only cost missing it reads "Enter a cost to save this part."'),
 45016: ('PASS', 'V-message-hunt', 'verbatim "Qty must be greater than 0." and the row does not save'),
 45017: ('PASS', 'F-validation', 'the invalid field is highlighted and focus moves to it (description, then qty)'),
 45018: ('PASS', 'F2-validation-text', 'the highlight and the message clear as soon as the field is corrected'),
 45019: (None, None, ''),
 45020: ('PASS', 'U-duplicate', 'the same description saved twice produced two separate part lines'),
 45021: (None, None, ''),
 45022: (None, None, ''),

 # ---------------- Story 3: Tech View inline edit (13 cases) ----------------
 45023: (None, None, ''), 45024: (None, None, ''),45025: ('PASS', 'techview-edit-diff', 'the edit row legend reads "Enter save - Tab next field - Esc cancel" with no "& next row", exactly the shortened form'), 45026: (None, None, ''),
 45027: (None, None, ''), 45028: (None, None, ''), 45029: (None, None, ''), 45030: (None, None, ''),
 45031: (None, None, ''), 45032: (None, None, ''), 45033: (None, None, ''), 45034: (None, None, ''),
 45035: (None, None, ''),

 # ---------------- Story 4: Full View inline add (27 cases) ----------------
 45036: ('PASS', 'A-add-row', 'six fields in the documented order: description, part number, qty, category, cost, sell price'),
45037: ('PASS', 'B-typeahead + C-select-part + D-overwrite + T-cost-required', 'description, part number and quantity behave in Full View exactly as Story 2 describes: catalog typeahead, population on selection, description overwritable, quantity starts empty and is required'),
 45038: ('PASS', 'C-select-part', 'cost 3.74 and sell 8.13 populated from the catalog part; both carry the $ prefix'),
 45039: ('PASS', 'D-overwrite', 'cost 3.74 -> 12.34 and sell 8.13 -> 56.78 accepted'),
 45040: ('PASS', 'E-category', 'category is a select listing the shop categories; it shows Uncategorized by default'),
 45041: ('PASS', 'A-add-row', 'Save, More options and the close control are all on the row'),
 45042: ('PASS', 'T-cost-required', 'saving with description and qty but no cost is blocked, the cost field is flagged and the row stays open'),
 45043: ('PASS', 'G-save', 'part added at the TOP of the list, toast "Part added", a fresh empty row opens with the cursor in description'),
 45044: ('PASS', 'L-more-options', 'More options opens the New Part Request modal'),
 45045: ('PASS', 'AA-category-carryover', 'all six inline values carried into the modal, category included ("AUTO-Batteries")'),
 45046: ('PASS', 'AA-category-carryover', 'Save Part added the part, closed the modal AND the inline row, and opened no new row'),
 45047: ('PASS', 'X-modal-exit', 'closing the modal raised "Discard this part?"; Discard Part closed the modal and the inline row together'),
 45048: ('PASS', 'H-keyboard-save', 'Enter from the quantity field saved the row; toast "Part added"; a fresh row opened'),
 45049: ('PASS', 'H-keyboard-save', 'Shift+Enter opened the New Part Request modal'),
 45050: ('PASS', 'I-tab-order', 'observed order: description, part number, qty, category, cost, sell price, Save, close, More options - then back into the row; focus never left it'),
 45051: ('PASS', 'J-close', 'Escape on an empty row closed it with no confirmation'),
 45052: ('PASS', 'K-click-outside', 'the row stayed open with its data after a click well outside it'),
 45053: ('PASS', 'A-add-row', 'Full View legend reads "Enter save & next row - Tab next field - Esc cancel - Shift Enter more options"; the Tech View legend has no more-options entry'),
 45054: ('PASS', 'G-save', 'a free-typed part saved in Full View shows on the line with the Requested status'),
 45055: ('PASS', 'S-create-new', 'a no-match search offers "Create ZZQXNOSUCHPART as a new part"'),
 45056: ('PASS', 'V-message-hunt', 'the combined message names cost when cost is the missing field: "Enter a cost to save this part."'),
 45057: (None, None, ''),
 45058: ('PASS', 'V-message-hunt', '"Cost cannot be negative." verbatim; a non-numeric entry is refused by the field itself so the row never reaches the "must be a number" branch'),
 45059: ('PASS', 'V-message-hunt', 'sell 10 under cost 100 shows "Sell price is below cost." and does not block'),
 45060: (None, None, ''),
 45061: (None, None, ''),
 45062: (None, None, ''),

 # ---------------- Story 5: Full View edit (6 cases) ----------------
 45063: (None, None, ''),45064: ('PASS', 'P-edit', 'no inline edit row appears for a Full View user; the part row is not replaced'), 45065: (None, None, ''),
 45066: (None, None, ''), 45067: (None, None, ''),45068: ('FAIL', 'AB-edit-guard-recheck', 'Edit on a part line while a POPULATED add row is open opens the Edit Part Request modal immediately, with no discard confirmation, and leaves the add row open. Observed twice. S5-E1 requires S6-R5 first.'),

 # ---------------- Story 6: unsaved-data protection (15 cases) ----------------
 45069: ('PASS', 'J-close', 'verbatim "Discard this part?" / "The details you entered will be lost." / Keep Editing / Discard Part'),
 45070: (None, None, ''),
 45071: ('PASS', 'J-close', 'Keep Editing returned to the row with the typed description intact and focus back in the row'),
 45072: (None, None, ''),
 45073: ('PASS', 'N-navigate-away + W-browser-back', 'in-app navigation off the work order shows the documented dialog verbatim ("Leave without saving?" / "This part hasn\'t been added to the work order yet. Leaving will discard it." / Stay On Work Order / Leave). On browser back and forward the app raises the BROWSER\'S OWN prompt instead of that dialog - the data is still protected; wording divergence recorded'),
 45074: ('PASS', 'M-second-row', 'the discard confirmation is raised before the requested row opens'),
 45075: ('PASS', 'M-second-row', 'never more than one inline row in the DOM at a time'),
 45076: ('PASS', 'J-close', 'an empty row closed on Escape with no confirmation'),
 45077: ('PASS', 'Z-followon-row', 'navigating away from an empty row went through with no confirmation'),
 45078: (None, None, ''),
 45079: (None, None, ''),
 45080: ('PASS', 'K-click-outside', 'no confirmation of any kind on a click outside the row'),
 45081: ('PASS', 'Z-followon-row', 'the untouched follow-on row after a save raised nothing on Escape or on navigation'),
 45082: (None, None, ''),
 45083: (None, None, ''),

 # ---------------- Story 7: bin allocation (22 cases) ----------------
 45221: (None, None, ''), 45222: (None, None, ''), 45223: (None, None, ''), 45224: (None, None, ''),
 45225: (None, None, ''), 45226: (None, None, ''), 45227: (None, None, ''), 45228: (None, None, ''),
 45229: (None, None, ''), 45230: (None, None, ''), 45231: (None, None, ''), 45232: (None, None, ''),
 45233: (None, None, ''), 45234: (None, None, ''), 45235: (None, None, ''), 45236: (None, None, ''),
 45237: (None, None, ''), 45238: (None, None, ''), 45239: (None, None, ''), 45240: (None, None, ''),
 45242: (None, None, ''), 45243: (None, None, ''),
}
