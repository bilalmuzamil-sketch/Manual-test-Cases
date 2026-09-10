// Settles the last executable Printer Friendly cases in one pass:
// C45094 header with mileage/engine hours · C45095 empty fields omitted · C45099 line detail
// C45105 separation between line groups (borders read on CELLS, not only rows)
// C45108 a line with no parts · C45109 a line with no technician
// C45088 print offered at every job status · C45125 the print event in History
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG5.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};

const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page} = s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,300)};},{api:API_HOST,m,p,b:b||null});
const lines=async(wo)=>rowsOf((await call('GET',`/api/work-orders/lines/${wo||WO}`)).json);

const openToolbarMore = async ()=> page.evaluate(vis=>{const isVis=eval(vis);
    const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const tbl=document.querySelector('[data-test-id=table_work_order_lines]');
    const b=[...document.querySelectorAll('button,[role=button]')].filter(isVis)
      .filter(x=>/more_vert|more_horiz/.test(t(x))||/more/i.test(x.getAttribute('data-test-id')||''))
      .filter(x=>!(tbl&&tbl.contains(x)) && !/_line_|_[0-9a-f]{8}-[0-9a-f]{4}-/.test(x.getAttribute('data-test-id')||''))[0];
    if(!b) return {opened:false}; b.click(); return {opened:true, tid:b.getAttribute('data-test-id')||''};}, VIS);
const menuItems = async ()=> page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-menu .q-item, [role=menu] [role=menuitem], .q-menu [data-test-id]')]
      .filter(isVis).map(e=>({txt:(e.innerText||'').replace(/\s+/g,' ').trim(),
        tid:e.getAttribute('data-test-id')||'',
        disabled: e.classList.contains('disabled')||e.getAttribute('aria-disabled')==='true'}))
      .filter(x=>x.txt);}, VIS);
const closeMenu = async ()=>{ await page.keyboard.press('Escape'); await page.waitForTimeout(600); };

