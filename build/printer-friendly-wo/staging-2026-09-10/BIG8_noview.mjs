// C45090 — a user whose role cannot view work orders cannot reach the print option.
// Route: find a role WITHOUT work-order view, put the Technician quick-login user on it
// (playbook G, Rule 74 multi-login), sign in as that user, try to open the work order.
// Positive control: the same URL as admin opens the page AND offers Print Work Order.
// The Technician user is put back on the Technician role at the end, always.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG8.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const TECH_STAFF='6fb22c1b';           // /change staff id prefix, resolved live below
const TECH_ROLE_HINT='131b5274';       // the Technician role we must restore to
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const mk=(page)=>(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,240)};},{api:API_HOST,m,p,b:b||null});
const openMore=(page)=>page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]');
  if(!b) return {opened:false}; b.click(); return {opened:true};});
const items=(page)=>page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);}, VIS);
const pageState=(page)=>page.evaluate(vis=>{const isVis=eval(vis);
  const body=(document.body.innerText||'').replace(/\s+/g,' ');
  return {url:location.href, chars:body.length, head:body.slice(0,220),
    denied:/not authori|no permission|access denied|forbidden|don.t have permission/i.test(body),
    hasMore:!!document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'),
    hasLinesTable:!!document.querySelector('[data-test-id=table_work_order_lines]')};}, VIS);

// ---------- 1. as admin: the positive control, plus the role and staff facts
const a = await boot2('admin', {route:`/workorders/${WO}/lines`});
const call = mk(a.page);
await settle(a.page,{label:'admin'});
R.controlAdmin = await pageState(a.page);
R.controlAdmin.menu = await openMore(a.page); await a.page.waitForTimeout(2200);
R.controlAdmin.items = await items(a.page);
R.controlAdmin.printOffered = R.controlAdmin.items.some(t=>/print work order/i.test(t));
log('CONTROL admin: page opens=%s, print offered=%s', R.controlAdmin.hasLinesTable, R.controlAdmin.printOffered);
await a.page.keyboard.press('Escape');

const me = (await call('GET','/api/auth/me/fe-permissions')).json;
const org = (me&&me.data&&(me.data.organization_id||me.data.organizationId))
  || (await call('GET','/api/auth/me')).json?.data?.organization_id;
R.org = org;
let roles = rowsOf((await call('GET',`/api/organizations/${org}/roles`)).json);
R.roleCount = roles.length;
const permsOf = r => (r.permissions||r.fe_permissions||[]).map(p=>String(p.slug||p.code||p.name||p));
const canSeeWO = r => permsOf(r).some(p=>/workOrdersView|work_orders_view|workOrderView/i.test(p));
R.roles = roles.map(r=>({id:String(r.id||'').slice(0,8), name:r.name||r.label,
  perms:permsOf(r).length, woView:canSeeWO(r)}));
log('roles: %s', JSON.stringify(R.roles));
// the role detail may not carry permissions in the list -- fetch the candidates
let target=null;
for (const r of roles){
  let full=r;
  if (!permsOf(r).length){ const d=(await call('GET',`/api/roles/${r.id}`)).json; full=(d&&(d.data||d))||r; }
  const p=permsOf(full);
  if (p.length && !p.some(x=>/workOrdersView|work_orders_view|workOrderView/i.test(x))){
    target={id:r.id, name:r.name||r.label, perms:p.length}; break; }
}
R.targetRole = target;
log('role with no work-order viewing: %s', JSON.stringify(target));
save();

