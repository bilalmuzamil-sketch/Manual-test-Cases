// Stage 1 of the old-version evidence: find a production customer, supplier and vehicle whose fields
// are actually filled in, and read those values off the screen.
//
// Why discovery first, and separately: production holds real records, not our seeded ones, so the
// values to type are not known in advance. Guessing a selector or a field name here would produce a
// screenshot that proves nothing. This stage changes nothing - it opens records and reads them.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/prod-evidence`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APP, version } = await bootProdLogin('/customers',{settle:14000});
R.appVersion=version;
L('production app version:', version);

// what does the customers list look like, and what does a customer record show?
R.customersList = await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return {url:location.pathname,
    rows:[...document.querySelectorAll('tr')].filter(vis)
      .map(r=>(r.innerText||'').replace(/\s+/g,' ').trim().slice(0,110)).slice(0,12),
    testIds:[...new Set([...document.querySelectorAll('[data-test-id]')]
      .map(e=>e.getAttribute('data-test-id')))].slice(0,40)};});
L('customers list rows:', JSON.stringify(R.customersList.rows.slice(0,4)));
await page.screenshot({path:`${EV}/prod-customers-list.png`});

// open the first customer row and read every label/value pair the page shows
const opened = await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const rows=[...document.querySelectorAll('tbody tr')].filter(vis);
  if(!rows.length) return null;
  rows[1]?.click?.() || rows[0].click();
  return (rows[1]||rows[0]).innerText.replace(/\s+/g,' ').trim().slice(0,80);});
R.openedRow=opened;
await page.waitForTimeout(9000);
R.customerRecord = await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const text=(document.body.innerText||'').replace(/\r/g,'');
  return {url:location.pathname,
    words:text.replace(/\s+/g,' ').trim().slice(0,900),
    lines:text.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,60)};});
L('customer page:', R.customerRecord.url);
L('first lines:', JSON.stringify(R.customerRecord.lines.slice(0,24)));
await page.screenshot({path:`${EV}/prod-customer-record.png`});

// and what the old search box itself looks like, so the later capture knows where to type
R.searchBox = await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const cands=[...document.querySelectorAll('input')].filter(vis).map(e=>({
    ph:e.getAttribute('placeholder'), aria:e.getAttribute('aria-label'),
    tid:e.getAttribute('data-test-id'), cls:(e.className||'').toString().slice(0,50)}));
  return {inputs:cands.slice(0,10),
    hasGlobalTrigger:!!document.querySelector('[data-test-id="global_search_trigger"]')};});
L('search inputs on the page:', JSON.stringify(R.searchBox).slice(0,400));
fs.writeFileSync(`${DIR}/PROD-DISCOVER.json`,JSON.stringify(R,null,1));
await browser.close();
