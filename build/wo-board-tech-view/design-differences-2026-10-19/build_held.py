#!/usr/bin/env python3
"""Build, check and (--apply) create the held design-version cases in "Design — how it looks" (section 73780). Not added to run 498."""
import sys, os, re, json, html, glob
D = os.path.dirname(os.path.abspath(__file__)); V = os.path.dirname(D)
sys.path.insert(0, f"{V}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
sys.path.insert(0, D); import held_cases as H, differences as DF
RAW = " ".join(open(f, encoding="utf-8").read() for f in glob.glob(f"{V}/sources/design-2026-10-14-upload/*.dc.html"))
FLOWS = open(f"{V}/design-drive-2026-10-14/FLOWS-2026-10-14.md").read()
DOC = ("https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/"
       "v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md")
SHEET = "the WO Board design-differences question sheet for Chris Ward (19 Oct 2026)"
PRD_FROM = 'PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 66 (19 Oct 2026, Chris Ward), read 19 Oct 2026 · Epic SV-10043'
MARKER = "AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO"
BLOCKED = 'If any record above is missing, mark this test Blocked: "setup not done".'
SECTION = 73780
EXTRA = {"D11": [("Design — seen when driven (FLOWS-2026-10-14.md, W4)", "Row height: Small / Medium / Large (Large adds \"0.0 / 1.5 hrs\" under progress) · Tech View Columns · Board: \"Card size\" Compact / Detailed (no Columns, no Fields to display)")],
         "D14": [("Design — Work Orders Details.dc.html, groups while searching", "// A search or filter opens every group that still has a hit, so results aren't hidden behind a collapsed header."),
                 ("Design — Work Orders Details.dc.html, open rule", "const open = filtering ? true : !this.state.collapsed[g.id];")],
         "D16": [("Design — Work Orders.dc.html, first-run titles", 'const frTitle = noWo && noTech ? "Nothing here yet" : noWo ? "No work orders yet" : "No technicians yet";'),
                 ("Design — seen when driven (FLOWS-2026-10-14.md, W5)", "no-technicians → \"No technicians yet\" + \"Add technicians to assign work orders. Until then, every work order stays in Unassigned.\" + Add Technician")]}
e = lambda s: html.escape(s, quote=False)
def render(c, n):
    S = lambda x: x.replace("{N}", str(n))
    diffs = [DF.OPEN[[x["id"] for x in DF.OPEN].index(d)] for d in c["diffs"]]
    note = ("This case checks the DESIGN's version, which differs from the PRD: " + " ".join(f"{x['topic']}: the design shows {x['design']}; the PRD says {x['prd']}." for x in diffs)
            + f" It is held until Chris Ward rules on rows {', '.join(c['diffs'])} of {SHEET}. Do not run it while it is held. If he rules for the design, it is released; "
            "if he rules for the PRD, it is removed.")
    pre = [(S(a), S(b) if b else None) for a, b in c["pre"]] + [(BLOCKED, None)]
    dq = [q for x in diffs for q in x["D"]] + [q for d in c["diffs"] for q in EXTRA.get(d, [])]
    exp = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(S(r))}</li>" for r in c["res"]) + "</ul>" + f"<p>{e(note)}</p>"
           + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p><p>What the PRD says instead:</p>"
           + f"<p>From: {e(PRD_FROM)}</p><ul>" + "".join(f"<li><strong>{k}:</strong> &ldquo;{e(H.code(k))}&rdquo;</li>" for k in c["prdq"]) + "</ul>"
           + "<p>Not yet checked against a build.</p>"
           + "<p></p><p><strong>References from Design</strong></p>"
           + '<p>Claude Design project "Work Orders" (Branko Cicovic), export of 14 Oct 2026 (Work Orders.dc.html and its flows, driven 14 Oct 2026), read 19 Oct 2026: '
           + "the source of this case's expected results.</p><ul>" + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(q)}&rdquo;</li>" for l, q in dq) + "</ul><p></p>"
           + f"<p>{e(MARKER)}</p>")
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": "SV-10043", "custom_automation_type": 2, "custom_atmstatus": 1,
            "custom_preconds": (f'<p><strong><a href="{DOC}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
                                "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in pre) + "</ul>"),
            "custom_steps": "<ol>" + "".join(f"<li>{e(S(s))}</li>" for s in c["steps"]) + "</ol>", "custom_expected": exp}
probs = []
for c in H.CASES:
    k = c["key"]
    if len(c["title"]) > 80 or ";" in c["title"]: probs.append(f"{k} title")
    if len(c["res"]) != len(c["steps"]) or any(not r.startswith(f"Step {i}: ") for i, r in enumerate(c["res"], 1)): probs.append(f"{k} Step N")
    defined = set(re.findall(r"\{([A-Z][^{}]+)\}", " ".join(a for a, _ in c["pre"])))
    probs += [f"{k} {{{x}}} undefined" for x in set(re.findall(r"\{([A-Z][^{}]+)\}", " ".join(c["steps"] + c["res"]))) if x not in defined and x != "N"]
    if "ZZAUTOTEST" in " ".join([a for a, _ in c["pre"]] + c["steps"] + c["res"]): probs.append(f"{k} hard-coded record")
    for d in c["diffs"]:
        for l, q in [q for x in DF.OPEN if x["id"] == d for q in x["D"]] + EXTRA.get(d, []):
            if q not in (FLOWS if "seen when driven" in l else RAW): probs.append(f"{k} design quote {l} not verbatim")
print(len(H.CASES), "held cases; problems:", probs)
if probs or "--apply" not in sys.argv: sys.exit(1 if probs else 0)
os.makedirs(f"{D}/applied", exist_ok=True); log = open(f"{D}/applied/apply-log.jsonl", "a"); ids = {}
for c in H.CASES:
    n = api(f"add_case/{SECTION}", render(c, 0)); nid = n["id"]; ids[c["key"]] = nid
    f = render(c, nid); api(f"update_case/{nid}", f); st = LAST["status"]; a = api(f"get_case/{nid}")
    ok = all(a.get(x) == v for x, v in f.items()) and a["section_id"] == SECTION
    json.dump(a, open(f"{D}/applied/C{nid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "add_case+update(own number)", "key": c["key"], "case": f"C{nid}", "http": st, "readback_ok": ok}) + "\n"); log.flush(); print(c["key"], f"C{nid}", ok)
json.dump(ids, open(f"{D}/applied/held-case-ids.json", "w"), indent=1)
