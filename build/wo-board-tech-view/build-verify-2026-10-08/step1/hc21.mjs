import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc21.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S10043-17594',{delay:30}); await page.waitForTimeout(4500); await page.locator('tbody tr').filter({hasText:'S10043-17594'}).first().locator('td').nth(3).click(); await page.waitForTimeout(6000);
 for(const n of [1,2]){ await page.locator('button:has-text("Add Part")').first().click({force:true}); await page.waitForTimeout(2500);
   await page.getByLabel('Description *').last().fill('ZZAUTOTEST Brake Pads '+n); await page.getByLabel('Qty *').last().fill('1'); await page.getByLabel('Cost').last().fill('100'); await page.getByLabel('Sell price *').last().fill('150');
   await page.locator('button:has-text("Save")').filter({hasNotText:'&'}).last().click(); await page.waitForTimeout(4000); log('SAVED',n,(await ov()).slice(0,200)); }
 await page.reload(); await page.waitForTimeout(7000); const t=await body(); log('LINE PARTS',t.slice(t.indexOf('Story'),t.indexOf('Story')+1200)); await dump('hc-wo-two-parts');
 log('PART BTNS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.offsetParent).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()+'|'+(e.getAttribute('aria-label')||'')).filter(x=>/Order|Receive|Return|Request|part/i.test(x)))));
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
