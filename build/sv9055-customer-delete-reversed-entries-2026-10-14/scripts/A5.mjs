import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const s=await ob(); await loc(s);
const c=await post(s,'/api/customers/create',{name:'ZZAUTOTEST SV9055 A5 never-used '+Date.now()%100000}); fs.writeFileSync('A5.json',JSON.stringify({company_id:c.json.data.company_id})); console.log('A5',c.status);
await s.close();
