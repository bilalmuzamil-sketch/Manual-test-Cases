import {op,J} from './lib.mjs'; import fs from 'fs'; import {assignRole} from './roles.mjs';
const s=await op({dpr:1});
const t=JSON.parse(fs.readFileSync('roles.json')).tech;
fs.writeFileSync('tech-before.json',JSON.stringify(t,null,1));
const r=await assignRole(s,t,'48c378ce-a682-4389-935e-757a1e923e4a'); console.log('assign',J(r));
const l=(await s.api('/api/staff?limit=200')).json; const now=(l.collection||l.data?.collection||l.data).find(x=>x.email==='bilal.muzamil+tech@shopview.com'); console.log('now role',now.role_label, now.role_id, 'wp',now.workplace_id, 'depts same', JSON.stringify(now.departments)===JSON.stringify(t.departments));
await s.close();
