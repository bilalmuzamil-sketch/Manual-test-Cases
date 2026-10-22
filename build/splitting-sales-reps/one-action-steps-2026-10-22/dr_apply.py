#!/usr/bin/env python3
"""22 Oct 2026, one action per step (QA lead "Yes, fix all 113 cases"; Rule 135): apply DR-PROPOSALS.json to the design-recheck cases
C690660, C690661, C690664 (steps and results only; edit lock; read back). python3 dr_apply.py [--apply]"""
import sys, os, json
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D); A = f"{P}/design-recheck-2026-10-20/applied"
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
prop = json.load(open(f"{D}/DR-PROPOSALS.json")); prop = {k: v for k, v in prop.items() if isinstance(v, dict) and v.get("custom_steps")}
print(list(prop))
if "--apply" not in sys.argv: sys.exit(0)
log = open(f"{D}/dr-apply-log.jsonl", "a")
for cid, v in prop.items():
    cid = int(str(cid).lstrip("C")); prev = json.load(open(f"{A}/C{cid}-after.json")); live = api(f"get_case/{cid}")
    if live["updated_on"] != prev["updated_on"]: print("LOCK", cid); log.write(json.dumps({"op": "refused_edit_lock", "case": cid}) + "\n"); continue
    json.dump(live, open(f"{D}/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    f = {k: v[k] for k in ("custom_steps", "custom_expected")}
    api(f"update_case/{cid}", f); st = LAST["status"]; a = api(f"get_case/{cid}"); bad = [k for k in f if a.get(k) != f[k]]
    json.dump(a, open(f"{A}/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "update_case", "case": f"C{cid}", "http": st, "readback_ok": not bad}) + "\n"); print(cid, st, bad)
