import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc26.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S10043-17594',{delay:30}); await page.waitForTimeout(4500); await page.locator('tbody tr').filter({hasText:'S10043-17594'}).first().locator('td').nth(3).click(); await page.waitForTimeout(6000);
 const menus=page.locator('button[aria-label="Part context menu"]'); await menus.last().click(); await page.waitForTimeout(1500);
 await page.locator('.q-menu .q-item').filter({hasText:/^\s*Return\s*$/}).first().click(); await page.waitForTimeout(3000); log('RETURN DLG',(await ov()).slice(0,800)); await dump('hc-wo-return-dlg');
 log('INPUTS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog input,.q-dialog textarea')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||e.placeholder||e.type)+'='+e.value))));
 log('BTNS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim()))));
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
