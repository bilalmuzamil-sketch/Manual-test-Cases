#!/usr/bin/env python3
"""Worker C — WO Board & Tech View full rewrite, 8 Oct 2026.
Share: Story 9 (13244), Story 11 (13246), Story 12 (13247), numbers/data accuracy (13248), tech-plan folder (20449).
Writes proposals-C-S9-S12.json. Quotes are copied programmatically from the PRD / tech-plan files (never retyped).
Read-only with respect to TestRail: nothing here calls any API."""
import json, re, os, sys

ROOT = "/home/user/Manual-test-Cases/build/wo-board-tech-view"
HERE = f"{ROOT}/source-update-2026-10-08"
PRD_RAW = open(f"{ROOT}/sources/CONFLUENCE-845185030-WO-BoardView-TechView-PRD-v33-edited-2026-10-07.md", encoding="utf-8").read()
TP_RAW = open(f"{ROOT}/sources/Tech-Plan-Kanban-Tech-View-Display-Options-2026-10-08-upload.md", encoding="utf-8").read()
OUT = f"{HERE}/proposals-C-S9-S12.json"

def ws(s): return re.sub(r"\s+", " ", s.replace("**", "")).strip()
PRD_N, TP_N = ws(PRD_RAW), ws(TP_RAW)

# ---------- verbatim quote sources ----------
ANCH = {}
for line in PRD_RAW.splitlines():
    m = re.match(r"^\s*(?:-\s*)?\*\*(S\d+-[RNE]\d+[a-z]?):\*\*\s*(.*)$", line.strip())
    if m: ANCH[m.group(1)] = m.group(2).replace("**", "").strip()

def prd(anchor):
    return [anchor, ANCH[anchor]]

def prd_sub(name, start, end):
    """A non-anchor PRD sentence: from `start` up to and including `end`, copied from the PRD text."""
    i = PRD_N.index(start); j = PRD_N.index(end, i) + len(end)
    return [name, PRD_N[i:j]]

def tp(name, start, end=None):
    i = TP_N.index(start)
    j = (TP_N.index(end, i) + len(end)) if end else i + len(start)
    return ["Tech plan " + name, TP_N[i:j]]

MARK = "AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build"
C154650_MARK = "AUTOMATION: HOLD - server-side scoping is a developer/automated check; the two-org observation is manual, not yet build-verified on the Work Orders QA build"

PRDREF = 'PRD Confluence 845185030, edited 7 Oct 2026 (status line "PRD v33")'
STORY = {
    "S1": "SV-10044 (Story 1, Switch between display options)",
    "S2": "SV-10045 (Story 2, Tech View)",
    "S3": "SV-10046 (Story 3, Board View)",
    "S4": "SV-10047 (Story 4, Reassign or unassign the lead technician)",
    "S5": "SV-10048 (Story 5, Fields to display and columns)",
    "S9": "SV-10052 (Story 9, Drag to reorder work and technician groups/columns)",
    "S11": "SV-10054 (Story 11, Keyboard access and focus)",
    "S12": "SV-10593 (Story 12, Google Analytics for display and field usage)",
}
def src(stories, anchors, extra=""):
    st = "; ".join(STORY[s] for s in stories)
    s = f"Epic SV-10043; story {st}; {PRDREF}, {', '.join(anchors)}, read 8 Oct 2026."
    return s + (" " + extra if extra else "")

# ---------- shared tester-facing building blocks ----------
SIGNIN_EDIT = ("Sign in to the build under test as a dispatcher whose role has Work Orders view and Work Orders create and edit "
               "(check: Settings > Roles & Permissions > open the role > on the Work Orders card, View and Create & Edit are both ticked. "
               "The Admin role has both).")
SIGNIN_VIEW_ONLY_SETUP = [
    "Create a view-only user (skip if one exists):",
    '↳ Settings > Roles & Permissions > Create custom role > Skip > Role name (e.g. "ZZAUTOTEST WO View Only") > tick only View on the Work Orders card > Create.',
    '↳ Settings > Staff > add a staff member (e.g. "ZZAUTOTEST Viewer", an email inbox you can open) with that role at the test location, and finish the invite so the user can sign in.',
    "↳ Sign this user in later in a second browser or a private window.",
]
LOCATION = 'In the top bar, choose the location you test in (e.g. "Heavy Duty"). Every technician and work order below belongs to this location.'
WIDTH = "Use a desktop browser window at least 1024 px wide (the display switcher only shows at 1024 px and wider)."
def techs(names):
    return [f"The location has these eligible technicians (examples): {names}.",
            "↳ A staff member counts as a technician when, in Settings > Staff > open the staff member > Edit Staff Member, they are Active, the Time Clock (clockable) setting is on, the role is neither Office nor Time Clock User, and they are enrolled at this location.",
            '↳ To add one: Settings > Staff > add a staff member with those settings (e.g. first name "ZZAUTOTEST Ana", last name "Alpha").']
WO_HOW = ['How to create each work order below:',
          '↳ Work Orders > New Work Order > pick the customer (add it from the window if it does not exist, e.g. "ZZAUTOTEST Alpha Co") and any asset > Create.',
          "↳ On the work order page set Lead Technician to the technician named (leave it empty for an unassigned one).",
          "↳ Move it to the status named: a new work order starts as Estimate; approve the estimate for Approved; use the status control on the work order page for In Progress, Review (Ready for Review) and Complete; decline the estimate for Declined; Finance tab > Create Invoice for Invoiced; record a payment for the full amount for Paid. Set the lead technician before invoicing.",
          "↳ Write down each work order number as you create it (e.g. S1-801)."]
NO_SHIFTS = ('None of these technicians has a shift on the Schedule for these work orders (check the Schedule page). '
             'If a window titled "Clear … scheduled shifts?" still appears during a move, click "Keep shifts".')
OPEN_WO = "Open Work Orders from the top menu and click the All tab."
SEARCH_ZZ = 'Type "ZZAUTOTEST" in Search so only your test work orders show.'
TECHVIEW = 'Click Tech View in the display switcher at the right of the toolbar (the design tooltip reads "By Lead Tech").'
BOARDVIEW = 'Click Board View in the display switcher (the design tooltip reads "Board").'
LISTVIEW = 'Click List in the display switcher (the design tooltip reads "Table").'
LABEL_NOTE = "Write down the words you see where they differ from these; a different label alone is not a fail."

GA_PRE = ('You can open Google Analytics for the property the QA build reports to, at Admin > DebugView. The QA build runs analytics in debug mode, '
          'so each event appears in DebugView within a few seconds under your user. If you cannot open DebugView, the event checks in this case '
          'cannot be done by hand: write "not checked by hand" in the result comment and pass or fail on what you can see on the Work Orders page.')
GA_NAMES = ('Event names to look for in DebugView: work_orders_display_view (a display was shown), work_orders_field_load and work_orders_density_load '
            '(the fields and density you have, once per display per session), work_orders_field_toggle and work_orders_density_change (a saved change).')
GA_FRESH = "Start a fresh analytics session: close every browser window, open a new private window and sign in."
GA_SRC = ("Event names and timing: SV-10593 comments by Slavcho Mitrov and Milos Vasic, 6 Oct 2026 (the agreed GA4 event table); "
          "earlier event contract on Review Decisions page 853901313 (29 Sep 2026) uses older names.")

updates, new, retire, notes = [], [], [], []

def U(cid, title, pre, steps, res, source, quotes, summary, marker=MARK):
    updates.append({"case_id": cid, "title": title, "preconds": pre, "steps": steps, "results": res,
                    "source": source, "quotes": quotes, "marker": marker, "change_summary": summary})
NEWN = [0]
def N(section, title, pre, steps, res, source, quotes, why, marker=MARK):
    NEWN[0] += 1
    new.append({"key": f"NEW-C-{NEWN[0]:02d}", "section_id": section, "title": title, "preconds": pre, "steps": steps,
                "results": res, "source": source, "quotes": quotes, "marker": marker, "why": why})

# =====================================================================================
# STORY 9 — section 13244
# =====================================================================================
S9 = 13244
BASE_EDIT = [SIGNIN_EDIT, LOCATION, WIDTH]

U(97001, "Work orders can be dragged within a technician and to another technician",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo", "ZZAUTOTEST Cal Charlie"') + WO_HOW + [
    'Work orders (all Approved): lead Ana — customers "ZZAUTOTEST Alpha Co", "ZZAUTOTEST Bravo Co", "ZZAUTOTEST Charlie Co"; lead Ben — "ZZAUTOTEST Delta Co"; lead Cal — "ZZAUTOTEST Echo Co".',
    NO_SHIFTS],
  [OPEN_WO, SEARCH_ZZ, TECHVIEW,
   "In Ana's group, write down the order of the three rows (with the example data: Alpha Co, Bravo Co, Charlie Co).",
   "Press on the Charlie Co row and drag it above the Alpha Co row, then release.",
   "Drag the Bravo Co row from Ana's group into Ben's group, below the Delta Co row, and release.",
   BOARDVIEW,
   "In Ben's column, drag the Bravo Co card above the Delta Co card and release.",
   "Drag the Echo Co card from Cal's column into Ana's column, below the last card, and release."],
  ["After step 5, Ana's group lists Charlie Co, Alpha Co, Bravo Co: the row moved inside the group to where you dropped it.",
   "After step 6, Bravo Co is listed in Ben's group below Delta Co and is gone from Ana's group.",
   "After step 8, Ben's column shows Bravo Co above Delta Co.",
   "After step 9, Echo Co is the last card in Ana's column and Cal's column is empty.",
   "Every drag in both Tech View and Board View was allowed and the row or card stayed where you released it."],
  src(["S9"], ["S9-R1"]), [prd("S9-R1")],
  "Rewritten in full: real seed recipe with example customers, one drag per step in both views, observable positions.")

U(97002, "Dragging to another technician changes the lead, Unassigned clears it",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo", "ZZAUTOTEST Cal Charlie"') + WO_HOW + [
    'Work orders (all Approved): lead Ana — "ZZAUTOTEST Alpha Co"; no lead — "ZZAUTOTEST Golf Co".', NO_SHIFTS],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Drag the Alpha Co card from Ana's column into Ben's column and release.",
   "Click the Alpha Co card to open the work order and read its Lead Technician, then go back with the browser Back button.",
   "Drag the Alpha Co card from Ben's column into the Unassigned column and release.",
   "Open the Alpha Co work order again, read Lead Technician, then go back.",
   "Drag the Golf Co card from the Unassigned column into Cal's column and release.",
   "Open the Golf Co work order, read Lead Technician, then go back.",
   TECHVIEW,
   "Drag the Golf Co row from Cal's group into Ana's group and release, then open it and read Lead Technician."],
  ["After step 4 the card sits in Ben's column and the message \"Lead technician updated\" appears, then fades by itself.",
   "Step 5: the work order page shows Lead Technician Ben Bravo.",
   "After step 6 the card sits in Unassigned and the message \"Lead technician removed\" appears.",
   "Step 7: the work order page shows no lead technician.",
   "Steps 8 and 9: the Golf Co card moved into Cal's column and its work order page shows Lead Technician Cal Charlie.",
   "Step 11: in Tech View the row moves to Ana's group and the work order page shows Lead Technician Ana Alpha."],
  src(["S9", "S4"], ["S9-R6", "S9-R7", "S4-R5", "S4-R16"]),
  [prd("S9-R6"), prd("S9-R7"), prd("S4-R5"), prd("S4-R16")],
  "Rewritten in full: assign, remove and assign-from-Unassigned each checked on the work order page, with the exact toast words.")

