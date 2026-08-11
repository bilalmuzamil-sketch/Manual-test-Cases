#!/usr/bin/env python3
import json, glob, csv, difflib
ROOT="/home/user/Manual-test-Cases/build/filters"; SNAP=f"{ROOT}/resync-2026-08-11/snapshots"
live={c["id"]:c for c in json.load(open(f"{SNAP}/cases-LIVE-OURS.json"))}
local={}
for f in sorted(glob.glob(f"{ROOT}/cases/*.json")):
    d=json.load(open(f)); lst=d if isinstance(d,list) else d.get("cases",d)
    for c in lst:
        if str(c.get("viu_status","")).startswith("Retired"): continue
        local[c["id"]]=c
idmap={r["internal_id"]:int(r["testrail_case_id"].lstrip("C")) for r in csv.DictReader(open(f"{ROOT}/testrail-id-map.csv"))}
rev={v:k for k,v in idmap.items()}
def norm(s): return ("" if s is None else s).replace("\r\n","\n")
def jf(v): return "\n".join(str(x) for x in v) if isinstance(v,list) else ("" if v is None else str(v))
for cid,fld,rk in [(29600,"preconditions","custom_preconds")]+[(c,"steps","custom_steps") for c in (29623,29624,29625,29626,29627)]:
    iid=rev[cid]; L=norm(live[cid].get(rk) or ""); Lo=norm(jf(local[iid].get(fld)))
    print(f"\n===== C{cid} ({iid}) {fld} =====")
    for line in list(difflib.unified_diff(Lo.split("\n"),L.split("\n"),lineterm="",n=0))[2:]:
        print("  ",line[:170])
