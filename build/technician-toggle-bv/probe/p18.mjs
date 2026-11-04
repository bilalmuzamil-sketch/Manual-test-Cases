import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./18/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => s.replace(/\s+/g, ' ').trim();
const WO = fs.readFileSync(new URL('./07/wo-url.txt', import.meta.url), 'utf8').trim().replace(A, '');
const dlgs = async () => JSON.stringify((await page.locator('.q-dialog:visible').allInnerTexts()).map(s => T(s).slice(0, 500)));
await step('clockout', async () => { await go(WO); await page.waitForTimeout(3000); for (let i = 0; i < 2; i++) { const ok = page.locator('.q-dialog:visible button', { hasText: /^Ok$/ }).first(); if (await ok.count()) { await ok.click(); await page.waitForTimeout(1000); } }
  await page.locator('main button:visible', { hasText: /^Stop$/ }).first().click(); await page.waitForTimeout(2500); await page.locator('.q-dialog:visible button', { hasText: 'Clock Out' }).first().click(); await page.waitForTimeout(3000); log('after Clock Out:', await dlgs()); await dump('after-clockout');
  const c = page.locator('.q-dialog:visible button', { hasText: /^(Clock Out|Yes|Confirm|OK)$/ }).first(); if (await c.count()) { log('confirm:', T(await c.innerText())); await c.click(); await page.waitForTimeout(3000); log('after confirm:', await dlgs()); } });
await step('check', async () => { await go(WO); await page.waitForTimeout(3000); log('header:', T(await page.locator('header').innerText()).slice(-60)); const b = T(await page.locator('body').innerText()); const i = b.lastIndexOf('S11788-17580'); log('card:', b.slice(i, i + 60)); log('labor:', T(await page.locator('main').innerText()).match(/Labor .{0,120}/)?.[0]); });
await r.browser?.close?.(); process.exit(0);
