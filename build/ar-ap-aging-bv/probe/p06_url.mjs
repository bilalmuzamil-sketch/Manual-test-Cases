import { start } from './lib.mjs';
const OUT = new URL('./06/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a);
const pick = async (chip, item) => { await page.locator('main button:visible', { hasText: chip }).first().click(); await page.waitForTimeout(1200); await page.locator('.q-menu:visible').getByText(item, { exact: true }).first().click(); await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(2000); log(chip, '→', item, '| URL', decodeURIComponent(page.url())); };
await step('ar', async () => { await go('/reports/ar-aging-detail'); await page.waitForTimeout(3000); await pick('Past due:', '31-60 days'); await pick('Location:', 'Staging Lethbridge - 4310'); await dump('url', true); });
await step('cust', async () => { await page.locator('main button:visible', { hasText: 'Customer:' }).first().click(); await page.waitForTimeout(1500); await page.locator('.q-menu:visible .q-item, .q-menu:visible .q-checkbox').nth(1).click(); await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(2000); log('customer picked | URL', decodeURIComponent(page.url())); });
await step('ap', async () => { await go('/reports/ap-unpaid-invoices'); await page.waitForTimeout(3000); await page.locator('main button:visible', { hasText: 'Vendor:' }).first().click(); await page.waitForTimeout(1500); await page.locator('.q-menu:visible .q-item, .q-menu:visible .q-checkbox').nth(1).click(); await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(2000); log('vendor picked | URL', decodeURIComponent(page.url())); });
await r.browser?.close?.(); process.exit(0);