// ---------- 2. put the Technician quick-login user on that role
R.swap={};
const staff = rowsOf((await call('GET','/api/staff?limit=200')).json);
const tech = staff.find(s=>String(s.email||'').toLowerCase()==='tech@shopview.com');
R.swap.tech = tech && {id:String(tech.id||'').slice(0,8), role:tech.role_label||tech.role_name};
const changeId = (tech && (tech.staff_id||tech.id)) || null;
if (target && tech){
  const body={first_name:tech.first_name||'Tech', last_name:tech.last_name||'User',
    email:'tech@shopview.com', workplace_id:tech.workplace_id||'b3c8c820-f815-4cf1-8938-10956c5ee71a',
    role_id:target.id};
  for (const sid of [ '6fb22c1b-0000-0000-0000-000000000000', changeId ]){
    if (!sid) continue;
    const r = await call('POST',`/api/staff/${sid}/change`, body);
    R.swap[`change_${String(sid).slice(0,8)}`]=r.status+' '+r.text.slice(0,90);
    if (r.status>=200&&r.status<300){ R.swap.usedStaffId=String(sid).slice(0,8); break; }
  }
  const back = rowsOf((await call('GET','/api/staff?limit=200')).json)
    .find(s=>String(s.email||'').toLowerCase()==='tech@shopview.com');
  R.swap.roleNow = back && (back.role_label||back.role_name);
  log('technician user now on role: %s', R.swap.roleNow);
}
save();
await a.browser.close();

// ---------- 3. sign in as that user and try to reach the work order
if (R.swap.roleNow){
  const t = await boot2('tech', {route:`/workorders/${WO}/lines`});
  await settle(t.page,{label:'tech'});
  R.asTech = await pageState(t.page);
  R.asTech.perms = ((await mk(t.page)('GET','/api/auth/me/fe-permissions')).json?.data?.fe_permissions||[]).length;
  R.asTech.menu = await openMore(t.page); await t.page.waitForTimeout(2000);
  R.asTech.items = await items(t.page);
  R.asTech.printOffered = R.asTech.items.some(x=>/print work order/i.test(x));
  // a second attempt on a settled page, as the guard requires
  await t.page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(t.page,{label:'tech2'});
  R.asTech2 = await pageState(t.page);
  await t.page.screenshot({path:`${DIR}/evidence/BIG8-astech.png`, fullPage:true}).catch(()=>{});
  log('as the no-view user: url=%s lines table=%s more menu=%s print=%s perms=%d',
    R.asTech.url, R.asTech.hasLinesTable, R.asTech.hasMore, R.asTech.printOffered, R.asTech.perms);
  await t.browser.close();
}
save();

// ---------- 4. always put the Technician user back
const b = await boot2('admin', {route:'/workorders'});
const call2 = mk(b.page);
await settle(b.page,{label:'restore'});
const staff2 = rowsOf((await call2('GET','/api/staff?limit=200')).json);
const tech2 = staff2.find(s=>String(s.email||'').toLowerCase()==='tech@shopview.com');
const roles2 = rowsOf((await call2('GET',`/api/organizations/${R.org}/roles`)).json);
const techRole = roles2.find(r=>String(r.id||'').startsWith(TECH_ROLE_HINT))
              || roles2.find(r=>/^technician$/i.test(r.name||r.label||''));
R.restore={roleTarget: techRole && {id:String(techRole.id||'').slice(0,8), name:techRole.name||techRole.label}};
if (tech2 && techRole){
  const body={first_name:tech2.first_name||'Tech', last_name:tech2.last_name||'User',
    email:'tech@shopview.com', workplace_id:tech2.workplace_id||'b3c8c820-f815-4cf1-8938-10956c5ee71a',
    role_id:techRole.id};
  for (const sid of ['6fb22c1b-0000-0000-0000-000000000000', tech2.staff_id||tech2.id]){
    if(!sid) continue;
    const r=await call2('POST',`/api/staff/${sid}/change`, body);
    R.restore[`change_${String(sid).slice(0,8)}`]=r.status;
    if(r.status>=200&&r.status<300) break;
  }
  const back = rowsOf((await call2('GET','/api/staff?limit=200')).json)
    .find(s=>String(s.email||'').toLowerCase()==='tech@shopview.com');
  R.restore.roleNow = back && (back.role_label||back.role_name);
}
log('technician user restored to: %s', R.restore.roleNow);
save();
await b.browser.close();
log('done');
process.exit(0);
