// C45250 — "Add Part stays available on a Complete line; the system uncompletes it".
// The case's own note says the line will not go Complete while a part on it is unfulfilled, which is
// why it was parked. The recorded API recipes reach that state:
//   POST /api/work-orders/part/perform-request-status-action {part_request_id, action:'pick'}
//   POST /api/work-orders/lines/change-status {line_id, status:'complete', workOrderId}
// A SPARE work order is used, never the suite's own.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const SUITE_WO='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const api = (path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include',
      body:JSON.stringify(body)} : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,300)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{ const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; };
  return pick(j); };

// ---- pick a spare editable work order that has at least one line
const wos = await api('/api/work-orders?limit=100&page=1');
const cand = rowsOf(wos.json).filter(w=>w.id!==SUITE_WO &&
  ['estimate','approved','in_progress','ready_for_review'].includes(String(w.status||w.status_name||'').toLowerCase().replace(/\s+/g,'_')));
R.candidates = cand.slice(0,5).map(w=>({id:w.id, num:w.number||w.work_order_number, status:w.status||w.status_name}));
log('spare work orders:', JSON.stringify(R.candidates));
let WO=null, LINE=null;
for (const w of cand.slice(0,8)){
  const d = await api(`/api/work-orders/${w.id}`);
  const lines = rowsOf(d.json && (d.json.lines || (d.json.data && d.json.data.lines) || d.json));
  const ln = (Array.isArray(lines)?lines:[]).find(x=>x && x.id && String(x.status||'').toLowerCase()!=='complete');
  if (ln){ WO=w; LINE=ln; break; }
}
R.chosen = {wo: WO && {id:WO.id, num:WO.number||WO.work_order_number, status:WO.status||WO.status_name},
            line: LINE && {id:LINE.id, status:LINE.status, name:LINE.name||LINE.description}};
log('chosen:', JSON.stringify(R.chosen));
if (!WO || !LINE){ log('no spare work order with an editable line — stopping');
  fs.writeFileSync(`${DIR}/evidence/65-c45250.json`, JSON.stringify(R,null,1)); await s.browser.close(); process.exit(0); }

const openWO=async()=>{await page.goto(`${APP}/workorders/${WO.id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};

// ---- add an IN-STOCK inventory part through the inline row, so it can be picked
await openWO();
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
await page.waitForTimeout(4500);
await page.click('[data-test-id=select_inline_part_number]');
await page.keyboard.type('51372MP',{delay:110}); await page.waitForTimeout(7000);
R.picked = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return 'no menu';
  const it=[...m.querySelectorAll('.q-item')].filter(isVis)[0]; if(!it) return 'no item';
  const l=t(it).slice(0,60); it.click(); return l;}, VIS);
await page.waitForTimeout(5500);
await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1200);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(9000);
log('added an in-stock part:', R.picked);

// ---- find that part request and pick it
const reqs = await api('/api/work-orders/part/list-requests');
const mine = rowsOf(reqs.json).filter(x=>String(x.work_order_id||x.workOrderId||'')===WO.id);
R.requests = mine.slice(0,6).map(x=>({id:x.id, status:x.status, pn:x.part_number, desc:(x.description||'').slice(0,30)}));
log('part requests on this work order:', JSON.stringify(R.requests));
for (const rq of mine){
  const res = await api('/api/work-orders/part/perform-request-status-action', {part_request_id: rq.id, action:'pick'});
  R.pickResults = R.pickResults||[]; R.pickResults.push({id:rq.id, status:res.status, body:res.text.slice(0,120)});
}
log('pick results:', JSON.stringify(R.pickResults));

// ---- set the line to Complete
R.lineComplete = await api('/api/work-orders/lines/change-status', {line_id: LINE.id, status:'complete', workOrderId: WO.id});
log('line -> complete:', JSON.stringify(R.lineComplete).slice(0,250));

// ---- what the tester now sees
await openWO();
R.afterComplete = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
  return {addPart:add.length, addPartVisible:add.filter(isVis).length,
          statuses:[...document.querySelectorAll('.q-chip,.q-badge')].filter(isVis).map(t).filter(x=>/complete|approved|estimate|review|progress/i.test(x)).slice(0,6)};}, VIS);
log('C45250 clause 1 — after the line went Complete:', JSON.stringify(R.afterComplete));
await page.screenshot({path:`${DIR}/evidence/65-a-complete-line.png`, fullPage:true});

if (R.afterComplete.addPartVisible){
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
  await page.waitForTimeout(5000);
  R.rowOnComplete = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    return d? {open:true}:{open:false};});
  if (R.rowOnComplete.open){
    await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST uncomplete check');
    await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1200);
    await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
    await page.waitForTimeout(9000);
    R.afterAdd = { toast: await page.evaluate(vis=>{const isVis=eval(vis);
        return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS) };
    const d2 = await api(`/api/work-orders/${WO.id}`);
    const l2 = rowsOf(d2.json && (d2.json.lines || (d2.json.data && d2.json.data.lines) || d2.json)).find(x=>x && x.id===LINE.id);
    R.afterAdd.lineStatus = l2 && l2.status;
    log('C45250 clause 2 — after adding a part to the Complete line:', JSON.stringify(R.afterAdd));
    await page.screenshot({path:`${DIR}/evidence/65-b-uncompleted.png`, fullPage:true});
  }
}
// ---- put the line back
R.restore = await api('/api/work-orders/lines/change-status', {line_id: LINE.id, status: String(LINE.status||'authorized'), workOrderId: WO.id});
log('line restored:', JSON.stringify(R.restore).slice(0,200));
fs.writeFileSync(`${DIR}/evidence/65-c45250.json`, JSON.stringify(R,null,1));
await s.browser.close();
