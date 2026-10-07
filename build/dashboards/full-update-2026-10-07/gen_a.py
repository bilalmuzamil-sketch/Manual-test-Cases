#!/usr/bin/env python3
"""Generate proposals-A-S1-S6.json for Dashboard v1 (S1-S6). Quotes are pulled from the v42 file itself."""
import json, re, sys
ROOT = "/home/user/Manual-test-Cases/build/dashboards/"
SRC = ROOT + "sources/CONFLUENCE-788430850-Dashboard-v1-2026-10-07-v42.md"
OUT = ROOT + "full-update-2026-10-07/proposals-A-S1-S6.json"
RAW = open(SRC, encoding="utf-8").read()

def clean(s):  # drop markdown emphasis markers only; words untouched
    return s.replace("**", "")

A = {}
for line in RAW.splitlines():
    m = re.match(r"^\s*-\s*\*\*(S\d+-[RNE]\d+[a-z]?)(?:\s*\(([^)]*)\))?:\*\*\s*(.*)$", line.strip())
    if m:
        A[m.group(1)] = clean(m.group(3)).strip()
# S3-R2 table rows, verbatim inner text
ROWS = {}
for line in RAW.splitlines():
    m = re.match(r"^\| (Revenue|Billing Efficiency|Technician Efficiency|Technician Utilization|Sales by Customer \(count\)|At Risk Customers \(count\)|ELR \(on the Billing Efficiency chart\)) \| (.*) \|$", line)
    if m:
        ROWS[m.group(1)] = m.group(1) + " | " + m.group(2)

def q(*keys):
    return [[k, A[k]] for k in keys]

CN = {  # context-note quotes: verbatim substrings of v42
 "S3 context note (parity check)": "to check parity on a KPI tile that shows a shop-wide figure, compare it against the matching report with all advisors or all technicians selected (no filter applied).",
 "S3-E3 context note": "the matching report renders its own empty cell differently, as an empty number with the percent sign still shown. Bringing the report's empty state into line is deliberately outside this spec, so a difference between the tile and the report in this one case, where neither is showing a figure, is not a failure of the parity rule in S3-R1. S3-R1 governs the figures.",
 "S3 context note (At Risk)": "At Risk Customers has no report, so parity does not apply to it; its formula in this table is the only definition of the measure.",
 "S4 context note (loading)": "the empty-chart placeholder is not the loading placeholder of S6-R14. A tile still loading shows the loading placeholder. A loaded tile with nothing to plot shows the empty-chart placeholder.",
 "S4 context note (expanded charts)": "The full chart inside an expanded tile, and the charts on the report pages (Story 11), are unchanged.",
 "S5-E3 context note": "QA should expect to create the case rather than find it.",
 "S5 context note (At Risk revenue)": "in the At Risk supporting line, \"${revenue} (12mo)\" is the customer's revenue over the last twelve months; for more than one customer it is the total across all at-risk customers.",
 "S6 context note (small screen)": "On a small screen there is no room for that, so the tile sends the user to the full report page instead of trying to open the detail in place.",
 "S6 context note (one panel)": "a single-panel expansion was chosen over letting several details open at once, so the user reads one thing at a time and the screen stays short.",
 "S1 context note (logo)": "It is branding, not navigation, so it was made inert on purpose.",
 "Terminology (small screen)": "a browser viewport less than 1024 pixels wide, measured by the width of the browser window, not the physical device.",
 "Terminology (at-risk customer)": "a customer who has bought before but whose most recent invoice is at least the selected number of days old (the inactivity window), and who also has either two or more lifetime invoices or some revenue in the last twelve months.",
 "Terminology (worked hours)": "the time technicians actually clocked, from their time records.",
 "Terminology (invoiced technician hours)": "the technician time recorded on work order lines. Used by Technician Efficiency. This is a different figure from invoiced hours.",
 "Terminology (internal hours)": "clocked time not tied to a work order, such as internal tasks.",
}
def cq(*keys):
    return [[k, CN[k]] for k in keys]

READ = "Dashboard v1 PRD, Confluence 788430850 v42, read 7 Oct 2026"
LAST = " Last checked against build v26.39.1-09be696 on 10/2/2026."
READY = "AUTOMATION: READY"
HOLD_BUILT = "AUTOMATION: HOLD - not yet built (approved design 7 Oct 2026)"
HOLD_BV = "AUTOMATION: HOLD - not yet build-verified"
STORY = {1: "SV-9573 (Story 1, Dashboard Access and Entry Point)", 2: "SV-9574 (Story 2, One Fixed Layout)",
         3: "SV-9575 (Story 3, Measure Formulas and Report Parity)", 4: "SV-9576 (Story 4, KPI Hero Tiles)",
         5: "SV-9577 (Story 5, Count Tiles, Sales by Customer and At Risk Customers)", 6: "SV-9578 (Story 6, Expanding a Tile)"}
def src(stories, sect, extra="", last=False):
    st = "; ".join("story " + STORY[s] for s in stories)
    s = f"Epic SV-490; {st}; {READ}, {sect}."
    if extra: s += " " + extra
    if last: s += LAST
    return s

# ---------- shared precondition blocks ----------
SIGNIN = "Sign in on the build under test as a user whose role has the Reports permission, for example an Administrator. To check a role: Settings > Roles & Permissions > open the role > the Reports permission is switched on."
DESKTOP = "Use a desktop browser window at least 1024 pixels wide (a maximised laptop or desktop window)."
PRIVATE = "Open the site in a fresh private (incognito) browser window, so nothing remembered from an earlier visit is in play."
BUSY_WP = "In the top bar, use the workplace selector at the top left (it shows the workplace name, e.g. \"ShopHub\") to pick a workplace that has invoices and technician clocked time on several different days this month and in the last twelve months (on the QA environment the \"QA Testing\" data has this)."
EMPTY_WP = [
 "Seed a workplace with nothing in it:",
 "↳ Settings > Locations > add a new location (e.g. \"ZZAUTOTEST Empty Shop\") and save.",
 "↳ If your user is not given access to it automatically: Settings > Staff > open your own staff record > add the new location > save (you may be asked to sign in again).",
 "↳ Do not create any work order, invoice, credit or clocked time in it.",
 "↳ In the top bar, pick \"ZZAUTOTEST Empty Shop\" in the workplace selector.",
]
DASH = [
 "Seed the \"Dash Shop\" data set (every number in this case is worked out from it; all records are created today, inside This Month):",
 "↳ Workplace: Settings > Locations > add a new location (e.g. \"ZZAUTOTEST Dash Shop\") and save, then pick it in the workplace selector in the top bar. Nothing else may be invoiced or clocked in this workplace this month.",
 "↳ Staff: Settings > Staff > add two technicians (e.g. \"ZZAUTOTEST Tech One\" and \"ZZAUTOTEST Tech Two\", role Technician) and two service advisors (e.g. \"ZZAUTOTEST Advisor X\" and \"ZZAUTOTEST Advisor Y\", role Service Advisor), each with access to ZZAUTOTEST Dash Shop.",
 "↳ Customers: Customers > New Customer > create \"ZZAUTOTEST Alpha Fleet\", then again for \"ZZAUTOTEST Bravo Fleet\".",
 "↳ Work order 1: Work Orders > New Work Order > customer ZZAUTOTEST Alpha Fleet (add an asset if asked) > Create. Set the service advisor to ZZAUTOTEST Advisor X.",
 "↳ Work order 1, Lines tab > New Line: labor 2.00 hours at $100.00 an hour (e.g. $200.00 of labor), technician time 1.50 hours, technician ZZAUTOTEST Tech One. Approve the line.",
 "↳ Work order 1, on that line > Add Part: a part with a part number and a Sell Price of $50.00 (e.g.). Order and receive it (an invoice cannot be created while a part is unreceived).",
 "↳ Sign in as ZZAUTOTEST Tech One, clock in on work order 1's line, then clock out. Back as the Administrator, on the work order's Time Sheets tab set that record to last exactly 2.50 hours (e.g. 9:00 to 11:30 today).",
 "↳ Work order 2: same steps for customer ZZAUTOTEST Bravo Fleet with service advisor ZZAUTOTEST Advisor Y; one line of labor 1.00 hour at $100.00 (e.g. $100.00 of labor), technician time 1.00 hour, technicians ZZAUTOTEST Tech One and ZZAUTOTEST Tech Two; a received part with a Sell Price of $160.00 (e.g.).",
 "↳ On work order 2's line, Tech One clocks 0.25 hours and Tech Two clocks 0.75 hours (set exact times on the Time Sheets tab, e.g. 13:00 to 13:15 and 13:15 to 14:00 today).",
 "↳ On each work order remove any shop supplies, fee or discount line that was added automatically, complete the Review step, then Finance tab > Create Invoice (close the payment window without taking payment).",
 "↳ With the example data you now have: invoices of $250.00 (Alpha Fleet) and $260.00 (Bravo Fleet); 3.00 labor hours billed; 2.50 technician hours on the lines; 3.50 clocked hours, all on work orders. No internal (non work order) time has been clocked.",
]
DASH_SHORT = "Have the \"Dash Shop\" data set in place (workplace \"ZZAUTOTEST Dash Shop\" with two invoiced work orders created today: Alpha Fleet $250.00 and Bravo Fleet $260.00, 3.00 labor hours billed, 2.50 technician hours on the lines, 3.50 clocked hours). If it is not there, seed it with these steps:"

def pre(*blocks):
    out = []
    for b in blocks:
        if isinstance(b, list): out.extend(b)
        else: out.append(b)
    return [f"{i}. {x}" if not x.startswith("↳") else x for i, x in enumerate(out, 1)] if False else number(out)

def number(lines):
    out, n = [], 0
    for x in lines:
        if x.startswith("↳"):
            out.append("   " + x)
        else:
            n += 1; out.append(f"{n}. {x}")
    return out

def steps(*ss):
    return [f"{i}. {s}" for i, s in enumerate(ss, 1)]

NOT_BY_HAND = "this part cannot be checked by hand; write 'not checked by hand' in the result comment and pass or fail on what you can see"

U, N = [], []
def upd(cid, title, preconds, stps, results, source, quotes, marker, change):
    assert len(title) <= 80 and ";" not in title, (cid, title, len(title))
    U.append(dict(case_id=cid, title=title, preconds=preconds, steps=stps, results=results, source=source,
                  quotes=quotes, marker=marker, change_summary=change))
def new(key, sec, title, preconds, stps, results, source, quotes, marker, why):
    assert len(title) <= 80 and ";" not in title, (key, title, len(title))
    N.append(dict(key=key, section_id=sec, title=title, preconds=preconds, steps=stps, results=results,
                  source=source, quotes=quotes, marker=marker, why=why))

