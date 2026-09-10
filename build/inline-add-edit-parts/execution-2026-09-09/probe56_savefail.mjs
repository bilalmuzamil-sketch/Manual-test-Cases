// C45022 (Tech View) and C45062 (Full View): a save that fails for a reason OTHER than the work
// order becoming non-editable must show "Couldn't add the part. Please try again." and leave the
// row open with the typing intact. The failure is produced by cutting the save request off in
// flight - the case's own example is "the request cannot complete".
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
for (const key of ['tech','admin']){
  const s = await boot('sv9315','/workorders',key); const { page, APP } = s;
  const out={};
  await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
  await page.waitForTimeout(4500);
  const DESC = `ZZAUTOTEST savefail ${key}`;
  await page.fill('[data-test-id=input_inline_part_description]', DESC);
  await page.fill('[data-test-id=input_inline_part_quantity]','4');
  if (key==='admin'){
    await page.fill('[data-test-id=input_inline_part_cost]','3.00');
    await page.fill('[data-test-id=input_inline_part_sell_price]','6.00');
  }
  await page.waitForTimeout(1500);
  // cut off only the part-request write, nothing else
  const blocked=[];
  await page.route('**/*', route=>{
    const r=route.request();
    if (r.method()==='POST' && /part/i.test(r.url()) && !/quick-login|check-existing/i.test(r.url())){
      blocked.push(r.url().split('?')[0]); return route.abort('failed');
    }
    return route.continue();
  });
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(9000);
  out.blocked = [...new Set(blocked)];
  out.toast = await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-notification')].filter(isVis).map(n=>n.innerText.replace(/\s+/g,' ').trim());}, VIS);
  out.row = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    if(!d) return {open:false};
    let b=d; for(let i=0;i<9&&b.parentElement;i++){b=b.parentElement; if(b.querySelector('[data-test-id=button_save_inline_part]')) break;}
    return {open:true, desc:d.value, qty:b.querySelector('[data-test-id=input_inline_part_quantity]')?.value,
      cost:b.querySelector('[data-test-id=input_inline_part_cost]')?.value,
      sell:b.querySelector('[data-test-id=input_inline_part_sell_price]')?.value};});
  out.messages = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    return [...new Set([...document.querySelectorAll('.q-field__messages,.text-negative,[role=alert]')].filter(isVis).map(t).filter(Boolean))]
      .filter(m=>!/Credit Hold|Build Lines|location_on|^\$/.test(m));}, VIS);
  log('%s save-failure: blocked=%s toast=%s row=%s msgs=%s', key, JSON.stringify(out.blocked),
      JSON.stringify(out.toast), JSON.stringify(out.row), JSON.stringify(out.messages));
  await page.screenshot({path:`${DIR}/evidence/56-${key}-savefail.png`, fullPage:true});
  await page.unroute('**/*');
  R[key]=out;
  await s.browser.close();
}
fs.writeFileSync(`${DIR}/evidence/56-savefail.json`, JSON.stringify(R,null,1));
