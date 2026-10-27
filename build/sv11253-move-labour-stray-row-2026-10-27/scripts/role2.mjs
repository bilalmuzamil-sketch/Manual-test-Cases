import {sess} from './lib.mjs'; import fs from 'fs';
const s=await sess();
let r=await s.api('/api/organizations/settings'); const org=r.json.data.organizationId;
r=await s.api(`/api/organizations/${org}/roles`); const roles=r.json?.data?.collection||r.json?.data||[];
for(const x of roles){ const q=await s.api('/api/roles/'+x.id); const p=(q.json?.data?.fe_permissions||[]).map(y=>y.code||y.name); console.log(x.name.padEnd(24),p.length,'woMoveLabor',p.includes('woMoveLabor')); }
const q=await s.api('/api/roles/'+roles.find(x=>x.name==='Admin').id); console.log(JSON.stringify(q.json.data).slice(0,600));
await s.browser.close(); process.exit(0);
