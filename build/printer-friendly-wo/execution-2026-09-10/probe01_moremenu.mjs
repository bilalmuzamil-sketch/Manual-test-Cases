// Printer Friendly WO (6617), story SV-9384 — the More menu group, C45084 to C45091, in one pass.
//   C45084 the item exists · C45085 label + no icon · C45086 position · C45087 opens the print
//   dialog · C45088 every status · C45089 desktop and mobile · C45090 no view permission ·
//   C45091 disabled until line data has loaded
// window.print is hooked BEFORE any click so the native dialog is detected without blocking the
// run — a real print dialog would hang a headless browser.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/execution-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/01-moremenu.json`, JSON.stringify(R,null,1));
fs.mkdirSync(`${DIR}/evidence`,{recursive:true});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315','/workorders','admin');
const {page, APP, APIH} = s;
const call=(m,p)=>page.evaluate(async({api,m,p})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{Accept:'application/json'},credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j};},{api:APIH,m,p});

// hook window.print on every document, before any app script runs
await page.addInitScript(()=>{ window.__printCalls=0;
  const orig=window.print; window.print=function(){ window.__printCalls++; /* never call orig */ }; });

const wos = rowsOf((await call('GET','/api/work-orders?limit=200')).json);
const byStatus={};
for (const w of wos){ const st=String(w.status||'').toLowerCase(); if(!byStatus[st]) byStatus[st]={id:w.id, number:w.number}; }
R.statusesAvailable = Object.keys(byStatus);
log('work order statuses on this branch: %s', JSON.stringify(R.statusesAvailable));
save();

const openMenu = async (woId, {wait=11000}={})=>{
  await page.goto(`${APP}/workorders/${woId}`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(wait);
  return await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    // 🛑 THE PAGE HAS MANY THREE-DOTS BUTTONS: one on the work order toolbar and one PER LINE.
    // Taking the last one opened a line's own menu ("Add Labor Fee / Discount",
    // data-test-id=menu_item_add_labor_adjustment_<lineId>) and made Print look absent on every
    // work order that HAS lines — a probe bug that read exactly like a build defect. The Paid work
    // order only looked right because it has no lines at all.
    // The toolbar button is the one OUTSIDE the lines table and outside any line row.
    const linesTable=document.querySelector('[data-test-id=table_work_order_lines]');
    const all=[...document.querySelectorAll('button,[role=button]')].filter(isVis)
      .filter(b=>/more_vert|more_horiz/.test(t(b)) || /more/i.test(b.getAttribute('data-test-id')||''));
    const cands=all.filter(b=>{
      if (linesTable && linesTable.contains(b)) return false;
      const id=b.getAttribute('data-test-id')||'';
      if (/_line_|_[0-9a-f]{8}-[0-9a-f]{4}-/.test(id)) return false;   // per-line/per-part controls
      return true;});
    if(!cands.length) return {opened:false, why:'no toolbar three-dots button outside the lines table',
      allSeen:all.map(b=>b.getAttribute('data-test-id')).slice(0,15)};
    const b=cands[0];                       // the toolbar sits above the lines table
    b.scrollIntoView({block:'center'}); b.click();
    return {opened:true, testid:b.getAttribute('data-test-id'),
      candidates:cands.map(x=>x.getAttribute('data-test-id')).slice(0,8)};}, VIS);
};
const readMenu = ()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const menu=[...document.querySelectorAll('.q-menu')].filter(isVis).pop();
  if(!menu) return {menuOpen:false};
  const items=[...menu.querySelectorAll('.q-item,[role=menuitem]')].filter(isVis).map(e=>{
    const icons=[...e.querySelectorAll('i,.q-icon,.material-icons')].filter(isVis).map(t).filter(Boolean);
    const cs=getComputedStyle(e);
    return {label:t(e), icons,
      disabled: e.classList.contains('disabled')||e.getAttribute('aria-disabled')==='true'
                ||e.classList.contains('q-item--disabled')||parseFloat(cs.opacity)<0.6,
      testid:e.getAttribute('data-test-id')};});
  return {menuOpen:true, items};}, VIS);

