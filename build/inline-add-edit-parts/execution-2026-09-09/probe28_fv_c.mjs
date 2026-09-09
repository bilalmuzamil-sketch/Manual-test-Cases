// Full View batch C: C45043 top-of-list proven by row ORDER · C45046 (save from modal closes both,
// no new row) · C45038 (catalog part fills cost/sell, $ prefix) · C45040 (category select; empty
// saves as Uncategorized) · C45042 (save needs description, qty, cost, sell).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const R={};
const open = async () => {
  await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(10000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(6500);
};
// part rows of the FIRST line, in visual order
const partOrder = () => page.evaluate(vis=>{
  const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const btns=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
  return btns.map(b=>{ const row=b.closest('tr')||b.parentElement.parentElement;
    return { y:Math.round(row.getBoundingClientRect().top+scrollY), text:t(row).slice(0,58) }; })
    .sort((a,b)=>a.y-b.y);
}, VIS);

await open();
R.orderBefore = await partOrder();
log('parts before (top first):'); R.orderBefore.slice(0,4).forEach(p=>log('   ', p.y, p.text));

// ---- C45043 : add a part and prove it lands at the TOP
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
await page.waitForTimeout(4500);
const TAG='ZZAUTOTEST top-check';
await page.fill('[data-test-id=input_inline_part_description]',TAG);
await page.fill('[data-test-id=input_inline_part_quantity]','1');
await page.fill('[data-test-id=input_inline_part_cost]','1.00').catch(()=>{});
await page.fill('[data-test-id=input_inline_part_sell_price]','2.00').catch(()=>{});
await page.waitForTimeout(1200);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(8000);
R.orderAfter = await partOrder();
log('parts after (top first):'); R.orderAfter.slice(0,4).forEach(p=>log('   ', p.y, p.text));
R.C45043_topIndex = R.orderAfter.findIndex(p=>p.text.includes('ZZAUTOTEST top-check'));
log('C45043 our part index among part rows (0 = top):', R.C45043_topIndex);
await page.screenshot({path:`${DIR}/evidence/28-a-top.png`, fullPage:true});

// ---- C45042 : try to save with fields missing
await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
  if(d){d.focus();}});
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST validation').catch(()=>{});
await page.waitForTimeout(800);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(4500);
R.C45042 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const msgs=[...document.querySelectorAll('.q-field__messages,.text-negative,[role=alert],.q-notification')]
    .filter(isVis).map(e=>t(e)).filter(Boolean).slice(0,6);
  return { rowStillOpen:!!document.querySelector('[data-test-id=input_inline_part_description]'),
           messages:msgs };}, VIS);
log('C45042 save with only a description:', JSON.stringify(R.C45042));
await page.screenshot({path:`${DIR}/evidence/28-b-validation.png`, fullPage:true});

// ---- C45040 : the category control
R.C45040 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const cat=document.querySelector('[data-test-id=select_inline_part_category]');
  if(!cat) return {found:false};
  const f=cat.closest('.q-field');
  return { found:true, value:cat.value, readOnly:cat.readOnly,
           isSelect: !!(f && f.className.match(/select/)), fieldClass:(f&&f.className||'').slice(0,80) };}, VIS);
log('C45040 category control:', JSON.stringify(R.C45040));
// open it and list the options
await page.evaluate(()=>document.querySelector('[data-test-id=select_inline_part_category]')?.click());
await page.waitForTimeout(2500);
R.C45040.options = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('.q-menu .q-item')].map(t).slice(0,12);});
log('C45040 options:', JSON.stringify(R.C45040.options));
await page.keyboard.press('Escape');
fs.writeFileSync(`${DIR}/evidence/28-fv-c.json`, JSON.stringify(R,null,1));
await s.browser.close();
