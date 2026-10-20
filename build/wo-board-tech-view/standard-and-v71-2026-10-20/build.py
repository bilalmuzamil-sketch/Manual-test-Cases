#!/usr/bin/env python3
"""20 Oct 2026, QA lead: "3. Yes and put them into your standard ONLY if they are not passed" (C581915 Failed, C698883 Blocked,
C682422 not in run 498) and "2. ... adding one case checking that Board View has no Density control (SV-11580)". Two-audience
layout (Rule 117, ninth to twelfth amendments) on PRD v71. Checks quotes verbatim, then (with --apply) updates under an edit lock /
adds the new case, and reads every field back.  python3 build.py [--apply]"""
import sys, os, json, re, html
D = os.path.dirname(os.path.abspath(__file__)); W = os.path.dirname(D)
PRD = open(f"{W}/prd-v71-2026-10-20/CONFLUENCE-845185030-v71-2026-10-20.md").read()
PRDn = re.sub(r"\s+", " ", PRD.replace("**", ""))
SNAP = {c["id"]: c for c in json.load(open(f"{W}/prd-v71-2026-10-20/snapshots-before/all-cases.json"))}
def code(k): return re.search(r"\*\*" + re.escape(k) + r":\*\*\s*(.*)", PRD).group(1).strip().replace("**", "")
def first(k): t = code(k); return t[:t.index(".") + 1]
SETUP = "https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md"
FROMV71 = 'From: PRD "Work Orders — Board View &amp; Tech View Display Options", Confluence 845185030, version 71 (20 Oct 2026, Chris Ward), read 20 Oct 2026 &middot; Epic SV-10043, '
e = lambda s: html.escape(s, quote=False)
ADMIN = ('You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide.', "For example: {Location-A} is Staging Heavy Duty - 9919.")
BLOCK = ('If any record above is missing, mark this test Blocked: "setup not done".', "")
def render(pre, steps, res, known, quotes, from_tail, note="", marker="AUTOMATION: READY"):
    P = (f'<p><strong><a href="{SETUP}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
         "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in pre) + "</ul>")
    S = "<ol>" + "".join(f"<li>{e(s)}</li>" for s in steps) + "</ol>"
    X = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in res) + "</ul>" + (f"<p>{note}</p>" if note else "") +
         (f"<p>{known}</p>" if known else "") + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
         f"<p>{FROMV71}{from_tail}</p><ul>" + "".join(f"<li><strong>{k}:</strong> &ldquo;{e(v)}&rdquo;</li>" for k, v in quotes) + "</ul>"
         f"<p>Not yet checked against a build in this wording.</p><p></p><p>{marker}</p>")
    return P, S, X
C = {}
# ---- C581915 (Failed, SV-11575)
pre = [ADMIN,
 ('Three technicians are active at {Location-A} with the "Technician" role and Time Clock on, added in this order: {Technician-A}, {Technician-B}, {Technician-C}.',
  "For example: {Technician-A} is Ana Carter, {Technician-B} is Ana Brooks and {Technician-C} is Ben Adams."),
 ("Technician {Technician-D} is deactivated at {Location-A} and still leads at least one work order there, so Tech View shows their group marked \"Inactive\".",
  "For example: {Technician-D} is Aimee Francis."),
 ('Starting screen: "Work Orders" > "All" tab, "Tech View" shown, "Search" empty, no filter chosen, "Assigned to me" off.', ""), BLOCK]
steps = ["Look at the filter bar.", 'Click "Technician".', 'Type the name of {Technician-D} in "Search technician".',
 'Clear the "Search technician" box.', "Tick {Technician-A}, then tick {Technician-B}.", 'Click "Clear selection".', "Press Escape.",
 'Click "Board View" in the display switcher.', 'Click "Technician".', "Press Escape.", 'Click "List" in the display switcher.']
