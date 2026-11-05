import {sess} from './common.mjs'; const s=await sess(); await s.go('/schedule'); await s.page.waitForTimeout(2500);
const d=new Date(Date.now()+86400000).toISOString().slice(0,10); const b=(await s.api(`/api/schedule/board?from=${d}T00:00:00Z&to=${d}T23:59:59Z`)).json?.data?.board;
const t=(await s.api('/api/technicians')).json?.data; const T=Array.isArray(t)?t:(t?.technicians||t?.collection||[]);
const R=[]; JSON.stringify(b.resources,(k,v)=>{ if(v&&v.firstName&&v.id) R.push(v); return v; });
for(const r of R){ if(!r.id) continue; const m=T.find(x=>x.id===r.id); console.log(r.id.slice(0,8),'schedule='+r.firstName+' '+r.lastName,'workorders='+(m?m.name:'-'), m&&m.name!==r.firstName+' '+r.lastName?'  <-- DIFFERENT':''); }
await s.close(); process.exit(0);
