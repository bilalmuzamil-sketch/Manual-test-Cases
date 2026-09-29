import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'node:fs';
const plan = JSON.parse(fs.readFileSync('cases-110.json','utf8'));
const want = new Set(plan.map(c=>c.case_id));
const S={1:'Passed',2:'Blocked',3:'Untested',4:'Retest',5:'Failed'};
let out=[], offset=0;
for(;;){
  const {body} = await api(`get_tests/415&limit=250&offset=${offset}`);
  const rows = body.tests || body;
  if(!rows || !rows.length) break;
  out.push(...rows.filter(t=>want.has(t.case_id)));
  if(rows.length<250) break; offset+=250;
}
const bySec={};
for(const c of plan){
  const t=out.find(x=>x.case_id===c.case_id);
  const st=t?(S[t.status_id]||t.status_id):'(not in run)';
  (bySec[c.section] ||= {}), (bySec[c.section][st]=(bySec[c.section][st]||0)+1);
}
console.log(JSON.stringify(bySec,null,1));
const tot={};
for(const s of Object.values(bySec)) for(const [k,v] of Object.entries(s)) tot[k]=(tot[k]||0)+v;
console.log('TOTAL', JSON.stringify(tot), '| cases', plan.length, '| tests found', out.length);
fs.writeFileSync('status-live.json', JSON.stringify({bySec,tot},null,1));
