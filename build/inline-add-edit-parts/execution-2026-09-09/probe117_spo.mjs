// C45251 clause 2 — a SPECIAL ORDER part on a Complete line: only Description, Category,
// Sell Price and Margin should be editable.
// The inventory half (clauses 1 and 3) is done, on a line built by probe116. This adds the SPO
// half: the typeahead offers the SAME part number as two cards — one reading "Inventory Qty: N"
// and one reading "Catalog". Taking the Catalog card creates a special-order request, which then
// has to be ordered and received before the line can complete.
// Every control in the modal is read this time, not only <input>/<select>: the "Source" field
// showed in the modal's text but not in the input list, so it is captured from its .q-field.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/117-spo.json`, JSON.stringify(R,null,1));
const WO='6a529a5f-dff9-4c13-9636-b41500e585f0';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page, APP, APIH} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:t.slice(0,300)};},{api:APIH,m,p,b:b||null});
const getLine=async(id)=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).find(l=>l.line_id===id)||{};
const setVal = (tid,val)=>page.evaluate(({tid,val})=>{const i=document.querySelector(`[data-test-id="${tid}"]`);
  if(!i) return false; i.focus();
  const proto = i.tagName==='TEXTAREA'? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
  const S=Object.getOwnPropertyDescriptor(proto,'value').set; S.call(i,val);
  i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
  return true;},{tid,val});
const clickText = (re)=>page.evaluate(({vis,re})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const rx=new RegExp(re,'i');
  const b=[...document.querySelectorAll('button,[role=button]')].filter(isVis).find(e=>rx.test(t(e)));
  if(!b) return {clicked:false}; b.scrollIntoView({block:'center'}); b.click(); return {clicked:true, label:t(b)};},
  {vis:VIS, re:re.source||re});
const load = async ()=>{ await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(10000); };
const ensureExpanded = (id)=>page.evaluate(lineId=>{
  const b=document.querySelector(`[data-test-id="button_line_expand_${lineId}"]`);
  if(!b) return {found:false};
  if(/expand_more/.test(b.textContent||'')){ b.scrollIntoView({block:'center'}); b.click(); return {found:true, clicked:true}; }
  return {found:true, clicked:false};}, id);
const addPartRowFor = `(lineId, isVis) => {
  const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
  if(!tbl) return {tableFound:false};
  let current=null, hit=null;
  for (const r of [...tbl.querySelectorAll('tr')]){
    const m=[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))
      .find(x=>/^(badge_line_status_|button_line_expand_|line_number_)/.test(x));
    if (m) current=m.replace(/^(badge_line_status_|button_line_expand_|line_number_)/,'');
    const b=r.querySelector('[data-test-id=button_add_part]');
    if (b && current===lineId){ hit=b; break; }
  }
  return {tableFound:true, found:!!hit, visible:hit?isVis(hit):false, el:hit};
}`;
const clickAddPart = (lineId)=>page.evaluate(({vis,lineId,fn})=>{const isVis=eval(vis);
  const r=eval(`(${fn})`)(lineId,isVis);
  if(!r.el) return {clicked:false, found:r.found};
  r.el.scrollIntoView({block:'center'}); r.el.click(); return {clicked:true};},{vis:VIS,lineId,fn:addPartRowFor});
// read EVERY labelled control in the modal, input or not
const readModal = ()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const dlg=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(!dlg) return {modalOpen:false};
  const ro=(f,i)=>{
    if (f && (f.classList.contains('q-field--disabled')||f.classList.contains('q-field--readonly'))) return true;
    if (i) return !!(i.readOnly||i.disabled||i.getAttribute('aria-disabled')==='true');
    return true;};
  const fields=[...dlg.querySelectorAll('.q-field')].filter(isVis).map(f=>{
    const lb=f.querySelector('.q-field__label'); const i=f.querySelector('input,select,textarea');
    return {label: lb? t(lb) : t(f).slice(0,24),
      value: i? (i.value||'').slice(0,40) : t(f.querySelector('.q-field__native')||f).slice(0,40),
      hasInput: !!i, editable: !ro(f,i)};}).filter(x=>x.label);
  return {modalOpen:true, fields,
    buttons:[...dlg.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,12)};}, VIS);

