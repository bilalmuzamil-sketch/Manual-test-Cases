/** 14 Oct 2026 staging: for each location, switch to it and count work orders per status (List, All tab) — to find a
 *  location where some status (not Imported/Approved) has none, for C581889. Switches back to Heavy Duty at the end. */
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { api } from './data.mts';
import { HEAVY } from './staff.mts';
const { browser, page: p, APP } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/workorders', key: 'admin' }) as any;
const a = api(p); const R: any = {};
const w = await a.get('/api/workplaces'); const rows = w.body?.data?.collection ?? w.body?.data ?? [];
R.locs = rows.map((x: any) => ({ id: x.id ?? x.workplace_id, name: x.name ?? x.workplace_name, tz: x.timezone ?? x.workplace_timezone }));
const statuses = ['estimate', 'in_progress', 'ready_for_review', 'complete', 'invoiced', 'paid', 'declined'];
for (const l of R.locs.filter((x: any) => !/Heavy Duty|E2E Remit/.test(x.name))) {
  const c = await a.post('/api/iam/change-location', { workplace_id: l.id, workplace_timezone: l.tz }); l.switch = c.status; if (c.status >= 300) continue;
  const r = await a.get('/api/work-orders?pagination[rowsPerPage]=200'); const ws = r.body?.data?.work_orders ?? [];
  l.total = ws.length; l.byStatus = ws.reduce((m: any, x: any) => (m[x.status] = (m[x.status] || 0) + 1, m), {});
  l.zero = statuses.filter((s) => !l.byStatus[s]);
}
await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'Asia/Karachi' });
console.log(JSON.stringify(R.locs, null, 0)); await browser.close(); process.exit(0);
