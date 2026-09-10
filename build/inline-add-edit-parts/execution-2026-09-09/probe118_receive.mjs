// What does "Receive" actually do? C45251 clause 2 needs a special-order part RECEIVED onto a line.
// probe117 got the request from `authorized_to_order` to `waiting_to_receive` by clicking "Order",
// then clicked "Receive" and nothing changed — and no dialog was detected, so the click either
// opened something my selector missed, navigated elsewhere, or needs a quantity entered first.
// This watches the click: URL before/after, every dialog/drawer/panel that appears, its inputs and
// buttons, and every non-GET request the page makes.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/118-receive.json`, JSON.stringify(R,null,1));
const WO='6a529a5f-dff9-4c13-9636-b41500e585f0';
const LINE='0e2c10ac-b34c-4195-91f6-d9d55c06f943';   // probe117's line, request waiting_to_receive
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page, APP, APIH} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:t.slice(0,300)};},{api:APIH,m,p,b:b||null});
const getLine=async(id)=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json).find(l=>l.line_id===id)||{};
const posts=[];
page.on('request', r=>{ if(r.method()!=='GET' && /\/api\//.test(r.url()))
  posts.push({m:r.method(), u:r.url().replace(/^https?:\/\/[^/]+/,''), body:(r.postData()||'').slice(0,700)}); });

await page.waitForTimeout(10000);
let l = await getLine(LINE);
R.lineAtStart={status:l.status, requests:(l.part_requests||[]).map(r=>({id:r.id,status:r.status,qty:r.quantity}))};
log('line at start: %s', JSON.stringify(R.lineAtStart));
await page.evaluate(id=>{const b=document.querySelector(`[data-test-id="button_line_expand_${id}"]`);
  if(b && /expand_more/.test(b.textContent||'')){ b.scrollIntoView({block:'center'}); b.click(); }}, LINE);
await page.waitForTimeout(5000);

R.urlBefore = page.url();
// find the Receive control inside this line's rows and describe it before clicking
R.receiveControl = await page.evaluate(({vis,line})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
  let current=null, scope=[];
  for (const r of [...tbl.querySelectorAll('tr')]){
    const m=[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))
      .find(x=>/^(badge_line_status_|button_line_expand_|line_number_)/.test(x));
    if (m) current=m.replace(/^(badge_line_status_|button_line_expand_|line_number_)/,'');
    if (current===line) scope.push(r);
  }
  const btns=scope.flatMap(r=>[...r.querySelectorAll('button,[role=button]')].filter(isVis));
  return {rowsInScope:scope.length,
    buttons:btns.map(b=>({label:t(b), testid:b.getAttribute('data-test-id')})).slice(0,20)};},
  {vis:VIS, line:LINE});
log('controls on this line: %s', JSON.stringify(R.receiveControl));
save();

R.click = await page.evaluate(({vis,line})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
  let current=null, scope=[];
  for (const r of [...tbl.querySelectorAll('tr')]){
    const m=[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))
      .find(x=>/^(badge_line_status_|button_line_expand_|line_number_)/.test(x));
    if (m) current=m.replace(/^(badge_line_status_|button_line_expand_|line_number_)/,'');
    if (current===line) scope.push(r);
  }
  for (const r of scope){
    const b=[...r.querySelectorAll('button,[role=button]')].filter(isVis).find(e=>/^receive$/i.test(t(e)));
    if(b){ b.scrollIntoView({block:'center'}); b.click(); return {clicked:true, testid:b.getAttribute('data-test-id')}; }
  }
  return {clicked:false};}, {vis:VIS, line:LINE});
log('Receive clicked: %s', JSON.stringify(R.click));
await page.waitForTimeout(9000);
await page.screenshot({path:`${DIR}/evidence/118-1-after-receive.png`, fullPage:true});
R.urlAfter = page.url();

// describe anything that appeared
R.appeared = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const panels=[...document.querySelectorAll('.q-dialog,.q-drawer,.q-menu,[role=dialog]')].filter(isVis);
  return {count:panels.length, panels:panels.map(p=>({
    cls:(p.className||'').toString().slice(0,60), text:t(p).slice(0,300),
    inputs:[...p.querySelectorAll('input,select,textarea')].filter(isVis).map(i=>{
      const f=i.closest('.q-field'); const lb=f&&f.querySelector('.q-field__label');
      return {label:lb?t(lb):(i.getAttribute('data-test-id')||i.placeholder||''), value:i.value,
        testid:i.getAttribute('data-test-id')};}),
    buttons:[...p.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,12)}))};}, VIS);
log('what appeared: %s', JSON.stringify(R.appeared).slice(0,900));
R.calls = posts.map(p=>`${p.m} ${p.u}`);
log('non-GET calls: %s', JSON.stringify(R.calls));
R.callBodies = posts.filter(p=>/receiv|part/i.test(p.u)).map(p=>({u:p.u, body:p.body}));
save();

l = await getLine(LINE);
R.lineAfter={status:l.status, requests:(l.part_requests||[]).map(r=>({id:r.id,status:r.status})),
  parts:(l.parts||[]).map(p=>p.part_number)};
log('line after: %s', JSON.stringify(R.lineAfter));
save();
await s.browser.close();
log('done');
