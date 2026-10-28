// Screen = server: for each report, load it (This month), keep the JSON the page itself received, and read the
// Totals line the page shows. SECRET-FREE. Usage: node screen_parity.mjs HD|DVI|LETH|QB
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com', OUT = '/tmp/cln/w2/ev';
const LOC = { HD: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi'], DVI: ['39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto'],
  LETH: ['f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton'], QB: ['25a0d576-b371-4b82-bef4-41ba977f31c2', 'America/Vancouver'] };
const which = process.argv[2] || 'HD'; const [wid, tz] = LOC[which];
const { browser, page } = await boot2('admin', { workplaceId: wid, timezone: tz });
await page.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [wid, tz]);
let bodies = [];
page.on('response', async r => { const u = r.url(); if (u.includes('/api/reporting/') && !u.includes('punch-clock') && r.status() === 200) { try { bodies.push({ url: u, body: await r.json() }); } catch {} } });
const R = { which };
const reports = { sbc: ['/reports/sales-by-customer', '[data-test-id="row_sbc_totals"]', 'sales-by-customer?'], sbr: ['/reports/sales-by-representative', '[data-test-id="row_sbr_totals"]', 'sales-by-representative?'],
  sales: ['/reports/sales', 'tr:has-text("Totals"), tfoot tr, .totals', '/reporting/sales/'], saa: ['/reports/service-advisor-analysis', 'tr:has-text("Totals"), tfoot tr', 'service-advisor-analysis/'],
  te: ['/reports/technician-efficiency', 'tr:has-text("Totals")', 'technician-efficiency/this_month'], tax: ['/reports/sales-tax/invoices', '[data-test-id="row_sales_tax_invoices_total"]', 'sales-tax-report?'] };
for (const [k, [route, sel, key]] of Object.entries(reports)) {
  bodies = [];
  await page.goto(APP + route, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000);
  const t = page.locator(sel).last();
  R[k] = { screen: (await t.innerText().catch(() => '')).replace(/\s+/g, ' '), server: (bodies.filter(b => b.url.includes(key)).pop() || {}).body?.data?.totals || null,
           serverRows: ((bodies.filter(b => b.url.includes(key)).pop() || {}).body?.data?.collection || []).length };
  if (k === 'te') { const c = (bodies.filter(b => b.url.includes(key)).pop() || {}).body?.data?.collection || []; R[k].server = { clocked: c.reduce((a, r) => a + r.technicianClockedHours, 0), tech: c.reduce((a, r) => a + r.technicianTechHours, 0) }; }
}
fs.writeFileSync(`${OUT}/${which}-parity.json`, JSON.stringify(R, null, 1));
for (const [k, v] of Object.entries(R)) if (k !== 'which') console.log(k, '| SCREEN:', v.screen.slice(0, 200), '| SERVER:', JSON.stringify(v.server).slice(0, 300));
await browser.close();
