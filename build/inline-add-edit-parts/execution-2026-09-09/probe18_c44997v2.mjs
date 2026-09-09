// C44997, third pass. Visibility judged by geometry + computed style, NEVER offsetParent
// (null for position:fixed, which is what a Quasar dialog is).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin');
const { page, APP } = s;
const R={ build: await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content) };
await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(10000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);

const snap = async (tag) => page.evaluate(([vis,tag])=>{
  const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const all=[...document.querySelectorAll('.q-dialog,[role=dialog],.q-card')];
  const shown=all.filter(isVis);
  return { tag, dialogNodes:all.length, dialogsVisible:shown.length,
    shownText:shown.map(d=>t(d).slice(0,180)),
    discardNodes:[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/Discard this part\?|Discard Part|Keep Editing/i.test(t(e)))
      .map(e=>({txt:t(e).slice(0,40), visible:isVis(e)})) };
}, [VIS,tag]);

await (await page.$$('[data-test-id=button_add_part]'))[0].click();
await page.waitForTimeout(4500);
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST guard');
await page.waitForTimeout(1200);
R.baseline = await snap('row1 populated, before second click');
log('BASELINE:', JSON.stringify(R.baseline));

await (await page.$$('[data-test-id=button_add_part]'))[1].click();
await page.waitForTimeout(5500);
R.afterClick = await snap('after clicking Add Part on line 2');
log('AFTER   :', JSON.stringify(R.afterClick));
await page.screenshot({path:`${DIR}/evidence/18-after.png`, fullPage:true});

// control: does the SAME confirmation appear on the path that definitely uses it (X with data, S6-R1)?
await page.evaluate(()=>document.querySelector('[data-test-id=button_cancel_inline_part]')?.click());
await page.waitForTimeout(4000);
R.controlXWithData = await snap('control: X pressed on a populated row (S6-R1)');
log('CONTROL X:', JSON.stringify(R.controlXWithData));
await page.screenshot({path:`${DIR}/evidence/18-control-x.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/18-c44997.json`, JSON.stringify(R,null,1));
await s.browser.close();
