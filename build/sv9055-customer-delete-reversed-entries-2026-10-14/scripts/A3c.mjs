import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import {clearAssetContact} from './teardown.mjs'; import fs from 'fs';
const s=await ob(); await loc(s); const A=JSON.parse(fs.readFileSync('A3.json'));
const v=await s.api('/api/customers/view/'+A.company_id); const co=v.json.data.company;
console.log('keys',Object.keys(co).join(','));
console.log('contacts',J(co.contacts,300)); console.log('vehicles',J(co.vehicles||co.assets,300));
await s.close();
