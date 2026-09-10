// Bin Allocation (Story 7), first wave — the display and read-only cases:
//   C45221 bins carry a name, an on-hand quantity and exactly one Default
//   C45222 result cards show the total quantity, up to three bin chips, "+N", or "Not stocked"
//   C45224 the "Pulled from" chip is shown only while an allocation exists
//   C45225 the chip label is the bin name for a single-bin allocation
//   C45226 selecting the chip opens a picker: every bin, on-hand, a check, a Default badge,
//          warning styling when short, and a "Split across bins…" action at the end
//   C45238 the chip is the last Tab stop in the row
//   C45239 a part held in no bins gets no allocation and no chip
//   C45240 a free-typed part gets no allocation and no chip
//   C45242 no switched-bin note when the Default bin covers the quantity
// The parts are DISCOVERED from the typeahead payload, so nothing is assumed about the data state.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','tech'); const { page, APP, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/66-bins.json`, JSON.stringify(R,null,1));
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4500);};
const chip=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=document.querySelector('[data-test-id=button_pulled_from_bin]');
  const byText=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&isVis(e)&&/pulled from/i.test(t(e)))[0];
  const host=b|| (byText? byText.parentElement : null);
  if(!host) return {present:false};
  return {present:true, tid:b?'button_pulled_from_bin':'(by text)', text:t(host).slice(0,120),
    cls:String(host.className).slice(0,90),
    near:(()=>{let x=host; for(let i=0;i<3&&x.parentElement;i++) x=x.parentElement; return (x.innerText||'').replace(/\s+/g,' ').trim().slice(0,220);})()};}, VIS);
const pickByPN=async(pn)=>{
  await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type(pn,{delay:100}); await page.waitForTimeout(6500);
  return page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return {ok:false, why:'no menu'};
    const its=[...m.querySelectorAll('.q-item')].filter(isVis);
    if(!its.length) return {ok:false, why:'no items'};
    const label=t(its[0]).slice(0,110);
    const html=its[0].innerHTML.slice(0,400);
    its[0].click(); return {ok:true, label, html};}, VIS);
};

// ---------- discover parts: 1 bin, 3+ bins, no bins, negative bin ----------
R.data = await page.evaluate(async ({api})=>{
  const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
    if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; };
  const buckets={oneBin:[], threePlus:[], noBins:[], negative:[], binKeys:null, sampleBin:null};
  for (const q of ['OIL','FILTER','BOLT','SEAL','HOSE','BRAKE','PIN','KIT','CLAMP','GASKET']){
    const r=await fetch(`https://${api}/api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts?pagination[rowsPerPage]=200&pagination[page]=1&search=${encodeURIComponent(q)}`,
      {headers:{Accept:'application/json'}, credentials:'include'});
    if(!r.ok) continue;
    for (const x of pick(await r.json())){
      const b=x.binLocations||[];
      if (b.length && !buckets.binKeys){ buckets.binKeys=Object.keys(b[0]); buckets.sampleBin=b[0]; }
      const qty=y=>Number(y.quantity ?? y.onHand ?? y.on_hand ?? 0);
      const rec={pn:x.part_number, name:(x.name||'').slice(0,40), type:x.part_type, total:x.quantity, nbins:b.length, bins:b};
      if (b.length>=3 && buckets.threePlus.length<3) buckets.threePlus.push(rec);
      if (b.length===1 && qty(b[0])>=3 && buckets.oneBin.length<3) buckets.oneBin.push(rec);
      if (b.length===0 && buckets.noBins.length<3) buckets.noBins.push(rec);
      if (b.some(y=>qty(y)<0) && buckets.negative.length<3) buckets.negative.push(rec);
    }
    if (buckets.oneBin.length && buckets.threePlus.length && buckets.noBins.length && buckets.negative.length) break;
  }
  return buckets;}, {api:APIH});
log('bin fields:', JSON.stringify(R.data.binKeys), '| sample bin:', JSON.stringify(R.data.sampleBin));
for (const k of ['oneBin','threePlus','noBins','negative'])
  log('  %s: %s', k, JSON.stringify((R.data[k]||[]).map(x=>({pn:x.pn, nbins:x.nbins, total:x.total}))));
save();

