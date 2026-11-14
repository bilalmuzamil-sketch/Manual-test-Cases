// s14_discover.mjs — 14 Nov 2026, staging, read-only: the staging ids the seeding recipes need (Exempt tax, a PO category, an inventory part
// for vendor returns), by GET calls only; prints the first rows of each endpoint that answers.
import { stgStart } from './stglib.mjs'; import { mkS } from './stgapi.mjs';
const s = await stgStart(new URL('./s14/', import.meta.url).pathname); const a = mkS(s); const o = {};
const L = (j) => (Array.isArray(j?.data) ? j.data : j?.data?.collection ?? j?.data?.response?.collection ?? j?.collection ?? []);
const tx = await a.get('/api/taxes?search=Exempt'); o.taxExempt = L(tx.j).filter((t) => /exempt/i.test(t.name)).map((t) => [t.id || t.tax_id, t.name]).slice(0, 5);
const tx2 = await a.get('/api/taxes'); o.taxAll = L(tx2.j).map((t) => [t.id || t.tax_id, t.name]).filter((t) => /exempt|gst|no tax|zero/i.test(t[1])).slice(0, 8);
for (const u of ['/api/inventory/categories', '/api/parts-catalogue/categories?search=', '/api/categories', '/api/inventory/category', '/api/parts/categories', '/api/inventory/parts-categories']) { const r = await a.get(u); o[u] = [r.st, L(r.j).slice(0, 3).map((c) => [c.id || c.category_id, c.name])]; }
for (const u of ['/api/inventory/parts?search=P550848', '/api/inventory?search=P550848', '/api/parts-catalogue/parts?search=P550848', '/api/inventory/list?search=P550848', '/api/inventory/inventory-parts?search=P550848']) { const r = await a.get(u); o[u] = [r.st, JSON.stringify(L(r.j).slice(0, 1)).slice(0, 300)]; }
o.vendExisting = L((await a.get('/api/parts-catalogue/vendors?search=ZZAUTOTESTAbcdefghij')).j).map((v) => [v.id || v.vendor_id, (v.name || '').length]);
o.custExisting = L((await a.get('/api/customers?search=ZZAUTOTESTAbcdefghij')).j).map((c) => [c.id || c.company_id, (c.name || '').length]);
console.log(JSON.stringify(o).slice(0, 4000)); await s.close(); process.exit(0);
