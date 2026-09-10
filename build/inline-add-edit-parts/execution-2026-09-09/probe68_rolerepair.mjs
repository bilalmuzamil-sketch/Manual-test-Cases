// REPAIR. Probe 61 indexed into `.q-checkbox` only, but the control map (probe 52) was built from a
// COMBINED `.q-checkbox,.q-toggle` list. Index 7 is therefore NOT "Work order lines -> Create & Edit"
// (that is checkbox-only index 3, and it was already ON) — it is **Schedule -> Delete**, which probe 61
// switched ON. It also set View mode to Full View. Both are put back here, against the recorded
// original state, and verified by reading every control back.
//
// ORIGINAL Technician role (probe 52, 2026-09-10 03:28:33 UTC):
//   checkboxes [1,0,0, 1,0, 1,0,0, 1,0,0, 0,0,0, 0,0]
//   toggles    [0,1,0,0, 0,0,0,0,0, 0,0]
//   View mode  Tech view
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const TECH_ROLE='2d4b8464-81a9-4c1e-96c6-a2a64f02a389';
const WANT_CB=[1,0,0, 1,0, 1,0,0, 1,0,0, 0,0,0, 0,0].map(Boolean);
const WANT_TG=[0,1,0,0, 0,0,0,0,0, 0,0].map(Boolean);
const WANT_VIEW='Tech view';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const R={};
const readAll=()=>page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const on=n=>n.getAttribute('aria-checked')==='true'||n.classList.contains('q-checkbox--truthy')||n.classList.contains('q-toggle--truthy');
  const rowOf=n=>{let r=n; for(let k=0;k<6&&r.parentElement;k++){r=r.parentElement; if((r.innerText||'').trim().length>3) break;} return (r.innerText||'').replace(/\s+/g,' ').trim().slice(0,60);};
  return {cb:[...document.querySelectorAll('.q-checkbox')].map((n,i)=>({i, on:on(n), row:rowOf(n)})),
          tg:[...document.querySelectorAll('.q-toggle')].map((n,i)=>({i, on:on(n), row:rowOf(n)})),
          seg:[...document.querySelectorAll('.wo-settings__segment')].map(b=>({label:t(b), active:b.className.includes('--active')}))};});
await page.goto(`${APP}/administration/roles-permissions/${TECH_ROLE}/edit`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(14000);
R.found = await readAll();
log('found  cb:', JSON.stringify(R.found.cb.map(x=>x.on?1:0)));
log('wanted cb:', JSON.stringify(WANT_CB.map(x=>x?1:0)));
log('found  tg:', JSON.stringify(R.found.tg.map(x=>x.on?1:0)));
log('view mode:', JSON.stringify(R.found.seg));
if (R.found.cb.length!==WANT_CB.length || R.found.tg.length!==WANT_TG.length){
  log('CONTROL COUNT DOES NOT MATCH THE RECORDED MAP (cb %d vs %d, tg %d vs %d) — NOTHING TOUCHED',
      R.found.cb.length, WANT_CB.length, R.found.tg.length, WANT_TG.length);
  fs.writeFileSync(`${DIR}/evidence/68-rolerepair.json`, JSON.stringify(R,null,1));
  await page.screenshot({path:`${DIR}/evidence/68-a-mismatch.png`, fullPage:true});
  await s.browser.close(); process.exit(1);
}
R.fixes = await page.evaluate(({wcb,wtg,wview})=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const on=n=>n.getAttribute('aria-checked')==='true'||n.classList.contains('q-checkbox--truthy')||n.classList.contains('q-toggle--truthy');
  const done=[];
  [...document.querySelectorAll('.q-checkbox')].forEach((n,i)=>{ if(on(n)!==!!wcb[i]){ n.click(); done.push(`checkbox ${i} -> ${wcb[i]?'on':'off'}`);} });
  [...document.querySelectorAll('.q-toggle')].forEach((n,i)=>{ if(on(n)!==!!wtg[i]){ n.click(); done.push(`toggle ${i} -> ${wtg[i]?'on':'off'}`);} });
  const b=[...document.querySelectorAll('.wo-settings__segment')].find(x=>t(x).toLowerCase()===wview.toLowerCase());
  if (b && !b.className.includes('--active')){ b.click(); done.push('view mode -> '+wview); }
  return done;}, {wcb:WANT_CB, wtg:WANT_TG, wview:WANT_VIEW});
log('fixes applied:', JSON.stringify(R.fixes));
await page.waitForTimeout(3000);
R.saved = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button')].filter(x=>/^save$/i.test(t(x))).pop();
  if(!b) return 'no Save button'; if(b.disabled) return 'Save disabled (nothing to save)'; b.click(); return 'saved';});
log('save:', R.saved);
await page.waitForTimeout(10000);
await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(14000);
R.after = await readAll();
R.matches = { cb: JSON.stringify(R.after.cb.map(x=>x.on))===JSON.stringify(WANT_CB),
              tg: JSON.stringify(R.after.tg.map(x=>x.on))===JSON.stringify(WANT_TG),
              view: (R.after.seg.find(x=>x.active)||{}).label };
log('AFTER cb:', JSON.stringify(R.after.cb.map(x=>x.on?1:0)), '| tg:', JSON.stringify(R.after.tg.map(x=>x.on?1:0)));
log('RESTORED?', JSON.stringify(R.matches));
await page.screenshot({path:`${DIR}/evidence/68-b-restored.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/68-rolerepair.json`, JSON.stringify(R,null,1));
await s.browser.close();
