// The three More-menu cases probe01 could not settle.
//   C45088 — the ready_for_review work order: its menu never OPENED (menuOpen:false), so "print
//            absent" there was meaningless. Retried with longer waits and retries.
//   C45091 — Print must be disabled until the line data has loaded. The line request is held open
//            with a route intercept so the loading state actually lasts long enough to read.
//   C45090 — a user whose role cannot view work orders must not reach the page at all. The role is
//            seeded with PUT /api/roles/{id} (proven on this branch) and RESTORED afterwards.
// Only the Technician role is touched; the admin staff's Admin role is never involved.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/execution-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/02-rest.json`, JSON.stringify(R,null,1));
const TECH_ROLE='2d4b8464-81a9-4c1e-96c6-a2a64f02a389';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const mkCall=(page,APIH)=>(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:t.slice(0,300)};},{api:APIH,m,p,b:b||null});
const TOOLBAR = `(isVis, t) => {
  const linesTable=document.querySelector('[data-test-id=table_work_order_lines]');
  return [...document.querySelectorAll('button,[role=button]')].filter(isVis)
    .filter(b=>/more_vert|more_horiz/.test(t(b)) || /more/i.test(b.getAttribute('data-test-id')||''))
    .filter(b=>{ if (linesTable && linesTable.contains(b)) return false;
      const id=b.getAttribute('data-test-id')||'';
      return !/_line_|_[0-9a-f]{8}-[0-9a-f]{4}-/.test(id); })[0] || null;
}`;
const readMenu = (page)=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const menu=[...document.querySelectorAll('.q-menu')].filter(isVis).pop();
  if(!menu) return {menuOpen:false};
  return {menuOpen:true, items:[...menu.querySelectorAll('.q-item,[role=menuitem]')].filter(isVis).map(e=>{
    const cs=getComputedStyle(e);
    return {label:t(e), testid:e.getAttribute('data-test-id'), opacity:cs.opacity,
      pointerEvents:cs.pointerEvents,
      disabled: e.classList.contains('disabled')||e.getAttribute('aria-disabled')==='true'
        ||e.classList.contains('q-item--disabled')||cs.pointerEvents==='none'||parseFloat(cs.opacity)<0.6};})};}, VIS);
const openToolbarMenu = (page)=>page.evaluate(({vis,fn})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=eval(`(${fn})`)(isVis,t);
  if(!b) return {opened:false};
  b.scrollIntoView({block:'center'}); b.click(); return {opened:true, testid:b.getAttribute('data-test-id')};},
  {vis:VIS, fn:TOOLBAR});

// ================= C45088 — retry the status whose menu never opened =================
{
  const s = await boot('sv9315','/workorders','admin');
  const {page, APP, APIH} = s; const call=mkCall(page,APIH);
  const wos = rowsOf((await call('GET','/api/work-orders?limit=200')).json);
  const w = wos.find(x=>String(x.status||'').toLowerCase()==='ready_for_review');
  R.C45088_retry={workOrder:w&&{id:w.id, number:w.number}};
  if (w){
    for (let attempt=1; attempt<=3; attempt++){
      await page.goto(`${APP}/workorders/${w.id}`,{waitUntil:'domcontentloaded',timeout:60000});
      await page.waitForTimeout(14000);
      const o = await openToolbarMenu(page);
      await page.waitForTimeout(3500);
      const m = await readMenu(page);
      R.C45088_retry[`attempt${attempt}`]={open:o, menu:m};
      log('ready_for_review attempt %d: opened=%s menuOpen=%s items=%s', attempt, o.opened, m.menuOpen,
        JSON.stringify((m.items||[]).map(i=>i.label)));
      save();
      if (m.menuOpen){ R.C45088_retry.printPresent = m.items.some(i=>/print work order/i.test(i.label));
        R.C45088_retry.items=m.items.map(i=>i.label); break; }
    }
    await page.screenshot({path:`${DIR}/evidence/02-1-ready-for-review.png`, fullPage:true});
  }
  await s.browser.close();
}
save();

