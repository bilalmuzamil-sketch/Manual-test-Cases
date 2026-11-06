// node seedshift.mjs -> sv12214: WO + approved canned line, then book it today 08:00 on a technician (POST /api/schedule/shifts). prints ids
import {sess,post} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/schedule'); await p.waitForTimeout(2000); const arr=x=>Array.isArray(x)?x:(x?.collection||x?.items||[]);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const W=ws.find(w=>w.id.startsWith('b3c8c820')); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone});
const nm='ZZAUTOTEST SV12214 '+Date.now().toString().slice(-5);
const co=(await post(s,'/api/customers/create',{name:nm})).json?.data; const company=co?.company_id||co?.id;
const ct=(await post(s,'/api/contacts/create',{company_id:company,first_name:'ZZ',last_name:'Q12214',email:`zz12214${Date.now()%100000}@example.com`})).json?.data; const contact=ct?.contact_id||ct?.id;
const vh=(await post(s,'/api/vehicles/create',{company_id:company,customer_id:contact,unit:'ZZ12214'})).json?.data; const vehicle=vh?.vehicle_id||vh?.id;
const wo=(await post(s,'/api/work-orders/create',{company_id:company,customer_id:contact,vehicle_id:vehicle,workplace_id:W.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true})).json?.data?.work_order_id;
const all=arr((await s.api('/api/work-orders/canned-lines')).json?.data); const can=all.filter(x=>Number(x.time_estimate)>0).sort((a,b)=>Number(a.time_estimate)-Number(b.time_estimate)).find(x=>Number(x.time_estimate)>=1)||all.find(x=>Number(x.time_estimate)>0);
const ln=(await post(s,'/api/work-orders/'+wo+'/lines/create-from-canned-line',{canned_line_id:can.id,status:'authorized'})).json?.data?.line_id;
await post(s,'/api/work-orders/change-status',{id:wo,status:'approved'});
const d=new Date(); const iso=d.toISOString().slice(0,10); const from=iso+'T00:00:00Z', to=iso+'T23:59:59Z';
const b=(await s.api(`/api/schedule/board?from=${from}&to=${to}`)).json?.data?.board; const st=(b?.workingWindows||[]).find(w=>w.staffId)?.staffId;
const techs=arr((await s.api('/api/technicians')).json?.data); const t=techs.find(x=>((x.first_name||'')+' '+(x.last_name||'')+(x.name||'')).includes(process.env.STAFF_NAME)&&!/ZZAUTOTEST/.test(x.first_name||''))||techs[0]; const staffId=t.staff_id||t.id; console.log('tech',JSON.stringify(t).slice(0,160));
let r=await post(s,'/api/schedule/shifts',{workOrderId:wo,lineIds:[ln],staffId,startDate:iso,startTime:process.env.START||'08:00',spreadMode:'single',totalMinutes:120,perDayMinutes:120}); console.log('shift',r.status,JSON.stringify(r.json).slice(0,300));
if(r.status>=400){ const dep=(t.departments||[])[0]?.id||t.department_id; r=await post(s,'/api/schedule/shifts',{workOrderId:wo,lineIds:[ln],staffId,departmentId:dep,startDate:iso,startTime:process.env.START||'08:00',spreadMode:'single',totalMinutes:120,perDayMinutes:120}); console.log('shift2',r.status,JSON.stringify(r.json).slice(0,300),'tech keys',Object.keys(t).join(',')); }
console.log('wo',wo,'line',ln,'staff',staffId,'canned',can.canned_line_name);
await s.close(); process.exit(0);
