// Section 1 manual additions, Full View: C45252 (Cost -> Sell price via the pricing matrix),
// C45253 (Category -> Sell price) and C45254 (Cost not editable for an inventory part).
// Both the LIVE field value and the value actually STORED on save are recorded, because the
// two are not the same thing on this build.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const R={};
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4500);};
const vals=()=>page.evaluate(()=>{const v=t=>{const e=document.querySelector(`[data-test-id=${t}]`); return e?(e.value??e.innerText??'').trim():null;};
  const c=document.querySelector('[data-test-id=input_inline_part_cost]');
  return {desc:v('input_inline_part_description'), qty:v('input_inline_part_quantity'),
    cost:v('input_inline_part_cost'), sell:v('input_inline_part_sell_price'),
    category:(()=>{const e=document.querySelector('[data-test-id=select_inline_part_category]');
      return e? (e.value|| (e.closest('.q-field')?.innerText||'').replace(/\s+/g,' ').trim()) : null;})(),
    costEditable: c? !(c.disabled||c.readOnly) : null};});
const pickPart=async(term)=>{
  await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type(term,{delay:100}); await page.waitForTimeout(6500);
  return page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return 'no menu';
    const it=[...m.querySelectorAll('.q-item')].filter(isVis)[0]; if(!it) return 'no item';
    const l=t(it).slice(0,70); it.click(); return l;}, VIS);
};
const pickCategory=async(skip)=>{
  await page.evaluate(()=>document.querySelector('[data-test-id=select_inline_part_category]')?.click());
  await page.waitForTimeout(3000);
  return page.evaluate(({vis,skip})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop(); if(!m) return 'no menu';
    const its=[...m.querySelectorAll('.q-item')].filter(isVis);
    const it=its.find(x=>!skip.some(sk=>new RegExp(sk,'i').test(t(x)))); if(!it) return 'no item';
    const l=t(it); it.click(); return l;}, {vis:VIS, skip});
};

// ===== C45254: an INVENTORY part's Cost must not be editable ====================
await fresh(); await openRow();
R.C45254pick = await pickPart('A4731800909'); await page.waitForTimeout(5500);
R.C45254 = await vals();
log('C45254 picked %s -> %s', R.C45254pick, JSON.stringify(R.C45254));
if (R.C45254.costEditable){
  await page.fill('[data-test-id=input_inline_part_cost]','99.99').catch(()=>{});
  await page.waitForTimeout(1500);
  R.C45254after = await vals();
  log('C45254 after trying to type a cost:', JSON.stringify(R.C45254after));
}
await page.screenshot({path:`${DIR}/evidence/59-a-inventory-cost.png`, fullPage:true});

// ===== C45252: typing a Cost should fill the Sell price from the matrix =========
await fresh(); await openRow();
R.C45252pick = await pickPart('OIL'); await page.waitForTimeout(5500);
R.C45252start = await vals();
await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1200);
const steps=[];
for (const c of ['50.00','100.00','200.00']){
  const ed = await page.evaluate(()=>{const e=document.querySelector('[data-test-id=input_inline_part_cost]'); return e? !(e.disabled||e.readOnly):false;});
  if (!ed){ steps.push({cost:c, note:'cost field not editable for this part'}); break; }
  await page.fill('[data-test-id=input_inline_part_cost]', c);
  await page.keyboard.press('Tab'); await page.waitForTimeout(2500);
  steps.push({typed:c, ...(await vals())});
}
R.C45252 = steps;
log('C45252 cost->sell:', JSON.stringify(steps));
await page.screenshot({path:`${DIR}/evidence/59-b-cost-sell.png`, fullPage:true});

// ===== C45253: changing the Category should recalculate the Sell price ==========
const cats=[];
for (let i=0;i<3;i++){
  const label = await pickCategory(cats.map(c=>c.category).filter(Boolean).concat(['^$']));
  await page.waitForTimeout(3000);
  cats.push({picked:label, ...(await vals())});
  log('C45253 category "%s" -> sell %s', label, cats[cats.length-1].sell);
}
R.C45253 = cats;
await page.screenshot({path:`${DIR}/evidence/59-c-category-sell.png`, fullPage:true});

// ===== what the SAVE actually stores ===========================================
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST pricing check');
await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1200);
R.beforeSave = await vals();
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(9000);
await fresh();
R.stored = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/ZZAUTOTEST pricing check/.test(t(e)))[0];
  if(!hit) return {found:false};
  let box=hit; for(let i=0;i<10&&box.parentElement;i++){box=box.parentElement;
    if((box.innerText||'').split('\n').length>2 && box.querySelector('[data-test-id^=button_edit_part_]')) break;}
  return {found:true, row:(box.innerText||'').replace(/\s+/g,' ').trim().slice(0,200)};});
log('saved row:', JSON.stringify(R.beforeSave), '->', JSON.stringify(R.stored));
fs.writeFileSync(`${DIR}/evidence/59-pricing.json`, JSON.stringify(R,null,1));
await s.browser.close();
