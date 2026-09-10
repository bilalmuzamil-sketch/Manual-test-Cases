// As ADMIN: open the Technician role and record every permission toggle (so the original state can
// be restored), then turn ON the work-order-lines Create & Edit if it is off, and save.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin'); const { page } = s;
const R={ when:new Date().toISOString() };
const openRoles=async()=>{
  await page.evaluate(()=>document.querySelectorAll('.q-dialog__backdrop').forEach(e=>e.remove()));
  await page.evaluate(()=>document.querySelector('[data-test-id=profile_menu_button]')?.click());
  await page.waitForTimeout(2500);
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('.q-menu .q-item')].find(e=>/settings$/i.test(t(e)))?.click();});
  await page.waitForTimeout(8000);
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('.q-item,a,button')].find(e=>/roles.*permission/i.test(t(e)))?.click();});
  await page.waitForTimeout(8000);
};
await openRoles();
log('roles url:', page.url());
const op = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const row=[...document.querySelectorAll('tr')].find(r=>{const c=[...r.querySelectorAll('td')].map(t); return c[1]==='Technician';});
  if(!row) return 'Technician row not found';
  const p=[...row.querySelectorAll('button,[role=button],i,span')].find(e=>/^edit$/.test(t(e)));
  if(!p) return 'no edit control'; p.click(); return 'opened';});
log('open Technician role:', op);
await page.waitForTimeout(9000);
R.url=page.url(); log('url:', R.url);
await page.screenshot({path:`${DIR}/evidence/39-a-techrole.png`, fullPage:true});

// full snapshot of every toggle, with its own label taken from its row
R.before = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('.q-toggle')].map(h=>{
    let lab=''; let n=h.parentElement;
    for(let i=0;i<4&&n;i++){ const txt=t(n); if(txt && txt.length<70){ lab=txt; break; } n=n.parentElement; }
    return { label:lab.slice(0,54), on:h.getAttribute('aria-checked')==='true'||h.classList.contains('q-toggle--truthy') };
  });
});
log('Technician role toggles:', R.before.length, '| ON:', R.before.filter(x=>x.on).length);
R.before.forEach(x=>log(`   ${x.on?'ON ':'off'}  ${x.label}`));
fs.writeFileSync(`${DIR}/evidence/39-techrole.json`, JSON.stringify(R,null,1));
await s.browser.close();
