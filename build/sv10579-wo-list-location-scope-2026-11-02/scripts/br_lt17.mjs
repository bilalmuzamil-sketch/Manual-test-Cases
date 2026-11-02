import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const CK=JSON.parse(rd('br-ck.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A);
await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:A.id,workplace_timezone:A.timezone})});
const find=(o,id)=>{ if(!o||typeof o!=='object') return null; if(o.id===id) return o; for(const v of Object.values(o)){const r=find(v,id); if(r) return r;} return null; };
for(const W of [CK.C,CK.K]){ const b=(await s.api('/api/work-orders/board?search='+W.number.split('-').pop()+'&showMyWorkOrders=0&fill=12&perGroup=25')).json; const c=find(b,W.id);
  const recs=(await s.api(`/api/technician-tasks/list?pagination[rowsPerPage]=100&pagination[page]=1&filters[0][field]=work_order&filters[0][value]=${W.id}&search=`)).json.data.collection.map(r=>({id:r.id.slice(0,8),wp:r.workplace_id===S.A?'HD':r.workplace_id===S.B?'Leth':r.workplace_id,staff:r.technician_first_name,task:r.task_id?.slice(0,8),end:r.end_date}));
  console.log(W.number,'lineTech=',JSON.stringify((c?.lineTechnicians||[]).map(x=>x.firstName+' '+x.lastName)),'ci=',JSON.stringify(c?.clockedInTechnicians),'recs=',JSON.stringify(recs)); }
process.exit(0);
