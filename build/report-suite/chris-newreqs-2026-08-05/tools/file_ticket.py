#!/usr/bin/env python3
"""File a Story Defect in the Rule-52 (amended 2026-08-05) shape:
issuetype 10007 Story Defect · parent = THE OWNING STORY · priority Low · Severity in
customfield_10418 · NO Product Area · plus a `relates to` link to the same story.
Description is sent as WIKI MARKUP through API v2 so Jira renders the tables."""
import json,subprocess,sys
CA="/root/.ccr/ca-bundle.crt"; CK="/tmp/atlassian/cookies.txt"
BASE="https://shopview.atlassian.net"
def call(method,path,body=None,v="3"):
    args=["curl","-s","-w","\n__HTTP:%{http_code}","-b",CK,"--cacert",CA,"-X",method,
      "-H","Accept: application/json","-H","X-Atlassian-Token: no-check",
      "-H",f"Origin: {BASE}","-H",f"Referer: {BASE}/browse/SV-8582",
      "-H","User-Agent: Mozilla/5.0 (X11; Linux x86_64) Chrome/147.0.0.0 Safari/537.36"]
    if body is not None:
        args+=["-H","Content-Type: application/json","--data-binary",json.dumps(body)]
    args.append(BASE+path)
    r=subprocess.run(args,capture_output=True,text=True); o=r.stdout
    i=o.rfind("__HTTP:"); code=int(o[i+7:].strip()); t=o[:i].strip()
    try: return code,json.loads(t) if t else {}
    except Exception: return code,{"_raw":t[:800]}
if __name__=="__main__":
    wiki=open(sys.argv[1]).read(); story=sys.argv[2]; summary=sys.argv[3]; sev=sys.argv[4]
    body={"fields":{"project":{"key":"SV"},"issuetype":{"id":"10007"},
        "parent":{"key":story},"summary":summary,"description":wiki,
        "priority":{"name":"Low"},"customfield_10418":{"value":sev}}}
    c,d=call("POST","/rest/api/2/issue",body)
    print("CREATE",c,json.dumps(d)[:400])
    if c not in (200,201): sys.exit(1)
    key=d["key"]; print("KEY",key)
    c2,d2=call("POST","/rest/api/3/issueLink",{"type":{"name":"Relates"},
        "inwardIssue":{"key":key},"outwardIssue":{"key":story}})
    print("LINK",c2,json.dumps(d2)[:200])
    print(key)
