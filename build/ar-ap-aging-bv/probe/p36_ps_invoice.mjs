import { start } from './lib.mjs';
const OUT = new URL('./36/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const menu = async () => (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T);
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 1400);
const dlg = () => page.locator('.q-dialog:visible').last();
const btnIn = async (root, label) => { const bs = root.locator('button:visible'); const tx = (await bs.allInnerTexts()).map(T); const i = tx.indexOf(label); if (i < 0) throw new Error('no button ' + label + ' in ' + JSON.stringify(tx)); await bs.nth(i).click(); };
const field = (root, re) => root.locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: re }) }).first();
const PS = '/parts/part-sale/f966af4d-3243-4faa-ad6d-4dae41cccf8d/part-requests';
await step('add-part', async () => { await go(PS); await page.waitForTimeout(3500); await btnIn(page.locator('main').last(), 'Add Part'); await page.waitForTimeout(2500); log('ADD PART', await dl()); log('labels', JSON.stringify(await dlg().locator('.q-field__label').allTextContents()));
  await field(dlg(), /^Part number/i).click(); await page.keyboard.type('ZZAUTO-PS-PART', { delay: 40 }); await page.waitForTimeout(2500); log('P OPTS', JSON.stringify((await menu()).slice(0, 4)));
  await page.getByText(/Add new special order part/).last().click().catch(e => log('special', e.message.split('\n')[0])); await page.waitForTimeout(1000);
  await dump('add-part-typed'); log('labels2', JSON.stringify(await dlg().locator('.q-field__label').allTextContents())); });
await step('fill', async () => { const d = dlg(); for (const [re, v] of [[/^Description/i, 'ZZAUTOTEST part sale item'], [/^Quantity|^Qty/i, '1'], [/^Cost/i, '100'], [/^Sell|Sell Price|^Price/i, '400']]) { const f = field(d, re); if (await f.count()) { await f.locator('input, textarea').first().fill(v); log('filled', String(re)); } else log('no field', String(re)); }
  await page.waitForTimeout(800); await dump('add-part-filled'); log('DLG BTNS', JSON.stringify((await d.locator('button:visible').allInnerTexts()).map(T))); });
await r.browser?.close?.(); process.exit(0);
