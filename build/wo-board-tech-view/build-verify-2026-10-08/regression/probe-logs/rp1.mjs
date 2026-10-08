import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('rp1'); const b=await start('/parts/part-sales','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 // restore part sales status: untick Completed
 const sb=page.locator('.q-btn,button').filter({hasText:/Status:/}).first(); log('PS status',(await sb.innerText()).replace(/\s+/g,' ')); await sb.click(); await page.waitForTimeout(1200); log('PS menu html',await page.evaluate(()=>[...document.querySelectorAll('.q-menu [role=checkbox], .q-menu .q-item')].map(e=>(e.getAttribute('aria-label')||e.innerText.trim())+':'+e.getAttribute('aria-checked')).join(' | ')));
 const c=page.locator('.q-menu [role=checkbox][aria-label="Completed"], .q-menu .q-item').filter({hasText:/Completed/}).first(); await c.click().catch(e=>log('c',e.message.slice(0,50))); await page.waitForTimeout(2000); await esc(); log('PS after',(await sb.innerText()).replace(/\s+/g,' '),page.url());
 await page.goto(B+'/reports'); await page.waitForTimeout(6000); const t=await body(); log('REPORTS',t.slice(t.indexOf('Reports',300),t.indexOf('Reports',300)+1500)); await dump('RP1-reports');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('RP1-err');}
await b.browser.close();
