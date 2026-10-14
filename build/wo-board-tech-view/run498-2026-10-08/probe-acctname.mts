/** 14 Oct 2026 — read-only API probe: where does a technician's ACCOUNT name live on staging, versus the STAFF record name?
 *  For C581895 / Chris's S5-R11b bug. Uses the two technicians stg-new5 made (Account → renamed Staffname). No UI clicks. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts';
import { api, workOrders } from './data.mts';
import { staffRows } from './staff.mts';
import { EV } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
const out: any = {};
const st = (await staffRows(a, 'zz.wob.acct.ana')); out.staff = st.map((x: any) => ({ staff_id: x.staff_id, id: x.id, user_id: x.user_id, first: x.first_name, last: x.last_name, keys: Object.keys(x) }));
const s = st[0]; const uid = s?.user_id ?? s?.id;
for (const u of [`/api/iam/users/${uid}`, `/api/users/${uid}`, `/api/iam/${uid}`, `/api/staff/${s?.staff_id}`, `/api/iam/users?search=zz.wob.acct.ana`, '/api/users/me']) {
  const r = await a.get(u); out[u.replace(uid, '<uid>').replace(s?.staff_id, '<sid>')] = { status: r.status, body: JSON.stringify(r.body).slice(0, 900) }; }
const w = (await workOrders(a, 'ZZAUTOTEST S5R11b Staff Names'))[0]; out.woKeys = w && Object.fromEntries(Object.entries(w).filter(([k, v]) => /tech|lead|name|staff|user/i.test(k)).map(([k, v]) => [k, JSON.stringify(v).slice(0, 200)]));
fs.writeFileSync(path.join(EV, 'probe-acctname.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1).slice(0, 6000));
await done(browser);
