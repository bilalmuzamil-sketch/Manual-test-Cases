// set-up only: create catalogue part PN/NAME, then an inventory part for it in the current location (qty 2). PROBE=1 just posts {} to read required fields
import {sess,post,arr} from './common.mjs'; import fs from 'fs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
if(process.env.PROBE){ for(const u of ['/api/parts-catalogue/add-catalogue-part','/api/inventory/parts/create']){ const r=await post(s,u,{}); console.log(u,r.status,JSON.stringify(r.json).slice(0,600)); } await s.close(); process.exit(0); }
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const W=ws.find(w=>w.name===(process.env.WP||'Trucks Hill 2')); console.log('wp',W?.name,(await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone})).status);
let r=process.env.CID?{status:'skip',json:{data:{catalogue_part_id:process.env.CID}}}:await post(s,'/api/parts-catalogue/add-catalogue-part',{name:process.env.NAME,part_number:process.env.PN,tags:[]}); console.log('catalogue',r.status,JSON.stringify(r.json).slice(0,250));
const cid=r.json?.data?.catalogue_part_id||r.json?.data?.id||r.json?.data?.catalogue_part?.id||r.json?.data?.cataloguePart?.id||r.json?.data?.catalog_part?.id;
const cats=arr((await s.api('/api/inventory/categories')).json?.data); const cat=cats[0]?.value||cats[0]?.id; const bins=arr((await s.api('/api/inventory/bin-locations')).json?.data?.binLocations||(await s.api('/api/inventory/bin-locations')).json?.data);
r=await post(s,'/api/inventory/parts/create',{catalog_part_id:cid,category_id:cat,quantity:2,cost:1,tags:[],bins:[{id:bins[0]?.id,quantity:2,isDefault:true}]}); console.log('inventory',r.status,JSON.stringify(r.json).slice(0,300));
await s.close(); process.exit(0);
