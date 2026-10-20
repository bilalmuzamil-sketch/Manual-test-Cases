#!/usr/bin/env python3
"""20 Oct 2026, QA lead: "check this test case and make it upto our standards so that it can be easily runable by our Manual QA
testers" (C97022). Rebuilds C97022 in the two-audience layout (Rule 117, ninth to twelfth amendments) on PRD v71 and Chris Ward's
answer 34, with the SV-11582 known problem (Rule 61). Checks every quote verbatim in v71 / the answer, then (with --apply) writes it
under an edit lock and reads it back.  python3 build.py [--apply]"""
import sys, os, json, re, html
D = os.path.dirname(os.path.abspath(__file__))
PRD = open(f"{D}/../prd-v71-2026-10-20/CONFLUENCE-845185030-v71-2026-10-20.md").read()
def code(k):
    m = re.search(r"\*\*" + re.escape(k) + r":\*\*\s*(.*)", PRD); return m.group(1).strip()
def sentence(k, start):
    t = code(k); i = t.index(start); j = t.index(".", i) + 1; return t[i:j]
A34 = ("34. (b). The \"No work orders match these filters\" empty state shows (S1-N1a), and keyboard focus moves to its Clear all filters "
       "button. Focus going to the column header (S11-E1) still applies when a move leaves other work orders on screen. The build drops "
       "focus to the page today, so please log that as a bug against S11-E1. PRD v70.")
SETUP = "https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md"
e = html.escape
pre = [
 ('You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide.', "For example: {Location-A} is Staging Heavy Duty - 9919."),
 ('Two technicians are active at {Location-A} with the "Technician" role and Time Clock on: {Technician-A} and {Technician-B}.', "For example: {Technician-A} is ZZAUTOTEST Ana Alpha and {Technician-B} is ZZAUTOTEST C97022 Ben."),
 ("Customer {Customer-A} has two Approved work orders, {Work-order-1} and {Work-order-2}, both led by {Technician-A}. Neither has a shift on the Schedule, and {Technician-B} is not the technician on any of their lines.",
  "For example: {Customer-A} is ZZAUTOTEST F3 Keyboard Focus Kept 92916, with work orders S2-37664 and S2-37665."),
 ('Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.', ""),
 ('If any record above is missing, mark this test Blocked: "setup not done".', ""),
]
steps = [
 'Click once in "Search", then press Tab until a card in {Technician-A}\'s column shows a blue focus ring.',
 "Press Tab.",
 "Press Enter.",
 "Press Escape.",
 'Press Enter, choose "Reassign lead technician" with the arrow keys and press Enter.',
 "Press Escape.",
 'With the mouse, click "Technician" in the filter bar, tick {Technician-A} and press Escape.',
 'Click once in "Search", then press Tab until the top card in {Technician-A}\'s column shows a blue focus ring.',
 'Press Tab, press Enter, choose "Reassign lead technician" with the arrow keys and press Enter.',
 "In the window, choose {Technician-B} with the keyboard and confirm with the keyboard.",
 'Press Tab, press Enter, choose "Reassign lead technician" with the arrow keys and press Enter.',
 "In the window, choose {Technician-B} with the keyboard and confirm with the keyboard.",
 "Press Enter.",
]
res = [
 "Step 1: one of the two cards in {Technician-A}'s column has a blue focus ring.",
 'Step 2: that card\'s "More actions" (…) button shows and has the focus ring.',
 'Step 3: the "More actions" menu opens and offers "Reassign lead technician".',
 'Step 4: the menu closes, nothing changes, and the focus ring is back on the "More actions" button.',
 'Step 5: the "Reassign lead technician" window opens.',
 'Step 6: the window closes, the card still has {Technician-A} as its lead, and the focus ring is back on the "More actions" button.',
 "Step 7: only {Technician-A}'s column shows, holding both {Work-order-1} and {Work-order-2}. Every other column is hidden.",
 "Step 8: the top card in {Technician-A}'s column has the focus ring.",
 'Step 9: the "Reassign lead technician" window opens for that work order.',
 "Step 10: the window closes and the card leaves {Technician-A}'s column (it no longer matches the Technician filter). The focus ring moves to the other card, the one left in {Technician-A}'s column, and can be seen.",
 'Step 11: the "Reassign lead technician" window opens for the last work order.',
 'Step 12: the window closes and the last card leaves. The board is replaced by "No work orders match these filters", then "Try removing a filter to widen your results.", with a "Clear all filters" button. The "Clear all filters" button has the focus ring.',
 "Step 13: the filters are cleared, including the Technician filter, and the board shows the technicians' columns again. {Work-order-1} and {Work-order-2} are both in {Technician-B}'s column.",
]
known = ("<p><strong>Known problem</strong> (SV-11582, Open; Bilal Muzamil, staging build v26.40.20-0509710, 20 Oct 2026): at step 12 "
  "\"No work orders match these filters\" shows, but no focus ring is anywhere: the arrow keys do nothing and the next Tab jumps back "
  "to the top of the page. (1) If you see exactly that, mark this test Failed and raise nothing new. (2) If it fails in a different "
  "way, report it. (3) If the \"Clear all filters\" button has the focus ring and step 13 works, mark it Passed and tell the QA lead: "
  "the fix has shipped.</p>")
