// C45250 and C45251 — reaching a genuinely Complete line, which is what parked both cases.
//
// What the previous probes established, each from the API's own refusal rather than a guess:
//   * the line is created from the app's New Line form; picking a CANNED LINE satisfies the
//     labor/price requirement in one step and brings its own parts with it ("Total Parts: N")
//   * a new line lands in status `authorization_required`
//   * picking a part request there fails: "This action can only be performed on the authorized lines."
//   * completing the line there fails: "Status transition from authorization_required to complete
//     is not allowed"
//   * a line refuses Complete while ANY request is unfulfilled, and `pick` is the only action the
//     part-request endpoint accepts
// So the order is: create -> AUTHORIZE the line -> pick every request -> complete.
// Every status name below is tried against the API and the refusal recorded, so the transition map
// is measured rather than assumed.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/110-completeline.json`, JSON.stringify(R,null,1));
const WO='6a529a5f-dff9-4c13-9636-b41500e585f0';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page, APP, APIH} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:t.slice(0,400)};},{api:APIH,m,p,b:b||null});
const getLine=async(id)=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).find(l=>l.line_id===id)||{};
const setVal = (tid,val)=>page.evaluate(({tid,val})=>{const i=document.querySelector(`[data-test-id="${tid}"]`);
  if(!i) return false; i.focus();
  const proto = i.tagName==='TEXTAREA'? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
  const S=Object.getOwnPropertyDescriptor(proto,'value').set; S.call(i,val);
  i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
  return true;},{tid,val});
const clickText = (re)=>page.evaluate(({vis,re})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const rx=new RegExp(re,'i');
  const b=[...document.querySelectorAll('button,[role=button]')].filter(isVis).find(e=>rx.test(t(e)));
  if(!b) return {clicked:false}; b.scrollIntoView({block:'center'}); b.click(); return {clicked:true, label:t(b)};},
  {vis:VIS, re:re.source||re});

await page.waitForTimeout(9000);
const before = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).map(l=>l.line_id);

// ---- create the line
R.openForm = await clickText(/^\+?\s*new\s+line$/);
await page.waitForTimeout(6000);
R.canned = await (async ()=>{
  const opened = await page.evaluate(t=>{const i=document.querySelector(`[data-test-id="${t}"]`);
    if(!i) return false; i.scrollIntoView({block:'center'});
    (i.closest('.q-field')||i).dispatchEvent(new MouseEvent('click',{bubbles:true}));
    i.dispatchEvent(new MouseEvent('click',{bubbles:true})); i.focus(); return true;},'select_line_canned_line');
  if(!opened) return {opened:false};
  await page.waitForTimeout(3000);
  // prefer a canned line that brings NO parts of its own — fewer requests to clear
  return await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const opts=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
    if(!opts.length) return {opened:true, chose:false};
    const zero=opts.find(o=>/total parts:\s*0\b/i.test(t(o)));
    const target=zero||opts[0]; const label=t(target); target.click();
    return {opened:true, chose:true, nOptions:opts.length, preferredZeroParts:!!zero, label:label.slice(0,80)};}, VIS);
})();
log('canned line: %s', JSON.stringify(R.canned));
await page.waitForTimeout(2500);
await setVal('input_line_description','ZZAUTOTEST C45250/C45251 completed-line check');
await setVal('input_time_estimate','1'); await setVal('input_tech_time','1');
await page.waitForTimeout(2000);
R.saveLine = await clickText(/save\s*&\s*close/);
await page.waitForTimeout(9000);
const LINE = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json)
  .map(l=>l.line_id).find(x=>!before.includes(x)) || null;
R.line = LINE;
if(!LINE){ R.fatal='the New Line form did not produce a line'; save(); await s.browser.close(); process.exit(0); }
let l = await getLine(LINE);
R.created = {status:l.status, requests:(l.part_requests||[]).map(r=>({id:r.id,status:r.status,qty:r.quantity}))};
log('line %s created in status %s with %d requests', LINE, l.status, (l.part_requests||[]).length);
save();

