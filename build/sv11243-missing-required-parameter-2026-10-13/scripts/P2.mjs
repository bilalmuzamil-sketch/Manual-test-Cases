import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const s=await op({dpr:1}); await setLoc(s);
const PN='ZZ11243-920183', CAT='00e200b1-59fe-4c4a-88a1-952a6d38fee0';
let r=await post(s,'/api/parts-catalogue/add-catalogue-part',{name:'ZZAUTOTEST Round jacketed 2 wire cable ft',part_number:PN,tags:[],category_id:CAT}); console.log('catalog',r.status,J(r.json,300));
const cid=r.json?.data?.id||r.json?.data?.catalogue_part_id||r.json?.id;
const tries=[{bins:[{binLocationId:'1295e623-479b-11f1-9bed-020a144de1a3',quantity:2}]},{bins:[{bin_location_id:'1295e623-479b-11f1-9bed-020a144de1a3',quantity:2}]},{bins:[{id:'1295e623-479b-11f1-9bed-020a144de1a3',quantity:2}]}];
let inv=null;
for(const t of tries){ r=await post(s,'/api/inventory/parts/create',Object.assign({catalog_part_id:cid,category_id:CAT,quantity:2,cost:0.84,tags:[],vendor_id:'f9618e14-2255-470d-afc7-b20c8e7fc33d'},t)); console.log('inv try',J(t),r.status,J(r.json,300)); if(r.status<300){ inv=r.json; break; } }
const l=await s.api('/api/inventory/parts?limit=5&search='+PN); console.log('inventory now',J((l.json.data.collection||[]).map(x=>({id:x.id,qty:x.quantity,pp:x.purchase_price,sp:x.sell_price,vendor:x.vendor_name,bins:x.binLocations,cat:x.catalogue_part_id})),800));
fs.writeFileSync('seed.json',JSON.stringify({PN,catalog_id:cid,inv:(l.json.data.collection||[])[0]},null,1));
await s.close();
