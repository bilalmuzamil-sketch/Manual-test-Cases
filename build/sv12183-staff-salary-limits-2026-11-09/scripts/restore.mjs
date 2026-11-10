import {sess,j,post} from './common.mjs';
const s=await sess(); const SID='3d2a9387-643f-463d-a1a5-6e10d061a7a4';
const pick=async()=>(((await s.api('/api/staff?pagination[rowsPerPage]=500')).json?.data?.collection)||[]).find(x=>x.email==='bilal.muzamil@shopview.com');
const me=await pick(); console.log('now',j({salary:me.salary,t:me.salary_type,bill:me.billable,clock:me.clockable,job:me.job_title,role:me.role_label}));
const body={first_name:me.first_name,last_name:me.last_name,email:me.email,role_id:'2a43e6cb-34ab-4475-bd02-242361a725f5',workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',job_title:me.job_title,salary_type:null,salary:null,billable:me.billable,clockable:me.clockable,is_sales_rep:me.is_sales_rep};
const r=await post(s,`/api/staff/${SID}/change`,body); console.log('change',r.status,j(r.json));
const a=await pick(); console.log('after',j({salary:a.salary,t:a.salary_type,bill:a.billable,clock:a.clockable,role:a.role_label}));
await s.close(); process.exit(0);
