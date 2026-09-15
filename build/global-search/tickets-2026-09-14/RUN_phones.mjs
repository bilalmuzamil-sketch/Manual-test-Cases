// C55662 and C55670 grew steps after the old-search reconciliation — the company number now also
// gets typed in part, and the contact's own number was added along with part of it. Both were last
// run before those steps existed, so their results are about a smaller test than the one that now
// stands. Re-run both in full.
//
// Control: the customer must be findable by name in the same sitting, or "the number finds nothing"
// is indistinguishable from "the record is not there".
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/phone-evidence`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), queries:{}};
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
  if(hd) await api('/api/iam/change-location','POST',{workplace_id:hd.id,workplace_timezone:hd.timezone||'America/Edmonton'}); }
const READ=()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
  const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
    const m=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=m?+m[1]:null;});
  return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_"]')].map(e=>({
    type:e.getAttribute('data-test-id').replace('search_result_row_','').replace(/_\d+$/,''),
    text:(e.innerText||'').replace(/\s+/g,' ').trim()}))};};
const ask=async(q,label)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3500);
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:35});
  await page.waitForTimeout(11000);
  const m=await page.evaluate(READ);
  await page.screenshot({path:`${EV}/${label}.png`});
  const cust=((m&&m.rows)||[]).filter(r=>r.type==='customers').map(r=>r.text.slice(0,70));
  const out={query:q, tabs:m&&m.tabs, customerRows:cust,
    bridgeportReturned: cust.some(t=>/Bridgeport/i.test(t))};
  R.queries[label]=out;
  L(`"${q}" -> customers ${m&&m.tabs&&m.tabs.customers} | Bridgeport returned: ${out.bridgeportReturned}`);
  return out;
};
await ask('Bridgeport','control-by-name');                       // control
await ask('419-555-0143','C55662-company-number-full');
await ask('555-0143','C55662-company-number-part');
await ask('419-555-0177','C55670-contact-number-full');
await ask('555-0177','C55670-contact-number-part');
await ask('Marlene','C55670-contact-first-name');
await ask('Okonkwo','C55670-contact-last-name');
fs.writeFileSync(`${DIR}/PHONE-RESULTS.json`,JSON.stringify(R,null,1));
await browser.close();
