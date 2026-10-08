import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('r4'); const b=await start('/administration/staff','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1100}); await page.waitForTimeout(2000); await page.getByText('Roles & Permissions').first().click(); await page.waitForTimeout(5000);
 await page.getByText('Create Custom Role').first().click(); await page.waitForTimeout(2500);
 await page.locator('.q-dialog').getByText('Service Advisor',{exact:true}).first().click(); await page.waitForTimeout(800); await page.locator('.q-dialog').getByRole('button',{name:'Apply'}).click(); await page.waitForTimeout(4000);
 log('URL',page.url()); log('IN',await inputs(page)); log('BTNS',(await btns(page)).slice(-12));
 log('TOGGLES',await page.evaluate(()=>{const out=[]; const els=[...document.querySelectorAll('[role=switch],[role=checkbox],[role=radio],.q-toggle,.q-checkbox')].filter(e=>e.offsetParent&&!e.parentElement.closest('.q-toggle,.q-checkbox')); els.forEach((e,i)=>{ const own=(e.innerText||'').trim(); let p=e.parentElement, ctx=''; for(let k=0;k<4&&p;k++){ const t=(p.innerText||'').replace(/\s+/g,' ').trim(); if(t.length>own.length+1){ctx=t.slice(0,70);break;} p=p.parentElement;} out.push(i+':'+own+':'+(e.getAttribute('aria-checked')||e.querySelector('[aria-checked]')?.getAttribute('aria-checked'))+':'+ctx); }); return out;}));
 await dump('R4-role-editor');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('R4-err');}
await b.browser.close();
