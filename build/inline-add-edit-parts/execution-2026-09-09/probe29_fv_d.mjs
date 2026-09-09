// Full View batch D: C45053 hint legend · C45051 Escape closes · C45052 click-outside keeps open ·
// C45038 catalog part fills cost/sell with $ · C45055 "Create as a new part" · C45056 validation
// names cost and sell price · C45040 clause 2 (no category saves as Uncategorized).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const R={};
const goto = async () => { await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(10000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(6500); };
const openRow = async () => { await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
  await page.waitForTimeout(4500); };
const rowOpen = () => page.evaluate(()=>!!document.querySelector('[data-test-id=input_inline_part_description]'));

await goto(); await openRow();

// ---- C45053 : hint legend
R.C45053 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hits=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/Enter|Esc|Tab/.test(t(e))&&isVis(e)).map(t);
  return { legendBits:[...new Set(hits)].slice(0,10),
           mentionsShiftEnter:/⇧\s*Enter|Shift\s*\+?\s*Enter/i.test(document.body.innerText||''),
           moreOptionsHint:(document.body.innerText.match(/.{0,26}more options.{0,26}/i)||[]).slice(0,3) };}, VIS);
log('C45053:', JSON.stringify(R.C45053));

// ---- C45056 : validation names cost and sell price
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST validation2');
await page.waitForTimeout(700);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(4000);
R.C45056 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const msgs=[...document.querySelectorAll('.q-field__messages,.text-negative,[role=alert],.q-notification')]
    .filter(isVis).map(t).filter(Boolean);
  return { messages:[...new Set(msgs)].slice(0,6), stillOpen:!!document.querySelector('[data-test-id=input_inline_part_description]') };}, VIS);
log('C45056:', JSON.stringify(R.C45056));

// ---- C45052 : click outside a populated row
await page.mouse.click(20, 300); await page.waitForTimeout(3500);
R.C45052 = { stillOpen: await rowOpen(),
             value: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_description]')?.value) };
log('C45052 click outside:', JSON.stringify(R.C45052));

// ---- C45051 : Escape closes the row (populated -> guard, per S6-R1; empty -> closes)
await page.keyboard.press('Escape'); await page.waitForTimeout(3500);
R.C45051_populated = await page.evaluate(()=>({rowOpen:!!document.querySelector('[data-test-id=input_inline_part_description]'),
  guard:/Discard this part|will be lost/i.test(document.body.innerText||'')}));
log('C45051 Escape on a POPULATED row:', JSON.stringify(R.C45051_populated));
if (R.C45051_populated.guard) {
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('button')].find(b=>/discard part/i.test(t(b)))?.click();});
  await page.waitForTimeout(3500);
  R.C45051_afterDiscard = { rowOpen: await rowOpen() };
  log('   after Discard Part:', JSON.stringify(R.C45051_afterDiscard));
}
// empty row + Escape
await openRow(); await page.waitForTimeout(1500);
await page.keyboard.press('Escape'); await page.waitForTimeout(3500);
R.C45051_empty = { rowOpen: await rowOpen(),
  guard: await page.evaluate(()=>/Discard this part|will be lost/i.test(document.body.innerText||'')) };
log('C45051 Escape on an EMPTY row:', JSON.stringify(R.C45051_empty));

// ---- C45038 + C45055 : the part-number typeahead
await openRow();
await page.click('[data-test-id=select_inline_part_number]');
await page.keyboard.type('King', {delay:70});
await page.waitForTimeout(5000);
R.typeahead = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const items=[...document.querySelectorAll('.q-menu .q-item')].filter(isVis).map(t);
  return { count:items.length, items:items.slice(0,8),
           createOption: items.filter(i=>/create .*as a new part/i.test(i)) };}, VIS);
log('C45055 typeahead:', JSON.stringify(R.typeahead));
await page.screenshot({path:`${DIR}/evidence/29-a-typeahead.png`, fullPage:true});
// pick the first real catalog result
const picked = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>!/create .*as a new part/i.test(t(e)));
  if(!it) return null; const label=t(it); it.click(); return label;});
log('picked catalog part:', (picked||'').slice(0,60));
await page.waitForTimeout(4500);
R.C45038 = await page.evaluate(()=>{const g=t=>document.querySelector(`[data-test-id=${t}]`);
  const cost=g('input_inline_part_cost'), sell=g('input_inline_part_sell_price');
  const pfx=el=>{ if(!el) return null; const f=el.closest('.q-field');
    return f? (f.textContent||'').replace(/\s+/g,' ').trim().slice(0,18):null; };
  return { cost:cost&&cost.value, sell:sell&&sell.value, costReadOnly:cost&&cost.readOnly,
           costFieldText:pfx(cost), sellFieldText:pfx(sell),
           desc:g('input_inline_part_description')?.value };});
log('C45038 after picking a catalog part:', JSON.stringify(R.C45038));
await page.screenshot({path:`${DIR}/evidence/29-b-catalog.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/29-fv-d.json`, JSON.stringify(R,null,1));
await s.browser.close();
