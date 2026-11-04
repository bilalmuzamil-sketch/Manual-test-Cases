// Probe 36 on build v26.45.0-2c807b5. Throwaway data on the dummy branch only: one part request picked from the "Part Library" result of
// W3030LS on the probe-18 work order (saved, not ordered). Cycle count and Process Return are opened and left without saving.
import { start } from '../../build-verify-sv10647-2026-11-03/probe/lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT; const WO = 'https://sv10647.qa.shopview.com/workorders/56ea768d-c925-4f05-b165-16d89aec9cba/lines';
const { r, page, step, go, dots } = await start(OUT);
const save = (n, o) => fs.writeFileSync(`${OUT}/${n}.json`, JSON.stringify(o, null, 1));
const body = async n => { await page.waitForTimeout(1500); const d = page.locator('.q-dialog:visible, .q-menu:visible'); const t = (await d.count()) ? (await d.allInnerTexts()).join('\n----\n') : await page.locator('main').innerText().catch(() => '');
  fs.writeFileSync(`${OUT}/${n}.txt`, page.url() + '\n' + t); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log(n, t.replace(/\n+/g, ' | ').slice(0, 300)); };
await step('cycle', async () => { await go('/parts/inventory'); await dots().click(); await page.waitForTimeout(700); await page.locator('.q-menu:visible').getByText('Cycle count', { exact: true }).click(); await page.waitForTimeout(2500);
  save('cycle-buttons', await page.locator('main button:visible').allInnerTexts()); await page.locator('main button:visible', { hasText: /^Cancel$/ }).first().click(); await page.waitForTimeout(1500); save('after-cancel-has-dots', await page.locator('main button:visible').filter({ has: page.locator('i:text-is("more_vert")') }).count()); });
await step('request', async () => { for (let t = 0; t < 3 && !page.url().includes('/lines'); t++) { await page.goto(WO); await page.waitForTimeout(5000); }
  await page.locator('main button:visible, main a:visible', { hasText: 'Add Part' }).first().click(); await page.waitForTimeout(1500);
  await page.locator('main input:visible').first().click(); await page.keyboard.type('W3030LS', { delay: 70 }); await page.waitForTimeout(3500);
  save('lookup', (await page.locator('.q-menu:visible').allInnerTexts()).map(x => x.slice(0, 600)));
  const lib = page.locator('.q-menu:visible .q-item').filter({ hasText: 'Part Library' }).filter({ hasText: 'W3030LS' }).first(); await lib.click(); await page.waitForTimeout(1500);
  const q = page.locator('main label').filter({ hasText: /Qty/ }).locator('input').first(); await q.fill('1'); await body('request-filled');
  await page.locator('main button:visible', { hasText: /^Save$/ }).first().click(); await page.waitForTimeout(4000); await body('request-saved');
  await page.locator('[role=tab]:visible', { hasText: /^Parts/ }).first().click(); await page.waitForTimeout(3000); await body('parts-tab');
  save('parts-tab-buttons', await page.locator('main button:visible').allInnerTexts()); });
await step('credit', async () => { await go('/parts/returns'); await page.waitForTimeout(3000); const row = page.locator('main tbody tr').filter({ hasText: 'W3030LS' }).first();
  save('return-row', await row.innerText()); await row.locator('[role=checkbox]').first().click(); await page.waitForTimeout(800);
  await page.locator('main button:visible', { hasText: 'Receive Credit' }).first().click(); await page.waitForTimeout(3000);
  save('process-return-buttons', await page.locator('main button:visible').allInnerTexts()); await body('process-return'); });
await r.browser.close();
