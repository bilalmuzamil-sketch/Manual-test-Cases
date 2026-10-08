import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('pt1'); const b=await start('/parts/inventory','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 const nav=await page.evaluate(()=>[...document.querySelectorAll('a,[role=tab],.q-tab,.q-item')].filter(e=>e.offsetParent).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()+'>'+(e.getAttribute('href')||'')).filter(x=>x.length<60)); log('NAV',nav.slice(0,60));
 await dump('PT1-parts-landing');
}catch(e){log('ERR',e.message.slice(0,300)); await dump('PT1-err');}
await b.browser.close();
