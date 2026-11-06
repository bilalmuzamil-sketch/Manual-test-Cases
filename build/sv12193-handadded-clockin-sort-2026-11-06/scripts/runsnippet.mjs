import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/sv12193/seed-branch.json','utf8')); const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(4000);
const code=fs.readFileSync('../ev/jira-move/console-snippet.js','utf8').replace('PASTE-ID-OF-WORK-ORDER-1',S.W[process.env.FROM].id).replace('PASTE-ID-OF-WORK-ORDER-2',S.W[process.env.TO].id).replace("console.log('moved', entry.id, r.status, await r.text());","return ['moved', entry.id, r.status, await r.text()];");
console.log(JSON.stringify(await p.evaluate(new Function('return (async()=>{'+code+'})()')))); await s.close(); process.exit(0);
