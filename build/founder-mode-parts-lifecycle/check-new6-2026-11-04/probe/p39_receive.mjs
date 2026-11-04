// Probe 39 (throwaway, dummy branch): receive purchase order S10647-17584 (from probe 38's Order) on its Receive screen, then read the
// work order's Parts tab.
import { start } from '../../build-verify-sv10647-2026-11-03/probe/lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT; const WO = 'https://sv10647.qa.shopview.com/workorders/56ea768d-c925-4f05-b165-16d89aec9cba/part-requests';
const { r, page, step, go } = await start(OUT);
const txt = async () => (await page.locator('body').innerText()).replace(/\s+/g, ' ');
await step('receive', async () => { await go('/parts/orders'); await page.waitForTimeout(3000);
  await page.locator('main tbody tr').filter({ hasText: 'S10647-17584' }).first().locator('button:visible', { hasText: /^Receive$/ }).first().click(); await page.waitForTimeout(6000);
  const t0 = await txt(); console.log('receive screen:', t0.slice(t0.indexOf('Purchase Order S10647'), t0.indexOf('Purchase Order S10647') + 700));
  if (t0.includes('Vendor missing')) { console.log('vendor still missing'); }
  await page.locator('input[aria-label="Vendor invoice # *"]').first().fill('ZZAUTOTEST-PLBV-INV1');
  const qr = page.locator('main input:visible'); console.log('inputs', await qr.count()); await page.screenshot({ path: `${OUT}/receive-filled.png` });
  await page.locator('input[type=number]:visible').first().fill('10'); await page.waitForTimeout(500); const b = page.getByText(/^Receive Parts \(1\)$/).last(); await b.click(); await page.waitForTimeout(5000);
  const t1 = await txt(); console.log('after receive:', page.url(), t1.slice(0, 300)); });
await step('wo', async () => { for (let t = 0; t < 3 && !page.url().includes('/part-requests'); t++) { await page.goto(WO); await page.waitForTimeout(5000); }
  const t = await txt(); const i = t.indexOf('ZZAUTOTEST PL line'); console.log('wo parts:', t.slice(i, i + 700)); await page.screenshot({ path: `${OUT}/wo-after.png` }); });
await r.browser.close();
