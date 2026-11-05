// usage: [ENV=prod] node seed.mjs <tag> -> WO (at the home location) + 1 canned line + 2 vendor parts ordered on a PO
//   part A: cost 40 / sell 90 ; part B: no cost, no sell. Prints ids, writes /tmp/sv12003/seed-<env>-<tag>.json
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const TAG=process.argv[2]||'a';
const CFG=ENV==='prod'?{wp:'b617914c',company:process.env.COMPANY||JSON.parse(fs.readFileSync('/tmp/sv12039/wo-prod-p1.json','utf8')).company}:{wp:'b3c8c820',company:'6a7b6afc-084d-4584-aacb-773bcd71cbcd'};
const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(2500);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const W=ws.find(w=>w.id.startsWith(CFG.wp));
const cl=await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone||W.time_zone||'America/Edmonton'}); console.log('change-location',cl.status,W.name);
const veh=arr((await s.api('/api/vehicles?company_id='+CFG.company)).json?.data);
const today=new Date().toISOString().slice(0,10);
const c=await post(s,'/api/work-orders/create',{company_id:CFG.company,vehicle_id:veh[0]?.id,workplace_id:W.id,start_date:today,is_vehicle_here:true}); const wo=c.json?.data?.work_order_id; console.log('create',c.status,wo);
const cans=arr((await s.api('/api/work-orders/canned-lines')).json?.data); const can=cans.find(x=>Number(x.total_parts)===0&&x.workplace_id===W.id)||cans.find(x=>Number(x.total_parts)===0);
const l=await post(s,'/api/work-orders/'+wo+'/lines/create-from-canned-line',{canned_line_id:can.id,status:'authorized'}); const line=l.json?.data?.line_id; console.log('line',l.status,line);
const vs=arr((await s.api('/api/parts-catalogue/vendors?pagination[page]=1&pagination[rowsPerPage]=50')).json?.data); const V=vs.find(v=>/zzautotest/i.test(v.name||v.company_name||''))||vs[0];
const cats=arr((await s.api('/api/inventory/categories?limit=500')).json?.data); const cat=(cats.find(x=>x.label==='Uncategorized')||cats[0]).value;
const stamp=Date.now().toString().slice(-6); const out={env:ENV,wo,line,vendor:V?.id,vendorName:V?.name||V?.company_name,category:cat,parts:[]};
for(const [k,cost,sell] of [['A',40,90],['B',null,null]]){ const pn=`ZZ12003-${TAG}${k}-${stamp}`;
  const body={work_order:wo,line,description:'ZZAUTOTEST SV-12003 part '+k,part_number:pn,quantity:1,part_source_type:'vendor',is_authorized:false,part_category_id:cat,vendor_id:V?.id}; if(cost!==null){body.cost=cost;body.sell_price=sell;} if(process.env.CORE&&k==='A'){body.core_charge=Number(process.env.CORE);}
  const m=await post(s,'/api/work-orders/part/make-request',body); const pr=m.json?.data?.part_request_id||m.json?.data?.id; console.log('make-request',k,m.status,JSON.stringify(m.json).slice(0,160));
  const o=await post(s,'/api/work-orders/part/perform-request-status-action',{part_request_id:pr,action:'order'}); console.log('order',k,o.status,JSON.stringify(o.json).slice(0,200));
  out.parts.push({k,pn,pr,cost,sell,order:o.json?.data}); }
const v=(await s.api('/api/work-orders/view/'+wo)).json?.data; out.number=(v?.work_order||v)?.display_number;
console.log(JSON.stringify(out)); fs.writeFileSync(`/tmp/sv12003/seed-${ENV}-${TAG}.json`,JSON.stringify(out,null,1)); await s.close(); process.exit(0);
