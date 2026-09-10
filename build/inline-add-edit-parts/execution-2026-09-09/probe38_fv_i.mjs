// C45055 (click the Create action properly) · C45060 (catalog part with no cost/sell) ·
// C45039 (cost read-only for an inventory part; sell still editable).
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
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4200);};

// ---- C45055 : click the Create action by its own bounding box
await fresh(); await openRow();
await page.click('[data-test-id=select_inline_part_number]');
await page.keyboard.type('ZZNEWPART77', {delay:55});
await page.waitForTimeout(5000);
const box = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu')].pop(); if(!m) return null;
  const cand=[...m.querySelectorAll('*')].filter(e=>/create .* as a new part/i.test(t(e)));
  if(!cand.length) return null;
  const el=cand[cand.length-1];               // innermost element carrying the text
  const r=el.getBoundingClientRect();
  return {x:r.x+r.width/2, y:r.y+r.height/2, text:t(el).slice(0,60)};});
log('C45055 create option box:', JSON.stringify(box));
if (box){ await page.mouse.click(box.x, box.y); await page.waitForTimeout(6500); }
R.C45055 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(!d) return {modalOpen:false, bodyHas:/ZZNEWPART77/.test(document.body.innerText||'')};
  const val=l=>{const i=[...d.querySelectorAll('input')].find(x=>{const p=x.closest('.q-field'); const q=p&&p.querySelector('.q-field__label'); return q&&new RegExp(l,'i').test(t(q));}); return i?i.value:null;};
  return { modalOpen:true, title:t(d.querySelector('.q-card__section,.text-h6')||d).slice(0,34),
           desc:val('^description$'), partNumber:val('^part number$') };}, VIS);
log('C45055:', JSON.stringify(R.C45055));
await page.screenshot({path:`${DIR}/evidence/38-a-createnew.png`, fullPage:true});
if (R.C45055.modalOpen){ await page.keyboard.press('Escape'); await page.waitForTimeout(3500); }

// ---- C45039 / C45060 : pick INVENTORY parts and read cost/sell state
await fresh(); await openRow();
await page.click('[data-test-id=select_inline_part_number]');
await page.keyboard.type('Brake', {delay:55});
await page.waitForTimeout(5000);
R.candidates = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('.q-menu .q-item')].map((e,i)=>({i, txt:t(e).slice(0,80)})).slice(0,10);});
log('typeahead options:'); R.candidates.forEach(c=>log('   ', c.i, c.txt));
// choose one whose card shows an inventory quantity of 0 (most likely to carry no cost/sell)
const chosen = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const items=[...document.querySelectorAll('.q-menu .q-item')];
  const zero=items.find(e=>/Inventory Qty: 0/i.test(t(e))) || items[0];
  const label=t(zero).slice(0,70); zero.click(); return label;});
log('picked:', chosen);
await page.waitForTimeout(5000);
R.C45039_C45060 = await page.evaluate(()=>{const g=t=>document.querySelector(`[data-test-id=${t}]`);
  const c=g('input_inline_part_cost'), sp=g('input_inline_part_sell_price');
  return { desc:g('input_inline_part_description')?.value,
           cost:c&&c.value, costReadOnly:c&&c.readOnly, costDisabled:c&&c.disabled,
           sell:sp&&sp.value, sellReadOnly:sp&&sp.readOnly, sellDisabled:sp&&sp.disabled };});
log('C45039/C45060 after picking an inventory part:', JSON.stringify(R.C45039_C45060));
// can the cost be overwritten?
await page.fill('[data-test-id=input_inline_part_cost]','99.99').catch(e=>log('cost fill blocked:', String(e).slice(0,60)));
await page.waitForTimeout(900);
R.costAfterOverwrite = await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_cost]')?.value);
await page.fill('[data-test-id=input_inline_part_sell_price]','123.45').catch(e=>log('sell fill blocked:', String(e).slice(0,60)));
await page.waitForTimeout(900);
R.sellAfterOverwrite = await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_sell_price]')?.value);
log('after overwrite attempts -> cost:', R.costAfterOverwrite, '| sell:', R.sellAfterOverwrite);
await page.screenshot({path:`${DIR}/evidence/38-b-inventory.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/38-fv-i.json`, JSON.stringify(R,null,1));
await s.browser.close();
