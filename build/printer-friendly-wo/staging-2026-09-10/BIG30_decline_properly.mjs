// The line refuses Declined because it holds staged parts, and it SAYS SO in a toast at the
// bottom right — a message the earlier probe missed by reading seven seconds after the click,
// once it had faded. This run:
//   A. POSITIVE CONTROL for the message reader — try Declined with the parts still there and
//      CATCH the toast by polling from the moment of the click.
//   B. cancel the line's part requests, the way the message tells you to.
//   C. set Declined again and confirm it sticks.
//   D. print, and read the declined line off the printed page  (C45104).
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG30.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
await page.setViewportSize({width:1600, height:1000});
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,220)};},{api:API_HOST,m,p,b:b||null});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);

// THE FIX: watch for a toast from the moment of the action, not once, long afterwards.
const armToastWatcher = ()=>page.evaluate(()=>{
  window.__toasts=[];
  const grab=()=>{ for (const n of document.querySelectorAll('.q-notification, .q-notifications__list *, [role=alert]')){
      const t=(n.innerText||'').replace(/\s+/g,' ').trim();
      if (t && t.length>8 && !window.__toasts.includes(t)) window.__toasts.push(t); } };
  window.__toastTimer = setInterval(grab, 250); grab();
});
const readToasts = ()=>page.evaluate(()=>{ const t=[...(window.__toasts||[])];
  clearInterval(window.__toastTimer); return t; });

const openEditLine = async (name)=>{
  await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
  return page.evaluate(({vis,name})=>{const isVis=eval(vis);
    const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
    const row=[...tbl.querySelectorAll('tr')].filter(isVis).find(r=>(r.innerText||'').includes(name));
    if(!row) return false;
    const cell=[...row.querySelectorAll('td')].find(c=>(c.innerText||'').includes(name))||row;
    cell.click(); return true;}, {vis:VIS, name});
};
const pickDeclinedAndSave = async ()=>{
  await page.waitForTimeout(4500);
  await page.locator('.q-dialog .q-field').filter({hasText:'Status'}).first().click({timeout:8000}).catch(()=>{});
  await page.waitForTimeout(2000);
  await page.locator('.q-menu .q-item').filter({hasText:'Declined'}).first().click({timeout:8000}).catch(()=>{});
  await page.waitForTimeout(1500);
  await armToastWatcher();
  await page.locator('[data-test-id=button_save_close]').first().click({timeout:8000}).catch(()=>{});
  await page.waitForTimeout(6000);
  const toasts = await readToasts();
  const open = await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-dialog')].filter(isVis).length>0;}, VIS);
  return {toasts, dialogStillOpen:open};
};

await settle(page,{label:'start'});
const before = await lines();
R.before = before.map(l=>({n:(l.line_name||'').trim().slice(0,28), s:l.status,
  parts:(l.parts||[]).length, requests:(l.part_requests||[]).length}));
log('lines before: %s', JSON.stringify(R.before));

// ---------- A. positive control for the MESSAGE READER
const target = before.find(l=>(l.part_requests||[]).length) || before[0];
R.target = {name:(target.line_name||'').trim(), requests:(target.part_requests||[]).length};
await openEditLine(R.target.name);
R.controlAttempt = await pickDeclinedAndSave();
log('CONTROL — Declined while parts are staged: window still open %s | messages seen: %s',
  R.controlAttempt.dialogStillOpen, JSON.stringify(R.controlAttempt.toasts));
await page.screenshot({path:`${DIR}/evidence/BIG30-1-refused.png`}).catch(()=>{});
await page.keyboard.press('Escape').catch(()=>{});
save();

// ---------- B. do what the message says: clear the staged parts off that line
R.cleared = {};
const t2 = (await lines()).find(l=>(l.line_name||'').trim()===R.target.name) || {};
for (const req of (t2.part_requests||[])){
  const id = req.id || req.part_request_id || req.request_id;
  const r = await call('POST',`/api/work-orders/part/remove-request/${id}`,{});
  R.cleared[String(id).slice(0,8)] = r.status;
}
const t3 = (await lines()).find(l=>(l.line_name||'').trim()===R.target.name) || {};
R.cleared.left = {parts:(t3.parts||[]).length, requests:(t3.part_requests||[]).length};
log('staged parts cleared off "%s": %s', R.target.name, JSON.stringify(R.cleared));
save();

// ---------- C. now set Declined
await openEditLine(R.target.name);
R.secondAttempt = await pickDeclinedAndSave();
R.statusNow = (await lines()).map(l=>({n:(l.line_name||'').trim().slice(0,28), s:l.status, d:l.status_display}));
log('SECOND attempt — window still open %s | messages: %s', R.secondAttempt.dialogStillOpen,
  JSON.stringify(R.secondAttempt.toasts));
log('line statuses now: %s', JSON.stringify(R.statusNow));
await page.screenshot({path:`${DIR}/evidence/BIG30-2-declined.png`}).catch(()=>{});
save();

// ---------- D. C45104 — print and read the declined line off the page
if (R.statusNow.some(l=>/declin/i.test(l.s||''))){
  await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'print'});
  R.onScreen = await page.evaluate(()=>({declinedVisible:/declined/i.test(document.body.innerText||'')}));
  await page.evaluate(()=>{window.__p=0; window.print=function(){window.__p++;};});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
  await page.waitForTimeout(2500);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=menu_item_print_work_order]'); if(b) b.click();});
  await page.waitForTimeout(7000);
  await page.emulateMedia({media:'print'}); await page.waitForTimeout(1600);
  R.print = await page.evaluate(()=>{const r=document.getElementById('wo-print-root'); if(!r) return {found:false};
    return {found:true, hasDeclined:/declined/i.test(r.innerText||''),
      lineRows:[...r.querySelectorAll('tr.wo-print__row--line')].map(x=>(x.innerText||'').replace(/\s+/g,' ').trim())};});
  await page.emulateMedia({media:'screen'});
  await page.screenshot({path:`${DIR}/evidence/BIG30-3-print.png`, fullPage:true}).catch(()=>{});
  log('C45104 — printed line rows: %s', JSON.stringify(R.print.lineRows));
  log('C45104 — the word Declined is on the printed page: %s', R.print.hasDeclined);
}
save();
log('done');
await s.browser.close();
process.exit(0);
