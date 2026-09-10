// Printer Friendly WO (suite 6617), first pass — the More menu cases.
//   C45084 "Print Work Order" appears in the More menu
//   C45085 it is labelled exactly that, text only, no icon, like its neighbours
//   C45086 it sits below Timesheets and above Delete Work Order
//   C45087 selecting it opens the browser's print dialog (window.print is hooked to catch the call,
//          since a native dialog cannot be seen from the page)
//   C45088 the option is there on every work order status
//   C45091 it is disabled until the line item data has actually loaded
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/execution-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/01-moremenu.json`, JSON.stringify(R,null,1));
fs.mkdirSync(`${DIR}/evidence`, {recursive:true});
const api = (path)=>page.evaluate(async ({api,path})=>{
  const r=await fetch(`https://${api}${path}`,{headers:{Accept:'application/json'}, credentials:'include'});
  let j=null; try{ j=await r.json(); }catch(e){}
  return {status:r.status, json:j};}, {api:APIH, path});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

// one work order per status, so C45088 is answered from real records
const list = await api('/api/work-orders?limit=100&page=1');
const byStatus={};
for (const w of rowsOf(list.json)){ const st=String(w.status||'').toLowerCase(); if(!byStatus[st]) byStatus[st]={id:w.id, num:w.number}; }
R.statuses = byStatus;
log('a work order for each status:', JSON.stringify(byStatus));
save();

const openMenu = async (woId)=>{
  await page.goto(`${APP}/workorders/${woId}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(11000);
  // hook window.print BEFORE anything is clicked
  await page.evaluate(()=>{ window.__printCalls=0; const orig=window.print;
    window.print=function(){ window.__printCalls++; /* do not call orig: a native dialog would hang the run */ }; });
  const opened = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    // the toolbar's three-dots button
    const cands=[...document.querySelectorAll('button,.q-btn')].filter(isVis)
      .filter(b=>/more_vert|⋮/.test(t(b)) || /more/i.test(b.getAttribute('aria-label')||''));
    if(!cands.length) return {ok:false, why:'no three-dots button', buttons:[...document.querySelectorAll('button')].filter(isVis).map(t).slice(0,14)};
    const top=cands.sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0];
    top.click(); return {ok:true};}, VIS);
  await page.waitForTimeout(3000);
  return opened;
};
const menuItems = ()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop(); if(!m) return {open:false};
  return {open:true, items:[...m.querySelectorAll('.q-item')].filter(isVis).map(it=>({
    text:t(it),
    hasIcon: !!it.querySelector('.q-icon,i.material-icons,img,svg'),
    disabled: it.classList.contains('disabled') || it.getAttribute('aria-disabled')==='true'
              || getComputedStyle(it).pointerEvents==='none' || parseFloat(getComputedStyle(it).opacity)<0.6}))};}, VIS);

// ---- the editable work order first: C45084 / C45085 / C45086 / C45087
const first = byStatus['approved'] || byStatus['estimate'] || Object.values(byStatus)[0];
R.open = await openMenu(first.id);
R.menu = await menuItems();
log('More menu on %s: %s', first.num, JSON.stringify(R.menu).slice(0,600));
await page.screenshot({path:`${DIR}/evidence/01-a-moremenu.png`, fullPage:true});
save();
if (R.menu.open){
  const labels = R.menu.items.map(i=>i.text);
  R.C45084 = labels.some(l=>/print work order/i.test(l));
  R.C45085 = R.menu.items.find(i=>/print work order/i.test(i.text));
  R.C45086 = {order:labels,
    printIdx: labels.findIndex(l=>/print work order/i.test(l)),
    timesheetsIdx: labels.findIndex(l=>/timesheet/i.test(l)),
    deleteIdx: labels.findIndex(l=>/delete work order/i.test(l))};
  log('C45084 present=%s | C45085 item=%s', R.C45084, JSON.stringify(R.C45085));
  log('C45086 order=%s', JSON.stringify(R.C45086));
  // C45087 — click it and see whether window.print was called
  R.C45087click = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop(); if(!m) return 'no menu';
    const it=[...m.querySelectorAll('.q-item')].filter(isVis).find(x=>/print work order/i.test(t(x)));
    if(!it) return 'no print item'; it.click(); return 'clicked';}, VIS);
  await page.waitForTimeout(6000);
  R.C45087 = {clicked:R.C45087click, printCalls: await page.evaluate(()=>window.__printCalls)};
  log('C45087 %s -> window.print called %s time(s)', R.C45087click, R.C45087.printCalls);
  await page.screenshot({path:`${DIR}/evidence/01-b-afterprint.png`, fullPage:true});
  save();
}
// ---- C45088: the option on every status we can reach
R.byStatus={};
for (const [st, wo] of Object.entries(byStatus)){
  const o = await openMenu(wo.id);
  const m = await menuItems();
  R.byStatus[st] = m.open ? {num:wo.num, items:m.items.map(i=>i.text),
    hasPrint:m.items.some(i=>/print work order/i.test(i.text)),
    printDisabled:(m.items.find(i=>/print work order/i.test(i.text))||{}).disabled} : {num:wo.num, menu:'did not open', why:o.why};
  log('C45088 %-16s -> %s', st, JSON.stringify(R.byStatus[st]).slice(0,220));
  save();
}
await s.browser.close();
