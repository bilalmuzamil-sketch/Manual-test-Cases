import { start } from './lib.mjs';
const OUT = new URL('./39/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const menu = async () => (await page.locator('.q-menu:visible .q-item').allInnerTexts()).map(T);
const dl = async () => T((await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ')).slice(0, 1000);
const M = () => page.locator('main').last();
const clickBtn = async (root, label) => { const bs = root.locator('button:visible'); const tx = (await bs.allInnerTexts()).map(T); const i = tx.indexOf(label); if (i < 0) throw new Error('no button ' + label + ' in ' + JSON.stringify(tx)); const bb = await bs.nth(i).boundingBox(); await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); };
const ciState = async () => page.evaluate(() => [...document.querySelectorAll('button')].filter(b => /Create Invoice/.test(b.textContent)).map(b => ({ dis: b.disabled, cls: /disabled/.test(b.className), title: b.getAttribute('title') || '' })));
const PS = '/parts/part-sale/f966af4d-3243-4faa-ad6d-4dae41cccf8d/part-requests';
await step('authorize', async () => { await go(PS); await page.waitForTimeout(3500); await clickBtn(M(), 'Authorize'); await page.waitForTimeout(2500); log('AUTH DLG', await dl()); const db = page.locator('.q-dialog:visible button'); if (await db.count()) log('auth dlg btns', JSON.stringify((await db.allInnerTexts()).map(T))); await dump('authorize'); });
await step('status', async () => { const d = page.locator('.q-dialog:visible'); if (await d.count()) { const tx = (await d.locator('button').allInnerTexts()).map(T); const i = tx.findIndex(x => /Authorize|Confirm|Save|Yes/.test(x)); if (i >= 0) { await d.locator('button').nth(i).click(); await page.waitForTimeout(2500); } }
  await go(PS); await page.waitForTimeout(3500); const row = M().locator('tbody tr').filter({ hasText: 'ZZAUTOTEST part sale item' }).first(); log('ROW', T(await row.innerText())); log('badge', T(await M().locator('.q-badge, .q-chip').first().innerText().catch(() => '')));
  const st = row.locator('.q-field').filter({ hasText: /Requested|Ordered|Received|Status/ }).last(); log('status fields', await st.count()); const cells = (await row.locator('td').allInnerTexts()).map(T); log('cells', JSON.stringify(cells));
  await row.locator('td').nth(cells.length - 2).click(); await page.waitForTimeout(1200); log('STATUS OPTS', JSON.stringify(await menu())); await page.keyboard.press('Escape');
  await M().getByText('Finance', { exact: true }).first().click(); await page.waitForTimeout(3000); log('CI', JSON.stringify(await ciState())); await page.locator('button').filter({ hasText: 'Create Invoice' }).first().hover(); await page.waitForTimeout(1000); log('tooltip', T((await page.locator('.q-tooltip:visible').allInnerTexts()).join('|'))); await dump('finance'); });
await r.browser?.close?.(); process.exit(0);
