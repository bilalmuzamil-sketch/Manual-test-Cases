import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const old=JSON.parse(fs.readFileSync('/tmp/sv11006/admin-role.json','utf8')).fe_permissions.map(x=>x.code||x);
const roles=(await s.api('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles')).json?.data; const L=Array.isArray(roles)?roles:(roles?.collection||[]); const admin=L.find(r=>/^admin/i.test(r.name));
const now=((await s.api('/api/roles/'+admin.id)).json?.data?.fe_permissions||[]).map(x=>x.code||x);
console.log('count before',old.length,'now',now.length,'added',now.filter(x=>!old.includes(x)),'removed',old.filter(x=>!now.includes(x)));
await s.close(); process.exit(0);