U(97003, "A view-only user can reorder technician columns and Unassigned stays first",
  [LOCATION, WIDTH] + SIGNIN_VIEW_ONLY_SETUP + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo", "ZZAUTOTEST Cal Charlie"') + WO_HOW + [
    'Work orders: lead Ana — "ZZAUTOTEST Alpha Co"; no lead — "ZZAUTOTEST Golf Co" (both Approved).',
    "No technician is pinned for the view-only user."],
  ["Sign in as the view-only user (e.g. ZZAUTOTEST Viewer).", OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Write down the column order (initially Unassigned first, then technicians by first name: Ana, Ben, Cal).",
   'Press on the drag handle at the left of Cal\'s column header (tooltip "Drag to reorder technicians") and drag Cal\'s column before Ana\'s, then release.',
   "Try to drag Ben's column to the left of the Unassigned column and release there.",
   "Try to press on the Unassigned column header and drag it to the right of Cal.",
   TECHVIEW,
   "Try to drag Ben's group header above the Unassigned group and release there.",
   "Refresh the page (F5) and read the technician order in Tech View and in Board View.",
   "In another browser, sign in as the dispatcher (create and edit user), open Work Orders > All > Board View and read the technician order."],
  ["Step 6: the view-only user can drag a technician column. The order becomes Unassigned, Cal, Ana, Ben.",
   "Step 7: Ben cannot be placed before Unassigned. Unassigned stays the first column.",
   "Step 8: the Unassigned column cannot be dragged.",
   "Step 10: in Tech View, Unassigned stays the first group and Ben cannot be dropped above it.",
   "Step 11: after the refresh the view-only user still sees Unassigned, Cal, Ana, Ben in both views.",
   "Step 12: the dispatcher's own technician order is unchanged (Unassigned, Ana, Ben, Cal) because the order is saved per user."],
  src(["S9"], ["S9-R2", "S9-R8"], "Story 9 prerequisite and Key Decisions (Permissions), same PRD. Tech plan (revised 24 Sep 2026) Phase 9 drop rules."),
  [prd("S9-R2"), prd("S9-R8"),
   prd_sub("Story 9 prerequisite", "View permission permits technician-only group/column reordering.", "View permission permits technician-only group/column reordering."),
   prd_sub("Key decision: permissions", "Permissions. Work Orders view permits viewing all four filter tabs and reordering technician groups/columns.", "reordering technician groups/columns."),
   tp("Phase 9 drop rules", "technician-group drags stay inside their area — pinned technicians reorder only among pins, and Unassigned is never a technician drop target (S9-R8, S9-R9)")],
  "Rewritten in full: view-only user created by steps, Unassigned fixed in both views, per-user order proved with a second login.")

U(97004, "Pinned technicians can only be reordered among the pinned technicians",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo", "ZZAUTOTEST Cal Charlie", "ZZAUTOTEST Dan Delta"') + WO_HOW + [
    'Work orders (Approved): lead Ana — "ZZAUTOTEST Alpha Co"; lead Ben — "ZZAUTOTEST Bravo Co", "ZZAUTOTEST Charlie Co"; lead Cal — "ZZAUTOTEST Delta Co".',
    'Pin Ana and then Ben: Work Orders > Board View > click the pin button in each column header (tooltip "Pin column"). The order is now Unassigned, Ana, Ben (pinned), Cal, Dan.'],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Write down each column header count (with the example data: Ana 1, Ben 2, Cal 1, Dan 0).",
   "Drag Ben's column (by its header drag handle) before Ana's column and release.",
   "Drag Ben's column to after Cal's column (outside the pinned area) and release there.",
   TECHVIEW,
   "Try to drag Ana's group header below Cal's group and release there.",
   "Read every header count again, then open the Bravo Co work order and read Lead Technician."],
  ["Step 5: Ben moves before Ana. The order is Unassigned, Ben, Ana, Cal, Dan.",
   "Step 6: Ben cannot leave the pinned area. He stays among the pinned technicians and Cal and Dan stay after them.",
   "Step 8: in Tech View the pinned groups come right after Unassigned, in the same pinned order, and Ana cannot be dropped among the unpinned groups.",
   "Step 9: the counts are unchanged (Ana 1, Ben 2, Cal 1, Dan 0) and Bravo Co still has Lead Technician Ben Bravo: moving technicians changed no work order."],
  src(["S9", "S2"], ["S9-R9", "S9-R10", "S2-R17"], "Design screen Board View: pin button tooltip \"Pin column\", drag handle tooltip \"Drag to reorder technicians\"."),
  [prd("S9-R9"), prd("S9-R10"), prd("S2-R17")],
  "Rewritten in full: pins set by real clicks, pinned-area boundary checked in both views, counts and lead re-read to prove no assignment changed.")

U(97005, "The order of work orders is shared by everyone at the location",
  BASE_EDIT + [
    "A second dispatcher with Work Orders create and edit at the same location (e.g. \"ZZAUTOTEST Dispatcher Two\"): Settings > Staff > add a staff member with a role that has Work Orders View and Create & Edit, enrolled at this location. Sign them in in a second browser.",
  ] + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo"') + WO_HOW + [
    'Work orders (Approved), lead Ana: customers "ZZAUTOTEST Alpha Co", "ZZAUTOTEST Bravo Co", "ZZAUTOTEST Charlie Co". Nobody has reordered Ana\'s work in Tech View or Board View at this location yet, so they start in the List\'s default order (customer name A to Z): Alpha Co, Bravo Co, Charlie Co.'],
  [OPEN_WO, SEARCH_ZZ, TECHVIEW,
   "In Ana's group, drag the Charlie Co row above the Alpha Co row and release.",
   BOARDVIEW,
   "Read the order of the cards in Ana's column.",
   "In the second browser, as the second dispatcher, open Work Orders > All, search \"ZZAUTOTEST\", click Board View and read Ana's column, then click Tech View and read Ana's group.",
   "In the first browser, sign out, sign back in and open Work Orders > All > Tech View with the same search.",
   "In the first browser, drag Ben's group header above Ana's group (technician order), then in the second browser refresh and read the technician order."],
  ["Step 4: Ana's group reads Charlie Co, Alpha Co, Bravo Co.",
   "Step 6: Board View shows the same order in Ana's column: Charlie Co, Alpha Co, Bravo Co.",
   "Step 7: the second dispatcher sees Charlie Co, Alpha Co, Bravo Co in both views without doing anything (the work order order is saved once for the location).",
   "Step 8: after signing in again the order is still Charlie Co, Alpha Co, Bravo Co: the saved order replaces the starting customer-name order and stays until someone changes it.",
   "Step 9: the second dispatcher's technician order does not change (Ana before Ben): technician order is saved per user, unlike the work order order."],
  src(["S9"], ["S9-R3", "S9-R11", "S9-R12"], "Key Decisions (manual ordering), same PRD. Starting order (customer name A to Z): Review Decisions page 853901313, DR-45 (29 Sep 2026)."),
  [prd("S9-R3"), prd("S9-R11"), prd("S9-R12"),
   prd_sub("Key decision: manual ordering", "That order is the shop’s priority plan", "in Tech View and Board View alike.")],
  "Rewritten in full: exact example order, second dispatcher in a second browser, logout/login, and the per-user technician order contrast.")

U(97006, "Dragging in Tech View or Board View does not change the List sort",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo"') + WO_HOW + [
    'Work orders (Approved), created in this order: "ZZAUTOTEST Alpha Co" lead Ana, "ZZAUTOTEST Bravo Co" lead Ana, "ZZAUTOTEST Charlie Co" lead Ben.', NO_SHIFTS],
  [OPEN_WO, SEARCH_ZZ, LISTVIEW,
   'Click the "Created on" column header to sort by created date (click again if needed until the newest is on top). Write down the sort column, its direction arrow and the row order (with the example data: Charlie Co, Bravo Co, Alpha Co).',
   TECHVIEW,
   "In Ana's group, drag Alpha Co above Bravo Co and release.",
   BOARDVIEW,
   "Drag the Charlie Co card from Ben's column into Ana's column and release.",
   LISTVIEW],
  ["Step 9: List is still sorted by Created on, in the same direction, with the same arrow you set in step 4.",
   "The List rows read Charlie Co, Bravo Co, Alpha Co, newest first, exactly as before: the manual order from Tech View and Board View did not change the List."],
  src(["S9"], ["S9-R13"]), [prd("S9-R13")],
  "Rewritten in full: concrete List sort set by clicking a column header, drags in both views, List order compared row by row.")

S9R14_SRC_EXTRA = ("Starting order (customer name A to Z): Review Decisions page 853901313, DR-45 (29 Sep 2026). "
                   "The PRD of 7 Oct changed the removal rule: DR-47 (29 Sep) had put a removed work order at the bottom of Unassigned; the 7 Oct PRD puts it in Unassigned in the initial sort, and this case follows the 7 Oct PRD.")
U(97007, "A work order given a new lead from Reassign or its page goes to the bottom",
  BASE_EDIT + [
    "A second dispatcher with Work Orders create and edit at the same location, signed in in a second browser (Settings > Staff > add a staff member, e.g. \"ZZAUTOTEST Dispatcher Two\")."
  ] + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo", "ZZAUTOTEST Cal Charlie"') + WO_HOW + [
    'Work orders (Approved): lead Ben — "ZZAUTOTEST Bravo Co", "ZZAUTOTEST Delta Co"; lead Cal — "ZZAUTOTEST Aardvark Co", "ZZAUTOTEST Abbey Co", "ZZAUTOTEST Echo Co".',
    "Nobody has reordered Ben's work at this location, so Ben's column starts in customer-name order: Bravo Co, Delta Co.", NO_SHIFTS],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   'Hover the Aardvark Co card in Cal\'s column and click its more-actions button (…).',
   'Click "Reassign lead technician" (the design labels it "Reassign Lead Tech").',
   "In the dialog pick Ben Bravo (and confirm if the dialog has a confirm button).",
   "Read the order of Ben's column.",
   "Open the Abbey Co work order, set Lead Technician to Ben Bravo on the work order page, then go back to Work Orders > All > Board View.",
   "Read the order of Ben's column.",
   "Drag the Echo Co card from Cal's column and drop it between Bravo Co and Delta Co in Ben's column.",
   TECHVIEW,
   "In the second browser, as the second dispatcher, open Work Orders > All, search \"ZZAUTOTEST\" and read Ben's work in Tech View and in Board View."],
  ["Step 7: Ben's column reads Bravo Co, Delta Co, Aardvark Co. Aardvark Co goes to the bottom, even though by customer name it would come first.",
   "Step 9: Ben's column reads Bravo Co, Delta Co, Aardvark Co, Abbey Co. A lead set on the work order page also goes to the bottom.",
   "Step 10: Echo Co lands where it was dropped. Ben's column reads Bravo Co, Echo Co, Delta Co, Aardvark Co, Abbey Co.",
   "Steps 11 and 12: Tech View shows the same order in Ben's group, and the second dispatcher sees the same order in both views."],
  src(["S9", "S2"], ["S9-R14", "S2-R6"], S9R14_SRC_EXTRA),
  [prd("S9-R14"), prd("S2-R6")],
  "Rewritten to the 7 Oct S9-R14 text (old quote said removal goes to the bottom of Unassigned). This case now checks the new-lead part. Removal, creation-with-lead and the new-technician rule moved to their own new cases.")

N(S9, "Removing the lead puts the work order in its normal place in Unassigned",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha"') + WO_HOW + [
    'Work orders (Approved): no lead — "ZZAUTOTEST Bravo Co", "ZZAUTOTEST Delta Co"; lead Ana — "ZZAUTOTEST Alpha Co", "ZZAUTOTEST Charlie Co".',
    "Nobody has reordered work in Unassigned at this location (if unsure, use a new location: Settings > Locations, with the technician enrolled there).", NO_SHIFTS],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Read the Unassigned column order (with the example data: Bravo Co, Delta Co).",
   'Hover the Charlie Co card in Ana\'s column, click more-actions (…), click "Reassign lead technician", pick Unassigned (and confirm if there is a confirm button).',
   "Read the Unassigned column order.",
   "Open the Alpha Co work order, clear its Lead Technician on the work order page, then go back to Work Orders > All > Board View.",
   "Read the Unassigned column order.",
   TECHVIEW],
  ['Step 5 shows the message "Lead technician removed".',
   "Step 6: Unassigned reads Bravo Co, Charlie Co, Delta Co. Charlie Co takes its normal customer-name place, not the bottom.",
   "Step 8: Unassigned reads Alpha Co, Bravo Co, Charlie Co, Delta Co. Alpha Co is first by customer name, not at the bottom.",
   "Step 9: Tech View's Unassigned group shows the same order."],
  src(["S9", "S4"], ["S9-R14", "S2-R6", "S4-R5"], S9R14_SRC_EXTRA),
  [prd("S9-R14"), prd("S2-R6"), prd("S4-R5")],
  "S9-R14 (changed 7 Oct): removing the lead from the dialog or the work order page uses the initial sort in Unassigned.")

