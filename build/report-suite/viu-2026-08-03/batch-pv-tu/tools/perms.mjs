import { login, api, APP } from './qa8582.mjs';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;
const OUT='../evidence/perms'; fs.mkdirSync(OUT,{recursive:true});
const R={};
const t=await login('admin'); const S0=t.sessCookie;
// FE-permission catalogue: is there any per-report atom?
const cat=await api(S0,'GET','/api/fe-permissions');
const atoms=JSON.stringify(cat.body);
R.reportAtoms=[...new Set((atoms.match(/"[a-zA-Z]*[Rr]eport[a-zA-Z]*"/g)||[]))];
R.catalogueStatus=cat.status;
// staff by role
const staff=(await api(S0,'GET','/api/staff?limit=300')).body.data.collection;
const usable=staff.filter(s=>s.is_active&&s.confirmed_invitation_on);
const byRole={}; for(const s of usable){ (byRole[s.role_label]=byRole[s.role_label]||[]).push(s); }
R.rolesAvailable=Object.fromEntries(Object.entries(byRole).map(([k,v])=>[k,v.length]));
async function asUser(uid){ const tt=await login('admin'); const r=await api(tt.sessCookie,'POST','/api/switch-user',{user_id:uid});
  if(r.status!==200) return null; const fe=await api(tt.sessCookie,'GET','/api/auth/me/fe-permissions');
  return {cookie:tt.sessCookie, slug:fe.body?.data?.template_slug, perms:fe.body?.data?.fe_permissions||[]}; }
R.perRole={};
for (const [role, list] of Object.entries(byRole)){
  const u=list[0]; const ctx=await asUser(u.id); if(!ctx){R.perRole[role]={err:'switch-user failed'};continue;}
  const has=ctx.perms.includes('reportsPageAccess');
  const pv=await api(ctx.cookie,'GET','/api/reporting/reports/parts-velocity?type=both&range=this_year&pagination[page]=1&pagination[rowsPerPage]=1');
  const tu=await api(ctx.cookie,'GET','/api/reporting/reports/technician-utilization?range=this_year');
  const pvx=await api(ctx.cookie,'GET','/api/reporting/reports/parts-velocity/export?format=csv&type=both&range=this_year&search=GREASE');
  const tux=await api(ctx.cookie,'GET','/api/reporting/reports/technician-utilization/export?variant=summary&format=csv&range=this_year');
  R.perRole[role]={user:u.first_name+' '+u.last_name, slug:ctx.slug, atoms:ctx.perms.length, reportsPageAccess:has,
    pvData:pv.status, tuData:tu.status, pvExport:pvx.status, tuExport:tux.status,
    pvErr: pv.status>=400? JSON.stringify(pv.body).slice(0,120):null, tuErr: tu.status>=400? JSON.stringify(tu.body).slice(0,120):null};
  console.log(role, JSON.stringify(R.perRole[role]));
}
fs.writeFileSync(`${OUT}/permission-matrix.json`,JSON.stringify(R,null,1));
console.log('\nreport atoms in the FE catalogue:', JSON.stringify(R.reportAtoms));
