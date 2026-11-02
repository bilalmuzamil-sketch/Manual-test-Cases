import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const V=JSON.parse(rd('br-v.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('  POST',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,260)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A), B=wps.find(w=>w.id===S.B);
const list=async()=> (await s.api('/api/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=60&pagination%5BsortBy%5D=startDate&pagination%5Bdescending%5D=true')).json.data.work_orders;
await post('/api/iam/change-location',{workplace_id:B.id,workplace_timezone:B.timezone});
const sp=await post('/api/work-orders/split',{work_order_id:V.vId,ids:[V.vLine]});
const nid=sp.json?.data?.id||sp.json?.data?.work_order_id||sp.json?.data?.workOrderId||sp.json?.data?.newWorkOrderId;
for(const W of [B,A]){ await post('/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone}); const L=await list();
  for(const id of [V.vId,nid]){ const r=L.find(x=>x.id===id); console.log('list@',W.name.slice(8,20),id?.slice(0,8),r?JSON.stringify({n:r.number,orderId:r.orderId,unreceived:r.unreceivedPartRequestsCount,clocked:r.clockedInTechnicians}):'not listed'); } }
if(nid){ const v=(await s.api('/api/work-orders/view/'+nid)).json; console.log('new view',JSON.stringify(v.data?{n:(v.data.work_order||v.data).number,wp:(v.data.work_order||v.data).workplace_id}:v).slice(0,200)); }
const o=(await s.api('/api/inventory/orders/'+V.orderId)).json.data?.order; console.log('order',o?JSON.stringify({wo:o.work_order_id,wp:o.workplace_id===A.id?'HD':o.workplace_id===B.id?'Leth':o.workplace_id,n:o.order_number}):'n/a');
fs.writeFileSync('/tmp/sv10579/br-split.json',JSON.stringify({nid,resp:sp.json}));
process.exit(0);