N(S9, "A work order created with a lead keeps its normal place, not the bottom",
  BASE_EDIT + techs('"ZZAUTOTEST Ben Bravo"') + WO_HOW + [
    'Work orders (Approved), lead Ben: "ZZAUTOTEST Bravo Co", "ZZAUTOTEST Delta Co". Nobody has reordered Ben\'s work at this location.'],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Read Ben's column (with the example data: Bravo Co, Delta Co).",
   'Click New Work Order, pick customer "ZZAUTOTEST Charlie Co" and an asset, choose Ben Bravo as Lead Technician in that window, and create it. If the New Work Order window has no Lead Technician field, instead split a line of the Bravo Co work order off into a new work order (it keeps Ben as lead) and write down which way you used.',
   "Go back to Work Orders > All > Board View with the same search and read Ben's column."],
  ["Step 6: the new work order sits in its customer-name place. With the example data Ben's column reads Bravo Co, Charlie Co, Delta Co, and Charlie Co is not at the bottom.",
   "If you used Split, the split-off work order also takes its customer-name place among Ben's work, not the bottom."],
  src(["S9"], ["S9-R14", "S9-R3", "S2-R6"], "Engineering question and plan: PRD footer comment by Slavcho Mitrov, 29 Sep 2026, answered in the 7 Oct PRD."),
  [prd("S9-R14"), prd("S9-R3"), prd("S2-R6")],
  "S9-R14 last sentence: a work order created or split off with a lead keeps the initial sort.")

N(S9, "A newly added technician appears after the existing unpinned technicians",
  BASE_EDIT + techs('"ZZAUTOTEST Ben Bravo", "ZZAUTOTEST Cal Charlie", "ZZAUTOTEST Dan Delta"') + [
    "Pin Dan in Board View (pin button in his column header, tooltip \"Pin column\").",
    "Reorder the unpinned technicians in Board View so they read Cal, Ben (drag Cal's header before Ben's).",
    'A staff member who is not yet a technician, e.g. "ZZAUTOTEST Ezra Echo" with the Time Clock setting off (Settings > Staff).'],
  [OPEN_WO, BOARDVIEW,
   "Write down the column order (Unassigned, Dan pinned, Cal, Ben).",
   'Settings > Staff > add a new staff member "ZZAUTOTEST Aaron Able": Active, Time Clock on, role Technician, enrolled at this location. Save.',
   "Go back to Work Orders > All > Board View and read the column order.",
   "Settings > Staff > open ZZAUTOTEST Ezra Echo > Edit Staff Member > turn Time Clock on > save.",
   "Go back to Work Orders > All > Board View and read the column order.",
   TECHVIEW],
  ["Step 5: Aaron Able appears after the last unpinned technician: Unassigned, Dan (pinned), Cal, Ben, Aaron. He is not placed first by name, and your order is kept.",
   "Step 7: Ezra Echo, who now counts as a technician, is added after Aaron: Unassigned, Dan, Cal, Ben, Aaron, Ezra.",
   "Step 8: Tech View shows the technician groups in the same order."],
  src(["S9"], ["S9-R4"], "Inline PRD comment by Sasha Grosman, 25 Sep 2026 (a new staff record that meets the technician criteria)."),
  [prd("S9-R4"), prd("S9-R3")],
  "S9-R4 split out of C97007 so each case checks one rule.")

U(97008, "Moving to another technician shows the message, reordering shows none",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo"') + WO_HOW + [
    'Work orders (Approved): lead Ana — "ZZAUTOTEST Alpha Co", "ZZAUTOTEST Bravo Co", "ZZAUTOTEST Charlie Co"; lead Ben — "ZZAUTOTEST Delta Co".', NO_SHIFTS],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Write down the header counts (Ana 3, Ben 1).",
   "Drag the Alpha Co card from Ana's column into Ben's column and release. Do not reload.",
   "Read the message that appears and both header counts, then wait about 10 seconds without clicking.",
   "Drag the Alpha Co card above the Delta Co card inside Ben's column and release.",
   "Read the screen for any message, read both header counts, then open Alpha Co and read Lead Technician."],
  ['Step 6: "Lead technician updated" appears and the counts change at once to Ana 2, Ben 2 (3 − 1 = 2 and 1 + 1 = 2), with no page reload. The message fades by itself.',
   "Step 8: Alpha Co moves above Delta Co. No message appears, the counts stay Ana 2, Ben 2, and Alpha Co still has Lead Technician Ben Bravo."],
  src(["S9", "S4"], ["S9-R5", "S9-R15", "S4-R5", "S4-R7", "S4-R16"]),
  [prd("S9-R5"), prd("S9-R15"), prd("S4-R5"), prd("S4-R7"), prd("S4-R16")],
  "Rewritten in full: counts with arithmetic, toast wording, auto-dismiss, and the no-toast reorder in the same column.")

U(97009, "Invoiced and Paid work orders can only be reordered within their technician",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo"') + WO_HOW + [
    'Work orders with lead Ana: "ZZAUTOTEST Alpha Co" Approved, "ZZAUTOTEST Bravo Co" Invoiced, "ZZAUTOTEST Charlie Co" Paid, "ZZAUTOTEST Delta Co" Declined, "ZZAUTOTEST Echo Co" Complete. With no lead: "ZZAUTOTEST Golf Co" Invoiced (invoice it without setting a lead).', NO_SHIFTS],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Look at the Bravo Co and Charlie Co cards and hover the lock or any marker on them.",
   "Drag the Bravo Co card above the Alpha Co card inside Ana's column and release.",
   "Drag the Bravo Co card into Ben's column and release.",
   "Drag the Charlie Co card into the Unassigned column and release.",
   "Drag the Golf Co card from Unassigned into Ana's column and release.",
   "Drag the Delta Co card into Ben's column and release, then drag the Echo Co card into Ben's column and release.",
   TECHVIEW, "Drag the Charlie Co row into Ben's group and release."],
  ["Step 4: Bravo Co and Charlie Co show that they can only be reordered within Ana's work, not moved to another technician (the design shows a lock with the text \"Invoiced · can't be reassigned\"). " + LABEL_NOTE,
   "Step 5: Bravo Co moves above Alpha Co. Reordering within the same technician is allowed.",
   "Steps 6 and 7: Bravo Co cannot be dropped on Ben and Charlie Co cannot be dropped on Unassigned. Both stay in Ana's column, no lead-change message appears and Ana's count is unchanged.",
   "Step 8: Golf Co cannot be moved out of Unassigned. It stays there.",
   "Step 9: Declined (Delta Co) and Complete (Echo Co) work orders move to Ben's column with \"Lead technician updated\".",
   "Step 11: the same rule holds in Tech View. Charlie Co stays in Ana's group."],
  src(["S9", "S4"], ["S9-N1", "S4-N2", "S4-N7"], "Review Decisions page 853901313, DR-37 (25 Sep 2026). Design screen: lock text \"Invoiced · can't be reassigned\". Tech plan (revised 24 Sep 2026) section 3.23."),
  [prd("S9-N1"), prd("S4-N2"), prd("S4-N7"),
   tp("3.23 lead lock vs reorder", "In a locked status a work order can be dragged within its current technician (or within Unassigned if it has no lead); it cannot be dropped on another technician, and cannot move between a technician and Unassigned.")],
  "Rewritten in full to the current status rule (Invoiced and Paid reorder in place, Declined and Complete move freely). The permission half moved to a new case.")

N(S9, "A user without Work Orders create and edit cannot drag work orders",
  [LOCATION, WIDTH] + SIGNIN_VIEW_ONLY_SETUP + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo"') + WO_HOW + [
    'Work orders (Approved), lead Ana: "ZZAUTOTEST Alpha Co", "ZZAUTOTEST Bravo Co".'],
  ["Sign in as the view-only user.", OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Try to drag the Bravo Co card above Alpha Co inside Ana's column and release.",
   "Try to drag the Alpha Co card into Ben's column and release.",
   "Hover the Alpha Co card and look for a more-actions (…) button.",
   TECHVIEW, "Try to drag the Alpha Co row into Ben's group and release.",
   "Refresh, then open Alpha Co and read Lead Technician."],
  ["Steps 5 and 6: the cards cannot be moved, neither within Ana's column nor to Ben. They stay where they were and no message appears.",
   "Step 7: no Reassign lead technician action is offered to this user.",
   "Step 9: rows cannot be dragged in Tech View either.",
   "Step 10: the order is still Alpha Co, Bravo Co and Alpha Co still has Lead Technician Ana Alpha."],
  src(["S9", "S4"], ["S9-N1", "S4-N1"], "Story 9 prerequisite and Key Decisions (Permissions), same PRD."),
  [prd("S9-N1"), prd("S4-N1"),
   prd_sub("Story 9 prerequisite", "Dragging work orders or changing lead technicians requires Work Orders create and edit.", "requires Work Orders create and edit.")],
  "S9-N1 permission half, split from C97009 so each case checks one rule.")

U(97010, "Nothing can be dropped on an inactive technician, and a failed drop goes back",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo", "ZZAUTOTEST Dan Delta"') + WO_HOW + [
    'Work orders (Approved): lead Ana — "ZZAUTOTEST Alpha Co"; lead Dan — "ZZAUTOTEST Delta Co".',
    "Then deactivate Dan: Settings > Staff > ZZAUTOTEST Dan Delta > Edit Staff Member > turn Active off > save. Dan's column stays because he still leads Delta Co.",
    NO_SHIFTS],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Find Dan's column (marked as inactive) and write down its count (1).",
   "Drag the Alpha Co card from Ana's column into Dan's column and release.",
   "Turn this computer's network off (Wi-Fi off or cable out). Leave the page open.",
   "Drag the Alpha Co card from Ana's column into Ben's column and release.",
   "Read the alert, then click its dismiss (X) button.",
   "Turn the network back on and refresh the page.",
   "Open Alpha Co and read Lead Technician."],
  ["Step 5: Dan's column does not accept the card. Alpha Co stays in Ana's column, Dan's count stays 1, and no lead-change message appears.",
   'Step 7: the move cannot be saved. The card goes back to Ana\'s column and the alert reads "Failed to update lead technician, please try again."',
   "Step 8: the alert stays until you dismiss it.",
   "Steps 9 and 10: after the refresh Alpha Co is still in Ana's column with Lead Technician Ana Alpha.",
   "If the app shows its own offline message instead of the alert, write it down. Pass on the card going back and the lead staying unchanged, and note that the alert wording could not be checked this way."],
  src(["S9", "S4"], ["S9-N2", "S4-N5", "S4-N3", "S4-N8"]),
  [prd("S9-N2"), prd("S4-N5"), prd("S4-N3"), prd("S4-N8")],
  "Rewritten in full: inactive technician made by steps, and a failure caused by hand (network off) instead of an untestable forced failure.")

U(97011, "A cancelled drag leaves the order and the lead unchanged",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo"') + WO_HOW + [
    'Work orders (Approved), lead Ana: "ZZAUTOTEST Alpha Co", "ZZAUTOTEST Bravo Co". Lead Ben: "ZZAUTOTEST Charlie Co".'],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Write down Ana's column order and both counts (Alpha Co, Bravo Co. Ana 2, Ben 1).",
   "Press on the Bravo Co card, drag it over Ben's column and, still holding the mouse button, press Escape. Then release the mouse button.",
   "Press on the Bravo Co card, drag it above Alpha Co and press Escape before releasing.",
   "Press on the Bravo Co card, drag it onto the toolbar (outside every column) and release.",
   TECHVIEW, "Repeat step 5 on the Bravo Co row in Tech View.",
   "Refresh the page and open Bravo Co to read Lead Technician."],
  ["Steps 5 to 8: each drag is cancelled. Bravo Co returns to its place, Ana's column still reads Alpha Co, Bravo Co, the counts stay Ana 2, Ben 1, and no message appears.",
   "Step 9: after the refresh nothing changed and Bravo Co still has Lead Technician Ana Alpha.",
   "Escape cancelling the drag comes from the engineering plan, and the keyboard design is still pending. If Escape does not cancel, write that down and judge the drop-outside cancel (step 7) on its own."],
  src(["S9", "S11"], ["S9-N3", "S11-R5"], "Tech plan (revised 24 Sep 2026) Phase 11."),
  [prd("S9-N3"), prd("S11-R5"), tp("Phase 11 Escape", "S11-R5's Escape-cancels-drag is built in Phase 9 and only verified here")],
  "Rewritten in full: three real ways to cancel a drag, with order, counts and lead re-read.")

