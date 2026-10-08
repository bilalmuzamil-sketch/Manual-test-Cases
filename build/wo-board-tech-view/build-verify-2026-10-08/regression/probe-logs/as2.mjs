import {start,mk,L,menu,inputs,btns,notes,st,save,B,OUT} from './h.mjs';
const log=L('as2'); const S=st(); const b=await start('/customers/vehicle/ab4a56d0-dc99-438e-9b5b-b3157eee2cc9/work-orders?companyId=e96eba51-d939-483a-881f-a4837380b998','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(15000);
const col=(i)=>page.evaluate((i)=>[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent).map(r=>r.children[i]?.innerText.replace(/\s+/g,' ').trim().slice(0,16)),i);
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(3000);
 await page.screenshot({path:OUT+'AS2-asset-page-full.png',fullPage:true}); const t=await body(); log('TAIL',t.slice(-300)); log('COUNT-like',t.match(/\d+\s*-\s*\d+ of \d+|\(\d+\)|\d+ (work orders|records|results)/g));
 const ths=await page.evaluate(()=>[...document.querySelectorAll('thead th')].filter(e=>e.offsetParent).map((th,i)=>i+':'+th.innerText.replace(/arrow_drop_\w+/g,'').trim())); log('THS',ths);
 const ni=ths.findIndex(x=>x.endsWith(':Number')); const th=page.locator('thead th:visible').nth(ni); await th.click(); await page.waitForTimeout(2500); log('ASC',(await col(ni)).join(',')); await th.click(); await page.waitForTimeout(2500); log('DESC',(await col(ni)).join(','));
 // asset on site toggle in asset tab
 const W=S.woA.num; const row=page.locator('tbody tr').filter({hasText:W}).first(); const ic=row.locator('button,i').filter({hasText:'location_on'}).first(); const c0=await ic.evaluate(e=>getComputedStyle(e).color); await ic.click(); await page.waitForTimeout(2500); log('AOS',c0,'->',await ic.evaluate(e=>getComputedStyle(e).color),'url',page.url(),'notes',await notes(page));
 await page.reload(); await page.waitForTimeout(6000); const ic2=page.locator('tbody tr').filter({hasText:W}).first().locator('button,i').filter({hasText:'location_on'}).first(); log('AOS reload',await ic2.evaluate(e=>getComputedStyle(e).color));
 // progress compare with list for woB (2%)
 log('PROGRESS row woB',(await page.evaluate((n)=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ')).find(t=>t.includes(n)),S.woB.num)));
}catch(e){log('ERR',e.message.slice(0,300)); await dump('AS2-err');}
await b.browser.close();
