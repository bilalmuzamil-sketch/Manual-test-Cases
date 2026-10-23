/** seed-split-1023.mts — 23 Oct 2026, PRODUCTION. Unblock C707077 (QA lead: "Do whatever it takes"): a technician whose STAFF RECORD name
 *  differs from the SIGN-IN name. Renames keep one name (L0554). Route tried here: add a NEW staff member at a SECOND location with the
 *  email of an existing sign-in (Carol Neal) but a different typed name ("David Sparks") — the way staging's split pairs were most likely
 *  made. Reads back both names at both locations before/after. Sign-in name = Settings > Staff row (/api/staff); staff record name =
 *  /api/technicians .name for that user_id. Writes EV/seed-split-1023.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts'; import { HEAVY, roleIds } from './staff.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const EM = 'zz.wob.carol.neal@staging.shopview.local';
const list = (b: any) => (b?.data?.collection ?? b?.data ?? []) as any[];
const go = async (id: string) => (await a.post('/api/iam/change-location', { workplace_id: id, workplace_timezone: 'Asia/Karachi' })).status;
const read = async (tag: string) => { const s = list((await a.get(`/api/staff?limit=500&search=${encodeURIComponent(EM)}`)).body)[0];
  const T = list((await a.get('/api/technicians?limit=1000&per_page=1000')).body); const tr = s ? T.filter((x: any) => x.user_id === s.id) : [];
  o[tag] = { signIn: s ? `${s.first_name} ${s.last_name}` : null, user_id: s?.id ?? null, staff_id: s?.staff_id ?? null, staffRecords: tr.map((x: any) => ({ id: x.id, name: x.name })) }; return o[tag]; };
try {
  const W = list((await a.get('/api/workplaces?limit=200')).body); const L2 = W.find((w: any) => /Trucks Hill 2/.test(w.name)); o.second = L2 ? `${L2.name} ${L2.id}` : null;
  await go(HEAVY); await read('home_before');
  await go(L2.id); await read('second_before');
  const roles = await roleIds(a); const deps = list((await a.get('/api/departments')).body);
  const c = await a.post('/api/iam/create', { email: EM, first_name: 'David', last_name: 'Sparks', role_id: roles['Technician'], departments: deps.slice(0, 1).map((d: any) => d.id) });
  o.create = `${c.status} ${JSON.stringify(c.body).slice(0, 300)}`;
  await read('second_after');
  await go(HEAVY); await read('home_after');
  const s2 = o.second_after, h2 = o.home_after;
  o.split = [...(s2.staffRecords || []), ...(h2.staffRecords || [])].some((r: any) => r.name !== h2.signIn) ? 'YES' : 'NO';
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
finally { o.restore = await go(HEAVY); }
console.log(t(), 'SPLIT', JSON.stringify(o)); fs.writeFileSync(path.join(EV, 'seed-split-1023.json'), JSON.stringify(o, null, 1)); await done(browser);
