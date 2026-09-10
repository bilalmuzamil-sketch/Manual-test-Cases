// Supplementary Tech View reads: edit-row hint legend wording (C45025 cl.3), edit row position
// directly below the part line (C45023 cl.1), and the "needs details" flag on a requested part (C45013).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','tech'); const { page, APP } = s;
const R={};
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(6000);};
// full hint text: every visible leaf near the row mentioning Enter/Tab/Esc
const hint=()=>page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=document.querySelector('[data-test-id=input_inline_part_description]'); if(!d) return null;
  let box=d; for(let i=0;i<12&&box.parentElement;i++){ box=box.parentElement;
    if(/Esc/i.test(box.innerText||'')) break; }
  const leaves=[...box.querySelectorAll('*')].filter(e=>e.children.length===0&&isVis(e)).map(t).filter(Boolean);
  return { joined: (box.innerText||'').replace(/\s+/g,' ').trim().slice(0,300),
           leaves: leaves.filter(x=>/enter|tab|esc|save|next|cancel/i.test(x)) };}, VIS);
// ---- 1. ADD row hint (baseline)
await fresh();
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
await page.waitForTimeout(5000);
R.addHint = await hint(); log('ADD row hint:', JSON.stringify(R.addHint));
await page.screenshot({path:`${DIR}/evidence/50-a-addhint.png`, fullPage:true});
// ---- 2. EDIT row hint + position
await fresh();
R.pos = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&t(e)==='ZZAUTOTEST tv validation')[0];
  if(!hit) return {err:'row not found'};
  let box=hit; for(let i=0;i<9&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id^=button_edit_part_]')) break;}
  const r=box.getBoundingClientRect(); const e=box.querySelector('[data-test-id^=button_edit_part_]');
  if(!e) return {err:'no edit control'};
  window.__partTop=r.top+window.scrollY; window.__partBottom=r.bottom+window.scrollY;
  e.scrollIntoView({block:'center'}); e.click();
  return {partTop:Math.round(r.top+window.scrollY), partBottom:Math.round(r.bottom+window.scrollY)};});
await page.waitForTimeout(6500);
R.editPos = await page.evaluate(()=>{const d=document.querySelector('[data-test-id=input_inline_part_description]');
  if(!d) return {err:'no edit row'};
  let box=d; for(let i=0;i<9&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id=button_save_inline_part]')) break;}
  const r=box.getBoundingClientRect();
  return {rowTop:Math.round(r.top+window.scrollY), partTop:window.__partTop&&Math.round(window.__partTop),
          partBottom:window.__partBottom&&Math.round(window.__partBottom)};});
R.editHint = await hint();
log('C45023 position:', JSON.stringify({...R.pos, ...R.editPos}));
log('C45025 EDIT row hint:', JSON.stringify(R.editHint));
await page.screenshot({path:`${DIR}/evidence/50-b-edithint.png`, fullPage:true});
// ---- 3. C45013 the requested part row and its flag
await fresh();
R.requestedRow = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&t(e)==='ZZAUTOTEST tv validation')[0];
  if(!hit) return {err:'not found'};
  let box=hit; for(let i=0;i<9&&box.parentElement;i++){box=box.parentElement; if(box.querySelector('[data-test-id^=button_edit_part_]')) break;}
  return { text:(box.innerText||'').replace(/\s+/g,' ').trim().slice(0,160),
    icons:[...box.querySelectorAll('.q-icon,i')].filter(isVis).map(t).filter(Boolean),
    warnClasses:[...box.querySelectorAll('*')].filter(e=>/warning|negative|orange|amber|error/i.test(e.className||'')).map(e=>({cls:String(e.className).slice(0,60),txt:t(e).slice(0,40)})).slice(0,6),
    titles:[...box.querySelectorAll('[title],[aria-label]')].map(e=>e.getAttribute('title')||e.getAttribute('aria-label')).filter(Boolean).slice(0,6) };}, VIS);
log('C45013 requested row:', JSON.stringify(R.requestedRow));
await page.screenshot({path:`${DIR}/evidence/50-c-requested.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/50-tv.json`, JSON.stringify(R,null,1));
await s.browser.close();
