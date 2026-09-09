// C44991 properly: REAL mouse hover (Playwright hover triggers CSS :hover) and REAL keyboard focus.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page, APP } = s;
await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(10000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);

const ids = await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_edit_part_]')].map(e=>e.getAttribute('data-test-id')));
log('edit controls on page:', ids.length);
if (!ids.length) { log('NO PART ROWS on this WO - cannot judge C44991 here'); await s.browser.close(); process.exit(0); }
const sel = `[data-test-id="${ids[0]}"]`;
const R={ testId: ids[0] };

R.atRest = await page.$eval(sel, e=>({op:getComputedStyle(e).opacity, vis:getComputedStyle(e).visibility, disp:getComputedStyle(e).display}));
log('at rest      :', JSON.stringify(R.atRest));

// REAL hover over the part ROW (the row is what the case says you hover)
const rowBox = await page.$eval(sel, e=>{ const r=(e.closest('tr')||e.closest('[class*=row]')||e.parentElement).getBoundingClientRect();
  return {x:r.x+r.width/2, y:r.y+r.height/2}; });
await page.mouse.move(rowBox.x, rowBox.y); await page.waitForTimeout(1500);
R.onRealHover = await page.$eval(sel, e=>({op:getComputedStyle(e).opacity, vis:getComputedStyle(e).visibility}));
log('real hover   :', JSON.stringify(R.onRealHover));
await page.screenshot({path:`${DIR}/evidence/15-hover.png`});

// move the mouse away, then reach it by REAL keyboard focus
await page.mouse.move(5,5); await page.waitForTimeout(1200);
R.afterMouseAway = await page.$eval(sel, e=>({op:getComputedStyle(e).opacity}));
log('mouse away   :', JSON.stringify(R.afterMouseAway));
await page.focus(sel); await page.waitForTimeout(1200);
R.onKeyboardFocus = await page.$eval(sel, e=>({op:getComputedStyle(e).opacity, vis:getComputedStyle(e).visibility,
  isActive:document.activeElement===e, matchesFocusVisible:(()=>{try{return e.matches(':focus-visible')}catch(x){return null}})()}));
log('keyboard focus:', JSON.stringify(R.onKeyboardFocus));
await page.screenshot({path:`${DIR}/evidence/15-focus.png`});

// and via a genuine Tab sequence, which is what a keyboard user actually does
await page.mouse.move(5,5);
await page.evaluate(sel=>{ const e=document.querySelector(sel); const prev=e.previousElementSibling||e.parentElement;
  (prev.querySelector('button,a,input')||document.body).focus(); }, sel);
for (let i=0;i<12;i++){
  await page.keyboard.press('Tab'); await page.waitForTimeout(220);
  const hit = await page.$eval(sel, e=>document.activeElement===e).catch(()=>false);
  if (hit){ R.tabReached=i+1; R.onTab = await page.$eval(sel, e=>({op:getComputedStyle(e).opacity})); break; }
}
log('via Tab      :', R.tabReached? `reached after ${R.tabReached} tabs, opacity ${R.onTab.op}` : 'not reached in 12 tabs');
fs.writeFileSync(`${DIR}/evidence/15-c44991.json`, JSON.stringify(R,null,1));
await s.browser.close();
