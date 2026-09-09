// C44993 / C44994 properly: prove the line EXPANDED and its parts are on screen, then show the
// Add Part control and the Edit control are absent. Control comparison against the Estimate WO.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const COMPLETE='2945916b-9557-4ffe-9f96-a7769a5a66f7';   // S9315-15856, Complete
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';        // Estimate, editable - the control
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin');
const { page, APP } = s;
const R={ build: await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content) };

async function inspect(id, tag){
  await page.goto(`${APP}/workorders/${id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(10000);
  const nExp = await page.evaluate(()=>{const its=[...document.querySelectorAll('.q-expansion-item')];
    its.forEach(i=>i.querySelector('.q-item')?.click()); return its.length;});
  await page.waitForTimeout(7000);
  const out = await page.evaluate(vis=>{
    const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
    const edit=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
    // proof the Parts section rendered: a "Parts" heading inside an expanded line, and part rows
    const partsHeads=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^Parts\b/i.test(t(e))&&isVis(e));
    const qtyCells=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^(Qty|Quantity)$/i.test(t(e))&&isVis(e));
    const status=(document.body.innerText.match(/\b(Estimate|Approved|In progress|Review|Complete|Invoiced|Paid)\b/)||[])[0];
    return { status, partsHeadings:partsHeads.length, qtyHeaders:qtyCells.length,
             addPartNodes:add.length, addPartVisible:add.filter(isVis).length,
             editNodes:edit.length, editVisible:edit.filter(isVis).length,
             expandedPanels:[...document.querySelectorAll('.q-expansion-item--expanded')].length,
             bodySample:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,200) };
  }, VIS);
  out.expansionItems=nExp; out.tag=tag;
  await page.screenshot({path:`${DIR}/evidence/21-${tag}.png`, fullPage:true});
  return out;
}
R.completeWO = await inspect(COMPLETE,'complete');
log('COMPLETE WO :', JSON.stringify(R.completeWO));
R.estimateWO = await inspect(EST,'estimate-control');
log('ESTIMATE (control):', JSON.stringify(R.estimateWO));
fs.writeFileSync(`${DIR}/evidence/21-c44993.json`, JSON.stringify(R,null,1));
await s.browser.close();
