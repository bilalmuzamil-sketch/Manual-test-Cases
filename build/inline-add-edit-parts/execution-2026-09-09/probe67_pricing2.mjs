// C45252 and C45253 redone properly. Probe 59's first attempt was inconclusive on both:
//  - C45252 picked an INVENTORY part, whose Cost field is locked, so no cost could be typed.
//  - C45253's category picker kept choosing the SAME category three times, so nothing was cycled —
//    but the one change it did make (HD-Filters -> Uncategorized) moved the sell price 63.32 -> 94.98,
//    which is the opposite of what the case's expect-fail note describes. That has to be settled.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/67-pricing2.json`, JSON.stringify(R,null,1));
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4500);};
const vals=()=>page.evaluate(()=>{const g=t=>{const e=document.querySelector(`[data-test-id=${t}]`); return e? (e.value??''):null;};
  const c=document.querySelector('[data-test-id=input_inline_part_cost]');
  const cat=document.querySelector('[data-test-id=select_inline_part_category]');
  return {cost:g('input_inline_part_cost'), sell:g('input_inline_part_sell_price'), qty:g('input_inline_part_quantity'),
    category: cat? (cat.value || (cat.closest('.q-field')?.innerText||'').replace(/\s+/g,' ').replace(/expand_more/,'').replace(/^Category\s*/,'').trim()) : null,
    costEditable: c? !(c.disabled||c.readOnly) : null};});
// list the category options once, by name, so distinct ones can be chosen deliberately
const catOptions=async()=>{
  await page.evaluate(()=>document.querySelector('[data-test-id=select_inline_part_category]')?.click());
  await page.waitForTimeout(3000);
  const list = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop(); if(!m) return [];
    return [...m.querySelectorAll('.q-item')].filter(isVis).map(t);}, VIS);
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
  return list;
};
const chooseCat=async(name)=>{
  await page.evaluate(()=>document.querySelector('[data-test-id=select_inline_part_category]')?.click());
  await page.waitForTimeout(3000);
  const r = await page.evaluate(({vis,name})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop(); if(!m) return 'no menu';
    const it=[...m.querySelectorAll('.q-item')].filter(isVis).find(x=>t(x)===name);
    if(!it) return 'not found: '+name; it.click(); return name;}, {vis:VIS, name});
  await page.waitForTimeout(3000);
  return r;
};

// ===== C45252: a part whose Cost CAN be typed — free-typed (special order / vendor) =====
await fresh(); await openRow();
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST c45252 cost-sell');
await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(1200);
R.catOptions = await catOptions();
log('category options:', JSON.stringify(R.catOptions).slice(0,400));
R.c45252cat = await chooseCat((R.catOptions.find(c=>!/uncategor/i.test(c)) || R.catOptions[0]));
log('C45252 category set to:', R.c45252cat);
R.c45252 = [{stage:'before any cost', ...(await vals())}];
for (const c of ['50.00','100.00','200.00']){
  await page.fill('[data-test-id=input_inline_part_cost]', c);
  await page.keyboard.press('Tab'); await page.waitForTimeout(3000);
  R.c45252.push({typed:c, ...(await vals())});
  log('  cost %s -> sell %s', c, R.c45252[R.c45252.length-1].sell);
}
await page.screenshot({path:`${DIR}/evidence/67-a-c45252.png`, fullPage:true}); save();

// ===== C45253: cycle DISTINCT categories on a part that has a cost ================
await fresh(); await openRow();
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST c45253 category-sell');
await page.fill('[data-test-id=input_inline_part_quantity]','1');
await page.fill('[data-test-id=input_inline_part_cost]','40.00');
await page.keyboard.press('Tab'); await page.waitForTimeout(3000);
R.c45253 = [{stage:'cost 40.00, before any category change', ...(await vals())}];
const wanted = (R.catOptions||[]).slice(0,5);
for (const name of wanted){
  const picked = await chooseCat(name);
  R.c45253.push({picked, ...(await vals())});
  log('  category "%s" -> sell %s (cost %s)', picked, R.c45253[R.c45253.length-1].sell, R.c45253[R.c45253.length-1].cost);
}
await page.screenshot({path:`${DIR}/evidence/67-b-c45253.png`, fullPage:true}); save();

// ===== C45254: confirm the sell price IS still settable on an inventory part =====
await fresh(); await openRow();
await page.click('[data-test-id=select_inline_part_number]');
await page.keyboard.type('A4731800909',{delay:100}); await page.waitForTimeout(6500);
R.c45254pick = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return 'no menu';
  const it=[...m.querySelectorAll('.q-item')].filter(isVis)[0]; if(!it) return 'no item';
  const l=t(it).slice(0,60); it.click(); return l;}, VIS);
await page.waitForTimeout(5500);
R.c45254 = {picked:R.c45254pick, initial: await vals()};
R.c45254.sellEditable = await page.evaluate(()=>{const e=document.querySelector('[data-test-id=input_inline_part_sell_price]');
  return e? !(e.disabled||e.readOnly) : null;});
if (R.c45254.sellEditable){
  await page.fill('[data-test-id=input_inline_part_sell_price]','88.88'); await page.waitForTimeout(2000);
  R.c45254.afterSell = await vals();
}
// and prove the cost really refuses a keystroke, not just that the flag says so
await page.click('[data-test-id=input_inline_part_cost]').catch(()=>{});
await page.keyboard.type('12345',{delay:80}); await page.waitForTimeout(1500);
R.c45254.afterTypingCost = await vals();
log('C45254:', JSON.stringify(R.c45254));
await page.screenshot({path:`${DIR}/evidence/67-c-c45254.png`, fullPage:true}); save();
await s.browser.close();
