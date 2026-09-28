// Add C137996 to run 415. Rule 34: a partial case_ids list DELETES tests and their results, so the
// list sent is the FULL union of what the run already holds plus the one new case. Everything the
// run currently holds is snapshotted to disk first, results included, so a bad write is provable
// and recoverable.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const NEW = 137996;
let tests = [], off = 0;
while (true) {
  const { body } = await api(`get_tests/415&limit=250&offset=${off}`);
  tests = tests.concat(body.tests || body);
  if (!body._links || !body._links.next) break; off += 250;
}
let results = [], o2 = 0;
while (true) {
  const { body } = await api(`get_results_for_run/415&limit=250&offset=${o2}`);
  results = results.concat(body.results || body);
  if (!body._links || !body._links.next) break; o2 += 250;
}
fs.writeFileSync('run415-snapshot-before-add.json', JSON.stringify({ when: new Date().toISOString(), tests, results }, null, 1));
console.log(`snapshot: ${tests.length} tests, ${results.length} results saved to disk`);
const ids = tests.map(t => t.case_id);
if (ids.includes(NEW)) { console.log('C' + NEW + ' is already in the run — nothing to do'); process.exit(0); }
const union = [...new Set([...ids, NEW])];
console.log(`sending ${union.length} case ids (was ${ids.length}) — union only`);
const { status, body } = await api('update_run/415', { method: 'POST', body: { case_ids: union } });
console.log('update_run ->', status);
if (status !== 200) { console.log(JSON.stringify(body).slice(0, 300)); process.exit(1); }
// READ BACK: the count must have gone UP by exactly one and every old result must still be there
let after = [], o3 = 0;
while (true) {
  const { body } = await api(`get_tests/415&limit=250&offset=${o3}`);
  after = after.concat(body.tests || body);
  if (!body._links || !body._links.next) break; o3 += 250;
}
let ra = [], o4 = 0;
while (true) {
  const { body } = await api(`get_results_for_run/415&limit=250&offset=${o4}`);
  ra = ra.concat(body.results || body);
  if (!body._links || !body._links.next) break; o4 += 250;
}
const lost = ids.filter(i => !after.map(t => t.case_id).includes(i));
console.log(`after: ${after.length} tests (${tests.length} before), ${ra.length} results (${results.length} before)`);
console.log('cases lost:', lost.length ? lost.join(', ') : 'none');
console.log('C' + NEW + ' present:', after.some(t => t.case_id === NEW));
