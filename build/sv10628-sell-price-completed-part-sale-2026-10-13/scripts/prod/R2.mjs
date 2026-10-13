import {op,J} from './lib.mjs'; import fs from 'fs';
const s=await op({dpr:1});
const r=await s.api('/api/organizations/72b2cc90-6964-4429-a207-76e55f946936/roles'); console.log(r.status, J(r.json,200));
const roles=r.json.data?.collection||r.json.data||r.json.collection||[];
const out={};
for(const x of roles){ const d=await s.api('/api/roles/'+x.id); const perms=(d.json.data?.fe_permissions||d.json.fe_permissions||d.json.data?.fePermissions||[]).map(p=>p.code||p.name).sort(); out[x.name||x.label]={id:x.id,perms}; console.log(x.id,'|',x.name||x.label,'|',perms.length); }
fs.writeFileSync('roles-before.json',JSON.stringify(out,null,1));
await s.close();
