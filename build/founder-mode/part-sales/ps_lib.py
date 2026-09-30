#!/usr/bin/env python3
"""Builder for Founder Mode -> Part Sales (new cases via add_case).
Atomic, build-grounded preconditions; Rule-113 three-part Expected; HOLD marker (source-verified)."""
import json,urllib.request,base64,time,sys,os
c=json.load(open("/tmp/testrail/creds.json"))
HOST=c["host"].rstrip("/"); AUTH=base64.b64encode(f'{c["user"]}:{c["password"]}'.encode()).decode()
def api(ep,data=None):
    r=urllib.request.Request(f"{HOST}/index.php?/api/v2/{ep}",
        data=(json.dumps(data).encode() if data is not None else None),
        headers={"Authorization":"Basic "+AUTH,"Content-Type":"application/json"})
    for a in range(4):
        try: return json.load(urllib.request.urlopen(r,timeout=90))
        except Exception as e:
            if a==3: raise
            time.sleep(2*(a+1))
SMAP=json.load(open("build/founder-mode/part-sales/section-map.json"))
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def ol(lines): return "<ol>"+"".join(f"<li>{esc(x)}</li>" for x in lines)+"</ol>"
def ul_raw(items): return "<ul>"+"".join(f"<li>{x}</li>" for x in items)+"</ul>"
MARKER=("<p>AUTOMATION: HOLD - authored from the PRD (Confluence 867434569) and the design canvas; "
        "not yet build-verified against a Part Sales Update v1 build</p>")
def expected(results, source, quotes):
    p1="<p><strong>Expected results</strong></p>"+ul_raw(esc(r) for r in results)
    p2=(f"<p><strong>Source — where this behaviour comes from</strong><br>{esc(source)} "
        f"Source-verified 30 September 2026; not yet build-verified.</p>")
    p3="<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"+ul_raw(
        f"<strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;" for a,q in quotes)
    return p1+"<p></p>"+p2+"<p></p>"+p3+"<p></p>"+MARKER
def run(folder_code, CASES, logname="build/founder-mode/part-sales/created-log.json"):
    dry = "--apply" not in sys.argv
    sec=SMAP[folder_code]; created={}
    for cs in CASES:
        payload={"title":cs["title"][:250],"custom_preconds":ol(cs["pre"]),"custom_steps":ol(cs["steps"]),
                 "custom_expected":expected(cs["results"],cs["source"],cs["quotes"]),
                 "custom_automation_type":2,"custom_atmstatus":1}
        if dry:
            print(f"[DRY] {folder_code}  {cs['title'][:66]}"); continue
        r=api(f"add_case/{sec}",payload)
        created[str(r["id"])]={"title":cs["title"],"anchors":cs["anchors"],"section":sec}
        print(f"[OK] C{r['id']}  {cs['title'][:60]}")
    if not dry:
        os.makedirs(os.path.dirname(logname),exist_ok=True)
        allc={}
        if os.path.exists(logname): allc=json.load(open(logname))
        allc.update(created); json.dump(allc,open(logname,"w"),indent=2)
        print(f"created {len(created)} in {folder_code}; total logged {len(allc)}")