# =========================== S1 ===========================
upd(88594, "Dashboard link sits after Reports and is the first screen after login",
 number([SIGNIN, PRIVATE, DESKTOP,
  "In the top bar, pick a workplace in the workplace selector at the top left (e.g. \"ShopHub\"). Note its name.",
  "Seed one invoice in that workplace this month (the automated version of this case seeds the same thing itself):",
  "↳ Customers > New Customer > name it (e.g. \"ZZAUTOTEST Entry Fleet\") > save.",
  "↳ Work Orders > New Work Order > pick that customer (add an asset if asked) > Create.",
  "↳ Lines tab > New Line with some labor (e.g. 1.00 hour at $100.00) > approve the line > complete the Review step.",
  "↳ Finance tab > Create Invoice (close the payment window without taking payment). Note the invoice subtotal (e.g. $100.00)."]),
 steps("Look at the top navigation bar and read the entries from left to right.",
  "Click \"Dashboard\" in the top navigation.",
  "Read the workplace name in the workplace selector at the top left and the Revenue tile's headline.",
  "Click the arrow icon beside the word \"Revenue\" on the Revenue tile (it opens the Sales report on the same range) and read the report's total for that workplace.",
  "Sign out (user menu at the top right > sign out).",
  "Sign in again as the same user."),
 ["The top navigation shows a \"Dashboard\" entry.",
  "\"Dashboard\" sits immediately to the right of \"Reports\" (with the build's bar: Work Orders, Schedule, Customers, Parts, Reports, Dashboard).",
  "Clicking \"Dashboard\" opens the dashboard screen with its six tiles.",
  "The figures are for the workplace shown in the top bar: the Revenue headline (This Month) is not $0.00, it includes the invoice you created (e.g. $100.00), and it equals the Sales report's total for the same workplace and range.",
  "After signing in again, the first screen you land on is the dashboard (not Work Orders)."],
 src([1], "Story 1", "Design canvas board 01_Opens_After (row 1) for the top bar labels.", last=True),
 q("S1-R1", "S1-R5", "S1-R2", "S1-R4", "S1-R3"), READY,
 "AUTOMATED CASE (tell Vlad): same five checks kept (Dashboard entry shown, sits right of Reports, opens the dashboard, figures for the selected workplace, lands on dashboard after login); preconditions rewritten from automation terms (storage state, seeded via API, browser storage key) to manual click-paths with a private window standing in for 'no stored expanded tile'; steps split into one action per line; the workplace check now compares Revenue against the Sales report; quotes re-read from v42 (unchanged text); title reworded.")

upd(88595, "Dashboard link shows for anyone with the Reports permission",
 number([
  "On the build under test, sign in as an Administrator and pick a workplace in the workplace selector in the top bar (e.g. \"ShopHub\").",
  "Seed a role without the Reports permission:",
  "↳ Settings > Roles & Permissions > Create custom role > pick a template (e.g. \"Service Advisor\") > Apply.",
  "↳ Role name (e.g. \"ZZAUTOTEST No Reports\") > switch the Reports permission off > Create.",
  "Seed a role with the Reports permission and nothing else to do with dashboards:",
  "↳ Settings > Roles & Permissions > Create custom role > same template > Apply > Role name (e.g. \"ZZAUTOTEST With Reports\") > make sure Reports is switched on > Create.",
  "Seed two users: Settings > Staff > add \"ZZAUTOTEST Reports User\" with role ZZAUTOTEST With Reports and \"ZZAUTOTEST No Reports User\" with role ZZAUTOTEST No Reports, both with access to the workplace. Note both sign-ins.",
  "Note the dashboard address: while signed in as the Administrator, click Dashboard and copy the address from the browser bar."]),
 steps("In a private browser window, sign in as ZZAUTOTEST Reports User.",
  "Look at the top navigation bar.",
  "Sign out, then sign in as ZZAUTOTEST No Reports User.",
  "Note which screen you land on after signing in.",
  "Look at the top navigation bar.",
  "Paste the dashboard address you copied into the browser bar and press Enter."),
 ["As ZZAUTOTEST Reports User (Reports permission on, no other setting changed), the top bar shows \"Dashboard\" to the right of \"Reports\". No other switch, feature setting or dashboard permission had to be turned on.",
  "As ZZAUTOTEST No Reports User, you land on Work Orders after signing in.",
  "As ZZAUTOTEST No Reports User, the top bar shows neither \"Reports\" nor \"Dashboard\".",
  "Typing the dashboard address takes ZZAUTOTEST No Reports User to Work Orders. No error page appears and no dashboard figures appear at any moment.",
  "The server also refusing the dashboard's data to that user is a developer or automated check: " + NOT_BY_HAND + "."],
 src([1], "Story 1", "Design canvas board 01_Opens_After (row 1) for the top bar labels.", last=True),
 q("S1-R6", "S1-R8", "S1-R7"), READY,
 "Preconditions now create the two roles and users with real click-paths (Settings > Roles & Permissions, Settings > Staff); steps one action per line; plain results separate the hand check from the server-side part, which is marked as not checkable by hand; quotes re-read from v42 (S1-R7 apostrophe now straight as in the file).")

upd(88596, "Without the Reports permission there is no Dashboard link",
 number(["On the build under test, have a user whose role has the Reports permission switched off, with access to one workplace. If you do not have one, seed it:",
  "↳ Settings > Roles & Permissions > Create custom role > template (e.g. \"Service Advisor\") > Apply > Role name (e.g. \"ZZAUTOTEST No Reports\") > switch Reports off > Create.",
  "↳ Settings > Staff > add a staff member (e.g. \"ZZAUTOTEST No Reports User\") with that role and access to the workplace.",
  "Note the dashboard address (copy it from the browser bar while signed in as an Administrator on the dashboard)."]),
 steps("Open a private browser window and sign in as ZZAUTOTEST No Reports User.",
  "Note the screen you land on.",
  "Look along the whole top navigation bar for a \"Dashboard\" entry.",
  "Paste the dashboard address into the browser bar and press Enter."),
 ["After signing in, the user does not land on the dashboard (they land on Work Orders).",
  "The top navigation shows no \"Dashboard\" entry.",
  "The dashboard cannot be opened: the address leads back to Work Orders and no dashboard tiles are shown."],
 src([1], "Story 1", last=True), q("S1-N2", "S1-N1"), READY,
 "Precondition now seeds the role and user step by step; steps one action per line with the build's labels; results say exactly what the tester sees; quotes re-read from v42 (unchanged).")

upd(88597, "The shop logo in the top bar does nothing when clicked",
 number([SIGNIN, "Pick any workplace in the workplace selector in the top bar.",
  "Have a small screen ready: a phone, or a tablet held upright, or a desktop window made narrower than 1024 pixels (the dashboard tiles stack into one column when it is narrow enough)."]),
 steps("On a desktop-width window, open the dashboard.",
  "Hover the mouse over the shop logo at the far left of the top bar.",
  "Click the shop logo.",
  "Open the site on the small screen.",
  "Tap the shop logo.",
  "Tap the menu button beside the logo (the icon with three lines)."),
 ["On desktop, the logo does not behave as a link: the pointer does not change to a hand and no link address appears at the bottom of the browser.",
  "Clicking the logo does nothing: the screen and the browser address stay the same.",
  "On the small screen, tapping the logo does nothing and does not open the menu.",
  "On the small screen, the menu button is separate from the logo, shows its own menu icon, and opens the menu when tapped.",
  "That clicking the logo sends no analytics event is a developer or automated check: " + NOT_BY_HAND + "."],
 src([1], "Story 1", "Design canvas board 14_Phone_After (row 14) for the small-screen top bar.", last=True),
 q("S1-N5", "S1-N6", "S1-N7", "S1-N8", "S1-N9"), READY,
 "Steps split into one action per line with hover, click and tap described; small screen explained in plain words; analytics part marked as not checkable by hand; quotes re-read from v42 (unchanged).")

upd(88598, "Switching workplace reloads the dashboard figures",
 number([SIGNIN, PRIVATE,
  "Have two workplaces available in the workplace selector in the top bar whose figures differ. Use your normal workplace (e.g. \"ShopHub\") and an empty one. If you have no empty one, seed it: Settings > Locations > add a new location (e.g. \"ZZAUTOTEST Empty Shop\") > save, and give your user access to it."]),
 steps("Pick your normal workplace (e.g. \"ShopHub\") in the workplace selector and open the dashboard.",
  "Write down the six tile headlines (e.g. Revenue $2,422.00).",
  "In the workplace selector, pick \"ZZAUTOTEST Empty Shop\" without leaving the dashboard.",
  "Read the six tile headlines again.",
  "Pick your normal workplace again.",
  "Look for any way to have no workplace selected (for example clearing the workplace selector)."),
 ["After you pick the other workplace, the dashboard reloads by itself and the headlines change to that workplace's figures (for the empty workplace: Revenue $0.00, Sales by Customer 0 customers, At Risk Customers 0). No figure from the first workplace stays on screen.",
  "Picking the first workplace again brings back the figures you wrote down.",
  "With no workplace selected, the dashboard loads no figures. If the build gives you no way to have no workplace selected, write 'no-workplace state not reachable by hand' in the result comment and pass or fail on the first two results."],
 src([1], "Story 1", last=True), q("S1-E1", "S1-E2"), READY,
 "Preconditions now seed an empty second workplace so the change of figures can be seen; steps one action per line; results show example figures; the no-workplace part says what to do if it cannot be reached; quotes re-read from v42 (unchanged).")

# =========================== S2 ===========================
upd(88599, "The six tiles always show in the same order for every user",
 number([SIGNIN, DESKTOP,
  "Have a second user whose role is different but also has the Reports permission (e.g. a Service Manager). If you have none: Settings > Staff > add a staff member (e.g. \"ZZAUTOTEST Second Viewer\") with the Service Manager role, after checking in Settings > Roles & Permissions that this role has Reports switched on.",
  "Pick any workplace in the workplace selector in the top bar."]),
 steps("Click \"Dashboard\" in the top navigation.",
  "Read the tile names in the top row from left to right.",
  "Read the tile names in the second row from left to right.",
  "Open a private browser window and sign in as the second user.",
  "Click \"Dashboard\" and read both rows again."),
 ["Top row, left to right: Revenue, Billing Efficiency, Technician Efficiency, Technician Utilization.",
  "Second row, left to right: Sales by Customer, At Risk Customers.",
  "The second user sees exactly the same six tiles in exactly the same places.",
  "Both users see all six tiles (none is missing for either user)."],
 src([2], "Story 2", "Design canvas board 01_Opens_After (row 1).", last=True),
 q("S2-R1", "S2-R2", "S2-R3", "S2-R4"), READY,
 "Precondition now names how to get a second user; steps one action per line; quotes re-read from v42 (unchanged).")

