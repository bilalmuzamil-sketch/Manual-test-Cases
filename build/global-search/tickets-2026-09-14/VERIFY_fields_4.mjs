// Third attempt at the same four questions, each blocked last time by my own instrument:
//  1 the contact's JOB TITLE - "Contacts" is a panel on the customer's own page, not a tab, so the
//    tab-shaped click found nothing
//  2 the CATALOGUE PART's number - it is not returned by the search box at all (which is the report),
//    so the tester needs a route through the Parts screens; find it by walking them
//  3 does job S9160-17580 exist - the jobs list has no input matching my guess at a filter box;
//    enumerate what IS on that screen first
//  4 the supplier's email is jay.harrison@STAGING.SHOPVIEW.LOCAL, not @gmail.com - the report was
//    written against an address this branch has never held, so retest with the real one
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/field-check-4`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/FIELD-CHECK-4.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APP } = await boot('sv9160','/','admin');
const lines=()=>page.evaluate(()=>(document.body.innerText||'').split('\n').map(s=>s.trim()).filter(Boolean));
const openSearch=async(q)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3000);
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:30});
  await page.waitForTimeout(9000);
  return page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')]
      .filter(e=>{const r=e.getBoundingClientRect();return r.width>2;}).pop();
    const tabs={}; d&&d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
      const x=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=x?+x[1]:null;});
    return {tabs, rows:[...document.querySelectorAll('[data-test-id^="search_result_row_"]')]
      .map(e=>({id:e.getAttribute('data-test-id'),text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,80)}))};});
};
const openType=async(t)=>{const ok=await page.evaluate((x)=>{const r=document.querySelector(`[data-test-id^="search_result_row_${x}"]`);
    if(!r) return false; r.click(); return true;},t); await page.waitForTimeout(7000); return ok;};

// 1 - the job title: open the customer, then open its Contacts panel
await openSearch('ZZAUTOTEST Bridgeport Hauling');
await openType('customers');
const clicked=await page.evaluate(()=>{
  const all=[...document.querySelectorAll('*')].filter(e=>e.children.length<4 &&
     /^contacts$/i.test((e.textContent||'').trim()));
  const e=all[all.length-1]; if(!e) return null;
  (e.closest('a,button,[role=button],.q-item,.cursor-pointer')||e).click(); return true;});
await page.waitForTimeout(6000);
let txt=await lines();
R.contactJobTitle={url:page.url(), clicked, titleVisible:txt.some(s=>/Dispatch Supervisor/i.test(s)),
  contactNameVisible:txt.some(s=>/Contacts/i.test(s)), shows:txt.slice(0,70)};
await page.screenshot({path:`${EV}/customer-contacts.png`,fullPage:true});
save(); L('1 job title on the customer page:',R.contactJobTitle.titleVisible,'|',page.url());

// 2 - the catalogue part, walked through the Parts screens
for (const route of ['/parts/catalog','/parts/inventory','/parts']) {
  await page.goto(`${APP}${route}`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000);
  const inputs=await page.evaluate(()=>[...document.querySelectorAll('input')]
     .map(e=>({ph:e.getAttribute('placeholder'),al:e.getAttribute('aria-label'),t:e.type})).slice(0,10));
  R['partsRoute'+route.replace(/\W/g,'_')]={url:page.url(), inputs,
    headings:await page.evaluate(()=>[...document.querySelectorAll('h1,h2,h3,.text-h6')].map(e=>(e.innerText||'').trim()).slice(0,8))};
  L('2 route',route,'->',page.url(),'inputs',JSON.stringify(inputs).slice(0,180));
}
save();

// 3 - what is actually on the jobs screen
await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
R.jobsScreen={inputs:await page.evaluate(()=>[...document.querySelectorAll('input')]
    .map(e=>({ph:e.getAttribute('placeholder'),al:e.getAttribute('aria-label'),t:e.type,id:e.getAttribute('data-test-id')})).slice(0,12))};
L('3 jobs screen inputs:',JSON.stringify(R.jobsScreen.inputs).slice(0,300));
save();

// 4 - the supplier's REAL email, and whether it is found, and whether the Vendors section shows it
await page.goto(`${APP}/parts/vendors`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
const car=await page.evaluate(()=>{const r=[...document.querySelectorAll('tbody tr')]
    .find(e=>/Carolina Truck/i.test(e.innerText||'')); return r?(r.innerText||'').replace(/\s+/g,' ').trim():null;});
R.carolinaRow=car; L('4 the supplier row reads:',car);
const email=(car||'').match(/[\w.+-]+@[\w.-]+/);
R.carolinaEmail=email?email[0]:null; L('4 its email is:',R.carolinaEmail);
if(R.carolinaEmail){
  const m=await openSearch(R.carolinaEmail);
  const before=m.tabs.vendors;
  await page.evaluate(()=>{const e=document.querySelector('[data-test-id="search_modal_tab_vendors"]'); e&&e.click();});
  await page.waitForTimeout(6000);
  const after=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^="search_result_row_vendors"]')]
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,80)));
  R.vendorByRealEmail={query:R.carolinaEmail, countOnAll:before, rowsAfterClickingVendors:after,
    stillReproduces: !!before && after.length===0};
  await page.screenshot({path:`${EV}/vendor-by-email.png`});
  L('4 supplier by its real email -> Vendors count',before,'rows after clicking',after.length,
    '=>', R.vendorByRealEmail.stillReproduces?'STILL A PROBLEM':'NOT A PROBLEM');
}
save(); L('DONE'); await browser.close();
