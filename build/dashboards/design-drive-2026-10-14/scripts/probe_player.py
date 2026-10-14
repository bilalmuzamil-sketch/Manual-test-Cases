import asyncio,json,pathlib
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"); pg=await (await br.new_context(viewport={'width':1440,'height':900})).new_page()
        out={}
        for bi in (2,48):
            await pg.goto(pathlib.Path('page/Dashboard-v1-canvas.html').resolve().as_uri()); await pg.wait_for_timeout(4000)
            await pg.evaluate(f"document.querySelectorAll(\"button[aria-label='Play artboard']\")[{bi}].click()"); await pg.wait_for_timeout(2500)
            for lab in ['Fit','Export','Read-only']:
                before=set((await pg.evaluate("document.body.innerText")).split('\n'))
                b=pg.get_by_text(lab,exact=True).first
                try:
                    await b.hover(timeout=3000); await pg.wait_for_timeout(300)
                    tip=[l for l in (await pg.evaluate("document.body.innerText")).split('\n') if l and l not in before]
                    await b.click(timeout=3000); await pg.wait_for_timeout(700)
                    new=[l for l in (await pg.evaluate("document.body.innerText")).split('\n') if l and l not in before]
                    out[f'{bi}:{lab}']={'hover_new':tip,'click_new':new[:40]}
                    await pg.screenshot(path=f'out-exportplay/shots/player-{bi}-{lab}.png')
                except Exception as e: out[f'{bi}:{lab}']={'error':str(e)[:150]}
                await pg.keyboard.press('Escape'); await pg.wait_for_timeout(400)
            try:
                await pg.get_by_text('Back to canvas').first.click(timeout=3000)
            except Exception:
                await pg.evaluate("(()=>{const b=[...document.querySelectorAll('button,[role=button],a,div')].find(e=>e.innerText&&e.innerText.trim().endsWith('Back to canvas')&&e.children.length<4);b&&b.click()})()")
            await pg.wait_for_timeout(800)
            out[f'{bi}:back']=await pg.locator("button[aria-label='Play artboard']").count()
        json.dump(out,open('out-exportplay/player-controls-2.json','w'),indent=1,ensure_ascii=False); print(json.dumps(out,ensure_ascii=False)[:3000])
        await br.close()
asyncio.run(main())
