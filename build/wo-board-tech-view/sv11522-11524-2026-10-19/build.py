#!/usr/bin/env python3
"""Build, check and (with --apply) create the SV-11522 / SV-11524 cases in WO Board section 13239 (Story 4), attach the design picture,
add them to run 498 (union only) and read everything back. Layout: Rule 117 ninth (two-audience), tenth (References from Design) and
eleventh (From lines, no Source paragraph) amendments."""
import sys, os, re, json, html, base64, uuid, urllib.request, time
D = os.path.dirname(os.path.abspath(__file__)); V = os.path.dirname(D)
sys.path.insert(0, f"{V}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
import cases as M
DES = open(f"{V}/sources/design-2026-10-14-upload/Work Orders.dc.html", encoding="utf-8").read()
PIC = f"{V}/design-look-2026-10-14/compare"
DOC = ("https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/build/wo-board-tech-view/"
       "v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md")
PRD_FROM = 'PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 66 (19 Oct 2026, Chris Ward), read 19 Oct 2026'
BLOCKED = 'If any record above is missing, mark this test Blocked: "setup not done".'
SECTION, RUN = 13239, 498
e = lambda s: html.escape(s, quote=False)
def ws(s): return re.sub(r"\s+", " ", html.unescape(s).replace("**", "").replace("\\", "")).strip()
def sub(x, n): return x.replace("{N}", str(n))
def render(c, n):
    S = lambda x: sub(x, n)
    pre = [(S(a), S(b) if b else None) for a, b in c["pre"]] + [(BLOCKED, None)]
    tickets = "Epic SV-10043, " + ", ".join(f"story {k} ({t})" for _, k, t in c["stories"]) + "; tickets SV-11522 (Tech View) and SV-11524 (Board View)"
    exp = ("<p><strong>Expected results</strong></p><ul>" + "".join(f"<li>{e(S(r))}</li>" for r in c["res"]) + "</ul>"
           + f"<p>{e(c['known'])}</p>" + (f"<p>{e(c['note'])}</p>" if c.get("note") else "")
           + "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
           + f"<p>From: {e(PRD_FROM)} &middot; {e(tickets)}</p><ul>"
           + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(q)}&rdquo;</li>" for l, q in c["q"]) + "</ul>"
           + "<p>Not yet checked against a build.</p>")
    d = c.get("design")
    if d:
        exp += ("<p></p><p><strong>References from Design</strong></p>" + f"<p>{e(d['ref'])}</p>"
                + "<p>Design pictures attached to this case: " + e(", ".join(c["pictures"])) + ".</p>"
                + f"<p><strong>Where the design and the PRD differ:</strong> {e(d['diff'])}</p><ul>"
                + "".join(f"<li><strong>{e(l)}:</strong> &ldquo;{e(q)}&rdquo;</li>" for l, q in d["quotes"]) + "</ul><p></p>")
    exp += f"<p>{e(c['marker'])}</p>"
    refs = ",".join([k for _, k, _ in c["stories"]] + ["SV-11522", "SV-11524"])
    return {"title": c["title"], "template_id": 1, "type_id": 7, "priority_id": 2, "refs": refs, "custom_automation_type": 2, "custom_atmstatus": 1,
            "custom_preconds": (f'<p><strong><a href="{DOC}">Setup file (for Claude sessions; a tester does not need it)</a></strong></p><p></p>'
                                "<p><strong>Preconditions</strong></p><ul>" + "".join(f"<li>{e(a)}" + (f"<br>{e(b)}" if b else "") + "</li>" for a, b in pre) + "</ul>"),
            "custom_steps": "<ol>" + "".join(f"<li>{e(S(s))}</li>" for s in c["steps"]) + "</ol>", "custom_expected": exp}
