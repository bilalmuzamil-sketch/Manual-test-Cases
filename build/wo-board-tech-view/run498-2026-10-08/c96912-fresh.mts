/** c96912-fresh.mts — 17 Oct 2026, LIVE (staging free): C96912 step 7 ("Sign out and sign in as [User-B]. Open Work Orders and note the
 *  display" — expected: "The second user still sees List: the choice was saved for your user only").
 *  ROUTE, and why: a REAL sign-in as a brand-new staff user needs the password that user sets from the invitation e-mail; staging's invitation
 *  goes to a @staging.shopview.local address nobody can read, and the Edit Staff Member window offers only "Resend Invitation" (no password
 *  field, probe-staff-window.json). A real log-out of the shared Admin sign-in would end it for every session (L0410). So User-B is a FRESH
 *  ZZAUTOTEST user made now ("ZZAUTOTEST C96912 Fresh <n>", Service Advisor role, Time Clock off) and the app is opened AS that user with the
 *  app's switch-user (viewAs, as runner.mts does), in its own browser window; the reading says so plainly (stepRoute), never "signed in".
 *  [User-A] is the dedicated "ZZAUTOTEST C96916 Back Tester" (nobody else uses it): Board View is chosen through the switcher and read back.
 *  Then User-B: its SAVED display is read from the server BEFORE Work Orders is opened (must be empty), then the screen's display, then the
 *  saved display again. Positive control: User-A's saved display reads board_view in the same run. Output EV/c96912-fresh.json, pictures. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, candidates } from './data.mts';
import { EV, t, tab, display, active } from './wob.mts';
import { person, roleIds, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';
import { startState, setDisplay, prefRead } from './fixup-1017.mts';
const { browser, page: p0 } = await open('/workorders?tab=all'); p0.setDefaultTimeout(30_000); const a0 = api(p0);
const o: any = { exitSwitch: (await a0.post('/api/exit-switch-user', {})).status, stepRoute: 'switch-user to a fresh user in its own window (a real sign-in needs the invitation e-mail password, not reachable on staging)' };
const W = (ms: number, pg = p0) => pg.waitForTimeout(ms);
const PREF = '/api/users/me/preferences/work-orders-list';
const RUNNO = String(Date.now() % 100000);
try {
  const ORG0 = (await import('./profile.mts')).ORG;
  const rolesL: any[] = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a0.get(`/api/organizations/${ORG0}/roles?pagination[rowsPerPage]=1000`)).body?.data);
  const RI = await roleIds(a0); const rid = (re: RegExp) => rolesL.find((r) => re.test(r.label ?? r.name ?? ''))?.id ?? Object.entries(RI).find(([l]) => re.test(l))?.[1];
  const ADMIN = rid(/^admin(istrator)?$/i), SA = rid(/^Service Advisor$/i) ?? ADMIN;
  const UA = (await person(a0, 'ZZAUTOTEST C96916', 'Back Tester', { role: ADMIN, email: 'zz.wob.c96916.back@staging.shopview.local', clockable: false })).row;
  const UB = (await person(a0, 'ZZAUTOTEST C96912', `Fresh ${RUNNO}`, { role: SA, email: `zz.wob.c96912.fresh.${RUNNO}@staging.shopview.local`, clockable: false })).row;
  if (!UA || !UB) throw new Error(`users not made: A ${!!UA}, B ${!!UB}`);
  o.users = { A: `ZZAUTOTEST C96916 Back Tester (${UA.role_label})`, B: `ZZAUTOTEST C96912 Fresh ${RUNNO} (${UB.role_label})` };
  const me = (await candidates(a0)).find((x) => x.name === 'Admin ShopView');
  const as = async (u: any) => { const back = async () => { await a0.post('/api/exit-switch-user', {}); }; const v = await viewAs(browser, p0, a0, u.id, me?.id ?? '', back); const pg = v.page; pg.setDefaultTimeout(30_000);
    await api(pg).post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: process.env.WOB_LOC_TZ || 'Asia/Karachi' }); return v; };
  // User-A: Board View through the switcher, read back (positive control)
  { const v = await as(UA); const pg = v.page; const aa = api(pg);
    try { o.A = { savedBefore: (await prefRead(aa))?.display ?? null }; await pg.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(5000, pg); await tab(pg, 'All').catch(() => {});
      o.A.set = await setDisplay(pg, aa, 'Board View', 'C96912 User-A'); o.A.savedAfter = (await prefRead(aa))?.display ?? null; o.A.screen = await active(pg);
      await pg.screenshot({ path: path.join(EV, 'C96912-fresh-userA-board.png') }).catch(() => {}); } finally { await v.close(); } }
  console.log(t(), 'START STATE set C96912 User-A', JSON.stringify(o.A));
  // User-B: saved display BEFORE Work Orders opens, then the screen, then saved again
  { const v = await as(UB); const pg = v.page; const aa = api(pg);
    try { o.B = { who: (await aa.get('/api/auth/me/fe-permissions')).status, savedRaw: (await aa.get(PREF)).body?.data?.value ?? null };
      o.B.savedDisplayBefore = o.B.savedRaw?.display ?? null;
      console.log(t(), 'START STATE found C96912 User-B (fresh)', JSON.stringify({ user: o.users.B, savedDisplayBefore: o.B.savedDisplayBefore, savedKeys: o.B.savedRaw ? Object.keys(o.B.savedRaw) : null }));
      await pg.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(7000, pg);
      o.B.screen = await active(pg); o.B.switcher = await pg.evaluate(`['List','Tech View','Board View'].map(l => { const e = [...document.querySelectorAll('[aria-label="' + l + '"]')].find(x => x.getBoundingClientRect().width > 0); const b = e && (e.closest('button,.q-btn') || e); return l + '=' + (b ? b.getAttribute('aria-pressed') : 'absent'); })`).catch(() => null);
      o.B.url = pg.url().replace(APP, ''); o.B.windowWidth = await pg.evaluate('innerWidth');
      o.B.savedDisplayAfter = (await prefRead(aa))?.display ?? null;
      await pg.screenshot({ path: path.join(EV, 'C96912-fresh-userB-workorders.png') }).catch(() => {}); } finally { await v.close(); } }
  o.A.savedAtEnd = await (async () => { const v = await as(UA); try { return (await prefRead(api(v.page)))?.display ?? null; } finally { await v.close(); } })();
  console.log(t(), 'C96912 step 7 (fresh User-B)', JSON.stringify({ route: o.stepRoute, A: { saved: o.A.savedAfter, atEnd: o.A.savedAtEnd, screen: o.A.screen }, B: { savedBefore: o.B.savedDisplayBefore, screen: o.B.screen, switcher: o.B.switcher, savedAfter: o.B.savedDisplayAfter } }));
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
await a0.post('/api/exit-switch-user', {}).catch(() => {});
fs.writeFileSync(path.join(EV, 'c96912-fresh.json'), JSON.stringify(o, null, 1)); console.log(t(), 'C96912', JSON.stringify(o).slice(0, 2500)); await done(browser);
