// Two things at once.
// (a) C45252 retested properly. Probe 67's cost->sell leg ran with NO category set (its category
//     picker reported "no menu"), and probe 67's own C45253 leg proves the pricing matrix is applied
//     per category — so "the sell price did not move when I typed a cost" has to be re-run with a
//     category actually chosen before it means anything.
// (b) The work-order LINES endpoint, found by watching the network while the Lines tab loads.
//     Probes 65 and 72 both stalled on "no spare work order with lines" because neither
//     /api/work-orders/{id} nor /api/work-orders/{id}/lines carries them.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/75-c45252-lines.json`, JSON.stringify(R,null,1));
// ---- (b) watch every call the Lines tab makes
const seen=[];
page.on('response', r=>{ const u=r.url(); if (u.includes(APIH)) seen.push(`${r.status()} ${r.request().method()} ${u.replace('https://'+APIH,'').split('?')[0]}`); });
await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(12000);
R.linesTabCalls = [...new Set(seen)];
log('calls the Lines tab makes:'); R.linesTabCalls.forEach(c=>log('   '+c));
save();
// which of them actually returns line objects?
R.lineProbe = await page.evaluate(async ({api, paths, wo})=>{
  const pick=o=>{ for (const k of ['collection','data','rows','items','results','lines']){ if (Array.isArray(o&&o[k])) return o[k]; }
    if (Array.isArray(o)) return o; for (const k of Object.keys(o||{})){ const v=pick(o[k]); if (v&&v.length) return v; } return []; };
  const out=[];
  for (const p of paths){
    const url = p.replace('{wo}', wo);
    try{
      const r=await fetch(`https://${api}${url}`,{headers:{Accept:'application/json'}, credentials:'include'});
      if(!r.ok){ out.push({url, http:r.status}); continue; }
      const rows=pick(await r.json());
      out.push({url, http:200, n:rows.length, keys:rows[0]?Object.keys(rows[0]).slice(0,16):null,
        first:rows[0]?{id:rows[0].id, status:rows[0].status, name:(rows[0].name||rows[0].description||'').slice(0,30)}:null});
    }catch(e){ out.push({url, err:String(e).slice(0,60)}); }
  }
  return out;}, {api:APIH, wo:EST, paths:[
    '/api/work-orders/{wo}/lines', '/api/work-orders/lines?work_order_id={wo}',
    '/api/work-orders/{wo}/service-actions', '/api/work-orders/{wo}/work-order-lines',
    '/api/work-orders/lines/{wo}', '/api/work-orders/{wo}']});
R.lineProbe.forEach(x=>log('  line probe:', JSON.stringify(x).slice(0,220)));
save();
// ---- (a) C45252 with a category actually set, on a part whose cost can be typed
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4500);};
const vals=()=>page.evaluate(()=>{const g=t=>{const e=document.querySelector(`[data-test-id=${t}]`); return e? (e.value??''):null;};
  const cat=document.querySelector('[data-test-id=select_inline_part_category]');
  return {cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price'), qty:g('input_inline_part_quantity'),
    category: cat? (cat.value || (cat.closest('.q-field')?.innerText||'').replace(/\s+/g,' ').replace('expand_more','').replace(/^Category\s*/,'').trim()) : null};});
const chooseCat=async(name)=>{
  for (let attempt=0; attempt<3; attempt++){
    await page.evaluate(()=>document.querySelector('[data-test-id=select_inline_part_category]')?.click());
    await page.waitForTimeout(3500);
    const r = await page.evaluate(({vis,name})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
      const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop(); if(!m) return 'no menu';
      const it=[...m.querySelectorAll('.q-item')].filter(isVis).find(x=>t(x)===name);
      if(!it) return 'not found'; it.click(); return name;}, {vis:VIS, name});
    if (r===name){ await page.waitForTimeout(3000); return r; }
    await page.waitForTimeout(1500);
  }
  return 'failed';
};
for (const [tag, setup] of [
  ['free-typed', async()=>{ await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST c45252 retest');
                            await page.fill('[data-test-id=input_inline_part_quantity]','1'); }],
]){
  await fresh(); await openRow(); await setup();
  await page.waitForTimeout(1200);
  const cat = await chooseCat('AUTO-Batteries');
  const steps=[{stage:'category set', cat, ...(await vals())}];
  for (const c of ['40.00','90.00','150.00']){
    await page.fill('[data-test-id=input_inline_part_cost]', c);
    await page.keyboard.press('Tab'); await page.waitForTimeout(3500);
    steps.push({typed:c, ...(await vals())});
    log('C45252 [%s] cost %s -> sell %s (category %s)', tag, c, steps[steps.length-1].sell, steps[steps.length-1].category);
  }
  R.C45252 = steps;
  await page.screenshot({path:`${DIR}/evidence/75-a-c45252.png`, fullPage:true});
  save();
}
await s.browser.close();
