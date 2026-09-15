// Reading the ORIGINAL pictures changed the picture, so this re-runs the four properly.
//
//  * SV-10014's ticket names the chassis number BAHUTYV09T63EV7NS, but its own screenshot shows
//    0ED823VK8BWL1Y0MP typed into the box. I tested the one the ticket names. Test the one the
//    EVIDENCE shows - that is the query the fault was actually seen on.
//  * SV-10015's screenshot really does show jay.harrison@gmail.com with Vendors (1) and "No results
//    in Vendors", so that address WAS on this branch on 14 September. It is not now. My earlier note
//    said the branch had never held it, and that was wrong - the branch data has been rebuilt since.
//  * SV-10017's screenshot likewise shows 17580 with Work orders (1). That job is gone now.
//
// So the real question is not "does this one record still misbehave" but "does the fault happen to
// ANY record today". Each check types the query, reads the count, clicks the section, and reads what
// the section then says.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/scope-check-2`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), checks:{}};
const save=()=>fs.writeFileSync(`${DIR}/SCOPE-CHECK-2.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,m='GET',b=null)=>page.evaluate(async([u,mm,bb])=>{ try{
    const r=await fetch(u,{method:mm,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:bb?JSON.stringify(bb):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j};}catch(e){return {error:String(e).slice(0,110)};}},[`https://${APIH}${p}`,m,b]);
{ const wps=await api('/api/staff/my-workplaces');
  const d=(wps.json&&(wps.json.data!==undefined?wps.json.data:wps.json))||[];
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  const hd=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  if(hd) await api('/api/iam/change-location','POST',{workplace_id:hd.id,workplace_timezone:hd.timezone||'America/Edmonton'}); }

const read=()=>page.evaluate(()=>{
  const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(e=>e.getBoundingClientRect().width>2).pop();
  if(!d) return null;
  const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
    const x=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=x?+x[1]:null;});
  return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
      type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
      text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,80)})),
    words:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,300)};});

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
  await page.evaluate((t)=>{const e=document.querySelector(`[data-test-id="search_modal_tab_${t}"]`); e&&e.click();},tab);
  await page.waitForTimeout(6000);
  const after=await read();
  await page.screenshot({path:`${EV}/${label}-section.png`});
  const inSection=((after&&after.rows)||[]).filter(r=>r.type===tab);
  const count=((before&&before.tabs)||{})[tab];
  R.checks[label]={query:q, section:tab, countBeforeClicking:count,
    rowsAfterClicking:inSection.map(r=>r.text), panelAfter:(after&&after.words)||null,
    theFault: !!count && inSection.length===0,
    recordGone: count===0};
  save();
  L(`${label.padEnd(22)} ${JSON.stringify(q).padEnd(24)} ${tab.padEnd(11)} count=${count} rows=${inSection.length} => ${
     R.checks[label].theFault?'THE FAULT IS STILL THERE':(count===0?'the record is gone from this branch':'works correctly')}`);
};

// the query the SV-10014 evidence actually shows, not the one its text names
await check('SV-10014-evidence','0ED823VK8BWL1Y0MP','assets');
await check('SV-10014-text','BAHUTYV09T63EV7NS','assets');
await check('SV-10015-original','jay.harrison@gmail.com','vendors');
await check('SV-10015-real','jay.harrison@staging.shopview.local','vendors');
await check('SV-10016','ZZT-88-4412','parts');
await check('SV-10017-original','17580','work_orders');
// a job that does exist, searched the same way - part of its number
{ const seed=await (async()=>{ await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
    return page.evaluate(()=>{const m=(document.body.innerText||'').match(/S9160-(\d{4,6})/); return m?m[1]:null;});})();
  R.jobThatExists=seed; L('a job that does exist ends in', seed);
  if(seed) await check('SV-10017-equivalent',seed,'work_orders'); }
L('DONE'); await browser.close();
