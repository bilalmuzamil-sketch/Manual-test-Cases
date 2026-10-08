import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('ps4'); const S=st(); const b=await start(S.psUrl.replace(B,''),'admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 
 await page.getByRole('button',{name:'Authorize'}).click(); await page.waitForTimeout(3000); log('after Authorize',await notes(page),(await menu(page)).slice(0,300)); 
 await page.reload(); await page.waitForTimeout(6000); const t2=await body(); log('CARD',t2.slice(t2.indexOf('P10043'),t2.indexOf('P10043')+40)); log('BTNS',(await btns(page)).slice(14,45)); log('ROWS',await page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').slice(0,200)))); await dump('PS4-after-authorize');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('PS4-err');}
await b.browser.close();
