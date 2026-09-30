#!/usr/bin/env python3
"""Builder for Maintenance Reminders Chunk 1 (new cases via add_case).
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
SMAP=json.load(open("build/maintenance-reminder-v2/section-map.json"))
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def ol(lines): return "<ol>"+"".join(f"<li>{esc(x)}</li>" for x in lines)+"</ol>"
def ul_raw(items): return "<ul>"+"".join(f"<li>{x}</li>" for x in items)+"</ul>"
MARKER=("<p>AUTOMATION: HOLD - not yet build-verified on a Maintenance Reminders QA build "
        "(feature ships behind the maintenance_reminders flag)</p>")
def expected(results, source, quotes):
    p1="<p><strong>Expected results</strong></p>"+ul_raw(esc(r) for r in results)
    p2=f"<p><strong>Source — where this behaviour comes from</strong><br>{esc(source)} Source-verified 29 September 2026; not yet build-verified.</p>"
    p3="<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"+ul_raw(
        f"<strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;" for a,q in quotes)
    return p1+"<p></p>"+p2+"<p></p>"+p3+"<p></p>"+MARKER
def run(folder_code, CASES, logname):
    dry = "--apply" not in sys.argv
    sec=SMAP[folder_code][0]; created={}
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

def update_by_anchors(folder_code, CASES, logname="build/maintenance-reminder-v2/created-log.json"):
    """Rewrite MR cases in place, matched by anchor set within the folder's section (Rule 117 reformat)."""
    import json,sys
    dry = "--apply" not in sys.argv
    sec=SMAP[folder_code][0]
    d=json.load(open(logname))
    idx={frozenset(info["anchors"]):int(cid) for cid,info in d.items() if info["section"]==sec}
    done=0; miss=[]
    for cs in CASES:
        cid=idx.get(frozenset(cs["anchors"]))
        if not cid: miss.append(cs["anchors"]); print("[MISS]",cs["anchors"]); continue
        payload={"title":cs["title"][:250],"custom_preconds":ol(cs["pre"]),"custom_steps":ol(cs["steps"]),
                 "custom_expected":expected(cs["results"],cs["source"],cs["quotes"])}
        if dry: print(f"[DRY] C{cid}  {cs['title'][:70]} ({len(cs['title'])})"); continue
        api(f"update_case/{cid}",payload); done+=1; print(f"[OK] C{cid}  {cs['title']}")
    if not dry: print(f"updated {done}; missed {len(miss)}")
    return miss
