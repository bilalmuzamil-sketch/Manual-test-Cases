// Does "Save & Close" on the Edit Line window save ANYTHING? Positive control first:
// change the Tech Time only, save, read it back. Then change only the Status, save, read back.
// If the first sticks and the second does not, the fault is in the product, not in the probe.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG29.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
await page.setViewportSize({width:1600, height:1000});
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,200)};},{api:API_HOST,m,p,b:b||null});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
const openEdit=async()=>{ await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
  await page.evaluate(vis=>{const isVis=eval(vis);
    const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
    const row=[...tbl.querySelectorAll('tr')].filter(isVis).find(r=>/Replace - Brake pot/i.test(r.innerText||''));
    const cell=[...row.querySelectorAll('td')].find(c=>/Replace - Brake pot/i.test(c.innerText||''))||row;
    cell.click();}, VIS);
  await page.waitForTimeout(5000); };
const clickSave=async()=>{
  const btn=page.locator('[data-test-id=button_save_close]').first();
  await btn.click({timeout:8000}).catch(e=>log('save click: '+e.message.slice(0,60)));
  await page.waitForTimeout(7000);
  return page.evaluate(vis=>{const isVis=eval(vis);
    return {open:[...document.querySelectorAll('.q-dialog')].filter(isVis).length>0};}, VIS); };

await settle(page,{label:'start'});
const before=(await lines())[0];
R.before={status:before.status, techTime:before.tech_time, name:before.line_name};
log('before: %s', JSON.stringify(R.before));

// ---- CONTROL: change the Tech Time only
await openEdit();
const tt = page.locator('.q-dialog input').nth(-1);
R.control={};
R.control.typed = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const f=[...d.querySelectorAll('.q-field')].filter(isVis).find(e=>/tech time/i.test(t(e)));
  if(!f) return false; const i=f.querySelector('input'); if(!i) return false;
  i.focus(); const S=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  S.call(i,'3.75'); i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
  return true;}, VIS);
await page.waitForTimeout(1500);
R.control.afterSave = await clickSave();
const afterCtl=(await lines())[0];
R.control.readBack={techTime:afterCtl.tech_time, status:afterCtl.status};
log('CONTROL, tech time -> 3.75: window closed=%s | read back %s',
  !R.control.afterSave.open, JSON.stringify(R.control.readBack));
await page.screenshot({path:`${DIR}/evidence/BIG29-control.png`}).catch(()=>{});
save();

// ---- THE CHECK: change the Status only
await openEdit();
const field = page.locator('.q-dialog .q-field').filter({hasText:'Status'}).first();
await field.click({timeout:8000}).catch(()=>{});
await page.waitForTimeout(2500);
await page.locator('.q-menu .q-item').filter({hasText:'Declined'}).first().click({timeout:8000}).catch(()=>{});
await page.waitForTimeout(2500);
R.check={fieldShows: await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const f=[...d.querySelectorAll('.q-field')].filter(isVis).find(e=>/status/i.test(t(e)));
  return f?(f.querySelector('input')||{}).value:null;}, VIS)};
R.check.afterSave = await clickSave();
const afterChk=(await lines())[0];
R.check.readBack={status:afterChk.status, techTime:afterChk.tech_time};
log('CHECK, status -> Declined (field showed "%s"): window closed=%s | read back %s',
  R.check.fieldShows, !R.check.afterSave.open, JSON.stringify(R.check.readBack));
await page.screenshot({path:`${DIR}/evidence/BIG29-check.png`}).catch(()=>{});
save();

// ---- put the tech time back
await openEdit();
await page.evaluate(({vis,v})=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return;
  const f=[...d.querySelectorAll('.q-field')].filter(isVis).find(e=>/tech time/i.test(t(e)));
  const i=f&&f.querySelector('input'); if(!i) return;
  i.focus(); const S=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  S.call(i,String(v||'1.00')); i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));},
  {vis:VIS, v:R.before.techTime});
await page.waitForTimeout(1500);
await clickSave();
R.restored=(await lines())[0].tech_time;
log('tech time restored to %s', R.restored);
save();
log('done');
await s.browser.close();
process.exit(0);
