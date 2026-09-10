// C45088, the Complete status. Two things the last attempt got wrong, both now known:
//   the line status wants line_id (not line/id), and 'complete' is the accepted word;
//   the Complete Work Order dialog's button reads "Complete Without Receiving".
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG11.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,240)};},{api:API_HOST,m,p,b:b||null});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
const woStatus=async()=>{const d=(await call('GET',`/api/work-orders/view/${WO}`)).json;
  let x=(d&&(d.data||d))||{}; if(x.work_order) x=x.work_order; return x.status;};
const openMore=()=>page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]');
  if(!b) return {opened:false}; b.click(); return {opened:true};});
const menuTexts=()=>page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item')].filter(isVis)
    .map(e=>({t:(e.innerText||'').replace(/\s+/g,' ').trim(),
      dis:e.classList.contains('disabled')||getComputedStyle(e).pointerEvents==='none'}))
    .filter(x=>x.t);}, VIS);

await settle(page,{label:'start'});
R.before={wo:await woStatus(), lines:(await lines()).map(l=>l.status)};
log('before: %s', JSON.stringify(R.before));

// ---- 1. every line to Complete
R.setLines={};
for (const l of await lines()){
  const r = await call('POST','/api/work-orders/lines/change-status',{line_id:l.line_id, status:'complete'});
  R.setLines[String(l.line_id).slice(0,8)] = r.status+' '+r.text.slice(0,90);
}
R.linesNow = (await lines()).map(l=>l.status);
log('line statuses now: %s', JSON.stringify(R.linesNow));
save();

// ---- 2. Complete Work Order, and answer the dialog it raises
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'complete'});
R.clickedCwo = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button')].filter(isVis).find(e=>/^complete work order$/i.test(t(e)));
  if(!b) return false; b.click(); return true;}, VIS);
await page.waitForTimeout(5000);
R.dialog = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(!d) return {open:false};
  const btns=[...d.querySelectorAll('button')].filter(isVis).map(t);
  const go=[...d.querySelectorAll('button')].filter(isVis)
    .find(e=>/complete without receiving|^complete$|^confirm$|^yes$/i.test(t(e)));
  if(go) go.click();
  return {open:true, text:t(d).slice(0,240), buttons:btns, pressed:go?t(go):null};}, VIS);
await page.waitForTimeout(9000);
R.afterWo = await woStatus();
log('after Complete Work Order: %s | dialog %s', R.afterWo, JSON.stringify(R.dialog));
save();

// ---- 3. whatever status we are on, read the toolbar menu
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'final'});
R.final={wo:await woStatus()};
R.final.chip = await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-chip,.q-badge')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,6);}, VIS);
R.final.menu = await openMore(); await page.waitForTimeout(2200);
R.final.items = await menuTexts();
R.final.printOffered = R.final.items.some(i=>/print work order/i.test(i.t));
R.final.printDisabled = (R.final.items.find(i=>/print work order/i.test(i.t))||{}).dis;
await page.screenshot({path:`${DIR}/evidence/BIG11-complete.png`, fullPage:true}).catch(()=>{});
log('COMPLETE: job=%s chip=%s | print offered %s (greyed %s) | menu %s', R.final.wo,
  JSON.stringify(R.final.chip), R.final.printOffered, R.final.printDisabled,
  JSON.stringify(R.final.items.map(i=>i.t)));
await page.keyboard.press('Escape');
save();

// ---- 4. put the job back where the other cases expect it
R.reopen={};
for (const st of ['approved']){
  const r = await call('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:st});
  R.reopen[st]=r.status+' '+r.text.slice(0,90);
}
for (const l of await lines()){
  const r = await call('POST','/api/work-orders/lines/change-status',{line_id:l.line_id, status:'authorized'});
  R.reopen['line_'+String(l.line_id).slice(0,8)] = r.status;
}
R.restoredTo = {wo: await woStatus(), lines:(await lines()).map(l=>l.status)};
log('restored: %s', JSON.stringify(R.restoredTo));
save();
log('done');
await s.browser.close();
process.exit(0);
