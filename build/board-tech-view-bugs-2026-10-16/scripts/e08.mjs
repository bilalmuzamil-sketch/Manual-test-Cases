import {session} from './rec.mjs';
const s=await session({vp:{width:1600,height:1000},dpr:1}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(3000);
const w=await s.api('/api/staff/my-workplaces'); const list=w.json?.data?.collection||w.json?.data||[]; 
console.log(JSON.stringify(list.map(x=>[x.id||x.workplace_id,x.name,x.timezone||x.workplace_timezone])));
await s.close();
