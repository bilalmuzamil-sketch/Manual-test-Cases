import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const CK=JSON.parse(rd('br-ck.json')); const K=CK.K;
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); if(!/change-location/.test(u)) console.log('  ',u.replace('/api/',''),JSON.stringify(b).slice(0,120),r.status,JSON.stringify(r.json||r.text).slice(0,200)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const B=wps.find(w=>w.id===S.B), A=wps.find(w=>w.id===S.A);
await post('/api/iam/change-location',{workplace_id:B.id,workplace_timezone:B.timezone});
const v=(await s.api('/api/parts-catalogue/vendors?pagination[rowsPerPage]=5&pagination[page]=1')).json.data; const vendor=(v.collection||v)[0].id;
const item={id:null,is_core:false,part_number:'ZZ10579XORD',quantity:1,price:5,description:'ZZAUTOTEST SV-10579 cross order'};
const made=[];
for(const extra of [{work_order_id:K.id},{workOrderId:K.id},{work_order_id:K.id,line_id:K.line}]){
  const r=await post('/api/inventory/orders/create',{vendor_id:vendor,items:[item],...extra}); const id=r.json?.data?.id||r.json?.data?.order_id||r.json?.data?.orderId; if(id) made.push(id); }
for(const id of made){ const o=(await s.api('/api/inventory/orders/'+id)).json.data?.order; console.log('order',id.slice(0,8),'wo=',o?.work_order_id===K.id?'K':o?.work_order_id,'wp=',o?.workplace_id===S.B?'Leth':o?.workplace_id); }
fs.writeFileSync('/tmp/sv10579/br-ord.json',JSON.stringify({made,vendor}));
process.exit(0);
