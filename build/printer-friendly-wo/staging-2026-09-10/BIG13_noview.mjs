// C45090 — a user whose role cannot view work orders cannot reach the print option.
// Route: make a throwaway role that has some access but NOT work-order viewing, put the
// Technician quick-login user on it, sign in as them, try to reach the job from the address
// bar AND from the menu. Positive control: the same address as admin opens and offers Print.
// The Technician user is put back on the Technician role and the throwaway role deleted, always.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const ORG='d55bc308-e61a-438d-b5f1-c7a73c89d49f';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG13.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const mk=(page)=>(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,320)};},{api:API_HOST,m,p,b:b||null});
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

// ---- positive control
R.control = await state(a.page);
await a.page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
await a.page.waitForTimeout(2200);
R.control.items = await menuTexts(a.page);
R.control.printOffered = R.control.items.some(t=>/print work order/i.test(t));
await a.page.keyboard.press('Escape');
log('CONTROL admin -> opens %s, print offered %s', R.control.hasLinesTable, R.control.printOffered);

// ---- the roles as they stand, and one role's shape
const roles = rowsOf((await call('GET',`/api/organizations/${ORG}/roles`)).json);
R.roleNames = roles.map(r=>({id:String(r.id||'').slice(0,8), n:r.name, users:r.usersCount, ed:r.editable}));
const tmpl = roles.find(r=>/technician/i.test(r.name||'')) || roles[0];
const one = (await call('GET',`/api/roles/${tmpl.id}`)).json;
const od = (one&&(one.data||one))||{};
R.roleShape = {keys:Object.keys(od).slice(0,20),
  perms:(od.permissions||od.fe_permissions||[]).slice(0,60)};
log('roles: %s', JSON.stringify(R.roleNames));
log('shape of %s: %s', tmpl.name, JSON.stringify(R.roleShape).slice(0,500));
save();

// ---- a throwaway role with no work-order viewing
const src = (od.permissions||od.fe_permissions||[]).map(p=>(typeof p==='string'?p:(p.slug||p.code||p.name)));
const keep = src.filter(p=>!/workOrder/i.test(String(p)));
R.newRole={wanted:keep};
for (const body of [
  {name:'ZZAUTOTEST No Work Orders', permissions:keep, organization_id:ORG, template_id:od.template_id},
  {name:'ZZAUTOTEST No Work Orders', fe_permissions:keep, organization_id:ORG},
]){
  const r = await call('POST','/api/roles', body);
  R.newRole[`create_${Object.keys(body).length}`]=r.status+' '+r.text.slice(0,200);
  if (r.status>=200&&r.status<300){ const j=(r.json&&(r.json.data||r.json))||{}; R.newRole.id=j.id||j.role_id; break; }
}
if (!R.newRole.id){
  const again = rowsOf((await call('GET',`/api/organizations/${ORG}/roles`)).json)
    .find(r=>/ZZAUTOTEST No Work Orders/i.test(r.name||''));
  if (again) R.newRole.id = again.id;
}
log('throwaway role: %s (%s permissions, none of them work orders)', R.newRole.id, keep.length);
save();

// ---- put the Technician quick-login user on it
R.swap={};
const staff = rowsOf((await call('GET','/api/staff?limit=200')).json);
const tech = staff.find(s=>String(s.email||'').toLowerCase()==='tech@shopview.com');
R.swap.techBefore = tech && {role:tech.role_label, staff_id:tech.staff_id};
const techRole = rowsOf((await call('GET',`/api/organizations/${ORG}/roles`)).json)
  .find(r=>/^technician$/i.test(r.name||''));
R.swap.technicianRoleId = techRole && String(techRole.id).slice(0,8);
if (R.newRole.id && tech){
  const body={first_name:tech.first_name, last_name:tech.last_name, email:'tech@shopview.com',
    workplace_id:tech.workplace_id||'b3c8c820-f815-4cf1-8938-10956c5ee71a', role_id:R.newRole.id};
  const r = await call('POST',`/api/staff/${tech.staff_id}/change`, body);
  R.swap.change = r.status+' '+r.text.slice(0,140);
  const back = rowsOf((await call('GET','/api/staff?limit=200')).json)
    .find(s=>String(s.email||'').toLowerCase()==='tech@shopview.com');
  R.swap.roleNow = back && back.role_label;
}
log('technician user is now on: %s', R.swap.roleNow);
save();
await a.browser.close();

