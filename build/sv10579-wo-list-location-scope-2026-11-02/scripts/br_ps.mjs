import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const [X]=S.wos; const Z=JSON.parse(rd('br-z.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log(' ',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,260)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const B=wps.find(w=>w.id===S.B), A=wps.find(w=>w.id===S.A);
const listRow=async id=>{ const L=(await s.api('/api/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=60&pagination%5BsortBy%5D=startDate&pagination%5Bdescending%5D=true')).json.data.work_orders; const r=L.find(x=>x.id===id); return r&&{n:r.number,orderId:r.orderId,unreceived:r.unreceivedPartRequestsCount}; };
for(const L of [B,A]){ console.log('== session at',L.name); await post('/api/iam/change-location',{workplace_id:L.id,workplace_timezone:L.timezone});
  const r=await post('/api/part-sales/move',{part_request_ids:[Z.prId],work_order_id:Z.zId,target_work_order_id:X.woId}); if(r.status<300) break; }
await post('/api/iam/change-location',{workplace_id:B.id,workplace_timezone:B.timezone});
const o=(await s.api('/api/inventory/orders/'+Z.orderId)).json.data?.order; console.log('Leth order now',JSON.stringify(o&&{wo:o.work_order_id===X.woId?'X (Heavy Duty WO)':o.work_order_id===Z.zId?'Z':o.work_order_id,wp:o.workplace_id===B.id?'Lethbridge':o.workplace_id,n:o.order_number}));
await post('/api/iam/change-location',{workplace_id:A.id,workplace_timezone:A.timezone});
console.log('X list row at Heavy Duty',JSON.stringify(await listRow(X.woId)));
process.exit(0);
