import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./15b/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dlg = () => page.locator('.q-dialog:visible').last(); const menu = async () => (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T);
const CU = fs.readFileSync(new URL('./10/customer-url.txt', import.meta.url), 'utf8').trim().replace(A, '').replace(/\/work-orders$/, '');
await step('assets', async () => { await go(CU + '/work-orders'); await page.waitForTimeout(3000); await page.locator('main .q-tab', { hasText: /^\s*Assets\s*$/ }).first().click(); await page.waitForTimeout(2500); log('url', page.url()); log('ASSETS BUTTONS:', JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))]));
  const b = page.locator('main button:visible', { hasText: 'New Asset' }).first(); log('add btn', await b.count()); await b.click(); await page.waitForTimeout(2500); log('ASSET FORM:', T(await dlg().innerText()).slice(0, 900)); log('LABELS:', JSON.stringify(await dlg().locator('.q-field__label').allTextContents())); await dump('asset-form');
  const at = dlg().locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: /Asset Type|Type/ }) }).first(); if (await at.count()) { await at.click(); await page.waitForTimeout(1200); log('TYPE OPTIONS:', JSON.stringify((await menu()).slice(0, 8))); await page.locator('.q-menu:visible .q-item').first().click(); await page.waitForTimeout(800); }
  const req = await dlg().locator('.q-field__label').allTextContents(); for (const l of req.filter(x => /\*/.test(x))) { const f = dlg().locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: l }) }).first(); const inp = f.locator('input'); if (await inp.count() && !(await inp.first().inputValue())) { await inp.first().fill(/year/i.test(l) ? '2020' : 'ZZAUTOTEST AR 1'); } }
  await dlg().locator('button:visible', { hasText: /^Save|Save & Close|Create$/ }).first().click(); await page.waitForTimeout(3500); log('after save:', T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 300)); log('ASSETS NOW:', T(await page.locator('main').innerText()).slice(-300)); });
await r.browser?.close?.(); process.exit(0);