upd(88600, "The dashboard has no way to add, remove, move or hide tiles",
 number([SIGNIN, DESKTOP, "Pick any workplace in the workplace selector in the top bar."]),
 steps("Open the dashboard.",
  "Look over the whole page, each tile's header and corners, and the top of the page for any button, menu, pencil, gear, plus sign, close cross or eye icon.",
  "Right-click a tile and look at the menu that opens.",
  "Try to drag a tile by its title to another position.",
  "Sign out, sign in again and open the dashboard.",
  "Open the dashboard in a different browser or a private window."),
 ["There is no control to add a tile.",
  "There is no control to remove a tile (no close cross or remove option).",
  "There is no control to reorder tiles, and dragging a tile does not move it.",
  "There is no control to hide or show tiles.",
  "After signing in again, and in the other browser, the layout is the same fixed six tiles in the same order: no saved layout carries over."],
 src([2], "Story 2", last=True), q("S2-N1", "S2-N2", "S2-N3", "S2-N4", "S2-N5"), READY,
 "Steps now tell the tester exactly where to look and what to try (right-click, drag, sign out and in, other browser); quotes re-read from v42 (unchanged).")

# =========================== S3 ===========================
upd(88601, "Each tile shows the same figure as its matching report",
 number([SIGNIN, DESKTOP, BUSY_WP,
  "Have rights to create a work order and an invoice in that workplace (an Administrator has them)."]),
 steps("Open the dashboard and leave every tile on its default range.",
  "Write down the Revenue headline.",
  "Click the arrow icon beside \"Revenue\" (it opens the Sales report on the same range) and read the report's total for the invoices' subtotals at the foot of the table.",
  "Go back to the dashboard, write down the Billing Efficiency headline, then click its arrow icon (Service Advisor Analysis report) and read the report's overall figure with all advisors selected.",
  "Go back, write down the Technician Efficiency headline, then click its arrow icon (Technician Efficiency report, Invoiced) and read the overall figure with all technicians selected.",
  "Go back, write down the Technician Utilization headline, then click its arrow icon (Technician Utilization report) and read the overall figure with all technicians selected.",
  "Go back, write down the Sales by Customer headline, then click its arrow icon (Sales By Customer report) and read how many customers the report lists in total (e.g. the pager reads \"1 - 10 of 69\").",
  "Create one new invoice in the same workplace today: Work Orders > New Work Order > a customer > a labor line (e.g. 1.00 hour at $100.00) > approve > Review > Finance > Create Invoice.",
  "Within one minute, reload the dashboard and read the Revenue headline.",
  "Reload the Sales report on the same range and read its total."),
 ["Revenue equals the Sales report total exactly, to the cent.",
  "Billing Efficiency equals the Service Advisor Analysis figure, Technician Efficiency equals the Technician Efficiency report figure, and Technician Utilization equals the Technician Utilization report figure, each to two decimal places.",
  "Sales by Customer equals the number of customers the Sales By Customer report lists (e.g. 69 customers and \"1 - 10 of 69\").",
  "Straight after the new invoice, both the tile and the report have gone up by the same amount (e.g. $100.00) and still agree. There is no wait, and the tile never shows an older figure than the report.",
  "If any tile and its report disagree at any point, the case fails. Write both figures in the result comment."],
 src([3], "Story 3", "Report links per the Story 10 context note.", last=True),
 q("S3-R1", "S3-N1") + cq("S3 context note (parity check)"), READY,
 "Steps now walk tile by tile through the arrow icon into each matching report with all advisors or technicians selected; the 'at every moment' rule became a hand check (create an invoice and reload both within a minute); quotes re-read from v42 (unchanged) plus the parity-check context note.")

upd(88602, "Each tile's figure matches a hand calculation from known records",
 number([SIGNIN, DESKTOP] + DASH),
 steps("Open the dashboard with ZZAUTOTEST Dash Shop selected and every tile on its default range.",
  "Read the Revenue headline and its supporting line.",
  "Read the Billing Efficiency headline and its supporting line.",
  "Read the Technician Efficiency headline and its supporting line.",
  "Read the Technician Utilization headline and its supporting line.",
  "Read the Sales by Customer headline.",
  "Click View details on Billing Efficiency and read the Advisor Analysis table rows.",
  "Click View details on Technician Efficiency and read the table rows.",
  "Sign in as ZZAUTOTEST Tech Two, use the Clock In button in the top bar to clock in to a department (not a work order) and clock out again. As the Administrator, set that record to exactly 0.50 hours in Reports > Timesheet Activities (e.g. 15:00 to 15:30 today).",
  "Reload the dashboard and read the Technician Utilization headline and supporting line.",
  "Click View details on Technician Utilization and read the table rows.",
  "Read the At Risk Customers headline.",
  "Clean up: delete the 0.50-hour internal record again in Reports > Timesheet Activities, so the data set is back to its base state for other cases."),
 ["Revenue reads $510.00 (250.00 + 260.00) with the supporting line \"Parts 41% · Labor 59%\". Parts are 50.00 + 160.00 = 210.00, and 210 ÷ 510 = 41.2%, so 41%. Labor is 200.00 + 100.00 = 300.00, and 300 ÷ 510 = 58.8%, so 59%.",
  "Billing Efficiency reads 85.71% with \"3.00 Invoiced / 3.50 Clocked\" (labor hours billed 2.00 + 1.00 = 3.00; clocked 2.50 + 0.25 + 0.75 = 3.50; 3.00 ÷ 3.50 × 100 = 85.71).",
  "Technician Efficiency reads 71.43% with \"2.50 Invoiced Tech Hrs / 3.50 Clocked\" (technician time on the lines 1.50 + 1.00 = 2.50; 2.50 ÷ 3.50 × 100 = 71.43). It differs from Billing Efficiency because technician time is not the same as billed labor hours.",
  "Advisor Analysis rows: ZZAUTOTEST Advisor X, Worked Hours 2.50, Invoiced Hrs 2.00, Billing Efficiency 80.00%, ELR $80.00 ($200.00 labor ÷ 2.50 hours). ZZAUTOTEST Advisor Y, Worked Hours 1.00, Invoiced Hrs 1.00, Billing Efficiency 100.00%, ELR $100.00 ($100.00 ÷ 1.00).",
  "Technician Efficiency rows show work order 2's technician time split by each technician's share of the clocked time on that line (Tech One 0.25 of 1.00 clocked = 0.25 hours, Tech Two 0.75 hours). ZZAUTOTEST Tech One: Clocked Hrs 2.75, Invoiced Tech Hrs 1.75 (1.50 + 0.25), Efficiency 63.64%. ZZAUTOTEST Tech Two: Clocked Hrs 0.75, Invoiced Tech Hrs 0.75, Efficiency 100.00%.",
  "Before the internal time, Technician Utilization reads 100.00% with \"3.50 WO Hrs / 3.50 Clocked\".",
  "After 0.50 internal hours, Technician Utilization reads 87.50% with \"3.50 WO Hrs / 4.00 Clocked\" (3.50 ÷ (3.50 + 0.50) × 100 = 87.50). Table: Tech One WO Hours 2.75, Internal Hours 0.00, Total Hours 2.75, Utilization % 100.00%. Tech Two WO Hours 0.75, Internal Hours 0.50, Total Hours 1.25, Utilization % 60.00%.",
  "Sales by Customer reads \"2 customers\" (Alpha Fleet and Bravo Fleet, each counted once).",
  "At Risk Customers reads 0 for this workplace: both customers were invoiced today, so neither invoice is 120 or more days old.",
  "Each figure equals its matching report: Sales, Service Advisor Analysis, Technician Efficiency (Invoiced), Technician Utilization and Sales By Customer. At Risk Customers has no report."],
 src([3], "Story 3 (requirement S3-R2 and its table)", "Design canvas boards 05_Billing_After, 06_TechEff_After and 07_TechUtil_After for the table columns.", last=True),
 [["S3-R2", A["S3-R2"]]] + [["S3-R2 table: " + k, v] for k, v in ROWS.items()] + cq("Terminology (worked hours)", "Terminology (invoiced technician hours)", "Terminology (internal hours)", "S3 context note (At Risk)"),
 READY,
 "Replaced 'compute each measure by the formula' with a seeded data set (two invoices, two advisors, two technicians, a shared line, then internal time) and the exact figure for every tile and table row, with the arithmetic shown; the S3-R2 quote now carries the requirement sentence plus each table row verbatim instead of a merged paraphrase.")

upd(88603, "Ratio tiles with no clocked hours show a grey dash, not 0.00%",
 number([SIGNIN, DESKTOP,
  "Seed a workplace with no clocked time at all:",
  "↳ Settings > Locations > add a new location (e.g. \"ZZAUTOTEST No Clock Shop\") > save, give your user access, and pick it in the workplace selector in the top bar.",
  "↳ Create nothing in it yet."]),
 steps("Open the dashboard and leave every tile on This Month.",
  "Read the Billing Efficiency, Technician Efficiency and Technician Utilization headlines and their colour.",
  "Read the Revenue supporting line.",
  "Create one invoiced work order in this workplace with no clocked time: Customers > New Customer (e.g. \"ZZAUTOTEST No Clock Fleet\") > Work Orders > New Work Order > that customer > New Line: labor 1.00 hour at $100.00 with technician time 1.00 hour, assign a technician, but do not let anyone clock in > approve > Review > Finance > Create Invoice.",
  "Reload the dashboard and read the three ratio headlines again.",
  "Click the arrow icon beside \"Billing Efficiency\" and read the Service Advisor Analysis figure for the same range."),
 ["With no clocked hours, each of the three ratio tiles shows exactly \"-\": a single hyphen, in grey. None of them shows \"0.00%\", \"0%\" or \"n/a\".",
  "With no revenue, the Revenue tile's supporting line shows the invoice count instead of a parts and labor split (e.g. \"0 Invoices\").",
  "After invoicing a line with technician time but no clocked time, the three ratio headlines still read \"-\" in grey. Nothing breaks: no error, no endless number, and no blank tile.",
  "The report may show its empty figure differently (an empty number with a % sign). That difference alone does not fail this case."],
 src([3], "Story 3 (S3-E3 and its context note)", "Design canvas board 15_Empty_Design (row 15, approved 7 Oct 2026). Board 15_Empty_Now shows today's build reading \"n/a\"."),
 q("S3-E3") + cq("S3-E3 context note"), HOLD_BUILT,
 "S3-E3 changed in v42: the ratio headline now reads a grey \"-\" (was \"n/a\"); this case now checks only that (the negative-revenue and voided-invoice checks moved to two new cases, NEW-A11 and NEW-A12, so each case checks one thing); a seeded no-clock workplace and a technician-time-but-no-clock line make it runnable; marker set to HOLD (not yet built); last-checked stamp dropped.")

new("NEW-A11", 12169, "Revenue shows a negative figure when credits exceed sales",
 number([SIGNIN, DESKTOP,
  "Pick a workplace in the workplace selector in the top bar where no invoice has been created today. To confirm: Reports > Sales > pick a custom range of today only in the calendar (click today twice, then Apply). The total must read $0.00.",
  "Have an invoice from an earlier day in that workplace with a part on it (e.g. a part with Sell Price $160.00). Find it on the work order's Finance tab."]),
 steps("On that earlier invoice: Finance tab > the invoice's three-dot menu > Issue Credit.",
  "Pick the part to return (e.g. the $160.00 part), choose Store Credit and submit.",
  "Open the dashboard.",
  "On the Revenue tile, open the range pill, pick today only in the calendar (click today twice) and click Apply.",
  "Read the Revenue headline.",
  "Click the arrow icon beside \"Revenue\" and read the Sales report total for the same range."),
 ["The Revenue headline shows the true negative figure, e.g. \"-$160.00\" (sales today $0.00 minus credits today $160.00). It does not show $0.00.",
  "The Sales report total for today reads the same negative figure, to the cent."],
 src([3], "Story 3"), q("S3-E1"), HOLD_BV,
 "S3-E1 (negative Revenue), split out of C88603 so each case checks one thing; made runnable with a credit dated today against an earlier invoice in a workplace with no sales today.")

