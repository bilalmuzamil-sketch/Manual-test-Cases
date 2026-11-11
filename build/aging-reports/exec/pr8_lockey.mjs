// pr8_lockey.mjs — 11 Nov 2026 20:25 UTC: PRODUCTION with the browser's "location" key set the way the QA site's own sign-in leaves it
// (localStorage.location = "<current location id>", JSON string). pr7 showed production's API sign-in leaves NO such key and the three reports
// open "All locations"; the QA site has the key and they open on the current location. Here: set the key to the header's location, reload Sales
// By Customer -> chip + address; then C715584's clicks (Clear selection, Select all -> chip + address); IV and WIP chips. Read-only.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import { settle, chipsOf } from './q3_common.mjs'; import fs from 'fs';
const OUT = new URL('./prod/', import.meta.url).pathname; const o = {}; const B = await bootProdLogin('/reports/sales-by-customer', { viewport: { width: 1440, height: 900 } }); const p = B.page; o.version = B.version;
const IDS = { 'Truck Hill 1': '555206ea-2a33-4ca1-a29a-5431b0f7648c', 'Trucks Hill 2': 'b617914c-16e9-4485-8e8b-193cd86aa416' };
try { await p.waitForTimeout(5000); const h = (await p.locator('header').innerText()).split('\n').map((t) => t.trim()).filter(Boolean); o.cur = h[h.indexOf('notifications') + 1];
  await p.evaluate((id) => localStorage.setItem('location', JSON.stringify(id)), IDS[o.cur]); await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); await settle(p);
  o.sbc = await chipsOf(p); o.url = p.url(); await p.screenshot({ path: OUT + '131-pr8-sbc-with-location-key.png' });
  await p.locator('main button', { hasText: /Location:/ }).first().click(); await p.waitForTimeout(1500); const m = p.locator('.q-menu:visible').last(); o.menu0 = (await m.innerText()).split('\n').map((t) => t.trim()).filter(Boolean);
  await m.getByText('Clear selection', { exact: true }).first().click(); await p.waitForTimeout(2000); o.afterClear = { chips: await chipsOf(p), url: p.url() };
  await m.getByText('Select all', { exact: true }).first().click(); await p.waitForTimeout(2500); o.afterAll = { chips: await chipsOf(p), url: p.url() }; await p.screenshot({ path: OUT + '132-pr8-select-all.png' }); await p.keyboard.press('Escape');
  for (const [k, u] of [['iv', '/reports/inventory-value'], ['wip', '/reports/work-in-progress']]) { await p.goto(B.APP + u, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await settle(p); o[k] = await chipsOf(p); }
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'pr8.json', JSON.stringify(o, null, 1)); console.log('pr8', JSON.stringify(o).slice(0, 2000)); await B.browser.close(); process.exit(0);
