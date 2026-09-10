// C45251 — which part fields a COMPLETE line lets you edit.
// probe113 built the line and reached Complete, but read nothing: clicking the edit control on a
// completed line's part does NOT open the inline row (`button_save_inline_part` is absent) — it
// opens the **Edit Part** modal. Its own toast text gave the modal away:
//   "Edit Part close | Part number | Description | Source Inventory | Category HD-Fasteners |
//    Vendor | $Cost | $Core charge | $Sell price | Margin% | Inventory Bin name Quantity in stock
//    Amount | General Storage Default 3 | Show all bins | Return | Save & close"
// So the case's six fields are read from the MODAL, and editability is judged per control.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/115-c45251.json`, JSON.stringify(R,null,1));
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

await page.waitForTimeout(9000);
// probe113's own Add Part test uncompleted the line, so put it back to Complete before reading
const LINE='cd8c3e17-27da-49cd-8a89-21931d12b893';
let l = await getLine(LINE);
R.lineAtStart = {status:l.status, parts:(l.parts||[]).map(p=>({id:p.id,pn:p.part_number,qty:p.quantity})),
  requests:(l.part_requests||[]).map(r=>({id:r.id,status:r.status,qty:r.quantity}))};
log('line at start: %s', JSON.stringify(R.lineAtStart));
// clear anything unfulfilled, or Complete will be refused
R.clear={};
for (const r of (l.part_requests||[])){
  const x = await call('POST','/api/work-orders/part/perform-request-status-action',
    {part_request_id:r.id, action:'pick', workOrderId:WO});
  R.clear[r.id]={from:r.status, http:x.status, text:x.text.slice(0,160)};
}
R.recomplete = await call('POST','/api/work-orders/lines/change-status',{line_id:LINE, status:'complete', workOrderId:WO});
l = await getLine(LINE);
R.lineStatus = l.status;
R.parts = (l.parts||[]).map(p=>({id:p.id, pn:p.part_number, qty:p.quantity}));
log('line is %s with parts %s', R.lineStatus, JSON.stringify(R.parts));
save();
if (!String(R.lineStatus||'').toLowerCase().startsWith('complet')){
  R.note='the line is not Complete, so NOTHING is reported as observed for C45251';
  log(R.note); save(); await s.browser.close(); process.exit(0);
}

await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(10000);
// lines render EXPANDED — only click the toggle if it says expand_more (L0036)
await page.evaluate(id=>{const b=document.querySelector(`[data-test-id="button_line_expand_${id}"]`);
  if(b && /expand_more/.test((b.textContent||''))){ b.scrollIntoView({block:'center'}); b.click(); }}, LINE);
await page.waitForTimeout(5000);
await page.screenshot({path:`${DIR}/evidence/115-1-complete-line.png`, fullPage:true});

R.C45251={};
for (const p of R.parts){
  const clicked = await page.evaluate(id=>{const b=document.querySelector(`[data-test-id="button_edit_part_${id}"]`);
    if(!b) return {found:false}; b.scrollIntoView({block:'center'});
    const row=b.closest('tr'); row&&row.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
    b.click(); return {found:true};}, p.id);
  if(!clicked.found){ R.C45251[p.pn]={editControlPresent:false}; save(); continue; }
  await page.waitForTimeout(6000);
  await page.screenshot({path:`${DIR}/evidence/115-2-modal-${p.pn}.png`, fullPage:true});
  R.C45251[p.pn] = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const dlg=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
    if(!dlg) return {modalOpen:false, note:'no dialog appeared after clicking the edit control'};
    const ro=(i)=>{const f=i.closest('.q-field');
      return !!(i.readOnly||i.disabled||i.getAttribute('aria-disabled')==='true'
        ||(f&&(f.classList.contains('q-field--disabled')||f.classList.contains('q-field--readonly'))));};
    return {modalOpen:true, heading:t(dlg.querySelector('.text-h6,h5,h6')||{}) ,
      buttons:[...dlg.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,12),
      fields:[...dlg.querySelectorAll('input,select,textarea')].filter(isVis).map(i=>{
        const f=i.closest('.q-field'); const lb=f&&f.querySelector('.q-field__label');
        return {label: lb? t(lb) : (i.getAttribute('aria-label')||i.getAttribute('data-test-id')||i.name||i.placeholder||''),
          value:(i.value||'').slice(0,40), readOnly:ro(i), editable:!ro(i)};})};}, VIS);
  const f=R.C45251[p.pn];
  log('C45251 %s modal=%s', p.pn, f.modalOpen);
  for (const x of (f.fields||[])) log('    %-18s %-12s %s', x.label, x.editable?'EDITABLE':'read-only', JSON.stringify(x.value));
  save();
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop();
    const c=d&&[...d.querySelectorAll('button')].find(b=>/close|cancel|return/i.test(b.textContent||''));
    if(c) c.click(); else document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));});
  await page.waitForTimeout(3000);
}
save();
await s.browser.close();
log('done');
