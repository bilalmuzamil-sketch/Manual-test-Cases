"""Supplement to drive_design_canvas.py, whose Export step timed out on all boards (the canvas is CSS-transformed, so
the buttons sit outside the viewport for Playwright's pointer actions). Here each canvas control is clicked through the
DOM (element.click()), which the canvas accepts. Per board: Export menu opened and its options recorded; Play opened,
the played view's text, images and every control in it recorded and clicked (Fit, Export menu, Back to canvas),
screenshots light and dark."""
import asyncio,json,sys,pathlib
from playwright.async_api import async_playwright
CH="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
MENU="[...document.querySelectorAll('[role=menu]')].map(e=>e.innerText.trim())"
async def main(page_html,out):
    out=pathlib.Path(out); (out/'shots').mkdir(parents=True,exist_ok=True); log=open(out/'export-play.jsonl','w')
    async with async_playwright() as p:
        br=await p.chromium.launch(executable_path=CH); pg=await (await br.new_context(viewport={'width':1440,'height':900})).new_page()
        url=pathlib.Path(page_html).resolve().as_uri(); await pg.goto(url); await pg.wait_for_timeout(5000)
        titles=await pg.evaluate("[...document.querySelectorAll('span.min-w-16.truncate')].map(e=>e.innerText.trim())")
        for bi,t in enumerate(titles):
            rec={'board':t,'i':bi}
            try:
                await pg.goto(url); await pg.wait_for_timeout(3000)
                await pg.evaluate(f"document.querySelectorAll(\"button[aria-label='Export artboard']\")[{bi}].click()"); await pg.wait_for_timeout(600)
                rec['export_menu']=await pg.evaluate(MENU); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300)
                await pg.evaluate(f"document.querySelectorAll(\"button[aria-label='Play artboard']\")[{bi}].click()"); await pg.wait_for_timeout(2500)
                rec['play_text']=await pg.evaluate("document.body.innerText")
                rec['play_frames']=[]
                for fr in pg.frames[1:]:
                    try: rec['play_frames'].append({'text':(await fr.evaluate("document.body.innerText"))[:1500],'imgs':await fr.evaluate("[...document.querySelectorAll('img')].map(e=>e.getAttribute('src')+' | '+e.alt.slice(0,60))")})
                    except Exception as e: rec['play_frames'].append({'error':str(e)[:80]})
                await pg.screenshot(path=str(out/'shots'/f'play-{bi+1:02d}.png'))
                await pg.emulate_media(color_scheme='dark'); await pg.wait_for_timeout(400); await pg.screenshot(path=str(out/'shots'/f'play-{bi+1:02d}-dark.png')); await pg.emulate_media(color_scheme='light')
                ctrls=await pg.evaluate("[...document.querySelectorAll('button,[role=button],a')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('aria-label')||e.innerText||'').trim())")
                rec['play_controls']=ctrls; rec['play_control_results']={}
                for lab in [c for c in ctrls if c and c!='Back to canvas']:
                    try:
                        await pg.evaluate("l=>{const b=[...document.querySelectorAll('button,[role=button],a')].find(e=>((e.getAttribute('aria-label')||e.innerText||'').trim())===l);b&&b.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));b&&b.click()}",lab); await pg.wait_for_timeout(600)
                        rec['play_control_results'][lab]={'menu':await pg.evaluate(MENU),'title':await pg.evaluate("l=>{const b=[...document.querySelectorAll('button,[role=button],a')].find(e=>((e.getAttribute('aria-label')||e.innerText||'').trim())===l);return b?(b.title||b.getAttribute('aria-label')||''):''}",lab)}
                        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(300)
                    except Exception as e: rec['play_control_results'][lab]={'error':str(e)[:100]}
                await pg.evaluate("(()=>{const b=[...document.querySelectorAll('button')].find(e=>(e.innerText||e.getAttribute('aria-label')||'').trim()==='Back to canvas');b&&b.click()})()"); await pg.wait_for_timeout(800)
                rec['back_to_canvas']=await pg.locator("button[aria-label='Play artboard']").count()>0
                rec['ok']=True
            except Exception as e: rec['error']=str(e)[:200]
            log.write(json.dumps(rec,ensure_ascii=False)+'\n'); log.flush()
        await br.close()
asyncio.run(main(sys.argv[1],sys.argv[2]))
