// Settle the audit trail, the line separation, and the two seeding refusals.
//   - the history call works and already holds 12 print entries; the last run read the WRONG field
//     names off them (everything came back undefined), so read the entries RAW this time
//   - "rows carrying a bottom border: 0 of 19" was measured on the ROW; a table border usually sits
//     on the CELL, so measure both before saying anything about separation
//   - cancelling a line was refused with "Invalid parameter value" — ask the app which values it
//     will accept rather than guessing a fourth spelling
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG3.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,300)};},{api:API_HOST,m,p,b:b||null});
await settle(page,{label:'lines'});

// ---- 1. the history entries, RAW
const h = await call('GET',`/api/work-orders/${WO}/history`);
const entries = rowsOf(h.json);
R.historyCount = entries.length;
R.entryKeys = entries[0] ? Object.keys(entries[0]) : [];
R.printEntries = entries.filter(e=>/print/i.test(JSON.stringify(e))).map(e=>JSON.parse(JSON.stringify(e)));
log('history: %d entries | fields on an entry: %s', entries.length, JSON.stringify(R.entryKeys));
log('entries mentioning printing: %d', R.printEntries.length);
for (const e of R.printEntries.slice(0,4)) log('   %s', JSON.stringify(e).slice(0,320));
save();

// ---- 2. the line separation, measured on CELLS as well as rows
await page.evaluate(()=>{window.__p=0; window.print=function(){window.__p++;};});
await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
  const b=[...document.querySelectorAll('button,[role=button]')].filter(isVis)
    .filter(x=>/more_vert|more_horiz/.test(t(x))||/more/i.test(x.getAttribute('data-test-id')||''))
    .filter(x=>!(tbl&&tbl.contains(x)) && !/_line_|_[0-9a-f]{8}-[0-9a-f]{4}-/.test(x.getAttribute('data-test-id')||''))[0];
  if(b) b.click();}, VIS);
await page.waitForTimeout(2500);
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=menu_item_print_work_order]'); if(b) b.click();});
await page.waitForTimeout(5000);
await page.emulateMedia({media:'print'}); await page.waitForTimeout(1500);
R.separation = await page.evaluate(()=>{const root=document.getElementById('wo-print-root');
  if(!root) return {found:false};
  const out=[];
  for (const r of root.querySelectorAll('tr')){
    const rc=getComputedStyle(r);
    const cells=[...r.children].map(c=>{const cc=getComputedStyle(c);
      return {bw:cc.borderBottomWidth, bs:cc.borderBottomStyle, bc:cc.borderBottomColor, pb:cc.paddingBottom};});
    const maxW = Math.max(0, ...cells.map(c=>parseFloat(c.bw)||0));
    out.push({text:(r.innerText||'').replace(/\s+/g,' ').slice(0,34),
      rowBorder:rc.borderBottomWidth, cellMaxBorder:maxW+'px',
      cellStyle:(cells[0]||{}).bs, height:r.offsetHeight});
  }
  return {found:true, rows:out};});
if (R.separation.found){
  const withBorder = R.separation.rows.filter(r=>parseFloat(r.cellMaxBorder)>0);
  R.rowsWithCellBorder = withBorder.length;
  R.thickest = Math.max(0,...R.separation.rows.map(r=>parseFloat(r.cellMaxBorder)||0));
  log('rows whose CELLS carry a bottom border: %d of %d | thickest: %spx',
    withBorder.length, R.separation.rows.length, R.thickest);
  for (const r of R.separation.rows) log('    %-36s row=%s cell=%s h=%s', r.text, r.rowBorder, r.cellMaxBorder, r.height);
}
await page.emulateMedia({media:'screen'});
save();

// ---- 3. which line statuses will the app accept?
const ln = rowsOf((await call('GET',`/api/work-orders/lines/${WO}`)).json);
R.lineStatusesNow = ln.map(l=>l.status);
R.statusProbe={};
for (const st of ['cancel_line','line_cancelled','void','voided','declined','rejected','on_hold','not_authorized']){
  const r = await call('POST','/api/work-orders/lines/change-status',
    {line_id:ln[ln.length-1].line_id, status:st, workOrderId:WO});
  R.statusProbe[st]={http:r.status, text:r.text.slice(0,90)};
  if (r.status>=200 && r.status<300){ R.acceptedStatus=st; break; }
}
log('line-status values tried: %s | accepted: %s',
  JSON.stringify(Object.fromEntries(Object.entries(R.statusProbe).map(([k,v])=>[k,v.http]))),
  R.acceptedStatus||'none');
// what does the line's own status control offer on screen?
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'lines again'});
R.statusMenu = await page.evaluate(({vis,line})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=document.querySelector(`[data-test-id="badge_line_status_${line}"]`);
  if(!b) return {found:false};
  b.scrollIntoView({block:'center'}); b.click();
  return {found:true};},{vis:VIS, line:ln[ln.length-1].line_id});
await page.waitForTimeout(2500);
R.statusOptions = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop();
  return m? [...m.querySelectorAll('.q-item')].filter(isVis).map(t) : [];}, VIS);
log('the line status control offers: %s', JSON.stringify(R.statusOptions));
save();
await s.browser.close();
log('done');
