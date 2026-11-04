// usage: node wo.mjs <tag>  -> creates a WO with one canned labour-only line at the session location; prints ids
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const COMPANY=process.env.COMPANY||'6a7b6afc-084d-4584-aacb-773bcd71cbcd';
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const me=(await s.api('/api/auth/me')).json?.data; const wp=me?.workplace_id||me?.current_workplace_id||me?.user?.workplace_id;
const veh=arr((await s.api('/api/vehicles?company_id='+COMPANY)).json?.data); const vid=veh[0]?.id;
const today=new Date().toISOString().slice(0,10);
let WP=process.env.WP||'b3c8c820-f815-4cf1-8938-10956c5ee71a'; if(WP.length<36){ const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); WP=ws.find(w=>w.id.startsWith(WP)).id; }
const c=await post(s,'/api/work-orders/create',{company_id:COMPANY,vehicle_id:vid,workplace_id:WP,start_date:today,is_vehicle_here:true}); const wo=c.json?.data?.work_order_id;
const cl=arr((await s.api('/api/work-orders/canned-lines')).json?.data); const can=cl.find(x=>Number(x.total_parts)===0&&x.workplace_id===WP)||cl.find(x=>Number(x.total_parts)===0);
const l=await post(s,'/api/work-orders/'+wo+'/lines/create-from-canned-line',{canned_line_id:can.id,status:'authorized'});
const v=(await s.api('/api/work-orders/view/'+wo)).json?.data; const w=v?.work_order||v;
const out={wo,number:w?.display_number,company:COMPANY,vehicle:vid,line:l.json?.data?.line_id,lineSt:l.status,canned:can?.canned_line_name,create:c.status,wp:w?.workplace_id};
console.log(JSON.stringify(out)); fs.writeFileSync(`/tmp/sv12039/wo-${process.env.ENV||'branch'}-${process.argv[2]||'x'}.json`,JSON.stringify(out));
await s.close(); process.exit(0);
