// C45250 and C45251 on a purpose-built Complete line — the run that actually observes them.
//
// probe110 got a line to Complete (authorization_required -> authorized -> complete) but could not
// REPORT either case, and said so rather than guessing:
//   * it chose a "Total Parts: 0" canned line and never added a part, so C45251 had nothing to open
//   * its "which Add Part button belongs to my line" filter matched 4 of the 4 on the page, so the
//     button it clicked cannot be attributed to the line under test — and `partsAfter: []` proves
//     the part did not land there
// Both are fixed here: the line is found by its OWN DESCRIPTION TEXT and every query is scoped to
// that container, and a part is added and picked BEFORE the line is completed.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/111-c45250-c45251.json`, JSON.stringify(R,null,1));
const WO='6a529a5f-dff9-4c13-9636-b41500e585f0';
const TAG='ZZAUTOTEST C45251 field check';
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
const openAllLines = async ()=>{
  await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
};
// 🛑 SCOPE BY THE LINE'S OWN TEXT. Walking up the DOM and matching the line id against outerHTML
// matched every button on the page in probe110 — the id appears in a shared parent.
const inMyLine = (fnBody)=>page.evaluate(({vis,tag,fnBody})=>{
  const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const cands=[...document.querySelectorAll('.q-expansion-item')].filter(e=>t(e).includes(tag));
  // the SMALLEST container that still holds the tag — the line's own panel, not the whole list
  let scope=null, best=Infinity;
  for (const c of cands){ const n=c.querySelectorAll('*').length; if(n<best){best=n; scope=c;} }
  if(!scope) return {scopeFound:false, panels:cands.length};
  return {scopeFound:true, ...eval(`(${fnBody})`)(scope, isVis, t)};
}, {vis:VIS, tag:TAG, fnBody});

await page.waitForTimeout(9000);
const before = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).map(l=>l.line_id);

// ---- 1. create a zero-parts line and give it a description we can find it by
R.openForm = await clickText(/^\+?\s*new\s+line$/);
await page.waitForTimeout(6000);
R.canned = await (async ()=>{
  const opened = await page.evaluate(t=>{const i=document.querySelector(`[data-test-id="${t}"]`);
    if(!i) return false; i.scrollIntoView({block:'center'});
    (i.closest('.q-field')||i).dispatchEvent(new MouseEvent('click',{bubbles:true}));
    i.dispatchEvent(new MouseEvent('click',{bubbles:true})); i.focus(); return true;},'select_line_canned_line');
  if(!opened) return {opened:false};
  await page.waitForTimeout(3000);
  return await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const opts=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
    if(!opts.length) return {opened:true, chose:false};
    const zero=opts.find(o=>/total parts:\s*0\b/i.test(t(o))); const target=zero||opts[0];
    const label=t(target); target.click();
    return {opened:true, chose:true, zeroParts:!!zero, label:label.slice(0,80)};}, VIS);
})();
await page.waitForTimeout(2500);
await setVal('input_line_description', TAG);
await setVal('input_time_estimate','1'); await setVal('input_tech_time','1');
await page.waitForTimeout(2000);
R.saveLine = await clickText(/save\s*&\s*close/);
await page.waitForTimeout(9000);
const LINE = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json)
  .map(l=>l.line_id).find(x=>!before.includes(x)) || null;
R.line = LINE;
if(!LINE){ R.fatal='the New Line form did not produce a line'; save(); await s.browser.close(); process.exit(0); }
log('line %s created (%s)', LINE, R.canned.label);

// ---- 2. authorize it, so parts can be picked
R.authorize = await call('POST','/api/work-orders/lines/change-status',{line_id:LINE, status:'authorized', workOrderId:WO});
let l = await getLine(LINE);
log('authorize -> %s | line is %s', R.authorize.status, l.status);
save();

// ---- 3. add an INVENTORY part at quantity 5, through this line's own Add Part button
await openAllLines();
R.addPartClick = await inMyLine(`(scope, isVis) => {
  const btns=[...scope.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis);
  if(!btns.length) return {clicked:false, found:btns.length};
  btns[0].scrollIntoView({block:'center'}); btns[0].click(); return {clicked:true, found:btns.length};
}`);
log('Add Part on my line: %s', JSON.stringify(R.addPartClick));
await page.waitForTimeout(5000);
if (R.addPartClick.clicked){
  // type the part number into the part-number picker, then take the typeahead entry that names a
  // real stock quantity — a free-text description would create a special part instead
  await setVal('select_inline_part_number','F40010212');
  await page.waitForTimeout(6000);
  R.typeahead = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const opts=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
    const cards=opts.map(o=>t(o).slice(0,110));
    const stocked=opts.find(o=>/inventory qty/i.test(t(o)));
    if (stocked){ const label=t(stocked).slice(0,110); stocked.click(); return {chose:'stocked', label, cards}; }
    if (opts.length){ const label=t(opts[0]).slice(0,110); opts[0].click(); return {chose:'first', label, cards}; }
    return {chose:null, cards};}, VIS);
  log('typeahead: %s', JSON.stringify(R.typeahead).slice(0,400));
  await page.waitForTimeout(4000);
  await setVal('input_inline_part_quantity','5');
  await setVal('input_inline_part_cost','12');
  await setVal('input_inline_part_sell_price','24');
  await page.waitForTimeout(2000);
  await page.screenshot({path:`${DIR}/evidence/111-1-part-row.png`, fullPage:true});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]');
    if(b){b.scrollIntoView({block:'center'}); b.click();}});
  await page.waitForTimeout(8000);
}
l = await getLine(LINE);
R.afterAdd = {status:l.status, requests:(l.part_requests||[]).map(r=>({id:r.id,status:r.status,qty:r.quantity})),
  parts:(l.parts||[]).map(p=>({id:p.id,pn:p.part_number,qty:p.quantity}))};
