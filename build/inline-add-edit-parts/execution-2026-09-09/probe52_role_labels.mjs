// Read-only: label every control in the Technician role editor with its row and column, so the
// Create & Edit checkbox, the View-mode toggle and See Financial Data can be targeted exactly.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin'); const { page } = s;
const openRole=async(name)=>{
  await page.evaluate(()=>document.querySelector('[data-test-id=profile_menu_button]')?.click());
  await page.waitForTimeout(2500);
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('.q-menu .q-item')].find(e=>/settings$/i.test(t(e)))?.click();});
  await page.waitForTimeout(8000);
  await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    [...document.querySelectorAll('.q-item,a,button')].find(e=>/roles.*permission/i.test(t(e)))?.click();});
  await page.waitForTimeout(8000);
  await page.evaluate(n=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    const row=[...document.querySelectorAll('tr')].find(r=>{const c=[...r.querySelectorAll('td')].map(t); return c[1]===n;});
    if(!row) return 'no row';
    [...row.querySelectorAll('button,[role=button],i,span')].find(e=>/^edit$/.test(t(e)))?.click(); return 'ok';}, name);
  await page.waitForTimeout(10000);
};
await openRole('Technician');
const R = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const ctl=[...document.querySelectorAll('.q-checkbox,.q-toggle')];
  return { url:location.href,
    headers:[...document.querySelectorAll('th')].map(t).slice(0,20),
    controls: ctl.map((n,i)=>{
      let row=n; for(let k=0;k<6&&row.parentElement;k++){ row=row.parentElement;
        if(/tr/i.test(row.tagName)||row.getAttribute('role')==='row'|| (row.innerText||'').split('\n').length>1) break; }
      const on = n.getAttribute('aria-checked')==='true' || n.classList.contains('q-checkbox--truthy')
              || n.classList.contains('q-toggle--truthy') || !!(n.querySelector('input')&&n.querySelector('input').checked);
      const sib=[...(n.parentElement?n.parentElement.children:[])].map(t).filter(Boolean).slice(0,3);
      return {i, kind:n.classList.contains('q-toggle')?'toggle':'checkbox', on,
        rowText:(row.innerText||'').replace(/\s+/g,' ').trim().slice(0,110),
        aria:n.getAttribute('aria-label')||n.querySelector('input')?.getAttribute('aria-label')||null,
        sib};}),
    bodyHeads:[...document.querySelectorAll('h1,h2,h3,h4,h5,h6,.text-h6,.text-subtitle1,.text-weight-bold')].map(t).filter(Boolean).slice(0,40) };
});
log('url:', R.url); log('headers:', JSON.stringify(R.headers));
R.controls.forEach(c=>console.log(`  ${String(c.i).padStart(2)} ${c.kind.padEnd(8)} ${c.on?'ON ':'off'} aria=${c.aria} row="${c.rowText}"`));
log('headings:', JSON.stringify(R.bodyHeads));
fs.writeFileSync(`${DIR}/evidence/52-rolelabels.json`, JSON.stringify(R,null,1));
await s.browser.close();