// ================= C45091 — hold the line request open so "loading" really lasts =================
{
  const s = await boot('sv9315','/workorders','admin');
  const {page, APP, APIH} = s; const call=mkCall(page,APIH);
  const wos = rowsOf((await call('GET','/api/work-orders?limit=200')).json);
  const w = wos.find(x=>String(x.status||'').toLowerCase()==='approved');
  let release=null; const held=new Promise(r=>{release=r;});
  let intercepted=0;
  await page.route('**/work-orders/lines/**', async route=>{ intercepted++; await held; await route.continue(); });
  await page.goto(`${APP}/workorders/${w.id}`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);                        // page up, line data still held
  const o1 = await openToolbarMenu(page);
  await page.waitForTimeout(3000);
  const whileLoading = await readMenu(page);
  await page.screenshot({path:`${DIR}/evidence/02-2-while-loading.png`, fullPage:true});
  const pick=(m)=>{const it=(m.items||[]).find(i=>/print work order/i.test(i.label));
    return it? {found:true, disabled:it.disabled, opacity:it.opacity, pointerEvents:it.pointerEvents}:{found:false};};
  R.C45091 = {linesRequestsHeld:intercepted, whileLoading:{open:o1, menuOpen:whileLoading.menuOpen,
    items:(whileLoading.items||[]).map(i=>i.label), print:pick(whileLoading)}};
  log('while the line data is held (%d request(s)): %s', intercepted, JSON.stringify(R.C45091.whileLoading));
  save();
  release();                                              // let the data arrive
  await page.waitForTimeout(12000);
  await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].pop(); if(m) document.body.click();});
  await page.waitForTimeout(1500);
  const o2 = await openToolbarMenu(page);
  await page.waitForTimeout(3000);
  const afterLoad = await readMenu(page);
  await page.screenshot({path:`${DIR}/evidence/02-3-after-load.png`, fullPage:true});
  R.C45091.afterLoad = {open:o2, menuOpen:afterLoad.menuOpen, print:pick(afterLoad)};
  log('after the data arrives: %s', JSON.stringify(R.C45091.afterLoad));
  save();
  await s.browser.close();
}

// ================= C45090 — a role that cannot view work orders =================
let ORIGINAL=null;
{
  const s = await boot('sv9315','/workorders','admin'); const call=mkCall(s.page,s.APIH);
  const g = await call('GET', `/api/roles/${TECH_ROLE}`);
  ORIGINAL = (g.json && (g.json.data||g.json)) || {};
  R.roleOriginal = {view_mode:ORIGINAL.view_mode, perms:(ORIGINAL.fe_permissions||[]).map(p=>p.code||p.id)};
  log('Technician permissions: %s', JSON.stringify(R.roleOriginal.perms));
  await s.browser.close();
}
const permObjs = ORIGINAL.fe_permissions||[];
const setRole = async (perms, viewMode)=>{
  const s = await boot('sv9315','/workorders','admin'); const call=mkCall(s.page,s.APIH);
  const body={...ORIGINAL, fe_permissions:perms.map(p=>p.id||p), view_mode:viewMode||ORIGINAL.view_mode};
  delete body.perms;
  const r = await call('PUT', `/api/roles/${TECH_ROLE}`, body);
  const g = await call('GET', `/api/roles/${TECH_ROLE}`);
  const now=(g.json&&(g.json.data||g.json))||{};
  await s.browser.close();
  return {http:r.status, perms:(now.fe_permissions||[]).map(p=>p.code), view_mode:now.view_mode};
};
{
  const without = permObjs.filter(p=>!/workOrdersView/i.test(String(p.code||'')));
  R.roleWithoutView = await setRole(without);
  log('role without workOrdersView: %s', JSON.stringify(R.roleWithoutView));
  save();
  const s = await boot('sv9315','/workorders','tech');
  const {page, APP, APIH} = s; const call=mkCall(page,APIH);
  const wos = rowsOf((await call('GET','/api/work-orders?limit=50')).json);
  R.C45090 = {techSeesWorkOrders: wos.length,
    identity: await page.evaluate(()=>{try{const r=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'{}');const d=r.data??r;
      return {view_mode:d.view_mode, perms:(d.fe_permissions||[]).map(x=>x.code||x)};}catch(e){return{err:String(e)}}})};
  const target = R.C45088_retry.workOrder || {id:(wos[0]||{}).id};
  if (target.id){
    await page.goto(`${APP}/workorders/${target.id}`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(11000);
    R.C45090.detailPage = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const body=(document.body.innerText||'');
      return {url:location.pathname, reachedDetail:/\/workorders\/[0-9a-f-]{36}/.test(location.pathname),
        deniedText:/permission|not authorized|unauthorized|access denied|forbidden|cannot/i.test(body),
        firstText:body.slice(0,200)};}, VIS);
    const o = await openToolbarMenu(page);
    await page.waitForTimeout(3000);
    const m = await readMenu(page);
    R.C45090.menu = {open:o, menuOpen:m.menuOpen, items:(m.items||[]).map(i=>i.label),
      printReachable: m.menuOpen && m.items.some(i=>/print work order/i.test(i.label))};
    await page.screenshot({path:`${DIR}/evidence/02-4-no-view-permission.png`, fullPage:true});
  }
  log('C45090: %s', JSON.stringify(R.C45090));
  await s.browser.close();
  save();
}
// restore the role, and verify the restore
R.roleRestored = await setRole(permObjs, ORIGINAL.view_mode);
R.roleRestoredOk = R.roleRestored.perms.length === permObjs.length
  && R.roleRestored.view_mode === ORIGINAL.view_mode;
log('role restored: %s (ok=%s)', JSON.stringify(R.roleRestored), R.roleRestoredOk);
if (!R.roleRestoredOk) log('!!! THE TECHNICIAN ROLE WAS NOT RESTORED — FIX THIS BEFORE ANYTHING ELSE');
save();
log('done');
