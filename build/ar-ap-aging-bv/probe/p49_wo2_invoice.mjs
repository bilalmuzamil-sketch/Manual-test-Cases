import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./49/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 700);
const dlg = () => page.locator('.q-dialog:visible').last();
const mclick = async (loc) => { await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); const bb = await loc.boundingBox(); await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); };
const WO = fs.readFileSync(new URL('./25/wo2-url.txt', import.meta.url), 'utf8').trim().replace(A, '');
const okNotes = async () => { for (let i = 0; i < 2; i++) { const ok = page.locator('.q-dialog:visible button', { hasText: /^Ok$/ }).first(); if (await ok.count()) { await ok.click(); await page.waitForTimeout(1000); } } };
await step('complete', async () => { await go(WO); await page.waitForTimeout(3500); await okNotes(); await mclick(page.locator('main button:visible', { hasText: /^Complete$/ }).first()); await page.waitForTimeout(3000);
  const d = dlg(); await d.getByText('ZZAUTOTEST fixed line').first().click().catch(() => {}); await page.waitForTimeout(1500); const ta = d.locator('textarea:visible').first(); if (await ta.count()) { await ta.fill('ZZAUTOTEST tech story'); await page.keyboard.press('Tab'); await page.waitForTimeout(2500); } });
for (let i = 0; i < 5; i++) await step('next' + i, async () => { const d = dlg(); if (!(await d.count())) { log('no dialog'); return; } const mi = d.locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: /Mileage/i }) }).first(); if (await mi.count()) { await mi.locator('input').fill('1000'); await page.keyboard.press('Tab'); await page.waitForTimeout(800); }
  const b = d.locator('button:visible').filter({ hasNotText: /^(close|Cancel|chevron_right)$/ }).last(); if (!(await b.count())) return; const lbl = T(await b.innerText()); log(`step ${i}:`, lbl); if (/Invoice/.test(lbl)) return; await b.click(); await page.waitForTimeout(3000); });
await step('review', async () => { await go(WO.replace('/lines', '/finance')); await page.waitForTimeout(3500); await okNotes(); const mr = page.locator('main button:visible', { hasText: 'Mark Reviewed' }).first(); log('mark reviewed present', await mr.count()); if (await mr.count()) { await mr.click(); await page.waitForTimeout(2500); log('REVIEW DLG', await dl()); const vin = dlg().locator('.q-field', { hasText: 'VIN' }).first(); if (await vin.count() && !(await vin.locator('input').inputValue())) await vin.locator('input').fill('ZZAUTOTESTVIN0001'); await dlg().locator('button:visible', { hasText: 'Confirm Review' }).click(); await page.waitForTimeout(4000); }
  log('LABELS', JSON.stringify(await page.locator('main .q-field__label').allTextContents())); });
await step('invoice', async () => { const d = page.locator('main .q-field').filter({ has: page.locator('.q-field__label', { hasText: /Invoice Date/i }) }).first().locator('input'); await d.click(); await d.press('Control+a'); await d.type('09/01/2026', { delay: 60 }); await page.keyboard.press('Tab'); await page.waitForTimeout(800);
  await mclick(page.locator('button').filter({ hasText: /Create invoice/i }).first()); await page.waitForTimeout(4500); log('PAY DLG', (await dl()).slice(0, 300)); const x = page.locator('.q-dialog:visible button').filter({ hasText: /^close$/ }); if (await x.count()) { await x.first().click(); await page.waitForTimeout(1500); }
  log('INV', T(await page.locator('main').last().innerText()).match(/Invoice: .{0,80}/)?.[0]); log('SUM', T(await page.locator('main').last().innerText()).match(/SUMMARY.{0,160}/)?.[0]); await dump('invoiced'); });
await r.browser?.close?.(); process.exit(0);
