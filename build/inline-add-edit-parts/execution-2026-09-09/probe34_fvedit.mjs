// Full View Edit: C45063 (modal opens pre-populated) · C45064 (no inline edit row) ·
// C45065 (save updates the line, modal closes, no inline row) · C45067 (cancel discards changes) ·
// C45068 (guard fires first when an add row is open). Screenshots kept for the defect pack.
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
const modal=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  if(!d) return {open:false};
  const val=l=>{const i=[...d.querySelectorAll('input')].find(x=>{const p=x.closest('.q-field'); const q=p&&p.querySelector('.q-field__label'); return q&&new RegExp(l,'i').test(t(q));}); return i?i.value:null;};
  return { open:true, title:t(d.querySelector('.q-card__section,.text-h6')||d).slice(0,40),
    desc:val('^description$'), qty:val('^quantity$'), cost:val('^cost$'), sell:val('^sell price$'),
    buttons:[...d.querySelectorAll('button')].map(b=>t(b).slice(0,18)) };}, VIS);

await fresh();
// ---- C45063 + C45064 : Edit opens the modal pre-populated; no inline edit row appears
const first = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const e=document.querySelector('[data-test-id^=button_edit_part_]'); if(!e) return null;
  let row=e.closest('tr')||e.parentElement.parentElement;
  const txt=t(row).slice(0,90); e.scrollIntoView({block:'center'}); e.click(); return txt;});
log('edited part row:', (first||'').slice(0,70));
await page.waitForTimeout(6500);
R.C45063 = await modal();
R.C45064 = { inlineEditRowOpen: await page.evaluate(()=>!!document.querySelector('[data-test-id=input_inline_part_description]')) };
log('C45063 modal:', JSON.stringify(R.C45063));
log('C45064 inline edit row present?', JSON.stringify(R.C45064));
await page.screenshot({path:`${DIR}/evidence/34-a-edit-modal.png`, fullPage:true});

// ---- C45067 : change something, cancel via X, confirm the part line is unchanged
const origQty = R.C45063.qty;
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const q=[...d.querySelectorAll('input')].find(i=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l&&/^quantity$/i.test(t(l));});
  if(q){q.focus(); q.value='55'; q.dispatchEvent(new Event('input',{bubbles:true}));}});
await page.waitForTimeout(1200);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  [...d.querySelectorAll('button')].find(b=>/^close$/i.test(t(b)))?.click();});
await page.waitForTimeout(5500);
R.C45067 = await page.evaluate(([vis,orig,rowTxt])=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const e=document.querySelector('[data-test-id^=button_edit_part_]');
  const row=e? (e.closest('tr')||e.parentElement.parentElement):null;
  return { dialogsOpen:[...document.querySelectorAll('.q-dialog')].filter(isVis).length,
           rowTextNow: row? t(row).slice(0,90):null, rowTextBefore: rowTxt,
           unchanged: row? t(row).slice(0,90)===rowTxt : null, originalQty:orig };}, [VIS, origQty, first]);
log('C45067 after cancelling:', JSON.stringify(R.C45067));
await page.screenshot({path:`${DIR}/evidence/34-b-after-cancel.png`, fullPage:true});

// ---- C45065 : reopen, change quantity, Save part -> line updated, modal closed, no inline row
await fresh();
await page.evaluate(()=>{const e=document.querySelector('[data-test-id^=button_edit_part_]'); e.scrollIntoView({block:'center'}); e.click();});
await page.waitForTimeout(6500);
const before65 = await modal();
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const q=[...d.querySelectorAll('input')].find(i=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l&&/^quantity$/i.test(t(l));});
  if(q){q.focus(); q.value='9'; q.dispatchEvent(new Event('input',{bubbles:true})); q.dispatchEvent(new Event('change',{bubbles:true}));}});
await page.waitForTimeout(1500);
const sv = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const b=[...d.querySelectorAll('button')].find(x=>/save part/i.test(t(x)));
  if(!b) return 'no Save part'; if(b.disabled) return 'DISABLED'; b.click(); return 'clicked';});
log('C45065 Save part ->', sv, '| qty was', before65.qty);
await page.waitForTimeout(9000);
R.C45065 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis);
  return { dialogsOpen:d.length, dialogText:d.map(x=>t(x).slice(0,110)),
    inlineRowOpen:!!document.querySelector('[data-test-id=input_inline_part_description]'),
    toast:[...document.querySelectorAll('.q-notification')].filter(isVis).map(t),
    validationMsgs:[...new Set([...document.querySelectorAll('.q-field__messages,.text-negative')].filter(isVis).map(t).filter(Boolean))].slice(0,6) };}, VIS);
log('C45065:', JSON.stringify(R.C45065));
await page.screenshot({path:`${DIR}/evidence/34-c-modal-save.png`, fullPage:true});

// ---- C45068 : with an add row open and populated, pressing Edit must show the guard first
await fresh();
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
await page.waitForTimeout(4500);
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST edit-guard');
await page.waitForTimeout(1000);
await page.evaluate(()=>{const e=document.querySelector('[data-test-id^=button_edit_part_]'); e.scrollIntoView({block:'center'}); e.click();});
await page.waitForTimeout(5500);
R.C45068 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis);
  return { guardShown:/Discard this part\?/i.test(document.body.innerText||''),
    dialogTexts:d.map(x=>t(x).slice(0,90)),
    partModalOpen:/New Part Request|Edit Part Request/.test(d.map(x=>t(x)).join(' ')),
    addRowStillOpen:!!document.querySelector('[data-test-id=input_inline_part_description]') };}, VIS);
log('C45068:', JSON.stringify(R.C45068));
await page.screenshot({path:`${DIR}/evidence/34-d-edit-guard.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/34-fvedit.json`, JSON.stringify(R,null,1));
await s.browser.close();
