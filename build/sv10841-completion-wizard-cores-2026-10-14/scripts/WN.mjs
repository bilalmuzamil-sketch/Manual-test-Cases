import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2]+'.json')); const s=await ob(); const p=s.page; await loc(s);
await s.go('/workorders/'+A.work_order_id+'/lines'); await p.waitForTimeout(5000);
console.log((await p.evaluate(()=>document.body.innerText)).match(/S10841-\d+/)?.[0], (await p.evaluate(()=>document.body.innerText)).match(/ZZAUTOTEST SV10841 DEMO[^\n]*/)?.[0]);
await p.screenshot({path:'ev/DEMO-lines.png'}); await s.close();
