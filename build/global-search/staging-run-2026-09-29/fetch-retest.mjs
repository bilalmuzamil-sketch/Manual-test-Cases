import { api } from '/home/user/Manual-test-Cases/build/testing-tools/testrail-api.mjs';
import fs from 'node:fs';
const ids = fs.readFileSync('/root/.claude/uploads/126e0959-4bca-54ed-8b95-71a191ca38d1/0cf4be58-RETEST-LIST.csv','utf8')
  .split('\n').slice(1).filter(Boolean).map(l=>l.split(',')[1]).filter(x=>/^C\d+$/.test(x)).map(x=>x.slice(1));
console.log('retest ids:', ids.length);
const out=[];
for (const id of ids) {
  const {body:c} = await api('get_case/'+id);
  out.push({ case_id:c.id, title:c.title, preconds:c.custom_preconds, steps:c.custom_steps,
             expected:c.custom_expected, updated_on:c.updated_on, created_by:c.created_by });
}
fs.writeFileSync('retest-cases.json', JSON.stringify(out,null,1));
console.log('fetched', out.length);
