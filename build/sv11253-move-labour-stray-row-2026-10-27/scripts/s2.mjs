import {sess,st} from './lib.mjs'; import fs from 'fs';
const s=await sess();
let r=await s.api('/api/work-orders/canned-lines?limit=200'); const cl=(r.json?.data?.collection||r.json?.data||[]); console.log('canned',cl.length, JSON.stringify(cl.slice(0,2)).slice(0,400));
const lab=cl.filter(c=>!c.fixed_price && c.labour_type_id && !(c.total_parts>0)).slice(0,3); console.log('picked',lab.map(c=>c.name||c.line_name));
r=await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=50'); const src=r.json.data.work_orders.find(w=>w.status!=='paid')||r.json.data.work_orders[0];
r=await s.api('/api/work-orders/view/'+src.id); const v=r.json.data; const keys=Object.keys(v); console.log('view keys',keys.filter(k=>/compan|vehicle|workplace|customer/i.test(k)));
fs.writeFileSync('../data/canned.json',JSON.stringify(cl,null,1)); fs.writeFileSync('../data/srcwo.json',JSON.stringify(v,null,1));
await s.browser.close(); process.exit(0);
