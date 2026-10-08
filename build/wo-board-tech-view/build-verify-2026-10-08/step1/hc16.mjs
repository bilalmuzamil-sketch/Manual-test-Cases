import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc16.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S10043-17594',{delay:30}); await page.waitForTimeout(4500);
 await page.locator('tbody tr').filter({hasText:'S10043-17594'}).first().locator('td').nth(3).click(); await page.waitForTimeout(6000);
 const icons=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.offsetParent).map((e,i)=>({i,t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,30),a:e.getAttribute('aria-label')||'',x:Math.round(e.getBoundingClientRect().x),y:Math.round(e.getBoundingClientRect().y)})).filter(o=>/edit|swap|more/.test(o.t+o.a)));
 log('ICONS',JSON.stringify(icons));
 const en=page.locator('button:has-text("edit_note")'); log('edit_note count',await en.count());
 for(let i=0;i<await en.count();i++){ log('TIP',i,await tip(en.nth(i))); await en.nth(i).click(); await page.waitForTimeout(2500); log('CLICK',i,(await ov()).slice(0,700)); await dump('hc-editnote-'+i); await esc(); await page.waitForTimeout(800);} 
 const sw=page.locator('button:has-text("swap_horiz")'); for(let i=0;i<await sw.count();i++){ log('SWAP TIP',i,await tip(sw.nth(i))); }
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
