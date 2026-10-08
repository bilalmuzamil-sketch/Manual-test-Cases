import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const roles=(await s.api('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles')).json?.data; const list=roles?.collection||roles||[];
const out=[]; for(const r of list){ const d=(await s.api('/api/roles/'+r.id)).json?.data; const codes=(d?.fe_permissions||[]).map(x=>x.code); out.push({name:d?.name,id:r.id,sfd:codes.includes('seeFinancialData'),ps:codes.filter(c=>/partSales/.test(c))}); }
console.log(j(out,3000));
const staff=(await s.api('/api/staff?limit=200')).json?.data?.collection||[]; fs.writeFileSync('staff.json',JSON.stringify(staff.map(x=>({id:x.id,user_id:x.user_id,name:(x.first_name||'')+' '+(x.last_name||''),email:x.email,role:x.role_label||x.role_name,role_id:x.role_id})),null,1)); console.log('staff',staff.length);
await s.close();
