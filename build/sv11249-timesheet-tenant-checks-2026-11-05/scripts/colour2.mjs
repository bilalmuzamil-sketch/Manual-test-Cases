// node colour2.mjs -> after a colour-less location exists in the org: create a work order in the normal Heavy Duty location (was it broken org-wide?); prints request/response; also lists every workplace's colour
import {sess,post} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2500);
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; console.log('WORKPLACES',wps.map(w=>w.name+':'+w.color).join(' | '));
const home=wps.find(w=>w.id.startsWith('b3c8c820'));
const cust=(await s.api('/api/customers?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5')).json.data.collection[0]; const company=cust.company_id||cust.id;
const veh=(await s.api('/api/vehicles?company_id='+company)).json.data; const vehicle=(veh.collection||veh)[0]?.id;
const c=await post(s,'/api/iam/change-location',{workplace_id:home.id,workplace_timezone:home.timezone}); console.log('change-location',c.status);
const r=await post(s,'/api/work-orders/create',{company_id:company,vehicle_id:vehicle,workplace_id:home.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); console.log('WO create in',home.name,r.status,JSON.stringify(r.json).slice(0,300));
fs.writeFileSync('../ev/colour-transcript2.json',JSON.stringify({at:new Date().toISOString(),home:home.name,company,vehicle,status:r.status,response:r.json},null,1)); await s.close(); process.exit(0);
