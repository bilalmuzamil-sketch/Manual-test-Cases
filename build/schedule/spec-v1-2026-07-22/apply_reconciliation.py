#!/usr/bin/env python3
"""Apply the Schedule spec_1 + Claude-design + Branko Q&A reconciliation to the
authored case JSON — LOCAL ONLY (no TestRail writes).

Source of truth: spec-diff-v1-2026-07-22.md, design-notes-claude.md, requirements-v1.md.
Every case this script edits carries its driver in `notes` (Standing Rule 20:
spec_1 / Claude design / Branko Q&A 2026-07-22).

Run from repo root:  python3 build/schedule/spec-v1-2026-07-22/apply_reconciliation.py
"""
import json, os, re, glob

HERE = os.path.dirname(os.path.abspath(__file__))
CASES_DIR = os.path.abspath(os.path.join(HERE, "..", "cases"))

DESIGN_REF = ("Claude design (authoritative, Branko Q0): "
              "build/schedule/spec-v1-2026-07-22/design-notes-claude.md "
              "(prototype Schedule.dc.html). spec_1 added the Design link to the doc.")

# ---------------------------------------------------------------------------
# GROUP 1 — 6 expected-result edits (full field overwrites)
# ---------------------------------------------------------------------------
FULL = {
 "SCH-MODAL-04": {
   "title": "The modal shows a scope summary and the scheduled line(s) with number, title, hours, and status only",
   "expected": [
     "1. The 'Work Order Lines' section shows the line count and a scope summary of what the shift covers.",
     "2. Exactly the 2 scheduled lines are listed (not all 4), each showing its line number, title, hours, and a status pill only.",
     "3. No labor figures and no total dollar amount appear anywhere in the modal.",
     "4. This is where whole-order vs subset scope is spelled out (the grid block only says 'N Lines')."
   ],
   "notes": ("Reconciliation 2026-07-22: total-$ / labor assertion REMOVED - the "
             "authoritative modal shows line number/title/hours/status pill only, no $ "
             "anywhere. Driver: Branko Q&A 2026-07-22 Q3 + Claude design §4c. "
             "Confirm the exact section label live at VIU."),
 },
 "SCH-MODAL-08": {
   "title": "The modal offers a Delete (series-aware) action only - there is no Reassign action",
   "permissions_required": "Delete requires Schedule: Delete (spec §14.1).",
   "steps": [
     "1. Look at the modal's actions.",
     "2. Confirm there is no 'Reassign' action anywhere in the modal.",
     "3. Click Delete on a series shift and read what it asks (cancel without deleting)."
   ],
   "expected": [
     "1. The modal offers a Delete action (a trash icon in the header) and a close (x) icon - and no other actions.",
     "2. There is no 'Reassign' action in the modal; reassignment is done by dragging a shift to another technician row (covered by its own case).",
     "3. Delete on a series member asks for a deletion scope (the full scope behavior has its own cases)."
   ],
   "notes": ("Reconciliation 2026-07-22: 'Reassign' action REMOVED from the modal "
             "(reassignment is drag-only). Driver: Branko Q&A 2026-07-22 + Claude design "
             "§4c/§4d. The Delete control's exact label/icon (trash icon) pinned by design; "
             "confirm live at VIU."),
 },
 "SCH-CONF-02": {
   "title": "Working-day conflict: a shift on a day outside the technician's configured working days is flagged",
   "preconditions": [
     "1. You are signed in on a desktop browser with Schedule: Edit.",
     "2. A technician's configured working days are known (for example Monday to Friday); Saturday/Sunday columns are visible (View Options - Saturday and Sunday on).",
     "3. A schedulable work order line exists."
   ],
   "steps": [
     "1. Drop the line onto that technician's cell on a day OUTSIDE their working days (for example a Saturday when the technician works Monday to Friday).",
     "2. Look at the block and the conflict pill."
   ],
   "expected": [
     "1. The shift is created but flagged as a conflict because the day is outside the technician's configured working days (the design's reason sentence reads in the spirit of 'Scheduled on a weekend (outside Mon-Fri)').",
     "2. If the technician's working days DO include that day (for example Saturday hours are configured), a shift on that day is NOT flagged.",
     "3. The warning icon appears on the block and the conflict is listed in the toolbar dropdown."
   ],
   "notes": ("Reconciliation 2026-07-22: reframed from a fixed Saturday/Sunday rule to the "
             "technician's own configured working days. Driver: Branko Q&A 2026-07-22 Q2 "
             "(hierarchy Tech hours > Business hours > Default; Saturday hours => no conflict). "
             "The prototype hardcodes Mon-Fri/8-17 (design §5) - confirm the real per-tech "
             "hierarchy LIVE at VIU."),
 },
 "SCH-CONF-03": {
   "title": "Before hours: a shift starting before the technician's configured working-day start is flagged",
   "expected": [
     "1. The shift is flagged as a before-hours conflict (the design's reason sentence reads in the spirit of 'Starts before working hours (8:00 AM)'), measured against the technician's configured working-day start.",
     "2. The working-day start follows the hierarchy technician hours, then business hours, then the default.",
     "3. Warning icon on the block; the conflict appears in the toolbar dropdown."
   ],
   "notes": ("Reconciliation 2026-07-22: 'working-day start' now = the technician's CONFIGURED "
             "start (hierarchy Tech > Business > Default). Driver: Branko Q&A 2026-07-22 Q2. "
             "Prototype hardcodes 8:00 AM (design §5) - confirm the real hierarchy LIVE at VIU."),
 },
 "SCH-CONF-04": {
   "title": "After hours: a shift extending past the technician's configured working-day end is flagged",
   "expected": [
     "1. The shift is flagged as an after-hours conflict (the design's reason sentence reads in the spirit of 'Extends past working hours (5:00 PM)'), measured against the technician's configured working-day end.",
     "2. The working-day end follows the hierarchy technician hours, then business hours, then the default.",
     "3. Warning icon on the block; the conflict appears in the toolbar dropdown."
   ],
   "notes": ("Reconciliation 2026-07-22: 'working-day end' now = the technician's CONFIGURED "
             "end (hierarchy Tech > Business > Default). Driver: Branko Q&A 2026-07-22 Q2. "
             "Prototype hardcodes 5:00 PM (design §5) - confirm the real hierarchy LIVE at VIU."),
 },
 "SCH-VIEW-04": {
   "title": "The 'VIN Number' toggle adds the VIN to shift blocks (day/week) only; the hover tooltip and the detail modal always show the VIN",
   "steps": [
     "1. With 'VIN Number' off: read the block, hover for the tooltip, then open the detail modal.",
     "2. Turn 'VIN Number' ON in 'Filter and Display' and repeat."
   ],
   "expected": [
     "1. 'VIN Number' off: no VIN line on the block - but the hover tooltip still shows the VIN, and the detail modal still shows the VIN.",
     "2. 'VIN Number' on: the VIN appears as an additional line on blocks in day and week views (and the day-view lane grows taller to fit it).",
     "3. The 'VIN Number' toggle affects the block only - the tooltip and the modal always show the VIN when the unit has one.",
     "4. Month view blocks never show the VIN."
   ],
   "notes": ("Reconciliation 2026-07-22: RESOLVES the §4.13-vs-§9 inconsistency in favour of "
             "§4.13 - the tooltip shows VIN unconditionally; the toggle (label 'VIN Number', "
             "pinned by design) gates the shift-BLOCK VIN line only. §9 tooltip-gating prose "
             "flagged to Branko for doc hygiene. Driver: Claude design §6 + Branko Q&A 2026-07-22."),
 },
}

