// C45060, last route: make a part with no cost and no sell price through the Parts screen,
// which is where a shop would actually do it. Then run the check and remove the part again.
import { boot2, APP, API_HOST } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { settle } from '/home/user/Manual-test-Cases/build/testing-tools/probe_guard.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/staging-2026-09-10';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/BIG23.json`, JSON.stringify(R,null,1));
const WO='9e1934ae-a2f7-41f1-baae-0ee5690e9a96';
const PN='ZZAUTOTEST-NP-'+Math.floor(Math.random()*9000+1000);
const rowsOf=(j)=>{const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
  if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; }; return pick(j);};
const s = await boot2('admin', {route:'/parts/inventory'});
const {page}=s;
const call=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',
  body:b?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}
  return{status:r.status,json:j,text:(t||'').slice(0,300)};},{api:API_HOST,m,p,b:b||null});
const dlgFields=()=>page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const scope=d||document;
  return {title:(d?(d.innerText||''):'').replace(/\s+/g,' ').slice(0,120),
    fields:[...scope.querySelectorAll('input,textarea,select')].filter(isVis)
      .map(e=>({tid:e.getAttribute('data-test-id')||'', ph:e.placeholder||'',
        lab:((e.closest('.q-field')||e.parentElement||{}).innerText||'').replace(/\s+/g,' ').trim().slice(0,36),
        v:e.value, req:e.required})),
    buttons:[...scope.querySelectorAll('button')].filter(isVis).map(e=>(e.innerText||'').trim()).filter(Boolean)};}, VIS);
const typeInto=async(tid,text)=>{ const el=await page.$(`[data-test-id="${tid}"]`); if(!el) return false;
  await el.click({timeout:5000}).catch(()=>{}); await el.fill('').catch(()=>{});
  if(text) await page.keyboard.type(text,{delay:90}); await page.waitForTimeout(1200); return true; };

await settle(page,{label:'parts'});
R.page = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
  return {url:location.href, heading:(document.body.innerText||'').replace(/\s+/g,' ').slice(0,140),
    buttons:[...document.querySelectorAll('button')].filter(isVis).map(t).filter(Boolean).slice(0,20)};}, VIS);
log('parts screen: %s | buttons %s', R.page.url, JSON.stringify(R.page.buttons));
save();

R.opened = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button')].filter(isVis)
    .find(e=>/new inventory part|new part|add part|create part/i.test(t(e)));
  if(!b) return false; b.click(); return t(b);}, VIS);
await page.waitForTimeout(4000);
R.dialog = await dlgFields();
fs.writeFileSync(`${DIR}/evidence/BIG23-dialog.json`, JSON.stringify(R.dialog,null,1));
log('dialog: %s | fields %s', R.dialog.title.slice(0,60),
  JSON.stringify(R.dialog.fields.map(f=>f.tid||f.lab)).slice(0,400));
save();

// an inventory part is always linked to a catalogue part -- pick one first
R.pickCatalog={};
await typeInto('select_catalogue_part','FILTER');
R.pickCatalog.options = await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)
    .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).slice(0,6);}, VIS);
await page.evaluate(vis=>{const isVis=eval(vis);
  const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)[0]; if(o) o.click();}, VIS);
await page.waitForTimeout(3000);
log('catalogue part picked from %s', JSON.stringify(R.pickCatalog.options).slice(0,220));
// then a category, if it wants one
await page.evaluate(()=>{const c=document.querySelector('[data-test-id=select_category]'); if(c) c.click();});
await page.waitForTimeout(2500);
await page.evaluate(vis=>{const isVis=eval(vis);
  const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)[0]; if(o) o.click();}, VIS);
await page.waitForTimeout(2000);
// and clear the two price boxes, whatever the catalogue part put in them
for (const tid of ['input_cost','input_sell_price']){
  const el=await page.$(`[data-test-id="${tid}"]`); if(!el) continue;
  await el.click({timeout:5000}).catch(()=>{}); await el.fill('').catch(()=>{});
  await page.keyboard.press('Tab'); await page.waitForTimeout(1000);
}
await page.waitForTimeout(1500);
R.beforeSave = await dlgFields();
await page.screenshot({path:`${DIR}/evidence/BIG23-dialog.png`, fullPage:true}).catch(()=>{});
R.saveClicked = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return 'no dialog';
  const b=[...d.querySelectorAll('button')].filter(isVis).find(e=>/^(save|create|add)( & close)?$/i.test(t(e)));
  if(!b) return 'no save button: '+[...d.querySelectorAll('button')].filter(isVis).map(t).join(' | ');
  if(b.disabled) return 'greyed out'; b.click(); return 'clicked '+t(b);}, VIS);
await page.waitForTimeout(6000);
R.afterSave = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return {toasts:[...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(t),
    dialogStillOpen:!![...document.querySelectorAll('.q-dialog')].filter(isVis).length,
    fieldErrors:[...document.querySelectorAll('.q-field--error')].filter(isVis).map(t).slice(0,6)};}, VIS);
await page.screenshot({path:`${DIR}/evidence/BIG23-aftersave.png`, fullPage:true}).catch(()=>{});
log('save -> %s | %s', R.saveClicked, JSON.stringify(R.afterSave));
save();

const listNow = rowsOf((await call('GET','/api/inventory/parts?limit=200')).json);
R.inventoryNow = listNow.length;
const made = listNow.find(p=>!Number(p.purchase_price||0) && !Number(p.sell_price||0));
R.made = made && {pn:made.part_number, pp:made.purchase_price, sp:made.sell_price, id:made.id};
log('the part now on the system: %s', JSON.stringify(R.made));
save();

if (made && !Number(made.purchase_price||0) && !Number(made.sell_price||0)){
  await page.goto(`${APP}/workorders/${WO}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await settle(page,{label:'lines'});
  await page.evaluate(()=>{for(const b of document.querySelectorAll('[data-test-id^=button_line_expand_]'))
    if(/expand_more/.test(b.textContent||'')) b.click();});
  await page.waitForTimeout(3500);
  await page.evaluate(vis=>{const isVis=eval(vis);
    const b=[...document.querySelectorAll('[data-test-id=button_add_part]')].filter(isVis)[0];
    if(b){ b.scrollIntoView({block:'center'}); b.click(); }}, VIS);
  await page.waitForTimeout(4500);
  await typeInto('select_inline_part_number', made.part_number.slice(0,16));
  await page.waitForTimeout(4500);
  R.check = {options: await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)
      .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).slice(0,6);}, VIS)};
  if (R.check.options.length){
    await page.evaluate(vis=>{const isVis=eval(vis);
      const o=[...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)[0]; if(o) o.click();}, VIS);
    await page.waitForTimeout(4000);
    R.check.boxes = await page.evaluate(vis=>{const isVis=eval(vis);
      const g=t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return e&&isVis(e)?e.value:null;};
      return {pn:g('select_inline_part_number'), desc:g('input_inline_part_description'),
        qty:g('input_inline_part_quantity'), cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price')};}, VIS);
    const q=await page.$('[data-test-id="input_inline_part_quantity"]');
    if(q){ await q.click().catch(()=>{}); await page.keyboard.type('1',{delay:80}); }
    await page.waitForTimeout(1200);
    await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_inline_part]'); if(b) b.click();});
    await page.waitForTimeout(5000);
    R.check.afterSave = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
      return {toasts:[...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(t),
        rowStillOpen:!!document.querySelector('[data-test-id=select_inline_part_number]')};}, VIS);
  }
  await page.screenshot({path:`${DIR}/evidence/BIG23-c45060.png`, fullPage:true}).catch(()=>{});
  log('C45060 -> options %s | boxes %s | save %s', JSON.stringify(R.check.options).slice(0,150),
    JSON.stringify(R.check.boxes||null), JSON.stringify(R.check.afterSave||null));
  await page.keyboard.press('Escape');
}
// take the throwaway part away again
if (made){ const r = await call('POST','/api/inventory/parts/delete',{id:made.id, part_id:made.id});
  R.cleanup = r.status+' '+r.text.slice(0,100); log('throwaway part removed: %s', R.cleanup); }
save();
log('done');
await s.browser.close();
process.exit(0);
