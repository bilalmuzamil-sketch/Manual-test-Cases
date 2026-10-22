/** tz-source-probe-1022.mts — 22 Oct 2026, READ ONLY. Production's Schedule "now" line reads UTC wall-clock time (8:37 PM at 01:37
 *  Karachi, reading d) although the location, the user and the browser are all Asia/Karachi. Before calling that a product fault
 *  (Rule 104: what would make it MY fault?) read every place a time zone can be stored: the organisation, the signed-in user, the
 *  location (workplace), and the Settings > Settings page; and the Schedule page's own clock pill again, with a picture of each.
 *  Output EV/tz-source-probe-1022.json, pictures EV/tz-source-*.png. Changes nothing. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts';
import { ORG, HEAVY } from './profile.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p); const o: any = { at: new Date().toISOString() };
const zones = (x: any, pre = '', out: any = {}) => { if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) { const kk = pre ? `${pre}.${k}` : k; if (/zone|tz|offset/i.test(k) && (typeof v !== 'object' || v === null)) out[kk] = v; else if (v && typeof v === 'object' && kk.split('.').length < 4) zones(v, kk, out); } return out; };
for (const [n, u] of [['organisation', `/api/organizations/${ORG}`], ['me', '/api/users/me'], ['iam', '/api/iam/me'], ['workplaces', '/api/workplaces'], ['myWorkplaces', '/api/staff/my-workplaces'], ['settings', `/api/organizations/${ORG}/settings`]] as [string, string][]) {
  const r = await a.get(u).catch((e: any) => ({ status: 0, body: String(e) })); o[n] = { status: r.status, zones: zones(r.body?.data ?? r.body) };
  if (n === 'workplaces') { const d = r.body?.data; const l = Array.isArray(d) ? d : d?.collection ?? []; o[n].heavy = zones(l.find((x: any) => x.id === HEAVY)); }
}
o.browser = await p.evaluate(`({ zone: Intl.DateTimeFormat().resolvedOptions().timeZone, now: new Date().toString() })`);
o.localStorage = await p.evaluate(`Object.fromEntries(Object.keys(localStorage).filter(k => /zone|tz|location|workplace/i.test(k)).map(k => [k, String(localStorage.getItem(k)).slice(0, 200)]))`).catch(() => null);
for (const [n, r] of [['settings', '/administration/settings'], ['schedule', '/schedule']] as [string, string][]) {
  await p.goto(APP + r, { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(7000);
  o[`${n}Text`] = (await p.locator('body').innerText().catch(() => '')).split('\n').filter((l) => /zone|UTC|GMT|Karachi|AM|PM/i.test(l)).slice(0, 25);
  await p.screenshot({ path: path.join(EV, `tz-source-${n}.png`) }).catch(() => {}); }
fs.writeFileSync(path.join(EV, 'tz-source-probe-1022.json'), JSON.stringify(o, null, 1)); console.log(t(), 'TZSOURCE', JSON.stringify(o).slice(0, 3000)); await done(browser);