await page.waitForTimeout(9000);
const before = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).map(l=>l.line_id);

// ---- build the line
await clickText(/^\+?\s*new\s+line$/);
await page.waitForTimeout(6000);
R.canned = await (async ()=>{
  await page.evaluate(t=>{const i=document.querySelector(`[data-test-id="${t}"]`);
    if(i){ i.scrollIntoView({block:'center'}); (i.closest('.q-field')||i).dispatchEvent(new MouseEvent('click',{bubbles:true}));
      i.dispatchEvent(new MouseEvent('click',{bubbles:true})); i.focus(); }},'select_line_canned_line');
  await page.waitForTimeout(3000);
  return await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const opts=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
    if(!opts.length) return {chose:false};
    const zero=opts.find(o=>/total parts:\s*0\b/i.test(t(o)))||opts[0];
    const label=t(zero); zero.click(); return {chose:true, label:label.slice(0,70)};}, VIS);
})();
await page.waitForTimeout(2500);
await setVal('input_time_estimate','1'); await setVal('input_tech_time','1');
await page.waitForTimeout(1500);
await clickText(/save\s*&\s*close/);
await page.waitForTimeout(9000);
const LINE = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json)
  .map(l=>l.line_id).find(x=>!before.includes(x)) || null;
R.line=LINE;
if(!LINE){ R.fatal='no line was created'; save(); await s.browser.close(); process.exit(0); }
R.authorize = await call('POST','/api/work-orders/lines/change-status',{line_id:LINE, status:'authorized', workOrderId:WO});
log('line %s authorized (%s)', LINE, R.authorize.status); save();

// ---- add the CATALOG card, which is the special-order route
await load(); await ensureExpanded(LINE); await page.waitForTimeout(4000);
R.addPart = await clickAddPart(LINE);
if(!R.addPart.clicked){ R.fatal='could not open the add row'; save(); await s.browser.close(); process.exit(0); }
await page.waitForTimeout(6000);
await setVal('select_inline_part_number','F40010212');
await page.waitForTimeout(6000);
R.typeahead = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const opts=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
  const cards=opts.map(o=>t(o).slice(0,90));
  const cat=opts.find(o=>/catalog/i.test(t(o)) && !/inventory qty/i.test(t(o)));
  if(cat){ const label=t(cat).slice(0,90); cat.click(); return {chose:'catalog', label, cards}; }
  return {chose:null, cards};}, VIS);
log('typeahead: %s', JSON.stringify(R.typeahead).slice(0,300));
if (R.typeahead.chose!=='catalog'){ R.fatal='no Catalog card was offered, so no special-order part could be created';
  save(); await s.browser.close(); process.exit(0); }
await page.waitForTimeout(4000);
await setVal('input_inline_part_quantity','5');
await setVal('input_inline_part_cost','12'); await setVal('input_inline_part_sell_price','24');
await page.waitForTimeout(2000);
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]');
  if(b){b.scrollIntoView({block:'center'}); b.click();}});
await page.waitForTimeout(9000);
let l = await getLine(LINE);
R.afterAdd={status:l.status, requests:(l.part_requests||[]).map(r=>({id:r.id,status:r.status,qty:r.quantity})),
  parts:(l.parts||[]).map(p=>({id:p.id,pn:p.part_number}))};
log('after adding the catalog part: %s', JSON.stringify(R.afterAdd)); save();

