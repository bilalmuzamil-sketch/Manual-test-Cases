import {sess,post} from './common.mjs'; import fs from 'fs';
const id=process.argv[2], name=process.argv[3]; const NS=10,NF=23; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const sections=[...Array(NS)].map((_,i)=>({name:'Section '+(i+1),position:i,fields:[...Array(NF)].map((_,j)=>({type:'checkbox',label:`S${i+1} item ${j+1}`,position:j,isRequired:false,config:{labels:{na:'N/A',fail:'Fail',pass:'Pass'}}}))}));
let r=await s.api(`/api/inspection-templates/${id}/draft`,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({name,description:'ZZAUTOTEST SV-9570',isSignatureRequired:false,sections})}); console.log('draft',r.status,JSON.stringify(r.json).slice(0,300));
r=await post(s,`/api/inspection-templates/${id}/publish`,{}); console.log('publish',r.status,JSON.stringify(r.json).slice(0,300));
fs.writeFileSync(`/tmp/sv9570-tpl-${process.env.ENV||'branch'}.json`,JSON.stringify({id,name},null,1)); await s.close(); process.exit(0);
