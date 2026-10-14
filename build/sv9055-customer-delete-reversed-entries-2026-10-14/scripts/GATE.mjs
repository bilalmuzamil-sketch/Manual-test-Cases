import {ob,op,J} from './lib.mjs'; import fs from 'fs';
const s=await ob(); console.log('branch',J(await s.marker(),160));
for(const f of ['X2','B2','A1','AFT']){ try{const A=JSON.parse(fs.readFileSync(f+'.json')); const r=await s.api('/api/customers/view/'+A.company_id); console.log(f,r.status,J(r.json?.data?.company?.name||r.json,90),'deletable',r.json?.data?.company?.deletable);}catch(e){console.log(f,'err',e.message)} }
await s.close();
const q=await op(); console.log('prod',J(await q.marker(),160));
const P=JSON.parse(fs.readFileSync('PR3.json')); const r=await q.api('/api/customers/view/'+P.company_id); console.log('PR3',r.status,J(r.json?.data?.company?.name,80));
await q.close();