const doPrint = async (wo)=>{
  await page.goto(`${APP}/workorders/${wo||WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
  await page.evaluate(()=>{window.__p=0; window.print=function(){window.__p++;};});
  const om = await openToolbarMore();
  await page.waitForTimeout(2500);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=menu_item_print_work_order]'); if(b) b.click();});
  await page.waitForTimeout(6000);
  return page.evaluate(o=>({...o, calls:window.__p, hasRoot:!!document.getElementById('wo-print-root')}), om);
};
// borders read on ROWS *and* on every CELL, top and bottom -- the earlier read looked only at rows
const readPrint = async ()=>{ await page.emulateMedia({media:'print'}); await page.waitForTimeout(1600);
  const out = await page.evaluate(()=>{const root=document.getElementById('wo-print-root');
    if(!root) return {found:false}; const txt=root.innerText||'';
    const num=v=>parseFloat(v)||0;
    const rows=[...root.querySelectorAll('tr')].map((r,i)=>{const rc=getComputedStyle(r);
      const cells=[...r.children].map(c=>{const cs=getComputedStyle(c);
        return {bt:cs.borderTopWidth, bts:cs.borderTopStyle, bb:cs.borderBottomWidth, bbs:cs.borderBottomStyle};});
      const maxBt=Math.max(0,...cells.map(c=>c.bts!=='none'?num(c.bt):0));
      const maxBb=Math.max(0,...cells.map(c=>c.bbs!=='none'?num(c.bb):0));
      return {i, t:(r.innerText||'').replace(/\s+/g,' ').slice(0,46),
        rowBt:rc.borderTopStyle!=='none'?num(rc.borderTopWidth):0,
        rowBb:rc.borderBottomStyle!=='none'?num(rc.borderBottomWidth):0,
        cellBt:maxBt, cellBb:maxBb, h:r.offsetHeight, cls:r.className.slice(0,60)};});
    // positive control: can this reader see a border anywhere in the document at all?
    const anyBorder=[...document.querySelectorAll('*')].slice(0,4000).filter(e=>{const c=getComputedStyle(e);
      return c.borderBottomStyle!=='none'&&parseFloat(c.borderBottomWidth)>0;}).length;
    return {found:true, chars:txt.length, rows, anyBorderElems:anyBorder, text:txt};});
  await page.emulateMedia({media:'screen'}); return out;};
const chip = async ()=> page.evaluate(vis=>{const isVis=eval(vis);
    const c=[...document.querySelectorAll('.q-chip,.q-badge,[data-test-id*=status]')].filter(isVis)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean);
    return c.slice(0,8);}, VIS);

await settle(page,{label:'start'});

// ---------- A. a line with no parts and no technician (C45108, C45109)
R.bare={};
const cl = rowsOf((await call('GET','/api/work-orders/canned-lines')).json);
R.bare.cannedCount = cl.length;
const before = await lines();
R.bare.linesBefore = before.length;
let made=null;
for (const c of cl.slice(0,25)){
  const r = await call('POST',`/api/work-orders/${WO}/lines/create-from-canned-line`,{canned_line_id:c.id, status:'authorized'});
  if (r.status>=200 && r.status<300){ made={id:c.id, name:c.name||c.title||'', http:r.status}; break; }
  R.bare.lastErr={http:r.status, text:r.text.slice(0,140)};
}
R.bare.created = made;
let ln = await lines();
R.bare.linesAfter = ln.length;
const fresh = ln[ln.length-1] || {};
R.bare.freshLine = {id:(fresh.id||'').slice(0,8), name:fresh.name||fresh.description||'',
  parts:(fresh.parts||[]).length, techs:(fresh.technicians||fresh.techs||[]).length,
  keys:Object.keys(fresh).slice(0,30)};
// strip its parts so the "no parts" case has a real subject
if ((fresh.parts||[]).length){
  for (const p of fresh.parts){
    for (const path of [`/api/work-orders/part/delete`,`/api/work-orders/parts/delete`]){
      const r=await call('POST',path,{id:p.id, part:p.id, line:fresh.id, work_order:WO});
      R.bare[`del_${path.split('/').pop()}`]=r.status; if(r.status<300) break;
    }
  }
  const ln2=await lines(); const f2=ln2[ln2.length-1]||{};
  R.bare.freshAfterStrip={parts:(f2.parts||[]).length, techs:(f2.technicians||f2.techs||[]).length};
}
log('bare line: %s', JSON.stringify(R.bare.freshLine)+' / '+JSON.stringify(R.bare.freshAfterStrip||{}));
save();

// ---------- B. print and measure separation properly (C45105, C45099, C45108, C45109)
R.print1 = await doPrint(WO);
R.out1 = await readPrint();
if (R.out1.found){
  fs.writeFileSync(`${DIR}/evidence/BIG5-print.txt`, R.out1.text);
  const withBorder = R.out1.rows.filter(r=>r.cellBt>0||r.cellBb>0||r.rowBt>0||r.rowBb>0);
  R.separation = {totalRows:R.out1.rows.length, rowsWithAnyBorder:withBorder.length,
    thickest:Math.max(0,...R.out1.rows.map(r=>Math.max(r.cellBt,r.cellBb,r.rowBt,r.rowBb))),
    spacerRows:R.out1.rows.filter(r=>!r.t.trim()&&r.h>40).length,
    borderReaderWorks: R.out1.anyBorderElems};
  log('separation: %s', JSON.stringify(R.separation));
}
await page.screenshot({path:`${DIR}/evidence/BIG5-print.png`, fullPage:true}).catch(()=>{});
save();

// ---------- C. C45125 the print event in the History tab, on screen
R.history={};
const ht = await page.evaluate(vis=>{const isVis=eval(vis);
  const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const tab=[...document.querySelectorAll('a,button,[role=tab],.q-tab')].filter(isVis)
    .find(e=>/^history$/i.test(t(e)));
  if(!tab) return {found:false, tabs:[...document.querySelectorAll('[role=tab],.q-tab')].filter(isVis).map(t)};
  tab.click(); return {found:true};}, VIS);
R.history.tab = ht;
await page.waitForTimeout(4000);
R.history.entries = await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('tr,.q-item,li')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(x=>x.length>4).slice(0,40);}, VIS);
R.history.printEntries = (R.history.entries||[]).filter(x=>/print/i.test(x));
await page.screenshot({path:`${DIR}/evidence/BIG5-history.png`, fullPage:true}).catch(()=>{});
log('history: tab=%s entries=%d print=%d %s', JSON.stringify(ht), (R.history.entries||[]).length,
  R.history.printEntries.length, JSON.stringify(R.history.printEntries.slice(0,3)));
save();

// ---------- D. C45088 print offered at every job status (TOOLBAR menu, not the line menu)
R.statuses={};
const wantStatuses=['estimate','approved','ready_for_review','invoiced','paid'];
for (const st of wantStatuses){
  const r = await call('POST','/api/work-orders/change-status',{work_order:WO, id:WO, status:st});
  await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'st-'+st});
  const om = await openToolbarMore(); await page.waitForTimeout(2200);
  const items = await menuItems();
  const printItem = items.find(i=>/print work order/i.test(i.txt));
  R.statuses[st]={set:r.status, menuOpened:om.opened, chip:await chip(),
    items:items.map(i=>i.txt), printOffered:!!printItem, printDisabled:printItem?printItem.disabled:null};
  log('%s -> print offered %s, menu %s', st, !!printItem, JSON.stringify(items.map(i=>i.txt)));
  await closeMenu();
  save();
}
// In Progress the way the QA lead showed: press Start on a line's Labor row
await call('POST','/api/work-orders/change-status',{work_order:WO, id:WO, status:'approved'});
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'pre-start'});
R.inProgress={chipBefore:await chip()};
R.inProgress.started = await page.evaluate(vis=>{const isVis=eval(vis);
  const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button')].filter(isVis).find(e=>/^start$/i.test(t(e)));
  if(!b) return {clicked:false}; b.click(); return {clicked:true};}, VIS);
await page.waitForTimeout(6000);
R.inProgress.chipAfter = await chip();
const om2 = await openToolbarMore(); await page.waitForTimeout(2200);
const it2 = await menuItems();
R.inProgress.items = it2.map(i=>i.txt);
R.inProgress.printOffered = it2.some(i=>/print work order/i.test(i.txt));
await closeMenu();
await page.screenshot({path:`${DIR}/evidence/BIG5-inprogress.png`, fullPage:true}).catch(()=>{});
log('in progress: %s -> %s | print %s', JSON.stringify(R.inProgress.chipBefore),
  JSON.stringify(R.inProgress.chipAfter), R.inProgress.printOffered);
save();

// ---------- E. C45094/C45095 a job whose vehicle carries mileage and engine hours
R.odo={};
const list = rowsOf((await call('GET','/api/work-orders?page=1&per_page=60')).json);
R.odo.listed = list.length;
let target=null;
for (const w of list.slice(0,40)){
  const id=w.id||w.work_order_id; if(!id) continue;
  const dj=(await call('GET',`/api/work-orders/view/${id}`)).json;
  let d=(dj&&(dj.data||dj))||{}; if(d.work_order) d=d.work_order;
  if ((d.mileage!=null && d.mileage!=='' ) || (d.engine_hours!=null && d.engine_hours!=='')){
    target={id, number:d.number||w.number, mileage:d.mileage, engine_hours:d.engine_hours,
      lines:(d.lines||[]).length}; break; }
}
R.odo.target=target;
if (target){
  R.odo.print = await doPrint(target.id);
  const o = await readPrint();
  R.odo.header = o.found ? o.text.slice(0, Math.max(0,o.text.indexOf('Name/Description'))) : null;
  if (o.found) fs.writeFileSync(`${DIR}/evidence/BIG5-odo-print.txt`, o.text);
}
log('odo job: %s', JSON.stringify(target));
save();
log('done');
await s.close?.();
process.exit(0);
