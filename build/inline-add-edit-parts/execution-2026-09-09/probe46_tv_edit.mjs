// Tech View Inline Edit: C45023 C45024 C45025 C45026 C45027 C45029 C45030 C45031 C45033 C45034.
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
const focusInfo=()=>page.evaluate(()=>{const a=document.activeElement; if(!a) return null;
  const p=a.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return {tid:a.getAttribute&&a.getAttribute('data-test-id'), label:l?t(l):null, tag:a.tagName, text:t(a).slice(0,30)};});
const dialogs=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('.q-dialog')].filter(isVis).map(d=>({text:t(d).slice(0,180),
    buttons:[...d.querySelectorAll('button,.q-btn')].filter(isVis).map(t)}));}, VIS);
const msgs=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...new Set([...document.querySelectorAll('.q-field__messages,.text-negative,[role=alert],.q-notification')]
    .filter(isVis).map(t).filter(Boolean))].filter(m=>!/Credit Hold|Build Lines|location_on|^\$/.test(m));}, VIS);
// open the edit row on the part whose description matches `needle`
const openEdit=async(needle)=>page.evaluate(n=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&t(e)===n)[0];
  if(!hit) return 'row not found';
  let box=hit; for(let i=0;i<9&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id^=button_edit_part_]')) break;}
  const e=box.querySelector('[data-test-id^=button_edit_part_]'); if(!e) return 'no edit control';
  e.scrollIntoView({block:'center'}); e.click(); return 'opened';}, needle);
const rowState=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=document.querySelector('[data-test-id=input_inline_part_description]');
  if(!d) return {open:false};
  let box=d; for(let i=0;i<9&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id=button_save_inline_part]')) break;}
  const f=[...box.querySelectorAll('input,select')].filter(isVis).map(i=>({tid:i.getAttribute('data-test-id'),
    label:(()=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l?t(l):null;})(),
    value:i.value, x:Math.round(i.getBoundingClientRect().x)})).sort((a,b)=>a.x-b.x);
  return {open:true, order:f.map(x=>x.label||x.tid), fields:f,
    buttons:[...box.querySelectorAll('button,.q-btn')].filter(isVis).map(t),
    hasMoreOptions:!!box.querySelector('[data-test-id=button_more_options_inline_part]'),
    hasCost:!!box.querySelector('[data-test-id=input_inline_part_cost]'),
    hasSell:!!box.querySelector('[data-test-id=input_inline_part_sell_price]'),
    hasCategory:!!box.querySelector('[data-test-id=select_inline_part_category]'),
    hint:(document.body.innerText.match(/Enter[^\n]{0,60}/g)||[]).slice(0,3)};}, VIS);

const NEEDLE='ZZAUTOTEST tv validation';
// ===== C45023 / C45024 / C45025 ========================================
await fresh();
R.open1 = await openEdit(NEEDLE); await page.waitForTimeout(6000);
R.editRow = await rowState();
R.editFocus = await focusInfo();
log('C45023/24 open=%s row=%s', R.open1, JSON.stringify(R.editRow));
log('C45024 focus:', JSON.stringify(R.editFocus));
await page.screenshot({path:`${DIR}/evidence/46-a-editrow.png`, fullPage:true});
// C45025 tab order
await page.click('[data-test-id=input_inline_part_description]');
const stops=[]; for(let i=0;i<6;i++){ stops.push(await focusInfo()); await page.keyboard.press('Tab'); await page.waitForTimeout(700);} stops.push(await focusInfo());
R.editTab = stops; log('C45025 edit tab stops:', JSON.stringify(stops));

// ===== C45031 open, change nothing, close ==============================
await fresh(); await openEdit(NEEDLE); await page.waitForTimeout(6000);
await page.keyboard.press('Escape'); await page.waitForTimeout(3500);
R.noChangeClose = { dialogs: await dialogs(), rowOpen:(await rowState()).open,
  stillThere: await page.evaluate(n=>new RegExp(n).test(document.body.innerText||''), NEEDLE) };
