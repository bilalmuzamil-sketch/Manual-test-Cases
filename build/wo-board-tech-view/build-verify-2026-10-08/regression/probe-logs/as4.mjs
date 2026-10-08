import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('as4'); const S=st(); const b=await start(S.custUrl.replace(B,''),'admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const col=(i)=>page.evaluate((i)=>[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent).map(r=>r.children[i]?.innerText.replace(/\s+/g,' ').trim().slice(0,14)),i);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 const ths=await page.evaluate(()=>[...document.querySelectorAll('thead th')].filter(e=>e.offsetParent).map((th,i)=>i+':'+th.innerText.replace(/arrow_drop_\w+/g,'').trim())); log('THS',ths);
 const ni=ths.findIndex(x=>x.endsWith(':Number')); const th=page.locator('thead th:visible').nth(ni); await th.click(); await page.waitForTimeout(2500); log('ASC',(await col(ni)).join(',')); await th.click(); await page.waitForTimeout(2500); log('DESC',(await col(ni)).join(','));
 log('woB row',await page.evaluate((n)=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ')).find(t=>t.includes(n)),S.woB.num));
 await dump('AS4-customer-tab'); log('notes',await notes(page));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('AS4-err');}
await b.browser.close();
