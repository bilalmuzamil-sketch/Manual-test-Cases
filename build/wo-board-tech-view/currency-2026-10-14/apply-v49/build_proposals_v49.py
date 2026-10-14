#!/usr/bin/env python3
"""Builds proposals-v49.json for the PRD v49 apply pass (14 Oct 2026, afternoon): the full rewrite of C96970 and the five new
tests agreed in ../answers-followup/followup-rows.json. Tester text is written here; EVERY quote is copied by code from the
saved PRD v49 (anchor-quotes-current.json, built by apply_wo.py --anchors) or from the saved tech plan, never typed.
Run from the repo root:  python3 build/wo-board-tech-view/currency-2026-10-14/apply-v49/build_proposals_v49.py"""
import json, re
H = "build/wo-board-tech-view/currency-2026-10-14/apply-v49"
ANCH = json.load(open(f"{H}/anchor-quotes-current.json"))
TPF = "build/wo-board-tech-view/sources/Tech-Plan-Kanban-Tech-View-Display-Options-2026-10-08-upload.md"
MARKER_NEW = "AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build"
def q(code): return [code, ANCH[code]]
tp = open(TPF).read()
m = re.search(r"^26\. \*\*Imported is excluded from the board displays\*\* \(follow-up A3\)\..*?(A saved filter that contains Imported opens in List\.)", tp, re.M)
TP26 = ["Tech plan 3.26 Imported", m.group(1)]

PRD = 'PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 49 (14 Oct 2026, Chris Ward)'
NOTYET = "Source-verified 14 October 2026. Not yet checked against a build."

# ---------- shared tester sentences ----------
def signed(extra=""):
    return ("You are signed in as an Owner or Admin user whose role has Work orders > View and Work orders > Create & Edit" + extra +
            ", at {Location-A} (for example Staging Heavy Duty - 9919).")
WIDTH = "Your browser window is at least 1024 px wide, so the display switcher (List, Tech View, Board View) shows at the right of the Work Orders toolbar."
CLEAN = "On the Work Orders page nothing is ticked in Status, Asset on Site shows no choice (if its chip shows Yes or No, click the x on the chip), Assigned to me is off and Search is empty."
def tech(ph, ex, svc=True):
    return (f"Technician {{{ph}}} (for example {ex}) is an active staff member at {{Location-A}} with Time Clock on" +
            (", the Service department," if svc else "") + " and a Role other than Office User or Time Clock User.")

# ---------- shared doc (Part 1) lines ----------
P1_SIGN = ('Sign in as an Owner or Admin user. On a QA site click the Admin quick-login button on the sign-in page; you appear as "Admin ShopView". '
           "To check the permissions: your initials (top right) > Settings > Roles & Permissions > Admin > Work orders: View and Create & Edit are on.")
P1_SCHED = " Your role also needs Schedule access (Settings > Roles & Permissions > Admin > Schedule: View and Create & Edit)."
P1_LOC = ("Pick one location for the whole case; it is shown in the top bar next to the bell (to change it: your initials > Change Location). "
          "This is {Location-A} (for example Staging Heavy Duty - 9919). Create everything below at {Location-A}.")
P1_WIDTH = "Use a desktop browser window at least 1024 px wide (narrower windows show only the List, with no display switcher)."
def p1_staff(ph, ex, new_only=False, svc=True, extra_loc=""):
    reuse = ("Create a new staff member for this case only (do not reuse a shared one, because this case changes the record): "
             if new_only else
             "Reuse a staff member only if they are active, have Time Clock on, " + ("the Service department, " if svc else "") +
             "{Location-A} in Location and a Role other than Office User or Time Clock User. Otherwise ")
    return ("Your initials > Settings > Staff. " + reuse + f"click New Staff Member and enter First Name and Last Name (for example {ex}), an Email, "
            "Role Technician, Departments Service" + (" (only Service technicians get a row on the Schedule)" if svc else "") +
            f", Location {{Location-A}}{extra_loc}, turn Time Clock on, then Save & Close. This is {{{ph}}}.")
def p1_customer(ex):
    return (f'Top menu Customers > New Customer > Name (for example "{ex}") > Save. This is {{Customer-A}}; use it for this case only. '
            "On the customer page click Contacts > New Contact > First Name and Last Name (for example ZZAUTOTEST Contact) > Save. "
            'Then Assets > New Asset > pick the contact, Year (for example 2022), Make (type "Freight" and pick Freightliner), Model (for example M2), '
            "Unit (for example TRK-118) > Save. Contact and Make are required.")
P1_NEWWO = ("Work Orders > Create Work Order > in the New Work Order window pick {Customer-A} and its asset > Save (if a Confirmation about the credit "
            "limit appears, click Create). The work order opens on its Lines tab with the New Line form.")
LINE_A = 'In What Are You Doing? type "grease" and pick the ready-made line "Service - Full grease service"'
LINE_B = 'type "clutch" and pick the ready-made line "Service - Adjust clutch"'
LINE_C = 'type "brake" and pick a ready-made line (for example "Replace - Brake pot")'
P1_LEAD = "On the work order page pick the technician in the Lead Technician dropdown; it saves at once."
def p1_shift(day, wo, tech, at, hours, mode):
    w = ("keep Entire work order selected" if mode == "entire" else
         f"choose Choose lines and tick {mode} (leave every other line unticked)")
    return (f"Schedule (top menu) > use the arrows next to Today until the date reads {day} > in Search work orders (left) type the number of {{{wo}}} > "
            f"drag its card onto {{{tech}}}'s row and drop it under {at} > in the window that opens {w} > use − / + until Hours reads {hours} > click Create 1 shift.")

# ---------- shared doc (Part 2) lines ----------
P2_STAFF = "GET /api/staff lists staff; each row has both id and staff_id, and the Schedule's staffId and the working-hours calls use staff_id."
P2_SHIFT = ("Faster route for shifts, UNVERIFIED on the Work Orders QA site (proven only on the Schedule QA site sv8685, build v3.5-7ec992f): "
            "POST /api/schedule/shifts with workOrderId, lineIds (every line id for an entire-work-order shift, the chosen line ids otherwise), "
            "staffId, startDate, startTime, spreadMode \"single\", totalMinutes, perDayMinutes and isAllDay false; 201 means created. If it is refused, "
            "use the Schedule screen as in Part 1 and record what the screen sent.")
