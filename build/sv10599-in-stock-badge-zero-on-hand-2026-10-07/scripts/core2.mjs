import {ob,j} from './lib.mjs'; const s=await ob();
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const x=(await s.api('/api/inventory/parts?search=577.55547')).json.data.collection.find(x=>x.part_number==='577.55547');
const body={id:x.id,catalog_part_id:x.catalogue_part_id,category_id:x.category,quantity:x.quantity,purchase_price:x.purchase_price,sell_price:x.sell_price,vendor_id:x.vendor_id,min:x.min,max:x.max,tags:x.tags,bins:x.binLocations.map(b=>({id:b.binLocationId,quantity:b.quantity,isDefault:b.isDefault})),core:true,core_charge:25,is_fixed_price:false};
const r=await P('/api/inventory/parts/change',body); console.log('change',r.status,j(r.json,300));
const y=(await s.api('/api/inventory/parts?search=577.55547')).json.data.collection.map(z=>[z.part_number,z.quantity,z.core_charge,z.core_part_id,z.is_core,z.sell_price,z.vendor_id===x.vendor_id]); console.log(j(y));
await s.close();
