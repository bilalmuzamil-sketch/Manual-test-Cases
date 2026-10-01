/**
 * Write the PRODUCTION results into run 415.
 *
 * The QA lead's instruction: "There is no new test run you will leave your comment in the test case
 * RUN and if anything which was passed before and FAILED now on production you will highlight that
 * test run case to me."
 *
 * So each comment NAMES PRODUCTION explicitly. A check in TestRail holds one current status, so a
 * production result replaces the staging one on screen - the staging result stays in the case's
 * history, and naming the environment in every comment is what keeps the two readable apart.
 *
 * NOTHING CAUSED BY MISSING DATA IS WRITTEN AS A FAILURE. Those were seeded and re-run first; only
 * a verdict measured against data that exists reaches the run (rule 107's data amendment).
 */
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const BUILD = process.env.PROD_BUILD || 'v26.40.2-95f3172';
const DATE  = '2026-10-01';
const V = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const STATUS = { 'passed':1, 'blocked':2, 'retest':4, 'failed':5 };

let ok = 0, skipped = 0, failed = [];
for (const [cid, r] of Object.entries(V)) {
  const bucket = r.bucket;
  let status, head;

  if (bucket === 'passed') {
    status = STATUS.passed;
    head = `Passed on PRODUCTION, build ${BUILD}, ${DATE}.`;
  } else if (bucket.startsWith('REGRESSION')) {
    status = STATUS.failed;
    head = `Failed on PRODUCTION, build ${BUILD}, ${DATE}.\n\n` +
           `*** THIS WORKED ON STAGING AND DOES NOT WORK ON PRODUCTION. ***\n` +
           `It was last recorded as Passed against staging. The same check, run against production ` +
           `today with the data it needs present, fails.`;
  } else if (bucket === 'fails on both') {
    status = STATUS.failed;
    head = `Failed on PRODUCTION, build ${BUILD}, ${DATE}.\n\n` +
           `This also fails on staging, so it is not something production broke - it is the same ` +
           `known fault showing up in both places.`;
  } else {
    // still no data after seeding - honest, and NOT a failure
    status = STATUS.blocked;
    head = `Blocked on PRODUCTION, build ${BUILD}, ${DATE}.\n\n` +
           `This check needs a record that does not exist on production. Test data was created for ` +
           `the checks that could take it; this one needs a record that could not be built from the ` +
           `screen or behind it. No judgement is recorded, because none was earned.`;
  }

  const body = `${head}\n\nWhat was measured this run:\n  ${(r.notes||[]).join('\n  ') || r.title}` +
               `\n\nFor comparison, the last staging result for this check was: ${r.staging}.`;
  const res = await api(`add_result_for_case/415/${cid}`, { method:'POST',
    body:{ status_id: status, comment: body, version: `PRODUCTION ${BUILD}` } });
  if (res.status === 200) ok++; else failed.push(`C${cid} -> HTTP ${res.status}`);
}
console.log(`written: ${ok}`, failed.length ? `FAILURES: ${failed.join(', ')}` : '');
