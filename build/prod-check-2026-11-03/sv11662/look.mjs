import {prod1,post,arr} from '../common.mjs'; import fs from 'fs'; const s=await prod1('/tmp/qa75'); const p=s.page; const R={marker:await s.marker()};
const C='bd77eaa6-963f-43fc-9a91-b950810ebf67';
const cts=(await s.api('/api/contacts?company_id='+C)).json?.data; R.contacts=JSON.stringify(arr(cts).map(c=>[c.id,c.first_name,c.last_name,c.email,c.customer_portal_access??c.has_portal_access??c.portal_access])).slice(0,800);
const veh=arr((await s.api('/api/vehicles?company_id='+C)).json?.data)[0];
const WO=(await post(s,'/api/work-orders/create',{company_id:C,vehicle_id:veh.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true})).j.data.work_order_id; R.wo=WO;
for(const a of (((await s.api('/api/work-orders/view/'+WO)).json?.data?.work_order||{}).adjustments||[])) await post(s,'/api/work-orders/adjustments/remove',{adjustmentId:a.id,workOrderId:WO});
const cl=arr((await s.api('/api/work-orders/canned-lines')).json?.data); const can=cl.find(c=>/Test Canned line/.test(c.canned_line_name))||cl[0];
R.line=(await post(s,`/api/work-orders/${WO}/lines/create-from-canned-line`,{canned_line_id:can.id,status:'authorization_required'})).t;
const v=(await s.api('/api/work-orders/view/'+WO)).json?.data?.work_order||{}; R.woContact=[v.contact_id,v.customer_id,v.display_number];
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(6000); for(let i=0;i<2;i++){ const x=p.locator('.q-dialog [data-test-id="button_close_dialog"]').first(); if(await x.count()){await x.click(); await p.waitForTimeout(700);} }
R.ids=(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+':'+e.innerText.trim().slice(0,25).replace(/\n/g,' ')).filter(x=>/portal|send|approval|status/i.test(x)))).join(' | ');
await p.screenshot({path:'sv11662/00-lines.png'}); fs.writeFileSync('sv11662/look.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1)); await s.close(); process.exit(0);
