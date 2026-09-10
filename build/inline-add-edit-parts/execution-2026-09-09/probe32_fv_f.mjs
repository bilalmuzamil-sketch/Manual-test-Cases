// Full View batch F: C45058 (what the cost box does with letters; sell price cases) ·
// C45054 (part flagged Requested / needs details) · C45040 clause 2 (no category -> Uncategorized) ·
// C45046 (save from the modal closes both, no new row) · C45060 (cost/sell for a part with none).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const R={};
const goto=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(10000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(6500);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4500);};
const msgs=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...new Set([...document.querySelectorAll('.q-field__messages,.text-negative,[role=alert],.q-notification')]
    .filter(isVis).map(t).filter(Boolean))].filter(m=>!/Credit Hold|Build Lines|location_on/.test(m));}, VIS);

await goto(); await openRow();
// ---- C45058 : what actually happens when letters are typed
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST letters');
await page.fill('[data-test-id=input_inline_part_quantity]','1');
await page.click('[data-test-id=input_inline_part_cost]');
await page.keyboard.type('abc123', {delay:60}); await page.waitForTimeout(1200);
R.C45058_costAfterLetters = await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_cost]')?.value);
await page.click('[data-test-id=input_inline_part_sell_price]');
await page.keyboard.type('-9', {delay:60}); await page.waitForTimeout(800);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(4500);
R.C45058_sellNegative = { sellValue: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_sell_price]')?.value),
                          messages: await msgs() };
log('C45058 cost box after typing "abc123":', JSON.stringify(R.C45058_costAfterLetters));
log('C45058 sell price "-9":', JSON.stringify(R.C45058_sellNegative));

// ---- C45054 : the saved free-typed part's status and needs-details flag
R.C45054_row = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/ZZAUTOTEST requested flow/.test(t(e)))[0];
  if(!hit) return {found:false};
  let box=hit; for(let i=0;i<7&&box.parentElement;i++){ box=box.parentElement; if(/Requested/i.test(t(box))) break; }
  return { found:true, rowText:t(box).slice(0,220),
           saysRequested:/Requested/i.test(t(box)),
           needsDetailsMarker:/needs? details|!|warning|error_outline|priority_high/i.test(t(box)) };}, VIS);
log('C45054 saved row:', JSON.stringify(R.C45054_row));

// ---- C45040 clause 2 : open that part's details and read its Category
const opened = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/ZZAUTOTEST requested flow/.test(t(e)))[0];
  if(!hit) return 'row not found';
  let box=hit; for(let i=0;i<8&&box.parentElement;i++){ box=box.parentElement;
    if(box.querySelector('[data-test-id^=button_edit_part_]')) break; }
  const e=box.querySelector('[data-test-id^=button_edit_part_]'); if(!e) return 'no edit control';
  e.scrollIntoView({block:'center'}); e.click(); return 'opened';});
log('open saved part:', opened);
await page.waitForTimeout(6000);
R.C45040_clause2 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(!d) return {modal:false};
  const cat=[...d.querySelectorAll('input')].find(i=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l&&/category/i.test(t(l));});
  const src=[...d.querySelectorAll('input')].find(i=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l&&/^source$/i.test(t(l));});
  return { modal:true, title:t(d.querySelector('.q-card__section,.text-h6')||d).slice(0,40),
           category:cat?cat.value:null, source:src?src.value:null };}, VIS);
log('C45040 clause 2 - saved part category:', JSON.stringify(R.C45040_clause2));
await page.screenshot({path:`${DIR}/evidence/32-a-category.png`, fullPage:true});

// ---- C45046 : save from the modal closes both and opens no new row
if (R.C45040_clause2.modal) { await page.keyboard.press('Escape'); await page.waitForTimeout(4000); }
await openRow();
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST modal-save');
await page.fill('[data-test-id=input_inline_part_quantity]','1');
await page.fill('[data-test-id=input_inline_part_cost]','3.00').catch(()=>{});
await page.fill('[data-test-id=input_inline_part_sell_price]','6.00').catch(()=>{});
await page.waitForTimeout(1000);
await page.evaluate(()=>document.querySelector('[data-test-id=button_more_options_inline_part]')?.click());
await page.waitForTimeout(5500);
const savedFromModal = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const b=[...d.querySelectorAll('button')].find(x=>/save part/i.test(t(x)));
  if(!b) return 'no Save part button'; if(b.disabled) return 'Save part DISABLED'; b.click(); return 'clicked Save part';});
log('C45046 modal save:', savedFromModal);
await page.waitForTimeout(8000);
R.C45046 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return { dialogsOpen:[...document.querySelectorAll('.q-dialog')].filter(isVis).length,
           inlineRowOpen:!!document.querySelector('[data-test-id=input_inline_part_description]'),
           toast:[...document.querySelectorAll('.q-notification')].filter(isVis).map(t),
           partPresent:/ZZAUTOTEST modal-save/.test(document.body.innerText||'') };}, VIS);
log('C45046 after saving from the modal:', JSON.stringify(R.C45046));
await page.screenshot({path:`${DIR}/evidence/32-b-modalsave.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/32-fv-f.json`, JSON.stringify(R,null,1));
await s.browser.close();
