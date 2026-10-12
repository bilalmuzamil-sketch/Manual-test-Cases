/** Clock out the shared test technicians (Esther Howard, Ralph Edwards) so a clocked-in check starts clean (12 Oct 2026).
 *  Read: who is clocked in where; then check-out as each person (switch-user), and read back. */
import { open, done } from './session.mts';
import { api } from './data.mts';
import { staffRows } from './staff.mts';
import { HEAVY, LETH } from './profile.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p); const R: any = {};
const D = '@staging.shopview.local';
for (const e of ['esther.howard', 'ralph.edwards']) {
  const who = (await staffRows(a, `zz.wob.${e}${D}`)).find((x: any) => x.email === `zz.wob.${e}${D}`);
  let s = await a.post('/api/switch-user', { user_id: who.id }); if (s.status >= 300) { await a.post('/api/exit-switch-user', {}); s = await a.post('/api/switch-user', { user_id: who.id }); }
  try {
    const o: any = { switch: s.status }; R[e] = o;
    for (const [ln, loc] of [['heavy', HEAVY], ['leth', LETH]]) {
      await a.post('/api/iam/change-location', { workplace_id: loc });
      const raw = await a.get('/api/technician-tasks/my-current-task'); const cur = raw.body?.data; const tid = cur?.technician_task?.id ?? cur?.id;
      o[ln] = { status: raw.status, raw: JSON.stringify(raw.body).slice(0, 220) };
      if (tid) { const c = await a.post('/api/technician-tasks/check-out', { task_id: tid }); o[ln].checkout = [c.status, JSON.stringify(c.body).slice(0, 160)];
        o[ln].after = JSON.stringify((await a.get('/api/technician-tasks/my-current-task')).body).slice(0, 120); } }
    await a.post('/api/iam/change-location', { workplace_id: HEAVY });
  } finally { await a.post('/api/exit-switch-user', {}); }
}
console.log('CLOCKOUT', JSON.stringify(R)); await done(browser);
