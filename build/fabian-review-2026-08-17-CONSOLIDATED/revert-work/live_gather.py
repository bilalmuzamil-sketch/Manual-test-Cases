#!/usr/bin/env python3
"""Bulk-pull all suite-1 cases LIVE (correct &-only pagination per COMMON-CORE §3.3), index by id,
snapshot the fixset + §5 cases. Read-only."""
import json,base64,urllib.request,time,os,re
c=json.load(open('/tmp/testrail/creds.json'))
HOST=c['host'].rstrip('/'); AUTH=base64.b64encode(f"{c['email']}:{c['password']}".encode()).decode()
def tr(path,tries=5):
    url=f"{HOST}/index.php?/api/v2/{path}"
    for i in range(tries):
        try:
            req=urllib.request.Request(url,headers={'Authorization':'Basic '+AUTH,'Content-Type':'application/json'})
            with urllib.request.urlopen(req,timeout=120) as r: return json.loads(r.read().decode())
        except Exception as e:
            if i==tries-1: raise
            time.sleep(3*(i+1))
def getall_cases():
    out=[]; off=0
    while True:
        # ALL ampersands — the whole /api/v2 path already sits inside index.php?
        r=tr(f"get_cases/1&suite_id=1&limit=250&offset={off}")
        chunk=r["cases"] if isinstance(r,dict) else r
        out+=chunk
        links=r.get("_links",{}) if isinstance(r,dict) else {}
        if not links.get("next"):
            if len(chunk)<250: break
        if len(chunk)<250: break
        off+=250
    return out
print("pulling all cases..."); cases=getall_cases()
by={int(x["id"]):x for x in cases}
print("live cases pulled:",len(cases))
RW="build/fabian-review-2026-08-17-CONSOLIDATED/revert-work"
mine=json.load(open(f"{RW}/fixset.json"))
fixset_cids=[f["cid"] for f in mine["fixset"]]
s5=[38847,38848,38849,38850,43811]
snap={}
for cid in set(fixset_cids)|set(s5):
    x=by.get(cid)
    if x is None:
        snap[cid]={"MISSING":True}; continue
    snap[cid]={
      "title":x.get("title"),
      "refs":x.get("refs"),
      "custom_preconds":x.get("custom_preconds"),
      "custom_steps":x.get("custom_steps"),
      "custom_expected":x.get("custom_expected"),
      "custom_atmstatus":x.get("custom_atmstatus"),
      "created_by":x.get("created_by"),
      "updated_by":x.get("updated_by"),
      "section_id":x.get("section_id"),
    }
json.dump(snap, open(f"{RW}/live_snapshot.json","w"), indent=1)
print("snapshot written for",len(snap),"cids")
# quick stats
DEF="AUTOMATION: Not available on Build to test Yet"
have=sum(1 for cid in fixset_cids if DEF in (snap[cid].get("custom_expected") or ""))
print("fixset cases with deferred marker LIVE:",have,"of",len(fixset_cids))
print("§5 cases with deferred marker LIVE:",[cid for cid in s5 if DEF in (snap.get(cid,{}).get("custom_expected") or "")])
foreign=[cid for cid in fixset_cids if snap[cid].get("created_by")!=3]
print("fixset cases created_by != 3 (foreign):",foreign)
autos=[cid for cid in fixset_cids if snap[cid].get("custom_atmstatus")==3]
print("fixset cases custom_atmstatus==3 (Automated) LIVE:",len(autos),autos)
