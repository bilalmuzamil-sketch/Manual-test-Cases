// C45090 — a user whose role cannot view work orders cannot reach the print option.
// Every role on this system can currently see work orders, so one has to be set up, which is
// exactly what the case's own preconditions describe. Route: take the spare role already called
// "TEST" (nobody is on it), switch its work-order viewing off, put ONE technician on it, step
// into their shoes, and try to reach the job. Everything is snapshotted first and put back after.
// The Admin role and every admin user are left alone.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const ORG='d55bc308-e61a-438d-b5f1-c7a73c89d49f';
const TEST_ROLE='e0e9b247';       // "TEST", 0 users, editable
const TECH_ROLE='af8d02b5';       // "Technician"
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG14.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const mk=(page)=>(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,300)};},{api:API_HOST,m,p,b:b||null});
const state=(page)=>page.evaluate(vis=>{const isVis=eval(vis);
  const body=(document.body.innerText||'').replace(/\s+/g,' ');
  return {url:location.href, chars:body.length, head:body.slice(0,220),
    denied:/not authori|no permission|access denied|forbidden|don.t have permission/i.test(body),
    hasMore:!!document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'),
    hasLinesTable:!!document.querySelector('[data-test-id=table_work_order_lines]'),
    printInPage:/print work order/i.test(body)};}, VIS);
const menuTexts=(page)=>page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);}, VIS);

const a = await boot2('admin', {route:`/workorders/${WO}/lines`});
const call = mk(a.page);
await settle(a.page,{label:'admin'});

// ---- positive control: as an administrator the page opens and Print is offered
R.control = await state(a.page);
await a.page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
await a.page.waitForTimeout(2200);
R.control.items = await menuTexts(a.page);
R.control.printOffered = R.control.items.some(t=>/print work order/i.test(t));
await a.page.keyboard.press('Escape');
log('CONTROL admin -> opens %s, print offered %s', R.control.hasLinesTable, R.control.printOffered);

// ---- snapshot the spare role BEFORE touching it
const roles = rowsOf((await call('GET',`/api/organizations/${ORG}/roles`)).json);
const testRole = roles.find(r=>String(r.id).startsWith(TEST_ROLE));
const full = ((await call('GET',`/api/roles/${testRole.id}`)).json||{}).data;
R.snapshot = full;
fs.writeFileSync(`${DIR}/evidence/BIG14-role-before.json`, JSON.stringify(full,null,1));
const perms = (full.fe_permissions||[]);
R.roleBefore = {name:full.name, n:perms.length, woView:perms.some(p=>/^workOrdersView$/.test(p.code||p.name))};
const keptIds = perms.filter(p=>!/^workOrders/i.test(p.code||p.name)).map(p=>p.id);
const keptCodes = perms.filter(p=>!/^workOrders/i.test(p.code||p.name)).map(p=>p.code||p.name);
log('spare role %s: %d permissions, sees work orders %s -> keeping %d',
  full.name, perms.length, R.roleBefore.woView, keptIds.length);
save();

// ---- switch its work-order viewing off
R.write={};
const desc = (full.description && String(full.description).trim()) ? {description:full.description} : {};
for (const [verb,path,body] of [
  ['PUT', `/api/roles/${testRole.id}`, {name:full.name, ...desc, fe_permissions:keptIds, view_mode:full.view_mode, cross_toggles:full.cross_toggles}],
  ['PUT', `/api/roles/${testRole.id}`, {name:full.name, ...desc, permissions:keptIds}],
  ['PUT', `/api/roles/${testRole.id}`, {name:full.name, ...desc, fe_permissions:keptCodes, view_mode:full.view_mode, cross_toggles:full.cross_toggles}],
]){
  const r = await call(verb, path, body);
  R.write[`${verb}_${Object.keys(body).length}`] = r.status+' '+r.text.slice(0,150);
  if (r.status>=200 && r.status<300) break;
}
const after = ((await call('GET',`/api/roles/${testRole.id}`)).json||{}).data||{};
R.roleAfter = {n:(after.fe_permissions||[]).length,
  woView:(after.fe_permissions||[]).some(p=>/^workOrdersView$/.test(p.code||p.name))};
log('after the write the role has %d permissions, sees work orders %s', R.roleAfter.n, R.roleAfter.woView);
save();

