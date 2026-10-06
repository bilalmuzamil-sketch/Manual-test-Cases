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
        res[f]=pg.evaluate("""()=>{ const out=[]; for (const e of document.querySelectorAll('[id]')) { if (e.id.startsWith('dc-')) continue;
            // section heading = nearest preceding heading-ish text in ancestors' previous siblings
            let sec=''; let x=e; while(x && !sec){ let s=x.previousElementSibling; while(s && !sec){ const t=(s.innerText||'').trim(); if(t && t.length<200) sec=t.split('\\n').filter(Boolean).slice(0,3).join(' / '); s=s.previousElementSibling;} x=x.parentElement; if(x && x.id) break;}
            out.push({id:e.id, title:(e.innerText||'').split('\\n').map(s=>s.trim()).filter(Boolean).slice(0,3).join(' / ').slice(0,140), section: sec.slice(0,140), y: Math.round(e.getBoundingClientRect().top+scrollY)}); } return out; }""")
        b.close()
(OUT/"artboard-index.json").write_text(json.dumps(res,indent=1,ensure_ascii=False))
for f,v in res.items(): print(f,len(v))
