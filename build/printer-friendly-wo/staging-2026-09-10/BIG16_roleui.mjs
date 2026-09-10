// C45090 — the role has to be set up through the screen, exactly as the case's own
// preconditions describe: Settings -> Roles & Permissions -> the pencil -> switch work-order
// viewing off -> Save. The system refuses to do it any other way (the direct route errors).
// The spare role "TEST" is used (nobody is on it), one technician is put on it, and everything
// is put back at the end. No admin user and no admin role is touched.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const ORG='d55bc308-e61a-438d-b5f1-c7a73c89d49f';
const ROLE='e0e9b247-5432-43e8-9e35-f0c9bf3ade16';   // "TEST", 0 users, editable
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG16.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,300)};},{api:API_HOST,m,p,b:b||null});
const state=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const body=(document.body.innerText||'').replace(/\s+/g,' ');
  return {url:location.href, chars:body.length, head:body.slice(0,220),
    denied:/not authori|no permission|access denied|forbidden|don.t have permission/i.test(body),
    hasMore:!!document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'),
    hasLinesTable:!!document.querySelector('[data-test-id=table_work_order_lines]'),
    printInPage:/print work order/i.test(body)};}, VIS);
const menuTexts=()=>page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);}, VIS);
const roleWoView=async()=>{const d=((await call('GET',`/api/roles/${ROLE}`)).json||{}).data||{};
  return {n:(d.fe_permissions||[]).length,
    woView:(d.fe_permissions||[]).some(p=>/^workOrdersView$/.test(p.code||p.name))};};

await settle(page,{label:'admin'});
// ---- positive control
R.control = await state();
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
await page.waitForTimeout(2200);
R.control.items = await menuTexts();
R.control.printOffered = R.control.items.some(t=>/print work order/i.test(t));
await page.keyboard.press('Escape');
log('CONTROL admin -> opens %s, print offered %s', R.control.hasLinesTable, R.control.printOffered);
R.roleBefore = await roleWoView();
fs.writeFileSync(`${DIR}/evidence/BIG16-role-before.json`,
  JSON.stringify(((await call('GET',`/api/roles/${ROLE}`)).json||{}).data, null, 1));

// ---- the role edit screen
await page.goto(`${APP}/administration/roles-permissions/${ROLE}/edit`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'roleedit'});
R.screen = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return {heading:t(document.querySelector('h1,h2,.text-h5')||document.body).slice(0,120),
    cards:[...document.querySelectorAll('.q-card,section,fieldset')].filter(isVis).map(c=>t(c).slice(0,90)).slice(0,20),
    toggles:[...document.querySelectorAll('.q-toggle,.q-checkbox,input[type=checkbox]')].filter(isVis)
      .map(e=>({t:t(e.closest('label,.q-item,tr,td,div')||e).slice(0,70),
        tid:e.getAttribute('data-test-id')||'', on:e.getAttribute('aria-checked')||
        (e.classList.contains('q-toggle--truthy')?'true':'false')})).slice(0,60)};}, VIS);
await page.screenshot({path:`${DIR}/evidence/BIG16-roleedit.png`, fullPage:true}).catch(()=>{});
log('role screen: %s | %d toggles', R.screen.heading, R.screen.toggles.length);
fs.writeFileSync(`${DIR}/evidence/BIG16-screen.json`, JSON.stringify(R.screen,null,1));
save();

// ---- switch work-order viewing off
R.toggle = await page.evaluate(()=>{
  // the work-order View switch, by its own name on the page
  const el=document.querySelector('[data-test-id=area_workorders_view]');
  if(!el) return {clicked:false, reason:'the work-order viewing switch is not on this screen'};
  const before = el.getAttribute('aria-checked') || (el.classList.contains('q-toggle--truthy')?'true':'false');
  const target = el.closest('label,.q-toggle,.q-checkbox') || el;
  target.click();
  const after = el.getAttribute('aria-checked') || (el.classList.contains('q-toggle--truthy')?'true':'false');
  return {clicked:true, before, after};});
await page.waitForTimeout(2500);
R.saved = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
  const b=[...document.querySelectorAll('button')].filter(isVis).find(e=>/^save$/i.test(t(e)));
  if(!b) return {found:false, buttons:[...document.querySelectorAll('button')].filter(isVis).map(t).slice(0,15)};
  if (b.disabled) return {found:true, disabled:true}; b.click(); return {found:true, clicked:true};}, VIS);
await page.waitForTimeout(3500);
R.confirm = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return null;
  const go=[...d.querySelectorAll('button')].filter(isVis)
    .find(e=>/confirm|save|yes|update|ok/i.test(t(e)));
  const txt=t(d).slice(0,220); if(go) go.click(); return {text:txt, pressed:go?t(go):null};}, VIS);
await page.waitForTimeout(6000);
R.roleAfter = await roleWoView();
await page.screenshot({path:`${DIR}/evidence/BIG16-aftersave.png`, fullPage:true}).catch(()=>{});
log('toggle %s | save %s | confirm %s | role now %s',
  JSON.stringify(R.toggle).slice(0,180), JSON.stringify(R.saved), JSON.stringify(R.confirm),
  JSON.stringify(R.roleAfter));
