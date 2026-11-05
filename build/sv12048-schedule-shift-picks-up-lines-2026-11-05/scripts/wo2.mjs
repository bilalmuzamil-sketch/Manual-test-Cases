// usage: node wo.mjs <tag> <nLines> [lineStatus=authorized] [cannedName="Service - Install coupler"] [noWoApprove]
// fresh customer+contact+vehicle, WO at Heavy Duty, N lines from the canned line; WO -> approved. Writes /tmp/sv12048/wo-<tag>.json
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const [TAG,N,ST,CAN,NOAPP]=process.argv.slice(2); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1500); const log=(...a)=>console.log(...a);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const W=ws.find(w=>w.id.startsWith(process.env.WP||'b3c8c820')); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone||'America/Edmonton'});
const nm='ZZAUTOTEST SV12048 '+TAG+' '+Date.now().toString().slice(-5);
const co=(await post(s,'/api/customers/create',{name:nm})).json?.data; const company=co?.company_id||co?.id;
const ctr=await post(s,'/api/contacts/create',{company_id:company,first_name:'ZZ',last_name:'Test'+TAG,email:`zz12048${TAG}@example.com`}); log('contact http',ctr.status,JSON.stringify(ctr.json).slice(0,300)); const ct=ctr.json?.data; const contact=ct?.contact_id||ct?.id||ct?.customer_id||ct?.contact?.id; 
const vh=(await post(s,'/api/vehicles/create',{company_id:company,customer_id:contact,unit:'ZZ'+TAG})).json?.data; const vehicle=vh?.vehicle_id||vh?.id||vh?.vehicle?.id; log('vehicle resp',JSON.stringify(vh).slice(0,200));
const c=await post(s,'/api/work-orders/create',{company_id:company,customer_id:contact,vehicle_id:vehicle,workplace_id:W.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); const wo=c.json?.data?.work_order_id; log('ids',company,contact,vehicle,'wo',c.status,wo);
const all=arr((await s.api('/api/work-orders/canned-lines')).json?.data); const can=CAN==='LONGEST'?all.filter(x=>Number(x.total_parts)===0&&(!x.workplace_id||x.workplace_id===W.id)).sort((a,b)=>Number(b.time_estimate)-Number(a.time_estimate))[0]:all.find(x=>x.canned_line_name.trim()===(CAN||'Service - Install coupler')); console.log('canned',can?.canned_line_name,can?.time_estimate);
const lines=[]; for(let i=0;i<Number(N||0);i++){ const l=await post(s,'/api/work-orders/'+wo+'/lines/create-from-canned-line',{canned_line_id:can.id,status:ST||'authorized'}); lines.push(l.json?.data?.line_id); log('line',l.status,JSON.stringify(l.json).slice(0,120)); }
if(!NOAPP){ const r=await post(s,'/api/work-orders/change-status',{id:wo,status:'approved'}); log('wo approved',r.status,JSON.stringify(r.json).slice(0,100)); }
const v=(await s.api('/api/work-orders/view/'+wo)).json?.data; const out={tag:TAG,wo,number:(v?.work_order||v)?.display_number,company,contact,vehicle,customerName:nm,lines,canned:can.canned_line_name,estimate:can.time_estimate};
console.log(JSON.stringify(out)); fs.writeFileSync(`/tmp/sv12048/wo-${TAG}.json`,JSON.stringify(out,null,1)); await s.close(); process.exit(0);
