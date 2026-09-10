// The job statuses, reached the way the QA lead showed on screen (2026-09-10):
//   In Progress -> press START on a line's Labor row
//   Complete    -> press COMPLETE on the line, then Complete Work Order
//   the rest    -> click the LINE, and pick from the Status list in the Edit Line window
// His screenshot also settles why my line-cancel attempts all failed: the Status list offers
// Authorization required · Declined · Authorized · Complete. There is NO "Cancelled".
// Also finishes: the edit-row discard wording, and whether the part from the declined-job race
// actually landed.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG4.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,200)};},{api:API_HOST,m,p,b:b||null});
const woStatus=async()=>{const w=rowsOf((await call('GET','/api/work-orders?limit=200')).json).find(x=>x.id===WO)||{};
  return w.status;};
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
const reload=async()=>{await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
  await page.evaluate(()=>{for(const b of document.querySelectorAll('[data-test-id^=button_line_expand_]'))
    if(/expand_more/.test(b.textContent||'')) b.click();});
  await page.waitForTimeout(3000);};
const clickText=(re)=>page.evaluate(({vis,re})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const rx=new RegExp(re,'i');
  const b=[...document.querySelectorAll('button,[role=button]')].filter(isVis).find(e=>rx.test(t(e)));
  if(!b) return {clicked:false, seen:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,18)};
  b.scrollIntoView({block:'center'}); b.click(); return {clicked:true, label:t(b)};},{vis:VIS,re:re.source||re});
const printAndCheck = async (tag)=>{
  await reload();
  await page.evaluate(()=>{window.__p=0; window.print=function(){window.__p++;};});
  const menu = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
    const b=[...document.querySelectorAll('button,[role=button]')].filter(isVis)
      .filter(x=>/more_vert|more_horiz/.test(t(x))||/more/i.test(x.getAttribute('data-test-id')||''))
      .filter(x=>!(tbl&&tbl.contains(x)) && !/_line_|_[0-9a-f]{8}-[0-9a-f]{4}-/.test(x.getAttribute('data-test-id')||''))[0];
    if(!b) return {opened:false}; b.click(); return {opened:true};}, VIS);
  await page.waitForTimeout(2800);
  const item = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const el=document.querySelector('[data-test-id=menu_item_print_work_order]');
    if(!el) return {present:false, items:[...document.querySelectorAll('.q-menu .q-item')].filter(isVis).map(t)};
    const cs=getComputedStyle(el);
    return {present:true, disabled: el.classList.contains('disabled')||el.getAttribute('aria-disabled')==='true'
      ||cs.pointerEvents==='none'||parseFloat(cs.opacity)<0.6, opacity:cs.opacity};}, VIS);
  await page.screenshot({path:`${DIR}/evidence/BIG4-${tag}.png`, fullPage:true});
  await page.keyboard.press('Escape').catch(()=>{});
  return item;
};

R.startStatus = await woStatus();
log('job starts as: %s', R.startStatus);

// ---- IN PROGRESS: press Start on a line
await reload();
R.startBtn = await clickText(/^start$/);
await page.waitForTimeout(5000);
R.afterStart = await woStatus();
log('pressed Start -> job is now: %s (%s)', R.afterStart, JSON.stringify(R.startBtn).slice(0,90));
if (String(R.afterStart).toLowerCase().includes('progress')){
  R.print_in_progress = await printAndCheck('in_progress');
  log('  In Progress -> Print option: %s', JSON.stringify(R.print_in_progress));
}
save();

// ---- stop the clock again so the line can be completed
await reload();
R.stopBtn = await clickText(/^stop$/);
await page.waitForTimeout(4000);
save();

// ---- COMPLETE: press Complete on each line, then Complete Work Order
await reload();
R.completeLines=[];
for (let i=0;i<4;i++){
  const c = await clickText(/^complete$/);
  if(!c.clicked) break;
  await page.waitForTimeout(3500);
  await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
    if(d){const b=[...d.querySelectorAll('button')].filter(isVis).find(x=>/^(complete|yes|confirm|ok)$/i.test(t(x)));
      if(b) b.click();}}, VIS);
  await page.waitForTimeout(3000);
  R.completeLines.push(c.label);
  await reload();
}
R.lineStatusesAfterComplete = (await lines()).map(l=>l.status);
log('completing lines: %s -> line statuses %s', JSON.stringify(R.completeLines), JSON.stringify(R.lineStatusesAfterComplete));
R.completeWo = await clickText(/^complete work order$/);
await page.waitForTimeout(4000);
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(d){const b=[...d.querySelectorAll('button')].filter(isVis).find(x=>/^(complete|yes|confirm|ok)$/i.test(t(x)));
    if(b) b.click();}}, VIS);
await page.waitForTimeout(5000);
R.afterCompleteWo = await woStatus();
log('Complete Work Order -> job is now: %s', R.afterCompleteWo);
if (String(R.afterCompleteWo).toLowerCase().startsWith('complet')){
  R.print_complete = await printAndCheck('complete');
  log('  Complete -> Print option: %s', JSON.stringify(R.print_complete));
}
save();

// ---- DECLINED, and the Edit Line status list, read off the screen
await reload();
const ln = await lines();
R.editLine = await page.evaluate(({vis,line})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const el=document.querySelector(`[data-test-id="line_number_${line}"]`)
        || document.querySelector(`[data-test-id="line_title"]`);
  if(!el) return {found:false};
  el.scrollIntoView({block:'center'}); el.click(); return {found:true};},{vis:VIS, line:(ln[0]||{}).line_id});
await page.waitForTimeout(3500);
R.editLineDialog = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(!d) return {open:false};
  return {open:true, heading:t(d.querySelector('.text-h6,h5,h6')||{}).slice(0,40),
    fields:[...d.querySelectorAll('input,select')].filter(isVis).map(i=>({
      label:(()=>{const f=i.closest('.q-field'); const l=f&&f.querySelector('.q-field__label'); return l?t(l):'';})(),
      value:i.value})),
    buttons:[...d.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean)};}, VIS);
log('Edit Line window: %s', JSON.stringify(R.editLineDialog).slice(0,300));
// open the Status list and read every option
R.statusOptions = await page.evaluate(async vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {found:false};
  const f=[...d.querySelectorAll('.q-field')].find(x=>/status/i.test(t(x)));
  if(!f) return {found:false, fields:[...d.querySelectorAll('.q-field')].map(t).slice(0,6)};
  f.scrollIntoView({block:'center'}); f.click();
  await new Promise(r=>setTimeout(r,2000));
  return {found:true, options:[...document.querySelectorAll('.q-menu .q-item,[role=option]')]
    .filter(isVis).map(t)};}, VIS);
log('the Status list offers: %s', JSON.stringify(R.statusOptions));
await page.screenshot({path:`${DIR}/evidence/BIG4-editline.png`, fullPage:true});
save();
await s.browser.close();
log('done');
