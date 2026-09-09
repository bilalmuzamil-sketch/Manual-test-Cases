// Second, independent confirmation: on a DECLINED work order, are the Add Part control and the
// Edit control shown? S1-N1/S1-N2 (as re-verified 2026-09-09) say both must be hidden.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const R={ build: await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content) };
await page.goto(`${APP}/workorders/68d57d19-3ddb-40d1-892d-0b9a5c329ebe/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(11000);
R.statusChip = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const el=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^(Estimate|Approved|In progress|Ready for Review|Declined|Complete|Invoiced|Paid)$/.test(t(e)));
  return el.map(t).slice(0,4);});
R.woNumber = await page.evaluate(()=>(document.body.innerText.match(/S\d?\d*-\d{4,6}/)||[])[0]);
log('WO', R.woNumber, '| status chips:', JSON.stringify(R.statusChip));
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(8000);
R.controls = await page.evaluate(vis=>{
  const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
  const ed=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
  return { addPartNodes:add.length, addPartVisible:add.filter(isVis).length,
           addPartLabels:add.filter(isVis).map(b=>t(b)),
           editNodes:ed.length, editVisibleAtRest:ed.filter(isVis).length,
           partsHeadings:[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^Parts\b/i.test(t(e))&&isVis(e)).length,
           expanded:[...document.querySelectorAll('.q-expansion-item--expanded')].length };
}, VIS);
log('CONTROLS:', JSON.stringify(R.controls));
// prove the Add Part control actually works here (not a dead leftover)
if (R.controls.addPartVisible) {
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
  await page.waitForTimeout(5000);
  R.rowOpens = await page.evaluate(()=>!!document.querySelector('[data-test-id=input_inline_part_description]'));
  log('inline row actually opens on the Declined WO:', R.rowOpens);
}
// and the Edit control reveals on real hover
const ids = await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_edit_part_]')].map(e=>e.getAttribute('data-test-id')));
if (ids.length){
  const sel=`[data-test-id="${ids[0]}"]`;
  const box=await page.$eval(sel, e=>{const r=(e.closest('tr')||e.parentElement).getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};});
  await page.mouse.move(box.x, box.y); await page.waitForTimeout(1500);
  R.editOnHover = await page.$eval(sel, e=>getComputedStyle(e).opacity);
  log('Edit control opacity on real hover (Declined WO):', R.editOnHover);
}
await page.screenshot({path:`${DIR}/evidence/25-declined.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/25-declined.json`, JSON.stringify(R,null,1));
await s.browser.close();
