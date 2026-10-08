import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('st1'); const b=await start('/administration/staff','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1100}); await page.waitForTimeout(2000);
 await page.locator('main').getByText('Search',{exact:true}).first().click(); await page.waitForTimeout(800); await page.keyboard.type('ZZAUTOTEST Ana',{delay:50}); await page.waitForTimeout(3500);
 const row=page.locator('tbody tr').filter({hasText:'Ana'}).first(); await row.locator('button').last().click(); await page.waitForTimeout(3000);
 log('IN',await inputs(page,'.q-dialog')); await dump('ST1-edit-ana');
 log('BTNS',await btns(page,'.q-dialog')); log('TOG',await page.evaluate(()=>[...document.querySelectorAll('.q-dialog [role=switch],.q-dialog [role=checkbox],.q-dialog .q-toggle')].map(e=>(e.getAttribute('aria-label')||e.innerText)+':'+e.getAttribute('aria-checked'))));
 const th=page.locator('.q-dialog').getByText('TECHNICIAN HOURS'); log('th',await th.count()); if(await th.count()){ await th.click(); await page.waitForTimeout(2000); log('TH',await menu(page)); await dump('ST1-tech-hours'); }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('ST1-err');}
await b.browser.close();
