import { start, A } from './lib.mjs';
import fs from 'fs';
const OUT = new URL('./09/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => s.replace(/\s+/g, ' ').trim();
const WO = fs.readFileSync(new URL('./07/wo-url.txt', import.meta.url), 'utf8').trim().replace(A, '');
const menu = async () => (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T);
const dlgs = async () => JSON.stringify((await page.locator('.q-dialog:visible').allInnerTexts()).map(s => T(s).slice(0, 900)));
const okNotes = async () => { for (let i = 0; i < 2; i++) { const ok = page.locator('.q-dialog:visible button', { hasText: /^Ok$/ }).first(); if (await ok.count()) { await ok.click(); await page.waitForTimeout(1000); } } };
await step('open', async () => { await go(WO); await page.waitForTimeout(2500); await okNotes(); });
await step('edit-line', async () => { await page.locator('main').getByText('ZZAUTOTEST TT LINE 1').first().click(); await page.waitForTimeout(2500); log('EDIT LINE:', await dlgs()); await dump('edit-line');
  const add = page.locator('.q-dialog:visible .q-field', { hasText: 'Add Technician' }).first(); if (await add.count()) { await add.click(); await page.waitForTimeout(1200); log('EDIT LINE ADD TECH first 5:', JSON.stringify((await menu()).slice(0, 5))); await page.keyboard.press('Escape'); await page.waitForTimeout(500); }
  await page.locator('.q-dialog:visible button', { hasText: 'close' }).first().click().catch(() => page.keyboard.press('Escape')); await page.waitForTimeout(1500); log('after close:', await dlgs()); });
await step('edit-labor', async () => { await page.locator('main').getByText('ZZAUTOTEST TT Staff A', { exact: true }).first().click(); await page.waitForTimeout(2500); log('AFTER LABOR CLICK:', await dlgs()); await dump('labor-click'); await page.keyboard.press('Escape'); await page.waitForTimeout(1000); });
await step('tab-more', async () => { const mv = page.locator('main button:visible').filter({ has: page.locator('i:text-is("more_vert")') }).first(); await mv.click(); await page.waitForTimeout(1200); log('TAB-BAR MENU:', JSON.stringify(await menu())); await dump('tabmenu'); const ts = page.locator('.q-menu:visible .q-item', { hasText: /Timesheets/ }).first(); if (await ts.count()) { await ts.click(); await page.waitForTimeout(3000); log('TS URL', page.url()); log('TIMESHEETS:', T(await page.locator('main').innerText()).slice(0, 600)); log('TS BUTTONS:', JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))])); await dump('timesheets', true); } else await page.keyboard.press('Escape'); });
await step('ts-add', async () => { const b = page.locator('main button:visible', { hasText: /Add|New|Manual/ }).first(); if (await b.count()) { log('add btn:', T(await b.innerText())); await b.click(); await page.waitForTimeout(2500); log('ADD TIME DIALOG:', await dlgs()); await dump('ts-add'); const tf = page.locator('.q-dialog:visible .q-field', { hasText: /Technician|Staff/ }).first(); if (await tf.count()) { await tf.click(); await page.waitForTimeout(1200); log('DIALOG TECH LIST first 5:', JSON.stringify((await menu()).slice(0, 5))); await page.keyboard.press('Escape'); } await page.keyboard.press('Escape'); } });
await r.browser?.close?.(); process.exit(0);