# ---------------------------------------------------------------------------
# VIN item 6 — related cases updated to the resolved behaviour
# ---------------------------------------------------------------------------
FULL["SCH-TIP-01"] = {
   "preconditions": [
     "1. You are signed in on a desktop browser.",
     "2. A multi-line shift exists covering 5 lines, with some time logged, for a unit that has a VIN.",
     "3. You are on the Schedule page in week view."
   ],
   "expected": [
     "1. The tooltip shows: the customer name; unit, vehicle, and VIN (the tooltip shows the VIN whenever the unit has one, regardless of the 'VIN Number' toggle); the date and time range; the technician; and a scope summary ('N lines · Xh' style).",
     "2. The individual line names appear as a short list capped at 3, with a '+N more lines' row for the rest (here '+2 more lines'); line statuses are NOT shown.",
     "3. A time-logged progress bar shows logged vs estimated hours ('X / Yh' style)."
   ],
   "notes": ("Reconciliation 2026-07-22: the hover tooltip always shows the VIN when present "
             "(NOT gated by the 'VIN Number' toggle) - the old §4.13-vs-§9 caveat is resolved "
             "by the design in favour of §4.13. The 'N lines · Xh', '+N more lines' and 'X / Yh' "
             "formats + the 3-line cap are pinned by the Claude design (§4c/tooltip). "
             "Driver: Claude design §6/§7 + Branko Q&A 2026-07-22."),
}

