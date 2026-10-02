# -*- coding: utf-8 -*-
"""Chunk-2 MR authoring library. Mirrors the Chunk-1 house format exactly (Rule 16):
  preconds <ol>, steps <ol>, Expected = 'Expected results' <ul> + Source line + Exact quotes <ul>
  + AUTOMATION marker. Verbatim quotes (Rule 113), runnable (Rule 114), Rule-117 shape, title <=80.
All cases source-verified only -> AUTOMATION: HOLD (no MR build). --apply writes; dry otherwise."""
import json,urllib.request,base64,sys,time
c=json.load(open("/tmp/testrail/creds.json"))
HOST=c["host"].rstrip("/");AUTH=base64.b64encode(f'{c["user"]}:{c["password"]}'.encode()).decode()
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
MARK="AUTOMATION: HOLD - not yet build-verified on a Maintenance Reminders QA build (feature ships behind the maintenance_reminders flag)"
LOG={}
DRY="--apply" not in sys.argv
_EXISTING={}
def _titles(section_id):
    if section_id not in _EXISTING:
        got=set();off=0
        while True:
            d=api(f"get_cases/1&suite_id=1&section_id={section_id}&limit=250&offset={off}")
            for c in (d["cases"] if isinstance(d,dict) else d): got.add(c["title"])
            if not (isinstance(d,dict) and d.get("_links",{}).get("next")): break
            off+=250
        _EXISTING[section_id]=got
    return _EXISTING[section_id]
def add(section_id,title,story_jira,story_label,part,pre,steps,results,quotes,marker=MARK):
    assert len(title)<=80,f"title {len(title)}: {title}"
    if not DRY and title in _titles(section_id):
        print(f"[SKIP exists] sec {section_id} {title}"); return
    src=(f"Epic SV-3780 (Maintenance Reminders); story {story_jira} ({story_label}); "
         f"Chunk 2 MR spec (Confluence 897679389), {part}; read 2 Oct 2026. "
         "Source-verified 2 October 2026; not yet build-verified.")
    exp=("<p><strong>Expected results</strong></p>"+ul(results)
         +"<p></p><p><strong>Source &mdash; where this behaviour comes from</strong><br>"+esc(src)+"</p>"
         +"<p></p><p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
         +"<ul>"+"".join(f"<li><strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;</li>" for a,q in quotes)+"</ul>"
         +"<p></p><p>"+esc(marker)+"</p>")
    if DRY:
        print(f"[DRY] sec {section_id} ({len(title)}) {title}"); return
    r=api(f"add_case/{section_id}",{"title":title,"custom_preconds":ol(pre),"custom_steps":ol(steps),
        "custom_expected":exp,"custom_automation_type":2,"custom_atmstatus":1})
    LOG[str(r["id"])]={"title":title,"section":section_id}
    print(f"[OK] C{r['id']} sec {section_id} {title}")
def save(path):
    if not DRY:
        import os; os.makedirs(os.path.dirname(path),exist_ok=True)
        allc=json.load(open(path)) if os.path.exists(path) else {}
        allc.update(LOG); json.dump(allc,open(path,"w"),indent=1); print(f"logged {len(LOG)}; total {len(allc)}")
