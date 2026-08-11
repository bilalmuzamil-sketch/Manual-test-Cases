#!/usr/bin/env python3
"""Re-merge C-ids and the refs column into the id-map FROM LIVE.
gen_import.py blanks testrail_case_id and drops refs on every rerun."""
import json, csv, io, os
ROOT="/home/user/Manual-test-Cases/build/filters"
SNAP=f"{ROOT}/resync-2026-08-11/snapshots"
live={c["id"]:c for c in json.load(open(f"{SNAP}/cases-LIVE-OURS.json"))}
# internal -> cid  from the committed pre-regen id-map (git HEAD version)
import subprocess
prev=subprocess.run(["git","show","HEAD:build/filters/testrail-id-map.csv"],
                    cwd="/home/user/Manual-test-Cases",capture_output=True,text=True).stdout
pmap={r["internal_id"]:r for r in csv.DictReader(io.StringIO(prev))}
# Cases created AFTER the committed id-map. Each entry is proven against live below.
NEW_SINCE_HEAD = {"FLT-COLL-06": "C43590"}
for iid, cid in NEW_SINCE_HEAD.items():
    pmap.setdefault(iid, {"internal_id": iid, "testrail_case_id": cid})
rows=list(csv.DictReader(open(f"{ROOT}/testrail-id-map.csv")))
out=[]
for r in rows:
    iid=r["internal_id"]; p=pmap.get(iid)
    if not p: raise SystemExit(f"no prior mapping for {iid}")
    cid=int(p["testrail_case_id"].lstrip("C"))
    L=live.get(cid)
    if L is None: raise SystemExit(f"C{cid} not live")
    out.append({"internal_id":iid,"testrail_case_id":f"C{cid}",
                "title":L["title"],                      # title FROM LIVE
                "section":r["section"],
                "refs":(L.get("refs") or "")})           # refs FROM LIVE
with open(f"{ROOT}/testrail-id-map.csv","w",newline="") as fh:
    w=csv.DictWriter(fh,fieldnames=["internal_id","testrail_case_id","title","section","refs"])
    w.writeheader(); w.writerows(out)
print(f"re-merged {len(out)} rows; blanks={sum(1 for o in out if not o['testrail_case_id'])}; refs={sum(1 for o in out if o['refs'])}")
