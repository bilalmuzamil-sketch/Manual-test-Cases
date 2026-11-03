// usage: ENV node paid.mjs <tag>  env CUST, CANNED -> WO with a priced line, invoice, then pay it ON SCREEN (Finance tab payment dialog)
import {sess,post,arr} from './common.mjs'; import fs from 'fs';
const TAG=process.argv[2]; const OUT=`ev/${TAG}`; fs.mkdirSync(OUT,{recursive:true}); const s=await sess(); const p=s.page; const R={marker:await s.marker()};
const caps=[]; p.on('response',async r=>{const q=r.request(); if(q.method()!=='GET'&&r.url().includes('/api/')&&!/touch|sentry|collect/.test(r.url())){let b='';try{b=(await r.text()).slice(0,300)}catch{} caps.push(q.method()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+r.status()+' '+(q.postData()||'').slice(0,300)+' -> '+b);}});
const C=process.env.CUST; const veh=arr((await s.api('/api/vehicles?company_id='+C)).json?.data)[0]; const today=new Date().toISOString().slice(0,10);
const WO=(await post(s,'/api/work-orders/create',{company_id:C,vehicle_id:veh.id,start_date:today,is_vehicle_here:true})).j.data.work_order_id; R.wo=WO;
const ct=await post(s,'/api/contacts/create',{company_id:C,first_name:'ZZAUTOTEST',last_name:'SV11986 '+TAG}); await post(s,'/api/work-orders/change-contact',{work_order_id:WO,vehicle_id:veh.id,contact_id:ct.j.data.contact_id,update_vehicle:true});
await post(s,'/api/work-orders/change-mileage',{work_order_id:WO,mileage:'123456'});
const L=await post(s,`/api/work-orders/${WO}/lines/create-from-canned-line`,{canned_line_id:process.env.CANNED,status:'authorized'}); const lid=L.j?.data?.line_id;
await post(s,'/api/work-orders/lines/change-story',{line_id:lid,tech_story:'ZZAUTOTEST SV-11986',work_order_id:WO}); await post(s,'/api/work-orders/lines/change-status',{line_id:lid,status:'complete'});
R.complete=(await post(s,'/api/work-orders/change-status',{id:WO,status:'complete'})).t; R.invoice=(await post(s,'/api/invoices/create',{work_order_id:WO})).t;
await s.go(`/workorders/${WO}/finance`); await p.waitForTimeout(7000);
R.payBtns=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent&&/pay/i.test(e.getAttribute('data-test-id')+e.innerText)).map(e=>e.getAttribute('data-test-id')+':'+e.innerText.trim().slice(0,30)));
const b=p.locator('[data-test-id*="payment"]:visible, button:has-text("Make Payment"):visible, button:has-text("Receive Payment"):visible').first(); R.btnCount=await b.count();
if(R.btnCount){ await b.click(); await p.waitForTimeout(2000); await p.screenshot({path:`${OUT}/pay-dialog.png`});
  R.dialog=await p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); return d?{t:d.innerText.replace(/\s+/g,' ').slice(0,500),ids:[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))}:null;});
  const pm=p.locator('.q-dialog [data-test-id*="payment_method"]').first(); if(await pm.count()){ await pm.click(); await p.waitForTimeout(900); R.methods=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(i=>i.innerText.trim()).slice(0,6)); const cash=p.locator('.q-menu .q-item',{hasText:/^\s*Cash\s*$/}).first(); if(await cash.count()) await cash.click(); else await p.locator('.q-menu .q-item').first().click(); await p.waitForTimeout(600); }
  R.filled=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog input')].map(i=>(i.closest('[data-test-id]')?.getAttribute('data-test-id')||'')+'='+i.value));
  await p.screenshot({path:`${OUT}/pay-dialog-filled.png`}); await p.locator('.q-dialog [data-test-id="button_make_payment"]').click(); await p.waitForTimeout(3500);
  R.after=await p.evaluate(()=>({dlg:[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,200)),toast:[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' '))})); }
const v=(await s.api('/api/work-orders/view/'+WO)).json?.data; const w=v?.work_order||v; R.state=[w?.status,w?.invoice_status,w?.total_cost,w?.amount_paid,w?.display_number];
fs.writeFileSync(`${OUT}/result.json`,JSON.stringify({...R,caps},null,1)); console.log(JSON.stringify({...R,caps},null,1).slice(0,3500)); await s.close(); process.exit(0);
