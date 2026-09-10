// The product owner has ruled that the requirement's "Cancelled" line status means DECLINED.
// So: put a line into Declined, print, and check the line still appears with its status shown.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG26.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,200)};},{api:API_HOST,m,p,b:b||null});
const lines=async()=>rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
await settle(page,{label:'start'});

const before = await lines();
R.before = before.map(l=>({n:l.line_name||l.description, s:l.status}));
const victim = before[0];
R.set = (await call('POST','/api/work-orders/lines/change-status',{line_id:victim.line_id, status:'declined'})).status;
const after = await lines();
R.linesNow = after.map(l=>({n:(l.line_name||l.description||'').slice(0,30), s:l.status, disp:l.status_display}));
log('line statuses now: %s', JSON.stringify(R.linesNow));
save();

// is the declined line still visible on screen?
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'screen'});
R.onScreen = await page.evaluate(()=>{
  const t=(document.body.innerText||'').replace(/\s+/g,' ');
  return {declinedShown:/declined/i.test(t), lineCount:document.querySelectorAll('[data-test-id^=button_line_expand_]').length};});
// print it
await page.evaluate(()=>{window.__p=0; window.print=function(){window.__p++;};});
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
await page.waitForTimeout(2500);
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=menu_item_print_work_order]'); if(b) b.click();});
await page.waitForTimeout(7000);
await page.emulateMedia({media:'print'}); await page.waitForTimeout(1600);
R.print = await page.evaluate(()=>{const r=document.getElementById('wo-print-root'); if(!r) return {found:false};
  const txt=r.innerText||'';
  const lineRows=[...r.querySelectorAll('tr.wo-print__row--line')]
    .map(x=>(x.innerText||'').replace(/\s+/g,' ').trim());
  return {found:true, lineRows, hasDeclined:/declined/i.test(txt), text:txt.slice(0,900)};});
await page.emulateMedia({media:'screen'});
await page.screenshot({path:`${DIR}/evidence/BIG26-print.png`, fullPage:true}).catch(()=>{});
log('printed line rows: %s', JSON.stringify(R.print.lineRows));
log('the word Declined appears on the printed page: %s', R.print.hasDeclined);
save();

// put the line back
R.restore = (await call('POST','/api/work-orders/lines/change-status',{line_id:victim.line_id, status:'authorized'})).status;
R.restoredTo = (await lines()).map(l=>l.status);
log('restored: %s', JSON.stringify(R.restoredTo));
save();
log('done');
await s.browser.close();
process.exit(0);
