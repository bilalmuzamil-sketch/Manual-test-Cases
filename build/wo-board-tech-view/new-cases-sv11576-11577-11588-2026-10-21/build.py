#!/usr/bin/env python3
"""21 Oct 2026, QA lead: "1. Yes and put the test case link to the bottom of the tickets" — cases for SV-11576 (asset year in List),
SV-11577 (staff record name on the Lines tab) and SV-11588 (outlined hand cursor, fast-follow). Two-audience layout (Rule 117). Quotes are
checked verbatim against PRD v71 and the ticket texts saved here. python3 build.py [--apply]"""
import sys, os, json, re, html
D = os.path.dirname(os.path.abspath(__file__)); W = os.path.dirname(D)
PRD = open(f"{W}/prd-v71-2026-10-20/CONFLUENCE-845185030-v71-2026-10-20.md").read(); PRDn = re.sub(r"\s+", " ", PRD.replace("**", ""))
TK = json.load(open(f"{D}/tickets.json"))
def code(k): return re.search(r"\*\*" + re.escape(k) + r":\*\*\s*(.*)", PRD).group(1).strip().replace("**", "")
SETUP = "https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md"
PRDFROM = 'From: PRD "Work Orders — Board View &amp; Tech View Display Options", Confluence 845185030, version 71 (20 Oct 2026, Chris Ward), read 21 Oct 2026 &middot; Epic SV-10043, '
e = lambda s: html.escape(s, quote=False)
ADMIN = ('You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide.', "For example: {Location-A} is Staging Heavy Duty - 9919.")
BLOCK = ('If any record above is missing, mark this test Blocked: "setup not done".', "")
def render(pre, steps, res, known, blocks, marker, note=""):
    P = (f'<p><strong><a href="{SETUP}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
         "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in pre) + "</ul>")
    S = "<ol>" + "".join(f"<li>{e(s)}</li>" for s in steps) + "</ol>"
    X = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in res) + "</ul>" + (f"<p>{note}</p>" if note else "")
         + (f"<p>{known}</p>" if known else "") + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>")
    for frm, qs in blocks:
        X += f"<p>{frm}</p><ul>" + "".join(f"<li><strong>{e(k)}:</strong> &ldquo;{e(v)}&rdquo;</li>" for k, v in qs) + "</ul>"
    X += f"<p>Not yet checked against a build.</p><p></p><p>{marker}</p>"
    return P, S, X
CASES = {}
# SV-11576
OPT = "asset (year/make/model)"
pre = [ADMIN, ("Customer {Customer-A} has an asset {Asset-A} with a year, make, model and unit number.", "For example: {Customer-A} is ZZAUTOTEST C11576 Asset Year, and {Asset-A} is a 2022 Freightliner M2, unit C11576-U1."),
       ("Work order {Work-order-1} for {Customer-A} on {Asset-A} is Approved.", "For example: {Work-order-1} is S2-37700."),
       ('Starting screen: "Work Orders" > "All" tab, "List" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.', ""), BLOCK]
steps = ["Read the Asset column of {Work-order-1}'s row.", 'Click "Tech View" in the display switcher.', "Read the Asset column of {Work-order-1}'s row."]
res = ['Step 1: the Asset column reads the year, then make, then model, for example "2022 Freightliner M2". The year is not missing.',
       "Step 2: Tech View shows, with {Work-order-1} in Unassigned or its lead technician's group.",
       'Step 3: the Asset column reads the same text as in List, year first, for example "2022 Freightliner M2".']
known = ("<strong>Known problem</strong> (SV-11576, In Progress; it goes into this release if it fits, otherwise a fast follow, Chris Ward, Slack "
         "#fs-board-tech-view, 20 Oct 2026): the Asset column shows the make and model with no year. (1) If you see exactly that, mark this test "
         "Failed and raise nothing new. (2) If it fails in a different way, report it. (3) If the year shows, mark it Passed and tell the QA lead: the fix has shipped.")
note = ("The PRD keeps List as in production; Chris Ward's later ruling (quoted in SV-11576, 20 Oct 2026) adds the year to List's Asset column, "
        "in the same format as the Board View card. This case follows the later ruling.")
