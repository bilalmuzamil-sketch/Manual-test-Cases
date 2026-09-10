// SEED: a work order whose ONE line carries ONE in-stock part, picked — the state C45250 needs
// (Add Part still offered on a Complete line) and the state C45021 / C45035 / C45061 need (a work
// order that becomes non-editable while an inline row is open).
// Why the earlier attempts failed: the spare work orders already carried part requests sitting at
// `authorized_to_order`, and a line will not complete while any request is unfulfilled — picking
// only helps a request that is `in_stock`. So a clean line is built rather than borrowed.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/82-seedwo.json`, JSON.stringify(R,null,1));
const api = (path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,400)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

// ---- find a spare work order that has a line with NO part requests at all
const list = await api('/api/work-orders?limit=100&page=1');
const cand = rowsOf(list.json).filter(w=>['approved','estimate','in_progress'].includes(String(w.status||'').toLowerCase()));
let WO=null, LINE=null;
for (const w of cand.slice(0,25)){
  const d = await api(`/api/work-orders/lines/${w.id}`);
  if (d.status!==200) continue;
  const lines = rowsOf(d.json);
  const clean = lines.find(l=>l && l.line_id && (l.part_requests||[]).length===0
    && String(l.status||'').toLowerCase()!=='complete');
  if (clean){ WO=w; LINE=clean; break; }
}
R.chosen = {wo: WO && {id:WO.id, num:WO.number, status:WO.status},
            line: LINE && {id:LINE.line_id, status:LINE.status, name:LINE.line_name}};
log('a work order with a clean line:', JSON.stringify(R.chosen));
save();
if (!WO){ log('no work order has a line with zero part requests — stopping'); await s.browser.close(); process.exit(0); }
if (String(LINE.status||'').toLowerCase()==='authorization_required'){
  R.authorize = await api('/api/work-orders/lines/change-status', {line_id:LINE.line_id, status:'authorized', workOrderId:WO.id});
  log('line authorised:', JSON.stringify(R.authorize).slice(0,140));
}
// ---- add ONE in-stock part through the inline row, so it is a real user-made request
const open=async()=>{await page.goto(`${APP}/workorders/${WO.id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
await open();
R.added = await page.evaluate(async ({vis, lineId})=>{const isVis=eval(vis);
  const btns=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis);
  if(!btns.length) return 'no add part button';
  btns[0].scrollIntoView({block:'center'}); btns[0].click(); return 'clicked';}, {vis:VIS, lineId:LINE.line_id});
await page.waitForTimeout(4500);
await page.click('[data-test-id=select_inline_part_number]');
await page.keyboard.type('51372MP',{delay:100}); await page.waitForTimeout(6500);
R.pick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return 'no menu';
  const it=[...m.querySelectorAll('.q-item')].filter(isVis)[0]; if(!it) return 'no item';
  const l=t(it).slice(0,80); it.click(); return l;}, VIS);
await page.waitForTimeout(5500);
await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1500);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(9000);
log('added an in-stock part:', R.pick);
// ---- pick every request on that line, then complete it
const after = await api(`/api/work-orders/lines/${WO.id}`);
const L2 = rowsOf(after.json).find(x=>x.line_id===LINE.line_id);
R.requests = (L2 && L2.part_requests || []).map(x=>({id:x.id, status:x.status, pn:x.part_number}));
log('requests now on the line:', JSON.stringify(R.requests));
R.picks=[];
for (const rq of (L2 && L2.part_requests || [])){
  const res = await api('/api/work-orders/part/perform-request-status-action', {part_request_id:rq.id, action:'pick'});
  R.picks.push({id:rq.id, was:rq.status, status:res.status});
}
log('picks:', JSON.stringify(R.picks));
const check = await api(`/api/work-orders/lines/${WO.id}`);
R.requestsAfterPick = (rowsOf(check.json).find(x=>x.line_id===LINE.line_id)||{}).part_requests?.map(x=>({id:x.id, status:x.status}));
log('request statuses after picking:', JSON.stringify(R.requestsAfterPick));
R.lineComplete = await api('/api/work-orders/lines/change-status', {line_id:LINE.line_id, status:'complete', workOrderId:WO.id});
log('line -> complete:', JSON.stringify(R.lineComplete).slice(0,260));
save();
// ---- C45250, only if the line really did complete
if (R.lineComplete.status===200 || R.lineComplete.status===201){
  await open();
  R.C45250_cl1 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
    return {addPart:add.length, addPartVisible:add.filter(isVis).length,
      lineStatuses:[...document.querySelectorAll('.q-chip,.q-badge')].filter(isVis).map(t).filter(x=>/complete|approved|authorized|requested/i.test(x)).slice(0,8)};}, VIS);
  log('C45250 cl.1 — Add Part on a COMPLETE line:', JSON.stringify(R.C45250_cl1));
  await page.screenshot({path:`${DIR}/evidence/82-a-completeline.png`, fullPage:true});
  save();
  if (R.C45250_cl1.addPartVisible){
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
    await page.waitForTimeout(5000);
    if (await page.$('[data-test-id=input_inline_part_description]')){
      await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST uncompletes the line');
      await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1500);
      await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
      await page.waitForTimeout(9000);
      const l3 = await api(`/api/work-orders/lines/${WO.id}`);
      R.C45250_cl2 = { toast: await page.evaluate(vis=>{const isVis=eval(vis);
          return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS),
        lineStatusAfter: (rowsOf(l3.json).find(x=>x.line_id===LINE.line_id)||{}).status };
      log('C45250 cl.2 — after adding to the Complete line:', JSON.stringify(R.C45250_cl2));
      await page.screenshot({path:`${DIR}/evidence/82-b-uncompleted.png`, fullPage:true});
      save();
    }
  }
}
R.woId = WO.id; R.lineId = LINE.line_id; R.lineOriginalStatus = LINE.status;
save();
await s.browser.close();
