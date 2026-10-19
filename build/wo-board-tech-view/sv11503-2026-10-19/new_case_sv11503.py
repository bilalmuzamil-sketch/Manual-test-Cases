#!/usr/bin/env python3
"""WO Board, 19 Oct 2026 (QA lead: "Create the test case for this: SV-11503 ... make it the part of the test cases for WO Board and Tech
view and the part of the same test run also"; asked about the missing source: "Create it, no question"). A long customer name must
stay inside the drag preview. The PRD (v64) has no drag-preview rule; the case applies the design's cut-off of customer names on
cards and rows, and says so. Section "Design — how it looks" (73780, Rule 126). Creates the case, writes its final text with its own
number, adds it to run 498 (union only), reads back.
  python3 new_case_sv11503.py           dry run (build + checks)
  python3 new_case_sv11503.py --apply   write"""
import sys, os, re, json, html
D = os.path.dirname(os.path.abspath(__file__)); V = os.path.dirname(D)
sys.path.insert(0, f"{V}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
PRD = open(f"{D}/CONFLUENCE-845185030-v64-2026-10-19.md").read()
DES = open(f"{V}/sources/design-2026-10-14-upload/Work Orders.dc.html", encoding="utf-8").read()
TP = open(f"{V}/sources/Tech-Plan-Kanban-Tech-View-Display-Options-2026-10-08-upload.md").read()
def ws(s): return re.sub(r"\s+", " ", html.unescape(s).replace("**", "").replace("\\", "")).strip()
def code(c): return re.search(r"^- \*\*" + re.escape(c) + r":\*\*\s*(.*)$", PRD, re.M).group(1).replace("**", "").strip()
DOC = ("https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/"
       "v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md")
e = lambda s: html.escape(s, quote=False)
TITLE = "Design- A long customer name stays inside the dragged card in both views"
SECTION = 73780; RUN = 498

def build(cid):
    n = f"C{cid}"
    pre = [('You are signed in with the "Admin" role at {Location-A}.', "For example: {Location-A} is Staging Heavy Duty - 9919."),
           ('Technician {Technician-A} is active at {Location-A} with the "Technician" role and Time Clock on.',
            f"For example: {{Technician-A}} is ZZAUTOTEST {n} Ana."),
           ("Customer {Customer-A} has a long name, more than 60 characters, that includes one long word with no spaces.",
            f"For example: {{Customer-A}} is ZZAUTOTEST {n} Superlongunbrokencustomernamewithoutanyspacesforthedragpreview."),
           ("Work order {Work-order-1} for {Customer-A} is Approved and led by {Technician-A}.", "For example: {Work-order-1} is S10043-17901."),
           ('Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, '
            '"Assigned to me" off, in a browser window at least 1024 px wide.', None),
           ('If any record above is missing, mark this test Blocked: "setup not done".', None)]
    steps = ["Press and hold the mouse button on {Work-order-1}'s card and move the pointer a little to the right. Do not let go.",
             "Look at the preview box that follows the pointer.",
             "Press Escape, then let go of the mouse button.",
             'Click "Tech View" in the display switcher.',
             "Press and hold the mouse button on {Work-order-1}'s row and move the pointer a little down. Do not let go.",
             "Look at the preview box that follows the pointer.",
             "Press Escape, then let go of the mouse button."]
    res = ["Step 1: a drag starts and a small preview box with {Work-order-1}'s work order number and customer name follows the pointer.",
           'Step 2: the whole customer name stays inside the preview box. A name too long to fit is cut off with "…" (or wraps onto another '
           "line inside the box). No letter of it is drawn outside the box or over the neighbouring columns and cards.",
           "Step 3: the drag is cancelled and {Work-order-1}'s card stays in {Technician-A}'s column.",
           "Step 4: Tech View shows {Work-order-1}'s row in {Technician-A}'s group.",
           "Step 5: a drag starts and a small preview box with {Work-order-1}'s work order number and customer name follows the pointer.",
           'Step 6: the whole customer name stays inside the preview box. A name too long to fit is cut off with "…" (or wraps onto another '
           "line inside the box). No letter of it is drawn outside the box or over the neighbouring rows.",
           "Step 7: the drag is cancelled and {Work-order-1}'s row stays in {Technician-A}'s group."]
    known = ("Known problem (SV-11503, open, found on staging 19 Oct 2026): today the customer name runs past the preview box's right edge, "
             "across the neighbouring columns and cards in Board View, and the end of the name sits outside the box in Tech View. "
             "(1) If you see exactly that, mark this test Failed and raise nothing new. (2) If it fails in a different way, that is a new "
             "problem: report it. (3) If the name stays inside the box in both views, the fix has shipped: mark it Passed and tell the QA lead.")
    source = ('Epic SV-10043; story SV-10052 (Story 9, Drag to reorder work and technician groups/columns); PRD "Work Orders — Board View & '
              'Tech View Display Options", Confluence 845185030, version 64 (16 Oct 2026, Chris Ward), S9-R1, read 19 Oct 2026. Claude Design '
              'project "Work Orders" (Branko Cicovic), export of 14 Oct 2026, board "Work Orders.dc.html": the customer name on a Board View '
              'card and on a Tech View row is cut off with "…" when it is too long, read 19 Oct 2026. Tech plan (upload of 8 Oct 2026), '
              "the drag files row (Escape cancels a drag). Related ticket: SV-11503. Source-verified 19 October 2026. Not yet checked against a build.")
    note = ("The PRD has no rule for the drag preview itself, and the design does not draw one. This case applies the design's cut-off "
            "of customer names on cards and rows to the preview, by the QA lead's decision of 19 Oct 2026.")
    quotes = [("S9-R1", code("S9-R1")),
              ("Design — Work Orders.dc.html, Board View card customer name",
               '<span style="font-size: 14px; font-weight: 500; color: {{ wo.titleColor }}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ wo.cust }}</span>'),
              ("Design — Work Orders.dc.html, Tech View row customer name",
               '<span style="font-size: {{ cellFs }}; font-weight: 500; color: {{ wo.titleColor }}; overflow: hidden; text-overflow: ellipsis;">{{ wo.cust }}</span>'),
              ("Tech plan, drag files row",
               "Pointer-events drag: threshold (SQ-10) exported as a named constant and documented so tests can exceed it deterministically, "
               "rAF auto-scroll, Escape cancels, click suppressed after a drag")]
    marker = "AUTOMATION: READY - EXPECT FAIL (SV-11503)"
    f = {"title": TITLE, "template_id": 1, "type_id": 7, "priority_id": 2, "refs": "SV-10052,SV-11503", "custom_automation_type": 2, "custom_atmstatus": 1,
         "custom_preconds": (f'<p><strong><a href="{DOC}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
                             "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in pre) + "</ul>"),
         "custom_steps": "<ol>" + "".join(f"<li>{e(s)}</li>" for s in steps) + "</ol>",
         "custom_expected": ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in res) + "</ul>"
                             + f"<p>{e(known)}</p>"
                             + f"<p><strong>Source &mdash; where this behaviour comes from</strong><br>{e(source)}</p>" + f"<p>{e(note)}</p>"
                             + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p><ul>"
                             + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(q)}&rdquo;</li>" for l, q in quotes) + "</ul>" + f"<p>{e(marker)}</p>")}
    probs = []
    if len(TITLE) > 80 or ";" in TITLE: probs.append("title")
    if len(pre) > 6 or len(steps) > 10: probs.append("limits")
    if len(res) != len(steps) or any(not r.startswith(f"Step {i}: ") for i, r in enumerate(res, 1)): probs.append("Step N lines")
    defined = set(re.findall(r"\{([^{}]+)\}", " ".join(a for a, _ in pre)))
    probs += [f"{{{p}}} undefined" for p in set(re.findall(r"\{([A-Z][^{}]+)\}", " ".join(steps + res))) if p not in defined]
    if "ZZAUTOTEST" in " ".join([a for a, _ in pre] + steps + res): probs.append("hard-coded record in tester text")
    for l, q in quotes:
        src = DES if l.startswith("Design") else TP if l.startswith("Tech plan") else PRD
        if (q not in src) if l.startswith("Design") else (ws(q) not in ws(src)): probs.append(f"quote {l} not verbatim")
    return f, pre, steps, res, quotes, probs

f, *_, probs = build("NEWID")
if probs: print("PROBLEMS", probs); sys.exit(1)
print("checks OK"); print(f["refs"])
if "--apply" not in sys.argv: sys.exit(0)
os.makedirs(f"{D}/applied", exist_ok=True); log = open(f"{D}/applied/apply-log.jsonl", "a")
def L(r): log.write(json.dumps(r) + "\n"); log.flush(); print(r)
c = api(f"add_case/{SECTION}", f); nid = c["id"]; L({"op": "add_case", "case": f"C{nid}", "http": LAST["status"]})
f2, pre, steps, res, quotes, _ = build(nid)
api(f"update_case/{nid}", f2); st = LAST["status"]; a = api(f"get_case/{nid}")
json.dump(a, open(f"{D}/applied/C{nid}-after.json", "w"), indent=1, ensure_ascii=False)
L({"op": "update_case(own number)", "case": f"C{nid}", "http": st, "fields_ok": all(a.get(k) == v for k, v in f2.items()), "section_ok": a["section_id"] == SECTION,
   "refs": a.get("refs")})
json.dump({"new_case": nid, "pre": [x + (" " + y if y else "") for x, y in pre], "steps": steps, "results": res, "quotes": quotes},
          open(f"{D}/applied/new-case.json", "w"), indent=1, ensure_ascii=False)
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
   "test_id": as_[nid][0] if nid in as_ else None, "test_link": f"https://shopview.testrail.io/index.php?/tests/view/{as_[nid][0]}" if nid in as_ else None})
