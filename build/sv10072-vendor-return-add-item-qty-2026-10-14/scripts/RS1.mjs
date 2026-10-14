import {os,J,post} from './lib.mjs'; import fs from 'fs';
const T={'18658006-86a7-4ef0-934c-4668995722bf':16};
const s=await os(); await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
for(const [id,q] of Object.entries(T)){
  const row=((await s.api(`/api/inventory/parts?pagination[rowsPerPage]=20&pagination[page]=1&search=${id}`)).json?.data?.collection||[]).find(x=>x.id===id) || null;
  const d=(await s.api('/api/inventory/parts/'+id)).json?.data; const part=d?.part||d; const r0=row||part;
  if(!r0){console.log(id,'not found');continue;}
  const bins=(r0.binLocations||[]); if(bins.length!==1){console.log(id,'bins',J(bins));continue;}
  const body={id,catalog_part_id:r0.catalogue_part_id,category_id:r0.category,quantity:q,purchase_price:+(r0.purchase_price_value??r0.purchase_price),sell_price:+r0.sell_price,vendor_id:r0.vendor_id,min:r0.min,max:r0.max,tags:(r0.tags||[]).map(t=>t.id||t),bins:[{id:bins[0].binLocationId,quantity:q,isDefault:true}],core:false,core_charge:0};
  const before=part?.quantity; const c=await post(s,'/api/inventory/parts/change',body); const after=((await s.api('/api/inventory/parts/'+id)).json?.data?.part||{}).quantity;
  console.log(r0.part_number,'before',before,'-> change',c.status,'-> now',after,'(target',q,')', c.status>=300?J(c.json,300):''); }
await s.close();
