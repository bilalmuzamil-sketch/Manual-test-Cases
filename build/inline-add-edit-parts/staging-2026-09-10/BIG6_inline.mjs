// The Inline cases still open after BIG2, re-observed on STAGING.
//   C44993/C44994  Declined / Paid / Invoiced job: Add Part and the Edit control must be hidden
//   C45060         a catalog part with no cost or sell must open those boxes EMPTY
//   C45070         closing a changed EDIT row (not an add row) must ask before discarding
//   C45035         the job goes non-editable under an open EDIT row: the save must fail with the alert
//   C45022/C45062  any other save failure keeps the row open with the data in it
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG6.json`, JSON.stringify(R,null,1));
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:'/workorders'});
const {page} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,220)};},{api:API_HOST,m,p,b:b||null});
const setVal=(tid,val)=>page.evaluate(({tid,val})=>{const i=document.querySelector(`[data-test-id="${tid}"]`);
  if(!i) return false; i.focus();
  const proto=i.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;
  const S=Object.getOwnPropertyDescriptor(proto,'value').set; S.call(i,val);
  i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
  return true;},{tid,val});
const openLines=async(id)=>{ await page.goto(`${APP}/workorders/${id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
  await page.evaluate(()=>{for(const b of document.querySelectorAll('[data-test-id^=button_line_expand_]'))
    if(/expand_more/.test(b.textContent||'')) b.click();});
  await page.waitForTimeout(3500); };
const controls=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
  const ed=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
  const partRows=[...document.querySelectorAll('[data-test-id^=row_part_],[data-test-id^=part_row_]')];
  return {addPart:add.length, addVisible:add.filter(isVis).length,
    edit:ed.length, editVisible:ed.filter(isVis).length, partRows:partRows.length};}, VIS);
const screenMsgs=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const body=document.body.innerText||'';
  return {toasts:[...document.querySelectorAll('.q-notification,[role=alert],.q-banner')].filter(isVis).map(t),
    fieldMsgs:[...document.querySelectorAll('.q-field__messages,.q-field--error')].filter(isVis).map(t).filter(Boolean),
    dialog:(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); return d?t(d).slice(0,240):null;})(),
    noLongerEdited:/no longer be edited/i.test(body), refresh:/refresh to see the latest/i.test(body),
    couldntAdd:/couldn.t add the part/i.test(body)};}, VIS);
const openEditRow = async ()=> page.evaluate(vis=>{const isVis=eval(vis);
  const ed=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
  if(!ed.length) return {opened:false, found:0};
  const b=ed[0]; b.scrollIntoView({block:'center'});
  b.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
  b.click(); return {opened:true, found:ed.length, tid:b.getAttribute('data-test-id')};}, VIS);
const rowState = ()=> page.evaluate(vis=>{const isVis=eval(vis);
  const g=t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return e&&isVis(e)?e.value:null;};
  return {desc:g('input_inline_part_description'), qty:g('input_inline_part_quantity'),
    cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price')};}, VIS);

const wos = rowsOf((await call('GET','/api/work-orders?limit=200')).json);
const editable = wos.find(w=>['approved','estimate'].includes(String(w.status||'').toLowerCase()));
R.editable = editable && {id:editable.id, number:editable.number, status:editable.status};
log('editable job: %s', JSON.stringify(R.editable));

// ============ positive control: the controls ARE found on an editable job ============
await openLines(editable.id);
R.control_editable = await controls();
log('CONTROL editable -> %s', JSON.stringify(R.control_editable));
save();

// ============ C44993 / C44994 — the non-editable statuses ============
R.byStatus={};
for (const st of ['declined','paid','invoiced','ready_for_review']){
  const r = await call('POST','/api/work-orders/change-status',{id:editable.id, work_order:editable.id, status:st});
  const back = rowsOf((await call('GET','/api/work-orders?limit=200')).json).find(w=>w.id===editable.id)||{};
  if (String(back.status||'').toLowerCase()!==st){ R.byStatus[st]={setHttp:r.status, actual:back.status, skipped:true}; continue; }
  await openLines(editable.id);
  R.byStatus[st]={setHttp:r.status, actual:back.status, ...(await controls())};
  await page.screenshot({path:`${DIR}/evidence/BIG6-${st}.png`, fullPage:true}).catch(()=>{});
  log('%s -> %s', st, JSON.stringify(R.byStatus[st]));
  save();
}
await call('POST','/api/work-orders/change-status',{id:editable.id, work_order:editable.id, status:'approved'});
await page.waitForTimeout(2000);

// ============ C45060 — a catalog part with no cost or sell opens the boxes empty ============
R.C45060={};
await openLines(editable.id);
const opened = await page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
  if(!b) return false; b.scrollIntoView({block:'center'}); b.click(); return true;}, VIS);
