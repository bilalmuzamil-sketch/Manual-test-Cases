#!/usr/bin/env python3
"""Builds proposals-v52.json for the WO Board & Tech View PRD v49 -> v52 behaviour update (14 Oct 2026, night).
11 of our cases rewritten in full to the Rule 117 layout (eighth amendment) + 4 new Technician-filter cases (section 13236).
Plan: ../BEHAVIOUR-CHANGES-PLAN.md. Live text read from ../snapshots-before/live-cases.json (affected-11-live.txt).
Quotes are pulled from the anchor map built from PRD v52 by apply_wo.py --anchors, so they are verbatim by construction;
the few non-anchor quotes (Feature Overview, Key Decisions, Out of Scope, Story 7 note, tech plan) are checked verbatim by
apply_wo.py's check."""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
A = json.load(open(f"{H}/anchor-quotes-current.json"))
def q(code): return [code, A[code]]

PRD = 'PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 52 (14 Oct 2026, Chris Ward)'
READ = "read 14 Oct 2026"
SV = "Source-verified 14 October 2026."
OLD_BUILD = "Last checked against build v26.40.8-7a95011 on 10/8/2026."
NOT_YET = ("This version of the case has not yet been checked against a build (the previous version was last checked against "
           "build v26.40.8-7a95011 on 10/8/2026).")
V51 = ("rewritten in version 51 on 14 Oct 2026 (Chris Ward ruling after Sasha Grosman's staging review: Tech View's default "
       "columns are the design's 13, and Assigned Techs is on by default)")
HOLD = "AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build"
READY = "AUTOMATION: READY"

FO_1 = ("The existing filter views (the tabs on the left — All, Work Orders, Estimates, Completed) and the filter bar (search, "
        "status, assigned to me, and so on) apply the same way in every display option.")
FO_EXC = ("Imported work orders are one exception: they open in List only (S1-R13a, S1-R13b). The Technician filter is the other: "
          "Tech View and Board View offer it and List does not (S1-R15).")
KD_PERM = "Permissions. Work Orders view permits viewing all four filter tabs and reordering technician groups/columns."
OOS_DEPT = ("A Department filter. The design shows one, but a work order’s department is not shown or editable on any work order "
            "screen today, so users could not see why a work order matches. Revisit once the work order shows its department.")
OOS_CHIPS = "The Customer and Service Advisor filter chips production retired in the redesign (SV-8785) are not brought back."
S7_NOTE = "this feature counts technicians scheduled on a line as that line’s technicians (S7-R1)."
TP_LIST = ("Default List columns = every non-required column except `invoicedDate`, `daysOpen`, `partRequestsCount`, "
           "`partReturnRequestsCount`, `unreceivedPartRequestsCount`.")
TV13 = ("Status, Waiting On Parts, Number, Customer, Unit, Asset, Progress, Service Advisor, Clocked In, Lines, Assigned Techs, "
        "Created on, Total price")

# ---------- shared precondition sentences ----------
def signed(extra=""):
    return ("You are signed in as an Owner or Admin user whose role has Work orders > View and Work orders > Create & Edit"
            + extra + ", at {Location-A} (for example Staging Heavy Duty - 9919).")
WIDTH = ("Your browser window is at least 1024 px wide, so the display switcher (List, Tech View, Board View) shows at the right "
         "of the Work Orders toolbar.")
def tech(ph, ex, service=False, extra=""):
    return (f"Technician {{{ph}}} (for example {ex}) is an active staff member at {{Location-A}} with Time Clock on"
            + (", the Service department" if service else "") + " and a Role other than Office User or Time Clock User" + extra + ".")
NOFILTER = "On the Work Orders page nothing is chosen in any filter, Assigned to me is off and Search is empty."

# ---------- shared Part 1 (manual setup) sentences ----------
P_SIGN = ("Sign in as an Owner or Admin user. On a QA site click the Admin quick-login button on the sign-in page; you appear as "
          "\"Admin ShopView\". To check the permissions: your initials (top right) > Settings > Roles & Permissions > Admin > "
          "Work orders: View and Create & Edit are on.")
P_SIGN_SCHED = P_SIGN + " Your role also needs Schedule access (Settings > Roles & Permissions > Admin > Schedule: View and Create & Edit)."
P_LOC = ("Pick one location for the whole case; it is shown in the top bar next to the bell (to change it: your initials > "
         "Change Location). This is {Location-A} (for example Staging Heavy Duty - 9919). Create everything below at {Location-A}.")
P_WIDTH = "Use a desktop browser window at least 1024 px wide (narrower windows show only the List, with no display switcher)."
def p_tech(ph, ex, service=False):
    dep = ("Departments Service (only Service technicians get a row on the Schedule)" if service
           else "at least one Department (required)")
    reuse = "the Service department, " if service else ""
    return (f"Your initials > Settings > Staff. Reuse a staff member only if they are active, have Time Clock on, {reuse}{{Location-A}} "
            "in Location and a Role other than Office User or Time Clock User. Otherwise click New Staff Member and enter First Name "
            f"and Last Name (for example {ex}), an Email, Role Technician, {dep}, Location {{Location-A}}, turn Time Clock on, then "
            f"Save & Close. This is {{{ph}}}.")
def p_cust(ph, ex, unit="TRK-118"):
    return (f"Top menu Customers > New Customer > Name (for example \"{ex}\") > Save. This is {{{ph}}}; use it for this case only. "
            "On the customer page click Contacts > New Contact > First Name and Last Name (for example ZZAUTOTEST Contact) > Save. "
            "Then Assets > New Asset > pick the contact, Year (for example 2022), Make (type \"Freight\" and pick Freightliner), "
            f"Model (for example M2), Unit (for example {unit}) > Save. Contact and Make are required.")
LINES_EX = ["\"Service - Full grease service\"", "\"Service - Adjust clutch\"", "\"Replace - Brake pot\"",
            "a second \"Service - Full grease service\"", "a second \"Service - Adjust clutch\""]
def p_wo(ph, cust, num, lines=1, approved=True):
    words = ["grease", "clutch", "brake pot", "grease", "clutch"]
    s = (f"Work Orders > Create Work Order > in the New Work Order window pick {{{cust}}} and its asset > Save (if a Confirmation "
         "about the credit limit appears, click Create). The work order opens on its Lines tab with the New Line form.")
    for i in range(lines):
        last = i == lines - 1
        s += (f" In What Are You Doing? type \"{words[i]}\" and pick the ready-made line {LINES_EX[i].replace('a second ', '')}"
              + (", turn Line Approved on" if approved else "")
              + (" and click Save & Close." if last else " and click Save & Add Line."))
    s += (" The status reads Approved." if approved else "")
    s += f" Write down the number shown at the top left (for example {num}). This is {{{ph}}}."
    return s
def p_lead(wo, t):
    return (f"On {{{wo}}}'s page pick {{{t}}} in the Lead Technician dropdown; it saves at once (the dropdown shows once the work "
            "order is Approved).")
def p_linetech(wo, line, t):
    return (f"On {{{wo}}}'s Lines tab open {{{line}}} (Edit Line) > Technicians > pick {{{t}}} > save the line.")
def p_newuser(ph, ex, role="Admin"):
    return (f"Your initials > Settings > Staff > New Staff Member: First Name and Last Name (for example {ex}), an Email you can "
            f"open, Role {role}, at least one Department (required), Location {{Location-A}} > Save & Close. Accept the invitation "
            f"from that email and set a password. This is {{{ph}}}. Do not open or change any Work Orders columns as {{{ph}}} before the test.")
P_FILTERS_CLEAR = ("Work Orders > All: open each filter in the filter bar and clear any selection (Clear selection), turn Assigned "
                   "to me off and empty Search.")
P2_EVID = "Evidence: a screenshot after each step that has an expected result, the build marker, and the real value of every brace name."
P2_PREF = ("List's saved state (columns, filters, tab, sort) is the user preference GET/PUT /api/users/me/preferences/work-orders-list "
           "(playbook, Work Orders filters section); filter state persists on the server across browser contexts. The preference "
           "keys for Tech View's columns and Board View's fields are UNVERIFIED: record them from the network requests when you "
           "change a column.")

upd, new = [], []

