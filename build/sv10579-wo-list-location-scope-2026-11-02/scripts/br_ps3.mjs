import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const [X]=S.wos;
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log(' ',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,200)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const B=wps.find(w=>w.id===S.B), A=wps.find(w=>w.id===S.A);
const psId='187c0353-2429-46a2-919e-80114a7f5b8b', prId='2f094078-5ff6-452f-8e68-649fa170afdc';
await post('/api/iam/change-location',{workplace_id:B.id,workplace_timezone:B.timezone});
const lr=(await s.api('/api/work-orders/lines/'+psId)).json.data; const psLine=(Array.isArray(lr)?lr:lr.collection)[0].line_id;
let st=await post('/api/work-orders/lines/change-status',{line_id:psLine,work_order_id:psId,status:'authorized'}); if(st.status>=300) await post('/api/work-orders/lines/change-status',{work_order_id:psId,line_ids:[psLine],status:'authorized'});
const od=await post('/api/work-orders/part/perform-request-status-action',{part_request_id:prId,workOrderId:psId,sellPrice:0}); const orderId=od.json?.data?.orderId; console.log('order',orderId);
let moved=null;
for(const L of [B,A]) for(const body of [{part_request_ids:[prId],work_order_id:psId,target_work_order_id:X.woId},{part_request_ids:[prId],work_order_id:X.woId,target_work_order_id:psId}]){ if(moved) break;
  await post('/api/iam/change-location',{workplace_id:L.id,workplace_timezone:L.timezone}); const m=await post('/api/part-sales/move',body); if(m.status<300) moved={at:L.name,body}; }
console.log('moved',JSON.stringify(moved));
await post('/api/iam/change-location',{workplace_id:B.id,workplace_timezone:B.timezone});
const o=orderId&&(await s.api('/api/inventory/orders/'+orderId)).json.data?.order; console.log('order now',JSON.stringify(o&&{wo:o.work_order_id===X.woId?'X':o.work_order_id===psId?'part sale':o.work_order_id,wp:o.workplace_id===B.id?'Lethbridge':'HD',n:o.order_number}));
fs.writeFileSync('/tmp/sv10579/br-ps.json',JSON.stringify({psId,prId,orderId,psLine}));
process.exit(0);
