import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob33.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,tip,go}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.locator('button[aria-label="Board View"], button:has-text("Board View")').first().click().catch(async()=>{await page.getByRole('button',{name:'Board View'}).click();}); await page.waitForTimeout(6000);
 const pins=await page.evaluate(()=>[...document.querySelectorAll('button')].map(e=>e.getAttribute('aria-label')||'').filter(a=>/pin/i.test(a)).slice(0,8));
 log('PIN ARIA',JSON.stringify(pins));
 const pb=page.locator('button[aria-label^="Pin "], button[aria-label^="Unpin "]').first();
 log('PIN TIP',await tip(pb));
}catch(e){log('ERR pin',e.message.slice(0,200));}
try{
 await go('/schedule',9000); await dump('schedule-page');
 log('SCHED BTNS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button,[role=tab]')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,80))));
}catch(e){log('ERR sched',e.message.slice(0,200));}
await b.browser.close();
