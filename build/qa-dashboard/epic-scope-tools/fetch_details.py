import json, os, sys, time
D="/tmp/claude-0/-home-user-Manual-test-Cases/e9089e60-af12-5f5c-8714-555eb5dbac06/scratchpad/dash"
sys.path.insert(0,D)
import mcpcall as m
CID="19fdd96d-a135-46c4-83e7-d2cc218a4e63"
OUT=D+"/details"; os.makedirs(OUT,exist_ok=True)
rows=json.load(open(D+"/raw_issues.json"))
keys=[r["key"] for r in rows]
done=0; fail=[]
for i,k in enumerate(keys):
    p=OUT+"/%s.json"%k
    if os.path.exists(p) and os.path.getsize(p)>2: done+=1; continue
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
            slim={"k":k,
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
