// Tech View: C45001 (catalog vs inventory description) and C45013 clause 3 (no-match typeahead).
// Captures the typeahead network response so catalog and inventory parts can be told apart.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','tech'); const { page, APP, APIH } = s;
const R={}; const captured=[];
page.on('response', async r=>{ const u=r.url();
  if(!/part/i.test(u) || !/search|catalog|parts/i.test(u)) return;
  try{ const j=await r.json(); captured.push({url:u.slice(0,140), keys:Object.keys(j||{}),
    sample:JSON.stringify((j.data||j.results||j.items||j)).slice(0,900)}); }catch(e){}
});
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(6000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4000);};
const menuItems=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const menu=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop();
  if(!menu) return {menu:false};
  return {menu:true, items:[...menu.querySelectorAll('.q-item')].filter(isVis).map(t),
          text:t(menu).slice(0,400)};}, VIS);

// ---- 1. capture the typeahead payload, then try each of the first few parts
await fresh(); await openRow();
await page.click('[data-test-id=select_inline_part_number]');
await page.keyboard.type('OIL',{delay:110}); await page.waitForTimeout(7000);
R.captured = captured.slice(-3);
log('captured endpoints:', JSON.stringify(R.captured.map(c=>c.url)));
for (const c of R.captured) log('  sample:', c.sample.slice(0,700));
const items = await menuItems();
R.itemTexts = items.items ? items.items.slice(0,12) : [];
log('menu items:', JSON.stringify(R.itemTexts.slice(0,4)));

// ---- 1b. find a part whose part_type is NOT inventory_part (a pure catalogue part)
R.catalogueSearch = await page.evaluate(async (api)=>{
  const out={inventory:[], catalogue:[]};
  for (const q of ['OIL','FILTER','BOLT','SEAL','HOSE','BRAKE']){
    const u=`https://${api}/api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts?pagination[rowsPerPage]=100&pagination[page]=1&search=${encodeURIComponent(q)}`;
    const r=await fetch(u,{headers:{Accept:'application/json'}, credentials:'include'}); if(!r.ok) continue;
    const j=await r.json(); const rows=j.collection||j.data||j.rows||[];
    for(const x of rows){ const rec={q, pn:x.part_number, name:(x.name||'').slice(0,50), type:x.part_type,
      cost:x.cost, sell:x.sell_price, bins:(x.binLocations||[]).length};
      if(x.part_type==='inventory_part'){ if(out.inventory.length<3) out.inventory.push(rec); }
      else if(out.catalogue.length<6) out.catalogue.push(rec); }
    if(out.catalogue.length>=6) break;
  }
  return out;}, APIH);
log('part types found:', JSON.stringify(R.catalogueSearch));

// ---- 2. C45001: pick each of the first 6 parts in turn and record read-only state
R.descStates=[];
for (let i=0;i<6;i++){
  await fresh(); await openRow();
  await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type('OIL',{delay:100}); await page.waitForTimeout(6500);
  const label = await page.evaluate(({vis,idx})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const menu=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop();
    if(!menu) return null; const its=[...menu.querySelectorAll('.q-item')].filter(isVis);
    if(!its[idx]) return null; const l=t(its[idx]).slice(0,80); its[idx].click(); return l;}, {vis:VIS, idx:i});
  if(!label){ log('item',i,'not available'); continue; }
  await page.waitForTimeout(5500);
  const st = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    return d? {value:d.value, disabled:d.disabled, readOnly:d.readOnly} : null;});
  R.descStates.push({i, label, state:st});
  log('C45001 item %d -> %s', i, JSON.stringify({label:label.slice(0,50), st}));
  if (st && !st.disabled && !st.readOnly){
    await page.fill('[data-test-id=input_inline_part_description]','EDITED CATALOG DESCRIPTION');
    await page.waitForTimeout(1200);
    R.editableProof = { i, label, after: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_description]')?.value) };
    log('C45001 EDITABLE proof:', JSON.stringify(R.editableProof));
    await page.screenshot({path:`${DIR}/evidence/47-a-editable.png`, fullPage:true});
    break;
  }
}

// ---- 3. C45013 clause 3: typeahead with nothing matching, in Tech View
await fresh(); await openRow();
await page.click('[data-test-id=select_inline_part_number]');
await page.keyboard.type('ZZNOMATCH991',{delay:90}); await page.waitForTimeout(7000);
R.noMatch = await menuItems();
log('C45013 no-match menu:', JSON.stringify(R.noMatch).slice(0,500));
await page.screenshot({path:`${DIR}/evidence/47-b-nomatch.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/47-tv.json`, JSON.stringify({R,captured},null,1));
await s.browser.close();
