// C45250 and C45251 — the run built on the DOM as it actually is.
//
// probe112 settled how a work order line is represented, after two scoping attempts failed in
// opposite directions:
//   * lines are TABLE ROWS inside [data-test-id=table_work_order_lines], NOT `.q-expansion-item`.
//     The two expansion items on the page are the customer and vehicle header panels. Expanding
//     them, and searching them for a line, was always going to find nothing.
//   * each line owns real test-ids: button_line_expand_<lineId> · line_number_<lineId> ·
//     badge_line_status_<lineId> · button_action_complete_line_<lineId>, and its parts carry
//     button_part_context_menu_<partId>_line_<lineId>.
//   * the "+ Add Part" button sits in a <tr class="line-row parts-group-header"> — one per line,
//     which is why counting them gave 5 and why "walk up the DOM" matched all of them.
// So a line's Add Part row is found by walking the table in DOM order and remembering which line
// the last badge_line_status_<id> belonged to. Every claim is then re-checked against the API.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/113-c45250-c45251.json`, JSON.stringify(R,null,1));
const WO='6a529a5f-dff9-4c13-9636-b41500e585f0';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page, APP, APIH} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:t.slice(0,400)};},{api:APIH,m,p,b:b||null});
const getLine=async(id)=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).find(l=>l.line_id===id)||{};
const setVal = (tid,val)=>page.evaluate(({tid,val})=>{const i=document.querySelector(`[data-test-id="${tid}"]`);
  if(!i) return false; i.focus();
  const proto = i.tagName==='TEXTAREA'? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
  const S=Object.getOwnPropertyDescriptor(proto,'value').set; S.call(i,val);
  i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
  return true;},{tid,val});

// walk the lines table in DOM order; the Add Part row belongs to the last line whose status badge
// (or expand button, or number) was seen above it
const addPartRowFor = `(lineId, isVis) => {
  const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
  if(!tbl) return {tableFound:false};
  const rows=[...tbl.querySelectorAll('tr')];
  let current=null, hit=null, seen=[];
  for (const r of rows){
    const marker=[...r.querySelectorAll('[data-test-id]')]
      .map(e=>e.getAttribute('data-test-id'))
      .find(x=>/^(badge_line_status_|button_line_expand_|line_number_)/.test(x));
    if (marker){ current=marker.replace(/^(badge_line_status_|button_line_expand_|line_number_)/,''); seen.push(current.slice(0,8)); }
    const btn=r.querySelector('[data-test-id=button_add_part]');
    if (btn && current===lineId){ hit=btn; break; }
  }
  return {tableFound:true, linesSeen:seen, found:!!hit, visible:hit?isVis(hit):false, el:hit};
}`;
const findAddPart = (lineId)=>page.evaluate(({vis,lineId,fn})=>{const isVis=eval(vis);
  const r=eval(`(${fn})`)(lineId, isVis); const {el,...rest}=r; return rest;}, {vis:VIS, lineId, fn:addPartRowFor});
const clickAddPart = (lineId)=>page.evaluate(({vis,lineId,fn})=>{const isVis=eval(vis);
  const r=eval(`(${fn})`)(lineId, isVis);
  if(!r.el) return {clicked:false, ...r, el:undefined};
  r.el.scrollIntoView({block:'center'}); r.el.click();
  const {el,...rest}=r; return {clicked:true, ...rest};}, {vis:VIS, lineId, fn:addPartRowFor});
// 🛑 LINES ARE EXPANDED BY DEFAULT. Clicking the expand button unconditionally COLLAPSES the line,
// its child rows go hidden, and its "+ Add Part" row stops being rendered at all — which is exactly
// what made the row walk return found:false for the target line while finding the other four.
// Measured in probe114: the collapsed line's toggle reads "expand_more", an expanded one
// "expand_less". So click only when it is actually collapsed, and verify afterwards.
const expandLine = async (lineId)=>{
  const state = ()=>page.evaluate(id=>{
    const b=document.querySelector(`[data-test-id="button_line_expand_${id}"]`);
    if(!b) return {found:false};
    const txt=(b.textContent||'').trim();
    return {found:true, collapsed:/expand_more/.test(txt), toggle:txt.slice(0,20)};}, lineId);
  let st = await state();
  if (!st.found) return {found:false};
  if (st.collapsed){
    await page.evaluate(id=>{const b=document.querySelector(`[data-test-id="button_line_expand_${id}"]`);
      if(b){b.scrollIntoView({block:'center'}); b.click();}}, lineId);
    await page.waitForTimeout(4000);
    st = await state();
  }
  return {found:true, expanded:!st.collapsed, toggle:st.toggle};
};
const load = async ()=>{ await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(10000); };

