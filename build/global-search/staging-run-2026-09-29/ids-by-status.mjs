import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'node:fs';
const plan=JSON.parse(fs.readFileSync('cases-110.json','utf8'));
const want=new Map(plan.map(c=>[c.case_id,c]));
const S={1:'Passed',2:'Blocked',3:'Untested',4:'Retest',5:'Failed'};
let out=[],offset=0;
for(;;){ const {body}=await api(`get_tests/415&limit=250&offset=${offset}`);
  const rows=body.tests||body; if(!rows||!rows.length) break;
  out.push(...rows.filter(t=>want.has(t.case_id))); if(rows.length<250) break; offset+=250; }
const g={};
for(const t of out){ const st=S[t.status_id]; (g[st] ||= []).push({cid:t.case_id, sec:want.get(t.case_id).section, title:want.get(t.case_id).title}); }
for(const k of ['Failed','Blocked','Passed','Retest']) if(g[k]) {
  console.log(`\n### ${k} (${g[k].length})`);
  for(const x of g[k].sort((a,b)=>a.cid-b.cid)) console.log(`  C${x.cid} [${x.sec}] ${x.title.slice(0,72)}`);
}
fs.writeFileSync('ids-by-status.json', JSON.stringify(g,null,1));
