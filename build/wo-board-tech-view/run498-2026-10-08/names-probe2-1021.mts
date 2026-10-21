/** names-probe2-1021.mts — 21 Oct 2026, READ ONLY. Positive control + reading: GET /api/technicians (names by STAFF RECORD, playbook §AL.2 on
 *  another branch) for Carol Neal / David Sparks and Debra Garcia / Lindsay Perez, beside GET /api/staff (names by LOGIN ACCOUNT). */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { EV } from './wob.mts'; import { api } from './data.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const r = await a.get('/api/technicians'); const all = (r.body?.data?.collection ?? r.body?.data ?? r.body ?? []) as any[];
o.status = r.status; o.count = Array.isArray(all) ? all.length : null;
const nm = (x: any) => JSON.stringify(x).match(/"(first_?name|firstName|last_?name|lastName|name|full_?name|email|user_id|staff_id|id)":"[^"]*"/gi)?.join(' ');
o.hits = (Array.isArray(all) ? all : []).filter((x: any) => /Sparks|Carol|Debra|Lindsay/i.test(JSON.stringify(x))).map(nm);
o.sample = Array.isArray(all) && all[0] ? Object.keys(all[0]) : null;
fs.writeFileSync(path.join(EV, 'names-probe2-1021.json'), JSON.stringify(o, null, 1)); console.log('TECHS', JSON.stringify(o)); await done(browser);