new("NEW-A12", 12169, "A voided invoice is left out of every dashboard figure",
 number([SIGNIN, DESKTOP,
  "Seed a workplace for the void check:",
  "↳ Settings > Locations > add a new location (e.g. \"ZZAUTOTEST Void Shop\") > save, give your user and one technician access, and pick it in the workplace selector.",
  "↳ Customers > New Customer > \"ZZAUTOTEST Keep Fleet\" and \"ZZAUTOTEST Void Fleet\".",
  "↳ Work order for ZZAUTOTEST Keep Fleet: New Line, labor 1.00 hour at $100.00 (e.g.), technician time 1.00 hour. The technician clocks exactly 1.00 hour on it (set exact times on the Time Sheets tab). Approve > Review > Finance > Create Invoice (do not pay).",
  "↳ Work order for ZZAUTOTEST Void Fleet: New Line, labor 2.00 hours at $150.00 (e.g. $300.00), technician time 2.00 hours, nobody clocks on it. Approve > Review > Finance > Create Invoice. Close the payment window without paying and do not send the invoice.",
  "For the at-risk part, pick a workplace with at-risk customers (on the QA environment, \"QA Testing\"). Find one customer in the At Risk table (dashboard > View details on At Risk Customers) and write down their name and Last Invoice Date (e.g. \"Ruline Partners\", Oct 10, 2025)."]),
 steps("With ZZAUTOTEST Void Shop selected, open the dashboard (all tiles on their defaults) and write down every headline and supporting line.",
  "Void the Void Fleet invoice: on that work order's Lines tab add a New Line (any small line) while the invoice is still unpaid and unsent. The Finance tab now shows the invoice as voided. Do not create a new invoice.",
  "Reload the dashboard and read every headline and supporting line again.",
  "Pick the workplace with the at-risk customer, open the dashboard and write down the At Risk headline.",
  "Create a new work order for that customer with one labor line (e.g. 0.50 hour at $100.00) > approve > Review > Finance > Create Invoice (do not pay or send).",
  "Reload the dashboard and read the At Risk headline.",
  "Void that invoice the same way (add a New Line on its Lines tab).",
  "Reload the dashboard, click View details on At Risk Customers and find the customer."),
 ["Before the void (step 1): Revenue $400.00 (100.00 + 300.00), \"2 customers\", Billing Efficiency 300.00% (3.00 invoiced hours ÷ 1.00 clocked hour) and Technician Efficiency 300.00% (3.00 ÷ 1.00).",
  "After the void, the voided invoice contributes nothing. Revenue $100.00 and its Parts/Labor split \"Parts 0% · Labor 100%\". Billing Efficiency 100.00% with \"1.00 Invoiced / 1.00 Clocked\". Technician Efficiency 100.00% with \"1.00 Invoiced Tech Hrs / 1.00 Clocked\". Sales by Customer \"1 customer\" (Void Fleet no longer counted).",
  "The matching reports (Sales, Service Advisor Analysis, Technician Efficiency, Sales By Customer) leave the voided invoice out in the same way.",
  "While the at-risk customer's new invoice was live, they dropped out of At Risk (the headline went down by 1).",
  "After that invoice is voided, the customer is back in the At Risk table with their old Last Invoice Date (e.g. Oct 10, 2025): the voided invoice is not treated as their most recent invoice."],
 src([3], "Story 3", "How to produce a voided invoice by hand comes from the Technical Implementation Plan (2026-09-16) section 7: an invoice is voided by adding a line while it is still pending; reversing an invoice deletes it rather than voiding it."),
 q("S3-E2"), HOLD_BV,
 "S3-E2 (voided invoices excluded), split out of C88603; made runnable with its own workplace, a hand-made void (add a line to an unpaid, unsent invoice) and exact before/after figures, plus the at-risk customer's most recent invoice.")

# =========================== S4 ===========================
upd(88604, "Revenue and Billing Efficiency tiles show the right headline and line",
 number([SIGNIN, DESKTOP, BUSY_WP, DASH_SHORT] + DASH[1:]),
 steps("With your busy workplace selected, open the dashboard and look at each of the four tiles in the top row.",
  "Hover the arrow icon beside each tile's name.",
  "Pick ZZAUTOTEST Dash Shop in the workplace selector.",
  "Read the Revenue headline and supporting line.",
  "Read the Billing Efficiency headline and supporting line."),
 ["Each of the four top tiles shows its name (label), a headline value, a small trend line, a date-range pill (e.g. \"This Month\") and an arrow icon beside the name that links to its report. A tile with fewer than two days of figures shows a dashed outline with a chart icon instead of the trend line; that is expected and covered by its own case.",
  "Revenue reads \"$510.00\": a dollar amount with two decimals (250.00 + 260.00).",
  "Revenue's supporting line reads \"Parts 41% · Labor 59%\", whole numbers with no decimals (210 ÷ 510 = 41.2%, so 41%; 300 ÷ 510 = 58.8%, so 59%).",
  "Billing Efficiency reads \"85.71%\", two decimal places (3.00 ÷ 3.50 × 100).",
  "Billing Efficiency's supporting line reads \"3.00 Invoiced / 3.50 Clocked\"."],
 src([4], "Story 4", "Design canvas boards 01_Opens_After and 02_Last12_After for the tile layout (arrow icon, range pill).", last=True),
 q("S4-R1", "S4-R2", "S4-R3", "S4-R4", "S4-R5"), READY,
 "Placeholder text like {parts} replaced by a seeded data set with exact expected figures and arithmetic; the report link is described as the arrow icon beside the tile name, as built; one action per step; quotes re-read from v42 (unchanged).")

upd(88605, "Technician Efficiency and Utilization tiles show the right headline and line",
 number([SIGNIN, DESKTOP, DASH_SHORT] + DASH[1:]),
 steps("Pick ZZAUTOTEST Dash Shop in the workplace selector and open the dashboard.",
  "Read the Technician Efficiency headline and supporting line.",
  "Sign in as ZZAUTOTEST Tech Two, click Clock In in the top bar, pick a department (not a work order), then clock out.",
  "As the Administrator, set that record to exactly 0.50 hours in Reports > Timesheet Activities (e.g. 15:00 to 15:30 today).",
  "Reload the dashboard and read the Technician Utilization headline and supporting line.",
  "Clean up: delete the 0.50-hour internal record again in Reports > Timesheet Activities."),
 ["Technician Efficiency reads \"71.43%\", two decimal places (technician time 2.50 ÷ clocked 3.50 × 100).",
  "Technician Efficiency's supporting line reads \"2.50 Invoiced Tech Hrs / 3.50 Clocked\".",
  "Technician Utilization reads \"87.50%\", two decimal places (work-order hours 3.50 ÷ (3.50 + 0.50 internal) × 100).",
  "Technician Utilization's supporting line reads \"3.50 WO Hrs / 4.00 Clocked\"."],
 src([4], "Story 4", "Design canvas board 01_Opens_After for the supporting-line wording.", last=True),
 q("S4-R6", "S4-R7", "S4-R8", "S4-R9"), READY,
 "Placeholders replaced by the seeded data set (Technician Efficiency read first, then 0.50 internal hours added for Technician Utilization and removed again) with exact expected figures and arithmetic; one action per step; quotes re-read from v42 (unchanged).")

upd(88606, "The small trend line uses days, weeks, months or quarters by range length",
 number([SIGNIN, DESKTOP, BUSY_WP,
  "Know how to set a custom range: open a tile's range pill, click a start day and an end day in the calendar, check the length shown at the bottom (e.g. \"Range: 31 days\"), then click Apply."]),
 steps("On the Revenue tile, pick a custom range of exactly 31 days ending today and count the points (corners) on the trend line.",
  "Change it to a custom range of exactly 32 days and count the points.",
  "Change it to exactly 182 days, then exactly 183 days, counting the points each time.",
  "Change it to exactly 731 days, then exactly 732 days, counting the points each time.",
  "Set Revenue to Last 12 Months and click View details. Compare the trend line's shape with the monthly bars in the Revenue chart.",
  "On the Billing Efficiency tile pick This Month and look at a day when nobody clocked any time (e.g. a Sunday)."),
 ["31 days draws one point per day (up to 31 points). 32 days switches to one point per week (about 5 points).",
  "182 days still draws one point per week (about 26 points). 183 days switches to one point per month (about 7 points).",
  "731 days still draws one point per month (about 25 points). 732 days switches to one point per quarter (about 9 points).",
  "On Last 12 Months the Revenue trend line has 12 points, and they rise and fall exactly like the 12 monthly bars in the expanded Revenue chart. A point never disagrees with the chart for the same month.",
  "On the day with no clocked time, the Billing Efficiency line has a gap: it breaks and resumes. It is not drawn down to zero and the days either side are not joined across the gap.",
  "When fewer than two points have a value, no line is drawn and the tile shows the empty-chart outline instead (checked in detail in its own cases)."],
 src([4], "Story 4", "Design canvas board 03_Range_After (row 3) for the range pill and calendar; board 04_Revenue_After for the expanded Revenue chart; board 15_Empty_Design (row 15) for the empty-chart outline."),
 q("S4-R10", "S4-R11"), HOLD_BUILT,
 "S4-R11 changed in v42: it now ends with the empty-chart placeholder when fewer than two points have values (was 'the line is not drawn'). Steps now build exact-length custom ranges with the calendar's 'Range: N days' readout to test both sides of every switch, compare the trend line with the expanded chart, and show a gap on a day with no clocked time. Marker set to HOLD (not yet built); last-checked stamp dropped.")

