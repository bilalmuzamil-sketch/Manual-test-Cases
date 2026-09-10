// C45001 clause 1 / C45039 clause 1, on a part that genuinely has NO inventory record.
// `part_type` from the inline typeahead is unusable for this — the same part number comes back as
// `special_part` in a broad search and `inventory_part` when searched by itself. The parts with no
// inventory at all come from GET /api/parts-catalogue/catalogue-parts-that-are-not-on-location.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={legs:[]};
const save=()=>fs.writeFileSync(`${DIR}/evidence/71-purecatalog.json`, JSON.stringify(R,null,1));
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4500);};
const fieldState=()=>page.evaluate(()=>{const g=t=>{const e=document.querySelector(`[data-test-id=${t}]`);
    return e? {value:e.value, editable:!(e.disabled||e.readOnly)} : null;};
  return {desc:g('input_inline_part_description'), cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price')};});
// ---- parts with no inventory record
R.notOnLocation = await page.evaluate(async ({api})=>{
  const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
    if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; };
  for (const p of ['/api/parts-catalogue/catalogue-parts-that-are-not-on-location?pagination[rowsPerPage]=40&pagination[page]=1',
                   '/api/parts-catalogue/catalogue-parts-that-are-not-on-location']){
    const r=await fetch(`https://${api}${p}`,{headers:{Accept:'application/json'}, credentials:'include'});
    if(!r.ok) continue;
    const rows=pick(await r.json());
    if (rows.length) return {path:p, n:rows.length, keys:Object.keys(rows[0]||{}).slice(0,14),
      sample:rows.slice(0,10).map(x=>({pn:x.part_number||x.partNumber, name:(x.name||x.description||'').slice(0,42),
        cost:x.cost, sell:x.sell_price}))};
  }
  return {none:true};}, {api:APIH});
log('parts not on any location:', JSON.stringify(R.notOnLocation).slice(0,900));
save();
const pns=(R.notOnLocation.sample||[]).map(x=>x.pn).filter(Boolean).slice(0,4);
if (!pns.length){ log('no candidate part numbers — stopping'); await s.browser.close(); process.exit(0); }
for (const pn of pns){
  await fresh(); await openRow();
  await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type(pn,{delay:100}); await page.waitForTimeout(6500);
  const chose = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return {ok:false, why:'no menu'};
    const its=[...m.querySelectorAll('.q-item')].filter(isVis); if(!its.length) return {ok:false, why:'no items'};
    const label=t(its[0]).slice(0,120); its[0].click(); return {ok:true, label};}, VIS);
  await page.waitForTimeout(5500);
  const before = await fieldState();
  const leg = {pn, chose, before};
  if (before.desc && before.desc.editable){
    await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST overwritten'); await page.waitForTimeout(1500);
    leg.descAfter = (await fieldState()).desc;
  }
  if (before.cost && before.cost.editable){ await page.fill('[data-test-id=input_inline_part_cost]','13.13'); await page.waitForTimeout(1200); }
  if (before.sell && before.sell.editable){ await page.fill('[data-test-id=input_inline_part_sell_price]','26.26'); await page.waitForTimeout(1200); }
  leg.after = await fieldState();
  R.legs.push(leg);
  log('%s | card=%s', pn, JSON.stringify(chose.label));
  log('   desc editable=%s cost editable=%s sell editable=%s -> %s',
      before.desc&&before.desc.editable, before.cost&&before.cost.editable, before.sell&&before.sell.editable,
      JSON.stringify(leg.after));
  await page.screenshot({path:`${DIR}/evidence/71-${String(pn).replace(/[^A-Za-z0-9_-]/g,'')}.png`, fullPage:true});
  save();
}
await s.browser.close();
