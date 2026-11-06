// usage: node staffwp.mjs <staffId>... -> prints each staff member's name and workplaces as the staff list reports them
import {sess} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const r=await s.api('/api/staff?limit=300'); const c=r.json?.data?.collection||r.json?.data||[];
for(const id of process.argv.slice(2)){ const x=c.find(y=>y.id===id||y.staff_id===id); console.log(id, x?Object.keys(x).join(",")+" :: "+JSON.stringify({n:(x.first_name||x.firstName)+' '+(x.last_name||x.lastName),wp:x.workplace_id,def:x.defaultWorkplaceName,sid:x.staff_id,dep:x.departments}).slice(0,300):'not in list'); }
await s.close(); process.exit(0);