def check(c):
    p, k = [], c["key"]
    if len(c["title"]) > 80 or ";" in c["title"]: p.append("title")
    if len(c["pre"]) + 1 > 7 or len(c["steps"]) > 10: p.append("limits")
    if len(c["res"]) != len(c["steps"]) or any(not r.startswith(f"Step {i}: ") for i, r in enumerate(c["res"], 1)): p.append("Step N lines")
    defined = set(re.findall(r"\{([A-Z][^{}]+)\}", " ".join(a for a, _ in c["pre"])))
    p += [f"{{{x}}} undefined" for x in set(re.findall(r"\{([A-Z][^{}]+)\}", " ".join(c["steps"] + c["res"]))) if x not in defined]
    if "ZZAUTOTEST" in " ".join([a for a, _ in c["pre"]] + c["steps"] + c["res"]): p.append("hard-coded record in tester text")
    for a, b in c["pre"]:
        if b and not b.startswith("For example:"): p.append("example line")
    for l, q in c["q"]:
        if ws(q) not in ws(M.PRD): p.append(f"quote {l} not verbatim in PRD v66")
    for l, q in (c.get("design") or {}).get("quotes", []):
        if q not in DES: p.append(f"design quote {l} not verbatim")
    for pic in c.get("pictures", []):
        if not os.path.exists(f"{PIC}/{pic}"): p.append(f"picture {pic} missing")
        if pic not in " ".join(a for a, _ in c["pre"]): p.append(f"picture {pic} not named in preconditions")
    h = render(c, 1)["custom_expected"]
    if "Source &mdash;" in h: p.append("separate Source paragraph")
    top = h.split("References from Design")[0].split("Exact quotes")[0]
    if re.search(r"\bdesign\b|\bpicture", re.sub(r"<[^>]+>", " ", top.split("</ul>", 1)[1]), re.I) and "References from Design" in h: p.append("design words above the design block")
    return [f"{k}: {x}" for x in p]
probs = [x for c in M.CASES for x in check(c)]
for x in probs: print("PROBLEM", x)
print(len(M.CASES), "cases;", "problems:", len(probs))
if probs or "--apply" not in sys.argv: sys.exit(1 if probs else 0)
os.makedirs(f"{D}/applied", exist_ok=True); log = open(f"{D}/applied/apply-log.jsonl", "a")
def L(r): log.write(json.dumps(r, ensure_ascii=False) + "\n"); log.flush(); print(r)
C_ = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C_.get('email') or C_.get('user')}:{C_['password']}".encode()).decode()
def upload(cid, path):
    b = uuid.uuid4().hex; body = (f"--{b}\r\nContent-Disposition: form-data; name=\"attachment\"; filename=\"{os.path.basename(path)}\"\r\nContent-Type: image/png\r\n\r\n").encode() + open(path, "rb").read() + f"\r\n--{b}--\r\n".encode()
    r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/add_attachment_to_case/{cid}", data=body, headers={"Authorization": "Basic " + AUTH, "Content-Type": f"multipart/form-data; boundary={b}"})
    for a in range(4):
        try: x = urllib.request.urlopen(r, timeout=120); return x.status
        except Exception as ex:
            if a == 3: return str(ex)[:120]
            time.sleep(3 * (a + 1))
ids = {}
for c in M.CASES:
    n = api(f"add_case/{SECTION}", render(c, 0)); nid = n["id"]; ids[c["key"]] = nid; L({"op": "add_case", "key": c["key"], "case": f"C{nid}", "http": LAST["status"]})
    f = render(c, nid); api(f"update_case/{nid}", f); st = LAST["status"]
    for pic in c.get("pictures", []): L({"op": "add_attachment_to_case", "case": f"C{nid}", "file": pic, "result": upload(nid, f"{PIC}/{pic}")})
    a = api(f"get_case/{nid}"); json.dump(a, open(f"{D}/applied/C{nid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "update_case(own number)", "case": f"C{nid}", "http": st, "fields_ok": all(a.get(k) == v for k, v in f.items()), "section_ok": a["section_id"] == SECTION})
json.dump(ids, open(f"{D}/applied/new-case-ids.json", "w"), indent=1)
def tests():
    out, off = [], 0
    while True:
        d = api(f"get_tests/{RUN}&limit=250&offset={off}"); out += d["tests"] if isinstance(d, dict) else d
        if isinstance(d, dict) and d.get("_links", {}).get("next"): off += 250
        else: return out
run = api(f"get_run/{RUN}")
if run["is_completed"] or run["include_all"]: L({"op": "run_refused"}); sys.exit(1)
b = tests(); bi = sorted({t["case_id"] for t in b}); bs = {t["case_id"]: (t["id"], t["status_id"]) for t in b}
api(f"update_run/{RUN}", {"include_all": False, "case_ids": sorted(set(bi) | set(ids.values()))}); st = LAST["status"]
aft = tests(); ai = sorted({t["case_id"] for t in aft}); as_ = {t["case_id"]: (t["id"], t["status_id"]) for t in aft}
tl = {k: as_[v][0] for k, v in ids.items() if v in as_}
L({"op": "update_run", "run": RUN, "http": st, "before": len(bi), "after": len(ai), "dropped": [x for x in bi if x not in ai],
   "changed": [x for x in bi if as_.get(x) != bs[x]], "tests": tl})
json.dump({"cases": ids, "tests": tl}, open(f"{D}/applied/new-case-ids.json", "w"), indent=1)