# ===================== C96927 =====================
upd.append({
 "case_id": 96927,
 "title": "Tech View offers List's columns plus Assigned Techs in its own Columns menu",
 "preconditions": [
  signed(), WIDTH,
  tech("Technician-A", "Esther Howard"),
  "Approved work order {Work-order-1} (for example S10043-17601) for customer {Customer-A} (for example \"ZZAUTOTEST F2 Tech Columns\") is led by {Technician-A} and has one approved line, {Line-1} (for example \"Service - Full grease service\").",
  "In Tech View's Column Selection, Assigned Techs is on, and On Site, VIN/Serial # and Lead Technician are off, as they start for a new user.",
 ],
 "steps": [
  "Open Work Orders and click the All tab.",
  "Type the name of {Customer-A} in Search.",
  "Click List in the display switcher at the right of the toolbar.",
  "Click the Column Selection button (tooltip \"Column Selection\") and write down every column name in the menu.",
  "Close the menu.",
  "Click Tech View in the display switcher (tooltip \"Tech View\").",
  "Click the Column Selection button and write down every column name in the menu, and which ones are on.",
  "Turn On Site on.",
  "Turn VIN/Serial # on.",
  "Turn Lead Technician on.",
  "Close the menu and read the Tech View column headers.",
  "Click the Column Selection button.",
  "Turn Assigned Techs off.",
  "Close the menu and read the Tech View column headers.",
  "Click the Column Selection button, turn Assigned Techs on and close the menu.",
  "Read the Tech View column headers.",
 ],
 "results": [
  "Step 4: List's menu does not offer Assigned Techs.",
  "Steps 6 and 7: Tech View has its own Column Selection button, which opens Tech View's own column menu.",
  "Step 7: every column offered in List's menu is also offered in Tech View's menu, and Tech View's menu also offers Assigned Techs, which is on.",
  "Step 11: On Site, VIN/Serial # and Lead Technician each show as a column in the Tech View table.",
  "Step 14: the Assigned Techs column no longer shows in Tech View.",
  "Step 16: the Assigned Techs column shows in Tech View again.",
 ],
 "source": f"Epic SV-10043; stories SV-10045 (Story 2, Tech View — table grouped by lead technician), SV-10048 (Story 5, Fields to display and columns) and SV-10050 (Story 7, Show line technicians on cards and rows); {PRD}, S2-R4, S5-R4 and S7-R7 (S5-R4 and S7-R7 {V51}), {READ}. The earlier note that the design's Tech View menu leaves out some List columns is removed: version 51 keeps every List column available in Tech View, with On Site, VIN/Serial # and Lead Technician off by default. {SV} {NOT_YET}",
 "quotes": [q("S2-R4"), q("S5-R4"), q("S7-R7")],
 "marker": HOLD,
 "doc_part1": [
  P_SIGN, P_LOC, P_WIDTH,
  p_tech("Technician-A", "Esther Howard"),
  p_cust("Customer-A", "ZZAUTOTEST F2 Tech Columns"),
  p_wo("Work-order-1", "Customer-A", "S10043-17601") + " Its line is {Line-1}.",
  p_lead("Work-order-1", "Technician-A"),
  "Work Orders > All > click Tech View in the display switcher > Column Selection: turn Assigned Techs on and turn On Site, VIN/Serial # and Lead Technician off. Close the menu.",
  "Check the setup worked: Work Orders > All > Search the name of {Customer-A}: {Work-order-1} shows with Lead Technician {Technician-A}. In Tech View the Assigned Techs column shows and On Site, VIN/Serial # and Lead Technician do not.",
 ],
 "doc_part2": [
  "Goal: one Approved work order {Work-order-1} led by {Technician-A}, then compare List's and Tech View's column menus and turn columns on and off in Tech View.",
  "Create {Customer-A}, {Work-order-1} and the lead on screen as in Part 1 and record {Work-order-1}.",
  "Read both column menus with Playwright as exact strings (the List column selector has data-test-id button_column_selection; the Tech View one is UNVERIFIED: record its selector). Compare the two lists as sets: Tech View's must be List's plus Assigned Techs.",
  P2_PREF,
  "Cleanup: after the case, turn On Site, VIN/Serial # and Lead Technician off again in Tech View and leave Assigned Techs on, so the user is back at the new-user starting columns for the next case.",
  P2_EVID,
 ],
 "change_summary": "Rewritten in full to the 8 Oct layout. v52 (S5-R4/S7-R7 rewritten in v51): Assigned Techs is on by default and can be turned off and on; On Site, VIN/Serial # and Lead Technician are offered and each shows as a column when turned on. The old 'if the build matches the design it is a fail' note is removed. Steps one action per line; placeholders; setup moved to the doc.",
})

# ===================== C96979 =====================
upd.append({
 "case_id": 96979,
 "title": "A new user's Tech View opens on the design's 13 columns",
 "preconditions": [
  signed() + " You are {User-A}.", WIDTH,
  "Brand-new staff user {User-B} (for example Nora New) has the Admin role at {Location-A}, has never changed any Work Orders columns, and is signed in in a second browser.",
  "Custom role {Role-A} (for example \"ZZAUTOTEST F2 No Financial\") has Work Orders view on and See Financial Data off.",
  "Brand-new staff user {User-C} (for example Nate Nofinance) has role {Role-A} at {Location-A}, has never changed any Work Orders columns, and is signed in in a third browser (or a private window).",
  "Approved work order {Work-order-1} (for example S10043-17602) for customer {Customer-A} (for example \"ZZAUTOTEST F2 Tech Default Columns\") has one approved line, {Line-1} (for example \"Service - Full grease service\"), and no lead technician.",
  "Your own List columns may be anything at the start; the steps set them.",
 ],
 "steps": [
  "In {User-B}'s browser, open Work Orders and click the All tab.",
  "Click List in the display switcher.",
  "Write down every column shown in List, left to right.",
  "Click Tech View in the display switcher.",
  "Write down every column shown in Tech View, left to right.",
  "Click the Column Selection button and read which columns are on and which are off.",
  "Close the menu.",
  "In {User-C}'s browser, open Work Orders, click the All tab and click Tech View in the display switcher.",
  "Write down every column shown in Tech View, left to right.",
  "In your own browser, open Work Orders, click the All tab and click List in the display switcher.",
  "Click the Column Selection button.",
  "Turn Service Advisor off.",
  "Turn Created on on.",
  "Close the menu and reload the page.",
  "Click Tech View in the display switcher.",
  "Click the Column Selection button, turn one column off (for example Unit) and close the menu.",
  "Click List in the display switcher.",
  "Reload the page and read List's columns.",
 ],
 "results": [
  "Step 3: {User-B}'s List shows List's own default columns, unchanged by this feature (the same columns a new user's List shows on production), and it has no Assigned Techs column.",
  f"Step 5: {{User-B}}'s Tech View shows exactly 13 columns, in this order: {TV13}. On Site, VIN/Serial # and Lead Technician are not shown.",
  "Step 6: in Tech View's menu Assigned Techs is on, and On Site, VIN/Serial # and Lead Technician are offered but off.",
  "Step 9: {User-C}'s Tech View shows the same columns in the same order without Total price: 12 columns, ending with Lines, Assigned Techs, Created on.",
  "Steps 14 and 18: your List keeps Service Advisor off and Created on on after the reload, after switching to Tech View and back, and after the second reload. List choices saved before this release cannot be recreated by hand: write \"pre-release List choice not checked\" in the result comment unless you have such a user.",
 ],
 "source": f"Epic SV-10043; stories SV-10048 (Story 5, Fields to display (Board View) and columns (Tech View)) and SV-10050 (Story 7, Show line technicians on cards and rows); {PRD}, S5-R4 and S7-R7 ({V51}; before, Tech View started with the production List default columns), S5-R12, S5-E2 and S7-R1, {READ}. Technical Implementation Plan (revised 24 Sep 2026, uploaded 8 Oct 2026), section 3.9, item 9 (production default List columns), read 14 Oct 2026. {SV} {NOT_YET}",
 "quotes": [q("S5-R4"), q("S7-R7"), q("S5-E2"), q("S7-R1"), ["Tech plan 3.9 (default List columns)", TP_LIST], q("S5-R12")],
 "marker": HOLD,
 "doc_part1": [
  P_SIGN + " This is {User-A}.", P_LOC, P_WIDTH,
  p_newuser("User-B", "Nora New") + " Sign in as {User-B} in a second browser.",
  "Your initials > Settings > Roles & Permissions > Create Custom Role (for example \"ZZAUTOTEST F2 No Financial\") > turn on Work Orders view, leave See Financial Data off > Save. This is {Role-A}.",
  p_newuser("User-C", "Nate Nofinance", "{Role-A}") + " Sign in as {User-C} in a third browser or a private window.",
  p_cust("Customer-A", "ZZAUTOTEST F2 Tech Default Columns"),
  p_wo("Work-order-1", "Customer-A", "S10043-17602") + " Its line is {Line-1}. Leave Lead Technician empty.",
  "Check the setup worked: {User-B} and {User-C} can each sign in and open Work Orders, and neither has changed any column. Work Orders > All > Search the name of {Customer-A} shows {Work-order-1}, Approved, with no lead. If {User-B} or {User-C} already existed and changed columns, create a fresh user instead.",
 ],
 "doc_part2": [
  "Goal: two brand-new users (one with financial access, one without) who have never saved Tech View columns, then read their Tech View columns, then change and reload your own List columns.",
  "A new user needs a real invitation email to set a password. If no mailbox is available, ask the QA lead for a test mailbox; never reuse a user who has changed columns, because the case reads the starting columns.",
  "Read the column headers in order with Playwright as exact strings and compare them with: " + TV13 + " (Total price only for {User-B}).",
  P2_PREF,
  "UNVERIFIED: the build checked on 8 Oct (v26.40.8-7a95011) started Tech View on the List defaults with Assigned Techs off; PRD version 51/52 changed that. A build that still does that fails this case.",
  P2_EVID,
 ],
 "change_summary": "Retitled and rewritten in full to the 8 Oct layout. v52 (S5-R4/S7-R7, rewritten in v51): a new user's Tech View shows the design's 13 columns in order with Assigned Techs on and On Site, VIN/Serial #, Lead Technician off; a new user without See Financial Data sees the same 12 without Total price (new user {User-C}, custom role {Role-A}); List keeps its own defaults and saved List choices stay. Was: Tech View = List defaults, Assigned Techs off.",
})

