import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'fs';
const BUILD='v26.39.2-538dd8d', D='2026-09-30';
const nw=JSON.parse(fs.readFileSync('build/global-search/retest-2026-09-30/NEW-VERDICTS.json','utf8'));
const F39=[...new Set(JSON.parse(fs.readFileSync('/tmp/failed39.json','utf8')).map(r=>String(r.case_id)))];
const FIXED=F39.filter(c=>nw[c]?.v==='Passed');
const STILL=F39.filter(c=>nw[c]?.v==='Failed');
let ok=0, bad=[];
for (const cid of FIXED){
  const c=`Passed on staging, build ${BUILD}, ${D}.\n\nRetested because this was failing on the previous build. It now behaves correctly:\n\n  ${nw[cid].title}\n\nThe row now shows the whole stored value with the typed part marked inside it. Nothing further is needed on this check.`;
  const r=await api(`add_result_for_case/415/${cid}`,{method:'POST',body:{status_id:1,comment:c,version:BUILD}});
  r.status===200?ok++:bad.push('C'+cid+' '+r.status);
}
for (const cid of STILL){
  const notes=(nw[cid].notes||[]).join('\n  ');
  const c=`Failed on staging, build ${BUILD}, ${D}.\n\nRetested on the new build. Still behaving the same way - the labelled note on the row shows only the characters that were typed, not the whole stored value.\n\nWhat was measured this run:\n  ${notes||nw[cid].title}\n\nAlready reported - no new ticket raised:\n  SV-10634 - https://shopview.atlassian.net/browse/SV-10634 (Open)`;
  const r=await api(`add_result_for_case/415/${cid}`,{method:'POST',body:{status_id:5,comment:c,version:BUILD}});
  r.status===200?ok++:bad.push('C'+cid+' '+r.status);
}
console.log(`fixed written: ${FIXED.length} -> ${FIXED.map(c=>'C'+c).join(' ')}`);
console.log(`still-failing written: ${STILL.length}`);
console.log(`total ok: ${ok}`, bad.length?('FAILURES: '+bad.join(', ')):'');
