// prints the signed-in user's role + any permission code mentioning "later"/"defer"/"receive"
import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500);
const fe=(await s.api('/api/auth/me/fe-permissions')).json?.data; console.log('fe has later?',(fe?.fe_permissions||[]).filter(x=>/later|defer|receiv/i.test(x)));
const roles=(await s.api('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles')).json?.data; const L=Array.isArray(roles)?roles:(roles?.collection||roles?.roles||[]);
console.log('roles',L.map(r=>r.id.slice(0,8)+':'+r.name).join(' | ').slice(0,600));
const admin=L.find(r=>/^admin/i.test(r.name)); const d=(await s.api('/api/roles/'+admin.id)).json?.data; fs.writeFileSync('/tmp/sv11006/admin-role.json',JSON.stringify(d,null,1));
const flat=JSON.stringify(d); console.log('admin role keys',Object.keys(d||{}).join(','), '| mentions later:', (flat.match(/[a-zA-Z_]*[Ll]ater[a-zA-Z_]*/g)||[]).slice(0,10));
await s.close(); process.exit(0);
