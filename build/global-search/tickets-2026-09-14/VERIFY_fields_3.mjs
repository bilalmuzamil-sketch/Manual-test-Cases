// The previous pass failed on MY OWN selectors, not on the product: "open the first row that mentions
// the name" opened a JOB for that customer and a PURCHASE ORDER for that part, so of course the
// customer's contact tab and the part's number were not on the page. And the list endpoints I asked
// for do not exist under those names, which says nothing about the records.
//
// So: pick the row BY ITS TYPE, and reach the lists by walking the screens.
//   1 the contact's job title, on the customer's own Contacts tab
//   2 the catalogue part number, on the part's own page
//   3 does a job numbered S9160-17580 exist (control: one that does)
//   4 does a supplier hold jay.harrison@gmail.com
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/field-check-3`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/FIELD-CHECK-3.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APP } = await boot('sv9160','/','admin');

const search=async(q)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3000);
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:30});
  await page.waitForTimeout(9000);
  return page.evaluate(()=>[...document.querySelectorAll('[data-test-id^="search_result_row_"]')]
      .map(e=>({id:e.getAttribute('data-test-id'),text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,80)})));
};
const openType=async(type)=>page.evaluate((t)=>{const r=[...document.querySelectorAll(`[data-test-id^="search_result_row_${t}"]`)][0];
    if(!r) return false; r.click(); return true;},type).then(async ok=>{await page.waitForTimeout(7000); return ok;});
const lines=()=>page.evaluate(()=>(document.body.innerText||'').split('\n').map(s=>s.trim()).filter(Boolean));
const clickTab=(name)=>page.evaluate((n)=>{const t=[...document.querySelectorAll('a,button,[role=tab],.q-tab,.q-item')]
    .find(e=>new RegExp('^'+n+'$','i').test((e.innerText||'').trim())); if(!t) return null; t.click(); return (t.innerText||'').trim();},name);

// 1 - the contact's job title, on the CUSTOMER record
let rows=await search('ZZAUTOTEST Bridgeport Hauling');
const okc=await openType('customers');
let tab=await clickTab('Contacts'); await page.waitForTimeout(6000);
let txt=await lines();
R.contactJobTitle={openedCustomerRow:okc, url:page.url(), tabClicked:tab,
  titleVisible:txt.some(s=>/Dispatch Supervisor/i.test(s)), shows:txt.slice(0,50)};
await page.screenshot({path:`${EV}/customer-contacts.png`});
save(); L('1 contact job title visible:',R.contactJobTitle.titleVisible,'| tab:',tab,'|',page.url());

// 2 - the catalogue part, opened as a PART
rows=await search('ZZAUTOTEST Airline Coupler');
R.cataloguePartSearch=rows;
const okp=await openType('parts');
txt=await lines();
R.cataloguePart={openedPartRow:okp, url:page.url(),
  numberVisible:txt.some(s=>/ZZT-77-3300/.test(s)), shows:txt.slice(0,50)};
await page.screenshot({path:`${EV}/catalogue-part.png`});
save(); L('2 catalogue part number visible:',R.cataloguePart.numberVisible,'| opened part row:',okp,'|',page.url());

// 3 - does a job numbered S9160-17580 exist? walk the jobs list and use its own filter
const jobList=async(term)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000);
  const typed=await page.evaluate((t)=>{const i=[...document.querySelectorAll('input')]
      .find(e=>/search|filter/i.test((e.getAttribute('placeholder')||'')+(e.getAttribute('aria-label')||'')));
    if(!i) return null; i.focus(); i.value=''; return (i.getAttribute('placeholder')||'ok');},term);
  if(typed){ await page.keyboard.type(term,{delay:40}); await page.waitForTimeout(7000); }
  return {filterBox:typed, rows:await page.evaluate(()=>[...document.querySelectorAll('tbody tr')]
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)).slice(0,10))};
};
R.job17580=await jobList('17580');   L('3 jobs list filtered to 17580 ->', JSON.stringify(R.job17580).slice(0,260));
R.jobControl=await jobList('17610'); L('3 control, a job we know exists ->', JSON.stringify(R.jobControl).slice(0,260));
await page.screenshot({path:`${EV}/jobs-list.png`}); save();

// 4 - does a supplier hold that email? walk the suppliers list
await page.goto(`${APP}/parts/vendors`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
R.vendorsList={url:page.url(), rows:await page.evaluate(()=>[...document.querySelectorAll('tbody tr')]
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)).slice(0,12))};
L('4 suppliers list at', page.url(), '->', R.vendorsList.rows.length, 'rows');
{ const typed=await page.evaluate(()=>{const i=[...document.querySelectorAll('input')]
      .find(e=>/search|filter/i.test((e.getAttribute('placeholder')||'')+(e.getAttribute('aria-label')||'')));
    if(!i) return null; i.focus(); i.value=''; return true;});
  if(typed){ await page.keyboard.type('Carolina',{delay:40}); await page.waitForTimeout(7000); } }
R.vendorCarolina={rows:await page.evaluate(()=>[...document.querySelectorAll('tbody tr')]
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)).slice(0,8))};
await page.screenshot({path:`${EV}/vendors-carolina.png`});
L('4 suppliers named Carolina ->', JSON.stringify(R.vendorCarolina.rows).slice(0,260));
save(); L('DONE'); await browser.close();
