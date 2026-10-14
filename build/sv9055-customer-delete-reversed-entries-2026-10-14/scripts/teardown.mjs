import {J,post} from './lib.mjs';
const ok=(tag,r)=>{ console.log(tag,r.status,J(r.json,200)); return r; };
export async function clearWO(s,A){
  const st=(await s.api('/api/work-orders/view/'+A.work_order_id)).json?.data?.work_order?.status; console.log('wo status before clear',st);
  if(!/^(Complete|Estimate|Approved|In Progress)$/i.test(st||'')) throw new Error('STOP: work order is '+st+' - will not delete');
  ok('reopen line',await post(s,'/api/work-orders/lines/change-status',{line_id:A.line_id,work_order_id:A.work_order_id,status:'authorized'}));
  ok('delete line',await post(s,'/api/work-orders/lines/delete',{line_id:A.line_id,work_order_id:A.work_order_id}));
  ok('delete wo',await post(s,'/api/work-orders/delete',{work_order_id:A.work_order_id}));
}
export async function clearAssetContact(s,A){
  ok('delete asset',await post(s,'/api/vehicles/delete',{vehicle_id:A.vehicle_id,company_id:A.company_id}));
  ok('delete contact',await post(s,'/api/contacts/delete',{customer_id:A.contact_id,company_id:A.company_id}));
}