log('after adding: %s', JSON.stringify(R.afterAdd)); save();
if (!R.afterAdd.requests.length && !R.afterAdd.parts.length){
  R.fatal='no part landed on the line, so neither case can be observed';
  log(R.fatal); save(); await s.browser.close(); process.exit(0);
}

// ---- 4. pick everything, then complete
R.picks={};
for (const r of (l.part_requests||[])){
  const x = await call('POST','/api/work-orders/part/perform-request-status-action',
    {part_request_id:r.id, action:'pick', workOrderId:WO});
  R.picks[r.id]={from:r.status, http:x.status, text:x.text.slice(0,200)};
}
l = await getLine(LINE);
R.afterPick={status:l.status, nRequests:(l.part_requests||[]).length,
  parts:(l.parts||[]).map(p=>({id:p.id,pn:p.part_number,qty:p.quantity}))};
log('after picking: %s', JSON.stringify(R.afterPick)); save();
R.complete = await call('POST','/api/work-orders/lines/change-status',{line_id:LINE, status:'complete', workOrderId:WO});
l = await getLine(LINE);
R.lineStatus = l.status;
log('complete -> %s %s | line is %s', R.complete.status, R.complete.text.slice(0,220), R.lineStatus);
save();
if (!String(R.lineStatus||'').toLowerCase().startsWith('complet')){
  R.note='the line did not reach Complete; NOTHING is reported as observed for C45250 or C45251';
  log(R.note); save(); await s.browser.close(); process.exit(0);
}

// ---- 5. C45251 — which fields does the completed line let you edit?
await openAllLines();
await page.screenshot({path:`${DIR}/evidence/111-2-complete-line.png`, fullPage:true});
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
    if(!b) return {open:false, note:'the edit control was clicked but no inline row opened'};
    for(let i=0;i<10&&b.parentElement;i++){b=b.parentElement; if(b.querySelectorAll('input').length>1) break;}
    return {open:true, editControlPresent:true,
      fields:[...b.querySelectorAll('input,select,textarea')].filter(isVis).map(i=>{
        const p2=i.closest('.q-field'); const lb=p2&&p2.querySelector('.q-field__label');
        return {label:lb?t(lb):(i.getAttribute('data-test-id')||''), value:i.value,
          editable: !(i.readOnly||i.disabled||i.getAttribute('aria-disabled')==='true'
                      ||(p2&&p2.classList.contains('q-field--disabled'))),
          x:Math.round(i.getBoundingClientRect().x)};}).sort((a,c)=>a.x-c.x)};}, VIS);
  await page.screenshot({path:`${DIR}/evidence/111-row-${String(p.pn||p.id).replace(/[^\w.-]/g,'_')}.png`, fullPage:true});
  log('C45251 %s -> %s', p.pn, JSON.stringify((R.C45251[p.pn||p.id].fields||[]).map(f=>`${f.label}:${f.editable?'EDIT':'ro'}`)));
  save();
  await page.evaluate(()=>{const c=document.querySelector('[data-test-id=button_cancel_inline_part]'); c&&c.click();});
  await page.waitForTimeout(3000);
}

// ---- 6. C45250 — Add Part on the completed line, scoped to THIS line
const C={};
C.buttons = await inMyLine(`(scope, isVis) => {
  const b=[...scope.querySelectorAll('[data-test-id=button_add_part]')];
  return {inThisLine:b.length, visible:b.filter(isVis).length};
}`);
log('C45250 Add Part in my line: %s', JSON.stringify(C.buttons));
if (C.buttons.visible){
  await inMyLine(`(scope, isVis) => {
    const b=[...scope.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
    if(b){ b.scrollIntoView({block:'center'}); b.click(); }
    return {clicked:!!b};
  }`);
  await page.waitForTimeout(6000);
  C.rowOpened = await page.evaluate(vis=>{const isVis=eval(vis);
    const d=document.querySelector('[data-test-id=input_inline_part_description]'); return !!(d&&isVis(d));}, VIS);
  if (C.rowOpened){
    await setVal('input_inline_part_description','ZZAUTOTEST C45250 second part');
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
    C.lineStatusAfter=l3.status;
    C.uncompletedItself=!String(l3.status||'').toLowerCase().startsWith('complet');
    C.partsAfter=(l3.parts||[]).map(x=>({pn:x.part_number,qty:x.quantity}));
    C.requestsAfter=(l3.part_requests||[]).map(x=>({status:x.status,qty:x.quantity}));
    // the save is only evidence if the part actually landed on THIS line
    C.partLandedHere = (C.partsAfter.length + C.requestsAfter.length) > (R.afterPick.parts||[]).length;
  }
  await page.screenshot({path:`${DIR}/evidence/111-3-c45250-after.png`, fullPage:true});
}
R.C45250=C;
log('C45250: %s', JSON.stringify(C));
save();
await s.browser.close();
log('done');