// ---------- C45222 / C45224 / C45225 / C45242: a part in ONE bin ----------
const one=(R.data.oneBin||[])[0];
if (one){
  await fresh(); await openRow();
  R.oneBinCard = await pickByPN(one.pn);
  await page.waitForTimeout(5500);
  await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(2500);
  R.oneBinChip = await chip();
  log('one-bin part %s | card=%s', one.pn, JSON.stringify(R.oneBinCard.label));
  log('  chip:', JSON.stringify(R.oneBinChip));
  await page.screenshot({path:`${DIR}/evidence/66-a-onebin.png`, fullPage:true});
  save();
  // C45226: the picker
  if (R.oneBinChip.present){
    await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const b=document.querySelector('[data-test-id=button_pulled_from_bin]') ||
        [...document.querySelectorAll('*')].filter(e=>e.children.length===0&&isVis(e)&&/pulled from/i.test(t(e)))[0]?.parentElement;
      b&&b.click();}, VIS);
    await page.waitForTimeout(4000);
    R.picker = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const m=[...document.querySelectorAll('.q-menu,.q-dialog')].filter(isVis).pop(); if(!m) return {open:false};
      return {open:true, items:[...m.querySelectorAll('.q-item')].filter(isVis).map(t),
        text:t(m).slice(0,400),
        warn:[...m.querySelectorAll('*')].filter(e=>/warning|negative|orange|amber/i.test(String(e.className))).map(e=>t(e).slice(0,40)).slice(0,5)};}, VIS);
    log('C45226 picker:', JSON.stringify(R.picker).slice(0,600));
    await page.screenshot({path:`${DIR}/evidence/66-b-picker.png`, fullPage:true});
    await page.keyboard.press('Escape'); await page.waitForTimeout(2000);
    save();
  }
}

// ---------- C45222 clause 2: a part in 3+ bins ----------
const many=(R.data.threePlus||[])[0];
if (many){
  await fresh(); await openRow();
  R.manyBinCard = await pickByPN(many.pn);
  await page.waitForTimeout(5500);
  await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(2500);
  R.manyBinChip = await chip();
  log('many-bin part %s (%d bins) | card=%s', many.pn, many.nbins, JSON.stringify(R.manyBinCard.label));
  log('  chip:', JSON.stringify(R.manyBinChip));
  await page.screenshot({path:`${DIR}/evidence/66-c-manybins.png`, fullPage:true});
  save();
}

// ---------- C45239: a part held in NO bins ----------
const none=(R.data.noBins||[])[0];
if (none){
  await fresh(); await openRow();
  R.noBinCard = await pickByPN(none.pn);
  await page.waitForTimeout(5500);
  await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(2500);
  R.noBinChip = await chip();
  log('C45239 no-bin part %s | card=%s | chip=%s', none.pn, JSON.stringify(R.noBinCard.label), JSON.stringify(R.noBinChip));
  await page.screenshot({path:`${DIR}/evidence/66-d-nobins.png`, fullPage:true});
  save();
}

// ---------- C45240: a free-typed part ----------
await fresh(); await openRow();
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST no catalog link');
await page.fill('[data-test-id=input_inline_part_quantity]','2'); await page.waitForTimeout(2500);
R.freeTypedChip = await chip();
log('C45240 free-typed chip:', JSON.stringify(R.freeTypedChip));
await page.screenshot({path:`${DIR}/evidence/66-e-freetyped.png`, fullPage:true});
save();

// ---------- C45238: is the chip the last Tab stop? ----------
if (one){
  await fresh(); await openRow();
  await pickByPN(one.pn); await page.waitForTimeout(5500);
  await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(2500);
  await page.click('[data-test-id=input_inline_part_description]');
  const stops=[];
  for (let i=0;i<8;i++){
    stops.push(await page.evaluate(()=>{const a=document.activeElement; const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const p=a&&a.closest('.q-field'); const l=p&&p.querySelector('.q-field__label');
      return {tid:a&&a.getAttribute&&a.getAttribute('data-test-id'), label:l?t(l):null, tag:a&&a.tagName, text:a?t(a).slice(0,26):null};}));
    await page.keyboard.press('Tab'); await page.waitForTimeout(600);
  }
  R.tabWithChip = stops;
  log('C45238 tab stops:', JSON.stringify(stops));
  await page.screenshot({path:`${DIR}/evidence/66-f-tab.png`, fullPage:true});
  save();
}
await s.browser.close();
