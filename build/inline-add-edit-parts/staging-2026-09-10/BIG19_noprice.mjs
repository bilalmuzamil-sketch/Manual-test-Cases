// C45060, third attempt -- the picker is select_inline_part_number, not the description box.
// Also closes the one gap left on the printed-page header case by putting an engine-hour
// reading on the job (the boxes input_vehicle_mileage / input_vehicle_engine_hours are on
// the job page) and printing again.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/staging-2026-09-10';
const PDIR='/home/user/Manual-test-Cases/build/printer-friendly-wo/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG19.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,320)};},{api:API_HOST,m,p,b:b||null});
const openLines=async()=>{ await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
  await page.evaluate(()=>{for(const b of document.querySelectorAll('[data-test-id^=button_line_expand_]'))
    if(/expand_more/.test(b.textContent||'')) b.click();});
  await page.waitForTimeout(3500); };
const openAddRow=async()=>{ const ok=await page.evaluate(vis=>{const isVis=eval(vis);
    const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
    if(!b) return false; b.scrollIntoView({block:'center'}); b.click(); return true;}, VIS);
  if(ok) await page.waitForTimeout(4500); return ok; };
const dropdown=()=>page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).slice(0,10);}, VIS);
const typeInto=async(tid,text)=>{ const el = await page.$(`[data-test-id="${tid}"]`); if(!el) return false;
  await el.click({timeout:5000}).catch(()=>{}); await el.fill('').catch(()=>{});
  await page.keyboard.type(text,{delay:120}); await page.waitForTimeout(4500); return true; };
const boxes=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const g=t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return e&&isVis(e)?e.value:null;};
  return {pn:g('select_inline_part_number'), desc:g('input_inline_part_description'),
    qty:g('input_inline_part_quantity'), cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price')};}, VIS);

await settle(page,{label:'start'});

// ---- every inventory part, paged, looking for one with no price at all
R.scan={pages:0, total:0, zeros:[]};
for (let pg=1; pg<=15; pg++){
  const arr = rowsOf((await call('GET',`/api/inventory/parts?limit=200&page=${pg}`)).json);
  if (!arr.length) break;
  R.scan.pages=pg; R.scan.total+=arr.length;
  for (const p of arr){
    const v=[p.purchase_price,p.purchase_price_value,p.sell_price].map(x=>Number(x||0)).reduce((a,b)=>a+b,0);
    if (!v) R.scan.zeros.push({pn:p.part_number, id:p.id, pp:p.purchase_price, sp:p.sell_price});
  }
  if (arr.length<200) break;
}
log('inventory: %d parts over %d pages, %d with no price at all',
  R.scan.total, R.scan.pages, R.scan.zeros.length);
save();

// ---- positive control on the real picker
await openLines();
R.control={opened: await openAddRow()};
const known = rowsOf((await call('GET','/api/inventory/parts?limit=200')).json)[0];
R.control.pn = known.part_number;
await typeInto('select_inline_part_number', String(known.part_number).slice(0,8));
R.control.options = await dropdown();
log('CONTROL picker on %s -> %s', R.control.pn, JSON.stringify(R.control.options).slice(0,220));
if (R.control.options.length){
  await page.evaluate(vis=>{const isVis=eval(vis);
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)[0]; if(o) o.click();}, VIS);
  await page.waitForTimeout(3500);
  R.control.afterPick = await boxes();
  log('CONTROL after picking a priced part: %s', JSON.stringify(R.control.afterPick));
}
await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
await page.screenshot({path:`${DIR}/evidence/BIG19-control.png`, fullPage:true}).catch(()=>{});
save();

// ---- the part with no price
let subject = R.scan.zeros[0];
if (!subject){
  // take one part's prices off through the screen, run the check, put them back
  R.clear={};
  const victim = known;
  R.clear.victim = {pn:victim.part_number, pp:victim.purchase_price, sp:victim.sell_price, id:victim.id};
  const full = ((await call('GET',`/api/inventory/parts/${victim.id}`)).json||{}).data;
  R.clear.detailKeys = full ? Object.keys(full).slice(0,30) : null;
  fs.writeFileSync(`${DIR}/evidence/BIG19-part-before.json`, JSON.stringify(full||victim,null,1));
  if (full){
    for (const body of [{...full, purchase_price:0, sell_price:0},
                        {...full, purchase_price:0, sell_price:0, cost:0}]){
      const r = await call('POST','/api/inventory/parts/change', body);
      R.clear[`try_${Object.keys(body).length}`]=r.status+' '+r.text.slice(0,180);
      if (r.status>=200&&r.status<300) break;
    }
    const re = rowsOf((await call('GET','/api/inventory/parts?limit=200')).json).find(p=>p.id===victim.id);
    R.clear.now = re && {pp:re.purchase_price, sp:re.sell_price};
    if (re && !Number(re.purchase_price||0) && !Number(re.sell_price||0)) subject = re;
  }
  log('clearing a part price -> %s', JSON.stringify(R.clear.now||R.clear));
}
save();

