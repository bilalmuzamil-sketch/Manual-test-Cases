import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./54c/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 200);
const dlg = () => page.locator('.q-dialog:visible').last();
const mclick = async (loc) => { await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); const bb = await loc.boundingBox(); await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); };
const fld = (root, re) => root.locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: re }) }).first();
const CU = fs.readFileSync(new URL('./10/customer-url.txt', import.meta.url), 'utf8').trim().replace(A, '').replace('/work-orders', '');
const invRows = async () => { const p2 = await page.context().newPage(); await p2.goto(A + CU + '/work-orders'); await p2.waitForTimeout(4000); await p2.locator('main .q-tab', { hasText: /^\s*Invoices/ }).first().click(); await p2.waitForTimeout(3000); const rows = (await p2.locator('main tbody tr').allInnerTexts()).map(T).filter(Boolean); await p2.close(); return rows; };
const okNotes = async () => { for (let i = 0; i < 2; i++) { const ok = page.locator('.q-dialog:visible button', { hasText: /^Ok$/ }).first(); if (await ok.count()) { await ok.click(); await page.waitForTimeout(1000); } } };
log('INVOICES fresh', JSON.stringify(await invRows()));
let WO3 = fs.readFileSync(new URL('./54/wo3-url.txt', import.meta.url), 'utf8').trim().replace(A, '');
if(0) await step('wo3', async () => { await go(CU + '/work-orders'); await page.waitForTimeout(3500); await mclick(page.locator('main button:visible', { hasText: /New Work Order/ }).first()); await page.waitForTimeout(2500);
  await mclick(fld(dlg(), /^Asset/i)); await page.waitForTimeout(1200); await mclick(page.locator('.q-menu:visible .q-item').first()); await page.waitForTimeout(600); await mclick(dlg().locator('button:visible').filter({ hasText: /^\s*Save\s*$/ }).first()); await page.waitForTimeout(4000); await okNotes(); WO3 = page.url().replace(A, ''); log('WO3', WO3);
  const D = page.locator('.q-dialog:visible'); if (!(await D.filter({ hasText: 'New Line' }).count())) { await mclick(page.locator('main button:visible', { hasText: /^New Line$/ }).first()); await page.waitForTimeout(2000); }
  await fld(D, /^Title/i).locator('input').first().fill('ZZAUTOTEST fixed line 2'); await page.keyboard.press('Tab'); await page.waitForTimeout(600);
  await mclick(fld(D, /Labor rate/i)); await page.waitForTimeout(1200); await mclick(page.locator('.q-menu:visible .q-item').filter({ hasText: /^\s*\S*\s*Fixed Line Total\s*$/ }).first()); await page.waitForTimeout(1000);
  await fld(D, /^Fixed Line Total/i).locator('input').fill('100'); await page.keyboard.press('Tab'); await mclick(D.getByText('Line Approved', { exact: true }).first()); await page.waitForTimeout(500);
  const bs = D.locator('button:visible'); const tx = (await bs.allInnerTexts()).map(T); await mclick(bs.nth(tx.indexOf('Save & Close'))); await page.waitForTimeout(3500);
  fs.writeFileSync(OUT + 'wo3-url.txt', A + WO3 + '\n'); log('LINE', T(await page.locator('main').last().innerText()).match(/ZZAUTOTEST fixed line 2.{0,80}/)?.[0]); });
if(0) await step('complete-review', async () => { await mclick(page.locator('main button:visible', { hasText: /^Complete$/ }).first()); await page.waitForTimeout(3000); const d = dlg(); const ta = d.locator('textarea:visible').first(); if (await ta.count()) { await ta.fill('ZZAUTOTEST tech story'); await page.keyboard.press('Tab'); await page.waitForTimeout(2500); }
  for (let i = 0; i < 4; i++) { const dd = dlg(); if (!(await dd.count())) break; const mi = fld(dd, /Mileage/i); if (await mi.count()) { await mi.locator('input').fill('1000'); await page.keyboard.press('Tab'); } const b = dd.locator('button:visible').filter({ hasNotText: /^(close|Cancel|chevron_right)$/ }).last(); log('wizard', T(await b.innerText())); await b.click(); await page.waitForTimeout(3000); }
  await go(WO3.replace('/lines', '/finance')); await page.waitForTimeout(4000); await okNotes(); const mr = page.locator('main button:visible', { hasText: 'Mark Reviewed' }).first(); if (await mr.count()) { await mclick(mr); await page.waitForTimeout(2500); log('REVIEW DLG', await dl()); const cr = page.locator('.q-dialog:visible button', { hasText: 'Confirm Review' }); if (await cr.count()) { const vin = dlg().locator('.q-field', { hasText: 'VIN' }).first(); if (await vin.count() && !(await vin.locator('input').inputValue())) await vin.locator('input').fill('ZZAUTOTESTVIN0001'); await cr.first().click(); await page.waitForTimeout(4000); } }
  log('badges', JSON.stringify((await page.locator('.q-badge').allInnerTexts()).map(T).slice(0, 4))); log('LABELS', JSON.stringify(await page.locator('main .q-field__label').allTextContents())); });
await step('create-x', async () => { await go(WO3.replace('/lines', '/finance')); await page.waitForTimeout(4000); await okNotes(); const d = fld(page.locator('main').last(), /Invoice Date/i).locator('input'); await d.click(); await d.press('Control+a'); await d.type('10/21/2026', { delay: 60 }); await page.keyboard.press('Tab'); await page.waitForTimeout(800);
  await mclick(page.locator('button').filter({ hasText: /Create invoice/i }).first()); await page.waitForTimeout(5000); log('DLG', await dl()); log('INVOICES before ×', JSON.stringify((await invRows()).filter(x => /17583|ZZ|Oct 21/.test(x))));
  await page.reload(); await page.waitForTimeout(5000); log('DLG after reload', await dl()); log('INVOICES after reload', JSON.stringify(await invRows())); log('badges', JSON.stringify((await page.locator('.q-badge').allInnerTexts()).map(T).slice(0, 4))); await dump('after-x'); });
await r.browser?.close?.(); process.exit(0);
