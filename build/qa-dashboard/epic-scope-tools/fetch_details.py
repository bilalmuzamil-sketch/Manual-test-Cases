import json, os, sys, time
from datetime import datetime, timedelta
D="/tmp/claude-0/-home-user-Manual-test-Cases/e9089e60-af12-5f5c-8714-555eb5dbac06/scratchpad/dash"
sys.path.insert(0,D)
import mcpcall as m
CID="19fdd96d-a135-46c4-83e7-d2cc218a4e63"
OUT=D+"/details"; os.makedirs(OUT,exist_ok=True)
rows=json.load(open(D+"/raw_issues.json"))
UPD={r["key"]: r["fields"]["updated"] for r in rows}

# Only two things need a changelog:
#   * the activity table — yesterday's and today's events, so only issues touched since then;
#   * the QA-finish date — only tickets sitting in a finished status (and finish-dates.json is
#     committed + merged, so ones already recorded stay recorded).
# Everything else contributes nothing, so a scheduled run skips it. Pass the snapshot date as
# argv[1] to enable this; with no argument every issue is fetched (first/full build).
FINISHED_STATUSES={"QA Complete","Ready for Production"}
def _needed(r):
    if len(sys.argv)<2: return True
    since=(datetime.fromisoformat(sys.argv[1])-timedelta(days=2)).date().isoformat()
    fl=r["fields"]; st=fl["status"]
    if st["name"] in FINISHED_STATUSES or st["statusCategory"]["name"]=="Done": return True
    return (fl["updated"] or "")[:10] >= since
keys=[r["key"] for r in rows if _needed(r)]
print("issues needing a changelog read: %d of %d"%(len(keys),len(rows)))
# Incremental: a cached detail file records the issue's `updated` stamp it was fetched at, so an
# hourly run only re-reads issues that actually changed. Without this every run costs ~300
# getJiraIssue calls (~8 min) and would not fit in an hourly slot.
def cached_fresh(path, key):
    if not (os.path.exists(path) and os.path.getsize(path) > 2): return False
    try: return json.load(open(path)).get("up") == UPD.get(key)
    except Exception: return False
done=0; fail=[]
for i,k in enumerate(keys):
    p=OUT+"/%s.json"%k
    if cached_fresh(p,k): done+=1; continue
    ok=False
    for a in range(3):
        try:
            r=m.call("getJiraIssue",{"cloudId":CID,"issueIdOrKey":k,
                "fields":["summary","comment"],"expand":"changelog"})
            nodes=r.get("issues")
            if nodes is None: node=r
            else: node=(nodes.get("nodes") if isinstance(nodes,dict) else nodes)[0]
            cl=(node.get("changelog") or {}).get("histories") or []
            _c=node.get("comments")
            if _c is None: _c=((node.get("fields") or {}).get("comment") or {}).get("comments")
            if isinstance(_c,dict): _c=_c.get("comments") or []
            cm=_c or []
            slim={"k":k,"up":UPD.get(k),
              "ch":[{"a":(h.get("author") or {}).get("displayName"),"c":h.get("created"),
                     "it":[{"f":it.get("field"),"fs":it.get("fromString"),"ts":it.get("toString")}
                           for it in (h.get("items") or [])]} for h in cl],
              "cm":[{"a":(c.get("author") or {}).get("displayName"),"c":c.get("created")} for c in cm]}
            json.dump(slim,open(p,"w")); ok=True; break
        except Exception as e:
            time.sleep(2+2*a); err=str(e)[:160]
            if a==2: print("FAIL",k,err, flush=True)
    if not ok: fail.append(k)
    if (i+1)%25==0: print("…%d/%d"%(i+1,len(keys)), flush=True)
print("cached:",done,"fetched now:",len(keys)-done-len(fail),"failed:",len(fail))
if fail: print("FAILED:",fail[:20])
