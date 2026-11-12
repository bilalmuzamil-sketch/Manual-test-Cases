// q18b_iv.mjs — 12 Nov 2026: C797943 check of the PRD's model: in the same 1-vendor organization, Inventory Value's Vendor filter menu (S5-R13:
// "Vendor exactly as Inventory Value's Vendor filter … as there, the search box shows only when there are more than 8 vendors") read top to bottom,
// and A/P Aging Detail / A/P Unpaid Invoices' Vendor menus too. Does the native menu show an "All vendors" row with 8 vendors or fewer?
import { start } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./q18/', import.meta.url).pathname; const s = await start(OUT, '/reports/inventory-value'); const p = s.page; const o = {};
for (const [k, path] of [['iv', '/reports/inventory-value'], ['apd', '/reports/ap-aging-detail'], ['apu', '/reports/ap-unpaid-invoices']]) {
  try { await s.go(path); await p.waitForTimeout(3500); await p.locator('main button', { hasText: /Vendor:/ }).first().click(); await p.waitForTimeout(1500); const m = p.locator('.q-menu').last();
    o[k] = await m.evaluate((e) => ({ inputs: [...e.querySelectorAll('input:not([type=checkbox])')].map((i) => i.getAttribute('placeholder')), lines: e.innerText.split('\n').map((t) => t.trim()).filter(Boolean) })); o[k].pic = await s.shot('C797943-' + k + '-menu'); await p.keyboard.press('Escape'); } catch (e) { o[k] = { err: String(e).slice(0, 200) }; } }
fs.writeFileSync(OUT + 'iv.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o)); await s.close(); process.exit(0);
