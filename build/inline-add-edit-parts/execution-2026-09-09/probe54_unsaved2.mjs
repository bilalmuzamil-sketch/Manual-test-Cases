// Unsaved Data Protection, second pass: C45070 (edit-row discard wording), C45078 (unchanged edit
// row closes and navigates freely) and C45080 re-run with a deliberately inert click target.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','tech'); const { page, APP } = s;
const R={};
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
const rowOpen=()=>page.evaluate(()=>document.querySelectorAll('[data-test-id=input_inline_part_description]').length);
const dialogs=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('.q-dialog')].filter(isVis).map(d=>{
    const btns=[...d.querySelectorAll('button,.q-btn')].filter(isVis); const a=document.activeElement;
    return {text:t(d).slice(0,200), buttons:btns.map(t), focused:a?(t(a)||a.tagName).slice(0,30):null,
      focusedIsButton:btns.some(b=>b===a||b.contains(a))};});}, VIS);
const openEdit=(needle)=>page.evaluate(n=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&t(e)===n)[0];
  if(!hit) return 'row not found';
  let box=hit; for(let i=0;i<9&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id^=button_edit_part_]')) break;}
  const e=box.querySelector('[data-test-id^=button_edit_part_]'); if(!e) return 'no edit control';
  e.scrollIntoView({block:'center'}); e.click(); return 'opened';}, needle);
const navAway=()=>page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const l=[...document.querySelectorAll('a,.q-item,.q-tab')].find(x=>/^(schedule|customers)$/i.test(t(x)));
  if(l){ l.click(); return t(l); } history.back(); return '(browser back)';});
const NEEDLE='ZZAUTOTEST tv enter save';

// ---- C45070: the edit-row discard confirmation, word for word + default focus
await fresh();
R.open = await openEdit(NEEDLE); await page.waitForTimeout(6500);
await page.fill('[data-test-id=input_inline_part_quantity]','11'); await page.waitForTimeout(1500);
await page.keyboard.press('Escape'); await page.waitForTimeout(4000);
R.C45070 = await dialogs();
log('C45070 edit discard dialog:', JSON.stringify(R.C45070));
await page.screenshot({path:`${DIR}/evidence/54-a-editdiscard.png`, fullPage:true});
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const b=d&&[...d.querySelectorAll('button,.q-btn')].filter(isVis).find(x=>/discard/i.test(t(x))); b&&b.click();}, VIS);
await page.waitForTimeout(3500);

// ---- C45078: an UNCHANGED edit row closes, and navigates away, with no confirmation
await fresh();
await openEdit(NEEDLE); await page.waitForTimeout(6500);
const cc = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=document.querySelector('[data-test-id=input_inline_part_description]'); if(!d) return 'no row';
  let b=d; for(let i=0;i<9&&b.parentElement;i++){b=b.parentElement; if(b.querySelector('[data-test-id=button_save_inline_part]')) break;}
  const x=b.querySelector('[data-test-id=button_cancel_inline_part]'); if(!x) return 'no cancel'; x.click(); return t(x)||'(icon)';}, VIS);
await page.waitForTimeout(3500);
R.C45078close = { clicked:cc, rows: await rowOpen(), dialogs: await dialogs() };
log('C45078 close unchanged edit row:', JSON.stringify(R.C45078close));
await fresh();
await openEdit(NEEDLE); await page.waitForTimeout(6500);
const nv = await navAway(); await page.waitForTimeout(5000);
R.C45078nav = { navVia:nv, dialogs: await dialogs(), url: page.url() };
log('C45078 navigate from unchanged edit row:', JSON.stringify(R.C45078nav));

// ---- C45080 re-run: click a deliberately inert spot (the left info panel's blank area)
await fresh();
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
await page.waitForTimeout(4500);
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST outside2');
await page.fill('[data-test-id=input_inline_part_quantity]','2'); await page.waitForTimeout(1500);
R.clickTarget = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  // a plain text label in the left-hand work order panel - not a link, not a button
  const el=[...document.querySelectorAll('div,span,p')].find(e=>e.children.length===0 && /^Service advisor$|^Lead technician$|^Progress$/.test(t(e)));
  if(!el) return null; const r=el.getBoundingClientRect();
  return {label:t(el), x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2)};});