log('C45031 no-change close:', JSON.stringify(R.noChangeClose));

// ===== C45033 clear the description and save ===========================
await fresh(); await openEdit(NEEDLE); await page.waitForTimeout(6000);
await page.fill('[data-test-id=input_inline_part_description]','');
await page.waitForTimeout(1200);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(4500);
R.clearDesc = { messages: await msgs(), rowOpen:(await rowState()).open,
  errFields: await page.evaluate(()=>[...document.querySelectorAll('.q-field--error')].map(f=>{const l=f.querySelector('.q-field__label'); return l?l.textContent.trim():null;})) };
log('C45033 cleared description:', JSON.stringify(R.clearDesc));

// ===== C45029 change a field then Escape -> guard, Discard =============
await fresh(); await openEdit(NEEDLE); await page.waitForTimeout(6000);
const qtyBefore = await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_quantity]')?.value);
await page.fill('[data-test-id=input_inline_part_quantity]','7'); await page.waitForTimeout(1500);
await page.keyboard.press('Escape'); await page.waitForTimeout(4000);
R.editGuard = { qtyBefore, dialogs: await dialogs() };
log('C45029 guard:', JSON.stringify(R.editGuard));
await page.screenshot({path:`${DIR}/evidence/46-b-editguard.png`, fullPage:true});
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const b=d&&[...d.querySelectorAll('button,.q-btn')].filter(isVis).find(x=>/discard|yes|leave/i.test(t(x))); b&&b.click();}, VIS);
await page.waitForTimeout(5000);
R.afterDiscard = { rowOpen:(await rowState()).open,
  rowText: await page.evaluate(n=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&t(e)===n)[0];
    if(!hit) return null; let box=hit; for(let i=0;i<8&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id^=button_edit_part_]')) break;}
    return (box.innerText||'').replace(/\s+/g,' ').trim().slice(0,120);}, NEEDLE) };
log('C45029 after Discard:', JSON.stringify(R.afterDiscard));

// ===== C45026 / C45027 / C45034 save an edit ===========================
await fresh(); await openEdit(NEEDLE); await page.waitForTimeout(6000);
await page.fill('[data-test-id=input_inline_part_quantity]','5'); await page.waitForTimeout(1500);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(8000);
R.editSave = { rowOpen:(await rowState()).open, dialogs: await dialogs(), messages: await msgs(),
  rowText: await page.evaluate(n=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&t(e)===n)[0];
    if(!hit) return null; let box=hit; for(let i=0;i<8&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id^=button_edit_part_]')) break;}
    return (box.innerText||'').replace(/\s+/g,' ').trim().slice(0,120);}, NEEDLE) };
log('C45026/27/34 edit save:', JSON.stringify(R.editSave));
await page.screenshot({path:`${DIR}/evidence/46-c-editsaved.png`, fullPage:true});

// ===== C45030 link a different catalog part in the edit row ============
await fresh(); await openEdit(NEEDLE); await page.waitForTimeout(6000);
await page.fill('[data-test-id=input_inline_part_quantity]','6'); await page.waitForTimeout(1000);
await page.click('[data-test-id=select_inline_part_number]');
await page.keyboard.type('OIL',{delay:110}); await page.waitForTimeout(6500);
const picked = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const menu=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop();
  if(!menu) return 'no menu'; const it=[...menu.querySelectorAll('.q-item')].filter(isVis)[0];
  if(!it) return 'no items'; const label=t(it).slice(0,60); it.click(); return label;}, VIS);
await page.waitForTimeout(6000);
R.relink = { picked, state: await rowState(), focus: await focusInfo() };
log('C45030 relink:', JSON.stringify(R.relink));
await page.screenshot({path:`${DIR}/evidence/46-d-relink.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/46-tv-edit.json`, JSON.stringify(R,null,1));
await s.browser.close();
