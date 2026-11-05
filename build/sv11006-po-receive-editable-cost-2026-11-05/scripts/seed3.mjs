// usage: node seed3.mjs <tag> <partNumber> <categoryId> [cost] [sell] -> WO + line + ONE vendor part ordered (optional cost/sell)
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const [TAG,PN,CAT,COST,SELL]=process.argv.slice(2);
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2000);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const W=ws.find(w=>w.id.startsWith(ENV==='prod'?'b617914c':'b3c8c820'));
await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone||'America/Edmonton'});
const COMPANY='6a7b6afc-084d-4584-aacb-773bcd71cbcd'; const veh=arr((await s.api('/api/vehicles?company_id='+COMPANY)).json?.data);
const c=await post(s,'/api/work-orders/create',{company_id:COMPANY,vehicle_id:veh[0]?.id,workplace_id:W.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); const wo=c.json?.data?.work_order_id;
const cans=arr((await s.api('/api/work-orders/canned-lines')).json?.data); const can=process.env.FIXED?cans.find(x=>x.fixed_line_total!=null&&Number(x.fixed_line_total)>0&&Number(x.total_parts)===0):cans.find(x=>Number(x.total_parts)===0&&x.workplace_id===W.id); console.log('canned',can?.canned_line_name,can?.fixed_line_total,can?.workplace_id===W.id);
const line=(await post(s,'/api/work-orders/'+wo+'/lines/create-from-canned-line',{canned_line_id:can.id,status:'authorized'})).json?.data?.line_id;
const V=arr((await s.api('/api/parts-catalogue/vendors?pagination[page]=1&pagination[rowsPerPage]=50')).json?.data)[0];
const body={work_order:wo,line,description:'ZZAUTOTEST SV-11006 '+PN,part_number:PN,quantity:1,part_source_type:'vendor',is_authorized:false,part_category_id:CAT,vendor_id:V.id}; if(COST){body.cost=Number(COST);body.sell_price=Number(SELL);}
const m=await post(s,'/api/work-orders/part/make-request',body); const pr=m.json?.data?.id; const o=await post(s,'/api/work-orders/part/perform-request-status-action',{part_request_id:pr,action:'order'});
const out={env:ENV,wo,line,parts:[{k:'A',pn:PN,pr,order:o.json?.data}],mk:m.json?.data?.part_request&&{cost:m.json.data.part_request.cost,sell:m.json.data.part_request.sell_price}};
out.number=((await s.api('/api/work-orders/view/'+wo)).json?.data?.work_order||{}).display_number; console.log(m.status,o.status,JSON.stringify(out.mk),out.number,out.parts[0].order?.orderId);
fs.writeFileSync(`/tmp/sv11006/seed-${ENV}-${TAG}.json`,JSON.stringify(out,null,1)); await s.close(); process.exit(0);