// ---- walk it through Order then Receive, using the app's own controls
await load(); await ensureExpanded(LINE); await page.waitForTimeout(4000);
R.orderReceive={};
for (const step of ['order','receive']){
  const res = await page.evaluate(({vis,step,line})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
    if(!tbl) return {clicked:false};
    let current=null, scope=[];
    for (const r of [...tbl.querySelectorAll('tr')]){
      const m=[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))
        .find(x=>/^(badge_line_status_|button_line_expand_|line_number_)/.test(x));
      if (m){ current=m.replace(/^(badge_line_status_|button_line_expand_|line_number_)/,''); }
      if (current===line) scope.push(r);
    }
    const rx=new RegExp(`^${step}$`,'i');
    for (const r of scope){
      const b=[...r.querySelectorAll('button,[role=button]')].filter(isVis).find(e=>rx.test(t(e)));
      if(b){ b.scrollIntoView({block:'center'}); b.click(); return {clicked:true, label:t(b)}; }
    }
    return {clicked:false, rowsInScope:scope.length,
      buttonsSeen:[...new Set(scope.flatMap(r=>[...r.querySelectorAll('button')].filter(isVis).map(t)))].slice(0,15)};},
    {vis:VIS, step, line:LINE});
  await page.waitForTimeout(7000);
  // an Order/Receive click often opens a confirm dialog
  const confirm = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const dlg=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
    if(!dlg) return {dialog:false};
    const b=[...dlg.querySelectorAll('button')].filter(isVis)
      .find(e=>/^(order|receive|confirm|save|save & close|yes|ok)$/i.test(t(e)));
    const seen=[...dlg.querySelectorAll('button')].filter(isVis).map(t).slice(0,10);
    if(b){ b.scrollIntoView({block:'center'}); b.click(); return {dialog:true, confirmed:t(b), seen}; }
    return {dialog:true, confirmed:null, seen};}, VIS);
  await page.waitForTimeout(8000);
  l = await getLine(LINE);
  R.orderReceive[step] = {...res, confirm, requestsNow:(l.part_requests||[]).map(r=>r.status),
    partsNow:(l.parts||[]).map(p=>p.part_number)};
  log('%s -> %s', step, JSON.stringify(R.orderReceive[step]).slice(0,320));
  save();
}

// ---- pick anything left, then complete
l = await getLine(LINE);
for (const r of (l.part_requests||[])){
  await call('POST','/api/work-orders/part/perform-request-status-action',
    {part_request_id:r.id, action:'pick', workOrderId:WO});
}
l = await getLine(LINE);
R.parts=(l.parts||[]).map(p=>({id:p.id,pn:p.part_number,qty:p.quantity}));
R.leftover=(l.part_requests||[]).map(r=>({id:r.id,status:r.status}));
R.complete = await call('POST','/api/work-orders/lines/change-status',{line_id:LINE, status:'complete', workOrderId:WO});
l = await getLine(LINE); R.lineStatus=l.status;
log('parts=%s leftover=%s complete->%s line=%s', JSON.stringify(R.parts), JSON.stringify(R.leftover),
  R.complete.status, R.lineStatus);
save();
if (!String(R.lineStatus||'').toLowerCase().startsWith('complet')){
  R.note='the special-order line could not be completed; clause 2 of C45251 is NOT observed';
  log(R.note); save(); await s.browser.close(); process.exit(0); }

// ---- read the modal for the special-order part
await load(); await ensureExpanded(LINE); await page.waitForTimeout(5000);
R.C45251_spo={};
for (const p of R.parts){
  const clicked = await page.evaluate(id=>{const b=document.querySelector(`[data-test-id="button_edit_part_${id}"]`);
    if(!b) return {found:false}; b.scrollIntoView({block:'center'});
    const row=b.closest('tr'); row&&row.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
    b.click(); return {found:true};}, p.id);
  if(!clicked.found){ R.C45251_spo[p.pn]={editControlPresent:false}; save(); continue; }
  await page.waitForTimeout(6000);
  await page.screenshot({path:`${DIR}/evidence/117-modal-${p.pn}.png`, fullPage:true});
  R.C45251_spo[p.pn] = await readModal();
  const f=R.C45251_spo[p.pn];
  log('SPO %s modal=%s', p.pn, f.modalOpen);
  for (const x of (f.fields||[])) log('    %-20s %-10s %s', x.label, x.editable?'EDITABLE':'read-only', JSON.stringify(x.value));
  save();
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop();
    const c=d&&[...d.querySelectorAll('button')].find(b=>/close|cancel|return/i.test(b.textContent||''));
    if(c) c.click();});
  await page.waitForTimeout(3000);
}
save();
await s.browser.close();
log('done');
