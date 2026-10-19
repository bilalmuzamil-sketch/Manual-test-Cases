#!/usr/bin/env python3
"""Build, check and (--apply) create the 4 sweep cases, add them to run 498 (union only), read back."""
import sys, os, re, json, html
D = os.path.dirname(os.path.abspath(__file__)); V = os.path.dirname(D)
sys.path.insert(0, f"{V}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
import cases as M
PRD = open(f"{V}/sv11522-11524-2026-10-19/CONFLUENCE-845185030-v66-2026-10-19.md").read()
DS = open(f"{V}/sources/design-2026-10-14-upload/_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bundle.js", encoding="utf-8", errors="replace").read()
def code(c): return re.search(r"^- \*\*" + re.escape(c) + r":\*\*\s*(.*)$", PRD, re.M).group(1).replace("**", "").strip()
DOC = ("https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/"
       "v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md")
PRD_FROM = 'PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 66 (19 Oct 2026, Chris Ward), read 19 Oct 2026'
BLOCKED = 'If any record above is missing, mark this test Blocked: "setup not done".'
RUN = 498
e = lambda s: html.escape(s, quote=False)
def render(c, n):
    S = lambda x: x.replace("{N}", str(n))
    tickets = "Epic SV-10043, " + ", ".join(f"story {k} ({t})" for k, t in c["stories"]) + f"; ticket {c['ticket']}"
    exp = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(S(r))}</li>" for r in c["res"]) + "</ul>"
           + (f"<p>{e(c['known'])}</p>" if c["known"] else "")
           + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
           + f"<p>From: {e(PRD_FROM)} &middot; {e(tickets)}</p><ul>" + "".join(f"<li><strong>{k}:</strong> &ldquo;{e(code(k))}&rdquo;</li>" for k in c["q"]) + "</ul>"
           + "<p>Not yet checked against a build.</p>")
    if c.get("design"):
        ref, dq = c["design"]
        exp += ("<p></p><p><strong>References from Design</strong></p>" + f"<p>{e(ref)}</p><ul>"
                + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(q)}&rdquo;</li>" for l, q in dq) + "</ul><p></p>")
    exp += f"<p>{e(c['marker'])}</p>"
    refs = ",".join([k for k, _ in c["stories"]] + [c["ticket"]])
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs, "custom_automation_type": 2, "custom_atmstatus": 1,
            "custom_preconds": (f'<p><strong><a href="{DOC}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
                                "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(S(a))}" + (f"<br>{e(S(b))}" if b else "") + "</li>" for a, b in c["pre"] + [(BLOCKED, None)]) + "</ul>"),
            "custom_steps": "<ol>" + "".join(f"<li>{e(S(s))}</li>" for s in c["steps"]) + "</ol>", "custom_expected": exp}
probs = []
for c in M.CASES:
    k = c["key"]
    if len(c["res"]) != len(c["steps"]) or any(not r.startswith(f"Step {i}: ") for i, r in enumerate(c["res"], 1)): probs.append(f"{k} Step N")
    defined = set(re.findall(r"\{([A-Z][^{}]+)\}", " ".join(a for a, _ in c["pre"])))
    probs += [f"{k} {{{x}}} undefined" for x in set(re.findall(r"\{([A-Z][^{}]+)\}", " ".join(c["steps"] + c["res"]))) if x not in defined]
    if "ZZAUTOTEST" in " ".join([a for a, _ in c["pre"]] + c["steps"] + c["res"]): probs.append(f"{k} hard-coded record")
    for q in c["q"]: code(q)
    for l, q in (c.get("design") or ("", []))[1]:
        if q not in DS: probs.append(f"{k} design quote not verbatim")
print(len(M.CASES), "cases; problems:", probs)
if probs or "--apply" not in sys.argv: sys.exit(1 if probs else 0)
os.makedirs(f"{D}/applied", exist_ok=True); log = open(f"{D}/applied/apply-log.jsonl", "a"); ids = {}
for c in M.CASES:
    n = api(f"add_case/{c['sec']}", render(c, 0)); nid = n["id"]; ids[c["key"]] = nid
    f = render(c, nid); api(f"update_case/{nid}", f); st = LAST["status"]; a = api(f"get_case/{nid}")
    ok = all(a.get(x) == v for x, v in f.items()) and a["section_id"] == c["sec"]
    json.dump(a, open(f"{D}/applied/C{nid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "add_case+update", "key": c["key"], "ticket": c["ticket"], "case": f"C{nid}", "http": st, "readback_ok": ok}) + "\n"); log.flush(); print(c["key"], f"C{nid}", ok)
def tests():
    out, off = [], 0
    while True:
        d = api(f"get_tests/{RUN}&limit=250&offset={off}"); out += d["tests"] if isinstance(d, dict) else d
        if isinstance(d, dict) and d.get("_links", {}).get("next"): off += 250
        else: return out
b = tests(); bi = sorted({t["case_id"] for t in b}); bs = {t["case_id"]: (t["id"], t["status_id"]) for t in b}
api(f"update_run/{RUN}", {"include_all": False, "case_ids": sorted(set(bi) | set(ids.values()))}); st = LAST["status"]
aft = tests(); ai = sorted({t["case_id"] for t in aft}); as_ = {t["case_id"]: (t["id"], t["status_id"]) for t in aft}
r = {"op": "update_run", "http": st, "before": len(bi), "after": len(ai), "dropped": [x for x in bi if x not in ai], "changed": [x for x in bi if as_.get(x) != bs[x]],
     "tests": {k: as_[v][0] for k, v in ids.items() if v in as_}}
log.write(json.dumps(r) + "\n"); print(r)
json.dump({"cases": ids, "tests": r["tests"]}, open(f"{D}/applied/ids.json", "w"), indent=1)