upd(88607, "KPI tiles show exact figures with no change indicator",
 number([SIGNIN, DESKTOP, BUSY_WP,
  "Seed a workplace with nothing in it: Settings > Locations > add a new location (e.g. \"ZZAUTOTEST Empty Shop\") > save > give your user access.",
  "Seed a workplace with one very large invoice:",
  "↳ Settings > Locations > add a new location (e.g. \"ZZAUTOTEST Big Shop\") > save, give your user access, and pick it in the workplace selector.",
  "↳ Customers > New Customer (e.g. \"ZZAUTOTEST Big Fleet\") > Work Orders > New Work Order for it > add a received part with Sell Price $1,234,567.89 (e.g.) and no labor > Review > Finance > Create Invoice (do not pay)."]),
 steps("With your busy workplace selected, open the dashboard and look at the four top tiles for any up or down arrow, plus/minus percentage or \"vs last period\" figure.",
  "Pick ZZAUTOTEST Empty Shop in the workplace selector and read the Revenue supporting line.",
  "Pick ZZAUTOTEST Big Shop and read the Revenue headline.",
  "Click the arrow icon beside \"Revenue\" and read the Sales report total."),
 ["No KPI tile shows an up/down arrow, change percentage or any other change figure. The small trend line is the only comparison.",
  "With no parts and labor split to show (no revenue), the Revenue supporting line reads the invoice count instead (e.g. \"0 Invoices\").",
  "The very large value is shown in full to the cent, \"$1,234,567.89\", the same as the Sales report total. It is not shortened (no \"$1.2M\") and not rounded."],
 src([4], "Story 4", "Design canvas board 15_Empty_Design (row 15) shows the \"0 Invoices\" line.", last=True),
 q("S4-N1", "S4-N2", "S4-E1"), READY,
 "Placeholder {count} replaced by a seeded empty workplace (\"0 Invoices\") and a seeded $1,234,567.89 invoice for the extreme value; steps tell the tester exactly what a change indicator would look like; quotes re-read from v42 (unchanged).")

# ---- new empty-chart cases (12170) ----
OUTLINE = "a dashed outline with a small line-chart icon in its middle, sitting where the trend line would be"
new("NEW-A1", 12170, "Ratio tiles with no clocked hours show an empty chart outline",
 number([SIGNIN, DESKTOP] + EMPTY_WP),
 steps("Open the dashboard with ZZAUTOTEST Empty Shop selected and every tile on This Month.",
  "Look at the area under the supporting line on Billing Efficiency, Technician Efficiency and Technician Utilization.",
  "Read each of the three tiles' headline and supporting line."),
 ["Each of the three tiles shows " + OUTLINE + ". No trend line is drawn and the space is not left blank.",
  "The headline and supporting line still show their usual values for a range with no hours: the grey \"-\" headline, and \"0.00 Invoiced / 0.00 Clocked\", \"0.00 Invoiced Tech Hrs / 0.00 Clocked\" and \"0.00 WO Hrs / 0.00 Clocked\"."],
 src([4], "Story 4", "Design canvas board 15_Empty_Design (row 15, approved 7 Oct 2026; today's build is board 15_Empty_Now)."),
 q("S4-R12", "S4-R18"), HOLD_BUILT, "S4-R12 (no point with a value: ratio tiles with no hours) and S4-R18.")

new("NEW-A2", 12170, "A ratio tile with hours on one day only shows an empty chart outline",
 number([SIGNIN, DESKTOP, DASH_SHORT] + DASH[1:]),
 steps("Pick ZZAUTOTEST Dash Shop in the workplace selector and open the dashboard (every tile on This Month).",
  "Look at the trend-line area of Billing Efficiency, Technician Efficiency and Technician Utilization.",
  "Read the three headlines and supporting lines."),
 ["All clocked time is on one day, so each ratio tile has only one day with a value. Each shows " + OUTLINE + " instead of a trend line.",
  "The headlines and supporting lines are unchanged by the outline: Billing Efficiency 85.71% with \"3.00 Invoiced / 3.50 Clocked\", Technician Efficiency 71.43% with \"2.50 Invoiced Tech Hrs / 3.50 Clocked\", Technician Utilization 100.00% with \"3.50 WO Hrs / 3.50 Clocked\"."],
 src([4], "Story 4", "Design canvas board 15_Empty_Design (row 15)."),
 q("S4-R12", "S4-R18"), HOLD_BUILT, "S4-R12 (fewer than two points with a value) and S4-R18 (headline and supporting line keep their figures).")

new("NEW-A3", 12170, "Revenue of $0.00 keeps its headline above an empty chart outline",
 number([SIGNIN, DESKTOP] + EMPTY_WP),
 steps("Open the dashboard with ZZAUTOTEST Empty Shop selected (Revenue on This Month).",
  "Read the Revenue headline and supporting line.",
  "Look at the trend-line area of the Revenue tile.",
  "Click View details on the Revenue tile and look at the Revenue chart that opens."),
 ["The headline stays \"$0.00\", a real zero, and the supporting line stays \"0 Invoices\".",
  "Every day's revenue is zero, so instead of a flat line along the bottom the tile shows " + OUTLINE + ", under the $0.00 headline.",
  "The full Revenue chart in the expanded panel looks as before (axis and month labels with no bars). It does not turn into the outline."],
 src([4], "Story 4", "Design canvas boards 15_Empty_Design and 15_Empty_Now (row 15); board 04_Revenue_After for the expanded chart."),
 q("S4-E2", "S4-R13", "S4-R18") + cq("S4 context note (expanded charts)"), HOLD_BUILT,
 "S4-E2 (real zero keeps $0.00), S4-R13 (every point zero) and S4-R18; also the context note that expanded charts are unchanged.")

new("NEW-A4", 12170, "Revenue with sales on one day only still draws its trend line",
 number([SIGNIN, DESKTOP, DASH_SHORT] + DASH[1:] + ["Run this case on any day except the 1st of the month (on the 1st, This Month has only one day)."]),
 steps("Pick ZZAUTOTEST Dash Shop in the workplace selector and open the dashboard (Revenue on This Month).",
  "Look at the Revenue tile's trend-line area."),
 ["The Revenue tile draws its trend line, flat at zero on the other days and rising to today's $510.00, because not every day is zero.",
  "It does not show the dashed empty-chart outline."],
 src([4], "Story 4", "Design canvas board 15_Empty_Design (row 15)."),
 q("S4-E3"), HOLD_BUILT, "S4-E3 (every point zero except one shows the sparkline).")

new("NEW-A5", 12170, "The empty chart outline keeps the tile the same height",
 number([SIGNIN, DESKTOP, DASH_SHORT] + DASH[1:] + ["Run it on any day except the 1st of the month."]),
 steps("Pick ZZAUTOTEST Dash Shop and open the dashboard (all tiles on This Month).",
  "Compare the Revenue tile (trend line drawn) with the Billing Efficiency tile next to it (empty-chart outline).",
  "Compare the top and bottom edges of the four tiles in the top row, and where each \"View details\" sits."),
 ["The outline fills the same band of the tile as the Revenue trend line: same top, same bottom.",
  "All four top tiles are the same height and their \"View details\" links line up. The tile with the outline has not shrunk or grown."],
 src([4], "Story 4", "Design canvas board 15_Empty_Design (row 15)."),
 q("S4-R14"), HOLD_BUILT, "S4-R14 (same space as the sparkline, tile keeps its height).")

new("NEW-A6", 12170, "The empty chart outline is a grey dashed box with a chart icon",
 number([SIGNIN, DESKTOP] + EMPTY_WP),
 steps("Open the dashboard with ZZAUTOTEST Empty Shop selected.",
  "Look closely at the empty-chart outline on the Billing Efficiency tile.",
  "Switch the app to the dark theme (if the build offers a theme switch in the user menu at the top right) and look again."),
 ["The outline is a light grey dashed line with rounded corners.",
  "The inside of the outline has no fill: the tile's own background shows through it (white in light theme, the dark tile colour in dark theme).",
  "A grey line-chart icon sits at the centre of the outline."],
 src([4], "Story 4", "Design canvas board 15_Empty_Design (row 15)."),
 q("S4-R15", "S4-R16"), HOLD_BUILT, "S4-R15 (light grey dashed, rounded, no fill) and S4-R16 (grey line-chart icon at centre).")

new("NEW-A7", 12170, "A screen reader reads the empty chart outline as No data to chart",
 number([SIGNIN, DESKTOP] + EMPTY_WP + [
  "This case needs a screen reader. On a Mac use VoiceOver, which is built in: press Command + F5 to turn it on or off. On Windows use NVDA (free from nvaccess.org): install it, start it with Ctrl + Alt + N, and stop it with Insert + Q."]),
 steps("Open the dashboard with ZZAUTOTEST Empty Shop selected.",
  "Turn the screen reader on.",
  "Move through the Billing Efficiency tile one item at a time: on a Mac press Control + Option + Right Arrow, on Windows with NVDA press the Down Arrow.",
  "Listen to what is read when you reach the empty-chart outline.",
  "Do the same on the Revenue tile.",
  "Turn the screen reader off."),
 ["When you reach the outline, the screen reader says \"No data to chart\" (on both tiles).",
  "It does not read the outline as an unlabelled image, a graphic or nothing at all."],
 src([4], "Story 4", "The design board shows the outline only as a picture; the spoken text comes from the PRD alone."),
 q("S4-R17"), HOLD_BUILT, "S4-R17 (screen reader reads \"No data to chart\").")

new("NEW-A8", 12170, "A tile still loading shows the loading placeholder, not the chart outline",
 number([SIGNIN, DESKTOP] + EMPTY_WP),
 steps("Open the dashboard with ZZAUTOTEST Empty Shop selected.",
  "Press the browser's reload button and watch the six tiles while the page loads.",
  "On the Revenue tile, open the range pill, pick Last Year and watch the Revenue tile straight away.",
  "Wait until every tile has finished loading and look at the trend-line areas again."),
 ["While a tile is still loading, it shows the loading placeholder in place of its headline, supporting line and trend line. Its name and range pill stay readable. It does not show the dashed outline with the chart icon, and it never shows the previous range's figure.",
  "Only once the tile has loaded, and has nothing to plot, does the dashed outline with the chart icon appear.",
  "If loading is too quick to see, write 'loading state not seen' in the result comment and pass or fail on the last result."],
 src([4, 6], "Story 4 (context note to S4-R12 to S4-E3) and Story 6", "Design canvas board 15_Empty_Design note: \"A tile still loading shows the loading placeholder, not this one.\""),
 cq("S4 context note (loading)") + q("S6-R14"), HOLD_BUILT,
 "Story 4 context note (loading placeholder is not the empty-chart placeholder) with S6-R14; board 15 note.")

# =========================== S5 ===========================
upd(88608, "Sales by Customer tile counts customers and names the top one",
 number([SIGNIN, DESKTOP,
  "Seed a workplace with exactly one customer sold to: Settings > Locations > add a new location (e.g. \"ZZAUTOTEST One Customer Shop\") > save, give your user access, pick it in the workplace selector. Then Customers > New Customer (e.g. \"ZZAUTOTEST Solo Fleet\") > Work Orders > New Work Order for it > a labor line (e.g. 1.00 hour at $100.00) > approve > Review > Finance > Create Invoice (do not pay).",
  DASH_SHORT] + DASH[1:]),
 steps("Pick ZZAUTOTEST One Customer Shop and open the dashboard.",
  "Read the Sales by Customer headline and supporting line.",
  "Pick ZZAUTOTEST Dash Shop in the workplace selector.",
  "Read the Sales by Customer headline and supporting line.",
  "Set the tile back to Last 12 Months and look at the trend line.",
  "Hover the arrow icon beside \"Sales by Customer\".",
  "Click the arrow icon."),
 ["In ZZAUTOTEST One Customer Shop the headline reads \"1 customer\" (singular) and the supporting line reads \"Top: ZZAUTOTEST Solo Fleet\".",
  "In ZZAUTOTEST Dash Shop the headline reads \"2 customers\": distinct customers with sales in the range, each counted once.",
  "The supporting line reads \"Top: \" followed by a customer name with sales in the range (e.g. \"Top: ZZAUTOTEST Bravo Fleet\"). Write down which name shows.",
  "The tile has its own range pill. It opens on Last 12 Months and changing it changes only this tile.",
  "On Last 12 Months the trend line has one point per month. Only the current month is above zero (2 customers), so the headline and trend line cover the same window.",
  "Hovering the arrow names the Sales By Customer report. Clicking it opens the Sales By Customer report."],
 src([5], "Story 5", "Design canvas boards 01_Opens_After and 08_Customers_After (rows 1 and 8).", last=True),
 q("S5-R1", "S5-R2", "S5-R3", "S5-R4", "S5-R5", "S5-R6"), READY,
 "Placeholders replaced by two seeded workplaces (one customer, then two) with exact headlines; the report link is described as the arrow icon; the 'Top' line asks the tester to record the name, since v42 does not say how the top customer is chosen (raised in notes); quotes re-read from v42 (unchanged).")