log('C45080 inert click target:', JSON.stringify(R.clickTarget));
if (R.clickTarget){ await page.mouse.click(R.clickTarget.x, R.clickTarget.y); await page.waitForTimeout(4500); }
R.C45080 = { rows: await rowOpen(), dialogs: await dialogs(), url: page.url(),
  desc: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_description]')?.value),
  qty: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_quantity]')?.value) };
log('C45080 after inert click:', JSON.stringify(R.C45080));
await page.screenshot({path:`${DIR}/evidence/54-b-outside.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/54-unsaved2.json`, JSON.stringify(R,null,1));
await s.browser.close();

// ---- C45081 isolated re-run (probe 48 saw the leave dialog on an UNTOUCHED follow-on row).
// Three legs on one page load each, so no leftover state can explain it:
//   (a) row opened by Add Part, untouched, navigate  -> expect no dialog (this is C45077)
//   (b) row saved, follow-on row untouched, navigate -> the case says: no dialog
//   (c) row saved, follow-on row untouched, DISMISS with the close control -> no confirmation
const s2 = await boot('sv9315','/workorders','tech'); const page2 = s2.page; const APP2 = s2.APP;
const R2={};
const fresh2=async()=>{await page2.goto(`${APP2}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page2.waitForTimeout(9000);
  await page2.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page2.waitForTimeout(7000);};
const dlg2=()=>page2.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('.q-dialog')].filter(isVis).map(d=>t(d).slice(0,140));}, VIS);
const nav2=()=>page2.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const l=[...document.querySelectorAll('a,.q-item,.q-tab')].find(x=>/^schedule$/i.test(t(x)));
  if(l){l.click(); return t(l);} return 'none';});
const addRow2=()=>page2.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});

// (a) control leg
await fresh2(); await addRow2(); await page2.waitForTimeout(4500);
await nav2(); await page2.waitForTimeout(5000);
R2.legA = { dialogs: await dlg2(), url: page2.url() };
log('C45081 leg A (plain empty row, navigate):', JSON.stringify(R2.legA));

// (b) follow-on row leg
await fresh2(); await addRow2(); await page2.waitForTimeout(4500);
await page2.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST followon2');
await page2.fill('[data-test-id=input_inline_part_quantity]','1'); await page2.waitForTimeout(1500);
await page2.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page2.waitForTimeout(9000);
R2.legBrow = await page2.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
  return d? {open:true, desc:d.value, qty:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value}:{open:false};});
await nav2(); await page2.waitForTimeout(5000);
R2.legB = { row:R2.legBrow, dialogs: await dlg2(), url: page2.url() };
log('C45081 leg B (follow-on row, navigate):', JSON.stringify(R2.legB));
await page2.screenshot({path:`${DIR}/evidence/54-c-followon.png`, fullPage:true});

// (c) dismissal leg
await fresh2(); await addRow2(); await page2.waitForTimeout(4500);
await page2.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST followon3');
await page2.fill('[data-test-id=input_inline_part_quantity]','1'); await page2.waitForTimeout(1500);
await page2.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page2.waitForTimeout(9000);
await page2.evaluate(()=>document.querySelector('[data-test-id=button_cancel_inline_part]')?.click());
await page2.waitForTimeout(4000);
R2.legC = { dialogs: await dlg2(),
  rows: await page2.evaluate(()=>document.querySelectorAll('[data-test-id=input_inline_part_description]').length) };
log('C45081 leg C (follow-on row, dismiss):', JSON.stringify(R2.legC));
fs.writeFileSync(`${DIR}/evidence/54-c45081.json`, JSON.stringify(R2,null,1));
await s2.browser.close();
