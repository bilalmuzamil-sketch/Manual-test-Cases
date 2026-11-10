import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./22/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 1200);
const WO = fs.readFileSync(new URL('./16b/wo-url.txt', import.meta.url), 'utf8').trim().replace(A, '');
const okNotes = async () => { for (let i = 0; i < 2; i++) { const ok = page.locator('.q-dialog:visible button', { hasText: /^Ok$/ }).first(); if (await ok.count()) { await ok.click(); await page.waitForTimeout(1000); } } };
await step('date', async () => { await go(WO.replace('/lines', '/finance')); await page.waitForTimeout(3500); await okNotes();
  const f = page.locator('main .q-field').filter({ has: page.locator('.q-field__label', { hasText: 'Invoice Date' }) }).first(); const inp = f.locator('input').first(); log('invoice date value before:', await inp.inputValue(), '| placeholder', await inp.getAttribute('placeholder'));
  await inp.click(); await page.waitForTimeout(800); log('picker open:', await page.locator('.q-menu:visible, .q-date:visible').count()); await page.keyboard.press('Escape');
  await inp.fill('10/01/2026'); await page.keyboard.press('Tab'); await page.waitForTimeout(1500); log('invoice date value after:', await inp.inputValue()); await dump('date-set', true); });
await step('create', async () => { await page.locator('main button:visible', { hasText: 'Create Invoice' }).first().click(); await page.waitForTimeout(4000); log('after create dialogs:', await dl()); const c = page.locator('.q-dialog:visible button', { hasText: /^(Create Invoice|Confirm|Yes|Create)$/ }).last(); if (await c.count()) { log('confirming:', T(await c.innerText())); await c.click(); await page.waitForTimeout(4000); log('after confirm:', await dl()); }
  log('CARD:', T(await page.locator('body').innerText()).match(/S11315-17581 .{0,40}/)?.[0]); const t = T(await page.locator('main').innerText()); log('INVOICE HEAD:', t.match(/Invoice: .{0,140}/)?.[0] || t.slice(0, 400)); log('BUTTONS:', JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].filter(Boolean))); await dump('invoiced', true); });
await r.browser?.close?.(); process.exit(0);
