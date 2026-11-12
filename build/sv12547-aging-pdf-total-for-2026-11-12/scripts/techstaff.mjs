import {sess} from './common.mjs';
const s=await sess({dir:'/tmp/qa75'}); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(2500);
for (const q of ['?limit=200&page=2','?search=tech%40shopview.com','?limit=200&search=tech']){
 const t=await p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); return r.json()},s.host.api+'/api/staff'+q);
 const a=(t.data?.collection||t.data||t); console.log(q, Array.isArray(a)?a.length:JSON.stringify(t).slice(0,200));
 if(Array.isArray(a)) for(const x of a.filter(x=>x.id==='ba74948b-5777-4f0c-90fb-2f60d9ce8107'||x.email==='tech@shopview.com')) console.log(JSON.stringify(x).slice(0,700));
}
await s.close(); process.exit(0);
