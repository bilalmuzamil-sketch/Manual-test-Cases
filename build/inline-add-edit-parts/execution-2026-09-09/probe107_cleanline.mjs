// C45251 — a COMPLETE line, and which part fields it lets you edit.
// probe106 established why the case had been parked: the only action the part-request endpoint
// accepts is "pick", and a line refuses to complete while ANY request is unfulfilled
// ("Line can`t be completed with unfulfilled part requests."). The lines I had been reusing were
// carrying a dozen waiting_to_receive requests from earlier testing, which no action will clear.
// So this probe builds a CLEAN line instead of trying to rescue a dirty one.
//   part A - find the create-line route and make a new line
//   part B - put ONE in-stock inventory part on it at quantity 5, pick it, complete the line
//   part C - open the part and read which fields are genuinely editable
//   part D - find where a special-order part is received, for clause 2
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/107-cleanline.json`, JSON.stringify(R,null,1));
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

// ---- pick an editable work order
const wos = rowsOf((await call('GET','/api/work-orders?limit=200')).json);
const editable=new Set(['estimate','approved','in_progress','review']);
const wo = wos.find(w=>editable.has(String(w.status||'').toLowerCase().replace(/\s+/g,'_')));
R.workOrder = wo && {id:wo.id, number:wo.number, status:wo.status};
log('work order: %s', JSON.stringify(R.workOrder)); save();
if(!wo){ R.fatal='no editable work order'; save(); await s.browser.close(); process.exit(0); }

// ---- part A: create a line. Every candidate route is tried and the answer recorded.
const lineBody = {workOrderId:wo.id, work_order_id:wo.id, description:'ZZAUTOTEST C45251 completed-line check',
  complaint:'ZZAUTOTEST C45251', quantity:1};
R.createLineTries={};
let LINE=null;
for (const [m,p] of [['POST','/api/work-orders/lines/create'],['POST','/api/work-orders/lines'],
                     ['POST',`/api/work-orders/lines/${wo.id}`],['POST','/api/work-orders/lines/store'],
                     ['POST','/api/work-orders/lines/add']]){
  const r = await call(m,p,lineBody);
  R.createLineTries[`${m} ${p}`]={status:r.status, text:r.text.slice(0,220)};
  if (r.status>=200 && r.status<300){
    const d=(r.json&&(r.json.data||r.json))||{};
    LINE = d.line_id||d.id||d.lineId||null;
    R.createLineTries[`${m} ${p}`].lineId=LINE;
    if (LINE) break;
  }
  save();
}
log('create-line: %s', JSON.stringify(R.createLineTries)); save();
if (!LINE){
  // fall back to the UI's own "New Line" control
  await page.goto(`${APP}/workorders/${wo.id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  const before = rowsOf((await call('GET',`/api/work-orders/lines/${wo.id}`)).json).map(l=>l.line_id);
  R.newLineButton = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const b=[...document.querySelectorAll('button,[role=button],a')].filter(isVis)
      .find(e=>/^\+?\s*(new|add)\s+line$/i.test(t(e)));
    if(!b) return {found:false, buttons:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,40)};
    b.scrollIntoView({block:'center'}); b.click(); return {found:true, label:t(b)};}, VIS);
  await page.waitForTimeout(7000);
  await page.screenshot({path:`${DIR}/evidence/107-newline.png`, fullPage:true});
  const after = rowsOf((await call('GET',`/api/work-orders/lines/${wo.id}`)).json).map(l=>l.line_id);
  LINE = after.find(x=>!before.includes(x)) || null;
  R.newLineViaUi = {...R.newLineButton, created:LINE};
  log('New Line via the UI: %s', JSON.stringify(R.newLineViaUi));
}
R.line = LINE; save();
if (!LINE){ R.fatal='could not create a line by any route'; save(); await s.browser.close(); process.exit(0); }

// ---- part B: one in-stock inventory part at quantity 5
const opts = rowsOf((await call('GET','/api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts?search=F40010212')).json);
R.optionSeen = opts.slice(0,3).map(o=>({pn:o.part_number||o.number, type:o.part_type, cost:o.cost, sell:o.sell_price,
  bins:(o.binLocations||[]).length}));
const inv = opts.find(o=>String(o.part_type||'')==='inventory_part') || opts[0];
R.chosenPart = inv && {pn:inv.part_number||inv.number, type:inv.part_type, id:inv.id, cost:inv.cost, sell:inv.sell_price};
log('part: %s', JSON.stringify(R.chosenPart)); save();

R.addTries={};
let REQ=null;
for (const p of ['/api/work-orders/part/request/create','/api/work-orders/part/request',
                 '/api/work-orders/part/request/store']){
  const body={workOrderId:wo.id, work_order_id:wo.id, line_id:LINE, lineId:LINE,
    part_id:inv&&inv.id, partId:inv&&inv.id, quantity:5, qty:5,
    description:(inv&&(inv.description||inv.name))||'ZZAUTOTEST part', cost:inv&&inv.cost, sell_price:inv&&inv.sell_price};
  const r = await call('POST',p,body);
  R.addTries[p]={status:r.status, text:r.text.slice(0,240)};
  if (r.status>=200 && r.status<300){ const d=(r.json&&(r.json.data||r.json))||{};
    REQ = d.id||d.partRequestId||d.part_request_id||null; R.addTries[p].requestId=REQ; if(REQ) break; }
  save();
}
log('add part: %s', JSON.stringify(R.addTries)); save();

