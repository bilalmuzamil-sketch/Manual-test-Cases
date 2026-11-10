import { start } from './lib.mjs';
const OUT = new URL('./40/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const menu = async () => (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T);
const M = () => page.locator('main').last();
const PS = '/parts/part-sale/f966af4d-3243-4faa-ad6d-4dae41cccf8d';
await step('tooltip', async () => { await go(PS + '/finance'); await page.waitForTimeout(4000); const b = page.locator('button').filter({ hasText: /Create invoice/i }).first(); const bb = await b.boundingBox(); await page.mouse.move(bb.x + 10, bb.y + 10); await page.waitForTimeout(1500); log('TOOLTIP', T((await page.locator('.q-tooltip').allInnerTexts()).join('|'))); log('inv labels', JSON.stringify(await page.locator('.q-field__label').allTextContents())); });
await step('menus', async () => { await go(PS + '/part-requests'); await page.waitForTimeout(3500); const dots = M().locator('button:visible').filter({ hasText: /^\s*more_vert\s*$/ }); log('dots', await dots.count());
  for (let k = 0; k < await dots.count(); k++) { const bb = await dots.nth(k).boundingBox(); await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.waitForTimeout(1200); log('MENU', k, JSON.stringify(await menu())); await page.keyboard.press('Escape'); await page.waitForTimeout(500); }
  const row = M().locator('tbody tr').filter({ hasText: /ZZAUTOTEST part sale item/ }).first(); const st = row.getByText('Auth To Order'); if (await st.count()) { await st.click(); await page.waitForTimeout(1200); log('STATUS MENU', JSON.stringify(await menu())); await page.keyboard.press('Escape'); }
  const src = page.locator('.q-dialog').count(); });
await r.browser?.close?.(); process.exit(0);
