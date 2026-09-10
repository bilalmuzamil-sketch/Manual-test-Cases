// The four role-variant cases, now that PUT /api/roles/{id} persists.
//   C53477  Full View WITHOUT See Financial Data -> the three-field row, no More Options
//   C45066  Full View with Work order lines Create & Edit OFF -> no Edit control
//   C45032  Tech view with Create & Edit OFF     -> no Edit control
//   C44995  the same role state                  -> no Add Part button either
// Only the TECHNICIAN role is touched and it is restored at the end; the Admin staff's Admin role is
// never involved (the QA lead's standing rule).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const TECH_ROLE='2d4b8464-81a9-4c1e-96c6-a2a64f02a389';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/104-rolecases.json`, JSON.stringify(R,null,1));
const mkCall=(page,APIH)=>(method,path,body)=>page.evaluate(async ({api,method,path,body})=>{
  const r=await fetch(`https://${api}${path}`,{method,
    headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include',
    body: body? JSON.stringify(body):undefined});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,260)};}, {api:APIH, method, path, body:body||null});

// ---- read the role and name its permissions
let ORIGINAL=null;
{
  const s = await boot('sv9315','/workorders','admin'); const call=mkCall(s.page, s.APIH);
  const g = await call('GET', `/api/roles/${TECH_ROLE}`);
  ORIGINAL = (g.json && (g.json.data||g.json)) || {};
  R.original = {view_mode:ORIGINAL.view_mode, cross:ORIGINAL.cross_toggles,
    perms:(ORIGINAL.fe_permissions||[]).map(p=>p.code||p.name||p.id)};
  log('Technician permissions: %s', JSON.stringify(R.original.perms));
  save();
  await s.browser.close();
}
const permObjs = ORIGINAL.fe_permissions||[];
const isLineEdit = p => /workorderline|work_order_line|lines/i.test(String(p.code||p.name||''))
                     && /create|edit/i.test(String(p.code||p.name||''));
R.lineEditPerm = permObjs.filter(isLineEdit).map(p=>p.code||p.name);
log('the work-order-lines create/edit permission: %s', JSON.stringify(R.lineEditPerm));
save();

const setRole = async (patch)=>{
  const s = await boot('sv9315','/workorders','admin'); const call=mkCall(s.page, s.APIH);
  const body = {...ORIGINAL, fe_permissions:(patch.perms||permObjs).map(p=>p.id||p), ...patch.role};
  delete body.perms;
  const r = await call('PUT', `/api/roles/${TECH_ROLE}`, body);
  const g = await call('GET', `/api/roles/${TECH_ROLE}`);
  const now = (g.json && (g.json.data||g.json)) || {};
  const out = {status:r.status, view_mode:now.view_mode, nPerms:(now.fe_permissions||[]).length,
    perms:(now.fe_permissions||[]).map(p=>p.code||p.name)};
  await s.browser.close();
  return out;
};
const observe = async (tag)=>{
  const s = await boot('sv9315','/workorders','tech'); const {page, APP}=s; const out={};
  out.identity = await page.evaluate(()=>{try{const r=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'{}');const d=r.data??r;
    return {view_mode:d.view_mode, sfd:(d.cross_toggles||{}).seeFinancialData, perms:(d.fe_permissions||[]).length};}catch(e){return{err:String(e)}}});
  await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  out.controls = await page.evaluate(vis=>{const isVis=eval(vis);
    const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
    const ed=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
    return {addPart:add.length, addPartVisible:add.filter(isVis).length, edit:ed.length, editVisible:ed.filter(isVis).length};}, VIS);
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
        hasMoreOptions:!!b.querySelector('[data-test-id=button_more_options_inline_part]')};}, VIS);
  }
  await page.screenshot({path:`${DIR}/evidence/104-${tag}.png`, fullPage:true});
  await s.browser.close();
  return out;
};
// ===== C53477: Full View, See Financial Data still off =====
R.setA = await setRole({role:{view_mode:'full'}});
log('role -> Full View: %s', JSON.stringify(R.setA));
R.C53477 = await observe('c53477');
log('C53477: %s', JSON.stringify(R.C53477));
save();
// ===== C45066: Full View, the lines create/edit permission removed =====
const without = permObjs.filter(p=>!isLineEdit(p));
R.setB = await setRole({role:{view_mode:'full'}, perms:without});
log('role -> Full View without the lines permission: %s', JSON.stringify(R.setB));
R.C45066 = await observe('c45066');
log('C45066: %s', JSON.stringify(R.C45066));
save();
// ===== C45032 + C44995: Tech view, the same permission removed =====
R.setC = await setRole({role:{view_mode:'tech'}, perms:without});
log('role -> Tech view without the lines permission: %s', JSON.stringify(R.setC));
R.C45032 = await observe('c45032');
log('C45032 / C44995: %s', JSON.stringify(R.C45032));
save();
// ===== put the Technician role back exactly =====
R.restore = await setRole({role:{view_mode:ORIGINAL.view_mode}, perms:permObjs});
log('RESTORED: %s', JSON.stringify(R.restore));
R.restoredOk = R.restore.view_mode===ORIGINAL.view_mode && R.restore.nPerms===permObjs.length;
log('is the Technician role back exactly as it was? %s', R.restoredOk);
save();