# ===================== C96983 =====================
upd.append({
 "case_id": 96983,
 "title": "If saved field choices can't load, the defaults show and the next change saves",
 "preconditions": [
  signed(), WIDTH,
  "Approved work order {Work-order-1} (for example S10043-17603) for customer {Customer-A} (for example \"ZZAUTOTEST F2 Saved Choice Failure\") has one approved line, {Line-1} (for example \"Service - Full grease service\"), and no lead technician, so it shows in Unassigned.",
  "Created date is off in Board View's Fields to display.",
  "For steps 6 to 11 a developer has made your saved field and column choices fail to load on this test site; this cannot be caused from the product. If that has not been done, run steps 1 to 5 only and write \"load failure not checked by hand\" in the result comment.",
 ],
 "steps": [
  "Open Work Orders, click the All tab and click Board View in the display switcher.",
  "Click Fields to display and write down the fields that are on.",
  "Turn Created date on.",
  "Reload the page.",
  "Click Fields to display and read whether Created date is on.",
  "With the load failure in place, reload the page.",
  "Click Fields to display and write down the fields that are on.",
  "Click Tech View in the display switcher and write down the columns shown, left to right.",
  "Click Board View in the display switcher, click Fields to display and turn Created date on.",
  "When the developer has removed the load failure, reload the page.",
  "Click Fields to display and read whether Created date is on.",
 ],
 "results": [
  "Steps 4 and 5: Created date is still on after the reload (a normal save).",
  "Steps 6 and 7: Board View shows its default fields: lead technician name, work order number, customer, unit number, asset, progress, total price and status.",
  f"Step 8: Tech View shows its starting columns, in this order: {TV13}.",
  "Steps 10 and 11: the field choice made after the failure (Created date on) was saved and is still on after the reload.",
 ],
 "source": f"Epic SV-10043; story SV-10048 (Story 5, Fields to display (Board View) and columns (Tech View)); {PRD}, S5-N2, S5-N3, S5-R13 and S5-R4 (S5-R4 {V51}; Tech View's starting columns were the List defaults before), {READ}. Technical Implementation Plan Phase 4 (after a failed preference load the next save re-reads and merges). {SV} {NOT_YET}",
 "quotes": [q("S5-N2"), q("S5-R13"), q("S5-R4"), q("S5-N3")],
 "marker": HOLD,
 "doc_part1": [
  P_SIGN, P_LOC, P_WIDTH,
  p_cust("Customer-A", "ZZAUTOTEST F2 Saved Choice Failure"),
  p_wo("Work-order-1", "Customer-A", "S10043-17603") + " Its line is {Line-1}. Leave Lead Technician empty.",
  "Work Orders > All > Board View > Fields to display: turn Created date off if it is on.",
  "Ask a developer whether they can make your saved field and column choices fail to load on this test site for steps 6 to 11, and to tell you when the failure is removed. If not, the case runs steps 1 to 5 only.",
  "Check the setup worked: Work Orders > All > Search the name of {Customer-A} shows {Work-order-1}, Approved, with no lead; Board View > Fields to display shows Created date off.",
 ],
 "doc_part2": [
  "Goal: one unassigned Approved work order, Created date off in Board View, then a normal save, then (only where a developer can force it) a preference-load failure.",
  "A Claude session can simulate the load failure in its own browser only, by making the preference request fail with Playwright route interception (page.route on the Board View / Tech View preference request, answer 500). This tests the screen's handling, not the server. Record that it was simulated, and which request was intercepted (the preference keys are UNVERIFIED). A manual tester cannot do this.",
  P2_PREF,
  "Read Board View's Fields to display and Tech View's headers as exact strings after the failed load and compare them with the expected lists.",
  P2_EVID,
 ],
 "change_summary": "Rewritten in full to the 8 Oct layout. v52 (S5-R4 rewritten in v51): after a failed load Tech View shows its starting columns = the design's 13 in order (was: the List defaults). The forced-failure condition moved to the preconditions; steps one action per line; S5-R13 quoted for Board View's defaults.",
})

# ===================== C96975 =====================
upd.append({
 "case_id": 96975,
 "title": "Tech View keeps its own column choice, separate from List, for each user",
 "preconditions": [
  signed(), WIDTH,
  "You can also work at a second location, {Location-B} (for example Staging Lethbridge - 4310): it is listed under your initials > Change Location.",
  tech("Technician-A", "Esther Howard"),
  "Approved work order {Work-order-1} (for example S10043-17604) for customer {Customer-A} (for example \"ZZAUTOTEST F2 Tech Own Columns\") at {Location-A} is led by {Technician-A} and has one approved line, {Line-1} (for example \"Service - Full grease service\").",
  "In List's Column Selection, Service Advisor and Progress are on.",
  "In Tech View's Column Selection, Service Advisor, Progress and Assigned Techs are on.",
  "A second browser or computer is available.",
 ],
 "steps": [
  "Open Work Orders and click the All tab.",
  "Click List in the display switcher.",
  "Click the Column Selection button and write down which columns are on.",
  "Close the menu.",
  "Click Tech View in the display switcher.",
  "Click the Column Selection button.",
  "Turn Service Advisor off.",
  "Turn Assigned Techs off.",
  "Close the menu.",
  "Click List in the display switcher.",
  "Read whether Service Advisor and Assigned Techs show in List.",
  "Click the Column Selection button.",
  "Turn Progress off and close the menu.",
  "Click Tech View in the display switcher.",
  "Read whether Progress shows in Tech View.",
  "Log out.",
  "Log back in as the same user, open Work Orders and click Tech View.",
  "Read Tech View's columns, then click List and read List's columns.",
  "In the second browser, sign in as the same user, open Work Orders and click Tech View.",
  "Read Tech View's columns, then click List and read List's columns.",
  "Switch to {Location-B} (your initials > Change Location).",
  "Open Work Orders and click Tech View.",
  "Read Tech View's columns, then click List and read List's columns.",
 ],
 "results": [
  "Step 11: List still shows Service Advisor, and List has no Assigned Techs column: Tech View's choice did not touch List.",
  "Step 15: Tech View still shows Progress: List's choice did not touch Tech View.",
  "Steps 18, 20 and 23: Tech View shows neither Service Advisor nor Assigned Techs and still shows Progress, after logging back in, in the second browser and at {Location-B}.",
  "Steps 18, 20 and 23: List keeps its own columns: Service Advisor on and Progress off.",
 ],
 "source": f"Epic SV-10043; stories SV-10048 (Story 5, Fields to display (Board View) and columns (Tech View)) and SV-10050 (Story 7); {PRD}, S5-R1, S5-R8 and S7-R7 (S7-R7 {V51}, so this case now turns Assigned Techs off, a choice different from the default), {READ}. Review Decisions DR-33 (Tech View's column selection separate from List both ways). {SV} {NOT_YET}",
 "quotes": [q("S5-R1"), q("S5-R8"), q("S7-R7")],
 "marker": HOLD,
 "doc_part1": [
  P_SIGN, P_LOC, P_WIDTH,
  "Your initials > Change Location: a second location must be listed, {Location-B} (for example Staging Lethbridge - 4310). If none is, add it to your own staff record (Settings > Staff > your own row's edit icon > Location).",
  p_tech("Technician-A", "Esther Howard"),
  p_cust("Customer-A", "ZZAUTOTEST F2 Tech Own Columns"),
  p_wo("Work-order-1", "Customer-A", "S10043-17604") + " Its line is {Line-1}.",
  p_lead("Work-order-1", "Technician-A"),
  "Work Orders > All > List > Column Selection: turn Service Advisor and Progress on. Then Tech View > Column Selection: turn Service Advisor, Progress and Assigned Techs on.",
  "Check the setup worked: Work Orders > All > Search the name of {Customer-A} shows {Work-order-1}, Approved, led by {Technician-A}; List shows Service Advisor and Progress; Tech View shows Service Advisor, Progress and Assigned Techs; your initials > Change Location lists {Location-B}.",
 ],
 "doc_part2": [
  "Goal: List and Tech View column choices set to a known start, then one change in each display, then re-read after re-login, in a second browser context and at {Location-B}.",
  "A second Playwright browser context counts as the second browser. Sign in there with the same login; quick login signs out other sessions on the same login, so on a QA site use the case's own login path and confirm the first context is still signed in (if it was signed out, record it and sign in again).",
  P2_PREF,
  "Cleanup: turn Service Advisor and Assigned Techs back on in Tech View and Progress back on in List, so the shared user is back where it started.",
  P2_EVID,
 ],
 "change_summary": "Rewritten in full to the 8 Oct layout. v52 (S7-R7 rewritten in v51): Assigned Techs is on by default, so the Tech View change is now Service Advisor off AND Assigned Techs off, and Tech View keeps both off after re-login, in the second browser and at the second location; List unaffected. Starting columns now stated in the preconditions; steps one action per line; {Location-B} replaces [Loc-2].",
})

# ===================== C96993–C96996 (Automated, expectations unchanged) =====================
ENSURE = "Click the Column Selection button and make sure Assigned Techs is on (it is on by default; turn it on if it was turned off), then close the menu."
def s7_source(codes, extra=""):
    return (f"Epic SV-10043; story SV-10050 (Story 7, Show line technicians on cards and rows); {PRD}, {codes} and S7-R7 (S7-R7 {V51}; "
            "the Tech View step now only makes sure Assigned Techs is on, the expected results are unchanged), " + READ + "." + extra
            + f" {SV} {OLD_BUILD}")
