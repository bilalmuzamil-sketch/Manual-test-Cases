// Bin Allocation, second wave. Probe 66 established the shape; these are the gaps it left:
//   C45221 name + on-hand + EXACTLY ONE Default, across several stocked parts
//   C45222 cl.3 / C45239 / C45240 — a part that really is not stocked. Probe 66's "no bins" bucket
//          picked 51372MP, whose card in fact reads "Inventory Qty: 2 EA Unassigned 2": the bins
//          were missing from the broad-search payload, not from the part. A **Catalog** part (from
//          catalogue-parts-that-are-not-on-location) is the genuine not-stocked case.
//   C45238 the "Pulled from" chip as the last Tab stop
//   C45229/C45228 a short allocation: ask for more than the bin holds
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','tech'); const { page, APP, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/74-bins2.json`, JSON.stringify(R,null,1));
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4500);};
const chip=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=document.querySelector('[data-test-id=button_pulled_from_bin]');
  if(!b) return {present:false, pulledFromText:(()=>{const n=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&isVis(e)&&/pulled from|not stocked/i.test(t(e)))[0]; return n?t(n):null;})()};
  let box=b; for(let i=0;i<3&&box.parentElement;i++) box=box.parentElement;
  return {present:true, label:t(b).replace(/expand_more/,'').trim(),
    cls:String(b.className).slice(0,110),
    warnStyled:/warning|negative|orange|amber|text-red/i.test(String(b.className)+String(b.parentElement?.className||'')),
    near:(box.innerText||'').replace(/\s+/g,' ').trim().slice(0,240)};}, VIS);
const pick=async(term)=>{
  await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type(term,{delay:100}); await page.waitForTimeout(6500);
  return page.evaluate(({vis,term})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return {ok:false, why:'no menu'};
    const its=[...m.querySelectorAll('.q-item')].filter(isVis); if(!its.length) return {ok:false, why:'no items'};
    const i=its.findIndex(x=>t(x).includes(term));
    const target=its[i>=0?i:0]; const label=t(target).slice(0,130); target.click(); return {ok:true, label};}, {vis:VIS, term});
};
// ---- C45221 across several stocked parts, straight from the payload
R.C45221 = await page.evaluate(async ({api})=>{
  const pickRows=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
    if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pickRows(o[k]); if (v&&v.length) return v; } return []; };
  const out=[];
  for (const q of ['20047','TPWK71-148-00','HDEO13','POI5177C','A4731800909']){
    const r=await fetch(`https://${api}/api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts?pagination[rowsPerPage]=25&pagination[page]=1&search=${encodeURIComponent(q)}`,
      {headers:{Accept:'application/json'}, credentials:'include'});
    if(!r.ok) continue;
    const hit=pickRows(await r.json()).find(x=>String(x.part_number||'').toUpperCase()===q.toUpperCase());
    if(!hit) continue;
    const b=hit.binLocations||[];
    out.push({pn:hit.part_number, nbins:b.length, defaults:b.filter(x=>x.isDefault).length,
      everyBinNamed:b.every(x=>typeof x.name==='string' && x.name.length>0),
      everyBinHasQty:b.every(x=>x.quantity!==undefined && x.quantity!==null),
      bins:b.map(x=>({name:x.name, quantity:x.quantity, isDefault:x.isDefault}))});
  }
  return out;}, {api:APIH});
log('C45221:', JSON.stringify(R.C45221));
save();
// ---- a genuinely not-stocked part
R.catalogPn = await page.evaluate(async ({api})=>{
  const pickRows=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
    if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pickRows(o[k]); if (v&&v.length) return v; } return []; };
  const r=await fetch(`https://${api}/api/parts-catalogue/catalogue-parts-that-are-not-on-location?pagination[rowsPerPage]=10&pagination[page]=1`,
    {headers:{Accept:'application/json'}, credentials:'include'});
  const rows=pickRows(await r.json());
  return rows.length? (rows[0].partNumber||rows[0].part_number) : null;}, {api:APIH});
log('a part with no inventory record:', R.catalogPn);
if (R.catalogPn){
  await fresh(); await openRow();
  R.notStockedCard = await pick(R.catalogPn);
  await page.waitForTimeout(5500);
  await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(2500);
  R.notStockedChip = await chip();
  log('C45222 cl.3 / C45239 — card=%s', JSON.stringify(R.notStockedCard.label));
  log('   chip:', JSON.stringify(R.notStockedChip));
  await page.screenshot({path:`${DIR}/evidence/74-a-notstocked.png`, fullPage:true});
  save();
}
// ---- C45240 free-typed
await fresh(); await openRow();
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST bins freetyped');
await page.fill('[data-test-id=input_inline_part_quantity]','2'); await page.waitForTimeout(2500);
R.freeTyped = await chip();
log('C45240 free-typed chip:', JSON.stringify(R.freeTyped));
await page.screenshot({path:`${DIR}/evidence/74-b-freetyped.png`, fullPage:true});
save();
// ---- C45228 / C45229 ask for more than the bin holds (20047 has 6)
await fresh(); await openRow();
R.shortCard = await pick('20047'); await page.waitForTimeout(5500);
await page.fill('[data-test-id=input_inline_part_quantity]','99'); await page.waitForTimeout(3500);
R.shortChip = await chip();
R.shortNote = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...new Set([...document.querySelectorAll('*')].filter(e=>e.children.length===0&&isVis(e)&&/negative|only .* here|switched to|default bin/i.test(t(e))).map(t))];}, VIS);
log('C45229 short allocation — chip=%s note=%s', JSON.stringify(R.shortChip), JSON.stringify(R.shortNote));
await page.screenshot({path:`${DIR}/evidence/74-c-short.png`, fullPage:true});
save();
// C45228: does it still save?
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(9000);
R.shortSave = { toast: await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS),
  rowOpen: await page.evaluate(()=>!!document.querySelector('[data-test-id=input_inline_part_description]')?.value) };
log('C45228 save with an over-allocation:', JSON.stringify(R.shortSave));
await page.screenshot({path:`${DIR}/evidence/74-d-shortsaved.png`, fullPage:true});
save();
// ---- C45238 the chip as the last Tab stop
await fresh(); await openRow();
await pick('20047'); await page.waitForTimeout(5500);
await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(2500);
await page.click('[data-test-id=input_inline_part_description]');
const stops=[];
for (let i=0;i<8;i++){
  stops.push(await page.evaluate(()=>{const a=document.activeElement; const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const p=a&&a.closest('.q-field'); const l=p&&p.querySelector('.q-field__label');
    return {tid:a&&a.getAttribute&&a.getAttribute('data-test-id'), label:l?t(l):null, tag:a&&a.tagName, text:a?t(a).slice(0,24):null};}));
  await page.keyboard.press('Tab'); await page.waitForTimeout(650);
}
R.C45238 = stops;
log('C45238 tab stops:', JSON.stringify(stops));
await page.screenshot({path:`${DIR}/evidence/74-e-tab.png`, fullPage:true});
save();
await s.browser.close();
