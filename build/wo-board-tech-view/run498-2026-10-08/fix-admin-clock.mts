/** Put Admin ShopView's Time Clock back on (switched off for C368130; the switch-back was refused when the session ended) and read it back. */
import { open, done } from './session.mts';
import { api, candidates } from './data.mts';
import { staffRows } from './staff.mts';
const { browser, page: p } = await open('/customers');
const a = api(p);
let adm = (await staffRows(a, 'admin@shopview.com')).find((x) => x.email === 'admin@shopview.com');
console.log('before', adm?.clockable, adm?.is_active, adm?.role_label);
if (adm && !adm.clockable) {
  const r = await a.post(`/api/staff/${adm.staff_id}/change`, { first_name: adm.first_name, last_name: adm.last_name, email: adm.email, role_id: adm.role_id, workplace_id: adm.workplace_id, job_title: adm.job_title, salary_type: adm.salary_type, salary: adm.salary, billable: adm.billable, clockable: true });
  console.log('change', r.status, JSON.stringify(r.body).slice(0, 200));
}
const a2 = api(p);
adm = (await staffRows(a2, 'admin@shopview.com')).find((x) => x.email === 'admin@shopview.com');
console.log('after', adm?.clockable, '| Admin is a lead candidate again:', (await candidates(a2).catch(() => [])).some((x) => x.name === 'Admin ShopView'));
await done(browser);
