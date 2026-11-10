import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./16b/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const dlg = () => page.locator('.q-dialog:visible').last(); const menu = async () => (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T);
const fld = (lab) => dlg().locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: lab }) }).first();
const pick = async (lab, text) => { await fld(lab).click(); await page.waitForTimeout(1300); const m = await menu(); const it = text ? page.locator('.q-menu:visible .q-item').filter({ hasText: text }).first() : page.locator('.q-menu:visible .q-item').first(); await it.click(); await page.waitForTimeout(900); return m; };
const btns = async (scope) => JSON.stringify([...new Set((await scope.locator('button:visible').allInnerTexts()).map(T))].filter(Boolean).slice(0, 25));
const CU = fs.readFileSync(new URL('./10/customer-url.txt', import.meta.url), 'utf8').trim().replace(A, '').replace(/\/work-orders$/, '');
await step('contact', async () => { await go(CU + '/work-orders'); await page.waitForTimeout(3000); await page.locator('button:visible', { hasText: 'Add Contact' }).first().click(); await page.waitForTimeout(2500);
  log('CONTACT FORM:', T(await dlg().innerText()).slice(0, 500)); const labs = await dlg().locator('.q-field__label').allTextContents(); log('labels', JSON.stringify(labs));
  for (const l of labs) { if (/first/i.test(l)) await fld(l).locator('input').fill('ZZAUTOTEST'); if (/last/i.test(l)) await fld(l).locator('input').fill('Contact A'); if (/^name/i.test(l)) await fld(l).locator('input').fill('ZZAUTOTEST Contact A'); }
  await dlg().locator('button:visible', { hasText: /^Save/ }).first().click(); await page.waitForTimeout(3000); log('after contact save dialogs:', T((await page.locator('.q-dialog:visible').allInnerTexts()).join('||')).slice(0, 200)); });
await step('asset', async () => { await page.locator('main .q-tab', { hasText: /^\s*Assets\s*$/ }).first().click(); await page.waitForTimeout(2500); await page.locator('main button:visible', { hasText: 'New Asset' }).first().click(); await page.waitForTimeout(2500);
  log('contact opts', JSON.stringify(await pick('Contact', null))); log('make opts', JSON.stringify((await pick('Make', null)).slice(0, 5)));
  await dlg().locator('button:visible', { hasText: /^Save$/ }).first().click(); await page.waitForTimeout(3500); log('after asset save:', T((await page.locator('.q-dialog:visible').allInnerTexts()).join('||')).slice(0, 200)); log('assets:', T(await page.locator('main tbody').first().innerText().catch(() => '')).slice(0, 200)); });
await step('wo', async () => { await page.locator('main .q-tab', { hasText: /^\s*Work Orders\s*$/ }).first().click(); await page.waitForTimeout(2500); await page.locator('main button:visible', { hasText: 'New Work Order' }).first().click(); await page.waitForTimeout(3000);
  log('NEW WO:', T((await page.locator('.q-dialog:visible').allInnerTexts()).join('||')).slice(0, 400), '| url', page.url());
  if (await page.locator('.q-dialog:visible', { hasText: 'New Work Order' }).count()) { const af = fld('Asset'); if (await af.count()) { await af.click(); await page.waitForTimeout(1200); await page.locator('.q-menu:visible .q-item').first().click(); await page.waitForTimeout(800); } await dlg().locator('button:visible', { hasText: /^Save$/ }).first().click(); await page.waitForTimeout(4000); }
  for (let i = 0; i < 2; i++) { const ok = page.locator('.q-dialog:visible button', { hasText: /^(Ok|Create)$/ }).first(); if (await ok.count()) { log('confirm/ok:', T(await page.locator('.q-dialog:visible').last().innerText()).slice(0, 150)); await ok.click(); await page.waitForTimeout(2000); } }
  fs.writeFileSync(OUT + 'wo-url.txt', page.url()); log('WO URL', page.url()); log('dialog now:', T((await page.locator('.q-dialog:visible').allInnerTexts()).join('||')).slice(0, 300)); });
await step('line', async () => { const d = page.locator('.q-dialog:visible', { hasText: 'New Line' }).last(); if (!(await d.count())) { await page.locator('main button:visible', { hasText: /^New Line$/ }).first().click(); await page.waitForTimeout(2000); }
  await dlg().locator('.q-field', { hasText: 'Title' }).first().locator('input').first().fill('ZZAUTOTEST AR line'); await page.keyboard.press('Tab'); await page.waitForTimeout(800);
  log('labor rates', JSON.stringify((await pick('Labor Rate', null)).slice(0, 6))); log('LINE DIALOG:', T(await dlg().innerText()).slice(0, 700)); await dump('line');
  const et = fld('Estimated'); if (await et.count()) await et.locator('input').fill('1'); const tt = fld('Tech'); if (await tt.count()) await tt.locator('input').fill('1');
  const la = dlg().getByText('Line Approved', { exact: true }); if (await la.count()) await la.click(); await page.waitForTimeout(500);
  await dlg().locator('button:visible', { hasText: 'Save & Close' }).first().click(); await page.waitForTimeout(3500); log('after line save:', T((await page.locator('.q-dialog:visible').allInnerTexts()).join('||')).slice(0, 200)); });
await step('wo-page', async () => { log('CARD:', T(await page.locator('body').innerText()).match(/S\d+-\d+ .{0,160}/)?.[0]); log('MAIN BUTTONS:', await btns(page.locator('main'))); log('TABS:', JSON.stringify((await page.locator('main .q-tab').allInnerTexts()).map(T))); await dump('wo-page', true); });
await r.browser?.close?.(); process.exit(0);
