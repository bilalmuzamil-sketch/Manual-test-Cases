#!/usr/bin/env python3
"""Fetch a Confluence page LIVE (version number + body + changelog)."""
import json,subprocess,sys,os
CA="/root/.ccr/ca-bundle.crt"; CK="/tmp/atlassian/cookies.txt"
def get(path):
    r=subprocess.run(["curl","-s","-w","\n__HTTP:%{http_code}","-b",CK,"--cacert",CA,
      "-H","Accept: application/json","-H","X-Atlassian-Token: no-check",
      "-H","Origin: https://shopview.atlassian.net",
      "-H","Referer: https://shopview.atlassian.net/wiki/",
      "-H","User-Agent: Mozilla/5.0 (X11; Linux x86_64) Chrome/147.0.0.0 Safari/537.36",
      "https://shopview.atlassian.net"+path],capture_output=True,text=True)
    out=r.stdout; i=out.rfind("__HTTP:"); code=int(out[i+7:].strip()); body=out[:i].rstrip("\n")
    return code,body
if __name__=="__main__":
    pid=sys.argv[1]
    code,body=get(f"/wiki/api/v2/pages/{pid}?body-format=storage")
    print(code)
    if code==200:
        d=json.loads(body); print("version",d["version"]["number"],d["version"].get("createdAt"),repr(d["version"].get("message"))[:200]); print("title",d["title"])
