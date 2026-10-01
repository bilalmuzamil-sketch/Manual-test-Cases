# -*- coding: utf-8 -*-
"""Builder for DEFERRED / not-in-this-release gap cases (QA lead 4-point format, 2026-10-01).
TOP of preconditions: (1) the author's RELEASE statement, verbatim + cite; (2) How to test this
(automatable, or manual-preferred + WHY); then a separator; then the discrete preconditions.
BOTTOM of expected (after a line break): the author's note (what the spec says about this).
Rule 117 shape otherwise. Dry by default; --apply writes."""
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
LOG={}
DRY="--apply" not in sys.argv
def sec(name,parent=None,suite=1):
    if DRY: print(f"[DRY] section: {name}"); return -1
    d={"name":name,"suite_id":suite}
    if parent: d["parent_id"]=parent
    r=api("add_section/1" if False else f"add_section/{api('get_suites')[0]['project_id'] if False else _pid()}",d)
    return r["id"]
_PID=[None]
def _pid():
    if _PID[0] is None: _PID[0]=api("get_suite/1")["project_id"]
    return _PID[0]
def add_section(name,parent=None):
    if DRY: print(f"[DRY] SECTION: {name} (parent {parent})"); return -1
    d={"name":name,"suite_id":1}
    if parent: d["parent_id"]=parent
    r=api(f"add_section/{_pid()}",d); print(f"[OK] section {r['id']}: {name}"); return r["id"]
def add(section_id,title,release,release_cite,method,pre,steps,results,source,quotes,author_note,marker_reason):
    """method = ('auto',) or ('manual','why'). release = verbatim author release quote."""
    assert len(title)<=80,f"title too long ({len(title)}): {title}"
    if method[0]=="auto":
        mtxt="Can be automated - the behaviour is deterministic UI / backend logic an automation harness can drive and check."
    else:
        mtxt="Manual testing preferred. Why: "+method[1]
    rel=(f"<p><strong>&#9888; Release status - the author's words:</strong> &ldquo;{esc(release)}&rdquo; ({esc(release_cite)})</p>"
         if release else "")
    banner=(rel
            +f"<p><strong>&#9654; How to test this:</strong> {esc(mtxt)}</p>"
            f"<p>&mdash; &mdash; &mdash;</p>")
    preconds=banner+ol(pre)
    exp=("<p><strong>Expected results</strong></p>"+ul(results)
         +f"<p><strong>Source - where this behaviour comes from</strong><br>{esc(source)} "
          "Source-verified 1 October 2026; not yet build-verified.</p>"
         +"<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
         +"<ul>"+"".join(f"<li><strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;</li>" for a,q in quotes)+"</ul>"
         # AUTOMATION marker, then the author note as the LAST block (QA lead 2026-10-01: note truly last)
         +f"<p>AUTOMATION: HOLD - {esc(marker_reason)}</p>"
         +"<p>&mdash; &mdash; &mdash;</p>"
         +f"<p><strong>Note from the author (what the spec says about this):</strong> &ldquo;{esc(author_note)}&rdquo;</p>")
    if DRY:
        print(f"[DRY] sec {section_id}  {title} ({len(title)})  method={method[0]}"); return
    r=api(f"add_case/{section_id}",{"title":title,"custom_preconds":preconds,"custom_steps":ol(steps),
        "custom_expected":exp,"custom_automation_type":2,"custom_atmstatus":1})
    LOG[str(r["id"])]={"title":title,"section":section_id}
    print(f"[OK] C{r['id']} sec {section_id}  {title}")
def save(path):
    if not DRY:
        import os; os.makedirs(os.path.dirname(path),exist_ok=True)
        allc=json.load(open(path)) if os.path.exists(path) else {}
        allc.update(LOG); json.dump(allc,open(path,"w"),indent=1); print(f"logged {len(LOG)}; total {len(allc)}")
