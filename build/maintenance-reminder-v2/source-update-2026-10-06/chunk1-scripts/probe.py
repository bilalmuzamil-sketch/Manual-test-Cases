import sys, pathlib, json, urllib.request, ssl, hashlib
from playwright.sync_api import sync_playwright
CHROME="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
D=pathlib.Path("/home/user/Manual-test-Cases/build/maintenance-reminder-v2/sources/design-MR_V2_2-2026-10-06")
CACHE=pathlib.Path("cdn")
ctx=ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
def handle(route):
    u=route.request.url; fn=CACHE/(u.rsplit('/',1)[-1])
    if not fn.exists():
        fn.write_bytes(urllib.request.urlopen(u,context=ctx).read())
    route.fulfill(body=fn.read_bytes(), content_type="application/javascript", headers={"access-control-allow-origin":"*"})
f=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=CHROME,args=["--no-sandbox","--disable-gpu","--allow-file-access-from-files"])
    pg=b.new_page(viewport={"width":1440,"height":900})
    pg.route("https://**/*", handle)
    msgs=[]
    pg.on("console", lambda m: msgs.append(m.text))
    pg.on("pageerror", lambda e: msgs.append("ERR "+str(e)))
    pg.goto((D/f).as_uri(), wait_until="load", timeout=120000)
    pg.wait_for_timeout(6000)
    info=pg.evaluate("""()=>({bodyLen:document.body.innerText.length,
      sw:document.documentElement.scrollWidth, sh:document.documentElement.scrollHeight,
      top: [...document.body.children].map(e=>e.tagName+'#'+e.id+'.'+e.className+' '+e.getBoundingClientRect().width+'x'+e.getBoundingClientRect().height).slice(0,20),
      scrollers:[...document.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e);return (s.overflow+s.overflowX+s.overflowY).match(/auto|scroll/) && e.scrollHeight>e.clientHeight+10}).map(e=>e.tagName+'.'+e.className+' '+e.scrollWidth+'x'+e.scrollHeight).slice(0,10),
      transforms:[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).transform!='none').map(e=>e.tagName+'.'+String(e.className).slice(0,40)+' '+getComputedStyle(e).transform).slice(0,10),
      buttons:document.querySelectorAll('button,a,[role=button]').length, all:document.querySelectorAll('*').length,
      start: document.body.innerText.slice(0,300),
      ptr: [...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).cursor=='pointer').length,
      tt: document.querySelectorAll('.sv-tt-host,[title],[aria-describedby]').length,
      ttcls: [...new Set([...document.querySelectorAll('[class*=tt]')].map(e=>e.className))].slice(0,20),
      onclick: document.querySelectorAll('[onclick]').length,
      inputs: document.querySelectorAll('input,select,textarea').length,
      details: document.querySelectorAll('details,summary').length,
      roles: [...new Set([...document.querySelectorAll('[role]')].map(e=>e.getAttribute('role')))],
      datas: [...new Set([...document.querySelectorAll('*')].flatMap(e=>[...e.attributes].map(a=>a.name).filter(n=>n.startsWith('data-'))))].slice(0,40),
      reactHandlers: [...document.querySelectorAll('*')].filter(e=>{const k=Object.keys(e).find(k=>k.startsWith('__reactProps'));return k && Object.keys(e[k]).some(x=>/^on[A-Z]/.test(x))}).length
    })""")
    print(json.dumps(info,indent=1))
    print(msgs[:20])
    pg.screenshot(path="probe.png")
    b.close()
