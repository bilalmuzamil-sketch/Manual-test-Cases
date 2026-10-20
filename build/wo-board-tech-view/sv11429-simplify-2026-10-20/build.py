#!/usr/bin/env python3
"""Build, check and (--apply) write the four converted cases (edit lock against before/, read back field by field)."""
import sys, os, re, json, html
sys.path.insert(0, "/home/user/Manual-test-Cases/build/dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
import cases as M
V = "/home/user/Manual-test-Cases/build/wo-board-tech-view/"
SRC = {k: re.sub(r"\s+", " ", open(V + p).read().replace("**", "")) for k, p in {
    "tech": "sources/Tech-Plan-Kanban-Tech-View-Display-Options-2026-10-08-upload.md", "dev": "sources/dev-regression-2026-10-08/Dev-regression-areas-reply-2026-10-08.md",
    "qa": "sources/dev-regression-2026-10-08/QA-Handoff-SV-10043-dev-test-plan-2026-10-08.md", "prd": "prd-v68-2026-10-19/CONFLUENCE-845185030-v68-2026-10-19.md"}.items()}
DOC = V.replace("/home/user/Manual-test-Cases/", "https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/") + "v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md"
BLOCKED = 'If any record above is missing, mark this test Blocked: "setup not done".'
e = lambda s: html.escape(s, quote=False)
def render(c):
    pre = (f'<p><strong><a href="{DOC}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p><p><strong>Preconditions</strong></p><ul>'
           + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in c["pre"] + [(BLOCKED, None)]) + "</ul>")
    steps = "<ol>" + "".join(f"<li>{e(s)}</li>" for s in c["steps"]) + "</ol>"
    exp = "<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(r)}</li>" for r in c["res"]) + "</ul>"
    if c["note"]: exp += f"<p>{e(c['note'])}</p>"
    exp += "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
    for frm, qs in c["quotes"]: exp += f"<p>From: {e(frm)}</p><ul>" + "".join(f"<li>{e(q)}</li>" for q in qs) + "</ul>"
    exp += "<p>Not yet checked against a build in this wording.</p><p></p><p>AUTOMATION: READY</p>"
    return {"title": c["title"], "custom_preconds": pre, "custom_steps": steps, "custom_expected": exp}
probs = []
for c in M.CASES:
    k = c["id"]
    if len(c["res"]) != len(c["steps"]) or any(not r.startswith(f"Step {i}: ") for i, r in enumerate(c["res"], 1)): probs.append(f"C{k} Step N")
    if len(c["title"]) > 80 or ";" in c["title"] or len(c["steps"]) > 10: probs.append(f"C{k} title/steps")
    defined = set(re.findall(r"\{([A-Z][^{}]+)\}", " ".join(a for a, _ in c["pre"])))
    probs += [f"C{k} {{{x}}} undefined" for x in set(re.findall(r"\{([A-Z][^{}]+)\}", " ".join(c["steps"] + c["res"]))) if x not in defined]
    for frm, qs in c["quotes"]:
        for q in qs:
            body = re.search(r"“(.*)”$", q).group(1)
            src = "tech" if q.startswith("Tech plan") else "dev" if q.startswith("Dev") else "qa" if q.startswith("QA") else "prd"
            b = re.sub(r"\s+", " ", body)
            if b not in SRC[src] and b.replace("`", "") not in SRC[src].replace("`", ""): probs.append(f"C{k} quote not in {src}: {b[:50]}")
    # every original quote is still there, word for word
    o = json.load(open(f"before/C{k}.json"))["case"]["custom_expected"]
    for q in re.findall(r"“(.*?)”(?=</li>)", html.unescape(o)):
        if q not in html.unescape(render(c)["custom_expected"]): probs.append(f"C{k} original quote dropped: {q[:50]}")
print(len(M.CASES), "cases; problems:", probs)
if probs or "--apply" not in sys.argv: sys.exit(1 if probs else 0)
n = lambda x: re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", x or ""))).strip(); log = []
for c in M.CASES:
    k = c["id"]; b = json.load(open(f"before/C{k}.json"))["case"]; cur = api(f"get_case/{k}")
    if cur["updated_on"] != b["updated_on"]: log.append(dict(case=k, op="SKIPPED: changed since snapshot")); continue
    f = render(c); api(f"update_case/{k}", f); st = LAST["status"]; a = api(f"get_case/{k}")
    ok = all(n(a[x]) == n(f[x]) for x in f); other = [x for x in cur if x not in f and x not in ("updated_on", "updated_by", "version") and cur[x] != a.get(x)]
    json.dump(a, open(f"applied/C{k}-after.json", "w"), indent=1, ensure_ascii=False)
    log.append(dict(case=k, op="update_case", http=st, readback_ok=ok, other_changed=other, automated=cur.get("custom_atmstatus") == 3))
json.dump(log, open("applied/log.json", "w"), indent=1); print(log)
