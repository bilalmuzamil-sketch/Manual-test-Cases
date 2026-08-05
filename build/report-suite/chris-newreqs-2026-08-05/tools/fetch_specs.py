#!/usr/bin/env python3
import json,os,sys,datetime,hashlib
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from conf import get
PAGES={"sales-by-customer":"577634305","sales-by-representative":"585629698",
 "parts-velocity":"620888066","technician-utilization":"641400833",
 "work-in-progress":"703660034","inventory-value":"720142338"}
outdir=sys.argv[1]; os.makedirs(outdir,exist_ok=True)
stamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
summary={"fetched_at_utc":stamp,"pages":{}}
for name,pid in PAGES.items():
    code,body=get(f"/wiki/api/v2/pages/{pid}?body-format=storage")
    if code!=200:
        print(f"!! {name} HTTP {code}"); summary["pages"][name]={"http":code}; continue
    d=json.loads(body)
    stor=d["body"]["storage"]["value"]
    open(os.path.join(outdir,name+".html"),"w").write(stor)
    json.dump(d,open(os.path.join(outdir,name+".json"),"w"))
    summary["pages"][name]={"http":200,"page_id":pid,"title":d["title"],
      "version":d["version"]["number"],"version_at":d["version"].get("createdAt"),
      "version_message":d["version"].get("message"),
      "body_sha256":hashlib.sha256(stor.encode()).hexdigest(),"body_len":len(stor)}
    print(f"{name:32s} v{d['version']['number']:<3} {d['version'].get('createdAt')} {d['version'].get('message')!r}")
json.dump(summary,open(os.path.join(outdir,"_summary.json"),"w"),indent=1)
print("\nfetched_at_utc",stamp)
