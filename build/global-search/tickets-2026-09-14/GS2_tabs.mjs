// CORRECTED INSTRUMENT -- GS1 read the scope-tab COUNT and treated a non-zero count as "the record is
// found". The QA lead showed that a count can read 1 while the tab's own view says "No results in
// <Type>". The count is not the result. This probe CLICKS each scope tab and records what the tab
// actually shows, which is what a user sees.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/evidence`;
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const STATE=`${DIR}/GS2.json`;
const R = fs.existsSync(STATE)?JSON.parse(fs.readFileSync(STATE,'utf8')):{at:new Date().toISOString(), q:{}};
const save=()=>fs.writeFileSync(STATE, JSON.stringify(R,null,1));
// tag, query, the scope tab the record SHOULD appear under
const PLAN=[
  ['D1-vin',        'BAHUTYV09T63EV7NS', 'Assets'],
  ['D2-vendoremail','jay.harrison@gmail.com','Vendors'],
  ['D3-partnumber', 'ZZT-88-4412',       'Parts'],
  ['D4-partialwo',  '17580',             'Work orders'],
  ['D5-unitnumber', 'ZZT-4471',          'Assets'],
  ['D6-midword',    'ridgeport',         'Customers'],
];
const { browser, page } = await boot('sv9160','/','admin');
const openAndType=async(q)=>{
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(600);
  const via=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]');
    if(b){b.click(); return 'trigger';} return null;});
  if(!via) await page.keyboard.press('Control+k');
  await page.waitForTimeout(1600);
  await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop()||document;
    const i=[...m.querySelectorAll('input')].filter(vis)[0]; if(!i) return;
    i.focus(); Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(i,'');
    i.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.keyboard.type(q,{delay:45});
  await page.waitForTimeout(4200);
  // READ THE INPUT BACK. The previous run typed into nothing and returned tabs with no counts,
  // which I could easily have mistaken for "no results". An empty box is an instrument failure.
  const got=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!m) return null;
    const i=[...m.querySelectorAll('input')].filter(vis)[0]; return i?i.value:null;});
  if(got!==q){
    // fall back to filling the field directly, then confirm again
    await page.evaluate((qq)=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
      const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!m) return;
      const i=[...m.querySelectorAll('input')].filter(vis)[0]; if(!i) return;
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(i,qq);
      i.dispatchEvent(new Event('input',{bubbles:true}));}, q);
    await page.waitForTimeout(4200);
  }
  const finalVal=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!m) return null;
    const i=[...m.querySelectorAll('input')].filter(vis)[0]; return i?i.value:null;});
  if(finalVal!==q) throw new Error(`INSTRUMENT FAILURE: search box holds ${JSON.stringify(finalVal)}, expected ${JSON.stringify(q)} -- not reporting a result from this`);
  return finalVal;
};
// The modal shows "Search unavailable / Retry" when the search service is erroring. Every tab then
// reads zero, which is indistinguishable from "nothing found" unless you look for this banner.
// Treat it as an INSTRUMENT FAILURE, never as a result. (QA lead caught me reading counts as results;
// this is the same class of mistake one level down.)
const searchBroken=async()=>page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
  const t=((m?m.innerText:document.body.innerText)||'').replace(/\s+/g,' ');
  return /search unavailable|an error occurred|Oooops/i.test(t);});
const retrySearch=async()=>{ await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!m) return;
  const b=[...m.querySelectorAll('button,a,span')].filter(vis).find(e=>/^retry$/i.test((e.innerText||'').trim()));
  if(b) b.click();}); await page.waitForTimeout(5000); };
const readPane=async()=>page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!m) return null;
  const t=(m.innerText||'').replace(/\s+/g,' ').trim();
  const tabs=[...m.querySelectorAll('[role=tab],.q-tab')].filter(vis).map(e=>({
    label:(e.innerText||'').replace(/\s+/g,' ').trim(),
    selected: e.getAttribute('aria-selected')==='true' || /active|selected/i.test(e.className||'')}));
  const rows=[...m.querySelectorAll('[class*=result],[role=option],li')].filter(vis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,8);
  return {tabs, rows, rowCount:rows.length,
    noResultsMsg:(t.match(/No results for [^]{0,70}/i)||[])[0]||null, text:t.slice(0,200)};
});
const clickTab=async(name)=>page.evaluate((n)=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const m=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!m) return false;
  const tab=[...m.querySelectorAll('[role=tab],.q-tab')].filter(vis)
    .find(e=>(e.innerText||'').replace(/\s+/g,' ').trim().toLowerCase().startsWith(n.toLowerCase()));
  if(!tab) return false; tab.click(); return true;}, name);
for(const [tag,q,scope] of PLAN){
  if(R.q[tag] && fs.existsSync(`${EV}/GS2-${tag}-scoped.png`)){ L('skip',tag); continue; }
  await openAndType(q);
  let broken=await searchBroken();
  for(let i=0;i<3 && broken;i++){ L('   search unavailable -- retrying (%d)', i+1); await retrySearch(); broken=await searchBroken(); }
  if(broken){ L(`${tag}: SEARCH SERVICE UNAVAILABLE -- recording nothing for this query`);
    R.q[tag]={query:q, scope, instrumentFailure:'search unavailable on the build'}; save(); continue; }
  const all=await readPane();
  await page.screenshot({path:`${EV}/GS2-${tag}-all.png`});
  const clicked=await clickTab(scope);
  await page.waitForTimeout(3500);
  const scoped=await readPane();
  await page.screenshot({path:`${EV}/GS2-${tag}-scoped.png`});
  const badge=(all&&all.tabs.find(t=>t.label.toLowerCase().startsWith(scope.toLowerCase()))||{}).label;
  R.q[tag]={query:q, scope, badgeOnAllTab:badge,
    allRowCount:all?all.rowCount:null, allRows:all?all.rows.slice(0,3):[],
    scopedClicked:clicked, scopedRowCount:scoped?scoped.rowCount:null,
    scopedNoResults:scoped?scoped.noResultsMsg:null, scopedRows:scoped?scoped.rows.slice(0,3):[]};
  const c=R.q[tag];
  L(`${tag.padEnd(16)} "${q}" | badge=${badge} | ALL rows=${c.allRowCount} | ${scope} tab rows=${c.scopedRowCount} | msg=${c.scopedNoResults||'-'}`);
  save();
}
await browser.close();
