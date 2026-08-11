#!/usr/bin/env python3
"""Compare LOCAL active Filters case bodies against LIVE TestRail, FIELD BY FIELD.
Counts cannot detect staleness (recovery STATE.md §D) -- this compares CONTENT."""
import json, glob, os, sys, csv, hashlib

ROOT = "/home/user/Manual-test-Cases/build/filters"
SNAP = f"{ROOT}/resync-2026-08-11/snapshots"

live = {c["id"]: c for c in json.load(open(f"{SNAP}/cases-LIVE-OURS.json"))}

# local bodies
local = {}
for f in sorted(glob.glob(f"{ROOT}/cases/*.json")):
    d = json.load(open(f)); lst = d if isinstance(d, list) else d.get("cases", d)
    for c in lst:
        if str(c.get("viu_status","")).startswith("Retired"): continue
        local[c["id"]] = (c, f)
print(f"local active bodies: {len(local)}")

# id-map: internal -> C-id
idmap = {}
with open(f"{ROOT}/testrail-id-map.csv") as fh:
    for r in csv.DictReader(fh):
        idmap[r["internal_id"]] = int(r["testrail_case_id"].lstrip("C"))
print(f"id-map rows: {len(idmap)}")

def norm(s):
    if s is None: return ""
    return s.replace("\r\n", "\n")

def joinf(v):
    """local fields may be list or str"""
    if isinstance(v, list): return "\n".join(str(x) for x in v)
    return "" if v is None else str(v)

FIELDS = [("title","title"), ("preconditions","custom_preconds"),
          ("steps","custom_steps"), ("expected","custom_expected"), ("refs","refs")]

rows = []
unmatched = []
for iid,(c,src) in sorted(local.items()):
    cid = idmap.get(iid)
    if cid is None or cid not in live:
        unmatched.append((iid, cid)); continue
    L = live[cid]
    diffs = []
    for lk, rk in FIELDS:
        lv = norm(joinf(c.get(lk)))
        rv = norm(L.get(rk) or "")
        if lv != rv: diffs.append(lk)
    rows.append({"internal": iid, "cid": cid, "src": os.path.basename(src),
                 "diffs": diffs})

print(f"matched: {len(rows)}  unmatched: {len(unmatched)} {unmatched}")
moved = [r for r in rows if r["diffs"]]
print(f"\nBODIES THAT DIFFER: {len(moved)} of {len(rows)}")
from collections import Counter
fc = Counter()
for r in moved:
    for d in r["diffs"]: fc[d]+=1
print("per-field difference counts:", dict(fc))
json.dump(rows, open(f"{SNAP}/compare-local-vs-live.json","w"), indent=1)

# characterise the differences
import re
lay = Counter()
for r in moved:
    cid=r["cid"]; iid=r["internal"]
    c = local[iid][0]; L = live[cid]
    le = norm(joinf(c.get("expected"))); re_ = norm(L.get("custom_expected") or "")
    tags=[]
    if "read on 11 August 2026" in re_ and "read on 11 August 2026" not in le: tags.append("missing-read-date")
    if "version 18" in le and "version 19" in re_: tags.append("spec-v18->v19")
    if "SV-9041" in re_ and "SV-9041" not in le: tags.append("sv9041")
    lay[tuple(sorted(tags)) or ("other",)]+=1
print("\ndifference LAYERS (expected field):")
for k,v in lay.most_common(): print(f"  {v:4d}  {k}")
