import {sess} from './common.mjs';
const s=await sess(); console.log('marker',JSON.stringify(await s.marker()));
for(const id of (process.env.IDS||'').split(',')){ const r=await s.api('/api/work-orders/'+id); const w=r.json?.data?.workOrder||r.json?.data||{}; console.log(id,r.status,w.number||w.work_order_number,w.status,w.workplace_id||'', (w.company?.name||w.company_name||'')); }
await s.close(); process.exit(0);
