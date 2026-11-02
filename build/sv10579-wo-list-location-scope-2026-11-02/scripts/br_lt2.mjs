import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const W=JSON.parse(rd('br-w.json')); const V=JSON.parse(rd('br-v.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const IDS={X:S.wos[0].woId,Y:S.wos[1].woId,W:W.wId,V:V.vId};
const b=await s.api('/api/work-orders/board?search=S10579-1758&showMyWorkOrders=0&fill=12&perGroup=25');
const all=[]; const walk=o=>{ if(Array.isArray(o)) o.forEach(walk); else if(o&&typeof o==='object'){ if(o.id&&o.number) all.push(o); Object.values(o).forEach(walk);} }; walk(b.json);
for(const [k,id] of Object.entries(IDS)){ const r=all.find(x=>x.id===id); console.log(k,r?JSON.stringify({n:r.number,lt:r.lineTechnicians,cl:r.clockedInTechnicians,lead:r.techAssignedId}).slice(0,400):'missing'); }
for(const [k,id] of Object.entries(IDS)){ const t=await s.api(`/api/technician-tasks/list?pagination%5BrowsPerPage%5D=30&pagination%5Bpage%5D=1&work_order_id=${id}`); const c=t.json?.data?.collection||[]; console.log('tasks',k,c.map(x=>[x.workplace_id===S.B?'LETH':'HD',x.staff_id.slice(0,8),x.start_date,x.end_date||'OPEN',(x.description||'check-in').slice(0,14)].join('/')).join(' ; ')); }
const lr=(await s.api('/api/work-orders/lines/'+IDS.Y)).json.data; const yl=(Array.isArray(lr)?lr:lr.collection)[0]; console.log('Y line assigned',JSON.stringify(yl.assigned_techs),JSON.stringify(yl.tech_times).slice(0,200));
const lw=(await s.api('/api/work-orders/lines/'+IDS.W)).json.data; const wl=(Array.isArray(lw)?lw:lw.collection)[0]; console.log('W line assigned',JSON.stringify(wl.assigned_techs),JSON.stringify(wl.tech_times).slice(0,200));
process.exit(0);
