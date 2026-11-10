import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./56/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 600);
const dlg = () => page.locator('.q-dialog:visible').last();
const mclick = async (loc) => { await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); const bb = await loc.boundingBox(); await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); };
const fld = (root, re) => root.locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: re }) }).first();
const typeDate = async (inp, v) => { await inp.click(); await inp.press('Control+a'); await inp.type(v, { delay: 60 }); await page.keyboard.press('Tab'); await page.waitForTimeout(600); };
const CU = fs.readFileSync(new URL('./10/customer-url.txt', import.meta.url), 'utf8').trim().replace(A, '').replace('/work-orders', '');
const WO = fs.readFileSync(new URL('./55/wo4-url.txt', import.meta.url), 'utf8').trim().replace(A, '');
const okNotes = async () => { for (let i = 0; i < 2; i++) { const ok = page.locator('.q-dialog:visible button', { hasText: /^Ok$/ }).first(); if (await ok.count()) { await ok.click(); await page.waitForTimeout(1000); } } };
const arRows = async () => { const id = CU.split('/').pop(); await go(`/reports/ar-aging-detail?customerIds=${id}`); await page.waitForTimeout(5000); const ex = page.getByRole('button', { name: /Expand all/ }); if (await ex.count()) { await ex.first().click(); await page.waitForTimeout(3000); } return (await page.locator('main tbody tr').allInnerTexts()).map(T).filter(x => /Deposit|17585|17584/.test(x)); };
log('AR before', JSON.stringify(await arRows()));
await step('line', async () => { await go(WO); await page.waitForTimeout(3500); await okNotes(); const D = page.locator('.q-dialog:visible'); if (!(await D.filter({ hasText: 'New Line' }).count())) { await mclick(page.locator('main button:visible', { hasText: /^New Line$/ }).first()); await page.waitForTimeout(2000); }
  await fld(D, /^Title/i).locator('input').first().fill('ZZAUTOTEST fixed line 4'); await page.keyboard.press('Tab'); await page.waitForTimeout(600); await mclick(fld(D, /Labor rate/i)); await page.waitForTimeout(1200); await mclick(page.locator('.q-menu:visible .q-item').filter({ hasText: /^\s*\S*\s*Fixed Line Total\s*$/ }).first()); await page.waitForTimeout(1000);
  await fld(D, /^Fixed Line Total/i).locator('input').fill('50'); await page.keyboard.press('Tab'); await mclick(D.getByText('Line Approved', { exact: true }).first()); await page.waitForTimeout(500); const bs = D.locator('button:visible'); const tx = (await bs.allInnerTexts()).map(T); await mclick(bs.nth(tx.indexOf('Save & Close'))); await page.waitForTimeout(3500);
  await mclick(page.locator('main button:visible', { hasText: /^Complete$/ }).first()); await page.waitForTimeout(3000); const ta = dlg().locator('textarea:visible').first(); if (await ta.count()) { await ta.fill('ZZAUTOTEST tech story'); await page.keyboard.press('Tab'); await page.waitForTimeout(2500); }
  for (let i = 0; i < 4; i++) { const dd = dlg(); if (!(await dd.count())) break; const mi = fld(dd, /Mileage/i); if (await mi.count()) { await mi.locator('input').fill('1000'); await page.keyboard.press('Tab'); } const b = dd.locator('button:visible').filter({ hasNotText: /^(close|Cancel|chevron_right)$/ }).last(); await b.click(); await page.waitForTimeout(3000); } });
await step('invoice', async () => { await go(WO.replace('/lines', '/finance')); await page.waitForTimeout(4000); await okNotes(); const mr = page.locator('main button:visible', { hasText: 'Mark Reviewed' }).first(); if (await mr.count()) { await mclick(mr); await page.waitForTimeout(3000); const cr = page.locator('.q-dialog:visible button', { hasText: 'Confirm Review' }); if (await cr.count()) await cr.first().click(); await page.waitForTimeout(3000); }
  log('FIN before', T(await page.locator('main').last().innerText()).match(/SUMMARY.{0,200}/)?.[0]); await typeDate(fld(page.locator('main').last(), /Invoice Date/i).locator('input'), '10/28/2026'); await mclick(page.locator('button').filter({ hasText: /Create invoice/i }).first()); await page.waitForTimeout(5000); log('DLG', await dl()); await dump('pay-window'); await page.reload(); await page.waitForTimeout(5000);
  log('FIN after', T(await page.locator('main').last().innerText()).match(/SUMMARY.{0,220}/)?.[0]); log('badges', JSON.stringify((await page.locator('.q-badge').allInnerTexts()).map(T).slice(0, 3))); });
log('AR after', JSON.stringify(await arRows()));
await step('deposits-tab', async () => { await go(CU + '/work-orders'); await page.waitForTimeout(3000); await page.locator('main .q-tab', { hasText: /^\s*Deposits/ }).first().click(); await page.waitForTimeout(3000); log('DEP ROWS', JSON.stringify((await page.locator('main tbody tr').allInnerTexts()).map(T).filter(Boolean))); });
await r.browser?.close?.(); process.exit(0);
