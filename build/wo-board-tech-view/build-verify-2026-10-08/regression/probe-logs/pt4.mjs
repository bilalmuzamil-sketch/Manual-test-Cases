import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('pt4'); const b=await start('/parts/inventory','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 await page.locator('.q-btn,button').filter({hasText:/Category/}).first().click(); await page.waitForTimeout(1500);
 log('MENU HTML',await page.evaluate(()=>{const m=document.querySelector('.q-menu'); return m? m.outerHTML.replace(/\s+/g,' ').slice(0,1800):'none';}));
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