blocks = [(PRDFROM + "story SV-10048 (Story 5, Choose what is shown)", [("Story 5, optional fields", OPT)]),
          ("From: Jira SV-11576, &ldquo;Work Orders List – Asset column never shows the asset's year&rdquo; (Slavcho Mitrov, 20 Oct 2026), quoting Chris Ward on Slack, 20 Oct 2026, read 21 Oct 2026",
           [("Expected", TK["SV-11576"]["expected"])])]
P, S, X = render(pre, steps, res, known, blocks, "AUTOMATION: READY - EXPECT FAIL (SV-11576)", note)
CASES["SV-11576"] = {"section_id": 13240, "title": "List and Tech View show the asset's year, make and model", "refs": "SV-10043,SV-10048,SV-11576",
                     "custom_preconds": P, "custom_steps": S, "custom_expected": X}
# SV-11577
pre = [ADMIN, ("Technician {Technician-A} is active at {Location-A}, and the name on their staff record differs from the name on their login account.",
               "For example: the staff record reads ZZAUTOTEST C11577 Ana Staff and the login account reads ZZAUTOTEST C11577 Ana Login."),
       ("Work order {Work-order-1} is Approved, led by {Technician-A}, and has one approved line, {Line-1}, with {Technician-A} as its technician.",
        "For example: {Work-order-1} is S2-37701 and {Line-1} is \"Service - Full grease service\"."),
       ('Starting screen: {Work-order-1} is open on its "Lines" tab.', ""), BLOCK]
steps = ["Read the technician name in {Line-1}'s Labor text.", "Read the technician name in {Line-1}'s technician list (roster).",
         "Click {Line-1}'s name to open Edit Line.", "Read the technician name under Technicians.", 'Click "Cancel".',
         'Open "Work Orders", click the "All" tab and click "Board View".', "Read the technician name on {Work-order-1}'s card and its column header."]
res = ["Step 1: the Labor text names the technician by their staff record name, for example ZZAUTOTEST C11577 Ana Staff.",
       "Step 2: the roster shows the same staff record name, not the login account name.",
       "Step 3: Edit Line opens.",
       "Step 4: Technicians shows the same staff record name.",
       "Step 5: Edit Line closes and nothing changes.",
       "Step 6: Board View shows.",
       "Step 7: the card and the column header show the same staff record name."]
known = ("<strong>Known problem</strong> (SV-11577, In Progress; this release if it fits, otherwise a fast follow): the roster and Edit Line show the "
         "login account name while the Labor text shows the staff record name, so one person appears under two names. (1) If you see exactly that at "
         "steps 2 or 4, mark this test Failed and raise nothing new. (2) If it fails in a different way, report it. (3) If every place shows the staff "
         "record name, mark it Passed and tell the QA lead: the fix has shipped.")
blocks = [(PRDFROM + "story SV-10048 (Story 5, Choose what is shown)", [("S5-R11b", code("S5-R11b"))]),
          ("From: Jira SV-11577, &ldquo;Work order Lines tab – technician roster shows the account name, not the staff record name&rdquo; (Slavcho Mitrov, 20 Oct 2026), quoting Chris Ward on Slack, 20 Oct 2026, read 21 Oct 2026",
           [("Expected", TK["SV-11577"]["expected"])])]
P, S, X = render(pre, steps, res, known, blocks, "AUTOMATION: READY - EXPECT FAIL (SV-11577)")
CASES["SV-11577"] = {"section_id": 13242, "title": "The Lines tab and Edit Line name the technician by their staff record name", "refs": "SV-10043,SV-10048,SV-11577",
                     "custom_preconds": P, "custom_steps": S, "custom_expected": X}
# SV-11588 (fast-follow)
pre = [ADMIN, ("You are on a Windows computer in Chrome, with the standard Windows pointer.", "For example: Windows 11, one 1920 x 1080 screen."),
       ("{Location-A} has a technician {Technician-A} who leads at least one Approved work order, {Work-order-1}.", "For example: {Technician-A} is Esther Howard."),
       ('Starting screen: "Work Orders" > "All" tab, "Board View" shown, "Search" empty, no filter chosen.', ""), BLOCK]
