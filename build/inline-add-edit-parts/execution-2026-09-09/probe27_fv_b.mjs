// Full View batch B: C45047 via X and Escape · C45048 (Enter saves) · C45049 (Shift+Enter opens
// the modal) · C45043 (save puts the part on top, toast, fresh row with cursor in description).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const R={};
const openRow = async () => {
  await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(10000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(6500);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
  await page.waitForTimeout(4500);
};
const fill = async (d,q,c,sp) => {
  await page.fill('[data-test-id=input_inline_part_description]', d);
  await page.fill('[data-test-id=input_inline_part_quantity]', q);
  await page.fill('[data-test-id=input_inline_part_cost]', c).catch(()=>{});
  await page.fill('[data-test-id=input_inline_part_sell_price]', sp).catch(()=>{});
  await page.waitForTimeout(1200);
};
const rowVals = () => page.evaluate(()=>{const g=t=>document.querySelector(`[data-test-id=${t}]`)?.value;
  return {d:g('input_inline_part_description'), q:g('input_inline_part_quantity'),
          c:g('input_inline_part_cost'), s:g('input_inline_part_sell_price'),
          open:!!document.querySelector('[data-test-id=input_inline_part_description]')};});
const dlgCount = () => page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-dialog')].filter(isVis).length;}, VIS);

// ---- C45047 route 1: the X on the modal
await openRow(); await fill('ZZAUTOTEST cancel-X','4','5.00','9.00');
await page.evaluate(()=>document.querySelector('[data-test-id=button_more_options_inline_part]')?.click());
await page.waitForTimeout(5500);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const q=[...d.querySelectorAll('input')].find(i=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l&&/quantity/i.test(t(l));});
  if(q){q.focus(); q.value='77'; q.dispatchEvent(new Event('input',{bubbles:true}));}
  const x=[...d.querySelectorAll('button')].find(b=>/^close$/i.test(t(b))); if(x) x.click();});
await page.waitForTimeout(5000);
R.C45047_X = { dialogs: await dlgCount(), ...(await rowVals()),
               confirmation: await page.evaluate(()=>/Discard this part|will be lost/i.test(document.body.innerText||'')) };
log('C45047 via X   :', JSON.stringify(R.C45047_X));

// ---- C45047 route 2: Escape
await page.evaluate(()=>document.querySelector('[data-test-id=button_more_options_inline_part]')?.click());
await page.waitForTimeout(5500);
await page.keyboard.press('Escape'); await page.waitForTimeout(4500);
R.C45047_Esc = { dialogs: await dlgCount(), ...(await rowVals()),
                 confirmation: await page.evaluate(()=>/Discard this part|will be lost/i.test(document.body.innerText||'')) };
log('C45047 via Esc :', JSON.stringify(R.C45047_Esc));
await page.screenshot({path:`${DIR}/evidence/27-a-cancel-routes.png`, fullPage:true});

// ---- C45049 : Shift+Enter opens the modal
await page.click('[data-test-id=input_inline_part_description]');
await page.keyboard.press('Shift+Enter'); await page.waitForTimeout(5000);
R.C45049 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  return { modalOpen:!!d, title: d? t(d.querySelector('.q-card__section,.text-h6')||d).slice(0,40):null };}, VIS);
log('C45049 Shift+Enter:', JSON.stringify(R.C45049));
if (R.C45049.modalOpen) { await page.keyboard.press('Escape'); await page.waitForTimeout(4000); }

// ---- C45048 + C45043 : Enter saves; part on top; toast; fresh row focused in description
const before = await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_edit_part_]')].length);
await page.click('[data-test-id=input_inline_part_description]');
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST enter-save');
await page.fill('[data-test-id=input_inline_part_quantity]','2');
await page.fill('[data-test-id=input_inline_part_cost]','3.00').catch(()=>{});
await page.fill('[data-test-id=input_inline_part_sell_price]','7.00').catch(()=>{});
await page.waitForTimeout(1200);
await page.click('[data-test-id=input_inline_part_quantity]');
await page.keyboard.press('Enter');
await page.waitForTimeout(7000);
R.C45048_43 = await page.evaluate(([vis,before])=>{
  const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const toast=[...document.querySelectorAll('.q-notification,[role=alert]')].filter(isVis).map(e=>t(e)).slice(0,3);
  const parts=[...document.querySelectorAll('[data-test-id^=button_edit_part_]')];
  const desc=document.querySelector('[data-test-id=input_inline_part_description]');
  // is our new part the FIRST part row?
  const rows=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/ZZAUTOTEST enter-save/.test(t(e)));
  const firstY=parts.length? Math.min(...parts.map(p=>p.getBoundingClientRect().top+scrollY)):null;
  const ourY=rows.length? rows[0].getBoundingClientRect().top+scrollY : null;
  return { editControlsBefore:before, editControlsAfter:parts.length, toast,
           freshRowOpen:!!desc, freshRowEmpty: desc? desc.value==='':null,
           cursorInDescription: document.activeElement===desc,
           ourPartFound:rows.length>0, ourPartY:ourY, topPartY:firstY };
}, [VIS, before]);
log('C45048/C45043:', JSON.stringify(R.C45048_43));
await page.screenshot({path:`${DIR}/evidence/27-b-after-enter-save.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/27-fv-b.json`, JSON.stringify(R,null,1));
await s.browser.close();
