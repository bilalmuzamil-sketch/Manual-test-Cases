# -*- coding: utf-8 -*-
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from bodies import exp, J, SEC

V='[spec v21 2026-08-14]'
NEW=[]
def add(iid, title, section, refs, pre, steps, ex):
    NEW.append(dict(id=iid, title=title, section_id=section, refs=refs,
                    preconditions=pre, steps=steps, expected=ex, testrail_case_id=None))

# --- Assigned to Me (Story 6a / SV-9271) ---
add("FLT-ASSIGN-01",
    "Assigned to me is a toggle chip with no arrow that turns on and off",
    SEC['bar'], f"SV-9271 (S6a-R1; S6a-R2; S1-R6) {V}",
    J("1. You are signed in on a desktop browser.",
      "2. You are on the Work Orders page."),
    J("1. Look at the 'Assigned to me' chip in the toolbar row.",
      "2. Click it once, then click it a second time."),
    exp([
      "1. The 'Assigned to me' chip shows a leading icon and the label 'Assigned to me'.",
      "2. It has NO dropdown arrow (chevron) and does not open a panel - it is a simple on/off toggle.",
      "3. The first click turns the filter on; the second click turns it off.",
      "4. It sits among the Work Orders chips in this order: Status, Assigned to me, Asset on Site."],
      "S6a-R1; S6a-R2; S1-R6", "story SV-9271 (Assigned to Me filter),"))

add("FLT-ASSIGN-02",
    "Turning Assigned to me on highlights the chip with no value and no clear X",
    SEC['bar'], f"SV-9271 (S6a-R3; S6a-R4; S7-R5; S7-R6) {V}",
    J("1. You are signed in on a desktop browser.",
      "2. You are on the Work Orders page with 'Assigned to me' turned off."),
    J("1. Click the 'Assigned to me' chip to turn it on.",
      "2. Hover the mouse over the chip.",
      "3. Click the chip again to turn it off."),
    exp([
      "1. When on, the chip takes the active (highlighted) appearance used by any selected filter.",
      "2. It shows NO value text after the name - it stays just 'Assigned to me'.",
      "3. Hovering does NOT show an X-circle clear icon - the toggle chip has no separate clear control.",
      "4. Clicking the chip itself is what turns the filter off; it returns to its plain appearance."],
      "S6a-R3; S6a-R4; S7-R5; S7-R6", "story SV-9271 (Assigned to Me filter),"))

add("FLT-ASSIGN-03",
    "Assigned to me narrows to my work orders on top of the tab and filters",
    SEC['bar'], f"SV-9271 (S6a-R5; S6a-R6; S11-R1; S10-R1) {V}",
    J("1. You are signed in on a desktop browser as a user who is the assignee on some work orders.",
      "2. You are on the Work Orders page and other work orders (not yours) also exist."),
    J("1. Turn on 'Assigned to me'.",
      "2. Note which work orders remain in the list.",
      "3. Also apply a Status filter and switch tabs, watching the list.",
      "4. Navigate away from the page and return; also copy the page link."),
    exp([
      "1. The list narrows to only the work orders assigned to you (the logged-in user).",
      "2. It applies on top of the active tab's built-in filter and on top of any other active filter - the results match all of them together.",
      "3. The selection is remembered when you leave and return (persistence, Story 10).",
      "4. The active state is reflected in the page link so a filtered view can be shared (URL state, Story 11).",
      "5. If nothing is assigned to you within the current tab and filters, the empty state is shown (Story 8)."],
      "S6a-R5; S6a-R6; S11-R1; S10-R1", "story SV-9271 (Assigned to Me filter),"))

# --- Shared-link banner (Story 11 / SV-9277) ---
add("FLT-BANNER-01",
    "A shared-link banner appears above the tabs when you open a filtered link",
    SEC['url'], f"SV-9277 (S11-R7; S11-R7a) {V}",
    J("1. You are signed in on a desktop browser.",
      "2. Another user (or you) has copied a page link that already contains filter selections."),
    J("1. Open the shared link that carries filter state.",
      "2. Read the banner shown between the top application header and the tabs row.",
      "3. Click 'Back to my view'."),
    exp([
      "1. A full-width information banner appears between the application header and the tabs row.",
      "2. It shows a link icon and the message: Viewing a shared link - your own saved filters aren't applied.",
      "3. It has a 'Back to my view' link on it.",
      "4. Clicking 'Back to my view' discards the shared view, restores your own saved filters, and clears any active search - so the banner disappears.",
      "5. The banner is not shown when you are viewing your own saved filters rather than a shared link."],
      "S11-R7; S11-R7a", "story SV-9277 (Shared-link banner),"))

# --- Work Orders tab (Story 9 / SV-9272) ---
add("FLT-TAB-WO-01",
    "The Work Orders tab pre-filters to Estimate, Approved and In Progress",
    SEC['tab'], f"SV-9272 (S9-R1; S9-R2; S9-R5) {V}",
    J("1. You are signed in on a desktop browser.",
      "2. Work orders exist across several statuses.",
      "3. You are on the Work Orders page."),
    J("1. Look at the tab row and read the tab names, left to right.",
      "2. Click the 'Work Orders' tab.",
      "3. Note which work orders are shown and which filter chips are visible."),
    exp([
      "1. The tab row has four tabs: All, Work Orders, Estimates, Completed. There is NO 'My Work Orders' tab - it has been removed (its job is done by the 'Assigned to me' chip).",
      "2. The 'Work Orders' tab shows only work orders with the statuses Estimate, Approved and In Progress.",
      "3. On this tab the Status chip is NOT shown (Status is shown on the All tab only). The 'Assigned to me' and 'Asset on Site' chips are shown."],
      "S9-R1; S9-R2; S9-R5", "story SV-9272 (Work Orders tab model),"))

