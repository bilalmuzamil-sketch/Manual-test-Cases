// Two reports rest on values I have still not been able to SEE:
//   SV-10004 - a contact whose job title is "Dispatch Supervisor"
//   SV-10001 - a catalogue part numbered ZZT-77-3300
// One report has already turned out to rest on data this branch has never held (SV-10015, whose
// email is @staging.shopview.local and not @gmail.com), so neither of these gets written down until
// the record is on the screen. If the record is not there, the report is void, not a defect.
//
// Previous attempts failed on the DOM shape, so this one ENUMERATES instead of guessing: it prints
// what is clickable, and what the page holds, before deciding anything.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/field-check-5`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/FIELD-CHECK-5.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p)=>page.evaluate(async(u)=>{ try{
    const r=await fetch(u,{headers:{Accept:'application/json'},credentials:'include'});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j,head:t.slice(0,300)};}catch(e){return {error:String(e).slice(0,120)};}},`https://${APIH}${p}`);
const lines=()=>page.evaluate(()=>(document.body.innerText||'').split('\n').map(s=>s.trim()).filter(Boolean));

// --- the customer's contacts -------------------------------------------------
await page.goto(`${APP}/customers/b450f737-ead4-4ba6-a881-9085c5bf8c2f/work-orders`,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(9000);
R.customerTabs=await page.evaluate(()=>[...document.querySelectorAll('a[href*="/customers/"]')]
   .map(e=>({text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,30),href:e.getAttribute('href')}))
   .filter(x=>x.text).slice(0,25));
L('customer page links:', JSON.stringify(R.customerTabs).slice(0,400));
// walk to the contacts view by URL, the way the tabs above name it
for (const suffix of ['contacts','contact','info']) {
  await page.goto(`${APP}/customers/b450f737-ead4-4ba6-a881-9085c5bf8c2f/${suffix}`,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(8000);
  const txt=await lines();
  const hit=txt.some(s=>/Dispatch Supervisor/i.test(s));
  R['customer_'+suffix]={url:page.url(), jobTitleVisible:hit, shows:txt.slice(12,60)};
  L('customer /'+suffix, '->', page.url(), '| job title visible:', hit);
  if(hit){ await page.screenshot({path:`${EV}/customer-contacts.png`,fullPage:true}); break; }
}
save();

// --- does any contact anywhere hold that job title? --------------------------
for (const p of ['/api/customers/b450f737-ead4-4ba6-a881-9085c5bf8c2f/contacts',
                 '/api/customers/view/b450f737-ead4-4ba6-a881-9085c5bf8c2f']) {
  const r=await api(p); R['api_'+p.replace(/\W/g,'_')]={status:r.status, head:r.head};
  L('asked', p, '->', r.status, (r.head||'').slice(0,150));
  if(r.status===200 && /Dispatch Supervisor/i.test(JSON.stringify(r.json||{}))) {
    R.jobTitleOnRecord=true; L('the job title IS on the customer record'); }
}
if(R.jobTitleOnRecord===undefined) R.jobTitleOnRecord=false;
save();

// --- the catalogue part ------------------------------------------------------
await page.goto(`${APP}/parts/catalog`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
R.catalogScreen={url:page.url(), text:(await lines()).slice(10,45),
  inputs:await page.evaluate(()=>[...document.querySelectorAll('input,textarea,[contenteditable]')]
    .map(e=>({tag:e.tagName,ph:e.getAttribute('placeholder'),id:e.getAttribute('data-test-id')})).slice(0,12)),
  buttons:await page.evaluate(()=>[...document.querySelectorAll('button')]
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,20))};
await page.screenshot({path:`${EV}/parts-catalog.png`});
L('catalogue screen at', page.url());
L('  inputs :', JSON.stringify(R.catalogScreen.inputs).slice(0,300));
L('  buttons:', JSON.stringify(R.catalogScreen.buttons).slice(0,300));
// and ask the catalogue itself whether the part exists
for (const p of ['/api/parts-catalogue?pagination[page]=1&pagination[rowsPerPage]=5&search=ZZT-77-3300',
                 '/api/parts-catalogue/parts?pagination[page]=1&pagination[rowsPerPage]=5&search=ZZT-77-3300',
                 '/api/inventory/parts?pagination[page]=1&pagination[rowsPerPage]=5&search=ZZT-77-3300']) {
  const r=await api(p); R['cat_'+p.slice(0,40).replace(/\W/g,'_')]={status:r.status,head:r.head};
  L('asked', p.split('?')[0], '->', r.status, (r.head||'').slice(0,160)); }
save(); L('DONE'); await browser.close();
