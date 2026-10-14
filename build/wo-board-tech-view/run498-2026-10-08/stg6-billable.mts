/** 14 Oct 2026 staging: make the four ZZ technicians billable (Rule 107) — they have no Schedule row while non-billable. */
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { api } from './data.mts';
import { staffRows, HEAVY } from './staff.mts';
const { browser, page: p } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/schedule', key: 'admin' }) as any;
const a = api(p); const o: any = {};
for (const e of ['esther.howard', 'ralph.edwards', 'dana.ortiz', 'jenny.wilson']) { const row = (await staffRows(a, `zz.wob.${e}@staging.shopview.local`))[0];
  const ch = await a.post(`/api/staff/${row.staff_id}/change`, { first_name: row.first_name, last_name: row.last_name, email: `zz.wob.${e}@staging.shopview.local`, role_id: row.role_id, workplace_id: row.workplace_id ?? HEAVY, job_title: row.job_title, salary_type: row.salary_type, salary: row.salary, billable: true, clockable: true });
  const back = (await staffRows(a, `zz.wob.${e}@staging.shopview.local`))[0]; o[e] = `${ch.status} billable=${back.billable} clock=${back.clockable}${ch.status >= 300 ? ' ' + JSON.stringify(ch.body).slice(0, 200) : ''}`; }
console.log(JSON.stringify(o)); await browser.close(); process.exit(0);
