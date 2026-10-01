#!/usr/bin/env python3
"""Shared Rule-117 builder for the 2026-10-01 gap-fill QA-Additions folders.
add(section_id, title, pre, steps, results, source, quotes, marker_reason) -> creates one case.
Enforces: discrete-list preconds/steps (each item a line), runnable Expected results, verbatim
quotes block, AUTOMATION: HOLD marker. Titles must be <=80 (asserted)."""
import json,urllib.request,base64,time,sys
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
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def ol(x): return "<ol>"+"".join(f"<li>{esc(i)}</li>" for i in x)+"</ol>"
def ul(x): return "<ul>"+"".join(f"<li>{esc(i)}</li>" for i in x)+"</ul>"
LOG={}
def add(section_id, title, pre, steps, results, source, quotes, marker_reason):
    assert len(title)<=80, f"title too long ({len(title)}): {title}"
    assert isinstance(pre,list) and isinstance(steps,list) and isinstance(results,list)
    exp=("<p><strong>Expected results</strong></p>"+ul(results)
         +f"<p><strong>Source - where this behaviour comes from</strong><br>{esc(source)} "
          "Source-verified 1 October 2026; not yet build-verified.</p>"
         +"<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
         +"<ul>"+"".join(f"<li><strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;</li>" for a,q in quotes)+"</ul>"
         +f"<p>AUTOMATION: HOLD - {esc(marker_reason)}</p>")
    dry="--apply" not in sys.argv
    if dry: print(f"[DRY] sec {section_id}  {title} ({len(title)})"); return
    r=api(f"add_case/{section_id}",{"title":title,"custom_preconds":ol(pre),"custom_steps":ol(steps),
        "custom_expected":exp,"custom_automation_type":2,"custom_atmstatus":1})
    LOG[str(r["id"])]={"title":title,"section":section_id}
    print(f"[OK] C{r['id']} sec {section_id}  {title}")
def save(path):
    if "--apply" in sys.argv:
        import os; os.makedirs(os.path.dirname(path),exist_ok=True)
        allc=json.load(open(path)) if os.path.exists(path) else {}
        allc.update(LOG); json.dump(allc,open(path,"w"),indent=1); print(f"logged {len(LOG)}; total {len(allc)}")
