import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const R=JSON.parse(rd('scan-orders.json'));
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const name=id=>wps.find(w=>w.id===id)?.name||id;
const st={}; const wos=[...new Set(R.flatMap(r=>r.list.map(x=>x.wo)))]; const wpOf={};
for(const L of wps){ await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:L.id,workplace_timezone:L.timezone})});
  for(const id of wos.filter(i=>!wpOf[i])){ const r=await s.api('/api/work-orders/view/'+id); const w=r.json?.data?.work_order||r.json?.data; if(r.status<300) wpOf[id]={wp:w?.workplace_id||L.id,n:w?.number,type:w?.type,seenAt:L.name,hasField:!!w?.workplace_id}; else st[r.status]=(st[r.status]||0)+1; } }
const cross=[]; for(const r of R) for(const o of r.list){ const w=wpOf[o.wo]; if(!w) cross.push({...o,woWp:'UNREADABLE'}); else if(w.wp!==o.wp) cross.push({order:o.n,orderLoc:name(o.wp),wo:w.n,woLoc:name(w.wp),type:w.type,woId:o.wo,orderId:o.id}); }
console.log('fail statuses',JSON.stringify(st),'hasField',Object.values(wpOf).filter(x=>x.hasField).length); console.log('work orders read',Object.keys(wpOf).length,'of',wos.length); console.log('CROSS',JSON.stringify(cross,null,0).slice(0,2000));
fs.writeFileSync('/tmp/sv10579/scan-cross.json',JSON.stringify(cross));
process.exit(0);
