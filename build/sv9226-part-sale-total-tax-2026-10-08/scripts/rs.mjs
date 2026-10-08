// node rs.mjs create | swap <roleId> | restore | deleterole <roleId>
import {ob,j} from './lib.mjs'; import fs from 'fs';
const [mode,arg]=process.argv.slice(2); const s=await ob({vp:{width:1600,height:1000}}); const H={method:'POST',headers:{'Content-Type':'application/json'}};
const TECH='ba74948b-5777-4f0c-90fb-2f60d9ce8107';
const tech=async()=>((await s.api('/api/staff?limit=300&search=Tech')).json?.data?.collection||[]).find(x=>x.id===TECH);
if(mode==='create'){ const body={name:'ZZAUTOTEST SV-9226 no financial data',description:'QA test role: part sales view without See Financial Data',fePermissions:['27d35438-3fec-4ee9-bd9e-fa9f6e695670','55f5cb14-34bd-4999-95a1-0168497466e1','c750f752-e6d2-48f2-978e-99a1ac27b11c'],viewMode:'full',crossToggles:{seeFinancialData:false,seeApArData:false,viewHistoryLogs:false},organization:'d55bc308-e61a-438d-b5f1-c7a73c89d49f'};
  const r=await s.api('/api/roles',{...H,body:JSON.stringify(body)}); console.log('create',r.status,j(r.json,300)); }
if(mode==='swap'){ const t=await tech(); if(!fs.existsSync('tech-orig.json')) fs.writeFileSync('tech-orig.json',JSON.stringify(t)); const o=JSON.parse(fs.readFileSync('tech-orig.json'));
  const body={first_name:t.first_name,last_name:t.last_name,email:t.email,role_id:arg,workplace_id:t.workplace_id,job_title:t.job_title,salary_type:t.salary_type,salary:t.salary,billable:t.billable,clockable:t.clockable};
  const r=await s.api(`/api/staff/${t.staff_id}/change`,{...H,body:JSON.stringify(body)}); const t2=await tech(); console.log('swap',r.status,'orig role',o.role_label,o.role_id,'now',t2.role_label,t2.role_id,'email',t.email); }
if(mode==='restore'){ const o=JSON.parse(fs.readFileSync('tech-orig.json')); const t=await tech();
  const body={first_name:t.first_name,last_name:t.last_name,email:t.email,role_id:o.role_id,workplace_id:t.workplace_id,job_title:t.job_title,salary_type:t.salary_type,salary:t.salary,billable:t.billable,clockable:t.clockable};
  const r=await s.api(`/api/staff/${t.staff_id}/change`,{...H,body:JSON.stringify(body)}); const t2=await tech(); console.log('restore',r.status,'now',t2.role_label,t2.role_id,'equal',t2.role_id===o.role_id); }
if(mode==='deleterole'){ const r=await s.api('/api/roles/'+arg,{method:'DELETE'}); console.log('delete',r.status,j(r.json,200)); const g=await s.api('/api/roles/'+arg); console.log('re-read',g.status); }
await s.close();
