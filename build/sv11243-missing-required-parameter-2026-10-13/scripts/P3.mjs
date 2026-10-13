import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const s=await op({dpr:1}); await setLoc(s);
const PN='ZZ11243-920183', CAT='00e200b1-59fe-4c4a-88a1-952a6d38fee0', cid='f847f790-7fd9-4303-a33d-449ee1fb1a9a';
const r=await post(s,'/api/inventory/parts/create',{catalog_part_id:cid,category_id:CAT,quantity:2,cost:0.84,tags:[],vendor_id:'f9618e14-2255-470d-afc7-b20c8e7fc33d',bins:[{id:'1295e623-479b-11f1-9bed-020a144de1a3',quantity:2,isDefault:true}]}); console.log('inv',r.status,J(r.json,300));
const l=await s.api('/api/inventory/parts?limit=5&search='+PN); const it=(l.json.data.collection||[])[0]; console.log('inventory now',J(it&&{id:it.id,qty:it.quantity,pp:it.purchase_price,sp:it.sell_price,vendor:it.vendor_name,bins:it.binLocations,cat:it.catalogue_part_id},800));
fs.writeFileSync('seed.json',JSON.stringify({PN,catalog_id:cid,inv:it},null,1));
await s.close();
