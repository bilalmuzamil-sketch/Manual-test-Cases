import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const Y=JSON.parse(rd('br-y.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A);
await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:A.id,workplace_timezone:A.timezone})});
const find=(o,id)=>{ if(!o||typeof o!=='object') return null; if(o.id===id||o.work_order_id===id) return o; for(const v of Object.values(o)){const r=find(v,id); if(r) return r;} return null; };
for(const q of ['/api/work-orders?pagination[rowsPerPage]=25&pagination[page]=1&search=17586','/api/work-orders/board?search=17586&showMyWorkOrders=0&fill=12&perGroup=25']){
  const j=(await s.api(q)).json; const c=find(j,Y.Y); console.log(q.slice(5,30), c? JSON.stringify(Object.fromEntries(Object.entries(c).filter(([k])=>/tech|clock|order|unrec/i.test(k)))) : 'NOT FOUND '+JSON.stringify(j).slice(0,200)); }
process.exit(0);
