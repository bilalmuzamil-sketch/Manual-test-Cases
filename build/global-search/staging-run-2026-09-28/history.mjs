// Did these ever pass? Every result each failing case has ever had in run 415, oldest first.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const S = { 1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed' };
const IDS = [53476, 44850, 44854, 55716, 55729, 44898, 45132, 45134, 45136, 45153, 45160, 53601, 55660, 55673, 55685, 55686];
const out = {};
for (const cid of IDS) {
  let all = [], off = 0;
  while (true) {
    const { body } = await api(`get_results_for_case/415/${cid}&limit=250&offset=${off}`);
    const arr = body.results || body;
    all = all.concat(arr);
    if (!body._links || !body._links.next) break; off += 250;
  }
  all.reverse();                                   // TestRail returns newest first
  const rows = all.filter(r => r.status_id).map(r => ({
    when: new Date(r.created_on * 1000).toISOString().slice(0, 16).replace('T', ' '),
    status: S[r.status_id] || r.status_id, version: r.version || '',
  }));
  out[cid] = rows;
  const passes = rows.filter(r => r.status === 'Passed');
  console.log(`\nC${cid}  — ${rows.length} results, ${passes.length} of them Passed`);
  for (const r of rows) console.log(`   ${r.when}  ${r.status.padEnd(7)} ${r.version}`);
}
fs.writeFileSync('failed-history.json', JSON.stringify(out, null, 1));
