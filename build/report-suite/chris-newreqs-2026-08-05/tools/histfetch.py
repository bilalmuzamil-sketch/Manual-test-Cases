#!/usr/bin/env python3
import json,os,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from conf import get
pid=sys.argv[1]; ver=sys.argv[2]; out=sys.argv[3]
code,body=get(f"/wiki/rest/api/content/{pid}?status=historical&version={ver}&expand=body.storage,version")
if code!=200: print("HTTP",code,body[:300]); sys.exit(1)
d=json.loads(body); open(out,"w").write(d["body"]["storage"]["value"])
print("v%s"%d["version"]["number"], d["version"]["when"], repr(d["version"].get("message"))[:160], "len",len(d["body"]["storage"]["value"]))
