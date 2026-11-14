import { start, A } from './libs.mjs';
const OUT = new URL('./s22b/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
await step('customer', async () => { await go('/customers'); await page.waitForTimeout(3000); await page.locator('main button:visible').filter({ hasText: /Search/ }).first().click(); await page.waitForTimeout(800); await page.keyboard.type('ZZAUTOTEST OVERPAID C715462', { delay: 60 }); await page.waitForTimeout(4000);
  const rows = (await page.locator('main tbody tr').allInnerTexts()).map(T).filter(Boolean); log('ROWS', JSON.stringify(rows.slice(0, 3).map(x => x.slice(0, 80))));
  await page.locator('main tbody tr').filter({ hasText: 'ZZAUTOTEST OVERPAID C715462 Cust A' }).first().locator('td').first().click(); await page.waitForTimeout(4000); log('URL', page.url().replace(A, ''));
  await page.locator('main .q-tab', { hasText: /^\s*Invoices/ }).first().click(); await page.waitForTimeout(3000); log('INVOICES', JSON.stringify((await page.locator('main tbody tr').allInnerTexts()).map(T).filter(Boolean).map(x => x.slice(0, 100)))); const oo = page.locator('main').last().getByText('Open only', { exact: true }); log('open only', await oo.count()); if (await oo.count()) { await oo.first().click(); await page.waitForTimeout(3000); } log('INVOICES all', JSON.stringify((await page.locator('main tbody tr').allInnerTexts()).map(T).filter(Boolean).map(x => x.slice(0, 100)))); await dump('invoices'); });
await r.browser?.close?.(); process.exit(0);
