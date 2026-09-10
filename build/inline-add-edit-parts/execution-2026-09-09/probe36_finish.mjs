// Finish C45046 (set the required Category, then Save part) and settle candidate 4 by reading the
// STORED category of a part saved from the inline row with no category chosen.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const EST='b90d6e97-3f47-4745-8cc6-73765802d6ab';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const fresh=async()=>{await page.goto(`${APP}/workorders/${EST}/lines`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(9000);
  await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item')].forEach(i=>i.querySelector('.q-item')?.click());});
  await page.waitForTimeout(6000);};

// ---------- C45046 : complete the modal properly, then Save part
await fresh();
await page.evaluate(()=>{const b=document.querySelector('[data-test-id=button_add_part]'); b.scrollIntoView({block:'center'}); b.click();});
await page.waitForTimeout(4500);
await page.fill('[data-test-id=input_inline_part_description]','ZZAUTOTEST modalsave4');
await page.fill('[data-test-id=input_inline_part_quantity]','2');
await page.fill('[data-test-id=input_inline_part_cost]','4.00');
await page.fill('[data-test-id=input_inline_part_sell_price]','8.00');
await page.waitForTimeout(900);
await page.evaluate(()=>document.querySelector('[data-test-id=button_more_options_inline_part]')?.click());
await page.waitForTimeout(6500);
// pick a Category inside the modal
const cat = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const f=[...d.querySelectorAll('.q-field')].find(x=>{const l=x.querySelector('.q-field__label'); return l&&/^category/i.test(t(l));});
  if(!f) return 'no category field'; (f.querySelector('.q-field__native,input')||f).click(); return 'opened';});
await page.waitForTimeout(2500);
const chosen = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const it=[...document.querySelectorAll('.q-menu .q-item')].find(e=>/uncategorized/i.test(t(e))) || document.querySelector('.q-menu .q-item');
  if(!it) return null; const l=t(it); it.click(); return l;});
log('category chosen in modal:', chosen);
await page.waitForTimeout(2000);
const sp = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const d=[...document.querySelectorAll('.q-dialog')].pop();
  const b=[...d.querySelectorAll('button')].find(x=>/save part/i.test(t(x)));
  if(!b) return 'no save'; if(b.disabled) return 'DISABLED'; b.click(); return 'clicked';});
log('C45046 Save part ->', sp);
await page.waitForTimeout(9000);
R.C45046 = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return { dialogsOpen:[...document.querySelectorAll('.q-dialog')].filter(isVis).length,
    inlineRowOpen:!!document.querySelector('[data-test-id=input_inline_part_description]'),
    toast:[...document.querySelectorAll('.q-notification')].filter(isVis).map(t),
    partPresent:/ZZAUTOTEST modalsave4/.test(document.body.innerText||'') };}, VIS);
log('C45046:', JSON.stringify(R.C45046));
await page.screenshot({path:`${DIR}/evidence/36-a-c45046.png`, fullPage:true});

// ---------- candidate 4 : the STORED category of an inline-saved part with no category
const woId = EST;
R.storedCategories = await page.evaluate(async ([h,id])=>{
  const get=async u=>{try{const r=await fetch(`https://${h}${u}`,{credentials:'include',headers:{Accept:'application/json'}});
    return r.ok?await r.json():{__s:r.status};}catch(e){return{__e:String(e)}}};
  for (const u of [`/api/work-orders/${id}/parts`, `/api/work-orders/${id}`, `/api/work-order-parts?work_order_id=${id}`]) {
    const j=await get(u);
    const s=JSON.stringify(j);
    if (s.includes('ZZAUTOTEST')) {
      const m=[...s.matchAll(/\{[^{}]*ZZAUTOTEST (requested flow|top-check)[^{}]*\}/g)].map(x=>x[0].slice(0,400));
      return { endpoint:u, samples:m.slice(0,3) };
    }
  }
  return { endpoint:null, note:'no endpoint returned our parts' };
}, [APIH, woId]);
log('candidate4 stored data:', JSON.stringify(R.storedCategories).slice(0,700));
// also read the part row's own category cell in the UI parts tab
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('[role=tab],.q-tab')].find(e=>/^Parts/.test(t(e)))?.click();});
await page.waitForTimeout(8000);
R.partsTab = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hdr=[...document.querySelectorAll('thead th')].map(t);
  const rows=[...document.querySelectorAll('tbody tr')].map(r=>[...r.querySelectorAll('td')].map(t))
    .filter(r=>r.join(' ').includes('ZZAUTOTEST'));
  return {hdr, rows:rows.slice(0,4)};});
log('parts tab header:', JSON.stringify(R.partsTab.hdr));
R.partsTab.rows.forEach(r=>log('   row:', JSON.stringify(r).slice(0,180)));
await page.screenshot({path:`${DIR}/evidence/36-b-partstab.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/36-finish.json`, JSON.stringify(R,null,1));
await s.browser.close();
