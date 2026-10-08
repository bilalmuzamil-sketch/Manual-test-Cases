import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc17.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S10043-17594',{delay:30}); await page.waitForTimeout(4500);
 await page.locator('tbody tr').filter({hasText:'S10043-17594'}).first().locator('td').nth(3).click(); await page.waitForTimeout(6000);
 const icons=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.offsetParent).map((e,i)=>({i,t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,30),a:e.getAttribute('aria-label')||'',x:Math.round(e.getBoundingClientRect().x),y:Math.round(e.getBoundingClientRect().y)})).filter(o=>/edit|swap|more/.test(o.t+o.a)));
 log('ICONS',JSON.stringify(icons));
 for(const lab of ['Change Customer','Change Asset']){ const bt=page.locator(`button[aria-label="${lab}"]`).first(); await bt.scrollIntoViewIfNeeded().catch(()=>{}); await bt.click({force:true}); await page.waitForTimeout(2500); log(lab,(await ov()).slice(0,700)); await dump('hc-'+lab.replace(' ','-').toLowerCase()); await esc(); await page.waitForTimeout(1000);} 
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