save();

// ---- put one technician on it and step into their shoes
let victim=null;
if (R.roleAfter.woView === false){
  const staff = rowsOf((await call('GET','/api/staff?limit=200')).json);
  victim = staff.find(x=>x.role_label==='Technician' && x.is_active!==false)
        || staff.find(x=>x.role_label==='Technician');
  R.subject = {name:`${victim.first_name} ${victim.last_name}`, was:victim.role_label};
  const r = await call('POST',`/api/staff/${victim.staff_id}/change`,
    {first_name:victim.first_name, last_name:victim.last_name, email:victim.email,
     workplace_id:victim.workplace_id||'b3c8c820-f815-4cf1-8938-10956c5ee71a', role_id:ROLE});
  R.subject.change = r.status+' '+r.text.slice(0,120);
  const back = rowsOf((await call('GET','/api/staff?limit=200')).json).find(x=>x.id===victim.id);
  R.subject.now = back && back.role_label;
  log('subject %s is now on %s', R.subject.name, R.subject.now);
  save();
  if (String(R.subject.now||'').toUpperCase()==='TEST'){
    R.imp = (await call('POST','/api/switch-user',{user_id:victim.id})).status;
    await page.waitForTimeout(2500);
    const fp=(await call('GET','/api/auth/me/fe-permissions')).json;
    R.asThem={perms:(fp?.data?.fe_permissions||[]).length,
      canSeeWorkOrders:(fp?.data?.fe_permissions||[]).some(p=>/^workOrdersView$/.test(String(p)))};
    await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
    await settle(page,{label:'them1'});
    R.attempt1 = await state();
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
    await page.waitForTimeout(2000);
    R.attempt1.items = await menuTexts();
    R.attempt1.printOffered = R.attempt1.items.some(x=>/print work order/i.test(x));
    await page.keyboard.press('Escape');
    await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
    await settle(page,{label:'them2'});
    R.attempt2 = await state();
    R.attempt3 = await page.evaluate(vis=>{const isVis=eval(vis); const x=e=>(e.innerText||'').trim();
      const l=[...document.querySelectorAll('a,button')].filter(isVis).find(e=>/^work orders$/i.test(x(e)));
      if(!l) return {workOrdersInMenu:false}; l.click(); return {workOrdersInMenu:true};}, VIS);
    await page.waitForTimeout(4000);
    R.attempt3.after = await state();
    await page.screenshot({path:`${DIR}/evidence/BIG16-asthem.png`, fullPage:true}).catch(()=>{});
    log('as them: %d permissions, can see work orders %s | lines table %s | more menu %s | print %s | Work Orders in the top menu %s',
      R.asThem.perms, R.asThem.canSeeWorkOrders, R.attempt1.hasLinesTable, R.attempt1.hasMore,
      R.attempt1.printOffered, R.attempt3.workOrdersInMenu);
    R.exit = (await call('POST','/api/exit-switch-user',{})).status;
    await page.waitForTimeout(2500);
  }
}
save();

// ---- put everything back
R.restore={};
if (victim){
  const roles = rowsOf((await call('GET',`/api/organizations/${ORG}/roles`)).json);
  const techRole = roles.find(r=>/^technician$/i.test(r.name||''));
  const r = await call('POST',`/api/staff/${victim.staff_id}/change`,
    {first_name:victim.first_name, last_name:victim.last_name, email:victim.email,
     workplace_id:victim.workplace_id||'b3c8c820-f815-4cf1-8938-10956c5ee71a', role_id:techRole.id});
  R.restore.staff = r.status;
  const back = rowsOf((await call('GET','/api/staff?limit=200')).json).find(x=>x.id===victim.id);
  R.restore.staffNow = back && back.role_label;
}
// switch the role's work-order viewing back on, the same way it was switched off
await page.goto(`${APP}/administration/roles-permissions/${ROLE}/edit`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'roleback'});
R.restore.toggle = await page.evaluate(()=>{
  const el=document.querySelector('[data-test-id=area_workorders_view]');
  if(!el) return {clicked:false};
  const before = el.getAttribute('aria-checked') || (el.classList.contains('q-toggle--truthy')?'true':'false');
  (el.closest('label,.q-toggle,.q-checkbox')||el).click();
  const after = el.getAttribute('aria-checked') || (el.classList.contains('q-toggle--truthy')?'true':'false');
  return {clicked:true, before, after};});
await page.waitForTimeout(2500);
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
  const b=[...document.querySelectorAll('button')].filter(isVis).find(e=>/^save$/i.test(t(e)));
  if(b && !b.disabled) b.click();}, VIS);
await page.waitForTimeout(3500);
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return;
  const go=[...d.querySelectorAll('button')].filter(isVis).find(e=>/confirm|save|yes|update|ok/i.test(t(e)));
  if(go) go.click();}, VIS);
await page.waitForTimeout(6000);
R.restore.role = await roleWoView();
log('put back: technician on %s | spare role %d permissions, sees work orders %s (was %d / %s)',
  R.restore.staffNow, R.restore.role.n, R.restore.role.woView, R.roleBefore.n, R.roleBefore.woView);
save();
log('done');
await s.browser.close();
process.exit(0);
