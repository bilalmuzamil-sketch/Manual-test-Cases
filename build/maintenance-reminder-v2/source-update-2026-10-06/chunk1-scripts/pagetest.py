import sys, pathlib, importlib.util
spec=importlib.util.spec_from_file_location("ddf","/home/user/Manual-test-Cases/build/testing-tools/drive_design_full.py"); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
from playwright.sync_api import sync_playwright
D=pathlib.Path("/home/user/Manual-test-Cases/build/maintenance-reminder-v2/sources/design-MR_V2_2-2026-10-06")
with sync_playwright() as p:
    for f in sys.argv[1:]:
        b,ctx,pg,logs=m.open_board(p,(D/f).as_uri(),"cdncache",{"width":1440,"height":900})
        m.load(pg,(D/f).as_uri())
        print(f, pg.evaluate("()=>__dd.pages()"))
        print("  top-level blocks:", pg.evaluate("()=>{const r=document.querySelector('#dc-root'); let c=r; while(c.children.length===1) c=c.children[0]; return [...c.children].map(x=>x.tagName+'#'+x.id+' '+(x.innerText||'').split('\\n').filter(Boolean).slice(0,2).join(' / ').slice(0,90))}"))
        b.close()
