// C45251 clause 2 — a SPECIAL ORDER part on a COMPLETE line: only Description, Category, Sell Price
// and Margin should be editable.
// The part is now ON the line: added with Source = Vendor, ordered, and received with an invoice
// number (POST /api/orders/receive-requested-parts). All that remains is to complete the line and
// read the part's fields.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/125-c45251-spo.json`, JSON.stringify(R,null,1));
const WO='a1098c78-f74b-4c5d-a194-0aed46e86660';
const LINE='868dd4b4-af46-43ed-a1bb-bf069cc31c49';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page, APP, APIH} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:t.slice(0,300)};},{api:APIH,m,p,b:b||null});
const getLine=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).find(x=>x.line_id===LINE)||{};

await settle(page,{label:'work order lines'});
let l = await getLine();
R.before={status:l.status, reqs:(l.part_requests||[]).length,
  parts:(l.parts||[]).map(p=>({id:p.id, pn:p.part_number, qty:p.quantity, type:p.part_type||p.source}))};
log('before: %s', JSON.stringify(R.before)); save();

// complete the line — through the app's own control first, falling back to the status call
R.completeClick = await page.evaluate(id=>{
  const b=document.querySelector(`[data-test-id="button_action_complete_line_${id}"]`);
  if(!b) return {found:false}; b.scrollIntoView({block:'center'}); b.click(); return {found:true};}, LINE);
await settle(page,{label:'after Complete'});
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return;
  const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>/^(complete|yes|confirm|ok)$/i.test(t(e)));
  if(b) b.click();}, VIS);
await settle(page,{label:'after confirm'});
l = await getLine();
if (!String(l.status||'').toLowerCase().startsWith('complet')){
  R.completeApi = await call('POST','/api/work-orders/lines/change-status',{line_id:LINE, status:'complete', workOrderId:WO});
  l = await getLine();
}
R.lineStatus=l.status;
R.parts=(l.parts||[]).map(p=>({id:p.id, pn:p.part_number, qty:p.quantity}));
log('line is now %s with parts %s', R.lineStatus, JSON.stringify(R.parts)); save();
if (!String(R.lineStatus||'').toLowerCase().startsWith('complet')){
  R.note='the line did not reach Complete; clause 2 is NOT observed'; log(R.note); save();
  await s.browser.close(); process.exit(0); }

await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'reloaded'});
await page.evaluate(id=>{const b=document.querySelector(`[data-test-id="button_line_expand_${id}"]`);
  if(b && /expand_more/.test(b.textContent||'')){ b.scrollIntoView({block:'center'}); b.click(); }}, LINE);
await page.waitForTimeout(4000);
await page.screenshot({path:`${DIR}/evidence/125-1-complete-line.png`, fullPage:true});

R.C45251_spo={};
for (const p of R.parts){
  const clicked = await page.evaluate(id=>{const b=document.querySelector(`[data-test-id="button_edit_part_${id}"]`);
    if(!b) return {found:false}; b.scrollIntoView({block:'center'});
    const row=b.closest('tr'); row&&row.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
    b.click(); return {found:true};}, p.id);
  if(!clicked.found){ R.C45251_spo[p.pn]={editControlPresent:false}; save(); continue; }
  await settle(page,{label:'edit window'});
  await page.screenshot({path:`${DIR}/evidence/125-2-modal-${String(p.pn).replace(/[^\w.-]/g,'_')}.png`, fullPage:true});
  R.C45251_spo[p.pn] = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
    if(!d) return {modalOpen:false};
    const ro=(f,i)=>{ if (f && (f.classList.contains('q-field--disabled')||f.classList.contains('q-field--readonly'))) return true;
      if (i) return !!(i.readOnly||i.disabled||i.getAttribute('aria-disabled')==='true'); return true; };
    return {modalOpen:true,
      fields:[...d.querySelectorAll('.q-field')].filter(isVis).map(f=>{
        const lb=f.querySelector('.q-field__label'); const i=f.querySelector('input,select,textarea');
        return {label: lb? t(lb): t(f).slice(0,22),
          value: i? (i.value||'').slice(0,30) : t(f.querySelector('.q-field__native')||f).slice(0,30),
          editable: !ro(f,i)};}).filter(x=>x.label),
      buttons:[...d.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,10)};}, VIS);
  const f=R.C45251_spo[p.pn];
  log('SPO part %s — window open: %s', p.pn, f.modalOpen);
  for (const x of (f.fields||[])) log('    %-16s %-10s %s', x.label, x.editable?'EDITABLE':'read-only', JSON.stringify(x.value));
  save();
  await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop();
    const c=d&&[...d.querySelectorAll('button')].find(b=>/close|cancel|return/i.test(b.textContent||''));
    if(c) c.click();});
  await page.waitForTimeout(2500);
}
save();
await s.browser.close();
log('done');
