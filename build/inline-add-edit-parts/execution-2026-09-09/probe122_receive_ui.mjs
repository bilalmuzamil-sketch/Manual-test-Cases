// Order then Receive, through the screen, on the QA lead's work order.
// Earlier I clicked Receive, waited 9 seconds, saw no dialog and called the product broken. Three
// things were wrong with that: the wait was short, I only looked for a dialog in THIS page, and I
// never checked whether the click navigates or opens a new tab. All three are covered here.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/122-receive-ui.json`, JSON.stringify(R,null,1));
const WO='a1098c78-f74b-4c5d-a194-0aed46e86660';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot('sv9315', `/workorders/${WO}/lines`, 'admin');
const {page, ctx, APP, APIH} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:t.slice(0,300)};},{api:APIH,m,p,b:b||null});
const state=async()=>{const l=(await (async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json))())[0]||{};
  return {line:l.status, reqs:(l.part_requests||[]).map(r=>({id:r.id,status:r.status,qty:r.quantity})),
    parts:(l.parts||[]).map(p=>({pn:p.part_number,qty:p.quantity}))};};
const clickByText = (re)=>page.evaluate(({vis,re})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const rx=new RegExp(re,'i');
  const b=[...document.querySelectorAll('button,[role=button],a')].filter(isVis).find(e=>rx.test(t(e)));
  if(!b) return {clicked:false, seen:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,25)};
  b.scrollIntoView({block:'center'}); b.click(); return {clicked:true, label:t(b), testid:b.getAttribute('data-test-id')};},
  {vis:VIS, re:re.source||re});
const describe = ()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const panels=[...document.querySelectorAll('.q-dialog,.q-drawer,[role=dialog],.q-menu')].filter(isVis);
  return {url:location.pathname+location.search, panels:panels.length,
    panelTexts:panels.map(p=>t(p).slice(0,300)),
    inputs:panels.flatMap(p=>[...p.querySelectorAll('input,select,textarea')].filter(isVis).map(i=>{
      const f=i.closest('.q-field'); const l=f&&f.querySelector('.q-field__label');
      return {label:l?t(l):(i.getAttribute('data-test-id')||i.placeholder||''), value:i.value,
        testid:i.getAttribute('data-test-id')};})),
    panelButtons:panels.flatMap(p=>[...p.querySelectorAll('button')].filter(isVis).map(t)).filter(Boolean).slice(0,15),
    pageButtons:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,30),
    head:(document.body.innerText||'').slice(0,260)};}, VIS);

await page.waitForTimeout(11000);
R.before = await state();
log('before: %s', JSON.stringify(R.before)); save();

// ---------- ORDER ----------
if ((R.before.reqs||[]).some(r=>/authorized_to_order/.test(r.status))){
  R.orderClick = await clickByText(/^order$/);
  log('Order clicked: %s', JSON.stringify(R.orderClick).slice(0,200));
  await page.waitForTimeout(10000);
  R.afterOrderScreen = await describe();
  // an Order click may open a confirm window
  if (R.afterOrderScreen.panels){
    const conf = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const p=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!p) return {none:true};
      const b=[...p.querySelectorAll('button')].filter(isVis).find(e=>/^(order|confirm|yes|save|save & close|ok|submit)$/i.test(t(e)));
      if(b){b.scrollIntoView({block:'center'}); b.click(); return {confirmed:t(b)};}
      return {none:false, seen:[...p.querySelectorAll('button')].filter(isVis).map(t)};}, VIS);
    R.orderConfirm = conf;
    await page.waitForTimeout(9000);
  }
  await page.screenshot({path:`${DIR}/evidence/122-1-after-order.png`, fullPage:true});
  R.afterOrder = await state();
  log('after Order: %s', JSON.stringify(R.afterOrder)); save();
}

// ---------- RECEIVE ----------
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(12000);
const before = ctx.pages().length;
R.receiveClick = await clickByText(/^receive$/);
log('Receive clicked: %s', JSON.stringify(R.receiveClick).slice(0,220));
// give it a long time, and watch for a new tab or a navigation
for (let i=0;i<6;i++){
  await page.waitForTimeout(5000);
  const d = await describe();
  if (d.panels || d.url !== `/workorders/${WO}/lines` || ctx.pages().length>before){
    R.receiveAppearedAfterSeconds = (i+1)*5; break; }
}
R.newTabs = ctx.pages().length - before;
if (R.newTabs>0){
  const np = ctx.pages()[ctx.pages().length-1];
  await np.waitForTimeout(6000);
  R.newTab = {url:np.url(), text:(await np.evaluate(()=>document.body.innerText)).slice(0,400)};
  await np.screenshot({path:`${DIR}/evidence/122-2-receive-newtab.png`, fullPage:true});
}
R.afterReceiveScreen = await describe();
await page.screenshot({path:`${DIR}/evidence/122-3-after-receive.png`, fullPage:true});
log('after Receive — url=%s panels=%d newTabs=%d', R.afterReceiveScreen.url, R.afterReceiveScreen.panels, R.newTabs);
log('  panel text: %s', JSON.stringify(R.afterReceiveScreen.panelTexts).slice(0,400));
log('  inputs: %s', JSON.stringify(R.afterReceiveScreen.inputs).slice(0,400));
log('  panel buttons: %s', JSON.stringify(R.afterReceiveScreen.panelButtons));
save();

// if a receive window with quantity fields opened, fill and confirm it
if (R.afterReceiveScreen.inputs && R.afterReceiveScreen.inputs.length){
  R.filled = await page.evaluate(vis=>{const isVis=eval(vis); const out=[];
    const p=[...document.querySelectorAll('.q-dialog,.q-drawer')].filter(isVis).pop(); if(!p) return out;
    for (const i of [...p.querySelectorAll('input')].filter(isVis)){
      const f=i.closest('.q-field'); const l=f&&f.querySelector('.q-field__label');
      const lab=(l?l.textContent:'')||i.getAttribute('data-test-id')||'';
      if (/qty|quantity|receiv|amount/i.test(lab) && !i.value){
        i.focus(); const S=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
        S.call(i,'5'); i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
        out.push(lab.trim());}}
    return out;}, VIS);
  await page.waitForTimeout(2500);
  R.receiveConfirm = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const p=[...document.querySelectorAll('.q-dialog,.q-drawer')].filter(isVis).pop(); if(!p) return {none:true};
    const b=[...p.querySelectorAll('button')].filter(isVis).find(e=>/^(receive|confirm|save|save & close|submit|ok|done)$/i.test(t(e)));
    if(b){b.scrollIntoView({block:'center'}); b.click(); return {confirmed:t(b)};}
    return {none:false, seen:[...p.querySelectorAll('button')].filter(isVis).map(t)};}, VIS);
  log('receive window filled=%s confirm=%s', JSON.stringify(R.filled), JSON.stringify(R.receiveConfirm));
  await page.waitForTimeout(10000);
  await page.screenshot({path:`${DIR}/evidence/122-4-after-receive-confirm.png`, fullPage:true});
}
R.after = await state();
log('FINAL: %s', JSON.stringify(R.after));
R.received = (R.after.parts||[]).length > (R.before.parts||[]).length;
log('did the part land on the line? %s', R.received);
save();
await s.browser.close();
log('done');
