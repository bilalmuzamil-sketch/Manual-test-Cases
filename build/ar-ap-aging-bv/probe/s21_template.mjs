import { start } from './libs.mjs';
const OUT = new URL('./s21/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
await step('template', async () => { await go('/administration/roles-permissions'); await page.waitForTimeout(3500); await page.locator('main button:visible', { hasText: 'Create Custom Role' }).first().click(); await page.waitForTimeout(2500); await dump('choose-a-template'); await page.keyboard.press('Escape'); });
await r.browser?.close?.(); process.exit(0);
