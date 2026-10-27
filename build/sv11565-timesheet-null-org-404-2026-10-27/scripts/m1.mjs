import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const ENV=process.argv[2]||'branch'; const out=[];
const s=await open({env:ENV==='branch'?'branch':'staging',ticket:'11565',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1400,height:900}});
const J=(p,b)=>s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const rec=(tag,r)=>{const line=`${tag} -> ${r.status} ${JSON.stringify(r.json??r.text).slice(0,200)}`; console.log(line); out.push({tag,status:r.status,body:r.json??r.text});};
const CFG=JSON.parse(fs.readFileSync(`../data/entry-${ENV}.json`)); const tid=CFG.id; let r=await s.api('/api/departments'); const d0=r.json.data.collection.find(d=>d.id===CFG.department_id)||r.json.data.collection[0];
const base={id:tid,start_date:CFG.start_date,end_date:CFG.end_date,tech_assigned_id:CFG.tech_assigned_id,description:CFG.description};
const U='11111111-2222-4333-8444-555555555555';
// 2 department: valid, unknown, deleted
if(ENV==='branch') rec('A valid department (normal save)',await J('/api/technician-tasks/change',{...base,department_id:d0.id}));
rec('B unknown department id',await J('/api/technician-tasks/change',{...base,department_id:U}));
r=await J('/api/organization/department/create',{name:'ZZAUTOTEST SV-11565 dept '+Date.now(),enable_time_clock:true,display_on_schedule:false,department_id:null}); rec('create dept',r); const D=r.json?.data?.department_id;
r=await J('/api/organization/department/delete',{id:D}); rec('delete dept',r);
rec('C deleted department id',await J('/api/technician-tasks/change',{...base,department_id:D}));
rec('D move to unknown department',await J('/api/technician-tasks/move',{id:tid,department_id:U}));
rec('E move to deleted department',await J('/api/technician-tasks/move',{id:tid,department_id:D}));
// 3 work order / line: valid, unknown, deleted
r=await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=40'); 
let src=null; for(const w of r.json.data.work_orders){const v=(await s.api('/api/work-orders/view/'+w.id)).json?.data?.work_order; if(v?.vehicle?.id){src=v;break;}}
const cl=((await s.api('/api/work-orders/canned-lines?limit=200')).json.data.collection||[]).filter(c=>!c.fixed_price&&c.labour_type_id&&!c.total_parts&&c.workplace_id===src.workplace_id);
const mk=async()=>{const q=await J('/api/work-orders/create',{company_id:src.company_id,customer_id:src.customer_id,vehicle_id:src.vehicle.id,workplace_id:src.workplace_id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true,type:'service'}); const w=q.json.data.work_order_id; const l1=(await J(`/api/work-orders/${w}/lines/create-from-canned-line`,{canned_line_id:cl[0].id,status:'authorized'})).json.data.line_id; const l2=(await J(`/api/work-orders/${w}/lines/create-from-canned-line`,{canned_line_id:cl[1].id,status:'authorized'})).json.data.line_id; return {w,l1,l2};};
const W1=await mk(); const W2=await mk();
if(ENV==='branch') rec('F valid work order + line (normal save)',await J('/api/technician-tasks/change',{...base,work_order_id:W1.w,line_id:W1.l1}));
rec('G unknown work order id',await J('/api/technician-tasks/change',{...base,work_order_id:U,line_id:W1.l1}));
rec('H unknown line id',await J('/api/technician-tasks/change',{...base,work_order_id:W1.w,line_id:U}));
r=await J('/api/work-orders/lines/delete-lines',{work_order_id:W1.w,lines:[W1.l2]}); rec('delete line l2',r);
rec('I deleted line id',await J('/api/technician-tasks/change',{...base,work_order_id:W1.w,line_id:W1.l2}));
r=await J('/api/work-orders/delete',{work_order_id:W2.w}); rec('delete WO W2',r);
rec('J deleted work order id',await J('/api/technician-tasks/change',{...base,work_order_id:W2.w,line_id:W2.l1}));
rec('K move to deleted line',await J('/api/technician-tasks/move',{id:tid,line_id:W2.l1,work_order_id:W2.w}));
fs.writeFileSync(`../data/matrix-${ENV}.json`,JSON.stringify({ENV,tid,dept:d0.id,deleted_dept:D,W1,W2,out},null,1));
await s.browser.close(); process.exit(0);
