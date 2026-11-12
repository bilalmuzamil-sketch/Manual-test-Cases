import {sess} from './common.mjs';
const s=await sess({dir:'/tmp/qa75'}); const p=s.page; await s.go('/reports/ar-aging-collection'); await p.waitForTimeout(4000);
const g=async u=>p.evaluate(async u=>{const r=await fetch(u,{credentials:'include'}); return r.json().catch(()=>null)},s.host.api+u);
const rl=await g('/api/organizations/d55bc308-e61a-438d-b5f1-c7a73c89d49f/roles'); const roles=(rl.data?.roles||rl.data||rl); console.log('n roles',roles.length, Object.keys(roles[0]||{}).join(','));
for(const r of roles){ const d=await g('/api/roles/'+r.id); const perms=JSON.stringify(d).match(/"(code|key|name)":"[a-zA-Z]+"/g)||[]; const codes=[...new Set((JSON.stringify(d).match(/"[a-z][A-Za-z]+":true/g)||[]).map(x=>x.slice(1,x.indexOf('"',1))))];
  const rep=codes.filter(c=>/report/i.test(c)); const ap=codes.filter(c=>/ap|ar/i.test(c)&&/manage|apAr|ApAr/i.test(c)); console.log(r.name||r.label,'|',r.id,'| reports:',rep.join(','),'| ap/ar:',ap.join(','),'| staff:',r.staffCount??r.users_count??''); }
await s.close(); process.exit(0);
