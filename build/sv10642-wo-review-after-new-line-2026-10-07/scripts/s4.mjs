import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob();
const cl=(await s.api('/api/work-orders/canned-lines')).json.data.collection;
const np=cl.filter(x=>!x.total_parts && x.workplace_id==='b3c8c820-f815-4cf1-8938-10956c5ee71a');
console.log('noparts',np.length, np.slice(0,5).map(x=>x.id+' | '+x.canned_line_name+' | fp '+x.fixed_price).join('\n'));
const wo=(await s.api('/api/work-orders?limit=40')).json.data.work_orders;
const keys=Object.keys(wo[0]); console.log(keys.filter(k=>/compan|vehicle|customer|contact|workplace/i.test(k)).map(k=>k+'='+j(wo[0][k],60)).join(' ; '));
fs.writeFileSync('wos.json',JSON.stringify(wo)); fs.writeFileSync('np.json',JSON.stringify(np));
await s.close();
