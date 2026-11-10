import { start } from './lib.mjs';
const OUT = new URL('./58/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
await step('chip', async () => { await go('/reports/ar-aging-detail'); await page.waitForTimeout(5000); await page.locator('main button:visible').filter({ hasText: /Past due:/ }).first().click(); await page.waitForTimeout(1200);
  const it = page.locator('.q-menu:visible .q-item, .q-menu:visible .q-checkbox').filter({ hasText: /^\s*\S*\s*1-30 days\s*$/ }).first(); await it.click(); await page.waitForTimeout(1500); await page.keyboard.press('Escape'); await page.waitForTimeout(2500);
  log('CHIPS', JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].filter(x => /Past due|Location/.test(x)))); log('URL', page.url().replace(/^https:\/\/[^/]+/, '')); await dump('chip'); });
await r.browser?.close?.(); process.exit(0);
