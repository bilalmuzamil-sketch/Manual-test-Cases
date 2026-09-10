// Unsaved Data Protection (Story 6): C45069-C45083. Run in Full View (admin).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const R={};
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(6000);};
const openRow=async(idx=0)=>page.evaluate(i=>{const bs=[...document.querySelectorAll('[data-test-id=button_add_part]')];
  if(!bs[i]) return 'no add button '+i; bs[i].scrollIntoView({block:'center'}); bs[i].click(); return 'clicked';}, idx);
const rowOpen=()=>page.evaluate(()=>document.querySelectorAll('[data-test-id=input_inline_part_description]').length);
const dialogs=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('.q-dialog')].filter(isVis).map(d=>{
    const btns=[...d.querySelectorAll('button,.q-btn')].filter(isVis);
    const a=document.activeElement;
    return {title:t(d.querySelector('.text-h6,.q-card__section')||d).slice(0,80), text:t(d).slice(0,200),
      buttons:btns.map(t), focused:a?(t(a)||a.tagName).slice(0,30):null,
      focusedIsButton:btns.some(b=>b===a||b.contains(a))};});}, VIS);
const closeCtl=async()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=document.querySelector('[data-test-id=input_inline_part_description]'); if(!d) return 'no row';
  let box=d; for(let i=0;i<9&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id=button_save_inline_part]')) break;}
  const b=box.querySelector('[data-test-id=button_cancel_inline_part]')||[...box.querySelectorAll('button,.q-btn')].filter(isVis).find(x=>/^(cancel|×|close)$/i.test(t(x)));
  if(!b) return 'not found'; b.click(); return t(b)||'(icon)';}, VIS);
const dlgClick=async(re)=>page.evaluate((vis,rx)=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return 'no dialog';
  const b=[...d.querySelectorAll('button,.q-btn')].filter(isVis).find(x=>new RegExp(rx,'i').test(t(x)));
  if(!b) return 'no button'; b.click(); return t(b);}, VIS, re);
const navAway=async()=>page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const l=[...document.querySelectorAll('a,.q-item,.q-tab')].find(x=>/^(schedule|customers|invoices|dashboard)$/i.test(t(x)));
  if(l){ l.click(); return t(l); } history.back(); return '(browser back)';});
const fill=async(d,q)=>{ await page.fill('[data-test-id=input_inline_part_description]',d);
  await page.fill('[data-test-id=input_inline_part_quantity]',q); await page.waitForTimeout(1500); };

// ===== C45069 + C45071 + C45072a ======================================
await fresh(); await openRow(); await page.waitForTimeout(4000);
await fill('ZZAUTOTEST unsaved A','2');
await page.keyboard.press('Escape'); await page.waitForTimeout(3500);
R.C45069 = await dialogs();
log('C45069 discard-part dialog:', JSON.stringify(R.C45069));
await page.screenshot({path:`${DIR}/evidence/48-a-discardpart.png`, fullPage:true});
R.C45071click = await dlgClick('keep editing'); await page.waitForTimeout(3000);
R.C45071 = { rows: await rowOpen(),
  desc: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_description]')?.value),
  qty: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_quantity]')?.value),
  dialogs: await dialogs() };
log('C45071 Keep Editing:', JSON.stringify(R.C45071));
await page.keyboard.press('Escape'); await page.waitForTimeout(3000);
R.C45072aClick = await dlgClick('discard'); await page.waitForTimeout(3000);
R.C45072a = { rows: await rowOpen(), present: await page.evaluate(()=>/ZZAUTOTEST unsaved A/.test(document.body.innerText||'')) };
log('C45072a Discard Part on add row:', JSON.stringify(R.C45072a));

// ===== C45076 empty row closes with no confirmation ====================
await fresh(); await openRow(); await page.waitForTimeout(4000);
const cc = await closeCtl(); await page.waitForTimeout(3000);
R.C45076 = { clicked:cc, rows: await rowOpen(), dialogs: await dialogs() };
log('C45076 empty close:', JSON.stringify(R.C45076));

