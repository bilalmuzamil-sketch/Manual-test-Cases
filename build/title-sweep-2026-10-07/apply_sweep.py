#!/usr/bin/env python3
"""Apply the 3-week title sweep (QA lead 2026-10-07). Title only. Resumable: skips cases already carrying the new
title. Refuses a case whose live title is neither old nor new (someone else changed it) or not created by us."""
import sys, json, os
sys.path.insert(0, "build/maintenance-reminder-v2")
from mr_lib import api
H = "build/title-sweep-2026-10-07"
P = json.load(open(f"{H}/plan.json")); LOG = f"{H}/apply-log.jsonl"
done = set()
if os.path.exists(LOG):
    for l in open(LOG):
        r = json.loads(l)
        if r["result"] in ("OK", "ALREADY"): done.add(r["case"])
with open(LOG, "a") as out:
    for cid, p in P.items():
        if cid in done: continue
        c = api(f"get_case/{cid}")
        if c["created_by"] != 3: res = "SKIP-not-ours"
        elif c["title"] == p["new"]: res = "ALREADY"
        elif c["title"] != p["old"]: res = "SKIP-title-changed-by-someone"
        else:
            api(f"update_case/{cid}", {"title": p["new"]}); a = api(f"get_case/{cid}")
            same = all(a.get(k) == c.get(k) for k in ("custom_preconds", "custom_steps", "custom_expected", "custom_atmstatus"))
            res = "OK" if a["title"] == p["new"] and same else "MISMATCH"
        out.write(json.dumps({"case": cid, "result": res, "automated": p["automated"], "old": p["old"], "new": p["new"]}, ensure_ascii=False) + "\n"); out.flush()
import collections
print(collections.Counter(json.loads(l)["result"] for l in open(LOG)))
