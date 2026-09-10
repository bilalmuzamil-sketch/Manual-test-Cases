// Tech View: keyboard + close behaviour. C45008 C45009 C45010 C45011 C45012 C45019 C45020.
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
  await page.waitForTimeout(6000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4000);};
const rowOpen=()=>page.evaluate(()=>!!document.querySelector('[data-test-id=input_inline_part_description]'));
const partCount=()=>page.evaluate(()=>document.querySelectorAll('[data-test-id^=button_edit_part_]').length);
const focusInfo=()=>page.evaluate(()=>{const a=document.activeElement; if(!a) return null;
  const p=a.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return {tid:a.getAttribute&&a.getAttribute('data-test-id'), label:l?t(l):null, tag:a.tagName, text:t(a).slice(0,30)};});
const dialogs=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('.q-dialog')].filter(isVis).map(d=>({text:t(d).slice(0,160),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(isVis).map(t)}));}, VIS);

// ===== C45008 Enter from a field saves ==================================
await fresh(); await openRow();
const c8before = await partCount();
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST tv enter save');
await page.click('[data-test-id=input_inline_part_quantity]');
await page.keyboard.type('3',{delay:80});
await page.waitForTimeout(1200);
await page.keyboard.press('Enter');
await page.waitForTimeout(7000);
R.enterSave = { before:c8before, after: await partCount(), rowOpen: await rowOpen(),
  rowValue: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_description]')?.value),
  focus: await focusInfo(),
  toast: await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS) };
log('C45008 Enter saves:', JSON.stringify(R.enterSave));
await page.screenshot({path:`${DIR}/evidence/44-a-entersave.png`, fullPage:true});

// ===== C45009 Tab order =================================================
await fresh(); await openRow();
await page.click('[data-test-id=input_inline_part_description]');
const stops=[];
for (let i=0;i<7;i++){ stops.push(await focusInfo()); await page.keyboard.press('Tab'); await page.waitForTimeout(700); }
stops.push(await focusInfo());
R.tabOrder = stops;
log('C45009 tab stops:', JSON.stringify(stops));

// ===== C45010 Escape on an empty row ====================================
await fresh(); await openRow();
await page.keyboard.press('Escape');
await page.waitForTimeout(3500);
R.escEmpty = { rowOpen: await rowOpen(), dialogs: await dialogs() };
log('C45010/C45019 Escape on empty row:', JSON.stringify(R.escEmpty));

// ===== C45019 close control on an empty row =============================
await fresh(); await openRow();
const cancelClick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=document.querySelector('[data-test-id=input_inline_part_description]'); let box=d;
  for(let i=0;i<9&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id=button_save_inline_part]')) break;}
  const b=box.querySelector('[data-test-id=button_cancel_inline_part]')||[...box.querySelectorAll('button,.q-btn')].filter(isVis).find(x=>/^(cancel|×|close)$/i.test(t(x)));
  if(!b) return 'not found'; b.click(); return t(b)||'(icon)';}, VIS);
await page.waitForTimeout(3500);
R.cancelEmpty = { clicked:cancelClick, rowOpen: await rowOpen(), dialogs: await dialogs() };
log('C45019 close control on empty row:', JSON.stringify(R.cancelEmpty));

// ===== C45011 close control with data -> discard guard ==================
await fresh(); await openRow();
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST tv guard');
await page.fill('[data-test-id=input_inline_part_quantity]','2');
await page.waitForTimeout(1500);
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=document.querySelector('[data-test-id=input_inline_part_description]'); let box=d;
  for(let i=0;i<9&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id=button_save_inline_part]')) break;}
  const b=box.querySelector('[data-test-id=button_cancel_inline_part]')||[...box.querySelectorAll('button,.q-btn')].filter(isVis).find(x=>/^(cancel|×|close)$/i.test(t(x)));
  b&&b.click();}, VIS);
await page.waitForTimeout(4000);
R.guard = { dialogs: await dialogs(), rowOpen: await rowOpen() };
log('C45011 discard guard:', JSON.stringify(R.guard));
await page.screenshot({path:`${DIR}/evidence/44-b-guard.png`, fullPage:true});
// discard it
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const b=d&&[...d.querySelectorAll('button,.q-btn')].filter(isVis).find(x=>/discard|yes|leave/i.test(t(x))); b&&b.click();}, VIS);
await page.waitForTimeout(3000);
R.afterDiscard = { rowOpen: await rowOpen() };
log('C45011 after discard:', JSON.stringify(R.afterDiscard));

// ===== C45012 click outside a populated row =============================
await fresh(); await openRow();
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST tv outside');
await page.fill('[data-test-id=input_inline_part_quantity]','4');
await page.waitForTimeout(1500);
const box = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
  const r=d.getBoundingClientRect(); return {x:Math.round(r.x), y:Math.round(r.y)};});
await page.mouse.click(Math.max(12, box.x-60), Math.max(120, box.y-160));
await page.waitForTimeout(4000);
R.clickOutside = { rowOpen: await rowOpen(),
  desc: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_description]')?.value),
  qty: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_quantity]')?.value),
  dialogs: await dialogs() };
log('C45012 click outside:', JSON.stringify(R.clickOutside));
await page.screenshot({path:`${DIR}/evidence/44-c-outside.png`, fullPage:true});

// ===== C45020 the same part twice =======================================
await fresh(); await openRow();
const dupBefore = await partCount();
for (let i=0;i<2;i++){
  await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST tv duplicate');
  await page.fill('[data-test-id=input_inline_part_quantity]','1');
  await page.waitForTimeout(1200);
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(7000);
}
R.duplicate = { before:dupBefore, after: await partCount(),
  matches: await page.evaluate(()=>((document.body.innerText||'').match(/ZZAUTOTEST tv duplicate/g)||[]).length) };
log('C45020 duplicate part:', JSON.stringify(R.duplicate));
await page.screenshot({path:`${DIR}/evidence/44-d-duplicate.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/44-tv.json`, JSON.stringify(R,null,1));
await s.browser.close();