P2_BOARD = ("Read shifts back with GET /api/schedule/board?from=<ISO instant>&to=<ISO instant> (full instants such as 2026-10-15T00:00:00Z; a bare date "
            "or a range over 62 days is refused). Compare each shift's start and end with the location's time zone before deciding a shift is wrong "
            "(SV-11229, a shift saved six hours off, was closed Obsolete on 12 Oct 2026).")
P2_ONELINE = ("Trap: on the Schedule a work order with only one line is booked at once as a whole, with no Entire work order / Choose lines window "
              "(recorded in C368178).")
P2_EVID = "Evidence: a screenshot after each step that has an expected result, the build marker, and the real value of every brace name."

PROPOSALS = {"updates": [], "new": [], "retire": [], "anchors_covered": {}, "notes": []}

# =====================================================================================================================
# C96970 — full rewrite (Rule 41/122) per followup-rows.json "update" row 1, PRD v49 S3-R20c and widened S4-N5
# =====================================================================================================================
PROPOSALS["updates"].append({
 "case_id": 96970,
 "title": "Drops are refused on an inactive technician and one removed from this location",
 "preconditions": [
  signed(),
  WIDTH,
  tech("Technician-B", "Ralph Edwards", svc=False),
  'Customer {Customer-A} (for example "ZZAUTOTEST C96970 Refused Drops") is used by this case only.',
  "Approved work order {Work-order-1} (for example S10043-17631) for {Customer-A} is led by technician {Technician-A} (for example ZZAUTOTEST Ina Inactive).",
  "Approved work order {Work-order-2} (for example S10043-17632) for {Customer-A} is led by {Technician-B}.",
  "Approved work order {Work-order-3} (for example S10043-17633) for {Customer-A} is led by technician {Technician-C} (for example ZZAUTOTEST Mona Moved).",
  "After the work orders were given their leads, {Technician-A}'s staff account was deactivated.",
  "You pinned {Technician-C} in Board View, and after that {Location-A} was removed from {Technician-C}'s Location field. {Technician-C} is still active.",
  CLEAN,
 ],
 "steps": [
  "Open Work Orders, click the All tab and click Board View in the display switcher.",
  "Type the name of {Customer-A} in Search.",
  "Read the column headers of {Technician-A} and {Technician-C}.",
  "Drag {Work-order-2} from {Technician-B}'s column onto {Technician-A}'s column and let go.",
  "Read where {Work-order-2} is.",
  "Drag {Work-order-2} from {Technician-B}'s column onto {Technician-C}'s column and let go.",
  "Read the message that appears and where {Work-order-2} is.",
  "Click Tech View in the display switcher.",
  "Read the group headers of {Technician-A} and {Technician-C}.",
  "Drag {Work-order-2}'s row from {Technician-B}'s group onto {Technician-A}'s group and let go.",
  "Drag {Work-order-2}'s row from {Technician-B}'s group onto {Technician-C}'s group (the group holding {Work-order-3}) and let go.",
  "Read where {Work-order-2} is.",
  "Click {Work-order-2} to open it and read its Lead Technician.",
 ],
 "results": [
  "Step 3: {Technician-A}'s column is still shown with {Work-order-1} and is marked inactive.",
  "Step 3: {Technician-C} is not among the pinned columns. {Technician-C}'s column appears further along as a normal column holding {Work-order-3}, and it has no inactive marker.",
  "Step 5: the drop is not accepted. {Work-order-2} goes back to {Technician-B}'s column.",
  "Step 7: the drop is refused with the message \"This technician can't be assigned work orders.\" and {Work-order-2} stays in {Technician-B}'s column.",
  "Step 9: in Tech View {Technician-A}'s group is still shown with {Work-order-1} and is marked inactive.",
  "Steps 10 to 12: neither drop is accepted. {Work-order-2} stays in {Technician-B}'s group.",
  "Step 13: the Lead Technician of {Work-order-2} is still {Technician-B}.",
 ],
 "source": ("Epic SV-10043; stories SV-10047 (Story 4, Reassign or unassign the lead technician), SV-10046 (Story 3, Board View) and SV-10045 "
            f"(Story 2, Tech View); {PRD}, S4-N5 (widened in version 49) and S3-R20c (added in version 49), both from Chris Ward's answer 2 of "
            "14 Oct 2026 to our question sheet; S3-N2, S3-N4, S3-R20b, S2-N2 and S2-N3; read 14 Oct 2026. Sasha Grosman's answer to engineering of "
            "24 Sep 2026 treated a technician who is no longer at this location like an inactive one; PRD version 49 (14 Oct 2026) says that column "
            "shows no inactive marker, and we take the later PRD as prevailing. Source-verified 14 October 2026. This version of the case has not yet "
            "been checked against a build (the previous version was last checked against build v26.40.8-7a95011 on 10/8/2026)."),
 "quotes": [q("S3-N2"), q("S3-N4"), q("S3-R20b"), q("S3-R20c"), q("S4-N5"), q("S2-N2"), q("S2-N3")],
 "marker": "AUTOMATION: READY",
 "doc_part1": [
  P1_SIGN, P1_LOC, P1_WIDTH,
  p1_staff("Technician-A", "ZZAUTOTEST Ina Inactive", new_only=True, svc=False),
  p1_staff("Technician-B", "Ralph Edwards", svc=False),
  p1_staff("Technician-C", "ZZAUTOTEST Mona Moved", new_only=True, svc=False,
           extra_loc=" and one other location {Location-B} (for example Staging Light Duty), so her Location field is never empty"),
  p1_customer("ZZAUTOTEST C96970 Refused Drops"),
  P1_NEWWO + " " + LINE_A + ", turn Line Approved on and click Save & Close. The status reads Approved. Write down the number shown at the top left "
  "(for example S10043-17631). Repeat this twice more. Number them {Work-order-1}, {Work-order-2} and {Work-order-3} in the order you create them.",
  P1_LEAD + " Give {Work-order-1} the lead {Technician-A}, {Work-order-2} the lead {Technician-B} and {Work-order-3} the lead {Technician-C}.",
  "Work Orders > All tab > Board View. If three technicians are already pinned, unpin one (click the filled pin in its column header), because only "
  "three pins are allowed. Click the pin icon in {Technician-C}'s column header. Her column moves right after Unassigned with a filled pin.",
  "Deactivate {Technician-A}: your initials > Settings > Staff > {Technician-A}'s edit icon > click Deactivate Account and confirm.",
  "Remove {Location-A} from {Technician-C}: your initials > Settings > Staff > {Technician-C}'s edit icon > remove {Location-A} from her Location "
  "field (keep {Location-B}) > Save. She stays active.",
  "Check the setup worked: Work Orders > All tab > Search with the name of {Customer-A} shows {Work-order-1} led by {Technician-A}, {Work-order-2} "
  "led by {Technician-B} and {Work-order-3} led by {Technician-C}. Settings > Staff shows {Technician-A} deactivated and {Technician-C} active "
  "without {Location-A}. If anything differs, fix it before you start, then clear the search.",
 ],
 "doc_part2": [
  "Goal: one deactivated technician {Technician-A} and one active technician {Technician-C} removed from {Location-A} (pinned before the removal), "
  "each still leading one work order at {Location-A}; then drops of {Work-order-2} onto both in Board View and in Tech View.",
  P2_STAFF,
  "Create {Technician-A} and {Technician-C} new for this case (never deactivate or move a shared technician). Create {Customer-A}, its contact and "
  "asset, and {Work-order-1} to {Work-order-3} on screen as in Part 1. Record {Work-order-1 id} to {Work-order-3 id}.",
  "Pin {Technician-C} on screen (Board View column header pin icon) before removing {Location-A}; pins are per user and at most three.",
  "UNVERIFIED on the Work Orders QA site: whether the Location field can be left empty, which is why {Technician-C} is given {Location-B} as well.",
  "Steps 4 to 7: Playwright drag-and-drop from {Work-order-2}'s card to each column. Read the message text after the second drop exactly and "
  "compare it character for character with \"This technician can't be assigned work orders.\" Record where the card ends up after each drop.",
  "Steps 3 and 9: record each header's text and whether it shows an inactive marker or a pin. UNVERIFIED: how the build shows the inactive marker "
  "(a label or a badge); record what you see.",
  "Steps 10 to 13: the same drags in Tech View on the rows; then open {Work-order-2} and read its Lead Technician. Confirm with GET on the work "
  "order that the lead did not change.",
  "Context: this case follows PRD version 49 (14 Oct 2026). Nothing about how the build behaves today is assumed; judge only what you see.",
  P2_EVID,
 ],
 "change_summary": ("Rewritten in full to the 8 Oct layout (link, Preconditions with {placeholders}, setup moved to the doc). PRD v49: pins "
                    "{Technician-C} before removing her from the location (S3-R20b), expects the refusal message \"This technician can't be "
                    "assigned work orders.\" and no inactive marker on her column (S3-R20c), the work order staying with {Technician-B} "
                    "(S4-N5 widened); the inactive half kept (S3-N2/S3-N4, S2-N2/S2-N3); own new ZZAUTOTEST technicians so no shared staff "
                    "record is deactivated; quotes re-copied from v49; Rule 56 divergence sentence on Sasha's 24 Sep answer."),
})
for a in ("S3-N2", "S3-N4", "S3-R20b", "S3-R20c", "S4-N5", "S2-N2", "S2-N3"): PROPOSALS["anchors_covered"].setdefault(a, []).append(96970)

