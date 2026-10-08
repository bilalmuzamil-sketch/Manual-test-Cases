import {start,mk,L,menu,inputs,btns,notes,st,B,OUT} from './h.mjs';
const log=L('l1'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body,tip}=mk(page); page.setDefaultTimeout(15000);
const heads=()=>page.evaluate(()=>[...document.querySelectorAll('thead th')].map(e=>e.innerText.replace(/arrow_drop_\w+/g,'').trim()).filter(Boolean));
const rows=()=>page.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim().slice(0,90)));
const searchBox=async(v)=>{ await page.locator('button[aria-label="Search"]').last().click().catch(()=>{}); await page.waitForTimeout(600); const i=page.locator('input[type=search], input[placeholder*="earch"]').last(); await i.fill(v); await page.waitForTimeout(3500); };
const C='ZZAUTOTEST Regression Walk';
try{ await page.setViewportSize({width:1600,height:1000}); await page.waitForTimeout(1500);
 await page.getByRole('button',{name:'List'}).click(); await page.waitForTimeout(3000);
 await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000);
 log('IN0',await inputs(page)); await searchBox(C); log('ROWS all+search',(await rows()).length,(await rows()).slice(0,3)); log('URL',page.url());
 // 368193
 await page.getByText('Estimates',{exact:true}).first().click(); await page.waitForTimeout(4000); log('AFTER Estimates IN',await inputs(page)); log('URL',page.url()); log('rows',(await rows()).length,(await rows()).slice(0,3)); await dump('L1-tab-change-search');
 // 368196 sort
 await page.getByText('All',{exact:true}).first().click(); await page.waitForTimeout(3000); await searchBox(C);
 const hs=await heads(); log('HEADS',hs);
 const sortable=await page.evaluate(()=>[...document.querySelectorAll('thead th')].filter(th=>/arrow_drop/.test(th.innerText)).map(th=>th.innerText.replace(/arrow_drop_\w+/g,'').trim()));
 log('SORTABLE',sortable);
 for(const h of sortable){ const th=page.locator('thead th').filter({hasText:h}).first(); await th.click(); await page.waitForTimeout(2500); const ci=hs.indexOf(h); const v1=await page.evaluate((ci)=>[...document.querySelectorAll('tbody tr')].map(r=>r.children[ci]?.innerText.trim().slice(0,25)),ci+1); await th.click(); await page.waitForTimeout(2500); const v2=await page.evaluate((ci)=>[...document.querySelectorAll('tbody tr')].map(r=>r.children[ci]?.innerText.trim().slice(0,25)),ci+1); log('SORT',h,'|',v1.join(','),'||',v2.join(',')); }
 log('URL after sorts',page.url());
 // rows per page control
 const t=await body(); const k=t.search(/Rows per page|Records per page|per page/i); log('PAGER',k>=0?t.slice(k-100,k+150):t.slice(-300));
 await page.screenshot({path:OUT+'L1-list-bottom.png',fullPage:true});
}catch(e){log('ERR',e.message.slice(0,300)); await dump('L1-err');}
await b.browser.close();
