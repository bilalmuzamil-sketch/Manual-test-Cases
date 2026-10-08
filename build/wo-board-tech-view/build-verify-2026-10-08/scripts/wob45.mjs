import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob45.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/schedule','admin'); const {page}=b; const {ov}=mk(page); page.setDefaultTimeout(15000);
try{
 for(let k=0;k<3;k++){
  await page.goto('https://sv10043.qa.shopview.com/schedule'); await page.waitForTimeout(8000);
  await page.locator('button:has-text("chevron_right")').nth(1).click(); await page.waitForTimeout(8000);
  const n=await page.locator('.fc-timeline-event').count(); log('shifts',n); if(!n) break;
  await page.locator('.fc-timeline-event').first().click(); await page.waitForTimeout(2000);
  await page.locator('button:has-text("delete_outline")').first().click(); await page.waitForTimeout(2000);
  log('DEL PROMPT',await ov());
  const btns=await page.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.offsetParent).map(e=>e.innerText.replace(/\s+/g,' ').trim())); log('BTNS',JSON.stringify(btns));
  const c=page.locator('.q-dialog button').filter({hasText:/^(Delete|Remove|Yes|Confirm)/}).last(); if(await c.count()){await c.click(); await page.waitForTimeout(2500);} log('AFTER',await ov());
 }
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