# =====================================================================================================================
# N1 — approved lines only (S4-R28)
# =====================================================================================================================
SCHED_PRE = [signed(" and Schedule access"), WIDTH, tech("Technician-A", "Esther Howard"), tech("Technician-B", "Ralph Edwards")]
PROPOSALS["new"].append({
 "key": "V49-N1", "section_id": 13239,
 "title": "The Clear shifts question ignores lines that are not approved or are declined",
 "preconditions": SCHED_PRE + [
  'Customer {Customer-A} (for example "ZZAUTOTEST S4R28 Approved Lines") is used by this case only.',
  'Work order {Work-order-1} (for example S10043-17641) for {Customer-A} is led by {Technician-A} and has an approved line {Line-1} (for example "Service - Full grease service") and a line that is not approved, {Line-2} (for example "Service - Adjust clutch"), saved with Line Approved off.',
  'Work order {Work-order-2} (for example S10043-17642) for {Customer-A} is led by {Technician-A} and has an approved line {Line-3} (for example "Service - Full grease service") and a declined line {Line-4} (for example "Service - Adjust clutch").',
  'Work order {Work-order-3} (for example S10043-17643) for {Customer-A} is led by {Technician-A} and has two approved lines, {Line-5} (for example "Service - Full grease service") and {Line-6} (for example "Service - Adjust clutch").',
  "{Technician-A} has a shift tomorrow 8:00–10:00 on {Work-order-1} that covers {Line-1} and not {Line-2}.",
  "{Technician-A} has a shift tomorrow 10:00–12:00 on {Work-order-2} that covers {Line-3} and not {Line-4}.",
  "{Technician-A} has a shift tomorrow 13:00–15:00 on {Work-order-3} made with Choose lines, with both {Line-5} and {Line-6} ticked.",
  "No other shift is booked on {Work-order-1}, {Work-order-2} or {Work-order-3}.",
  CLEAN,
 ],
 "steps": [
  "Open Work Orders, click the All tab and click Board View in the display switcher.",
  "Type the name of {Customer-A} in Search.",
  "Drag {Work-order-1} from {Technician-A}'s column into {Technician-B}'s column.",
  "Read the title of the question that opens.",
  "Click Keep shifts.",
  "Drag {Work-order-2} from {Technician-A}'s column into {Technician-B}'s column.",
  "Read the title of the question that opens.",
  "Click Keep shifts.",
  "Drag {Work-order-3} from {Technician-A}'s column into {Technician-B}'s column.",
  "Read the title of the question that opens.",
  "Click Keep shifts.",
  "Click Schedule in the top menu.",
  "Use the arrow next to Today to go to tomorrow.",
  "Read {Technician-A}'s shifts on {Work-order-1}, {Work-order-2} and {Work-order-3}.",
 ],
 "results": [
  "Steps 4, 7 and 10: each drag opens the question \"Clear {Technician-A}'s scheduled shifts?\" (with the example name: \"Clear Esther Howard's scheduled shifts?\"). The line that is not approved ({Line-2}) and the declined line ({Line-4}) are ignored, and a Choose lines shift that ticks every approved line counts.",
  "Steps 5, 8 and 11: after Keep shifts each work order moves to {Technician-B}'s column with the message \"Lead technician updated\".",
  "Step 14: all three of {Technician-A}'s shifts are still on the Schedule tomorrow, at the same times.",
 ],
 "source": (f"Epic SV-10043; story SV-10047 (Story 4, Reassign or unassign the lead technician); {PRD}, S4-R28 (reworded in version 49 from "
            "Chris Ward's answer 1 of 14 Oct 2026 to our question sheet: only approved lines count, judged when the lead changes), S4-R29, S4-R23 "
            "and S4-R5, read 14 Oct 2026. " + NOTYET),
 "quotes": [q("S4-R28"), q("S4-R29"), q("S4-R23"), q("S4-R5")],
 "marker": MARKER_NEW,
 "doc_part1": [
  P1_SIGN + P1_SCHED, P1_LOC, P1_WIDTH,
  p1_staff("Technician-A", "Esther Howard"), p1_staff("Technician-B", "Ralph Edwards"),
  p1_customer("ZZAUTOTEST S4R28 Approved Lines"),
  P1_NEWWO + " " + LINE_A + ", turn Line Approved on and click Save & Add Line. In the next New Line form " + LINE_B +
  ", leave Line Approved off and click Save & Close. Write down the number shown at the top left (for example S10043-17641). This is {Work-order-1}; "
  "its first line is {Line-1} (approved) and its second {Line-2} (not approved).",
  P1_NEWWO + " " + LINE_A + ", turn Line Approved on and click Save & Add Line. In the next New Line form " + LINE_B +
  ", leave Line Approved off and click Save & Close, then click Decline on that second line so it reads Declined. Write down the number (for example "
  "S10043-17642). This is {Work-order-2}; its first line is {Line-3} (approved) and its second {Line-4} (declined).",
  P1_NEWWO + " " + LINE_A + ", turn Line Approved on and click Save & Add Line. In the next New Line form " + LINE_B +
  ", turn Line Approved on and click Save & Close. Write down the number (for example S10043-17643). This is {Work-order-3}, with {Line-5} and {Line-6}.",
  P1_LEAD + " Give all three the lead {Technician-A}.",
  p1_shift("tomorrow", "Work-order-1", "Technician-A", "8 AM", "2h", "{Line-1} only") +
  " If the Schedule books it at once without that window, that is fine: it then covers the only approved line.",
  p1_shift("tomorrow", "Work-order-2", "Technician-A", "10 AM", "2h", "{Line-3} only") +
  " If the Schedule books it at once without that window, that is fine: it then covers the only approved line.",
  p1_shift("tomorrow", "Work-order-3", "Technician-A", "1 PM", "2h", "both {Line-5} and {Line-6}"),
  "Check the setup worked: on the Schedule for tomorrow {Technician-A}'s row shows 8:00–10:00 on {Work-order-1}, 10:00–12:00 on {Work-order-2} and "
  "13:00–15:00 on {Work-order-3}; none of the three shifts names {Line-2} or {Line-4}. On {Work-order-2}'s Lines tab {Line-4} reads Declined, and "
  "on {Work-order-1}'s Lines tab {Line-2} is not approved. Work Orders > All > Board View with {Customer-A}'s name in Search shows the three work "
  "orders in {Technician-A}'s column. Fix anything that differs before you start, then clear the search.",
 ],
 "doc_part2": [
  "Goal: three work orders led by {Technician-A}, each with a shift tomorrow that covers every approved line (one with a line not approved, one "
  "with a declined line, one Choose lines shift ticking both approved lines); then three drags in Board View, each answered with Keep shifts.",
  P2_STAFF,
  "Create {Customer-A}, its contact and asset, and {Work-order-1} to {Work-order-3} on screen as in Part 1. Record {Work-order-1 id} to "
  "{Work-order-3 id} and {Line-1 id}, {Line-3 id}, {Line-5 id} and {Line-6 id} from the Lines tab requests.",
  P2_SHIFT + " For this case lineIds holds {Line-1 id} only for {Work-order-1}, {Line-3 id} only for {Work-order-2}, and {Line-5 id} and "
  "{Line-6 id} for {Work-order-3} (made on screen with Choose lines if you want the exact screen route).",
  P2_BOARD,
  P2_ONELINE + " UNVERIFIED on the Work Orders QA site: whether the Schedule counts a line that is not approved or is declined when deciding to "
  "show that window; either way each shift must cover the approved line only. Record which window appeared.",
  "Steps 3 to 11: Playwright drag-and-drop from each card to {Technician-B}'s column; read the question's title exactly, then click Keep shifts.",
  "Step 14: read the Schedule on screen and confirm with the board read above that the three shifts are unchanged.",
  "Context: this case follows PRD version 49 (14 Oct 2026). Nothing about how the build behaves today is assumed; judge only what you see.",
  P2_EVID,
 ],
 "why": "PRD v49 S4-R28 (reworded): only approved lines count; a line not approved or declined is ignored; a Choose lines shift ticking every approved line counts. No case had such a line at a lead change.",
})

