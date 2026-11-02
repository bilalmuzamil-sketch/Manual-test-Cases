import fs from 'fs';
import {open} from '../../testing-tools/qa-session.mjs';
const rd=f=>fs.readFileSync('/tmp/sv10579/'+f,'utf8').trim(); const S=JSON.parse(rd('br-seed.json')); const [X,Y]=S.wos;
const s=await open({env:'branch',ticket:'10579',dir:'/tmp/qa1',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')}});
const post=async(u,b)=>{const r=await s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('  POST',u.replace('/api/',''),r.status,JSON.stringify(r.json||r.text).slice(0,200)); return r;};
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; const A=wps.find(w=>w.id===S.A), B=wps.find(w=>w.id===S.B);
const TECH='34156e50-1404-423e-b977-92e3c8ae14c7';
const vl=(await s.api('/api/parts-catalogue/vendors?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5')).json.data.collection;
await post('/api/iam/change-location',{workplace_id:B.id,workplace_timezone:B.timezone});
const o=await post('/api/inventory/orders/create',{vendor_id:vl[0].id,work_order_id:X.woId,workOrderId:X.woId,items:[{id:X.partId,part_request_id:X.partId,is_core:false,part_number:X.pn,quantity:1,price:10,description:'ZZAUTOTEST SV-10579 CROSS part (linked)'}]});
if(o.json?.data?.order_id){ const od=(await s.api('/api/inventory/orders/'+o.json.data.order_id)).json.data.order; console.log('  new order wo link',od.work_order_id,'workplace',od.workplace_id===B.id?'Lethbridge':od.workplace_id, od.order_number); }
await post('/api/technician-tasks/create',{start_date:'02/11/2026 06:00',tech_assigned_id:TECH,work_order_id:X.woId,line_id:X.lineId,resolve_overlaps:true});
const rep=await s.api('/api/reporting/punch-clock-activities/today?range=last_7_days&pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=50');
console.log('B timesheet report',rep.status,JSON.stringify(rep.json).slice(0,120)); const rows=JSON.stringify(rep.json); console.log('  mentions',X.number, rows.includes(X.number), 'woId', rows.includes(X.woId));
await post('/api/iam/change-location',{workplace_id:A.id,workplace_timezone:A.timezone});
process.exit(0);
