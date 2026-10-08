import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob();
const g=await s.api('/api/feature-flags'); const all=g.json.data.featureFlags.map(x=>({id:x.id,name:x.name}));
console.log(all.map(x=>x.name).join(','));
const o=await s.api('/api/organization/feature-flags?organization_id=d55bc308-e61a-438d-b5f1-c7a73c89d49f'); fs.writeFileSync('/tmp/qa9138/org-flags-before.json',JSON.stringify(o.json,null,1));
fs.writeFileSync('/tmp/qa9138/all-flags.json',JSON.stringify(all,null,1));
await s.close();
