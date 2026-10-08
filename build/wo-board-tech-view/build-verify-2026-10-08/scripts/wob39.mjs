import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob39.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/schedule','admin'); const {page}=b; const {dump,ov}=mk(page); page.setDefaultTimeout(15000);
const OUT='/home/user/Manual-test-Cases/build/wo-board-tech-view/build-verify-2026-10-08/';
try{
 await page.setViewportSize({width:1600,height:1000});
 await page.locator('button:has-text("chevron_right")').nth(1).click(); await page.waitForTimeout(4000);
 const card=page.locator('text=S2-14294').first(); const cb=await card.boundingBox();
 const row=page.locator('text=Brent Avila').nth(1); let rb=await row.boundingBox();
 const rows=await page.locator('text=Brent Avila').count(); log('rows',rows, JSON.stringify(cb), JSON.stringify(rb));
 if(!rb){ rb=await page.locator('text=Brent Avila').first().boundingBox(); }
 const h8=await page.locator('text="8 AM"').first().boundingBox();
 const tx=h8.x+200, ty=rb.y+10;
 await page.mouse.move(cb.x+20,cb.y+8); await page.mouse.down(); 
 for(let i=1;i<=20;i++){ await page.mouse.move(cb.x+20+(tx-cb.x-20)*i/20, cb.y+8+(ty-cb.y-8)*i/20); await page.waitForTimeout(40);} 
 await page.mouse.up(); await page.waitForTimeout(3000);
 log('AFTER DROP',await ov()); await page.screenshot({path:OUT+'schedule-drop-brent.png'});
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
