// C45061 — the Full View twin of C45021: the work order becomes non-editable while an inline ADD row
// is open. Probe 83's admin leg found "no add button" because the lines it had just completed were
// still Complete when that leg ran. Here the lines are put back to authorized first, so the row can
// be opened, and only then is the work order completed underneath it.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const WOID='12c9684e-50d7-4043-86d2-f8a83d321431';
const LINES=['a52af727-7b35-49a5-9138-e679b24c48e7','e004c99a-16c7-48b5-8ee9-1b430a526ec3'];
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/87-c45061.json`, JSON.stringify(R,null,1));
const mkApi=(page,APIH)=>(path, body)=>page.evaluate(async ({api,path,body})=>{
  const r=await fetch(`https://${api}${path}`, body? {method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include', body:JSON.stringify(body)}
    : {headers:{Accept:'application/json'}, credentials:'include'});
  let t=null; try{ t=await r.text(); }catch(e){}
  let j=null; try{ j=JSON.parse(t); }catch(e){}
  return {status:r.status, json:j, text:(t||'').slice(0,260)};}, {api:APIH, path, body:body||null});

const s = await boot('sv9315','/workorders','admin'); const {page, APP, APIH}=s; const api=mkApi(page,APIH);
// make it editable and put the lines back so a part can be added
await api('/api/work-orders/change-status', {id:WOID, status:'approved'});
for (const id of LINES) await api('/api/work-orders/lines/change-status', {line_id:id, status:'authorized', workOrderId:WOID});
const open=async()=>{await page.goto(`${APP}/workorders/${WOID}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
await open();
R.addClicked = await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]');
  if(!b) return 'no add button'; b.scrollIntoView({block:'center'}); b.click(); return 'clicked';});
await page.waitForTimeout(4500);
if (await page.$('[data-test-id=input_inline_part_description]')){
  await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST c45061 seed');
  await page.fill('[data-test-id=input_inline_part_quantity]','3'); await page.waitForTimeout(1500);
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(9000);
}
log('seeded a part:', R.addClicked);
save();
// now open the EDIT row on it
await open();
R.editOpened = await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]');
  if(!b) return 'no add button'; b.scrollIntoView({block:'center'}); b.click(); return 'opened';});
await page.waitForTimeout(4500);
if (await page.$('[data-test-id=input_inline_part_description]')){
  await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST c45061 row');
  await page.fill('[data-test-id=input_inline_part_quantity]','5');
  if (await page.$('[data-test-id=input_inline_part_cost]')) await page.fill('[data-test-id=input_inline_part_cost]','2.00');
  if (await page.$('[data-test-id=input_inline_part_sell_price]')) await page.fill('[data-test-id=input_inline_part_sell_price]','5.00');
  await page.waitForTimeout(1500);
}
R.rowBefore = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
  return d? {open:true, desc:d.value, qty:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value}:{open:false};});
log('add row:', R.editOpened, JSON.stringify(R.rowBefore));
if (!R.rowBefore.open){ log('still no add row — stopping'); save(); await s.browser.close(); process.exit(0); }
// make the work order non-editable underneath it
for (const id of LINES) await api('/api/work-orders/lines/change-status', {line_id:id, status:'complete', workOrderId:WOID});
R.moved = await api('/api/work-orders/change-status', {id:WOID, status:'complete'});
log('work order -> complete:', JSON.stringify(R.moved).slice(0,180));
if (R.moved.status!==200 && R.moved.status!==201){
  R.skipped='the work order would not go non-editable, so the save was not attempted';
  log(R.skipped); save(); await s.browser.close(); process.exit(0);
}
await page.waitForTimeout(2500);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(9000);
R.toast = await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS);
R.rowAfter = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
  return d? {open:true, desc:d.value, qty:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value}:{open:false};});
R.alerts = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...new Set([...document.querySelectorAll('.q-dialog,[role=alert],.text-negative,.q-notification')].filter(isVis).map(t).filter(Boolean))]
    .filter(m=>!/Credit Hold|Build Lines|location_on|^\$/.test(m));}, VIS);
log('C45061 toast=%s row=%s alerts=%s', JSON.stringify(R.toast), JSON.stringify(R.rowAfter), JSON.stringify(R.alerts).slice(0,260));
await page.screenshot({path:`${DIR}/evidence/87-c45061.png`, fullPage:true});
save();
// put it back
await api('/api/work-orders/change-status', {id:WOID, status:'approved'});
for (const id of LINES) await api('/api/work-orders/lines/change-status', {line_id:id, status:'authorized', workOrderId:WOID});
log('restored');
await s.browser.close();
