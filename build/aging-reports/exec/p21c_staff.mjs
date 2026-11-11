// p21c_staff.mjs — 11 Nov 2026: find the "Tech ShopView" staff row (the Tech quick-login user) on Settings > Staff. Read only.
import { start } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p21/', import.meta.url).pathname; const s = await start(OUT, '/administration/staff'); const p = s.page; const a = mk(p); await p.waitForTimeout(3000);
const st = await a.get('/api/staff'); const list = st.j?.data?.collection || st.j?.data || []; console.log('api staff', st.st, Array.isArray(list) ? list.length : typeof list);
console.log(JSON.stringify((Array.isArray(list) ? list : []).filter((u) => /tech/i.test(JSON.stringify(u).slice(0, 400))).map((u) => ({ id: u.id, f: u.first_name || u.firstName, l: u.last_name || u.lastName, e: u.email, r: u.role?.name || u.role_name, act: u.active ?? u.status }))).slice(0, 1500));
await p.getByText('Search', { exact: true }).first().click(); await p.waitForTimeout(500); await p.keyboard.type('Tech'); await p.waitForTimeout(3000); await s.shot('s1-search');
console.log((await p.evaluate(() => [...document.querySelectorAll('tbody tr')].map((t) => t.innerText.replace(/\s+/g, ' ')).slice(0, 12))).join('\n'));
await s.close(); process.exit(0);
