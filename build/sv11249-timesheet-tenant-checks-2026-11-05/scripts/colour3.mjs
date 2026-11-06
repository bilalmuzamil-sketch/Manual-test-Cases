// node colour3.mjs -> give the colour-less location a colour (workplaces/change, whole object), then create a work order in Heavy Duty again; prints both
import {sess,post} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2500);
const lst=await s.api('/api/workplaces'); console.log('GET /api/workplaces',lst.status); const all=(await s.api('/api/staff/my-workplaces')).json.data.collection; const w=all.find(x=>x.name.startsWith('ZZAUTOTEST NoColour')); const home=all.find(x=>x.id.startsWith('b3c8c820'));
const body={id:w.id,workplace_id:w.id,name:w.name,address_1:w.address_1,address_2:w.address_2,city:w.city,state_or_province:w.state_or_province,postal_code:w.postal_code,country_code:w.country_code,telephone:w.telephone,timezone:w.timezone,color:'#888888',shop_id:w.shop_id,remit_to:w.remit_to,remit_to_type:w.remit_to_type,shop_supplies_charge:w.shop_supplies_charge,min_shop_supplies_charge:w.min_shop_supplies_charge,max_shop_supplies_charge:w.max_shop_supplies_charge,shopSupplyPercentageEnabled:w.shopSupplyPercentageEnabled,tax:w.tax||{id:'819f3c25-5d9b-4bc6-9ddc-4e284ebe2f6b',name:'GST'},another:false};
const ch=await post(s,'/api/workplaces/change',body); console.log('workplaces/change',ch.status,JSON.stringify(ch.json).slice(0,200));
console.log('colour now',(await s.api('/api/staff/my-workplaces')).json.data.collection.find(x=>x.id===w.id).color, 'GET /api/workplaces now',(await s.api('/api/workplaces')).status);
const cust=(await s.api('/api/customers?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5')).json.data.collection[0]; const company=cust.company_id||cust.id;
const veh=(await s.api('/api/vehicles?company_id='+company)).json.data; const vehicle=(veh.collection||veh)[0]?.id;
await post(s,'/api/iam/change-location',{workplace_id:home.id,workplace_timezone:home.timezone});
const r=await post(s,'/api/work-orders/create',{company_id:company,vehicle_id:vehicle,workplace_id:home.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); console.log('WO create in Heavy Duty after colour set',r.status,JSON.stringify(r.json).slice(0,200));
await s.close(); process.exit(0);
