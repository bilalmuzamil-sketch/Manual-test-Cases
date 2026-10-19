// probe: does work-order create accept a lead? and what does the Create Work Order dialog offer?
import {session} from './rec.mjs';
const s=await session({vp:{width:1440,height:900}}); const p=s.page; const J={method:'POST',headers:{'Content-Type':'application/json'}}; const VIC='52710080-789b-4f43-a9a4-27c331a2912a';
const out={};
for(const f of ['tech_assigned_id','technician_id','lead_technician_id']){ const body={company_id:'9155093b-a433-4320-80aa-71108917cb1f',vehicle_id:'d2271ca9-4b01-4e6a-9089-22fbab30bd56',workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',start_date:new Date().toISOString().slice(0,19).replace('T',' '),is_vehicle_here:true}; body[f]=VIC;
 const c=await s.api('/api/work-orders/create',{...J,body:JSON.stringify(body)}); const id=c.json?.data?.work_order_id; let lead=null; if(id){ const w=(await s.api('/api/work-orders/view/'+id)).json.data; const W=w.work_order||w; lead=W.tech_assigned_id||W.techAssignedId||JSON.stringify(W.tech_assigned||'').slice(0,60); out[f]={st:c.status,id,number:W.number,lead}; if(lead!==VIC){ await s.api('/api/work-orders/delete',{...J,body:JSON.stringify({work_order_id:id})}); out[f].deleted=true; } } else out[f]={st:c.status,b:JSON.stringify(c.json).slice(0,150)}; }
console.log(JSON.stringify(out));
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000); const btn=await p.$('[data-test-id=button_create_work_order], button:has-text("Create Work Order")'); const bb=await btn.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.dataset.testId+':'+(e.innerText||'').replace(/\s+/g,' ').slice(0,30)))));
await p.screenshot({path:'/tmp/qa11310/ex20/create-dialog.png'}); await s.close();
