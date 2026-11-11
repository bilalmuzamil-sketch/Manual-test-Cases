// p21d.mjs — 11 Nov 2026: who is the Tech quick-login user on sv11315 (quick-login users list + staff list by email). Read only.
import { start } from './lib.mjs'; import { mk } from './api.mjs';
const s = await start(new URL('./p21/', import.meta.url).pathname, '/administration/staff'); const a = mk(s.page);
const q = await a.get('/api/quick-login/users'); console.log('ql', q.st, JSON.stringify(q.j).slice(0, 800));
for (const u of ['/api/staff?search=tech', '/api/staff?search=ShopView', '/api/staff?per_page=500']) { const r = await a.get(u); const l = r.j?.data?.collection || r.j?.data || []; console.log(u, r.st, Array.isArray(l) ? l.length : '-', JSON.stringify((Array.isArray(l) ? l : []).filter((x) => /shopview\.com|^tech/i.test(x.email || '')).map((x) => [x.id, x.first_name, x.last_name, x.email, x.role?.name, x.workplace?.name])).slice(0, 900)); }
await s.close(); process.exit(0);