// ---- put ONE technician on it (never an admin), then step into their shoes
R.subject={};
if (R.roleAfter.woView === false){
  const staff = rowsOf((await call('GET','/api/staff?limit=200')).json);
  const victim = staff.find(s=>s.role_label==='Technician' && s.is_active!==false) 
              || staff.find(s=>s.role_label==='Technician');
  R.subject.before = victim && {name:`${victim.first_name} ${victim.last_name}`, email:victim.email,
    role:victim.role_label, id:victim.id, staff_id:victim.staff_id};
  const r = await call('POST',`/api/staff/${victim.staff_id}/change`,
    {first_name:victim.first_name, last_name:victim.last_name, email:victim.email,
     workplace_id:victim.workplace_id||'b3c8c820-f815-4cf1-8938-10956c5ee71a', role_id:testRole.id});
  R.subject.change = r.status+' '+r.text.slice(0,120);
  const back = rowsOf((await call('GET','/api/staff?limit=200')).json).find(s=>s.id===victim.id);
  R.subject.roleNow = back && back.role_label;
  log('subject %s is now on: %s', R.subject.before.name, R.subject.roleNow);
  save();

  if (String(R.subject.roleNow||'').toUpperCase()==='TEST'){
    R.imp = (await call('POST','/api/switch-user',{user_id:victim.id})).status;
    await a.page.waitForTimeout(2500);
    const fp=(await call('GET','/api/auth/me/fe-permissions')).json;
    R.asThem = {perms:(fp?.data?.fe_permissions||[]).length,
      canSeeWorkOrders:(fp?.data?.fe_permissions||[]).some(p=>/^workOrdersView$/.test(String(p)))};
    // attempt 1, straight at the address
    await a.page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
    await settle(a.page,{label:'them1'});
    R.attempt1 = await state(a.page);
    await a.page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
    await a.page.waitForTimeout(2000);
    R.attempt1.items = await menuTexts(a.page);
    R.attempt1.printOffered = R.attempt1.items.some(x=>/print work order/i.test(x));
    await a.page.keyboard.press('Escape');
    // attempt 2, on a settled page
    await a.page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
    await settle(a.page,{label:'them2'});
    R.attempt2 = await state(a.page);
    // and the way a person would: the Work Orders item in the top menu
    R.attempt3 = await a.page.evaluate(vis=>{const isVis=eval(vis); const x=e=>(e.innerText||'').trim();
      const l=[...document.querySelectorAll('a,button')].filter(isVis).find(e=>/^work orders$/i.test(x(e)));
      if(!l) return {workOrdersInMenu:false}; l.click(); return {workOrdersInMenu:true};}, VIS);
    await a.page.waitForTimeout(4000);
    R.attempt3.after = await state(a.page);
    await a.page.screenshot({path:`${DIR}/evidence/BIG14-asthem.png`, fullPage:true}).catch(()=>{});
    log('as them: %d permissions, can see work orders %s | lines table %s | more menu %s | print %s | Work Orders in the top menu %s',
      R.asThem.perms, R.asThem.canSeeWorkOrders, R.attempt1.hasLinesTable, R.attempt1.hasMore,
      R.attempt1.printOffered, R.attempt3.workOrdersInMenu);
    R.exit = (await call('POST','/api/exit-switch-user',{})).status;
    await a.page.waitForTimeout(2000);
  }
  // ---- put the technician back
  const fp2=(await call('GET','/api/auth/me/fe-permissions')).json;
  R.backToAdmin = (fp2?.data?.fe_permissions||[]).length;
  const techRoleFull = roles.find(r=>String(r.id).startsWith(TECH_ROLE));
  const rr = await call('POST',`/api/staff/${victim.staff_id}/change`,
    {first_name:victim.first_name, last_name:victim.last_name, email:victim.email,
     workplace_id:victim.workplace_id||'b3c8c820-f815-4cf1-8938-10956c5ee71a', role_id:techRoleFull.id});
  const back2 = rowsOf((await call('GET','/api/staff?limit=200')).json).find(s=>s.id===victim.id);
  R.subject.restoredTo = back2 && back2.role_label;
  log('subject put back on: %s', R.subject.restoredTo);
}
save();

// ---- put the spare role back exactly as it was
R.roleRestore={};
const allIds = (R.snapshot.fe_permissions||[]).map(p=>p.id);
const rdesc = (R.snapshot.description && String(R.snapshot.description).trim()) ? {description:R.snapshot.description} : {};
for (const [verb,body] of [
  ['PUT', {name:R.snapshot.name, ...rdesc, fe_permissions:allIds, view_mode:R.snapshot.view_mode, cross_toggles:R.snapshot.cross_toggles}],
  ['PUT', {name:R.snapshot.name, ...rdesc, permissions:allIds}],
]){
  const r = await call(verb, `/api/roles/${testRole.id}`, body);
  R.roleRestore[verb]=r.status+' '+r.text.slice(0,120);
  if (r.status>=200&&r.status<300) break;
}
const fin = ((await call('GET',`/api/roles/${testRole.id}`)).json||{}).data||{};
R.roleRestored = {n:(fin.fe_permissions||[]).length,
  woView:(fin.fe_permissions||[]).some(p=>/^workOrdersView$/.test(p.code||p.name))};
log('spare role restored: %d permissions, sees work orders %s (was %d / %s)',
  R.roleRestored.n, R.roleRestored.woView, R.roleBefore.n, R.roleBefore.woView);
save();
log('done');
await a.browser.close();
process.exit(0);
