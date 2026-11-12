// q12_scope.mjs — 12 Nov 2026: evidence pictures for the two tests the QA lead ruled out of scope on the QA site (12 Nov, "1. Please do"):
// C797943 (A/P Summary Vendor menu with 8 vendors or fewer) - picture of the Vendor menu as the QA site has it (search box shown, many vendors) and
// the number of vendors; C715468 (A/R Summary PDF at exactly 2,000 / 2,001 customers) - picture of A/R Summary with its customer count.
// Counts read from the report replies (pagination totals) and the open menu. Output q12/out.json.
import { start, REPORTS } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./q12/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const a = mk(p); const o = {};
const today = new Date().toISOString().slice(0, 10);
const meta = (r) => { const d = r.j?.data || {}; return { st: r.st, keys: Object.keys(d).slice(0, 12), total: d.pagination?.total ?? d.pagination?.rowsNumber ?? d.total ?? d.meta?.total ?? null, n: (d.collection || []).length }; };
o.apRows = meta(await a.get(`/api/reporting/reports/ap-aging-summary?asOfDate=${today}&pagination[page]=1&pagination[rowsPerPage]=10`));
o.arRows = meta(await a.get(`/api/reporting/reports/ar-aging-summary?asOfDate=${today}&pagination[page]=1&pagination[rowsPerPage]=10`));
o.apVendors = meta(await a.get(`/api/reporting/reports/ap-aging-summary/vendors?asOfDate=${today}`));
o.arCustomers = meta(await a.get(`/api/reporting/reports/ar-aging-summary/customers?asOfDate=${today}`));
await s.go(REPORTS.aps); await p.waitForTimeout(5000);
await p.locator('main button', { hasText: /Vendor:/ /* the chip text starts with its icon name, as "place\nLocation:" does */ }).first().click(); await p.waitForTimeout(1500); const m = p.locator('.q-menu').last();
o.menu = { inputs: await m.evaluate((e) => [...e.querySelectorAll('input')].map((i) => i.getAttribute('placeholder'))), items: await m.evaluate((e) => e.querySelectorAll('.q-checkbox').length), head: (await m.innerText()).replace(/\s+/g, ' ').slice(0, 200), box: await m.evaluate((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }) };
o.picAP = await s.shot('C797943-vendor-menu'); await p.keyboard.press('Escape'); await p.waitForTimeout(800);
await s.go(REPORTS.ars); await p.waitForTimeout(5000); o.arFoot = (await p.locator('main').innerText()).replace(/\s+/g, ' ').match(/[^.]{0,60}(customers?|rows?|of \d+)[^.]{0,40}/gi)?.slice(-4);
o.picAR = await s.shot('C715468-ar-summary'); fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o)); await s.close(); process.exit(0);
