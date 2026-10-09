/**
 * Staff for the WO Board cases (2026-10-08), made through the product's own calls:
 * POST /api/iam/create {email, first_name, last_name, role_id, departments, workplace_id} (snake_case,
 * a department is required), then POST /api/staff/{staff_id}/change echoing the record to set
 * clockable / billable. Roles are taken from staff rows of THIS organisation (list-roles spans every
 * organisation, so a label match there can hand back another company's role).
 */
import type { Api } from './data.mts';
import { HEAVY, LETH } from './profile.mts';
export { HEAVY, LETH };
export async function staffRows(a: Api, q = ''): Promise<any[]> {
  const r = await a.get(`/api/staff?limit=200${q ? '&search=' + encodeURIComponent(q) : ''}`);
  return r.body?.data?.collection ?? [];
}
export async function roleIds(a: Api): Promise<Record<string, string>> {
  const m: Record<string, string> = {};
  for (const s of await staffRows(a)) if (s.role_label && s.role_id) m[s.role_label] = s.role_id;
  return m;
}
export async function person(a: Api, first: string, last: string, opts: { role: string; email: string; workplace?: string; clockable?: boolean; billable?: boolean }) {
  let row = (await staffRows(a, opts.email)).find((x) => String(x.email).toLowerCase() === opts.email.toLowerCase());
  const log: string[] = [];
  if (!row) {
    const deps = (await a.get('/api/departments')).body?.data; const dl = Array.isArray(deps) ? deps : deps?.collection ?? [];
    const c = await a.post('/api/iam/create', { email: opts.email, first_name: first, last_name: last, role_id: opts.role, departments: dl.slice(0, 1).map((d: any) => d.id), workplace_id: opts.workplace ?? HEAVY });
    log.push(`create ${c.status}${c.status >= 300 ? ' ' + JSON.stringify(c.body).slice(0, 160) : ''}`);
    row = (await staffRows(a, opts.email)).find((x) => String(x.email).toLowerCase() === opts.email.toLowerCase());
  }
  if (row && (opts.clockable !== undefined && row.clockable !== opts.clockable || opts.billable !== undefined && !!row.billable !== opts.billable)) {
    const ch = await a.post(`/api/staff/${row.staff_id}/change`, { first_name: row.first_name, last_name: row.last_name, email: row.email, role_id: row.role_id, workplace_id: row.workplace_id ?? opts.workplace ?? HEAVY, job_title: row.job_title, salary_type: row.salary_type, salary: row.salary, billable: opts.billable ?? !!row.billable, clockable: opts.clockable ?? row.clockable });
    log.push(`change ${ch.status}${ch.status >= 300 ? ' ' + JSON.stringify(ch.body).slice(0, 160) : ''}`);
    row = (await staffRows(a, opts.email)).find((x) => String(x.email).toLowerCase() === opts.email.toLowerCase());
  }
  return { row, log };
}
