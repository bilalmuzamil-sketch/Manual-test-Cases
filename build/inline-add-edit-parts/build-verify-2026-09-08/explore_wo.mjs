// Find a work order on sv9315 with a line that has a Parts section, so C45047 (modal-cancel) and the
// core inline Add Part route can be build-verified on v26.35.9. Read-only exploration.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page, APP, APIH } = await boot('sv9315', '/work-orders', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg,i[class*=icon]").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
await page.waitForTimeout(9000);
const build=await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content);
log('build:', build, '| url:', page.url());
// list work orders from the table
const rows = await page.evaluate(L=>{ const lab=eval(L); const tb=document.querySelector('table'); if(!tb) return [];
  return [...tb.querySelectorAll('tbody tr')].slice(0,15).map((tr,i)=>{tr.setAttribute('data-qa-wo',String(i));
    return {i, cells:[...tr.cells].map(lab).slice(0,6)};}).filter(r=>r.cells.join('').length>5); }, lab);
console.log('work orders (first 15):'); rows.forEach(r=>console.log('  ',r.i, JSON.stringify(r.cells).slice(0,140)));
fs.writeFileSync('build/inline-add-edit-parts/build-verify-2026-09-08/wo-list.json', JSON.stringify({build,rows},null,1));
await page.screenshot({path:'build/inline-add-edit-parts/build-verify-2026-09-08/wo-list.png'});
await browser.close();
