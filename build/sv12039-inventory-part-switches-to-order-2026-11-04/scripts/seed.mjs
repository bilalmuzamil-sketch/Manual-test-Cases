// usage: [ENV=prod] REF=<existing inventory part id at the session location> node seed.mjs  -> creates catalog+inventory parts (stock 1) for the matrix
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const ref=arr((await s.api('/api/inventory/parts?limit=5&search='+encodeURIComponent(process.env.REFPN))).json?.data).find(x=>x.id===process.env.REF);
console.log('ref keys',Object.keys(ref||{}).join(','));
const bin=(ref.binLocations||[])[0]; console.log('ref bins',JSON.stringify(ref.binLocations).slice(0,300),'cat',JSON.stringify(ref.category).slice(0,120));
const binId=bin?.bin_location_id||bin?.binLocationId||bin?.id; const catId=ref.category?.id||ref.category?.value||ref.category; const wp=ref.workplace_id;
const PNS=JSON.parse(fs.readFileSync('/tmp/sv12039/pns.json','utf8')); const out=[];
for(const [pn,name] of PNS){
  const c=await post(s,'/api/parts-catalogue/add-catalogue-part',{name,part_number:pn,size:'',category:catId,measurement:'ea',manufacturer_id:null,tags:[],category_id:catId});
  const cid=c.json?.data?.id||c.json?.data?.catalogue_part_id||c.json?.data?.catalog_part_id; console.log('catalog',pn,c.status,JSON.stringify(c.json).slice(0,200));
  const i=await post(s,'/api/inventory/parts/create',{catalog_part_id:cid,category_id:catId,quantity:1,cost:285.44,purchase_price:285.44,sell_price:414.60,tags:[],workplace_id:wp,min:0,max:5,bins:[{id:binId,quantity:1,isDefault:true}]});
  console.log('inventory',pn,i.status,JSON.stringify(i.json).slice(0,300));
  const found=arr((await s.api('/api/inventory/parts?limit=5&search='+encodeURIComponent(pn))).json?.data).filter(x=>x.part_number===pn||x.part_number.trim()===pn.trim()).map(x=>({id:x.id,pn:x.part_number,qty:x.quantity,wp:x.workplace_id}));
  out.push({pn,name,catalog:cid,inv:found}); }
fs.writeFileSync(`/tmp/sv12039/seed-${ENV}-${process.env.SET||'a'}.json`,JSON.stringify(out,null,1)); console.log(JSON.stringify(out,null,1));
await s.close(); process.exit(0);
