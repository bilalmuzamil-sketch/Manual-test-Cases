/** D5 re-check, step 1 (2026-10-09): read how Ayesha Khan is enrolled, before taking her off Heavy Duty. Read-only. */
import { open, done } from './session.mts';
import { api, candidates } from './data.mts';
import { staffRows, HEAVY, LETH } from './staff.mts';
const { browser, page: p } = await open('/workorders');
const a = api(p);
const row = (await staffRows(a, 'ayesha.khan'))[0];
console.log('row keys', Object.keys(row ?? {}).join(','));
console.log('row', JSON.stringify({ staff_id: row?.staff_id, id: row?.id, departments: row?.departments, workplace_id: row?.workplace_id, HEAVY, LETH }));
const v = await a.get(`/api/staff/${row.staff_id}/view`);
console.log('view', v.status, JSON.stringify(v.body).replace(/"(token|password|secret)[^,]*/gi, '').slice(0, 2500));
console.log('candidate here', (await candidates(a)).some((x) => x.name === 'Ayesha Khan'));
const deps = (await a.get('/api/departments')).body?.data; console.log('departments', JSON.stringify(deps).slice(0, 800));
await done(browser);
