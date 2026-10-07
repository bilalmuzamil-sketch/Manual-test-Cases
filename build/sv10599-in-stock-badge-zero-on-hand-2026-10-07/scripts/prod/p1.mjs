import {op,j} from '../lib.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('prod/setup642.json')); const s=await op({dpr:2}); const p=s.page;
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const TH='b617914c-16e9-4485-8e8b-193cd86aa416'; console.log('loc',(await P('/api/iam/change-location',{workplace_id:TH,workplace_timezone:'Africa/Accra'})).status);
console.log(j(await s.marker()));
let all=[]; for(let pg=1;pg<=5;pg++){const c=(await s.api(`/api/inventory/parts?limit=100&page=${pg}`)).json?.data?.collection||[]; all=all.concat(c); if(c.length<100)break;}
const z=all.filter(x=>x.quantity==0&&!x.is_core&&!x.core_part_id&&!x.has_work_order_part&&x.part_number); const pos=all.filter(x=>x.quantity>=5&&!x.is_core&&!x.core_part_id&&x.part_number);
console.log('inv',all.length,'zero',z.length,j(z.slice(0,5).map(x=>[x.part_number,x.name.slice(0,30),x.quantity])),'pos',j(pos.slice(0,3).map(x=>[x.part_number,x.name.slice(0,30),x.quantity])));
const C=S.pick; const cr=await P('/api/work-orders/create',{company_id:C.company_id,customer_id:C.contact.id,vehicle_id:C.vehicle.id,workplace_id:TH,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true});
const wo=cr.json.data.work_order_id; const ln=await P(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:S.canned[0].id,status:'authorized'});
const v=(await s.api('/api/work-orders/view/'+wo)).json.data; console.log('wo',wo,v.work_order?.number??v.number,'line',ln.status);
fs.writeFileSync('prod/wo.json',JSON.stringify({wo,line:ln.json.data.line_id,zero:z[0]?.part_number,pos:pos[0]?.part_number}));
await s.close();
