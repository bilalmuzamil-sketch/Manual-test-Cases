/** 14 Oct 2026 — read-only: is the ACCOUNT name (iam view-profile) different from the STAFF record name (/api/staff) for
 *  stg-new5's renamed technicians, and for any other staging technician? For C581895 and Chris's S5-R11b bug. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts';
import { api } from './data.mts';
import { staffRows } from './staff.mts';
import { EV } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
const out: any = { tries: {}, diffs: [] };
const ana = (await staffRows(a, 'zz.wob.acct.ana'))[0];
for (const u of [`/api/iam/view-profile/${ana.id}`, `/api/iam/view-profile/${ana.staff_id}`]) { const r = await a.get(u).catch((e: any) => ({ status: 0, body: String(e).slice(0, 120) })) as any; out.tries[u] = { status: r.status, body: JSON.stringify(r.body).slice(0, 700) }; }
const ok = Object.entries(out.tries).find(([u, v]: any) => v.status === 200 && u.includes(ana.id));
const all = await staffRows(a, ''); out.staffCount = all.length;
if (ok) for (const s of all) { const r: any = await a.get(`/api/iam/view-profile/${s.id}`).catch(() => ({ body: null })); const d = r.body?.data ?? r.body; const fn = d?.first_name ?? d?.firstName ?? d?.user?.first_name, ln = d?.last_name ?? d?.lastName ?? d?.user?.last_name;
  if (fn !== undefined && `${fn} ${ln}` !== `${s.first_name} ${s.last_name}`) out.diffs.push({ staff: `${s.first_name} ${s.last_name}`, account: `${fn} ${ln}`, staff_id: s.staff_id, active: s.is_active, clockable: s.clockable, deps: (s.departments ?? []).map((x: any) => x.name ?? x).join('/') }); }
fs.writeFileSync(path.join(EV, 'probe-acctname2.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1).slice(0, 6000));
await done(browser);
