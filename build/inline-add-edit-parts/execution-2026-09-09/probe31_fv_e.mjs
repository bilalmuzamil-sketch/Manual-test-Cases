// Full View batch E: C45058 (bad cost/sell rejected by field) · C45059 (sell below cost = note, still
// saves) · C45057 (More Options bypasses inline validation) · C45054 (Requested flow) ·
// C45040 clause 2 (no category -> Uncategorized) · C45060 (cost/sell open empty for a part with none).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const R={ build: await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content) };
const goto=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(10000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(6500);};
const openRow=async()=>{await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();}); await page.waitForTimeout(4500);};
const msgs=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...new Set([...document.querySelectorAll('.q-field__messages,.text-negative,.text-warning,[role=alert],.q-notification')]
    .filter(isVis).map(t).filter(Boolean))].filter(m=>!/Credit Hold|Build Lines|location_on/.test(m));}, VIS);
const rowOpen=()=>page.evaluate(()=>!!document.querySelector('[data-test-id=input_inline_part_description]'));
const fill=async(d,q,c,sp)=>{
  await page.fill('[data-test-id=input_inline_part_description]',d);
  await page.fill('[data-test-id=input_inline_part_quantity]',q);
  if(c!==null) await page.fill('[data-test-id=input_inline_part_cost]',c).catch(()=>{});
  if(sp!==null) await page.fill('[data-test-id=input_inline_part_sell_price]',sp).catch(()=>{});
  await page.waitForTimeout(1200);};
const save=async()=>{await page.evaluate(()=>document.querySelector('[data-test-id=button_save_inline_part]')?.click()); await page.waitForTimeout(5000);};

await goto();
// ---- C45058 : non-numeric then negative
await openRow(); await fill('ZZAUTOTEST badcost','1','abc','5.00'); await save();
R.C45058_nonnumeric={ open: await rowOpen(), messages: await msgs() };
log('C45058 non-numeric cost:', JSON.stringify(R.C45058_nonnumeric));
await fill('ZZAUTOTEST negcost','1','-5','5.00'); await save();
R.C45058_negative={ open: await rowOpen(), messages: await msgs() };
log('C45058 negative cost  :', JSON.stringify(R.C45058_negative));
await page.screenshot({path:`${DIR}/evidence/31-a-badnumbers.png`, fullPage:true});

// ---- C45059 : sell price below cost -> note, still saves
const partsBefore = await page.evaluate(()=>document.querySelectorAll('[data-test-id^=button_edit_part_]').length);
await fill('ZZAUTOTEST sellbelowcost','1','20.00','5.00');
R.C45059_noteBeforeSave = await msgs();
log('C45059 note while typing:', JSON.stringify(R.C45059_noteBeforeSave));
await save();
R.C45059 = { partsBefore, partsAfter: await page.evaluate(()=>document.querySelectorAll('[data-test-id^=button_edit_part_]').length),
             messagesAfter: await msgs(), rowOpen: await rowOpen() };
log('C45059 after save:', JSON.stringify(R.C45059));
await page.screenshot({path:`${DIR}/evidence/31-b-sellbelowcost.png`, fullPage:true});

// ---- C45057 : More Options with an incomplete row
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST bypass').catch(()=>{});
await page.waitForTimeout(900);
await page.evaluate(()=>document.querySelector('[data-test-id=button_more_options_inline_part]')?.click());
await page.waitForTimeout(5500);
R.C45057 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  return { modalOpened:!!d, title:d? t(d.querySelector('.q-card__section,.text-h6')||d).slice(0,40):null,
           blockingMessage:/Enter a qty, cost and sell price/i.test(document.body.innerText||'') };}, VIS);
log('C45057 More Options on an incomplete row:', JSON.stringify(R.C45057));
if (R.C45057.modalOpened){ await page.keyboard.press('Escape'); await page.waitForTimeout(4000); }

// ---- C45054 + C45040 clause 2 : free-typed part saves as Requested / Uncategorized
if(!(await rowOpen())) await openRow();
await fill('ZZAUTOTEST requested flow','1','2.00','4.00'); await save();
R.C45054 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const toast=[...document.querySelectorAll('.q-notification')].filter(isVis).map(t);
  const rows=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/ZZAUTOTEST requested flow/.test(t(e)));
  let rowText=null; if(rows.length){ let b=rows[0]; for(let i=0;i<6&&b.parentElement;i++){ b=b.parentElement; if(/Requested|Quoted|In stock/i.test(t(b))) break; } rowText=t(b).slice(0,140); }
  return { toast, rowText };}, VIS);
log('C45054:', JSON.stringify(R.C45054));
await page.screenshot({path:`${DIR}/evidence/31-c-requested.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/31-fv-e.json`, JSON.stringify(R,null,1));
await s.browser.close();
