// C45251 clause 2, settled two ways.
// probe126 found that the special-order part row on a COMPLETE line offers only a context menu with
// "Add Part Fee / Discount" — no `button_edit_part_*` anywhere on that page. Before that can be
// called a finding it needs (Rule 104):
//   (A) A POSITIVE CONTROL — the same look-up finding an edit control on an INVENTORY part on a
//       complete line, live, right now. Without it "no edit control" may just be my look-up.
//   (B) THE CASE'S OWN ROUTE — the case says "Click the part and try to edit each of ...". The row
//       exposes part_number_<id>, part_quantity_<id>, part_sell_price_<id> as cells, so clicking
//       those cells may be how a part is edited here. That must be tried before claiming anything.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/127-c45251-final.json`, JSON.stringify(R,null,1));
const SPO_WO='a1098c78-f74b-4c5d-a194-0aed46e86660';
const SPO_PART='b11e6d17-81c5-4779-9cfb-238e12bd0af6';
const INV_WO='6a529a5f-dff9-4c13-9636-b41500e585f0';       // has a complete line with an inventory part
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315','/workorders','admin');
const {page, APP, APIH} = s;
const call=(m,p)=>page.evaluate(async({api,m,p})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{Accept:'application/json'},credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j};},{api:APIH,m,p});
const openWo=async(id)=>{ await page.goto(`${APP}/workorders/${id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines '+id.slice(0,8)});
  await page.evaluate(()=>{for(const b of document.querySelectorAll('[data-test-id^=button_line_expand_]'))
    if(/expand_more/.test(b.textContent||'')) b.click();});
  await page.waitForTimeout(4500); };

// ---------- (A) POSITIVE CONTROL: an inventory part on a complete line, live ----------
const invLines = rowsOf((await call('GET',`/api/work-orders/lines/${INV_WO}`)).json);
const invComplete = invLines.filter(l=>String(l.status||'').toLowerCase().startsWith('complet') && (l.parts||[]).length);
R.control = {completeLinesWithParts: invComplete.map(l=>({line:l.line_id,
  parts:(l.parts||[]).map(p=>({id:p.id, pn:p.part_number}))}))};
log('control candidates: %s', JSON.stringify(R.control.completeLinesWithParts));
if (invComplete.length){
  await openWo(INV_WO);
  R.control.editIdsOnPage = await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_edit_part_]')]
    .map(e=>e.getAttribute('data-test-id')));
  const want = invComplete.flatMap(l=>(l.parts||[]).map(p=>`button_edit_part_${p.id}`));
  R.control.wanted = want;
  R.control.found = want.filter(w=>(R.control.editIdsOnPage||[]).includes(w));
  R.control.passed = R.control.found.length>0;
  await page.screenshot({path:`${DIR}/evidence/127-1-control.png`, fullPage:true});
  log('POSITIVE CONTROL — inventory part on a complete line has an edit control: %s', R.control.passed);
  log('   wanted %s | found %s', JSON.stringify(want), JSON.stringify(R.control.found));
} else { R.control.passed=false; R.control.note='no complete line with a part to use as a control'; }
save();

// ---------- (B) the case's own route on the special-order part ----------
await openWo(SPO_WO);
await page.screenshot({path:`${DIR}/evidence/127-2-spo-line.png`, fullPage:true});
R.spo = {editIdsOnPage: await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_edit_part_]')]
  .map(e=>e.getAttribute('data-test-id')))};
// click each part_* cell in turn and see whether it becomes editable, or opens anything
const cells = await page.evaluate(pid=>[...document.querySelectorAll('[data-test-id]')]
  .map(e=>e.getAttribute('data-test-id'))
  .filter(x=>x.includes(pid) && /^part_/.test(x)), SPO_PART);
R.spo.cells = cells;
log('cells on the special-order row: %s', JSON.stringify(cells));
R.spo.clicked={};
for (const c of cells){
  const before = await page.evaluate(()=>document.querySelectorAll('input,textarea').length);
  await page.evaluate(id=>{const e=document.querySelector(`[data-test-id="${id}"]`);
    if(e){ e.scrollIntoView({block:'center'});
      const r=e.closest('tr'); r&&r.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
      e.dispatchEvent(new MouseEvent('click',{bubbles:true})); e.click&&e.click(); }}, c);
  await page.waitForTimeout(3500);
  R.spo.clicked[c] = await page.evaluate(({vis,before})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
    return {newInputs: document.querySelectorAll('input,textarea').length - before,
      dialog: d? t(d).slice(0,150) : null,
      inlineRowOpen: !!document.querySelector('[data-test-id=input_inline_part_description]'),
      focusedEditable: (()=>{const a=document.activeElement;
        return a && /INPUT|TEXTAREA/.test(a.tagName) ? {tid:a.getAttribute('data-test-id'), readOnly:a.readOnly} : null;})()};},
    {vis:VIS, before});
  log('  clicked %-46s -> %s', c, JSON.stringify(R.spo.clicked[c]));
  save();
  await page.keyboard.press('Escape').catch(()=>{});
  await page.waitForTimeout(1200);
}
await page.screenshot({path:`${DIR}/evidence/127-3-spo-after-clicks.png`, fullPage:true});
R.verdictInputs = 'see spo.clicked — an editable field appearing on click is the edit route the case describes';
save();
await s.browser.close();
log('done');
