import * as H from './h.mjs';
import fs from 'fs';
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-pr.json',JSON.stringify(R,null,1));console.log('..'+n);};
const T=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERROR:e.message.slice(0,250)};}S(k);};
const A=await H.open(); const {page,netlog}=A;
const scan=()=>page.evaluate(()=>({
  url:location.href,
  chips:[...document.querySelectorAll('[data-test-id^="filter_chip"],button.filter-chip')].map(b=>({t:b.innerText.trim().replace(/\n/g,'|'),testid:b.getAttribute('data-test-id')})),
  toggle:!!document.querySelector('[data-test-id="toggle_filter_bar"]'),
  searchToggle:(()=>{const b=document.querySelector('[data-test-id="page_search_toggle"]');return b?b.innerText.trim().replace(/\n/g,'|'):null;})(),
  clearFilters:!!document.querySelector('[data-test-id="clear_filters"]'),
  tabs:[...document.querySelectorAll('.q-tab')].map(e=>e.innerText.trim()),
  headers:[...document.querySelectorAll('thead th')].map(e=>e.innerText.trim().replace(/arrow_drop_(up|down)/,'')),
  rows:document.querySelectorAll('tbody tr').length,
  allTestIds:[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/filter|search/.test(t)).slice(0,30),
  bodyTop:document.body.innerText.slice(0,300)}));
for(const [name,path] of [['parts_inventory','/parts/inventory'],['parts_partsales','/parts/part-sales'],['parts_catalog','/parts/catalog'],
    ['parts_returns','/parts/returns'],['parts_credits','/parts/credits'],['parts_orders','/parts/orders'],
    ['parts_vendorinvoices','/parts/vendor-invoices'],['parts_vendors','/parts/vendors'],['reports','/reports']]){
  await T(name,async()=>{await page.goto(H.APP+path,{waitUntil:'domcontentloaded',timeout:70000});await page.waitForTimeout(9000);return scan();});
  await H.shot(page,'pr-'+name);
}
await A.browser.close(); console.log('DONE');
