import { start } from './libs.mjs';
const OUT = new URL('./s01/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
await step('marker', async () => { log('MARKER', await page.evaluate(() => document.querySelector('meta[name=app-version]')?.content)); log('LOC', T(await page.locator('header, .q-header').first().innerText()).slice(-50)); });
await step('reports-menu', async () => { await go('/reports/ar-aging-summary'); await page.waitForTimeout(3000); log('LEFT', JSON.stringify((await page.locator('.q-drawer:visible .q-item, aside .q-item').allInnerTexts()).map(T).filter(Boolean).slice(0, 40))); log('TITLE', T(await page.locator('main').first().innerText()).slice(0, 200)); await dump('ar-summary'); });
await r.browser?.close?.(); process.exit(0);