U(97012, "A drop is refused if the status or permission changed after the board loaded",
  BASE_EDIT + [
    "A second browser signed in as an Admin at the same location.",
    'A custom role for your dispatcher you are allowed to edit (e.g. "ZZAUTOTEST Dispatcher Role" with Work Orders View and Create & Edit), assigned to your dispatcher user before you start.'
  ] + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo"') + WO_HOW + [
    'Work orders, lead Ana: "ZZAUTOTEST Alpha Co" Complete, "ZZAUTOTEST Bravo Co" Approved.', NO_SHIFTS],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "In the second browser (Admin), open the Alpha Co work order and click Finance > Create Invoice so it becomes Invoiced.",
   "Back in your browser, without refreshing, drag the Alpha Co card from Ana's column into Ben's column and release.",
   "Read the alert, dismiss it, then refresh and open Alpha Co to read Lead Technician.",
   "In the second browser (Admin), Settings > Roles & Permissions > edit ZZAUTOTEST Dispatcher Role > untick Create & Edit on the Work Orders card > Save and confirm.",
   "Back in your browser, without refreshing, drag the Bravo Co card into Ben's column and release.",
   "Refresh and open Bravo Co to read Lead Technician."],
  ['Step 5: the drop is refused. The card goes back to Ana\'s column and the alert reads "Failed to update lead technician, please try again." with an explanation that the status does not allow it (write down the explanation words).',
   "Step 6: Alpha Co is Invoiced and still has Lead Technician Ana Alpha.",
   "Steps 8 and 9: the move is refused and Bravo Co still has Lead Technician Ana Alpha after the refresh. If the app signs you out when your permissions change, write that down. The check passes if the lead is unchanged."],
  src(["S9", "S4"], ["S9-E1", "S4-E3", "S4-N3", "S4-N8"]),
  [prd("S9-E1"), prd("S4-E3"), prd("S4-N3"), prd("S4-N8")],
  "Rewritten in full: the status and permission changes are made by a second real user in a second browser, so no developer help is needed.")

FILTER_EX = prd_sub("Story 9 filtered-order examples", "Filtered-order examples — confirmed:", "subject to fixed Unassigned and pinned-area boundaries.")
U(97013, "Reordering while filtered keeps the order right when the filter is cleared",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha"') + WO_HOW + [
    'Four work orders with lead Ana: "ZZAUTOTEST Alpha Co" (In Progress), "ZZAUTOTEST Bravo Co" (Approved), "ZZAUTOTEST Charlie Co" (In Progress), "ZZAUTOTEST Delta Co" (Approved). Nobody has reordered Ana\'s work, so the full order is A, B, C, D (Alpha, Bravo, Charlie, Delta).'],
  [OPEN_WO, SEARCH_ZZ, TECHVIEW,
   "Read Ana's group: Alpha Co, Bravo Co, Charlie Co, Delta Co.",
   'Click Status and tick "In progress" only. Ana\'s group now shows Alpha Co and Charlie Co.',
   "Drag Charlie Co above Alpha Co and release.",
   'Click Status > "Clear selection" and read Ana\'s group.',
   "Drag the rows back into the order Alpha Co, Bravo Co, Charlie Co, Delta Co and read the group to confirm it.",
   'Click Status, tick "In progress" only, and drag Alpha Co below Charlie Co.',
   'Click Status > "Clear selection" and read Ana\'s group.',
   BOARDVIEW],
  ["Step 7: the order is Charlie Co, Alpha Co, Bravo Co, Delta Co (C, A, B, D): Charlie Co was placed right above Alpha Co and the hidden Bravo Co and Delta Co kept their relative order.",
   "Step 10: the order is Bravo Co, Charlie Co, Alpha Co, Delta Co (B, C, A, D): Alpha Co was placed right below Charlie Co.",
   "Step 11: Board View shows Ana's column in the same order, B, C, A, D."],
  src(["S9"], ["S9-E2", "S9-E3", "Story 9 filtered-order examples"]),
  [prd("S9-E2"), prd("S9-E3"), FILTER_EX],
  "Rewritten in full: the two confirmed examples are now executable, with statuses chosen so a real Status filter shows exactly A and C.")

N(S9, "Reordering technicians while some are hidden keeps the hidden ones in place",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo", "ZZAUTOTEST Cal Charlie", "ZZAUTOTEST Dan Delta"') + WO_HOW + [
    'Work orders (Approved): lead Ana — "ZZAUTOTEST Alpha Co"; lead Ben — "ZZAUTOTEST Bravo Co"; lead Cal — "ZZAUTOTEST Charlie Co"; lead Dan — "ZZAUTOTEST Delta Co".',
    "Make yourself the Service Advisor on Alpha Co and Charlie Co (work order page > Service Advisor), so Assigned to me shows only those two. If Assigned to me does not pick them up, make yourself the technician on one line of each instead.",
    "No technician is pinned. Your technician order is the starting one: Ana, Ben, Cal, Dan."],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   'Click "Assigned to me". Only Ana\'s and Cal\'s columns show.',
   "Drag Cal's column header before Ana's and release.",
   'Click "Assigned to me" again to turn it off and read the column order.'],
  ["Step 6: the technician order is Cal, Ana, Ben, Dan. Cal was placed right before Ana and the hidden Ben and Dan kept their relative order (the same pattern as the work order examples: C, A, B, D)."],
  src(["S9"], ["S9-E2", "S9-E3", "Story 9 filtered-order examples"]),
  [prd("S9-E2"), prd("S9-E3"), FILTER_EX],
  "The confirmed examples also apply to technician groups/columns. Not covered before.")

N(S9, "When two dispatchers reorder the same technician, the later drop wins",
  BASE_EDIT + [
    "A second dispatcher with Work Orders create and edit at the same location, signed in in a second browser (e.g. \"ZZAUTOTEST Dispatcher Two\")."
  ] + techs('"ZZAUTOTEST Ana Alpha"') + WO_HOW + [
    'Work orders (Approved), lead Ana: "ZZAUTOTEST Alpha Co", "ZZAUTOTEST Bravo Co", "ZZAUTOTEST Charlie Co". Nobody has reordered Ana\'s work, so both browsers show Alpha Co, Bravo Co, Charlie Co.'],
  ["In both browsers open Work Orders > All, search \"ZZAUTOTEST\" and click Board View.",
   "In browser 1, drag Charlie Co to the top of Ana's column and release.",
   "In browser 2, without refreshing, drag Bravo Co to the top of Ana's column and release.",
   "In browser 1, watch the screen for a warning, then refresh.",
   "In browser 2, refresh."],
  ["Step 4: browser 1 shows no warning about the other change.",
   "After browser 1 refreshes, Ana's column shows browser 2's saved order: Bravo Co, Alpha Co, Charlie Co (the later save wins).",
   "Step 5: browser 2 shows the same order, Bravo Co, Alpha Co, Charlie Co.",
   'If either browser shows "The card you dropped this next to has moved. Refresh the board and try again." or "The board is busy with another move. Please try again.", the card goes back to where it was. Write it down; that is a different, allowed outcome checked in the Story 4 cases.'],
  src(["S9", "S4"], ["S9-R11", "S4-N11", "S4-N12"], "Concurrency decision: Review Decisions page 853901313, DR-35 (Chris Ward, 28 Sep 2026)."),
  [prd("S9-R11"), prd("S4-N11"), prd("S4-N12")],
  "S9-R11 last sentence (later save wins, no warning) made executable with two real users.")

# =====================================================================================
# STORY 11 — section 13246 (keyboard design still pending: SQ-15 / UX-19)
# =====================================================================================
S11 = 13246
KB_PENDING = ("The keyboard and focus design is not finished yet (the design shows no keyboard behaviour). Where a step names a key, "
              "try Tab, Shift+Tab, the arrow keys, Enter, Space and Escape, and write down which key does what.")
KB_STORY = prd_sub("Story 11 user story", "As a keyboard user, I want to navigate work orders and their actions", "usable without a mouse.")
KB_DESIGN = prd_sub("Story 11 design line", "keyboard interaction design pending", "keyboard interaction design pending")
KB_SRC_EXTRA = ("Review Decisions page 853901313, SQ-15 (Open) and UX-19 (Open). Inline PRD comment by Slavcho Mitrov, 28 Sep 2026, lists what is still open with design. "
                "Tech plan (revised 24 Sep 2026) Phase 11.")
KB_PRE = BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo"') + WO_HOW + [
    'Work orders (Approved): lead Ana — "ZZAUTOTEST Alpha Co", "ZZAUTOTEST Bravo Co"; lead Ben — "ZZAUTOTEST Charlie Co"; no lead — "ZZAUTOTEST Golf Co".',
    "Put the mouse aside. From step 4 on, use only the keyboard.", KB_PENDING]

U(97020, "The keyboard cannot get around permission or status limits",
  [LOCATION, WIDTH] + SIGNIN_VIEW_ONLY_SETUP + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo"') + WO_HOW + [
    'Work orders with lead Ana: "ZZAUTOTEST Alpha Co" Approved, "ZZAUTOTEST Bravo Co" Invoiced.',
    "Your dispatcher login (Work Orders create and edit) as well.", KB_PENDING],
  ["Sign in as the view-only user, open Work Orders > All, search \"ZZAUTOTEST\" and click Board View.",
   "Using only the keyboard, move focus onto the Alpha Co card and try every key that could open a menu or move it (Enter, Space, the arrow keys, Shift plus the arrow keys).",
   "Sign in as the dispatcher in the same way and click Board View.",
   "Using only the keyboard, focus the Bravo Co card (Invoiced), reach its more-actions button and press Enter.",
   'Move focus to "Reassign lead technician" in the menu and press Enter.',
   "Try any keyboard move of Bravo Co to Ben's column, then refresh and open Bravo Co to read Lead Technician."],
  ["Step 2: the view-only user cannot open Reassign lead technician or move the card with any key. Alpha Co keeps its place and its lead.",
   'Steps 4 and 5: the menu opens, but "Reassign lead technician" is disabled for the Invoiced work order and Enter does nothing. Its tooltip, if you can reach it, reads "The lead technician can\'t be changed once a work order is Invoiced or Paid."',
   "Step 6: Bravo Co cannot be moved to another technician by keyboard and still has Lead Technician Ana Alpha.",
   "The exact keys are still being designed; this case fails only if a key lets the user do something the mouse may not."],
  src(["S11", "S4"], ["S11-N1", "S4-N6"], KB_SRC_EXTRA),
  [prd("S11-N1"), prd("S4-N6"),
   tp("Phase 11 tests", "a keyboard-initiated reassign is refused for a locked status and without permission (S11-N1).")],
  "Rewritten in full: view-only user created by steps, Invoiced lock tried by keyboard, honest note that key choices are design-pending.")

U(97021, "Keyboard focus can reach every card and row and move between technicians",
  KB_PRE,
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Click once in the Search box, then press Tab repeatedly until focus reaches the first card. Count the presses and watch for a visible focus outline.",
   "Move focus from card to card inside Ana's column and on to Ben's column and the Unassigned column, using the keys that work.",
   TECHVIEW,
   "Repeat steps 4 and 5 for rows and technician groups in Tech View."],
  ["Steps 4 and 6: focus can enter a card (Board View) and a row (Tech View), and you can always see which card or row has focus.",
   "Steps 5 and 7: every card or row and every technician column or group can be reached by keyboard alone. Write down the keys used.",
   "Which keys do this is not designed yet (still open with design). Pass if every card, row, column and group can be reached by keyboard. Fail if any cannot be reached at all, and say which."],
  src(["S11"], ["S11-R1", "S11-R3", "Story 11 user story"], KB_SRC_EXTRA),
  [prd("S11-R1"), prd("S11-R3"), KB_STORY, KB_DESIGN,
   tp("Phase 11 waits on design", "Waits on design UX-19 / SQ-15 — do not guess these")],
  "Split: this case now covers focus entry and movement only (S11-R1, R3). The other keyboard items have their own cases. Runnable today, with the design-pending parts said plainly.")

U(97022, "Keyboard focus is not lost when a dialog closes or a card disappears",
  KB_PRE + ["A second browser signed in as an Admin (to deactivate a technician during the test)."],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   'Using only the keyboard, focus the Alpha Co card, open its more-actions menu, open "Reassign lead technician", then close the dialog with Cancel (or Escape). Note where focus is.',
   'Click Status, tick "Approved" only, then by keyboard focus the Golf Co card. In the second browser change Golf Co\'s status to In Progress, then refresh your board. Note where focus is.',
   "Clear the Status filter. By keyboard focus Ben's column. In the second browser deactivate Ben (Settings > Staff > Ben > Edit Staff Member > Active off), then refresh your board. Note where focus is."],
  ["Step 4: when the dialog closes, focus returns to a sensible place (you can see it and keep working without the mouse). Write down where it went.",
   "Step 5: after Golf Co leaves the filtered results, focus is not lost. It lands on a visible, sensible element. Write down where.",
   "Step 6: after Ben becomes inactive, focus is not lost. Write down where it lands.",
   "Where focus should go is not designed yet. Pass if focus is always visible and the keyboard user can carry on. Fail if focus disappears (for example back to the top of the page or nowhere visible)."],
  src(["S11"], ["S11-R6", "S11-E1", "S11-E2", "Story 11 user story"], KB_SRC_EXTRA),
  [prd("S11-R6"), prd("S11-E1"), prd("S11-E2"), KB_STORY, KB_DESIGN],
  "Rewritten in full: each focus-loss situation is caused by real actions (dialog close, a status change by a second user, a deactivation). The design-pending part is said plainly.")

