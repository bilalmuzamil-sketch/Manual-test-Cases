import {sess,post,arr} from './common.mjs';
const s=await sess(); await s.go('/parts/inventory'); await s.page.waitForTimeout(3000);
const L=arr((await s.api('/api/inventory/parts?pagination[page]=1&pagination[rowsPerPage]=500')).json?.data); const P=L.find(p=>p.part_number==='895-PK'); console.log('part',P.id,JSON.stringify(P.binLocations));
const B=(await s.api('/api/inventory/bin-locations?limit=200')).json.data.binLocations; const a1a=B.find(b=>b.name==='A1A'); const cur=(P.binLocations||[]).map(b=>({id:b.id||b.binLocationId||B.find(x=>x.name===b.name)?.id,quantity:Number(b.quantity)}));
const r=await post(s,'/api/inventory/parts/cycle-count',{part_quantities:[{id:P.id,bins:[...cur,{id:a1a.id,quantity:2}]}]}); console.log('cycle',r.status,JSON.stringify(r.json).slice(0,200));
const P2=arr((await s.api('/api/inventory/parts?pagination[page]=1&pagination[rowsPerPage]=500')).json?.data).find(p=>p.part_number==='895-PK'); console.log('after',P2.quantity,JSON.stringify(P2.binLocations)); await s.close(); process.exit(0);
