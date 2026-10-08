import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc22.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S10043-17594',{delay:30}); await page.waitForTimeout(4500); await page.locator('tbody tr').filter({hasText:'S10043-17594'}).first().locator('td').nth(3).click(); await page.waitForTimeout(6000);
 const row=()=>page.locator('div,tr').filter({hasText:/ZZAUTOTEST Brake Pads 1/}).last();
 await page.locator('button:has-text("Order")').last().click(); await page.waitForTimeout(3500); log('ORDER',(await ov()).slice(0,600));
 const c=page.locator('.q-dialog button').filter({hasText:/^(Order|Confirm|Yes|OK|Place Order)$/}).last(); if(await c.count()){ await c.click(); await page.waitForTimeout(4000); log('ORDER CONFIRM',(await ov()).slice(0,400)); }
 await page.reload(); await page.waitForTimeout(7000); let t=await body(); log('AFTER ORDER',t.slice(t.indexOf('Parts add'),t.indexOf('Parts add')+500)); await dump('hc-wo-ordered');
 log('BTNS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.offsetParent).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(x=>/^(Order|Receive|Return|Put Back|Received|Awaiting)/.test(x)))));
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
