// The QA lead has ruled SV-9918 obsolete: for a CATALOG part the cost and sell price may be left
// at 0.00 on the job, because the cost is captured later, on the receiving screen, where Receive
// will not go through until a cost is entered. Sell price may stay 0.00.
// Two things to observe before the case is rewritten:
//   1. the picker really does label such a part "Catalog"
//   2. the receiving screen really does require a cost, and really does accept a 0.00 sell price
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG31.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
await page.setViewportSize({width:1600, height:1000});
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,240)};},{api:API_HOST,m,p,b:b||null});
const openLines=async()=>{ await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
  await page.evaluate(()=>{for(const b of document.querySelectorAll('[data-test-id^=button_line_expand_]'))
    if(/expand_more/.test(b.textContent||'')) b.click();});
  await page.waitForTimeout(3500); };
const typeInto=async(tid,text)=>{ const el=await page.$(`[data-test-id="${tid}"]`); if(!el) return false;
  await el.click({timeout:6000}).catch(()=>{}); await el.fill('').catch(()=>{});
  await page.keyboard.type(text,{delay:100}); await page.waitForTimeout(4000); return true; };

await settle(page,{label:'start'});

// ---------- 1. does the picker label it "Catalog"?
await openLines();
await page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
  if(b){ b.scrollIntoView({block:'center'}); b.click(); }}, VIS);
await page.waitForTimeout(4500);
await typeInto('select_inline_part_number','ZZAUTOTEST-CAT');
R.picker = await page.evaluate(vis=>{const isVis=eval(vis);
  const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());
  return {options:o.slice(0,6), saysCatalog:o.some(t=>/catalog/i.test(t))};}, VIS);
log('picker options: %s | the word Catalog appears: %s',
  JSON.stringify(R.picker.options), R.picker.saysCatalog);
await page.screenshot({path:`${DIR}/evidence/BIG31-1-picker.png`}).catch(()=>{});
await page.keyboard.press('Escape').catch(()=>{});
save();

// ---------- 2. find a part on this job that can be ordered, and open the receiving screen
await openLines();
R.orderButtons = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
  const bs=[...document.querySelectorAll('button')].filter(isVis).filter(e=>/^order$/i.test(t(e)));
  return bs.length;}, VIS);
log('Order buttons on the page: %d', R.orderButtons);

const orders = rowsOf((await call('GET','/api/inventory/orders')).json);
const mine = orders.filter(o=>String(o.workOrderId||'')===WO);
R.orders = {total:orders.length, forThisJob:mine.length,
  sample:mine.slice(0,3).map(o=>({id:o.id, no:o.orderNumber, items:(o.items||[]).length}))};
log('purchase orders for this job: %s', JSON.stringify(R.orders));

if (mine.length){
  const o = mine[0];
  const url = `${APP}/order/${o.id}?receive=1&returnTo=WorkOrder&returnId=${WO}`;
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'receive'});
  await page.waitForTimeout(3000);
  R.receive = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const fields=[...document.querySelectorAll('input')].filter(isVis).map(e=>({
      tid:e.getAttribute('data-test-id')||'', v:e.value,
      lab:t(e.closest('.q-field')||e.parentElement||e).slice(0,40)}));
    const btn=[...document.querySelectorAll('button')].filter(isVis)
      .find(e=>/receive/i.test(t(e)) && !/receive parts/i.test(t(e)));
    return {url:location.href, fieldCount:fields.length,
      costFields:fields.filter(f=>/cost/i.test(f.tid+' '+f.lab)),
      sellFields:fields.filter(f=>/sell/i.test(f.tid+' '+f.lab)),
      invoiceFields:fields.filter(f=>/invoice/i.test(f.tid+' '+f.lab)).map(f=>f.tid),
      receiveButton: btn?{text:t(btn), disabled:btn.disabled}:null,
      heading:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,180)};}, VIS);
  await page.screenshot({path:`${DIR}/evidence/BIG31-2-receive.png`, fullPage:true}).catch(()=>{});
  log('receiving screen: %s', JSON.stringify({url:R.receive.url, cost:R.receive.costFields,
    sell:R.receive.sellFields, btn:R.receive.receiveButton}).slice(0,600));
}
save();
log('done');
await s.browser.close();
process.exit(0);
