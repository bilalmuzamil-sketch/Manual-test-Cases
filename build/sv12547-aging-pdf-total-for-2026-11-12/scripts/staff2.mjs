import {sess} from './common.mjs';
const s=await sess({dir:'/tmp/qa75'}); const p=s.page; await s.go('/reports/ar-aging-collection'); await p.waitForTimeout(3000);
const t=await p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); return r.json()},s.host.api+'/api/staff?limit=300');
const a=(t.data?.collection||t.data||t);
for(const x of a.filter(x=>!/staging\.shopview\.local/.test(x.email))) console.log(JSON.stringify({id:x.id,staff:x.staff_id,email:x.email,role:x.role_label,rid:x.role_id,wp:x.workplace_id}));
await s.close(); process.exit(0);
