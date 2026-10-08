import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('pt2'); const b=await start('/parts/inventory','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(2000);
 for(const p of ['part-sales','inventory','parts-catalogue','returns','orders','deliveries','vendors']){ await page.goto(B+'/parts/'+p); await page.waitForTimeout(6000);
  const bt=(await btns(page)).filter(x=>/keyboard_arrow_down|filter|Filter|tab|~[A-Z][a-z]+ \(\d+\)/.test(x)||/^~(Returns|Credits|Open|Closed|All)/.test(x)); const tabs=await page.evaluate(()=>[...document.querySelectorAll('.q-tab,[role=tab]')].filter(e=>e.offsetParent).map(e=>e.innerText.replace(/\s+/g,' ').trim()));
  log('PAGE',p,'| filters:',bt.join(' ; '),'| tabs:',tabs.join(','),'| rows',await page.locator('tbody tr:visible').count()); const t=await body(); const i=t.indexOf('arrow_drop_up'); log('HEAD',p,t.slice(Math.max(0,i-250),i+400).replace(/arrow_drop_up/g,'^')); }
}catch(e){log('ERR',e.message.slice(0,300)); await dump('PT2-err');}
await b.browser.close();
