import {sess,post} from './common.mjs'; import fs from 'fs'; const s=await sess(); const p=s.page;
const WP='b3c8c820-f815-4cf1-8938-10956c5ee71a', CANNED='3a212080-8c00-4981-a46d-de91db43f3e7', TZ='America/Edmonton';
const N=+(process.env.N||10), DEP=+(process.env.DEP||0), TAG=process.env.TAG||'A';
const ok=(t,r)=>{ if(r.status>=300) console.log(t,r.status,JSON.stringify(r.json).slice(0,200)); return r.json; };
await post(s,'/api/iam/change-location',{workplace_id:WP,workplace_timezone:TZ});
const name='ZZAUTOTEST SV6456 '+TAG+' '+(Date.now()%100000);
const c=ok('cust',await post(s,'/api/customers/create',{name})); const company_id=c.data?.company_id||c.data?.id;
const ct=ok('contact',await post(s,'/api/contacts/create',{company_id,first_name:'ZZ',last_name:'Race'})); const contact_id=ct.data?.contact_id;
const v=ok('veh',await post(s,'/api/vehicles/create',{company_id,customer_id:contact_id,unit:'ZZ'+Date.now()%100000,vin:'ZZVIN'+Date.now()%1000000000})); const vehicle_id=v.data?.vehicle_id||v.data?.id;
const wos=[];
for(let i=0;i<N;i++){
  const w=ok('wo',await post(s,'/api/work-orders/create',{company_id,vehicle_id,workplace_id:WP,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true,mileage:1000})); const id=w.data?.work_order_id;
  ok('ctc',await post(s,'/api/work-orders/change-contact',{work_order_id:id,vehicle_id,contact_id,update_vehicle:true}));
  ok('line',await post(s,`/api/work-orders/${id}/lines/create-from-canned-line`,{canned_line_id:CANNED,status:'authorized'}));
  let dep=null; if(DEP){ const d=ok('dep',await post(s,'/api/deposits',{work_order_id:id,amount:DEP,payment_method:'CASH',deposit_date:new Date().toISOString().slice(0,10),memo:'ZZ6456'})); dep=d?.data?.id||d?.data?.depositId||JSON.stringify(d?.data).slice(0,80); }
  const lines=await s.api('/api/work-orders/lines/'+id); const line_id=lines.json.data.collection[0].line_id;
  ok('story',await post(s,'/api/work-orders/lines/change-story',{line_id,tech_story:'ZZAUTOTEST SV-6456 work done',work_order_id:id}));
  ok('done',await post(s,'/api/work-orders/lines/change-status',{line_id,work_order_id:id,status:'complete'}));
  await s.go('/workorders/'+id+'/lines'); await p.waitForTimeout(2500); const mr=p.locator('[data-test-id="button_mark_reviewed"]'); if(await mr.count()){ await mr.click(); await p.waitForTimeout(2000); }
  const st=await s.api('/api/work-orders/'+id); wos.push({id,number:st.json?.data?.number||st.json?.data?.work_order?.number,status:st.json?.data?.status||st.json?.data?.work_order?.status,dep});
}
console.log(JSON.stringify({name,company_id,wos})); fs.writeFileSync(`../ev/seed-${TAG}.json`,JSON.stringify({name,company_id,wos},null,1));
await s.close(); process.exit(0);
