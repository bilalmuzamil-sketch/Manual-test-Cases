import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('l5'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 log('TABS',await page.evaluate(()=>[...document.querySelectorAll('.q-tab')].map(e=>e.innerText.trim())));
 await page.locator('.q-tab').filter({hasText:/^Work Orders$/}).click(); await page.waitForTimeout(3000); log('BTNS WO tab',(await btns(page)).slice(8,30)); await dump('L5-wo-tab');
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
