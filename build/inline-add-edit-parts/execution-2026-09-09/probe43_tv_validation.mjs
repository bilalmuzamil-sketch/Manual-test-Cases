// Tech View: validation + typeahead + first save. C45015 C45016 C45017 C45018 C44999 C45000
// C45001(a) C45004 C45005 C45006 C45013.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','tech'); const { page, APP } = s;
const R={};
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(6000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4000);};
const msgs=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...new Set([...document.querySelectorAll('.q-field__messages,.text-negative,[role=alert],.q-notification')]
    .filter(isVis).map(t).filter(Boolean))].filter(m=>!/Credit Hold|Build Lines|location_on|^\$/.test(m));}, VIS);
const focusInfo=()=>page.evaluate(()=>{const a=document.activeElement; if(!a) return null;
  const p=a.closest('.q-field'); const l=p&&p.querySelector('.q-field__label');
  return {tid:a.getAttribute&&a.getAttribute('data-test-id'), label:l?l.textContent.trim():null, tag:a.tagName};});
const errFields=()=>page.evaluate(()=>[...document.querySelectorAll('.q-field--error')].map(f=>{
  const l=f.querySelector('.q-field__label'); const i=f.querySelector('input');
  return {label:l?l.textContent.trim():null, tid:i?i.getAttribute('data-test-id'):null};}));
const partCount=()=>page.evaluate(()=>document.querySelectorAll('[data-test-id^=button_edit_part_]').length);
const topRows=()=>page.evaluate(()=>{const rows=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')].map(b=>{
  let box=b; for(let i=0;i<8&&box.parentElement;i++){box=box.parentElement; if(box.getAttribute('role')==='row'||/tr/i.test(box.tagName)) break;}
  return (box.innerText||'').replace(/\s+/g,' ').trim().slice(0,120);}); return rows.slice(0,4);});

// ============ 1. validation: empty row =================================
await fresh(); await openRow();
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(4000);
R.emptySave = { messages: await msgs(), focus: await focusInfo(), errFields: await errFields(),
  rowOpen: await page.evaluate(()=>!!document.querySelector('[data-test-id=input_inline_part_description]')) };
log('C45015/C45017 empty save:', JSON.stringify(R.emptySave));
await page.screenshot({path:`${DIR}/evidence/43-a-emptysave.png`, fullPage:true});

// C45018: correcting the field clears the message
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST tv validation');
await page.waitForTimeout(2500);
R.afterDesc = { messages: await msgs(), errFields: await errFields() };
log('C45018 after typing description:', JSON.stringify(R.afterDesc));

// C45015 clause 2: description present, qty missing
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(4000);
R.qtyMissing = { messages: await msgs(), focus: await focusInfo(), errFields: await errFields() };
log('C45015b qty missing:', JSON.stringify(R.qtyMissing));

// C45016: qty 0 then negative
await page.fill('[data-test-id=input_inline_part_quantity]','0');
await page.waitForTimeout(800);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(4000);
R.qtyZero = { messages: await msgs(), value: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_quantity]')?.value) };
log('C45016 qty=0:', JSON.stringify(R.qtyZero));
await page.fill('[data-test-id=input_inline_part_quantity]','-3');
await page.waitForTimeout(800);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(4000);
R.qtyNeg = { messages: await msgs(), value: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_quantity]')?.value) };
log('C45016 qty=-3:', JSON.stringify(R.qtyNeg));
// C45018 second half: correcting quantity clears the message
await page.fill('[data-test-id=input_inline_part_quantity]','2');
await page.waitForTimeout(2500);
R.afterQty = { messages: await msgs(), errFields: await errFields() };
log('C45018 after correcting qty:', JSON.stringify(R.afterQty));
await page.screenshot({path:`${DIR}/evidence/43-b-validation.png`, fullPage:true});

// ============ 2. C45004/C45005/C45006/C45013 save with no part number ==
const before = await partCount();
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(7000);
R.saveNoPN = { before, after: await partCount(),
  toast: await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS),
  newRowOpen: await page.evaluate(()=>!!document.querySelector('[data-test-id=input_inline_part_description]')),
  newRowValue: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_description]')?.value),
  focus: await focusInfo(), topRows: await topRows() };
log('C45004/45005/45006 save-no-partnumber:', JSON.stringify(R.saveNoPN));
await page.screenshot({path:`${DIR}/evidence/43-c-saved.png`, fullPage:true});

// ============ 3. C44999 / C45000 / C45001a typeahead ===================
await fresh(); await openRow();
await page.fill('[data-test-id=input_inline_part_description]','MY OWN TYPED TEXT');
await page.click('[data-test-id=select_inline_part_number]');
await page.keyboard.type('OIL', {delay:110});
await page.waitForTimeout(6000);
R.typeahead = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const menu=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop();
  if(!menu) return {menu:false};
  const items=[...menu.querySelectorAll('.q-item')].filter(isVis).map(t);
  return {menu:true, count:items.length, items:items.slice(0,6)};}, VIS);
log('C44999 typeahead:', JSON.stringify(R.typeahead));
await page.screenshot({path:`${DIR}/evidence/43-d-typeahead.png`, fullPage:true});
if (R.typeahead.menu && R.typeahead.count){
  await page.evaluate(vis=>{const isVis=eval(vis);
    const menu=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop();
    const it=[...menu.querySelectorAll('.q-item')].filter(isVis)[0]; it.click();}, VIS);
  await page.waitForTimeout(6000);
  R.afterSelect = { desc: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_description]')?.value),
    pn: await page.evaluate(()=>{const e=document.querySelector('[data-test-id=select_inline_part_number]'); return e? (e.value||e.innerText||'').trim() : null;}),
    focus: await focusInfo(),
    descReadOnly: await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]'); return d? (d.readOnly||d.disabled||d.getAttribute('readonly')!==null):null;}) };
  log('C45000 after select:', JSON.stringify(R.afterSelect));
  // C45001a: can the catalog description be overwritten?
  await page.fill('[data-test-id=input_inline_part_description]','EDITED CATALOG DESCRIPTION');
  await page.waitForTimeout(1500);
  R.descEdit = await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_description]')?.value);
  log('C45001a description after edit:', JSON.stringify(R.descEdit));
  await page.screenshot({path:`${DIR}/evidence/43-e-afterselect.png`, fullPage:true});
}
fs.writeFileSync(`${DIR}/evidence/43-tv.json`, JSON.stringify(R,null,1));
await s.browser.close();
