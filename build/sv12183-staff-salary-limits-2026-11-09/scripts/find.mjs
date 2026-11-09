import {sess} from './common.mjs'; const [Q]=process.argv.slice(2);
const s=await sess(); await s.go('/administration/staff'); await s.page.waitForTimeout(1500);
for(const u of ['/api/staff?limit=400&search='+encodeURIComponent(Q),'/api/staff?limit=400&page=2','/api/staff?search='+encodeURIComponent(Q)]){ const r=await s.api(u); const d=r.json?.data; const a=d?.collection||d||[]; console.log(u,r.status,Array.isArray(a)?a.length:typeof a, JSON.stringify((Array.isArray(a)?a:[]).filter(x=>JSON.stringify(x).includes(Q)).map(x=>({n:x.last_name,salary:x.salary,t:x.salary_type,id:x.id,sid:x.staff_id}))), JSON.stringify(d?.pagination||d?.meta||'').slice(0,120)); }
await s.close(); process.exit(0);
