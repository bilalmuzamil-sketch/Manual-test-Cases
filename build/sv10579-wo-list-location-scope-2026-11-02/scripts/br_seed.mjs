import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim();
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; console.log('wps',wps.map(w=>w.name).join(' | '));
const A=wps.find(w=>/Heavy Duty/.test(w.name)), B=wps.find(w=>/Lethbridge/.test(w.name));
const loc=async w=>(await post('/api/iam/change-location',{workplace_id:w.id,workplace_timezone:w.timezone})).status;
console.log('to A',await loc(A));
const L=(await s.api('/api/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5&pagination%5BsortBy%5D=startDate&pagination%5Bdescending%5D=true')).json.data.work_orders;
const d=(await s.api('/api/work-orders/view/'+L[0].id)).json.data; const w0=d.work_order||d; const company=w0.company_id||w0.company?.id, vehicle=w0.vehicle_id||w0.vehicle?.id;
const cl=(await s.api('/api/work-orders/canned-lines?limit=100')).json.data.collection.filter(x=>x.workplace_id===A.id);
const cats=(await s.api('/api/inventory/categories?limit=500')).json.data.collection;
const vl=(await s.api('/api/parts-catalogue/vendors?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5')).json.data.collection;
const out={A:A.id,B:B.id,wos:[]};
for(const tag of ['CROSS','SAME']){
  const c=await post('/api/work-orders/create',{company_id:company,vehicle_id:vehicle,workplace_id:A.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true}); const woId=c.json.data.work_order_id;
  let ln=await post(`/api/work-orders/${woId}/lines/create-from-canned-line`,{canned_line_id:cl[0].id,status:'authorized'});
  if(ln.status>=300) ln=await post('/api/work-orders/lines/create',{canned_line_id:cl[0].id,work_order_id:woId,status:'authorized'});
  const lr=(await s.api('/api/work-orders/lines/'+woId)).json.data; const line=(Array.isArray(lr)?lr:lr.collection)[0];
  const pn='ZZ10579'+tag+'-'+(Date.now()%100000);
  const pr=await post('/api/work-orders/part/make-request',{line:line.line_id,work_order:woId,description:'ZZAUTOTEST SV-10579 '+tag+' part',quantity:1,part_source_type:'vendor',part_number:pn,price:10,part_category_id:cats[0].value,vendor_id:vl[0].id});
  const v=(await s.api('/api/work-orders/view/'+woId)).json.data; const W=v.work_order||v;
  out.wos.push({tag,woId,number:W.number,lineId:line.line_id,partId:pr.json.data?.id,pn}); console.log(tag,c.status,ln.status,pr.status,W.number,woId);
}
fs.writeFileSync('/tmp/sv10579/br-seed.json',JSON.stringify(out,null,1)); process.exit(0);
