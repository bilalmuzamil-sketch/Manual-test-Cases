import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const s=await open({env:'prod',dir:'/tmp/qa2',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim()});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const byId=Object.fromEntries(wps.map(w=>[w.id,w.name]));
console.log('marker',await s.marker(),'locations',wps.length);
const out=[]; let rowsTotal=0, withOrder=0;
for(const w of wps){ await post('/api/iam/change-location',{workplace_id:w.id,workplace_timezone:w.timezone});
  for(let page=1;page<60;page++){ const L=(await s.api(`/api/work-orders?pagination%5Bpage%5D=${page}&pagination%5BrowsPerPage%5D=100&pagination%5BsortBy%5D=startDate&pagination%5Bdescending%5D=true&search=&showMyWorkOrders=0`)).json.data?.work_orders||[];
    rowsTotal+=L.length; for(const r of L.filter(x=>x.orderId)){ withOrder++; const o=await s.api('/api/inventory/orders/'+r.orderId); const od=o.json?.data?.order||{};
      if(o.status>=300||od.workplace_id!==w.id) out.push({loc:w.name,wo:r.number,woId:r.id,orderId:r.orderId,status:o.status,orderLoc:byId[od.workplace_id]||od.workplace_id,orderWo:od.work_order_id===r.id?'same':od.work_order_id,n:od.order_number}); }
    if(L.length<100) break; } }
console.log('rows',rowsTotal,'rows with an order',withOrder); console.log('MISMATCH',JSON.stringify(out).slice(0,2500));
fs.writeFileSync('/tmp/sv10579/prod-scan.json',JSON.stringify({rowsTotal,withOrder,out}));
process.exit(0);
