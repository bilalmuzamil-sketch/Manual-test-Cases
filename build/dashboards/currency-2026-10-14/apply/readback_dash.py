#!/usr/bin/env python3
"""Independent read-back (Rules 41/50) of the Dashboard write of 14 Oct 2026: fresh GET of every touched case; every intended field
compared byte for byte with the payload rebuilt from proposals-dash.json + doc-ids-0.jsonl; every other field of the 8 edited cases
compared with snapshots-after-answers (only updated_on/updated_by/version may differ); marker unique and last; the 17 new cases'
section and fields; then every OTHER case of group 12166 (all sections, fully paged) proven byte-identical to snapshots-after-answers,
updated_on included. Writes applied/readback-2026-10-14.jsonl."""
import json, sys, re, importlib.util, glob
H = "build/dashboards/currency-2026-10-14/apply"; SNAP = "build/dashboards/currency-2026-10-14/snapshots-after-answers"
sys.path.insert(0, H); from trlib import api, LAST
sys.argv = ["x", "--config", f"{H}/config.json"]
spec = importlib.util.spec_from_file_location("t", f"{H}/apply_dash.py"); t = importlib.util.module_from_spec(spec); spec.loader.exec_module(t)
docs = {json.loads(l)["id"]: f"https://docs.google.com/document/d/{json.loads(l)['doc']}/edit" for l in open(f"{H}/doc-ids-0.jsonl")}
newids = json.load(open(f"{H}/applied/new-case-ids.json"))
SYS = ("updated_on", "updated_by", "version")
def marker_info(exp):
    txt = re.sub(r"<[^>]+>", "\n", exp); m = re.findall(r"AUTOMATION:[^\n]*", txt)
    return m, len(m) == 1 and [l for l in txt.split("\n") if l.strip()][-1].startswith("AUTOMATION:")
rows, touched = [], set()
items = [(cid, p, pay, "upd") for cid, p, pay in t.plans] + [(newids[k], p, pay, "new") for k, sec, p, pay in t.news]
for cid, p, pay, kind in items:
    touched.add(cid); a = api(f"get_case/{cid}"); st = LAST["status"]
    want = dict(pay, custom_preconds=t.preconds(p, docs[f"C{cid}"]))
    fields = {x: a.get(x) == v for x, v in want.items()}
    m, last = marker_info(a["custom_expected"])
    row = {"op": "readback", "case": f"C{cid}", "http": st, "fields_match": fields, "marker": m, "marker_unique_and_last": last,
           "created_by": a["created_by"], "updated_by": a["updated_by"], "section_id": a["section_id"], "custom_atmstatus": a["custom_atmstatus"],
           "custom_automation_type": a["custom_automation_type"], "type_id": a["type_id"], "priority_id": a["priority_id"], "template_id": a["template_id"],
           "doc": docs[f"C{cid}"]}
    if kind == "upd":
        s = json.load(open(f"{SNAP}/C{cid}.json"))
        row["other_fields_changed"] = [k for k in s if k not in want and k not in SYS and a.get(k) != s.get(k)]
        row["stamp_kept"] = (p.get("stamp") in a["custom_expected"]) if p.get("stamp") else None
    else:
        row["other_fields_changed"] = [] if a["section_id"] == p["section_id"] else ["section_id"]
        row["new_case_fields_ok"] = all(a.get(k) == v for k, v in t.CFG["NEW_CASE_FIELDS"].items())
    row["ok"] = all(fields.values()) and last and not row["other_fields_changed"] and a["created_by"] == 3 and a["updated_by"] == 3 and row.get("new_case_fields_ok", True)
    rows.append(row)
# every other case in group 12166: byte-identical to the baseline, updated_on included
snap = {json.load(open(f))["id"]: json.load(open(f)) for f in glob.glob(f"{SNAP}/C*.json")}
secs = sorted({s["section_id"] for s in snap.values()})
live = {}
for sec in secs:
    off = 0
    while True:
        d = api(f"get_cases/1&section_id={sec}&limit=250&offset={off}"); page = d["cases"] if isinstance(d, dict) else d
        for c in page: live[c["id"]] = c
        if isinstance(d, dict) and d.get("_links", {}).get("next"): off += 250
        else: break
others = sorted(set(snap) - touched)
for cid in others:
    a, s = live.get(cid), snap[cid]
    diff = ["MISSING"] if a is None else [k for k in set(s) | set(a) if a.get(k) != s.get(k)]
    rows.append({"op": "untouched_check", "case": f"C{cid}", "created_by": s["created_by"], "updated_by_live": None if a is None else a.get("updated_by"), "differs_from_snapshot": diff, "ok": not diff})
extra = sorted(set(live) - set(snap) - set(newids.values()))
rows.append({"op": "suite_census", "sections": len(secs), "live_cases": len(live), "baseline": len(snap), "new": len(newids), "unexpected_new_cases": extra,
             "ok": len(live) == len(snap) + len(newids) and not extra})
with open(f"{H}/applied/readback-2026-10-14.jsonl", "w") as f:
    for x in rows: f.write(json.dumps(x, ensure_ascii=False) + "\n")
for x in rows:
    if x["op"] == "readback": print(x["case"], "OK" if x["ok"] else "PROBLEM", x["marker"], "atm", x["custom_atmstatus"], "type", x["custom_automation_type"], "sec", x["section_id"], "stamp", x.get("stamp_kept"), x["other_fields_changed"])
bad = [x for x in rows if x["op"] == "untouched_check" and not x["ok"]]
print("untouched others:", len(others), "differing:", [(x["case"], x["differs_from_snapshot"]) for x in bad])
print(rows[-1])
