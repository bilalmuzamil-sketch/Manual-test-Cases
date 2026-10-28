import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env:'branch',ticket:'11744',cookies,dir:'/tmp/qa23'});
const post=(p,b)=>s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const r=await s.api('/api/work-orders?pagination%5BrowsPerPage%5D=5&search=ZZAUTOTEST%20SV11744%20S1');
const wo=r.json.data.work_orders[0]; console.log(wo.id,wo.number,wo.status);
const l=await s.api(`/api/work-orders/lines/${wo.id}`); const j=l.json; console.log(Object.keys(j.data||{}), JSON.stringify(j).slice(0,600));
const pr=await s.api(`/api/work-orders/${wo.id}/parts/list-requests-by-line`); console.log('parts',JSON.stringify(pr.json).slice(0,500));
await s.close();
