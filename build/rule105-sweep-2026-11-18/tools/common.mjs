// Rule 105 sweep helpers (18 Nov 2026). SECRET-FREE: cookies stay in /tmp (boot2 reads /tmp/cln/cookies.json).
// One boot = one session; never share a session between scripts (playbook 16 Nov).
import { boot, rule99, LOC, sleep, save } from '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/report-gaps-2026-11-16/tools/sboot.mjs';
export { boot, rule99, LOC, sleep, save };
export const API = 'https://api.staging.shopview.com/api';
export const OUT = '/home/user/Manual-test-Cases/build/rule105-sweep-2026-11-18';
export const get = (page, p) => page.evaluate(async ([A, p]) => { const r = await fetch(A + p, { credentials: 'include', headers: { Accept: 'application/json' } }); return { s: r.status, j: await r.json().catch(() => null) }; }, [API, p]);
// Server zone per location, read live (playbook: the static list can go stale; DVI Test moved to Pacific/Fiji ~3 Nov).
export async function serverZones(page) {
  const r = await get(page, '/staff/my-workplaces');
  const rows = []; const walk = o => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (o.timezone && (o.name || o.workplace_name)) rows.push({ id: o.id || o.workplace_id, name: o.name || o.workplace_name, timezone: o.timezone }); Object.values(o).forEach(walk); } };
  walk(r.j); return { status: r.s, rows };
}
// Day in a zone for a stored UTC instant, using THIS machine's tz database (python zoneinfo), independent of the browser.
import { execFileSync } from 'child_process';
export function dayIn(isoUtc, zone) {
  return JSON.parse(execFileSync('python3', ['-I', '-c', `import json,datetime as d;from zoneinfo import ZoneInfo as Z
s='${isoUtc}'.replace('Z','+00:00').replace(' ','T')
t=d.datetime.fromisoformat(s)
t=t if t.tzinfo else t.replace(tzinfo=d.timezone.utc)
l=t.astimezone(Z('${zone}'))
print(json.dumps({'stored':'${isoUtc}','zone':'${zone}','local':l.isoformat(),'day':l.strftime('%Y-%m-%d'),'offset_min':int(l.utcoffset().total_seconds()//60)}))`]).toString());
}
