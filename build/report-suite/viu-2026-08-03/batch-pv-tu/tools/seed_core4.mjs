import { login, api } from './qa8582.mjs';
import fs from 'fs';
const t=await login('admin'); const S=t.sessCookie;
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a',LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
const p=(n,r,l=600)=>console.log('#',n,r.status,(typeof r.body==='string'?r.body:JSON.stringify(r.body)).slice(0,l));
const CAT='dbc8e4da-65d7-4fdd-871d-3b744d0c8afd';
const CATEG='d64e8f1b-31e7-4c39-bedf-0846d97963cc';
const BIN='12954f55-479b-11f1-9bed-020a144de1a3';
const base={catalog_part_id:CAT, category_id:CATEG, quantity:5, cost:10, tags:[], bins:[{binLocationId:BIN,quantity:5,isDefault:true}], workplace_id:HD};
let r=await api(S,'POST','/api/inventory/parts/create',{...base, is_core:true, sell_price:20, min:0, max:10});
p('inv create is_core', r, 900);
if(r.status>=300){ r=await api(S,'POST','/api/inventory/parts/create',{...base, isCore:true}); p('inv create isCore', r, 900); }
if(r.status>=300){ r=await api(S,'POST','/api/inventory/parts/create',base); p('inv create plain', r, 900); }
const id=r.body?.data?.inventory_part_id||r.body?.data?.id||null;
console.log('created id:', id);
// read back
const list=await api(S,'GET','/api/inventory/parts?search=ZZAUTOTEST&pagination[rowsPerPage]=20');
const found=(list.body?.data?.collection||[]).map(x=>({id:x.id,pn:x.part_number,name:x.name,is_core:x.is_core,core_charge:x.core_charge,q:x.quantity,wp:x.workplace_id}));
console.log('readback:', JSON.stringify(found,null,1));
fs.writeFileSync('/tmp/report-suite-viu/seeded-core.json', JSON.stringify({catalogue:CAT, inventory:found},null,1));
