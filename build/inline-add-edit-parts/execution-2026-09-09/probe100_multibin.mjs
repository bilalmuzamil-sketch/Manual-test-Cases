// The multi-bin cases, now that the data state exists. `inventory/parts/create` HONOURS the bins
// array (where parts/change silently ignored it), so F40010212 now sits in four bins:
// General Storage 8 (Default) · A1A 5 · A1B 3 · A1C 2.
// A second part is seeded with a SHORT default, because C45223 cl.2 and C45230 need a default bin
// that does NOT cover the quantity while another single bin does.
//   C45222 cl.2  up to three bin chips, then a "+ N" chip
//   C45223 cl.2  default short, another single bin covers -> the full quantity goes to that bin
//   C45225 cl.2  a split allocation is labelled "N bins"
//   C45227       choosing another bin moves the whole quantity and marks it manually chosen
//   C45230       the "Default bin <name> has <n>. Switched to a bin that covers <qty>." note
//   C45231 cl.1  a manually chosen bin is KEPT when the quantity changes
//   C45233 cl.2  Auto redistributes default-first then largest-first
//   C45243       a split never shows the takes-negative warning
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const MULTI='F40010212';            // 4 bins, default 8 covers most quantities
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/100-multibin.json`, JSON.stringify(R,null,1));
const api = (path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,300)};}, {api:APIH, path, body:body||null});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

// ---- seed a SHORT-DEFAULT part: default 2, another bin 9
const locs = await api('/api/inventory/bin-locations');
const BINS = rowsOf(locs.json).slice(0,4).map(x=>({id:x.id||x.value, name:x.name||x.label}));
const cats = await api('/api/inventory/categories');
const CATID = (rowsOf(cats.json)[0]||{}).value || (rowsOf(cats.json)[0]||{}).id;
const cat = await api('/api/parts-catalogue/catalogue-parts-that-are-not-on-location?pagination[rowsPerPage]=6&pagination[page]=1');
const src = rowsOf(cat.json)[1] || rowsOf(cat.json)[0];
R.shortSource = src && {id:src.value||src.id, pn:src.partNumber||src.part_number, name:(src.name||'').slice(0,40)};
if (R.shortSource && CATID){
  const r = await api('/api/inventory/parts/create', {catalog_part_id:R.shortSource.id, category_id:CATID,
    quantity:14, cost:9.5, tags:[],
    bins:[{id:BINS[0].id, quantity:2, isDefault:true}, {id:BINS[1].id, quantity:9, isDefault:false},
          {id:BINS[2].id, quantity:3, isDefault:false}]});
  R.shortCreate = {status:r.status, text:r.text.slice(0,180)};
  log('short-default part %s -> %s', R.shortSource.pn, JSON.stringify(R.shortCreate));
}
save();
const SHORT = R.shortSource && R.shortSource.pn;

const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4500);};
const pick=async(pn)=>{ await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type(pn,{delay:100}); await page.waitForTimeout(6500);
  return page.evaluate(({vis,pn})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return {ok:false};
    const its=[...m.querySelectorAll('.q-item')].filter(isVis); if(!its.length) return {ok:false};
    const i=its.findIndex(x=>t(x).includes(pn)); const target=its[i>=0?i:0];
    const card=t(target).slice(0,200); target.click(); return {ok:true, card};}, {vis:VIS, pn}); };
const chip=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=document.querySelector('[data-test-id=button_pulled_from_bin]'); if(!b) return {present:false};
  let box=b; for(let i=0;i<3&&box.parentElement;i++) box=box.parentElement;
  return {present:true, label:t(b).replace('expand_more','').trim(),
    note:(box.innerText||'').replace(/\s+/g,' ').trim().slice(0,240)};}, VIS);
const picker=async()=>{ await page.evaluate(()=>document.querySelector('[data-test-id=button_pulled_from_bin]')?.click());
  await page.waitForTimeout(3800);
  return page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-dialog')].filter(isVis).pop(); if(!m) return {open:false};
    return {open:true, items:[...m.querySelectorAll('.q-item')].filter(isVis).map(x=>({
      text:t(x), colour:getComputedStyle(x).color}))};}, VIS); };

// ===== C45222 cl.2 — the card's chips for a 4-bin part =====
await fresh(); await openRow();
R.C45222 = await pick(MULTI);
log('C45222 cl.2 card for the 4-bin part: %s', JSON.stringify(R.C45222.card));
await page.waitForTimeout(5000);
await page.fill('[data-test-id=input_inline_part_quantity]','3'); await page.waitForTimeout(3000);
R.C45223_cl1 = await chip();
log('default covers 3 of 8 -> %s', JSON.stringify(R.C45223_cl1));
await page.screenshot({path:`${DIR}/evidence/100-a-fourbins.png`, fullPage:true});
save();

// ===== C45227 + C45231 cl.1 — choose another bin by hand, then change the quantity =====
R.pickerBefore = await picker();
log('C45227 picker lists: %s', JSON.stringify(R.pickerBefore.items));
R.C45227click = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu,.q-dialog')].filter(isVis).pop(); if(!m) return 'no picker';
  const its=[...m.querySelectorAll('.q-item')].filter(isVis).filter(x=>!/split across/i.test(t(x)));
  const other=its.find(x=>!/default/i.test(t(x))); if(!other) return 'no non-default bin';
  const label=t(other); other.click(); return label;}, VIS);
await page.waitForTimeout(4000);
R.C45227 = {chose:R.C45227click, chip: await chip()};
log('C45227 chose "%s" -> %s', R.C45227click, JSON.stringify(R.C45227.chip));
await page.fill('[data-test-id=input_inline_part_quantity]','4'); await page.waitForTimeout(3500);
R.C45231_cl1 = await chip();
log('C45231 cl.1 after changing the quantity, is the hand-picked bin kept? %s', JSON.stringify(R.C45231_cl1));
await page.screenshot({path:`${DIR}/evidence/100-b-manualbin.png`, fullPage:true});
save();

// ===== C45223 cl.2 + C45230 — a short default =====
if (SHORT){
  await fresh(); await openRow();
  R.shortCard = await pick(SHORT); await page.waitForTimeout(5000);
  await page.fill('[data-test-id=input_inline_part_quantity]','6'); await page.waitForTimeout(3500);
  R.C45223_cl2 = await chip();
  log('C45223 cl.2 / C45230 — default holds 2, asked for 6, another bin holds 9: %s', JSON.stringify(R.C45223_cl2));
  await page.screenshot({path:`${DIR}/evidence/100-c-shortdefault.png`, fullPage:true});
  save();
}
// ===== C45233 cl.2 Auto · C45234 · C45225 cl.2 · C45243 — a real split =====
await fresh(); await openRow();
await pick(MULTI); await page.waitForTimeout(5000);
await page.fill('[data-test-id=input_inline_part_quantity]','15'); await page.waitForTimeout(3500);
R.beforeSplit = await chip();
await page.evaluate(()=>document.querySelector('[data-test-id=button_pulled_from_bin]')?.click());
await page.waitForTimeout(3500);
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu,.q-dialog')].filter(isVis).pop();
  const it=m&&[...m.querySelectorAll('.q-item')].filter(isVis).find(x=>/split across bins/i.test(t(x)));
  it&&it.click();}, VIS);
await page.waitForTimeout(7000);
R.splitModal = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {open:false};
  return {open:true, text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,400),
    inputs:[...d.querySelectorAll('input')].filter(isVis).map(i=>({tid:i.getAttribute('data-test-id'), v:i.value}))};}, VIS);
log('the Bin Locations window for a 4-bin part: %s', JSON.stringify(R.splitModal).slice(0,500));
await page.screenshot({path:`${DIR}/evidence/100-d-splitmodal.png`, fullPage:true});
save();
R.autoClick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const b=d&&[...d.querySelectorAll('button,.q-btn')].filter(isVis).find(x=>/^auto$/i.test(t(x)));
  if(!b) return 'no Auto'; b.click(); return 'clicked Auto';}, VIS);
await page.waitForTimeout(4000);
R.C45233_auto = await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {open:false};
  return {open:true, text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,400),
    inputs:[...d.querySelectorAll('input')].filter(isVis).map(i=>({tid:i.getAttribute('data-test-id'), v:i.value}))};}, VIS);
log('C45233 cl.2 after Auto: %s', JSON.stringify(R.C45233_auto).slice(0,420));
await page.screenshot({path:`${DIR}/evidence/100-e-auto.png`, fullPage:true});
save();
R.applyClick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const b=d&&[...d.querySelectorAll('button,.q-btn')].filter(isVis).find(x=>/^apply$/i.test(t(x)));
  if(!b) return 'no Apply'; b.click(); return 'clicked Apply';}, VIS);
await page.waitForTimeout(5000);
R.C45225_cl2 = {chip: await chip(),
  qty: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_quantity]')?.value)};
log('C45225 cl.2 / C45234 / C45243 after Apply: %s', JSON.stringify(R.C45225_cl2));
await page.screenshot({path:`${DIR}/evidence/100-f-split.png`, fullPage:true});
save();
await s.browser.close();
