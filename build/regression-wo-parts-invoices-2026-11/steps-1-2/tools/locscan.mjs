// Read-only scan of every location except the other worker's: WOs, part sales, stocked parts, labour rates. SECRET-FREE.
import fs from 'fs';
import { start, call, APP } from './common.mjs';
const all = JSON.parse(fs.readFileSync('/tmp/cln/rgwo/workplaces.json')).wps.data.collection;
const { browser, page } = await start({});
await page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(2000);
const res = [];
for (const w of all) {
  if (/Heavy Duty - 9919|Lethbridge - 4310/.test(w.name)) continue;
  const c = await call(page, 'POST', '/api/iam/change-location', { workplace_id: w.id, workplace_timezone: w.timezone });
  const inv = await call(page, 'GET', '/api/inventory/parts?pagination[rowsPerPage]=100');
  const wo = await call(page, 'GET', '/api/work-orders?pagination[rowsPerPage]=5');
  const ps = await call(page, 'GET', '/api/part-sales?pagination[page]=1&pagination[rowsPerPage]=5');
  const lt = await call(page, 'GET', '/api/labour-types');
  const parts = inv.j?.data?.collection || [];
  res.push({ id: w.id, name: w.name, tz: w.timezone, tax: w.tax?.name, change: c.s, inv_rows: parts.length, inv_instock: parts.filter(p => (p.quantity ?? p.qty ?? 0) > 0).length, inv_sample: parts.slice(0, 2).map(p => Object.fromEntries(Object.entries(p).filter(([k]) => /number|desc|quantity|price|cost/i.test(k)))), wo_count: (wo.j?.data?.work_orders || []).length, ps_count: (ps.j?.data?.partSales || []).length, labour: (lt.j?.data?.collection || []).map(l => l.name + ' ' + l.labour_rate + (l.is_default ? '*' : '')) });
}
fs.writeFileSync('/tmp/cln/rgwo/locscan.json', JSON.stringify(res, null, 1));
for (const r of res) console.log(r.name.slice(0, 34), '|', r.tz, '|', r.tax, '| chg', r.change, '| inv', r.inv_rows, 'stock', r.inv_instock, '| wo', r.wo_count, 'ps', r.ps_count, '|', r.labour.join(';').slice(0, 60));
await browser.close();
