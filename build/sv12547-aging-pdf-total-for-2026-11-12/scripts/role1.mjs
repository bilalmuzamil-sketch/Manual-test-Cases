import {sess} from './common.mjs';
const s=await sess({dir:'/tmp/qa75'}); const p=s.page; await s.go('/reports/ar-aging-collection'); await p.waitForTimeout(3000);
for(const id of (process.env.IDS||'').split(',')){ const d=await p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); return r.text()},s.host.api+'/api/roles/'+id); console.log(id, d.slice(0,1500)); }
await s.close(); process.exit(0);
