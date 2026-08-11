#!/usr/bin/env python3
"""JOB 1 -- re-sync the LOCAL Filters case source FROM LIVE, field by field.

Live is the authority: two completed live passes (spec v18->v19 re-stamp and the
read-date sweep) wrote text that local never received.  Retired bodies are NOT
touched.  Foreign cases (Ahtasham, user 7) are NOT imported.
"""
import json, glob, csv, os, sys

ROOT="/home/user/Manual-test-Cases/build/filters"
SNAP=f"{ROOT}/resync-2026-08-11/snapshots"
DRY = "--apply" not in sys.argv

live={c["id"]:c for c in json.load(open(f"{SNAP}/cases-LIVE-OURS.json"))}
idmap={r["internal_id"]:int(r["testrail_case_id"].lstrip("C"))
       for r in csv.DictReader(open(f"{ROOT}/testrail-id-map.csv"))}

MAP=[("title","title"),("preconditions","custom_preconds"),
     ("steps","custom_steps"),("expected","custom_expected"),("refs","refs")]

changed=[]; per_field={k:0 for k,_ in MAP}
for path in sorted(glob.glob(f"{ROOT}/cases/*.json")):
    d=json.load(open(path))
    isdict = not isinstance(d,list)
    lst = d.get("cases",d) if isdict else d
    dirty=False
    for c in lst:
        if str(c.get("viu_status","")).startswith("Retired"): continue
        cid=idmap.get(c["id"])
        if cid is None or cid not in live:
            raise SystemExit(f"UNMAPPED local active case {c['id']}")
        L=live[cid]
        moved=[]
        for lk,rk in MAP:
            new=(L.get(rk) or "").replace("\r\n","\n")
            old=c.get(lk)
            old="" if old is None else ("\n".join(str(x) for x in old) if isinstance(old,list) else str(old))
            if old!=new:
                if not DRY: c[lk]=new
                moved.append(lk); per_field[lk]+=1; dirty=True
        # keep testrail_id / section_id in step with live
        for lk,rk in (("testrail_id","id"),("section_id","section_id")):
            nv=L.get(rk)
            if lk=="testrail_id": nv=f"C{nv}"
            if c.get(lk)!=nv:
                if not DRY: c[lk]=nv
                dirty=True
        if moved: changed.append({"internal":c["id"],"cid":cid,"fields":moved})
    if dirty and not DRY:
        json.dump(d, open(path,"w"), indent=2, ensure_ascii=False)
        open(path,"a").write("\n")

print(("DRY RUN" if DRY else "APPLIED")+f": bodies moved {len(changed)}")
print("per-field:", per_field)
json.dump(changed, open(f"{SNAP}/resync-changed.json","w"), indent=1)
