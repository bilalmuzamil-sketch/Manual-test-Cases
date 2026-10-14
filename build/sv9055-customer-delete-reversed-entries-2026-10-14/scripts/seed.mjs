import {J,post} from './lib.mjs';
export const WP='b3c8c820-f815-4cf1-8938-10956c5ee71a', CANNED='3a212080-8c00-4981-a46d-de91db43f3e7';
const ok=(tag,r)=>{ console.log(tag,r.status,J(r.json,220)); return r.json; };
export async function loc(s){ await post(s,'/api/iam/change-location',{workplace_id:WP,workplace_timezone:'America/Edmonton'}); }
export async function customer(s,name){
  const c=ok('cust',await post(s,'/api/customers/create',{name})); const company_id=c.data?.company_id||c.data?.id;
  const ct=ok('contact',await post(s,'/api/contacts/create',{company_id,first_name:'ZZ',last_name:name.slice(-6)})); const contact_id=ct.data?.contact_id;
  const v=ok('vehicle',await post(s,'/api/vehicles/create',{company_id,customer_id:contact_id,unit:'ZZ'+Date.now()%100000,vin:'ZZVIN'+Date.now()%1000000000})); const vehicle_id=v.data?.vehicle_id||v.data?.id;
  return {company_id,contact_id,vehicle_id};
}
export async function wo(s,c){
  const w=ok('wo',await post(s,'/api/work-orders/create',{company_id:c.company_id,vehicle_id:c.vehicle_id,workplace_id:WP,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true,mileage:1000}));
  const work_order_id=w.data?.work_order_id;
  ok('contact->wo',await post(s,'/api/work-orders/change-contact',{work_order_id,vehicle_id:c.vehicle_id,contact_id:c.contact_id,update_vehicle:true}));
  const l=ok('line',await post(s,`/api/work-orders/${work_order_id}/lines/create-from-canned-line`,{canned_line_id:CANNED,status:'authorized'}));
  return {work_order_id, line: l.data};
}
export async function invoiced(s,name){
  const c=await customer(s,name); const w=await wo(s,c); const p=s.page;
  const lines=await s.api('/api/work-orders/lines/'+w.work_order_id); const line_id=lines.json.data.collection[0].line_id;
  ok('complete',await post(s,'/api/work-orders/lines/change-status',{line_id,work_order_id:w.work_order_id,status:'complete'}));
  await s.go('/workorders/'+w.work_order_id+'/lines'); await p.waitForTimeout(3000);
  await p.locator('[data-test-id="button_mark_reviewed"]').click(); await p.waitForTimeout(2500);
  const inv=ok('invoice',await post(s,'/api/invoices/create',{work_order_id:w.work_order_id}));
  return {...c,work_order_id:w.work_order_id,line_id,invoice_id:inv.json?.data?.invoice_id,customer_account_id:inv.json?.data?.customer_account_id};
}
export async function payUI(s,A,ref,extra=0){
  const p=s.page; await s.go('/workorders/'+A.work_order_id+'/finance'); await p.waitForTimeout(3500);
  await p.locator('[data-test-id="button_new_payment"]').click(); await p.waitForTimeout(2000);
  await p.locator('[data-test-id="select_payment_method"]').click(); await p.waitForTimeout(800);
  console.log('methods',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()))));
  const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()));
  await p.locator('.q-menu .q-item').nth(items.findIndex(t=>/^(cheque|check)$/i.test(t))).click(); await p.waitForTimeout(500);
  let full=null; p.on('request',r=>{ if(/create-customer-payment/.test(r.url())) full=r.postData(); });
  await p.locator('[data-test-id="input_reference_number"]').fill(ref);
  if(extra){ await p.locator('[data-test-id="input_manually_entered_credit"]').fill(String(extra)); await p.keyboard.press('Tab'); await p.waitForTimeout(800); }
  const n=s.writes.length; await p.locator('[data-test-id="button_make_payment"]').click(); await p.waitForTimeout(3500);
  const w=s.writes.slice(n).filter(x=>/customer-account|payment/.test(x)); console.log('pay',w.join(' || ').slice(0,300)); console.log('payfull',full); return w;
}
export async function reversePaymentUI(s,A){
  const p=s.page; await s.go('/customers/'+A.company_id+'/payments'); await p.waitForTimeout(3500);
  const n=s.writes.length; await p.locator('[data-test-id^="button_remove_payment_"]').first().click(); await p.waitForTimeout(1500);
  await s.confirm('button_confirm_dialog'); await p.waitForTimeout(1500);
  console.log('revpay',s.writes.slice(n).filter(x=>/customer-account/.test(x)).join(' || ').slice(0,200));
}
export async function reverseInvoiceUI(s,A){
  const p=s.page; await s.go('/workorders/'+A.work_order_id+'/finance'); await p.waitForTimeout(3500);
  await p.locator('[data-test-id="button_wo_invoice_menu"]').click(); await p.waitForTimeout(1000);
  await p.locator('[data-test-id="menu_item_reverse"]').click(); await p.waitForTimeout(1500);
  const n=s.writes.length; await s.confirm('button_confirm_reverse_invoice'); await p.waitForTimeout(2000);
  console.log('revinv',s.writes.slice(n).filter(x=>/invoices/.test(x)).join(' || ').slice(0,200));
}
export async function deposit(s,A,amount=50){
  const r=ok('deposit',await post(s,'/api/deposits',{work_order_id:A.work_order_id,amount,payment_method:'CASH',deposit_date:new Date().toISOString().slice(0,10),memo:'ZZ9055'}));
  return r.json?.data?.id;
}
export async function reverseDeposit(s,id){ return ok('revdep',await post(s,`/api/deposits/${id}/reverse`,{})); }
