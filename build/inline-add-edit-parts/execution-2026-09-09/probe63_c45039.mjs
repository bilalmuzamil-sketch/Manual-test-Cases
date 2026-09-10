// C45039 (Full View): cost and sell price are both overwritable for a normal catalogue part; cost is
// read-only for an inventory part while sell price stays editable; and with Source set to "Found"
// through More options, vendor, cost, core charge and margin are fixed, empty and read-only.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4500);};
const fieldState=()=>page.evaluate(()=>{const g=t=>{const e=document.querySelector(`[data-test-id=${t}]`);
    return e? {value:e.value, editable:!(e.disabled||e.readOnly)} : null;};
  return {desc:g('input_inline_part_description'), cost:g('input_inline_part_cost'),
          sell:g('input_inline_part_sell_price'), qty:g('input_inline_part_quantity')};});
const pick=async(term, wantType)=>{
  await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type(term,{delay:100}); await page.waitForTimeout(6500);
  return page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return 'no menu';
    const it=[...m.querySelectorAll('.q-item')].filter(isVis)[0]; if(!it) return 'no item';
    const l=t(it).slice(0,70); it.click(); return l;}, VIS);
};
// which parts in this typeahead are NOT inventory parts?
R.types = await page.evaluate(async ({api})=>{
  const pickRows=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
    if (Array.isArray(o)) return o;
    for (const k of Object.keys(o||{})){ const v=pickRows(o[k]); if (v&&v.length) return v; } return []; };
  const out={inv:[], cat:[], counts:{}};
  for (const q of ['OIL','FILTER','BOLT','SEAL','BRAKE']){
    const r=await fetch(`https://${api}/api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts?pagination[rowsPerPage]=200&pagination[page]=1&search=${encodeURIComponent(q)}`,
      {headers:{Accept:'application/json'}, credentials:'include'});
    if(!r.ok) continue; const rows=pickRows(await r.json());
    for (const x of rows){ out.counts[x.part_type]=(out.counts[x.part_type]||0)+1;
      const rec={pn:x.part_number, name:(x.name||'').slice(0,45), type:x.part_type, cost:x.cost, sell:x.sell_price};
      if (x.part_type==='inventory_part'){ if(out.inv.length<3) out.inv.push(rec); }
      else if (out.cat.length<6) out.cat.push(rec); }
  }
  return out;}, {api:APIH});
log('part types in the typeahead:', JSON.stringify(R.types.counts), '| catalogue examples:', JSON.stringify(R.types.cat).slice(0,500));

// ---- clause 2: an INVENTORY part
await fresh(); await openRow();
R.invPicked = await pick(R.types.inv[0] ? R.types.inv[0].pn : 'A4731800909');
await page.waitForTimeout(5500);
R.inventory = await fieldState();
log('C45039 clause 2 — inventory part %s -> %s', R.invPicked, JSON.stringify(R.inventory));
if (R.inventory.sell && R.inventory.sell.editable){
  await page.fill('[data-test-id=input_inline_part_sell_price]','77.77'); await page.waitForTimeout(1500);
  R.inventorySellAfter = (await fieldState()).sell;
  log('  sell price after typing:', JSON.stringify(R.inventorySellAfter));
}
await page.screenshot({path:`${DIR}/evidence/63-a-inventory.png`, fullPage:true});

// ---- clause 1: a CATALOGUE (non-inventory) part, if this data set has one
if (R.types.cat.length){
  await fresh(); await openRow();
  R.catPicked = await pick(R.types.cat[0].pn);
  await page.waitForTimeout(5500);
  R.catalogue = await fieldState();
  log('C45039 clause 1 — catalogue part %s -> %s', R.catPicked, JSON.stringify(R.catalogue));
  if (R.catalogue.cost && R.catalogue.cost.editable) await page.fill('[data-test-id=input_inline_part_cost]','11.11');
  if (R.catalogue.sell && R.catalogue.sell.editable) await page.fill('[data-test-id=input_inline_part_sell_price]','22.22');
  await page.waitForTimeout(1500);
  R.catalogueAfter = await fieldState();
  log('  after typing over both:', JSON.stringify(R.catalogueAfter));
  await page.screenshot({path:`${DIR}/evidence/63-b-catalogue.png`, fullPage:true});
} else {
  R.catalogue = {note:'the typeahead returned no non-inventory part on this data set'};
  log('C45039 clause 1 — NO catalogue-only part found in the typeahead');
}

// ---- clause 3: Source = Found, through More options
await fresh(); await openRow();
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST found source');
await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1200);
await page.evaluate(()=>document.querySelector('[data-test-id=button_more_options_inline_part]')?.click());
await page.waitForTimeout(7000);
R.sourceOptions = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {modal:false};
  const f=[...d.querySelectorAll('.q-field')].find(x=>/^source$/i.test(t(x.querySelector('.q-field__label')||{textContent:''})));
  if(!f) return {modal:true, note:'no Source field', labels:[...d.querySelectorAll('.q-field__label')].map(t)};
  f.querySelector('input,.q-field__native')?.click(); return {modal:true, opened:true};}, VIS);
await page.waitForTimeout(3000);
R.sourcePicked = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop(); if(!m) return 'no menu';
  const its=[...m.querySelectorAll('.q-item')].filter(isVis);
  const it=its.find(x=>/^found$/i.test(t(x)));
  if(!it) return 'options: '+its.map(t).join(' | ');
  it.click(); return 'Found';}, VIS);
await page.waitForTimeout(4000);
R.foundState = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {modal:false};
  const out={};
  for (const lbl of ['vendor','cost','core charge','margin','sell']){
    const f=[...d.querySelectorAll('.q-field')].find(x=>{const l=x.querySelector('.q-field__label'); return l&&new RegExp('^'+lbl,'i').test(t(l));});
    if(!f){ out[lbl]=null; continue; }
    const i=f.querySelector('input');
    out[lbl]= i? {value:i.value, editable:!(i.disabled||i.readOnly)} : {value:t(f), editable:null};
  }
  return {modal:true, fields:out};}, VIS);
log('C45039 clause 3 — Source pick "%s" -> %s', R.sourcePicked, JSON.stringify(R.foundState));
await page.screenshot({path:`${DIR}/evidence/63-c-found.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/63-c45039.json`, JSON.stringify(R,null,1));
await s.browser.close();
