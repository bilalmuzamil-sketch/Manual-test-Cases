/** Stop Esther Howard's running clock (left running by a failed check-out on 2026-10-08) and read it back. */
import { open, done } from './session.mts';
import { api, candidates } from './data.mts';
import { staffRows, HEAVY } from './staff.mts';
const { browser, page: p } = await open('/customers');
const a = api(p);
await a.post('/api/exit-switch-user', {});
const ES = (await staffRows(a, 'zz.wob.esther.howard@staging.shopview.local'))[0];
const me = (await candidates(a)).find((x) => x.name === 'Admin ShopView')!;
console.log('switch', (await a.post('/api/switch-user', { user_id: ES.id })).status);
await a.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' });
const cur = (await a.get('/api/technician-tasks/my-current-task')).body?.data;
const id = cur?.technician_task?.id ?? cur?.id;
console.log('running', JSON.stringify(cur).slice(0, 300));
if (id) { const r = await a.post('/api/technician-tasks/check-out', { task_id: id }); console.log('check-out', r.status, JSON.stringify(r.body).slice(0, 200)); }
console.log('after', JSON.stringify((await a.get('/api/technician-tasks/my-current-task')).body?.data).slice(0, 200));
const e = await a.post('/api/exit-switch-user', {}); if (e.status >= 300) await a.post('/api/switch-user', { user_id: me.id }); console.log('exit', e.status);
await done(browser);
