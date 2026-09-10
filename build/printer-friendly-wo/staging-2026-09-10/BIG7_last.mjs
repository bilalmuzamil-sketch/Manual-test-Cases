// The last open Printer Friendly questions.
//   C45108  a line with NO parts must print no parts section
//   C45088  print offered on a Declined job too
//   C45125  the print event in the work order's history (the build calls it "Audit Log")
//   C45107/C45116  a work order with NO lines: is Print really greyed out?
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG7.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,220)};},{api:API_HOST,m,p,b:b||null});
const lines=async(wo)=>rowsOf((await call('GET',`/api/work-orders/lines/${wo||WO}`)).json);
const openToolbarMore = async ()=> page.evaluate(()=>{
    const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]');
    if(!b) return {opened:false}; b.click(); return {opened:true};});
const menuItems = async ()=> page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-menu .q-item, [role=menu] [role=menuitem]')]
      .filter(isVis).map(e=>({txt:(e.innerText||'').replace(/\s+/g,' ').trim(),
        tid:e.getAttribute('data-test-id')||'',
        disabled: e.classList.contains('disabled')||e.getAttribute('aria-disabled')==='true'
                 || getComputedStyle(e).pointerEvents==='none'
                 || parseFloat(getComputedStyle(e).opacity)<0.6}))
      .filter(x=>x.txt);}, VIS);
