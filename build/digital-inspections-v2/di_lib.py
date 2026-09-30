#!/usr/bin/env python3
"""Rule-117 reformat harness for Digital Inspections V2 (in-place update_case).
Preserves each case's existing Source line + verbatim quotes + AUTOMATION marker BYTE-FOR-BYTE
(everything from '<p><strong>Source' onward), and only rewrites the title, seeded preconditions,
build-glossary steps, and runnable Expected-results bullets."""
import json,urllib.request,base64,time,sys
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
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def ol(lines): return "<ol>"+"".join(f"<li>{esc(x)}</li>" for x in lines)+"</ol>"
def ul(items): return "<ul>"+"".join(f"<li>{esc(x)}</li>" for x in items)+"</ul>"
_CACHE=json.load(open("/tmp/claude-0/di_cases.json")) if __import__("os").path.exists("/tmp/claude-0/di_cases.json") else {}
def _tail(cid):
    exp=_CACHE.get(str(cid),{}).get("exp") or api(f"get_case/{cid}")["custom_expected"]
    i=exp.find("<p><strong>Source")
    if i<0: raise ValueError(f"C{cid}: no Source block found - cannot preserve quotes safely")
    return exp[i:]
def update(cid, title, pre, steps, results):
    dry = "--apply" not in sys.argv
    newexp="<p><strong>Expected results</strong></p>"+ul(results)+_tail(cid)
    if dry:
        print(f"[DRY] C{cid}  {title[:70]} ({len(title)})"); return
    api(f"update_case/{cid}",{"title":title[:250],"custom_preconds":ol(pre),
        "custom_steps":ol(steps),"custom_expected":newexp})
    print(f"[OK] C{cid}  {title}")
def run(CASES):
    for cs in CASES: update(cs["cid"],cs["title"],cs["pre"],cs["steps"],cs["results"])
    if "--apply" in sys.argv: print(f"updated {len(CASES)}")

def light(cid, title, pre):
    """Update ONLY the title and seeded preconditions; leave steps and expected untouched
    (for cases whose steps and Expected results already meet Rule 117)."""
    dry = "--apply" not in sys.argv
    if dry: print(f"[DRY] C{cid}  {title[:72]} ({len(title)})"); return
    api(f"update_case/{cid}",{"title":title[:250],"custom_preconds":ol(pre)})
    print(f"[OK] C{cid}  {title}")
def run_light(CASES):
    for cs in CASES: light(cs["cid"],cs["title"],cs["pre"])
    if "--apply" in sys.argv: print(f"updated {len(CASES)}")
