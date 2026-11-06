// node colour.mjs -> API-only repro: create a location WITHOUT colour and one WITH colour, switch to each, create a work order; prints every request + response verbatim (to ../ev/colour-transcript.json)
import {sess,post} from './common.mjs'; import fs from 'fs';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2500); const T=[];
const call=async(method,url,body)=>{ const r=body?await post(s,url,body):await s.api(url); const e={method,url,body,status:r.status,response:r.json??r.text,headers:{'x-request-id':r.headers?.['x-request-id']}}; T.push(e); console.log(method,url,r.status,JSON.stringify(r.json??r.text).slice(0,300)); return r; };
const ts=Date.now().toString().slice(-5); const wps0=(await s.api('/api/staff/my-workplaces')).json.data.collection; const home=wps0.find(w=>w.id.startsWith('b3c8c820'))||wps0[0];
const base={shop_id:'ZZ'+ts,address_1:'1 Test St',city:'Calgary',state_or_province:'AB',postal_code:'T2P1J9',telephone:'4035550100',timezone:'America/Edmonton',country_code:'CA'};
await call('POST','/api/workplaces/create',{name:'ZZAUTOTEST NoColour '+ts,...base});
await call('POST','/api/workplaces/create',{name:'ZZAUTOTEST WithColour '+ts,...base,shop_id:'ZY'+ts,color:'#3366ff'});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const noC=wps.find(w=>w.name==='ZZAUTOTEST NoColour '+ts), withC=wps.find(w=>w.name==='ZZAUTOTEST WithColour '+ts);
console.log('my-workplaces has new',!!noC,!!withC, noC&&JSON.stringify({id:noC.id,color:noC.color}), withC&&JSON.stringify({id:withC.id,color:withC.color}));
const wos=(await s.api('/api/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=1')).json; const w0=(wos.data?.collection||wos.data?.workOrders||[])[0]||{};
const cust=(await s.api('/api/customers?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5')).json.data.collection[0]; const company=cust.company_id||cust.id;
const veh=(await s.api('/api/vehicles?company_id='+company)).json.data; const vehicle=(veh.collection||veh)[0]?.id;
for(const w of [noC,withC]){ if(!w) continue; await call('POST','/api/iam/change-location',{workplace_id:w.id,workplace_timezone:w.timezone});
  await call('POST','/api/work-orders/create',{company_id:company,vehicle_id:vehicle,workplace_id:w.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); }
await call('POST','/api/iam/change-location',{workplace_id:home.id,workplace_timezone:home.timezone});
fs.writeFileSync('../ev/colour-transcript.json',JSON.stringify({at:new Date().toISOString(),company,vehicle,calls:T},null,1)); await s.close(); process.exit(0);
