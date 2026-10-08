import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('i1'); const b=await start('/administration/staff','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 log('IN0',await inputs(page)); log('B0',(await btns(page)).slice(10,30));
 await page.locator('main').getByText('Search',{exact:true}).first().click().catch(e=>log('sclick',e.message.slice(0,60))); await page.waitForTimeout(1000); log('IN1',await inputs(page));
 await page.keyboard.type('ZZAUTOTEST',{delay:50}); await page.waitForTimeout(3500);
 log('ROWS',await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ')).join(' // ')));
 const row=page.locator('tbody tr').filter({hasText:'Ana'}).first(); await row.hover(); log('ROW btns',await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(r=>r.innerText.includes('Ana')).map(r=>[...r.querySelectorAll('button,i,a')].map(e=>(e.getAttribute('aria-label')||e.getAttribute('title')||'')+'~'+e.innerText.trim()))));
 await row.click({button:'right'}).catch(()=>{}); await page.waitForTimeout(1000); log('RIGHT',await menu(page)); await esc();
 await row.locator('button').last().click(); await page.waitForTimeout(2500); log('EDIT DLG',await menu(page)); log('EDIT btns',await btns(page,'.q-dialog')); await dump('I1-staff-edit');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('I1-err');}
await b.browser.close();