if (subject){
  await openLines();
  R.check={opened: await openAddRow()};
  R.check.onOpen = await boxes();
  await typeInto('select_inline_part_number', String(subject.part_number).slice(0,10));
  R.check.options = await dropdown();
  if (R.check.options.length){
    await page.evaluate(vis=>{const isVis=eval(vis);
      const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)[0]; if(o) o.click();}, VIS);
    await page.waitForTimeout(4000);
    R.check.afterPick = await boxes();
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]'); if(b) b.click();});
    await page.waitForTimeout(5000);
    R.check.afterSave = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
      return {toasts:[...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(t),
        rowStillOpen:!!document.querySelector('[data-test-id=select_inline_part_number]')};}, VIS);
  }
  await page.screenshot({path:`${DIR}/evidence/BIG19-c45060.png`, fullPage:true}).catch(()=>{});
  log('C45060 -> part %s | on open %s | options %s | after picking %s | save %s',
    subject.part_number, JSON.stringify(R.check.onOpen), JSON.stringify(R.check.options).slice(0,120),
    JSON.stringify(R.check.afterPick), JSON.stringify(R.check.afterSave));
  await page.keyboard.press('Escape');
  // put the price back if we took it off
  if (R.clear && R.clear.victim){
    const before = JSON.parse(fs.readFileSync(`${DIR}/evidence/BIG19-part-before.json`));
    const r = await call('POST','/api/inventory/parts/change', before);
    R.clear.restored = r.status+' '+r.text.slice(0,120);
    const re = rowsOf((await call('GET','/api/inventory/parts?limit=200')).json).find(p=>p.id===R.clear.victim.id);
    R.clear.restoredTo = re && {pp:re.purchase_price, sp:re.sell_price};
    log('part price put back: %s', JSON.stringify(R.clear.restoredTo));
  }
}
save();

// ---- the printed header: put an engine-hour reading on the job and print again
R.engineHours={};
await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await settle(page,{label:'odo'});
R.engineHours.fields = await page.evaluate(vis=>{const isVis=eval(vis);
  const g=t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return e?{vis:isVis(e), v:e.value}:null;};
  return {mileage:g('input_vehicle_mileage'), hours:g('input_vehicle_engine_hours')};}, VIS);
for (const [tid,val] of [['input_vehicle_mileage','123456'],['input_vehicle_engine_hours','4321']]){
  const el = await page.$(`[data-test-id="${tid}"]`); if(!el) continue;
  await el.click({timeout:5000}).catch(()=>{}); await el.fill('').catch(()=>{});
  await page.keyboard.type(val,{delay:80}); await page.keyboard.press('Tab'); await page.waitForTimeout(2500);
}
await page.waitForTimeout(4000);
const det=(await call('GET',`/api/work-orders/view/${WO}`)).json; let dd=(det&&(det.data||det))||{}; if(dd.work_order) dd=dd.work_order;
R.engineHours.readBack = {mileage:dd.mileage, engine_hours:dd.engine_hours};
log('mileage / engine hours on the job now: %s', JSON.stringify(R.engineHours.readBack));
if (dd.engine_hours){
  await page.evaluate(()=>{window.__p=0; window.print=function(){window.__p++;};});
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_work_order_nav_bar_menu]'); if(b) b.click();});
  await page.waitForTimeout(2500);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=menu_item_print_work_order]'); if(b) b.click();});
  await page.waitForTimeout(7000);
  await page.emulateMedia({media:'print'}); await page.waitForTimeout(1500);
  R.engineHours.header = await page.evaluate(()=>{const r=document.getElementById('wo-print-root');
    if(!r) return null; const t=r.innerText||''; return t.slice(0, Math.max(0,t.indexOf('Name/Description')));});
  await page.emulateMedia({media:'screen'});
  if (R.engineHours.header) fs.writeFileSync(`${PDIR}/evidence/BIG19-header.txt`, R.engineHours.header);
  log('printed header now reads: %s', JSON.stringify(R.engineHours.header));
}
save();
log('done');
await s.browser.close();
process.exit(0);
