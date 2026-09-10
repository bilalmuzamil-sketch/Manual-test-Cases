// C45022 / C45062, properly pinned. Probe 56 cut the save request off and saw NO toast and the row
// CLOSED. Before that is called, three things are established:
//   (a) a network failure (route.abort) — repeated, and the parts list checked afterwards
//   (b) a server error (HTTP 500 on the same endpoint) — the more usual "save failed"
//   (c) a control: the same flow with nothing intercepted, to prove the harness is not the cause
// The part list count before/after says whether the part was really added.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const ENDPOINT=/work-orders\/part\/make-request/;
async function leg(key, mode, tag){
  const s = await boot('sv9315','/workorders',key); const {page, APP}=s; const out={key, mode};
  await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  const count=()=>page.evaluate(()=>document.querySelectorAll('[data-test-id^=button_edit_part_]').length);
  out.before = await count();
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
  await page.waitForTimeout(4500);
  const DESC=`ZZAUTOTEST ${tag}`;
  await page.fill('[data-test-id=input_inline_part_description]', DESC);
  await page.fill('[data-test-id=input_inline_part_quantity]','4');
  if (key==='admin'){
    if (await page.$('[data-test-id=input_inline_part_cost]')) await page.fill('[data-test-id=input_inline_part_cost]','3.00');
    if (await page.$('[data-test-id=input_inline_part_sell_price]')) await page.fill('[data-test-id=input_inline_part_sell_price]','6.00');
  }
  await page.waitForTimeout(1500);
  const hits=[];
  if (mode!=='control'){
    await page.route('**/*', route=>{
      const r=route.request();
      if (r.method()==='POST' && ENDPOINT.test(r.url())){
        hits.push(r.url().split('?')[0]);
        if (mode==='abort') return route.abort('failed');
        return route.fulfill({status:500, contentType:'application/json',
          body:JSON.stringify({message:'Internal Server Error'})});
      }
      return route.continue();
    });
  }
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(10000);
  out.intercepted = [...new Set(hits)];
  out.toast = await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS);
  out.row = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    return d? {open:true, desc:d.value, qty:document.querySelector('[data-test-id=input_inline_part_quantity]')?.value}:{open:false};});
  out.countAfterSave = await count();
  out.presentOnScreen = await page.evaluate(n=>new RegExp(n).test(document.body.innerText||''), DESC);
  await page.screenshot({path:`${DIR}/evidence/62-${tag}.png`, fullPage:true});
  await page.unroute('**/*');
  // reload with nothing intercepted: was the part actually written?
  await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  out.countAfterReload = await count();
  out.persisted = await page.evaluate(n=>new RegExp(n).test(document.body.innerText||''), DESC);
  log('%s | %s | intercepted=%s toast=%s row=%s parts %d->%d (reload %d) persisted=%s',
      key, mode, JSON.stringify(out.intercepted), JSON.stringify(out.toast), JSON.stringify(out.row),
      out.before, out.countAfterSave, out.countAfterReload, out.persisted);
  await s.browser.close();
  return out;
}
R.tech_abort  = await leg('tech','abort','c45022-abort');
R.tech_500    = await leg('tech','500','c45022-500');
R.tech_ctrl   = await leg('tech','control','c45022-control');
R.admin_abort = await leg('admin','abort','c45062-abort');
R.admin_500   = await leg('admin','500','c45062-500');
fs.writeFileSync(`${DIR}/evidence/62-savefail2.json`, JSON.stringify(R,null,1));
