// C45251 clause 2 — the special-order part's editable fields on a COMPLETE line.
// The edit route is CLICKING THE PART NUMBER (`part_number_<partId>`), which opens the Edit Part
// window. There is no `button_edit_part_*` for a received special-order part, and twice I nearly
// wrote that up as "no edit control" — it is the same wrong-locator mistake as the rest of today.
// The case says it plainly: "Click the part and try to edit each of ...".
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/128-spo-fields.json`, JSON.stringify(R,null,1));
const WO='a1098c78-f74b-4c5d-a194-0aed46e86660';
const PART='b11e6d17-81c5-4779-9cfb-238e12bd0af6';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page, APIH} = s;
const call=(m,p)=>page.evaluate(async({api,m,p})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{Accept:'application/json'},credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j};},{api:APIH,m,p});
await settle(page,{label:'lines'});
const l = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json)[0]||{};
R.lineStatus = l.status;
R.parts = (l.parts||[]).map(p=>({id:p.id, pn:p.part_number, qty:p.quantity}));
log('line is %s with parts %s', R.lineStatus, JSON.stringify(R.parts));
if (!String(R.lineStatus||'').toLowerCase().startsWith('complet')){
  R.note='the line is NOT complete — nothing is reported as observed'; log(R.note); save();
  await s.browser.close(); process.exit(0); }

await page.evaluate(id=>{const e=document.querySelector(`[data-test-id="part_number_${id}"]`);
  if(e){ e.scrollIntoView({block:'center'}); e.dispatchEvent(new MouseEvent('click',{bubbles:true})); e.click&&e.click(); }}, PART);
await settle(page,{label:'edit window'});
await page.screenshot({path:`${DIR}/evidence/128-1-edit-window.png`, fullPage:true});
R.window = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(!d) return {open:false};
  const ro=(f,i)=>{ if (f && (f.classList.contains('q-field--disabled')||f.classList.contains('q-field--readonly'))) return true;
    if (i) return !!(i.readOnly||i.disabled||i.getAttribute('aria-disabled')==='true'); return true; };
  return {open:true, heading:t(d.querySelector('.text-h6,h5,h6')||{}).slice(0,40),
    fields:[...d.querySelectorAll('.q-field')].filter(isVis).map(f=>{
      const lb=f.querySelector('.q-field__label'); const i=f.querySelector('input,select,textarea');
      return {label: lb? t(lb): t(f).slice(0,22),
        value: i? (i.value||'').slice(0,30) : t(f.querySelector('.q-field__native')||f).slice(0,30),
        editable: !ro(f,i)};}).filter(x=>x.label),
    buttons:[...d.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,10)};}, VIS);
log('Edit Part window open=%s', R.window.open);
for (const f of (R.window.fields||[]))
  log('    %-16s %-10s %s', f.label, f.editable?'EDITABLE':'read-only', JSON.stringify(f.value));
const ed=(R.window.fields||[]).filter(f=>f.editable).map(f=>f.label);
const ro=(R.window.fields||[]).filter(f=>!f.editable).map(f=>f.label);
R.editable=ed; R.readOnly=ro;
R.clause2Expected=['Description','Category','Sell price','Margin'];
log('EDITABLE: %s', JSON.stringify(ed));
log('READ-ONLY: %s', JSON.stringify(ro));
save();
await s.browser.close();
log('done');