upd(88609, "At Risk Customers tile updates when the inactivity window changes",
 number([SIGNIN, DESKTOP, PRIVATE,
  "In the workplace selector in the top bar, pick a workplace with customers who have not been invoiced for a while (on the QA environment, the \"QA Testing\" data).",
  "Test data: the automated version of this case seeds its own customer with one invoice about 90 days old and nothing since. A manual tester uses the existing customers: at least one customer must show in the At Risk table at 60 days whose Last Invoice Date is between 60 and 119 days ago."]),
 steps("Open the dashboard and look at the At Risk Customers tile's window pill.",
  "Click the window pill and read the options.",
  "Close the menu and read the headline and the supporting line.",
  "Click View details on At Risk Customers, count the table rows (all pages) and read their Last Invoice Date values.",
  "Open the window pill and pick 60 days.",
  "Read the headline, the supporting line, the trend line and the table again.",
  "Try each of 30, 90 and 180 days the same way, noting for each the headline and the end of the supporting line."),
 ["In a fresh browser the pill reads \"120 Days\".",
  "The menu offers 30, 60, 90, 120 and 180 days (shown as \"30 days\" … \"180 days\"), in that order, with 120 ticked.",
  "The headline is a plain number (e.g. \"1\"), with no \"$\" and no word after it, and it equals the number of rows in the table.",
  "Wherever the headline is exactly 1, the supporting line reads a dollar amount, \"(12mo) · \" and that customer's name (e.g. \"$40.50 (12mo) · Ruline Partners\").",
  "Wherever the headline is 2 or more, the supporting line reads a dollar amount, \"(12mo) · \", the count and the word customers (e.g. \"$1,250.00 (12mo) · 3 customers\").",
  "Changing the window updates the headline, the supporting line, the trend line and the open table together. At 60 days the customers last invoiced 60 to 119 days ago are added, so the count goes up.",
  "If no window gives exactly one at-risk customer with this data, write 'one-customer wording not seen' in the result comment and pass or fail on the rest."],
 src([5], "Story 5", "Design canvas boards 09_AtRisk_Window and 09_AtRisk_After (row 9).", last=True),
 q("S5-R7", "S5-R8", "S5-R9", "S5-R10", "S5-R11", "S5-R12"), READY,
 "AUTOMATED CASE (tell Vlad): all six checks kept (plain-number headline, one-customer line, many-customer line, 30/60/90/120/180 options, 120 default, everything updates on change); the automation's seeding (one invoice ~90 days old, cleared browser storage keys) is stated as such and a manual equivalent added (private window, existing customers last invoiced 60-119 days ago); placeholders replaced by example wording; steps one action per line; quotes re-read from v42 (unchanged).")

upd(88610, "At Risk count, its twelve-month trend line and the remembered window",
 number([SIGNIN, DESKTOP,
  "In the workplace selector pick a workplace with at-risk customers (on the QA environment, \"QA Testing\").",
  "On the dashboard, click View details on At Risk Customers and find two at-risk customers whose invoices are inside the last twelve months:",
  "↳ Customer A: Lifetime Invoices 1, with a parts-only invoice (e.g. Revenue (12 Mo) $40.50).",
  "↳ Customer B: Lifetime Invoices 2 or more.",
  "Write down both names and the At Risk headline. A tester cannot back-date invoices, so if no such customers exist, ask for a seeded workplace before running."]),
 steps("Count the points on the At Risk trend line and compare its last point with the headline.",
  "On Customer A's invoice (Customers > Customer A > its work order > Finance tab > invoice three-dot menu > Issue Credit), credit every part on it and submit.",
  "Reload the dashboard and read the At Risk headline. Look for Customer A in the table.",
  "Credit every part on Customer B's latest invoice the same way.",
  "Reload the dashboard and look for Customer B in the table.",
  "Change the window pill to 60 days.",
  "Close the browser tab, open the site again in the same browser and open the dashboard.",
  "Open the dashboard in a private window.",
  "Change your computer's time zone to one several hours away (computer settings > Date & Time), reload the dashboard and read the At Risk headline. Then set the time zone back."),
 ["The trend line has twelve points, one per month over the last twelve months. Its last point sits at the same level as the headline. Exact point values cannot be read off the trend line by hand: write 'point values not read' in the result comment.",
  "After Customer A's twelve-month revenue drops to $0.00 (one lifetime invoice, no revenue above $0.00), Customer A is no longer at risk. The headline goes down by 1 and they leave the table.",
  "Customer B stays in the table after their twelve-month revenue drops to $0.00, because they still have two or more lifetime invoices.",
  "Back in the same browser, the pill still reads 60 days (remembered). In the private window it reads 120 Days (the default), because the choice is kept only in the browser where it was made.",
  "Changing the computer's time zone does not change the At Risk headline: days are counted in the shop's own time zone.",
  "That the count changes at the shop's own midnight cannot be checked by hand; write 'midnight change not checked by hand' in the result comment."],
 src([5, 6], "Story 5 and Story 6 (S6-R16)", "Design canvas boards 09_AtRisk_Window and 09_AtRisk_After (row 9).", last=True),
 q("S5-R13", "S5-R14", "S5-R15") + cq("Terminology (at-risk customer)"), READY,
 "Steps now make the 'revenue above $0.00' rule testable by crediting an at-risk customer's only invoice (they leave) against a two-invoice customer (they stay); remembered window checked in the same browser vs a private window; time-zone rule checked by changing the computer's time zone; parts a tester cannot see are marked to note in the result; quotes re-read from v42 (unchanged).")

upd(88611, "Count tiles show 0 when there is nothing to count",
 number([SIGNIN, DESKTOP] + EMPTY_WP + [
  "For the walk-in part, seed a workplace (Settings > Locations > add a new location, e.g. \"ZZAUTOTEST Walk-in Shop\", give your user access) and in it make two sales with no customer: Parts > Part Sales > New Part Sale, leave the customer empty (walk-in), add a part (e.g. Sell Price $25.00), and invoice it. Do this twice. If the build does not allow a sale with no customer, write 'walk-in sale could not be created' in the result comment and skip the last result."]),
 steps("Open the dashboard with ZZAUTOTEST Empty Shop selected.",
  "Look at Sales by Customer and At Risk Customers for any up/down arrow or change figure.",
  "Look beside the At Risk Customers title for an arrow icon or report link.",
  "Read the Sales by Customer headline (Last 12 Months).",
  "Read the At Risk Customers headline (120 Days).",
  "Pick ZZAUTOTEST Walk-in Shop and read the Sales by Customer headline. Then click View details on the tile."),
 ["Neither count tile shows a change indicator. The trend line is the only comparison.",
  "At Risk Customers has no arrow icon or report link.",
  "Sales by Customer reads \"0 customers\" (no sales in the range).",
  "At Risk Customers reads \"0\" (nobody at risk).",
  "In ZZAUTOTEST Walk-in Shop the two walk-in sales are counted together as one \"no company\" customer: the headline reads \"1 customer\", not 2, and the table shows a single no-company row with 2 invoices."],
 src([5], "Story 5", "Design canvas board 15_Empty_Design (row 15) shows \"0 customers\" and \"0\".", last=True),
 q("S5-N1", "S5-N2", "S5-E1", "S5-E2", "S5-E3") + cq("S5-E3 context note"), READY,
 "Preconditions now seed an empty workplace and two walk-in (no customer) part sales with click-paths; results give the exact on-screen readings (\"0 customers\", \"0\", count up by one); quotes re-read from v42 (unchanged) plus the S5-E3 context note that QA must create the no-company case.")

upd(88630, "At Risk revenue figure covers every at-risk customer",
 number([SIGNIN, DESKTOP,
  "In the workplace selector pick a workplace where at least two customers are at risk on some window (on the QA environment, \"QA Testing\"; try 30 days)."]),
 steps("Open the dashboard and set the At Risk window to one where the headline is 2 or more.",
  "Read the supporting line's \"$… (12mo)\" amount and customer count.",
  "Click View details on At Risk Customers.",
  "Add up the Revenue (12 Mo) column over every row, on every page of the table."),
 ["The supporting line reads a dollar total, \"(12mo) · \", the count and the word customers (e.g. \"$1,250.00 (12mo) · 3 customers\"), and the count equals the headline.",
  "The $ amount equals the sum of Revenue (12 Mo) over all at-risk customers, every row on every page (e.g. $40.50 + $1,209.50 = $1,250.00). It is not the sum of the first page only.",
  "If the table ever stops at 500 rows (it then says \"Showing 500 of N at-risk customers\"), the $ amount still covers all N customers. This cannot be reached by hand on normal data; write 'cap not reached' in the result comment."],
 src([5, 6], "Story 5 (context note on the At Risk supporting line) and Story 6 (S6-R8)", "Also the Technical Implementation Plan (2026-09-16), FR-016 and the response contract, which add that the total is never a sum of the displayed rows.", last=True),
 cq("S5 context note (At Risk revenue)") + q("S5-R9", "S6-R8"), READY,
 "Quotes now come from the PRD v42 (the At Risk context note, S5-R9, S6-R8) instead of the tech plan, which is cited in the Source line only; steps one action per line with a worked sum; the unreachable 500-row cap is marked for the result comment.")

new("NEW-A9", 12171, "Sales by Customer and At Risk at zero show an empty chart outline",
 number([SIGNIN, DESKTOP] + EMPTY_WP),
 steps("Open the dashboard with ZZAUTOTEST Empty Shop selected (Sales by Customer on Last 12 Months, At Risk on 120 Days).",
  "Read both headlines and their supporting lines.",
  "Look at the trend-line area of both tiles."),
 ["Sales by Customer keeps its real-zero headline \"0 customers\" and At Risk Customers keeps \"0\".",
  "Every month is zero, so instead of a flat line along the bottom each tile shows a dashed outline with a small line-chart icon in its middle, under the headline.",
  "The supporting lines do not change because of the outline (the approved design shows \"$0.00 (12mo) · 0 customers\" on At Risk and no line on Sales by Customer). Write down what you see."],
 src([5, 4], "Story 5 (S5-R16), which applies Story 4's S4-R12 to S4-R18, S4-E2 and S4-E3", "Design canvas boards 15_Empty_Design and 15_Empty_Now (row 15)."),
 q("S5-R16", "S4-R13", "S4-E2"), HOLD_BUILT, "S5-R16 (count tiles follow the empty-chart rules), with S4-R13 and S4-E2 applied to the count tiles.")

