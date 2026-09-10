// What controls does a SPECIAL-ORDER part row actually offer on a COMPLETE line?
// probe125 found no `button_edit_part_<id>` and stopped rather than recording "there is no edit
// control" — Rule 104: a negative needs a positive control, and the inventory part DID have that
// button on a completed line, so the two must be compared before anything is claimed.
// This dumps the row: every test-id mentioning the part, every button before and after a real hover,
// and whatever the context menu holds.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/126-spo-row.json`, JSON.stringify(R,null,1));
const WO='a1098c78-f74b-4c5d-a194-0aed46e86660';
const LINE='868dd4b4-af46-43ed-a1bb-bf069cc31c49';
const PART='b11e6d17-81c5-4779-9cfb-238e12bd0af6';

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page} = s;
await settle(page,{label:'lines'});
R.expand = await page.evaluate(id=>{const b=document.querySelector(`[data-test-id="button_line_expand_${id}"]`);
  if(!b) return {found:false};
  const txt=(b.textContent||'').trim();
  if(/expand_more/.test(txt)){ b.scrollIntoView({block:'center'}); b.click(); return {found:true, clicked:true, was:txt}; }
  return {found:true, clicked:false, was:txt};}, LINE);
log('expand control: %s', JSON.stringify(R.expand));
await page.waitForTimeout(5000);
await page.screenshot({path:`${DIR}/evidence/126-1-line.png`, fullPage:true});

R.idsForPart = await page.evaluate(pid=>[...document.querySelectorAll('[data-test-id]')]
  .map(e=>e.getAttribute('data-test-id')).filter(x=>x.includes(pid)), PART);
R.allEditIds = await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_edit_part_]')]
  .map(e=>e.getAttribute('data-test-id')));
log('test-ids mentioning this part: %s', JSON.stringify(R.idsForPart));
log('every button_edit_part_* on the page: %s', JSON.stringify(R.allEditIds));
save();

// find the row that holds the part and hover it for real, then list its controls
R.row = await page.evaluate(({vis,pid})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  let row=null;
  for (const tr of [...document.querySelectorAll('tr')]){
    if ((tr.outerHTML||'').includes(pid)){ row=tr; break; } }
  if(!row) return {found:false};
  const before=[...row.querySelectorAll('button,[role=button]')].map(b=>({label:t(b), tid:b.getAttribute('data-test-id'), visible:isVis(b)}));
  row.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
  row.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}));
  return {found:true, text:t(row).slice(0,180), before};},{vis:VIS,pid:PART});
await page.waitForTimeout(2500);
R.rowAfterHover = await page.evaluate(({vis,pid})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  let row=null;
  for (const tr of [...document.querySelectorAll('tr')]){ if ((tr.outerHTML||'').includes(pid)){ row=tr; break; } }
  if(!row) return {found:false};
  return {found:true, buttons:[...row.querySelectorAll('button,[role=button]')]
    .map(b=>({label:t(b), tid:b.getAttribute('data-test-id'), visible:isVis(b)}))};},{vis:VIS,pid:PART});
log('row: %s', JSON.stringify(R.row).slice(0,400));
log('row after a real hover: %s', JSON.stringify(R.rowAfterHover).slice(0,500));
await page.screenshot({path:`${DIR}/evidence/126-2-hovered.png`, fullPage:true});
save();

// the context menu is the other route a part row offers
const ctxId = (R.idsForPart||[]).find(x=>/context_menu/.test(x));
if (ctxId){
  await page.evaluate(id=>{const b=document.querySelector(`[data-test-id="${id}"]`);
    if(b){b.scrollIntoView({block:'center'}); b.click();}}, ctxId);
  await page.waitForTimeout(4000);
  R.contextMenu = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop();
    if(!m) return {open:false};
    return {open:true, items:[...m.querySelectorAll('.q-item,[role=menuitem]')].filter(isVis)
      .map(e=>({label:t(e), tid:e.getAttribute('data-test-id')}))};}, VIS);
  log('context menu (%s): %s', ctxId, JSON.stringify(R.contextMenu));
  await page.screenshot({path:`${DIR}/evidence/126-3-contextmenu.png`, fullPage:true});
  // if it offers an edit, take it and read the window
  const edit=(R.contextMenu.items||[]).find(i=>/edit/i.test(i.label));
  if (edit){
    await page.evaluate(lbl=>{const m=[...document.querySelectorAll('.q-menu')].pop();
      const it=[...m.querySelectorAll('.q-item,[role=menuitem]')].find(e=>(e.textContent||'').trim().includes(lbl));
      if(it) it.click();}, edit.label);
    await settle(page,{label:'edit window'});
    R.editWindow = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
      if(!d) return {open:false};
      const ro=(f,i)=>{ if (f && (f.classList.contains('q-field--disabled')||f.classList.contains('q-field--readonly'))) return true;
        if (i) return !!(i.readOnly||i.disabled||i.getAttribute('aria-disabled')==='true'); return true; };
      return {open:true, fields:[...d.querySelectorAll('.q-field')].filter(isVis).map(f=>{
        const lb=f.querySelector('.q-field__label'); const i=f.querySelector('input,select,textarea');
        return {label: lb? t(lb): t(f).slice(0,20),
          value: i? (i.value||'').slice(0,28) : t(f.querySelector('.q-field__native')||f).slice(0,28),
          editable: !ro(f,i)};}).filter(x=>x.label),
        buttons:[...d.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,10)};}, VIS);
    log('the edit window: open=%s', R.editWindow.open);
    for (const f of (R.editWindow.fields||[]))
      log('    %-16s %-10s %s', f.label, f.editable?'EDITABLE':'read-only', JSON.stringify(f.value));
    await page.screenshot({path:`${DIR}/evidence/126-4-editwindow.png`, fullPage:true});
  }
}
save();
await s.browser.close();
log('done');
