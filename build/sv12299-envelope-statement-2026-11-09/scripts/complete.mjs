import {sess,mkpost,load,save,j} from './common.mjs';
const s=await sess(); const post=mkpost(s); const S=load();
const ws=(await s.api('/api/staff/my-workplaces')).json.data.collection; const wp=ws.find(w=>w.id===S.wp);
await post('/api/iam/change-location',{workplace_id:wp.id,workplace_timezone:wp.timezone});
const ls=(await s.api('/api/work-orders/lines/'+S.wo)).json?.data?.collection||[];
for(const l of ls) await post('/api/work-orders/lines/change-status',{line_id:l.line_id,status:'complete',workOrderId:S.wo,work_order_id:S.wo});
let r=await post('/api/work-orders/change-status',{id:S.wo,status:'complete'});
if(r.status>=300){ await post('/api/work-orders/change-mileage',{work_order_id:S.wo,mileage:1000}); await post('/api/work-orders/change-status',{id:S.wo,status:'complete'}); }
const W=(await s.api('/api/work-orders/view/'+S.wo)).json?.data; const X=W?.work_order||W; console.log('WO',X?.number,X?.status,'invoice',X?.invoice_id||X?.invoiceId);
save(S); await s.close();
