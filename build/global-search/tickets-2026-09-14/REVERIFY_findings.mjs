// Step 1 of the ticket rework: does each raised finding still reproduce on the product TODAY?
//
// This is not optional tidiness. One of the fifteen was checked an hour ago and no longer describes
// what happens - the whole phone number works in every layout now - so rewriting all fifteen without
// re-checking would have handed engineering a report that is wrong on its face.
//
// Every query below is the one the failing test itself types, read out of the test, not remembered.
// A control runs alongside: the same records must be findable by name in the same sitting, or an
// empty result says nothing about the field being searched.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/reverify-2026-09-15`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), checks:{}};
const save=()=>fs.writeFileSync(`${DIR}/REVERIFY-2026-09-15.json`,JSON.stringify(R,null,1));
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
  R.location=hd&&hd.name; }

const ask=async(q,label,wantGroup)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3200);
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:30});
  await page.waitForTimeout(11000);
  const m=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
    const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
      const x=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=x?+x[1]:null;});
    return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
      type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
      text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)}))};});
  await page.screenshot({path:`${EV}/${label}.png`});
  const group=wantGroup?((m&&m.tabs)||{})[wantGroup]:null;
  const rows=((m&&m.rows)||[]).filter(r=>!wantGroup||r.type===wantGroup).map(r=>r.text);
  const out={query:q, tabs:m&&m.tabs, groupLookedAt:wantGroup, countInGroup:group, rows:rows.slice(0,5)};
  R.checks[label]=out; save();
  L(`${label.padEnd(26)} ${JSON.stringify(q).padEnd(26)} ${wantGroup||'(all)'} = ${group===null?'-':group}`);
  return out;
};

// controls first — if these do not come back, nothing below means anything
await ask('ZZAUTOTEST','control-everything',null);
await ask('Bridgeport','control-customer-by-name','customers');
await ask('ZZAUTOTEST Kestrel','control-vendor-by-name','vendors');
await ask('ZZT-4471','control-asset-by-unit','assets');

// the fifteen, each with the query its own test types
await ask('44872-9931','SV-10002-customer-postcode','customers');
await ask('bridgeporthauling-zzt.com','SV-10003-customer-website','customers');
await ask('Dispatch Supervisor','SV-10004-contact-job-title','customers');
await ask('43055-2210','SV-10005-vendor-postcode','vendors');
await ask('Ohio','SV-10006-vendor-state','vendors');
await ask('OHZZT471','SV-10007-licence-plate','assets');
await ask('Estimate','SV-10008-job-status','work_orders');
await ask('qualitycheck','SV-10008-job-status-twoword','work_orders');
await ask('Marlene','SV-10025-near-spellings','customers');
await ask('2019 Freightliner','SV-10055-year-and-make','assets');
await ask('555-0143','SV-10057-part-of-phone','customers');
await ask('ZZ4471','SV-10058-part-of-vin','assets');
await ask('1FUJGLDR9KLZZ4471','SV-10058-whole-vin','assets');
await ask('ernva','SV-10060-fragment-town','customers');
await ask('idgepor','SV-10060-fragment-name','customers');
await ask('estrelw','SV-10060-fragment-address','customers');
await ask('Vernway','SV-10001-catalogue-part-word','parts');
await ask('ZZT-77-3300','SV-10001-catalogue-part-number','parts');
await ask('ZZT-88-4412','control-stocked-part','parts');
save();
L('DONE');
await browser.close();
