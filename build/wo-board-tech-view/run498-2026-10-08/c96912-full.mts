/** c96912-full.mts — 19 Oct 2026, C96912 "The chosen display follows the user to new sign-ins, devices and locations", every sign-in REAL
 *  (the staging login form, Email + Password + Login), no switch-user, no quick-login. Set-up (Rule 107): two brand-new Admin-role users
 *  with PUBLIC yopmail inboxes ({User-A}, {User-B}); {User-A} also enrolled at Staging Lethbridge so Change Location offers it; each
 *  accepts its invitation from yopmail and sets a password on the app's own page (passwords only in /tmp/qa-cookies/c96912-full.json,
 *  chmod 600). Browsers carry ONLY the staging gate cookie (sv_sso_session), never an app session.
 *  Steps: A signs in > Work Orders > Board View; Logout; A signs in again > Work Orders (expect Board View); second browser, A signs in >
 *  Work Orders (expect Board View); initials > Change Location > Lethbridge > Work Orders (expect Board View); Logout; B signs in > Work
 *  Orders (expect List). Saved preference read from the server at each point. Output EV/c96912-full.json, pictures EV/C96912-full-*.png. */
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
import { chromium, type Page } from 'playwright';
import { open } from './session.mts';
import { api } from './data.mts';
import { EV, t, tab, display, switchLocUI } from './wob.mts';
import { person, roleIds, staffRows, LETH } from './staff.mts';
import { screenDisplay } from './fixup-1017.mts';
const APP = process.env.GS_APP || 'https://app.staging.shopview.com'; const API = 'https://api.staging.shopview.com';
const SEC = '/tmp/qa-cookies/c96912-full.json'; const R: any = {}; const save = () => fs.writeFileSync(path.join(EV, 'c96912-full.json'), JSON.stringify(R, null, 1));
const strip = (u: string) => u.replace(/[0-9a-f]{16,}|[A-Za-z0-9_%-]{30,}/g, '<token>');
// set-up: two users through the admin session's API
const S = await open('/workorders'); const a = api(S.page); const roles = await roleIds(a); const tag = String(Date.now()).slice(-6);
const dd = ((d: any) => Array.isArray(d) ? d : d?.collection ?? [])((await a.get('/api/departments')).body?.data); const SVC = dd.find((d: any) => (d.name ?? d.label) === 'Service')?.id;
const mk = async (k: string) => { const email = `zzwob-c96912-${k.toLowerCase()}-${tag}@yopmail.com`; await person(a, 'ZZAUTOTEST', `C96912 User-${k} ${tag}`, { role: roles['Admin'], email });
  const row = (await staffRows(a, email.split('@')[0])).find((x: any) => String(x.email).toLowerCase() === email); return { k, email, box: email.split('@')[0], staff_id: row?.staff_id, name: `ZZAUTOTEST C96912 User-${k} ${tag}` }; };
const UA = await mk('A'); const UB = await mk('B'); R.users = { A: { ...UA }, B: { ...UB } };
R.users.A.enrolLeth = (await a.post('/api/staff/enrollment/create', { staffId: UA.staff_id, workplaceId: LETH, departmentId: SVC })).status;
await S.browser.close().catch(() => {}); console.log(t(), 'START STATE set C96912', JSON.stringify(R.users)); save();
// browsers: gate cookie only
const PORT = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim();
const sso = (/sv_sso_session=([^;\s]+)/.exec(fs.readFileSync(process.env.WOB_SSO_FILE || '/tmp/qa-cookies/staging-sso.txt', 'utf8')) || [])[1];
const b = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: `http://127.0.0.1:${PORT}` }, args: ['--no-sandbox', '--ignore-certificate-errors'] });
const scale = Number(process.env.QA_DPR || 1);
const newCtx = async () => { const c = await b.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: scale, timezoneId: 'Asia/Karachi' });
  await c.addCookies(['app.staging.shopview.com', 'api.staging.shopview.com', 'auth.staging.shopview.com'].map((d) => ({ name: 'sv_sso_session', value: sso, domain: d, path: '/', secure: true, sameSite: 'None' as const }))); const pg = await c.newPage(); pg.setDefaultTimeout(20_000); return pg; };
