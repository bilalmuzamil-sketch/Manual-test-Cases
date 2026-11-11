// q2_oldlink.mjs — 11 Nov 2026 ~16:35: C715582 on the QA site (after the release). Production's old drill-down writes
// ".../ar-aging-collection?customerName=<name>&customerId=<id>" and ".../ap-unpaid-invoices?vendorName=<name>&vendorId=<id>" (pr5). Build the same
// form for a QA customer and vendor ("#1 Diesel": customer e2e804d8-…, vendor 772a84c3-…, ids from q1's drill-downs), start on the Dashboard,
// paste each into the address bar (page.goto), and read: page title, any error message, chips, the groups listed. Output q2/out.json + pictures.
import { start, A } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./q2/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/dashboard'); const p = s.page; const o = {};
const L = { ar: A + '/reports/ar-aging-collection?customerName=%231+Diesel&customerId=e2e804d8-f2f3-4a94-8bc9-98c22dc725c8', ap: A + '/reports/ap-unpaid-invoices?vendorName=%231+Diesel&vendorId=772a84c3-4d82-4124-9ca7-66d96837a030' };
for (const [k, u] of Object.entries(L)) { const r = (o[k] = { link: u }); try { await s.go('/dashboard'); await p.waitForTimeout(2000); await p.goto(u, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  r.url = p.url(); r.title = (await p.locator('main').innerText()).split('\n')[0]; r.notes = (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' '));
  r.chips = await p.evaluate(() => [...document.querySelectorAll('main button')].map((b) => b.innerText.replace(/\s+/g, ' ').trim()).filter((t) => /^(\S+ )?(As of|Customer|Vendor|Past due|Location):/.test(t)));
  r.groups = (await p.locator('main tbody tr').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim()).filter((t) => /keyboard_arrow_(right|down)/.test(t)).slice(0, 10); r.pic = await s.shot('C715582-' + k);
} catch (e) { r.err = String(e).slice(0, 200); } }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('q2', JSON.stringify(o).slice(0, 1200)); await s.close(); process.exit(0);
