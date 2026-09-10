// C45250 and C45251, on a line built clean for the purpose.
// probe108 read the New Line form off the screen rather than guessing at it:
//   "What are you doing?"   select_line_canned_line
//   "Why are you doing it?" input_line_description   (textarea)
//   "Labor rate"            select_labour_type
//   "Estimated time"        input_time_estimate      (0)
//   "Tech time"             input_tech_time          (0)
//   buttons: "Save & add part" · "Save & add line" · "Save & close"
// The confirm button is NOT called Save/Add/Create, which is why the guessed regex missed it.
//
// Shared state: this probe changes a LINE's status, never the work order's, so nothing outside the
// line is disturbed. The line it completes is one it created itself.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/109-c45250-c45251.json`, JSON.stringify(R,null,1));
const WO='6a529a5f-dff9-4c13-9636-b41500e585f0';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page, APP, APIH} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:t.slice(0,400)};},{api:APIH,m,p,b:b||null});
const posts=[];
page.on('request', r=>{ if(r.method()!=='GET' && /\/api\//.test(r.url()))
  posts.push({m:r.method(), u:r.url().replace(/^https?:\/\/[^/]+/,''), body:(r.postData()||'').slice(0,1200)}); });
const setVal = (tid,val)=>page.evaluate(({tid,val})=>{const i=document.querySelector(`[data-test-id="${tid}"]`);
  if(!i) return false; i.focus();
  const proto = i.tagName==='TEXTAREA'? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
  const S=Object.getOwnPropertyDescriptor(proto,'value').set; S.call(i,val);
  i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
  return true;},{tid,val});
const clickText = (re)=>page.evaluate(({vis,re})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const rx=new RegExp(re,'i');
  const b=[...document.querySelectorAll('button,[role=button]')].filter(isVis).find(e=>rx.test(t(e)));
  if(!b) return {clicked:false, seen:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,28)};
  b.scrollIntoView({block:'center'}); b.click(); return {clicked:true, label:t(b)};},{vis:VIS,re:re.source||re});

await page.waitForTimeout(9000);
const linesBefore = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).map(l=>l.line_id);
R.linesBefore = linesBefore.length;

// ---- create the line through the app's own form
R.openForm = await clickText(/^\+?\s*new\s+line$/);
await page.waitForTimeout(6000);
// "What are you doing?" and "Labor rate" are Quasar selects, not text boxes — setting .value on
// them does nothing, which is why the first run clicked "Save & close" and fired NO api call at
// all. They have to be opened and an option clicked.
const chooseFromSelect = async (tid, typed)=>{
  const opened = await page.evaluate(t=>{const i=document.querySelector(`[data-test-id="${t}"]`);
    if(!i) return false; i.scrollIntoView({block:'center'});
    (i.closest('.q-field')||i).dispatchEvent(new MouseEvent('click',{bubbles:true}));
    i.dispatchEvent(new MouseEvent('click',{bubbles:true})); i.focus(); return true;}, tid);
  if(!opened) return {opened:false};
  await page.waitForTimeout(2500);
  if (typed){ await setVal(tid, typed); await page.waitForTimeout(3500); }
  const res = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const opts=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
    if(!opts.length) return {chose:false, nOptions:0};
    const label=t(opts[0]); opts[0].click(); return {chose:true, nOptions:opts.length, label:label.slice(0,60)};}, VIS);
  await page.waitForTimeout(2500);
  return {opened:true, ...res};
};
R.selectCannedLine = await chooseFromSelect('select_line_canned_line', null);
R.selectLabourType = await chooseFromSelect('select_labour_type', null);
log('what are you doing? -> %s | labor rate -> %s',
  JSON.stringify(R.selectCannedLine), JSON.stringify(R.selectLabourType));
R.fill = {desc: await setVal('input_line_description','ZZAUTOTEST C45250/C45251 completed-line check'),
          est:  await setVal('input_time_estimate','1'),
          tech: await setVal('input_tech_time','1')};
await page.waitForTimeout(2000);
await page.screenshot({path:`${DIR}/evidence/109-1-newline-filled.png`, fullPage:true});
R.saveLine = await clickText(/save\s*&\s*close/);
await page.waitForTimeout(9000);
// if the form refused, say WHY rather than reporting a bare failure
R.saveRefusal = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return {errors:[...document.querySelectorAll('.q-field--error,.q-field__messages,.text-negative,[role=alert]')]
    .filter(isVis).map(t).filter(Boolean).slice(0,12),
    stillOpen: !!document.querySelector('[data-test-id=input_line_description]')};}, VIS);
log('after Save & close: %s', JSON.stringify(R.saveRefusal));
await page.screenshot({path:`${DIR}/evidence/109-2-line-saved.png`, fullPage:true});
R.lineCreateCalls = posts.filter(p=>/lines/i.test(p.u)).map(p=>({m:p.m,u:p.u,body:p.body}));
const linesAfter = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
const LINE = linesAfter.map(l=>l.line_id).find(x=>!linesBefore.includes(x)) || null;
R.line = LINE;
log('line created: %s (was %d lines, now %d)', LINE, linesBefore.length, linesAfter.length);
save();
if (!LINE){ R.fatal='the New Line form did not produce a new line'; save(); await s.browser.close(); process.exit(0); }

// ---- put ONE in-stock inventory part on it, quantity 5, through the inline row
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);
R.addPart = await page.evaluate(({vis,line})=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(x=>{let e=x;
    for(let i=0;i<16&&e;i++){ e=e.parentElement; if(e&&(e.outerHTML||'').includes(line)) return true;} return false;})
    .filter(isVis)[0];
  if(!b) return {found:false}; b.scrollIntoView({block:'center'}); b.click(); return {found:true};},{vis:VIS,line:LINE});
