// C45060, second attempt. The first one failed its own positive control -- setting the box's
// value in code does not open the part picker -- so this types on the keyboard the way a person
// does, and first writes down every box in the row so the right one is used.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG17.json`, JSON.stringify(R,null,1));
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
const rowBoxes=()=>page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('input,textarea,select')].filter(isVis)
    .map(e=>({tid:e.getAttribute('data-test-id')||'', ph:e.placeholder||'', v:e.value,
      lab:((e.closest('.q-field')||e.parentElement||{}).innerText||'').replace(/\s+/g,' ').trim().slice(0,40),
      ro:e.readOnly, role:e.getAttribute('role')||''}))
    .filter(x=>x.tid||x.lab);}, VIS);
const dropdown=()=>page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item,[role=option],.q-virtual-scroll__content .q-item')]
    .filter(isVis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).slice(0,10);}, VIS);
const typeInto=async(tid,text)=>{ const el = await page.$(`[data-test-id="${tid}"]`); if(!el) return false;
  await el.click({timeout:5000}).catch(()=>{}); await el.fill('').catch(()=>{});
  await page.keyboard.type(text, {delay:120}); await page.waitForTimeout(4000); return true; };
const priceBoxes=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const g=t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return e&&isVis(e)?e.value:null;};
  return {desc:g('input_inline_part_description'), qty:g('input_inline_part_quantity'),
    cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price')};}, VIS);

await settle(page,{label:'start'});
await openLines();
R.opened = await openAddRow();
R.boxes = await rowBoxes();
fs.writeFileSync(`${DIR}/evidence/BIG17-boxes.json`, JSON.stringify(R.boxes,null,1));
log('boxes in the row: %s', JSON.stringify(R.boxes.map(b=>b.tid||b.lab)).slice(0,500));
save();

// ---- positive control: typing a real part number on the keyboard opens the picker
const known = rowsOf((await call('GET','/api/inventory/parts?limit=200')).json)[0];
R.control={pn:known.part_number, sell:known.sell_price, purchase:known.purchase_price};
const cand = R.boxes.filter(b=>/part_number|description|search|part/i.test(b.tid||b.lab)).map(b=>b.tid).filter(Boolean);
R.control.tried={};
for (const tid of [...new Set(cand)]){
  await typeInto(tid, String(known.part_number).slice(0,8));
  const opts = await dropdown();
  R.control.tried[tid]=opts;
  log('typing into %s -> %s', tid, JSON.stringify(opts).slice(0,200));
  if (opts.length){ R.control.works=tid; R.control.options=opts; break; }
}
await page.screenshot({path:`${DIR}/evidence/BIG17-picker.png`, fullPage:true}).catch(()=>{});
save();

// ---- a part with no price: make one, using the shape the refusal asked for
R.make={};
const cats = rowsOf((await call('GET','/api/inventory/categories')).json);
R.make.categories = cats.slice(0,3).map(c=>({id:c.id, n:c.name||c.label}));
const catalog = rowsOf((await call('GET','/api/parts?limit=200')).json);
R.make.catalogKeys = Object.keys(catalog[0]||{}).slice(0,20);
const cp = catalog[0];
const body = {part_number:'ZZAUTOTEST-NOPRICE-03', name:'ZZAUTOTEST part with no price',
  description:'ZZAUTOTEST part with no price',
  catalog_part_id: cp && (cp.catalog_part_id||cp.id),
  category_id: (cats[0]&&cats[0].id), tags:[], bins:[], quantity:0, min:0, max:0,
  cost:0, purchase_price:0, sell_price:0, is_core:false, core_charge:0,
  environmental_charge:0, is_fixed_price:false, workplace_id:known.workplace_id};
const r = await call('POST','/api/inventory/parts/create', body);
R.make.create = r.status+' '+r.text.slice(0,280);
log('creating a part with no price -> %s', R.make.create);
let subject = rowsOf((await call('GET','/api/inventory/parts?limit=200&search=ZZAUTOTEST')).json)
  .find(p=>/ZZAUTOTEST-NOPRICE/.test(p.part_number||''));
R.make.found = subject && {pn:subject.part_number, pp:subject.purchase_price, sp:subject.sell_price};
save();

// ---- the check itself
if (subject && R.control.works){
  await openLines();
  R.check={opened: await openAddRow()};
  R.check.onOpen = await priceBoxes();
  await typeInto(R.control.works, String(subject.part_number).slice(0,18));
  R.check.options = await dropdown();
  if (R.check.options.length){
    await page.evaluate(vis=>{const isVis=eval(vis);
      const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)[0];
      if(o) o.click();}, VIS);
    await page.waitForTimeout(4000);
    R.check.afterPick = await priceBoxes();
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]'); if(b) b.click();});
    await page.waitForTimeout(5000);
    R.check.afterSave = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
      return {toasts:[...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(t),
        rowStillOpen:!!document.querySelector('[data-test-id=input_inline_part_description]')};}, VIS);
  }
  await page.screenshot({path:`${DIR}/evidence/BIG17-c45060.png`, fullPage:true}).catch(()=>{});
  log('C45060 -> on open %s | options %s | after picking %s | save %s',
    JSON.stringify(R.check.onOpen), JSON.stringify(R.check.options),
    JSON.stringify(R.check.afterPick), JSON.stringify(R.check.afterSave));
  await page.keyboard.press('Escape');
}
save();
log('done');
await s.browser.close();
process.exit(0);
