// Do the four "the count says it is there, the section says it is not" reports still describe the
// product? They were written from the QA lead's screen recording because the branch was down that
// day, never from a live capture - so every one of them is unverified until this runs.
//
// The claim is only testable by CLICKING the section. Reading the rows while the panel is still on
// All proves nothing: the row is there on All, that was never in dispute. So each check types the
// query, reads the counts along the top, clicks the section, and reads what the panel says after.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/scope-check`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), checks:{}};
const save=()=>fs.writeFileSync(`${DIR}/SCOPE-CHECK.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));

const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,m='GET',b=null)=>page.evaluate(async([u,mm,bb])=>{ try{
    const r=await fetch(u,{method:mm,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:bb?JSON.stringify(bb):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j};}catch(e){return {error:String(e).slice(0,120)};}},
  [`https://${APIH}${p}`,m,b]);
{ const wps=await api('/api/staff/my-workplaces');
  const d=(wps.json&&(wps.json.data!==undefined?wps.json.data:wps.json))||[];
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  const hd=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  if(hd) await api('/api/iam/change-location','POST',{workplace_id:hd.id,workplace_timezone:hd.timezone||'America/Edmonton'});
  R.location=hd&&hd.name; L('workplace:',R.location); }

const read=()=>page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
  const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
    const x=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=x?+x[1]:null;});
  return {tabs,
    rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
      type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
      text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,80)})),
    words:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,320)};});

const check=async(label,q,tab)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3200);
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:30});
  await page.waitForTimeout(11000);
  const before=await read();
  await page.screenshot({path:`${EV}/${label}-all.png`});
  // now click the section itself - this is the whole point of the check
  const clicked=await page.evaluate((t)=>{const e=document.querySelector(`[data-test-id="search_modal_tab_${t}"]`);
    if(!e) return false; e.click(); return true;},tab);
  await page.waitForTimeout(6000);
  const after=await read();
  await page.screenshot({path:`${EV}/${label}-section.png`});
  const inSection=(after&&after.rows||[]).filter(r=>r.type===tab);
  const saysNone=/no results/i.test((after&&after.words)||'');
  R.checks[label]={query:q, section:tab, clicked,
    countOnAll:(before&&before.tabs||{})[tab], countAfter:(after&&after.tabs||{})[tab],
    rowsInSectionAfterClicking:inSection.map(r=>r.text),
    panelSaysNoResults:saysNone, wordsAfter:(after&&after.words)||null,
    stillReproduces: clicked && inSection.length===0 && !!((before&&before.tabs||{})[tab])};
  save();
  L(`${label.padEnd(9)} ${JSON.stringify(q).padEnd(22)} ${tab.padEnd(12)} count=${(before&&before.tabs||{})[tab]} rows-after-clicking=${inSection.length} => ${R.checks[label].stillReproduces?'STILL A PROBLEM':'DOES NOT REPRODUCE'}`);
};

// a control first: a record everyone agrees is findable, narrowed to its own section
await check('control','ZZT-4471','assets');
await check('SV-10014','BAHUTYV09T63EV7NS','assets');
await check('SV-10015','jay.harrison@gmail.com','vendors');
await check('SV-10016','ZZT-88-4412','parts');
await check('SV-10017','17580','work_orders');
L('DONE');
await browser.close();
