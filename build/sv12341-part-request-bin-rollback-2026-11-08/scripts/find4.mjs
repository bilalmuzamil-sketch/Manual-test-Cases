import {sess} from './common.mjs'; const s=await sess();
for(const id of (process.env.IDS||'').split(',')){ const d=(await s.api(`/api/inventory/parts/${id}`)).json?.data?.part||{}; console.log(id,d.quantity,'cat',d.category,'core',d.core_part_id,d.core_charge,JSON.stringify(d.binLocations)); }
const l=await s.api(`/api/work-orders/lines/${process.env.WO}`); console.log((l.json?.data?.collection||[]).map(x=>x.line_id+'|'+x.status).slice(0,4).join(' '));
const ps=await s.api('/api/part-sales?pagination[page]=1&pagination[rowsPerPage]=3'); console.log('ps',(ps.json?.data?.partSales||[]).map(x=>x.number+'|'+x.status+'|'+x.id).join(' '));
await s.close();
