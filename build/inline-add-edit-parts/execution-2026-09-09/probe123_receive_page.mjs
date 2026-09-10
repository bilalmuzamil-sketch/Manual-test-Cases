// Receive, on the page it actually opens.
// Pressing "Receive" NAVIGATES — it does not open a window:
//   /order/<orderId>?receive=1&returnTo=WorkOrder&returnId=<woId>&returnLineId=<lineId>
//     &workOrderId=<woId>&vendorIds=<vendorId>
// My earlier probe looked only for a dialog inside the work order page, described the page 5 seconds
// into that navigation before it had rendered, and reported "nothing appeared, the app is broken".
// It was neither broken nor silent — I was looking in the wrong place, too early.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/123-receive-page.json`, JSON.stringify(R,null,1));
const WO='a1098c78-f74b-4c5d-a194-0aed46e86660';
const LINE='868dd4b4-af46-43ed-a1bb-bf069cc31c49';
const ORDER='9d9dec3c-5a20-4120-9c45-c7998ee8b3f7';
const VENDOR='1e7bd0bf-e882-45fa-8c21-835e32ffa374';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315','/workorders','admin');
const {page, APP, APIH} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:t.slice(0,300)};},{api:APIH,m,p,b:b||null});
const state=async()=>{const l=rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).find(x=>x.line_id===LINE)||{};
  return {line:l.status, reqs:(l.part_requests||[]).map(r=>({status:r.status,qty:r.quantity})),
    parts:(l.parts||[]).map(p=>({pn:p.part_number,qty:p.quantity}))};};
const writes=[];
page.on('request', r=>{ if(r.method()!=='GET' && /\/api\//.test(r.url()) && !/sentry|envelope/.test(r.url()))
  writes.push({m:r.method(), u:r.url().replace(/^https?:\/\/[^/]+/,'').split('?')[0], body:(r.postData()||'').slice(0,400)}); });

R.before = await state();
log('before: %s', JSON.stringify(R.before));

const url = `${APP}/order/${ORDER}?receive=1&returnTo=WorkOrder&returnId=${WO}`
  + `&returnLineId=${LINE}&workOrderId=${WO}&vendorIds=${VENDOR}`;
await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(16000);                       // let the receive page actually render
await page.screenshot({path:`${DIR}/evidence/123-1-receive-page.png`, fullPage:true});
R.pageShape = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return {url:location.pathname,
    heading:t(document.querySelector('h1,h2,h3,.text-h5,.text-h6')||{}).slice(0,80),
    buttons:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,25),
    inputs:[...document.querySelectorAll('input,select')].filter(isVis).map(i=>{
      const f=i.closest('.q-field'); const l=f&&f.querySelector('.q-field__label');
      return {label:l?t(l):(i.getAttribute('data-test-id')||i.placeholder||''), value:i.value,
        testid:i.getAttribute('data-test-id'), type:i.type};}),
    tableHeaders:[...document.querySelectorAll('th')].filter(isVis).map(t).filter(Boolean).slice(0,14),
    rowCount:document.querySelectorAll('tbody tr').length,
    head:(document.body.innerText||'').slice(0,500)};}, VIS);
log('the receive page: heading=%j rows=%d', R.pageShape.heading, R.pageShape.rowCount);
log('  headers: %s', JSON.stringify(R.pageShape.tableHeaders));
log('  buttons: %s', JSON.stringify(R.pageShape.buttons));
log('  inputs: %s', JSON.stringify(R.pageShape.inputs).slice(0,600));
save();

// fill any quantity-to-receive box, tick any select-all, then press the receive action
R.filled = await page.evaluate(vis=>{const isVis=eval(vis); const out=[];
  const S=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  for (const i of [...document.querySelectorAll('input')].filter(isVis)){
    if (i.type==='checkbox'){ if(!i.checked){ i.click(); out.push('ticked a checkbox'); } continue; }
    const f=i.closest('.q-field'); const l=f&&f.querySelector('.q-field__label');
    const lab=((l?l.textContent:'')||i.getAttribute('data-test-id')||i.placeholder||'').trim();
    if (/receiv|qty|quantity/i.test(lab) && (!i.value || i.value==='0')){
      i.focus(); S.call(i,'5'); i.dispatchEvent(new Event('input',{bubbles:true}));
      i.dispatchEvent(new Event('change',{bubbles:true})); out.push(lab+' = 5'); }
  }
  // Quasar checkboxes are divs, not inputs
  for (const c of [...document.querySelectorAll('.q-checkbox')].filter(isVis)){
    if (c.getAttribute('aria-checked')==='false'){ c.click(); out.push('ticked a q-checkbox'); }
  }
  return out;}, VIS);
log('filled: %s', JSON.stringify(R.filled));
await page.waitForTimeout(3000);
await page.screenshot({path:`${DIR}/evidence/123-2-filled.png`, fullPage:true});

R.action = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button')].filter(isVis)
    .find(e=>/^(receive|receive all|receive items|receive parts|confirm|save|save & close|submit|done)$/i.test(t(e)));
  if(!b) return {clicked:false, seen:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,25)};
  b.scrollIntoView({block:'center'}); b.click(); return {clicked:true, label:t(b)};}, VIS);
log('receive action: %s', JSON.stringify(R.action).slice(0,300));
await page.waitForTimeout(12000);
// a confirm window may follow
R.confirm = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {none:true};
  const b=[...d.querySelectorAll('button')].filter(isVis)
    .find(e=>/^(receive|confirm|yes|ok|save|save & close|submit)$/i.test(t(e)));
  if(b){ b.scrollIntoView({block:'center'}); b.click(); return {confirmed:t(b), text:t(d).slice(0,200)}; }
  return {none:false, text:t(d).slice(0,200), seen:[...d.querySelectorAll('button')].filter(isVis).map(t)};}, VIS);
log('confirm: %s', JSON.stringify(R.confirm).slice(0,300));
await page.waitForTimeout(12000);
await page.screenshot({path:`${DIR}/evidence/123-3-after-receive.png`, fullPage:true});
R.writes = writes;
log('writes made: %s', JSON.stringify(writes.map(w=>`${w.m} ${w.u}`)));
R.after = await state();
log('AFTER: %s', JSON.stringify(R.after));
R.partLanded = (R.after.parts||[]).length > (R.before.parts||[]).length;
log('did the part land on the line? %s', R.partLanded);
save();
await s.browser.close();
log('done');
