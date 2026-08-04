// READ-ONLY probe (GET only) — what divisor does Turns/Yr use, and what happens on a 1-day range?
// Spec PV v4 §5 Definitions: "Window — the whole-day span of the selected range, INCLUSIVE of both
// the start and end dates, with a floor of 1 day". Build appears to use the EXCLUSIVE span.
import fs from 'fs';
import { login, api } from '../../viu-2026-08-03/batch-pv-tu/tools/qa8582.mjs';
const { sessCookie, status } = await login('admin');
if (status !== 200) { console.error('LOGIN FAILED', status); process.exit(2); }

const HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
async function rows(label, qs) {
  const r = await api(sessCookie, 'GET',
    `/api/reporting/reports/parts-velocity?${qs}&pagination[page]=1&pagination[rowsPerPage]=100`);
  const col = r.body?.data?.collection ?? [];
  const hit = col.filter(x => x.turns_per_year != null && x.units_sold && x.on_hand);
  return { label, qs, status: r.status, rowsReturned: col.length,
    sample: hit.slice(0, 4).map(x => ({ part_number: x.part_number, units_sold: x.units_sold,
      on_hand: x.on_hand, turns_per_year: x.turns_per_year })) };
}
const out = { capturedAt: new Date().toISOString(), buildMarker: 'v3.4.1-0ed4433', probes: [] };
// A: the range the batch used — Jan 1 -> Aug 4 2026 (inclusive 216 days, exclusive 215)
out.probes.push(await rows('Jan1-Aug4 (inclusive 216 / exclusive 215)',
  `range=custom&start_date=2026-01-01&end_date=2026-08-04&type=inventory&locations=${HD}&search=BRAKECLEAN`));
// B: a 10-day range — inclusive 10, exclusive 9: a big, unmistakable ratio
out.probes.push(await rows('Jul26-Aug4 (inclusive 10 / exclusive 9)',
  `range=custom&start_date=2026-07-26&end_date=2026-08-04&type=inventory&locations=${HD}&search=BRAKECLEAN`));
// C: a SINGLE-day range — inclusive 1, exclusive 0. The spec's "floor of 1 day" exists for this.
out.probes.push(await rows('Aug4-Aug4 single day (inclusive 1 / exclusive 0)',
  `range=custom&start_date=2026-08-04&end_date=2026-08-04&type=inventory&locations=${HD}`));
out.probes.push(await rows('Aug3-Aug3 single day (inclusive 1 / exclusive 0)',
  `range=custom&start_date=2026-08-03&end_date=2026-08-03&type=inventory&locations=${HD}`));
fs.writeFileSync('turns-window-probe.json', JSON.stringify(out, null, 1));
for (const p of out.probes) console.log(p.status, p.label, '->', JSON.stringify(p.sample));
