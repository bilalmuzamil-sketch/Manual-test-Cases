import {op,J,post,setLoc} from './lib.mjs';
const s=await op({dpr:1}); await setLoc(s);
for(const u of ['/api/work-orders/parts/change','/api/work-orders/part/change-request','/api/work-orders/part/make-request']){ const r=await post(s,u,{}); console.log(u,r.status,J(r.json,900)); }
await s.close();
