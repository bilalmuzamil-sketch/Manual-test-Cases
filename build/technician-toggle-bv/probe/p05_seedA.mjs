// Seed for label checks only: ZZAUTOTEST TT staff A (Technician role, Time Clock on, Technician on, current location).
import { start } from './lib.mjs';
const OUT = new URL('./05/', import.meta.url).pathname;
const { r, page, dump, step, go, dlg } = await start(OUT);
const log = (...a) => console.log(...a);
const field = (lab) => dlg().locator('.q-field').filter({ has: page.locator('.q-field__label', { hasText: new RegExp('^' + lab + '$') }) }).first();
const pick = async (f, text) => { await f.click(); await page.waitForTimeout(1200); const items = page.locator('.q-menu:visible .q-item'); log('  options for pick:', JSON.stringify((await items.allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim()).slice(0, 12))); const it = text ? items.filter({ hasText: text }).first() : items.first(); await it.click(); await page.waitForTimeout(1000); };
await step('exists?', async () => { await go('/administration/staff'); log('A exists:', await page.locator('tr', { hasText: 'zzautotest.tt.a@example.com' }).count()); });
if (!(await page.locator('tr', { hasText: 'zzautotest.tt.a@example.com' }).count())) await step('create', async () => {
  await page.getByRole('button', { name: 'New Staff Member' }).first().click(); await page.waitForTimeout(2000);
  await field('First name').locator('input').fill('ZZAUTOTEST TT'); await field('Last name').locator('input').fill('Staff A'); await field('Email').locator('input').fill('zzautotest.tt.a@example.com');
  await pick(field('Role'), /^\s*Technician\s*$/); await pick(field('Location'), 'Staging Heavy Duty - 9919'); await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500); await pick(field('All Departments'), null); await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(500);
  if (!(await page.locator('.q-dialog:visible').count())) throw new Error('dialog closed by Escape');
  await dlg().locator('.q-toggle', { hasText: 'Time Clock' }).first().click(); await page.waitForTimeout(800);
  log('toggles:', await page.locator('.q-dialog:visible .q-toggle').evaluateAll(els => els.map(e => e.innerText.replace(/\s+/g, ' ').trim() + '=' + e.getAttribute('aria-checked')).join(', ')));
  await dump('filled'); await dlg().locator('button:visible', { hasText: 'Save & Close' }).first().click(); await page.waitForTimeout(3500); await dump('after-save', true);
  log('dialogs after save:', await page.locator('.q-dialog:visible').count(), (await page.locator('.q-dialog:visible').allInnerTexts()).join(' || ').replace(/\n+/g, ' | ').slice(0, 500));
});
await step('readback', async () => { await go('/administration/staff'); await page.waitForTimeout(2000); const row = page.locator('tr', { hasText: 'zzautotest.tt.a@example.com' }).first(); log('ROW A:', (await row.innerText().catch(() => 'none')).replace(/\s+/g, ' ')); });
await r.browser?.close?.(); process.exit(0);
