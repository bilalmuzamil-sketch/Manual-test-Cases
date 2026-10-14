#!/usr/bin/env python3
"""Independent read-back of the second batch (C368131 rewrite, C581891 and C97010 quote refresh), 14 Oct 2026, plus proof that
Vladimir's 18 cases and the first batch's 8 cases are unchanged since their last snapshot. Writes applied/readback-2026-10-14-v49-b.jsonl."""
import json, sys, re, importlib.util, glob
H = "build/wo-board-tech-view/currency-2026-10-14/apply-v49"; SNAP = "build/wo-board-tech-view/currency-2026-10-14/snapshots-after-answers"
sys.path.insert(0, H); from trlib import api, LAST
sys.argv = ["x", "--config", f"{H}/config.json", "--only", f"{H}/proposals-v49-b.json"]
spec = importlib.util.spec_from_file_location("t", f"{H}/apply_wo.py"); t = importlib.util.module_from_spec(spec); spec.loader.exec_module(t)
docs = {json.loads(l)["id"]: f"https://docs.google.com/document/d/{json.loads(l)['doc']}/edit" for f in glob.glob(f"{H}/doc-ids-*.jsonl") for l in open(f)}
SYS = ("updated_on", "updated_by", "version")
def mk(exp):
    txt = re.sub(r"<[^>]+>", "\n", exp); m = re.findall(r"AUTOMATION:[^\n]*", txt)
    return m, len(m) == 1 and [l for l in txt.split("\n") if l.strip()][-1].startswith("AUTOMATION:")
rows = []
for cid, p, pay in t.plans:
    a = api(f"get_case/{cid}"); st = LAST["status"]; s = json.load(open(f"{SNAP}/C{cid}.json"))
    want = dict(pay, custom_preconds=t.preconds(p, docs[f"C{cid}"])); f = {x: a.get(x) == v for x, v in want.items()}; m, last = mk(a["custom_expected"])
    other = [k for k in s if k not in want and k not in SYS and a.get(k) != s.get(k)]
    rows.append({"op": "readback", "case": f"C{cid}", "http": st, "fields_match": f, "other_fields_changed": other, "marker": m, "marker_unique_and_last": last,
                 "custom_atmstatus": a["custom_atmstatus"], "custom_automation_type": a["custom_automation_type"], "section_id": a["section_id"], "ok": all(f.values()) and not other and last})
src = open(f"{H}/refresh_quote_b.py").read().split("os.makedirs(")[0]; ns = {"__file__": f"{H}/refresh_quote_b.py"}; exec(compile(src, "rq", "exec"), ns)
for cid in (581891, 97010):
    s = json.load(open(f"{SNAP}/C{cid}.json")); a = api(f"get_case/{cid}"); st = LAST["status"]
    want = ns["plan"](cid, s["custom_expected"]); m, last = mk(a["custom_expected"])
    other = [k for k in s if k not in ("custom_expected",) + SYS and a.get(k) != s.get(k)]
    rows.append({"op": "readback", "case": f"C{cid}", "http": st, "fields_match": {"custom_expected": a["custom_expected"] == want}, "other_fields_changed": other,
                 "marker": m, "marker_unique_and_last": last, "custom_atmstatus": a["custom_atmstatus"], "custom_automation_type": a["custom_automation_type"],
                 "ok": a["custom_expected"] == want and not other and last})
vlad = [c for c in (json.load(open(f)) for f in glob.glob(f"{SNAP}/C*.json")) if c["created_by"] != 3]
for s in vlad:
    a = api(f"get_case/{s['id']}"); diff = [k for k in set(a) | set(s) if a.get(k) != s.get(k)]
    rows.append({"op": "untouched_check_vladimir", "case": f"C{s['id']}", "differs_from_snapshot": diff, "ok": not diff})
for f in sorted(glob.glob(f"{H}/snapshots-after-v49/C*.json")):
    s = json.load(open(f)); a = api(f"get_case/{s['id']}"); diff = [k for k in set(a) | set(s) if a.get(k) != s.get(k)]
    rows.append({"op": "untouched_check_batch1", "case": f"C{s['id']}", "differs_from_snapshot": diff, "ok": not diff})
with open(f"{H}/applied/readback-2026-10-14-v49-b.jsonl", "w") as fo:
    for x in rows: fo.write(json.dumps(x, ensure_ascii=False) + "\n")
for x in rows: print(x["case"], x["op"], "OK" if x["ok"] else "PROBLEM", {k: v for k, v in x.items() if k in ("marker", "custom_atmstatus", "custom_automation_type", "section_id", "other_fields_changed", "differs_from_snapshot")})