// ---- choose an authorized line with nothing on it; create one only if there isn't one
await page.waitForTimeout(9000);
let all = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
R.lines = all.map(l=>({id:l.line_id, status:l.status, parts:(l.parts||[]).length, reqs:(l.part_requests||[]).length}));
let LINE = (all.find(l=>String(l.status).toLowerCase()==='authorized'
  && !(l.parts||[]).length && !(l.part_requests||[]).length)||{}).line_id || null;
R.line = LINE;
log('lines: %s', JSON.stringify(R.lines));
log('working on line %s', LINE);
if(!LINE){ R.fatal='no empty authorized line to build on'; save(); await s.browser.close(); process.exit(0); }
save();

// ---- add an inventory part at quantity 5 through THIS line's Add Part button
await load();
await expandLine(LINE); await page.waitForTimeout(5000);
R.addPartLookup = await findAddPart(LINE);
log('Add Part row for my line: %s', JSON.stringify(R.addPartLookup));
save();
if (!R.addPartLookup.found){ R.fatal='could not locate this line\'s Add Part button in the lines table';
  await page.screenshot({path:`${DIR}/evidence/113-0-nolookup.png`, fullPage:true});
  save(); await s.browser.close(); process.exit(0); }
R.addPartClick = await clickAddPart(LINE);
await page.waitForTimeout(6000);
await setVal('select_inline_part_number','F40010212');
await page.waitForTimeout(6000);
R.typeahead = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const opts=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
  const cards=opts.map(o=>t(o).slice(0,100)).slice(0,8);
  const stocked=opts.find(o=>/inventory qty/i.test(t(o)));
  if(stocked){ const label=t(stocked).slice(0,100); stocked.click(); return {chose:'stocked', label, cards}; }
  if(opts.length){ const label=t(opts[0]).slice(0,100); opts[0].click(); return {chose:'first', label, cards}; }
  return {chose:null, cards};}, VIS);
log('typeahead: %s', JSON.stringify(R.typeahead).slice(0,350));
await page.waitForTimeout(4000);
await setVal('input_inline_part_quantity','5');
await setVal('input_inline_part_cost','12');
await setVal('input_inline_part_sell_price','24');
await page.waitForTimeout(2000);
await page.screenshot({path:`${DIR}/evidence/113-1-part-row.png`, fullPage:true});
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]');
  if(b){b.scrollIntoView({block:'center'}); b.click();}});
await page.waitForTimeout(9000);
let l = await getLine(LINE);
R.afterAdd = {status:l.status, requests:(l.part_requests||[]).map(r=>({id:r.id,status:r.status,qty:r.quantity})),
  parts:(l.parts||[]).map(p=>({id:p.id,pn:p.part_number,qty:p.quantity}))};
log('after adding: %s', JSON.stringify(R.afterAdd)); save();
if (!R.afterAdd.requests.length && !R.afterAdd.parts.length){
  R.fatal='no part landed on this line; neither case is observed';
  await page.screenshot({path:`${DIR}/evidence/113-1b-nopart.png`, fullPage:true});
  log(R.fatal); save(); await s.browser.close(); process.exit(0); }

// ---- pick, then complete
R.picks={};
for (const r of (l.part_requests||[])){
  const x = await call('POST','/api/work-orders/part/perform-request-status-action',
    {part_request_id:r.id, action:'pick', workOrderId:WO});
  R.picks[r.id]={from:r.status, http:x.status, text:x.text.slice(0,200)};
}
l = await getLine(LINE);
R.afterPick = {status:l.status, nRequests:(l.part_requests||[]).length,
  parts:(l.parts||[]).map(p=>({id:p.id,pn:p.part_number,qty:p.quantity}))};
log('after picking: %s', JSON.stringify(R.afterPick)); save();
R.complete = await call('POST','/api/work-orders/lines/change-status',{line_id:LINE, status:'complete', workOrderId:WO});
l = await getLine(LINE); R.lineStatus=l.status;
log('complete -> %s %s | line is %s', R.complete.status, R.complete.text.slice(0,220), R.lineStatus);
save();
if (!String(R.lineStatus||'').toLowerCase().startsWith('complet')){
  R.note='the line did not reach Complete; NOTHING is observed for C45250 or C45251';
  log(R.note); save(); await s.browser.close(); process.exit(0); }