upd.append({
 "case_id": 96993,
 "title": "Cards and Tech View's Assigned Techs show the lead and line technicians",
 "preconditions": [
  signed(" and Schedule access"), WIDTH,
  tech("Technician-A", "Esther Howard"),
  tech("Technician-B", "Ralph Edwards"),
  tech("Technician-C", "Dana Ortiz"),
  tech("Technician-D", "Jenny Wilson", service=True, extra=", so they have a row on the Schedule"),
  "Approved work order {Work-order-1} (for example S10043-17605) for customer {Customer-A} (for example \"ZZAUTOTEST F3 Avatar Group\") is led by {Technician-A} and has three approved lines: {Line-1} (for example \"Service - Full grease service\") given to {Technician-B}, {Line-2} (for example \"Service - Adjust clutch\") given to {Technician-C}, and {Line-3} (for example \"Replace - Brake pot\") with no labor technician.",
  "{Technician-D} has a Schedule shift on {Line-3} of {Work-order-1} tomorrow 8:00–10:00, so four different people are on {Work-order-1}: one lead, two line technicians and one scheduled technician.",
 ],
 "steps": [
  "Open Work Orders, click the All tab and click Board View in the display switcher (tooltip \"Board View\").",
  "Type the name of {Customer-A} in Search.",
  "Click Fields to display, turn line technicians on and close the menu.",
  "Read the avatar group on the {Work-order-1} card.",
  "Hover each avatar and read the name shown.",
  "Click Tech View in the display switcher.",
  ENSURE,
  "Read the avatar group in {Work-order-1}'s Assigned Techs cell.",
  "Click List in the display switcher.",
  "Click the Column Selection button and read the column names.",
 ],
 "results": [
  "Steps 4 and 5: the card shows a compact avatar group of 4: {Technician-A} (the lead) plus {Technician-B}, {Technician-C} and {Technician-D}. {Technician-D} counts as {Line-3}'s technician because of the Schedule shift.",
  "Step 8: Tech View's Assigned Techs column shows the same 4-avatar group.",
  "Step 10: List's menu does not offer an Assigned Techs column.",
 ],
 "source": s7_source("S7-R1 and the Story 7 context note (scheduled technicians count as the line's technicians)",
                     " Review Decisions DR-33. Design export of 8 Oct 2026 (Claude Design project 787fef1a, Work Orders.dc.html): List's Columns shows an \"Assigned Tech\" column; the PRD (no column in List) is followed."),
 "quotes": [q("S7-R1"), ["Story 7 context note", S7_NOTE], q("S7-R7")],
 "marker": READY,
 "doc_part1": [
  P_SIGN_SCHED, P_LOC, P_WIDTH,
  p_tech("Technician-A", "Esther Howard"), p_tech("Technician-B", "Ralph Edwards"), p_tech("Technician-C", "Dana Ortiz"),
  p_tech("Technician-D", "Jenny Wilson", service=True),
  p_cust("Customer-A", "ZZAUTOTEST F3 Avatar Group"),
  p_wo("Work-order-1", "Customer-A", "S10043-17605", lines=3) + " Its lines are {Line-1}, {Line-2} and {Line-3}, in that order.",
  p_lead("Work-order-1", "Technician-A"),
  p_linetech("Work-order-1", "Line-1", "Technician-B") + " " + p_linetech("Work-order-1", "Line-2", "Technician-C") + " Leave {Line-3} with no labor technician.",
  "Schedule > go to tomorrow > drag {Work-order-1} from the work order list onto {Technician-D}'s row at 8:00 > in the picker choose Choose lines and tick {Line-3} > set the end time to 10:00 > save.",
  "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A}: exactly {Work-order-1} shows, Approved, Lead Technician {Technician-A}. On its Lines tab {Line-1} shows {Technician-B}, {Line-2} shows {Technician-C} and {Line-3} no labor technician. On the Schedule {Technician-D}'s shift on {Work-order-1} is there tomorrow 8:00–10:00.",
 ],
 "doc_part2": [
  "Goal: one work order with four different people on it (lead, two line technicians, one scheduled technician), then read the avatar group in Board View and Tech View.",
  "Faster route for the shift, UNVERIFIED on the Work Orders QA site (proven only on the Schedule QA site sv8685): POST /api/schedule/shifts with workOrderId, lineIds [{Line-3 id}], staffId (the staff_id of {Technician-D} from GET /api/staff), startDate, startTime, spreadMode \"single\", totalMinutes, perDayMinutes and isAllDay false; 201 means created. If refused, use the Schedule screen as in Part 1.",
  "Read the avatar names from each avatar's hover tooltip with Playwright; record the order.",
  P2_EVID,
 ],
 "change_summary": "Rewritten in full to the 8 Oct layout; expectation unchanged. The Tech View step now makes sure Assigned Techs is on (on by default since S7-R7 v51) instead of turning it on. Placeholders {Technician-A..D}, {Line-1..3}; setup moved to the doc. Automated case: tell Vladimir.",
})
upd.append({
 "case_id": 96994,
 "title": "The lead comes first and each technician shows only once",
 "preconditions": [
  signed(), WIDTH,
  tech("Technician-A", "Esther Howard"),
  tech("Technician-B", "Ralph Edwards"),
  "Approved work order {Work-order-1} (for example S10043-17606) for customer {Customer-A} (for example \"ZZAUTOTEST F3 Lead First Once\") is led by {Technician-A} and has three approved lines: {Line-1} (for example \"Service - Full grease service\") given to {Technician-A}, and {Line-2} (for example \"Service - Adjust clutch\") and {Line-3} (for example \"Replace - Brake pot\") both given to {Technician-B}.",
 ],
 "steps": [
  "Open Work Orders, click the All tab and click Board View in the display switcher (tooltip \"Board View\").",
  "Type the name of {Customer-A} in Search.",
  "Click Fields to display, turn line technicians on and close the menu.",
  "Read the avatars on the {Work-order-1} card in order.",
  "Hover each avatar and read the name shown.",
  "Click Tech View in the display switcher.",
  ENSURE,
  "Read the avatars in {Work-order-1}'s Assigned Techs cell in order.",
  "Hover each avatar and read the name shown.",
 ],
 "results": [
  "Steps 4 and 5: the group shows 2 avatars: {Technician-A} first, then {Technician-B}.",
  "Steps 4 and 5: {Technician-A} appears once although they are the lead and on {Line-1}, and {Technician-B} appears once although they are on {Line-2} and {Line-3}.",
  "Steps 8 and 9: Tech View's Assigned Techs cell shows the same 2 avatars, {Technician-A} first, each once.",
 ],
 "source": s7_source("S7-R3, S7-R5, S7-E1", " Review Decisions FF-8 / DR-11."),
 "quotes": [q("S7-R3"), q("S7-R5"), q("S7-E1"), q("S7-R7")],
 "marker": READY,
 "doc_part1": [
  P_SIGN, P_LOC, P_WIDTH,
  p_tech("Technician-A", "Esther Howard"), p_tech("Technician-B", "Ralph Edwards"),
  p_cust("Customer-A", "ZZAUTOTEST F3 Lead First Once"),
  p_wo("Work-order-1", "Customer-A", "S10043-17606", lines=3) + " Its lines are {Line-1}, {Line-2} and {Line-3}, in that order.",
  p_lead("Work-order-1", "Technician-A"),
  p_linetech("Work-order-1", "Line-1", "Technician-A") + " " + p_linetech("Work-order-1", "Line-2", "Technician-B") + " " + p_linetech("Work-order-1", "Line-3", "Technician-B"),
  "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A}: exactly {Work-order-1} shows, Approved, Lead Technician {Technician-A}. On its Lines tab {Line-1} shows {Technician-A}, and {Line-2} and {Line-3} show {Technician-B}.",
 ],
 "doc_part2": [
  "Goal: one work order whose lead is also on a line and whose second technician is on two lines, then read the avatar order in Board View and Tech View.",
  "Read the avatar names in order from each avatar's hover tooltip with Playwright; count the avatars.",
  P2_EVID,
 ],
 "change_summary": "Rewritten in full to the 8 Oct layout; expectation unchanged. The Tech View step now makes sure Assigned Techs is on (on by default since S7-R7 v51). Placeholders; setup moved to the doc. Automated case: tell Vladimir.",
})
upd.append({
 "case_id": 96995,
 "title": "Extra technicians show as +N and every name can be found by hovering",
 "preconditions": [
  signed(), WIDTH,
  tech("Technician-A", "Esther Howard"), tech("Technician-B", "Ralph Edwards"), tech("Technician-C", "Dana Ortiz"),
  tech("Technician-D", "Jenny Wilson"), tech("Technician-E", "Kristin Watson"), tech("Technician-F", "Theresa Webb"),
  "Approved work order {Work-order-1} (for example S10043-17607) for customer {Customer-A} (for example \"ZZAUTOTEST F3 Plus N Avatars\") is led by {Technician-A} and has five approved lines, each given to a different technician: {Line-1} (for example \"Service - Full grease service\") to {Technician-B}, {Line-2} (for example \"Service - Adjust clutch\") to {Technician-C}, {Line-3} (for example \"Replace - Brake pot\") to {Technician-D}, {Line-4} (for example a second \"Service - Full grease service\") to {Technician-E} and {Line-5} (for example a second \"Service - Adjust clutch\") to {Technician-F}.",
  "So six different people are on {Work-order-1}, more than the avatar group can show.",
 ],
 "steps": [
  "Open Work Orders, click the All tab and click Board View in the display switcher (tooltip \"Board View\").",
  "Type the name of {Customer-A} in Search.",
  "Click Fields to display, turn line technicians on and close the menu.",
  "Count the avatars shown on the {Work-order-1} card and read the +N indicator.",
  "Hover each visible avatar, one at a time, and read the name shown.",
  "Hover the +N indicator and read what it shows.",
  "Click Tech View in the display switcher.",
  ENSURE,
  "Count the avatars shown in {Work-order-1}'s Assigned Techs cell and read the +N indicator.",
  "Hover each visible avatar, one at a time, and read the name shown.",
  "Hover the +N indicator and read what it shows.",
 ],
 "results": [
  "Steps 4 and 9: if not all 6 fit, the first avatars are shown followed by +N, and the avatars shown plus N equal 6 (for example 4 avatars and \"+2\").",
  "Steps 5 and 10: hovering an avatar shows that avatar's own name, only while the pointer is on that avatar.",
  "Steps 6 and 11: every one of the 6 technicians can be found by name, including those behind +N (for example hovering \"+2\" lists {Technician-E} and {Technician-F}).",
 ],
 "source": s7_source("S7-R4, S7-R6, S7-R2", " Design export of 8 Oct 2026 (Claude Design project 787fef1a, Work Orders.dc.html) / design system TechStack: up to 5 avatars, else 4 avatars + \"+N\"; hovering +N lists the hidden names."),
 "quotes": [q("S7-R4"), q("S7-R2"), q("S7-R6"), q("S7-R7")],
 "marker": READY,
 "doc_part1": [
  P_SIGN, P_LOC, P_WIDTH,
  p_tech("Technician-A", "Esther Howard"), p_tech("Technician-B", "Ralph Edwards"), p_tech("Technician-C", "Dana Ortiz"),
  p_tech("Technician-D", "Jenny Wilson"), p_tech("Technician-E", "Kristin Watson"), p_tech("Technician-F", "Theresa Webb"),
  p_cust("Customer-A", "ZZAUTOTEST F3 Plus N Avatars"),
  p_wo("Work-order-1", "Customer-A", "S10043-17607", lines=5) + " Its lines are {Line-1} to {Line-5}, in that order.",
  p_lead("Work-order-1", "Technician-A"),
  "Give each line to a different technician (Lines tab > Edit Line > Technicians > pick > save): {Line-1} to {Technician-B}, {Line-2} to {Technician-C}, {Line-3} to {Technician-D}, {Line-4} to {Technician-E}, {Line-5} to {Technician-F}.",
  "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A}: exactly {Work-order-1} shows, Approved, Lead Technician {Technician-A}; its Lines tab shows the five lines with the five different technicians.",
 ],
 "doc_part2": [
  "Goal: one work order with six different people on it, then read the avatar group, the +N indicator and every hover name in Board View and Tech View.",
  "Read each hover tooltip with Playwright as an exact string; move the pointer off the avatar and confirm the tooltip closes. Record N and the number of visible avatars.",
  P2_EVID,
 ],
 "change_summary": "Rewritten in full to the 8 Oct layout; expectation unchanged. The Tech View step now makes sure Assigned Techs is on (on by default since S7-R7 v51). Placeholders {Technician-A..F}, {Line-1..5}; setup moved to the doc. Automated case: tell Vladimir.",
})
upd.append({
 "case_id": 96996,
 "title": "The technician field is blank only with no lead and no line technician",
 "preconditions": [
  signed(), WIDTH,
  tech("Technician-A", "Esther Howard"), tech("Technician-B", "Ralph Edwards"),
  "Customer {Customer-A} (for example \"ZZAUTOTEST F3 Blank Technician\") has exactly three work orders, all Approved, each with one approved line.",
  "Work order {Work-order-1} (for example S10043-17608) has no lead technician and its line {Line-1} (for example \"Service - Full grease service\") has no technician.",
  "Work order {Work-order-2} (for example S10043-17609) has no lead technician and its line {Line-2} (for example \"Service - Full grease service\") is given to {Technician-B}.",
  "Work order {Work-order-3} (for example S10043-17610) is led by {Technician-A} and its line {Line-3} (for example \"Service - Full grease service\") has no technician.",
 ],
 "steps": [
  "Open Work Orders, click the All tab and click Board View in the display switcher (tooltip \"Board View\").",
  "Type the name of {Customer-A} in Search.",
  "Click Fields to display, turn line technicians on and close the menu.",
  "Read the line technicians field on each of the three cards.",
  "Click Tech View in the display switcher.",
  ENSURE,
  "Read the Assigned Techs cell for each of the three rows.",
 ],
 "results": [
  "Step 4: the {Work-order-1} card's field is blank, {Work-order-2} shows {Technician-B} and {Work-order-3} shows {Technician-A}. Only 1 of the 3 is blank. A \"-\" in an empty field counts as blank.",
  "Step 7: in Tech View the Assigned Techs cell is blank for {Work-order-1}, shows {Technician-B} for {Work-order-2} and {Technician-A} for {Work-order-3}.",
 ],
 "source": s7_source("S7-N1", " Design export of 8 Oct 2026 (Claude Design project 787fef1a, Work Orders.dc.html): an empty group renders \"-\"; write down whether blank shows as empty or as a dash."),
 "quotes": [q("S7-N1"), q("S7-R7")],
 "marker": READY,
 "doc_part1": [
  P_SIGN, P_LOC, P_WIDTH,
  p_tech("Technician-A", "Esther Howard"), p_tech("Technician-B", "Ralph Edwards"),
  p_cust("Customer-A", "ZZAUTOTEST F3 Blank Technician"),
  p_wo("Work-order-1", "Customer-A", "S10043-17608") + " Its line is {Line-1}. Leave Lead Technician empty and give the line no technician.",
  p_wo("Work-order-2", "Customer-A", "S10043-17609") + " Its line is {Line-2}. Leave Lead Technician empty.",
  p_linetech("Work-order-2", "Line-2", "Technician-B"),
  p_wo("Work-order-3", "Customer-A", "S10043-17610") + " Its line is {Line-3}. Give the line no technician.",
  p_lead("Work-order-3", "Technician-A"),
  "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A}: exactly {Work-order-1}, {Work-order-2} and {Work-order-3} show, all Approved; only {Work-order-3} has a Lead Technician ({Technician-A}); on {Work-order-2}'s Lines tab {Line-2} shows {Technician-B}.",
 ],
 "doc_part2": [
  "Goal: three work orders (nobody; line technician only; lead only), then read the line technicians field in Board View and the Assigned Techs cell in Tech View.",
  "Read each card's and row's technician area as text and as an avatar count with Playwright; record whether blank renders empty or as \"-\".",
  P2_EVID,
 ],
 "change_summary": "Rewritten in full to the 8 Oct layout; expectation unchanged. The Tech View step now makes sure Assigned Techs is on (on by default since S7-R7 v51). [WO-a/b/c] became {Work-order-1..3}; placeholders; setup moved to the doc. Automated case: tell Vladimir.",
})

