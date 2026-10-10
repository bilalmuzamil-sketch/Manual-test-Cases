/** C97012 prep: why does the staff search not return Tech ShopView? Try name, email and the full list (admin session). */
import { open } from './session.mts';
import { api } from './data.mts';
import { staffRows } from './staff.mts';
const { browser, page } = await open('/customers'); const a = api(page);
const show = (rows: any[]) => rows.filter((x) => /tech/i.test(`${x.first_name} ${x.last_name} ${x.email}`)).map((x) => `${x.first_name} ${x.last_name} <${x.email}> staff=${!!x.staff_id} role=${x.role_label} wp=${x.workplace_name ?? x.workplace_id ?? ''} active=${x.is_active ?? x.status ?? ''}`).slice(0, 12);
for (const q of ['Tech', 'Tech ShopView', 'tech@shopview.com', 'ShopView', '']) { const r = await staffRows(a, q); console.log('Q', JSON.stringify(q), r.length, JSON.stringify(show(r))); }
for (const u of ['/api/staff?limit=200&include_inactive=1', '/api/staff?limit=200&status=all', '/api/staff?limit=200&page=2']) { const r = await a.get(u); const c = r.body?.data?.collection ?? []; console.log('U', u, r.status, c.length, JSON.stringify(show(c)), JSON.stringify(r.body?.data?.pagination ?? r.body?.meta ?? '').slice(0, 160)); }
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