res = ['Step 1: a "Technician" filter sits right after "Assigned to me". There is no Department, Customer or Service Advisor filter.',
 'Step 2: the list starts with "Unassigned". The active technicians follow, by first name then last name: {Technician-B}, then {Technician-A}, then {Technician-C}, whatever order they were added in. Deactivated technicians come after every active one, each with the grey "Inactive" label.',
 'Step 3: {Technician-D} is found, with the grey "Inactive" label.',
 "Step 4: the whole list shows again.",
 "Step 5: {Technician-A} and {Technician-B} are both ticked at the same time, and Tech View shows only their two groups.",
 "Step 6: nothing is ticked.",
 "Step 7: the list closes and every technician group shows again.",
 "Step 8: Board View shows the same columns as Tech View had groups.",
 'Step 9: the "Technician" filter sits in the same place, right after "Assigned to me", with the same options in the same order as in step 2, {Technician-D} included with "Inactive".',
 "Step 10: the list closes.",
 'Step 11: List shows no "Technician" filter.']
known = ("<strong>Known problem</strong> (SV-11575, In Progress; Bilal Muzamil, staging build v26.40.20-0509710, 20 Oct 2026): technicians who have "
 "their own group or column but are deactivated or no longer enrolled are missing from the Technician list (for example Aimee Francis: her "
 "column is marked Inactive, but typing her name in \"Search technician\" gives No results). (1) If you see exactly that at steps 2, 3 or 9, "
 "mark this test Failed and raise nothing new. (2) If it fails in a different way, report it. (3) If {Technician-D} is listed with "
 "\"Inactive\", mark it Passed and tell the QA lead: the fix has shipped.")
OOS1 = "A Department filter. The design shows one, but a work order’s department is not shown or editable on any work order screen today, so users could not see why a work order matches. Revisit once the work order shows its department."
OOS2 = "The Customer and Service Advisor filter chips production retired in the redesign (SV-8785) are not brought back."
quotes = [("S1-R15", code("S1-R15")), ("S1-R15b", code("S1-R15b")), ("Out of Scope", OOS1), ("Out of Scope", OOS2)]
P, S, X = render(pre, steps, res, known, quotes, "story SV-10044 (Story 1, Switch between display options); tickets SV-11326 and SV-11575", marker="AUTOMATION: READY - EXPECT FAIL (SV-11575)")
C[581915] = {"title": "SV-11575 - Tech View and Board View offer a Technician filter that List does not", "refs": "SV-10043,SV-10044,SV-11326,SV-11575",
             "custom_preconds": P, "custom_steps": S, "custom_expected": X}
# ---- C698883 (Blocked, SV-11575)
pre = [ADMIN, ("{Location-A} has at least one technician.", "For example: Esther Howard."),
 ('Starting screen: "Work Orders" > "All" tab, "Tech View" shown, "Search" empty, no filter chosen, "Assigned to me" off.', ""), BLOCK]
steps = ['Click "Technician".', 'Look at the bottom of the list that opens, above "Clear selection".', 'Tick "Unassigned".', "Press Escape.",
 'Click "Board View" in the display switcher.', 'Click "Technician".', 'Untick "Unassigned" and look at the bottom of the list again.']
res = ['Step 1: the list opens, starting with "Unassigned".',
 'Step 2: the message "This change would exceed the 50-value limit across all filters" does not show.',
 'Step 3: "Unassigned" is ticked and the message does not show.', "Step 4: the list closes.",
 "Step 5: Board View shows.", 'Step 6: the Board View list opens with "Unassigned" still ticked, and the message does not show.',
 "Step 7: nothing is ticked and the message does not show."]
known = ("<strong>Known problem</strong> (SV-11575, In Progress; Bilal Muzamil, staging build v26.40.20-0509710, 20 Oct 2026): as soon as the "
 "Technician list opens, with nothing ticked, the red message \"This change would exceed the 50-value limit across all filters\" shows at the "
 "bottom of the list, in Tech View and Board View, and also while typing in \"Search technician\". (1) If you see exactly that, mark this test "
 "Blocked by SV-11575 (the QA lead's instruction, 20 Oct 2026) and raise nothing new. (2) If it fails in a different way, report it. (3) If the "
 "message never shows, mark it Passed and tell the QA lead: the fix has shipped.")
