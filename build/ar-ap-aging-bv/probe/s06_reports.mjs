import { start } from './libs.mjs';
const OUT = new URL('./s06/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const menu = async () => (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T);
for (const rep of ['ar-aging-summary', 'ar-aging-detail', 'ar-aging-collection', 'ap-aging-summary', 'ap-aging-detail', 'ap-unpaid-invoices']) await step(rep, async () => {
  await go('/reports/' + rep); await page.waitForTimeout(5000);
  log(`== ${rep} title`, T(await page.locator('main h1, main .text-h5, main .text-h6').first().innerText().catch(() => '')));
  log(`${rep} chips`, JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].filter(Boolean).slice(0, 10)));
  log(`${rep} header btn tips`, JSON.stringify(await page.locator('main thead button, main thead [aria-label]').evaluateAll(es => es.map(e => e.getAttribute('aria-label') || e.title || '').filter(Boolean)).catch(() => [])));
  const rows = (await page.locator('main tbody tr').allInnerTexts()).map(T).filter(x => /\(\d+\)/.test(x)); log(`${rep} group rows`, rows.length, JSON.stringify(rows.slice(0, 7).map(x => x.slice(0, 60))));
  if (rep === 'ar-aging-collection') { await page.locator('main button:visible').filter({ hasText: /^\s*more_horiz\s*$/ }).first().click(); await page.waitForTimeout(1200); log('EXPORT MENU', JSON.stringify(await menu())); log('export btn label', await page.locator('main button:visible').filter({ hasText: /^\s*more_horiz\s*$/ }).first().getAttribute('aria-label')); await page.keyboard.press('Escape'); }
  if (rep === 'ar-aging-summary') { await page.locator('main button:visible').filter({ hasText: /Customer:/ }).first().click(); await page.waitForTimeout(1500); log('CUSTOMER MENU head', JSON.stringify((await page.locator('.q-menu:visible').allInnerTexts()).map(T).join('|').slice(0, 160))); await page.keyboard.press('Escape'); }
  if (rep === 'ap-aging-detail') { await page.locator('main button:visible').filter({ hasText: /Vendor:/ }).first().click(); await page.waitForTimeout(1500); log('VENDOR MENU head', JSON.stringify((await page.locator('.q-menu:visible').allInnerTexts()).map(T).join('|').slice(0, 160))); await page.keyboard.press('Escape'); }
  await dump(rep); });
await r.browser?.close?.(); process.exit(0);
