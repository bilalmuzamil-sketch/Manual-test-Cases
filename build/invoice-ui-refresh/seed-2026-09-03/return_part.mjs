// THE MISS, AND THE FIX. My probe enumerated `document.querySelector('table tbody tr')` - the FIRST
// tbody row - which in these Quasar tables is an EMPTY SPACER. It answered "0 controls" and I reported
// that a part sale has no return action. The QA lead's screenshot shows the return arrow sitting in the
// Actions column of every row whose Status is "Received". Enumerate EVERY row, and record the status
// each control belongs to.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const SALE='90a95f29-f405-4763-834d-6e3a237f8c33', OUT='build/invoice-ui-refresh/seed-2026-09-03';
const { browser, page, APP, APIH } = await boot('sv8218', `/parts/part-sale/${SALE}/part-requests`, 'admin');
await page.waitForTimeout(11000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const rows = await page.evaluate(L=>{ const lab=eval(L);
  return [...document.querySelectorAll('table tbody tr')].map((tr,i)=>{ tr.setAttribute('data-qa-row',String(i));
    const cells=[...tr.cells].map(lab);
    const ctl=[...tr.querySelectorAll('button,.q-btn')];
    ctl.forEach((b,j)=>b.setAttribute('data-qa-ctl',`${i}:${j}`));
    return { i, cells: cells.slice(0,3).concat(cells.slice(-4)), controls: ctl.length };
  }); }, lab);
console.log('EVERY row on the part sale (the first is the spacer that fooled the last probe):');
rows.forEach(r=>console.log(`  row ${String(r.i).padStart(2)}  controls=${r.controls}  ${JSON.stringify(r.cells).slice(0,190)}`));
const target = rows.find(r => r.controls > 0 && /Received/i.test(JSON.stringify(r.cells)));
if (!target) { console.log('no row with a Received status and controls'); await browser.close(); process.exit(2); }
console.log(`\nhovering every control on row ${target.i} (status Received):`);
for (let j=0;j<target.controls;j++){ const el=page.locator(`[data-qa-ctl="${target.i}:${j}"]`).first();
  await el.hover().catch(()=>{}); await page.waitForTimeout(900);
  const tip=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>(t.textContent||'').trim()).filter(Boolean));
  console.log(`  [${j}] text="${await el.evaluate(e=>(e.textContent||'').trim())}" tooltip=${JSON.stringify(tip)}`); }
fs.writeFileSync(`${OUT}/part-sale-rows.json`, JSON.stringify(rows,null,1));
await page.screenshot({path:`${OUT}/part-sale-rows.png`, fullPage:true});
await browser.close();
