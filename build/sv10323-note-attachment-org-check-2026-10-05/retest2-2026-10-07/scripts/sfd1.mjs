import {ob,j} from './lib.mjs'; const s=await ob(); const p=s.page;
const rid='f3fff656-6c82-407e-b3a8-17f536358966';
for(const [m,u] of [['PUT','/api/roles/'+rid],['POST','/api/roles/'+rid],['POST','/api/roles/'+rid+'/change'],['PATCH','/api/roles/'+rid],['POST','/api/roles/change']]){ const r=await s.api(u,{method:m,headers:{'content-type':'application/json'},body:'{}'}); console.log(m,u,r.status,j(r.json||r.text,250)); }
await s.close();
