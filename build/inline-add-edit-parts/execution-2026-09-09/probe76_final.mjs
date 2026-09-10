// The last gaps.
//  (a) C45001 clause 3 — after an inline part request is saved, description, cost, core charge and
//      vendor become read-only, and a vendor that was never set stays empty and read-only.
//      Uses a CATALOG part (card reads "Catalog"), whose fields are editable before the save, so the
//      change after the save is actually visible.
//  (b) C45062 — the Full View half of the save-failure path. Probe 62 crashed after its two Tech
//      legs, so the admin legs were never run.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/76-final.json`, JSON.stringify(R,null,1));

// ============ (a) C45001 clause 3 ============
{
  const s = await boot('sv9315','/workorders','admin'); const {page, APP, APIH}=s;
  const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(9000);
    await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
    await page.waitForTimeout(7000);};
  const pn = await page.evaluate(async ({api})=>{
    const pick=o=>{ for (const k of ['collection','data','rows','items','results']){ if (Array.isArray(o&&o[k])) return o[k]; }
      if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; };
    const r=await fetch(`https://${api}/api/parts-catalogue/catalogue-parts-that-are-not-on-location?pagination[rowsPerPage]=10&pagination[page]=1`,
      {headers:{Accept:'application/json'}, credentials:'include'});
    const rows=pick(await r.json()); return rows.length? (rows[0].partNumber||rows[0].part_number) : null;}, {api:APIH});
  R.catalogPn = pn; log('catalog part:', pn);
  const DESC = 'ZZAUTOTEST c45001 after-save';
  await fresh();
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
  await page.waitForTimeout(4500);
  await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type(pn,{delay:100}); await page.waitForTimeout(6500);
  R.card = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return 'no menu';
    const it=[...m.querySelectorAll('.q-item')].filter(isVis)[0]; if(!it) return 'no item';
    const l=t(it).slice(0,120); it.click(); return l;}, VIS);
  await page.waitForTimeout(5500);
  R.beforeSave = await page.evaluate(()=>{const g=t=>{const e=document.querySelector(`[data-test-id=${t}]`);
      return e? {value:e.value, editable:!(e.disabled||e.readOnly)} : null;};
    return {desc:g('input_inline_part_description'), cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price')};});
  await page.fill('[data-test-id=input_inline_part_description]', DESC);
  await page.fill('[data-test-id=input_inline_part_quantity]','1');
  await page.fill('[data-test-id=input_inline_part_cost]','14.00');
  await page.fill('[data-test-id=input_inline_part_sell_price]','28.00');
  await page.waitForTimeout(1500);
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(9000);
  R.saveToast = await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS);
  log('saved:', JSON.stringify(R.saveToast));
  // re-open the saved part and read the four fields
  await fresh();
  R.reopen = await page.evaluate(async ({vis, desc})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&t(e)===desc)[0];
    if(!hit) return {found:false};
    let box=hit; for(let i=0;i<9&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id^=button_edit_part_]')) break;}
    const e=box.querySelector('[data-test-id^=button_edit_part_]'); if(!e) return {found:true, noEdit:true};
    e.scrollIntoView({block:'center'}); e.click();
    await new Promise(r=>setTimeout(r,7000));
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
    if(!d) return {found:true, modal:false};
    const val=lbl=>{const f=[...d.querySelectorAll('.q-field')].find(x=>{const l=x.querySelector('.q-field__label'); return l&&new RegExp('^'+lbl,'i').test(t(l));});
      if(!f) return null; const i=f.querySelector('input'); return i? {value:i.value, editable:!(i.disabled||i.readOnly)} : {value:t(f).slice(0,30), editable:null};};
    return {found:true, modal:true, desc:val('description'), cost:val('cost'), core:val('core'),
            vendor:val('vendor'), sell:val('sell'), source:val('source')};}, {vis:VIS, desc:DESC});
  log('C45001 clause 3 — before save: %s', JSON.stringify(R.beforeSave));
  log('C45001 clause 3 — after save : %s', JSON.stringify(R.reopen));
  await page.screenshot({path:`${DIR}/evidence/76-a-aftersave.png`, fullPage:true});
  save();
  await s.browser.close();
}
// ============ (b) C45062, the Full View save-failure legs ============
const ENDPOINT=/work-orders\/part\/make-request/;
for (const mode of ['abort','500','control']){
  const s = await boot('sv9315','/workorders','admin'); const {page, APP}=s; const out={mode};
  await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  const count=()=>page.evaluate(()=>document.querySelectorAll('[data-test-id^=button_edit_part_]').length);
  out.before = await count();
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
  await page.waitForTimeout(4500);
  const DESC=`ZZAUTOTEST c45062-${mode}`;
  await page.fill('[data-test-id=input_inline_part_description]', DESC);
  await page.fill('[data-test-id=input_inline_part_quantity]','4');
  if (await page.$('[data-test-id=input_inline_part_cost]')) await page.fill('[data-test-id=input_inline_part_cost]','3.00');
  if (await page.$('[data-test-id=input_inline_part_sell_price]')) await page.fill('[data-test-id=input_inline_part_sell_price]','6.00');
  await page.waitForTimeout(1500);
  const hits=[];
  if (mode!=='control'){
    await page.route('**/*', route=>{ const r=route.request();
      if (r.method()==='POST' && ENDPOINT.test(r.url())){ hits.push(r.url().split('?')[0]);
        return mode==='abort' ? route.abort('failed')
          : route.fulfill({status:500, contentType:'application/json', body:JSON.stringify({message:'Internal Server Error'})}); }
      return route.continue(); });
  }
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(10000);
  out.intercepted=[...new Set(hits)];
  out.toast = await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS);
  out.row = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    return d? {open:true, desc:d.value, qty:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value}:{open:false};});
  await page.screenshot({path:`${DIR}/evidence/76-c45062-${mode}.png`, fullPage:true});
  await page.unroute('**/*');
  await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  out.persisted = await page.evaluate(n=>new RegExp(n).test(document.body.innerText||''), DESC);
  out.countAfterReload = await count();
  log('C45062 %s | intercepted=%s toast=%s row=%s | parts %d -> %d persisted=%s', mode,
      JSON.stringify(out.intercepted), JSON.stringify(out.toast), JSON.stringify(out.row),
      out.before, out.countAfterReload, out.persisted);
  R[`C45062_${mode}`]=out; save();
  await s.browser.close();
}
