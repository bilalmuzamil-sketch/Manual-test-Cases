/** seed-staff-extra-1022.mts — 22 Oct 2026: the standard technicians the run 498 scripts look up that seed-staff.mts (8 Oct) does not make —
 *  added on staging later: Jenny Wilson, Kristin Watson, Dana Ortiz, Theresa Webb and "Ayesha Khan" (a staging person s1-batch3 picks as
 *  Technician A). Same route as seed-staff.mts (person(): POST /api/iam/create, then the staff change), at the profile's first location,
 *  Technician role, Time Clock on, billable. Run once per new environment (production, 22 Oct 2026), after seed-staff.mts. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api, candidates } from './data.mts'; import { EV, t } from './wob.mts';
import { roleIds, person } from './staff.mts';
const { browser, page: p } = await open('/customers'); const a = api(p);
const tech = (await roleIds(a))['Technician']; const D = '@staging.shopview.local'; const out: any = { tech, people: {} };
for (const [f, l, e] of [['Jenny', 'Wilson', 'jenny.wilson'], ['Kristin', 'Watson', 'kristin.watson'], ['Dana', 'Ortiz', 'dana.ortiz'], ['Theresa', 'Webb', 'theresa.webb'], ['Ayesha', 'Khan', 'ayesha.khan'],
  // 22 Oct (second pass): staging people the scripts pick by name — s2-batchA (Admin ShopView, Bilal Muzamil, Branko Cicovic), s1-batch4b (Cameron Williamson, Floyd Miles)
  ['Admin', 'ShopView', 'admin.shopview'], ['Bilal', 'Muzamil', 'bilal.muzamil'], ['Branko', 'Cicovic', 'branko.cicovic'], ['Cameron', 'Williamson', 'cameron.williamson'], ['Floyd', 'Miles', 'floyd.miles']]) {
  const r = await person(a, f, l, { role: tech, email: `zz.wob.${e}${D}`, clockable: true, billable: 1 as any });
  out.people[e] = { staff_id: r.row?.staff_id, active: r.row?.is_active, role: r.row?.role_label, clockable: r.row?.clockable, billable: r.row?.billable, log: r.log };
  console.log(t(), `${f} ${l}`, JSON.stringify(out.people[e]));
}
out.eligible = (await candidates(a)).map((x) => x.name).filter((n) => /Jenny Wilson|Kristin Watson|Dana Ortiz|Theresa Webb|Ayesha Khan|Esther Howard|Ralph Edwards|Admin ShopView|Bilal Muzamil|Branko Cicovic|Cameron Williamson|Floyd Miles/.test(n));
console.log(t(), 'eligible now', JSON.stringify(out.eligible));
fs.writeFileSync(path.join(EV, 'seed-staff-extra-1022.json'), JSON.stringify(out, null, 1)); await done(browser);
