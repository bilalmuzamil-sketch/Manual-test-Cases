import {start,mk} from './woblib.mjs'; import fs from 'fs';
const L='/tmp/cln/hc27.log'; fs.writeFileSync(L,''); const log=(...a)=>fs.appendFileSync(L,a.join(' ')+'\n');
const b=await start('/workorders','admin'); const {page}=b; const {dump,ov,go,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{
 await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S10043-17594',{delay:30}); await page.waitForTimeout(4500); await page.locator('tbody tr').filter({hasText:'S10043-17594'}).first().locator('td').nth(3).click(); await page.waitForTimeout(6000);
 const menus=page.locator('button[aria-label="Part context menu"]'); await menus.last().click(); await page.waitForTimeout(1500);
 await page.locator('.q-menu .q-item').filter({hasText:/^\s*Return\s*$/}).first().click(); await page.waitForTimeout(3000); log('RETURN DLG',(await ov()).slice(0,800)); await dump('hc-wo-return-dlg');
 await page.getByLabel('Return reason').fill('ZZAUTOTEST wrong part'); await page.locator('.q-dialog button:has-text("Save & Close")').click(); await page.waitForTimeout(4000); log('AFTER RETURN',(await ov()).slice(0,300));
 await page.reload(); await page.waitForTimeout(7000); let t=await body(); log('PART ROWS',t.slice(t.indexOf('Parts add'),t.indexOf('Parts add')+600)); await dump('hc-wo-after-return');
 await go('/workorders',7000); await page.locator('button[aria-label="Search"]').last().click(); await page.waitForTimeout(800); await page.keyboard.type('S10043-17594',{delay:30}); await page.waitForTimeout(4500);
 await page.locator('button:has-text("Column Selection"), button[aria-label="Column Selection"]').first().click(); await page.waitForTimeout(1500);
 const st=async()=>JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-menu [role=switch],.q-menu .q-toggle,.q-menu [role=checkbox]')].map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim()+':'+e.getAttribute('aria-checked'))));
 const before=await st(); log('COLS BEFORE',before);
 for(const c of ['Parts','Returns']){ const it=page.locator('.q-menu').last().getByText(c,{exact:true}).first(); await it.click(); await page.waitForTimeout(1500);} 
 await page.keyboard.press('Escape'); await page.waitForTimeout(2500); t=await body(); log('ROW',t.slice(t.indexOf('Created On'),t.indexOf('Created On')+400)); await dump('hc-list-parts-returns');
 await page.locator('button:has-text("Column Selection"), button[aria-label="Column Selection"]').first().click(); await page.waitForTimeout(1500);
 for(const c of ['Parts','Returns']){ const it=page.locator('.q-menu').last().getByText(c,{exact:true}).first(); await it.click(); await page.waitForTimeout(1500);} 
 log('COLS RESTORED',await st()); await page.keyboard.press('Escape');
 log('INPUTS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog input,.q-dialog textarea')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('aria-label')||e.placeholder||e.type)+'='+e.value))));
 log('BTNS',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].filter(e=>e.offsetParent).map(e=>(e.innerText||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim()))));
}catch(e){log('ERR',e.message.slice(0,200));}
await b.browser.close();
