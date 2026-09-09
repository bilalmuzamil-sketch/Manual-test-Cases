// Scan the work-order list (All tab, all pages) for Invoiced and Paid work orders.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/inline-add-edit-parts/execution-2026-09-09';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const s = await boot('sv9315','/workorders','admin');
const { page } = s;
await page.waitForTimeout(4000);
await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  [...document.querySelectorAll('.q-tab,[role=tab],button')].find(e=>t(e)==='All')?.click();});
await page.waitForTimeout(7000);
const counts={}; const found={}; let pages=0;
for (let p=0;p<12;p++){
  const rows = await page.evaluate(()=>{const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
    return [...document.querySelectorAll('tbody tr')].map(r=>[...r.querySelectorAll('td')].map(t)).filter(r=>r.length>3);});
  rows.forEach(r=>{const st=r[1]; counts[st]=(counts[st]||0)+1;
    if(/Invoiced|Paid/i.test(st) && !found[st]) found[st]={number:r[2], lines:r[11]};});
  pages++;
  const next = await page.evaluate(()=>{const b=[...document.querySelectorAll('button,[role=button]')]
    .find(e=>/chevron_right|Next/i.test((e.textContent||'')+(e.getAttribute('aria-label')||'')));
    if(b && !b.disabled){ b.click(); return true;} return false;});
  if(!next) break;
  await page.waitForTimeout(5000);
}
log('pages scanned:', pages);
log('STATUS COUNTS:', JSON.stringify(counts));
log('Invoiced/Paid found:', JSON.stringify(found));
fs.writeFileSync(`${DIR}/evidence/22-statuses.json`, JSON.stringify({counts,found,pages},null,1));
await s.browser.close();