# ===================== C368141 =====================
upd.append({
 "case_id": 368141,
 "title": "Tech View's Assigned Techs column sits right after Lines",
 "preconditions": [
  signed(), WIDTH,
  tech("Technician-A", "Esther Howard"),
  "Approved work order {Work-order-1} (for example S10043-17611) for customer {Customer-A} (for example \"ZZAUTOTEST F3 Assigned Techs Column\") is led by {Technician-A} and has one approved line, {Line-1} (for example \"Service - Full grease service\").",
  "Brand-new staff user {User-B} (for example Tess Default) has the Admin role at {Location-A}, has never changed Tech View's columns, and is signed in in a second browser.",
  "Developer note kept from the automation engineer (nothing for the tester to do): Dev-layer test — fe-unit. Existing coverage: techViewColumns.spec.ts:36,65",
 ],
 "steps": [
  "In {User-B}'s browser, open Work Orders, click the All tab and click Tech View in the display switcher (tooltip \"Tech View\").",
  "Type the name of {Customer-A} in Search.",
  "Read the column headers and which column is directly to the right of Lines.",
  "Click the Column Selection button and read whether Assigned Techs is on.",
  "Turn Assigned Techs off and close the menu.",
  "Read the column headers.",
  "Click the Column Selection button, turn Assigned Techs on and close the menu.",
  "Read which column is directly to the right of Lines.",
 ],
 "results": [
  "Steps 3 and 4: without {User-B} having changed anything, Assigned Techs is on and its column is directly to the right of Lines.",
  "Steps 5 and 6: Assigned Techs can be turned off in the column menu, and its column no longer shows.",
  "Steps 7 and 8: turned back on, the Assigned Techs column is again directly to the right of Lines.",
 ],
 "source": f"Epic SV-10043; stories SV-10050 (Story 7, Show line technicians on cards and rows) and SV-10048 (Story 5); {PRD}, S7-R7 and S5-R4 (both {V51}; before, Assigned Techs was optional and off until added), {READ}. PO answer Chris Ward 2 Oct 2026 thread (\"right after Lines\"). Design export of 8 Oct 2026 (Claude Design project 787fef1a, Work Orders.dc.html): Tech View column order … Lines, Assigned Tech, Created on, Total price. {SV} {NOT_YET}",
 "quotes": [q("S7-R7"), q("S5-R4")],
 "marker": HOLD,
 "doc_part1": [
  P_SIGN, P_LOC, P_WIDTH,
  p_tech("Technician-A", "Esther Howard"),
  p_cust("Customer-A", "ZZAUTOTEST F3 Assigned Techs Column"),
  p_wo("Work-order-1", "Customer-A", "S10043-17611") + " Its line is {Line-1}.",
  p_lead("Work-order-1", "Technician-A"),
  p_newuser("User-B", "Tess Default") + " Sign in as {User-B} in a second browser.",
  "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A}: exactly {Work-order-1} shows, Approved, Lead Technician {Technician-A}; {User-B} can sign in and has not changed any column.",
 ],
 "doc_part2": [
  "Goal: a user who has never changed Tech View's columns, then read the column order around Lines, and turn Assigned Techs off and on.",
  "Read the header row left to right with Playwright as exact strings; the column right after Lines must read Assigned Techs both at the start and after turning it back on.",
  "Developer coverage (from the automation engineer's note on the earlier version): techViewColumns.spec.ts:36,65 (front-end unit).",
  P2_PREF,
  P2_EVID,
 ],
 "change_summary": "Rewritten in full to the 8 Oct layout. v52 (S7-R7/S5-R4 rewritten in v51): for a user who has never changed Tech View's columns, Assigned Techs is ON, directly after Lines; it can be turned off and back on (was: optional, added from the chooser). New precondition: a brand-new user {User-B}. Vladimir's dev-layer note kept as the last precondition line.",
})

