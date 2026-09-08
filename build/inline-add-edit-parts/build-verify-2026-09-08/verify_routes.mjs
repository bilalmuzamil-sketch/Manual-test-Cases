// Build-verify the two suites' CORE routes on v26.35.9:
//  6617 print: a WO's More menu (three dots) -> "Print Work Order"
//  6597 inline: an Estimate WO -> a line's Parts section -> "+ Add Part" -> inline row -> "More options" modal
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/inline-add-edit-parts/build-verify-2026-09-08';
const { browser, page, APIH } = await boot('sv9315', '/', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
await page.waitForTimeout(8000);
await page.locator('a:has-text("Work Orders"),button:has-text("Work Orders")').first().click().catch(()=>{});
await page.waitForTimeout(8000);
const build=await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content);
// filter to Estimates
await page.locator('.q-tab:has-text("Estimates"),[role=tab]:has-text("Estimates"),button:has-text("Estimates")').first().click().catch(()=>{});
await page.waitForTimeout(7000);
const est = await page.evaluate(L=>{ const lab=eval(L); const tb=document.querySelector('table');
  const out=[]; [...tb.querySelectorAll('tbody tr')].forEach((tr,i)=>{const cells=[...tr.cells].map(lab); if(cells.join('').trim().length<3)return;
    tr.setAttribute('data-qa-e',String(i)); out.push({i,num:cells.find(c=>/^S9315|^S2-/.test(c))||cells[2],lines:cells[cells.length-3]});}); return out; }, lab);
console.log('estimate WOs:', est.length); est.slice(0,6).forEach(r=>console.log('  ',r.i,r.num,'lines',r.lines));
const pick = est.find(r=>parseInt(r.lines)>0) || est[0];
if(!pick){ log('no estimate WO found'); await browser.close(); process.exit(2); }
log('opening estimate', pick.num);
await page.locator(`[data-qa-e="${pick.i}"] td`).nth(1).click(); await page.waitForTimeout(11000);
console.log('WO url:', page.url());
// --- 6617 PRINT ROUTE: the More menu (three dots top-right)
const kebab = page.locator('.q-btn:has-text("more_vert"),button:has-text("more_vert")').last();
if (await kebab.count()) { await kebab.click(); await page.waitForTimeout(2500);
  const menu = await page.evaluate(L=>{const lab=eval(L); return [...document.querySelectorAll('.q-menu .q-item')].map(lab).filter(Boolean);}, lab);
  console.log('6617 More menu:', JSON.stringify(menu));
  await page.keyboard.press('Escape'); await page.waitForTimeout(800); }
// --- 6597 INLINE ROUTE: Lines tab -> a line -> Parts section -> + Add Part
await page.locator('.q-tab:has-text("Lines"),[role=tab]:has-text("Lines")').first().click().catch(()=>{}); await page.waitForTimeout(5000);
const addBtns = await page.evaluate(L=>{const lab=eval(L);
  const b=[...document.querySelectorAll('button,.q-btn,a')].filter(e=>/Add Part/i.test(lab(e)));
  b.forEach((x,i)=>x.setAttribute('data-qa-add',String(i))); return b.length;}, lab);
console.log('6597 "+ Add Part" buttons on the Lines tab:', addBtns);
if (addBtns>0) {
  await page.locator('[data-qa-add="0"]').first().click(); await page.waitForTimeout(4000);
  const row = await page.evaluate(L=>{const lab=eval(L);
    // the inline row inputs and controls
    const inps=[...document.querySelectorAll('input:not([type=hidden])')].filter(i=>i.offsetParent).slice(-8).map(i=>({ph:i.placeholder||i.getAttribute('aria-label')||'',type:i.type}));
    const ctrls=[...document.querySelectorAll('button,.q-btn')].map(lab).filter(t=>/More options|Save|Cancel|×/i.test(t));
    return {inps, ctrls:[...new Set(ctrls)]};}, lab);
  console.log('inline row after Add Part:', JSON.stringify(row).slice(0,500));
  await page.screenshot({path:`${OUT}/inline-row.png`, fullPage:true});
}
fs.writeFileSync(`${OUT}/routes-verify.json`, JSON.stringify({build,estUrl:page.url()},null,1));
await page.screenshot({path:`${OUT}/estimate-wo.png`, fullPage:true});
await browser.close();
