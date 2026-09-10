// C45060 — picking a catalogue part that has no cost and no sell price must open those two
// boxes EMPTY, and the user must have to type them before the part will save.
// Positive control first: the picker does offer suggestions for a part we know exists.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG15.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const s = await boot2('admin', {route:`/workorders/${WO}/lines`});
const {page}=s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,300)};},{api:API_HOST,m,p,b:b||null});
const setVal=(tid,val)=>page.evaluate(({tid,val})=>{const i=document.querySelector(`[data-test-id="${tid}"]`);
  if(!i) return false; i.focus();
  const proto=i.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;
  const S=Object.getOwnPropertyDescriptor(proto,'value').set; S.call(i,val);
  i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));
  return true;},{tid,val});
const openLines=async()=>{ await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
  await page.evaluate(()=>{for(const b of document.querySelectorAll('[data-test-id^=button_line_expand_]'))
    if(/expand_more/.test(b.textContent||'')) b.click();});
  await page.waitForTimeout(3500); };
const rowState=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const g=t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return e&&isVis(e)?e.value:null;};
  return {desc:g('input_inline_part_description'), qty:g('input_inline_part_quantity'),
    cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price')};}, VIS);
const openAddRow=async()=>{ const ok=await page.evaluate(vis=>{const isVis=eval(vis);
    const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
    if(!b) return false; b.scrollIntoView({block:'center'}); b.click(); return true;}, VIS);
  if(ok) await page.waitForTimeout(4000); return ok; };
const typeAndSee=async(text)=>{ await setVal('input_inline_part_description', text);
  await page.waitForTimeout(4500);
  return page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).slice(0,8);}, VIS); };
const pickFirst=async()=>{ await page.evaluate(vis=>{const isVis=eval(vis);
    const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)[0];
    if(o) o.click();}, VIS); await page.waitForTimeout(3500); return rowState(); };

await settle(page,{label:'start'});

// ---- which lists the picker could be reading, and does either hold a part with no price
R.lists={};
for (const [name,path] of [['inventory','/api/inventory/parts?limit=200'],['catalog','/api/parts?limit=200']]){
  const arr = rowsOf((await call('GET',path)).json);
  const price = p => [p.purchase_price, p.purchase_price_value, p.cost, p.sell_price, p.sell, p.price]
    .map(v=>Number(v||0)).reduce((a,b)=>a+b,0);
  const zeros = arr.filter(p=>!price(p));
  R.lists[name]={n:arr.length, keys:Object.keys(arr[0]||{}).slice(0,20), zeros:zeros.length,
    zeroSample:zeros.slice(0,3).map(p=>({pn:p.part_number, d:(p.name||p.description||'').slice(0,28),
      pp:p.purchase_price, sp:p.sell_price}))};
  log('%s list: %d entries, %d with no price at all', name, arr.length, zeros.length);
}
save();

// ---- positive control: the picker offers a part we know exists
await openLines();
R.control={};
R.control.opened = await openAddRow();
if (R.control.opened){
  const known = rowsOf((await call('GET','/api/inventory/parts?limit=200')).json)[0];
  R.control.searched = known && known.part_number;
  R.control.options = await typeAndSee(String(known.part_number||'').slice(0,10));
  log('CONTROL picker on %s -> %s', R.control.searched, JSON.stringify(R.control.options));
  if (R.control.options.length){ R.control.afterPick = await pickFirst(); }
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
}
save();

// ---- a part with no price: use one if there is one, otherwise make one
let subject = (rowsOf((await call('GET','/api/inventory/parts?limit=200')).json))
  .find(p=>!Number(p.purchase_price||0) && !Number(p.sell_price||0));
R.subject = subject && {pn:subject.part_number, pp:subject.purchase_price, sp:subject.sell_price};
if (!subject){
  R.make={};
  const cats = rowsOf((await call('GET','/api/inventory/categories')).json);
  const cat = cats[0];
  const template = rowsOf((await call('GET','/api/inventory/parts?limit=200')).json)[0];
  R.make.category = cat && {id:cat.id, n:cat.name||cat.label};
  R.make.templateKeys = Object.keys(template||{});
  const body = {
    part_number:'ZZAUTOTEST-NOPRICE-02', name:'ZZAUTOTEST part with no price',
    description:'ZZAUTOTEST part with no price',
    catalog_part_id:template.catalog_part_id||template.id, category_id:(cat&&cat.id)||template.category,
    tags:[], bins:[], quantity:0, min:0, max:0,
    purchase_price:0, sell_price:0, is_core:false, core_charge:0, environmental_charge:0,
    workplace_id:template.workplace_id, is_fixed_price:false };
  const r = await call('POST','/api/inventory/parts/create', body);
  R.make.create = r.status+' '+r.text.slice(0,240);
  const arr = rowsOf((await call('GET','/api/inventory/parts?limit=200&search=ZZAUTOTEST')).json);
  subject = arr.find(p=>/ZZAUTOTEST-NOPRICE/.test(p.part_number||''));
  R.make.found = subject && {pn:subject.part_number, pp:subject.purchase_price, sp:subject.sell_price};
  log('made a part with no price: %s', JSON.stringify(R.make.found||R.make.create));
}
save();

if (subject){
  await openLines();
  R.check={};
  R.check.opened = await openAddRow();
  if (R.check.opened){
    R.check.onOpen = await rowState();
    R.check.options = await typeAndSee(String(subject.part_number||'').slice(0,16));
    if (R.check.options.length){
      R.check.afterPick = await pickFirst();
      // and does it refuse to save with the price boxes untouched?
      await setVal('input_inline_part_quantity','1');
      await page.waitForTimeout(1200);
      await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]'); if(b) b.click();});
      await page.waitForTimeout(5000);
      R.check.afterSave = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
        return {toasts:[...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(t),
          rowStillOpen:!!document.querySelector('[data-test-id=input_inline_part_description]')};}, VIS);
    }
    await page.screenshot({path:`${DIR}/evidence/BIG15-c45060.png`, fullPage:true}).catch(()=>{});
    log('C45060 -> boxes on open %s | options %s | after picking %s | save %s',
      JSON.stringify(R.check.onOpen), JSON.stringify(R.check.options),
      JSON.stringify(R.check.afterPick), JSON.stringify(R.check.afterSave||null));
    await page.keyboard.press('Escape');
  }
}
save();
log('done');
await s.browser.close();
process.exit(0);
