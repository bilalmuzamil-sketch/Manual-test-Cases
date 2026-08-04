import * as H from './h.mjs';
import fs from 'fs';
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-pr2.json',JSON.stringify(R,null,1));console.log('..'+n);};
const T=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERROR:e.message.slice(0,220)};}S(k);};
const A=await H.open({path:'/parts/inventory'}); const {page}=A;
const scan=()=>page.evaluate(()=>({url:location.href,
  chips:[...document.querySelectorAll('[data-test-id^="filter_chip"]')].map(b=>({t:b.innerText.trim().replace(/\n/g,'|'),testid:b.getAttribute('data-test-id')})),
  toggle:!!document.querySelector('[data-test-id="toggle_filter_bar"]'),
  search:(()=>{const b=document.querySelector('[data-test-id="page_search_toggle"]');return b?b.innerText.trim().replace(/\n/g,'|'):null;})(),
  rows:document.querySelectorAll('tbody tr').length,
  headers:[...document.querySelectorAll('thead th')].map(e=>e.innerText.trim().replace(/arrow_drop_(up|down)/,'')).slice(0,8)}));
for(const t of ['Catalog','Vendor Invoices','Purchase Orders','Vendors','Part Sales']){
  await T('tab_'+t.replace(/ /g,'_'),async()=>{
    await page.locator(`.q-tab:has-text("${t}")`).first().click({timeout:25000});await page.waitForTimeout(8000);return scan();});
  await H.shot(page,'pr2-'+t.replace(/ /g,'-'));
}
// Reports sub-tabs
await T('rpt_sales',async()=>{await page.goto(H.APP+'/reports',{waitUntil:'domcontentloaded',timeout:70000});await page.waitForTimeout(9000);
  await page.locator('.q-tab:has-text("Sales")').first().click({timeout:25000});await page.waitForTimeout(8000);return scan();});
await H.shot(page,'pr2-rpt-sales');
await T('rpt_techeff',async()=>{await page.locator('.q-tab:has-text("Technician Efficiency")').first().click({timeout:25000});await page.waitForTimeout(8000);return scan();});
await H.shot(page,'pr2-rpt-techeff');
await T('rpt_dateRangePanel',async()=>{
  const l=page.locator('[data-test-id="filter_chip_range"]');
  if(!await l.count()) return {absent:true};
  await l.first().click({timeout:20000});await page.waitForTimeout(2200);
  return H.panel(page);});
await H.shot(page,'pr2-rpt-daterange');
await A.browser.close(); console.log('DONE');
