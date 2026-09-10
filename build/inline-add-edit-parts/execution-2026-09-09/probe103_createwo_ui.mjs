// UNBLOCK — a work order through the UI, since `work-orders/create` returns 500 on this session
// exactly as the playbook warns ("reuse an existing record or create via the UI"). The recorded UI
// route is: customer page -> Work Orders tab -> New Work Order (the button is disabled while the
// list loads and when the customer has no asset; the asset picker is the 2nd .q-select in the
// dialog). A fresh work order gives C45035, C45061 and C45251 the clean lines they need.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/103-createwo-ui.json`, JSON.stringify(R,null,1));
const api = (path)=>page.evaluate(async ({api,path})=>{
  const r=await fetch(`https://${api}${path}`,{headers:{Accept:'application/json'}, credentials:'include'});
  let j=null; try{ j=await r.json(); }catch(e){}
  return {status:r.status, json:j};}, {api:APIH, path});
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

// take the customer off a work order that exists, so the customer is known to have an asset
const list = await api('/api/work-orders?limit=20&page=1');
const sample = rowsOf(list.json)[0];
const view = sample ? await api(`/api/work-orders/view/${sample.id}`) : null;
let v = (view && view.json && (view.json.data||view.json)) || {}; v = v.work_order || v;
R.customerId = v.customer_id;
log('a customer known to have an asset: %s (from work order %s)', R.customerId, sample && sample.number);
save();
if (!R.customerId){ log('no customer id — stopping'); await s.browser.close(); process.exit(0); }
await page.goto(`${APP}/customers/${R.customerId}`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(13000);
R.customerPage = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return {url:location.href, tabs:[...document.querySelectorAll('.q-tab,[role=tab]')].filter(isVis).map(t),
    buttons:[...document.querySelectorAll('button,.q-btn')].filter(isVis).map(t).filter(Boolean).slice(0,16)};}, VIS);
log('customer page: %s', JSON.stringify(R.customerPage).slice(0,400));
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const tab=[...document.querySelectorAll('.q-tab,[role=tab]')].filter(isVis).find(x=>/work order/i.test(t(x)));
  tab&&tab.click();}, VIS);
await page.waitForTimeout(12000);
// the New Work Order button is disabled while the list loads
for (let i=0;i<8;i++){
  const st = await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_new_work_order]');
    return b? {found:true, disabled:b.disabled||b.classList.contains('disabled')} : {found:false};});
  R.newWoButton = st;
  if (st.found && !st.disabled) break;
  await page.waitForTimeout(4000);
}
log('the New Work Order button: %s', JSON.stringify(R.newWoButton));
await page.screenshot({path:`${DIR}/evidence/103-a-customer-wos.png`, fullPage:true});
save();
if (R.newWoButton && R.newWoButton.found && !R.newWoButton.disabled){
  await page.evaluate(()=>document.querySelector('[data-test-id=button_new_work_order]')?.click());
  await page.waitForTimeout(7000);
  R.dialog = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {open:false};
    return {open:true, text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,300),
      selects:[...d.querySelectorAll('.q-select')].filter(isVis).map(x=>t(x).slice(0,40)),
      buttons:[...d.querySelectorAll('button,.q-btn')].filter(isVis).map(t)};}, VIS);
  log('the New Work Order dialog: %s', JSON.stringify(R.dialog).slice(0,420));
  await page.screenshot({path:`${DIR}/evidence/103-b-dialog.png`, fullPage:true});
  save();
  if (R.dialog.open){
    // asset picker = the 2nd q-select in the dialog (playbook)
    await page.evaluate(vis=>{const isVis=eval(vis);
      const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
      const sels=[...d.querySelectorAll('.q-select')].filter(isVis);
      (sels[1]||sels[0])?.click();}, VIS);
    await page.waitForTimeout(4000);
    R.assetPick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop(); if(!m) return 'no asset list';
      const it=[...m.querySelectorAll('.q-item')].filter(isVis)[0]; if(!it) return 'no assets';
      const l=t(it).slice(0,50); it.click(); return l;}, VIS);
    await page.waitForTimeout(3000);
    log('asset chosen: %s', R.assetPick);
    R.saveClick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
      const b=[...d.querySelectorAll('button,.q-btn')].filter(isVis).find(x=>/^(save|create)$/i.test(t(x)));
      if(!b) return 'no Save'; if(b.disabled) return 'Save disabled'; b.click(); return 'clicked Save';}, VIS);
    await page.waitForTimeout(12000);
    R.landed = page.url();
    R.newWoId = (R.landed.match(/workorders\/([0-9a-f-]{36})/)||[])[1] || null;
    log('after Save: %s -> new work order id %s', R.landed, R.newWoId);
    await page.screenshot({path:`${DIR}/evidence/103-c-created.png`, fullPage:true});
    save();
  }
}
await s.browser.close();
