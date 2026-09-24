// Find the purchase orders page by walking the app, and record what it lists today (baseline for C44551/C44589).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page } = await bootProdLogin('/parts', { settle: 13000 });
page.setDefaultTimeout(20000);
const tabs = await page.evaluate(()=>[...document.querySelectorAll('[role=tab], .q-tab')].map(e=>(e.innerText||'').trim()).filter(Boolean));
console.log('PARTS PAGE TABS:', JSON.stringify(tabs));
for (const name of ['Purchase Orders','Purchase orders','Orders','Receiving']) {
  const loc = page.locator(`[role=tab]:has-text("${name}"), .q-tab:has-text("${name}")`).first();
  if (await loc.count()) { await loc.click(); await page.waitForTimeout(8000); console.log('clicked', name, '->', page.url()); break; }
}
const t = await page.evaluate(()=>document.body.innerText);
fs.writeFileSync(`${EV}/purchase-orders-page.txt`, t);
await page.screenshot({ path: `${EV}/purchase-orders-page.png`, fullPage: true });
const i = t.indexOf('Invoices');
console.log(t.slice(i>0?i+9:0, (i>0?i:0)+2500));
await browser.close();
