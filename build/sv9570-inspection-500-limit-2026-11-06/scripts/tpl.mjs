// creates + publishes a ZZAUTOTEST template with N sections x M checkbox fields (default 10 x 23 = 230)
import {sess,post} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const NS=+(process.env.NS||10), NF=+(process.env.NF||23);
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const name='ZZAUTOTEST SV9570 '+NS*NF+' fields '+Date.now().toString().slice(-4);
let r=await post(s,'/api/inspection-templates',{name}); console.log('create',r.status,JSON.stringify(r.json).slice(0,300));
const id=r.json?.data?.inspectionTemplate?.id||r.json?.data?.id; if(!id){ await s.close(); process.exit(1); }
const sections=[...Array(NS)].map((_,i)=>({name:'Section '+(i+1),position:i,fields:[...Array(NF)].map((_,j)=>({type:'checkbox',label:`S${i+1} item ${j+1}`,position:j,isRequired:false,config:{labels:{na:'N/A',fail:'Fail',pass:'Pass'}}}))}));
r=await s.api(`/api/inspection-templates/${id}/draft`,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({name,description:'ZZAUTOTEST SV-9570',isSignatureRequired:false,sections})}); console.log('draft',r.status,JSON.stringify(r.json).slice(0,300));
r=await post(s,`/api/inspection-templates/${id}/publish`,{}); console.log('publish',r.status,JSON.stringify(r.json).slice(0,300));
fs.writeFileSync(`/tmp/sv9570-tpl-${ENV}.json`,JSON.stringify({id,name},null,1)); await s.close(); process.exit(0);
