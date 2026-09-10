// C45060  a catalog part with no cost and no sell price must open those boxes EMPTY
// C44993/C44994  the Complete status, now that a job can be completed
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG12.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,260)};},{api:API_HOST,m,p,b:b||null});
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
const rowState=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const g=t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return e&&isVis(e)?e.value:null;};
  return {desc:g('input_inline_part_description'), qty:g('input_inline_part_quantity'),
    cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price')};}, VIS);
const controls=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const add=[...document.querySelectorAll('[data-test-id=button_add_part]')];
  const ed=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
  return {addPart:add.length, addVisible:add.filter(isVis).length, edit:ed.length,
    editVisible:ed.filter(isVis).length};}, VIS);
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
const woStatus=async()=>{const d=(await call('GET',`/api/work-orders/view/${WO}`)).json;
  let x=(d&&(d.data||d))||{}; if(x.work_order) x=x.work_order; return x.status;};

await settle(page,{label:'start'});

// ================= C45060 — a part with no price on record =================
R.C45060={};
let parts = rowsOf((await call('GET','/api/inventory/parts?limit=200')).json);
R.C45060.scanned = parts.length;
R.C45060.sampleKeys = Object.keys(parts[0]||{}).slice(0,24);
const priceOf = p => [p.cost, p.sell_price, p.sell, p.price].map(v=>Number(v||0));
let zero = parts.find(p=>priceOf(p).every(v=>!v));
R.C45060.foundZeroAlready = zero && {pn:zero.part_number, d:(zero.description||'').slice(0,30)};
let restore=null;
if (!zero){
  // clear the price on one part, run the check, then put it back exactly as it was
  const victim = parts.find(p=>(p.part_number||'').length>3) || parts[0];
  restore = JSON.parse(JSON.stringify(victim));
  R.C45060.victim = {pn:victim.part_number, cost:victim.cost, sell:victim.sell_price};
  for (const body of [
    {...victim, cost:0, sell_price:0},
    {id:victim.id, part_id:victim.id, cost:0, sell_price:0},
  ]){
    const r = await call('POST','/api/inventory/parts/change', body);
    R.C45060[`clear_${Object.keys(body).length}`] = r.status+' '+r.text.slice(0,140);
    if (r.status>=200&&r.status<300) break;
  }
  parts = rowsOf((await call('GET','/api/inventory/parts?limit=200')).json);
  zero = parts.find(p=>String(p.id)===String(victim.id) && priceOf(p).every(v=>!v));
  R.C45060.clearedOk = !!zero;
}
if (zero){
  await openLines(WO);
  const op = await page.evaluate(vis=>{const isVis=eval(vis);
    const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
    if(!b) return false; b.scrollIntoView({block:'center'}); b.click(); return true;}, VIS);
  R.C45060.opened = op;
  if (op){
    await page.waitForTimeout(4000);
    R.C45060.onOpen = await rowState();
    await setVal('input_inline_part_description', String(zero.part_number||'').slice(0,14));
    await page.waitForTimeout(4500);
    R.C45060.options = await page.evaluate(vis=>{const isVis=eval(vis);
      const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
      const texts=o.map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());
      if(o.length) o[0].click(); return texts.slice(0,8);}, VIS);
    await page.waitForTimeout(3500);
    R.C45060.afterPick = await rowState();
    await page.screenshot({path:`${DIR}/evidence/BIG12-c45060.png`, fullPage:true}).catch(()=>{});
    log('C45060 -> part %s | options %s | boxes after picking %s', zero.part_number,
      JSON.stringify(R.C45060.options), JSON.stringify(R.C45060.afterPick));
    await page.keyboard.press('Escape');
  }
}
// put the part's price back
if (restore){
  const r = await call('POST','/api/inventory/parts/change', restore);
  R.C45060.restored = r.status;
  log('part price restored: %s', r.status);
}
save();

// ================= C44993 / C44994 — the Complete status =================
R.complete={};
for (const l of await lines()){
  const r = await call('POST','/api/work-orders/lines/change-status',{line_id:l.line_id, status:'complete'});
  R.complete['line_'+String(l.line_id).slice(0,8)] = r.status;
}
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'cwo'});
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button')].filter(isVis).find(e=>/^complete work order$/i.test(t(e)));
  if(b) b.click();}, VIS);
await page.waitForTimeout(5000);
R.complete.dialog = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return null;
  const go=[...d.querySelectorAll('button')].filter(isVis)
    .find(e=>/complete without receiving|^complete$|^confirm$|^yes$/i.test(t(e)));
  if(go){ go.click(); return t(go); } return t(d).slice(0,120);}, VIS);
await page.waitForTimeout(9000);
R.complete.woNow = await woStatus();
if (/complete/i.test(String(R.complete.woNow||''))){
  await openLines(WO);
  R.complete.controls = await controls();
  await page.screenshot({path:`${DIR}/evidence/BIG12-complete.png`, fullPage:true}).catch(()=>{});
}
log('COMPLETE job -> %s | Add Part and Edit controls: %s', R.complete.woNow, JSON.stringify(R.complete.controls||null));
save();

// ---- put the job back
R.restore = {wo:(await call('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:'approved'})).status};
for (const l of await lines()){
  await call('POST','/api/work-orders/lines/change-status',{line_id:l.line_id, status:'authorized'});
}
R.restoredTo = {wo:await woStatus(), lines:(await lines()).map(l=>l.status)};
log('restored: %s', JSON.stringify(R.restoredTo));
save();
log('done');
await s.browser.close();
process.exit(0);
