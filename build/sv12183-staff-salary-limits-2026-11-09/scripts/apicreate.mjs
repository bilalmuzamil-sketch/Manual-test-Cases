// node apicreate.mjs -> replays the dialog's own create body (captured) with different salaries
import {sess,post} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/administration/staff'); await s.page.waitForTimeout(1500);
const W=JSON.parse(fs.readFileSync('/tmp/sv12183/branch-createbody.json','utf8'));
for(const [t,v] of [['hourly',5],['hourly',-5],['hourly',10000],['salary',10000000],['salary',-1],['hourly',19.99]]){ const R=Math.floor(Math.random()*90000+10000); const b={...W,last_name:'SV12183 API '+R,email:`bilal.muzamil+sv12183api${R}@shopview.com`,salary_type:t,salary:v}; const r=await post(s,'/api/iam/create',b); console.log('create',t,v,r.status,JSON.stringify(r.json).slice(0,170)); }
await s.close(); process.exit(0);