# =====================================================================================================================
# N2 — Entire work order shift after a new approved line (S4-R28)
# =====================================================================================================================
PROPOSALS["new"].append({
 "key": "V49-N2", "section_id": 13239,
 "title": "An Entire work order shift stops counting once a new line is approved",
 "preconditions": SCHED_PRE + [
  'Customer {Customer-A} (for example "ZZAUTOTEST S4R28 Line Added") is used by this case only.',
  'Work order {Work-order-1} (for example S10043-17651) for {Customer-A} is led by {Technician-A} and had two approved lines, {Line-1} (for example "Service - Full grease service") and {Line-2} (for example "Service - Adjust clutch"), when its shift was made.',
  'Work order {Work-order-2} (for example S10043-17652) for {Customer-A} is led by {Technician-A} and had two approved lines, {Line-3} (for example "Service - Full grease service") and {Line-4} (for example "Service - Adjust clutch"), when its shift was made.',
  "{Technician-A} has a shift tomorrow 8:00–12:00 on {Work-order-1} and a shift tomorrow 13:00–17:00 on {Work-order-2}, both made with Entire work order.",
  'After the shifts were made, a third line {Line-5} (for example "Replace - Brake pot") was added to {Work-order-1} with Line Approved on.',
  'After the shifts were made, a third line {Line-6} (for example "Replace - Brake pot") was added to {Work-order-2} with Line Approved off.',
  "No other shift is booked on {Work-order-1} or {Work-order-2}.",
  CLEAN,
 ],
 "steps": [
  "Open Work Orders, click the All tab and click Board View in the display switcher.",
  "Type the name of {Customer-A} in Search.",
  "Drag {Work-order-1} from {Technician-A}'s column into {Technician-B}'s column.",
  "Note whether a question opens and read the message that appears.",
  "Drag {Work-order-2} from {Technician-A}'s column into {Technician-B}'s column.",
  "Read the title of the question that opens.",
  "Click Keep shifts.",
 ],
 "results": [
  "Step 4: no question opens. {Work-order-1} moves to {Technician-B}'s column at once with the message \"Lead technician updated\", because the shift no longer covers every approved line once {Line-5} was approved after it was made.",
  "Step 6: the question \"Clear {Technician-A}'s scheduled shifts?\" opens (with the example name: \"Clear Esther Howard's scheduled shifts?\"), because {Line-6} is not approved and is ignored.",
  "Step 7: {Work-order-2} moves to {Technician-B}'s column with the message \"Lead technician updated\".",
 ],
 "source": (f"Epic SV-10043; story SV-10047 (Story 4, Reassign or unassign the lead technician); {PRD}, S4-R28 (reworded in version 49 from "
            "Chris Ward's answer 1 of 14 Oct 2026 to our question sheet: judged at the moment the lead changes; an Entire work order shift no "
            "longer counts once a line has been added and approved after it was made), S4-R29 and S4-R5, read 14 Oct 2026. " + NOTYET),
 "quotes": [q("S4-R28"), q("S4-R29"), q("S4-R5")],
 "marker": MARKER_NEW,
 "doc_part1": [
  P1_SIGN + P1_SCHED, P1_LOC, P1_WIDTH,
  p1_staff("Technician-A", "Esther Howard"), p1_staff("Technician-B", "Ralph Edwards"),
  p1_customer("ZZAUTOTEST S4R28 Line Added"),
  P1_NEWWO + " " + LINE_A + ", turn Line Approved on and click Save & Add Line. In the next New Line form " + LINE_B +
  ", turn Line Approved on and click Save & Close. The status reads Approved. Write down the number shown at the top left (for example "
  "S10043-17651). Repeat this once more. Number them {Work-order-1} (lines {Line-1} and {Line-2}) and {Work-order-2} (lines {Line-3} and {Line-4}).",
  P1_LEAD + " Give both the lead {Technician-A}.",
  p1_shift("tomorrow", "Work-order-1", "Technician-A", "8 AM", "4h", "entire"),
  p1_shift("tomorrow", "Work-order-2", "Technician-A", "1 PM", "4h", "entire"),
  "Only now, open {Work-order-1} > Lines tab > New Line > " + LINE_C + ", turn Line Approved on and click Save & Close. This is {Line-5}.",
  "Open {Work-order-2} > Lines tab > New Line > " + LINE_C + ", leave Line Approved off and click Save & Close. This is {Line-6}.",
  "Check the setup worked: on the Schedule for tomorrow {Technician-A}'s row shows 8:00–12:00 on {Work-order-1} and 13:00–17:00 on {Work-order-2}. "
  "{Work-order-1}'s Lines tab shows three approved lines; {Work-order-2}'s shows two approved lines and {Line-6} not approved. Work Orders > All > "
  "Board View with {Customer-A}'s name in Search shows both work orders in {Technician-A}'s column. Fix anything that differs before you start "
  "(if a line was added before its shift, create a fresh work order), then clear the search.",
 ],
 "doc_part2": [
  "Goal: two work orders led by {Technician-A}, each with an Entire work order shift tomorrow made while it had two approved lines; afterwards a "
  "third line is added, approved on {Work-order-1} and not approved on {Work-order-2}; then two drags in Board View.",
  P2_STAFF,
  "Create {Customer-A}, its contact and asset, and {Work-order-1} and {Work-order-2} on screen as in Part 1. Record {Work-order-1 id}, "
  "{Work-order-2 id} and {Line-1 id} to {Line-4 id}.",
  P2_SHIFT + " For this case lineIds holds every line id the work order has at that moment ({Line-1 id} and {Line-2 id}; {Line-3 id} and {Line-4 id}).",
  P2_BOARD,
  "Order matters: make both shifts first, then add {Line-5} and {Line-6}. UNVERIFIED on the Work Orders QA site: whether the Schedule extends an "
  "Entire work order shift to a line added later. Read the shift's lines back after adding the lines and record them; do not change them.",
  P2_ONELINE,
  "Steps 3 to 7: Playwright drag-and-drop from each card to {Technician-B}'s column; record whether a question opened and its title exactly, and "
  "the message text.",
  "Context: this case follows PRD version 49 (14 Oct 2026). Nothing about how the build behaves today is assumed; judge only what you see.",
  P2_EVID,
 ],
 "why": "PRD v49 S4-R28 (reworded): judged at the moment the lead changes; an Entire work order shift no longer counts once a line is added and approved after it. No case added a line after the shift.",
})
for a in ("S4-R28", "S4-R29", "S4-R23", "S4-R5"): PROPOSALS["anchors_covered"].setdefault(a, []).append("V49-N1")

