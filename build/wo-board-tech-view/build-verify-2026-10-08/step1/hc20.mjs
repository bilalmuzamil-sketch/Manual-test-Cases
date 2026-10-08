import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc20.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S10043-17594',{delay:30}); await page.waitForTimeout(4500); await page.locator('tbody tr').filter({hasText:'S10043-17594'}).first().locator('td').nth(3).click(); await page.waitForTimeout(6000);
 const before=await body(); const url0=page.url();
 const ap=page.locator('button:has-text("Add Part"), [role=button]:has-text("Add Part")'); log('addpart buttons',await ap.count());
 await ap.first().click({force:true}); await page.waitForTimeout(3500);
 const after=await body(); log('URL',url0,'->',page.url()); log('OV',(await ov()).slice(0,800));
 const i=after.indexOf('Add Part'); log('AFTER TEXT around',after.slice(Math.max(0,i-300),i+900));
 log('INPUTS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('input,textarea')].filter(e=>e.offsetParent).map(e=>e.getAttribute('aria-label')||e.placeholder||'').filter(Boolean))));
 await dump('hc-wo-addpart-click'); await page.screenshot({path:'/home/user/Manual-test-Cases/build/wo-board-tech-view/build-verify-2026-10-08/step1/hc-wo-addpart-click-full.png',fullPage:true});
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
