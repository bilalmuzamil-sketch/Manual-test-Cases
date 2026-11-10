import { start } from './lib.mjs';
const OUT = new URL('./33/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const VID = '5ab2c088-7d57-40de-8af8-6e795d4cc68f';
for (const rep of ['ap-aging-detail', 'ap-unpaid-invoices', 'ap-aging-summary']) await step(rep, async () => { await go(`/reports/${rep}?vendorIds=${VID}`); await page.waitForTimeout(5000);
  const ex = page.getByRole('button', { name: /Expand all/ }); if (await ex.count()) { await ex.first().click(); await page.waitForTimeout(3000); }
  log(`== ${rep} chips`, JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].filter(Boolean).slice(0, 10)));
  log(`${rep} ROWS`, JSON.stringify((await page.locator('main tbody tr, main [role=row]').allInnerTexts()).map(T).filter(Boolean).slice(0, 12))); await dump(rep); });
await r.browser?.close?.(); process.exit(0);