quotes = [("S1-R15c", code("S1-R15c"))]
P, S, X = render(pre, steps, res, known, quotes, "story SV-10044 (Story 1, Switch between display options); ticket SV-11575", marker="AUTOMATION: READY - EXPECT FAIL (SV-11575)")
C[698883] = {"title": "SV-11575 - Opening the Technician list never shows the 50-value limit message", "refs": "SV-10043,SV-10044,SV-11575", "custom_preconds": P, "custom_steps": S, "custom_expected": X}
# ---- C682422 (Fast-follow folder, not in run; label now SV-11570)
pre = [ADMIN, ('Technician {Technician-A} is active at {Location-A} with the "Technician" role and Time Clock on.', "For example: {Technician-A} is ZZAUTOTEST C682422 Ana."),
 ("Customer {Customer-A} has two Approved work orders: {Work-order-1} with no lead technician, and {Work-order-2} led by {Technician-A}.",
  "For example: {Customer-A} is ZZAUTOTEST C682422 Assign Wording, and {Work-order-1} and {Work-order-2} are S2-37401 and S2-37402."),
 ('Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.', ""), BLOCK]
old = SNAP[682422]
steps = [html.unescape(re.sub(r"<[^>]+>", "", x)) for x in re.findall(r"<li>(.*?)</li>", old["custom_steps"])]
res = [html.unescape(re.sub(r"<[^>]+>", "", x)) for x in re.findall(r"<li>(.*?)</li>", old["custom_expected"].split("</ul>")[0])]
known = ("<strong>Known problem</strong> (SV-11570, Testing QA, for this release; it replaces SV-11522 and SV-11524 for the label only, Chris Ward, "
 "Slack #fs-board-tech-view, 20 Oct 2026): until it ships, the menu on a work order with no lead says \"Reassign lead technician\". (1) If you see "
 "exactly that, mark this test Failed and raise nothing new. (2) If it fails in a different way, report it. (3) If it behaves as the expected "
 "results say, mark it Passed and tell the QA lead: the change has shipped.")
note = ("Developers also check this with unit tests (SV-11570): <code>WorkOrderMoreActions.spec.ts</code> (\"the lead action's label\") and "
        "<code>ReassignLeadTechnicianDialog.spec.ts</code> (\"its title and confirm button\").")
quotes = [("S3-R14", code("S3-R14")), ("S4-R4", code("S4-R4")), ("S4-R13", code("S4-R13"))]
P, S, X = render(pre, steps, res, known, quotes, "stories SV-10046 (Story 3, Board View — board by lead technician) and SV-10047 (Story 4, Reassign or unassign the lead technician from the board or grouped table); ticket SV-11570", note=note, marker="AUTOMATION: READY - EXPECT FAIL (SV-11570)")
C[682422] = {"title": old["title"], "refs": "SV-10046,SV-10047,SV-11570", "custom_preconds": P, "custom_steps": S, "custom_expected": X}
# ---- NEW: SV-11580
pre = [ADMIN, ("{Location-A} has at least one technician and one work order.", "For example: Esther Howard."),
 ('Starting screen: "Work Orders" > "All" tab, "Board View" shown, "Search" empty, no filter chosen, "Assigned to me" off.', ""), BLOCK]
steps = ["Look at the toolbar between the filters and the display switcher.", 'Click "Column Selection".', "Press Escape.",
 'Click "Tech View" in the display switcher.', "Click the density button in the toolbar."]
res = ['Step 1: there is no density button. "Column Selection" sits centred between the toolbar\'s two dividers, with no empty gap or double divider where the density button was.',
 'Step 2: the picker of card fields opens, the same picker "Fields to display" opened before.',
 "Step 3: the picker closes and the cards keep their usual spacing.",
 "Step 4: Tech View shows, and its toolbar still has the density button.",
 'Step 5: the menu offers "Compact", "Regular" and "Comfortable".']
