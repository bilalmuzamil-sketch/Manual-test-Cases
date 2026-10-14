import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const s=await ob(); await loc(s); const X=JSON.parse(fs.readFileSync('X5.json'));
const c=await post(s,'/api/contacts/create',{company_id:X.company_id,first_name:'ZZ',last_name:'X5'}); console.log('contact',c.status);
const ps=await post(s,'/api/part-sales',{company_id:X.company_id}); console.log('ps',ps.status,J(ps.json,120));
const co=(await s.api('/api/customers/view/'+X.company_id)).json.data.company; console.log('X5',J(Object.fromEntries(Object.entries(co).filter(([x])=>/count|deletable/.test(x))),260));
await s.close();
