// diff_wo_shape.mjs — compare a work order that FAILS to invoice (one this repro created) against
// existing work orders that were invoiced successfully in the past, to find the discriminating field.
// Read-only against the app; writes nothing.
import fs from 'fs';
import { login, api } from '../../../viu-2026-08-03/tools/qa8582.mjs';
const { sessCookie } = await login('admin');
const WP_HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
await api(sessCookie, 'POST', '/api/iam/change-location', { workplace_id: WP_HD, workplace_timezone: 'America/Edmonton' });

const failWo = process.argv[2];
const list = (await api(sessCookie, 'GET', '/api/work-orders?limit=200')).body?.data?.collection || [];
const byStatus = {};
for (const w of list) byStatus[w.status] = (byStatus[w.status] || 0) + 1;
console.log('work orders visible:', list.length, JSON.stringify(byStatus));

const paid = list.find(w => /paid|invoiced/i.test(w.status || ''));
async function dump(id, label) {
  const v = (await api(sessCookie, 'GET', '/api/work-orders/view/' + id)).body?.data;
  const lines = (await api(sessCookie, 'GET', `/api/work-orders/lines/${id}`)).body?.data?.collection || [];
  fs.writeFileSync(`/tmp/sv8821/shape-${label}.json`, JSON.stringify({ view: v, lines }, null, 1));
  const wo = v?.work_order || v;
  console.log(`\n--- ${label} (${id}) ---`);
  console.log('top-level keys:', Object.keys(v || {}).join(', '));
  console.log('wo keys:', Object.keys(wo || {}).sort().join(', '));
  console.log('lines:', lines.length, 'line keys:', Object.keys(lines[0] || {}).sort().join(', '));
  return { wo, lines };
}
const A = await dump(failWo, 'FAILS');
if (paid) {
  const B = await dump(paid.id || paid.work_order_id, 'PAID');
  const ka = new Set(Object.keys(A.wo || {})), kb = new Set(Object.keys(B.wo || {}));
  console.log('\nWO fields only on PAID:', [...kb].filter(k => !ka.has(k)).join(', ') || '(none)');
  console.log('WO fields only on FAILS:', [...ka].filter(k => !kb.has(k)).join(', ') || '(none)');
  console.log('\nfield-by-field where they differ:');
  for (const k of [...new Set([...ka, ...kb])].sort()) {
    const a = JSON.stringify(A.wo?.[k]), b = JSON.stringify(B.wo?.[k]);
    if (a !== b) console.log('  ', k.padEnd(30), 'FAILS=', String(a).slice(0, 70).padEnd(72), 'PAID=', String(b).slice(0, 70));
  }
} else console.log('\nno paid/invoiced work order found in the first 200');
