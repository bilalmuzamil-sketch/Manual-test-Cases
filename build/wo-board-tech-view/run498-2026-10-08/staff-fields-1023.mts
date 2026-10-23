/** staff-fields-1023.mts — 23 Oct 2026, PRODUCTION, read-only: every field of Carol Neal's staff record (/api/staff/<id>/view), her row in
 *  /api/technicians and in /api/staff — to see WHICH field the technicians list names a person by (C707077 unblock). */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const list = (b: any) => (b?.data?.collection ?? b?.data ?? []) as any[];
o.view = (await a.get('/api/staff/55794dab-f7d1-424d-83f1-7a550f34306c/view')).body;
o.tech = list((await a.get('/api/technicians?limit=1000&per_page=1000')).body).find((x: any) => x.user_id === 'cc4f8120-9033-4388-9167-ab91180a6cbc');
o.staff = list((await a.get('/api/staff?limit=50&search=carol')).body)[0];
fs.writeFileSync(path.join(EV, 'staff-fields-1023.json'), JSON.stringify(o, null, 1)); console.log(t(), 'FIELDS', JSON.stringify(o).slice(0, 7000)); await done(browser);
