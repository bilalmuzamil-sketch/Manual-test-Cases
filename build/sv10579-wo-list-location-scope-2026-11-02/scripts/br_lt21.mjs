import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const CK=JSON.parse(rd('br-ck.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const req=async(m,u,b)=>{const r=await s.api(u,{method:m,headers:{'content-type':'application/json'},body:b===undefined?undefined:JSON.stringify(b)}); if(!/change-location/.test(u)) console.log('  ',m,u.replace('/api/','').slice(0,60),r.status,JSON.stringify(r.json||r.text).slice(0,180)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A);
await req('POST','/api/iam/change-location',{workplace_id:A.id,workplace_timezone:A.timezone});
const probe=await req('POST','/api/work-orders/change-lead-technician',{}); // learn the body
for(const W of [CK.C,CK.K]){
  let r=await req('POST','/api/work-orders/change-lead-technician',{work_order_id:W.id,tech_assigned_id:null});
  if(r.status>=300) r=await req('POST','/api/work-orders/change-lead-technician',{workOrderId:W.id,staffId:null});
  await req('PUT',`/api/work-orders/lines/${W.line}/technicians`,{staffIds:[]});
  const lt=(await s.api(`/api/work-orders/${W.id}/line-technicians`)).json?.data; console.log(W.number,'line-technicians now',JSON.stringify(lt).slice(0,400)); }
process.exit(0);
