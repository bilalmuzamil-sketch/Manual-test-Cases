import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const s=await ob(); await loc(s); const t=Date.now()%100000;
const a=await post(s,'/api/customers/create',{name:'ZZAUTOTEST SV9055 X4 note-only '+t}); const A=a.json.data.company_id;
for(const ty of ['company','customer']){ const r=await post(s,'/api/note/create',{type:ty,reference_id:A,content:'ZZAUTOTEST note'}); console.log('note',ty,r.status,J(r.json||r.text,160)); if(r.status<300) break; }
const b=await post(s,'/api/customers/create',{name:'ZZAUTOTEST SV9055 X5 part-sale-only '+t}); const B=b.json.data.company_id;
const ps=await post(s,'/api/part-sales',{company_id:B}); console.log('ps',ps.status,J(ps.json,160));
for(const [k,id] of [['X4',A],['X5',B]]){ const co=(await s.api('/api/customers/view/'+id)).json.data.company; fs.writeFileSync(k+'.json',JSON.stringify({company_id:id,name:co.name})); console.log(k,co.name,J(Object.fromEntries(Object.entries(co).filter(([x])=>/count|deletable/.test(x))),260)); }
await s.close();
