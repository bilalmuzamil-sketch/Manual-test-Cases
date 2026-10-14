#!/usr/bin/env python3
"""Independent read-back (Rule 50) of the 14 Oct WO write: fresh GET of every touched case, field-by-field compare with the
intended content rebuilt from proposals-A.json + doc-ids, marker unique and last, automation fields, and proof that the
two Vladimir cases are byte-identical to snapshots-before. Writes applied/readback-2026-10-14.jsonl."""
import json, sys, re, importlib.util, urllib.request, base64
H = "build/wo-board-tech-view/currency-2026-10-14/apply"
C = json.load(open("/tmp/testrail/creds.json")); AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
def get(ep):
    r = urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/{ep}", headers={"Authorization": "Basic " + AUTH})
    resp = urllib.request.urlopen(r, timeout=90); return resp.status, json.load(resp)
sys.argv = ["x", "--config", f"{H}/config.json", "--only", f"{H}/proposals-A.json"]
spec = importlib.util.spec_from_file_location("t", f"{H}/apply_wo.py"); t = importlib.util.module_from_spec(spec); spec.loader.exec_module(t)
docs = {json.loads(l)["id"]: f"https://docs.google.com/document/d/{json.loads(l)['doc']}/edit" for l in open(f"{H}/doc-ids-0.jsonl")}
newids = json.load(open(f"{H}/applied/new-case-ids.json"))
rows = []
items = [(cid, p, pay) for cid, p, pay in t.plans] + [(newids[k], p, pay) for k, sec, p, pay in t.news]
for cid, p, pay in items:
    st, a = get(f"get_case/{cid}")
    want = dict(pay, custom_preconds=t.preconds(p, docs[f"C{cid}"]))
    fields = {x: a.get(x) == v for x, v in want.items()}
    exp_text = re.sub(r"<[^>]+>", "\n", a["custom_expected"]); markers = re.findall(r"AUTOMATION:[^\n]*", exp_text)
    last = [l for l in exp_text.split("\n") if l.strip()][-1]
    snap = json.load(open(f"{H}/snapshots-before/C{cid}.json")) if str(cid) in ("154648", "368133", "96965") else None
    row = {"op": "readback", "case": f"C{cid}", "http": st, "fields_match": fields, "marker": markers, "marker_unique_and_last": len(markers) == 1 and last.startswith("AUTOMATION:"),
           "created_by": a["created_by"], "section_id": a["section_id"], "custom_atmstatus": a["custom_atmstatus"], "custom_automation_type": a["custom_automation_type"],
           "type_id": a["type_id"], "priority_id": a["priority_id"]}
    if snap: row["automation_fields_unchanged"] = (a["custom_atmstatus"], a["custom_automation_type"]) == (snap["custom_atmstatus"], snap["custom_automation_type"]); row["section_unchanged"] = a["section_id"] == snap["section_id"]
    row["ok"] = all(fields.values()) and row["marker_unique_and_last"] and row.get("automation_fields_unchanged", True) and row.get("section_unchanged", True)
    rows.append(row)
for cid in (236975, 236976):
    st, a = get(f"get_case/{cid}"); snap = json.load(open(f"build/wo-board-tech-view/currency-2026-10-14/snapshots-before/C{cid}.json"))
    diff = [k for k in snap if a.get(k) != snap.get(k)]
    rows.append({"op": "untouched_check", "case": f"C{cid}", "http": st, "created_by": a["created_by"], "differs_from_snapshot": diff, "ok": not diff})
with open(f"{H}/applied/readback-2026-10-14.jsonl", "w") as f:
    for r in rows: f.write(json.dumps(r) + "\n")
for r in rows: print(r["case"], r["op"], "OK" if r["ok"] else "PROBLEM", {k: v for k, v in r.items() if k in ("marker", "custom_atmstatus", "custom_automation_type", "differs_from_snapshot", "section_id")})
