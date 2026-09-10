// Follow-ups: C45026 (edit saved the NEW quantity in place) · C45007 / C45028 (what a Full View
// user sees for the category and the money on parts the Tech View user added and edited).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const R={};
await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
await page.waitForTimeout(7000);
const rowFor=(needle)=>page.evaluate(n=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&t(e)===n)[0];
  if(!hit) return null;
  let box=hit; for(let i=0;i<12&&box.parentElement;i++){ box=box.parentElement;
    if((box.innerText||'').split('\n').length>3 && box.querySelector('[data-test-id^=button_edit_part_]')) break; }
  return (box.innerText||'').replace(/\s+/g,' ').trim().slice(0,220);}, needle);
for (const n of ['ZZAUTOTEST tv validation','ZZAUTOTEST tv enter save','ZZAUTOTEST tv duplicate']){
  R[n] = await rowFor(n); log('%s -> %s', n, R[n]);
}
await page.screenshot({path:`${DIR}/evidence/51-a-fullview-rows.png`, fullPage:true});
// open the part details for the Tech-View-added part: category and money as Full View sees them
R.detail = await page.evaluate(async vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&t(e)==='ZZAUTOTEST tv validation')[0];
  if(!hit) return {err:'not found'};
  let box=hit; for(let i=0;i<9&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id^=button_edit_part_]')) break;}
  const e=box.querySelector('[data-test-id^=button_edit_part_]'); if(!e) return {err:'no edit control'};
  e.scrollIntoView({block:'center'}); e.click();
  await new Promise(r=>setTimeout(r,6500));
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(!d){ // Full View may open an inline row instead
    const desc=document.querySelector('[data-test-id=input_inline_part_description]');
    if(!desc) return {err:'nothing opened'};
    let bx=desc; for(let i=0;i<9&&bx.parentElement;i++){bx=bx.parentElement; if(bx.querySelector('[data-test-id=button_save_inline_part]')) break;}
    const v=tid=>{const i=bx.querySelector(`[data-test-id=${tid}]`); return i? (i.value||i.innerText||'').trim():null;};
    return {kind:'inline', desc:v('input_inline_part_description'), qty:v('input_inline_part_quantity'),
      cost:v('input_inline_part_cost'), sell:v('input_inline_part_sell_price'), category:v('select_inline_part_category')};
  }
  const val=lbl=>{const i=[...d.querySelectorAll('input')].find(x=>{const p=x.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l&&new RegExp(lbl,'i').test(t(l));}); return i?i.value:null;};
  return {kind:'modal', title:t(d.querySelector('.text-h6,.q-card__section')||d).slice(0,50),
    desc:val('^description$'), qty:val('^(qty|quantity)$'), cost:val('^cost$'),
    sell:val('^sell'), category:val('^category$'), source:val('^source$')};}, VIS);
log('C45007/C45028 Full View detail:', JSON.stringify(R.detail));
await page.screenshot({path:`${DIR}/evidence/51-b-detail.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/51-after.json`, JSON.stringify(R,null,1));
await s.browser.close();
