import {session,toView} from './rec.mjs'; import fs from 'fs';
const view=process.argv[2]||'board_view'; const tag=process.argv[3]||view;
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={view,mk:await s.marker(),log:[]};
const J=async(u,b)=>{const r=await s.api(u,b?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}:undefined); out.log.push([u,r.status,JSON.stringify(r.json).slice(0,160)]); return r;};
const OWN=['display','tab','density','collapsedGroups','filters']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const SRC='75e04715-a3d6-4053-aa0c-33f6d1042cbf';
// seed a fresh Approved WO (no lead)
const w0=(await J('/api/work-orders/view/'+SRC)).json.data.work_order; const now=new Date().toISOString().slice(0,19).replace('T',' ');
const woId=(await J('/api/work-orders/create',{company_id:w0.company_id,customer_id:w0.customer_id,vehicle_id:w0.vehicle_id||w0.vehicle?.id,workplace_id:w0.workplace_id,start_date:now,is_vehicle_here:true})).json.data.work_order_id;
const lineId=(await J(`/api/work-orders/${woId}/lines/create-from-canned-line`,{canned_line_id:'350abe94-ae17-4531-bbd3-7c31d2a9dfd2',status:'authorized'})).json.data.line_id;
const num=(await J('/api/work-orders/view/'+woId)).json.data.work_order.display_number; out.woId=woId; out.num=num; console.log('seeded',num,woId);
const SEL=view==='tech_view'?'[data-test-id^=tech_view_row_]':'.board-card';
const item=()=>p.evaluate(({num,SEL})=>{const c=[...document.querySelectorAll(SEL)].find(e=>/^(tech_view_row_[0-9a-f-]{36}|board_card_[0-9a-f-]{36})$/.test(e.dataset.testId||'')&&e.innerText.includes(num)); if(!c) return null; const r=c.getBoundingClientRect(); const col=c.closest('.board-column__panel,[data-test-id^=board_column_]'); const badge=[...c.querySelectorAll('.q-badge')].map(b=>b.innerText.trim()).filter(Boolean); return {x:r.x,y:r.y,w:r.width,h:r.height,badge,lock:!!c.querySelector('[data-test-id$=_lock]'),col:col?(col.querySelector('[data-test-id^=board_column_header_]')||col).innerText.replace(/\s+/g,' ').slice(0,30):null,text:c.innerText.replace(/\s+/g,' ').slice(0,120)};},{num,SEL});
const targets=()=>p.evaluate((view)=>{ if(view==='tech_view'){ return [...document.querySelectorAll('[data-test-id^=tech_view_group_name_]')].map(h=>{const r=h.getBoundingClientRect(); return {name:h.innerText.replace(/\s+/g,' ').slice(0,30),x:700,y:r.y+r.height/2+34};}).filter(t=>t.y>150&&t.y<860); }
 return [...document.querySelectorAll('.board-column__panel')].map(c=>{const r=c.getBoundingClientRect(); const h=c.querySelector('[data-test-id^=board_column_header_]'); return {name:(h?h.innerText:'').replace(/\s+/g,' ').slice(0,30),x:r.x+r.width/2,y:r.y+200,l:r.x};}).filter(t=>t.l>=0&&t.x<1420);},view);
