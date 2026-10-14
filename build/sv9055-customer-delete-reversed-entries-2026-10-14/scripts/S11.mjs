import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import {clearWO,clearAssetContact} from './teardown.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2])); const s=await ob(); await loc(s);
await clearWO(s,A); await clearAssetContact(s,A);
const c=await s.api('/api/customers/view/'+A.company_id); const co=c.json?.data?.company||{};
console.log('customer still there',c.status,co.name,'contacts',(co.contacts||[]).length);
await s.close();
