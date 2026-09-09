// Rigorous re-test of the two candidates.
// C45051: Escape with focus PROVEN inside the row. C45055: typeahead with a no-match string.
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
const state=()=>page.evaluate(()=>({rowOpen:!!document.querySelector('[data-test-id=input_inline_part_description]'),
  focus:document.activeElement?.getAttribute?.('data-test-id')||document.activeElement?.tagName,
  guard:/Discard this part|will be lost/i.test(document.body.innerText||'')}));

await goto();
// ---------- C45051 : EMPTY row, focus proven in the description box
await openRow();
await page.click('[data-test-id=input_inline_part_description]');
R.escEmpty_before = await state();
log('C45051 empty  BEFORE esc:', JSON.stringify(R.escEmpty_before));
await page.keyboard.press('Escape'); await page.waitForTimeout(4000);
R.escEmpty_after = await state();
log('C45051 empty  AFTER  esc:', JSON.stringify(R.escEmpty_after));

// ---------- C45051 : POPULATED row, focus proven in the description box
if (R.escEmpty_after.rowOpen === false) await openRow();
await page.click('[data-test-id=input_inline_part_description]');
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST esc-check');
await page.click('[data-test-id=input_inline_part_description]');
R.escFull_before = await state();
log('C45051 filled BEFORE esc:', JSON.stringify(R.escFull_before));
await page.keyboard.press('Escape'); await page.waitForTimeout(4000);
R.escFull_after = await state();
log('C45051 filled AFTER  esc:', JSON.stringify(R.escFull_after));
await page.screenshot({path:`${DIR}/evidence/30-a-escape.png`, fullPage:true});

// control: does the X button close the same row? (proves the row CAN close)
R.xControl = await (async()=>{
  const before = await state();
  await page.evaluate(()=>document.querySelector('[data-test-id=button_cancel_inline_part]')?.click());
  await page.waitForTimeout(4000);
  const after = await state();
  return { before, after };
})();
log('control - X button:', JSON.stringify(R.xControl.after));
if (R.xControl.after.guard) {
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('button')].find(b=>/discard part/i.test(t(b)))?.click();});
  await page.waitForTimeout(3000);
  R.xControl.afterDiscard = await state();
  log('   after Discard Part:', JSON.stringify(R.xControl.afterDiscard));
}

// ---------- C45055 : typeahead with a string that matches NOTHING
await openRow();
await page.click('[data-test-id=select_inline_part_number]');
await page.keyboard.type('ZZQQXNOMATCH123', {delay:60});
await page.waitForTimeout(5500);
R.C45055_nomatch = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const items=[...document.querySelectorAll('.q-menu .q-item')].filter(isVis).map(t);
  return { count:items.length, items:items.slice(0,6),
           hasCreate: items.some(i=>/create/i.test(i)),
           menuText:[...document.querySelectorAll('.q-menu')].filter(isVis).map(m=>t(m).slice(0,160)) };}, VIS);
log('C45055 no-match typeahead:', JSON.stringify(R.C45055_nomatch));
await page.screenshot({path:`${DIR}/evidence/30-b-nomatch.png`, fullPage:true});
// and with a partial string that DOES match, check the tail of the list
await page.fill('[data-test-id=select_inline_part_number]','').catch(()=>{});
await page.keyboard.press('Control+A'); await page.keyboard.type('Brake', {delay:60});
await page.waitForTimeout(5000);
R.C45055_match = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const items=[...document.querySelectorAll('.q-menu .q-item')].filter(isVis).map(t);
  return { count:items.length, last3:items.slice(-3), hasCreate:items.some(i=>/create/i.test(i)) };}, VIS);
log('C45055 matching typeahead tail:', JSON.stringify(R.C45055_match));
fs.writeFileSync(`${DIR}/evidence/30-verify.json`, JSON.stringify(R,null,1));
await s.browser.close();
