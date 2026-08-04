import { login, api } from './qa8582.mjs';
const p=(n,r,l=300)=>console.log('#',n,r.status,(typeof r.body==='string'?r.body:JSON.stringify(r.body)).slice(0,l));
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a', LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
const TRAIN='2b0120bb-edd5-4ade-b78f-3058b805dac0';
async function asUser(uid){ const t=await login('admin'); const S=t.sessCookie; const r=await api(S,'POST','/api/switch-user',{user_id:uid}); if(r.status!==200) throw new Error('switch fail '+r.status); return S; }
async function clock(S,wp,dept){ await api(S,'POST','/api/iam/change-location',{workplace_id:wp,workplace_timezone:'America/Edmonton'});
  const ci=await api(S,'POST','/api/technician-tasks/department-clock-in',{department_id:dept}); return ci; }
async function clockOut(S,taskId,desc){ for (const b of [{task_id:taskId,description:desc},{taskId,description:desc}]){ const r=await api(S,'POST','/api/technician-tasks/department-clock-out',b); if(r.status<300) return r; console.log('  clockout try',JSON.stringify(Object.keys(b)),r.status,JSON.stringify(r.body).slice(0,200)); } return {status:'FAIL'}; }
// Tech B: Wesley Mcclure at Lethbridge -> closed record
let S=await asUser('24b124f5-c0f9-46bb-aae7-d5a5dc4580a1');
let r=await clock(S,LE,TRAIN); p('B clock-in LE', r, 300);
if(r.status===201){ await new Promise(z=>setTimeout(z,20000)); p('B clock-out', await clockOut(S, r.body.data.technician_task_id, 'ZZAUTOTEST internal LE')); }
// Tech C: Christopher Smith at HD then LE -> Multiple
S=await asUser('2d36a5f5-c957-45e0-a376-46d24df2a44c');
r=await clock(S,HD,TRAIN); p('C clock-in HD', r,300);
if(r.status===201){ await new Promise(z=>setTimeout(z,20000)); p('C clock-out HD', await clockOut(S, r.body.data.technician_task_id,'ZZAUTOTEST internal HD')); }
r=await clock(S,LE,TRAIN); p('C clock-in LE', r,300);
if(r.status===201){ await new Promise(z=>setTimeout(z,20000)); p('C clock-out LE', await clockOut(S, r.body.data.technician_task_id,'ZZAUTOTEST internal LE')); }