Q = [("S11-R1", code("S11-R1")), ("S11-R2", code("S11-R2")), ("S11-R3", code("S11-R3")), ("S3-R14", code("S3-R14")),
     ("S11-R9", code("S11-R9")), ("S4-R4", code("S4-R4")), ("S11-R5", code("S11-R5")), ("S11-R6", code("S11-R6")),
     ("S1-R15", sentence("S1-R15", "Choosing one or more")), ("S11-E1", code("S11-E1")), ("S1-N1a", code("S1-N1a")),
     ("S1-R15a", code("S1-R15a"))]
FROM1 = ('From: PRD "Work Orders — Board View &amp; Tech View Display Options", Confluence 845185030, version 71 (20 Oct 2026, Chris Ward), '
         'read 20 Oct 2026 &middot; Epic SV-10043, stories SV-10054 (Story 11, Keyboard access and focus), SV-10044 (Story 1, Switch between '
         'display options), SV-10046 (Story 3, Board View) and SV-10047 (Story 4, Reassign or unassign the lead technician); ticket SV-11582')
FROM2 = ('From: Chris Ward\'s answer to question 34, "WO Board and Tech View – questions for Chris Ward" (Google Sheet '
         '1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU, row 39), answered 20 Oct 2026, read 20 Oct 2026')
def li(a, b): return f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>"
P = (f'<p><strong><a href="{SETUP}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
     "<p><strong>Preconditions</strong></p><ul>" + "".join(li(a, b) for a, b in pre) + "</ul>")
S = "<ol>" + "".join(f"<li>{e(s)}</li>" for s in steps) + "</ol>"
X = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in res) + "</ul>" + known +
     "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
     f"<p>{FROM1}</p><ul>" + "".join(f"<li><strong>{k}:</strong> &ldquo;{e(v, quote=False)}&rdquo;</li>" for k, v in Q) + "</ul>"
     f"<p>{FROM2}</p><ul><li><strong>Chris Ward's answer 34:</strong> &ldquo;{e(A34, quote=False)}&rdquo;</li></ul>"
     "<p>Not yet checked against a build in this wording.</p><p></p><p>AUTOMATION: READY - EXPECT FAIL (SV-11582)</p>")
F = {"title": "SV-11582 - Focus returns to the opener and moves on when a focused card leaves", "refs": "SV-10043,SV-10054,SV-11582",
     "custom_preconds": P, "custom_steps": S, "custom_expected": X}
# checks
probs = []
PRDn = re.sub(r"\s+", " ", PRD.replace("**", ""))
for k, v in Q:
    if re.sub(r"\s+", " ", v.replace("**", "")) not in PRDn: probs.append(f"quote {k} not verbatim in v71")
if len(F["title"]) > 80: probs.append("title > 80")
if len(steps) != len(res) or any(not r.startswith(f"Step {i+1}:") for i, r in enumerate(res)): probs.append("step/result mismatch")
if X.count("AUTOMATION:") != 1 or not X.endswith("AUTOMATION: READY - EXPECT FAIL (SV-11582)</p>"): probs.append("AUTOMATION line")
used = set(re.findall(r"\{[A-Za-z0-9-]+\}", S + X)); defined = set(re.findall(r"\{[A-Za-z0-9-]+\}", P))
if used - defined: probs.append(f"placeholders not defined: {used-defined}")
print("problems:", probs or "none"); json.dump(F, open(f"{D}/C97022-proposed.json", "w"), indent=1, ensure_ascii=False)
if probs or "--apply" not in sys.argv: sys.exit(1 if probs else 0)
sys.path.insert(0, f"{D}/../../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
before = json.load(open(f"{D}/C97022-before.json")); live = api("get_case/97022")
if live["updated_on"] != before["updated_on"]: print("REFUSED: edited since snapshot", live["updated_on"]); sys.exit(2)
api("update_case/97022", F); st = LAST["status"]; a = api("get_case/97022")
bad = [k for k, v in F.items() if a.get(k) != v]
json.dump(a, open(f"{D}/C97022-after.json", "w"), indent=1, ensure_ascii=False)
json.dump({"op": "update_case", "case": "C97022", "http": st, "readback_ok": not bad, "bad": bad}, open(f"{D}/apply-log.json", "w"), indent=1)
print("http", st, "readback_ok", not bad, bad)
