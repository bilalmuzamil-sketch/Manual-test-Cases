import {ob,J,post} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1}); const ids=JSON.parse(fs.readFileSync('perm-ids.json')); const env=JSON.parse(fs.readFileSync('env.json'));
const body={organization:env.org,name:'ZZAUTOTEST SV-10628 View part sales only',description:'SV-10628 QA: can view part sales, cannot edit them or work orders',fePermissions:['partSalesView','customersView','catalogInventoryView'].map(n=>ids[n]),viewMode:'full',crossToggles:{seeFinancialData:true,seeApArData:false,viewHistoryLogs:false}};
const r=await post(s,'/api/roles',body); console.log('create',r.status,J(r.json,300));
const rid=r.json?.data?.id||r.json?.id; if(rid){ const d=(await s.api('/api/roles/'+rid)).json.data; console.log('perms',d.fe_permissions.map(x=>x.name).join(','),'| toggles',J(d.cross_toggles)); fs.writeFileSync('custom-role.json',JSON.stringify({id:rid,name:body.name},null,1)); }
await s.close();
