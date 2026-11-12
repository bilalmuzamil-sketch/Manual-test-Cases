import {sess} from './common.mjs';
const s=await sess({dir:'/tmp/qa75'}); const p=s.page; await s.go('/reports/ar-aging-collection'); await p.waitForTimeout(3000);
const t=await p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); return r.json()},s.host.api+'/api/staff?limit=300');
const a=(t.data?.collection||t.data||t); console.log('n',a.length,'keys',Object.keys(a[0]).join(','));
for(const x of a.filter(x=>/Reports only|Reports page/i.test(x.role_label||x.role?.name||'')||/tech@/.test(x.email||''))) console.log(JSON.stringify({id:x.id,user:x.user_id,email:x.email,role:x.role_label||x.role?.name,wp:x.workplace_id}).slice(0,300));
await s.close(); process.exit(0);
