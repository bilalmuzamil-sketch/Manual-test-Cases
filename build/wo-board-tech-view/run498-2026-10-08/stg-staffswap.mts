/** 14 Oct 2026 staging: the four ZZ technicians first made in "Service/Parts" (no Schedule row) give up their emails and names
 *  (renamed "ZZOLD …", Time Clock off) and the four made in "Service" take the canonical emails the suite looks up. */
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { api } from './data.mts';
import { staffRows, HEAVY } from './staff.mts';
const { browser, page: p } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/workorders', key: 'admin' }) as any;
const a = api(p); const D = '@staging.shopview.local'; const o: any = {};
const body = (r: any, over: any) => ({ first_name: r.first_name, last_name: r.last_name, email: r.email, role_id: r.role_id, workplace_id: r.workplace_id ?? HEAVY, job_title: r.job_title, salary_type: r.salary_type, salary: r.salary, billable: !!r.billable, clockable: r.clockable, ...over });
for (const e of ['esther.howard', 'ralph.edwards', 'dana.ortiz', 'jenny.wilson']) {
  const old = (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
  const svc = (await staffRows(a, `zz.wob.${e}.svc${D}`)).find((x) => x.email === `zz.wob.${e}.svc${D}`);
  if (old && !String(old.departments).endsWith('/Service')) {
    const r1 = await a.post(`/api/staff/${old.staff_id}/change`, body(old, { email: `zz.wob.${e}.old1014${D}`, first_name: 'ZZOLD ' + old.first_name, billable: false, clockable: false }));
    o[e + ' old'] = r1.status + (r1.status >= 300 ? ' ' + JSON.stringify(r1.body).slice(0, 160) : '');
  }
  if (svc) { const r2 = await a.post(`/api/staff/${svc.staff_id}/change`, body(svc, { email: `zz.wob.${e}${D}` })); o[e + ' svc'] = r2.status + (r2.status >= 300 ? ' ' + JSON.stringify(r2.body).slice(0, 160) : ''); }
  const now = (await staffRows(a, `zz.wob.${e}${D}`)).find((x) => x.email === `zz.wob.${e}${D}`);
  o[e + ' now'] = now ? `${now.first_name} ${now.last_name} ${JSON.stringify(now.departments)} clock=${now.clockable} bill=${now.billable}` : 'none';
}
console.log(JSON.stringify(o, null, 1)); await browser.close(); process.exit(0);
