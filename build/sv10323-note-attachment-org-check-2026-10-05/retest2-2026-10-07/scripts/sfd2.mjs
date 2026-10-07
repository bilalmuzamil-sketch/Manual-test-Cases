import {ob,j} from './lib.mjs'; import fs from 'fs'; const s=await ob();
const roles=JSON.parse(fs.readFileSync('newroles.json')); const out={};
for(const [name,rid] of Object.entries(roles)){
 const g=(await s.api('/api/roles/'+rid)).json.data; out[name]={before:{mode:g.view_mode,cross:g.cross_toggles,perms:g.fe_permissions.map(p=>p.name).sort()}};
 const body={organization:'d55bc308-e61a-438d-b5f1-c7a73c89d49f',name:g.name,description:g.description,fePermissions:g.fe_permissions.map(p=>p.id),viewMode:g.view_mode,crossToggles:Object.assign({},g.cross_toggles,{seeFinancialData:true})};
 const r=await s.api('/api/roles/'+rid,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(body)}); 
 const g2=(await s.api('/api/roles/'+rid)).json.data; out[name].after={mode:g2.view_mode,cross:g2.cross_toggles,perms:g2.fe_permissions.map(p=>p.name).sort()};
 const same=JSON.stringify(out[name].before.perms)===JSON.stringify(out[name].after.perms)&&out[name].before.mode===out[name].after.mode;
 console.log(name,'PUT',r.status,'| cross now',j(g2.cross_toggles),'| perms+mode unchanged',same,'| perms',out[name].after.perms.filter(p=>/partSale|customer|workOrder/i.test(p)).join(','));
}
fs.writeFileSync('sfd-roles.json',JSON.stringify(out,null,1)); await s.close();
