// Write results into run 415. Per-test writes only — the run's case list is never touched (Rule 34:
// passing a partial case_ids list to update_run DELETES tests AND their results).
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const P='/home/user/Manual-test-Cases/build/global-search/staging-run-2026-09-28/VERDICTS.json';
const V=JSON.parse(fs.readFileSync(P,'utf8'));
const STATUS={Passed:1,Blocked:2,Retest:4,Failed:5};

// 🔴 A FAILED VERDICT MUST PASS finding_gate.py FIRST. That gate has existed since 15 September,
// written for exactly the mistakes made again on 28-29 September - the mouse pointer owning the
// highlight, and a fixture that could not have shown the difference either way. It was never run.
// A gate nobody runs is not a gate, so this refuses to write a Failed without it. Put the evidence
// beside the verdict as evidence/C<case>.json with its `instrument` block; see L0239.
import { execFileSync } from 'node:child_process';
function gateFailed(cid){
  const ev = `${process.cwd()}/evidence/C${cid}.json`;
  if(!fs.existsSync(ev)) return `no evidence file at evidence/C${cid}.json — a Failed needs one, `
    + `answering the six questions in build/testing-tools/finding_gate.py`;
  try { execFileSync('python3',['/home/user/Manual-test-Cases/build/testing-tools/finding_gate.py','--check',ev],{stdio:'pipe'}); return null; }
  catch(e){ return (e.stdout?.toString()||e.message).trim().split('\n').slice(0,4).join(' | '); }
}
// 🔴 A NON-200 USED TO SCROLL PAST UNSEEN. One result (C53606) was measured on staging and never
// landed, so the run went on showing a 22 September result from the deleted branch for a day. The
// failures are now collected and printed LAST, and the script exits non-zero if any occurred.
const failures=[];
for(const cid of process.argv.slice(2)){
  const r=V.verdicts[cid]; if(!r){ console.log('C'+cid,'is not in the verdicts file'); continue; }
  if(r.v==='Failed' && !process.env.GATE_OFF){
    const why=gateFailed(cid);
    if(why){ console.log(`C${cid} Failed -> REFUSED: ${why}`); failures.push(`C${cid} -> gate refused`); continue; }
  }
  const build=r.build||V.build;
  let comment=`${r.v} on ${V.environment}, build ${build}, ${V.date}.\n\n${r.why}`;
  if(r.v==='Failed') comment+=`\n\nA report has been written up for this and is waiting on the QA lead's go-ahead before it is raised. [ticket_held]`;
  const res=await api(`add_result_for_case/415/${cid}`,{method:'POST',body:{status_id:STATUS[r.v],comment,version:build}});
  if(res.status!==200) failures.push(`C${cid} -> HTTP ${res.status} ${JSON.stringify(res.body).slice(0,90)}`);
  console.log('C'+cid,r.v,'->',res.status, res.status===200?'':JSON.stringify(res.body).slice(0,120));
}
const {body:run}=await api('get_run/415');
console.log('\nRUN 415 NOW: passed',run.passed_count,'failed',run.failed_count,'retest',run.retest_count,'blocked',run.blocked_count,'untested',run.untested_count);
if(failures.length){ console.log('\n🔴 '+failures.length+' RESULT(S) DID NOT LAND — the run does NOT reflect these:'); failures.forEach(f=>console.log('   '+f)); process.exit(1); }
console.log('every result landed.');
