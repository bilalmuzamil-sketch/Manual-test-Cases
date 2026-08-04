// READ-ONLY (GET only). Which date-range presets derive a short Window for Turns/Yr?
// Recovers the divisor the server used from the returned figure: W = units_sold*365/(turns*on_hand).
import fs from 'fs';
import { login, api } from '../../viu-2026-08-03/batch-pv-tu/tools/qa8582.mjs';
const { sessCookie, status } = await login('admin');
if (status !== 200) { console.error('LOGIN FAILED', status); process.exit(2); }
const HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a', LE = 'f8a8b802-7780-4b16-bf10-343caeb616b2';

async function windowFor(label, rangeQs) {
  const r = await api(sessCookie, 'GET', `/api/reporting/reports/parts-velocity?${rangeQs}` +
    `&type=inventory&locations=${HD},${LE}&pagination[page]=1&pagination[rowsPerPage]=500` +
    `&pagination[sortBy]=demand&pagination[descending]=true`);
  const ws = new Map();
  for (const x of r.body?.data?.collection ?? []) {
    if (!x.turns_per_year || !x.on_hand || !x.units_sold) continue;
    const W = +(x.units_sold * 365 / (x.turns_per_year * x.on_hand)).toFixed(3);
    ws.set(W, (ws.get(W) ?? 0) + 1);
  }
  const impliedWindows = [...ws.entries()].sort((a, b) => b[1] - a[1]).map(([W, n]) => ({ W, rows: n }));
  console.log(`${label.padEnd(46)} ${r.status}  impliedWindow=${JSON.stringify(impliedWindows.slice(0,3))}`);
  return { label, rangeQs, status: r.status, impliedWindows };
}
const out = { capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433',
  today: '2026-08-04', probes: [] };
// Presets, with the inclusive whole-day span the spec requires alongside each.
out.probes.push(await windowFor('this_year   (Jan 1 -> Aug 4 : spec 216)', 'range=this_year'));
out.probes.push(await windowFor('this_month  (Aug 1 -> Aug 4 : spec 4)',   'range=this_month'));
out.probes.push(await windowFor('this_quarter(Jul 1 -> Aug 4 : spec 35)',  'range=this_quarter'));
out.probes.push(await windowFor('this_week   (spec = days so far incl.)',  'range=this_week'));
out.probes.push(await windowFor('last_12_months (spec 366 incl.)',         'range=last_12_months'));
out.probes.push(await windowFor('last_month  (Jul 1 -> Jul 31 : spec 31)', 'range=last_month'));
out.probes.push(await windowFor('last_year   (2025 full : spec 365)',      'range=last_year'));
out.probes.push(await windowFor('last_quarter(Apr 1 -> Jun 30 : spec 91)', 'range=last_quarter'));
fs.writeFileSync('turns-presets-probe.json', JSON.stringify(out, null, 1));
console.log('written turns-presets-probe.json');