const notes=()=>p.evaluate(()=>[...document.querySelectorAll('.q-notification,.q-notifications__list .q-notification, [role=alert]')].map(n=>n.innerText.replace(/\s+/g,' ').trim()).filter(Boolean));
const drag=async(to)=>{ const c=await item(); const fx=c.x+c.w/2, fy=c.y+Math.min(30,c.h/2); await p.mouse.move(fx,fy,{steps:8}); await p.waitForTimeout(300); await p.mouse.down(); for(let i=1;i<=30;i++){ await p.mouse.move(fx+(to.x-fx)*i/30,fy+(to.y-fy)*i/30); await p.waitForTimeout(40);} await p.waitForTimeout(800); const mid={notes:await notes()}; await p.mouse.up(); return mid; };
try{
 await s.go(`/workorders?tab=all&search=${num}`); await p.waitForTimeout(4000); await toView(p,view); await p.waitForTimeout(3500);
 if(view==='tech_view' && await p.$('[data-test-id=tech_view_group_empty_unassigned]')===null && !(await item())){ await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(2500); }
 out.start=await item(); out.targets=await targets(); console.log('start',JSON.stringify(out.start)); console.log('targets',JSON.stringify(out.targets.map(t=>t.name)));
 const techs=out.targets.filter(t=>!/Unassigned/.test(t.name));
 const d1=await drag(techs[0]); await p.waitForTimeout(3000); out.afterAssign={item:await item(),notes:await notes(),mid:d1}; console.log('after assign',JSON.stringify(out.afterAssign));
 out.leadApi=(await J('/api/work-orders/view/'+woId)).json.data.work_order.tech_assigned_id; console.log('lead via API',out.leadApi);
 await p.screenshot({path:`ex54/${tag}-1-assigned.png`});
 // "tab B": another tab changes the status to Invoiced (page A is not reloaded)
 const pB=await p.context().newPage(); out.tabB=pB.url();
 await J('/api/work-orders/change-mileage',{work_order_id:woId,mileage:'123456'});
 await J('/api/work-orders/lines/change-story',{line_id:lineId,tech_story:'ZZAUTOTEST SV-11454',work_order_id:woId});
 await J('/api/work-orders/lines/change-status',{line_id:lineId,status:'complete',workOrderId:woId});
 await J('/api/work-orders/change-status',{id:woId,status:'complete'});
 const inv=(await J('/api/invoices/create',{work_order_id:woId})).json.data||{};
 if(process.env.PAID){ const acc=inv.customer_account_id; const ut=(await J(`/api/customer-account/list-unpaid-transaction?accountId=${acc}&pagination[rowsPerPage]=1000`)).json.data.response.collection; const row=ut.find(t=>JSON.stringify(t).includes(inv.invoice_id||'zz'))||ut.find(t=>JSON.stringify(t).includes(num.replace('S2-','')));
  const amt=row&&(row.balance??row.total_balance??row.amount_due??row.remaining_balance); out.payRow=row&&Object.fromEntries(Object.entries(row).slice(0,14));
  const pay=await J('/api/customer-account/create-customer-payment',{account_id:acc,payment_date:new Date().toISOString(),payment_method:'CASH',reference_number:null,description:'ZZAUTOTEST SV-11454',transactions:[{...row,transaction_payment_amount:amt,index:0}],primary_id:null,new_credit:0,new_deposit:0,applied_credits:[],applied_deposits:[],ibs_batch_id:null,payment_amount:amt}); console.log('pay',pay.status,'amount',amt,JSON.stringify(out.payRow).slice(0,300)); }
 out.statusApi=(await J('/api/work-orders/view/'+woId)).json.data.work_order.status; console.log('status via API',out.statusApi); await pB.close();
 await p.waitForTimeout(1500); out.beforeMove=await item(); console.log('page A before move (no reload)',JSON.stringify(out.beforeMove)); await p.screenshot({path:`ex54/${tag}-2-before-move.png`});
 const tg=(await targets()).filter(t=>!/Unassigned/.test(t.name)&&t.name!==out.afterAssign.item?.col&&t.name!==techs[0].name); out.target=tg[0];
 const d2=await drag(tg[0]); out.midDrag=d2; await p.waitForTimeout(1500); out.after1=await item(); out.notes1=await notes(); await p.screenshot({path:`ex54/${tag}-3-refused.png`});
 console.log('mid-drag notes',JSON.stringify(d2.notes)); console.log('after refused move',JSON.stringify(out.after1),'notes',JSON.stringify(out.notes1));
 await p.waitForTimeout(12000); out.after15=await item(); out.notes15=await notes(); await p.screenshot({path:`ex54/${tag}-4-after-15s.png`}); console.log('15 s later',JSON.stringify(out.after15));
 out.leadEnd=(await J('/api/work-orders/view/'+woId)).json.data.work_order.tech_assigned_id; console.log('lead unchanged',out.leadEnd===out.leadApi);
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const vv={...cur}; for(const k of OWN) vv[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:vv})});
out.restored=JSON.stringify(await getP())===JSON.stringify(prefs0); out.mkEnd=await s.marker(); fs.writeFileSync(`ex54/${tag}.json`,JSON.stringify(out,null,1)); await s.close(); console.log('restored',out.restored,out.mkEnd.version);
for(const l of out.log) if(l[1]>=300) console.log('API',l.join(' '));