N(S11, "Pressing Enter on a focused card opens the work order without dragging",
  KB_PRE,
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Using only the keyboard, focus the Alpha Co card and press Enter.",
   "Go back with the browser Back button (Alt+Left), focus the Alpha Co card again and try any key that might pick it up for a move (for example Space).",
   TECHVIEW, "Focus the Alpha Co row and press Enter."],
  ["Step 4: Enter opens the Alpha Co work order. Write down what Enter did.",
   "Step 5: opening a work order and picking a card up for a move do not get mixed up: one key opens and another key moves, or moving is not offered by keyboard. Write down what happened. The card does not move unless you choose to move it.",
   "Step 7: Enter opens the work order from a Tech View row.",
   "What Enter does and how opening coexists with moving are not designed yet. Pass if a keyboard user can open a work order without moving it by accident."],
  src(["S11"], ["S11-R4", "S11-R10", "Story 11 user story"], KB_SRC_EXTRA),
  [prd("S11-R4"), prd("S11-R10"), KB_STORY, KB_DESIGN],
  "S11-R4 and S11-R10 split out of C97021.")

N(S11, "The keyboard reaches the card menu, pin and collapse controls",
  KB_PRE,
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Using only the keyboard, focus the Alpha Co card and move focus to its more-actions button.",
   "Press Enter to open the menu, then press Escape.",
   "Move focus to the pin button in Ana's column header and press Enter, then press Enter again.",
   TECHVIEW,
   "Move focus to the collapse button of Ana's group and press Enter, then press Enter again."],
  ["Step 4: the more-actions button appears when the card has keyboard focus (not only on mouse hover).",
   "Step 5: Enter (or Space) opens the menu and Escape closes it.",
   "Step 6: Ana is pinned, then unpinned, using only the keyboard.",
   "Step 8: Ana's group collapses, then expands, using only the keyboard.",
   "Engineering is building these now. The exact keys are not designed yet: write down the keys that worked."],
  src(["S11", "S3"], ["S11-R2", "S11-R5", "S11-R7", "S11-R8", "S3-R13"], KB_SRC_EXTRA),
  [prd("S11-R2"), prd("S11-R5"), prd("S11-R7"), prd("S11-R8"), prd("S3-R13"),
   tp("Phase 11 controls", "Every control is a real button with an `aria-label`; the more-actions overlay reveals on `:focus-within`; pin and collapse are keyboard-reachable (S11-R2, S11-R7, S11-R8)"),
   tp("Phase 11 tests menu", "more-actions opens with Enter and Space; the overlay is visible on focus")],
  "S11-R2, R5, R7, R8 split out of C97021. Runnable now (the tech plan builds them now).")

N(S11, "A work order can be moved to another technician using only the keyboard",
  KB_PRE + [NO_SHIFTS],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   'Using only the keyboard, focus the Alpha Co card, open its more-actions menu and choose "Reassign lead technician".',
   "In the dialog, type \"Ben\" in the search, move to Ben Bravo with the keyboard and confirm with Enter.",
   "Try to change the order of Ana's remaining cards (put Bravo Co first) using only the keyboard."],
  ['Steps 4 and 5: Alpha Co moves to Ben\'s column and "Lead technician updated" appears. The dialog is the keyboard way to move work between technicians.',
   "Step 6: write down whether the cards can be reordered by keyboard and which keys do it. A keyboard way to reorder is not designed yet. If none exists, mark this part not checked and pass or fail on steps 4 and 5."],
  src(["S11", "S4"], ["S11-R9", "S4-R5"], KB_SRC_EXTRA),
  [prd("S11-R9"), prd("S4-R5"),
   tp("Phase 11 dialog", "The dialog is the keyboard path for moving work between technicians; it runs the same permission and status checks as the pointer path (S11-N1)")],
  "S11-R9 split out of C97021.")

# =====================================================================================
# STORY 12 — section 13247 (analytics). Nothing on screen changes for this story.
# =====================================================================================
S12 = 13247
GA_BASE = [SIGNIN_EDIT, LOCATION, WIDTH, GA_PRE, GA_NAMES]
GA_EXTRA_Q = [prd_sub("Story 12 prerequisites", "Reuse the application’s existing Google Analytics setup", "field visibility follows S5-E2.")]

U(97023, "A display view is recorded on load and on each display or tab switch",
  GA_BASE + ["Your saved display is List (click List in the display switcher once before you start).", GA_FRESH],
  ["Open Work Orders from the top menu and wait for the rows to load. In DebugView, count the work_orders_display_view events.",
   TECHVIEW, BOARDVIEW,
   "Click the Estimates tab, then the All tab.",
   "Scroll a long column or group so more cards load, then wait 30 seconds.",
   'Type "ZZAUTOTEST" in Search, then click Status and tick "Approved".',
   "Narrow the browser window below 1024 px wide, then widen it back to full size.",
   "Count the work_orders_display_view events since step 1 and read the display and tab each one names."],
  ["Step 1: exactly 1 display view is recorded, for List on the tab you opened.",
   "Steps 2 and 3: 1 more each, naming Tech View, then Board View (running total 3).",
   "Step 4: 1 more for each tab switch, naming Estimates, then All (running total 5).",
   "Steps 5 to 7: no new display view. Loading more rows, searching, filtering and narrowing then widening the window back to the same display and tab are not new views.",
   "Step 8: total = 1 + 2 + 2 = 5 display views. The Work Orders page looked and worked as usual throughout."],
  src(["S12", "S5"], ["S12-R1", "S12-R6", "S5-R7"], GA_SRC + " Tech plan (revised 24 Sep 2026) Phase 10 tests."),
  [prd("S12-R1"), prd("S12-R6"), prd("S5-R7"), tp("Phase 10 tests refetch", "no event on refetch or continuation")] + GA_EXTRA_Q,
  "Rewritten in full: observable in GA DebugView instead of devtools, exact running counts with arithmetic, and the non-events (row loading, search, filter, window width).")

U(97024, "Fields on and off are recorded once per display per session",
  GA_BASE + ["You have the see financial data permission.",
             "In Board View, turn VIN/Serial on in Fields to display before you start (so one optional field is a saved choice).", GA_FRESH],
  ["Open Work Orders and click Board View.",
   "In DebugView, count the work_orders_field_load events and read each one's field name, on/off value and source.",
   TECHVIEW, "Count the new work_orders_field_load events.",
   BOARDVIEW, LISTVIEW, BOARDVIEW,
   "Count the new work_orders_field_load events since step 4."],
  ["Step 2: 13 events, one per optional Board View field (lead technician name, customer, asset, VIN/serial, progress, service advisor, clocked in, line count, line technicians, estimated hours, total price, on-site indicator, created date). Fields you never changed show source default, and VIN/Serial shows on with source saved.",
   "Step 2 also shows one work_orders_density_load event for Board View.",
   "Step 4: 15 events for Tech View's optional columns, plus one work_orders_density_load.",
   "Step 8: 0 new field events and 0 new density events. Reopening a display in the same session records nothing again.",
   "Total field-load events in the session = 13 + 15 = 28."],
  src(["S12", "S5"], ["S12-R2", "S5-R11"], GA_SRC + " Field counts (Board View 13, Tech View 15) from Slavcho Mitrov's SV-10593 comment, 6 Oct 2026."),
  [prd("S12-R2"), prd_sub("S5-R11 optional fields", "*Optional fields:* lead technician name", "on-site indicator, and created date.")],
  "Rewritten in full: exact event counts per display, once-per-session proved by reopening, saved vs default source. The money-field part moved to its own new case.")

N(S12, "Money fields are left out of field usage for users without financial data",
  GA_BASE[:1] + [LOCATION, WIDTH, GA_PRE, GA_NAMES,
   'A user without the see financial data permission: Settings > Roles & Permissions > create a custom role (e.g. "ZZAUTOTEST No Money") with Work Orders View and Create & Edit but not see financial data. Add a staff member with that role and sign them in.', GA_FRESH],
  ["As the user without see financial data, open Work Orders and click Board View.",
   "In DebugView, count the work_orders_field_load events and look for total_price.",
   TECHVIEW, "Count the new work_orders_field_load events and look for total_price.",
   "Open Fields to display in Board View and look for Total price."],
  ["Step 2: 12 field events (13 − 1). No event for total price.",
   "Step 4: 14 field events (15 − 1). No event for total price.",
   "Step 5: Total price is not offered in the picker, and no card shows a dollar amount.",
   "Total for this user: 12 + 14 = 26. Total price is left out of usage completely for this user, so it cannot lower that field's usage rate."],
  src(["S12", "S5"], ["S12-R7", "S5-E2"], GA_SRC),
  [prd("S12-R7"), prd("S5-E2")],
  "S12-R7 split out of C97024. Exact counts 12 and 14 for a user without financial data.")

U(97025, "Field and density changes are recorded only after they save",
  GA_BASE + [GA_FRESH],
  ["Open Work Orders and click Board View.",
   "Open Fields to display, turn Service advisor on and Customer off, then close the picker.",
   "In DebugView, count the work_orders_field_toggle events.",
   "Open the density control (Density in the PRD. The design shows \"Card size\") and pick Compact.",
   "Count the work_orders_density_change events.",
   "Open the density control again and pick Compact again (the value it already has).",
   "Open Fields to display and close it without changing anything.",
   "Count the change events since step 5."],
  ["Step 3: 2 field change events, one for Service advisor (on) and one for Customer (off).",
   "Step 5: 1 density change event, naming Compact.",
   "Step 8: 0 new events. Re-picking the same density and closing the picker without a change are not changes.",
   "A failed save cannot be caused by hand without also blocking analytics. That part is not checked by hand: write \"failed save: not checked by hand\" in the result comment."],
  src(["S12"], ["S12-R3", "S12-R8", "S12-R9"], GA_SRC),
  [prd("S12-R3"), prd("S12-R8"), prd("S12-R9")],
  "Rewritten in full: exact counts per saved change, the no-change cases, and an honest note on the failed save, which cannot be done by hand.")

U(97026, "Default and saved settings show as separate groups in the reports",
  GA_BASE + ['A brand-new user who has never opened Work Orders (Settings > Staff > add, e.g. "ZZAUTOTEST Newbie", with Work Orders View).',
             "Your dispatcher has chosen a density (e.g. Comfortable) in an earlier session.",
             "You can open the Story 12 reports in Google Analytics (built and kept by Milos Vasic)."],
  ["Sign in as ZZAUTOTEST Newbie, open Work Orders and click Board View. Read the source on the display, field and density events in DebugView.",
   "Sign in as your dispatcher, open Work Orders and click Board View. Read the same sources.",
   "The next day (reports are not live), open the Story 12 reports and find the density and field reports for the test date."],
  ["Step 1: the events show source default.",
   "Step 2: the density event shows source saved (Comfortable).",
   "Step 3: the reports show default, saved and fallback as separate groups, with ZZAUTOTEST Newbie under default and your dispatcher's density under saved.",
   "A fallback (a setting that could not be loaded) cannot be caused by hand. Write \"fallback: not checked by hand\" in the result comment."],
  src(["S12"], ["S12-R12", "Story 12 report owner"], GA_SRC),
  [prd("S12-R12"), prd_sub("Story 12 report owner", "Milos Vasic owns building and maintaining the reports", "Story 12 is complete when both are done.")],
  "Rewritten in full, now one check (separate cohorts). The defaults-never-change rule moved to a new case.")

N(S12, "Usage figures never change the product defaults by themselves",
  [SIGNIN_EDIT, LOCATION, WIDTH,
   "Several users at the test location have chosen non-default settings over time (e.g. Board View, Compact density, Customer turned off in Fields to display).",
   'A brand-new user (Settings > Staff > add, e.g. "ZZAUTOTEST Fresh", with Work Orders View).'],
  ["Sign in as ZZAUTOTEST Fresh and open Work Orders.", "Read which display option is active.", BOARDVIEW,
   "Open the density control and read the selected value.", "Open Fields to display and read which fields are on."],
  ["Step 2: List is active (List stays the default for every new user).",
   "Step 4: Regular is selected (the default density).",
   "Step 5: the fields on are the standard Board View defaults: lead technician name, work order number, customer, unit number, asset, progress, total price, and status. The other users' choices did not change them."],
  src(["S12", "S1", "S5"], ["S12-R14", "S1-R2", "S6-R5", "S5-R13"]),
  [prd("S12-R14"), prd("S1-R2"), prd("S6-R5"), prd("S5-R13")],
  "S12-R14 split out of C97026 and made checkable on screen with a brand-new user.")

