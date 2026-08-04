import { login, api } from './qa8582.mjs';
import fs from 'fs';
const t=await login('admin'); const S=t.sessCookie;
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a';
const p=(n,r,l=700)=>console.log('#',n,r.status,(typeof r.body==='string'?r.body:JSON.stringify(r.body)).slice(0,l));
const CAT='dbc8e4da-65d7-4fdd-871d-3b744d0c8afd', CATEG='d64e8f1b-31e7-4c39-bedf-0846d97963cc', BIN='12954f55-479b-11f1-9bed-020a144de1a3';
const base={catalog_part_id:CAT, category_id:CATEG, quantity:5, cost:10, tags:[], workplace_id:HD, sell_price:20, min:0, max:10};
for (const bins of [ [{id:BIN, quantity:5, isDefault:true}], [{id:BIN, quantity:5}], [{id:BIN}] ]){
  const r=await api(S,'POST','/api/inventory/parts/create',{...base, is_core:true, bins});
  p('bins='+JSON.stringify(Object.keys(bins[0])), r, 700);
  if(r.status<300){ fs.writeFileSync('/tmp/report-suite-viu/seeded-core.json',JSON.stringify(r.body,null,1)); break; }
}
const list=await api(S,'GET','/api/inventory/parts?search=ZZAUTOTEST&pagination[rowsPerPage]=20');
console.log('readback:', JSON.stringify((list.body?.data?.collection||[]).map(x=>({id:x.id,pn:x.part_number,name:x.name,is_core:x.is_core,q:x.quantity,wp:x.workplace_id})),null,1));
