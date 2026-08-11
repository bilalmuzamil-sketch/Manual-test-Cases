#!/usr/bin/env python3
import json, glob, csv, re
ROOT="/home/user/Manual-test-Cases/build/filters"; SNAP=f"{ROOT}/resync-2026-08-11/snapshots"
live={c["id"]:c for c in json.load(open(f"{SNAP}/cases-LIVE-OURS.json"))}
local={}
for f in sorted(glob.glob(f"{ROOT}/cases/*.json")):
    d=json.load(open(f)); lst=d if isinstance(d,list) else d.get("cases",d)
    for c in lst:
        if str(c.get("viu_status","")).startswith("Retired"): continue
        local[c["id"]]=c
idmap={r["internal_id"]:int(r["testrail_case_id"].lstrip("C")) for r in csv.DictReader(open(f"{ROOT}/testrail-id-map.csv"))}
def norm(s): return ("" if s is None else s).replace("\r\n","\n")
def jf(v): return "\n".join(str(x) for x in v) if isinstance(v,list) else ("" if v is None else str(v))
rows=json.load(open(f"{SNAP}/compare-local-vs-live.json"))
def squash(s): return re.sub(r"\s+"," ",s).strip()
for fld,rk in [("preconditions","custom_preconds"),("steps","custom_steps")]:
    hits=[r for r in rows if fld in r["diffs"]]
    ws=[];real=[]
    for r in hits:
        L=norm(live[r['cid']].get(rk) or ""); Lo=norm(jf(local[r['internal']].get(fld)))
        (ws if squash(L)==squash(Lo) else real).append(r['cid'])
    print(f"{fld}: {len(hits)} differ -> whitespace-only {len(ws)}, REAL text {len(real)} {real}")
# refs
hits=[r for r in rows if "refs" in r["diffs"]]
sv=0; ver=0; oth=[]
for r in hits:
    L=norm(live[r['cid']].get("refs") or ""); Lo=norm(jf(local[r['internal']].get("refs")))
    tags=[]
    if "spec v19" in L and "spec v19" not in Lo: tags.append("v19")
    if not tags: oth.append((r['cid'],Lo[:70],L[:70]))
    else: ver+=1
print(f"\nrefs: {len(hits)} differ -> v18->v19 restamp {ver}, other {len(oth)}")
for o in oth[:8]: print("   C%s\n     local: %s\n     live : %s"%o)
