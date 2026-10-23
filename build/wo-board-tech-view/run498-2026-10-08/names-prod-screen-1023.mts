/** names-prod-screen-1023.mts — 23 Oct 2026, PRODUCTION. The QA lead's route: Profile menu > "Edit Profile" (/profile), signed in AS the
 *  technician (account access). Changes her first/last name on that screen to "Carol Neal" (she reads "David Sparks" in both lists after
 *  names-prod-1023), saves, then reads her sign-in name (/api/staff) and staff record name (/api/technicians) again. Pictures EV/names-screen-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api } from './data.mts'; import { EV, t, toasts } from './wob.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const EM = 'zz.wob.carol.neal@staging.shopview.local';
const techs = async () => ((await a.get('/api/technicians?limit=1000&per_page=1000')).body?.data?.collection ?? []) as any[];
const pair = async () => { const s = ((await a.get(`/api/staff?limit=50&search=${encodeURIComponent(EM)}`)).body?.data?.collection ?? []) as any[]; const T = await techs();
  return s.map((x: any) => { const tt = T.find((y: any) => y.user_id === x.id); return { signIn: `${x.first_name} ${x.last_name}`, staffRecord: tt ? tt.name : '(not in technicians list)', user_id: x.id }; })[0]; };
const sh = (n: string) => p.screenshot({ path: path.join(EV, `names-screen-${n}.png`) }).catch(() => {});
try {
  o.before = await pair(); if (!o.before) throw new Error('not found');
  o.switchUser = (await a.post('/api/switch-user', { user_id: o.before.user_id })).status;
  await p.goto(`${APP}/workorders`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  await p.locator('[data-test-id="profile_menu_button"]').click(); await p.waitForTimeout(1200); await sh('1-profile-menu');
  o.menu = (await p.locator('.q-menu').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
  const ep = p.locator('.q-menu').last().getByText('Edit Profile', { exact: true }).first();
  if (await ep.count()) { await ep.click(); await p.waitForTimeout(5000); o.route = 'menu'; } else { await p.goto(`${APP}/profile`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.route = 'address'; }
  o.url = p.url().replace(APP, '');
  o.fields = await p.evaluate(`[...document.querySelectorAll('.q-field')].filter(f => f.getBoundingClientRect().width > 0).map(f => ({ label: (f.querySelector('.q-field__label') || {}).innerText || '', value: (f.querySelector('input') || {}).value || '' }))`);
  await sh('2-edit-profile-before');
  const setF = async (re: RegExp, v: string) => { const f = p.locator('.q-field').filter({ has: p.locator('.q-field__label', { hasText: re }) }).first(); if (!(await f.count())) return false; const i = f.locator('input').first(); await i.fill(v); return true; };
  o.firstSet = await setF(/First Name/i, 'Carol'); o.lastSet = await setF(/Last Name/i, 'Neal'); await p.waitForTimeout(600);
  const save = p.locator('button, .q-btn, [role=button]').filter({ hasText: 'Change Name' }).last(); o.saveBtn = await save.count();
  if (o.saveBtn) { await save.click(); await p.waitForTimeout(3000); }
  o.messages = await toasts(p); await sh('3-edit-profile-saved');
  o.exit = (await a.post('/api/exit-switch-user', {})).status; await p.goto(`${APP}/workorders?tab=all`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  o.after = await pair();
  o.split = o.after && o.after.signIn !== o.after.staffRecord ? `YES - sign-in "${o.after.signIn}", staff record "${o.after.staffRecord}"` : `NO - one name (${o.after?.signIn})`;
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
console.log(t(), 'NAMES-SCREEN', JSON.stringify(o)); fs.writeFileSync(path.join(EV, 'names-prod-screen-1023.json'), JSON.stringify(o, null, 1));
await done(browser);