// ===== C45073 + C45083 + C45082 navigate away with data ================
await fresh(); await openRow(); await page.waitForTimeout(4000);
await fill('ZZAUTOTEST unsaved nav','3');
const navLabel = await navAway(); await page.waitForTimeout(4000);
R.C45073 = { navVia:navLabel, dialogs: await dialogs(), url: page.url() };
log('C45073 navigate-away dialog (via %s):', navLabel, JSON.stringify(R.C45073));
await page.screenshot({path:`${DIR}/evidence/48-b-leaveconfirm.png`, fullPage:true});
R.C45083click = await dlgClick('stay'); await page.waitForTimeout(4000);
R.C45083 = { url: page.url(), rows: await rowOpen(),
  desc: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_description]')?.value),
  qty: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_quantity]')?.value),
  focus: await page.evaluate(()=>{const a=document.activeElement; return a?{tid:a.getAttribute&&a.getAttribute('data-test-id'),tag:a.tagName}:null;}) };
log('C45083 Stay on Work Order:', JSON.stringify(R.C45083));
const nav2 = await navAway(); await page.waitForTimeout(4000);
R.C45082click = await dlgClick('^leave$'); await page.waitForTimeout(6000);
R.C45082 = { navVia:nav2, url: page.url(), rows: await rowOpen() };
log('C45082 Leave:', JSON.stringify(R.C45082));

// ===== C45077 / C45079 navigation with an empty row / no row ===========
await fresh(); await openRow(); await page.waitForTimeout(4000);
const nav3 = await navAway(); await page.waitForTimeout(5000);
R.C45077 = { navVia:nav3, dialogs: await dialogs(), url: page.url() };
log('C45077 navigate with empty row:', JSON.stringify(R.C45077));
await fresh();
const nav4 = await navAway(); await page.waitForTimeout(5000);
R.C45079 = { navVia:nav4, dialogs: await dialogs(), url: page.url() };
log('C45079 navigate with no row:', JSON.stringify(R.C45079));

// ===== C45080 click outside never triggers a leave confirmation ========
await fresh(); await openRow(); await page.waitForTimeout(4000);
await fill('ZZAUTOTEST unsaved outside','2');
const bx = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
  const r=d.getBoundingClientRect(); return {x:Math.round(r.x), y:Math.round(r.y)};});
await page.mouse.click(Math.max(12,bx.x-70), Math.max(120,bx.y-170)); await page.waitForTimeout(4000);
R.C45080 = { dialogs: await dialogs(), rows: await rowOpen(),
  desc: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_description]')?.value) };
log('C45080 click outside:', JSON.stringify(R.C45080));

// ===== C45074 / C45075 open another row while this one has data ========
await fresh(); await openRow(0); await page.waitForTimeout(4000);
await fill('ZZAUTOTEST unsaved swap','2');
const other = await openRow(1); await page.waitForTimeout(4000);
R.C45074 = { openOther:other, dialogs: await dialogs(), rows: await rowOpen() };
log('C45074/75 open another row:', JSON.stringify(R.C45074));
await page.screenshot({path:`${DIR}/evidence/48-c-swap.png`, fullPage:true});
if ((R.C45074.dialogs||[]).length){
  R.C45074keep = await dlgClick('keep editing'); await page.waitForTimeout(3000);
  R.C45074afterKeep = { rows: await rowOpen(),
    desc: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_description]')?.value) };
  log('C45074 Keep Editing:', JSON.stringify(R.C45074afterKeep));
  await openRow(1); await page.waitForTimeout(3500);
  R.C45074disc = await dlgClick('discard'); await page.waitForTimeout(4000);
  R.C45074afterDiscard = { rows: await rowOpen(),
    desc: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_description]')?.value) };
  log('C45074 Discard Part -> other row:', JSON.stringify(R.C45074afterDiscard));
}

// ===== C45081 untouched follow-on row after a save =====================
await fresh(); await openRow(); await page.waitForTimeout(4000);
await fill('ZZAUTOTEST unsaved followon','1');
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(8000);
R.C45081rowAfterSave = await rowOpen();
const nav5 = await navAway(); await page.waitForTimeout(5000);
R.C45081 = { rowAfterSave:R.C45081rowAfterSave, navVia:nav5, dialogs: await dialogs(), url: page.url() };
log('C45081 follow-on row:', JSON.stringify(R.C45081));
fs.writeFileSync(`${DIR}/evidence/48-unsaved.json`, JSON.stringify(R,null,1));
await s.browser.close();
