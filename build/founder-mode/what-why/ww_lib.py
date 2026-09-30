#!/usr/bin/env python3
"""Builder for Founder Mode -> What/Why (new cases via add_case), Rule 117 format."""
import json,urllib.request,base64,time,sys,os
c=json.load(open("/tmp/testrail/creds.json"))
HOST=c["host"].rstrip("/"); AUTH=base64.b64encode(f'{c["user"]}:{c["password"]}'.encode()).decode()
def api(ep,data=None):
    r=urllib.request.Request(f"{HOST}/index.php?/api/v2/{ep}",data=(json.dumps(data).encode() if data is not None else None),
        headers={"Authorization":"Basic "+AUTH,"Content-Type":"application/json"})
    for a in range(4):
        try: return json.load(urllib.request.urlopen(r,timeout=90))
        except Exception:
            if a==3: raise
            time.sleep(2*(a+1))
SMAP=json.load(open("build/founder-mode/what-why/section-map.json"))
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def ol(x): return "<ol>"+"".join(f"<li>{esc(i)}</li>" for i in x)+"</ol>"
def ul(x): return "<ul>"+"".join(f"<li>{esc(i)}</li>" for i in x)+"</ul>"
MARKER=("<p>AUTOMATION: HOLD - authored from the PRD (Confluence 845348896, Locked for build 2026-09-16) "
        "and the design canvas; not yet build-verified against a QA build (no QA branch yet)</p>")
def expected(results, source, quotes):
    p1="<p><strong>Expected results</strong></p>"+ul(results)
    p2=(f"<p><strong>Source - where this behaviour comes from</strong><br>{esc(source)} "
        f"Source-verified 30 September 2026; not yet build-verified.</p>")
    p3="<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"+"<ul>"+"".join(
        f"<li><strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;</li>" for a,q in quotes)+"</ul>"
    return p1+p2+p3+MARKER
def run(folder_code, CASES, logname="build/founder-mode/what-why/created-log.json"):
    dry = "--apply" not in sys.argv
    sec=SMAP[folder_code]; created={}
    for cs in CASES:
        payload={"title":cs["title"][:250],"custom_preconds":ol(cs["pre"]),"custom_steps":ol(cs["steps"]),
                 "custom_expected":expected(cs["results"],cs["source"],cs["quotes"]),
                 "custom_automation_type":2,"custom_atmstatus":1}
        if dry: print(f"[DRY] {folder_code}  {cs['title'][:66]} ({len(cs['title'])})"); continue
        r=api(f"add_case/{sec}",payload); created[str(r["id"])]={"title":cs["title"],"anchors":cs["anchors"],"section":sec}
        print(f"[OK] C{r['id']}  {cs['title']}")
    if not dry:
        os.makedirs(os.path.dirname(logname),exist_ok=True)
        allc=json.load(open(logname)) if os.path.exists(logname) else {}
        allc.update(created); json.dump(allc,open(logname,"w"),indent=1)
        print(f"created {len(created)} in {folder_code}; total {len(allc)}")
