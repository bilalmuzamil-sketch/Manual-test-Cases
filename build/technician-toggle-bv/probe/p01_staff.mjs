// Is the Technician switch on this build? Control: staff list loads with rows; then open New Staff Member and one existing member.
import { start } from './lib.mjs';
const OUT = new URL('./01/', import.meta.url).pathname;
const { r, page, dump, step } = await start(OUT);
await page.waitForTimeout(4000);
const head = await page.locator('table thead th, .q-table thead th').allTextContents().catch(() => []);
const rows = await page.locator('table tbody tr, .q-table tbody tr').count().catch(() => 0);
console.log('url', page.url(), '| headers', JSON.stringify(head.map(s => s.trim()).filter(Boolean)), '| rows', rows);
await dump('list');
const btns = (await page.locator('button').allTextContents()).map(s => s.trim()).filter(Boolean);
console.log('buttons', JSON.stringify([...new Set(btns)].slice(0, 30)));
const nb = page.getByRole('button', { name: /New Staff|Add Staff|New/i }).first();
if (await nb.count()) { await nb.click(); await page.waitForTimeout(3000); const t = (await page.locator('.q-dialog, [role=dialog]').last().innerText().catch(() => '')); console.log('NEW FORM TEXT:\n' + t.slice(0, 1500)); console.log('has Technician:', /technician/i.test(t)); await dump('new'); await page.keyboard.press('Escape'); await page.waitForTimeout(1500); }
const first = page.locator('table tbody tr, .q-table tbody tr').first();
if (await first.count()) { await first.click(); await page.waitForTimeout(3500); const t = await page.locator('.q-dialog, [role=dialog]').last().innerText().catch(() => page.locator('body').innerText()); console.log('EDIT FORM TEXT:\n' + t.slice(0, 1500)); console.log('has Technician:', /technician/i.test(t)); await dump('edit'); }
await r.browser?.close?.(); process.exit(0);
