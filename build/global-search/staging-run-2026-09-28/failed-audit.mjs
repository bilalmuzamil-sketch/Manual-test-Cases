// Every failing test in run 415: its test link, its case link, and what its latest comment says -
// in particular whether a ticket link is already in there.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
let tests = [], off = 0;
while (true) { const { body } = await api(`get_tests/415&limit=250&offset=${off}`);
  tests = tests.concat(body.tests || body); if (!body._links || !body._links.next) break; off += 250; }
const failed = tests.filter(t => t.status_id === 5);
console.log('failing tests in run 415:', failed.length, '\n');
const out = [];
for (const t of failed) {
  const { body } = await api(`get_results_for_case/415/${t.case_id}&limit=1`);
  const r = (body.results || body)[0] || {};
  const c = r.comment || '';
  const keys = [...new Set((c.match(/SV-\d+/g) || []))];
  out.push({ case_id: t.case_id, test_id: t.id, title: t.title, version: r.version || null,
             ticketsInComment: keys, comment: c });
  console.log(`C${t.case_id}  test ${t.id}  build ${r.version || '(none)'}  ticket in comment: ${keys.length ? keys.join(', ') : 'NONE'}`);
  console.log(`   ${t.title.slice(0, 84)}`);
}
fs.writeFileSync('failed-audit.json', JSON.stringify(out, null, 1));
