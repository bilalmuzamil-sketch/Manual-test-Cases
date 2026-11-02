import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const T=JSON.parse(rd('br-tech.json')); const W=JSON.parse(rd('br-w.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('  POST',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,160)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A);
await post('/api/iam/change-location',{workplace_id:A.id,workplace_timezone:A.timezone});
await post('/api/technician-tasks/move',{id:T.hdTtr,line_id:W.wLine,work_order_id:W.wId});
const b=(await s.api('/api/work-orders/board?search=S10579-1758&showMyWorkOrders=0&fill=12&perGroup=25')).json; const all=[]; const walk=o=>{ if(Array.isArray(o)) o.forEach(walk); else if(o&&typeof o==='object'){ if(o.id&&o.number) all.push(o); Object.values(o).forEach(walk);} }; walk(b);
for(const id of [S.wos[0].woId,W.wId]){ const r=all.find(x=>x.id===id); console.log(r.number,'lt=',JSON.stringify((r.lineTechnicians||[]).map(t=>t.firstName+' '+t.lastName)),'cl=',JSON.stringify((r.clockedInTechnicians||[]).map(t=>t.firstName+' '+t.lastName))); }
process.exit(0);