// ---- walk the line's status machine to something that permits picking
const LINE_STATUSES=['authorized','authorize','approved','approve','in_progress','started','start','pending'];
R.lineTransitions={};
for (const st of LINE_STATUSES){
  if (String(l.status||'').toLowerCase()==='authorized') break;
  const r = await call('POST','/api/work-orders/lines/change-status',{line_id:LINE, status:st, workOrderId:WO});
  l = await getLine(LINE);
  R.lineTransitions[st]={http:r.status, text:r.text.slice(0,200), lineIsNow:l.status};
  save();
  if (String(l.status||'').toLowerCase()==='authorized') { log('line authorized via "%s"', st); break; }
}
R.statusAfterAuthorise = l.status;
log('line status after the authorise walk: %s | %s', l.status,
  JSON.stringify(Object.fromEntries(Object.entries(R.lineTransitions).map(([k,v])=>[k,v.http+' -> '+v.lineIsNow]))));
save();

// ---- pick every request on the line
R.picks={};
for (const r of ((await getLine(LINE)).part_requests||[])){
  const x = await call('POST','/api/work-orders/part/perform-request-status-action',
    {part_request_id:r.id, action:'pick', workOrderId:WO});
  R.picks[r.id]={from:r.status, http:x.status, text:x.text.slice(0,200)};
  save();
}
// a pick can move a request to waiting_to_receive rather than clearing it — pick again if so
for (const r of ((await getLine(LINE)).part_requests||[])){
  if (R.picks[r.id] && R.picks[r.id].http>=200 && R.picks[r.id].http<300) continue;
  const x = await call('POST','/api/work-orders/part/perform-request-status-action',
    {part_request_id:r.id, action:'pick', workOrderId:WO});
  R.picks[r.id+'#2']={from:r.status, http:x.status, text:x.text.slice(0,200)};
}
l = await getLine(LINE);
R.afterPick = {status:l.status, requests:(l.part_requests||[]).map(r=>({id:r.id,status:r.status})),
  parts:(l.parts||[]).map(p=>({id:p.id,pn:p.part_number,qty:p.quantity}))};
log('after picking: %s', JSON.stringify(R.afterPick)); save();

// ---- complete the line
R.complete={};
for (const st of ['complete','completed']){
  const r = await call('POST','/api/work-orders/lines/change-status',{line_id:LINE, status:st, workOrderId:WO});
  l = await getLine(LINE);
  R.complete[st]={http:r.status, text:r.text.slice(0,240), lineIsNow:l.status};
  if (String(l.status||'').toLowerCase().startsWith('complet')) break;
}
R.lineStatus = l.status;
log('complete: %s | line is %s', JSON.stringify(R.complete), R.lineStatus);
save();
if (!String(R.lineStatus||'').toLowerCase().startsWith('complet')){
  R.note='the line did not reach Complete; NOTHING is reported as observed for C45250 or C45251';
  log(R.note); save(); await s.browser.close(); process.exit(0);
}