# ===================== C96911 =====================
upd.append({
 "case_id": 96911,
 "title": "Switching display keeps the same tab, search, filters and work orders",
 "preconditions": [
  signed(), WIDTH,
  tech("Technician-A", "Esther Howard"), tech("Technician-B", "Ralph Edwards"), tech("Technician-C", "Jenny Wilson"),
  "Customer {Customer-A} (for example \"ZZAUTOTEST Fibridge\") has exactly three Approved work orders: {Work-order-1} (for example S10043-17612) led by {Technician-A}, {Work-order-2} (for example S10043-17613) led by {Technician-B}, and {Work-order-3} (for example S10043-17614) with no lead.",
  "Customer {Customer-B} (for example \"ZZAUTOTEST Fisquare\") has one Approved work order, {Work-order-4} (for example S10043-17615), with any lead. {Customer-B}'s name does not contain {Customer-A}'s name, so searching {Customer-A}'s name does not find {Work-order-4}.",
  "On the Work Orders page nothing is ticked in Status, Assigned to me is off and Search is empty.",
 ],
 "steps": [
  "Open Work Orders.",
  "Click the All tab on the left of the toolbar.",
  "Click Search and type the name of {Customer-A}.",
  "Click Status and tick Approved.",
  "Click outside the Status list to close it.",
  "In List, write down every work order number shown.",
  "Click Tech View in the display switcher at the right of the toolbar (tooltip \"Tech View\").",
  "Write down the work order numbers shown and each group header count.",
  "Click Board View in the display switcher (tooltip \"Board View\").",
  "Write down the work order numbers on the cards and each column header count.",
  "Click List in the display switcher (tooltip \"List\").",
 ],
 "results": [
  "Steps 7, 9 and 11: the layout changes straight away on each click, without a page reload.",
  "Steps 7 to 11: after every switch the All tab is still selected, the search box still shows the name of {Customer-A}, and Status still shows Approved ticked.",
  "Steps 6, 8 and 10: the same work orders appear in all three displays. List shows 3 rows ({Work-order-1}, {Work-order-2}, {Work-order-3}), Tech View shows the same 3 (Unassigned 1 + {Technician-A} 1 + {Technician-B} 1 = 3) and Board View shows the same 3 cards. {Work-order-4} appears in none of them.",
 ],
 "source": f"Epic SV-10043; story SV-10044 (Story 1, Switch between display options); {PRD}, S1-R3 and Feature Overview (its filter sentence was reworded in version 52 to name the Technician filter as the second exception, after Imported; this case uses no Technician filter, so the expected results are unchanged), {READ}. {SV} {OLD_BUILD}",
 "quotes": [q("S1-R3"), ["Feature Overview", FO_1], ["Feature Overview (the two exceptions)", FO_EXC]],
 "marker": READY,
 "doc_part1": [
  P_SIGN, P_LOC, P_WIDTH,
  p_tech("Technician-A", "Esther Howard"), p_tech("Technician-B", "Ralph Edwards"), p_tech("Technician-C", "Jenny Wilson"),
  p_cust("Customer-A", "ZZAUTOTEST Fibridge"),
  p_cust("Customer-B", "ZZAUTOTEST Fisquare", unit="TRL-903"),
  p_wo("Work-order-1", "Customer-A", "S10043-17612"), p_lead("Work-order-1", "Technician-A"),
  p_wo("Work-order-2", "Customer-A", "S10043-17613"), p_lead("Work-order-2", "Technician-B"),
  p_wo("Work-order-3", "Customer-A", "S10043-17614") + " Leave Lead Technician empty.",
  p_wo("Work-order-4", "Customer-B", "S10043-17615") + " Pick any lead.",
  P_FILTERS_CLEAR,
  "Check the setup worked: Work Orders > All > Search the name of {Customer-A} shows exactly 3 rows, {Work-order-1} (lead {Technician-A}), {Work-order-2} (lead {Technician-B}) and {Work-order-3} (no lead), all Approved, and not {Work-order-4}. If more work orders show (left from an earlier run), change the status of each extra one to Declined with the status control on the work order page, so the Approved filter leaves it out. Then clear the search.",
 ],
 "doc_part2": [
  "Goal: three Approved work orders of {Customer-A} spread over two leads and Unassigned, one decoy {Work-order-4} of {Customer-B}, then switch displays with a search and a Status filter on.",
  P2_PREF,
  "Check that no full page load happens on a switch (Playwright: no navigation event, the page's JavaScript state survives). Read the search box value and the Status chip after each switch.",
  P2_EVID,
 ],
 "change_summary": "Rewritten in full to the 8 Oct layout; expectation unchanged. Feature Overview re-quoted from v52 (the filter sentence plus the new exceptions sentence naming the Technician filter). Fibridge/Fisquare became {Customer-A}/{Customer-B} with those names as examples; steps one action per line; setup moved to the doc. Automated case: tell Vladimir.",
})

# ===================== C96913 =====================
TABS = ["All", "Work Orders", "Estimates", "Completed"]
st = ["Open Work Orders, click the All tab and click List in the display switcher.",
      "Type the name of {Customer-A} in Search."]
for disp in ("List", "Tech View", "Board View"):
    if disp != "List":
        st.append(f"Click {disp} in the display switcher (tooltip \"{disp}\").")
    where = {"List": "", "Tech View": " under {Technician-A}'s group", "Board View": " in {Technician-A}'s column"}[disp]
    for tab in TABS:
        st.append(f"Click the {tab} tab and write down which of {{Work-order-1}}, {{Work-order-2}} and {{Work-order-3}} appear{where}.")
# step numbers: List tabs 3-6, Tech View click 7, tabs 8-11, Board View click 12, tabs 13-16
upd.append({
 "case_id": 96913,
 "title": "The four tabs All, Work Orders, Estimates, Completed work in every display",
 "preconditions": [
  signed(), WIDTH,
  tech("Technician-A", "Esther Howard"),
  "Customer {Customer-A} (for example \"ZZAUTOTEST F1 Tabs\") has exactly three work orders, all led by {Technician-A}: {Work-order-1} (for example S10043-17616) in Estimate, {Work-order-2} (for example S10043-17617) in Approved, and {Work-order-3} (for example S10043-17618) in Complete.",
  "On the Work Orders page nothing is ticked in Status and Assigned to me is off.",
  "Developer note kept from the automation engineer (nothing for the tester to do): Dev-layer test — be-functional. Existing coverage: ViewWorkOrderBoardTest.php:215 (List vs board parity); merged into E2E C96911",
 ],
 "steps": st,
 "results": [
  "Steps 3 to 16: all four tabs (All, Work Orders, Estimates, Completed) show in every display. Which tab opens first is not checked by this case: the default tab was taken out of scope and stays as production has it today.",
  "Steps 3, 8 and 13: All shows {Work-order-1}, {Work-order-2} and {Work-order-3}.",
  "Steps 4, 9 and 14: Work Orders shows {Work-order-2} only.",
  "Steps 5, 10 and 15: Estimates shows {Work-order-1} only.",
  "Steps 6, 11 and 16: Completed shows {Work-order-3} only.",
 ],
 "source": f"Epic SV-10043; story SV-10044 (Story 1, Switch between display options); {PRD}, Feature Overview (its filter sentence was reworded in version 52 to name the Technician filter as the second exception, after Imported; the tabs are unchanged, so the expected results are unchanged) and Key Decisions (Permissions), {READ}. PO decision Chris Ward, PRD footer comment 25 Sep 2026 (\"The default-tab change is out too\"). Review Decisions 853901313 DR-33. {SV} {OLD_BUILD}",
 "quotes": [["Feature Overview", FO_1], ["Feature Overview (the two exceptions)", FO_EXC], ["Key Decisions", KD_PERM]],
 "marker": READY,
 "doc_part1": [
  P_SIGN, P_LOC, P_WIDTH,
  p_tech("Technician-A", "Esther Howard"),
  p_cust("Customer-A", "ZZAUTOTEST F1 Tabs"),
  p_wo("Work-order-1", "Customer-A", "S10043-17616", approved=False) + " It stays in Estimate. While it is an Estimate its Lead Technician is read-only on the work order page, so give it its lead from Board View: Work Orders > All > Board View > the card's More actions (…) > Reassign lead technician > pick {Technician-A} > Reassign.",
  p_wo("Work-order-2", "Customer-A", "S10043-17617"), p_lead("Work-order-2", "Technician-A"),
  p_wo("Work-order-3", "Customer-A", "S10043-17618") + " " + p_lead("Work-order-3", "Technician-A") + " Then move it to Complete with the status control on the work order page.",
  "Work Orders > All: clear any Status selection (Clear selection) and turn Assigned to me off.",
  "Check the setup worked: Work Orders > All > Search the name of {Customer-A} shows exactly {Work-order-1} (Estimate), {Work-order-2} (Approved) and {Work-order-3} (Complete), each with lead {Technician-A}. If a status or lead is wrong, fix it on the work order page (or from Board View for the Estimate) before starting.",
 ],
 "doc_part2": [
  "Goal: one work order in each of Estimate, Approved and Complete, all led by {Technician-A}, then click every tab in each display.",
  "The page search keeps its text across tabs and display switches (S1-R3); record the tab's address parameter after each click (playbook: tab=all|complete|my; the Estimates tab has no tab parameter).",
  "Developer coverage (from the automation engineer's note): ViewWorkOrderBoardTest.php:215 (List vs board parity), merged into E2E C96911.",
  P2_EVID,
 ],
 "change_summary": "Rewritten in full to the 8 Oct layout; expectation unchanged. Feature Overview re-quoted from v52 (the filter sentence plus the new exceptions sentence naming the Technician filter). Added a search on {Customer-A} so only this case's work orders show; one tab click per step; S1-352/S1-702/S1-689 became {Work-order-1..3}; Vladimir's dev-layer note kept as the last precondition line.",
})

# ===================== NEW: Technician filter (section 13236) =====================
NEWSRC = (f"Epic SV-10043; story SV-10044 (Story 1, Switch between display options); {PRD}, {{codes}} (added in version 52 on 14 Oct "
          "2026, Chris Ward ruling after Sasha Grosman's staging review follow-up), " + READ + ". " + SV + " Not yet checked against a build.")
