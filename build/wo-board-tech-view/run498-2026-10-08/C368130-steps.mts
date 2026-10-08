/**
 * C368130 — a location with no technicians (2026-10-08). At ZZAUTOTEST Empty Shop the only eligible technician is
 * Admin ShopView. Changing your OWN Time Clock ends your session, so this runs in steps:
 *   STEP=off   switch Admin ShopView's Time Clock off                 (session ends)
 *   STEP=check sign in again, look at Empty Shop in Tech View and Board View, switch it back on (session ends)
 *   (then check-admin-clock.mts reads it back)
 */
import fs from 'node:fs';
import path from 'node:path';
import { open, done, APP } from './session.mts';
import { api, candidates } from './data.mts';
import { EV, t, shot, display, tab, groups } from './wob.mts';
import { staffRows } from './staff.mts';
const STEP = process.env.ONLY;
const { browser, page: p } = await open('/workorders?tab=all');
const a = api(p);
const adm = (await staffRows(a, 'admin@shopview.com')).find((x) => x.email === 'admin@shopview.com');
const set = (clock: boolean) => a.post(`/api/staff/${adm.staff_id}/change`, { first_name: adm.first_name, last_name: adm.last_name, email: adm.email, role_id: adm.role_id, workplace_id: adm.workplace_id, job_title: adm.job_title, salary_type: adm.salary_type, salary: adm.salary, billable: adm.billable, clockable: clock });
const f = path.join(EV, 'C368130.json');
const R: any = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
if (STEP === 'off') { R.before = adm.clockable; R.off = (await set(false)).status; }
if (STEP === 'check') {
  R.clockableAtCheck = adm.clockable;
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  await p.locator('[data-test-id="profile_menu_button"]').click(); await p.waitForTimeout(1200);
  await p.locator('.q-menu').getByText(/ - \d{3,5}$|ZZAUTOTEST Empty Shop/).first().click(); await p.waitForTimeout(1500);
  await p.locator('.q-menu').filter({ hasText: 'Staging Lethbridge' }).locator('.q-item').filter({ hasText: 'ZZAUTOTEST Empty Shop' }).first().click(); await p.waitForTimeout(6000); await p.keyboard.press('Escape').catch(() => {});
  R.location = await p.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => /Empty Shop| - \\d{3,5}$/.test(l)) || null`);
  await tab(p, 'All'); await display(p, 'Tech View');
  R.tech = { groups: (await groups(p)).map((g) => `${g.name}(${g.count}) [${g.rows.join(' ')}]`), text: ((await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)) as string).replace(/\s+/g, ' ').slice(0, 700) };
  await shot(p, 'C368130-tech');
  await display(p, 'Board View');
  R.board = { columns: await p.evaluate(`[...document.querySelectorAll('[data-test-id^="board_column_"]')].map(e => e.getAttribute('data-test-id')).filter(x => /^board_column_(unassigned|[0-9a-f-]{36})$/.test(x))`), text: ((await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)) as string).replace(/\s+/g, ' ').slice(0, 700) };
  await shot(p, 'C368130-board'); await display(p, 'List');
  R.on = (await set(true)).status;
}
fs.writeFileSync(f, JSON.stringify(R, null, 1)); console.log(t(), STEP, JSON.stringify(R).slice(0, 2500));
await done(browser);
