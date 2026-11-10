import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./26/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dlg = () => page.locator('.q-dialog:visible').last();
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 1200);
const WO2 = fs.readFileSync(new URL('./25/wo2-url.txt', import.meta.url), 'utf8').trim().replace(A, '');
await step('fin', async () => { await go(WO2.replace('/lines', '/finance')); await page.waitForTimeout(4000); for (let i = 0; i < 3; i++) { const ok = page.locator('.q-dialog:visible button', { hasText: /^(Ok|close)$/ }).first(); if (await ok.count()) { await ok.click(); await page.waitForTimeout(1000); } }
  log('dialogs', await dl()); log('fin buttons', JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].filter(Boolean))); await dump('fin', true);
  const b = page.locator('main button:visible', { hasText: 'Add Deposit' }).first(); if (await b.count()) { await b.click(); await page.waitForTimeout(3000); log('DEPOSIT:', await dl()); log('labels', JSON.stringify(await dlg().locator('.q-field__label').allTextContents())); log('buttons', JSON.stringify((await dlg().locator('button:visible').allInnerTexts()).map(T))); await dump('deposit'); } });
await r.browser?.close?.(); process.exit(0);
