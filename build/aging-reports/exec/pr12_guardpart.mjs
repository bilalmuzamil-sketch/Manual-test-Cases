// pr12_guardpart.mjs — 11 Nov 2026 21:45 UTC: PRODUCTION (before the release), Rule 107 CRUD: receive one part whose DESCRIPTION starts with "-"
// ("-ZZAUTOTEST P98 apostrophe check") into stock at the current location (purchase order + receive, the same calls as seedlib.bill), then export
// Inventory Value's CSV from production's server and read that part's row: does the description come out as "'-ZZAUTOTEST…" (the guard the QA
// site's exports show) or as "-ZZAUTOTEST…"? Also the screen row. Output prod/pr12.json.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import { randomUUID } from 'crypto'; import fs from 'fs';
const B = await bootProdLogin('/reports/inventory-value', { viewport: { width: 1440, height: 900 } }); const p = B.page; const o = { version: B.version };
const H = { Accept: 'application/json', 'Content-Type': 'application/json' }; const API = (x) => `https://${B.APIH}${x}`;
const get = async (x) => { const r = await B.ctx.request.get(API(x), { headers: H }); let j = null; try { j = await r.json(); } catch {} return { st: r.status(), j }; };
const post = async (x, d) => { const r = await B.ctx.request.post(API(x), { headers: H, data: d }); let j = null; try { j = await r.json(); } catch {} return { st: r.status(), j }; };
const rows = (j) => Array.isArray(j?.data) ? j.data : j?.data?.collection ?? j?.data?.data ?? [];
const DESC = '-ZZAUTOTEST P98 apostrophe check', PN = 'ZZP98-' + (Date.now() % 1e6);
try { const v = rows((await get('/api/parts-catalogue/vendors')).j); o.vendor = v[0] && [v[0].id, v[0].name]; const c = rows((await get('/api/inventory/categories')).j); o.cat = c[0] && [c[0].id, c[0].name];
  const cr = await post('/api/inventory/orders/create', { vendor_id: v[0].id, note: null, items: [{ core_charge: null, core_id: null, ext_price: 5, id: randomUUID(), is_core: false, part_number: PN, price: 5, price_decimal: 5, quantity: '1', manufacturer_id: null, category: c[0].id, description: DESC, itemsPerPackage: null }] }); o.create = [cr.st, JSON.stringify(cr.j).slice(0, 200)];
  const id = cr.j?.data?.order_id; const d = await get('/api/inventory/orders/' + id); const items = (d.j?.data?.order?.items || []).map((i) => ({ ...i, quantity_received: Number(i.quantity_ordered), total: Number(i.total_cost_decimal) }));
  const acc = await post('/api/inventory/orders/accept', { id, invoiceNumber: 'ZZP98' + (Date.now() % 1e6), invoiceDate: new Date().toISOString().slice(0, 10) + 'T18:00:00.000Z', note: 'ZZAUTOTEST', items: JSON.stringify(items), total: 5, orderStatus: 'fulfilled', tax: 0 }); o.accept = [acc.st, JSON.stringify(acc.j).slice(0, 200)];
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); const more = p.locator('main button').filter({ hasText: /more_(horiz|vert)/ }).first(); await more.click(); await p.waitForTimeout(800);
  const w = p.waitForEvent('download', { timeout: 300000 }); await p.locator('.q-menu:visible').last().getByText(/CSV/).first().click(); const dl = await w; const f = new URL('./prod/pr12-iv.csv', import.meta.url).pathname; await dl.saveAs(f);
  const t = fs.readFileSync(f, 'utf8'); o.csvLines = t.split('\n').length; o.rowsWithPN = t.split(/\r?\n/).filter((l) => l.includes(PN)); o.partNumber = PN;
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(new URL('./prod/pr12.json', import.meta.url).pathname, JSON.stringify(o, null, 1)); console.log('pr12', JSON.stringify(o).slice(0, 1500)); await B.browser.close(); process.exit(0);
