// Clean, isolated re-runs. Each check reloads the page first so no leftover row can hijack a click.
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
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4000);};
const msgs=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...new Set([...document.querySelectorAll('.q-field__messages,.text-negative,[role=alert],.q-notification')]
    .filter(isVis).map(t).filter(Boolean))].filter(m=>!/Credit Hold|Build Lines|location_on|^\$/.test(m));}, VIS);

// ---- C45058 isolated: letters in SELL PRICE with a valid cost
await fresh(); await openRow();
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST sell-letters');
await page.fill('[data-test-id=input_inline_part_quantity]','1');
await page.fill('[data-test-id=input_inline_part_cost]','10.00');
await page.click('[data-test-id=input_inline_part_sell_price]');
await page.keyboard.type('xyz', {delay:60}); await page.waitForTimeout(900);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(4500);
R.sellLetters = { value: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_sell_price]')?.value),
                  messages: await msgs() };
log('SELL letters  :', JSON.stringify(R.sellLetters));

// ---- C45058 isolated: NEGATIVE sell price with a valid cost
await page.fill('[data-test-id=input_inline_part_sell_price]','-4');
await page.waitForTimeout(800);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(4500);
R.sellNegative = { value: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_sell_price]')?.value),
                   messages: await msgs() };
log('SELL negative :', JSON.stringify(R.sellNegative));

// ---- C45058 isolated: letters in COST with a valid sell price
await page.fill('[data-test-id=input_inline_part_sell_price]','9.00');
await page.fill('[data-test-id=input_inline_part_cost]','');
await page.click('[data-test-id=input_inline_part_cost]');
await page.keyboard.type('abc', {delay:60}); await page.waitForTimeout(900);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(4500);
R.costLetters = { value: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_cost]')?.value),
                  messages: await msgs() };
log('COST letters  :', JSON.stringify(R.costLetters));
await page.screenshot({path:`${DIR}/evidence/33-a-numeric.png`, fullPage:true});

// ---- C45046 isolated: save from the modal
await fresh(); await openRow();
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST modalsave2');
await page.fill('[data-test-id=input_inline_part_quantity]','1');
await page.fill('[data-test-id=input_inline_part_cost]','3.00');
await page.fill('[data-test-id=input_inline_part_sell_price]','6.00');
await page.waitForTimeout(1000);
await page.evaluate(()=>document.querySelector('[data-test-id=button_more_options_inline_part]')?.click());
await page.waitForTimeout(6000);
const clicked = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const b=[...d.querySelectorAll('button')].find(x=>/save part/i.test(t(x)));
  if(!b) return 'no button'; if(b.disabled) return 'DISABLED'; b.click(); return 'clicked';});
log('C45046 Save part ->', clicked);
await page.waitForTimeout(9000);
R.C45046 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return { dialogsOpen:[...document.querySelectorAll('.q-dialog')].filter(isVis).length,
           dialogTexts:[...document.querySelectorAll('.q-dialog')].filter(isVis).map(d=>t(d).slice(0,90)),
           inlineRowOpen:!!document.querySelector('[data-test-id=input_inline_part_description]'),
           toast:[...document.querySelectorAll('.q-notification')].filter(isVis).map(t),
           partPresent:/ZZAUTOTEST modalsave2/.test(document.body.innerText||'') };}, VIS);
log('C45046:', JSON.stringify(R.C45046));
await page.screenshot({path:`${DIR}/evidence/33-b-modalsave.png`, fullPage:true});

// ---- C45040 clause 2 : the saved no-category part, opened cleanly
await fresh();
const op = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/ZZAUTOTEST requested flow/.test(t(e)))[0];
  if(!hit) return 'row not found';
  let box=hit; for(let i=0;i<8&&box.parentElement;i++){ box=box.parentElement; if(box.querySelector('[data-test-id^=button_edit_part_]')) break; }
  const e=box.querySelector('[data-test-id^=button_edit_part_]'); if(!e) return 'no edit control';
  e.scrollIntoView({block:'center'}); e.click(); return 'opened';});
await page.waitForTimeout(6500);
R.C45040 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(!d) return {modal:false, op:'none'};
  const val=lbl=>{const i=[...d.querySelectorAll('input')].find(x=>{const p=x.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l&&new RegExp(lbl,'i').test(t(l));}); return i?i.value:null;};
  return { modal:true, title:t(d.querySelector('.q-card__section,.text-h6')||d).slice(0,40),
           category:val('^category$'), source:val('^source$'), desc:val('^description$') };}, VIS);
log('C45040 clause 2 (open=%s):', op, JSON.stringify(R.C45040));
await page.screenshot({path:`${DIR}/evidence/33-c-category.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/33-fv-g.json`, JSON.stringify(R,null,1));
await s.browser.close();
