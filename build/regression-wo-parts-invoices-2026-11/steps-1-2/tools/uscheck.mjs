import fs from 'fs';
import { start, call, APP } from './common.mjs';
const WP = '41369a91-00f8-4cef-95e3-cd0fe3cdaea3';
const { browser, page } = await start({ workplaceId: WP, timezone: 'America/Denver' });
await page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(2000);
const out = {};
for (const p of ['/api/inventory/bin-locations', '/api/taxes', '/api/inventory/categories', '/api/parts-catalogue?limit=5', '/api/parts-catalogue/list?limit=5', '/api/canned-lines?limit=5', '/api/work-orders/canned-lines', '/api/vendors?limit=3', '/api/parts-catalogue/vendors?limit=3']) {
  const r = await call(page, 'GET', p); out[p] = { s: r.s, j: r.j };
}
fs.writeFileSync('/tmp/cln/rgwo/uscheck.json', JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out)) console.log(k, v.s, JSON.stringify(v.j)?.slice(0, 200));
const tx = out['/api/taxes'].j.data.collection; for (const t of tx) console.log('TAX', t.name, t.isDefault, t.isEnabledLabor, t.isEnabledParts, t.isEnabledShopSupplies, JSON.stringify(t.rates).slice(0, 200));
await browser.close();
