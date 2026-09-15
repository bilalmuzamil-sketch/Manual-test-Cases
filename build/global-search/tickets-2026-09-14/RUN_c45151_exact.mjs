// C45151 -- jobs and part sales are limited to the current location; customers, vehicles,
// suppliers and parts are not. Earlier evidence assembled the two halves from two different
// search words. Now that a part sale exists for the seeded customer, the whole case can be run
// the way it is WRITTEN: one word, both locations, every type read.
// Three words are tried so that suppliers and parts get a chance to appear too.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const WORDS=['Bridgeport','ZZAUTOTEST','ZZT'];
const { browser, page, APIH } = await boot('sv9160','/','admin');
const out={at:new Date().toISOString(), words:WORDS, byLocation:{}};

const openModal=async()=>{ await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(600);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000}); };
const read=async()=>page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
  const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
    const t=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=t?+t[1]:null;});
  return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
    type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
    text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,80)}))};});
const type=async q=>{ await page.click('[data-test-id="search_modal_input"]');
  await page.fill('[data-test-id="search_modal_input"]',''); await page.waitForTimeout(400);
  await page.type('[data-test-id="search_modal_input"]',q,{delay:25}); };
const allTab=async()=>{ await page.evaluate(()=>{const t=document.querySelector('[data-test-id="search_modal_tab_all"]'); t&&t.click();}); await page.waitForTimeout(600); };
const settle=async()=>{ let last=null,st=0;
  for(let i=0;i<40;i++){ await page.waitForTimeout(800); const m=await read(); if(!m) continue;
    const sig=JSON.stringify(m);
    const tc=Object.entries(m.tabs).filter(([k])=>!['strip','all'].includes(k)).map(([,v])=>v);
    if(sig===last && tc.some(v=>v!==null)){ if(++st>=3) return m; } else st=0; last=sig; }
  return await read(); };

// the location shown at the top of the page -- the app's own words, not a stored value
const appLocation=async()=>page.evaluate(()=>{
  const b=document.querySelector('[data-test-id="profile_menu_button"]');
  return b?(b.innerText||'').replace(/\s+/g,' ').trim():null; });
// switch through the SCREEN, which is the only route that actually moves the app
const switchInUI=async wanted=>{
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(600);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="profile_menu_button"]'); b&&b.click();});
  await page.waitForTimeout(1500);
  const opened=await page.evaluate(()=>{
    const sel=[...document.querySelectorAll('.q-select,[role=combobox]')].filter(e=>{
      const r=e.getBoundingClientRect(); return r.width>2&&r.height>2;});
    if(!sel.length) return false; sel[0].click(); return true;});
  await page.waitForTimeout(1500);
  const picked=await page.evaluate(w=>{
    const opts=[...document.querySelectorAll('.q-menu [role=option], .q-menu .q-item')].filter(e=>{
      const r=e.getBoundingClientRect(); return r.width>2&&r.height>2;});
    const hit=opts.find(e=>(e.innerText||'').includes(w));
    if(hit){ hit.click(); return (hit.innerText||'').trim(); } return null; }, wanted);
  await page.waitForTimeout(6000);
  await page.keyboard.press('Escape').catch(()=>{});
  return {opened,picked};
};

await page.goto('https://sv9160.qa.shopview.com/workorders',{waitUntil:'domcontentloaded'}).catch(()=>{});
await page.waitForTimeout(4000);

const sweep=async label=>{
  const shown=await appLocation();
  const res={appShows:shown, words:{}};
  for(const w of WORDS){
    await openModal(); await type(w); await allTab();
    const m=await settle();
    res.words[w]={tabs:m&&m.tabs, rows:(m?m.rows:[]).slice(0,14)};
  }
  out.byLocation[label]=res;
  await page.keyboard.press('Escape').catch(()=>{});
  return res;
};

const L1=await sweep('location1');
const sw=await switchInUI('Lethbridge');
out.switch=sw;
const L2=await sweep('location2');
out.locationReallyChanged = !!(L1.appShows && L2.appShows && L1.appShows!==L2.appShows);

// put it back where it was, so the branch is left as found
await switchInUI('Heavy Duty');
out.restoredTo=await appLocation();

fs.writeFileSync(`${DIR}/C45151-EXACT.json`,JSON.stringify(out,null,2));
const brief={locationReallyChanged:out.locationReallyChanged, restoredTo:out.restoredTo,
  l1:L1.appShows, l2:L2.appShows,
  counts:Object.fromEntries(WORDS.map(w=>[w,{loc1:L1.words[w].tabs,loc2:L2.words[w].tabs}]))};
console.log(JSON.stringify(brief,null,2));
await browser.close();
