// Put a line into Declined the way the QA lead showed on screen — click the LINE, then pick
// Declined from the Status list in the Edit Line window — then print and read the line's status.
// The direct route answered 400; this reads the refusal too, so the reason is on the record.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG27.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,300)};},{api:API_HOST,m,p,b:b||null});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
await settle(page,{label:'start'});
const before = await lines();
const victim = before[0];
R.before = before.map(l=>({s:l.status, d:l.status_display}));

// read what the direct route actually says
R.direct = {};
for (const st of ['declined','decline']){
  const r = await call('POST','/api/work-orders/lines/change-status',{line_id:victim.line_id, status:st});
  R.direct[st] = r.status+' '+r.text.slice(0,180);
}
log('direct route says: %s', JSON.stringify(R.direct));

// the screen route: click the line, then the Status list in the Edit Line window
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'lines'});
R.click = await page.evaluate(vis=>{const isVis=eval(vis);
  const tbl=document.querySelector('[data-test-id=table_work_order_lines]'); if(!tbl) return {found:false};
  const row=[...tbl.querySelectorAll('tr')].filter(isVis)
    .find(r=>/Replace - Brake pot/i.test(r.innerText||''));
  if(!row) return {found:false, rows:[...tbl.querySelectorAll('tr')].filter(isVis).map(r=>(r.innerText||'').replace(/\s+/g,' ').slice(0,40))};
  const cell=[...row.querySelectorAll('td')].find(c=>/Replace - Brake pot/i.test(c.innerText||''))||row;
  cell.click(); return {found:true};}, VIS);
await page.waitForTimeout(5000);
R.dialog = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(!d) return {open:false};
  return {open:true, text:t(d).slice(0,260),
    selects:[...d.querySelectorAll('input,select,.q-field')].filter(isVis)
      .map(e=>({tid:e.getAttribute('data-test-id')||'', lab:t(e.closest('.q-field')||e).slice(0,40)})).slice(0,12)};}, VIS);
log('Edit Line window: %s', JSON.stringify(R.dialog).slice(0,420));
if (R.dialog.open){
  R.statusList = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
    const f=[...d.querySelectorAll('.q-field')].filter(isVis).find(e=>/status/i.test(t(e)));
    if(!f) return {found:false};
    (f.querySelector('input')||f).click(); return {found:true};}, VIS);
  await page.waitForTimeout(2500);
  R.options = await page.evaluate(vis=>{const isVis=eval(vis);
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis);
    const texts=o.map(e=>(e.innerText||'').replace(/\s+/g,' ').trim());
    const dec=o.find(e=>/^declined$/i.test((e.innerText||'').trim()));
    if(dec) dec.click();
    return {texts, pickedDeclined:!!dec};}, VIS);
  log('Status list offers: %s | picked Declined: %s', JSON.stringify(R.options.texts), R.options.pickedDeclined);
  await page.waitForTimeout(2000);
  R.saved = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return 'no dialog';
    const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>/^(save|save & close|update|apply)$/i.test(t(e)));
    if(!b) return 'buttons: '+[...d.querySelectorAll('button')].filter(isVis).map(t).join(' | ');
    if(b.disabled) return 'greyed out'; b.click(); return 'clicked '+t(b);}, VIS);
  await page.waitForTimeout(7000);
  log('save -> %s', R.saved);
}
await page.screenshot({path:`${DIR}/evidence/BIG27-editline.png`, fullPage:true}).catch(()=>{});
R.linesNow = (await lines()).map(l=>({s:l.status, d:l.status_display}));
log('line statuses now: %s', JSON.stringify(R.linesNow));
save();

if (R.linesNow.some(l=>/declin/i.test(l.s||''))){
  await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'print'});
  R.onScreen = await page.evaluate(()=>({declinedShown:/declined/i.test(document.body.innerText||'')}));
  await page.evaluate(()=>{window.__p=0; window.print=function(){window.__p++;};});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
  await page.waitForTimeout(2500);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=menu_item_print_work_order]'); if(b) b.click();});
  await page.waitForTimeout(7000);
  await page.emulateMedia({media:'print'}); await page.waitForTimeout(1600);
  R.print = await page.evaluate(()=>{const r=document.getElementById('wo-print-root'); if(!r) return {found:false};
    return {found:true, hasDeclined:/declined/i.test(r.innerText||''),
      lineRows:[...r.querySelectorAll('tr.wo-print__row--line')].map(x=>(x.innerText||'').replace(/\s+/g,' ').trim())};});
  await page.emulateMedia({media:'screen'});
  await page.screenshot({path:`${DIR}/evidence/BIG27-print.png`, fullPage:true}).catch(()=>{});
  log('printed line rows: %s | Declined on the page: %s',
    JSON.stringify(R.print.lineRows), R.print.hasDeclined);
  // put it back
  R.restore = (await call('POST','/api/work-orders/lines/change-status',{line_id:victim.line_id, status:'authorized'})).status;
  R.restoredTo = (await lines()).map(l=>l.status);
  log('restored: %s (%s)', JSON.stringify(R.restoredTo), R.restore);
}
save();
log('done');
await s.browser.close();
process.exit(0);
