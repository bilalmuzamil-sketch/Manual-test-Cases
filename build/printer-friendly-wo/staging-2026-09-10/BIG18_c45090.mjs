// Two jobs in one pass.
// 1. Put the spare role back exactly as it was found (switching work-order viewing off also
//    switched off five things beneath it, and switching it back on did not bring them back).
// 2. C45090 done properly. The last attempt did not prove its instrument: the page keeps the
//    signed-in person's permissions in the browser's own storage, so after stepping into
//    somebody else's shoes the page was still drawing itself with the administrator's rights.
//    This run clears that store, reloads, and CHECKS what the page itself believes before
//    judging anything.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const ORG='d55bc308-e61a-438d-b5f1-c7a73c89d49f';
const ROLE='e0e9b247-5432-43e8-9e35-f0c9bf3ade16';
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const TIDS={workOrdersView:'area_workorders_view', workOrdersCreateAndEdit:'area_workorders_createandedit',
  workOrdersDelete:'area_workorders_delete', woReviewWorkOrders:'wosetting_reviewworkorders',
  woPickParts:'wosetting_pickparts', woOrderParts:'wosetting_orderparts', woMoveLabor:'wosetting_movelabor',
  workOrderLinesCreateAndEdit:'area_workorderlines_createandedit',
  workOrderLinesDelete:'area_workorderlines_delete'};
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG18.json`, JSON.stringify(R,null,1));
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const WANT = new Set(JSON.parse(fs.readFileSync(`${DIR}/evidence/BIG16-role-before.json`))
  .fe_permissions.map(p=>p.code));

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
  let stored=null; try{stored=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'null');}catch(e){}
  return {url:location.href, chars:body.length, head:body.slice(0,200),
    storedPerms:(stored&&(stored.fe_permissions||stored.data&&stored.data.fe_permissions)||[]).length,
    storedSeesWorkOrders:((stored&&(stored.fe_permissions||stored.data&&stored.data.fe_permissions))||[])
      .some(p=>/^workOrdersView$/.test(String(p))),
    denied:/not authori|no permission|access denied|forbidden|don.t have permission/i.test(body),
    hasMore:!!document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'),
    hasLinesTable:!!document.querySelector('[data-test-id=table_work_order_lines]'),
    workOrdersInTopMenu:[...document.querySelectorAll('a,button')].filter(isVis)
      .some(e=>/^work orders$/i.test((e.innerText||'').trim())),
    printInPage:/print work order/i.test(body)};}, VIS);
const menuTexts=()=>page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);}, VIS);
const setToggles = async (codes, on)=>{
  await page.goto(`${APP}/administration/roles-permissions/${ROLE}/edit`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'roleedit'});
  const acted = await page.evaluate(({tids,on})=>{const out=[];
    for (const [code,tid] of tids){
      const el=document.querySelector(`[data-test-id=${tid}]`); if(!el){ out.push([code,'not on screen']); continue; }
      const cur = el.getAttribute('aria-checked')==='true' || el.classList.contains('q-toggle--truthy')
               || (el.querySelector('input')||{}).checked === true;
      if (cur===on){ out.push([code,'already '+(on?'on':'off')]); continue; }
      (el.closest('label,.q-toggle,.q-checkbox')||el).click(); out.push([code,'clicked']);
    } return out;}, {tids:codes.map(c=>[c,TIDS[c]]).filter(x=>x[1]), on});
  await page.waitForTimeout(2500);
  const saved = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
    const b=[...document.querySelectorAll('button')].filter(isVis).find(e=>/^save$/i.test(t(e)));
    if(!b) return 'no Save button'; if(b.disabled) return 'Save is greyed out'; b.click(); return 'saved';}, VIS);
  await page.waitForTimeout(3500);
  const confirmed = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return null;
    const go=[...d.querySelectorAll('button')].filter(isVis).find(e=>/confirm|save|yes|update|ok/i.test(t(e)));
    const txt=t(d).slice(0,200); if(go) go.click(); return txt;}, VIS);
  await page.waitForTimeout(6000);
  return {acted, saved, confirmed};
};

await settle(page,{label:'start'});
// ---- positive control
R.control = await state();
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
await page.waitForTimeout(2200);
R.control.items = await menuTexts();
R.control.printOffered = R.control.items.some(t=>/print work order/i.test(t));
await page.keyboard.press('Escape');
log('CONTROL admin -> page opens %s, print offered %s, page believes it has %d permissions',
  R.control.hasLinesTable, R.control.printOffered, R.control.storedPerms);

// ---- 1. put the spare role back to the 33 it started with
let now = await roleCodes();
R.repair = {now:now.length, missing:[...WANT].filter(c=>!now.includes(c))};
log('spare role is at %d of %d; missing %s', now.length, WANT.size, JSON.stringify(R.repair.missing));
if (R.repair.missing.length){
  R.repair.run = await setToggles(R.repair.missing, true);
  now = await roleCodes();
  R.repair.after = {n:now.length, stillMissing:[...WANT].filter(c=>!now.includes(c))};
  log('after the repair: %d permissions, still missing %s', now.length, JSON.stringify(R.repair.after.stillMissing));
}
save();

// ---- 2. C45090, with the browser's own store cleared so the page cannot use stale rights
R.off = await setToggles(['workOrdersView'], false);
R.roleOff = (await roleCodes()).filter(c=>/workOrder|^wo/i.test(c));
log('work-order viewing switched off; the role now keeps %s', JSON.stringify(R.roleOff));
if (!R.roleOff.includes('workOrdersView')){
  const staff = rowsOf((await call('GET','/api/staff?limit=200')).json);
  const victim = staff.find(x=>x.role_label==='Technician' && x.is_active!==false) || staff.find(x=>x.role_label==='Technician');
  R.subject = {name:`${victim.first_name} ${victim.last_name}`, was:victim.role_label};
  await call('POST',`/api/staff/${victim.staff_id}/change`,
    {first_name:victim.first_name, last_name:victim.last_name, email:victim.email,
     workplace_id:victim.workplace_id||'b3c8c820-f815-4cf1-8938-10956c5ee71a', role_id:ROLE});
  const back = rowsOf((await call('GET','/api/staff?limit=200')).json).find(x=>x.id===victim.id);
  R.subject.now = back && back.role_label;
  log('%s is now on %s', R.subject.name, R.subject.now);

  if (String(R.subject.now||'').toUpperCase()==='TEST'){
    R.imp = (await call('POST','/api/switch-user',{user_id:victim.id})).status;
    await page.waitForTimeout(2500);
    // THE FIX: clear what the browser remembered about the administrator, then reload
    await page.evaluate(()=>{ try{ localStorage.clear(); sessionStorage.clear(); }catch(e){} });
    await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded',timeout:60000});
    await settle(page,{label:'reseat'});
    await page.waitForTimeout(4000);
    const fp=(await call('GET','/api/auth/me/fe-permissions')).json;
    R.asThem = {server:(fp?.data?.fe_permissions||[]).length,
      serverSeesWorkOrders:(fp?.data?.fe_permissions||[]).some(p=>/^workOrdersView$/.test(String(p)))};
    R.landing = await state();
    // now, and only now, the attempt on the job itself
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
    await page.screenshot({path:`${DIR}/evidence/BIG18-asthem.png`, fullPage:true}).catch(()=>{});
    log('AS THEM -> the page itself believes it has %d permissions (sees work orders %s); server says %d (%s)',
      R.attempt1.storedPerms, R.attempt1.storedSeesWorkOrders, R.asThem.server, R.asThem.serverSeesWorkOrders);
    log('          job page opens %s | menu button %s | print offered %s | Work Orders in the top menu %s | says no access %s',
      R.attempt1.hasLinesTable, R.attempt1.hasMore, R.attempt1.printOffered,
      R.attempt1.workOrdersInTopMenu, R.attempt1.denied);
    R.exit = (await call('POST','/api/exit-switch-user',{})).status;
    await page.waitForTimeout(2500);
    await page.evaluate(()=>{ try{ localStorage.clear(); }catch(e){} });
  }
  // ---- put the technician back
  const roles = rowsOf((await call('GET',`/api/organizations/${ORG}/roles`)).json);
  const techRole = roles.find(r=>/^technician$/i.test(r.name||''));
  await call('POST',`/api/staff/${victim.staff_id}/change`,
    {first_name:victim.first_name, last_name:victim.last_name, email:victim.email,
     workplace_id:victim.workplace_id||'b3c8c820-f815-4cf1-8938-10956c5ee71a', role_id:techRole.id});
  const b2 = rowsOf((await call('GET','/api/staff?limit=200')).json).find(x=>x.id===victim.id);
  R.subject.restoredTo = b2 && b2.role_label;
}
save();

// ---- put the spare role back again
const s2 = await boot2('admin', {route:'/workorders'});
await s2.page.waitForTimeout(1500);
await s2.browser.close();
let end = await roleCodes();
R.finalRepair = {n:end.length, missing:[...WANT].filter(c=>!end.includes(c))};
if (R.finalRepair.missing.length){
  R.finalRepair.run = await setToggles(R.finalRepair.missing, true);
  end = await roleCodes();
  R.finalRepair.after = {n:end.length, missing:[...WANT].filter(c=>!end.includes(c))};
}
log('spare role left at %d of %d (%s)', end.length, WANT.size,
  JSON.stringify([...WANT].filter(c=>!end.includes(c))));
log('technician put back on %s', R.subject && R.subject.restoredTo);
save();
log('done');
await s.browser.close();
process.exit(0);
