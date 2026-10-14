/** 14 Oct 2026 — staging: sign in, read the Heavy Duty location row (time zone), the test technicians, the build. */
import fs from 'node:fs';
import { open, done, APP } from './session.mts';
import { api } from './data.mts';
import { staffRows } from './staff.mts';
const { browser, page: p } = await open('/administration/locations');
const a = api(p); const R: any = {};
await p.goto(APP + '/administration/locations', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
R.rows = (await p.locator('tbody tr').allInnerTexts()).map((x) => x.replace(/\s+/g, ' ').slice(0, 200));
R.build = await p.evaluate(`[...document.querySelectorAll('div,span')].map(e=>e.textContent||'').find(t=>/^v26\\.\\d+\\.\\d+-[0-9a-f]{7}$/.test(t.trim()))||null`);
for (const e of ['esther.howard', 'ralph.edwards', 'dana.ortiz', 'jenny.wilson']) { const r = (await staffRows(a, `zz.wob.${e}`))[0]; R[e] = r ? { name: `${r.first_name} ${r.last_name}`, role: r.role_label, clock: r.clockable, wp: r.workplace_id, active: r.status ?? r.active } : null; }
R.me = (await a.get('/api/auth/me/fe-permissions')).status;
console.log('PROBE', JSON.stringify(R, null, 1));
fs.writeFileSync('evidence/staging-6-2026-10-14/probe.json', JSON.stringify(R, null, 1)); await done(browser);
