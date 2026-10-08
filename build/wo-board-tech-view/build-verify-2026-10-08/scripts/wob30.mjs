import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/wob30.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov}=mk(page); page.setDefaultTimeout(15000);
try{
await page.locator('button:has-text("Create Work Order")').first().click(); await page.waitForTimeout(3000);
const d=page.locator('.q-dialog');
log('DLG',await ov());
log('INPUTS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog input')].filter(e=>e.offsetParent).map(e=>e.getAttribute('aria-label')))));
const c=d.locator('input').first(); await c.click(); await c.pressSequentially('ZZAUTOTEST Fib',{delay:100}); await page.waitForTimeout(3000); log('CUST MENU',(await ov()).slice(-300));
await page.locator('.q-menu .q-item').filter({hasText:'ZZAUTOTEST Fibridge'}).first().click(); await page.waitForTimeout(2500);
const a=d.locator('input').nth(1); await a.click(); await page.waitForTimeout(2500); log('ASSET MENU',(await ov()).slice(-400));
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
