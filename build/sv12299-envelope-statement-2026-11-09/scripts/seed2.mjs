import {sess,mkpost,load,save,j} from './common.mjs';
const s=await sess(); const post=mkpost(s); const S=load();
const ws=(await s.api('/api/staff/my-workplaces')).json.data.collection; const wp=ws.find(w=>w.id===S.wp);
await post('/api/iam/change-location',{workplace_id:wp.id,workplace_timezone:wp.timezone});
await post('/api/customers/change',{id:S.cid,name:'ZZAUTOTEST SV12299 Charge Account',credit_term:'Net 30',country_code:'CA'});
let cv=(await s.api('/api/customers/view/'+S.cid)).json?.data; cv=cv?.company||cv; console.log('credit_term',cv.credit_term,'acct',cv.customer_account_id);
const ct=await post('/api/contacts/create',{company_id:S.cid,first_name:'Inbox',last_name:'SV12299',email:'bilal.muzamil+sv12299@shopview.com'}); S.ctid=ct.json?.data?.contact_id||ct.json?.data?.id;
const v=await post('/api/vehicles/create',{company_id:S.cid,customer_id:S.ctid,unit:'12299'}); S.vid=v.json?.data?.vehicle_id||v.json?.data?.id;
const w=await post('/api/work-orders/create',{company_id:S.cid,customer_id:S.ctid,vehicle_id:S.vid,workplace_id:S.wp,start_date:new Date().toISOString().slice(0,19).replace('T',' '),is_vehicle_here:true}); S.wo=w.json?.data?.work_order_id||w.json?.data?.id;
await post('/api/work-orders/change-contact',{work_order_id:S.wo,vehicle_id:S.vid,contact_id:S.ctid,update_vehicle:true});
const cl=(await s.api('/api/work-orders/canned-lines')).json; const L=(cl?.data?.collection||cl?.data||[]);
for(const c of L){const r=await post(`/api/work-orders/${S.wo}/lines/create-from-canned-line`,{canned_line_id:c.id,status:'authorized'},true); console.log('canned',c.name||c.title,r.status); if(r.status<300) break;}
const ls=(await s.api('/api/work-orders/lines/'+S.wo)).json?.data?.collection||[]; console.log('lines',j(ls.map(l=>({id:l.id,st:l.status,n:l.name}))));
const parts=(await s.api('/api/work-orders/parts/'+S.wo)).json; console.log('parts',j(parts?.data));
const W=(await s.api('/api/work-orders/view/'+S.wo)).json?.data; const X=W?.work_order||W; S.number=X?.number; console.log('WO',X?.number,X?.status);
save(S); await s.close();
