// C45021 (Tech add) · C45035 (Tech edit) · C45061 (Full View add), second attempt.
// Probe 58 could not move the work order: `change-status {status:'complete'}` returns
// 400 "Cannot complete work order with incomplete lines." So the LINES are completed first — every
// part request picked, then each line set to complete — while the work order is still editable.
// Only then is the inline row opened, the work order completed underneath it, and Save pressed.
// A SPARE work order is used and every status is put back at the end.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const SUITE_WO='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/72-noneditable2.json`, JSON.stringify(R,null,1));
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s0 = await boot('sv9315','/workorders','admin');
const call = (pg, api, path, body)=>pg.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,300)};}, {api, path, body:body||null});

// ---- choose a spare work order and remember every original status
const list = await call(s0.page, s0.APIH, '/api/work-orders?limit=100&page=1');
const cand = rowsOf(list.json).filter(w=>w.id!==SUITE_WO && String(w.status||'').toLowerCase()==='approved');
let WO=null, LINES=null;
for (const w of cand.slice(0,8)){
  let lines=[];
  for (const p of [`/api/work-orders/lines/${w.id}`]){
    const d = await call(s0.page, s0.APIH, p);
    if (d.status!==200) continue;
    const cand = rowsOf(d.json && (d.json.lines || (d.json.data && d.json.data.lines) || d.json));
    if (Array.isArray(cand) && cand.length && cand[0] && (cand[0].line_id||cand[0].id)){
      lines=cand.map(x=>({...x, id:x.line_id||x.id})); R.linesPath=p; break; }
  }
  R.lineKeys = lines[0] ? Object.keys(lines[0]).slice(0,18) : null;
  if (lines.length){ WO=w; LINES=lines; break; }
}
R.chosen = {wo: WO && {id:WO.id, num:WO.number, status:WO.status},
            lines: (LINES||[]).map(l=>({id:l.id, status:l.status, name:(l.name||l.description||'').slice(0,30)}))};
log('chosen:', JSON.stringify(R.chosen).slice(0,500)); save();
if (!WO){ log('no spare approved work order with lines — stopping'); await s0.browser.close(); process.exit(0); }

// ---- pick every part request on it, then complete every line
const reqs = await call(s0.page, s0.APIH, '/api/work-orders/part/list-requests');
const mine = rowsOf(reqs.json).filter(x=>String(x.work_order_id||x.workOrderId||'')===WO.id);
R.picks=[];
for (const rq of mine){
  const res = await call(s0.page, s0.APIH, '/api/work-orders/part/perform-request-status-action', {part_request_id:rq.id, action:'pick'});
  R.picks.push({id:rq.id, status:res.status, body:res.text.slice(0,90)});
}
log('picked %d part requests:', R.picks.length, JSON.stringify(R.picks).slice(0,300));
R.lineCompletes=[];
for (const l of LINES){
  const res = await call(s0.page, s0.APIH, '/api/work-orders/lines/change-status', {line_id:l.id, status:'complete', workOrderId:WO.id});
  R.lineCompletes.push({id:l.id, status:res.status, body:res.text.slice(0,110)});
}
log('lines -> complete:', JSON.stringify(R.lineCompletes).slice(0,400)); save();
await s0.browser.close();

// ---- the three legs
const leg = async (key, mode)=>{
  const s = await boot('sv9315','/workorders',key); const {page, APP, APIH}=s; const out={key, mode};
  await page.goto(`${APP}/workorders/${WO.id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  if (mode==='edit'){
    out.opened = await page.evaluate(()=>{const e=document.querySelector('[data-test-id^=button_edit_part_]');
      if(!e) return 'no edit control'; e.scrollIntoView({block:'center'}); e.click(); return 'opened';});
    await page.waitForTimeout(6500);
    if (await page.$('[data-test-id=input_inline_part_quantity]')) await page.fill('[data-test-id=input_inline_part_quantity]','6');
  } else {
    out.opened = await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]');
      if(!b) return 'no add button'; b.scrollIntoView({block:'center'}); b.click(); return 'opened';});
    await page.waitForTimeout(4500);
    if (await page.$('[data-test-id=input_inline_part_description]')){
      await page.fill('[data-test-id=input_inline_part_description]',`ZZAUTOTEST noneditable ${key}`);
      await page.fill('[data-test-id=input_inline_part_quantity]','5');
    }
  }
  await page.waitForTimeout(1500);
  out.rowBefore = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    return d? {open:true, desc:d.value, qty:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value}:{open:false};});
  if (!out.rowBefore.open){ log('%s/%s: no row (%s)', key, mode, out.opened); await s.browser.close(); return out; }
  out.moved = await call(page, APIH, '/api/work-orders/change-status', {id:WO.id, status:'complete'});
  log('%s/%s work order -> complete: %s', key, mode, JSON.stringify(out.moved).slice(0,220));
  await page.waitForTimeout(2500);
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(9000);
  out.toast = await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS);
  out.rowAfter = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    return d? {open:true, desc:d.value, qty:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value}:{open:false};});
  out.alerts = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    return [...new Set([...document.querySelectorAll('.q-dialog,[role=alert],.text-negative,.q-field__messages')].filter(isVis).map(t).filter(Boolean))]
      .filter(m=>!/Credit Hold|Build Lines|location_on|^\$/.test(m));}, VIS);
  log('%s/%s toast=%s row=%s alerts=%s', key, mode, JSON.stringify(out.toast), JSON.stringify(out.rowAfter), JSON.stringify(out.alerts).slice(0,300));
  await page.screenshot({path:`${DIR}/evidence/72-${key}-${mode}.png`, fullPage:true});
  // put the work order back to approved for the next leg
  out.restored = await call(page, APIH, '/api/work-orders/change-status', {id:WO.id, status:'approved'});
  await s.browser.close();
  return out;
};
R.C45021 = await leg('tech','add'); save();
R.C45035 = await leg('tech','edit'); save();
R.C45061 = await leg('admin','add'); save();

// ---- put every line back
const s9 = await boot('sv9315','/workorders','admin');
R.lineRestore=[];
for (const l of LINES){
  const res = await call(s9.page, s9.APIH, '/api/work-orders/lines/change-status', {line_id:l.id, status:String(l.status||'authorized'), workOrderId:WO.id});
  R.lineRestore.push({id:l.id, to:l.status, status:res.status});
}
R.woRestore = await call(s9.page, s9.APIH, '/api/work-orders/change-status', {id:WO.id, status:String(WO.status||'approved').toLowerCase()});
log('restored lines:', JSON.stringify(R.lineRestore).slice(0,300), '| work order:', JSON.stringify(R.woRestore).slice(0,140));
save();
await s9.browser.close();
