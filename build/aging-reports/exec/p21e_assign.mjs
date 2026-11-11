// p21e_assign.mjs — 11 Nov 2026: give Tech ShopView (staff ba74948b…, tech@shopview.com) the role "ZZAUTOTEST Aging no Reports"
// (7c070a56…) — or, with BACK=<roleId>, put the role it had back. Records the role before the change (p21/tech-before.json). Rule 107.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p21/', import.meta.url).pathname; const s = await start(OUT, '/administration/staff'); const a = mk(s.page);
const ID = 'ba74948b-5777-4f0c-90fb-2f60d9ce8107', NEW = '7c070a56-c485-4537-9703-7566240766a3';
const d = await a.get('/api/staff/' + ID); const u = d.j?.data?.user || d.j?.data || {}; console.log('staff read', d.st, JSON.stringify(d.j).slice(0, 700));
if (!process.env.BACK) fs.writeFileSync(OUT + 'tech-before.json', JSON.stringify(d.j, null, 1));
const role = process.env.BACK || NEW; const wp = u.workplace_id || u.workplace?.id || u.workplaces?.[0]?.id || 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const r = await a.post(`/api/staff/${ID}/change`, { first_name: u.first_name || 'Tech', last_name: u.last_name || 'ShopView', email: u.email || 'tech@shopview.com', workplace_id: wp, role_id: role });
console.log('change', r.st, JSON.stringify(r.j).slice(0, 300)); const d2 = await a.get('/api/staff/' + ID); console.log('after', JSON.stringify(d2.j).slice(0, 500));
await s.close(); process.exit(0);
