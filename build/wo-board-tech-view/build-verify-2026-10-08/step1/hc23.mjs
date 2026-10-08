import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc23.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S10043-17594',{delay:30}); await page.waitForTimeout(4500); await page.locator('tbody tr').filter({hasText:'S10043-17594'}).first().locator('td').nth(3).click(); await page.waitForTimeout(6000);
 const url0=page.url(); await page.locator('button:has-text("Receive")').last().click(); await page.waitForTimeout(6000); log('URL',url0,'->',page.url()); log('RECEIVE OV',(await ov()).slice(0,900));
 const t=await body(); log('RECEIVE PAGE',t.slice(t.search(/Receive/),t.search(/Receive/)+1200)); await dump('hc-wo-receive');
 log('INPUTS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('input,textarea')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||e.placeholder||'')+':'+(e.value||'')))));
 log('BTNS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.offsetParent).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(-12))));
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
