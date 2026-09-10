// Find the View mode control on the role editor (probe 52 mapped every checkbox and toggle but the
// view-mode selector is neither). Read-only — nothing is changed here.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const s = await boot('sv9315','/workorders','admin'); const { page, APP } = s;
const TECH='2d4b8464-81a9-4c1e-96c6-a2a64f02a389';
await page.goto(`${APP}/administration/roles-permissions/${TECH}/edit`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(12000);
const R = { url: page.url() };
if (/login/.test(R.url)){
  log('direct route bounced to login — walking the UI instead');
  await page.goto(`${APP}/workorders`,{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(9000);
  await page.evaluate(()=>document.querySelector('[data-test-id=profile_menu_button]')?.click());
  await page.waitForTimeout(2500);
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('.q-menu .q-item')].find(e=>/settings$/i.test(t(e)))?.click();});
  await page.waitForTimeout(8000);
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('.q-item,a,button')].find(e=>/roles.*permission/i.test(t(e)))?.click();});
  await page.waitForTimeout(8000);
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const row=[...document.querySelectorAll('tr')].find(r=>[...r.querySelectorAll('td')].map(t)[1]==='Technician');
    [...row.querySelectorAll('button,[role=button],i,span')].find(e=>/^edit$/.test(t(e)))?.click();});
  await page.waitForTimeout(10000);
  R.url = page.url();
}
log('on:', R.url);
R.viewMode = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const hits=[...document.querySelectorAll('*')].filter(e=>e.children.length===0 && isVis(e) &&
    /tech view|full view|view mode/i.test(t(e)));
  return hits.map(e=>{
    let box=e; for(let i=0;i<5&&box.parentElement;i++) box=box.parentElement;
    return { text:t(e), tag:e.tagName, cls:String(e.className).slice(0,70),
      parentCls:String(e.parentElement?e.parentElement.className:'').slice(0,90),
      selected: /selected|active|--truthy|q-btn--active/i.test(String(e.className)+String(e.parentElement?.className||'')),
      groupText:(box.innerText||'').replace(/\s+/g,' ').trim().slice(0,180) };});}, VIS);
R.viewMode.forEach(v=>log('  ', JSON.stringify(v)));
R.sfd = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const tg=[...document.querySelectorAll('.q-toggle')].filter(isVis);
  return tg.map((n,i)=>{let row=n; for(let k=0;k<5&&row.parentElement;k++){row=row.parentElement; if((row.innerText||'').length>20) break;}
    return {i, on:n.getAttribute('aria-checked')==='true'||n.classList.contains('q-toggle--truthy'),
      row:(row.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)};})
    .filter(x=>/financial|ap\/ar/i.test(x.row));}, VIS);
log('SFD toggles:', JSON.stringify(R.sfd));
await page.screenshot({path:`${DIR}/evidence/55-roleeditor.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/55-viewmode.json`, JSON.stringify(R,null,1));
await s.browser.close();
