// Expand every section of the Technician role editor, snapshot all toggles, then turn ON the
// work-order-lines "Create & Edit" if it is off, save, and verify by reloading.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const ROLE='2d4b8464-81a9-4c1e-96c6-a2a64f02a389';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin'); const { page } = s;
const R={ role:'Technician', roleId:ROLE, when:new Date().toISOString() };
const openRole=async()=>{
  await page.evaluate(()=>document.querySelectorAll('.q-dialog__backdrop').forEach(e=>e.remove()));
  await page.evaluate(()=>document.querySelector('[data-test-id=profile_menu_button]')?.click());
  await page.waitForTimeout(2500);
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('.q-menu .q-item')].find(e=>/settings$/i.test(t(e)))?.click();});
  await page.waitForTimeout(8000);
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('.q-item,a,button')].find(e=>/roles.*permission/i.test(t(e)))?.click();});
  await page.waitForTimeout(8000);
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const row=[...document.querySelectorAll('tr')].find(r=>{const c=[...r.querySelectorAll('td')].map(t); return c[1]==='Technician';});
    [...row.querySelectorAll('button,[role=button],i,span')].find(e=>/^edit$/.test(t(e)))?.click();});
  await page.waitForTimeout(9000);
  // expand everything, twice (nested panels)
  for (let i=0;i<3;i++){
    await page.evaluate(()=>{[...document.querySelectorAll('.q-expansion-item:not(.q-expansion-item--expanded)')]
      .forEach(x=>x.querySelector('.q-item,[role=button]')?.click());});
    await page.waitForTimeout(2500);
  }
};
const snapshot=()=>page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('.q-toggle')].map(h=>{
    let lab=''; let n=h;
    for(let i=0;i<5&&n.parentElement;i++){ n=n.parentElement; const txt=t(n); if(txt&&txt.length<90){ lab=txt; break; } }
    // also the nearest section heading above
    let sec=''; let p=h.closest('.q-expansion-item');
    if(p){ const h2=p.querySelector('.q-item__label,.q-expansion-item__container > .q-item'); sec=h2?t(h2).slice(0,40):''; }
    return { section:sec, label:lab.slice(0,60),
             on:h.getAttribute('aria-checked')==='true'||h.classList.contains('q-toggle--truthy') };
  });
});
await openRole();
R.before = await snapshot();
log('toggles after expanding:', R.before.length, '| ON:', R.before.filter(x=>x.on).length);
R.before.forEach((x,i)=>log(`  ${String(i).padStart(2)} ${x.on?'ON ':'off'} [${x.section.slice(0,26)}] ${x.label}`));
await page.screenshot({path:`${DIR}/evidence/40-a-expanded.png`, fullPage:true});
fs.writeFileSync(`${DIR}/evidence/40-techrole.json`, JSON.stringify(R,null,1));
await s.browser.close();
