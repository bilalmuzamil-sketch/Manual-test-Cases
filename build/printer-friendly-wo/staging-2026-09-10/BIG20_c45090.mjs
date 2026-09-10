// C45090, done so the instrument is provable.
// The last run cleared the browser's store and the page simply showed the sign-in screen --
// that is not access control, that is being logged out. This run REPLACES the stored rights
// with the stepped-into person's rights instead of clearing them, and it first proves the
// method works by doing exactly the same thing with somebody who CAN see work orders.
// It also puts the spare role back to the 33 permissions it started with, in dependency order.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const ORG='d55bc308-e61a-438d-b5f1-c7a73c89d49f';
const ROLE='e0e9b247-5432-43e8-9e35-f0c9bf3ade16';
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const ORDER=['workOrdersView','workOrdersCreateAndEdit','workOrdersDelete','woReviewWorkOrders',
  'woPickParts','workOrderLinesCreateAndEdit','workOrderLinesDelete'];
const TIDS={workOrdersView:'area_workorders_view', workOrdersCreateAndEdit:'area_workorders_createandedit',
  workOrdersDelete:'area_workorders_delete', woReviewWorkOrders:'wosetting_reviewworkorders',
  woPickParts:'wosetting_pickparts', woOrderParts:'wosetting_orderparts', woMoveLabor:'wosetting_movelabor',
  workOrderLinesCreateAndEdit:'area_workorderlines_createandedit',
  workOrderLinesDelete:'area_workorderlines_delete'};
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG20.json`, JSON.stringify(R,null,1));
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const WANT = JSON.parse(fs.readFileSync(`${DIR}/evidence/BIG16-role-before.json`)).fe_permissions.map(p=>p.code);

const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,300)};},{api:API_HOST,m,p,b:b||null});
const roleCodes=async()=>{const d=((await call('GET',`/api/roles/${ROLE}`)).json||{}).data||{};
  return (d.fe_permissions||[]).map(p=>p.code);};
const state=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const body=(document.body.innerText||'').replace(/\s+/g,' ');
  let w=null; try{w=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'null');}catch(e){}
  const perms=(w&&(w.fe_permissions||(w.data&&w.data.fe_permissions)))||[];
  return {url:location.href, chars:body.length, head:body.slice(0,180),
    signedOut:/sign in to your account/i.test(body),
    storedPerms:perms.length, storedSeesWorkOrders:perms.some(p=>/^workOrdersView$/.test(String(p))),
    denied:/not authori|no permission|access denied|forbidden|don.t have permission/i.test(body),
    hasMore:!!document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'),
    hasLinesTable:!!document.querySelector('[data-test-id=table_work_order_lines]'),
    workOrdersInTopMenu:[...document.querySelectorAll('a,button')].filter(isVis)
      .some(e=>/^work orders$/i.test((e.innerText||'').trim())),
    printInPage:/print work order/i.test(body)};}, VIS);
const menuTexts=()=>page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);}, VIS);
// step into someone's shoes and make the PAGE believe it too, without logging anyone out
const stepInto = async (userId)=>{
  const sw = await call('POST','/api/switch-user',{user_id:userId});
  await page.waitForTimeout(2500);
  const fp = (await call('GET','/api/auth/me/fe-permissions')).json;
  const data = fp && fp.data;
  const applied = await page.evaluate(d=>{
    try{
      const raw = localStorage.getItem('fe_permissions_wrapper');
      let obj = raw ? JSON.parse(raw) : {};
      if (obj && obj.data) obj.data = {...obj.data, ...d}; else obj = {...obj, ...d};
      localStorage.setItem('fe_permissions_wrapper', JSON.stringify(obj));
      return true;
    }catch(e){ return String(e); }
  }, data);
  return {switch:sw.status, serverPerms:(data&&data.fe_permissions||[]).length,
    serverSeesWorkOrders:(data&&data.fe_permissions||[]).some(p=>/^workOrdersView$/.test(String(p))),
    applied};
};
const lookAtTheJob = async (label)=>{
  await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label});
  await page.waitForTimeout(3000);
  const st = await state();
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
  await page.waitForTimeout(2000);
  st.items = await menuTexts();
  st.printOffered = st.items.some(x=>/print work order/i.test(x));
  await page.keyboard.press('Escape');
  await page.screenshot({path:`${DIR}/evidence/BIG20-${label}.png`, fullPage:true}).catch(()=>{});
  return st;
};
const setToggles = async (codes, on)=>{
  await page.goto(`${APP}/administration/roles-permissions/${ROLE}/edit`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'roleedit'}); await page.waitForTimeout(2000);
  const acted = await page.evaluate(({pairs,on})=>{const out=[];
    for (const [code,tid] of pairs){
      const el=document.querySelector(`[data-test-id=${tid}]`); if(!el){ out.push([code,'absent']); continue; }
      const cur = el.getAttribute('aria-checked')==='true' || el.classList.contains('q-toggle--truthy')
               || (el.querySelector('input')||{}).checked === true;
      if (cur===on){ out.push([code,'already']); continue; }
      (el.closest('label,.q-toggle,.q-checkbox')||el).click(); out.push([code,'clicked']);
    } return out;}, {pairs:codes.map(c=>[c,TIDS[c]]).filter(x=>x[1]), on});
  await page.waitForTimeout(2500);
  const saved = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
    const b=[...document.querySelectorAll('button')].filter(isVis).find(e=>/^save$/i.test(t(e)));
    if(!b) return 'no Save'; if(b.disabled) return 'Save greyed out'; b.click(); return 'saved';}, VIS);
  await page.waitForTimeout(3500);
  await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return;
    const go=[...d.querySelectorAll('button')].filter(isVis).find(e=>/confirm|save|yes|update|ok/i.test(t(e)));
    if(go) go.click();}, VIS);
  await page.waitForTimeout(6000);
  return {acted, saved};
};

await settle(page,{label:'start'});
R.controlAdmin = await lookAtTheJob('admin');
log('CONTROL admin -> job opens %s, print offered %s (page believes %d rights)',
  R.controlAdmin.hasLinesTable, R.controlAdmin.printOffered, R.controlAdmin.storedPerms);
R.adminStore = await page.evaluate(()=>Object.keys(localStorage));
save();

const staff = rowsOf((await call('GET','/api/staff?limit=200')).json);
const canSee = staff.find(x=>x.role_label==='Technician' && x.is_active!==false);
const subject = staff.filter(x=>x.role_label==='Technician' && x.is_active!==false)[1] || canSee;

// ---- control B: the very same method, on someone who IS allowed to see work orders
R.controlB = {who:`${canSee.first_name} ${canSee.last_name}`, role:canSee.role_label};
R.controlB.step = await stepInto(canSee.id);
R.controlB.look = await lookAtTheJob('control-allowed');
log('CONTROL, a technician who IS allowed -> job opens %s, print offered %s, page believes %d rights (sees work orders %s)',
  R.controlB.look.hasLinesTable, R.controlB.look.printOffered,
  R.controlB.look.storedPerms, R.controlB.look.storedSeesWorkOrders);
await call('POST','/api/exit-switch-user',{});
await page.waitForTimeout(2500);
save();

// ---- the case itself
if (R.controlB.look.hasLinesTable){
  R.setup = {};
  const before = await roleCodes();
  R.setup.roleBefore = before.length;
  if (before.includes('workOrdersView')) R.setup.off = await setToggles(['workOrdersView'], false);
  R.setup.roleNow = (await roleCodes()).filter(c=>/workOrder/i.test(c));
  R.subject = {name:`${subject.first_name} ${subject.last_name}`, was:subject.role_label};
  await call('POST',`/api/staff/${subject.staff_id}/change`,
    {first_name:subject.first_name, last_name:subject.last_name, email:subject.email,
     workplace_id:subject.workplace_id||'b3c8c820-f815-4cf1-8938-10956c5ee71a', role_id:ROLE});
  const b = rowsOf((await call('GET','/api/staff?limit=200')).json).find(x=>x.id===subject.id);
  R.subject.now = b && b.role_label;
  log('%s is now on %s; that role keeps %s', R.subject.name, R.subject.now, JSON.stringify(R.setup.roleNow));
  if (String(R.subject.now||'').toUpperCase()==='TEST'){
    R.step = await stepInto(subject.id);
    R.attempt1 = await lookAtTheJob('no-view-1');
    R.attempt2 = await lookAtTheJob('no-view-2');
    log('AS SOMEONE WITH NO WORK-ORDER ACCESS -> signed out %s | job page opens %s | menu button %s | print offered %s | Work Orders in the top menu %s | told no access %s',
      R.attempt1.signedOut, R.attempt1.hasLinesTable, R.attempt1.hasMore,
      R.attempt1.printOffered, R.attempt1.workOrdersInTopMenu, R.attempt1.denied);
    await call('POST','/api/exit-switch-user',{});
    await page.waitForTimeout(2500);
  }
  // put the person back
  const roles = rowsOf((await call('GET',`/api/organizations/${ORG}/roles`)).json);
  const techRole = roles.find(r=>/^technician$/i.test(r.name||''));
  await call('POST',`/api/staff/${subject.staff_id}/change`,
    {first_name:subject.first_name, last_name:subject.last_name, email:subject.email,
     workplace_id:subject.workplace_id||'b3c8c820-f815-4cf1-8938-10956c5ee71a', role_id:techRole.id});
  const b2 = rowsOf((await call('GET','/api/staff?limit=200')).json).find(x=>x.id===subject.id);
  R.subject.restoredTo = b2 && b2.role_label;
  log('%s put back on %s', R.subject.name, R.subject.restoredTo);
} else log('the method itself does not work -- not judging the case on it');
save();

// ---- put the spare role back to its 33, one dependency level at a time
R.repair=[];
for (let pass=1; pass<=6; pass++){
  const now = await roleCodes();
  const missing = WANT.filter(c=>!now.includes(c));
  R.repair.push({pass, have:now.length, missing});
  log('repair pass %d: %d of %d, missing %s', pass, now.length, WANT.length, JSON.stringify(missing));
  if (!missing.length) break;
  const next = ORDER.filter(c=>missing.includes(c));
  const doable = next.length ? [next[0]] : missing.filter(c=>TIDS[c]);
  if (!doable.length) break;
  await setToggles(doable, true);
}
const end = await roleCodes();
R.roleLeftAt = {n:end.length, missing:WANT.filter(c=>!end.includes(c))};
log('spare role left at %d of %d; still missing %s', end.length, WANT.length, JSON.stringify(R.roleLeftAt.missing));
save();
log('done');
await s.browser.close();
process.exit(0);
