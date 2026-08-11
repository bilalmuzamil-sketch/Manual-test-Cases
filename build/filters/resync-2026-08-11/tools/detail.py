#!/usr/bin/env python3
import json, glob, os, csv, difflib
ROOT="/home/user/Manual-test-Cases/build/filters"; SNAP=f"{ROOT}/resync-2026-08-11/snapshots"
live={c["id"]:c for c in json.load(open(f"{SNAP}/cases-LIVE-OURS.json"))}
local={}
for f in sorted(glob.glob(f"{ROOT}/cases/*.json")):
    d=json.load(open(f)); lst=d if isinstance(d,list) else d.get("cases",d)
    for c in lst:
        if str(c.get("viu_status","")).startswith("Retired"): continue
        local[c["id"]]=c
idmap={}
for r in csv.DictReader(open(f"{ROOT}/testrail-id-map.csv")): idmap[r["internal_id"]]=int(r["testrail_case_id"].lstrip("C"))
def norm(s): return ("" if s is None else s).replace("\r\n","\n")
def jf(v): return "\n".join(str(x) for x in v) if isinstance(v,list) else ("" if v is None else str(v))
rows=json.load(open(f"{SNAP}/compare-local-vs-live.json"))
for fld,rk in [("title","title"),("preconditions","custom_preconds"),("steps","custom_steps")]:
    hits=[r for r in rows if fld in r["diffs"]]
    print(f"\n{'='*70}\n{fld.upper()} differs on {len(hits)} cases: {[r['cid'] for r in hits]}")
    for r in hits[:3]:
        L=norm(live[r['cid']].get(rk) or ""); Lo=norm(jf(local[r['internal']].get(fld)))
        print(f"\n--- C{r['cid']} ({r['internal']}) ---")
        for line in list(difflib.unified_diff(Lo.split("\n"),L.split("\n"),lineterm="",n=0))[2:12]:
            print("   ",line[:150])