known = ("<strong>Known problem</strong> (SV-11580, Open): until it ships, Board View still shows the density button and the field picker is "
 "named \"Fields to display\". (1) If you see exactly that, mark this test Failed and raise nothing new. (2) If it fails in a different way, "
 "report it. (3) If it behaves as the expected results say, mark it Passed and tell the QA lead: the change has shipped.")
LOG = "Fields to display renamed Column Selection everywhere it appears, the same name the other views use. v71."
quotes = [("S3-R11", code("S3-R11")), ("S5-R2", code("S5-R2")), ("S6-E1", code("S6-E1")), ("S6-R1", code("S6-R1")), ("PRD change log, 20 Oct 2026", LOG)]
P, S, X = render(pre, steps, res, known, quotes, "stories SV-10046 (Story 3, Board View — board by lead technician), SV-10048 (Story 5, Column Selection) and SV-10049 (Story 6, Density); ticket SV-11580", marker="AUTOMATION: READY - EXPECT FAIL (SV-11580)")
NEW = {"section_id": 13238, "title": "Board View has no Density control and Column Selection sits centred", "refs": "SV-10043,SV-10046,SV-10049,SV-11580",
       "custom_preconds": P, "custom_steps": S, "custom_expected": X}
# ---- checks
probs = []
for k, f in list(C.items()) + [("NEW", NEW)]:
    X = f["custom_expected"]
    for code_, q in re.findall(r"<strong>([^<]+):</strong> &ldquo;(.*?)&rdquo;</li>", X):
        if re.sub(r"\s+", " ", html.unescape(q)) not in PRDn: probs.append(f"{k}: quote {code_} not verbatim in v71")
    ns = f["custom_steps"].count("<li>"); nr = len(re.findall(r"<li>Step \d+:", X.split("</ul>")[0]))
    if ns != nr: probs.append(f"{k}: {ns} steps vs {nr} results")
    if len(f["title"]) > 80: probs.append(f"{k}: title > 80")
    if X.count("AUTOMATION:") != 1: probs.append(f"{k}: AUTOMATION count")
    used = set(re.findall(r"\{[A-Za-z0-9-]+\}", f["custom_steps"] + X)); dfn = set(re.findall(r"\{[A-Za-z0-9-]+\}", f["custom_preconds"]))
    if used - dfn: probs.append(f"{k}: undefined {used-dfn}")
print("problems:", probs or "none"); json.dump({"updates": {str(k): v for k, v in C.items()}, "new": NEW}, open(f"{D}/proposals.json", "w"), indent=1, ensure_ascii=False)
if probs or "--apply" not in sys.argv: sys.exit(1 if probs else 0)
sys.path.insert(0, f"{W}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
log = []
for cid, f in C.items():
    live = api(f"get_case/{cid}")
    if live["updated_on"] != SNAP[cid]["updated_on"]: log.append({"op": "refused_edit_lock", "case": f"C{cid}"}); continue
    json.dump(live, open(f"{D}/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    api(f"update_case/{cid}", f); st = LAST["status"]; a = api(f"get_case/{cid}")
    bad = [k for k, v in f.items() if a.get(k) != v]; json.dump(a, open(f"{D}/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.append({"op": "update_case", "case": f"C{cid}", "http": st, "readback_ok": not bad, "bad": bad})
body = {k: v for k, v in NEW.items() if k != "section_id"}
n = api(f"add_case/{NEW['section_id']}", body); st = LAST["status"]; a = api(f"get_case/{n['id']}")
bad = [k for k, v in body.items() if a.get(k) != v] + (["section"] if a["section_id"] != NEW["section_id"] else [])
json.dump(a, open(f"{D}/C{n['id']}-after.json", "w"), indent=1, ensure_ascii=False)
log.append({"op": "add_case", "case": f"C{n['id']}", "http": st, "readback_ok": not bad, "bad": bad})
json.dump(log, open(f"{D}/apply-log.json", "w"), indent=1); print(json.dumps(log))
