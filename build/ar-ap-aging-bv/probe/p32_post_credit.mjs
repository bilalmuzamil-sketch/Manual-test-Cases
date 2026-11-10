import { start } from './lib.mjs';
const OUT = new URL('./32/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const nav = async (name) => { await go('/parts/inventory'); await page.waitForTimeout(2000); await page.locator('a:visible, .q-item:visible').filter({ hasText: new RegExp('^\\s*\\S*\\s*' + name + '\\s*$') }).first().click(); await page.waitForTimeout(3000); };
const M = () => page.locator('main').last();
const field = (root, re) => root.locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: re }) }).first();
await step('post-credit', async () => { await nav('Returns'); const row = page.locator('main tbody tr').filter({ hasText: 'ZZAUTOTEST-SLIP-1' }).first(); await row.locator('.q-checkbox').first().click(); await page.waitForTimeout(1000); await page.getByRole('button', { name: 'Receive Credit' }).click(); await page.waitForTimeout(3500);
  await field(M(), /Credit memo number/i).locator('input').fill('ZZAUTOTEST-CR-1');
  const d = field(M(), /Credit Date/i).locator('input'); await d.click(); await page.waitForTimeout(800); log('date popup', T((await page.locator('.q-menu:visible, .q-dialog:visible').allInnerTexts()).join('|')).slice(0, 200)); await page.keyboard.press('Escape');
  log('date input type', await d.getAttribute('type'), await d.getAttribute('readonly'), 'val', await d.inputValue()); await d.fill('10/15/2026').catch(e => log('fill', e.message.split('\n')[0])); await page.keyboard.press('Tab'); await page.waitForTimeout(800); log('date val', await d.inputValue());
  const tax = field(M(), /^Tax$/).locator('input'); if (await tax.count()) { await tax.fill('0'); await page.keyboard.press('Tab'); }
  await dump('credit-filled'); await page.getByRole('button', { name: 'Post Credit' }).click(); await page.waitForTimeout(3500); log('after post', page.url()); log('DLG', T((await page.locator('.q-dialog:visible').allInnerTexts()).join('|')).slice(0, 400)); await dump('after-post');
  const dlgB = page.locator('.q-dialog:visible button'); if (await dlgB.count()) { log('dlg btns', JSON.stringify((await dlgB.allInnerTexts()).map(T))); } });
await step('returns-after', async () => { await nav('Returns'); log('ROW', T(await page.locator('main tbody tr').filter({ hasText: 'ZZAUTOTEST-SLIP-1' }).first().innerText().catch(() => 'not in default list'))); log('filters', JSON.stringify([...new Set((await page.locator('main button:visible').allInnerTexts()).map(T))])); });
await r.browser?.close?.(); process.exit(0);
