// Tech View execution via the `tech` quick-login. C44998 (three fields, no pricing) · C45002
// (quantity starts empty and is required) · C45003 (Save + close action) · C45014 (hint legend) ·
// C44999/C45000 (part-number typeahead fills fields, focus moves to quantity).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','tech'); const { page, APP } = s;
const R={ identity:{slug:s.templateSlug, nFePerms:s.nFePerms, role:s.role} };
R.wrapper = await page.evaluate(()=>{try{const r=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'{}');const d=r.data??r;
  return {view_mode:d.view_mode, cross:d.cross_toggles, perms:(d.fe_permissions||[]).length};}catch(e){return{err:String(e)}}});
log('TECH identity:', JSON.stringify(R.identity), '| wrapper:', JSON.stringify(R.wrapper));

await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(11000);
R.landed = page.url();
log('landed:', R.landed);
await page.screenshot({path:`${DIR}/evidence/42-a-tech-wo.png`, fullPage:true});
if (/login/.test(R.landed)) { log('TECH cannot reach the work order'); fs.writeFileSync(`${DIR}/evidence/42-tech.json`,JSON.stringify(R,null,1)); await s.browser.close(); process.exit(0); }

await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);
R.controls = await page.evaluate(vis=>{const isVis=eval(vis);
  const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
  const ed=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
  return { addPart:add.length, addPartVisible:add.filter(isVis).length, edit:ed.length };}, VIS);
log('Tech View controls on the work order:', JSON.stringify(R.controls));
if (!R.controls.addPartVisible){ log('NO Add Part for the tech user - stopping here');
  await page.screenshot({path:`${DIR}/evidence/42-b-noaddpart.png`, fullPage:true});
  fs.writeFileSync(`${DIR}/evidence/42-tech.json`,JSON.stringify(R,null,1)); await s.browser.close(); process.exit(0); }

await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
await page.waitForTimeout(5000);
await page.screenshot({path:`${DIR}/evidence/42-c-tech-row.png`, fullPage:true});
R.row = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const desc=document.querySelector('[data-test-id=input_inline_part_description]');
  if(!desc) return {err:'no inline row'};
  let box=desc; for(let i=0;i<9&&box.parentElement;i++){ box=box.parentElement;
    if(box.querySelector('[data-test-id=button_save_inline_part]')) break; }
  const fields=[...box.querySelectorAll('input,select')].filter(isVis).map(i=>({
    tid:i.getAttribute('data-test-id'),
    label:(()=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l?t(l):null;})(),
    value:i.value, focused:document.activeElement===i, x:Math.round(i.getBoundingClientRect().x)}));
  fields.sort((a,b)=>a.x-b.x);
  return { fieldCount:fields.length, order:fields.map(f=>f.label||f.tid), fields,
    buttons:[...box.querySelectorAll('button,.q-btn')].filter(isVis).map(b=>t(b)),
    hasCost:!!box.querySelector('[data-test-id=input_inline_part_cost]'),
    hasSell:!!box.querySelector('[data-test-id=input_inline_part_sell_price]'),
    hasCategory:!!box.querySelector('[data-test-id=select_inline_part_category]'),
    hasMoreOptions:!!box.querySelector('[data-test-id=button_more_options_inline_part]'),
    hintText:(document.body.innerText.match(/.{0,40}(Enter|Esc|Tab).{0,40}/g)||[]).slice(0,4) };}, VIS);
log('C44998 field order:', JSON.stringify(R.row.order));
log('C44998 pricing present? cost=%s sell=%s category=%s moreOptions=%s',
    R.row.hasCost, R.row.hasSell, R.row.hasCategory, R.row.hasMoreOptions);
log('C45003 actions:', JSON.stringify(R.row.buttons));
log('C45002 qty value:', JSON.stringify(R.row.fields.find(f=>/qty/i.test(f.label||''))));
log('C45014 hint:', JSON.stringify(R.row.hintText));
fs.writeFileSync(`${DIR}/evidence/42-tech.json`, JSON.stringify(R,null,1));
await s.browser.close();
