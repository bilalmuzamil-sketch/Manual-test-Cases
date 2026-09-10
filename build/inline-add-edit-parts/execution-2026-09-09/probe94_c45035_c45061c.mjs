// C45035 and C45061, fourth attempt — with a FRESH work order. Probe 89 seeded 51372MP — but this session's own testing has
// consumed that part's stock, so the request came back `authorized_to_order` (a vendor order) rather
// than `in_stock`, `pick` could not fulfil it, and the line would not complete. HDEO13 is used here:
// 792 on hand. Leftover unfulfilled requests from earlier probes on this spare work order are
// removed first, since they are our own test data and they block the line.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
let WOID=null, LINES=[];   // discovered below — a work order still free of part requests
const INSTOCK='HDEO13';   // 792 on hand
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/94-c45035-c45061.json`, JSON.stringify(R,null,1));
const mkApi=(page,APIH)=>(path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,220)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

// ---------- prepare ----------
{
  const s = await boot('sv9315','/workorders','admin'); const {page, APP, APIH}=s; const api=mkApi(page,APIH);
  // find a work order whose lines carry NO part requests at all
  const list = await api('/api/work-orders?limit=100&page=1');
  for (const w of rowsOf(list.json).filter(x=>['approved','estimate','in_progress'].includes(String(x.status||'').toLowerCase())).slice(0,30)){
    const d = await api(`/api/work-orders/lines/${w.id}`);
    if (d.status!==200) continue;
    const lines = rowsOf(d.json);
    if (lines.length && lines.every(l=>l && l.line_id && (l.part_requests||[]).length===0)){
      WOID=w.id; LINES=lines.map(l=>l.line_id); R.chosen={id:w.id, num:w.number, status:w.status, lines:lines.length};
      break;
    }
  }
  log('a work order still free of part requests:', JSON.stringify(R.chosen));
  if (!WOID){ log('none left — C45035 and C45061 are reported not testable, with the reason'); await s.browser.close(); process.exit(0); }
  await api('/api/work-orders/change-status', {id:WOID, status:'approved'});
  for (const id of LINES) await api('/api/work-orders/lines/change-status', {line_id:id, status:'authorized', workOrderId:WOID});
  // add a genuinely in-stock part
  await page.goto(`${APP}/workorders/${WOID}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b&&b.scrollIntoView({block:'center'}); b&&b.click();});
  await page.waitForTimeout(4500);
  await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type(INSTOCK,{delay:100}); await page.waitForTimeout(6500);
  R.seed = await page.evaluate(({vis,pn})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return 'no menu';
    const its=[...m.querySelectorAll('.q-item')].filter(isVis); if(!its.length) return 'no items';
    const i=its.findIndex(x=>t(x).includes(pn)); const target=its[i>=0?i:0];
    const l=t(target).slice(0,90); target.click(); return l;}, {vis:VIS, pn:INSTOCK});
  await page.waitForTimeout(5500);
  await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1500);
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(9000);
  log('seeded:', R.seed);
  const d1 = await api(`/api/work-orders/lines/${WOID}`);
  R.afterSeed = rowsOf(d1.json).flatMap(l=>(l.part_requests||[]).map(x=>({id:x.id, status:x.status, pn:x.part_number})));
  log('requests now:', JSON.stringify(R.afterSeed));
  R.picks=[];
  for (const rq of R.afterSeed){
    const res = await api('/api/work-orders/part/perform-request-status-action', {part_request_id:rq.id, action:'pick'});
    R.picks.push({id:rq.id, was:rq.status, status:res.status, body:res.text.slice(0,80)});
  }
  const d2 = await api(`/api/work-orders/lines/${WOID}`);
  R.afterPick = rowsOf(d2.json).flatMap(l=>(l.part_requests||[]).map(x=>({id:x.id, status:x.status})));
  log('picks: %s | statuses after: %s', JSON.stringify(R.picks).slice(0,260), JSON.stringify(R.afterPick));
  R.lineCompletes=[];
  for (const id of LINES){
    const res = await api('/api/work-orders/lines/change-status', {line_id:id, status:'complete', workOrderId:WOID});
    R.lineCompletes.push({id, status:res.status, body:res.text.slice(0,90)});
  }
  log('lines -> complete:', JSON.stringify(R.lineCompletes).slice(0,300));
  save();
  await s.browser.close();
}
// ---------- the two legs ----------
const leg = async (key, mode, caseId)=>{
  const s = await boot('sv9315','/workorders',key); const {page, APP, APIH}=s; const api=mkApi(page,APIH); const out={key, mode, caseId};
  await api('/api/work-orders/change-status', {id:WOID, status:'approved'});
  await page.goto(`${APP}/workorders/${WOID}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  if (mode==='edit'){
    out.opened = await page.evaluate(()=>{const e=document.querySelector('[data-test-id^=button_edit_part_]');
      if(!e) return 'no edit control'; e.scrollIntoView({block:'center'}); e.click(); return 'opened';});
    await page.waitForTimeout(6500);
    if (await page.$('[data-test-id=input_inline_part_quantity]')) await page.fill('[data-test-id=input_inline_part_quantity]','7');
  } else {
    out.opened = await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]');
      if(!b) return 'no add button'; b.scrollIntoView({block:'center'}); b.click(); return 'opened';});
    await page.waitForTimeout(4500);
    if (await page.$('[data-test-id=input_inline_part_description]')){
      await page.fill('[data-test-id=input_inline_part_description]',`ZZAUTOTEST ${caseId} row`);
      await page.fill('[data-test-id=input_inline_part_quantity]','5');
      if (await page.$('[data-test-id=input_inline_part_cost]')) await page.fill('[data-test-id=input_inline_part_cost]','2.00');
      if (await page.$('[data-test-id=input_inline_part_sell_price]')) await page.fill('[data-test-id=input_inline_part_sell_price]','5.00');
    }
  }
  await page.waitForTimeout(1500);
  out.rowBefore = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    return d? {open:true, desc:d.value, qty:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value}:{open:false};});
  if (!out.rowBefore.open){ out.skipped='no row opened ('+out.opened+')'; log('%s: %s', caseId, out.skipped); await s.browser.close(); return out; }
  out.moved = await api('/api/work-orders/change-status', {id:WOID, status:'complete'});
  if (out.moved.status!==200 && out.moved.status!==201){
    out.skipped='the work order would not go non-editable ('+out.moved.text.slice(0,80)+') — save NOT attempted';
    log('%s: %s', caseId, out.skipped); await s.browser.close(); return out;
  }
  await page.waitForTimeout(2500);
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(9000);
  out.rowAfter = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    return d? {open:true, desc:d.value, qty:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value}:{open:false};});
  out.alerts = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    return [...new Set([...document.querySelectorAll('.q-dialog,[role=alert],.text-negative,.q-notification')].filter(isVis).map(t).filter(Boolean))]
      .filter(m=>!/Credit Hold|Build Lines|location_on|^\$/.test(m));}, VIS);
  log('%s | row=%s | alerts=%s', caseId, JSON.stringify(out.rowAfter), JSON.stringify(out.alerts).slice(0,240));
  await page.screenshot({path:`${DIR}/evidence/94-${caseId}.png`, fullPage:true});
  await api('/api/work-orders/change-status', {id:WOID, status:'approved'});
  await s.browser.close();
  return out;
};
R.C45035 = await leg('tech','edit','C45035'); save();
R.C45061 = await leg('admin','add','C45061'); save();
{
  const s = await boot('sv9315','/workorders','admin'); const api=mkApi(s.page, s.APIH);
  for (const id of LINES) await api('/api/work-orders/lines/change-status', {line_id:id, status:'authorized', workOrderId:WOID});
  R.restore = await api('/api/work-orders/change-status', {id:WOID, status:'approved'});
  log('restored'); save(); await s.browser.close();
}