new.append({
 "key": "T-01", "section_id": 13236,
 "title": "Tech View and Board View offer a Technician filter that List does not",
 "preconditions": [
  signed(), WIDTH,
  tech("Technician-A", "Ana Carter"),
  tech("Technician-B", "Ana Brooks", extra=", was added after {Technician-A}, has the same first name as {Technician-A} and a last name that comes before {Technician-A}'s in the alphabet"),
  tech("Technician-C", "Ben Adams", extra=", was added after {Technician-B}, has a first name that comes after theirs and a last name that comes before both of theirs"),
  "Approved work order {Work-order-1} (for example S10043-17621) for customer {Customer-A} (for example \"ZZAUTOTEST NT1 Technician Filter List\") is led by {Technician-A}.",
  NOFILTER,
 ],
 "steps": [
  "Open Work Orders and click the All tab.",
  "Click Tech View in the display switcher.",
  "Write down the technician group headers shown, from top to bottom.",
  "Read the filters in the filter bar, from left to right.",
  "Click the Technician filter.",
  "Read the options in its list, from top to bottom.",
  "Tick {Technician-A}.",
  "Tick {Technician-B} (open the Technician filter again first if the list closed).",
  "Read the Technician filter.",
  "Click Board View in the display switcher.",
  "Read the filters in the filter bar, from left to right.",
  "Click the Technician filter and read the options in its list, from top to bottom.",
  "Click List in the display switcher.",
  "Read the filters in the filter bar.",
 ],
 "results": [
  "Step 4: Tech View's filter bar shows a Technician filter after Assigned to me (to its right). It shows no Department filter, and no Customer or Service Advisor filter.",
  "Step 6: the list starts with Unassigned, then lists the location's technicians by first name, then last name: {Technician-B} comes before {Technician-A} (same first name, earlier last name), and both come before {Technician-C} (later first name), although {Technician-C} has the earliest last name and {Technician-B} was added after {Technician-A}.",
  "Steps 3 and 6: the technicians in the list are the same people who have a group in Tech View.",
  "Steps 7 to 9: {Technician-A} and {Technician-B} are both chosen at the same time.",
  "Steps 11 and 12: Board View's filter bar shows the same Technician filter after Assigned to me (to its right), with the same options in the same order, and no Department, Customer or Service Advisor filter.",
  "Step 14: List's filter bar shows no Technician filter.",
 ],
 "source": NEWSRC.replace("{codes}", "S1-R15 and S1-R15b, the Feature Overview's new exceptions sentence, and the Out of Scope additions (Department filter; retired Customer and Service Advisor chips)"),
 "quotes": [q("S1-R15"), ["Feature Overview (the two exceptions)", FO_EXC], ["Out of Scope", OOS_DEPT], ["Out of Scope", OOS_CHIPS], q("S1-R15b")],
 "marker": HOLD,
 "doc_part1": [
  P_SIGN, P_LOC, P_WIDTH,
  p_tech("Technician-A", "Ana Carter") + " Use an email with ZZAUTOTEST in it (for example zzautotest.ana.carter@example.com).",
  p_tech("Technician-B", "Ana Brooks") + " Add {Technician-B} after {Technician-A}. Use an email with ZZAUTOTEST in it.",
  p_tech("Technician-C", "Ben Adams") + " Add {Technician-C} after {Technician-B}. Use an email with ZZAUTOTEST in it.",
  "If staff with these exact names already exist at {Location-A}, reuse them only if they meet the conditions above; otherwise pick other names that keep the same pattern (two with the same first name where the one added later has the earlier last name, and a third with a later first name and the earliest last name).",
  p_cust("Customer-A", "ZZAUTOTEST NT1 Technician Filter List"),
  p_wo("Work-order-1", "Customer-A", "S10043-17621"), p_lead("Work-order-1", "Technician-A"),
  P_FILTERS_CLEAR,
  "Check the setup worked: Work Orders > All > Tech View shows a group for each of {Technician-A}, {Technician-B} and {Technician-C}, and {Work-order-1} sits in {Technician-A}'s group. Nothing is chosen in any filter.",
 ],
 "doc_part2": [
  "Goal: three technicians whose names prove the sort (first name, then last name; not the order they were added), then read the Technician filter in Tech View, Board View and List.",
  "UNVERIFIED: the filter's on-screen label is taken from the PRD (\"Technician filter\"); record the label and the chip's data-test-id the build uses. The List chips once had data-test-ids filter_chip_status, filter_chip_company_id, filter_chip_tech_assigned_id, filter_chip_service_advisor_id and filter_chip_vehicleHere (playbook, August 2026); the PRD now says Customer and Service Advisor stay retired.",
  "Trap (playbook): a filter list closes the moment one option is ticked (SV-8824); reopen it before ticking the next option.",
  "Read the option list and the group headers as exact strings and compare them as sets; check the order of {Technician-B}, {Technician-A} and {Technician-C} within the list.",
  "Cleanup: clear the Technician filter at the end.",
  "UNVERIFIED: the design export shows a Department filter; the PRD (version 52, Out of Scope) leaves it out. A build that shows it fails this case.",
  P2_EVID,
 ],
 "why": "S1-R15 and S1-R15b (added in PRD v52): the Technician filter exists only in Tech View and Board View, after Assigned to me, Unassigned first then technicians by first then last name, multi-select; plus the v52 Out of Scope additions (no Department, Customer or Service Advisor filter).",
})
new.append({
 "key": "T-02", "section_id": 13236,
 "title": "Choosing technicians hides every other group and column, pinned ones too",
 "preconditions": [
  signed(), WIDTH,
  tech("Technician-A", "Esther Howard"), tech("Technician-B", "Ralph Edwards"), tech("Technician-C", "Dana Ortiz"),
  "Customer {Customer-A} (for example \"ZZAUTOTEST NT2 Technician Filter Groups\") is used by this case only.",
  "Approved work orders {Work-order-1} (for example S10043-17622), {Work-order-2} (for example S10043-17623) and {Work-order-3} (for example S10043-17624) for {Customer-A} are led by {Technician-A}, {Technician-B} and {Technician-C}, one each.",
  "Approved work order {Work-order-4} (for example S10043-17625) for {Customer-A} has no lead technician.",
  "Approved work order {Work-order-5} (for example S10043-17626) for {Customer-A} is led by {Technician-C}, and its line {Line-1} (for example \"Service - Full grease service\") is given to {Technician-A}.",
  "{Technician-C} is pinned for you in Board View.",
  NOFILTER,
 ],
 "steps": [
  "Open Work Orders and click the All tab.",
  "Click Tech View in the display switcher.",
  "Type the name of {Customer-A} in Search.",
  "Click the Technician filter.",
  "Tick Unassigned.",
  "Tick {Technician-A} (open the Technician filter again first if the list closed).",
  "Click outside the Technician filter list to close it.",
  "Read the group headers and the work orders under each.",
  "Click Board View in the display switcher.",
  "Read the column headers and the cards in each column.",
  "Click the Technician filter and clear the selection.",
  "Read the column headers.",
 ],
 "results": [
  "Step 8: Tech View shows only two groups, Unassigned (holding {Work-order-4}) and {Technician-A} (holding {Work-order-1}). The {Technician-B} and {Technician-C} groups are hidden.",
  "Step 8: {Work-order-5} is not shown, although {Technician-A} works on its line: the filter goes by lead technician only.",
  "Step 10: Board View shows only the Unassigned and {Technician-A} columns, holding {Work-order-4} and {Work-order-1}. The pinned {Technician-C} column is hidden, and {Work-order-5} is not shown.",
  "Step 12: with nothing chosen, every column shows again, and {Technician-C}'s column is still pinned.",
 ],
 "source": NEWSRC.replace("{codes}", "S1-R15") + " S1-R3 (filters kept when switching display).",
 "quotes": [q("S1-R15"), q("S1-R3")],
 "marker": HOLD,
 "doc_part1": [
  P_SIGN, P_LOC, P_WIDTH,
  p_tech("Technician-A", "Esther Howard"), p_tech("Technician-B", "Ralph Edwards"), p_tech("Technician-C", "Dana Ortiz"),
  p_cust("Customer-A", "ZZAUTOTEST NT2 Technician Filter Groups"),
  p_wo("Work-order-1", "Customer-A", "S10043-17622"), p_lead("Work-order-1", "Technician-A"),
  p_wo("Work-order-2", "Customer-A", "S10043-17623"), p_lead("Work-order-2", "Technician-B"),
  p_wo("Work-order-3", "Customer-A", "S10043-17624"), p_lead("Work-order-3", "Technician-C"),
  p_wo("Work-order-4", "Customer-A", "S10043-17625") + " Leave Lead Technician empty.",
  p_wo("Work-order-5", "Customer-A", "S10043-17626") + " Its line is {Line-1}.", p_lead("Work-order-5", "Technician-C"),
  p_linetech("Work-order-5", "Line-1", "Technician-A"),
  "Work Orders > All > Board View: click the pin button in {Technician-C}'s column header (tooltip \"Pin column\"). If three technicians are already pinned for you, unpin one first and write down who, so you can pin them back after the case.",
  P_FILTERS_CLEAR,
  "Check the setup worked: Work Orders > All > Board View > Search the name of {Customer-A}: {Work-order-1} is in {Technician-A}'s column, {Work-order-2} in {Technician-B}'s, {Work-order-3} and {Work-order-5} in {Technician-C}'s (pinned, shown with a filled pin), and {Work-order-4} in Unassigned. {Work-order-5}'s Lines tab shows {Line-1} given to {Technician-A}.",
 ],
 "doc_part2": [
  "Goal: three leads, one unassigned work order, one work order where {Technician-A} is crew but not lead, and {Technician-C} pinned; then choose Unassigned and {Technician-A} and read Tech View and Board View.",
  "UNVERIFIED: the Technician filter's on-screen label and data-test-id; record them. Trap (playbook): a filter list closes after one tick (SV-8824); reopen before the next tick.",
  "Read group headers and column headers as exact strings; record every work order number per group and per column.",
  "Cleanup: clear the Technician filter, unpin {Technician-C}, and pin back anyone you unpinned in Part 1.",
  P2_EVID,
 ],
 "why": "S1-R15 (added in PRD v52): choosing technicians shows only their groups or columns, every other group or column hidden, pinned ones included; it filters by lead technician only.",
})
new.append({
 "key": "T-03", "section_id": 13236,
 "title": "The Technician filter combines with other filters and Clear all filters",
 "preconditions": [
  signed(), WIDTH,
  tech("Technician-A", "Esther Howard"), tech("Technician-B", "Ralph Edwards"),
  "Customer {Customer-A} (for example \"ZZAUTOTEST NT3 Technician Filter Mix\") is used by this case only.",
  "Customer {Customer-B} (for example \"ZZAUTOTEST NT3 Other Customer\") is used by this case only, and its name does not contain {Customer-A}'s name.",
  "Approved work order {Work-order-1} (for example S10043-17627) for {Customer-A} is led by {Technician-A}.",
  "Approved work order {Work-order-2} (for example S10043-17628) for {Customer-A} is led by {Technician-B}.",
  "Approved work order {Work-order-3} (for example S10043-17629) for {Customer-B} is led by {Technician-A}.",
  "None of these work orders is assigned to you: you are not their lead technician, not their Service Advisor and not on any of their lines.",
  "Status {Status-A} (for example Paid) is a status none of {Customer-A}'s work orders has.",
  NOFILTER,
 ],
 "steps": [
  "Open Work Orders and click the All tab.",
  "Click Tech View in the display switcher.",
  "Type the name of {Customer-A} in Search.",
  "Click the Technician filter and tick {Technician-A}.",
  "Click outside the Technician filter list to close it.",
  "Read the groups and rows shown.",
  "Turn on Assigned to me.",
  "Read the page.",
  "Turn off Assigned to me.",
  "Read the rows shown.",
  "Click Status and tick {Status-A}.",
  "Click outside the Status list to close it.",
  "Read the page.",
  "Click Clear all filters.",
  "Read the Technician filter, the Status filter and the rows shown.",
 ],
 "results": [
  "Step 6: only {Work-order-1} shows, in {Technician-A}'s group. {Work-order-2} (led by {Technician-B}) and {Work-order-3} (another customer) are not shown.",
  "Step 8: no work order shows. The page reads \"No work orders match these filters\", then \"Try removing a filter to widen your results.\", with a Clear all filters button.",
  "Step 10: {Work-order-1} shows again, still only in {Technician-A}'s group.",
  "Step 13: the same empty state shows: \"No work orders match these filters\", then \"Try removing a filter to widen your results.\", with a Clear all filters button.",
  "Steps 14 and 15: the Technician filter shows nothing chosen, nothing is ticked in Status, and {Work-order-2} shows again in {Technician-B}'s group.",
 ],
 "source": NEWSRC.replace("{codes}", "S1-R15a") + " S1-N1a (reworded in version 43) and S1-R13.",
 "quotes": [q("S1-R15a"), q("S1-R13"), q("S1-N1a")],
 "marker": HOLD,
 "doc_part1": [
  P_SIGN, P_LOC, P_WIDTH,
  p_tech("Technician-A", "Esther Howard"), p_tech("Technician-B", "Ralph Edwards"),
  p_cust("Customer-A", "ZZAUTOTEST NT3 Technician Filter Mix"),
  p_cust("Customer-B", "ZZAUTOTEST NT3 Other Customer", unit="TRL-903"),
  p_wo("Work-order-1", "Customer-A", "S10043-17627"), p_lead("Work-order-1", "Technician-A"),
  p_wo("Work-order-2", "Customer-A", "S10043-17628"), p_lead("Work-order-2", "Technician-B"),
  p_wo("Work-order-3", "Customer-B", "S10043-17629"), p_lead("Work-order-3", "Technician-A"),
  "On each of {Work-order-1}, {Work-order-2} and {Work-order-3}: if the Service Advisor is you, change it to another staff member (or leave it empty), and do not give yourself any line.",
  "Choose {Status-A}: Work Orders > All > List > Search the name of {Customer-A} > Status, tick one status (for example Paid; not Approved and not Imported). If the List shows no work order, that status is {Status-A}. Then clear the Status selection and the search.",
  P_FILTERS_CLEAR,
  "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A} shows {Work-order-1} (lead {Technician-A}) and {Work-order-2} (lead {Technician-B}) and not {Work-order-3}; with Assigned to me on, the same search shows no work order. Turn Assigned to me off and empty Search again.",
 ],
 "doc_part2": [
  "Goal: two work orders of {Customer-A} with different leads, a decoy of {Customer-B} with the same lead as {Work-order-1}, none assigned to the signed-in user; then combine the Technician filter with Search, Assigned to me and Status.",
  "Read the empty-state texts with Playwright as exact strings: \"No work orders match these filters\" and \"Try removing a filter to widen your results.\", and a button labelled exactly \"Clear all filters\" (older builds of the List read \"Clear Filters\", playbook; the PRD label is followed).",
  "UNVERIFIED: the Technician filter's on-screen label and data-test-id; record them. Whether Clear all filters also empties Search is not stated by the PRD; record what happens.",
  "Re-check {Status-A} just before step 11: on a shared QA site another session can create a work order in that status.",
  P2_EVID,
 ],
 "why": "S1-R15a (added in PRD v52): the Technician filter combines with every other filter and Assigned to me; nothing matching gives the S1-N1a empty state; Clear all filters also clears the Technician filter.",
})
new.append({
 "key": "T-04", "section_id": 13236,
 "title": "List ignores the Technician choice and Tech View brings it back",
 "preconditions": [
  signed(), WIDTH,
  tech("Technician-A", "Esther Howard"), tech("Technician-B", "Ralph Edwards"),
  "Customer {Customer-A} (for example \"ZZAUTOTEST NT4 Technician Filter Memory\") has exactly three Approved work orders: {Work-order-1} (for example S10043-17630) led by {Technician-A}, {Work-order-2} (for example S10043-17631) led by {Technician-B}, and {Work-order-3} (for example S10043-17632) with no lead.",
  NOFILTER + " Asset on Site has nothing selected.",
 ],
 "steps": [
  "Open Work Orders and click the All tab.",
  "Click Tech View in the display switcher.",
  "Type the name of {Customer-A} in Search.",
  "Click the Technician filter and tick {Technician-A}.",
  "Click outside the Technician filter list to close it.",
  "Read the groups and rows shown.",
  "Click List in the display switcher.",
  "Read the rows shown and the filters in the filter bar.",
  "Click Tech View in the display switcher.",
  "Read the Technician filter and the groups shown.",
  "Click Asset on Site and tick No.",
  "Click outside the Asset on Site list to close it.",
  "Reload the page.",
  "Read the Technician filter and the Asset on Site filter.",
 ],
 "results": [
  "Step 6: only {Technician-A}'s group shows, holding {Work-order-1}.",
  "Step 8: List shows every work order of {Customer-A}, {Work-order-1}, {Work-order-2} and {Work-order-3}, as if no technician were chosen, and List's filter bar shows no Technician filter.",
  "Step 10: the Technician filter still shows {Technician-A} chosen, and only {Technician-A}'s group shows, holding {Work-order-1}.",
  "Step 14: the Technician filter is remembered exactly as Asset on Site is. If Asset on Site still shows No after the reload, the Technician filter still shows {Technician-A} chosen. If Asset on Site was cleared by the reload, the Technician filter is cleared too. Write down which happened.",
 ],
 "source": NEWSRC.replace("{codes}", "S1-R15b and the Feature Overview's new exceptions sentence"),
 "quotes": [q("S1-R15b"), ["Feature Overview (the two exceptions)", FO_EXC]],
 "marker": HOLD,
 "doc_part1": [
  P_SIGN, P_LOC, P_WIDTH,
  p_tech("Technician-A", "Esther Howard"), p_tech("Technician-B", "Ralph Edwards"),
  p_cust("Customer-A", "ZZAUTOTEST NT4 Technician Filter Memory"),
  p_wo("Work-order-1", "Customer-A", "S10043-17630"), p_lead("Work-order-1", "Technician-A"),
  p_wo("Work-order-2", "Customer-A", "S10043-17631"), p_lead("Work-order-2", "Technician-B"),
  p_wo("Work-order-3", "Customer-A", "S10043-17632") + " Leave Lead Technician empty.",
  P_FILTERS_CLEAR + " Make sure Asset on Site has nothing selected.",
  "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A} shows exactly {Work-order-1} (lead {Technician-A}), {Work-order-2} (lead {Technician-B}) and {Work-order-3} (no lead), all Approved. Then empty Search.",
 ],
 "doc_part2": [
  "Goal: three work orders of {Customer-A} (two leads and one unassigned), then choose {Technician-A} in Tech View, switch to List and back, then compare how the Technician choice and an Asset on Site choice survive a reload.",
  "The other filters' memory today: filter state persists on the server in the user preference GET/PUT /api/users/me/preferences/work-orders-list (playbook, Work Orders filters section; Asset on Site options have data-test-ids filter_option_vehicleHere_1 (Yes) and filter_option_vehicleHere_0 (No)). Read that preference before and after the reload and record whether the Technician choice is stored in the same place (UNVERIFIED).",
  "UNVERIFIED: the Technician filter's on-screen label and data-test-id; record them.",
  "Cleanup: clear the Technician filter and Asset on Site at the end.",
  P2_EVID,
 ],
 "why": "S1-R15b (added in PRD v52): List does not offer the Technician filter and shows as if none chosen; switching back restores the choice; the choice is remembered the same way as the other filters.",
})

