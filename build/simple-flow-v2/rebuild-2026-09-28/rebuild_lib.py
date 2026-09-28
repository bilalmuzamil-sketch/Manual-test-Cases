#!/usr/bin/env python3
"""Shared builder for the Simple Flow V2 in-place rewrite (2026-09-28).
Rewrites EXISTING cases only (update_case) — no add, no delete; results preserved.
Quality bar: rich build-grounded preconditions, atomic steps, Rule-113 three-part Expected."""
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

def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def ol(lines): return "<ol>"+"".join(f"<li>{esc(x)}</li>" for x in lines)+"</ol>"
def ul_raw(items): return "<ul>"+"".join(f"<li>{x}</li>" for x in items)+"</ul>"

MARKER="<p>AUTOMATION: HOLD - rewritten 2026-09-28 to the atomic build-grounded standard; re-verify on the sv8683 QA build</p>"

def expected(results, source, quotes):
    p1="<p><strong>Expected results</strong></p>"+ul_raw(esc(r) for r in results)
    p2=f"<p><strong>Source — where this behaviour comes from</strong><br>{esc(source)} Source-verified 28 September 2026; not yet build-verified.</p>"
    p3="<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"+ul_raw(
        f"<strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;" for a,q in quotes)
    return p1+"<p></p>"+p2+"<p></p>"+p3+"<p></p>"+MARKER

def run(CASES, logname):
    """CASES: list of dict(id,title,pre[],steps[],results[],source,quotes[(anchor,text)])"""
    dry = "--apply" not in sys.argv
    log=[]
    for cs in CASES:
        payload={"title":cs["title"][:250],
                 "custom_preconds":ol(cs["pre"]),
                 "custom_steps":ol(cs["steps"]),
                 "custom_expected":expected(cs["results"],cs["source"],cs["quotes"])}
        if dry:
            print(f"[DRY] C{cs['id']}  {cs['title'][:64]}")
            continue
        try:
            r=api(f"update_case/{cs['id']}",payload)
            log.append({"op":"update_case","cid":cs["id"],"http":"200","title":r.get("title")})
            print(f"[OK] C{cs['id']}  {cs['title'][:60]}")
        except urllib.error.HTTPError as e:
            body=e.read().decode()[:300]
            log.append({"op":"update_case","cid":cs["id"],"http":str(e.code),"error":body})
            print(f"[FAIL {e.code}] C{cs['id']}  {body}")
    if not dry:
        os.makedirs(os.path.dirname(logname),exist_ok=True)
        with open(logname,"a") as f:
            for e in log: f.write(json.dumps(e)+"\n")
        print(f"logged {len(log)} ops -> {logname}")
