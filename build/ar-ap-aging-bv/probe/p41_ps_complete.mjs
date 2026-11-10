import { start } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./41b/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const menu = async () => (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T);
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 1000);
const M = () => page.locator('main').last();
const mclick = async (loc) => { const bb = await loc.boundingBox(); await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); };
const PS = '/parts/part-sale/f966af4d-3243-4faa-ad6d-4dae41cccf8d';
await step('set-status', async () => { await go(PS + '/part-requests'); await page.waitForTimeout(3500); const dots = M().locator('button:visible').filter({ hasText: /^\s*more_vert\s*$/ }); await mclick(dots.first()); await page.waitForTimeout(1200);
  await mclick(page.locator('.q-menu:visible .q-item').filter({ hasText: /Set Status/ }).first()); await page.waitForTimeout(1500); log('SUB', JSON.stringify(await menu()));
  const c = page.locator('.q-menu:visible .q-item').filter({ hasText: /Complete/ }).first(); if (!(await c.count())) throw new Error('no Complete');
  await mclick(c); await page.waitForTimeout(2500); log('DLG', await dl()); const db = page.locator('.q-dialog:visible button'); if (await db.count()) log('dlg btns', JSON.stringify((await db.allInnerTexts()).map(T))); await dump('after-complete');
  log('badge', T(await page.locator('.q-badge').first().innerText().catch(() => ''))); });
await step('finance', async () => { const d = page.locator('.q-dialog:visible'); if (await d.count()) { const tx = (await d.locator('button').allInnerTexts()).map(T); log('closing dlg with', JSON.stringify(tx)); }
  await go(PS + '/finance'); await page.waitForTimeout(4000); log('badge', T(await page.locator('.q-badge').first().innerText().catch(() => ''))); log('labels', JSON.stringify(await page.locator('main .q-field__label').allTextContents()));
  const b = page.locator('button').filter({ hasText: /Create invoice/i }).first(); log('CI disabled', await b.isDisabled()); await dump('finance'); });
await r.browser?.close?.(); process.exit(0);
