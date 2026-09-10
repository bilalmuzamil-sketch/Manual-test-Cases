// Receive, with the invoice number filled in.
// The Purchase Order Details page pre-fills the quantity to receive (input_qty_<item> = 5) but the
// INVOICE NUMBER (input_invoice_<order>) is empty. My previous run filled nothing — its selector only
// looked for quantity-ish labels — clicked Receive, and nothing happened. That is the SECOND time I
// nearly wrote up "Receive does nothing" when the real answer was that I had not completed the form.
// Rule 104: prove the instrument worked. Here the proof is explicit — the fields are read back after
// filling, and any validation message the page shows is captured rather than ignored.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import { settle, afterAction } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/124-receive-invoice.json`, JSON.stringify(R,null,1));
const WO='a1098c78-f74b-4c5d-a194-0aed46e86660';
const LINE='868dd4b4-af46-43ed-a1bb-bf069cc31c49';
const ORDER='9d9dec3c-5a20-4120-9c45-c7998ee8b3f7';
const VENDOR='1e7bd0bf-e882-45fa-8c21-835e32ffa374';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315','/workorders','admin');
const {page, ctx, APP, APIH} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:t.slice(0,300)};},{api:APIH,m,p,b:b||null});
const state=async()=>{const l=rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).find(x=>x.line_id===LINE)||{};
  return {line:l.status, reqs:(l.part_requests||[]).map(r=>({status:r.status,qty:r.quantity})),
    parts:(l.parts||[]).map(p=>({pn:p.part_number,qty:p.quantity}))};};
const setVal=(tid,val)=>page.evaluate(({tid,val})=>{const i=document.querySelector(`[data-test-id="${tid}"]`);
  if(!i) return {found:false};
  i.focus(); const S=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  S.call(i,val); i.dispatchEvent(new Event('input',{bubbles:true}));
  i.dispatchEvent(new Event('change',{bubbles:true})); i.blur();
  return {found:true, now:i.value};},{tid,val});

R.before = await state();
log('before: %s', JSON.stringify(R.before)); save();

const url=`${APP}/order/${ORDER}?receive=1&returnTo=WorkOrder&returnId=${WO}`
  +`&returnLineId=${LINE}&workOrderId=${WO}&vendorIds=${VENDOR}`;
await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
R.settle = await settle(page,{label:'receive page'});
log('page settled: %s', JSON.stringify(R.settle));

// fill the invoice number (the one empty required-looking field) and confirm the quantity
R.invoice = await setVal(`input_invoice_${ORDER}`, 'ZZAUTOTEST-INV-45251');
R.qtyBefore = await page.evaluate(()=>{const i=[...document.querySelectorAll('[data-test-id^=input_qty_]')][0];
  return i? {tid:i.getAttribute('data-test-id'), value:i.value}:null;});
if (R.qtyBefore && (!R.qtyBefore.value || R.qtyBefore.value==='0'))
  R.qtySet = await setVal(R.qtyBefore.tid,'5');
await page.waitForTimeout(2500);
R.fieldsNow = await page.evaluate(()=>[...document.querySelectorAll('input')]
  .filter(i=>/input_(invoice|qty|sell)_/.test(i.getAttribute('data-test-id')||''))
  .map(i=>({tid:i.getAttribute('data-test-id'), value:i.value})));
log('fields now: %s', JSON.stringify(R.fieldsNow));
await page.screenshot({path:`${DIR}/evidence/124-1-filled.png`, fullPage:true});
save();

// click Receive, and record every possible effect rather than looking only for a dialog
R.receive = await afterAction(page, ctx, async ()=>
  page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const b=[...document.querySelectorAll('button')].filter(isVis).find(e=>/^receive$/i.test(t(e)));
    if(!b) return {clicked:false}; b.scrollIntoView({block:'center'}); b.click(); return {clicked:true};}, VIS),
  {label:'Receive'});
log('Receive -> %s', R.receive.summary);
log('  writes: %s', JSON.stringify(R.receive.writes));
save();

// a confirm window may follow
R.confirm = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {none:true};
  const b=[...d.querySelectorAll('button')].filter(isVis)
    .find(e=>/^(receive|confirm|yes|ok|save|submit|done)$/i.test(t(e)));
  if(b){b.scrollIntoView({block:'center'}); b.click(); return {confirmed:t(b), text:t(d).slice(0,240)};}
  return {none:false, text:t(d).slice(0,240), buttons:[...d.querySelectorAll('button')].filter(isVis).map(t)};}, VIS);
log('confirm: %s', JSON.stringify(R.confirm).slice(0,300));
await settle(page,{label:'after confirm'});
await page.screenshot({path:`${DIR}/evidence/124-2-after.png`, fullPage:true});

// capture any validation message the page is showing
R.messages = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return {toasts:[...document.querySelectorAll('.q-notification,[role=alert],.q-banner')].filter(isVis).map(t),
    fieldErrors:[...document.querySelectorAll('.q-field--error,.q-field__messages')].filter(isVis).map(t).filter(Boolean),
    url:location.pathname};}, VIS);
log('messages: %s', JSON.stringify(R.messages).slice(0,320));
R.after = await state();
log('AFTER: %s', JSON.stringify(R.after));
R.partLanded = (R.after.parts||[]).length > (R.before.parts||[]).length;
log('did the part land on the line? %s', R.partLanded);
save();
await s.browser.close();
log('done');
