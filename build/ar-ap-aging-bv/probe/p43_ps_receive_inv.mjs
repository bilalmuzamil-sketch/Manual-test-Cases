import { start } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./43e/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 1200);
const M = () => page.locator('main').last();
const mclick = async (loc) => { const bb = await loc.boundingBox(); await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); };
const field = (root, re) => root.locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: re }) }).first();
const PS = '/parts/part-sale/f966af4d-3243-4faa-ad6d-4dae41cccf8d';
await step('receive', async () => { await go(PS + '/part-requests'); await page.waitForTimeout(3500); const row = M().locator('tbody tr').filter({ has: page.locator('input[value="ZZAUTOTEST part sale item"]') }).first();
  await mclick(row.locator('button').filter({ hasText: /^\s*Receive\s*$/ }).first()); await page.waitForTimeout(3500); log('URL', page.url()); log('DLG', await dl()); log('labels', JSON.stringify(await page.locator('.q-dialog:visible .q-field__label, main .q-field__label').allTextContents())); await dump('receive-open');
  const root = (await page.locator('.q-dialog:visible').count()) ? page.locator('.q-dialog:visible').last() : M();
  await field(root, /Vendor invoice/i).locator('input').fill('ZZAUTOTEST-BILL-PS1');
  const tax = root.getByText('Tax', { exact: true }).locator('xpath=..').locator('input'); if (await tax.count()) { await tax.first().fill('0'); await page.keyboard.press('Tab'); }
  const cb = root.locator('.q-checkbox'); log('checkboxes', await cb.count()); await mclick(cb.last()); await page.waitForTimeout(1000); log('sel', (await dl()).match(/\d of \d selected/)?.[0]); log('qty inputs', JSON.stringify(await root.locator('input').evaluateAll(es => es.map(e => e.value))));
  { const ins = root.locator('input'); const vals = await ins.evaluateAll(es => es.map(e => e.value)); const k = vals.indexOf('100'); log('pn idx', k - 1); await ins.nth(k - 1).fill('ZZAUTO-PS-PART'); await page.keyboard.press('Tab'); }
  await page.waitForTimeout(800); await dump('receive-filled'); { const bs = page.locator('.q-dialog:visible button'); const tx = (await bs.allInnerTexts()).map(T); log('dlg btns', JSON.stringify(tx)); const i = tx.findIndex(x => /^Receive Parts \(1\)$/i.test(x)); log('idx', i); await mclick(bs.nth(i)); await page.waitForTimeout(1200); log('TOAST', T((await page.locator('.q-notification').allInnerTexts()).join('|'))); log('field errors', JSON.stringify(await page.locator('.q-dialog:visible .q-field--error, .q-dialog:visible .q-field__messages').allInnerTexts())); await dump('after-click'); } await page.waitForTimeout(3500); log('after URL', page.url()); log('DLG2', await dl()); });
await step('status', async () => { await go(PS + '/part-requests'); await page.waitForTimeout(3500); log('badge', T(await page.locator('.q-badge').first().innerText().catch(() => ''))); log('ROW', JSON.stringify((await M().locator('tbody tr').allInnerTexts()).map(T)));
  await go(PS + '/finance'); await page.waitForTimeout(4000); log('labels', JSON.stringify(await page.locator('main .q-field__label').allTextContents())); const b = page.locator('button').filter({ hasText: /Create invoice/i }).first(); log('CI disabled', await b.isDisabled().catch(() => 'absent')); await dump('finance'); });
await r.browser?.close?.(); process.exit(0);
