// C45065 with the correct button ("Save & close" in the EDIT modal), and candidate 3 (C45046)
// re-run capturing every validation message the ADD modal shows.
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

// ---------- C45065 : edit modal, change qty, "Save & close"
await fresh();
await page.evaluate(()=>{const e=document.querySelector('[data-test-id^=button_edit_part_]'); e.scrollIntoView({block:'center'}); e.click();});
await page.waitForTimeout(6500);
const rowBefore = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const e=document.querySelector('[data-test-id^=button_edit_part_]'); const r=e.closest('tr')||e.parentElement.parentElement; return t(r).slice(0,100);});
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const q=[...d.querySelectorAll('input')].find(i=>{const p=i.closest('.q-field'); const l=p&&p.querySelector('.q-field__label'); return l&&/^quantity$/i.test(t(l));});
  if(q){q.focus(); q.select&&q.select(); q.value='9'; for(const ev of ['input','change','blur']) q.dispatchEvent(new Event(ev,{bubbles:true}));}});
await page.waitForTimeout(1800);
const sv = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const b=[...d.querySelectorAll('button')].find(x=>/save & close|save and close/i.test(t(x)));
  if(!b) return 'no Save & close: '+JSON.stringify([...d.querySelectorAll('button')].map(x=>t(x).slice(0,16)));
  if(b.disabled) return 'DISABLED'; b.click(); return 'clicked Save & close';});
log('C45065 ->', sv);
await page.waitForTimeout(9000);
R.C45065 = await page.evaluate(([vis,before])=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const e=document.querySelector('[data-test-id^=button_edit_part_]');
  const row=e? (e.closest('tr')||e.parentElement.parentElement):null;
  return { dialogsOpen:[...document.querySelectorAll('.q-dialog')].filter(isVis).length,
    inlineRowOpen:!!document.querySelector('[data-test-id=input_inline_part_description]'),
    rowBefore:before, rowAfter: row? t(row).slice(0,100):null,
    toast:[...document.querySelectorAll('.q-notification')].filter(isVis).map(t) };}, [VIS, rowBefore]);
log('C45065 result:', JSON.stringify(R.C45065));
await page.screenshot({path:`${DIR}/evidence/35-a-c45065.png`, fullPage:true});

// ---------- candidate 3 (C45046) : ADD modal, "Save part", capture ALL messages
await fresh();
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
await page.waitForTimeout(4500);
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST modalsave3');
await page.fill('[data-test-id=input_inline_part_quantity]','2');
await page.fill('[data-test-id=input_inline_part_cost]','4.00');
await page.fill('[data-test-id=input_inline_part_sell_price]','8.00');
await page.waitForTimeout(1000);
await page.evaluate(()=>document.querySelector('[data-test-id=button_more_options_inline_part]')?.click());
await page.waitForTimeout(6500);
R.addModalBefore = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop();
  const req=[...d.querySelectorAll('.q-field')].map(f=>({label:t(f.querySelector('.q-field__label')||{}).slice(0,22),
    value:(f.querySelector('input')||{}).value, required:/\*/.test(t(f.querySelector('.q-field__label')||{}))}));
  return { title:t(d.querySelector('.q-card__section,.text-h6')||d).slice(0,34),
           buttons:[...d.querySelectorAll('button')].map(b=>({l:t(b).slice(0,18), disabled:b.disabled})),
           fields:req.filter(f=>f.label) };}, VIS);
log('ADD modal buttons:', JSON.stringify(R.addModalBefore.buttons));
log('ADD modal fields :', JSON.stringify(R.addModalBefore.fields.slice(0,10)));
const sp = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const b=[...d.querySelectorAll('button')].find(x=>/save part|save & close/i.test(t(x)));
  if(!b) return 'no save button'; if(b.disabled) return 'DISABLED'; b.click(); return 'clicked '+t(b);});
log('candidate3 save ->', sp);
await page.waitForTimeout(9000);
R.C45046 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis);
  return { dialogsOpen:d.length,
    validationInModal: d.length? [...new Set([...d[d.length-1].querySelectorAll('.q-field__messages,.text-negative')].filter(isVis).map(t).filter(Boolean))]:[],
    anyErrorText:(document.body.innerText.match(/.{0,60}(required|must|cannot|invalid).{0,60}/gi)||[]).slice(0,4),
    inlineRowOpen:!!document.querySelector('[data-test-id=input_inline_part_description]'),
    toast:[...document.querySelectorAll('.q-notification')].filter(isVis).map(t),
    partPresent:/ZZAUTOTEST modalsave3/.test(document.body.innerText||'') };}, VIS);
log('candidate3 (C45046):', JSON.stringify(R.C45046));
await page.screenshot({path:`${DIR}/evidence/35-b-c45046.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/35-saves.json`, JSON.stringify(R,null,1));
await s.browser.close();
