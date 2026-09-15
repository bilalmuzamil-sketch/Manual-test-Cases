// Follow a ticket's Steps of Reproduction literally, as a manual tester would, and report whether
// each one can actually be done. A ticket that cannot be followed is worse than no ticket: it comes
// back as "cannot reproduce" and the reporter carries the blame.
//
// The step most likely to fail is never the search itself - it is the one before it: "open the
// record and read the postcode". If that field is not on the screen, the tester cannot even start.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/step-check`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString(), steps:{}};
const save=()=>fs.writeFileSync(`${DIR}/STEP-CHECK.json`,JSON.stringify(R,null,1));
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APIH, APP } = await boot('sv9160','/','admin');
const api=async(p,m='GET',b=null)=>page.evaluate(async([u,mm,bb])=>{ try{
    const r=await fetch(u,{method:mm,headers:{Accept:'application/json','Content-Type':'application/json'},
      credentials:'include',body:bb?JSON.stringify(bb):undefined});
    const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){}
    return {status:r.status,json:j};}catch(e){return {error:1};}},[`https://${APIH}${p}`,m,b]);
{ const wps=await api('/api/staff/my-workplaces');
  const d=(wps.json&&(wps.json.data!==undefined?wps.json.data:wps.json))||[];
  const list=Array.isArray(d)?d:(d.workplaces||d.collection||[]);
  const hd=list.find(x=>/heavy duty/i.test(x.name||''))||list[0];
  if(hd) await api('/api/iam/change-location','POST',{workplace_id:hd.id,workplace_timezone:hd.timezone||'America/Edmonton'}); }

// STEP: open Customers from the top menu
await page.goto(`${APP}/customers`,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
R.steps.customersScreen = await page.evaluate(()=>({
  url:location.pathname,
  columns:[...document.querySelectorAll('th')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
  hasSearch:!!document.querySelector('input[type=text],input:not([type])')}));
L('Customers screen columns:', JSON.stringify(R.steps.customersScreen.columns));

// STEP: find the customer by name on that screen
R.steps.findByName = await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const el=[...document.querySelectorAll('input[type=text],input:not([type])')].filter(vis)[0];
  if(el){ el.focus(); el.value='ZZAUTOTEST Bridgeport'; el.dispatchEvent(new Event('input',{bubbles:true})); return true; }
  return false;});
await page.waitForTimeout(6000);
R.steps.rowFound = await page.evaluate(()=>{
  const rows=[...document.querySelectorAll('tr')].map(r=>(r.innerText||'').replace(/\s+/g,' ').trim());
  const hit=rows.find(t=>/ZZAUTOTEST Bridgeport/i.test(t));
  return hit?hit.slice(0,140):null;});
L('the customer row on the list:', JSON.stringify(R.steps.rowFound));
await page.screenshot({path:`${EV}/step-customers-list.png`});

// STEP: open the record and READ THE POSTCODE - the step that decides whether this ticket is runnable
const opened = await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const row=[...document.querySelectorAll('tbody tr')].filter(vis)
    .find(r=>/ZZAUTOTEST Bridgeport/i.test(r.innerText||''));
  if(!row) return false; row.click(); return true;});
R.steps.openedRecord=opened;
await page.waitForTimeout(8000);
R.steps.recordPage = await page.evaluate(()=>{
  const text=(document.body.innerText||'');
  return {url:location.pathname,
    postcodeVisible:/44872-9931/.test(text),
    lines:text.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,45)};});
L('customer record page:', R.steps.recordPage.url);
L('the postcode is visible on that page:', R.steps.recordPage.postcodeVisible);
L('what the page shows:', JSON.stringify(R.steps.recordPage.lines.slice(0,26)));
await page.screenshot({path:`${EV}/step-customer-record.png`});
save();

// STEP: the keyboard shortcut named in the steps
await page.keyboard.press('Control+k');
await page.waitForTimeout(3000);
R.steps.shortcutOpensSearch = await page.evaluate(()=>{
  const e=document.querySelector('[data-test-id="search_modal_input"]');
  return !!(e && e.getBoundingClientRect().width>2);});
L('Ctrl and K opens the search box:', R.steps.shortcutOpensSearch);
save();
await browser.close();
