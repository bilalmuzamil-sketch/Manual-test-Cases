/**
 * RUN AS OUR OWN TEST ADMIN, NOT AS "Admin ShopView" (2026-10-09). Work Orders choices (pins, columns, fields,
 * display) are saved per user, and on 2026-10-09 the Admin ShopView pins changed mid-run to people no script of
 * ours pins (Brandi Smith, Ayesha Khan, Admin ShopView, Bilal Muzamil) — someone else is using that account on this
 * branch at the same time. Our runs and theirs overwrote each other. So every script now signs in as usual, then
 * switches to "ZZ WOB Runner" (Admin role, Time Clock off so it is never offered as a technician) and works in a
 * page carrying that user's own permissions (viewAs). After acting as a technician, switch back with toRunner().
 */
import type { Browser, Page } from 'playwright';
import { api, candidates, type Api } from './data.mts';
import { APP } from './session.mts';
import { person, roleIds, HEAVY } from './staff.mts';
import { viewAs } from './viewas.mts';
const ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f';
export const RUNNER_EMAIL = 'zz.wob.runner@staging.shopview.local';
export async function asRunner(browser: Browser, main: Page, a0: Api) {
  await a0.post('/api/exit-switch-user', {});
  const roles: any[] = ((await a0.get(`/api/organizations/${ORG}/roles?pagination[rowsPerPage]=1000`)).body?.data?.collection ?? []);
  // the organisation's role list sometimes comes back empty; staff records carry role_label + role_id too
  const fromStaff = await roleIds(a0);
  const admin = roles.find((r) => /^admin(istrator)?$/i.test(r.label ?? r.name ?? ''))?.id ?? Object.entries(fromStaff).find(([l]) => /^admin(istrator)?$/i.test(l))?.[1];
  if (!admin) throw new Error('no Admin role found in this organisation');
  const { row, log } = await person(a0, 'ZZ WOB', 'Runner', { role: admin, email: RUNNER_EMAIL, clockable: false });
  if (!row) throw new Error(`runner not made: ${log.join('; ')}`);
  const me = (await candidates(a0)).find((x) => x.name === 'Admin ShopView');
  // after the first switch every call goes through the runner's own browser: a switch can renew the session cookie,
  // and the sign-in page's older copy then answers 401 (seen 2026-10-09 when switching back from a technician)
  let via: Api = a0;
  const toRunner = async () => {
    let s = await via.post('/api/switch-user', { user_id: row.id });
    if (s.status >= 300) { await via.post('/api/exit-switch-user', {}); s = await via.post('/api/switch-user', { user_id: row.id }); }
    if (s.status >= 300) throw new Error(`switch to runner ${s.status}`);
    await via.post('/api/iam/change-location', { workplace_id: HEAVY, workplace_timezone: 'America/Edmonton' });
  };
  const v = await viewAs(browser, main, a0, row.id, me?.id ?? '', toRunner);
  via = api(v.page);
  await v.page.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await v.page.waitForTimeout(4000);
  // 2026-10-09: a batch that ticks a Status filter leaves it SAVED on this user, and every later list check then starts
  // filtered (an 'Imported' filter hid every work order for an hour). Every batch starts with no saved list filters.
  { const PREF = '/api/users/me/preferences/work-orders-list'; const pv = (await via.get(PREF).catch(() => ({ body: null } as any))).body?.data?.value; if (pv?.filters && Object.keys(pv.filters).length) { await via.put(PREF, { value: { ...pv, filters: {} } }); await v.page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {}); await v.page.waitForTimeout(3000); } }
  const who = (await api(v.page).get('/api/auth/me/fe-permissions')).status;
  return { p: v.page, a: api(v.page), id: row.id as string, staffId: row.staff_id as string, me, toRunner, perms: v.perms, who, log,
    end: async () => { await via.post('/api/exit-switch-user', {}); } };
}