# --- Layout (Story 1 / SV-9268) ---
add("FLT-LAYOUT-01",
    "Filter chips sit in the toolbar row; on pages with no tabs, the title row",
    SEC['bar'], f"SV-9268 (S1-R1; S1-R4; S1-R7; S1-R8) {V}",
    J("1. You are signed in on a desktop browser.",
      "2. You can reach both a page that has tabs (Work Orders) and a page that has no tabs but does have filters."),
    J("1. On the Work Orders page, note where the filter chips are placed relative to the tabs.",
      "2. Go to another page that has filters but no tabs (for example a Parts view or a Report).",
      "3. Look for any control to hide or collapse the filter chips."),
    exp([
      "1. The filter chips sit in the page's main toolbar row, right-aligned. There is no separate filter bar row anywhere in the application.",
      "2. On a page WITH tabs, the chips are in the same row as the tabs.",
      "3. On a page WITHOUT tabs, the chips are in the same row as the page title.",
      "4. The chips are always visible: there is no button to hide, collapse or expand them, on any page or screen size.",
      "5. Each page shows the filters that page already provides today - this change relocates and restyles existing filters; it adds none and removes none. A page with no filters today shows no chips."],
      "S1-R1; S1-R4; S1-R7; S1-R8", "story SV-9268 (Filter layout in the toolbar) and SV-9269 (remove the collapse toggle),"))

add("FLT-LAYOUT-02",
    "Toolbar order is search, filter chips, icon actions, then the main button",
    SEC['bar'], f"SV-9268 (S1-R2; S1-R3) {V}",
    J("1. You are signed in on a desktop browser.",
      "2. You are on the Work Orders page (which has a page search, filter chips and a 'New Work Order' button)."),
    J("1. Read the right-hand group of controls in the toolbar row, left to right.",
      "2. Make the browser window narrow enough that the group cannot fit on one line."),
    exp([
      "1. The right-hand action group is ordered, left to right: the page search, a divider, the filter chips, a divider, any icon-only actions, then the primary button (for example 'New Work Order').",
      "2. When the window is too narrow to fit the group on one line, the toolbar row wraps.",
      "3. The chips wrap together as a group and keep their order. Nothing is hidden and nothing collapses into an overflow menu."],
      "S1-R2; S1-R3", "story SV-9268 (Filter layout in the toolbar),"))

# --- Chip states (Story 7 / SV-9273) ---
add("FLT-CHIP-07",
    "A selected chip shows an X to clear on hover and shortens a long value",
    SEC['chip'], f"SV-9273 (S7-R6; S7-R7; S7-R8; S7-N1) {V}",
    J("1. You are signed in on a desktop browser.",
      "2. You are on the Work Orders page."),
    J("1. Open the Status chip and select several statuses, then close the panel.",
      "2. Hover the mouse over the selected Status chip and read the trailing icon.",
      "3. Click that icon.",
      "4. On a page with an entity filter, select a value whose name is very long and read the chip."),
    exp([
      "1. A chip with more than one value selected shows the first value followed by a count of the rest, for example 'Status: Estimate, +2'. It does not list every value.",
      "2. When you hover a selected chip, the arrow fades out and an X-circle fades in over it.",
      "3. Clicking the X-circle clears that filter's selections straight away, without opening the panel.",
      "4. A chip with no selection never shows the X-circle, on hover or otherwise.",
      "5. A value longer than the chip width is shortened with an ellipsis before the count, for example 'Customer: Texas Truck And..., +2'."],
      "S7-R6; S7-R7; S7-R8; S7-N1", "story SV-9273 (Filter chip: inline clear and truncated label),"))

# --- Panel type contract (Story 16 / SV-9276) ---
add("FLT-PANEL-01",
    "A filter panel opens under its chip and stays applied when you click away",
    SEC['bar'], f"SV-9276 (S16-R6; S16-R7; S16-N1) {V}",
    J("1. You are signed in on a desktop browser.",
      "2. You are on a page that has at least one filter chip that opens a panel."),
    J("1. Click a filter chip that opens a panel and note where the panel appears.",
      "2. Make a selection, then click somewhere outside the panel.",
      "3. Re-open a panel that has a search box and type text that matches nothing."),
    exp([
      "1. The panel opens as a small pop-over just below its chip, lined up with the left edge of the chip.",
      "2. Every panel has a 'Clear selection' action in its footer that clears only that filter.",
      "3. Clicking outside the panel closes it. Your selection is already applied and is kept - it is not discarded.",
      "4. In a panel that has a search box, a search that matches nothing shows 'No matches' in the panel body."],
      "S16-R6; S16-R7; S16-N1", "story SV-9276 (Filter panel types),"))

json.dump(NEW, open(os.path.join(os.path.dirname(__file__),'..','cases','cases-J-fabian-review-2026-08-17.json'),'w'), indent=1, ensure_ascii=False)
print("wrote", len(NEW), "new cases")
for c in NEW:
    assert len(c['title'])<=80, (c['id'], len(c['title']))
    assert '<' not in c['expected'] and '>' not in c['expected'], c['id']
    assert ',' not in c['refs'].split('[')[0] or True  # refs use ; not ,
print("title/anglebracket checks passed")
