#!/usr/bin/env python3
"""Chunk 2 — clear label/menu/timing edits (design + Jira agree) + small Jira-PRD
deltas (D2 shop closures not skipped; D3 block colour default blue). LOCAL only.
Edits case bodies by id and re-dumps in the same format (indent=1, ensure_ascii
=False) so only the intended fields change. Titles kept concise (<=80)."""
import json, glob, os

CASES = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cases")

EDITS = {
    # ---- label / menu / timing (design + Jira agree) ----
    "SCH-FILT-01": {
        "title": "The 'Filters' button opens Assignment / Status / Priority filter groups",
        "steps": [
            "1. Click the 'Filters' button on the sidebar.",
            "2. Read the filter groups offered.",
            "3. Apply one filter option and look at the 'Filters' button.",
        ],
        "expected": [
            "1. The filter panel offers three groups: Assignment (Assigned, Unassigned), Status (the work order statuses supported in the app), and Priority (High, Medium, Low).",
            "2. Applying a filter narrows the flat card list.",
            "3. The 'Filters' button shows a badge with the number of active filters.",
        ],
        "notes": "Sidebar caption is 'Filters' (plural) - design + Jira SV-8687 agree (design §3, DESIGN-RECONCILIATION #1). The Status option list is deliberately NOT enumerated by the spec ('All work order statuses currently supported in the app') - capture the real list from the app live. Badge styling/count format unpinned. Confirm live at VIU.",
    },
    "SCH-VIEW-01": {
        "title": "'Filter & Display' dropdown combines department toggles, My Shifts, and VIN",
        "steps": [
            "1. Open the 'Filter & Display' dropdown in the grid toolbar.",
            "2. Read its contents and default states.",
        ],
        "notes": "Control label is 'Filter & Display' (ampersand) - design + Jira SV-8700 agree (DESIGN-RECONCILIATION #12). The VIN toggle label is 'VIN Number' (design §6). Driver: SV-8700 §9 + Claude design §1/§6. Confirm live at VIU.",
    },
    "SCH-EVT-01": {
        "title": "Create an event via right-click 'Create Event' on a grid cell",
        "steps": [
            "1. Right-click a technician's cell on a working day.",
            "2. Choose 'Create Event' from the context menu.",
            "3. Fill in a name (for example 'ZZAUTOTEST stand-up'), keep the date/times offered, and save.",
        ],
        "expected": [
            "1. The right-click context menu contains 'Create Event'.",
            "2. The event modal opens with the clicked cell's technician and date pre-set.",
            "3. Saving creates an event block on that technician's day.",
            "4. A toast with Undo appears.",
        ],
        "notes": "Menu item label is 'Create Event' (was 'New Event') - design + Jira SV-8696 agree (DESIGN-RECONCILIATION #7). Pre-fill (clicked cell's tech + date) confirmed by design. Driver: SV-8696 §4.10 + Claude design. Confirm live at VIU.",
    },
    "SCH-REAS-03": {
        "title": "Right-click a grid cell opens a menu with Create Event and New Work Order",
        "steps": [
            "1. Right-click a technician's grid cell.",
            "2. Read the menu items.",
        ],
        "expected": [
            "1. A context menu opens at the cell.",
            "2. It contains: 'Create Event' and 'New Work Order'.",
            "3. The browser's own right-click menu does not appear instead.",
        ],
        "notes": "The cell context menu is now 'Create Event' + 'New Work Order' - the old 'New Shift' / 'New Event' / 'View Day' items were removed. Design + Jira SV-8696/SV-8700 agree (DESIGN-RECONCILIATION #8). Driver: SV-8700 §7/§4.10. Confirm the exact on-screen labels live at VIU.",
    },
    "SCH-REAS-04": {
        "title": "'View Day' is no longer offered in the grid cell context menu",
        "steps": [
            "1. Right-click a technician's grid cell.",
            "2. Read the menu items.",
        ],
        "expected": [
            "1. The context menu shows only 'Create Event' and 'New Work Order'.",
            "2. There is no 'View Day' item - it was removed from the menu.",
        ],
        "notes": "'View Day' was removed from the cell context menu (menu redesigned to 'Create Event' + 'New Work Order'). Design + Jira SV-8700 agree (DESIGN-RECONCILIATION #9). Driver: SV-8700 §7. Confirm live at VIU.",
    },
    "SCH-REAS-05": {
        "title": "'New Shift' is no longer offered in the grid cell context menu",
        "steps": [
            "1. Right-click a technician's grid cell.",
            "2. Read the menu items.",
        ],
        "expected": [
            "1. The context menu shows only 'Create Event' and 'New Work Order'.",
            "2. There is no 'New Shift' item - it was removed from the menu.",
        ],
        "notes": "'New Shift' was removed from the cell context menu (menu redesigned to 'Create Event' + 'New Work Order'). Design + Jira SV-8700 agree (DESIGN-RECONCILIATION #10). Driver: SV-8700 §7. Confirm live at VIU.",
    },
    "SCH-DEL-08": {
        "title": "Toast lasts ~7s with Undo (about 4s without); stays on hover, goes on leave",
        "expected": [
            "1. Untouched, a toast that has an Undo action persists about 7 seconds; a toast without Undo persists about 4 seconds, before dismissing.",
            "2. While the cursor is over it, the toast stays (does not auto-dismiss).",
            "3. After the cursor leaves, it dismisses.",
        ],
        "notes": "Toast lifetime is 7 seconds with Undo / 4 seconds without (design code sets undo?7000:4000, DESIGN-RECONCILIATION #7, inside the spec's 4-7s window). Driver: SV-8688 §7. Confirm live at VIU.",
    },
    # ---- small Jira-PRD deltas (newer spec, last-update-wins) ----
    "SCH-SPREAD-07": {
        "title": "Spread uses the tech's working hours; skips weekends only when hours not set",
        "expected": [
            "1. Daily shifts are sized to the technician's own working hours (8h each in the example).",
            "2. Weekends are skipped ONLY when the technician has no business hours set for them; if the tech has hours on a weekend day (e.g. Saturday hours) that day is NOT skipped.",
            "3. Shop closures and public holidays are NOT skipped in V1 - shifts can be placed on those days.",
            "4. The end date is a result of the daily distribution (for 40h at 8h/day starting Monday, the series ends on the fifth working day).",
        ],
        "notes": "V1 rule (Jira SV-8691, latest-wins over the older requirements.md §12): spread skips weekends ONLY when business hours are not set for them; shop closures / public holidays are NOT skipped in V1. Driver: SV-8691 §4.5. Verify live at VIU.",
    },
    "SCH-EDGE-05": {
        "title": "Shop closures do NOT block spread in V1 - shifts can land on closure days",
        "steps": [
            "1. Open the spread step across a window that contains a shop closure day.",
            "2. Expand the preview and find the closure day.",
            "3. Confirm the spread and check the grid.",
        ],
        "expected": [
            "1. The closure day is NOT struck through or skipped by the spread in V1.",
            "2. A shift CAN be placed on the shop closure day (only weekend days with no business hours are skipped).",
            "3. The end date follows the normal daily distribution - no extra day is added for the closure.",
        ],
        "notes": "V1 rule (Jira SV-8691 Key Decision, latest-wins over the older requirements.md §12): shop closures / public holidays are NOT skipped by spread in V1. This reverses the earlier 'closures block spread' expectation. Driver: SV-8691 §4.5, §12. Verify live at VIU.",
    },
    "SCH-BLOCK-04": {
        "title": "Shift blocks default to blue; a custom colour can be set per shift",
        "steps": [
            "1. Look at a newly created shift block's colour.",
            "2. Open the shift detail modal and set a custom colour via the colour picker.",
            "3. Compare that shift with another shift from the same work order.",
        ],
        "expected": [
            "1. By default every shift block is blue (the default shift colour).",
            "2. A custom colour can be assigned per shift via the colour picker in the detail modal.",
            "3. Colour is per shift - it is NOT tied to the work order, so two shifts from the same order do not automatically share a colour.",
        ],
        "notes": "V1 rule (Jira SV-8690, latest-wins over the older requirements.md §10): all shift blocks default to blue; custom colours are optional per shift (NOT tied to the work order). SCH-COLOR-01 already agrees. Driver: SV-8690 §4.4, §10. Verify live at VIU.",
    },
}


def main():
    applied = set()
    for f in sorted(glob.glob(os.path.join(CASES, "cases-*.json"))):
        data = json.load(open(f))
        for c in data:
            if c["id"] in EDITS:
                for k, v in EDITS[c["id"]].items():
                    c[k] = v
                applied.add(c["id"])
                assert len(c["title"]) <= 80, (c["id"], len(c["title"]), c["title"])
        with open(f, "w") as fh:
            json.dump(data, fh, indent=1, ensure_ascii=False)
            fh.write("\n")
    missing = set(EDITS) - applied
    print("applied:", sorted(applied))
    print("MISSING (not found!):", sorted(missing) if missing else "NONE")


if __name__ == "__main__":
    main()
