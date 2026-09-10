// C45035 (Tech, edit row) and C45061 (Full View, add row) — the work order goes non-editable while
// the row is open. Probe 86 opened the edit row correctly and then could NOT complete the work order,
// because the part it had seeded was free-typed and therefore unfulfilled, which blocks the line.
// It refused to record anything rather than pretend — the right call. Here the seed is an IN-STOCK
// part that can be picked, so the lines really do complete before the row is opened.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const WOID='12c9684e-50d7-4043-86d2-f8a83d321431';
const LINES=['a52af727-7b35-49a5-9138-e679b24c48e7','e004c99a-16c7-48b5-8ee9-1b430a526ec3'];
const INSTOCK='51372MP';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/89-c45035-c45061.json`, JSON.stringify(R,null,1));
const mkApi=(page,APIH)=>(path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,240)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

// ---------- prepare: an in-stock part on the line, picked, both lines complete ----------
{
  const s = await boot('sv9315','/workorders','admin'); const {page, APP, APIH}=s; const api=mkApi(page,APIH);
  await api('/api/work-orders/change-status', {id:WOID, status:'approved'});
  for (const id of LINES) await api('/api/work-orders/lines/change-status', {line_id:id, status:'authorized', workOrderId:WOID});
  await page.goto(`${APP}/workorders/${WOID}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  const already = await page.evaluate(()=>!!document.querySelector('[data-test-id^=button_edit_part_]'));
  R.hadPartAlready = already;
  if (!already){
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b&&b.scrollIntoView({block:'center'}); b&&b.click();});
    await page.waitForTimeout(4500);
    await page.click('[data-test-id=select_inline_part_number]');
    await page.keyboard.type(INSTOCK,{delay:100}); await page.waitForTimeout(6500);
    R.seedPick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return 'no menu';
      const it=[...m.querySelectorAll('.q-item')].filter(isVis)[0]; if(!it) return 'no item';
      const l=t(it).slice(0,70); it.click(); return l;}, VIS);
    await page.waitForTimeout(5500);
    await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1500);
    await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
    await page.waitForTimeout(9000);
    log('seeded an in-stock part:', R.seedPick);
  }
  // pick every request so the lines can complete
  const d = await api(`/api/work-orders/lines/${WOID}`);
  R.picks=[];
  for (const l of rowsOf(d.json)) for (const rq of (l.part_requests||[])){
    const res = await api('/api/work-orders/part/perform-request-status-action', {part_request_id:rq.id, action:'pick'});
    R.picks.push({id:rq.id, was:rq.status, status:res.status, body:res.text.slice(0,80)});
  }
  log('picks:', JSON.stringify(R.picks).slice(0,320));
  R.lineCompletes=[];
  for (const id of LINES){
    const res = await api('/api/work-orders/lines/change-status', {line_id:id, status:'complete', workOrderId:WOID});
    R.lineCompletes.push({id, status:res.status, body:res.text.slice(0,100)});
  }
  log('lines -> complete:', JSON.stringify(R.lineCompletes).slice(0,320));
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
    out.skipped='the work order would not go non-editable ('+out.moved.text.slice(0,90)+') — save NOT attempted';
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
  await page.screenshot({path:`${DIR}/evidence/89-${caseId}.png`, fullPage:true});
  await api('/api/work-orders/change-status', {id:WOID, status:'approved'});
  await s.browser.close();
  return out;
};
R.C45035 = await leg('tech','edit','C45035'); save();
R.C45061 = await leg('admin','add','C45061'); save();
// put the work order back
{
  const s = await boot('sv9315','/workorders','admin'); const api=mkApi(s.page, s.APIH);
  for (const id of LINES) await api('/api/work-orders/lines/change-status', {line_id:id, status:'authorized', workOrderId:WOID});
  R.restore = await api('/api/work-orders/change-status', {id:WOID, status:'approved'});
  log('restored:', JSON.stringify(R.restore).slice(0,120)); save();
  await s.browser.close();
}
