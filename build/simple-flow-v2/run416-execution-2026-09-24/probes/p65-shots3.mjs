import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
const SH='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/shots';
const { browser, page } = await bootProdLogin('/workorders', { settle: 12000, viewport:{width:1680,height:1000}, deviceScaleFactor: 2 });
page.setDefaultTimeout(30000);
await openWo(page, '068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(9000);
const ids = await page.evaluate(()=>[...document.querySelectorAll('tr[class*="line-row-"]')].map(tr=>(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1]).filter(Boolean));
console.log('line rows:', ids.length);
await page.screenshot({ path: `${SH}/line-actions.png` });
if (ids.length) {
  const tr = page.locator(`tr.line-row-${ids[0]}`).first();
  await tr.hover(); await page.waitForTimeout(1200);
  await page.locator(`[data-test-id="line_checkbox_${ids[0]}"]`).first().click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `${SH}/bulk-bar.png` });
  console.log('captured bulk-bar');
}
await browser.close();
