// Story 1 — the setting itself. Everything observable in one session.
// Toast watcher armed BEFORE every action (L0048); labels read from the element that owns them (L0043).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P04.json`, JSON.stringify(R,null,1));
const s = await boot('sv9872','/administration/settings','admin');
const page = s.page;
await page.setViewportSize({width:1600,height:1100});

const armToasts = ()=>page.evaluate(()=>{ window.__t=[];
  const g=()=>{for(const n of document.querySelectorAll('.q-notification,.q-notifications__list *,[role=alert]')){
    const x=(n.innerText||'').replace(/\s+/g,' ').trim();
    if(x&&x.length>5&&!window.__t.includes(x)) window.__t.push(x);}};
  window.__ti=setInterval(g,200); g();});
const toasts = ()=>page.evaluate(()=>{const t=[...(window.__t||[])];clearInterval(window.__ti);return t;});
const openInvoiceTab = async ()=>{
  await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(6000);
  await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(isVis).find(e=>t(e)==='Invoice');
    if(el) el.click();}, VIS);
  await page.waitForTimeout(5000);
};
const readControl = ()=>page.evaluate(vis=>{const isVis=eval(vis);
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis)
    .find(x=>/invoice design/i.test(x.innerText||''));
  if(!f) return {found:false};
  const inp=f.querySelector('input'), lab=f.querySelector('.q-field__label');
  const r=f.getBoundingClientRect();
  // is it the FIRST control on the page? and is there a toggle-style row anywhere?
  const all=[...document.querySelectorAll('.q-field,.q-select,.q-toggle')].filter(isVis);
  const toggles=[...document.querySelectorAll('.q-toggle')].filter(isVis)
    .map(e=>t(e.closest('div')||e).slice(0,60));
  return {found:true, label: lab?t(lab):null, value: inp?inp.value:null,
    isFirstControl: all.length? all[0]===f : null, top: Math.round(r.top),
    toggleRows: toggles.slice(0,25), toggleCount: toggles.length,
    legacyLayoutRow: toggles.some(x=>/legacy invoice layout/i.test(x))};}, VIS);
const helperText = ()=>page.evaluate(vis=>{const isVis=eval(vis);
  const e=[...document.querySelectorAll('div,p,span')].filter(isVis)
    .filter(x=>/uses the .*design/i.test(x.textContent||''))
    .sort((a,b)=>(a.textContent||'').length-(b.textContent||'').length)[0];
  return e?(e.textContent||'').replace(/\s+/g,' ').trim():null;}, VIS);
const pick = async (want)=>{
  await page.evaluate(vis=>{const isVis=eval(vis);
    const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis)
      .find(x=>/invoice design/i.test(x.innerText||''));
    if(f)(f.querySelector('input')||f).click();}, VIS);
  await page.waitForTimeout(2000);
  return page.evaluate(({vis,want})=>{const isVis=eval(vis);
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
    const list=o.map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),
      sel:e.classList.contains('q-item--active')||e.getAttribute('aria-selected')==='true'}));
    const hit=o.find(e=>new RegExp(want,'i').test(e.innerText||''));
    if(hit) hit.click();
    return {list, clicked:!!hit};}, {vis:VIS, want});
};
const dialog = ()=>page.evaluate(vis=>{const isVis=eval(vis);
  const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(!d) return {open:false};
  const h=[...d.querySelectorAll('h1,h2,h3,h4,.text-h6,.text-subtitle1')].filter(isVis).map(t);
  return {open:true, title:h[0]||null, full:t(d).slice(0,400),
    buttons:[...d.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean)};}, VIS);
const clickBtn = (re)=>page.evaluate(({vis,re})=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return false;
  const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>new RegExp(re,'i').test(t(e)));
  if(!b) return false; b.click(); return true;}, {vis:VIS, re});

await openInvoiceTab();
R.start = await readControl();
R.helper = await helperText();
log('control: %s', JSON.stringify(R.start));
log('helper : %s', JSON.stringify(R.helper));

// other invoice settings, so we can prove they are untouched later (C53532)
R.othersBefore = await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-toggle')].filter(isVis)
    .map(e=>({lab:((e.closest('div')||e).innerText||'').replace(/\s+/g,' ').trim().slice(0,42),
      on:e.classList.contains('q-toggle--truthy')||e.getAttribute('aria-checked')==='true'}));}, VIS);
log('other settings on the tab: %d', R.othersBefore.length);
await page.screenshot({path:`${DIR}/evidence/P04-1-start.png`, fullPage:true}).catch(()=>{});

// ---- the CANCEL path first, so nothing is changed if the run dies here (C53530)
const other = /legacy/i.test(R.start.value||'') ? 'Modern' : 'Legacy';
R.optionsSeen = (await pick(other)).list;
await page.waitForTimeout(2500);
R.dialogCancel = await dialog();
log('options offered: %s', JSON.stringify(R.optionsSeen));
log('dialog on switching to %s: %s', other, JSON.stringify(R.dialogCancel).slice(0,420));
await page.screenshot({path:`${DIR}/evidence/P04-2-dialog-${other}.png`, fullPage:true}).catch(()=>{});
R.cancelClicked = await clickBtn('^cancel$');
await page.waitForTimeout(3500);
R.afterCancel = await readControl();
log('after Cancel the control reads: %s (was %s) -> reverted: %s',
  R.afterCancel.value, R.start.value, R.afterCancel.value===R.start.value);
save();

// ---- now actually switch, and read the toast (C53524/25/26)
await armToasts();
await pick(other);
await page.waitForTimeout(2500);
R.dialogConfirm = await dialog();
R.confirmClicked = await clickBtn(`switch to ${other}`);
await page.waitForTimeout(6000);
R.toastsOnSave = await toasts();
R.afterSwitch = await readControl();
log('confirm button pressed: %s | messages: %s', R.confirmClicked, JSON.stringify(R.toastsOnSave));
log('control now reads: %s', R.afterSwitch.value);
await page.screenshot({path:`${DIR}/evidence/P04-3-after-switch.png`, fullPage:true}).catch(()=>{});
save();

// ---- does it persist across a reload? (C53526)
await openInvoiceTab();
R.afterReload = await readControl();
R.othersAfter = await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-toggle')].filter(isVis)
    .map(e=>({lab:((e.closest('div')||e).innerText||'').replace(/\s+/g,' ').trim().slice(0,42),
      on:e.classList.contains('q-toggle--truthy')||e.getAttribute('aria-checked')==='true'}));}, VIS);
R.othersUnchanged = JSON.stringify(R.othersBefore)===JSON.stringify(R.othersAfter);
log('after reload: %s | the other settings are unchanged: %s', R.afterReload.value, R.othersUnchanged);
save();

// ---- switch back, proving it can be changed both ways with no limit (C53528)
await armToasts();
await pick(R.start.value);
await page.waitForTimeout(2500);
R.dialogBack = await dialog();
await clickBtn(`switch to ${R.start.value}`);
await page.waitForTimeout(6000);
R.toastsBack = await toasts();
await openInvoiceTab();
R.afterBack = await readControl();
log('dialog going back: %s', JSON.stringify(R.dialogBack).slice(0,300));
log('back to: %s | restored to where we found it: %s', R.afterBack.value, R.afterBack.value===R.start.value);
await page.screenshot({path:`${DIR}/evidence/P04-4-restored.png`, fullPage:true}).catch(()=>{});
save();
log('done');
await s.browser.close();
process.exit(0);
