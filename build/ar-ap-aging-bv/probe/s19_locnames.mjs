import { start } from './libs.mjs';
const OUT = new URL('./s19/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a);
await step('names', async () => { await go('/administration/locations'); await page.waitForTimeout(4000); const names = await page.locator('main tbody tr').evaluateAll(rs => rs.map(r => r.querySelector('td')?.innerText.trim()).filter(Boolean)); log('NAMES', JSON.stringify(names)); await dump('locations'); });
await r.browser?.close?.(); process.exit(0);
