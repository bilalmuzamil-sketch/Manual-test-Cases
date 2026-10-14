#!/usr/bin/env python3
"""Independent read-back of the C97010 rewrite (third batch, 14 Oct 2026): every written field against the payload rebuilt from
proposals-v49-c.json + doc-ids-2; every other field against the lock snapshot (lock-c/C97010.json); the kept build stamp and marker;
Vladimir's cases and the other 10 cases this pass wrote unchanged since their snapshots. Writes applied/readback-2026-10-14-v49-c.jsonl."""
import json, sys, re, importlib.util, glob
H = "build/wo-board-tech-view/currency-2026-10-14/apply-v49"; SNAP = "build/wo-board-tech-view/currency-2026-10-14/snapshots-after-answers"
sys.path.insert(0, H); from trlib import api, LAST
sys.argv = ["x", "--config", f"{H}/config.json", "--only", f"{H}/proposals-v49-c.json"]
spec = importlib.util.spec_from_file_location("t", f"{H}/apply_wo.py"); t = importlib.util.module_from_spec(spec); spec.loader.exec_module(t)
docs = {json.loads(l)["id"]: f"https://docs.google.com/document/d/{json.loads(l)['doc']}/edit" for f in glob.glob(f"{H}/doc-ids-*.jsonl") for l in open(f)}
rows = []
for cid, p, pay in t.plans:
    a = api(f"get_case/{cid}"); st = LAST["status"]; s = json.load(open(f"{H}/lock-c/C{cid}.json"))
    want = dict(pay, custom_preconds=t.preconds(p, docs[f"C{cid}"])); f = {x: a.get(x) == v for x, v in want.items()}
    txt = re.sub(r"<[^>]+>", "\n", a["custom_expected"]); m = re.findall(r"AUTOMATION:[^\n]*", txt)
    last = len(m) == 1 and [l for l in txt.split("\n") if l.strip()][-1].startswith("AUTOMATION:")
    other = [k for k in s if k not in want and k not in ("updated_on", "updated_by", "version") and a.get(k) != s.get(k)]
    rows.append({"op": "readback", "case": f"C{cid}", "http": st, "fields_match": f, "other_fields_changed": other, "marker": m, "marker_unique_and_last": last,
                 "stamp_kept": "<p>Last checked against build v26.40.8-7a95011 on 10/8/2026.</p><p>AUTOMATION: READY</p>" in a["custom_expected"],
                 "network_step_gone": "network" not in (a["custom_steps"] + a["custom_expected"]).lower(),
                 "custom_atmstatus": a["custom_atmstatus"], "custom_automation_type": a["custom_automation_type"], "section_id": a["section_id"], "title": a["title"],
                 "ok": all(f.values()) and not other and last})
for s in (json.load(open(f)) for f in glob.glob(f"{SNAP}/C*.json")):
    if s["created_by"] == 3: continue
    a = api(f"get_case/{s['id']}"); d = [k for k in set(a) | set(s) if a.get(k) != s.get(k)]
    rows.append({"op": "untouched_check_vladimir", "case": f"C{s['id']}", "differs_from_snapshot": d, "ok": not d})
for f in sorted(glob.glob(f"{H}/snapshots-after-v49/C*.json")):
    s = json.load(open(f))
    if s["id"] == 97010: continue
    a = api(f"get_case/{s['id']}"); d = [k for k in set(a) | set(s) if a.get(k) != s.get(k)]
    rows.append({"op": "untouched_check_pass", "case": f"C{s['id']}", "differs_from_snapshot": d, "ok": not d})
with open(f"{H}/applied/readback-2026-10-14-v49-c.jsonl", "w") as fo:
    for x in rows: fo.write(json.dumps(x, ensure_ascii=False) + "\n")
bad = [x for x in rows if not x["ok"]]
print(json.dumps(rows[0], ensure_ascii=False)[:900]); print("untouched checks:", len(rows) - 1, "problems:", [x["case"] for x in bad])
