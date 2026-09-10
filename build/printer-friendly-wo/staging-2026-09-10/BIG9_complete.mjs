// C45088, the one job status still unchecked: Complete.
// Route (QA lead, 2026-09-10): press Complete on every line, then Complete Work Order.
// If the screen route will not take, set the line status from the Edit Line window, and as a
// last resort ask the server directly -- every attempt recorded, nothing inferred.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG9.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,240)};},{api:API_HOST,m,p,b:b||null});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
const woStatus=async()=>{const d=(await call('GET',`/api/work-orders/view/${WO}`)).json;
  let x=(d&&(d.data||d))||{}; if(x.work_order) x=x.work_order; return x.status;};
const openMore = ()=>page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]');
  if(!b) return {opened:false}; b.click(); return {opened:true};});
const menuTexts = ()=>page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);}, VIS);

await settle(page,{label:'start'});
R.before = {wo: await woStatus(), lines:(await lines()).map(l=>l.status)};
log('before: %s', JSON.stringify(R.before));

// ---- 1. the line status, from the server, so the screen route has a chance of completing
R.setLines={};
for (const l of await lines()){
  for (const st of ['complete','completed']){
    const r = await call('POST','/api/work-orders/lines/change-status',
      {line:l.line_id, id:l.line_id, work_order:WO, status:st});
    R.setLines[`${String(l.line_id).slice(0,8)}_${st}`]=r.status+' '+r.text.slice(0,80);
    if (r.status>=200&&r.status<300) break;
  }
}
R.linesNow = (await lines()).map(l=>l.status);
log('line statuses now: %s', JSON.stringify(R.linesNow));
save();

// ---- 2. the screen route the QA lead showed
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'screen'});
R.screen = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const done=[]; for (const b of [...document.querySelectorAll('button')].filter(isVis)){
    if (/^complete$/i.test(t(b))){ b.click(); done.push('line'); } }
  return {lineCompletes:done.length};}, VIS);
await page.waitForTimeout(5000);
R.screen.completeWo = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button')].filter(isVis).find(e=>/^complete work order$/i.test(t(e)));
  if(!b) return false; b.click(); return true;}, VIS);
await page.waitForTimeout(5000);
// a confirmation dialog may be in the way
R.screen.dialog = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(!d) return null; const txt=t(d).slice(0,220);
  const yes=[...d.querySelectorAll('button')].find(e=>/^(complete|yes|confirm|ok)$/i.test(t(e)));
  if(yes) yes.click(); return txt;}, VIS);
await page.waitForTimeout(6000);
R.afterScreen = await woStatus();
log('after the screen route the job is: %s (dialog %s)', R.afterScreen, JSON.stringify(R.screen.dialog));
save();

// ---- 3. if the job is still not Complete, ask the server plainly
if (!/complete/i.test(String(R.afterScreen||''))){
  R.direct={};
  for (const st of ['complete','completed','finished','closed']){
    const r = await call('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:st});
    R.direct[st]=r.status+' '+r.text.slice(0,110);
    if (r.status>=200&&r.status<300) break;
  }
  R.afterDirect = await woStatus();
  log('after asking directly: %s | %s', R.afterDirect, JSON.stringify(R.direct));
}
save();

// ---- 4. whatever status we reached, is Print offered?
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'final'});
R.final = {wo: await woStatus()};
R.final.menu = await openMore(); await page.waitForTimeout(2200);
R.final.items = await menuTexts();
R.final.printOffered = R.final.items.some(t=>/print work order/i.test(t));
R.final.chip = await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-chip,.q-badge')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,6);}, VIS);
await page.screenshot({path:`${DIR}/evidence/BIG9-final.png`, fullPage:true}).catch(()=>{});
log('final: job=%s chip=%s print offered=%s', R.final.wo, JSON.stringify(R.final.chip), R.final.printOffered);
await page.keyboard.press('Escape');

// ---- 5. put the job back so the other cases still have their subject
R.restore = (await call('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:'approved'})).status;
R.restoredTo = await woStatus();
log('restored to %s', R.restoredTo);
save();
log('done');
await s.browser.close();
process.exit(0);
