// Two live build-verifications on v26.35.9, one estimate WO:
//  (A) 6617 print route: the WO-HEADER More menu (not a line kebab) -> "Print Work Order"
//  (B) 6597 C45047: fill the inline row, "More options" modal, change a value, Cancel -> the reversed
//      behaviour: no confirmation, returns to the inline row, original values kept, modal change not carried back.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT='build/inline-add-edit-parts/build-verify-2026-09-08';
const { browser, page, APIH } = await boot('sv9315', '/workorders/b90d6e97-3f47-4745-8cc6-73765802d6ab/lines', 'admin');
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
await page.waitForTimeout(11000);
const build=await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content);
log('build', build, '| url', page.url());

// (A) enumerate every more_vert with its vertical position; the WO-header one is highest on the page
const kebabs = await page.evaluate(L=>{ const lab=eval(L);
  const bs=[...document.querySelectorAll('.q-btn,button')].filter(b=>/more_vert/.test(b.textContent||''));
  return bs.map((b,i)=>{ b.setAttribute('data-qa-k',String(i)); const r=b.getBoundingClientRect();
    return {i, top:Math.round(r.top), right:Math.round(r.right)}; }).sort((a,b)=>a.top-b.top); }, lab);
console.log('more_vert buttons (top→down):', JSON.stringify(kebabs.slice(0,6)));
let printMenu=null;
for (const k of kebabs.slice(0,3)) {   // try the top few (header-level)
  await page.locator(`[data-qa-k="${k.i}"]`).click().catch(()=>{}); await page.waitForTimeout(2000);
  const menu = await page.evaluate(L=>{const lab=eval(L); return [...document.querySelectorAll('.q-menu .q-item')].map(lab).filter(Boolean);}, lab);
  console.log(`  kebab#${k.i} (top=${k.top}) menu:`, JSON.stringify(menu));
  if (menu.some(m=>/Print Work Order/i.test(m))) { printMenu=menu; }
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
  if (printMenu) break;
}
console.log('6617 PRINT ROUTE:', printMenu ? 'CONFIRMED — "Print Work Order" present: '+JSON.stringify(printMenu) : 'not found in the top kebabs — needs another look');

// (B) C45047 — fill inline row, open More options modal, change a value, Cancel
await page.evaluate(L=>{const lab=eval(L); const b=[...document.querySelectorAll('button,.q-btn,a')].find(e=>/Add Part/i.test(lab(e))); if(b) b.setAttribute('data-qa-add','1');}, lab);
if (await page.locator('[data-qa-add="1"]').count()) {
  await page.locator('[data-qa-add="1"]').click(); await page.waitForTimeout(3500);
  const desc = page.locator('input[placeholder="Description"]').last();
  const qty  = page.locator('input[placeholder="Qty"]').last();
  await desc.fill('ZZAUTOTEST c45047 desc'); await qty.fill('2'); await page.waitForTimeout(1200);
  const before = { desc: await desc.inputValue(), qty: await qty.inputValue() };
  log('inline row filled:', JSON.stringify(before));
  // open More options
  const mo = page.locator('button:has-text("More options"),.q-btn:has-text("More options"),:text("More options")').last();
  if (await mo.count()) { await mo.click(); await page.waitForTimeout(4000);
    const dlg = await page.evaluate(L=>{const lab=eval(L); const x=[...document.querySelectorAll('.q-dialog,[role=dialog]')].pop(); if(!x)return null;
      return { title:lab(x).slice(0,120), buttons:[...x.querySelectorAll('button')].map(lab).filter(Boolean),
        descVal:(x.querySelector('input')||{}).value }; }, lab);
    console.log('modal:', JSON.stringify(dlg));
    // change a value inside the modal
    const mdesc = page.locator('.q-dialog input').first();
    if (await mdesc.count()) { await mdesc.fill('MODAL CHANGED VALUE'); await page.waitForTimeout(1000); }
    // CANCEL the modal
    const cancel = page.locator('.q-dialog button:has-text("Cancel")').first();
    const cancelLabel = await cancel.count() ? await cancel.evaluate(e=>(e.textContent||'').trim()) : '(none)';
    log('cancel control label:', cancelLabel);
    await cancel.click().catch(()=>page.keyboard.press('Escape')); await page.waitForTimeout(3000);
    // observe: any confirmation dialog? did we return to the inline row with original values?
    const after = await page.evaluate(L=>{const lab=eval(L);
      const confirm=[...document.querySelectorAll('.q-dialog')].map(lab).filter(t=>/discard|are you sure|confirm|unsaved/i.test(t));
      const d=document.querySelector('input[placeholder="Description"]'), q=document.querySelector('input[placeholder="Qty"]');
      return { confirmDialogs:confirm, inlineDesc:d?d.value:null, inlineQty:q?q.value:null,
        stillHasInlineRow: !!d }; }, lab);
    console.log('C45047 AFTER CANCEL:', JSON.stringify(after));
    const pass = after.confirmDialogs.length===0 && after.inlineDesc==='ZZAUTOTEST c45047 desc' && after.inlineDesc!=='MODAL CHANGED VALUE';
    console.log('C45047 VERDICT:', pass?'PASS — no confirmation, returned to inline row with original values, modal change not carried back':'NEEDS REVIEW — see the after-state');
    fs.writeFileSync(`${OUT}/c45047-result.json`, JSON.stringify({build,before,after,cancelLabel,printMenu},null,1));
  } else console.log('no "More options" control found on the inline row');
  await page.screenshot({path:`${OUT}/c45047-after.png`, fullPage:true});
}
await browser.close();
