// C45001 clause 1 and C45039 clause 1, on a PURE catalogue part. Probe 47 tried the first five
// results of an "OIL" search and every one had a read-only description — but four of them were
// `inventory_part` and the fifth (51372MP) shows "Inventory Qty: 2" on its card. This uses
// `special_part` entries with NO inventory behind them (POI5935C, POI53129C, 866850C), which is what
// the spec means by a catalog part, and records for each one whether description, cost and sell
// price accept an edit.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={legs:[]};
const save=()=>fs.writeFileSync(`${DIR}/evidence/70-catalogpart.json`, JSON.stringify(R,null,1));
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4500);};
const fieldState=()=>page.evaluate(()=>{const g=t=>{const e=document.querySelector(`[data-test-id=${t}]`);
    return e? {value:e.value, disabled:e.disabled, readOnly:e.readOnly, editable:!(e.disabled||e.readOnly)} : null;};
  return {desc:g('input_inline_part_description'), cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price')};});
// confirm from the payload which of these have no inventory behind them
R.payload = await page.evaluate(async ({api, pns})=>{
  const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
    if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; };
  const out={};
  for (const pn of pns){
    const r=await fetch(`https://${api}/api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts?pagination[rowsPerPage]=50&pagination[page]=1&search=${encodeURIComponent(pn)}`,
      {headers:{Accept:'application/json'}, credentials:'include'});
    if(!r.ok){ out[pn]={http:r.status}; continue; }
    const hit=pick(await r.json()).find(x=>String(x.part_number||'').toUpperCase()===pn.toUpperCase());
    out[pn]= hit? {type:hit.part_type, qty:hit.quantity, cost:hit.cost, sell:hit.sell_price,
                   bins:(hit.binLocations||[]).length, name:(hit.name||'').slice(0,45)} : {notFound:true};
  }
  return out;}, {api:APIH, pns:['POI5935C','POI53129C','866850C','51372MP','A4731800909']});
log('payload:', JSON.stringify(R.payload));
save();
for (const pn of ['POI5935C','POI53129C','866850C']){
  await fresh(); await openRow();
  await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type(pn,{delay:100}); await page.waitForTimeout(6500);
  const chose = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return {ok:false, why:'no menu'};
    const its=[...m.querySelectorAll('.q-item')].filter(isVis); if(!its.length) return {ok:false, why:'no items'};
    const label=t(its[0]).slice(0,110); its[0].click(); return {ok:true, label};}, VIS);
  await page.waitForTimeout(5500);
  const before = await fieldState();
  const leg = {pn, chose, before};
  if (before.desc && before.desc.editable){
    await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST overwritten description');
    await page.waitForTimeout(1500);
    leg.descAfterEdit = (await fieldState()).desc;
  }
  if (before.cost && before.cost.editable){
    await page.fill('[data-test-id=input_inline_part_cost]','13.13'); await page.waitForTimeout(1200);
  }
  if (before.sell && before.sell.editable){
    await page.fill('[data-test-id=input_inline_part_sell_price]','26.26'); await page.waitForTimeout(1200);
  }
  leg.after = await fieldState();
  R.legs.push(leg);
  log('%s | card=%s', pn, JSON.stringify(chose.label));
  log('   desc editable=%s cost editable=%s sell editable=%s | after=%s',
      before.desc&&before.desc.editable, before.cost&&before.cost.editable, before.sell&&before.sell.editable,
      JSON.stringify(leg.after));
  await page.screenshot({path:`${DIR}/evidence/70-${pn}.png`, fullPage:true});
  save();
}
await s.browser.close();
