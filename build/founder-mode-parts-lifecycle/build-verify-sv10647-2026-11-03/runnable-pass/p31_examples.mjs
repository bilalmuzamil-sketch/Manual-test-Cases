// Probe 31 (read-only): confirm on screen the five example records the census found.
import { start } from '../probe/lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT; const { r, page, step, go, search } = await start(OUT);
const body = async n => { await page.waitForTimeout(1500); const t = await page.locator('main').innerText().catch(() => ''); fs.writeFileSync(`${OUT}/${n}.txt`, page.url() + '\n' + t); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log(n, t.replace(/\n+/g, ' | ').slice(0, 330)); };
for (const [n, q, open] of [['lib-615144', '615144', false], ['lib-TK52', 'TK52-67-5Y0H', true], ['lib-68157291AA', '68157291AA', true], ['lib-21-361', '21-361', true]]) {
  await step(n, async () => { await go('/parts/parts-catalogue'); await search(q); await body(n + '-list'); if (open) { await page.locator('main tbody tr.cursor-pointer').first().locator('td').nth(1).click(); await page.waitForTimeout(2500); await body(n + '-details'); } }); }
await step('ivr', async () => { await go('/reports/inventory-value'); await page.locator('main').getByText('As of:', { exact: false }).first().click(); await page.waitForTimeout(800);
  for (let k = 0; k < 1; k++) { await page.locator('.q-menu:visible button:visible, .q-menu:visible .q-btn:visible').filter({ hasText: 'chevron_left' }).first().click(); await page.waitForTimeout(600); }
  await page.locator('.q-menu:visible').getByText('20', { exact: true }).first().click(); await page.waitForTimeout(2500); await page.keyboard.press('Escape');
  await page.locator('main').getByText('Search', { exact: true }).first().click(); await page.locator('main input:visible').first().fill('W3030T'); await page.waitForTimeout(3000); await body('ivr-1020-W3030T'); });
await r.browser.close();
