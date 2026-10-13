import {ob,J} from './lib.mjs';
const s=await ob({dpr:1}); console.log('marker',J(await s.marker()));
const st=(await s.api('/api/staff?limit=200&search=tech%40shopview.com')).json; const t=(st.collection||st.data?.collection||st.data).find(x=>x.email==='tech@shopview.com'); console.log('tech role',t.role_label);
const l=(await s.api('/api/work-orders/lines/e71fd04b-aa1c-4b9a-b895-857803117877')).json; console.log('P2-209 parts',J((l.collection||l.data?.collection||[]).flatMap(x=>x.parts||[]).map(p=>p.part_number+':'+p.sell_price)));
await s.close();
