import { start } from './libs.mjs';
const OUT = new URL('./s07/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a);
for (const [rep, chip] of [['ar-aging-summary', /Customer:/], ['ap-aging-detail', /Vendor:/]]) await step(rep, async () => { await go('/reports/' + rep); await page.waitForTimeout(4000); await page.locator('main button:visible').filter({ hasText: chip }).first().click(); await page.waitForTimeout(1500);
  log(rep, 'menu checkboxes', await page.locator('.q-menu:visible .q-checkbox, .q-menu:visible [role=checkbox]').count(), '| search box', await page.locator('.q-menu:visible input').count()); await dump(rep + '-menu'); await page.keyboard.press('Escape'); });
await r.browser?.close?.(); process.exit(0);
