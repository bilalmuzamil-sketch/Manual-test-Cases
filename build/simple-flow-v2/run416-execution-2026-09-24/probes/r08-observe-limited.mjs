// Observe only - no role changes here. What does a person without Pick parts, Order parts or
// See Financial Data actually see? Serves C44574(1), C44582, C44580(3), C44587, C44591(4), C44607-C44609.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import { openPartsTab, readParts } from '../seed/lib-parts.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='068f9856-9d28-4500-a3dd-dd6d7aafb15a';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const out = {};
out.perms = ((await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json())?.data?.fe_permissions||[]).length;
console.log('permissions I hold for this reading:', out.perms);
await openWo(page, WO); await page.waitForTimeout(6000);
const t = await bodyText(page);
fs.writeFileSync(`${EV}/limited-work-order.txt`, t);
await page.screenshot({ path: `${EV}/limited-work-order.png`, fullPage: true });
out.tickBoxes = await page.evaluate(()=>document.querySelectorAll('[data-test-id^="line_checkbox_"]').length);
out.money = { dollars: (t.match(/\$/g)||[]).length, margin: t.includes('Margin'), rate: t.includes('Rate'), total: t.includes('Total'), cost: t.includes('Cost') };
console.log('line tick boxes on the page:', out.tickBoxes);
console.log('money on the page:', JSON.stringify(out.money));
await openPartsTab(page, WO);
out.parts = await readParts(page);
console.log('part rows as this person:'); for (const p of out.parts) console.log('  ', JSON.stringify(p.badges), '->', JSON.stringify(p.actions));
const pt = await bodyText(page);
out.partsMoney = { dollars: (pt.match(/\$/g)||[]).length, cost: pt.includes('Cost'), sell: pt.includes('Sell Price'), margin: pt.includes('Margin') };
console.log('money on the parts list:', JSON.stringify(out.partsMoney));
await page.screenshot({ path: `${EV}/limited-parts.png`, fullPage: true });
// the bulk bar
await openWo(page, WO); await page.waitForTimeout(5000);
const ids = await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(tr=>(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean));
if (ids.length && out.tickBoxes) {
  const tr=page.locator(`tr.line-row-${ids[0]}`).first(); await tr.hover().catch(()=>{}); await page.waitForTimeout(1000);
  await page.locator(`[data-test-id="line_checkbox_${ids[0]}"]`).first().click({timeout:9000}).catch(()=>{});
  await page.waitForTimeout(2500);
  out.bar = await page.evaluate(()=>{ const el=[...document.querySelectorAll('div')].filter(e=>/\bselected\b/.test(e.innerText||'') && e.querySelector('button,.q-btn') && (e.innerText||'').length<220).sort((a,b)=>a.innerText.length-b.innerText.length)[0];
    return el? (el.innerText||'').replace(/\s+/g,' ').trim() : null; });
  console.log('bulk bar:', JSON.stringify(out.bar));
  await page.screenshot({ path: `${EV}/limited-bulk-bar.png` });
}
fs.writeFileSync(`${EV}/rerun-permissions.json`, JSON.stringify(out,null,1));
await browser.close();