# =====================================================================================================================
# N3 — card estimated hours = work order page Total Hours, declined lines left out (S5-R11a)
# =====================================================================================================================
PROPOSALS["new"].append({
 "key": "V49-N3", "section_id": 13240,
 "title": "A card's estimated hours match Total Hours on the work order page",
 "preconditions": [
  "You are signed in as an Owner or Admin user whose role has Work orders > View, at {Location-A} (for example Staging Heavy Duty - 9919).",
  WIDTH,
  'Customer {Customer-A} (for example "ZZAUTOTEST S5R11a Card Hours") is used by this case only, and {Work-order-1} below is its only work order.',
  "Work order {Work-order-1} (for example S10043-17661) for {Customer-A} has four lines with an Estimated Time: three approved lines {Line-1} (for example 0.30 hours), {Line-2} (for example 1.50 hours) and {Line-3} (for example 0.40 hours), and a declined line {Line-4} (for example 2.00 hours).",
  CLEAN,
 ],
 "steps": [
  "Open Work Orders, click the All tab and click List in the display switcher.",
  "Type the name of {Customer-A} in Search.",
  "Click {Work-order-1} to open it.",
  "Read Total Hours on the work order page.",
  "Click Work Orders in the top menu.",
  "Click Board View in the display switcher.",
  "Click Search, clear it and type the name of {Customer-A}.",
  "Click Fields to display and turn on Estimated hours.",
  "Close Fields to display.",
  "Read the estimated hours on {Work-order-1}'s card.",
 ],
 "results": [
  "Step 4: Total Hours reads 2.2 hrs with the example values (0.30 + 1.50 + 0.40 = 2.20). The declined line's 2.00 hours are left out.",
  "Step 10: the card shows the same estimated hours as Total Hours (2.2 with the example values). A difference of up to 0.1 hours is accepted, so 2.1 to 2.3 passes. 4.2 (2.20 + 2.00, the declined line counted) fails. The List's Estimated Hours is not part of this check.",
 ],
 "source": (f"Epic SV-10043; story SV-10048 (Story 5, Choose what is shown); {PRD}, S5-R11a (added in version 49 from Chris Ward's answer 3 of "
            "14 Oct 2026 to our question sheet) and S5-R11 with its optional fields list (estimated hours), read 14 Oct 2026. Earlier the PRD said "
            "only \"existing production meaning\"; the developer's comment on SV-11106 (12 Oct 2026) said the same without product sign-off. " + NOTYET),
 "quotes": [q("S5-R11a"), q("S5-R11")],
 "marker": MARKER_NEW,
 "doc_part1": [
  P1_SIGN, P1_LOC, P1_WIDTH,
  p1_customer("ZZAUTOTEST S5R11a Card Hours"),
  P1_NEWWO + " " + LINE_A + ", set its Estimated Time to 0.30 hours (for example), turn Line Approved on and click Save & Add Line. Add two more "
  "lines the same way (for example \"Service - Adjust clutch\" with 1.50 hours and \"Replace - Brake pot\" with 0.40 hours), each with Line Approved "
  "on. Add a fourth line (for example \"Service - Full grease service\" again) with Estimated Time 2.00 hours (for example), leave Line Approved "
  "off, click Save & Close, then click Decline on that fourth line so it reads Declined. Write down the number shown at the top left (for example "
  "S10043-17661). This is {Work-order-1}, with approved {Line-1}, {Line-2}, {Line-3} and declined {Line-4}.",
  "Do not create any other work order for {Customer-A}.",
  "Check the setup worked: {Work-order-1}'s Lines tab shows three approved lines and {Line-4} Declined, with the Estimated Time you typed on each. "
  "Write down the expected figure: the sum of the three approved lines (2.20 with the example values). If a line kept a different time, change it "
  "back before you start.",
 ],
 "doc_part2": [
  "Goal: one work order whose approved lines carry known estimated times and whose declined line carries a large one, so a total that counts the "
  "declined line is easy to tell apart.",
  "Create {Customer-A}, its contact and asset, and {Work-order-1} on screen as in Part 1. Record {Work-order-1 id} and {Line-1 id} to {Line-4 id}.",
  "UNVERIFIED on the Work Orders QA site: the label of the line's estimate field (Jira SV-11106 calls it Estimated Time) and whether a ready-made "
  "line brings its own estimate that must be overwritten. Record the label and the saved value of every line.",
  "Compute the expected figure yourself from the four saved line estimates: the sum of the three approved lines only. With the example values 0.30 + "
  "1.50 + 0.40 = 2.20 hours; a figure that includes the declined line would be 4.20.",
  "Step 4: read Total Hours on the work order page exactly as shown (for example \"2.2 hrs\"). Step 10: read the card's estimated hours exactly. "
  "Pass when the card is within 0.1 hours of Total Hours and Total Hours equals your computed figure within 0.1 hours.",
  "Context: the developer reported on 12 Oct 2026 (SV-11106, build e84b3d1) that cards leave out declined lines. That is not evidence about the "
  "build you test; judge only what you see.",
  P2_EVID,
 ],
 "why": "PRD v49 S5-R11a (added): card estimated hours = work order page Total Hours without declined lines, 0.1 h tolerance; C96978 compares with the List and has no declined line.",
})
for a in ("S5-R11a", "S5-R11"): PROPOSALS["anchors_covered"].setdefault(a, []).append("V49-N3")

