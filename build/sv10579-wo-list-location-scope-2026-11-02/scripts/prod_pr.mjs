import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const S=JSON.parse(fs.readFileSync('/tmp/sv10579/prod-seed.json','utf8'));
const s=await open({env:'prod',dir:'/tmp/qa2',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim()});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const w=wps.find(x=>x.name==='Trucks Hill 2'); await post('/api/iam/change-location',{workplace_id:w.id,workplace_timezone:w.timezone});
for(const u of [`/api/work-orders/part-requests/${S.woId}`,`/api/work-orders/${S.woId}/part-requests`,`/api/work-orders/parts/${S.woId}`]){ const r=await s.api(u); console.log(u,r.status,JSON.stringify(r.json||r.text).slice(0,700)); }
process.exit(0);
