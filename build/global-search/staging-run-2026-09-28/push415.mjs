// Write results into run 415. Per-test writes only — the run's case list is never touched (Rule 34:
// passing a partial case_ids list to update_run DELETES tests AND their results).
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const P='/home/user/Manual-test-Cases/build/global-search/staging-run-2026-09-28/VERDICTS.json';
const V=JSON.parse(fs.readFileSync(P,'utf8'));
const STATUS={Passed:1,Blocked:2,Retest:4,Failed:5};
for(const cid of process.argv.slice(2)){
  const r=V.verdicts[cid]; if(!r){ console.log('C'+cid,'is not in the verdicts file'); continue; }
  const build=r.build||V.build;
  let comment=`${r.v} on ${V.environment}, build ${build}, ${V.date}.\n\n${r.why}`;
  if(r.v==='Failed') comment+=`\n\nA report has been written up for this and is waiting on the QA lead's go-ahead before it is raised. [ticket_held]`;
  const res=await api(`add_result_for_case/415/${cid}`,{method:'POST',body:{status_id:STATUS[r.v],comment,version:build}});
  console.log('C'+cid,r.v,'->',res.status, res.status===200?'':JSON.stringify(res.body).slice(0,120));
}
const {body:run}=await api('get_run/415');
console.log('\nRUN 415 NOW: passed',run.passed_count,'failed',run.failed_count,'retest',run.retest_count,'blocked',run.blocked_count,'untested',run.untested_count);