# ---------------------------------------------------------------------------
# GROUP 2 — events-excluded may-change notes (append)
# ---------------------------------------------------------------------------
EVENTS_NOTE = {
 "SCH-CAP-01": "Capacity bar aggregates SHIFT hours only; events do NOT count toward capacity (Branko 2026-07-22 Q1 - may change if the PO decides to support events later; design-confirmed: _capForDate iterates shifts only).",
 "SCH-CAP-02": "Events are excluded from the capacity aggregate (Branko 2026-07-22 Q1 - may change).",
 "SCH-CAP-03": "The OT calculation is over SHIFT hours only; events do not count (Branko 2026-07-22 Q1 - may change).",
 "SCH-CAP-04": "Per-tech capacity breakdown excludes events (Branko 2026-07-22 Q1 - may change).",
 "SCH-CONF-01": "Events do NOT participate in double-booked/overlap conflict detection (Branko 2026-07-22 Q1 - may change; design-confirmed: _conflictReasons iterates shifts only).",
 "SCH-CONF-05": "Events are excluded from the conflict count/list (Branko 2026-07-22 Q1 - may change).",
}

# ---------------------------------------------------------------------------
# GROUP 3 — design-PINNED folds (note replaced; wording already matches the
# design's labels except where noted; 'VIU-confirm'/'no designs' hedge removed;
# driver cited per Rule 20). ~pinned set.
# ---------------------------------------------------------------------------
PINNED_NOTE = {
 "SCH-NAV-01": "Nav item 'Schedule' and its position (Work Orders · Schedule · Customers · Parts · Reports) pinned by the Claude design (§1); live-confirm deferred to VIU (Rule 12). Driver: Claude design §1.",
 "SCH-NAV-03": "'Day / Week / Month' segmented control pinned by the Claude design (§1); confirm live at VIU. Driver: Claude design §1.",
 "SCH-NAV-05": "Collapsible department group headers pinned by the Claude design (§1, 'SERVICE'/'ADMINISTRATION' collapsible groups); confirm the exact collapse affordance live. Driver: Claude design §1.",
 "SCH-MCAL-04": "Mini-calendar selected/today/week-hover highlights pinned by the Claude design (§2 mini calendar); live-render confirm at VIU. Driver: Claude design §2.",
 "SCH-WOL-01": "Flat WO card list with NO Assigned/Unassigned tabs (assignment is a Filter option) confirmed by the Claude design (§2). Driver: Claude design §2 + Branko Q&A 2026-07-22 (tabs removed in a previous version).",
 "SCH-WOL-02": "WO card anatomy (WO number accent top-left, 'N lines · Xh Est.' top-right, customer bold, unit, lead-tech row, status left-border) pinned by the Claude design (§2); live-render confirm at VIU. Driver: Claude design §2.",
 "SCH-WOL-03": "'Search work orders' placeholder pinned by the Claude design (§2); confirm live at VIU. Driver: Claude design §2.",
 "SCH-LINE-04": "Line row (drag handle, title, hours, avatar-stack roster + count) pinned by the Claude design (§2 line drill-down); confirm live. Driver: Claude design §2.",
 "SCH-LINE-05": "'Needs techs' badge pinned by the Claude design (§2); confirm live at VIU. Driver: Claude design §2.",
 "SCH-LINE-06": "'Search lines' placeholder pinned by the Claude design (§2); confirm live at VIU. Driver: Claude design §2.",
 "SCH-LINE-07": "'All N / Unscheduled N' chips with counts pinned by the Claude design (§2); confirm live at VIU. Driver: Claude design §2.",
 "SCH-DND-06": "Drop-target highlight + ghost block (line name + hours) pinned by the Claude design (line-drag sub-prototype, §0/§3); live-render confirm at VIU. Driver: Claude design.",
 "SCH-SCOPE-01": "'Schedule whole work order' pinned row (accent, line count + total hours) pinned by the Claude design (§4a); confirm live. Driver: Claude design §4a.",
 "SCH-SCOPE-05": "'Select multiple' checkbox mode + confirm bar 'Create shift · N lines · Xh' + 'Select all'/'Unselect all' pinned by the Claude design (§4a); confirm live. Driver: Claude design §4a.",
 "SCH-SCOPE-06": "'Select all'/'Unselect all'/'Cancel' and the whole-order label 'Whole order · Xh' pinned by the Claude design (§4a); confirm live. Driver: Claude design §4a.",
 "SCH-SPREAD-01": "Spread header 'STEP 2 · SPREAD' + scope + 'Change scope' back-link pinned by the Claude design (§4b); confirm live. Driver: Claude design §4b.",
 "SCH-SPREAD-03": "How-much options 'Full estimate' (default) / '1 week' / '2 weeks' / 'Until a date…' / 'Specific hours…' pinned by the Claude design (§4b); confirm live. Driver: Claude design §4b.",
 "SCH-SPREAD-04": "'Until a date…' label pinned by the Claude design (§4b) - it reveals a finish-by date field. What happens when the estimate cannot fit by the chosen date is NOT pinned - observe live and raise a PO question if ambiguous. Driver: Claude design §4b.",
 "SCH-SPREAD-05": "'Specific hours…' label pinned by the Claude design (§4b) - it reveals an hours stepper. Stepper bounds/increments not pinned - capture live. Driver: Claude design §4b.",
 "SCH-SPREAD-08": "Preview one-liner ('N shifts · <start> → <end> · skips weekends + N closures', expandable week-by-week) pinned by the Claude design (§4b); confirm the exact copy live. Driver: Claude design §4b.",
 "SCH-SER-01": "Month series banner (continuous wrap, labeled once, faded '↳ continues' on later weeks) pinned by the Claude design (§3); live-render confirm at VIU. Driver: Claude design §3.",
 "SCH-SER-02": "Week series banner + edge chevrons + 'week N of M' cue pinned by the Claude design (§3); confirm live. Driver: Claude design §3.",
 "SCH-SER-03": "Day series cue 'Part of an N-week job' pinned by the Claude design (§3/§4e 'Part of a 6-week job'); confirm live. Driver: Claude design §3.",
 "SCH-BLOCK-01": "Shift block = customer / unit / line name (three text lines, no WO number, no $) pinned by the Claude design (§3); live-render confirm at VIU. Driver: Claude design §3.",
 "SCH-BLOCK-02": "Multi-line/whole-order block reads 'N Lines' pinned by the Claude design (§3, block shows lineName|'N Lines'); confirm live. Driver: Claude design §3.",
 "SCH-BLOCK-04": "Block color tied to the work order (same-order blocks share color) pinned by the Claude design (§3); live-render confirm at VIU. Driver: Claude design §3.",
 "SCH-BLOCK-05": "Conflict warning icon is the only icon on a block (no WO number, no scope icons) pinned by the Claude design (§3); confirm live. Driver: Claude design §3.",
 "SCH-LANE-03": "3-lane cap + '+N more' overflow popover pinned by the Claude design (§3, MAX_CHIPS / lane stacking); confirm the exact label live. Driver: Claude design §3.",
 "SCH-DAY-07": "VIN-on grows the day-view lane height (DAY_LANE_H schedVin 96 vs 80) pinned by the Claude design (§3); the toggle label is 'VIN Number' (design §6). Driver: Claude design §3/§6.",
 "SCH-MODAL-01": "Modal identity (customer, unit · asset, VIN when present) pinned by the Claude design (§4c) - the modal always shows the VIN. WO id per spec §4.9; confirm live. Driver: Claude design §4c + §6.",
 "SCH-MODAL-07": "Conflict banner 'Scheduling conflict' + reason list + 'Adjust' action pinned by the Claude design (§4c); what 'Adjust' opens - capture live. Driver: Claude design §4c.",
 "SCH-EVT-01": "'New Event' right-click menu item pinned by the Claude design (§4c/context menu); pre-fill (clicked cell's tech + date) confirmed by design; confirm live. Driver: Claude design.",
 "SCH-EVT-06": "Event card anatomy (white/neutral outlined card, calendar icon chip, name + time range, no colored left rail) pinned by the Claude design (§3); live-render confirm at VIU. Driver: Claude design §3.",
 "SCH-EVT-07": "Event default neutral/grey + shared color palette pinned by the Claude design (§3/§4c color picker); confirm live. Driver: Claude design.",
 "SCH-CAP-01": "Day-column capacity bar (blue fill, clamped, equal track widths) pinned by the Claude design (§3 week/month cap bars); live-render confirm at VIU. Driver: Claude design §3.",
 "SCH-CAP-02": "Amber spill past the track + tick at 100% pinned by the Claude design (§3 capacity visualization); confirm live. Driver: Claude design §3.",
 "SCH-CAP-03": "'OT' text tag pinned by the Claude design (§3 week headers show 'OT' tags); confirm live. Driver: Claude design §3.",
 "SCH-CAP-04": "Capacity hover tooltip (per-tech breakdown, OT techs in amber) pinned by the Claude design (§3 cap-tooltip render); confirm live. Driver: Claude design §3.",
 "SCH-TIP-05": "Tooltip flip-above / horizontal-shift to stay in the viewport pinned by the Claude design (tooltip positioning); confirm live. Driver: Claude design §4.",
 "SCH-TOOL-01": "'Today' button pinned by the Claude design (§1 grid toolbar); confirm live. Driver: Claude design §1.",
 "SCH-TOOL-02": "Left/right nav arrows + date-range label ('Jul 12 – 18, 2026' week / 'July 2026' month) pinned by the Claude design (§1); confirm live. Driver: Claude design §1.",
 "SCH-TOOL-03": "Toolbar search fade-non-matching/highlight-matching pinned by the Claude design (§0/search fade render); WO number searchable though not printed on the block. Driver: Claude design.",
 "SCH-VIEW-01": "'Filter and Display' checkbox dropdown (department toggles, 'My Shifts', VIN) pinned by the Claude design (§1); NOTE the VIN toggle label is 'VIN Number' (design §6). Driver: Claude design §1/§6.",
 "SCH-VIEW-05": "'View Options' toggles (Business Hours, Capacity Bars, Events, Tech Hours, Saturday, Sunday) pinned by the Claude design (§1 View Options icon/popover); confirm the exact labels + defaults live. Driver: Claude design §1.",
 "SCH-REAS-01": "Drag-reassign + cross-tech confirmation modal (Cancel / Confirm) pinned by the Claude design (§4d reassignModal); confirm the exact copy live. Driver: Claude design §4d.",
 "SCH-DEL-01": "Series delete-scope modal ('Remove from series', 'Part of a 6-week job · 20 shifts', each option with a 'returns Nh' chip) pinned by the Claude design (§4e); confirm the exact wording live. Driver: Claude design §4e.",
 "SCH-DEL-05": "Scope options adapt to position; labels ('This shift only'/'This and everything after'/'The whole series') pinned by the Claude design (§4e); confirm the two-option end cases live. Driver: Claude design §4e.",
 "SCH-KEY-01": "Escape closes the topmost layer per the design's enumerated 13-layer stacking order (delete scope, reassign, spread, capacity, event modal, event view, line picker, shift detail, cell menu, calendar picker, customize, filters, search) - pinned by the Claude design code; exercise the layers live. Driver: Claude design §4.",
}

