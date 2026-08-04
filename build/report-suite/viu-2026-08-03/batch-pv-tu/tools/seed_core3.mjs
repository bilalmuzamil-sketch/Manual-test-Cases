import { login, api } from './qa8582.mjs';
const t=await login('admin'); const S=t.sessCookie;
const p=(n,r,l=500)=>console.log('#',n,r.status,(typeof r.body==='string'?r.body:JSON.stringify(r.body)).slice(0,l));
// create a catalogue part
let r=await api(S,'POST','/api/parts-catalogue/add-catalogue-part',{name:'ZZAUTOTEST core item',part_number:'ZZAUTOTEST-CORE-1',tags:[]});
p('cat create', r, 900);
// find it + learn the shape of an existing inventory part to copy category/bins
const inv=await api(S,'GET','/api/inventory/parts?pagination[rowsPerPage]=1');
const sample=inv.body.data.collection[0];
console.log('\nsample inventory part:', JSON.stringify({id:sample.id, catalogue_part_id:sample.catalogue_part_id, category:sample.category, category_label:sample.category_label, bins:sample.binLocations, is_core:sample.is_core, core_charge:sample.core_charge, tags:sample.tags, purchase_price:sample.purchase_price}, null, 1));
