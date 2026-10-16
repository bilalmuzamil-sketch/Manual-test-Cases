#!/usr/bin/env python3
"""WO Board, 16 Oct 2026 (QA lead: "2. Yes and give me the test run link"). New case for PRD v62 S11-R1 (Chris Ward's answer 33):
with nothing focused yet, the first Tab skips a collapsed or empty Unassigned to the first technician's first row or card.
Two-audience shape (Rule 117, ninth amendment). Creates the case in S11 (section 13246), writes its final text with its own number,
adds it to run 498 (union only) and reads everything back.
  python3 new_case_first_tab.py           dry run (build + checks)
  python3 new_case_first_tab.py --apply   write"""
import sys, os, re, json, html
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, f"{D}/../../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
PRD = open(f"{D}/CONFLUENCE-845185030-v62-2026-10-16.md").read()
def ws(s): return re.sub(r"\s+", " ", html.unescape(s).replace("**", "").replace("\\", "")).strip()
def code(c): return re.search(r"^- \*\*" + re.escape(c) + r":\*\*\s*(.*)$", PRD, re.M).group(1).replace("**", "").strip()
DOC = ("https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/"
       "v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md")
SHEET = "https://docs.google.com/spreadsheets/d/1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU"
e = lambda s: html.escape(s, quote=False)
TITLE = "First Tab skips a collapsed or empty Unassigned to the first technician"
SECTION = 13246; RUN = 498

def build(cid):
    n = f"C{cid}"
    pre = [('You are signed in with the "Admin" role at {Location-A}.', "For example: {Location-A} is Staging Heavy Duty - 9919."),
           ('Two technicians are active at {Location-A} with the "Technician" role and Time Clock on: {Technician-A} and {Technician-B}.',
            f"For example: {{Technician-A}} is ZZAUTOTEST {n} Ana and {{Technician-B}} is ZZAUTOTEST {n} Ben."),
           ("Customer {Customer-A} has two Approved work orders: {Work-order-1} led by {Technician-A} and {Work-order-2} led by {Technician-B}. "
            "Customer {Customer-B} has one Approved work order with no lead technician, {Work-order-3}. Both customer names start with the same text, {Search-A}.",
            f"For example: {{Customer-A}} is ZZAUTOTEST {n} Keyboard A, {{Customer-B}} is ZZAUTOTEST {n} Keyboard B, {{Search-A}} is "
            f"ZZAUTOTEST {n} Keyboard, and {{Work-order-1}} to {{Work-order-3}} are S10043-17801 to S10043-17803."),
           ("{Technician-A} is pinned first and {Technician-B} second in your Board View, and no other technician is pinned.", None),
           ('Starting screen: "Work Orders" > "All" tab, "Tech View" shown, {Search-A} in "Search", no filter chosen, "Assigned to me" off, '
            "every group expanded, the page freshly opened so nothing has had keyboard focus yet, in a browser window at least 1024 px wide.", None),
           ('If any record above is missing, mark this test Blocked: "setup not done".', None)]
    steps = ['Click the arrow on the "Unassigned" group header to collapse the group.',
             'Click once in the "Search" box.',
             "Press Tab until something in the table shows a focus ring.",
             'Click "Board View" in the display switcher.',
             'Replace the text in "Search" with the name of {Customer-A}.',
             'Click once in the "Search" box.',
             "Press Tab until something on the board shows a focus ring."]
    res = ['Step 1: the "Unassigned" group collapses; its header stays and {Work-order-3}\'s row is hidden. {Technician-A}\'s group follows, then {Technician-B}\'s.',
           'Step 2: the cursor is in the "Search" box and nothing in the table has a focus ring.',
           'Step 3: the focus ring lands on {Work-order-1}\'s row, the first row of {Technician-A}\'s group. It does not land on the collapsed "Unassigned" header or on any other group header.',
           'Step 4: Board View shows the "Unassigned" column first, then {Technician-A}\'s and {Technician-B}\'s columns.',
           'Step 5: only {Customer-A}\'s work orders show: {Work-order-1} in {Technician-A}\'s column and {Work-order-2} in {Technician-B}\'s column. The "Unassigned" column has no cards.',
           'Step 6: the cursor is in the "Search" box and nothing on the board has a focus ring.',
           'Step 7: the focus ring lands on {Work-order-1}\'s card, the first card in {Technician-A}\'s column, not on a column header.']
    source = ('Epic SV-10043; story SV-10054 (Story 11, Keyboard access and focus); PRD "Work Orders — Board View & Tech View Display Options", '
              "Confluence 845185030, version 62 (16 Oct 2026, Chris Ward), S11-R1, S2-R2 and S2-R17, read 16 Oct 2026. Product owner answers: "
              f"Chris Ward, WO Board and Tech View question sheet ({SHEET}), answer 33, read 16 Oct 2026. Source-verified 16 October 2026. "
              "Not yet checked against a build.")
    quotes = [("S11-R1", code("S11-R1")), ("S2-R2", code("S2-R2")), ("S2-R17", code("S2-R17"))]
    marker = "AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build"
    f = {"title": TITLE, "template_id": 1, "type_id": 7, "priority_id": 2, "refs": "SV-10054", "custom_automation_type": 2, "custom_atmstatus": 1,
         "custom_preconds": (f'<p><strong><a href="{DOC}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
                             "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in pre) + "</ul>"),
         "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in steps) + "</ol>",
         "custom_expected": ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in res) + "</ul>"
                             + f"<p><strong>Source &mdash; where this behaviour comes from</strong><br>{e(source)}</p>"
                             + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p><ul>"
                             + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(q)}&rdquo;</li>" for l, q in quotes) + "</ul>" + f"<p>{e(marker)}</p>")}
    probs = []
    if len(TITLE) > 80 or ";" in TITLE: probs.append("title")
    if len(pre) > 6 or len(steps) > 10: probs.append("limits")
    if len(res) != len(steps) or any(not r.startswith(f"Step {i}: ") for i, r in enumerate(res, 1)): probs.append("Step N lines")
    defined = set(re.findall(r"\{([^{}]+)\}", " ".join(a for a, _ in pre)))
    probs += [f"{{{p}}} undefined" for p in set(re.findall(r"\{([^{}]+)\}", " ".join(steps + res))) if p not in defined]
    if "ZZAUTOTEST" in " ".join([a for a, _ in pre] + steps + res): probs.append("hard-coded record in tester text")
    probs += [f"quote {l} not verbatim in v62" for l, q in quotes if ws(q) not in ws(PRD)]
    return f, pre, steps, res, quotes, probs