# ---------------------------------------------------------------------------
# GROUP 4 — SCH-REAS-02 retire-proposed
# ---------------------------------------------------------------------------
RETIRE = {
 "SCH-REAS-02": ("Retire-proposed - Reassign-in-modal removed (Branko 2026-07-22); "
                 "pending user delete authorization",
   "RETIRE-PROPOSED (reconciliation 2026-07-22): the 'Reassign' action in the shift detail "
   "modal was REMOVED (Branko 2026-07-22) and is absent from the authoritative Claude "
   "prototype (design §4c/§4d) - reassignment is drag-only, fully covered by the "
   "drag-reassignment case. Do NOT delete from TestRail (C30053) or from the id-map yet; "
   "kept in place pending user delete authorization. Driver: Branko Q&A 2026-07-22 + "
   "Claude design §4c."),
}

# ---------------------------------------------------------------------------
# GROUP 5 — 2 NEW cases (VIU-Pending, no C-id yet)
# ---------------------------------------------------------------------------
NEW_EVT = {
 "id": "SCH-EVT-08",
 "area": "Events",
 "title": "An event does not count toward a technician's capacity bar and does not raise a conflict",
 "priority": "Medium",
 "type": "Functional",
 "permissions_required": "Schedule: Edit to set up; View to observe (spec §14.1).",
 "preconditions": [
   "1. You are signed in on a desktop browser with Schedule: Edit.",
   "2. Capacity Bars and Events are ON in View Options.",
   "3. A technician has a shift and, on the same day/time, an event (create both, ZZAUTOTEST)."
 ],
 "steps": [
   "1. Note the day's capacity bar fill with only the shift present.",
   "2. Add an all-day (or long) event on the same technician and day.",
   "3. Look at the capacity bar again and check for any conflict on the block and in the toolbar conflict pill."
 ],
 "expected": [
   "1. Adding the event does NOT change the capacity bar fill - events are not counted toward booked/available hours.",
   "2. The event does NOT create a double-booked or overlap conflict with the shift, and the toolbar conflict count does not increase because of it.",
   "3. Only shifts drive capacity and conflicts."
 ],
 "design_ref": DESIGN_REF,
 "spec_ref": "requirements.md §4.10 (Events), §4.11, §4.12",
 "viu_status": "VIU-Pending",
 "notes": ("NEW case (reconciliation 2026-07-22). Driver: Branko Q&A 2026-07-22 Q1 (events "
           "currently excluded from capacity + conflict) - design-confirmed (prototype "
           "_capForDate / _conflictReasons iterate shifts only). MAY CHANGE if the PO decides "
           "to support events later. No TestRail C-id yet - pending authorized add_case."),
 "api_related": False,
}

