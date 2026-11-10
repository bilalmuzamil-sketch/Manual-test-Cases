import { start } from './lib.mjs';
const OUT = new URL('./03b/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dlgs = async () => (await page.locator('.q-dialog:visible').allInnerTexts()).map(T).join(' || ');
await step('roles', async () => { await go('/administration/roles-permissions'); await page.waitForTimeout(3000); log('ROLE ROWS:', T(await page.locator('main tbody').first().innerText()).slice(0, 700));
  await page.locator('main button:visible', { hasText: 'Create Custom Role' }).first().click(); await page.waitForTimeout(2000); await page.locator('.q-dialog:visible button', { hasText: 'Skip' }).first().click(); await page.waitForTimeout(3500);
  const b = T(await page.locator('main').innerText()); for (const s of ['Reports', 'Page Access', 'View and Manage AP/AR Data', 'Customers', 'Invoicing & Payments', 'Invoicing & payments', 'See Financial Data', 'Work Orders', 'Work orders', 'Part Sales', 'Part sales', 'Vendor Order Management', 'Vendor order management']) { const i = b.indexOf(s); log(`[${s}]`, i >= 0 ? b.slice(i, i + 170) : 'NOT FOUND'); }
  await dump('role-form', true); });
await r.browser?.close?.(); process.exit(0);
