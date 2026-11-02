import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; console.log('locations',wps.map(w=>w.name).join(' | '));
const res=[];
for(const L of wps){ await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:L.id,workplace_timezone:L.timezone})});
  let page=1, all=[]; while(page<40){ const j=(await s.api(`/api/inventory/orders?pagination[rowsPerPage]=100&pagination[page]=${page}&search=`)).json.data; const c=j.collection||j; all.push(...c); if(c.length<100) break; page++; }
  const ids=all.map(o=>o.id);
  const det=await s.page.evaluate(async ids=>{ const out=[]; for(let i=0;i<ids.length;i+=20){ const part=await Promise.all(ids.slice(i,i+20).map(id=>fetch(location.origin.replace('sv10579.','sv10579api.')+'/api/inventory/orders/'+id,{credentials:'include'}).then(r=>r.json()).then(j=>{const o=j.data?.order; return o&&{id,wo:o.work_order_id,wp:o.workplace_id,n:o.order_number};}).catch(()=>null))); out.push(...part);} return out; },ids);
  const withWo=det.filter(x=>x&&x.wo); res.push({loc:L.name,orders:all.length,withWo:withWo.length,list:withWo});
  console.log(L.name,'orders',all.length,'linked to a work order',withWo.length, 'detail null',det.filter(x=>!x).length); }
fs.writeFileSync('/tmp/sv10579/scan-orders.json',JSON.stringify(res));
process.exit(0);
