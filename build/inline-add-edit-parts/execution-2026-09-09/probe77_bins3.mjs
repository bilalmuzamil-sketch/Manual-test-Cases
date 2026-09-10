// Bin Allocation, third wave — the cases this branch's single-bin data state CAN still settle:
//   C45223 cl.1/3 auto-allocation when the Default bin covers, and when no single bin covers
//   C45231 cl.2 changing the quantity re-runs an automatic allocation
//   C45232 "Split across bins…" opens the Bin Locations modal for a Tech View user
//   C45233 that modal lists a row per bin with name, Default badge, on-hand and an allocation input,
//          plus an Auto action and an Apply action
//   C45234 Apply writes the split back and sets the quantity to the sum
//   C45235 a bin already at a negative quantity is shown in error styling and does not block
//   C45236 the Tech View EDIT row carries the same chip and picker as the add row
//   C45237 the allocation is stored on save and is not shown on the saved part row
//   C45238 the "Pulled from" chip is the last Tab stop (probe 74's attempt died clicking a
//          DISABLED description field — an inventory part's description is read-only, so the walk
//          starts from Qty here)
//   C45242 no switched-bin note when the Default bin covers the quantity
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const STOCKED='20047';        // one bin "Unassigned", 6 on hand
const NEGATIVE='POI5177C';    // one bin already at -1
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','tech'); const { page, APP } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/77-bins3.json`, JSON.stringify(R,null,1));
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4500);};
const pick=async(pn)=>{
  await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type(pn,{delay:100}); await page.waitForTimeout(6500);
  return page.evaluate(({vis,pn})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return {ok:false, why:'no menu'};
    const its=[...m.querySelectorAll('.q-item')].filter(isVis); if(!its.length) return {ok:false, why:'no items'};
    const i=its.findIndex(x=>t(x).includes(pn)); const target=its[i>=0?i:0];
    const label=t(target).slice(0,130); target.click(); return {ok:true, label};}, {vis:VIS, pn});
};
const chipInfo=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=document.querySelector('[data-test-id=button_pulled_from_bin]');
  if(!b) return {present:false};
  let box=b; for(let i=0;i<3&&box.parentElement;i++) box=box.parentElement;
  return {present:true, label:t(b).replace('expand_more','').trim(),
    line:(box.innerText||'').replace(/\s+/g,' ').trim().slice(0,220)};}, VIS);
const openPicker=async()=>{ await page.evaluate(()=>document.querySelector('[data-test-id=button_pulled_from_bin]')?.click());
  await page.waitForTimeout(3800); };
const pickerInfo=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu,.q-dialog')].filter(isVis).pop(); if(!m) return {open:false};
  return {open:true, items:[...m.querySelectorAll('.q-item')].filter(isVis).map(t), text:t(m).slice(0,300)};}, VIS);

// ===== C45223 cl.1 + C45242: the default bin covers the quantity =====
await fresh(); await openRow();
R.card = await pick(STOCKED); await page.waitForTimeout(5500);
await page.fill('[data-test-id=input_inline_part_quantity]','2'); await page.waitForTimeout(3000);
R.C45223_covers = await chipInfo();
R.C45242 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...new Set([...document.querySelectorAll('*')].filter(e=>e.children.length===0&&isVis(e)&&/switched to|default bin .* has/i.test(t(e))).map(t))];}, VIS);
log('C45223 cl.1 (qty 2 of 6):', JSON.stringify(R.C45223_covers));
log('C45242 switched-bin note present?', JSON.stringify(R.C45242));
await page.screenshot({path:`${DIR}/evidence/77-a-covers.png`, fullPage:true}); save();

// ===== C45231 cl.2: change the quantity, allocation re-runs =====
await page.fill('[data-test-id=input_inline_part_quantity]','5'); await page.waitForTimeout(3000);
R.C45231_qty5 = await chipInfo();
await page.fill('[data-test-id=input_inline_part_quantity]','50'); await page.waitForTimeout(3000);
R.C45231_qty50 = await chipInfo();
log('C45231 qty 5 -> %s', JSON.stringify(R.C45231_qty5));
log('C45231 qty 50 -> %s', JSON.stringify(R.C45231_qty50));
save();

// ===== C45223 cl.3: no single bin covers -> allocation stays on the Default bin =====
R.C45223_nocover = R.C45231_qty50;

// ===== C45238: the chip as the last Tab stop (start from Qty - the description is read-only) =====
await page.fill('[data-test-id=input_inline_part_quantity]','2'); await page.waitForTimeout(2500);
await page.click('[data-test-id=input_inline_part_quantity]');
const stops=[];
for (let i=0;i<6;i++){
  stops.push(await page.evaluate(()=>{const a=document.activeElement; const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const p=a&&a.closest('.q-field'); const l=p&&p.querySelector('.q-field__label');
    return {tid:a&&a.getAttribute&&a.getAttribute('data-test-id'), label:l?t(l):null, tag:a&&a.tagName, text:a?t(a).slice(0,26):null};}));
  await page.keyboard.press('Tab'); await page.waitForTimeout(700);
}
R.C45238 = stops;
log('C45238 tab stops from Qty:', JSON.stringify(stops));
await page.screenshot({path:`${DIR}/evidence/77-b-tab.png`, fullPage:true}); save();

