// READ-ONLY A/B (GET only). Same part, same locations, same type — ONLY the date-range form changes.
// Decides whether the Turns/Yr divisor defect is scoped to the PRESET ranges or is universal.
import fs from 'fs';
import { login, api } from '../../viu-2026-08-03/batch-pv-tu/tools/qa8582.mjs';
const { sessCookie, status } = await login('admin');
if (status !== 200) { console.error('LOGIN FAILED', status); process.exit(2); }
const HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a', LE = 'f8a8b802-7780-4b16-bf10-343caeb616b2';
const SCOPE = `type=both&locations=${HD},${LE}&search=BRAKECLEAN`;

async function get(label, rangeQs) {
  const r = await api(sessCookie, 'GET',
    `/api/reporting/reports/parts-velocity?${rangeQs}&${SCOPE}&pagination[page]=1&pagination[rowsPerPage]=50`);
  const col = (r.body?.data?.collection ?? []).filter(x => x.part_number === 'BRAKECLEAN' && x.on_hand);
  const rows = col.map(x => {
    const t = x.turns_per_year, us = x.units_sold, oh = x.on_hand;
    // recover the divisor the server actually used:  t = us/W*365/oh  =>  W = us*365/(t*oh)
    const W = t ? +(us * 365 / (t * oh)).toFixed(6) : null;
    return { part_number: x.part_number, units_sold: us, on_hand: oh, turns_per_year: t, impliedWindowDays: W };
  });
  console.log(`${label.padEnd(52)} ${r.status}  ${JSON.stringify(rows)}`);
  return { label, rangeQs, status: r.status, rows };
}
const out = { capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433',
  note: 'impliedWindowDays is derived from the returned figure: W = units_sold*365/(turns_per_year*on_hand). Spec PV v4 §5 requires the INCLUSIVE whole-day span (Jan 1 -> Aug 4 2026 = 216).',
  probes: [] };
out.probes.push(await get('A  range=this_year (the "This Year" preset)', 'range=this_year'));
out.probes.push(await get('B  range=custom 2026-01-01 -> 2026-08-04', 'range=custom&start_date=2026-01-01&end_date=2026-08-04'));
out.probes.push(await get('C  range=this_month (preset)', 'range=this_month'));
out.probes.push(await get('D  range=custom 2026-08-01 -> 2026-08-04', 'range=custom&start_date=2026-08-01&end_date=2026-08-04'));
out.probes.push(await get('E  range=last_year (preset, full calendar year)', 'range=last_year'));
out.probes.push(await get('F  range=custom 2025-01-01 -> 2025-12-31', 'range=custom&start_date=2025-01-01&end_date=2025-12-31'));
fs.writeFileSync('turns-ab-probe.json', JSON.stringify(out, null, 1));
console.log('written turns-ab-probe.json');
