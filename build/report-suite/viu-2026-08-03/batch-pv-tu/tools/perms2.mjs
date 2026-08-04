import { login, api } from './qa8582.mjs';
import fs from 'fs';
const R={};
const t0=await login('admin');
const staff=(await api(t0.sessCookie,'GET','/api/staff?limit=300')).body.data.collection;
const usable=staff.filter(s=>s.is_active&&s.confirmed_invitation_on);
console.log('usable staff:',usable.length);
R.candidates=[];
for(const s of usable){
  const tt=await login('admin');
  const sw=await api(tt.sessCookie,'POST','/api/switch-user',{user_id:s.id});
  if(sw.status!==200){ R.candidates.push({n:s.first_name+' '+s.last_name, role:s.role_label, switch:sw.status}); continue; }
  const fe=await api(tt.sessCookie,'GET','/api/auth/me/fe-permissions');
  const wp=await api(tt.sessCookie,'GET','/api/staff/my-workplaces');
  const wps=(wp.body?.data?.collection||[]).map(x=>x.name);
  R.candidates.push({n:s.first_name+' '+s.last_name, id:s.id, role:s.role_label, slug:fe.body?.data?.template_slug,
    reports:(fe.body?.data?.fe_permissions||[]).includes('reportsPageAccess'), atoms:(fe.body?.data?.fe_permissions||[]).length, workplaces:wps});
}
R.singleLocationWithReports = R.candidates.filter(c=>c.reports && c.workplaces && c.workplaces.length===1);
R.noReports = R.candidates.filter(c=>c.reports===false);
R.byRole={}; for(const c of R.candidates){ if(!c.slug) continue; R.byRole[c.role]=R.byRole[c.role]||{slug:c.slug, reports:c.reports, atoms:c.atoms, example:c.n}; }
console.log('\nROLE SUMMARY:', JSON.stringify(R.byRole,null,1));
console.log('\nsingle-location + reports:', JSON.stringify(R.singleLocationWithReports,null,1).slice(0,900));
console.log('\nno-reports users:', JSON.stringify(R.noReports.map(c=>[c.n,c.role]),null,1).slice(0,600));
fs.writeFileSync('../evidence/perms/staff-scan.json',JSON.stringify(R,null,1));
