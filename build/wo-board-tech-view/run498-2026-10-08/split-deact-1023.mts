/** split-deact-1023.mts — 23 Oct 2026, PRODUCTION. C707077 unblock, last product route: does renaming the STAFF RECORD while the person
 *  is DEACTIVATED leave the SIGN-IN name behind? Carol Neal: deactivate (iam/change-status, a toggle) -> staff/<id>/change to David Sparks
 *  -> reactivate -> read both names (sign-in = /api/staff row, staff record = /api/technicians .name). If they still move together the
 *  staff record is put back to Carol Neal. Writes EV/split-deact-1023.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const UID = 'cc4f8120-9033-4388-9167-ab91180a6cbc', SID = '55794dab-f7d1-424d-83f1-7a550f34306c';
const list = (b: any) => (b?.data?.collection ?? b?.data ?? []) as any[];
const staffRow = async () => [...list((await a.get('/api/staff?search=Carol&pagination[rowsPerPage]=200')).body), ...list((await a.get('/api/staff?search=David&pagination[rowsPerPage]=200')).body)].find((x: any) => x.id === UID);
const read = async (tag: string) => { const s = await staffRow(); const tr = list((await a.get('/api/technicians?limit=1000&per_page=1000')).body).find((x: any) => x.user_id === UID);
  const v = (await a.get(`/api/staff/${SID}/view`)).body?.data?.collection; o[tag] = { signIn: s ? `${s.first_name} ${s.last_name}` : null, staffView: v ? `${v.first_name} ${v.last_name}` : null, active: v?.is_active, staffRecord: tr?.name ?? null }; return o[tag]; };
const rename = async (f: string, l: string) => { const b = (await a.get(`/api/staff/${SID}/view`)).body.data.collection; const s = await staffRow();
  return (await a.post(`/api/staff/${SID}/change`, { first_name: f, last_name: l, email: b.email, role_id: b.role_id, workplace_id: s?.workplace_id, job_title: b.job_title, salary_type: s?.salary_type, salary: s?.salary, billable: !!s?.billable, clockable: !!s?.clockable })).status; };
try {
  await read('before');
  o.deact = (await a.post('/api/iam/change-status', { id: UID })).status; await read('deactivated');
  o.rename = await rename('David', 'Sparks'); await read('renamed_while_inactive');
  o.react = (await a.post('/api/iam/change-status', { id: UID })).status; await read('after');
  o.split = o.after.staffRecord && o.after.signIn && o.after.staffRecord !== o.after.signIn ? 'YES' : 'NO';
  if (o.split === 'NO') { o.putBack = await rename('Carol', 'Neal'); await read('restored'); }
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
console.log(t(), 'DEACT', JSON.stringify(o)); fs.writeFileSync(path.join(EV, 'split-deact-1023.json'), JSON.stringify(o, null, 1)); await done(browser);