R.C45060.addRowOpened = opened;
if (opened){
  await page.waitForTimeout(4000);
  R.C45060.emptyOnOpen = await rowState();
  // find a catalog part whose cost and sell are absent / zero, then pick it in the description box
  const cat = rowsOf((await call('GET','/api/parts?limit=200')).json);
  const noPrice = cat.filter(p=>!Number(p.cost) && !Number(p.sell_price||p.sell)).slice(0,5);
  R.C45060.catalog = {total:cat.length, withoutPrice:noPrice.length,
    sample:noPrice.map(p=>({n:p.part_number||p.number, d:(p.description||'').slice(0,30), c:p.cost, s:p.sell_price}))};
  const pick = noPrice[0];
  if (pick){
    await setVal('input_inline_part_description', String(pick.part_number||pick.description||'').slice(0,20));
    await page.waitForTimeout(3500);
    R.C45060.suggestions = await page.evaluate(vis=>{const isVis=eval(vis);
      const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)
        .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());
      if(o.length){ const el=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)[0]; el.click(); }
      return o.slice(0,6);}, VIS);
    await page.waitForTimeout(3000);
    R.C45060.afterPick = await rowState();
  }
  await page.screenshot({path:`${DIR}/evidence/BIG6-c45060.png`, fullPage:true}).catch(()=>{});
  log('C45060 -> open %s | after picking a part with no price %s',
    JSON.stringify(R.C45060.emptyOnOpen), JSON.stringify(R.C45060.afterPick));
}
save();

// ============ C45070 — closing a changed EDIT row asks before discarding ============
R.C45070={};
await openLines(editable.id);
R.C45070.open = await openEditRow();
if (R.C45070.open.opened){
  await page.waitForTimeout(3500);
  R.C45070.before = await rowState();
  await setVal('input_inline_part_cost','33.33');
  await page.waitForTimeout(1500);
  const closed = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
    const b=document.querySelector('[data-test-id=button_cancel_inline_part]')
      || [...document.querySelectorAll('button')].filter(isVis).find(e=>/^(cancel|close|×)$/i.test(t(e)));
    if(!b) return false; b.click(); return true;}, VIS);
  R.C45070.closeClicked = closed;
  await page.waitForTimeout(3500);
  R.C45070.msgs = await screenMsgs();
  await page.screenshot({path:`${DIR}/evidence/BIG6-c45070-edit.png`, fullPage:true}).catch(()=>{});
  log('C45070 EDIT row -> %s', JSON.stringify(R.C45070.msgs.dialog));
  await page.keyboard.press('Escape').catch(()=>{});
}
save();

// ============ C45022 / C45062 — any other save failure keeps the row open ============
R.C45022={};
await openLines(editable.id);
const op2 = await page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
  if(!b) return false; b.scrollIntoView({block:'center'}); b.click(); return true;}, VIS);
R.C45022.addRowOpened = op2;
if (op2){
  await page.waitForTimeout(4000);
  await setVal('input_inline_part_description','ZZAUTOTEST failure path');
  await setVal('input_inline_part_quantity','3');
  await setVal('input_inline_part_cost','11.50');
  await setVal('input_inline_part_sell_price','22.75');
  await page.waitForTimeout(1500);
  R.C45022.typed = await rowState();
  // make the save request fail the way a dropped connection would
  let blocked=0;
  await page.route('**/api/work-orders/part/**', route=>{ blocked++; route.abort('failed'); });
  await page.route('**/api/work-orders/parts/**', route=>{ blocked++; route.abort('failed'); });
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]'); if(b) b.click();});
  await page.waitForTimeout(7000);
  R.C45022.requestsBlocked = blocked;
  R.C45022.msgs = await screenMsgs();
  R.C45022.rowAfter = await rowState();
  await page.screenshot({path:`${DIR}/evidence/BIG6-c45022.png`, fullPage:true}).catch(()=>{});
  await page.unroute('**/api/work-orders/part/**').catch(()=>{});
  await page.unroute('**/api/work-orders/parts/**').catch(()=>{});
  log('C45022 -> blocked %d | toast %s | row kept %s', blocked,
    JSON.stringify(R.C45022.msgs.toasts), JSON.stringify(R.C45022.rowAfter));
}
save();

// ============ C45035 — the job goes non-editable under an open EDIT row ============
R.C45035={};
await openLines(editable.id);
R.C45035.open = await openEditRow();
if (R.C45035.open.opened){
  await page.waitForTimeout(3500);
  await setVal('input_inline_part_cost','44.44');
  await page.waitForTimeout(1500);
  R.C45035.typed = await rowState();
  R.C45035.flip = await call('POST','/api/work-orders/change-status',{id:editable.id, work_order:editable.id, status:'declined'});
  const back = rowsOf((await call('GET','/api/work-orders?limit=200')).json).find(w=>w.id===editable.id)||{};
  R.C45035.nowIs = back.status;
  if (String(back.status||'').toLowerCase()==='declined'){
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]'); if(b) b.click();});
    await page.waitForTimeout(7000);
    R.C45035.msgs = await screenMsgs();
    R.C45035.rowAfter = await rowState();
    await page.screenshot({path:`${DIR}/evidence/BIG6-c45035.png`, fullPage:true}).catch(()=>{});
    log('C45035 -> alert %s | refresh %s | toasts %s', R.C45035.msgs.noLongerEdited,
      R.C45035.msgs.refresh, JSON.stringify(R.C45035.msgs.toasts));
  }
  R.C45035.restore = await call('POST','/api/work-orders/change-status',{id:editable.id, work_order:editable.id, status:'approved'});
  const b2 = rowsOf((await call('GET','/api/work-orders?limit=200')).json).find(w=>w.id===editable.id)||{};
  R.C45035.restoredTo = b2.status;
  log('restored to %s', R.C45035.restoredTo);
}
save();
log('done');
await s.browser.close();
process.exit(0);
