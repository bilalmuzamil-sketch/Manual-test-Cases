import sys, pathlib, json, importlib.util
spec=importlib.util.spec_from_file_location("ddf","/home/user/Manual-test-Cases/build/testing-tools/drive_design_full.py"); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
from playwright.sync_api import sync_playwright
D=pathlib.Path("/home/user/Manual-test-Cases/build/maintenance-reminder-v2/sources/design-MR_V2_2-2026-10-06")
OUT=pathlib.Path("/home/user/Manual-test-Cases/build/maintenance-reminder-v2/source-update-2026-10-06/DESIGN-DRIVE-2026-10-06")
res={}
with sync_playwright() as p:
    for f in sys.argv[1:]:
        b,ctx,pg,logs=m.open_board(p,(D/f).as_uri(),"cdncache",{"width":1440,"height":900})
        m.load(pg,(D/f).as_uri())
        res[f]=pg.evaluate("""()=>{const o={}; for(const e of document.querySelectorAll('[id]')){ if(e.id.startsWith('dc-')||/^(top|page\\d|p4|p5)$/.test(e.id)) continue; o[e.id]=__dd.visibleText(e);} return o;}""")
        b.close()
(OUT/"artboard-visible-text.json").write_text(json.dumps(res,indent=1,ensure_ascii=False))
