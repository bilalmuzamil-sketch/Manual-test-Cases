import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const [X]=S.wos; const Z=JSON.parse(rd('br-z.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log(' ',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,220)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const B=wps.find(w=>w.id===S.B), A=wps.find(w=>w.id===S.A);
const bodies=[{part_request_id:Z.prId,target_line_id:X.lineId,target_work_order_id:X.woId,work_order_id:Z.zId},
 {partRequestId:Z.prId,target_line_id:X.lineId,target_work_order_id:X.woId,workOrderId:Z.zId}];
let ok=null;
for(const L of [B,A]){ if(ok) break; await post('/api/iam/change-location',{workplace_id:L.id,workplace_timezone:L.timezone});
  for(const b of bodies){ const r=await post('/api/work-orders/part-request/move-to-line',b); if(r.status<300){ok={at:L.name,b};break;} } }
console.log('ok',JSON.stringify(ok));
await post('/api/iam/change-location',{workplace_id:B.id,workplace_timezone:B.timezone});
const o=(await s.api('/api/inventory/orders/'+Z.orderId)).json.data?.order; console.log('order', o&&JSON.stringify({wo:o.work_order_id===X.woId?'X':o.work_order_id===Z.zId?'Z':o.work_order_id, wp:o.workplace_id===S.B?'Lethbridge':'HD', n:o.order_number, items:(o.items||[]).map(i=>[i.part_request_id,i.work_order_id].join('|'))}));
await post('/api/iam/change-location',{workplace_id:A.id,workplace_timezone:A.timezone});
const l=(await s.api('/api/work-orders?pagination[rowsPerPage]=50&pagination[page]=1&search='+X.number)).json.data.collection.find(r=>r.number===X.number||r.id===X.woId);
console.log('X row',JSON.stringify(l&&{orderId:l.orderId,unrec:l.unreceivedPartRequestsCount}));
process.exit(0);