new("NEW-A10", 12171, "Sales by Customer with sales in one month only still draws its trend line",
 number([SIGNIN, DESKTOP, DASH_SHORT] + DASH[1:]),
 steps("Pick ZZAUTOTEST Dash Shop and open the dashboard (Sales by Customer on Last 12 Months).",
  "Look at the Sales by Customer trend-line area."),
 ["The trend line is drawn, flat at zero for eleven months and rising to 2 in the current month, because not every month is zero.",
  "It does not show the dashed empty-chart outline."],
 src([5, 4], "Story 5 (S5-R16), applying S4-E3", "Design canvas board 15_Empty_Design (row 15)."),
 q("S5-R16", "S4-E3"), HOLD_BUILT, "S5-R16 applied to S4-E3 on a count tile (one non-zero month keeps the sparkline).")

# =========================== S6 ===========================
upd(88612, "View details opens each tile's own chart and table",
 number([SIGNIN, DESKTOP, PRIVATE, BUSY_WP,
  "Test data: the automated version of this case seeds its own invoiced work order this month with a technician's closed clock hours on its labor line. A manual tester uses the busy workplace above, or the ZZAUTOTEST Dash Shop data set."]),
 steps("Open the dashboard and look at the foot of each of the six tiles.",
  "Set every tile's range pill to Last 12 Months.",
  "Click View details on Revenue and look at what opens.",
  "Click View details on Billing Efficiency.",
  "Click View details on Technician Efficiency.",
  "Click View details on Technician Utilization.",
  "Click View details on Sales by Customer."),
 ["Every tile has a \"View details\" link with a small down-arrow at its foot.",
  "Each click opens a detail panel directly under that tile's row, with a pointer to the tile, and the arrow on that tile flips to point up.",
  "Revenue opens the Revenue chart only (monthly bars, e.g. Oct 2025 to Sep 2026).",
  "Billing Efficiency opens the Billing Efficiency chart (one line per advisor, with an Advisor filter) and, under it, the Advisor Analysis table.",
  "Technician Efficiency opens the Technician Efficiency chart (one line per technician, with a \"Technician: All technicians\" filter) and the Technician Efficiency table.",
  "Technician Utilization opens the Technician Utilization chart and the Technician Utilization table.",
  "Sales by Customer opens the Sales by Customer table only.",
  "Each panel shows that tile's own detail: a chart, a table, or both, as listed above."],
 src([6], "Story 6", "Design canvas boards 04_Revenue_After, 05_Billing_After, 06_TechEff_After, 07_TechUtil_After and 08_Customers_After (rows 4 to 8).", last=True),
 q("S6-R1", "S6-R2", "S6-R3", "S6-R4", "S6-R5", "S6-R6", "S6-R7"), READY,
 "AUTOMATED CASE (tell Vlad): all seven checks kept (View details on each tile, reveals detail, and each tile's exact contents: Revenue chart; Billing Efficiency chart + Advisor Analysis table; Technician Efficiency chart + table; Technician Utilization chart + table; Sales by Customer table); automation seeding stated as such with a manual equivalent; a private window stands in for 'no stored expanded tile'; steps one click per line; results add the on-screen details the design boards show (panel under the row, arrow flips, filter names).")

upd(88613, "At Risk table lists customers by 12-month revenue, highest first",
 number([SIGNIN, DESKTOP,
  "In the workplace selector pick a workplace with several at-risk customers (on the QA environment, \"QA Testing\"; use the window that gives the most rows, e.g. 30 days)."]),
 steps("Open the dashboard, set the At Risk window and read the headline.",
  "Click View details on At Risk Customers.",
  "Read the Revenue (12 Mo) column from top to bottom, on every page.",
  "Look for two customers with the same Revenue (12 Mo) and check their order by name.",
  "Count the rows in the table (all pages)."),
 ["The table is ordered by Revenue (12 Mo), highest first (e.g. $1,209.50 above $40.50).",
  "Customers with the same amount are listed by name, A to Z.",
  "The number of rows equals the headline: every at-risk customer is listed and none is silently left out.",
  "If a workplace ever has more than 500 at-risk customers, the table shows the first 500 in that order and says \"Showing 500 of N at-risk customers\", while the headline still counts all N. This cannot be reached by hand on normal data; write 'cap not reached' in the result comment."],
 src([6], "Story 6", "Design canvas board 09_AtRisk_After (row 9) for the table columns.", last=True),
 q("S6-R8"), READY,
 "Steps now say how to read the order and the tie-break and to count the rows against the headline; the unreachable 500-row cap is marked for the result comment; quotes re-read from v42 (unchanged).")

upd(88614, "Only one tile's details are open at a time",
 number([SIGNIN, DESKTOP, BUSY_WP]),
 steps("Open the dashboard and click View details on Revenue.",
  "Click View details on Technician Efficiency.",
  "Click View details on At Risk Customers.",
  "Click the tile's name, headline and trend line on Billing Efficiency.",
  "Click the range pill on Revenue, then click away to close its menu.",
  "Click the window pill on At Risk Customers, then click away.",
  "Hover the arrow icon beside \"Sales by Customer\", then click it, and go back to the dashboard.",
  "Click View details on the open tile again."),
 ["Only one detail panel is open at any moment.",
  "Opening Technician Efficiency closes the Revenue panel. Opening At Risk closes the Technician Efficiency panel.",
  "Clicking a tile's name, headline or trend line does not open or close anything. Only \"View details\" does.",
  "Opening a range pill or the At Risk window pill does not open the tile's details.",
  "Clicking the report arrow opens the report and does not open the tile's details.",
  "Clicking \"View details\" on the open tile closes its panel."],
 src([6], "Story 6", "Design canvas boards 04 to 09 *_After (rows 4 to 9).", last=True),
 q("S6-R9", "S6-R10", "S6-R11", "S6-R12", "S6-R13") + cq("S6 context note (one panel)"), READY,
 "Steps now spell out each click (other tile, tile body, range pill, window pill, report arrow, closing again); results one per line; quotes re-read from v42 (unchanged).")

upd(88615, "Tiles load on their own and remember choices in this browser",
 number([SIGNIN, DESKTOP, BUSY_WP,
  "Have a second browser on the same computer (e.g. Chrome and Firefox), or use a private window."]),
 steps("Open the dashboard and watch the tiles while they load.",
  "On the Revenue tile change the range pill to Last Year and watch the tile straight away.",
  "Click View details on Technician Utilization.",
  "In its chart, open the \"Technician: All technicians\" filter and untick all but one technician.",
  "Set the At Risk window to 60 days.",
  "Open Reports > Sales and click Hide Chart above the report table.",
  "Close the tab, open the site again in the same browser and open the dashboard, then Reports > Sales.",
  "Open the dashboard and Reports > Sales in the second browser (or a private window).",
  "In the first browser clear the site's data (browser settings > privacy > clear browsing data for this site), sign in again and open the dashboard."),
 ["While loading, each tile shows a placeholder in place of its headline, supporting line and trend line. Its name and pills stay readable. No tile is ever blank and no tile shows the old range's figure while the new one loads. If loading is too quick to see, write 'loading state not seen' in the result comment.",
  "The tiles appear one by one as each finishes. No toast or pop-up message appears.",
  "A tile whose figures cannot be loaded shows that it could not load while the other five still show their figures. There is no way to make one tile fail by hand: " + NOT_BY_HAND + ".",
  "Back in the same browser, the Technician Utilization panel is still open, the one-technician filter is kept, At Risk still reads 60 days and the Sales report's chart is still hidden.",
  "In the second browser or private window, all of these are back to their defaults: no tile open, all technicians, 120 Days, chart shown. They are not part of the user's account.",
  "After clearing the site's data, every one of them is back to its default."],
 src([6], "Story 6", "Design canvas board 10_sales_Hidden (row 10) for Hide Chart.", last=True),
 q("S6-R14", "S6-R15", "S6-R16"), READY,
 "Steps now set each remembered choice by name (expanded tile, technician filter, At Risk window, report Hide Chart) and compare same browser, other browser and cleared data; the one-tile-fails part is marked not checkable by hand; note: the earlier 'mentions n/a' flag was a false match on 'technician/advisor', nothing about n/a was in this case; quotes re-read from v42 (unchanged).")

upd(88616, "On a small screen tiles show View Report instead of View details",
 number([SIGNIN, BUSY_WP,
  "Have a small screen: a phone, a tablet held upright, or a desktop browser window made narrower than 1024 pixels (the tiles stack into one column once it is narrow enough).",
  "Also have a desktop window at least 1024 pixels wide."]),
 steps("On the desktop window, look over the whole dashboard for an \"expand all\", \"collapse all\" or view-style (panel or inline) control.",
  "Open the dashboard on the small screen.",
  "Look at the foot of each of the six tiles.",
  "Tap \"View Report\" on the Revenue tile, then go back.",
  "Tap the Revenue tile's body (name, headline, trend line).",
  "Look at the foot of the At Risk Customers tile."),
 ["There is no \"expand all\" or \"collapse all\" control and no choice between a panel view and an inline view.",
  "On the small screen the tiles stack in one column and none can be opened in place: tapping a tile's body opens nothing.",
  "The five tiles other than At Risk show a \"View Report\" link (with a small arrow icon) at their foot instead of \"View details\". Tapping it opens that tile's full report (Revenue opens the Sales report).",
  "At Risk Customers has no link at its foot. Its detail table can only be opened on a desktop-width screen."],
 src([6], "Story 6", "Design canvas board 14_Phone_After (row 14, 390 pixels wide).", last=True),
 q("S6-N1", "S6-N2", "S6-E1", "S6-E2", "S6-E3") + cq("Terminology (small screen)"), READY,
 "Small screen explained in plain words (phone, upright tablet, or narrow window); steps one action per line including a tap on the tile body; results add the design's 'View Report' footer details; quotes re-read from v42 (unchanged).")

