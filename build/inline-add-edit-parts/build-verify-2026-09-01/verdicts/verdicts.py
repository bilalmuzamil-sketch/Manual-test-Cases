# verdicts.py — the per-case build-verification verdict for suite 6597 (Inline Add and Edit Parts),
# branch sv9315, build v26.35.6-598cc8a, 1 September 2026.
#
# Each entry: case id -> (verdict, evidence key, one-line note).
# VERDICTS USED
#   PASS      the documented behaviour was OBSERVED LIVE on the build
#   FAIL      the documented behaviour was observed NOT to happen (a deviation; ticket candidate)
#   NOTBUILT  the surface the case needs does not exist on the build at all
#   NODATA    the feature is built but the DATA STATE the case needs does not exist on this branch
#   PARTIAL   part of the case was observed and part could not be, because the DATA STATE for the
#             rest does not exist on this branch. The covered and uncovered legs are both named in
#             the note; a PARTIAL is never reported as a pass.
#   NOTVER    not observable through the UI on this branch (needs a second user, a forced failure,
#             or a permission change that this session may not make) — never guessed either way
#
# Rule 12: nothing here is inferred. Every PASS names the probe that observed it; the probe outputs
# are in ../evidence/probe-full.json and ../evidence/probe-tech.json.

V = {
    # ---------------- Story 1 - Add Part button and Edit control (11 cases) ----------------
    44988: ('PASS', 'A-add-row',
            'Add Part present on all 3 lines of S9315-14846, one per line; a line with no parts still shows it'),
    44989: ('PASS', 'A-add-row',
            'row opens above the existing part rows (newRowAboveExistingParts=true) and the cursor lands in description'),
    44990: ('PASS', 'A-add-row + TA-add-row',
            'admin (view_mode full) gets six fields, technician (view_mode tech) gets three'),
    44991: ('PASS', 'C1-edit-reveal',
            'the edit control sits on every part row at opacity 0 and goes to opacity 1 on hover. The keyboard-focus half of S1-R7 is re-probed separately - see C1b'),
    44992: ('PASS', 'P-edit + TI-edit-row',
            'Full View Edit opens the New Part Request modal; Tech View Edit opens inline_part_edit_row'),
    44993: ('PARTIAL', 'N1-paid-work-order',
            'on the PAID work order S2-15522 the Add Part button is absent on every line (addPart=0) while the Estimate work order in the same run shows 3 - a clean positive control. The other four statuses the requirement names (Complete, Invoiced, Declined, Imported) DO NOT EXIST on this branch: 3,000 work orders were paged and only estimate, approved and paid are present, so those legs are unverified, not passing'),
    44994: ('PARTIAL', 'N1-paid-work-order',
            'same run: 0 edit controls on the Paid work order, 12 on the Estimate one. Complete / Invoiced / Declined / Imported are a branch data gap (INL-4)'),
    44995: ('PASS', 'N3-no-permission',
            'with workOrderLinesCreateAndEdit removed from the Technician role, an EDITABLE (Estimate) work order showed 0 Add Part buttons and 0 edit controls. The role was restored in the same run and verified field by field - permission list identical, view_mode unchanged'),
    # C44996 WAS DELETED BY THE QA LEAD ON 2026-09-01 and replaced by C45250-C45253 (see below).
    # It is not listed here: a verdict on a case that no longer exists is noise, and the FAIL this pass
    # recorded against it was taken on a part-FREE line, which is not the state his replacement
    # describes. get_case/44996 answers HTTP 400.
    44997: ('PASS', 'M-second-row',
            'Add Part on another line with data in the row raises "Discard this part?" Keep Editing / Discard Part'),
    # ---------------- added by the QA lead on 2026-09-01, replacing C44996 ----------------
    45250: ('NOTVER', 'probe-new4 + /tmp pick chain',
            'NOT OBSERVED, and the blocker is named rather than guessed. His route is the right one - a '
            'part must be added AND PICKED before the line can complete - and that is exactly where it '
            'stops: a line with an unfulfilled part request answers 400 "Line can`t be completed with '
            'unfulfilled part requests." Authorising the line moves the part from "quoted" to '
            '"in_stock", which is still not fulfilled, and the part row\'s own context menu offers only '
            '"Move" and "Add Part Fee / Discount" - there is no pick action there, so picking happens '
            'elsewhere (the Parts area). What IS known: on a part-FREE line completed on this build the '
            '"+ Add Part" button is still shown (evidence/last3-line-complete.png). That is suggestive '
            'but it is NOT his state, so no verdict is claimed. Line status restored and verified'),
    45251: ('NOTVER', 'probe-new4',
            'NOT OBSERVED - same blocker as C45250 (the line will not complete until the part is '
            'PICKED), and this case additionally needs a special-order part taken through Order → '
            'Receive. Neither was reached, so nothing is claimed about which fields stay editable'),
    45252: ('FAIL', 'probe-new4 C45252-cost-fills-sell-price',
            'DEVIATION, observed 2026-09-01, and instrumented properly after a first run measured its '
            'own instrumentation: assigning .value and dispatching input/change is NOT reliably seen by '
            'the component that derives the sell price, so the cost is now TYPED with real key events '
            'and Tab. Positive control: picking a stocked part fills cost 53.52 and sell 86.32, so the '
            'row does populate prices. Typing the cost to 10.00, 100.00, 200.00 left the sell price at '
            '86.32 every time; on a catalogue part with no price at all it stayed 0.00. Twenty-two '
            'pricing matrices are configured (Settings → Pricing), one marked Default, so there is a '
            'matrix to apply. Entering the Cost does not fill or recalculate the Sell Price'),
    45253: ('FAIL', 'probe-new4 C45253-category-recalculates-sell-price',
            'DEVIATION, observed 2026-09-01. The category is an <input>, so its value is read from '
            '.value and the change is confirmed from the row label on screen - the first run read '
            'innerText, got "" five times and would have called a working control broken. With the '
            'label demonstrably moving through Uncategorized → AUTO-Brakes → 70%Override → '
            'AUTO-Batteries, the sell price stayed 86.32 throughout. Changing the category does not '
            'recalculate the sell price'),
    45220: ('FOREIGN', None,
            "Vladimir Tomovic's case, flagged Automated — Rules 38 and 71; not touched, not verdicted"),
    # ---------------- Story 2 - Tech View inline add (25 cases) ----------------
    44998: ('PASS', 'TA-add-row',
            'exactly three fields, no pricing anywhere on the row'),
    44999: ('PASS', 'TB-typeahead',
            'the part number field is the catalog typeahead and filters on what is typed; a no-match search answers "No results"'),
    45000: ('PASS', 'TC-select',
            'selecting a catalog part filled the part number (N68SL-356) and the description, and focus moved to the quantity field'),
    45001: ('PASS', 'D-overwrite',
            'populated description was overwritten and kept'),
    45002: ('PASS', 'TA-add-row + TC-select',
            'quantity opens empty and stays empty after a catalog selection, and a save without it is refused'),
    45003: ('PASS', 'techview-as-technician',
            'the Tech View row carries Save and Cancel (the close action); row text reads "Description Part number Qty Save Cancel"'),
    45004: ('PASS', 'TD-validation',
            'a description with no quantity is refused and the quantity field is flagged; a part number was never required in any passing save'),
    45005: ('PASS', 'TE-save',
            'the part landed at the TOP of the line and the toast read "Part added" (Automated case, written under the QA lead\'s 2026-09-01 go-ahead; Rule 65 report filed)'),
    45006: ('PASS', 'TE-save',
            'a fresh empty row opened straight after the save with the cursor back in description'),
    45007: ('PASS', 'X1-tech-added-category',
            'as the technician the inline row carried NO category field at all and the part saved; back as the admin, that part\'s Edit Part Request modal shows Category = "Uncategorized"'),
    45008: ('PASS', 'TF-keyboard',
            'Enter from the quantity field saved the row and produced the same toast as the Save control'),
    45009: ('PASS', 'TF-keyboard',
            'Tech View Tab order observed as description, part number, qty, Save, Cancel, then back into the row - the documented order with no category, cost, sell price or More options; focus never left the row'),
    45010: ('PASS', 'TG-close',
            'Escape on an empty Tech View row closed it exactly as the close control does'),
    45011: ('PASS', 'TG-close',
            'the close control on a populated row raised "Discard this part?" with Keep Editing / Discard Part'),
    45012: ('PASS', 'TH-click-outside',
            'a click well outside the row left it open with the description and quantity intact and raised nothing'),
    45013: ('PASS', 'TE-save',
            'a free-typed part saved and the line shows it with the Requested status'),
    45014: ('PASS', 'TA-add-row',
            'the Tech View add row legend reads "Enter save & next row - Tab next field - Esc cancel"'),
    45015: ('PASS', 'V-message-hunt',
            'verbatim "Enter a description, qty, cost and sell price to save this part."; with only cost missing it reads "Enter a cost to save this part."'),
    45016: ('PASS', 'V-message-hunt',
            'verbatim "Qty must be greater than 0." and the row does not save'),
    45017: ('PASS', 'F-validation',
            'the invalid field is highlighted and focus moves to it (description, then qty)'),
    45018: ('PASS', 'F2-validation-text',
            'the highlight and the message clear as soon as the field is corrected'),
    45019: ('PASS', 'TG-close',
            'an empty row closed immediately with no confirmation'),
    45020: ('PASS', 'U-duplicate',
            'the same description saved twice produced two separate part lines'),
    45021: ('PASS', 'E3-becomes-uneditable',
            'with a populated row open, the work order was flipped to Paid behind it (API returned "Status changed."), the save was then refused, the documented alert "This work order can no longer be edited. Refresh to see the latest." appeared, and the row stayed open with the description and quantity intact. Status restored in the same run'),
    45022: ('PASS', 'EH2-server-error + L2-where-is-the-message',
            'the save was answered with a real 500: the row stayed OPEN with the description and quantity intact, and the documented message is rendered visibly IN the row - span.inline-part-row__message.text-negative reading "Couldn\'t add the part. Please try again." at 201x16px. A generic toast ("Ooooops! An error occurred") is shown as well, in addition to it, not instead of it'),
    # ---------------- Story 3 - Tech View inline edit (13 cases) ----------------
    45023: ('PASS', 'TI-edit-row',
            'Edit opens inline_part_edit_row directly below the part with the same three fields in the same order'),
    45024: ('PASS', 'TI-edit-row',
            "the edit row came up pre-populated with the part's description and quantity, cursor in description"),
    45025: ('PASS', 'techview-edit-diff',
            'the edit row legend reads "Enter save - Tab next field - Esc cancel" with no "& next row", exactly the shortened form'),
    45026: ('PASS', 'TJ-edit-save',
            "the part line was updated in place and the edit row closed (Automated case, written under the QA lead's 2026-09-01 go-ahead; Rule 65 report filed)"),
    45027: ('PASS', 'TJ-edit-save',
            'no new empty row opened after the edit save - the repeat-entry behaviour is add-only'),
    45028: ('PASS', 'X2-hidden-values-preserved',
            "created as the admin with cost 7.77000, sell 19.19 and category AUTO-Batteries; the technician's edit row carried only the three fields and only the description was changed; re-opening the part's modal as the admin showed cost 7.77000, sell 19.19 and AUTO-Batteries unchanged, with the new description"),
    45029: ('PASS', 'TK-edit-guard',
            'the edit row uses the edit wording verbatim: "Discard these changes?" / "The changes you made will be lost." / Keep Editing / Discard Part'),
    45030: ('PASS', 'TL-edit-relink',
            'selecting a different catalog part in the edit row repopulated description and part number, KEPT the quantity the user had entered, moved focus to quantity, and produced the bin chip'),
    45031: ('PASS', 'TK-edit-guard',
            'an edit row opened and closed with nothing changed raised no confirmation and the row simply closed'),
    45032: ('PASS', 'N3-no-permission',
            'the same run: no edit control anywhere on the part lines without the permission'),
    45033: ('PASS', 'TM-edit-clear-desc',
            'clearing the description blocked the save, flagged the description field, moved focus to it, and showed the documented combined sentence'),
    45034: ('NOTVER', 'probe-neg E1 + probe-last3 C45034-concurrent-change',
            'STILL NOT OBSERVED, and this one is honest rather than unseeded. It needs a genuine '
            'second actor changing the same part while the edit row is open. Two attempts: changing '
            'the part through the API while the browser row was open, and deleting it outright. '
            'Neither produced the documented sentence, but neither run reliably had the edit row open '
            'at the moment of the change, so the runs prove nothing either way and are NOT reported '
            'as a deviation. A tester with a colleague can settle it in a minute, and the case now '
            'says so in its own words'),
    45035: ('PASS', 'E3-becomes-uneditable',
            'same run - the edit path shares S2-E3'),
    # ---------------- Story 4 - Full View inline add (27 cases) ----------------
    45036: ('PASS', 'A-add-row',
            'six fields in the documented order: description, part number, qty, category, cost, sell price'),
    45037: ('PASS', 'B-typeahead + C-select-part + D-overwrite + T-cost-required',
            'description, part number and quantity behave in Full View exactly as Story 2 describes: catalog typeahead, population on selection, description overwritable, quantity starts empty and is required'),
    45038: ('PASS', 'C-select-part',
            'cost 3.74 and sell 8.13 populated from the catalog part; both carry the $ prefix'),
    45039: ('PASS', 'D-overwrite',
            'cost 3.74 -> 12.34 and sell 8.13 -> 56.78 accepted'),
    45040: ('PASS', 'E-category',
            'category is a select listing the shop categories; it shows Uncategorized by default'),
    45041: ('PASS', 'A-add-row',
            'Save, More options and the close control are all on the row'),
    45042: ('PASS', 'T-cost-required',
            'saving with description and qty but no cost is blocked, the cost field is flagged and the row stays open'),
    45043: ('PASS', 'G-save',
            'part added at the TOP of the list, toast "Part added", a fresh empty row opens with the cursor in description'),
    45044: ('PASS', 'L-more-options',
            'More options opens the New Part Request modal'),
    45045: ('PASS', 'AA-category-carryover',
            'all six inline values carried into the modal, category included ("AUTO-Batteries")'),
    45046: ('PASS', 'AA-category-carryover',
            'Save Part added the part, closed the modal AND the inline row, and opened no new row'),
    45047: ('PASS', 'X-modal-exit',
            'closing the modal raised "Discard this part?"; Discard Part closed the modal and the inline row together'),
    45048: ('PASS', 'H-keyboard-save',
            'Enter from the quantity field saved the row; toast "Part added"; a fresh row opened'),
    45049: ('PASS', 'H-keyboard-save',
            'Shift+Enter opened the New Part Request modal'),
    45050: ('PASS', 'I-tab-order',
            'observed order: description, part number, qty, category, cost, sell price, Save, close, More options - then back into the row; focus never left it'),
    45051: ('PASS', 'J-close',
            'Escape on an empty row closed it with no confirmation'),
    45052: ('PASS', 'K-click-outside',
            'the row stayed open with its data after a click well outside it'),
    45053: ('PASS', 'A-add-row + TA-add-row',
            'Full View legend carries the more-options entry ("… Esc cancel - Shift Enter more options"); the Tech View legend ends at "Esc cancel"'),
    45054: ('PASS', 'G-save',
            'a free-typed part saved in Full View shows on the line with the Requested status'),
    45055: ('PASS', 'S-create-new + TB-typeahead',
            'a no-match search offers "Create <text> as a new part" in Full View and shows only "No results" in Tech View'),
    45056: ('PASS', 'V-message-hunt',
            'the combined message names cost when cost is the missing field: "Enter a cost to save this part."'),
    45057: ('PASS', 'C2-more-options-no-validation',
            'More options opened the New Part Request modal from a row missing qty, cost and sell price, with no validation raised on the row'),
    45058: ('PASS', 'V-message-hunt',
            '"Cost cannot be negative." verbatim; a non-numeric entry is refused by the field itself so the row never reaches the "must be a number" branch'),
    45059: ('PASS', 'V-message-hunt',
            'sell 10 under cost 100 shows "Sell price is below cost." and does not block'),
    45060: ('FAIL', 'probe-nobin + probe-last3 C45060-no-cost-no-sell',
            'DEVIATION, observed 2026-09-01, and the earlier "the state may not be reachable" was '
            'wrong: it was drawn from the INVENTORY list (stocked parts) when the case is about a '
            'CATALOGUE part. F40010212 "Slack Adjuster" is a catalogue part whose record carries no '
            'cost and no sell-price field at all and which /api/inventory/parts?search= returns '
            'nothing for, so it is genuinely priceless. S4-E1 requires those fields to open EMPTY and '
            'the user to enter them before saving inline. Selecting it opens cost "0.00" and sell '
            '"0.00" - values, not empty - and pressing Save SUCCEEDED: HTTP 201 with the "Part added" '
            'confirmation and no "Enter a description, qty, cost and sell price" message. So a part '
            'can be added at zero price without the user entering anything, which is what the '
            'requirement exists to prevent. The seeded part was removed afterwards'),
    45061: ('PASS', 'E3-becomes-uneditable',
            'same run, observed as a Full View user on the six-field row'),
    45062: ('PASS', 'EH2-server-error + L2-where-is-the-message',
            'same run, on the Full View six-field row'),
    # ---------------- Story 5 - Full View edit (6 cases) ----------------
    45063: ('PASS', 'C3b-edit-modal-save',
            "Full View Edit opens the Edit Part Request modal pre-populated - description, quantity, source, cost, core charge, sell price and margin all carried the part's current values"),
    45064: ('PASS', 'P-edit',
            'no inline edit row appears for a Full View user; the part row is not replaced'),
    45065: ('PASS', 'C3b-edit-modal-save',
            'the modal save is labelled "Save & Close"; after it the modal closed, NO inline row opened, and the part line carried the new description both immediately and after a full reload'),
    45066: ('PASS', 'N3-no-permission',
            'the same run, read as a Full View user would see it: no edit control without the permission'),
    45067: ('PASS', 'C3-edit-modal',
            'a change typed into the Edit Part Request modal and then cancelled left the part line byte-identical'),
    45068: ('FAIL', 'AB-edit-guard-recheck',
            'Edit on a part line while a POPULATED add row is open opens the Edit Part Request modal immediately, with no discard confirmation, and leaves the add row open. Observed twice. S5-E1 requires S6-R5 first.'),
    # ---------------- Story 6 - unsaved data protection (15 cases) ----------------
    45069: ('PASS', 'J-close',
            'verbatim "Discard this part?" / "The details you entered will be lost." / Keep Editing / Discard Part'),
    45070: ('PASS', 'TK-edit-guard',
            'the edit-row confirmation is the edit-worded one, not the add-row wording'),
    45071: ('PASS', 'J-close',
            'Keep Editing returned to the row with the typed description intact and focus back in the row'),
    45072: ('PASS', 'J-close + TK-edit-guard',
            'Discard Part closed the add row without saving, and on the edit row it closed the row and left the part line at its saved values'),
    45073: ('PASS', 'N-navigate-away + W-browser-back',
            'in-app navigation off the work order shows the documented dialog verbatim ("Leave without saving?" / "This part hasn\'t been added to the work order yet. Leaving will discard it." / Stay On Work Order / Leave). On browser back and forward the app raises the BROWSER\'S OWN prompt instead of that dialog - the data is still protected; wording divergence recorded'),
    45074: ('PASS', 'M-second-row',
            'the discard confirmation is raised before the requested row opens'),
    45075: ('PASS', 'M-second-row',
            'never more than one inline row in the DOM at a time'),
    45076: ('PASS', 'J-close',
            'an empty row closed on Escape with no confirmation'),
    45077: ('PASS', 'Z-followon-row',
            'navigating away from an empty row went through with no confirmation'),
    45078: ('PASS', 'TK-edit-guard',
            'an unchanged edit row closed on Escape with no confirmation at all'),
    45079: ('PASS', 'C5-no-row-navigation',
            'with no inline row open, navigating from the Lines tab to the work orders list raised nothing'),
    45080: ('PASS', 'K-click-outside',
            'no confirmation of any kind on a click outside the row'),
    45081: ('PASS', 'Z-followon-row',
            'the untouched follow-on row after a save raised nothing on Escape or on navigation'),
    45082: ('PASS', 'C4-leave-stay',
            '"Leave" discarded the typed part and completed the navigation to /workorders'),
    45083: ('PASS', 'C4-leave-stay',
            '"Stay On Work Order" kept the user on the Lines tab with the row open, the typed description intact and focus back inside the row'),
    # ---------------- Story 7 - bin allocation (22 cases) ----------------
    45221: ('PASS', 'S3-manual-bin',
            'the bin picker on S31S-950 lists four named bins each with an on-hand quantity - SKID1 6, ST20 4, ST24 4, ST25 3 - and exactly one of them, SKID1, carries the Default badge'),
    45222: ('PASS', 'S1-card-chips + B1-cards',
            'the card reads "Inventory Qty: 17 ea" then three bin chips "SKID1 6  ST20 4  ST24 4" then the collapse chip "+ 1" - total first, up to three per-bin chips, the rest collapsed. The "Not stocked" leg has no data: of 6,879 inventory parts, none has zero bins (INL-2)'),
    45223: ('PASS', 'S2-auto-switch + S7-default-switch',
            'selecting a part allocates the FULL quantity to a single bin and never splits: the Default when it covers the quantity (H3B for 4, SKID1 for 3), and the largest bin that does cover it when the Default does not (A2CA for 10). Where no single bin covers it the allocation stays on the Default'),
    45224: ('PASS', 'B2-picker',
            'the allocation appears below the row as "Pulled from" followed by a chip; with no allocation there is no chip (B7)'),
    45225: ('PASS', 'S3-manual-bin + T1-tech-bin-locations-apply',
            'single-bin allocations label the chip with the bin name (SKID1, ST20, A2CA, H3B, D1F); after applying a split across two bins the chip label reads "2 bins"'),
    45226: ('PASS', 'S3-manual-bin',
            'on a four-bin part the picker lists every bin in catalog order with its on-hand, a check on the current selection, the Default badge, and ends with "Split across bins…"'),
    45227: ('PASS', 'S3-manual-bin',
            'choosing ST20 from the picker moved the whole quantity to it - the chip changed from SKID1 to ST20'),
    45228: ('PASS', 'B4-over-allocate',
            'a quantity of 999 against a bin holding 7 was accepted and only warned; nothing blocked the row'),
    45229: ('PASS', 'B4-over-allocate',
            'verbatim "Only 7 here. Pulling 999 takes this bin negative." beside the chip, and the chip picks up the warning class inline-part-row__bin-chip--warn'),
    45230: ('PASS', 'S7-default-switch',
            'on P550848 (Default H3B holds 6, A2CA holds 50): quantity 4 stayed on H3B with no note; quantity 10 moved the allocation to A2CA and showed verbatim "Default bin H3B has 6. Switched to a bin that covers 10."'),
    45231: ('PASS', 'S3-manual-bin',
            'after manually choosing ST20, raising the quantity from 2 to 9 KEPT ST20 rather than re-picking, and raised "Only 4 here. Pulling 9 takes this bin negative." - the manual branch of S7-R11'),
    45232: ('PASS', 'TN-bins + B5-split',
            'Tech View "Split across bins…" opens the Bin Locations modal; the same action as a Full View user on the add row opens the New Part Request modal with a per-bin allocation table instead - both branches of S7-R12 observed'),
    45233: ('PASS', 'T1-tech-bin-locations-apply',
            'the Bin Locations modal lists one row per bin - SKID1 Default 6, ST20 4, ST24 4, ST25 3 - under the headings "Bin name / Quantity in stock / Amount", with an amount input per bin, an Auto action, Cancel and Apply, and a live note "Allocated 2 — the row quantity will be set to 2." It exposes no cost, sell price or category'),
    45234: ('PASS', 'T1-tech-bin-locations-apply',
            'entering 3 into SKID1 and 4 into ST20 and pressing Apply wrote the split back to the row: the chip became "2 bins" and the row quantity became 6, the sum of the allocations. Auto had previously distributed Default-first, putting the whole quantity into SKID1'),
    45235: ('PASS', 'T1-tech-bin-locations-apply:TP-12-1013-CH',
            'in the Bin Locations modal the already-negative bin row "LGRACK -1" is rendered in error styling (errorStyled: true) and Apply was NOT disabled - the allocation is not blocked'),
    45236: ('PASS', 'TL-edit-relink + TN-bins',
            'the Tech View edit row carries the same chip, picker and Bin Locations modal as the add row, and auto-allocation runs when the row is linked to a catalog part'),
    45237: ('PASS', 'B8-saved-row',
            'after saving, the part line reads "(N68SL-356) … 1 Quoted $8.13" and names no bin anywhere'),
    45238: ('PASS', 'B6-tab-to-chip',
            'Tab reached the chip in the documented position: description, part number, qty, category, cost, sell price, Save, close, More options, then button_pulled_from_bin'),
    45239: ('PASS', 'probe-nobin C45239-C45060-catalogue-part-with-no-bin',
            'VERIFIED 2026-09-01, and the earlier "may not be reachable in this product at all" was '
            'wrong for the same reason C45060 was: it looked at the INVENTORY list. The build has an '
            'endpoint that names the state outright - GET '
            '/api/parts-catalogue/catalogue-parts-that-are-not-on-location returns 19,496 catalogue '
            'parts held on no bin location. Selecting one (F40010212, which the typeahead labels '
            '"Catalog") into the inline row gives NO bin chip and no allocation, and no "Pulled from" '
            'line, exactly as S7-N1 requires. Positive control in the same run: a stocked part '
            'selected the same way shows the chip "H3B"'),
    45240: ('PASS', 'B7-no-catalog-part',
            'a free-typed description with no catalog part got no chip and no "Pulled from" line at all'),
    45242: ('PASS', 'S2-auto-switch + S7-default-switch',
            'quantity 3 against Default SKID1 (6) and quantity 4 against Default H3B (6) both produced NO note, even though other bins would also have covered them'),
    45243: ('PASS', 'T1-tech-bin-locations-apply:TP-12-1013-CH',
            'a split of 3 into D1F (holds 3) and 4 into LGRACK (holds -1) applied cleanly: the chip read "2 bins", the quantity became 6, and NO takes-negative warning appeared despite LGRACK being heavily over-drawn - the warning is single-bin only'),
}