// ---- sign in as them and try to reach the job
if (/ZZAUTOTEST/i.test(String(R.swap.roleNow||''))){
  const t = await boot2('tech', {route:`/workorders/${WO}/lines`});
  const tcall = mk(t.page);
  await settle(t.page,{label:'them'});
  const fp=(await tcall('GET','/api/auth/me/fe-permissions')).json;
  R.asThem = {perms:(fp?.data?.fe_permissions||[]).length,
    canSeeWorkOrders:(fp?.data?.fe_permissions||[]).some(p=>/workOrdersView/i.test(String(p)))};
  R.attempt1 = await state(t.page);
  await t.page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
  await t.page.waitForTimeout(2000);
  R.attempt1.items = await menuTexts(t.page);
  R.attempt1.printOffered = R.attempt1.items.some(x=>/print work order/i.test(x));
  await t.page.keyboard.press('Escape');
  await t.page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(t.page,{label:'them2'});
  R.attempt2 = await state(t.page);
  R.attempt3 = await t.page.evaluate(vis=>{const isVis=eval(vis); const x=e=>(e.innerText||'').trim();
    const l=[...document.querySelectorAll('a,button')].filter(isVis).find(e=>/^work orders$/i.test(x(e)));
    if(!l) return {workOrdersInMenu:false}; l.click(); return {workOrdersInMenu:true};}, VIS);
  await t.page.waitForTimeout(4000);
  R.attempt3.after = await state(t.page);
  await t.page.screenshot({path:`${DIR}/evidence/BIG13-asthem.png`, fullPage:true}).catch(()=>{});
  log('as them: %d permissions, can see work orders %s | url %s | lines table %s | more menu %s | print %s | Work Orders in the menu %s',
    R.asThem.perms, R.asThem.canSeeWorkOrders, R.attempt1.url, R.attempt1.hasLinesTable,
    R.attempt1.hasMore, R.attempt1.printOffered, R.attempt3.workOrdersInMenu);
  await t.browser.close();
}
save();

// ---- always put everything back
const b = await boot2('admin', {route:'/workorders'});
const call2 = mk(b.page);
await settle(b.page,{label:'restore'});
const staff2 = rowsOf((await call2('GET','/api/staff?limit=200')).json);
const tech2 = staff2.find(s=>String(s.email||'').toLowerCase()==='tech@shopview.com');
const roles2 = rowsOf((await call2('GET',`/api/organizations/${ORG}/roles`)).json);
const techRole2 = roles2.find(r=>/^technician$/i.test(r.name||''));
R.restore={};
if (tech2 && techRole2){
  const r = await call2('POST',`/api/staff/${tech2.staff_id}/change`,
    {first_name:tech2.first_name, last_name:tech2.last_name, email:'tech@shopview.com',
     workplace_id:tech2.workplace_id||'b3c8c820-f815-4cf1-8938-10956c5ee71a', role_id:techRole2.id});
  R.restore.change = r.status;
  const back = rowsOf((await call2('GET','/api/staff?limit=200')).json)
    .find(s=>String(s.email||'').toLowerCase()==='tech@shopview.com');
  R.restore.roleNow = back && back.role_label;
}
const junk = rowsOf((await call2('GET',`/api/organizations/${ORG}/roles`)).json)
  .find(r=>/ZZAUTOTEST No Work Orders/i.test(r.name||''));
if (junk){ const r=await call2('DELETE',`/api/roles/${junk.id}`); R.restore.deletedRole=r.status+' '+r.text.slice(0,100); }
log('restored: technician user on %s | throwaway role removed %s', R.restore.roleNow, R.restore.deletedRole);
save();
log('done');
await b.browser.close();
process.exit(0);
