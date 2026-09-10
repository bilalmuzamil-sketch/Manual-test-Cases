// C45251 — which part fields a COMPLETE line lets you edit. On a fresh line of its own.
//
// Why a fresh line: C45250's check (probe113) deliberately added a part to the completed line to
// prove the line uncompletes itself, and that part's request sits at `authorized_to_order`. There
// is no way back from there — `pick` moves it to `waiting_to_receive`, and a line refuses Complete
// while any request is unfulfilled. So that line can never be re-completed. Rather than fight it,
// this builds a clean one with the recipe probe113 proved:
//     new line (canned line) -> authorize -> add an inventory part -> pick -> complete
// and then reads the EDIT PART MODAL, which is what a completed line's edit control opens (the
// inline row is not used there — probe113 found no button_save_inline_part).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/116-c45251.json`, JSON.stringify(R,null,1));
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
// lines render EXPANDED; clicking the toggle on an open line CLOSES it and removes its Add Part row
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
  if(!r.el) return {clicked:false, found:r.found, tableFound:r.tableFound};
  r.el.scrollIntoView({block:'center'}); r.el.click();
  return {clicked:true, found:true, visible:r.visible};},{vis:VIS,lineId,fn:addPartRowFor});

await page.waitForTimeout(9000);
const before = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).map(l=>l.line_id);

// ---- build the line
R.openForm = await clickText(/^\+?\s*new\s+line$/);
await page.waitForTimeout(6000);
R.canned = await (async ()=>{
  const opened = await page.evaluate(t=>{const i=document.querySelector(`[data-test-id="${t}"]`);
    if(!i) return false; i.scrollIntoView({block:'center'});
    (i.closest('.q-field')||i).dispatchEvent(new MouseEvent('click',{bubbles:true}));
    i.dispatchEvent(new MouseEvent('click',{bubbles:true})); i.focus(); return true;},'select_line_canned_line');
  if(!opened) return {opened:false};
  await page.waitForTimeout(3000);
  return await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const opts=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
    if(!opts.length) return {opened:true, chose:false};
    const zero=opts.find(o=>/total parts:\s*0\b/i.test(t(o))); const target=zero||opts[0];
    const label=t(target); target.click(); return {opened:true, chose:true, zeroParts:!!zero, label:label.slice(0,70)};}, VIS);
})();
await page.waitForTimeout(2500);
await setVal('input_time_estimate','1'); await setVal('input_tech_time','1');
await page.waitForTimeout(1500);
R.saveLine = await clickText(/save\s*&\s*close/);
await page.waitForTimeout(9000);
const LINE = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json)
  .map(l=>l.line_id).find(x=>!before.includes(x)) || null;
R.line=LINE;
if(!LINE){ R.fatal='no line was created'; save(); await s.browser.close(); process.exit(0); }
log('line %s created (%s)', LINE, R.canned.label);
R.authorize = await call('POST','/api/work-orders/lines/change-status',{line_id:LINE, status:'authorized', workOrderId:WO});
log('authorize -> %s', R.authorize.status); save();

// ---- add the inventory part, pick it, complete the line
await load(); await ensureExpanded(LINE); await page.waitForTimeout(4000);
R.addPart = await clickAddPart(LINE);
log('Add Part: %s', JSON.stringify(R.addPart));
if(!R.addPart.clicked){ R.fatal='could not open this line\'s add row'; save(); await s.browser.close(); process.exit(0); }
await page.waitForTimeout(6000);
await setVal('select_inline_part_number','F40010212');
await page.waitForTimeout(6000);
R.typeahead = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const opts=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
  const stocked=opts.find(o=>/inventory qty/i.test(t(o)));
  if(stocked){ const label=t(stocked).slice(0,100); stocked.click(); return {chose:'stocked', label}; }
  if(opts.length){ const label=t(opts[0]).slice(0,100); opts[0].click(); return {chose:'first', label}; }
  return {chose:null};}, VIS);
await page.waitForTimeout(4000);
await setVal('input_inline_part_quantity','5');
await setVal('input_inline_part_cost','12'); await setVal('input_inline_part_sell_price','24');
await page.waitForTimeout(2000);
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]');
  if(b){b.scrollIntoView({block:'center'}); b.click();}});
await page.waitForTimeout(9000);
let l = await getLine(LINE);
R.picks={};
for (const r of (l.part_requests||[])){
  const x = await call('POST','/api/work-orders/part/perform-request-status-action',
    {part_request_id:r.id, action:'pick', workOrderId:WO});
  R.picks[r.id]={from:r.status, http:x.status};
}
l = await getLine(LINE);
R.parts=(l.parts||[]).map(p=>({id:p.id,pn:p.part_number,qty:p.quantity}));
R.leftoverRequests=(l.part_requests||[]).map(r=>({id:r.id,status:r.status}));
R.complete = await call('POST','/api/work-orders/lines/change-status',{line_id:LINE, status:'complete', workOrderId:WO});
l = await getLine(LINE); R.lineStatus=l.status;
log('parts=%s leftover=%s | complete -> %s | line is %s', JSON.stringify(R.parts),
  JSON.stringify(R.leftoverRequests), R.complete.status, R.lineStatus);
save();
if (!String(R.lineStatus||'').toLowerCase().startsWith('complet')){
  R.note='the line is not Complete, so NOTHING is reported as observed for C45251';
  log(R.note); save(); await s.browser.close(); process.exit(0); }

// ---- read the Edit Part modal on the completed line
await load(); await ensureExpanded(LINE); await page.waitForTimeout(5000);
await page.screenshot({path:`${DIR}/evidence/116-1-complete-line.png`, fullPage:true});
R.C45251={};
for (const p of R.parts){
  const clicked = await page.evaluate(id=>{const b=document.querySelector(`[data-test-id="button_edit_part_${id}"]`);
    if(!b) return {found:false}; b.scrollIntoView({block:'center'});
    const row=b.closest('tr'); row&&row.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
    b.click(); return {found:true};}, p.id);
  if(!clicked.found){ R.C45251[p.pn]={editControlPresent:false}; save(); continue; }
  await page.waitForTimeout(6000);
  await page.screenshot({path:`${DIR}/evidence/116-2-modal-${p.pn}.png`, fullPage:true});
  R.C45251[p.pn] = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const dlg=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
    if(!dlg) return {modalOpen:false, note:'no dialog appeared'};
    const ro=(i)=>{const f=i.closest('.q-field');
      return !!(i.readOnly||i.disabled||i.getAttribute('aria-disabled')==='true'
        ||(f&&(f.classList.contains('q-field--disabled')||f.classList.contains('q-field--readonly'))));};
    return {modalOpen:true,
      buttons:[...dlg.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,12),
      fields:[...dlg.querySelectorAll('input,select,textarea')].filter(isVis).map(i=>{
        const f=i.closest('.q-field'); const lb=f&&f.querySelector('.q-field__label');
        return {label: lb? t(lb) : (i.getAttribute('aria-label')||i.getAttribute('data-test-id')||i.name||i.placeholder||''),
          value:(i.value||'').slice(0,40), editable:!ro(i)};})};}, VIS);
  const f=R.C45251[p.pn];
  log('C45251 %s modal=%s', p.pn, f.modalOpen);
  for (const x of (f.fields||[])) log('    %-20s %-10s %s', x.label, x.editable?'EDITABLE':'read-only', JSON.stringify(x.value));
  save();
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop();
    const c=d&&[...d.querySelectorAll('button')].find(b=>/close|cancel|return/i.test(b.textContent||''));
    if(c) c.click(); else document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));});
  await page.waitForTimeout(3000);
}
save();
await s.browser.close();
log('done');
