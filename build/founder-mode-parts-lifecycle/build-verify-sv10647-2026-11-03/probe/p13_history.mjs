// Probe 13 (read-only): Part History page of ZZAUTOTEST-PLBV-A (Inactive tab) and of an active part; its search box and columns.
import { start } from './lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT;
const { r, page, dump, step, go, search } = await start(OUT);
const save = (n, o) => fs.writeFileSync(`${OUT}/${n}.json`, JSON.stringify(o, null, 1));
await step('hist', async () => { await go('/parts/inventory'); await page.getByRole('tab', { name: 'Inactive' }).click(); await page.waitForTimeout(1500); await search('ZZAUTOTEST-PLBV-A');
  const row = page.locator('main tr').filter({ hasText: 'ZZAUTOTEST PLBV PART A' }).first(); save('row-html', (await row.innerHTML()).slice(0, 1500));
  await row.locator('td').first().locator('button, i, .q-icon, a').first().click(); await page.waitForTimeout(3500); await dump('history-inactive-part', true);
  save('history-inputs', await page.locator('main input:visible').evaluateAll(x => x.map(e => (e.getAttribute('aria-label') || '') + '|' + (e.placeholder || '')))); save('history-buttons', await page.locator('main button:visible').allInnerTexts()); });
await step('hist2', async () => { await go('/parts/inventory'); await search('W3030'); const row = page.locator('main tr').filter({ hasText: 'W3030' }).nth(0);
  await row.locator('td').first().locator('button, i, .q-icon, a').first().click(); await page.waitForTimeout(3500); await dump('history-active-part', true); });
await r.browser.close();
