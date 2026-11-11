// q5_default.mjs — 11 Nov 2026 20:15 UTC: why does Sales By Customer open with ONLY the current location ticked on the QA site (production opens
// "All locations")? Read the browser's stored keys on the page (localStorage/sessionStorage names + filter-looking values), the chip; then clear
// every stored key whose name or value mentions a location/filter, reload, read the chip again (the default with nothing remembered).
import { start } from './lib.mjs'; import { settle, chipsOf } from './q3_common.mjs'; import fs from 'fs';
const OUT = new URL('./q5/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const o = {};
const store = () => p.evaluate(() => { const r = {}; for (const [n, st] of [['local', localStorage], ['session', sessionStorage]]) for (let i = 0; i < st.length; i++) { const k = st.key(i); const v = st.getItem(k) || ''; r[n + ':' + k] = /locat|filter|report|sales/i.test(k + v.slice(0, 2000)) ? v.slice(0, 300) : '(len ' + v.length + ')'; } return r; });
try { await s.go('/reports/sales-by-customer'); await p.waitForTimeout(4000); await settle(p); o.chips0 = await chipsOf(p); o.url0 = p.url(); o.store0 = await store(); await p.screenshot({ path: OUT + 'C715584-default-1.png' });
  o.removed = await p.evaluate(() => { const rm = []; for (const st of [localStorage, sessionStorage]) for (const k of Object.keys(st)) { const v = st.getItem(k) || ''; if (/locat|filter|report|sales/i.test(k) || /locationIds|sales-by-customer/i.test(v)) { if (/^(user|fe_permissions)/.test(k)) continue; rm.push(k); st.removeItem(k); } } return rm; });
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await settle(p); o.chips1 = await chipsOf(p); o.url1 = p.url(); await p.screenshot({ path: OUT + 'C715584-default-2.png' });
  await s.go('/reports/inventory-value'); await p.waitForTimeout(4000); await settle(p); o.ivChips = await chipsOf(p); await s.go('/reports/work-in-progress'); await p.waitForTimeout(4000); await settle(p); o.wipChips = await chipsOf(p);
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('q5', JSON.stringify(o).slice(0, 1800)); await s.close(); process.exit(0);
