// node enter.mjs -> SV-12187 matrix: seed a WO + 1 line, open its Lines page, + Add Part, fill the inline row, press Enter in FIELD (or none = click Save). Records the part-save request, toasts, whether a new empty row opens and where focus is. ../ev/<env>-enter.json + shots
import {sess,post} from './common.mjs'; import fs from 'fs';
const E=process.env.ENV==='prod'?'prod':'branch'; const s=await sess(); const p=s.page; const arr=x=>Array.isArray(x)?x:(x?.collection||x?.items||[]);
const R={build:await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content),rows:[]};
await s.go('/workorders'); await p.waitForTimeout(2000);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const W=E==='prod'?ws.find(w=>/Trucks Hill 2/.test(w.name))||ws[0]:ws.find(w=>w.id.startsWith('b3c8c820'));
await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone||'America/Edmonton'});
const nm='ZZAUTOTEST SV12187 '+Date.now().toString().slice(-5);
const co=(await post(s,'/api/customers/create',{name:nm})).json?.data; const company=co?.company_id||co?.id;
const ct=(await post(s,'/api/contacts/create',{company_id:company,first_name:'ZZ',last_name:'T12187',email:`zz12187${Date.now()%100000}@example.com`})).json?.data; const contact=ct?.contact_id||ct?.id;
const vh=(await post(s,'/api/vehicles/create',{company_id:company,customer_id:contact,unit:'ZZ12187'})).json?.data; const vehicle=vh?.vehicle_id||vh?.id;
const wo=(await post(s,'/api/work-orders/create',{company_id:company,customer_id:contact,vehicle_id:vehicle,workplace_id:W.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true})).json?.data?.work_order_id;
const all=arr((await s.api('/api/work-orders/canned-lines')).json?.data); const can=all.find(x=>Number(x.total_parts)===0&&(!x.workplace_id||x.workplace_id===W.id));
const ln=await post(s,'/api/work-orders/'+wo+'/lines/create-from-canned-line',{canned_line_id:can.id,status:'authorized'}); console.log('wo',wo,'line',ln.status,'workplace',W.name);
R.wo=wo; R.customer=nm; R.workplace=W.name;
const reqs=[]; p.on('request',r=>{ if(/\/api\/work-orders\/part/.test(r.url())&&r.method()==='POST') reqs.push(r.url().replace(/^https:\/\/[^/]+/,'')); });
const FIELDS=(process.env.FIELDS||'qty,description,cost,sell,partnumber,save').split(',');
const sel={partnumber:'select_inline_part_number',description:'input_inline_part_description',qty:'input_inline_part_quantity',cost:'input_inline_part_cost',sell:'input_inline_part_sell_price'};
let i=0;
for(const F of FIELDS){ i++; await s.go('/workorders/'+wo+'/lines'); await p.waitForTimeout(3500);
  const before=(await s.api('/api/work-orders/lines/'+wo)).json; const cnt=x=>JSON.stringify(x).split('"part_request_id"').length+JSON.stringify(x).split('"part_number"').length;
  await p.locator('[data-test-id=button_add_part]').first().click(); await p.waitForTimeout(1200);
  const pn='ZZ12187-'+F.toUpperCase()+'-'+i;
  const pnIn=p.locator(`[data-test-id=${sel.partnumber}]`).last(); await pnIn.click(); await p.keyboard.type(pn,{delay:20}); await p.waitForTimeout(800);
  await p.keyboard.press('Tab'); await p.waitForTimeout(400);
  const focus1=await p.evaluate(()=>document.activeElement?.getAttribute('data-test-id')||document.activeElement?.closest('[data-test-id]')?.getAttribute('data-test-id'));
  await p.locator(`[data-test-id=${sel.description}]`).last().fill('ZZ desc '+F); await p.locator(`[data-test-id=${sel.qty}]`).last().fill('1');
  if(F==='cost'||F==='sell'){ await p.locator(`[data-test-id=${sel.cost}]`).last().fill('5').catch(()=>{}); await p.locator(`[data-test-id=${sel.sell}]`).last().fill('9').catch(()=>{}); }
  const hint=await p.evaluate(()=>{ const t=document.body.innerText.match(/[^\n]*Enter[^\n]*/g); return t?t.slice(0,4):[]; });
  reqs.length=0; await p.evaluate(()=>document.querySelectorAll('.q-notification').forEach(n=>n.remove()));
  if(F==='save'){ await p.locator('[data-test-id=button_save_inline_part]').last().click(); }
  else if(F==='partnumber'){ await pnIn.click(); await p.keyboard.press('End'); await p.keyboard.press('Enter'); }
  else { await p.locator(`[data-test-id=${sel[F]}]`).last().click(); await p.keyboard.press('End'); await p.keyboard.press('Enter'); }
  await p.waitForTimeout(2500);
  const toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')));
  const focus=await p.evaluate(()=>{const a=document.activeElement; return (a?.getAttribute('data-test-id')||a?.closest('[data-test-id]')?.getAttribute('data-test-id'))+' value="'+(a?.value||'')+'"';});
  const rowsOpen=await p.locator(`[data-test-id=${sel.qty}]`).count();
  const after=(await s.api('/api/work-orders/lines/'+wo)).json; const saved=JSON.stringify(after).includes(pn);
  await p.screenshot({path:`../ev/${E}-enter-${F}.png`});
  const row={field:F,pn,requests:[...reqs],toasts,savedOnServer:saved,inlineRowsOpenAfter:rowsOpen,focusAfter:focus,focusAfterTabFromPartNo:focus1,hint}; R.rows.push(row); console.log(JSON.stringify(row).slice(0,600)); }
fs.writeFileSync(`../ev/${E}-enter.json`,JSON.stringify(R,null,1)); await s.close(); process.exit(0);