U(97027, "Analytics events carry no work order details, names or amounts",
  GA_BASE + ['Work order "ZZAUTOTEST Bravo Co" exists with a lead technician and a total price.', GA_FRESH],
  ["Open Work Orders, search \"ZZAUTOTEST Bravo\", and click Tech View, then Board View.",
   "Open Fields to display and turn VIN/Serial on, then change the density.",
   "In DebugView, open each Work Orders event from this session and read every parameter."],
  ["Every parameter holds only a field or setting name and its value (for example board_view, total_price, on, compact, default).",
   "No event contains a customer name (Bravo Co), a technician name, a work order number, a VIN, the search text \"ZZAUTOTEST Bravo\" or a dollar amount."],
  src(["S12"], ["S12-R5"], GA_SRC),
  [prd("S12-R5")],
  "Rewritten in full: concrete search text and record values to look for in every event. The identity rule moved to its own new case.")

N(S12, "Analytics events use the same user identity as other ShopView events",
  GA_BASE + [GA_FRESH],
  ["Open Work Orders and click Board View.",
   "Click a card to open a work order, then go back.",
   "In DebugView, select your device and compare the user shown on the work_orders_display_view event with the one on the existing work_order_view event from step 2."],
  ["Both events show the same user, the existing ShopView user ID. No new user or customer identifier appears on the Work Orders events."],
  src(["S12"], ["S12-R15"], GA_SRC),
  [prd("S12-R15")] + GA_EXTRA_Q,
  "S12-R15 split out of C97027.")

U(97028, "Blocked analytics never stops the page, settings or reassignment",
  [SIGNIN_EDIT, LOCATION, WIDTH] + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo"') + WO_HOW + [
    'Work order "ZZAUTOTEST Alpha Co" Approved with lead Ana.', NO_SHIFTS,
    "Block analytics in your browser: install a common tracker blocker extension (e.g. uBlock Origin) and turn it on for the QA site, or use your browser's setting that blocks trackers."],
  ["Open Work Orders, search \"ZZAUTOTEST\" and click Board View.",
   "Open Fields to display and turn VIN/Serial on, then pick Compact density.",
   "Drag the Alpha Co card from Ana's column into Ben's column.",
   "Refresh the page."],
  ["Step 1: the page loads normally.",
   "Step 2: the field and density changes apply at once.",
   'Step 3: the card moves and "Lead technician updated" appears.',
   "Step 4: after the refresh, Board View, VIN/Serial, Compact and Ben as lead are all still there. Analytics being blocked made no difference."],
  src(["S12"], ["S12-N1"]), [prd("S12-N1")],
  "Rewritten in full: analytics blocked with a normal browser blocker (no developer tools), then load, settings and reassignment each checked.")

U(97029, "Each analytics situation in the acceptance list records the right events",
  GA_BASE + ["A brand-new user (never opened Work Orders) and a user without see financial data (Settings > Staff, Settings > Roles & Permissions)."],
  ["First use: sign in as the brand-new user, open Work Orders, click Board View. Read the events.",
   "Restored settings: sign in as your dispatcher (with saved display, fields and density), open Work Orders. Read the events.",
   "View changes: click Tech View, then the Estimates tab. Read the events.",
   "Successful save: in Board View turn VIN/Serial on in Fields to display. Read the events.",
   "Financial visibility off: sign in as the user without see financial data and click Board View. Read the events."],
  ["Step 1: display view with source default, and 13 field events with source default.",
   "Step 2: the display view names your saved display with source saved, and fields and density show source saved.",
   "Step 3: one display view per switch (2 events).",
   "Step 4: one field change event for VIN/Serial (on).",
   "Step 5: 12 field events and none for total price.",
   "Fallback loading and a failed save cannot be caused by hand. Write \"fallback and failed save: not checked by hand\" in the result comment."],
  src(["S12"], ["S12-E1"], GA_SRC),
  [prd("S12-E1")],
  "Rewritten in full: each acceptance situation has its own step and expected events. The two that cannot be done by hand are named.")

# =====================================================================================
# NUMBERS / DATA ACCURACY — section 13248 (counts from seeded inputs, arithmetic shown)
# =====================================================================================
D = 13248
COUNT_SEED = WO_HOW + [
    'Seed exactly these work orders (customer names start with "ZZAUTOTEST"):',
    "↳ Lead Ana: Alpha Co Approved, Bravo Co Approved, Charlie Co Estimate (3).",
    "↳ Lead Ben: Delta Co In Progress, Echo Co Invoiced (2).",
    "↳ Lead Cal: none (0).",
    "↳ No lead: Golf Co Approved, Hotel Co Estimate (2).",
    "↳ Total: 3 + 2 + 0 + 2 = 7."]

U(97030, "Header counts match the rows and cards listed, in every display",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo", "ZZAUTOTEST Cal Charlie"') + COUNT_SEED,
  [OPEN_WO, SEARCH_ZZ, LISTVIEW, "Count the List rows.", TECHVIEW,
   "Read each group header count and count the rows under each group.", BOARDVIEW,
   "Read each column header count and count the cards in each column.",
   'Click Status and tick "Approved" only. Read the counts in Board View, then in Tech View, and count the List rows.',
   'Clear the Status filter and click the Estimates tab. Read the counts in Board View and in Tech View.'],
  ["Step 4: List shows 7 rows.",
   "Step 6: Tech View headers read Unassigned 2, Ana 3, Ben 2, Cal 0. Each count equals the rows under it, and 2 + 3 + 2 + 0 = 7 = the List rows.",
   "Step 8: Board View columns read Unassigned 2, Ana 3, Ben 2, Cal 0. Each count equals the cards in the column, with the same total 7.",
   "Step 9: Unassigned 1 (Golf Co), Ana 2 (Alpha Co, Bravo Co), Ben 0, Cal 0, total 3, in both views and the same as the 3 List rows.",
   "Step 10: Unassigned 1 (Hotel Co), Ana 1 (Charlie Co), Ben 0, Cal 0 in both views. Each count always equals what is listed under it."],
  src(["S2", "S3"], ["S2-R12", "S3-R12"], "Inline PRD comment answer by Chris Ward, 25 Sep 2026 (count = work orders shown after filters)."),
  [prd("S2-R12"), prd("S3-R12")],
  "Rewritten in full: a fixed 7-work-order seed, exact counts per header in three filter states, and a sum check against the List row count.")

U(97031, "Header counts change by exactly one after a move, with nothing counted twice",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo", "ZZAUTOTEST Cal Charlie"') + COUNT_SEED + [NO_SHIFTS],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   "Write down the counts (Unassigned 2, Ana 3, Ben 2, Cal 0, total 7).",
   "Drag Alpha Co from Ana to Cal and read the counts without reloading.",
   'Open Bravo Co\'s more-actions > "Reassign lead technician" > Unassigned. Read the counts.',
   "Drag Golf Co inside the Unassigned column above Hotel Co. Read the counts.",
   "Try to drag Echo Co (Invoiced) from Ben to Cal. Read the counts.",
   TECHVIEW, "Read every group count, then refresh and read them again."],
  ["Step 5: Ana 3 − 1 = 2, Cal 0 + 1 = 1, others unchanged. Total 7.",
   "Step 6: Ana 2 − 1 = 1, Unassigned 2 + 1 = 3. Total 7.",
   "Step 7 (reorder only): no count changes.",
   "Step 8 (refused move): no count changes.",
   "Steps 9 and 10: Tech View shows Unassigned 3, Ana 1, Ben 2, Cal 1 (3 + 1 + 2 + 1 = 7) before and after the refresh. Each count changed right after the move, with no reload."],
  src(["S4", "S9"], ["S4-R7", "S9-R5"]),
  [prd("S4-R7"), prd("S9-R5")],
  "Rewritten in full: running counts after each kind of change with the arithmetic shown, and the total held at 7.")

U(97032, "The open count in the Reassign dialog counts exactly four statuses",
  BASE_EDIT + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo"') + WO_HOW + [
    'Seed these work orders at this location (customers "ZZAUTOTEST …"), lead Ben unless stated:',
    "↳ Counted: Approved (1), In Progress (1), Review / Ready for Review (1), Complete (1) = 4.",
    "↳ Not counted: Estimate (1), Invoiced (1), Paid (1), Declined (1).",
    "↳ Not counted: an Approved work order with lead Ana where Ben is only the technician on one line.",
    "A second location where Ben is also enrolled (Settings > Locations, then enrol Ben there), with one Approved work order led by Ben at that location. Not counted here.",
    'One spare Approved work order with lead Ana, e.g. "ZZAUTOTEST Spare Co", to open the dialog from.'],
  [OPEN_WO, SEARCH_ZZ, BOARDVIEW,
   'Hover the Spare Co card, click more-actions (…) > "Reassign lead technician".',
   "Find Ben Bravo in the list and read his open count, then cancel the dialog.",
   'Click Status and tick "Estimate" only, open the dialog from any visible card, read Ben\'s count, then cancel and clear the filter.',
   "Open Ben's Estimate work order, approve it, come back and open the dialog again. Read Ben's count."],
  ["Step 5: Ben shows 4 open (Approved 1 + In Progress 1 + Ready for Review 1 + Complete 1 = 4). Estimate, Invoiced, Paid and Declined, the line-only work order, and the work order at the other location are not counted.",
   "Step 6: still 4 open. The page filter does not change the count.",
   "Step 7: 5 open (4 + 1) right after the Estimate became Approved.",
   "The design shows a count of all of a technician's work orders (e.g. \"4 open\" including Paid and Invoiced). If the build counts that way, it is a fail against the four statuses."],
  src(["S4"], ["S4-R15"], "Review Decisions page 853901313, DR-43 (29 Sep 2026). Lead only, current location and ignoring page filters: Sasha Grosman's answer to MF-3 in the PRD footer comment of 24 Sep 2026, recorded in the tech plan (revised 24 Sep 2026) section 1.4."),
  [prd("S4-R15"),
   tp("1.4 MF-3", "Confirmed plus Complete: lead only, current location, Approved / In Progress / Ready for Review / Complete, ignoring page filters (PRD S4-R15 not yet updated)")],
  "Rewritten in full: every status seeded once, so the expected 4 is computed by hand. Line-only, other location, filter and freshness traps each checked.")

U(97033, "Field selection rate is one combined share across all users, not an average",
  [LOCATION, WIDTH, GA_PRE,
   "Four test users at this location with Work Orders view (Settings > Staff): U1, U2 and U3 with see financial data, U4 without.",
   "You can open the Story 12 field selection report in Google Analytics (built and kept by Milos Vasic).",
   "Do the steps on two different days of the same week (Monday to Sunday)."],
  ["Day 1: sign in as U1, open Work Orders > Board View > Fields to display, turn VIN/Serial on, then off, then on again.",
   "Day 2: sign in as U2 and turn VIN/Serial on in Board View.",
   "Day 2: sign in as U3, open Board View and turn Total price off.",
   "Day 2: sign in as U4 and open Board View (change nothing).",
   "After the week, open the field selection report for Board View for that week, filtered to these four users if the report allows."],
  ["VIN/Serial: 4 users saw it (U1 to U4) and 2 have it on (U1, U2), so the rate is 2 ÷ 4 = 50%. U1 counts once however many times they toggled.",
   "The report must not show the average of daily rates. Day 1 = 1 ÷ 1 = 100% and day 2 = 1 ÷ 3 = 33.3%, so their average of 66.7% would be wrong. The correct figure is 50%.",
   "Total price: only U1, U2 and U3 could see it (U4 has no financial data). U1 and U2 have it on (default) and U3 turned it off, so the rate is 2 ÷ 3 = 66.7%, not 2 ÷ 4 = 50%.",
   "Rounding: write down how the report rounds (e.g. 66.7% or 67%). The number must round from 2 ÷ 3."],
  src(["S12"], ["S12-R10", "S12-R7", "S12-R13"], GA_SRC + " Tech plan (revised 24 Sep 2026) section 3.21 and Phase 10."),
  [prd("S12-R10"), prd("S12-R7"), prd("S12-R13"),
   tp("Phase 10 sample calculation", "Each needs a named owner (product analytics, not engineering) and a sample calculation checked against a seeded week (S12-E2).")],
  "Rewritten in full: four seeded users, rate computed by hand as one combined share, the average-of-days trap shown with numbers, and the money-field exclusion.")

