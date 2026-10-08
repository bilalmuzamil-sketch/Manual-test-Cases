import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('r2'); const b=await start('/administration/roles-permissions','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1100}); await page.waitForTimeout(3000);
 const row=page.locator('tr').filter({hasText:'Full system access'}).first(); await row.getByRole('button').filter({hasText:'edit'}).first().click(); await page.waitForTimeout(5000); log('URL',page.url());
 const t=await body(); await dump('R2-admin-role'); log('LEN',t.length);
 log('TOGGLES',await page.evaluate(()=>[...document.querySelectorAll('[role=switch],[role=checkbox],.q-toggle,.q-checkbox')].filter(e=>e.offsetParent).map(e=>{const r=e.closest('tr,.row,div'); return ((e.getAttribute('aria-label')||e.innerText||'').trim()+'|'+(r?r.innerText.replace(/\s+/g,' ').slice(0,60):'')+'|'+e.getAttribute('aria-checked'));}).slice(0,120)));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('R2-err');}
await b.browser.close();
