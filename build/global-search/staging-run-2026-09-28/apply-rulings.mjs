import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
const S = { 1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed' };
let tests = [], off = 0;
while (true) { const { body } = await api(`get_tests/415&limit=250&offset=${off}`);
  tests = tests.concat(body.tests || body); if (!body._links || !body._links.next) break; off += 250; }
console.log('status before I write anything:');
for (const cid of [44850, 55729, 44898, 45132]) {
  const t = tests.find(x => x.case_id === cid);
  console.log(`   C${cid}: ${S[t.status_id]}`);
}
const B = 'v26.39.1-02c6b6c';
const W = [
 [44898, 1, `Passed on staging, build ${B}, 29 September 2026 — re-run against the QA lead's rewritten expectation.

All four things this now asks for are right on a phone:

The search fills the whole screen and the page never scrolls sideways.

The row of section chips appears only once something is typed, lists only the kinds of record that matched with their counts, and there is no Contacts chip.

Rows carry no hover buttons, and tapping a row opens the record.

The results ARE capped at five a section with a "Show All" link — which is what this check now requires. Counted on a search returning 106 results across eight sections: five rows in every section, and "Show All" twenty-one times.

--- WHERE THIS STANDS ---
The QA lead ruled on 29 September that this works as expected on mobile, pointing at SV-10345:
https://shopview.atlassian.net/browse/SV-10345?focusedCommentId=77118
He rewrote what this check expects to match, and the build meets it. Nothing to raise.

The piece of work this belongs to: SV-9174 — TESTING QA
https://shopview.atlassian.net/browse/SV-9174`],
 [45132, 1, `Passed on staging, build ${B}, 29 September 2026 — re-run against the QA lead's rewritten expectation.

On a phone the search fills the whole screen rather than floating over the page, there is a "Cancel" beside the box, the keyboard-shortcut strip along the bottom is correctly absent, and the greyed-out words inside the box read "Search work orders, parts…" — which is what this check now requires.

One small thing, for whoever automates this later: the words on screen end with a single ellipsis character, while the check is written with three separate full stops. They look identical to a person; a machine comparing them exactly would not match.

--- WHERE THIS STANDS ---
The QA lead rewrote what this check expects on 29 September so that it names the wording the product actually uses. The build meets it. Nothing to raise.

The piece of work this belongs to: SV-9168 — TESTING QA
https://shopview.atlassian.net/browse/SV-9168`],
];
for (const [cid, st, comment] of W) {
  const r = await api(`add_result_for_case/415/${cid}`, { method: 'POST', body: { status_id: st, comment, version: B } });
  console.log(`C${cid} -> ${S[st]} -> ${r.status}`);
}
// the two about the pinned line: his ruling recorded, the expectation left alone
const pin = (extra) => `Still Failed on staging, build ${B}, 29 September 2026 — but this is NOT a fault.

THE QA LEAD RULED ON 29 SEPTEMBER: "This feature has been taken off." The single line at the very top, above the sections, was withdrawn from the product. So the product is behaving as decided, and this check describes something that no longer exists.${extra}

I have NOT touched what this check expects. Changing that field needs the QA lead to tell me to, naming the check, and a ruling about how the product behaves is not that instruction. So the wording still asks for the line that has been withdrawn, and the check cannot pass as written.

WHAT IT NEEDS: retiring, or rewording to match the decision. That is the QA lead's call, and it is the one thing outstanding on this check.

--- WHERE THIS STANDS ---
No report is filed against this check, and none should be — the feature was withdrawn on purpose.
Two related reports from 28 September show the change going in:
SV-10547 — Done — https://shopview.atlassian.net/browse/SV-10547
SV-10556 — OBSOLETE — https://shopview.atlassian.net/browse/SV-10556

The piece of work this belongs to: SV-9174 — TESTING QA
https://shopview.atlassian.net/browse/SV-9174`;
for (const [cid, extra] of [[44850, ''], [55729, ' The exact number does still outrank a customer whose name matches the same text — it is only the separate pinned line that is gone.']]) {
  const r = await api(`add_result_for_case/415/${cid}`, { method: 'POST', body: { status_id: 5, comment: pin(extra), version: B } });
  console.log(`C${cid} -> Failed, ruling recorded -> ${r.status}`);
}
const { body: run } = await api('get_run/415');
console.log(`\nRUN 415 NOW: ${run.passed_count} passed · ${run.failed_count} failed · ${run.blocked_count} blocked · ${run.untested_count} untested · ${run.passed_count+run.failed_count+run.blocked_count+run.retest_count+run.untested_count} tests`);
