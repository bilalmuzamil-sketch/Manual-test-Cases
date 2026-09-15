// Second pass of "can the tester actually READ the value the ticket asks them to type?"
// The first pass covered the postcode, website, phone, number plate and chassis number. Two are
// left, and both are on screens the first pass never opened:
//   - the contact's job title, on the customer's Contacts tab
//   - the catalogue part number, on the parts catalogue (a part the shop has never stocked, so it
//     is not on the inventory list a tester would reach first)
// A step that names a value the tester cannot see is not runnable, whatever else is right about it.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/field-check-2`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const save=()=>fs.writeFileSync(`${DIR}/FIELD-CHECK-2.json`,JSON.stringify(R,null,1));
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
const openFirst=async(match)=>{
  const ok=await page.evaluate((m)=>{const rows=[...document.querySelectorAll('[data-test-id^="search_result_row_"]')];
    const r=rows.find(e=>(e.innerText||'').includes(m))||rows[0]; if(!r) return false; r.click(); return true;},match);
  await page.waitForTimeout(7000); return ok;
};
const lines=()=>page.evaluate(()=>(document.body.innerText||'').split('\n').map(s=>s.trim()).filter(Boolean));

// 1 - the contact's job title on the customer record
await search('ZZAUTOTEST Bridgeport');
await openFirst('Bridgeport Hauling');
let url=page.url();
// the job title sits on the Contacts tab, which has to be opened
const tab=await page.evaluate(()=>{const t=[...document.querySelectorAll('a,button,[role=tab],.q-tab')]
    .find(e=>/^contacts$/i.test((e.innerText||'').trim())); if(!t) return null; t.click(); return (t.innerText||'').trim();});
await page.waitForTimeout(6000);
let txt=await lines();
R.contactJobTitle={route:'search the customer name, open the customer, open the Contacts tab',
  tabClicked:tab, url:page.url(), fromUrl:url,
  titleVisible:txt.some(s=>/Dispatch Supervisor/i.test(s)),
  shows:txt.slice(0,45)};
await page.screenshot({path:`${EV}/customer-contacts.png`});
save(); L('CONTACT job title visible:',R.contactJobTitle.titleVisible,'| tab:',tab,'|',page.url());

// 2 - the catalogue part number
const rows=await search('ZZAUTOTEST Airline Coupler');
R.catalogueSearch={query:'ZZAUTOTEST Airline Coupler', rows};
L('catalogue part by name ->', rows.length, 'rows');
if(rows.length){ await openFirst('Airline'); txt=await lines();
  R.cataloguePart={url:page.url(), numberVisible:txt.some(s=>/ZZT-77-3300/.test(s)), shows:txt.slice(0,45)};
  await page.screenshot({path:`${EV}/catalogue-part.png`});
  L('CATALOGUE part number visible:',R.cataloguePart.numberVisible,'|',page.url()); }
else { R.cataloguePart={note:'the part is not findable by name either - the tester needs a route that is not the search box'}; }
save();
L('DONE'); await browser.close();
