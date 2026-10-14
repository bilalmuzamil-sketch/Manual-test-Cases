/** 14 Oct 2026 staging: put the four ZZ technicians in the "Service" department (exact name — the Schedule lists Service, not
 *  "Service/Parts"; the cases' preconditions say "the Service department"). Read back, then check the Schedule's resources. */
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { api } from './data.mts';
import { staffRows, HEAVY } from './staff.mts';
const { browser, page: p } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/schedule', key: 'admin' }) as any;
const a = api(p); const o: any = {};
const dr = (await a.get('/api/departments')).body?.data; const deps = Array.isArray(dr) ? dr : dr?.collection ?? [];
const svc = deps.find((d: any) => (d.name ?? d.label) === 'Service'); o.service = svc ? `${svc.name} ${svc.id.slice(0, 8)}` : `none of ${deps.map((d: any) => d.name).join(', ')}`;
for (const e of ['esther.howard', 'ralph.edwards', 'dana.ortiz', 'jenny.wilson']) { const em = `zz.wob.${e}@staging.shopview.local`; const row = (await staffRows(a, em))[0];
  const ch = await a.post(`/api/staff/${row.staff_id}/change`, { first_name: row.first_name, last_name: row.last_name, email: em, role_id: row.role_id, workplace_id: row.workplace_id ?? HEAVY, job_title: row.job_title, salary_type: row.salary_type, salary: row.salary, billable: true, clockable: true, departments: [svc.id] });
  o[e] = `${ch.status} ${JSON.stringify((await staffRows(a, em))[0]?.departments)}${ch.status >= 300 ? ' ' + JSON.stringify(ch.body).slice(0, 200) : ''}`; }
const b = (await a.get(`/api/schedule/board?from=2026-10-14T00:00:00.000Z&to=2026-10-17T00:00:00.000Z`)).body?.data?.board;
o.onSchedule = JSON.stringify(b.resources).includes('Esther'); o.shiftsWithStaff = b.shifts.filter((x: any) => x.staffId).length + '/' + b.shifts.length;
console.log(JSON.stringify(o, null, 1)); await browser.close(); process.exit(0);
