// seeds: a customer with NO contacts (+ an asset with a Type, + a work order) — ZZAUTOTEST
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa21'),user:'bilal.muzamil@shopview.com'});
const post=(p,b)=>s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const show=(k,r)=>console.log(k,r.status,JSON.stringify(r.json||r.text).slice(0,260));
const c=await post('/api/customers/create',{name:'ZZAUTOTEST SV10928 No Contacts '+env}); show('customer',c);
const cid=c.json?.data?.id||c.json?.data?.company_id||c.json?.id;
const v1=await post('/api/vehicles/create',{company_id:cid,unit:'Z10928'}); show('vehicle-no-contact',v1);
for(const p of ['/api/vehicle-types','/api/vehicles/types','/api/vehicle-types/list','/api/organizations/vehicle-types']){ const r=await s.api(p); show('types '+p,r); }
const me=await s.api('/api/staff/my-workplaces'); show('wp',me);
fs.writeFileSync(`/tmp/s10928/seed-${env}.json`,JSON.stringify({cid,c:c.json,v1:v1.json,wp:me.json}));
await s.close();
