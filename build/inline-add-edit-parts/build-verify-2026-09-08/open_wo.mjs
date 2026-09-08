import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const { browser, page, APIH } = await boot('sv9315', '/', 'admin');
await page.waitForTimeout(8000);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
await page.locator('a:has-text("Work Orders"),button:has-text("Work Orders")').first().click().catch(()=>{});
await page.waitForTimeout(9000);
// enumerate EVERY non-empty row (skip spacers), find columns Number(index?) and Lines
const rows = await page.evaluate(L=>{ const lab=eval(L); const tb=document.querySelector('table');
  const head=[...tb.querySelectorAll('thead th')].map(c=>lab(c).replace('arrow_drop_up',''));
  const li=head.findIndex(h=>/^Lines/.test(h)), ni=head.findIndex(h=>/^Number/.test(h));
  const out=[];
  [...tb.querySelectorAll('tbody tr')].forEach((tr,i)=>{ const cells=[...tr.cells].map(lab); if(cells.join('').trim().length<3) return;
    tr.setAttribute('data-qa-wo',String(i)); out.push({i, num:cells[ni]||cells[1], lines:cells[li], status:cells.find(c=>/Estimate|Complete|Progress/i.test(c))||'', cells:cells.slice(0,4)}); });
  return {head, li, ni, out}; }, lab);
console.log('headers:', JSON.stringify(rows.head));
console.log('rows with data:', rows.out.length);
rows.out.slice(0,12).forEach(r=>console.log('  row',r.i,'num',r.num,'lines',r.lines,JSON.stringify(r.cells).slice(0,90)));
// pick the first with lines > 0
const pick = rows.out.find(r=>parseInt(r.lines)>0) || rows.out[0];
console.log('opening row', pick.i, 'num', pick.num, 'lines', pick.lines);
await page.locator(`[data-qa-wo="${pick.i}"] td`).nth(1).click(); await page.waitForTimeout(11000);
console.log('WO url:', page.url());
const wo = await page.evaluate(L=>{const lab=eval(L);
  return { tabs:[...new Set([...document.querySelectorAll('.q-tab,[role=tab]')].map(lab).filter(Boolean))],
    lineCount:document.querySelectorAll('[class*=line],[data-line]').length,
    addPart:[...document.querySelectorAll('button,.q-btn,a')].map(lab).filter(t=>/Add Part/i.test(t)),
    heading:[...document.querySelectorAll('h1,h2,.text-h6,.q-toolbar__title')].map(lab).filter(Boolean).slice(0,4) };}, lab);
console.log('WO page:', JSON.stringify(wo).slice(0,600));
fs.writeFileSync('build/inline-add-edit-parts/build-verify-2026-09-08/wo-open.json', JSON.stringify({url:page.url(),pick,wo},null,1));
await page.screenshot({path:'build/inline-add-edit-parts/build-verify-2026-09-08/wo-open.png', fullPage:true});
await browser.close();
