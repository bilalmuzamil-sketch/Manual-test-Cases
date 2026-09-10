// Does a role change on this branch actually PERSIST? Probe 61 clicked View mode -> Full View and
// clicked Save, and the DOM showed Full View — but a reload (probe 68) showed the role unchanged,
// exactly as the QA lead described for the "Move labor" toggle. This settles it before any of the
// four role-variant cases are attempted again, and it targets controls BY THEIR ROW TEXT, never by
// index (the mistake probe 61 made: it indexed a checkbox-only list against a combined map).
// It changes ONE thing, reloads, reads it back, and puts it back either way.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const TECH_ROLE='2d4b8464-81a9-4c1e-96c6-a2a64f02a389';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin'); const { page, APP, APIH } = s;
const R={};
const open=async()=>{await page.goto(`${APP}/administration/roles-permissions/${TECH_ROLE}/edit`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(14000);};
const state=()=>page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return {view:(([...document.querySelectorAll('.wo-settings__segment')].find(b=>b.className.includes('--active'))||{textContent:''}).textContent||'').trim(),
    sfd:(()=>{const tg=[...document.querySelectorAll('.q-toggle')].find(n=>{let r=n; for(let k=0;k<6&&r.parentElement;k++){r=r.parentElement; if(/See Financial Data/i.test(r.innerText||'')) return true;} return false;});
      return tg? (tg.getAttribute('aria-checked')==='true'||tg.classList.contains('q-toggle--truthy')) : null;})()};});
const clickView=(want)=>page.evaluate(w=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('.wo-settings__segment')].find(x=>t(x).toLowerCase()===w.toLowerCase());
  if(!b) return 'not found'; if(b.className.includes('--active')) return 'already '+w; b.click(); return 'clicked '+w;}, want);
const save=()=>page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button')].filter(x=>/^save$/i.test(t(x))).pop();
  if(!b) return 'no Save'; if(b.disabled) return 'Save disabled'; b.click(); return 'clicked Save';});
// watch what the Save actually sends
const calls=[];
page.on('request', r=>{ if(r.method()!=='GET' && /role/i.test(r.url())) calls.push(`${r.method()} ${r.url().split('?')[0]}`); });
page.on('response', async r=>{ if(r.request().method()!=='GET' && /role/i.test(r.url()))
  calls.push(`  <- ${r.status()} ${r.url().split('?')[0]}`); });

await open();
R.before = await state();
log('before:', JSON.stringify(R.before));
R.click = await clickView('Full View'); await page.waitForTimeout(2500);
R.domAfterClick = await state();
R.save = await save(); await page.waitForTimeout(10000);
R.network = [...new Set(calls)];
log('click=%s save=%s | network: %s', R.click, R.save, JSON.stringify(R.network));
await open();
R.afterReload = await state();
log('after a reload:', JSON.stringify(R.afterReload));
R.persisted = R.afterReload.view.toLowerCase().includes('full');
log('DID IT PERSIST?', R.persisted);
// the API's own answer, independent of the screen
R.apiRole = await page.evaluate(async ({api,id})=>{
  for (const p of [`/api/roles/${id}`, `/api/organizations/roles/${id}`, `/api/roles?limit=200`]){
    const r=await fetch(`https://${api}${p}`,{headers:{Accept:'application/json'}, credentials:'include'});
    if(!r.ok) continue; const txt=(await r.text());
    if (/view_mode|viewMode/i.test(txt)) return {path:p, snippet:txt.slice(0,600)};
  }
  return {none:true};}, {api:APIH, id:TECH_ROLE});
log('role as the API reports it:', JSON.stringify(R.apiRole).slice(0,600));
// put it back if it did persist
if (R.persisted){
  await clickView('Tech view'); await page.waitForTimeout(2000);
  R.restoreSave = await save(); await page.waitForTimeout(9000);
  await open(); R.afterRestore = await state();
  log('restored ->', JSON.stringify(R.afterRestore));
}
await page.screenshot({path:`${DIR}/evidence/69-rolepersist.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/69-rolepersist.json`, JSON.stringify(R,null,1));
await s.browser.close();