NEW_PERM = {
 "id": "SCH-PERM-12",
 "area": "Permissions",
 "title": "With Work Orders: View OFF, work-order-derived details on shifts (customer, lines, money fields) are hidden or masked",
 "priority": "High",
 "type": "Negative",
 "permissions_required": "A role with Schedule: View (or higher) but Work Orders: View OFF. Set up the test user's role at VIU per Standing Rule 5 and restore after.",
 "preconditions": [
   "1. A test user's role has Schedule access but Work Orders: View OFF (assign a suitable role; restore after).",
   "2. Shifts already exist on the grid, created by a fully-permissioned user, for units that have customers, scheduled lines, and a VIN.",
   "3. You are signed in AS that user on a desktop browser, on the Schedule page."
 ],
 "steps": [
   "1. Look at a shift block on the grid and read its text lines.",
   "2. Hover the shift for its tooltip.",
   "3. Open the shift's detail modal and read the work-order-derived fields."
 ],
 "expected": [
   "1. Work-order-derived details (customer, the scheduled line list, and any money-bearing fields) are hidden or masked wherever they would normally appear - on the block, in the tooltip, and in the modal.",
   "2. The schedule structure itself (the shift's day, time, and technician) stays visible so the grid remains usable.",
   "3. This extends the sidebar behavior (the work order list and drill-down are hidden) to the work-order data surfaced on the shifts themselves."
 ],
 "design_ref": DESIGN_REF,
 "spec_ref": "requirements.md §14.2 (Work Orders: View dependency)",
 "viu_status": "VIU-Pending",
 "notes": ("NEW case (reconciliation 2026-07-22). Driver: Branko Q&A 2026-07-22 Q3 ('We do "
           "not show total $ anywhere in the schedule. We can hide other items that fall under "
           "that permission'). Complements the sidebar-hide permission case. Confirm the exact "
           "masking (hidden vs placeholder) live at VIU. No TestRail C-id yet - pending "
           "authorized add_case."),
 "api_related": False,
}