upd(88627, "Expanded KPI tables show the expected columns",
 number([SIGNIN, DESKTOP, BUSY_WP]),
 steps("Open the dashboard and set Billing Efficiency, Technician Efficiency and Technician Utilization to Last 12 Months.",
  "Click View details on Billing Efficiency and read the table title and column headings.",
  "Click View details on Technician Efficiency and read the table title, column headings and the pager under the table.",
  "Click View details on Technician Utilization and read the table title and column headings."),
 ["Billing Efficiency: a table titled \"Advisor Analysis\" under the chart, with columns Advisor, Worked Hours, Invoiced Hrs, Billing Efficiency, ELR.",
  "Technician Efficiency: a table titled \"Technician Efficiency\" with columns Tech, Clocked Hrs, Invoiced Tech Hrs, Efficiency. It shows ten rows a page with a pager such as \"1 - 10 of 13\".",
  "Technician Utilization: a table titled \"Technician Utilization\" with columns Tech, WO Hours, Internal Hours, Total Hours, Utilization %.",
  "Each table sits in the one full-width panel under the top row, below its chart."],
 src([6], "Story 6 (S6-R4 to S6-R6)", "Column names and the pager come from the design canvas boards 05_Billing_After, 06_TechEff_After and 07_TechUtil_After (rows 5 to 7, screenshots of build SV-8311 captured 2026-09-28), which replace the retired 'Dashboard Directions' design.", last=True),
 q("S6-R4", "S6-R5", "S6-R6"), READY,
 "Re-sourced from the retired 'ShopView Dashboard Directions' design to the canvas boards 05/06/07 *_After; quotes now come from the PRD (S6-R4 to S6-R6) with column names cited to the boards; the 'matching report's own table' claim was dropped (no source sentence); the Technician Efficiency pager added from board 06; steps one action per line.")

upd(88628, "Expanded Sales by Customer and At Risk tables show the expected columns",
 number([SIGNIN, DESKTOP, BUSY_WP]),
 steps("Open the dashboard and click View details on Sales by Customer (Last 12 Months).",
  "Read the table title, column headings and the pager under the table.",
  "Click the pager's next arrow.",
  "Click View details on At Risk Customers.",
  "Read the panel title, the control at its top right and the column headings."),
 ["Sales by Customer: a table titled \"Sales by Customer\" with columns Customer, Invoices, Labor Delta, Subtotal, ten rows a page and a pager such as \"1 - 10 of 15\". The next arrow shows the next ten. Customer names show as links.",
  "At Risk Customers: a table titled \"At Risk Customers\" with columns Customer, Last Invoice Date, Lifetime Invoices, Revenue (12 Mo). There is no \"Last Work (Days)\" column, and an \"Inactive for\" window select (e.g. \"120 Days\") sits at the panel's top right."],
 src([6], "Story 6 (S6-R7, S6-R8)", "Column names, pager and the \"Inactive for\" select come from the design canvas boards 08_Customers_After and 09_AtRisk_After (rows 8 and 9, screenshots of build SV-8311 captured 2026-09-28), which replace the retired 'Dashboard Directions' design.", last=True),
 q("S6-R7", "S6-R8"), READY,
 "Re-sourced from the retired 'Dashboard Directions' design to canvas boards 08_Customers_After and 09_AtRisk_After; quotes now from the PRD (S6-R7, S6-R8) with columns cited to the boards; added the board's pager, customer links and the panel's 'Inactive for' select; steps one action per line.")

# ---------------- notes ----------------
NOTES = [
 "DESIGN VS SPEC: the report link is built as an arrow (external-link) icon beside the tile name (boards 01/02 After); the PRD says 'report link'. Cases describe the icon and follow the PRD (opens the matching report, tooltip names it).",
 "DESIGN VS SPEC: on the At Risk tile the window pill reads '120 Days' while its menu items read '30 days' ... '180 days' (lower-case 'days', board 09_AtRisk_Window). PRD: '30, 60, 90, 120, and 180 days'. Cases list both and do not pass or fail on capitalisation.",
 "DESIGN VS SPEC / QUESTION: the expanded At Risk panel has a second 'Inactive for' select (board 09_AtRisk_After) besides the tile's pill. The PRD names one inactivity-window control. PO question: are both meant to exist, and must they stay in step?",
 "QUESTION FOR PO: with 0 customers in range, the approved design (board 15) shows no supporting line on Sales by Customer. PRD S5-R3 gives only 'Top: {top customer name}' and does not cover zero customers.",
 "QUESTION FOR PO: with nobody at risk, the approved design shows '$0.00 (12mo) · 0 customers'. PRD S5-R8 and S5-R9 cover exactly one and more than one only. NEW-A9 asks the tester to write down what shows.",
 "QUESTION FOR PO: PRD S5-R3 does not say how the 'Top' customer is chosen (by sales subtotal, invoice count or something else). C88608 asks the tester to record the name and does not assert which customer.",
 "QUESTION FOR PO: PRD Terminology defines worked hours as 'clocked hours', meaning all time records. The tech plan section 9 says Service Advisor Analysis worked hours are clock records on those work orders. It is therefore unclear whether internal (non work order) hours count in Billing Efficiency's 'Clocked' and Technician Efficiency's 'Clocked'. C88602 and C88605 avoid this by reading Billing and Technician Efficiency before any internal time is clocked, then adding 0.50 internal hours only to read Technician Utilization, and removing it again afterwards.",
 "TECH PLAN IS OLDER THAN v42 (informs, never overrules): the tech plan (2026-09-16) still says a ratio with nothing to divide by reads 'n/a', and still gates the dashboard on the DashboardAdministrator organisation feature as well as the Reports permission. v42 replaces both: a grey '-' (S3-E3) and the Reports permission only (S1-R6). Cases follow v42.",
 "BUILD TODAY VS APPROVED DESIGN: board 15_Empty_Now shows the current build reading 'n/a' with no trend line, and a flat line along the bottom on zero tiles. C88603, C88606 and NEW-A1 to NEW-A10 are therefore expected to fail on the current build until row 15 is built, and are marked 'AUTOMATION: HOLD - not yet built (approved design 7 Oct 2026)'.",
 "S4-R17 'No data to chart' exists only in the PRD. Board 15 is a picture with no spoken label, so NEW-A7 relies on the PRD alone and tells the tester how to turn on VoiceOver (Command + F5) or NVDA (Ctrl + Alt + N).",
 "NOT REACHABLE BY HAND, marked in the case for the result comment: S1-R7 (server refusal), S1-N9 (analytics), S6-R15 (one tile failing; the tech plan says there is no way to fail one section, covered by a component test), the 500-row At Risk cap (S6-R8; also C88630), the At Risk midnight change (S5-R15), reading individual trend-line point values (S5-R13), and possibly S1-E2 (no workplace selected may not be reachable in the UI).",
 "TEST DATA A MANUAL TESTER CANNOT CREATE: At Risk cases (C88609, C88610, C88613, C88630, NEW-A12 part 2) need customers whose last invoice is months old, and invoices cannot be back-dated by hand. The cases use existing QA-environment customers with a stated fallback. Recommend preparing a seeded At Risk workplace for testers (or using the automation's seeding).",
 "UI LABELS TO CONFIRM ON THE BUILD (taken from the playbook or other projects, not from Dashboard boards): Settings > Locations 'add a new location'; the work order 'Time Sheets' tab and Reports > Timesheet Activities for setting exact clock times; the line's 'technician time' field as distinct from billed labor hours; 'Clock In' in the top bar for department (internal) time; walk-in Part Sales with no customer. If any differs, only the click-path wording changes, not the expectation.",
 "VOID BY HAND (NEW-A12): per tech plan section 7, an invoice becomes void only when a line is added while it is still pending (unpaid and unsent). Reversing an invoice deletes it instead, and adding a line to a sent or paid invoice splits the work order. The case follows that.",
 "SPLIT: C88603 used to hold S3-E1, S3-E2 and S3-E3. It now holds only S3-E3 (the changed grey '-'). S3-E1 and S3-E2 moved to NEW-A11 and NEW-A12 in section 12169 so each case checks one thing. The other existing cases keep their anchor groups (titles reworded to one behaviour) to keep their TestRail history.",
 "QUOTES: copied from the v42 file. Markdown emphasis markers (**) are removed because they are formatting, not words; every quote was checked as a verbatim substring of the file with only those markers removed. S3-R2 is quoted as the requirement sentence plus each table row verbatim ('Measure | Calculation | Matching report'). C88630 now quotes the PRD instead of the tech plan.",
 "AUTOMATED CASES C88594, C88609, C88612 (tell Vlad): every check kept; preconditions now say what the automation seeds and give a manual equivalent; details in each change_summary.",
 "DESIGN-ONLY DETAILS ADDED (Rule 115, cited to boards): the panel opens under the tile's row with a pointer and the View details arrow flips (boards 04-08); table columns and pagers (05-09); 'Inactive for' select (09); View Report footer with icon on phones (14); '0.00 Invoiced / 0.00 Clocked' style supporting lines and '0 Invoices' at zero (15); calendar footer 'Range: N days' used in C88606 (03). The 'Last updated: just now' footer (boards 01/02) is in no PRD requirement and is not tested.",
]

# coverage
ANCH_S16 = [a for a in A if re.match(r"S[1-6]-", a)]
cov = {}
for c in U:
    for k, _ in c["quotes"]:
        if k in A: cov.setdefault(k, []).append("C%d" % c["case_id"])
for c in N:
    for k, _ in c["quotes"]:
        if k in A: cov.setdefault(k, []).append(c["key"])
covered = {a: cov.get(a, []) for a in ANCH_S16}
missing = [a for a, v in covered.items() if not v]

import os
def sz(p): return os.path.getsize(p)
RC = ("PRD v42 sources/CONFLUENCE-788430850-Dashboard-v1-2026-10-07-v42.md — %d bytes, lines 1-675 — read 100%%; "
      "design-drive/BOARDS-TEXT.md — %d bytes, lines 1-396 — read 100%%; "
      "sources/Dashboard-v1-Technical-Implementation-Plan.md — %d bytes, lines 1-828 — read 100%%; "
      "26 snapshots-before/C*.json for my share — read 100%% (rendered as text); "
      "canvas screenshots opened: after-empty-tiles, before-empty-tiles, after-dash-default, after-dash, after-phone, after-riskmenu, after-datemenu, after-open-revenueKpi, after-open-billingEfficiencyKpi, after-open-techEfficiencyKpi, after-open-techUtilizationKpi, after-open-salesByCustomer, after-open-atRiskHero (13, all S1-S6 relevant after-* plus both row-15 images); 15_Empty_Design.dc.html inspected (it is an image board, no spoken label); "
      "skills/IDEAL-TEST-CASE-STANDARD.md and the C154586 example — read 100%%; rules/RULES-61-96.md lines 2391-2760 (Rules 113-119) — read 100%%; WORKER-BRIEF.md — read 100%%; dashboards/PROJECT-STATE.md — read 100%%; APP-ACTIONS-PLAYBOOK.md read in targeted sections only (navigation map, work orders, invoicing, roles/staff, reports/timesheets, clock-time recipes) for click-paths, not as a source of expectations."
      % (sz(SRC), sz(ROOT + "full-update-2026-10-07/design-drive/BOARDS-TEXT.md"), sz(ROOT + "sources/Dashboard-v1-Technical-Implementation-Plan.md")))

out = {"updates": U, "new": N, "notes": NOTES, "anchors_covered": covered, "reading_coverage": RC}
json.dump(out, open(OUT, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("updates", len(U), "new", len(N), "anchors S1-S6", len(ANCH_S16), "missing", missing)
