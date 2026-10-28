import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const S=JSON.parse(fs.readFileSync(`/tmp/s10928/seed-${env}.json`,'utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa21'),user:'bilal.muzamil@shopview.com'});
const post=(p,b)=>s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const c2=await post('/api/customers/create',{name:'ZZAUTOTEST SV10928 Empty '+env}); console.log('customer2',c2.status,JSON.stringify(c2.json));
fs.writeFileSync(`/tmp/s10928/seed-${env}.json`,JSON.stringify(Object.assign(S,{cid2:c2.json?.data?.company_id})));
await s.close();
