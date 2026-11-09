import {sess} from './common.mjs'; import fs from 'fs';
const done=JSON.parse(fs.readFileSync('../ev/seeded.json')); const id=done.pop();
const s=await sess(); await s.go('/parts/inventory');
const r=await s.api(`/api/inventory/parts/${id}/bin-locations/1d158ef9-2bd0-42d2-bd40-f691fa1afd3f`,{method:'DELETE'}); console.log(id,r.status,JSON.stringify(r.json||r.text).slice(0,200));
if(r.status<300) fs.writeFileSync('../ev/seeded.json',JSON.stringify(done)); console.log('seeded now',done.length); await s.browser.close();