const closeMenu = async ()=>{ await page.keyboard.press('Escape'); await page.waitForTimeout(700); };
const doPrint = async (wo)=>{
  await page.goto(`${APP}/workorders/${wo||WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
  await page.evaluate(()=>{window.__p=0; window.print=function(){window.__p++;};});
  const om = await openToolbarMore(); await page.waitForTimeout(2500);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=menu_item_print_work_order]'); if(b) b.click();});
  await page.waitForTimeout(6000);
  return page.evaluate(o=>({...o, calls:window.__p, hasRoot:!!document.getElementById('wo-print-root')}), om);
};
const readPrint = async ()=>{ await page.emulateMedia({media:'print'}); await page.waitForTimeout(1600);
  const out = await page.evaluate(()=>{const root=document.getElementById('wo-print-root');
    if(!root) return {found:false}; const txt=root.innerText||'';
    return {found:true, chars:txt.length, text:txt,
      rows:[...root.querySelectorAll('tr')].map(r=>(r.innerText||'').replace(/\s+/g,' ').slice(0,60))};});
  await page.emulateMedia({media:'screen'}); return out;};

await settle(page,{label:'start'});

// ---------- A. C45108: strip every part off line 4, then print
R.strip={};
let ln = await lines();
R.strip.lineCount = ln.length;
const last = ln[ln.length-1]||{};
R.strip.lastLine = {id:last.line_id, name:last.line_name||last.description,
  parts:(last.parts||[]).length, requests:(last.part_requests||[]).length,
  tech:last.line_tech_assigned_id||null};
for (const req of (last.part_requests||[])){
  const id=req.id||req.part_request_id||req.request_id;
  const r=await call('POST',`/api/work-orders/part/remove-request/${id}`,{});
  R.strip[`req_${String(id).slice(0,8)}`]=r.status;
}
for (const p of (last.parts||[])){
  const id=p.id||p.part_id;
  let r=await call('POST',`/api/work-orders/part/remove-request/${id}`,{});
  if(r.status>=300) r=await call('POST','/api/work-orders/parts/delete',{part_id:id, work_order_id:WO});
  R.strip[`part_${String(id).slice(0,8)}`]=r.status;
}
const ln2 = await lines();
const last2 = ln2[ln2.length-1]||{};
R.strip.after = {parts:(last2.parts||[]).length, requests:(last2.part_requests||[]).length};
log('line 4 parts: %s -> %s', JSON.stringify(R.strip.lastLine), JSON.stringify(R.strip.after));
save();

R.printNoParts = await doPrint(WO);
const o1 = await readPrint();
if (o1.found){
  fs.writeFileSync(`${DIR}/evidence/BIG7-noparts.txt`, o1.text);
  R.noPartsRows = o1.rows;
  log('rows now: %s', JSON.stringify(o1.rows.slice(-6)));
}
save();

// ---------- B. C45125: the print event in the Audit Log (the build's name for the history)
R.audit={};
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'audit'});
R.audit.menu = await openToolbarMore(); await page.waitForTimeout(2200);
R.audit.clicked = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
  const it=[...document.querySelectorAll('.q-menu .q-item')].filter(isVis).find(e=>/audit log/i.test(t(e)));
  if(!it) return false; it.click(); return true;}, VIS);
await page.waitForTimeout(6000);
R.audit.entries = await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-dialog tr, .q-dialog .q-item, tr')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(x=>x.length>3).slice(0,60);}, VIS);
R.audit.printEntries = (R.audit.entries||[]).filter(x=>/print/i.test(x));
await page.screenshot({path:`${DIR}/evidence/BIG7-auditlog.png`, fullPage:true}).catch(()=>{});
log('audit log: opened=%s entries=%d print=%d %s', R.audit.clicked, R.audit.entries.length,
  R.audit.printEntries.length, JSON.stringify(R.audit.printEntries.slice(0,4)));
save();
await closeMenu();

// ---------- C. C45088: a Declined job
R.declined={};
const setD = await call('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:'declined'});
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'declined'});
R.declined.set = setD.status;
R.declined.menu = await openToolbarMore(); await page.waitForTimeout(2200);
const dItems = await menuItems();
R.declined.items = dItems.map(i=>i.txt);
const dp = dItems.find(i=>/print work order/i.test(i.txt));
R.declined.printOffered = !!dp; R.declined.printDisabled = dp?dp.disabled:null;
await page.screenshot({path:`${DIR}/evidence/BIG7-declined-menu.png`, fullPage:true}).catch(()=>{});
log('declined -> print %s (disabled %s) | %s', R.declined.printOffered, R.declined.printDisabled,
  JSON.stringify(R.declined.items));
await closeMenu();
await call('POST','/api/work-orders/change-status',{id:WO, work_order:WO, status:'approved'});
save();

// ---------- D. C45107 / C45116: a work order with NO lines
R.noLines={};
const all = rowsOf((await call('GET','/api/work-orders?limit=200')).json);
let zero=null;
for (const w of all.slice(0,60)){
  const l = await lines(w.id);
  if (Array.isArray(l) && l.length===0){ zero={id:w.id, number:w.number, status:w.status}; break; }
}
R.noLines.found = zero;
if (zero){
  await page.goto(`${APP}/workorders/${zero.id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'zero'});
  // a 0-line work order pops the New Line dialog -- close it before touching the toolbar
  await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
    if(!d) return; const x=[...d.querySelectorAll('button,i')].find(e=>/close|×/i.test(t(e))
      || /close/i.test(e.getAttribute('data-test-id')||'')); if(x) x.click();}, VIS);
  await page.waitForTimeout(2500);
  R.noLines.menu = await openToolbarMore(); await page.waitForTimeout(2200);
  const zi = await menuItems();
  R.noLines.items = zi.map(i=>({t:i.txt, dis:i.disabled}));
  const zp = zi.find(i=>/print work order/i.test(i.txt));
  R.noLines.printOffered = !!zp; R.noLines.printDisabled = zp?zp.disabled:null;
  await page.screenshot({path:`${DIR}/evidence/BIG7-nolines-menu.png`, fullPage:true}).catch(()=>{});
  if (zp && !zp.disabled){
    await page.evaluate(()=>{window.__p=0; window.print=function(){window.__p++;};});
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=menu_item_print_work_order]'); if(b) b.click();});
    await page.waitForTimeout(6000);
    const oz = await readPrint();
    R.noLines.printed = {calls:await page.evaluate(()=>window.__p), found:oz.found};
    if (oz.found){ fs.writeFileSync(`${DIR}/evidence/BIG7-nolines-print.txt`, oz.text); R.noLines.text=oz.text; }
  }
  log('a job with no lines (%s): print offered %s, greyed out %s | printed %s',
    zero.number, R.noLines.printOffered, R.noLines.printDisabled, JSON.stringify(R.noLines.printed||null));
} else log('no zero-line job among the first 60');
save();
log('done');
await s.browser.close();
process.exit(0);
