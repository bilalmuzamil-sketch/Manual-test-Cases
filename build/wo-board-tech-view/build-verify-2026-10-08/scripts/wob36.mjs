import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob36.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/schedule','admin'); const {page}=b; const {dump,ov}=mk(page); page.setDefaultTimeout(15000);
const OUT='/home/user/Manual-test-Cases/build/wo-board-tech-view/build-verify-2026-10-08/';
try{
 // next day
 await page.locator('button:has-text("chevron_right")').nth(1).click(); await page.waitForTimeout(4000);
 log('DAY', (await page.evaluate(()=>document.body.innerText)).match(/[A-Z][a-z]{2}, [A-Z][a-z]{2} \d+/)?.[0]);
 // search WO list
 const s=page.locator('input').filter({hasNot:page.locator('[disabled]')});
 const inputs=await page.evaluate(()=>[...document.querySelectorAll('input')].filter(e=>e.offsetParent).map(e=>(e.placeholder||'')+'|'+(e.getAttribute('aria-label')||'')));
 log('INPUTS',JSON.stringify(inputs));
 await page.locator('button:has-text("search")').nth(1).click().catch(e=>log('srch btn',e.message.slice(0,80))); await page.waitForTimeout(1500);
 const inputs2=await page.evaluate(()=>[...document.querySelectorAll('input')].filter(e=>e.offsetParent).map(e=>(e.placeholder||'')+'|'+(e.getAttribute('aria-label')||'')));
 log('INPUTS2',JSON.stringify(inputs2));
 const card=page.locator('text=S10043-17581').first(); log('CARD COUNT', await page.locator('text=S10043-17581').count());
 const ana=page.locator('text=ZZAUTOTEST Ana Alpha').first(); log('ANA COUNT', await page.locator('text=ZZAUTOTEST Ana Alpha').count());
 const h8=page.locator('text="8 AM"').first(); 
 log('BOX card',JSON.stringify(await card.boundingBox().catch(()=>null)),'ana',JSON.stringify(await ana.boundingBox().catch(()=>null)),'8am',JSON.stringify(await h8.boundingBox().catch(()=>null)));
 await page.screenshot({path:OUT+'schedule-tomorrow.png'});
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
