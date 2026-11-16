// Read-only: does a candidate location have labour rates, tax, parts in stock, customers? SECRET-FREE.
import fs from 'fs';
import { start, call, APP } from './common.mjs';
const [wpId, tz] = process.argv.slice(2);
const { browser, page } = await start({ workplaceId: wpId, timezone: tz });
await page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);
const out = {};
for (const p of ['/api/labour-types', '/api/labour-types/list', '/api/taxes', '/api/taxes/list', '/api/inventory/parts?limit=20', '/api/inventory/parts/list?limit=20', '/api/work-orders?limit=5', '/api/part-sales?pagination[page]=1&pagination[rowsPerPage]=5', '/api/customers?limit=5', '/api/organizations/settings', '/api/auth/me']) {
  const r = await call(page, 'GET', p); out[p] = { s: r.s, j: r.j };
}
fs.writeFileSync('/tmp/cln/rgwo/loc-' + wpId.slice(0, 8) + '.json', JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out)) console.log(k, v.s, JSON.stringify(v.j)?.slice(0, 250));
await browser.close();