U(97034, "Weekly use and density spread count each user once",
  [LOCATION, WIDTH, GA_PRE,
   "Four test users at this location with Work Orders view (Settings > Staff): U1, U2, U3, U4. None of them has used Tech View or Board View before.",
   "You can open the Story 12 weekly display usage and density reports in Google Analytics."],
  ["U1: open Work Orders 5 times this week, switch to Board View each time, and set density Compact.",
   "U2: open Work Orders twice, switch to Tech View, and set density Comfortable.",
   "U3: open Work Orders once and stay on List.",
   "U4: open Work Orders once, switch to Tech View, and leave density as it is (Regular).",
   "After the week, open the weekly display usage report and the density report for these users."],
  ["Weekly display usage by distinct users: List 4 (every user opened the page on List first), Tech View 2 (U2, U4), Board View 1 (U1). U1's five visits count as 1 user.",
   "Density spread across users who used Tech View or Board View: Compact 1 (U1), Comfortable 1 (U2), Regular 1 (U4), so 1 ÷ 3 = 33.3% each. No user appears twice and U3 (List only) is not in it.",
   "Check the report's user totals add up: 1 + 1 + 1 = 3 users in the density report."],
  src(["S12"], ["S12-R4", "S12-R11", "S12-R13"], GA_SRC),
  [prd("S12-R4"), prd("S12-R11"), prd("S12-R13")],
  "Rewritten in full: four seeded users with known behaviour, distinct-user counts and a density split computed by hand.")

U(97035, "Analytics event totals for one session match the rules exactly",
  GA_BASE + ["Your saved display is List and your density has never been changed.", GA_FRESH],
  ["Open Work Orders (List).", TECHVIEW, BOARDVIEW, TECHVIEW,
   "In Board View's Fields to display (switch to Board View first), turn on Service advisor, Line count and Created date quickly, one after another.",
   "Pick Compact density.", "Scroll a long column so more cards load.",
   "In DebugView, count each event name for this session."],
  ["work_orders_display_view = 5 (load 1 + Tech View 1 + Board View 1 + Tech View 1 + Board View again in step 5, 1).",
   "work_orders_field_load = 13 + 15 = 28 (Board View and Tech View once each, never again in the session).",
   "work_orders_density_load = 2 (once for each of the two displays).",
   "work_orders_field_toggle = 3 (one per changed field, even when changed quickly together).",
   "work_orders_density_change = 1. Step 7 adds nothing.",
   "Grand total = 5 + 28 + 2 + 3 + 1 = 39 events. Use these counts as the sample for the report check in the field selection rate case."],
  src(["S12"], ["S12-E2", "S12-R1", "S12-R2", "S12-R3", "S12-R8"], GA_SRC + " Tech plan (revised 24 Sep 2026) Phase 10 tests."),
  [prd("S12-E2"), prd("S12-R1"), prd("S12-R2"),
   tp("Phase 10 tests toggles", "three toggles in one debounce give three events and one PUT")],
  "Rewritten in full: one scripted session with the expected count of each event and a grand total worked out.")

# =====================================================================================
# TECH-PLAN FOLDER — section 20449
# =====================================================================================
T = 20449
TP_SRC = "Epic SV-10043; Work Orders Board View & Tech View Display Options Technical Implementation Plan (revised 24 Sep 2026, uploaded 8 Oct 2026)"

U(154648, "Tech View and Board View are unavailable while Imported is selected",
  [SIGNIN_EDIT, LOCATION, WIDTH,
   "At least one Imported work order at this location (Imported work orders come only from Settings > Data Import > Invoices).",
   "At least one ordinary work order (Work Orders > New Work Order)."],
  [OPEN_WO, LISTVIEW, 'Click Status and tick "Imported".',
   "Hover the Tech View and Board View buttons in the display switcher and try to click each.",
   'Click Status > "Clear selection".', TECHVIEW, 'Click Status and look at the "Imported" option. Try to tick it.',
   BOARDVIEW, 'Click Status and try to tick "Imported".'],
  ["Step 4: while Imported is selected, Tech View and Board View cannot be chosen. A tooltip explains why (write down its words). The List keeps showing the Imported work orders.",
   "Step 7: in Tech View the Imported option in Status is disabled and cannot be ticked.",
   "Step 9: in Board View the Imported option is disabled too."],
  TP_SRC + ", section 1.4 (follow-up A3) and section 3.26, Phase 9; answered by Sasha Grosman in the PRD footer comment of 24 Sep 2026. The PRD of 7 Oct does not cover it; the tech plan informs and does not overrule the PRD.",
  [tp("1.4 Imported", "Confirmed + extended: board displays unavailable while Imported is selected, and Imported is disabled as a Status-filter option in Tech View and Board View"),
   tp("3.26 Imported", "Imported is excluded from the board displays (follow-up A3).", "the Imported option in the Status filter is disabled.")],
  "Rewritten in full: Imported is a Status option on the All tab (not a filter view), the steps now reach it, and both views are checked.")

U(154649, "Narrowing the window below 1024 px does not change your chosen display",
  [SIGNIN_EDIT, LOCATION, "A desktop browser you can resize (or a tablet you can turn).",
   "At least one work order at this location."],
  ["Open Work Orders at full width (1024 px or wider).", BOARDVIEW,
   "Narrow the browser window to about 900 px wide.",
   "Look for the display switcher, the density control and the Fields to display picker.",
   "Refresh the page while it is still narrow.",
   "Widen the window back to full width."],
  ["Steps 3 and 4: below 1024 px the page shows the phone List exactly as today, with no display switcher, no density control and no field picker.",
   "Step 5: after the refresh it is still the phone List.",
   "Step 6: back at full width the page opens in Board View again. The narrow visit did not change your saved choice.",
   "At 1024 px and wider, List, Tech View and Board View are all offered."],
  TP_SRC + ", Phase 4 (mobile guard). " + src(["S1"], ["S1-R14"]) + " The tech plan calls this an interim state before phone designs. Since then the PRD (S1-R14) and Review Decisions DR-34 (28 Sep 2026) made the 1024 px switch the final rule.",
  [prd("S1-R14"),
   tp("Phase 4 mobile guard", "Below the desktop breakpoint the existing mobile List always renders; switcher, density control and pickers are hidden; nothing writes `display`, so a phone visit cannot strand a user in a display they cannot see.")],
  "Rewritten: the old quote called the narrow-screen List an interim state. The PRD now fixes 1024 px. The case keeps the tech plan's testable extra (the saved display is not overwritten) and quotes S1-R14.")

U(154650, "Tech View and Board View show only this organization and location",
  ["Two organizations on the build under test: A (your usual test organization) and B. If you have no second organization, sign up a new one on the QA build (e.g. \"ZZAUTOTEST Org B\").",
   'In organization B: add an eligible technician "ZZAUTOTEST OrgB Tech" (Settings > Staff) and a work order for customer "ZZAUTOTEST OrgB Customer" led by that technician.',
   "In organization A: a second location (Settings > Locations) with a work order for customer \"ZZAUTOTEST Loc2 Customer\" led by a technician enrolled only there.",
   SIGNIN_EDIT.replace("Sign in to the build under test", "Sign in to organization A"), WIDTH,
   "Note for the tester: the server-side scoping and the organization check on a technician sent with a reassignment are developer/automated checks. By hand, confirm only that nothing from organization B, or from the other location, is ever shown or offered."],
  ["In organization A, at your usual location, open Work Orders > All.", 'Search "OrgB".', TECHVIEW, BOARDVIEW,
   'Search "Loc2" in both views.',
   'Open any card\'s more-actions > "Reassign lead technician" and search "OrgB Tech", then cancel.'],
  ["Steps 2 to 4: no work order, group or column from organization B appears in either view.",
   "Step 5: the other location's work order and its technician do not appear at this location.",
   "Step 6: the dialog offers no organization B technician."],
  TP_SRC + ", section 1.2 (NFR-006), section 1.4 (tenant check on inbound technician id) and section 9 (security).",
  [tp("NFR-006", "Every new query is scoped by workplace and organization."),
   tp("1.4 tenant check", "Add organization-ownership check (eligibility stays the picker's job per the PRD)")],
  "Rewritten in full: how to get a second organization and location, and a plain split between what a tester checks and what is automated. Marker text kept unchanged.",
  marker=C154650_MARK)

N(T, "Pins for technicians at another location are hidden and free the slots",
  [SIGNIN_EDIT, WIDTH,
   'Two locations in your organization (Settings > Locations), e.g. "Heavy Duty" and "ZZAUTOTEST Loc2".',
   'Three eligible technicians enrolled only at Heavy Duty ("ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo", "ZZAUTOTEST Cal Charlie") and three enrolled only at Loc2 ("ZZAUTOTEST Xia X-ray", "ZZAUTOTEST Yan Yankee", "ZZAUTOTEST Zoe Zulu") (Settings > Staff).'],
  ['In the top bar choose Heavy Duty, open Work Orders > Board View and pin Ana, Ben and Cal (pin button "Pin column" in each header).',
   "Try to pin a fourth technician at Heavy Duty and read the message.",
   "In the top bar choose ZZAUTOTEST Loc2 and open Board View.",
   "Pin Xia, Yan and Zoe.",
   "Choose Heavy Duty again and open Board View."],
  ['Step 2: the pin control is disabled with "You can pin up to 3 technicians."',
   "Step 3: at Loc2 none of the Heavy Duty pins show and no pinned columns appear.",
   "Step 4: all three pins at Loc2 succeed. The Heavy Duty pins did not use up the three slots there.",
   "Step 5: Ana, Ben and Cal are still pinned at Heavy Duty."],
  TP_SRC + ", section 3.13 and section 1.4 (SQ-11); agreed by Sasha Grosman in the PRD footer comment of 24 Sep 2026. " + src(["S3"], ["S3-R8", "S3-R18"]) + " Review Decisions SQ-11 (29 Sep 2026) still lists cross-location pin behaviour as open (PO question raised).",
  [prd("S3-R8"), prd("S3-R18"),
   tp("3.13 pins", "pins for technicians of other locations are hidden and do not consume the 3-pin cap there.")],
  "Tech-plan testable addition (Rule 115 ADD): pins across locations. Not covered by any PRD case.")

N(T, "Unpinning a technician puts them back where they were",
  [SIGNIN_EDIT, LOCATION, WIDTH] + techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo", "ZZAUTOTEST Cal Charlie", "ZZAUTOTEST Dan Delta"') + [
    "No technician is pinned and your technician order is the starting one: Ana, Ben, Cal, Dan."],
  [OPEN_WO, BOARDVIEW, 'Pin Cal (pin button "Pin column" in his header). Read the column order.',
   'Unpin Cal (the same button, now "Unpin column"). Read the column order.', TECHVIEW],
  ["Step 3: Cal moves to the pinned area: Unassigned, Cal, Ana, Ben, Dan.",
   "Step 4: Cal returns to his previous place: Unassigned, Ana, Ben, Cal, Dan.",
   "Step 5: Tech View shows the same order."],
  TP_SRC + ", section 1.4 (SQ-11), confirmed by Sasha Grosman in the PRD footer comment of 24 Sep 2026. " + src(["S3"], ["S3-R19"]) + " Review Decisions SQ-11 (29 Sep 2026) still lists the unpin position as open (PO question raised).",
  [prd("S3-R19"),
   tp("1.4 SQ-11", "Confirmed: unpin returns to the previous slot; pins/order per user, filtered to technicians of the current location")],
  "Tech-plan testable addition: where an unpinned technician returns.")

N(T, "The On Site toggle still saves on an Invoiced work order",
  [SIGNIN_EDIT, LOCATION, WIDTH] + techs('"ZZAUTOTEST Ana Alpha"') + WO_HOW + [
    'Work order "ZZAUTOTEST Inv Co" with lead Ana, then invoiced (Finance > Create Invoice).'],
  [OPEN_WO, SEARCH_ZZ, LISTVIEW,
   "In the Inv Co row, click the On Site toggle to change it.",
   "Refresh the page and read the On Site value.",
   "Open Inv Co and read Lead Technician and Asset on site."],
  ["Step 4: the change is accepted with no error.",
   "Step 5: after the refresh the new On Site value is kept.",
   "Step 6: Lead Technician is still Ana Alpha. The new lock on Invoiced work orders does not block the On Site toggle."],
  TP_SRC + ", section 5 (POST /api/work-orders/change) and Phase 3 browser-walk. " + src(["S4"], ["S4-N2"]),
  [prd("S4-N2"),
   tp("5 change endpoint", "Re-sending the *current* lead stays a no-op so the asset-on-site toggle keeps working on invoiced work orders.")],
  "Tech-plan testable addition: regression guard for the Invoiced lead lock.")

