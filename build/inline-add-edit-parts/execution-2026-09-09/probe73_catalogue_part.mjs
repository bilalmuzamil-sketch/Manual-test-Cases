// C45001 clause 1/3 and C45039 clause 1/3, using the type the census actually found.
// Probe 63 counted the typeahead's part_type values: inventory_part 617, special_part 46,
// **catalogue_part 617**. Earlier probes lumped special_part and catalogue_part together and only
// ever tried a special_part, whose cost is locked. The true catalogue rows are `catalogue_part`.
// Clause 3 of C45039 also failed to click "Found" because the option's text is "check Found"
// (a leading check icon) — matched loosely here.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={legs:[]};
const save=()=>fs.writeFileSync(`${DIR}/evidence/73-cataloguepart.json`, JSON.stringify(R,null,1));
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4500);};
const fieldState=()=>page.evaluate(()=>{const g=t=>{const e=document.querySelector(`[data-test-id=${t}]`);
    return e? {value:e.value, editable:!(e.disabled||e.readOnly)} : null;};
  return {desc:g('input_inline_part_description'), cost:g('input_inline_part_cost'),
          sell:g('input_inline_part_sell_price'), qty:g('input_inline_part_quantity')};});

// ---- find genuine `catalogue_part` rows
R.found = await page.evaluate(async ({api})=>{
  const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
    if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; };
  const out=[]; const counts={};
  for (const q of ['OIL','FILTER','BOLT','SEAL','HOSE','BRAKE','PIN','KIT','CLAMP']){
    const r=await fetch(`https://${api}/api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts?pagination[rowsPerPage]=200&pagination[page]=1&search=${encodeURIComponent(q)}`,
      {headers:{Accept:'application/json'}, credentials:'include'});
    if(!r.ok) continue;
    for (const x of pick(await r.json())){
      counts[x.part_type]=(counts[x.part_type]||0)+1;
      if (x.part_type==='catalogue_part' && out.length<6)
        out.push({pn:x.part_number, name:(x.name||'').slice(0,45), cost:x.cost, sell:x.sell_price,
                  bins:(x.binLocations||[]).length, qty:x.quantity});
    }
    if (out.length>=6) break;
  }
  return {counts, catalogue:out};}, {api:APIH});
log('type census:', JSON.stringify(R.found.counts));
log('catalogue_part rows:', JSON.stringify(R.found.catalogue));
save();

// ---- C45001 cl.1 / C45039 cl.1 on each catalogue_part
for (const p of (R.found.catalogue||[]).slice(0,3)){
  await fresh(); await openRow();
  await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type(p.pn,{delay:100}); await page.waitForTimeout(6500);
  const chose = await page.evaluate(({vis,pn})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return {ok:false, why:'no menu'};
    const its=[...m.querySelectorAll('.q-item')].filter(isVis); if(!its.length) return {ok:false, why:'no items'};
    const i=its.findIndex(x=>t(x).includes(pn));
    const target=its[i>=0?i:0]; const label=t(target).slice(0,120); target.click(); return {ok:true, label, matchedExact:i>=0};}, {vis:VIS, pn:p.pn});
  await page.waitForTimeout(5500);
  const before = await fieldState();
  const leg = {pn:p.pn, chose, before};
  if (before.desc && before.desc.editable){
    await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST overwritten description'); await page.waitForTimeout(1500);
  }
  if (before.cost && before.cost.editable){ await page.fill('[data-test-id=input_inline_part_cost]','13.13'); await page.waitForTimeout(1500); }
  if (before.sell && before.sell.editable){ await page.fill('[data-test-id=input_inline_part_sell_price]','26.26'); await page.waitForTimeout(1500); }
  leg.after = await fieldState();
  R.legs.push(leg);
  log('%s | card=%s', p.pn, JSON.stringify(chose.label));
  log('   editable: desc=%s cost=%s sell=%s -> after %s',
      before.desc&&before.desc.editable, before.cost&&before.cost.editable, before.sell&&before.sell.editable,
      JSON.stringify(leg.after));
  await page.screenshot({path:`${DIR}/evidence/73-${String(p.pn).replace(/[^A-Za-z0-9_-]/g,'')}.png`, fullPage:true});
  save();
  // C45001 clause 3: after a save, description / cost / core charge / vendor are read-only
  if (leg.after.desc && leg.after.qty){
    await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1200);
    await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
    await page.waitForTimeout(9000);
    leg.savedToast = await page.evaluate(vis=>{const isVis=eval(vis);
      return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS);
    log('   saved:', JSON.stringify(leg.savedToast));
    save();
    break; // one saved example is enough for clause 3
  }
}

// ---- C45039 clause 3: Source = Found, matched loosely ("check Found")
await fresh(); await openRow();
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST found source2');
await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1200);
await page.evaluate(()=>document.querySelector('[data-test-id=button_more_options_inline_part]')?.click());
await page.waitForTimeout(7000);
R.beforeFound = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {modal:false};
  const val=lbl=>{const f=[...d.querySelectorAll('.q-field')].find(x=>{const l=x.querySelector('.q-field__label'); return l&&new RegExp('^'+lbl,'i').test(t(l));});
    if(!f) return null; const i=f.querySelector('input'); return i? {value:i.value, editable:!(i.disabled||i.readOnly)} : {value:t(f).slice(0,30), editable:null};};
  return {modal:true, vendor:val('vendor'), cost:val('cost'), core:val('core'), margin:val('margin'), sell:val('sell'), source:val('source')};}, VIS);
log('C45039 cl.3 BEFORE Found:', JSON.stringify(R.beforeFound));
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const f=[...d.querySelectorAll('.q-field')].find(x=>{const l=x.querySelector('.q-field__label'); return l&&/^source$/i.test(t(l));});
  f&&f.querySelector('input,.q-field__native')?.click();}, VIS);
await page.waitForTimeout(3500);
R.foundPick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop(); if(!m) return 'no menu';
  const its=[...m.querySelectorAll('.q-item')].filter(isVis);
  const it=its.find(x=>/found/i.test(t(x)));
  if(!it) return 'options: '+its.map(t).join(' | ');
  const l=t(it); it.click(); return l;}, VIS);
await page.waitForTimeout(4500);
R.afterFound = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {modal:false};
  const val=lbl=>{const f=[...d.querySelectorAll('.q-field')].find(x=>{const l=x.querySelector('.q-field__label'); return l&&new RegExp('^'+lbl,'i').test(t(l));});
    if(!f) return null; const i=f.querySelector('input'); return i? {value:i.value, editable:!(i.disabled||i.readOnly)} : {value:t(f).slice(0,30), editable:null};};
  return {modal:true, vendor:val('vendor'), cost:val('cost'), core:val('core'), margin:val('margin'), sell:val('sell'), source:val('source')};}, VIS);
log('C45039 cl.3 pick="%s" AFTER: %s', R.foundPick, JSON.stringify(R.afterFound));
await page.screenshot({path:`${DIR}/evidence/73-found.png`, fullPage:true});
save();
await s.browser.close();