await page.waitForTimeout(5000);
if (R.addPart.found){
  await setVal('input_inline_part_description','F40010212');
  await page.waitForTimeout(5000);
  // choose the typeahead entry so a REAL inventory part goes on, not a free-text one
  R.picked = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const opts=[...document.querySelectorAll('.q-item,[role=option]')].filter(isVis)
      .filter(e=>/inventory qty/i.test(t(e)));
    if(!opts.length) return {found:false, seen:[...document.querySelectorAll('.q-item,[role=option]')].filter(isVis).map(t).slice(0,6)};
    opts[0].click(); return {found:true, card:t(opts[0]).slice(0,140)};}, VIS);
  await page.waitForTimeout(4000);
  await setVal('input_inline_part_quantity','5');
  await page.waitForTimeout(1500);
  await page.screenshot({path:`${DIR}/evidence/109-3-part-row.png`, fullPage:true});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]');
    if(b){b.scrollIntoView({block:'center'}); b.click();}});
  await page.waitForTimeout(8000);
}
let l = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).find(x=>x.line_id===LINE)||{};
R.afterAdd = {status:l.status, requests:(l.part_requests||[]).map(r=>({id:r.id,status:r.status,qty:r.quantity})),
  parts:(l.parts||[]).map(p=>({id:p.id,pn:p.part_number,qty:p.quantity}))};
log('after adding: %s', JSON.stringify(R.afterAdd)); save();

// ---- pick every request so the line has nothing unfulfilled
R.picks={};
for (const r of (l.part_requests||[])){
  const x = await call('POST','/api/work-orders/part/perform-request-status-action',
    {part_request_id:r.id, action:'pick', workOrderId:WO});
  R.picks[r.id]={from:r.status, status:x.status, text:x.text.slice(0,180)};
}
l = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).find(x=>x.line_id===LINE)||{};
R.afterPick = {status:l.status, nRequests:(l.part_requests||[]).length,
  parts:(l.parts||[]).map(p=>({id:p.id,pn:p.part_number,qty:p.quantity}))};
log('after picking: %s', JSON.stringify(R.afterPick)); save();

// ---- complete the line
R.complete = await call('POST','/api/work-orders/lines/change-status',{line_id:LINE, status:'complete', workOrderId:WO});
l = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).find(x=>x.line_id===LINE)||{};
R.lineStatus = l.status;
log('complete -> %s %s | line is %s', R.complete.status, R.complete.text.slice(0,200), R.lineStatus);
save();

if (!String(R.lineStatus||'').toLowerCase().startsWith('complet')){
  R.note='the line did not reach Complete; nothing is reported as observed for C45250 or C45251';
  log(R.note); save(); await s.browser.close(); process.exit(0);
}

// ---- C45251: which fields does a completed line let you edit?
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);
await page.screenshot({path:`${DIR}/evidence/109-4-complete-line.png`, fullPage:true});
R.C45251={};
for (const p of (R.afterPick.parts||[])){
  const tid=`button_edit_part_${p.id}`;
  const clicked = await page.evaluate(t=>{const b=document.querySelector(`[data-test-id="${t}"]`);
    if(!b) return false; b.scrollIntoView({block:'center'});
    const row=b.closest('tr')||b.parentElement; row&&row.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
    b.click(); return true;}, tid);
  if(!clicked){ R.C45251[p.pn]={editControlPresent:false}; continue; }
  await page.waitForTimeout(5000);
  R.C45251[p.pn] = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    let b=document.querySelector('[data-test-id=button_save_inline_part]');
    if(!b) return {open:false};
    for(let i=0;i<10&&b.parentElement;i++){b=b.parentElement; if(b.querySelectorAll('input').length>1) break;}
    return {open:true, editControlPresent:true,
      fields:[...b.querySelectorAll('input,select,textarea')].filter(isVis).map(i=>{
        const p2=i.closest('.q-field'); const l=p2&&p2.querySelector('.q-field__label');
        return {label:l?t(l):(i.getAttribute('data-test-id')||''), value:i.value,
          editable: !(i.readOnly||i.disabled||i.getAttribute('aria-disabled')==='true'
                      ||(p2&&p2.classList.contains('q-field--disabled'))),
          x:Math.round(i.getBoundingClientRect().x)};}).sort((a,c)=>a.x-c.x)};}, VIS);
  await page.screenshot({path:`${DIR}/evidence/109-row-${p.pn}.png`, fullPage:true});
  log('C45251 %s -> %s', p.pn, JSON.stringify((R.C45251[p.pn].fields||[]).map(f=>`${f.label}:${f.editable?'EDIT':'ro'}`)));
  save();
  await page.evaluate(()=>{const c=document.querySelector('[data-test-id=button_cancel_inline_part]'); c&&c.click();});
  await page.waitForTimeout(3000);
}

// ---- C45250: is "+ Add Part" still there on the completed line, and does using it uncomplete it?
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
  await page.screenshot({path:`${DIR}/evidence/109-5-c45250-after.png`, fullPage:true});
  const l3 = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).find(x=>x.line_id===LINE)||{};
  C.lineStatusAfter = l3.status;
  C.uncompletedItself = !String(l3.status||'').toLowerCase().startsWith('complet');
  C.partsAfter=(l3.parts||[]).map(x=>({pn:x.part_number,qty:x.quantity}));
  C.requestsAfter=(l3.part_requests||[]).map(x=>({status:x.status,qty:x.quantity}));
}
R.C45250=C;
log('C45250: %s', JSON.stringify(C));
save();
await s.browser.close();
log('done');
