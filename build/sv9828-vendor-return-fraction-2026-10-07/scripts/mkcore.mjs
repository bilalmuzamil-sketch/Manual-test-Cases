import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const find=async pn=>(await s.api('/api/inventory/parts?rowsPerPage=50&search='+encodeURIComponent(pn))).json.data.collection;
const x=(await find('P550848')).find(r=>r.part_number==='P550848');
const body={id:x.id,catalog_part_id:x.catalogue_part_id,category_id:x.category,quantity:x.quantity,purchase_price:x.purchase_price,sell_price:x.sell_price,vendor_id:x.vendor_id,min:x.min,max:x.max,tags:x.tags,bins:x.binLocations.map(b=>({id:b.binLocationId,quantity:b.quantity,isDefault:b.isDefault})),core:true,core_charge:25};
const r=await P('/api/inventory/parts/change',body); console.log('change',r.status,j(r.json,200));
const after=await find('P550848'); for(const z of after) console.log(j({id:z.id,pn:z.part_number,name:z.name,q:z.quantity,core_part_id:z.core_part_id,is_core:z.is_core,cc:z.core_charge,vend:z.vendor_name,bins:z.binLocations},400));
fs.writeFileSync('core-after.json',JSON.stringify(after)); await s.close();
