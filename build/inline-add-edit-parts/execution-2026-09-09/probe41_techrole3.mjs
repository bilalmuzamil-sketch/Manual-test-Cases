// Full snapshot of the Technician role: every checkbox AND toggle, grouped by the heading above it.
// Read-only. Records the original state so it can be restored (QA lead's reset rule).
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
    [...row.querySelectorAll('button,[role=button],i,span')].find(e=>/^edit$/.test(t(e)))?.click();}, name);
  await page.waitForTimeout(9000);
};
await openRole('Technician');
const R = await page.evaluate(()=>{
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const KNOWN=['Work orders','View mode','Work order lines','Schedule','Customers','Invoicing & payments',
               'Timesheets','Parts Department','Reports','Customer portal','Settings','Billing Portal',
               'Cross-Cutting Toggles'];
  // walk the DOM in document order, tracking the last heading seen
  const out=[]; let section='(top)';
  const walk=(n)=>{
    if(n.nodeType===3){ const s=n.textContent.trim(); if(KNOWN.includes(s)) section=s; return; }
    if(n.nodeType!==1) return;
    if(n.classList && (n.classList.contains('q-checkbox')||n.classList.contains('q-toggle'))){
      const kind=n.classList.contains('q-toggle')?'toggle':'checkbox';
      const on = n.getAttribute('aria-checked')==='true' ||
                 n.classList.contains('q-checkbox--truthy') || n.classList.contains('q-toggle--truthy') ||
                 !!(n.querySelector('input')&&n.querySelector('input').checked);
      out.push({section, kind, label:t(n).slice(0,40), on});
      return;
    }
    for(const c of n.childNodes) walk(c);
  };
  walk(document.body);
  const radios=[...document.querySelectorAll('.q-radio')].map(r=>({label:t(r).slice(0,30),
    on:r.getAttribute('aria-checked')==='true'||r.classList.contains('q-radio--truthy')}));
  return { controls:out, radios };
});
console.log('=== Technician role — every control, in page order ===');
R.controls.forEach((c,i)=>console.log(`  ${String(i).padStart(2)} [${c.section.padEnd(20)}] ${c.kind.padEnd(8)} ${c.on?'ON ':'off'}  ${c.label}`));
console.log('radios (View mode):', JSON.stringify(R.radios));
fs.writeFileSync(`${DIR}/evidence/41-techrole-snapshot.json`, JSON.stringify(R,null,1));
await s.browser.close();
