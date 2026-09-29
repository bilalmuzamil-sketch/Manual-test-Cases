// The QA lead's instruction: on every check failing because of an obsolete ticket or story, put a
// NEW comment on top naming the report, who marked it obsolete and when, and move it to Retest.
// Every name and date below was read from that ticket's own change history in Jira today.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const J = k => `https://shopview.atlassian.net/browse/${k}`;
const T = { 'SV-10001': ['Milos Vasic', '23 September 2026'], 'SV-10025': ['Milos Vasic', '23 September 2026'],
            'SV-10060': ['Milos Vasic', '23 September 2026'], 'SV-10061': ['Branko Cicovic', '18 September 2026'],
            'SV-10320': ['Bilal Muzamil', '21 September 2026'], 'SV-10340': ['Milos Vasic', '25 September 2026'],
            'SV-9167':  ['Sinisa Nogic', '16 September 2026'] };
const CASES = [
  [53476, ['SV-10320'], 'a count somewhere in the search reads higher than twenty'],
  [55716, ['SV-10340'], 'where two results are otherwise identical, the one changed most recently does not come first'],
  [45153, ['SV-10001'], 'a part that is in the catalogue but has never been stocked cannot be found, so there is no row to open'],
  [53601, ['SV-10001'], 'a part that is in the catalogue but has never been stocked cannot be found'],
  [45160, ['SV-9167'],  'picking a result does not record a usage-tracking event', 'work'],
  [55660, ['SV-10060', 'SV-10025'], 'part of a word taken from the middle of a name does not find the record'],
  [55685, ['SV-10025'], 'typing a name brings back other, differently spelled names'],
  [55673, ['SV-10061'], 'pressing Enter can open the wrong record - the row under the mouse pointer becomes the one Enter opens'],
  [55686, ['SV-10061'], 'the right record is listed first, but pressing Enter opens a different one - the row under the mouse pointer'],
];
const B = 'v26.39.1-02c6b6c';
const failures = [];
for (const [cid, keys, what, kind] of CASES) {
  const lines = keys.map(k => `${J(k)} — marked Obsolete by ${T[k][0]} on ${T[k][1]}`).join('\n');
  const noun = kind === 'work' ? 'The work covering this was raised here' : (keys.length > 1 ? 'The defects for this were raised here' : 'The defect for this was raised here');
  const comment =
`THIS CHECK IS NOT A PRODUCT FAULT — THE REPORT BEHIND IT HAS BEEN MARKED OBSOLETE.

${noun}:
${lines}

So the product is behaving as the team decided, and this check still describes the older behaviour. Moved to Retest on 29 September 2026 for a decision on whether to retire it or reword it.

What the check looks for, and what the product does instead: ${what}. Measured on the shared test site, build ${B}, on 28-29 September 2026.

No new report is being raised, and nothing here is waiting on a developer.`;
  const r = await api(`add_result_for_case/415/${cid}`, { method: 'POST', body: { status_id: 4, comment, version: B } });
  if (r.status !== 200) failures.push(`C${cid} -> HTTP ${r.status}`);
  console.log(`C${cid} -> Retest -> ${r.status}   ${keys.join(' + ')}  (${keys.map(k => T[k][0]).join(', ')})`);
}
const { body: run } = await api('get_run/415');
console.log(`\nRUN 415 NOW: ${run.passed_count} passed · ${run.failed_count} failed · ${run.retest_count} retest · ${run.blocked_count} blocked · ${run.untested_count} untested`);
if (failures.length) { console.log('🔴 DID NOT LAND:'); failures.forEach(f => console.log('   ' + f)); process.exit(1); }
console.log('every result landed.');