N(T, "Toggling On Site from a stale page does not undo another user's lead change",
  [SIGNIN_EDIT, LOCATION, WIDTH, "A second browser signed in as another dispatcher at the same location."] +
  techs('"ZZAUTOTEST Ana Alpha", "ZZAUTOTEST Ben Bravo"') + WO_HOW + ['Work order "ZZAUTOTEST Site Co" Approved with lead Ana.'],
  ["In browser 1, open Work Orders > All, search \"ZZAUTOTEST\", click List and leave the page open.",
   "In browser 2, open Site Co and change Lead Technician to Ben Bravo on the work order page.",
   "In browser 1, without refreshing, click Site Co's On Site toggle.",
   "In browser 1, refresh and open Site Co. Read Lead Technician."],
  ["Step 4: Lead Technician is Ben Bravo. Browser 1's older page did not put Ana back when it saved On Site, and the On Site change is kept."],
  TP_SRC + ", Phase 3 (asset-on-site toggles stop sending the lead). " + src(["S4"], ["S4-R9"]),
  [prd("S4-R9"),
   tp("Phase 3 asset-on-site", "Stop sending `tech_assigned_id` — today a stale value can silently undo another user's lead change with no audit entry")],
  "Tech-plan testable addition: two-browser check of the stale-toggle fix.")

# ---------- notes ----------
notes += [
 "DESIGN vs SPEC (cases follow the PRD; labels used where a tester clicks): display switcher tooltips \"Table\" / \"By Lead Tech\" / \"Board\" vs PRD List / Tech View / Board View; density \"Row height: Small/Medium/Large\" (Tech View) and \"Card size: Compact/Detailed\" (Board View) vs PRD Density Compact/Regular/Comfortable; no Fields to display picker on Board View in the design; menu \"Reassign Lead Tech\" / \"Assign Tech\" / \"Unassign\" vs PRD \"Reassign lead technician\".",
 "DESIGN vs SPEC (Story 9): the design's drag toast reads \"S1-xxx assigned to {Name}\" / \"… lead technician set to …\" / \"… moved to Unassigned\" with an Undo button; PRD S4-R5 fixes \"Lead technician updated\" / \"Lead technician removed\" and Undo is out (PO comment, Chris Ward 29 Sep). Cases assert the PRD words.",
 "DESIGN vs SPEC (Story 9): the design pin limit is 5 (\"Up to 5 pinned columns — unpin one first\"); PRD is 3 with \"You can pin up to 3 technicians.\" (S3-R8).",
 "DESIGN vs SPEC (Story 9): the design locks Declined (\"Declined · can't be reassigned\") and shows Imported as \"Imported · review before assigning\"; PRD S4-N2 lets Declined move freely and S4-N9 fixes the Imported tooltip. C97009 follows the PRD.",
 "DESIGN vs SPEC (Story 9): in the design's Tech View the Unassigned group has a drag handle (\"Drag to reorder technicians\") and can be dragged; PRD S9-R8 and S2-R2 keep it fixed. C97003 asserts the PRD.",
 "DESIGN vs SPEC (Story 9): in the design a view-only user can still reorder cards within a technician (only cross-technician moves are blocked); PRD S4-N1/S9-N1 require create and edit for every work order drag. New case NEW-C-04 asserts the PRD.",
 "DESIGN vs SPEC (Story 9): the design's starting order inside a group is \"In progress first, then newest created\"; the PRD uses the List default sort (S2-R6), which DR-45 says is customer name A to Z. Cases use customer-name examples.",
 "DESIGN vs SPEC (Story 9): the design puts a work order unassigned from the menu at the end of Unassigned; the 7 Oct PRD (S9-R14) puts it in the initial sort. NEW-C-01 follows the PRD.",
 "DESIGN vs SPEC (data): the design's Reassign dialog shows \"N open\" as all of a technician's work orders (e.g. Kristin \"4 open\" including Paid and Invoiced); PRD S4-R15 counts four statuses. C97032 tells the tester this is a fail if the build copies the design.",
 "DESIGN: position numbers (1, 2, 3) on cards and rows are in the design but engineering left them out (Slavcho Mitrov, 1 Oct, question open). No case relies on them; testers read the order from the cards.",
 "DESIGN: no keyboard or focus behaviour exists in the design (only the ⌘K search shortcut). Story 11 cases say plainly which parts wait on design (SQ-15 / UX-19 open; Slavcho's 28 Sep inline list).",
 "PRD INTERNAL INCONSISTENCY (PO question): Section 9 says Invoiced/Paid \"drag not offered\", but S4-N2 (and DR-37) allow reordering within the current technician. C97009 follows S4-N2.",
 "PO QUESTION: SQ-11 on the Review Decisions page (29 Sep) still lists unpin position and cross-location pin behaviour as open, but Sasha Grosman confirmed both in the PRD footer comment of 24 Sep (\"confirmed\", \"agree\") and the tech plan builds them. NEW-C-13 and NEW-C-14 are authored from the PO comment and say so; please confirm, or retire them.",
 "PO QUESTION: field snapshot timing. PRD S12-R2 says once per display per session; Slavcho's 6 Oct table first said once per display per browser tab. C97024 follows the PRD (session).",
 "PO QUESTION: \"Report density distribution\" (S12-R11) does not say whether a user who changes density during the week counts under their last value or under every value. C97034 uses users whose density does not change; the definition is for the report owner.",
 "PO QUESTION: tech plan 3.19 (layout choices made during a shared-link visit now persist, reversing today's convention) is a user-visible change that the PRD does not mention. Not authored; needs a product yes/no.",
 "EXCLUDED from tech plan with reason: 3.20 first-visit default filter view = Work Orders. Chris Ward's 25 Sep summary says \"The default-tab change is out too\" and DR-33 keeps List's default filter view, so the plan is superseded.",
 "EXCLUDED from tech plan with reason: touch drag rules (Phase 9 and 13, drag never starts for a touch pointer). Slavcho's 28 Sep question about landscape tablets is unanswered in the PRD (DR-34 only says tablets at 1024 px get the views). PO question raised. No case until answered.",
 "EXCLUDED from tech plan (not checkable by hand, performance/architecture): NFR-001 to 005, 007, 010, 012, 013, Phase 12 targets, statement counts, avatar caching, the minimap (built per Slavcho 1 Oct, but not in the PRD).",
 "NAVIGATION ASSUMPTIONS for the build check: whether New Work Order offers a Lead Technician field (NEW-C-02 gives Split as the fallback); the staff \"Time Clock\" toggle is the Clockable setting (Custom Roles notes, SV-8141); Imported work orders come from Settings > Data Import > Invoices; GA DebugView access is a tester prerequisite for the Story 12 and analytics data cases.",
 "HANDS-OFF: Vladimir Tomovic's automated cases C335320 and C335321 (Story 11) assert keyboard behaviour (Tab enters on the Unassigned header, arrow keys move) that no design or PRD defines yet. Reported only, not changed.",
 "S9-R14 CHANGE: C97007 quoted the 29 Sep text (\"… puts the work order at the bottom of Unassigned\"). It now quotes the 7 Oct text. DR-47 on the Review Decisions page (29 Sep) still says bottom; the later PRD wins and the cases disclose this.",
]

# ---------- coverage ----------
cov = {}
for u in updates:
    for a, _ in u["quotes"]: cov.setdefault(a, []).append(f"C{u['case_id']}")
for n in new:
    for a, _ in n["quotes"]: cov.setdefault(a, []).append(n["key"])
want = [a for a in ANCH if a.startswith(("S9-", "S11-", "S12-"))]
missing = [a for a in want if a not in cov]

out = {"updates": updates, "new": new, "retire": retire, "notes": notes,
       "anchors_covered": {k: cov[k] for k in sorted(cov, key=lambda x: (x.startswith("Tech plan"), x))},
       "anchors_uncovered_in_share": missing,
       "reading_coverage": "set by validate step"}
RC = [
 "PRD CONFLUENCE-845185030 (edited 7 Oct) — 59,254 bytes — lines 1-640 — 100% read",
 "Review Decisions CONFLUENCE-853901313 (29 Sep) — 91,532 bytes — lines 1-273 — 100% read",
 "Jira SV-10043-stories-2026-10-08.md — 113,391 bytes — lines 1-773 — 100% read",
 "Tech plan Tech-Plan-Kanban-Tech-View-Display-Options-2026-10-08-upload.md — 115,972 bytes — lines 1-970 — 100% read",
 "PRD page comments, live via Atlassian MCP 8 Oct: footer 5 threads + 13 replies, inline 26 threads + replies — 100% read",
 "Design Work Orders.dc.html — 105,853 bytes — lines 1-1411 — 100% read; variant 'Work Orders -no page-fix-.dc.html' — diffed in full (style-only differences plus the pinned-column drag title)",
 "Design wo-details/Add Part.html — 304,402 bytes — all visible text extracted and read (scripts/styles stripped); screenshots/ (21 images) and uploads/ (10 screenshots) viewed as contact sheets; uploads avatar photos (aaron, danny, jackie, mia) noted by name only; support.js, lucide-icons.js, _ds bundle = library code, not read (named)",
 "Design crawl design-crawl/{list,tech,board}: states.jsonl 9+27+36 states (crawl finished, DONE=ALLDONE), actions.jsonl 473+443+401 — all text read through a deduplicated digest (every distinct line and every action that showed something); 112 crawl screenshots not opened one by one (their text is in states.jsonl)",
 "Design drive design-drive/work-orders: pages.txt 224 lines read; interactions.jsonl 3.5 MB — all 218 distinct exposed texts read via script; summary.json read",
 "Snapshots of my 32 cases — read in full (plain text dump 66 KB); Vladimir's C236977-C236981, C335320, C335321 read for facts",
 "Rules 113-123 (RULES-61-96.md lines 2391-2837), IDEAL-TEST-CASE-STANDARD.md, C154586-after.json, WORKER-BRIEF.md, SOURCE-CHECK, V33-RECHECK, RULE117 notes, PROJECT-STATE — 100% read",
]
out["reading_coverage"] = " | ".join(RC)
json.dump(out, open(OUT, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("written", OUT, "updates", len(updates), "new", len(new), "retire", len(retire), "missing", missing)

# ---------- validation (brief's checks) ----------
def validate(path=OUT):
    d = json.load(open(path, encoding="utf-8"))
    errs = []
    cases = [("C%d" % u["case_id"], u) for u in d["updates"]] + [(n["key"], n) for n in d["new"]]
    bad_pat = [re.compile(r"Rule 1"), re.compile(r"\bS\d+-[RNE]\d+[a-z]?\b"), re.compile("seed the exact", re.I),
               re.compile("display options are on", re.I), re.compile("ask the QA lead", re.I)]
    for cid, c in cases:
        t = c["title"]
        if len(t) > 80: errs.append(f"{cid} title {len(t)} chars")
        if ";" in t: errs.append(f"{cid} title has semicolon")
        tester = [t] + c["preconds"] + c["steps"] + c["results"]
        for line in tester:
            for p in bad_pat:
                if p.search(line): errs.append(f"{cid} tester text matches {p.pattern!r}: {line[:90]}")
        for a, q in c["quotes"]:
            hay = TP_N if a.startswith("Tech plan ") else PRD_N
            if ws(q) not in hay: errs.append(f"{cid} quote {a} not found verbatim")
        all_text = json.dumps(c, ensure_ascii=False)
        if all_text.count("AUTOMATION:") != 1: errs.append(f"{cid} has {all_text.count('AUTOMATION:')} AUTOMATION markers")
        want = C154650_MARK if cid == "C154650" else MARK
        if c["marker"] != want: errs.append(f"{cid} marker text differs")
        if not c["preconds"] or not c["steps"] or not c["results"] or not c["quotes"]: errs.append(f"{cid} empty part")
        if any(("<" in x and ">" in x and re.search(r"</?[a-z]+[^>]*>", x)) for x in tester): errs.append(f"{cid} HTML in text")
    ids = sorted(u["case_id"] for u in d["updates"])
    expect = sorted([97001,97002,97003,97004,97005,97006,97007,97008,97009,97010,97011,97012,97013,97020,97021,97022,
                     97023,97024,97025,97026,97027,97028,97029,97030,97031,97032,97033,97034,97035,154648,154649,154650])
    if ids != expect: errs.append(f"update ids mismatch: {set(expect) ^ set(ids)}")
    want_anch = [a for a in ANCH if a.startswith(("S9-", "S11-", "S12-"))]
    miss = [a for a in want_anch if a not in d["anchors_covered"]]
    if miss: errs.append(f"uncovered anchors: {miss}")
    return errs, len(d["updates"]), len(d["new"]), len(d["retire"]), len(want_anch)

if __name__ == "__main__":
    e, nu, nn, nr, na = validate()
    print(f"VALIDATE: updates {nu}, new {nn}, retire {nr}, share anchors {na}, errors {len(e)}")
    for x in e: print("  ERR", x)
    sys.exit(1 if e else 0)