// ===== C45232 + C45233: "Split across bins…" as a Tech View user =====
await openPicker();
R.pickerBefore = await pickerInfo();
R.splitClick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu,.q-dialog')].filter(isVis).pop(); if(!m) return 'no picker';
  const it=[...m.querySelectorAll('.q-item')].filter(isVis).find(x=>/split across bins/i.test(t(x)));
  if(!it) return 'no split action'; it.click(); return 'clicked';}, VIS);
await page.waitForTimeout(7000);
R.C45232 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {modal:false};
  return {modal:true, title:t(d.querySelector('.text-h6,.q-card__section')||d).slice(0,60),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(isVis).map(t),
    inputs:[...d.querySelectorAll('input')].filter(isVis).map(i=>({tid:i.getAttribute('data-test-id'), value:i.value})),
    rows:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,320),
    errorStyled:[...d.querySelectorAll('*')].filter(e=>/negative|error|text-red/i.test(String(e.className))).map(e=>t(e).slice(0,40)).slice(0,5)};}, VIS);
log('C45232/C45233 split modal:', JSON.stringify(R.C45232).slice(0,700));
await page.screenshot({path:`${DIR}/evidence/77-c-splitmodal.png`, fullPage:true}); save();

// ===== C45234: Apply =====
if (R.C45232.modal){
  R.applyClick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
    const b=[...d.querySelectorAll('button,.q-btn')].filter(isVis).find(x=>/^apply$/i.test(t(x)));
    if(!b) return 'no Apply'; b.click(); return 'clicked Apply';}, VIS);
  await page.waitForTimeout(5000);
  R.C45234 = { applyClick:R.applyClick, chip: await chipInfo(),
    qty: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_quantity]')?.value) };
  log('C45234 after Apply:', JSON.stringify(R.C45234));
  await page.screenshot({path:`${DIR}/evidence/77-d-applied.png`, fullPage:true}); save();
}

// ===== C45235: a bin already at a negative quantity =====
await fresh(); await openRow();
R.negCard = await pick(NEGATIVE); await page.waitForTimeout(5500);
await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(3000);
R.negChip = await chipInfo();
await openPicker();
R.negPicker = await pickerInfo();
R.C45235 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu,.q-dialog')].filter(isVis).pop(); if(!m) return {open:false};
  return {open:true, text:t(m).slice(0,240),
    styled:[...m.querySelectorAll('*')].filter(e=>/negative|error|text-red|warning|orange/i.test(String(e.className)))
      .map(e=>({cls:String(e.className).slice(0,50), txt:t(e).slice(0,30)})).slice(0,6)};}, VIS);
log('C45235 negative bin — chip=%s picker=%s', JSON.stringify(R.negChip), JSON.stringify(R.C45235).slice(0,400));
await page.screenshot({path:`${DIR}/evidence/77-e-negative.png`, fullPage:true}); save();
await page.keyboard.press('Escape'); await page.waitForTimeout(2000);

// ===== C45237: allocation stored on save, not shown on the saved row =====
await fresh(); await openRow();
await pick(STOCKED); await page.waitForTimeout(5500);
await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(2500);
R.beforeSaveChip = await chipInfo();
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(9000);
await fresh();
R.C45237 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const rows=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')].map(b=>{
    let box=b; for(let i=0;i<8&&box.parentElement;i++){box=box.parentElement; if((box.innerText||'').split('\n').length>1) break;}
    return (box.innerText||'').replace(/\s+/g,' ').trim().slice(0,110);}).slice(0,4);
  return {topRows:rows, anyPulledFrom:/pulled from/i.test(document.body.innerText||'')};}, VIS);
log('C45237 saved row shows a bin? %s', JSON.stringify(R.C45237));
await page.screenshot({path:`${DIR}/evidence/77-f-saved.png`, fullPage:true}); save();

// ===== C45236: the Tech View EDIT row carries the same allocation UI =====
R.editOpen = await page.evaluate(()=>{const e=document.querySelector('[data-test-id^=button_edit_part_]');
  if(!e) return 'no edit control'; e.scrollIntoView({block:'center'}); e.click(); return 'opened';});
await page.waitForTimeout(7000);
R.C45236 = { opened:R.editOpen, chip: await chipInfo() };
if (R.C45236.chip.present){ await openPicker(); R.C45236.picker = await pickerInfo(); await page.keyboard.press('Escape'); }
log('C45236 edit row allocation UI:', JSON.stringify(R.C45236).slice(0,450));
await page.screenshot({path:`${DIR}/evidence/77-g-editrow.png`, fullPage:true}); save();
await s.browser.close();
