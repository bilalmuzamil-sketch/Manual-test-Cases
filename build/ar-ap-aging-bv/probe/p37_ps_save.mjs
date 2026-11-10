import { start } from './lib.mjs';
const OUT = new URL('./37c/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const menu = async () => (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T);
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 1400);
const dlg = () => page.locator('.q-dialog:visible').last();
const btnIn = async (root, label) => { const bs = root.locator('button:visible'); const tx = (await bs.allInnerTexts()).map(T); const i = tx.indexOf(label); if (i < 0) throw new Error('no button ' + label + ' in ' + JSON.stringify(tx)); await bs.nth(i).click(); };
const field = (root, re) => root.locator('.q-field:visible').filter({ has: page.locator('.q-field__label', { hasText: re }) }).first();
const PS = '/parts/part-sale/f966af4d-3243-4faa-ad6d-4dae41cccf8d/part-requests';
await step('add-part', async () => { await go(PS); await page.waitForTimeout(3500); { const bs = page.locator('main').last().locator('button:visible'); const tx = (await bs.allInnerTexts()).map(T); log('main btns', JSON.stringify(tx)); const bb = await bs.nth(tx.indexOf('Add Part')).boundingBox(); await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); } await page.waitForTimeout(2500); log('opened', (await dl()).slice(0, 60));
   await page.keyboard.type('ZZAUTO-PS-PART', { delay: 40 }); await page.waitForTimeout(2500); log('P OPTS', JSON.stringify((await menu()).slice(0, 4)));
  { const bb = await page.evaluate(() => { const e = [...document.querySelectorAll('.q-menu .q-item, .q-menu div')].reverse().find(x => /Add new special order part/.test(x.textContent) && x.getBoundingClientRect().width > 0); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }); log('special bb', JSON.stringify(bb)); if (bb) { await page.mouse.click(bb.x, bb.y); await page.waitForTimeout(1000); } }
  const d = dlg(); for (const [re, v] of [[/^Description/i, 'ZZAUTOTEST part sale item'], [/^Quantity/i, '1'], [/^Cost/i, '100'], [/^Sell Price/i, '400']]) { const f = field(d, re); await f.locator('input, textarea').first().fill(v); }
  await page.waitForTimeout(800); await dump('filled'); await btnIn(d, 'Save & Close'); await page.waitForTimeout(3500); log('DLG left', await dl());
  log('PS ROWS', JSON.stringify((await page.locator('main tbody tr').allInnerTexts()).map(T).filter(Boolean))); log('PS BTNS', JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].filter(Boolean))); await dump('after-add'); });
await step('finance', async () => { await page.locator('main').last().getByText('Finance', { exact: true }).first().click(); await page.waitForTimeout(3000); log('FIN TEXT', T(await page.locator('main').last().innerText()).slice(0, 900)); log('FIN BTNS', JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))].filter(Boolean))); log('FIN labels', JSON.stringify(await page.locator('main .q-field__label').allTextContents())); await dump('finance'); });
await r.browser?.close?.(); process.exit(0);
