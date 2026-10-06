# Render every declared prop variant of the two component boards (incl. variants no board uses), via an in-memory harness.
import sys, pathlib, json, importlib.util
spec=importlib.util.spec_from_file_location("ddf","/home/user/Manual-test-Cases/build/testing-tools/drive_design_full.py"); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
from playwright.sync_api import sync_playwright
D=pathlib.Path("/home/user/Manual-test-Cases/build/maintenance-reminder-v2/sources/design-MR_V2_2-2026-10-06")
OUT=pathlib.Path("/home/user/Manual-test-Cases/build/maintenance-reminder-v2/source-update-2026-10-06/DESIGN-DRIVE-2026-10-06")
srv,base=m.start_server(D)
VARS=[("ShopviewHeader","nav",["customers","workOrders","schedule","none"]),("SettingsSidebar","active",["maintenance","none"])]
res=[]
with sync_playwright() as p:
    b,ctx,pg,logs=m.open_board(p,base,"cdncache",{"width":1440,"height":900})
    for comp,prop,vals in VARS:
        for v in vals:
            html=f'''<!DOCTYPE html><html><head><meta charset="utf-8"><script src="./support.js"></script></head><body><x-dc>
<helmet><link rel="stylesheet" href="_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/colors_and_type.css"><link rel="stylesheet" href="_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/components.css"><script src="_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bundle.js"></script></helmet>
<div style="width:1440px"><dc-import name="{comp}" {prop}="{v}" hint-size="100%,900px"></dc-import></div></x-dc></body></html>'''
            url=base+f"__harness_{comp}_{v}.html"
            pg.route(url, (lambda h: (lambda r: r.fulfill(body=h, content_type="text/html")))(html))
            pg.goto(url, wait_until="load"); m.wait_render(pg,2500,20000); pg.evaluate(m.JS_LIB)
            info=pg.evaluate("""()=>({text: __dd.visibleText(document.body),
               active:[...document.querySelectorAll('[aria-current],[class*=active],[class*=selected],[class*=--on]')].map(e=>(e.className+'').slice(0,60)+' :: '+(e.innerText||'').trim().slice(0,40)),
               tooltips:[...document.querySelectorAll('.sv-tt-pop,[title]')].map(e=>e.getAttribute('title')||e.textContent.trim())})""")
            shot=OUT/"screenshots"/f"component-variant--{comp}--{prop}={v}.png"; shot.parent.mkdir(exist_ok=True,parents=True)
            pg.screenshot(path=str(shot), clip={"x":0,"y":0,"width":1440,"height":900 if comp=="SettingsSidebar" else 80})
            res.append({"component":comp,"prop":prop,"value":v,"visible_text":info["text"],"active_markers":info["active"],"tooltips":info["tooltips"],"screenshot":str(shot.relative_to(OUT))})
    b.close()
(OUT/"component-variants.json").write_text(json.dumps(res,indent=1,ensure_ascii=False))
for r in res: print(r["component"],r["value"],"|",r["visible_text"].replace("\n"," / ")[:160],"| active:",r["active_markers"][:4])
srv.shutdown()