# =====================================================================================================================
# N4 — staff record name on cards and headers (S5-R11b)
# =====================================================================================================================
PROPOSALS["new"].append({
 "key": "V49-N4", "section_id": 13240,
 "title": "Cards and headers show the technician's staff record name, as the List does",
 "preconditions": [
  signed(), WIDTH,
  "Technician {Technician-A} (for example ZZAUTOTEST Staffname Ana) is an active technician at {Location-A} with a sign-in account, and the staff record was renamed after the account was made, so the name in Settings > Staff differs from the account name (for example ZZAUTOTEST Account Ana).",
  "Technician {Technician-B} (for example ZZAUTOTEST Staffname Ben) is an active technician at {Location-A} with a sign-in account, and the staff record was renamed after the account was made, so the name in Settings > Staff differs from the account name (for example ZZAUTOTEST Account Ben).",
  'Customer {Customer-A} (for example "ZZAUTOTEST S5R11b Staff Names") is used by this case only.',
  'Approved work order {Work-order-1} (for example S10043-17671) for {Customer-A} is led by {Technician-A} and has two approved lines, {Line-1} (for example "Service - Full grease service") and {Line-2} (for example "Service - Adjust clutch").',
  "{Line-2} has {Technician-B} as its technician, set through Edit Line.",
  "In Board View, Fields to display has Lead technician name and Line technicians turned on.",
  "The List shows the Lead Technician column.",
  CLEAN,
 ],
 "steps": [
  "Click your initials (top right) and open Settings > Staff.",
  "Write down the names shown for {Technician-A} and {Technician-B}.",
  "Open Work Orders, click the All tab and click List in the display switcher.",
  "Type the name of {Customer-A} in Search.",
  "Read the Lead Technician of {Work-order-1}.",
  "Click Board View in the display switcher.",
  "Read the lead technician name on {Work-order-1}'s card.",
  "Hover each avatar in the card's line technicians and read each name.",
  "Read the header of the column that holds {Work-order-1}.",
  "Click Tech View in the display switcher.",
  "Read the header of the group that holds {Work-order-1}.",
 ],
 "results": [
  "Step 5: the List's Lead Technician shows {Technician-A}'s staff record name written down in step 2 (for example ZZAUTOTEST Staffname Ana).",
  "Step 7: the card names its lead technician with the same staff record name, not any other name (for example not ZZAUTOTEST Account Ana).",
  "Step 8: hovering the avatars shows the staff record names of {Technician-A} and {Technician-B} written down in step 2.",
  "Step 9: the Board View column header shows {Technician-A}'s staff record name.",
  "Step 11: the Tech View group header shows {Technician-A}'s staff record name.",
 ],
 "source": (f"Epic SV-10043; story SV-10048 (Story 5, Choose what is shown); {PRD}, S5-R11b (added in version 49 from Chris Ward's answer 4 of "
            "14 Oct 2026 to our question sheet), S7-R6, S3-R12 and S2-R12, read 14 Oct 2026. Before version 49 the PRD did not say which name is "
            "shown. " + NOTYET),
 "quotes": [q("S5-R11b"), q("S7-R6"), q("S3-R12"), q("S2-R12")],
 "marker": MARKER_NEW,
 "doc_part1": [
  P1_SIGN, P1_LOC, P1_WIDTH,
  "Your initials > Settings > Staff > New Staff Member: First Name and Last Name (for example ZZAUTOTEST Account Ana), an Email you can open, Role "
  "Technician, a Department, Location {Location-A}, Time Clock on > Save & Close. Accept the invitation email and set a password, so the person "
  "has a sign-in account. Then open the staff record again (edit icon) and change First Name and Last Name to a different name (for example "
  "ZZAUTOTEST Staffname Ana) > Save. This is {Technician-A}.",
  "Do the same for a second person (for example created as ZZAUTOTEST Account Ben, renamed ZZAUTOTEST Staffname Ben). This is {Technician-B}.",
  p1_customer("ZZAUTOTEST S5R11b Staff Names"),
  P1_NEWWO + " " + LINE_A + ", turn Line Approved on and click Save & Add Line. In the next New Line form " + LINE_B +
  ", turn Line Approved on and click Save & Close. Write down the number shown at the top left (for example S10043-17671). This is {Work-order-1}, "
  "with {Line-1} and {Line-2}.",
  "Click {Line-2}'s name to open Edit Line, choose Technicians {Technician-B} and save.",
  P1_LEAD + " Choose {Technician-A}.",
  "Work Orders > All > Board View > Fields to display: turn on Lead technician name and Line technicians. Then click List and, if the Lead "
  "Technician column is not shown, turn it on in the List's column chooser.",
  "Check the setup worked: Settings > Staff shows {Technician-A} and {Technician-B} under their new names. Work Orders > All > List with "
  "{Customer-A}'s name in Search shows {Work-order-1} with a Lead Technician. If a person could not be renamed, the case cannot start: mark it "
  "Blocked and write why. Clear the search before you start.",
 ],
 "doc_part2": [
  "Goal: a work order whose lead and line technician each have a staff record name that differs from the name of their sign-in account, so a "
  "screen that shows the account name is easy to spot.",
  "UNVERIFIED on the Work Orders QA site: whether renaming a staff record also renames the sign-in account. Read both back after the rename "
  "(GET /api/staff for the staff record; the person's own account name as shown after signing in as them) and record them. If the rename changes "
  "both, pick instead an existing technician whose two names already differ: the developer noted on 12 Oct 2026 (Slack, #fs-board-tech-view) "
  "that on the QA data the two names differ for most technicians.",
  "Create {Customer-A}, its contact and asset, and {Work-order-1} on screen as in Part 1. Record {Work-order-1 id}, {Line-1 id} and {Line-2 id}.",
  "Steps 5 to 11: read every name on screen exactly; for step 8 hover each avatar with Playwright and read the tooltip text.",
  "Context: Chris Ward wrote on 14 Oct 2026 that the build shows the account name today. That is not evidence about the build you test, and no "
  "ticket exists yet; judge only what you see.",
  P2_EVID,
 ],
 "why": "PRD v49 S5-R11b (added): staff record name on cards and headers, as in the List; no case compares the headers with the List.",
})
for a in ("S5-R11b", "S7-R6", "S3-R12", "S2-R12"): PROPOSALS["anchors_covered"].setdefault(a, []).append("V49-N4")

