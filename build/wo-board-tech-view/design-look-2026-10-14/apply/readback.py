#!/usr/bin/env python3
"""Independent read-back (Rule 50) of the 14 Oct design-case write: fresh GET of the 22 new cases and C581895, every written
field byte-for-byte against the intended content rebuilt from the proposals + doc-ids, one AUTOMATION marker and it is last,
section 73780 for the new cases, automation fields, attachments present (by name), the run-498 test id, and a render check of
the TestRail case page (UI login): the Preconditions link to the case's own doc shows and no raw tags show.
Writes applied/readback-design-2026-10-14.jsonl."""
import json, sys, re, importlib.util, urllib.request, urllib.parse, base64, http.cookiejar
H = "build/wo-board-tech-view/design-look-2026-10-14/apply"
C = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C.get('email') or C.get('user')}:{C['password']}".encode()).decode()
BASE = "https://shopview.testrail.io/index.php?"
def get(ep):
    r = urllib.request.Request(f"{BASE}/api/v2/{ep}", headers={"Authorization": "Basic " + AUTH})
    resp = urllib.request.urlopen(r, timeout=90); return resp.status, json.load(resp)
def load(fname):
    sys.argv = ["x", "--config", f"{H}/config.json", "--only", f"{H}/{fname}"]
    spec = importlib.util.spec_from_file_location("t" + fname[:-5].replace("-", "_"), f"{H}/apply_design.py"); t = importlib.util.module_from_spec(spec); spec.loader.exec_module(t); return t
td = load("proposals-design.json"); tu = load("proposals-c581895.json")
docs = {json.loads(l)["id"]: f"https://docs.google.com/document/d/{json.loads(l)['doc']}/edit" for l in open(f"{H}/doc-ids-0.jsonl") if l.strip()}
newids = json.load(open(f"{H}/applied/new-case-ids.json"))
snap = json.load(open(f"{H}/snapshots-before/C581895.json"))
tests, off = [], 0
while True:
    st, d = get(f"get_tests/498&limit=250&offset={off}"); page = d["tests"] if isinstance(d, dict) else d; tests += page
    if isinstance(d, dict) and d.get("_links", {}).get("next"): off += 250
    else: break
tid = {x["case_id"]: x["id"] for x in tests}
UI = json.load(open("/tmp/testrail/creds-ui.json"))
cj = http.cookiejar.CookieJar(); op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
ui_ok = False
try:
    op.open(f"{BASE}/auth/login/", data=urllib.parse.urlencode({"name": UI["email"], "password": UI["password"], "rememberme": "1"}).encode(), timeout=60).read(); ui_ok = True
except Exception as e:
    print("UI login failed:", type(e).__name__)
items = [(newids[k], p, pay, "new", td) for k, sec, p, pay in td.news] + [(cid, p, pay, "upd", tu) for cid, p, pay in tu.plans]
rows = []
for cid, p, pay, kind, t in items:
    st, a = get(f"get_case/{cid}")
    want = dict(pay, custom_preconds=t.preconds(p, docs[f"C{cid}"]))
    fields = {x: a.get(x) == v for x, v in want.items()}
    exp_text = re.sub(r"<[^>]+>", "\n", a["custom_expected"]); markers = re.findall(r"AUTOMATION:[^\n]*", exp_text)
    last = [l for l in exp_text.split("\n") if l.strip()][-1]
    sta, att = get(f"get_attachments_for_case/{cid}"); att = att.get("attachments", att) if isinstance(att, dict) else att
    names = sorted({x.get("name") for x in att})
    row = {"op": "readback", "case": f"C{cid}", "kind": kind, "http": st, "fields_match": fields, "marker": markers,
           "marker_unique_and_last": len(markers) == 1 and last.startswith("AUTOMATION:"), "created_by": a["created_by"], "section_id": a["section_id"],
           "custom_atmstatus": a["custom_atmstatus"], "custom_automation_type": a["custom_automation_type"], "title": a["title"],
           "attachments": names, "attachments_ok": all(x in names for x in p.get("pictures", [])), "run498_test": tid.get(cid)}
    if kind == "new": row["section_ok"] = a["section_id"] == 73780
    else:
        row["automation_fields_unchanged"] = (a["custom_atmstatus"], a["custom_automation_type"]) == (snap["custom_atmstatus"], snap["custom_automation_type"])
        row["section_unchanged"] = a["section_id"] == snap["section_id"]
    link_ok = a["custom_preconds"].startswith(f'<p><strong><a href="{docs[f"C{cid}"]}">Setup (manual QA tester and Claude session)</a></strong></p>')
    row["stored_link_ok"] = link_ok
    if ui_ok:
        try:
            page = op.open(f"{BASE}/cases/view/{cid}", timeout=60).read().decode("utf-8", "replace")
            row["rendered_link_ok"] = docs[f"C{cid}"] in page and "Setup (manual QA tester and Claude session)</a>" in page
            i = page.find("Setup (manual QA tester and Claude session)</a>"); seg = page[i:i + 3000] if i >= 0 else ""
            row["rendered_no_raw_tags"] = bool(seg) and "<li>" in seg and "&lt;li&gt;" not in seg and "&lt;p&gt;" not in seg
        except Exception as e:
            row["rendered_link_ok"] = f"error {type(e).__name__}"
    row["ok"] = (all(fields.values()) and row["marker_unique_and_last"] and row["attachments_ok"] and row.get("section_ok", True)
                 and row.get("automation_fields_unchanged", True) and row.get("section_unchanged", True) and link_ok and row["run498_test"] is not None
                 and row.get("rendered_link_ok", True) is True and row.get("rendered_no_raw_tags", True))
    rows.append(row)
with open(f"{H}/applied/readback-design-2026-10-14.jsonl", "w") as f:
    for r in rows: f.write(json.dumps(r) + "\n")
print("run 498 tests now:", len(tests), "· UI login:", ui_ok)
for r in rows: print(r["case"], "OK" if r["ok"] else "PROBLEM", r["marker"], "sec", r["section_id"], "att", len(r["attachments"]), "test", r["run498_test"], "render", r.get("rendered_link_ok"), r.get("rendered_no_raw_tags"))
