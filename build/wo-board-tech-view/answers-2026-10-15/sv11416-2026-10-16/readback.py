#!/usr/bin/env python3
"""Independent read-back (Rule 50) of the 16 Oct SV-11416 case (PRD v58): fresh GET of every touched case, field-by-field compare with the
intended content rebuilt from proposals-sv11416.json + doc-ids, marker unique and last, automation fields unchanged vs the
snapshot, then a render check: the TestRail case page (UI login) shows the Preconditions link to the case's own doc.
Also re-reads run 498 and records each case's test id. Writes applied/readback-sv11416-2026-10-16.jsonl."""
import json, sys, re, importlib.util, urllib.request, urllib.parse, base64, http.cookiejar
H = "build/wo-board-tech-view/answers-2026-10-15/sv11416-2026-10-16"
C = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C.get('email') or C.get('user')}:{C['password']}".encode()).decode()
BASE = "https://shopview.testrail.io/index.php?"
def get(ep):
    r = urllib.request.Request(f"{BASE}/api/v2/{ep}", headers={"Authorization": "Basic " + AUTH})
    resp = urllib.request.urlopen(r, timeout=90); return resp.status, json.load(resp)
sys.argv = ["x", "--config", f"{H}/config.json", "--only", f"{H}/proposals-sv11416.json"]
spec = importlib.util.spec_from_file_location("t", f"{H}/apply_answers.py"); t = importlib.util.module_from_spec(spec); spec.loader.exec_module(t)
docs = {json.loads(l)["id"]: f"https://docs.google.com/document/d/{json.loads(l)['doc']}/edit" for l in open(f"{H}/doc-ids-0.jsonl") if l.strip()}
newids = json.load(open(f"{H}/applied/new-case-ids.json"))
for _c, _p, _ in t.plans:
    if _p.get("reuse_doc"): docs[f"C{_c}"] = _p["reuse_doc"]
snap = {c["id"]: c for c in json.load(open(f"{H}/snapshots-before/live-cases.json"))}
# run 498 tests (paged)
tests, off = [], 0
while True:
    st, d = get(f"get_tests/498&limit=250&offset={off}"); page = d["tests"] if isinstance(d, dict) else d; tests += page
    if isinstance(d, dict) and d.get("_links", {}).get("next"): off += 250
    else: break
tid = {x["case_id"]: x["id"] for x in tests}
# UI session for the render check
UI = json.load(open("/tmp/testrail/creds-ui.json"))
cj = http.cookiejar.CookieJar(); op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
ui_ok = False
try:
    op.open(f"{BASE}/auth/login/", data=urllib.parse.urlencode({"name": UI["email"], "password": UI["password"], "rememberme": "1"}).encode(), timeout=60).read()
    ui_ok = True
except Exception as e:
    print("UI login failed:", type(e).__name__)
rows = []
items = [(cid, p, pay, "upd") for cid, p, pay in t.plans] + [(newids[k], p, pay, "new") for k, sec, p, pay in t.news]
for cid, p, pay, kind in items:
    st, a = get(f"get_case/{cid}")
    want = dict(pay, custom_preconds=t.preconds(p, docs[f"C{cid}"]))
    fields = {x: a.get(x) == v for x, v in want.items()}
    exp_text = re.sub(r"<[^>]+>", "\n", a["custom_expected"]); markers = re.findall(r"AUTOMATION:[^\n]*", exp_text)
    last = [l for l in exp_text.split("\n") if l.strip()][-1]
    row = {"op": "readback", "case": f"C{cid}", "kind": kind, "http": st, "fields_match": fields, "marker": markers,
           "marker_unique_and_last": len(markers) == 1 and last.startswith("AUTOMATION:"), "created_by": a["created_by"],
           "section_id": a["section_id"], "custom_atmstatus": a["custom_atmstatus"], "custom_automation_type": a["custom_automation_type"],
           "title": a["title"], "run498_test": tid.get(cid)}
    if kind == "upd":
        s = snap[cid]
        row["automation_fields_unchanged"] = (a["custom_atmstatus"], a["custom_automation_type"]) == (s["custom_atmstatus"], s["custom_automation_type"])
        row["section_unchanged"] = a["section_id"] == s["section_id"]
    else:
        row["section_ok"] = a["section_id"] == 13238
    link_ok = a["custom_preconds"].startswith(f'<p><strong><a href="{docs[f"C{cid}"]}">Setup (manual QA tester and Claude session)</a></strong></p>')
    row["stored_link_ok"] = link_ok
    if ui_ok:
        try:
            page = op.open(f"{BASE}/cases/view/{cid}", timeout=60).read().decode("utf-8", "replace")
            row["rendered_link_ok"] = docs[f"C{cid}"] in page and "Setup (manual QA tester and Claude session)</a>" in page
            # escaped tags also appear inside the page's embedded JSON data (same on every case page); judge the visible block only
            i = page.find("Setup (manual QA tester and Claude session)</a>"); seg = page[i:i + 3000] if i >= 0 else ""
            row["rendered_no_raw_tags"] = bool(seg) and "<li>" in seg and "&lt;li&gt;" not in seg and "&lt;p&gt;" not in seg
        except Exception as e:
            row["rendered_link_ok"] = f"error {type(e).__name__}"
    row["ok"] = (all(fields.values()) and row["marker_unique_and_last"] and row.get("automation_fields_unchanged", True)
                 and row.get("section_unchanged", True) and row.get("section_ok", True) and link_ok and row["run498_test"] is not None
                 and row.get("rendered_link_ok", True) is True and row.get("rendered_no_raw_tags", True))
    rows.append(row)
with open(f"{H}/applied/readback-sv11416-2026-10-16.jsonl", "w") as f:
    for r in rows: f.write(json.dumps(r) + "\n")
print("run 498 tests now:", len(tests), "· UI login:", ui_ok)
for r in rows: print(r["case"], "OK" if r["ok"] else "PROBLEM", r["marker"], "atm", r["custom_atmstatus"], "sec", r["section_id"], "test", r["run498_test"], "render", r.get("rendered_link_ok"), r.get("rendered_no_raw_tags"))
