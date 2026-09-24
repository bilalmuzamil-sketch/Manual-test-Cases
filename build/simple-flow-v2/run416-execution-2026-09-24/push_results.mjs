// Write the run-416 results. Per-test writes only - the run's case list is never touched (Rule 34).
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const V = JSON.parse(fs.readFileSync('/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/VERDICTS.json','utf8'));
const STATUS = { Passed: 1, Blocked: 2, Retest: 4, Failed: 5 };
const BUILD = V.build, ENV = V.environment, DATE = V.date;
const log = [];
for (const [cid, r] of Object.entries(V.verdicts)) {
  if (r.v === 'PENDING') { console.log('C'+cid, 'skipped - not decided yet'); continue; }
  const id = STATUS[r.v];
  let comment = `${r.v} on ${ENV}, build ${BUILD}, ${DATE}.\n\n${r.why}`;
  if (r.v === 'Failed') comment += `\n\nA report has been written up for this and is waiting on the QA lead's go-ahead before it is raised. [ticket_held]`;
  try {
    const res = await api(`add_result_for_case/416/${cid}`, { method: 'POST', body: { status_id: id, comment, version: BUILD } });
    console.log('C'+cid, r.v, '->', res.status);
    log.push({ case: cid, verdict: r.v, http: res.status });
  } catch (e) { console.log('C'+cid, 'ERROR', e.message); log.push({ case: cid, verdict: r.v, error: e.message }); }
}
fs.writeFileSync('/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/push-log.json', JSON.stringify(log,null,1));
const { body: run } = await api('get_run/416');
console.log('\nRUN 416 NOW: passed', run.passed_count, 'failed', run.failed_count, 'blocked', run.blocked_count, 'retest', run.retest_count, 'untested', run.untested_count);
