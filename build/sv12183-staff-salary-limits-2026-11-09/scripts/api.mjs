// [ENV=prod] node api.mjs <staff_id> -> internal staff change/create with out-of-range salaries (the ticket names the API too); public API probe
import {sess,post} from './common.mjs'; const [SID]=process.argv.slice(2);
const s=await sess(); await s.go('/administration/staff'); await s.page.waitForTimeout(1500);
const L=(await s.api('/api/staff?search=SV12183')).json?.data; const me=(L?.collection||L||[]).find(x=>x.staff_id===SID);
const base={first_name:me.first_name,last_name:me.last_name,email:me.email,role_id:me.role_id,workplace_id:me.workplace_id,salary_type:'hourly',departments:(me.departments||[]).map(d=>d.id||d)};
for(const v of [-1,-0.01,10000,9999.99,0,19.99]){ const r=await post(s,`/api/staff/${SID}/change`,{...base,salary:v}); const g=(await s.api('/api/staff?search='+encodeURIComponent(me.last_name))).json?.data; const now=(g?.collection||g||[]).find(x=>x.staff_id===SID)?.salary; console.log('change hourly',v,r.status,JSON.stringify(r.json).slice(0,160),'-> stored',now); }
for(const [t,v] of [['salary',10000000],['salary',-1],['salary',9999999.99]]){ const r=await post(s,`/api/staff/${SID}/change`,{...base,salary_type:t,salary:v}); console.log('change',t,v,r.status,JSON.stringify(r.json).slice(0,160)); }
const R=Math.floor(Math.random()*90000+10000); const c=await post(s,'/api/iam/create',{first_name:'ZZAUTOTEST',last_name:'SV12183 API '+R,email:`bilal.muzamil+sv12183api${R}@shopview.com`,role_id:me.role_id,workplace_id:me.workplace_id,salary_type:'hourly',salary:-5,departments:base.departments});
console.log('create -5',c.status,JSON.stringify(c.json).slice(0,200));
for(const u of ['/api/v1/staff','/api/v1/staff/'+me.id]){ const r=await s.api(u); console.log('public',u,r.status,JSON.stringify(r.json).slice(0,160)); }
await s.close(); process.exit(0);
