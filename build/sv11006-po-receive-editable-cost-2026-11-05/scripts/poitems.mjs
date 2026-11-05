import {sess} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1000);
const o=(await s.api('/api/inventory/orders/'+process.argv[2])).json?.data?.order; console.log('po',o.order_number,'wo',o.work_order_id.slice(0,8),'status',o.status,'items',o.items.length);
for(const i of o.items) console.log(' ',i.part_number,'remaining',i.quantity_remaining,'wo',(i.work_order_id||'').slice(0,8),'status',i.status||i.status_label||'');
for(const q of process.argv.slice(3)){ const l=(await s.api(`/api/inventory/orders?search=${q}&limit=20`)).json; const t=JSON.stringify(l); console.log('search',q,[...t.matchAll(/"order_number":"([^"]+)"/g)].map(m=>m[1]).join(','), [...t.matchAll(/"status_label":"([^"]+)"/g)].map(m=>m[1]).join(',')); }
await s.close(); process.exit(0);
