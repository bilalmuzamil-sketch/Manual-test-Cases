// Push a single case's result into run 416. Results are append-only, so this writes one row for one
// case rather than re-pushing all 64 and leaving a duplicate row on every one of them.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const V=JSON.parse(fs.readFileSync('/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/VERDICTS.json','utf8'));
const STATUS={Passed:1,Blocked:2,Retest:4,Failed:5};
for(const cid of process.argv.slice(2)){
  const r=V.verdicts[cid]; if(!r){ console.log('C'+cid,'not in the verdicts file'); continue; }
  const build=r.build||V.build;
  let comment=`${r.v} on ${V.environment}, build ${build}, 28 September 2026.\n\n${r.why}`;
  if(r.v==='Failed') comment+=`\n\nA report has been written up for this and is waiting on the QA lead's go-ahead before it is raised. [ticket_held]`;
  const res=await api(`add_result_for_case/416/${cid}`,{method:'POST',body:{status_id:STATUS[r.v],comment,version:build}});
  console.log('C'+cid,r.v,'->',res.status);
}
const {body:run}=await api('get_run/416');
console.log('\nRUN 416 NOW: passed',run.passed_count,'failed',run.failed_count,'blocked',run.blocked_count,'untested',run.untested_count);
