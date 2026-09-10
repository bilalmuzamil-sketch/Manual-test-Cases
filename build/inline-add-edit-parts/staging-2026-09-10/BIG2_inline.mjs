// The nine open Inline Add and Edit Parts cases, re-checked on STAGING (the code has changed since
// they were seen on the old branch, so every one is re-observed rather than carried over).
//   C44993/C44994  Declined job: Add Part and Edit must be hidden
//   C45061/C45035  the job goes non-editable under an open row: the save must fail with an alert
//   C45058         letters / a negative in Cost or Sell must be named by the message
//   C45060         a part with no cost or sell opens those boxes EMPTY
//   C45070         closing a changed edit row asks before discarding
//   C45022/C45062  any other save failure keeps the row open with the data in it
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle, afterAction } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG2.json`, JSON.stringify(R,null,1));
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:'/workorders'});
const {page, ctx} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,200)};},{api:API_HOST,m,p,b:b||null});
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
  return {addPart:add.length, addVisible:add.filter(isVis).length,
    edit:ed.length, editVisible:ed.filter(isVis).length};}, VIS);
const screenMsgs=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const body=document.body.innerText||'';
  return {toasts:[...document.querySelectorAll('.q-notification,[role=alert],.q-banner')].filter(isVis).map(t),
    fieldMsgs:[...document.querySelectorAll('.q-field__messages,.q-field--error')].filter(isVis).map(t).filter(Boolean),
    dialog:(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); return d?t(d).slice(0,220):null;})(),
    noLongerEdited:/no longer be edited/i.test(body), refresh:/refresh to see the latest/i.test(body)};}, VIS);

const wos = rowsOf((await call('GET','/api/work-orders?limit=200')).json);
R.statuses = [...new Set(wos.map(w=>w.status))];
const byStatus = st => wos.find(w=>String(w.status||'').toLowerCase()===st);
const editable = wos.find(w=>['approved','estimate','in_progress','review'].includes(String(w.status||'').toLowerCase()));
R.picked = {editable: editable&&{id:editable.id, number:editable.number, status:editable.status}};
log('statuses on staging: %s', JSON.stringify(R.statuses));

// ================= C44993 / C44994 — a Declined job hides both controls =================
const declined = byStatus('declined');
R.declined = declined ? {id:declined.id, number:declined.number} : null;
if (declined){
  await openLines(declined.id);
  R.C44993_94 = await controls();
  await page.screenshot({path:`${DIR}/evidence/BIG2-declined.png`, fullPage:true});
  log('DECLINED job %s -> %s', declined.number, JSON.stringify(R.C44993_94));
} else log('no Declined job on staging to check');
// positive control: the same look-up on an editable job must FIND the controls
if (editable){
  await openLines(editable.id);
  R.controlEditable = await controls();
  log('CONTROL, editable job %s -> %s', editable.number, JSON.stringify(R.controlEditable));
}
save();

// ================= C45060 · C45058 · C45070 on an editable job =================
if (editable){
  await openLines(editable.id);
  const opened = await page.evaluate(vis=>{const isVis=eval(vis);
    const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
    if(!b) return false; b.scrollIntoView({block:'center'}); b.click(); return true;}, VIS);
  R.addRowOpened = opened;
  if (opened){
    await page.waitForTimeout(4000);
    // C45058 — letters in Cost and Sell
    await setVal('input_inline_part_description','ZZAUTOTEST validation check');
    await setVal('input_inline_part_quantity','1');
    await setVal('input_inline_part_cost','abc');
    await setVal('input_inline_part_sell_price','xyz');
    await page.waitForTimeout(1500);
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]'); if(b) b.click();});
    await page.waitForTimeout(4000);
    R.C45058 = await screenMsgs();
    await page.screenshot({path:`${DIR}/evidence/BIG2-c45058-letters.png`, fullPage:true});
    log('C45058 letters -> %s', JSON.stringify(R.C45058).slice(0,300));
    // and a NEGATIVE number
    await setVal('input_inline_part_cost','-5'); await setVal('input_inline_part_sell_price','-9');
    await page.waitForTimeout(1200);
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]'); if(b) b.click();});
    await page.waitForTimeout(4000);
    R.C45058_negative = await screenMsgs();
    log('C45058 negative -> %s', JSON.stringify(R.C45058_negative).slice(0,300));
    save();
    // C45070 — change something then close: a confirmation must appear
    await setVal('input_inline_part_cost','7'); await setVal('input_inline_part_sell_price','12');
    await page.waitForTimeout(1200);
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_cancel_inline_part]'); if(b) b.click();});
    await page.waitForTimeout(3500);
    R.C45070 = await screenMsgs();
    await page.screenshot({path:`${DIR}/evidence/BIG2-c45070-discard.png`, fullPage:true});
    log('C45070 discard prompt -> %s', JSON.stringify(R.C45070.dialog));
    save();
  }
}

// ================= C45061 — the job goes non-editable under an open ADD row =================
if (editable){
  await openLines(editable.id);
  const ok = await page.evaluate(vis=>{const isVis=eval(vis);
    const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
    if(!b) return false; b.scrollIntoView({block:'center'}); b.click(); return true;}, VIS);
  if (ok){
    await page.waitForTimeout(4000);
    await setVal('input_inline_part_description','ZZAUTOTEST race check');
    await setVal('input_inline_part_quantity','2');
    await setVal('input_inline_part_cost','10');
    await setVal('input_inline_part_sell_price','20');
    await page.waitForTimeout(1500);
    R.flip = await call('POST','/api/work-orders/change-status',{id:editable.id, status:'declined'});
    const back = rowsOf((await call('GET','/api/work-orders?limit=200')).json).find(w=>w.id===editable.id)||{};
    R.flipReadBack = back.status;
    log('job moved to: %s (%s)', R.flipReadBack, R.flip.status);
    if (String(R.flipReadBack).toLowerCase()==='declined'){
      await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]'); if(b) b.click();});
      await page.waitForTimeout(6000);
      R.C45061 = await screenMsgs();
      R.C45061.rowStillOpen = await page.evaluate(vis=>{const isVis=eval(vis);
        const d=document.querySelector('[data-test-id=input_inline_part_description]');
        return !!(d&&isVis(d)) ? d.value : false;}, VIS);
      await page.screenshot({path:`${DIR}/evidence/BIG2-c45061.png`, fullPage:true});
      log('C45061 -> alert shown: %s | refresh wording: %s | row still open with: %s',
        R.C45061.noLongerEdited, R.C45061.refresh, JSON.stringify(R.C45061.rowStillOpen));
    }
    // put the job back
    R.restore = await call('POST','/api/work-orders/change-status',{id:editable.id, status:'approved'});
    const back2 = rowsOf((await call('GET','/api/work-orders?limit=200')).json).find(w=>w.id===editable.id)||{};
    R.restoredTo = back2.status;
    log('job restored to: %s', R.restoredTo);
  }
}
save();
await s.browser.close();
log('done');
