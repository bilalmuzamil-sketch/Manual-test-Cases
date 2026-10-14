import asyncio,json,pathlib
from playwright.async_api import async_playwright
T=['Main','01_Opens_Before','01_Opens_After','08_Customers_New','14_Phone_Before','14_Phone_After']
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"); pg=await (await br.new_context(viewport={'width':1440,'height':900})).new_page()
        out={}
        for t in T:
            await pg.goto(pathlib.Path('page/Dashboard-v1-canvas.html').resolve().as_uri()); await pg.wait_for_timeout(3500)
            before=set((await pg.evaluate("document.body.innerText")).split('\n'))
            r=await pg.evaluate("t=>{const e=[...document.querySelectorAll('span.min-w-16.truncate')].find(x=>x.innerText.trim()===t);if(!e)return null;for(const ev of ['pointerover','pointerenter','mouseover','mouseenter'])e.dispatchEvent(new MouseEvent(ev,{bubbles:true}));const b=e.getBoundingClientRect();return {x:b.x,y:b.y,title:e.title||e.parentElement.title||''}}",t)
            await pg.wait_for_timeout(500)
            out[t]={'found':r is not None,'title_attr':(r or {}).get('title'),'new_text':[l for l in (await pg.evaluate("document.body.innerText")).split('\n') if l and l not in before]}
        json.dump(out,open('out-exportplay/title-hover-6.json','w'),indent=1); print(out)
        await br.close()
asyncio.run(main())
