/**
 * clocks-stg4.mts — 15 Oct 2026, CLEAN-UP step near the start of the fourth pass on STAGING (after role-viewonly-stg4.mts).
 * WHY: C368196 (sort-fix5.mts) and C368176 (high1-batch.mts) left Dana Ortiz's, Ralph Edwards' and Esther Howard's time clocks
 * running in the second pass (judge/wave8c.json); a running clock blocks the next clock-in ("You are already clocked into
 * different line") and changes Clocked In readings in later checks.
 * WHAT: for every test technician — the ".svc" Esther Howard / Ralph Edwards / Dana Ortiz / Jenny Wilson and every active, Time
 * Clock-on staff member whose email starts "zz.wob." or "zzautotest" or whose name starts "ZZAUTOTEST" — take their session for a
 * moment (switch-user), read their current clock (GET /api/technician-tasks/my-current-task), Clock Out if one is running
 * (POST /api/technician-tasks/check-out), read it back, and hand the session back (exit-switch-user). Nothing else is changed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done } from './session.mts';
import { api } from './data.mts';
import { EV, t } from './wob.mts';
import { staffRows } from './staff.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p); const R: any = { stopped: [], checked: 0, errors: [] };
R.exitSwitch = (await a.post('/api/exit-switch-user', {}).catch(() => ({ status: 0 }))).status;
const seen = new Map<string, any>();
for (const q of ['zz.wob.', 'zzautotest', 'ZZAUTOTEST', 'esther.howard', 'ralph.edwards', 'dana.ortiz', 'jenny.wilson'])
  for (const r of await staffRows(a, q)) if (r?.id && !seen.has(r.id)) seen.set(r.id, r);
const people = [...seen.values()].filter((r) => r.is_active && r.clockable && (/^(zz\.wob\.|zzautotest)/i.test(String(r.email)) || /^ZZAUTOTEST/i.test(String(r.first_name)) || /^(esther\.howard|ralph\.edwards|dana\.ortiz|jenny\.wilson)/i.test(String(r.email))));
R.people = people.length;
for (const r of people) {
  const who = `${r.first_name} ${r.last_name} <${r.email}>`;
  try {
    const s = await a.post('/api/switch-user', { user_id: r.id }); if (s.status >= 300) { R.errors.push(`${who}: switch ${s.status}`); continue; }
    R.checked++;
    const cur = (await a.get('/api/technician-tasks/my-current-task')).body?.data;
    if (cur?.technician_task?.id) {
      const out = await a.post('/api/technician-tasks/check-out', { task_id: cur.technician_task.id });
      const after = (await a.get('/api/technician-tasks/my-current-task')).body?.data?.technician_task?.id ?? null;
      R.stopped.push(`${who}: was on "${cur.technician_task.label ?? '?'}" since ${cur.technician_task.start_date ?? '?'} -> clock out ${out.status}, running now: ${after ? 'YES' : 'no'}`);
    }
  } catch (e: any) { R.errors.push(`${who}: ${String(e?.message || e).slice(0, 100)}`); }
  finally { await a.post('/api/exit-switch-user', {}).catch(() => {}); }
}
console.log(t(), 'CLOCKS', JSON.stringify(R).slice(0, 6000)); fs.writeFileSync(path.join(EV, 'clocks-stg4.json'), JSON.stringify(R, null, 1));
await done(browser, R.stopped.some((x: string) => / YES$/.test(x)) ? 5 : 0);
