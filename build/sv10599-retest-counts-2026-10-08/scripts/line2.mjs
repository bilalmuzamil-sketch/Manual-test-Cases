import {ob,j} from './lib.mjs'; import fs from 'fs';
const E=JSON.parse(fs.readFileSync('wo-E.json')); const s=await ob(); const WP='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const cl=(await s.api('/api/work-orders/canned-lines')).json.data.collection.filter(x=>!x.total_parts&&x.workplace_id===WP).find(x=>!/Battery service/i.test(x.canned_line_name));
const ln=await s.api(`/api/work-orders/${E.wo}/lines/create-from-canned-line`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({canned_line_id:cl.id,status:'authorized'})});
console.log('line2',ln.status,cl.canned_line_name,ln.json?.data?.line_id); fs.writeFileSync('wo-E2.json',JSON.stringify({wo:E.wo,line:ln.json.data.line_id}));
await s.close();
