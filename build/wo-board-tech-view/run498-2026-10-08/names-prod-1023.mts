/** names-prod-1023.mts — 23 Oct 2026, PRODUCTION. Re-measures the 22 Oct "staff name and sign-in name are one shared name" finding
 *  for C707077. That finding read BOTH names from /api/staff, which is the SIGN-IN (account) name list (L0497) — so it never read the
 *  staff record at all. Here the staff record is read from /api/technicians (joined on user_id) next to the sign-in name from /api/staff:
 *  before, after the account is renamed "David Sparks" through account access (the same change the screen's Profile > Edit Profile makes
 *  for the signed-in person), and after exit. Positive control: Esther Howard's two names are read the same way first. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const EM = 'zz.wob.carol.neal@staging.shopview.local';
const techs = async () => ((await a.get('/api/technicians?limit=1000&per_page=1000')).body?.data?.collection ?? []) as any[];
const pair = async (q: string) => { const s = ((await a.get(`/api/staff?limit=50&search=${encodeURIComponent(q)}`)).body?.data?.collection ?? []) as any[]; const T = await techs();
  return s.map((x: any) => { const tt = T.find((y: any) => y.user_id === x.id); return { signIn: `${x.first_name} ${x.last_name}`, staffRecord: tt ? tt.name : '(not in technicians list)', user_id: x.id, staff_id: x.staff_id }; }); };
try {
  o.control = (await pair('Esther')).map((x: any) => ({ signIn: x.signIn, staffRecord: x.staffRecord }));
  const before = (await pair(EM))[0]; if (!before) throw new Error('Carol Neal (seeded 22 Oct) not found by email');
  o.before = before;
  o.switchUser = (await a.post('/api/switch-user', { user_id: before.user_id })).status; await p.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
  o.asWho = JSON.stringify((await a.get('/api/iam/view-profile/')).body?.data?.user ?? null).slice(0, 120);
  const ch: any = await a.post('/api/iam/change-name', { first_name: 'David', last_name: 'Sparks' }); o.changeName = ch.status;
  o.exit = (await a.post('/api/exit-switch-user', {})).status; await p.goto(`${APP}/workorders?tab=all`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  o.after = (await pair(EM))[0];
  o.split = o.after && o.after.signIn !== o.after.staffRecord ? `YES - sign-in "${o.after.signIn}", staff record "${o.after.staffRecord}"` : 'NO - one name';
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
console.log(t(), 'NAMES', JSON.stringify(o)); fs.writeFileSync(path.join(EV, 'names-prod-1023.json'), JSON.stringify(o, null, 1));
await done(browser);