# =====================================================================================================================
# N5 — Imported via a link or a saved filter opens List (S1-R13c)
# =====================================================================================================================
PROPOSALS["new"].append({
 "key": "V49-N5", "section_id": 13236,
 "title": "Opening Board View with Imported already selected opens List instead",
 "preconditions": [
  "You are signed in as an Owner or Admin user whose role has Work orders > View, at {Location-A} (for example Staging Heavy Duty - 9919).",
  WIDTH,
  "You know the address of the site under test, {Site-A} (for example https://sv10043.qa.shopview.com).",
  'Imported work order {Work-order-1} (for example ZZIMP-S1R13C-1) exists at {Location-A} for customer {Customer-A} (for example "ZZAUTOTEST S1R13c Imported"); it came from an invoice import, so it is listed only when Imported is ticked in Status.',
  "Ordinary work order {Work-order-2} (for example S10043-17681) for {Customer-A} exists at {Location-A}.",
  "Your saved display on the Work Orders page is List.",
  CLEAN,
 ],
 "steps": [
  "Open Work Orders from the top menu and click the All tab.",
  "Open a second browser tab and open {Site-A}/workorders in it.",
  "Go back to the first tab.",
  "Click Board View in the display switcher.",
  "Open a third browser tab and open {Site-A}/workorders?tab=all&status=imported in it.",
  "Read which display is shown and what is ticked in Status.",
  "Hover Board View in the display switcher and read its tooltip.",
  "Hover Tech View in the display switcher and read its tooltip.",
  "Close the third tab.",
  "Open a new browser tab and open {Site-A}/workorders in it.",
  "Read which display is shown.",
  "Close this tab.",
  "Go to the second tab, which still shows List.",
  "Click Status and tick \"Imported\".",
  "Open a new browser tab and open {Site-A}/workorders in it.",
  "Read which display is shown and what is ticked in Status.",
 ],
 "results": [
  "Step 6: the page opens in List, not Board View. \"Imported\" is ticked in Status and {Work-order-1} is listed.",
  "Steps 7 and 8: Board View and Tech View are greyed out, each with the tooltip \"Not available while Imported is selected.\"",
  "Step 11: without Imported the page opens in Board View, because opening the link did not change your saved display.",
  "Step 16: the page opens in List with \"Imported\" still ticked and {Work-order-1} listed, and Board View and Tech View are greyed out.",
 ],
 "source": (f"Epic SV-10043; story SV-10044 (Story 1, Switch between display options); {PRD}, S1-R13c (added in version 49 from Chris Ward's "
            "answer 7 of 14 Oct 2026 to our question sheet) and S1-R13a, read 14 Oct 2026. Secondary: Work Orders Board View & Tech View Display "
            "Options Technical Implementation Plan (revised 24 Sep 2026, uploaded 8 Oct 2026), section 3.26. " + NOTYET),
 "quotes": [q("S1-R13c"), q("S1-R13a"), TP26],
 "marker": MARKER_NEW,
 "doc_part1": [
  P1_SIGN, P1_LOC, P1_WIDTH,
  "Write down the site's address as shown in the address bar up to and not including /workorders (for example https://sv10043.qa.shopview.com). This is {Site-A}.",
  p1_customer("ZZAUTOTEST S1R13c Imported"),
  "Create the Imported work order from an invoice import: your initials > Settings > Invoices (in the IMPORTS group; on some builds Settings > Data "
  "Import > Invoices) > Download Template. Fill one row and keep the heading row (the columns marked * are required): Shop Location = the name of "
  "{Location-A}, Customer = the name of {Customer-A}, Invoice Number (for example ZZIMP-S1R13C-1), Invoice Date as month/day/year (for example "
  "10/14/2026), Item Labor, a Line Title (for example ZZAUTOTEST labor), Qty 1, Rate 100, Total 100, Tax Amount 5.",
  "Save the file as .csv, click Select CSV File, pick the file and click Import Invoices. The message reads \"All invoices have been imported "
  "successfully.\" The imported work order's number is the Invoice Number you typed. This is {Work-order-1}.",
  P1_NEWWO + " " + LINE_A + ", turn Line Approved on and click Save & Close. Write down the number shown at the top left (for example "
  "S10043-17681). This is {Work-order-2}.",
  "Go to Work Orders > All tab and click List in the display switcher (this makes List your saved display). Click Status and, if anything is "
  "ticked, click \"Clear selection\". Turn Assigned to me off and clear Search.",
  "Check the setup worked: with Status > \"Imported\" ticked in List, {Work-order-1} is listed; click \"Clear selection\" again. Then open "
  "{Site-A}/workorders?tab=all&status=imported in the address bar: List opens with \"Imported\" ticked. Click \"Clear selection\" once more and "
  "check {Work-order-1} is no longer listed. If no Imported work order can be made, or the address does not tick Imported, the case cannot start: "
  "mark it Blocked and write why.",
 ],
 "doc_part2": [
  "Goal: an Imported work order, a saved display of Board View, then the page opened two ways with Imported selected: by a link, and by the "
  "saved filters.",
  "Create {Customer-A}, then the import file as in Part 1. UNVERIFIED on the Work Orders QA site: whether the import also creates a customer that "
  "does not exist yet; create {Customer-A} first so it does not matter.",
  "The link form workorders?tab=all&status=imported was observed on the Filters QA site sv8785 in August 2026 (build/filters/finish-2026-08-12/). "
  "UNVERIFIED on the rebuilt Work Orders List: that the address still carries status=imported. Part 1's check proves it before the steps.",
  "Saved state: the List's filters are saved per user on the server (GET/PUT /api/users/me/preferences/work-orders-list on the Filters QA site, "
  "August 2026; UNVERIFIED on this build, and the display may be a separate preference). Before step 15, read the saved preferences and record "
  "that the display is Board View and the filters hold Imported. If ticking Imported in the second tab also wrote the display back to List, "
  "record it: step 16 then cannot tell the rule apart from that, and step 11 remains the check of the kept display.",
  "Steps 7 and 8: hover each display button with Playwright and read the tooltip text exactly; compare it character for character with "
  "\"Not available while Imported is selected.\"",
  "After step 6, read the saved preferences: opening the link must not have put Imported into the saved filters (production keeps a link's "
  "filters apart from the user's own, with a Back To My Saved Filters button on the Filters QA site in August 2026). If it did, record it: step 11 "
  "then opens List under the same rule, and the result is a question for the QA lead rather than a pass or fail.",
  "After the test: in List click Status > \"Clear selection\", so Imported is not left in your saved filters, and set the display you want to "
  "keep.",
  P2_EVID,
 ],
 "why": "PRD v49 S1-R13c (added): a link or saved filter with Imported opens List, both views greyed out, saved display kept; C154648 ticks Imported inside List only.",
})
for a in ("S1-R13c", "S1-R13a"): PROPOSALS["anchors_covered"].setdefault(a, []).append("V49-N5")

PROPOSALS["notes"] = [
 "Marker for the five new tests: AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build, as C581889-C581891 were when created on "
 "14 Oct (the QA lead's build-verification session set those to READY at 15:16 UTC after checking them on staging). C96970 keeps AUTOMATION: "
 "READY, the convention of the 14 Oct rewrites (C154648, C96965) with the sentence that this version has not yet been checked against a build.",
 "Out-of-date quotes NOT in this pass's scope (reported, not edited): S4-R28 (v48 text) in C581891; S4-N5 (pre-v49 text) in C368131 and C97010.",
]
json.dump(PROPOSALS, open(f"{H}/proposals-v49.json", "w"), indent=1, ensure_ascii=False)
print("updates", len(PROPOSALS["updates"]), "new", len(PROPOSALS["new"]))
