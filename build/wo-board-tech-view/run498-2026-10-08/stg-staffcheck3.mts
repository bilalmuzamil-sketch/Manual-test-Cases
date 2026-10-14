/** check the alias: the suite's usual emails resolve to the Service-department technicians; tidy the ZZOLD names */
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { api } from './data.mts';
import { staffRows, HEAVY } from './staff.mts';
const { browser, page: p } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/workorders', key: 'admin' }) as any;
const a = api(p); const D = '@staging.shopview.local'; const o: any = {};
for (const e of ['esther.howard', 'ralph.edwards', 'dana.ortiz', 'jenny.wilson']) {
  const old = (await staffRows(a, `zz.wob.${e}.old1014${D}`))[0] ?? (await a.get(`/api/staff?limit=200&search=ZZOLD`)).body?.data?.collection?.find((x: any) => x.email === `zz.wob.${e}${D}`);
  const r = (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
  o[e] = r ? `${r.first_name} ${r.last_name} ${JSON.stringify(r.departments)} staff=${r.staff_id.slice(0, 8)} clock=${r.clockable}` : 'none';
}
const olds = ((await a.get(`/api/staff?limit=200&search=ZZOLD`)).body?.data?.collection ?? []);
for (const x of olds) { const fn = x.first_name.replace(/^(ZZOLD )+/, 'ZZOLD '); if (fn !== x.first_name) await a.post(`/api/staff/${x.staff_id}/change`, { first_name: fn, last_name: x.last_name, email: x.email, role_id: x.role_id, workplace_id: x.workplace_id ?? HEAVY, job_title: x.job_title, salary_type: x.salary_type, salary: x.salary, billable: false, clockable: false }); }
o.olds = ((await a.get(`/api/staff?limit=200&search=ZZOLD`)).body?.data?.collection ?? []).map((x: any) => `${x.first_name} ${x.last_name}`);
console.log(JSON.stringify(o, null, 1)); await browser.close(); process.exit(0);
