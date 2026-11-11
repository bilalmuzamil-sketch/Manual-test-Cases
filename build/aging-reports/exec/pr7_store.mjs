// pr7_store.mjs — 11 Nov 2026 20:20 UTC: PRODUCTION side of q5: on Sales By Customer, Inventory Value, Work In Progress, read the stored browser keys
// (is there a "location" key = the current location, like the QA site's?) and the Location chip on first open. Read-only.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import { settle, chipsOf } from './q3_common.mjs'; import fs from 'fs';
const OUT = new URL('./prod/', import.meta.url).pathname; const o = {}; const B = await bootProdLogin('/reports/sales-by-customer', { viewport: { width: 1440, height: 900 } }); const p = B.page; o.version = B.version;
const keys = () => p.evaluate(() => Object.fromEntries(Object.keys(localStorage).map((k) => [k, /^(user|fe_permissions|organization_features)/.test(k) ? '(len ' + (localStorage.getItem(k) || '').length + ')' : (localStorage.getItem(k) || '').slice(0, 200)])));
try { await p.waitForTimeout(5000); await settle(p); o.header = (await p.locator('header').innerText()).replace(/\s+/g, ' ').slice(-40); o.keys = await keys(); o.sbc = await chipsOf(p); await p.screenshot({ path: OUT + '130-pr7-sbc-first-open.png' });
  for (const [k, u] of [['iv', '/reports/inventory-value'], ['wip', '/reports/work-in-progress']]) { await p.goto(B.APP + u, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await settle(p); o[k] = await chipsOf(p); }
  o.keysAfter = await keys(); } catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'pr7.json', JSON.stringify(o, null, 1)); console.log('pr7', JSON.stringify(o).slice(0, 2000)); await B.browser.close(); process.exit(0);
