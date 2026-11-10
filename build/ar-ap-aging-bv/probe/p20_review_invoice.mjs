import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./20/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dlg = () => page.locator('.q-dialog:visible').last(); const fld = (lab) => dlg().locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: lab }) }).first();
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 1200);
const WO = fs.readFileSync(new URL('./16b/wo-url.txt', import.meta.url), 'utf8').trim().replace(A, '');
const CU = fs.readFileSync(new URL('./10/customer-url.txt', import.meta.url), 'utf8').trim().replace(A, '');
const okNotes = async () => { for (let i = 0; i < 2; i++) { const ok = page.locator('.q-dialog:visible button', { hasText: /^Ok$/ }).first(); if (await ok.count()) { await ok.click(); await page.waitForTimeout(1000); } } };
await step('customer-tax', async () => { await go(CU); await page.waitForTimeout(3000); await page.locator('main button:visible', { hasText: 'edit_note' }).first().click(); await page.waitForTimeout(2500);
  await fld('Taxes').click(); await page.waitForTimeout(1200); await page.locator('.q-menu:visible .q-item', { hasText: 'Exempt (0%)' }).first().click(); await page.waitForTimeout(800);
  await fld('Default Shop Supplies').locator('input').fill('0'); await page.waitForTimeout(500); log('EDIT now:', T(await dlg().innerText()).match(/Credit Terms.{0,60}|Taxes.{0,40}/g)); await dlg().locator('button:visible', { hasText: /^Save$/ }).click(); await page.waitForTimeout(3000); log('saved dialogs:', await page.locator('.q-dialog:visible').count()); });
await step('reviewed', async () => { await go(WO); await page.waitForTimeout(3000); await okNotes(); await page.locator('main .q-tab', { hasText: /^\s*Finance/ }).first().click(); await page.waitForTimeout(2500); log('FIN SUMMARY:', T(await page.locator('main').innerText()).match(/SUMMARY.{0,140}/)?.[0]);
  await page.locator('main button:visible', { hasText: 'Mark Reviewed' }).first().click(); await page.waitForTimeout(3000); log('after Mark Reviewed dialogs:', await dl()); const c = page.locator('.q-dialog:visible button', { hasText: /^(Yes|Confirm|Mark Reviewed|OK)$/ }).first(); if (await c.count()) { await c.click(); await page.waitForTimeout(3000); }
  log('CARD:', T(await page.locator('body').innerText()).match(/S11315-17581 .{0,40}/)?.[0]); log('FIN BUTTONS:', JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].filter(Boolean))); log('FIN LABELS:', JSON.stringify(await page.locator('main .q-field__label').allTextContents())); log('FIN SUMMARY now:', T(await page.locator('main').innerText()).match(/SUMMARY.{0,140}/)?.[0]); await dump('after-reviewed', true); });
await r.browser?.close?.(); process.exit(0);
