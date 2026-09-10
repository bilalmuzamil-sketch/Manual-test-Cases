// Role-variant cases. The TECHNICIAN role only is edited (the QA lead authorised editing the Tech
// role and assigning it to the Tech staff; the Admin staff's Admin role is never touched), and it
// is put back to its original state at the end: View mode = Tech view, Work order lines
// Create & Edit ON, See Financial Data off.
//   C53477 — Full View WITHOUT See Financial Data gets the three-field row
//   C45032 — Tech View, Create & Edit off: no Edit control
//   C44995 — same role state: no Add Part button either
//   C45066 — Full View, Create & Edit off: no Edit control
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const TECH_ROLE='2d4b8464-81a9-4c1e-96c6-a2a64f02a389';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};

// ---------------- set the Technician role to a given shape -------------------
async function setRole({viewMode, createEdit}){
  const s = await boot('sv9315','/workorders','admin'); const {page, APP}=s;
  await page.goto(`${APP}/administration/roles-permissions/${TECH_ROLE}/edit`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(12000);
  const before = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const seg=[...document.querySelectorAll('.wo-settings__segment')].map(b=>({label:t(b), active:b.className.includes('--active')}));
    const cbs=[...document.querySelectorAll('.q-checkbox')];
    const wol=cbs.map((n,i)=>({i, on:n.getAttribute('aria-checked')==='true'||n.classList.contains('q-checkbox--truthy')}));
    return {seg, nCheckboxes:cbs.length, wol};});
  // view mode
  const vm = await page.evaluate(want=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const b=[...document.querySelectorAll('.wo-settings__segment')].find(x=>t(x).toLowerCase()===want.toLowerCase());
    if(!b) return 'segment not found';
    if(b.className.includes('--active')) return 'already '+want;
    b.click(); return 'clicked '+want;}, viewMode);
  await page.waitForTimeout(2500);
  // work order lines Create & Edit = checkbox index 7 (probe 52 mapped every control)
  const ce = await page.evaluate(want=>{const cbs=[...document.querySelectorAll('.q-checkbox')];
    const n=cbs[7]; if(!n) return 'checkbox 7 missing';
    const on=n.getAttribute('aria-checked')==='true'||n.classList.contains('q-checkbox--truthy');
    if(on===want) return 'already '+(want?'on':'off');
    n.click(); return 'toggled to '+(want?'on':'off');}, createEdit);
  await page.waitForTimeout(2500);
  const saved = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const b=[...document.querySelectorAll('button')].filter(x=>/^save$/i.test(t(x))).pop();
    if(!b) return 'no Save'; if(b.disabled) return 'Save disabled'; b.click(); return 'saved';});
  await page.waitForTimeout(9000);
  const after = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const seg=[...document.querySelectorAll('.wo-settings__segment')].map(b=>({label:t(b), active:b.className.includes('--active')}));
    const n=[...document.querySelectorAll('.q-checkbox')][7];
    return {seg, ce7: n? (n.getAttribute('aria-checked')==='true'||n.classList.contains('q-checkbox--truthy')) : null};});
  await page.screenshot({path:`${DIR}/evidence/61-role-${viewMode.replace(/\s+/g,'')}-${createEdit?'ce-on':'ce-off'}.png`, fullPage:true});
  await s.browser.close();
  return {before:{seg:before.seg, ce7:before.wol[7]}, vm, ce, saved, after};
}

// ---------------- what the tech user then sees -------------------------------
async function observe(tag){
  const s = await boot('sv9315','/workorders','tech'); const {page, APP}=s;
  const out={ identity:{slug:s.templateSlug, role:s.role} };
  out.wrapper = await page.evaluate(()=>{try{const r=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'{}');const d=r.data??r;
    return {view_mode:d.view_mode, sfd:(d.cross_toggles||{}).seeFinancialData, perms:(d.fe_permissions||[]).length};}catch(e){return{err:String(e)}}});
  await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  out.controls = await page.evaluate(vis=>{const isVis=eval(vis);
    const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
    const ed=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
    return {addPart:add.length, addPartVisible:add.filter(isVis).length,
            edit:ed.length, editVisible:ed.filter(isVis).length};}, VIS);
  if (out.controls.addPartVisible){
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
    await page.waitForTimeout(5000);
    out.row = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const d=document.querySelector('[data-test-id=input_inline_part_description]'); if(!d) return {open:false};
      let b=d; for(let i=0;i<9&&b.parentElement;i++){b=b.parentElement; if(b.querySelector('[data-test-id=button_save_inline_part]')) break;}
      const f=[...b.querySelectorAll('input,select')].filter(isVis).map(i=>({tid:i.getAttribute('data-test-id'),
        label:(()=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l?t(l):null;})(),
        x:Math.round(i.getBoundingClientRect().x)})).sort((a,b2)=>a.x-b2.x);
      return {open:true, order:f.map(x=>x.label||x.tid),
        hasCost:!!b.querySelector('[data-test-id=input_inline_part_cost]'),
        hasSell:!!b.querySelector('[data-test-id=input_inline_part_sell_price]'),
        hasCategory:!!b.querySelector('[data-test-id=select_inline_part_category]'),
        hasMoreOptions:!!b.querySelector('[data-test-id=button_more_options_inline_part]'),
        buttons:[...b.querySelectorAll('button,.q-btn')].filter(isVis).map(t)};}, VIS);
  }
  await page.screenshot({path:`${DIR}/evidence/61-${tag}.png`, fullPage:true});
  await s.browser.close();
  return out;
}

// ===== C53477: Full View, See Financial Data OFF, Create & Edit ON ==========
R.setA = await setRole({viewMode:'Full View', createEdit:true});
log('role -> Full View / CE on:', JSON.stringify(R.setA));
R.C53477 = await observe('c53477-fullview-nosfd');
log('C53477:', JSON.stringify(R.C53477));

// ===== C45066: Full View, Create & Edit OFF =================================
R.setB = await setRole({viewMode:'Full View', createEdit:false});
log('role -> Full View / CE off:', JSON.stringify(R.setB));
R.C45066 = await observe('c45066-fullview-noce');
log('C45066:', JSON.stringify(R.C45066));

// ===== C45032 + C44995: Tech view, Create & Edit OFF ========================
R.setC = await setRole({viewMode:'Tech view', createEdit:false});
log('role -> Tech view / CE off:', JSON.stringify(R.setC));
R.C45032 = await observe('c45032-techview-noce');
log('C45032 / C44995:', JSON.stringify(R.C45032));

// ===== restore the Technician role to how it was ============================
R.restore = await setRole({viewMode:'Tech view', createEdit:true});
log('RESTORED:', JSON.stringify(R.restore));
R.verifyRestore = await observe('61-restored');
log('restored, tech sees:', JSON.stringify(R.verifyRestore.controls), JSON.stringify(R.verifyRestore.wrapper));
fs.writeFileSync(`${DIR}/evidence/61-roleedit.json`, JSON.stringify(R,null,1));
