// Rule 113: a failing result carries its ticket number. None of the 16 did. This appends, to each
// one's existing comment, the report filed against it (with its live status) and the owning story
// (with its live status) - every status read from Jira today, not from a note.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const J = k => `https://shopview.atlassian.net/browse/${k}`;
const M = {
  53476: { d: [['SV-10320', 'OBSOLETE']], s: ['SV-9174', 'TESTING QA'] },
  44850: { d: [], s: ['SV-9174', 'TESTING QA'],
           note: 'No report is filed against this check. Two related reports point at the behaviour having been changed on purpose: SV-10547 (Done) asked why that top line did not say what kind of record it was, and SV-10556 (OBSOLETE) asked the same about a missing heading.' },
  44854: { d: [['SV-10188', 'QA Complete — still open, no resolution']], s: ['SV-9165', 'TESTING QA'] },
  55716: { d: [['SV-10340', 'OBSOLETE']], s: ['SV-9165', 'TESTING QA'] },
  55729: { d: [], s: ['SV-9174', 'TESTING QA'],
           note: 'No report is filed against this check. Same two related reports as the other pinned-row check: SV-10547 (Done) and SV-10556 (OBSOLETE).' },
  44898: { d: [], s: ['SV-9174', 'TESTING QA'],
           note: 'No report is filed against this check. SV-10345 (QA Complete, open) asks for the OPPOSITE of what this check requires - it asks for "Show all" to be ADDED on phones, while this check requires no "Show all" at all.' },
  45132: { d: [], s: ['SV-9168', 'TESTING QA'], note: 'No report is filed against this check - the wording inside the phone search box is waiting on a decision.' },
  45134: { d: [], s: ['SV-9174', 'TESTING QA'], note: 'No report is filed against this check. SV-10345 (QA Complete, open) asks for "Show all" to be ADDED on phones, which is the opposite of what this check requires.' },
  45136: { d: [], s: ['SV-9168', 'TESTING QA'], note: 'No report is filed against this check. SV-10345 (QA Complete, open) asks for "Show all" to be ADDED on phones, which is the opposite of what this check requires.' },
  45153: { d: [['SV-10001', 'OBSOLETE']], s: ['SV-9163', 'QA Complete'] },
  45160: { d: [], s: ['SV-9167', 'OBSOLETE'],
           note: 'No report is filed against this check, and none is needed: the work this check covers - search usage tracking - is itself OBSOLETE. It was dropped.' },
  53601: { d: [['SV-10001', 'OBSOLETE']], s: ['SV-9163', 'QA Complete'] },
  55660: { d: [['SV-10060', 'OBSOLETE'], ['SV-10025', 'OBSOLETE']], s: ['SV-9164', 'TESTING QA'] },
  55673: { d: [['SV-10061', 'OBSOLETE']], s: ['SV-9171', 'QA Complete'] },
  55685: { d: [['SV-10025', 'OBSOLETE']], s: ['SV-9164', 'TESTING QA'] },
  55686: { d: [['SV-10061', 'OBSOLETE']], s: ['SV-9171', 'QA Complete'] },
};
let tests = [], off = 0;
while (true) { const { body } = await api(`get_tests/415&limit=250&offset=${off}`);
  tests = tests.concat(body.tests || body); if (!body._links || !body._links.next) break; off += 250; }
const byCase = new Map(tests.map(t => [t.case_id, t]));
const rows = [];
for (const [cid, m] of Object.entries(M)) {
  const { body } = await api(`get_results_for_case/415/${cid}&limit=1`);
  const r = (body.results || body)[0] || {};
  let ref = '\n\n--- WHERE THIS STANDS ---\n';
  if (m.d.length) {
    ref += m.d.map(([k, st]) => `Report raised for this: ${k} — ${st}\n${J(k)}`).join('\n') + '\n';
  } else {
    ref += m.note + '\n';
  }
  ref += `\nThe piece of work this belongs to: ${m.s[0]} — ${m.s[1]}\n${J(m.s[0])}`;
  const obsolete = m.d.length && m.d.every(([, st]) => st === 'OBSOLETE');
  if (obsolete) ref += '\n\nEvery report raised against this check has been closed as no longer relevant, so the product is doing what was decided and this check is the thing that is out of date. Nothing new is being raised. Retiring or rewording it is the QA lead\'s decision.';
  if (m.s[1] === 'OBSOLETE') ref += '\n\nThe piece of work itself is OBSOLETE, so there is nothing to raise against it.';
  const comment = (r.comment || '') + ref;
  const res = await api(`add_result_for_case/415/${cid}`, { method: 'POST', body: { status_id: 5, comment, version: r.version || 'v26.39.1-02c6b6c' } });
  const t = byCase.get(+cid);
  rows.push({ cid: +cid, test_id: t.id, title: t.title, defects: m.d.map(d => d[0]), story: m.s[0], status: res.status });
  console.log(`C${cid} -> ${res.status}  ${m.d.length ? m.d.map(d => d.join(' ')).join(' | ') : 'no report'}  · story ${m.s.join(' ')}`);
}
fs.writeFileSync('failed-refs.json', JSON.stringify(rows, null, 1));
