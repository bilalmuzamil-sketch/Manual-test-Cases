// enumerate_canned.mjs — enumerate EVERY canned line on the sv8582 QA branch, with the
// attributes that could plausibly affect invoice creation (price shape, parts, labour rate).
// Rule 50 exhaustive half: the FULL list, no filtering, and the total stated.
// Output: /tmp/sv8821/canned-full.json  +  a printed table.
import fs from 'fs';
import { login, api } from '../../../viu-2026-08-03/tools/qa8582.mjs';

const { sessCookie, status } = await login('admin');
if (status !== 200) { console.error('LOGIN FAILED', status); process.exit(2); }

const r = await api(sessCookie, 'GET', '/api/work-orders/canned-lines');
const all = r.body?.data?.collection || [];
fs.mkdirSync('/tmp/sv8821', { recursive: true });
fs.writeFileSync('/tmp/sv8821/canned-full.json', JSON.stringify(all, null, 1));

const wps = (await api(sessCookie, 'GET', '/api/staff/my-workplaces')).body?.data?.collection || [];
console.log('HTTP', r.status, '| TOTAL canned lines:', all.length);
console.log('workplaces:', wps.map(w => `${w.name || w.workplace_name}=${w.id}`).join(' | '));

const byWp = {};
for (const c of all) byWp[c.workplace_id] = (byWp[c.workplace_id] || 0) + 1;
console.log('by workplace:', JSON.stringify(byWp));
console.log('with fixed_price:', all.filter(c => c.fixed_price).length,
  '| with parts:', all.filter(c => c.total_parts > 0).length,
  '| zero parts:', all.filter(c => !c.total_parts).length);
console.log('');
const sorted = [...all].sort((a, b) => a.canned_line_name.trim().toLowerCase()
  .localeCompare(b.canned_line_name.trim().toLowerCase()));
sorted.forEach((c, i) => {
  console.log([String(i + 1).padStart(3), c.id,
    c.canned_line_name.trim().padEnd(52).slice(0, 52),
    'fp=' + String(c.fixed_price).padEnd(7),
    'flt=' + String(c.fixed_line_total).padEnd(7),
    'parts=' + String(c.total_parts).padEnd(3),
    'est=' + String(c.time_estimate).padEnd(5),
    'tech=' + String(c.tech_time).padEnd(5),
    'rate=' + String(c.labour_rate).padEnd(6),
    c.labour_type_name].join(' | '));
});
