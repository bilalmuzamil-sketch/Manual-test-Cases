// usage: node findpo.mjs <tag> -> finds the PO + item ids for the seeded part requests; writes parts[i].order
import {sess} from './common.mjs'; import fs from 'fs';
const F=`/tmp/sv11006/seed-${process.env.ENV||'branch'}-${process.argv[2]}.json`; const S=JSON.parse(fs.readFileSync(F,'utf8')); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const l=(await s.api(`/api/inventory/orders?search=${S.number}&limit=20`)).json; const t=JSON.stringify(l); const ids=[...new Set([...t.matchAll(/"(?:id|order_id)":"([0-9a-f-]{36})"/g)].map(m=>m[1]))];
for(const id of ids){ const o=(await s.api('/api/inventory/orders/'+id)).json?.data?.order; if(!o) continue; const items=o.items||[]; let hit=0;
  for(const p of S.parts){ const it=items.find(i=>JSON.stringify(i).includes(p.pr)); if(it){ p.order={orderId:o.id,orderItemId:it.order_item_id}; hit++; } } console.log('po',o.id.slice(0,8),o.display_number||o.number,'items',items.length,'hit',hit); if(hit) break; }
fs.writeFileSync(F,JSON.stringify(S,null,1)); console.log(JSON.stringify(S.parts.map(p=>p.order))); await s.close(); process.exit(0);
