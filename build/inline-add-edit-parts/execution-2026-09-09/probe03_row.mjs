// Read the inline add row SCOPED to its own container (a label is read from the smallest element
// that owns it), plus the session's real view_mode. Settles C44989/C44990/C45036/C45041/C45053.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page, APP } = s;
const out={ build: await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content) };
out.viewMode = await page.evaluate(()=>{ try{ const r=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'{}');
  const w=r.data??r; return {view_mode:w.view_mode, cross:w.cross_toggles, slug:w.template_slug}; }catch(e){return {err:String(e)};} });
log('view mode:', JSON.stringify(out.viewMode));

await page.goto(`${APP}/workorders/${EST}/lines`, {waitUntil:'domcontentloaded', timeout:60000});
await page.waitForTimeout(10000);
await page.evaluate(()=>{ const it=document.querySelector('.q-expansion-item'); if(it){ (it.querySelector('.q-item')||it).click(); } });
await page.waitForTimeout(6000);
// BEFORE opening the row: is the Edit control hidden until hover/focus? (C44991)
out.editBefore = await page.evaluate(()=>{
  const els=[...document.querySelectorAll('[data-test-id*=edit],[aria-label*=Edit i],button')]
    .filter(e=>/edit/i.test(e.getAttribute('data-test-id')||'')|| /^edit$/i.test((e.textContent||'').trim()));
  return els.map(e=>({tid:e.getAttribute('data-test-id'), vis:!!e.offsetParent,
    op:getComputedStyle(e).opacity, vy:getComputedStyle(e).visibility})).slice(0,8);
});
log('edit controls before hover:', JSON.stringify(out.editBefore));

await page.evaluate(()=>{ const b=document.querySelector('[data-test-id=button_add_part]'); if(b){b.scrollIntoView({block:'center'}); b.click();} });
await page.waitForTimeout(5000);

out.row = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const desc=document.querySelector('[data-test-id=input_inline_part_description]');
  if(!desc) return {err:'inline description input not found'};
  // climb to the row container: the nearest ancestor that also holds the Save control
  let box=desc;
  for(let i=0;i<8 && box.parentElement;i++){ box=box.parentElement;
    if (box.querySelector('button,.q-btn') && box.querySelectorAll('input').length>=2) break; }
  const inputs=[...box.querySelectorAll('input,select,textarea')].map(i=>({
    tid:i.getAttribute('data-test-id'), aria:i.getAttribute('aria-label'), ph:i.placeholder||null,
    type:i.type, readOnly:i.readOnly, disabled:i.disabled, value:(i.value||'').slice(0,24),
    focused:document.activeElement===i,
    label:(()=>{ let p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l?t(l):null; })()
  }));
  const buttons=[...box.querySelectorAll('button,.q-btn,[role=button]')].map(b=>({
    label:t(b).slice(0,30), tid:b.getAttribute('data-test-id'), aria:b.getAttribute('aria-label'),
    disabled:b.disabled||b.getAttribute('aria-disabled')==='true'}));
  return { inputCount:inputs.length, inputs, buttons, boxText:t(box).slice(0,320) };
});
log('ROW inputs (%s):', out.row.inputCount);
for (const i of (out.row.inputs||[])) log('   ', JSON.stringify(i));
log('ROW buttons:'); for (const b of (out.row.buttons||[])) log('   ', JSON.stringify(b));
log('ROW text:', (out.row.boxText||'').slice(0,240));
await page.screenshot({path:`${DIR}/evidence/03-row.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/03-row.json`, JSON.stringify(out,null,1));
await s.browser.close();
