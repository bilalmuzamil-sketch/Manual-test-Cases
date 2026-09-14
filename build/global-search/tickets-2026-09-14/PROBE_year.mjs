// Is a vehicle findable by its YEAR, and is the problem the year or the two-word query?
//
// "2019 Freightliner" returns no vehicles at all, while the same vehicle IS returned by its model --
// which proves the index is current. Both the old product and the new specification say the year is
// searchable, so a miss is a build defect rather than a decision for the Product Owner. But "year
// plus make as one phrase" and "year on its own" are different questions, and engineering needs to
// know which one is broken. Try the parts separately.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const { browser, page, APP } = await boot('sv9160','/','admin');
const openModal=async()=>{ await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(700);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000}); };
const read=async()=>page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
  const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
    const t=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=t?+t[1]:null;});
  return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
    type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
    text:(e.innerText||'').replace(/\s+/g,' ').trim()}))};});
const settle=async()=>{ let last=null,st=0;
  for(let i=0;i<25;i++){ await page.waitForTimeout(1000); const m=await read(); if(!m){st=0;continue;}
    const sig=JSON.stringify(m);
    if(sig===last && Object.values(m.tabs).some(v=>v!==null)){ if(++st>=3) return m; } else st=0; last=sig; }
  return await read(); };
const go=async(q)=>{ await openModal();
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:35});
  const m=await settle();
  await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    const t=d&&d.querySelector('[data-test-id="search_modal_tab_all"]'); t&&t.click();});
  await page.waitForTimeout(2000);
  const v=await settle();
  const rows=(v?v.rows:[]);
  return {query:q, assets:(v&&v.tabs.assets)||0,
    seededVehicleReturned: rows.some(r=>r.type==='assets'&&/ZZT-4471/.test(r.text)),
    assetRows: rows.filter(r=>r.type==='assets').slice(0,3).map(r=>r.text.slice(0,70))}; };
const out={at:new Date().toISOString(), tests:[]};
for(const q of ['2019 Freightliner','2019','Freightliner','Freightliner Cascadia','Cascadia 2019','2019 Cascadia']){
  out.tests.push(await go(q));
}
fs.writeFileSync(`${DIR}/PROBE-YEAR.json`, JSON.stringify(out,null,1));
out.tests.forEach(t=>console.log(`${String(t.assets).padStart(3)} vehicles  seeded=${t.seededVehicleReturned?'YES':'no '}  "${t.query}"`));
await browser.close();