// ---- C45251: which fields does a completed line let you edit?
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);
await page.screenshot({path:`${DIR}/evidence/110-1-complete-line.png`, fullPage:true});
R.C45251={};
for (const p of (R.afterPick.parts||[])){
  const tid=`button_edit_part_${p.id}`;
  const clicked = await page.evaluate(t=>{const b=document.querySelector(`[data-test-id="${t}"]`);
    if(!b) return false; b.scrollIntoView({block:'center'});
    const row=b.closest('tr')||b.parentElement; row&&row.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
    b.click(); return true;}, tid);
  if(!clicked){ R.C45251[p.pn||p.id]={editControlPresent:false}; save(); continue; }
  await page.waitForTimeout(5000);
  R.C45251[p.pn||p.id] = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    let b=document.querySelector('[data-test-id=button_save_inline_part]');
    if(!b) return {open:false};
    for(let i=0;i<10&&b.parentElement;i++){b=b.parentElement; if(b.querySelectorAll('input').length>1) break;}
    return {open:true, editControlPresent:true,
      fields:[...b.querySelectorAll('input,select,textarea')].filter(isVis).map(i=>{
        const p2=i.closest('.q-field'); const lb=p2&&p2.querySelector('.q-field__label');
        return {label:lb?t(lb):(i.getAttribute('data-test-id')||''), value:i.value,
          editable: !(i.readOnly||i.disabled||i.getAttribute('aria-disabled')==='true'
                      ||(p2&&p2.classList.contains('q-field--disabled'))),
          x:Math.round(i.getBoundingClientRect().x)};}).sort((a,c)=>a.x-c.x)};}, VIS);
  await page.screenshot({path:`${DIR}/evidence/110-row-${(p.pn||p.id).replace(/[^\w.-]/g,'_')}.png`, fullPage:true});
  log('C45251 %s -> %s', p.pn, JSON.stringify((R.C45251[p.pn||p.id].fields||[]).map(f=>`${f.label}:${f.editable?'EDIT':'ro'}`)));
  save();
  await page.evaluate(()=>{const c=document.querySelector('[data-test-id=button_cancel_inline_part]'); c&&c.click();});
  await page.waitForTimeout(3000);
}

// ---- C45250: Add Part on the completed line, and does saving uncomplete it by itself?
const C={};
C.addPart = await page.evaluate(({vis,line})=>{const isVis=eval(vis);
  const all=[...document.querySelectorAll('[data-test-id=button_add_part]')];
  const mine=all.filter(x=>{let e=x; for(let i=0;i<16&&e;i++){e=e.parentElement; if(e&&(e.outerHTML||'').includes(line)) return true;} return false;});
  return {onPage:all.length, onThisLine:mine.length, onThisLineVisible:mine.filter(isVis).length};},{vis:VIS,line:LINE});
log('C45250 Add Part on the completed line: %s', JSON.stringify(C.addPart));
if (C.addPart.onThisLineVisible){
  await page.evaluate(({vis,line})=>{const isVis=eval(vis);
    const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(x=>{let e=x;
      for(let i=0;i<16&&e;i++){e=e.parentElement; if(e&&(e.outerHTML||'').includes(line)) return true;} return false;})
      .filter(isVis)[0];
    if(b){b.scrollIntoView({block:'center'}); b.click();}},{vis:VIS,line:LINE});
  await page.waitForTimeout(6000);
  C.rowOpened = await page.evaluate(vis=>{const isVis=eval(vis);
    const d=document.querySelector('[data-test-id=input_inline_part_description]'); return !!(d&&isVis(d));}, VIS);
  if (C.rowOpened){
    await setVal('input_inline_part_description','ZZAUTOTEST C45250 part on a complete line');
    await setVal('input_inline_part_quantity','1');
    await setVal('input_inline_part_cost','5');
    await setVal('input_inline_part_sell_price','9');
    await page.waitForTimeout(2000);
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]');
      if(b){b.scrollIntoView({block:'center'}); b.click();}});
    await page.waitForTimeout(8000);
    C.toasts = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      return [...document.querySelectorAll('.q-notification,.q-banner,[role=alert],.q-dialog')].filter(isVis).map(t).filter(Boolean);}, VIS);
    const l3 = await getLine(LINE);
    C.lineStatusAfter = l3.status;
    C.uncompletedItself = !String(l3.status||'').toLowerCase().startsWith('complet');
    C.partsAfter=(l3.parts||[]).map(x=>({pn:x.part_number,qty:x.quantity}));
    C.requestsAfter=(l3.part_requests||[]).map(x=>({status:x.status,qty:x.quantity}));
  }
  await page.screenshot({path:`${DIR}/evidence/110-2-c45250-after.png`, fullPage:true});
}
R.C45250=C;
log('C45250: %s', JSON.stringify(C));
save();
await s.browser.close();
log('done');
