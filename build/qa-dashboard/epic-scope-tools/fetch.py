import json, sys, time
D="/tmp/claude-0/-home-user-Manual-test-Cases/e9089e60-af12-5f5c-8714-555eb5dbac06/scratchpad/dash"
sys.path.insert(0,D)
import mcpcall as m
CID="19fdd96d-a135-46c4-83e7-d2cc218a4e63"
EPICS=["SV-8785","SV-8685","SV-8582"]
FIELDS=["summary","status","issuetype","priority","labels","assignee","reporter",
        "created","updated","resolutiondate","parent","customfield_10385"]
def search(jql, fields=FIELDS):
    out=[]; tok=None
    while True:
        args={"cloudId":CID,"jql":jql,"fields":fields,"maxResults":100}
        if tok: args["nextPageToken"]=tok
        for a in range(3):
            try: r=m.call("searchJiraIssuesUsingJql",args); break
            except Exception:
                if a==2: raise
                time.sleep(3)
        iss=r.get("issues")
        if isinstance(iss,dict): nodes=iss.get("nodes",[]); pi=iss.get("pageInfo") or {}
        else: nodes=iss or []; pi=r.get("pageInfo") or {}
        out+=nodes
        # two response shapes: GraphQL-ish pageInfo, or REST nextPageToken/isLast.
        # (Reading only pageInfo silently truncated at 100 — always check both.)
        if pi:
            tok=pi.get("endCursor") if pi.get("hasNextPage") else None
        else:
            tok=r.get("nextPageToken") if not r.get("isLast", True) else None
        if not tok: break
    return out
# recursive descent: epics -> children -> grandchildren, until nothing new
allrows={}
for r in search("key in (%s)" % ",".join(EPICS)): allrows[r["key"]]=r
frontier=list(EPICS); depth=0
while frontier:
    depth+=1; newkeys=[]
    for i in range(0,len(frontier),60):
        chunk=frontier[i:i+60]
        for r in search("parent in (%s)" % ",".join(chunk)):
            if r["key"] not in allrows:
                allrows[r["key"]]=r; newkeys.append(r["key"])
    print("depth %d: +%d issues" % (depth,len(newkeys)))
    frontier=newkeys
rows=list(allrows.values())
json.dump(rows, open(D+"/raw_issues.json","w"))
from collections import Counter
print("TOTAL:", len(rows))
print("types:", dict(Counter(r["fields"]["issuetype"]["name"] for r in rows)))
labs=Counter()
for r in rows:
    for l in (r["fields"].get("labels") or []): labs[l]+=1
print("labels:", dict(labs))
qa=Counter()
for r in rows:
    for u in (r["fields"].get("customfield_10385") or []): qa[u["displayName"]]+=1
print("QA Assignee field:", dict(qa))
print("statuses:", dict(Counter(r["fields"]["status"]["name"] for r in rows)))
