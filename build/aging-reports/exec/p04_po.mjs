// p04_po.mjs — 11 Nov 2026: read one ordered purchase order in full (shape for creating a PO for a new vendor). Read only.
import { start } from './lib.mjs'; import { mk } from './api.mjs';
const OUT = new URL('./p04/', import.meta.url).pathname; const s = await start(OUT); const a = mk(s.page);
await a.post('/api/iam/change-location', { workplace_id: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', workplace_timezone: 'America/Edmonton' });
const l = await a.get('/api/inventory/orders?status=ordered&pagination[rowsPerPage]=5'); console.log('list', l.st, JSON.stringify(l.j).slice(0, 1200));
const first = (l.j?.data?.collection ?? l.j?.data?.orders ?? l.j?.data ?? [])[0]; const id = first?.id ?? first?.order_id;
if (id) { const d = await a.get('/api/inventory/orders/' + id); console.log('detail', d.st, JSON.stringify(d.j).slice(0, 3000)); s.save('order', d.j); }
await s.close(); process.exit(0);
