// C45021 (Tech add) · C45035 (Tech edit) · C45061 (Full View add): the work order moves to a
// status that does not permit editing WHILE the row is open, then Save.
// The status move uses the recorded recipe POST /api/work-orders/change-status {id, status}
// (playbook §"Change work order status"). A SPARE work order is used, never the suite's own,
// and its original status is put back at the end.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const SUITE_WO='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
// ---------- pick a spare, editable work order ----------
const boss = await boot('sv9315','/workorders','admin');
R.pick = await boss.page.evaluate(async ({api, skip})=>{
  const r=await fetch(`https://${api}/api/work-orders?limit=100&page=1`,{headers:{Accept:'application/json'}, credentials:'include'});
  const j=await r.json(); const rows=j.collection||j.data||j.rows||[];
  const ok=['estimate','approved','in_progress','ready_for_review'];
  const cand=rows.filter(w=>w.id!==skip && ok.includes(String(w.status||w.status_name||'').toLowerCase().replace(/\s+/g,'_')));
  return {status:r.status, total:rows.length, sampleKeys:Object.keys(rows[0]||{}).slice(0,18),
    picks:cand.slice(0,5).map(w=>({id:w.id, num:w.number||w.work_order_number, status:w.status||w.status_name}))};
}, {api:boss.APIH, skip:SUITE_WO});
log('spare work orders:', JSON.stringify(R.pick).slice(0,700));
await boss.browser.close();
const WO = (R.pick.picks||[])[0];
if (!WO){ log('no spare editable work order found — stopping'); fs.writeFileSync(`${DIR}/evidence/58-noneditable.json`, JSON.stringify(R,null,1)); process.exit(0); }
log('using spare work order', WO.id, WO.num, WO.status);

const setStatus = (page, api, id, status)=>page.evaluate(async ({api,id,status})=>{
  const r=await fetch(`https://${api}/api/work-orders/change-status`,{method:'POST',
    headers:{'Content-Type':'application/json',Accept:'application/json'}, credentials:'include',
    body:JSON.stringify({id, status})});
  let b=null; try{ b=await r.text(); }catch(e){}
  return {status:r.status, body:(b||'').slice(0,200)};}, {api,id,status});

const leg = async (key, mode)=>{
  const s = await boot('sv9315','/workorders',key); const {page, APP, APIH}=s; const out={key, mode};
  await page.goto(`${APP}/workorders/${WO.id}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  if (mode==='edit'){
    out.opened = await page.evaluate(()=>{const e=document.querySelector('[data-test-id^=button_edit_part_]');
      if(!e) return 'no edit control'; e.scrollIntoView({block:'center'}); e.click(); return 'opened';});
    await page.waitForTimeout(6500);
    if (await page.$('[data-test-id=input_inline_part_quantity]')) await page.fill('[data-test-id=input_inline_part_quantity]','6');
  } else {
    out.opened = await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]');
      if(!b) return 'no add button'; b.scrollIntoView({block:'center'}); b.click(); return 'opened';});
    await page.waitForTimeout(4500);
    if (await page.$('[data-test-id=input_inline_part_description]')){
      await page.fill('[data-test-id=input_inline_part_description]',`ZZAUTOTEST noneditable ${key}`);
      await page.fill('[data-test-id=input_inline_part_quantity]','5');
      if (key==='admin' && await page.$('[data-test-id=input_inline_part_cost]')){
        await page.fill('[data-test-id=input_inline_part_cost]','2.00');
        await page.fill('[data-test-id=input_inline_part_sell_price]','5.00');
      }
    }
  }
  await page.waitForTimeout(1500);
  out.rowBefore = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    return d? {open:true, desc:d.value, qty:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value}:{open:false};});
  if (!out.rowBefore.open){ log('%s/%s: no row to work with (%s)', key, mode, out.opened); await s.browser.close(); return out; }
  out.moved = await setStatus(page, APIH, WO.id, 'complete');
  log('%s/%s status->complete: %s', key, mode, JSON.stringify(out.moved));
  await page.waitForTimeout(2500);
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(9000);
  out.toast = await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS);
  out.rowAfter = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    return d? {open:true, desc:d.value, qty:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value}:{open:false};});
  out.messages = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    return [...new Set([...document.querySelectorAll('.q-field__messages,.text-negative,[role=alert],.q-dialog')].filter(isVis).map(t).filter(Boolean))]
      .filter(m=>!/Credit Hold|Build Lines|location_on|^\$/.test(m));}, VIS);
  log('%s/%s toast=%s row=%s msgs=%s', key, mode, JSON.stringify(out.toast), JSON.stringify(out.rowAfter), JSON.stringify(out.messages).slice(0,300));
  await page.screenshot({path:`${DIR}/evidence/58-${key}-${mode}.png`, fullPage:true});
  // put the work order back
  out.restored = await setStatus(page, APIH, WO.id, String(WO.status||'approved').toLowerCase().replace(/\s+/g,'_'));
  log('%s/%s restored: %s', key, mode, JSON.stringify(out.restored));
  await s.browser.close();
  return out;
};
R.C45021 = await leg('tech','add');
R.C45035 = await leg('tech','edit');
R.C45061 = await leg('admin','add');
fs.writeFileSync(`${DIR}/evidence/58-noneditable.json`, JSON.stringify(R,null,1));
