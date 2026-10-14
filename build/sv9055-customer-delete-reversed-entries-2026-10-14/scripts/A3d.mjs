import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import {clearAssetContact} from './teardown.mjs'; import fs from 'fs';
const s=await ob(); await loc(s); const A=JSON.parse(fs.readFileSync('A3.json'));
let co=(await s.api('/api/customers/view/'+A.company_id)).json.data.company;
A.contact_id=co.contacts[0].id; A.vehicle_id=co.vehicles[0].id;
await clearAssetContact(s,A); fs.writeFileSync('A3.json',JSON.stringify(A));
co=(await s.api('/api/customers/view/'+A.company_id)).json.data.company;
console.log('after',J(Object.fromEntries(Object.entries(co).filter(([k])=>/delet|count|balance/.test(k))),400));
await s.close();