f, *_, probs = build("NEWID")
if probs: print("PROBLEMS", probs); sys.exit(1)
print("checks OK")
if "--apply" not in sys.argv: sys.exit(0)
os.makedirs(f"{D}/applied", exist_ok=True); log = open(f"{D}/applied/apply-log.jsonl", "a")
def L(r): log.write(json.dumps(r) + "\n"); log.flush(); print(r)
c = api(f"add_case/{SECTION}", f); nid = c["id"]; L({"op": "add_case", "case": f"C{nid}", "http": LAST["status"]})
f2, pre, steps, res, quotes, probs = build(nid)
api(f"update_case/{nid}", f2); st = LAST["status"]; a = api(f"get_case/{nid}")
json.dump(a, open(f"{D}/applied/C{nid}-after.json", "w"), indent=1, ensure_ascii=False)
L({"op": "update_case(own number)", "case": f"C{nid}", "http": st, "fields_ok": all(a.get(k) == v for k, v in f2.items()), "section_ok": a["section_id"] == SECTION})
json.dump({"new_case": nid, "pre": [x + (" " + y if y else "") for x, y in pre], "steps": steps, "results": res, "quotes": quotes},
          open(f"{D}/applied/new-case.json", "w"), indent=1, ensure_ascii=False)
# run 498, union only
def tests():
    out, off = [], 0
    while True:
        d = api(f"get_tests/{RUN}&limit=250&offset={off}"); out += d["tests"] if isinstance(d, dict) else d
        if isinstance(d, dict) and d.get("_links", {}).get("next"): off += 250
        else: return out
run = api(f"get_run/{RUN}")
if run["is_completed"] or run["include_all"]: L({"op": "run_refused", "run": RUN}); sys.exit(1)
b = tests(); bi = sorted({t["case_id"] for t in b}); bs = {t["case_id"]: (t["id"], t["status_id"]) for t in b}
api(f"update_run/{RUN}", {"include_all": False, "case_ids": sorted(set(bi) | {nid})}); st = LAST["status"]
aft = tests(); ai = sorted({t["case_id"] for t in aft}); as_ = {t["case_id"]: (t["id"], t["status_id"]) for t in aft}
L({"op": "update_run", "run": RUN, "http": st, "before": len(bi), "after": len(ai), "dropped": [x for x in bi if x not in ai],
   "added": [x for x in ai if x not in bi], "changed": [x for x in bi if as_.get(x) != bs[x]],
   "test_link": f"https://shopview.testrail.io/index.php?/tests/view/{as_[nid][0]}" if nid in as_ else None})
