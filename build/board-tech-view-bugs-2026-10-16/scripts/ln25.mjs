import {session} from './rec.mjs';
const s=await session({vp:{width:1200,height:800},dpr:1});
const r=await s.api('/api/work-orders/lines/'+process.argv[2]); const c=r.json.data.collection; console.log(JSON.stringify(c.map(l=>({id:l.id,st:l.status,name:(l.name||l.title||'').slice(0,30),tasks:(l.tasks||[]).map(t=>t.first_name+':'+t.tech_assigned_id)}))));
await s.close();