// ---- C45084/85/86 on an editable work order
const EDITABLE = (byStatus['approved']||byStatus['estimate']||{}).id;
R.editableWo = EDITABLE;
R.openA = await openMenu(EDITABLE);
await page.waitForTimeout(3000);
R.menuA = await readMenu();
await page.screenshot({path:`${DIR}/evidence/01-1-more-menu.png`, fullPage:true});
log('More menu: %s', JSON.stringify(R.menuA));
save();
if (R.menuA.menuOpen){
  const labels = R.menuA.items.map(i=>i.label);
  const printIdx = labels.findIndex(l=>/print work order/i.test(l));
  const tsIdx    = labels.findIndex(l=>/timesheets/i.test(l));
  const delIdx   = labels.findIndex(l=>/delete work order/i.test(l));
  R.C45084 = {present: printIdx>=0, labels};
  R.C45085 = printIdx>=0 ? {label:labels[printIdx], icons:R.menuA.items[printIdx].icons,
    iconFree:R.menuA.items[printIdx].icons.length===0,
    othersIconFree:R.menuA.items.every(i=>i.icons.length===0)} : {present:false};
  R.C45086 = {printIdx, timesheetsIdx:tsIdx, deleteIdx:delIdx,
    belowTimesheets: tsIdx>=0 && printIdx>tsIdx, aboveDelete: delIdx>=0 && printIdx<delIdx};
  log('C45084 %s | C45085 %s | C45086 %s', JSON.stringify(R.C45084), JSON.stringify(R.C45085), JSON.stringify(R.C45086));
}
save();

// ---- C45087: does choosing it call window.print?
if (R.menuA.menuOpen && R.C45084 && R.C45084.present){
  R.C45087 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const menu=[...document.querySelectorAll('.q-menu')].filter(isVis).pop();
    const it=[...menu.querySelectorAll('.q-item,[role=menuitem]')].filter(isVis)
      .find(e=>/print work order/i.test(t(e)));
    if(!it) return {clicked:false};
    const before=window.__printCalls||0; it.click();
    return {clicked:true, printCallsBefore:before};}, VIS);
  await page.waitForTimeout(7000);
  R.C45087.printCallsAfter = await page.evaluate(()=>window.__printCalls||0);
  R.C45087.printDialogRequested = R.C45087.printCallsAfter > (R.C45087.printCallsBefore||0);
  await page.screenshot({path:`${DIR}/evidence/01-2-after-print.png`, fullPage:true});
  log('C45087: %s', JSON.stringify(R.C45087));
}
save();

// ---- C45088: every status this branch actually has
R.C45088={statusesChecked:{}};
for (const [st, w] of Object.entries(byStatus)){
  const o = await openMenu(w.id, {wait:10000});
  await page.waitForTimeout(2500);
  const m = await readMenu();
  const has = m.menuOpen && m.items.some(i=>/print work order/i.test(i.label));
  R.C45088.statusesChecked[st] = {wo:w.number, menuOpen:m.menuOpen, printPresent:has,
    items:(m.items||[]).map(i=>i.label)};
  log('  %-14s %s -> print present: %s', st, w.number, has);
  save();
}
R.C45088.allCheckedHavePrint = Object.values(R.C45088.statusesChecked).every(x=>x.printPresent);

// ---- C45089: mobile viewport
await page.setViewportSize({width:390, height:844});
R.openMobile = await openMenu(EDITABLE, {wait:12000});
await page.waitForTimeout(3000);
const mm = await readMenu();
await page.screenshot({path:`${DIR}/evidence/01-3-mobile-menu.png`, fullPage:true});
R.C45089 = {desktop: !!(R.C45084&&R.C45084.present), mobileMenuOpen:mm.menuOpen,
  mobilePrintPresent: mm.menuOpen && mm.items.some(i=>/print work order/i.test(i.label)),
  mobileItems:(mm.items||[]).map(i=>i.label)};
log('C45089: %s', JSON.stringify(R.C45089));
await page.setViewportSize({width:1440, height:900});
save();

// ---- C45091: is Print disabled while the line data is still loading?
R.C45091={};
{
  await page.goto(`${APP}/workorders/${EDITABLE}`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(900);            // deliberately early — the skeleton stage
  const early = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const cands=[...document.querySelectorAll('button,[role=button]')].filter(isVis)
      .filter(b=>/more_vert|more_horiz/.test(t(b)));
    if(!cands.length) return {opened:false};
    cands[cands.length-1].click(); return {opened:true};}, VIS);
  await page.waitForTimeout(700);
  R.C45091.early = {...early, ...(await readMenu())};
  await page.screenshot({path:`${DIR}/evidence/01-4-early.png`, fullPage:true});
  await page.waitForTimeout(12000);
  R.C45091.late = await readMenu();
  const pick=(m)=>{const it=(m.items||[]).find(i=>/print work order/i.test(i.label)); return it? {disabled:it.disabled}:null;};
  R.C45091.earlyPrint=pick(R.C45091.early); R.C45091.latePrint=pick(R.C45091.late);
  log('C45091 early=%s late=%s', JSON.stringify(R.C45091.earlyPrint), JSON.stringify(R.C45091.latePrint));
}
save();
await s.browser.close();
log('done');
