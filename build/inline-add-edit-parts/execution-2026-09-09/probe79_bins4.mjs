// The last Bin Allocation gaps.
//  C45235 cl.1 — a bin already at a negative quantity, shown in the BIN LOCATIONS MODAL (probe 77
//                captured the picker, not the modal, and judged styling from class names, which has
//                already produced one false alarm this pass — a screenshot is taken here).
//  C45232 cl.3 — for a Full View user WITH See Financial Data, "Split across bins…" should open the
//                PART DETAILS modal, not Bin Locations. (Clause 2, Full View WITHOUT that permission,
//                is blocked by build/BLOCKED-sv9315-role-save.md.)
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const NEGATIVE='POI5177C';   // one bin, already at -1
const STOCKED='20047';       // one bin "Unassigned", 6 on hand
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const save=()=>fs.writeFileSync(`${DIR}/evidence/79-bins4.json`, JSON.stringify(R,null,1));
const run = async (key, pn, tag)=>{
  const s = await boot('sv9315','/workorders',key); const {page, APP}=s; const out={key, pn};
  await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(7000);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
  await page.waitForTimeout(4500);
  await page.click('[data-test-id=select_inline_part_number]');
  await page.keyboard.type(pn,{delay:100}); await page.waitForTimeout(6500);
  out.card = await page.evaluate(({vis,pn})=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-select__dialog')].filter(isVis).pop(); if(!m) return 'no menu';
    const its=[...m.querySelectorAll('.q-item')].filter(isVis); if(!its.length) return 'no items';
    const i=its.findIndex(x=>t(x).includes(pn)); const target=its[i>=0?i:0];
    const l=t(target).slice(0,110); target.click(); return l;}, {vis:VIS, pn});
  await page.waitForTimeout(5500);
  await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(3000);
  // open the chip's picker, then Split across bins
  await page.evaluate(()=>document.querySelector('[data-test-id=button_pulled_from_bin]')?.click());
  await page.waitForTimeout(3800);
  out.split = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const m=[...document.querySelectorAll('.q-menu,.q-dialog')].filter(isVis).pop(); if(!m) return 'no picker';
    const it=[...m.querySelectorAll('.q-item')].filter(isVis).find(x=>/split across bins/i.test(t(x)));
    if(!it) return 'no split action'; it.click(); return 'clicked';}, VIS);
  await page.waitForTimeout(7000);
  out.modal = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return {open:false};
    // colour is read from the COMPUTED style, not the class name
    const coloured=[...d.querySelectorAll('*')].filter(e=>e.children.length===0&&isVis(e)).map(e=>{
      const c=getComputedStyle(e); return {txt:t(e).slice(0,26), colour:c.color};}).filter(x=>x.txt);
    return {open:true, title:t(d.querySelector('.text-h6,.q-card__section')||d).slice(0,50),
      buttons:[...d.querySelectorAll('button,.q-btn')].filter(isVis).map(t),
      text:(d.innerText||'').replace(/\s+/g,' ').trim().slice(0,320),
      colours:coloured.slice(0,14)};}, VIS);
  log('%s / %s -> split=%s', key, pn, out.split);
  log('   modal: %s', JSON.stringify({title:out.modal.title, buttons:out.modal.buttons, text:out.modal.text}).slice(0,420));
  if (out.modal.colours) out.modal.colours.forEach(c=>log('     "%s"  %s', c.txt, c.colour));
  await page.screenshot({path:`${DIR}/evidence/79-${tag}.png`, fullPage:true});
  await s.browser.close();
  return out;
};
R.C45235 = await run('tech', NEGATIVE, 'a-negative-modal'); save();
R.C45232_cl3 = await run('admin', STOCKED, 'b-fullview-split'); save();