# ---------------------------------------------------------------------------
def apply():
    files = sorted(glob.glob(os.path.join(CASES_DIR, "cases-*.json")))
    edited_ids = set()
    total = 0
    for fp in files:
        data = json.load(open(fp))
        changed = False
        for c in data:
            total += 1
            cid = c["id"]
            # (0) global: refresh design_ref (design now exists) + clean "(no designs)"
            if c.get("design_ref") != DESIGN_REF:
                c["design_ref"] = DESIGN_REF
                changed = True
            if "(no designs)" in (c.get("notes") or ""):
                c["notes"] = c["notes"].replace(
                    "(no designs)", "(Claude design now available; live-render confirm at VIU)")
                changed = True
            # (1) full field overwrites
            if cid in FULL:
                for k, v in FULL[cid].items():
                    c[k] = v
                edited_ids.add(cid); changed = True
            # (2) pinned-note folds (only if not already given a FULL note)
            if cid in PINNED_NOTE and cid not in FULL:
                c["notes"] = PINNED_NOTE[cid]
                edited_ids.add(cid); changed = True
            # (3) events-excluded notes (APPEND last, so it survives a pinned fold)
            if cid in EVENTS_NOTE:
                add = EVENTS_NOTE[cid]
                base = (c.get("notes") or "").strip()
                if add not in base:
                    c["notes"] = (base + " " + add).strip() if base else add
                edited_ids.add(cid); changed = True
            # (4) retire
            if cid in RETIRE:
                c["viu_status"] = RETIRE[cid][0]
                c["notes"] = RETIRE[cid][1]
                edited_ids.add(cid); changed = True
        # (5) inject NEW cases into the right files
        if os.path.basename(fp).startswith("cases-D"):
            if not any(x["id"] == "SCH-EVT-08" for x in data):
                idx = max(i for i, x in enumerate(data) if x["id"].startswith("SCH-EVT-"))
                data.insert(idx + 1, NEW_EVT)
                changed = True
        if os.path.basename(fp).startswith("cases-F"):
            if not any(x["id"] == "SCH-PERM-12" for x in data):
                idx = max(i for i, x in enumerate(data) if x["id"].startswith("SCH-PERM-"))
                data.insert(idx + 1, NEW_PERM)
                changed = True
        if changed:
            with open(fp, "w") as f:
                f.write(json.dumps(data, indent=1, ensure_ascii=False) + "\n")
            print("wrote", os.path.basename(fp), "cases:", len(data))
    print("total cases scanned:", total)
    print("content-edited ids:", len(edited_ids))
    print("NEW cases added: SCH-EVT-08, SCH-PERM-12")


if __name__ == "__main__":
    apply()
