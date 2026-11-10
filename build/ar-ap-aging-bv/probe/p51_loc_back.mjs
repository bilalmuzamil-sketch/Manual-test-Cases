import { start } from './lib.mjs';
const OUT = new URL('./51/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const menu = async () => (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T);
const mclick = async (loc) => { await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); const bb = await loc.boundingBox(); await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); };
await step('back', async () => { const top = async () => T(await page.locator('header, .q-header').first().innerText()).slice(-45); log('TOP now', await top());
  if (/Lethbridge/.test(await top())) { await mclick(page.locator('header button, .q-header button').filter({ hasText: /Staging/ }).last()); await page.waitForTimeout(1200); await mclick(page.locator('.q-menu:visible .q-item').filter({ hasText: /Change Location/ }).first()); await page.waitForTimeout(1500); log('LIST', JSON.stringify(await menu()));
    const it = page.locator('.q-menu:visible .q-item').filter({ hasText: /Heavy Duty - 9919/ }); log('hd items', await it.count()); await mclick(it.last()); await page.waitForTimeout(4500); }
  log('TOP after', await top()); await dump('after'); });
await r.browser?.close?.(); process.exit(0);
