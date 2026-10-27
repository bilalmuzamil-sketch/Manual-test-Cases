import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const M=JSON.parse(fs.readFileSync('../data/matrix-staging.json'));
const s=await open({env:'staging',ticket:'11565',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1400,height:900}});
const J=(p,b)=>s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); const out=[];
const rec=(tag,r)=>{const b=r.json??r.text; console.log(`${tag} -> ${r.status} ${JSON.stringify(b).slice(0,140)}`); out.push({tag,status:r.status,body:b});};
const ver=await (await fetch('https://app.staging.shopview.com/')).text().catch(()=>''); 
const depts=(await s.api('/api/departments')).json.data.collection; const delGone=!depts.some(d=>d.id===M.deleted_dept); console.log('staging deleted dept gone',delGone);
const w2=await s.api('/api/work-orders/view/'+M.W2.w); console.log('staging W2 view',w2.status);
const staff=(await s.api('/api/staff?limit=300')).json; const arr=Object.values(staff.data||{}).find(Array.isArray)||[]; console.log('staff keys',Object.keys(staff.data||{}),arr.length, JSON.stringify(arr[0]||{}).slice(0,200)); const adm=arr.find(x=>/^zz./i.test(x.email||'')); console.log('using',adm?.first_name,adm?.last_name,adm?.email); console.log('admin staff',adm?.id);
const ct=(await s.api('/api/technician-tasks/my-current-task')).json?.data?.technician_task; console.log('admin current task',ct?.label,ct?.start_date,ct?.staff_id); const ADM={id:ct?.staff_id}; if(!ADM.id)process.exit(0);
const U='11111111-2222-4333-8444-555555555555'; const base=t=>({start_date:`26/10/2026 ${t}`,end_date:`26/10/2026 ${t.replace(/0$/,'5')}`,tech_assigned_id:ADM.id,resolve_overlaps:true});
rec('C1 create, unknown department',await J('/api/technician-tasks/create',{...base('11:30'),department_id:U}));
if(delGone) rec('C2 create, deleted department',await J('/api/technician-tasks/create',{...base('11:40'),department_id:M.deleted_dept}));
rec('C3 create, unknown work order',await J('/api/technician-tasks/create',{...base('11:50'),work_order_id:U,line_id:M.W1.l1}));
rec('C4 create, unknown line',await J('/api/technician-tasks/create',{...base('12:00'),work_order_id:M.W1.w,line_id:U}));
if(w2.status>=400) rec('C6 create, deleted work order',await J('/api/technician-tasks/create',{...base('12:10'),work_order_id:M.W2.w,line_id:M.W2.l1}));


fs.writeFileSync('../data/k8-staging.json',JSON.stringify(out,null,1));
await s.browser.close(); process.exit(0);
