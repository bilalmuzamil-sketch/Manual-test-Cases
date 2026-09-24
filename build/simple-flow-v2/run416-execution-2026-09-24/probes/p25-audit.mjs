// C44555: after a settings change, what does the work order's own Audit Log actually record?
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ID='068f9856-9d28-4500-a3dd-dd6d7aafb15a'; // S2-908, carries inventory + vendor parts
const { browser, page } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(20000);
await openWo(page, ID);
// the work order's ... menu holds Audit Log
const all = page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")');
await all.nth(0).click(); await page.waitForTimeout(2200);
await page.locator('.q-menu .q-item:has-text("Audit Log")').first().click();
await page.waitForTimeout(8000);
console.log('URL:', page.url());
const t = await page.evaluate(()=>document.body.innerText);
fs.writeFileSync(`${EV}/C44555-audit-log.txt`, t);
await page.screenshot({ path: `${EV}/C44555-audit-log.png`, fullPage: true });
const i = t.indexOf('Audit');
console.log(t.slice(i>0?i:0, i+3000));
await browser.close();
