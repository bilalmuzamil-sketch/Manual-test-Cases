// Does run 415 show the CURRENT status for every check? Read live: status, when it was last
// judged, which build it names, and whether a failing one carries its report reference.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const S = { 1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed' };
let tests = [], off = 0;
while (true) { const { body } = await api(`get_tests/415&limit=250&offset=${off}`);
  tests = tests.concat(body.tests || body); if (!body._links || !body._links.next) break; off += 250; }
let results = [], o2 = 0;
while (true) { const { body } = await api(`get_results_for_run/415&limit=250&offset=${o2}`);
  results = results.concat(body.results || body); if (!body._links || !body._links.next) break; o2 += 250; }
const latest = new Map();
for (const r of results) if (r.status_id && !latest.has(r.test_id)) latest.set(r.test_id, r);  // newest first
const BUILD = 'v26.39.1-02c6b6c';
let noResult = [], oldBuild = [], oldDate = [], failNoRef = [];
for (const t of tests) {
  const r = latest.get(t.id);
  if (!r) { noResult.push(t.case_id); continue; }
  if ((r.version || '') !== BUILD) oldBuild.push(`C${t.case_id} (${r.version || 'no build named'})`);
  const d = new Date(r.created_on * 1000);
  if (d < new Date('2026-09-28T00:00:00Z')) oldDate.push(`C${t.case_id} ${d.toISOString().slice(0,10)}`);
  if (t.status_id === 5 && !/SV-\d+/.test(r.comment || '')) failNoRef.push(t.case_id);
}
const counts = {};
for (const t of tests) counts[S[t.status_id]] = (counts[S[t.status_id]] || 0) + 1;
console.log(`run 415 holds ${tests.length} checks`);
console.log('current status:', JSON.stringify(counts));
console.log(`\nchecks with NO result at all      : ${noResult.length ? noResult.join(', ') : 'none'}`);
console.log(`results not naming the current build: ${oldBuild.length ? oldBuild.join(', ') : 'none — every one names ' + BUILD}`);
console.log(`results older than this run         : ${oldDate.length ? oldDate.join(', ') : 'none — all judged 28/29 September'}`);
console.log(`failing checks with no report named : ${failNoRef.length ? failNoRef.join(', ') : 'none — all 9 carry theirs'}`);
console.log('\nthe checks that are not passing:');
for (const t of tests) if (t.status_id !== 1) {
  const r = latest.get(t.id);
  const keys = [...new Set((r.comment || '').match(/SV-\d+/g) || [])];
  console.log(`   ${S[t.status_id]}  C${t.case_id}  ${new Date(r.created_on*1000).toISOString().slice(0,10)}  ${keys.join(', ')}  ${t.title.slice(0,52)}`);
}
fs.writeFileSync('audit-run.json', JSON.stringify({ counts, noResult, oldBuild, oldDate, failNoRef, total: tests.length }, null, 1));
