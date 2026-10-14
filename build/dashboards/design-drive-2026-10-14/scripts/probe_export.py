import asyncio,json,pathlib
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"); pg=await (await br.new_context(viewport={'width':1440,'height':900})).new_page()
        await pg.goto(pathlib.Path('page/Dashboard-v1-canvas.html').resolve().as_uri()); await pg.wait_for_timeout(4000)
        await pg.evaluate("document.querySelectorAll(\"button[aria-label='Play artboard']\")[2].click()"); await pg.wait_for_timeout(2500)
        info=await pg.evaluate("""[...document.querySelectorAll('*')].filter(e=>e.childElementCount===0&&e.textContent.trim()==='Export').map(e=>{const b=e.closest('button,[role=button],a');const r=(b||e).getBoundingClientRect();return {tag:e.tagName,btn:b?b.outerHTML.slice(0,200):null,x:r.x,y:r.y,w:r.width,h:r.height,vis:getComputedStyle(b||e).visibility,op:getComputedStyle(b||e).opacity}})""")
        print(info)
        before=set((await pg.evaluate("document.body.innerText")).split('\n'))
        bb=info[0]
        await pg.mouse.move(bb['x']+bb['w']/2,bb['y']+bb['h']/2); await pg.wait_for_timeout(400)
        tip=[l for l in (await pg.evaluate("document.body.innerText")).split('\n') if l and l not in before]
        await pg.mouse.click(bb['x']+bb['w']/2,bb['y']+bb['h']/2); await pg.wait_for_timeout(800)
        new=[l for l in (await pg.evaluate("document.body.innerText")).split('\n') if l and l not in before]
        print('hover',tip,'click',new)
        await pg.screenshot(path='out-exportplay/shots/player-export.png')
        json.dump({'hover':tip,'click':new},open('out-exportplay/player-export.json','w'),ensure_ascii=False)
        await br.close()
asyncio.run(main())
