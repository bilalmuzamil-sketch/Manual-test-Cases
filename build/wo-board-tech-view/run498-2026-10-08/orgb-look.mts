/** Organisation B (12 Oct 2026, login from the QA lead): sign in with its password and list what is there, read-only. */
import fs from 'node:fs'; import path from 'node:path';
import { EV, t } from './wob.mts';
import { api } from './data.mts';
const { signInWithPassword } = await import('../../global-search/e2e/fixtures/boot.js');
const s: any = await signInWithPassword('/workorders', { envFile: '/tmp/shopview/sv10043-orgb.env' });
const a = api(s.page); const o: any = { url: s.page.url().replace(/https:\/\/[^/]+/, '') };
const arr = (b: any) => Array.isArray(b?.data) ? b.data : (b?.data?.collection ?? b?.data?.organizations ?? b?.data?.workplaces ?? []);
const get = async (u: string) => { const r = await a.get(u); return { status: r.status, rows: arr(r.body), raw: JSON.stringify(r.body).slice(0, 300) }; };
const org = await get('/api/organizations'); o.orgs = org.rows.map((x: any) => `${x.name} ${String(x.id).slice(0, 8)}`); o.orgRaw = org.raw;
for (const u of ['/api/workplaces', '/api/staff/workplaces', '/api/iam/workplaces', '/api/organization/workplaces']) { const r = await get(u); o[u] = { status: r.status, n: r.rows.length, names: r.rows.map((x: any) => `${x.name ?? x.workplace_name} ${String(x.id ?? x.workplace_id).slice(0, 8)}`).slice(0, 6) }; }
const st = await get('/api/staff?limit=100'); o.staff = st.rows.map((x: any) => `${x.first_name} ${x.last_name} | ${x.role_label} | wp ${String(x.workplace_id).slice(0, 8)} | org ${String(x.organization_id ?? '').slice(0, 8)}`).slice(0, 10);
const wo = await get('/api/work-orders?pagination[rowsPerPage]=10'); o.workOrders = { status: wo.status, n: wo.rows.length };
o.storageUser = await s.page.evaluate(() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}')?.data; return { org: u?.organization_id ?? u?.details?.organization_id, wp: u?.details?.default_workplace ?? u?.default_workplace, name: [u?.first_name, u?.last_name].join(' '), keys: Object.keys(u || {}).slice(0, 25) }; } catch { return null; } });
console.log(t(), 'ORGB-LOOK', JSON.stringify(o).replace(/[0-9a-f]{32,}/g, '<h>').slice(0, 3500)); fs.writeFileSync(path.join(EV, 'orgb-look.json'), JSON.stringify(o, null, 1));
await Promise.race([s.browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
