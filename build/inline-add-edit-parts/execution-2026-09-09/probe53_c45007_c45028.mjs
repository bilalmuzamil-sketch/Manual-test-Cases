// C45007 (Tech View category: Uncategorized only when the part has none) and
// C45028 (cost, sell price and category preserved when a Tech View user saves an inline edit).
// Three phases: Full View seeds and reads -> Tech View edits -> Full View re-reads.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const mk = async (key)=>{
  const s = await boot('sv9315','/workorders',key); const {page, APP} = s;
  const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(9000);
    await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
    await page.waitForTimeout(7000);};
  return {s, page, APP, fresh};
};
const openEdit=(page,needle)=>page.evaluate(n=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&t(e)===n)[0];
  if(!hit) return 'row not found';
  let box=hit; for(let i=0;i<9&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id^=button_edit_part_]')) break;}
  const e=box.querySelector('[data-test-id^=button_edit_part_]'); if(!e) return 'no edit control';
  e.scrollIntoView({block:'center'}); e.click(); return 'opened';}, needle);
const readModal=(page)=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {modal:false};
  const val=lbl=>{const i=[...d.querySelectorAll('input')].find(x=>{const p=x.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l&&new RegExp(lbl,'i').test(t(l));}); return i?i.value:null;};
  return {modal:true, title:t(d.querySelector('.text-h6,.q-card__section')||d).slice(0,40),
    desc:val('^description$'), qty:val('^(qty|quantity)$'), cost:val('^cost$'), sell:val('^sell'),
    category:val('^category$'), source:val('^source$'), vendor:val('^vendor$')};}, VIS);

// ================= PHASE 1: Full View seeds a fully priced, categorised part =========
{
  const {s, page, fresh} = await mk('admin');
  await fresh();
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
  await page.waitForTimeout(4500);
  await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST c45028 base');
  await page.fill('[data-test-id=input_inline_part_quantity]','3');
  await page.fill('[data-test-id=input_inline_part_cost]','12.34');
  await page.fill('[data-test-id=input_inline_part_sell_price]','20.00');
  // pick a named category that is not Uncategorized
  await page.evaluate(()=>document.querySelector('[data-test-id=select_inline_part_category]')?.click());
  await page.waitForTimeout(3500);
  R.catPicked = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop(); if(!m) return 'no menu';
    const it=[...m.querySelectorAll('.q-item')].filter(isVis).find(x=>!/uncategor/i.test(t(x)));
    if(!it) return 'no non-default category'; const l=t(it); it.click(); return l;}, VIS);
  await page.waitForTimeout(2500);
  log('PHASE1 category picked:', R.catPicked);
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(8000);
  await page.screenshot({path:`${DIR}/evidence/53-a-seeded.png`, fullPage:true});
  await s.browser.close();
}
{ // read it back cleanly
  const {s, page, fresh} = await mk('admin');
  await fresh();
  R.open1 = await openEdit(page,'ZZAUTOTEST c45028 base'); await page.waitForTimeout(7000);
  R.before = await readModal(page);
  log('PHASE1 stored values:', R.open1, JSON.stringify(R.before));
  await s.browser.close();
}
// ================= PHASE 2: the Tech View user edits only the quantity ===============
{
  const {s, page, fresh} = await mk('tech');
  await fresh();
  R.open2 = await openEdit(page,'ZZAUTOTEST c45028 base'); await page.waitForTimeout(7000);
  R.techRow = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
    if(!d) return {open:false};
    let b=d; for(let i=0;i<9&&b.parentElement;i++){b=b.parentElement; if(b.querySelector('[data-test-id=button_save_inline_part]')) break;}
    return {open:true, desc:d.value, qty:b.querySelector('[data-test-id=input_inline_part_quantity]')?.value,
      hasCost:!!b.querySelector('[data-test-id=input_inline_part_cost]'),
      hasSell:!!b.querySelector('[data-test-id=input_inline_part_sell_price]'),
      hasCategory:!!b.querySelector('[data-test-id=select_inline_part_category]')};});
  log('PHASE2 tech edit row:', R.open2, JSON.stringify(R.techRow));
  if (R.techRow.open){
    await page.fill('[data-test-id=input_inline_part_quantity]','8'); await page.waitForTimeout(1500);
    await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
    await page.waitForTimeout(8000);
  }
  // C45007 clause 2: the tech adds a CATALOG part that carries its own category
  await fresh();
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
  await page.waitForTimeout(4500);
  await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type('A4731800909',{delay:110}); await page.waitForTimeout(7000);
  R.pickedCatalog = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return 'no menu';
    const it=[...m.querySelectorAll('.q-item')].filter(isVis)[0]; if(!it) return 'no item';
    const l=t(it).slice(0,60); it.click(); return l;}, VIS);
  await page.waitForTimeout(5500);
  await page.fill('[data-test-id=input_inline_part_quantity]','9'); await page.waitForTimeout(1200);
  await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
  await page.waitForTimeout(8000);
  log('PHASE2 catalog part added by tech:', R.pickedCatalog);
  await page.screenshot({path:`${DIR}/evidence/53-b-techadded.png`, fullPage:true});
  await s.browser.close();
}
// ================= PHASE 3: Full View re-reads =======================================
{
  const {s, page, fresh} = await mk('admin');
  await fresh();
  R.open3 = await openEdit(page,'ZZAUTOTEST c45028 base'); await page.waitForTimeout(7000);
  R.after = await readModal(page);
  log('PHASE3 after the tech edit:', R.open3, JSON.stringify(R.after));
  await page.screenshot({path:`${DIR}/evidence/53-c-after.png`, fullPage:true});
  await page.keyboard.press('Escape'); await page.waitForTimeout(3000);
  // Parts tab: the category column as the tester reads it
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('[role=tab],.q-tab')].find(e=>/^Parts/.test(t(e)))?.click();});
  await page.waitForTimeout(9000);
  R.partsTab = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const hdr=[...document.querySelectorAll('thead th')].map(t);
    const rows=[...document.querySelectorAll('tbody tr')].map(r=>[...r.querySelectorAll('td')].map(t))
      .filter(r=>/ZZAUTOTEST tv validation|ZZAUTOTEST c45028 base|A4731800909|OIL FILTER Detroit/i.test(r.join(' ')));
    return {hdr, rows:rows.slice(0,6)};});
  log('PHASE3 parts tab header:', JSON.stringify(R.partsTab.hdr));
  R.partsTab.rows.forEach(r=>log('   row:', JSON.stringify(r).slice(0,220)));
  await page.screenshot({path:`${DIR}/evidence/53-d-partstab.png`, fullPage:true});
  await s.browser.close();
}
fs.writeFileSync(`${DIR}/evidence/53-c45007-c45028.json`, JSON.stringify(R,null,1));
