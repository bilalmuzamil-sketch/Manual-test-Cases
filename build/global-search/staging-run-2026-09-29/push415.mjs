// Write Search Results Integrity results into run 415. Per-test writes only — the run's case list
// is never touched (Rule 34: a partial case_ids list to update_run DELETES tests AND their results).
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import { execFileSync } from 'node:child_process';
import fs from 'fs';
const HERE='/home/user/Manual-test-Cases/build/global-search/staging-run-2026-09-29';
const V=JSON.parse(fs.readFileSync(`${HERE}/VERDICTS.json`,'utf8'));
const STATUS={Passed:1,Blocked:2,Retest:4,Failed:5};

// 🔴 A FAILED VERDICT MUST PASS finding_gate.py FIRST (L0239 — the gate existed for two weeks and
// was never run, while the mistakes it was written for were made again).
function gateFailed(cid){
  const ev=`${HERE}/evidence/C${cid}.json`;
  if(!fs.existsSync(ev)) return `no evidence file at evidence/C${cid}.json`;
  try { execFileSync('python3',['/home/user/Manual-test-Cases/build/testing-tools/finding_gate.py','--check',ev],{stdio:'pipe'}); return null; }
  catch(e){ return (e.stdout?.toString()||e.message).trim().split('\n').slice(0,4).join(' | '); }
}

const failures=[];
for(const cid of process.argv.slice(2)){
  const r=V.verdicts[cid]; if(!r){ console.log('C'+cid,'is not in the verdicts file'); continue; }
  if(r.v==='Failed' && !process.env.GATE_OFF){
    const why=gateFailed(cid);
    if(why){ console.log(`C${cid} Failed -> REFUSED: ${why}`); failures.push(`C${cid} -> gate refused`); continue; }
  }
  const build=r.build||V.build;
  let comment=`${r.v} on ${V.environment}, build ${build}, ${V.date}.\n\n${r.why}`;
  // 🔴 A FAILURE THAT IS ALREADY REPORTED DOES NOT WAIT ON A NEW TICKET. The 28 September script
  // appended "waiting on the QA lead's go-ahead" to EVERY Failed, which would have been false here:
  // both of these are already open as SV-10619 and SV-10551, so there is nothing to ask for.
  if(r.v==='Failed'){
    comment += r.tickets?.length
      ? `\n\nAlready reported — no new ticket raised:\n` + r.tickets.map(t=>`  ${t} — https://shopview.atlassian.net/browse/${t}`).join('\n')
      : `\n\nA report has been written up for this and is waiting on the QA lead's go-ahead before it is raised. [ticket_held]`;
  }
  const res=await api(`add_result_for_case/415/${cid}`,{method:'POST',body:{status_id:STATUS[r.v],comment,version:build}});
  if(res.status!==200) failures.push(`C${cid} -> HTTP ${res.status} ${JSON.stringify(res.body).slice(0,90)}`);
  console.log('C'+cid,r.v,'->',res.status, res.status===200?'':JSON.stringify(res.body).slice(0,120));
}
const {body:run}=await api('get_run/415');
console.log('\nRUN 415 NOW: passed',run.passed_count,'failed',run.failed_count,'retest',run.retest_count,'blocked',run.blocked_count,'untested',run.untested_count);
if(failures.length){ console.log('\n🔴 '+failures.length+' RESULT(S) DID NOT LAND — the run does NOT reflect these:'); failures.forEach(f=>console.log('   '+f)); process.exit(1); }
console.log('every result landed.');