out = {"updates": upd, "new": new, "retire": [],
       "anchors_covered": {"S1-R15": ["T-01", "T-02"], "S1-R15a": ["T-03"], "S1-R15b": ["T-01", "T-04"], "S1-N1a": ["T-03"],
                           "S1-R13": ["T-03"], "S1-R3": [96911, "T-02"], "S2-R4": [96927], "S5-R4": [96979, 96927, 96983, 368141],
                           "S7-R7": [96979, 96927, 96975, 96993, 96994, 96995, 96996, 368141], "S5-R12": [96979], "S5-E2": [96979],
                           "S5-N2": [96983], "S5-N3": [96983], "S5-R13": [96983], "S5-R1": [96975], "S5-R8": [96975],
                           "S7-R1": [96993, 96979], "S7-R2": [96995], "S7-R3": [96994], "S7-R4": [96995], "S7-R5": [96994],
                           "S7-R6": [96995], "S7-N1": [96996], "S7-E1": [96994]},
       "reading_coverage": "PRD v52 CONFLUENCE-845185030-now-2026-10-14.md (75,806 B) read through the anchor map (237 codes) plus Feature Overview, Out of Scope, Key Decisions, Story 7 note and change log rows for v51/v52 read directly; the full v49→v52 text diff was read 100% by the orchestrator (BEHAVIOUR-CHANGES-PLAN.md). Live text of all 11 cases read 100% from affected-11-live.txt (61,802 B).",
       "notes": ["S5-R4 and S7-R7 were rewritten in PRD version 51 (change log rows of 14 Oct 2026), not 52; the source lines say so. S1-R15/R15a/R15b, the Overview sentence and the Out of Scope additions are version 52.",
                 "C228763 (Vladimir, Automated, not in run 498): its preconditions say Tech View's defaults have Assigned Techs off; under S5-R4/S7-R7 it will fail a correct build. Report only (not ours)."]}
json.dump(out, open(f"{H}/proposals-v52.json", "w"), indent=1, ensure_ascii=False)
print(len(upd), "updates ·", len(new), "new")
