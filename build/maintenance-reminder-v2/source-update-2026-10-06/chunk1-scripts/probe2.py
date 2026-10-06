import sys, pathlib, json, urllib.request, ssl
from playwright.sync_api import sync_playwright
CHROME="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
D=pathlib.Path("/home/user/Manual-test-Cases/build/maintenance-reminder-v2/sources/design-MR_V2_2-2026-10-06")
CACHE=pathlib.Path("cdn")
def handle(route):
    u=route.request.url; fn=CACHE/(u.rsplit('/',1)[-1])
    route.fulfill(body=fn.read_bytes(), content_type="application/javascript", headers={"access-control-allow-origin":"*"})
f=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=CHROME,args=["--no-sandbox","--disable-gpu","--allow-file-access-from-files"])
    pg=b.new_page(viewport={"width":1440,"height":900})
    pg.route("https://**/*", handle)
    pg.goto((D/f).as_uri(), wait_until="load", timeout=120000)
    pg.wait_for_timeout(6000)
    cdp=pg.context.new_cdp_session(pg)
    cdp.send("DOM.enable"); cdp.send("Runtime.enable")
    import collections
    cnt=collections.Counter(); samples=[]
    for expr in ["window","document"]:
        o=cdp.send("Runtime.evaluate",{"expression":expr})["result"]["objectId"]
        ls=cdp.send("DOMDebugger.getEventListeners",{"objectId":o})["listeners"]
        print(expr,[ (l["type"]) for l in ls])
    n=pg.evaluate("()=>{window.__all=[...document.querySelectorAll('*')];return window.__all.length}")
    for i in range(n):
        o=cdp.send("Runtime.evaluate",{"expression":f"window.__all[{i}]"})["result"]["objectId"]
        ls=cdp.send("DOMDebugger.getEventListeners",{"objectId":o})["listeners"]
        if ls:
            for l in ls: cnt[l["type"]]+=1
            if len(samples)<15: samples.append(pg.evaluate(f"()=>{{const e=window.__all[{i}];return e.tagName+'.'+e.className+' '+(e.innerText||'').slice(0,40)}}")+" "+",".join(l["type"] for l in ls))
    print(cnt); print("\n".join(samples))
    b.close()
