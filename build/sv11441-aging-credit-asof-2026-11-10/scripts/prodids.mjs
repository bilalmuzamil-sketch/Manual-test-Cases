import {sess,arr} from './common.mjs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const v=arr((await s.api('/api/parts-catalogue/vendors?limit=50&search=ZZMAGENTA')).json?.data); console.log('vend',v.slice(0,3).map(x=>x.id+' '+x.name).join(' | '));
for(const u of ['/api/customers?limit=3&search=ZZAUTOTEST','/api/companies?limit=3&search=ZZAUTOTEST','/api/customers/list?limit=3&search=ZZAUTOTEST']){ const x=await s.api(u); console.log(u,x.status,JSON.stringify(x.json).slice(0,260)); }
await s.close(); process.exit(0);
