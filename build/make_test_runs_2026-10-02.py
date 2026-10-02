# -*- coding: utf-8 -*-
"""Create the milestone + 3 test runs with per-test assignments (QA lead order 2026-10-02).
Dashboard -> split Nebojsa(2)/Ayesha(5), owner Nebojsa. Part Sales -> all Mudassir(6), owner Mudassir.
WO Board & Tech View -> all Bilal(3), owner Bilal. Milestone start_on = 2026-10-01, contains all 3."""
import json,urllib.request,urllib.error,base64,calendar,sys
c=json.load(open("/tmp/testrail/creds.json"))
HOST=c["host"].rstrip("/");AUTH=base64.b64encode(f'{c["user"]}:{c["password"]}'.encode()).decode()
def api(ep,data=None):
    r=urllib.request.Request(f"{HOST}/index.php?/api/v2/{ep}",data=(json.dumps(data).encode() if data is not None else None),
        headers={"Authorization":"Basic "+AUTH,"Content-Type":"application/json"})
    try: return json.loads(urllib.request.urlopen(r,timeout=180).read().decode())
    except urllib.error.HTTPError as e: raise SystemExit(f"HTTP {e.code} on {ep}: {e.read().decode()[:300]}")
def getall(ep):
    out=[];off=0
    while True:
        d=api(f"{ep}&limit=250&offset={off}");k='sections' if 'sections' in d else 'cases';out+=d[k]
        if not d.get('_links',{}).get('next'): break
        off+=250
    return out
proj=api("get_suite/1")["project_id"]
secs={s['id']:s for s in getall("get_sections/1&suite_id=1")}
cases=getall("get_cases/1&suite_id=1")
def subtree(root):
    w={root};chg=True
    while chg:
        chg=False
        for sid,s in secs.items():
            if s.get('parent_id') in w and sid not in w: w.add(sid);chg=True
    return w
dash=sorted(x['id'] for x in cases if x['section_id'] in subtree(12166) and x.get('created_by')==3)
ps  =sorted(x['id'] for x in cases if x['section_id'] in subtree(20435))
wo  =sorted(x['id'] for x in cases if x['section_id'] in subtree(13204))
di  =sorted(x['id'] for x in cases if x['section_id'] in subtree(6658))
from collections import Counter as _C
di_cb=_C(x.get('created_by') for x in cases if x['section_id'] in subtree(6658))
assert len(dash)==61 and len(ps)==100 and len(wo)==130, (len(dash),len(ps),len(wo))

DRY = "--apply" not in sys.argv
start_on=calendar.timegm((2026,10,1,0,0,0,0,0,0))
print("project",proj,"| dash",len(dash),"ps",len(ps),"wo",len(wo),"di",len(di),"di_by_cb",dict(di_cb),"| start_on",start_on,"|","DRY" if DRY else "APPLY")
if DRY: raise SystemExit("dry run only; pass --apply to create")

# 1) milestone
mid=api(f"add_milestone/{proj}",{"name":"QA Execution - Oct 2026 (Dashboard | Part Sales | WO Board & Tech View)",
    "description":"Groups the execution runs. Dashboard -> Nebojsa; WO Board & Tech View -> Bilal; "
    "Founder Mode Part Sales -> Mudassir; Digital Vehicle Inspection V2 -> Viktoria "
    "(realised via each run's owner; TestRail milestones carry no assignee field).",
    "start_on":start_on})["id"]
print("milestone",mid)

def mkrun(name,owner,ids):
    r=api(f"add_run/{proj}",{"suite_id":1,"name":name,"milestone_id":mid,"assignedto_id":owner,
        "include_all":False,"case_ids":ids,
        "description":"Created 2026-10-02 per QA lead. Owner/primary assignee set; per-test Assigned To set below."})
    print("run",r['id'],name,"owner",owner,"tests",len(ids))
    return r['id']
run_dash=mkrun("Dashboard (Sep 2026) - Execution 2026-10-01",2,dash)
run_ps  =mkrun("Founder Mode - Part Sales - Execution 2026-10-01",6,ps)
run_wo  =mkrun("WO Board & Tech View (Sep 2026) - Execution 2026-10-01",3,wo)
run_di  =mkrun("Digital Vehicle Inspection V2 - Execution 2026-10-01",4,di)

def api_try(ep,data):  # non-raising
    r=urllib.request.Request(f"{HOST}/index.php?/api/v2/{ep}",data=json.dumps(data).encode(),
        headers={"Authorization":"Basic "+AUTH,"Content-Type":"application/json"})
    try: return json.loads(urllib.request.urlopen(r,timeout=180).read().decode()),None
    except urllib.error.HTTPError as e: return None,f"HTTP {e.code}: {e.read().decode()[:200]}"
def assign(run_id,pairs):  # pairs: list of (case_id, user_id)
    results=[{"case_id":cid,"assignedto_id":uid} for cid,uid in pairs]
    out,err=api_try(f"add_results_for_cases/{run_id}",{"results":results})
    if err is None: return
    print(f"  batch assign failed ({err}); falling back to per-test")
    tmap={t['case_id']:t['id'] for t in getall(f"get_tests/{run_id}")}
    for cid,uid in pairs:
        o,e=api_try(f"add_result/{tmap[cid]}",{"assignedto_id":uid})
        if e: print("   assign fail case",cid,e)

# Dashboard split: first 31 -> Nebojsa(2), last 30 -> Ayesha(5)
half=31
dash_pairs=[(cid,2) for cid in dash[:half]]+[(cid,5) for cid in dash[half:]]
assign(run_dash,dash_pairs)
assign(run_ps,[(cid,6) for cid in ps])
assign(run_wo,[(cid,3) for cid in wo])
assign(run_di,[(cid,4) for cid in di])
print("assignments submitted")

# verify
from collections import Counter
for label,rid in [("dash",run_dash),("ps",run_ps),("wo",run_wo),("di",run_di)]:
    ts=getall(f"get_tests/{rid}")
    cnt=Counter(t.get('assignedto_id') for t in ts)
    print(f"VERIFY {label} run {rid}: {len(ts)} tests, assignee counts {dict(cnt)}")
json.dump({"milestone":mid,"run_dash":run_dash,"run_ps":run_ps,"run_wo":run_wo,
    "dash":dash,"ps":ps,"wo":wo,"start_on":start_on},open("build/test-runs-2026-10-02.json","w"),indent=1)
print("saved build/test-runs-2026-10-02.json")