// ---- C45251: the fields on a completed line, addressed by part id
await load(); await expandLine(LINE); await page.waitForTimeout(6000);
await page.screenshot({path:`${DIR}/evidence/113-2-complete-line.png`, fullPage:true});
R.C45251={};
for (const p of (R.afterPick.parts||[])){
  const clicked = await page.evaluate(id=>{
    const b=document.querySelector(`[data-test-id="button_edit_part_${id}"]`);
    if(!b) return {found:false};
    b.scrollIntoView({block:'center'});
    const row=b.closest('tr'); row&&row.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
    b.click(); return {found:true};}, p.id);
  if(!clicked.found){ R.C45251[p.pn||p.id]={editControlPresent:false,
    note:'no button_edit_part_<id> for this part on the completed line'}; save(); continue; }
  await page.waitForTimeout(5000);
  R.C45251[p.pn||p.id] = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    let b=document.querySelector('[data-test-id=button_save_inline_part]');
    if(!b) return {open:false, note:'the edit control was clicked but no inline row opened'};
    for(let i=0;i<10&&b.parentElement;i++){b=b.parentElement; if(b.querySelectorAll('input').length>1) break;}
    return {open:true, editControlPresent:true,
      fields:[...b.querySelectorAll('input,select,textarea')].filter(isVis).map(i=>{
        const p2=i.closest('.q-field'); const lb=p2&&p2.querySelector('.q-field__label');
        return {label:lb?t(lb):(i.getAttribute('data-test-id')||''), value:i.value,
          editable: !(i.readOnly||i.disabled||i.getAttribute('aria-disabled')==='true'
                      ||(p2&&p2.classList.contains('q-field--disabled')))};})};}, VIS);
  await page.screenshot({path:`${DIR}/evidence/113-row-${String(p.pn||p.id).replace(/[^\w.-]/g,'_')}.png`, fullPage:true});
  log('C45251 %s -> %s', p.pn, JSON.stringify((R.C45251[p.pn||p.id].fields||[]).map(f=>`${f.label}:${f.editable?'EDIT':'ro'}`)));
  save();
  await page.evaluate(()=>{const c=document.querySelector('[data-test-id=button_cancel_inline_part]'); c&&c.click();});
  await page.waitForTimeout(3000);
}

// ---- C45250: Add Part on the completed line, and does saving uncomplete it by itself?
const C={};
C.lookup = await findAddPart(LINE);
log('C45250 Add Part on the completed line: %s', JSON.stringify(C.lookup));
if (C.lookup.found && C.lookup.visible){
  await clickAddPart(LINE);
  await page.waitForTimeout(6000);
  C.rowOpened = await page.evaluate(vis=>{const isVis=eval(vis);
    const d=document.querySelector('[data-test-id=input_inline_part_description]'); return !!(d&&isVis(d));}, VIS);
  if (C.rowOpened){
    await setVal('input_inline_part_description','ZZAUTOTEST C45250 part on a complete line');
    await setVal('input_inline_part_quantity','1');
    await setVal('input_inline_part_cost','5');
    await setVal('input_inline_part_sell_price','9');
    await page.waitForTimeout(2000);
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]');
      if(b){b.scrollIntoView({block:'center'}); b.click();}});
    await page.waitForTimeout(9000);
    C.toasts = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      return [...document.querySelectorAll('.q-notification,.q-banner,[role=alert],.q-dialog')].filter(isVis).map(t).filter(Boolean);}, VIS);
    const l3 = await getLine(LINE);
    C.lineStatusAfter=l3.status;
    C.uncompletedItself=!String(l3.status||'').toLowerCase().startsWith('complet');
    C.partsAfter=(l3.parts||[]).map(x=>({pn:x.part_number,qty:x.quantity}));
    C.requestsAfter=(l3.part_requests||[]).map(x=>({status:x.status,qty:x.quantity}));
    C.partLandedHere = (C.partsAfter.length + C.requestsAfter.length) > (R.afterPick.parts||[]).length;
  }
  await page.screenshot({path:`${DIR}/evidence/113-3-c45250-after.png`, fullPage:true});
}
R.C45250=C;
log('C45250: %s', JSON.stringify(C));
save();
await s.browser.close();
log('done');
