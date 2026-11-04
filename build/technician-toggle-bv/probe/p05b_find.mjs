import { start } from './lib.mjs';
const OUT = new URL('./05b/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
await step('find', async () => { await go('/administration/staff'); await page.locator('main').getByText('Search', { exact: true }).first().click(); await page.waitForTimeout(500); await page.locator('main input:visible').first().fill('ZZAUTOTEST'); await page.waitForTimeout(3000);
  for (const t of await page.locator('tbody tr').allInnerTexts()) console.log('ROW:', t.replace(/\s+/g, ' '));
  const me = await page.evaluate(async () => { const u = JSON.parse(localStorage.getItem('user') || '{}'); return Object.keys(u).slice(0, 10); }); console.log('ls user keys', JSON.stringify(me)); });
await r.browser?.close?.(); process.exit(0);
