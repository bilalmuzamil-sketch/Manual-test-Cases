/** names-probe-1021.mts — 21 Oct 2026, READ ONLY. Which of a technician's two names is the STAFF RECORD and which is the LOGIN ACCOUNT?
 *  For Carol Neal / David Sparks (our C707077 failure) and Debra Garcia / Lindsay Perez (the SV-11577 pass comment): the full /api/staff row
 *  (every name/email/user field) and /api/staff/<id> if it answers, so the two sources are read from the server, not from a label. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { EV } from './wob.mts'; import { api } from './data.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const pick = (x: any, pre = ''): any => Object.fromEntries(Object.entries(x ?? {}).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v)) ? Object.entries(pick(v, pre + k + '.')) : (/name|email|user|^id$|staff|active|role/i.test(k) ? [[pre + k, v]] : [])));
for (const q of ['Carol', 'Sparks', 'Debra', 'Lindsay', 'Perez']) {
  const r = await a.get(`/api/staff?limit=50&search=${encodeURIComponent(q)}`); const rows = r.body?.data?.collection ?? [];
  o[q] = { status: r.status, rows: rows.map((x: any) => pick(x)) };
  for (const x of rows.slice(0, 3)) { const d = await a.get(`/api/staff/${x.id}`); o[q]['detail_' + x.id] = { status: d.status, body: pick(d.body?.data ?? d.body) }; }
}
fs.writeFileSync(path.join(EV, 'names-probe-1021.json'), JSON.stringify(o, null, 1)); console.log('NAMES', JSON.stringify(o)); await done(browser);