steps = ["Point at {Work-order-1}'s card without clicking.", "Point at {Technician-A}'s column header.", "Start dragging {Work-order-1}'s card and hold it.",
         "Drop it back where it was.", 'Click "Tech View" and point at {Work-order-1}\'s row.', "Start dragging the row and hold it.", "Drop it back where it was.",
         'Click "List" and point at {Work-order-1}\'s row.']
res = ["Step 1: the pointer is an open hand, white with a clear black outline, easy to see on the white card.",
       "Step 2: the same outlined open hand.",
       "Step 3: the pointer is a closed hand with the black outline the whole time you hold the card.",
       "Step 4: the card is back in its place.",
       "Step 5: the outlined open hand.",
       "Step 6: the outlined closed hand the whole time.",
       "Step 7: the row is back in its place.",
       "Step 8: List's pointer is unchanged from today."]
known = ("<strong>Known problem</strong> (SV-11588, Open, fast follow): Chrome on Windows draws its own hands, which on some screens are pure white "
         "with no outline and disappear against the white cards. (1) If you see exactly that, mark this test Failed and raise nothing new. (2) If it "
         "fails in a different way, report it. (3) If every hand has a black outline, mark it Passed and tell the QA lead: the fix has shipped.")
blocks = [("From: Jira SV-11588, &ldquo;Board View and Tech View: hand cursor turns invisible white on Windows; use our own outlined hand&rdquo; (Chris Ward, product owner, 20 Oct 2026), read 21 Oct 2026 &middot; Epic SV-10043, story SV-10052 (Story 9, Drag to reorder work and technician groups/columns)",
           [("Fix", TK["SV-11588"]["fix1"]), ("Fix", TK["SV-11588"]["fix3"]), ("How to check", TK["SV-11588"]["check1"]),
            ("How to check", TK["SV-11588"]["check2"]), ("How to check", TK["SV-11588"]["check3"])])]
P, S, X = render(pre, steps, res, known, blocks, "AUTOMATION: HOLD - the pointer's drawing cannot be captured by browser automation; a person checks it on Windows")
CASES["SV-11588"] = {"section_id": 87347, "title": "On Windows Chrome the hand pointer has a black outline in Board and Tech View", "refs": "SV-10043,SV-10052,SV-11588",
                     "custom_preconds": P, "custom_steps": S, "custom_expected": X}
probs = []
for k, f in CASES.items():
    X = f["custom_expected"]
    for c, q in re.findall(r"<strong>([^<]+):</strong> &ldquo;(.*?)&rdquo;</li>", X):
        q = re.sub(r"\s+", " ", html.unescape(q))
        if q not in PRDn and not any(q == v for v in TK[k].values()): probs.append(f"{k}: quote {c} not verbatim")
    if f["custom_steps"].count("<li>") != len(re.findall(r"<li>Step \d+:", X.split("</ul>")[0])): probs.append(f"{k}: steps/results")
    if len(f["title"]) > 80: probs.append(f"{k}: title {len(f['title'])}")
    used = set(re.findall(r"\{[A-Za-z0-9-]+\}", f["custom_steps"] + X)); dfn = set(re.findall(r"\{[A-Za-z0-9-]+\}", f["custom_preconds"]))
    if used - dfn: probs.append(f"{k}: undefined {used-dfn}")
print("problems:", probs or "none"); json.dump(CASES, open(f"{D}/proposals.json", "w"), indent=1, ensure_ascii=False)
if probs or "--apply" not in sys.argv: sys.exit(1 if probs else 0)
sys.path.insert(0, f"{W}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
log = []
for k, f in CASES.items():
    body = {x: v for x, v in f.items() if x != "section_id"}; body.update({"template_id": 1, "type_id": 7, "priority_id": 2, "custom_automation_type": 2, "custom_atmstatus": 1})
    n = api(f"add_case/{f['section_id']}", body); st = LAST["status"]; a = api(f"get_case/{n['id']}")
    bad = [x for x, v in body.items() if a.get(x) != v] + (["section"] if a["section_id"] != f["section_id"] else [])
    json.dump(a, open(f"{D}/C{n['id']}-after.json", "w"), indent=1, ensure_ascii=False)
    log.append({"ticket": k, "op": "add_case", "case": f"C{n['id']}", "http": st, "readback_ok": not bad, "bad": bad})
json.dump(log, open(f"{D}/apply-log.json", "w"), indent=1); print(json.dumps(log))
