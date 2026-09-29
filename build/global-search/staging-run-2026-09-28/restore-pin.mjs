// I overrode the QA lead's own result on these two. Restoring his Passed, with the divergence
// recorded in the comment so the run still carries the whole truth.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const B = 'v26.39.1-02c6b6c';
const txt = (extra) => `Passed — restored to the QA lead's own result, 29 September 2026, build ${B}.

HIS RULING: "This feature has been taken off." The single line at the very top, above the sections, was withdrawn from the product on purpose. So the product is doing what was decided, and there is nothing to raise.${extra}

I briefly changed this to Failed earlier today and that was wrong of me — he had already judged it, and I overrode him without asking. Restored.

ONE THING STILL OPEN, and it is a wording matter, not a fault: what this check ASKS FOR still describes the line that has been withdrawn. I have not touched that field — changing it needs him to tell me to, naming the check. So anyone reading this check later will see it asking for something the product no longer does. It wants retiring or rewording; that is his call and I have put it to him.

--- WHERE THIS STANDS ---
No report is filed against this check, and none should be. Two related reports from 28 September show the change going in:
SV-10547 — Done — https://shopview.atlassian.net/browse/SV-10547
SV-10556 — OBSOLETE — https://shopview.atlassian.net/browse/SV-10556

The piece of work this belongs to: SV-9174 — TESTING QA
https://shopview.atlassian.net/browse/SV-9174`;
for (const [cid, extra] of [[44850, ''], [55729, ' The exact number does still outrank a customer whose name matches the same text — only the separate pinned line is gone.']]) {
  const r = await api(`add_result_for_case/415/${cid}`, { method: 'POST', body: { status_id: 1, comment: txt(extra), version: B } });
  console.log(`C${cid} -> restored to Passed -> ${r.status}`);
}
const { body: run } = await api('get_run/415');
console.log(`\nRUN 415 NOW: ${run.passed_count} passed · ${run.failed_count} failed · ${run.blocked_count} blocked · ${run.untested_count} untested · ${run.passed_count+run.failed_count+run.blocked_count+run.retest_count+run.untested_count} tests`);
let tests = [], off = 0;
while (true) { const { body } = await api(`get_tests/415&limit=250&offset=${off}`);
  tests = tests.concat(body.tests || body); if (!body._links || !body._links.next) break; off += 250; }
const S = { 1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed' };
console.log('\nstill failing:');
for (const t of tests) if (t.status_id !== 1) console.log(`   ${S[t.status_id]}  C${t.case_id}  ${t.title.slice(0, 70)}`);
