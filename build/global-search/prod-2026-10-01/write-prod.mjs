import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const BUILD='v26.40.2-95f3172', DATE='2026-10-01';
const V=JSON.parse(fs.readFileSync('build/global-search/prod-2026-10-01/PROD-VERDICTS.json','utf8'));
// C146291 is the pinned-top-result feature the QA lead withdrew ("This feature has been taken
// off"). It must never be recorded as a fault, on any environment.
const WITHDRAWN=new Set(['146291']);
let ok=0, bad=[];
for (const [cid,r] of Object.entries(V)) {
  if (WITHDRAWN.has(cid)) continue;
  let status, head;
  if (r.bucket==='passed') {
    status=1;
    head=`Passed on PRODUCTION, build ${BUILD}, ${DATE}.\n\nThe same check passes here as it did on staging.`;
  } else if (r.bucket==='no data on production') {
    status=2;
    head=`Blocked on PRODUCTION, build ${BUILD}, ${DATE}.\n\nThis check searches for a record that does not exist on production, so the search returns nothing and there is no behaviour to judge. It is NOT a product fault and has not been recorded as one.\n\nTest customers were created on production for the checks that could take them. This one needs a different kind of record - a part, a part sale, a work order or an asset - which still has to be created before the check can be judged here.\n\nWhat the check itself reported:\n  ${r.error||'the search returned no rows'}`;
  } else {
    status=5;
    head=`Failed on PRODUCTION, build ${BUILD}, ${DATE}.\n\nThis fails on staging too, so production has not broken it - the same known fault shows in both places.\n\nWhat the check reported:\n  ${r.error||r.title}\n\nAlready reported - no new ticket raised:\n  SV-10738 - https://shopview.atlassian.net/browse/SV-10738 (Open)`;
  }
  const body=`${head}\n\nFor comparison, the last staging result for this check was: ${r.staging}.`;
  const res=await api(`add_result_for_case/415/${cid}`,{method:'POST',
    body:{status_id:status, comment:body, version:`PRODUCTION ${BUILD}`}});
  res.status===200?ok++:bad.push(`C${cid} ${res.status}`);
}
console.log(`written ${ok}`, bad.length?('FAILED: '+bad.join(', ')):'');
console.log('C146291 skipped on purpose - withdrawn feature, never recorded as a fault.');
