import {session} from './rec.mjs'; import fs from 'fs';
const s=await session({}); const J={method:'POST',headers:{'Content-Type':'application/json'}};
const c=await s.api('/api/work-orders/create',{...J,body:JSON.stringify({company_id:'2e7cb7a1-e356-4a38-a573-069194b54951',vehicle_id:'fca761bd-ee1b-4557-af5f-f103b0bdef4c',workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',start_date:new Date().toISOString().slice(0,19).replace('T',' '),is_vehicle_here:true})}); const wo=c.json.data.work_order_id;
const l=await s.api(`/api/work-orders/${wo}/lines/create-from-canned-line`,{...J,body:JSON.stringify({canned_line_id:'0f9a7759-1982-4855-96d5-4a4cf1773a23',status:'authorized'})});
const v=(await s.api('/api/work-orders/view/'+wo)).json.data; const W=v.work_order||v; fs.writeFileSync('/tmp/qa11310/ex20/wo-staging.json',JSON.stringify({wo,number:W.number})); console.log(c.status,l.status,W.number,wo); await s.close();
