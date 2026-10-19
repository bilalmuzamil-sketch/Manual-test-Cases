#!/usr/bin/env python3
"""Build, check and (--apply) create the SV-11119 and SV-11087 cases. Run sync is done separately (one union update)."""
import sys, os, re, json, html
D = os.path.dirname(os.path.abspath(__file__)); V = os.path.dirname(D)
sys.path.insert(0, f"{V}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
import cases as M
PRD = open(f"{V}/prd-v68-2026-10-19/CONFLUENCE-845185030-v68-2026-10-19.md").read()
JIRA = json.load(open(f"{D}/SV-11087-comments.json"))
def code(c): return re.search(r"^- \*\*" + re.escape(c) + r":\*\*\s*(.*)$", PRD, re.M).group(1).replace("**", "").strip()
DOC = ("https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/"
       "v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md")
PRD_FROM = 'PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 68 (19 Oct 2026, Chris Ward), read 19 Oct 2026'
BLOCKED = 'If any record above is missing, mark this test Blocked: "setup not done".'
e = lambda s: html.escape(s, quote=False)
def render(c, n):
    S = lambda x: x.replace("{N}", str(n))
    exp = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(S(r))}</li>" for r in c["res"]) + "</ul>"
           + f"<p>{e(c['known'])}</p><p><strong>Exact quotes from the source (for reproducibility)</strong></p>")
    if c.get("q"):
        tickets = "Epic SV-10043, " + ", ".join(f"story {k} ({t})" for k, t in c["stories"]) + f"; ticket {c['ticket']}"
        exp += f"<p>From: {e(PRD_FROM)} &middot; {e(tickets)}</p><ul>" + "".join(f"<li><strong>{k}:</strong> &ldquo;{e(code(k))}&rdquo;</li>" for k in c["q"]) + "</ul>"
    for i, (frm, q) in enumerate(c.get("quotes", [])):
        exp += f"<p>From: {e(frm)}" + (" &middot; Epic SV-10043; ticket SV-11087" if i == 0 else "") + f"</p><ul><li>&ldquo;{e(q)}&rdquo;</li></ul>"
    exp += "<p>Not yet checked against a build.</p>" + f"<p></p><p>{e(c['marker'])}</p>"
    refs = ",".join(["SV-10043"] + [k for k, _ in c["stories"]] + [c["ticket"]])
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs, "custom_automation_type": 2, "custom_atmstatus": 1,
            "custom_preconds": (f'<p><strong><a href="{DOC}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
                                "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(S(a))}" + (f"<br>{e(S(b))}" if b else "") + "</li>" for a, b in c["pre"] + [(BLOCKED, None)]) + "</ul>"),
            "custom_steps": "<ol>" + "".join(f"<li>{e(S(s))}</li>" for s in c["steps"]) + "</ol>", "custom_expected": exp}
probs = []
for c in M.CASES:
    k = c["key"]
    if len(c["res"]) != len(c["steps"]) or any(not r.startswith(f"Step {i}: ") for i, r in enumerate(c["res"], 1)): probs.append(f"{k} Step N")
    if len(c["steps"]) > 10: probs.append(f"{k} over 10 steps")
    if len(c["title"]) > 80 or ";" in c["title"]: probs.append(f"{k} title")
    defined = set(re.findall(r"\{([A-Z][^{}]+)\}", " ".join(a for a, _ in c["pre"])))
    probs += [f"{k} {{{x}}} undefined" for x in set(re.findall(r"\{([A-Z][^{}]+)\}", " ".join(c["steps"] + c["res"] + [c["known"]]))) if x not in defined]
    for q in c.get("q", []): code(q)
    for frm, q in c.get("quotes", []):
        if not any(q.replace("'", "&#039;") in b or q in html.unescape(re.sub(r"<[^>]+>", "", b)) for b in JIRA): probs.append(f"{k} Jira quote not verbatim: {q[:40]}")
print(len(M.CASES), "cases; problems:", probs)
if probs or "--apply" not in sys.argv: sys.exit(1 if probs else 0)
os.makedirs(f"{D}/applied", exist_ok=True); log = open(f"{D}/applied/apply-log.jsonl", "a"); ids = {}
for c in M.CASES:
    n = api(f"add_case/{c['sec']}", render(c, 0)); nid = n["id"]; ids[c["key"]] = nid
    f = render(c, nid); api(f"update_case/{nid}", f); st = LAST["status"]; a = api(f"get_case/{nid}")
    ok = all(a.get(x) == v for x, v in f.items()) and a["section_id"] == c["sec"]
    json.dump(a, open(f"{D}/applied/C{nid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "add_case+update", "key": k, "ticket": c["ticket"], "case": f"C{nid}", "http": st, "readback_ok": ok}) + "\n"); log.flush(); print(c["key"], f"C{nid}", ok)
json.dump(ids, open(f"{D}/applied/ids.json", "w"), indent=1)
