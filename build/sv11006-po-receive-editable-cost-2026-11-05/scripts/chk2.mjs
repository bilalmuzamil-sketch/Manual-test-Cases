import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const ORG='d55bc308-e61a-438d-b5f1-c7a73c89d49f'; const L=(await s.api(`/api/organizations/${ORG}/roles`)).json?.data; const R=Array.isArray(L)?L:L.collection;
const a=((await s.api('/api/roles/'+R.find(r=>r.name==='Parts Technician').id)).json.data.fe_permissions).map(x=>x.code); const b=((await s.api('/api/roles/'+R.find(r=>r.name==='ZZAUTOTEST SV-11006 No SFD').id)).json.data.fe_permissions).map(x=>x.code);
console.log('dropped',a.filter(x=>!b.includes(x)));
const st=(await s.api('/api/staff?limit=200')).json; console.log('staff shape',JSON.stringify(st).slice(0,400)); fs.writeFileSync('/tmp/sv11006/staff.json',JSON.stringify(st)); await s.close(); process.exit(0);
