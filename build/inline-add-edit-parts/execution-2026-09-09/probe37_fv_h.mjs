// Full View remainder: C45037 (qty required / part number optional) · C45054 (Requested + needs
// details) · C45055 (Create-as-new opens the modal with the typed text) · C45060 (cost/sell for a
// catalog part that has neither) · C45039 (cost read-only for an inventory part).
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
  await page.waitForTimeout(6000);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4200);};
const msgs=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...new Set([...document.querySelectorAll('.q-field__messages,.text-negative,[role=alert],.q-notification')]
    .filter(isVis).map(t).filter(Boolean))].filter(m=>!/Credit Hold|Build Lines|location_on|^\$|^%/.test(m));}, VIS);

// ---- C45037 : quantity required, part number optional
await fresh(); await openRow();
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST noqty');
await page.fill('[data-test-id=input_inline_part_cost]','2.00');
await page.fill('[data-test-id=input_inline_part_sell_price]','5.00');
await page.waitForTimeout(900);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(4500);
R.C45037_noQty = { qtyValue: await page.evaluate(()=>document.querySelector('[data-test-id=input_inline_part_quantity]')?.value),
                   messages: await msgs(), open: await page.evaluate(()=>!!document.querySelector('[data-test-id=input_inline_part_description]')) };
log('C45037 empty quantity:', JSON.stringify(R.C45037_noQty));
await page.fill('[data-test-id=input_inline_part_quantity]','1'); await page.waitForTimeout(700);
const before=await page.evaluate(()=>document.querySelectorAll('[data-test-id^=button_edit_part_]').length);
await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click());
await page.waitForTimeout(6000);
R.C45037_noPartNumber = { partsBefore:before, partsAfter: await page.evaluate(()=>document.querySelectorAll('[data-test-id^=button_edit_part_]').length),
                          toast: await page.evaluate(vis=>{const isVis=eval(vis);
                            return [...document.querySelectorAll('.q-notification')].filter(isVis).map(e=>(e.textContent||'').trim());}, VIS) };
log('C45037 saved with no part number:', JSON.stringify(R.C45037_noPartNumber));

// ---- C45054 : the Requested flag on the saved free-typed part (status column in the Parts tab)
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('[role=tab],.q-tab')].find(e=>/^Parts/.test(t(e)))?.click();});
await page.waitForTimeout(8000);
R.C45054_status = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hdr=[...document.querySelectorAll('thead th')].map(t);
  const si=hdr.findIndex(h=>/status/i.test(h));
  const rows=[...document.querySelectorAll('tbody tr')].map(r=>[...r.querySelectorAll('td')].map(t))
    .filter(r=>r.join(' ').includes('ZZAUTOTEST noqty')||r.join(' ').includes('ZZAUTOTEST requested flow'));
  return { statusColIndex:si, statuses:rows.map(r=>({desc:(r[1]||'').slice(0,46), status:si>=0?r[si]:null})) };});
log('C45054 statuses:', JSON.stringify(R.C45054_status));
await page.screenshot({path:`${DIR}/evidence/37-a-status.png`, fullPage:true});

// ---- C45055 : the Create-as-new action opens the modal carrying the typed text
await fresh(); await openRow();
await page.click('[data-test-id=select_inline_part_number]');
await page.keyboard.type('ZZNOMATCHPART', {delay:55});
await page.waitForTimeout(5000);
const clickedCreate = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const m=[...document.querySelectorAll('.q-menu')].pop(); if(!m) return 'no menu';
  const hit=[...m.querySelectorAll('*')].filter(e=>e.children.length===0&&/create .* as a new part/i.test(t(e)))[0];
  if(!hit) return 'no create option: '+t(m).slice(0,80);
  (hit.closest('[role=option],.q-item,div')||hit).click(); return 'clicked "'+t(hit).slice(0,50)+'"';});
log('C45055 create action:', clickedCreate);
await page.waitForTimeout(6000);
R.C45055 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(!d) return {modalOpen:false};
  const val=l=>{const i=[...d.querySelectorAll('input')].find(x=>{const p=x.closest('.q-field'); const q=p&&p.querySelector('.q-field__label'); return q&&new RegExp(l,'i').test(t(q));}); return i?i.value:null;};
  return { modalOpen:true, title:t(d.querySelector('.q-card__section,.text-h6')||d).slice(0,34),
           desc:val('^description$'), partNumber:val('^part number$') };}, VIS);
log('C45055 modal:', JSON.stringify(R.C45055));
await page.screenshot({path:`${DIR}/evidence/37-b-createnew.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/37-fv-h.json`, JSON.stringify(R,null,1));
await s.browser.close();
