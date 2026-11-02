import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const S=JSON.parse(fs.readFileSync('/tmp/sv10579/prod-seed.json','utf8'));
const s=await open({env:'prod',dir:'/tmp/qa2',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim()});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const byId=Object.fromEntries(wps.map(w=>[w.id,w.name]));
for(const loc of ['b617914c-16e9-4485-8e8b-193cd86aa416','555206ea-2a33-4ca1-a29a-5431b0f7648c']){ const w=wps.find(x=>x.id===loc); await post('/api/iam/change-location',{workplace_id:w.id,workplace_timezone:w.timezone});
  const L=(await s.api('/api/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=100&pagination%5BsortBy%5D=startDate&pagination%5Bdescending%5D=true')).json.data?.work_orders||[];
  const r=L.find(x=>x.id===S.woId); console.log('rows',L.length, L.slice(0,3).map(x=>x.number+'/'+x.status).join(',')); console.log('list as',byId[loc],'row found',!!r, r&&JSON.stringify({number:r.number,orderId:r.orderId,unreceived:r.unreceivedPartRequestsCount,clocked:r.clockedInTechnicians}));
  if(r&&r.orderId){ const o=await s.api('/api/inventory/orders/'+r.orderId); const od=o.json.data?.order||o.json.data||{}; console.log('  order',o.status,'workplace',byId[od.workplace_id]||od.workplace_id||JSON.stringify(Object.keys(od)).slice(0,200),'number',od.order_number||od.number); }
}
process.exit(0);
