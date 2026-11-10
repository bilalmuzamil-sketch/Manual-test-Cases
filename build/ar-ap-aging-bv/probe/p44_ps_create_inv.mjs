import { start } from './lib.mjs';
const OUT = new URL('./44/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 800);
const M = () => page.locator('main').last();
const mclick = async (loc) => { const bb = await loc.boundingBox(); await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); };
const field = (root, re) => root.locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: re }) }).first();
const PS = '/parts/part-sale/f966af4d-3243-4faa-ad6d-4dae41cccf8d';
await step('create-invoice', async () => { await go(PS + '/finance'); await page.waitForTimeout(4000); const d = field(M(), /Invoice Date/i).locator('input'); await d.click(); await d.press('Control+a'); await d.type('09/15/2026', { delay: 60 }); await page.keyboard.press('Tab'); await page.waitForTimeout(800); log('date', await d.inputValue());
  await mclick(page.locator('button').filter({ hasText: /Create invoice/i }).first()); await page.waitForTimeout(4000); log('DLG', await dl()); log('TOAST', T((await page.locator('.q-notification').allInnerTexts()).join('|'))); log('URL', page.url()); await dump('after-create');
  const db = page.locator('.q-dialog:visible'); if (await db.count()) { const tx = (await db.locator('button').allInnerTexts()).map(T); log('dlg btns', JSON.stringify(tx)); const i = tx.findIndex(x => /^(Close|Cancel)$/.test(x)); if (i >= 0) await db.locator('button').nth(i).click(); else await page.keyboard.press('Escape'); await page.waitForTimeout(1500); }
  log('INV TEXT', T(await M().innerText()).match(/Invoice:.{0,160}/)?.[0]); log('badge', T(await page.locator('.q-badge').first().innerText().catch(() => ''))); });
await step('collection', async () => { await go('/reports/ar-collection'); await page.waitForTimeout(4000); log('URL', page.url()); });
await r.browser?.close?.(); process.exit(0);
