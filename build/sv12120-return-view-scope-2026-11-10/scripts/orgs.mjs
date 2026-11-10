import {sess} from './common.mjs';
const s=await sess();
for(const u of ['/api/organizations','/api/staff/my-workplaces','/api/iam/my-organizations','/api/organizations/list','/api/admin/organizations','/api/auth/me/fe-permissions','/api/users/me','/api/me']){
 const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json).slice(0,300)); }
await s.close(); process.exit(0);
