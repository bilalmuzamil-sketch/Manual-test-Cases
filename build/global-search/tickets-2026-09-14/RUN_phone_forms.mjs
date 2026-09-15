// Which FORM of a phone number finds the customer? The first run typed it with brackets and as bare
// digits and concluded the number does not work at all - which is what SV-10057 now says. Typed with
// digits and dashes it does work. So the ticket may be wrong about its own subject, and that has to
// be settled before it is rewritten for engineering.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/phone-evidence`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), forms:{}};
const L=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,m='GET',b=null)=>page.evaluate(async([u,mm,bb])=>{ try{
    const r=await fetch(u,{method:mm,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:bb?JSON.stringify(bb):undefined});
    const t=await r.text(); return {status:r.status,json:JSON.parse(t||'{}')};}catch(e){return {error:1};}},
  [`https://${APIH}${p}`,m,b]);
{ const wps=await api('/api/staff/my-workplaces');
  const d=(wps.json&&(wps.json.data!==undefined?wps.json.data:wps.json))||[];
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  const hd=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  if(hd) await api('/api/iam/change-location','POST',{workplace_id:hd.id,workplace_timezone:hd.timezone||'America/Edmonton'}); }
const ask=async(q,label)=>{
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(3200);
  await page.keyboard.press('Escape').catch(()=>{});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
  await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000});
  await page.fill('[data-test-id="search_modal_input"]','');
  await page.type('[data-test-id="search_modal_input"]',q,{delay:35});
  await page.waitForTimeout(11000);
  const m=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return null;
    const tabs={}; d.querySelectorAll('[data-test-id^="search_modal_tab_"]').forEach(e=>{
      const x=(e.innerText||'').match(/\((\d+)\)/); tabs[e.getAttribute('data-test-id').replace('search_modal_tab_','')]=x?+x[1]:null;});
    return {tabs, rows:[...d.querySelectorAll('[data-test-id^="search_result_row_customers"]')]
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60))};});
  await page.screenshot({path:`${EV}/form-${label}.png`});
  const found=(m&&m.rows||[]).some(t=>/Bridgeport/i.test(t));
  R.forms[q]={customers:m&&m.tabs&&m.tabs.customers, found, rows:(m&&m.rows||[]).slice(0,3)};
  L(`${JSON.stringify(q).padEnd(18)} -> customers ${String(m&&m.tabs&&m.tabs.customers).padStart(3)} | the customer is returned: ${found}`);
};
for (const [q,l] of [['(419) 555-0143','brackets'],['419-555-0143','dashes'],['4195550143','digits'],
                     ['419 555 0143','spaces'],['(419) 555-0177','contact-brackets'],
                     ['4195550177','contact-digits']]) await ask(q,l);
fs.writeFileSync(`${DIR}/PHONE-FORMS.json`,JSON.stringify(R,null,1));
await browser.close();