// whatever landed, read the line back and pick every request on it
let lineNow = rowsOf((await call('GET',`/api/work-orders/lines/${wo.id}`)).json).find(l=>l.line_id===LINE)||{};
R.lineAfterAdd = {status:lineNow.status, requests:(lineNow.part_requests||[]).map(r=>({id:r.id,status:r.status,qty:r.quantity})),
  parts:(lineNow.parts||[]).map(p=>({id:p.id, pn:p.part_number, qty:p.quantity}))};
log('line after adding: %s', JSON.stringify(R.lineAfterAdd)); save();
R.picks={};
for (const r of (lineNow.part_requests||[])){
  const x = await call('POST','/api/work-orders/part/perform-request-status-action',
    {part_request_id:r.id, action:'pick', workOrderId:wo.id});
  R.picks[r.id]={from:r.status, status:x.status, text:x.text.slice(0,200)};
}
log('picks: %s', JSON.stringify(R.picks)); save();

lineNow = rowsOf((await call('GET',`/api/work-orders/lines/${wo.id}`)).json).find(l=>l.line_id===LINE)||{};
R.lineBeforeComplete = {status:lineNow.status, nRequests:(lineNow.part_requests||[]).length,
  parts:(lineNow.parts||[]).map(p=>({id:p.id, pn:p.part_number, qty:p.quantity}))};
R.complete = await call('POST','/api/work-orders/lines/change-status',{line_id:LINE, status:'complete', workOrderId:wo.id});
lineNow = rowsOf((await call('GET',`/api/work-orders/lines/${wo.id}`)).json).find(l=>l.line_id===LINE)||{};
R.lineStatusNow = lineNow.status;
log('complete -> %s %s | line is now %s', R.complete.status, R.complete.text.slice(0,180), R.lineStatusNow);
save();

// ---- part C: read the fields on the completed line
if (String(R.lineStatusNow||'').toLowerCase().startsWith('complet')){
  await page.goto(`${APP}/workorders/${wo.id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  await page.screenshot({path:`${DIR}/evidence/107-1-complete-line.png`, fullPage:true});
  const ids = (R.lineBeforeComplete.parts||[]).map(p=>`button_edit_part_${p.id}`);
  R.rows={};
  for (const tid of ids){
    const clicked = await page.evaluate(t=>{const b=document.querySelector(`[data-test-id="${t}"]`);
      if(!b) return false; b.scrollIntoView({block:'center'});
      const row=b.closest('tr')||b.parentElement; row&&row.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
      b.click(); return true;}, tid);
    if(!clicked){ R.rows[tid]={editControlPresent:false}; continue; }
    await page.waitForTimeout(5000);
    R.rows[tid] = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      let b=document.querySelector('[data-test-id=button_save_inline_part]');
      if(!b) return {open:false};
      for(let i=0;i<9&&b.parentElement;i++){b=b.parentElement; if(b.querySelectorAll('input').length>1) break;}
      const fields=[...b.querySelectorAll('input,select,textarea')].filter(isVis).map(i=>{
        const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label');
        return {label: l? t(l): (i.getAttribute('data-test-id')||i.name||''), value:i.value,
          editable: !(i.readOnly||i.disabled||i.getAttribute('aria-disabled')==='true'
                      ||(p&&p.classList.contains('q-field--disabled'))),
          x:Math.round(i.getBoundingClientRect().x)};}).sort((a,c)=>a.x-c.x);
      return {open:true, editControlPresent:true, fields, rowText:t(b).slice(0,400)};}, VIS);
    await page.screenshot({path:`${DIR}/evidence/107-row-${tid}.png`, fullPage:true});
    log('  %s -> %s', tid, JSON.stringify((R.rows[tid].fields||[]).map(f=>`${f.label}:${f.editable?'EDITABLE':'read-only'}`)));
    save();
    await page.evaluate(()=>{const c=document.querySelector('[data-test-id=button_cancel_inline_part]'); c&&c.click();});
    await page.waitForTimeout(3000);
  }
} else { R.note='the clean line still did not reach Complete; nothing is reported as observed'; }
save();

// ---- part D: where is a special-order part received? Read the app's own navigation.
await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(7000);
R.navigation = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('a[href],[role=menuitem],.q-item')].filter(isVis)
    .map(e=>({label:t(e).slice(0,40), href:e.getAttribute('href')}))
    .filter(x=>x.label).slice(0,60);}, VIS);
log('navigation: %s', JSON.stringify(R.navigation.map(n=>n.label)));
save();
await s.browser.close();
log('done');
