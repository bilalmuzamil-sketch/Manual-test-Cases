// Probe 37 (read-only): the work order's Parts tab (Order button there?) and the Process Return page on the new build (not posted).
import { start } from '../../build-verify-sv10647-2026-11-03/probe/lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT; const WO = 'https://sv10647.qa.shopview.com/workorders/56ea768d-c925-4f05-b165-16d89aec9cba/lines';
const { r, page, step, go, search } = await start(OUT);
await step('partstab', async () => { for (let t = 0; t < 3 && !page.url().includes('/lines'); t++) { await page.goto(WO); await page.waitForTimeout(5000); }
  await page.locator('main').getByText(/^Parts \(\d+\)$/).first().click(); await page.waitForTimeout(4000); console.log('url', page.url());
  console.log('buttons', JSON.stringify(await page.locator('main button:visible').allInnerTexts()).slice(0, 500)); await page.screenshot({ path: `${OUT}/parts-tab.png` }); });
await step('credit', async () => { await go('/parts/returns'); await search('W3030LS'); await page.waitForTimeout(2500); const row = page.locator('main tbody tr').filter({ hasText: 'W3030LS' }).first();
  console.log('row', (await row.innerText()).replace(/\s+/g, ' ')); await row.locator('[role=checkbox]').first().click(); await page.waitForTimeout(800);
  await page.locator('main button:visible', { hasText: 'Receive Credit' }).first().click(); await page.waitForTimeout(3500);
  console.log('process', page.url(), JSON.stringify(await page.locator('main button:visible').allInnerTexts())); });
await r.browser.close();
