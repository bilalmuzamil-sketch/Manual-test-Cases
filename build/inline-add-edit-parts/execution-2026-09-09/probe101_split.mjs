// A REAL split, run as the technician. Probe 100's split legs ran as admin, where "Split across
// bins…" correctly opens the New Part Request window (C45232 cl.3) — which has no Auto or Apply, so
// no split could be made. In Tech view it opens the Bin Locations window.
//   C45233 cl.2  Auto redistributes default-first, then largest-first
//   C45234       Apply writes the split back and sets the quantity to the sum
//   C45225 cl.2  a split allocation is labelled "N bins", not a bin name
//   C45243       a split never shows the takes-negative warning
// The part is F40010212: General Storage 8 (Default) · A1A 5 · A1B 3 · A1C 2, 18 in total.
// A quantity of 15 cannot come from any single bin, so Auto has to spread it.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const MULTI='F40010212';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','tech'); const { page, APP } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/101-split.json`, JSON.stringify(R,null,1));
const modal=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {open:false};
  return {open:true, title:t(d.querySelector('.text-h6,.q-card__section')||d).slice(0,40),
    text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,420),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(isVis).map(t),
    amounts:[...d.querySelectorAll('input')].filter(isVis)
      .filter(i=>/input_bin_amount/.test(i.getAttribute('data-test-id')||''))
      .map(i=>({tid:i.getAttribute('data-test-id'), v:i.value}))};}, VIS);
const chip=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=document.querySelector('[data-test-id=button_pulled_from_bin]'); if(!b) return {present:false};
  let box=b; for(let i=0;i<3&&box.parentElement;i++) box=box.parentElement;
  return {present:true, label:t(b).replace('expand_more','').trim(),
    note:(box.innerText||'').replace(/\s+/g,' ').trim().slice(0,260)};}, VIS);

await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
await page.waitForTimeout(4500);
await page.click('[data-test-id=select_inline_part_number]');
await page.keyboard.type(MULTI,{delay:100}); await page.waitForTimeout(6500);
R.card = await page.evaluate(({vis,pn})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return 'no menu';
  const its=[...m.querySelectorAll('.q-item')].filter(isVis);
  const i=its.findIndex(x=>t(x).includes(pn)); const target=its[i>=0?i:0];
  const c=t(target).slice(0,180); target.click(); return c;}, {vis:VIS, pn:MULTI});
await page.waitForTimeout(5500);
await page.fill('[data-test-id=input_inline_part_quantity]','15'); await page.waitForTimeout(3500);
R.beforeSplit = await chip();
log('quantity 15 of a possible 18, before any split: %s', JSON.stringify(R.beforeSplit));
save();
// open the picker, then Split across bins
await page.evaluate(()=>document.querySelector('[data-test-id=button_pulled_from_bin]')?.click());
await page.waitForTimeout(3800);
R.splitClick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu,.q-dialog')].filter(isVis).pop(); if(!m) return 'no picker';
  const it=[...m.querySelectorAll('.q-item')].filter(isVis).find(x=>/split across bins/i.test(t(x)));
  if(!it) return 'no split action'; it.click(); return 'clicked';}, VIS);
await page.waitForTimeout(7000);
R.modalOpened = await modal();
log('C45233 the Bin Locations window: %s', JSON.stringify(R.modalOpened).slice(0,520));
await page.screenshot({path:`${DIR}/evidence/101-a-modal.png`, fullPage:true});
save();
// C45233 cl.2 — Auto
R.autoClick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const b=d&&[...d.querySelectorAll('button,.q-btn')].filter(isVis).find(x=>/^auto$/i.test(t(x)));
  if(!b) return 'no Auto button'; b.click(); return 'clicked Auto';}, VIS);
await page.waitForTimeout(4500);
R.afterAuto = await modal();
log('C45233 cl.2 after Auto: %s', JSON.stringify(R.afterAuto).slice(0,520));
await page.screenshot({path:`${DIR}/evidence/101-b-auto.png`, fullPage:true});
save();
// C45234 — Apply
R.applyClick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const b=d&&[...d.querySelectorAll('button,.q-btn')].filter(isVis).find(x=>/^apply$/i.test(t(x)));
  if(!b) return 'no Apply button'; b.click(); return 'clicked Apply';}, VIS);
await page.waitForTimeout(5500);
R.afterApply = {chip: await chip(),
  qty: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_quantity]')?.value)};
log('C45225 cl.2 / C45234 / C45243 after Apply: %s', JSON.stringify(R.afterApply));
R.C45243_noNegativeWarning = !/takes this bin negative/i.test((R.afterApply.chip||{}).note||'');
log('C45243 — is the takes-negative warning absent on a split? %s', R.C45243_noNegativeWarning);
await page.screenshot({path:`${DIR}/evidence/101-c-applied.png`, fullPage:true});
save();
await s.browser.close();
