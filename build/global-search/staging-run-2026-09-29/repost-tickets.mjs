// Re-post each failing check's ticket reference, now that the attribution is right. The earlier
// bulk pass assigned tickets by a crude title rule and got twelve of them wrong - including the
// customer-telephone check, which was pointed at the truncation tickets instead of its own.
import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'node:fs';
const V=JSON.parse(fs.readFileSync('VERDICTS.json','utf8')).verdicts;
const det=JSON.parse(fs.readFileSync('failed-detail.json','utf8'));
const L=k=>`  ${k} — https://shopview.atlassian.net/browse/${k}`;
const BUILD='v26.39.2-51a35e1';
let n=0, bad=[];
for(const d of det){
  const cid=String(d.cid), v=V[cid]; if(!v||v.v!=='Failed') continue;
  const t=v.tickets||[];
  const body = t.length
    ? `The report covering this one:\n${t.map(L).join('\n')}`
    : `NO REPORT HAS BEEN RAISED FOR THIS YET. It is the only failing check in this folder without one.`;
  const res=await api(`add_result_for_case/415/${cid}`,{method:'POST',
    body:{status_id:5, comment:`Failed on Staging, build ${BUILD}, 30 September 2026.\n\n${body}`, version:BUILD}});
  if(res.status!==200) bad.push(`C${cid} -> ${res.status}`); else n++;
}
console.log('ticket references re-posted:', n);
if(bad.length){ console.log('FAILED:',bad); process.exit(1); }