const W = (pg: Page, ms: number) => pg.waitForTimeout(ms); const shot = (pg: Page, n: string) => pg.screenshot({ path: path.join(EV, `C96912-full-${n}.png`) }).catch(() => {});
const perm = (pg: Page) => pg.evaluate(`fetch('${API}/api/auth/me/fe-permissions', { credentials: 'include' }).then(r => r.status).catch(() => 0)`) as Promise<number>;
const saved = (pg: Page) => pg.evaluate(`fetch('${API}/api/users/me/preferences/work-orders-list', { credentials: 'include', headers: { Accept: 'application/json' } }).then(r => r.json()).then(j => (j && j.data && j.data.value && j.data.value.display) || null).catch(() => 'read failed')`);
const who = (pg: Page) => pg.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ').trim()).catch(() => null);
const pw: Record<string, string> = {};
async function accept(u: any) { const pg = await newCtx(); const o: any = {};
  for (let i = 0; i < 8 && !o.href; i++) { await pg.goto(`https://yopmail.com/en/?login=${u.box}`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(pg, 5000);
    const fm = pg.frame({ name: 'ifmail' }); o.href = fm ? await fm.evaluate(`(() => { const a = [...document.querySelectorAll('a')].find(x => /confirm-invitation/.test(x.href)); return a ? a.href : null; })()`).catch(() => null) : null; if (!o.href) await W(pg, 20000); }
  if (!o.href) { await pg.context().close(); return { error: 'no invitation in the inbox' }; }
  await pg.goto(o.href.replace(/^http:\/\//, 'https://'), { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(pg, 6000); o.page = strip(pg.url());
  pw[u.k] = 'Zz!' + crypto.randomBytes(9).toString('base64url') + '9a'; fs.writeFileSync(SEC, JSON.stringify(Object.fromEntries(Object.entries(pw).map(([k, v]) => [k, { email: k === 'A' ? UA.email : UB.email, password: v }]))), { mode: 0o600 });
  const pws = pg.locator('input[type=password]:visible'); o.pwInputs = await pws.count(); for (let i = 0; i < o.pwInputs; i++) await pws.nth(i).fill(pw[u.k]);
  await pg.locator('button:visible').filter({ hasText: /^\s*Login\s*$/i }).first().click().catch(() => {}); await W(pg, 7000); o.after = strip(pg.url());
  await pg.context().close(); delete o.href; return o; }
async function signIn(pg: Page, u: any, tagx: string) { await pg.goto(`${APP}/login`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(pg, 5000);
  await pg.locator('input[type=email]:visible').first().fill(u.email); await pg.locator('input[type=password]:visible').first().fill(pw[u.k]);
  await pg.locator('button:visible').filter({ hasText: /^\s*Login\s*$/i }).first().click().catch(() => {}); await W(pg, 9000);
  const o = { how: 'login form: Email, Password, Login', url: pg.url().replace(APP, '').slice(0, 60), permissions: await perm(pg), topBar: await who(pg) }; await shot(pg, `${tagx}-signed-in`); return o; }
async function signOut(pg: Page, tagx: string) { await pg.goto(`${APP}/workorders?tab=all`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(pg, 4000);
  await pg.locator('[data-test-id="profile_menu_button"]').click().catch(() => {}); await W(pg, 900); const so = pg.locator('.q-menu').getByText('Logout', { exact: true }).last(); const n = await so.count(); if (n) { await so.click(); await W(pg, 6000); }
  const o = { logoutItem: n, url: pg.url().replace(APP, '').slice(0, 60), permissions: await perm(pg) }; await shot(pg, `${tagx}-signed-out`); return o; }
const goWO = async (pg: Page) => { await pg.goto(`${APP}/workorders?tab=all`, { waitUntil: 'domcontentloaded' }).catch(() => {}); await W(pg, 6000); await tab(pg, 'All').catch(() => {}); await W(pg, 1500); };
const read = async (pg: Page, n: string) => { const o = { display: (await screenDisplay(pg) as any)?.active ?? null, saved: await saved(pg), topBar: await who(pg) }; await shot(pg, n); return o; };
try {
  R.acceptA = await accept(UA); R.acceptB = await accept(UB); save(); if (R.acceptA.error || R.acceptB.error) throw new Error('invitation: ' + JSON.stringify([R.acceptA, R.acceptB]));
  const p1 = await newCtx();
  R.s1 = await signIn(p1, UA, 's1-A'); await goWO(p1); R.s1.before = await read(p1, 's1-wo-before');
  await display(p1, 'Board View'); await W(p1, 2500); R.s2 = await read(p1, 's2-board-chosen');                      // steps 1-2
  R.s3out = await signOut(p1, 's3-A'); R.s3in = await signIn(p1, UA, 's3-A-again'); await goWO(p1); R.s4 = await read(p1, 's4-after-sign-in'); // steps 3-4
  const p2 = await newCtx(); R.s5in = await signIn(p2, UA, 's5-A-second-browser'); await goWO(p2); R.s5 = await read(p2, 's5-second-browser'); await p2.context().close(); // step 5
  R.s6loc = await switchLocUI(p1, 'Staging Lethbridge'); await goWO(p1); R.s6 = await read(p1, 's6-second-location');               // step 6
  R.s7out = await signOut(p1, 's7-A'); R.s7in = await signIn(p1, UB, 's7-B'); await goWO(p1); R.s7 = await read(p1, 's7-user-b');    // step 7
  R.verdict = { s4: R.s4.display, s5: R.s5.display, s6: R.s6.display, s7: R.s7.display, pass: R.s4.display === 'Board View' && R.s5.display === 'Board View' && R.s6.display === 'Board View' && R.s7.display === 'List' && R.s7.saved !== 'board_view' };
} catch (e: any) { R.error = String(e?.message || e).slice(0, 300); }
save(); console.log(t(), 'C96912', JSON.stringify(R)); await b.close(); process.exit(0);
