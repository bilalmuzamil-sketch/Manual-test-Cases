// creates (or finds) "ZZAUTOTEST SV-11006 No SFD" = Parts Technician permissions with seeFinancialData off; assigns it to tech@shopview.com
import {sess,post} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200); const log=(...a)=>console.log(...a);
const ORG='d55bc308-e61a-438d-b5f1-c7a73c89d49f'; const roles=(await s.api(`/api/organizations/${ORG}/roles`)).json?.data; const L=Array.isArray(roles)?roles:(roles?.collection||[]);
const pt=L.find(r=>r.name==='Parts Technician'); const d=(await s.api('/api/roles/'+pt.id)).json?.data; const ids=(d.fe_permissions||[]).map(x=>x.id||x); log('parts tech perms',ids.length, JSON.stringify(d.fe_permissions[0]).slice(0,120));
let mine=L.find(r=>r.name==='ZZAUTOTEST SV-11006 No SFD');
const body={organization:ORG,name:'ZZAUTOTEST SV-11006 No SFD',description:'SV-11006 test: receive parts without See Financial Data',fePermissions:ids,viewMode:'full',crossToggles:{seeFinancialData:false,seeApArData:false,viewHistoryLogs:false}};
if(!mine){ for(const u of ['/api/roles','/api/roles/create',`/api/organizations/${ORG}/roles`]){ const r=await post(s,u,body); log('create',u,r.status,JSON.stringify(r.json).slice(0,200)); if(r.status<300){ break; } } }
const roles2=(await s.api(`/api/organizations/${ORG}/roles`)).json?.data; mine=(Array.isArray(roles2)?roles2:(roles2?.collection||[])).find(r=>r.name==='ZZAUTOTEST SV-11006 No SFD'); log('role',mine?.id);
const md=(await s.api('/api/roles/'+mine.id)).json?.data; log('role SFD',md.cross_toggles?.seeFinancialData,'perms',(md.fe_permissions||[]).length);
const st=(await s.api('/api/staff?limit=200')).json; const SL=st?.data?.collection||st?.data||[]; const t=(Array.isArray(SL)?SL:[]).find(x=>(x.email||x.user?.email)==='tech@shopview.com'); log('tech',JSON.stringify(t).slice(0,400));
fs.writeFileSync('/tmp/sv11006/role-nosfd.json',JSON.stringify({role:mine.id,tech:t},null,1)); await s.close(); process.exit(0);
