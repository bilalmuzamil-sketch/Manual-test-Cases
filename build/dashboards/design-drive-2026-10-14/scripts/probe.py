import asyncio,json,pathlib,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"); pg=await (await br.new_context(viewport={'width':1440,'height':900})).new_page()
        await pg.goto(pathlib.Path('page/Dashboard-v1-canvas.html').resolve().as_uri()); await pg.wait_for_timeout(5000)
        info=await pg.evaluate("""[...document.querySelectorAll("button[aria-label='Export artboard'],button[aria-label='Play artboard']")].slice(0,6).map(b=>{const r=b.getBoundingClientRect();const cs=getComputedStyle(b);return [b.getAttribute('aria-label'),Math.round(r.x),Math.round(r.y),Math.round(r.width),cs.opacity,cs.visibility]})""")
        print(info)
        n=await pg.locator("button[aria-label='Export artboard']").count(); print('export buttons',n)
        # try: JS click on Export of board index 2 then list menus
        await pg.evaluate("document.querySelectorAll(\"button[aria-label='Export artboard']\")[2].click()"); await pg.wait_for_timeout(800)
        print('menus after js click', await pg.evaluate("[...document.querySelectorAll('[role=menu],[role=menuitem]')].map(e=>e.innerText.trim().slice(0,80))"))
        await pg.keyboard.press('Escape')
        # pointer events sequence
        await pg.evaluate("""(()=>{const b=document.querySelectorAll("button[aria-label='Export artboard']")[2];for(const t of ['pointerdown','mousedown','pointerup','mouseup','click'])b.dispatchEvent(new PointerEvent(t,{bubbles:true,cancelable:true,pointerType:'mouse',button:0}))})()"""); await pg.wait_for_timeout(800)
        print('menus after dispatch', await pg.evaluate("[...document.querySelectorAll('[role=menu],[role=menuitem]')].map(e=>e.innerText.trim().slice(0,80))"))
        await pg.keyboard.press('Escape')
        await pg.evaluate("document.querySelectorAll(\"button[aria-label='Play artboard']\")[2].click()"); await pg.wait_for_timeout(1500)
        t=await pg.evaluate("document.body.innerText"); print('after play click len',len(t), t[:300].replace('\n','|'))
        await pg.screenshot(path='probe-play.png')
        await br.close()
asyncio.run(main())
