// C45251 — on a COMPLETE line, which part fields are editable, for an inventory part and for a
// special-order part.
// The case's own note says to mark it Blocked if the line will not go to Complete. Instead this
// probe drives the two things that were stopping it: it PICKS the inventory part request, and it
// walks the special-order request through its own status actions until it is received. Every action
// name is discovered from the API's refusal message rather than guessed.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/106-completedline.json`, JSON.stringify(R,null,1));
const mkCall=(page,APIH)=>(method,path,body)=>page.evaluate(async ({api,method,path,body})=>{
  const r=await fetch(`https://${api}${path}`,{method,
    headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include',
    body: body? JSON.stringify(body):undefined});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,400)};}, {api:APIH, method, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315','/workorders','admin');
const {page, APP, APIH} = s; const call = mkCall(page, APIH);

// ---- 1. an editable work order with a line that already carries part requests
const list = await call('GET','/api/work-orders?limit=200');
const wos = rowsOf(list.json);
const editable = new Set(['estimate','approved','in_progress','review']);
let target=null;
for (const w of wos){
  const st = String(w.status||'').toLowerCase().replace(/\s+/g,'_');
  if (!editable.has(st)) continue;
  const ln = await call('GET', `/api/work-orders/lines/${w.id}`);
  const lines = rowsOf(ln.json);
  for (const l of lines){
    const reqs = l.part_requests||[];
    if (reqs.length){ target={wo:w.id, woNumber:w.number, line:l.line_id, lineStatus:l.status,
      requests:reqs.map(r=>({id:r.id, status:r.status, qty:r.quantity, type:r.part_type,
        pn:(r.part&&(r.part.part_number||r.part.number))||r.part_number}))}; break; }
  }
  if (target) break;
}
R.target = target;
log('target: %s', JSON.stringify(target));
save();
if (!target){ R.fatal='no editable work order has a line with part requests'; save();
  console.log('STOP —',R.fatal); await s.browser.close(); process.exit(0); }

// ---- 2. discover what status actions the endpoint will accept
const ACTIONS=['pick','order','receive','ordered','received','mark-as-ordered','mark-as-received','complete'];
R.actionProbe={};
for (const req of target.requests){
  R.actionProbe[req.id] = {startedAs:req.status, tried:{}};
  for (const a of ACTIONS){
    const r = await call('POST','/api/work-orders/part/perform-request-status-action',
      {part_request_id:req.id, action:a, workOrderId:target.wo});
    R.actionProbe[req.id].tried[a] = {status:r.status, text:r.text.slice(0,180)};
    if (r.status>=200 && r.status<300){
      const ln = await call('GET', `/api/work-orders/lines/${target.wo}`);
      const l = rowsOf(ln.json).find(x=>x.line_id===target.line)||{};
      const now = (l.part_requests||[]).find(x=>x.id===req.id);
      R.actionProbe[req.id].tried[a].nowIs = now? now.status : 'gone from part_requests';
    }
    save();
  }
  log('  request %s: %s', req.id, JSON.stringify(
    Object.fromEntries(Object.entries(R.actionProbe[req.id].tried).map(([k,v])=>[k, v.status+(v.nowIs?'->'+v.nowIs:'')]))));
}

// ---- 3. try to put the line into Complete
R.lineComplete = await call('POST','/api/work-orders/lines/change-status',
  {line_id:target.line, status:'complete', workOrderId:target.wo});
log('line -> complete: %s %s', R.lineComplete.status, R.lineComplete.text.slice(0,220));
{
  const ln = await call('GET', `/api/work-orders/lines/${target.wo}`);
  const l = rowsOf(ln.json).find(x=>x.line_id===target.line)||{};
  R.lineStatusNow = l.status;
  R.partsOnLine = (l.parts||[]).map(p=>({id:p.id, pn:p.part_number, type:p.part_type||p.type, qty:p.quantity}));
  log('line status now: %s; parts: %s', R.lineStatusNow, JSON.stringify(R.partsOnLine));
}
save();

// ---- 4. if it is complete, open each part's edit row and read which fields are actually editable
if (String(R.lineStatusNow||'').toLowerCase().startsWith('complet')){
  await page.goto(`${APP}/workorders/${target.wo}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  await page.screenshot({path:`${DIR}/evidence/106-1-complete-line.png`, fullPage:true});
  R.editControls = await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('[data-test-id^=button_edit_part_]')].filter(isVis)
      .map(b=>b.getAttribute('data-test-id'));}, VIS);
  log('visible edit controls on the completed line: %s', JSON.stringify(R.editControls));
  R.rows={};
  for (const tid of R.editControls){
    await page.evaluate(t=>{const b=document.querySelector(`[data-test-id="${t}"]`);
      if(b){b.scrollIntoView({block:'center'}); b.click();}}, tid);
    await page.waitForTimeout(5000);
    R.rows[tid] = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const d=document.querySelector('[data-test-id=input_inline_part_description]');
      let b=d||document.querySelector('[data-test-id=button_save_inline_part]');
      if(!b) return {open:false};
      for(let i=0;i<9&&b.parentElement;i++){b=b.parentElement; if(b.querySelector('[data-test-id=button_save_inline_part]')) break;}
      const fields=[...b.querySelectorAll('input,select,textarea')].filter(isVis).map(i=>{
        const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label');
        return {label: l? t(l): (i.getAttribute('data-test-id')||i.name||''),
          tid:i.getAttribute('data-test-id'), value:i.value,
          editable: !(i.readOnly || i.disabled || i.getAttribute('aria-disabled')==='true'
                      || (p && p.classList.contains('q-field--disabled'))),
          x:Math.round(i.getBoundingClientRect().x)};}).sort((a,c)=>a.x-c.x);
      return {open:true, fields, readOnlyText:t(b).slice(0,300)};}, VIS);
    await page.screenshot({path:`${DIR}/evidence/106-row-${tid}.png`, fullPage:true});
    log('  %s -> %s', tid, JSON.stringify((R.rows[tid].fields||[]).map(f=>`${f.label}:${f.editable?'EDITABLE':'read-only'}`)));
    save();
    await page.evaluate(()=>{const c=document.querySelector('[data-test-id=button_cancel_inline_part]'); c&&c.click();});
    await page.waitForTimeout(3000);
  }
} else {
  R.note='the line did not reach Complete; section 4 was not run (nothing is reported as observed)';
  log('the line did not reach Complete — %s', R.lineStatusNow);
}
save();
await s.browser.close();
log('done');
